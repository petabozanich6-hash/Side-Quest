import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { FRAMEWORKS, frameworkFor, normJurisdiction, getFamilyJurisdiction, setFamilyJurisdiction } from "../src/data/jurisdictions.ts";
import { mapLifeEvidenceWithAi, parseReply, buildPrompt, stripCodes, nswPool, LIFE_MAP_DEFAULTS } from "../src/lifeLearningAi.ts";
import { analyseLifeEvidence } from "../src/data/lifeEvidence.ts";

const NOW = new Date("2026-10-14T00:00:00Z");
const evidence = { title: "Grocery shop budget", description: "Had $40 to spend on fruit and veg. Compared unit prices per kg, added totals in her head and worked out the change.", duration_minutes: 45 };
const student = { name: "Ivy Smith", stage: "S2", year_level: "3" };
const fakeAi = (reply) => { const calls = []; return { calls, run: async (model, input) => { calls.push(input); if (reply instanceof Error) throw reply; return { response: JSON.stringify(reply) }; } }; };
function fam(db, id = "f1") {
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan) VALUES (?,?,?,?,?)").run(id, "Fam", "u1", NOW.toISOString(), "ACTIVE_MONTHLY");
  return id;
}

test("jurisdiction codes normalise and every state has a framework", () => {
  assert.equal(normJurisdiction("vic"), "VIC");
  assert.equal(normJurisdiction(" nt "), "NT");
  assert.equal(normJurisdiction("NZ"), null);
  assert.equal(Object.keys(FRAMEWORKS).filter(code => code !== "OTHER").length, 8);
  assert.equal(FRAMEWORKS.OTHER.codes, "none");
  assert.equal(frameworkFor("NSW").codes, "verified");
  assert.equal(frameworkFor("VIC").codes, "none");
  assert.equal(frameworkFor("WA").codes, "none", "WA state-specific catalogue remains unavailable");
  for (const j of ["QLD", "SA", "TAS", "ACT", "NT"]) assert.equal(frameworkFor(j).codes, "reference", j);
});

test("family jurisdiction is stored and read back", async () => {
  const db = makeDb();
  const f = fam(db);
  assert.equal(await getFamilyJurisdiction(db, f), null);
  await setFamilyJurisdiction(db, f, "QLD");
  assert.equal(await getFamilyJurisdiction(db, f), "QLD");
});

test("NSW: model can only pick from the verified list; unknown numbers are dropped", () => {
  const fw = FRAMEWORKS.NSW;
  const { pool, user } = buildPrompt(fw, evidence, student);
  assert.ok(pool.length > 5);
  assert.ok(user.includes("1. ["));
  const r = parseReply({ response: JSON.stringify({ summary: "Ivy budgeted.", activity_type: "Budgeting", matches: [{ n: 1, evidence: "Compared prices", confidence: "high" }, { n: 999, evidence: "x" }, { n: 1, evidence: "dup" }], more_evidence: "Add the receipt." }) }, fw, student, pool);
  assert.equal(r.mappings.length, 1);
  assert.equal(r.mappings[0].code, nswPool("S2")[0].code);
  assert.equal(r.mappings[0].code_status, "verified");
  assert.equal(r.mappings[0].accepted, null);
});

test("Other states: no codes attached, areas limited to that framework, codes stripped from text", () => {
  const fw = FRAMEWORKS.VIC;
  const { pool, system } = buildPrompt(fw, evidence, student);
  assert.equal(pool, null);
  assert.ok(system.includes("Victorian Curriculum F–10 Version 2.0"));
  assert.ok(system.includes("Year 3"));
  const r = parseReply({ response: JSON.stringify({ summary: "ok", activity_type: "Budgeting", matches: [
    { learning_area: "mathematics", outcome: "Uses money and adds amounts to find change (VC2M3N01)", evidence: "Worked out change from $40 AC9M3N06.", confidence: "high" },
    { learning_area: "HSIE", outcome: "Not a VIC area", evidence: "x", confidence: "low" },
    { learning_area: "Health and Physical Education", outcome: "Makes healthy food choices", evidence: "Chose fruit and veg", confidence: "medium" },
  ] }) }, fw, student, null);
  assert.equal(r.mappings.length, 2);
  assert.equal(r.mappings[0].learning_area, "Mathematics");
  assert.equal(r.mappings[0].code, undefined);
  assert.equal(r.mappings[0].code_status, "none");
  assert.ok(!/VC2|AC9/.test(r.mappings[0].description + r.mappings[0].evidence_statement));
  assert.equal(r.mappings[0].framework, "Victorian Curriculum 2.0");
});

test("stripCodes removes AC9, VC2 and NSW-style codes", () => {
  assert.equal(stripCodes("Adds money (AC9M3N06) and VC2M3N01 plus MA2-RN-01."), "Adds money and plus.");
});

test("AI mapping is metered, records failures without charging, and enforces limits", async () => {
  const db = makeDb();
  const f = fam(db);
  const ok = fakeAi({ summary: "Ivy budgeted.", activity_type: "Budgeting", matches: [{ learning_area: "Mathematics", outcome: "Adds money amounts and calculates change", evidence: "Worked out change from $40", confidence: "high" }], more_evidence: "Add a photo of the list." });
  const r = await mapLifeEvidenceWithAi(db, ok, { familyId: f, userId: "u1", framework: FRAMEWORKS.QLD, evidence, student }, NOW);
  assert.ok(r.ok);
  assert.equal(r.analysis.source, "ai");
  assert.equal(r.analysis.framework.jurisdiction, "QLD");
  assert.equal(r.analysis.mappings[0].framework, "Australian Curriculum v9");

  const bad = fakeAi(new Error("down"));
  const r2 = await mapLifeEvidenceWithAi(db, bad, { familyId: f, userId: "u1", framework: FRAMEWORKS.QLD, evidence, student }, NOW);
  assert.equal(r2.ok, false);
  assert.equal(r2.status, 502);
  const rows = db.raw.prepare("SELECT status FROM ai_usage WHERE kind = 'life_map' ORDER BY status").all().map((x) => x.status);
  assert.deepEqual(rows, ["failed", "ok"]);

  const r3 = await mapLifeEvidenceWithAi(db, ok, { familyId: f, userId: "u1", framework: FRAMEWORKS.QLD, evidence, student, limits: { ...LIFE_MAP_DEFAULTS, perFamilyDay: 1 } }, NOW);
  assert.equal(r3.ok, false);
  assert.equal(r3.status, 429);
});

test("Basic (free) suggestions use the family's framework and attach no codes outside NSW", async () => {
  const db = makeDb();
  const r = await analyseLifeEvidence(db, evidence, student, FRAMEWORKS.WA);
  assert.equal(r.source, "basic");
  assert.ok(r.mappings.length > 0);
  for (const m of r.mappings) {
    assert.equal(m.code, undefined);
    assert.ok(FRAMEWORKS.WA.learning_areas.primary.includes(m.learning_area), m.learning_area);
  }
});
