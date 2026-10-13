import test from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import * as lb from "../src/lessonBuilder.ts";
import { effectivePlan, limitsFor, trialEndFrom } from "../src/entitlements.ts";

const NOW = new Date("2026-10-14T00:00:00Z");
let n = 0;
function seed(db, { plan = "FREE_PREVIEW", fam = `f${++n}`, trialStart = NOW.toISOString(), periodEnd = null } = {}) {
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at,plan_period_end) VALUES (?,?,?,?,?,?,?,?)")
    .run(fam, "Fam", `u${fam}`, trialStart, plan, trialStart, trialEndFrom(trialStart), periodEnd);
  return fam;
}
function child(db, fam, id = `s${++n}`) {
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,created_at) VALUES (?,?,?,?,?,?,?)")
    .run(id, fam, "Kid", `kid${id}`, "x", "S2", NOW.toISOString());
  db.raw.prepare("INSERT INTO pets (id,student_id,family_id,name,species,created_at) VALUES (?,?,?,?,?,?)").run(`p${id}`, id, fam, "Pet", "goblin", NOW.toISOString());
  return id;
}
const lesson = (over = {}) => ({
  title: "Fractions", learning_area: "Mathematics", stage: "S2", status: "ready",
  objectives: ["Add fractions"], sections: [{ heading: "Parts", body: "Fractions are parts of a whole." }],
  quiz: [{ question: "Half of 4?", options: ["1", "2"], correct_index: 1 }],
  resources: [{ title: "Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", type: "video" }],
  questions: [{ prompt: "1/2 + 1/2 = ?", type: "short", answer_key: "1" }],
  answer_key: "All answers: 1", parent_notes: "secret", ...over,
});
async function mk(db, fam, over) { const r = await lb.createLesson(db, fam, lesson(over), NOW); assert.ok(r.ok, JSON.stringify(r)); return r.lesson; }

test("entitlement states", () => {
  const t0 = NOW.toISOString();
  const row = { plan: "FREE_PREVIEW", trial_started_at: t0, trial_ends_at: trialEndFrom(t0) };
  assert.equal(effectivePlan(row, NOW), "FREE_PREVIEW");
  assert.equal(effectivePlan(row, new Date(NOW.getTime() + 8 * 86400000)), "PREVIEW_EXPIRED");
  assert.equal(effectivePlan({ plan: "bogus" }, NOW), "PREVIEW_EXPIRED");
  assert.equal(effectivePlan(null, NOW), "PREVIEW_EXPIRED");
  assert.equal(effectivePlan({ plan: "CANCELLED", plan_period_end: "2026-10-20T00:00:00Z" }, NOW), "ACTIVE_MONTHLY");
  assert.equal(effectivePlan({ plan: "CANCELLED", plan_period_end: "2026-10-01T00:00:00Z" }, NOW), "CANCELLED");
  assert.equal(limitsFor("CANCELLED").canCreate, false);
  assert.equal(limitsFor("ACTIVE_ANNUAL").maxChildren > 1, true);
});

test("migration 0050 grandfathers existing families as INTERNAL", () => {
  const db = makeDb("0050");
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at) VALUES ('old','Old','u','2026-01-01T00:00:00Z')").run();
  db.raw.exec(readFileSync(new URL("../migrations/0050_lesson_builder_entitlements.sql", import.meta.url), "utf8"));
  assert.equal(db.raw.prepare("SELECT plan FROM families WHERE id='old'").get().plan, "INTERNAL");
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at) VALUES ('new','New','u','2026-10-14T00:00:00Z')").run();
  assert.equal(db.raw.prepare("SELECT plan FROM families WHERE id='new'").get().plan, "FREE_PREVIEW");
});

test("sanitize rejects unsafe urls, ignores client embed_url, strips unknown keys", () => {
  assert.equal(lb.sanitizeLessonInput(lesson({ resources: [{ title: "x", url: "javascript:alert(1)" }] })).ok, false);
  assert.equal(lb.sanitizeLessonInput(lesson({ title: "" })).ok, false);
  const r = lb.sanitizeLessonInput(lesson({ resources: [{ title: "v", url: "https://example.com/a", embed_url: "https://evil.example/x" }], family_id: "other", evil: 1 }));
  assert.ok(r.ok);
  const d = lb.toLessonData(r.value);
  assert.ok(!JSON.stringify(d).includes("evil"));
  assert.equal(lb.embedUrlFor("https://www.youtube.com/watch?v=abc123"), "https://www.youtube-nocookie.com/embed/abc123");
  assert.equal(lb.embedUrlFor("https://example.com/a"), null);
  assert.equal(lb.sanitizeLessonInput(lesson({ sections: Array.from({ length: 10 }, () => ({ body: "x".repeat(15000) })) })).ok, false);
});

test("preview: max 2 lessons, 1 child, 2 active assignments (server side)", async () => {
  const db = makeDb();
  const fam = seed(db);
  const s1 = child(db, fam);
  assert.equal((await lb.checkCanAddChild(db, fam, NOW)).ok, false);
  const a = await mk(db, fam), b = await mk(db, fam, { title: "B" });
  const third = await lb.createLesson(db, fam, lesson({ title: "C" }), NOW);
  assert.equal(third.ok, false); assert.equal(third.status, 402); assert.equal(third.code, "UPGRADE_REQUIRED");
  assert.ok((await lb.assignLesson(db, fam, { student_id: s1, lesson_id: a.id }, NOW)).ok);
  assert.ok((await lb.assignLesson(db, fam, { student_id: s1, lesson_id: b.id }, NOW)).ok);
  const dup = await lb.assignLesson(db, fam, { student_id: s1, lesson_id: b.id }, NOW);
  assert.equal(dup.status, 409);
  // duplicating also counts as a new lesson
  assert.equal((await lb.duplicateLesson(db, fam, a.id, NOW)).status, 402);
});

test("preview limit on active assignments with paid lessons count", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const s = child(db, fam);
  const ls = [];
  for (let i = 0; i < 3; i++) ls.push(await mk(db, fam, { title: "L" + i }));
  for (const l of ls) assert.ok((await lb.assignLesson(db, fam, { student_id: s, lesson_id: l.id }, NOW)).ok);
  assert.ok((await lb.checkCanAddChild(db, fam, NOW)).ok);
  // flip to preview with 3 active: further assign blocked
  db.raw.prepare("UPDATE families SET plan='FREE_PREVIEW' WHERE id=?").run(fam);
  const l4 = await lb.createLesson(db, fam, lesson({ title: "L4" }), NOW);
  assert.equal(l4.status, 402); // lessons already over the cap
});

test("expired preview: cannot create or assign but data is kept", async () => {
  const db = makeDb();
  const fam = seed(db, { trialStart: "2026-09-01T00:00:00Z" });
  const s = child(db, fam);
  assert.equal((await lb.createLesson(db, fam, lesson(), NOW)).status, 402);
  db.raw.prepare("INSERT INTO lessons (id,family_id,title,status,data,created_at,updated_at) VALUES ('keep',?, 'Kept','ready','{}','2026-09-02','2026-09-02')").run(fam);
  assert.equal((await lb.assignLesson(db, fam, { student_id: s, lesson_id: "keep" }, NOW)).status, 402);
  assert.equal((await lb.listLessons(db, fam)).length, 1);
});

test("cross-family isolation", async () => {
  const db = makeDb();
  const f1 = seed(db, { plan: "ACTIVE_MONTHLY" }), f2 = seed(db, { plan: "ACTIVE_MONTHLY" });
  const l1 = await mk(db, f1);
  const s2 = child(db, f2);
  assert.equal((await lb.assignLesson(db, f2, { student_id: s2, lesson_id: l1.id }, NOW)).status, 404);
  assert.equal((await lb.updateLesson(db, f2, l1.id, lesson(), NOW)).status, 404);
  assert.equal((await lb.duplicateLesson(db, f2, l1.id, NOW)).status, 404);
  assert.equal((await lb.deleteLesson(db, f2, l1.id, NOW)).status, 404);
  assert.equal((await lb.listLessons(db, f2)).length, 0);
  const s1 = child(db, f1);
  assert.equal((await lb.assignLesson(db, f1, { student_id: s2, lesson_id: l1.id }, NOW)).status, 404);
  const a = await lb.assignLesson(db, f1, { student_id: s1, lesson_id: l1.id }, NOW);
  const sub = await lb.submitWork(db, { id: s2, family_id: f2 }, { assignment_id: a.assignment.id }, NOW);
  assert.equal(sub.ok, false);
});

test("premade lessons (family_id NULL) never appear in a family library", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  assert.equal((await lb.listLessons(db, fam)).length, 0);
  const premade = db.raw.prepare("SELECT id FROM lessons WHERE family_id IS NULL LIMIT 1").get();
  const s = child(db, fam);
  assert.equal((await lb.assignLesson(db, fam, { student_id: s, lesson_id: premade.id }, NOW)).status, 404);
});

test("full workflow: create, assign, snapshot survives edit, submit once, review, XP once", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const s = child(db, fam);
  const l = await mk(db, fam);
  const a = (await lb.assignLesson(db, fam, { student_id: s, lesson_id: l.id }, NOW)).assignment;
  // edit library lesson afterwards
  const up = await lb.updateLesson(db, fam, l.id, lesson({ title: "Fractions v2", sections: [{ heading: "New", body: "NEW TEXT" }] }), NOW);
  assert.ok(up.ok); assert.equal(up.lesson.version, 2);
  const row = db.raw.prepare("SELECT * FROM assignments WHERE id=?").get(a.id);
  const seen = lb.assignmentLesson(row, db.raw.prepare("SELECT * FROM lessons WHERE id=?").get(l.id));
  assert.equal(seen.title, "Fractions");
  // child-safe view hides keys
  const safe = lb.childSafeLesson(seen);
  assert.equal(safe.answer_key, undefined); assert.equal(safe.parent_notes, undefined);
  assert.ok(safe.questions.every((q) => q.answer_key === undefined));
  assert.ok(safe.quiz.every((q) => q.correct_index === undefined), "quiz answers must not reach the child");
  // quiz is marked on the server and must be passed before handing in
  const user = { id: s, family_id: fam };
  assert.equal((await lb.submitWork(db, user, { assignment_id: a.id, response_text: "1" }, NOW)).code, "QUIZ_NOT_PASSED");
  const bad = await lb.checkQuiz(db, user, a.id, ["1"], NOW);
  assert.ok(bad.ok); assert.equal(bad.passed, false);
  assert.equal((await lb.submitWork(db, user, { assignment_id: a.id, response_text: "1" }, NOW)).code, "QUIZ_NOT_PASSED");
  const good = await lb.checkQuiz(db, user, a.id, ["2"], NOW);
  assert.ok(good.ok); assert.equal(good.passed, true); assert.equal(good.attempt, 2);
  assert.equal(JSON.stringify(good).includes("correct_index"), false);
  // another child in the same family cannot mark someone else's assignment
  assert.equal((await lb.checkQuiz(db, { id: "x", family_id: fam }, a.id, ["2"], NOW)).status, 404);
  // draft is saved, survives, and is cleared on submit
  const dr = await lb.saveDraft(db, user, a.id, { answers: ["half"] }, NOW);
  assert.ok(dr.ok);
  assert.equal(JSON.parse(db.raw.prepare("SELECT draft FROM assignments WHERE id=?").get(a.id).draft).answers[0], "half");
  assert.equal(db.raw.prepare("SELECT status FROM assignments WHERE id=?").get(a.id).status, "in_progress");
  assert.equal((await lb.saveDraft(db, { id: "x", family_id: fam }, a.id, { answers: [] }, NOW)).status, 404);
  assert.equal(await lb.quizPassed(db, user, a, seen), true);
  // submit
  const sub = await lb.submitWork(db, { id: s, family_id: fam }, { assignment_id: a.id, response_text: "1" }, NOW);
  assert.equal(db.raw.prepare("SELECT draft FROM assignments WHERE id=?").get(a.id).draft, null);
  assert.ok(sub.ok); assert.equal(sub.status, "submitted");
  assert.equal((await lb.submitWork(db, { id: s, family_id: fam }, { assignment_id: a.id, response_text: "again" }, NOW)).status, 409);
  // review
  const r1 = await lb.reviewSubmission(db, fam, "parent", sub.id, { status: "accepted", feedback_text: "Great" }, NOW);
  assert.ok(r1.ok); assert.equal(r1.xp_awarded, 20);
  const r2 = await lb.reviewSubmission(db, fam, "parent", sub.id, { status: "accepted" }, NOW);
  assert.equal(r2.xp_awarded, 0);
  assert.equal(db.raw.prepare("SELECT xp FROM pets WHERE student_id=?").get(s).xp, 20);
  assert.equal(db.raw.prepare("SELECT status FROM assignments WHERE id=?").get(a.id).status, "accepted");
  assert.ok(db.raw.prepare("SELECT COUNT(*) n FROM lesson_evidence WHERE child_id=?").get(s).n >= 1);
  assert.equal((await lb.submitWork(db, { id: s, family_id: fam }, { assignment_id: a.id }, NOW)).status, 409);
  assert.equal((await lb.reviewSubmission(db, fam, "p", sub.id, { status: "hacked" }, NOW)).status, 400);
  // needs_revision gives no XP and lets the child resubmit
});

test("two children have independent assignments", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const s1 = child(db, fam), s2 = child(db, fam);
  const l = await mk(db, fam);
  const a1 = (await lb.assignLesson(db, fam, { student_id: s1, lesson_id: l.id }, NOW)).assignment;
  const a2 = (await lb.assignLesson(db, fam, { student_id: s2, lesson_id: l.id }, NOW)).assignment;
  await lb.submitWork(db, { id: s1, family_id: fam }, { assignment_id: a1.id, response_text: "kid1" }, NOW);
  assert.equal(db.raw.prepare("SELECT status FROM assignments WHERE id=?").get(a2.id).status, "not_started");
});

test("deleting an assigned lesson archives it; drafts cannot be assigned", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const s = child(db, fam);
  const l = await mk(db, fam);
  await lb.assignLesson(db, fam, { student_id: s, lesson_id: l.id }, NOW);
  const d = await lb.deleteLesson(db, fam, l.id, NOW);
  assert.ok(d.ok); assert.equal(d.archived, true);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM assignments WHERE lesson_id=?").get(l.id).n, 1);
  assert.equal((await lb.listLessons(db, fam)).length, 0);
  const draft = await mk(db, fam, { title: "Draft", status: "draft" });
  assert.equal((await lb.assignLesson(db, fam, { student_id: s, lesson_id: draft.id }, NOW)).status, 409);
});

// ---------------------------------------------------------------- AI drafting (paid only)
import * as aid from "../src/aiDraft.ts";
const GARDEN = JSON.parse(readFileSync(new URL("../../frontend/src/data/exampleLesson.json", import.meta.url), "utf8"));
const aiReply = (over = {}) => ({ response: JSON.stringify({ ...GARDEN, resources: [{ type: "link", title: "x", url: "https://evil.example" }], curriculum_refs: ["ACMNA999"], status: "ready", ...over }) });
const stub = (fn) => { const calls = []; return { calls, run: async (...a) => { calls.push(a); return fn ? fn(...a) : aiReply(); } }; };
const req = (family, ai, extra = {}) => ({ familyId: family, userId: "u1", request: { topic: "Fractions", ...extra }, ...extra.opts });

test("AI drafting: free preview, expired and cancelled are blocked before any AI call", async () => {
  for (const [plan, trialStart] of [["FREE_PREVIEW"], ["FREE_PREVIEW", "2026-09-01T00:00:00Z"], ["CANCELLED"]]) {
    const db = makeDb();
    const fam = seed(db, { plan, trialStart: trialStart || NOW.toISOString() });
    const ai = stub();
    const r = await aid.draftLessonWithAi(db, ai, req(fam), NOW);
    assert.equal(r.ok, false);
    assert.equal(r.status, 402);
    assert.equal(r.code, "UPGRADE_REQUIRED");
    assert.equal(ai.calls.length, 0);
    assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM ai_usage").get().n, 0);
    assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM lessons WHERE family_id = ?").get(fam).n, 0);
  }
});

test("AI drafting: paid family gets an unreviewed AI-labelled draft with no links, and usage is recorded", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const ai = stub();
  const r = await aid.draftLessonWithAi(db, ai, req(fam, ai, { learning_area: "Mathematics" }), NOW);
  assert.ok(r.ok, JSON.stringify(r));
  assert.equal(r.lesson.status, "draft");
  assert.equal(r.lesson.ai_generated, true);
  assert.equal(r.lesson.source, "ai");
  assert.deepEqual(r.lesson.resources, []);
  assert.deepEqual(r.warnings, []);
  assert.equal(ai.calls.length, 1); // a good first reply needs no retry
  assert.equal(r.usage.today, 1);
  assert.equal(r.lesson.delivery, "parent_guided");
  assert.equal(r.lesson.worked_examples.length, 3);
  assert.deepEqual(r.lesson.curriculum_refs, []); // invented codes are discarded
  const q1 = r.lesson.quiz.find((q) => q.question === "What is 23 + 45?");
  assert.equal(q1.options[q1.correct_index], "68"); // shuffling keeps the right answer marked
  const msgs = ai.calls[0][1].messages;
  assert.equal(msgs[0].role, "system");
  assert.equal(msgs.length, 4); // system + one reference example (user, assistant) + the real request
  assert.match(msgs[3].content, /Topic: Fractions/);
  assert.match(msgs[3].content, /DIFFERENT topic/);
  assert.equal(ai.calls[0][1].max_tokens, 8000);
  // Editing keeps the AI label; the parent marking it ready records a parent review.
  const up = await lb.updateLesson(db, fam, r.lesson.id, { ...lesson({ title: "Edited" }), status: "ready" }, NOW);
  assert.ok(up.ok);
  assert.equal(up.lesson.ai_generated, true);
  assert.equal(up.lesson.review_status, "parent_reviewed");
});

test("AI drafting: unavailable binding, bad output and quota", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_ANNUAL" });
  const none = await aid.draftLessonWithAi(db, undefined, req(fam), NOW);
  assert.equal(none.code, "AI_UNAVAILABLE");
  const bad = await aid.draftLessonWithAi(db, stub(() => ({ response: "sorry, no" })), req(fam), NOW);
  assert.equal(bad.code, "AI_FAILED");
  const boom = await aid.draftLessonWithAi(db, stub(() => { throw new Error("x"); }), req(fam), NOW);
  assert.equal(boom.code, "AI_FAILED");
  assert.equal((await aid.aiUsage(db, fam, NOW)).today, 0); // failures don't use the allowance
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM lessons WHERE family_id = ?").get(fam).n, 0);
  const short = await aid.draftLessonWithAi(db, stub(), { familyId: fam, userId: "u", request: { topic: "a" } }, NOW);
  assert.equal(short.status, 400);
  for (let i = 0; i < aid.AI_LIMITS.perDay; i++) assert.ok((await aid.draftLessonWithAi(db, stub(), req(fam), NOW)).ok);
  const over = await aid.draftLessonWithAi(db, stub(), req(fam), NOW);
  assert.equal(over.status, 429);
  assert.equal(over.code, "AI_QUOTA");
  // Another family is unaffected.
  const fam2 = seed(db, { plan: "ACTIVE_MONTHLY" });
  assert.ok((await aid.draftLessonWithAi(db, stub(), req(fam2), NOW)).ok);
});

// ---------------------------------------------------------------- assignment management + evidence notes
import * as pl from "../src/planning.ts";

test("assignments: move dates, reassign and cancel only before work starts; other families blocked", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const k1 = child(db, fam), k2 = child(db, fam);
  const l = await mk(db, fam);
  const a = (await lb.assignLesson(db, fam, { student_id: k1, lesson_id: l.id }, NOW)).assignment;
  const moved = await pl.updateAssignment(db, fam, a.id, { scheduled_date: "2026-11-02", due_date: "2026-11-05" });
  assert.ok(moved.ok); assert.equal(moved.assignment.scheduled_date, "2026-11-02");
  assert.equal((await pl.updateAssignment(db, fam, a.id, { due_date: "tomorrow" })).status, 400);
  const other = seed(db, { plan: "ACTIVE_MONTHLY" });
  assert.equal((await pl.updateAssignment(db, other, a.id, { due_date: "2026-11-05" })).status, 404);
  assert.equal((await pl.cancelAssignment(db, other, a.id)).status, 404);
  assert.equal((await pl.reassignAssignment(db, other, a.id, k2)).status, 404);
  const re = await pl.reassignAssignment(db, fam, a.id, k2);
  assert.ok(re.ok); assert.equal(re.assignment.student_id, k2);
  // a child from another family can't be targeted
  const stranger = child(db, other);
  assert.equal((await pl.reassignAssignment(db, fam, a.id, stranger)).status, 404);
  // started work cannot be reassigned or cancelled
  db.raw.prepare("UPDATE assignments SET status='in_progress' WHERE id=?").run(a.id);
  assert.equal((await pl.cancelAssignment(db, fam, a.id)).code, "STARTED");
  assert.equal((await pl.reassignAssignment(db, fam, a.id, k1)).code, "STARTED");
  // untouched ones can be cancelled
  const b = (await lb.assignLesson(db, fam, { student_id: k1, lesson_id: l.id }, NOW)).assignment;
  assert.ok((await pl.cancelAssignment(db, fam, b.id)).ok);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM assignments WHERE id=?").get(b.id).n, 0);
});

test("evidence notes: family-scoped, searchable, date filtered; expired preview keeps reading but cannot add", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "FREE_PREVIEW" });
  const kid = child(db, fam);
  const n = await pl.createEvidenceNote(db, fam, { student_id: kid, title: "Zoo excursion", notes: "Saw koalas", learning_area: "Science", occurred_on: "2026-10-01" }, NOW);
  assert.ok(n.ok);
  assert.equal((await pl.createEvidenceNote(db, fam, { student_id: kid, title: "" }, NOW)).status, 400);
  const other = seed(db, { plan: "ACTIVE_MONTHLY" });
  assert.equal((await pl.createEvidenceNote(db, other, { student_id: kid, title: "x" }, NOW)).status, 404);
  assert.equal((await pl.createEvidenceNote(db, fam, { student_id: kid, title: "x", file_ids: ["nope"] }, NOW)).code, "FILE_NOT_FOUND");
  assert.equal((await pl.listEvidenceNotes(db, fam, { q: "koala" })).length, 1);
  assert.equal((await pl.listEvidenceNotes(db, fam, { q: "dinosaur" })).length, 0);
  assert.equal((await pl.listEvidenceNotes(db, fam, { from: "2026-10-02" })).length, 0);
  assert.equal((await pl.listEvidenceNotes(db, other, {})).length, 0);
  const later = new Date(NOW.getTime() + 10 * 86400000);
  assert.equal((await pl.createEvidenceNote(db, fam, { student_id: kid, title: "Later" }, later)).status, 402);
  assert.equal((await pl.listEvidenceNotes(db, fam, {})).length, 1);
  assert.equal((await pl.deleteEvidenceNote(db, other, n.note.id)).status, 404);
  assert.ok((await pl.deleteEvidenceNote(db, fam, n.note.id)).ok);
});


test("AI drafting: a thin reply gets one targeted repair; an unfixable one is refused, not saved", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const thin = () => ({ response: JSON.stringify({ title: "Thin", objectives: ["a"], sections: [{ heading: "H", body: "Short." }], quiz: [{ question: "q", options: ["a", "b"], correct_index: 0 }] }) });
  const ai = stub(() => thin());
  const r = await aid.draftLessonWithAi(db, ai, { familyId: fam, userId: "u", request: { topic: "Fractions", duration_minutes: 60 } }, NOW);
  assert.equal(r.ok, false);
  assert.equal(r.code, "AI_FAILED");
  assert.match(r.detail, /wasn't good enough/);
  assert.equal(ai.calls.length, 2); // draft + one repair, never more
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM lessons WHERE family_id = ?").get(fam).n, 0);
  assert.equal((await aid.aiUsage(db, fam, NOW)).today, 0);
  // thin first, then a repair that supplies the missing parts: kept, with only the soft flags that remain
  let n = 0;
  const ai2 = stub((model, input) => {
    if (n++ === 0) return thin();
    assert.match(input.messages[1].content, /reviewer found these problems/);
    return aiReply(); // the repair returns the full set of keys; the matching ones are merged
  });
  const r2 = await aid.draftLessonWithAi(db, ai2, { familyId: fam, userId: "u", request: { topic: "Addition", duration_minutes: 60 } }, NOW);
  assert.ok(r2.ok, JSON.stringify(r2));
  assert.equal(ai2.calls.length, 2);
  assert.equal(r2.lesson.sections.length, 5);
  assert.deepEqual(r2.lesson.ai_flags, r2.warnings);
});

test("reference lessons meet the generator's own quality gate and match the frontend copies", async () => {
  const { REFERENCE_PARENT_GUIDED, REFERENCE_INDEPENDENT } = await import("../src/data/referenceLessons.ts");
  const B = JSON.parse(readFileSync(new URL("../../frontend/src/data/referenceYear7Integers.json", import.meta.url), "utf8"));
  assert.deepEqual(REFERENCE_PARENT_GUIDED, GARDEN);
  assert.deepEqual(REFERENCE_INDEPENDENT, B);
  for (const [ref, delivery] of [[GARDEN, "parent_guided"], [B, "independent"]]) {
    const spec = { topic: ref.title, area: "Mathematics", year: ref.year_level, goal: "", minutes: 60, delivery, interests: "", needs: "", notes: "" };
    const d = aid.normaliseDraft(ref, spec);
    assert.deepEqual(aid.qualityIssues(d, spec).map((i) => i.msg), [], delivery);
    // both are accepted by the same sanitiser the manual builder uses, with nothing shortened
    const clean = lb.sanitizeLessonInput({ ...ref, status: "ready" });
    assert.ok(clean.ok, JSON.stringify(clean));
    assert.equal(clean.value.builder.sections.length, ref.sections.length);
    assert.equal(clean.value.builder.sections[0].body, ref.sections[0].body);
    assert.equal(clean.value.builder.misconceptions.length, ref.misconceptions.length);
  }
});

test("quality gate catches fake resources, vague activities, wrong arithmetic and a missing student voice", () => {
  const spec = { topic: "t", area: "Mathematics", year: "Year 5", goal: "", minutes: 30, delivery: "independent", interests: "", needs: "", notes: "" };
  const d = aid.normaliseDraft(JSON.parse(aiReply().response), { ...spec, minutes: 60, delivery: "parent_guided" });
  const bad = { ...d, activities: [{ title: "Worksheet time", instructions: "Complete the worksheet.", offline: false, tasks: [] }, d.activities[0]], sections: d.sections.map((s) => ({ ...s, body: s.body.replace(/\byou(r|rs|rself)?\b/gi, "the child") + " 12 + 15 = 28." })) };
  const msgs = aid.qualityIssues(bad, { ...spec, minutes: 60, delivery: "independent" }).map((i) => i.msg).join(" | ");
  assert.match(msgs, /too vague/);
  assert.match(msgs, /worksheet/i);
  assert.match(msgs, /12 \+ 15 = 28/);
  assert.match(msgs, /directly to the student/);
  assert.deepEqual(aid.arithmeticErrors(["100 + 70 + 10 + 3 = 183.", "3 \u2212 9 = \u22126", "2 \u00d7 3 + 4 = 10", "10 \u2212 4 \u2212 3 = 4"]), ["10 \u2212 4 \u2212 3 = 4"]);
});

test("truncated model output is salvaged to the last complete item", () => {
  const cut = '{"title":"T","sections":[{"heading":"A","body":"one"},{"heading":"B","body":"tw';
  const got = aid.extractJson(cut);
  assert.equal(got.title, "T");
  assert.equal(got.sections[0].body, "one");
  assert.equal(got.sections[1].body, undefined); // the cut-off item has no usable body and is dropped later
  assert.equal(aid.extractJson("no json here"), null);
});

test("rich lessons keep teaching content for the parent but strip answers and the parent guide for the child", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const kid = child(db, fam);
  const made = await lb.createLesson(db, fam, { ...GARDEN, status: "ready" }, NOW);
  assert.ok(made.ok, JSON.stringify(made));
  const a = (await lb.assignLesson(db, fam, { student_id: kid, lesson_id: made.lesson.id }, NOW)).assignment;
  const row = db.raw.prepare("SELECT * FROM assignments WHERE id = ?").get(a.id);
  const safe = lb.childSafeLesson(lb.assignmentLesson(row, null));
  const json = JSON.stringify(safe);
  assert.equal(safe.sections.length, 5);
  assert.equal(safe.worked_examples.length, 3);
  assert.equal(safe.teaching_questions, undefined);
  assert.equal(safe.teaching_plan, undefined);
  assert.equal(safe.activities[1].tasks[0].answer, undefined);
  assert.ok(safe.activities[1].tasks[0].prompt);
  assert.equal(safe.materials.length, 5);
  assert.ok(safe.introduction.length > 100);
  assert.ok(safe.guided_practice[0].hint);
  for (const k of ["answer_key", "parent_script", "support", "evidence_suggestions", "parent_notes"]) assert.equal(safe[k], undefined, k);
  assert.ok(!json.includes("4 cups and 5 loose beans. 27 + 18 = 45"));
  assert.equal(safe.guided_practice[0].answer, undefined);
  assert.ok(!json.includes("correct_index"));
  assert.ok(!json.includes("Sam forgot to regroup"));
  assert.ok(!json.includes("bean cups until"));
});

// ---------------------------------------------------------------- zero-burden builder: sentence + child profile
import { parseRequestText, resolveRequest } from "../src/aiRequest.ts";

test("one-sentence requests are understood (subject, year, minutes, theme, delivery, count)", () => {
  const a = parseRequestText("Create a one-hour Year 3 maths lesson about addition using gardening as the theme.");
  assert.deepEqual([a.topic, a.minutes, a.year, a.theme, a.area, a.count], ["addition", 60, "Year 3", "gardening", "Mathematics", undefined]);
  const b = parseRequestText("Create a one-hour Year 7 lesson introducing negative integers. My child works independently.");
  assert.deepEqual([b.topic, b.minutes, b.year, b.delivery, b.area], ["negative integers", 60, "Year 7", "independent", "Mathematics"]);
  const c = parseRequestText("Create four science lessons about the solar system for my Year 5 child next week.");
  assert.deepEqual([c.count, c.year, c.area, c.topic], [4, "Year 5", "Science", "the solar system"]);
  assert.equal(parseRequestText("Make a lesson from https://example.com/x about volcanoes").links, true);
});

test("the child's saved profile changes the lesson request; the parent's words win over the profile", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const put = (id, year, interests, prefs) => db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,interests,extra,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)")
    .run(id, fam, id, id, "x", "S2", year, JSON.stringify(interests), JSON.stringify({ prefs }), NOW.toISOString());
  put("A", "3", ["Harry Potter"], { delivery: "parent_guided", reading: "supported", duration_minutes: 30 });
  put("B", "7", ["gaming", "fantasy"], { delivery: "independent", complexity: "challenging", equipment: "laptop, ruler" });
  const ask = async (sid, text) => { const ai = stub(); const r = await aid.draftLessonWithAi(db, ai, { familyId: fam, userId: "u", request: { request: text, student_id: sid } }, NOW); return { r, prompt: ai.calls[0]?.[1].messages.at(-1).content }; };
  const a = await ask("A", "Create a lesson about addition");
  const b = await ask("B", "Create a lesson about addition");
  assert.ok(a.r.ok && b.r.ok, JSON.stringify([a.r, b.r]));
  assert.match(a.prompt, /Year 3/); assert.match(a.prompt, /PARENT-GUIDED/); assert.match(a.prompt, /about 30 minutes/); assert.match(a.prompt, /needs support/); assert.match(a.prompt, /Harry Potter/);
  assert.match(b.prompt, /Year 7/); assert.match(b.prompt, /INDEPENDENT/); assert.match(b.prompt, /challengingly/); assert.match(b.prompt, /laptop, ruler/); assert.match(b.prompt, /gaming/);
  assert.equal(a.r.assumptions.minutes, 30);
  assert.equal(b.r.lesson.stage, "S4");
  // the sentence overrides the profile
  const c = await ask("A", "Create a one-hour Year 3 lesson about addition. My child works independently.");
  assert.match(c.prompt, /INDEPENDENT/); assert.match(c.prompt, /about 60 minutes/);
  // another family's child cannot be used
  const other = seed(db, { plan: "ACTIVE_MONTHLY" });
  const x = await aid.draftLessonWithAi(db, stub(), { familyId: other, userId: "u", request: { request: "a lesson about fractions", student_id: "A" } }, NOW);
  assert.equal(x.status, 404);
  // a bare link is never pretended to be read; theme is passed as a theme, not as copied content
  const link = await aid.draftLessonWithAi(db, stub(), { familyId: fam, userId: "u", request: { request: "https://example.com/page" } }, NOW);
  assert.equal(link.code, "LINK_NOT_READ");
  assert.match((await ask("A", "A lesson about addition using Harry Potter as the theme")).prompt, /THEME: Harry Potter[\s\S]*do not imply any affiliation/);
});

test("changes are previewed first, touch only the named parts, count separately, and apply keeps manual edits", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const made = await aid.draftLessonWithAi(db, stub(), req(fam), NOW);
  const id = made.lesson.id;
  // the parent edits the title by hand
  assert.ok((await lb.updateLesson(db, fam, id, { ...made.lesson, title: "My own title" }, NOW)).ok);
  const patchReply = { response: JSON.stringify({ worked_examples: [...GARDEN.worked_examples, { title: "Extra", problem: "What is 10 + 5?", steps: ["Start at 10.", "Count on 5 to reach 15."], answer: "15" }] }) };
  const ai = stub(() => patchReply);
  const r = await aid.refineLessonWithAi(db, ai, { familyId: fam, userId: "u", lessonId: id, instruction: "Add more worked examples" }, NOW);
  assert.ok(r.ok, JSON.stringify(r));
  assert.deepEqual(r.keys, ["worked_examples"]);
  assert.equal(r.patch.worked_examples.length, GARDEN.worked_examples.length + 1);
  const stored = db.raw.prepare("SELECT data FROM lessons WHERE id = ?").get(id);
  assert.equal(JSON.parse(stored.data).worked_examples.length, GARDEN.worked_examples.length); // nothing saved yet
  const used = await aid.aiUsage(db, fam, NOW);
  assert.deepEqual([used.today, used.changes_today], [1, 1]);
  const ap = await aid.applyLessonPatch(db, fam, id, { ...r.patch, owner: "x", status: "archived" }, NOW);
  assert.ok(ap.ok, JSON.stringify(ap));
  assert.equal(ap.lesson.title, "My own title");
  assert.equal(ap.lesson.worked_examples.length, GARDEN.worked_examples.length + 1);
  assert.equal(ap.lesson.status, "draft");
  // empty/failed reply leaves the lesson alone and costs nothing
  const bad = await aid.refineLessonWithAi(db, stub(() => ({ response: "no" })), { familyId: fam, userId: "u", lessonId: id, instruction: "Make it easier" }, NOW);
  assert.equal(bad.code, "AI_FAILED");
  assert.equal((await aid.aiUsage(db, fam, NOW)).changes_today, 1);
  // free families and other families' lessons are refused
  const free = seed(makeDb(), {});
  assert.equal((await aid.refineLessonWithAi(db, stub(), { familyId: seed(db, { plan: "FREE_PREVIEW" }), userId: "u", lessonId: id, instruction: "Make it easier" }, NOW)).status, 402);
  assert.equal((await aid.refineLessonWithAi(db, stub(), { familyId: seed(db, { plan: "ACTIVE_MONTHLY" }), userId: "u", lessonId: id, instruction: "Make it easier" }, NOW)).status, 404);
  void free;
});

test("series planning checks the allowance up front and returns the right number of lessons", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const plan = { response: JSON.stringify({ series_title: "Our Solar System", lessons: [1, 2, 3, 4].map((n) => ({ title: `Lesson ${n}`, goal: `Goal ${n}` })) }) };
  const r = await aid.planSeriesWithAi(db, stub(() => plan), { familyId: fam, userId: "u", request: { request: "Create four science lessons about the solar system for my Year 5 child next week." } }, NOW);
  assert.ok(r.ok, JSON.stringify(r));
  assert.equal(r.lessons.length, 4);
  assert.equal(r.usage.today, 0); // planning is not a lesson draft
  const none = await aid.planSeriesWithAi(db, stub(), { familyId: fam, userId: "u", request: { request: "Create science lessons about the solar system" } }, NOW);
  assert.equal(none.status, 400);
  for (let i = 0; i < 8; i++) assert.ok((await aid.draftLessonWithAi(db, stub(), req(fam), NOW)).ok);
  const over = await aid.planSeriesWithAi(db, stub(() => plan), { familyId: fam, userId: "u", request: { request: "four science lessons about the solar system" } }, NOW);
  assert.equal(over.code, "AI_QUOTA");
  const free = await aid.planSeriesWithAi(db, stub(), { familyId: seed(db, { plan: "FREE_PREVIEW" }), userId: "u", request: { request: "four science lessons about space" } }, NOW);
  assert.equal(free.status, 402);
  // a lesson drafted as part of a series is told its place in the sequence
  const ai = stub();
  await aid.draftLessonWithAi(db, ai, { familyId: seed(db, { plan: "ACTIVE_MONTHLY" }), userId: "u", request: { request: "four science lessons about the solar system", series: { index: 1, titles: ["The Sun", "The planets", "Moons", "Orbits"], goals: [] } } }, NOW);
  assert.match(ai.calls[0][1].messages.at(-1).content, /Topic: The planets[\s\S]*lesson 2 of 4[\s\S]*Earlier lessons: The Sun/);
});
