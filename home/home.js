/**
 * TETON VILLAGE BUILDERS — HOMEPAGE JAVASCRIPT
 * Specific to /index.html
 */

document.addEventListener('DOMContentLoaded', () => {
  initTestimonialsSlider();
  initServiceCardClicks();
  initFaqAccordion();
  initScrollAnimations();
});

/**
 * Testimonial Slider / Review Navigation & Mobile Swipeable Carousel
 */
function initTestimonialsSlider() {
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const slider = document.getElementById('testimonials-slider');
  const dotsContainer = document.getElementById('testimonials-dots');
  
  if (!slider) return;

  const cards = slider.querySelectorAll('.testimonial-card');
  if (cards.length === 0) return;

  let currentIndex = 0;

  // Create pagination dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `testimonial-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider(currentIndex);
      });
      dotsContainer.appendChild(dot);
    });
  }

  const updateDots = (index) => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
  };

  const updateSlider = (index) => {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    currentIndex = index;

    if (window.innerWidth < 768) {
      // Mobile 1-card transform carousel
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots(currentIndex);
    } else {
      // Desktop: remove carousel transform, show all in grid
      slider.style.transform = '';
      updateDots(currentIndex);
    }
  };

  // Nav Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : cards.length - 1;
      updateSlider(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < cards.length - 1) ? currentIndex + 1 : 0;
      updateSlider(currentIndex);
    });
  }

  // Touch Swipe Handling for Mobile
  let startX = 0;
  let startY = 0;
  let isSwiping = false;

  slider.addEventListener('touchstart', (e) => {
    if (window.innerWidth >= 768) return;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    isSwiping = true;
  }, { passive: true });

  slider.addEventListener('touchmove', (e) => {
    if (!isSwiping || window.innerWidth >= 768) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - startX;
    const diffY = touch.clientY - startY;

    // If horizontal swipe is more significant than vertical, prevent page jerk
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Intentional horizontal swipe
    }
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    if (!isSwiping || window.innerWidth >= 768) return;
    isSwiping = false;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - startX;
    const threshold = 40; // minimum swipe distance in px

    if (diffX > threshold) {
      // Swiped right -> go to previous
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : cards.length - 1;
      updateSlider(currentIndex);
    } else if (diffX < -threshold) {
      // Swiped left -> go to next
      currentIndex = (currentIndex < cards.length - 1) ? currentIndex + 1 : 0;
      updateSlider(currentIndex);
    }
  }, { passive: true });

  // Handle Resize
  window.addEventListener('resize', () => {
    updateSlider(currentIndex);
  });

  // Initial call
  updateSlider(0);
}

/**
 * Service Card Whole-Card Click Handler
 */
function initServiceCardClicks() {
  const serviceCards = document.querySelectorAll('.service-card[data-href]');
  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked directly on a button or link inside, let standard behavior handle it
      if (e.target.closest('a') || e.target.closest('button')) return;
      const href = card.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    });

    // Add keyboard accessibility for Enter / Space
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const href = card.getAttribute('data-href');
        if (href) window.location.href = href;
      }
    });
  });
}

/**
 * FAQ Accessible Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  // Set height for initially open item
  const initialActivePanel = document.querySelector('.faq-item.active .faq-answer-panel');
  if (initialActivePanel) {
    initialActivePanel.style.maxHeight = initialActivePanel.scrollHeight + 'px';
  }

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Close all other items for a clean single-open accordion
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          const otherPanel = otherItem.querySelector('.faq-answer-panel');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) {
            otherPanel.style.maxHeight = '0px';
          }
        }
      });

      // Toggle clicked item
      if (isCurrentlyActive) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // Re-calculate heights on window resize if open
  window.addEventListener('resize', () => {
    const activePanel = document.querySelector('.faq-item.active .faq-answer-panel');
    if (activePanel) {
      activePanel.style.maxHeight = activePanel.scrollHeight + 'px';
    }
  }, { passive: true });
}

/**
 * Scroll Reveal Animations (Respects prefers-reduced-motion & Progressive Enhancement)
 */
function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // If reduced motion is requested, do not apply animation classes
    return;
  }

  // Mark document as JS-enabled to activate scroll reveal styles
  document.documentElement.classList.add('js-enabled');

  if (!('IntersectionObserver' in window)) {
    // Fallback if IntersectionObserver is not supported: reveal everything immediately
    const elements = document.querySelectorAll('.reveal-on-scroll, .stagger-group');
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.reveal-on-scroll, .stagger-group');
  animatedElements.forEach(el => observer.observe(el));
}
