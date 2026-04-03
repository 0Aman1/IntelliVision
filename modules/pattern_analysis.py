from __future__ import annotations

from pathlib import Path
from typing import Any

import cv2
import numpy as np
from skimage.feature import graycomatrix, graycoprops


def _repeated_block_score(gray: np.ndarray, block_size: int = 16) -> float:
    if len(gray.shape) == 3:
        if gray.shape[2] == 3:
            gray = cv2.cvtColor(gray, cv2.COLOR_BGR2GRAY)
        elif gray.shape[2] == 4:
            gray = cv2.cvtColor(gray, cv2.COLOR_BGRA2GRAY)
        else:
            gray = gray[:, :, 0]
    
    h, w = gray.shape
    h2 = h - (h % block_size)
    w2 = w - (w % block_size)
    cropped = gray[:h2, :w2]
    if cropped.size == 0:
        return 0.0

    blocks = cropped.reshape(h2 // block_size, block_size, w2 // block_size, block_size)
    blocks = blocks.swapaxes(1, 2).reshape(-1, block_size, block_size)

    fingerprints = [int(np.mean(block) // 8) for block in blocks]
    unique, counts = np.unique(fingerprints, return_counts=True)
    repeated = np.sum(counts[counts > 1])
    return float(repeated / max(1, len(blocks)))


def _texture_irregularity(gray: np.ndarray) -> float:
    if len(gray.shape) == 3:
        if gray.shape[2] == 3:
            gray = cv2.cvtColor(gray, cv2.COLOR_BGR2GRAY)
        elif gray.shape[2] == 4:
            gray = cv2.cvtColor(gray, cv2.COLOR_BGRA2GRAY)
        else:
            gray = gray[:, :, 0]
    
    reduced = (gray // 16).astype(np.uint8)
    glcm = graycomatrix(reduced, distances=[1], angles=[0], levels=16, symmetric=True, normed=True)
    contrast = float(graycoprops(glcm, "contrast")[0, 0])
    homogeneity = float(graycoprops(glcm, "homogeneity")[0, 0])
    return float((contrast / 10.0) + (1.0 - homogeneity))


def _noise_irregularity(gray: np.ndarray) -> float:
    if len(gray.shape) == 3:
        if gray.shape[2] == 3:
            gray = cv2.cvtColor(gray, cv2.COLOR_BGR2GRAY)
        elif gray.shape[2] == 4:
            gray = cv2.cvtColor(gray, cv2.COLOR_BGRA2GRAY)
        else:
            gray = gray[:, :, 0]
    
    denoised = cv2.medianBlur(gray, 3)
    residual = cv2.absdiff(gray, denoised)

    h, w = residual.shape
    grid_h = max(2, h // 64)
    grid_w = max(2, w // 64)

    cell_h = h // grid_h
    cell_w = w // grid_w
    values = []
    for i in range(grid_h):
        for j in range(grid_w):
            y0, y1 = i * cell_h, (i + 1) * cell_h
            x0, x1 = j * cell_w, (j + 1) * cell_w
            patch = residual[y0:y1, x0:x1]
            if patch.size > 0:
                values.append(float(np.mean(patch)))

    if not values:
        return 0.0

    return float(np.std(values) / 255.0)


def analyze_patterns(image_path: Path) -> dict[str, Any]:
    img_path = str(image_path.resolve())
    gray = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    
    if gray is None or len(gray.shape) == 0:
        return {
            "repeated_blocks": 0.0,
            "texture_irregularity": 0.0,
            "noise_inconsistency": 0.0,
            "pattern_risk": "unknown",
            "unique_patterns": [],
            "duplicates_removed_count": 0,
            "duplicates_top": [],
        }
    if len(gray.shape) == 3:
        try:
            gray = cv2.cvtColor(gray, cv2.COLOR_BGR2GRAY)
        except Exception:
            gray = gray[:, :, 0]
    
    repeated_blocks = _repeated_block_score(gray)
    texture_irreg = _texture_irregularity(gray)
    noise_irreg = _noise_irregularity(gray)

    combined = (repeated_blocks * 0.45) + (texture_irreg * 0.35) + (noise_irreg * 0.2)

    if combined > 0.55:
        risk = "high"
    elif combined > 0.28:
        risk = "medium"
    else:
        risk = "low"

    block_size = 16
    h, w = gray.shape
    h2 = h - (h % block_size)
    w2 = w - (w % block_size)
    if h2 <= 0 or w2 <= 0:
        return {
            "repeated_blocks": round(repeated_blocks, 4),
            "texture_irregularity": round(texture_irreg, 4),
            "noise_inconsistency": round(noise_irreg, 4),
            "pattern_risk": risk,
            "unique_patterns": [],
            "duplicates_removed_count": 0,
            "duplicates_top": [],
        }

    grad_x = cv2.Sobel(gray[:h2, :w2], cv2.CV_32F, 1, 0, ksize=3)
    grad_y = cv2.Sobel(gray[:h2, :w2], cv2.CV_32F, 0, 1, ksize=3)
    grad_mag = cv2.magnitude(grad_x, grad_y)

    signatures: dict[str, dict[str, Any]] = {}
    order: list[str] = []
    total_blocks = 0
    for by in range(0, h2, block_size):
        for bx in range(0, w2, block_size):
            block = gray[by:by + block_size, bx:bx + block_size]
            gblock = grad_mag[by:by + block_size, bx:bx + block_size]
            if block.size == 0 or gblock.size == 0:
                continue
            total_blocks += 1
            mean_intensity = float(np.mean(block))
            mean_grad = float(np.mean(gblock))
            q_mean = round(mean_intensity / 4.0) / 64.0
            q_grad = round(mean_grad / 16.0) / 16.0
            signature = f"{q_mean:.4f}|{q_grad:.4f}"
            if signature not in signatures:
                signatures[signature] = {
                    "y": by,
                    "x": bx,
                    "block_size": block_size,
                    "mean": round(mean_intensity, 2),
                    "grad": round(mean_grad, 2),
                    "frequency": 1,
                }
                order.append(signature)
            else:
                signatures[signature]["frequency"] += 1

    unique_patterns = [signatures[s] for s in order]
    duplicates_removed_count = max(0, total_blocks - len(unique_patterns))
    top = sorted(
        [dict(sig=k, count=v["frequency"]) for k, v in signatures.items()],
        key=lambda d: d["count"],
        reverse=True,
    )[:10]

    return {
        "repeated_blocks": round(repeated_blocks, 4),
        "texture_irregularity": round(texture_irreg, 4),
        "noise_inconsistency": round(noise_irreg, 4),
        "pattern_risk": risk,
        "unique_patterns": unique_patterns,
        "duplicates_removed_count": duplicates_removed_count,
        "duplicates_top": top,
    }
