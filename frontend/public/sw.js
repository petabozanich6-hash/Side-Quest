/* Side-Quest service worker: makes the site installable as an app and fast to reopen.
 *
 * Rules (deliberately conservative, because this is a family/children's app with private data):
 * - /api/* is NEVER cached or touched: every request goes straight to the network, so sign-in,
 *   children's work and billing are always live and nothing private is stored on the device.
 * - Pages (navigations) are network-first, so a new deploy shows up on the next open;
 *   if the device is offline, the offline page is shown.
 * - Built files under /static/ have content hashes in their names, so they are cached forever (cache-first).
 * - Icons, pet art and other images are stale-while-revalidate.
 * Bump VERSION to clear old caches.
 */
const VERSION = "sq-v1";
const SHELL = `${VERSION}-shell`;
const ASSETS = `${VERSION}-assets`;
const PRECACHE = ["/offline.html", "/icons/icon-192.png", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
  // Sign-out or switching accounts: drop everything cached except the offline page and icon. (Nothing private is
  // cached in the first place; this keeps it that way even if a future change slips.)
  if (event.data === "CLEAR_CACHES") {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== SHELL).map((k) => caches.delete(k)))));
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // fonts, YouTube etc: browser default
  if (url.pathname.startsWith("/api/")) return;              // private and live: never cached

  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(async () => (await caches.match("/offline.html")) || Response.error()));
    return;
  }

  if (url.pathname.startsWith("/static/")) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(ASSETS).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
    return;
  }

  if (/\.(png|webp|jpg|jpeg|svg|ico|gif|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(ASSETS).then(async (c) => {
        const hit = await c.match(req);
        const fresh = fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || fresh;
      })
    );
  }
});
