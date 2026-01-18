# 🔧 Fix .env Credentials Error

## **The Problem**

You put an **access token** (`ya29...`) in the `GOOGLE_APPLICATION_CREDENTIALS` field, but that field expects a **file path** to a service account JSON key file.

---

## **The Error**

```
🔑 Using service account: ya29.a0AUMWg_...
❌ Error generating access token: File ya29.a0AUMWg_... was not found.
```

The code is trying to use `ya29...` as a file path, which doesn't exist!

---

## **✅ Solution: Choose ONE Option**

### **Option 1: Use Application Default Credentials (ADC) - RECOMMENDED**

**Step 1:** Edit your `.env` file and **leave `GOOGLE_APPLICATION_CREDENTIALS` empty:**

```env
# Leave this EMPTY to use ADC
GOOGLE_APPLICATION_CREDENTIALS=

# Your project ID
GCP_PROJECT_ID=ganza-ai-sovereign-2026

# Region
GCP_REGION=us-central1

# Model
DEFAULT_MODEL=gemini-live-2.5-flash-native-audio
```

**Step 2:** Set up ADC:
```bash
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform
```

**Step 3:** Test:
```bash
gcloud auth application-default print-access-token
```

---

### **Option 2: Use Service Account Key File**

**Step 1:** Create/download a service account key:
```bash
# Create service account (if not exists)
gcloud iam service-accounts create gemini-live-sa \
  --display-name="Gemini Live API Service Account" \
  --project=ganza-ai-sovereign-2026

# Grant permissions
gcloud projects add-iam-policy-binding ganza-ai-sovereign-2026 \
  --member="serviceAccount:gemini-live-sa@ganza-ai-sovereign-2026.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Create and download key
gcloud iam service-accounts keys create gemini-live-key.json \
  --iam-account=gemini-live-sa@ganza-ai-sovereign-2026.iam.gserviceaccount.com \
  --project=ganza-ai-sovereign-2026
```

**Step 2:** Move the key file to a safe location:
```powershell
# Move to your home directory or project folder
Move-Item gemini-live-key.json C:\Users\HP\gemini-live-key.json
```

**Step 3:** Edit your `.env` file with the **full path** to the key file:
```env
# Full path to service account JSON key file
GOOGLE_APPLICATION_CREDENTIALS=C:\Users\HP\gemini-live-key.json

# Your project ID
GCP_PROJECT_ID=ganza-ai-sovereign-2026

# Region
GCP_REGION=us-central1

# Model
DEFAULT_MODEL=gemini-live-2.5-flash-native-audio
```

---

## **🎯 Quick Fix (Recommended)**

**Just use ADC - it's simpler!**

1. **Edit `.env` file:**
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=
   GCP_PROJECT_ID=ganza-ai-sovereign-2026
   GCP_REGION=us-central1
   DEFAULT_MODEL=gemini-live-2.5-flash-native-audio
   ```

2. **Set up ADC:**
   ```bash
   gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform
   ```

3. **Test the server:**
   ```bash
   python server.py
   ```

---

## **📋 What Each Field Means**

| Field | What It Should Be | Example |
|-------|-------------------|---------|
| `GOOGLE_APPLICATION_CREDENTIALS` | **File path** to JSON key OR **empty** for ADC | `C:\Users\HP\key.json` OR `` (empty) |
| `GCP_PROJECT_ID` | Your project ID | `ganza-ai-sovereign-2026` |
| `GCP_REGION` | GCP region | `us-central1` |
| `DEFAULT_MODEL` | Model name | `gemini-live-2.5-flash-native-audio` |

---

## **❌ Common Mistakes**

1. ❌ **Putting access token in `GOOGLE_APPLICATION_CREDENTIALS`**
   - ✅ Should be: File path OR empty

2. ❌ **Putting relative path without quotes**
   - ✅ Should be: Full absolute path

3. ❌ **Using wrong file format**
   - ✅ Should be: JSON key file from GCP Console

---

## **✅ After Fixing**

Run the server again:
```bash
python server.py
```

You should see:
```
🔍 Testing authentication...
🔑 Using Application Default Credentials (ADC)
✅ Access token generated for project: ganza-ai-sovereign-2026
```

---

**Status**: 🔧 **Fix `.env` file - remove the access token, use file path or leave empty!**
