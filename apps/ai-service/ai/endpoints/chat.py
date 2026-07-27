import traceback

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from ai.llm import get_llm
from ai.rag import init_vector_db, query_vectorstore
from ai.router import pick_model
from ai.schemas import ChatRequest
from ai.state import get_vector_db

router = APIRouter()


@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    """
    Pure chat endpoint: uses vectorstore to fetch context then LLM to answer.
    """
    try:
        # 1. Kiểm tra Vector DB
        vector_db = get_vector_db()
        vs = vector_db if vector_db is not None else init_vector_db()

        # 2. Lấy thông tin từ request
        label = req.label
        question = req.prompt

        # 3. Truy vấn Vector Store (kết hợp nhãn và câu hỏi để tìm kiếm chính xác)
        search_query = f"Bệnh {label}: {question}"
        contexts = query_vectorstore(vs, search_query, k=4, filter_label=req.label)

        # 4. Xây dựng Prompt cho LLM
        prompt_llm = (
            f"Bạn là chuyên gia nông nghiệp chuyên về bệnh cây trồng.\n"
            f"Kết quả nhận diện: **{label}**\n\n"
            f"Dưới đây là các tài liệu kỹ thuật liên quan:\n"
        )
        for c in contexts:
            prompt_llm += f"\n---\n{c['content']}\n"

        prompt_llm += (
            f"\nCâu hỏi của người dùng: {question}\n"
            f"\nHãy trả lời chi tiết bằng tiếng Việt, định dạng Markdown rõ ràng."
        )

        # 5. Gọi LLM — định tuyến model theo độ khó câu hỏi để tối ưu chi phí.
        model_name, tier = pick_model(question)
        print(f"[/chat] tier={tier.value} model={model_name}")
        llm = get_llm(model_name)
        try:
            # Ưu tiên dùng .invoke (chuẩn mới) hoặc fallback về gọi trực tiếp
            if hasattr(llm, "invoke"):
                res = llm.invoke(prompt_llm)
                answer_text = getattr(res, "content", str(res))
            elif hasattr(llm, "generate"):
                out = llm.generate([prompt_llm])
                answer_text = out.generations[0][0].text
            else:
                answer_text = llm(prompt_llm)
        except Exception as e:
            print("[/chat] LLM error:", e)
            answer_text = f"Xin lỗi, AI đang gặp vấn đề khi xử lý câu hỏi: {e}"

        return {
            "label": label,
            "answer": answer_text,
            "contexts": contexts,
        }
    except Exception as e:
        traceback.print_exc()
        # Trả về lỗi 500 nhưng kèm thông báo rõ ràng để Backend dễ đọc
        return JSONResponse(status_code=500, content={"error": str(e)})
