import { lessonAvailableForChild, lessonAvailableForChildren } from "./lessonAvailability";

const lesson = (...assigned_to) => ({ id: "maths-1", status: "ready", assigned_to });

test("hides open, submitted and completed lessons only from the child who had them", () => {
  for (const status of ["not_started", "in_progress", "submitted", "accepted", "demonstrated", "completed"]) {
    const l = lesson({ student_id: "mason", status });
    expect(lessonAvailableForChild(l, "mason")).toBe(false);
    expect(lessonAvailableForChild(l, "oliver")).toBe(true);
  }
});

test("revoking an assignment frees a lesson for that child again", () => {
  const l = lesson({ student_id: "mason", status: "revoked" });
  expect(lessonAvailableForChild(l, "mason")).toBe(true);
  expect(lessonAvailableForChild(lesson(), "mason")).toBe(true);
});

test("family-wide scheduling offers only lessons unused by every selected child", () => {
  const maths = lesson({ student_id: "mason", status: "completed" });
  expect(lessonAvailableForChildren(maths, ["mason", "oliver"])).toBe(false);
  expect(lessonAvailableForChildren(maths, ["oliver"])).toBe(true);
  expect(lessonAvailableForChildren(maths, [])).toBe(true);
});
