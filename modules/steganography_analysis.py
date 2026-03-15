from __future__ import annotations

from pathlib import Path
from typing import Any

import cv2
import numpy as np


def _bit_plane_metrics(image: np.ndarray) -> dict[str, Any]:
    lsb = image & 1
    lsb_ratio = float(np.mean(lsb))
    return {
        "lsb_one_ratio": round(lsb_ratio, 4),
        "lsb_balance_deviation": round(abs(lsb_ratio - 0.5), 4),
    }


def _entropy(signal: np.ndarray) -> float:
    values, counts = np.unique(signal, return_counts=True)
    probs = counts.astype(np.float64) / np.sum(counts)
    ent = -np.sum(probs * np.log2(probs + 1e-12))
    return float(ent)


def analyze_steganography(image_path: Path) -> dict[str, Any]:
    image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if image is None:
        return {
            "lsb_suspicion_score": 0.0,
            "hidden_data_likelihood": "unknown",
            "evidence": ["image_read_failed"],
        }

    channels = cv2.split(image)
    lsb_metrics = [_bit_plane_metrics(channel) for channel in channels]

    lsb_stream = np.concatenate([(channel & 1).flatten() for channel in channels])
    lsb_entropy = _entropy(lsb_stream)

    deviations = [metric["lsb_balance_deviation"] for metric in lsb_metrics]
    deviation_mean = float(np.mean(deviations))

    suspicion_score = min(1.0, (abs(lsb_entropy - 1.0) * 0.7) + (deviation_mean * 2.0))

    if suspicion_score > 0.45:
        likelihood = "high"
    elif suspicion_score > 0.25:
        likelihood = "medium"
    else:
        likelihood = "low"

    return {
        "lsb_channel_metrics": {
            "blue": lsb_metrics[0],
            "green": lsb_metrics[1],
            "red": lsb_metrics[2],
        },
        "lsb_entropy": round(lsb_entropy, 4),
        "lsb_suspicion_score": round(suspicion_score, 4),
        "hidden_data_likelihood": likelihood,
        "evidence": [
            f"entropy={round(lsb_entropy, 4)}",
            f"deviation_mean={round(deviation_mean, 4)}",
        ],
    }
