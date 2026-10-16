// Sign-in safety through the real Worker: a password reset ends every session, and file links carry a
// files-only token instead of the sign-in token.
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";

const ORIGIN = "http://localhost:8787";
const PW = "Correct-horse-9";

function harness() {
  const db = makeDb();
  const env = { DB: db, JWT_SECRET: "test-only-secret" };
  clearSettingsCache();
  clearUsageCache();
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  async function req(path, { method = "GET", token, body } = {}) {
    const h = { "content-type": "application/json", origin: ORIGIN };
    if (token) h.authorization = `Bearer ${token}`;
    const r = await worker.fetch(new Request(ORIGIN + "/api" + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined }), env, ctx);
    let json = null;
    try { json = await r.json(); } catch { /* empty */ }
    return { status: r.status, json };
  }
  return { db, req };
}

test("resetting the password signs the whole family out everywhere", async () => {
  const h = harness();
  const reg = await h.req("/auth/register", { method: "POST", body: { email: "reset@example.com", password: PW, name: "P", jurisdiction: "NSW" } });
  assert.equal(reg.status, 200, JSON.stringify(reg.json));
  const stolen = reg.json.token;
  assert.equal((await h.req("/auth/me", { token: stolen })).status, 200);
  const token = "reset-token-for-test-0123456789";
  h.db.raw.prepare("INSERT INTO password_resets (id,user_id,token_hash,expires_at,created_at) VALUES (?,?,?,?,?)")
    .run("r1", reg.json.user.id, createHash("sha256").update(token).digest("hex"), new Date(Date.now() + 3600e3).toISOString(), new Date().toISOString());
  const r = await h.req("/auth/reset-password", { method: "POST", body: { token, password: "A-brand-new-pass-7" } });
  assert.equal(r.status, 200, JSON.stringify(r.json));
  assert.equal((await h.req("/auth/me", { token: stolen })).status, 401, "old session must end");
  const again = await h.req("/auth/login", { method: "POST", body: { email: "reset@example.com", password: "A-brand-new-pass-7" } });
  assert.equal(again.status, 200);
  assert.equal((await h.req("/auth/me", { token: again.json.token })).status, 200);
});

test("file links: a files-only token, which never works as a sign-in and dies with sign-out-everywhere", async () => {
  const h = harness();
  const reg = await h.req("/auth/register", { method: "POST", body: { email: "files@example.com", password: PW, name: "P", jurisdiction: "NSW" } });
  const me = await h.req("/auth/me", { token: reg.json.token });
  const ft = me.json.file_token;
  assert.ok(ft && ft !== reg.json.token);
  assert.equal((await h.req("/lessons", { token: ft })).status, 401, "file token must not open the API");
  // No bucket in this harness: a valid token reaches the lookup (404), an invalid one is refused (401).
  assert.equal((await h.req(`/files/nope?ft=${encodeURIComponent(ft)}`)).status, 404);
  assert.equal((await h.req(`/files/nope?ft=${encodeURIComponent(reg.json.token)}`)).status, 401, "sign-in token is not a file token");
  assert.equal((await h.req(`/files/nope?auth=${encodeURIComponent(reg.json.token)}`)).status, 401, "sign-in token no longer accepted in URLs");
  h.db.raw.prepare("INSERT INTO family_admin_state (family_id, auth_version, updated_at) VALUES (?, 5, ?)").run(reg.json.user.family_id, new Date().toISOString());
  assert.equal((await h.req(`/files/nope?ft=${encodeURIComponent(ft)}`)).status, 401, "revoked with the family's sessions");
});

test("a Google-only parent can delete their account after a fresh sign-in, not with an old session", async () => {
  const { sign } = await import("hono/jwt");
  const h = harness();
  const reg = await h.req("/auth/register", { method: "POST", body: { email: "google@example.com", password: PW, name: "G", jurisdiction: "NSW" } });
  const { id, family_id } = reg.json.user;
  h.db.raw.prepare("UPDATE users SET password_hash = NULL, oauth_provider = 'google' WHERE id = ?").run(id);
  assert.equal((await h.req("/auth/me", { token: reg.json.token })).json.has_password, false);
  const old = await sign({ sub: id, role: "parent", family_id, sid: crypto.randomUUID(), av: 0, exp: Math.floor(Date.now() / 1000) + 30 * 86400 - 3600 }, "test-only-secret");
  const refused = await h.req("/auth/delete-account", { method: "POST", token: old, body: { confirm: "DELETE" } });
  assert.equal(refused.status, 403);
  assert.equal(refused.json.code, "REAUTH_REQUIRED");
  h.db.raw.prepare("INSERT INTO password_resets (id,user_id,token_hash,expires_at,created_at) VALUES ('pr1',?,'h',?,?)").run(id, new Date().toISOString(), new Date().toISOString());
  const done = await h.req("/auth/delete-account", { method: "POST", token: reg.json.token, body: { confirm: "DELETE" } });
  assert.equal(done.status, 200, JSON.stringify(done.json));
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM users WHERE id = ?").get(id).n, 0);
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM password_resets WHERE user_id = ?").get(id).n, 0, "parent-keyed rows are erased too");
});

test("assignment revocation is parent-only and family-scoped; revoked work cannot be reopened", async () => {
  const h = harness();
  const reg = await h.req("/auth/register", { method: "POST", body: { email: "revoke@example.com", password: PW, name: "P", jurisdiction: "NSW" } });
  const other = await h.req("/auth/register", { method: "POST", body: { email: "other-revoke@example.com", password: PW, name: "Q", jurisdiction: "NSW" } });
  const token = reg.json.token, fid = reg.json.user.family_id;
  h.db.raw.prepare("UPDATE families SET plan='INTERNAL'").run();
  const kid = await h.req("/students", { method: "POST", token, body: { name: "Mia", username: "revoke-mia", pin: "4321", stage: "S2" } });
  assert.equal(kid.status, 200, JSON.stringify(kid.json));
  const login = await h.req("/auth/child-login", { method: "POST", body: { username: "revoke-mia", pin: "4321" } });
  const ct = login.json.token;
  const ts = new Date().toISOString();
  h.db.raw.prepare("INSERT INTO lessons (id,family_id,title,created_at) VALUES ('rl',?,'Fractions',?)").run(fid, ts);
  h.db.raw.prepare("INSERT INTO assignments (id,family_id,student_id,lesson_id,status,created_at) VALUES ('ra',?,?,'rl','in_progress',?)").run(fid, kid.json.id, ts);
  const path = "/assignments/ra";
  assert.equal((await h.req(path, { method: "DELETE" })).status, 401);
  assert.equal((await h.req(path, { method: "DELETE", token: ct })).status, 403);
  assert.equal((await h.req(path, { method: "DELETE", token: other.json.token })).status, 404);
  assert.equal((await h.req(path, { method: "DELETE", token })).status, 200);
  assert.equal((await h.req(path, { token: ct })).status, 404);
  assert.equal((await h.req("/assignments", { token: ct })).json.length, 0);
  for (const userToken of [ct, token]) {
    await h.req(path + "/status?status=in_progress", { method: "PUT", token: userToken });
    assert.equal((await h.req(path, { token })).json.status, "revoked");
  }
  assert.equal((await h.req(path + "/draft", { method: "PUT", token: ct, body: { answer: "late" } })).status, 404);
  assert.equal((await h.req("/submissions", { method: "POST", token: ct, body: { assignment_id: "ra" } })).status, 404);
  assert.equal(h.db.raw.prepare("SELECT title FROM lessons WHERE id='rl'").get().title, "Fractions");
});
