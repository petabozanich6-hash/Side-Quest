import { test } from "node:test";
import assert from "node:assert/strict";
import { NSW_OUTCOMES } from "../src/data/curriculum.ts";
import { NESA_2026_DIRECT_OUTCOME_CODES } from "../src/data/nesa-current-2026.ts";
import { catalogueFor, programFor } from "../src/outcomeTracker.ts";

test("Published 2026-current NESA subset augments NSW outcomes without duplicate keys", () => {
  assert.ok(NESA_2026_DIRECT_OUTCOME_CODES.length >= 390);
  assert.equal(new Set(NSW_OUTCOMES.map(x => x.code)).size, NSW_OUTCOMES.length);
  for (const code of ["EAV-11-01", "CT4-ADJ-01", "AL2-COM-01"]) {
    assert.ok(NSW_OUTCOMES.some(x => x.code === code), "Missing directly sourced "+code);
  }
  assert.equal(NSW_OUTCOMES.find(x => x.code === "EAV-11-01").stage, "S6");
  assert.equal(NSW_OUTCOMES.find(x => x.code === "CT4-ADJ-01").stage, "S4");
  assert.equal(NSW_OUTCOMES.find(x => x.code === "EAV-11-01").description, "", "do not reprint full NESA outcomes text");
});

test("NSW 11–12 English electives stay on the right school stage", () => {
  const cat=catalogueFor("NSW");
  assert.equal(cat.available,true);
  assert.match(cat.version,/PARTIAL/);
  const year11=programFor(cat,{stage:"S6",year_level:"Year 11",extra:{electives:[{name:"English Advanced",learning_area:"English"}]}});
  assert.ok(year11.includes(cat.byCode.get("EAV-11-01")));
  assert.equal(year11.includes(cat.byCode.get("CT4-ADJ-01")),false);
});
