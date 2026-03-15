from __future__ import annotations

from typing import Any


def _risk_score(
    visual_analysis: dict[str, Any],
    forensic_analysis: dict[str, Any],
    steganography_analysis: dict[str, Any],
    malware_scan: dict[str, Any],
    metadata: dict[str, Any],
    pattern_analysis: dict[str, Any],
) -> tuple[int, str]:
    score = 10

    scene = str(visual_analysis.get("scene", "")).lower()
    object_labels = [str(item.get("label", "")).lower() for item in visual_analysis.get("objects", [])]

    if any(item in object_labels for item in ["gun", "knife", "weapon", "explosion", "fire"]):
        score += 35
    if any(item in object_labels for item in ["car", "truck", "bus", "motorcycle", "traffic"]):
        score += 14
    if any(token in scene for token in ["cliff", "mountain", "coastal", "water"]):
        score += 10

    if forensic_analysis.get("manipulation_suspicion_level") == "high":
        score += 20
    elif forensic_analysis.get("manipulation_suspicion_level") == "medium":
        score += 10

    if steganography_analysis.get("hidden_data_likelihood") == "high":
        score += 20
    elif steganography_analysis.get("hidden_data_likelihood") == "medium":
        score += 10

    if malware_scan.get("malware_suspicion_level") == "high":
        score += 25
    elif malware_scan.get("malware_suspicion_level") == "medium":
        score += 12

    if pattern_analysis.get("pattern_risk") == "high":
        score += 10
    elif pattern_analysis.get("pattern_risk") == "medium":
        score += 5

    score += min(10, len(metadata.get("metadata_inconsistencies", [])) * 3)
    score = max(0, min(100, score))

    if score >= 70:
        level = "high"
    elif score >= 40:
        level = "medium"
    else:
        level = "low"

    return score, level


def build_perspectives(
    visual_analysis: dict[str, Any],
    forensic_analysis: dict[str, Any],
    steganography_analysis: dict[str, Any],
    malware_scan: dict[str, Any],
    metadata: dict[str, Any],
    pattern_analysis: dict[str, Any],
    nlp_explanations: dict[str, Any],
) -> dict[str, str]:
    score, threat = _risk_score(
        visual_analysis,
        forensic_analysis,
        steganography_analysis,
        malware_scan,
        metadata,
        pattern_analysis,
    )

    scene = visual_analysis.get("scene", "daily-life setting")
    objects = [str(item.get("label", "")) for item in visual_analysis.get("objects", []) if item.get("label")]
    object_text = ", ".join(objects[:6]) if objects else "limited detectable objects"

    forensic_level = forensic_analysis.get("manipulation_suspicion_level", "low")
    stego_level = steganography_analysis.get("hidden_data_likelihood", "low")
    malware_level = malware_scan.get("malware_suspicion_level", "low")

    metadata_flags = metadata.get("metadata_inconsistencies", [])
    metadata_note = ", ".join(metadata_flags) if metadata_flags else "no strong metadata inconsistencies"

    agent = (
        f"Security assessment indicates {threat} operational threat with risk score {score}/100. "
        f"The image context is '{scene}' with observed elements: {object_text}. "
        f"Manipulation risk is {forensic_level}, hidden data likelihood is {stego_level}, and malware signature risk is {malware_level}."
    )

    detective = (
        f"Forensic evidence suggests scene '{scene}' and object clues: {object_text}. "
        f"Compression/noise analysis indicates manipulation suspicion '{forensic_level}'. "
        f"Steganography analysis is '{stego_level}', malware scan is '{malware_level}', and metadata clues indicate {metadata_note}."
    )

    user = (
        f"This image appears to show {scene} with visible elements such as {object_text}. "
        f"Overall checks found {forensic_level} editing concern, {stego_level} hidden-data concern, and {malware_level} malware concern."
    )

    if nlp_explanations.get("summary"):
        user += f" Summary: {nlp_explanations['summary']}"

    return {
        "agent": agent,
        "detective": detective,
        "user": user,
    }
