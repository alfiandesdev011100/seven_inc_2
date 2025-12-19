// 🚫 Service Worker DISABLED in development mode
// Production version: writer-sw.js.prod

console.log("⚠️ [SW] Service Worker disabled - development mode");

// Skip all service worker functionality
self.addEventListener("install", (event) => {
  event.waitUntil(Promise.resolve());
});

self.addEventListener("activate", (event) => {
  // Clear all caches on activation
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Do nothing - let browser handle all requests
});

