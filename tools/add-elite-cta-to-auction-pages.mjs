/**
 * add-elite-cta-to-auction-pages.mjs — wrap the 12 restored auction pages
 * with an elite-cta closing block, preserving all original detail content.
 *
 * Two insertion modes:
 *   - If the page ends with a `<section class="web__wrapper">…</section>`
 *     legacy CTA right before `</main>`, REPLACE it with elite-cta.
 *   - Otherwise, INSERT the elite-cta just before `</main>`.
 *
 * Idempotent — re-running detects the existing elite-cta block and skips.
 *
 * Run:  node tools/add-elite-cta-to-auction-pages.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Per-page elite-cta data
const PAGES = [
  // 5 FORMAT pages
  {
    slug: 'penny-live-auction-script-software.html',
    status: 'Penny auction format · shipped since 2011',
    line1: 'Build a penny auction platform',
    line2: 'that survives the spiky concurrency',
    line3: 'of the final 30 seconds.',
    stats: [
      ['11<span>+</span>', 'Countries with<br>penny auction deployments'],
      ['16<span>+</span>', 'Years engineering<br>auction software'],
      ['1', 'Live public proof:<br>bidbid.co.uk'],
      ['4.8<span>&#9733;</span>', 'Capterra rating<br>25 verified reviews'],
    ],
    lede: 'Tell us your penny auction economics. We will tell you the architecture we would ship on day one.',
    btn: 'Book a penny auction architecture call',
  },
  {
    slug: 'lowest-unique-bid-auction-script-online-software-reverse-auction-low-bid.html',
    status: 'Lowest unique bid format · shipped since 2011',
    line1: 'Ship a lowest-unique-bid platform',
    line2: 'with the bid integrity',
    line3: 'that decides every winner.',
    stats: [
      ['100<span>%</span>', 'Database-level<br>uniqueness enforcement'],
      ['16<span>+</span>', 'Years engineering<br>auction software'],
      ['8<span>+</span>', 'Markets shipped<br>lowest-unique format'],
      ['4.8<span>&#9733;</span>', 'Capterra rating<br>25 verified reviews'],
    ],
    lede: 'Tell us your lowest-unique auction rules. We will tell you the integrity architecture we would ship on day one.',
    btn: 'Book a lowest-unique architecture call',
  },
  {
    slug: 'highest-unique-bids-auction-script-online-highest-bid-software-services.html',
    status: 'Highest unique bid format · shipped since 2011',
    line1: 'Ship a highest-unique-bid platform',
    line2: 'with the same integrity bar',
    line3: 'as the lowest-unique inverse.',
    stats: [
      ['100<span>%</span>', 'Atomic uniqueness<br>on the high side'],
      ['16<span>+</span>', 'Years engineering<br>auction software'],
      ['1', 'Anti-abuse module<br>shared with lowest-unique'],
      ['4.8<span>&#9733;</span>', 'Capterra rating<br>25 verified reviews'],
    ],
    lede: 'Tell us your highest-unique auction format. We will tell you the integrity architecture we would ship on day one.',
    btn: 'Book a highest-unique architecture call',
  },
  {
    slug: 'price-reveal-auction-script-express-auction-software-live-unique-bidding-system.html',
    status: 'Price reveal format · shipped since 2011',
    line1: 'Ship a price-reveal platform',
    line2: 'where every reveal feels',
    line3: 'instantaneous, even under load.',
    stats: [
      ['&lt;200<span>ms</span>', 'Reveal interaction<br>latency target'],
      ['16<span>+</span>', 'Years engineering<br>auction software'],
      ['6<span>+</span>', 'Markets shipped<br>price-reveal format'],
      ['4.8<span>&#9733;</span>', 'Capterra rating<br>25 verified reviews'],
    ],
    lede: 'Tell us your price-reveal mechanics. We will tell you the low-latency architecture we would ship on day one.',
    btn: 'Book a price-reveal architecture call',
  },
  {
    slug: 'ebay-auction-like-ebay-script.html',
    status: 'eBay-style format · shipped since 2011',
    line1: 'Build an eBay-style marketplace',
    line2: 'with proxy bidding and seller',
    line3: 'reputation that survive at scale.',
    stats: [
      ['16<span>+</span>', 'Years shipping<br>eBay-style auctions'],
      ['4', 'Verticals delivered<br>general / auto / specialty / equine'],
      ['1', 'Proxy-bid engine<br>atomic, server-side'],
      ['4.8<span>&#9733;</span>', 'Capterra rating<br>25 verified reviews'],
    ],
    lede: 'Tell us your marketplace economics. We will tell you the proxy-bidding architecture we would ship on day one.',
    btn: 'Book an eBay-style architecture call',
  },

  // 7 CLIENT showcase pages
  {
    slug: 'bidbid.html',
    status: 'Live in production · bidbid.co.uk',
    line1: 'Ship a penny auction platform',
    line2: 'with the same architecture',
    line3: 'that runs bidbid.co.uk.',
    stats: [
      ['1', 'Live production<br>URL (UK market)'],
      ['16<span>+</span>', 'Years of auction<br>engineering'],
      ['MVC', 'PHP &middot; MySQL<br>jQuery &middot; WebSocket'],
      ['4.8<span>&#9733;</span>', 'Capterra rating<br>25 verified reviews'],
    ],
    lede: 'Tell us your market. We will tell you what would carry over from bidbid.co.uk.',
    btn: 'Book an auction architecture call',
  },
  {
    slug: 'eodbox.html',
    status: 'Unique bid auction · United Kingdom',
    line1: 'Build a unique-bid platform',
    line2: 'with airtight bid integrity',
    line3: 'and a real operator panel.',
    stats: [
      ['UK', 'Market deployment<br>multi-product catalogue'],
      ['16<span>+</span>', 'Years engineering<br>auction software'],
      ['1', 'Authoritative bid<br>timing architecture'],
      ['4.8<span>&#9733;</span>', 'Capterra rating<br>25 verified reviews'],
    ],
    lede: 'Tell us your unique-bid rules. We will tell you the integrity architecture we would ship on day one.',
    btn: 'Book a unique-bid architecture call',
  },
  {
    slug: 'rubids.html',
    status: 'Multi-type auction · single engine',
    line1: 'Run every auction format',
    line2: 'from one engine,',
    line3: 'one wallet, one operator panel.',
    stats: [
      ['4<span>+</span>', 'Auction formats<br>per single engine'],
      ['16<span>+</span>', 'Years engineering<br>auction software'],
      ['1', 'Shared bidder identity<br>across formats'],
      ['4.8<span>&#9733;</span>', 'Capterra rating<br>25 verified reviews'],
    ],
    lede: 'Tell us which formats matter. We will tell you the multi-format engine we would ship on day one.',
    btn: 'Book a multi-format architecture call',
  },
  {
    slug: 'smgbids.html',
    status: 'Lowest unique bid · multi-market',
    line1: 'Ship a lowest-unique platform',
    line2: 'with the integrity that',
    line3: 'decides every winner cleanly.',
    stats: [
      ['100<span>%</span>', 'Atomic uniqueness<br>at the database layer'],
      ['16<span>+</span>', 'Years engineering<br>auction software'],
      ['1', 'Server-authoritative<br>bid timestamps'],
      ['4.8<span>&#9733;</span>', 'Capterra rating<br>25 verified reviews'],
    ],
    lede: 'Tell us your lowest-unique rules. We will tell you the integrity architecture we would ship on day one.',
    btn: 'Book a lowest-unique architecture call',
  },
  {
    slug: 'bienbid.html',
    status: 'Penny auction (seat booking) · Morocco',
    line1: 'Build a penny auction platform',
    line2: 'localised for your market',
    line3: '&mdash; language, currency, payments.',
    stats: [
      ['MAD', 'Native pricing<br>Moroccan dirham'],
      ['FR<br>AR', 'Bilingual interface<br>French &amp; Arabic'],
      ['16<span>+</span>', 'Years engineering<br>auction software'],
      ['4.8<span>&#9733;</span>', 'Capterra rating<br>25 verified reviews'],
    ],
    lede: 'Tell us your target market. We will tell you the localisation architecture we would ship on day one.',
    btn: 'Book a localisation architecture call',
  },
  {
    slug: 'ubidbuy.html',
    status: 'Price reveal &amp; lowest-unique · Singapore',
    line1: 'Ship a dual-format auction',
    line2: 'with sub-200ms reveal and',
    line3: 'atomic-unique bidding in one engine.',
    stats: [
      ['SGD', 'Native pricing<br>regional payment gateways'],
      ['2', 'Formats per<br>single engine'],
      ['&lt;200<span>ms</span>', 'Reveal interaction<br>latency'],
      ['4.8<span>&#9733;</span>', 'Capterra rating<br>25 verified reviews'],
    ],
    lede: 'Tell us your APAC market. We will tell you what would carry over from uBidUBuy.sg.',
    btn: 'Book an APAC auction architecture call',
  },
  {
    slug: 'onlinealku.html',
    status: 'Reverse auction · DiNePa’s precursor',
    line1: 'Run a reverse auction',
    line2: 'where suppliers bid down',
    line3: 'for your procurement business.',
    stats: [
      ['1', 'Pure reverse-bidding<br>state machine'],
      ['16<span>+</span>', 'Years engineering<br>auction software'],
      ['1', 'Award-decision<br>audit log built-in'],
      ['4.8<span>&#9733;</span>', 'Capterra rating<br>25 verified reviews'],
    ],
    lede: 'Tell us your procurement workflow. We will tell you the reverse-auction architecture we would ship on day one.',
    btn: 'Book a reverse-auction architecture call',
  },
];

function buildEliteCta(data) {
  const statsHtml = data.stats
    .map(([dt, dd]) => `        <div>\n          <dt>${dt}</dt>\n          <dd>${dd}</dd>\n        </div>`)
    .join('\n');

  return `
  <!-- Editorial CTA — elite -->
  <section class="elite-cta" aria-labelledby="elite-cta-title">
    <div class="elite-cta__aurora" aria-hidden="true"></div>
    <div class="elite-cta__grid" aria-hidden="true"></div>

    <div class="elite-cta__inner">
      <div class="elite-cta__mark">
        <span class="elite-cta__pulse" aria-hidden="true"></span>
        <picture data-built><source srcset="images/logo.webp" type="image/webp"><img src="images/logo.png" alt="E Multitech Solution" loading="lazy" width="131" height="32" decoding="async"></picture>
        <span class="elite-cta__sep" aria-hidden="true">/</span>
        <span class="elite-cta__status">${data.status}</span>
      </div>

      <h2 id="elite-cta-title" class="elite-cta__headline">
        <span class="elite-cta__h-line1">${data.line1}</span>
        <span class="elite-cta__h-line2">${data.line2}</span>
        <span class="elite-cta__h-line3">${data.line3}</span>
      </h2>

      <div class="elite-cta__rule" aria-hidden="true"></div>

      <dl class="elite-cta__stats">
${statsHtml}
      </dl>

      <div class="elite-cta__rule" aria-hidden="true"></div>

      <p class="elite-cta__lede">${data.lede}</p>

      <div class="elite-cta__action">
        <a href="request_quote.html" class="elite-cta__btn">
          <span>${data.btn}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>

      <p class="elite-cta__signature">
        <span class="elite-cta__signature-label">Direct line, founder-to-founder</span>
        <a href="https://wa.me/9779851038796" target="_blank" rel="noopener noreferrer">+977 9851038796</a>
        <span class="elite-cta__signature-name">&mdash; <a href="https://www.linkedin.com/in/roshan-subedi-7285b614/" target="_blank" rel="noopener noreferrer" class="founder-linkedin-inline">Roshan Subedi</a>, Founder &amp; MD &middot; 48-hour reply, engineer-only</span>
      </p>
    </div>
  </section>
`;
}

// Detect an already-inserted elite-cta block (for idempotence).
const HAS_ELITE_CTA_RE = /<section\s+class=["']elite-cta["']/i;

let updated = 0;
let skipped = 0;
for (const data of PAGES) {
  const path = join(ROOT, data.slug);
  const src = await readFile(path, 'utf8');

  if (HAS_ELITE_CTA_RE.test(src)) {
    console.log(`  SKIP    ${data.slug} (already has elite-cta)`);
    skipped++;
    continue;
  }

  // SAFE STRATEGY: always insert elite-cta just before </main>. We DO NOT try
  // to remove the legacy <section class="web__wrapper"> CTA via regex — the
  // first version of this script used a non-greedy regex with a lookahead
  // that backtracked across multiple <section> boundaries and silently
  // swallowed FAQ + similar-projects sections on penny-live.html.
  // Better to live with a small visual duplicate (legacy CTA + elite CTA) than
  // to risk content loss again. The legacy CTA can be deleted manually later
  // if it bothers anyone.
  const block = buildEliteCta(data);
  const out = src.replace(/(\s*<\/main>)/, `${block}$1`);
  await writeFile(path, out, 'utf8');
  console.log(`  INSERT  ${data.slug}`);
  updated++;
}

console.log(`\nadd-elite-cta-to-auction-pages: updated ${updated}, skipped ${skipped}, total ${PAGES.length}`);
