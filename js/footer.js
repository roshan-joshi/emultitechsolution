/**
 * footer.js
 * Injects the site-wide footer into any page.
 * Usage: <div id="site-footer"></div>  (before closing </body>)
 * Or simply include this script — it auto-injects into #site-footer if present,
 * otherwise appends to <body>.
 */

(function () {
  const footerHTML = `
  <footer class="footer-container">
    <div class="container-fluid">

      <div class="footer-top">
        <div class="contact-box">
          <div class="contact-icon">
            <img src="images/map-icon.png" alt="Map Pin Icon">
          </div>
          <div class="contact-address">
            <h4>KATHMANDU</h4>
            <p>Near UN Office, Kupondol, Lalitpur, Nepal<br>
               Mobile: <a href="https://wa.me/9779851038796" target="_blank" rel="noopener noreferrer">+977 9851038796</a>
            </p>
          </div>
        </div>
        <div class="contact-box">
          <div class="contact-icon">
            <img src="images/map-icon.png" alt="Map Pin Icon">
          </div>
          <div class="contact-address">
            <h4>Melbourne</h4>
            <p>Australia &middot; APAC partner <a href="https://www.linkedin.com/in/santosh-bhattarai-654184b4/" target="_blank" rel="noopener noreferrer">Santosh Bhattarai</a><br>
               Mobile: <a href="https://wa.me/61406806984" target="_blank" rel="noopener noreferrer">+61 406 806 984</a>
            </p>
          </div>
        </div>
      </div>

      <!-- Trust strip — elite credentials row above the link columns -->
      <div class="footer-trust" aria-label="Company credentials">
        <a class="footer-trust__item" href="https://www.capterra.com/p/130933/E-Multitech-Auction/" target="_blank" rel="noopener noreferrer" aria-label="4.8 stars on Capterra from 25 verified reviews">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
          <span><strong>4.8</strong> on Capterra <span class="footer-trust__meta">(25 verified reviews)</span></span>
        </a>
        <span class="footer-trust__sep" aria-hidden="true">·</span>
        <span class="footer-trust__item" aria-label="15 plus years in production">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span><strong>15+ years</strong> shipping production software</span>
        </span>
        <span class="footer-trust__sep" aria-hidden="true">·</span>
        <span class="footer-trust__item" aria-label="70 plus platforms shipped">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          <span><strong>70+ platforms</strong> shipped across 108 countries</span>
        </span>
        <span class="footer-trust__sep" aria-hidden="true">·</span>
        <a class="footer-trust__item" href="security.html" aria-label="Security and compliance practices">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span><strong>HIPAA-architected</strong> &middot; GDPR &middot; SOC 2 in 2026</span>
        </a>
      </div>

      <div class="footer-middle">
        <div class="footer-logo fade-slide">
          <img src="images/footer-logo.png" alt="eMultiTechSolutions Logo" loading="lazy">
          <p>We craft, launch, and scale high-performance web, mobile, and wearable applications — from design to development, testing, and ongoing growth.</p>
        </div>

        <div class="footer-column fade-slide">
          <h5>Services</h5>
          <ul>
            <li><a href="ai-powered-solutions.html"         class="footer-text">AI Powered Solutions</a></li>
            <li><a href="mobile-development.html"   class="footer-text">Mobile App Development</a></li>
            <li><a href="saas-development.html"      class="footer-text">SaaS Development</a></li>
            <li><a href="custom-software-development.html" class="footer-text">Custom Software Development</a></li>
            <li><a href="devops-engineer.html"      class="footer-text">DevOps Engineer</a></li>
            <li><a href="product-engineering.html"    class="footer-text">Product Engineering</a></li>
          </ul>
        </div>

        <div class="footer-column fade-slide">
          <h5>Industries</h5>
          <ul>
            <li><a href="healthcare.html"        class="footer-text">Healthcare</a></li>
            <li><a href="realestate.html"         class="footer-text">Real Estate</a></li>
            <li><a href="auction-software.html"  class="footer-text">Auction Software</a></li>
          </ul>
        </div>

        <div class="footer-column fade-slide">
          <h5>Information</h5>
          <ul>
            <li><a href="about.html"               class="footer-text">About Us</a></li>
            <li><a href="security.html"            class="footer-text">Security &amp; Compliance</a></li>
            <li><a href="privacy-policy.html"      class="footer-text">Privacy Policy</a></li>
            <li><a href="terms-of-condition.html"  class="footer-text">Terms and Condition</a></li>
            <li><a href="cookie-policy.html"       class="footer-text">Cookie Policy</a></li>
            <li><a href="contact.html"             class="footer-text">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>
          &copy; 2010 &ndash; 2026 E Multitech Solution Pvt. Ltd.
          <span class="footer-credentials">&middot; Registered in Nepal &middot; Founded October 2010 &middot; Shipping production software for 15 years</span>
        </p>
        <div class="social-icons">
          <a href="https://www.capterra.com/p/130933/E-Multitech-Auction/" target="_blank" rel="noopener noreferrer" aria-label="E Multitech Solution on Capterra (4.8 stars, 25 verified reviews)" title="4.8★ on Capterra · 25 verified reviews">
            <i class="fa-solid fa-star" aria-hidden="true"></i>
          </a>
          <a href="https://www.facebook.com/emultitechsolutionnepal" target="_blank" rel="noopener noreferrer" aria-label="E Multitech Solution on Facebook">
            <i class="fa-brands fa-facebook-f" aria-hidden="true"></i>
          </a>
          <a href="https://www.linkedin.com/company/emultitechsolution" target="_blank" rel="noopener noreferrer" aria-label="E Multitech Solution on LinkedIn">
            <i class="fa-brands fa-linkedin-in" aria-hidden="true"></i>
          </a>
        </div>
      </div>

    </div>
  </footer>
  `;

  // Inject the footer at runtime ONLY if the page doesn't already have one.
  // Pages built by tools/build-pages.mjs have the footer HTML inlined directly
  // (so crawlers and AI bots see real content) — in that case this is a no-op.
  const placeholder = document.getElementById('site-footer');
  const hasInlinedFooter = document.querySelector('footer') !== null;
  if (!hasInlinedFooter) {
    if (placeholder) {
      placeholder.outerHTML = footerHTML;
    } else {
      document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
  } else if (placeholder) {
    placeholder.remove();
  }
})();

/**
 * AOS stale-position fix.
 * AOS.init() runs on DOMContentLoaded, before lazy-loaded images finish loading.
 * As those images load they shift the layout, so AOS's recorded trigger points
 * go stale and some elements (e.g. the dark "Business Impact" cards) can stay
 * stuck at opacity:0 — invisible. Re-running AOS.refresh() after load (and as
 * images settle) recalculates positions so everything animates in correctly.
 */
(function () {
  function refresh() {
    if (window.AOS && typeof window.AOS.refresh === 'function') window.AOS.refresh();
  }
  window.addEventListener('load', function () {
    refresh();
    setTimeout(refresh, 300);
    setTimeout(refresh, 1200);
  });
  // Each lazy image that finishes can change layout — refresh on its load.
  // (capture phase because <img> load events don't bubble)
  document.addEventListener('load', function (e) {
    if (e.target && e.target.tagName === 'IMG') refresh();
  }, true);
})();
