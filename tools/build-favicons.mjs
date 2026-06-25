/**
 * build-favicons.mjs — generate the full modern favicon set from images/icon-master.svg
 *
 * Outputs:
 *   images/favicon-16.png        (16x16)
 *   images/favicon-32.png        (32x32)
 *   images/favicon-48.png        (48x48)
 *   images/apple-touch-icon.png  (180x180)
 *   images/icon-192.png          (192x192)
 *   images/icon-512.png          (512x512)
 *   images/icon-maskable-512.png (512x512, safe-zone padded)
 *
 * Run:  node tools/build-favicons.mjs
 */

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC  = join(ROOT, 'images', 'icon-master.svg');
const OUT  = join(ROOT, 'images');

if (!existsSync(SRC)) {
  console.error(`build-favicons: source not found: ${SRC}`);
  process.exit(1);
}
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const targets = [
  { size: 16,  name: 'favicon-16.png' },
  { size: 32,  name: 'favicon-32.png' },
  { size: 48,  name: 'favicon-48.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
];

let ok = 0;
for (const { size, name } of targets) {
  const dest = join(OUT, name);
  await sharp(SRC, { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(dest);
  ok++;
  console.log(`  -> ${name}  (${size}x${size})`);
}

// Maskable icon: 512x512 with a safe-zone (logo at ~80% of canvas, solid bg fills the rest)
// Android's maskable spec reserves the outer 10% in case of circle/squircle masks.
const maskableDest = join(OUT, 'icon-maskable-512.png');
const inner = await sharp(SRC, { density: 512 })
  .resize(410, 410, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: { r: 13, g: 63, b: 143, alpha: 1 }, // #0d3f8f brand blue
  },
})
  .composite([{ input: inner, top: 51, left: 51 }])
  .png({ compressionLevel: 9 })
  .toFile(maskableDest);
ok++;
console.log(`  -> icon-maskable-512.png  (512x512, safe-zone padded)`);

// favicon.ico — legacy fallback for ancient browsers. We write the 32x32 PNG
// bytes into a .ico extension. Not a true multi-resolution ICO container, but
// every modern + legacy browser accepts a PNG served at the .ico path.
const favicon32Path = join(OUT, 'favicon-32.png');
const favicon32Buf  = await sharp(favicon32Path).png().toBuffer();
await sharp(favicon32Buf).toFile(join(OUT, 'favicon.ico'));
ok++;
console.log(`  -> favicon.ico  (legacy fallback, PNG bytes)`);

console.log(`build-favicons: generated ${ok} files from icon-master.svg`);
