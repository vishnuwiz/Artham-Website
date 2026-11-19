(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Headline: split the first line into words so they can arrive one by one.
  var h1 = document.getElementById('hero-title');
  if (h1 && !reduced) {
    var first = h1.firstChild;
    if (first && first.nodeType === 3) {
      var frag = document.createDocumentFragment();
      first.textContent.trim().split(/\s+/).forEach(function (word, i, all) {
        var span = document.createElement('span');
        span.className = 'h1-word';
        span.style.setProperty('--i', i);
        span.textContent = word;
        frag.appendChild(span);
        if (i < all.length - 1) frag.appendChild(document.createTextNode(' '));
      });
      h1.replaceChild(frag, first);
    }
  }

  // Pinned phone tour: the step in the middle of the screen picks the phone screen.
  var tour = document.querySelector('[data-tour]');
  if (tour && 'IntersectionObserver' in window) {
    var steps = Array.prototype.slice.call(tour.querySelectorAll('.tour-step'));
    var shots = Array.prototype.slice.call(tour.querySelectorAll('.tour-phone img'));
    var setActive = function (index) {
      tour.setAttribute('data-active', String(index));
      steps.forEach(function (step, i) { step.classList.toggle('is-active', i === index); });
      shots.forEach(function (shot, i) { shot.classList.toggle('is-active', i === index); });
    };
    var tourObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(steps.indexOf(entry.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (step) { tourObserver.observe(step); });
    setActive(0);
  }

  // Confetti burst on download buttons. The link still opens normally.
  if (!reduced) {
    var colors = ['#b69af8', '#7cddbb', '#f2ce88', '#ffad9e', '#ffffff'];
    document.querySelectorAll('.button-primary, .button-download, .nav-download').forEach(function (button) {
      button.addEventListener('click', function (event) {
        var x = event.clientX || button.getBoundingClientRect().left + button.offsetWidth / 2;
        var y = event.clientY || button.getBoundingClientRect().top + button.offsetHeight / 2;
        for (var i = 0; i < 16; i++) {
          var piece = document.createElement('span');
          piece.className = 'confetti';
          piece.style.background = colors[i % colors.length];
          document.body.appendChild(piece);
          var angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.5;
          var dist = 50 + Math.random() * 70;
          var dx = Math.cos(angle) * dist;
          var dy = Math.sin(angle) * dist - 30;
          var spin = (Math.random() - 0.5) * 540;
          var anim = piece.animate([
            { transform: 'translate(' + x + 'px,' + y + 'px) rotate(0deg)', opacity: 1 },
            { transform: 'translate(' + (x + dx) + 'px,' + (y + dy) + 'px) rotate(' + spin + 'deg)', opacity: 1, offset: 0.55 },
            { transform: 'translate(' + (x + dx * 1.15) + 'px,' + (y + dy + 70) + 'px) rotate(' + spin * 1.3 + 'deg)', opacity: 0 }
          ], { duration: 900 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' });
          anim.onfinish = (function (el) { return function () { el.remove(); }; })(piece);
        }
      });
    });
  }

  // Cursor orb: follows the pointer with a little lag, grows over links.
  if (fine && !reduced) {
    var orb = document.createElement('div');
    orb.className = 'cursor-orb';
    orb.setAttribute('aria-hidden', 'true');
    document.body.appendChild(orb);
    var tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    var loop = function () {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      orb.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2) window.requestAnimationFrame(loop);
      else running = false;
    };
    document.addEventListener('pointermove', function (event) {
      if (event.pointerType === 'touch') return;
      tx = event.clientX; ty = event.clientY;
      if (!orb.classList.contains('is-on')) { cx = tx; cy = ty; orb.classList.add('is-on'); }
      var overLink = event.target.closest && event.target.closest('a, button, [role="button"]');
      orb.classList.toggle('is-link', !!overLink);
      if (!running) { running = true; window.requestAnimationFrame(loop); }
    }, { passive: true });
    document.addEventListener('pointerleave', function () { orb.classList.remove('is-on'); });
  }
})();
