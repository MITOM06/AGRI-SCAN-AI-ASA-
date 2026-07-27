"""Các router FastAPI, mỗi endpoint một file.

Lưu ý: `ai/router.py` (số ít) là bộ định tuyến *model LLM theo độ khó*,
không liên quan tới package này.
"""

from ai.endpoints import chat, plant_garden, predict

__all__ = ["chat", "plant_garden", "predict"]
