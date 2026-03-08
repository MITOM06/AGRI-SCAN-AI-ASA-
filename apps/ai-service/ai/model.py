# app/model.py
import os
import uuid
from pathlib import Path
from typing import Tuple, Dict, Any, Optional
from PIL import Image

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

def predict_pil_image(pil_image: Image.Image, conf_threshold: float = 0.0) -> Dict[str, Any]:
    """
    Accepts a PIL.Image, runs YOLO and returns:
    {
      "predictions": [{"label": str, "confidence": float}, ...],
      "top": {"label": str, "confidence": float}  # top result
    }
    """
    model = load_yolo()
    # save temp file (YOLO accepts path or numpy array; save for stability)
    tmp_path = Path("temp")
    tmp_path.mkdir(exist_ok=True)
    fname = tmp_path / f"{uuid.uuid4().hex}.jpg"
    pil_image.save(fname, format="JPEG")
    results = model(str(fname))
    # results may be list-like for batch
    r = results[0]
    preds = []
    # try to read boxes, fallback to .probs if available
    try:
        boxes = getattr(r, "boxes", None)
        if boxes is not None:
            # boxes.cls, boxes.conf are tensors
            for cls, conf in zip(boxes.cls, boxes.conf):
                cls_id = int(cls.item()) if hasattr(cls, "item") else int(cls)
                conf_f = float(conf.item()) if hasattr(conf, "item") else float(conf)
                label = r.names.get(cls_id, str(cls_id))
                if conf_f >= conf_threshold:
                    preds.append({"label": label, "confidence": conf_f})
    except Exception:
        # fallback: check probs/top1 if present
        if hasattr(r, "probs"):
            try:
                idx = int(r.probs.top1)
                label = r.names[idx]
                conf_f = float(r.probs.top1conf)
                preds.append({"label": label, "confidence": conf_f})
            except Exception:
                pass

    # sort by confidence descending
    preds = sorted(preds, key=lambda x: x["confidence"], reverse=True)
    top = preds[0] if preds else {"label": "unknown", "confidence": 0.0}
    # cleanup temp
    try:
        fname.unlink(missing_ok=True)
    except Exception:
        pass
    return {"predictions": preds, "top": top}