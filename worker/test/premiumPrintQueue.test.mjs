import test from "node:test";
import assert from "node:assert/strict";
import { canAdvancePrintStatus, validatePrintTracking, PRINT_JOB_STATUSES } from "../src/premiumPrintQueue.ts";

test("private print jobs advance only one production stage at a time", () => {
  for (let i = 0; i < PRINT_JOB_STATUSES.length - 1; i++) {
    assert.equal(canAdvancePrintStatus(PRINT_JOB_STATUSES[i], PRINT_JOB_STATUSES[i+1]), true);
  }
  assert.equal(canAdvancePrintStatus("ready", "dispatched"), false);
  assert.equal(canAdvancePrintStatus("ready", "complete"), false);
  assert.equal(canAdvancePrintStatus("printed", "sent_to_printer"), false);
  assert.equal(canAdvancePrintStatus("complete", "ready"), false);
  assert.equal(canAdvancePrintStatus("complete", "complete"), false);
  assert.equal(canAdvancePrintStatus("not-a-stage", "printed"), false);
});

test("only modest-length plain parcel tracking references are accepted", () => {
  assert.equal(validatePrintTracking(" 1234 5678 9012 "), "1234 5678 9012");
  assert.equal(validatePrintTracking("AU-12345/6"), "AU-12345/6");
  for (const bad of [null, 3, "", "123", "x".repeat(81), "<script>alert(1)</script>", "abc\n12345"]) {
    assert.equal(validatePrintTracking(bad), null);
  }
});
