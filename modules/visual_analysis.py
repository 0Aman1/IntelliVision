from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

import httpx

from backend.config import settings

try:
    from ultralytics import YOLO
except Exception:
    YOLO = None

try:
    from transformers import pipeline
except Exception:
    pipeline = None


@lru_cache(maxsize=1)
def _get_yolo():
    if YOLO is None:
        return None
    try:
        return YOLO(settings.LOCAL_YOLO_MODEL)
    except Exception:
        return None


@lru_cache(maxsize=1)
def _get_blip():
    if pipeline is None:
        return None
    try:
        return pipeline("image-to-text", model=settings.LOCAL_BLIP_MODEL, device=-1)
    except Exception:
        return None


def _run_local_yolo(image_path: Path) -> list[dict[str, Any]]:
    model = _get_yolo()
    if model is None:
        return []
    try:
        results = model.predict(source=str(image_path), device="cpu", verbose=False)
    except Exception:
        return []
    if not results:
        return []
    result = results[0]
    boxes = getattr(result, "boxes", None)
    if boxes is None:
        return []

    outputs: list[dict[str, Any]] = []
    for box in boxes:
        class_id = int(box.cls[0].item())
        confidence = float(box.conf[0].item())
        label = result.names.get(class_id, str(class_id))
        outputs.append({"label": str(label).lower(), "confidence": round(confidence, 3), "source": "local_yolo"})

    return outputs


def _run_local_blip(image_path: Path) -> str:
    blip = _get_blip()
    if blip is None:
        return ""
    try:
        output = blip(str(image_path), max_new_tokens=40)
    except Exception:
        return ""
    if not output:
        return ""
    first = output[0]
    if isinstance(first, dict):
        return str(first.get("generated_text", "")).strip()
    return ""


async def _call_hf_object_detection(image_bytes: bytes) -> list[dict[str, Any]]:
    headers = {"Content-Type": "application/octet-stream"}
    if settings.HF_API_TOKEN:
        headers["Authorization"] = f"Bearer {settings.HF_API_TOKEN}"

    url = f"{settings.HF_API_BASE}/{settings.HF_OBJECT_MODEL}"

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, content=image_bytes, timeout=90.0)

    if response.status_code >= 400:
        raise RuntimeError(f"hf_object_error_{response.status_code}")

    payload = response.json()
    if not isinstance(payload, list):
        return []

    objects: list[dict[str, Any]] = []
    for item in payload:
        if not isinstance(item, dict):
            continue
        label = str(item.get("label", "")).strip().lower()
        if not label:
            continue
        score = float(item.get("score", 0.5))
        objects.append({"label": label, "confidence": round(score, 3), "source": "hf_detr"})
    return objects


async def _call_ocr_space(image_bytes: bytes, filename: str) -> list[str]:
    data = {
        "apikey": settings.OCR_SPACE_API_KEY,
        "language": "eng",
        "isOverlayRequired": "false",
        "scale": "true",
        "OCREngine": "2",
    }
    files = {"file": (filename, image_bytes)}

    async with httpx.AsyncClient() as client:
        response = await client.post(settings.OCR_SPACE_URL, data=data, files=files, timeout=90.0)

    if response.status_code >= 400:
        raise RuntimeError(f"ocr_space_error_{response.status_code}")

    payload = response.json()
    parsed_results = payload.get("ParsedResults", []) if isinstance(payload, dict) else []

    lines: list[str] = []
    for item in parsed_results:
        if not isinstance(item, dict):
            continue
        text = str(item.get("ParsedText", "")).strip()
        if not text:
            continue
        lines.extend(line.strip() for line in text.splitlines() if line.strip())
    return lines


def _fuse_objects(local_objects: list[dict[str, Any]], api_objects: list[dict[str, Any]], caption: str) -> list[dict[str, Any]]:
    merged = local_objects + api_objects
    dedup: dict[str, dict[str, Any]] = {}

    for obj in merged:
        label = str(obj.get("label", "")).lower().strip()
        if not label:
            continue
        if label not in dedup or float(obj.get("confidence", 0.0)) > float(dedup[label].get("confidence", 0.0)):
            dedup[label] = obj

    if not dedup:
        fallback_labels: list[str] = []
        caption_lower = caption.lower()
        keywords = ["person", "car", "vehicle", "building", "tree", "road", "animal", "phone"]
        for key in keywords:
            if key in caption_lower:
                fallback_labels.append(key)
        if not fallback_labels:
            fallback_labels = ["scene"]
        return [{"label": label, "confidence": 0.5, "source": "caption_fallback"} for label in fallback_labels]

    return list(dedup.values())


def _infer_scene(objects: list[dict[str, Any]], caption: str) -> str:
    text = f"{caption} {' '.join(str(o.get('label', '')) for o in objects)}".lower()
    if any(token in text for token in ["car", "vehicle", "road", "street", "traffic"]):
        return "urban street"
    if any(token in text for token in ["mountain", "cliff", "valley", "summit"]):
        return "mountain landscape"
    if any(token in text for token in ["beach", "ocean", "coast", "shore"]):
        return "coastal scene"
    if any(token in text for token in ["tree", "forest", "park", "river", "nature"]):
        return "natural environment"
    if any(token in text for token in ["room", "table", "office", "indoor", "interior"]):
        return "indoor environment"
    return "daily-life setting"


def _fallback_caption(objects: list[dict[str, Any]]) -> str:
    labels = [str(obj.get("label", "")).strip() for obj in objects if obj.get("label")]
    if labels:
        return f"An image showing {', '.join(labels[:4])} in a real-world scene."
    return "An image containing visual elements in a real-world scene."


async def analyze_visual_content(image_path: Path) -> dict[str, Any]:
    image_bytes = image_path.read_bytes()

    local_objects = _run_local_yolo(image_path)
    local_caption = _run_local_blip(image_path)

    api_objects: list[dict[str, Any]] = []
    api_warnings: list[str] = []

    try:
        api_objects = await _call_hf_object_detection(image_bytes)
    except Exception as exc:
        api_warnings.append(f"hf_object_detection_failed:{exc}")

    ocr_text: list[str] = []

    try:
        ocr_text = await _call_ocr_space(image_bytes, image_path.name)
    except Exception as exc:
        api_warnings.append(f"ocr_space_failed:{exc}")

    caption = local_caption.strip()
    if not caption:
        caption = _fallback_caption(local_objects + api_objects)

    objects = _fuse_objects(local_objects, api_objects, caption)
    scene = _infer_scene(objects, caption)

    return {
        "objects": objects,
        "caption": caption,
        "scene": scene,
        "ocr_text": ocr_text,
        "local_models": {
            "yolo_used": len(local_objects) > 0,
            "blip_used": bool(local_caption),
        },
        "external_apis": {
            "hf_detr_used": len(api_objects) > 0,
            "ocr_space_used": len(ocr_text) > 0,
            "warnings": api_warnings,
        },
    }
