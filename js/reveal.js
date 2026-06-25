/**
 * reveal.js
 *
 * Lightweight scroll-reveal — replaces AOS for elements that use the modern
 * [data-reveal] attribute. AOS still ships for legacy sections; new sections
 * should use [data-reveal] instead.
 *
 * Behavior:
 *   <element data-reveal>…</element>           — fade-up when 20% in view
 *   <element data-reveal data-reveal-delay="2">— stagger by 160ms (1..6)
 *
 * Respects prefers-reduced-motion (handled in CSS).
 */
(function () {
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything.
    document
      .querySelectorAll('[data-reveal]')
      .forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
  );

  const observe = () => {
    document
      .querySelectorAll('[data-reveal]:not(.is-visible)')
      .forEach((el) => observer.observe(el));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe);
  } else {
    observe();
  }
})();
