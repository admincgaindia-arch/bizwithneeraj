/* CGA announcements - drop-in.
   Renders a dismissible top strip and an optional card section.
   Add <div id="cga-announcements"></div> where the cards should appear.
   Content lives in data/announcements.json - no code changes needed to publish. */
(function () {
  var SRC = 'data/announcements.json';
  var KEY = 'cga-ann-dismissed';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function safeUrl(u) {
    var s = String(u || '').trim(), lo = s.toLowerCase();
    if (lo.indexOf('http://') === 0 || lo.indexOf('https://') === 0) return s;
    if (/^[a-z0-9._-]+\.html(\?[^"']*)?$/i.test(s)) return s;
    return '';
  }
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return isNaN(d) ? null : d;
  }
  function daysLeft(d) { return Math.round((d - today()) / 86400000); }

  function dismissed() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function dismiss(id) {
    try {
      var a = dismissed(); if (a.indexOf(id) === -1) a.push(id);
      sessionStorage.setItem(KEY, JSON.stringify(a));
    } catch (e) {}
  }

  function live(items) {
    var t = today();
    return items.filter(function (it) {
      if (!it || !it.title) return false;
      var ex = parseDate(it.expires);
      return !ex || ex >= t;
    });
  }

  function countdown(it) {
    var d = parseDate(it.due || it.expires);
    if (!d) return '';
    var n = daysLeft(d);
    if (n < 0 || n > 14) return '';
    if (n === 0) return 'Aaj aakhri din';
    if (n === 1) return 'Kal aakhri din';
    return n + ' din baaki';
  }

  function renderStrip(it) {
    if (document.querySelector('.cga-strip')) return;
    var id = it.id || it.title;
    if (dismissed().indexOf(id) !== -1) return;
    var cd = countdown(it), url = safeUrl(it.url);
    var bar = document.createElement('div');
    bar.className = 'cga-strip cga-t-' + (it.type || 'info');
    bar.innerHTML =
      '<div class="cga-strip-in">' +
        '<span class="cga-dot"></span>' +
        '<span class="cga-strip-txt"><b>' + esc(it.title) + '</b>' +
          (it.detail ? ' <span>' + esc(it.detail) + '</span>' : '') +
          (cd ? ' <em>' + esc(cd) + '</em>' : '') +
        '</span>' +
        (url ? '<a class="cga-strip-cta" href="' + esc(url) + '">Dekhiye &rarr;</a>' : '') +
        '<button class="cga-strip-x" aria-label="Band kariye">&times;</button>' +
      '</div>';
    document.body.insertBefore(bar, document.body.firstChild);
    bar.querySelector('.cga-strip-x').addEventListener('click', function () {
      dismiss(id); bar.parentNode.removeChild(bar);
    });
  }

  function renderCards(host, items) {
    if (!host || !items.length) return;
    var html = '<div class="cga-ann-head"><h2>Suchnayein</h2></div><div class="cga-ann-grid">';
    items.forEach(function (it) {
      var cd = countdown(it), url = safeUrl(it.url);
      html += '<article class="cga-ann cga-t-' + (it.type || 'info') + '">' +
        '<h3>' + esc(it.title) + '</h3>' +
        (it.detail ? '<p>' + esc(it.detail) + '</p>' : '') +
        (cd ? '<span class="cga-cd">' + esc(cd) + '</span>' : '') +
        (url ? '<a href="' + esc(url) + '">Aur padhiye &rarr;</a>' : '') +
        '</article>';
    });
    host.innerHTML = html + '</div>';
  }

  var CSS =
    '.cga-strip{background:var(--ink,#0D1834);color:#fff;font-size:.88rem}' +
    '.cga-strip-in{max-width:1140px;margin:0 auto;padding:10px 24px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}' +
    '.cga-strip .cga-dot{width:9px;height:9px;border-radius:50%;background:var(--gold,#C6922C);flex:none}' +
    '.cga-strip-txt{flex:1;min-width:0}' +
    '.cga-strip-txt b{color:#fff}.cga-strip-txt span{opacity:.8}' +
    '.cga-strip-txt em{font-style:normal;color:var(--gold-soft,#E3B54A);font-weight:600}' +
    '.cga-strip-cta{color:var(--gold-soft,#E3B54A);text-decoration:none;font-weight:600;white-space:nowrap}' +
    '.cga-strip-x{background:none;border:none;color:rgba(255,255,255,.6);font-size:1.25rem;cursor:pointer;line-height:1;padding:0 2px}' +
    '.cga-strip-x:hover{color:#fff}' +
    '.cga-strip.cga-t-urgent{background:#7A2E39}.cga-strip.cga-t-deadline .cga-dot{background:#E3B54A}' +
    '.cga-ann-head h2{font-family:"Fraunces",serif;font-size:1.5rem;color:var(--ink,#0D1834);margin-bottom:18px}' +
    '.cga-ann-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}' +
    '@media(max-width:900px){.cga-ann-grid{grid-template-columns:1fr}}' +
    '.cga-ann{background:#fff;border:1px solid var(--line,#E4E1D6);border-left:4px solid var(--gold,#C6922C);border-radius:12px;padding:20px 22px}' +
    '.cga-ann.cga-t-urgent{border-left-color:#B4342A}.cga-ann.cga-t-office{border-left-color:var(--navy,#1F3364)}' +
    '.cga-ann h3{font-size:1.05rem;color:var(--navy,#1F3364);margin-bottom:8px}' +
    '.cga-ann p{font-size:.92rem;color:var(--slate,#43506B)}' +
    '.cga-cd{display:inline-block;margin-top:10px;font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gold,#C6922C)}' +
    '.cga-ann a{display:inline-block;margin-top:10px;color:var(--navy,#1F3364);font-weight:600;font-size:.88rem;text-decoration:none;border-bottom:2px solid var(--gold,#C6922C)}';

  function boot(data) {
    var items = live(Array.isArray(data && data.items) ? data.items : []);
    if (!items.length) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var strip = items.filter(function (i) { return i.strip === true; })[0];
    if (strip) renderStrip(strip);
    renderCards(document.getElementById('cga-announcements'), items);
  }

  function start() {
    fetch(SRC + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(boot)
      .catch(function () { /* silent - announcements are optional */ });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
