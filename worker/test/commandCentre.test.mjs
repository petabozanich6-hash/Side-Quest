import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { registerCore } from "../src/core.ts";

function endpoint() {
  const handlers = {};
  const app = { get: (path, ...fns) => { handlers[path] = fns.at(-1); }, post: () => {}, put: () => {}, patch: () => {}, delete: () => {} };
  registerCore(app, null, null);
  return handlers["/api/owner/command-centre"];
}
function request(db, user) {
  return { env: { DB: db }, get: () => user, json: (data, status = 200) => ({ data, status }) };
}
function seed(db) {
  const insert = db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan) VALUES (?,?,?,?,?)");
  insert.run("owner", "Owner", "u_owner", "2026-10-15T00:00:00Z", "INTERNAL");
  insert.run("free", "Free", "u_free", "2026-10-15T00:00:00Z", "FREE_PREVIEW");
  insert.run("paid", "Paid", "u_paid", "2026-10-15T00:00:00Z", "ACTIVE_WEEKLY");
}
test("Command Centre only responds for the actual INTERNAL family owner", async () => {
  const db = makeDb();
  seed(db);
  const handler = endpoint();
  for (const user of [
    { id: "u_free", family_id: "free", role: "parent" },
    { id: "u_owner", family_id: "free", role: "parent" },
    { id: "u_not_owner", family_id: "owner", role: "parent" },
  ]) {
    const result = await handler(request(db, user));
    assert.equal(result.status, 403);
    assert.equal(result.data.families, undefined);
  }
  const result = await handler(request(db, { id: "u_owner", family_id: "owner", role: "parent" }));
  assert.equal(result.status, 200);
  assert.equal(result.data.families, 3);
  assert.equal(result.data.free_previews, 1);
  assert.equal(result.data.paid_families, 1);
  assert.equal(result.data.owner_families, 1);
  assert.equal(result.data.revenue, null);
  assert.equal(result.data.by_plan.ACTIVE_WEEKLY, 1);
  assert.ok(!JSON.stringify(result.data).includes("password_hash"));
});
