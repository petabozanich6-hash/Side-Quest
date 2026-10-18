import test from "node:test";
import assert from "node:assert/strict";
import { cleanAdditionalAreas, lessonSupportsArea } from "../src/lessonAreas.ts";
import { sanitizeLessonInput, toLessonData } from "../src/lessonBuilder.ts";

test("one primary area can link to distinct valid other subjects without duplication", () => {
  const areas = cleanAdditionalAreas(["English", "hsie", "HASS", "SCIENCE", "garbage", "English"], "Science");
  assert.deepEqual(areas, ["English", "Humanities and Social Sciences"]);
  const lesson = { learning_area: "Science", additional_learning_areas: areas };
  assert.equal(lessonSupportsArea(lesson, "Science", "S4"), true);
  assert.equal(lessonSupportsArea(lesson, "English", "S4"), true);
  assert.equal(lessonSupportsArea(lesson, "HSIE", "S4"), true);
  assert.equal(lessonSupportsArea(lesson, "Mathematics", "S4"), false);
});
test("cross-curricular areas survive server validation and lesson data conversion", () => {
  const r = sanitizeLessonInput({
    title: "Investigating Halloween traditions",
    learning_area: "Humanities and Social Sciences",
    additional_learning_areas: ["English", "Science", "HSIE", "unknown"],
    sections: [{ heading: "Origins", body: "Compare historical accounts and the evidence they provide." }],
  });
  assert.ok(r.ok, JSON.stringify(r));
  assert.deepEqual(toLessonData(r.value).additional_learning_areas, ["English", "Science"]);
});
