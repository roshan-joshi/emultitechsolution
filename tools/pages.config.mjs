/**
 * pages.config.mjs — single source of truth for per-page SEO metadata and
 * structured data. Consumed by tools/build-seo.mjs.
 *
 * Edit the entries below, then re-run:
 *     node tools/build-seo.mjs
 *
 * Each page entry supports:
 *   title       — <title> and og:title. Aim for ~55-60 chars. Brand suffix added auto.
 *   description — meta description, og:description, twitter:description. ~150-160 chars.
 *   image       — relative to ROOT, becomes absolute og:image. Defaults to SITE.defaultImage.
 *   type        — schema preset: 'home' | 'service' | 'about' | 'contact' | 'industry' |
 *                 'case' | 'blog' | 'blogPost' | 'portfolio' | 'testimonial' | 'policy' |
 *                 'auctionProduct' | 'clientShowcase' | 'page' (default)
 *   noindex     — set true to add <meta name="robots" content="noindex,follow">
 */

export const SITE = {
  url: 'https://www.emultitechsolution.com',
  name: 'E Multitech Solution',
  legalName: 'E Multitech Solution Pvt. Ltd.',
  brandSuffix: ' | E Multitech Solution',
  description:
    'Custom software, SaaS, AI, and mobile development partner building software continuously since 2010.',
  logo: 'images/logo.png',
  defaultImage: 'images/og-default.png',
  twitter: '', // e.g. '@emultitech' — leave empty until you have a handle
  founded: '2010',
  locations: [
    {
      name: 'Kathmandu (HQ)',
      streetAddress: 'Near UN Office, Kupondol',
      addressLocality: 'Lalitpur',
      addressRegion: 'Bagmati',
      addressCountry: 'NP',
      telephone: '+977-9851038796',
    },
    {
      name: 'Melbourne',
      addressLocality: 'Melbourne',
      addressCountry: 'AU',
      telephone: '+61-406-806-984',
    },
  ],
  social: [
    'https://www.facebook.com/emultitechsolutionnepal',
    'https://www.linkedin.com/company/emultitechsolution',
  ],
};

export const PAGES = {
  // ─── Core ──────────────────────────────────────────────────────────────
  'index.html': {
    title: 'Custom Software, SaaS & AI Partner',
    description:
      'Founder-led software engineering since 2010. hundreds of projects delivered worldwide — central-bank systems, European SaaS, marketplaces at scale.',
    type: 'home',
    image: 'images/og-default.png',
  },
  'about.html': {
    title: 'About — Software Engineering Since 2010',
    description:
      'Software engineering and digital product company established in Kathmandu in 2010 — AI-native engineering, auction expertise and platforms built to last.',
    type: 'about',
    image: 'images/about.png',
  },
  'contact.html': {
    title: 'Book a Strategy Call',
    description:
      'Book a free strategy call with the E Multitech engineering team. Pick a date and time slot — we confirm within 24 hours, no auto-responders.',
    type: 'contact',
    image: 'images/contact-bg.png',
  },
  'request_quote.html': {
    title: 'Get a Free Project Consultation',
    description:
      'Request a free project consultation. Tell us about your project, pick a discovery call slot, and get a response within 48 hours.',
    type: 'contact',
    image: 'images/contact-bg.png',
  },

  // ─── Service pages ─────────────────────────────────────────────────────
  'custom-software-development.html': {
    title: 'Custom Software Development Services',
    description:
      'Custom software built for production load since 2010. Litigation system for Nepal Rastra Bank, EU procurement SaaS, hundreds of projects delivered worldwide.',
    type: 'service',
    image: 'images/custom-software.jpg',
  },
  'saas-development.html': {
    title: 'SaaS Product Development Services',
    description:
      'Multi-tenant SaaS built to survive years in production. DiNePa: 99.4% uptime over 5+ years, sub-500ms latency for EU enterprise procurement.',
    type: 'service',
    image: 'images/data-marketing.jpg',
  },
  'mobile-development.html': {
    title: 'Mobile App Development Services',
    description:
      'iOS, Android, Flutter & React Native apps for marketplaces, logistics & healthcare EVV. Upkeep.pro: 500K+ daily appointments for 10K+ pros worldwide.',
    type: 'service',
    image: 'images/top-bg.png',
  },
  'ai-powered-solutions.html': {
    title: 'AI Solutions & Agentic Automation',
    description:
      'AI engineered into production systems — document intelligence, voice-to-text, risk detection, predictive ops. Built for regulated industries since 2010.',
    type: 'service',
    image: 'images/ai-solution.jpg',
  },
  'devops-engineer.html': {
    title: 'DevOps & Cloud Engineering',
    description:
      'Cloud, CI/CD, Kubernetes, IaC & SRE. DiNePa: 99.4% uptime over 5+ years. NRB: central-bank-grade intranet deployment. Founder-led since 2010.',
    type: 'service',
    image: 'images/devops.jpg',
  },
  'product-engineering.html': {
    title: 'Product Engineering Services',
    description:
      'End-to-end product engineering — discovery, design, build, ship, scale. For founders without a CTO. hundreds of projects across four verticals.',
    type: 'service',
    image: 'images/og-default.png',
  },
  'software-development.html': {
    title: 'Software Development Services',
    description:
      'Secure, scalable, high-performance software that streamlines operations and elevates user experience. Web, mobile, SaaS, and enterprise systems.',
    type: 'service',
    image: 'images/custom-software.jpg',
  },

  'healthcare-saas-development.html': {
    title: 'Healthcare SaaS Development Services',
    description:
      'HIPAA-architected healthcare SaaS for US home care, EVV & AI document intelligence. Founder-led since 2010 · in-house engineering team.',
    type: 'service',
    image: 'images/health-industries.jpg',
  },

  // ─── Industries ────────────────────────────────────────────────────────
  'industries.html': {
    title: 'Industries We Ship Production Software For',
    description:
      'Healthcare, banking, procurement, real estate, marketplaces & IoT — every vertical anchored by a named production case study. Building since 2010.',
    type: 'industry',
    image: 'images/og-default.png',
  },
  'healthcare.html': {
    title: 'Healthcare Software Development',
    description:
      'EHR, telehealth, clinical workflow, and hospital management software — engineered with HIPAA-architected isolation. Anchored by Adult Home Care SaaS case study.',
    type: 'industry',
    image: 'images/og-default.png',
  },
  'realestate.html': {
    title: 'Real Estate Software Development',
    description:
      'Property marketplaces, multi-class listings, MLS/IDX integrations, agent CMS & mortgage-ready lead capture. Anchored by MSG Homes, live in the Philippines.',
    type: 'industry',
    image: 'images/og-default.png',
  },

  // ─── Auction software hub + scripts ────────────────────────────────────
  'auction-software.html': {
    title: 'Auction Software Development Services',
    description:
      'Penny, reverse, unique-bid, Dutch, price-reveal & eBay-style auction software, built since 2010 for operators across the US, UK, EU, Asia & Australia.',
    type: 'service',
    image: 'images/auction.jpg',
  },
  'penny-live-auction-script-software.html': {
    title: 'Penny Auction Software (Live Bidding)',
    description:
      'Live penny auction software with bid extensions, bidding fees, auto-bid, and full operator controls. Deployed for clients across the US, UK, and EU since 2010.',
    type: 'auctionProduct',
    image: 'images/auction.jpg',
  },
  'highest-unique-bids-auction-script-online-highest-bid-software-services.html': {
    title: 'Highest Unique Bid Auction Script',
    description:
      'Highest Unique Bid auction software — secure scripts, full customization & proven deployments. Built for global auction operators since 2010.',
    type: 'auctionProduct',
    image: 'images/auction.jpg',
  },
  'lowest-unique-bid-auction-script-online-software-reverse-auction-low-bid.html': {
    title: 'Lowest Unique Bid Auction Script',
    description:
      'Customizable Lowest Unique Bid auction software for global operators. Reverse auction logic, secure scripts, and full operator control panel.',
    type: 'auctionProduct',
    image: 'images/auction.jpg',
  },
  'price-reveal-auction-script-express-auction-software-live-unique-bidding-system.html': {
    title: 'Price Reveal Auction Script',
    description:
      'Customized Price Reveal Auction scripts — hand-crafted, fully featured, and built on the latest stack. Proven across South-East Asia and global operators.',
    type: 'auctionProduct',
    image: 'images/auction.jpg',
  },
  'ebay-auction-like-ebay-script.html': {
    title: 'eBay-Style Marketplace Auction Script',
    description:
      'eBay-style marketplace auction script — 100% open-source, ready-built, fully customizable. Supports single and multi-seller marketplaces with one admin panel.',
    type: 'auctionProduct',
    image: 'images/auction.jpg',
  },

  // ─── Client showcases ──────────────────────────────────────────────────
  'auctioncents.html': {
    title: 'AuctionCents — US Penny Auction',
    description:
      'AuctionCents is a leading US penny auction platform built by E Multitech: membership tiers, auto-bid, master auto-bid, 24h, free, and bonus auctions.',
    type: 'clientShowcase',
    image: 'images/auctioncents1.jpg',
  },
  'bidbid.html': {
    title: 'BidBid.co.uk — Penny Auction Software',
    description:
      'BidBid.co.uk: a robust penny auction platform built with Node.js, PHP, MySQL, and jQuery. Auto-bid, CSV product upload, bonus auctions, 24h auctions.',
    type: 'clientShowcase',
    image: 'images/bidbid1.jpg',
  },
  'bienbid.html': {
    title: 'Bienbid — French Penny Auction',
    description:
      'Bienbid: a multilingual penny auction website with full French language support, a pre-bid booking system, auto-bid, and a flexible operator feature set.',
    type: 'clientShowcase',
    image: 'images/bibi.jpg',
  },
  'eodbox.html': {
    title: 'EodBox — Unique Bid Auction Platform',
    description:
      'EodBox: a Unique Bid auction with two-decimal-place bids, multi-currency, multi-language, PayTM / CCAvenue / PayPal, and push notifications, built on MVC.',
    type: 'clientShowcase',
    image: 'images/eodbox.jpg',
  },
  'onlinealku.html': {
    title: 'OnlineAlku — B2B Reverse Auction',
    description:
      'OnlineAlku is a multi-seller, multi-buyer B2B reverse auction platform. Tender-style procurement where buyers post needs and suppliers compete with live quotes.',
    type: 'clientShowcase',
    image: 'images/onlineauction.jpg',
  },
  'pigeononnet.html': {
    title: 'PigeonOnNet — Live Video Auction',
    description:
      'PigeonOnNet: a Dutch-style auction platform with live video streaming and simulcast for selling pigeons, plus forward and price-reveal auction support.',
    type: 'clientShowcase',
    image: 'images/pigeon.jpg',
  },
  'rubids.html': {
    title: 'Rubids — Live Auction Marketplace',
    description:
      'Rubids is a live auction marketplace with daily auctions across many categories — iOS, Android, and web — with coupons, games, and earning opportunities.',
    type: 'clientShowcase',
    image: 'images/rubids.jpg',
  },
  'smgbids.html': {
    title: 'SMG Bids — Lowest Unique Bid (UK)',
    description:
      'SMG Bids: a Lowest Unique Bid auction platform built for a UK client. Smartphone-ready, fast, with a user-friendly operator control panel.',
    type: 'clientShowcase',
    image: 'images/smgbid.jpg',
  },
  'ubidbuy.html': {
    title: 'uBiduBuy.sg — Low Bid + Reveal',
    description:
      'uBiduBuy: a Singapore-based luxury auction marketplace combining Lowest Unique Bid and Price Reveal formats with credit refund options for participants.',
    type: 'clientShowcase',
    image: 'images/ubidbuy.jpg',
  },

  // ─── Case studies ──────────────────────────────────────────────────────
  'case-studies.html': {
    title: 'Case Studies — Software We Shipped',
    description:
      'Real-world case studies from E Multitech: SaaS, AI, fintech, healthcare, auction platforms, and enterprise systems deployed for clients across 4 continents.',
    type: 'page',
    image: 'images/og-default.png',
  },
  'case-studies-detail.html': {
    title: 'SaaS EHR Case Study — Multi-Hospital',
    description:
      'How we built a SaaS EHR for a US healthcare institution: 25% better regulatory compliance and 50% faster access to patient records.',
    type: 'case',
    image: 'images/health-industries.jpg',
  },
  'dinepa-case-study.html': {
    title: 'DiNePa — Digital Negotiation SaaS',
    description:
      'How E Multitech built DiNePa: a multi-tenant real-time digital negotiation platform for European enterprise procurement. Reverse, forward & hybrid bidding.',
    type: 'case',
    image: 'images/dinepa.jpg',
  },
  'litigation-management-system-nepal-rastra-bank.html': {
    title: 'Litigation System — Nepal Rastra Bank',
    description:
      'Enterprise legal workflow platform built for Nepal Rastra Bank — central-bank-grade compliance, case tracking, document management, and audit logs.',
    type: 'case',
    image: 'images/custom-software.jpg',
  },
  'adult-home-care-saas-case-study.html': {
    title: 'AI-Powered Home Care SaaS — HIPAA Build',
    description:
      'AI-powered, HIPAA-architected home-care SaaS for a US operator — document intelligence, voice-to-text notes, predictive scheduling & risk detection.',
    type: 'case',
    image: 'images/health-industries.jpg',
  },
  'upkeep-service-booking-case-study.html': {
    title: 'Upkeep.pro Marketplace App Case Study',
    description:
      'How E Multitech built Upkeep.pro: dual-sided iOS, Android & web service-booking marketplace doing 500K+ daily appointments for 10K+ professionals worldwide.',
    type: 'case',
    image: 'images/upkeep.png',
  },
  'banking-fintech-software-development.html': {
    title: 'Banking & Fintech Software Development',
    description:
      'Central-bank-grade software: case tracking, audit logs, document management & regulatory workflow. Anchored by the Nepal Rastra Bank litigation system.',
    type: 'service',
    image: 'images/og-default.png',
  },
  'msg-homes-realty-case-study.html': {
    title: 'MSG Homes — Real Estate Marketplace',
    description:
      'How we built msg-homes.com for My Saving Grace Realty — multi-region real estate marketplace covering 6 property types across the Philippines, bank-integrated.',
    type: 'case',
    image: 'images/urban.png',
  },

  // ─── Blog ──────────────────────────────────────────────────────────────
  'blog.html': {
    title: 'Engineering Blog — SaaS & AI',
    description:
      'Engineering insights on custom software, SaaS, AI, and product strategy from the E Multitech team. Articles for founders, CTOs, and product leaders.',
    type: 'blog',
  },
  'blog-detail.html': {
    title: 'Crypto Exchange Fees in Australia',
    description:
      'Understand how Australian crypto exchange fees work, what to look out for, and how to choose the right exchange. A comprehensive guide for Aussie traders.',
    type: 'blogPost',
  },

  'team.html': {
    title: 'Our Team — Engineering & Leadership',
    description:
      'Meet the team behind hundreds of projects. Founder-led in-house engineering in Kathmandu since October 2010, APAC partner in Melbourne. No subcontractors.',
    type: 'page',
    image: 'images/about.png',
  },
  'security.html': {
    title: 'Security & Compliance Posture',
    description:
      'Our security architecture, compliance posture & due-diligence summary — HIPAA-aligned, BAA available, multi-tenant isolation. For US & EU clients.',
    type: 'page',
    image: 'images/og-default.png',
  },

  // ─── Other ─────────────────────────────────────────────────────────────
  'works.html': {
    title: 'Our Portfolio of Software Projects',
    description:
      'Portfolio of web, mobile, SaaS, AI & auction platforms — hundreds of projects delivered worldwide, founder-led and built in-house since 2010.',
    type: 'portfolio',
    image: 'images/og-default.png',
  },
  'testimonial-all.html': {
    title: 'Client Testimonials',
    description:
      'What our clients say about working with E Multitech Solution — from US-based founders to enterprise project leads across Europe and Asia.',
    type: 'testimonial',
    image: 'images/about.png',
  },

  // ─── Legal ─────────────────────────────────────────────────────────────
  'privacy-policy.html': {
    title: 'Privacy Policy',
    description:
      'How E Multitech Solution collects, uses, and protects your personal information when you use this website or engage with our team.',
    type: 'policy',
  },
  'terms-of-condition.html': {
    title: 'Terms & Conditions',
    description:
      'Terms and conditions governing your use of the E Multitech Solution website and services. Please read before engaging our team.',
    type: 'policy',
  },
  'cookie-policy.html': {
    title: 'Cookie Policy',
    description:
      'How E Multitech Solution uses cookies on this website, what each category is for, and how you can manage your cookie preferences.',
    type: 'policy',
  },

  // ─── 404 ───────────────────────────────────────────────────────────────
  '404.html': {
    title: 'Page Not Found',
    description:
      'The page you’re looking for doesn’t exist. Try the homepage, browse our services, or contact us.',
    type: 'page',
    noindex: true,
  },
};
