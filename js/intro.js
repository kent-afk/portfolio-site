import { sound } from "./sound.js";

// The entry gate exists because browsers refuse audible autoplay in a fresh
// document. One real click/keypress here unlocks the soundtrack; the home page
// is already mounted behind the overlay.
export function initIntro() {
  const el = document.createElement("div");
  el.className = "intro";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", "Enter the portfolio");

  const note = sound.enabled
    ? `<i aria-hidden></i>SOUND ON · BEST WITH HEADPHONES`
    : `<i aria-hidden></i>SOUND OFF · UNMUTE AFTER ENTER`;

  el.innerHTML = `
    <div class="intro__bg" aria-hidden="true"></div>
    <div class="intro__hud">
      <span>EDITION 01 · 2026</span>
      <span>SAINT PETERSBURG · RU</span>
    </div>
    <div class="intro__center">
      <span class="intro__kicker">BACKEND · CLOUD · SOFTWARE</span>
      <h1 class="intro__name">ALEXANDER<br><em>KORENCHUK</em></h1>
      <p class="intro__role">Backend &amp; Cloud Engineer</p>
      <button class="intro__enter" type="button" data-hover="true">
        <span class="intro__click">CLICK TO ENTER</span>
        <span class="intro__tap">TAP TO ENTER</span>
        <span aria-hidden="true">↗</span>
      </button>
      <p class="intro__note">${note}</p>
    </div>
    <div class="intro__foot">
      <span>PERSONA-STYLE PORTFOLIO</span>
      <span>SOUND ON ENTRY</span>
    </div>`;

  document.body.appendChild(el);

  const button = el.querySelector(".intro__enter");
  let done = false;
  let removeTimer = 0;

  function enter() {
    if (done) return;
    done = true;
    // Must run in the gesture itself; a later call is blocked again.
    sound.ensurePlaying();
    el.classList.add("is-out");
    removeTimer = window.setTimeout(() => el.remove(), 520);
  }

  el.addEventListener("click", enter);
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
      event.preventDefault();
      enter();
    }
  });

  // The dialog is the only thing on screen; keep the keyboard path obvious.
  requestAnimationFrame(() => button.focus({ preventScroll: true }));

  return () => {
    window.clearTimeout(removeTimer);
    el.remove();
  };
}
