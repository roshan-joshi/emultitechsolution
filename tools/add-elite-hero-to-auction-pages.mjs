/**
 * add-elite-hero-to-auction-pages.mjs — prepend an elite editorial hero
 * to each of the 5 auction FORMAT sub-pages (penny, lowest-unique,
 * highest-unique, price-reveal, ebay) and add a polish touch on the
 * auction-software.html pillar page.
 *
 * The hero is INSERTED at the top of <main> — directly above the existing
 * .casestudies--detail / .customer section. All original content is
 * preserved underneath so this is purely additive.
 *
 * Idempotent — re-running detects the existing .format-hero block and skips.
 *
 * Run:  node tools/add-elite-hero-to-auction-pages.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const FORMATS = [
  {
    slug: 'penny-live-auction-script-software.html',
    breadcrumb: 'Penny Auction',
    badge: 'Live in production · since 2011',
    headline: 'Penny Auction Software',
    accent: 'engineered for the final 30 seconds.',
    lede: 'A bidding-fee per bid. Auction time extends on every late bid. The last bid at zero-time wins. We have shipped this format for operators in the UK, Morocco, and across Europe since 2011 — engineered for the spiky concurrency that arrives in the final 30 seconds of every auction.',
    facts: [
      ['11<span>+</span>', 'Countries shipped'],
      ['16<span>+</span>', 'Years engineering'],
      ['1', 'Live public proof<br>bidbid.co.uk'],
      ['4.8<span>&#9733;</span>', '25 Capterra reviews'],
    ],
    primaryCta: 'Discuss Your Penny Auction Project',
    secondaryCta: 'See Reference Deployments &darr;',
  },
  {
    slug: 'lowest-unique-bid-auction-script-online-software-reverse-auction-low-bid.html',
    breadcrumb: 'Lowest Unique Bid',
    badge: 'Shipped since 2011 · multi-market',
    headline: 'Lowest Unique Bid',
    accent: 'where bid integrity decides every winner.',
    lede: 'The winner places the lowest bid no one else has placed. The format lives or dies on bid integrity — duplicate-detection has to be airtight, bid-timing has to be authoritative, the reveal has to be defensible. We have shipped this format across the US, UK, Europe, and Asia since 2011.',
    facts: [
      ['100<span>%</span>', 'DB-level uniqueness'],
      ['16<span>+</span>', 'Years engineering'],
      ['8<span>+</span>', 'Markets shipped'],
      ['4.8<span>&#9733;</span>', '25 Capterra reviews'],
    ],
    primaryCta: 'Discuss Your Project',
    secondaryCta: 'See Reference Deployments &darr;',
  },
  {
    slug: 'highest-unique-bids-auction-script-online-highest-bid-software-services.html',
    breadcrumb: 'Highest Unique Bid',
    badge: 'Shipped since 2011',
    headline: 'Highest Unique Bid',
    accent: 'the inverse format, same integrity bar.',
    lede: 'The winner places the highest bid no one else has placed. Same demands as lowest-unique — duplicate detection, authoritative timing, defensible reveal — applied to the inverse direction. Shipped for Gift Card Auction and other operators since 2011.',
    facts: [
      ['100<span>%</span>', 'Atomic uniqueness'],
      ['16<span>+</span>', 'Years engineering'],
      ['1', 'Anti-abuse module<br>shared w/ lowest-unique'],
      ['4.8<span>&#9733;</span>', '25 Capterra reviews'],
    ],
    primaryCta: 'Discuss Your Project',
    secondaryCta: 'See Reference Deployments &darr;',
  },
  {
    slug: 'price-reveal-auction-script-express-auction-software-live-unique-bidding-system.html',
    breadcrumb: 'Price Reveal',
    badge: 'Shipped since 2011 · multi-market',
    headline: 'Price Reveal Auctions',
    accent: 'every reveal feels instantaneous.',
    lede: 'Players pay a small fee to reveal the current auction price. The price moves on a configurable curve; the player who commits at the right price wins. Shipped in the UK, Singapore, and across European markets — engineered for the latency-sensitive reveal interaction.',
    facts: [
      ['&lt;200<span>ms</span>', 'Reveal latency target'],
      ['16<span>+</span>', 'Years engineering'],
      ['6<span>+</span>', 'Markets shipped'],
      ['4.8<span>&#9733;</span>', '25 Capterra reviews'],
    ],
    primaryCta: 'Discuss Your Project',
    secondaryCta: 'See Reference Deployments &darr;',
  },
  {
    slug: 'ebay-auction-like-ebay-script.html',
    breadcrumb: 'eBay-Style Marketplace',
    badge: 'Shipped since 2011 · 4 verticals',
    headline: 'eBay-Style Auction',
    accent: 'proxy bidding, atomic, server-side.',
    lede: 'Highest bid at close wins. Proxy bidding (user sets max, system bids up automatically). Auction extension on late bids. Watchlists, saved searches, seller reputation. Shipped for general marketplaces (Bidcy), automotive (Classic Car Auctions, Teslabidz), and specialty verticals (Equine Group horse syndication).',
    facts: [
      ['16<span>+</span>', 'Years engineering'],
      ['4', 'Verticals delivered'],
      ['1', 'Proxy-bid engine<br>server-side, atomic'],
      ['4.8<span>&#9733;</span>', '25 Capterra reviews'],
    ],
    primaryCta: 'Discuss Your Project',
    secondaryCta: 'See Reference Deployments &darr;',
  },
];

const HAS_HERO_RE = /<section\s+class=["']format-hero["']/i;

function buildHero(d) {
  const facts = d.facts
    .map(([k, v]) => `        <div class="format-hero__stat"><dt>${k}</dt><dd>${v}</dd></div>`)
    .join('\n');
  return `
    <!-- Elite editorial hero — added by tools/add-elite-hero-to-auction-pages.mjs -->
    <section class="format-hero" aria-labelledby="format-hero-title">
      <div class="format-hero__aurora" aria-hidden="true"></div>
      <div class="format-hero__grid" aria-hidden="true"></div>
      <div class="format-hero__inner">
        <nav class="format-hero__crumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a> <span aria-hidden="true">&rsaquo;</span>
          <a href="auction-software.html">Auction Software</a> <span aria-hidden="true">&rsaquo;</span>
          <span>${d.breadcrumb}</span>
        </nav>
        <span class="format-hero__badge">
          <span class="format-hero__pulse" aria-hidden="true"></span>
          ${d.badge}
        </span>
        <h1 id="format-hero-title" class="format-hero__h1">
          ${d.headline}
          <span class="format-hero__accent">${d.accent}</span>
        </h1>
        <p class="format-hero__lede">${d.lede}</p>
        <dl class="format-hero__facts">
${facts}
        </dl>
        <div class="format-hero__cta">
          <a href="request_quote.html" class="format-hero__btn-primary">${d.primaryCta}</a>
          <a href="#main-detail" class="format-hero__btn-secondary">${d.secondaryCta}</a>
        </div>
      </div>
    </section>
`;
}

let updated = 0;
let skipped = 0;
for (const data of FORMATS) {
  const path = join(ROOT, data.slug);
  const src = await readFile(path, 'utf8');

  if (HAS_HERO_RE.test(src)) {
    console.log(`  SKIP    ${data.slug} (already has format-hero)`);
    skipped++;
    continue;
  }

  const block = buildHero(data);
  // Insert right after <main id="main"> and add an anchor id #main-detail on
  // the first existing section so the "See deployments" button scrolls down.
  let out = src.replace(/(<main\s+id=["']main["']\s*>)/, `$1${block}`);
  // Add anchor target on the first .casestudies--detail or .customer section
  // — used by the secondary CTA's scroll target.
  out = out.replace(
    /(<section\s+class=["']casestudies--detail[^"']*["'][^>]*>)/,
    `<a id="main-detail" aria-hidden="true"></a>$1`,
  );
  await writeFile(path, out, 'utf8');
  console.log(`  INSERT  ${data.slug}`);
  updated++;
}

console.log(`\nadd-elite-hero-to-auction-pages: updated ${updated}, skipped ${skipped}, total ${FORMATS.length}`);
