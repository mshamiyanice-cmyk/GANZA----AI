/**
 * Latency Tracker for GANZA AI
 * Tracks audio streaming latency metrics
 * 
 * COMPLETE METRICS (4 timestamps):
 * 1. User finished speaking ✅
 * 2. Model began generating response (server-side) ⚠️
 * 3. First audio chunk generated (server-side) ✅
 * 4. First audio chunk played (client-side) ⚠️
 * 
 * To remove: Delete this entire file and remove integration lines from gemini-api.js
 */

export class LatencyTracker {
  constructor() {
    this.enabled = true; // Set to false to disable
    
    // Metric 1: User finished speaking
    this.userFinishedSpeakingTime = null; // When user FINISHED speaking (from INPUT_TRANSCRIPTION finished: true)
    
    // Metric 2: Model began generating response (server-side)
    this.modelGenerationStartTime = null; // When modelTurn is first detected (indicates generation started)
    
    // Metric 3: First audio chunk generated (server-side)
    this.firstAudioChunkGeneratedTime = null; // When first audio chunk is received from server
    
    // Metric 4: First audio chunk played (client-side)
    this.firstAudioChunkPlayedTime = null; // When audio.play() is called for first time
    
    // Legacy tracking (for comparison)
    this.firstAudioSentTime = null;
    this.lastAudioSentTime = null;
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

  recordUserFinishedSpeaking() {
    if (!this.enabled) return;
    const timestamp = performance.now();
    this.userFinishedSpeakingTime = timestamp;
    console.log(`[LATENCY] ✅ User finished speaking: ${timestamp.toFixed(2)}ms`);
  }

  recordModelGenerationStart() {
    if (!this.enabled) return;
    if (this.modelGenerationStartTime) return; // Only record first time
    
    const timestamp = performance.now();
    this.modelGenerationStartTime = timestamp;
    console.log(`[LATENCY] 🧠 Model generation started: ${timestamp.toFixed(2)}ms`);
    
    // Calculate: User finished → Model started generating
    if (this.userFinishedSpeakingTime) {
      const thinkingTime = timestamp - this.userFinishedSpeakingTime;
      console.log(`[LATENCY] 💭 Thinking time (user finished → model starts): ${thinkingTime.toFixed(2)}ms`);
    }
  }

  recordAudioChunkGenerated() {
    if (!this.enabled) return;
    const timestamp = performance.now();
    
    // Metric 3: First audio chunk generated (server-side)
    if (!this.firstAudioChunkGeneratedTime) {
      this.firstAudioChunkGeneratedTime = timestamp;
      console.log(`[LATENCY] 🎵 First audio chunk generated: ${timestamp.toFixed(2)}ms`);
      
      // Calculate: Model started → First audio generated
      if (this.modelGenerationStartTime) {
        const generationTime = timestamp - this.modelGenerationStartTime;
        console.log(`[LATENCY] ⚙️ Generation time (model starts → first audio): ${generationTime.toFixed(2)}ms`);
      }
      
      // Calculate: User finished → First audio generated (TRUE LATENCY - server-side)
      if (this.userFinishedSpeakingTime) {
        const trueLatency = timestamp - this.userFinishedSpeakingTime;
        console.log(`[LATENCY] ⚡ TRUE LATENCY (user finished → first audio generated): ${trueLatency.toFixed(2)}ms`);
      }
    }
    
    // Legacy tracking
    if (!this.lastAudioReceivedTime) {
      this.lastAudioReceivedTime = timestamp;
    }
    console.log(`[LATENCY] 🔊 Audio chunk received: ${timestamp.toFixed(2)}ms`);
  }

  recordAudioChunkPlayed() {
    if (!this.enabled) return;
    if (this.firstAudioChunkPlayedTime) return; // Only record first time
    
    const timestamp = performance.now();
    this.firstAudioChunkPlayedTime = timestamp;
    console.log(`[LATENCY] 🔊 First audio chunk played: ${timestamp.toFixed(2)}ms`);
    
    // Calculate: First audio generated → First audio played (network + processing)
    if (this.firstAudioChunkGeneratedTime) {
      const networkProcessingTime = timestamp - this.firstAudioChunkGeneratedTime;
      console.log(`[LATENCY] 🌐 Network + processing time (generated → played): ${networkProcessingTime.toFixed(2)}ms`);
    }
    
    // Calculate: User finished → First audio played (END-TO-END LATENCY)
    if (this.userFinishedSpeakingTime) {
      const endToEndLatency = timestamp - this.userFinishedSpeakingTime;
      console.log(`[LATENCY] 🎯 END-TO-END LATENCY (user finished → audio played): ${endToEndLatency.toFixed(2)}ms`);
    }
  }

  // Legacy method for backward compatibility
  recordAudioReceived() {
    this.recordAudioChunkGenerated();
  }

  calculateVoiceToVoice() {
    if (!this.enabled || !this.userFinishedSpeakingTime) {
      return null;
    }
    
    // Use first audio played for voice-to-voice (most accurate)
    const endTime = this.firstAudioChunkPlayedTime || this.firstAudioChunkGeneratedTime;
    if (!endTime) return null;
    
    const voiceToVoice = endTime - this.userFinishedSpeakingTime;
    console.log(`[LATENCY] 🎤→🔊 Voice-to-Voice: ${voiceToVoice.toFixed(2)}ms`);
    return voiceToVoice;
  }

  reset() {
    this.userFinishedSpeakingTime = null;
    this.modelGenerationStartTime = null;
    this.firstAudioChunkGeneratedTime = null;
    this.firstAudioChunkPlayedTime = null;
    
    // Legacy
    this.firstAudioSentTime = null;
    this.lastAudioSentTime = null;
    this.lastAudioReceivedTime = null;
  }
}
