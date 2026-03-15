from __future__ import annotations

import os
from pathlib import Path
from dotenv import load_dotenv


load_dotenv()


PROJECT_ROOT = Path(__file__).resolve().parents[1]
UPLOADS_DIR = PROJECT_ROOT / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

MODELS_DIR = PROJECT_ROOT / "models"
YOLO_DIR = MODELS_DIR / "yolo"
BLIP_DIR = MODELS_DIR / "blip"
YOLO_DIR.mkdir(parents=True, exist_ok=True)
BLIP_DIR.mkdir(parents=True, exist_ok=True)


class Settings:
    APP_NAME: str = "IntelliVision Forensics"
    APP_VERSION: str = "1.0.0"

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    MAX_UPLOAD_MB: int = int(os.getenv("MAX_UPLOAD_MB", "20"))
    ALLOWED_CONTENT_TYPES: tuple[str, ...] = (
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/bmp",
        "image/tiff",
    )

    HF_API_TOKEN: str = os.getenv("HF_API_TOKEN", "").strip()
    HF_API_BASE: str = os.getenv("HF_API_BASE", "https://router.huggingface.co/hf-inference/models").strip()
    HF_OBJECT_MODEL: str = os.getenv("HF_OBJECT_MODEL", "facebook/detr-resnet-50").strip()

    OCR_SPACE_API_KEY: str = os.getenv("OCR_SPACE_API_KEY", "helloworld").strip()
    OCR_SPACE_URL: str = os.getenv("OCR_SPACE_URL", "https://api.ocr.space/parse/image").strip()

    LOCAL_YOLO_MODEL: str = os.getenv("LOCAL_YOLO_MODEL", "yolov8n.pt").strip()
    LOCAL_BLIP_MODEL: str = os.getenv("LOCAL_BLIP_MODEL", "Salesforce/blip-image-captioning-base").strip()


settings = Settings()
