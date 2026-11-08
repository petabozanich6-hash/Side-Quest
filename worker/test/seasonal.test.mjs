import test from "node:test";
import assert from "node:assert/strict";
import { PACKS, packView, sydneyMonth } from "../src/data/seasonal.ts";

const SLOTS = ["head", "head", "face", "neck", "neck", "chest", "chest", "left", "right", "ears", "feet", "cheeks"];

test("there is one monthly theme for each month, each with 12 prizes covering every slot", () => {
  const monthly = Object.entries(PACKS).filter(([, p]) => p.month);
  assert.deepEqual(monthly.map(([, p]) => p.month).sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  for (const [id, p] of monthly) assert.deepEqual(p.prizes.map((x) => x[2]), SLOTS, id);
});

test("a monthly theme is active only in its own month, and only when switched on", () => {
  const now = sydneyMonth();
  for (const [id, p] of Object.entries(PACKS).filter(([, x]) => x.month)) {
    assert.equal(packView(id, { enabled: true }).active, p.month === now, id);
    assert.equal(packView(id, { enabled: false }).active, false, id);
    // Old dates saved on the row don't stop or start a monthly theme.
    assert.equal(packView(id, { enabled: true, start_date: "2000-01-01", end_date: "2000-01-02" }).active, p.month === now, id);
  }
});
