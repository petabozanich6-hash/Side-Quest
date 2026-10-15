import { test } from "node:test";
import assert from "node:assert/strict";
import { ac9Level } from "../scripts/ac9-code-level.mjs";

test("ACARA identifier reader handles standard Foundation and Year 10 descriptors", () => {
  assert.equal(ac9Level("AC9ADA10C01"), 10);
  assert.equal(ac9Level("AC9E4LY01"), 4);
  assert.equal(ac9Level("AC9MFM01"), 0);
});
test("Auslan and other language sequences have digits before the actual year band", () => {
  assert.equal(ac9Level("AC9L1AU8EC01"), 8);
  assert.equal(ac9Level("AC9L2AU4C01"), 4);
  assert.equal(ac9Level("AC9L2AUFC01"), 0);
});
test("unknown identifiers must not be converted into fabricated levels", () => {
  assert.equal(ac9Level("ENG-S4"), null);
  assert.equal(ac9Level("not-a-code"), null);
  assert.equal(ac9Level("AC9FOO"), null);
});
