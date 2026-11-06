// Sound engine — Web Audio synthesised UI SFX + looping menu soundtrack.
// Reverse-engineered from the reference: every cue is generated with
// oscillators/noise buffers, no audio files required for the effects.

const SOUNDTRACK_OPUS = "assets/menu-soundtrack.opus";
const SOUNDTRACK_MP3 = "assets/menu-soundtrack.mp3";
const TRACK_VOLUME = 0.22;
const FADE_IN_MS = 2200;
const FADE_OUT_MS = 1400;

class SoundEngine {
  constructor() {
    this._ctx = null;
    this._enabled = true;
    this._vol = 0.55;
    this._track = null;
    this._trackFade = null;
    this._inMenuZone = false;
    this._lastPlayed = {};
    this._COOLDOWN = {
      tick: 30,
      confirm: 200,
      close: 160,
      back: 200,
      reveal: 200,
    };
    this._onGesture = this._onGesture.bind(this);
    this._gestureTypes = ["pointerdown", "touchstart", "keydown", "wheel"];
    this._armGesture();
  }

  _armGesture() {
    this._gestureTypes.forEach((type) =>
      document.addEventListener(type, this._onGesture, { once: true, passive: true })
    );
  }

  _ctx_get() {
    if (!this._ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this._ctx = new AC();
    }
    return this._ctx;
  }

  _onGesture() {
    this._gestureTypes.forEach((type) => document.removeEventListener(type, this._onGesture));
    const ctx = this._ctx_get();
    if (ctx.state === "suspended") ctx.resume();
    // A click can land before the page's 400 ms soundtrack timer, so create
    // the track here too instead of wasting that first gesture.
    if (this._inMenuZone && (!this._track || this._track.paused)) this.ensurePlaying();
    this._armGesture();
  }

  _ensureTrack() {
    if (this._track) return;
    const el = new Audio();
    el.src = el.canPlayType('audio/ogg; codecs="opus"') ? SOUNDTRACK_OPUS : SOUNDTRACK_MP3;
    el.loop = true;
    el.preload = "auto";
    el.volume = 0;
    el.addEventListener("error", () => {
      if (!el.src.endsWith(".opus")) return;
      el.src = SOUNDTRACK_MP3;
      el.load();
      if (this._inMenuZone && this._enabled) this._startTrack();
    }, { once: true });
    this._track = el;
  }

  _startTrack() {
    if (!this._track || !this._enabled) return;
    clearInterval(this._trackFade);
    this._track.muted = false;
    if (this._track.paused) {
      this._track.play().catch(() => {});
    }
    const target = TRACK_VOLUME * this._vol;
    const step = 40;
    const ticks = FADE_IN_MS / step;
    const inc = target / ticks;
    this._trackFade = setInterval(() => {
      if (!this._track) return clearInterval(this._trackFade);
      const v = Math.min(this._track.volume + inc, target);
      this._track.volume = v;
      if (v >= target) clearInterval(this._trackFade);
    }, step);
  }

  _fadeOutTrack(done) {
    if (!this._track) return done && done();
    clearInterval(this._trackFade);
    const start = this._track.volume;
    const step = 30;
    const ticks = FADE_OUT_MS / step;
    const dec = start / ticks;
    this._trackFade = setInterval(() => {
      if (!this._track) return clearInterval(this._trackFade);
      const v = Math.max(this._track.volume - dec, 0);
      this._track.volume = v;
      if (v <= 0) {
        clearInterval(this._trackFade);
        done && done();
      }
    }, step);
  }

  soundtrackEnter() {
    this._inMenuZone = true;
    this._ensureTrack();
    if (this._enabled) this._startTrack();
  }

  setEnabled(enabled) {
    this._enabled = enabled;
    if (enabled) {
      if (this._inMenuZone) this.soundtrackEnter();
    } else {
      this._fadeOutTrack(() => this._track && this._track.pause());
    }
  }

  get enabled() {
    return this._enabled;
  }

  get playing() {
    return !!this._track && !this._track.paused && this._track.readyState >= 2;
  }

  ensurePlaying() {
    this._inMenuZone = true;
    this._ensureTrack();
    if (this._enabled) this._startTrack();
  }

  _canPlay(name) {
    const now = performance.now();
    const last = this._lastPlayed[name] || 0;
    const cd = this._COOLDOWN[name] || 60;
    if (now - last < cd) return false;
    this._lastPlayed[name] = now;
    return true;
  }

  _tone(freq, gain, dur, type = "sine", attack = 0) {
    const ctx = this._ctx_get();
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (attack > 0) {
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gain * this._vol, t + attack);
    } else {
      g.gain.setValueAtTime(gain * this._vol, t);
    }
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  }

  _noise(gain, dur, freq = 4000, q = 1) {
    const ctx = this._ctx_get();
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;
    const len = Math.ceil(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq, t);
    filter.Q.setValueAtTime(q, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain * this._vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    src.start(t);
  }

  _sfx_tick() {
    this._tone(880, 0.22, 0.055, "triangle");
    setTimeout(() => this._tone(660, 0.1, 0.04, "sine"), 18);
  }

  _sfx_confirm() {
    this._tone(440, 0.28, 0.22, "sine", 0.008);
    setTimeout(() => this._tone(660, 0.2, 0.3, "sine", 0.005), 60);
    this._noise(0.06, 0.04, 3000, 2);
  }

  _sfx_close() {
    const ctx = this._ctx_get();
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(360, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.16);
    g.gain.setValueAtTime(0.16 * this._vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  _sfx_back() {
    this._tone(320, 0.16, 0.12, "triangle");
    setTimeout(() => this._tone(220, 0.1, 0.1, "sine"), 35);
  }

  _sfx_reveal() {
    this._tone(180, 0.2, 0.35, "sine", 0.04);
    setTimeout(() => this._tone(270, 0.1, 0.25, "sine", 0.02), 80);
  }

  play(name) {
    if (!this._enabled || !this._canPlay(name)) return;
    switch (name) {
      case "tick": return this._sfx_tick();
      case "confirm": return this._sfx_confirm();
      case "close": return this._sfx_close();
      case "back": return this._sfx_back();
      case "reveal": return this._sfx_reveal();
    }
  }
}

export const sound = new SoundEngine();
export default sound;
