# apps/ai-service — CLAUDE.md

The AI inference service. **Python + FastAPI**. Read this file when working in `apps/ai-service`.

## Stack
- **FastAPI** (`uvicorn`), receives HTTP from the NestJS backend.
- **Image classification**: ViT-MoE (Vision Transformer + Mixture-of-Experts, `timm` + PyTorch), weights `models/vit_moe_best.pth`, labels `models/class_to_idx.json`.
- **Object detection**: YOLO (`ultralytics`) — `load_yolo()` at startup.
- **RAG**: Chroma (`langchain_community`) + `keepitreal/vietnamese-sbert` embeddings (HuggingFace), knowledge `data/plant_knowledge.json`.
- **LLM**: Claude via `anthropic` (`from anthropic import Anthropic`), default model `claude-opus-4-8` (override via the `ANTHROPIC_MODEL` env var; see `llm.py`).

## Structure
```
ai/
  main.py          # FastAPI app, startup loads YOLO + inits the Vector DB, endpoints /predict /chat
  model.py         # ViT_Backbone, Expert, GatingNetwork (MoE), predict_pil_image, load_yolo
  rag.py           # init_vector_db, query_vectorstore, load_knowledge (Chroma)
  llm.py           # ClaudeLLM wrapper (anthropic SDK)
  worker.py        # LEGACY — not used (old Python-as-consumer architecture). See the file header.
  main_backup.py   # backup, not used
data/              # plant_knowledge.json, plants_data.json
models/            # vit_moe_best.pth, class_to_idx.json
```

## Main endpoints
- `GET /` — healthcheck.
- `POST /predict` — takes an image (UploadFile) → label + confidence.
- `POST /chat` — RAG + Claude Q&A (with disease/plant context).

## Commands
```bash
cd apps/ai-service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn ai.main:app --reload --port 8000
```

## ENV
The LLM is Claude → requires `ANTHROPIC_API_KEY` (see `llm.py`/`load_dotenv`). Optional: `ANTHROPIC_MODEL` (default `claude-opus-4-8`), `HF_EMBEDDINGS_MODEL`.

## Technical debt
- ✅ (fixed) `requirements.txt` uses `anthropic` (Claude) + torch/torchvision/numpy; removed unused gradio/ultralytics/langchain-ollama/pika.
- ✅ (fixed) `.env.example` switched to `ANTHROPIC_API_KEY`/`ANTHROPIC_MODEL`.
- ✅ (fixed) Removed dead code `worker.py`, `main_backup.py`.
- ✅ (fixed) The low-confidence branch of `/predict` returned the wrong key `_label` → now `yolo_label`.
- ⏳ (remaining) `@app.on_event("startup")` is deprecated → should move to `lifespan`.
- ⏳ (remaining) The `except` branch of `load_yolo()` may reference an unassigned variable if model init fails.

## Rules when editing
- Do not reload the model on every request — use the existing global variable/cache.
- Keep the `PredictResp`/schema response signatures so the backend does not break.
