// Weekly timetable end to end: a paying parent plans a week (slots), assigns lessons that drop into the next free
// slot of their subject, repeats the week, and a free-preview family gets neither (server-enforced, with a message).
// Local Worker + local D1 + built frontend + Chromium. Never touches production.
//   PW_PATH=<playwright index.mjs> node worker/test/e2e/timetable.mjs
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL("../../../", import.meta.url).pathname);
const STATE = "/tmp/e2e-timetable-state";
const CONFIG = "wrangler.timetable-e2e.jsonc";
const PORT = 8792;
const BASE = `http://localhost:${PORT}`;
const NODE_BASE = `http://127.0.0.1:${PORT}`;
const SHOTS = resolve(ROOT, "e2e-shots/timetable");
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
  name: "side-quest-timetable-e2e", main: "./worker/src/index.ts", compatibility_date: "2025-10-01",
  assets: { directory: "./frontend/build", not_found_handling: "single-page-application", run_worker_first: ["/api/*"] },
  d1_databases: [{ binding: "DB", database_name: "e2e-timetable", database_id: "00000000-0000-0000-0000-000000000005", migrations_dir: "./worker/migrations" }],
}));
const wr = (args) => spawnSync("npx", ["wrangler", ...args, "--config", CONFIG, "--persist-to", STATE], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 120000 });
const migration = wr(["d1", "migrations", "apply", "DB", "--local"]);
if (migration.status !== 0) console.error("Local timetable D1 migrations failed:", { status: migration.status, signal: migration.signal, error: migration.error?.message }, (migration.stderr || "").slice(-5000), (migration.stdout || "").slice(-5000));
ok(migration.status === 0, "local migrations failed");
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

// ---- a paying family with one child, and a free-preview family
const stamp = Date.now();
const PW = "Passw0rd-timetable!";
const paidEmail = `tt-${stamp}@example.com`, freeEmail = `ttfree-${stamp}@example.com`;
const fam = (await api("POST", "/auth/register", null, { email: paidEmail, password: PW, name: "Parent", jurisdiction: "NSW" })).json;
const pt = fam.token;
const setPaid = wr(["d1", "execute", "DB", "--local", "--command", `UPDATE families SET plan = 'ACTIVE_MONTHLY', plan_period_end = '${new Date(Date.now() + 40 * 86400000).toISOString()}' WHERE id = '${fam.user.family_id}'`]);
ok(setPaid.status === 0, "could not set the plan");
const kid = (await api("POST", "/students", pt, { name: "Mia", username: `ttkid${stamp}`.slice(0, 16), pin: "4321", stage: "S2" })).json;
const mk = async (token, title, area) => (await api("POST", "/lessons", token, { title, learning_area: area, stage: "S2", status: "ready", sections: [{ heading: "Part", body: "Text" }] })).json.id;
const maths1 = await mk(pt, "Place value", "Mathematics");
const maths2 = await mk(pt, "Rounding", "Mathematics");
const english = await mk(pt, "Story time", "English");
const free = (await api("POST", "/auth/register", null, { email: freeEmail, password: PW, name: "Free", jurisdiction: "NSW" })).json;
const freeKid = (await api("POST", "/students", free.token, { name: "Sam", username: `ttfree${stamp}`.slice(0, 16), pin: "4321", stage: "S2" })).json;
const freeLesson = await mk(free.token, "Free maths", "Mathematics");

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
page = await ctx.newPage();
const login = async (p, email) => {
  await p.goto(BASE + "/login");
  await p.fill("[data-testid=login-email]", email); await p.fill("[data-testid=login-password]", PW);
  await p.click("[data-testid=login-submit]"); await p.waitForURL("**/parent");
};
const slots = async () => (await api("GET", `/timetable/slots?student_id=${kid.id}`, pt)).json;
let weekStart;

await step("paying parent: plan one week; it is saved as free timetable slots", async () => {
  await login(page, paidEmail);
  await page.goto(BASE + "/parent/calendar");
  await page.getByText("More planning tools").click();
  await page.click("[data-testid=generate-timetable-btn]");
  await page.waitForSelector("[data-testid=tt-generate]:not([disabled])");
  weekStart = await page.inputValue("[data-testid=tt-week]");
  await page.click("[data-testid=tt-generate]");
  await page.waitForSelector("[data-testid=tt-count]");
  await shot("01-week-preview");
  await page.click("[data-testid=tt-save]");
  await page.waitForSelector("text=Timetable saved");
  const s = await slots();
  ok(s.length >= 8, "too few slots: " + s.length);
  ok(s.every((x) => x.date >= weekStart && !x.linked_assignment_id), "slots outside the week or already filled");
  ok(s.some((x) => x.title === "Mathematics") && s.some((x) => x.title === "English"), "subjects missing: " + [...new Set(s.map((x) => x.title))].join(", "));
});

await step("Plan My Week finds the child's existing timetable without assigning anything before approval", async () => {
  await page.goto(BASE + "/parent/calendar");
  await page.click("[data-testid=plan-week-open]");
  await page.waitForSelector("[data-testid=plan-my-week]");
  await page.fill("[data-testid=plan-week-start]", weekStart);
  await page.waitForSelector("[data-testid=plan-review-week]:not([disabled])");
  await page.click("[data-testid=plan-review-week]");
  await page.waitForSelector("[data-testid=plan-week-results]", { timeout: 25000 });
  const planText = await page.textContent("[data-testid=plan-week-results]");
  ok(planText.includes("Mathematics"), "the weekly plan did not include the saved Mathematics times");
  ok(planText.includes("English"), "the weekly plan did not include the saved English times");
  ok((await slots()).every(x => !x.linked_assignment_id), "opening a plan must not automatically assign lessons");
  await page.click('[aria-label="Close weekly planner"]');
});

await step("assigning a maths lesson puts it in Mia's next free Mathematics slot (shown before saving)", async () => {
  await page.goto(BASE + "/parent/lessons");
  await page.click(`[data-testid=assign-${maths1}]`);
  await page.check(`[data-testid=sch-student-${kid.id}]`);
  await page.waitForSelector("[data-testid=sch-slot-preview]");
  ok(await page.isChecked("[data-testid=sch-mode-slot]"), "the recommended timetable option was not selected");
  const first = (await slots()).filter((x) => x.title === "Mathematics")[0];
  await page.waitForFunction(() => !/checking/.test(document.querySelector("[data-testid=sch-slot-preview]")?.textContent || "checking"));
  ok((await page.textContent("[data-testid=sch-slot-preview]")).includes("Mathematics"), "preview doesn't show the slot");
  await shot("02-assign-window");
  await page.click("[data-testid=sch-submit]");
  await page.waitForSelector("text=Scheduled in the timetable");
  const filled = (await slots()).find((x) => x.id === first.id);
  ok(filled.lesson_title === "Place value", "first maths slot not filled: " + JSON.stringify(filled));
  ok((await slots()).filter((x) => x.linked_assignment_id).length === 1, "more than one slot filled");
  const cal = (await api("GET", "/calendar", pt)).json;
  ok(cal.filter((e) => e.linked_lesson_id === maths1).length === 1, "an extra calendar entry was added next to the slot");
});

await step("the next maths lesson takes the next maths slot; an English lesson takes an English slot", async () => {
  for (const [lid, subject] of [[maths2, "Mathematics"], [english, "English"]]) {
    await page.goto(BASE + "/parent/lessons");
    await page.click(`[data-testid=assign-${lid}]`);
    await page.check(`[data-testid=sch-student-${kid.id}]`);
    await page.waitForSelector("[data-testid=sch-mode-slot]:checked");
    await page.click("[data-testid=sch-submit]");
    await page.waitForSelector("text=Scheduled in the timetable");
    const s = (await slots()).find((x) => x.linked_lesson_id === lid);
    ok(s && s.title === subject, `${subject} lesson in the wrong slot: ${JSON.stringify(s)}`);
  }
  const m = (await slots()).filter((x) => x.title === "Mathematics");
  ok(m[0].linked_lesson_id === maths1 && m[1].linked_lesson_id === maths2, "maths lessons not in order");
});

await step("the calendar shows each lesson inside its slot and free slots as free", async () => {
  const [y, mo] = weekStart.split("-").map(Number);
  await page.goto(BASE + "/parent/calendar");
  await page.click("[data-testid=calendar-month-mode]");
  const now = new Date();
  if (now.getFullYear() * 12 + now.getMonth() < y * 12 + mo - 1) await page.click("[data-testid=next-month]");
  await page.waitForSelector("[data-slot=filled]", { timeout: 10000 });
  const text = await page.textContent("[data-testid=calendar-page]");
  ok(/Mathematics · Place value/.test(text), "filled slot label missing");
  ok(await page.locator("[data-slot=free]").count() >= 1, "no free slots shown");
  await shot("03-calendar");
});

await step("new weekly agenda is readable at mobile width and parents can switch views", async () => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(BASE + "/parent/calendar");
  await page.waitForSelector("[data-testid=calendar-week-agenda]");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(overflow <= 1, "weekly calendar requires sideways scrolling on a phone: " + overflow + "px");
  await page.click("[data-testid=calendar-month-mode]");
  await page.waitForSelector("[data-testid=calendar-month]");
  await page.click("[data-testid=calendar-week-mode]");
  await page.waitForSelector("[data-testid=calendar-week-agenda]");
  await page.setViewportSize({ width: 1280, height: 900 });
});

await step("un-assigning a lesson frees its slot; the timetable stays", async () => {
  const before = (await slots()).length;
  const a = (await api("GET", "/assignments", pt)).json.find((x) => x.lesson_id === english);
  ok((await api("DELETE", `/assignments/${a.id}`, pt)).status === 200, "cancel failed");
  const s = await slots();
  ok(s.length === before, "a slot was deleted");
  ok(!s.some((x) => x.linked_lesson_id === english), "slot still holds the cancelled lesson");
});

await step("Repeat last week copies the timetable into the next week", async () => {
  await page.goto(BASE + "/parent/calendar");
  await page.getByText("More planning tools").click();
  await page.click("[data-testid=generate-timetable-btn]");
  const next = new Date(weekStart + "T12:00:00"); next.setDate(next.getDate() + 7);
  const nextStart = next.toISOString().slice(0, 10);
  await page.fill("[data-testid=tt-week]", nextStart);
  await page.click("[data-testid=tt-repeat]");
  await page.waitForSelector("[data-testid=tt-count]");
  const lastWeek = (await slots()).filter((x) => x.date < nextStart).length;
  ok((await page.textContent("[data-testid=tt-count]")).startsWith(`${lastWeek} timetable slots`), "copied count " + await page.textContent("[data-testid=tt-count]"));
  await page.click("[data-testid=tt-save]");
  await page.waitForSelector("text=Timetable saved");
  ok((await slots()).filter((x) => x.date >= nextStart).length === lastWeek, "next week not saved");
});

await step("free-preview family: timetable shows the membership message; assigning still works by day", async () => {
  const fctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const fp = await fctx.newPage();
  await login(fp, freeEmail);
  await fp.goto(BASE + "/parent/calendar");
  await fp.getByText("More planning tools").click();
  await fp.click("[data-testid=generate-timetable-btn]");
  await fp.waitForSelector("[data-testid=timetable-upsell]");
  ok(await fp.locator("[data-testid=tt-generate]").count() === 0, "free family can generate a timetable");
  await fp.goto(BASE + "/parent/lessons");
  await fp.click(`[data-testid=assign-${freeLesson}]`);
  await fp.check(`[data-testid=sch-student-${freeKid.id}]`);
  await fp.waitForSelector("[data-testid=sch-timetable-upsell]");
  ok(await fp.locator("[data-testid=sch-when]").count() === 0, "free family sees timetable options");
  await fp.click("[data-testid=sch-submit]");
  await fp.waitForSelector("text=Scheduled");
  ok((await api("POST", "/timetable/week", free.token, { week_start: weekStart, blocks: [{ student_id: freeKid.id, title: "Mathematics", date: weekStart, start_time: "09:00", duration_minutes: 45 }] })).status === 402, "server let a free family save a timetable");
  await fctx.close();
});

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} timetable steps passed`);
process.exit(failed.length ? 1 : 0);
