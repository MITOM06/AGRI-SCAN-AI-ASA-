import json
import re
import traceback
from typing import Union

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from ai.llm import get_llm
from ai.rag import init_vector_db, query_vectorstore
from ai.router import Tier, pick_model
from ai.schemas import ChatRequest, DiseasedPlantResp, HealthyPlantResp
from ai.state import get_vector_db

router = APIRouter()


@router.post(
    "/plant_garden", response_model=Union[HealthyPlantResp, DiseasedPlantResp]
)
async def plant_garden_endpoint(req: ChatRequest):
    context_text = ""  # Khởi tạo tránh lỗi UnboundLocalError

    try:
        vector_db = get_vector_db()
        vs = vector_db if vector_db is not None else init_vector_db()
        is_healthy = (
            "healthy" in req.label.lower() or "khỏe mạnh" in req.label.lower()
        )

        # 1. Lấy Context từ RAG
        search_query = (
            f"Đặc tính cây {req.label}"
            if is_healthy
            else f"Điều trị bệnh {req.label}"
        )
        contexts = query_vectorstore(vs, search_query, k=3)
        if contexts:
            context_text = "\n".join([c["content"] for c in contexts])

        # 2. Xây dựng Prompt "SẠCH" (Không có comment // để tránh lỗi JSON)
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

        # 3. Gọi LLM — sinh JSON lộ trình là tác vụ phức tạp -> luôn HARD (Opus).
        model_name, tier = pick_model(force_tier=Tier.HARD)
        print(f"[/plant_garden] tier={tier.value} model={model_name}")
        llm = get_llm(model_name)
        res = llm.invoke(prompt_llm) if hasattr(llm, "invoke") else llm(prompt_llm)
        raw_answer = getattr(res, "content", str(res))

        # 4. Xử lý bóc tách JSON an toàn
        # Xóa các khối markdown ```json ... ``` nếu có
        clean_answer = re.sub(r"```json|```", "", raw_answer).strip()
        json_match = re.search(r"\{.*\}", clean_answer, re.DOTALL)

        if json_match:
            # Sửa các lỗi phổ biến của LLM như dấu phẩy thừa trước dấu đóng ngoặc
            json_str = json_match.group()
            json_str = re.sub(r",\s*([\]}])", r"\1", json_str)

            final_json = json.loads(json_str)
            return final_json
        else:
            raise ValueError("Mô hình không sinh ra cấu trúc JSON.")

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": f"Lỗi: {str(e)}"})
