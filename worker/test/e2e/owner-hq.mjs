// Owner HQ end to end: real local Worker + local D1 + the built frontend, driven through Chromium.
// The Owner is promoted with the real promotion script (against the LOCAL database), and Chromium's virtual WebAuthn
// authenticator stands in for Touch ID / Face ID. Never touches production.
//   PW_PATH=<playwright index.mjs> node worker/test/e2e/owner-hq.mjs
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL("../../../", import.meta.url).pathname);
const STATE = "/tmp/e2e-owner-hq-state";
const CONFIG = "wrangler.hq-e2e.jsonc";
const PORT = 8788;
// WebAuthn needs a domain, not an IP address, as the relying party: the browser uses localhost.
const BASE = `http://localhost:${PORT}`;
const NODE_BASE = `http://127.0.0.1:${PORT}`;
const SHOTS = resolve(ROOT, "e2e-shots/owner-hq");
const { chromium } = await import(process.env.PW_PATH || "playwright");

const results = [];
let page;
const ok = (c, m) => { if (!c) throw new Error(m || "assertion failed"); };
const shot = async (name, p = page) => { try { await p.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true }); } catch { /* best effort */ } };
async function step(name, fn) {
  try { await fn(); results.push({ name, ok: true }); console.log(`PASS ${name}`); }
  catch (e) { results.push({ name, ok: false }); console.log(`FAIL ${name}\n     ${String(e.message || e).slice(0, 800)}`); await shot("FAIL-" + name.replace(/\W+/g, "-").slice(0, 40)); }
}

// ---- local stack
rmSync(STATE, { recursive: true, force: true });
rmSync(SHOTS, { recursive: true, force: true });
mkdirSync(SHOTS, { recursive: true });
writeFileSync(`${ROOT}/.dev.vars`, "JWT_SECRET=e2e-only-secret-not-for-production\n");
writeFileSync(`${ROOT}/${CONFIG}`, JSON.stringify({
  name: "side-quest-hq-e2e", main: "./worker/src/index.ts", compatibility_date: "2025-10-01",
  assets: { directory: "./frontend/build", not_found_handling: "single-page-application", run_worker_first: ["/api/*"] },
  d1_databases: [{ binding: "DB", database_name: "e2e-hq", database_id: "00000000-0000-0000-0000-000000000001", migrations_dir: "./worker/migrations" }],
}));
const wr = (args) => spawnSync("npx", ["wrangler", ...args, "--config", CONFIG, "--persist-to", STATE], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const mig = wr(["d1", "migrations", "apply", "DB", "--local"]);
if(mig.status !== 0) console.error("D1 migration error output:", (mig.stderr || "").slice(0,12000), (mig.stdout || "").slice(0,12000));
ok(mig.status === 0, "local migrations failed: " + (mig.stderr || mig.stdout).slice(-600));

const server = spawn("npx", ["wrangler", "dev", "--config", CONFIG, "--local", "--persist-to", STATE, "--port", String(PORT), "--ip", "127.0.0.1"], { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
let slog = "";
server.stdout.on("data", (d) => (slog += d)); server.stderr.on("data", (d) => (slog += d));
process.on("exit", () => { try { writeFileSync(`${SHOTS}/server.log`, slog.slice(-200000)); server.kill("SIGTERM"); } catch { /* ignore */ } });
for (let i = 0; i < 90; i++) {
  try { if ((await fetch(`${NODE_BASE}/api/health`)).ok) break; } catch { /* starting */ }
  await new Promise((r) => setTimeout(r, 1000));
  if (i === 89) { console.log(slog.slice(-2000)); throw new Error("server did not start"); }
}

const api = async (method, path, token, body, headers = {}) => {
  const r = await fetch(NODE_BASE + "/api" + path, { method, headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers }, body: body ? JSON.stringify(body) : undefined });
  let json = null; try { json = await r.json(); } catch { /* empty */ }
  return { status: r.status, json };
};
const stamp = Date.now();
const PW = "Passw0rd-hq-e2e!";
const ownerEmail = `owner-${stamp}@example.com`, userEmail = `family-${stamp}@example.com`;
const reg = async (email, name) => (await api("POST", "/auth/register", null, { email, password: PW, name, jurisdiction: "NSW" })).json;
const user = await reg(userEmail, "Ordinary Parent");
const owner = await reg(ownerEmail, "Owner Person");

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
page = await ctx.newPage();
const signIn = async (p, token) => { await p.goto(BASE + "/"); await p.evaluate((t) => localStorage.setItem("sq_token", t), token); await p.goto(BASE + "/parent"); await p.waitForSelector("[data-testid=parent-sidebar]"); };

await step("an ordinary parent never sees or reaches Owner HQ (UI and API)", async () => {
  await signIn(page, user.token);
  ok(await page.locator("[data-testid=nav-command-centre]").count() === 0, "nav link visible to a customer");
  await page.goto(BASE + "/parent/command-centre");
  await page.waitForURL((u) => u.pathname === "/parent", { timeout: 10000 });
  for (const path of ["/admin/overview", "/admin/me", "/admin/customers"]) ok((await api("GET", path, user.token)).status === 404, path);
  ok((await api("GET", "/admin/overview")).status === 404, "signed out");
});

await step("the promotion script refuses without a match, then promotes the Owner once (local database)", async () => {
  const run = (args, email) => spawnSync("node", ["worker/scripts/owner-promotion.mjs", ...args, "--local", "--config", CONFIG, "--persist-to", STATE],
    { cwd: ROOT, encoding: "utf8", env: { ...process.env, OWNER_EXPECTED_EMAIL: email } });
  const wrong = run(["preflight", "--user-id", owner.user.id], userEmail);
  ok(wrong.status === 1 && /does not match/.test(wrong.stdout), "mismatched email accepted: " + wrong.stdout);
  const pre = run(["preflight", "--user-id", owner.user.id], ownerEmail);
  ok(pre.status === 0 && /PREFLIGHT PASSED/.test(pre.stdout) && !pre.stdout.includes(ownerEmail), "preflight: " + pre.stdout + pre.stderr);
  const noConfirm = run(["apply", "--user-id", owner.user.id], ownerEmail);
  ok(noConfirm.status === 1, "applied without --confirm");
  const apply = run(["apply", "--user-id", owner.user.id, "--confirm", "PROMOTE"], ownerEmail);
  ok(apply.status === 0 && /APPLIED/.test(apply.stdout), "apply: " + apply.stdout + apply.stderr);
  const second = run(["apply", "--user-id", user.user.id, "--confirm", "PROMOTE"], userEmail);
  ok(second.status === 1 && /already holds the Owner role/.test(second.stdout), "a second Owner was allowed");
  ok(run(["verify", "--user-id", owner.user.id], ownerEmail).status === 0, "verify failed");
});

let cdp;
await step("Owner adds a passkey (password re-check) and unlocks HQ with it", async () => {
  cdp = await ctx.newCDPSession(page);
  await cdp.send("WebAuthn.enable");
  await cdp.send("WebAuthn.addVirtualAuthenticator", { options: { protocol: "ctap2", transport: "internal", hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true } });
  await signIn(page, owner.token);
  await page.click("[data-testid=nav-command-centre]");
  await page.waitForSelector("[data-testid=hq-enrol]");
  ok((await api("GET", "/admin/overview", owner.token)).status === 401, "overview open before step-up");
  await page.fill("[data-testid=hq-password]", "wrong-password");
  await page.click("[data-testid=hq-add-passkey]");
  await page.waitForSelector("text=That password is not right.");
  await page.fill("[data-testid=hq-password]", PW);
  await page.click("[data-testid=hq-add-passkey]");
  await page.waitForSelector("[data-testid=hq-locked]");
  await shot("01-locked");
  await page.click("[data-testid=hq-step-up]");
  await page.waitForSelector("[data-testid=hq-overview]");
  ok(/Families/.test(await page.textContent("[data-testid=stat-families]")), "stats missing");
  ok(await page.locator("[data-testid=not-configured]").count() >= 2, "unmeasured figures should say Not configured");
  await shot("02-overview-desktop");
});


// Reproduce the parent -> Owner HQ -> parent dashboard path in a REAL browser.
// Use separate browser contexts so the owner's and parent's localStorage cannot collide.
await step("feedback regression: parent sends, Owner replies, dashboard alerts and clears on read", async () => {
  const parentCtx=await browser.newContext({viewport:{width:1280,height:900}});
  const pp=await parentCtx.newPage();
  try {
    await signIn(pp,user.token);
    await pp.goto(BASE+"/parent/feedback");
    await pp.waitForSelector("[data-testid=parent-feedback-form]");
    await pp.fill("[data-testid=feedback-subject]","Feedback submission must still work");
    await pp.fill("[data-testid=feedback-message]","I am testing whether a report reaches Owner HQ with no issues.");
    await pp.click("[data-testid=feedback-submit]");
    await pp.waitForSelector("[data-testid=feedback-success]",{timeout:15000});
    const id=(await pp.locator("[data-testid=feedback-success] code").textContent()).trim();
    ok(id.length>10,"no successful submission ID");
    ok((await api("GET","/feedback",user.token)).json.reports.some(x=>x.id===id),"report was not saved");
    await page.click("[data-testid=hq-tab-feedback]");
    await page.waitForSelector("[data-testid=hq-feedback]");
    const item=page.locator('[data-testid="hq-feedback-item-'+id+'"]');
    await item.waitFor({timeout:15000});
    await item.click();
    await page.fill("[data-testid=hq-feedback-reply-message]","This is a response from Side-Quest. Your issue is resolved.");
    await page.click("[data-testid=hq-feedback-send-reply]");
    await page.waitForSelector("[data-testid=hq-feedback-reply-sent]",{timeout:15000});
    await pp.goto(BASE+"/parent");
    await pp.waitForSelector("[data-testid=dashboard-feedback-reply-alert]",{timeout:15000});
    ok((await pp.textContent("[data-testid=dashboard-feedback-reply-alert]")).includes("Side-Quest has reported back"),"dashboard alert missing");
    await pp.click("[data-testid=dashboard-feedback-open-reply]");
    const thread=pp.locator('[data-testid="parent-feedback-thread-'+id+'"]');
    await thread.waitFor({timeout:15000});
    ok((await thread.textContent()).includes("Your issue is resolved"),"deep link missed owner's reply");
    await pp.waitForFunction(async()=>{
      const token=localStorage.getItem("sq_token");
      const r=await fetch("/api/feedback/unread-count",{headers:{Authorization:"Bearer "+token}});
      return r.ok && (await r.json()).unread===0;
    },null,{timeout:15000});
    await pp.goto(BASE+"/parent");
    await pp.waitForSelector("[data-testid=parent-dashboard]",{timeout:15000});
    ok((await pp.locator("[data-testid=dashboard-feedback-reply-alert]").count())===0,"read reply left a permanent alert");
  } finally { await parentCtx.close(); }
});


await step("announcement composer previews active parent count, but never sends without email binding and confirmation",async()=>{
  await page.click("[data-testid=hq-tab-announcements]");
  await page.waitForSelector("[data-testid=hq-announcements]");
  const parentCount=await api("GET","/admin/announcements",owner.token);
  ok(parentCount.status===200,"owner should see broadcast counts");
  ok(parentCount.json.service_recipients>=2,"registered families not included");
  await page.fill("[data-testid=hq-announcement-subject]","Important Side-Quest notice");
  await page.fill("[data-testid=hq-announcement-body]","Side-Quest will be undergoing routine maintenance. Your saved lessons will remain safe.");
  await page.click("[data-testid=hq-announcement-preview]");
  await page.waitForSelector("[data-testid=hq-announcement-send-confirm]");
  ok(await page.isDisabled("[data-testid=hq-announcement-send]"),"send should be disabled before confirmation and EMAIL binding");
  ok((await api("GET","/admin/announcements",user.token)).status===404,"ordinary parent can read Owner HQ announcements");
  const preference=await api("GET","/announcements/preferences",user.token);
  ok(preference.status===200 && preference.json.optional_announcements===false,"parent optional consent must be off by default");
});
await step("HQ layout fits phone, tablet and desktop without sideways scrolling", async () => {
  for (const [w, h, name] of [[375, 812, "phone"], [768, 1024, "tablet"], [1280, 900, "desktop"]]) {
    await page.setViewportSize({ width: w, height: h });
    for (const tab of ["overview", "customers", "settings", "audit", "security"]) {
      if (w < 1024) { await page.click("[data-testid=menu-toggle]"); await page.click("[data-testid=nav-command-centre]"); }
      await page.click(`[data-testid=hq-tab-${tab}]`);
      await page.waitForSelector(`[data-testid=hq-${tab}]`);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      ok(over <= 1, `${name} ${tab}: ${over}px sideways overflow`);
      if (tab === "overview" || tab === "settings") await shot(`03-${tab}-${name}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
});

await step("customers: find a family, see metadata only, suspend it with a reason, and it is locked out", async () => {
  await page.click("[data-testid=hq-tab-customers]");
  await page.fill("[data-testid=hq-customer-search]", userEmail);
  await page.keyboard.press("Enter");
  await page.waitForSelector("[data-testid=hq-customer-row]");
  await page.click("[data-testid=hq-customer-row]");
  await page.waitForSelector("[data-testid=hq-customer]");
  await page.click("[data-testid=hq-suspend]");
  await page.fill("[data-testid=confirm-reason]", "End-to-end test suspension");
  ok(await page.isDisabled("[data-testid=confirm-submit]"), "submit allowed before typing SUSPEND");
  await page.fill("[data-testid=confirm-word]", "SUSPEND");
  await page.click("[data-testid=confirm-submit]");
  await page.waitForSelector("[data-testid=hq-customer-status]:has-text('Suspended')");
  await shot("04-customer-suspended");
  ok((await api("GET", "/auth/me", user.token)).status === 403, "suspended family still signed in");
  ok((await api("POST", "/auth/login", null, { email: userEmail, password: PW })).status === 403, "suspended family can sign in");
  await page.click("[data-testid=hq-restore]");
  await page.fill("[data-testid=confirm-reason]", "Restored after the test");
  await page.click("[data-testid=confirm-submit]");
  await page.waitForSelector("[data-testid=hq-customer-status]:has-text('Active')");
  ok((await api("POST", "/auth/login", null, { email: userEmail, password: PW })).status === 200, "restored family cannot sign in");
});

await step("settings: announcement reaches everyone; switching AI off needs a second confirmation", async () => {
  await page.click("[data-testid=hq-tab-settings]");
  await page.check("[data-testid=hq-announcement-enabled]");
  await page.fill("[data-testid=hq-announcement-message]", "Welcome to term 4!");
  await page.click("[data-testid=hq-save-announcement]");
  await page.waitForSelector("text=Announcement saved");
  await page.uncheck("[data-testid=hq-feature-ai]");
  await page.click("[data-testid=hq-save-features]");
  await page.waitForSelector("[data-testid=hq-confirm-high-impact]");
  await page.click("[data-testid=hq-confirm-high-impact]");
  await page.waitForSelector("text=Feature switches saved");
  const other = await ctx.newPage();
  await other.goto(BASE + "/");
  await other.waitForSelector("[data-testid=announcement-notice]:has-text('Welcome to term 4!')");
  await shot("05-announcement", other);
  await other.close();
});

await step("audit log lists every change; cross-site requests are blocked", async () => {
  await page.click("[data-testid=hq-tab-audit]");
  await page.waitForSelector("[data-testid=hq-audit-entry]");
  const text = await page.textContent("[data-testid=hq-audit]");
  for (const label of ["Owner role granted", "Passkey added", "Family suspended", "Family restored", "Setting changed"]) ok(text.includes(label), "audit missing " + label);
  const blocked = await page.evaluate(async () => (await fetch("/api/admin/security/step-up/end", { method: "POST", headers: { authorization: `Bearer ${localStorage.getItem("sq_token")}` } })).status);
  ok(blocked === 403, "change without the admin header was not blocked: " + blocked);
});

await step("locking HQ requires the passkey again", async () => {
  await page.click("[data-testid=hq-lock]");
  await page.waitForSelector("[data-testid=hq-locked]");
  await page.click("[data-testid=hq-step-up]");
  await page.waitForSelector("[data-testid=hq-audit]");
  ok(await page.locator("[data-testid=hq-elevated]").count() === 1, "not unlocked");
});

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} Owner HQ steps passed`);
process.exit(failed.length ? 1 : 0);
