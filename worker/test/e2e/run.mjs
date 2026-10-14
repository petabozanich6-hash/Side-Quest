// End-to-end check of the whole learning workflow against a real local Worker + local D1 + the built frontend,
// driven through a real browser. Runs in CI (see .github/workflows/ci.yml). Never touches production.
import { spawn, spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync, rmSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL("../../../", import.meta.url).pathname);
const STATE = "/tmp/e2e-state";
const PORT = 8787;
const BASE = `http://127.0.0.1:${PORT}`;
const SHOTS = resolve(ROOT, "e2e-shots");
const PW = process.env.PW_PATH || "playwright";
const { chromium } = await import(PW);

const results = [];
let page;
let cpage;
let shotN = 0;
const shot = async (name, p) => { try { await (p || page).screenshot({ path: `${SHOTS}/${String(++shotN).padStart(2, "0")}-${name}.png`, fullPage: true }); } catch {} };
const badResponses = [];
const watch = (label, p) => p.on("response", (r) => { if (r.status() >= 400 && r.url().includes("/api/")) badResponses.push(`${label} ${r.status()} ${r.request().method()} ${r.url().replace(BASE, "")}`); });
async function step(name, fn) {
  try { await fn(); results.push({ name, ok: true }); console.log(`PASS ${name}`); }
  catch (e) { results.push({ name, ok: false, err: String(e.message || e).slice(0, 600) }); console.log(`FAIL ${name}\n     ${String(e.message || e).slice(0, 600)}`); await shot("FAIL-" + name.replace(/\W+/g, "-").slice(0, 40)); if (cpage) await shot("FAILchild-" + name.replace(/\W+/g, "-").slice(0, 40), cpage); }
}
const ok = (c, m) => { if (!c) throw new Error(m || "assertion failed"); };

// ---- local stack
rmSync(STATE, { recursive: true, force: true });
mkdirSync(SHOTS, { recursive: true });
writeFileSync(`${ROOT}/.dev.vars`, "JWT_SECRET=e2e-only-secret-not-for-production\n");
writeFileSync(`${ROOT}/wrangler.e2e.jsonc`, JSON.stringify({
  name: "side-quest-e2e", main: "./worker/src/index.ts", compatibility_date: "2025-10-01",
  assets: { directory: "./frontend/build", not_found_handling: "single-page-application", run_worker_first: ["/api/*"] },
  r2_buckets: [{ binding: "BUCKET", bucket_name: "e2e-files" }],
  d1_databases: [{ binding: "DB", database_name: "e2e", database_id: "00000000-0000-0000-0000-000000000000", migrations_dir: "./worker/migrations" }],
}));
const wr = (args) => spawnSync("npx", ["wrangler", ...args, "--config", "wrangler.e2e.jsonc", "--persist-to", STATE], { cwd: ROOT, encoding: "utf8" });
const mig = wr(["d1", "migrations", "apply", "DB", "--local"]);
console.log((mig.stdout || "").slice(-600), (mig.stderr || "").slice(-600));
ok(mig.status === 0, "local migrations failed");
const sql = (q) => { const r = wr(["d1", "execute", "DB", "--local", "--command", q]); if (r.status !== 0) throw new Error("sql failed: " + (r.stderr || r.stdout).slice(-300)); return r.stdout; };

const server = spawn("npx", ["wrangler", "dev", "--config", "wrangler.e2e.jsonc", "--local", "--persist-to", STATE, "--port", String(PORT), "--ip", "127.0.0.1"], { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
let slog = "";
server.stdout.on("data", (d) => (slog += d)); server.stderr.on("data", (d) => (slog += d));
const stop = () => { try { server.kill("SIGTERM"); } catch {} };
process.on("exit", stop);
for (let i = 0; i < 90; i++) {
  try { const r = await fetch(`${BASE}/api/health`); if (r.ok) break; } catch {}
  await new Promise((r) => setTimeout(r, 1000));
  if (i === 89) { console.log(slog.slice(-2000)); throw new Error("server did not start"); }
}
console.log("server up");

// ---- helpers
const api = async (method, path, token, body) => {
  const r = await fetch(BASE + "/api" + path, { method, headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  let json = null; try { json = await r.json(); } catch {}
  return { status: r.status, json };
};
const tokenOf = () => page.evaluate(() => localStorage.getItem("sq_token"));
const SECRET = "ZZ-ANSWER-KEY-SECRET-ZZ";
const stamp = Date.now();
const email1 = `family1-${stamp}@example.com`, pw = "Passw0rd-e2e!";
const kid = { name: "Mia", username: `mia${stamp}`.slice(0, 16), pin: "4321" };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
page = await ctx.newPage();
watch("parent", page);
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 300)));

let parentToken, lessonId, assignmentId, childToken, submissionId, xp0 = 0;


// ---- Multi-family and sibling isolation regression tests (real Worker + real D1)
await step("security: family isolation, sibling privacy, PIN revocation and throttling", async () => {
  const tag = Date.now().toString(36);
  async function family(n) {
    const r = await api("POST", "/auth/register", null, {
      email: `security-${n}-${tag}@example.com`, name: `Parent ${n}`,
      password: "SecurityPass123!", jurisdiction: "NSW"
    });
    ok(r.status === 200 && r.json?.token, `registration ${n}: ${r.status}`);
    return r.json.token;
  }
  async function child(parent, name) {
    const username = `sec${name.toLowerCase()}${tag}`;
    const r = await api("POST", "/students", parent, { name, username, pin: "7392", stage: "S2" });
    // Trial families can add only one child; seed the second sibling directly in this isolated test DB.
    if (r.status === 402 && name === "Bravo") {
      const siblingId = crypto.randomUUID();
      sql(`INSERT INTO students (id, family_id, name, username, pin_hash, birth_year, stage, year_level, theme, interests, notes, created_at, extra, credential_version)
        SELECT '${siblingId}', family_id, 'Bravo', '${username}', pin_hash, birth_year, stage, year_level, theme, interests, notes, created_at, extra, 0 FROM students WHERE username = 'sec alpha-placeholder'`.replace("sec alpha-placeholder", `secalpha${tag}`));
      r.status = 200; r.json = { id: siblingId };
    }
    ok(r.status === 200 && r.json?.id, `create ${name}: ${r.status}`);
    const login = await api("POST", "/auth/child-login", null, { username, pin: "7392" });
    ok(login.status === 200 && login.json?.token, `login ${name}: ${login.status}`);
    return { id: r.json.id, username, token: login.json.token };
  }
  const a = await family("a"), b = await family("b");
  const a1 = await child(a, "Alpha"), a2 = await child(a, "Bravo"), b1 = await child(b, "Charlie");
  async function denied(label, method, path, token, body) {
    const r = await api(method, path, token, body);
    ok([403, 404].includes(r.status), `${label} unexpectedly returned ${r.status}`);
  }
  await denied("parent B cannot view A's child", "GET", `/students/${a1.id}`, b);
  await denied("parent B cannot view A's overview", "GET", `/students/${a1.id}/overview`, b);
  await denied("child B cannot view A's child", "GET", `/students/${a1.id}`, b1.token);
  await denied("child A cannot view sibling", "GET", `/students/${a2.id}`, a1.token);
  await denied("parent B cannot change A's PIN", "PUT", `/students/${a1.id}/pin`, b, { pin: "2222" });
  await denied("parent B cannot change A's profile", "PUT", `/students/${a1.id}`, b, { name: "Tampered" });
  await denied("parent B cannot delete A's profile", "DELETE", `/students/${a1.id}`, b);
  await denied("parent B cannot create calendar event for A's child", "POST", "/calendar", b, { title: "Private", date: "2026-11-01", student_id: a1.id });
  const newPin = await api("PUT", `/students/${a1.id}/pin`, a, { pin: "9876" });
  ok(newPin.status === 200, "PIN change failed");
  const oldSession = await api("GET", "/auth/me", a1.token);
  ok(oldSession.status === 401, `old child token still valid: ${oldSession.status}`);
  const oldPin = await api("POST", "/auth/child-login", null, { username: a1.username, pin: "7392" });
  ok(oldPin.status === 401, "old PIN still valid");
  const relogin = await api("POST", "/auth/child-login", null, { username: a1.username, pin: "9876" });
  ok(relogin.status === 200, "new PIN login failed");
  const profileUpdate = await api("PUT", `/students/${a2.id}`, a, { pin: "6677" });
  ok(profileUpdate.status === 200, "profile PIN edit failed");
  const siblingOld = await api("GET", "/auth/me", a2.token);
  ok(siblingOld.status === 401, "old token survived profile PIN edit");
  for (let i = 0; i < 8; i++) {
    await api("POST", "/auth/child-login", null, { username: `guess${tag}`, pin: "0000" });
  }
  const blocked = await api("POST", "/auth/child-login", null, { username: `guess${tag}`, pin: "0000" });
  ok(blocked.status === 429, `guessing not throttled: ${blocked.status}`);
});

await step("landing page loads and has no NSW-only marketing", async () => {
  await page.goto(BASE + "/"); await page.waitForLoadState("networkidle");
  const t = await page.textContent("body");
  ok(/Side[- ]Quest/i.test(t), "no brand text");
  ok(!/NSW K|Supports NSW initial curriculum/i.test(t), "NSW-only wording still on landing");
  await shot("landing");
});

await step("landing page remains usable on phone, tablet and desktop", async () => {
  for (const [label, width, height] of [["phone", 375, 812], ["tablet", 768, 1024], ["desktop", 1440, 900]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const current = await context.newPage();
    try {
      await current.goto(BASE + "/"); await current.waitForLoadState("networkidle");
      const dims = await current.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: window.innerWidth }));
      ok(dims.scroll <= dims.viewport + 2, `landing ${label}: horizontal overflow (${dims.scroll} > ${dims.viewport})`);
      ok(await current.locator('[data-testid=nav-register]').isVisible(), `landing ${label}: registration link hidden`);
      ok(await current.locator('[data-testid=nav-child-login]').isVisible(), `landing ${label}: student login link hidden`);
      await current.screenshot({ path: `${SHOTS}/landing-${label}.png`, fullPage: true });
    } finally { await context.close(); }
  }
});

await step("A. new family registers through the UI", async () => {
  await page.goto(BASE + "/register");
  await page.fill('[data-testid=reg-name]', "Pat Parent");
  await page.selectOption('[data-testid=reg-label]', { index: 1 });
  await page.fill('[data-testid=reg-email]', email1);
  await page.fill('[data-testid=reg-password]', pw);
  await page.selectOption('[data-testid=reg-jurisdiction]', "VIC");
  await page.click('[data-testid=reg-submit]');
  await page.waitForURL("**/parent", { timeout: 20000 });
  parentToken = await tokenOf(); ok(parentToken, "no token");
  const plan = await api("GET", "/account/plan", parentToken);
  ok(plan.json.effective_plan === "FREE_PREVIEW", "not on free preview: " + JSON.stringify(plan.json));
  ok(plan.json.billing && plan.json.billing.enabled === false, "billing off without Stripe secrets: " + JSON.stringify(plan.json.billing));
  await shot("parent-home");
});

await step("curriculum shows only the state chosen at sign-up, and it can be changed", async () => {
  const me = await api("GET", "/auth/me", parentToken);
  ok(me.json.jurisdiction === "VIC", "sign-up state not saved: " + JSON.stringify(me.json));
  await page.goto(BASE + "/parent/curriculum");
  await page.waitForSelector('[data-testid=curriculum-page]');
  ok(await page.locator('[data-testid=jurisdiction-gate]').count() === 0, "state prompt shown although a state was chosen at sign-up");
  ok(await page.locator('[data-testid=curriculum-state-VIC]').count() === 1, "VIC section missing");
  ok(await page.locator('[data-testid=curriculum-state-VIC] [data-testid=curriculum-resource]').count() >= 3, "not enough VIC references");
  for (const code of ["NSW", "QLD", "WA", "SA", "TAS", "ACT", "NT"]) {
    ok(await page.locator(`[data-testid=curriculum-state-${code}]`).count() === 0, `${code} shown to a VIC family`);
  }
  ok(await page.locator('[data-testid=curriculum-national-resources] [data-testid=curriculum-resource]').count() >= 2, "missing national curriculum resources");
  ok(!/NSW syllabus outcome list\. They are suggestions/.test(await page.textContent('[data-testid=curriculum-page]')), "NSW outcome wording shown to VIC family");
  await page.click('[data-testid=curriculum-change-state]');
  await page.selectOption('[data-testid=curriculum-state-select]', "QLD");
  await page.click('[data-testid=curriculum-state-save]');
  await page.waitForSelector('[data-testid=curriculum-state-QLD]');
  ok(await page.locator('[data-testid=curriculum-state-VIC]').count() === 0, "VIC still shown after change");
  ok((await api("GET", "/auth/me", parentToken)).json.jurisdiction === "QLD", "change not saved");
  await page.click('[data-testid=curriculum-change-state]');
  await page.selectOption('[data-testid=curriculum-state-select]', "NSW");
  await page.click('[data-testid=curriculum-state-save]');
  await page.waitForSelector('[data-testid=curriculum-state-NSW]');
  await shot("curriculum-own-state");
  for (const [label, width, height] of [["phone", 375, 812], ["tablet", 768, 1024]]) {
    const ctx = await browser.newContext({ viewport: { width, height } });
    const p = await ctx.newPage();
    try {
      await p.goto(BASE + "/login");
      await p.fill('[data-testid=login-email]', email1);
      await p.fill('[data-testid=login-password]', pw);
      await p.click('[data-testid=login-submit]');
      await p.waitForURL("**/parent");
      await p.goto(BASE + "/parent/curriculum");
      const dims = await p.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: window.innerWidth }));
      ok(dims.scroll <= dims.viewport + 2, `curriculum ${label} overflows (${dims.scroll} > ${dims.viewport})`);
      await p.screenshot({ path: `${SHOTS}/curriculum-${label}.png`, fullPage: true });
    } finally { await ctx.close(); }
  }
});

await step("B. parent adds a child through the UI", async () => {
  await page.goto(BASE + "/parent/children");
  await page.click('[data-testid=add-student-btn]');
  await page.fill('[data-testid=f-name]', kid.name);
  await page.fill('[data-testid=f-username]', kid.username);
  await page.fill('[data-testid=f-pin]', kid.pin);
  await page.selectOption('[data-testid=f-stage]', "S2");
  await page.click('[data-testid=submit-student]');
  await page.waitForSelector(`text=${kid.name}`, { timeout: 15000 });
  const s = await api("GET", "/students", parentToken);
  ok(s.json.length === 1, "child not saved");
  await shot("children");
});

await step("preview: a second child is refused by the server (402)", async () => {
  const r = await api("POST", "/students", parentToken, { name: "Two", username: `two${stamp}`.slice(0, 16), pin: "1234", stage: "S2" });
  ok(r.status === 402 && r.json.code === "UPGRADE_REQUIRED", `expected 402, got ${r.status}`);
});

await step("C. parent builds a lesson in the builder, previews it and saves it to the library", async () => {
  await page.goto(BASE + "/parent/lessons/new");
  await page.fill('[data-testid=b-title]', "Halves and quarters");
  await page.fill('[data-testid=b-hoard]', "fraction = frac-shun\nquarter");
  await page.selectOption('[data-testid=b-subject]', "Mathematics");
  await page.selectOption('[data-testid=b-year]', "Year 3");
  await page.fill('[data-testid=b-obj-0]', "I can split a shape into halves and quarters");
  await page.fill('[data-testid=b-section-0]', "A half is one of two equal parts. A quarter is one of four equal parts.");
  await page.click('[data-testid=b-add-activity]');
  await page.fill('input[placeholder="Activity name"]', "Fold a paper square");
  await page.click('[data-testid=b-add-question]');
  await page.fill('[data-testid=b-q-0]', "How many quarters make a whole?");
  await page.fill('input[placeholder="Answer (only you see this)"]', SECRET + " four");
  await page.click('[data-testid=b-add-quiz]');
  await page.fill('input[placeholder="Quiz question"]', "Which is bigger, a half or a quarter?");
  const opts = page.locator('input[placeholder^="Option "]');
  await opts.nth(0).fill("A quarter"); await opts.nth(1).fill("A half");
  await page.locator('input[type=radio][name^="correct-"]').nth(1).check();
  await page.fill('textarea[placeholder="Answers and what to look for"]', SECRET + " answer sheet");
  await page.click('[data-testid=preview-tab]');
  let prev = "";
  for (let n = 0; n < 40; n++) {
    prev += "\n" + (await page.textContent('[data-testid=builder-preview]'));
    if (!(await page.locator('[data-testid=builder-preview] [data-testid=step-next]').count())) break;
    await page.click('[data-testid=builder-preview] [data-testid=step-next]');
  }
  ok(prev.includes("Halves and quarters") && prev.includes("How many quarters"), "preview missing content");
  ok(!prev.includes(SECRET), "preview shows answer key to the 'child'");
  await shot("builder-preview");
  await page.click('[data-testid=b-save-library]');
  await page.waitForURL(/\/parent\/lessons\/[^/]+\/edit/, { timeout: 15000 });
  lessonId = page.url().match(/lessons\/([^/]+)\/edit/)[1];
  const l = await api("GET", `/lessons/${lessonId}`, parentToken);
  ok(l.json.status === "ready" && l.json.title === "Halves and quarters", "lesson not saved ready");
});

await step("refreshing the builder keeps the saved lesson (persistence)", async () => {
  await page.reload(); await page.waitForSelector('[data-testid=b-title]');
  ok((await page.inputValue('[data-testid=b-title]')) === "Halves and quarters", "title lost");
  ok((await page.inputValue('[data-testid=b-q-0]')) === "How many quarters make a whole?", "question lost");
});

await step("D. library shows the lesson; duplicate and edit-as-draft work", async () => {
  await page.goto(BASE + "/parent/lessons");
  await page.waitForSelector(`[data-testid=lesson-${lessonId}]`);
  ok(!(await page.textContent("body")).includes("upgrade coming later"), "obsolete ready-made lessons notice is still displayed");
  await page.click(`[data-testid=dup-${lessonId}]`);
  await page.waitForURL(/\/parent\/lessons\/[^/]+\/edit/, { timeout: 15000 });
  ok((await page.inputValue('[data-testid=b-title]')).includes("(copy)"), "copy title");
  await page.click('[data-testid=b-save-draft]');
  await page.waitForSelector("text=Draft saved");
  const list = await api("GET", "/lessons", parentToken);
  ok(list.json.length === 2, "expected 2 lessons, got " + list.json.length);
});

await step("preview: a third lesson is refused by the server (402)", async () => {
  const r = await api("POST", "/lessons", parentToken, { title: "Third", status: "draft" });
  ok(r.status === 402 && r.json.code === "UPGRADE_REQUIRED", `expected 402 got ${r.status}`);
});

await step("legacy 19,202 lessons are hidden and cannot be assigned", async () => {
  const list = await api("GET", "/lessons", parentToken);
  ok(!list.json.some((l) => !l.family_id && l.id !== lessonId && l.id !== undefined && l.family_id === null), "legacy visible");
  const rows = sql("SELECT id FROM lessons WHERE family_id IS NULL LIMIT 1;");
  const m = rows.match(/"id":\s*"([^"]+)"/); ok(m, "no legacy row found to test with");
  const kids = await api("GET", "/students", parentToken);
  const r = await api("POST", "/assignments", parentToken, { student_id: kids.json[0].id, lesson_id: m[1] });
  ok(r.status === 404, "legacy lesson assignable: " + r.status);
  const one = await api("GET", `/lessons/${m[1]}`, parentToken);
  ok(one.status === 404, "legacy lesson readable");
});

await step("parent can permanently delete an unassigned draft without losing other lessons", async () => {
  const before = await api("GET", "/lessons", parentToken);
  const draft = before.json.find(x => x.id !== lessonId && x.status === "draft");
  ok(draft?.id, "missing unassigned draft for delete test");
  await page.goto(BASE + "/parent/lessons");
  await page.waitForSelector(`[data-testid=delete-${draft.id}]`);
  page.once("dialog", d => d.accept());
  await page.click(`[data-testid=delete-${draft.id}]`);
  await page.waitForSelector(`[data-testid=lesson-${draft.id}]`, { state: "detached" });
  ok((await api("GET", `/lessons/${draft.id}`, parentToken)).status === 404, "unassigned lesson was not permanently deleted");
  ok((await api("GET", `/lessons/${lessonId}`, parentToken)).status === 200, "unrelated lesson was removed");
});

await step("E. parent assigns the lesson to the child through the UI", async () => {
  await page.goto(BASE + "/parent/lessons");
  await page.click(`[data-testid=assign-${lessonId}]`);
  const kids = await api("GET", "/students", parentToken);
  await page.check(`[data-testid=sch-student-${kids.json[0].id}]`);
  await page.click('[data-testid=sch-submit]');
  await page.waitForSelector("text=Scheduled", { timeout: 15000 });
  const as = await api("GET", "/assignments", parentToken);
  ok(as.json.length === 1, "assignment not created"); assignmentId = as.json[0].id;
  const dup = await api("POST", "/assignments", parentToken, { student_id: kids.json[0].id, lesson_id: lessonId });
  ok(dup.status === 409, "duplicate active assignment allowed");
});

// ---- child
const cctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
cpage = await cctx.newPage();
watch("child", cpage);
const cErrors = []; cpage.on("pageerror", (e) => cErrors.push(String(e).slice(0, 300)));
const noOverflow = async (p, label) => {
  const w = await p.evaluate(() => ({ s: document.documentElement.scrollWidth, i: window.innerWidth }));
  ok(w.s <= w.i + 2, `${label}: horizontal overflow on mobile (${w.s} > ${w.i})`);
};

await step("F. child signs in on a phone-sized screen and sees the dashboard", async () => {
  await cpage.goto(BASE + "/child-login");
  await cpage.fill('[data-testid=child-login-username]', kid.username);
  await cpage.fill('[data-testid=child-login-pin]', kid.pin);
  await cpage.click('[data-testid=child-login-submit]');
  await cpage.waitForURL("**/child", { timeout: 20000 });
  // A first-time child chooses a pet companion before anything else.
  try {
    await cpage.waitForSelector('[data-testid=pet-picker]', { timeout: 6000 });
    await cpage.click('[data-testid=pet-fox]');
    await cpage.fill('[data-testid=pet-name]', "Ember");
    await cpage.click('[data-testid=create-pet]');
  } catch { /* already has a pet */ }
  childToken = await cpage.evaluate(() => localStorage.getItem("sq_token"));
  try { await cpage.waitForSelector(`[data-testid=task-${assignmentId}]`, { timeout: 15000 }); }
  catch (e) {
    const d = await api("GET", "/dashboard/child", childToken);
    throw new Error(`task card not shown. url=${cpage.url()} token=${!!childToken} dashboard=${d.status} ${JSON.stringify(d.json).slice(0, 300)} body=${(await cpage.textContent("body")).slice(0, 300)}`);
  }
  await noOverflow(cpage, "child dashboard");
  ok(await cpage.isVisible('[data-testid=quest-stats]'), "stats strip missing");
  await cpage.screenshot({ path: `${SHOTS}/child-dashboard-mobile.png`, fullPage: true });
});

await step("child cannot use parent controls (permissions)", async () => {
  ok((await api("POST", "/lessons", childToken, { title: "x" })).status === 403, "child can create lessons");
  ok((await api("POST", "/assignments", childToken, { student_id: "a", lesson_id: "b" })).status === 403, "child can assign");
  ok((await api("GET", "/students", childToken)).status === 403, "child can list students");
  ok((await api("GET", "/account/plan", parentToken)).status === 200, "parent plan");
  ok((await api("POST", `/submissions/${"nope"}/feedback`, childToken, { status: "demonstrated" })).status === 403, "child can review");
});

// The child lesson is a step-by-step player. These walk it the way a child would.
async function readAll(p) {
  await p.selectOption("[data-testid=step-jump]", { index: 0 });
  let t = "";
  for (let n = 0; n < 60; n++) {
    t += "\n" + (await p.textContent("[data-testid=child-lesson]"));
    if (!(await p.locator("[data-testid=step-next]").count())) break;
    await p.click("[data-testid=step-next]");
  }
  await p.selectOption("[data-testid=step-jump]", { index: 0 });
  return t;
}
async function seek(p, selector) {
  await p.selectOption("[data-testid=step-jump]", { index: 0 });
  for (let n = 0; n < 60; n++) {
    if (await p.locator(selector).count()) return;
    if (!(await p.locator("[data-testid=step-next]").count())) break;
    await p.click("[data-testid=step-next]");
  }
  throw new Error("never reached " + selector);
}

await step("G. child opens the lesson: sees real content, no answer keys anywhere in the response", async () => {
  await cpage.goto(`${BASE}/child/lesson/${assignmentId}`);
  await cpage.waitForSelector('[data-testid=lesson-title]', { timeout: 15000 });
  const body = await readAll(cpage);
  ok(body.includes("A half is one of two equal parts"), "teaching text missing");
  ok(body.includes("How many quarters make a whole?"), "question missing");
  ok(!body.includes(SECRET), "answer key text visible to child");
  const raw = await api("GET", `/assignments/${assignmentId}`, childToken);
  const txt = JSON.stringify(raw.json);
  const lessonTxt = JSON.stringify(raw.json.lesson);
  ok(!txt.includes(SECRET), "answer key in child API response");
  ok(!txt.includes("correct_index"), "correct_index in child API response");
  ok(!lessonTxt.includes("parent_notes") && !lessonTxt.includes("answer_key"), "parent-only fields in child lesson");
  await noOverflow(cpage, "child lesson");
  await cpage.screenshot({ path: `${SHOTS}/child-lesson-mobile.png`, fullPage: true });
});

await step("child answers are saved and survive a refresh", async () => {
  await seek(cpage, '[data-testid=activity-0]');
  await cpage.check('[data-testid=activity-0]');
  await seek(cpage, '[data-testid=answer-0]');
  await cpage.fill('[data-testid=answer-0]', "Four quarters");
  await seek(cpage, '[data-testid=save-progress]');
  await cpage.click('[data-testid=save-progress]');
  await cpage.waitForSelector("text=Your work is saved");
  await cpage.reload(); await cpage.waitForSelector('[data-testid=step-jump]');
  // the child comes back to the step they were on, and nothing is lost
  await cpage.waitForSelector('[data-testid=save-progress]', { timeout: 10000 });
  await seek(cpage, '[data-testid=answer-0]');
  ok((await cpage.inputValue('[data-testid=answer-0]')) === "Four quarters", "written answer lost on refresh");
  await seek(cpage, '[data-testid=activity-0]');
  ok(await cpage.isChecked('[data-testid=activity-0]'), "tick lost on refresh");
});

await step("Word Hoard: the lesson's spelling words reach the child's hoard when the lesson opens", async () => {
  const wb = await api("GET", "/word-bank", childToken);
  const all = Object.values(wb.json.words || {}).flat().map((w) => w.word);
  ok(all.includes("fraction") && all.includes("quarter"), "hoard words missing: " + JSON.stringify(all));
  const hint = Object.values(wb.json.words || {}).flat().find((w) => w.word === "fraction");
  ok(/frac-shun/.test(JSON.stringify(hint)), "memory trick lost: " + JSON.stringify(hint));
});

await step("Word Hoard: practice goes See it, Hear it, Spell it, Type it, and a right answer counts", async () => {
  const hp = await cpage.context().newPage();
  try {
    await hp.goto(`${BASE}/child/word-hoard`);
    await hp.getByRole("button", { name: /Tame a/ }).first().click();
    await hp.waitForSelector("text=1. See it");
    await hp.getByRole("button", { name: /I have seen it/ }).click();
    const word = (await hp.locator("[data-testid=practice-word]").first().innerText()).trim();
    ok(/^[a-z'-]+$/i.test(word), "word not shown in See it: " + word);
    await hp.waitForSelector("text=Listen to the word");
    await hp.getByRole("button", { name: /I said it/ }).click();
    await hp.getByRole("button", { name: /I spelled it/ }).click();
    await hp.locator("input[type=text]").fill(word);
    await hp.getByRole("button", { name: "Check", exact: true }).click();
    await hp.waitForSelector("text=Correct. Well done.");
  } finally { await hp.close(); }
});

await step("Pet goals, shop and parent weekly summary work end to end", async () => {
  const mk = await api("POST", "/pet", childToken, { species: "fox", name: "Rusty" });
  ok(mk.status === 200 || mk.status === 400, "pet create " + mk.status); // 400 = the child already has a pet
  const q = await api("GET", "/pet/quests", childToken);
  ok(q.status === 200 && q.json.goals.length === 3, "quests: " + JSON.stringify(q.json).slice(0, 200));
  ok(q.json.shop.length > 0 && q.json.slots.total === 1, "shop/slots");
  ok((await api("POST", "/pet/quests/claim", childToken, { id: q.json.goals[0].id })).status === 400, "claimed an unfinished goal");
  ok((await api("POST", "/pet/shop/buy", childToken, { item: "plant" })).status === 400, "bought without coins");
  ok((await api("POST", "/pet/stable/new", childToken, { species: "owl", name: "Hoot" })).status === 400, "second pet before it was earned");
  ok((await api("POST", "/pet/quests", parentToken, {})).status !== 200, "route exposed to parent");
  const kids = await api("GET", "/students", parentToken);
  const wk = await api("GET", `/pet/week/${kids.json[0].id}`, parentToken);
  ok(wk.status === 200 && Array.isArray(wk.json.words_mastered), "week summary " + wk.status);
  ok((await api("GET", `/pet/week/${kids.json[0].id}`, childToken)).status === 403, "child read parent summary");
});

await step("Pet room shows goals (no shop or decorating) and sound toggle, and sounds can be muted", async () => {
  const pp = await cpage.context().newPage();
  const errs = [];
  pp.on("pageerror", (e) => errs.push(String(e.message || e)));
  try {
    await pp.goto(`${BASE}/child/room`);
    await pp.waitForSelector("[data-testid=pet-quests]", { timeout: 15000 });
    await pp.waitForSelector("[data-testid=sound-toggle]");
    ok((await pp.getAttribute("[data-testid=pet-scene]", "data-scene")) === "cozy", "cosy room is not the default scene");
    const img = await pp.request.get(`${BASE}/pet-room/cozy-room.webp`);
    ok(img.status() === 200 && /image/.test(img.headers()["content-type"] || ""), "room picture not served: " + img.status());
    ok((await pp.locator("[data-testid=daily-goals] li").count()) === 3, "three goals expected");
    await pp.click("[data-testid=sound-toggle]");
    ok(/off/i.test(await pp.innerText("[data-testid=sound-toggle]")), "sound did not mute");
    ok((await pp.locator("[data-testid=pet-shop], [data-testid=customize-card], [data-testid=coins]").count()) === 0, "shop, decorate card or coin counter still showing");
    ok(errs.length === 0, "page errors: " + errs.join("; "));
  } finally { await pp.close(); }
});

await step("cannot hand in before passing the quiz (server enforces it)", async () => {
  const r = await api("POST", "/submissions", childToken, { assignment_id: assignmentId, response_text: "cheat" });
  ok(r.status === 409 && r.json.code === "QUIZ_NOT_PASSED", `expected QUIZ_NOT_PASSED got ${r.status} ${JSON.stringify(r.json)}`);
});

await step("multiple-choice quiz: wrong answer fails, right answer passes (marked on the server)", async () => {
  await seek(cpage, '[data-testid=quiz-section]');
  await cpage.getByRole("button", { name: "A quarter", exact: true }).click();
  await cpage.getByRole("button", { name: /Check my answers/ }).click();
  await cpage.waitForSelector("text=Try again");
  await cpage.getByRole("button", { name: "Try again" }).click();
  await cpage.getByRole("button", { name: "A half", exact: true }).click();
  await cpage.getByRole("button", { name: /Check my answers/ }).click();
  await cpage.waitForSelector("text=Quest cleared");
});

await step("H. child hands the work in", async () => {
  await seek(cpage, '[data-testid=submit-work]');
  await cpage.click('[data-testid=submit-work]');
  await cpage.waitForSelector('[data-testid=handed-in]', { timeout: 15000 });
  const again = await api("POST", "/submissions", childToken, { assignment_id: assignmentId, response_text: "again" });
  ok(again.status === 409, "double submit allowed");
  const subs = await api("GET", "/submissions", parentToken);
  ok(subs.json.length === 1 && subs.json[0].status === "submitted", "submission not saved");
  ok(subs.json[0].response_text.includes("Four quarters"), "answers not in submission");
  submissionId = subs.json[0].id;
  await cpage.reload(); await cpage.waitForSelector('[data-testid=handed-in]');
});

await step("I. parent sees it waiting, reviews it (with the answer key) and approves", async () => {
  await page.goto(BASE + "/parent");
  await page.waitForSelector(`[data-testid=waiting-${submissionId}]`, { timeout: 15000 });
  await page.click(`[data-testid=open-${submissionId}]`);
  await page.waitForSelector('[data-testid=review-modal]');
  const m = await page.textContent('[data-testid=review-modal]');
  ok(m.includes("Four quarters"), "answers not shown to parent");
  ok(m.includes(SECRET), "parent cannot see their answer key");
  xp0 = (await api("GET", "/dashboard/child", childToken)).json.xp;
  await page.fill('[data-testid=feedback-text]', "Lovely folding, Mia!");
  await page.click('[data-testid=approve-btn]');
  await page.waitForSelector(`[data-testid=waiting-${submissionId}]`, { state: "detached", timeout: 15000 });
});

await step("J. XP, progress and evidence update; XP is awarded exactly once", async () => {
  const dash = await api("GET", "/dashboard/child", childToken);
  ok(dash.json.xp >= xp0 + 45 && dash.json.xp < xp0 + 45 + 40, `expected ${xp0} + 45 XP got ` + dash.json.xp);
  ok(dash.json.completed.length === 1, "completed list");
  const again = await api("POST", `/submissions/${submissionId}/feedback`, parentToken, { status: "demonstrated", feedback_text: "Lovely folding, Mia!" });
  ok(again.status === 200 && again.json.xp_awarded === 0, "XP awarded twice");
  const dash2 = await api("GET", "/dashboard/child", childToken);
  ok(dash2.json.xp < dash.json.xp + 45, "XP was awarded again on re-review");
  await cpage.goto(BASE + "/child"); await cpage.waitForSelector('[data-testid=completed-portfolio-link]');
  ok(await cpage.locator('[data-testid=completed-section]').count() === 0, "completed lessons should not stay on child home");
  await cpage.click('[data-testid=completed-portfolio-link]');
  await cpage.waitForURL("**/child/archive");
  await cpage.waitForSelector('[data-testid=child-lesson-archive]', { state: "visible", timeout: 15000 });
  await cpage.goto(BASE + "/child/portfolio");
  await cpage.waitForSelector('[data-testid^=port-]', { state: "visible", timeout: 15000 });
  await cpage.goto(BASE + "/child");
  await cpage.waitForSelector('[data-testid=stat-xp]');
  const shown = Number((await cpage.textContent('[data-testid=stat-xp]')).trim());
  const nowXp = (await api("GET", "/dashboard/child", childToken)).json.xp;
  ok(shown >= xp0 + 45 && shown <= nowXp, `XP shown to child (${shown}) should include the 45 awarded (before ${xp0}, now ${nowXp})`);
  await page.goto(BASE + "/parent/evidence"); await page.waitForLoadState("networkidle");
  ok((await page.textContent("body")).includes("Halves and quarters"), "evidence page missing the approved work");
  const kidsNow = await api("GET", "/students", parentToken);
  const pf = await api("GET", `/portfolio?student_id=${kidsNow.json[0].id}`, parentToken);
  ok(pf.status === 200 && pf.json.entries.length === 1 && pf.json.entries[0].title === "Halves and quarters" && pf.json.entries[0].learning_area === "Mathematics", "portfolio export missing the approved work");
  ok(pf.json.entries[0].work.includes("Four quarters") && pf.json.entries[0].parent_comment.includes("Lovely"), "portfolio missing answers or comment");
  ok(!JSON.stringify(pf.json).includes(SECRET), "portfolio leaks the answer key");
  ok((await api("GET", `/portfolio?student_id=${kidsNow.json[0].id}`, childToken)).status === 403, "child can export portfolio");
  const pdash = await api("GET", "/dashboard/parent", parentToken);
  ok(pdash.json.students[0].completed === 1, "parent dashboard progress");
  await cpage.goto(`${BASE}/child/lesson/${assignmentId}`); await cpage.waitForSelector('[data-testid=reviewed-note]');
  ok((await cpage.textContent('[data-testid=reviewed-note]')).includes("Lovely folding"), "child cannot see feedback");
  await shot("evidence");
});

await step("parent feedback and cheers disappear after child acknowledges them on the server", async () => {
  const before = await api("GET", "/child/inbox", childToken);
  ok(before.status === 200, "child inbox unavailable");
  const feedback = before.json.find(x => x.kind === "feedback");
  ok(feedback, "approved work feedback missing");
  ok((await api("POST", "/child/inbox/seen", childToken, { id: feedback.id, kind: feedback.kind })).status === 200, "cannot acknowledge feedback");
  const after = await api("GET", "/child/inbox", childToken);
  ok(!after.json.some(x => x.id === feedback.id), "acknowledged feedback remains visible across devices");
  const students = await api("GET", "/students", parentToken);
  const created = await api("POST", "/cheers", parentToken, { student_id: students.json[0].id, message: "Excellent effort!", emoji: "⭐" });
  ok(created.status === 200, "parent cheer could not be saved");
  const cheer = (await api("GET", "/child/inbox", childToken)).json.find(x => x.kind === "cheer" && x.id === created.json.id);
  ok(cheer, "new parent cheer missing");
  ok((await api("POST", "/child/inbox/seen", childToken, { id: cheer.id, kind: "cheer" })).status === 200, "cannot acknowledge parent cheer");
  ok(!(await api("GET", "/child/inbox", childToken)).json.some(x => x.id === cheer.id), "acknowledged cheer was not cleared");
});

await step("parent can open the child learning records from the child overview", async () => {
  const students = await api("GET", "/students", parentToken);
  await page.goto(BASE + `/parent/children/${students.json[0].id}`);
  await page.waitForSelector('[data-testid=child-overview]');
  ok(await page.locator('[data-testid=child-overview-reading-link]').isVisible(), "reading link missing");
  ok(await page.locator('[data-testid=child-overview-evidence-link]').isVisible(), "evidence link missing");
  await page.click('[data-testid=child-overview-evidence-link]');
  await page.waitForURL("**/parent/evidence");
  await page.goto(BASE + "/parent");
  await page.waitForSelector('[data-testid=quick-evidence]', { state: "visible", timeout: 10000 });
});

await step("editing the library lesson does not change the finished assignment (snapshot)", async () => {
  const up = await api("PUT", `/lessons/${lessonId}`, parentToken, { title: "RENAMED LATER", status: "ready", sections: [{ body: "changed" }] });
  ok(up.status === 200, "edit failed " + up.status);
  const a = await api("GET", `/assignments/${assignmentId}`, childToken);
  ok(a.json.lesson.title === "Halves and quarters", "assignment changed after library edit");
});

await step("uploads: child can upload a photo, same family can read it, other families and unsafe types cannot", async () => {
  const feat = await api("GET", "/features", childToken);
  ok(feat.json.uploads === true, "uploads flag off with a bucket bound");
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
  const up = async (token, name, type, bytes) => { const fd = new FormData(); fd.append("file", new Blob([bytes], { type }), name); const r = await fetch(BASE + "/api/files/upload", { method: "POST", headers: { authorization: `Bearer ${token}` }, body: fd }); return { status: r.status, json: await r.json().catch(() => null) }; };
  const ok1 = await up(childToken, "work.png", "image/png", png);
  ok(ok1.status === 200 && ok1.json.id, "png upload failed " + ok1.status);
  const get = (token, id) => fetch(`${BASE}/api/files/${id}?auth=${encodeURIComponent(token)}`);
  ok((await get(parentToken, ok1.json.id)).status === 200, "parent cannot read child's upload");
  const other = await api("POST", "/auth/register", null, { name: "Third", email: `family4-${stamp}@example.com`, password: pw, jurisdiction: "NSW" });
  ok((await get(other.json.token, ok1.json.id)).status === 404, "other family can read the upload");
  ok((await up(childToken, "x.html", "text/html", "<script>alert(1)</script>")).status === 400, "html upload allowed");
  ok((await up(childToken, "x.svg", "image/svg+xml", "<svg onload=alert(1)/>")).status === 400, "svg upload allowed");
});

await step("K. another family cannot see or touch this family's records", async () => {
  const reg = await api("POST", "/auth/register", null, { name: "Other Parent", email: `family2-${stamp}@example.com`, password: pw, jurisdiction: "NSW" });
  ok(reg.status === 200, "register 2 " + reg.status);
  const t2 = reg.json.token;
  ok((await api("GET", "/lessons", t2)).json.length === 0, "family 2 sees lessons");
  ok((await api("GET", `/lessons/${lessonId}`, t2)).status === 404, "lesson readable");
  ok((await api("PUT", `/lessons/${lessonId}`, t2, { title: "hacked", status: "ready" })).status === 404, "lesson editable");
  ok((await api("POST", `/lessons/${lessonId}/duplicate`, t2)).status === 404, "lesson duplicable");
  ok((await api("DELETE", `/lessons/${lessonId}`, t2)).status === 404, "lesson deletable");
  ok((await api("GET", `/assignments/${assignmentId}`, t2)).status === 404, "assignment readable");
  ok((await api("GET", `/submissions/${submissionId}`, t2)).status === 404, "submission readable");
  ok((await api("POST", `/submissions/${submissionId}/feedback`, t2, { status: "demonstrated" })).status === 404, "submission reviewable");
  ok((await api("GET", "/submissions", t2)).json.length === 0, "submissions listed");
  const kids = await api("GET", "/students", parentToken);
  ok((await api("GET", `/students/${kids.json[0].id}`, t2)).status !== 200, "child profile readable");
  const l2 = await api("POST", "/lessons", t2, { title: "Theirs", status: "ready" });
  ok(l2.status === 200, "family 2 own lesson " + l2.status);
  ok((await api("POST", "/assignments", t2, { student_id: kids.json[0].id, lesson_id: l2.json.id })).status === 404, "assigned to someone else's child");
  ok((await api("POST", "/assignments", parentToken, { student_id: kids.json[0].id, lesson_id: l2.json.id })).status === 404, "assigned someone else's lesson");
  // existing authorised family (grandfathered INTERNAL) is not limited
  const fam = JSON.parse(Buffer.from(t2.split(".")[1], "base64url").toString()).family_id;
  sql(`UPDATE families SET plan='INTERNAL' WHERE id='${fam}';`);
  for (let i = 0; i < 3; i++) ok((await api("POST", "/lessons", t2, { title: "L" + i, status: "ready" })).status === 200, "INTERNAL family limited");
  ok((await api("POST", "/students", t2, { name: "A", username: `a${stamp}`.slice(0, 14), pin: "1234", stage: "S1" })).status === 200, "INTERNAL child 1");
  ok((await api("POST", "/students", t2, { name: "B", username: `b${stamp}`.slice(0, 14), pin: "1234", stage: "S1" })).status === 200, "INTERNAL child 2");
});

await step("AI drafting: free preview is blocked by the server and the builder shows an upsell, not a fake AI", async () => {
  const r = await api("POST", "/ai/lesson-draft", parentToken, { topic: "Fractions" });
  ok(r.status === 402 && r.json.code === "UPGRADE_REQUIRED", `expected 402, got ${r.status}`);
  const st = await api("GET", "/ai/status", parentToken);
  ok(st.json.allowed === false, "free preview shown as allowed");
  const n = await api("GET", "/lessons", parentToken);
  ok(!n.json.some(l => l.ai_generated), "AI lesson exists for a free family");
});

await step("assignments page: change dates and cancel an unstarted assignment", async () => {
  const kids = await api("GET", "/students", parentToken);
  const made = await api("POST", "/assignments", parentToken, { student_id: kids.json[0].id, lesson_id: lessonId });
  ok(made.status === 200, "could not assign again after finishing: " + made.status);
  const id = made.json.id;
  await page.goto(BASE + "/parent/assignments"); await page.waitForSelector(`[data-testid=asg-${id}]`);
  ok((await page.textContent("[data-testid=assignments-page]")).includes("Completed"), "finished assignment not shown as Completed");
  await page.click(`[data-testid=asg-move-${id}]`);
  await page.fill("[data-testid=asg-date-planned]", "2026-11-03");
  await page.click("[data-testid=asg-save-dates]");
  await page.waitForFunction(async ([i]) => { const t = localStorage.getItem("sq_token"); const r = await fetch("/api/assignments/" + i, { headers: { Authorization: "Bearer " + t } }); return (await r.json()).scheduled_date === "2026-11-03"; }, [id]);
  page.once("dialog", (d) => d.accept());
  await page.click(`[data-testid=asg-cancel-${id}]`);
  await page.waitForSelector(`[data-testid=asg-${id}]`, { state: "detached" });
  ok((await api("GET", "/assignments/" + id, parentToken)).status === 404, "cancelled assignment still exists");
  // the finished one cannot be cancelled
  ok((await api("DELETE", "/assignments/" + assignmentId, parentToken)).status === 409, "started work could be cancelled");
});

await step("evidence: add a parent note, search it, export CSV with a date range", async () => {
  await page.goto(BASE + "/parent/evidence"); await page.waitForSelector("[data-testid=evidence-notes]");
  await page.fill("[data-testid=note-title]", "Museum excursion");
  await page.fill("[data-testid=note-text]", "Looked at fossils with Mia");
  await page.click("[data-testid=note-save]");
  await page.waitForSelector("text=Museum excursion");
  await page.fill("[data-testid=evidence-search]", "fossil");
  ok((await page.textContent("[data-testid=evidence-notes]")).includes("Museum excursion"), "search lost the note");
  await page.fill("[data-testid=evidence-search]", "zzzz");
  ok(!(await page.textContent("ul")).includes("Museum excursion"), "search did not filter");
  const kids = await api("GET", "/students", parentToken);
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click(`[data-testid=csv-${kids.json[0].id}]`)]);
  ok(dl.suggestedFilename().endsWith(".csv"), "csv name");
  const p = await api("GET", `/portfolio?student_id=${kids.json[0].id}&from=2999-01-01`, parentToken);
  ok(p.json.entries.length === 0, "date range not applied");
  const other = await api("GET", "/evidence-notes", parentToken);
  ok(other.json.length === 1, "note count");
});

await step("rich lesson: the Year 3 garden addition lesson teaches in the child's lesson page and keeps the parent guide and answers hidden", async () => {
  const GARDEN = JSON.parse(readFileSync(resolve(ROOT, "frontend/src/data/exampleLesson.json"), "utf8"));
  const reg = await api("POST", "/auth/register", null, { name: "Garden Fam", email: `garden-${stamp}@example.com`, password: pw, jurisdiction: "NSW" });
  const pt = reg.json.token;
  const fam = JSON.parse(Buffer.from(pt.split(".")[1], "base64url").toString()).family_id;
  sql(`UPDATE families SET plan='ACTIVE_MONTHLY' WHERE id='${fam}';`);
  const un = `gk${stamp}`.slice(0, 14);
  const ch = await api("POST", "/students", pt, { name: "Gus", username: un, pin: "4321", stage: "S2" });
  ok(ch.status === 200, "child " + ch.status);
  const les = await api("POST", "/lessons", pt, { ...GARDEN, status: "ready" });
  ok(les.status === 200, "garden lesson rejected: " + JSON.stringify(les.json));
  const asg = await api("POST", "/assignments", pt, { student_id: ch.json.id, lesson_id: les.json.id });
  ok(asg.status === 200, "assign " + asg.status);
  // AI is not connected in this local run: a paid family is told so plainly, nothing is invented.
  const ai = await api("POST", "/ai/lesson-draft", pt, { topic: "Addition" });
  ok(ai.status === 503 && ai.json.code === "AI_UNAVAILABLE", "expected honest AI_UNAVAILABLE, got " + ai.status);
  // parent builder shows the wide editor with the full lesson
  const pctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await pctx.newPage();
  await page.goto(BASE + "/login");
  await page.fill('[data-testid=login-email]', `garden-${stamp}@example.com`); await page.fill('[data-testid=login-password]', pw);
  await page.click('[data-testid=login-submit]'); await page.waitForURL("**/parent");
  await page.goto(BASE + `/parent/lessons/${les.json.id}/edit`);
  await page.waitForSelector("[data-testid=lesson-builder]");
  ok(await page.inputValue("[data-testid=b-parent-script]").then(v => v.includes("Hook (0 to 5 min)")), "parent guide missing in editor");
  await page.click("[data-testid=preview-tab]");
  const pv = await page.textContent("[data-testid=builder-preview]");
  ok(pv.includes("Mistakes to avoid") && pv.includes("Try it") && !pv.includes("Hook (0 to 5 min)") && !pv.includes("Sam forgot to regroup"), "preview content/leak");
  // child sees it
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const cp = await mctx.newPage();
  await cp.goto(BASE + "/child-login");
  await cp.fill('[data-testid=child-login-username]', un);
  await cp.fill('[data-testid=child-login-pin]', "4321");
  await cp.click('[data-testid=child-login-submit]');
  await cp.waitForURL("**/child", { timeout: 20000 });
  try { await cp.waitForSelector('[data-testid=pet-picker]', { timeout: 6000 }); await cp.click('[data-testid=pet-fox]'); await cp.fill('[data-testid=pet-name]', "Ember"); await cp.click('[data-testid=create-pet]'); } catch {}
  await cp.goto(`${BASE}/child/lesson/${asg.json.id}`);
  await cp.waitForSelector("[data-testid=lesson-title]", { timeout: 15000 });
  const body = await readAll(cp);
  for (const need of ["Imagine you have a vegie patch", "Tens and ones: how numbers are built", "13 ones is more than 10, so regroup", "Try it", "You will need:", "Extra challenge", "Work out 36 + 27", "Why this matters:", "You should already know:", "Mistakes to avoid", "Writing the whole 13 in the ones place", "Remember", "Let's remember the three big ideas", "Add Bed A and Bed B: 34 + 27"]) ok(body.includes(need), "child page missing: " + need);
  for (const leak of ["Hook (0 to 5 min)", "Sam forgot to regroup", "If your child finds regrouping hard", "A photo of the bean cups", "63. Tens: 30", "Reference example (not AI output)", "Concept: adding two-digit", "How many tens and how many ones are in 47?", "4 cups and 5 loose beans. 27 + 18 = 45"]) ok(!body.includes(leak), "child page leaks: " + leak);
  await cp.screenshot({ path: `${SHOTS}/garden-lesson-child-mobile.png`, fullPage: true });
  const tok = await cp.evaluate(() => localStorage.getItem("sq_token"));
  const raw = JSON.stringify((await api("GET", `/assignments/${asg.json.id}`, tok)).json);
  for (const leak of ["parent_script", "evidence_suggestions", "answer_key", "correct_index", "\"support\""]) ok(!raw.includes(leak), "API leaks " + leak);
  ok((await api("GET", `/lessons/${les.json.id}`, tok)).status === 403, "child can read parent lesson");
  // learning preferences are saved for the parent and never reach the child
  const putP = await api("PUT", `/students/${ch.json.id}`, pt, { interests: ["gardening"], prefs: { delivery: "independent", duration_minutes: 30, support_areas: "long passages", bogus: "x" } });
  ok(putP.status === 200 && putP.json.prefs.delivery === "independent" && putP.json.prefs.duration_minutes === 30 && !("bogus" in putP.json.prefs), "prefs not saved: " + JSON.stringify(putP.json));
  ok((await api("GET", "/students", pt)).json.find(x => x.id === ch.json.id).prefs.support_areas === "long passages", "parent list lacks prefs");
  ok(!JSON.stringify((await api("GET", `/students/${ch.json.id}`, tok)).json).includes("prefs"), "child can see learning preferences");
  // "I'm stuck" helper: server-side access rules (AI is not connected in this run, so it must say so honestly)
  const hs = await api("GET", "/help/status", tok);
  ok(hs.status === 200 && hs.json.available === false && hs.json.reason === "unavailable", "help status: " + JSON.stringify(hs.json));
  const hh = await api("POST", `/assignments/${asg.json.id}/help`, tok, { kind: "hint", level: 2, target: { part: "guided", i: 0 } });
  ok(hh.status === 503 && hh.json.code === "AI_UNAVAILABLE", "child help without AI: " + hh.status);
  ok((await api("POST", `/assignments/${asg.json.id}/help`, pt, { kind: "hint", target: { part: "general" } })).status === 403, "parent used the child helper");
  ok((await api("GET", "/help/status", pt)).status === 403, "parent read child help status");
  ok((await api("GET", "/ai/help-usage", tok)).status === 403, "child read help usage");
  ok((await api("GET", "/ai/help-usage", pt)).json.children[ch.json.id].month === 0, "help usage not reported to parent");
  ok((await api("PUT", `/students/${ch.json.id}`, pt, { ai_help: false })).json.ai_help === false, "parent could not switch help off");
  ok((await api("PUT", `/students/${ch.json.id}`, pt, { ai_help: true })).json.ai_help === true, "parent could not switch help on");
  ok(await cp.locator("[data-testid=stuck-btn]").count() === 0, "help button shown although the helper is unavailable");
  // Year 7 independent reference lesson: same pipeline, written straight to the student
  const Y7 = JSON.parse(readFileSync(resolve(ROOT, "frontend/src/data/referenceYear7Integers.json"), "utf8"));
  const les7 = await api("POST", "/lessons", pt, { ...Y7, status: "ready" });
  ok(les7.status === 200, "year 7 lesson rejected: " + JSON.stringify(les7.json));
  const asg7 = await api("POST", "/assignments", pt, { student_id: ch.json.id, lesson_id: les7.json.id });
  ok(asg7.status === 200, "assign y7 " + asg7.status);
  await cp.goto(`${BASE}/child/lesson/${asg7.json.id}`);
  await cp.waitForSelector("[data-testid=lesson-title]", { timeout: 15000 });
  const b7 = await readAll(cp);
  for (const need of ["Negative numbers: counting below zero", "What is a negative number?", "The number line", "Opposites and distance from zero", "Ordering temperatures", "Adding across zero", "Why this matters:", "Mistakes to avoid", "Temperature detective", "Put the places in order from coldest to warmest.", "Money story", "Remember", "Challenge yourself"]) ok(b7.includes(need), "y7 child page missing: " + need);
  for (const leak of ["Concept: negative integers", "Suggested check-ins", "If you find this hard:", "Charlotte Pass (\u22128), Thredbo", "Sam moved the wrong way", "Which is greater, \u22129 or \u22122, and how do you know?"]) ok(!b7.includes(leak), "y7 child page leaks: " + leak);
  await cp.screenshot({ path: `${SHOTS}/year7-lesson-child-mobile.png`, fullPage: true });
  const raw7 = JSON.stringify((await api("GET", `/assignments/${asg7.json.id}`, tok)).json);
  for (const leak of ["teaching_plan", "teaching_questions", "parent_script", "Charlotte Pass (\u22128), Thredbo (\u22125)"]) ok(!raw7.includes(leak), "y7 API leaks " + leak);

  // wide editor + side by side preview on desktop
  await page.goto(BASE + `/parent/lessons/${les.json.id}/edit`);
  await page.click("[data-testid=split-tab]");
  const w = await page.evaluate(() => document.querySelector("[data-testid=lesson-builder]").getBoundingClientRect().width);
  ok(w > 950, "builder is still a narrow column: " + w);
  await page.waitForSelector("[data-testid=builder-preview]");
  await page.screenshot({ path: `${SHOTS}/builder-split-desktop.png` });

  // Zero-burden flow: server routes are honest without AI; the one-box page, review page and print page work.
  for (const [path, body] of [["/ai/lesson-refine", { lesson_id: les.json.id, instruction: "Make it easier" }], ["/ai/series-plan", { request: "four science lessons about the solar system" }]]) {
    const x = await api("POST", path, pt, body);
    ok(x.status === 503 && x.json.code === "AI_UNAVAILABLE", `expected honest AI_UNAVAILABLE from ${path}, got ${x.status}`);
  }
  const link = await api("POST", "/ai/lesson-draft", pt, { request: "https://example.com/some-page" });
  ok(link.status === 400 && link.json.code === "LINK_NOT_READ", "links are not pretended to be read: " + link.status);
  // Video suggestions: honest without a YouTube key; parent-only; a bad link is refused; the lesson never depends on it.
  const rst = await api("GET", "/resources/status", pt);
  ok(rst.status === 200 && rst.json.configured === false, "resource status: " + JSON.stringify(rst.json));
  const rsg = await api("POST", "/resources/suggest", pt, { lesson_id: les.json.id });
  ok(rsg.status === 503 && rsg.json.code === "YT_UNAVAILABLE", "suggest without key: " + rsg.status);
  ok((await api("POST", "/resources/verify-link", pt, { url: "https://example.com/x" })).status === 400, "non-YouTube link accepted");
  ok((await api("POST", "/resources/suggest", tok, { lesson_id: les.json.id })).status === 403, "child can search videos");
  ok((await api("GET", "/resources/status", tok)).status === 403, "child read resource status");
  // Outcome matching: free plans get the plain wording match; it is honest about which curriculum it knows; children cannot use it.
  const mo = await api("POST", `/lessons/${les.json.id}/match-outcomes`, pt);
  ok(mo.status === 200 && mo.json.method === "wording" && /NSW/.test(mo.json.framework) && Array.isArray(mo.json.suggestions), "outcome match: " + JSON.stringify(mo.json).slice(0, 200));
  ok((await api("POST", `/lessons/${les.json.id}/match-outcomes`, tok)).status === 403, "child can match outcomes");
  ok((await api("POST", `/lessons/nope/match-outcomes`, pt)).status === 404, "unknown lesson outcome match");
  await page.goto(BASE + "/parent/lessons/make");
  await page.waitForSelector("[data-testid=make-for-me]");
  await page.click("[data-testid=mk-example] >> nth=0");
  await page.selectOption("[data-testid=mk-child]", ch.json.id).catch(() => {});
  await page.click("[data-testid=mk-go]");
  await page.waitForSelector("[data-testid=mk-error]", { timeout: 20000 });
  ok((await page.textContent("[data-testid=mk-error]")).includes("not switched on"), "make page shows an honest error");
  await page.screenshot({ path: `${SHOTS}/make-lesson-desktop.png` });
  await page.goto(BASE + `/parent/lessons/${les.json.id}/review`);
  await page.waitForSelector("[data-testid=review-actions]");
  const rv = await page.textContent("[data-testid=lesson-document]");
  ok(rv.includes("Worked examples") && rv.includes("Hook (0 to 5 min)") && rv.includes("Answer:"), "review shows teaching, guide and answers to the parent");
  for (const t of ["r-assign", "r-refine", "r-edit", "r-later", "r-print"]) ok(await page.isVisible(`[data-testid=${t}]`), "missing button " + t);
  await page.click("[data-testid=r-refine]");
  await page.click("[data-testid=refine-chip] >> nth=0");
  await page.click("[data-testid=refine-go]");
  await page.waitForSelector("[data-testid=refine-error]", { timeout: 20000 });
  await page.screenshot({ path: `${SHOTS}/review-desktop.png`, fullPage: true });
  await page.goto(BASE + `/print/lesson/${les.json.id}`);
  await page.waitForSelector("[data-testid=print-page]");
  const ws = await page.textContent("[data-testid=lesson-document]");
  ok(ws.includes("Name:") && !ws.includes("Hook (0 to 5 min)") && !ws.includes("Sam forgot to regroup") && !ws.includes("63. Tens: 30") && !ws.includes("If your child finds regrouping hard"), "printed worksheet has no answers or parent guide");
  await page.screenshot({ path: `${SHOTS}/print-worksheet.png`, fullPage: true });
  await mctx.close(); await pctx.close();
});

await step("AI lesson set: open, edit, assign, move around and refresh without losing any of the five drafts", async () => {
  // AI is not connected in CI, so five written lessons are seeded as one set exactly as the generator leaves them.
  const GARDEN = JSON.parse(readFileSync(resolve(ROOT, "frontend/src/data/exampleLesson.json"), "utf8"));
  const email = `set-${stamp}@example.com`;
  const reg = await api("POST", "/auth/register", null, { name: "Set Fam", email, password: pw, jurisdiction: "NSW" });
  const pt = reg.json.token;
  const fam = JSON.parse(Buffer.from(pt.split(".")[1], "base64url").toString()).family_id;
  sql(`UPDATE families SET plan='ACTIVE_MONTHLY' WHERE id='${fam}';`);
  const ch = await api("POST", "/students", pt, { name: "Ivy", username: `iv${stamp}`.slice(0, 14), pin: "4321", stage: "S3" });
  ok(ch.status === 200, "child " + ch.status);
  const ids = [];
  for (let i = 1; i <= 5; i++) {
    const l = await api("POST", "/lessons", pt, { ...GARDEN, title: `Planets ${i}`, status: "draft" });
    ok(l.status === 200, "seed lesson " + l.status); ids.push(l.json.id);
  }
  const bid = `e2e-set-${stamp}`, ts = new Date().toISOString();
  sql(`INSERT INTO lesson_batches (id, family_id, student_id, title, request, created_at, updated_at) VALUES ('${bid}', '${fam}', '${ch.json.id}', 'Our Solar System', '{}', '${ts}', '${ts}');`);
  sql(`INSERT INTO lesson_batch_items (batch_id, idx, family_id, title, goal, status, lesson_id, updated_at) VALUES ${ids.map((id, i) => `('${bid}', ${i}, '${fam}', 'Planets ${i + 1}', 'Goal', 'done', '${id}', '${ts}')`).join(", ")};`);
  const states = async () => Promise.all([0, 1, 2, 3, 4].map(i => page.textContent(`[data-testid=draft-state-${i}]`)));

  const pctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await pctx.newPage();
  await page.goto(BASE + "/login");
  await page.fill('[data-testid=login-email]', email); await page.fill('[data-testid=login-password]', pw);
  await page.click('[data-testid=login-submit]'); await page.waitForURL("**/parent");
  await page.waitForSelector("[data-testid=drafts-awaiting]");
  ok((await page.textContent("[data-testid=drafts-awaiting-count]")).trim() === "5", "Parent Hub count before");
  await page.click("[data-testid=drafts-awaiting-link]");
  await page.waitForSelector("[data-testid=lesson-drafts]");
  ok((await page.textContent("[data-testid=drafts-heading]")).includes("5 Lessons"), "set heading");
  ok((await states()).every(s => s.includes("Ready for review")), "all five ready: " + (await states()).join("|"));

  // 1-3. open Lesson 1, edit it, save
  await page.click("[data-testid=draft-review-0]");
  await page.waitForSelector("[data-testid=batch-nav]");
  ok((await page.textContent("[data-testid=batch-nav-pos]")).includes("Lesson 1 of 5"), "position on lesson 1");
  await page.click("[data-testid=r-edit]");
  await page.waitForSelector("[data-testid=builder-batch-links]");
  await page.fill("[data-testid=b-title]", "Planets 1 — my version");
  await page.click("[data-testid=b-save-draft]");
  await page.waitForFunction(() => !document.querySelector("[data-testid=save-state]")?.textContent.includes("Unsaved"));
  // 4. back to the lesson, approve and assign it to Ivy; the parent lands back on the set
  await page.click("[data-testid=builder-batch-links] a >> nth=0");
  await page.waitForSelector("[data-testid=review-actions]");
  await page.click("[data-testid=r-assign]");
  await page.waitForSelector("[data-testid=schedule-modal]");
  await page.check(`[data-testid=sch-student-${ch.json.id}]`);
  await page.click("[data-testid=sch-submit]");
  // 5. back on the remaining drafts
  await page.waitForSelector("[data-testid=lesson-drafts]");
  await page.waitForFunction(() => document.querySelector("[data-testid=draft-state-0]")?.textContent.includes("Assigned"));
  ok((await page.textContent("[data-testid=draft-row-0]")).includes("Planets 1 — my version"), "edit not kept");
  // 6. open Lesson 3, and step forward to check the next link
  await page.click("[data-testid=draft-review-2]");
  await page.waitForSelector("[data-testid=batch-nav-pos]");
  ok((await page.textContent("[data-testid=batch-nav-pos]")).includes("Lesson 3 of 5"), "position on lesson 3");
  await page.click("[data-testid=batch-nav-next]");
  await page.waitForFunction(() => document.querySelector("[data-testid=batch-nav-pos]")?.textContent.includes("Lesson 4 of 5"));
  // the next lesson gets its own video panel, not the previous lesson's
  await page.waitForSelector("[data-testid=video-suggestions]");
  await page.waitForFunction(() => document.querySelector("[data-testid=review-assumptions]")?.textContent.includes("Made for Ivy"), null, { timeout: 15000 }).catch(() => { throw new Error("next lesson lost its context"); });
  const vid = await api("GET", `/lessons/${ids[3]}`, pt);
  ok((await api("PUT", `/lessons/${ids[3]}`, pt, { ...vid.json, resources: [{ type: "video", title: "Planets", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }] })).status === 200, "add video");
  // 7-8. away to the Parent Hub and back into the drafts
  await page.click("[data-testid=nav-dashboard] >> visible=true");
  await page.waitForSelector("[data-testid=drafts-awaiting]");
  ok((await page.textContent("[data-testid=drafts-awaiting-count]")).trim() === "4", "Parent Hub count after assigning one");
  await page.click("[data-testid=drafts-awaiting-link]");
  await page.waitForSelector("[data-testid=lesson-drafts]");
  // 9-10. open Lesson 2 and refresh the browser
  await page.click("[data-testid=draft-review-1]");
  await page.waitForSelector("[data-testid=batch-nav-pos]");
  await page.reload();
  await page.waitForSelector("[data-testid=batch-nav-pos]");
  ok((await page.textContent("[data-testid=batch-nav-pos]")).includes("Lesson 2 of 5"), "set lost after refresh");
  await page.waitForSelector("[data-testid=video-suggestions]");
  await page.waitForFunction(() => document.querySelector("[data-testid=review-assumptions]")?.textContent.includes("Made for Ivy"), null, { timeout: 15000 }).catch(() => { throw new Error("lesson context lost after refresh"); });
  await page.click("[data-testid=batch-nav-all]");
  await page.waitForSelector("[data-testid=lesson-drafts]");
  const s = await states();
  ok(s[0].includes("Assigned") && [1, 2, 4].every(i => s[i].includes("Ready for review")) && s[3].includes("Edited"), "final states: " + s.join("|"));
  ok((await page.textContent("[data-testid=draft-row-0]")).includes("Planets 1 — my version"), "edit lost after refresh");
  ok((await page.textContent("[data-testid=draft-videos-3]")).includes("1 video"), "video on lesson 4 not shown on the set");
  ok((await page.textContent("[data-testid=draft-videos-1]")).includes("No video yet"), "lesson 2 video status");
  await shot("ai-set-after-refresh", page);
  // nothing duplicated
  const lessons = (await api("GET", "/lessons", pt)).json;
  ok(lessons.length === 5, "lessons now " + lessons.length);
  ok(lessons.find(l => l.id === ids[0]).title === "Planets 1 — my version", "edit not saved on the server");
  const asg = (await api("GET", "/assignments", pt)).json;
  ok(asg.length === 1 && asg[0].lesson_id === ids[0], "assignments: " + asg.length);

  // A set where one lesson failed and one was never started: the good lesson stays usable, the failure is shown with a retry,
  // and the unstarted one is picked up automatically (here AI is off, so it fails honestly instead of disappearing).
  const bid2 = `e2e-set2-${stamp}`;
  sql(`INSERT INTO lesson_batches (id, family_id, student_id, title, request, created_at, updated_at) VALUES ('${bid2}', '${fam}', NULL, 'Fractions set', '{"request":"three fractions lessons"}', '${ts}', '${ts}');`);
  sql(`INSERT INTO lesson_batch_items (batch_id, idx, family_id, title, goal, status, lesson_id, error, updated_at) VALUES ('${bid2}', 0, '${fam}', 'Halves', '', 'done', '${ids[4]}', NULL, '${ts}'), ('${bid2}', 1, '${fam}', 'Quarters', '', 'failed', NULL, 'The AI service did not respond.', '${ts}'), ('${bid2}', 2, '${fam}', 'Eighths', '', 'pending', NULL, NULL, '${ts}');`);
  await page.goto(BASE + `/parent/lessons/drafts/${bid2}`);
  await page.waitForSelector("[data-testid=draft-retry-1]");
  ok(await page.isVisible("[data-testid=draft-review-0]"), "good lesson hidden by a failed one");
  await page.waitForFunction(() => document.querySelector("[data-testid=draft-state-2]")?.textContent.includes("Failed"), null, { timeout: 30000 });
  ok((await page.textContent("[data-testid=draft-error-2]")).includes("not switched on"), "unstarted lesson error: " + await page.textContent("[data-testid=draft-row-2]"));
  ok((await api("GET", "/lessons", pt)).json.length === 5, "failed lessons created rows");
  await shot("ai-set-partial", page);
  await pctx.close();
});

await step("L. users cannot grant themselves a paid plan", async () => {
  const r = await api("PUT", "/account/plan", parentToken, { plan: "ACTIVE_MONTHLY" });
  ok(r.status === 404 || r.status === 405, "plan update route exists: " + r.status);
  const r2 = await api("POST", "/auth/register", null, { name: "Sneaky", email: `family3-${stamp}@example.com`, password: pw, jurisdiction: "NSW", plan: "ACTIVE_ANNUAL" });
  const p = await api("GET", "/account/plan", r2.json.token);
  ok(p.json.effective_plan === "FREE_PREVIEW", "plan set from request body");
});

await step("M. expired preview: cannot create or assign, but nothing is lost", async () => {
  const fam = JSON.parse(Buffer.from(parentToken.split(".")[1], "base64url").toString()).family_id;
  sql(`UPDATE families SET trial_started_at='2020-01-01T00:00:00Z', trial_ends_at='2020-01-08T00:00:00Z' WHERE id='${fam}';`);
  const p = await api("GET", "/account/plan", parentToken);
  ok(p.json.effective_plan === "PREVIEW_EXPIRED", "not expired: " + p.json.effective_plan);
  ok((await api("POST", "/lessons", parentToken, { title: "after", status: "draft" })).status === 402, "can create after expiry");
  const kids = await api("GET", "/students", parentToken);
  ok((await api("POST", "/assignments", parentToken, { student_id: kids.json[0].id, lesson_id: lessonId })).status === 402, "can assign after expiry");
  ok((await api("GET", "/lessons", parentToken)).json.some(l => l.id === lessonId), "remaining lesson not readable after expiry");
  ok((await api("GET", "/dashboard/child", childToken)).json.xp >= xp0 + 45, "child progress lost");
  await page.goto(BASE + "/parent/lessons"); await page.waitForSelector('[data-testid=expired-banner]');
  await shot("expired");
});

await step("plan page explains the preview and that billing is not open", async () => {
  await page.goto(BASE + "/parent/plan"); await page.waitForSelector('[data-testid=billing-status]');
  const t = await page.textContent("body");
  ok(t.includes("not open yet") && t.includes("Free preview"), "plan page content");
});

await step("N. mobile layouts of the main parent pages do not overflow", async () => {
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mp = await mctx.newPage();
  await mp.goto(BASE + "/login");
  await mp.fill('[data-testid=login-email]', email1); await mp.fill('[data-testid=login-password]', pw);
  await mp.click('[data-testid=login-submit]'); await mp.waitForURL("**/parent");
  for (const path of ["/parent", "/parent/lessons", "/parent/lessons/new", "/parent/children"]) {
    await mp.goto(BASE + path); await mp.waitForLoadState("networkidle");
    await noOverflow(mp, path);
    const mw = await mp.evaluate(() => document.querySelector("main").getBoundingClientRect().width);
    ok(mw >= 340, `${path}: main content is only ${Math.round(mw)}px wide on a phone`);
    await mp.screenshot({ path: `${SHOTS}/mobile-${path.replace(/\W+/g, "_")}.png`, fullPage: true });
  }
});

ok(true);
console.log("\nHTTP errors seen by browsers:\n" + badResponses.slice(0, 40).join("\n"));
console.log("\nbrowser errors (parent):", JSON.stringify(pageErrors.slice(0, 5)));
console.log("browser errors (child):", JSON.stringify(cErrors.slice(0, 5)));
await browser.close(); stop();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} steps passed`);
console.log("\n--- server log tail ---\n" + slog.slice(-1500));
process.exit(failed.length ? 1 : 0);
