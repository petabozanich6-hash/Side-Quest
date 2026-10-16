// Timetable slots, end to end through the real Worker (index.ts) on the real migrations (SQLite).
import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { sameSubject } from "../src/timetable.ts";

const ORIGIN = "http://localhost:8787";
const PW = "Correct-horse-9";
const MON = "2026-10-19"; // a Monday
const day = (n) => new Date(Date.parse(MON + "T12:00:00Z") + n * 86400000).toISOString().slice(0, 10);
const NOW = new Date("2026-10-16T09:00:00Z");

function harness() {
  const db = makeDb();
  const env = { DB: db, JWT_SECRET: "test-only-secret" };
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  async function req(path, { method = "GET", token, body } = {}) {
    const h = { "content-type": "application/json" };
    if (token) h.authorization = `Bearer ${token}`;
    const r = await worker.fetch(new Request(ORIGIN + "/api" + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined }), env, ctx);
    let json = null; try { json = await r.json(); } catch { /* empty */ }
    return { status: r.status, json };
  }
  async function family(email, paid = true) {
    const r = await req("/auth/register", { method: "POST", body: { email, password: PW, name: "Parent", jurisdiction: "NSW" } });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    const fid = r.json.user.family_id;
    if (paid) db.raw.prepare("UPDATE families SET plan = 'ACTIVE_MONTHLY', plan_period_end = ? WHERE id = ?").run(new Date(Date.now() + 40 * 86400000).toISOString(), fid);
    return { token: r.json.token, fid };
  }
  async function child(f, username) {
    const r = await req("/students", { method: "POST", token: f.token, body: { name: "Kid", username, pin: "4321", stage: "S2" } });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    return r.json.id;
  }
  async function lesson(f, title, area) {
    const r = await req("/lessons", { method: "POST", token: f.token, body: { title, learning_area: area, stage: "S2", status: "ready", sections: [{ heading: "Part", body: "Text" }] } });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    return r.json.id;
  }
  const assign = async (f, sid, lid) => (await req("/assignments", { method: "POST", token: f.token, body: { student_id: sid, lesson_id: lid } })).json.id;
  const slots = async (f, sid) => (await req(`/timetable/slots?student_id=${sid}`, { token: f.token })).json;
  return { db, req, family, child, lesson, assign, slots };
}

const week = (sid) => ({ week_start: MON, blocks: [
  { student_id: sid, title: "Mathematics", date: day(0), start_time: "09:00", duration_minutes: 45 },
  { student_id: sid, title: "English", date: day(0), start_time: "10:00", duration_minutes: 45 },
  { student_id: sid, title: "Mathematics", date: day(2), start_time: "09:00", duration_minutes: 45 },
  { student_id: sid, title: "Science and Technology", date: day(3), start_time: "09:00", duration_minutes: 40 },
] });

test("subjects match by name or by learning area", () => {
  assert.equal(sameSubject("Mathematics", "Maths", "S2"), true);
  assert.equal(sameSubject("Mathematics", "mathematics", "S2"), true);
  assert.equal(sameSubject("English", "Mathematics", "S2"), false);
  assert.equal(sameSubject("Science and Technology", "Science", "S2"), true);
  assert.equal(sameSubject("PDHPE", "Health and Physical Education", "S2"), true);
  assert.equal(sameSubject("", "Mathematics", "S2"), false);
});

test("timetables are a Family Membership feature (server-enforced)", async () => {
  const h = harness();
  const free = await h.family("free@example.com", false);
  const sid = await h.child(free, "freekid");
  assert.equal((await h.req("/timetable/status", { token: free.token })).json.allowed, false);
  const w = await h.req("/timetable/week", { method: "POST", token: free.token, body: week(sid) });
  assert.equal(w.status, 402);
  assert.equal(w.json.code, "UPGRADE_REQUIRED");
  assert.equal((await h.req(`/timetable/slots?student_id=${sid}`, { token: free.token })).status, 402);
  const lid = await h.lesson(free, "Place value", "Mathematics");
  const aid = await h.assign(free, sid, lid);
  assert.equal((await h.req(`/assignments/${aid}/place`, { method: "POST", token: free.token, body: {} })).status, 402);
  // Assigning a lesson itself still works for free families.
  assert.ok(aid);
});

test("a week is saved once (repeats are skipped), validated, and only for your own children", async () => {
  const h = harness();
  const f = await h.family("paid@example.com");
  const sid = await h.child(f, "paidkid");
  assert.equal((await h.req("/timetable/status", { token: f.token })).json.allowed, true);
  const w = await h.req("/timetable/week", { method: "POST", token: f.token, body: week(sid) });
  assert.deepEqual(w.json, { created: 4, skipped: 0 });
  assert.deepEqual((await h.req("/timetable/week", { method: "POST", token: f.token, body: week(sid) })).json, { created: 0, skipped: 4 });
  assert.equal((await h.slots(f, sid)).length, 4);
  const bad = (blocks, start = MON) => h.req("/timetable/week", { method: "POST", token: f.token, body: { week_start: start, blocks } });
  assert.equal((await bad([{ ...week(sid).blocks[0], date: day(8) }])).status, 400, "outside the week");
  assert.equal((await bad([{ ...week(sid).blocks[0], start_time: "9am" }])).status, 400);
  assert.equal((await bad([{ ...week(sid).blocks[0], duration_minutes: 500 }])).status, 400);
  assert.equal((await bad([{ ...week(sid).blocks[0], title: "" }])).status, 400);
  const other = await h.family("other@example.com");
  const theirs = await h.child(other, "theirkid");
  assert.equal((await bad([{ ...week(sid).blocks[0], student_id: theirs }])).status, 404, "another family's child");
  assert.equal((await h.req(`/timetable/slots?student_id=${sid}`, { token: other.token })).json.length, 0, "another family can't see the slots");
});

test("assigning fills the next open slot of the lesson's subject; more sessions fill more slots", async () => {
  const h = harness();
  const f = await h.family("fill@example.com");
  const sid = await h.child(f, "fillkid");
  await h.req("/timetable/week", { method: "POST", token: f.token, body: week(sid) });
  const maths = await h.lesson(f, "Place value", "Maths");
  const a1 = await h.assign(f, sid, maths);
  const p1 = await h.req(`/assignments/${a1}/place`, { method: "POST", token: f.token, body: { from: MON } });
  assert.equal(p1.status, 200, JSON.stringify(p1.json));
  assert.deepEqual(p1.json.placed.map((s) => [s.title, s.date]), [["Mathematics", day(0)]]);
  const s = await h.slots(f, sid);
  const filled = s.find((x) => x.date === day(0) && x.title === "Mathematics");
  assert.equal(filled.linked_assignment_id, a1);
  assert.equal(filled.lesson_title, "Place value");
  assert.equal((await h.req(`/assignments`, { token: f.token })).json.find((a) => a.id === a1).scheduled_date, day(0));
  // The calendar shows the lesson in its slot, and the child's calendar too.
  const cal = (await h.req("/calendar", { token: f.token })).json.find((e) => e.id === filled.id);
  assert.equal(cal.lesson_title, "Place value");
  // A second maths lesson goes to the next maths slot (Wednesday), not to English.
  const maths2 = await h.lesson(f, "Rounding", "Mathematics");
  const pm = await h.req(`/assignments/${await h.assign(f, sid, maths2)}/place`, { method: "POST", token: f.token, body: { from: MON } });
  assert.deepEqual(pm.json.placed.map((x) => [x.title, x.date]), [["Mathematics", day(2)]]);
  // Asking for more sessions than there are slots fills what exists.
  const sci = await h.lesson(f, "Plants", "Science");
  const a2 = await h.assign(f, sid, sci);
  const p2 = await h.req(`/assignments/${a2}/place`, { method: "POST", token: f.token, body: { from: MON, count: 3 } });
  assert.deepEqual(p2.json.placed.map((x) => x.title), ["Science and Technology"], "only one science slot exists");
  // No slot for the subject: nothing changes and the app is told why.
  const art = await h.lesson(f, "Painting", "Creative Arts");
  const a3 = await h.assign(f, sid, art);
  const p3 = await h.req(`/assignments/${a3}/place`, { method: "POST", token: f.token, body: { from: MON } });
  assert.deepEqual([p3.json.placed, p3.json.reason], [[], "no_slot"]);
});

test("choosing a slot by hand; a taken slot or another child's slot is refused", async () => {
  const h = harness();
  const f = await h.family("pick@example.com");
  const sid = await h.child(f, "pickkid");
  const sib = await h.child(f, "sibkid");
  await h.req("/timetable/week", { method: "POST", token: f.token, body: week(sid) });
  await h.req("/timetable/week", { method: "POST", token: f.token, body: week(sib) });
  const english = (await h.slots(f, sid)).find((x) => x.title === "English");
  const sibSlot = (await h.slots(f, sib))[0];
  const l = await h.lesson(f, "Story time", "English");
  const a = await h.assign(f, sid, l);
  assert.equal((await h.req(`/assignments/${a}/place`, { method: "POST", token: f.token, body: { slot_ids: [sibSlot.id] } })).json.code, "SLOT_TAKEN", "a sibling's slot");
  assert.equal((await h.req(`/assignments/${a}/place`, { method: "POST", token: f.token, body: { slot_ids: [english.id] } })).status, 200);
  const l2 = await h.lesson(f, "Poems", "English");
  const a2 = await h.assign(f, sid, l2);
  assert.equal((await h.req(`/assignments/${a2}/place`, { method: "POST", token: f.token, body: { slot_ids: [english.id] } })).json.code, "SLOT_TAKEN", "already filled");
});

test("cancelling or moving an assignment empties its slot; the timetable is never deleted", async () => {
  const h = harness();
  const f = await h.family("empty@example.com");
  const sid = await h.child(f, "emptykid");
  const sib = await h.child(f, "otherkid");
  await h.req("/timetable/week", { method: "POST", token: f.token, body: week(sid) });
  const l = await h.lesson(f, "Fractions", "Mathematics");
  const a = await h.assign(f, sid, l);
  await h.req(`/assignments/${a}/place`, { method: "POST", token: f.token, body: { from: MON } });
  // Move it to the sibling: the slot stays in this child's timetable, emptied.
  assert.equal((await h.req(`/assignments/${a}/reassign`, { method: "POST", token: f.token, body: { student_id: sib } })).status, 200);
  let s = await h.slots(f, sid);
  assert.equal(s.length, 4);
  assert.ok(s.every((x) => !x.linked_assignment_id), "slot still filled after moving");
  // Put it back in a slot, then cancel: slot emptied, still there.
  await h.req(`/assignments/${a}/reassign`, { method: "POST", token: f.token, body: { student_id: sid } });
  await h.req(`/assignments/${a}/place`, { method: "POST", token: f.token, body: { from: MON } });
  assert.equal((await h.req(`/assignments/${a}`, { method: "DELETE", token: f.token })).status, 200);
  s = await h.slots(f, sid);
  assert.equal(s.length, 4, "a timetable slot was deleted");
  assert.ok(s.every((x) => !x.linked_assignment_id && !x.linked_lesson_id));
});

test("slots from the older one-week generator are used too, without rewriting them", async () => {
  const h = harness();
  const f = await h.family("legacy@example.com");
  const sid = await h.child(f, "legacykid");
  h.db.raw.prepare("INSERT INTO calendar_events (id, family_id, student_id, title, date, start_time, duration_minutes, event_type, notes, created_at) VALUES ('old1', ?, ?, 'Mathematics', ?, '09:00', 45, 'lesson', 'Suggested by Side-Quest using family curriculum areas, year level and learning days. Parent reviewed.', ?)")
    .run(f.fid, sid, day(1), NOW.toISOString());
  const l = await h.lesson(f, "Counting", "Mathematics");
  const a = await h.assign(f, sid, l);
  const p = await h.req(`/assignments/${a}/place`, { method: "POST", token: f.token, body: { from: MON } });
  assert.deepEqual(p.json.placed.map((x) => x.id), ["old1"]);
  assert.equal(h.db.raw.prepare("SELECT event_type FROM calendar_events WHERE id = 'old1'").get().event_type, "lesson");
});

test("timetable refuses overlapping blocks and preserves existing appointments", async () => {
  const h = harness();
  const f = await h.family("overlap@example.com");
  const sid = await h.child(f, "overlapkid");
  const block = (date, time, minutes = 45) => ({
    student_id: sid, title: "Mathematics", date, start_time: time, duration_minutes: minutes
  });
  const save = (blocks) => h.req("/timetable/week", {
    method: "POST", token: f.token, body: { week_start: MON, blocks }
  });
  assert.deepEqual((await save([block(day(0), "09:00", 60), block(day(0), "09:30", 45)])).json,
    { created: 1, skipped: 1 }, "overlap within same requested timetable");
  assert.deepEqual((await save([block(day(0), "09:15", 30)])).json,
    { created: 0, skipped: 1 }, "overlap despite different start times");
  assert.deepEqual((await save([block(day(0), "10:00", 45)])).json,
    { created: 1, skipped: 0 }, "touching endpoints are allowed");

  h.db.raw.prepare("INSERT INTO calendar_events (id, family_id, student_id, title, date, start_time, duration_minutes, event_type, created_at) VALUES ('appointment1', ?, ?, 'Dentist', ?, '11:00', 40, 'appointment', ?)")
    .run(f.fid, sid, day(0), NOW.toISOString());
  assert.deepEqual((await save([block(day(0), "11:20", 45)])).json,
    { created: 0, skipped: 1 }, "parent appointments take precedence");
  assert.equal((await save([block(day(0), "23:45", 45)])).status, 400);
  assert.equal((await h.slots(f, sid)).length, 2);
});

test("reschedule preview respects completed lessons, family isolation and free subject slots", async () => {
  const h = harness();
  const parent = await h.family("reschedule@example.com");
  const sid = await h.child(parent, "schedulechild");
  const other = await h.family("stranger@example.com");
  const otherSid = await h.child(other, "strangerchild");
  const maths = await h.lesson(parent, "Fractions", "Mathematics");
  const assignment = await h.assign(parent, sid, maths);
  await h.req("/timetable/week", { method: "POST", token: parent.token, body: {
    week_start: MON, blocks: [
      { student_id: sid, title: "Mathematics", date: day(0), start_time: "09:00", duration_minutes: 45 },
      { student_id: sid, title: "Mathematics", date: day(2), start_time: "09:00", duration_minutes: 45 },
    ]
  } });
  await h.req(`/assignments/${assignment}/place`, { method: "POST", token: parent.token,
    body: { from: MON, count: 1 } });
  const input = { student_id: sid, date: day(0) };
  const preview = await h.req("/timetable/reschedule/preview", { method: "POST", token: parent.token, body: input });
  assert.equal(preview.status, 200, JSON.stringify(preview.json));
  assert.equal(preview.json.plan.length, 1);
  assert.equal(preview.json.plan[0].to_date, day(2));
  assert.equal((await h.req("/timetable/reschedule/preview", { method: "POST", token: other.token, body: input })).status, 404);
  assert.equal((await h.req("/timetable/reschedule/preview", { method: "POST", token: parent.token, body: {student_id: otherSid,date: day(0)} })).status, 404);
  const apply = await h.req("/timetable/reschedule/apply", { method: "POST", token: parent.token,
    body: {...input, moves: preview.json.plan.map(p=>({from_slot_id:p.from_slot_id,to_slot_id:p.to_slot_id}))} });
  assert.equal(apply.status, 200, JSON.stringify(apply.json));
  const slots = await h.slots(parent, sid);
  assert.equal(slots.find(s=>s.date===day(0)).linked_assignment_id, null);
  assert.equal(slots.find(s=>s.date===day(2)).linked_assignment_id, assignment);
  const second = await h.req("/timetable/reschedule/preview", { method: "POST", token: parent.token, body: input });
  assert.deepEqual(second.json.plan, [], "moving again must not duplicate work");
  const stale = await h.req("/timetable/reschedule/apply", { method: "POST", token: parent.token,
    body: {...input, moves: preview.json.plan.map(p=>({from_slot_id:p.from_slot_id,to_slot_id:p.to_slot_id}))} });
  assert.equal(stale.status, 409, "stale preview must be rejected");
  assert.equal((await h.slots(parent, sid)).filter(x=>x.linked_assignment_id===assignment).length, 1,
    "reapplying must not duplicate assignment placement");
});
