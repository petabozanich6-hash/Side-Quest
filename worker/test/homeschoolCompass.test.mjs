import { test } from "node:test";
import assert from "node:assert/strict";
import { Hono } from "hono";
import { makeDb } from "./fakeD1.mjs";
import { registerHomeschoolCompass } from "../src/homeschoolCompass.ts";

const now = "2026-10-16T00:00:00Z";
function seed(db, fam, child, jurisdiction) {
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,jurisdiction) VALUES (?,?,?,?,?)").run(fam, "Test family", "owner-" + fam, now, jurisdiction);
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at) VALUES (?,?,?,?,?,?,?,?)").run(child, fam, child, child, "test", "S2", "3", now);
}
function harness() {
  const db = makeDb();
  seed(db, "family1", "kid1", "NSW");
  seed(db, "family1a", "kid1a", "NSW");
  seed(db, "family2", "kid2", "ACT");
  const app = new Hono();
  const guards = {
    auth: async (c, next) => { c.set("user", { id: "parent", family_id: c.req.header("x-family") || "family1", role: c.req.header("x-role") || "parent", name: "Pat" }); await next(); },
    parent: async (c, next) => c.get("user").role === "parent" ? next() : c.json({ detail: "Parent only" }, 403),
    child: async (_c, next) => next(),
  };
  registerHomeschoolCompass(app, guards);
  const request = (path, init = {}, fam = "family1", role = "parent") => app.request("http://example.test" + path, { ...init, headers: { "content-type": "application/json", "x-family": fam, "x-role": role, ...(init.headers || {}) } }, { DB: db });
  return { db, request };
}
const valid = { completed_steps: ["understand", "prepare"], registration_status: "preparing", submitted_on: "2026-10-16", approved_on: null, expires_on: "2027-10-16", notes: "Review documents" };

test("Compass saves and reads only the family-owned child's state-specific record", async () => {
  const { request } = harness();
  let r = await request("/api/compass/kid1", { method: "PUT", body: JSON.stringify(valid) });
  assert.equal(r.status, 200, await r.text());
  r = await request("/api/compass");
  assert.equal(r.status, 200);
  let j = await r.json();
  assert.equal(j.jurisdiction, "NSW");
  assert.equal(j.progress.length, 1);
  assert.deepEqual(j.progress[0].completed_steps, valid.completed_steps);
  assert.equal(j.progress[0].expires_on, "2027-10-16");
  r = await request("/api/compass", {}, "family2");
  j = await r.json();
  assert.equal(j.jurisdiction, "ACT");
  assert.equal(j.progress.length, 0, "another family's record cannot appear in results");
});

test("Compass rejects cross-family writes, child-role access, invalid dates and made-up steps", async () => {
  const { request } = harness();
  let r = await request("/api/compass/kid2", { method: "PUT", body: JSON.stringify(valid) });
  assert.equal(r.status, 404, "cannot modify another family's child");
  r = await request("/api/compass/kid1", { method: "PUT", body: JSON.stringify(valid) }, "family1", "child");
  assert.equal(r.status, 403, "only parents may write");
  r = await request("/api/compass", {}, "family1", "child");
  assert.equal(r.status, 403, "only parents may read");
  r = await request("/api/compass/kid1", { method: "PUT", body: JSON.stringify({ ...valid, submitted_on: "2026-02-30" }) });
  assert.equal(r.status, 400);
  r = await request("/api/compass/kid1", { method: "PUT", body: JSON.stringify({ ...valid, completed_steps: ["invented"] }) });
  assert.equal(r.status, 400);
  r = await request("/api/compass/kid1", { method: "PUT", body: JSON.stringify({ ...valid, registration_status: "government_approved" }) });
  assert.equal(r.status, 400);
});

test("Compass progress belongs to a jurisdiction and does not bleed into the next state", async () => {
  const { db, request } = harness();
  let r = await request("/api/compass/kid1", { method: "PUT", body: JSON.stringify(valid) });
  assert.equal(r.status, 200);
  db.raw.prepare("UPDATE families SET jurisdiction='ACT' WHERE id='family1'").run();
  r = await request("/api/compass");
  let j = await r.json();
  assert.equal(j.jurisdiction, "ACT");
  assert.equal(j.progress.length, 0);
  db.raw.prepare("UPDATE families SET jurisdiction='NSW' WHERE id='family1'").run();
  r = await request("/api/compass");
  j = await r.json();
  assert.equal(j.progress.length, 1, "original progress is preserved if the family switches back");
});
