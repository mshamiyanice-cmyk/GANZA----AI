# 🔐 Environment Variables Setup Guide

## **Quick Start**

1. **Copy the example file:**
   ```bash
   # Windows
   copy .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   ```

2. **Edit `.env` file** and fill in your credentials (see below)

3. **Install python-dotenv** (if not already installed):
   ```bash
   pip install python-dotenv
   ```

---

## **Required Environment Variables**

### **Minimum Required:**

```env
# Your Google Cloud Project ID
GCP_PROJECT_ID=ganza-ai-sovereign-2026

# Authentication (choose ONE):
# Option 1: Service Account Key File (Recommended)
GOOGLE_APPLICATION_CREDENTIALS=C:\Users\HP\gemini-live-key.json

# Option 2: Use ADC (leave empty and run: gcloud auth application-default login)
# GOOGLE_APPLICATION_CREDENTIALS=
```

---

## **Complete .env File Template**

```env
# ============================================
# GEMINI LIVE API - ENVIRONMENT VARIABLES
# ============================================

# ============================================
# GOOGLE CLOUD CREDENTIALS
# ============================================

# Option 1: Service Account Key File (Recommended for Production)
# Path to your service account JSON key file
# Example: C:\Users\HP\gemini-live-key.json (Windows)
# Example: /home/user/gemini-live-key.json (Linux/Mac)
GOOGLE_APPLICATION_CREDENTIALS=

# Option 2: Use Application Default Credentials (ADC)
# If GOOGLE_APPLICATION_CREDENTIALS is empty, ADC will be used
# Make sure you've run: gcloud auth application-default login
# Leave empty to use ADC

# ============================================
# GCP PROJECT CONFIGURATION
# ============================================

# Your Google Cloud Project ID
# Example: ganza-ai-sovereign-2026
GCP_PROJECT_ID=

# GCP Region (default: us-central1)
# Available regions: us-central1, us-east1, europe-west1, etc.
GCP_REGION=us-central1

# ============================================
# GEMINI MODEL CONFIGURATION
# ============================================

# Gemini Model Name
# Options:
#   - gemini-live-2.5-flash-native-audio (Native Audio - Recommended)
#   - gemini-2.0-flash-exp (Experimental)
#   - gemini-1.5-pro (Standard)
DEFAULT_MODEL=gemini-live-2.5-flash-native-audio

# ============================================
# SERVER CONFIGURATION
# ============================================

# WebSocket Proxy Port (default: 8080)
WS_PORT=8080

# Debug Mode (true/false)
# Set to true for verbose logging
DEBUG=false
```

---

## **How to Get Credentials**

### **Option 1: Service Account (Recommended)**

1. **Create Service Account:**
   ```bash
   gcloud iam service-accounts create gemini-live-sa \
     --display-name="Gemini Live API Service Account" \
     --project=ganza-ai-sovereign-2026
   ```

2. **Grant Permissions:**
   ```bash
   gcloud projects add-iam-policy-binding ganza-ai-sovereign-2026 \
     --member="serviceAccount:gemini-live-sa@ganza-ai-sovereign-2026.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"
   ```

3. **Create and Download Key:**
   ```bash
   gcloud iam service-accounts keys create gemini-live-key.json \
     --iam-account=gemini-live-sa@ganza-ai-sovereign-2026.iam.gserviceaccount.com \
     --project=ganza-ai-sovereign-2026
   ```

4. **Set in .env:**
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=C:\Users\HP\gemini-live-key.json
   ```

### **Option 2: Application Default Credentials (ADC)**

1. **Authenticate:**
   ```bash
   gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform
   ```

2. **Leave empty in .env:**
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=
   ```

---

## **Verification**

After setting up `.env`, test the server:

```bash
python server.py
```

You should see:
```
🔍 Testing authentication...
✅ Access token generated for project: ganza-ai-sovereign-2026
╔════════════════════════════════════════════════════════════╗
║     Gemini Live API Proxy Server                          ║
...
```

If you see authentication errors, check:
1. ✅ Service account file path is correct
2. ✅ Service account has `roles/aiplatform.user` role
3. ✅ Vertex AI API is enabled
4. ✅ Project ID is correct

---

## **Security Notes**

- ⚠️ **Never commit `.env` to git** (it's in `.gitignore`)
- ✅ Use `.env.example` as a template
- ✅ Keep service account keys secure
- ✅ Rotate keys regularly in production

---

## **Troubleshooting**

### **Error: "Authentication failed"**
- Check if `GOOGLE_APPLICATION_CREDENTIALS` path is correct
- Verify service account has correct permissions
- Try re-authenticating with ADC

### **Error: "Project ID not found"**
- Set `GCP_PROJECT_ID` in `.env`
- Or provide it in the frontend connection

### **Error: "Policy violation 1008"**
- Enable Vertex AI API
- Enable model in Model Garden
- Check IAM permissions

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-XX
