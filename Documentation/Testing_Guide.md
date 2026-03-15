# InteliVision Quick Start & Testing Guide

## 🚀 Getting Started with InteliVision

### Prerequisites
- Python 3.8+ (3.12.8 recommended)
- Node.js 16+ and npm
- Git

### Installation Steps

#### 1. Clone and Navigate
```bash
cd "d:\CLG\ltce\Major Project\Intelligent Image Extraction\Project"
```

#### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

**Note:** If you encounter issues with PyTorch, install it separately:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

#### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

#### 4. Verify Installation
```bash
python -c "import torch; import cv2; import easyocr; print('All core dependencies installed!')"
```

---

## 🧪 Testing the Enhanced InteliVision System

### Test 1: Start Backend Server

```bash
python app.py
```

**Expected Output:**
```
INFO:     Starting application server...
INFO:     Initializing image processors...
INFO:     ProcessingOrchestrator initialized successfully
INFO:     ForensicAnalyzer initialized
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Verify Backend:**
Visit http://localhost:8000/docs to see the interactive API documentation.

---

### Test 2: Start Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.3.1  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**Verify Frontend:**
Visit http://localhost:3000 and you should see the InteliVision UI.

---

### Test 3: Basic Image Analysis

#### Using the Web UI:

1. **Upload an Image:**
   - Click the upload area or drag & drop an image
   - Supported formats: JPG, PNG, GIF, WebP

2. **Click "Analyze Image"**
   - Wait for processing (typically 2-5 seconds)

3. **Explore Results:**
   - **Overview Tab:** View quick stats and general summary
   - **Objects Tab:** See detected objects with confidence scores
   - **Text Tab:** View extracted text regions
   - **Scenes Tab:** Check scene classifications
   - **Perspectives Tab:** Read AI interpretations from Agent, Detective, and User viewpoints

#### Using the API Directly:

```bash
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@path/to/your/image.jpg" \
  -F "include_metadata=true" \
  -F "include_forensics=true"
```

---

### Test 4: Verify Forensic Analysis

Upload an image and check the API response for forensic data:

```json
{
  "status": "success",
  "results": {
    "forensics": {
      "ela_analysis": {
        "manipulation_likelihood": "LOW",
        "confidence": 92.5,
        "interpretation": "..."
      },
      "clone_detection": {
        "clones_detected": false,
        "confidence": 90.0
      },
      "steganography": {
        "steganography_likelihood": "LOW",
        "confidence": 85.0
      },
      "color_analysis": {
        "dominant_colors": [...],
        "saturation_level": "MODERATE"
      },
      "authenticity_score": 87.5
    }
  }
}
```

---

### Test 5: Verify Multi-Perspective Analysis

Check that all three perspectives return structured data:

**Agent Perspective:**
```json
{
  "narrative": "Full security report...",
  "risk_score": 2,
  "threat_level": "LOW",
  "crowd_density": {...},
  "security_alerts": [...]
}
```

**Detective Perspective:**
```json
{
  "narrative": "Forensic analysis...",
  "key_clues": [...],
  "timeline": [...],
  "evidence_summary": {...}
}
```

**User Perspective:**
```json
{
  "narrative": "Natural description...",
  "scene_type": "outdoor",
  "main_subjects": [...]
}
```

---

## 📋 Test Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Can upload images via web UI
- [ ] Analysis completes successfully
- [ ] Objects are detected and displayed
- [ ] Text extraction works (if image contains text)
- [ ] Scene classification shows results
- [ ] **NEW:** Forensic analysis returns ELA data
- [ ] **NEW:** Clone detection completes
- [ ] **NEW:** Color analysis shows dominant colors
- [ ] **NEW:** Authenticity score is calculated
- [ ] **NEW:** Agent perspective includes risk_score and threat_level
- [ ] **NEW:** Detective perspective includes key_clues
- [ ] **NEW:** User perspective includes narrative
- [ ] Summary header shows confidence score
- [ ] Processing time is displayed
- [ ] All tabs are accessible and functional

---

## 🐛 Troubleshooting

### Issue: Backend fails to start

**Solution:**
```bash
# Check if all dependencies are installed
pip install -r requirements.txt

# Verify Python version
python --version  # Should be 3.8+
```

### Issue: Frontend doesn't connect to backend

**Solution:**
- Verify backend is running on port 8000
- Check browser console for CORS errors
- Ensure `API_BASE_URL` in `frontend/src/App.jsx` is correct

### Issue: Forensic analysis fails

**Solution:**
```bash
# Ensure PIL and OpenCV are properly installed
pip install --upgrade Pillow opencv-python
```

### Issue: "ModuleNotFoundError: No module named 'X'"

**Solution:**
```bash
# Install missing module
pip install <module-name>
```

---

## 🎯 Sample Test Images

### Recommended Test Images:

1. **For Object Detection:**
   - Photos with people, vehicles, animals
   - Street scenes, crowded areas

2. **For Text Extraction:**
   - Documents, signs, receipts
   - Screenshots with text
   - Book pages, newspapers

3. **For Forensic Analysis:**
   - High-resolution photos
   - Images with EXIF data (from cameras/phones)
   - Both edited and unedited images

4. **For Metadata Extraction:**
   - Photos taken with smartphones (contain GPS)
   - Camera photos (contain detailed EXIF)

---

## ✅ Expected Performance

### Processing Times (typical):
- **Object Detection:** 500-1000ms
- **Scene Recognition:** 200-400ms
- **OCR:** 800-1500ms (depends on text amount)
- **Forensic Analysis:** 1000-2000ms
- **Total Analysis:** 2-5 seconds (for comprehensive analysis)

### Accuracy Expectations:
- **Object Detection:** 80-95% confidence for clear objects
- **Scene Recognition:** 70-90% for top predictions
- **OCR:** 85-98% for clear, well-lit text
- **Forensic Authenticity:** 70-95% accuracy

---

## 📊 Monitoring & Logs

### Backend Logs:
- Check terminal where `python app.py` is running
- Logs show processing steps and timing

### Frontend Console:
- Open browser DevTools (F12)
- Check Console tab for any errors
- Network tab shows API requests/responses

---

## 🎉 Success Indicators

You'll know InteliVision is working correctly when:

1. ✅ Backend starts and shows "Application started successfully"
2. ✅ Frontend displays the upload area
3. ✅ Image uploads and shows preview
4. ✅ "Analyzing..." spinner appears during processing
5. ✅ Results appear in organized tabs
6. ✅ Forensics tab shows ELA, clone detection, color analysis
7. ✅ Security/Agent tab shows threat assessment
8. ✅ All perspective narratives are generated
9. ✅ No errors in browser console or backend logs
10. ✅ Processing completes in reasonable time (<10 seconds)

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend logs for error messages
3. Check browser console for frontend errors
4. Verify all dependencies are installed correctly
5. Ensure you're using compatible Python version (3.8-3.12)

---

**Ready to explore InteliVision? Start by running both servers and upload your first image! 🚀**
