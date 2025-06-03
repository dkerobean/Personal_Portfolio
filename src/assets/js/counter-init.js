// counter-init.js - A dedicated file to ensure counter animations work properly
document.addEventListener('DOMContentLoaded', function() {
  function initCounters() {
    if (typeof jQuery === 'undefined' || !jQuery('.counter-text-wrap').length) return;
    
    jQuery('.counter-text-wrap').each(function() {
      const $this = jQuery(this);
      
      // Skip if already counted
      if ($this.hasClass('counted')) return;
      
      // Force appear function to trigger for all counters
      const countStop = $this.find('.count-text').attr('data-stop');
      const countSpeed = parseInt($this.find('.count-text').attr('data-speed'), 10) || 3000;
      
      // Mark as counted
      $this.addClass('counted');
      
      // Start animation
      jQuery({
        countNum: parseInt($this.find('.count-text').text()) || 0
      }).animate({
        countNum: countStop
      }, {
        duration: countSpeed,
        easing: 'linear',
        step: function() {
          $this.find('.count-text').text(Math.floor(this.countNum));
        },
        complete: function() {
          $this.find('.count-text').text(this.countNum);
        }
      });
    });
  }

  // Initialize counters multiple times to ensure they always work
  setTimeout(initCounters, 500);
  setTimeout(initCounters, 2000);
  setTimeout(initCounters, 3500);
  
  // Initialize counters on scroll (backup in case appear plugin isn't working)
  window.addEventListener('scroll', function() {
    initCounters();
  });

  // Add a global function so other scripts can trigger counter initialization
  window.reinitializeCounters = initCounters;
});

// Standalone counter check that runs periodically in the background
(function checkCounters() {
  setInterval(function() {
    if (typeof jQuery === 'undefined') return;
    
    jQuery('.counter-text-wrap').each(function() {
      const $this = jQuery(this);
      const countStop = parseInt($this.find('.count-text').attr('data-stop'), 10);
      const currentValue = parseInt($this.find('.count-text').text().replace(/[^0-9]/g, ''), 10);
      
      // If counter hasn't run (still at 0) but should have a value, restart it
      if ((currentValue === 0 || isNaN(currentValue)) && countStop > 0) {
        $this.removeClass('counted');
        
        jQuery({
          countNum: 0
        }).animate({
          countNum: countStop
        }, {
          duration: 2000,
          easing: 'linear',
          step: function() {
            $this.find('.count-text').text(Math.floor(this.countNum));
          },
          complete: function() {
            $this.find('.count-text').text(countStop);
            $this.addClass('counted');
          }
        });
      }
    });
  }, 5000); // Check every 5 seconds
})();

// Reinitialize when page fully loads (for hosted environments)
window.addEventListener('load', function() {
  setTimeout(function() {
    if (typeof jQuery !== 'undefined') {
      jQuery('.counter-text-wrap').each(function() {
        // Re-trigger counter animations
        jQuery(this).removeClass('counted');
        
        // Try to find appear function and call it if available
        if (typeof jQuery.fn.appear === 'function') {
          jQuery(this).appear();
        }
      });
      
      // Force count again
      if (typeof jQuery.fn.trigger === 'function') {
        jQuery(window).trigger('scroll');
      }
    }
  }, 1500);
});
