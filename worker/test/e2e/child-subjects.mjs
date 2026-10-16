// Add-student subjects end to end: each state's home-education subject rules in the Add student window (NSW
// Years 7-10 rules enforced, other states' year names and learning areas), and what is saved for the Outcome Tracker.
//   PW_PATH=<playwright index.mjs> node worker/test/e2e/child-subjects.mjs
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL("../../../", import.meta.url).pathname);
const STATE = "/tmp/e2e-child-subjects-state";
const CONFIG = "wrangler.subjects-e2e.jsonc";
const PORT = 8793;
const BASE = `http://localhost:${PORT}`;
const NODE_BASE = `http://127.0.0.1:${PORT}`;
const SHOTS = resolve(ROOT, "e2e-shots/child-subjects");
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
  name: "side-quest-subjects-e2e", main: "./worker/src/index.ts", compatibility_date: "2025-10-01",
  assets: { directory: "./frontend/build", not_found_handling: "single-page-application", run_worker_first: ["/api/*"] },
  d1_databases: [{ binding: "DB", database_name: "e2e-subjects", database_id: "00000000-0000-0000-0000-000000000006", migrations_dir: "./worker/migrations" }],
}));
const wr = (args) => spawnSync("npx", ["wrangler", ...args, "--config", CONFIG, "--persist-to", STATE], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 });
{ const m = wr(["d1", "migrations", "apply", "DB", "--local"]); ok(m.status === 0, "local migrations failed: " + (m.stderr || m.stdout || "").slice(-600)); }
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

const stamp = Date.now();
const PW = "Passw0rd-subjects!";
const browser = await chromium.launch();
let fams = 0;
async function familyPage(state) {
  const email = `subj-${state}-${stamp}-${++fams}@example.com`;
  const fam = (await api("POST", "/auth/register", null, { email, password: PW, name: "Parent", jurisdiction: state })).json;
  // Paid, so a family can have several children.
  wr(["d1", "execute", "DB", "--local", "--command", `UPDATE families SET plan = 'ACTIVE_MONTHLY', plan_period_end = '${new Date(Date.now() + 40 * 86400000).toISOString()}' WHERE id = '${fam.user.family_id}'`]);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/login");
  await p.fill("[data-testid=login-email]", email); await p.fill("[data-testid=login-password]", PW);
  await p.click("[data-testid=login-submit]"); await p.waitForURL("**/parent");
  await p.goto(BASE + "/parent/children");
  return { fam, ctx, p };
}
let n = 0;
async function openAdd(p, stage) {
  await p.click("[data-testid=add-student-btn]");
  n++;
  await p.fill("[data-testid=f-name]", `Kid ${n}`);
  await p.fill("[data-testid=f-username]", `subj${stamp}${n}`.slice(-16));
  await p.fill("[data-testid=f-pin]", "4321");
  await p.selectOption("[data-testid=f-stage]", stage);
  await p.waitForSelector("[data-testid=pattern-block]");
}
const saved = async (token, i) => (await api("GET", "/students", token)).json.find((s) => s.name === `Kid ${i}`);
const names = (s) => (s?.electives || []).map((e) => e.name);
const optionLabels = async (p, sel) => p.$$eval(`${sel} option`, (os) => os.map((o) => o.textContent));

await step("NSW Years 7–8: English, Maths, Science included; HSIE needs one; electives from two different areas", async () => {
  const { fam, ctx, p } = await familyPage("NSW");
  await openAdd(p, "S4");
  for (const r of ["English", "Mathematics", "Science"]) await p.waitForSelector(`[data-testid="req-${r}"]`);
  const hsie = await p.$$eval('[data-testid="group-HSIE: choose at least one"] [data-testid^=elect-]', (bs) => bs.map((b) => b.getAttribute("data-testid").slice(6)));
  ok(JSON.stringify(hsie) === JSON.stringify(["History", "Geography", "Commerce", "Aboriginal Studies", "History Elective", "Geography Elective", "Work Education"]), "HSIE options " + hsie);
  await p.click("[data-testid=submit-student]");
  await p.waitForSelector("text=at least one subject");
  await p.click('[data-testid="elect-History"]'); await p.click('[data-testid="elect-Geography"]'); await p.click('[data-testid="elect-Music"]'); await p.click('[data-testid="elect-Visual Arts"]');
  ok(/two different areas/.test(await p.textContent("[data-testid=plan-problem]")), "two Creative Arts subjects passed the two-area rule");
  await p.click('[data-testid="elect-Food Technology"]');
  await p.waitForSelector("text=Meets the subject rules");
  await shot("nsw-years-7-8", p);
  await p.click("[data-testid=submit-student]");
  await p.waitForSelector("text=Student added");
  const s = await saved(fam.token, n);
  ok(JSON.stringify(names(s)) === JSON.stringify(["English", "Mathematics", "Science", "History", "Geography", "Music", "Visual Arts", "Food Technology"]), "saved " + names(s));
  ok(s.electives.find((e) => e.name === "Food Technology").learning_area === "TAS", "NSW Technology should be saved under TAS");
  const t = await api("GET", `/outcomes/students/${s.id}`, fam.token);
  ok(t.status === 200 && t.json.areas.some((a) => a.subject === "History"), "tracker doesn't follow the chosen subjects: " + JSON.stringify(t.json.areas?.map((a) => a.subject)));
  await ctx.close();
});

await step("NSW Kindergarten: the six key learning areas are included and labelled Kindergarten", async () => {
  const { fam, ctx, p } = await familyPage("NSW");
  await openAdd(p, "ES1");
  ok((await optionLabels(p, "[data-testid=f-year]")).join() === "Kindergarten", "year label");
  ok((await optionLabels(p, "[data-testid=f-stage]"))[0] === "Early Stage 1 (Kindergarten)", "stage label");
  await p.click("[data-testid=submit-student]");
  await p.waitForSelector("text=Student added");
  ok(names(await saved(fam.token, n)).length === 6, "six areas not saved: " + names(await saved(fam.token, n)));
  await ctx.close();
});

await step("Victoria: Foundation naming; all eight areas included; choosing History narrows Humanities to History", async () => {
  const { fam, ctx, p } = await familyPage("VIC");
  await p.click("[data-testid=add-student-btn]");
  ok((await optionLabels(p, "[data-testid=f-stage]"))[0] === "Foundation", "VIC first year label " + (await optionLabels(p, "[data-testid=f-stage]"))[0]);
  await p.click("[data-testid=close-form]");
  await openAdd(p, "S4");
  ok(await p.locator("[data-testid^=req-]").count() === 8, "eight learning areas not all included");
  await p.click('[data-testid="elect-History"]');
  await p.click("[data-testid=submit-student]");
  await p.waitForSelector("text=Student added");
  const ns = names(await saved(fam.token, n));
  ok(ns.includes("History") && !ns.some((x) => /Humanities/.test(x)) && ns.length === 8, "VIC saved " + ns);
  await ctx.close();
});

await step("Queensland: no compulsory list, every area ticked to start, Prep naming; unticking is kept", async () => {
  const { fam, ctx, p } = await familyPage("QLD");
  await openAdd(p, "ES1");
  ok((await optionLabels(p, "[data-testid=f-year]")).join() === "Prep", "QLD first year");
  ok(await p.locator("[data-testid^=req-]").count() === 0, "QLD shows compulsory subjects");
  ok(await p.locator('[data-testid^=elect-][aria-pressed=true]').count() === 8, "not all areas ticked to start");
  await p.click('[data-testid="elect-Languages"]');
  await p.click("[data-testid=submit-student]");
  await p.waitForSelector("text=Student added");
  const ns = names(await saved(fam.token, n));
  ok(ns.length === 7 && !ns.includes("Languages"), "QLD saved " + ns);
  await shot("qld-prep", p);
  await ctx.close();
});

await step("other states' first-year names: WA Pre-primary, SA Reception, NT Transition, ACT Kindergarten, TAS Prep", async () => {
  for (const [state, label] of [["WA", "Pre-primary"], ["SA", "Reception"], ["NT", "Transition"], ["ACT", "Kindergarten"], ["TAS", "Prep"]]) {
    const { ctx, p } = await familyPage(state);
    await p.click("[data-testid=add-student-btn]");
    ok((await optionLabels(p, "[data-testid=f-stage]"))[0] === label, `${state} first year ${(await optionLabels(p, "[data-testid=f-stage]"))[0]}`);
    ok(!(await optionLabels(p, "[data-testid=f-stage]")).some((x) => /Stage \d/.test(x)), `${state} shows NSW stages`);
    await ctx.close();
  }
});

await step("editing a NSW Year 9 child: subjects can be added, and the rules are shown", async () => {
  const { fam, ctx, p } = await familyPage("NSW");
  const kid = (await api("POST", "/students", fam.token, { name: "Edit kid", username: `subjed${stamp}`.slice(-16), pin: "4321", stage: "S5", year_level: "9", electives: [{ name: "English", learning_area: "English" }, { name: "Mathematics", learning_area: "Mathematics" }, { name: "Science", learning_area: "Science" }, { name: "History", learning_area: "HSIE" }] })).json;
  await p.reload();
  await p.click(`[data-testid=edit-${kid.id}]`);
  await p.waitForSelector("[data-testid=edit-subjects]");
  await p.waitForSelector("[data-testid=edit-plan-problem]");
  await p.selectOption("[data-testid=subject-add-select]", { label: "Music" });
  await p.click("[data-testid=subject-add]");
  await p.selectOption("[data-testid=subject-add-select]", { label: "PDHPE" });
  await p.click("[data-testid=subject-add]");
  ok(await p.locator("[data-testid=edit-plan-problem]").count() === 0, "rule message still shown after meeting the rules");
  await p.click("[data-testid=edit-save]");
  await p.waitForSelector("[data-testid=edit-dialog]", { state: "detached" });
  const s = (await api("GET", "/students", fam.token)).json.find((x) => x.id === kid.id);
  ok(names(s).join() === "English,Mathematics,Science,History,Music,PDHPE", "edit saved " + names(s));
  await ctx.close();
});

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} child-subject steps passed`);
process.exit(failed.length ? 1 : 0);
