/* CGA testimonials - drop-in, NOT wired into any page yet.
   Add <div id="cga-testimonials"></div> plus this script where you want it.
   A quote renders ONLY if consent is true, so nothing can go live by accident. */
(function () {
  var SRC = 'data/testimonials.json';
  var host = document.getElementById('cga-testimonials');
  if (!host) { return; }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  var CSS =
    '.cga-tm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}' +
    '@media(max-width:900px){.cga-tm-grid{grid-template-columns:1fr}}' +
    '.cga-tm{background:#fff;border:1px solid var(--line,#E4E1D6);border-radius:14px;padding:24px 22px}' +
    '.cga-tm p{font-family:"Fraunces",serif;font-size:1.02rem;line-height:1.55;color:var(--navy-deep,#13224A)}' +
    '.cga-tm footer{background:none;padding:14px 0 0;margin:0;font-size:.85rem;color:var(--slate,#43506B)}' +
    '.cga-tm footer b{display:block;color:var(--navy,#1F3364);font-size:.95rem}';

  function render(list) {
    var ok = list.filter(function (t) { return t && t.consent === true && t.quote; });
    if (!ok.length) { return; }
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var html = '<div class="cga-tm-grid">';
    ok.forEach(function (t) {
      html += '<article class="cga-tm"><p>' + esc(t.quote) + '</p><footer><b>' + esc(t.name || '') + '</b>' +
        (t.role ? esc(t.role) : '') + '</footer></article>';
    });
    host.innerHTML = html + '</div>';
  }

  fetch(SRC + '?t=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) { render(Array.isArray(d && d.items) ? d.items : []); })
    .catch(function () { /* silent */ });
})();
