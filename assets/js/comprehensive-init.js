// comprehensive-init.js - Ensures all functionality works in hosted environment
(function() {
  'use strict';

  // Configuration
  const config = {
    maxRetries: 5,
    retryDelay: 1000,
    preloaderTimeout: 3000,
    counterCheckInterval: 2000
  };

  let initAttempts = 0;

  // Utility functions
  function log(message) {
    console.log(`[Portfolio Init] ${message}`);
  }

  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) return resolve(element);

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  // Preloader management
  function handlePreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    // Hide preloader with animation
    function hidePreloader() {
      preloader.style.transition = 'opacity 0.5s ease-out';
      preloader.style.opacity = '0';

      setTimeout(() => {
        preloader.style.display = 'none';
        preloader.classList.add('hide');
        log('Preloader hidden');
      }, 500);
    }

    // Multiple fallback timers
    setTimeout(hidePreloader, 2000);  // 2 seconds
    setTimeout(hidePreloader, config.preloaderTimeout); // 3 seconds

    // Hide on window load
    window.addEventListener('load', () => {
      setTimeout(hidePreloader, 500);
    });
  }

  // Counter initialization
  function initializeCounters() {
    if (typeof jQuery === 'undefined') {
      log('jQuery not loaded, retrying counters...');
      return false;
    }

    const counters = jQuery('.counter-text-wrap');
    if (!counters.length) {
      log('No counters found');
      return true;
    }

    let initialized = 0;
    counters.each(function() {
      const $this = jQuery(this);

      if ($this.hasClass('counted')) return;

      const countText = $this.find('.count-text');
      const countStop = parseInt(countText.attr('data-stop')) || 0;
      const countSpeed = parseInt(countText.attr('data-speed')) || 2000;

      if (countStop === 0) return;

      $this.addClass('counted');
      initialized++;

      jQuery({countNum: 0}).animate({
        countNum: countStop
      }, {
        duration: countSpeed,
        easing: 'linear',
        step: function() {
          countText.text(Math.floor(this.countNum));
        },
        complete: function() {
          countText.text(countStop);
        }
      });
    });

    if (initialized > 0) {
      log(`Initialized ${initialized} counters`);
    }

    return true;
  }

  // Script initialization
  function initializeScripts() {
    initAttempts++;
    log(`Initialization attempt ${initAttempts}`);

    // Initialize counters
    if (!initializeCounters() && initAttempts < config.maxRetries) {
      setTimeout(initializeScripts, config.retryDelay);
      return;
    }

    // Initialize other animations
    if (typeof WOW !== 'undefined') {
      try {
        new WOW().init();
        log('WOW animations initialized');
      } catch (e) {
        log('WOW initialization failed: ' + e.message);
      }
    }

    // Trigger scroll events for scroll-based animations
    if (typeof jQuery !== 'undefined') {
      jQuery(window).trigger('scroll');
    }

    log('Script initialization completed');
  }

  // Periodic counter check
  function startPeriodicCounterCheck() {
    setInterval(() => {
      if (typeof jQuery !== 'undefined') {
        const uncountedCounters = jQuery('.counter-text-wrap:not(.counted)');
        if (uncountedCounters.length > 0) {
          log(`Found ${uncountedCounters.length} uncounted counters, reinitializing...`);
          initializeCounters();
        }
      }
    }, config.counterCheckInterval);
  }

  // Main initialization
  function init() {
    log('Starting comprehensive initialization');

    handlePreloader();

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeScripts, 500);
        startPeriodicCounterCheck();
      });
    } else {
      setTimeout(initializeScripts, 500);
      startPeriodicCounterCheck();
    }

    // Additional initialization on window load
    window.addEventListener('load', () => {
      setTimeout(initializeScripts, 1000);
    });
  }

  // Global functions for other scripts
  window.portfolioInit = {
    reinitializeCounters: initializeCounters,
    hidePreloader: handlePreloader
  };

  // Start initialization
  init();
})();
