# How to Run IntelliVision

This guide lists all commands needed to run the project end-to-end on your local machine.

---

## 1. Prerequisites

- **Python**: 3.11 (recommended). Python 3.14+ is not fully compatible with spaCy / Pydantic used here.
- **Node.js**: 18+ (for the React frontend).
- **Git**: to clone the repo (if not already).

---

## 2. Clone the Repository

```bash
git clone https://github.com/raikwarsagar2004-lab/Intellivision.git
cd Intellivision
```

If you are already in `c:\Codes\Major\intellivision-forensics`, you can skip cloning and just `cd` into the folder.

---

## 3. Set Up Python Virtual Environment

From the project root (where `requirements.txt` lives):

```bash
# Windows (PowerShell or cmd)
py -3.11 -m venv venv311
venv311\Scripts\activate

# OR, using python directly if it points to 3.11
python -m venv venv311
venv311\Scripts\activate
```

On Linux/macOS:

```bash
python3.11 -m venv venv311
source venv311/bin/activate
```

Verify Python:

```bash
python --version   # should show 3.11.x
```

---

## 4. Install Backend Dependencies

With the virtual environment activated and from the project root:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This installs FastAPI, Uvicorn, spaCy, ultralytics, transformers, OpenCV, etc.

---

## 5. Configure Environment Variables

Create a `backend/.env` file (this file is **ignored by git**). At minimum, define any required keys used by `backend/config.py` (for example, ports, model paths, API keys—depending on how you configure it).

Example skeleton:

```bash
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
# Add any other secrets or tokens here (never commit this file)
```

Also create `Frontend/.env` if the frontend needs any environment variables (e.g. API base URL).

---

## 6. Download / Place Model Files

The repository expects model folders:

- `models/yolo/` for YOLO weights.
- `models/blip/` for BLIP or other captioning models.

If you have local weights, place them under these folders (update paths in code if needed). Otherwise, the code may download some models automatically via ultralytics / transformers the first time it runs.

---

## 7. Run the Backend (FastAPI + Uvicorn)

From the project root, with the virtual environment activated:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Key endpoints:

- API root: `http://localhost:8000`
- Docs (OpenAPI): `http://localhost:8000/docs`
- Main analysis endpoint: `POST /api/v1/analyze`

Keep this terminal window open while the backend is running.

---

## 8. Install Frontend Dependencies

In a **new terminal** window:

```bash
cd Frontend
npm install
```

This installs React, Vite, and all UI libraries.

---

## 9. Run the Frontend (React + Vite)

Still inside `Frontend`:

```bash
npm run dev
```

Vite will print a local URL, typically:

- App: `http://localhost:5173` (or `http://localhost:3000` depending on config).

Ensure the backend is running on port `8000` so the frontend can reach `/api/v1/analyze`.

---

## 10. End-to-End Test

1. Confirm the backend is running (check `http://localhost:8000/docs` in your browser).
2. Open the frontend URL printed by Vite.
3. Upload a supported image (JPEG/PNG/WebP, within size limits).
4. Click **Analyze Image**.
5. Wait for the analysis to complete and inspect:
   - Overview / summary
   - Objects / OCR / scenes
   - Agent, Detective, and User perspectives
   - Forensics / tampering indicators

---

## 11. Optional: Run from Scratch Quickly (Commands Only)

From an empty machine with Python 3.11 and Node 18+:

```bash
git clone https://github.com/raikwarsagar2004-lab/Intellivision.git
cd Intellivision

py -3.11 -m venv venv311
venv311\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt

# (create backend/.env and Frontend/.env as needed)

uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

In another terminal:

```bash
cd Intellivision/Frontend
npm install
npm run dev
```

Then open the frontend URL and start analyzing images.

