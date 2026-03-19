FROM python:3.10-slim

WORKDIR /app

# Cài các thư viện hệ thống cần thiết cho YOLO/OpenCV và DỌN RÁC NGAY
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip && \
    pip install --no-cache-dir torch torchvision \
    --index-url https://download.pytorch.org/whl/cpu \
    --default-timeout=1000
# Copy và cài đặt dependencies trước (để tận dụng cache của Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --default-timeout=1000

# Copy toàn bộ mã nguồn AI vào
COPY . .

EXPOSE 8000

CMD ["uvicorn", "ai.main:app", "--host", "0.0.0.0", "--port", "8000"]