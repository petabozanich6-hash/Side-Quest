/* Side-Quest service worker: makes the site installable as an app and fast to reopen.
 *
 * Rules (deliberately conservative, because this is a family/children's app with private data):
 * - /api/* is NEVER cached or touched: every request goes straight to the network, so sign-in,
 *   children's work and billing are always live and nothing private is stored on the device.
 * - Pages (navigations) are network-first, so a new deploy shows up on the next open. With no signal, the children's
 *   area (/child..., and / which forwards a signed-in child there) opens from the saved app shell so saved lessons can
 *   be done offline (see src/lib/offline.js); any other page shows the offline page.
 * - The app shell is the public index.html plus the built JS/CSS (from asset-manifest.json). No family data.
 * - Built files under /static/ have content hashes in their names, so they are cached forever (cache-first).
 * - Icons, pet art and other images are stale-while-revalidate.
 * Bump VERSION to clear old caches.
 */
// v4: the kids' app (manifest-kids.webmanifest) starts at /child-login, which now opens offline too.
// v3: offline lessons: the app shell and its code are saved so the children's area opens with no signal.
// v2: the offline page is cached at /offline. Cloudflare redirects /offline.html -> /offline, and browsers refuse to
// show a cached redirect for a page visit, so the old /offline.html copy never appeared.
const VERSION = "sq-v4";
const SHELL = `${VERSION}-shell`;
const ASSETS = `${VERSION}-assets`;
const OFFLINE_PAGE = "/offline";
const APP_SHELL = "/__app-shell";
const PRECACHE = [OFFLINE_PAGE, "/icons/icon-192.png", "/manifest.webmanifest", "/manifest-kids.webmanifest"];
// Pages that open from the saved shell when offline.
const OFFLINE_APP = (path) => path === "/" || path === "/child" || path.startsWith("/child/") || path === "/child-login" || path === "/get-app";

/** Saves the current index.html and the JS/CSS it loads, so the app can start with no signal. */
async function saveAppShell() {
  const shell = await caches.open(SHELL);
  const page = await fetch("/", { cache: "no-store" });
  if (!page.ok) return;
  await shell.put(APP_SHELL, page.clone());
  const manifest = await fetch("/asset-manifest.json", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  const files = (manifest?.entrypoints || []).map((f) => "/" + String(f).replace(/^\//, ""));
  if (files.length) await (await caches.open(ASSETS)).addAll(files);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL).then((c) => c.addAll(PRECACHE))
      .then(() => saveAppShell().catch(() => {}))
      .then(() => self.skipWaiting())
  );
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
  // Sign-out or switching accounts: drop every cache except the public app shell and built files/images (nothing
  // private is cached in the first place; this keeps it that way even if a future change slips). Children's saved
  // lessons live in IndexedDB and are deleted by the app itself (src/lib/offline.js clearOffline).
  if (event.data === "CLEAR_CACHES") {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== ASSETS).map((k) => caches.delete(k)))));
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // fonts, YouTube etc: browser default
  if (url.pathname.startsWith("/api/")) return;              // private and live: never cached

  if (req.mode === "navigate") {
    event.respondWith(fetch(req).then((res) => {
      // Every page of this single-page app is the same public index.html: keep the newest copy as the app shell.
      if (res.ok && !res.redirected && (res.headers.get("content-type") || "").includes("text/html") && !url.pathname.startsWith("/offline")) {
        const copy = res.clone();
        caches.open(SHELL).then((c) => c.put(APP_SHELL, copy));
      }
      return res;
    }).catch(async () => {
      if (OFFLINE_APP(url.pathname)) { const shell = await caches.match(APP_SHELL); if (shell) return shell; }
      return (await caches.match(OFFLINE_PAGE)) || Response.error();
    }));
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
