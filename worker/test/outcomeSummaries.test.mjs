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

test("every WA Pre-primary to Year 10 code from SCSA has a summary and is in the WA catalogue", async () => {
  const { WA_CODES } = await import("../src/data/wa-codes.ts");
  const wa = catalogueFor("WA");
  assert.equal(wa.available, true);
  assert.equal(wa.framework, "WA");
  assert.ok(WA_CODES.length >= 3100);
  assert.deepEqual(WA_CODES.filter((r) => !summaryFor(r.code)).map((r) => r.code), []);
  assert.deepEqual(WA_CODES.filter((r) => !wa.byCode.has(r.code)).map((r) => r.code), []);
  assert.ok(WA_CODES.every((r) => !("description" in r)), "codes only, no SCSA wording");
  const info = outcomeInfo(wa.byCode.get("WA3MNAUN1"));
  assert.match(info.source_title, /Western Australian Curriculum/);
  assert.equal(info.level_label, "Year 3");
  assert.match(info.official_url, /^https:\/\/k10outline\.scsa\.wa\.edu\.au\//);
});

test("WA programs follow the child's school year, chosen subjects and ABLEWA stage", async () => {
  const { programFor } = await import("../src/outcomeTracker.ts");
  const wa = catalogueFor("WA");
  const y3 = programFor(wa, { stage: "S2", year_level: "3", extra: "{}" });
  assert.ok(y3.includes(wa.byCode.get("WA3MNAUN1")), "Year 3 maths for a Year 3 child");
  assert.ok(!y3.includes(wa.byCode.get("WA4MNAUN1")), "not Year 4 maths");
  assert.ok(!wa.outcomes.filter((o) => o.levels?.some((l) => l.startsWith("ABLEWA-"))).some(y3.includes), "ABLEWA only when chosen");
  const abl = programFor(wa, { stage: "S1", year_level: "1", extra: JSON.stringify({ subject_levels: { Mathematics: "ABLEWA B" } }) });
  assert.ok(abl.includes(wa.byCode.get("ACMNA001b")));
  assert.ok(!abl.includes(wa.byCode.get("WA1MNAUN1")));
  const y8 = programFor(wa, { stage: "S4", year_level: "8", extra: JSON.stringify({ electives: [
    { name: "History", learning_area: "HSIE" }, { name: "French", learning_area: "Languages" }, { name: "Music", learning_area: "Creative Arts" }] }) });
  assert.ok(y8.includes(wa.byCode.get("WA8HAKUH1")), "History strand of HASS");
  assert.ok(!y8.includes(wa.byCode.get("WA8HAKUG1")), "not Geography");
  const french = wa.outcomes.filter((o) => o.subject === "French" && o.from <= 8 && o.to >= 8);
  assert.ok(french.length && french.every(y8.includes), "French for a French course");
  assert.ok(!wa.outcomes.filter((o) => o.subject === "Japanese").some(y8.includes), "no other languages");
  assert.ok(wa.outcomes.filter((o) => o.subject === "Music" && o.from <= 8 && o.to >= 8).every(y8.includes));
  assert.ok(!wa.outcomes.filter((o) => o.subject === "Drama").some(y8.includes));
});
