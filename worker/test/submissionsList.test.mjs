// The submissions list must stay well under D1's 1,000-queries-per-request limit for busy families,
// and still attach the right lesson and child to every row.
import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";

const ORIGIN = "http://localhost:8787";

test("listing 450 submissions uses batched lookups and keeps every lesson and child", async () => {
  const db = makeDb();
  let queries = 0;
  const counted = { ...db, prepare: (sql) => { queries++; return db.prepare(sql); } };
  const env = { DB: counted, JWT_SECRET: "test-only-secret" };
  clearSettingsCache();
  clearUsageCache();
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  const req = async (path, { method = "GET", token, body } = {}) => {
    const h = { "content-type": "application/json", origin: ORIGIN };
    if (token) h.authorization = `Bearer ${token}`;
    const r = await worker.fetch(new Request(ORIGIN + "/api" + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined }), env, ctx);
    return { status: r.status, json: await r.json().catch(() => null) };
  };

  const reg = await req("/auth/register", { method: "POST", body: { email: "busy@example.com", password: "Correct-horse-9", name: "P", jurisdiction: "NSW" } });
  assert.equal(reg.status, 200, JSON.stringify(reg.json));
  const fid = reg.json.user.family_id;
  const kid = await req("/students", { method: "POST", token: reg.json.token, body: { name: "Busy Kid", username: "busykid", pin: "1234", stage: "S2" } });
  assert.equal(kid.status, 200, JSON.stringify(kid.json));
  const sid = kid.json.id;

  const now = Date.now();
  const lesson = db.raw.prepare("INSERT INTO lessons (id, family_id, title, stage, learning_area, status, data, created_at) VALUES (?, ?, ?, 'S2', 'Mathematics', 'published', '{}', ?)");
  const assign = db.raw.prepare("INSERT INTO assignments (id, family_id, student_id, lesson_id, status, created_at) VALUES (?, ?, ?, ?, 'submitted', ?)");
  const sub = db.raw.prepare("INSERT INTO submissions (id, family_id, assignment_id, student_id, lesson_id, response_text, status, submitted_at) VALUES (?, ?, ?, ?, ?, 'done', 'submitted', ?)");
  db.raw.exec("BEGIN");
  for (let i = 0; i < 450; i++) {
    const ts = new Date(now - i * 60000).toISOString();
    lesson.run(`L${i}`, fid, `Lesson ${i}`, ts);
    assign.run(`A${i}`, fid, sid, `L${i}`, ts);
    sub.run(`S${i}`, fid, `A${i}`, sid, `L${i}`, ts);
  }
  db.raw.exec("COMMIT");

  queries = 0;
  const list = await req("/submissions", { token: reg.json.token });
  assert.equal(list.status, 200, JSON.stringify(list.json));
  assert.equal(list.json.length, 450);
  for (const s of list.json) {
    assert.equal(s.lesson?.id, s.lesson_id, "each row keeps its own lesson");
    assert.equal(s.student?.name, "Busy Kid");
  }
  assert.ok(queries < 100, `expected batched lookups, saw ${queries} queries`);
});
