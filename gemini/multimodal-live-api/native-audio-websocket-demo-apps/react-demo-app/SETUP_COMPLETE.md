# ✅ Setup Complete - Environment Variables Configuration

## **What's Been Done**

1. ✅ **Updated `server.py`** to read from environment variables
2. ✅ **Added `python-dotenv`** to `requirements.txt`
3. ✅ **Created `ENV_TEMPLATE.txt`** - Template for your `.env` file
4. ✅ **Created `ENV_SETUP.md`** - Complete setup guide

---

## **Next Steps: Create Your .env File**

### **Step 1: Create .env File**

In the `react-demo-app` directory, create a file named `.env`:

**Windows (PowerShell):**
```powershell
cd cascade-voice-ai\generative-ai\gemini\multimodal-live-api\native-audio-websocket-demo-apps\react-demo-app
New-Item -Path .env -ItemType File
```

**Windows (CMD):**
```cmd
cd cascade-voice-ai\generative-ai\gemini\multimodal-live-api\native-audio-websocket-demo-apps\react-demo-app
type nul > .env
```

**Linux/Mac:**
```bash
cd cascade-voice-ai/generative-ai/gemini/multimodal-live-api/native-audio-websocket-demo-apps/react-demo-app
touch .env
```

### **Step 2: Copy Template and Fill In Values**

1. Open `ENV_TEMPLATE.txt`
2. Copy all contents
3. Paste into `.env`
4. Fill in your values:

```env
# Minimum required:
GCP_PROJECT_ID=ganza-ai-sovereign-2026

# Choose ONE authentication method:

# Option 1: Service Account (Recommended)
GOOGLE_APPLICATION_CREDENTIALS=C:\Users\HP\path\to\your\service-account-key.json

# Option 2: ADC (Leave empty and use: gcloud auth application-default login)
# GOOGLE_APPLICATION_CREDENTIALS=
```

---

## **Required Values**

### **Minimum Required:**

1. **`GCP_PROJECT_ID`** - Your Google Cloud Project ID
   - Example: `ganza-ai-sovereign-2026`

2. **Authentication (choose one):**
   - **Option A:** `GOOGLE_APPLICATION_CREDENTIALS` - Path to service account JSON key
   - **Option B:** Leave `GOOGLE_APPLICATION_CREDENTIALS` empty and use ADC

### **Optional (has defaults):**

- `GCP_REGION` - Default: `us-central1`
- `DEFAULT_MODEL` - Default: `gemini-live-2.5-flash-native-audio`
- `WS_PORT` - Default: `8080`
- `DEBUG` - Default: `false`

---

## **Example .env File**

```env
# Google Cloud Project
GCP_PROJECT_ID=ganza-ai-sovereign-2026

# Service Account (if using)
GOOGLE_APPLICATION_CREDENTIALS=C:\Users\HP\gemini-live-key.json

# Region
GCP_REGION=us-central1

# Model
DEFAULT_MODEL=gemini-live-2.5-flash-native-audio

# Server
WS_PORT=8080
DEBUG=false
```

---

## **Install Dependencies**

Make sure `python-dotenv` is installed:

```bash
pip install -r requirements.txt
```

---

## **Test the Setup**

1. **Start the server:**
   ```bash
   python server.py
   ```

2. **You should see:**
   ```
   🔍 Testing authentication...
   ✅ Access token generated for project: ganza-ai-sovereign-2026
   ╔════════════════════════════════════════════════════════════╗
   ║     Gemini Live API Proxy Server                          ║
   ...
   ```

3. **If authentication fails:**
   - Check `GOOGLE_APPLICATION_CREDENTIALS` path is correct
   - Or run: `gcloud auth application-default login`
   - Verify service account has `roles/aiplatform.user` role

---

## **Files Created/Modified**

- ✅ `server.py` - Now reads from `.env` file
- ✅ `requirements.txt` - Added `python-dotenv`
- ✅ `ENV_TEMPLATE.txt` - Template for `.env` file
- ✅ `ENV_SETUP.md` - Complete setup guide
- ✅ `.gitignore` - Already includes `.env` (verified)

---

## **Security Notes**

- ⚠️ **`.env` is in `.gitignore`** - Never commit it to git
- ✅ Use `ENV_TEMPLATE.txt` as reference
- ✅ Keep service account keys secure
- ✅ Don't share your `.env` file

---

## **Need Help?**

See `ENV_SETUP.md` for:
- How to create service account
- How to set up ADC
- Troubleshooting guide
- Complete configuration options

---

**Status**: ✅ Ready for you to create `.env` file and add your credentials!
