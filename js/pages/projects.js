import { sound } from "../sound.js";

// PROJECTS — a read-only project deck published from the repository.
// The deck is driven entirely by `data/projects.json`: the page fetches that
// file and renders the cards. There is no editor, no localStorage and no
// import/export — projects are added by editing the JSON in the repo and
// committing it. Layout model borrowed from Persona_style_portfolio
// (featured cards above an archive grid), rebuilt with the Persona 5 chrome.

const STORE_KEY = "ak.projects.v1"; // legacy localStorage deck from an earlier build
const DATA_URL = "data/projects.json";
const GH_USER = "kent-afk";
const GH_REPO = "portfolio-site";
const GH_URL = `https://github.com/${GH_USER}`;
const GH_DATA = `https://github.com/${GH_USER}/${GH_REPO}/blob/main/${DATA_URL}`;
const RESUME_ROUTE = "#/resume";

const LANG_COLORS = {
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  Python: "#3572A5",
  Lua: "#000080",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "Jupyter Notebook": "#DA5B0B",
  SQL: "#e38c00",
  Go: "#00ADD8",
  Rust: "#dea584",
};

/* ------------------------------- helpers ------------------------------- */

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function safeUrl(value, { image = false } = {}) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  if (image && /^data:image\//i.test(raw)) return raw;
  if (/^(https?:\/\/|mailto:)/i.test(raw)) return raw;
  if (/^#\//.test(raw)) return raw;
  if (/^(\/|\.{1,2}\/|assets\/)/.test(raw)) return raw;
  if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(raw)) return `https://${raw}`;
  return "";
}

function splitTitle(title) {
  const first = String(title).trim().split(/\s+/)[0] || "";
  return `<em>${esc(first)}</em>${esc(String(title).slice(first.length))}`;
}

function normalizeProject(raw, index) {
  const p = raw && typeof raw === "object" ? raw : {};
  const tags = Array.isArray(p.tags)
    ? p.tags
    : String(p.tags || "").split(",");
  return {
    id: String(p.id || `p-${index}`),
    title: String(p.title || "").trim(),
    desc: String(p.desc || p.description || "").trim(),
    lang: String(p.lang || p.language || "").trim(),
    period: String(p.period || "").trim(),
    url: String(p.url || "").trim(),
    repo: String(p.repo || "").trim(),
    image: String(p.image || "").trim(),
    tags: tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 10),
    featured: Boolean(p.featured),
  };
}

function parseDeck(raw) {
  const parsed = JSON.parse(raw);
  const list = Array.isArray(parsed) ? parsed : parsed && parsed.projects;
  if (!Array.isArray(list)) throw new Error("invalid shape");
  return list
    .map(normalizeProject)
    .filter((p) => p.title);
}

/* -------------------------------- page -------------------------------- */

export default function projects(ctx) {
  const { root, navigate } = ctx;

  // The legacy deck (from the localStorage build) is no longer used.
  try { localStorage.removeItem(STORE_KEY); } catch { /* private mode */ }

  let projects = [];
  let cards = [];
  let index = 0;
  let selectedId = null;
  let dead = false;
  let state = "loading"; // loading | ready | error

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
    <span class="ps-head-lbl">★ PROJECTS</span>
    <span class="ps-head-sub">BACKEND · CLOUD · SOFTWARE ENGINEERING</span>
    <div class="ps-prog"><div class="ps-prog-f"></div></div>`;

  const headActions = document.createElement("div");
  headActions.className = "ps-head-actions";
  headActions.innerHTML = `
    <a class="ps-head-act" href="${RESUME_ROUTE}" data-hover="true">RESUME</a>
    <a class="ps-head-act" href="${GH_URL}" target="_blank" rel="noopener noreferrer" data-hover="true">GITHUB ↗</a>`;

  const idxEl = document.createElement("span");
  idxEl.className = "ps-idx";

  head.appendChild(backBtn);
  head.appendChild(headC);
  head.appendChild(headActions);
  head.appendChild(idxEl);

  /* ---------- scroll body ---------- */
  const scroll = document.createElement("div");
  scroll.className = "ps-scroll";

  const section = document.createElement("section");
  section.className = "ps-sec";
  section.innerHTML = `
    <div class="ps-sec-h">
      <span class="bar"></span>
      <span>MY PROJECTS</span>
      <span class="ps-sec-rule"></span>
      <span class="ps-sec-n">00</span>
    </div>
    <div class="ps-tools">
      <span class="ps-store"><span class="ps-store-dot"></span>DECK · SYNCED FROM REPOSITORY</span>
      <div class="ps-tool-actions">
        <a class="ps-btn ps-btn--ghost" href="${GH_DATA}" target="_blank" rel="noopener noreferrer" data-hover="true">DATA FILE ↗</a>
        <a class="ps-btn ps-btn--ghost" href="${GH_URL}" target="_blank" rel="noopener noreferrer" data-hover="true">@${GH_USER} ↗</a>
      </div>
    </div>
    <div class="ps-load" hidden>
      <span class="ps-load-num" aria-hidden="true">··</span>
      <span class="ps-empty-kicker">PERSONAL PROJECT DECK</span>
      <h2 class="ps-empty-title">SYNCING <em>DECK</em></h2>
      <p class="ps-empty-copy">Loading projects from data/projects.json…</p>
    </div>
    <div class="ps-err" hidden>
      <span class="ps-empty-kicker">SYNC FAILED</span>
      <h2 class="ps-empty-title">DECK <em>OFFLINE</em></h2>
      <p class="ps-empty-copy">The deck could not be loaded from data/projects.json. The file may be unreachable or contain invalid JSON — open it in the repository and check the syntax, then try again.</p>
      <div class="ps-empty-actions">
        <button class="ps-btn ps-btn--primary" type="button" data-act="retry" data-hover="true">↻ RETRY</button>
        <a class="ps-btn ps-btn--ghost" href="${GH_DATA}" target="_blank" rel="noopener noreferrer" data-hover="true">OPEN DATA FILE ↗</a>
      </div>
    </div>
    <div class="ps-zone ps-zone--feat" hidden>
      <div class="ps-sub-h"><span>★ FEATURED</span><span class="ps-sec-rule"></span><span class="ps-sec-n ps-count-feat">00</span></div>
      <div class="ps-grid ps-grid--feat"></div>
    </div>
    <div class="ps-zone ps-zone--all" hidden>
      <div class="ps-sub-h"><span class="ps-all-title">ALL PROJECTS</span><span class="ps-sec-rule"></span><span class="ps-sec-n ps-count-all">00</span></div>
      <div class="ps-grid ps-grid--repo"></div>
    </div>
    <div class="ps-empty" hidden>
      <span class="ps-empty-num" aria-hidden="true">00</span>
      <span class="ps-empty-kicker">PERSONAL PROJECT DECK</span>
      <h2 class="ps-empty-title">YOUR DECK IS <em>EMPTY</em></h2>
      <p class="ps-empty-copy">Projects are published from the repository: add an entry to <a href="${GH_DATA}" target="_blank" rel="noopener noreferrer">data/projects.json</a>, commit and push. The deck rebuilds itself on every visit — no editing happens in the browser.</p>
      <div class="ps-empty-actions">
        <a class="ps-btn ps-btn--primary" href="${GH_DATA}" target="_blank" rel="noopener noreferrer" data-hover="true">OPEN DATA FILE ↗</a>
        <a class="ps-btn ps-btn--ghost" href="${GH_URL}" target="_blank" rel="noopener noreferrer" data-hover="true">@${GH_USER} ↗</a>
      </div>
    </div>`;

  const foot = document.createElement("div");
  foot.className = "ps-foot";
  foot.innerHTML = `
    <span>ALEXANDER KORENCHUK</span>
    <span class="ps-foot-sep">◆</span>
    <span>ITMO UNIVERSITY · SOFTWARE ENGINEERING</span>
    <span class="ps-foot-sep">◆</span>
    <a href="${RESUME_ROUTE}" data-hover="true">RESUME</a>
    <span class="ps-foot-sep">◆</span>
    <a href="${GH_URL}" target="_blank" rel="noopener noreferrer" data-hover="true">GITHUB.COM/${GH_USER.toUpperCase()}</a>`;

  scroll.appendChild(section);
  scroll.appendChild(foot);

  const status = document.createElement("div");
  status.className = "ps-st";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.innerHTML = `<span class="ps-std"></span><span class="ps-st-txt">SYNCING DECK…</span>`;

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
  const countEl = section.querySelector(".ps-sec-n");
  const countFeatEl = section.querySelector(".ps-count-feat");
  const countAllEl = section.querySelector(".ps-count-all");
  const allTitleEl = section.querySelector(".ps-all-title");
  const progFill = head.querySelector(".ps-prog-f");
  const statusTxt = status.querySelector(".ps-st-txt");

  /* ------------------------------- cards ------------------------------- */

  function buildCard(project, seq) {
    const lang = project.lang || "Project";
    const color = LANG_COLORS[project.lang] || "#FF5500";
    const desc = project.desc
      ? esc(project.desc)
      : "No description yet.";
    const tags = project.tags.map((t) => `<span>${esc(t)}</span>`).join("");
    const live = safeUrl(project.url);
    const repo = safeUrl(project.repo);
    const openLink = live || repo;
    const image = safeUrl(project.image, { image: true });
    const period = project.period ? `<span class="ps-card-period">${esc(project.period)}</span>` : "";

    const card = document.createElement("article");
    card.className = "ps-card" + (project.featured ? " ps-card--feat" : "");
    card.dataset.id = project.id;
    card.setAttribute("role", "group");
    card.setAttribute("aria-label", project.title);
    card.style.setProperty("--tilt", ((hash(project.title) % 5) - 2) * 0.7 + "deg");
    card.style.setProperty("--lc", color);
    card.innerHTML = `
      ${image ? `<span class="ps-card-thumb"><img src="${esc(image)}" alt="" loading="lazy"></span>` : ""}
      <span class="ps-card-num">${seq}</span>
      <span class="ps-card-lang">${esc(lang)}</span>
      <h3 class="ps-card-title">${splitTitle(project.title)}</h3>
      ${period}
      <p class="ps-card-desc">${desc}</p>
      ${tags ? `<div class="ps-card-tags">${tags}</div>` : ""}
      <div class="ps-card-meta">
        <span class="ps-card-flag">${project.featured ? "★ FEATURED" : `PROJECT ${seq}`}</span>
        <div class="ps-card-actions">
          ${openLink ? `<a class="ps-card-open" href="${esc(openLink)}" target="_blank" rel="noopener noreferrer" data-act="open" data-hover="true">OPEN ↗</a>` : ""}
          ${repo && repo !== openLink ? `<a class="ps-card-repo" href="${esc(repo)}" target="_blank" rel="noopener noreferrer" data-act="open" data-hover="true">REPO ↗</a>` : ""}
        </div>
      </div>`;

    const img = card.querySelector(".ps-card-thumb img");
    if (img) {
      img.addEventListener("error", () => img.closest(".ps-card-thumb")?.remove());
    }
    return card;
  }

  function render(selectId = selectedId) {
    cards = [];
    selectedId = selectId || null;

    const featured = projects.filter((p) => p.featured);
    const rest = projects.filter((p) => !p.featured);

    zoneFeat.hidden = featured.length === 0;
    zoneAll.hidden = rest.length === 0;
    emptyEl.hidden = projects.length !== 0;
    loadEl.hidden = true;
    errEl.hidden = true;

    gridFeat.innerHTML = "";
    gridAll.innerHTML = "";

    featured.forEach((project, i) => {
      const card = buildCard(project, String(i + 1).padStart(2, "0"));
      card.style.setProperty("--d", i * 60 + "ms");
      gridFeat.appendChild(card);
    });

    rest.forEach((project, i) => {
      const card = buildCard(project, String(i + 1).padStart(2, "0"));
      card.style.setProperty("--d", (i + featured.length) * 60 + "ms");
      gridAll.appendChild(card);
    });

    cards = [...gridFeat.children, ...gridAll.children].map((node) => {
      const project = projects.find((p) => p.id === node.dataset.id);
      return { el: node, project };
    });

    allTitleEl.textContent = featured.length ? "PROJECT ARCHIVE" : "ALL PROJECTS";
    countEl.textContent = String(projects.length).padStart(2, "0");
    countFeatEl.textContent = String(featured.length).padStart(2, "0");
    countAllEl.textContent = String(rest.length).padStart(2, "0");

    if (!projects.length) {
      index = 0;
      selectedId = null;
      applySelection();
      return;
    }

    let nextIndex = cards.findIndex((c) => c.project.id === selectedId);
    if (nextIndex < 0) nextIndex = 0;
    index = nextIndex;
    selectedId = cards[index].project.id;
    applySelection();
    revealCards();
  }

  function revealCards() {
    requestAnimationFrame(() => {
      cards.forEach((c) => c.el.classList.add("ps-in"));
    });
  }

  function select(i) {
    if (!cards.length || i < 0 || i >= cards.length) return;
    if (i === index) return;
    sound.play("tick");
    index = i;
    selectedId = cards[i].project.id;
    applySelection();
  }

  function applySelection() {
    const total = String(projects.length).padStart(2, "0");
    const hasCards = cards.length > 0;

    cards.forEach((c, i) => {
      const isActive = hasCards && i === index;
      c.el.classList.toggle("ps-sel", isActive);
      if (isActive) c.el.setAttribute("aria-current", "true");
      else c.el.removeAttribute("aria-current");
    });

    if (!hasCards) {
      progFill.style.width = "0%";
      idxEl.innerHTML = `00<em>/</em>00`;
      statusTxt.textContent =
        state === "error" ? "SYNC ERROR — CHECK DATA FILE"
        : projects.length ? "SYNCED · 00 PROJECTS"
        : "EMPTY DECK · EDIT data/projects.json";
      return;
    }

    progFill.style.width = `${((index + 1) / cards.length) * 100}%`;
    idxEl.innerHTML = `${String(index + 1).padStart(2, "0")}<em>/</em>${total}`;
    statusTxt.textContent = "SYNCED · " + cards[index].project.title.toUpperCase();
  }

  /* ------------------------------- loading ------------------------------ */

  async function load() {
    state = "loading";
    loadEl.hidden = false;
    emptyEl.hidden = true;
    errEl.hidden = true;
    zoneFeat.hidden = true;
    zoneAll.hidden = true;
    countEl.textContent = "00";
    statusTxt.textContent = "SYNCING DECK…";

    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.text();
      projects = parseDeck(raw);
      state = "ready";
      if (dead) return;
      render();
    } catch {
      state = "error";
      if (dead) return;
      loadEl.hidden = true;
      emptyEl.hidden = true;
      errEl.hidden = false;
      statusTxt.textContent = "SYNC ERROR — CHECK DATA FILE";
      progFill.style.width = "0%";
      idxEl.innerHTML = `00<em>/</em>00`;
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
    if (openAct) {
      sound.play("confirm");
      return;
    }

    const cardEl = event.target.closest(".ps-card");
    if (!cardEl) return;
    const project = projects.find((p) => p.id === cardEl.dataset.id);
    if (!project) return;
    const at = cards.findIndex((c) => c.project.id === project.id);
    if (at >= 0) select(at);
  });

  /* ------------------------------- boot -------------------------------- */

  load();
  sound.soundtrackEnter();

  return () => {
    dead = true;
  };
}

/* Deterministic pseudo-random so a card tilts the same way on every visit. */
function hash(str) {
  let h = 9;
  for (let i = 0; i < String(str).length; i++) h = Math.imul(h ^ String(str).charCodeAt(i), 387420489);
  return (h ^ (h >>> 9)) >>> 0;
}
