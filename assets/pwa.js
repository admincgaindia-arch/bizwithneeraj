/* CGA India — PWA runtime.
   1. Registers the service worker.
   2. Shows an install prompt: native on Android/desktop Chrome, an
      instruction card on iOS Safari (which has no beforeinstallprompt).
   The card only appears after real engagement, sits clear of the WhatsApp,
   Aarzoo and ticker floats, and stays dismissed for 30 days. */
(function () {
  'use strict';

  var DISMISS_KEY = 'cga_pwa_dismissed';
  var DISMISS_DAYS = 30;
  var deferred = null;
  var shown = false;

  /* ---------- service worker ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
    });
  }

  /* ---------- helpers ---------- */
  function standalone() {
    try {
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
             window.navigator.standalone === true;
    } catch (e) { return false; }
  }

  function dismissed() {
    try {
      var t = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10);
      return t && (Date.now() - t) < DISMISS_DAYS * 86400000;
    } catch (e) { return false; }
  }

  function remember() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (e) {}
  }

  function isIOS() {
    var ua = navigator.userAgent || '';
    var ios = /iPad|iPhone|iPod/.test(ua) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var chromeLike = /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
    return ios && !chromeLike;
  }

  /* ---------- styles ---------- */
  function injectCSS() {
    if (document.getElementById('cgaPwaCSS')) { return; }
    var s = document.createElement('style');
    s.id = 'cgaPwaCSS';
    s.textContent =
      '#cgaPwa{position:fixed;left:16px;bottom:150px;z-index:55;width:340px;max-width:calc(100vw - 32px);' +
      'background:#fff;color:#0D1834;border:1px solid rgba(31,51,100,.18);border-radius:16px;' +
      'box-shadow:0 24px 60px -18px rgba(13,24,52,.42);padding:16px 16px 14px;' +
      "font-family:'Instrument Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;" +
      'opacity:0;transform:translateY(10px);transition:opacity .22s ease,transform .22s ease}' +
      '#cgaPwa.on{opacity:1;transform:translateY(0)}' +
      '#cgaPwa .pw-top{display:flex;gap:12px;align-items:flex-start}' +
      '#cgaPwa .pw-ic{width:44px;height:44px;border-radius:11px;flex:0 0 44px;background:#1F3364;' +
      'display:grid;place-items:center;overflow:hidden}' +
      '#cgaPwa .pw-ic img{width:44px;height:44px;display:block}' +
      '#cgaPwa .pw-t{font-size:15px;font-weight:700;line-height:1.3;margin:1px 0 3px}' +
      '#cgaPwa .pw-d{font-size:13px;line-height:1.5;color:#4A5878;margin:0}' +
      '#cgaPwa .pw-x{position:absolute;top:8px;right:8px;width:30px;height:30px;border:0;background:transparent;' +
      'color:#8E9CBE;font-size:20px;line-height:1;cursor:pointer;border-radius:8px;font-family:inherit}' +
      '#cgaPwa .pw-x:hover{background:rgba(31,51,100,.07);color:#1F3364}' +
      '#cgaPwa .pw-act{display:flex;gap:9px;margin-top:13px}' +
      '#cgaPwa .pw-go{flex:1;padding:10px 14px;border:0;border-radius:999px;background:#1F3364;color:#fff;' +
      'font-weight:700;font-size:14px;cursor:pointer;font-family:inherit}' +
      '#cgaPwa .pw-go:hover{background:#13224A}' +
      '#cgaPwa .pw-no{padding:10px 14px;border:1px solid rgba(31,51,100,.2);border-radius:999px;background:#fff;' +
      'color:#4A5878;font-weight:600;font-size:14px;cursor:pointer;font-family:inherit}' +
      '#cgaPwa .pw-ios{margin:12px 0 0;padding:10px 12px;border-radius:10px;background:#F4F6FB;' +
      'font-size:13px;line-height:1.55;color:#1F3364}' +
      '#cgaPwa .pw-ios b{color:#0D1834}' +
      '#cgaPwa .pw-sh{display:inline-block;width:15px;height:15px;vertical-align:-3px;margin:0 1px}' +
      '@media(max-width:760px){#cgaPwa{left:12px;right:12px;width:auto;max-width:none;bottom:156px}}' +
      '@media(prefers-reduced-motion:reduce){#cgaPwa{transition:none}}';
    document.head.appendChild(s);
  }

  /* ---------- card ---------- */
  function build(ios) {
    injectCSS();
    var box = document.createElement('div');
    box.id = 'cgaPwa';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'CGA India app install');
    box.style.position = 'fixed';

    var body =
      '<button class="pw-x" type="button" aria-label="Band karein">&times;</button>' +
      '<div class="pw-top">' +
        '<div class="pw-ic"><img src="/assets/icon-512.png" width="44" height="44" alt=""></div>' +
        '<div>' +
          '<div class="pw-t">CGA India app install karein</div>' +
          '<p class="pw-d">Phone ki home screen par icon — ek tap mein ITR, GST, notices aur daily updates. Offline bhi khulta hai.</p>' +
        '</div>' +
      '</div>';

    if (ios) {
      body +=
        '<div class="pw-ios">Safari mein niche <b>Share</b> ' +
        '<svg class="pw-sh" viewBox="0 0 24 24" fill="none" stroke="#1F3364" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V3"/><path d="M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>' +
        ' button dabayein, phir <b>Add to Home Screen</b> chunein.</div>' +
        '<div class="pw-act"><button class="pw-no" type="button" style="flex:1">Theek hai</button></div>';
    } else {
      body +=
        '<div class="pw-act">' +
          '<button class="pw-go" type="button">Install karein</button>' +
          '<button class="pw-no" type="button">Abhi nahi</button>' +
        '</div>';
    }

    box.innerHTML = body;
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add('on'); });

    function close() {
      remember();
      box.classList.remove('on');
      setTimeout(function () { if (box.parentNode) { box.parentNode.removeChild(box); } }, 240);
    }

    box.querySelector('.pw-x').addEventListener('click', close);
    var no = box.querySelector('.pw-no');
    if (no) { no.addEventListener('click', close); }

    var go = box.querySelector('.pw-go');
    if (go) {
      go.addEventListener('click', function () {
        if (!deferred) { close(); return; }
        deferred.prompt();
        deferred.userChoice.then(function () {
          deferred = null;
          close();
        }).catch(function () { close(); });
      });
    }
    return box;
  }

  function show(ios) {
    if (shown || standalone() || dismissed() || !document.body) { return; }
    if (document.getElementById('cgaPwa')) { return; }
    shown = true;
    build(ios);
  }

  /* ---------- engagement gate ---------- */
  function whenEngaged(fn) {
    var done = false;
    function fire() {
      if (done) { return; }
      done = true;
      window.removeEventListener('scroll', onScroll);
      fn();
    }
    function onScroll() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && (window.scrollY / h) > 0.35) { fire(); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(fire, 25000);
  }

  /* ---------- triggers ---------- */
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    if (standalone() || dismissed()) { return; }
    whenEngaged(function () { show(false); });
  });

  window.addEventListener('appinstalled', function () {
    remember();
    var b = document.getElementById('cgaPwa');
    if (b && b.parentNode) { b.parentNode.removeChild(b); }
  });

  if (isIOS()) {
    window.addEventListener('load', function () {
      if (standalone() || dismissed()) { return; }
      whenEngaged(function () { show(true); });
    });
  }

  /* Optional manual trigger: any element with data-pwa-install opens the card. */
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-pwa-install]') : null;
    if (!t) { return; }
    e.preventDefault();
    try { localStorage.removeItem(DISMISS_KEY); } catch (err) {}
    shown = false;
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.then(function () { deferred = null; });
    } else {
      show(isIOS());
    }
  });
})();
