import { sound } from "../sound.js";

// RESUME — a printable, web-native version of BackendSoftwareEngineer_Resume.docx.
// Content is kept in one data object so it is easy to update. The DOCX stays
// available for download from the header and the page footer.

const DOCX = "assets/BackendSoftwareEngineer_Resume.docx";
const GITHUB = "https://github.com/kent-afk";
const LINKEDIN = "https://www.linkedin.com/in/alexander-korenchuk-93a1353bb/";
const EMAIL = "a.Korenchuk2026@outlook.com";

const RESUME = {
  name: "Alexander Korenchuk",
  role: "Backend & Cloud Engineer · Software Engineering Student",
  stack: "C# · ASP.NET CORE · .NET 8 · POSTGRESQL · DOCKER",
  location: "Saint Petersburg, Russia",
  availability: "Open to backend internships · willing to relocate",
  metrics: [
    { value: "04", label: "Projects shipped" },
    { value: "34", label: "Unit tests" },
    { value: "05", label: "REST endpoints" },
    { value: "100%", label: "xUnit pass rate" },
  ],
  summary:
    "Software Engineering student at ITMO University specializing in Backend & Cloud Engineering. Proficient in building scalable systems with C#, ASP.NET Core, and .NET 8, with a strong focus on Clean Architecture and SOLID principles. Proven ability to deliver production-ready code through automated testing (xUnit) and containerization (Docker). Seeking a Backend Internship where I can contribute to high-impact engineering teams.",
  projects: [
    {
      num: "01",
      title: "Metal Roll Warehouse API",
      date: "Nov 2025 — Dec 2025",
      sub: "Personal project · C# / ASP.NET Core / EF Core / PostgreSQL",
      bullets: [
        "Designed and implemented a 3-layer clean architecture (Controller → Service → Repository) REST API for metal roll inventory management using C#, ASP.NET Core, Entity Framework, and PostgreSQL.",
        "Developed 5 endpoints with advanced filtering by weight, length and dates, created 13 statistical metrics, and included full Swagger documentation.",
        "Reduced database coupling to zero, measured by seamless switching between SQLite and PostgreSQL via a single config key, by abstracting persistence behind IRollRepository and externalizing connection strings through environment variables and Docker Compose.",
      ],
      tags: ["ASP.NET Core", "EF Core", "PostgreSQL", "Docker", "Swagger"],
    },
    {
      num: "02",
      title: "Enterprise Message Distribution System",
      date: "Sep 2025 — Oct 2025",
      sub: "Personal project · .NET 8 / C# / xUnit",
      bullets: [
        "Engineered an extensible corporate messaging system measured by 20 xUnit tests passing at 100%, by implementing 4 structural design patterns (Decorator, Strategy, Builder, Composite) in .NET 8.",
        "Built enterprise message distribution with topics, importance filters, suspicious-content notifications, archiving, console/file output and logging using SOLID, GRASP and GoF principles.",
      ],
      tags: [".NET 8", "SOLID", "GoF", "xUnit", "Logging"],
    },
    {
      num: "03",
      title: "Transport Route Simulator",
      date: "Sep 2025",
      sub: "Personal project · C# / OOP / xUnit",
      bullets: [
        "Simulated driverless maglev train routing measured by 14 xUnit tests across 8 route configurations including failure edge cases, by modelling iterative Newtonian physics across composable IPathSegment implementations.",
        "Eliminated exception-driven control flow, measured by zero thrown exceptions for all domain failures, by returning typed ResultPath result objects from every simulation run.",
        "Ensured open-ended route extensibility, measured by zero changes to existing code when adding new segment types, by designing IPathSegment as the sole extension point per the Open/Closed Principle.",
      ],
      tags: ["OOP", "Open/Closed", "xUnit", "Physics"],
    },
    {
      num: "04",
      title: "Motion Tracker",
      date: "Dec 2025",
      sub: "Personal project · Python / MediaPipe / OpenCV",
      bullets: [
        "Built a real-time gesture recognition system capable of detecting 2 distinct hand poses and mapping them to visual outputs at live webcam frame rate, by integrating MediaPipe's hand landmark model with OpenCV for per-frame pose classification.",
      ],
      tags: ["MediaPipe", "OpenCV", "Computer Vision", "Python"],
    },
  ],
  education: {
    school: "ITMO University",
    degree: "B.S. in Software Engineering",
    location: "Saint Petersburg, Russia",
    date: "Expected June 2028",
    concentrations: "Backend and Cloud Engineering",
    coursework: [
      "Data Structures & Algorithms",
      "Objects & Design",
      "Computer Organization & Programming",
      "Combinatorics",
      "Discrete Math",
      "DBMS",
      "Object-Oriented Programming",
      "Statistics & Applications",
    ],
  },
  skills: [
    { label: "Languages", items: ["C#", "SQL", "Python", "C++", "C", "Qt"] },
    { label: "Frameworks", items: [".NET 8+", "ASP.NET Core", "Entity Framework", "SignalR", "NSubstitute"] },
    { label: "Tools & Cloud", items: ["Git", "Linux", "Docker", "PostgreSQL", "Azure Data Studio", "Rider", "Swagger/OpenAPI", "GitHub Actions", "CI/CD", "RabbitMQ"] },
  ],
  focus: ["Clean Architecture", "REST APIs", "SOLID", "xUnit", "Docker", "CI/CD", "Cloud"],
};

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function sectionHead(label, num) {
  return `<h2 class="rs-h"><span class="rs-h-bar"></span><span>${esc(label)}</span><span class="rs-h-rule"></span><span class="rs-h-n">${esc(num)}</span></h2>`;
}

function renderProject(project) {
  return `
    <article class="rs-job">
      <div class="rs-job-head">
        <h3>${esc(project.title)}</h3>
        <span class="rs-job-date">${esc(project.date)}</span>
      </div>
      <p class="rs-job-sub">${esc(project.sub)}</p>
      <ul>${project.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      <div class="rs-tags">${project.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
    </article>`;
}

export default function resume(ctx) {
  const { root, navigate } = ctx;

  const el = document.createElement("div");
  el.className = "rs-root";

  const metrics = RESUME.metrics.map((m) => `
    <div class="rs-metric">
      <strong>${esc(m.value)}</strong>
      <span>${esc(m.label)}</span>
    </div>`).join("");

  const projects = RESUME.projects.map(renderProject).join("");

  const skillGroups = RESUME.skills.map((group) => `
    <div class="rs-skill-group">
      <span class="rs-skill-label">${esc(group.label)}</span>
      <div class="rs-skill">${group.items.map((item) => `<span>${esc(item)}</span>`).join("")}</div>
    </div>`).join("");

  const focus = RESUME.focus.map((item) => `<span>${esc(item)}</span>`).join("");
  const coursework = RESUME.education.coursework.map((item) => `<span>${esc(item)}</span>`).join("");
  const nameParts = RESUME.name.split(" ");
  const firstName = nameParts.shift() || "";
  const lastName = nameParts.join(" ");

  el.innerHTML = `
    <header class="rs-head">
      <button class="rs-back" type="button" data-back data-hover="true">HOME</button>
      <div class="rs-head-c">
        <span class="rs-head-lbl">★ RESUME</span>
        <span class="rs-head-sub">BACKEND · CLOUD · SOFTWARE ENGINEERING</span>
      </div>
      <div class="rs-head-actions">
        <a class="rs-head-act" href="${DOCX}" download="BackendSoftwareEngineer_Resume.docx" data-hover="true">↓ DOCX</a>
        <button class="rs-head-act rs-print" type="button" data-print data-hover="true">⎙ PRINT / PDF</button>
      </div>
    </header>

    <div class="rs-scroll">
      <article class="rs-sheet" aria-label="Resume of ${esc(RESUME.name)}">
        <div class="rs-banner">
          <div class="rs-banner-main">
            <span class="rs-kicker">BACKEND SOFTWARE ENGINEER · RESUME 2026</span>
            <h1 class="rs-name">${esc(firstName)} <em>${esc(lastName)}</em></h1>
            <p class="rs-role">${esc(RESUME.role)}</p>
            <p class="rs-stack">${esc(RESUME.stack)}</p>
            <p class="rs-status"><span class="rs-status-dot"></span>${esc(RESUME.availability)}</p>
          </div>
          <div class="rs-banner-metrics" aria-label="Career highlights">${metrics}</div>
          <span class="rs-banner-mark" aria-hidden="true">AK</span>
        </div>

        <div class="rs-body">
          <main class="rs-main">
            <section class="rs-sec">
              ${sectionHead("Summary", "01")}
              <p class="rs-summary">${esc(RESUME.summary)}</p>
            </section>

            <section class="rs-sec">
              ${sectionHead("Project Experience", "02")}
              <div class="rs-jobs">${projects}</div>
            </section>

            <section class="rs-sec">
              ${sectionHead("Education", "03")}
              <div class="rs-edu">
                <div>
                  <h3>${esc(RESUME.education.school)}</h3>
                  <p class="rs-edu-degree">${esc(RESUME.education.degree)} · ${esc(RESUME.education.location)}</p>
                </div>
                <span class="rs-edu-date">${esc(RESUME.education.date)}</span>
              </div>
              <p class="rs-edu-note"><strong>Concentration:</strong> ${esc(RESUME.education.concentrations)}</p>
              <p class="rs-edu-note"><strong>Related coursework:</strong></p>
              <div class="rs-course">${coursework}</div>
            </section>
          </main>

          <aside class="rs-side">
            <section class="rs-side-card">
              <h2 class="rs-side-title">Contact</h2>
              <div class="rs-contact">
                <a href="mailto:${EMAIL}"><span>Email</span><span>${esc(EMAIL)}</span></a>
                <a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><span>in/alexander-korenchuk ↗</span></a>
                <a href="${GITHUB}" target="_blank" rel="noopener noreferrer"><span>GitHub</span><span>@kent-afk ↗</span></a>
                <span class="rs-contact-row"><span>Location</span><span>${esc(RESUME.location)}</span></span>
              </div>
              <p class="rs-side-note">★ ${esc(RESUME.availability)}</p>
            </section>

            <section class="rs-side-card">
              <h2 class="rs-side-title">Technical Stack</h2>
              ${skillGroups}
            </section>

            <section class="rs-side-card">
              <h2 class="rs-side-title">Focus</h2>
              <div class="rs-focus">${focus}</div>
            </section>

            <section class="rs-side-card rs-side-card--note">
              <h2 class="rs-side-title">At a glance</h2>
              <p>ITMO University · Software Engineering<br>Expected graduation June 2029<br>Backend &amp; Cloud Engineering</p>
            </section>
          </aside>
        </div>

        <footer class="rs-sheet-foot">
          <span>${esc(RESUME.name)} · Backend &amp; Cloud</span>
          <span>Saint Petersburg · RU</span>
          <span>${esc(EMAIL)}</span>
        </footer>
      </article>

      <div class="rs-page-foot">
        <span>SOURCE · BackendSoftwareEngineer_Resume.docx</span>
        <div class="rs-page-actions">
          <a href="${DOCX}" download="BackendSoftwareEngineer_Resume.docx" data-hover="true">↓ DOWNLOAD DOCX</a>
          <button type="button" data-print data-hover="true">⎙ PRINT / SAVE PDF</button>
        </div>
      </div>
    </div>`;

  root.appendChild(el);

  const back = el.querySelector("[data-back]");
  back.addEventListener("click", () => {
    sound.play("back");
    navigate("/");
  });

  const print = () => {
    sound.play("confirm");
    window.print();
  };
  el.querySelectorAll("[data-print]").forEach((btn) => btn.addEventListener("click", print));

  sound.soundtrackEnter();

  return () => {};
}
