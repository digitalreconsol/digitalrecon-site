(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();

(function () {
  var root = document.querySelector('[data-tabs]');
  if (!root) return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var bar = root.querySelector('.tabs-progress');
  var toggle = root.querySelector('.tabs-toggle');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var idx = 0, playing = !reduce;
  root.classList.add('is-tabs');

  function restart() {
    root.classList.remove('playing');
    void bar.offsetWidth;
    if (playing) root.classList.add('playing');
  }
  function setPlaying(on) {
    playing = on;
    toggle.textContent = on ? 'pause' : 'play';
    toggle.setAttribute('aria-label', on ? 'Pause automatic cycling' : 'Start automatic cycling');
    restart();
  }
  function show(i, focus) {
    idx = (i + tabs.length) % tabs.length;
    tabs.forEach(function (t, n) {
      var sel = n === idx;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
    });
    panels.forEach(function (p, n) {
      var on = n === idx;
      p.classList.toggle('on', on);
      if (on) { p.removeAttribute('inert'); p.removeAttribute('aria-hidden'); }
      else { p.setAttribute('inert', ''); p.setAttribute('aria-hidden', 'true'); }
    });
    if (focus) tabs[idx].focus();
    restart();
  }
  panels.forEach(function (p, n) { if (n) { p.setAttribute('inert', ''); p.setAttribute('aria-hidden', 'true'); } });
  toggle.hidden = false;
  toggle.textContent = playing ? 'pause' : 'play';

  tabs.forEach(function (t, n) {
    t.addEventListener('click', function () { setPlaying(false); show(n); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, to = null;
      if (k === 'ArrowRight') to = idx + 1;
      else if (k === 'ArrowLeft') to = idx - 1;
      else if (k === 'Home') to = 0;
      else if (k === 'End') to = tabs.length - 1;
      if (to !== null) { e.preventDefault(); setPlaying(false); show(to, true); }
    });
  });
  toggle.addEventListener('click', function () { setPlaying(!playing); });
  bar.addEventListener('animationend', function () { if (playing) show(idx + 1); });
  restart();
})();
