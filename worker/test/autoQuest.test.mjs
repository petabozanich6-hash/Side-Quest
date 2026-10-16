import { test } from "node:test";
import assert from "node:assert/strict";
import { planAutoQuest } from "../src/autoQuest.ts";

const base = {
  studentId: "child-a",
  slots: [
    { id: "mon", student_id: "child-a", date: "2026-10-19", title: "Mathematics", event_type: "lesson" },
    { id: "tue", student_id: "child-a", date: "2026-10-20", title: "Mathematics", event_type: "lesson" },
  ],
  lessons: [
    { id: "lesson-achieved", title: "Numbers", learning_area: "Mathematics", outcome_codes: ["ACH"] },
    { id: "lesson-next", title: "Addition", learning_area: "Mathematics", outcome_codes: ["NEXT"] },
  ],
  assignments: [],
  progress: [{ code: "ACH", status: "achieved" }, { code: "NEXT", status: "developing" }],
  catalogueAvailable: true,
  allowedOutcomeCodes: ["ACH", "NEXT"],
};

test("reuses only a draft with unachieved verified outcomes and does not reuse it twice", () => {
  const result = planAutoQuest(base);
  assert.equal(result[0].action, "reuse_draft");
  assert.equal(result[0].lessonId, "lesson-next");
  assert.deepEqual(result[0].eligibleOutcomeCodes, ["NEXT"]);
  assert.equal(result[1].action, "needs_generation");
});

test("existing assignments are never overwritten", () => {
  const result = planAutoQuest({ ...base, slots: [{ ...base.slots[0], linked_assignment_id: "a1" }], assignments: [{ id: "a1", student_id: "child-a", lesson_id: "lesson-next", status: "not_started" }] });
  assert.equal(result[0].action, "already_assigned");
});

test("without a verified catalogue, does not suggest fabricated mappings", () => {
  const result = planAutoQuest({ ...base, catalogueAvailable: false });
  assert.ok(result.every(x => x.action === "needs_parent_plan" && x.eligibleOutcomeCodes.length === 0));
});

test("achieved-only curriculum is not generated again by default", () => {
  const result = planAutoQuest({ ...base, lessons: [base.lessons[0]], allowedOutcomeCodes: ["ACH"] });
  assert.ok(result.every(x => x.action === "needs_parent_plan"));
});

test("family/child isolation: only chosen child's timetable slots are planned", () => {
  const result = planAutoQuest({ ...base, slots: [...base.slots, { id: "other", student_id: "child-b", date: "2026-10-19", title: "Mathematics" }] });
  assert.equal(result.length, 2);
});


test("same subject on the same day gets a separate proposal unless that exact slot is linked", () => {
  const assigned = { id: "a1", student_id: "child-a", lesson_id: "lesson-next", scheduled_date: "2026-10-19", status: "not_started" };
  const slots = [{ ...base.slots[0], linked_assignment_id: "a1" },
    { ...base.slots[1], date: "2026-10-19", id: "second-maths", linked_assignment_id: null }];
  const proposed = planAutoQuest({ ...base, slots, assignments: [assigned] });
  assert.equal(proposed[0].action, "already_assigned");
  assert.notEqual(proposed[1].action, "already_assigned", "a same-day subject assignment cannot take up another free slot");
  assert.equal(proposed[1].action, "needs_generation", "an in-flight outcome may still receive a distinct practice task");
  assert.equal(proposed[1].purpose, "consolidate");
  assert.deepEqual(proposed[1].eligibleOutcomeCodes, ["NEXT"]);
});

test("multiple sessions reinforce an outcome without claiming it is achieved", () => {
  const entries = Array.from({ length: 4 }, (_, i) => ({
    ...base.slots[0], id: "maths-" + i, date: `2026-10-${String(19 + i).padStart(2, "0")}`
  }));
  const result = planAutoQuest({ ...base, slots: entries, lessons: [base.lessons[1]] });
  assert.ok(result.slice(0, 3).every(p => p.action !== "needs_parent_plan"));
  assert.ok(result.some(p => p.purpose === "consolidate"));
  assert.ok(result.some(p => /assigning a lesson does not mean an outcome is achieved/.test(p.reason)));
});

// ---------------------------------------------------------------- integration: real migrations, real queries
import { readFileSync } from "node:fs";
import { makeDb } from "./fakeD1.mjs";
import * as lb from "../src/lessonBuilder.ts";
import * as ot from "../src/outcomeTracker.ts";
import * as aq from "../src/autoQuest.ts";
import { trialEndFrom } from "../src/entitlements.ts";

const NOW = new Date("2026-10-15T00:00:00Z");
const D = (d) => new Date(NOW.getTime() + d * 86400000);
const day = (d) => D(d).toISOString().slice(0, 10);
const NSW = ot.catalogueFor("NSW");
const S2_MATHS = NSW.outcomes.filter((o) => o.stage === "S2" && o.learning_area === "Mathematics").map((o) => o.code);
let k = 0;
function family(db, { jurisdiction = "NSW", plan = "ACTIVE_MONTHLY" } = {}) {
  const fam = `aqf${++k}`;
  const t = NOW.toISOString();
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at,jurisdiction) VALUES (?,?,?,?,?,?,?,?)").run(fam, "Fam", `u-${fam}`, t, plan, t, trialEndFrom(t), jurisdiction);
  db.raw.prepare("INSERT INTO users (id,family_id,email,name,created_at) VALUES (?,?,?,?,?)").run(`u-${fam}`, fam, `${fam}@example.com`, "Pat", t);
  return fam;
}
function kid(db, fam) {
  const id = `aqk${++k}`;
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at) VALUES (?,?,?,?,?,?,?,?)").run(id, fam, "Mia", `mia${id}`, "x", "S2", "3", NOW.toISOString());
  return id;
}
function slot(db, fam, sid, d, title, extra = {}) {
  const id = `ev${++k}`;
  db.raw.prepare("INSERT INTO calendar_events (id,family_id,student_id,title,date,start_time,duration_minutes,event_type,linked_lesson_id,linked_assignment_id,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)")
    .run(id, fam, sid, title, day(d), "09:00", 40, extra.event_type || "lesson", extra.linked_lesson_id || null, extra.linked_assignment_id || null, NOW.toISOString());
  return id;
}
const lessonBody = (title, codes, over = {}) => ({ title, learning_area: "Mathematics", stage: "S2", status: "ready", objectives: ["Learn"], sections: [{ heading: "Teach", body: "Explained." }], quiz: [{ question: "Pick 2", options: ["1", "2"], correct_index: 1 }], outcome_codes: codes, ...over });
async function lesson(db, fam, title, codes, over) { const r = await lb.createLesson(db, fam, lessonBody(title, codes, over), NOW); assert.ok(r.ok, JSON.stringify(r)); return r.lesson; }
const plan = (db, fam, sid, from = 0, to = 6, now = NOW) => aq.planRange(db, fam, { student_id: sid, from: day(from), to: day(to) }, now);

// Same staged AI fake as builder/batches tests.
const GARDEN = JSON.parse(readFileSync(new URL("../../frontend/src/data/exampleLesson.json", import.meta.url), "utf8"));
const STAGE1 = ["title", "teaching_plan", "why_it_matters", "prior_knowledge", "objectives", "key_words", "misconceptions"];
const staged = (model, input) => {
  const u = input.messages.at(-1).content;
  const g = { ...GARDEN };
  const pick = (ks) => Object.fromEntries(ks.filter((x) => g[x] !== undefined).map((x) => [x, g[x]]));
  const reply = (o) => ({ response: JSON.stringify(o), usage: { prompt_tokens: 10, completion_tokens: 20 } });
  if (u.includes("STAGE 1:")) return reply({ ...pick(STAGE1), concept: "c", sequence: g.sections.map((x) => ({ heading: x.heading, idea: "i", how: "h" })), worked_examples: g.worked_examples.map((w) => ({ title: w.title, problem: w.problem, skill: "s" })), practice_plan: "p" });
  if (u.includes("STAGE 2:")) return reply(pick(["introduction", "texts", "consolidation"]));
  let m = u.match(/STAGE 3, SECTION (\d+) OF/); if (m) return reply(g.sections[Number(m[1]) - 1]);
  m = u.match(/STAGE 3, WORKED EXAMPLE (\d+) OF/); if (m) return reply(g.worked_examples[Number(m[1]) - 1]);
  if (u.includes("STAGE 4, PRACTICE")) return reply(pick(["guided_practice", "activities"]));
  if (u.includes("STAGE 4, ASSESSMENT")) return reply(Object.fromEntries(Object.entries(g).filter(([x]) => !["title", "teaching_plan", "why_it_matters", "prior_knowledge", "objectives", "key_words", "misconceptions", "introduction", "texts", "consolidation", "sections", "worked_examples", "guided_practice", "activities", "answer_key"].includes(x))));
  return reply(g);
};
const fakeAi = () => { const calls = []; return { calls, run: async (...a) => { calls.push(a); return staged(...a); } }; };

test("plans from the timetable and the family's curriculum: lesson slots only, matched areas, verified codes, existing lessons reused once", async () => {
  const db = makeDb();
  const fam = family(db); const sid = kid(db, fam);
  slot(db, fam, sid, 0, "Maths");
  slot(db, fam, sid, 1, "Mathematics");
  slot(db, fam, sid, 2, "Excursion", { event_type: "event" });
  slot(db, fam, sid, 3, "English");
  const saved = await lesson(db, fam, "Place value", [S2_MATHS[0]]);
  const r = await plan(db, fam, sid);
  assert.ok(r.ok, JSON.stringify(r));
  assert.equal(r.proposals.length, 3, "only timetabled lesson slots are planned");
  const [m1, m2, en] = r.proposals;
  assert.equal(m1.learning_area, "Mathematics"); assert.equal(en.learning_area, "English");
  assert.equal(m1.action, "reuse_draft"); assert.equal(m1.lesson.id, saved.id); assert.equal(m1.purpose, "teach");
  assert.equal(m2.action, "needs_generation", "the saved lesson is not reused twice");
  assert.ok(m2.outcome_codes.length > 0 && m2.outcome_codes.every((c) => S2_MATHS.includes(c) && c !== S2_MATHS[0]), "next maths outcomes, never the one already planned");
  for (const p of r.proposals) for (const c of p.outcome_codes) assert.ok(NSW.byCode.has(c), `invented code ${c}`);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM assignments WHERE family_id = ?").get(fam).n, 0, "planning assigns nothing");
});

test("re-planning never duplicates proposals and never loses a generated draft; AI is paid-only and never automatic", async () => {
  const db = makeDb();
  const fam = family(db); const sid = kid(db, fam);
  slot(db, fam, sid, 1, "Mathematics");
  const first = await plan(db, fam, sid);
  await plan(db, fam, sid);
  const again = await plan(db, fam, sid);
  assert.equal(again.proposals.length, 1);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM auto_quest_proposals").get().n, 1, "no duplicate proposals");
  const ai = fakeAi();
  assert.equal(ai.calls.length, 0, "planning spends no AI");
  const g = await aq.generateForProposal(db, ai, { familyId: fam, userId: `u-${fam}`, id: first.proposals[0].id }, NOW);
  assert.ok(g.ok, JSON.stringify(g));
  assert.equal(g.proposal.lesson.status, "draft", "an AI lesson starts as a draft for review");
  assert.ok(g.proposal.lesson.ai_draft_needs_review);
  assert.deepEqual(g.proposal.lesson.outcome_codes, first.proposals[0].outcome_codes, "verified target codes attached");
  assert.equal((await aq.generateForProposal(db, ai, { familyId: fam, userId: `u-${fam}`, id: first.proposals[0].id }, NOW)).code, "HAS_LESSON", "no second draft for the same slot");
  const re = await plan(db, fam, sid);
  assert.equal(re.proposals[0].lesson.id, g.proposal.lesson.id, "re-planning keeps the draft");

  const free = family(db, { plan: "FREE_PREVIEW" }); const fsid = kid(db, free);
  slot(db, free, fsid, 1, "Mathematics");
  const fp = await plan(db, free, fsid);
  const before = ai.calls.length;
  const blocked = await aq.generateForProposal(db, ai, { familyId: free, userId: `u-${free}`, id: fp.proposals[0].id }, NOW);
  assert.equal(blocked.status, 402); assert.equal(ai.calls.length, before, "no AI call for a free preview");
});

test("approval: drafts need the parent's review; assignment lands on the slot's date; existing links are never overridden", async () => {
  const db = makeDb();
  const fam = family(db); const sid = kid(db, fam);
  const ev = slot(db, fam, sid, 2, "Mathematics");
  const r = await plan(db, fam, sid);
  const g = await aq.generateForProposal(db, fakeAi(), { familyId: fam, userId: `u-${fam}`, id: r.proposals[0].id }, NOW);
  const no = await aq.approveProposal(db, fam, `u-${fam}`, g.proposal.id, {}, NOW);
  assert.equal(no.code, "NEEDS_REVIEW");
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM assignments").get().n, 0, "unreviewed AI lesson never assigned");
  const yes = await aq.approveProposal(db, fam, `u-${fam}`, g.proposal.id, { confirm_reviewed: true }, NOW);
  assert.ok(yes.ok, JSON.stringify(yes));
  const a = db.raw.prepare("SELECT * FROM assignments WHERE id = ?").get(yes.proposal.assignment_id);
  assert.equal(a.scheduled_date, day(2)); assert.equal(a.student_id, sid);
  assert.equal(db.raw.prepare("SELECT linked_assignment_id l FROM calendar_events WHERE id = ?").get(ev).l, a.id);
  assert.equal(JSON.parse(db.raw.prepare("SELECT data FROM lessons WHERE id = ?").get(a.lesson_id).data).review_status, "parent_reviewed");
  assert.equal((await aq.approveProposal(db, fam, `u-${fam}`, g.proposal.id, {}, NOW)).code, "DECIDED", "no double assignment");

  // A slot already linked to the parent's own assignment is left alone.
  const own = await lesson(db, fam, "Own", [S2_MATHS[3]]);
  const asg = await lb.assignLesson(db, fam, { student_id: sid, lesson_id: own.id, scheduled_date: day(4) }, NOW);
  slot(db, fam, sid, 4, "Mathematics", { linked_assignment_id: asg.assignment.id });
  const r2 = await plan(db, fam, sid);
  const linked = r2.proposals.find((p) => p.date === day(4));
  assert.equal(linked.action, "already_assigned"); assert.equal(linked.status, "assigned");
});


test("calendar-slot approval refuses a slot filled after planning without making a new assignment", async () => {
  const db = makeDb();
  const fam = family(db), sid = kid(db, fam);
  const slotId = slot(db, fam, sid, 2, "Mathematics");
  const proposed = await plan(db, fam, sid);
  const lessonForSlot = await lesson(db, fam, "Place value", [S2_MATHS[0]]);
  const chosen = await aq.setProposalLesson(db, fam, proposed.proposals[0].id, lessonForSlot.id, NOW);
  assert.ok(chosen.ok);
  db.raw.prepare("UPDATE calendar_events SET linked_assignment_id = ? WHERE id = ?").run("taken-by-another-tab", slotId);
  const result = await aq.approveProposal(db, fam, `u-${fam}`, proposed.proposals[0].id, {}, NOW);
  assert.equal(result.code, "SLOT_TAKEN");
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM assignments WHERE family_id = ?").get(fam).n, 0,
    "no assignment can be created if the target slot is already occupied");
});

test("reviewed work feeds the tracker, and the next plan consolidates or moves on; achieved outcomes are not re-taught", async () => {
  const db = makeDb();
  const fam = family(db); const sid = kid(db, fam);
  const [A, B] = S2_MATHS;
  const la = await lesson(db, fam, "A", [A]);
  const asg = await lb.assignLesson(db, fam, { student_id: sid, lesson_id: la.id }, NOW);
  const user = { id: sid, family_id: fam };
  assert.ok((await lb.checkQuiz(db, user, asg.assignment.id, ["2"], NOW)).ok);
  const sub = await lb.submitWork(db, user, { assignment_id: asg.assignment.id, response_text: "work" }, NOW);
  await lb.reviewSubmission(db, fam, `u-${fam}`, sub.id, { status: "demonstrated", feedback_text: "ok", outcome_mappings: [{ code: A, mark: "practising" }] }, NOW);
  slot(db, fam, sid, 7, "Mathematics");
  const r = await plan(db, fam, sid, 7, 13, D(1));
  assert.equal(r.proposals[0].purpose, "consolidate", "a developing outcome is consolidated first");
  assert.deepEqual(r.proposals[0].outcome_codes.slice(0, 1), [A]);
  assert.equal(r.proposals[0].action, "needs_generation", "the finished lesson is not simply reassigned without a reason");
  // Parent confirms A achieved (below guideline, with a note): it drops out of planning.
  assert.ok((await ot.confirmOutcome(db, fam, `u-${fam}`, sid, A, { override: true, note: "Seen many times at home" }, D(1))).ok);
  const r2 = await plan(db, fam, sid, 7, 13, D(1));
  assert.ok(!r2.proposals[0].outcome_codes.includes(A), "achieved outcome not re-taught");
  assert.equal(r2.proposals[0].purpose, "teach"); assert.ok(r2.proposals[0].outcome_codes.includes(B));
});

test("purposeful revision: a demonstrated outcome not seen for weeks is revisited in at most one slot in four, reusing its lesson", async () => {
  const db = makeDb();
  const fam = family(db); const sid = kid(db, fam);
  const A = S2_MATHS[0];
  const la = await lesson(db, fam, "A", [A]);
  for (const d of [-60, -59]) {
    const when = D(d);
    const asg = await lb.assignLesson(db, fam, { student_id: sid, lesson_id: la.id, again: d === -59 }, when);
    const user = { id: sid, family_id: fam };
    await lb.checkQuiz(db, user, asg.assignment.id, ["2"], when);
    const sub = await lb.submitWork(db, user, { assignment_id: asg.assignment.id, response_text: "w" }, when);
    await lb.reviewSubmission(db, fam, `u-${fam}`, sub.id, { status: "demonstrated", feedback_text: "ok", outcome_mappings: [{ code: A, mark: "shown" }] }, when);
  }
  assert.equal((await ot.trackerFor(db, fam, sid, { now: NOW })).outcomes.find((o) => o.code === A).status, "demonstrated");
  for (const d of [1, 2, 3, 4]) slot(db, fam, sid, d, "Mathematics");
  const r = await plan(db, fam, sid);
  const rev = r.proposals.filter((p) => p.purpose === "revise");
  assert.equal(rev.length, 1, "one revision slot, not repetition");
  assert.equal(rev[0].date, day(4));
  assert.equal(rev[0].lesson.id, la.id, "revision may reuse the finished lesson, labelled as revision");
  const ok = await aq.approveProposal(db, fam, `u-${fam}`, rev[0].id, {}, NOW);
  assert.ok(ok.ok, JSON.stringify(ok));
  assert.match(db.raw.prepare("SELECT parent_notes p FROM assignments WHERE id = ?").get(ok.proposal.assignment_id).p, /Revision/);
});

test("family isolation and unsupported curricula", async () => {
  const db = makeDb();
  const a = family(db); const sa = kid(db, a); slot(db, a, sa, 1, "Mathematics");
  const b = family(db); const sb = kid(db, b);
  const r = await plan(db, a, sa);
  assert.equal((await plan(db, b, sa)).status, 404, "cannot plan for another family's child");
  assert.equal((await aq.approveProposal(db, b, `u-${b}`, r.proposals[0].id, {}, NOW)).status, 404);
  assert.equal((await aq.rejectProposal(db, b, `u-${b}`, r.proposals[0].id, {}, NOW)).status, 404);
  assert.equal((await aq.generateForProposal(db, fakeAi(), { familyId: b, userId: `u-${b}`, id: r.proposals[0].id }, NOW)).status, 404);
  assert.deepEqual(await aq.listProposals(db, b, sa, day(0), day(6)), []);
  const otherLesson = await lesson(db, b, "B's", [S2_MATHS[0]]);
  assert.equal((await aq.setProposalLesson(db, a, r.proposals[0].id, otherLesson.id, NOW)).status, 404, "cannot attach another family's lesson");

  const vic = family(db, { jurisdiction: "VIC" }); const sv = kid(db, vic); slot(db, vic, sv, 1, "Mathematics");
  const rv = await plan(db, vic, sv);
  assert.equal(rv.catalogue_available, false);
  assert.equal(rv.proposals[0].action, "needs_parent_plan");
  assert.deepEqual(rv.proposals[0].outcome_codes, []);
  assert.match(rv.note, /verified outcome list/);

  const qld = family(db, { jurisdiction: "QLD" }); const sq = kid(db, qld); slot(db, qld, sq, 1, "Maths");
  const rq = await plan(db, qld, sq);
  assert.ok(rq.proposals[0].outcome_codes.length && rq.proposals[0].outcome_codes.every((c) => c.startsWith("AC9M")), "QLD plans from AC9 maths codes");
  void sb;
});

test("rejecting keeps the parent's lesson; reopening allows re-planning", async () => {
  const db = makeDb();
  const fam = family(db); const sid = kid(db, fam);
  slot(db, fam, sid, 1, "Mathematics");
  const r = await plan(db, fam, sid);
  const g = await aq.generateForProposal(db, fakeAi(), { familyId: fam, userId: `u-${fam}`, id: r.proposals[0].id }, NOW);
  const rej = await aq.rejectProposal(db, fam, `u-${fam}`, g.proposal.id, { reason: "We're doing a project" }, NOW);
  assert.equal(rej.proposal.status, "rejected");
  assert.ok(db.raw.prepare("SELECT id FROM lessons WHERE id = ?").get(g.proposal.lesson.id), "draft lesson kept in the library");
  const again = await plan(db, fam, sid);
  assert.equal(again.proposals[0].status, "rejected", "re-planning respects the decision");
  assert.equal((await aq.reopenProposal(db, fam, g.proposal.id, NOW)).proposal.status, "proposed");
});

test("Auto-Quest plans only within the child's program from their profile", async () => {
  const db = makeDb();
  const fam = family(db, { jurisdiction: "QLD" });
  const id = `aqk${++k}`;
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at,extra) VALUES (?,?,?,?,?,?,?,?,?)")
    .run(id, fam, "Ari", `ari${id}`, "x", "S5", "9", NOW.toISOString(), JSON.stringify({ electives: [{ name: "Mathematics", learning_area: "Mathematics" }, { name: "History", learning_area: "HSIE" }] }));
  slot(db, fam, id, 1, "Mathematics");
  slot(db, fam, id, 2, "History");
  slot(db, fam, id, 3, "Music");
  const r = await plan(db, fam, id);
  const cat = ot.catalogueFor("QLD");
  const [m, h, mu] = r.proposals;
  assert.ok(m.outcome_codes.length && m.outcome_codes.every((c) => { const o = cat.byCode.get(c); return o.learning_area === "Mathematics" && o.from <= 9 && o.to >= 9; }), "Year 9 maths only");
  assert.ok(h.outcome_codes.every((c) => cat.byCode.get(c).subject === "History 7-10"), "History, not Geography or Civics");
  assert.equal(mu.action, "needs_parent_plan");
  assert.match(mu.reason, /isn't one of the subjects on this child's profile/);
});
