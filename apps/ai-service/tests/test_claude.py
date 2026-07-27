import os

from anthropic import Anthropic  # SDK chính thức của Anthropic (Claude)
from dotenv import load_dotenv

load_dotenv()

# Khởi tạo client (tự đọc ANTHROPIC_API_KEY nếu không truyền)
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

print("--- Danh sách các model Claude bạn có thể dùng: ---")

try:
    for m in client.models.list():
        print(f"Model ID: {m.id} ({m.display_name})")

    print("\n--- Gọi thử một câu: ---")
    resp = client.messages.create(
        model=os.getenv("ANTHROPIC_MODEL", "claude-opus-4-8"),
        max_tokens=64,
        messages=[{"role": "user", "content": "Xin chào, bạn là model nào?"}],
    )
    print(resp.content[0].text)
    print("Served by:", resp.model)

except Exception as e:
    print(f"Lỗi hệ thống: {e}")
