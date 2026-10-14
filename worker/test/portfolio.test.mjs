import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { buildPortfolio, summarise, outcomeFrom } from "../src/portfolio.ts";
import { trialEndFrom } from "../src/entitlements.ts";

const NOW = new Date("2026-10-14T00:00:00Z");
const T = NOW.toISOString();

function family(db, fam, plan) {
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at) VALUES (?,?,?,?,?,?,?)").run(fam, "Fam", `u-${fam}`, T, plan, T, trialEndFrom(T));
  db.raw.prepare("INSERT INTO users (id,family_id,email,name,created_at) VALUES (?,?,?,?,?)").run(`u-${fam}`, fam, `${fam}@example.com`, "Pat Parent", T);
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at) VALUES (?,?,?,?,?,?,?,?)").run(`s-${fam}`, fam, "Mia", `mia-${fam}`, "x", "S2", "Year 3", T);
}
function lessonWork(db, fam, id, reviewed, mappings, area = "English", codes = []) {
  const snap = JSON.stringify({ title: `Lesson ${id}`, learning_area: area, year_level: "Year 3", outcome_codes: codes });
  db.raw.prepare("INSERT INTO assignments (id,family_id,student_id,lesson_id,status,created_at,lesson_snapshot) VALUES (?,?,?,?,?,?,?)").run(`a${id}`, fam, `s-${fam}`, "l1", "completed", T, snap);
  db.raw.prepare("INSERT INTO submissions (id,family_id,assignment_id,student_id,lesson_id,response_text,status,parent_feedback,next_step,outcome_mappings,reviewed_at,submitted_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
    .run(`sub${id}`, fam, `a${id}`, `s-${fam}`, "l1", `My answer ${id}`, "demonstrated", "Well done", "Try longer texts", JSON.stringify(mappings), reviewed, reviewed);
}

test("outcomeFrom fills in syllabus wording and status", () => {
  const o = outcomeFrom({ code: "EN2-OLC-01", accepted: true }, "S2");
  assert.equal(o.learning_area, "English");
  assert.equal(o.status, "achieved");
  assert.ok(o.description.length > 10);
  assert.equal(outcomeFrom({ code: "EN2-OLC-01", accepted: false }, "S2").status, "working_towards");
  assert.equal(outcomeFrom({}, "S2"), null);
});

test("full record: every source, chronological, outcomes, coverage gaps", async () => {
  const db = makeDb();
  family(db, "f1", "ACTIVE_MONTHLY");
  lessonWork(db, "f1", 2, "2026-09-20T01:00:00Z", [{ code: "EN2-OLC-01", accepted: true }], "English", ["EN2-VOCAB-01"]);
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
  assert.equal(olc.status, "achieved", "progress from working towards to achieved");

  const eng = p.summary.areas.find((a) => a.learning_area === "English");
  assert.equal(eng.entries, 2);
  assert.equal(p.summary.areas.find((a) => a.learning_area === "Science and Technology").minutes, 90);
  assert.deepEqual(p.summary.not_yet_evidenced.sort(), ["Creative Arts", "HSIE", "Mathematics"]);

  const ranged = await buildPortfolio(db, "f1", "s-f1", { from: "2026-08-10", to: "2026-09-05", now: NOW });
  assert.deepEqual(ranged.entries.map((e) => e.id), ["n1", "le1"]);
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
  family(db, "fv", "ACTIVE_MONTHLY");
  db.raw.prepare("UPDATE families SET jurisdiction = 'VIC' WHERE id = 'fv'").run();
  lessonWork(db, "fv", 9, "2026-09-01T01:00:00Z", [], "HSIE");
  db.raw.prepare("INSERT INTO evidence_notes (id,family_id,student_id,title,learning_area,notes,occurred_on,file_ids,created_at) VALUES (?,?,?,?,?,?,?,?,?)")
    .run("nv", "fv", "s-fv", "Swimming", "PDHPE", "", "2026-09-02", "[]", T);
  const p = await buildPortfolio(db, "fv", "s-fv", { now: NOW });
  assert.equal(p.framework, "Victorian Curriculum F–10 Version 2.0");
  assert.deepEqual(p.entries.map((e) => e.learning_area), ["Humanities", "Health and Physical Education"]);
  assert.ok(p.summary.not_yet_evidenced.includes("The Arts"));
  assert.ok(!p.summary.areas.some((a) => a.learning_area === "HSIE"));
  assert.equal(p.student.stage_name, "");
});
