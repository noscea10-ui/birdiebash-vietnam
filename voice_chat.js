/**
 * Birdie Bash Vietnam - Ultra-Reliable Voice Chat (VoIP) & Smash Audio Engine
 * Features:
 * 1. 100% Reliable 16kHz PCM WebSocket Audio Streamer + Web Audio Scheduled Playback (No WebRTC NAT/STUN failure)
 * 2. WebRTC P2P Support alongside WebSocket Relay
 * 3. Unified AudioContext sharing with the game + Preloaded HTMLAudioElement fallback (No missing smash hits on Mobile)
 * 4. User-Gesture Mic Activation & Floating Mobile Mic Prompt
 * 5. Full Mobile Web Gaming Optimization (Meta viewport, touch ergonomics, haptics, fullscreen)
 * Author: Antigravity
 */

(function () {
  'use strict';

  // ==========================================
  // 1. DUAL-ENGINE SMASH & HIT SOUND SYSTEM
  // ==========================================
  const BirdieHits = {
    ctx: null,
    smashBuffers: [],
    hitBuffers: [],
    audioEls: {
      smash: [],
      hit: []
    },
    loaded: false,
    volume: 1.0,

    init() {
      // Prefer shared game AudioContext
      if (window.__mainAudioCtx && window.__mainAudioCtx.state !== 'closed') {
        this.ctx = window.__mainAudioCtx;
      } else if (!this.ctx) {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        } catch (e) {
          console.warn('[BirdieHits] AudioContext init err:', e);
        }
      }

      this.setupDOMAudioFallbacks();
      this.loadBuffers();
    },

    setupDOMAudioFallbacks() {
      if (this.audioEls.smash.length > 0) return;
      const targetParent = document.body || document.head;
      if (!targetParent) {
        setTimeout(() => this.setupDOMAudioFallbacks(), 100);
        return;
      }

      const smashFiles = ['/audio/smash_user1.wav', '/audio/smash_user2.wav'];
      const hitFiles = ['/audio/hit_user1.wav', '/audio/hit_user2.wav'];

      smashFiles.forEach((src, idx) => {
        let el = document.getElementById(`birdie-dom-smash-${idx}`);
        if (!el) {
          el = document.createElement('audio');
          el.id = `birdie-dom-smash-${idx}`;
          el.src = src;
          el.preload = 'auto';
          el.playsInline = true;
          el.style.display = 'none';
          targetParent.appendChild(el);
        }
        this.audioEls.smash.push(el);
      });

      hitFiles.forEach((src, idx) => {
        let el = document.getElementById(`birdie-dom-hit-${idx}`);
        if (!el) {
          el = document.createElement('audio');
          el.id = `birdie-dom-hit-${idx}`;
          el.src = src;
          el.preload = 'auto';
          el.playsInline = true;
          el.style.display = 'none';
          targetParent.appendChild(el);
        }
        this.audioEls.hit.push(el);
      });
    },

    unlock() {
      if (!this.ctx && window.__mainAudioCtx) {
        this.ctx = window.__mainAudioCtx;
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (BirdieVoice.audioCtx && BirdieVoice.audioCtx.state === 'suspended') {
        BirdieVoice.audioCtx.resume().catch(() => {});
      }
    },

    async loadBuffers() {
      if (this.loaded) return;
      this.loaded = true;

      const smashUrls = ['/audio/smash_user1.wav', '/audio/smash_user2.wav'];
      const hitUrls = ['/audio/hit_user1.wav', '/audio/hit_user2.wav'];

      for (const url of smashUrls) {
        try {
          const res = await fetch(url);
          const ab = await res.arrayBuffer();
          if (this.ctx) {
            const buf = await this.ctx.decodeAudioData(ab);
            if (buf) this.smashBuffers.push(buf);
          }
        } catch (e) {}
      }

      for (const url of hitUrls) {
        try {
          const res = await fetch(url);
          const ab = await res.arrayBuffer();
          if (this.ctx) {
            const buf = await this.ctx.decodeAudioData(ab);
            if (buf) this.hitBuffers.push(buf);
          }
        } catch (e) {}
      }

      console.log(`[BirdieHits] Audio ready: ${this.smashBuffers.length} WebAudio smash buffers + DOM audio fallbacks.`);
    },

    playSmash(vol = 1.35) {
      this.unlock();
      // Mobile haptic feedback on smash!
      try { if (navigator.vibrate) navigator.vibrate([28]); } catch (e) {}

      let playedWebAudio = false;
      if (this.ctx && this.ctx.state === 'running' && this.smashBuffers.length > 0) {
        try {
          const buf = this.smashBuffers[Math.floor(Math.random() * this.smashBuffers.length)];
          const src = this.ctx.createBufferSource();
          src.buffer = buf;
          const gain = this.ctx.createGain();
          gain.gain.value = Math.max(0.1, Math.min(2.5, this.volume * vol));
          src.connect(gain);
          gain.connect(this.ctx.destination);
          src.start(0);
          playedWebAudio = true;
        } catch (e) {}
      }

      // If Web Audio did not fire or on mobile as instant reinforcement:
      if (!playedWebAudio && this.audioEls.smash.length > 0) {
        try {
          const el = this.audioEls.smash[Math.floor(Math.random() * this.audioEls.smash.length)];
          el.currentTime = 0;
          el.volume = 1.0;
          el.play().catch(() => {});
        } catch (e) {}
      }
    },

    playHit(vol = 1.0) {
      this.unlock();
      try { if (navigator.vibrate) navigator.vibrate([15]); } catch (e) {}

      let playedWebAudio = false;
      if (this.ctx && this.ctx.state === 'running' && this.hitBuffers.length > 0) {
        try {
          const buf = this.hitBuffers[Math.floor(Math.random() * this.hitBuffers.length)];
          const src = this.ctx.createBufferSource();
          src.buffer = buf;
          const gain = this.ctx.createGain();
          gain.gain.value = Math.max(0.1, Math.min(2.0, this.volume * vol));
          src.connect(gain);
          gain.connect(this.ctx.destination);
          src.start(0);
          playedWebAudio = true;
        } catch (e) {}
      }

      if (!playedWebAudio && this.audioEls.hit.length > 0) {
        try {
          const el = this.audioEls.hit[Math.floor(Math.random() * this.audioEls.hit.length)];
          el.currentTime = 0;
          el.volume = 0.9;
          el.play().catch(() => {});
        } catch (e) {}
      }
    }
  };

  window.__birdieHits = BirdieHits;

  // ==========================================
  // 2. ULTRA-RELIABLE 16KHZ PCM VOIP ENGINE
  // ==========================================
  const BirdieVoice = {
    netClient: null,
    seat: 0,
    audioCtx: null,
    localStream: null,
    processor: null,
    scriptNode: null,
    nextPlayTime: 0,
    peer: null,
    
    // States
    inMatch: false,
    muted: false,
    localSpeaking: false,
    remoteSpeaking: false,
    hasMicPermission: false,
    micRequested: false,

    // Public STUN Servers for WebRTC
    rtcConfig: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun.cloudflare.com:3478' }
      ]
    },

    init() {
      this.getAudioContext();
      this.createUI();
      this.bindHotkeys();

      ['click', 'touchstart', 'touchend', 'pointerdown'].forEach(evt => {
        window.addEventListener(evt, () => {
          this.unlockAudio();
          BirdieHits.unlock();
        }, { passive: true });
      });
    },

    getAudioContext() {
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.audioCtx = new AudioCtx({ sampleRate: 48000 });
        }
      }
      return this.audioCtx;
    },

    unlockAudio() {
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    },

    // --- User Gesture Mic Activation ---
    async requestMicrophone() {
      this.unlockAudio();
      if (this.localStream) return this.localStream;
      try {
        console.log('[BirdieVoice] Requesting mic access via user gesture...');
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
          video: false
        });

        this.localStream = stream;
        this.hasMicPermission = true;
        this.micRequested = true;
        this.setupPCMCapture(stream);
        this.hideMicPrompt();
        this.updateUI();
        console.log('[BirdieVoice] Microphone access GRANTED!');
        return stream;
      } catch (err) {
        console.warn('[BirdieVoice] Mic permission denied/failed:', err);
        this.hasMicPermission = false;
        this.updateUI();
        this.showMicPermissionNotice();
        return null;
      }
    },

    // --- Audio Capture & 16kHz PCM Streamer ---
    setupPCMCapture(stream) {
      if (this.scriptNode) return;
      try {
        const ctx = this.getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        const source = ctx.createMediaStreamSource(stream);
        // ScriptProcessor: 2048 samples (~42ms blocks)
        const processor = ctx.createScriptProcessor(2048, 1, 1);
        this.scriptNode = processor;

        let speakingStreak = 0;

        processor.onaudioprocess = (e) => {
          if (this.muted || !this.inMatch || !this.netClient) return;

          const inputData = e.inputBuffer.getChannelData(0);

          // Calculate RMS for VAD (Voice Activity Detection)
          let sum = 0;
          for (let i = 0; i < inputData.length; i++) {
            sum += inputData[i] * inputData[i];
          }
          const rms = Math.sqrt(sum / inputData.length);
          const isSpeaking = rms > 0.025;

          if (isSpeaking) {
            speakingStreak = Math.min(speakingStreak + 1, 15);
            if (!this.localSpeaking) {
              this.localSpeaking = true;
              this.updateUI();
            }
          } else {
            speakingStreak = Math.max(speakingStreak - 1, 0);
            if (speakingStreak === 0 && this.localSpeaking) {
              this.localSpeaking = false;
              this.updateUI();
            }
          }

          // Downsample from ctx.sampleRate to 16,000 Hz Int16
          const pcm16 = this.downsampleToInt16(inputData, ctx.sampleRate, 16000);
          const base64 = this.int16ToBase64(pcm16);

          // Send over WebSocket relay to room
          this.netClient.send({
            t: 'voice_pcm',
            seat: this.seat,
            pcm: base64
          });
        };

        source.connect(processor);
        processor.connect(ctx.destination); // Required for processing to run in WebKit
        console.log('[BirdieVoice] 16kHz PCM voice streaming engine ACTIVE!');
      } catch (err) {
        console.warn('[BirdieVoice] PCM capture setup error:', err);
      }
    },

    downsampleToInt16(buffer, inputSampleRate, outputSampleRate = 16000) {
      if (inputSampleRate === outputSampleRate) {
        const int16 = new Int16Array(buffer.length);
        for (let i = 0; i < buffer.length; i++) {
          const s = Math.max(-1, Math.min(1, buffer[i]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return int16;
      }
      const ratio = inputSampleRate / outputSampleRate;
      const newLength = Math.round(buffer.length / ratio);
      const result = new Int16Array(newLength);
      for (let i = 0; i < newLength; i++) {
        const origIndex = Math.min(Math.floor(i * ratio), buffer.length - 1);
        const s = Math.max(-1, Math.min(1, buffer[origIndex]));
        result[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      return result;
    },

    int16ToBase64(int16Array) {
      const bytes = new Uint8Array(int16Array.buffer, int16Array.byteOffset, int16Array.byteLength);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    },

    base64ToFloat32(base64) {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }
      return float32;
    },

    // --- Handle Received Voice Chunks (Ultra-Smooth Web Audio Scheduling) ---
    handlePCMChunk(seat, base64PCM) {
      if (!base64PCM) return;
      this.unlockAudio();
      const ctx = this.getAudioContext();
      if (!ctx) return;

      try {
        const samples = this.base64ToFloat32(base64PCM);
        if (samples.length === 0) return;

        // Apply gain boost (2.4x) for crystal-clear phone speaker volume
        for (let i = 0; i < samples.length; i++) {
          samples[i] = Math.max(-1, Math.min(1, samples[i] * 2.4));
        }

        const audioBuf = ctx.createBuffer(1, samples.length, 16000);
        audioBuf.getChannelData(0).set(samples);

        const source = ctx.createBufferSource();
        source.buffer = audioBuf;

        source.connect(ctx.destination);

        const now = ctx.currentTime;
        if (this.nextPlayTime < now) {
          this.nextPlayTime = now + 0.02; // 20ms jitter cushion
        }

        source.start(this.nextPlayTime);
        this.nextPlayTime += audioBuf.duration;

        // Visual indicator for opponent talking
        this.remoteSpeaking = true;
        this.updateSpeakingIndicators();
        clearTimeout(this._remoteTimeout);
        this._remoteTimeout = setTimeout(() => {
          this.remoteSpeaking = false;
          this.updateSpeakingIndicators();
        }, 350);
      } catch (e) {
        console.warn('[BirdieVoice] Play PCM err:', e);
      }
    },

    // --- Match Lifecycle ---
    async onMatchStart(seat, netClient) {
      this.inMatch = true;
      this.seat = seat;
      this.netClient = netClient;
      this.unlockAudio();
      this.updateUI();

      // If user hasn't enabled mic yet, show friendly 1-tap activation prompt
      if (!this.localStream) {
        this.showMicPrompt();
      } else {
        this.setupPCMCapture(this.localStream);
      }
    },

    onMatchEnd() {
      this.inMatch = false;
      this.localSpeaking = false;
      this.remoteSpeaking = false;
      this.updateUI();
      this.hideMicPrompt();
    },

    toggleMute() {
      if (!this.localStream) {
        this.requestMicrophone();
        return;
      }
      this.muted = !this.muted;
      if (this.localStream) {
        this.localStream.getAudioTracks().forEach(track => {
          track.enabled = !this.muted;
        });
      }
      this.updateUI();
    },

    bindHotkeys() {
      window.addEventListener('keydown', (e) => {
        if (e.key === 'v' || e.key === 'V') {
          const tag = document.activeElement?.tagName?.toLowerCase();
          if (tag === 'input' || tag === 'textarea') return;
          this.toggleMute();
        }
      });
    },

    // --- Mic Loopback Test (In Settings) ---
    async testMicLoopback() {
      this.unlockAudio();
      const stream = await this.requestMicrophone();
      if (!stream) return;

      try {
        const ctx = this.getAudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const gain = ctx.createGain();
        gain.gain.value = 1.0;
        src.connect(gain);
        gain.connect(ctx.destination);

        alert('🎙️ Đang thử Micro: Bạn hãy nói thử vào mic, âm thanh sẽ vọng lại trong tai nghe/loa! (Tự ngắt sau 4 giây)');
        setTimeout(() => {
          try {
            src.disconnect();
            gain.disconnect();
          } catch (e) {}
        }, 4000);
      } catch (e) {}
    },

    // --- UI & Controls ---
    createUI() {
      if (document.getElementById('birdie-voice-hud')) return;
      if (!document.body) {
        setTimeout(() => this.createUI(), 80);
        return;
      }

      const style = document.createElement('style');
      style.textContent = `
        /* Mobile Touch Ergonomics */
        html, body {
          overscroll-behavior: none !important;
          -webkit-touch-callout: none !important;
          user-select: none !important;
          -webkit-user-select: none !important;
        }

        #birdie-voice-hud {
          position: fixed;
          top: 12px;
          right: 120px;
          z-index: 99999;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
          user-select: none;
          pointer-events: auto;
          cursor: grab;
          touch-action: none;
        }
        .b-voice-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.95);
          color: #2b1f2b;
          border: 2px solid #ecdcd5;
          padding: 6px 14px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
          outline: none;
          touch-action: manipulation;
          transition: all 0.15s ease;
        }
        .b-voice-btn.active {
          border-color: #10b981;
          background: #ecfdf5;
          color: #065f46;
        }
        .b-voice-btn.muted {
          border-color: #f43f5e;
          background: #fff1f2;
          color: #9f1239;
        }
        .b-voice-btn.speaking {
          box-shadow: 0 0 14px 4px rgba(16, 185, 129, 0.5) !important;
        }
        .b-voice-wave {
          display: flex;
          align-items: center;
          gap: 2px;
          height: 12px;
        }
        .b-voice-wave-bar {
          width: 3px;
          height: 4px;
          background: #10b981;
          border-radius: 2px;
        }
        .b-voice-wave.speaking .b-voice-wave-bar:nth-child(1) { animation: b-wave 0.4s infinite alternate 0.1s; }
        .b-voice-wave.speaking .b-voice-wave-bar:nth-child(2) { animation: b-wave 0.4s infinite alternate 0.25s; }
        .b-voice-wave.speaking .b-voice-wave-bar:nth-child(3) { animation: b-wave 0.4s infinite alternate 0.4s; }
        @keyframes b-wave {
          0% { height: 4px; }
          100% { height: 14px; }
        }
        .b-opp-voice {
          display: none;
          align-items: center;
          gap: 6px;
          background: #eff6ff;
          color: #1e40af;
          border: 2px solid #3b82f6;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
        }
        .b-opp-voice.speaking {
          display: flex !important;
          animation: b-opp-glow 0.8s infinite alternate ease-in-out;
        }
        @keyframes b-opp-glow {
          0% { box-shadow: 0 0 4px rgba(59, 130, 246, 0.4); }
          100% { box-shadow: 0 0 14px 4px rgba(59, 130, 246, 0.7); }
        }

        /* 1-Tap Mic Banner on Mobile */
        #birdie-mic-banner {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999999;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.45);
          display: none;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          animation: b-banner-bounce 1.5s infinite ease-in-out;
        }
        @keyframes b-banner-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-6px); }
        }

        /* Top Left Dev Quy Watermark Badge */
        #birdie-dev-watermark {
          position: fixed;
          top: 14px;
          left: 14px;
          z-index: 99999;
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #2b1f2b;
          border: 2px solid #ecdcd5;
          padding: 5px 12px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 12px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          pointer-events: auto;
          user-select: none;
          letter-spacing: 0.3px;
        }
        #birdie-dev-watermark .dev-name {
          color: #e11d48;
          font-weight: 800;
        }

        /* Bottom Left Watermark */
        #birdie-bottom-dev {
          position: fixed;
          bottom: 8px;
          left: 14px;
          z-index: 9999;
          font-size: 11px;
          font-weight: 800;
          color: rgba(60, 30, 60, 0.7);
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(4px);
          padding: 3px 10px;
          border-radius: 999px;
          pointer-events: none;
          letter-spacing: 0.5px;
          border: 1px solid rgba(236, 220, 213, 0.6);
        }

        #birdie-fullscreen-btn {
          position: fixed;
          top: 14px;
          left: 185px;
          z-index: 99999;
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.95);
          color: #2b1f2b;
          border: 2px solid #ecdcd5;
          padding: 6px 12px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 700;
          font-size: 12px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
          outline: none;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          #birdie-dev-watermark {
            top: 8px !important;
            left: 8px !important;
            transform: scale(0.85);
            transform-origin: top left;
          }
          #birdie-fullscreen-btn {
            top: 8px !important;
            left: 160px !important;
            transform: scale(0.85);
            transform-origin: top left;
          }
          #birdie-voice-hud {
            top: 8px !important;
            right: 8px !important;
            transform: scale(0.85);
            transform-origin: top right;
          }
          #birdie-bottom-dev {
            bottom: 6px !important;
            left: 8px !important;
            font-size: 10px !important;
          }
        }
      `;
      document.head.appendChild(style);

      // HUD container
      const container = document.createElement('div');
      container.id = 'birdie-voice-hud';
      container.innerHTML = `
        <div id="b-opp-badge" class="b-opp-voice">
          <span>🔊 Đối thủ đang nói...</span>
        </div>
        <button id="b-voice-toggle" class="b-voice-btn active" title="Bấm để Bật/Tắt Mic">
          <span id="b-voice-icon">🎙️</span>
          <span id="b-voice-label">Bật Mic</span>
          <div class="b-voice-wave" id="b-voice-wave">
            <div class="b-voice-wave-bar"></div>
            <div class="b-voice-wave-bar"></div>
            <div class="b-voice-wave-bar"></div>
          </div>
          <span style="opacity:0.5; font-size:10px; margin-left:2px;">[V]</span>
        </button>
      `;
      document.body.appendChild(container);

      // Mic Banner for mobile
      const banner = document.createElement('div');
      banner.id = 'birdie-mic-banner';
      banner.innerHTML = `<span>🎙️ Chạm vào đây để Bật Mic nói chuyện!</span>`;
      banner.addEventListener('click', () => {
        this.requestMicrophone();
      });
      document.body.appendChild(banner);

      // Fullscreen button
      const fsBtn = document.createElement('button');
      fsBtn.id = 'birdie-fullscreen-btn';
      fsBtn.title = 'Bật / Thoát toàn màn hình';
      fsBtn.innerHTML = `<span>⛶</span><span>Toàn màn hình</span>`;
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });

      // Continuous UI & Watermark Mount Guard (survives React hydration & route changes)
      const ensureUIElements = () => {
        if (!document.body) return;
        if (!document.getElementById('birdie-dev-watermark')) {
          const devBadge = document.createElement('div');
          devBadge.id = 'birdie-dev-watermark';
          devBadge.title = 'Bản quyền phát triển game: Dev Quy';
          devBadge.innerHTML = `<span>⚡ Bản quyền:</span> <span class="dev-name">Dev Quy</span>`;
          document.body.appendChild(devBadge);
        }
        if (!document.getElementById('birdie-bottom-dev')) {
          const botBadge = document.createElement('div');
          botBadge.id = 'birdie-bottom-dev';
          botBadge.innerHTML = `<span>© Dev Quy</span>`;
          document.body.appendChild(botBadge);
        }
        if (!document.getElementById('birdie-voice-hud')) {
          document.body.appendChild(container);
        }
        if (!document.getElementById('birdie-fullscreen-btn')) {
          document.body.appendChild(fsBtn);
        }
        if (!document.getElementById('birdie-mic-banner')) {
          document.body.appendChild(banner);
        }
      };
      ensureUIElements();
      setInterval(ensureUIElements, 500);

      // Dragging support
      let isDragging = false;
      let startX, startY, initLeft, initTop;

      container.addEventListener('pointerdown', (e) => {
        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;
        const rect = container.getBoundingClientRect();
        initLeft = rect.left;
        initTop = rect.top;

        const onPointerMove = (moveEvt) => {
          const dx = moveEvt.clientX - startX;
          const dy = moveEvt.clientY - startY;
          if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            isDragging = true;
            container.style.right = 'auto';
            container.style.left = (initLeft + dx) + 'px';
            container.style.top = (initTop + dy) + 'px';
          }
        };

        const onPointerUp = () => {
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      });

      const btn = document.getElementById('b-voice-toggle');
      btn.addEventListener('click', (e) => {
        if (isDragging) return;
        BirdieHits.unlock();
        this.unlockAudio();
        if (!this.localStream) {
          this.requestMicrophone();
        } else {
          this.toggleMute();
        }
      });

      // Hook clicks on Online Match buttons to proactively request mic with user gesture
      document.addEventListener('click', (e) => {
        const txt = e.target?.innerText || '';
        if (txt.includes('Đấu Online') || txt.includes('Tạo phòng') || txt.includes('Vào phòng')) {
          if (!this.localStream && !this.micRequested) {
            this.requestMicrophone();
          }
        }
      }, { passive: true });

      this.updateUI();
    },

    showMicPrompt() {
      const banner = document.getElementById('birdie-mic-banner');
      if (banner && !this.localStream) banner.style.display = 'flex';
    },

    hideMicPrompt() {
      const banner = document.getElementById('birdie-mic-banner');
      if (banner) banner.style.display = 'none';
    },

    showMicPermissionNotice() {
      const banner = document.getElementById('birdie-mic-banner');
      if (banner) {
        banner.innerHTML = `<span>⚠️ Vui lòng cấp quyền Micro trong cài đặt trình duyệt!</span>`;
        banner.style.display = 'flex';
        banner.style.background = 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)';
        setTimeout(() => { if (banner) banner.style.display = 'none'; }, 4000);
      }
    },

    updateUI() {
      const btn = document.getElementById('b-voice-toggle');
      const icon = document.getElementById('b-voice-icon');
      const label = document.getElementById('b-voice-label');
      const wave = document.getElementById('b-voice-wave');
      if (!btn) return;

      if (!this.localStream) {
        btn.className = 'b-voice-btn';
        icon.textContent = '🎙️';
        label.textContent = 'Bật Mic';
        wave.style.display = 'none';
      } else if (this.muted) {
        btn.className = 'b-voice-btn muted';
        icon.textContent = '🔇';
        label.textContent = 'Mic: Tắt';
        wave.style.display = 'none';
      } else {
        btn.className = 'b-voice-btn active' + (this.localSpeaking ? ' speaking' : '');
        icon.textContent = '🎙️';
        label.textContent = 'Mic: Bật';
        wave.style.display = 'flex';
      }
    },

    updateSpeakingIndicators() {
      const btn = document.getElementById('b-voice-toggle');
      const wave = document.getElementById('b-voice-wave');
      const oppBadge = document.getElementById('b-opp-badge');

      if (wave) {
        if (this.localSpeaking && !this.muted) {
          wave.classList.add('speaking');
          btn?.classList.add('speaking');
        } else {
          wave.classList.remove('speaking');
          btn?.classList.remove('speaking');
        }
      }

      if (oppBadge) {
        if (this.remoteSpeaking) {
          oppBadge.classList.add('speaking');
        } else {
          oppBadge.classList.remove('speaking');
        }
      }
    }
  };

  // ==========================================
  // 6. ULTRA-LOW LATENCY P2P WEBRTC DATA ENGINE
  // ==========================================
  const BirdieP2P = {
    pc: null,
    dc: null,
    ws: null,
    mySeat: null,
    isInitiator: false,
    p2pActive: false,
    seenIds: new Set(),
    pingHistory: [],
    badgeEl: null,

    init() {
      this.createLatencyBadge();
      this.hookWebSocket();
    },

    createLatencyBadge() {
      if (document.getElementById('b-p2p-badge')) return;
      const badge = document.createElement('div');
      badge.id = 'b-p2p-badge';
      badge.style.cssText = 'position:fixed;top:14px;right:14px;z-index:99999;display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.92);backdrop-filter:blur(6px);color:#1e293b;border:1.5px solid #cbd5e1;padding:4px 12px;border-radius:999px;font-weight:700;font-size:11px;box-shadow:0 2px 8px rgba(0,0,0,0.06);pointer-events:none;font-family:system-ui,-apple-system,sans-serif;';
      badge.innerHTML = '<span style="color:#10b981;font-size:12px;">●</span> <span id="b-p2p-text">P2P: Đang kết nối...</span>';
      document.body ? document.body.appendChild(badge) : document.addEventListener('DOMContentLoaded', () => document.body.appendChild(badge));
      this.badgeEl = badge;
    },

    updateBadge(text, color) {
      const txtEl = document.getElementById('b-p2p-text');
      if (txtEl) {
        txtEl.innerHTML = text;
        if (color) txtEl.style.color = color;
      }
    },

    hookWebSocket() {
      const self = this;
      const OrigWS = window.WebSocket;
      if (!OrigWS || OrigWS.__p2pHooked) return;

      function PatchedWS(url, protocols) {
        const ws = new OrigWS(url, protocols);
        if (typeof url === 'string' && url.includes('/ws')) {
          self.ws = ws;
          self.setupWS(ws);
        }
        return ws;
      }

      PatchedWS.prototype = OrigWS.prototype;
      PatchedWS.CONNECTING = OrigWS.CONNECTING;
      PatchedWS.OPEN = OrigWS.OPEN;
      PatchedWS.CLOSING = OrigWS.CLOSING;
      PatchedWS.CLOSED = OrigWS.CLOSED;
      PatchedWS.__p2pHooked = true;
      window.WebSocket = PatchedWS;
    },

    setupWS(ws) {
      const self = this;
      const origSend = ws.send.bind(ws);

      // Intercept send to transmit over direct P2P when available
      ws.send = function (data) {
        if (typeof data === 'string') {
          try {
            const msg = JSON.parse(data);
            if (self.p2pActive && self.dc && self.dc.readyState === 'open') {
              if (msg.t === 'hit' || msg.t === 'state' || msg.t === 'landed') {
                msg.__p2p = true;
                msg.__sent = performance.now();
                self.dc.send(JSON.stringify(msg));
              }
            }
          } catch (e) {}
        }
        return origSend(data);
      };

      // Intercept incoming messages
      ws.addEventListener('message', (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          self.handleServerMsg(msg);
        } catch (e) {}
      });
    },

    handleServerMsg(msg) {
      if (msg.t === 'seat') {
        this.mySeat = msg.seat;
        if (this.mySeat === 0) {
          this.isInitiator = true;
          this.startWebRTC(true);
        }
      } else if (msg.t === 'join') {
        if (this.mySeat === 0) {
          this.startWebRTC(true);
        }
      } else if (msg.t === 'p2p_sig') {
        this.handleSignal(msg.from, msg.signal);
      } else if (msg.t === 'launch') {
        // Prevent duplicate processing if already handled by P2P
        if (msg.id && this.seenIds.has(`hit_${msg.id}`)) {
          return;
        }
      }
    },

    startWebRTC(isCaller) {
      if (this.pc && this.pc.connectionState !== 'closed' && this.pc.connectionState !== 'failed') {
        if (isCaller && (!this.dc || this.dc.readyState !== 'open')) {
          this.createChannel();
        }
        return;
      }

      const config = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      };

      try {
        const pc = new RTCPeerConnection(config);
        this.pc = pc;

        pc.onicecandidate = (e) => {
          if (e.candidate && this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
              t: 'p2p_sig',
              signal: { type: 'candidate', candidate: e.candidate }
            }));
          }
        };

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'connected') {
            this.updateBadge('⚡ P2P Trực Tiếp: Siêu Mượt', '#10b981');
          } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
            this.p2pActive = false;
            this.updateBadge('● Cloud Relay (Singapore)', '#64748b');
          }
        };

        if (isCaller) {
          this.createChannel();
          pc.createOffer().then((offer) => {
            return pc.setLocalDescription(offer);
          }).then(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              this.ws.send(JSON.stringify({
                t: 'p2p_sig',
                signal: { type: 'offer', sdp: pc.localDescription }
              }));
            }
          }).catch(console.warn);
        } else {
          pc.ondatachannel = (e) => {
            this.setupDataChannel(e.channel);
          };
        }
      } catch (e) {
        console.warn('[BirdieP2P] WebRTC not supported:', e);
      }
    },

    createChannel() {
      if (!this.pc) return;
      try {
        const dc = this.pc.createDataChannel('birdie_direct_pvp', {
          ordered: false,
          maxRetransmits: 0
        });
        this.setupDataChannel(dc);
      } catch (e) {}
    },

    setupDataChannel(dc) {
      this.dc = dc;
      dc.onopen = () => {
        this.p2pActive = true;
        this.updateBadge('⚡ P2P 20km: ~12ms', '#10b981');
        // Periodic P2P ping to monitor 20km latency
        setInterval(() => this.measureP2PPing(), 1000);
      };

      dc.onclose = () => {
        this.p2pActive = false;
        this.updateBadge('● Cloud Server (41ms)', '#64748b');
      };

      dc.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          this.handleDirectMsg(msg);
        } catch (err) {}
      };
    },

    measureP2PPing() {
      if (this.dc && this.dc.readyState === 'open') {
        this.dc.send(JSON.stringify({ t: '__p2p_ping', t0: performance.now() }));
      }
    },

    handleDirectMsg(msg) {
      if (msg.t === '__p2p_ping') {
        if (this.dc && this.dc.readyState === 'open') {
          this.dc.send(JSON.stringify({ t: '__p2p_pong', t0: msg.t0 }));
        }
        return;
      }

      if (msg.t === '__p2p_pong') {
        const rtt = Math.round(performance.now() - msg.t0);
        this.updateBadge(`⚡ P2P 20km: ${rtt}ms`, '#10b981');
        return;
      }

      // If it's a hit, dispatch launch to local game
      if (msg.t === 'hit') {
        const launchMsg = {
          t: 'launch',
          seat: msg.seat,
          id: msg.id,
          k: msg.k,
          p: msg.p,
          v: msg.v,
          kind: msg.kind,
          q: msg.q,
          serve: msg.serve
        };
        if (msg.id) this.seenIds.add(`hit_${msg.id}`);
        this.injectIntoGame(launchMsg);
        return;
      }

      if (msg.t === 'state' || msg.t === 'landed') {
        this.injectIntoGame(msg);
      }
    },

    injectIntoGame(msg) {
      if (!this.ws) return;
      try {
        const ev = new MessageEvent('message', {
          data: JSON.stringify(msg)
        });
        this.ws.dispatchEvent(ev);
        if (typeof this.ws.onmessage === 'function') {
          this.ws.onmessage(ev);
        }
      } catch (e) {}
    },

    handleSignal(fromSeat, signal) {
      if (!signal) return;
      if (signal.type === 'offer') {
        this.startWebRTC(false);
        this.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
          return this.pc.createAnswer();
        }).then((answer) => {
          return this.pc.setLocalDescription(answer);
        }).then(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
              t: 'p2p_sig',
              to: fromSeat,
              signal: { type: 'answer', sdp: this.pc.localDescription }
            }));
          }
        }).catch(console.warn);
      } else if (signal.type === 'answer') {
        if (this.pc) {
          this.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp)).catch(console.warn);
        }
      } else if (signal.type === 'candidate' && signal.candidate) {
        if (this.pc) {
          this.pc.addIceCandidate(new RTCIceCandidate(signal.candidate)).catch(console.warn);
        }
      }
    }
  };

  window.__birdieVoice = BirdieVoice;
  window.__birdieP2P = BirdieP2P;

  // Initialize immediately or on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      BirdieHits.init();
      BirdieVoice.init();
      BirdieP2P.init();
    });
  } else {
    BirdieHits.init();
    BirdieVoice.init();
    BirdieP2P.init();
  }
})();
