/* Razorpay pay buttons on tier cards.
   Reads window.CGA_PAY (assets/pay-config.js). A tier only gets a button when an id is
   configured for it, so an empty config changes nothing on the page. Deliberately not
   applied to high-value advisory tiers — those should start with a conversation. */
(function () {
  'use strict';

  var SDK = 'https://checkout.razorpay.com/v1/payment-button.js';

  var CSS =
    '.cga-pay{margin:12px 0 0;padding-top:12px;border-top:1px dashed var(--line,#e2e2e8)}' +
    '.cga-pay p{margin:0 0 8px;font-size:.78rem;color:var(--slate,#6b7280)}' +
    '.cga-pay form{margin:0}' +
    '.cga-paylink{display:inline-block;width:100%;box-sizing:border-box;text-align:center;' +
    'background:var(--gold,#c6922c);color:#141a2e;font-weight:600;font-size:.95rem;' +
    'padding:11px 20px;border-radius:999px;text-decoration:none}' +
    '.cga-paylink:hover{filter:brightness(1.05)}';

  function page() {
    return (location.pathname || '').split('/').pop() || 'index.html';
  }

  // Ek tier card do tarah se pay le sakta hai:
  //   1. Razorpay Payment BUTTON ki id  (pl_xxxx)  -> Razorpay ka SDK mount hota hai
  //   2. Razorpay Payment LINK ka url   (https://rzp.io/...) -> seedha anchor lagta hai
  // Link banana dashboard mein kaafi aasan hai aur usme koi third-party script nahi
  // chalti, isliye wahi default raasta hai. Dono ek hi config mein mix ho sakte hain.
  function isLink(v) {
    return String(v).indexOf('http') === 0;
  }

  function mount(card, id) {
    var box = document.createElement('div');
    box.className = 'cga-pay';
    var note = document.createElement('p');
    // Saari published fees "se shuru" hain, isliye fixed amount ko advance kehna hi
    // sach hai. Isse client ko yeh nahi lagta ki poori fees chuk gayi.
    note.textContent = 'Ya advance abhi bhej dijiye \u2014 baaki scope dekhne ke baad';
    box.appendChild(note);
    card.appendChild(box);

    if (isLink(id)) {
      var a = document.createElement('a');
      a.className = 'cga-paylink';
      a.href = id;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Advance pay kijiye';
      box.appendChild(a);
      return;
    }

    var form = document.createElement('form');
    box.appendChild(form);

    var s = document.createElement('script');
    s.src = SDK;
    s.async = false;                    // keeps document.currentScript set for the SDK
    s.setAttribute('data-payment_button_id', id);
    form.appendChild(s);
  }

  function start() {
    var cfg = window.CGA_PAY;
    if (!cfg) { return; }
    var cards = document.querySelectorAll('.tier');
    if (!cards.length) { return; }
    var p = page();
    var added = 0;

    for (var i = 0; i < cards.length; i++) {
      var codeEl = cards[i].querySelector('.tier-code');
      if (!codeEl) { continue; }
      var code = (codeEl.textContent || '').trim();
      var id = cfg[p + ':' + code];
      if (!id) { continue; }
      mount(cards[i], id);
      added++;
    }

    if (added) {
      var st = document.createElement('style');
      st.textContent = CSS;
      document.head.appendChild(st);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
