import io
import traceback

from fastapi import APIRouter, File, UploadFile
from PIL import Image

from ai.model import predict_pil_image
from ai.schemas import PredictResp

router = APIRouter()


@router.post("/predict", response_model=PredictResp)
async def predict_endpoint(file: UploadFile = File(...)):
    """
    Chỉ nhận diện ảnh và trả về label + confidence.
    """
    try:
        contents = await file.read()
        pil = Image.open(io.BytesIO(contents))

        # Xử lý xoay ảnh nếu có EXIF
        try:
            from PIL import ImageOps

            pil = ImageOps.exif_transpose(pil)
        except Exception:
            pass

        pil = pil.convert("RGB")

        # Dự đoán
        pred = predict_pil_image(pil, conf_threshold=0.0, top_k=3)
        top = pred.get("top", {})
        yolo_label = top.get("label")
        confidence = float(top.get("confidence", 0.0))

        if confidence < 0.7:
            return {
                "success": False,
                "yolo_label": yolo_label,
                "confidence": confidence,
                "error": f"Độ tin cậy thấp ({confidence:.2f}). Vui lòng chụp rõ hơn.",
            }

        return {
            "success": True,
            "yolo_label": yolo_label,
            "confidence": confidence,
        }
    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": str(e)}
