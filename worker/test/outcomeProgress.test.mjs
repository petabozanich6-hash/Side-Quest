// Outcome progress: five levels, parent-confirmed levels protected, automatic updates only from parent reviews,
// never lowering a level and never claiming mastery from a finished lesson.
import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import * as lb from "../src/lessonBuilder.ts";
import * as op from "../src/outcomeProgress.ts";
import { trialEndFrom } from "../src/entitlements.ts";

const NOW = new Date("2026-10-15T00:00:00Z");
let n = 0;
function seed(db, { jurisdiction = "NSW", plan = "ACTIVE_MONTHLY" } = {}) {
  const fam = `of${++n}`, t = NOW.toISOString();
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at,plan_period_end,jurisdiction) VALUES (?,?,?,?,?,?,?,?,?)")
    .run(fam, "Fam", `u${fam}`, t, plan, t, trialEndFrom(t), null, jurisdiction);
  return fam;
}
function child(db, fam, stage = "S2") {
  const id = `os${++n}`;
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at) VALUES (?,?,?,?,?,?,?,?)").run(id, fam, "Oliver", `k${id}`, "x", stage, "3", NOW.toISOString());
  return id;
}
const A = "EN2-OLC-01", B = "EN2-VOCAB-01", C = "EN2-RECOM-01";
async function lessonFor(db, fam, codes) {
  const r = await lb.createLesson(db, fam, { title: "Reading", learning_area: "English", stage: "S2", status: "ready", objectives: ["Read"], sections: [{ heading: "Read", body: "Read carefully." }], outcome_codes: codes }, NOW);
  assert.ok(r.ok, JSON.stringify(r));
  return r.lesson;
}
async function reviewed(db, fam, kid, lesson, status, marks) {
  const a = await lb.assignLesson(db, fam, { student_id: kid, lesson_id: lesson.id }, NOW);
  assert.ok(a.ok, JSON.stringify(a));
  const s = await lb.submitWork(db, { id: kid, family_id: fam }, { assignment_id: a.assignment.id, response_text: "done" }, NOW);
  assert.ok(s.ok, JSON.stringify(s));
  const mappings = Object.entries(marks).map(([code, yes]) => ({ code, accepted: yes, status: yes ? "achieved" : "not_yet" }));
  assert.ok((await lb.reviewSubmission(db, fam, "parent", s.id, { status, outcome_mappings: mappings }, NOW)).ok);
  await op.recordReview(db, fam, "parent", s.id, NOW);
  return s.id;
}
const levelOf = async (db, fam, kid, code) => (await op.getProgress(db, fam, kid, NOW)).progress.outcomes.find((o) => o.code === code);

test("the codes used here are on the verified list", () => {
  for (const c of [A, B, C]) assert.ok(op.knownOutcome(c), c);
});

test("reviews raise progress: ticked -> demonstrated, not yet -> developing, untouched -> introduced; never achieved automatically", async () => {
  const db = makeDb(); const fam = seed(db); const kid = child(db, fam);
  const l = await lessonFor(db, fam, [A, B, C]);
  const sid = await reviewed(db, fam, kid, l, "demonstrated", { [A]: true, [B]: false });
  assert.equal((await levelOf(db, fam, kid, A)).level, "demonstrated");
  assert.equal((await levelOf(db, fam, kid, B)).level, "developing");
  assert.equal((await levelOf(db, fam, kid, C)).level, "introduced");
  assert.equal((await levelOf(db, fam, kid, A)).parent_confirmed, false);
  // replaying the same review changes nothing and writes no extra history
  const before = db.raw.prepare("SELECT COUNT(*) n FROM outcome_progress_events").get().n;
  await op.recordReview(db, fam, "parent", sid, NOW);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM outcome_progress_events").get().n, before);
  // automatic updates are capped below "achieved"
  assert.equal((await op.applyChange(db, { familyId: fam, studentId: kid, code: B, level: "achieved", source: "review" }, NOW)).level, "demonstrated");
});

test("work sent back for more practice counts as developing, not demonstrated", async () => {
  const db = makeDb(); const fam = seed(db); const kid = child(db, fam);
  const l = await lessonFor(db, fam, [A]);
  await reviewed(db, fam, kid, l, "needs_more_practice", { [A]: true });
  assert.equal((await levelOf(db, fam, kid, A)).level, "developing");
});

test("a parent-confirmed level is never lowered by later reviews; the parent can change their own", async () => {
  const db = makeDb(); const fam = seed(db); const kid = child(db, fam);
  const set = await op.setLevel(db, fam, "parent", kid, A, { level: "achieved", note: "Shown at home many times" }, NOW);
  assert.ok(set.ok); assert.equal(set.outcome.level, "achieved"); assert.equal(set.outcome.parent_confirmed, true);
  const l = await lessonFor(db, fam, [A]);
  await reviewed(db, fam, kid, l, "needs_more_practice", { [A]: false });
  const a = await levelOf(db, fam, kid, A);
  assert.equal(a.level, "achieved"); assert.equal(a.parent_confirmed, true);
  // the parent can lower their own judgement
  assert.equal((await op.setLevel(db, fam, "parent", kid, A, { level: "developing" }, NOW)).outcome.level, "developing");
  const h = await op.history(db, fam, kid, A);
  assert.deepEqual(h.map((e) => e.to_level), ["developing", "achieved"]);
});

test("progress lists the child's stage outcomes, counts levels, and replays earlier reviews once", async () => {
  const db = makeDb(); const fam = seed(db); const kid = child(db, fam);
  const l = await lessonFor(db, fam, [A]);
  // a review made before tracking existed (no recordReview call)
  const a = await lb.assignLesson(db, fam, { student_id: kid, lesson_id: l.id }, NOW);
  const s = await lb.submitWork(db, { id: kid, family_id: fam }, { assignment_id: a.assignment.id, response_text: "x" }, NOW);
  await lb.reviewSubmission(db, fam, "parent", s.id, { status: "demonstrated", outcome_mappings: [{ code: A, accepted: true }] }, NOW);
  const p = (await op.getProgress(db, fam, kid, NOW)).progress;
  assert.equal(p.available, true);
  assert.ok(p.outcomes.length > 10 && p.outcomes.every((o) => o.stage === "S2"));
  assert.equal(p.outcomes.find((o) => o.code === A).level, "demonstrated");
  assert.equal(p.counts.demonstrated, 1);
  assert.equal(p.counts.not_started, p.outcomes.length - 1);
  await op.getProgress(db, fam, kid, NOW);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM outcome_progress_events WHERE student_id = ?").get(kid).n, 1, "backfill runs once");
});

test("other states: nothing invented; unknown codes, bad levels and other families refused", async () => {
  const db = makeDb();
  const vic = seed(db, { jurisdiction: "VIC" }); const vkid = child(db, vic);
  const p = (await op.getProgress(db, vic, vkid, NOW)).progress;
  assert.equal(p.available, false); assert.equal(p.outcomes.length, 0); assert.match(p.note, /VIC|Victoria|not loaded/i);
  assert.equal((await op.setLevel(db, vic, "p", vkid, A, { level: "achieved" }, NOW)).code, "NOT_AVAILABLE");
  // a VIC lesson review never stores NSW codes it was not given, and invented codes are ignored everywhere
  const fam = seed(db); const kid = child(db, fam);
  assert.equal((await op.setLevel(db, fam, "p", kid, "MADE-UP-01", { level: "achieved" }, NOW)).status, 404);
  assert.equal((await op.setLevel(db, fam, "p", kid, A, { level: "mastered" }, NOW)).status, 400);
  const l = await lessonFor(db, fam, [A, "MADE-UP-01"]);
  await reviewed(db, fam, kid, l, "demonstrated", { "MADE-UP-01": true });
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM outcome_progress WHERE code = 'MADE-UP-01'").get().n, 0);
  const other = seed(db);
  assert.equal((await op.getProgress(db, other, kid, NOW)).status, 404);
  assert.equal((await op.setLevel(db, other, "p", kid, A, { level: "achieved" }, NOW)).status, 404);
});
