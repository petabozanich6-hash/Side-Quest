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

test("every Victorian code found on the VCAA pages has a summary", async () => {
  const { VIC_SOURCE_VERIFIED_IDS } = await import("../src/data/vic-source-ids.ts");
  // VC2CCPACP3 is listed in the import but does not appear on any VCAA page we could read.
  const missing = VIC_SOURCE_VERIFIED_IDS.map((o) => o.code.trim()).filter((c) => !summaryFor(c) && c !== "VC2CCPACP3");
  assert.deepEqual(missing, []);
});

test("every NSW K-10 code from NESA has a summary and is in the NSW catalogue", async () => {
  const { NSW_K10_CODES } = await import("../src/data/nsw-k10-codes.ts");
  const nsw = catalogueFor("NSW");
  const upper = new Set(nsw.outcomes.map((o) => o.code.toUpperCase()));
  assert.ok(NSW_K10_CODES.length >= 1800);
  assert.deepEqual(NSW_K10_CODES.filter((r) => !summaryFor(r.code)).map((r) => r.code), []);
  assert.deepEqual(NSW_K10_CODES.filter((r) => !upper.has(r.code.toUpperCase())).map((r) => r.code), []);
  assert.ok(NSW_K10_CODES.every((r) => !("description" in r)), "codes only, no NESA wording");
  assert.equal(summaryFor("ENe-OLC-01"), summaryFor("ENE-OLC-01"), "older lower-case spelling still finds its summary");
});

test("NSW Life Skills and not-yet-current syllabuses stay out of a child's default program", async () => {
  const { programFor } = await import("../src/outcomeTracker.ts");
  const nsw = catalogueFor("NSW");
  const mainstream = programFor(nsw, { stage: "S4", year_level: "7", extra: "{}" });
  const lifeSkills = programFor(nsw, { stage: "S4", year_level: "7", extra: JSON.stringify({ life_skills: true }) });
  const ls = nsw.outcomes.filter((o) => o.pathway === "Life Skills" && o.status === "current");
  assert.ok(ls.length > 100);
  assert.ok(!ls.some(mainstream.includes), "no Life Skills outcomes for a mainstream Year 7 child");
  assert.ok(ls.every(lifeSkills.includes), "Life Skills outcomes (Stages 4-5) for a Life Skills Year 7 child");
  assert.ok(!nsw.outcomes.filter((o) => o.status === "upcoming").some(lifeSkills.includes), "syllabuses starting 2027+ are not in the 2026 program");
  const ht = nsw.byCode.get("HT4-1");
  assert.match(outcomeInfo(ht).official_url, /^https:\/\/www\.nsw\.gov\.au\//);
});
