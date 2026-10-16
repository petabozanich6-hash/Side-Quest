// Installable app (PWA) end to end: the Get the app page on iPhone, Android and desktop (QR code), and the offline
// page really appearing when the network drops. Local Worker + local D1 + the built frontend; never production.
//   PW_PATH=<playwright index.mjs> node worker/test/e2e/install-app.mjs
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL("../../../", import.meta.url).pathname);
const STATE = "/tmp/e2e-install-app-state";
const CONFIG = "wrangler.app-e2e.jsonc";
const PORT = 8789;
const BASE = `http://localhost:${PORT}`;
const NODE_BASE = `http://127.0.0.1:${PORT}`;
// The kids' app's own address (kids.sidequestlearning.app in production). Chrome sends *.localhost to this machine.
const KIDS = `http://kids.localhost:${PORT}`;
const SHOTS = resolve(ROOT, "e2e-shots/install-app");
const { chromium } = await import(process.env.PW_PATH || "playwright");

const UA = {
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  iphoneChrome: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0.6723.90 Mobile/15E148 Safari/604.1",
  android: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
};

const results = [];
const ok = (c, m) => { if (!c) throw new Error(m || "assertion failed"); };
async function step(name, fn) {
  try { await fn(); results.push({ name, ok: true }); console.log(`PASS ${name}`); }
  catch (e) { results.push({ name, ok: false }); console.log(`FAIL ${name}\n     ${String(e.message || e).slice(0, 800)}`); }
}

rmSync(STATE, { recursive: true, force: true });
rmSync(SHOTS, { recursive: true, force: true });
mkdirSync(SHOTS, { recursive: true });
writeFileSync(`${ROOT}/.dev.vars`, "JWT_SECRET=e2e-only-secret-not-for-production\n");
writeFileSync(`${ROOT}/${CONFIG}`, JSON.stringify({
  name: "side-quest-app-e2e", main: "./worker/src/index.ts", compatibility_date: "2025-10-01",
  assets: { directory: "./frontend/build", not_found_handling: "single-page-application", run_worker_first: ["/api/*"] },
  d1_databases: [{ binding: "DB", database_name: "e2e-app", database_id: "00000000-0000-0000-0000-000000000002", migrations_dir: "./worker/migrations" }],
}));
const wr = (args) => spawnSync("npx", ["wrangler", ...args, "--config", CONFIG, "--persist-to", STATE], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const mig = wr(["d1", "migrations", "apply", "DB", "--local"]);
if(mig.status !== 0) console.error("D1 migration error output:", (mig.stderr || "").slice(0,12000), (mig.stdout || "").slice(0,12000));
ok(mig.status === 0, "local migrations failed");
// npm/npx starts a child process which in turn launches workerd. Killing only the
// npx PID leaves the Worker serving requests, so an "offline" test stays online.
// A detached Unix process group gives this local test server its own process tree.
const server = spawn("npx", ["wrangler", "dev", "--config", CONFIG, "--local", "--persist-to", STATE, "--port", String(PORT), "--ip", "127.0.0.1"], { cwd: ROOT, stdio: "ignore", detached: process.platform !== "win32" });
const stopServer = (signal = "SIGTERM") => {
  if (!server.pid) return;
  try {
    if (process.platform === "win32") server.kill(signal);
    else process.kill(-server.pid, signal);
  } catch (err) { if (err?.code !== "ESRCH") throw err; }
};
process.on("exit", () => { try { stopServer(); } catch { /* best effort */ } });
for (let i = 0; i < 90; i++) {
  try { if ((await fetch(`${NODE_BASE}/api/health`)).ok) break; } catch { /* starting */ }
  await new Promise((r) => setTimeout(r, 1000));
  if (i === 89) throw new Error("server did not start");
}

const browser = await chromium.launch();
const noOverflow = async (p, label) => {
  const over = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(over <= 1, `${label}: ${over}px sideways overflow`);
};

await step("the offline page is served at /offline without a redirect, and the service worker caches that address", async () => {
  const r = await fetch(`${NODE_BASE}/offline`, { redirect: "manual" });
  ok(r.status === 200, "/offline " + r.status);
  ok(/You're offline/.test(await r.text()), "offline page text");
  const sw = await (await fetch(`${NODE_BASE}/sw.js`)).text();
  ok(/OFFLINE_PAGE = "\/offline"/.test(sw) && !/caches\.match\("\/offline\.html"\)/.test(sw), "service worker still uses /offline.html");
});

await step("desktop: Get the app shows a QR code and the link to open on a phone", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  await p.click("[data-testid=get-app-link]");
  await p.waitForSelector("[data-testid=get-app-qr-image]");
  ok((await p.getAttribute("[data-testid=get-app-qr-image]", "src")).startsWith("data:image/png"), "QR image");
  ok((await p.textContent("[data-testid=get-app-url]")) === `${BASE}/get-app`, "link text");
  await noOverflow(p, "desktop");
  await p.screenshot({ path: `${SHOTS}/desktop.png`, fullPage: true });
  await ctx.close();
});

for (const [name, ua, testid, extra] of [
  ["iPhone Safari", UA.iphone, "get-app-ios", null],
  ["iPhone Chrome", UA.iphoneChrome, "get-app-ios", "ios-other-browser"],
  ["Android", UA.android, "get-app-android", null],
]) {
  await step(`${name}: Get the app shows that phone's install steps, no QR code, fits the screen`, async () => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, userAgent: ua, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    await p.goto(BASE + "/get-app?source=qr");
    await p.waitForSelector(`[data-testid=${testid}]`);
    ok(await p.locator("[data-testid=get-app-qr]").count() === 0, "QR shown on a phone");
    if (extra) await p.waitForSelector(`[data-testid=${extra}]`);
    await noOverflow(p, name);
    await p.screenshot({ path: `${SHOTS}/${name.replace(/\W+/g, "-")}.png`, fullPage: true });
    await ctx.close();
  });
}

await step("iPhone: the home page's Install button opens the Add to Home Screen steps", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA.iphone, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  await p.click("[data-testid=install-app]");
  await p.waitForSelector("[data-testid=install-ios-help]");
  await noOverflow(p, "iPhone home");
  await ctx.close();
});

// ---- the kids' app: a child's own device opens straight to the child sign-in
const napi = async (method, path, token, body) => {
  const r = await fetch(NODE_BASE + "/api" + path, { method, headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  let json = null; try { json = await r.json(); } catch { /* empty */ }
  return { status: r.status, json };
};
const stamp = Date.now();
const familyEmail = `kids-${stamp}@example.com`;
const familyPassword = "Passw0rd-kids!";
const fam = (await napi("POST", "/auth/register", null, { email: familyEmail, password: familyPassword, name: "Parent", jurisdiction: "NSW" })).json;
const loginParent = async (p) => {
  // A real login avoids racing the app's anonymous /auth/me startup request.
  await p.goto(BASE + "/login");
  await p.fill("[data-testid=login-email]", familyEmail);
  await p.fill("[data-testid=login-password]", familyPassword);
  await p.click("[data-testid=login-submit]");
  await p.waitForSelector("[data-testid=parent-sidebar]", { state: "attached" });
};
const kidUser = `kidapp${stamp}`.slice(0, 16);
await napi("POST", "/students", fam.token, { name: "Kid", username: kidUser, pin: "4321", stage: "S2" });
await napi("POST", "/pet", (await napi("POST", "/auth/child-login", null, { username: kidUser, pin: "4321" })).json.token, { species: "fox", name: "Rusty" });
const manifestHref = (p) => p.getAttribute('link[rel="manifest"]', "href");

await step("kids' app manifest: its own app that starts at the child sign-in", async () => {
  const r = await fetch(`${NODE_BASE}/manifest-kids.webmanifest`);
  ok(r.status === 200 && /manifest\+json/.test(r.headers.get("content-type") || ""), "kids manifest " + r.status);
  const m = await r.json();
  ok(m.id === "/kids" && m.start_url === "/child-login?source=kids-app" && m.display === "standalone" && m.icons.length >= 4, "kids manifest fields " + JSON.stringify(m).slice(0, 200));
  // Its own icon (the fox), not the parent app's compass, and every size loads.
  ok(m.icons.every((i) => /\/icons\/kids-/.test(i.src)) && m.icons.some((i) => i.purpose === "maskable") && m.icons.some((i) => i.sizes === "512x512"), "kids icons " + JSON.stringify(m.icons));
  for (const src of [...m.icons.map((i) => i.src), "/icons/kids-apple-touch-icon.png", "/icons/kids-favicon-32.png"]) {
    const r2 = await fetch(NODE_BASE + src);
    ok(r2.status === 200 && /image\/png/.test(r2.headers.get("content-type") || ""), `${src} ${r2.status}`);
  }
  const parent = await (await fetch(`${NODE_BASE}/manifest.webmanifest`)).json();
  ok(parent.icons.every((i) => !/kids-/.test(i.src)), "the parent app must keep its own icon");
});

await step("Get the app for a child's device: kids' manifest, kids' wording and a QR link that keeps for=child", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/get-app");
  ok(await manifestHref(p) === "/manifest.webmanifest", "parent page should use the parent manifest");
  // The parent page is the parent app's page: not SQ Kids wording, and its link is the parent site.
  await p.waitForSelector("[data-testid=get-app-title]:has-text(\"Get the Side-Quest app\")");
  ok((await p.textContent("[data-testid=get-app-url]")) === `${BASE}/get-app`, "parent link " + await p.textContent("[data-testid=get-app-url]"));
  await p.click("[data-testid=get-app-switch]");
  // The kids' address answers, so the kids' setup points there: SQ Kids is its own app.
  await p.waitForSelector("[data-testid=get-app-title]:has-text(\"Set up SQ Kids\")");
  ok((await p.textContent("[data-testid=get-app-url]")) === `${KIDS}/get-app`, "kids link " + await p.textContent("[data-testid=get-app-url]"));
  await p.waitForSelector("[data-testid=get-app-qr-image]");
  await p.screenshot({ path: `${SHOTS}/kids-desktop.png`, fullPage: true });
  // On the parent site the child sign-in no longer installs a kids' app (SQ Kids has its own address).
  await p.goto(BASE + "/child-login");
  ok(await manifestHref(p) === "/manifest.webmanifest", "child sign-in on the parent site must not install a kids' app");
  await ctx.close();
});

await step("parent app: an old kids' marker on the phone is cleared and the app opens to the parent sign-in", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA.iphone, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  // What earlier testing left behind: the same-address kids' app marker.
  await p.evaluate(() => localStorage.setItem("sq_kids_device", "1"));
  await p.goto(BASE + "/?source=app"); // tapping the Side-Quest (parent) icon
  await p.waitForURL((u) => u.pathname === "/login");
  ok(await p.evaluate(() => localStorage.getItem("sq_kids_device")) === null, "old marker kept");
  await p.goto(BASE + "/?source=kids-app"); // even an old kids' start link can't turn the parent site into the kids' app
  ok(new URL(p.url()).pathname === "/", "parent site redirected to a child sign-in");
  await ctx.close();
});
await step("inside the installed parent app, the kids' link sends families to SQ Kids (no dead end, no mixing)", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA.android, isMobile: true, hasTouch: true });
  // Pretend this page runs inside the installed Side-Quest app (what Android does when the QR code is scanned).
  await ctx.addInitScript(() => {
    const real = window.matchMedia.bind(window);
    window.matchMedia = (q) => (q.includes("display-mode: standalone") ? { matches: true, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} } : real(q));
  });
  const p = await ctx.newPage();
  await p.goto(BASE + "/get-app?for=child&source=qr");
  await p.waitForSelector("[data-testid=open-kids-setup]");
  ok(await p.getAttribute("[data-testid=open-kids-setup]", "href") === `${KIDS}/get-app`, "Open SQ Kids setup goes to the kids' address");
  ok(await p.locator("[data-testid=get-app-installed]").count() === 0, "dead-end 'already installed' message shown");
  ok(await p.locator("[data-testid=use-for-child]").count() === 0, "the parent app can still be turned into a child app");
  await p.screenshot({ path: `${SHOTS}/shared-device.png`, fullPage: true });
  await ctx.close();
});
await step("SQ Kids address: opens to the child sign-in, installs the kids' app and has no parent pages", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA.iphone, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(KIDS + "/");
  await p.waitForURL((u) => u.pathname === "/child-login");
  ok(await manifestHref(p) === "/manifest-kids.webmanifest", "SQ Kids manifest " + await manifestHref(p));
  ok(/SQ Kids/.test(await p.title()), "title " + await p.title());
  ok(await p.getAttribute('link[rel="apple-touch-icon"]', "href") === "/icons/kids-apple-touch-icon.png", "iPhone home-screen icon should be the fox");
  ok(await p.getAttribute("text=Open Side-Quest for grown-ups", "href") === `http://localhost:${PORT}/login`, "grown-ups link goes to the main site");
  for (const path of ["/login", "/register", "/parent", "/parent/children"]) {
    await p.goto(KIDS + path);
    await p.waitForSelector("[data-testid=kids-only]");
  }
  await p.goto(KIDS + "/get-app");
  await p.waitForSelector("[data-testid=get-app-title]:has-text(\"Set up SQ Kids\")");
  await p.waitForSelector("[data-testid=get-app-ios]");
  ok(/SQ Kids opens from its own icon/.test(await p.textContent("[data-testid=get-app-ios]")), "steps name the wrong app");
  ok(await p.getAttribute("[data-testid=get-app-switch]", "href") === `http://localhost:${PORT}/get-app`, "grown-ups link should go to the main site");
  await noOverflow(p, "SQ Kids get-app");
  await p.screenshot({ path: `${SHOTS}/sq-kids-get-app-phone.png`, fullPage: true });
  await ctx.close();
});

await step("one phone, two apps: the parent stays signed in to Side-Quest while the child signs in to SQ Kids", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA.android, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await loginParent(p);
  const parentSessionToken = await p.evaluate(() => localStorage.getItem("sq_token"));
  ok(!!parentSessionToken, "parent login returned no session token");
  const k = await ctx.newPage();
  await k.goto(KIDS + "/child-login");
  await k.fill("[data-testid=child-login-username]", kidUser);
  await k.fill("[data-testid=child-login-pin]", "4321");
  await k.click("[data-testid=child-login-submit]");
  await k.waitForURL((u) => u.pathname === "/child");
  await p.reload();
  await p.waitForSelector("[data-testid=parent-sidebar]", { state: "attached" });
  ok(await p.evaluate(() => localStorage.getItem("sq_token")) === parentSessionToken, "the parent's sign-in was replaced");
  await k.click("[data-testid=child-logout]");
  await k.waitForURL((u) => u.pathname === "/child-login");
  await p.reload();
  await p.waitForSelector("[data-testid=parent-sidebar]", { state: "attached" });
  await ctx.close();
});

await step("an ordinary browser is unaffected: the home page still shows the front page", async () => {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  await p.waitForSelector("[data-testid=nav-register]");
  ok(new URL(p.url()).pathname === "/", "redirected away from the front page");
  await ctx.close();
});

await step("the Parent Hub Children page links to setting up a child's device", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await loginParent(p);
  await p.goto(BASE + "/parent/children");
  await p.click("[data-testid=kids-app-link]");
  await p.waitForURL((u) => u.pathname === "/get-app" && u.search.includes("for=child"));
  await ctx.close();
});

await step("when the network drops, a page visit shows Side-Quest's offline page (not the browser error)", async () => {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload(); // the page is now controlled by the service worker
  await p.waitForFunction(() => !!navigator.serviceWorker.controller);
  // Chromium's offline emulation doesn't cover the service worker's own fetches, so cut the network for real:
  // stop the server, exactly what a phone with no signal sees.
  stopServer();
  let stopped = false;
  for (let i = 0; i < 30; i++) {
    try { await fetch(`${NODE_BASE}/api/health`, { signal: AbortSignal.timeout(2000) }); }
    catch { stopped = true; break; }
    await new Promise((r) => setTimeout(r, 500));
  }
  ok(stopped, "the local Worker was still running after the simulated network drop");
  await p.goto(BASE + "/parent").catch(() => {});
  ok(/You're offline/.test(await p.textContent("body")), "offline page not shown: " + (await p.textContent("body")).slice(0, 120));
  await p.screenshot({ path: `${SHOTS}/offline.png` });
  await ctx.close();
});

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} install-app steps passed`);
process.exit(failed.length ? 1 : 0);
