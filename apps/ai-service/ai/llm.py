import os
import traceback
from types import SimpleNamespace
from anthropic import Anthropic  # SDK chính thức của Anthropic (Claude)
from dotenv import load_dotenv

# Nạp biến môi trường từ file .env nếu có
load_dotenv()

# Model mặc định: Claude Opus 4.8 (mạnh nhất tầng Opus). Có thể đổi qua ENV
# ANTHROPIC_MODEL (ví dụ "claude-sonnet-5" nếu muốn rẻ/nhanh hơn cho chatbot).
DEFAULT_MODEL = "claude-opus-4-8"


class ClaudeLLM:
    """
    Wrapper cho Claude API (Anthropic SDK).
    Hỗ trợ Agri-Scan AI xử lý chẩn đoán và lập kế hoạch chăm sóc cây.

    Giữ nguyên interface cũ (.invoke / .generate / __call__ trả SimpleNamespace)
    để backend/main.py không phải đổi.
    """

    def __init__(self, api_key: str, model_name: str = DEFAULT_MODEL):
        self.api_key = api_key
        self.model_name = model_name
        # Client tự đọc ANTHROPIC_API_KEY nếu không truyền, nhưng ta truyền tường minh.
        self.client = Anthropic(api_key=self.api_key)

    def invoke(self, prompt: str, system_prompt: str = None, **kwargs):
        """
        Gửi yêu cầu đến Claude và trả về kết quả dạng văn bản.

        Lưu ý: KHÔNG truyền temperature/top_p — các model Opus 4.7+ (gồm
        claude-opus-4-8) từ chối các tham số này với lỗi 400.
        """
        try:
            create_kwargs = {
                "model": self.model_name,
                # max_tokens là bắt buộc; để đủ chỗ cho lộ trình 7 ngày dạng JSON.
                "max_tokens": kwargs.get("max_tokens", 4096),
                "messages": [{"role": "user", "content": prompt}],
            }
            if system_prompt:
                create_kwargs["system"] = system_prompt

            response = self.client.messages.create(**create_kwargs)

            # response.content là list các content block — gom các block text lại.
            text = "".join(
                block.text for block in response.content
                if getattr(block, "type", None) == "text"
            )

            return SimpleNamespace(content=text, raw=response)

        except Exception as e:
            error_msg = f"Lỗi Claude API: {str(e)}"
            print(f"[ClaudeLLM] {error_msg}")
            return SimpleNamespace(
                content=f"Xin lỗi, AI gặp sự cố: {error_msg}",
                raw={"error": str(e)},
            )

    def generate(self, prompts: list, system_prompt: str = None, **kwargs):
        """Hỗ trợ xử lý danh sách nhiều prompt cùng lúc."""
        results = []
        for p in prompts:
            res = self.invoke(p, system_prompt=system_prompt, **kwargs)
            results.append([SimpleNamespace(text=res.content)])
        return SimpleNamespace(generations=results, raw=results)

    def __call__(self, prompt: str, **kwargs):
        """Cho phép gọi object trực tiếp: ai("Hello")"""
        return self.invoke(prompt, **kwargs).content


# Cache client theo model — tránh tạo lại Anthropic client mỗi request.
_LLM_CACHE: dict[str, "ClaudeLLM"] = {}


def get_llm(model_name: str = None):
    """
    Factory khởi tạo LLM cho hệ thống.
    Đọc ANTHROPIC_API_KEY (chuẩn Anthropic).

    - model_name: nếu truyền (ví dụ do bộ định tuyến router.pick_model chọn)
      sẽ ghi đè; nếu None thì lấy ANTHROPIC_MODEL rồi mới tới DEFAULT_MODEL.
    - Kết quả được cache theo model để tái dùng client.
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    resolved_model = model_name or os.environ.get("ANTHROPIC_MODEL", DEFAULT_MODEL)

    if not api_key:
        raise RuntimeError(
            "Không tìm thấy API Key. Hãy đặt ANTHROPIC_API_KEY trong .env "
            "hoặc export ANTHROPIC_API_KEY='sk-ant-...'"
        )

    cached = _LLM_CACHE.get(resolved_model)
    if cached is not None:
        return cached

    try:
        llm = ClaudeLLM(api_key=api_key, model_name=resolved_model)
        _LLM_CACHE[resolved_model] = llm
        return llm
    except Exception as e:
        print(f"[llm.py] Khởi tạo thất bại: {e}")
        traceback.print_exc()
        raise
