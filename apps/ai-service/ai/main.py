import io, os, traceback, json, threading
from fastapi import FastAPI, File, UploadFile, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Union
from PIL import Image
import re

from ai.model import predict_pil_image, load_yolo
from ai.rag import init_vector_db, query_vectorstore, load_knowledge
from ai.llm import get_llm

app = FastAPI(title="Agri-Scan AI Service")

# --- KHAI BÁO BIẾN TOÀN CỤC ---
VECTOR_DB = None
RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")

# --- FASTAPI STARTUP ---
@app.on_event("startup")
def startup_event():
    global VECTOR_DB
    try:
        load_yolo()
        print("[startup] YOLO/ViT-MoE model loaded successfully.")
    except Exception as e:
        print("[startup] Model load error:", e)

    try:
        VECTOR_DB = init_vector_db()
        print("[startup] Vector DB initialized successfully.")
    except Exception as e:
        print("[startup] Vector DB init error:", e)
        VECTOR_DB = None


@app.get("/")
def home():
    return {"status": "ok", "service": "agri-scan-ai"}


class PredictResp(BaseModel):
    success: bool
    yolo_label: Optional[str] = None
    confidence: Optional[float] = None
    rag_context: Optional[list] = None
    answer: Optional[str] = None
    error: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════
# BUG #1 FIX: Endpoint /predict trước đây chỉ có `pass` — không làm gì.
# NestJS Consumer (AiScanConsumer.handleScanImage) gọi POST /predict
# và nhận về response rỗng → scanHistory không bao giờ được cập nhật.
#
# Fix: implement toàn bộ logic nhận file → predict → trả về kết quả.
# ═══════════════════════════════════════════════════════════════════
@app.post("/predict", response_model=PredictResp)
async def predict_endpoint(file: UploadFile = File(...)):
    """
    Nhận ảnh từ NestJS Consumer, chạy model ViT-MoE, trả về nhãn bệnh và độ tin cậy.
    """
    try:
        # 1. Đọc bytes từ file upload
        contents = await file.read()
        if not contents:
            return PredictResp(success=False, error="File rỗng, không đọc được ảnh.")

        # 2. Mở ảnh bằng PIL
        try:
            pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        except Exception as e:
            return PredictResp(success=False, error=f"Không thể đọc file ảnh: {str(e)}")

        # 3. Chạy model predict
        pred = predict_pil_image(pil_image, conf_threshold=0.0, top_k=1)
        top = pred.get("top", {})

        confidence = float(top.get("confidence", 0.0))
        yolo_label = top.get("label", "")

        # 4. Ngưỡng tin cậy — dưới 50% coi là không nhận diện được
        if confidence < 0.5:
            return PredictResp(
                success=False,
                error=f"Độ tin cậy thấp ({confidence:.2f}). Vui lòng chụp rõ hơn và đảm bảo lá/thân cây chiếm phần lớn khung hình.",
            )

        return PredictResp(
            success=True,
            yolo_label=yolo_label,
            confidence=confidence,
        )

    except Exception as e:
        traceback.print_exc()
        return PredictResp(success=False, error=f"Lỗi hệ thống: {str(e)}")


# ─────────────────────────────────────────────────────────────────
# /chat endpoint (giữ nguyên, không thay đổi)
# ─────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    label: str
    prompt: str


@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    global VECTOR_DB
    try:
        vs = VECTOR_DB if VECTOR_DB is not None else init_vector_db()

        label = req.label
        question = req.prompt

        search_query = f"Bệnh {label}: {question}"
        contexts = query_vectorstore(vs, search_query, k=4, filter_label=req.label)

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

        llm = get_llm()
        try:
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
            "contexts": contexts
        }
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})


# ─────────────────────────────────────────────────────────────────
# /plant_garden endpoint
# ─────────────────────────────────────────────────────────────────
class DailyTask(BaseModel):
    day: int
    weatherContext: str
    waterAction: str
    fertilizerAction: str
    careAction: str

class DiseasedPlantResp(BaseModel):
    estimated_days: int
    roadmap_summary: str
    growth_stages: List[str]
    current_stage_index: int
    daily_tasks: List[DailyTask]

class HealthyPlantResp(BaseModel):
    commonName: str
    scientificName: str
    family: str
    description: str
    uses: str
    care: str
    category: List[str]
    plantGroup: str
    growthRate: str
    light: str
    water: str
    height: str
    floweringTime: str
    suitableLocation: str
    soil: str
    status: str
    images: List[str]
    estimated_days: int
    roadmap_summary: str
    growth_stages: List[str]
    current_stage_index: int
    daily_tasks: List[DailyTask]

# ROOT CAUSE FIX: Tạo model riêng cho /plant_garden
# ChatRequest chỉ có `label` + `prompt` — Backend mới gửi 4 field khác
# nên Pydantic fail 422 ngay khi validate vì thiếu field `label` bắt buộc
class PlantGardenRequest(BaseModel):
    plant_name: str
    disease_name: str
    user_goal: str
    weather_forecast: Optional[str] = "Không có dữ liệu thời tiết."
    # daily check-in gửi thêm 2 field này, optional để không break lần đầu tạo vườn
    current_day: Optional[int] = None
    image_url: Optional[str] = None


@app.post("/plant_garden", response_model=Union[HealthyPlantResp, DiseasedPlantResp])
async def plant_garden_endpoint(req: PlantGardenRequest):
    global VECTOR_DB
    context_text = ""

    try:
        vs = VECTOR_DB if VECTOR_DB is not None else init_vector_db()

        # ROOT CAUSE FIX: is_healthy kiểm tra disease_name thay vì req.label
        is_healthy = req.disease_name.strip().lower() in ("khỏe mạnh", "healthy", "")

        search_query = (
            f"Đặc tính sinh trưởng chăm sóc cây {req.plant_name}"
            if is_healthy
            else f"Điều trị bệnh {req.disease_name} trên cây {req.plant_name}"
        )
        contexts = query_vectorstore(vs, search_query, k=3)
        if contexts:
            context_text = "\n".join([c['content'] for c in contexts])

        goal_map = {
            "GET_FRUIT":    "ép ra trái/thu hoạch",
            "HEAL_DISEASE": "chữa bệnh và phục hồi",
            "GENERAL_CARE": "chăm sóc tổng quát",
            "GET_FLOWER":   "kích thích ra hoa",
        }
        goal_vn = goal_map.get(req.user_goal, req.user_goal)

        if is_healthy:
            prompt_llm = f"""
Bạn là chuyên gia thực vật. Cây {req.plant_name} đang KHỎE MẠNH.
Mục tiêu người dùng: {goal_vn}.
Thời tiết 7 ngày tới: {req.weather_forecast}
Dữ liệu tham khảo: {context_text}

NHIỆM VỤ: Cung cấp thông tin thực vật và lộ trình chăm sóc 7 ngày phù hợp với thời tiết.
BẮT BUỘC trả về JSON RAW duy nhất, không có markdown (```), không có chú thích.
Cấu trúc bắt buộc:
{{
  "commonName": "...", "scientificName": "...", "family": "...", "description": "...",
  "uses": "...", "care": "...", "category": ["..."], "plantGroup": "...", "growthRate": "...",
  "light": "...", "water": "...", "height": "...", "floweringTime": "...",
  "suitableLocation": "...", "soil": "...", "status": "APPROVED", "images": [],
  "estimated_days": 7,
  "roadmap_summary": "...",
  "growth_stages": ["Cây non", "Phát triển", "Trưởng thành"],
  "current_stage_index": 1,
  "daily_tasks": [
    {{"day": 1, "weatherContext": "mô tả thời tiết ngày 1", "waterAction": "...", "fertilizerAction": "...", "careAction": "..."}}
  ]
}}
Tạo đủ 7 phần tử trong daily_tasks. weatherContext của mỗi ngày phải dựa trên dữ liệu thời tiết được cung cấp.
"""
        else:
            prompt_llm = f"""
Bạn là chuyên gia bệnh lý thực vật.
Cây: {req.plant_name}
Bệnh: {req.disease_name}
Mục tiêu: {goal_vn}
Thời tiết 7 ngày tới: {req.weather_forecast}
Dữ liệu điều trị: {context_text}

NHIỆM VỤ: Lập lộ trình điều trị {req.disease_name} trong 7 ngày, điều chỉnh theo thời tiết.
BẮT BUỘC trả về JSON RAW duy nhất, không có markdown (```), không có chú thích.
Cấu trúc bắt buộc:
{{
  "estimated_days": 7,
  "roadmap_summary": "tóm tắt tình trạng và kế hoạch điều trị",
  "growth_stages": ["Cây non", "Phát triển", "Ra hoa", "Đậu quả", "Nuôi quả", "Thu hoạch"],
  "current_stage_index": 1,
  "daily_tasks": [
    {{"day": 1, "weatherContext": "mô tả thời tiết ngày 1", "waterAction": "...", "fertilizerAction": "...", "careAction": "hành động điều trị cụ thể"}}
  ]
}}
Tạo đủ 7 phần tử trong daily_tasks. weatherContext phải dựa trên dữ liệu thời tiết được cung cấp.
"""

        llm = get_llm()
        res = llm.invoke(prompt_llm) if hasattr(llm, "invoke") else llm(prompt_llm)
        raw_answer = getattr(res, "content", str(res))

        # Làm sạch markdown thừa mà FPT Llama hay sinh ra
        clean_answer = re.sub(r"```json|```", "", raw_answer).strip()
        json_match = re.search(r"\{.*\}", clean_answer, re.DOTALL)

        if json_match:
            json_str = json_match.group()
            # Xoá trailing comma trước ] hoặc } để tránh json.loads lỗi
            json_str = re.sub(r",\s*([\]}])", r"\1", json_str)
            final_json = json.loads(json_str)
            return final_json
        else:
            raise ValueError("Mô hình không sinh ra cấu trúc JSON hợp lệ.")

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": f"Lỗi: {str(e)}"})