#!/usr/bin/env node
/**
 * scan-pages.mjs — one-shot helper to harvest existing title / H1 / opening
 * paragraph from every root-level *.html page. Used as input for writing
 * pages.config.mjs (per-page SEO metadata). NOT part of the production build.
 *
 * Output: JSON to stdout.
 *     node tools/scan-pages.mjs > tools/_scan.json
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['index_1.html']);

function pick(html, re) {
  const m = html.match(re);
  if (!m) return null;
  return m[1]
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

const entries = await readdir(ROOT, { withFileTypes: true });
const htmlFiles = entries
  .filter((e) => e.isFile() && e.name.endsWith('.html') && !SKIP.has(e.name))
  .map((e) => e.name)
  .sort();

const out = {};
for (const file of htmlFiles) {
  const html = await readFile(join(ROOT, file), 'utf8');
  out[file] = {
    title: pick(html, /<title>([\s\S]*?)<\/title>/i),
    h1: pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i),
    firstP: pick(html, /<main[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i),
    metaDesc: pick(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i),
  };
}
console.log(JSON.stringify(out, null, 2));
