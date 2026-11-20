import { sound } from "../sound.js";
import { esc, parseDeck, safeUrl } from "../ui.js";

// PROJECTS — a read-only index published from data/projects.json.
// The deck is data-driven; there is no editor and no browser storage.
// Persona chrome: red rules, condensed titles, a hard-edged card grid.

const STORE_KEY = "ak.projects.v1"; // legacy localStorage deck from an earlier build
const DATA_URL = "data/projects.json";
const GH_USER = "kent-afk";
const GH_URL = `https://github.com/${GH_USER}`;
const EMAIL = "a.korenchuk2026@outlook.com";
const RESUME_ROUTE = "#/resume";
const ABOUT_ROUTE = "#/about";

export default function projects(ctx) {
  const { root, navigate } = ctx;

  try { localStorage.removeItem(STORE_KEY); } catch { /* private mode */ }

  let projects = [];
  let dead = false;

  const el = document.createElement("div");
  el.className = "ps-root";

  /* ---------- top bar ---------- */
  const head = document.createElement("header");
  head.className = "ps-head";

  const backBtn = document.createElement("button");
  backBtn.className = "ps-back";
  backBtn.type = "button";
  backBtn.dataset.hover = "true";
  backBtn.textContent = "HOME";
  backBtn.addEventListener("click", () => {
    sound.play("back");
    navigate("/");
  });

  const headC = document.createElement("div");
  headC.className = "ps-head-c";
  headC.innerHTML = `
    <span class="ps-head-lbl">PROJECTS</span>
    <span class="ps-head-sub">BACKEND · CLOUD · SOFTWARE ENGINEERING</span>`;

  const headActions = document.createElement("div");
  headActions.className = "ps-head-actions";
  headActions.innerHTML = `
    <a class="ps-head-act" href="${RESUME_ROUTE}" data-hover="true">RESUME</a>`;

  head.appendChild(backBtn);
  head.appendChild(headC);
  head.appendChild(headActions);

  /* ---------- scroll body ---------- */
  const scroll = document.createElement("main");
  scroll.className = "ps-scroll";

  const section = document.createElement("section");
  section.className = "ps-sec";
  section.innerHTML = `
    <div class="ps-sec-h">
      <span class="bar"></span>
      <h1>PROJECTS</h1>
      <span class="ps-sec-rule"></span>
    </div>
    <div class="ps-tools">
      <span class="ps-store"><span class="ps-store-dot"></span><span class="ps-store-txt">PROJECTS · 2026</span></span>
    </div>
    <div class="ps-load" hidden>
      <span class="ps-load-num" aria-hidden="true">··</span>
      <span class="ps-empty-kicker">PROJECT INDEX</span>
      <h2 class="ps-empty-title">LOADING <em>PROJECTS</em></h2>
      <p class="ps-empty-copy">Fetching the project list…</p>
    </div>
    <div class="ps-err" hidden>
      <span class="ps-empty-kicker">LOAD FAILED</span>
      <h2 class="ps-empty-title">PROJECTS <em>OFFLINE</em></h2>
      <p class="ps-empty-copy">The project list could not be loaded. Check your connection and try again.</p>
      <div class="ps-empty-actions">
        <button class="ps-btn ps-btn--primary" type="button" data-act="retry" data-hover="true">RETRY</button>
        <a class="ps-btn ps-btn--ghost" href="${GH_URL}" target="_blank" rel="noopener noreferrer" data-hover="true">GITHUB</a>
      </div>
    </div>
    <div class="ps-zone ps-zone--feat" hidden>
      <div class="ps-sub-h"><span>SELECTED</span><span class="ps-sec-rule"></span></div>
      <div class="ps-grid ps-grid--feat"></div>
    </div>
    <div class="ps-zone ps-zone--all" hidden>
      <div class="ps-sub-h"><span class="ps-all-title">OTHER PROJECTS</span><span class="ps-sec-rule"></span></div>
      <div class="ps-grid ps-grid--repo"></div>
    </div>
    <div class="ps-empty" hidden>
      <span class="ps-empty-num" aria-hidden="true">00</span>
      <span class="ps-empty-kicker">PROJECT INDEX</span>
      <h2 class="ps-empty-title">NO <em>PROJECTS</em> YET</h2>
      <p class="ps-empty-copy">The project index is empty right now. New work is published from the repository.</p>
      <div class="ps-empty-actions">
        <a class="ps-btn ps-btn--primary" href="${GH_URL}" target="_blank" rel="noopener noreferrer" data-hover="true">GITHUB</a>
      </div>
    </div>`;

  const foot = document.createElement("div");
  foot.className = "ps-foot";
  foot.innerHTML = `
    <span>ALEXANDER KORENCHUK</span>
    <span class="ps-foot-sep">◆</span>
    <span>ITMO UNIVERSITY · SOFTWARE ENGINEERING</span>
    <span class="ps-foot-sep">◆</span>
    <a href="mailto:a.korenchuk2026@outlook.com" data-hover="true">EMAIL</a>
    <span class="ps-foot-sep">◆</span>
    <a href="${RESUME_ROUTE}" data-hover="true">RESUME</a>
    <span class="ps-foot-sep">◆</span>
    <a href="${ABOUT_ROUTE}" data-hover="true">ABOUT</a>
    <span class="ps-foot-sep">◆</span>
    <a href="${GH_URL}" target="_blank" rel="noopener noreferrer" data-hover="true">GITHUB</a>`;

  scroll.appendChild(section);
  scroll.appendChild(foot);

  const status = document.createElement("div");
  status.className = "ps-st";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.innerHTML = `<span class="ps-std"></span><span class="ps-st-txt">LOADING PROJECTS…</span>`;

  el.appendChild(head);
  el.appendChild(scroll);
  el.appendChild(status);
  root.appendChild(el);

  const gridFeat = section.querySelector(".ps-zone--feat .ps-grid");
  const gridAll = section.querySelector(".ps-zone--all .ps-grid");
  const zoneFeat = section.querySelector(".ps-zone--feat");
  const zoneAll = section.querySelector(".ps-zone--all");
  const emptyEl = section.querySelector(".ps-empty");
  const loadEl = section.querySelector(".ps-load");
  const errEl = section.querySelector(".ps-err");
  const storeTxt = section.querySelector(".ps-store-txt");
  const statusTxt = status.querySelector(".ps-st-txt");

  /* ------------------------------- cards ------------------------------- */

  function buildCard(project) {
    const lang = project.lang || "Project";
    const desc = project.desc ? esc(project.desc) : "No description yet.";
    const tags = project.tags.map((t) => esc(t)).join(" / ");
    const live = safeUrl(project.url);
    const repo = project.private ? "" : safeUrl(project.repo);
    const primary = live || repo;
    const request = project.private && !primary
      ? `mailto:${EMAIL}?subject=${encodeURIComponent("Project: " + project.title)}`
      : "";
    const openLink = primary || request;
    const image = safeUrl(project.image, { image: true });
    const imageSmall = /^assets\/projects\/[^/]+\.webp$/i.test(image)
      ? image.replace(/\.webp$/i, "-880.webp")
      : "";
    const period = project.period ? `<span class="ps-card-period">${esc(project.period)}</span>` : "";
    const title = primary
      ? `<a class="ps-card-link" href="${esc(primary)}" target="_blank" rel="noopener noreferrer" data-hover="true">${esc(project.title)}</a>`
      : esc(project.title);
    const thumb = image
      ? `<span class="ps-card-thumb"><img src="${esc(image)}"${imageSmall ? ` srcset="${esc(imageSmall)} 880w, ${esc(image)} 1400w" sizes="(min-width:1200px) 440px, (min-width:821px) 32vw, calc(100vw - 40px)"` : ""} alt="" width="1400" height="604" decoding="async"${project.featured ? "" : ' loading="lazy"'}><span class="ps-card-concept">CONCEPT</span></span>`
      : "";
    const stretch = openLink
      ? `<a class="ps-card-stretch" href="${esc(openLink)}"${/^https?:/i.test(openLink) ? ' target="_blank" rel="noopener noreferrer"' : ""} aria-hidden="true" tabindex="-1" data-act="open" data-hover="true"></a>`
      : "";

    const card = document.createElement("article");
    card.className = "ps-card" + (project.featured ? " ps-card--feat" : "");
    card.dataset.id = project.id;
    card.innerHTML = `
      ${thumb}
      ${stretch}
      <div class="ps-card-top">
        <span class="ps-card-lang">${esc(lang)}</span>
        ${period}
      </div>
      <h3 class="ps-card-title">${title}</h3>
      <p class="ps-card-desc">${desc}</p>
      ${tags ? `<p class="ps-card-stack">${tags}</p>` : ""}
      <div class="ps-card-meta">
        <div class="ps-card-actions">
          ${request ? `<a class="ps-card-request" href="${esc(request)}" data-act="open" data-hover="true">REQUEST</a>` : ""}
          ${live ? `<a class="ps-card-open" href="${esc(live)}" target="_blank" rel="noopener noreferrer" data-act="open" data-hover="true">LIVE</a>` : ""}
          ${repo && repo !== live ? `<a class="ps-card-repo" href="${esc(repo)}" target="_blank" rel="noopener noreferrer" data-act="open" data-hover="true">REPO</a>` : ""}
        </div>
      </div>`;

    const img = card.querySelector(".ps-card-thumb img");
    if (img) img.addEventListener("error", () => img.closest(".ps-card-thumb")?.remove());
    return card;
  }

  function render() {
    const featured = projects.filter((p) => p.featured);
    const rest = projects.filter((p) => !p.featured);

    zoneFeat.hidden = featured.length === 0;
    zoneAll.hidden = rest.length === 0;
    emptyEl.hidden = projects.length !== 0;
    loadEl.hidden = true;
    errEl.hidden = true;

    gridFeat.innerHTML = "";
    gridAll.innerHTML = "";

    featured.forEach((project) => {
      gridFeat.appendChild(buildCard(project));
    });
    rest.forEach((project) => {
      gridAll.appendChild(buildCard(project));
    });

    storeTxt.textContent = `${String(projects.length).padStart(2, "0")} PROJECTS · 2026`;
    statusTxt.textContent = projects.length
      ? `${projects.length} projects loaded.`
      : "No projects loaded.";
  }

  /* ------------------------------- loading ------------------------------ */

  async function load() {
    loadEl.hidden = false;
    emptyEl.hidden = true;
    errEl.hidden = true;
    zoneFeat.hidden = true;
    zoneAll.hidden = true;
    statusTxt.textContent = "Loading projects…";

    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.text();
      projects = parseDeck(raw);
      if (dead) return;
      render();
    } catch {
      if (dead) return;
      loadEl.hidden = true;
      emptyEl.hidden = true;
      errEl.hidden = false;
      statusTxt.textContent = "Projects could not be loaded.";
    }
  }

  section.addEventListener("click", (event) => {
    const retry = event.target.closest('[data-act="retry"]');
    if (retry) {
      sound.play("confirm");
      load();
      return;
    }
    const openAct = event.target.closest('[data-act="open"]');
    if (openAct) sound.play("confirm");
  });

  /* ------------------------------- boot -------------------------------- */

  function onKeydown(event) {
    if (event.key !== "Escape") return;
    if (document.querySelector(".intro")) return;
    event.preventDefault();
    sound.play("back");
    navigate("/");
  }

  document.addEventListener("keydown", onKeydown);

  load();
  sound.soundtrackEnter();

  return () => {
    dead = true;
    document.removeEventListener("keydown", onKeydown);
  };
}
