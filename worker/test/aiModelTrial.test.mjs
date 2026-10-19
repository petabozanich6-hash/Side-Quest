import test from "node:test";
import assert from "node:assert/strict";
import { basicQualityReport, compare, BENCH_MODELS, BENCH_FIXTURES, selectFixture, studentReview } from "../scripts/compare-cloudflare-ai.mjs";
import { generationReport } from "../src/aiDraft.ts";
import { estimateGrossUsd, RATES_USD_PER_MILLION } from "../src/aiCost.ts";

test("benchmark fixtures are synthetic and dry run makes zero model calls", async () => {
  const result = await compare({ dryRun: true });
  assert.equal(result.dryRun, true);
  assert.equal(result.modelRequests, 0);
  assert.ok(result.hardMaxCalls <= 32);
  assert.ok(result.grossUsdCeiling <= 0.50);
  assert.equal(result.models.length, 3);
});

test("candidate models are registered at their own published prices, not inherited prices", () => {
  const qwen = "@cf/qwen/qwen3-30b-a3b-fp8";
  const gemma = "@cf/google/gemma-4-26b-a4b-it";
  assert.deepEqual(RATES_USD_PER_MILLION[gemma], { input: 0.100, output: 0.300 });
  assert.deepEqual(RATES_USD_PER_MILLION[qwen], { input: 0.051, output: 0.335 });
  const gross = estimateGrossUsd(gemma, 10_000, 12_000);
  assert.equal(gross, 0.0046);
  assert.ok(BENCH_MODELS.includes(gemma));
});

test("full lesson estimates are available for named new models and null if counts are unknown", () => {
  const stats = { calls: 3, input_tokens: 10_000, output_tokens: 12_000, stages: ["design"] };
  const report = generationReport(stats, "@cf/google/gemma-4-26b-a4b-it");
  assert.equal(report.est_cost_us_cents, 0.46);
  const unpriced = generationReport(stats, "@cf/unknown");
  assert.equal(unpriced.est_cost_us_cents, null);
  const missingTokens = generationReport({ ...stats, output_tokens: 0 }, "@cf/google/gemma-4-26b-a4b-it");
  assert.equal(missingTokens.est_cost_us_cents, null);
});

test("automatic checks require substantial teaching but never pretend to validate factual correctness", () => {
  const empty = basicQualityReport({ sections: [], worked_examples: [], guided_practice: [] });
  assert.equal(empty.structurallyPlausible, false);
  assert.equal(empty.teachingWords, 0);
  assert.ok(empty.expectedSections >= 3);
});


test("new algebra benchmark runs the actual Year 7 independent generator only after charge confirmation", async () => {
  const fixture = selectFixture("year7-algebra");
  assert.equal(fixture.area, "Mathematics");
  assert.equal(fixture.year, "Year 7");
  assert.equal(fixture.delivery, "independent");
  assert.match(fixture.goal, /original equation/);
  const dry = await compare({ dryRun: true, fixtureId: "year7-algebra" });
  assert.equal(dry.fixture, "year7-algebra");
  assert.equal(dry.modelRequests, 0);
  assert.equal(dry.grossUsdCeiling, 0.5);
  assert.throws(() => selectFixture("real-child-profile"), /Unknown benchmark fixture/);
  await assert.rejects(compare({ dryRun: true, fixtureId: "real-child-profile" }), /Unknown benchmark fixture/);
  assert.equal(Object.keys(BENCH_FIXTURES).length, 7);
});

test("synthetic child-view review shows the teaching model but excludes private assessment answers", () => {
  const specimen = {
    introduction: "An equal sign means two sides have the same value.",
    sections: [{ heading: "What a variable means", body: "A letter stands for a number, and equality means both sides match." }],
    worked_examples: [{ title: "The balance", problem: "x + 3 = 8", steps: [
      "Start with x + 3 = 8.",
      "Take 3 from both sides: x + 3 - 3 = 8 - 3.",
      "Now x = 5, and you can check that 5 + 3 = 8.",
    ], answer: "x = 5" }],
    guided_practice: [{ prompt: "Solve y + 4 = 10", hint: "Take four off both sides.", answer: "DO_NOT_SHOW_GUIDED_ANSWER" }],
    activities: [{ title: "Practice", instructions: "Try a similar question.", tasks: [{ prompt: "Find z", hint: "Think of balance", answer: "DO_NOT_SHOW_ACTIVITY_ANSWER" }] }],
    questions: [{ prompt: "Explain equality", answer_key: "DO_NOT_SHOW_WRITTEN_ANSWER" }],
    quiz: [{ question: "What does = mean?", options: ["both sides match", "add"], correct_index: 0, explanation: "DO_NOT_SHOW_QUIZ_EXPLANATION" }],
    answer_key: "DO_NOT_SHOW_PARENT_KEY",
  };
  const review = studentReview(specimen, BENCH_FIXTURES["year7-algebra"]);
  assert.match(review, /x \+ 3 - 3 = 8 - 3/);
  assert.match(review, /Solve y \+ 4 = 10/);
  assert.match(review, /Human quality checklist/);
  assert.doesNotMatch(review, /DO_NOT_SHOW_/);
});


test("bounded synthetic learning review covers all major subject teaching styles", async () => {
  for (const [id, area] of [
    ["year3-place-value", "Mathematics"],
    ["year7-algebra", "Mathematics"],
    ["year4-english", "English"],
    ["year5-science", "Science"],
    ["year7-history", "History"],
    ["year5-technologies", "Technologies"],
    ["year4-arts", "The Arts"],
  ]) {
    const spec = selectFixture(id);
    assert.equal(spec.area, area);
    assert.ok(!JSON.stringify(spec).includes("@"));
    const dry = await compare({ dryRun: true, fixtureId: id });
    assert.equal(dry.modelRequests, 0);
    assert.equal(dry.fixture, id);
    assert.equal(dry.hardMaxCalls, 32);
    assert.equal(dry.grossUsdCeiling, 0.5);
    const review = studentReview({
      introduction: "We will learn this skill.",
      sections: [{ heading: "Learn", body: "A complete example follows." }],
      worked_examples: [{ title: "Model", problem: "Example", steps: ["Explain a specific move and why it is valid."], answer: "Model answer" }],
      guided_practice: [], activities: [], questions: [], quiz: [],
    }, spec);
    assert.match(review, /ACTUAL model/);
    assert.match(review, /WHY/);
    if (area === "Science") assert.match(review, /mechanism/);
    if (area === "English") assert.match(review, /sample passage/);
    if (area === "History") assert.match(review, /evidence supports/);
    if (area === "Technologies") assert.match(review, /input-to-output/);
    if (area === "The Arts") assert.match(review, /technique\/process/);
  }
});
