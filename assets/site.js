(function () {
  'use strict';

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Header: shrink on scroll ---------- */
  var head = document.querySelector('.masthead');
  if (head) {
    var onScroll = function () {
      head.classList.toggle('is-stuck', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Services dropdown ---------- */
  var drops = document.querySelectorAll('[data-drop]');
  Array.prototype.forEach.call(drops, function (drop) {
    var btn = drop.querySelector('[data-drop-btn]');
    var panel = drop.querySelector('[data-drop-panel]');
    if (!btn || !panel) return;

    var open = function (yes) {
      drop.classList.toggle('is-open', yes);
      btn.setAttribute('aria-expanded', yes ? 'true' : 'false');
    };

    var wide = function () { return window.matchMedia('(min-width: 981px)').matches; };

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (wide()) {
        /* On desktop the panel opens on hover, so a click means
           "take me to the services page" rather than "close what I
           just opened". */
        var all = btn.getAttribute('data-drop-href');
        if (all) { window.location.href = all; return; }
      }
      open(!drop.classList.contains('is-open'));
    });
    drop.addEventListener('mouseenter', function () { if (wide()) open(true); });
    drop.addEventListener('mouseleave', function () { if (wide()) open(false); });
    drop.addEventListener('focusin', function () { open(true); });
    drop.addEventListener('focusout', function (e) {
      if (!drop.contains(e.relatedTarget)) open(false);
    });
    document.addEventListener('click', function (e) {
      if (!drop.contains(e.target)) open(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') open(false);
    });
  });

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('[data-burger]');
  var nav = document.getElementById('primaryNav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
  }

  /* ---------- Hero background rotation ---------- */
  var stage = document.querySelector('[data-cycle]');
  if (stage) {
    var shots = stage.querySelectorAll('[data-shot]');
    var caps = stage.querySelectorAll('[data-cap]');
    var dots = stage.querySelectorAll('[data-dot]');
    if (shots.length > 1) {
      var at = 0, timer = null;

      var show = function (n) {
        at = (n + shots.length) % shots.length;
        for (var i = 0; i < shots.length; i++) {
          shots[i].classList.toggle('is-on', i === at);
          if (caps[i]) caps[i].classList.toggle('is-on', i === at);
          if (dots[i]) {
            dots[i].classList.toggle('is-on', i === at);
            dots[i].setAttribute('aria-selected', i === at ? 'true' : 'false');
          }
        }
      };
      var start = function () {
        if (!still && !timer) timer = setInterval(function () { show(at + 1); }, 6000);
      };
      var stop = function () { clearInterval(timer); timer = null; };

      Array.prototype.forEach.call(dots, function (dot, n) {
        dot.addEventListener('click', function () { stop(); show(n); start(); });
      });
      stage.addEventListener('mouseenter', stop);
      stage.addEventListener('mouseleave', start);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop(); else start();
      });

      show(0);
      start();
    }
  }

  /* ---------- Due-date rail: which date is next ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('#railList li'));
  if (items.length) {
    var d = new Date().getDate();
    var next = null;
    items.forEach(function (li) {
      var day = parseInt(li.getAttribute('data-day'), 10);
      var label = li.querySelector('[data-when]');
      var diff = day - d;
      if (!label) return;
      if (diff > 0) {
        label.textContent = diff === 1 ? 'Tomorrow' : 'In ' + diff + ' days';
        if (!next) next = li;
      } else if (diff === 0) {
        label.textContent = 'Due today';
        if (!next) next = li;
      } else {
        label.textContent = 'Next month';
      }
    });
    if (!next) next = items[0];
    next.classList.add('is-next');
  }

  /* ---------- Scroll reveal ---------- */
  var targets = document.querySelectorAll('.reveal');
  if (still || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (t) { t.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
    Array.prototype.forEach.call(targets, function (t) { io.observe(t); });
  }
})();
