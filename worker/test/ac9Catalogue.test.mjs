import { test } from "node:test";
import assert from "node:assert/strict";
import { AC9_OUTCOMES } from "../src/data/ac9-outcomes.ts";
import { catalogueFor, programFor } from "../src/outcomeTracker.ts";
import { FRAMEWORKS } from "../src/data/jurisdictions.ts";
import { poolFor } from "../src/questOutcomes.ts";

test("ACARA MRAC import has unique real AC9 identifiers, descriptions and valid year bands", () => {
  assert.ok(AC9_OUTCOMES.length >= 2678, "Official MRAC/2024/04 import must not lose any eight-area descriptors");
  assert.ok(AC9_OUTCOMES.filter((o) => o.learning_area === "Languages").length >= 1283, "language subjects/pathways missing");
  assert.ok(AC9_OUTCOMES.filter((o) => o.code.startsWith("ACL9")).length >= 42, "classical languages silently omitted");
  const seen = new Set();
  for (const row of AC9_OUTCOMES) {
    assert.match(row.code, /^(?:AC9|ACL9)[A-Z0-9]+$/);
    assert.ok(row.description?.trim());
    assert.ok(Number.isInteger(row.from) && Number.isInteger(row.to) && row.from >= 0 && row.to <= 10 && row.from <= row.to);
    assert.ok(!seen.has(row.code), "duplicate: " + row.code);
    seen.add(row.code);
  }
});
test("five jurisdictions use the same correctly named AC9 framework without claiming local syllabus equivalence", () => {
  for (const j of ["QLD", "SA", "TAS", "ACT", "NT"]) {
    const catalogue = catalogueFor(j);
    assert.equal(catalogue.available, true);
    assert.equal(catalogue.framework, "AC9");
    assert.match(catalogue.name, /partial/);
    assert.equal(catalogue.outcomes.length, AC9_OUTCOMES.length);
  }
});
test("NSW, VCAA and SCSA state catalogues remain distinct", () => {
  assert.equal(catalogueFor("NSW").framework, "NSW");
  assert.equal(catalogueFor("VIC").framework, "VIC");
  assert.ok(catalogueFor("VIC").outcomes.every((o) => /^VC2/.test(o.code) && !o.description), "Victoria: official codes only, no VCAA wording stored");
  assert.ok(!catalogueFor("VIC").byCode.has("VC2MFAN01"), "pre-Foundation levels are not mistaken for Foundation");
  assert.equal(catalogueFor("WA").framework, "WA");
});
test("AC9 reference codes belong to the appropriate learning stage", () => {
  const c = catalogueFor("QLD");
  assert.equal(c.available, true);
  assert.equal(c.outcomes.find(x => x.code === "AC9ADA10C01")?.stage, "S5");
  assert.ok(c.outcomes.some(x => x.stage === "ES1"));
  assert.ok(c.outcomes.some(x => x.stage === "S2"));
});

test("an AC9 language elective matches ONLY the language selected by the family", () => {
  const source = catalogueFor("QLD");
  assert.equal(source.available, true);
  const japan = { code: "AC9LJA8C01", stage: "S4", from: 7, to: 8, learning_area: "Languages", subject: "Japanese", description: "", source: "fixture" };
  const french = { ...japan, code: "AC9LFR8C01", subject: "French" };
  const selected = programFor(source, { stage: "S4", year_level: "Year 8", extra: { electives: [{ name: "Japanese", learning_area: "Languages" }] } });
  assert.equal(selected.includes(japan), true);
  assert.equal(selected.includes(french), false);
  const broad = programFor(source, { stage: "S4", year_level: "Year 8", extra: { electives: [{ name: "Languages", learning_area: "Languages" }] } });
  assert.equal(broad.includes(japan), true);
  assert.equal(broad.includes(french), true);
  const unknown = programFor(source, { stage: "S4", year_level: "Year 8", extra: { electives: [{ name: "Polish", learning_area: "Languages" }] } });
  assert.equal(unknown.includes(japan), false, "unimported language must not silently map to another one");
});

test("selected Chinese learner pathway must not mix distinct official pathway codes", () => {
  const catalogue = catalogueFor("QLD");
  assert.equal(catalogue.available, true);
  const second = catalogue.outcomes.find((o) => o.subject === "Chinese" && o.to === 8 && o.pathway?.includes("Second-Language"));
  const background = catalogue.outcomes.find((o) => o.subject === "Chinese" && o.to === 8 && o.pathway?.includes("Background-Language"));
  assert.ok(second && background, "the official import must retain separate Chinese pathway metadata");
  const plan = programFor(catalogue, { stage: "S4", year_level: "Year 8", extra: { electives: [{ name: "Chinese (Second Language Learner)", learning_area: "Languages" }] } });
  assert.equal(plan.includes(second), true);
  assert.equal(plan.includes(background), false, "a different learner pathway cannot be silently assigned");
});


test("VIC and WA expose state-specific source catalogues as references, not as unavailable or compliance guarantees", () => {
  for (const state of ["VIC", "WA"]) {
    assert.equal(FRAMEWORKS[state].codes, "reference");
    const catalogue = catalogueFor(state);
    assert.equal(catalogue.available, true);
    assert.equal(catalogue.framework, state);
    assert.ok(catalogue.outcomes.length > 100, state + " source-derived catalogue must remain loaded");
    assert.ok(catalogue.outcomes.every((o) => Boolean(o.official_url)), "every state identifier needs an official source");
  }
});

test("VIC and WA book matching separates History from Geography within Humanities", () => {
  for (const state of ["VIC", "WA"]) {
    const cat = catalogueFor(state);
    const hist = poolFor(cat, { learning_area: "History" }, 3);
    const geo = poolFor(cat, { learning_area: "Geography" }, 3);
    assert.ok(hist.length > 0, state + " should have Year 3 History identifiers");
    assert.ok(geo.length > 0, state + " should have Year 3 Geography identifiers");
    const describe = (o) => state === "VIC" ? o.subject || "" : o.strand || "";
    assert.ok(hist.every((o) => /history/i.test(describe(o))), state + " History book must not map Geography strand");
    assert.ok(geo.every((o) => /geography/i.test(describe(o))), state + " Geography book must not map History strand");
  }
});
