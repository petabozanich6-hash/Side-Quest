import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { makeDb } from "./fakeD1.mjs";
import { trialEndFrom } from "../src/entitlements.ts";
import * as ap from "../src/aiPlan.ts";
import { getFamilyJurisdiction as getJurisdiction, setFamilyJurisdiction } from "../src/data/jurisdictions.ts";
import { JURISDICTIONS, asJurisdiction, planAreas, levelFor, areaName } from "../src/data/planJurisdictions.ts";
import { buildPlanContent } from "../src/data/planBuilder.ts";

const NOW = new Date("2026-10-14T00:00:00Z");
let n = 0;
function family(db, { plan = "ACTIVE_MONTHLY", jur = "VIC" } = {}) {
  const fam = `pf${++n}`;
  const t = NOW.toISOString();
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at,plan_period_end,jurisdiction) VALUES (?,?,?,?,?,?,?,?,?)")
    .run(fam, "Fam", `u${fam}`, t, plan, t, trialEndFrom(t), "2026-11-14T00:00:00Z", jur);
  return fam;
}
function kid(db, fam, { stage = "S2", year = "3", electives = "[]" } = {}) {
  const id = `ps${++n}`;
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at,electives) VALUES (?,?,?,?,?,?,?,?,?)")
    .run(id, fam, "Matilda Jones", `m${id}`, "x", stage, year, NOW.toISOString(), electives);
  return id;
}
function planFor(db, fam, sid, over = {}) {
  const id = `pl${++n}`;
  db.raw.prepare("INSERT INTO learning_plans (id,family_id,student_id,title,period_start,period_end,interests,subject_focus,teaching_approach,notes,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
    .run(id, fam, sid, "Term 1", "2027-01-27", "2027-04-02", JSON.stringify(["horses", "cooking"]), JSON.stringify(over.focus || []), "project-based", over.notes || "", "draft", NOW.toISOString());
  return id;
}

/** A stand-in model: answers the frame prompt and the area prompts in the requested shape. */
function stubAi({ code = null, dropArea = null, frame = true, throws = false } = {}) {
  const calls = [];
  return {
    calls,
    run: async (model, input) => {
      calls.push(input);
      if (throws) throw new Error("down");
      const user = input.messages[1].content;
      if (user.includes("whole-of-program sections")) {
        if (!frame) return { response: "sorry" };
        const reqs = [...user.matchAll(/^- (.+)$/gm)].map((m) => m[1]);
        return { response: JSON.stringify({
          overview: "{child} is a curious learner. This term builds steadily.", educational_philosophy: "Hands-on and explicit.",
          learning_environment: "At the kitchen table each morning; weekly co-op for social time.", weekly_rhythm: "Mon-Thu mornings.",
          assessment_approach: "Dated samples.", resources_overview: "Library books and Side-Quest lessons.", review_schedule: "Week 5 and week 10.",
          assessor_notes: "Samples available.", requirements_map: reqs.slice(0, 3).map((r) => ({ requirement: r, how_addressed: "See overview." })),
          parent_to_complete: ["Add {child}'s date of birth"],
        }) };
      }
      const list = /in this order: (.+)\.\n/.exec(user)[1].split("; ");
      return { response: JSON.stringify({ learning_areas: list.filter((a) => a !== dropArea).map((a) => ({
        area: a, goals: ["Goal one for {child}", "Goal two"], topics: ["Topic"], curriculum_focus: "Focus.",
        outcome_codes: code ? [code, "MADE-UP-99"] : ["VC2E3LY01"], teaching_methods: ["Modelling"], interest_hooks: ["Horses"],
        sample_activities: ["Activity"], assessment_tasks: ["Task"], resources: ["Picture books"], evidence_approach: "Photos.",
      })) }) };
    },
  };
}
const build = (db, fam, pid, ai) => ap.buildPlanWithAi(db, ai, { familyId: fam, userId: "u", planId: pid }, NOW);

test("jurisdiction reads and writes work on a database without migration 0054 (the column is added at runtime)", async () => {
  const old = makeDb("0054");
  old.raw.prepare("INSERT INTO families (id,name,owner_id,created_at) VALUES ('a','A','u','2026-01-01')").run();
  assert.equal(await getJurisdiction(old, "a"), null);
  await setFamilyJurisdiction(old, "a", "QLD");
  assert.equal(await getJurisdiction(old, "a"), "QLD");
  assert.equal(asJurisdiction(" tas "), "TAS");
  assert.equal(asJurisdiction("NZ"), null);
});

test("each jurisdiction gets its own learning areas and year names", () => {
  assert.equal(Object.keys(JURISDICTIONS).filter(code => code !== "OTHER").length, 8);
  assert.equal(JURISDICTIONS.OTHER.outcomeCodes, false);
  assert.deepEqual(planAreas(JURISDICTIONS.NSW, { stage: "S2", year_level: "3" }).areas.length, 6);
  assert.equal(planAreas(JURISDICTIONS.VIC, { stage: "S2" }).areas.length, 8);
  assert.ok(planAreas(JURISDICTIONS.TAS, { stage: "S2" }).areas.includes("Literacy"));
  const sec = planAreas(JURISDICTIONS.NSW, { stage: "S4", year_level: "7" }, [], ["English", "Visual Arts", "Music"]);
  assert.deepEqual(sec.areas.slice(-2), ["Visual Arts", "Music"]);
  assert.ok(planAreas(JURISDICTIONS.NSW, { stage: "S4", year_level: "7" }).note.includes("not chosen"));
  assert.equal(levelFor(JURISDICTIONS.QLD, { year_level: "K" }), "Prep");
  assert.equal(levelFor(JURISDICTIONS.WA, { stage: "ES1" }), "Pre-primary");
  assert.equal(levelFor(JURISDICTIONS.SA, { stage: "S3" }), "Years 5-6");
  assert.equal(areaName(JURISDICTIONS.VIC, "PDHPE"), "Health and Physical Education");
});

test("AI plans: free preview and expired families are refused before any AI call", async () => {
  const db = makeDb();
  for (const plan of ["FREE_PREVIEW", "PREVIEW_EXPIRED"]) {
    const fam = family(db, { plan });
    const pid = planFor(db, fam, kid(db, fam));
    const ai = stubAi();
    const r = await build(db, fam, pid, ai);
    assert.equal(r.code, "UPGRADE_REQUIRED");
    assert.equal(ai.calls.length, 0);
  }
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM ai_usage").get().n, 0);
});

test("AI plans: a family must choose a state or territory first", async () => {
  const db = makeDb();
  const fam = family(db, { jur: null });
  const ai = stubAi();
  const r = await build(db, fam, planFor(db, fam, kid(db, fam)), ai);
  assert.equal(r.code, "JURISDICTION_REQUIRED");
  assert.equal(ai.calls.length, 0);
});

test("AI plans: a Victorian plan covers the eight areas, keeps the child's name away from the model and adds no codes", async () => {
  const db = makeDb();
  const fam = family(db, { jur: "VIC" });
  const pid = planFor(db, fam, kid(db, fam));
  const ai = stubAi();
  const r = await build(db, fam, pid, ai);
  assert.ok(r.ok, JSON.stringify(r));
  const c = r.content;
  assert.equal(c.jurisdiction, "VIC");
  assert.equal(c.generated_by, "ai");
  assert.deepEqual(c.learning_areas.map((a) => a.area), JURISDICTIONS.VIC.areas);
  assert.ok(c.learning_areas.every((a) => a.indicative_outcome_codes.length === 0), "VIC has no code list, so none may appear");
  assert.ok(c.overview.startsWith("Matilda is"));
  assert.ok(c.learning_areas[0].goals[0].endsWith("Matilda"));
  for (const call of ai.calls) {
    const text = JSON.stringify(call);
    assert.ok(!text.includes("Matilda") && !text.includes("Jones"), "child's name must not be sent");
    assert.ok(text.includes("Victoria") && text.includes("VRQA"));
  }
  assert.equal(c.requirements_map.length, JURISDICTIONS.VIC.requirements.length);
  assert.ok(c.requirements_map.some((x) => x.needs_parent), "unanswered requirements stay visible");
  assert.ok(r.warnings.some((w) => w.includes("still need your input")));
  assert.equal(c.notes_heading, "Notes for a VRQA review");
  assert.equal(db.raw.prepare("SELECT status FROM ai_usage WHERE kind='learning_plan'").get().status, "ok");
});

test("AI plans: NSW plans keep only outcome codes from the list Side-Quest holds", async () => {
  const db = makeDb();
  const fam = family(db, { jur: "NSW" });
  const pid = planFor(db, fam, kid(db, fam, { stage: "S2", year: "3" }));
  const lists = ap.outcomeLists(JURISDICTIONS.NSW, "S2", ["English"]);
  const real = lists.English[0].code;
  const r = await build(db, fam, pid, stubAi({ code: real }));
  assert.ok(r.ok, JSON.stringify(r));
  const english = r.content.learning_areas.find((a) => a.area === "English");
  assert.deepEqual(english.indicative_outcome_codes, [real]);
  assert.ok(!JSON.stringify(r.content).includes("MADE-UP-99"));
});

test("AI plans: a missing area is repaired once, else left blank and flagged", async () => {
  const db = makeDb();
  const fam = family(db, { jur: "SA" });
  const pid = planFor(db, fam, kid(db, fam));
  const ai = stubAi({ dropArea: "Languages" });
  const r = await build(db, fam, pid, ai);
  assert.ok(r.ok);
  const lang = r.content.learning_areas.find((a) => a.area === "Languages");
  assert.equal(lang.needs_parent, true);
  assert.ok(r.warnings.some((w) => w.includes("Languages")));
  assert.equal(ai.calls.length, 4, "frame + two halves + one repair");
});

test("AI plans: failures use no allowance, and the daily cap applies", async () => {
  const db = makeDb();
  const fam = family(db, { jur: "QLD" });
  const pid = planFor(db, fam, kid(db, fam));
  assert.equal((await build(db, fam, pid, stubAi({ throws: true }))).code, "AI_FAILED");
  assert.equal((await build(db, fam, pid, stubAi({ frame: false }))).code, "AI_FAILED");
  assert.equal((await build(db, fam, pid, undefined)).code, "AI_UNAVAILABLE");
  for (let i = 0; i < ap.PLAN_LIMITS.perDay; i++) assert.ok((await build(db, fam, pid, stubAi())).ok);
  assert.equal((await build(db, fam, pid, stubAi())).code, "AI_QUOTA");
  const internal = family(db, { plan: "INTERNAL", jur: "QLD" });
  const ipid = planFor(db, internal, kid(db, internal));
  for (let i = 0; i <= ap.PLAN_LIMITS.perDay; i++) assert.ok((await build(db, internal, ipid, stubAi())).ok);
});

test("free template uses the family's jurisdiction and drops NSW wording and codes elsewhere", async () => {
  const db = makeDb();
  const plan = { interests: ["horses"], subject_focus: [], period_start: "2027-01-27", period_end: "2027-04-02", student_id: "x" };
  const student = { name: "Matilda", stage: "S2", year_level: "3" };
  const vic = await buildPlanContent(db, plan, student, JURISDICTIONS.VIC);
  const text = JSON.stringify(vic);
  assert.ok(!/\bNSW\b|\bNESA\b|[Ss]yllabus outcome/.test(text), text.match(/.{40}(\bNSW\b|\bNESA\b|[Ss]yllabus outcome).{40}/)?.[0]);
  assert.equal(vic.jurisdiction, "VIC");
  assert.ok(vic.learning_areas.some((a) => a.area === "Health and Physical Education"));
  assert.ok(vic.learning_areas.every((a) => a.indicative_outcome_codes.length === 0));
  const nsw = await buildPlanContent(db, plan, student, JURISDICTIONS.NSW);
  assert.ok(nsw.learning_areas.some((a) => a.area === "PDHPE"));
});
