// Prior learning: outcomes met before Side-Quest (school report, NAPLAN, earlier schooling).
import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import * as ot from "../src/outcomeTracker.ts";
import { analysePriorLearning } from "../src/priorLearning.ts";
import { planAutoQuest } from "../src/autoQuest.ts";
import { trialEndFrom } from "../src/entitlements.ts";

const NOW = new Date("2026-10-24T02:00:00Z");
const RN = "MA2-RN-01", AR = "MA2-AR-01", OLC = "EN2-OLC-01";
let n = 0;
function setup({ jurisdiction = "NSW" } = {}) {
  const db = makeDb(), fam = `fam${++n}`, kid = `kid${n}`, t = NOW.toISOString();
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at,jurisdiction) VALUES (?,?,?,?,?,?,?,?)").run(fam, "Fam", `u-${fam}`, t, "ACTIVE_MONTHLY", t, trialEndFrom(t), jurisdiction);
  db.raw.prepare("INSERT INTO users (id,family_id,email,name,created_at) VALUES (?,?,?,?,?)").run(`u-${fam}`, fam, `${fam}@example.com`, "Pat Parent", t);
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at) VALUES (?,?,?,?,?,?,?,?)").run(kid, fam, "Mia", `mia${n}`, "x", "S2", "3", t);
  return { db, fam, kid, parent: `u-${fam}` };
}
const row = async (h, code) => (await ot.trackerFor(h.db, h.fam, h.kid, { now: NOW })).outcomes.find((o) => o.code === code);

test("recognised prior learning gets its own status, clears gaps and is logged as the parent's decision", async () => {
  const h = setup();
  assert.equal((await row(h, RN)).status, "not_started");
  const r = await ot.recordPriorLearning(h.db, h.fam, h.parent, h.kid, { codes: [RN, AR], source: "Year 3 Semester 1 school report", note: "Grade A in Maths" }, NOW);
  assert.ok(r.ok, JSON.stringify(r));
  assert.equal(r.recorded, 2);
  const o = await row(h, RN);
  assert.equal(o.status, "prior_learning");
  assert.deepEqual(o.gaps, []);
  assert.equal(o.prior_learning.source, "Year 3 Semester 1 school report");
  const d = await ot.outcomeDetail(h.db, h.fam, h.kid, RN, { now: NOW });
  assert.equal(d.status, "prior_learning");
  assert.equal(d.prior_learning.note, "Grade A in Maths");
  assert.ok(d.evidence.some((e) => e.source_type === "prior_learning" && e.summary.includes("school report")));
  assert.match(d.history[0].reason, /Recognised by you as prior learning: Year 3 Semester 1 school report/);
  assert.equal(d.history[0].actor, "parent");
  // Untouched outcomes stay as they were.
  assert.equal((await row(h, OLC)).status, "not_started");
});

test("a later confirmation still wins, and recording twice skips what's already recognised", async () => {
  const h = setup();
  await ot.recordPriorLearning(h.db, h.fam, h.parent, h.kid, { codes: [RN], source: "School report" }, NOW);
  const again = await ot.recordPriorLearning(h.db, h.fam, h.parent, h.kid, { codes: [RN, AR], source: "NAPLAN 2025" }, NOW);
  assert.equal(again.recorded, 1);
  assert.equal(again.skipped, 1);
  assert.ok((await ot.confirmOutcome(h.db, h.fam, h.parent, h.kid, RN, { override: true, note: "Seen it myself" }, NOW)).ok);
  assert.equal((await row(h, RN)).status, "achieved");
});

test("removing prior learning restores the evidence-based status and keeps the history", async () => {
  const h = setup();
  await ot.recordPriorLearning(h.db, h.fam, h.parent, h.kid, { codes: [RN], source: "School report" }, NOW);
  assert.ok((await ot.removePriorLearning(h.db, h.fam, h.parent, h.kid, RN, { note: "Wrong outcome" }, NOW)).ok);
  const d = await ot.outcomeDetail(h.db, h.fam, h.kid, RN, { now: NOW });
  assert.equal(d.status, "not_started");
  assert.equal(d.prior_learning, null);
  assert.ok(d.evidence.every((e) => !e.counts));
  assert.match(d.history[0].reason, /You removed the prior learning/);
  assert.equal((await ot.removePriorLearning(h.db, h.fam, h.parent, h.kid, RN, {}, NOW)).code, "NOT_PRIOR");
});

test("an uploaded report is kept as one Evidence Backpack note", async () => {
  const h = setup();
  h.db.raw.prepare("INSERT INTO files (id,family_id,uploader_id,uploader_role,storage_path,original_filename,content_type,size,context,is_deleted,created_at) VALUES ('f1',?,?, 'parent','k','report.pdf','application/pdf',10,'evidence',0,?)").run(h.fam, h.parent, NOW.toISOString());
  const r = await ot.recordPriorLearning(h.db, h.fam, h.parent, h.kid, { codes: [RN, AR], source: "Term 2 report", file_ids: ["f1"] }, NOW);
  const note = h.db.raw.prepare("SELECT * FROM evidence_notes WHERE id = ?").get(r.evidence_note_id);
  assert.equal(note.title, "Prior learning: Term 2 report");
  assert.equal(note.file_ids, '["f1"]');
  assert.match(note.notes, /MA2-RN-01, MA2-AR-01/);
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM evidence_notes").get().n, 1);
});

test("bad input is refused: no source, unknown outcomes, another family's file, no catalogue", async () => {
  const h = setup();
  assert.equal((await ot.recordPriorLearning(h.db, h.fam, h.parent, h.kid, { codes: [RN], source: "" }, NOW)).code, "SOURCE_REQUIRED");
  assert.equal((await ot.recordPriorLearning(h.db, h.fam, h.parent, h.kid, { codes: ["AC9MFN01"], source: "Report" }, NOW)).code, "UNKNOWN_OUTCOME");
  assert.equal((await ot.recordPriorLearning(h.db, h.fam, h.parent, h.kid, { codes: [RN], source: "Report", file_ids: ["nope"] }, NOW)).ok, false);
  const vic = setup({ jurisdiction: "VIC" });
  assert.equal((await ot.recordPriorLearning(vic.db, vic.fam, vic.parent, vic.kid, { codes: [RN], source: "Report" }, NOW)).code, "NO_CATALOGUE");
});

test("reading a report: the AI only picks from the child's own unmet outcomes, and NAPLAN is never high confidence", async () => {
  const h = setup();
  await ot.recordPriorLearning(h.db, h.fam, h.parent, h.kid, { codes: [AR], source: "Earlier report" }, NOW);
  let prompt = "";
  const ai = { run: async (_m, input) => {
    prompt = input.messages[1].content;
    const lines = prompt.split("\n").filter((l) => /^\d+\. /.test(l));
    const n = (code) => 1 + lines.findIndex((l) => l.includes(ot.outcomeInfo(ot.catalogueFor("NSW").byCode.get(code)).summary));
    return { response: JSON.stringify({ document_type: "naplan", summary: "NAPLAN 2025, Year 3.", matches: [
      { n: n(RN), evidence: "Numeracy: Strong (MA2-RN-01)", confidence: "high" },
      { n: 9999, evidence: "made up", confidence: "high" },
    ] }) };
  } };
  const r = await analysePriorLearning({ DB: h.db }, ai, { familyId: h.fam, userId: h.parent, studentId: h.kid, text: "NAPLAN 2025 Year 3. Numeracy: Strong. Reading: Developing. Writing: Strong." }, NOW);
  assert.ok(r.ok, JSON.stringify(r));
  assert.equal(r.document_type, "naplan");
  assert.equal(r.suggestions.length, 1, "an out-of-list pick was not dropped");
  assert.equal(r.suggestions[0].code, RN);
  assert.equal(r.suggestions[0].confidence, "medium");
  assert.doesNotMatch(r.suggestions[0].evidence, /MA2-RN-01/);
  assert.ok(!prompt.includes(ot.outcomeInfo(ot.catalogueFor("NSW").byCode.get(AR)).summary), "an already-met outcome was offered again");
  assert.doesNotMatch(prompt, /MA2-RN-01/, "codes are not sent; the AI picks by number");
  assert.equal(h.db.raw.prepare("SELECT status FROM ai_usage WHERE kind = 'prior_learning_scan'").get().status, "ok");
});

test("Plan My Week's planner treats prior learning like Achieved and doesn't teach it again", () => {
  const input = {
    studentId: "k", childStage: "S2", childYear: "3", catalogueAvailable: true, allowedOutcomeCodes: ["PRIOR"], assignments: [],
    slots: [{ id: "mon", student_id: "k", date: "2026-10-26", title: "Mathematics", event_type: "timetable" }],
    lessons: [{ id: "l", title: "Numbers", stage: "S2", status: "ready", learning_area: "Mathematics", outcome_codes: ["PRIOR"] }],
    progress: [{ code: "PRIOR", status: "prior_learning" }],
  };
  assert.equal(planAutoQuest(input)[0].action, "needs_parent_plan", "a prior-learning lesson was offered again");
  assert.equal(planAutoQuest({ ...input, progress: [{ code: "PRIOR", status: "developing" }] })[0].action, "reuse_draft");
});
