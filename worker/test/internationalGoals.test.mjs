import { test } from "node:test";
import assert from "node:assert/strict";
import { Hono } from "hono";
import { makeDb } from "./fakeD1.mjs";
import { registerInternationalGoals } from "../src/internationalGoals.ts";
import { normJurisdiction, frameworkFor } from "../src/data/jurisdictions.ts";
import { catalogueFor } from "../src/outcomeTracker.ts";
import { accessPolicy } from "../src/membershipAccess.ts";

const TS = "2026-10-19T00:00:00.000Z";
function harness() {
  const db = makeDb();
  for (const [fam, jurisdiction] of [["one", "OTHER"], ["two", "OTHER"], ["australia", "NSW"]]) {
    db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,jurisdiction) VALUES (?,?,?,?,?)")
      .run(fam, "Family", "u-" + fam, TS, jurisdiction);
    db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at) VALUES (?,?,?,?,?,?,?,?)")
      .run("kid-" + fam, fam, "Kid", "kid-" + fam, "test", "S2", "3", TS);
  }
  const app = new Hono();
  const guards = {
    auth: async (c, next) => { c.set("user", { id: "parent", family_id: c.req.header("x-family") || "one", role: c.req.header("x-role") || "parent" }); await next(); },
    parent: async (c, next) => c.get("user").role === "parent" ? next() : c.json({ detail: "Parent only" }, 403),
    child: async (_c, next) => next(),
  };
  registerInternationalGoals(app, guards);
  const request = (path, init = {}, fam = "one", role = "parent") =>
    app.request("http://example.test" + path, { ...init, headers: { "content-type": "application/json", "x-family": fam, "x-role": role, ...(init.headers || {}) } }, { DB: db });
  const post = (path, body, fam = "one", role = "parent") => request(path, { method: "POST", body: JSON.stringify(body) }, fam, role);
  const put = (path, body, fam = "one") => request(path, { method: "PUT", body: JSON.stringify(body) }, fam);
  return { db, request, post, put };
}

test("OTHER is valid but never maps families onto an Australian outcome catalogue", () => {
  assert.equal(normJurisdiction(" other "), "OTHER");
  assert.equal(frameworkFor("OTHER").codes, "none");
  assert.equal(catalogueFor("OTHER").available, false);
  assert.equal(normJurisdiction("another country"), null);
  assert.equal(accessPolicy("POST", "/api/international/goals/kid-one"), "paid");
  assert.equal(accessPolicy("POST", "/api/international/goals/kid-one/goal-id/evidence"), "paid");
  assert.equal(accessPolicy("PUT", "/api/international/goals/kid-one/goal-id"), "paid");
});

test("international family creates goals, attaches observations and explicitly confirms achievement", async () => {
  const { request, post, put } = harness();
  const base = "/api/international/goals/kid-one";
  let r = await post(base, { title: "Explain plant growth", learning_area: "Science", description: "Observe seeds growing." });
  assert.equal(r.status, 201, "goal creation must succeed");
  const { id } = await r.json();
  r = await request(base);
  let data = await r.json();
  assert.equal(data.mode, "parent_defined");
  assert.equal(data.goals.length, 1);
  assert.equal(data.goals[0].status, "not_started");
  r = await put(base + "/" + id, { status: "achieved", confirmation_note: "She understands plants." });
  assert.equal(r.status, 409, "cannot achieve without evidence");
  r = await post(base + "/" + id + "/evidence", { title: "Seed diary", note: "Explained growth with examples.", occurred_on: "2026-10-18" });
  assert.equal(r.status, 201, await r.text());
  r = await put(base + "/" + id, { status: "achieved", confirmation_note: "Explained germination using her diary." });
  assert.equal(r.status, 200, await r.text());
  data = await (await request(base)).json();
  assert.equal(data.goals[0].status, "achieved");
  assert.equal(data.goals[0].evidence.length, 1);
  assert.equal(data.goals[0].evidence[0].title, "Seed diary");
});

test("linked Evidence Backpack notes are verified for child and family, and stay intact after unlink", async () => {
  const { db, request, post } = harness();
  db.raw.prepare("INSERT INTO evidence_notes (id,family_id,student_id,title,learning_area,notes,occurred_on,created_at) VALUES (?,?,?,?,?,?,?,?)")
    .run("note-one", "one", "kid-one", "Garden project", "Science", "We grew seeds.", "2026-10-18", TS);
  db.raw.prepare("INSERT INTO evidence_notes (id,family_id,student_id,title,learning_area,notes,occurred_on,created_at) VALUES (?,?,?,?,?,?,?,?)")
    .run("note-two", "two", "kid-two", "Other family's private notes", "Science", "Private", "2026-10-18", TS);
  const base = "/api/international/goals/kid-one";
  const { id } = await (await post(base, { title: "Plants" })).json();
  let r = await post(base + "/" + id + "/evidence", { evidence_note_id: "note-two" });
  assert.equal(r.status, 404, "cannot attach another family's note");
  r = await post(base + "/" + id + "/evidence", { evidence_note_id: "note-one" });
  assert.equal(r.status, 201);
  const goal = (await (await request(base)).json()).goals[0];
  assert.equal(goal.evidence[0].title, "Garden project");
  r = await request(base + "/" + id + "/evidence/" + goal.evidence[0].id, { method: "DELETE" });
  assert.equal(r.status, 200);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM evidence_notes WHERE id='note-one'").get().n, 1);
});

test("only parents can use international goals; family and child boundaries cannot be crossed", async () => {
  const { request, post, put } = harness();
  const base = "/api/international/goals/kid-one";
  const { id } = await (await post(base, { title: "Read stories" })).json();
  assert.equal((await request(base, {}, "two")).status, 404, "other family cannot list child's goals");
  assert.equal((await request(base, {}, "australia")).status, 404, "Australian family cannot access international mode");
  assert.equal((await request(base, {}, "one", "child")).status, 403, "child cannot read parent-only goals");
  assert.equal((await post(base, { title: "Secret" }, "one", "child")).status, 403, "child cannot create goals");
  assert.equal((await put(base + "/" + id, { title: "Changed" }, "two")).status, 404, "other family cannot update");
  assert.equal((await request(base + "/" + id, { method: "DELETE" }, "two")).status, 404, "other family cannot delete");
  assert.equal((await request(base)).status, 200, "original family retains its record");
});
