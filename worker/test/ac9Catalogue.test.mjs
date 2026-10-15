import { test } from "node:test";
import assert from "node:assert/strict";
import { AC9_OUTCOMES } from "../src/data/ac9-outcomes.ts";
import { catalogueFor, programFor } from "../src/outcomeTracker.ts";

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
test("NSW and VCAA state catalogues remain distinct, WA is not imported", () => {
  assert.equal(catalogueFor("NSW").framework, "NSW");
  assert.equal(catalogueFor("VIC").framework, "VIC");
  assert.equal(catalogueFor("VIC").outcomes.length, 3723);
  assert.equal(catalogueFor("WA").available, false);
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
