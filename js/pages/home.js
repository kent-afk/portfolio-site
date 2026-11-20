import { sound } from "../sound.js";

// HOME — Persona-style main menu. Skewed rows, a red selection wedge and a
// single white slab keep the game-menu feel while staying readable at every
// width. The visible nameplate is the identity anchor; the intro only gates
// the soundtrack.

const BG = "assets/file.webp";

const NAV_ITEMS = [
  { id: "projects", label: "PROJECTS", page: "projects", fontSize: 92, offsetX: 0, offsetY: 0, skewX: -8, skewY: 6 },
  { id: "resume", label: "RESUME", page: "resume", fontSize: 84, offsetX: 12, offsetY: 2, skewX: -10, skewY: 5 },
  { id: "about", label: "ABOUT ME", page: "about", fontSize: 74, offsetX: 22, offsetY: 6, skewX: -13, skewY: -8 },
];

const LINK_ITEMS = [
  { id: "github", label: "GITHUB", href: "https://github.com/kent-afk", fontSize: 52, offsetX: 8, offsetY: 4, skewX: -5, skewY: 4 },
  { id: "linkedin", label: "LINKEDIN", href: "https://www.linkedin.com/in/alexander-k-93a1353bb/", fontSize: 52, offsetX: 18, offsetY: 2, skewX: -9, skewY: -4 },
  { id: "email", label: "EMAIL", href: "mailto:a.korenchuk2026@outlook.com", fontSize: 52, offsetX: 12, offsetY: 3, skewX: -4, skewY: 6 },
];

export default function home(ctx) {
  const { root, navigate } = ctx;
  const items = [
    ...NAV_ITEMS.map((n) => ({ ...n, type: "nav" })),
    ...LINK_ITEMS.map((n) => ({ ...n, type: "link" })),
  ];

  const screen = document.createElement("main");
  screen.className = "screen home-screen";
  screen.style.backgroundImage = `url(${BG})`;
  screen.style.backgroundSize = "cover";
  screen.style.backgroundPosition = "center";
  screen.style.backgroundRepeat = "no-repeat";

  screen.innerHTML = `
    <div class="scanlines" aria-hidden="true"></div>
    <div class="home-nametag">
      <h1 class="home-nametag-name">ALEXANDER KORENCHUK</h1>
      <span class="home-nametag-role">BACKEND &amp; CLOUD ENGINEERING STUDENT</span>
      <a class="home-nametag-mail" href="mailto:a.korenchuk2026@outlook.com" data-hover="true">a.korenchuk2026@outlook.com</a>
    </div>
    <div class="home-hud-tr" aria-hidden="true">
      <span class="home-hud-item">SAINT PETERSBURG · RU</span>
      <span class="home-hud-item home-hud-available">AVAILABLE FOR INTERNSHIPS</span>
    </div>
  `;

  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";

  const nav = document.createElement("nav");
  nav.className = "menu-nav";
  nav.setAttribute("aria-label", "Main menu");

  const rows = [];

  function buildRow(item, index, isLink) {
    const a = document.createElement("a");
    a.href = isLink ? item.href : `#/${item.page}`;
    if (isLink) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    a.className = "menu-row" + (isLink ? " menu-row--link" : "");
    a.style.setProperty("--fs", item.fontSize + "px");
    a.style.marginRight = item.offsetX + "px";
    a.style.marginTop = item.offsetY + "px";
    a.style.transitionDelay = index * 40 + "ms";
    a.dataset.hover = "true";

    const glow = document.createElement("div");
    glow.className = "menu-glow" + (isLink ? " menu-glow--link" : "");

    const skew = document.createElement("div");
    skew.className = "menu-skew";
    skew.style.transform = `skewX(${item.skewX}deg) skewY(${item.skewY}deg)`;

    const tri = document.createElement("div");
    tri.className = "menu-tri" + (isLink ? " menu-tri--link" : "");
    tri.setAttribute("aria-hidden", "true");

    const hl = document.createElement("div");
    hl.className = "menu-highlight";
    hl.setAttribute("aria-hidden", "true");

    const wrap = document.createElement("div");
    wrap.className = "menu-label-wrap";

    const label = document.createElement("span");
    label.className = "menu-label menu-label-dark" + (isLink ? " menu-label--link" : "");
    label.textContent = item.label;

    wrap.appendChild(label);
    skew.appendChild(tri);
    skew.appendChild(hl);
    skew.appendChild(wrap);
    a.appendChild(glow);
    a.appendChild(skew);

    rows.push({ a, wrap, item, index, isLink });

    a.addEventListener("mouseenter", () => select(index));
    a.addEventListener("focus", () => select(index));
    a.addEventListener("click", (e) => {
      if (!isLink) {
        e.preventDefault();
        sound.play("confirm");
        navigate("/" + item.page);
      } else {
        sound.play("confirm");
      }
    });

    return a;
  }

  NAV_ITEMS.forEach((item, i) => nav.appendChild(buildRow(item, i, false)));

  const sep = document.createElement("div");
  sep.className = "menu-sep";
  sep.setAttribute("aria-hidden", "true");
  nav.appendChild(sep);

  LINK_ITEMS.forEach((item, i) => nav.appendChild(buildRow(item, NAV_ITEMS.length + i, true)));

  const stripe = document.createElement("div");
  stripe.className = "stripe-r";
  stripe.setAttribute("aria-hidden", "true");
  const stripe2 = document.createElement("div");
  stripe2.className = "stripe-r2";
  stripe2.setAttribute("aria-hidden", "true");

  overlay.appendChild(stripe);
  overlay.appendChild(stripe2);
  overlay.appendChild(nav);
  screen.appendChild(overlay);

  root.appendChild(screen);

  let index = 0;

  function apply() {
    rows.forEach((r) => {
      const isActive = r.index === index;
      const distance = Math.abs(r.index - index);
      const labelOpacity = isActive ? 1 : Math.max(r.isLink ? 0.72 : 0.86, 1 - distance * (r.isLink ? 0.14 : 0.16));

      r.a.classList.toggle("active", isActive);
      r.wrap.style.opacity = labelOpacity;
    });
  }

  function select(i) {
    if (i === index) return;
    sound.play("tick");
    index = i;
    apply();
  }

  function focusRow(i) {
    rows[i]?.a.focus({ preventScroll: true });
  }

  apply();

  function onKeydown(event) {
    const key = event.key;
    if (key !== "ArrowUp" && key !== "ArrowDown" && key !== "ArrowLeft" && key !== "ArrowRight") return;
    if (document.querySelector(".intro")) return;
    if (event.target.closest("input, textarea, select, [contenteditable='true']")) return;
    event.preventDefault();
    const dir = key === "ArrowUp" || key === "ArrowLeft" ? -1 : 1;
    const next = (index + dir + items.length) % items.length;
    select(next);
    focusRow(next);
  }
  document.addEventListener("keydown", onKeydown);

  const mountTimer = setTimeout(() => {
    rows.forEach((r) => r.a.classList.add("mounted"));
    sep.classList.add("mounted");
  }, 200);

  sound.soundtrackEnter();

  return () => {
    clearTimeout(mountTimer);
    document.removeEventListener("keydown", onKeydown);
  };
}
