# INTELLIVISION FORENSICS — Technical Documentation

## 1. PROJECT OVERVIEW

IntelliVision Forensics is an AI-powered digital image forensics system designed to analyze uploaded images for security, authenticity, and hidden-threat indicators.

The system investigates:

- image manipulation
- hidden data
- LSB steganography
- suspicious metadata
- malware signatures
- unusual image patterns
- visual content inside the image

The platform combines computer vision, digital forensics, steganography analysis, malware pattern scanning, and NLP explanation generation to produce decision-ready outputs.

The system generates three explanation perspectives:

- **Agent Perspective**: security-centric risk and anomaly interpretation.
- **Detective Perspective**: evidence- and clue-centric forensic interpretation.
- **User Perspective**: plain-language explanation for non-technical users.

Each perspective is generated as natural-language narrative and backed by structured analysis results.

---

## 2. SYSTEM ARCHITECTURE

### Processing pipeline

Image Upload  
↓  
Metadata Analysis  
↓  
Visual Understanding (AI models + APIs)  
↓  
Forensic Manipulation Detection  
↓  
Steganography Detection  
↓  
Malware Signature Scan  
↓  
Pattern Analysis  
↓  
Semantic Fusion  
↓  
NLP Processing  
↓  
Perspective Generation  
↓  
Final Output

### Module interaction

1. **Upload + validation** accepts image file and stores a temporary/managed copy.
2. **Metadata module** extracts EXIF/XMP-like properties and checks anomalies.
3. **Visual module** runs local models (YOLO + BLIP) and external APIs (HF + OCR) and merges outputs.
4. **Forensic module** evaluates compression inconsistencies, ELA artifacts, and noise clues.
5. **Steganography module** tests LSB statistical irregularities and entropy signals.
6. **Malware module** scans binary payload for signatures and suspicious embedded fragments.
7. **Pattern module** measures repeated blocks, texture irregularity, and noise inconsistency.
8. **Fusion layer** normalizes all findings into unified semantic evidence.
9. **NLP + perspective engines** convert evidence to readable narratives.

The architecture is modular, so each analyzer can fail independently while still producing resilient final output.

---

## 3. HYBRID AI STRATEGY

IntelliVision Forensics uses both local AI models and external APIs for redundancy and reliability.

### Local models

- **YOLOv8** for object detection.
- **BLIP** for image captioning.

### External APIs

- **Hugging Face Inference API** for additional object/scene understanding.
- **OCR.space API** for robust text extraction.

### Why hybrid

- Improves robustness when one provider/model is unavailable.
- Reduces single-point failure in interpretation.
- Provides cross-validation between local and remote inferences.
- Improves coverage across image types (clean, noisy, edited, low-light, stylized).

---

## 4. DIGITAL IMAGE FORENSICS TECHNIQUES

The forensic engine combines multiple complementary methods:

1. **Error Level Analysis (ELA)**
   - Recompresses image and computes pixel-level difference map.
   - Highlights regions with inconsistent recompression behavior.

2. **Compression artifact analysis**
   - Measures blockiness and JPEG-like structural residuals.
   - Flags anomalous artifact concentration regions.

3. **Noise inconsistency detection**
   - Compares local noise characteristics across patches.
   - Detects abrupt noise-profile transitions that may indicate tampering.

4. **Clone detection (lightweight)**
   - Uses repeated patch/block similarity checks.
   - Identifies copy-move style duplicated regions.

5. **Steganography detection link-in**
   - Uses LSB statistical behavior to flag hidden payload patterns.

6. **Binary signature scanning link-in**
   - Checks for embedded payload/header signatures.

7. **Metadata anomaly detection**
   - Detects missing camera fields, suspicious software tags, timestamp anomalies, and inconsistent metadata pairs.

---

## 5. STEGANOGRAPHY DETECTION

The steganography module targets **Least Significant Bit (LSB)** hiding behavior.

Techniques:

- **Bit plane extraction**
  - Extracts LSB planes from RGB channels.
  - Computes distribution irregularity and channel imbalance.

- **Pixel entropy analysis**
  - Estimates entropy of LSB stream and compares against expected natural-image behavior.

- **LSB distribution comparison**
  - Evaluates 0/1 LSB balance and local-window variance.
  - Excessively uniform/random anomalies indicate potential hidden embedding.

The output includes a suspicion score and evidence indicators rather than hard binary claims.

---

## 6. MALWARE SCANNING

The malware scan module inspects raw image binary for suspicious embedded payloads.

Detection targets:

- ZIP headers (`PK\x03\x04`)
- PE executable signatures (`MZ`, `PE\x00\x00`)
- Base64-like payload fragments
- Script fragments (`<script`, `powershell`, `cmd.exe`, etc.)
- Embedded archive signatures

Tools and strategy:

- **YARA**
  - Signature-based matching for malware-like strings and byte patterns.

- **Binwalk**
  - Embedded file/component discovery in binary streams.

When optional tools are unavailable, graceful fallback regex/signature scanning remains active.

---

## 7. NLP EXPLANATION ENGINE

Structured forensic evidence is converted to human-readable explanations.

Libraries:

- **spaCy** for noun/entity extraction and sentence-ready semantic normalization.
- **NLTK** for lightweight text shaping and narrative post-processing.

NLP responsibilities:

- summarize visual findings,
- summarize forensic and anomaly signals,
- map confidence/severity to readable language,
- avoid technical overload for user-facing perspective.

---

## 8. THREE PERSPECTIVE SYSTEM

### Agent Perspective

Security-oriented interpretation emphasizing:

- anomaly severity,
- manipulation/stego/malware risk,
- operational threat score,
- actionable caution summary.

### Detective Perspective

Evidence-oriented interpretation emphasizing:

- forensic clues,
- metadata inconsistencies,
- possible manipulation pathways,
- relationship between visual and binary findings.

### User Perspective

Simple narrative emphasizing:

- what the image likely contains,
- whether anything suspicious is detected,
- plain-language confidence and caution statement.

---

## 9. EXPECTED OUTPUT FORMAT

```json
{
  "image_info": {},
  "visual_analysis": {},
  "forensic_analysis": {},
  "steganography_analysis": {},
  "malware_scan": {},
  "metadata": {},
  "perspectives": {
    "agent": "",
    "detective": "",
    "user": ""
  }
}
```

### Notes on API contract

- The backend also includes compatibility fields (when needed) for integration with the existing IntelliVision frontend.
- Missing or failed module outputs are represented with explicit status/evidence fields, not silent empty objects.
