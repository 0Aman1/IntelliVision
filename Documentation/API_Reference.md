# API Reference

## Overview

This document provides comprehensive API documentation for the Intelligent Image Information Extraction System. The API is RESTful and uses JSON for request and response payloads.

## Base URL

```
Development: http://localhost:8000/api/v1
Production: https://api.image-extraction.example.com/api/v1
```

## Authentication

All API requests require authentication using an API key.

### Authentication Method

Include the API key in the request header:

```http
Authorization: Bearer YOUR_API_KEY
```

### Obtaining an API Key

Contact the system administrator or register through the web portal.

---

## Endpoints

### 1. Image Analysis

#### Analyze Single Image

Performs comprehensive analysis on a single image.

**Endpoint:** `POST /analyze`

**Request:**

```http
POST /api/v1/analyze
Content-Type: multipart/form-data
Authorization: Bearer YOUR_API_KEY
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image` | file | Yes | Image file (JPEG, PNG, BMP, TIFF) |
| `features` | array | No | Specific features to extract (default: all) |
| `perspectives` | array | No | Perspectives to apply (default: all) |
| `include_metadata` | boolean | No | Include EXIF metadata (default: true) |

**Request Example:**

```json
{
  "features": ["object_detection", "ocr", "scene_recognition"],
  "perspectives": ["agent", "detective", "user"],
  "include_metadata": true
}
```

**Response:**

```json
{
  "status": "success",
  "request_id": "req_abc123xyz",
  "timestamp": "2025-10-20T10:30:00Z",
  "results": {
    "objects": [
      {
        "label": "person",
        "confidence": 0.95,
        "bounding_box": {
          "x": 120,
          "y": 80,
          "width": 200,
          "height": 350
        }
      },
      {
        "label": "car",
        "confidence": 0.89,
        "bounding_box": {
          "x": 400,
          "y": 200,
          "width": 300,
          "height": 180
        }
      }
    ],
    "scenes": [
      {
        "label": "street",
        "confidence": 0.92
      },
      {
        "label": "urban",
        "confidence": 0.88
      }
    ],
    "text": {
      "detected_text": [
        {
          "text": "STOP",
          "confidence": 0.97,
          "location": {
            "x": 50,
            "y": 30,
            "width": 100,
            "height": 40
          }
        }
      ],
      "full_text": "STOP"
    },
    "relationships": [
      {
        "subject": "person",
        "relation": "near",
        "object": "car",
        "confidence": 0.85
      }
    ],
    "metadata": {
      "timestamp": "2025-10-15T14:23:10Z",
      "location": {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "address": "New York, NY"
      },
      "device": {
        "make": "Canon",
        "model": "EOS 5D Mark IV",
        "software": "Adobe Photoshop CC"
      },
      "technical": {
        "iso": 400,
        "exposure_time": "1/500",
        "f_number": 5.6,
        "focal_length": "50mm"
      }
    },
    "summary": {
      "general": "A person standing near a car on an urban street with a visible stop sign.",
      "perspectives": {
        "agent": "Urban environment with one individual in proximity to a vehicle. No immediate security concerns detected. Standard street scene with regulatory signage.",
        "detective": "Image shows a person near a vehicle on a public street. Stop sign visible in frame. Metadata indicates photo taken at 2:23 PM on October 15, 2025 in New York. No obvious suspicious elements detected.",
        "user": "A street scene showing someone standing by their car in the city. There's a stop sign in the background. Looks like a typical day in New York."
      }
    }
  },
  "processing_time_ms": 1847
}
```

**Status Codes:**

- `200 OK` - Analysis completed successfully
- `400 Bad Request` - Invalid image format or parameters
- `401 Unauthorized` - Missing or invalid API key
- `413 Payload Too Large` - Image exceeds size limit
- `500 Internal Server Error` - Server-side processing error

---

#### Batch Analysis

Analyze multiple images in a single request.

**Endpoint:** `POST /analyze/batch`

**Request:**

```http
POST /api/v1/analyze/batch
Content-Type: multipart/form-data
Authorization: Bearer YOUR_API_KEY
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `images` | file[] | Yes | Array of image files (max 10) |
| `features` | array | No | Specific features to extract |
| `perspectives` | array | No | Perspectives to apply |

**Response:**

```json
{
  "status": "success",
  "batch_id": "batch_xyz789",
  "timestamp": "2025-10-20T10:35:00Z",
  "total_images": 5,
  "processed": 5,
  "failed": 0,
  "results": [
    {
      "image_id": "img_001",
      "filename": "photo1.jpg",
      "results": { /* Same structure as single image analysis */ }
    },
    {
      "image_id": "img_002",
      "filename": "photo2.jpg",
      "results": { /* Same structure as single image analysis */ }
    }
  ],
  "processing_time_ms": 5234
}
```

---

### 2. Feature-Specific Endpoints

#### Object Detection Only

**Endpoint:** `POST /detect/objects`

**Response:**

```json
{
  "status": "success",
  "objects": [
    {
      "label": "dog",
      "confidence": 0.94,
      "bounding_box": {
        "x": 150,
        "y": 200,
        "width": 180,
        "height": 220
      }
    }
  ]
}
```

---

#### OCR Only

**Endpoint:** `POST /extract/text`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image` | file | Yes | Image file |
| `language` | string | No | OCR language (default: 'en') |

**Response:**

```json
{
  "status": "success",
  "text": {
    "detected_text": [
      {
        "text": "Invoice #12345",
        "confidence": 0.96,
        "location": {
          "x": 100,
          "y": 50,
          "width": 200,
          "height": 30
        }
      }
    ],
    "full_text": "Invoice #12345\nDate: 2025-10-20\nAmount: $150.00"
  }
}
```

---

#### Metadata Extraction Only

**Endpoint:** `POST /extract/metadata`

**Response:**

```json
{
  "status": "success",
  "metadata": {
    "timestamp": "2025-09-15T08:30:00Z",
    "location": {
      "latitude": 34.0522,
      "longitude": -118.2437
    },
    "device": {
      "make": "Apple",
      "model": "iPhone 14 Pro"
    }
  }
}
```

---

#### Scene Recognition Only

**Endpoint:** `POST /recognize/scene`

**Response:**

```json
{
  "status": "success",
  "scenes": [
    {
      "label": "beach",
      "confidence": 0.91
    },
    {
      "label": "sunset",
      "confidence": 0.87
    }
  ]
}
```

---

#### Image Summarization Only

**Endpoint:** `POST /summarize`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image` | file | Yes | Image file |
| `perspective` | string | No | Specific perspective ('agent', 'detective', 'user') |
| `detail_level` | string | No | 'brief', 'moderate', 'detailed' (default: 'moderate') |

**Response:**

```json
{
  "status": "success",
  "summary": {
    "general": "A sunset view over a beach with waves gently rolling onto the shore.",
    "perspective_specific": "A peaceful beach scene at sunset. The golden light reflects off the water creating a beautiful, relaxing atmosphere perfect for an evening walk.",
    "detail_level": "moderate"
  }
}
```

---

### 3. Job Management

#### Check Analysis Status

For asynchronous processing.

**Endpoint:** `GET /jobs/{job_id}`

**Response:**

```json
{
  "job_id": "job_abc123",
  "status": "completed",
  "progress": 100,
  "created_at": "2025-10-20T10:30:00Z",
  "completed_at": "2025-10-20T10:30:45Z",
  "result_url": "/api/v1/results/job_abc123"
}
```

**Status Values:**
- `pending` - Job queued
- `processing` - Currently being processed
- `completed` - Successfully completed
- `failed` - Processing failed
- `cancelled` - Job cancelled by user

---

#### Get Results

**Endpoint:** `GET /results/{job_id}`

**Response:**

Same structure as the analyze endpoint response.

---

### 4. System Information

#### Health Check

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "services": {
    "api": "operational",
    "object_detection": "operational",
    "ocr": "operational",
    "database": "operational"
  },
  "timestamp": "2025-10-20T10:40:00Z"
}
```

---

#### API Statistics

**Endpoint:** `GET /stats`

**Response:**

```json
{
  "total_requests": 15847,
  "requests_today": 342,
  "average_processing_time_ms": 1523,
  "success_rate": 98.5,
  "supported_formats": ["JPEG", "PNG", "BMP", "TIFF", "WEBP"]
}
```

---

## Request Limits

| Limit Type | Value |
|------------|-------|
| Max image size | 10 MB |
| Max batch size | 10 images |
| Rate limit | 100 requests/hour |
| Max concurrent requests | 5 |

---

## Error Handling

### Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_IMAGE_FORMAT",
    "message": "The uploaded file is not a valid image format",
    "details": "Supported formats: JPEG, PNG, BMP, TIFF, WEBP"
  },
  "timestamp": "2025-10-20T10:45:00Z"
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_IMAGE_FORMAT` | Unsupported image format |
| `IMAGE_TOO_LARGE` | Image exceeds size limit |
| `MISSING_PARAMETER` | Required parameter not provided |
| `INVALID_API_KEY` | API key is invalid or expired |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `PROCESSING_FAILED` | Internal processing error |
| `MODEL_UNAVAILABLE` | AI model temporarily unavailable |

---

## SDK Examples

### Python

```python
import requests

API_KEY = "your_api_key_here"
API_URL = "http://localhost:8000/api/v1"

def analyze_image(image_path):
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    
    with open(image_path, 'rb') as image_file:
        files = {'image': image_file}
        data = {
            'features': ['object_detection', 'ocr', 'scene_recognition'],
            'perspectives': ['agent', 'detective', 'user'],
            'include_metadata': True
        }
        
        response = requests.post(
            f"{API_URL}/analyze",
            headers=headers,
            files=files,
            data=data
        )
    
    return response.json()

# Usage
result = analyze_image("path/to/image.jpg")
print(result['results']['summary']['general'])
```

### JavaScript (Node.js)

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_KEY = 'your_api_key_here';
const API_URL = 'http://localhost:8000/api/v1';

async function analyzeImage(imagePath) {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    form.append('features', JSON.stringify(['object_detection', 'ocr']));
    form.append('perspectives', JSON.stringify(['user']));
    
    try {
        const response = await axios.post(`${API_URL}/analyze`, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Analysis failed:', error.response.data);
        throw error;
    }
}

// Usage
analyzeImage('path/to/image.jpg')
    .then(result => console.log(result.results.summary.general))
    .catch(err => console.error(err));
```

### cURL

```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@/path/to/image.jpg" \
  -F "features=[\"object_detection\",\"ocr\"]" \
  -F "perspectives=[\"user\"]" \
  -F "include_metadata=true"
```

---

## Webhooks

Configure webhooks to receive notifications when asynchronous jobs complete.

### Webhook Configuration

**Endpoint:** `POST /webhooks`

**Request:**

```json
{
  "url": "https://your-domain.com/webhook",
  "events": ["job.completed", "job.failed"],
  "secret": "your_webhook_secret"
}
```

### Webhook Payload

```json
{
  "event": "job.completed",
  "job_id": "job_abc123",
  "timestamp": "2025-10-20T10:50:00Z",
  "result_url": "/api/v1/results/job_abc123"
}
```

---

## Best Practices

1. **Always validate images** before uploading to avoid unnecessary API calls
2. **Use batch processing** for multiple images to optimize performance
3. **Implement retry logic** with exponential backoff for failed requests
4. **Cache results** when processing the same images multiple times
5. **Use specific feature endpoints** when you only need particular analysis types
6. **Monitor rate limits** to avoid service interruption
7. **Handle errors gracefully** with appropriate user feedback

---

**API Version:** 1.0  
**Last Updated:** 2025-10-20
