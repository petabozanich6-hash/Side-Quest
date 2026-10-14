import { test } from "node:test";
import assert from "node:assert/strict";
import { AC9_OUTCOMES } from "../src/data/ac9-outcomes.ts";
import { catalogueFor } from "../src/outcomeTracker.ts";

test("ACARA MRAC import has unique real AC9 identifiers, descriptions and valid year bands", () => {
  assert.equal(AC9_OUTCOMES.length, 1395);
  const seen = new Set();
  for (const row of AC9_OUTCOMES) {
    assert.match(row.code, /^AC9[A-Z0-9]+$/);
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
    assert.equal(catalogue.outcomes.length, 1395);
  }
});
test("NSW catalogue remains separate and VIC/WA do not silently inherit AC9", () => {
  assert.equal(catalogueFor("NSW").framework, "NSW");
  for (const j of ["VIC", "WA"]) assert.equal(catalogueFor(j).available, false);
});
test("AC9 reference codes belong to the appropriate learning stage", () => {
  const c = catalogueFor("QLD");
  assert.equal(c.available, true);
  assert.equal(c.outcomes.find(x => x.code === "AC9ADA10C01")?.stage, "S5");
  assert.ok(c.outcomes.some(x => x.stage === "ES1"));
  assert.ok(c.outcomes.some(x => x.stage === "S2"));
});
