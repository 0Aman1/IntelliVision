from __future__ import annotations

from typing import Any

import spacy
import nltk


def _load_nlp():
    try:
        return spacy.load("en_core_web_sm")
    except Exception:
        return spacy.blank("en")


_NLP = _load_nlp()


def _safe_sent_tokenize(text: str) -> list[str]:
    try:
        return nltk.sent_tokenize(text)
    except Exception:
        simple = [line.strip() for line in text.split(".") if line.strip()]
        return [f"{line}." for line in simple]


def build_nlp_explanations(
    visual_analysis: dict[str, Any],
    forensic_analysis: dict[str, Any],
    steganography_analysis: dict[str, Any],
    malware_scan: dict[str, Any],
    metadata: dict[str, Any],
    pattern_analysis: dict[str, Any],
) -> dict[str, Any]:
    objects = [str(item.get("label", "")) for item in visual_analysis.get("objects", []) if item.get("label")]
    scene = str(visual_analysis.get("scene", "daily-life setting"))
    caption = str(visual_analysis.get("caption", "An image is shown."))

    doc = _NLP(caption)
    noun_like = []
    if doc.has_annotation("POS"):
        noun_like = [token.lemma_.lower() for token in doc if token.pos_ in {"NOUN", "PROPN"} and token.lemma_]

    concise_objects = ", ".join(objects[:5]) if objects else "no strongly detected objects"
    forensic_level = forensic_analysis.get("manipulation_suspicion_level", "low")
    stego_level = steganography_analysis.get("hidden_data_likelihood", "low")
    malware_level = malware_scan.get("malware_suspicion_level", "low")
    metadata_flags = metadata.get("metadata_inconsistencies", [])
    pattern_level = pattern_analysis.get("pattern_risk", "low")

    summary = (
        f"Visual analysis indicates {scene} context with {concise_objects}. "
        f"Forensic manipulation suspicion is {forensic_level}, steganography likelihood is {stego_level}, "
        f"malware signature risk is {malware_level}, and pattern risk is {pattern_level}."
    )

    if metadata_flags:
        summary += f" Metadata anomalies include: {', '.join(metadata_flags)}."

    sentences = _safe_sent_tokenize(summary)

    return {
        "summary": summary,
        "sentences": sentences,
        "caption_nouns": list(dict.fromkeys(noun_like))[:12],
    }
