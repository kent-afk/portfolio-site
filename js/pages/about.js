import { sound } from "../sound.js";

// ABOUT - "ABOUT ME": section bars that reveal a paper panel.

const BG = "assets/aboutMenu-eyip1OQR.webp";
// Portrait per section, order matches SECTIONS. Images sit in the right-hand
// column; if one fails to load, the panel falls back to text-only.
const PORTRAITS = [
  "assets/tributo-gl-BvztE6HA.webp",
  "assets/canciones-qLwBa15B.webp",
  "assets/itmo.webp",
  "assets/collage-fanzine-BoR6POle.webp",
  "assets/soy-culpable-DOzNpZNe.webp",
  "assets/BnQ5NQqf.webp",
];

const SECTIONS = [
  {
    id: "profile", label: "PROFILE", role: "01", color: "#BB1010",
    stats: [{ tag: "FOCUS", value: "BACKEND", color: "#BB1010" }, { tag: "METHOD", value: "END-TO-END", color: "#FF5500" }],
    content: {
      title: "PROFILE",
      body: "Backend student at ITMO who likes taking a feature from a blank repository to a running service. My current toolkit is C#, ASP.NET Core and Python, with PostgreSQL for data and Docker/Yandex Cloud for deployment. I care about clear boundaries, useful tests and boring, reliable releases.\n\nI’m looking for a backend internship where I can own small tasks end to end and learn from a strong engineering team.",
    },
  },
  {
    id: "about", label: "ABOUT ME", role: "02", color: "#FF5500",
    stats: [{ tag: "PHILOSOPHY", value: "CLARITY", color: "#FF5500" }, { tag: "DRIVE", value: "CURIOSITY", color: "#FF7A22" }],
    content: {
      title: "ABOUT ME",
      body: "I’m Alexander, a software engineering student in Saint Petersburg. I started with C++ and small desktop projects, then moved into backend work because I enjoy the part users never see: business rules, persistence, failure handling and deployment.\n\nMy recent project is an AI assistant deployed on Yandex Cloud. It has real infrastructure behind it — a VM, private network, security group, Docker Compose, health checks and CI — not just a chat demo. I also built a warehouse REST API and a C# messaging system with 20 tests.\n\nOutside code, I’m into powerlifting, music and comics. I like finishing things: understand the problem, build the smallest useful version, test it, write a clear README and ship.",
    },
  },
  {
    id: "education", label: "EDUCATION", role: "03", color: "#3355FF",
    stats: [{ tag: "UNIVERSITY", value: "ITMO", color: "#3355FF" }, { tag: "GRADUATION", value: "2029", color: "#AAFF00" }],
    content: {
      title: "EDUCATION",
      body: "ITMO UNIVERSITY\nB.S. in Software Engineering - Saint Petersburg, Russia\nExpected graduation: June 2029\n\nConcentrations: Backend and Cloud Engineering\n\nRelated coursework:\nData Structures & Algorithms · DBMS · OOP · Computer Organization · Software Design",
    },
  },
  {
    id: "experience", label: "EXPERIENCE", role: "04", color: "#AAFF00",
    stats: [{ tag: "PROJECTS", value: "06", color: "#AAFF00" }, { tag: "TESTS", value: "127", color: "#88DD00" }],
    content: {
      title: "PRACTICAL EXPERIENCE",
      body: "AI TELEGRAM ASSISTANT\nAI assistant deployed to Yandex Cloud: VM, VPC, security group, Docker Compose, health checks and CI. Python, PostgreSQL, OpenRouter, 65 pytest tests. Private repo available on request.\n\nMETAL ROLL WAREHOUSE API\nREST API with 5 endpoints, 15 warehouse statistics, EF Core, PostgreSQL/SQLite, Docker Compose and 11 xUnit tests. Public repo: kent-afk/rolls-storage-cs.\n\nCORPORATE MESSAGE DISTRIBUTION SYSTEM\n.NET 8 messaging system built with four structural design patterns and 20 xUnit tests. Public repo: kent-afk/Corporate-Message-Distribution-System.\n\nALSO IN THE DECK\nCloud Manager - identity microservice (in progress), EVE Mining & Colony Simulator (private), Transport Route Simulator.",
    },
  },
  {
    id: "skills", label: "SKILLS", role: "05", color: "#db1398",
    stats: [{ tag: "LANGUAGES", value: "C# · SQL · PY", color: "#db1398" }, { tag: "TOOLS", value: ".NET · DOCKER", color: "#00e1ff" }],
    content: {
      title: "SKILLS & COMPETENCIES",
      body: "LANGUAGES\nC# · SQL · Python · C++ · C\n\nBACKEND\nASP.NET Core · .NET 8 · EF Core · REST APIs · LINQ · async/await\n\nPYTHON\naiogram · asyncpg · aiohttp\n\nCLOUD & DEVOPS\nYandex Cloud · Docker · Docker Compose · GitHub Actions · Linux · SSH\n\nDATA & TESTING\nPostgreSQL · SQLite · xUnit · pytest · NSubstitute\n\nARCHITECTURE & TOOLS\nClean Architecture · SOLID · GoF · Git · Swagger/OpenAPI",
    },
  },
  {
    id: "manifest", label: "MANIFEST", role: "06", color: "#db394f",
    stats: [{ tag: "BELIEF", value: "SIMPLICITY", color: "#fffb00" }, { tag: "MISSION", value: "SHIP", color: "#FF7A22" }],
    content: {
      title: "MANIFEST",
      body: "The best code I wrote this year was the code that made a failure boring: a fallback model when the first one hit a 429, a health check that stopped a bad deploy, a test that caught a broken contract. I like working at that level — where a small design choice saves an hour of debugging later.\n\nI don’t chase patterns for their own sake. I use them when they make the next change easier. I’d rather have a short service I understand than an impressive diagram I can’t deploy.\n\nRight now I’m learning to build reliable backend systems — and I’m ready to help a team ship them.",
    },
  },
];

export default function about(ctx) {
  const { root, navigate } = ctx;

  const screen = document.createElement("div");
  screen.className = "screen about-screen";

  const bg = document.createElement("div");
  bg.className = "about-bg";
  bg.setAttribute("aria-hidden", "true");
  bg.style.backgroundImage = `url(${BG})`;
  screen.appendChild(bg);

  const scan = document.createElement("div");
  scan.className = "scanlines";
  scan.setAttribute("aria-hidden", "true");
  screen.appendChild(scan);

  const header = document.createElement("div");
  header.className = "about-header";
  const backBtn = document.createElement("button");
  backBtn.className = "about-back";
  backBtn.dataset.hover = "true";
  backBtn.textContent = "BACK";
  const headerT = document.createElement("span");
  headerT.className = "about-header-t";
  headerT.textContent = "ABOUT ME";
  header.appendChild(backBtn);
  header.appendChild(headerT);
  screen.appendChild(header);

  const bars = document.createElement("div");
  bars.className = "about-bars";
  bars.setAttribute("role", "group");
  bars.setAttribute("aria-label", "Sections");

  const barRefs = [];
  SECTIONS.forEach((s, a) => {
    const outer = document.createElement("div");
    outer.className = "about-bar-outer";
    outer.setAttribute("role", "button");
    outer.setAttribute("tabindex", "0");
    outer.setAttribute("aria-label", s.label);
    outer.setAttribute("aria-haspopup", "dialog");
    outer.setAttribute("aria-controls", "about-reveal-panel");
    outer.dataset.hover = "true";
    outer.style.setProperty("--bar-color", s.color);
    outer.style.pointerEvents = "all";
    outer.style.cursor = "pointer";

    const accent = document.createElement("div");
    accent.className = "about-bar-accent";
    accent.style.background = s.color;

    const bar = document.createElement("div");
    bar.className = "about-bar";
    bar.innerHTML = `<div class="about-bar-fill"></div><div class="about-bar-shade"></div>`;

    const content = document.createElement("div");
    content.className = "about-bar-content";
    const role = document.createElement("div");
    role.className = "about-role";
    role.textContent = s.role;
    const main = document.createElement("div");
    main.className = "about-bar-main";
    const label = document.createElement("div");
    label.className = "about-bar-label";
    label.textContent = s.label;
    main.appendChild(label);
    const stats = document.createElement("div");
    stats.className = "about-bar-stats";
    s.stats.forEach((st) => {
      const stat = document.createElement("div");
      stat.className = "about-stat";
      const tag = document.createElement("span");
      tag.className = "about-stat-tag";
      tag.style.color = st.color;
      tag.style.borderColor = st.color;
      tag.textContent = st.tag;
      const val = document.createElement("span");
      val.className = "about-stat-val";
      val.textContent = st.value;
      stat.appendChild(tag);
      stat.appendChild(val);
      stats.appendChild(stat);
    });
    const cross = document.createElement("div");
    cross.className = "about-bar-cross";
    cross.setAttribute("aria-hidden", "true");
    cross.textContent = "✕";
    content.appendChild(role);
    content.appendChild(main);
    content.appendChild(stats);
    content.appendChild(cross);
    bar.appendChild(content);
    outer.appendChild(accent);
    outer.appendChild(bar);
    bars.appendChild(outer);

    outer.addEventListener("click", () => reveal(a));
    outer.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        reveal(a);
      }
    });
    outer.addEventListener("mouseenter", () => {
      if (open) return;
      barRefs.forEach((b) => b.outer.classList.remove("hover-focus"));
      outer.classList.add("hover-focus");
      setIndex(a);
      focusBar(a, true);
    });
    outer.addEventListener("focus", () => {
      if (open) return;
      if (!hoverFocusActive) barRefs.forEach((b) => b.outer.classList.remove("hover-focus"));
      setIndex(a);
    });

    barRefs.push({ outer, role, label, stats: [...stats.querySelectorAll(".about-stat-val")] });
  });
  screen.appendChild(bars);

  // Reveal + portrait (created once, toggled)
  const dim = document.createElement("div");
  dim.className = "about-dim";
  dim.style.display = "none";

  const revealPanel = document.createElement("div");
  revealPanel.className = "about-reveal";
  revealPanel.id = "about-reveal-panel";
  revealPanel.setAttribute("role", "dialog");
  revealPanel.setAttribute("aria-modal", "true");
  revealPanel.setAttribute("aria-labelledby", "about-reveal-title");
  revealPanel.innerHTML = `
    <button class="about-close" type="button" data-hover="true" aria-label="Close section">✕</button>
    <div class="about-reveal-inner"><h2 class="about-reveal-title" id="about-reveal-title"></h2><div class="about-reveal-body"></div></div>`;
  revealPanel.style.display = "none";

  const closeBtn = revealPanel.querySelector(".about-close");
  closeBtn.addEventListener("click", close);

  const portrait = document.createElement("div");
  portrait.className = "about-portrait-shell";
  portrait.innerHTML = `<div class="about-portrait-placeholder"><img alt="Portrait"></div>`;
  portrait.style.display = "none";

  screen.appendChild(dim);
  screen.appendChild(revealPanel);
  screen.appendChild(portrait);

  const stripe = document.createElement("div");
  stripe.className = "stripe-r";
  stripe.setAttribute("aria-hidden", "true");
  const stripe2 = document.createElement("div");
  stripe2.className = "stripe-r2";
  stripe2.setAttribute("aria-hidden", "true");
  screen.appendChild(stripe);
  screen.appendChild(stripe2);

  root.appendChild(screen);

  let index = 0;
  let hoverFocusActive = false;
  let open = false;
  let opener = null;

  function onDialogKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      if (open) close();
      else goBack();
      return;
    }
    if (open) {
      if (event.key !== "Tab") return;
      const focusables = [...revealPanel.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )].filter((el) => el.getClientRects().length > 0);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !revealPanel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !revealPanel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown" && event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (event.target.closest("input, textarea, select, [contenteditable='true']")) return;
    event.preventDefault();
    const dir = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
    const next = (index + dir + SECTIONS.length) % SECTIONS.length;
    barRefs.forEach((b) => b.outer.classList.remove("hover-focus"));
    setIndex(next);
    focusBar(next);
  }
  document.addEventListener("keydown", onDialogKeydown);
  window.addEventListener("resize", applyBars);
  document.fonts?.ready.then(() => { if (document.body.contains(screen)) applyBars(); });

  function applyBars() {
    barRefs.forEach((b, a) => {
      const isActive = a === index;
      b.outer.classList.toggle("active", isActive);
      b.role.style.color = isActive ? SECTIONS[a].color : "rgba(255,255,255,.15)";
      b.label.style.color = isActive ? "#ffffff" : "rgba(255,255,255,.8)";
      b.stats.forEach((sv) => { sv.style.color = isActive ? "#0a0a08" : "#fff"; });
      if (isActive) {
        const barRect = b.outer.getBoundingClientRect();
        const labelRect = b.label.getBoundingClientRect();
        const cut = barRect.width ? ((labelRect.right - barRect.left + 12) / barRect.width) * 100 : 24;
        b.outer.style.setProperty("--cut", `${Math.min(72, Math.max(18, cut)).toFixed(2)}%`);
      }
    });
  }

  function setIndex(i) {
    if (i === index) return;
    index = i;
    applyBars();
  }

  function focusBar(i, fromHover = false) {
    const bar = barRefs[i]?.outer;
    if (!bar) return;
    hoverFocusActive = fromHover;
    bar.focus({ preventScroll: true });
    hoverFocusActive = false;
  }

  function reveal(i) {
    sound.play("reveal");
    opener = barRefs[i]?.outer || document.activeElement;
    index = i;
    barRefs.forEach((b) => b.outer.classList.remove("hover-focus"));
    applyBars();
    open = true;
    const s = SECTIONS[i];
    revealPanel.style.setProperty("--accent-color", s.color);
    revealPanel.querySelector(".about-reveal-title").textContent = s.content.title;
    revealPanel.querySelector(".about-reveal-body").textContent = s.content.body;
    const portraitImg = portrait.querySelector("img");
    const src = PORTRAITS[i];
    portraitImg.onerror = () => { portrait.style.display = "none"; };
    revealPanel.classList.toggle("no-portrait", !src);
    if (src) {
      portraitImg.alt = s.label;
      portraitImg.src = src;
      portrait.style.display = "";
    } else {
      portrait.style.display = "none";
    }

    bars.classList.add("bars-disabled");
    dim.style.display = "";
    revealPanel.style.display = "";
    backBtn.textContent = "CLOSE";
    closeBtn.style.display = "";
    // retrigger the mount animations
    [revealPanel, portrait].forEach((el) => {
      el.classList.remove("mounted");
      void el.offsetWidth;
      el.classList.add("mounted");
    });
    closeBtn.focus({ preventScroll: true });
  }

  function close() {
    if (!open) return;
    sound.play("close");
    open = false;
    const returnTo = opener;
    opener = null;
    bars.classList.remove("bars-disabled");
    dim.style.display = "none";
    revealPanel.style.display = "none";
    portrait.style.display = "none";
    backBtn.textContent = "BACK";
    closeBtn.style.display = "none";
    if (returnTo) returnTo.focus({ preventScroll: true });
  }

  function goBack() {
    if (open) {
      close();
    } else {
      sound.play("back");
      navigate("/");
    }
  }

  backBtn.addEventListener("click", goBack);
  dim.addEventListener("click", close);

  applyBars();
  sound.soundtrackEnter();

  const mountTimer = setTimeout(() => {
    barRefs.forEach((b) => b.outer.classList.add("mounted"));
  }, 80);

  return () => {
    clearTimeout(mountTimer);
    document.removeEventListener("keydown", onDialogKeydown);
    window.removeEventListener("resize", applyBars);
  };
}
