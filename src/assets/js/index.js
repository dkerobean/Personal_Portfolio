import '../css/style.css';
import '../css/animate.min.css';
import '../css/font-awesome-pro.css';
import '../css/magnific-popup.css';
import '../css/mobilemenu.css';
import '../css/nice-select.min.css';
import '../css/slick.css';
import '../css/spacing.css';
import '../css/swiper-bundle.css';

// Import JavaScript dependencies
import './jquery-3.6.0.min.js';
import './appear.min.js';
import './jquery.magnific-popup.min.js';
import './mobilemenu.js';
import './gsap.min.js';
import './ScrollTrigger.min.js';
import './lenis.js';
import './swiper-bundle.js';
import './jquery.nice-select.min.js';
import './imagesloaded.pkgd.min.js';
import './isotope.pkgd.min.js';
import './wow.min.js';
import './script.js';

// Hide the loading screen after the page loads
window.addEventListener("load", () => {
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    preloader.style.display = "none";
  }
});
