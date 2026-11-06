import { sound } from "../sound.js";

// HOME — Persona-style skewed main menu with triangle selection highlight.

const BG = "assets/file.webp";

const NAV_ITEMS = [
  { id: "projects", label: "PROJECTS", page: "projects", fontSize: 92, offsetX: 0, offsetY: 0, skewX: -8, skewY: 6 },
  { id: "resume", label: "RESUME", page: "resume", fontSize: 84, offsetX: 12, offsetY: 2, skewX: -10, skewY: 5 },
  { id: "about", label: "ABOUT ME", page: "about", fontSize: 74, offsetX: 22, offsetY: 6, skewX: -13, skewY: -8 },
];

const LINK_ITEMS = [
  { id: "github", label: "GITHUB", href: "https://github.com/kent-afk", fontSize: 52, offsetX: 8, offsetY: 4, skewX: -5, skewY: 4 },
  { id: "linkedin", label: "LINKEDIN", href: "https://www.linkedin.com/in/alexander-k-93a1353bb/", fontSize: 52, offsetX: 18, offsetY: 2, skewX: -9, skewY: -4 },
  { id: "email", label: "EMAIL", href: "mailto:a.Korenchuk2026@outlook.com", fontSize: 52, offsetX: 12, offsetY: 3, skewX: -4, skewY: 6 },
];

function clip(o, c) {
  return `polygon(0px 0px, ${o}px ${c * 0.5}px, 0px ${c}px)`;
}

export default function home(ctx) {
  const { root, navigate } = ctx;
  const items = [
    ...NAV_ITEMS.map((n) => ({ ...n, type: "nav" })),
    ...LINK_ITEMS.map((n) => ({ ...n, type: "link" })),
  ];

  const screen = document.createElement("div");
  screen.className = "screen home-screen";
  screen.style.backgroundImage = `url(${BG})`;
  screen.style.backgroundSize = "cover";
  screen.style.backgroundPosition = "center";
  screen.style.backgroundRepeat = "no-repeat";

  screen.innerHTML = `
    <div class="scanlines" aria-hidden="true"></div>
    <div class="home-hud-tl" aria-hidden="true">
      <span class="home-hud-item">EDITION 01</span>
      <span class="home-hud-item">2026</span>
      <span class="home-hud-item home-hud-available">★ AVAILABLE</span>
    </div>
    <div class="home-hud-tr" aria-hidden="true">
      <span class="home-hud-item">SAINT PETERSBURG · RU</span>
      <span class="home-hud-item">BACKEND · CLOUD · SOFTWARE</span>
    </div>
  `;

  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";

  const ghost = document.createElement("div");
  ghost.className = "menu-ghost";
  ghost.setAttribute("aria-hidden", "true");

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
    a.style.marginRight = item.offsetX + "px";
    a.style.marginTop = item.offsetY + "px";
    a.style.transitionDelay = index * 75 + "ms";
    a.dataset.hover = "true";

    const glow = document.createElement("div");
    glow.className = "menu-glow" + (isLink ? " menu-glow--link" : "");

    const skew = document.createElement("div");
    skew.className = "menu-skew";
    skew.style.transform = `skewX(${item.skewX}deg) skewY(${item.skewY}deg)`;

    const o = item.label.length * item.fontSize * 0.56 + (isLink ? 60 : 80);
    const c = item.fontSize * 0.94;
    const shape = clip(o, c);

    const tri = document.createElement("div");
    tri.className = "menu-tri" + (isLink ? " menu-tri--link" : "");
    tri.style.width = o + "px";
    tri.style.height = c + "px";
    tri.style.clipPath = shape;

    const hl = document.createElement("div");
    hl.className = "menu-highlight";
    hl.style.width = o + "px";
    hl.style.height = c + "px";
    hl.style.clipPath = shape;

    const wrap = document.createElement("div");
    wrap.className = "menu-label-wrap";

    const labelDark = document.createElement("span");
    labelDark.className = "menu-label menu-label-dark" + (isLink ? " menu-label--link" : "");
    labelDark.style.fontSize = item.fontSize + "px";
    labelDark.textContent = item.label;

    const labelBright = document.createElement("span");
    labelBright.className = "menu-label menu-label-bright";
    labelBright.setAttribute("aria-hidden", "true");
    labelBright.style.fontSize = item.fontSize + "px";
    labelBright.style.clipPath = shape;
    labelBright.textContent = item.label;

    wrap.appendChild(labelDark);
    wrap.appendChild(labelBright);
    skew.appendChild(tri);
    skew.appendChild(hl);
    skew.appendChild(wrap);
    a.appendChild(glow);
    a.appendChild(skew);

    let badge = null;
    if (isLink) {
      badge = document.createElement("span");
      badge.className = "menu-ext-badge";
      badge.setAttribute("aria-hidden", "true");
      badge.textContent = "↗";
      badge.style.display = "none";
      a.appendChild(badge);
    }

    const refs = { a, tri, hl, wrap, badge, item, index, isLink };
    rows.push(refs);

    a.addEventListener("mouseenter", () => { select(index); focusRow(index); });
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

  overlay.appendChild(ghost);
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

  const version = document.createElement("div");
  version.className = "home-version";
  version.setAttribute("aria-hidden", "true");
  version.innerHTML = `<span>v1.1</span><span>PORTFOLIO</span>`;
  screen.appendChild(version);

  root.appendChild(screen);

  let index = 0;

  function apply() {
    const active = items[index];
    ghost.textContent = active.label;

    rows.forEach((r) => {
      const isActive = r.index === index;
      const w = Math.abs(r.index - index);
      const labelOpacity = isActive ? 1 : Math.max(r.isLink ? 0.32 : 0.42, 1 - w * (r.isLink ? 0.22 : 0.24));

      r.a.classList.toggle("active", isActive);
      if (isActive) r.a.setAttribute("aria-current", "page");
      else r.a.removeAttribute("aria-current");

      r.hl.style.transform = `translateY(-50%) scaleX(${isActive ? 1 : 0})`;
      r.wrap.style.opacity = labelOpacity;

      if (isActive) {
        r.tri.classList.remove("pop");
        void r.tri.offsetWidth; // force reflow so the pop animation restarts
        r.tri.classList.add("pop");
      } else {
        r.tri.classList.remove("pop");
      }
      if (r.badge) r.badge.style.display = isActive ? "" : "none";
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
  }, 900);

  sound.soundtrackEnter();

  return () => {
    clearTimeout(mountTimer);
    document.removeEventListener("keydown", onKeydown);
  };
}
