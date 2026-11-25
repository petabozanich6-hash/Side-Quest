// Owner HQ, end to end through the real Worker (index.ts) against the real migrations on SQLite (fakeD1).
// Passkeys use a software authenticator, so SimpleWebAuthn's real signature checks run.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sign } from "hono/jwt";
import { makeDb } from "./fakeD1.mjs";
import { createSoftAuthenticator } from "./softAuthenticator.mjs";
import worker from "../src/index.ts";
import { OWNER_SCHEMA, ensureOwnerSchema, resetOwnerSchemaFlag } from "../src/ownerSchema.ts";
import { applyPlatformSettings, clearSettingsCache, clearUsageCache, validateSetting } from "../src/platformSettings.ts";
import { allowedOrigin } from "../src/adminRoutes.ts";
import { evaluate, grantSql, maskEmail, OWNERS_SQL } from "../scripts/owner-promotion.mjs";

const ORIGIN = "http://localhost:8787";
const PW = "Correct-horse-9";
const SECRET = "ZZ-PRIVATE-CONTENT-ZZ";

function harness() {
  const db = makeDb();
  const env = { DB: db, JWT_SECRET: "test-only-secret" };
  clearSettingsCache();
  clearUsageCache();
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  async function req(path, { method = "GET", token, body, admin = true, origin = ORIGIN, headers = {} } = {}) {
    const h = { "content-type": "application/json", ...headers };
    if (token) h.authorization = `Bearer ${token}`;
    if (method !== "GET") {
      if (admin) h["x-sidequest-admin"] = "1";
      if (origin) h.origin = origin;
    }
    const r = await worker.fetch(new Request(ORIGIN + "/api" + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined }), env, ctx);
    let json = null;
    try { json = await r.json(); } catch { /* empty */ }
    return { status: r.status, json, headers: r.headers };
  }
  async function register(email, name = "Parent") {
    const r = await req("/auth/register", { method: "POST", admin: false, body: { email, password: PW, name, jurisdiction: "NSW" } });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    return { token: r.json.token, id: r.json.user.id, familyId: r.json.user.family_id, email };
  }
  const login = async (email) => (await req("/auth/login", { method: "POST", admin: false, body: { email, password: PW } }));
  const makeOwner = (userId) => db.raw.prepare("INSERT INTO user_roles (id, user_id, role, granted_by, reason) VALUES (?, ?, 'owner', 'test', 'test')").run(crypto.randomUUID(), userId);
  async function addChild(parent, username) {
    const r = await req("/students", { method: "POST", token: parent.token, admin: false, body: { name: "Mia " + SECRET, username, pin: "4321", stage: "S2" } });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    const l = await req("/auth/child-login", { method: "POST", admin: false, body: { username, pin: "4321" } });
    assert.equal(l.status, 200);
    return { id: r.json.id, token: l.json.token };
  }
  return { db, env, req, register, login, makeOwner, addChild };
}

/** Enrols a passkey (password re-check) and steps up. Returns the authenticator. */
async function stepUp(h, owner, auth) {
  auth ??= await createSoftAuthenticator();
  const status = await h.req("/admin/security/status", { token: owner.token });
  if (status.json.passkey_count === 0) {
    const o = await h.req("/admin/security/passkeys/register/options", { method: "POST", token: owner.token, body: { password: PW } });
    assert.equal(o.status, 200, JSON.stringify(o.json));
    const v = await h.req("/admin/security/passkeys/register/verify", { method: "POST", token: owner.token, body: { response: auth.register(o.json.options, ORIGIN), label: "Laptop" } });
    assert.equal(v.status, 201, JSON.stringify(v.json));
  }
  const a = await h.req("/admin/security/step-up/options", { method: "POST", token: owner.token });
  assert.equal(a.status, 200, JSON.stringify(a.json));
  const r = await h.req("/admin/security/step-up/verify", { method: "POST", token: owner.token, body: { response: await auth.authenticate(a.json.options, ORIGIN, "localhost") } });
  assert.equal(r.status, 200, JSON.stringify(r.json));
  return auth;
}

async function ownerSetup() {
  const h = harness();
  const owner = await h.register("owner@example.com", "Owner");
  h.makeOwner(owner.id);
  return { h, owner };
}

// ------------------------------------------------------------------ schema

test("schema: migration 0060 is exactly the runtime schema, idempotent, and grants no one anything", async () => {
  const file = readFileSync(new URL("../migrations/0060_owner_hq.sql", import.meta.url), "utf8");
  const body = file.split("\n").filter((l) => !l.startsWith("--")).join("\n").trim();
  assert.equal(body, OWNER_SCHEMA.map((s) => s + ";").join("\n\n"));
  const db = makeDb("0060");
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at) VALUES ('f','F','u','2026-01-01')").run();
  resetOwnerSchemaFlag();
  await ensureOwnerSchema(db);
  db.raw.exec(file); // the migration after the runtime ensure must still apply cleanly
  resetOwnerSchemaFlag();
  await ensureOwnerSchema(db);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM user_roles").get().n, 0);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM family_admin_state").get().n, 0, "existing families need no row to stay active");
  assert.deepEqual(db.raw.prepare("SELECT name FROM roles").all().map((r) => r.name), ["owner"]);
  const migrated = makeDb();
  const cols = (d, t) => d.raw.prepare(`SELECT name, type, "notnull", dflt_value FROM pragma_table_info('${t}') ORDER BY cid`).all();
  for (const t of ["user_roles", "family_admin_state", "webauthn_credentials", "admin_step_up", "platform_settings", "app_errors"]) assert.deepEqual(cols(db, t), cols(migrated, t), t);
});

test("no API can grant roles: the only INSERT INTO user_roles is the promotion script", () => {
  const src = ["index.ts", "adminRoutes.ts", "access.ts", "adminData.ts", "session.ts", "family.ts", "account.ts"].map((f) => readFileSync(new URL(`../src/${f}`, import.meta.url), "utf8")).join("\n");
  assert.ok(!/INSERT[^;]*user_roles/i.test(src));
  assert.ok(!/UPDATE\s+user_roles/i.test(src));
});

// ------------------------------------------------------------- authorisation

test("authz: everyone but the Owner gets 404 from every admin endpoint, including the INTERNAL plan", async () => {
  const h = harness();
  const parent = await h.register("parent@example.com");
  const internal = await h.register("internal@example.com");
  h.db.raw.prepare("UPDATE families SET plan = 'INTERNAL' WHERE id = ?").run(internal.familyId);
  const child = await h.addChild(parent, "mia1");
  const revoked = await h.register("revoked@example.com");
  h.makeOwner(revoked.id);
  h.db.raw.prepare("UPDATE user_roles SET revoked_at = '2026-01-01' WHERE user_id = ?").run(revoked.id);
  const paths = [["GET", "/admin/me"], ["GET", "/admin/overview"], ["GET", "/admin/customers"], ["GET", `/admin/customers/${parent.familyId}`],
    ["POST", `/admin/customers/${parent.familyId}/suspend`], ["PUT", "/admin/settings/features"], ["GET", "/admin/audit"],
    ["POST", "/admin/security/passkeys/register/options"], ["GET", "/admin/nonexistent"]];
  for (const token of [undefined, "garbage", parent.token, internal.token, child.token, revoked.token]) {
    for (const [method, path] of paths) {
      const r = await h.req(path, { method, token, body: method === "GET" ? undefined : {} });
      assert.equal(r.status, 404, `${method} ${path} ${String(token).slice(0, 8)} -> ${r.status}`);
      assert.deepEqual(r.json, { detail: "Not found" });
    }
  }
  for (const u of [parent, internal]) assert.equal((await h.req("/auth/me", { token: u.token })).json.is_platform_owner, undefined);
});

test("authz: the Owner sees the HQ link; tokens from before Owner HQ must sign in again; no CORS on admin", async () => {
  const { h, owner } = await ownerSetup();
  assert.equal((await h.req("/auth/me", { token: owner.token })).json.is_platform_owner, true);
  const freshOwnerLogin = await h.login(owner.email);
  assert.equal(freshOwnerLogin.status, 200);
  assert.equal(freshOwnerLogin.json.user.is_platform_owner, true, "Owner HQ navigation must show immediately on login");
  const ordinary = await h.register("hq-ordinary-login@example.com");
  const ordinaryLogin = await h.login(ordinary.email);
  assert.equal(ordinaryLogin.status, 200);
  assert.equal(ordinaryLogin.json.user.is_platform_owner, undefined, "ordinary parents must not see Owner navigation");
  const me = await h.req("/admin/me", { token: owner.token });
  assert.equal(me.status, 200);
  assert.deepEqual(me.json.roles, ["owner"]);
  assert.equal(me.json.elevated, false);
  assert.equal(me.headers.get("access-control-allow-origin"), null);
  assert.equal(me.headers.get("cache-control"), "no-store");
  assert.equal((await h.req("/health")).headers.get("access-control-allow-origin"), "*", "the rest of the API is unchanged");
  const legacy = await sign({ sub: owner.id, role: "parent", family_id: owner.familyId, exp: Math.floor(Date.now() / 1000) + 3600 }, h.env.JWT_SECRET);
  const r = await h.req("/admin/me", { token: legacy });
  assert.equal(r.status, 401);
  assert.equal(r.json.code, "fresh_sign_in_required");
  assert.equal((await h.req("/students", { token: legacy })).status, 200, "old tokens still work for the normal app");
});

// --------------------------------------------------------------------- CSRF

test("CSRF: changes need the admin header, this site's allow-listed Origin and a same-origin fetch", async () => {
  const { h, owner } = await ownerSetup();
  const path = "/admin/security/step-up/end";
  assert.equal((await h.req(path, { method: "POST", token: owner.token })).status, 200);
  assert.equal((await h.req(path, { method: "POST", token: owner.token, admin: false })).status, 403, "no header");
  assert.equal((await h.req(path, { method: "POST", token: owner.token, origin: "" })).status, 403, "no origin");
  assert.equal((await h.req(path, { method: "POST", token: owner.token, origin: "https://evil.example" })).status, 403, "foreign origin");
  assert.equal((await h.req(path, { method: "POST", token: owner.token, origin: "https://sidequestlearning.app" })).status, 403, "allow-listed but not this site");
  assert.equal((await h.req(path, { method: "POST", token: owner.token, headers: { "sec-fetch-site": "cross-site" } })).status, 403, "cross-site fetch");
  assert.equal(allowedOrigin("https://sidequestlearning.app", "https://sidequestlearning.app/api/admin/x", {}), true);
  assert.equal(allowedOrigin("https://side-quest-staging.x.workers.dev", "https://side-quest-staging.x.workers.dev/api/admin/x", {}), false);
  assert.equal(allowedOrigin("https://side-quest-staging.x.workers.dev", "https://side-quest-staging.x.workers.dev/api/admin/x", { ADMIN_ORIGINS: "https://side-quest-staging.x.workers.dev" }), true);
  assert.equal(allowedOrigin("http://sidequestlearning.app", "http://sidequestlearning.app/api/admin/x", {}), false);
});

test("rate limits: more than 30 changes in 5 minutes are refused with Retry-After", async () => {
  const { h, owner } = await ownerSetup();
  for (let i = 0; i < 30; i++) assert.equal((await h.req("/admin/security/step-up/end", { method: "POST", token: owner.token })).status, 200);
  const r = await h.req("/admin/security/step-up/end", { method: "POST", token: owner.token });
  assert.equal(r.status, 429);
  assert.ok(Number(r.headers.get("retry-after")) > 0);
});

// ---------------------------------------------------------------- passkeys

test("passkeys: first passkey needs the password; step-up opens HQ for this sign-in only", async () => {
  const { h, owner } = await ownerSetup();
  const over = await h.req("/admin/overview", { token: owner.token });
  assert.equal(over.status, 401);
  assert.equal(over.json.code, "step_up_required");
  assert.equal((await h.req("/admin/security/step-up/options", { method: "POST", token: owner.token })).json.code, "passkey_required");
  assert.equal((await h.req("/admin/security/passkeys/register/options", { method: "POST", token: owner.token, body: {} })).status, 401);
  assert.equal((await h.req("/admin/security/passkeys/register/options", { method: "POST", token: owner.token, body: { password: "wrong-password" } })).status, 401);
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM security_events WHERE event_type = 'reauth_failed'").get().n, 2);

  const auth = await stepUp(h, owner);
  assert.equal((await h.req("/admin/overview", { token: owner.token })).status, 200);
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM admin_audit_log WHERE action = 'passkey.register'").get().n, 1);

  // A second sign-in of the same account is not elevated.
  const again = (await h.login(owner.email)).json.token;
  assert.equal((await h.req("/admin/overview", { token: again })).status, 401);
  // Adding a further passkey needs an existing one first.
  assert.equal((await h.req("/admin/security/passkeys/register/options", { method: "POST", token: again, body: { password: PW } })).json.code, "step_up_required");
  await stepUp(h, { ...owner, token: again }, auth);
  assert.equal((await h.req("/admin/overview", { token: again })).status, 200);

  // Ending the step-up locks HQ again.
  await h.req("/admin/security/step-up/end", { method: "POST", token: again });
  assert.equal((await h.req("/admin/overview", { token: again })).status, 401);
});

test("passkeys: challenges are single-use and session-bound; another authenticator or origin is rejected", async () => {
  const { h, owner } = await ownerSetup();
  const auth = await stepUp(h, owner);
  await h.req("/admin/security/step-up/end", { method: "POST", token: owner.token });

  const opts = (await h.req("/admin/security/step-up/options", { method: "POST", token: owner.token })).json.options;
  const assertion = await auth.authenticate(opts, ORIGIN, "localhost");
  // Bound to the session: a different sign-in cannot use this challenge.
  const other = (await h.login(owner.email)).json.token;
  assert.equal((await h.req("/admin/security/step-up/verify", { method: "POST", token: other, body: { response: assertion } })).status, 401);
  assert.equal((await h.req("/admin/security/step-up/verify", { method: "POST", token: owner.token, body: { response: assertion } })).status, 200);
  // Single use: replaying the same assertion fails.
  assert.equal((await h.req("/admin/security/step-up/verify", { method: "POST", token: owner.token, body: { response: assertion } })).status, 401);

  // An unregistered authenticator fails.
  const stranger = await createSoftAuthenticator();
  const o2 = (await h.req("/admin/security/step-up/options", { method: "POST", token: other })).json.options;
  assert.equal((await h.req("/admin/security/step-up/verify", { method: "POST", token: other, body: { response: await stranger.authenticate(o2, ORIGIN, "localhost") } })).status, 401);
  // A phishing origin's assertion fails even with the right key.
  const o3 = (await h.req("/admin/security/step-up/options", { method: "POST", token: other })).json.options;
  assert.equal((await h.req("/admin/security/step-up/verify", { method: "POST", token: other, body: { response: await auth.authenticate(o3, "https://sidequest-learning.evil", "localhost") } })).status, 401);
  assert.ok(h.db.raw.prepare("SELECT COUNT(*) n FROM security_events WHERE event_type = 'step_up_failed'").get().n >= 3);
});

test("passkeys: the last passkey cannot be removed", async () => {
  const { h, owner } = await ownerSetup();
  await stepUp(h, owner);
  const list = await h.req("/admin/security/passkeys", { token: owner.token });
  assert.equal(list.json.passkeys.length, 1);
  assert.ok(!JSON.stringify(list.json).includes("public"), "public keys are not sent to the browser");
  assert.equal((await h.req(`/admin/security/passkeys/${list.json.passkeys[0].id}`, { method: "DELETE", token: owner.token })).status, 409);
});

// ----------------------------------------------------------- metrics, privacy

test("overview: real counts, and unmeasured things say so instead of inventing numbers", async () => {
  const { h, owner } = await ownerSetup();
  const parent = await h.register("parent@example.com");
  await h.addChild(parent, "mia2");
  h.db.raw.prepare("INSERT INTO app_errors (id, method, route, status, error_name) VALUES ('e1', 'GET', '/api/x/:id', 500, 'TypeError')").run();
  h.db.raw.prepare("INSERT INTO ai_usage (id, family_id, user_id, kind, status, created_at) VALUES ('a1', ?, ?, 'lesson_draft', 'done', ?)").run(parent.familyId, parent.id, new Date().toISOString());
  await stepUp(h, owner);
  const o = (await h.req("/admin/overview", { token: owner.token })).json;
  assert.equal(o.customers.families, 2);
  assert.equal(o.customers.child_profiles, 1);
  assert.equal(o.customers.new_families_7d, 2);
  assert.equal(o.customers.registrations_14d.length, 14);
  assert.equal(o.customers.registrations_14d.at(-1).families, 2);
  assert.equal(o.customers.active_users.configured, false);
  assert.equal(o.plans.by_effective_plan.FREE_PREVIEW, 2);
  assert.equal(o.plans.paying_families, 0);
  assert.equal(o.plans.revenue.configured, false);
  assert.equal(o.plans.stripe.configured, false);
  assert.equal(o.ai.configured, false, "no AI binding in this Worker");
  assert.equal(o.ai.requests_7d, 1);
  assert.equal(o.storage.configured, false);
  assert.equal(o.health.errors_24h, 1);
  assert.equal(o.health.top_error_routes_7d[0].route, "/api/x/:id");
  assert.equal(o.health.error_types_7d[0].error_name, "TypeError", "owner sees only recorded error class");
  assert.equal(o.health.review_storage.status, "ready", "real migration includes approval-critical columns");
  assert.deepEqual(o.health.review_storage.missing, []);
  assert.ok(o.health.warnings.some((w) => /server error/.test(w.message)));
});

test("owner can diagnose missing approval storage without exposing family records or changing data", async () => {
  const { h, owner } = await ownerSetup();
  const parent = await h.register("another@example.com");
  await h.addChild(parent, "missingapproval1");
  await stepUp(h, owner);
  const beforeChildren = h.db.raw.prepare("SELECT COUNT(*) n FROM students").get().n;
  const beforeSubmissions = h.db.raw.prepare("SELECT COUNT(*) n FROM submissions").get().n;
  h.db.raw.exec("DROP TABLE lesson_evidence");
  const response = await h.req("/admin/overview", { token: owner.token });
  assert.equal(response.status, 200);
  assert.equal(response.json.health.review_storage.status, "needs_attention");
  assert.ok(response.json.health.review_storage.missing.includes("lesson_evidence"));
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM students").get().n, beforeChildren);
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM submissions").get().n, beforeSubmissions);
  const health = JSON.stringify(response.json.health);
  assert.ok(!health.includes("Mia"), "health leaks no child names");
  assert.ok(!health.includes("another@example.com"), "health leaks no parent emails");
  assert.equal((await h.req("/admin/overview", { token: parent.token })).status, 404);
});

test("legacy evidence column appears as compatible, not fully repaired, in owner overview", async () => {
  const { h, owner } = await ownerSetup();
  await stepUp(h, owner);
  h.db.raw.exec("ALTER TABLE lesson_evidence DROP COLUMN file_ids");
  const response = await h.req("/admin/overview", { token: owner.token });
  assert.equal(response.status, 200);
  assert.equal(response.json.health.review_storage.status, "legacy_compatible");
  assert.deepEqual(response.json.health.review_storage.missing, ["lesson_evidence.file_ids"]);
});

test("privacy: customer list and detail carry metadata and counts only, never children's or private content", async () => {
  const { h, owner } = await ownerSetup();
  const parent = await h.register("family@example.com", "Parent " + SECRET);
  const child = await h.addChild(parent, "mia3");
  const ts = new Date().toISOString();
  h.db.raw.prepare("INSERT INTO lessons (id, family_id, title, stage, learning_area, status, data, created_at, updated_at) VALUES ('l1', ?, ?, 'S2', 'English', 'ready', ?, ?, ?)")
    .run(parent.familyId, "Lesson " + SECRET, JSON.stringify({ body: SECRET }), ts, ts);
  h.db.raw.prepare("INSERT INTO evidence_notes (id, family_id, student_id, title, notes, occurred_on, created_at) VALUES ('n1', ?, ?, ?, ?, '2026-10-01', ?)").run(parent.familyId, child.id, SECRET, SECRET, ts);
  await stepUp(h, owner);
  const list = await h.req("/admin/customers?q=family@", { token: owner.token });
  assert.equal(list.status, 200);
  assert.equal(list.json.total, 1);
  assert.equal(list.json.customers[0].children, 1);
  const detail = await h.req(`/admin/customers/${parent.familyId}`, { token: owner.token });
  assert.equal(detail.status, 200);
  assert.equal(detail.json.counts.lessons, 1);
  assert.equal(detail.json.counts.evidence_items, 1);
  assert.deepEqual(detail.json.children, { total: 1, by_stage: { S2: 1 } });
  for (const body of [list.json, detail.json]) {
    const text = JSON.stringify(body);
    for (const banned of [SECRET, "mia3", "password_hash", "pbkdf2", "pin_hash", "pin_enc", "4321", "interests"]) assert.ok(!text.includes(banned), `leaked ${banned}`);
  }
  // Search is parameterised and LIKE wildcards are literal.
  assert.equal((await h.req("/admin/customers?q=%25", { token: owner.token })).json.total, 0);
  assert.equal((await h.req("/admin/customers?q=' OR 1=1 --", { token: owner.token })).json.total, 0);
  assert.equal((await h.req("/admin/customers?plan=NOPE", { token: owner.token })).status, 400);
  assert.equal((await h.req("/admin/customers/does-not-exist", { token: owner.token })).status, 404);
});

test("customer detail works on the production users table, which has no oauth_provider column", async () => {
  const { h, owner } = await ownerSetup();
  const parent = await h.register("prod-shape@example.com");
  h.db.raw.exec("ALTER TABLE users DROP COLUMN oauth_provider");
  await stepUp(h, owner);
  const r = await h.req(`/admin/customers/${parent.familyId}`, { token: owner.token });
  assert.equal(r.status, 200, JSON.stringify(r.json));
  assert.equal(r.json.parents[0].sign_in, "password");
  assert.equal((await h.req("/admin/customers", { token: owner.token })).status, 200);
  assert.equal((await h.req("/admin/overview", { token: owner.token })).status, 200);
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM app_errors").get().n, 0);
});

// ------------------------------------------------------- customer actions

test("suspend / restore / sign out everywhere: confirmed, reasoned, enforced on every sign-in path, audited", async () => {
  const { h, owner } = await ownerSetup();
  const parent = await h.register("family@example.com");
  const child = await h.addChild(parent, "mia4");
  await stepUp(h, owner);
  const path = `/admin/customers/${parent.familyId}`;
  assert.equal((await h.req(`${path}/suspend`, { method: "POST", token: owner.token, body: { reason: "Chargeback abuse" } })).status, 400, "typed confirm");
  assert.equal((await h.req(`${path}/suspend`, { method: "POST", token: owner.token, body: { confirm: "SUSPEND", reason: "no" } })).status, 400, "reason");
  assert.equal((await h.req(`${path}/suspend`, { method: "POST", token: owner.token, body: { confirm: "SUSPEND", reason: "Repeated abuse reports" } })).status, 200);

  for (const t of [parent.token, child.token]) {
    const r = await h.req("/auth/me", { token: t });
    assert.ok(r.status === 401 || r.status === 403, `old session still works: ${r.status}`);
  }
  const relogin = await h.login(parent.email);
  assert.equal(relogin.status, 403);
  assert.equal(relogin.json.code, "ACCOUNT_SUSPENDED");
  assert.equal((await h.req("/auth/child-login", { method: "POST", admin: false, body: { username: "mia4", pin: "4321" } })).status, 403);
  assert.equal((await h.req(`${path}/suspend`, { method: "POST", token: owner.token, body: { confirm: "SUSPEND", reason: "Repeated abuse reports" } })).status, 409);

  assert.equal((await h.req(`${path}/restore`, { method: "POST", token: owner.token, body: { reason: "Resolved with the family" } })).status, 200);
  assert.equal((await h.req("/auth/me", { token: parent.token })).status, 401, "sessions from before the suspension stay signed out");
  const back = await h.login(parent.email);
  assert.equal(back.status, 200);
  assert.equal((await h.req("/auth/me", { token: back.json.token })).status, 200);

  assert.equal((await h.req(`${path}/sign-out-everywhere`, { method: "POST", token: owner.token, body: { reason: "Family reported a lost laptop" } })).status, 200);
  assert.equal((await h.req("/auth/me", { token: back.json.token })).status, 401);
  assert.equal((await h.login(parent.email)).status, 200, "sign-out is not a suspension");

  const actions = h.db.raw.prepare("SELECT action, actor_label, detail_json FROM admin_audit_log WHERE target_id = ? ORDER BY created_at").all(parent.familyId);
  assert.deepEqual(actions.map((a) => a.action), ["customer.suspend", "customer.restore", "customer.sign_out_everywhere"]);
  assert.equal(actions[0].actor_label, `owner:${owner.id}`);
  assert.equal(JSON.parse(actions[0].detail_json).reason, "Repeated abuse reports");
  const detail = (await h.req(path, { token: owner.token })).json;
  assert.deepEqual(detail.admin_history.map((a) => a.action), ["customer.sign_out_everywhere", "customer.restore", "customer.suspend"]);

  // The Owner's own family (and any family with an administrator) cannot be changed here.
  assert.equal((await h.req(`/admin/customers/${owner.familyId}/suspend`, { method: "POST", token: owner.token, body: { confirm: "SUSPEND", reason: "Testing myself" } })).status, 409);
  assert.equal((await h.req(`/admin/customers/${owner.familyId}/sign-out-everywhere`, { method: "POST", token: owner.token, body: { reason: "Testing myself" } })).status, 409);
});

test("free-preview gifts are Owner-only, passkey protected and audited; Hoard discount codes are retired", async () => {
  const { h, owner } = await ownerSetup();
  const family = await h.register("hoard-family@example.com");
  // The Dragon's Hoard discount codes are retired: those routes no longer exist for anyone.
  await stepUp(h, owner);
  assert.equal((await h.req("/admin/hoard", { token: owner.token })).status, 404);
  const giftPath = "/admin/customers/" + family.familyId + "/gift-preview";
  assert.equal((await h.req(giftPath, { method: "POST", token: owner.token, body: { confirm: "GIFT", days: 7, reason: "Generosity test" }, admin: false })).status, 403, "CSRF header required");
  assert.equal((await h.req(giftPath, { method: "POST", token: family.token, body: { confirm: "GIFT", days: 7, reason: "Not owner" } })).status, 404);
  assert.equal((await h.req(giftPath, { method: "POST", token: owner.token, body: { confirm: "GIFT", days: 7, reason: "no" } })).status, 400);
  assert.equal((await h.req(giftPath, { method: "POST", token: owner.token, body: { confirm: "GIFT", days: 7, reason: "Need a little more time" } })).status, 200);
  const changes = h.db.raw.prepare("SELECT action, detail_json FROM admin_audit_log WHERE target_id = ?").all(family.familyId);
  assert.equal(changes.length, 1);
  assert.equal(changes[0].action, "hoard.preview_gift");
  const familyPlan = await h.req("/account/plan", { token: family.token });
  assert.equal(familyPlan.status, 200);
  assert.equal(familyPlan.json.preview_gift.days, 7);
  assert.ok(!JSON.stringify(familyPlan.json.preview_gift).includes("Need a little more time"), "Owner's private reason cannot leak to families");
  assert.equal(JSON.parse(changes[0].detail_json).days, 7);
  assert.equal((await h.req("/admin/customers/" + owner.familyId + "/gift-preview", { method: "POST", token: owner.token, body: { confirm: "GIFT", days: 7, reason: "My account" } })).status, 409);
});

test("deleting a family still works with the new tables (no foreign key gets in the way)", async () => {
  const { h, owner } = await ownerSetup();
  const parent = await h.register("leaving@example.com");
  await stepUp(h, owner);
  await h.req(`/admin/customers/${parent.familyId}/sign-out-everywhere`, { method: "POST", token: owner.token, body: { reason: "Before deletion test" } });
  const token = (await h.login(parent.email)).json.token;
  const r = await h.req("/auth/delete-account", { method: "POST", token, admin: false, body: { confirm: "DELETE", password: PW } });
  assert.equal(r.status, 200, JSON.stringify(r.json));
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM families WHERE id = ?").get(parent.familyId).n, 0);
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM security_events WHERE family_id = ?").get(parent.familyId).n, 0);
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM admin_audit_log WHERE target_id = ?").get(parent.familyId).n, 1, "the audit trail is kept");
});

// ---------------------------------------------------------------- settings

test("settings: strict validation, confirmation for high-impact changes, audited, and actually enforced", async () => {
  const { h, owner } = await ownerSetup();
  await stepUp(h, owner);
  const put = (key, value, extra = {}) => h.req(`/admin/settings/${key}`, { method: "PUT", token: owner.token, body: { value, ...extra } });
  assert.equal((await put("nope", {})).status, 404);
  assert.equal((await put("announcement", { enabled: true, message: "<script>x</script>", tone: "info" })).status, 400);
  assert.equal((await put("announcement", { enabled: true, message: "x".repeat(281), tone: "info" })).status, 400);
  assert.equal((await put("announcement", { enabled: true, message: "", tone: "info" })).status, 400);
  assert.equal((await put("announcement", { enabled: true, message: "Hi", tone: "loud" })).status, 400);
  assert.equal((await put("features", { registrationsOpen: true, aiEnabled: true, videoSearch: true, extra: 1 })).status, 400);
  assert.equal((await put("costSafeguards", { aiDailyPlatformCap: 1e9 })).status, 400);
  assert.equal((await put("costSafeguards", { aiDailyPlatformCap: 1.5 })).status, 400);

  assert.equal((await put("announcement", { enabled: true, message: "New maths lessons are here", tone: "info" })).status, 200);
  const notices = (await h.req("/platform/notices")).json;
  assert.deepEqual(notices.announcement, { message: "New maths lessons are here", tone: "info" });
  assert.equal(notices.maintenance, null);

  const raise = await put("costSafeguards", { aiDailyPlatformCap: 9000 });
  assert.equal(raise.status, 409);
  assert.equal(raise.json.code, "confirmation_required");
  assert.ok(raise.json.reasons[0].includes("5000"));
  assert.equal((await put("costSafeguards", { aiDailyPlatformCap: 9000 }, { confirm_high_impact: true })).status, 200);

  const close = { registrationsOpen: false, aiEnabled: true, videoSearch: true };
  assert.equal((await put("features", close)).status, 409);
  assert.equal((await put("features", close, { confirm_high_impact: true })).status, 200);
  const reg = await h.req("/auth/register", { method: "POST", admin: false, body: { email: "new@example.com", password: PW, name: "New", jurisdiction: "NSW" } });
  assert.equal(reg.status, 503);
  assert.equal(reg.json.code, "REGISTRATIONS_CLOSED");
  assert.equal((await h.login(owner.email)).status, 200, "existing families can still sign in");

  const audit = (await h.req("/admin/audit", { token: owner.token })).json.entries.filter((e) => e.action === "settings.update");
  assert.equal(audit.length, 3);
  const cap = audit.find((e) => e.target_id === "costSafeguards");
  assert.deepEqual([cap.detail.from.aiDailyPlatformCap, cap.detail.to.aiDailyPlatformCap], [2000, 9000]);
  const s = (await h.req("/admin/settings", { token: owner.token })).json;
  assert.equal(s.settings.features.registrationsOpen, false);
  assert.ok(!JSON.stringify(s).match(/JWT|STRIPE_SECRET|sk_/), "no secrets in settings");
});

test("settings enforcement: the AI switch and the platform AI limit withhold the AI binding; YouTube switch too", async () => {
  const db = makeDb();
  const AI = { run: async () => ({}) };
  const base = { DB: db, JWT_SECRET: "x", AI, YOUTUBE_API_KEY: "k".repeat(20) };
  clearSettingsCache(); clearUsageCache();
  assert.equal((await applyPlatformSettings(base)).AI, AI, "default keeps today's behaviour");
  const save = (key, value) => { db.raw.prepare("INSERT OR REPLACE INTO platform_settings (key, value_json) VALUES (?, ?)").run(key, JSON.stringify(value)); clearSettingsCache(); clearUsageCache(); };
  save("features", { registrationsOpen: true, aiEnabled: false, videoSearch: false });
  const off = await applyPlatformSettings(base);
  assert.equal(off.AI, undefined);
  assert.equal(off.YOUTUBE_API_KEY, undefined);
  assert.equal(off.DB, db);
  save("features", { registrationsOpen: true, aiEnabled: true, videoSearch: true });
  save("costSafeguards", { aiDailyPlatformCap: 2 });
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at) VALUES ('f','F','u','2026-01-01')").run();
  const now = new Date().toISOString();
  db.raw.prepare("INSERT INTO ai_usage (id, family_id, kind, status, created_at) VALUES ('1','f','help','done',?), ('2','f','help','failed',?)").run(now, now);
  clearUsageCache();
  assert.equal((await applyPlatformSettings(base)).AI, AI, "failed requests don't count");
  db.raw.prepare("INSERT INTO ai_usage (id, family_id, kind, status, created_at) VALUES ('3','f','help','done',?)").run(now);
  clearUsageCache();
  assert.equal((await applyPlatformSettings(base)).AI, undefined, "cap reached");
  // A stored value that no longer validates falls back to the safe default.
  db.raw.prepare("INSERT OR REPLACE INTO platform_settings (key, value_json) VALUES ('costSafeguards', '{\"aiDailyPlatformCap\":-5}')").run();
  clearSettingsCache(); clearUsageCache();
  assert.equal((await applyPlatformSettings(base)).AI, AI);
  assert.equal(validateSetting("maintenance", { enabled: true, message: "Back at 9pm" }).ok, true);
});

test("maintenance notice reaches everyone and turning it on needs confirmation", async () => {
  const { h, owner } = await ownerSetup();
  await stepUp(h, owner);
  const value = { enabled: true, message: "Updates tonight from 9pm AEST" };
  assert.equal((await h.req("/admin/settings/maintenance", { method: "PUT", token: owner.token, body: { value } })).status, 409);
  assert.equal((await h.req("/admin/settings/maintenance", { method: "PUT", token: owner.token, body: { value, confirm_high_impact: true } })).status, 200);
  assert.deepEqual((await h.req("/platform/notices")).json.maintenance, { message: value.message });
});

test("errors: an unhandled exception is logged with route pattern and class only", async () => {
  const h = harness();
  const parent = await h.register("p@example.com");
  h.db.raw.exec("DROP TABLE calendar_events");
  const r = await h.req("/calendar", { token: parent.token });
  assert.equal(r.status, 500);
  assert.deepEqual(r.json, { detail: "Something went wrong. Please try again." });
  const row = h.db.raw.prepare("SELECT method, route, error_name FROM app_errors").get();
  assert.deepEqual([row.method, row.route, row.error_name], ["GET", "/api/calendar", "Error"]);
});

// ------------------------------------------------------------ promotion

test("owner promotion: checks, masked output and guarded one-time SQL", () => {
  assert.equal(maskEmail("petabozanich6@gmail.com"), "p***********6@gmail.com");
  const tables = ["users", "families", "roles", "user_roles", "family_admin_state", "admin_audit_log"];
  const user = { id: "u1", email: "Owner@Example.com", family_status: "active" };
  assert.deepEqual(evaluate({ userId: "u1", expectedEmail: "owner@example.com", tables, user, owners: [] }), { errors: [], alreadyDone: false });
  assert.equal(evaluate({ userId: "u1", expectedEmail: "owner@example.com", tables, user, owners: ["u1"] }).alreadyDone, true);
  assert.equal(evaluate({ userId: "u1", expectedEmail: "someone@example.com", tables, user, owners: [] }).errors.length, 1);
  assert.equal(evaluate({ userId: "u1", expectedEmail: "owner@example.com", tables, user, owners: ["u2"] }).errors.length, 1);
  assert.equal(evaluate({ userId: "u1", expectedEmail: "owner@example.com", tables: ["users"], user, owners: [] }).errors.length, 1);
  assert.equal(evaluate({ userId: "x'; DROP", expectedEmail: "owner@example.com", tables, user, owners: [] }).errors.length, 1);
  assert.equal(evaluate({ userId: "u1", expectedEmail: "owner@example.com", tables, user: { ...user, family_status: "suspended" }, owners: [] }).errors.length, 1);

  const db = makeDb();
  db.raw.exec("INSERT INTO families (id,name,owner_id,created_at) VALUES ('f1','F','u1','2026-01-01'),('f2','G','u2','2026-01-01');" +
    "INSERT INTO users (id,family_id,email,name,created_at) VALUES ('u1','f1','owner@example.com','O','2026-01-01'),('u2','f2','other@example.com','P','2026-01-01');");
  const run = (userId, email) => db.raw.exec(grantSql({ roleId: crypto.randomUUID(), auditId: crypto.randomUUID(), userId, email, detail: { t: 1 } }));
  run("u1", "wrong@example.com");
  assert.equal(db.raw.prepare(OWNERS_SQL).all().length, 0, "email must match inside the statement");
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM admin_audit_log").get().n, 0, "no audit row when nothing was granted");
  run("u1", "OWNER@example.com");
  assert.deepEqual(db.raw.prepare(OWNERS_SQL).all().map((r) => r.user_id), ["u1"]);
  run("u2", "other@example.com");
  run("u1", "owner@example.com");
  assert.deepEqual(db.raw.prepare(OWNERS_SQL).all().map((r) => r.user_id), ["u1"], "one-time: no second Owner, no duplicate");
  const audit = db.raw.prepare("SELECT action, actor_user_id, actor_label FROM admin_audit_log").all();
  assert.equal(audit.length, 1);
  assert.equal(audit[0].action, "owner.promote");
  assert.equal(audit[0].actor_user_id, null);
});

// ------------------------------------------------------------ offline lessons are a paid feature

test("offline lessons: only Family Membership (and complimentary) families get offline_allowed", async () => {
  const h = harness();
  const parent = await h.register("offline-plan@example.com");
  await h.addChild(parent, "offkid");
  const check = async () => {
    const login = await h.req("/auth/child-login", { method: "POST", admin: false, body: { username: "offkid", pin: "4321" } });
    const dash = await h.req("/dashboard/child", { token: login.json.token });
    assert.equal(dash.status, 200);
    assert.equal(login.json.offline_allowed, dash.json.offline_allowed, "sign-in and home page must agree");
    return login.json.offline_allowed;
  };
  assert.equal(await check(), false, "free preview");
  const setPlan = (plan, end) => h.db.raw.prepare("UPDATE families SET plan = ?, plan_period_end = ? WHERE id = ?").run(plan, end, parent.familyId);
  setPlan("ACTIVE_MONTHLY", new Date(Date.now() + 20 * 86400000).toISOString());
  assert.equal(await check(), true, "paying member");
  setPlan("INTERNAL", null);
  assert.equal(await check(), true, "complimentary");
  setPlan("CANCELLED", new Date(Date.now() - 86400000).toISOString());
  assert.equal(await check(), false, "membership ended");
  setPlan("FREE_PREVIEW", null);
  h.db.raw.prepare("UPDATE families SET trial_ends_at = ? WHERE id = ?").run(new Date(Date.now() - 86400000).toISOString(), parent.familyId);
  assert.equal(await check(), false, "preview ended");
});


// ---------------------------------------------------------------- parent feedback + Owner HQ inbox
test("feedback: parent submissions inherit trusted account/family identifiers, stay private and require Owner step-up", async () => {
  const { h, owner } = await ownerSetup();
  const alice = await h.register("alice-feedback@example.com","Alice");
  const bob = await h.register("bob-feedback@example.com","Bob");
  const child = await h.addChild(alice,"feedback_kid1");
  const report = { category: "idea", subject: "Give us an offline reading chart", message: "It would be lovely to track our reading without a connection.", page_hint: "Reading log", family_id: bob.familyId, user_id: bob.id, status: "resolved", owner_note: "fake" };

  let r = await h.req("/feedback", { method: "POST", token: alice.token, admin: false, body: report });
  assert.equal(r.status, 201, JSON.stringify(r.json));
  const id = r.json.id;
  const row = h.db.raw.prepare("SELECT * FROM parent_feedback WHERE id = ?").get(id);
  assert.equal(row.family_id, alice.familyId, "supplied family ID is ignored");
  assert.equal(row.user_id, alice.id, "supplied account ID is ignored");
  assert.equal(row.status, "new", "parents cannot assign owner status");
  assert.equal(row.owner_note, "", "parents cannot forge internal notes");
  assert.equal(row.category, "idea");
  assert.equal(row.page_hint, "Reading log");

  r = await h.req("/feedback", { token: alice.token, admin: false });
  assert.equal(r.status, 200);assert.equal(r.json.reports.length,1);
  assert.equal(r.json.reports[0].owner_note,undefined);
  r = await h.req("/feedback", { token: bob.token, admin: false });
  assert.equal(r.status, 200);assert.equal(r.json.reports.length,0);
  r = await h.req("/feedback", { token: child.token, admin: false });
  assert.equal(r.status, 403,"child cannot read parent feedback");
  r = await h.req("/feedback", { method:"POST", token: child.token, admin:false, body:report });
  assert.equal(r.status,403,"child cannot submit parent feedback");
  r = await h.req("/admin/feedback", { token: alice.token });
  assert.equal(r.status,404,"ordinary parent never sees owner inbox");
  r = await h.req("/admin/feedback", { token:owner.token });
  assert.equal(r.status,401,"owner must unlock passkey before reading");
  await stepUp(h,owner);
  r = await h.req("/admin/feedback/unread-count",{token:owner.token});
  assert.equal(r.status,200);assert.equal(r.json.unread,1);
  r = await h.req("/admin/feedback",{token:owner.token});
  assert.equal(r.status,200);assert.equal(r.json.items.length,1);
  assert.equal(r.json.items[0].parent_email,alice.email);
  assert.equal(r.json.items[0].family_id,alice.familyId);
  r = await h.req("/admin/feedback/"+id,{method:"PUT",token:owner.token,body:{status:"reviewing",owner_note:"Needs an investigation"}});
  assert.equal(r.status,200,JSON.stringify(r.json));
  r = await h.req("/admin/feedback/unread-count",{token:owner.token});
  assert.equal(r.json.unread,0);
  r = await h.req("/feedback",{token:alice.token,admin:false});
  assert.equal(r.json.reports[0].status,"reviewing");
  assert.equal(r.json.reports[0].owner_note,undefined);
  assert.equal(h.db.raw.prepare("SELECT owner_note FROM parent_feedback WHERE id=?").get(id).owner_note,"Needs an investigation");
  r = await h.req("/admin/feedback/"+id,{method:"PUT",token:owner.token,origin:"https://bad.example",body:{status:"resolved"}});
  assert.equal(r.status,403,"cross-origin writes remain blocked");
  r = await h.req("/admin/feedback/"+id,{method:"PUT",token:owner.token,body:{status:"invented"}});
  assert.equal(r.status,400,"invalid statuses rejected");
});


test("owner feedback replies are private, auditable, unread until viewed, and work after preview expiry",async()=>{
  const {h,owner}=await ownerSetup();
  const alice=await h.register("alice-replies@example.com","Alice");
  const bob=await h.register("bob-replies@example.com","Bob");
  const c=await h.addChild(alice,"reply_child1");
  const report={category:"problem",subject:"My calendar is stuck",message:"The timetable screen says it cannot save. Please help!"};
  const made=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body:report});
  assert.equal(made.status,201,JSON.stringify(made.json));
  const id=made.json.id;
  let r=await h.req("/feedback/unread-count",{token:alice.token,admin:false});
  assert.equal(r.status,200);assert.equal(r.json.unread,0);
  r=await h.req("/admin/feedback/"+id+"/replies",{method:"POST",token:alice.token,body:{message:"Forged"}});
  assert.equal(r.status,404,"only platform owners can reply");
  r=await h.req("/admin/feedback/"+id+"/replies",{method:"POST",token:owner.token,body:{message:"Needs passkey"}});
  assert.equal(r.status,401,"owners need passkey step-up");
  await stepUp(h,owner);
  r=await h.req("/admin/feedback/"+id+"/replies",{method:"POST",token:owner.token,origin:"https://bad.example",body:{message:"Cross origin"}});
  assert.equal(r.status,403,"CSRF protection still applies");
  for (const message of ["", "x", "x".repeat(2001)]) {
    r=await h.req("/admin/feedback/"+id+"/replies",{method:"POST",token:owner.token,body:{message}});
    assert.equal(r.status,400);
  }
  r=await h.req("/admin/feedback/"+id+"/replies",{method:"POST",token:owner.token,body:{message:"hello",status:"something_invalid"}});
  assert.equal(r.status,400);
  const exact="Thanks for telling me about the timetable. This has been fixed. Please try again.";
  r=await h.req("/admin/feedback/"+id+"/replies",{method:"POST",token:owner.token,body:{
    message:exact,status:"resolved",family_id:bob.familyId,user_id:bob.id,email:bob.email
  }});
  assert.equal(r.status,201,JSON.stringify(r.json));
  assert.equal(r.json.delivered_in_app,true);
  assert.equal(r.json.email_notification_sent,false,"no false success when email is unavailable");
  assert.equal(r.json.status,"resolved");
  const replyId=r.json.id;
  const raw=h.db.raw.prepare("SELECT r.*,p.family_id,p.user_id FROM parent_feedback_replies r JOIN parent_feedback p ON p.id=r.feedback_id WHERE r.id=?").get(replyId);
  assert.equal(raw.family_id,alice.familyId,"trusted parent routing, never request-supplied ids");
  assert.equal(raw.user_id,alice.id);
  assert.equal(raw.parent_read_at,null);
  assert.equal(raw.body,exact);
  const audit=h.db.raw.prepare("SELECT detail_json FROM admin_audit_log WHERE action='feedback.reply' AND target_id=?").get(id);
  assert.ok(audit,"send must produce audit metadata");
  assert.ok(!audit.detail_json.includes(exact),"no message body in admin audit");
  r=await h.req("/feedback",{token:alice.token,admin:false});
  assert.equal(r.status,200);
  assert.equal(r.json.reports[0].status,"resolved");
  assert.equal(r.json.reports[0].replies[0].body,exact);
  assert.equal(r.json.reports[0].unread_replies,1);
  assert.equal(r.json.reports[0].owner_note,undefined);
  r=await h.req("/feedback",{token:bob.token,admin:false});
  assert.equal(r.status,200);assert.equal(r.json.reports.length,0,"other families cannot view");
  r=await h.req("/feedback/unread-count",{token:bob.token,admin:false});
  assert.equal(r.json.unread,0);
  assert.equal(r.json.latest,null,"other families get no reply details");
  r=await h.req("/feedback/unread-count",{token:alice.token,admin:false});
  assert.equal(r.json.unread,1);
  assert.equal(r.json.latest.feedback_id,id,"dashboard links to the actual unread thread");
  assert.equal(r.json.latest.subject,"My calendar is stuck");
  assert.ok(r.json.latest.replied_at);
  assert.equal(r.json.latest.body,undefined,"notification never includes reply text");
  r=await h.req("/feedback/unread-count",{token:c.token,admin:false});
  assert.equal(r.status,403,"children cannot see parent replies");
  r=await h.req("/feedback/"+id+"/replies/read",{method:"POST",token:bob.token,admin:false});
  assert.equal(r.status,404,"other families cannot mark these read");
  r=await h.req("/feedback/"+id+"/replies/read",{method:"POST",token:c.token,admin:false});
  assert.equal(r.status,403,"children cannot mark parent messages read");
  r=await h.req("/feedback/"+id+"/replies/read",{method:"POST",token:alice.token,admin:false});
  assert.equal(r.status,200);
  r=await h.req("/feedback/unread-count",{token:alice.token,admin:false});
  assert.equal(r.json.unread,0);
  assert.equal(r.json.latest,null,"notification vanishes after parent reads reply");
  r=await h.req("/admin/feedback/"+id+"/replies",{token:owner.token});
  assert.equal(r.status,200);
  assert.ok(r.json.replies[0].parent_read_at);
  h.db.raw.prepare("UPDATE families SET plan='PREVIEW_EXPIRED',trial_ends_at=? WHERE id=?").run("2020-01-01T00:00:00.000Z",alice.familyId);
  r=await h.req("/feedback",{token:alice.token,admin:false});
  assert.equal(r.status,200,"expired parents retain message history");
  r=await h.req("/feedback/"+id+"/replies/read",{method:"POST",token:alice.token,admin:false});
  assert.equal(r.status,200,"free/expired parent can acknowledge replies");
});

test("branded Owner HQ feedback email includes the real Side-Quest logo without private content",async()=>{
  const h=harness();
  const parent=await h.register("branded-hq-test@example.com","Parent");
  const mail=[];
  h.env.EMAIL={send:async obj=>{mail.push(obj);return {messageId:"test"}}};
  h.env.OWNER_NOTIFICATION_EMAIL="test-owner@example.com";
  const secret="TOP-SECRET-FAMILY-DETAILS";
  const r=await h.req("/feedback",{method:"POST",token:parent.token,admin:false,body:{
    category:"feedback",subject:"Feature feedback",message:"This is private: "+secret
  }});
  assert.equal(r.status,201,JSON.stringify(r.json));
  assert.equal(mail.length,1);
  assert.equal(mail[0].to,"test-owner@example.com");
  assert.ok(mail[0].html.includes("/icons/icon-192.png"),"email contains publicly hosted Side-Quest logo");
  assert.ok(mail[0].html.includes("Side-Quest Learning logo"),"logo includes alternative text");
  assert.ok(!JSON.stringify(mail[0]).includes(secret),"private feedback content remains in Owner HQ");
});

test("feedback reply email only notifies the real submitting parent and never includes private message text",async()=>{
  const {h,owner}=await ownerSetup();
  const alice=await h.register("email-alice@example.com","Alice");
  const bob=await h.register("email-bob@example.com","Bob");
  const sent=[];
  h.env.EMAIL={send:async x=>{sent.push(x);return {messageId:"test-message"}}};
  const report=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,
    body:{category:"idea",subject:"More maths games please",message:"Could you add activities for maths?"}});
  assert.equal(report.status,201);
  await stepUp(h,owner);
  const phrase="CONFIDENTIAL FEEDBACK REPLY";
  const r=await h.req("/admin/feedback/"+report.json.id+"/replies",{method:"POST",token:owner.token,body:{message:phrase,email:bob.email}});
  assert.equal(r.status,201,JSON.stringify(r.json));
  assert.equal(r.json.email_notification_sent,true);
  assert.equal(sent.length,1);
  assert.deepEqual(sent[0].to,alice.email);
  assert.ok(sent[0].html.includes("/icons/icon-192.png"),"parent reply email carries Side-Quest logo");
  assert.ok(sent[0].html.includes("Side-Quest has reported back!"));
  assert.ok(!JSON.stringify(sent).includes(phrase));
  assert.ok(!JSON.stringify(sent).includes("More maths games please"));
  assert.ok(!JSON.stringify(sent).includes(bob.email));
});

test("dashboard reply alert surfaces older unread threads buried behind 50 newer submissions",async()=>{
  const h=harness();
  const alice=await h.register("older-feedback@example.com","Alice");
  const bob=await h.register("other-feedback@example.com","Bob");
  const insert=h.db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,status,owner_note,seen_at,created_at,updated_at) VALUES(?,?,?,'idea',?,'Please consider the suggestion here.','','new','',NULL,?,?)");
  for(let i=0;i<55;i++){
    const date=new Date(Date.UTC(2026,9,1+i)).toISOString();
    insert.run("old-feedback-"+i,alice.familyId,alice.id,"Feedback item "+i,date,date);
  }
  const old="old-feedback-0";
  h.db.raw.prepare("INSERT INTO parent_feedback_replies(id,feedback_id,author_user_id,body,parent_read_at,created_at) VALUES(?,?,?,'Please try the fix.',NULL,?)")
    .run("old-reply",old,bob.id,new Date().toISOString());
  let r=await h.req("/feedback/unread-count",{token:alice.token,admin:false});
  assert.equal(r.status,200);
  assert.equal(r.json.unread,1);
  assert.equal(r.json.latest.feedback_id,old);
  r=await h.req("/feedback",{token:alice.token,admin:false});
  assert.equal(r.status,200);
  assert.equal(r.json.reports.length,50);
  assert.equal(r.json.reports[0].id,old,"old item with unread reply is promoted above newer items");
  assert.equal(r.json.reports[0].replies[0].body,"Please try the fix.");
  r=await h.req("/feedback",{token:bob.token,admin:false});
  assert.equal(r.status,200);assert.equal(r.json.reports.length,0);
  r=await h.req("/feedback/unread-count",{token:bob.token,admin:false});
  assert.equal(r.json.unread,0);assert.equal(r.json.latest,null);
  r=await h.req("/feedback/"+old+"/replies/read",{method:"POST",token:alice.token,admin:false});
  assert.equal(r.status,200);
  r=await h.req("/feedback/unread-count",{token:alice.token,admin:false});
  assert.equal(r.json.unread,0);assert.equal(r.json.latest,null);
});


test("feedback submissions survive missing or unavailable optional reply/notification storage",async()=>{
  const h=harness();
  const alice=await h.register("feedback-compat@example.com","Alice");
  const existingDb=h.env.DB;
  // Simulate production where optional newer reply queries/DDL cannot run.
  h.env.DB={...existingDb,prepare(sql){
    if(/parent_feedback_replies/i.test(sql))throw new Error("no such table: parent_feedback_replies");
    if(/^CREATE (TABLE|INDEX).*parent_feedback/i.test(sql))throw new Error("DDL disabled for feedback");
    return existingDb.prepare(sql);
  }};
  let r=await h.req("/feedback",{method:"POST",token:alice.token,admin:false,body:{
    category:"problem",subject:"Can't send feedback",message:"The feedback send button should still store the report."
  }});
  assert.equal(r.status,201,JSON.stringify(r.json));
  const id=r.json.id;
  assert.ok(h.db.raw.prepare("SELECT 1 FROM parent_feedback WHERE id=?").get(id),"submission must be persisted");
  r=await h.req("/feedback",{token:alice.token,admin:false});
  assert.equal(r.status,200,JSON.stringify(r.json));
  assert.equal(r.json.reports[0].id,id,"history cannot depend on reply tables");
  r=await h.req("/feedback/unread-count",{token:alice.token,admin:false});
  assert.equal(r.status,200);
  assert.equal(r.json.unread,0);
  assert.equal(r.json.notification_unavailable,true,"report an outage without breaking parent feedback");
  h.env.DB=existingDb;
});

test("feedback: input validation and rate limiting stop spam without creating extra reports", async () => {
  const h = harness();
  const alice = await h.register("rate-feedback@example.com","Alice");
  const good = {category:"problem",subject:"Something is not saving",message:"I save a lesson and it stays on the old version."};
  for (const body of [
    {...good,category:"arbitrary"},{...good,subject:"bad"},{...good,message:"too short"},
    {...good,page_hint:"x".repeat(161)}, {...good,user_id:"stolen",message:"A".repeat(4001)},
  ]) {
    const r=await h.req("/feedback",{method:"POST",token:alice.token,admin:false,body});
    assert.equal(r.status,400,JSON.stringify(r.json));
  }
  for(let i=0;i<5;i++){
    const r=await h.req("/feedback",{method:"POST",token:alice.token,admin:false,body:good});
    assert.equal(r.status,201,JSON.stringify(r.json));
  }
  const blocked=await h.req("/feedback",{method:"POST",token:alice.token,admin:false,body:good});
  assert.equal(blocked.status,429);
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM parent_feedback WHERE user_id=?").get(alice.id).n,5);
});



test("learning support intake validates consent, is private and filterable in Owner HQ",async()=>{
 const {h,owner}=await ownerSetup();
 const alice=await h.register("support-alice@example.com","Alice");
 const bob=await h.register("support-bob@example.com","Bob");
 const child=await h.addChild(alice,"support-child");
 const input={kind:"learning-support",subject:"Mathematics",year:"Year 5",service:"Worked explanation",detail:"Help understanding equivalent fractions.",consent:true};
 for(const body of [{...input,consent:false},{...input,year:"Year 99"},{...input,subject:"Unknown"},{...input,detail:"short"},{category:"other",subject:"Forged support",message:"This should not be treated as a support enquiry.",page_hint:"learning-support"}]){
  const r=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body});assert.equal(r.status,400,JSON.stringify(r.json));
 }
 const denied=await h.req("/feedback",{method:"POST",admin:false,token:child.token,body:input});assert.ok([401,403,404].includes(denied.status));
 const regular=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body:{category:"idea",subject:"A general idea",message:"An ordinary feedback submission."}});assert.equal(regular.status,201);
 const created=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body:{...input,family_id:bob.familyId,user_id:bob.id}});assert.equal(created.status,201,JSON.stringify(created.json));
 let r=await h.req("/feedback?kind=learning-support",{admin:false,token:alice.token});assert.equal(r.status,200);assert.deepEqual(r.json.reports.map(x=>x.id),[created.json.id]);assert.match(r.json.reports[0].message,/equivalent fractions/);
 r=await h.req("/feedback?kind=learning-support",{admin:false,token:bob.token});assert.equal(r.status,200);assert.equal(r.json.reports.length,0);
 r=await h.req("/admin/feedback?kind=learning-support",{token:alice.token});assert.equal(r.status,404);
 await stepUp(h,owner);
 r=await h.req("/admin/feedback?kind=learning-support",{token:owner.token});assert.equal(r.status,200);assert.deepEqual(r.json.items.map(x=>x.id),[created.json.id]);
 h.db.raw.prepare("UPDATE families SET plan='PREVIEW_EXPIRED' WHERE id=?").run(alice.familyId);
 r=await h.req("/feedback?kind=learning-support",{admin:false,token:alice.token});assert.equal(r.status,200);assert.equal(r.json.reports.length,1);
 const afterExpiry=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body:{...input,detail:"A new learning need after membership expiry."}});assert.equal(afterExpiry.status,201,JSON.stringify(afterExpiry.json));
}); 


test("learning support quote lifecycle: owner-only, private, expiry, non-member responses, no billing changes",async()=>{
 const {h,owner}=await ownerSetup(),alice=await h.register("quote-alice@example.com","Alice"),bob=await h.register("quote-bob@example.com","Bob");
 const child=await h.addChild(alice,"quote-child");
 const request=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body:{kind:"learning-support",subject:"Science",year:"Year 5",service:"Worked explanation",detail:"Understanding the phases of the moon.",consent:true}});
 assert.equal(request.status,201,JSON.stringify(request.json));
 const id=request.json.id,ap="/admin/feedback/"+id+"/quotes",pp="/learning-support/"+id+"/quotes";
 const proposal={scope:"A written explanation and practice questions.",delivery:"Private delivery after confirmation",amount_cents:1500,valid_days:7,confirmed:true};
 assert.equal((await h.req(ap,{method:"POST",token:alice.token,body:proposal})).status,404);
 await stepUp(h,owner);
 assert.equal((await h.req(ap,{method:"POST",token:owner.token,body:{...proposal,amount_cents:12.5}})).status,400);
 const made=await h.req(ap,{method:"POST",token:owner.token,body:proposal});assert.equal(made.status,201,JSON.stringify(made.json));
 assert.equal((await h.req(ap,{method:"POST",token:owner.token,body:proposal})).status,409);
 assert.equal((await h.req(pp,{admin:false,token:bob.token})).status,404);
 assert.ok([401,403,404].includes((await h.req(pp,{admin:false,token:child.token})).status));
 h.db.raw.prepare("UPDATE families SET plan='PREVIEW_EXPIRED' WHERE id=?").run(alice.familyId);
 let r=await h.req(pp,{admin:false,token:alice.token});assert.equal(r.status,200);assert.equal(r.json.quotes[0].amount_cents,1500);
 const history=await h.req("/feedback?kind=learning-support",{admin:false,token:alice.token});assert.equal(history.json.reports.find(x=>x.id===id).quotes[0].amount_cents,1500);
 const response=pp+"/"+made.json.id+"/respond";
 assert.equal((await h.req(response,{method:"POST",admin:false,token:bob.token,body:{response:"interested",confirmed:true}})).status,404);
 assert.equal((await h.req(response,{method:"POST",admin:false,token:alice.token,body:{response:"interested",confirmed:false}})).status,400);
 assert.equal((await h.req(response,{method:"POST",admin:false,token:alice.token,body:{response:"interested",confirmed:true,amount_cents:1}})).status,200);
 assert.equal((await h.req(response,{method:"POST",admin:false,token:alice.token,body:{response:"interested",confirmed:true}})).status,409);
 r=await h.req(ap,{token:owner.token});assert.equal(r.json.quotes[0].status,"interested");assert.equal(r.json.quotes[0].amount_cents,1500);
 assert.equal(h.db.raw.prepare("SELECT plan FROM families WHERE id=?").get(alice.familyId).plan,"PREVIEW_EXPIRED");
 assert.equal((await h.req(ap+"/"+made.json.id+"/withdraw",{method:"POST",token:owner.token,body:{confirmed:true}})).status,200);
 const second=await h.req(ap,{method:"POST",token:owner.token,body:proposal});assert.equal(second.status,201);
 h.db.raw.prepare("UPDATE learning_support_quotes SET expires_at='2020-01-01T00:00:00.000Z' WHERE id=?").run(second.json.id);
 r=await h.req(pp,{admin:false,token:alice.token});assert.equal(r.json.quotes.find(q=>q.id===second.json.id).status,"expired");
 assert.equal((await h.req(pp+"/"+second.json.id+"/respond",{method:"POST",admin:false,token:alice.token,body:{response:"interested",confirmed:true}})).status,409);
});


test("standalone support verifies email, isolates guest sessions, and never creates a family or trial",async()=>{
 const {h,owner}=await ownerSetup();
 assert.equal((await h.req("/support-guest/status",{admin:false})).json.available,false);
 assert.equal((await h.req("/support-guest/link",{method:"POST",admin:false,body:{email:"guest@example.com"}})).status,503);
 h.env.SUPPORT_GUEST_ENABLED="true";
 const mail=[];h.env.EMAIL={send:async m=>{mail.push(m);return {messageId:"test"};}};
 const before=h.db.raw.prepare("SELECT COUNT(*) n FROM families").get().n;
 const link=await h.req("/support-guest/link",{method:"POST",admin:false,body:{email:"guest@example.com"}});
 assert.equal(link.status,200,JSON.stringify(link.json));
 const raw=mail.at(-1).text.match(/#token=([a-f0-9]{64})/)[1];
 assert.notEqual(h.db.raw.prepare("SELECT token_hash FROM support_guest_links").get().token_hash,raw);
 const redeem=await h.req("/support-guest/redeem",{method:"POST",admin:false,body:{token:raw}});assert.equal(redeem.status,200);
 assert.equal((await h.req("/support-guest/redeem",{method:"POST",admin:false,body:{token:raw}})).status,400);
 const headers={"X-SideQuest-Guest":redeem.json.token};
 const input={parent_name:"Guest Parent",subject:"Science",year:"Year 5",service:"Worked explanation",detail:"Help understanding the phases of the moon.",consent:true};
 assert.equal((await h.req("/support-guest/requests",{method:"POST",admin:false,body:input})).status,401);
 const made=await h.req("/support-guest/requests",{method:"POST",admin:false,headers,body:input});assert.equal(made.status,201,JSON.stringify(made.json));
 assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM families").get().n,before);
 assert.equal((await h.req("/auth/me",{token:redeem.json.token})).status,401);
 const path="/admin/support-guests/"+made.json.id;
 assert.equal((await h.req("/admin/support-guests",{token:redeem.json.token})).status,404);
 await stepUp(h,owner);
 const quote=await h.req(path+"/quotes",{method:"POST",token:owner.token,body:{scope:"Worked explanation and practice questions",delivery:"Written response",amount_cents:1500,valid_days:7,confirmed:true}});assert.equal(quote.status,201,JSON.stringify(quote.json));
 const list=await h.req("/support-guest/requests",{admin:false,headers});assert.equal(list.json.requests[0].quotes[0].amount_cents,1500);
 await h.req("/support-guest/link",{method:"POST",admin:false,body:{email:"other@example.com"}});
 const otherRaw=mail.at(-1).text.match(/#token=([a-f0-9]{64})/)[1];
 const other=await h.req("/support-guest/redeem",{method:"POST",admin:false,body:{token:otherRaw}});
 const otherHeaders={"X-SideQuest-Guest":other.json.token};
 assert.equal((await h.req("/support-guest/requests",{admin:false,headers:otherHeaders})).json.requests.length,0);
 const response="/support-guest/requests/"+made.json.id+"/quotes/"+quote.json.id+"/respond";
 assert.equal((await h.req(response,{method:"POST",admin:false,headers:otherHeaders,body:{response:"interested",confirmed:true}})).status,404);
 assert.equal((await h.req(response,{method:"POST",admin:false,headers,body:{response:"interested",confirmed:true,amount_cents:1}})).status,200);
 assert.equal((await h.req(path+"/quotes",{token:owner.token})).json.quotes[0].amount_cents,1500);
 assert.equal((await h.req("/support-guest/logout",{method:"POST",admin:false,headers,body:{}})).status,200);
 assert.equal((await h.req("/support-guest/requests",{admin:false,headers})).status,401);
 assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM families").get().n,before);
});

test("manual invoice: owner verifies full payment and overdue slot stays held",async()=>{
 const {h,owner}=await ownerSetup();
 const alice=await h.register("manual-alice@example.com","Alice");
 const made=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body:{kind:"learning-support",subject:"Science",year:"Year 5",service:"Live online support",detail:"Understanding phases of the moon.",consent:true}});assert.equal(made.status,201);
 const id=made.json.id,ap="/admin/feedback/"+id,pp="/learning-support/"+id;
 await stepUp(h,owner);
 const quote=await h.req(ap+"/quotes",{method:"POST",token:owner.token,body:{scope:"A guided science lesson",delivery:"Online appointment",amount_cents:2500,valid_days:7,confirmed:true}});assert.equal(quote.status,201,JSON.stringify(quote.json));
 assert.equal((await h.req(pp+"/quotes/"+quote.json.id+"/respond",{method:"POST",admin:false,token:alice.token,body:{response:"interested",confirmed:true}})).status,200);
 const start=new Date(Date.now()+48*3600000).toISOString(),due=new Date(Date.now()+24*3600000).toISOString();
 const order=await h.req(ap+"/orders",{method:"POST",token:owner.token,body:{quote_id:quote.json.id,mode:"live",start_at:start,minutes:30,terms:"Agreed appointment and cancellation terms.",confirmed:true}});assert.equal(order.status,201,JSON.stringify(order.json));
 const oid=order.json.id,adminPath=ap+"/orders/"+oid,parentPath=pp+"/orders/"+oid;
 assert.equal((await h.req(parentPath+"/confirm",{method:"POST",admin:false,token:alice.token,body:{confirmed:true}})).status,200);
 assert.equal((await h.req(adminPath+"/checkout",{method:"POST",token:owner.token,body:{confirmed:true}})).status,410);
 const inv={reference:"INV-TEST-123",due_at:due,sent_in_square:true,confirmed:true};
 assert.equal((await h.req(adminPath+"/invoice",{method:"POST",token:alice.token,body:inv})).status,404);
 assert.equal((await h.req(adminPath+"/invoice",{method:"POST",token:owner.token,body:inv})).status,201);
 assert.equal((await h.req(adminPath+"/cancel",{method:"POST",token:owner.token,body:{confirmed:true}})).status,409);
 assert.equal((await h.req(adminPath+"/verify-payment",{method:"POST",token:owner.token,body:{reference:inv.reference,amount_cents:2499,paid_in_square:true,confirmed:true}})).status,409);
 assert.equal((await h.req(adminPath+"/verify-payment",{method:"POST",token:alice.token,body:{reference:inv.reference,amount_cents:2500,paid_in_square:true,confirmed:true}})).status,404);
 h.db.raw.prepare("UPDATE support_manual_invoices SET due_at='2020-01-01T00:00:00.000Z' WHERE order_id=?").run(oid);
 const list=await h.req(pp+"/orders",{admin:false,token:alice.token});assert.equal(list.json.orders[0].invoice_overdue,true);assert.equal(list.json.orders[0].status,"confirmed");
 const payment={reference:inv.reference,amount_cents:2500,paid_in_square:true,confirmed:true};
 assert.equal((await h.req(adminPath+"/verify-payment",{method:"POST",token:owner.token,body:payment})).status,200);
 assert.equal((await h.req(adminPath+"/verify-payment",{method:"POST",token:owner.token,body:payment})).status,409);
 assert.equal((await h.req(pp+"/orders",{admin:false,token:alice.token})).json.orders[0].status,"paid");
 assert.equal(h.db.raw.prepare("SELECT plan FROM families WHERE id=?").get(alice.familyId).plan,"FREE_PREVIEW");
});

test("classroom board gates access on paid appointment, owner opening, time window and revision",async()=>{
 const {h,owner}=await ownerSetup();
 const {classroomState,setClassroomOpen,editClassroom}=await import("../src/supportClassrooms.ts");
 const alice=await h.register("board-alice@example.com","Alice");
 const bob=await h.register("board-bob@example.com","Bob");
 const r=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body:{kind:"learning-support",subject:"Science",year:"Year 5",service:"Live online support",detail:"Help with lunar phases.",consent:true}});
 assert.equal(r.status,201,JSON.stringify(r.json));
 const id=r.json.id,now=new Date(),start=new Date(now.getTime()+120000),end=new Date(now.getTime()+32*60000),oid="board-order";
 h.db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(oid,"member",id,"board-quote",0,"Science support","Online","Agreed terms","live",start.toISOString(),end.toISOString(),"confirmed",now.toISOString(),now.toISOString());
 assert.equal(await classroomState(h.db,"member",id,oid,false,now),null);
 h.db.raw.prepare("UPDATE support_service_orders SET status='paid' WHERE id=?").run(oid);
 assert.equal((await classroomState(h.db,"member",id,oid,false,now)).open,false);
 assert.equal(await setClassroomOpen(h.db,"member",id,oid,true,now),true);
 assert.equal((await editClassroom(h.db,"member",id,oid,false,{action:"text",text:"not allowed",revision:0},now)).error,"This board action is not available.");
 assert.equal((await editClassroom(h.db,"member",id,oid,false,{action:"stroke",points:[[0,0],[1,1]],color:"#163b2c",revision:0},now)).ok,true);
 assert.ok((await editClassroom(h.db,"member",id,oid,true,{action:"text",text:"stale",revision:0},now)).error);
 h.env.SUPPORT_CLASSROOM_ENABLED="true";
 const path="/learning-support/"+id+"/orders/"+oid+"/classroom";
 assert.equal((await h.req(path,{admin:false,token:bob.token})).status,404);
 assert.equal((await h.req(path,{admin:false,token:alice.token})).json.board.strokes.length,1);
 await stepUp(h,owner);
 assert.equal((await h.req("/admin/support-calendar?from="+encodeURIComponent(now.toISOString())+"&to="+encodeURIComponent(new Date(now.getTime()+86400000).toISOString()),{token:owner.token})).json.appointments.some(o=>o.id===oid),true);
 assert.equal(await setClassroomOpen(h.db,"member",id,oid,false,now),true);
 assert.equal((await classroomState(h.db,"member",id,oid,false,now)).board.strokes.length,0);
 assert.equal((await classroomState(h.db,"member",id,oid,true,new Date(end.getTime()+11*60000))).in_window,false);
});

test("RealtimeKit staging-only room setup, token windows and cleanup with mocked provider",async()=>{
 const {h}=await ownerSetup();
 const {prepareVideo,videoToken,closeVideo}=await import("../src/supportVideo.ts");
 const {setClassroomOpen}=await import("../src/supportClassrooms.ts");
 const now=new Date(),oid="video-order",id="video-request";
 h.db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(oid,"guest",id,"video-quote",0,"Science support","Online","Agreed terms","live",now.toISOString(),new Date(now.getTime()+30*60000).toISOString(),"paid",now.toISOString(),now.toISOString());
 await setClassroomOpen(h.db,"guest",id,oid,true,now);
 const env={...h.env,SUPPORT_CLASSROOM_ENABLED:"true",SUPPORT_VIDEO_TEST:"true",SUPPORT_VIDEO_ACCOUNT:"test-account",SUPPORT_VIDEO_APP:"test-app",SUPPORT_VIDEO_TOKEN:"test-secret",SUPPORT_VIDEO_TUTOR_PRESET:"tutor",SUPPORT_VIDEO_FAMILY_PRESET:"family",STAGING_KEY:"test"};
 const calls=[];
 const fake=async(url,init)=>{const b=init.body?JSON.parse(init.body):{};calls.push({url,method:init.method,b});return new Response(JSON.stringify({success:true,data:url.endsWith("/meetings")?{id:"meeting-one"}:url.endsWith("/participants")?{id:"participant-one",token:"test-token"}:{token:"refreshed-token"}}));};
 assert.ok((await prepareVideo({...env,STAGING_KEY:undefined},"guest",id,oid,fake,now)).error);
 assert.equal(calls.length,0);
 assert.equal((await prepareVideo(env,"guest",id,oid,fake,now)).ok,true);
 assert.equal((await prepareVideo(env,"guest",id,oid,fake,now)).ok,true);
 assert.equal(calls.length,1);assert.equal(calls[0].b.record_on_start,false);
 assert.equal((await videoToken(env,"guest",id,oid,false,fake,now)).token,"test-token");
 assert.equal(calls[1].b.preset_name,"family");assert.equal(calls[1].b.token.expires_on,new Date(now.getTime()+40*60000).toISOString());
 assert.equal((await videoToken(env,"guest",id,oid,false,fake,now)).token,"refreshed-token");
 assert.equal(await closeVideo(env,oid,fake),true);
 assert.equal(calls.at(-2).b.status,"INACTIVE");assert.ok(calls.at(-1).url.endsWith("/kick-all"));
 assert.ok((await videoToken(env,"guest",id,oid,false,fake,now)).error);
});

test("reusable tutor decks: review required, version conflict, private notes never shared",async()=>{
 const {h,owner}=await ownerSetup(),alice=await h.register("deck-alice@example.com","Alice");
 const {saveDeck,getDeck}=await import("../src/supportDecks.ts");
 const {setClassroomOpen,editClassroom,classroomState}=await import("../src/supportClassrooms.ts");
 const deck={title:"Fractions",subject:"Mathematics",year_level:"Year 5",slides:[{kind:"practice",heading:"Try it",body:"What is half of 8?",notes:"Private answer: 4."}]};
 assert.equal((await h.req("/admin/support-decks",{token:alice.token})).status,404);
 await stepUp(h,owner);
 const d=await h.req("/admin/support-decks",{method:"POST",token:owner.token,body:deck});assert.equal(d.status,201,JSON.stringify(d.json));
 const id=d.json.id,now=new Date(),oid="deck-order";
 h.db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(oid,"guest","deck-request","deck-quote",0,"Maths support","Online","Agreed terms","live",now.toISOString(),new Date(now.getTime()+30*60000).toISOString(),"paid",now.toISOString(),now.toISOString());
 await setClassroomOpen(h.db,"guest","deck-request",oid,true,now);
 const present={action:"present",deck_id:id,deck_revision:1,index:0,revision:0};
 assert.ok((await editClassroom(h.db,"guest","deck-request",oid,true,present,now)).error);
 assert.ok((await saveDeck(h.db,{...deck,reviewed:true,revision:1},id)).id);
 assert.ok((await saveDeck(h.db,{...deck,reviewed:true,revision:1},id)).error);
 assert.ok((await editClassroom(h.db,"guest","deck-request",oid,false,{...present,deck_revision:2},now)).error);
 assert.equal((await editClassroom(h.db,"guest","deck-request",oid,true,{...present,deck_revision:2},now)).ok,true);
 const state=await classroomState(h.db,"guest","deck-request",oid,false,now);
 assert.equal(state.board.slide.body,"What is half of 8?");
 assert.equal(JSON.stringify(state).includes("Private answer"),false);
 assert.equal((await getDeck(h.db,id)).slides[0].notes,"Private answer: 4.");
});

test("quote plan snapshot separates public lesson sequence from private teaching guides",async()=>{
 const {h,owner}=await ownerSetup(),alice=await h.register("plan-alice@example.com","Alice"),bob=await h.register("plan-bob@example.com","Bob");
 const r=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body:{kind:"learning-support",subject:"Mathematics",year:"Year 5",service:"Live online support",detail:"Help with equivalent fractions.",consent:true}});assert.equal(r.status,201,JSON.stringify(r.json));
 const id=r.json.id,ap="/admin/feedback/"+id+"/quotes",pp="/learning-support/"+id+"/quotes";
 await stepUp(h,owner);
 const plan={title:"Fractions",subject:"Mathematics",year_level:"Year 5",goal:"Recognise equivalent fractions",lessons:[{title:"Halves and quarters",objective:"Identify equivalent fractions",activities:"Compare fraction strips",check:"Explain why two fractions are equal",home_practice:"Draw two equivalent fractions",minutes:30,guide:"Private guide: model 1/2 = 2/4.",answers:"Private answer: 3/6 = 1/2."}]};
 const proposal={scope:"Guided mathematics support",delivery:"One online session",amount_cents:2500,valid_days:7,confirmed:true,plan};
 assert.equal((await h.req(ap,{method:"POST",token:owner.token,body:proposal})).status,400);
 const q=await h.req(ap,{method:"POST",token:owner.token,body:{...proposal,plan_reviewed:true}});assert.equal(q.status,201,JSON.stringify(q.json));
 const path=pp+"/"+q.json.id+"/plan";
 const parent=await h.req(path,{admin:false,token:alice.token});assert.equal(parent.status,200);assert.equal(parent.json.plan.lessons[0].title,"Halves and quarters");assert.equal(JSON.stringify(parent.json).includes("Private answer"),false);assert.equal(parent.json.plan.tutor_guides,undefined);
 assert.equal((await h.req(path,{admin:false,token:bob.token})).status,404);
 const own=await h.req(ap+"/"+q.json.id+"/plan",{token:owner.token});assert.equal(own.json.plan.tutor_guides[0].answers,"Private answer: 3/6 = 1/2.");
});

test("outage backup only permits restricted Meet URLs and does not expose private answers in parent copy",async()=>{
 const {validBackupMeeting,planText}=await import("../src/supportContinuity.ts");
 assert.equal(validBackupMeeting("https://meet.google.com/abc-defg-hij"),"https://meet.google.com/abc-defg-hij");
 for(const bad of ["https://meet.google.com.evil.test/abc-defg-hij","https://meet.google.com/abc-defg-hij?x=1","javascript:alert(1)"])assert.equal(validBackupMeeting(bad),null);
 const p={title:"Fractions",subject:"Maths",year_level:"Year 5",goal:"Compare fractions",lessons:[{title:"Practice",minutes:30,objective:"Compare",activities:"Draw",check:"Explain",home_practice:"Try 1/2"}],tutor_guides:[{guide:"Private guide",answers:"Private answer"}]};
 assert.ok(!planText(p).includes("Private answer"));assert.ok(planText(p,true).includes("Private answer"));
});

test("guided tutoring enquiry preserves interests, strengths and goals and validates optional fields",async()=>{
 const {parseLearningSupport}=await import("../src/learningSupport.ts");
 const b={subject:"Mathematics",year:"Year 5",service:"Not sure yet",detail:"Finds fractions hard to understand",consent:true,interests:"Dinosaurs and drawing",strengths:"Counts confidently",preferences:"Visual examples",goal:"Compare fractions",availability:"Afternoons"};
 const result=parseLearningSupport(b);assert.ok(result.message.includes("Interests and favourite topics: Dinosaurs and drawing"));assert.ok(result.message.includes("Parent goals: Compare fractions"));
 assert.ok(parseLearningSupport({...b,interests:"x".repeat(301)}).error);
 assert.ok(parseLearningSupport({...b,preferences:[]}).error);
 assert.ok(parseLearningSupport({...b,detail:"x".repeat(1801)}).error);
});

test("external tutoring resource validation and private grant separation",async()=>{
 const {h}=await ownerSetup(),{decodeResource,grantResource,grantedResources,downloadResource}=await import("../src/supportFiles.ts");
 const b={filename:"lesson.pdf",title:"Fractions",subject:"Maths",year_level:"Year 5",audience:"learner",reviewed:true,base64:btoa("%PDF-1.7 test")};
 assert.equal(decodeResource(b).mime,"application/pdf");assert.equal(decodeResource({...b,filename:"lesson.html"}),null);assert.equal(decodeResource({...b,reviewed:false}),null);
 const now=new Date().toISOString();
 h.db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)").run("file-order","guest","file-request","file-quote",0,"Maths","Written","Terms","written","paid",now,now);
 for(const [id,audience] of [["private","tutor"],["public","learner"]])h.db.raw.prepare("INSERT INTO support_files(id,title,subject,year_level,filename,mime,size_bytes,storage_key,audience,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,'active',?)").run(id,"Fractions","Maths","Year 5","lesson.pdf","application/pdf",12,"support-private/"+id,audience,now);
 assert.equal(await grantResource(h.db,"guest","file-request","file-order","private"),false);
 assert.equal(await grantResource(h.db,"guest","file-request","file-order","public"),true);
 assert.equal((await grantedResources(h.db,"guest","other","file-order")).length,0);
 assert.equal((await grantedResources(h.db,"guest","file-request","file-order")).length,1);
 const env={...h.env,BUCKET:{get:async()=>({size:12,arrayBuffer:async()=>new TextEncoder().encode("%PDF-1.7 test").buffer})}};
 assert.equal(await downloadResource(env,"private","file-order"),null);
 assert.ok((await downloadResource(env,"public","file-order")).base64);
});

test("classroom images require active learner material and only the currently presented image is accessible",async()=>{
 const {h}=await ownerSetup();
 const {setClassroomOpen,editClassroom,canReadClassroomImage}=await import("../src/supportClassrooms.ts");
 const now=new Date(),when=now.toISOString(),oid="img-order",rid="img-request";
 h.db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(oid,"guest",rid,"img-quote",0,"Maths","Online","Terms","live",when,new Date(now.getTime()+30*60000).toISOString(),"paid",when,when);
 for(const [id,audience,mime] of [["diagram","learner","image/png"],["answers","tutor","image/png"],["pdf","learner","application/pdf"]])h.db.raw.prepare("INSERT INTO support_files(id,title,subject,year_level,filename,mime,size_bytes,storage_key,audience,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,'active',?)").run(id,id,"Maths","Year 5",id+".png",mime,12,"support-private/"+id,audience,when);
 await setClassroomOpen(h.db,"guest",rid,oid,true,now);
 assert.ok((await editClassroom(h.db,"guest",rid,oid,true,{action:"present-image",file_id:"answers",revision:0},now)).error);
 assert.ok((await editClassroom(h.db,"guest",rid,oid,true,{action:"present-image",file_id:"pdf",revision:0},now)).error);
 assert.ok((await editClassroom(h.db,"guest",rid,oid,false,{action:"present-image",file_id:"diagram",revision:0},now)).error);
 assert.equal((await editClassroom(h.db,"guest",rid,oid,true,{action:"present-image",file_id:"diagram",revision:0},now)).ok,true);
 assert.equal(await canReadClassroomImage(h.db,"guest",rid,oid,"diagram",false,now),true);
 assert.equal(await canReadClassroomImage(h.db,"guest","wrong",oid,"diagram",false,now),false);
 assert.equal(await canReadClassroomImage(h.db,"guest",rid,oid,"answers",false,now),false);
 assert.equal((await editClassroom(h.db,"guest",rid,oid,true,{action:"hide-image",revision:1},now)).ok,true);
 assert.equal(await canReadClassroomImage(h.db,"guest",rid,oid,"diagram",false,now),false);
});

test("tutor diary reserves buffers and unavailable blocks and keeps private preparation owner-only",async()=>{
 const {h,owner}=await ownerSetup(),alice=await h.register("diary-alice@example.com","Alice");
 const {createServiceOrder}=await import("../src/supportOrders.ts");
 const {createBusyBlock,saveDiary,readDiary}=await import("../src/supportDiary.ts");
 const now=new Date(),start=new Date(now.getTime()+48*3600000),when=now.toISOString();
 const r=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body:{kind:"learning-support",subject:"Science",year:"Year 5",service:"Live online support",detail:"Understanding the solar system",consent:true}});
 assert.equal(r.status,201);const rid=r.json.id;
 for(const id of ["diary-q1","diary-q2"]){if(id==="diary-q2")h.db.raw.prepare("UPDATE learning_support_quotes SET status='withdrawn' WHERE id='diary-q1'").run();
 h.db.raw.prepare("INSERT INTO learning_support_quotes(id,feedback_id,scope,delivery,amount_cents,status,created_at,expires_at) VALUES(?,?,?,?,?,'interested',?,?)").run(id,rid,"Solar system","Online",1500,when,new Date(now.getTime()+7*86400000).toISOString());
 if(id==="diary-q1"){const order=await createServiceOrder(h.db,"member",rid,{quote_id:id,mode:"live",start_at:start.toISOString(),minutes:30,prep_minutes:10,wrap_minutes:10,learner_label:"Learner A",terms:"Agreed arrangements and terms.",confirmed:true},now);assert.ok(order.id,JSON.stringify(order));const d=await readDiary(h.db,"member",rid,order.id);assert.equal(d.diary.prep_minutes,10);
 assert.equal(await saveDiary(h.db,"member",rid,order.id,{...d.diary,ready:true,details:{objective:"Explain orbits",agenda:"Model with diagrams",materials:"Worksheet",reflection:"PRIVATE diary note"} }),true);
 assert.equal(await saveDiary(h.db,"member",rid,order.id,d.diary),false);
 const privateRoute="/admin/feedback/"+rid+"/orders/"+order.id+"/diary";assert.equal((await h.req(privateRoute,{token:alice.token})).status,404);await stepUp(h,owner);assert.equal((await h.req(privateRoute,{token:owner.token})).json.diary.details.reflection,"PRIVATE diary note");
 assert.ok((await createBusyBlock(h.db,{label:"Break",start_at:new Date(start.getTime()+35*60000).toISOString(),end_at:new Date(start.getTime()+50*60000).toISOString()},now)).error);
 }}
 const near=await createServiceOrder(h.db,"member",rid,{quote_id:"diary-q2",mode:"live",start_at:new Date(start.getTime()+35*60000).toISOString(),minutes:30,terms:"Agreed arrangements and terms.",confirmed:true},now);assert.ok(near.error);
 const block=await createBusyBlock(h.db,{label:"Unavailable",start_at:new Date(start.getTime()+60*60000).toISOString(),end_at:new Date(start.getTime()+120*60000).toISOString()},now);assert.ok(block.id);
 assert.ok((await createServiceOrder(h.db,"member",rid,{quote_id:"diary-q2",mode:"live",start_at:new Date(start.getTime()+70*60000).toISOString(),minutes:30,terms:"Agreed arrangements and terms.",confirmed:true},now)).error);
});

test("private time offers exclude conflicts and reserve only an offered slot with server terms",async()=>{
 const {h}=await ownerSetup(),alice=await h.register("slots-alice@example.com","Alice"),bob=await h.register("slots-bob@example.com","Bob");
 const {offerSlots,readSlots,selectSlot}=await import("../src/supportSlots.ts");
 const {createBusyBlock}=await import("../src/supportDiary.ts");
 const now=new Date(),start=new Date(now.getTime()+48*3600000),s1=start.toISOString(),s2=new Date(start.getTime()+3600000).toISOString(),when=now.toISOString();
 const r=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body:{kind:"learning-support",subject:"Science",year:"Year 5",service:"Live online support",detail:"Understanding the solar system",consent:true}});
 assert.equal(r.status,201);const id=r.json.id,qid="slot-q";
 h.db.raw.prepare("INSERT INTO learning_support_quotes(id,feedback_id,scope,delivery,amount_cents,status,created_at,expires_at) VALUES(?,?,?,?,?,'interested',?,?)").run(qid,id,"Solar system","Online",1500,when,new Date(now.getTime()+7*86400000).toISOString());
 const b={starts:[s1,s2],minutes:30,prep_minutes:10,wrap_minutes:10,learner_label:"Private learner",terms:"Agreed arrangements and terms.",confirmed:true};
 const first=await offerSlots(h.db,"member",id,qid,b,now);assert.ok(first.id,JSON.stringify(first));
 const second=await offerSlots(h.db,"member",id,qid,b,now);assert.ok(second.id);
 assert.ok((await selectSlot(h.db,"member",id,qid,{offer_id:first.id,start_at:s1,confirmed:true},now)).error);
 assert.ok((await createBusyBlock(h.db,{label:"Busy",start_at:new Date(start.getTime()-60000).toISOString(),end_at:new Date(start.getTime()+60000).toISOString()},now)).id);
 const offer=await readSlots(h.db,"member",id,qid,now);assert.deepEqual(offer.starts,[s2]);assert.equal(offer.learner_label,undefined);
 assert.equal((await h.req("/learning-support/"+id+"/quotes/"+qid+"/slots",{admin:false,token:bob.token})).status,404);
 assert.ok((await selectSlot(h.db,"member",id,qid,{offer_id:second.id,start_at:s1,confirmed:true},now)).error);
 const selected=await selectSlot(h.db,"member",id,qid,{offer_id:second.id,start_at:s2,confirmed:true,amount_cents:1},now);assert.ok(selected.id,JSON.stringify(selected));
 const o=h.db.raw.prepare("SELECT amount_cents,status FROM support_service_orders WHERE id=?").get(selected.id);assert.equal(o.amount_cents,1500);assert.equal(o.status,"awaiting_confirmation");
 assert.ok((await selectSlot(h.db,"member",id,qid,{offer_id:second.id,start_at:s2,confirmed:true},now)).error);
});

test("multi-lesson package atomically reserves all slots and one invoice confirms every session",async()=>{
 const {h,owner}=await ownerSetup(),alice=await h.register("package-alice@example.com","Alice");
 const {createPackage}=await import("../src/supportPackages.ts");
 const {createBusyBlock,readDiary}=await import("../src/supportDiary.ts");
 const {createServiceOrder,confirmServiceOrder,recordManualInvoice,verifyManualInvoice,listOrders,completeOrder}=await import("../src/supportOrders.ts");
 const r=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body:{kind:"learning-support",subject:"Mathematics",year:"Year 5",service:"Live online support",detail:"Help with equivalent fractions.",consent:true}});assert.equal(r.status,201);const rid=r.json.id;
 await stepUp(h,owner);
 const lesson={title:"Fractions",objective:"Compare fractions",activities:"Draw fraction strips",check:"Explain equivalence",home_practice:"Draw another example",minutes:30,guide:"Tutor works through examples",answers:"Private answers"};
 const plan={title:"Fractions",goal:"Compare fractions",subject:"Mathematics",year_level:"Year 5",lessons:[lesson,{...lesson,title:"Apply fractions"}]};
 const q=await h.req("/admin/feedback/"+rid+"/quotes",{method:"POST",token:owner.token,body:{scope:"Two guided mathematics lessons",delivery:"Online tutoring package",amount_cents:5000,valid_days:7,confirmed:true,plan,plan_reviewed:true}});assert.equal(q.status,201,JSON.stringify(q.json));const qid=q.json.id;
 assert.equal((await h.req("/learning-support/"+rid+"/quotes/"+qid+"/respond",{method:"POST",admin:false,token:alice.token,body:{response:"interested",confirmed:true}})).status,200);
 const now=new Date(),s1=new Date(now.getTime()+48*3600000).toISOString(),s2=new Date(now.getTime()+72*3600000).toISOString(),s3=new Date(now.getTime()+96*3600000).toISOString();
 const b={quote_id:qid,starts:[s1,s2],learner_label:"Learner",prep_minutes:10,wrap_minutes:10,terms:"Agreed package arrangements and terms.",confirmed:true};
 assert.ok((await createServiceOrder(h.db,"member",rid,{...b,mode:"live",start_at:s1,minutes:30},now)).error);
 assert.ok((await createBusyBlock(h.db,{label:"Unavailable",start_at:s2,end_at:new Date(Date.parse(s2)+60000).toISOString()},now)).id);
 assert.ok((await createPackage(h.db,"member",rid,b,now)).error);assert.equal((await listOrders(h.db,"member",rid)).length,0);
 const made=await createPackage(h.db,"member",rid,{...b,starts:[s1,s3]},now);assert.ok(made.id,JSON.stringify(made));
 const rows=await listOrders(h.db,"member",rid);assert.equal(rows.length,2);assert.equal(rows[0].amount_cents,5000);assert.equal(rows[1].amount_cents,0);
 assert.equal(await confirmServiceOrder(h.db,"member",rid,rows[1].id,now),false);
 assert.equal(await confirmServiceOrder(h.db,"member",rid,made.id,now),true);
 assert.equal((await listOrders(h.db,"member",rid))[1].status,"confirmed");
 assert.ok((await recordManualInvoice(h.db,"member",rid,made.id,{reference:"PKG-TEST",due_at:new Date(now.getTime()+24*3600000).toISOString(),sent_in_square:true},owner.id,now)).ok);
 assert.equal(await verifyManualInvoice(h.db,"member",rid,made.id,{reference:"PKG-TEST",amount_cents:5000,paid_in_square:true},owner.id,now),true);
 assert.ok((await listOrders(h.db,"member",rid)).every(o=>o.status==="paid"));
 assert.equal((await readDiary(h.db,"member",rid,rows[1].id)).diary.details.agenda.includes("Apply fractions"),true);
 assert.ok((await createPackage(h.db,"member",rid,{...b,starts:[s1,s3]},now)).error);
});

test("per-lesson instalments isolate paid and cancelled sessions and preserve quoted total",async()=>{
 const {h,owner}=await ownerSetup(),alice=await h.register("installment-alice@example.com","Alice");
 const {createPackage}=await import("../src/supportPackages.ts");
 const {confirmServiceOrder,recordManualInvoice,verifyManualInvoice,listOrders,cancelManualInvoiceOrder,hasOrder,cancelUnstartedOrder}=await import("../src/supportOrders.ts");
 const r=await h.req("/feedback",{method:"POST",admin:false,token:alice.token,body:{kind:"learning-support",subject:"Mathematics",year:"Year 5",service:"Live online support",detail:"Help with equivalent fractions.",consent:true}});assert.equal(r.status,201);const rid=r.json.id;
 await stepUp(h,owner);
 const lesson={title:"Fractions",objective:"Compare fractions",activities:"Draw fraction strips",check:"Explain equivalence",home_practice:"Draw another example",minutes:30,guide:"Tutor works through examples",answers:"Private answers"};
 const plan={title:"Fractions",goal:"Compare fractions",subject:"Mathematics",year_level:"Year 5",lessons:[lesson,{...lesson,title:"Apply fractions"},{...lesson,title:"Practise"}]};
 const q=await h.req("/admin/feedback/"+rid+"/quotes",{method:"POST",token:owner.token,body:{scope:"Three guided mathematics lessons",delivery:"Online tutoring package",amount_cents:7501,valid_days:7,confirmed:true,plan,plan_reviewed:true}});assert.equal(q.status,201,JSON.stringify(q.json));const qid=q.json.id;
 assert.equal((await h.req("/learning-support/"+rid+"/quotes/"+qid+"/respond",{method:"POST",admin:false,token:alice.token,body:{response:"interested",confirmed:true}})).status,200);
 const now=new Date(),starts=[48,72,96].map(hours=>new Date(now.getTime()+hours*3600000).toISOString());
 const b={quote_id:qid,starts,learner_label:"Learner",prep_minutes:10,wrap_minutes:10,terms:"Agreed package arrangements and terms.",payment_mode:"installments",deadline_hours:24,confirmed:true};
 const made=await createPackage(h.db,"member",rid,b,now);assert.ok(made.id,JSON.stringify(made));
 let rows=await listOrders(h.db,"member",rid);assert.deepEqual(rows.map(o=>o.amount_cents),[2501,2500,2500]);assert.ok(rows.every(o=>o.installment));
 assert.equal(await confirmServiceOrder(h.db,"member",rid,rows[1].id,now),false);assert.equal(await confirmServiceOrder(h.db,"member",rid,made.id,now),true);
 for(const [i,o] of rows.entries())assert.ok((await recordManualInvoice(h.db,"member",rid,o.id,{reference:"INST-"+i,due_at:o.installment_due_at,sent_in_square:true},owner.id,now)).ok);
 assert.equal(await verifyManualInvoice(h.db,"member",rid,rows[1].id,{reference:"INST-1",amount_cents:2500,paid_in_square:true},owner.id,now),true);
 assert.equal(await cancelManualInvoiceOrder(h.db,"member",rid,made.id,{cancelled_unpaid_in_square:true},now),true);
 rows=await listOrders(h.db,"member",rid);assert.deepEqual(rows.map(o=>o.status),["cancelled","paid","confirmed"]);assert.equal(await hasOrder(h.db,"member",qid),true);
 assert.ok((await createPackage(h.db,"member",rid,b,now)).error);
 assert.equal(await verifyManualInvoice(h.db,"member",rid,rows[2].id,{reference:"INST-2",amount_cents:2500,paid_in_square:true},owner.id,new Date(Date.parse(rows[2].installment_due_at)+1000)),false);
});
