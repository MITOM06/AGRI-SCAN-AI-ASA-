# app/main.py
import io, os, traceback
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

from PIL import Image

from ai.model import predict_pil_image, load_yolo
from ai.rag import init_vector_db, query_vectorstore, load_knowledge
from ai.llm import get_llm

app = FastAPI(title="Agri-Scan AI Service")

# init components at startup
@app.on_event("startup")
def startup_event():
    # load YOLO (will raise if missing)
    try:
        load_yolo()
    except Exception as e:
        print("[startup] YOLO load warning/error:", e)
    # init RAG vector DB (may take time)
    try:
        init_vector_db()
    except Exception as e:
        print("[startup] Vector DB init warning/error:", e)

# simple health
@app.get("/")
def home():
    return {"status": "ok", "service": "agri-scan-ai"}

class PredictResp(BaseModel):
    success: bool
    yolo_label: Optional[str] = None
    confidence: Optional[float] = None
    rag_context: Optional[list] = None
    answer: Optional[str] = None
    error: Optional[str] = None

@app.post("/predict", response_model=PredictResp)
async def predict_endpoint(file: UploadFile = File(None), question: str = Form(None)):
    """
    If file provided -> run YOLO predict.
    If question provided -> do RAG + LLM answering (uses vector DB)
    Both can be used together: run inference and then question-contexted answer.
    """
    try:
        if file is None:
            return JSONResponse(status_code=400, content={"success": False, "error": "No file provided"})
        contents = await file.read()
        pil = Image.open(io.BytesIO(contents)).convert("RGB")
        pred = predict_pil_image(pil, conf_threshold=0.0)
        top = pred.get("top", {})
        yolo_label = top.get("label")
        confidence = float(top.get("confidence", 0.0))

        # low confidence quick return
        if confidence < 0.5:
            return {"success": False,
                    "yolo_label": yolo_label,
                    "confidence": confidence,
                    "error": f"Hệ thống không chắc chắn (confidence={confidence:.2f}). Vui lòng chụp ảnh gần hơn."}

        # get vectorstore and candidate contexts
        vs = init_vector_db()
        contexts = query_vectorstore(vs, f"{yolo_label}", k=3)

        # build prompt using context and user question (if any)
        question_text = question or ""
        prompt = f"AI chẩn đoán: {yolo_label}\n\nContext (top hits):\n"
        for i, c in enumerate(contexts):
            prompt += f"\n---\n{c['content']}\n"
        prompt += f"\n\nCâu hỏi của người dùng: {question_text}\n\nHãy trả lời bằng tiếng Việt, cấu trúc Markdown ngắn gọn."

        # call LLM with fallback logic
        try:
            llm = get_llm()
            # many LLM wrappers accept .generate or .predict or .invoke; we'll try common ones
            answer = None
            try:
                # LangChain LLM interface (call)
                answer = llm.generate([prompt]) if hasattr(llm, "generate") else None
                if answer and hasattr(answer, "generations"):
                    # attempt to extract text (LangChain format)
                    gen = answer.generations[0][0]
                    answer_text = getattr(gen, "text", str(gen))
                else:
                    # try a simple call / predict interface
                    answer_text = llm(prompt) if callable(llm) else str(answer)
            except Exception:
                # fallback: try __call__
                try:
                    answer_text = llm(prompt)
                except Exception as e2:
                    print("[/predict] LLM error:", e2)
                    traceback.print_exc()
                    answer_text = f"LLM error: {e2}"
        except Exception as e:
            print("[/predict] No LLM available:", e)
            answer_text = None

        return {
            "success": True,
            "yolo_label": yolo_label,
            "confidence": confidence,
            "rag_context": contexts,
            "answer": answer_text
        }

    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": str(e)}

@app.post("/chat")
async def chat_endpoint(question: str):
    """
    Pure chat endpoint: uses vectorstore to fetch context then LLM to answer.
    """
    try:
        vs = init_vector_db()
        contexts = query_vectorstore(vs, question, k=4)

        prompt = "Bạn là chuyên gia nông nghiệp. Dưới đây là những thông tin tham khảo:\n"
        for c in contexts:
            prompt += f"\n---\n{c['content']}\n"
        prompt += f"\nHỏi: {question}\nTrả lời ngắn gọn, tiếng Việt, Markdown."

        llm = get_llm()
        try:
            # try a simple call
            if hasattr(llm, "generate"):
                out = llm.generate([prompt])
                if out and hasattr(out, "generations"):
                    answer_text = out.generations[0][0].text
                else:
                    answer_text = str(out)
            else:
                answer_text = llm(prompt)
        except Exception as e:
            print("[/chat] LLM generate error:", e)
            answer_text = f"LLM error: {e}"

        return {"question": question, "answer": answer_text, "contexts": contexts}
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})