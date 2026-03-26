const CACHE_NAME = 'farmquest-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 1. Return cached response if it exists
      if (response) return response;
      
      // 2. Fetch from network
      return fetch(event.request).catch(() => {
        // Fallback or offline page logic could go here
      });
    })
  );
});
