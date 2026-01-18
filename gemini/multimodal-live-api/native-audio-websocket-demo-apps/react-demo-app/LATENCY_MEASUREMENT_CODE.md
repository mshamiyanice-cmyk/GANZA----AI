# Latency Measurement Code

This document contains all the code we added for measuring latency in GANZA AI. These are the exact code snippets that generate the console logs you see.

---

## 1. Latency Tracker Class

**File:** `src/utils/latency-tracker.js`

```javascript
/**
 * Latency Tracker for GANZA AI
 * Tracks audio streaming latency metrics
 * 
 * To remove: Delete this entire file and remove 5 lines from gemini-api.js
 */

export class LatencyTracker {
  constructor() {
    this.enabled = true; // Set to false to disable
    this.firstAudioSentTime = null;
    this.lastAudioSentTime = null;
    this.firstAudioReceivedTime = null;
    this.lastAudioReceivedTime = null;
  }

  recordAudioSent() {
    if (!this.enabled) return;
    const timestamp = performance.now();
    if (!this.firstAudioSentTime) {
      this.firstAudioSentTime = timestamp;
    }
    this.lastAudioSentTime = timestamp;
    console.log(`[LATENCY] 🎤 Audio sent: ${timestamp.toFixed(2)}ms`);
  }

  recordAudioReceived() {
    if (!this.enabled) return;
    const timestamp = performance.now();
    if (!this.firstAudioReceivedTime) {
      this.firstAudioReceivedTime = timestamp;
      if (this.firstAudioSentTime) {
        const ttfa = timestamp - this.firstAudioSentTime;
        console.log(`[LATENCY] ⚡ Time to First Audio (TTFA): ${ttfa.toFixed(2)}ms`);
      }
    }
    this.lastAudioReceivedTime = timestamp;
    console.log(`[LATENCY] 🔊 Audio received: ${timestamp.toFixed(2)}ms`);
  }

  calculateVoiceToVoice() {
    if (!this.enabled || !this.firstAudioSentTime || !this.firstAudioReceivedTime) {
      return null;
    }
    const voiceToVoice = this.firstAudioReceivedTime - this.lastAudioSentTime;
    console.log(`[LATENCY] 🎤→🔊 Voice-to-Voice: ${voiceToVoice.toFixed(2)}ms`);
    return voiceToVoice;
  }

  reset() {
    this.firstAudioSentTime = null;
    this.lastAudioSentTime = null;
    this.firstAudioReceivedTime = null;
    this.lastAudioReceivedTime = null;
  }
}
```

---

## 2. Integration in Gemini API Client

**File:** `src/utils/gemini-api.js`

### 2.1. Import and Initialize (Top of file)

```javascript
// LATENCY TRACKING - Can delete these 2 lines to remove
import { LatencyTracker } from './latency-tracker.js';
const latencyTracker = new LatencyTracker();
```

### 2.2. Assign to GeminiLiveAPI Instance (Constructor)

```javascript
export class GeminiLiveAPI {
  constructor(proxyUrl, projectId, model) {
    // ... existing code ...
    
    // LATENCY TRACKING - Can delete this line to remove
    this.latencyTracker = latencyTracker;
    
    // ... rest of constructor ...
  }
}
```

### 2.3. Track Audio Sent (sendAudioMessage method)

```javascript
sendAudioMessage(base64PCM) {
  // LATENCY TRACKING - Can delete this line to remove
  this.latencyTracker.recordAudioSent();
  this.sendRealtimeInputMessage(base64PCM, "audio/pcm");
}
```

### 2.4. Track Audio Received (onReceiveMessage method)

```javascript
onReceiveMessage(messageEvent) {
  // console.log("Message received: ", messageEvent);
  const messageData = JSON.parse(messageEvent.data);
  const message = new MultimodalLiveResponseMessage(messageData);
  
  // LATENCY TRACKING - Can delete this block to remove
  if (message.type === MultimodalLiveResponseType.AUDIO) {
    this.latencyTracker.recordAudioReceived();
  }
  
  this.onReceiveResponse(message);
}
```

---

## Console Output Examples

### Audio Sent Logs
```
[LATENCY] 🎤 Audio sent: 4788.10ms
[LATENCY] 🎤 Audio sent: 5037.00ms
[LATENCY] 🎤 Audio sent: 5293.50ms
```

### True Latency (User Finished → AI Responds)
```
[LATENCY] ✅ User finished speaking: 30000.00ms
[LATENCY] ⚡ TRUE LATENCY (user finished → AI responds): 1000.00ms
```

### Indecision Time (First Input → First Output) - For Comparison
```
[LATENCY] ⏱️ INDECISION TIME (first input → first output): 30309.70ms
```

### Audio Received Logs
```
[LATENCY] 🔊 Audio received: 35097.80ms
[LATENCY] 🔊 Audio received: 35122.90ms
[LATENCY] 🔊 Audio received: 35124.20ms
```

### Voice-to-Voice (TRUE - if calculated)
```
[LATENCY] 🎤→🔊 Voice-to-Voice (TRUE): 123.45ms
```

---

## How It Works

1. **Audio Sent Tracking:**
   - Every time audio is sent to the server, `recordAudioSent()` is called
   - Records the first audio sent time and updates the last audio sent time
   - Logs: `[LATENCY] 🎤 Audio sent: {timestamp}ms`

2. **User Finished Speaking Detection:**
   - When `INPUT_TRANSCRIPTION` with `finished: true` is received, `recordUserFinishedSpeaking()` is called
   - This marks when the user actually STOPPED speaking (not when they started)
   - Logs: `[LATENCY] ✅ User finished speaking: {timestamp}ms`

3. **Audio Received Tracking (TRUE Latency):**
   - Every time audio is received from the server, `recordAudioReceived()` is called
   - On the first audio received, calculates TRUE LATENCY: `firstAudioReceivedTime - userFinishedSpeakingTime`
   - Logs: `[LATENCY] 🔊 Audio received: {timestamp}ms`
   - Logs: `[LATENCY] ⚡ TRUE LATENCY (user finished → AI responds): {latency}ms` (first time only)
   - Also logs: `[LATENCY] ⏱️ INDECISION TIME (first input → first output): {time}ms` for comparison

4. **Voice-to-Voice Calculation:**
   - Can be called manually using `calculateVoiceToVoice()`
   - Calculates TRUE latency: `firstAudioReceivedTime - userFinishedSpeakingTime`
   - Logs: `[LATENCY] 🎤→🔊 Voice-to-Voice (TRUE): {latency}ms`

5. **Reset:**
   - Call `reset()` to clear all timestamps and start fresh

---

## Metrics Calculated

### ⚠️ CORRECTION: TRUE Latency vs "Indecision Time"

**Previous (WRONG) measurement:**
- Measured: `firstAudioReceivedTime - firstAudioSentTime`
- This included the entire time the user was speaking
- This is "indecision time" or "time from first input to first output", NOT true latency

**Current (CORRECT) measurement:**
- **TRUE Latency:** `firstAudioReceivedTime - userFinishedSpeakingTime`
- **Meaning:** Time from when user FINISHES speaking until AI starts responding
- **Target:** < 500ms
- **How it works:** Uses `INPUT_TRANSCRIPTION` with `finished: true` to detect when user stops speaking

### True Latency (User Finished → AI Responds)
- **Formula:** `firstAudioReceivedTime - userFinishedSpeakingTime`
- **Meaning:** Time from when user FINISHES speaking until AI starts responding
- **Target:** < 500ms
- **Detection:** Uses `INPUT_TRANSCRIPTION` event with `finished: true` flag

### Indecision Time (First Input → First Output)
- **Formula:** `firstAudioReceivedTime - firstAudioSentTime`
- **Meaning:** Time from when user STARTS speaking until AI starts responding
- **Note:** This includes the entire duration the user is speaking - NOT true latency
- **Purpose:** Kept for comparison/debugging purposes

### Voice-to-Voice Latency
- **Formula:** `firstAudioReceivedTime - userFinishedSpeakingTime`
- **Meaning:** Same as True Latency - time from when user finishes speaking until AI responds
- **Target:** < 500ms

---

## To Remove Latency Tracking

1. Delete the file: `src/utils/latency-tracker.js`
2. Remove from `src/utils/gemini-api.js`:
   - Line 5-7: Import and initialization
   - Line 177-178: Assignment in constructor
   - Line 265-268: Audio received tracking
   - Line 270-273: User finished speaking tracking (INPUT_TRANSCRIPTION)
   - Line 425-426: Audio sent tracking

---

## Notes

- All timestamps use `performance.now()` for high-precision timing
- Timestamps are relative to page load (not absolute time)
- The tracker is enabled by default (`this.enabled = true`)
- Set `this.enabled = false` to disable logging without removing code
