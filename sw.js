/* CGA India — service worker
   Strategy is deliberately conservative: pages are ALWAYS fetched from the
   network first, so a redeploy is visible immediately and no visitor ever
   sees a stale price. The cache exists only so the site still opens offline. */
var V = 'cga-v1';
var SHELL = V + '-shell';
var RUNTIME = V + '-rt';
var PRECACHE = [
  '/offline.html',
  '/manifest.webmanifest',
  '/assets/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(SHELL).then(function (c) {
      return Promise.all(PRECACHE.map(function (u) {
        return c.add(u).catch(function () { /* one bad url must not kill install */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.map(function (k) {
        if (k !== SHELL && k !== RUNTIME) { return caches.delete(k); }
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('message', function (e) {
  if (e.data === 'SKIP_WAITING') { self.skipWaiting(); }
});

function isFontHost(h) {
  return h === 'fonts.gstatic.com' || h === 'fonts.googleapis.com';
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') { return; }

  var u;
  try { u = new URL(req.url); } catch (err) { return; }

  var same = (u.origin === self.location.origin);
  if (!same && !isFontHost(u.hostname)) { return; }

  /* Pages: network first, cached copy if offline, offline page as last resort. */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(RUNTIME).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        return caches.match(req).then(function (r) {
          return r || caches.match('/offline.html');
        });
      })
    );
    return;
  }

  /* Anything with a query string (cache-busted JSON, tracking pixels) is left
     to the browser untouched, so the runtime cache never fills with one-off URLs. */
  if (u.search) { return; }

  /* Static assets and fonts: serve cached, refresh in background. */
  event.respondWith(
    caches.match(req).then(function (cached) {
      var net = fetch(req).then(function (res) {
        if (res && (res.status === 200 || res.type === 'opaque')) {
          var copy = res.clone();
          caches.open(RUNTIME).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return cached; });
      return cached || net;
    })
  );
});
