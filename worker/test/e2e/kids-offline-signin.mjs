// SQ Kids offline sign-in end to end, on the kids' address (kids.localhost): a child who signed in once with internet
// can sign out and sign back in with no signal (PIN checked on the device), do a saved quest, and have it sent when back
// online; wrong PINs and unknown children are refused; "Forget" wipes the device. "No signal" = the server stopped.
//   PW_PATH=<playwright index.mjs> node worker/test/e2e/kids-offline-signin.mjs
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL("../../../", import.meta.url).pathname);
const STATE = "/tmp/e2e-kids-signin-state";
const CONFIG = "wrangler.kids-signin-e2e.jsonc";
const PORT = 8791;
const BASE = `http://kids.localhost:${PORT}`; // SQ Kids
const NODE_BASE = `http://127.0.0.1:${PORT}`;
const SHOTS = resolve(ROOT, "e2e-shots/kids-offline-signin");
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
  name: "side-quest-kids-signin-e2e", main: "./worker/src/index.ts", compatibility_date: "2025-10-01",
  assets: { directory: "./frontend/build", not_found_handling: "single-page-application", run_worker_first: ["/api/*"] },
  d1_databases: [{ binding: "DB", database_name: "e2e-kids-signin", database_id: "00000000-0000-0000-0000-000000000004", migrations_dir: "./worker/migrations" }],
}));
const wr = (args) => spawnSync("npx", ["wrangler", ...args, "--config", CONFIG, "--persist-to", STATE], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 });
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
// Offline lessons are a Family Membership feature: make this family a paying member (local test database only).
const paid = wr(["d1", "execute", "DB", "--local", "--command", `UPDATE families SET plan = 'ACTIVE_MONTHLY', plan_period_end = '${new Date(Date.now() + 20 * 86400000).toISOString()}' WHERE id = '${parent.user.family_id}'`]);
ok(paid.status === 0, "could not set the plan: " + (paid.stderr || "").slice(-300));
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
const signIn = async (pin = "4321") => {
  await page.fill("[data-testid=child-login-username]", username);
  await page.fill("[data-testid=child-login-pin]", pin);
  await page.click("[data-testid=child-login-submit]");
};

async function jumpTo(title) {
  const idx = await page.$$eval("[data-testid=step-jump] option", (os, t) => os.findIndex((o) => o.textContent.includes(t)), title);
  ok(idx >= 0, "no step " + title);
  await page.selectOption("[data-testid=step-jump]", { index: idx });
}

await step("online on SQ Kids: the child signs in once, quests are saved, and signing out needs no warning", async () => {
  await page.goto(BASE + "/");
  await page.waitForURL((u) => u.pathname === "/child-login");
  await signIn();
  await page.waitForURL((u) => u.pathname === "/child");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.waitForFunction(() => document.querySelectorAll("[data-testid=ready-offline]").length === 2, null, { timeout: 20000 });
  const saved = await page.evaluate(() => localStorage.getItem("sq_offline_signin") || "");
  ok(saved.includes(`"username"`) && !saved.includes("4321") && !saved.includes("eyJ"), "saved sign-in must be encrypted (no PIN or token in clear)");
  let dialog = false;
  const onDialog = (d) => { dialog = true; d.dismiss(); };
  page.on("dialog", onDialog);
  await page.click("[data-testid=child-logout]");
  await page.waitForURL((u) => u.pathname === "/child-login");
  page.off("dialog", onDialog);
  ok(!dialog, "a warning appeared on the kids' app");
  ok(await page.evaluate(() => localStorage.getItem("sq_token")) === null, "token left in the clear after sign-out");
  await page.waitForSelector("[data-testid=forget-device]");
});

await step("a free-preview family gets no offline lessons or offline sign-in", async () => {
  const free = (await api("POST", "/auth/register", null, { email: `free-${stamp}@example.com`, password: "Passw0rd-offline!", name: "Free", jurisdiction: "NSW" })).json;
  const freeUser = `free${stamp}`.slice(0, 16);
  const fk = (await api("POST", "/students", free.token, { name: "Free kid", username: freeUser, pin: "1357", stage: "S2" })).json;
  await api("POST", "/pet", (await api("POST", "/auth/child-login", null, { username: freeUser, pin: "1357" })).json.token, { species: "fox", name: "Rusty" });
  const fl = await api("POST", "/lessons", free.token, lesson("Free lesson"));
  await api("POST", "/assignments", free.token, { student_id: fk.id, lesson_id: fl.json.id });
  const fctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const fp = await fctx.newPage();
  await fp.goto(BASE + "/child-login");
  await fp.fill("[data-testid=child-login-username]", freeUser);
  await fp.fill("[data-testid=child-login-pin]", "1357");
  await fp.click("[data-testid=child-login-submit]");
  await fp.waitForURL((u) => u.pathname === "/child");
  await fp.waitForSelector("[data-testid^=task-]");
  await fp.waitForTimeout(2500);
  ok(await fp.locator("[data-testid=ready-offline]").count() === 0, "free family got Ready offline");
  ok(!((await fp.evaluate(() => localStorage.getItem("sq_offline_signin"))) || "").includes(freeUser), "free child saved for offline sign-in");
  await fctx.close();
});

await step("no signal: the SQ Kids app opens at the sign-in", async () => {
  await down();
  await page.goto(BASE + "/?source=kids-app");
  await page.waitForURL((u) => u.pathname === "/child-login");
  await page.waitForSelector("[data-testid=child-login-form]");
  await shot("01-offline-signin");
});

await step("no signal: a wrong PIN is refused on the device", async () => {
  await signIn("9999");
  await page.waitForSelector("text=That PIN doesn't match");
  ok(new URL(page.url()).pathname === "/child-login", "signed in with a wrong PIN");
});

await step("no signal: an unknown child is told to sign in once with internet", async () => {
  await page.fill("[data-testid=child-login-username]", "nobody-here");
  await page.fill("[data-testid=child-login-pin]", "4321");
  await page.click("[data-testid=child-login-submit]");
  await page.waitForSelector("text=Sign in once on this device while you have internet");
});

await step("no signal: the right PIN signs in and the saved quests are there", async () => {
  await page.reload();
  await page.waitForSelector("[data-testid=child-login-form]");
  await signIn();
  await page.waitForURL((u) => u.pathname === "/child");
  await page.waitForSelector("[data-testid=offline-home]");
  ok(await page.locator(`[data-testid=task-${passId}]`).count() === 1, "saved quest missing");
  await shot("02-signed-in-offline");
});

await step("no signal: the quest can be done and handed in", async () => {
  await page.click(`[data-testid=task-${passId}]`);
  await page.waitForSelector("[data-testid=offline-lesson]");
  await jumpTo("Show what you know");
  await page.fill("[data-testid=answer-0]", "Four tens");
  await jumpTo("Quest check");
  await page.locator("[data-testid=quest-quiz] button", { hasText: /^\s*4\s*$/ }).first().click();
  await page.locator("[data-testid=quest-quiz] button", { hasText: /check/i }).last().click();
  await page.waitForSelector("[data-testid=quiz-queued]");
  await jumpTo("Hand it in");
  await page.click("[data-testid=submit-work]");
  await page.waitForSelector("[data-testid=waiting-to-send]");
});

await step("signing out offline keeps the unsent work; back online, signing in sends it", async () => {
  await page.click("[data-testid=back-home]");
  await page.click("[data-testid=child-logout]");
  await page.waitForURL((u) => u.pathname === "/child-login");
  await up();
  await page.reload();
  await page.waitForSelector("[data-testid=child-login-form]");
  await signIn();
  await page.waitForURL((u) => u.pathname === "/child");
  await page.waitForSelector("[data-testid=offline-news]", { timeout: 20000 });
  ok(/has been handed in/.test(await page.textContent("[data-testid=offline-news]")), "work not sent");
  const a = await api("GET", `/assignments/${passId}`, pt);
  ok(a.json.status === "submitted", "status " + a.json.status);
});

await step("after the parent changes the PIN, the old PIN stops working offline", async () => {
  const ok1 = await api("PUT", `/students/${kid.id}/pin`, pt, { pin: "8642" });
  if (ok1.status !== 200) { const alt = await api("PATCH", `/students/${kid.id}`, pt, { pin: "8642" }); ok(alt.status === 200, "could not change PIN: " + ok1.status + "/" + alt.status); }
  await page.reload(); // online: the server turns the old sign-in down and the device forgets it
  await page.waitForURL((u) => u.pathname === "/child-login", { timeout: 15000 });
  await down();
  await page.reload();
  await page.waitForSelector("[data-testid=child-login-form]");
  await signIn("4321");
  await page.waitForSelector("text=Sign in once on this device while you have internet");
  await up();
});

await step("Forget children saved on this device wipes the device", async () => {
  await page.reload();
  await signIn("8642");
  await page.waitForURL((u) => u.pathname === "/child");
  await page.click("[data-testid=child-logout]");
  await page.waitForURL((u) => u.pathname === "/child-login");
  page.once("dialog", (d) => d.accept());
  await page.click("[data-testid=forget-device]");
  await page.waitForFunction(() => !document.querySelector("[data-testid=forget-device]"));
  ok(await page.evaluate(() => localStorage.getItem("sq_offline_signin")) === null, "saved sign-ins left behind");
  const dbs = await page.evaluate(async () => (await indexedDB.databases()).map((d) => d.name));
  ok(!dbs.includes("sq-offline"), "saved quests left behind");
});

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} kids offline sign-in steps passed`);
process.exit(failed.length ? 1 : 0);
