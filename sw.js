"use strict";

// Offline support: files come from the network when online (so updates
// always show up whole), and from the cache when offline. Every same-origin
// file that loads gets cached, so the site works offline after one visit.
const CACHE = "rankedbingo-v1";
const CORE = [
  "./", "index.html", "css/style.css", "js/data.js", "js/logic.js", "js/extras.js", "js/jobs.js", "js/info.js", "js/app.js",
  "manifest.webmanifest", "icons/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  event.respondWith(caches.open(CACHE).then(async (cache) => {
    try {
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch {
      const cached = await cache.match(req, { ignoreSearch: true });
      if (cached) return cached;
      throw new Error("offline and not cached");
    }
  }));
});
