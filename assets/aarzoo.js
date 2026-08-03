/* Aarzoo - CGA India site assistant (neerajjain.in)
   Hybrid: chips + short queries answer from the local KB instantly.
   Longer / unmatched questions go to the n8n webhook (Claude Haiku).
   KB is also the offline fallback if the API times out or errors. */
(function () {
  'use strict';

  var API = 'https://cga.app.n8n.cloud/webhook/aarzoo';
  var TIMEOUT = 22000;
  var WA = 'https://wa.me/919996647888?text=BIZ';
  var SOS = 'https://wa.me/919996647888?text=SOS';

  var box = document.getElementById('azBox');
  var btn = document.getElementById('azBtn');
  var msgs = document.getElementById('azMsgs');
  var input = document.getElementById('azInput');
  var chipBox = document.getElementById('azChips');
  var sendBtn = document.getElementById('azSend');
  var closeBtn = document.getElementById('azClose');
  if (!box || !btn || !msgs || !input) { return; }

  /* ---------- knowledge base (instant answers) ---------- */
  var KB = [
    { k: ['itr', 'income tax', 'return file', 'return filing', 'itr file'],
      a: 'ITR filing hum handle karte hain - accurate aur reviewed, refunds law ke hisaab se poore claim kiye jaate hain. ITR filing Rs. 499/- se shuru (offer price; GST aur baaki services extra).<br><br>Aage badhne ke liye WhatsApp par "BIZ" bhej dijiye.' },
    { k: ['gst notice', 'notice aaya', 'asmt', 'drc', 'reg-17', 'reg 17', 'gstr-3a', 'gstr 3a', 'adt-01'],
      a: 'GST notice aaya hai? Sabse pehle uska form number dekhiye - ASMT-10, DRC-01, REG-17, GSTR-3A - har form ka reply window alag hota hai.<br><br>Notice Decoder par apna form number chuniye aur turant matlab, time aur risk dekh lijiye: <a href="gst-notice-sos.html">GST Notice SOS</a><br>Ya notice ki photo seedha WhatsApp kar dijiye.' },
    { k: ['gst'],
      a: 'GST mein hum ye sab karte hain: registration, monthly returns, refunds aur department ke notices ka reply.<br><br>Notice se related ho toh yahan dekhiye: <a href="gst-notice-sos.html">GST Notice SOS</a>' },
    { k: ['company', 'pvt ltd', 'pvt', 'llp', 'opc', 'incorporation', 'firm register'],
      a: 'Company registration - Pvt Ltd, LLP, OPC, Partnership - hum end to end karte hain, sahi structure choose karne ki free advice ke saath.<br><br>Guide: <a href="article-pvtltd-vs-llp.html">Pvt Ltd vs LLP</a>' },
    { k: ['ngo', 'trust', '12ab', '80g', 'society', 'section 8'],
      a: 'NGO / Trust registration ke saath 12AB aur 80G - deed drafting se approval tak poora process hum karte hain.<br><br>Guide: <a href="article-12ab-80g.html">12AB aur 80G ki poori guide</a>' },
    { k: ['trademark', 'brand name', 'logo register'],
      a: 'Trademark registration se apna brand name ya logo protect kariye - koi aur claim kare usse pehle. Search se registration tak hum karte hain.' },
    { k: ['iso'],
      a: 'ISO certification - clients, vendors aur tenders ke saamne credibility ke liye. Poora process hum handle karte hain.' },
    { k: ['fssai', 'food licen', 'food licence'],
      a: 'FSSAI license - basic, state ya central - food business ke liye start se finish tak hum karte hain.' },
    { k: ['cfo', 'virtual cfo', 'accounts outsourc', 'bookkeep'],
      a: 'Virtual CFO - growing business ke liye CFO level financial oversight, full-time hire ke cost ke bina.' },
    { k: ['litigation', 'appeal', 'tribunal', 'hearing'],
      a: 'Tax litigation aur appeals - tribunals se courtrooms tak end-to-end representation. Tax aur legal dono ek hi desk par hote hain.' },
    { k: ['crypto', 'bitcoin', 'vda', 'virtual digital', 'coin', 'usdt', 'binance', 'wazirx', 'coindcx', 'nft', 'airdrop', 'staking', '194s', '115bbh'],
      a: 'Crypto / VDA tax - profit ho ya loss, dono ka hisaab ITR mein jaata hai.<br><br>Flat 30% tax lagta hai (slab nahi), sirf cost of acquisition ghata sakte hain, ek coin ka loss doosre coin ke profit se set off nahi hota, aur transfer par 1% TDS u/s 194S katta hai.<br><br>Fees Rs. 3,500 / Rs. 7,500 / Rs. 15,000 se shuru + GST.<br>Poori detail: <a href="crypto-tax.html">Crypto / VDA Tax</a>' },
    { k: ['manufactur', 'factory', 'plant', 'job work', 'itc-04', 'itc 04', 'e-way', 'eway', 'msme', 'udyam', 'cost audit', 'cost record', 'production'],
      a: 'Manufacturing compliance - GST aur input tax credit, job work aur ITC-04, e-way bill, MSME ka 45-din wala payment rule, factory aur labour registrations, aur cost records.<br><br>Ek baar ka compliance health check Rs. 7,500 se, monthly retainer Rs. 12,500/month se - dono + GST.<br>Poori detail: <a href="manufacturing.html">Manufacturing Compliance</a>' },
    { k: ['nri', 'foreign income', 'videsh', 'abroad', 'schedule fa', 'dtaa', 'form 67', 'rnor', 'residential status', 'resident status', 'esop', 'rsu', 'foreign account', 'foreign asset', 'repatriat'],
      a: 'Foreign income aur NRI taxation - pehle residential status tay hota hai, phir ye ki India mein kya-kya taxable hai.<br><br>Foreign assets ki reporting, foreign tax credit, DTAA relief, aur NRI property sale par lower TDS certificate - sab hum dekhte hain.<br><br>Fees Rs. 5,000 / Rs. 9,000 / Rs. 15,000 se shuru + GST.<br>Poori detail: <a href="foreign-income.html">Foreign Income aur NRI</a>' },
    { k: ['15ca', '15cb', 'transfer pricing', '3ceb', 'permanent establishment', 'cross border', 'cross-border', 'remittance', 'international tax', 'foreign payment', 'royalty', 'india entry', 'liaison office', 'branch office'],
      a: 'International taxation - cross-border payments aur group transactions ke liye.<br><br>Form 15CA/15CB certification, transfer pricing aur Form 3CEB, permanent establishment ka risk, treaty documentation, aur foreign company ke liye India entry setup.<br><br>Fees Rs. 2,500 per remittance se, transfer pricing Rs. 35,000 se, India entry Rs. 50,000 se - sab + GST.<br>Poori detail: <a href="international-tax.html">International Taxation</a>' },
    { k: ['retainer', 'monthly', 'mahine ka', 'yearly package', 'package', 'r1', 'r2', 'r3', 'r4', 'r5'],
      a: 'Monthly compliance retainer - har chhote kaam ke liye alag baat karne ki zaroorat nahi, sab ek fixed monthly fee mein.<br><br>R1 Proprietor Rs. 2,500/month se shuru<br>R2 Small company Rs. 6,000/month se shuru<br>R3 Growing SME Rs. 12,500/month se shuru (sabse zyada log yahi lete hain)<br>R4 Corporate Rs. 30,000/month se shuru<br>R5 MNC subsidiary Rs. 60,000/month se shuru<br><br>Sab + GST. Har tier mein kya-kya shamil hai: <a href="retainers.html">Compliance Retainers</a>' },
    { k: ['price', 'fees', 'fee', 'charge', 'cost', 'kitna', 'kitne paise', 'rate'],
      a: 'Jo prices website par likhi hain:<br><br>ITR filing Rs. 499/- se shuru (offer price)<br>Monthly retainer Rs. 2,500/month se shuru - <a href="retainers.html">paanch tiers dekhiye</a><br>GST notice reply Rs. 2,500 / Rs. 7,500 / Rs. 20,000 se - <a href="gst-notice-sos.html">teen tiers dekhiye</a><br>Crypto / VDA ITR Rs. 3,500 se shuru - <a href="crypto-tax.html">teen tiers dekhiye</a><br>Manufacturing health check Rs. 7,500 se, unit retainer Rs. 12,500/month se - <a href="manufacturing.html">detail dekhiye</a><br>NRI / foreign income Rs. 5,000 se shuru - <a href="foreign-income.html">teen tiers dekhiye</a><br>Form 15CA/15CB Rs. 2,500 se, transfer pricing Rs. 35,000 se - <a href="international-tax.html">detail dekhiye</a><br>GST registration Rs. 1,500 se shuru, monthly filing Rs. 750/month se<br>Company registration Rs. 6,000 se shuru - government fees aur stamp duty alag<br>NGO / Trust registration Rs. 12,000 se, 12AB aur 80G Rs. 15,000 se<br>Trademark Rs. 3,500 se, ISO Rs. 8,000 se, FSSAI Rs. 1,500 se - government fee alag<br>Virtual CFO Rs. 25,000/month se shuru<br>Litigation aur appeals ki fee consultation ke baad fix hoti hai<br><br>Sab + GST. Exact fee kaam ke scope par depend karti hai - free 15-minute call mein fixed quote pehle hi mil jaata hai, baad mein koi hidden charge nahi.' },
    { k: ['contact', 'phone', 'number', 'call', 'email', 'address', 'office', 'safidon', 'delhi', 'burari', 'kahan'],
      a: 'Neeraj ji direct / WhatsApp: +91 99966 47888<br>Safidon: 01686-265933, +91 95600 16162<br>Delhi (Burari): 011-71906890, +91 98999 00300<br>Email: contact@neerajjain.in, admin@cgaindia.com<br>Service: PAN India - lagbhag sab kaam online ho jata hai.' },
    { k: ['neeraj', 'founder', 'about', 'kaun ho', 'kaun hai'],
      a: 'Neeraj Jain - CGA India (Canjain Global Advisors) ke Founder aur CEO. 20+ ki team, 2,500+ clients, offices Safidon (Haryana) aur Burari (Delhi), service PAN India. PracEasy ke bhi founder.<br><br>Poori story: <a href="about.html">About page</a>' },
    { k: ['praceasy'],
      a: 'PracEasy - CA firms ke liye practice management software, Neeraj ji ka doosra venture. Dekhiye: <a href="https://praceasy.in" target="_blank" rel="noopener">praceasy.in</a>' },
    { k: ['update', 'news', 'daily'],
      a: 'Roz ke GST, Income Tax, TDS aur MCA updates Hinglish mein yahan milte hain: <a href="updates.html">Daily Updates</a>' },
    { k: ['service', 'kya karte', 'kya kaam', 'help', 'kaam kya'],
      a: 'CGA India ki services:<br>ITR Filing, GST, Company Registration, NGO/12AB/80G, Trademark, ISO, FSSAI, Virtual CFO, Tax Litigation.<br><br>Poori list: <a href="services.html">Services page</a>' },
    { k: ['online', 'bahar', 'dusre state', 'pan india', 'door'],
      a: 'Bilkul - lagbhag sab kaam online ho jata hai. Documents WhatsApp ya email par, baat call par. Hum Haryana, Delhi, UP, Rajasthan, Punjab regularly serve karte hain aur PAN India available hain.' },
    { k: ['safe', 'secure', 'confidential', 'privacy', 'data'],
      a: 'Aapke documents sirf aapke kaam ke liye use hote hain aur kahin share nahi kiye jaate - secure aur confidential process humari core promise hai.<br><br>Ek request: PAN, Aadhaar, OTP ya password is chat mein na bhejein.' },
    { k: ['hi', 'hello', 'hey', 'namaste', 'hii', 'hlo'],
      a: 'Namaste! Main Aarzoo hoon - CGA India ki AI assistant. Tax, GST, company registration, NGO - kisi bhi cheez mein help chahiye toh poochiye, ya neeche ke buttons use kar lijiye.' },
    { k: ['thank', 'thanks', 'shukriya', 'dhanyawad'],
      a: 'Aapka swagat hai. Aur koi sawal ho toh zaroor poochiye.' },
    { k: ['bot', 'robot', 'insaan', 'human', 'ai ho', 'real'],
      a: 'Main ek AI assistant hoon, insaan nahi. General jaankari de sakti hoon - lekin aapke specific case ka jawab Neeraj ji ki team hi degi.' }
  ];

  var CHIPS = [
    ['GST notice aaya hai', 'gst notice'],
    ['ITR filing', 'itr'],
    ['Company kholni hai', 'company'],
    ['NGO / 80G', 'ngo'],
    ['Monthly retainer', 'retainer'],
    ['Crypto / VDA tax', 'crypto'],
    ['NRI / foreign income', 'nri'],
    ['Fees kitni hai', 'fees'],
    ['Contact', 'contact']
  ];

  var FALLBACK = 'Is baare mein main sure nahi hoon - Neeraj ji ki team seedha bata degi.';

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function add(html, who) {
    var d = document.createElement('div');
    d.className = 'az-m ' + who;
    d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function waLink(href, label) {
    return '<br><br><a href="' + href + '" target="_blank" rel="noopener">' + esc(label) + '</a>';
  }

  function kbLookup(q) {
    var ql = ' ' + q.toLowerCase().replace(/[^a-z0-9\u0900-\u097F ]+/g, ' ').replace(/\s+/g, ' ') + ' ';
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].k.length; j++) {
        var k = KB[i].k[j];
        /* multi-word keys match as a phrase; single words must match a WHOLE
           word, else short keys like "hi" match inside "chahiye". */
        var hit = (k.indexOf(' ') > -1)
          ? ql.indexOf(' ' + k + ' ') > -1 || ql.indexOf(' ' + k) > -1
          : ql.indexOf(' ' + k + ' ') > -1;
        if (hit) { return KB[i].a; }
      }
    }
    return null;
  }

  /* ---------- typing indicator ---------- */
  var style = document.createElement('style');
  style.textContent =
    '.az-typing{display:inline-flex;gap:4px;align-items:center;padding:2px 0}' +
    '.az-typing i{width:6px;height:6px;border-radius:50%;background:#C6922C;display:block;animation:azb 1.1s infinite}' +
    '.az-typing i:nth-child(2){animation-delay:.18s}.az-typing i:nth-child(3){animation-delay:.36s}' +
    '@keyframes azb{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}' +
    '@media(prefers-reduced-motion:reduce){.az-typing i{animation:none;opacity:.6}}';
  document.head.appendChild(style);

  function showTyping() {
    return add('<span class="az-typing"><i></i><i></i><i></i></span>', 'bot');
  }

  /* ---------- history (last 6 turns, client side) ---------- */
  var history = [];
  function remember(role, text) {
    history.push({ role: role, text: String(text).slice(0, 300) });
    if (history.length > 6) { history = history.slice(-6); }
  }

  /* ---------- API call ---------- */
  function askApi(q, done) {
    var finished = false;
    var timer = setTimeout(function () {
      if (!finished) { finished = true; done(null); }
    }, TIMEOUT);

    var payload = {
      message: q,
      page: (location.pathname.split('/').pop() || 'index.html'),
      history: history.slice()
    };

    try {
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (finished) { return; }
          finished = true; clearTimeout(timer);
          done(d && d.reply ? d.reply : null);
        })
        .catch(function () {
          if (finished) { return; }
          finished = true; clearTimeout(timer);
          done(null);
        });
    } catch (e) {
      if (!finished) { finished = true; clearTimeout(timer); done(null); }
    }
  }

  /* ---------- main answer flow ---------- */
  var busy = false;

  function answer(q, fromChip) {
    var kb = kbLookup(q);

    /* chip clicks -> instant local answer (fast, zero cost).
       anything the visitor TYPES always goes to the AI. */
    if (fromChip && kb) {
      setTimeout(function () {
        add(kb + waLink(/notice/i.test(q) ? SOS : WA, 'WhatsApp par baat kariye'), 'bot');
        remember('bot', kb);
      }, 240);
      return;
    }

    /* otherwise ask the AI, with KB as fallback */
    busy = true;
    var dots = showTyping();
    askApi(q, function (reply) {
      if (dots && dots.parentNode) { dots.parentNode.removeChild(dots); }
      busy = false;
      if (reply) {
        add(reply, 'bot');
        remember('bot', reply.replace(/<[^>]*>/g, ' '));
      } else {
        var txt = kb || FALLBACK;
        add(txt + waLink(/notice/i.test(q) ? SOS : WA, 'WhatsApp par baat kariye'), 'bot');
        remember('bot', txt);
      }
    });
  }

  function send(text, fromChip) {
    var q = String(text || '').trim();
    if (!q || busy) { return; }
    if (q.length > 500) { q = q.slice(0, 500); }
    add(esc(q), 'user');
    remember('user', q);
    input.value = '';
    answer(q, fromChip === true);
  }

  /* ---------- wire up ---------- */
  if (chipBox) {
    CHIPS.forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'az-chip';
      b.type = 'button';
      b.textContent = c[0];
      b.addEventListener('click', function () { send(c[1], true); });
      chipBox.appendChild(b);
    });
  }

  var greeted = false;
  function toggle() {
    box.classList.toggle('open');
    if (box.classList.contains('open')) {
      if (!greeted) {
        greeted = true;
        setTimeout(function () {
          add('Namaste! Main <b>Aarzoo</b> hoon - CGA India ki AI assistant.<br>Tax, GST, company, NGO - kya help chahiye? Neeche buttons se chuniye ya likh dijiye.', 'bot');
        }, 220);
      }
      input.focus();
    }
  }

  btn.addEventListener('click', toggle);
  btn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
  if (closeBtn) {
    closeBtn.addEventListener('click', function () { box.classList.remove('open'); });
  }
  if (sendBtn) {
    sendBtn.addEventListener('click', function () { send(input.value); });
  }
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { send(input.value); }
  });
})();
