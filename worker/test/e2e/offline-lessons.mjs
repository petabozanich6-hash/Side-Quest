// Offline lessons end to end: a child's assigned lessons are saved on the device while online, done and handed in with
// no signal, and sent (and marked) automatically once back online. Local Worker + local D1 + built frontend + Chromium
// with the real service worker and IndexedDB. "No signal" is the server being stopped. Never touches production.
//   PW_PATH=<playwright index.mjs> node worker/test/e2e/offline-lessons.mjs
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL("../../../", import.meta.url).pathname);
const STATE = "/tmp/e2e-offline-lessons-state";
const CONFIG = "wrangler.offline-e2e.jsonc";
const PORT = 8790;
const BASE = `http://localhost:${PORT}`;
const NODE_BASE = `http://127.0.0.1:${PORT}`;
const SHOTS = resolve(ROOT, "e2e-shots/offline-lessons");
const { chromium } = await import(process.env.PW_PATH || "playwright");

const results = [];
let page;
const ok = (c, m) => { if (!c) throw new Error(m || "assertion failed"); };
const shot = async (name) => { try { await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true }); } catch { /* best effort */ } };
async function step(name, fn) {
  try { await fn(); results.push({ name, ok: true }); console.log(`PASS ${name}`); }
  catch (e) { results.push({ name, ok: false }); console.log(`FAIL ${name}\n     ${String(e.message || e).slice(0, 900)}`); await shot("FAIL-" + name.replace(/\W+/g, "-").slice(0, 40)); }
}

// ---- local stack (start/stop: stopping the server is "no signal")
rmSync(STATE, { recursive: true, force: true });
rmSync(SHOTS, { recursive: true, force: true });
mkdirSync(SHOTS, { recursive: true });
writeFileSync(`${ROOT}/.dev.vars`, "JWT_SECRET=e2e-only-secret-not-for-production\n");
writeFileSync(`${ROOT}/${CONFIG}`, JSON.stringify({
  name: "side-quest-offline-e2e", main: "./worker/src/index.ts", compatibility_date: "2025-10-01",
  assets: { directory: "./frontend/build", not_found_handling: "single-page-application", run_worker_first: ["/api/*"] },
  d1_databases: [{ binding: "DB", database_name: "e2e-offline", database_id: "00000000-0000-0000-0000-000000000003", migrations_dir: "./worker/migrations" }],
}));
const wr = (args) => spawnSync("npx", ["wrangler", ...args, "--config", CONFIG, "--persist-to", STATE], { cwd: ROOT, encoding: "utf8" });
ok(wr(["d1", "migrations", "apply", "DB", "--local"]).status === 0, "local migrations failed");
let server = null;
const up = async () => {
  server = spawn("npx", ["wrangler", "dev", "--config", CONFIG, "--local", "--persist-to", STATE, "--port", String(PORT), "--ip", "127.0.0.1"], { cwd: ROOT, stdio: "ignore" });
  for (let i = 0; i < 90; i++) {
    try { if ((await fetch(`${NODE_BASE}/api/health`)).ok) return; } catch { /* starting */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("server did not start");
};
const down = async () => {
  server.kill("SIGTERM");
  for (let i = 0; i < 40; i++) { try { await fetch(`${NODE_BASE}/api/health`); await new Promise((r) => setTimeout(r, 500)); } catch { return; } }
  throw new Error("server did not stop");
};
process.on("exit", () => { try { server?.kill("SIGTERM"); } catch { /* ignore */ } });
await up();

const api = async (method, path, token, body) => {
  const r = await fetch(NODE_BASE + "/api" + path, { method, headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  let json = null; try { json = await r.json(); } catch { /* empty */ }
  return { status: r.status, json };
};

// ---- a family: one parent, one child, two lessons with a question and a one-question quest check
const stamp = Date.now();
const parent = (await api("POST", "/auth/register", null, { email: `offline-${stamp}@example.com`, password: "Passw0rd-offline!", name: "Parent", jurisdiction: "NSW" })).json;
const pt = parent.token;
const username = `kid${stamp}`.slice(0, 16);
const kid = (await api("POST", "/students", pt, { name: "Kid", username, pin: "4321", stage: "S2" })).json;
const lesson = (title) => ({
  title, learning_area: "Mathematics", stage: "S2", status: "ready",
  sections: [{ heading: "Tens and ones", body: "Numbers are built from tens and ones." }],
  questions: [{ prompt: "What does the 4 in 47 mean?" }],
  quiz: [{ question: "Tens in 47?", options: ["4", "7"], correct_index: 0 }],
});
// The free preview allows two lessons and two active assignments: exactly what this needs.
const mk = async (title) => {
  const l = await api("POST", "/lessons", pt, lesson(title));
  ok(l.status === 200, "lesson: " + JSON.stringify(l.json));
  const a = await api("POST", "/assignments", pt, { student_id: kid.id, lesson_id: l.json.id });
  ok(a.status === 200, "assign: " + JSON.stringify(a.json));
  return a.json.id;
};
const childToken0 = (await api("POST", "/auth/child-login", null, { username, pin: "4321" })).json.token;
ok((await api("POST", "/pet", childToken0, { species: "fox", name: "Rusty" })).status === 200, "pet");
const passId = await mk("Place value on the plane");
const retryId = await mk("Place value in the car");

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
page = await ctx.newPage();

async function jumpTo(title) {
  const idx = await page.$$eval("[data-testid=step-jump] option", (os, t) => os.findIndex((o) => o.textContent.includes(t)), title);
  ok(idx >= 0, "no step " + title);
  await page.selectOption("[data-testid=step-jump]", { index: idx });
}
async function doLesson(aid, quizAnswer) {
  await page.click(`[data-testid=task-${aid}]`);
  await page.waitForSelector("[data-testid=offline-lesson]");
  await jumpTo("Show what you know");
  await page.fill("[data-testid=answer-0]", "Four tens");
  await jumpTo("Quest check");
  await page.locator("[data-testid=quest-quiz] button", { hasText: new RegExp(`^\\s*${quizAnswer}\\s*$`) }).first().click();
  await page.locator("[data-testid=quest-quiz] button", { hasText: /check/i }).last().click();
  await page.waitForSelector("[data-testid=quiz-queued]");
  await jumpTo("Hand it in");
  await page.click("[data-testid=submit-work]");
  await page.waitForSelector("[data-testid=waiting-to-send]");
}

await step("online: the child's open lessons are saved on the device and marked Ready offline", async () => {
  await page.goto(BASE + "/child-login");
  await page.fill("[data-testid=child-login-username]", username);
  await page.fill("[data-testid=child-login-pin]", "4321");
  await page.click("[data-testid=child-login-submit]");
  await page.waitForURL((u) => u.pathname === "/child");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.waitForSelector("[data-testid=child-home]");
  await page.waitForFunction(() => document.querySelectorAll("[data-testid=ready-offline]").length === 2, null, { timeout: 20000 });
  await shot("01-ready-offline");
});

await step("no signal: the app still opens from the home-screen icon and shows the saved quests", async () => {
  await down();
  await page.goto(BASE + "/?source=app");
  await page.waitForSelector("[data-testid=offline-home]");
  ok(await page.locator(`[data-testid=task-${passId}]`).count() === 1 && await page.locator(`[data-testid=task-${retryId}]`).count() === 1, "saved quests missing offline");
  await shot("02-offline-home");
});

await step("no signal: a lesson can be worked through, answers save on the device, and it can be handed in", async () => {
  await doLesson(passId, "4");
  await shot("03-waiting-to-send");
  await page.click("[data-testid=back-home]");
  await page.waitForSelector("[data-testid=offline-home]");
  await doLesson(retryId, "7"); // wrong answer: the quest check will need another go
});

await step("no signal: a handed-in lesson stays ready to send after the app is closed and reopened", async () => {
  await page.goto(BASE + "/child");
  await page.waitForSelector("[data-testid=offline-home]");
  await page.click(`[data-testid=task-${passId}]`);
  await page.waitForSelector("[data-testid=waiting-to-send]");
});

await step("signing out with unsent work warns first", async () => {
  let warned = false;
  page.once("dialog", async (d) => { warned = /hasn't been sent/.test(d.message()); await d.dismiss(); });
  await page.click("[data-testid=child-logout]");
  await page.waitForTimeout(500);
  ok(warned, "no warning before losing unsent work");
  ok(page.url().includes("/child"), "signed out anyway after cancelling");
});

await step("back online: the work is sent and marked automatically; a failed quest check goes back to the child", async () => {
  await up();
  await page.goto(BASE + "/child");
  await page.waitForSelector("[data-testid=offline-news]", { timeout: 20000 });
  const news = await page.textContent("[data-testid=offline-news]");
  ok(/Place value on the plane" has been handed in/.test(news), "hand-in not reported: " + news);
  ok(/needs another go/.test(news), "quiz retry not reported: " + news);
  // The list refreshes once the work has arrived: the handed-in lesson is no longer in the to-do list.
  await page.waitForFunction((id) => !document.querySelector(`[data-testid=task-${id}]`), passId, { timeout: 15000 });
  ok(/1/.test(await page.textContent("[data-testid=stat-waiting]")), "waiting-for-review count not updated");
  await shot("04-back-online");
  const a1 = await api("GET", `/assignments/${passId}`, pt);
  ok(a1.json.status === "submitted", "passed lesson status " + a1.json.status);
  ok(/Four tens/.test(a1.json.submissions?.[0]?.response_text || ""), "answers not in the hand-in");
  const a2 = await api("GET", `/assignments/${retryId}`, pt);
  ok(a2.json.status !== "submitted" && (a2.json.submissions || []).length === 0, "failed quiz was handed in anyway: " + a2.json.status);
  ok(JSON.stringify((await api("GET", `/assignments/${retryId}`, (await api("POST", "/auth/child-login", null, { username, pin: "4321" })).json.token)).json.draft || {}).includes("Four tens"), "offline answers not saved to the server");
});

await step("signing out deletes everything saved on the device", async () => {
  await page.click("[data-testid=child-logout]");
  await page.waitForURL((u) => !u.pathname.startsWith("/child"));
  const dbs = await page.evaluate(async () => (await indexedDB.databases()).map((d) => d.name));
  ok(!dbs.includes("sq-offline"), "offline data still on the device: " + dbs.join(","));
  ok(await page.evaluate(() => localStorage.getItem("sq_user_cache")) === null, "cached user left behind");
});

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} offline-lesson steps passed`);
process.exit(failed.length ? 1 : 0);
