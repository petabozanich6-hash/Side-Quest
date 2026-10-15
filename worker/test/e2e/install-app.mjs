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
const wr = (args) => spawnSync("npx", ["wrangler", ...args, "--config", CONFIG, "--persist-to", STATE], { cwd: ROOT, encoding: "utf8" });
ok(wr(["d1", "migrations", "apply", "DB", "--local"]).status === 0, "local migrations failed");
const server = spawn("npx", ["wrangler", "dev", "--config", CONFIG, "--local", "--persist-to", STATE, "--port", String(PORT), "--ip", "127.0.0.1"], { cwd: ROOT, stdio: "ignore" });
process.on("exit", () => { try { server.kill("SIGTERM"); } catch { /* ignore */ } });
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

await step("when the network drops, a page visit shows Side-Quest's offline page (not the browser error)", async () => {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload(); // the page is now controlled by the service worker
  await p.waitForFunction(() => !!navigator.serviceWorker.controller);
  // Chromium's offline emulation doesn't cover the service worker's own fetches, so cut the network for real:
  // stop the server, exactly what a phone with no signal sees.
  server.kill("SIGTERM");
  for (let i = 0; i < 30; i++) { try { await fetch(`${NODE_BASE}/api/health`); await new Promise((r) => setTimeout(r, 500)); } catch { break; } }
  await p.goto(BASE + "/get-app").catch(() => {});
  ok(/You're offline/.test(await p.textContent("body")), "offline page not shown: " + (await p.textContent("body")).slice(0, 120));
  await p.screenshot({ path: `${SHOTS}/offline.png` });
  await ctx.close();
});

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} install-app steps passed`);
process.exit(failed.length ? 1 : 0);
