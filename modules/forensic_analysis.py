from __future__ import annotations

from pathlib import Path
from typing import Any
from tempfile import NamedTemporaryFile

import cv2
import numpy as np
from PIL import Image, ImageChops


def _run_ela(image_path: Path) -> dict[str, Any]:
    with Image.open(image_path).convert("RGB") as source:
        with NamedTemporaryFile(suffix=".jpg", delete=False) as temp:
            temp_path = Path(temp.name)

        source.save(temp_path, "JPEG", quality=90)
        with Image.open(temp_path).convert("RGB") as recompressed:
            diff = ImageChops.difference(source, recompressed)
            diff_arr = np.asarray(diff).astype(np.float32)
            ela_score = float(np.mean(diff_arr) / 255.0)

    try:
        temp_path.unlink(missing_ok=True)
    except Exception:
        pass

    return {
        "ela_score": round(ela_score, 4),
        "ela_suspicious": ela_score > 0.12,
    }


def _compression_artifacts(image_path: Path) -> dict[str, Any]:
    image = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)
    if image is None:
        return {"blockiness": 0.0, "artifact_suspicious": False}

    vertical_diff = np.abs(np.diff(image.astype(np.float32), axis=1))
    horizontal_diff = np.abs(np.diff(image.astype(np.float32), axis=0))

    block_edges_v = vertical_diff[:, 7::8]
    block_edges_h = horizontal_diff[7::8, :]

    blockiness = float((np.mean(block_edges_v) + np.mean(block_edges_h)) / 2.0 / 255.0)
    return {
        "blockiness": round(blockiness, 4),
        "artifact_suspicious": blockiness > 0.10,
    }


def _noise_inconsistency(image_path: Path) -> dict[str, Any]:
    image = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)
    if image is None:
        return {"noise_inconsistency": 0.0, "noise_suspicious": False}

    denoised = cv2.GaussianBlur(image, (3, 3), 0)
    noise_map = cv2.absdiff(image, denoised)

    h, w = noise_map.shape
    h2, w2 = h // 2, w // 2
    quadrants = [
        noise_map[:h2, :w2],
        noise_map[:h2, w2:],
        noise_map[h2:, :w2],
        noise_map[h2:, w2:],
    ]

    quad_means = [float(np.mean(q)) for q in quadrants if q.size > 0]
    inconsistency = float(np.std(quad_means) / 255.0) if quad_means else 0.0

    return {
        "noise_inconsistency": round(inconsistency, 4),
        "noise_suspicious": inconsistency > 0.06,
    }


def analyze_forensic_signals(image_path: Path) -> dict[str, Any]:
    ela = _run_ela(image_path)
    compression = _compression_artifacts(image_path)
    noise = _noise_inconsistency(image_path)

    suspicious_count = sum(
        [
            bool(ela["ela_suspicious"]),
            bool(compression["artifact_suspicious"]),
            bool(noise["noise_suspicious"]),
        ]
    )

    confidence = min(1.0, 0.25 + suspicious_count * 0.2)

    return {
        "ela": ela,
        "compression_artifacts": compression,
        "noise_analysis": noise,
        "manipulation_suspicion_level": "high" if suspicious_count >= 2 else "medium" if suspicious_count == 1 else "low",
        "confidence": round(confidence, 3),
    }
