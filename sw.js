const CACHE_NAME = 'hw-veggie-v1';
const urlsToCache = [
  'home.html',
  'menu.html',
  'order.html',
  'gallery.html',
  'reviews.html',
  'book.html',
  'loyalty.html',
  'track.html',
  'qr.html',
  'admin.html',
  'logo.png',
  'manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).catch(() => {
        // Offline fallback for HTML pages
        if (event.request.destination === 'document') {
          return caches.match('home.html');
        }
      });
    })
  );
});
