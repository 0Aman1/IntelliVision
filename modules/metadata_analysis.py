from __future__ import annotations

from pathlib import Path
from typing import Any
import re

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


_BASE64_LIKE_RE = re.compile(r"[A-Za-z0-9+/]{80,}={0,2}")
_SCRIPT_LIKE_PATTERNS = [
    "powershell",
    "cmd.exe",
    "wscript",
    "cscript",
    "mshta",
    "eval(",
    "<script",
    "javascript:",
    "frombase64string",
    "invoke-expression",
]
_PAYLOAD_LIKE_SUBSTRINGS = [
    "mz",  # PE header in ASCII sometimes shows up in tag text
    "pk",  # ZIP header markers
    "pe",
    "shellcode",
]


def _scan_metadata_values_for_suspicion(exif_tags: dict[str, str]) -> list[str]:
    """
    Scan stringified EXIF tag values for base64/script/payload-like substrings.
    This is heuristic and intended to surface likely hidden payload artifacts.
    """
    flags: list[str] = []

    # Join limited preview to avoid huge scans.
    values = list(exif_tags.values())[:200]
    blob = " ".join(v for v in values if isinstance(v, str))
    blob_lower = blob.lower()

    # Script-like markers
    if any(p in blob_lower for p in _SCRIPT_LIKE_PATTERNS):
        flags.append("script_fragment_in_metadata")

    # Base64-like markers
    if _BASE64_LIKE_RE.search(blob):
        flags.append("base64_like_payload_in_metadata")

    # Payload-ish markers (ASCII appearances)
    if any(s in blob_lower for s in _PAYLOAD_LIKE_SUBSTRINGS):
        flags.append("binary_signature_like_text_in_metadata")

    return list(dict.fromkeys(flags))


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


def _parse_rational(token: str) -> float:
    token = token.strip()
    if "/" in token:
        num, den = token.split("/", 1)
        try:
            return float(int(num)) / float(int(den) if int(den) != 0 else 1)
        except Exception:
            try:
                return float(num) / float(den or "1")
            except Exception:
                return 0.0
    try:
        return float(token)
    except Exception:
        return 0.0


def _parse_dms(value: str, ref: str) -> float | None:
    parts = [p.strip() for p in value.replace("[", "").replace("]", "").split(",")]
    if not parts:
        return None
    deg = _parse_rational(parts[0]) if len(parts) > 0 else 0.0
    minutes = _parse_rational(parts[1]) if len(parts) > 1 else 0.0
    seconds = _parse_rational(parts[2]) if len(parts) > 2 else 0.0
    decimal = deg + minutes / 60.0 + seconds / 3600.0
    ref = (ref or "").upper().strip()
    if ref in {"S", "W"}:
        decimal = -decimal
    return decimal


def _extract_gps_decimal(exif_tags: dict[str, str]) -> dict[str, Any]:
    lat_raw = exif_tags.get("GPS GPSLatitude", "") or exif_tags.get("GPS Latitude", "")
    lon_raw = exif_tags.get("GPS GPSLongitude", "") or exif_tags.get("GPS Longitude", "")
    lat_ref = exif_tags.get("GPS GPSLatitudeRef", "") or exif_tags.get("GPS LatitudeRef", "")
    lon_ref = exif_tags.get("GPS GPSLongitudeRef", "") or exif_tags.get("GPS LongitudeRef", "")
    lat = _parse_dms(lat_raw, lat_ref) if lat_raw else None
    lon = _parse_dms(lon_raw, lon_ref) if lon_raw else None
    result: dict[str, Any] = {}
    if lat is not None and lon is not None:
        result["lat"] = round(lat, 6)
        result["lon"] = round(lon, 6)
    return result


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
    gps_decimal = _extract_gps_decimal(exif_tags)

    anomaly_flags: list[str] = []
    if suspicious_software:
        anomaly_flags.append("editing_software_detected")
    if not has_camera_make and not has_camera_model:
        anomaly_flags.append("missing_camera_identity")
    if not exif_tags:
        anomaly_flags.append("missing_exif")

    # Heuristic scan of tag strings for embedded payload artifacts.
    # (Only if we have any EXIF-like tags to inspect.)
    if exif_tags:
        anomaly_flags.extend(_scan_metadata_values_for_suspicion(exif_tags))

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
        "gps": "present" if gps_decimal else ("present" if has_gps else "not_available"),
        "gps_decimal": gps_decimal if gps_decimal else None,
        "editing_software": software or "not_available",
        "metadata_inconsistencies": anomaly_flags,
        "raw_exif_preview": {k: exif_tags[k] for k in list(exif_tags.keys())[:20]},
        "piexif_summary": piexif_data,
    }
