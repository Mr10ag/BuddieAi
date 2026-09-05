// Buddie AI - service worker
// Only job: (1) satisfy Chrome's "installable PWA" requirement so the
// Add-to-Home-Screen icon opens as a standalone app instead of a browser
// tab, and (2) cache the tiny app shell so it still opens if you're
// offline. It deliberately does NOT touch anything cross-origin (the
// WebLLM library / model weights from the CDN) - those are already
// cached by the app itself via IndexedDB/Cache Storage, and we don't
// want to interfere with that.

const CACHE_NAME = "buddie-ai-shell-v1";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin GET requests for the app shell.
  // Everything else (the WebLLM CDN, model downloads, web search, etc.)
  // passes straight through to the network untouched.
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
