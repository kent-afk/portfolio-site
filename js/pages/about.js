import { sound } from "../sound.js";

// ABOUT — "ABOUT ME": section bars that reveal a paper panel.

const BG = "assets/aboutMenu-eyip1OQR.webp";
// Portrait per section, order matches SECTIONS. Images sit in the right-hand
// column; if one fails to load, the panel falls back to text-only.
const PORTRAITS = [
  "assets/tributo-gl-BvztE6HA.webp",
  "assets/canciones-qLwBa15B.webp",
  "assets/itmo.jpg",
  "assets/collage-fanzine-BoR6POle.webp",
  "assets/soy-culpable-DOzNpZNe.webp",
  "assets//BnQ5NQqf.webp",
];

const SECTIONS = [
  {
    id: "profile", label: "PROFILE", role: "01", color: "#BB1010",
    stats: [{ tag: "FOCUS", value: "BACKEND", color: "#BB1010" }, { tag: "METHOD", value: "CLEAN CODE", color: "#FF5500" }],
    content: {
      title: "PROFILE",
      body: "Backend and Cloud Engineering student at ITMO University, building production-ready services with C#, ASP.NET Core and .NET 8. I care about clean architecture, explicit boundaries and automated tests — the parts that keep systems easy to change after the first release.\n\nCurrently looking for a backend internship where I can ship real features with an experienced team.",
    },
  },
  {
    id: "about", label: "ABOUT ME", role: "02", color: "#FF5500",
    stats: [{ tag: "PHILOSOPHY", value: "CLARITY", color: "#FF5500" }, { tag: "DRIVE", value: "CURIOSITY", color: "#FF7A22" }],
    content: {
      title: "ABOUT ME",
      body: "I am Alexander, a software engineering student based in Saint Petersburg. I like systems that make sense: clear layers, readable code, tests that prove behaviour and containers that make an environment reproducible.\n\nMost of my work starts with a small question — how should this boundary work? — and grows into a project: a REST API, a message distribution system, a route simulator, a vision experiment. I learn by building the whole thing, documenting the trade-offs and then making it a little better.\n\nI am open to relocation and ready to contribute to a high-impact backend team.",
    },
  },
  {
    id: "education", label: "EDUCATION", role: "03", color: "#3355FF",
    stats: [{ tag: "UNIVERSITY", value: "ITMO", color: "#3355FF" }, { tag: "GRADUATION", value: "2029", color: "#AAFF00" }],
    content: {
      title: "EDUCATION",
      body: "ITMO UNIVERSITY\nB.S. in Software Engineering — Saint Petersburg, Russia\nExpected graduation: June 2029\n\nConcentrations: Backend and Cloud Engineering\n\nRelated coursework:\nData Structures & Algorithms · Objects & Design · Computer Organization & Programming · Combinatorics · Discrete Math · DBMS · Object-Oriented Programming · Statistics & Applications",
    },
  },
  {
    id: "experience", label: "EXPERIENCE", role: "04", color: "#AAFF00",
    stats: [{ tag: "PROJECTS", value: "04", color: "#AAFF00" }, { tag: "TESTS", value: "34+", color: "#88DD00" }],
    content: {
      title: "PRACTICAL EXPERIENCE",
      body: "METAL ROLL WAREHOUSE API\n3-layer clean architecture REST API with 5 endpoints, 13 statistical metrics, Swagger documentation and Docker-based persistence.\n\nENTERPRISE MESSAGE DISTRIBUTION SYSTEM\n.NET 8 messaging system built with four structural design patterns and 20 xUnit tests passing at 100%.\n\nTRANSPORT ROUTE SIMULATOR\nDriverless maglev route simulation with iterative Newtonian physics and 14 xUnit tests across 8 route configurations.\n\nMOTION TRACKER\nReal-time hand gesture recognition with MediaPipe hand landmarks and OpenCV at live webcam frame rate.\n\nSelf-directed project work, built end to end and documented on GitHub.",
    },
  },
  {
    id: "skills", label: "SKILLS", role: "05", color: "#db1398",
    stats: [{ tag: "LANGUAGES", value: "C# · SQL · PY", color: "#db1398" }, { tag: "TOOLS", value: ".NET · DOCKER", color: "#00e1ff" }],
    content: {
      title: "SKILLS & COMPETENCIES",
      body: "PROGRAMMING\nC# · SQL · Python · C++ · C · Qt · Entity Framework · .NET 8+ · ASP.NET Core · SignalR · NSubstitute\n\nTOOLS & PLATFORMS\nGit · Linux · Docker · PostgreSQL · Azure Data Studio · Rider · Swagger/OpenAPI · GitHub Actions · CI/CD · RabbitMQ\n\nFOCUS\nClean Architecture · SOLID · Automated Testing (xUnit) · REST APIs · Containerization",
    },
  },
  {
    id: "manifest", label: "MANIFEST", role: "06", color: "#db394f",
    stats: [{ tag: "BELIEF", value: "SIMPLICITY", color: "#fffb00" }, { tag: "MISSION", value: "SHIP", color: "#FF7A22" }],
    content: {
      title: "MANIFEST",
      body: "Before a system works, someone has to imagine how it fails.\n\nThat is where I like to work: at the boundary between an idea and something that survives contact with real traffic, real data and real deadlines. A good backend is not the one with the most abstractions. It is the one whose seams are visible, whose failures are typed, and whose next change does not require a rewrite.\n\nI believe in simple architecture, tests that speak plainly, documentation that respects the reader, and shipping in small, verifiable steps.\n\nI want to build software that keeps its promises.",
    },
  },
];

export default function about(ctx) {
  const { root, navigate } = ctx;

  const screen = document.createElement("div");
  screen.className = "screen about-screen";
  screen.style.backgroundImage = `url(${BG})`;
  screen.style.backgroundSize = "cover";
  screen.style.backgroundPosition = "center";
  screen.style.backgroundRepeat = "no-repeat";

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
    outer.setAttribute("aria-label", s.label);
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
    outer.addEventListener("mouseenter", () => { if (!open) setIndex(a); });

    barRefs.push({ outer, role, label, stats: [...stats.querySelectorAll(".about-stat-val")] });
  });
  screen.appendChild(bars);

  // Reveal + portrait (created once, toggled)
  const dim = document.createElement("div");
  dim.className = "about-dim";
  dim.style.display = "none";

  const revealPanel = document.createElement("div");
  revealPanel.className = "about-reveal";
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
  let open = false;

  function applyBars() {
    barRefs.forEach((b, a) => {
      const isActive = a === index;
      b.outer.classList.toggle("active", isActive);
      b.role.style.color = isActive ? SECTIONS[a].color : "rgba(255,255,255,.15)";
      b.label.style.color = isActive ? "#0a0a08" : "rgba(255,255,255,.8)";
      b.stats.forEach((sv) => { sv.style.color = isActive ? "#0a0a08" : "#fff"; });
    });
  }

  function setIndex(i) {
    if (i === index) return;
    index = i;
    applyBars();
  }

  function reveal(i) {
    sound.play("reveal");
    index = i;
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
  }

  function close() {
    if (!open) return;
    sound.play("close");
    open = false;
    bars.classList.remove("bars-disabled");
    dim.style.display = "none";
    revealPanel.style.display = "none";
    portrait.style.display = "none";
    backBtn.textContent = "BACK";
    closeBtn.style.display = "none";
  }

  function goBack() {
    if (open) {
      sound.play("close");
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
  };
}
