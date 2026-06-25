#!/usr/bin/env node
/**
 * _prelaunch-audit.mjs — comprehensive pre-launch TECHNICAL audit.
 * Read-only. Scans every root-level *.html page and reports real issues.
 * Not part of the production build.
 *
 *     node tools/_prelaunch-audit.mjs
 */
import { readFile, readdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// Non-production pages: design experiments / concept previews kept in-repo but
// never deployed (orphaned, not in sitemap, marked noindex). Excluded from audit.
const SKIP = new Set(['index_1.html', 'index-orbital.html']);

const exists = async (p) => { try { await access(join(ROOT, p)); return true; } catch { return false; } };

const entries = await readdir(ROOT, { withFileTypes: true });
const htmlFiles = entries
  .filter((e) => e.isFile() && e.name.endsWith('.html') && !SKIP.has(e.name))
  .map((e) => e.name).sort();

// Build a set of all root html files for link resolution
const htmlSet = new Set(htmlFiles);

const issues = [];           // {file, type, detail}
const add = (file, type, detail) => issues.push({ file, type, detail });

// Known acceptable placeholder-ish patterns (phone format examples)
const PHONE_OK = [/98XXXXXXXX/i, /4xx xxx xxx/i];

for (const file of htmlFiles) {
  const html = await readFile(join(ROOT, file), 'utf8');

  // 1. Exactly one <h1>
  const h1s = html.match(/<h1[\s>]/gi) || [];
  if (h1s.length === 0) add(file, 'h1', 'no <h1>');
  else if (h1s.length > 1) add(file, 'h1', `${h1s.length} <h1> elements`);

  // 2. <title>
  const titleM = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleM || !titleM[1].trim()) add(file, 'title', 'missing/empty <title>');
  else if (titleM[1].trim().length > 65) add(file, 'title', `title ${titleM[1].trim().length} chars (>65)`);

  // 3. meta description
  const md = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (!md || !md[1].trim()) add(file, 'meta', 'missing/empty meta description');
  else {
    const len = md[1].trim().length;
    if (len > 160) add(file, 'meta', `description ${len} chars (>160)`);
    if (len < 50) add(file, 'meta', `description ${len} chars (<50)`);
  }

  // 4. canonical
  if (!/<link\s+rel=["']canonical["']/i.test(html)) add(file, 'canonical', 'no canonical link');

  // 5. Header/Footer build markers present
  if (!/<!--\s*HEADER:START/i.test(html)) add(file, 'build', 'missing HEADER:START marker (header not baked)');
  if (!/<!--\s*FOOTER:START/i.test(html)) add(file, 'build', 'missing FOOTER:START marker (footer not baked)');

  // 6. Internal .html links resolve
  const hrefRe = /href=["']([^"'#?][^"']*\.html)(#[^"']*)?["']/gi;
  let m;
  const seenLinks = new Set();
  while ((m = hrefRe.exec(html)) !== null) {
    const target = m[1];
    if (/^https?:|^mailto:|^tel:|^\/\//i.test(target)) continue;
    if (seenLinks.has(target)) continue;
    seenLinks.add(target);
    if (!htmlSet.has(target) && !(await exists(target))) {
      add(file, 'deadlink', `-> ${target}`);
    }
  }

  // 7. Image/asset files exist (img src, source srcset, video poster/source, og:image relative)
  const assetRefs = new Set();
  // img src
  for (const mm of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) assetRefs.add(mm[1]);
  // source srcset (may have multiple comma-separated with widths)
  for (const mm of html.matchAll(/srcset=["']([^"']+)["']/gi)) {
    mm[1].split(',').forEach((part) => { const u = part.trim().split(/\s+/)[0]; if (u) assetRefs.add(u); });
  }
  // video poster + source src
  for (const mm of html.matchAll(/poster=["']([^"']+)["']/gi)) assetRefs.add(mm[1]);
  for (const mm of html.matchAll(/<source[^>]+src=["']([^"']+)["']/gi)) assetRefs.add(mm[1]);

  for (const ref of assetRefs) {
    if (/^https?:|^data:|^\/\//i.test(ref)) continue;
    const clean = ref.split('?')[0];
    if (!(await exists(clean))) add(file, 'missing-asset', `-> ${ref}`);
  }

  // 8. JSON-LD parse
  for (const mm of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(mm[1].trim()); }
    catch (e) { add(file, 'json-ld', `parse error: ${e.message.slice(0, 60)}`); }
  }

  // 9. Placeholders
  const lower = html.toLowerCase();
  for (const token of ['lorem ipsum', 'todo', '[country]', 'tbd', 'foobar', 'placeholder text', 'undefined<', '[object object]']) {
    if (lower.includes(token)) add(file, 'placeholder', `contains "${token}"`);
  }
  // bare XXX not part of an accepted phone pattern
  for (const mm of html.matchAll(/\b[X]{3,}\b/g)) {
    const ctx = html.slice(Math.max(0, mm.index - 20), mm.index + 20);
    if (!PHONE_OK.some((re) => re.test(ctx))) add(file, 'placeholder', `bare "${mm[0]}" near: ${ctx.replace(/\s+/g, ' ').trim()}`);
  }

  // 10. data-built pictures: each <picture data-built> should have a webp <source> + <img> fallback
  for (const mm of html.matchAll(/<picture[^>]*data-built[^>]*>([\s\S]*?)<\/picture>/gi)) {
    const inner = mm[1];
    if (!/<img[\s>]/i.test(inner)) add(file, 'picture', 'data-built <picture> with no <img> fallback');
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
const byType = {};
for (const i of issues) (byType[i.type] ||= []).push(i);

console.log(`\nPRE-LAUNCH TECHNICAL AUDIT — ${htmlFiles.length} pages scanned\n${'='.repeat(60)}`);
if (issues.length === 0) {
  console.log('\n  ✅ 0 issues found across all pages.\n');
} else {
  console.log(`\n  ${issues.length} issue(s) found:\n`);
  for (const type of Object.keys(byType).sort()) {
    console.log(`  [${type}] (${byType[type].length})`);
    for (const i of byType[type]) console.log(`     ${i.file}: ${i.detail}`);
    console.log('');
  }
}
console.log(JSON.stringify({ pages: htmlFiles.length, issues: issues.length, byType: Object.fromEntries(Object.entries(byType).map(([k,v])=>[k,v.length])) }));
