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
# /plant_garden endpoint (giữ nguyên)
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


@app.post("/plant_garden", response_model=Union[HealthyPlantResp, DiseasedPlantResp])
async def plant_garden_endpoint(req: ChatRequest):
    global VECTOR_DB
    context_text = ""

    try:
        vs = VECTOR_DB if VECTOR_DB is not None else init_vector_db()
        is_healthy = "healthy" in req.label.lower() or "khỏe mạnh" in req.label.lower()

        search_query = f"Đặc tính cây {req.label}" if is_healthy else f"Điều trị bệnh {req.label}"
        contexts = query_vectorstore(vs, search_query, k=3)
        if contexts:
            context_text = "\n".join([c['content'] for c in contexts])

        if is_healthy:
            prompt_llm = f"""
Bạn là chuyên gia thực vật. Cây này KHỎE MẠNH ({req.label}).
Nhiệm vụ: Cung cấp thông tin thực vật và lộ trình chăm sóc 7 ngày.
Dữ liệu tham khảo: {context_text}

BẮT BUỘC TRẢ VỀ JSON RAW, KHÔNG CÓ KÝ TỰ LẠ, KHÔNG CÓ DẤU BA CHẤM.
Cấu trúc:
{{
  "commonName": "...", "scientificName": "...", "family": "...", "description": "...",
  "uses": "...", "care": "...", "category": [], "plantGroup": "...", "growthRate": "...",
  "light": "...", "water": "...", "height": "...", "floweringTime": "...",
  "suitableLocation": "...", "soil": "...", "status": "APPROVED", "images": [],
  "estimated_days": 7,
  "roadmap_summary": "...",
  "growth_stages": ["Cây non", "Phát triển", "Trưởng thành"],
  "current_stage_index": 1,
  "daily_tasks": [
    {{"day": 1, "weatherContext": "...", "waterAction": "...", "fertilizerAction": "...", "careAction": "..."}}
  ]
}}
(Hãy tạo đủ 7 ngày trong daily_tasks)
"""
        else:
            prompt_llm = f"""
Bạn là chuyên gia bệnh lý thực vật. Cây bị BỆNH ({req.label}).
Nhiệm vụ: Lập lộ trình điều trị 7 ngày.
Dữ liệu điều trị: {context_text}

BẮT BUỘC TRẢ VỀ JSON RAW. KHÔNG TRẢ VỀ thông tin thực vật (như scientificName, family...).
Cấu trúc:
{{
  "estimated_days": 7,
  "roadmap_summary": "...",
  "growth_stages": ["Cây non", "Phát triển", "Ra hoa", "Đậu quả", "Nuôi quả", "Thu hoạch"],
  "current_stage_index": 1,
  "daily_tasks": [
    {{"day": 1, "weatherContext": "...", "waterAction": "...", "fertilizerAction": "...", "careAction": "..."}}
  ]
}}
(Hãy tạo đủ 7 ngày trong daily_tasks)
"""

        llm = get_llm()
        res = llm.invoke(prompt_llm) if hasattr(llm, "invoke") else llm(prompt_llm)
        raw_answer = getattr(res, "content", str(res))

        clean_answer = re.sub(r"```json|```", "", raw_answer).strip()
        json_match = re.search(r"\{.*\}", clean_answer, re.DOTALL)

        if json_match:
            json_str = json_match.group()
            json_str = re.sub(r",\s*([\]}])", r"\1", json_str)
            final_json = json.loads(json_str)
            return final_json
        else:
            raise ValueError("Mô hình không sinh ra cấu trúc JSON.")

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": f"Lỗi: {str(e)}"})
