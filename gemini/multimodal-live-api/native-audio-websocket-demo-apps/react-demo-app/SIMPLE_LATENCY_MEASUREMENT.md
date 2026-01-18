# ⚡ Simple Latency Measurement - Minimal Code Changes

## **Approach: Console Logging Only (5-10 lines of code)**

**Time Investment:** 5-10 minutes  
**Code Changes:** Minimal - just add timestamps to existing console.log statements

---

## **What We'll Add**

### **1. In `gemini-api.js` (3 lines)**

**Line ~70** (when audio sent):
```javascript
// In sendAudioMessage() method
console.log(`[LATENCY] Audio sent at: ${performance.now().toFixed(2)}ms`);
```

**Line ~255** (when response received):
```javascript
// In onReceiveMessage() method  
console.log(`[LATENCY] Response received at: ${performance.now().toFixed(2)}ms`);
```

**Line ~157** (when audio chunk received):
```javascript
// In handleMessage() when AUDIO type
console.log(`[LATENCY] First audio chunk at: ${performance.now().toFixed(2)}ms`);
```

### **2. In `media-utils.js` (2 lines)**

**Line ~70** (when audio sent):
```javascript
// In AudioStreamer when sending audio
console.log(`[LATENCY] Audio capture sent at: ${performance.now().toFixed(2)}ms`);
```

**Line ~157** (when playback starts):
```javascript
// In AudioPlayer when playback starts
console.log(`[LATENCY] Audio playback started at: ${performance.now().toFixed(2)}ms`);
```

---

## **How to Calculate**

**Manual calculation from console:**
1. Open browser DevTools Console
2. Speak to GANZA AI
3. Look for `[LATENCY]` logs
4. Subtract timestamps to get latency

**Example:**
```
[LATENCY] Audio sent at: 1234.56ms
[LATENCY] Response received at: 1523.78ms
Voice-to-Voice = 1523.78 - 1234.56 = 289.22ms
```

---

## **Alternative: Browser DevTools Performance Tab**

**Even simpler - NO code changes:**

1. Open DevTools → Performance tab
2. Click Record
3. Speak to GANZA AI
4. Stop recording
5. Analyze timeline

**Shows:**
- Network requests (WebSocket messages)
- Audio processing
- Timeline of events

**Time Investment:** 0 minutes (no code changes)

---

## **Recommendation**

**Use Browser DevTools Performance Tab** - No code changes needed, gives you all the timing data you need.

**If you want automated logging:** Add the 5 console.log statements above (5 minutes).

---

**Status:** ✅ **Simplest possible approach**
