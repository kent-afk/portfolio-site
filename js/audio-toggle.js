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
  updateButton(btn, enabled);

  btn.addEventListener("click", () => {
    enabled = !enabled;
    sound.setEnabled(enabled);
    try { localStorage.setItem("ak.audio.enabled", String(enabled)); } catch { /* private mode */ }
    updateButton(btn, enabled);
  });

  document.body.appendChild(btn);
  return btn;
}

function readAudioPreference() {
  try { return localStorage.getItem("ak.audio.enabled") !== "false"; }
  catch { return true; }
}

function updateButton(btn, enabled) {
  btn.textContent = enabled ? "♪" : "✕";
  btn.style.color = enabled ? "rgba(244,241,234,0.5)" : "rgba(244,241,234,0.18)";
  btn.setAttribute("aria-label", enabled ? "Mute audio" : "Unmute audio");
  btn.title = enabled ? "Mute audio" : "Unmute audio";
}

export default initAudioToggle;
