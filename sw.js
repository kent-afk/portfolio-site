// Offline-first cache for the static portfolio. Bump CACHE_VERSION when
// replacing cache-first assets (images) so returning visitors get them.

const CACHE_VERSION = "ak-portfolio-v2026-11-20-19";
const CORE = [
  "./",
  "./index.html",
  "./css/fonts.css",
  "./css/base.css",
  "./css/intro.css",
  "./css/home.css",
  "./css/projects.css",
  "./css/resume.css",
  "./css/about.css",
  "./js/app.js",
  "./js/router.js",
  "./js/transitions.js",
  "./js/sound.js",
  "./js/cursor.js",
  "./js/audio-toggle.js",
  "./js/ui.js",
  "./js/pages/home.js",
  "./js/pages/projects.js",
  "./js/pages/resume.js", 
  "./js/pages/about.js",
  "./assets/file.webp",
  "./assets/favicon.svg",
  "./data/projects.json",
];

const scopeUrl = (path) => new URL(path, self.registration.scope).toString();

async function cachePut(cache, request, response) {
  try {
    await cache.put(request, response.clone());
  } catch {
    /* caching is best effort; do not fail the live response */
  }
}

async function precache(cache, path) {
  const url = scopeUrl(path);
  // The HTTP cache can still hold the previous deploy; force the network so a
  // CACHE_VERSION bump actually refreshes the shell.
  const response = await fetch(url, { cache: "reload" });
  if (response.ok) await cache.put(url, response);
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await Promise.allSettled(CORE.map((path) => precache(cache, path)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((name) => name.startsWith("ak-portfolio-") && name !== CACHE_VERSION)
        .map((name) => caches.delete(name))
    );
    await self.clients.claim();
    /* Do not navigate clients here. On the first install this reloads the
     page the visitor just opened; later updates are handled by the page's controllerchange listener.*/
  })());
});

async function networkFirst(request, fallbackPath) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    // Revalidate with the server; the HTTP cache alone can serve a stale JS
    // file for the rest of its max-age.
    const response = await fetch(request, { cache: "no-cache" });
    if (response.ok) await cachePut(cache, request, response);
    return response;
  } catch {
    // Page modules and stylesheets carry ?v=; fall back to the precached
    // unversioned copy when the network is unavailable.
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    if (fallbackPath) {
      const fallback = await cache.match(scopeUrl(fallbackPath));
      if (fallback) return fallback;
    }
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request, { cache: "reload" });
  if (response.ok) await cachePut(cache, request, response);
  return response;
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  const update = fetch(request)
    .then(async (response) => {
      if (response.ok) await cachePut(cache, request, response);
      return response;
    })
    .catch(() => null);
  if (cached) {
    event.waitUntil(update);
    return cached;
  }
  const response = await update;
  return response || Response.error();
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "./index.html"));
    return;
  }

  if (url.pathname.endsWith("/data/projects.json") || url.pathname.endsWith(".docx")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.pathname.endsWith(".js") || url.pathname.endsWith(".css")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Audio arrives as 206 range responses, which the Cache API cannot store;
  // leave it to the browser HTTP cache.
  if (["image", "font"].includes(request.destination)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, event));
});
