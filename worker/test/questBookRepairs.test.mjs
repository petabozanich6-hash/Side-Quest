import test from "node:test";
import assert from "node:assert/strict";
import { planBookAiRepair } from "../src/questBookRepairs.ts";

test("One plan includes multiple AI warnings and book completion problems", () => {
  const plan = planBookAiRepair([
    "some guided practice questions have no answer",
    "activity has only 3 tasks",
    'the lesson mentions "worksheets" but no such material is provided',
  ], [
    "four answered guided practice questions",
    "two independent activities with three answered tasks each",
  ]);
  assert.ok(plan.selected.length >= 3);
  assert.ok(plan.target.includes("guided_practice"));
  assert.ok(plan.target.includes("activities"));
  assert.ok(plan.instruction.includes("guided practice"));
  assert.ok(plan.instruction.length <= 600);
});

test("Owner-reported issue remains even when the AI warnings were cleared on approval", () => {
  const plan = planBookAiRepair([], [], "The answer for question four is wrong");
  assert.equal(plan.issues.length, 1);
  assert.match(plan.instruction, /question four is wrong/);
  assert.equal(plan.target.length, 0, "unknown owner error should allow correcting the appropriate field");
});

test("Duplicate warnings are deduplicated and pass size is bounded", () => {
  const issues = Array.from({ length: 20 }, (_, i) => `Different problem ${i}: ${"long explanation ".repeat(4)}`);
  const plan = planBookAiRepair(issues.concat(issues));
  assert.equal(plan.issues.length, 20);
  assert.equal(plan.selected.length, 6);
  assert.ok(plan.instruction.length <= 600);
  assert.deepEqual(planBookAiRepair([], []), { issues: [], target: [], instruction: "", selected: [] });
});
