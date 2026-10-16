import { test } from "node:test";
import assert from "node:assert/strict";
import { studentExtraFromBody } from "../src/family.ts";

test("Compass selections persist separately from saved elective courses and prefs", () => {
  const existing = { electives: [{ code: "ENG-S4", name: "English" }, { code: "DRAMA-S4", name: "Drama" }], prefs: { reading: "guided" }, compass_areas: ["PDHPE", "Languages"] };
  const next = studentExtraFromBody({ compass_areas: ["Creative Arts", "Technology"] }, "S4", existing);
  assert.deepEqual(next.compass_areas, ["Creative Arts", "Technology"]);
  assert.deepEqual(next.electives, existing.electives);
  assert.deepEqual(next.prefs, existing.prefs);
  assert.deepEqual(existing.compass_areas, ["PDHPE", "Languages"], "do not mutate caller record");
});

test("Ordinary profile update retains Compass selections unless supplied explicitly", () => {
  const existing = { electives: [{ code: "SCI-S5" }], compass_areas: ["PDHPE", "Technology"] };
  const next = studentExtraFromBody({ ai_help: false }, "S5", existing);
  assert.deepEqual(next.compass_areas, existing.compass_areas);
  assert.deepEqual(next.electives, existing.electives);
});

test("Clearing Compass selection does not clear already chosen subject courses", () => {
  const existing = { electives: [{ code: "MUSIC" }], compass_areas: ["Creative Arts", "Technology"] };
  const next = studentExtraFromBody({ compass_areas: [] }, "S4", existing);
  assert.deepEqual(next.compass_areas, []);
  assert.deepEqual(next.electives, [{ code: "MUSIC" }]);
});
