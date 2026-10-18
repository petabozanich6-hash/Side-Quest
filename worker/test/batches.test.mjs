// AI multi-lesson drafting: every lesson in a requested set stays reachable, edits and assignments survive,
// failed lessons can be retried on their own, and nothing is ever written twice.
import test from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import * as lb from "../src/lessonBuilder.ts";
import * as aid from "../src/aiDraft.ts";
import * as bat from "../src/lessonBatches.ts";
import { trialEndFrom } from "../src/entitlements.ts";

const NOW = new Date("2026-10-15T00:00:00Z");
let n = 0;
function seed(db, { plan = "ACTIVE_MONTHLY", jurisdiction = "NSW" } = {}) {
  const fam = `bf${++n}`;
  const t = NOW.toISOString();
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at,plan_period_end,jurisdiction) VALUES (?,?,?,?,?,?,?,?,?)")
    .run(fam, "Fam", `u${fam}`, t, plan, t, trialEndFrom(t), null, jurisdiction);
  return fam;
}
function child(db, fam) {
  const id = `bs${++n}`;
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,created_at) VALUES (?,?,?,?,?,?,?)").run(id, fam, "Ivy", `kid${id}`, "x", "S2", NOW.toISOString());
  return id;
}

// Same staged fake as builder.test.mjs: answers each generator stage from the garden reference lesson.
const GARDEN = JSON.parse(readFileSync(new URL("../../frontend/src/data/exampleLesson.json", import.meta.url), "utf8"));
const STAGE1 = ["title", "teaching_plan", "why_it_matters", "prior_knowledge", "objectives", "key_words", "misconceptions"];
const staged = (model, input) => {
  const u = input.messages.at(-1).content;
  const g = { ...GARDEN };
  const pick = (ks) => Object.fromEntries(ks.filter((k) => g[k] !== undefined).map((k) => [k, g[k]]));
  const reply = (o) => ({ response: JSON.stringify(o), usage: { prompt_tokens: 10, completion_tokens: 20 } });
  if (input.messages[0].content.includes("match a school lesson to curriculum outcomes")) return reply({ matches: [1] });
  if (u.includes("STAGE 1:")) return reply({ ...pick(STAGE1), concept: "c", sequence: g.sections.map((x) => ({ heading: x.heading, idea: "i", how: "h" })), worked_examples: g.worked_examples.map((w) => ({ title: w.title, problem: w.problem, skill: "s" })), practice_plan: "p" });
  if (u.includes("STAGE 2:")) return reply(pick(["introduction", "texts", "consolidation"]));
  let m = u.match(/STAGE 3, SECTION (\d+) OF/);
  if (m) return reply(g.sections[Number(m[1]) - 1]);
  m = u.match(/STAGE 3, WORKED EXAMPLE (\d+) OF/);
  if (m) return reply(g.worked_examples[Number(m[1]) - 1]);
  if (u.includes("STAGE 4, PRACTICE")) return reply(pick(["guided_practice", "activities"]));
  if (u.includes("STAGE 4, ASSESSMENT")) return reply(Object.fromEntries(Object.entries(g).filter(([k]) => !["title", "teaching_plan", "why_it_matters", "prior_knowledge", "objectives", "key_words", "misconceptions", "introduction", "texts", "consolidation", "sections", "worked_examples", "guided_practice", "activities", "answer_key"].includes(k))));
  return reply(g);
};
const stub = (fn) => { const calls = []; return { calls, run: async (...a) => { calls.push(a); return fn ? fn(...a) : staged(...a); } }; };
// Fails only the lesson whose series position matches, so one bad lesson never affects the others.
const failingOn = (position, total) => stub((model, input) => {
  if (JSON.stringify(input).includes(`lesson ${position} of ${total}`)) throw new Error("model down");
  return staged(model, input);
});

const FIVE = [1, 2, 3, 4, 5].map((i) => ({ title: `Planets ${i}`, goal: `Goal ${i}` }));
const body = (sid, over = {}) => ({ title: "Our Solar System", lessons: FIVE, student_id: sid, request: "Create five science lessons about the solar system for my Year 5 child", ...over });
const lessonsIn = (db, fam) => db.raw.prepare("SELECT COUNT(*) n FROM lessons WHERE family_id = ?").get(fam).n;
const assignmentsIn = (db, fam) => db.raw.prepare("SELECT COUNT(*) n FROM assignments WHERE family_id = ?").get(fam).n;
const draft = (db, ai, fam, id, index) => bat.draftBatchItem(db, ai, { familyId: fam, userId: "u", batchId: id, index }, NOW);
const states = (b) => b.items.map((i) => i.state);

test("acceptance: five lessons, edit + save + assign one, move around, 'refresh' — all five accounted for, no duplicates", async () => {
  const db = makeDb();
  const fam = seed(db);
  const kid = child(db, fam);
  const ai = stub();
  const created = await bat.createBatch(db, { familyId: fam, userId: "u", body: body(kid) }, NOW);
  assert.ok(created.ok, JSON.stringify(created));
  const id = created.batch.id;
  assert.deepEqual(states(created.batch), ["pending", "pending", "pending", "pending", "pending"]);

  for (let i = 0; i < 5; i++) { const r = await draft(db, ai, fam, id, i); assert.ok(r.ok, JSON.stringify(r)); assert.equal(r.reused, false); }
  let b = (await bat.getBatch(db, fam, id, NOW)).batch;
  assert.deepEqual(states(b), ["ready", "ready", "ready", "ready", "ready"]);
  assert.equal(b.counts.awaiting_review, 5);
  assert.equal(lessonsIn(db, fam), 5);
  const ids = b.items.map((i) => i.lesson_id);
  assert.equal(new Set(ids).size, 5);
  // each lesson was written as its own part of the sequence
  assert.ok(ai.calls.some((c) => JSON.stringify(c[1]).includes("lesson 3 of 5")));

  // Every lesson keeps how it was made, so its review (and automatic video suggestions) works however it is opened.
  for (const it of b.items) {
    assert.equal(it.meta.assumptions.child, "Ivy");
    assert.ok(it.meta.generation && it.meta.generation.calls > 0, JSON.stringify(it.meta));
    assert.ok(Array.isArray(it.meta.warnings));
    assert.equal(it.videos, 0);
  }

  // 1-3. Open lesson 1, edit it, save the draft.
  const l1 = lb.lessonOut(db.raw.prepare("SELECT * FROM lessons WHERE id = ?").get(ids[0]));
  const edited = await lb.updateLesson(db, fam, ids[0], { ...l1, title: "Planets 1 — my version", status: "draft" }, NOW);
  assert.ok(edited.ok, JSON.stringify(edited));
  b = (await bat.getBatch(db, fam, id, NOW)).batch;
  assert.equal(b.items[0].state, "saved");
  assert.equal(b.items[0].title, "Planets 1 — my version");
  assert.equal(b.counts.awaiting_review, 5, "an edited draft still needs approving");

  // 4. Approve and assign lesson 1 to the child.
  const ready = await lb.updateLesson(db, fam, ids[0], { ...edited.lesson, status: "ready" }, NOW);
  assert.ok(ready.ok);
  const as = await lb.assignLesson(db, fam, { student_id: kid, lesson_id: ids[0] }, NOW);
  assert.ok(as.ok, JSON.stringify(as));
  // a repeated click is refused rather than creating a second assignment
  assert.equal((await lb.assignLesson(db, fam, { student_id: kid, lesson_id: ids[0] }, NOW)).code, "ALREADY_ASSIGNED");

  // 5-10. Back to the set, open others, leave, come back, refresh: the page re-reads the set and re-runs its writer.
  const before = ai.calls.length;
  for (let i = 0; i < 5; i++) {
    const again = await draft(db, ai, fam, id, i);
    assert.ok(again.ok); assert.equal(again.reused, true); assert.equal(again.lesson.id, ids[i]);
  }
  assert.equal(ai.calls.length, before, "finished lessons are never sent to the AI again");
  const reopened = await bat.createBatch(db, { familyId: fam, userId: "u", body: body(kid, { id }) }, NOW); // a resent "Write all"
  assert.ok(reopened.ok); assert.equal(reopened.batch.id, id);

  b = (await bat.getBatch(db, fam, id, NOW)).batch;
  assert.deepEqual(states(b), ["assigned", "ready", "ready", "ready", "ready"]);
  assert.equal(b.items[0].title, "Planets 1 — my version", "edits kept");
  assert.deepEqual(b.items[0].assigned_to.map((x) => x.name), ["Ivy"]);
  assert.equal(b.counts.awaiting_review, 4);
  // A video added to a later lesson shows on the set, and is not lost by moving around.
  const l3 = lb.lessonOut(db.raw.prepare("SELECT * FROM lessons WHERE id = ?").get(ids[2]));
  const withVideo = await lb.updateLesson(db, fam, ids[2], { ...l3, resources: [{ type: "video", title: "Planets", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }] }, NOW);
  assert.ok(withVideo.ok, JSON.stringify(withVideo));
  b = (await bat.getBatch(db, fam, id, NOW)).batch;
  assert.equal(b.items[2].videos, 1);
  assert.equal(b.items[2].state, "saved");
  assert.equal(b.items[2].meta.assumptions.child, "Ivy", "context survives an edit");
  assert.equal(lessonsIn(db, fam), 5, "no duplicate lessons");
  assert.equal(assignmentsIn(db, fam), 1, "no duplicate assignments");
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM lesson_batches WHERE family_id = ?").get(fam).n, 1, "no duplicate sets");

  // Parent Hub summary
  const open = await bat.listBatches(db, fam, { open: true }, NOW);
  assert.equal(open.batches.length, 1);
  assert.equal(open.totals.awaiting_review, 4);
});

test("one failed lesson does not hide the others and can be retried on its own", async () => {
  const db = makeDb();
  const fam = seed(db);
  const { batch } = await bat.createBatch(db, { familyId: fam, userId: "u", body: body(null) }, NOW);
  const flaky = failingOn(3, 5);
  for (let i = 0; i < 5; i++) await draft(db, flaky, fam, batch.id, i);
  let b = (await bat.getBatch(db, fam, batch.id, NOW)).batch;
  assert.deepEqual(states(b), ["ready", "ready", "failed", "ready", "ready"]);
  assert.match(b.items[2].error, /AI service didn't respond/);
  assert.equal(b.items[2].lesson_id, null);
  assert.equal(b.counts.failed, 1);
  assert.equal(lessonsIn(db, fam), 4);
  const kept = b.items.map((i) => i.lesson_id);

  // An edit to a good lesson must survive the retry of the failed one.
  const l2 = lb.lessonOut(db.raw.prepare("SELECT * FROM lessons WHERE id = ?").get(kept[1]));
  await lb.updateLesson(db, fam, kept[1], { ...l2, title: "Kept edit" }, NOW);

  const ok = stub();
  const retry = await draft(db, ok, fam, batch.id, 2);
  assert.ok(retry.ok, JSON.stringify(retry));
  assert.ok(ok.calls.length > 0);
  b = (await bat.getBatch(db, fam, batch.id, NOW)).batch;
  assert.deepEqual(states(b), ["ready", "saved", "ready", "ready", "ready"]);
  assert.equal(b.items[1].title, "Kept edit");
  assert.deepEqual(b.items.filter((_, i) => i !== 2).map((i) => i.lesson_id), kept.filter(Boolean));
  assert.equal(lessonsIn(db, fam), 5);
});

test("unfinished sets: lessons not yet written stay listed and can be written later", async () => {
  const db = makeDb();
  const fam = seed(db);
  const { batch } = await bat.createBatch(db, { familyId: fam, userId: "u", body: body(null, { lessons: FIVE.slice(0, 4) }) }, NOW);
  await draft(db, stub(), fam, batch.id, 0);
  await draft(db, stub(), fam, batch.id, 1);
  const b = (await bat.getBatch(db, fam, batch.id, NOW)).batch;
  assert.deepEqual(states(b), ["ready", "ready", "pending", "pending"]);
  assert.equal(b.counts.unfinished, 2);
  assert.ok((await draft(db, stub(), fam, batch.id, 3)).ok, "a later lesson can be written before an earlier one");
});

test("a lesson being written is never started twice; an interrupted one becomes retryable", async () => {
  const db = makeDb();
  const fam = seed(db);
  const { batch } = await bat.createBatch(db, { familyId: fam, userId: "u", body: body(null, { lessons: FIVE.slice(0, 2) }) }, NOW);
  db.raw.prepare("UPDATE lesson_batch_items SET status='generating', updated_at=? WHERE batch_id=? AND idx=0").run(NOW.toISOString(), batch.id);
  const ai = stub();
  const busy = await draft(db, ai, fam, batch.id, 0);
  assert.equal(busy.code, "IN_PROGRESS");
  assert.equal(ai.calls.length, 0);
  assert.equal((await bat.getBatch(db, fam, batch.id, NOW)).batch.items[0].state, "generating");

  // The tab was closed mid-write: after a few minutes it shows as interrupted and can be tried again.
  const later = new Date(NOW.getTime() + bat.STALE_MS + 1000);
  const b = (await bat.getBatch(db, fam, batch.id, later)).batch;
  assert.equal(b.items[0].state, "failed");
  assert.match(b.items[0].error, /interrupted/);
  const r = await bat.draftBatchItem(db, ai, { familyId: fam, userId: "u", batchId: batch.id, index: 0 }, later);
  assert.ok(r.ok, JSON.stringify(r));
  assert.equal(lessonsIn(db, fam), 1);
});

test("archived lessons, dismissing a set, and family isolation", async () => {
  const db = makeDb();
  const fam = seed(db);
  const other = seed(db);
  const { batch } = await bat.createBatch(db, { familyId: fam, userId: "u", body: body(null, { lessons: FIVE.slice(0, 2) }) }, NOW);
  await draft(db, stub(), fam, batch.id, 0);
  await draft(db, stub(), fam, batch.id, 1);
  const first = (await bat.getBatch(db, fam, batch.id, NOW)).batch.items[0].lesson_id;
  await lb.setArchived(db, fam, first, true, NOW);
  assert.equal((await bat.getBatch(db, fam, batch.id, NOW)).batch.items[0].state, "archived");

  // other families can't see, write into or hide this set, or attach their child to a new one
  assert.equal((await bat.getBatch(db, other, batch.id, NOW)).status, 404);
  assert.equal((await draft(db, stub(), other, batch.id, 1)).status, 404);
  assert.equal((await bat.dismissBatch(db, other, batch.id, NOW)).status, 404);
  assert.equal((await bat.listBatches(db, other, {}, NOW)).batches.length, 0);
  const theirKid = child(db, other);
  assert.equal((await bat.createBatch(db, { familyId: fam, userId: "u", body: body(theirKid) }, NOW)).status, 404);
  assert.equal((await bat.createBatch(db, { familyId: other, userId: "u", body: body(null, { id: batch.id }) }, NOW)).status, 409);

  // dismissing hides the set from the Parent Hub but keeps every lesson
  assert.ok((await bat.dismissBatch(db, fam, batch.id, NOW)).ok);
  assert.equal((await bat.listBatches(db, fam, {}, NOW)).batches.length, 0);
  assert.equal(lessonsIn(db, fam), 2);
});

test("batches: validation, paid-only, and single-lesson drafting unchanged", async () => {
  const db = makeDb();
  const free = seed(db, { plan: "FREE_PREVIEW" });
  assert.equal((await bat.createBatch(db, { familyId: free, userId: "u", body: body(null) }, NOW)).code, "UPGRADE_REQUIRED");
  const fam = seed(db);
  assert.equal((await bat.createBatch(db, { familyId: fam, userId: "u", body: body(null, { lessons: FIVE.slice(0, 1) }) }, NOW)).status, 400);
  assert.equal((await bat.createBatch(db, { familyId: fam, userId: "u", body: body(null, { lessons: [...FIVE, ...FIVE] }) }, NOW)).status, 400);
  const { batch } = await bat.createBatch(db, { familyId: fam, userId: "u", body: body(null, { lessons: FIVE.slice(0, 2) }) }, NOW);
  assert.equal((await draft(db, stub(), fam, batch.id, 7)).status, 404);

  // The normal one-lesson path still works exactly as before and never creates a set.
  const one = await aid.draftLessonWithAi(db, stub(), { familyId: fam, userId: "u", request: { topic: "Fractions" } }, NOW);
  assert.ok(one.ok, JSON.stringify(one));
  assert.equal(one.lesson.status, "draft");
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM lesson_batches WHERE family_id = ?").get(fam).n, 1);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM lesson_batch_items WHERE lesson_id = ?").get(one.lesson.id).n, 0);
});


test("Year 7 Halloween Science AND Maths request creates two fully independent, correctly labelled draft lessons", async () => {
  const db = makeDb(), fam = seed(db), kid = child(db, fam);
  const writer = stub((model, input) => {
    const userPrompt = input.messages.at(-1).content;
    if (userPrompt.includes("Plan exactly 2 SEPARATE full lessons")) {
      assert.match(userPrompt, /1\. Science; 2\. Mathematics/);
      assert.match(userPrompt, /Halloween/i);
      return { response: JSON.stringify({
        series_title: "Halloween Year 7 adventures",
        lessons: [
          { title: "Spooky reactions", goal: "Explain changes using Year 7 science concepts" },
          { title: "Pumpkin proportions", goal: "Solve Year 7 proportions and scaling problems" },
        ],
      }) };
    }
    return staged(model, input);
  });
  const input = { request: "Create a Halloween science and math lesson at the same time for a Year 7 student", student_id: kid, count: 2, subjects: ["Science", "Mathematics"] };
  const plan = await aid.planSeriesWithAi(db, writer, { familyId: fam, userId: "u", request: input }, NOW);
  assert.ok(plan.ok, JSON.stringify(plan));
  assert.equal(plan.count, 2);
  assert.deepEqual(plan.lessons.map(l => l.learning_area), ["Science", "Mathematics"]);
  assert.match(plan.lessons[0].title, /^Science/);
  assert.match(plan.lessons[1].title, /^Mathematics/);

  const created = await bat.createBatch(db, { familyId: fam, userId: "u", body: {
    title: plan.title, lessons: plan.lessons, student_id: kid, request: input.request, link_outcomes: false,
  } }, NOW);
  assert.ok(created.ok, JSON.stringify(created));
  assert.deepEqual(states(created.batch), ["pending", "pending"]);
  assert.deepEqual(created.batch.items.map(i => i.learning_area), ["Science", "Mathematics"]);
  const science = await draft(db, writer, fam, created.batch.id, 0);
  assert.ok(science.ok, JSON.stringify(science));
  const maths = await draft(db, writer, fam, created.batch.id, 1);
  assert.ok(maths.ok, JSON.stringify(maths));

  const loaded = (await bat.getBatch(db, fam, created.batch.id, NOW)).batch;
  assert.deepEqual(states(loaded), ["ready", "ready"]);
  assert.equal(loaded.items.length, 2);
  assert.equal(new Set(loaded.items.map(i => i.lesson_id)).size, 2);
  const fullLessons = loaded.items.map(i => lb.lessonOut(db.raw.prepare("SELECT * FROM lessons WHERE id=?").get(i.lesson_id)));
  assert.deepEqual(fullLessons.map(l => l.learning_area), ["Science", "Mathematics"]);
  assert.deepEqual(fullLessons.map(l => l.year_level), ["Year 7", "Year 7"]);
  assert.ok(fullLessons.every(l => l.status === "draft"));
  assert.ok(fullLessons.every(l => l.sections.length === GARDEN.sections.length && l.worked_examples.length === GARDEN.worked_examples.length && l.activities.length === GARDEN.activities.length));
  assert.equal(lessonsIn(db, fam), 2);
  for (const i of [0, 1]) {
    const repeat = await draft(db, writer, fam, created.batch.id, i);
    assert.ok(repeat.ok && repeat.reused);
  }
  assert.equal(lessonsIn(db, fam), 2, "reopening does not duplicate either subject");
});

test("reject unsupported individual batch subjects instead of silently writing the wrong subject", async () => {
  const db = makeDb(), fam = seed(db);
  const r = await bat.createBatch(db, { familyId: fam, userId: "u", body: {
    title: "Mixed", lessons: [
      { title: "Science", goal: "Experiment", learning_area: "Science" },
      { title: "Unknown", goal: "Incorrect", learning_area: "Unknown subject" },
    ],
  } }, NOW);
  assert.equal(r.ok, false);
  assert.equal(r.status, 400);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM lesson_batches").get().n, 0);
});

test("an invalid multi-subject planner request is blocked before making any AI call", async () => {
  const db = makeDb(), fam = seed(db), ai = stub();
  const r = await aid.planSeriesWithAi(db, ai, {
    familyId: fam, userId: "u", request: { request: "Halloween science and math", subjects: ["Science", "Science"], count: 2 },
  }, NOW);
  assert.equal(r.ok, false);
  assert.equal(r.status, 400);
  assert.equal(ai.calls.length, 0);
});

test("three Year 7 Halloween lessons preserve Science, English and HSIE, including secondary areas, end to end", async () => {
  const db = makeDb(), fam = seed(db), kid = child(db, fam);
  const subjects = ["Science", "English", "Humanities and Social Sciences"];
  const writer = stub((model, input) => {
    const msg = String(input.messages?.at(-1)?.content || "");
    if (msg.includes("Plan exactly 3 SEPARATE full lessons")) {
      assert.match(msg, /1\. Science; 2\. English; 3\. Humanities and Social Sciences/);
      return { response: JSON.stringify({ series_title: "Three Halloween subjects", lessons: [
        { title: "Exploring materials", goal: "Conduct a science investigation", additional_learning_areas: [] },
        { title: "Gothic narrative", goal: "Write a suspenseful description", additional_learning_areas: ["Humanities and Social Sciences"] },
        { title: "Historical traditions", goal: "Evaluate sources about Halloween", additional_learning_areas: ["English"] },
      ] }) };
    }
    return staged(model, input);
  });
  const input = { request: "Three Year 7 Halloween lessons: a science, an English and an HSIE", student_id: kid, count: 3, subjects };
  const planned = await aid.planSeriesWithAi(db, writer, { familyId: fam, userId: "u", request: input }, NOW);
  assert.ok(planned.ok, JSON.stringify(planned));
  assert.deepEqual(planned.lessons.map(l => l.learning_area), subjects);
  assert.deepEqual(planned.lessons.map(l => l.additional_learning_areas), [
    [], ["Humanities and Social Sciences"], ["English"],
  ]);
  const created = await bat.createBatch(db, { familyId: fam, userId: "u", body: {
    title: planned.title, lessons: planned.lessons, student_id: kid, request: input.request, link_outcomes: false,
  } }, NOW);
  assert.ok(created.ok, JSON.stringify(created));
  assert.deepEqual(created.batch.items.map(i => i.learning_area), subjects);
  for (let i = 0; i < 3; i++) {
    const d = await draft(db, writer, fam, created.batch.id, i);
    assert.ok(d.ok, JSON.stringify(d));
  }
  const after = (await bat.getBatch(db, fam, created.batch.id, NOW)).batch;
  assert.deepEqual(states(after), ["ready", "ready", "ready"]);
  const lessons = after.items.map(i => lb.lessonOut(db.raw.prepare("SELECT * FROM lessons WHERE id = ?").get(i.lesson_id)));
  assert.deepEqual(lessons.map(l => l.learning_area), subjects);
  assert.deepEqual(lessons.map(l => l.additional_learning_areas), [[], ["Humanities and Social Sciences"], ["English"]]);
  assert.ok(lessons.every(l => l.status === "draft" && l.sections.length === GARDEN.sections.length && l.activities.length === GARDEN.activities.length));
  assert.equal(lessonsIn(db, fam), 3);
  for (let i = 0; i < 3; i++) assert.equal((await draft(db, writer, fam, created.batch.id, i)).reused, true);
  assert.equal(lessonsIn(db, fam), 3, "secondary-area connections must never create duplicate lessons");
});
