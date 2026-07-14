"""
Bộ định tuyến model theo độ khó — tối ưu chi phí LLM.

Ý tưởng: không phải câu hỏi nào cũng cần Opus (đắt nhất). Ta phân loại
request thành 3 tầng bằng HEURISTIC (không gọi thêm LLM để tránh phát sinh
chi phí phân loại), rồi map sang model tương ứng:

    EASY   -> Haiku  (rẻ/nhanh)  : chào hỏi, "là gì", câu ngắn tra cứu.
    MEDIUM -> Sonnet (cân bằng)   : câu hỏi thường, độ dài vừa.
    HARD   -> Opus   (mạnh nhất)  : phân tích/chẩn đoán/so sánh/nguyên nhân,
                                    lộ trình, câu dài nhiều ý; sinh JSON phức tạp.

Có thể ghi đè model từng tầng qua ENV (ANTHROPIC_MODEL_EASY/MEDIUM/HARD),
hoặc tắt hẳn định tuyến bằng ANTHROPIC_ROUTER_ENABLED=false (khi đó dùng
ANTHROPIC_MODEL / mặc định Opus cho mọi request).
"""

import os
import re
from enum import Enum


class Tier(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


# Model mặc định cho từng tầng (đổi được qua ENV).
DEFAULT_MODEL_BY_TIER = {
    Tier.EASY: "claude-haiku-4-5-20251001",
    Tier.MEDIUM: "claude-sonnet-5",
    Tier.HARD: "claude-opus-4-8",
}


def model_for_tier(tier: Tier) -> str:
    """Trả model của một tầng, ưu tiên ENV ANTHROPIC_MODEL_<TIER>."""
    env_key = f"ANTHROPIC_MODEL_{tier.value.upper()}"
    return os.environ.get(env_key) or DEFAULT_MODEL_BY_TIER[tier]


def router_enabled() -> bool:
    """Định tuyến bật mặc định; tắt bằng ANTHROPIC_ROUTER_ENABLED=false/0/no."""
    val = os.environ.get("ANTHROPIC_ROUTER_ENABLED", "true").strip().lower()
    return val not in {"false", "0", "no", "off"}


# --- Tín hiệu phân loại (heuristic) ---

# Từ khoá cho thấy câu hỏi CẦN suy luận sâu -> HARD.
_HARD_KEYWORDS = re.compile(
    r"\b(tại sao|vì sao|phân tích|so sánh|nguyên nhân|cơ chế|chẩn đoán|"
    r"phác đồ|lộ trình|kế hoạch|chiến lược|đánh giá|giải thích chi tiết|"
    r"tối ưu|why|analyze|compare|diagnos|root cause|strateg)\w*",
    re.IGNORECASE,
)

# Câu hỏi tra cứu/giao tiếp đơn giản -> EASY.
_EASY_KEYWORDS = re.compile(
    r"\b(là gì|là cây gì|tên gì|bao nhiêu|có phải|xin chào|chào|hello|hi|"
    r"cảm ơn|thanks|ok|được không|khi nào|ở đâu|what is|how much|when|where)\w*",
    re.IGNORECASE,
)


def classify(prompt: str) -> Tier:
    """
    Phân loại độ khó của một câu hỏi tự do bằng heuristic:
    độ dài + số câu hỏi + từ khoá đặc trưng.
    """
    text = (prompt or "").strip()
    if not text:
        return Tier.EASY

    words = len(text.split())
    question_marks = text.count("?")

    # Từ khoá suy luận sâu, hoặc câu rất dài / nhiều câu hỏi -> HARD.
    if _HARD_KEYWORDS.search(text) or words > 60 or question_marks >= 3:
        return Tier.HARD

    # Câu ngắn + tín hiệu tra cứu/chào hỏi, không có dấu hiệu phức tạp -> EASY.
    if words <= 12 and _EASY_KEYWORDS.search(text):
        return Tier.EASY

    # Câu rất ngắn nói chung cũng coi là EASY.
    if words <= 6:
        return Tier.EASY

    # Còn lại -> MEDIUM.
    return Tier.MEDIUM


def pick_model(prompt: str = "", *, force_tier: Tier | None = None) -> tuple[str, Tier]:
    """
    Chọn model cho một request.

    - force_tier: ép tầng (ví dụ endpoint sinh JSON luôn HARD).
    - Nếu tắt định tuyến: trả model HARD (Opus) làm mặc định an toàn.

    Trả về (model_name, tier) — tier để log/giám sát chi phí.
    """
    if not router_enabled():
        return model_for_tier(Tier.HARD), Tier.HARD

    tier = force_tier if force_tier is not None else classify(prompt)
    return model_for_tier(tier), tier
