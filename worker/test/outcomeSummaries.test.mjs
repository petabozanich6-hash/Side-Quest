import { test } from "node:test";
import assert from "node:assert/strict";
import { AC9_OUTCOMES } from "../src/data/ac9-outcomes.ts";
import { summaryFor, summaryCount } from "../src/data/outcomeSummaries.ts";
import { catalogueFor, outcomeInfo } from "../src/outcomeTracker.ts";

test("every AC9 outcome code has a short plain-English summary for parents", () => {
  const missing = AC9_OUTCOMES.filter((o) => !summaryFor(o.code)).map((o) => o.code);
  assert.deepEqual(missing, []);
  assert.ok(summaryCount() >= AC9_OUTCOMES.length);
});

test("summaries are short and are not the official wording", () => {
  for (const o of AC9_OUTCOMES) {
    const s = summaryFor(o.code);
    assert.ok(s.length <= 220, `${o.code} summary too long`);
    assert.notEqual(s.toLowerCase().replace(/\W/g, ""), String(o.description).toLowerCase().replace(/\W/g, ""), `${o.code} copies the official text`);
  }
});

test("the tracker returns the summary with each outcome", () => {
  const o = catalogueFor("QLD").outcomes.find((x) => x.code === "AC9M3N02");
  assert.ok(o, "AC9M3N02 should be in the AC9 catalogue");
  assert.match(outcomeInfo(o).summary, /fraction/i);
  assert.equal(summaryFor("NOT-A-CODE"), "");
});
