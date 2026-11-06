import { sound } from "./sound.js";

// Small fixed mute/unmute control in the bottom-right safe corner.

export function initAudioToggle() {
  let enabled = readAudioPreference();
  const btn = document.createElement("button");
  btn.id = "audio-toggle";
  btn.setAttribute("aria-label", "Mute audio");
  btn.title = "Mute audio";
  btn.textContent = "♪";
  btn.style.cssText = [
    "position:fixed",
    "bottom:max(20px, env(safe-area-inset-bottom))",
    "right:max(20px, env(safe-area-inset-right))",
    "z-index:50",
    "width:44px",
    "height:44px",
    "background:transparent",
    "border:1px solid rgba(244,241,234,0.15)",
    "color:rgba(244,241,234,0.5)",
    "cursor:pointer",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "font-size:14px",
    "font-family:var(--font-mono)",
    "letter-spacing:0.04em",
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
  btn.textContent = !enabled ? "✕" : active ? "♪" : "▶";
  btn.style.color = active ? "rgba(244,241,234,0.7)" : enabled ? "rgba(244,241,234,0.5)" : "rgba(244,241,234,0.18)";
  btn.setAttribute("aria-label", !enabled ? "Unmute audio" : active ? "Mute audio" : "Play music");
  btn.title = !enabled ? "Unmute audio" : active ? "Mute audio" : "Play music";
}

export default initAudioToggle;
