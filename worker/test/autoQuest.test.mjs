import { test } from "node:test";
import assert from "node:assert/strict";
import { planAutoQuest } from "../src/autoQuest.ts";

const base = {
  studentId: "child-a",
  slots: [
    { id: "mon", student_id: "child-a", date: "2026-10-19", title: "Mathematics", event_type: "lesson" },
    { id: "tue", student_id: "child-a", date: "2026-10-20", title: "Mathematics", event_type: "lesson" },
  ],
  lessons: [
    { id: "lesson-achieved", title: "Numbers", learning_area: "Mathematics", outcome_codes: ["ACH"] },
    { id: "lesson-next", title: "Addition", learning_area: "Mathematics", outcome_codes: ["NEXT"] },
  ],
  assignments: [],
  progress: [{ code: "ACH", status: "achieved" }, { code: "NEXT", status: "developing" }],
  catalogueAvailable: true,
  allowedOutcomeCodes: ["ACH", "NEXT"],
};

test("reuses only a draft with unachieved verified outcomes and does not reuse it twice", () => {
  const result = planAutoQuest(base);
  assert.equal(result[0].action, "reuse_draft");
  assert.equal(result[0].lessonId, "lesson-next");
  assert.deepEqual(result[0].eligibleOutcomeCodes, ["NEXT"]);
  assert.equal(result[1].action, "needs_generation");
});

test("existing assignments are never overwritten", () => {
  const result = planAutoQuest({ ...base, slots: [{ ...base.slots[0], linked_assignment_id: "a1" }], assignments: [{ id: "a1", student_id: "child-a", lesson_id: "lesson-next", status: "not_started" }] });
  assert.equal(result[0].action, "already_assigned");
});

test("without a verified catalogue, does not suggest fabricated mappings", () => {
  const result = planAutoQuest({ ...base, catalogueAvailable: false });
  assert.ok(result.every(x => x.action === "needs_parent_plan" && x.eligibleOutcomeCodes.length === 0));
});

test("achieved-only curriculum is not generated again by default", () => {
  const result = planAutoQuest({ ...base, lessons: [base.lessons[0]], allowedOutcomeCodes: ["ACH"] });
  assert.ok(result.every(x => x.action === "needs_parent_plan"));
});

test("family/child isolation: only chosen child's timetable slots are planned", () => {
  const result = planAutoQuest({ ...base, slots: [...base.slots, { id: "other", student_id: "child-b", date: "2026-10-19", title: "Mathematics" }] });
  assert.equal(result.length, 2);
});
