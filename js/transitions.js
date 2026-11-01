// Screen transition wipes. Four variants mirror the reference:
//   home     → three horizontal bars wiping left→right→out
//   slash    → diagonal slashes sweeping across
//   about    → rotated bars sliding in from the left
//   vertical → skewed vertical columns dropping through
// Implemented with the Web Animations API (no framer-motion dependency).

const VARIANTS = {
  home: {
    cls: "trans-default",
    layers: ["#080806", "#FF5500", "#F4F1EA"],
    delayStep: 0.05,
    duration: 440,
    keyframes: [
      { transform: "scaleX(0)", offset: 0 },
      { transform: "scaleX(1)", offset: 0.4 },
      { transform: "scaleX(1)", offset: 0.6 },
      { transform: "scaleX(0)", offset: 1 },
    ],
    easing: "cubic-bezier(.76,0,.24,1)",
  },
  slash: {
    cls: "trans-slash",
    layers: ["#FF5500", "#FF7A22", "#F4F1EA"],
    delayStep: 0.04,
    duration: 550,
    keyframes: [
      { transform: "translateX(-110%)", offset: 0 },
      { transform: "translateX(0%)", offset: 0.42 },
      { transform: "translateX(0%)", offset: 0.58 },
      { transform: "translateX(110%)", offset: 1 },
    ],
    easing: "cubic-bezier(.76,0,.24,1)",
  },
  about: {
    cls: "trans-about",
    layers: [
      { color: "#0B0B09", top: "-18vh", left: "-16vw", width: "90vw" },
      { color: "#FF5500", top: "28vh", left: "-10vw", width: "74vw" },
      { color: "#F4F1EA", top: "66vh", left: "-14vw", width: "84vw" },
    ],
    delayStep: 0.05,
    duration: 500,
    keyframes: [
      { transform: "translateX(-600px)", opacity: 1, offset: 0 },
      { transform: "translateX(24px)", opacity: 1, offset: 0.68 },
      { transform: "translateX(0px)", opacity: 0, offset: 1 },
    ],
    easing: "cubic-bezier(.22,1,.36,1)",
  },
  vertical: {
    cls: "trans-vert",
    layers: [
      { color: "#080806", left: "68vw", width: "28vw" },
      { color: "#FF5500", left: "78vw", width: "16vw" },
      { color: "#F4F1EA", left: "88vw", width: "8vw" },
    ],
    delayStep: 0.06,
    duration: 580,
    keyframes: [
      { transform: "translateY(-1400px)", offset: 0 },
      { transform: "translateY(0px)", offset: 0.4 },
      { transform: "translateY(0px)", offset: 0.6 },
      { transform: "translateY(1400px)", offset: 1 },
    ],
    easing: "cubic-bezier(.76,0,.24,1)",
  },
};

let overlay = null;
function getOverlay() {
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "trans-overlay";
    overlay.style.cssText = "position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:9000;";
    document.body.appendChild(overlay);
  }
  return overlay;
}

/**
 * Play a transition wipe.
 * @param {"home"|"slash"|"about"|"vertical"} variant
 * @returns {Promise<void>} resolves when the wipe has finished
 */
export function playTransition(variant = "home") {
  const spec = VARIANTS[variant] || VARIANTS.home;
  const host = getOverlay();
  host.innerHTML = "";
  const anims = [];

  spec.layers.forEach((layer, i) => {
    const el = document.createElement("div");
    el.className = spec.cls;
    if (typeof layer === "string") {
      el.style.background = layer;
    } else {
      el.style.background = layer.color;
      if (layer.top) el.style.top = layer.top;
      if (layer.left) el.style.left = layer.left;
      if (layer.width) el.style.width = layer.width;
    }
    el.style.zIndex = String(999 - i);
    host.appendChild(el);
    anims.push(
      el.animate(spec.keyframes, {
        duration: spec.duration,
        delay: i * spec.delayStep * 1000,
        easing: spec.easing,
        fill: "both",
      })
    );
  });

  return Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(() => {
    host.innerHTML = "";
  });
}

export default playTransition;
