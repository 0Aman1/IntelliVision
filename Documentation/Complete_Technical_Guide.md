# IntelliVision Forensics - Complete Technical Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Core Modules](#core-modules)
5. [Analysis Pipeline](#analysis-pipeline)
6. [Forensic Techniques](#forensic-techniques)
7. [AI/ML Components](#aiml-components)
8. [API Documentation](#api-documentation)
9. [Data Flow](#data-flow)
10. [Deployment & Performance](#deployment--performance)

---

## Project Overview

### What is IntelliVision Forensics?

IntelliVision Forensics is an **AI-powered digital image forensics and analysis system** designed to detect:
- **Image manipulation** (copy-paste, cloning, splicing)
- **Steganography** (hidden data in LSBs, entropy variations)
- **Malware signatures** (embedded payloads, suspicious binary patterns)
- **Metadata anomalies** (EXIF inconsistencies, timestamp manipulation)
- **Visual threats** (objects, scenes, risks, crowd analysis)
- **Pattern anomalies** (compression artifacts, noise inconsistencies)

### Key Characteristics

| Aspect | Value |
|--------|-------|
| **Architecture** | Monolithic, single-process, synchronous |
| **Processing Model** | Request/Response (no queues, no task storage) |
| **Python Version** | 3.11+ |
| **Frontend Framework** | React 18+ with TypeScript & Vite |
| **Backend Framework** | FastAPI + Uvicorn |
| **AI Strategy** | Hybrid (local models + external APIs) |
| **Response Time** | Synchronous (blocks until analysis completes) |

---

## System Architecture

### High-Level Flow

```
┌─────────────────┐
│  User Uploads   │
│    Image        │
└────────┬────────┘
         │
         v
┌─────────────────────────────────────┐
│   FastAPI Backend (Single Process)  │
│   ├─ Validate & Store Image         │
│   ├─ Run Analysis Pipeline          │
│   └─ Return Full JSON Response      │
└─────────────────────────────────────┘
         │
         v
┌─────────────────────────────────────┐
│   Analysis Pipeline (Sequential)    │
│   ├─ Metadata Analysis              │
│   ├─ Visual Content Analysis        │
│   ├─ Forensic Signal Detection      │
│   ├─ Steganography Analysis         │
│   ├─ Malware Signature Scan         │
│   ├─ Pattern Analysis               │
│   ├─ NLP Explanation Generation     │
│   └─ Perspective Building           │
└─────────────────────────────────────┘
         │
         v
┌─────────────────────────────────────┐
│   Browser (React SPA)               │
│   ├─ Display Analysis Results       │
│   ├─ Visualize Heatmaps & Scores    │
│   ├─ Interactive UI                 │
│   └─ Dark/Light Mode                │
└─────────────────────────────────────┘
```

### Project Directory Structure

```
intellivision-forensics/
├── backend/
│   ├── main.py                      # FastAPI app entry point
│   ├── config.py                    # Configuration settings
│   ├── analysis_pipeline.py         # Main orchestration
│   ├── __init__.py
│   └── uploads/                     # Temporary image storage
│
├── modules/
│   ├── __init__.py
│   ├── metadata_analysis.py         # EXIF/XMP extraction
│   ├── visual_analysis.py           # YOLO + BLIP + OCR
│   ├── forensic_analysis.py         # ELA + compression + noise
│   ├── steganography_analysis.py    # LSB + entropy detection
│   ├── malware_scan.py              # Binary signature scanning
│   ├── pattern_analysis.py          # Pattern anomalies
│   ├── nlp_engine.py                # NLP processing
│   └── perspective_engine.py        # Perspective generation
│
├── Frontend/
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # Main app component
│   │   ├── index.css                # Global styles
│   │   └── components/
│   │       ├── HomePage.tsx
│   │       ├── UploadPage.tsx
│   │       ├── ImageUpload.tsx
│   │       ├── ProcessedImageScreen.tsx
│   │       ├── ResultsSection.tsx
│   │       ├── InsightsPanel.tsx
│   │       ├── DarkModeToggle.tsx
│   │       ├── SideNavigation.tsx
│   │       ├── ContactPage.tsx
│   │       └── Footer.tsx
│   ├── vite.config.ts
│   ├── package.json
│   └── build/                       # Production build
│
├── models/
│   ├── blip/                        # BLIP model files
│   └── yolo/                        # YOLOv8 files
│
├── Documentation/
│   ├── API_Reference.md
│   ├── Architecture.md
│   ├── Complete_Technical_Guide.md  # This file
│   ├── Master_Technical_Reference.md
│   ├── System_Requirements.md
│   └── Testing_Guide.md
│
├── requirements.txt                 # Python dependencies
├── HowToRun.md                      # Setup & run instructions
├── README.md                        # Project overview
└── PROJECT_DOCUMENTATION.md         # Detailed documentation
```

---

## Technology Stack

### Backend

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Web Framework** | FastAPI 0.100+ | Async REST API |
| **ASGI Server** | Uvicorn | High-performance async server |
| **Language** | Python 3.11+ | Core implementation |
| **Image Processing** | OpenCV, Pillow, NumPy, SciPy | Image manipulation & analysis |

### AI/ML Libraries

| Library | Version | Purpose |
|----------|---------|---------|
| **PyTorch** | 2.0+ | Deep learning framework |
| **Ultralytics** | YOLO v8 | Object detection |
| **Transformers** | Hugging Face | BLIP image captioning |
| **EasyOCR** | Latest | Text extraction from images |
| **Tesseract-OCR** | Fallback OCR | Alternative text extraction |
| **spaCy** | 3.5+ | NLP & entity extraction |
| **NLTK** | 3.8+ | Natural language toolkit |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18+ | UI framework |
| **TypeScript** | 5.0+ | Type-safe JavaScript |
| **Vite** | 4.0+ | Build tool & dev server |
| **Tailwind CSS** | Latest | Utility-first CSS |
| **HTML2Canvas** | Latest | Screenshot capture |
| **jsPDF** | Latest | PDF generation |
| **DOMPurify** | Latest | HTML sanitization |

### Optional APIs

- **Hugging Face Inference API** - Enhanced object/scene classification
- **OCR.Space API** - Alternative text extraction
- **VirusTotal API** (future) - Malware signature verification

---

## Core Modules

### 1. Metadata Analysis Module
**File:** `modules/metadata_analysis.py`

**Purpose:** Extract and validate EXIF/XMP metadata

**Key Features:**
- EXIF extraction (camera, GPS, timestamp)
- Creation/modification time checks
- Timestamp consistency validation
- Suspicious metadata patterns

**Output Structure:**
```python
{
    "exif_data": { ... },
    "creation_date": "2024-01-15",
    "modification_date": "2024-01-15",
    "metadata_inconsistencies": ["timestamp_mismatch", ...],
    "risk_level": "low|medium|high"
}
```

### 2. Visual Analysis Module
**File:** `modules/visual_analysis.py`

**Purpose:** Extract visual content using local & API-based models

**Components:**
- **YOLOv8** object detection
- **BLIP** image captioning
- **EasyOCR/Tesseract** text extraction
- **Hugging Face API** scene classification
- **OCR.Space API** fallback OCR

**Output Structure:**
```python
{
    "objects": [{"label": "person", "confidence": 0.95, "bounding_box": [...]}],
    "caption": "A person looking at a scenic sunset",
    "scene": "outdoor-landscape",
    "ocr_text": ["Sign text", "Label text"],
    "faces_detected": 2,
    "risk_indicators": ["crowd_density_high", ...]
}
```

### 3. Forensic Analysis Module
**File:** `modules/forensic_analysis.py`

**Purpose:** Detect image manipulation through forensic techniques

**Forensic Techniques:**

#### Error Level Analysis (ELA)
- Recompress image at 90% quality
- Calculate pixel-level differences
- Highlights regions with inconsistent compression

#### Compression Artifact Detection
- Detect JPEG block boundaries (8×8 blocks)
- Measure edge transitions at block boundaries
- High "blockiness" = suspicious

#### Noise Inconsistency Analysis
- Divide image into quadrants
- Measure noise variance across regions
- Inconsistent noise = possible splicing

**Output Structure:**
```python
{
    "ela": {
        "ela_score": 0.08,
        "ela_suspicious": False
    },
    "compression_artifacts": {
        "blockiness": 0.05,
        "artifact_suspicious": False
    },
    "noise_analysis": {
        "noise_inconsistency": 0.03,
        "noise_suspicious": False
    },
    "manipulation_suspicion_level": "low|medium|high",
    "confidence": 0.75
}
```

### 4. Steganography Analysis Module
**File:** `modules/steganography_analysis.py`

**Purpose:** Detect hidden data in LSB (Least Significant Bits)

**Detection Techniques:**

#### Bit-Plane Analysis
- Extract each bit-plane (0-7)
- Measure bit distribution uniformity
- Expected balanced distribution (50% 0s, 50% 1s)
- LSB hiding creates imbalance

#### Entropy Metrics
- Calculate Shannon entropy per channel
- Higher entropy in stolen data = suspicious
- Compare LSB entropy to expected baseline

#### Chi-Square Uniformity Test
- Statistical test for uniform Bernoulli(0.5) distribution
- Low chi-square = likely random/noise
- High chi-square = suspicious pattern

#### Block-Level LSB Uniformity
- Divide image into 8×8 blocks
- Analyze LSB consistency within blocks
- Inconsistency = data hiding evidence

**Output Structure:**
```python
{
    "lsb_analysis": {
        "bit_plane_0": {"one_ratio": 0.52, "balance_deviation": 0.02},
        "entropy": 6.8,
        "chi_square": 12.5,
        "block_uniformity": 0.85
    },
    "hidden_data_likelihood": "low|medium|high",
    "confidence": 0.68
}
```

### 5. Malware Signature Scan Module
**File:** `modules/malware_scan.py`

**Purpose:** Detect embedded malware signatures

**Detection Methods:**
- Binary signature matching (PE headers, ELF headers)
- Entropy analysis (packed/encrypted payloads)
- Executable pattern detection
- Known malware signature database

**Output Structure:**
```python
{
    "signatures_detected": ["trojan_generic", ...],
    "embedded_executables": ["PE32", ...],
    "entropy_score": 7.2,
    "malware_suspicion_level": "low|medium|high",
    "confidence": 0.82
}
```

### 6. Pattern Analysis Module
**File:** `modules/pattern_analysis.py`

**Purpose:** Detect unusual patterns & anomalies

**Patterns Detected:**
- Repeated texture blocks
- Unnatural color gradients
- Frequency domain anomalies
- Pixel value distribution irregularities

**Output Structure:**
```python
{
    "repeated_blocks": 3,
    "texture_uniformity": 0.92,
    "frequency_anomalies": 2,
    "pattern_risk": "low|medium|high",
    "confidence": 0.65
}
```

### 7. NLP Engine Module
**File:** `modules/nlp_engine.py`

**Purpose:** Generate natural language explanations

**Features:**
- spaCy entity extraction
- NLTK sentence tokenization
- Context-aware narrative generation
- Risk-aware wording selection

**Output Structure:**
```python
{
    "executive_summary": "Image appears authentic with no major red flags...",
    "detailed_analysis": "Object detection identified...",
    "risk_assessment": "Low risk based on...",
    "recommendations": ["examine metadata", ...]
}
```

### 8. Perspective Engine Module
**File:** `modules/perspective_engine.py`

**Purpose:** Build multi-perspective narrative explanations

**Three Perspectives:**

1. **Agent Perspective**
   - Security-centric view
   - Risk assessment language
   - Alert-focused interpretation

2. **Detective Perspective**
   - Forensic evidence-centric
   - Clue-based interpretation
   - Investigation language

3. **User Perspective**
   - Non-technical explanation
   - Plain language
   - Actionable insights

**Output Structure:**
```python
{
    "perspectives": {
        "agent_view": {
            "assessment": "...",
            "risk_level": "medium",
            "alerts": [...]
        },
        "detective_view": {
            "findings": "...",
            "evidence": [...],
            "suspicion_level": "low"
        },
        "user_view": {
            "explanation": "...",
            "key_points": [...],
            "action_suggested": "none|review|investigate"
        }
    }
}
```

---

## Analysis Pipeline

### Sequential Execution

The analysis pipeline runs in the following order:

```python
async def run_full_analysis(image_path: Path, original_filename: str):
    # 1. Extract metadata
    metadata = analyze_metadata(image_path)
    
    # 2. Analyze visual content (async - can call APIs)
    visual_analysis = await analyze_visual_content(image_path)
    
    # 3. Detect forensic manipulation signals
    forensic_analysis = analyze_forensic_signals(image_path)
    
    # 4. Analyze steganography
    steganography_analysis = analyze_steganography(image_path)
    
    # 5. Scan for malware
    malware_scan = analyze_malware_signatures(image_path)
    
    # 6. Analyze patterns
    pattern_analysis = analyze_patterns(image_path)
    
    # 7. Generate NLP explanations
    nlp_explanations = build_nlp_explanations(
        visual_analysis, forensic_analysis, steganography_analysis,
        malware_scan, metadata, pattern_analysis
    )
    
    # 8. Build perspectives
    perspectives = build_perspectives(...)
    
    # Return consolidated result
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
        "compatibility": compatibility
    }
```

### Key Characteristics

- **Modular Design:** Each analyzer can fail independently; pipeline continues
- **Resilience:** Missing data doesn't crash the system
- **Comprehensive:** All analysis complete before response
- **Single-Process:** No queueing, no task IDs, no polling

---

## Forensic Techniques

### 1. Error Level Analysis (ELA)

**Concept:**
- JPEG compression has lossy characteristics
- Recompressing at same quality level produces minimal changes
- Modified regions recompress differently (higher error)

**Algorithm:**
```
1. Load original image as RGB
2. Save as JPEG at 90% quality to temp file
3. Load recompressed image
4. Calculate pixel-by-pixel difference (L2 norm)
5. Normalize by max (255)
6. Average across all pixels = ELA score
7. Threshold: score > 0.12 = suspicious
```

**Limitations:**
- Works best on JPEG images
- PNG images: less effective
- Heavily edited images: high scores (expected)

### 2. Compression Artifact Detection

**Concept:**
- JPEG divides image into 8×8 blocks
- Block boundaries have predictable artificial edges
- Cloned/spliced regions have inconsistent boundaries

**Algorithm:**
```
1. Convert to grayscale
2. Calculate vertical differences at block boundaries (every 8th column)
3. Calculate horizontal differences at block boundaries (every 8th row)
4. Average magnitude = blockiness score
5. Threshold: > 0.10 = suspicious
```

### 3. Noise Inconsistency

**Concept:**
- Natural images have consistent noise distribution
- Spliced regions may have different noise patterns
- Quadrant analysis detects localized inconsistencies

**Algorithm:**
```
1. Convert to grayscale
2. Apply Gaussian blur (3×3 kernel)
3. Subtract blur from original = noise map
4. Divide into 4 quadrants
5. Calculate mean noise per quadrant
6. Std deviation of quadrant means = inconsistency score
7. Threshold: > 0.06 = suspicious
```

### 4. LSB (Least Significant Bit) Steganography

**Concept:**
- LSB carries minimal visual information
- Text, code, etc. can be hidden in LSB layer
- Hiding creates statistical anomalies

**Detection Methods:**

#### Bit-Plane Analysis
```
For each bit position (0-7):
  1. Extract bit-plane
  2. Count ones in plane
  3. Calculate ratio = ones / total_pixels
  4. Expected for random: 0.5
  5. Deviation > 0.05 = suspicious
```

#### Chi-Square Test
```
Null hypothesis: LSB follows Bernoulli(0.5)
1. Count observed ones: n_ones
2. Expected ones: n_total / 2
3. Chi-square = Σ((observed - expected)² / expected)
4. Threshold: chi_square > threshold = reject null = suspicious
```

#### Entropy Analysis
```
1. Calculate Shannon entropy of LSB channel
2. Expected for random: 1.0 (max for binary)
3. Expected for natural image LSB: 0.7-0.8
4. Hidden data LSB: often 0.4-0.9 (variable)
5. Anomalous deviation = suspicious
```

---

## AI/ML Components

### 1. YOLOv8 Object Detection

**Model:** YOLOv8 Nano (yolov8n.pt)

**Capabilities:**
- Detects 80 COCO object classes
- Returns bounding boxes, confidence scores, class labels
- Real-time performance (suitable for web)

**Integration:**
```python
from ultralytics import YOLO

model = YOLO("yolov8n.pt")
results = model(image_path, conf=0.5)

for detection in results[0].boxes:
    class_id = int(detection.cls)
    confidence = float(detection.conf)
    bbox = detection.xyxy[0].tolist()
```

### 2. BLIP Image Captioning

**Model:** BLIP (Bootstrapping Language-Image Pre-training)

**Capabilities:**
- Generates natural language captions for images
- Context-aware descriptions
- High-quality summarization

**Integration:**
```python
from transformers import BlipProcessor, BlipForConditionalGeneration

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

inputs = processor(image, return_tensors="pt")
outputs = model.generate(**inputs)
caption = processor.decode(outputs[0], skip_special_tokens=True)
```

### 3. EasyOCR Text Extraction

**Capabilities:**
- Multi-language text recognition
- Detection + recognition in one step
- Handles rotated/skewed text

**Integration:**
```python
import easyocr

reader = easyocr.Reader(['en'])
results = reader.readtext(image_path)

text_data = [
    {
        "text": detection[1],
        "confidence": detection[2],
        "bbox": detection[0]
    }
    for detection in results
]
```

### 4. Hugging Face Inference API

**Endpoints Used:**
- Image Classification (scene)
- Object Detection (backup)
- Image-to-Text (caption generation)

**Features:**
- API-based, no local model storage
- Fallback if local models unavailable
- Higher accuracy (larger models)

### 5. spaCy NLP Processing

**Features:**
- Named entity recognition
- Part-of-speech tagging
- Dependency parsing
- Lemmatization

**Integration:**
```python
import spacy

nlp = spacy.load("en_core_web_sm")
doc = nlp("The suspicious image contains a person.")

for token in doc:
    print(f"{token.text}: {token.pos_}, {token.lemma_}")
```

---

## API Documentation

### Base URL
```
http://localhost:8000
```

### Health Check Endpoint

**Request:**
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "intellivision-forensics",
  "version": "1.0.0",
  "mode": "hybrid-local-api"
}
```

### Image Analysis Endpoint

**Request:**
```http
POST /analyze
Content-Type: multipart/form-data

file: <binary image data>
```

**Validation:**
- Content-Type: image/jpeg, image/png, image/webp (only)
- Max file size: 50MB
- Non-empty file required

**Response (200 OK):**
```json
{
  "image_info": {
    "filename": "sample.jpg",
    "stored_path": "/path/to/uploads/uuid.jpg",
    "size_bytes": 524288
  },
  "visual_analysis": {
    "objects": [
      {"label": "person", "confidence": 0.95, "bounding_box": [[100, 200], [300, 400]]}
    ],
    "caption": "A person standing in front of a building",
    "scene": "urban-outdoor",
    "ocr_text": ["Sign", "Text"],
    "faces_detected": 1,
    "risk_indicators": []
  },
  "forensic_analysis": {
    "ela": {"ela_score": 0.08, "ela_suspicious": false},
    "compression_artifacts": {"blockiness": 0.05, "artifact_suspicious": false},
    "noise_analysis": {"noise_inconsistency": 0.03, "noise_suspicious": false},
    "manipulation_suspicion_level": "low",
    "confidence": 0.75
  },
  "steganography_analysis": {
    "lsb_analysis": {...},
    "hidden_data_likelihood": "low",
    "confidence": 0.68
  },
  "malware_scan": {
    "signatures_detected": [],
    "embedded_executables": [],
    "entropy_score": 5.2,
    "malware_suspicion_level": "low",
    "confidence": 0.95
  },
  "metadata": {
    "exif_data": {...},
    "creation_date": "2024-01-15",
    "metadata_inconsistencies": [],
    "risk_level": "low"
  },
  "pattern_analysis": {
    "repeated_blocks": 0,
    "texture_uniformity": 0.95,
    "frequency_anomalies": 0,
    "pattern_risk": "low",
    "confidence": 0.82
  },
  "nlp_summary": {
    "executive_summary": "...",
    "detailed_analysis": "...",
    "risk_assessment": "...",
    "recommendations": [...]
  },
  "perspectives": {
    "agent_view": {...},
    "detective_view": {...},
    "user_view": {...}
  }
}
```

**Error Responses:**

- **400 Bad Request:** Filename missing, unsupported type, empty file
- **413 Payload Too Large:** File exceeds 50MB
- **500 Internal Server Error:** Analysis pipeline failed

---

## Data Flow

### Request → Response Flow

```
1. USER BROWSER
   ├─ User selects image from device
   └─ Clicks "Analyze"

2. FRONTEND (React)
   ├─ Create FormData with image
   ├─ POST /analyze to backend
   └─ Show "Analyzing..." spinner

3. BACKEND RECEIVE
   ├─ Validate file (type, size, content)
   ├─ Generate UUID
   └─ Save to uploads/ directory

4. ANALYSIS PIPELINE
   ├─ Metadata: Extract EXIF
   ├─ Visual: YOLO + BLIP + OCR
   ├─ Forensic: ELA, compression, noise
   ├─ Steganography: LSB analysis
   ├─ Malware: Signature scan
   ├─ Pattern: Anomaly detection
   ├─ NLP: Generate explanations
   └─ Perspectives: Build narratives

5. BACKEND RESPONSE
   ├─ Construct full JSON response
   └─ Return to frontend (same HTTP request)

6. FRONTEND DISPLAY
   ├─ Parse response JSON
   ├─ Render visual results
   ├─ Display analysis cards
   ├─ Show perspectives
   └─ Enable report download

7. USER OPTIONS
   ├─ Download as PDF
   ├─ Screenshot
   ├─ Share findings
   └─ Analyze another image
```

### Key Characteristics

- **Single Request/Response** - No polling, no WebSockets
- **Synchronous Processing** - Request blocks until complete
- **Full Context** - Client receives everything at once
- **Stateless** - No session storage needed
- **Simple Error Handling** - HTTP status codes + error messages

---

## Deployment & Performance

### Development Configuration

```yaml
Backend:
  Framework: FastAPI
  Server: uvicorn main:app --reload
  Port: 8000
  Workers: 1
  
Frontend:
  Build Tool: Vite
  Dev Server: npm run dev
  Port: 5173
  Mode: Development with HMR
```

### Production Configuration

```yaml
Backend:
  Server: uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
  or: gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
  
Frontend:
  Build: npm run build
  Output: Frontend/build/
  Serve: Static hosting (Netlify, Vercel, S3+CloudFront)
```

### Performance Considerations

| Operation | Time | Notes |
|-----------|------|-------|
| Image validation | 10ms | File read + format check |
| Metadata extraction | 50ms | EXIF parsing |
| YOLO detection | 200-500ms | Depends on image size |
| BLIP captioning | 300-800ms | Model inference |
| ELA analysis | 150-300ms | JPEG recompression |
| Steganography | 400-800ms | Bit-plane analysis |
| Malware scan | 200-400ms | Binary scanning |
| NLP generation | 100-200ms | Sentence tokenization |
| **Total Pipeline** | **2-4 seconds** | Image size dependent |

### Scalability Strategy

**Current Limitations:**
- Single process, no horizontal scaling
- No async task queue
- Memory-bound by model sizes
- synchronous blocking requests

**Future Improvements:**
- Move to task queue (Celery + Redis)
- Horizontal scaling with load balancing
- Model caching & pre-warming
- Batch processing endpoints
- WebSocket for streaming results

### System Requirements

**Minimum (Development):**
- CPU: 4 cores
- RAM: 8GB
- Disk: 10GB (models + uploads)
- GPU: Not required (slow but functional)

**Recommended (Production):**
- CPU: 8+ cores
- RAM: 16GB+
- Disk: 50GB+ (models + cache)
- GPU: NVIDIA with CUDA 11.8+

---

## Configuration Files

### `backend/config.py`

Contains all settings:
```python
APP_NAME = "IntelliVision Forensics"
APP_VERSION = "1.0.0"
UPLOADS_DIR = Path("uploads")
MAX_UPLOAD_MB = 50
ALLOWED_CONTENT_TYPES = {
    "image/jpeg", "image/png", "image/webp"
}
```

### `requirements.txt` (Python)

```
fastapi==0.100.0
uvicorn==0.24.0
pillow==10.0.0
opencv-python==4.8.0
torch==2.0.0
torchvision==0.15.0
ultralytics==8.0.0
transformers==4.30.0
easyocr==1.6.0
pytesseract==0.3.10
spacy==3.5.0
nltk==3.8.1
numpy==1.24.0
scipy==1.11.0
pydantic==2.0.0
```

### `Frontend/package.json` (Node)

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "dompurify": "^3.0.5"
  }
}
```

---

## Conclusion

IntelliVision Forensics combines cutting-edge AI models, rigorous digital forensics techniques, and intuitive UI to provide comprehensive image analysis. The monolithic architecture ensures simplicity while the modular design allows for independent evolution of each analysis component.

The system is production-ready for mid-scale deployments and can be extended with additional forensic techniques, API integrations, and scaling strategies as needed.

