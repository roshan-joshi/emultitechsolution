#!/usr/bin/env node
/**
 * build-images.mjs
 *
 * One-time and incremental image optimization for the images/ directory.
 *
 * For every .png/.jpg/.jpeg in images/, this script:
 *
 *   1. Reads the image dimensions (width, height).
 *   2. Generates a .webp sibling at 82% quality (PNG sources kept lossless
 *      indicator; JPEG sources get true lossy). Skipped if the .webp is
 *      newer than the source.
 *   3. Writes a single images/_dimensions.json mapping
 *        "filename.png": { "w": 1280, "h": 720, "webp": true }
 *      consumed by tools/build-imgs.mjs to inject correct width/height
 *      attributes and <picture> sources into HTML.
 *
 *     node tools/build-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, writeFile, readFile } from 'node:fs/promises';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR = join(ROOT, 'images');
const DIMS_FILE = join(IMG_DIR, '_dimensions.json');

const SOURCE_EXTS = new Set(['.png', '.jpg', '.jpeg']);

const entries = await readdir(IMG_DIR, { withFileTypes: true });
const sources = entries
  .filter((e) => e.isFile() && SOURCE_EXTS.has(extname(e.name).toLowerCase()))
  .map((e) => e.name)
  .sort();

// Load previous dimensions (so we can preserve entries for files we didn't process).
let dimensions = {};
try {
  const prev = await readFile(DIMS_FILE, 'utf8');
  dimensions = JSON.parse(prev);
} catch {
  // No prior file — start fresh.
}

let converted = 0;
let skipped = 0;
let failed = 0;

for (const filename of sources) {
  const src = join(IMG_DIR, filename);
  const webpName = basename(filename, extname(filename)) + '.webp';
  const webpPath = join(IMG_DIR, webpName);

  let srcStat;
  try {
    srcStat = await stat(src);
  } catch (e) {
    failed++;
    continue;
  }

  // Probe dimensions every run (fast and cheap).
  let meta;
  try {
    meta = await sharp(src).metadata();
  } catch (e) {
    console.warn(`! Could not read metadata for ${filename}: ${e.message}`);
    failed++;
    continue;
  }

  dimensions[filename] = {
    w: meta.width ?? null,
    h: meta.height ?? null,
    webp: false, // updated below if we successfully produce / find a .webp
  };

  // Skip .webp generation if it already exists and is newer than source.
  let webpFresh = false;
  try {
    const webpStat = await stat(webpPath);
    if (webpStat.mtimeMs >= srcStat.mtimeMs) {
      webpFresh = true;
    }
  } catch {
    // .webp doesn't exist yet
  }

  if (webpFresh) {
    dimensions[filename].webp = true;
    skipped++;
    continue;
  }

  try {
    const pipeline = sharp(src).webp({
      quality: 82,
      effort: 5,
      // Lossy webp from lossy sources; near-lossless for PNG sources w/ alpha.
      nearLossless: extname(filename).toLowerCase() === '.png' && meta.hasAlpha,
    });
    await pipeline.toFile(webpPath);
    dimensions[filename].webp = true;
    converted++;
  } catch (e) {
    console.warn(`! Failed to convert ${filename}: ${e.message}`);
    failed++;
  }
}

await writeFile(DIMS_FILE, JSON.stringify(dimensions, null, 2), 'utf8');

console.log(
  `build-images: converted ${converted}, skipped (already fresh) ${skipped}, failed ${failed}, total sources ${sources.length}`,
);
console.log(`Dimensions map saved to images/_dimensions.json (${Object.keys(dimensions).length} entries)`);
