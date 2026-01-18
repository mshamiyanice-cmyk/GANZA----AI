# 🔧 Fix Project ID and Model Name Issues

## **Issues Found:**

1. **❌ Wrong Project ID in .env**
   - Current: `764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com` (OAuth Client ID)
   - Should be: `ganza-ai-sovereign-2026` (Project ID)

2. **❌ Model Name Truncated**
   - Error shows: `gemini-2.5-flash-native-au` (truncated)
   - Should be: `gemini-live-2.5-flash-native-audio`

---

## **✅ Fix Your .env File**

Edit your `.env` file and change:

**WRONG:**
```env
GCP_PROJECT_ID=764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com
```

**CORRECT:**
```env
GCP_PROJECT_ID=ganza-ai-sovereign-2026
```

---

## **✅ Complete .env File Should Be:**

```env
# Google Cloud Credentials
GOOGLE_APPLICATION_CREDENTIALS=

# GCP Project Configuration
GCP_PROJECT_ID=ganza-ai-sovereign-2026
GCP_REGION=us-central1

# Gemini Model Configuration
DEFAULT_MODEL=gemini-live-2.5-flash-native-audio

# Server Configuration
WS_PORT=8080
DEBUG=false
```

---

## **✅ Also Check Frontend localStorage**

The frontend might have the wrong project ID cached. Clear it:

1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Find Local Storage
4. Delete `projectId` key
5. Refresh the page
6. Enter correct project ID: `ganza-ai-sovereign-2026`

---

## **After Fixing:**

1. **Restart the backend server:**
   ```bash
   python server.py
   ```

2. **Clear browser localStorage** (as above)

3. **Try connecting again**

---

**Status**: 🔧 **Fix .env file - change project ID to `ganza-ai-sovereign-2026`!**
