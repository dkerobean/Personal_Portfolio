// Enhanced router for better page transitions and script loading
document.addEventListener('DOMContentLoaded', () => {
  // This is a fix to ensure the preloader doesn't get stuck
  const preloader = document.querySelector('.preloader');

  // Handle the preloader hiding
  function hidePreloader() {
    if (!preloader) return;

    // First fade it out
    preloader.style.opacity = '0';

    // Then hide it completely
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }

  // Make sure preloader gets hidden after a timeout (failsafe)
  setTimeout(() => {
    if (preloader && getComputedStyle(preloader).display !== 'none') {
      hidePreloader();
    }
  }, 2500);

  function ensureScriptsRun() {
    // Reinitialize any scripts that might not have loaded properly
    if (typeof jQuery !== 'undefined') {
      // Force counter animations to run
      jQuery('.counter-text-wrap').each(function() {
        jQuery(this).removeClass('counted');
      });

      // Trigger scroll event to activate counters and other scroll-based animations
      jQuery(window).trigger('scroll');

      // Reinitialize WOW animations if they exist
      if (typeof WOW === 'function') {
        new WOW().init();
      }
    }
  }

  // Run script initialization on both DOMContentLoaded and window load
  ensureScriptsRun();
  window.addEventListener('load', ensureScriptsRun);

  // Fix navigation transitions for Vercel deployment
  const navLinks = document.querySelectorAll('a[href$=".html"]');

  navLinks.forEach(link => {
    // Only handle same-origin links
    if (link.hostname !== window.location.hostname && link.hostname !== '') {
      return;
    }

    link.addEventListener('click', e => {
      const href = link.getAttribute('href');

      // Skip if it's not an HTML page or is an external link
      if (!href || !href.endsWith('.html') || href.startsWith('http') || href.startsWith('//')) {
        return;
      }

      // Special handling for Vercel hosting
      // Check if we're on Vercel (or any production domain)
      if (window.location.hostname.includes('vercel.app') ||
          !window.location.hostname.includes('localhost')) {
        e.preventDefault();

        // Show preloader before navigation
        if (preloader) {
          preloader.style.opacity = '1';
          preloader.style.display = 'flex';
        }

        // Store the target page to navigate to
        sessionStorage.setItem('nextPage', href);

        // Navigate after a short delay to allow preloader to show
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });

  // Check if we came from another page in the site
  if (sessionStorage.getItem('pageNavigation') === 'true') {
    sessionStorage.removeItem('pageNavigation');

    // Ensure scripts run after page navigation
    setTimeout(ensureScriptsRun, 1000);
  }
});
