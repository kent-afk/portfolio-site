import { sound } from "./sound.js";

// Small fixed mute/unmute control in the bottom-right safe corner.

export function initAudioToggle() {
  let enabled = readAudioPreference();
  const btn = document.createElement("button");
  btn.id = "audio-toggle";
  btn.setAttribute("aria-label", "Mute sound");
  btn.title = "Mute sound";
  btn.textContent = "SOUND ON";
  btn.style.cssText = [
    "position:fixed",
    "bottom:max(20px, env(safe-area-inset-bottom))",
    "right:max(20px, env(safe-area-inset-right))",
    "z-index:50",
    "min-width:44px",
    "height:44px",
    "padding:0 12px",
    "background:rgba(8,8,6,0.78)",
    "border:1px solid rgba(244,241,234,0.32)",
    "color:rgba(244,241,234,0.78)",
    "cursor:pointer",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "font-size:10px",
    "font-weight:700",
    "font-family:var(--font-mono)",
    "letter-spacing:0.08em",
    "text-transform:uppercase",
    "transition:border-color 0.2s, color 0.2s",
  ].join(";");

  sound.setEnabled(enabled);
  updateButton(btn, enabled, sound.playing);
  setTimeout(() => updateButton(btn, enabled, sound.playing), 1200);

  // Do not let the global "first gesture starts music" handler fire before
  // this button decides whether to play or mute.
  btn.addEventListener("pointerdown", (event) => event.stopPropagation());
  btn.addEventListener("keydown", (event) => event.stopPropagation());

  btn.addEventListener("click", () => {
    if (!enabled) {
      enabled = true;
      sound.setEnabled(true);
      sound.ensurePlaying();
    } else if (!sound.playing) {
      // Autoplay was blocked or the track is paused: the first click starts
      // the music instead of muting it.
      sound.ensurePlaying();
    } else {
      enabled = false;
      sound.setEnabled(false);
    }
    try { localStorage.setItem("ak.audio.enabled", String(enabled)); } catch { /* private mode */ }
    updateButton(btn, enabled, sound.playing);
    setTimeout(() => updateButton(btn, enabled, sound.playing), 700);
  });

  // If music starts from a click elsewhere on the page, update the icon.
  document.addEventListener("pointerdown", () => {
    setTimeout(() => updateButton(btn, enabled, sound.playing), 900);
  }, { passive: true });

  document.body.appendChild(btn);
  return btn;
}

function readAudioPreference() {
  try { return localStorage.getItem("ak.audio.enabled") !== "false"; }
  catch { return true; }
}

function updateButton(btn, enabled, playing = false) {
  const active = enabled && playing;
  btn.textContent = !enabled ? "SOUND OFF" : active ? "SOUND ON" : "PLAY SOUND";
  btn.style.color = active ? "rgba(244,241,234,0.85)" : enabled ? "rgba(244,241,234,0.78)" : "rgba(244,241,234,0.45)";
  btn.style.borderColor = active ? "var(--rd)" : "rgba(244,241,234,0.32)";
  btn.setAttribute("aria-label", !enabled ? "Turn sound on" : active ? "Mute sound" : "Play soundtrack");
  btn.title = !enabled ? "Turn sound on" : active ? "Mute sound" : "Play soundtrack";
}

export default initAudioToggle;
