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
// The generator now works in three requests (design, teaching, practice). This fake answers each from the garden reference.
const STAGE1 = ["title", "teaching_plan", "why_it_matters", "prior_knowledge", "objectives", "key_words", "misconceptions"];
const stagedFor = (over = {}) => (model, input) => {
  const u = input.messages.at(-1).content;
  const g = { ...GARDEN, resources: [{ type: "link", title: "x", url: "https://evil.example" }], curriculum_refs: ["ACMNA999"], status: "ready", ...over };
  const pick = (ks) => Object.fromEntries(ks.filter((k) => g[k] !== undefined).map((k) => [k, g[k]]));
  const reply = (o) => ({ response: JSON.stringify(o), usage: { prompt_tokens: 1000, completion_tokens: 2000 } });
  if (input.messages[0].content.includes("match a school lesson to curriculum outcomes")) return reply({ matches: [1, 2] });
  if (u.includes("STAGE 1:")) return reply({ ...pick(STAGE1), concept: "c", sequence: g.sections.map((x) => ({ heading: x.heading, idea: "i", how: "h" })), worked_examples: g.worked_examples.map((w) => ({ title: w.title, problem: w.problem, skill: "s" })), practice_plan: "p" });
  if (u.includes("STAGE 2:")) return reply(pick(["introduction", "texts", "consolidation"]));
  let m = u.match(/STAGE 3, SECTION (\d+) OF/);
  if (m) return reply(g.sections[Number(m[1]) - 1]);
  m = u.match(/STAGE 3, WORKED EXAMPLE (\d+) OF/);
  if (m) return reply(g.worked_examples[Number(m[1]) - 1]);
  if (u.includes("STAGE 4, PRACTICE")) return reply(pick(["guided_practice", "activities"]));
  if (u.includes("STAGE 4, ASSESSMENT")) return reply(Object.fromEntries(Object.entries(g).filter(([k]) => !["title", "teaching_plan", "why_it_matters", "prior_knowledge", "objectives", "key_words", "misconceptions", "introduction", "texts", "consolidation", "sections", "worked_examples", "guided_practice", "activities", "answer_key"].includes(k))));
  return reply(g); // a repair request: the full set of keys; the matching ones are merged
};
const stub = (fn) => { const calls = []; return { calls, run: async (...a) => { calls.push(a); return fn ? fn(...a) : stagedFor()(...a); } }; };
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
  assert.equal(ai.calls.length, 13); // design, frame, 5 sections, 3 worked examples, practice, assessment, then the small outcome match
  assert.deepEqual(r.generation.stages, ["design", "frame", "section 1", "section 2", "section 3", "section 4", "section 5", "example 1", "example 2", "example 3", "practice", "assessment", "outcomes"].sort((a, b) => 0));
  assert.equal(r.generation.input_tokens, 13000); assert.ok(r.generation.est_cost_us_cents > 0);
  assert.equal(r.usage.today, 1);
  assert.equal(r.lesson.delivery, "independent"); // the standard: a lesson the child can complete alone
  assert.equal(r.lesson.worked_examples.length, 3);
  assert.ok(!r.lesson.curriculum_refs.join(" ").includes("ACMNA999")); // codes the model invents are discarded
  assert.deepEqual(r.lesson.outcome_codes, ["MAe-RWN-01", "MAe-RWN-02"]); // only real outcomes picked from the list are kept
  assert.equal(r.outcomes.length, 2);
  const q1 = r.lesson.quiz.find((q) => q.question === "What is 23 + 45?");
  assert.equal(q1.options[q1.correct_index], "68"); // shuffling keeps the right answer marked
  const msgs = ai.calls[0][1].messages;
  assert.equal(msgs[0].role, "system");
  assert.equal(msgs.length, 2); // system + the request: no 6,000-token example rides along any more
  assert.match(msgs[1].content, /Topic: Fractions/);
  assert.match(msgs[0].content, /Never write an instruction in place of content/);
  // each later stage is shown what the earlier ones produced, so practice matches what was actually taught
  assert.match(ai.calls[1][1].messages[1].content, /"sequence"/);
  assert.match(ai.calls.find((c) => /STAGE 4, PRACTICE/.test(c[1].messages[1].content))[1].messages[1].content, /WHAT WAS TAUGHT[\s\S]*Part 1\./);
  assert.equal(ai.calls[0][1].max_tokens, 2800); assert.equal(ai.calls.at(-1)[1].max_tokens, 120); assert.ok(ai.calls.slice(1, -1).every((c) => c[1].max_tokens >= 1500));
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

test("owner can keep building and refining AI lessons beyond customer fair-use limits", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "INTERNAL" });
  const insert = db.raw.prepare("INSERT INTO ai_usage (id, family_id, user_id, kind, status, created_at) VALUES (?, ?, 'owner', ?, 'ok', ?)");
  for (let i = 0; i < 65; i++) insert.run(`owner-draft-${i}`, fam, "lesson_draft", NOW.toISOString());
  for (let i = 0; i < 125; i++) insert.run(`owner-refine-${i}`, fam, "lesson_refine", NOW.toISOString());
  for (let i = 0; i < 21; i++) insert.run(`owner-series-${i}`, fam, "series_plan", NOW.toISOString());

  const before = await aid.aiUsage(db, fam, NOW);
  assert.equal(before.unlimited, true);
  assert.equal(before.today, 65);
  assert.equal(before.changes_today, 125);

  const draft = await aid.draftLessonWithAi(db, stub(), req(fam), NOW);
  assert.ok(draft.ok, JSON.stringify(draft));
  assert.equal(draft.usage.unlimited, true);
  assert.equal(draft.usage.today, 66); // still recorded, just not capped

  const reply = { response: JSON.stringify({
    worked_examples: [...GARDEN.worked_examples, {
      title: "Extra", problem: "What is 10 + 5?",
      steps: ["Start at 10.", "Count on 5 to reach 15."], answer: "15",
    }],
  }) };
  const refined = await aid.refineLessonWithAi(db, stub(() => reply), {
    familyId: fam, userId: "owner", lessonId: draft.lesson.id,
    instruction: "Add more worked examples",
  }, NOW);
  assert.ok(refined.ok, JSON.stringify(refined));
  assert.equal(refined.usage.unlimited, true);
  assert.equal(refined.usage.changes_today, 126);

  const planReply = { response: JSON.stringify({
    series_title: "Our Solar System",
    lessons: [1, 2, 3, 4].map((i) => ({ title: `Lesson ${i}`, goal: `Goal ${i}` })),
  }) };
  const series = await aid.planSeriesWithAi(db, stub(() => planReply), {
    familyId: fam, userId: "owner",
    request: { request: "Create four science lessons about our solar system" },
  }, NOW);
  assert.ok(series.ok, JSON.stringify(series));
  assert.equal(series.usage.unlimited, true);
  assert.equal(series.lessons.length, 4);

  const customer = seed(db, { plan: "ACTIVE_MONTHLY" });
  assert.equal((await aid.aiUsage(db, customer, NOW)).unlimited, false);
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
  const thinOver = { sections: [{ heading: "H", body: "Short." }] };
  const thin = (m, input) => (input.messages.at(-1).content.includes("reviewer found") ? stagedFor(thinOver)(m, input) : stagedFor(thinOver)(m, input));
  const ai = stub(thin);
  const r = await aid.draftLessonWithAi(db, ai, { familyId: fam, userId: "u", request: { topic: "Fractions", duration_minutes: 60 } }, NOW);
  assert.equal(r.ok, false);
  assert.equal(r.code, "AI_FAILED");
  assert.match(r.detail, /wasn't good enough/);
  assert.ok(ai.calls.length <= 10, String(ai.calls.length)); // generation plus one repair, never more
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM lessons WHERE family_id = ?").get(fam).n, 0);
  assert.equal((await aid.aiUsage(db, fam, NOW)).today, 0);
  // thin first, then a repair that supplies the missing parts: kept, with only the soft flags that remain
  let n = 0;
  const ai2 = stub((model, input) => {
    if (n++ < 8) return stagedFor(thinOver)(model, input);
    assert.match(input.messages[1].content, /reviewer found these problems/);
    return { response: aiReply().response }; // the repair returns the full set of keys; the matching ones are merged
  });
  const r2 = await aid.draftLessonWithAi(db, ai2, { familyId: fam, userId: "u", request: { topic: "Addition", duration_minutes: 60 } }, NOW);
  assert.ok(r2.ok, JSON.stringify(r2));
  assert.equal(ai2.calls.length, 10); // 8 stage requests, the repair, the outcome match
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

// ---------------------------------------------------------------- "I'm stuck!" help for children
import * as hp from "../src/aiHelp.ts";
const Y7 = JSON.parse(readFileSync(new URL("../../frontend/src/data/referenceYear7Integers.json", import.meta.url), "utf8"));
const helpAi = (text = "Picture a number line. Numbers further left are smaller.\n-7 is 7 steps left of zero, -3 is only 3 steps left.") => stub(() => ({ response: text }));
async function helpSetup(plan = "ACTIVE_MONTHLY") {
  const db = makeDb();
  const fam = seed(db, { plan });
  const kid = child(db, fam);
  db.raw.prepare("UPDATE students SET year_level='7', interests=?, extra=? WHERE id=?").run(JSON.stringify(["fantasy"]), JSON.stringify({ prefs: { reading: "supported" } }), kid);
  const les = await lb.createLesson(db, fam, { ...Y7, status: "ready" }, NOW);
  const asg = await lb.assignLesson(db, fam, { student_id: kid, lesson_id: les.lesson.id }, NOW);
  return { db, fam, kid, asg: asg.assignment.id, les: les.lesson };
}

test("help: paid only, child only, own assignment only, and the parent can switch it off", async () => {
  const { db, fam, kid, asg } = await helpSetup();
  const ai = helpAi();
  const u = { id: kid, family_id: fam };
  const r = await hp.helpForChild(db, ai, { user: u, assignmentId: asg, kind: "explain", target: { part: "section", i: 0 } }, NOW);
  assert.ok(r.ok, JSON.stringify(r));
  assert.match(r.text, /number line/);
  // free and expired families are refused before any AI call
  const f = await helpSetup("FREE_PREVIEW");
  const fai = helpAi();
  const fr = await hp.helpForChild(f.db, fai, { user: { id: f.kid, family_id: f.fam }, assignmentId: f.asg, kind: "explain", target: { part: "section", i: 0 } }, NOW);
  assert.equal(fr.status, 402); assert.equal(fai.calls.length, 0);
  // someone else's assignment
  const other = child(db, fam);
  assert.equal((await hp.helpForChild(db, ai, { user: { id: other, family_id: fam }, assignmentId: asg, kind: "hint", target: { part: "section", i: 0 } }, NOW)).status, 404);
  // parent switches it off for this child
  db.raw.prepare("UPDATE students SET extra=? WHERE id=?").run(JSON.stringify({ ai_help: false }), kid);
  const before = ai.calls.length;
  const off = await hp.helpForChild(db, ai, { user: u, assignmentId: asg, kind: "explain", target: { part: "section", i: 0 } }, NOW);
  assert.equal(off.code, "HELP_OFF"); assert.equal(ai.calls.length, before);
  assert.deepEqual(await hp.helpStatus(db, ai, u, hp.HELP_DEFAULTS, NOW), { available: false, reason: "parent_off" });
  // no AI connected
  assert.equal((await hp.helpForChild(db, undefined, { user: { id: other, family_id: fam }, assignmentId: asg, kind: "explain", target: { part: "general" } }, NOW)).status, 503);
});

test("help: context comes from the server, never includes answer keys or names, and answer-leaking replies are replaced", async () => {
  const { db, fam, kid, asg, les } = await helpSetup();
  const u = { id: kid, family_id: fam };
  const q = les.quiz[0];
  const right = q.options[q.correct_index];
  const ai = helpAi(`Think about the number line.\nThe answer is ${right}.`);
  const r = await hp.helpForChild(db, ai, { user: u, assignmentId: asg, kind: "hint", target: { part: "quiz", i: 0 } }, NOW);
  assert.ok(r.ok);
  assert.equal(r.source, "fallback"); // the reply stated the correct option, so a safe nudge is shown instead
  assert.ok(!r.text.includes(right));
  const sent = JSON.stringify(ai.calls[0][1].messages);
  assert.ok(!sent.includes('"correct_index"'));
  assert.ok(!sent.includes(les.answer_key.slice(0, 40)));
  assert.ok(!sent.includes("Kid"));
  assert.match(sent, /Year 7/); assert.match(sent, /reading support/);
  assert.ok(ai.calls[0][1].max_tokens <= 500);
  assert.equal(ai.calls.length, 1);
  // a leak is free: it did not use the family's allowance
  const st = await hp.helpStatus(db, ai, u, hp.HELP_DEFAULTS, NOW);
  assert.equal(st.remaining_today, hp.HELP_DEFAULTS.perChildDay);
  // the answer to a guided question is never in the prompt either
  const g = les.guided_practice[0];
  const ai2 = helpAi();
  await hp.helpForChild(db, ai2, { user: u, assignmentId: asg, kind: "example", target: { part: "guided", i: 0 } }, NOW);
  assert.ok(!JSON.stringify(ai2.calls[0][1].messages).includes(`Answer: ${g.answer}`));
});

test("help: a stored hint answers a first hint request for free; limits apply per child and per family; failures cost nothing", async () => {
  const { db, fam, kid, asg, les } = await helpSetup();
  const u = { id: kid, family_id: fam };
  const ai = helpAi();
  const free = await hp.helpForChild(db, ai, { user: u, assignmentId: asg, kind: "hint", level: 1, target: { part: "guided", i: 0 } }, NOW);
  assert.equal(free.source, "stored"); assert.equal(free.text, les.guided_practice[0].hint); assert.equal(ai.calls.length, 0);
  const second = await hp.helpForChild(db, ai, { user: u, assignmentId: asg, kind: "hint", level: 2, target: { part: "guided", i: 0 } }, NOW);
  assert.equal(second.source, "ai"); assert.equal(ai.calls.length, 1);
  const lim = { perChildDay: 3, perFamilyDay: 10, perFamilyMonth: 50 };
  for (let i = 0; i < 2; i++) assert.ok((await hp.helpForChild(db, ai, { user: u, assignmentId: asg, kind: "explain", target: { part: "section", i: 0 }, limits: lim }, NOW)).ok);
  const over = await hp.helpForChild(db, ai, { user: u, assignmentId: asg, kind: "explain", target: { part: "section", i: 0 }, limits: lim }, NOW);
  assert.equal(over.code, "HELP_LIMIT");
  // a sibling still has their own allowance, but the family cap applies to everyone
  const sib = child(db, fam);
  const sibAsg = (await lb.assignLesson(db, fam, { student_id: sib, lesson_id: les.id }, NOW)).assignment.id;
  assert.ok((await hp.helpForChild(db, ai, { user: { id: sib, family_id: fam }, assignmentId: sibAsg, kind: "explain", target: { part: "section", i: 0 }, limits: { ...lim, perFamilyDay: 3 } }, NOW)).code === "HELP_LIMIT");
  assert.ok((await hp.helpForChild(db, ai, { user: { id: sib, family_id: fam }, assignmentId: sibAsg, kind: "explain", target: { part: "section", i: 0 }, limits: lim }, NOW)).ok);
  // an AI failure frees the allowance
  const bad = stub(() => { throw new Error("x"); });
  const used = (await hp.helpUsageForFamily(db, fam, lim, NOW)).children[sib].today;
  assert.equal((await hp.helpForChild(db, bad, { user: { id: sib, family_id: fam }, assignmentId: sibAsg, kind: "example", target: { part: "worked", i: 0 }, limits: lim }, NOW)).code, "AI_FAILED");
  assert.equal((await hp.helpUsageForFamily(db, fam, lim, NOW)).children[sib].today, used);
  // lesson help is tracked apart from lesson drafting
  assert.equal((await aid.aiUsage(db, fam, NOW)).today, 0);
});

test("leak detector: numbers match whole values only", () => {
  assert.equal(hp.leaksAnswer("so 34 + 28 = 62", ["62"]), true);
  assert.equal(hp.leaksAnswer("try 162 and 6.25", ["62"]), false);
  assert.equal(hp.leaksAnswer("it is minus seven", ["-7"]), false);
  assert.equal(hp.leaksAnswer("the answer is -7", ["-7"]), true);
  assert.equal(hp.leaksAnswer("a half is bigger", ["A half"]), true);
});

// ---------------------------------------------------------------- interactive practice: kinds, marking, privacy
import * as it from "../src/items.ts";

test("practice marking: numbers, text, choice, blanks, order and match", () => {
  const num = { prompt: "x", answer: "57 (30 + 20 = 50; 2 + 5 = 7; 50 + 7 = 57)." };
  assert.equal(it.markItem(num, "57").result, "correct");
  assert.equal(it.markItem(num, "the answer is 57").result, "correct");
  assert.equal(it.markItem(num, "75").result, "incorrect");
  assert.equal(it.markItem({ answer: "199 (100 + 90 + 9)" }, "199").result, "correct");
  assert.equal(it.markItem({ answer: "-7 (°C)" }, "−7").result, "correct");
  assert.equal(it.markItem({ answer: "1/2", kind: "number" }, "0.5").result, "correct");
  assert.equal(it.markItem({ kind: "number", answer: "1,200" }, "1200").result, "correct");
  assert.equal(it.markItem({ answer: "Bed A", kind: "choice", options: ["Bed A", "Bed B"] }, "bed a").result, "correct");
  assert.equal(it.markItem({ answer: "Bed A", kind: "choice", options: ["Bed A", "Bed B"] }, "Bed B").result, "incorrect");
  const blank = { kind: "blank", answer: "50|11" };
  assert.equal(it.markItem(blank, "50|11").result, "correct");
  assert.deepEqual(it.markItem(blank, "50|12"), { result: "incorrect", partial: "1 of 2 blanks are right" });
  assert.equal(it.markItem({ kind: "blank", answer: "-4|7" }, "−4|7").result, "correct");
  const ord = { kind: "order", options: ["a", "b", "c", "d"] };
  assert.equal(it.markItem(ord, ["a", "b", "c", "d"]).result, "correct");
  assert.equal(it.markItem(ord, ["a", "c", "b", "d"]).partial, "2 of 4 are in the right place");
  const mt = { kind: "match", pairs: [{ left: "x", right: "1" }, { left: "y", right: "2" }, { left: "z", right: "3" }] };
  assert.equal(it.markItem(mt, ["1", "2", "3"]).result, "correct");
  assert.equal(it.markItem(mt, ["2", "1", "3"]).partial, "1 of 3 matches are right");
  assert.equal(it.markItem({ kind: "long", answer: "model" }, "anything").result, "recorded");
  assert.equal(it.markItem({ answer: "Charlotte Pass was the coldest of all five places on that night, at minus eight degrees" }, "cold").result, "recorded"); // long model answers are compared by the child, not auto-marked
  assert.equal(it.markItem({ answer: "a half" }, "A half is bigger").result, "correct");
  assert.equal(it.markItem({ answer: "a half" }, "").result, "incorrect");
});

test("kinds are cleaned: broken interactive items fall back to plain text; visuals are data only", () => {
  assert.deepEqual(it.cleanItemKind({ kind: "choice", options: ["a"] }, "p", "a"), { kind: "text" });
  assert.deepEqual(it.cleanItemKind({ kind: "blank" }, "no blanks here", "x"), {});
  assert.deepEqual(it.cleanItemKind({ kind: "order", options: ["a", "b"] }, "p", ""), { kind: "text" });
  assert.deepEqual(it.cleanItemKind({}, "p", "62 (50 + 12)"), { kind: "number" });
  assert.equal(it.cleanVisual({ type: "number_line", min: 5, max: 1 }), undefined);
  assert.equal(it.cleanVisual({ type: "svg", markup: "<script>" }), undefined);
  const nl = it.cleanVisual({ type: "number_line", min: -10, max: 10, step: 1, points: [{ at: -3, label: "x" }, { at: 99, label: "off" }], jumps: [{ from: 0, to: 4 }] });
  assert.equal(nl.points.length, 1); assert.equal(nl.jumps.length, 1);
  assert.equal(it.cleanVisual({ type: "place_value", number: 47 }).number, 47);
  assert.equal(it.cleanVisual({ type: "place_value", number: 123456 }), undefined);
});

test("practice: lessons keep interactive items; the child never gets answers or the correct order; feedback is checked on the server", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const kid = child(db, fam);
  const les = await lb.createLesson(db, fam, { ...Y7, status: "ready" }, NOW);
  assert.ok(les.ok, JSON.stringify(les));
  const ord = les.lesson.guided_practice.find((g) => g.kind === "order");
  assert.deepEqual(ord.options, ["−10", "−7", "−2", "0", "3", "5"]); // the parent copy keeps the correct order
  assert.ok(les.lesson.sections[1].visual && les.lesson.key_words.length === 5);
  const asg = (await lb.assignLesson(db, fam, { student_id: kid, lesson_id: les.lesson.id }, NOW)).assignment;
  const u = { id: kid, family_id: fam };
  const safe = lb.childSafeLesson((await lb.assignmentForChildForTest?.(db, u, asg.id))?.lesson ?? lb.assignmentLesson(db.raw.prepare("SELECT * FROM assignments WHERE id=?").get(asg.id), null));
  const json = JSON.stringify(safe);
  assert.ok(!JSON.stringify([safe.guided_practice, safe.activities]).includes('"answer"'), "child practice has an answer field");
  assert.ok(!json.includes("-12|6|-50") && !json.includes("(8 steps to zero"));
  const cOrd = safe.guided_practice.find((g) => g.kind === "order");
  assert.notDeepEqual(cOrd.options, ord.options); // shuffled
  assert.deepEqual([...cOrd.options].sort(), [...ord.options].sort());
  const cMatch = safe.activities[1].tasks.find((t) => t.kind === "match");
  assert.ok(cMatch.lefts.length === 3 && cMatch.rights.length === 3 && !cMatch.pairs);
  // server-side checking
  const idx = (k) => les.lesson.guided_practice.findIndex((g) => g.kind === k);
  const right = await lb.checkPractice(db, u, asg.id, { part: "guided", i: idx("order"), answer: ord.options });
  assert.equal(right.result, "correct");
  const wrong = await lb.checkPractice(db, u, asg.id, { part: "guided", i: 4, answer: "99", attempt: 1 });
  assert.equal(wrong.result, "incorrect"); assert.equal(wrong.reveal, undefined); assert.match(wrong.feedback, /Hint:/);
  const third = await lb.checkPractice(db, u, asg.id, { part: "guided", i: 4, answer: "99", attempt: 3 });
  assert.match(third.reveal, /3 \(6 steps/);
  const task = await lb.checkPractice(db, u, asg.id, { part: "task", i: 0, j: 2, answer: "4" });
  assert.equal(task.result, "correct");
  assert.equal((await lb.checkPractice(db, u, asg.id, { part: "task", i: 9, j: 0, answer: "4" })).status, 404);
  assert.equal((await lb.checkPractice(db, { id: "someone-else", family_id: fam }, asg.id, { part: "guided", i: 0, answer: "x" })).status, 404);
});

// ---------------------------------------------------------------- YouTube resource discovery (fake network, no real key)
import * as rs from "../src/resources.ts";

const ytItem = (id, over = {}) => ({
  id, snippet: { title: "Negative numbers on a number line", channelTitle: "Khan Academy", description: "Learn about negative integers on the number line.", liveBroadcastContent: "none" },
  contentDetails: { duration: "PT4M30S" }, status: { embeddable: true, privacyStatus: "public", uploadStatus: "processed" }, ...over,
});
function fakeYt(items, calls = []) {
  return async (url) => {
    calls.push(url);
    if (url.includes("/search?")) return { ok: true, status: 200, json: async () => ({ items: items.map((i) => ({ id: { videoId: i.id } })) }) };
    return { ok: true, status: 200, json: async () => ({ items }) };
  };
}

test("youtube: only public, embeddable, not age-restricted, not live videos survive; best matches first; no key means an honest 'unavailable'", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const les = await mk(db, fam, { title: "Negative integers", objectives: ["Order negative numbers on a number line"] });
  const u = { id: "p1", family_id: fam };
  assert.equal((await rs.suggestForLesson({}, db, u, { lesson_id: les.id })).status, 503);
  const items = [
    ytItem("good_video01"),
    ytItem("noembed0001", { status: { embeddable: false, privacyStatus: "public" } }),
    ytItem("private00001", { status: { embeddable: true, privacyStatus: "private" } }),
    ytItem("agerestrict1", { contentDetails: { duration: "PT4M", contentRating: { ytRating: "ytAgeRestricted" } } }),
    ytItem("livestream01", { snippet: { title: "Negative numbers live", channelTitle: "X", description: "", liveBroadcastContent: "live" } }),
    ytItem("prank0000001", { snippet: { title: "Negative numbers PRANK compilation", channelTitle: "Randoms", description: "", liveBroadcastContent: "none" } }),
    ytItem("tooshort0001", { contentDetails: { duration: "PT20S" } }),
  ];
  const calls = [];
  const r = await rs.suggestForLesson({ YOUTUBE_API_KEY: "test-key-123456" }, db, u, { lesson_id: les.id }, fakeYt(items, calls), NOW);
  assert.ok(r.ok, JSON.stringify(r));
  assert.deepEqual(r.videos.map((v) => v.video_id), ["good_video01"]);
  const v = r.videos[0];
  assert.match(v.embed_url, /^https:\/\/www\.youtube-nocookie\.com\/embed\/good_video01$/);
  assert.equal(v.duration_seconds, 270);
  assert.match(v.thumbnail, /^https:\/\/i\.ytimg\.com\//);
  assert.ok(calls[0].includes("videoEmbeddable=true") && calls[0].includes("safeSearch=strict"));
  // cached: a second request does not touch the network or the quota
  const again = await rs.suggestForLesson({ YOUTUBE_API_KEY: "test-key-123456" }, db, u, { lesson_id: les.id }, async () => { throw new Error("should not search again"); }, NOW);
  assert.ok(again.ok && again.cached === true);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM ai_usage WHERE kind='yt_search'").get().n, 1);
  // another family cannot suggest for this lesson
  assert.equal((await rs.suggestForLesson({ YOUTUBE_API_KEY: "test-key-123456" }, db, { id: "x", family_id: "other" }, { lesson_id: les.id }, fakeYt(items), NOW)).status, 404);
});

test("youtube: per-family daily limit, failures cost nothing, key is never in a response", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const les = await mk(db, fam, { title: "Photosynthesis" });
  const u = { id: "p1", family_id: fam };
  const env = { YOUTUBE_API_KEY: "secret-key-abcdef" };
  const boom = async () => ({ ok: false, status: 403, json: async () => ({}) });
  const f = await rs.suggestForLesson(env, db, u, { lesson_id: les.id, query: "photosynthesis kids" }, boom, NOW);
  assert.equal(f.status, 502); assert.ok(!JSON.stringify(f).includes("secret-key"));
  assert.equal((await rs.resourceStatus(env, db, fam, NOW)).searches_left_today, rs.YT_LIMITS.familyPerDay);
  for (let i = 0; i < rs.YT_LIMITS.familyPerDay; i++) {
    const ok = await rs.suggestForLesson(env, db, u, { lesson_id: les.id, query: `photosynthesis idea ${i}` }, fakeYt([ytItem("vid_" + String(i).padStart(7, "0"), { snippet: { title: "Photosynthesis explained", channelTitle: "Khan Academy", description: "", liveBroadcastContent: "none" } })]), NOW);
    assert.ok(ok.ok, JSON.stringify(ok));
  }
  const over = await rs.suggestForLesson(env, db, u, { lesson_id: les.id, query: "photosynthesis another" }, fakeYt([]), NOW);
  assert.equal(over.status, 429); assert.equal(over.code, "YT_QUOTA");
});

test("youtube: a parent's own link is checked (embeddable only) and non-YouTube links are refused", async () => {
  const ok = await rs.verifyLink("https://youtu.be/dQw4w9WgXcQ", async () => ({ ok: true, status: 200, json: async () => ({ title: "A video", author_name: "A channel" }) }));
  assert.ok(ok.ok && ok.video.video_id === "dQw4w9WgXcQ" && ok.video.title === "A video" && ok.video.source === "parent");
  assert.equal((await rs.verifyLink("https://youtu.be/dQw4w9WgXcQ", async () => ({ ok: false, status: 401, json: async () => ({}) }))).code, "NOT_EMBEDDABLE");
  assert.equal((await rs.verifyLink("https://example.com/watch?v=dQw4w9WgXcQ", async () => ({ ok: true, status: 200, json: async () => ({}) }))).code, "BAD_LINK");
  assert.equal((await rs.verifyLink("javascript:alert(1)", async () => ({ ok: true, status: 200, json: async () => ({}) }))).ok, false);
});

test("approved videos are kept with the lesson, survive edit/duplicate/assignment snapshot, and never trust a client-supplied embed or thumbnail host", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const kid = child(db, fam);
  const res = { type: "video", title: "Negative numbers", url: "https://www.youtube.com/watch?v=good_video01", embed_url: "https://evil.example/x", channel: "Khan Academy", duration_seconds: 270, thumbnail: "https://evil.example/t.jpg", purpose: "explain", concept: "negative numbers", after: "teaching", source: "youtube", verified: true };
  const les = await mk(db, fam, { resources: [res] });
  const r0 = les.resources[0];
  assert.equal(r0.embed_url, "https://www.youtube-nocookie.com/embed/good_video01");
  assert.equal(r0.video_id, "good_video01"); assert.equal(r0.thumbnail, ""); assert.equal(r0.channel, "Khan Academy"); assert.equal(r0.after, "teaching");
  const dup = (await lb.duplicateLesson(db, fam, les.id, NOW)).lesson;
  assert.equal(dup.resources[0].video_id, "good_video01");
  const asg = (await lb.assignLesson(db, fam, { student_id: kid, lesson_id: les.id }, NOW)).assignment;
  // the lesson is edited afterwards (video removed): the earlier assignment keeps its snapshot
  await lb.updateLesson(db, fam, les.id, { ...les, resources: [] }, NOW);
  const snap = JSON.parse(db.raw.prepare("SELECT lesson_snapshot s FROM assignments WHERE id=?").get(asg.id).s);
  assert.equal(snap.resources[0].video_id, "good_video01");
  const row = db.raw.prepare("SELECT * FROM assignments WHERE id=?").get(asg.id);
  const safe = lb.childSafeLesson(lb.assignmentLesson(row, null));
  assert.equal(safe.resources[0].embed_url, "https://www.youtube-nocookie.com/embed/good_video01");
});

// ---------------------------------------------------------------- staged generation: truncation is never hidden
test("staged generation: a cut-off stage is asked again once; if still cut off it is kept but flagged; a stage that never works fails cleanly", async () => {
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const full = stagedFor();
  const cut = (reply) => ({ response: reply.response.slice(0, Math.floor(reply.response.length * 0.8)) });
  // teaching stage cut off once, then fine: retried (4 calls), nothing flagged
  let n = 0;
  const ai1 = stub((m, input) => { const r = full(m, input); return input.messages.at(-1).content.includes("STAGE 3, SECTION 2 OF") && n++ === 0 ? cut(r) : r; });
  const a = await aid.draftLessonWithAi(db, ai1, req(fam), NOW);
  assert.ok(a.ok, JSON.stringify(a)); assert.equal(ai1.calls.length, 14);
  assert.deepEqual(a.generation.stages, a.generation.stages.slice());
  assert.ok(!a.warnings.some((w) => /cut off/.test(w)));
  assert.ok(ai1.calls.some((c) => /previous reply could not be used/.test(c[1].messages.at(-1).content)));
  // practice stage always cut off: kept (the end of it missing) but the parent is told
  const ai2 = stub((m, input) => { const r = full(m, input); return input.messages.at(-1).content.includes("STAGE 4, PRACTICE") ? cut(r) : r; });
  const b = await aid.draftLessonWithAi(db, ai2, req(fam), NOW);
  assert.ok(b.ok, JSON.stringify(b));
  assert.ok(b.warnings.some((w) => /practice step was cut off/.test(w)), JSON.stringify(b.warnings));
  // a stage that returns nothing usable twice: no lesson, no allowance used
  const before = (await aid.aiUsage(db, fam, NOW)).today;
  const ai3 = stub((m, input) => (input.messages.at(-1).content.includes("STAGE 3, SECTION 3 OF") ? { response: "I cannot" } : full(m, input)));
  const c = await aid.draftLessonWithAi(db, ai3, req(fam), NOW);
  assert.equal(c.code, "AI_FAILED"); assert.equal((await aid.aiUsage(db, fam, NOW)).today, before);
});

test("quality gate: instructions that stand in for teaching are caught", () => {
  const spec = { topic: "Fractions", area: "Mathematics", year: "Year 4", goal: "", minutes: 30, delivery: "parent_guided", interests: "", needs: "", notes: "" };
  const d = aid.normaliseDraft(JSON.parse(aiReply().response), spec);
  assert.ok(!aid.qualityIssues(d, spec).some((i) => /instead of doing it/.test(i.msg)));
  const bad = { ...d, sections: [{ heading: "H", body: "Explain the concept of a fraction to your child. Then demonstrate how to add them." }, ...d.sections] };
  assert.ok(aid.qualityIssues(bad, spec).some((i) => /instead of doing it/.test(i.msg)));
});

test("young learners get a reading-level instruction; the lesson is told the child works alone", async () => {
  assert.match(aid.readingLevel("Year 2"), /very short sentences/);
  assert.match(aid.readingLevel("Year 5"), /upper primary/);
  assert.match(aid.readingLevel("Year 9"), /secondary/);
  assert.equal(aid.readingLevel(""), "");
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const ai = stub();
  await aid.draftLessonWithAi(db, ai, req(fam, ai, { year_level: "Year 2" }), NOW);
  assert.match(ai.calls[1][1].messages[1].content, /READING LEVEL: this is a young child/);
  assert.match(ai.calls[0][1].messages[0].content, /almost never needs an adult/);
});

test("outcomes: the model can only pick from the real list; opting out leaves none; existing lessons can be matched; free plans get the wording match; other families blocked", async () => {
  const om = await import("../src/outcomeMatch.ts");
  const Y7L = JSON.parse(readFileSync(new URL("../../frontend/src/data/referenceYear7Integers.json", import.meta.url), "utf8"));
  // wording match finds the integers outcome for the Year 7 benchmark
  assert.equal(om.suggestOutcomes({ ...Y7L, stage: undefined })[0].code, "MA4-ARI-C-01");
  // a model that invents numbers or codes gets nothing through
  const wild = await om.matchOutcomesWithAi({ run: async () => ({ response: '{"matches":[0,999,"ACMNA133",2,2]}' }) }, { ...Y7L }, { model: "m" });
  assert.equal(wild.suggestions.length, 1);
  assert.ok(om.outcomePool(Y7L).some((o) => o.code === wild.suggestions[0].code));
  assert.equal(await om.matchOutcomesWithAi({ run: async () => ({ response: "no json here" }) }, Y7L, { model: "m" }), null);
  // opt out at generation
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const off = await aid.draftLessonWithAi(db, stub(), { familyId: fam, userId: "u", request: { topic: "Fractions", link_outcomes: false } }, NOW);
  assert.ok(off.ok); assert.deepEqual(off.lesson.outcome_codes, []); assert.deepEqual(off.outcomes, []);
  // an existing lesson: paid gets the AI pick, a free plan gets the wording match
  const lesson7 = (await lb.createLesson(db, fam, { ...Y7L, status: "ready" }, NOW)).lesson;
  const ai = stub((m, input) => ({ response: '{"matches":[1]}' }));
  const paid = await aid.matchLessonOutcomes(db, ai, { familyId: fam, userId: "u", lessonId: lesson7.id }, NOW);
  assert.ok(paid.ok && paid.method === "ai" && paid.suggestions.length === 1 && /NSW/.test(paid.framework));
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM ai_usage WHERE kind='outcome_match'").get().n, 1);
  const famFree = seed(db, { plan: "FREE_PREVIEW" });
  const l2 = (await lb.createLesson(db, famFree, { ...Y7L, status: "ready" }, NOW)).lesson;
  const free = await aid.matchLessonOutcomes(db, stub(), { familyId: famFree, userId: "u", lessonId: l2.id }, NOW);
  assert.ok(free.ok && free.method === "wording" && free.suggestions[0].code === "MA4-ARI-C-01");
  assert.equal((await aid.matchLessonOutcomes(db, ai, { familyId: famFree, userId: "u", lessonId: lesson7.id }, NOW)).status, 404);
  // codes saved on a lesson must be real; the child never receives them
  const saved = await lb.updateLesson(db, fam, lesson7.id, { ...lesson7, outcome_codes: ["MA4-ARI-C-01", "FAKE-99"], curriculum_refs: ["MA4-ARI-C-01: x"] }, NOW);
  assert.deepEqual(saved.lesson.outcome_codes, ["MA4-ARI-C-01"]);
  const kid = child(db, fam);
  const asg = (await lb.assignLesson(db, fam, { student_id: kid, lesson_id: lesson7.id }, NOW)).assignment;
  const safe = lb.childSafeLesson(lb.assignmentLesson(db.raw.prepare("SELECT * FROM assignments WHERE id=?").get(asg.id), null));
  assert.ok(!("outcome_codes" in safe) && !("curriculum_refs" in safe));
});

test("model replies with raw line breaks and trailing commas are repaired, and a failed step is named", async () => {
  const bad = '{"heading":"H","body":"Para one.\n\nPara two.","visual":null,}';
  const r = aid.parseReply({ response: bad });
  assert.equal(r.salvaged, false); assert.match(r.value.body, /Para two/);
  const db = makeDb();
  const fam = seed(db, { plan: "ACTIVE_MONTHLY" });
  const ai = stub((m, input) => (input.messages.at(-1).content.includes("STAGE 3, SECTION 2 OF") ? { response: "Sorry, I cannot do that." } : stagedFor()(m, input)));
  const out = await aid.draftLessonWithAi(db, ai, req(fam), NOW);
  assert.equal(out.code, "AI_FAILED");
  assert.match(out.detail, /section 2: reply was not valid JSON/);
});
