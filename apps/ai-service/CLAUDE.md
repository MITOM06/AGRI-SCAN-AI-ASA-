# apps/ai-service — CLAUDE.md

Dịch vụ suy luận AI. **Python + FastAPI**. Đọc file này khi làm việc trong `apps/ai-service`.

## Stack
- **FastAPI** (`uvicorn`), nhận HTTP từ backend NestJS.
- **Phân loại ảnh**: ViT-MoE (Vision Transformer + Mixture-of-Experts, `timm` + PyTorch), weights `models/vit_moe_best.pth`, nhãn `models/class_to_idx.json`.
- **Phát hiện đối tượng**: YOLO (`ultralytics`) — `load_yolo()` khi startup.
- **RAG**: Chroma (`langchain_community`) + embeddings `keepitreal/vietnamese-sbert` (HuggingFace), knowledge `data/plant_knowledge.json`.
- **LLM**: Gemini qua `google-genai` (`from google import genai`), model mặc định `gemini-3-flash-preview` (xem `llm.py`).

## Cấu trúc
```
ai/
  main.py          # FastAPI app, startup load YOLO + init Vector DB, endpoints /predict /chat
  model.py         # ViT_Backbone, Expert, GatingNetwork (MoE), predict_pil_image, load_yolo
  rag.py           # init_vector_db, query_vectorstore, load_knowledge (Chroma)
  llm.py           # GeminiLLM wrapper (google-genai)
  worker.py        # LEGACY — không dùng (kiến trúc cũ Python-as-consumer). Xem header file.
  main_backup.py   # backup, không dùng
data/              # plant_knowledge.json, plants_data.json
models/            # vit_moe_best.pth, class_to_idx.json
```

## Endpoints chính
- `GET /` — healthcheck.
- `POST /predict` — nhận ảnh (UploadFile) → label + confidence.
- `POST /chat` — hỏi đáp RAG + Gemini (kèm context bệnh/cây).

## Lệnh
```bash
cd apps/ai-service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn ai.main:app --reload --port 8000
```

## ENV
Hiện `.env.example` ghi `FPT_*` (LEGACY/lệch). LLM thực tế là Gemini → cần `GEMINI_API_KEY`/`GOOGLE_API_KEY` (kiểm tra `llm.py`/`load_dotenv`). Tuỳ chọn: `HF_EMBEDDINGS_MODEL`.

## Nợ kỹ thuật
- ✅ (đã sửa) `requirements.txt` thêm `google-genai` + torch/torchvision/numpy; bỏ gradio/ultralytics/langchain-ollama/pika không dùng.
- ✅ (đã sửa) `.env.example` chuyển sang `GOOGLE_API_KEY`/`GEMINI_MODEL`.
- ✅ (đã sửa) Đã xoá code chết `worker.py`, `main_backup.py`.
- ✅ (đã sửa) `/predict` nhánh confidence thấp trả sai key `_label` → nay là `yolo_label`.
- ⏳ (còn) `@app.on_event("startup")` deprecated → nên chuyển sang `lifespan`.
- ⏳ (còn) `load_yolo()` nhánh `except` có thể tham chiếu biến chưa gán nếu khởi tạo model lỗi.

## Quy tắc khi sửa
- Không nạp lại model mỗi request — dùng biến global/cache đã có.
- Giữ chữ ký response `PredictResp`/schema để backend không vỡ.
