/* Emerald Door Services — main.js
 * Handles:
 *  - footer year stamp
 *  - scroll-reveal fade/lift for sections and cards
 *  - header "scrolled" state for sticky polish
 *  - Projects slider arrows (only on pages that include it)
 * Respects prefers-reduced-motion.
 */
(function () {
  'use strict';

  // ---- Footer year stamp ----
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Scroll reveal ----
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealSelectors = [
      '.section-head',
      '.service-card',
      '.feature',
      '.review',
      '.work-teaser a',
      '.door-tile',
      '.about-image',
      '.about-copy',
      '.contact-form',
      '.contact-info',
      '.cta-band',
      '.trust-item',
      '.section-foot'
    ];
    var revealEls = document.querySelectorAll(revealSelectors.join(', '));
    revealEls.forEach(function (el) {
      el.classList.add('reveal');
    });

    // Stagger siblings within grids.
    function stagger(parentSelector, childSelector) {
      document.querySelectorAll(parentSelector).forEach(function (parent) {
        var children = parent.querySelectorAll(childSelector);
        children.forEach(function (child, i) {
          child.style.transitionDelay = (i * 70) + 'ms';
        });
      });
    }
    stagger('.service-cards', '.service-card');
    stagger('.features', '.feature');
    stagger('.reviews-grid', '.review');
    stagger('.work-teaser', 'a');
    stagger('.door-types-grid', '.door-tile');
    stagger('.trust-strip-inner', '.trust-item');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---- Header scrolled state ----
  var header = document.querySelector('.site-header');
  if (header) {
    var ticking = false;
    function applyHeader() {
      if (window.scrollY > 12) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(applyHeader);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    applyHeader();
  }

  // ---- Projects slider ----
  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var track = slider.querySelector('[data-slider-track]');
    var prev = slider.querySelector('[data-slider-prev]');
    var next = slider.querySelector('[data-slider-next]');
    if (!track || !prev || !next) return;

    function step() {
      return Math.max(200, track.clientWidth * 0.9);
    }

    prev.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: 'smooth' });
    });

    function updateButtons() {
      var maxScroll = track.scrollWidth - track.clientWidth - 1;
      prev.disabled = track.scrollLeft <= 0;
      next.disabled = track.scrollLeft >= maxScroll;
    }
    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  });
})();
