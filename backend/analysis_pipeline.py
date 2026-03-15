from __future__ import annotations

from pathlib import Path
from typing import Any

from modules.metadata_analysis import analyze_metadata
from modules.visual_analysis import analyze_visual_content
from modules.forensic_analysis import analyze_forensic_signals
from modules.steganography_analysis import analyze_steganography
from modules.malware_scan import analyze_malware_signatures
from modules.pattern_analysis import analyze_patterns
from modules.nlp_engine import build_nlp_explanations
from modules.perspective_engine import build_perspectives


async def run_full_analysis(image_path: Path, original_filename: str) -> dict[str, Any]:
    image_info: dict[str, Any] = {
        "filename": original_filename,
        "stored_path": str(image_path),
        "size_bytes": image_path.stat().st_size,
    }

    metadata = analyze_metadata(image_path)
    visual_analysis = await analyze_visual_content(image_path)
    forensic_analysis = analyze_forensic_signals(image_path)
    steganography_analysis = analyze_steganography(image_path)
    malware_scan = analyze_malware_signatures(image_path)
    pattern_analysis = analyze_patterns(image_path)

    nlp_explanations = build_nlp_explanations(
        visual_analysis=visual_analysis,
        forensic_analysis=forensic_analysis,
        steganography_analysis=steganography_analysis,
        malware_scan=malware_scan,
        metadata=metadata,
        pattern_analysis=pattern_analysis,
    )

    perspectives = build_perspectives(
        visual_analysis=visual_analysis,
        forensic_analysis=forensic_analysis,
        steganography_analysis=steganography_analysis,
        malware_scan=malware_scan,
        metadata=metadata,
        pattern_analysis=pattern_analysis,
        nlp_explanations=nlp_explanations,
    )

    compatibility = {
        "objects": visual_analysis.get("objects", []),
        "text": visual_analysis.get("ocr_text", []),
        "scene": visual_analysis.get("scene", ""),
        "caption": visual_analysis.get("caption", ""),
    }

    return {
        "image_info": image_info,
        "visual_analysis": visual_analysis,
        "forensic_analysis": forensic_analysis,
        "steganography_analysis": steganography_analysis,
        "malware_scan": malware_scan,
        "metadata": metadata,
        "pattern_analysis": pattern_analysis,
        "nlp_summary": nlp_explanations,
        "perspectives": perspectives,
        "compatibility": compatibility,
        **compatibility,
    }
