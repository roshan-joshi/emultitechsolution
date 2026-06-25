#!/usr/bin/env node
/**
 * build-a11y.mjs
 *
 * Adds proper <label for="..."> <-> <input id="..."> linkage on the two
 * heavy form pages (contact.html, request_quote.html). Idempotent — only
 * adds id/for where missing. Generates stable ids from the input's name=
 * attribute (kebab-cased + page prefix).
 *
 * Also: marks <main> elements with id="main" so the skip-link target works
 * (skip-link is added by js/header.js).
 *
 *     node tools/build-a11y.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const FILES = [
  { path: 'contact.html', prefix: 'ct' },
  { path: 'request_quote.html', prefix: 'rq' },
];

function kebab(s) {
  return s.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

async function processFile({ path, prefix }) {
  const full = join(ROOT, path);
  const html = await readFile(full, 'utf8');
  let out = html;
  let added = 0;

  // 1. Ensure <main> has id="main" for the skip-link target.
  out = out.replace(/<main(\s[^>]*)?>/i, (m, attrs) => {
    if (attrs && /\bid\s*=/.test(attrs)) return m;
    return `<main id="main"${attrs || ''}>`;
  });

  // 2. Walk every <input>/<select>/<textarea> that has a name= but no id=.
  //    Assign id="<prefix>-<name-kebab>" and label[for]="<same>". For inputs
  //    that share a name (radio groups, checkbox arrays like name="x[]"),
  //    suffix the id with -1, -2, … so each id stays unique per HTML spec.
  const seenNames = Object.create(null);
  const inputRe = /<(input|select|textarea)\b([^>]*)>/gi;
  out = out.replace(inputRe, (match, tag, attrs) => {
    if (/\bid\s*=/.test(attrs)) return match; // already has id
    if (/\btype\s*=\s*["']hidden["']/i.test(attrs)) return match; // hidden inputs don't need labels
    const nameMatch = attrs.match(/\bname\s*=\s*["']([^"']+)["']/);
    if (!nameMatch) return match;
    const baseId = `${prefix}-${kebab(nameMatch[1])}`;
    seenNames[baseId] = (seenNames[baseId] || 0) + 1;
    // First occurrence stays bare; second onward gets -N suffix to ensure
    // every id is unique. (Radio groups, checkbox arrays.)
    const id = seenNames[baseId] === 1 ? baseId : `${baseId}-${seenNames[baseId]}`;
    added++;
    return `<${tag}${attrs} id="${id}">`;
  });

  // 3. For each <label> that has no for= AND its NEXT element sibling is an
  //    input we just gave an id to, add the for= attribute. We use a regex
  //    over the file because the labels here are siblings, not parents.
  //    Approach: find <label …>TEXT</label>\s*…<TAG name="X" … id="prefix-X">
  //    and re-emit the label with for="prefix-X".
  const labelInputRe =
    /<label\b([^>]*)>([\s\S]*?)<\/label>(\s*(?:<[^>]+>\s*)*)<(input|select|textarea)([^>]*\bname\s*=\s*["']([^"']+)["'][^>]*)>/gi;
  out = out.replace(labelInputRe, (m, labelAttrs, labelInner, between, tag, inputAttrs, name) => {
    if (/\bfor\s*=/.test(labelAttrs)) return m;
    const id = `${prefix}-${kebab(name)}`;
    // Only attach if the input has the matching id we generated.
    if (!new RegExp(`\\bid\\s*=\\s*["']${id}["']`).test(inputAttrs)) return m;
    added++;
    return `<label${labelAttrs} for="${id}">${labelInner}</label>${between}<${tag}${inputAttrs}>`;
  });

  // 4. Add aria-required="true" mirror to required inputs (helps SR users)
  out = out.replace(
    /<(input|select|textarea)([^>]*\brequired\b[^>]*)>/gi,
    (m, tag, attrs) => {
      if (/\baria-required\s*=/.test(attrs)) return m;
      added++;
      return `<${tag}${attrs} aria-required="true">`;
    },
  );

  if (out !== html) {
    await writeFile(full, out, 'utf8');
  }
  return { file: path, added, changed: out !== html };
}

let total = 0;
for (const f of FILES) {
  const r = await processFile(f);
  console.log(`build-a11y: ${r.file} — ${r.added} attributes added${r.changed ? '' : ' (no changes)'}`);
  total += r.added;
}
console.log(`build-a11y: done — ${total} total attributes added`);
