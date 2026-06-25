/**
 * build-hero-poster.mjs — generate the hero video poster (1920x1080).
 *
 * The hero video (1.27 MB MP4) takes time to download. With preload="metadata"
 * the browser only fetches enough to determine dimensions, and the <video>
 * poster attribute fills the screen instantly. This script produces that poster.
 *
 * Output: images/hero-poster.jpg (JPEG — smaller than PNG for a gradient)
 *
 * Run:  node tools/build-hero-poster.mjs
 */

import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = join(ROOT, 'images', 'hero-poster.jpg');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0f1f"/>
      <stop offset="0.45" stop-color="#0a1628"/>
      <stop offset="1" stop-color="#0d3f8f"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.85" cy="0.2" r="0.55">
      <stop offset="0" stop-color="#1a6bcc" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#1a6bcc" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.1" cy="0.85" r="0.5">
      <stop offset="0" stop-color="#7cb6ff" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#7cb6ff" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg)"/>
  <rect width="1920" height="1080" fill="url(#grid)"/>
  <rect width="1920" height="1080" fill="url(#glow1)"/>
  <rect width="1920" height="1080" fill="url(#glow2)"/>
</svg>`;

await sharp(Buffer.from(svg))
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile(OUT);

const stat = await import('node:fs/promises').then(m => m.stat(OUT));
console.log(`build-hero-poster: wrote images/hero-poster.jpg (1920x1080, ${Math.round(stat.size / 1024)} KB)`);
