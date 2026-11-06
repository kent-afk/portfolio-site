import { playTransition } from "./transitions.js";
import { sound } from "./sound.js";

// Hash based SPA router. Each route lazy-loads a page module, swaps the
// per-page stylesheet and plays the matching transition wipe.

// Bump when a page stylesheet or module changes: the browser and the service
// worker key assets by URL, so the query is what makes the new file load
// without a hard reload.
const ASSET_VERSION = "2026-11-05-28";
const versioned = (href) => (href.includes("?") ? href : `${href}?v=${ASSET_VERSION}`);
const page = (name) => import(`./pages/${name}.js?v=${ASSET_VERSION}`);

const ROUTES = [
  { path: "/", variant: "home", title: "Alexander Korenchuk · Backend Engineer", css: "css/home.css", load: () => page("home") },
  { path: "/projects", variant: "slash", title: "Projects · Alexander Korenchuk", css: "css/projects.css", load: () => page("projects") },
  { path: "/resume", variant: "vertical", title: "Resume · Alexander Korenchuk", css: "css/resume.css", load: () => page("resume") },
  { path: "/about", variant: "about", title: "About · Alexander Korenchuk", css: "css/about.css", load: () => page("about") },
];

const FIXED_CSS = ["css/base.css"];
let currentCss = null;
let current = null;
let renderSeq = 0;
let rootEl = null;

function currentPath() {
  const hash = window.location.hash.replace(/^#/, "");
  return hash || "/";
}

function resolve(path) {
  return ROUTES.find((r) => r.path === path) || null;
}

function setCss(href) {
  if (currentCss === href) return;
  document.querySelectorAll("link[data-page-css]").forEach((l) => l.remove());
  if (href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = versioned(href);
    link.dataset.pageCss = "1";
    document.head.appendChild(link);
  }
  currentCss = href;
}

export function navigate(path) {
  const target = "#" + path;
  if (window.location.hash === target) {
    render(path);
  } else {
    window.location.hash = target;
  }
}

async function render(path) {
  let route = resolve(path);
  if (!route) {
    navigate("/");
    return;
  }

  const runId = ++renderSeq;

  if (current && current.cleanup) {
    try { current.cleanup(); } catch (e) { /* noop */ }
  }

  setCss(route.css);
  document.title = route.title;
  rootEl.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.style.cssText = "position:relative;width:100%;height:100%;opacity:0;transition:opacity .2s linear";
  rootEl.appendChild(wrap);

  current = { route, cleanup: null };

  playTransition(route.variant);

  try {
    const mod = await route.load();
    if (runId !== renderSeq || resolve(currentPath()) !== route) return; // superseded mid-load
    const ctx = {
      root: wrap,
      navigate,
      back: () => navigate("/"),
      sound,
    };
    const cleanup = mod.default(ctx);
    if (runId !== renderSeq) {
      if (typeof cleanup === "function") {
        try { cleanup(); } catch (e) { /* noop */ }
      }
      return;
    }
    current.cleanup = typeof cleanup === "function" ? cleanup : null;
  } catch (error) {
    if (runId !== renderSeq || resolve(currentPath()) !== route) return;
    renderRouteError(wrap);
    console.error("Could not render route", route.path, error);
  }

  if (runId === renderSeq) requestAnimationFrame(() => { wrap.style.opacity = "1"; });
}

function renderRouteError(wrap) {
  wrap.innerHTML = `
    <main style="height:100%;display:grid;place-items:center;padding:24px;background:#080806;color:#f4f1ea;text-align:center">
      <div style="max-width:520px;border-top:3px solid #ff5500;padding:28px;background:#100e0b;box-shadow:10px 10px 0 rgba(255,85,0,.25)">
        <p style="font:700 9px/1.5 'IBM Plex Mono',monospace;letter-spacing:.2em;color:#ff5500;text-transform:uppercase">SYSTEM ERROR</p>
        <h1 style="margin:12px 0;font:900 italic clamp(32px,7vw,64px)/.9 'Roboto Condensed',sans-serif;text-transform:uppercase">Page <em style="color:#ff5500">unavailable</em></h1>
        <p style="font:16px/1.6 'Roboto Condensed',sans-serif;color:#f4f1eab3">This page could not be loaded. Return to the main menu and try again.</p>
        <button type="button" data-route-home style="margin-top:22px;padding:10px 16px;border:1px solid #ff5500;background:#ff5500;color:#080806;font:700 9px 'IBM Plex Mono',monospace;letter-spacing:.15em;text-transform:uppercase;cursor:pointer">BACK HOME</button>
      </div>
    </main>`;
  wrap.querySelector("[data-route-home]").addEventListener("click", () => navigate("/"));
}

export function startRouter(mountEl) {
  rootEl = mountEl;
  FIXED_CSS.forEach((href) => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  });

  window.addEventListener("hashchange", () => render(currentPath()));
  render(currentPath());
}

export default startRouter;
