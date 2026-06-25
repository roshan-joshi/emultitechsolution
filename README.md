# E Multitech Solution — Company Website

Marketing and case-study website for **E Multitech Solution**, a custom software,
SaaS, AI, and mobile development partner. The site is plain **static HTML/CSS/JS**
with a small Node-based build pipeline that handles SEO, structured data, image
optimization, favicons, and crawler/AI discovery files.

No framework, no server, no database — every page is a self-contained `.html` file
that can be deployed to any static host (Netlify, Vercel, GitHub Pages, S3 + CDN,
nginx, etc.).

---

## Quick start

```bash
# 1. Install build/tooling dependencies (only sharp)
npm install

# 2. Serve the site locally
npx serve -l 4178 .
#    → http://localhost:4178
```

That's enough to view the site — the HTML is already built and committed.
You only need the build steps below when you change templates, SEO config, or images.

---

## Project layout

```
.
├── *.html                    # All public pages (one file per route)
├── css/
│   ├── style.css             # Base/legacy styles
│   ├── theme.css             # Modern theme layer (loaded after style.css)
│   └── aos.css               # Scroll-animation library styles
├── js/
│   ├── header.js             # Canonical site header — single source of truth
│   ├── footer.js             # Canonical site footer — single source of truth
│   ├── script.js             # Nav toggle + small UI behaviors
│   ├── reveal.js             # Lightweight scroll-reveal
│   └── aos.js                # Animate-on-scroll library
├── images/                   # All media (png/jpg + generated .webp siblings)
├── tools/                    # Build & audit scripts (NOT deployed — see robots.txt)
│   └── pages.config.mjs      # Per-page SEO/metadata source of truth
├── sitemap.xml · robots.txt · llms.txt   # Generated discovery files
├── site.webmanifest          # PWA manifest
└── package.json
```

### Pages

Each route is a standalone HTML file: service pages (`custom-software-development.html`,
`saas-development.html`, `ai-powered-solutions.html`, `mobile-development.html`, …),
industry pages (`healthcare.html`, `realestate.html`, `industries.html`),
auction-product pages, case studies (`*-case-study.html`), and the usual
`index.html`, `about.html`, `contact.html`, `request_quote.html`, plus legal pages.

> `index-orbital.html` is an in-repo **design concept preview** — it's marked
> `noindex,nofollow`, is not linked from any page or the sitemap, and is excluded
> from the build/audit. It is not part of the deployed site.

---

## Build pipeline

The site ships pre-built, but content/template changes are applied by running the
build. Run everything with:

```bash
npm run build
```

This runs the steps below in order. Each is also runnable on its own
(`npm run build:<step>`):

| Step | Script | What it does |
|------|--------|--------------|
| `build:favicons` | `tools/build-favicons.mjs` | Generates the full favicon set from `images/icon-master.svg`. |
| `build:og` | `tools/build-og.mjs` | Builds the branded 1200×630 OpenGraph card (`images/og-default.png`). |
| `build:hero-poster` | `tools/build-hero-poster.mjs` | Renders the hero video poster (`images/hero-poster.jpg`). |
| `build:images` | `tools/build-images.mjs` | Creates a `.webp` sibling for every `.png/.jpg` and writes `images/_dimensions.json`. |
| `build:pages` | `tools/build-pages.mjs` | **Bakes** the header/footer (from `js/header.js` / `js/footer.js`) into every page so non-JS crawlers see full nav + links. |
| `build:head` | `tools/build-head.mjs` | Normalizes every `<head>` (Inter font, `theme.css` order, `reveal.js`). |
| `build:imgs` | `tools/build-imgs.mjs` | Adds `width`/`height` (no layout shift) and wraps `<img>` in `<picture>` + WebP `<source>`. |
| `build:seo` | `tools/build-seo.mjs` | Injects per-page `<title>`, meta description, canonical, OG/Twitter tags, and JSON-LD — driven by `tools/pages.config.mjs`. |
| `build:discovery` | `tools/build-discovery.mjs` | Regenerates `sitemap.xml`, `robots.txt`, and `llms.txt`. |

### Editing rules (important)

- **Header / footer:** edit `js/header.js` or `js/footer.js`, then run
  `npm run build:pages`. They are the single source of truth; the baked-in copies
  between `<!-- HEADER:START -->` / `<!-- FOOTER:START -->` markers are generated.
- **SEO / page metadata:** edit `tools/pages.config.mjs`, then run
  `npm run build:seo` (and `build:discovery` if you added/removed a page).
- **Images:** drop a `.png/.jpg` in `images/`, then run `npm run build:images`
  followed by `npm run build:imgs`. WebP siblings and `<picture>` wrappers are
  generated automatically — reference the `.png/.jpg` name in your HTML.

The build steps are idempotent and use HTML comment markers, so re-running them is safe.

---

## Pre-launch audit

A read-only technical audit checks every deployed page for the things that break
SEO or link previews — missing/oversized `<title>`, meta descriptions, canonicals,
exactly one `<h1>`, baked header/footer, and missing image assets:

```bash
node tools/_prelaunch-audit.mjs
```

A clean run reports `0 issues`. Run it before every deploy.

---

## Deployment

The repository root **is** the deployable artifact. Point any static host at it:

- **Publish directory:** `.` (repo root)
- **Build command:** `npm run build` (optional — only needed if templates/SEO/images changed)
- **Do not deploy:** `tools/`, `node_modules/` (the former is also `Disallow`-ed in `robots.txt`).

After deploying, verify `https://<domain>/sitemap.xml`, `/robots.txt`, and
`/llms.txt` resolve, and that OpenGraph previews render (e.g. via the
[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)).

---

## Requirements

- **Node.js ≥ 18** (developed on Node 22)
- **`sharp`** — the only dependency, installed via `npm install`, used by the image/favicon/OG build steps.
