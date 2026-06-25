/**
 * header.js
 * Injects the site-wide header and navigation into any page.
 * Usage: <div id="site-header"></div>  (before closing </body>)
 * Or simply include this script — it auto-injects into #site-header if present,
 * otherwise prepends to <body>.
 */

(function () {
  const headerHTML = `
  <a class="a11y-skip-link" href="#main">Skip to main content</a>
  <header>
    <nav class="navbar navbar-light blue-bg fixed-top" aria-label="Primary navigation">
      <div class="container-fluid d-flex justify-content-between">
        <a class="navbar-brand" href="index.html" aria-label="E Multitech Solution — go to homepage">
          <img src="images/logo.png" alt="E Multitech Solution" height="42">
        </a>

        <div class="right--bar">
          <div class="contact-info">
            <a id="top-bar-phone" href="https://wa.me/9779851038796" target="_blank" rel="noopener noreferrer"
               data-wa-default="9779851038796" data-label-default="+977 9851038796"
               data-wa-au="61406806984" data-label-au="+61 406 806 984"
               aria-label="Chat with us on WhatsApp at +977 9851038796">
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> <span class="phone-number">+977 9851038796</span>
            </a>
          </div>
          <button class="navbar-toggler" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="navbarMenu" onclick="toggleMenu()">
            <img src="images/nav-toggle-icon.png" alt="" aria-hidden="true" loading="lazy">
          </button>
        </div>
      </div>
    </nav>
  </header>

  <div class="menu-backdrop" id="menuBackdrop" onclick="closeMenu()" aria-hidden="true"></div>
  <aside class="navbar-collapse" id="navbarMenu" role="dialog" aria-label="Site navigation menu" aria-modal="false">
    <button class="menu-close" type="button" aria-label="Close navigation menu" onclick="closeMenu()">&times;</button>
    <ul class="navbar-nav">
      <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
      <li class="nav-item">
        <button class="nav-link dropdown-toggle" type="button" id="servicesDropdown" aria-haspopup="true" aria-expanded="false" aria-controls="servicesMenu" onclick="toggleDropdown(this)">Services</button>
        <div class="dropdown-menu" id="servicesMenu" role="menu" aria-labelledby="servicesDropdown">
          <a class="dropdown-item" role="menuitem" href="ai-powered-solutions.html">AI Solutions &amp; Automation</a>
          <a class="dropdown-item" role="menuitem" href="custom-software-development.html">Custom Software Development</a>
          <a class="dropdown-item" role="menuitem" href="saas-development.html">SaaS Product Development</a>
          <a class="dropdown-item" role="menuitem" href="mobile-development.html">Mobile App Development</a>
          <a class="dropdown-item" role="menuitem" href="devops-engineer.html">DevOps &amp; Cloud Engineering</a>
          <a class="dropdown-item" role="menuitem" href="product-engineering.html">Product Engineering</a>
          <div class="dropdown-subhead" role="presentation">Specialty</div>
          <a class="dropdown-item" role="menuitem" href="auction-software.html">Auction Software</a>
        </div>
      </li>
      <li class="nav-item"><a class="nav-link" href="case-studies.html">Case Studies</a></li>
      <li class="nav-item"><a class="nav-link" href="industries.html">Industries</a></li>
      <li class="nav-item"><a class="nav-link" href="works.html">Our Works</a></li>
      <li class="nav-item"><a class="nav-link" href="blog.html">Blog</a></li>
      <li class="nav-item"><a class="nav-link" href="testimonial-all.html">Testimonials</a></li>
      <li class="nav-item"><a class="nav-link" href="contact.html">Contact Us</a></li>
    </ul>
  </aside>
  `;

  // Inject the header at runtime ONLY if the page doesn't already have one.
  // Pages built by tools/build-pages.mjs have the header HTML inlined directly
  // (so crawlers and AI bots see real content) — in that case this is a no-op.
  const placeholder = document.getElementById('site-header');
  const hasInlinedHeader = document.querySelector('header') !== null;
  if (!hasInlinedHeader) {
    if (placeholder) {
      placeholder.outerHTML = headerHTML;
    } else {
      document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }
  } else if (placeholder) {
    // Tidy up: remove the now-unused placeholder so the DOM stays clean.
    placeholder.remove();
  }

  // Highlight the active nav link based on current page (+ aria-current for SR users)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ── Region-aware top-bar phone number ─────────────────────────────────────
  // Default (baked into the HTML, so crawlers + no-JS visitors see it): the
  // Nepal HQ number. If the visitor appears to be in Australia, swap to the
  // local Australian number. Detection is client-side via the browser's IANA
  // timezone (and en-AU locale as a secondary signal) — synchronous, so there's
  // no flicker, and no third-party IP lookup, so the visitor's IP is never shared.
  (function localizePhone() {
    const el = document.getElementById('top-bar-phone');
    if (!el) return;

    let inAustralia = false;
    try {
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
      if (/^Australia\//i.test(tz)) inAustralia = true;
    } catch (e) { /* Intl unavailable — fall through to default */ }
    if (!inAustralia && /^en-au$/i.test(navigator.language || '')) inAustralia = true;

    if (!inAustralia) return; // default (Nepal) number is already shown

    const wa = el.getAttribute('data-wa-au');
    const label = el.getAttribute('data-label-au');
    if (!wa || !label) return;
    el.setAttribute('href', 'https://wa.me/' + wa);
    el.setAttribute('aria-label', 'Chat with us on WhatsApp at ' + label);
    const span = el.querySelector('.phone-number');
    if (span) span.textContent = label;
  })();
})();

/* ── Navigation behaviour ─────────────────────────────────── */

function toggleMenu() {
  const navbar   = document.querySelector('.navbar');
  const menu     = document.getElementById('navbarMenu');
  const backdrop = document.getElementById('menuBackdrop');
  const toggler  = document.querySelector('.navbar-toggler');

  const isOpen = menu.classList.contains('show');
  if (isOpen) {
    closeMenu();
  } else {
    menu.classList.add('show');
    backdrop.classList.add('show');
    navbar.classList.add('scrolled');
    if (toggler) {
      toggler.setAttribute('aria-expanded', 'true');
      toggler.setAttribute('aria-label', 'Close navigation menu');
    }
    // Move keyboard focus into the menu so screen-reader users land in it
    const firstLink = menu.querySelector('a, button');
    if (firstLink) setTimeout(() => firstLink.focus(), 50);
  }
}

function closeMenu() {
  const navbar   = document.querySelector('.navbar');
  const menu     = document.getElementById('navbarMenu');
  const backdrop = document.getElementById('menuBackdrop');
  const toggler  = document.querySelector('.navbar-toggler');

  const wasOpen = menu && menu.classList.contains('show');
  if (menu) menu.classList.remove('show');
  if (backdrop) backdrop.classList.remove('show');
  if (navbar && window.scrollY < 50) {
    navbar.classList.remove('scrolled');
  }
  if (toggler) {
    toggler.setAttribute('aria-expanded', 'false');
    toggler.setAttribute('aria-label', 'Open navigation menu');
    // Return focus to the toggler when closing via ESC / close button
    if (wasOpen) toggler.focus();
  }
  // Also collapse any open dropdown
  document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
  document.querySelectorAll('.dropdown-toggle').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-expanded', 'false');
  });
}

function toggleDropdown(element) {
  const dropdownMenu = element.nextElementSibling;
  const isOpen = dropdownMenu.classList.contains('show');

  // Close all dropdowns first + reset their aria
  document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
  document.querySelectorAll('.dropdown-toggle').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    dropdownMenu.classList.add('show');
    element.classList.add('active');
    element.setAttribute('aria-expanded', 'true');
  }
}

/* ── Keyboard navigation ───────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  // ESC closes menu and any open dropdown
  if (e.key === 'Escape') {
    const dropdownOpen = document.querySelector('.dropdown-menu.show');
    if (dropdownOpen) {
      dropdownOpen.classList.remove('show');
      const toggle = document.querySelector('.dropdown-toggle.active');
      if (toggle) {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
      return;
    }
    closeMenu();
    return;
  }

  // Arrow-key navigation within an open dropdown menu
  const openMenu = document.querySelector('.dropdown-menu.show');
  if (openMenu && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End')) {
    const items = [...openMenu.querySelectorAll('.dropdown-item')];
    const idx = items.indexOf(document.activeElement);
    let next;
    if (e.key === 'ArrowDown') next = items[(idx + 1) % items.length] || items[0];
    if (e.key === 'ArrowUp')   next = items[(idx - 1 + items.length) % items.length] || items[items.length - 1];
    if (e.key === 'Home')      next = items[0];
    if (e.key === 'End')       next = items[items.length - 1];
    if (next) { e.preventDefault(); next.focus(); }
  }
});

// Close any open dropdown when clicking outside it
document.addEventListener('click', e => {
  if (!e.target.closest('.dropdown-toggle, .dropdown-menu')) {
    document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
    document.querySelectorAll('.dropdown-toggle.active').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-expanded', 'false');
    });
  }
});

// Navbar scroll background
window.addEventListener('scroll', function () {
  const navbar = document.querySelector('.navbar');
  const menu   = document.getElementById('navbarMenu');
  if (!navbar || !menu) return;

  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else if (!menu.classList.contains('show')) {
    navbar.classList.remove('scrolled');
  }
});
