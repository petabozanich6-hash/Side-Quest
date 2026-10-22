// A child's session must never receive answer keys, quiz answers or the parent's private notes,
// on any route the child can reach (dashboard, own profile, submissions list).
import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";

const ORIGIN = "http://localhost:8787";

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

test("child routes never expose parent notes, answer keys or quiz answers", async () => {
  const h = harness();
  const reg = await h.req("/auth/register", { method: "POST", body: { email: "privacy@example.com", password: "Correct-horse-9", name: "P", jurisdiction: "NSW" } });
  assert.equal(reg.status, 200, JSON.stringify(reg.json));
  const parent = reg.json.token;
  const fid = reg.json.user.family_id;

  const kid = await h.req("/students", { method: "POST", token: parent, body: { name: "Kid", username: "privacykid", pin: "1234", stage: "S2" } });
  assert.equal(kid.status, 200, JSON.stringify(kid.json));
  const sid = kid.json.id;
  h.db.raw.prepare("UPDATE students SET notes = ? WHERE id = ?").run("PRIVATE PARENT NOTE", sid);

  const now = new Date().toISOString();
  const data = JSON.stringify({
    source: "parent", builder: true,
    answer_key: "SECRET ANSWER KEY",
    parent_notes: "SECRET PARENT NOTES",
    quiz: [{ question: "2 + 2?", type: "multiple_choice", options: ["3", "4"], correct_index: 1, explanation: "SECRET 4" }],
  });
  h.db.raw.prepare("INSERT INTO lessons (id, family_id, title, stage, learning_area, status, data, created_at) VALUES ('L1', ?, 'Adding', 'S2', 'Mathematics', 'published', ?, ?)").run(fid, data, now);
  h.db.raw.prepare("INSERT INTO assignments (id, family_id, student_id, lesson_id, status, created_at) VALUES ('A1', ?, ?, 'L1', 'submitted', ?)").run(fid, sid, now);
  h.db.raw.prepare("INSERT INTO submissions (id, family_id, assignment_id, student_id, lesson_id, response_text, status, parent_feedback, submitted_at) VALUES ('S1', ?, 'A1', ?, 'L1', 'my answer', 'reviewed', 'Well done', ?)").run(fid, sid, now);

  const login = await h.req("/auth/child-login", { method: "POST", body: { username: "privacykid", pin: "1234" } });
  assert.equal(login.status, 200, JSON.stringify(login.json));
  const child = login.json.token;

  const leaks = (label, body) => {
    const text = JSON.stringify(body);
    for (const secret of ["PRIVATE PARENT NOTE", "SECRET ANSWER KEY", "SECRET PARENT NOTES", "SECRET 4", "correct_index"]) {
      assert.ok(!text.includes(secret), `${label} leaked ${secret}`);
    }
  };

  const dash = await h.req("/dashboard/child", { token: child });
  assert.equal(dash.status, 200, JSON.stringify(dash.json));
  leaks("dashboard", dash.json);

  const me = await h.req(`/students/${sid}`, { token: child });
  assert.equal(me.status, 200, JSON.stringify(me.json));
  assert.equal(me.json.name, "Kid");
  leaks("own profile", me.json);

  const subs = await h.req("/submissions", { token: child });
  assert.equal(subs.status, 200, JSON.stringify(subs.json));
  assert.equal(subs.json.length, 1);
  leaks("submissions list", subs.json);

  // The parent still sees their own notes and the full lesson.
  const parentView = await h.req(`/students/${sid}`, { token: parent });
  assert.equal(parentView.json.notes, "PRIVATE PARENT NOTE");
  const parentSubs = await h.req("/submissions", { token: parent });
  assert.match(JSON.stringify(parentSubs.json), /SECRET ANSWER KEY/);
});
