import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";
import { clearViewAsCache } from "../src/viewAs.ts";

let seq = 0;
function harness() {
  const db = makeDb();
  const env = { DB: db, JWT_SECRET: "view-as-test-secret" };
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  clearSettingsCache(); clearUsageCache(); clearViewAsCache();
  async function req(path, token, method = "GET", body) {
    const headers = {};
    if (token) headers.authorization = "Bearer " + token;
    if (body !== undefined) headers["content-type"] = "application/json";
    return worker.fetch(new Request("http://localhost:8787/api" + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }), env, ctx);
  }
  async function parent(plan) {
    const n = ++seq;
    const r = await req("/auth/register", undefined, "POST", { name: "View Parent " + n, email: "viewas" + n + "@example.test", password: "Test-password-123", jurisdiction: "NSW" });
    assert.equal(r.status, 200);
    const data = await r.json();
    db.raw.prepare("UPDATE families SET plan=? WHERE id=?").run(plan, data.user.family_id);
    return { token: data.token, id: data.user.family_id, userId: data.user.id };
  }
  const makeOwner = (p) => db.raw.prepare("INSERT INTO user_roles(id,user_id,role,granted_by,reason) VALUES(?,?,'owner','test','test')").run(crypto.randomUUID(), p.userId);
  return { req, db, parent, makeOwner };
}

const planOf = async (h, p) => (await (await h.req("/account/plan", p.token)).json()).effective_plan;

test("Only the owner can use View site as, and it only changes the owner's own family", async () => {
  const h = harness();
  const other = await h.parent("ACTIVE_MONTHLY");
  assert.equal((await h.req("/owner/view-as", other.token)).status, 404);
  assert.equal((await h.req("/owner/view-as", other.token, "PUT", { mode: "free" })).status, 404);

  const owner = await h.parent("INTERNAL"); h.makeOwner(owner);
  const start = await (await h.req("/owner/view-as", owner.token)).json();
  assert.equal(start.mode, "owner");
  assert.equal(await planOf(h, owner), "INTERNAL");

  assert.equal((await h.req("/owner/view-as", owner.token, "PUT", { mode: "bogus" })).status, 400);
  const on = await (await h.req("/owner/view-as", owner.token, "PUT", { mode: "free" })).json();
  assert.equal(on.mode, "free");
  assert.ok(on.expires_at);
  assert.equal(await planOf(h, owner), "FREE_PREVIEW");
  assert.equal(await planOf(h, other), "ACTIVE_MONTHLY", "other families are untouched");
  // Owner-only content shortcuts switch off while viewing as a family.
  assert.equal((await (await h.req("/handwriting-book", owner.token)).json()).unlocked, false);
  // The switch itself keeps working, so the owner can always get back.
  await h.req("/owner/view-as", owner.token, "PUT", { mode: "expired" });
  assert.equal(await planOf(h, owner), "PREVIEW_EXPIRED");
  await h.req("/owner/view-as", owner.token, "PUT", { mode: "member" });
  assert.equal(await planOf(h, owner), "ACTIVE_MONTHLY");
  const back = await (await h.req("/owner/view-as", owner.token, "PUT", { mode: "owner" })).json();
  assert.equal(back.mode, "owner");
  assert.equal(await planOf(h, owner), "INTERNAL");
  assert.equal((await (await h.req("/handwriting-book", owner.token)).json()).unlocked, true);
});

test("View site as switches itself off when it expires", async () => {
  const h = harness();
  const owner = await h.parent("INTERNAL"); h.makeOwner(owner);
  await h.req("/owner/view-as", owner.token, "PUT", { mode: "free" });
  h.db.raw.prepare("UPDATE owner_view_as SET expires_at=? WHERE family_id=?").run(new Date(Date.now() - 1000).toISOString(), owner.id);
  clearViewAsCache();
  assert.equal(await planOf(h, owner), "INTERNAL");
});
