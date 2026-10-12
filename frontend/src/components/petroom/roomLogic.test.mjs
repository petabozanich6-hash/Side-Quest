import assert from "node:assert/strict";
import test from "node:test";
import {
  ACORN_AMOUNTS,
  DEFAULT_PLACEMENTS,
  STARTER_ACORNS,
  TRAITS,
  anchorFor,
  applyRoomPatch,
  buyShopItem,
  diffReward,
  economyOf,
  grantAcorn,
  pathTo,
  pickWanderTarget,
  readRoom,
  rewardWorthShowing,
  validatePlacements,
} from "./roomLogic.js";

const SPECIES = ["fox", "owl", "turtle", "hedgehog", "fawn", "squirrel", "rabbit", "dragon"];

test("every companion has a distinct behaviour profile", () => {
  assert.deepEqual(Object.keys(TRAITS).sort(), [...SPECIES].sort());
  const speeds = new Set(SPECIES.map((id) => TRAITS[id].speed));
  assert.ok(speeds.size >= 6);
});

test("a new economy does not pay acorns for learning that was already counted", () => {
  const extra = { awards: { submissions: ["old"], feedback: ["old:1:accepted"], reading: ["book"] } };
  const economy = economyOf(extra);
  assert.equal(economy.acorns, STARTER_ACORNS);
  assert.equal(grantAcorn(economy, "submissions", "old", ACORN_AMOUNTS.submission), 0);
  assert.equal(grantAcorn(economy, "feedback", "old:1:accepted", 3), 0);
  assert.equal(grantAcorn(economy, "reading", "book", 1), 0);
  assert.equal(economy.acorns, STARTER_ACORNS);
  assert.equal(grantAcorn(economy, "submissions", "new", ACORN_AMOUNTS.submission), 2);
  assert.equal(grantAcorn(economy, "submissions", "new", 2), 0);
  assert.equal(economy.acorns, STARTER_ACORNS + 2);
});

test("shop purchases spend acorns once and stay on that pet record", () => {
  const extra = { awards: { submissions: [], feedback: [], reading: [] } };
  const first = buyShopItem(extra, "meadow", "toy");
  assert.equal(first.error, undefined);
  assert.equal(first.economy.acorns, STARTER_ACORNS - 4);
  assert.ok(first.room.owned.includes("toy"));
  const second = buyShopItem(first.extra, "meadow", "toy");
  assert.equal(second.error, "You already own this");
  const broke = buyShopItem(first.extra, "meadow", "mobile");
  assert.equal(broke.error, "Not enough acorns");
  assert.equal(first.extra.economy.acorns, STARTER_ACORNS - 4);
});

test("the starter room fits inside the room and leaves a front path", () => {
  const room = readRoom({}, "meadow");
  const checked = validatePlacements(room.placements, room.owned);
  assert.equal(checked.error, undefined);
  assert.equal(checked.placements.length, DEFAULT_PLACEMENTS.length);
  const target = pickWanderTarget(room.placements, { x: 0.2, y: 0.82 }, () => 0.4);
  assert.ok(target);
  assert.ok(target.y >= 0.82);
});

test("furniture cannot leave the room or pile on top of itself", () => {
  const owned = ["bed", "cushion", "window", "lamp"];
  const outside = validatePlacements([{ uid: "window", item: "window", x: 0.2, y: 0.8, flip: false }], owned);
  assert.match(outside.error, /inside the room/);
  const piled = validatePlacements([
    { uid: "bed", item: "bed", x: 0.4, y: 0.66, flip: false },
    { uid: "cushion", item: "cushion", x: 0.42, y: 0.66, flip: false },
  ], owned);
  assert.match(piled.error, /overlap/);
});

test("locked themes stay locked", () => {
  const result = applyRoomPatch({}, "meadow", { theme: "night" });
  assert.equal(result.error, "You have not unlocked that theme");
});

test("pets walk the front path instead of through a bed", () => {
  const bed = DEFAULT_PLACEMENTS[1];
  const path = pathTo({ x: 0.84, y: 0.82 }, anchorFor(bed));
  assert.ok(path.length >= 2);
  assert.equal(path[0].y, 0.82);
  assert.ok(path[0].x < 0.84);
});

test("play XP does not open a learning celebration", () => {
  const quiet = diffReward({ xp: 10, acorns: 8, level: "Hatchling" }, { xp: 12, acorns: 8, level: "Hatchling" });
  assert.equal(rewardWorthShowing(quiet), false);
  const learnt = diffReward({ xp: 10, acorns: 8, level: "Hatchling" }, { xp: 25, acorns: 10, level: "Hatchling" });
  assert.equal(rewardWorthShowing(learnt), true);
  assert.equal(learnt.xp, 15);
  assert.equal(learnt.acorns, 2);
  const first = diffReward(null, { xp: 40, acorns: 8, level: "Hatchling" });
  assert.equal(rewardWorthShowing(first), false);
});
