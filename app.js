// Shared behaviour for every page
(function () {
  var root = document.documentElement;

  // theme (dark by default)
  try { var t = localStorage.getItem('ps-theme'); if (t) root.setAttribute('data-theme', t); } catch (e) {}
  document.addEventListener('DOMContentLoaded', function () {
    var tb = document.getElementById('theme');
    if (tb) tb.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ps-theme', next); } catch (e) {}
    });

    // mobile menu
    var bg = document.getElementById('burger'), menu = document.querySelector('.menu');
    if (bg) bg.addEventListener('click', function () { menu.classList.toggle('open'); });

    // active link
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu a').forEach(function (a) {
      if (a.getAttribute('href') === here) a.classList.add('active');
    });

    // page transition on internal links
    document.querySelectorAll('a[href$=".html"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || a.target === '_blank') return;
        e.preventDefault();
        document.body.classList.add('leaving');
        setTimeout(function () { location.href = a.getAttribute('href'); }, 220);
      });
    });

    // spotlight on cards
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.spot');
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });

    // reveal + counters
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        en.target.querySelectorAll('[data-count]').forEach(countUp);
        en.target.querySelectorAll('[data-w]').forEach(function (b) { b.style.width = b.dataset.w + '%'; });
        io.unobserve(en.target);
      });
    }, { threshold: .15 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
  });

  function countUp(el) {
    var end = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1100, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = v + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  window.toast = function (msg) {
    var t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2000);
  };
})();
