/* CGA lead form. Posts to the n8n Lead Capture webhook so the lead is saved even if the
   visitor never opens WhatsApp. If the request fails, it falls back to a prefilled WhatsApp
   message so no enquiry is ever lost. Injects itself just above the footer. */
(function () {
  'use strict';

  var ENDPOINT = 'https://cga.app.n8n.cloud/webhook/lead';
  var WA = 'https://wa.me/919996647888?text=';

  var SERVICES = [
    'ITR filing', 'GST registration ya return', 'GST notice', 'Company / LLP registration',
    'NGO, Trust, 12AB aur 80G', 'Trademark aur IP', 'Payroll aur PF', 'Labour code / salary structure',
    'Crypto / VDA tax', 'Foreign income ya NRI', 'International taxation', 'E-commerce seller',
    'Startup services', 'Manufacturing compliance', 'Monthly retainer', 'Kuch aur'
  ];

  var PAGE_MAP = {
    'crypto-tax': 'Crypto / VDA tax',
    'manufacturing': 'Manufacturing compliance',
    'foreign-income': 'Foreign income ya NRI',
    'international-tax': 'International taxation',
    'ecommerce-sellers': 'E-commerce seller',
    'startup': 'Startup services',
    'payroll-hr': 'Payroll aur PF',
    'trademark-ip': 'Trademark aur IP',
    'labour-code-restructuring': 'Labour code / salary structure',
    'gst-notice-sos': 'GST notice',
    'retainers': 'Monthly retainer'
  };

  var CSS =
    '#cgaLead{padding:58px 0;background:var(--navy,#141f45);color:#fff}' +
    '#cgaLead .cgl-in{display:grid;grid-template-columns:1fr 1fr;gap:38px;align-items:start}' +
    '@media(max-width:820px){#cgaLead .cgl-in{grid-template-columns:1fr;gap:26px}}' +
    '#cgaLead h2{margin:0 0 10px;color:#fff;font-family:var(--serif,Georgia,serif);font-size:clamp(1.4rem,2.8vw,2rem)}' +
    '#cgaLead .cgl-lede{color:rgba(255,255,255,.78);margin:0 0 16px;font-size:.98rem;line-height:1.6}' +
    '#cgaLead .cgl-pts{list-style:none;padding:0;margin:0;color:rgba(255,255,255,.72);font-size:.92rem}' +
    '#cgaLead .cgl-pts li{padding:5px 0 5px 20px;position:relative}' +
    '#cgaLead .cgl-pts li:before{content:"\\2022";position:absolute;left:2px;color:var(--gold,#b8912f);font-weight:700}' +
    '.cgl-card{background:#fff;border-radius:18px;padding:22px;box-shadow:0 18px 46px rgba(0,0,0,.22)}' +
    '.cgl-card label{display:block;font-size:.78rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;' +
    'color:var(--slate,#6b7280);margin:0 0 5px}' +
    '.cgl-f{margin-bottom:13px}' +
    '.cgl-card input,.cgl-card select,.cgl-card textarea{width:100%;box-sizing:border-box;font:inherit;font-size:.95rem;' +
    'color:var(--ink,#141a2e);background:#fff;border:1px solid var(--line,#e2e2e8);border-radius:11px;padding:11px 12px}' +
    '.cgl-card textarea{min-height:74px;resize:vertical}' +
    '.cgl-card input:focus,.cgl-card select:focus,.cgl-card textarea:focus{outline:none;border-color:var(--gold,#b8912f);' +
    'box-shadow:0 0 0 3px rgba(184,145,47,.16)}' +
    '.cgl-hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0}' +
    '.cgl-go{width:100%;border:0;border-radius:999px;padding:13px 18px;font:inherit;font-weight:700;cursor:pointer;' +
    'background:var(--gold,#b8912f);color:#1b1b1b;font-size:1rem}' +
    '.cgl-go[disabled]{opacity:.6;cursor:default}' +
    '.cgl-note{margin:11px 0 0;font-size:.78rem;color:var(--slate,#6b7280);line-height:1.5}' +
    '.cgl-err{margin:10px 0 0;font-size:.86rem;color:#c0392b;display:none}' +
    '.cgl-done{text-align:center;padding:8px 4px}' +
    '.cgl-done h3{margin:0 0 8px;color:var(--ink,#141a2e)}' +
    '.cgl-done p{margin:0 0 16px;color:var(--slate,#6b7280);font-size:.95rem}' +
    '.cgl-wa{display:inline-block;background:#25d366;color:#fff;text-decoration:none;font-weight:700;' +
    'border-radius:999px;padding:11px 20px}';

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (html != null) { n.innerHTML = html; }
    return n;
  }

  function pageKey() {
    var p = (location.pathname || '').split('/').pop() || 'index.html';
    return p.replace('.html', '').toLowerCase();
  }

  function build() {
    if (document.getElementById('cgaLead')) { return; }
    var foot = document.querySelector('footer');
    if (!foot) { return; }

    var style = el('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var pre = PAGE_MAP[pageKey()] || '';
    var opts = '<option value="">Chuniye\u2026</option>';
    for (var i = 0; i < SERVICES.length; i++) {
      opts += '<option value="' + SERVICES[i] + '"' + (SERVICES[i] === pre ? ' selected' : '') + '>' + SERVICES[i] + '</option>';
    }

    var sec = el('section');
    sec.id = 'cgaLead';
    sec.innerHTML =
      '<div class="wrap cgl-in">' +
        '<div>' +
          '<h2>Apna kaam bata dijiye</h2>' +
          '<p class="cgl-lede">Naam aur number chhod dijiye. Hum dekh kar batayenge ki aapke case mein kya banta hai aur kitni fees lagegi \u2014 pehli baat ke liye koi charge nahi.</p>' +
          '<ul class="cgl-pts">' +
            '<li>Fixed quote kaam shuru hone se pehle, likhit mein</li>' +
            '<li>Safidon, Delhi aur PAN India \u2014 kaam online ho jata hai</li>' +
            '<li>Chartered Accountant aur Advocate, dono ek hi desk par</li>' +
          '</ul>' +
        '</div>' +
        '<div class="cgl-card">' +
          '<form id="cglForm" novalidate>' +
            '<div class="cgl-f"><label for="cglName">Aapka naam</label>' +
              '<input id="cglName" name="name" type="text" autocomplete="name" maxlength="80" required></div>' +
            '<div class="cgl-f"><label for="cglMobile">Mobile number</label>' +
              '<input id="cglMobile" name="mobile" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" required></div>' +
            '<div class="cgl-f"><label for="cglService">Kis cheez ke liye</label>' +
              '<select id="cglService" name="service">' + opts + '</select></div>' +
            '<div class="cgl-f"><label for="cglMsg">Thoda detail mein (optional)</label>' +
              '<textarea id="cglMsg" name="message" maxlength="600"></textarea></div>' +
            '<input class="cgl-hp" tabindex="-1" autocomplete="off" name="company" aria-hidden="true">' +
            '<button class="cgl-go" type="submit">Bhej dijiye</button>' +
            '<p class="cgl-err" id="cglErr"></p>' +
            '<p class="cgl-note">Hum sirf aapse baat karne ke liye ye details use karte hain. PAN, Aadhaar, OTP ya bank details yahan mat likhiye.</p>' +
          '</form>' +
        '</div>' +
      '</div>';

    foot.parentNode.insertBefore(sec, foot);
    wire(sec);
  }

  function waText(d) {
    var t = 'BIZ - ' + (d.service || 'enquiry') + ' - ' + d.name;
    return WA + encodeURIComponent(t.slice(0, 90));
  }

  function done(card, d, saved) {
    card.innerHTML =
      '<div class="cgl-done">' +
        '<h3>Shukriya, ' + (d.name.split(' ')[0] || '') + '</h3>' +
        '<p>' + (saved
          ? 'Aapki detail hum tak pahunch gayi hai. Team jald hi call karegi.'
          : 'Ek dikkat aa gayi. Neeche WhatsApp par bhej dijiye, wo seedha pahunch jayega.') + '</p>' +
        '<a class="cgl-wa" href="' + waText(d) + '" target="_blank" rel="noopener">WhatsApp par baat kariye</a>' +
      '</div>';
  }

  function wire(sec) {
    var form = sec.querySelector('#cglForm');
    var err = sec.querySelector('#cglErr');
    var btn = sec.querySelector('.cgl-go');
    var card = sec.querySelector('.cgl-card');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = {
        name: form.name.value.trim(),
        mobile: form.mobile.value.trim(),
        service: form.service.value,
        message: form.message.value.trim(),
        company: form.company.value,
        page: (location.pathname || '').split('/').pop() || 'index.html'
      };
      var digits = d.mobile.replace(/[^0-9]/g, '');
      if (d.name.length < 2) { err.textContent = 'Apna naam likh dijiye.'; err.style.display = 'block'; return; }
      if (digits.length < 10) { err.textContent = 'Sahi mobile number likhiye.'; err.style.display = 'block'; return; }
      err.style.display = 'none';
      btn.disabled = true;
      btn.textContent = 'Bhej rahe hain\u2026';

      var timer = setTimeout(function () { done(card, d, false); }, 12000);

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d)
      }).then(function (r) {
        clearTimeout(timer);
        done(card, d, r && r.ok);
      }).catch(function () {
        clearTimeout(timer);
        done(card, d, false);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
