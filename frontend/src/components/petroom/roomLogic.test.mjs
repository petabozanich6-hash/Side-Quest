import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
  moveDuration,
  nudgePlacement,
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

test("every companion can reach the bed and cushion without leaving the room", () => {
  const room = readRoom({}, "meadow");
  const moved = nudgePlacement(room, "bed", 0.08, 0);
  assert.equal(moved.error, undefined);
  for (const species of SPECIES) {
    assert.ok(TRAITS[species].speed > 0);
    const wander = pickWanderTarget(moved.placements, { x: 0.5, y: 0.82 }, () => 0.33);
    assert.ok(wander, species);
    assert.ok(wander.x >= 0.12 && wander.x <= 0.88, species);
    assert.ok(wander.y >= 0.8 && wander.y <= 0.9, species);
    for (const item of ["bed", "cushion"]) {
      const place = moved.placements.find((entry) => entry.item === item);
      const path = pathTo({ x: 0.84, y: 0.82 }, anchorFor(place));
      assert.ok(path.length >= 1, `${species} ${item}`);
      assert.ok(path.every((point) => point.x >= 0.1 && point.x <= 0.9 && point.y >= 0.14 && point.y <= 0.9), `${species} ${item}`);
      assert.equal(path[0].y, 0.82, `${species} ${item}`);
    }
  }
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

test("a purchase uses the catalogue price and refuses what the student cannot afford", () => {
  const extra = { economy: { acorns: STARTER_ACORNS, seeded: true, seen: { submissions: [], feedback: [], reading: [] } } };
  const locked = buyShopItem(extra, "meadow", "night");
  assert.equal(locked.error, "Not enough acorns");
  assert.equal(extra.economy.acorns, STARTER_ACORNS);
  const bought = buyShopItem(extra, "meadow", "toy");
  assert.equal(bought.bought.cost, 4);
  assert.equal(bought.economy.acorns, STARTER_ACORNS - 4);
  const poor = buyShopItem({ economy: { acorns: 0, seeded: true, seen: { submissions: [], feedback: [], reading: [] } } }, "meadow", "bowl");
  assert.equal(poor.error, "Not enough acorns");
});

test("furniture can be nudged without a drag gesture and stays inside the room", () => {
  const room = readRoom({}, "meadow");
  const nudged = nudgePlacement(room, "bed", -0.5, 0);
  assert.equal(nudged.error, undefined);
  const bed = nudged.placements.find((item) => item.item === "bed");
  assert.ok(bed.x >= 0.1 && bed.x < room.placements.find((item) => item.item === "bed").x);
  const missing = nudgePlacement(room, "toy", 0.04, 0);
  assert.equal(missing.error, "That item is not in the room");
});

test("reduced motion removes travel time and decorative animation", () => {
  assert.equal(moveDuration(0.4, 1, true), 0);
  assert.ok(moveDuration(0.4, 1, false) >= 480);
  const css = readFileSync(new URL("./room.css", import.meta.url), "utf8");
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /animation:\s*none !important/);
  const controls = readFileSync(new URL("./NudgeControls.jsx", import.meta.url), "utf8");
  for (const direction of ["left", "right", "up", "down"]) {
    assert.match(controls, new RegExp(`Move the \\$\\{name\\} ${direction}`));
  }
  assert.match(controls, /back in the cupboard/);
  assert.match(css, /\.nudge-btn:focus-visible/);
});
