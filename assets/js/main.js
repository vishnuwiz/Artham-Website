(function () {
  'use strict';

  var root = document.documentElement;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var menuButton = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.primary-nav');

  // Mobile navigation: close after choosing a section or pressing Escape.
  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
  }
  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      var open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', function (event) {
      if (menuButton.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  // Staggered reveal. Content remains visible if IntersectionObserver is unavailable.
  if (!reducedMotion && 'IntersectionObserver' in window) {
    root.classList.add('js-ready');
    var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = (Math.min(index % 4, 3) * 55) + 'ms';
      observer.observe(item);
    });
  }

  // Keep the active section visible in the compact navigation.
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.primary-nav a[href^="#"]'));
  var navSections = navLinks.map(function (link) {
    var section = document.querySelector(link.getAttribute('href'));
    return section ? { link: link, section: section } : null;
  }).filter(Boolean);
  if ('IntersectionObserver' in window && navSections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navSections.forEach(function (item) { item.link.removeAttribute('aria-current'); });
        var current = navSections.find(function (item) { return item.section === entry.target; });
        if (current) current.link.setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-22% 0px -65% 0px', threshold: 0 });
    navSections.forEach(function (item) { navObserver.observe(item.section); });
  }

  // Header turns to frosted glass once the page scrolls.
  var header = document.querySelector('.site-header');
  function updateHeader() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 12);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Thin reading progress and back-to-top button.
  var progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  var backTop = document.createElement('button');
  backTop.className = 'back-top';
  backTop.type = 'button';
  backTop.textContent = '↑';
  backTop.setAttribute('aria-label', 'Back to top');
  backTop.title = 'Back to top';
  document.body.appendChild(backTop);
  var scrollTick = false;
  function updateScrollUI() {
    var max = root.scrollHeight - window.innerHeight;
    var amount = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = 'scaleX(' + amount + ')';
    backTop.classList.toggle('is-visible', window.scrollY > 620);
    scrollTick = false;
  }
  window.addEventListener('scroll', function () {
    if (!scrollTick) {
      window.requestAnimationFrame(updateScrollUI);
      scrollTick = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollUI);
  updateScrollUI();
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  // Keyboard-accessible lightbox for app screenshots.
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxImage = lightbox.querySelector('img');
    var caption = lightbox.querySelector('.lightbox-caption');
    var closeButton = lightbox.querySelector('.lightbox-close');
    var returnFocus = null;
    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (returnFocus) returnFocus.focus();
    }
    function openLightbox(image) {
      returnFocus = image;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || 'Artham app screen';
      caption.textContent = image.alt || 'Artham app screen';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    }
    document.querySelectorAll('.product-visual img, .hero-phone img').forEach(function (image) {
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-haspopup', 'dialog');
      image.setAttribute('aria-label', 'Enlarge: ' + (image.alt || 'Artham app screen'));
      image.addEventListener('click', function () { openLightbox(image); });
      image.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(image);
        }
      });
    });
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (event) {
      if (!lightbox.hidden && event.key === 'Escape') closeLightbox();
      if (!lightbox.hidden && event.key === 'Tab') {
        event.preventDefault();
        closeButton.focus();
      }
    });
  }

  // Pointer-only micro-interactions: restrained spotlight, card tilt and hero parallax.
  // All movement is skipped for touch-only devices and reduced-motion preferences.
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reducedMotion) {
    var glowTargets = document.querySelectorAll('.product-card, .feature-band, .feature-item, .update-card, .privacy-points article, .download-panel');
    glowTargets.forEach(function (element) {
      var frame = 0;
      element.addEventListener('pointermove', function (event) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(function () {
          var rect = element.getBoundingClientRect();
          var x = event.clientX - rect.left;
          var y = event.clientY - rect.top;
          element.style.setProperty('--spot-x', x + 'px');
          element.style.setProperty('--spot-y', y + 'px');
          if (element.classList.contains('product-card')) {
            var tiltX = ((x / Math.max(rect.width, 1)) - .5) * 4.2;
            var tiltY = (.5 - (y / Math.max(rect.height, 1))) * 3.2;
            element.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
            element.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
          }
          frame = 0;
        });
      });
      element.addEventListener('pointerleave', function () {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        element.style.removeProperty('--spot-x');
        element.style.removeProperty('--spot-y');
        element.style.removeProperty('--tilt-x');
        element.style.removeProperty('--tilt-y');
      });
    });

    var heroArt = document.querySelector('.hero-art');
    if (heroArt) {
      var heroPhones = Array.prototype.slice.call(heroArt.querySelectorAll('.hero-phone'));
      heroArt.addEventListener('pointermove', function (event) {
        var rect = heroArt.getBoundingClientRect();
        var dx = (event.clientX - rect.left - rect.width / 2) / Math.max(rect.width / 2, 1);
        var dy = (event.clientY - rect.top - rect.height / 2) / Math.max(rect.height / 2, 1);
        heroPhones.forEach(function (phone, index) {
          var depth = index === 2 ? 1 : (index === 0 ? .55 : .4);
          phone.style.setProperty('--hero-shift-x', (-dx * 7 * depth).toFixed(2) + 'px');
          phone.style.setProperty('--hero-shift-y', (-dy * 7 * depth).toFixed(2) + 'px');
        });
      });
      heroArt.addEventListener('pointerleave', function () {
        heroPhones.forEach(function (phone) {
          phone.style.removeProperty('--hero-shift-x');
          phone.style.removeProperty('--hero-shift-y');
        });
      });
    }

    // A small magnetic response keeps primary calls-to-action feeling tactile.
    document.querySelectorAll('.button-primary, .button-download').forEach(function (button) {
      button.addEventListener('pointermove', function (event) {
        var rect = button.getBoundingClientRect();
        var x = (event.clientX - rect.left - rect.width / 2) / Math.max(rect.width / 2, 1);
        var y = (event.clientY - rect.top - rect.height / 2) / Math.max(rect.height / 2, 1);
        button.style.setProperty('--button-x', (x * 3.5).toFixed(2) + 'px');
        button.style.setProperty('--button-y', (y * 2.5).toFixed(2) + 'px');
      });
      button.addEventListener('pointerleave', function () {
        button.style.removeProperty('--button-x');
        button.style.removeProperty('--button-y');
      });
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();