# IntelliVision

**AI-powered image analysis with multi-perspective interpretation.**  
Single-process, synchronous, monolithic backend. No queues, no task storage, no polling.

---

## Project Overview

IntelliVision analyzes uploaded images through a single request/response flow:

1. **Upload** an image via `POST /api/v1/analyze`.
2. **Backend** runs the full pipeline in-process:
   - **Shared vision:** object detection (YOLO), OCR (EasyOCR/Tesseract), scene classification, metadata.
   - **Agent view:** risk, crowd density, anomalies, security alerts.
   - **Detective view:** ELA, clone detection, forensic clues, tampering assessment.
   - **User view:** summary, caption, key points, explanation.
3. **Response** returns the full JSON result in the same HTTP response.

No `task_id`, no polling, no Celery, no Redis, no PostgreSQL for tasks.

---

## Architecture (Monolithic)

```
┌─────────────┐     POST /api/v1/analyze      ┌──────────────────────────────────┐
│   Browser   │ ────────────────────────────► │  FastAPI (single process)        │
│  (React)    │     multipart/form-data       │  • Save image                    │
└─────────────┘                               │  • run_shared_vision              │
       ▲                                      │  • run_agent_view                 │
       │                                      │  • run_detective_view             │
       │         Full JSON result             │  • run_user_view                  │
       └─────────────────────────────────────│  • Delete temp file               │
                                              │  • Return response                │
                                              └──────────────────────────────────┘
```

- **Single backend process:** one uvicorn process runs the API and all AI logic.
- **Synchronous:** the request blocks until analysis completes; the response contains the full result.
- **Stateless:** no task database; no Redis/Celery.

---

## Core Capabilities

- **Object detection** (YOLOv8)
- **OCR** (EasyOCR, Tesseract fallback)
- **Scene classification** (stub; extendable)
- **Metadata** (EXIF/timestamp)
- **Agent perspective** (risk, crowd, alerts, observations)
- **Detective perspective** (ELA, clone detection, forensic clues, tampering)
- **User perspective** (summary, BLIP caption, key points, explanation)

---

## Folder Structure

```
IntelliVision/
├── backend/
│   ├── main.py                 # Entry: from app.main import app (for uvicorn main:app)
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py             # FastAPI app, CORS, router
│   │   ├── core/
│   │   │   └── constants.py    # UPLOAD_DIR, allowed types, max size
│   │   ├── utils/
│   │   │   └── image_utils.py  # validate_image, generate_safe_filename
│   │   ├── api/v1/
│   │   │   ├── router.py       # Mounts health + analyze
│   │   │   └── routes/
│   │   │       ├── health.py   # GET /health
│   │   │       └── analyze.py  # POST /analyze (sync pipeline)
│   │   └── ai/
│   │       ├── shared/         # run_shared_vision (YOLO, OCR, scene, metadata)
│   │       ├── agent_view/     # run_agent_view
│   │       ├── detective_view/ # run_detective_view
│   │       └── user_view/      # run_user_view
│   └── uploads/                # Temp uploads (created at runtime)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             # Upload → POST analyze → display result
│       ├── App.css
│       └── index.css
└── README.md
```

---

## Tech Stack

| Layer     | Technology |
|----------|------------|
| Backend  | Python 3.11+, FastAPI, Uvicorn |
| AI       | PyTorch, Ultralytics (YOLO), EasyOCR, Tesseract, Transformers (BLIP), OpenCV, Pillow, NumPy, SciPy |
| Frontend | React 18, Vite, Axios, Lucide React |
| Config   | Pydantic (env), constants in code |

---

## How to Run

### Backend

Use **Python 3.11** (spaCy/Pydantic are not fully compatible with Python 3.14+). This repo provides a `venv311` created with 3.11; use it or create your own:

```bash
# From project root (e.g. intellivision-forensics)
python -m venv venv311 --python=python3.11   # or: py -3.11 -m venv venv311
venv311\Scripts\activate   # Windows
# source venv311/bin/activate   # Linux/macOS
pip install -r requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000  
- Docs: http://localhost:8000/docs  

### Frontend

```bash
cd IntelliVision/frontend
npm install
npm run dev
```

- App: http://localhost:3000 (or the port Vite prints).  
- Ensure the backend is running on port 8000 so the frontend can call `/api/v1/analyze`.

### Quick Test

1. Start backend, then frontend.
2. Open the app in the browser, upload an image (JPEG/PNG/WebP, max 10MB).
3. Click **Analyze Image**. Wait for the request to complete (no polling).
4. View results in the Overview, Objects, Text, Scenes, Perspectives, and Forensics tabs.

---

## Future Expansion

- **Optional rate limiting** (e.g. in-memory or Redis) if needed.
- **ResNet/ViT scene classifier** to replace the stub.
- **Relationship analysis** between detected objects.
- **Optional result caching** (e.g. by image hash) to avoid re-running the pipeline for the same image.
- **Docker** single-image deployment (one container for the backend, no worker/Redis/Postgres for tasks).

---

**Version:** 1.0.0  
**Architecture:** Monolithic, synchronous, single-process.
