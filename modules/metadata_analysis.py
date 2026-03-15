from __future__ import annotations

from pathlib import Path
from typing import Any

from PIL import Image

try:
    import exifread
except Exception:
    exifread = None

try:
    import piexif
except Exception:
    piexif = None


SUSPICIOUS_EDIT_SOFTWARE = {
    "photoshop",
    "gimp",
    "snapseed",
    "lightroom",
    "canva",
    "pixlr",
}


def _extract_exifread_tags(image_path: Path) -> dict[str, str]:
    if exifread is None:
        return {}
    with image_path.open("rb") as image_file:
        tags = exifread.process_file(image_file, details=False)
    return {str(k): str(v) for k, v in tags.items()}


def _extract_piexif_data(image_path: Path) -> dict[str, Any]:
    if piexif is None:
        return {}
    try:
        exif_dict = piexif.load(str(image_path))
    except Exception:
        return {}
    return {str(k): str(v) for k, v in exif_dict.items()}


def analyze_metadata(image_path: Path) -> dict[str, Any]:
    exif_tags = _extract_exifread_tags(image_path)
    piexif_data = _extract_piexif_data(image_path)

    with Image.open(image_path) as image:
        width, height = image.size
        image_mode = image.mode
        image_format = image.format

    software = ""
    for key, value in exif_tags.items():
        if "Software" in key:
            software = value
            break

    software_lower = software.lower()
    suspicious_software = any(name in software_lower for name in SUSPICIOUS_EDIT_SOFTWARE)

    has_gps = any("GPS" in key for key in exif_tags.keys())
    has_camera_make = any("Image Make" in key for key in exif_tags.keys())
    has_camera_model = any("Image Model" in key for key in exif_tags.keys())

    anomaly_flags: list[str] = []
    if suspicious_software:
        anomaly_flags.append("editing_software_detected")
    if not has_camera_make and not has_camera_model:
        anomaly_flags.append("missing_camera_identity")
    if not exif_tags:
        anomaly_flags.append("missing_exif")

    return {
        "basic_info": {
            "width": width,
            "height": height,
            "mode": image_mode,
            "format": image_format,
            "size_bytes": image_path.stat().st_size,
        },
        "camera_model": exif_tags.get("Image Model", "not_available"),
        "timestamp": exif_tags.get("EXIF DateTimeOriginal", "not_available"),
        "gps": "present" if has_gps else "not_available",
        "editing_software": software or "not_available",
        "metadata_inconsistencies": anomaly_flags,
        "raw_exif_preview": {k: exif_tags[k] for k in list(exif_tags.keys())[:20]},
        "piexif_summary": piexif_data,
    }
