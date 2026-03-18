import pika
import json
import base64
import io
from PIL import Image
from ai.model import predict_pil_image, load_yolo

RABBITMQ_URL = 'amqp://guest:guest@localhost:5672'

def process_scan_job(ch, method, properties, body):
    """Nhận job từ scan_queue, xử lý, gửi kết quả về"""
    try:
        data = json.loads(body)
        scan_id = data['scanId']
        image_b64 = data['imageBuffer']

        # Decode ảnh
        image_bytes = base64.b64decode(image_b64)
        pil_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

        # Chạy model (load_yolo() đã cache sẵn)
        pred = predict_pil_image(pil_image, conf_threshold=0.0, top_k=1)
        top = pred.get('top', {})

        confidence = float(top.get('confidence', 0.0))
        yolo_label = top.get('label', '')

        if confidence < 0.5:
            result = {
                'scanId': scan_id,
                'success': False,
                'error': f'Độ tin cậy thấp ({confidence:.2f}). Vui lòng chụp rõ hơn.'
            }
        else:
            result = {
                'scanId': scan_id,
                'success': True,
                'yolo_label': yolo_label,
                'confidence': confidence,
            }

        # Gửi kết quả về queue của NestJS
        channel.basic_publish(
            exchange='',
            routing_key='scan_result_queue',
            body=json.dumps(result),
            properties=pika.BasicProperties(delivery_mode=2)
        )

        ch.basic_ack(delivery_tag=method.delivery_tag)
        print(f"[✓] Processed scan {scan_id}: {yolo_label} ({confidence:.2f})")

    except Exception as e:
        print(f"[✗] Error processing scan: {e}")
        # Gửi kết quả lỗi về
        error_result = {'scanId': data.get('scanId', ''), 'success': False, 'error': str(e)}
        channel.basic_publish(
            exchange='',
            routing_key='scan_result_queue',
            body=json.dumps(error_result),
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)
        
        
def process_chat_job(ch, method, properties, body):
    """Nhận chat job, gọi LLM, gửi kết quả về"""
    data = {}
    try:
        data = json.loads(body)
        session_id = data['sessionId']
        label      = data.get('label', 'Cây trồng')
        question   = data['question']
        msg_index  = data['pendingMessageIndex']

        # Lấy context từ RAG (tái sử dụng logic từ /chat endpoint hiện tại)
        global VECTOR_DB
        vs = VECTOR_DB if VECTOR_DB is not None else init_vector_db()
        search_query = f"Bệnh {label}: {question}"
        contexts = query_vectorstore(vs, search_query, k=4, filter_label=label)

        prompt_llm = (
            f"Bạn là chuyên gia nông nghiệp chuyên về bệnh cây trồng.\n"
            f"Kết quả nhận diện: **{label}**\n\n"
            f"Tài liệu liên quan:\n"
        )
        for c in contexts:
            prompt_llm += f"\n---\n{c['content']}\n"
        prompt_llm += (
            f"\nCâu hỏi: {question}\n"
            f"\nTrả lời chi tiết bằng tiếng Việt, định dạng Markdown rõ ràng."
        )

        llm = get_llm()
        if hasattr(llm, 'invoke'):
            res = llm.invoke(prompt_llm)
            answer_text = getattr(res, 'content', str(res))
        else:
            answer_text = llm(prompt_llm)

        result = {
            'sessionId': session_id,
            'pendingMessageIndex': msg_index,
            'success': True,
            'answer': answer_text,
        }

    except Exception as e:
        traceback.print_exc()
        result = {
            'sessionId': data.get('sessionId', ''),
            'pendingMessageIndex': data.get('pendingMessageIndex', 0),
            'success': False,
            'error': str(e),
        }

    channel.basic_publish(
        exchange='',
        routing_key='chat_result_queue',
        body=json.dumps(result),
        properties=pika.BasicProperties(delivery_mode=2),
    )
    ch.basic_ack(delivery_tag=method.delivery_tag)
    print(f"[✓] Chat session {data.get('sessionId')} answered")


if __name__ == '__main__':
    load_yolo()  # Preload model một lần khi khởi động
    print('[*] YOLO model loaded. Waiting for scan jobs...')

    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()

    channel.queue_declare(queue='scan_queue', durable=True)
    channel.queue_declare(queue='scan_result_queue', durable=True)
    channel.basic_qos(prefetch_count=1)  
    channel.basic_consume(queue='scan_queue', on_message_callback=process_scan_job)
    channel.basic_consume(queue='chat_queue', on_message_callback=process_chat_job)

    channel.start_consuming()