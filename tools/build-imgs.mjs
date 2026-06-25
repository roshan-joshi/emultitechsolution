#!/usr/bin/env node
/**
 * build-imgs.mjs
 *
 * Walks every root-level *.html and modernizes each <img src="images/foo.png">
 * tag by:
 *
 *   1. Adding width and height attributes from images/_dimensions.json
 *      (only if missing) — kills cumulative layout shift.
 *   2. Wrapping the tag in <picture><source srcset="…webp" type="image/webp">…</picture>
 *      so WebP-capable browsers (96%+ globally) get the smaller file while
 *      legacy browsers still fall back to the PNG/JPG.
 *   3. Adding loading="lazy" + decoding="async" on every img EXCEPT those that
 *      are very likely above the fold (the brand logo and explicit hero
 *      images), since lazy on LCP images hurts perceived performance.
 *
 * Idempotent. Tags already wrapped in <picture data-built> are skipped.
 *
 *     node tools/build-imgs.mjs
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['index_1.html']);

// Filenames that should NOT get loading="lazy" because they're above the fold:
//  - the brand logo in the header (logo.png)
//  - any image with /hero/ in path or "hero" in basename
//  - the about-section main image is typically below fold so it gets lazy
const NEVER_LAZY_FILES = new Set([
  'logo.png',
  'footer-logo.png', // would be below fold but cheap and we already preserve the request
]);

function isHeroish(filename) {
  return /hero/i.test(filename);
}

// Load dimensions map.
const dimensions = JSON.parse(
  await readFile(join(ROOT, 'images', '_dimensions.json'), 'utf8'),
);

// Match a single <img …> tag (not self-closing-aware about voids — fine since img is void).
// We only operate on img tags whose src points into images/. The leading
// "./" is optional — some pages were authored with "./images/foo.png".
const IMG_RE =
  /<img\b([^>]*?)\bsrc\s*=\s*(["'])(\.\/)?(images\/[^"']+?)\2([^>]*?)\/?>/gi;

function getAttr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return m ? m[2] : null;
}

function hasAttr(tag, name) {
  return new RegExp(`\\b${name}\\s*=`, 'i').test(tag);
}

function processHtml(html, file) {
  // First pass: ensure idempotency — if an <img> sits inside <picture data-built>,
  // skip it (the regex would otherwise re-wrap it).
  // Approach: find all <picture data-built>…</picture> ranges and remember them.
  const builtRanges = [];
  const builtRe = /<picture\b[^>]*\bdata-built\b[^>]*>[\s\S]*?<\/picture>/gi;
  for (let m; (m = builtRe.exec(html)); ) {
    builtRanges.push([m.index, m.index + m[0].length]);
  }
  const inBuiltRange = (pos) =>
    builtRanges.some(([a, b]) => pos >= a && pos < b);

  let changed = 0;
  const result = html.replace(IMG_RE, (match, before, _q, dotSlash, srcPath, after, offset) => {
    if (inBuiltRange(offset)) return match;

    // Normalise "./images/foo.png" -> "images/foo.png" in the output so we get
    // consistent paths everywhere; both forms resolve identically.
    const src = srcPath; // already "images/foo.png" without leading ./
    const filename = src.replace(/^images\//, '').split('?')[0].split('#')[0];
    const dim = dimensions[filename];
    const hasWebp = dim?.webp;

    // Build the inner <img>, adding width/height/loading if missing.
    let imgAttrs = `${before} src="${src}"${after}`.replace(/\s+/g, ' ').trim();

    // strip any leading/trailing spaces inside the placeholder
    if (dim?.w && !hasAttr(imgAttrs, 'width')) imgAttrs += ` width="${dim.w}"`;
    if (dim?.h && !hasAttr(imgAttrs, 'height')) imgAttrs += ` height="${dim.h}"`;

    const shouldLazy =
      !NEVER_LAZY_FILES.has(filename) && !isHeroish(filename);
    // Strip any pre-existing loading= so our policy below is authoritative.
    imgAttrs = imgAttrs.replace(/\s*\bloading\s*=\s*(["'])[\s\S]*?\1/gi, '');
    if (shouldLazy) imgAttrs += ` loading="lazy"`;
    if (!hasAttr(imgAttrs, 'decoding')) imgAttrs += ` decoding="async"`;

    const newImg = `<img ${imgAttrs}>`.replace(/\s+/g, ' ').replace(' >', '>');

    if (!hasWebp) {
      // No webp available — just return the upgraded <img>.
      changed++;
      return newImg;
    }

    const webpSrc = src.replace(/\.(png|jpe?g)(?=$|[?#])/i, '.webp');
    changed++;
    return `<picture data-built><source srcset="${webpSrc}" type="image/webp">${newImg}</picture>`;
  });

  return { html: result, changed };
}

const entries = await readdir(ROOT, { withFileTypes: true });
const htmlFiles = entries
  .filter((e) => e.isFile() && e.name.endsWith('.html') && !SKIP.has(e.name))
  .map((e) => e.name)
  .sort();

let touched = 0;
let totalTagsChanged = 0;

for (const file of htmlFiles) {
  const path = join(ROOT, file);
  const original = await readFile(path, 'utf8');
  const { html, changed } = processHtml(original, file);
  totalTagsChanged += changed;
  if (html !== original) {
    await writeFile(path, html, 'utf8');
    touched++;
  }
}

console.log(
  `build-imgs: touched ${touched}/${htmlFiles.length} pages, wrapped/upgraded ${totalTagsChanged} <img> tags`,
);
