import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { buildPortfolio, summarise, outcomeFrom } from "../src/portfolio.ts";
import { trialEndFrom } from "../src/entitlements.ts";

const NOW = new Date("2026-10-14T00:00:00Z");
const T = NOW.toISOString();

function family(db, fam, plan, jurisdiction = "NSW") {
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at,jurisdiction) VALUES (?,?,?,?,?,?,?,?)").run(fam, "Fam", `u-${fam}`, T, plan, T, trialEndFrom(T), jurisdiction);
  db.raw.prepare("INSERT INTO users (id,family_id,email,name,created_at) VALUES (?,?,?,?,?)").run(`u-${fam}`, fam, `${fam}@example.com`, "Pat Parent", T);
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at) VALUES (?,?,?,?,?,?,?,?)").run(`s-${fam}`, fam, "Mia", `mia-${fam}`, "x", "S2", "Year 3", T);
}
function lessonWork(db, fam, id, reviewed, mappings, area = "English", codes = []) {
  const snap = JSON.stringify({ title: `Lesson ${id}`, learning_area: area, year_level: "Year 3", outcome_codes: codes });
  db.raw.prepare("INSERT INTO assignments (id,family_id,student_id,lesson_id,status,created_at,lesson_snapshot) VALUES (?,?,?,?,?,?,?)").run(`a${id}`, fam, `s-${fam}`, "l1", "completed", T, snap);
  db.raw.prepare("INSERT INTO submissions (id,family_id,assignment_id,student_id,lesson_id,response_text,status,parent_feedback,next_step,outcome_mappings,reviewed_at,submitted_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
    .run(`sub${id}`, fam, `a${id}`, `s-${fam}`, "l1", `My answer ${id}`, "demonstrated", "Well done", "Try longer texts", JSON.stringify(mappings), reviewed, reviewed);
}

test("outcomeFrom gives the code and the parent's judgement, never syllabus wording or legacy 'achieved'", () => {
  const legacy = outcomeFrom({ code: "EN2-OLC-01", accepted: true }, "S2");
  assert.equal(legacy.learning_area, "English");
  assert.equal(legacy.status, "working_towards", "an old accepted:true approval is practice, not understanding shown");
  assert.equal(legacy.description, "", "NESA wording is not republished");
  const stored = outcomeFrom({ code: "EN2-OLC-01", description: "Wording that an old record stored next to a catalogued outcome code", mark: "shown" }, "S2");
  assert.equal(stored.status, "shown");
  assert.equal(stored.description, "", "wording stored on an old record is not sent back out");
  assert.equal(outcomeFrom({ code: "EN2-OLC-01", accepted: false }, "S2").status, "working_towards");
  assert.equal(outcomeFrom({ learning_area: "Science", description: "Observed living things" }, "S2").description, "Observed living things", "a parent's own words are kept");
  assert.equal(outcomeFrom({}, "S2"), null);
});

test("full record: every source, chronological, outcomes, coverage gaps", async () => {
  const db = makeDb();
  family(db, "f1", "ACTIVE_MONTHLY");
  lessonWork(db, "f1", 2, "2026-09-20T01:00:00Z", [{ code: "EN2-OLC-01", accepted: true, mark: "shown" }], "English", ["EN2-VOCAB-01"]);
  lessonWork(db, "f1", 1, "2026-08-02T01:00:00Z", [{ code: "EN2-OLC-01", accepted: false }]);
  db.raw.prepare("INSERT INTO life_evidence (id,family_id,student_id,title,description,date,duration_minutes,status,accepted_mappings,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)")
    .run("le1", "f1", "s-f1", "Bushwalk", "Identified plants", "2026-09-01", 90, "accepted", JSON.stringify([{ learning_area: "Science and Technology", description: "Observed living things", accepted: true }]), T);
  db.raw.prepare("INSERT INTO life_evidence (id,family_id,student_id,title,description,date,status,created_at) VALUES (?,?,?,?,?,?,?,?)")
    .run("le2", "f1", "s-f1", "Unreviewed", "x", "2026-09-02", "awaiting_mapping", T);
  db.raw.prepare("INSERT INTO evidence_notes (id,family_id,student_id,title,learning_area,notes,occurred_on,file_ids,created_at) VALUES (?,?,?,?,?,?,?,?,?)")
    .run("n1", "f1", "s-f1", "Swimming lessons", "PDHPE", "Swam 25m", "2026-08-15", "[]", T);

  const p = await buildPortfolio(db, "f1", "s-f1", { now: NOW });
  assert.equal(p.parent_name, "Pat Parent");
  assert.equal(p.student.stage_name, "Stage 2");
  assert.equal(p.total, 4, "unreviewed life learning is left out");
  assert.deepEqual(p.entries.map((e) => e.date), ["2026-08-02", "2026-08-15", "2026-09-01", "2026-09-20"]);
  assert.deepEqual(p.entries.map((e) => e.learning_area), ["English", "PDHPE", "Science and Technology", "English"]);
  assert.equal(p.limited, false);

  const later = p.entries[3];
  assert.ok(later.outcomes.some((o) => o.code === "EN2-VOCAB-01" && o.status === "working_towards"), "planned but unmarked outcome shown as working towards");

  const olc = p.summary.outcomes.find((o) => o.code === "EN2-OLC-01");
  assert.equal(olc.times, 2);
  assert.equal(olc.first, "2026-08-02");
  assert.equal(olc.latest, "2026-09-20");
  assert.equal(olc.status, "shown", "progress from working towards to understanding shown");
  assert.equal(olc.description, "");
  assert.equal(olc.mastery, "developing", "one piece of shown work is not Demonstrated (needs two days), and never Achieved");
  assert.ok(!JSON.stringify(p).includes("interpersonal conventions"), "no NESA wording anywhere in the record");

  // All-time tracker snapshot for the printable record.
  assert.equal(p.progress.available, true);
  assert.equal(p.progress.as_at, "2026-10-14");
  const engP = p.progress.areas.find((a) => a.learning_area === "English");
  assert.ok(engP.total > 2 && engP.counts.developing >= 1 && engP.counts.achieved === 0);
  assert.equal(p.progress.totals.counts.achieved, 0, "nothing is Achieved without a parent confirmation");
  assert.ok(p.progress.needs_evidence.some((n) => n.code === "EN2-OLC-01"));
  assert.equal(p.curriculum_source.url, "https://curriculum.nsw.edu.au/");

  const eng = p.summary.areas.find((a) => a.learning_area === "English");
  assert.equal(eng.entries, 2);
  assert.equal(p.summary.areas.find((a) => a.learning_area === "Science and Technology").minutes, 90);
  assert.deepEqual(p.summary.not_yet_evidenced.sort(), ["Creative Arts", "HSIE", "Mathematics"]);

  const ranged = await buildPortfolio(db, "f1", "s-f1", { from: "2026-08-10", to: "2026-09-05", now: NOW });
  assert.deepEqual(ranged.entries.map((e) => e.id), ["n1", "le1"]);
});

test("parent-approved reading records appear in state-aware evidence, while unapproved child entries do not", async () => {
  const db = makeDb();
  family(db, "fr", "ACTIVE_MONTHLY", "VIC");
  family(db, "other", "ACTIVE_MONTHLY", "QLD");
  const add = (id, role, date, fam = "fr") => db.raw.prepare(
    "INSERT INTO reading_log (id,family_id,student_id,title,author,read_date,duration_minutes,pages_read,reading_mode,comprehension_notes,parent_note,logged_by,logged_role,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
  ).run(id, fam, `s-${fam}`, `Book ${id}`, "A Writer", date, 25, 14, "independent", "Explained the main character's motivation", "Improved fluency", `u-${fam}`, role, T);
  add("approved", "parent", "2026-09-01");
  add("unreviewed", "child", "2026-09-02");
  add("outofperiod", "parent", "2026-10-10");
  add("unrelated", "parent", "2026-09-01", "other");

  const p = await buildPortfolio(db, "fr", "s-fr", { from: "2026-09-01", to: "2026-09-30", now: NOW });
  assert.equal(p.total, 1, "unapproved, out-of-range, and other-family reading must stay out");
  assert.equal(p.entries[0].kind, "reading");
  assert.equal(p.entries[0].learning_area, "English");
  assert.equal(p.entries[0].date, "2026-09-01");
  assert.match(p.entries[0].work, /main character's motivation/);
  assert.match(p.entries[0].work, /Pages read: 14/);
  assert.match(p.entries[0].parent_comment, /Improved fluency/);
  assert.deepEqual(p.entries[0].outcomes, [], "reading logs are not auto-labelled with invented outcomes");
  assert.equal(p.summary.areas.find(a => a.learning_area === "English").entries, 1);
  assert.ok(!JSON.stringify(p).includes("unreviewed"));
  assert.ok(!JSON.stringify(p).includes("unrelated"));
});

test("preview shows the summary but only one detailed entry; other families cannot read", async () => {
  const db = makeDb();
  family(db, "f2", "FREE_PREVIEW");
  lessonWork(db, "f2", 3, "2026-10-01T01:00:00Z", [{ code: "EN2-OLC-01", accepted: true }]);
  lessonWork(db, "f2", 4, "2026-10-02T01:00:00Z", []);
  const p = await buildPortfolio(db, "f2", "s-f2", { now: NOW });
  assert.equal(p.entries.length, 1);
  assert.equal(p.total, 2);
  assert.equal(p.limited, true);
  assert.equal(p.summary.areas.find((a) => a.learning_area === "English").entries, 2);
  family(db, "f3", "ACTIVE_MONTHLY");
  assert.equal(await buildPortfolio(db, "f3", "s-f2", { now: NOW }), null);
});

test("summarise lists areas outside the stage's expected areas after the expected ones", () => {
  const s = summarise([{ date: "2026-01-01", learning_area: "Other", outcomes: [], duration_minutes: null }], "S2");
  assert.equal(s.areas.at(-1).learning_area, "Other");
  assert.equal(s.areas.at(-1).expected, false);
});

test("a Victorian family's record uses Victorian learning areas and invents no codes", async () => {
  const db = makeDb();
  family(db, "fv", "ACTIVE_MONTHLY", "VIC");
  lessonWork(db, "fv", 9, "2026-09-01T01:00:00Z", [{ code: "EN2-OLC-01", accepted: true }], "HSIE");
  db.raw.prepare("INSERT INTO evidence_notes (id,family_id,student_id,title,learning_area,notes,occurred_on,file_ids,created_at) VALUES (?,?,?,?,?,?,?,?,?)")
    .run("nv", "fv", "s-fv", "Swimming", "PDHPE", "", "2026-09-02", "[]", T);
  const p = await buildPortfolio(db, "fv", "s-fv", { now: NOW });
  assert.equal(p.framework, "Victorian Curriculum F–10 Version 2.0");
  assert.deepEqual(p.entries.map((e) => e.learning_area), ["Humanities", "Health and Physical Education"]);
  assert.ok(p.summary.not_yet_evidenced.includes("The Arts"));
  assert.ok(!p.summary.areas.some((a) => a.learning_area === "HSIE"));
  assert.equal(p.student.stage_name, "");
  assert.equal(p.jurisdiction_name, "Victoria");
  assert.ok(!JSON.stringify(p.entries).includes("EN2-OLC-01"), "NSW codes shown to a Victorian family");
  assert.deepEqual(p.entries[0].outcomes, [], "a NSW outcome is dropped, not passed off as plain-language Victorian wording");
  assert.equal(p.progress.available, true, "Victoria has its own verified-source PARTIAL catalogue");
  assert.ok(p.progress.available && p.jurisdiction_name === "Victoria", "Victorian portfolio uses the state-specific catalogue");
  assert.ok(!JSON.stringify(p.progress).includes("EN2-OLC-01"), "no historic NSW code may leak into VCAA progress");
});

test("a family that hasn't chosen a state gets the Australian Curriculum, not NSW", async () => {
  const db = makeDb();
  family(db, "fu", "ACTIVE_MONTHLY", null);
  lessonWork(db, "fu", 7, "2026-09-01T01:00:00Z", [{ code: "EN2-OLC-01", accepted: true }], "PDHPE");
  const p = await buildPortfolio(db, "fu", "s-fu", { now: NOW });
  assert.equal(p.jurisdiction, null);
  assert.equal(p.framework, "Australian Curriculum Version 9.0");
  assert.equal(p.entries[0].learning_area, "Health and Physical Education");
  assert.ok(p.expected_areas.includes("The Arts") && !p.expected_areas.includes("HSIE"));
  assert.ok(!JSON.stringify(p).includes("EN2-OLC-01"));
});

test("a Queensland family's record keeps verified AC9 codes, drops NSW codes and never prints content descriptions", async () => {
  const db = makeDb();
  family(db, "fq", "ACTIVE_MONTHLY", "QLD");
  lessonWork(db, "fq", 11, "2026-09-03T01:00:00Z", [{ code: "AC9M3N01", mark: "shown" }, { code: "MA2-RN-01", mark: "shown" }], "Mathematics", ["AC9M3N01", "MA2-RN-01"]);
  const p = await buildPortfolio(db, "fq", "s-fq", { now: NOW });
  const codes = p.entries[0].outcomes.map((o) => o.code);
  assert.deepEqual(codes, ["AC9M3N01"], "only the family's own framework codes appear");
  assert.equal(p.entries[0].outcomes[0].description, "");
  assert.equal(p.progress.available, true);
  assert.match(p.progress.framework, /Australian Curriculum v9/);
  assert.equal(p.summary.outcomes.find((o) => o.code === "AC9M3N01").mastery, "developing");
  assert.ok(!JSON.stringify(p).includes("MA2-RN-01"));
});
