from fastapi import FastAPI

from ai.endpoints import chat, plant_garden, predict
from ai.model import load_yolo
from ai.rag import init_vector_db
from ai.state import set_vector_db

app = FastAPI(title="Agri-Scan AI Service")


@app.on_event("startup")
def startup_event():
    # Load YOLO
    try:
        load_yolo()
        print("[startup] YOLO loaded successfully.")
    except Exception as e:
        print("[startup] YOLO load error:", e)

    # Khởi tạo Vector DB, chia sẻ cho các endpoint qua ai.state
    try:
        set_vector_db(init_vector_db())
        print("[startup] Vector DB initialized successfully.")
    except Exception as e:
        print("[startup] Vector DB init error:", e)
        set_vector_db(None)


@app.get("/")
def home():
    return {"status": "ok", "service": "agri-scan-ai"}


app.include_router(predict.router)
app.include_router(chat.router)
app.include_router(plant_garden.router)
