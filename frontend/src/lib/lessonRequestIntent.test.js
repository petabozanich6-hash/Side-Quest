import { lessonRequestIntent, requestedSeparateSubjects } from "./lessonRequestIntent";

describe("multi-subject lesson intent", () => {
  test.each([
    "create a halloween science and math lesson at the same time for a Year 7 student",
    "Make a Halloween maths and science lesson for year 7",
    "Please create two Science and Maths lessons for my child",
    "Write a science lesson and a maths lesson using Halloween",
    "Make a science & mathematics lesson, Year 7",
  ])("requests two complete subject-specific lessons: %s", text => {
    expect(lessonRequestIntent(text)).toMatchObject({ type: "multi_subject", subjects: expect.arrayContaining(["Science", "Mathematics"]) });
    expect(lessonRequestIntent(text).subjects).toHaveLength(2);
  });
  test.each([
    "I need 3 lessons, a science, an English and an HSIE",
    "Create three lessons: Science, English, and HSIE for Year 7",
    "I want a science, english and hsie lesson for my Year 7 student",
    "Make me science, english & hass lessons with a Halloween theme",
    "Create one Science lesson, one English lesson, and one Human Society and Its Environment lesson",
    "Create 3 lessons: science, english and humanities and social sciences",
  ])("recognises all three separate subjects: %s", text => {
    expect(lessonRequestIntent(text)).toMatchObject({
      type: "multi_subject",
      subjects: ["Science", "English", "Humanities and Social Sciences"],
    });
  });
  test("HSIE and HASS are the same learning area, not two duplicate subjects", () => {
    expect(requestedSeparateSubjects("Science, HSIE and HASS lessons")).toEqual(["Science", "Humanities and Social Sciences"]);
  });
  test("explicitly one integrated English, Science and HSIE lesson is not divided", () => {
    expect(lessonRequestIntent("Create one integrated lesson combining Science, English and HSIE")).toMatchObject({
      type: "single", subjects: [],
    });
  });
  test("preserves natural subject order", () => {
    expect(requestedSeparateSubjects("math and science lessons")).toEqual(["Mathematics", "Science"]);
    expect(requestedSeparateSubjects("science and math lesson")).toEqual(["Science", "Mathematics"]);
  });
  test.each([
    "create four science lessons on the solar system",
    "one mathematics lesson about geometry",
    "make a single lesson combining science and math",
    "make an integrated science and maths lesson",
    "a maths lesson using scientific weather data",
    "write a science lesson and include a maths worksheet",
  ])("does not accidentally divide one lesson or a standard series: %s", text => {
    expect(lessonRequestIntent(text).type).not.toBe("multi_subject");
  });
  test("conventional series remains a series with no subject override", () => {
    expect(lessonRequestIntent("create four Science lessons on the solar system")).toMatchObject({ type: "series", subjects: [] });
  });
  test("shared resources are never silently dropped for multi-subject requests", () => {
    expect(lessonRequestIntent("Halloween Science and Maths lesson", true)).toMatchObject({ type: "multi_subject", blockedBySource: true });
  });
});
