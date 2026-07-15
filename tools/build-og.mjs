/**
 * build-og.mjs — generate the default branded OpenGraph card (1200x630).
 *
 * Output: images/og-default.png
 *
 * The previous default og:image was images/logo.png (131x42), which broke link
 * previews on LinkedIn, Slack, X, Discord, and iMessage. This script produces a
 * proper 1200x630 branded card using SVG → sharp.
 *
 * Run:  node tools/build-og.mjs
 */

import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = join(ROOT, 'images', 'og-default.png');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0f1f"/>
      <stop offset="0.45" stop-color="#0a1628"/>
      <stop offset="1" stop-color="#0d3f8f"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.6">
      <stop offset="0" stop-color="#1a6bcc" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#1a6bcc" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="num" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#7cb6ff"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Brand mark: rounded blue square with white "e" -->
  <g transform="translate(80, 80)">
    <rect width="88" height="88" rx="18" ry="18" fill="#1a6bcc"/>
    <text x="44" y="64" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="56" fill="#ffffff" text-anchor="middle">e</text>
  </g>

  <!-- Wordmark text -->
  <text x="190" y="138" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="28" fill="#ffffff" letter-spacing="-0.5">E Multitech Solution</text>
  <text x="190" y="170" font-family="Inter, Arial, sans-serif" font-weight="500" font-size="18" fill="rgba(255,255,255,0.55)" letter-spacing="0.5">Production software since October 2010</text>

  <!-- Big stat: Since 2010 -->
  <text x="80" y="370" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="180" fill="url(#num)" letter-spacing="-3">2010</text>

  <!-- Headline -->
  <text x="80" y="450" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="48" fill="#ffffff" letter-spacing="-1">Building software continuously ever since</text>
  <text x="80" y="500" font-family="Inter, Arial, sans-serif" font-weight="500" font-size="26" fill="rgba(255,255,255,0.7)">Hundreds of projects &#183; Worldwide delivery &#183; Auction platform rated 4.8&#9733; on Capterra</text>

  <!-- Bottom hairline rule -->
  <line x1="80" y1="555" x2="1120" y2="555" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

  <!-- Footer: domain + tagline -->
  <text x="80" y="590" font-family="Inter, Arial, sans-serif" font-weight="600" font-size="20" fill="#ffffff" letter-spacing="0.5">emultitechsolution.com</text>
  <text x="1120" y="590" font-family="Inter, Arial, sans-serif" font-weight="500" font-size="18" fill="rgba(255,255,255,0.55)" text-anchor="end">Custom Software &#183; SaaS &#183; AI &#183; Mobile</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`build-og: wrote images/og-default.png (1200x630)`);
