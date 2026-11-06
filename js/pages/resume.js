import { sound } from "../sound.js";
import { esc } from "../ui.js";

// RESUME — a printable, web-native version of the bilingual resume.
// The DOCX files stay available for download from the header and page footer.
// Language is persisted in localStorage and can be switched in the header.

const DOCX = {
  en: "assets/BackendSoftwareEngineer_Resume_EN.docx",
  ru: "assets/BackendSoftwareEngineer_Resume_RU.docx",
};
const DOCX_NAME = {
  en: "BackendSoftwareEngineer_Resume_EN.docx",
  ru: "BackendSoftwareEngineer_Resume_RU.docx",
};
const LANG_KEY = "ak.resume.lang";
const GITHUB = "https://github.com/kent-afk";
const LINKEDIN = "https://www.linkedin.com/in/alexander-k-93a1353bb/";
const EMAIL = "a.korenchuk2026@outlook.com";

// Decorative Persona-style mark in the resume banner (replaces the old
// numeric metrics block).
const ASCII_MARK = `⠀⢀⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣄
⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⡉⠙⠻⢿⣿⣿⣿⣿⣿⢿⣦
⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⡆⠀⠀⢻⣿⣿⣿⣿⡆⠈⢳⡄
⣿⣿⣿⣿⣿⣿⣿⠈⢿⣿⣿⣿⣷⠖⠀⠀⣿⣿⣿⣿⣿⣄⠀⣿⡄
⣿⣿⣿⣿⣿⣿⣿⣇⠀⢄⡙⠋⠻⡄⠀⣼⣿⣿⣿⣩⠟⠟⠀⣼⣿⡄
⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣭⣤⣤⣴⣿⣿⣿⣿⣿⣿⣿⣦⣴⣿⣿⣷⠀
⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠿⢿⣿⣿⣶⣶⣶⣶⣾⣿⣿⣿⣿⣿⣿⢰⣶⣄
⣏⣉⣛⣛⣛⣛⣥⣶⣾⣿⣿⣿⣷⡝⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⡇
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⠟⠀
⡇⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢋⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠈⠁
⡇⠀⠹⣿⣿⣿⡿⠿⠛⣋⣥⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`;

const RESUME = {
  en: {
    name: "Alexander Korenchuk",
    kicker: "BACKEND · DATA · AI AGENTS · RESUME 2026",
    role: "Backend Engineer Intern · C# / .NET · Architecture & Data",
    stack: "CLEAN ARCHITECTURE · C# · ASP.NET CORE · POSTGRESQL · DOCKER · AI AGENTS · MCP",
    tagline:
      "I design layered backend services and language-agnostic data models, then ship them end-to-end — with AI agents, MCP servers, and agent skills in the workflow.",
    location: "Saint Petersburg, Russia",
    availability: "Open to backend internships · willing to relocate",
    summary:
      "I’m a Software Engineering student at ITMO University, focused on backend and cloud. I design layered services and language-agnostic data models, then ship them end-to-end: API design, PostgreSQL schemas, automated tests, Docker, CI, and cloud deployment. I work in C#/ASP.NET Core and Python, and use AI agents, MCP servers, and reusable agent skills to speed up delivery. Recent work: a cloud-deployed AI assistant (65 pytest tests), a PostgreSQL-backed warehouse API (11 xUnit integration tests), and an identity microservice with JWT, MediatR, and RabbitMQ. I’m looking for a backend internship where I can own small features and ship them to production.",
    projects: [
      {
        title: "Cloud Manager — Identity Microservice",
        date: "2026",
        sub: "Personal project · C# / .NET 9 / ASP.NET Core / EF Core / PostgreSQL / RabbitMQ / MediatR",
        bullets: [
          "Designed a four-layer identity service (API, Application, Domain, Infrastructure) with MediatR command handlers, EF Core/PostgreSQL, JWT/BCrypt, and RabbitMQ domain events.",
          "Documented the API with Swagger Bearer auth; Docker Compose, integration tests, and gateway routing are in progress.",
        ],
        result: "Identity service with JWT, BCrypt, EF Core/PostgreSQL and RabbitMQ events; delivery setup in progress.",
        tags: ["C#", ".NET 9", "MediatR", "PostgreSQL", "RabbitMQ", "JWT"],
        link: {
          label: "github.com/kent-afk/cloud-manager (in progress)",
          url: "https://github.com/kent-afk/cloud-manager",
        },
      },
      {
        title: "AI Telegram Assistant",
        date: "Oct 2026",
        sub: "Course project · Python / aiogram / PostgreSQL / Docker / Yandex Cloud",
        bullets: [
          "Deployed a Python/PostgreSQL assistant to Yandex Cloud with Docker Compose, OpenRouter fallback, and prompt-injection hardening; 65 pytest tests on a 3-OS CI matrix.",
          "Designed the dialog model and async data access; built study/translate/summarize modes and per-chat settings.",
        ],
        result: "Shipped to Yandex Cloud with automated deploy; 65 tests on three OSes.",
        tags: ["Python", "PostgreSQL", "Docker", "Yandex Cloud", "CI"],
        link: { label: "Private repo — available on request", url: "" },
      },
      {
        title: "Metal Roll Warehouse API",
        date: "2026",
        sub: "Personal project · C# / ASP.NET Core / EF Core / PostgreSQL / Docker",
        bullets: [
          "Designed a 5-endpoint REST API with combined filters and 15 warehouse statistics; kept SQLite/PostgreSQL portable behind a repository abstraction.",
          "Covered CRUD, filtering, and statistics with 11 xUnit integration tests; containerized the API and database with Docker Compose.",
        ],
        result: "Containerized API with 11 xUnit integration tests.",
        tags: ["ASP.NET Core", "EF Core", "PostgreSQL", "Docker", "xUnit"],
        link: {
          label: "github.com/kent-afk/rolls-storage-cs",
          url: "https://github.com/kent-afk/rolls-storage-cs",
        },
      },
      {
        title: "Corporate Message Distribution System",
        date: "2026",
        sub: "Course project · C# / .NET 8 / xUnit",
        bullets: [
          ".NET 8 messaging system with topics, importance filters, archiving, and banned-word alerts.",
          "Applied Decorator, Strategy, Builder, and Composite under SOLID/GRASP; 20 xUnit tests.",
        ],
        result: "Modular architecture validated by 20 xUnit tests.",
        tags: [".NET 8", "SOLID", "GoF", "xUnit"],
        link: {
          label: "github.com/kent-afk/Corporate-Message-Distribution-System",
          url: "https://github.com/kent-afk/Corporate-Message-Distribution-System",
        },
      },
    ],
    education: {
      school: "ITMO University",
      degree: "B.S. in Software Engineering",
      location: "Saint Petersburg, Russia",
      date: "Expected June 2029",
      concentrations: "Backend & Cloud Engineering",
      coursework: [
        "Data Structures & Algorithms",
        "DBMS",
        "OOP",
        "Computer Organization",
        "Software Design",
      ],
    },
    skills: [
      {
        label: "Architecture",
        items: ["Clean Architecture", "Layered services", "SOLID", "GoF", "CQRS/MediatR", "Microservices"],
      },
      {
        label: "Data & SQL",
        items: ["SQL", "PostgreSQL", "SQLite", "Schema design", "Migrations", "Aggregate queries"],
      },
      { label: "Languages", items: ["C#", "Python", "C++", "C"] },
      {
        label: "Backend & APIs",
        items: ["ASP.NET Core", ".NET 8/9", "EF Core", "REST", "LINQ", "JWT", "BCrypt"],
      },
      {
        label: "Cloud & DevOps",
        items: ["Yandex Cloud", "Docker", "Docker Compose", "GitHub Actions", "Linux", "SSH"],
      },
      {
        label: "AI & Agents",
        items: ["MCP servers", "Agent skills", "AI agents", "Prompt/tool design", "OpenCode"],
      },
      {
        label: "Testing & Tools",
        items: ["xUnit", "pytest", "NSubstitute", "Git", "Swagger/OpenAPI"],
      },
    ],
    focus: ["Architecture", "Data & SQL", "PostgreSQL", "Docker", "AI Agents", "MCP", "Cloud"],
    labels: {
      home: "HOME",
      resume: "★ RESUME",
      headSub: "BACKEND · DATA · AI AGENTS",
      download: "↓ DOCX",
      print: "⎙ PRINT / PDF",
      langAria: "Resume language",
      summary: "Summary",
      projects: "Project Experience",
      education: "Education",
      contact: "Contact",
      stack: "Technical Stack",
      focus: "Focus",
      glance: "At a glance",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "Location",
      concentration: "Concentration",
      coursework: "Related coursework",
      source: "SOURCE",
      downloadDocx: "↓ DOWNLOAD DOCX",
      printSave: "⎙ PRINT / SAVE PDF",
      footerRole: "Backend · Data · AI",
      footerLocation: "Saint Petersburg · RU",
      graduation: "Expected graduation June 2029",
      degreeLine: "Backend & Cloud Engineering",
    },
  },
  ru: {
    name: "Александр Коренчук",
    kicker: "BACKEND · ДАННЫЕ · AI-АГЕНТЫ · РЕЗЮМЕ 2026",
    role: "Backend-разработчик (стажёр) · C# / .NET · архитектура и данные",
    stack: "CLEAN ARCHITECTURE · C# · ASP.NET CORE · POSTGRESQL · DOCKER · AI-АГЕНТЫ · MCP",
    tagline:
      "Проектирую слоистые backend-сервисы и модели данных, не привязанные к языку, и довожу их до результата — с AI-агентами, MCP-серверами и agent skills в рабочем процессе.",
    location: "Санкт-Петербург, Россия",
    availability: "Открыт к backend-стажировкам · готов к переезду",
    summary:
      "Студент ИТМО, специализируюсь на backend-разработке и облачных сервисах. Проектирую слоистые сервисы и модели данных, не привязанные к языку программирования, и довожу их до результата: API, схемы PostgreSQL, автотесты, Docker, CI и деплой в облако. Работаю на C#/ASP.NET Core и Python; использую AI-агентов, MCP-серверы и agent skills для ускорения разработки. Среди проектов — AI-ассистент в Yandex Cloud (65 тестов pytest), REST API для склада на PostgreSQL (11 интеграционных тестов xUnit) и identity-микросервис с JWT, MediatR и RabbitMQ. Ищу стажировку backend-разработчика, где смогу вести небольшие задачи и доводить их до продакшена.",
    projects: [
      {
        title: "Cloud Manager — identity-микросервис",
        date: "2026",
        sub: "Личный проект · C# / .NET 9 / ASP.NET Core / EF Core / PostgreSQL / RabbitMQ / MediatR",
        bullets: [
          "Спроектировал четырёхслойный identity-сервис (API, Application, Domain, Infrastructure) с MediatR, EF Core/PostgreSQL, JWT/BCrypt и доменными событиями RabbitMQ.",
          "Описал API в Swagger с Bearer-авторизацией; Docker Compose, интеграционные тесты и gateway — в работе.",
        ],
        tags: ["C#", ".NET 9", "MediatR", "PostgreSQL", "RabbitMQ", "JWT"],
        link: {
          label: "github.com/kent-afk/cloud-manager (в работе)",
          url: "https://github.com/kent-afk/cloud-manager",
        },
      },
      {
        title: "AI Telegram Assistant",
        date: "окт 2026",
        sub: "Учебный проект · Python / aiogram / PostgreSQL / Docker / Yandex Cloud",
        bullets: [
          "Развернул AI-ассистента на Python/PostgreSQL в Yandex Cloud: Docker Compose, fallback OpenRouter и защита промптов от инъекций; 65 тестов pytest в CI-матрице для трёх ОС.",
          "Спроектировал модель диалогов и асинхронную работу с БД; реализовал режимы обучения, перевода и конспектирования, настройки чатов.",
        ],
        tags: ["Python", "PostgreSQL", "Docker", "Yandex Cloud", "CI"],
        link: { label: "Приватный репозиторий — по запросу", url: "" },
      },
      {
        title: "Metal Roll Warehouse API",
        date: "2026",
        sub: "Личный проект · C# / ASP.NET Core / EF Core / PostgreSQL / Docker",
        bullets: [
          "Спроектировал REST API из 5 конечных точек с комбинированными фильтрами и 15 складскими показателями; SQLite/PostgreSQL переключаются через абстракцию репозитория.",
          "Покрыл CRUD, фильтрацию и статистику 11 интеграционными тестами xUnit; упаковал API и базу в Docker Compose.",
        ],
        tags: ["ASP.NET Core", "EF Core", "PostgreSQL", "Docker", "xUnit"],
        link: {
          label: "github.com/kent-afk/rolls-storage-cs",
          url: "https://github.com/kent-afk/rolls-storage-cs",
        },
      },
      {
        title: "Corporate Message Distribution System",
        date: "2026",
        sub: "Учебный проект · C# / .NET 8 / xUnit",
        bullets: [
          "Система обмена сообщениями на .NET 8: темы, фильтрация по важности, архивирование и уведомления о запрещённых словах.",
          "Применил Decorator, Strategy, Builder и Composite по SOLID/GRASP; 20 тестов xUnit.",
        ],
        tags: [".NET 8", "SOLID", "GoF", "xUnit"],
        link: {
          label: "github.com/kent-afk/Corporate-Message-Distribution-System",
          url: "https://github.com/kent-afk/Corporate-Message-Distribution-System",
        },
      },
    ],
    education: {
      school: "ITMO University",
      degree: "Бакалавр программной инженерии",
      location: "Санкт-Петербург, Россия",
      date: "Окончание: июнь 2029",
      concentrations: "Backend и облачная разработка",
      coursework: [
        "Алгоритмы и структуры данных",
        "Базы данных",
        "ООП",
        "Архитектура ЭВМ",
        "Проектирование ПО",
      ],
    },
    skills: [
      {
        label: "Архитектура",
        items: ["Clean Architecture", "Слоистые сервисы", "SOLID", "GoF", "CQRS/MediatR", "Микросервисы"],
      },
      {
        label: "Данные и SQL",
        items: ["SQL", "PostgreSQL", "SQLite", "Моделирование", "Миграции", "Агрегатные запросы"],
      },
      { label: "Языки", items: ["C#", "Python", "C++", "C"] },
      {
        label: "Backend и API",
        items: ["ASP.NET Core", ".NET 8/9", "EF Core", "REST", "LINQ", "JWT", "BCrypt"],
      },
      {
        label: "Cloud и DevOps",
        items: ["Yandex Cloud", "Docker", "Docker Compose", "GitHub Actions", "Linux", "SSH"],
      },
      {
        label: "AI и агенты",
        items: ["MCP-серверы", "Agent skills", "AI-агенты", "Промпты и инструменты", "OpenCode"],
      },
      {
        label: "Тестирование и инструменты",
        items: ["xUnit", "pytest", "NSubstitute", "Git", "Swagger/OpenAPI"],
      },
    ],
    focus: ["Архитектура", "Данные и SQL", "PostgreSQL", "Docker", "AI-агенты", "MCP", "Cloud"],
    labels: {
      home: "НАЗАД",
      resume: "★ РЕЗЮМЕ",
      headSub: "BACKEND · ДАННЫЕ · AI-АГЕНТЫ",
      download: "↓ DOCX",
      print: "⎙ ПЕЧАТЬ / PDF",
      langAria: "Язык резюме",
      summary: "О себе",
      projects: "Проекты",
      education: "Образование",
      contact: "Контакты",
      stack: "Технический стек",
      focus: "Ключевые направления",
      glance: "Кратко",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "Город",
      concentration: "Специализация",
      coursework: "Ключевые курсы",
      source: "ИСТОЧНИК",
      downloadDocx: "↓ СКАЧАТЬ DOCX",
      printSave: "⎙ ПЕЧАТЬ / PDF",
      footerRole: "Backend · Данные · AI",
      footerLocation: "Санкт-Петербург · RU",
      graduation: "Окончание: июнь 2029",
      degreeLine: "Backend и облачная разработка",
    },
  },
};

function sectionHead(label, num) {
  return `<h2 class="rs-h"><span class="rs-h-bar"></span><span>${esc(label)}</span><span class="rs-h-rule"></span><span class="rs-h-n">${esc(num)}</span></h2>`;
}

function renderProject(project) {
  const link = project.link
    ? project.link.url
      ? `<a href="${esc(project.link.url)}" target="_blank" rel="noopener noreferrer">${esc(project.link.label)} ↗</a>`
      : esc(project.link.label)
    : "";
  return `
    <article class="rs-job">
      <div class="rs-job-head">
        <h3>${esc(project.title)}</h3>
        <span class="rs-job-date">${esc(project.date)}</span>
      </div>
      <p class="rs-job-sub">${esc(project.sub)}</p>
      <ul>${project.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      <div class="rs-tags">${project.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      ${link ? `<p class="rs-job-link">${link}</p>` : ""}
    </article>`;
}

function getInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "ru") return saved;
  } catch {
    /* private mode */
  }
  return "en";
}

export default function resume(ctx) {
  const { root, navigate } = ctx;
  let lang = getInitialLang();

  const el = document.createElement("div");
  el.className = "rs-root";
  root.appendChild(el);

  function render() {
    const data = RESUME[lang];
    const t = data.labels;
    const docx = DOCX[lang];
    const docxName = DOCX_NAME[lang];

    const projects = data.projects.map(renderProject).join("");

    const skillGroups = data.skills.map((group) => `
      <div class="rs-skill-group">
        <span class="rs-skill-label">${esc(group.label)}</span>
        <div class="rs-skill">${group.items.map((item) => `<span>${esc(item)}</span>`).join("")}</div>
      </div>`).join("");

    const focus = data.focus.map((item) => `<span>${esc(item)}</span>`).join("");
    const coursework = data.education.coursework.map((item) => `<span>${esc(item)}</span>`).join("");
    const nameParts = data.name.split(" ");
    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(" ");

    el.innerHTML = `
      <header class="rs-head">
        <button class="rs-back" type="button" data-back data-hover="true">${esc(t.home)}</button>
        <div class="rs-head-c">
          <span class="rs-head-lbl">${esc(t.resume)}</span>
          <span class="rs-head-sub">${esc(t.headSub)}</span>
        </div>
        <div class="rs-head-actions">
          <div class="rs-lang-switch" role="group" aria-label="${esc(t.langAria)}">
            <button class="rs-lang-btn${lang === "en" ? " is-active" : ""}" type="button" data-lang="en" aria-pressed="${lang === "en"}" data-hover="true">EN</button>
            <button class="rs-lang-btn${lang === "ru" ? " is-active" : ""}" type="button" data-lang="ru" aria-pressed="${lang === "ru"}" data-hover="true">RU</button>
          </div>
          <a class="rs-head-act" href="${docx}" download="${docxName}" data-hover="true">${esc(t.download)}</a>
          <button class="rs-head-act rs-print" type="button" data-print data-hover="true">${esc(t.print)}</button>
        </div>
      </header>

      <div class="rs-scroll">
        <article class="rs-sheet" aria-label="${esc(t.resume)} — ${esc(data.name)}">
          <div class="rs-banner">
            <div class="rs-banner-main">
              <span class="rs-kicker">${esc(data.kicker)}</span>
              <h1 class="rs-name">${esc(firstName)} <em>${esc(lastName)}</em></h1>
              <p class="rs-role">${esc(data.role)}</p>
              <p class="rs-stack">${esc(data.stack)}</p>
              <p class="rs-tagline">${esc(data.tagline)}</p>
              <p class="rs-status"><span class="rs-status-dot"></span>${esc(data.availability)}</p>
            </div>
            <pre class="rs-ascii" aria-hidden="true">${ASCII_MARK}</pre>
            <span class="rs-banner-mark" aria-hidden="true">AK</span>
          </div>

          <div class="rs-body">
            <main class="rs-main">
              <section class="rs-sec">
                ${sectionHead(t.summary, "01")}
                <p class="rs-summary">${esc(data.summary)}</p>
              </section>

              <section class="rs-sec">
                ${sectionHead(t.projects, "02")}
                <div class="rs-jobs">${projects}</div>
              </section>

              <section class="rs-sec">
                ${sectionHead(t.education, "03")}
                <div class="rs-edu">
                  <div>
                    <h3>${esc(data.education.school)}</h3>
                    <p class="rs-edu-degree">${esc(data.education.degree)} · ${esc(data.education.location)}</p>
                  </div>
                  <span class="rs-edu-date">${esc(data.education.date)}</span>
                </div>
                <p class="rs-edu-note"><strong>${esc(t.concentration)}:</strong> ${esc(data.education.concentrations)}</p>
                <p class="rs-edu-note"><strong>${esc(t.coursework)}:</strong></p>
                <div class="rs-course">${coursework}</div>
              </section>
            </main>

            <aside class="rs-side">
              <section class="rs-side-card">
                <h2 class="rs-side-title">${esc(t.contact)}</h2>
                <div class="rs-contact">
                  <a href="mailto:${EMAIL}"><span>${esc(t.email)}</span><span>${esc(EMAIL)}</span></a>
                  <a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer"><span>${esc(t.linkedin)}</span><span>in/alexander-k-93a1353bb ↗</span></a>
                  <a href="${GITHUB}" target="_blank" rel="noopener noreferrer"><span>${esc(t.github)}</span><span>@kent-afk ↗</span></a>
                  <span class="rs-contact-row"><span>${esc(t.location)}</span><span>${esc(data.location)}</span></span>
                </div>
                <p class="rs-side-note">★ ${esc(data.availability)}</p>
              </section>

              <section class="rs-side-card">
                <h2 class="rs-side-title">${esc(t.stack)}</h2>
                ${skillGroups}
              </section>

              <section class="rs-side-card rs-side-card--focus">
                <h2 class="rs-side-title">${esc(t.focus)}</h2>
                <div class="rs-focus">${focus}</div>
              </section>

              <section class="rs-side-card rs-side-card--note">
                <h2 class="rs-side-title">${esc(t.glance)}</h2>
                <p>${esc(data.education.school)} · ${esc(data.education.degree)}<br>${esc(t.graduation)}<br>${esc(t.degreeLine)}</p>
              </section>
            </aside>
          </div>

          <footer class="rs-sheet-foot">
            <span>${esc(data.name)} · ${esc(t.footerRole)}</span>
            <span>${esc(t.footerLocation)}</span>
            <span>${esc(EMAIL)}</span>
          </footer>
        </article>

        <div class="rs-page-foot">
          <span>${esc(t.source)} · ${esc(docxName)}</span>
          <div class="rs-page-actions">
            <a href="${docx}" download="${docxName}" data-hover="true">${esc(t.downloadDocx)}</a>
            <button type="button" data-print data-hover="true">${esc(t.printSave)}</button>
          </div>
        </div>
      </div>`;

    document.documentElement.lang = lang;
    document.title = lang === "ru"
      ? "Резюме · Александр Коренчук"
      : "Resume · Alexander Korenchuk";
  }

  el.addEventListener("click", (event) => {
    const langBtn = event.target.closest("[data-lang]");
    if (langBtn) {
      const next = langBtn.dataset.lang;
      if (next === "en" || next === "ru") {
        if (next !== lang) {
          lang = next;
          try {
            localStorage.setItem(LANG_KEY, lang);
          } catch {
            /* private mode */
          }
          sound.play("tick");
          render();
          el.querySelector(`.rs-lang-btn[data-lang="${lang}"]`)?.focus();
        }
      }
      return;
    }

    const back = event.target.closest("[data-back]");
    if (back) {
      sound.play("back");
      navigate("/");
      return;
    }

    const print = event.target.closest("[data-print]");
    if (print) {
      sound.play("confirm");
      window.print();
    }
  });

  function onKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      sound.play("back");
      navigate("/");
      return;
    }
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    if (event.target.closest("input, textarea, select, [contenteditable='true']")) return;
    const scroll = el.querySelector(".rs-scroll");
    if (!scroll) return;
    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroll.scrollBy({ top: event.key === "ArrowDown" ? 140 : -140, behavior: reduced ? "auto" : "smooth" });
  }
  document.addEventListener("keydown", onKeydown);

  render();
  sound.soundtrackEnter();

  return () => {
    document.removeEventListener("keydown", onKeydown);
    document.documentElement.lang = "en";
  };
}
