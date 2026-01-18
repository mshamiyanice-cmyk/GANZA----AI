# 🔄 Migration Checklist: Gemini API → Vertex AI

## Overview

**Current Setup:** Using `server_gemini_api.py` (Gemini API with API key)  
**Target Setup:** Using `server.py` (Vertex AI with ADC/Service Account)

---

## ✅ Pre-Migration Checklist

### 1. **Authentication Setup**

#### Option A: Application Default Credentials (ADC) - Recommended
```bash
# Login with ADC
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform

# Verify
gcloud auth application-default print-access-token
```

#### Option B: Service Account
- [ ] Create service account in Google Cloud Console
- [ ] Grant roles: `roles/aiplatform.user` (minimum)
- [ ] Download JSON key file
- [ ] Set path in `.env`: `GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json`

**Current Status:** Check your `.env` file:
- If `GOOGLE_APPLICATION_CREDENTIALS` is empty → Using ADC
- If `GOOGLE_APPLICATION_CREDENTIALS` has a path → Using Service Account

---

### 2. **Environment Variables (.env)**

**Current (Gemini API):**
```env
GEMINI_API_KEY=AIzaSy...
DEFAULT_MODEL=gemini-2.5-flash-native-audio-preview-12-2025
```

**Required for Vertex AI:**
```env
# Google Cloud Credentials (choose one)
GOOGLE_APPLICATION_CREDENTIALS=                    # Empty for ADC, or path to service account JSON

# GCP Project Configuration
GCP_PROJECT_ID=ganza-ai-sovereign-2026            # ✅ Already set
GCP_REGION=us-central1                            # ✅ Already set

# Model Configuration
DEFAULT_MODEL=gemini-2.5-flash-native-audio-preview-12-2025

# Server Configuration
WS_PORT=8080
DEBUG=false

# Gemini API Key (can be removed - not needed for Vertex AI)
# GEMINI_API_KEY=...  # ❌ Remove this - not used by Vertex AI
```

**Action Items:**
- [ ] Verify `GCP_PROJECT_ID=ganza-ai-sovereign-2026`
- [ ] Verify `GCP_REGION=us-central1`
- [ ] Set `DEFAULT_MODEL=gemini-2.5-flash-native-audio-preview-12-2025`
- [ ] Remove or comment out `GEMINI_API_KEY` (not needed)
- [ ] Set `GOOGLE_APPLICATION_CREDENTIALS` (empty for ADC or path to service account)

---

### 3. **Model Names**

**Gemini API Format:**
- `gemini-2.5-flash-native-audio-preview-12-2025`
- `gemini-2.0-flash-exp`
- `models/gemini-2.5-flash-native-audio-preview-12-2025` (with prefix)

**Model Name to Use:**
- **Model identifier:** `gemini-2.5-flash-native-audio-preview-12-2025` (use this everywhere)
- **Full URI (auto-constructed by frontend):** `projects/{project}/locations/{region}/publishers/google/models/gemini-2.5-flash-native-audio-preview-12-2025`
- **Note:** Frontend automatically constructs the full URI from the model name you enter

**Action Items:**
- [ ] Set `DEFAULT_MODEL=gemini-2.5-flash-native-audio-preview-12-2025` in `.env`
- [ ] Update frontend localStorage model to `gemini-2.5-flash-native-audio-preview-12-2025`
- [ ] Verify model is available in your region (`us-central1`)

---

### 4. **Backend Server File**

**Current:** `server_gemini_api.py` (Gemini API)  
**Target:** `server.py` (Vertex AI)

**Action Items:**
- [ ] Stop `server_gemini_api.py` if running
- [ ] Start `server.py` instead:
  ```bash
  python server.py
  ```
- [ ] Verify server starts without errors
- [ ] Check for authentication success message

**Key Differences:**
- `server.py` uses ADC/Service Account (not API key)
- `server.py` connects to Vertex AI endpoint (not Gemini API)
- `server.py` doesn't transform model names (uses Vertex AI format directly)
- `server.py` supports more features (proactivity, affective dialog, etc.)

---

### 5. **Frontend Configuration**

**Current State:**
- Frontend sends Vertex AI format model URI (already correct!)
- Frontend expects Vertex AI endpoint format

**Action Items:**
- [ ] Clear browser localStorage:
  - Open DevTools (F12)
  - Application → Local Storage
  - Delete `model` key (if exists)
  - Delete `projectId` key (if exists)
- [ ] Verify Proxy URL: `ws://localhost:8080` (same for both)
- [ ] Verify Project ID: `ganza-ai-sovereign-2026`
- [ ] **Set Model:** Enter just the model name (NOT the full URI)
  - **Frontend automatically constructs:** `projects/{projectId}/locations/us-central1/publishers/google/models/{model}`
  - **So you enter:** `gemini-2.5-flash-native-audio-preview-12-2025` (just the model identifier)
  - **Frontend creates:** `projects/ganza-ai-sovereign-2026/locations/us-central1/publishers/google/models/gemini-2.5-flash-native-audio-preview-12-2025`

**No Code Changes Needed:**
- Frontend already constructs Vertex AI URI format automatically
- Frontend code: `this.modelUri = \`projects/${this.projectId}/locations/us-central1/publishers/google/models/${this.model}\`;`
- You just enter the model name (e.g., `gemini-live-2.5-flash-native-audio`), frontend builds the full URI
- Frontend already sends correct setup message format
- Frontend already handles Vertex AI response format

---

### 6. **API Endpoints**

**Gemini API:**
```
wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key={API_KEY}
```

**Vertex AI:**
```
wss://us-central1-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent
```

**Action Items:**
- [ ] Verify `server.py` uses Vertex AI endpoint (automatic)
- [ ] No frontend changes needed (proxy handles this)

---

### 7. **Supported Features**

**Gemini API Limitations:**
- ❌ No `proactivity` field
- ❌ No `enable_affective_dialog` in generation_config
- ⚠️ Preview models only
- ⚠️ Limited regional availability

**Vertex AI Advantages:**
- ✅ Supports `proactivity` field
- ✅ Supports `enable_affective_dialog`
- ✅ Production models available
- ✅ Better regional availability
- ✅ Better performance (expected)
- ✅ Better latency (expected)

**Action Items:**
- [ ] Review which features you're using
- [ ] Enable features that were disabled for Gemini API compatibility

---

### 8. **Testing Checklist**

After migration, test:

- [ ] **Connection:**
  - [ ] Backend starts without errors
  - [ ] Frontend connects successfully
  - [ ] No authentication errors

- [ ] **Audio:**
  - [ ] Microphone input works
  - [ ] Audio output plays correctly
  - [ ] No audio glitches

- [ ] **Latency:**
  - [ ] Response time is acceptable
  - [ ] No significant delays
  - [ ] Streaming works smoothly

- [ ] **Features:**
  - [ ] System instructions work
  - [ ] Voice selection works (if applicable)
  - [ ] Transcription works (if enabled)
  - [ ] Function calls work (if enabled)

---

## 🔧 Step-by-Step Migration

### Step 1: Backup Current Setup
```bash
# Backup .env
cp .env .env.gemini-api.backup

# Note current model name
echo "Current model: gemini-2.5-flash-native-audio-preview-12-2025"
```

### Step 2: Update .env
```env
# Remove Gemini API key (not needed)
# GEMINI_API_KEY=...

# Update model name
DEFAULT_MODEL=gemini-2.5-flash-native-audio-preview-12-2025

# Verify credentials
GOOGLE_APPLICATION_CREDENTIALS=  # Empty for ADC, or path to service account
GCP_PROJECT_ID=ganza-ai-sovereign-2026
GCP_REGION=us-central1
```

### Step 3: Verify Authentication
```bash
# Test authentication
python test_auth.py

# Should see: "SUCCESS! Access token generated"
```

### Step 4: Switch Backend Server
```bash
# Stop Gemini API server (if running)
# Ctrl+C

# Start Vertex AI server
python server.py

# Should see: "✅ Access token generated for project: ganza-ai-sovereign-2026"
# Should see: "🚀 WebSocket server started on ws://localhost:8080"
```

### Step 5: Update Frontend
1. Clear browser localStorage (DevTools → Application → Local Storage)
2. Refresh page
3. Set Project ID: `ganza-ai-sovereign-2026`
4. Set Model: `gemini-2.5-flash-native-audio-preview-12-2025`
5. Click Connect

### Step 6: Test
- [ ] Connection successful
- [ ] Audio input/output works
- [ ] Latency is acceptable
- [ ] No errors in console

---

## ⚠️ Common Issues & Solutions

### Issue 1: Authentication Failed
**Error:** `Error generating access token`

**Solutions:**
- Verify ADC: `gcloud auth application-default login`
- Verify service account path (if using)
- Verify service account has `roles/aiplatform.user` role
- Check project ID is correct

### Issue 2: Model Not Found
**Error:** `model not found for API version v1beta`

**Solutions:**
- Verify model name: `gemini-2.5-flash-native-audio-preview-12-2025`
- Verify model is available in `us-central1` region
- Check Model Garden access in Google Cloud Console
- Verify billing is enabled

### Issue 3: Connection Refused
**Error:** `Failed to connect to ws://localhost:8080`

**Solutions:**
- Verify `server.py` is running (not `server_gemini_api.py`)
- Verify `WS_PORT=8080` in `.env`
- Check firewall/antivirus blocking port 8080

### Issue 4: Wrong Model Format
**Error:** Model name errors or 404

**Solutions:**
- Use model name: `gemini-2.5-flash-native-audio-preview-12-2025`
- Clear frontend localStorage

---

## 📊 Expected Improvements

### Performance
- ✅ **Better Latency:** Production models typically faster than preview
- ✅ **Better Stability:** Production models more reliable
- ✅ **Better Availability:** More regions supported

### Features
- ✅ **More Features:** Proactivity, affective dialog, etc.
- ✅ **Better Support:** Production-grade support
- ✅ **Better Documentation:** More comprehensive docs

### Cost
- ⚠️ **May be different:** Check Vertex AI pricing vs Gemini API pricing
- ⚠️ **Billing:** Ensure billing is enabled for Vertex AI

---

## 🔄 Rollback Plan

If migration fails, rollback:

1. **Restore .env:**
   ```bash
   cp .env.gemini-api.backup .env
   ```

2. **Switch back to Gemini API server:**
   ```bash
   python server_gemini_api.py
   ```

3. **Update frontend model:**
   - Set model: `gemini-2.5-flash-native-audio-preview-12-2025` (same model)
   - Clear localStorage

---

## ✅ Final Checklist

Before considering migration complete:

- [ ] Authentication working (ADC or Service Account)
- [ ] `.env` updated with Vertex AI settings
- [ ] `server.py` running successfully
- [ ] Frontend connecting without errors
- [ ] Audio input/output working
- [ ] Latency acceptable
- [ ] All features working
- [ ] No errors in console/backend logs

---

## 📝 Notes

- **Both servers can coexist:** You can keep both `server.py` and `server_gemini_api.py`
- **Easy switching:** Just change which server you run
- **No frontend changes:** Frontend works with both (uses proxy)
- **Model names differ:** Remember to use correct format for each API

---

## 🎯 Quick Reference

| Item | Gemini API | Vertex AI |
|------|------------|-----------|
| **Server File** | `server_gemini_api.py` | `server.py` |
| **Auth** | API Key | ADC/Service Account |
| **Model Format** | `gemini-2.5-flash-native-audio-preview-12-2025` | `gemini-2.5-flash-native-audio-preview-12-2025` |
| **Endpoint** | `generativelanguage.googleapis.com` | `us-central1-aiplatform.googleapis.com` |
| **Features** | Limited | Full (proactivity, affective dialog, etc.) |
| **Performance** | Preview (slower) | Production (faster) |

---

**Ready to migrate?** Follow the step-by-step guide above! 🚀
