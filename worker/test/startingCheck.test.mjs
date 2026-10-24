// Starting check: a placement quiz per subject whose answers suggest prior learning.
import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import * as ot from "../src/outcomeTracker.ts";
import * as lb from "../src/lessonBuilder.ts";
import { createStartingCheck, listStartingChecks, pickAcrossStrands } from "../src/startingCheck.ts";
import { trialEndFrom } from "../src/entitlements.ts";

const NOW = new Date("2026-10-24T02:00:00Z");
let n = 0;
function setup() {
  const db = makeDb(), fam = `fam${++n}`, kid = `kid${n}`, t = NOW.toISOString();
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at,jurisdiction) VALUES (?,?,?,?,?,?,?,?)").run(fam, "Fam", `u-${fam}`, t, "ACTIVE_MONTHLY", t, trialEndFrom(t), "NSW");
  db.raw.prepare("INSERT INTO users (id,family_id,email,name,created_at) VALUES (?,?,?,?,?)").run(`u-${fam}`, fam, `${fam}@example.com`, "Pat Parent", t);
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at) VALUES (?,?,?,?,?,?,?,?)").run(kid, fam, "Mia Example", `mia${n}`, "x", "S2", "3", t);
  return { db, fam, kid, parent: `u-${fam}`, env: { DB: db } };
}
const mathsSubject = async (h) => (await ot.trackerFor(h.db, h.fam, h.kid, { now: NOW })).outcomes.find((o) => o.in_stage && o.code.startsWith("MA2") && o.summary).subject;
/** Fake AI: answers every numbered outcome, plus one malformed and one out-of-list question. */
const fakeAi = (prompts = []) => ({ run: async (_m, input) => {
  const user = input.messages[1].content;
  prompts.push(user);
  const count = user.split("\n").filter((l) => /^\d+\. /.test(l)).length;
  const questions = Array.from({ length: count }, (_, i) => ({ n: i + 1, question: `Question about outcome ${i + 1}?`, options: ["A", "B", "C", "D"], correct_index: 1, explanation: "Because B." }));
  questions.push({ n: 1, question: "Duplicate for outcome 1?", options: ["A", "B", "C"], correct_index: 0 });
  questions.push({ n: 2, question: "Bad options", options: ["A", "A", "B"], correct_index: 0 });
  questions.push({ n: 999, question: "Not in the list?", options: ["A", "B", "C"], correct_index: 0 });
  return { response: JSON.stringify({ questions }) };
} });

test("questions are spread across strands", () => {
  const list = [{ code: "a1", strand: "A" }, { code: "a2", strand: "A" }, { code: "a3", strand: "A" }, { code: "b1", strand: "B" }, { code: "c1", strand: "C" }];
  assert.deepEqual(pickAcrossStrands(list, 4).map((x) => x.code), ["a1", "b1", "c1", "a2"]);
});

test("a check becomes an assigned AI-labelled lesson with one valid question per outcome and no outcome codes", async () => {
  const h = setup();
  const subject = await mathsSubject(h);
  const prompts = [];
  const r = await createStartingCheck(h.env, fakeAi(prompts), { familyId: h.fam, userId: h.parent, studentId: h.kid, subject }, NOW);
  assert.ok(r.ok, JSON.stringify(r));
  assert.ok(r.check.questions >= 3 && r.check.questions <= 8);
  assert.doesNotMatch(prompts[0], /MA2-/, "codes are never sent to the AI");
  const lesson = lb.lessonOut(h.db.raw.prepare("SELECT * FROM lessons WHERE id = ?").get(r.check.lesson_id));
  assert.equal(lesson.title, `Starting check: ${subject}`);
  assert.equal(lesson.status, "ready");
  assert.equal(lesson.ai_generated, true);
  assert.deepEqual(lesson.outcome_codes, []);
  assert.equal(lesson.quiz.length, r.check.questions, "duplicate, malformed and out-of-list questions were dropped");
  const a = h.db.raw.prepare("SELECT student_id, status FROM assignments WHERE id = ?").get(r.check.assignment_id);
  assert.equal(a.student_id, h.kid);
});

test("a low score never blocks hand-in, and only the first attempt counts", async () => {
  const h = setup();
  const subject = await mathsSubject(h);
  const r = await createStartingCheck(h.env, fakeAi(), { familyId: h.fam, userId: h.parent, studentId: h.kid, subject }, NOW);
  const user = { id: h.kid, family_id: h.fam };
  const total = r.check.questions;
  // First go: only question 1 right (the correct option is "B").
  const first = await lb.checkQuiz(h.db, user, r.check.assignment_id, Array.from({ length: total }, (_, i) => (i === 0 ? "B" : "A")), NOW);
  assert.ok(first.ok && first.passed, "a placement quiz is never failed");
  // Second go: all right. It must not change the results.
  await lb.checkQuiz(h.db, user, r.check.assignment_id, Array.from({ length: total }, () => "B"), new Date(NOW.getTime() + 60000));
  const s = await lb.submitWork(h.db, user, { assignment_id: r.check.assignment_id, response_text: "Done" }, NOW);
  assert.ok(s.ok, JSON.stringify(s));
  const [check] = await listStartingChecks(h.db, h.fam, h.kid);
  assert.equal(check.items.filter((i) => i.correct).length, 1);
  assert.equal(check.items[0].correct, true);
  // The check alone records nothing in the tracker.
  const t = await ot.trackerFor(h.db, h.fam, h.kid, { now: NOW });
  assert.ok(check.items.every((i) => t.outcomes.find((o) => o.code === i.code).status === "not_started"));
});

test("an ordinary lesson's quiz still has to be passed", async () => {
  const h = setup();
  const l = await lb.createLesson(h.db, h.fam, { title: "Normal", learning_area: "Mathematics", stage: "S2", status: "ready", sections: [{ heading: "x", body: "y" }],
    quiz: [{ question: "1+1?", options: ["1", "2", "3"], correct_index: 1 }] }, NOW);
  const a = await lb.assignLesson(h.db, h.fam, { student_id: h.kid, lesson_id: l.lesson.id }, NOW);
  const res = await lb.checkQuiz(h.db, { id: h.kid, family_id: h.fam }, a.assignment.id, ["1"], NOW);
  assert.equal(res.passed, false);
  assert.equal((await lb.submitWork(h.db, { id: h.kid, family_id: h.fam }, { assignment_id: a.assignment.id, response_text: "x" }, NOW)).code, "QUIZ_NOT_PASSED");
});

test("outcomes already met are not checked, and an unusable AI reply uses nothing", async () => {
  const h = setup();
  const subject = await mathsSubject(h);
  const t = await ot.trackerFor(h.db, h.fam, h.kid, { now: NOW });
  const met = t.outcomes.filter((o) => o.in_stage && o.subject === subject && o.summary).slice(0, 2).map((o) => o.code);
  await ot.recordPriorLearning(h.db, h.fam, h.parent, h.kid, { codes: met, source: "School report" }, NOW);
  const prompts = [];
  await createStartingCheck(h.env, fakeAi(prompts), { familyId: h.fam, userId: h.parent, studentId: h.kid, subject }, NOW);
  for (const code of met) assert.ok(!prompts[0].includes(ot.outcomeInfo(ot.catalogueFor("NSW").byCode.get(code)).summary));
  const bad = await createStartingCheck(h.env, { run: async () => ({ response: "{\"questions\":[]}" }) }, { familyId: h.fam, userId: h.parent, studentId: h.kid, subject }, NOW);
  assert.equal(bad.code, "AI_FAILED");
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM ai_usage WHERE kind='starting_check' AND status='failed'").get().n, 1);
});
