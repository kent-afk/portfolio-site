import { sound } from "./sound.js";

// The entry gate is a native modal <dialog>: showModal() makes the page behind
// it inert and keeps focus inside. It also exists because browsers refuse
// audible autoplay in a fresh document; one real click/keypress here unlocks
// the soundtrack. The home page is already mounted behind the dialog.
export function initIntro() {
  const el = document.createElement("dialog");
  el.className = "intro";
  el.setAttribute("aria-labelledby", "intro-title");

  const note = sound.enabled
    ? `<i aria-hidden></i>SOUND ON · MUTE ANYTIME`
    : `<i aria-hidden></i>SOUND OFF · UNMUTE ANYTIME`;

  el.innerHTML = `
    <div class="intro__bg" aria-hidden="true"></div>
    <div class="intro__hud">
      <span>PORTFOLIO · 2026</span>
      <span>SAINT PETERSBURG · RU</span>
    </div>
    <div class="intro__center">
      <span class="intro__kicker">BACKEND · CLOUD · SOFTWARE</span>
      <h1 class="intro__name" id="intro-title">ALEXANDER<br><em>KORENCHUK</em></h1>
      <p class="intro__role">Backend &amp; Cloud Engineering Student</p>
      <button class="intro__enter" type="button" data-hover="true">
        <span class="intro__click">CLICK TO ENTER</span>
        <span class="intro__tap">TAP TO ENTER</span>
      </button>
      <p class="intro__note">${note}</p>
    </div>
    <div class="intro__foot">
      <span>BACKEND · CLOUD · SOFTWARE</span>
      <span>SOUND ON · MUTE ANYTIME</span>
    </div>`;

  document.body.appendChild(el);
  el.showModal();

  const button = el.querySelector(".intro__enter");
  let done = false;
  let removeTimer = 0;

  function enter() {
    if (done) return;
    done = true;
    // Must run in the gesture itself; a later call is blocked again.
    sound.ensurePlaying();
    el.classList.add("is-out");
    removeTimer = window.setTimeout(() => {
      el.close();
      el.remove();
    }, 520);
  }

  el.addEventListener("click", enter);
  // Esc / the mobile back gesture enters instead of leaving the visitor on a
  // blank page. Keep the dialog open until the fade finishes.
  el.addEventListener("cancel", (event) => {
    event.preventDefault();
    enter();
  });

  button.focus({ preventScroll: true });

  return () => {
    window.clearTimeout(removeTimer);
    if (el.open) el.close();
    el.remove();
  };
}
