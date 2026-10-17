import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.ts";
import { makeDb } from "./fakeD1.mjs";

const ORIGIN = "http://localhost:8787";
function harness() {
  const db = makeDb();
  const env = { DB: db, JWT_SECRET: "planning-tests-secret" };
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  async function req(path, { method = "GET", token, body } = {}) {
    const headers = { "content-type": "application/json" };
    if (token) headers.authorization = `Bearer ${token}`;
    const response = await worker.fetch(new Request(ORIGIN + "/api" + path, {
      method, headers, body: body === undefined ? undefined : JSON.stringify(body),
    }), env, ctx);
    return { status: response.status, json: await response.json().catch(() => null) };
  }
  async function family(email) {
    const r = await req("/auth/register", { method: "POST", body: { email, password: "Testing-pass-99", name: "Parent", jurisdiction: "NSW" } });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    db.raw.prepare("UPDATE families SET plan='ACTIVE_MONTHLY', plan_period_end=? WHERE id=?")
      .run(new Date(Date.now() + 40 * 86400000).toISOString(), r.json.user.family_id);
    return { token: r.json.token, id: r.json.user.family_id };
  }
  async function student(family, username) {
    const r = await req("/students", { method: "POST", token: family.token,
      body: { name: username, username, stage: "S2", pin: "4321" } });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    return r.json.id;
  }
  async function lesson(family) {
    const r = await req("/lessons", { method: "POST", token: family.token,
      body: { title: "Fraction garden", learning_area: "Mathematics", stage: "S2", status: "ready",
        sections: [{ heading: "Learn", body: "Study fractions" }] } });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    return r.json.id;
  }
  async function assignment(family, child, lessonId) {
    const r = await req("/assignments", { method: "POST", token: family.token,
      body: { student_id: child, lesson_id: lessonId } });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    return r.json.id;
  }
  return { req, db, family, student, lesson, assignment };
}
const event = (student_id, title, date, start_time, duration_minutes = 45) =>
  ({ student_id, title, date, start_time, duration_minutes, event_type: "lesson" });

test("manual calendar scheduling keeps the real assignment day in sync, even after editing or removing", async () => {
  const h = harness(), f = await h.family("calendar-sync@example.com");
  const child = await h.student(f, "sync-child"), l = await h.lesson(f), aid = await h.assignment(f, child, l);
  const create = await h.req("/calendar", { method: "POST", token: f.token, body:
    { ...event(child, "Fraction garden", "2026-10-19", "09:00"), linked_lesson_id: l, linked_assignment_id: aid } });
  assert.equal(create.status, 200, JSON.stringify(create.json));
  let a = await h.req(`/assignments/${aid}`, { token: f.token });
  assert.equal(a.json.scheduled_date, "2026-10-19");
  const moved = await h.req(`/calendar/${create.json.id}`, { method: "PUT", token: f.token, body: { date: "2026-10-20" } });
  assert.equal(moved.status, 200, JSON.stringify(moved.json));
  a = await h.req(`/assignments/${aid}`, { token: f.token });
  assert.equal(a.json.scheduled_date, "2026-10-20");
  assert.equal((await h.req(`/calendar/${create.json.id}`, { method: "DELETE", token: f.token })).status, 200);
  a = await h.req(`/assignments/${aid}`, { token: f.token });
  assert.equal(a.json.scheduled_date, null);
});

test("change dates moves the linked session, rather than just the assignment label", async () => {
  const h = harness(), f = await h.family("move-date@example.com");
  const child = await h.student(f, "move-child"), l = await h.lesson(f), aid = await h.assignment(f, child, l);
  const create = await h.req("/calendar", { method: "POST", token: f.token, body:
    { ...event(child, "Fraction garden", "2026-10-19", "09:00"), linked_lesson_id: l, linked_assignment_id: aid } });
  assert.equal(create.status, 200);
  const change = await h.req(`/assignments/${aid}`, { method: "PUT", token: f.token, body: { scheduled_date: "2026-10-21" } });
  assert.equal(change.status, 200, JSON.stringify(change.json));
  const events = await h.req("/calendar?from=2026-10-19&to=2026-10-25", { token: f.token });
  const linked = events.json.filter(x => x.linked_assignment_id === aid);
  assert.equal(linked.length, 1);
  assert.equal(linked[0].date, "2026-10-21");
  assert.equal(change.json.scheduled_date, "2026-10-21");
});

test("overlapping sessions and whole-family holidays are rejected, but siblings may learn together", async () => {
  const h = harness(), f = await h.family("overlap@example.com");
  const first = await h.student(f, "overlap-one");
  const second = await h.student(f, "overlap-two");
  assert.equal((await h.req("/calendar", { method: "POST", token: f.token,
    body: event(first, "English", "2026-10-19", "09:00") })).status, 200);
  assert.equal((await h.req("/calendar", { method: "POST", token: f.token,
    body: event(second, "Science", "2026-10-19", "09:00") })).status, 200);
  const clash = await h.req("/calendar", { method: "POST", token: f.token,
    body: event(first, "Maths", "2026-10-19", "09:15") });
  assert.equal(clash.status, 409); assert.equal(clash.json.code, "TIME_CONFLICT");
  assert.equal((await h.req("/calendar", { method: "POST", token: f.token,
    body: { student_id: null, title: "Rest", date: "2026-10-21", event_type: "holiday" } })).status, 200);
  const blocked = await h.req("/calendar", { method: "POST", token: f.token,
    body: event(first, "Maths", "2026-10-21", "09:00") });
  assert.equal(blocked.status, 409); assert.equal(blocked.json.code, "TIME_CONFLICT");
});

test("rescheduling a timetable assignment preserves the old slot and uses a free matching slot", async () => {
  const h = harness(), f = await h.family("move-slot@example.com");
  const child = await h.student(f, "slot-child"), l = await h.lesson(f);
  const blocks = [{ student_id: child, title: "Mathematics", date: "2026-10-19", start_time: "09:00", duration_minutes: 45 },
    { student_id: child, title: "Mathematics", date: "2026-10-21", start_time: "09:00", duration_minutes: 45 }];
  assert.equal((await h.req("/timetable/week", { method: "POST", token: f.token, body: { week_start: "2026-10-19", blocks } })).status, 200);
  const aid = await h.assignment(f, child, l);
  const placed = await h.req(`/assignments/${aid}/place`, { method: "POST", token: f.token, body: { from: "2026-10-19", count: 1 } });
  assert.equal(placed.status, 200, JSON.stringify(placed.json));
  const change = await h.req(`/assignments/${aid}`, { method: "PUT", token: f.token,
    body: { scheduled_date: "2026-10-21" } });
  assert.equal(change.status, 200, JSON.stringify(change.json));
  const slots = (await h.req(`/timetable/slots?student_id=${child}&from=2026-10-19&to=2026-10-25`, { token: f.token })).json;
  assert.equal(slots.length, 2);
  assert.equal(slots.find(s => s.date === "2026-10-19").linked_assignment_id, null);
  assert.equal(slots.find(s => s.date === "2026-10-21").linked_assignment_id, aid);
  assert.equal(change.json.scheduled_date, "2026-10-21");
});

test("multi-day lessons never move by changing one date field", async () => {
  const h = harness(), f = await h.family("multi-day@example.com");
  const child = await h.student(f, "multi-day-child"), l = await h.lesson(f);
  const aid = await h.assignment(f, child, l);
  for (const day of ["2026-10-19", "2026-10-20"]) {
    const event = await h.req("/calendar", { method: "POST", token: f.token,
      body: { student_id: child, title: "Fractions", date: day, event_type: "lesson",
        linked_lesson_id: l, linked_assignment_id: aid } });
    assert.equal(event.status, 200, JSON.stringify(event.json));
  }
  const change = await h.req(`/assignments/${aid}`, { method: "PUT", token: f.token,
    body: { scheduled_date: "2026-10-21" } });
  assert.equal(change.status, 409);
  assert.equal(change.json.code, "MULTIPLE_SESSIONS");
  const sessions = (await h.req("/calendar?from=2026-10-19&to=2026-10-25", { token: f.token })).json
    .filter(e => e.linked_assignment_id === aid);
  assert.deepEqual(sessions.map(e => e.date), ["2026-10-19", "2026-10-20"]);
});

test("a rest day stops autogenerated timetable slots for the affected child", async () => {
  const h = harness(), f = await h.family("holiday-slots@example.com");
  const child = await h.student(f, "rest-day-child");
  const holiday = await h.req("/calendar", { method: "POST", token: f.token,
    body: { title: "Learning-free day", date: "2026-10-20", event_type: "holiday" } });
  assert.equal(holiday.status, 200);
  const week = await h.req("/timetable/week", { method: "POST", token: f.token,
    body: { week_start: "2026-10-19", blocks: [{
      student_id: child, title: "Mathematics", date: "2026-10-20",
      start_time: "09:00", duration_minutes: 45,
    }] } });
  assert.equal(week.status, 200, JSON.stringify(week.json));
  assert.deepEqual(week.json, { created: 0, skipped: 1 });
});

test("repeated schedule requests do not create duplicate sessions for the same assignment and day", async () => {
  const h = harness(), f = await h.family("duplicate-day@example.com");
  const child = await h.student(f, "duplicate-day-child"), l = await h.lesson(f);
  const aid = await h.assignment(f, child, l);
  const details = { student_id: child, title: "Fractions", date: "2026-10-19", event_type: "lesson",
    linked_lesson_id: l, linked_assignment_id: aid };
  const first = await h.req("/calendar", { method: "POST", token: f.token, body: details });
  assert.equal(first.status, 200);
  const again = await h.req("/calendar", { method: "POST", token: f.token, body: details });
  assert.equal(again.status, 409);
  assert.equal(again.json.code, "ALREADY_SCHEDULED");
  const entries = (await h.req("/calendar?from=2026-10-19&to=2026-10-25", { token: f.token })).json;
  assert.equal(entries.filter(e => e.linked_assignment_id === aid).length, 1);
});
