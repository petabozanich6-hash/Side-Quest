import test from "node:test";
import assert from "node:assert/strict";
import { makePet, stageForXp, previousStageForXp, CARE_STAGES, needsFeed } from "../src/data/pets.ts";
import { newPet, swapPet, questView } from "../src/data/petQuests.ts";

test("new pet growth takes sustained XP and retains the 60 XP hatching threshold", () => {
  assert.deepEqual(CARE_STAGES.map((x) => x[0]), [0,60,600,1800,4500,9000]);
  assert.equal(stageForXp(59,false).level_name, "Egg");
  assert.equal(stageForXp(61,true).level_name, "Hatchling");
  assert.equal(stageForXp(599,true).level_name, "Hatchling");
  assert.equal(stageForXp(600,true).level_name, "Youngling");
  assert.equal(stageForXp(1799,true).level_name, "Youngling");
  assert.equal(stageForXp(1800,true).level_name, "Companion");
  assert.equal(stageForXp(9000,true).level_name, "Legend");
});

test("existing pet XP and achieved stage are grandfathered without fast-forwarding new pets", () => {
  const old = previousStageForXp(477,true);
  assert.equal(old, "Youngling");
  const saved = stageForXp(477,true,old);
  assert.equal(saved.xp,477);
  assert.equal(saved.level_name,"Youngling");
  assert.equal(saved.next_xp,1800);
  assert.equal(stageForXp(477,true).level_name,"Hatchling");
  assert.equal(stageForXp(1200,true,previousStageForXp(1200,true)).level_name,"Hero");
  assert.equal(stageForXp(2400,true,previousStageForXp(2400,true)).level_name,"Legend");
});

test("pets keep individual growth floors when switching between animals", () => {
  const p = makePet("student","family","Sprout","turtle");
  p.hatched = true; p.xp = 477; p.extra.growth_floor = "Youngling";
  p.extra.trophies = Array.from({ length: 10 }, (_,i) => ({word: "word"+i}));
  assert.equal(newPet(p,"fox","Clover").ok,true);
  assert.equal(p.xp,0);
  assert.equal(p.extra.growth_floor,null);
  assert.equal(swapPet(p,0).ok,true);
  assert.equal(p.xp,477);
  assert.equal(p.extra.growth_floor,"Youngling");
  assert.equal(questView(p,new Date("2026-10-20T08:00:00Z")).form,"Youngling");
});

test("new pets start on the new curve without inheriting old minimum levels", () => {
  const p = makePet("student","family","Nibbles","owl");
  assert.equal(p.extra.growth_version,2);
  assert.equal(p.extra.growth_floor,undefined);
});

test("pet feeding cooldown still parses persisted dates after growth changes", () => {
  const now = new Date("2026-10-20T12:00:00Z");
  assert.equal(needsFeed({ last_fed: "2026-10-20T11:00:00Z" }, now), false);
  assert.equal(needsFeed({ last_fed: "2026-10-20T01:00:00Z" }, now), true);
});
