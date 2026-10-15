// Curriculum Outcome & Mastery Tracker: the full parent/child journey plus the data-integrity rules.
// Runs the real migrations and the real lesson, quiz, review, life learning and evidence-note code paths.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { makeDb } from "./fakeD1.mjs";
import * as lb from "../src/lessonBuilder.ts";
import * as pl from "../src/planning.ts";
import * as ot from "../src/outcomeTracker.ts";
import { buildPortfolio } from "../src/portfolio.ts";
import { trialEndFrom } from "../src/entitlements.ts";

const D = (d) => new Date(`2026-10-${String(d).padStart(2, "0")}T02:00:00Z`);
const NOW = D(1);
const RN = "MA2-RN-01", AR = "MA2-AR-01", MR = "MA2-MR-01", OLC = "EN2-OLC-01";

let n = 0;
function family(db, { jurisdiction = "NSW", plan = "ACTIVE_MONTHLY" } = {}) {
  const fam = `fam${++n}`;
  const t = NOW.toISOString();
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at,jurisdiction) VALUES (?,?,?,?,?,?,?,?)").run(fam, "Fam", `u-${fam}`, t, plan, t, trialEndFrom(t), jurisdiction);
  db.raw.prepare("INSERT INTO users (id,family_id,email,name,created_at) VALUES (?,?,?,?,?)").run(`u-${fam}`, fam, `${fam}@example.com`, "Pat Parent", t);
  return fam;
}
function child(db, fam, name = "Mia") {
  const id = `kid${++n}`;
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at) VALUES (?,?,?,?,?,?,?,?)").run(id, fam, name, `${name}${id}`, "x", "S2", "3", NOW.toISOString());
  return id;
}
const lessonInput = (title, codes, over = {}) => ({
  title, learning_area: codes[0].startsWith("EN") ? "English" : "Mathematics", stage: "S2", status: "ready",
  objectives: ["Learn it"], sections: [{ heading: "Teach", body: "Explained." }],
  quiz: [{ question: "Pick 2", options: ["1", "2"], correct_index: 1 }],
  questions: [{ prompt: "Explain", type: "short", answer_key: "2" }], outcome_codes: codes, ...over,
});
async function makeLesson(db, fam, title, codes, opts = {}) {
  const r = await lb.createLesson(db, fam, lessonInput(title, codes), NOW, opts);
  assert.ok(r.ok, JSON.stringify(r));
  return r.lesson;
}
/** Assign, pass the quiz on day `d`, hand in. Returns the submission id. */
async function doLesson(db, fam, kid, lesson, d, { support = "green", needsHelp = false } = {}) {
  const a = await lb.assignLesson(db, fam, { student_id: kid, lesson_id: lesson.id, support_level: support }, D(d));
  assert.ok(a.ok, JSON.stringify(a));
  const user = { id: kid, family_id: fam };
  if (!needsHelp) assert.ok((await lb.checkQuiz(db, user, a.assignment.id, ["2"], D(d))).ok);
  const s = await lb.submitWork(db, user, { assignment_id: a.assignment.id, response_text: "My working", needs_help: needsHelp }, D(d));
  assert.ok(s.ok, JSON.stringify(s));
  return { sub: s.id, assignment: a.assignment.id };
}
const review = (db, fam, sub, d, status, mappings) => lb.reviewSubmission(db, fam, `u-${fam}`, sub, { status, feedback_text: "Feedback", outcome_mappings: mappings }, D(d));
const statusOf = (t, code) => t.outcomes.find((o) => o.code === code);
const count = (db, sql, ...b) => db.raw.prepare(sql).get(...b).n;

test("approval alone cannot count as demonstrated understanding", () => {
  assert.deepEqual(ot.levelFromReview("accepted", { code: RN, accepted: true }), { level: "practice", consolidate: false, comprehensive: false });
  assert.deepEqual(ot.levelFromReview("demonstrated", { code: RN, accepted: true }), { level: "practice", consolidate: false, comprehensive: false });
  assert.deepEqual(ot.levelFromReview("demonstrated", { code: RN, mark: "shown" }), { level: "demonstrated", consolidate: false, comprehensive: false });
  assert.deepEqual(ot.levelFromReview("needs_revision", { code: RN, mark: "shown" }), { level: "participation", consolidate: true, comprehensive: false });
  // A comprehensive assessment needs "shown" on approved work; it can't ride on approval, practice or returned work.
  assert.deepEqual(ot.levelFromReview("demonstrated", { code: RN, mark: "shown", comprehensive: true }), { level: "demonstrated", consolidate: false, comprehensive: true });
  assert.equal(ot.levelFromReview("demonstrated", { code: RN, comprehensive: true, accepted: true }).comprehensive, false);
  assert.equal(ot.levelFromReview("demonstrated", { code: RN, mark: "practising", comprehensive: true }).comprehensive, false);
  assert.equal(ot.levelFromReview("needs_revision", { code: RN, mark: "shown", comprehensive: true }).comprehensive, false);
});

test("full journey: five lessons, hand-ins, reviews with support, parent confirmation and preserved history", async () => {
  const db = makeDb();
  const fam = family(db);
  const mia = child(db, fam, "Mia");
  const leo = child(db, fam, "Leo");

  // 1. The parent creates five lessons aligned with several outcomes (one AI-drafted, the rest built by hand).
  const L1 = await makeLesson(db, fam, "Place value 1", [RN]);
  const L2 = await makeLesson(db, fam, "Place value 2", [RN]);
  const L3 = await makeLesson(db, fam, "Place value and adding", [RN, AR]);
  const L4 = await makeLesson(db, fam, "Adding with help", [AR]);
  const L5 = await makeLesson(db, fam, "Speaking and listening", [OLC], { ai: true });

  // 2-3. Assigned to Mia, who passes each quiz and hands the work in.
  const w1 = await doLesson(db, fam, mia, L1, 2);
  const w2 = await doLesson(db, fam, mia, L2, 5);
  const w3 = await doLesson(db, fam, mia, L3, 6);
  const w4 = await doLesson(db, fam, mia, L4, 7, { support: "red" });
  const w5 = await doLesson(db, fam, mia, L5, 8);

  // Handing in (and passing an auto-marked quiz) is practice, never understanding.
  let t = await ot.trackerFor(db, fam, mia, { now: D(8) });
  assert.equal(t.available, true);
  for (const o of t.outcomes) assert.ok(["not_started", "introduced", "developing"].includes(o.status), `${o.code} ${o.status}`);
  assert.equal(statusOf(t, RN).status, "developing");
  assert.equal(statusOf(t, MR).status, "not_started");
  assert.ok(statusOf(t, MR).gaps.includes("not_introduced"));

  // 4. Parent reviews. Some work shows understanding, some was done with a lot of help, one outcome is "not yet".
  assert.ok((await review(db, fam, w1.sub, 9, "demonstrated", [{ code: RN, mark: "shown", support: "independent" }])).ok);
  t = await ot.trackerFor(db, fam, mia, { now: D(9) });
  assert.equal(statusOf(t, RN).status, "developing", "one piece of evidence is not enough");
  assert.ok(statusOf(t, RN).gaps.includes("limited_evidence"));

  assert.ok((await review(db, fam, w2.sub, 10, "demonstrated", [{ code: RN, mark: "shown" }])).ok);
  assert.ok((await review(db, fam, w3.sub, 11, "demonstrated", [{ code: RN, mark: "shown" }, { code: AR, mark: "not_yet" }])).ok);
  assert.ok((await review(db, fam, w4.sub, 12, "demonstrated", [{ code: AR, mark: "shown" }])).ok); // assignment support was red
  assert.ok((await review(db, fam, w5.sub, 12, "accepted", [{ code: OLC, accepted: true, learning_area: "English" }])).ok); // older review shape: approval records practice, never implicit mastery

  // 5. The tracker updates: RN demonstrated (awaiting confirmation), AR still developing (help-heavy work doesn't count).
  t = await ot.trackerFor(db, fam, mia, { now: D(12) });
  const rn = statusOf(t, RN);
  assert.equal(rn.status, "demonstrated");
  assert.ok(rn.gaps.includes("awaiting_confirmation"));
  assert.equal(statusOf(t, AR).status, "developing");
  assert.match(statusOf(t, AR).reason, /lot of help/);
  assert.equal(statusOf(t, OLC).status, "developing");
  assert.ok(!t.outcomes.some((o) => o.status === "achieved"), "nothing is Achieved without the parent");
  assert.ok(t.areas.find((a) => a.learning_area === "Mathematics").counts.demonstrated >= 1);

  // 6. The parent opens the outcome and sees linked evidence (not copies), with dates, scores, support and files.
  let d = await ot.outcomeDetail(db, fam, mia, RN, { now: D(12) });
  const reviews = d.evidence.filter((e) => e.source_type === "lesson_review");
  assert.equal(reviews.length, 3);
  assert.deepEqual(new Set(reviews.map((e) => e.submission_id)), new Set([w1.sub, w2.sub, w3.sub]));
  assert.ok(reviews.every((e) => e.level === "demonstrated" && e.submission_id));
  const quizzes = d.evidence.filter((e) => e.source_type === "quiz");
  assert.equal(quizzes.length, 3);
  assert.ok(quizzes.every((e) => e.level === "practice" && e.score === 1 && e.total === 1));
  assert.ok(d.criteria.find((c) => c.key === "parent").met === false);
  assert.equal(d.history[0].to_status, "demonstrated");
  assert.equal(d.evidence.find((e) => e.lesson_id === L1.id).origin, "manual");
  const olc = await ot.outcomeDetail(db, fam, mia, OLC, { now: D(12) });
  assert.equal(olc.evidence.find((e) => e.source_type === "lesson_review").origin, "ai");

  // 7. The parent confirms the outcome as Achieved.
  assert.ok((await ot.confirmOutcome(db, fam, `u-${fam}`, mia, RN, { note: "Explains place value clearly" }, D(13))).ok);
  t = await ot.trackerFor(db, fam, mia, { now: D(13) });
  assert.equal(statusOf(t, RN).status, "achieved");
  d = await ot.outcomeDetail(db, fam, mia, RN, { now: D(13) });
  assert.equal(d.history[0].to_status, "achieved");
  assert.equal(d.history[0].actor, "parent");
  const historyBefore = d.history.length;

  // Confirming below the guideline needs an explicit override and a note.
  assert.equal((await ot.confirmOutcome(db, fam, `u-${fam}`, mia, AR, {}, D(13))).code, "BELOW_GUIDELINE");
  assert.equal((await ot.confirmOutcome(db, fam, `u-${fam}`, mia, AR, { override: true }, D(13))).code, "NOTE_REQUIRED");

  // 8. Later the parent adds new evidence: the achievement and its history are preserved.
  const added = await ot.addEvidence(db, fam, `u-${fam}`, mia, RN, { level: "demonstrated", support: "independent", note: "Read 4-digit numbers at the shops", occurred_on: "2026-10-20" }, D(20));
  assert.ok(added.ok, JSON.stringify(added));
  d = await ot.outcomeDetail(db, fam, mia, RN, { now: D(20) });
  assert.equal(d.status, "achieved");
  assert.ok(d.history.length >= historyBefore);
  assert.ok(d.history.some((h) => h.to_status === "achieved" && h.actor === "parent"));
  assert.equal(d.evidence.filter((e) => e.counts).length, 7);

  // Leo's tracker is untouched by Mia's work.
  const tl = await ot.trackerFor(db, fam, leo, { now: D(20) });
  assert.ok(tl.outcomes.every((o) => o.status === "not_started" && o.evidence_count === 0));
});

test("a confirmed achievement is never silently removed when its evidence changes", async () => {
  const db = makeDb();
  const fam = family(db);
  const kid = child(db, fam);
  const a = await makeLesson(db, fam, "A", [RN]);
  const b = await makeLesson(db, fam, "B", [RN]);
  const wa = await doLesson(db, fam, kid, a, 2);
  const wb = await doLesson(db, fam, kid, b, 3);
  await review(db, fam, wa.sub, 2, "demonstrated", [{ code: RN, mark: "shown" }]);
  await review(db, fam, wb.sub, 3, "demonstrated", [{ code: RN, mark: "shown" }]);
  assert.ok((await ot.confirmOutcome(db, fam, `u-${fam}`, kid, RN, {}, D(4))).ok);

  // The parent re-reviews one piece as "not yet": the evidence drops below the guideline.
  await review(db, fam, wb.sub, 5, "demonstrated", [{ code: RN, mark: "not_yet" }]);
  const d = await ot.outcomeDetail(db, fam, kid, RN, { now: D(5) });
  assert.equal(d.status, "achieved", "the parent's confirmation stays");
  assert.equal(d.computed_status, "developing");
  assert.ok(d.gaps.includes("confirmed_evidence_changed"));
  assert.match(d.history[0].reason, /confirmation is kept/);

  // Only the parent can withdraw it, with a reason.
  assert.equal((await ot.unconfirmOutcome(db, fam, `u-${fam}`, kid, RN, {}, D(6))).code, "NOTE_REQUIRED");
  assert.ok((await ot.unconfirmOutcome(db, fam, `u-${fam}`, kid, RN, { note: "Needs another look" }, D(6))).ok);
  const after = await ot.outcomeDetail(db, fam, kid, RN, { now: D(6) });
  assert.equal(after.status, "developing");
  assert.ok(after.history.some((h) => h.to_status === "achieved"), "earlier history is kept");
});

test("duplicate submissions, re-reviews and resyncs never double count", async () => {
  const db = makeDb();
  const fam = family(db);
  const kid = child(db, fam);
  const l = await makeLesson(db, fam, "A", [RN, AR]);
  const w = await doLesson(db, fam, kid, l, 2);
  // A second hand-in of the same assignment is refused by the existing rules.
  assert.equal((await lb.submitWork(db, { id: kid, family_id: fam }, { assignment_id: w.assignment }, D(2))).status, 409);
  // Extra quiz attempts count once (best attempt).
  await lb.checkQuiz(db, { id: kid, family_id: fam }, w.assignment, ["1"], D(2)).catch(() => null);
  for (let i = 0; i < 3; i++) await review(db, fam, w.sub, 3, "demonstrated", [{ code: RN, mark: "shown" }, { code: AR, mark: "practising" }]);
  await ot.syncStudent(db, fam, kid, D(4));
  await ot.syncStudent(db, fam, kid, D(4));
  assert.equal(count(db, "SELECT COUNT(*) n FROM outcome_evidence WHERE student_id = ?", kid), 4, "2 outcomes x (lesson review + quiz)");
  assert.equal(count(db, "SELECT COUNT(*) n FROM outcome_progress WHERE student_id = ?", kid), 2);

  // Linking the same Evidence Backpack note twice is refused.
  const note = await pl.createEvidenceNote(db, fam, { student_id: kid, title: "Shop maths", occurred_on: "2026-10-05" }, D(5));
  assert.ok(note.ok);
  assert.ok((await ot.addEvidence(db, fam, `u-${fam}`, kid, RN, { evidence_note_id: note.note.id, level: "demonstrated" }, D(5))).ok);
  assert.equal((await ot.addEvidence(db, fam, `u-${fam}`, kid, RN, { evidence_note_id: note.note.id, level: "demonstrated" }, D(5))).code, "DUPLICATE");

  const before = await ot.outcomeDetail(db, fam, kid, RN, { now: D(5) });
  assert.equal(before.status, "demonstrated", "two pieces on two days: lesson (day 3) + linked note (day 5)");
});

test("deleted, excluded and moved evidence recalculates progress but keeps the record", async () => {
  const db = makeDb();
  const fam = family(db);
  const kid = child(db, fam);
  const l = await makeLesson(db, fam, "A", [RN]);
  const w = await doLesson(db, fam, kid, l, 2);
  await review(db, fam, w.sub, 2, "demonstrated", [{ code: RN, mark: "shown" }]);
  const note = await pl.createEvidenceNote(db, fam, { student_id: kid, title: "Number hunt", occurred_on: "2026-10-04" }, D(4));
  await ot.addEvidence(db, fam, `u-${fam}`, kid, RN, { evidence_note_id: note.note.id, level: "demonstrated", support: "some" }, D(4));
  assert.equal((await ot.outcomeDetail(db, fam, kid, RN, { now: D(4) })).status, "demonstrated");

  // Deleting the Backpack note stops it counting; the link is kept as history.
  assert.ok((await pl.deleteEvidenceNote(db, fam, note.note.id)).ok);
  let d = await ot.outcomeDetail(db, fam, kid, RN, { now: D(5) });
  assert.equal(d.status, "developing");
  const gone = d.evidence.find((e) => e.source_type === "evidence_note");
  assert.equal(gone.counts, false);
  assert.match(gone.removed_reason, /deleted/);

  // A parent observation can be moved to another outcome; both outcomes are recalculated.
  const obs = await ot.addEvidence(db, fam, `u-${fam}`, kid, RN, { level: "demonstrated", note: "Ordered numbers to 10 000", occurred_on: "2026-10-06" }, D(6));
  assert.equal((await ot.outcomeDetail(db, fam, kid, RN, { now: D(6) })).status, "demonstrated");
  const moved = await ot.editEvidence(db, fam, obs.id, { outcome_code: MR }, D(7));
  assert.ok(moved.ok, JSON.stringify(moved));
  assert.equal((await ot.outcomeDetail(db, fam, kid, RN, { now: D(7) })).status, "developing");
  assert.equal((await ot.outcomeDetail(db, fam, kid, MR, { now: D(7) })).status, "developing");

  // Lesson evidence can't be edited here (it follows its source), but it can be excluded with a reason and restored.
  const lessonEv = d.evidence.find((e) => e.source_type === "lesson_review");
  assert.equal((await ot.editEvidence(db, fam, lessonEv.id, { level: "practice" }, D(8))).code, "SOURCE_OWNED");
  assert.equal((await ot.setExcluded(db, fam, lessonEv.id, true, "", D(8))).code, "NOTE_REQUIRED");
  assert.ok((await ot.setExcluded(db, fam, lessonEv.id, true, "Lesson didn't really cover this", D(8))).ok);
  d = await ot.outcomeDetail(db, fam, kid, RN, { now: D(8) });
  assert.ok(d.evidence.find((e) => e.id === lessonEv.id).excluded_at);
  // A resync never un-does the parent's exclusion.
  await ot.syncStudent(db, fam, kid, D(9));
  assert.ok((await ot.outcomeDetail(db, fam, kid, RN, { now: D(9) })).evidence.find((e) => e.id === lessonEv.id).excluded_at);
  assert.ok((await ot.setExcluded(db, fam, lessonEv.id, false, "", D(10))).ok);
  assert.equal((await ot.outcomeDetail(db, fam, kid, RN, { now: D(10) })).evidence.find((e) => e.id === lessonEv.id).counts, true);
});

test("life learning: only reviewed, verified-code mappings count; re-review recalculates", async () => {
  const db = makeDb();
  const fam = family(db);
  const kid = child(db, fam);
  const t = NOW.toISOString();
  const life = (id, date, status, mappings) => {
    db.raw.prepare("INSERT OR REPLACE INTO life_evidence (id,family_id,student_id,title,description,date,status,accepted_mappings,suggested_mappings,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)")
      .run(id, fam, kid, `Activity ${id}`, "We did it", date, status, JSON.stringify(mappings), JSON.stringify([{ code: MR, description: "AI suggestion" }]), t);
  };
  life("life1", "2026-10-02", "demonstrated", [{ code: OLC, accepted: true }, { learning_area: "English", description: "Plain-language mapping, no code", accepted: true }]);
  life("life2", "2026-10-03", "awaiting_mapping", []);
  await ot.trackLifeEvidence(db, fam, "life1", D(3));
  await ot.trackLifeEvidence(db, fam, "life2", D(3));
  life("life3", "2026-10-04", "demonstrated", [{ code: OLC, accepted: true }]);
  await ot.trackLifeEvidence(db, fam, "life3", D(4));
  let tr = await ot.trackerFor(db, fam, kid, { now: D(4) });
  assert.equal(statusOf(tr, OLC).status, "demonstrated");
  assert.equal(statusOf(tr, MR).status, "not_started", "unreviewed AI suggestions never count");
  assert.equal(count(db, "SELECT COUNT(*) n FROM outcome_evidence WHERE student_id = ?", kid), 2, "plain-language mapping stays in the Backpack only");

  // The parent re-reviews: needs more evidence.
  life("life3", "2026-10-04", "needs_more_evidence", [{ code: OLC, accepted: true }]);
  await ot.trackLifeEvidence(db, fam, "life3", D(5));
  tr = await ot.trackerFor(db, fam, kid, { now: D(5) });
  assert.equal(statusOf(tr, OLC).status, "developing");
  assert.ok(statusOf(tr, OLC).gaps.includes("needs_consolidation"));
  const det = await ot.outcomeDetail(db, fam, kid, OLC, { now: D(5) });
  assert.ok(det.suggestions.some((s) => s.kind === "life_learning"));
  assert.ok(det.suggestions.find((s) => s.kind === "manual_lesson").to.includes(OLC));
});

test("children and families stay separate", async () => {
  const db = makeDb();
  const famA = family(db), famB = family(db);
  const a1 = child(db, famA, "Ana"), a2 = child(db, famA, "Ben"), b1 = child(db, famB, "Cal");
  const l = await makeLesson(db, famA, "A", [RN]);
  const w = await doLesson(db, famA, a1, l, 2);
  await review(db, famA, w.sub, 2, "demonstrated", [{ code: RN, mark: "shown" }]);
  assert.equal(count(db, "SELECT COUNT(*) n FROM outcome_evidence WHERE student_id = ?", a2), 0);
  assert.equal(await ot.trackerFor(db, famB, a1, { now: D(3) }), null, "another family can't read the tracker");
  assert.equal((await ot.confirmOutcome(db, famB, `u-${famB}`, a1, RN, {}, D(3))).status, 404);
  const ev = (await ot.outcomeDetail(db, famA, a1, RN, { now: D(3) })).evidence[0];
  assert.equal((await ot.setExcluded(db, famB, ev.id, true, "not mine", D(3))).status, 404);
  assert.equal((await ot.addEvidence(db, famB, `u-${famB}`, b1, RN, { level: "demonstrated", note: "x" }, D(3))).ok, true);
  assert.equal(count(db, "SELECT COUNT(*) n FROM outcome_evidence WHERE family_id = ?", famA), 2);
  const sum = await ot.familySummary(db, famA, D(3));
  assert.deepEqual(sum.students.map((s) => s.name), ["Ana", "Ben"]);
});

test("unsupported states show a gap; switching states keeps records isolated by framework", async () => {
  const db = makeDb();
  const fam = family(db, { jurisdiction: "VIC" });
  const kid = child(db, fam);
  const t = await ot.trackerFor(db, fam, kid, { now: D(2) });
  assert.equal(t.available, false);
  assert.match(t.note, /Victorian Curriculum/);
  assert.deepEqual(t.outcomes, []);
  assert.equal((await ot.confirmOutcome(db, fam, `u-${fam}`, kid, RN, {}, D(2))).code, "NO_CATALOGUE");
  const none = await ot.trackerFor(db, family(db, { jurisdiction: null }), child(db, `fam${n}`), { now: D(2) });
  assert.equal(none.available, false);

  // An NSW family with records moves interstate: records are kept (hidden), and reappear if they move back.
  const nsw = family(db);
  const k2 = child(db, nsw);
  await ot.addEvidence(db, nsw, `u-${nsw}`, k2, RN, { level: "demonstrated", note: "x" }, D(2));
  db.raw.prepare("UPDATE families SET jurisdiction = 'QLD' WHERE id = ?").run(nsw);
  const qld = await ot.trackerFor(db, nsw, k2, { now: D(3) });
  assert.equal(qld.available, true, "QLD uses the partial AC9 reference catalogue");
  assert.equal(qld.framework.key, "AC9");
  assert.ok(!qld.outcomes.some(x => x.code === RN), "NSW codes must not appear in the AC9 tracker");
  assert.equal(count(db, "SELECT COUNT(*) n FROM outcome_evidence WHERE student_id = ?", k2), 1);
  db.raw.prepare("UPDATE families SET jurisdiction = 'NSW' WHERE id = ?").run(nsw);
  assert.equal(statusOf(await ot.trackerFor(db, nsw, k2, { now: D(3) }), RN).evidence_count, 1);
});

test("curriculum wording updates don't rewrite what was recorded", async () => {
  const db = makeDb();
  const fam = family(db);
  const kid = child(db, fam);
  await ot.addEvidence(db, fam, `u-${fam}`, kid, RN, { level: "practice", note: "x" }, D(2));
  db.raw.prepare("UPDATE outcome_progress SET description = 'Older wording of this outcome', catalogue_version = 'nsw-seed-v2' WHERE student_id = ?").run(kid);
  const d = await ot.outcomeDetail(db, fam, kid, RN, { now: D(3) });
  assert.equal(d.outcome.description, "", "Never re-publish legacy stored syllabus text");
  assert.ok(!JSON.stringify(d).includes("Older wording of this outcome"));
  assert.equal(db.raw.prepare("SELECT description FROM outcome_progress WHERE student_id = ? AND outcome_code = ?").get(kid, RN).description, "Older wording of this outcome", "Historical records remain intact");
  assert.equal(d.status, "developing");
});

test("learner needs: documented adjustments let well-supported work count", async () => {
  const db = makeDb();
  const fam = family(db);
  const kid = child(db, fam);
  const a = await makeLesson(db, fam, "A", [AR]);
  const b = await makeLesson(db, fam, "B", [AR]);
  const wa = await doLesson(db, fam, kid, a, 2, { support: "red" });
  const wb = await doLesson(db, fam, kid, b, 3, { needsHelp: true });
  await review(db, fam, wa.sub, 2, "demonstrated", [{ code: AR, mark: "shown" }]);
  await review(db, fam, wb.sub, 3, "demonstrated", [{ code: AR, mark: "shown" }]);
  assert.equal((await ot.outcomeDetail(db, fam, kid, AR, { now: D(4) })).status, "developing");
  assert.ok((await ot.setLearnerSupport(db, fam, kid, { documented_adjustments: true, note: "Scribe and reader" }, D(4))).ok);
  const d = await ot.outcomeDetail(db, fam, kid, AR, { now: D(4) });
  assert.equal(d.status, "demonstrated");
  assert.match(d.history[0].reason, /adjustments/);
  // The student record's other settings are untouched.
  const extra = JSON.parse(db.raw.prepare("SELECT extra FROM students WHERE id = ?").get(kid).extra);
  assert.equal(extra.outcome_support.note, "Scribe and reader");
});

test("mastery rules: pure evaluation", () => {
  const e = (level, day, extra = {}) => ({ id: `${level}${day}`, source_type: "x", source_id: `${day}`, level, support: "independent", consolidate: 0, comprehensive: 0, occurred_on: `2026-10-${String(day).padStart(2, "0")}`, ...extra });
  const R = ot.DEFAULT_RULES;
  assert.equal(ot.evaluate([], R).status, "not_started");
  assert.equal(ot.evaluate([e("participation", 1)], R).status, "introduced");
  assert.equal(ot.evaluate([e("participation", 1), e("participation", 2)], R).status, "developing");
  assert.equal(ot.evaluate([e("demonstrated", 1), e("demonstrated", 1, { id: "b", source_id: "b" })], R).status, "developing", "same day = one occasion");
  assert.equal(ot.evaluate([e("demonstrated", 1), e("demonstrated", 2)], R).status, "demonstrated");
  assert.equal(ot.evaluate([e("demonstrated", 1, { comprehensive: 1 })], R).status, "demonstrated", "comprehensive assessment");
  assert.equal(ot.evaluate([e("demonstrated", 1), e("demonstrated", 2)], R, { confirmed: true }).status, "achieved");
  assert.equal(ot.evaluate([e("demonstrated", 1), e("demonstrated", 2, { excluded_at: "x" })], R).status, "developing");
  assert.ok(ot.evaluate([e("participation", 1)], R, { now: new Date("2026-12-01T00:00:00Z") }).gaps.includes("not_revisited"));
  // Rules can be refined by curriculum, subject and outcome type without touching the defaults.
  const strict = ot.resolveRules({ framework: "NSW", learning_area: "English", code: "EN2-OLC-01" }, {}, [{ learning_area: "English", rules: { min_evidence: 3 }, why: "test" }]);
  assert.equal(strict.min_evidence, 3);
  assert.equal(ot.resolveRules({ framework: "NSW", learning_area: "Mathematics", code: "MA2-RN-01" }, {}, [{ learning_area: "English", rules: { min_evidence: 3 }, why: "test" }]).min_evidence, 2);
  assert.equal(ot.evaluate([e("demonstrated", 1), e("demonstrated", 2)], strict).status, "developing");
  assert.equal(ot.resolveRules({ framework: "NSW", code: RN }, { documented_adjustments: true }).significant_support_counts, true);
});

test("tracker bookkeeping can never break a review", async () => {
  const db = makeDb();
  const fam = family(db);
  const kid = child(db, fam);
  const l = await makeLesson(db, fam, "A", [RN]);
  const w = await doLesson(db, fam, kid, l, 2);
  db.raw.exec("DROP TABLE outcome_progress");
  const errors = console.error; console.error = () => {};
  try { assert.ok((await review(db, fam, w.sub, 3, "demonstrated", [{ code: RN, mark: "shown" }])).ok); }
  finally { console.error = errors; }
  assert.equal(db.raw.prepare("SELECT status FROM submissions WHERE id = ?").get(w.sub).status, "demonstrated");
});

test("schema: runtime creation matches migration 0057, and the Backpack shows tracker status", async () => {
  const fresh = makeDb("0057");
  await ot.ensureTracker(fresh);
  const migrated = makeDb();
  const cols = (db, t) => db.raw.prepare(`SELECT name, type, "notnull", dflt_value FROM pragma_table_info('${t}') ORDER BY cid`).all();
  for (const t of ["outcome_evidence", "outcome_progress", "outcome_status_history"]) assert.deepEqual(cols(fresh, t), cols(migrated, t), t);
  // Applying the migration after the runtime created the tables is harmless.
  fresh.raw.exec(readFileSync(new URL("../migrations/0057_outcome_tracker.sql", import.meta.url), "utf8"));

  const fam = family(migrated);
  const kid = child(migrated, fam);
  const l = await makeLesson(migrated, fam, "A", [RN]);
  const w = await doLesson(migrated, fam, kid, l, 2);
  await review(migrated, fam, w.sub, 2, "demonstrated", [{ code: RN, mark: "shown", accepted: true }]);
  const p = await buildPortfolio(migrated, fam, kid, { now: D(3) });
  const o = p.summary.outcomes.find((x) => x.code === RN);
  assert.equal(o.status, "shown", "the review mark (understanding shown) is still shown on the work");
  assert.equal(o.mastery, "developing", "but the outcome itself is not Achieved until the parent confirms");
  assert.equal(o.mastery_confirmed, false);
});

test("one reviewed comprehensive assessment reaches Demonstrated; it still needs the parent to confirm Achieved", async () => {
  const db = makeDb();
  const fam = family(db);
  const kid = child(db, fam);
  const l = await makeLesson(db, fam, "Place value test", [RN, AR]);
  const w = await doLesson(db, fam, kid, l, 1);
  await review(db, fam, w.sub, 1, "demonstrated", [{ code: RN, mark: "shown", comprehensive: true }, { code: AR, mark: "practising", comprehensive: true }]);
  const t = await ot.trackerFor(db, fam, kid, { now: D(2) });
  assert.equal(statusOf(t, RN).status, "demonstrated", "comprehensive + shown");
  assert.equal(statusOf(t, AR).status, "developing", "comprehensive without 'shown' is just practice");
  assert.equal(t.outcomes.filter((o) => o.status === "achieved").length, 0);
});

test("review mappings can only add codes from the family's own framework", async () => {
  const db = makeDb();
  const fam = family(db); // NSW
  const kid = child(db, fam);
  const l = await makeLesson(db, fam, "Mixed codes", [RN]);
  const w = await doLesson(db, fam, kid, l, 1);
  await review(db, fam, w.sub, 1, "demonstrated", [{ code: RN, mark: "shown" }, { code: "AC9M3N01", mark: "shown" }, { code: "INVENTED-01", mark: "shown" }]);
  const codes = db.raw.prepare("SELECT DISTINCT outcome_code c FROM outcome_evidence WHERE student_id = ?").all(kid).map((r) => r.c);
  assert.deepEqual(codes, [RN], "AC9 and invented codes never become evidence for a NSW family");
});

test("lessons keep only codes from the family's own catalogue (AC9 states can link AC9 codes)", async () => {
  const db = makeDb();
  const qld = family(db, { jurisdiction: "QLD" });
  const nsw = family(db);
  const vic = family(db, { jurisdiction: "VIC" });
  const q = await makeLesson(db, qld, "Q", ["AC9M3N01", RN, "MADE-UP-1"]);
  const n = await makeLesson(db, nsw, "N", ["AC9M3N01", RN]);
  const v = await makeLesson(db, vic, "V", ["AC9M3N01", RN]);
  assert.deepEqual(q.outcome_codes, ["AC9M3N01"]);
  assert.deepEqual(n.outcome_codes, [RN]);
  assert.deepEqual(v.outcome_codes, [], "no verified Victorian catalogue: nothing is attached rather than borrowing another framework");
  const kid = child(db, qld);
  const w = await doLesson(db, qld, kid, q, 1);
  await review(db, qld, w.sub, 1, "demonstrated", [{ code: "AC9M3N01", mark: "shown" }]);
  const t = await ot.trackerFor(db, qld, kid, { now: D(2) });
  assert.equal(statusOf(t, "AC9M3N01").status, "developing", "QLD lesson evidence reaches the tracker");
});

// ---------------------------------------------------------------- the child's program comes from their profile
function kidWith(db, fam, { stage, year, electives, subject_levels } = {}) {
  const id = `prog${++n}`;
  const extra = JSON.stringify({ electives: electives || [], subject_levels: subject_levels || {} });
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at,extra) VALUES (?,?,?,?,?,?,?,?,?)").run(id, fam, "Sam", `sam${id}`, "x", stage, year, NOW.toISOString(), extra);
  return id;
}
const course = (name, learning_area) => ({ code: name.toUpperCase().slice(0, 6), name, learning_area });
const areasOf = (t) => [...new Set(t.outcomes.filter((o) => o.in_stage).map((o) => o.learning_area))].sort();

test("Mason's case: Year 7 with History, Languages and Technology gets cards for those subjects, Languages flagged as not held", async () => {
  const db = makeDb();
  const fam = family(db);
  const sid = kidWith(db, fam, { stage: "S4", year: "7", electives: [course("English", "English"), course("Mathematics", "Mathematics"), course("Science", "Science"), course("History", "HSIE"), course("Languages (100 hours over Years 7-8)", "Languages"), course("Technology", "Technology")] });
  const t = await ot.trackerFor(db, fam, sid, { now: NOW });
  assert.deepEqual(t.areas.map((a) => a.subject), ["English", "Mathematics", "Science", "History", "Languages (100 hours over Years 7-8)", "Technology"]);
  const hist = t.areas.find((a) => a.subject === "History");
  assert.equal(hist.total, 2, "HT4-1 and HT4-2 only");
  assert.ok(!t.outcomes.some((o) => o.code === "GE4-1"), "no Geography outcome for a History student");
  const lang = t.areas.find((a) => a.subject.startsWith("Languages"));
  assert.equal(lang.total, 0); assert.equal(lang.unsupported, true); assert.match(lang.note, /doesn't hold verified/);
  assert.equal(t.areas.find((a) => a.subject === "Technology").total, 1);
  const tm = t.outcomes.find((o) => o.code === "TM4-1");
  assert.equal(tm.subject, "Technology"); assert.equal(tm.level_label, "Stage 4"); assert.match(tm.source_title, /Technology Mandatory/);
});

test("Years 7-12: the tracker covers only the courses chosen when the child was added", async () => {
  const db = makeDb();
  const fam = family(db);
  const sid = kidWith(db, fam, { stage: "S5", year: "9", electives: [course("English", "English"), course("Mathematics", "Mathematics"), course("Science", "Science"), course("History", "HSIE")] });
  const t = await ot.trackerFor(db, fam, sid, { now: NOW });
  assert.deepEqual(areasOf(t), ["English", "HSIE", "Mathematics", "Science"], "no Creative Arts, PDHPE or TAS outcomes the child isn't studying");
  assert.equal(t.program.level, "Year 9");
  assert.deepEqual(t.program.courses.map((c) => c.name), ["English", "Mathematics", "Science", "History"]);
  assert.deepEqual(t.areas.map((a) => a.subject), ["English", "Mathematics", "Science", "History"], "cards are the child's own subjects, in the order chosen");
  assert.ok(t.outcomes.filter((o) => o.in_stage && o.learning_area === "HSIE").every((o) => o.code.startsWith("HT")), "History, not Geography");
  assert.ok(t.outcomes.every((o) => o.description === "" && o.source_title && o.official_url.startsWith("https://")), "rows show source and link, never the code twice");
  // Evidence outside the program is kept and shown, flagged as outside it.
  const ca = ot.catalogueFor("NSW").outcomes.find((o) => o.stage === "S5" && o.learning_area === "Creative Arts").code;
  assert.ok((await ot.addEvidence(db, fam, `u-${fam}`, sid, ca, { level: "practice", note: "Band practice" }, NOW)).ok);
  const t2 = await ot.trackerFor(db, fam, sid, { now: NOW });
  const o = t2.outcomes.find((x) => x.code === ca);
  assert.ok(o && o.in_stage === false && o.evidence_count === 1);
});

test("AC9 follows the child's year (not the two-year stage) and chosen subjects; primary covers every area", async () => {
  const db = makeDb();
  const fam = family(db, { jurisdiction: "QLD" });
  const y3 = kidWith(db, fam, { stage: "S2", year: "3" });
  const t3 = await ot.trackerFor(db, fam, y3, { now: NOW });
  const cat = ot.catalogueFor("QLD");
  const inProg = t3.outcomes.filter((o) => o.in_stage).map((o) => cat.byCode.get(o.code));
  assert.ok(inProg.length > 20 && inProg.every((o) => o.from <= 3 && o.to >= 3), "Year 3 child gets Year 3 content only");
  assert.ok(!t3.outcomes.some((o) => o.code === "AC9M4N01"), "no Year 4 maths for a Year 3 child");
  assert.equal(t3.program.areas, null, "primary: every learning area");
  assert.ok(areasOf(t3).includes("The Arts") && areasOf(t3).includes("Humanities and Social Sciences"));

  const y9 = kidWith(db, fam, { stage: "S5", year: "9", electives: [course("English", "English"), course("Music", "Creative Arts"), course("History", "HSIE"), course("Food Technology", "Technology")] });
  const t9 = await ot.trackerFor(db, fam, y9, { now: NOW });
  const subjects = new Set(t9.outcomes.filter((o) => o.in_stage).map((o) => cat.byCode.get(o.code).subject));
  assert.deepEqual([...subjects].sort(), ["Design and Technologies", "English", "History 7-10", "Music"], "only the chosen subjects within each area");
});

test("a per-subject level on the profile moves just that subject", async () => {
  const db = makeDb();
  const fam = family(db);
  const sid = kidWith(db, fam, { stage: "S2", year: "3", subject_levels: { Mathematics: "S3" } });
  const t = await ot.trackerFor(db, fam, sid, { now: NOW });
  const nsw = ot.catalogueFor("NSW");
  const prog = t.outcomes.filter((o) => o.in_stage).map((o) => nsw.byCode.get(o.code));
  assert.ok(prog.filter((o) => o.learning_area === "Mathematics").every((o) => o.stage === "S3"));
  assert.ok(prog.filter((o) => o.learning_area === "English").every((o) => o.stage === "S2"));
});

test("a chosen subject is never filled with another subject's outcomes", async () => {
  const db = makeDb();
  const fam = family(db);
  const sid = kidWith(db, fam, { stage: "S5", year: "9", electives: [course("Music", "Creative Arts"), course("Geography", "HSIE")] });
  const t = await ot.trackerFor(db, fam, sid, { now: NOW });
  assert.equal(t.areas.find((a) => a.subject === "Music").unsupported, true, "no Music outcomes held, so no Visual Arts stand-in");
  assert.deepEqual(t.outcomes.filter((o) => o.in_stage).map((o) => o.code), ["GE5-1"]);
});
