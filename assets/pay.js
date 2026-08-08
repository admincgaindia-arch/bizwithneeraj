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
    '.cga-pay form{margin:0}';

  function page() {
    return (location.pathname || '').split('/').pop() || 'index.html';
  }

  function mount(card, id) {
    var box = document.createElement('div');
    box.className = 'cga-pay';
    var note = document.createElement('p');
    note.textContent = 'Ya abhi online pay kar dijiye';
    var form = document.createElement('form');
    box.appendChild(note);
    box.appendChild(form);
    card.appendChild(box);

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
