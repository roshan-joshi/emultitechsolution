/**
 * refresh-auction-pages.mjs — bulk-refresh 12 legacy auction pages with elite design.
 *
 * Splits into two templates:
 *   FORMAT pages  — describe an auction PATTERN we ship as a script
 *   CLIENT pages  — describe a specific past production deployment
 *
 * Each page preserves its existing head (SEO meta from build-seo.mjs) and the
 * HEADER:START/END + FOOTER:START/END blocks managed by build-pages.mjs. Only
 * the <main> section is replaced.
 *
 * Run:  node tools/refresh-auction-pages.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// ─── Page data ───────────────────────────────────────────────────────────────

const FORMAT_PAGES = [
  {
    slug: 'penny-live-auction-script-software.html',
    formatName: 'Penny Auction',
    breadcrumb: 'Penny Auction Software',
    headline: 'Penny auction software that survives a live launch weekend.',
    eyebrow: 'PENNY AUCTION FORMAT · SHIPPED SINCE 2011',
    sub: 'A bidding fee per bid. Auction time extends by N seconds on each late bid. Last bid at zero time wins. We have shipped this format for operators in the UK (bidbid.co.uk), Morocco (Bienbid), and across Europe — engineered for the spiky concurrency that arrives in the final 30 seconds of every auction.',
    proofClients: [
      { name: 'bidbid.co.uk', country: 'UK', live: 'https://www.bidbid.co.uk/en' },
      { name: 'Bienbid', country: 'Morocco' },
      { name: 'Auktis', country: 'Europe (multi-language)' },
      { name: 'Bid It More / Fourbidder / TiptopBids', country: 'multi-market' },
    ],
    features: [
      { title: 'Bidding-fee economics', body: 'Per-bid fee deducted from the user wallet at bid time. Configurable fee per auction. Wallet top-up via the major payment gateways (Stripe, PayPal, regional cards).' },
      { title: 'Time-extension logic', body: 'Auction time extends by a configurable number of seconds when a bid arrives in the last N seconds. Prevents sniping while keeping the auction lively.' },
      { title: 'Auto-bidder (bot mode)', body: 'Users can pre-fund an auto-bid that fires when they get outbid. Server-side, not client-side — fair under concurrency.' },
      { title: 'Capacity for spike traffic', body: 'The last 30 seconds of a penny auction is when 80% of bid volume arrives. The architecture is sized for that spike, not the average.' },
      { title: 'Bonus auctions & free-bid promotions', body: 'Operator-configurable promotional auction types — free bids, bonus credits, new-user welcome offers — without code release.' },
      { title: 'Operator control panel', body: 'Live auction monitoring, bid history, user wallet management, payout queue, fraud signals, refund tooling — everything the operator needs to run the floor.' },
    ],
    techStack: 'PHP 8 / Laravel 9 / MySQL 8 default · Node.js + TypeScript + PostgreSQL for new builds · Redis-backed bid queue · WebSocket for live timer · Stripe + PayPal payments',
  },
  {
    slug: 'lowest-unique-bid-auction-script-online-software-reverse-auction-low-bid.html',
    formatName: 'Lowest Unique Bid',
    breadcrumb: 'Lowest Unique Bid Auction',
    headline: 'Lowest unique bid auctions, engineered for the integrity that decides every winner.',
    eyebrow: 'LOWEST UNIQUE BID · SHIPPED SINCE 2011',
    sub: 'The winner is the player who places the lowest bid that no one else has placed. The whole format lives or dies on bid integrity — duplicate-detection has to be airtight, bid-time has to be authoritative, and the reveal has to be defensible. We have shipped this format across the US, UK, Europe, and Asia.',
    proofClients: [
      { name: 'SMG Bids', country: 'multi-market' },
      { name: 'Pyrabid', country: 'UK' },
      { name: 'Bid For Sin', country: 'multi-market' },
      { name: 'Chase Bid / Lambobidz / Gift Card Auctions', country: 'multi-market' },
    ],
    features: [
      { title: 'Atomic bid-uniqueness check', body: 'Bid uniqueness is enforced at the database level, not the application level. Two players can never accidentally win because of a race condition.' },
      { title: 'Authoritative bid timing', body: 'Bid timestamps come from the server clock, not the client. Eliminates timezone tricks and client-side clock manipulation.' },
      { title: 'Pay-per-bid wallet economics', body: 'Each bid costs the configured fee. Wallet top-up, payment gateway integration, refund tooling all built in.' },
      { title: 'Reveal mechanics', body: 'Winner reveal is auditable — bid log can be exported and replayed at any time. Players can verify their own bids.' },
      { title: 'Fraud signals & abuse controls', body: 'Multi-account detection, IP-fingerprinting flags, velocity limits, captcha challenges, operator-controllable bid throttles.' },
      { title: 'Operator analytics', body: 'Win rate per user, bid distribution histograms, auction-by-auction P&L — the numbers operators actually use to tune the format.' },
    ],
    techStack: 'PHP 8 / Laravel 9 / MySQL 8 with unique-constraint enforcement · Redis bid cache · server-authoritative timestamps · Stripe payments',
  },
  {
    slug: 'highest-unique-bids-auction-script-online-highest-bid-software-services.html',
    formatName: 'Highest Unique Bid',
    breadcrumb: 'Highest Unique Bid Auction',
    headline: 'Highest unique bid auctions, with the same integrity bar as lowest-unique.',
    eyebrow: 'HIGHEST UNIQUE BID · SHIPPED SINCE 2011',
    sub: 'The winner is the player who places the highest bid no one else has placed. Same integrity demands as lowest-unique — duplicate detection, authoritative timing, defensible reveal — applied to the inverse direction. Shipped for Gift Card Auction and other operators.',
    proofClients: [
      { name: 'Gift Card Auction', country: 'multi-market' },
      { name: 'Highest-Unique format spec', country: 'pattern-tested across portfolio' },
    ],
    features: [
      { title: 'Atomic uniqueness on the high side', body: 'Same database-level uniqueness as lowest-unique, applied to the highest bid. Two players cannot both win on the same value.' },
      { title: 'Authoritative server-side timing', body: 'Bid timestamps come from the server, not the client. Decides ties in player favour where the rule applies.' },
      { title: 'Pay-per-bid wallet economics', body: 'Per-bid fee, configurable per auction. Same wallet + payment-gateway integration as the lowest-unique format.' },
      { title: 'Reveal & audit log', body: 'Winner reveal exports a bid log that can be replayed by the operator (and, where the format requires, by the player).' },
      { title: 'Fraud & abuse controls', body: 'Same multi-account, IP, velocity, captcha, and throttle tooling as lowest-unique. Both formats share the same anti-abuse foundation.' },
      { title: 'Operator dashboard', body: 'Bid distribution, win-rate analytics, P&L per auction, refund tooling, manual-adjustment workflow with full audit log.' },
    ],
    techStack: 'PHP 8 / Laravel 9 / MySQL 8 · Redis bid cache · server-authoritative timestamps · shared anti-abuse module with lowest-unique',
  },
  {
    slug: 'price-reveal-auction-script-express-auction-software-live-unique-bidding-system.html',
    formatName: 'Price Reveal Auction',
    breadcrumb: 'Price Reveal Auction',
    headline: 'Price-reveal auctions — the format that turns every bid into a discovery moment.',
    eyebrow: 'PRICE REVEAL · SHIPPED SINCE 2011',
    sub: 'Players pay a small fee to reveal the current auction price. The price moves on a configurable curve; the player who chooses to commit at the right price wins. Shipped in the UK (TopEncheres), Singapore (uBidUBuy), and across multiple European markets — engineered for the latency-sensitive reveal interaction.',
    proofClients: [
      { name: 'uBidUBuy.sg', country: 'Singapore' },
      { name: 'TopEncheres', country: 'France' },
      { name: 'YouBid', country: 'multi-market' },
      { name: 'SubastasGamer', country: 'gaming vertical' },
    ],
    features: [
      { title: 'Configurable price curves', body: 'Price-reveal curve is operator-configurable: linear, stepped, exponential. Each auction can use a different curve. No code release required.' },
      { title: 'Low-latency reveal interaction', body: 'The reveal-the-price interaction has to feel instant. Edge caching + WebSocket fan-out keeps the reveal under 200ms even at peak load.' },
      { title: 'Commit-to-win mechanic', body: 'After revealing, the player can commit or skip. Commit locks in the price; skip costs only the reveal fee. State machine prevents double-commits.' },
      { title: 'Reveal-fee + commit-fee economics', body: 'Per-reveal fee + per-commit fee, both configurable. Wallet top-up via the major payment gateways.' },
      { title: 'Anti-griefing controls', body: 'Velocity limits on reveals (a single player can\'t spam-reveal a price curve into the floor). Cooldowns between reveals are operator-configurable.' },
      { title: 'Operator analytics', body: 'Reveal/commit funnel per auction, price-curve performance, player engagement distribution, P&L per auction.' },
    ],
    techStack: 'Node.js + TypeScript + WebSocket for low-latency reveal · Redis for shared reveal state · PostgreSQL for durable bid record · Stripe + regional payment gateways',
  },
  {
    slug: 'ebay-auction-like-ebay-script.html',
    formatName: 'eBay-Style Auction',
    breadcrumb: 'eBay-Style Auction',
    headline: 'eBay-style auctions — the classic "highest bid wins" format, engineered properly.',
    eyebrow: 'EBAY-STYLE FORMAT · SHIPPED SINCE 2011',
    sub: 'Highest bid at close wins. Proxy bidding (user sets max, system bids up automatically). Auction extension on late bids. Watchlists, saved searches, seller reputation. We have shipped this format for general-purpose marketplaces (Bidcy), automotive (Classic Car Auctions, Teslabidz), and specialty verticals (Equine Group horse syndication).',
    proofClients: [
      { name: 'Bidcy', country: 'eBay-style general' },
      { name: 'Classic Car Auctions', country: 'automotive' },
      { name: 'Teslabidz', country: 'automotive specialty' },
      { name: 'Equine Group', country: 'horse syndication' },
    ],
    features: [
      { title: 'Proxy bidding engine', body: 'User sets a maximum bid; system bids up to it automatically as others bid. Server-side, atomic — no double-bid race conditions.' },
      { title: 'Auction-extension on late bids', body: 'When a bid arrives in the last N seconds, the auction extends by N seconds. Prevents sniping at scale.' },
      { title: 'Watchlist + saved searches', body: 'Buyers can watch auctions, save searches that match their criteria, and get notified when matching auctions are listed.' },
      { title: 'Seller reputation system', body: 'Buyer feedback after each transaction. Aggregated reputation score visible on every listing.' },
      { title: 'Listing fees + final value fees', body: 'Configurable listing fees + seller final-value fees (% of winning bid). Payouts via configured payment processor.' },
      { title: 'Dispute resolution workflow', body: 'Built-in dispute opening, evidence upload, mediator workflow, and resolution outcomes — the operational machinery a marketplace needs at scale.' },
    ],
    techStack: 'PHP 8 / Laravel 9 / MySQL 8 default · Node.js for high-concurrency variants · Redis-backed bid cache · proxy-bid engine isolated from UI · Stripe + PayPal payments',
  },
];

const CLIENT_PAGES = [
  {
    slug: 'bidbid.html',
    client: 'bidbid.co.uk',
    country: 'United Kingdom',
    format: 'Penny Auction',
    formatHref: 'penny-live-auction-script-software.html',
    liveUrl: 'https://www.bidbid.co.uk/en',
    technologies: 'CodeIgniter MVC · PHP · MySQL · jQuery · WebSocket bid feed',
    proofPoints: [
      'Live in production at bidbid.co.uk today',
      'UK market — multi-currency, GBP-native pricing',
      'Penny auction with full operator panel',
      'Auto-bid + bonus auctions + free-credit promotions',
    ],
    summary: 'A live, in-production penny auction platform serving the UK market. Built on a CodeIgniter MVC + PHP + MySQL stack, with a real-time bidding feed and the operator tooling required to run a daily auction floor. bidbid.co.uk is the longest-running auction platform in our portfolio still on the public web — and the easiest proof point we offer.',
  },
  {
    slug: 'eodbox.html',
    client: 'EodBox',
    country: 'United Kingdom',
    format: 'Unique Bid Auction',
    formatHref: 'lowest-unique-bid-auction-script-online-software-reverse-auction-low-bid.html',
    technologies: 'PHP · MySQL · jQuery · server-authoritative bid timing',
    proofPoints: [
      'Unique bid auction system — "shop at the lowest price"',
      'Multi-product catalogue with daily auction cycles',
      'Pay-per-bid wallet economics + payment gateway',
      'Operator panel with bid analytics',
    ],
    summary: 'A unique-bid auction platform built around the "lowest price wins" promise. The platform handles per-bid fees, wallet top-up, daily auction cycles, and the operator tooling to run multi-product catalogs — built with our standard server-authoritative bid-timing architecture so bid integrity is never in dispute.',
  },
  {
    slug: 'rubids.html',
    client: 'Rubids',
    country: 'multi-market',
    format: 'Multi-Type Auction',
    formatHref: 'auction-software.html',
    technologies: 'PHP · MySQL · multi-format engine · operator-configurable rules',
    proofPoints: [
      'Multi-type auction engine — penny, unique-bid, eBay-style in one platform',
      'Operator can launch any format from a single admin panel',
      'Shared bidder identity across all auction types',
      'Single wallet across formats',
    ],
    summary: 'A platform that ships every major auction format from a single engine: penny, unique-bid, highest-bid, eBay-style. Useful for operators who want to A/B test formats with the same audience, or who run different campaigns across formats. Single user identity, single wallet, single operator panel.',
  },
  {
    slug: 'smgbids.html',
    client: 'SMG Bids',
    country: 'multi-market',
    format: 'Lowest Unique Bid',
    formatHref: 'lowest-unique-bid-auction-script-online-software-reverse-auction-low-bid.html',
    technologies: 'PHP · MySQL · atomic uniqueness constraints · authoritative timing',
    proofPoints: [
      'Lowest-unique-bid format with airtight uniqueness',
      'Pay-per-bid wallet economics',
      'Multi-product catalog with rolling auction schedule',
      'Operator analytics + manual-adjustment workflow',
    ],
    summary: 'A lowest-unique-bid auction platform built on our standard atomic-uniqueness and server-authoritative-timing architecture. The kind of platform where bid integrity decides every winner — and that integrity is enforced at the database level, not the application level.',
  },
  {
    slug: 'bienbid.html',
    client: 'Bienbid.ma',
    country: 'Morocco',
    format: 'Penny Auction (Seat Booking)',
    formatHref: 'penny-live-auction-script-software.html',
    technologies: 'PHP · MySQL · Moroccan dirham (MAD) pricing · French + Arabic interface',
    proofPoints: [
      'Penny auction platform for the Moroccan market',
      'Hybrid format: seat-booking auctions for events + travel',
      'Native MAD pricing + localised payment gateways',
      'Bilingual French/Arabic interface',
    ],
    summary: 'A penny auction platform for the Moroccan market with a seat-booking twist — auctions for event tickets and travel seats. Localised for the Moroccan payment ecosystem, bilingual French/Arabic interface, MAD-native pricing. The localisation work is what made the platform shippable in-market.',
  },
  {
    slug: 'ubidbuy.html',
    client: 'uBidUBuy.sg',
    country: 'Singapore',
    format: 'Price Reveal & Lowest-Unique Bid',
    formatHref: 'price-reveal-auction-script-express-auction-software-live-unique-bidding-system.html',
    technologies: 'PHP · MySQL · WebSocket reveal feed · multi-currency · SGD-native pricing',
    proofPoints: [
      'Dual format: price-reveal + lowest-unique-bid in one platform',
      'Singapore market — SGD pricing + regional payment gateways',
      'Low-latency reveal interaction (sub-200ms)',
      'Operator analytics across both formats',
    ],
    summary: 'A Singapore-market auction platform that ships two formats from a single engine: price-reveal and lowest-unique-bid. The reveal interaction is engineered for sub-200ms latency so the format feels instantaneous; the lowest-unique format runs on our standard atomic-uniqueness architecture. SGD-native pricing, regional payment gateways.',
  },
  {
    slug: 'onlinealku.html',
    client: 'ONLINEALKU',
    country: 'multi-market',
    format: 'Reverse Auction',
    formatHref: 'auction-software.html',
    technologies: 'PHP · MySQL · reverse-bidding state machine · operator-configurable rules',
    proofPoints: [
      'Pure reverse-auction format — suppliers bid down',
      'Operator-configurable bid-decrement rules',
      'Supplier directory + verification workflow',
      'Award-decision audit log for procurement compliance',
    ],
    summary: 'A reverse-auction platform — suppliers bid DOWN against each other to win the buyer\'s business. Operator-configurable bid-decrement rules, supplier verification workflow, award-decision audit log for procurement compliance. The format that DiNePa later evolved into a multi-tenant enterprise SaaS — but ONLINEALKU is where we first shipped it.',
  },
];

// ─── Templates ───────────────────────────────────────────────────────────────

function renderFormatMain(data) {
  const proofList = data.proofClients
    .map((c) => {
      const inner = c.live
        ? `<a href="${c.live}" target="_blank" rel="noopener noreferrer">${c.name}</a>`
        : c.name;
      return `<li><strong>${inner}</strong> &middot; ${c.country}</li>`;
    })
    .join('\n          ');

  const featureCards = data.features
    .map(
      (f) => `
        <article class="industry-card">
          <div class="industry-card__icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <h3 class="industry-card__name">${f.title}</h3>
          <p class="industry-card__scope">${f.body}</p>
        </article>`,
    )
    .join('\n');

  return `<main id="main">
    <h1 class="a11y-sr-only">${data.formatName} Software</h1>

    <!-- PILLAR HERO -->
    <section class="pillar-hero">
      <div class="pillar-hero__aurora" aria-hidden="true"></div>
      <div class="pillar-hero__grid" aria-hidden="true"></div>

      <div class="pillar-hero__inner">
        <nav class="industries-hero__crumb" aria-label="Breadcrumb" style="margin-bottom: 1.25rem;">
          <a href="index.html">Home</a> <span aria-hidden="true">&rsaquo;</span>
          <a href="auction-software.html">Auction Software</a> <span aria-hidden="true">&rsaquo;</span>
          <span>${data.breadcrumb}</span>
        </nav>
        <p class="pillar-hero__eyebrow" data-reveal>${data.eyebrow}</p>
        <h1 class="pillar-hero__h1" data-reveal data-reveal-delay="1">${data.headline}</h1>
        <p class="pillar-hero__sub" data-reveal data-reveal-delay="2">${data.sub}</p>
        <div class="pillar-hero__cta" data-reveal data-reveal-delay="3">
          <a href="request_quote.html" class="btn btn-hero">Get a Free Technical Proposal</a>
          <a href="auction-software.html" class="btn btn-hero-white">Back to Auction Pillar &rarr;</a>
        </div>
      </div>
    </section>

    <!-- WHERE WE'VE SHIPPED THIS FORMAT -->
    <section class="pillar-section">
      <div class="pillar-section__inner">
        <header class="pillar-section__head" data-reveal>
          <p class="pillar-section__eyebrow">PRODUCTION DEPLOYMENTS</p>
          <h2 class="pillar-section__h2">Where we have shipped the ${data.formatName.toLowerCase()} format.</h2>
        </header>
        <ul style="list-style:none;padding:0;max-width:780px;margin:1.5rem 0 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0.85rem;font-size:1rem;line-height:1.5;color:rgba(15,23,42,0.78);" data-reveal data-reveal-delay="1">
          ${proofList}
        </ul>
      </div>
    </section>

    <!-- FEATURES SHIPPED -->
    <section class="pillar-section pillar-section--alt">
      <div class="pillar-section__inner">
        <header class="pillar-section__head" data-reveal>
          <p class="pillar-section__eyebrow">FEATURES WE SHIP</p>
          <h2 class="pillar-section__h2">The six features every ${data.formatName.toLowerCase()} operator needs.</h2>
        </header>

        <div class="industry-grid" data-reveal data-reveal-delay="1">${featureCards}
        </div>
      </div>
    </section>

    <!-- TECH STACK -->
    <section class="pillar-section">
      <div class="pillar-section__inner">
        <header class="pillar-section__head" data-reveal>
          <p class="pillar-section__eyebrow">TECH STACK</p>
          <h2 class="pillar-section__h2">What we use for ${data.formatName.toLowerCase()} builds.</h2>
        </header>
        <p data-reveal data-reveal-delay="1" style="max-width:760px;font-size:1.05rem;line-height:1.6;color:rgba(15,23,42,0.78);margin:1rem 0 0;">${data.techStack}</p>
      </div>
    </section>

    <!-- ELITE CTA -->
    <section class="elite-cta" aria-labelledby="elite-cta-title">
      <div class="elite-cta__aurora" aria-hidden="true"></div>
      <div class="elite-cta__grid" aria-hidden="true"></div>

      <div class="elite-cta__inner">
        <div class="elite-cta__mark">
          <span class="elite-cta__pulse" aria-hidden="true"></span>
          <picture data-built><source srcset="images/logo.webp" type="image/webp"><img src="images/logo.png" alt="E Multitech Solution" loading="lazy" width="131" height="32" decoding="async"></picture>
          <span class="elite-cta__sep" aria-hidden="true">/</span>
          <span class="elite-cta__status">${data.formatName} format</span>
        </div>

        <h2 id="elite-cta-title" class="elite-cta__headline">
          <span class="elite-cta__h-line1">Build the ${data.formatName.toLowerCase()} platform</span>
          <span class="elite-cta__h-line2">that survives a real</span>
          <span class="elite-cta__h-line3">live-launch weekend.</span>
        </h2>

        <div class="elite-cta__rule" aria-hidden="true"></div>

        <p class="elite-cta__lede">Tell us your auction economics. We will tell you the architecture we would ship on day one.</p>

        <div class="elite-cta__action">
          <a href="request_quote.html" class="elite-cta__btn">
            <span>Book an auction architecture call</span>
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
  </main>`;
}

function renderClientMain(data) {
  const liveBadge = data.liveUrl
    ? `<a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-hero-white" style="margin-left:0.5rem;">Visit ${data.client} &rarr;</a>`
    : '';
  const proofList = data.proofPoints
    .map((p) => `<li>${p}</li>`)
    .join('\n          ');

  return `<main id="main">
    <h1 class="a11y-sr-only">${data.client} &mdash; ${data.format} Platform</h1>

    <!-- PILLAR HERO -->
    <section class="pillar-hero">
      <div class="pillar-hero__aurora" aria-hidden="true"></div>
      <div class="pillar-hero__grid" aria-hidden="true"></div>

      <div class="pillar-hero__inner">
        <nav class="industries-hero__crumb" aria-label="Breadcrumb" style="margin-bottom: 1.25rem;">
          <a href="index.html">Home</a> <span aria-hidden="true">&rsaquo;</span>
          <a href="auction-software.html">Auction Software</a> <span aria-hidden="true">&rsaquo;</span>
          <a href="${data.formatHref}">${data.format}</a> <span aria-hidden="true">&rsaquo;</span>
          <span>${data.client}</span>
        </nav>
        <p class="pillar-hero__eyebrow" data-reveal>PRODUCTION DEPLOYMENT &middot; ${data.country.toUpperCase()}</p>
        <h1 class="pillar-hero__h1" data-reveal data-reveal-delay="1">${data.client} &mdash; ${data.format}</h1>
        <p class="pillar-hero__sub" data-reveal data-reveal-delay="2">${data.summary}</p>
        <div class="pillar-hero__cta" data-reveal data-reveal-delay="3">
          <a href="request_quote.html" class="btn btn-hero">Discuss a Similar Project</a>
          ${liveBadge}
        </div>
      </div>
    </section>

    <!-- PROJECT FACTS -->
    <section class="pillar-section">
      <div class="pillar-section__inner">
        <header class="pillar-section__head" data-reveal>
          <p class="pillar-section__eyebrow">PROJECT FACTS</p>
          <h2 class="pillar-section__h2">What ${data.client} ships in production.</h2>
        </header>
        <ul style="list-style:none;padding:0;max-width:760px;margin:1.5rem 0 0;display:grid;gap:0.7rem;font-size:1rem;line-height:1.5;color:rgba(15,23,42,0.78);" data-reveal data-reveal-delay="1">
          ${proofList}
        </ul>
        <div data-reveal data-reveal-delay="2" style="max-width:760px;margin-top:1.75rem;padding:1.1rem 1.25rem;background:#f7f9fc;border:1px solid rgba(15,23,42,0.08);border-radius:12px;">
          <p style="margin:0 0 0.35rem;font-size:0.72rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:rgba(15,23,42,0.55);">Tech stack</p>
          <p style="margin:0;font-size:0.95rem;line-height:1.5;color:rgba(15,23,42,0.78);">${data.technologies}</p>
        </div>
      </div>
    </section>

    <!-- WHY THIS MATTERS -->
    <section class="pillar-section pillar-section--alt">
      <div class="pillar-section__inner">
        <header class="pillar-section__head" data-reveal>
          <p class="pillar-section__eyebrow">WHY THIS MATTERS</p>
          <h2 class="pillar-section__h2">A real client, a real platform &mdash; not a portfolio thumbnail.</h2>
        </header>
        <div data-reveal data-reveal-delay="1" style="max-width:780px;font-size:1.05rem;line-height:1.6;color:rgba(15,23,42,0.78);">
          <p>Every page in this auction long-tail is a real production deployment. Some are still publicly live; some have served their commercial life and the operator moved on. All were engineered by the same team, on the same architecture, with the same standard of bid integrity, payment handling, and operator tooling.</p>
          <p>If you are evaluating an auction-software vendor, what you want to see is consistency &mdash; that the team can ship the same auction format twice, in different markets, with different rule configurations, and still get it right. That is what this page documents.</p>
        </div>
        <div data-reveal data-reveal-delay="2" style="margin-top:1.5rem;">
          <a href="${data.formatHref}" class="btn btn-hero-white">See the ${data.format} format page &rarr;</a>
        </div>
      </div>
    </section>

    <!-- ELITE CTA -->
    <section class="elite-cta" aria-labelledby="elite-cta-title">
      <div class="elite-cta__aurora" aria-hidden="true"></div>
      <div class="elite-cta__grid" aria-hidden="true"></div>

      <div class="elite-cta__inner">
        <div class="elite-cta__mark">
          <span class="elite-cta__pulse" aria-hidden="true"></span>
          <picture data-built><source srcset="images/logo.webp" type="image/webp"><img src="images/logo.png" alt="E Multitech Solution" loading="lazy" width="131" height="32" decoding="async"></picture>
          <span class="elite-cta__sep" aria-hidden="true">/</span>
          <span class="elite-cta__status">${data.format} &middot; ${data.country}</span>
        </div>

        <h2 id="elite-cta-title" class="elite-cta__headline">
          <span class="elite-cta__h-line1">Ship a ${data.format.toLowerCase()} platform</span>
          <span class="elite-cta__h-line2">with the same architecture</span>
          <span class="elite-cta__h-line3">that runs ${data.client}.</span>
        </h2>

        <div class="elite-cta__rule" aria-hidden="true"></div>

        <p class="elite-cta__lede">Tell us your market and your rules. We will tell you what would carry over from ${data.client}.</p>

        <div class="elite-cta__action">
          <a href="request_quote.html" class="elite-cta__btn">
            <span>Book an auction architecture call</span>
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
  </main>`;
}

// ─── Apply transformation ────────────────────────────────────────────────────

async function refreshPage(slug, newMain) {
  const path = join(ROOT, slug);
  const src = await readFile(path, 'utf8');
  // Find the existing <main id="main"> block and replace it.
  const startMarker = '<main id="main">';
  const startIdx = src.indexOf(startMarker);
  if (startIdx === -1) {
    console.warn(`  SKIP ${slug} — no <main id="main"> marker found`);
    return false;
  }
  // The legacy </main> always sits at column-2 indent in these pages.
  const endMarker = '</main>';
  const endIdx = src.indexOf(endMarker, startIdx);
  if (endIdx === -1) {
    console.warn(`  SKIP ${slug} — no </main> marker found after start`);
    return false;
  }
  const out = src.slice(0, startIdx) + newMain + src.slice(endIdx + endMarker.length);
  await writeFile(path, out, 'utf8');
  return true;
}

let updated = 0;
console.log('refresh-auction-pages: format pages');
for (const data of FORMAT_PAGES) {
  const ok = await refreshPage(data.slug, renderFormatMain(data));
  if (ok) { console.log(`  -> ${data.slug}`); updated++; }
}
console.log('refresh-auction-pages: client pages');
for (const data of CLIENT_PAGES) {
  const ok = await refreshPage(data.slug, renderClientMain(data));
  if (ok) { console.log(`  -> ${data.slug}`); updated++; }
}
console.log(`refresh-auction-pages: updated ${updated} pages`);
