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

test("fast and standard modes send exactly the same full teaching prompts and preserve the same output", async () => {
  const capture = async fast => {
    const requests = [];
    const ai = stub(user => { requests.push(user); });
    const result = await generateStaged(ai, spec(), stats(), [], false, fast);
    assert.ok(result);
    return { requests: requests.sort(), result };
  };
  const standard = await capture(false);
  const fast = await capture(true);
  assert.deepEqual(fast.requests, standard.requests, "Speed must never shorten, omit or rewrite the original teacher prompts.");
  assert.deepEqual(fast.result, standard.result);
});

// AI_SPLIT_STAGES: readings only when needed, opening/wrap-up beside teaching, one teaching round, split practice/assessment.
function splitStub(onRequest = () => {}, { needsReading, failActivity = false } = {}) {
  return async (messages) => {
    const user = String(messages.at(-1)?.content || "");
    await onRequest(user);
    let value;
    if (user.startsWith("STAGE 1")) value = needsReading === undefined ? design : { ...design, needs_reading: needsReading };
    else if (user.startsWith("STAGE 2, READINGS")) value = { texts: frame.texts };
    else if (user.startsWith("STAGE 2, OPENING")) value = { introduction: frame.introduction, consolidation: frame.consolidation };
    else if (user.includes("STAGE 3, SECTION")) value = { heading: "One idea", body: "Here is a worked explanation." };
    else if (user.includes("STAGE 3, WORKED EXAMPLE")) value = { title: "Model", problem: "100+20", steps: ["Set it up", "Solve"], answer: "120" };
    else if (user.startsWith("STAGE 4, GUIDED PRACTICE")) value = { guided_practice: [{ prompt: "100+20?", answer: "120" }] };
    else if (user.startsWith("STAGE 4, ACTIVITY")) {
      if (failActivity && user.startsWith("STAGE 4, ACTIVITY 2")) return { response: "not json" };
      value = { activities: [{ title: user.slice(0, 20), tasks: [{ prompt: "Try it", answer: "120" }] }] };
    }
    else if (user.startsWith("STAGE 4, ASSESSMENT QUESTIONS")) value = { questions: [{ prompt: "Describe place value", answer_key: "Hundreds and tens" }], quiz: [{ question: "Hundreds?", options: ["100", "10"], correct_index: 0 }] };
    else if (user.startsWith("STAGE 4, LESSON GUIDANCE")) value = { parent_script: "Sit together.", support: "Use blocks." };
    else throw Error("Unexpected model stage " + user.slice(0, 90));
    return { response: JSON.stringify(value), usage: { prompt_tokens: 80, completion_tokens: 100 } };
  };
}

test("split stages: no reading needed means teaching starts without waiting for the opening", async () => {
  let releaseOpening, teachingBeforeOpening = false, openingDone = false;
  const gate = new Promise(r => { releaseOpening = r; });
  const seen = [];
  const ai = splitStub(async user => {
    seen.push(user.slice(0, 30));
    if (user.startsWith("STAGE 2, OPENING")) { await gate; openingDone = true; }
    if (user.includes("STAGE 3, SECTION")) { if (!openingDone) teachingBeforeOpening = true; releaseOpening(); }
  }, { needsReading: false });
  const m = stats();
  const result = await generateStaged(ai, spec("English", { minutes: 60 }), m, [], false, true, true);
  assert.ok(result);
  assert.equal(m.pipeline, "split_stages");
  assert.equal(teachingBeforeOpening, true);
  assert.ok(!seen.some(s => s.startsWith("STAGE 2, READINGS")));
  assert.deepEqual(result.texts, []);
  assert.equal(result.introduction, frame.introduction);
  // design + opening + 3 sections + 2 examples + guided + 3 activities + questions + guidance
  assert.equal(m.calls, 13);
  assert.equal(result.activities.length, 3);
  assert.equal(result.parent_script, "Sit together.");
  assert.equal(result.quiz.length, 1);
  assert.ok(result.answer_key.includes("120"));
});

test("split stages: a needed reading is written first and every teaching and practice request receives it", async () => {
  let readingDone = false, sectionsWithReading = 0, practiceWithReading = 0;
  const ai = splitStub(async user => {
    if (user.startsWith("STAGE 2, READINGS")) readingDone = true;
    if (user.includes("STAGE 3, SECTION")) {
      assert.equal(readingDone, true, "section started before its reading");
      if (user.includes("Original text that teaching should use")) sectionsWithReading++;
    }
    if (user.startsWith("STAGE 4") && user.includes("Original text that teaching should use")) practiceWithReading++;
  }, { needsReading: true });
  const result = await generateStaged(ai, spec("Mathematics"), stats(), [], false, true, true);
  assert.ok(result);
  assert.equal(result.texts.length, 1);
  assert.equal(sectionsWithReading, 3);
  assert.equal(practiceWithReading, 5, "guided + 2 activities + questions + guidance");
});

test("split stages: a design that does not say keeps the reading-first rule outside source-free maths", async () => {
  for (const [area, expected] of [["English", true], ["Mathematics", false]]) {
    let asked = false;
    const ai = splitStub(user => { if (user.startsWith("STAGE 2, READINGS")) asked = true; });
    assert.ok(await generateStaged(ai, spec(area), stats(), [], false, false, true));
    assert.equal(asked, expected, area);
  }
});

test("split stages: a parent's own resource always gets the readings step", async () => {
  let asked = false;
  const ai = splitStub(user => { if (user.startsWith("STAGE 2, READINGS")) asked = true; }, { needsReading: false });
  assert.ok(await generateStaged(ai, spec("Mathematics", { source: "A table from class" }), stats(), [], false, false, true));
  assert.equal(asked, true);
});

test("split stages: all teaching requests of a long lesson run in a single round", async () => {
  const big = {
    ...design,
    sequence: Array.from({ length: 8 }, (_, i) => ({ heading: `H${i}`, idea: `I${i}`, how: "Show", key_points: ["k"] })),
    worked_examples: Array.from({ length: 4 }, (_, i) => ({ title: `W${i}`, problem: `${i}+1`, skill: `S${i}` })),
  };
  let inFlight = 0, peak = 0, release;
  const gate = new Promise(r => { release = r; });
  const base = splitStub(() => {}, { needsReading: false });
  const ai = async (messages) => {
    const user = String(messages.at(-1)?.content || "");
    if (user.startsWith("STAGE 1")) return { response: JSON.stringify({ ...big, needs_reading: false }) };
    if (user.includes("STAGE 3,")) {
      inFlight++; peak = Math.max(peak, inFlight);
      if (inFlight === 12) release();
      await Promise.race([gate, new Promise(r => setTimeout(r, 300))]);
      inFlight--;
    }
    return base(messages);
  };
  assert.ok(await generateStaged(ai, spec("Science", { minutes: 90 }), stats(), [], false, true, true));
  assert.equal(peak, 12);
});

test("split stages: each activity is given different worked-example skills", async () => {
  const prompts = [];
  const ai = splitStub(user => { if (user.startsWith("STAGE 4, ACTIVITY")) prompts.push(user); }, { needsReading: false });
  assert.ok(await generateStaged(ai, spec("Mathematics"), stats(), [], false, false, true));
  assert.equal(prompts.length, 2);
  const first = prompts.find(p => p.startsWith("STAGE 4, ACTIVITY 1"));
  const second = prompts.find(p => p.startsWith("STAGE 4, ACTIVITY 2"));
  assert.ok(first.includes("focus on Add.") && second.includes("focus on Compare."));
  assert.ok(second.includes("may be a hands-on activity") && !first.includes("may be a hands-on activity"));
});

test("split stages: a failed activity keeps the rest of the lesson and is flagged", async () => {
  const flags = [];
  const result = await generateStaged(splitStub(() => {}, { needsReading: false, failActivity: true }), spec("Mathematics"), stats(), flags, false, false, true);
  assert.ok(result);
  assert.equal(result.activities.length, 1);
  assert.ok(flags.some(f => f.includes("Only 1 of 2 practice activities")));
});

test("split stages off: design and existing stage prompts are unchanged", async () => {
  const requests = [];
  await generateStaged(stub(user => { requests.push(user); }), spec(), stats(), [], false, true);
  assert.ok(!requests.some(r => r.includes("needs_reading")));
  assert.ok(requests.some(r => r.startsWith("STAGE 4, PRACTICE")));
});
