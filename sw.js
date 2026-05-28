// Cotidiano service worker — offline-first
const CACHE = 'cotidiano-v12';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './data.js',
  './en-phonetic-dict.js',
  './register-variants.js',
  './styles.css',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Stale-while-revalidate: serve cache immediately, refresh in background.
// First visit (or after cache eviction): fetch from network, store, return.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Only handle same-origin GETs
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request);
      const networkFetch = fetch(e.request).then((res) => {
        if (res && res.status === 200) cache.put(e.request, res.clone());
        return res;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
