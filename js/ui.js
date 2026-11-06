// Small shared helpers used by the detail pages.

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

export function safeUrl(value, { image = false } = {}) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  if (image && /^data:image\//i.test(raw)) return raw;
  if (/^(https?:\/\/|mailto:)/i.test(raw)) return raw;
  if (/^#\//.test(raw)) return raw;
  if (/^(\/|\.{1,2}\/|assets\/)/.test(raw)) return raw;
  if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(raw)) return `https://${raw}`;
  return "";
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
    private: Boolean(p.private),
    image: String(p.image || "").trim(),
    tags: tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 10),
    featured: Boolean(p.featured),
  };
}

export function parseDeck(raw) {
  const parsed = JSON.parse(raw);
  const list = Array.isArray(parsed) ? parsed : parsed && parsed.projects;
  if (!Array.isArray(list)) throw new Error("invalid shape");
  return list
    .map(normalizeProject)
    .filter((p) => p.title);
}
