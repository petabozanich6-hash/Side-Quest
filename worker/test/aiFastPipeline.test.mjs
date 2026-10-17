import test from "node:test";
import assert from "node:assert/strict";
import { canOverlapLessonFrame, generateStaged } from "../src/aiDraft.ts";

const spec = (area = "Mathematics", more = {}) => ({
  topic: "Place value", area, year: "Year 3", goal: "Compare hundreds",
  minutes: 30, delivery: "parent_guided", interests: "", needs: "",
  notes: "", ...more,
});
const design = {
  title: "Place value", teaching_plan: "Teach with examples",
  sequence: [
    { heading: "Hundreds", idea: "Hundreds", how: "Blocks", key_points: ["Hundreds"] },
    { heading: "Tens", idea: "Tens", how: "Bundles", key_points: ["Tens"] },
    { heading: "Compare", idea: "Compare", how: "Numbers", key_points: ["Compare"] },
  ],
  worked_examples: [
    { title: "Simple", problem: "100+20", skill: "Add" },
    { title: "Compare", problem: "250 vs 350", skill: "Compare" },
  ],
};
const frame = { introduction: "Let's explore numbers", texts: [
  { title: "The reading", kind: "text", content: "Original text that teaching should use in a reading-based lesson." },
], consolidation: "Now compare the numbers." };
function stub(onRequest = () => {}, { withReading = false } = {}) {
  return async (messages) => {
    const user = String(messages.at(-1)?.content || "");
    await onRequest(user);
    let value;
    if (user.startsWith("STAGE 1")) value = design;
    else if (user.startsWith("STAGE 2")) value = withReading ? frame : { ...frame, texts: [] };
    else if (user.includes("STAGE 3, SECTION")) value = { heading: "One idea", body: "Here is a worked explanation." };
    else if (user.includes("STAGE 3, WORKED EXAMPLE")) value = { title: "Model", problem: "100+20", steps: ["Set it up", "Solve"], answer: "120" };
    else if (user.startsWith("STAGE 4, PRACTICE")) value = { guided_practice: [{ prompt: "100+20?", answer: "120" }], activities: [{ title: "Explore", tasks: [{ prompt: "Try it", answer: "120" }] }] };
    else if (user.startsWith("STAGE 4, ASSESSMENT")) value = { questions: [{ prompt: "Describe place value", answer_key: "Hundreds and tens" }], quiz: [{ question: "Hundreds?", options: ["100", "10"], correct_index: 0 }] };
    else throw Error("Unexpected model stage " + user.slice(0, 90));
    return { response: JSON.stringify(value), usage: { prompt_tokens: 80, completion_tokens: 100 } };
  };
}
const stats = () => ({ calls: 0, input_tokens: 0, output_tokens: 0, stages: [], stage_timings_ms: [] });

test("only source-free mathematics can overlap frame with teaching", () => {
  assert.equal(canOverlapLessonFrame(spec()), true);
  assert.equal(canOverlapLessonFrame(spec("English")), false);
  assert.equal(canOverlapLessonFrame(spec("Science")), false);
  assert.equal(canOverlapLessonFrame(spec("Mathematics", { source: "A table from class" })), false);
  assert.equal(canOverlapLessonFrame(spec("Maths", { topic: "Reading a data table" })), false);
});

test("fast path starts a section before the frame is finished and preserves lesson stages", async () => {
  let frameFinished = false;
  let teachingBeforeFrame = false;
  let releaseFrame;
  const frameGate = new Promise(resolve => { releaseFrame = resolve; });
  const ai = stub(async text => {
    if (text.startsWith("STAGE 2")) { await frameGate; frameFinished = true; }
    if (text.includes("STAGE 3, SECTION")) {
      if (!frameFinished) teachingBeforeFrame = true;
      releaseFrame?.();
    }
  });
  const m = stats();
  const result = await Promise.race([
    generateStaged(ai, spec(), m, [], false, true),
    new Promise((_, reject) => setTimeout(() => reject(Error("frame and teaching did not overlap")), 1500)),
  ]);
  assert.ok(result);
  assert.equal(teachingBeforeFrame, true);
  assert.equal(m.pipeline, "parallel_frame");
  assert.equal(m.calls, 9);
  assert.equal(result.sections.length, 3);
  assert.equal(result.worked_examples.length, 2);
  assert.equal(result.activities.length, 1);
  assert.equal(result.quiz.length, 1);
});

test("English or source-based teaching still receives complete framed readings", async () => {
  for (const sp of [spec("English"), spec("Mathematics", { source: "Read the provided article" })]) {
    let frameFinished = false;
    let usedReading = false;
    const ai = stub(async user => {
      if (user.startsWith("STAGE 2")) frameFinished = true;
      if (user.includes("STAGE 3, SECTION")) {
        assert.equal(frameFinished, true, "section started before essential reading");
        usedReading ||= user.includes("Original text that teaching should use");
      }
    }, { withReading: true });
    const m = stats();
    const result = await generateStaged(ai, sp, m, [], false, true);
    assert.ok(result);
    assert.equal(usedReading, true);
    assert.equal(m.pipeline, "concurrent_teaching");
  }
});

test("flag off retains frame-first scheduling and the standard pool", async () => {
  let framed = false;
  const ai = stub(async user => {
    if (user.startsWith("STAGE 2")) framed = true;
    if (user.includes("STAGE 3, SECTION")) assert.equal(framed, true);
  });
  const m = stats();
  const result = await generateStaged(ai, spec(), m, [], false, false);
  assert.ok(result);
  assert.equal(m.pipeline, "standard");
  assert.equal(m.calls, 9);
});

test("if mathematics generates an unexpected reading, fast mode rebuilds every section with that reading", async () => {
  let withReading = 0;
  const ai = stub(user => {
    if (user.includes("STAGE 3, SECTION") &&
        user.includes("Original text that teaching should use")) withReading++;
  }, { withReading: true });
  const m = stats(), flags = [];
  const result = await generateStaged(ai, spec(), m, flags, false, true);
  assert.ok(result);
  assert.equal(result.texts.length, 1);
  assert.equal(withReading, 3);
  assert.equal(result.sections.length, 3);
  assert.equal(m.calls, 14, "speculative 5 calls plus the complete 9-call fallback");
  assert.ok(flags.some(t => t.includes("new reading")));
});
