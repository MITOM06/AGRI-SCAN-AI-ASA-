"""Pydantic schema dùng chung cho các endpoint.

⚠️ Backend NestJS phụ thuộc vào đúng shape này (xem ai-scan.consumer.ts) —
đổi tên field ở đây là breaking change.
"""

from typing import List, Optional

from pydantic import BaseModel


class PredictResp(BaseModel):
    success: bool
    yolo_label: Optional[str] = None
    confidence: Optional[float] = None
    rag_context: Optional[list] = None
    answer: Optional[str] = None
    error: Optional[str] = None


class ChatRequest(BaseModel):
    label: str  # Nhãn trả về từ predict_endpoint
    prompt: str  # Câu hỏi của người dùng


class DailyTask(BaseModel):
    day: int
    weatherContext: str
    waterAction: str
    fertilizerAction: str
    careAction: str


# Model cho cây BỆNH (Chỉ có lộ trình 7 ngày)
class DiseasedPlantResp(BaseModel):
    estimated_days: int
    roadmap_summary: str
    growth_stages: List[str]
    current_stage_index: int
    daily_tasks: List[DailyTask]


# Model cho cây KHỎE (Thông tin thực vật + 14 ngày)
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
