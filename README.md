# Alexander Korenchuk — Persona-style portfolio

A hash-routed single-page portfolio built with vanilla HTML, CSS and JavaScript.
The visual language is Persona 5-inspired: skewed panels, hard offset shadows,
halftone textures, mono HUD readouts and sound effects.

The site is meant to be hosted on **GitHub Pages**. All pages are static; the
project deck is published from a single JSON file in the repository.

## Run locally

ES modules need an HTTP server (opening `index.html` directly will not load the JS):

```bash
cd Persona_site_analog
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Routes

| Route | Page |
| --- | --- |
| `#/` | Main menu |
| `#/projects` | Project deck (read-only, synced from `data/projects.json`) |
| `#/resume` | Web resume + print / PDF + DOCX download |
| `#/about` | About Me sections |

Hash-based routing means the site works as-is on GitHub Pages under a
repository subpath (e.g. `/portfolio-site/`) with no base-path config.

## Projects — add your own

Projects are **published from the repository only**. There is no editor, no
admin mode and no browser storage: the deck is a read-only view of
`data/projects.json`. To add a project, edit that file and commit it — the
site rebuilds the deck on the next visit.

### Schema

`data/projects.json` is an array of project objects:

```json
[
  {
    "id": "metal-roll-api",
    "title": "Metal Roll Warehouse API",
    "desc": "3-layer clean architecture REST API with 5 endpoints, 13 statistical metrics, Swagger documentation and Docker-based persistence.",
    "lang": "C#",
    "period": "Nov 2025 – Dec 2025",
    "url": "https://example.com/live",
    "repo": "https://github.com/kent-afk/metal-roll-api",
    "image": "assets/projects/metal-roll.webp",
    "tags": ["ASP.NET Core", "PostgreSQL", "Docker"],
    "featured": true
  }
]
```

| Field | Required | Meaning |
| --- | --- | --- |
| `title` | yes | Card title |
| `desc` | no | Short description shown on the card |
| `lang` | no | Stack label badge (e.g. `C#`, `Go`); also picks the dot colour |
| `period` | no | Small date line, e.g. `Nov 2025 – Dec 2025` |
| `url` | no | Live project URL — becomes the OPEN ↗ link |
| `repo` | no | Repository URL — shown as REPO ↗ and used as fallback OPEN link |
| `image` | no | Cover image path, URL or data URI |
| `tags` | no | Array of short tags |
| `featured` | no | `true` pins the card to the red ★ FEATURED section |
| `id` | no | Stable identifier; auto-derived from the position if omitted |

Notes:

- Order matters: cards appear in array order (featured first, then the rest).
- Cover images live in the repo, e.g. `assets/projects/cover.webp`. The image
  is hidden automatically if it fails to load.
- The file must be valid JSON: no trailing commas, no comments. If it is
  broken, the page shows a SYNC ERROR state with a link to the file.

### Workflow A — edit on GitHub (no terminal)

1. Open the repo → `data/projects.json`.
2. Click the pencil (Edit), paste a new object into the array, Commit.
3. Wait a minute or two for Pages to publish, then hard-reload (`Ctrl+Shift+R`).

### Workflow B — local git

```bash
# add the cover image (if any)
git add assets/projects/cover.webp
# add the project entry to data/projects.json, then:
git add data/projects.json
git commit -m "Add project: My Project"
git push
```

## Background image

The main-menu background is set by `const BG` at the top of
`js/pages/home.js`. Point it at any committed file in `assets/` (for example
`assets/file.svg`) and push — Pages only serves committed content.

## Resume

`#/resume` is the web version of `BackendSoftwareEngineer_Resume.docx`.

- Edit the `RESUME` object at the top of `js/pages/resume.js` to update content.
- `assets/BackendSoftwareEngineer_Resume.docx` is the downloadable source file.
- **PRINT / PDF** opens the browser print dialog with a print stylesheet that
  hides the site chrome and keeps the resume sheet.

## Structure

```text
index.html
data/
  projects.json     project deck source of truth (edit to publish projects)
css/
  base.css          global tokens, cursor, scanlines
  backbtn.css       shared back button
  home.css          main menu
  projects.css      read-only project deck
  resume.css        resume + print styles
  about.css         about section bars
js/
  app.js            boot
  router.js         hash router
  sound.js          synthesized UI SFX + soundtrack
  transitions.js    page wipes
  cursor.js         custom cursor
  audio-toggle.js   mute button
  ui.js             small shared helpers
  pages/
    home.js
    projects.js     fetches data/projects.json and renders cards
    resume.js
    about.js
assets/             artwork, audio, project covers and the downloadable resume
```
