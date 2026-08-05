/* CGA client logo strip.
   Reads a fixed list of files from assets/ and shows only the ones that actually load.
   Nothing is placeholdered: if fewer than MIN_LOGOS are present the whole section stays hidden,
   so the strip can never display an empty box or a broken image. Drop a new file into
   assets/ using one of the names below and it appears on the next page load. */
(function () {
  'use strict';

  var MIN_LOGOS = 3;
  var BASE = 'assets/';

  var LOGOS = [
    { file: 'cozycato.jpg', name: 'Cozycato' },
    { file: 'madhu-amrit.jpg', name: 'Madhu Amrit' },
    { file: 'avit-fresh-foods.jpg', name: 'AVIT Fresh Foods' },
    { file: 'sugarease.png', name: 'SugarEase' },
    { file: 'aushadhm.png', name: 'Aushadhm' },
    { file: 'pure-india.png', name: 'Pure India' },
    { file: 'premium-cakes.png', name: 'Premium Cakes & Co' }
  ];

  var CSS =
    '#cgaClients{padding:54px 0;background:#fff;border-top:1px solid var(--line,#e6e6ea);' +
    'border-bottom:1px solid var(--line,#e6e6ea);overflow:hidden}' +
    '#cgaClients .cgc-h{text-align:center;margin:0 0 6px;font-family:var(--serif,Georgia,serif);' +
    'color:var(--ink,#141a2e);font-size:clamp(1.25rem,2.4vw,1.7rem)}' +
    '#cgaClients .cgc-sub{text-align:center;color:var(--slate,#6b7280);margin:0 0 28px;font-size:.95rem}' +
    '.cgc-mq{position:relative;overflow:hidden;' +
    '-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);' +
    'mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}' +
    '.cgc-track{display:flex;width:max-content;animation:cgcRoll 34s linear infinite}' +
    '.cgc-mq:hover .cgc-track{animation-play-state:paused}' +
    '.cgc-item{flex:0 0 auto;width:186px;height:94px;margin:0 9px;display:flex;align-items:center;' +
    'justify-content:center;background:#fff;border:1px solid var(--line,#e6e6ea);border-radius:14px;padding:13px}' +
    '.cgc-item img{max-width:100%;max-height:100%;object-fit:contain;filter:grayscale(1);opacity:.62;' +
    'transition:filter .25s ease,opacity .25s ease}' +
    '.cgc-item:hover img{filter:none;opacity:1}' +
    '@keyframes cgcRoll{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}' +
    '@media(max-width:560px){.cgc-item{width:150px;height:80px;margin:0 7px}}' +
    '@media(prefers-reduced-motion:reduce){.cgc-track{animation:none}.cgc-mq{overflow-x:auto}}';

  function probe(entry) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(img.naturalWidth > 0 ? entry : null); };
      img.onerror = function () { resolve(null); };
      img.src = BASE + entry.file;
    });
  }

  function tile(entry) {
    var d = document.createElement('div');
    d.className = 'cgc-item';
    var i = document.createElement('img');
    i.src = BASE + entry.file;
    i.alt = entry.name;
    i.loading = 'lazy';
    d.appendChild(i);
    return d;
  }

  function render(host, found) {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.className = 'wrap';
    var h = document.createElement('h2');
    h.className = 'cgc-h';
    h.textContent = 'Jo businesses humpe bharosa karte hain';
    var p = document.createElement('p');
    p.className = 'cgc-sub';
    p.textContent = 'Safidon aur Delhi se lekar PAN India tak.';
    wrap.appendChild(h);
    wrap.appendChild(p);

    var mq = document.createElement('div');
    mq.className = 'cgc-mq';
    var track = document.createElement('div');
    track.className = 'cgc-track';
    for (var pass = 0; pass < 2; pass++) {
      for (var i = 0; i < found.length; i++) { track.appendChild(tile(found[i])); }
    }
    mq.appendChild(track);

    host.appendChild(wrap);
    host.appendChild(mq);
    host.style.display = '';
  }

  function start() {
    var host = document.getElementById('cgaClients');
    if (!host) { return; }
    host.style.display = 'none';
    Promise.all(LOGOS.map(probe)).then(function (results) {
      var found = results.filter(function (r) { return r; });
      if (found.length >= MIN_LOGOS) { render(host, found); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
