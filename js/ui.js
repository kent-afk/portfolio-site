import { sound } from "./sound.js";

// Small shared UI helpers used by the detail pages.

export function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

/**
 * Back button (mirrors the reference `sys-back` component).
 * @param {object} opts
 * @param {string} opts.to       route to navigate to
 * @param {string} [opts.label]  visible label (default PROJECTS)
 * @param {boolean} [opts.fixed] fixed positioning (default true)
 * @param {object} [opts.navigate]
 * @param {string} [opts.accentColor]
 * @param {string} [opts.bg]
 * @param {string} [opts.color]
 */
export function backButton(opts) {
  const { to = "/projects", label = "PROJECTS", fixed = true, navigate, accentColor, bg, color } = opts;
  const btn = document.createElement("button");
  btn.className = `sys-back${fixed ? " sys-back--fixed" : " sys-back--inline"}`;
  btn.dataset.hover = "true";
  btn.setAttribute("aria-label", `Back to ${label.toLowerCase()}`);
  if (accentColor) btn.style.setProperty("--sys-back-accent", accentColor);
  if (bg) btn.style.setProperty("--sys-back-bg", bg);
  if (color) btn.style.setProperty("--sys-back-color", color);
  btn.innerHTML = `<span class="sys-back__arrow" aria-hidden="true">◄</span><span class="sys-back__label">${label}</span>`;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    sound.play("back");
    navigate(to);
  });
  return btn;
}

// Deterministic-ish random helpers used by the generative pages.
export const rand = (min, max) => Math.random() * (max - min) + min;
