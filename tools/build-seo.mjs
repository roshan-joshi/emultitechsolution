#!/usr/bin/env node
/**
 * build-seo.mjs
 *
 * Injects per-page SEO metadata and JSON-LD structured data into every
 * root-level *.html page, driven by tools/pages.config.mjs.
 *
 * What gets injected (between <!-- SEO:START --> ... <!-- SEO:END --> markers):
 *   <title>
 *   <meta name="description">
 *   <meta name="robots">                          (noindex pages only)
 *   <link rel="canonical">
 *   Open Graph                                     (og:title, og:description, og:url,
 *                                                   og:type, og:image, og:site_name)
 *   Twitter card                                   (summary_large_image)
 *   One or more <script type="application/ld+json"> blocks
 *
 * On first run the script also removes any pre-existing <title> or meta
 * description from <head> (outside the marker block) so we don't end up with
 * duplicates.
 *
 * Idempotent — safe to re-run after editing pages.config.mjs.
 *
 *     node tools/build-seo.mjs
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, PAGES } from './pages.config.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['index_1.html', 'index-orbital.html']);

// ─── URL helpers ─────────────────────────────────────────────────────────────

const baseUrl = SITE.url.replace(/\/+$/, '');

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${baseUrl}/${pathOrUrl.replace(/^\/+/, '')}`;
}

function canonicalFor(filename) {
  // Home maps to root URL; everything else keeps its filename.
  if (filename === 'index.html') return `${baseUrl}/`;
  return `${baseUrl}/${filename}`;
}

// ─── Breadcrumb derivation ───────────────────────────────────────────────────

/* Intermediate breadcrumb segments per page-type. EVERY segment now has a
   URL — Google's BreadcrumbList structured-data spec recommends including
   `item` on every position (only the leaf may omit it). "Services" points
   to the services strip on the homepage (#services-section anchor). */
const BREADCRUMB_TRAILS = {
  service: [{ name: 'Services', file: 'index.html#services-section' }],
  industry: [{ name: 'Industries', file: 'industries.html' }],
  auctionProduct: [
    { name: 'Services', file: 'index.html#services-section' },
    { name: 'Auction Software', file: 'auction-software.html' },
  ],
  clientShowcase: [{ name: 'Our Works', file: 'works.html' }],
  case: [{ name: 'Case Studies', file: 'case-studies.html' }],
  blogPost: [{ name: 'Blog', file: 'blog.html' }],
  portfolio: [],
  testimonial: [],
  policy: [],
  about: [],
  contact: [],
  blog: [],
  page: [],
  home: [],
};

function buildBreadcrumbs(filename, page) {
  if (filename === 'index.html') return null;
  const trail = BREADCRUMB_TRAILS[page.type] ?? [];
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
  ];
  trail.forEach((seg, i) => {
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name: seg.name,
      // All intermediate segments must have an `item` URL per Google's
      // BreadcrumbList guidelines. If a future trail entry forgets this,
      // fall back to the homepage so we never emit a URL-less intermediate.
      item: `${baseUrl}/${seg.file || ''}`,
    });
  });
  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: page.title,
    item: canonicalFor(filename),
  });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
}

// ─── JSON-LD presets per page type ───────────────────────────────────────────

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    legalName: SITE.legalName,
    url: `${baseUrl}/`,
    logo: absoluteUrl(SITE.logo),
    description: SITE.description,
    foundingDate: SITE.founded,
    sameAs: SITE.social,
    address: SITE.locations.map((loc) => ({
      '@type': 'PostalAddress',
      ...(loc.streetAddress ? { streetAddress: loc.streetAddress } : {}),
      addressLocality: loc.addressLocality,
      ...(loc.addressRegion ? { addressRegion: loc.addressRegion } : {}),
      addressCountry: loc.addressCountry,
    })),
    contactPoint: SITE.locations.map((loc) => ({
      '@type': 'ContactPoint',
      telephone: loc.telephone,
      contactType: 'sales',
      areaServed: loc.addressCountry === 'NP' ? ['NP', 'IN', 'BD', 'Worldwide'] : ['AU', 'NZ', 'Worldwide'],
      availableLanguage: ['English'],
    })),
  };
}

function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: `${baseUrl}/`,
    publisher: { '@type': 'Organization', name: SITE.name },
  };
}

function serviceSchema(page, filename) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    description: page.description,
    url: canonicalFor(filename),
    provider: { '@type': 'Organization', name: SITE.name, url: `${baseUrl}/` },
    areaServed: 'Worldwide',
  };
}

function articleSchema(page, filename) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    url: canonicalFor(filename),
    image: absoluteUrl(page.image || SITE.defaultImage),
    author: { '@type': 'Organization', name: SITE.name },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: absoluteUrl(SITE.logo) },
    },
  };
}

function schemasFor(filename, page) {
  const schemas = [];
  const t = page.type ?? 'page';

  if (t === 'home') {
    schemas.push(organizationSchema(), websiteSchema());
  } else if (t === 'about' || t === 'contact') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': t === 'about' ? 'AboutPage' : 'ContactPage',
      url: canonicalFor(filename),
      name: page.title,
      description: page.description,
      isPartOf: { '@type': 'WebSite', name: SITE.name, url: `${baseUrl}/` },
    });
    schemas.push(organizationSchema());
  } else if (t === 'service' || t === 'auctionProduct' || t === 'industry') {
    schemas.push(serviceSchema(page, filename));
  } else if (t === 'case' || t === 'blogPost') {
    schemas.push(articleSchema(page, filename));
  } else if (t === 'blog') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      url: canonicalFor(filename),
      name: page.title,
      description: page.description,
      publisher: { '@type': 'Organization', name: SITE.name },
    });
  } else {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url: canonicalFor(filename),
      name: page.title,
      description: page.description,
      isPartOf: { '@type': 'WebSite', name: SITE.name, url: `${baseUrl}/` },
    });
  }

  const crumbs = buildBreadcrumbs(filename, page);
  if (crumbs) schemas.push(crumbs);

  return schemas;
}

// ─── HTML escaping ───────────────────────────────────────────────────────────

function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Block builder ───────────────────────────────────────────────────────────

function buildSeoBlock(filename, page) {
  const fullTitle = page.title + SITE.brandSuffix;
  const canonical = canonicalFor(filename);
  const ogImage = absoluteUrl(page.image || SITE.defaultImage);
  const ogType =
    page.type === 'home' ? 'website'
    : page.type === 'blogPost' ? 'article'
    : page.type === 'case' ? 'article'
    : 'website';

  const lines = [
    '<!-- SEO:START — generated by tools/build-seo.mjs; edit tools/pages.config.mjs then re-run -->',
    `  <title>${escText(fullTitle)}</title>`,
    `  <meta name="description" content="${escAttr(page.description)}">`,
  ];

  if (page.noindex) {
    lines.push('  <meta name="robots" content="noindex,follow">');
  } else {
    lines.push('  <meta name="robots" content="index,follow,max-image-preview:large">');
  }

  lines.push(
    `  <link rel="canonical" href="${escAttr(canonical)}">`,
    '',
    `  <meta property="og:type" content="${ogType}">`,
    `  <meta property="og:site_name" content="${escAttr(SITE.name)}">`,
    `  <meta property="og:title" content="${escAttr(fullTitle)}">`,
    `  <meta property="og:description" content="${escAttr(page.description)}">`,
    `  <meta property="og:url" content="${escAttr(canonical)}">`,
    `  <meta property="og:image" content="${escAttr(ogImage)}">`,
    '',
    '  <meta name="twitter:card" content="summary_large_image">',
    `  <meta name="twitter:title" content="${escAttr(fullTitle)}">`,
    `  <meta name="twitter:description" content="${escAttr(page.description)}">`,
    `  <meta name="twitter:image" content="${escAttr(ogImage)}">`,
  );
  if (SITE.twitter) {
    lines.push(`  <meta name="twitter:site" content="${escAttr(SITE.twitter)}">`);
  }

  const schemas = schemasFor(filename, page);
  for (const s of schemas) {
    lines.push('');
    lines.push('  <script type="application/ld+json">');
    lines.push(JSON.stringify(s, null, 2).replace(/^/gm, '  '));
    lines.push('  </script>');
  }

  lines.push('  <!-- SEO:END -->');
  return lines.join('\n');
}

// ─── Injection ───────────────────────────────────────────────────────────────

const SEO_MARKER_RE = /<!--\s*SEO:START[\s\S]*?<!--\s*SEO:END\s*-->/;
const VIEWPORT_RE = /(<meta\s+name=["']viewport["'][^>]*>)/i;
const TITLE_RE = /\s*<title>[\s\S]*?<\/title>/gi;
const META_DESC_RE = /\s*<meta\s+name=["']description["'][^>]*>/gi;

function stripStaleTagsBeforeMarker(html) {
  // Remove pre-existing <title> and <meta name="description"> from <head>
  // (they only exist outside the SEO block; the block has its own).
  const headEnd = html.search(/<\/head>/i);
  if (headEnd === -1) return html;
  const head = html.slice(0, headEnd);
  const rest = html.slice(headEnd);

  // Preserve the SEO block (anything inside it stays untouched here).
  const blockMatch = head.match(SEO_MARKER_RE);
  if (blockMatch) {
    const before = head.slice(0, blockMatch.index);
    const block = blockMatch[0];
    const after = head.slice(blockMatch.index + block.length);
    return (
      before.replace(TITLE_RE, '').replace(META_DESC_RE, '') +
      block +
      after.replace(TITLE_RE, '').replace(META_DESC_RE, '') +
      rest
    );
  }
  return head.replace(TITLE_RE, '').replace(META_DESC_RE, '') + rest;
}

function injectSeoBlock(html, block) {
  // Idempotent: if marker exists, replace between markers.
  if (SEO_MARKER_RE.test(html)) {
    return html.replace(SEO_MARKER_RE, block);
  }
  // First run: insert immediately after the viewport meta tag.
  if (VIEWPORT_RE.test(html)) {
    return html.replace(VIEWPORT_RE, `$1\n  ${block}`);
  }
  // Fallback: insert after <head>.
  return html.replace(/<head>/i, (m) => `${m}\n  ${block}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

const entries = await readdir(ROOT, { withFileTypes: true });
const htmlFiles = entries
  .filter((e) => e.isFile() && e.name.endsWith('.html') && !SKIP.has(e.name))
  .map((e) => e.name)
  .sort();

let updated = 0;
let unchanged = 0;
const missingConfig = [];

for (const file of htmlFiles) {
  const page = PAGES[file];
  if (!page) {
    missingConfig.push(file);
    continue;
  }

  const path = join(ROOT, file);
  const original = await readFile(path, 'utf8');

  const block = buildSeoBlock(file, page);
  const withBlock = injectSeoBlock(original, block);
  const cleaned = stripStaleTagsBeforeMarker(withBlock);

  if (cleaned === original) {
    unchanged++;
  } else {
    await writeFile(path, cleaned, 'utf8');
    updated++;
  }
}

console.log(`build-seo: updated ${updated}, unchanged ${unchanged}, total ${htmlFiles.length}`);
if (missingConfig.length) {
  console.log(`No metadata in pages.config.mjs for:`);
  for (const f of missingConfig) console.log(`  - ${f}`);
}
