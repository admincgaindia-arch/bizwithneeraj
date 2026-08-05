/* CGA live update ticker — reads data/updates.json, the same feed that powers updates.html.
   Every line shown here is a real published update. Nothing is invented, nothing loops fake activity. */
(function () {
  'use strict';

  if (document.getElementById('cgaTicker')) { return; }
  var path = (location.pathname || '').toLowerCase();
  if (path.indexOf('updates.html') !== -1) { return; }
  try { if (window.sessionStorage && sessionStorage.getItem('cgaTickerOff') === '1') { return; } } catch (e) {}

  var ROTATE_MS = 8000;
  var MAX_ITEMS = 9;

  var CSS =
    '#cgaTicker{position:fixed;left:16px;bottom:20px;z-index:60;max-width:min(370px,calc(100vw - 108px));' +
    'font-family:var(--sans,system-ui,sans-serif);opacity:0;transform:translateY(10px);' +
    'transition:opacity .45s ease,transform .45s ease}' +
    '#cgaTicker.on{opacity:1;transform:none}' +
    '.cgt-card{display:flex;align-items:flex-start;gap:10px;background:#fff;border:1px solid var(--line,#e6e6ea);' +
    'border-left:3px solid var(--gold,#b8912f);border-radius:14px;padding:11px 12px 11px 13px;' +
    'box-shadow:0 10px 30px rgba(16,24,48,.13)}' +
    '.cgt-body{min-width:0;flex:1}' +
    '.cgt-top{display:flex;align-items:center;gap:7px;margin-bottom:3px}' +
    '.cgt-dot{width:7px;height:7px;border-radius:50%;background:#188038;flex:0 0 auto;' +
    'box-shadow:0 0 0 0 rgba(24,128,56,.55);animation:cgtPulse 2.4s infinite}' +
    '@keyframes cgtPulse{70%{box-shadow:0 0 0 7px rgba(24,128,56,0)}100%{box-shadow:0 0 0 0 rgba(24,128,56,0)}}' +
    '.cgt-cat{font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold,#b8912f)}' +
    '.cgt-head{display:block;font-size:.86rem;line-height:1.38;color:var(--ink,#141a2e);text-decoration:none;font-weight:600}' +
    '.cgt-head:hover{text-decoration:underline}' +
    '.cgt-foot{margin-top:4px;font-size:.7rem;color:var(--slate,#6b7280)}' +
    '.cgt-x{flex:0 0 auto;border:0;background:transparent;color:#9aa3b2;font-size:15px;line-height:1;' +
    'cursor:pointer;padding:2px 2px 2px 4px}' +
    '.cgt-x:hover{color:var(--ink,#141a2e)}' +
    '.cgt-fade{transition:opacity .3s ease}' +
    '@media(max-width:560px){#cgaTicker{left:12px;bottom:14px;max-width:calc(100vw - 96px)}' +
    '.cgt-head{font-size:.8rem}}' +
    '@media(prefers-reduced-motion:reduce){#cgaTicker,.cgt-fade{transition:none}.cgt-dot{animation:none}}';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function clip(s, n) {
    s = String(s == null ? '' : s).trim();
    return s.length > n ? s.slice(0, n - 1).replace(/[\s,;:.\-]+$/, '') + '\u2026' : s;
  }

  function whenText(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) { return ''; }
    var today = new Date();
    var days = Math.round((new Date(today.getFullYear(), today.getMonth(), today.getDate()) - d) / 86400000);
    if (days <= 0) { return 'Aaj ka update'; }
    if (days === 1) { return 'Kal ka update'; }
    if (days < 7) { return days + ' din pehle'; }
    return 'Is hafte';
  }

  function collect(data) {
    var out = [];
    var digests = (data && data.digests) || [];
    for (var i = 0; i < digests.length && out.length < MAX_ITEMS; i++) {
      var d = digests[i];
      var items = (d && d.items) || [];
      for (var j = 0; j < items.length && out.length < MAX_ITEMS; j++) {
        var it = items[j];
        if (!it || !it.headline) { continue; }
        out.push({ cat: it.category || 'Update', head: it.headline, when: whenText(d.date) });
      }
    }
    return out;
  }

  function build(list) {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var box = document.createElement('div');
    box.id = 'cgaTicker';
    box.setAttribute('aria-live', 'polite');
    box.innerHTML =
      '<div class="cgt-card">' +
        '<div class="cgt-body cgt-fade">' +
          '<div class="cgt-top"><span class="cgt-dot"></span><span class="cgt-cat"></span></div>' +
          '<a class="cgt-head" href="updates.html"></a>' +
          '<div class="cgt-foot"></div>' +
        '</div>' +
        '<button class="cgt-x" type="button" aria-label="Band kariye">&#10005;</button>' +
      '</div>';
    document.body.appendChild(box);

    var body = box.querySelector('.cgt-body');
    var cat = box.querySelector('.cgt-cat');
    var head = box.querySelector('.cgt-head');
    var foot = box.querySelector('.cgt-foot');
    var idx = 0;
    var timer = null;

    function paint() {
      var it = list[idx % list.length];
      cat.textContent = it.cat;
      head.textContent = clip(it.head, 92);
      foot.textContent = it.when + ' \u00b7 sabhi updates dekhiye';
    }

    function next() {
      body.style.opacity = '0';
      setTimeout(function () { idx++; paint(); body.style.opacity = '1'; }, 300);
    }

    paint();
    setTimeout(function () { box.classList.add('on'); }, 900);
    if (list.length > 1) { timer = setInterval(next, ROTATE_MS); }

    box.addEventListener('mouseenter', function () { if (timer) { clearInterval(timer); timer = null; } });
    box.addEventListener('mouseleave', function () {
      if (!timer && list.length > 1) { timer = setInterval(next, ROTATE_MS); }
    });
    box.querySelector('.cgt-x').addEventListener('click', function () {
      if (timer) { clearInterval(timer); }
      box.classList.remove('on');
      setTimeout(function () { if (box.parentNode) { box.parentNode.removeChild(box); } }, 450);
      try { if (window.sessionStorage) { sessionStorage.setItem('cgaTickerOff', '1'); } } catch (e) {}
    });
  }

  function start() {
    fetch('data/updates.json?t=' + Date.now())
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        var list = collect(data);
        if (list.length) { build(list); }
      })
      .catch(function () { /* feed unavailable — show nothing rather than something invented */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
