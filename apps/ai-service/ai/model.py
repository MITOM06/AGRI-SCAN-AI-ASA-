# app/model.py
import os
import uuid
from pathlib import Path
from typing import Tuple, Dict, Any, Optional, List
from PIL import Image
from PIL import Image, ImageOps
import numpy as np


try:
    from ultralytics import YOLO
except Exception as e:
    YOLO = None
    print("Warning: ultralytics not available:", e)

MODELS_DIR = Path(__file__).resolve().parents[1] / "models"
DEFAULT_MODEL_PATH = MODELS_DIR / "best.pt"

# load model once on import (if possible)
yolo_model = None
def load_yolo(model_path: Optional[str] = None):
    global yolo_model
    if yolo_model is not None:
        return yolo_model
    if YOLO is None:
        raise RuntimeError("ultralytics.YOLO package not installed.")
    mp = model_path or os.environ.get("YOLO_MODEL_PATH") or str(DEFAULT_MODEL_PATH)
    if not Path(mp).exists():
        raise FileNotFoundError(f"YOLO weights not found at {mp}")
    print(f"[model.py] Loading YOLO model from {mp} ...")
    yolo_model = YOLO(mp)
    return yolo_model

def predict_pil_image(
    pil_image: Image.Image,
    conf_threshold: float = 0.0,
    top_k: int = 1
) -> Dict[str, Any]:
    """
    Predict classification from a PIL image using the loaded YOLO (classification) model.

    Returns:
      {
        "predictions": [{"label": str, "confidence": float}, ...],  # sorted desc
        "top": {"label": str, "confidence": float}
      }
    - conf_threshold: chỉ trả các kết quả có confidence >= conf_threshold
    - top_k: số nhãn hàng đầu cần lấy từ output probs (mặc định 1)
    """
    model = load_yolo()

    # ensure correct orientation and RGB
    pil_image = ImageOps.exif_transpose(pil_image).convert("RGB")

    # run inference (pass PIL directly)
    results = model(pil_image)
    r = results[0]

    preds: List[Dict[str, Any]] = []

    # 1) classification-style output (preferred)
    if hasattr(r, "probs") and r.probs is not None:
        probs = r.probs
        try:
            # case: object with top1 & top1conf attributes
            if hasattr(probs, "top1") and hasattr(probs, "top1conf"):
                idx = int(probs.top1)
                conf = float(probs.top1conf)
                label = model.names[idx] if hasattr(model, "names") else str(idx)
                if conf >= conf_threshold:
                    preds.append({"label": label, "confidence": conf})
            else:
                # try convert to numpy array of class probabilities
                try:
                    arr = probs.cpu().numpy() if hasattr(probs, "cpu") else np.array(probs)
                except Exception:
                    arr = np.array(probs)
                # get top_k indices
                idxs = arr.argsort()[-top_k:][::-1]
                for i in idxs:
                    conf = float(arr[i])
                    label = model.names[int(i)] if hasattr(model, "names") else str(int(i))
                    if conf >= conf_threshold:
                        preds.append({"label": label, "confidence": conf})
        except Exception as e:
            print("predict_pil_image: error reading probs:", e)

    # 2) fallback (if no classification probs found) — try detection boxes (rare for pure classifier)
    if not preds:
        try:
            boxes = getattr(r, "boxes", None)
            if boxes is not None and len(boxes) > 0:
                # attempt to extract confs and class ids
                confs = boxes.conf.cpu().numpy() if hasattr(boxes.conf, "cpu") else np.array(boxes.conf)
                cls_ids = boxes.cls.cpu().numpy() if hasattr(boxes.cls, "cpu") else np.array(boxes.cls)
                for c, cid in zip(confs, cls_ids):
                    conf = float(c)
                    label = model.names[int(cid)] if hasattr(model, "names") else str(int(cid))
                    if conf >= conf_threshold:
                        preds.append({"label": label, "confidence": conf})
        except Exception as e:
            print("predict_pil_image: boxes fallback error:", e)

    # sort by confidence descending and return top
    preds = sorted(preds, key=lambda x: x["confidence"], reverse=True)
    top = preds[0] if preds else {"label": "unknown", "confidence": 0.0}

    return {"predictions": preds, "top": top}