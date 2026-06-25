 const navbar = document.querySelector('.navbar');
    const menu = document.getElementById('navbarMenu');
    const backdrop = document.getElementById('menuBackdrop');

    function toggleMenu() {
      const isOpen = menu.classList.contains('show');
      if (isOpen) {
        closeMenu();
      } else {
        menu.classList.add('show');
        backdrop.classList.add('show');
        navbar.classList.add('scrolled');
      }
    }

    function closeMenu() {
      menu.classList.remove('show');
      backdrop.classList.remove('show');
      if (window.scrollY < 50) {
        navbar.classList.remove('scrolled');
      }
    }

    // Toggle dropdown functionality
    function toggleDropdown(element) {
      const dropdownMenu = element.nextElementSibling;
      const isOpen = dropdownMenu.classList.contains('show');
      
      // Close all dropdowns first
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });
      document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.classList.remove('active');
      });
      
      // Open the clicked dropdown if it wasn't already open
      if (!isOpen) {
        dropdownMenu.classList.add('show');
        element.classList.add('active');
      }
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });

    // Change navbar background on scroll
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else if (!menu.classList.contains('show')) {
        navbar.classList.remove('scrolled');
      }
    });
 // Fade-slide animation on scroll
 const elements = document.querySelectorAll('.fade-slide');

 const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
         if (entry.isIntersecting) {
             entry.target.classList.add('visible');
         }
     });
 }, { threshold: 0.2 });

 elements.forEach(el => observer.observe(el));


 


 const carousel = document.getElementById("carousel");
 const leftBtn = document.getElementById("leftBtn");
 const rightBtn = document.getElementById("rightBtn");

 let index = 0;

 function updateCarousel() {
  const card = carousel.querySelector(".card-ourwork");
  const cardWidth = card.offsetWidth + 20; // card + gap
  const containerWidth = carousel.parentElement.offsetWidth;

  // Use ceil so partially visible cards count as "one more"
  const visibleCards = Math.ceil(containerWidth / cardWidth);
  const totalCards = carousel.children.length;

  // Correct maxIndex so no white space appears
  const maxIndex = Math.max(0, totalCards - visibleCards);

  // clamp index
  if (index < 0) index = 0;
  if (index > maxIndex) index = maxIndex;

  carousel.style.transform = `translateX(${-index * cardWidth}px)`;

  // Enable/disable arrows
  leftBtn.disabled = index === 0;
  rightBtn.disabled = index === maxIndex;
}

 rightBtn.addEventListener("click", () => {
   index++;
   updateCarousel();
 });

 leftBtn.addEventListener("click", () => {
   index--;
   updateCarousel();
 });

 window.addEventListener("resize", updateCarousel);

 // Init
 updateCarousel();

  (function () {
      const carousel = document.getElementById('casestudyCarousel');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');

      const PIXELS_PER_SECOND = 40;
      let lastTimestamp = null;
      let running = true;
      let rafId = null;
      let userInteracting = false;
      let interactionTimeout = null;

      function step(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const delta = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        if (running && !userInteracting) {
          const move = (PIXELS_PER_SECOND * delta) / 1000;
          carousel.scrollLeft += move;

          const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth - 0.5;
          if (carousel.scrollLeft >= maxScrollLeft) {
            carousel.scrollLeft = 0;
          }
        }
        rafId = requestAnimationFrame(step);
      }

      function start() {
        if (!rafId) {
          running = true;
          lastTimestamp = null;
          rafId = requestAnimationFrame(step);
        }
      }

      function beginUserInteraction() {
        userInteracting = true;
        if (interactionTimeout) clearTimeout(interactionTimeout);
      }

      function endUserInteraction() {
        if (interactionTimeout) clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => (userInteracting = false), 900);
      }

      carousel.addEventListener('mouseenter', beginUserInteraction);
      carousel.addEventListener('mouseleave', endUserInteraction);

      // Touch / drag scroll
      let isDown = false, startX, scrollStart;
      carousel.addEventListener('pointerdown', e => {
        isDown = true;
        beginUserInteraction();
        startX = e.clientX;
        scrollStart = carousel.scrollLeft;
        carousel.setPointerCapture(e.pointerId);
      });
      carousel.addEventListener('pointermove', e => {
        if (!isDown) return;
        const delta = startX - e.clientX;
        carousel.scrollLeft = scrollStart + delta;
      });
      carousel.addEventListener('pointerup', e => { isDown = false; endUserInteraction(); });
      carousel.addEventListener('pointercancel', () => { isDown = false; endUserInteraction(); });

      // Arrow scroll
      const CARD_SCROLL_BY = 400;
      prevBtn.addEventListener('click', () => {
        beginUserInteraction();
        carousel.scrollBy({ left: -CARD_SCROLL_BY, behavior: 'smooth' });
        endUserInteraction();
      });
      nextBtn.addEventListener('click', () => {
        beginUserInteraction();
        carousel.scrollBy({ left: CARD_SCROLL_BY, behavior: 'smooth' });
        endUserInteraction();
      });

      

      start();
    })();

 


 



 
 

