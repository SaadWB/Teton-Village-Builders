/**
 * TETON VILLAGE BUILDERS — GLOBAL JAVASCRIPT
 * Reusable Site-Wide Interactions & Accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initDropdowns();
  initAccessibleLinks();
});

/**
 * Sticky Header Scroll State
 */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer & Hamburger Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navDrawer = document.getElementById('mobile-nav-drawer');
  if (!toggleBtn || !navDrawer) return;

  const toggleMenu = (open) => {
    const isExpanded = open !== undefined ? open : toggleBtn.getAttribute('aria-expanded') !== 'true';
    toggleBtn.setAttribute('aria-expanded', String(isExpanded));
    toggleBtn.classList.toggle('active', isExpanded);
    navDrawer.classList.toggle('active', isExpanded);
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', () => {
    toggleMenu();
  });

  // Close when clicking nav links that are anchor links
  const links = navDrawer.querySelectorAll('a:not(.mobile-dropdown-toggle)');
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });

  // Close on viewport resize above tablet
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991 && toggleBtn.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
    }
  }, { passive: true });
}

/**
 * Mobile Services Submenu Accordion
 */
function initDropdowns() {
  const mobileDropdownToggle = document.getElementById('mobile-services-toggle');
  const mobileDropdownContent = document.getElementById('mobile-services-menu');

  if (mobileDropdownToggle && mobileDropdownContent) {
    mobileDropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isActive = mobileDropdownContent.classList.toggle('active');
      mobileDropdownToggle.setAttribute('aria-expanded', String(isActive));
      const icon = mobileDropdownToggle.querySelector('.dropdown-chevron');
      if (icon) {
        icon.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  }
}

/**
 * Accessible Anchor Focus and Smooth Scroll
 */
function initAccessibleLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.getElementById('site-header')?.offsetHeight || 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Set focus to the target section for screen readers
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });
}
