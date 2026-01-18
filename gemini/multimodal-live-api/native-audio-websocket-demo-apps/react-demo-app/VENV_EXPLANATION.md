# 🐍 Virtual Environment - How It Works

## **Yes! You Can Access All Packages When Venv is Activated**

When you activate the virtual environment, Python uses **only** the packages installed in that venv. Here's how it works:

---

## **How Virtual Environments Work**

### **When Venv is ACTIVATED:**
- ✅ Python uses packages from: `C:\Users\HP\.cursor\.venv\lib\site-packages`
- ✅ You can import and use all installed packages
- ✅ Your terminal prompt shows `(.venv)`

### **When Venv is NOT Activated:**
- ❌ Python uses packages from global installation
- ❌ Packages installed in venv are **NOT accessible**
- ❌ You'll get `ModuleNotFoundError` if trying to use venv-only packages

---

## **How to Check if Venv is Active**

### **Method 1: Check Your Prompt**
```
(.venv) PS C:\Users\HP\...>   ← Venv is ACTIVE
PS C:\Users\HP\...>            ← Venv is NOT active
```

### **Method 2: Check Python Path**
```powershell
python -c "import sys; print(sys.executable)"
```

**If venv is active:**
```
C:\Users\HP\.cursor\.venv\Scripts\python.exe
```

**If venv is NOT active:**
```
C:\Users\HP\AppData\Local\Programs\Python\Python311\python.exe
```

### **Method 3: Check Installed Packages**
```powershell
python -m pip list
```

This shows packages installed in the **currently active** Python environment.

---

## **How to Activate Venv**

### **In PowerShell:**
```powershell
& "C:\Users\HP\.cursor\.venv\Scripts\Activate.ps1"
```

### **In Command Prompt (CMD):**
```cmd
C:\Users\HP\.cursor\.venv\Scripts\activate.bat
```

### **In Git Bash:**
```bash
source C:/Users/HP/.cursor/.venv/Scripts/activate
```

---

## **Important Notes**

### **1. Venv Must Be Activated Each Time**
- When you open a **new terminal**, the venv is NOT automatically activated
- You need to run the activation command each time

### **2. Packages Are Isolated**
- Packages in venv are **separate** from global Python
- Installing in venv doesn't affect global Python
- Installing globally doesn't affect venv

### **3. Why Use Venv?**
- ✅ **Isolation**: Different projects can have different package versions
- ✅ **Clean**: No conflicts between projects
- ✅ **Reproducible**: Easy to recreate the environment
- ✅ **Portable**: Can share requirements.txt

---

## **Quick Reference**

### **Check if venv is active:**
```powershell
python -c "import sys; print('Venv active!' if 'venv' in sys.executable.lower() else 'Venv NOT active')"
```

### **List packages in venv:**
```powershell
python -m pip list
```

### **Install package in venv:**
```powershell
python -m pip install package-name
```

### **Install from requirements.txt:**
```powershell
python -m pip install -r requirements.txt
```

---

## **For Your Gemini Demo**

### **Always activate venv before running:**
```powershell
# 1. Activate venv
& "C:\Users\HP\.cursor\.venv\Scripts\Activate.ps1"

# 2. Navigate to project
cd C:\Users\HP\.cursor\cascade-voice-ai\generative-ai\gemini\multimodal-live-api\native-audio-websocket-demo-apps\react-demo-app

# 3. Run server
python server.py
```

### **Packages installed in your venv:**
- ✅ `python-dotenv` - Load .env files
- ✅ `websockets` - WebSocket support
- ✅ `google-auth` - Google Cloud authentication
- ✅ `certifi` - SSL certificates
- ✅ `requests` - HTTP library

All of these are accessible when venv is activated!

---

## **Troubleshooting**

### **Error: "ModuleNotFoundError: No module named 'dotenv'"**
**Solution:** Venv is not activated. Activate it first.

### **Error: "Command not found: python"**
**Solution:** Make sure Python is installed and in PATH.

### **Packages not found after installation**
**Solution:** 
1. Make sure venv is activated
2. Check you're using `python -m pip install` (not just `pip install`)
3. Verify installation: `python -m pip list`

---

**Summary:** Yes, when venv is activated, you have full access to all packages installed in it! 🎉
