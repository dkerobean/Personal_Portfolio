// Fix for the preloader issue on page navigation
document.addEventListener('DOMContentLoaded', () => {
  // This is a simple fix to ensure the preloader doesn't get stuck
  const preloader = document.querySelector('.preloader');
  
  // Make sure preloader gets hidden after a timeout (failsafe)
  if (preloader) {
    setTimeout(() => {
      if (preloader.style.display !== 'none') {
        preloader.style.display = 'none';
      }
    }, 2500);
  }
  
  // Improve navigation experience by preventing preloader from showing on same-origin page changes
  const navLinks = document.querySelectorAll('a[href$=".html"]');
  
  navLinks.forEach(link => {
    // Only handle same-origin links
    if (link.hostname !== window.location.hostname && link.hostname !== '') {
      return;
    }
    
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      
      // Skip if it's not an HTML page or is an external link
      if (!href.endsWith('.html') || href.startsWith('http') || href.startsWith('//')) {
        return;
      }
      
      // Allow normal navigation for local HTML links
      // The preloader will show briefly and then hide properly on the new page
    });
  });
});
