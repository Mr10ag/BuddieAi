// Buddie AI - service worker
// Only job: (1) satisfy Chrome's "installable PWA" requirement so the
// Add-to-Home-Screen icon opens as a standalone app instead of a browser
// tab, and (2) cache the tiny app shell so it still opens if you're
// offline. It deliberately does NOT touch anything cross-origin (the
// WebLLM library / model weights from the CDN) - those are already
// cached by the app itself via IndexedDB/Cache Storage, and we don't
// want to interfere with that.

// BUG FIX: this was "buddie-ai-shell-v3" with a cache-first fetch strategy
// (`return cached || network`) — every load served the OLD cached index.html
// immediately and only updated the cache in the BACKGROUND for next time, so
// replacing index.html on disk needed two full reloads to actually take
// effect, and since this file's own bytes never changed, the browser never
// even re-checked for a newer service worker in the meantime. Bumping the
// cache name here forces this fix itself to install as a real update, and
// the fetch handler below is now network-first: whenever you're online you
// always get the real current file from disk, with the cache only used as
// an offline fallback.
const CACHE_NAME = "buddie-ai-shell-v4";
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

  // Network-first, cache as offline fallback. This is the opposite priority
  // from before on purpose: for a local app shell you edit and replace by
  // hand, "always show the current file when I have a connection" is the
  // correct default — the cache should only ever be seen when genuinely
  // offline, not silently substituted for a fresher file that's sitting
  // right there on disk/network.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
