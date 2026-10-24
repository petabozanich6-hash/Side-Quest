#!/usr/bin/env node
/**
 * Manually invoked, bounded Cloudflare Workers AI comparison using Side-Quest's
 * ACTUAL staged lesson generator and a synthetic Year 3 maths lesson.
 * Never runs in ordinary builds, deploys, or CI; never reads customer data.
 *
 * To run:
 * CLOUDFLARE_ACCOUNT_ID=... CLOUDFLARE_API_TOKEN=... \
 *   node --import ./worker/test/register.mjs worker/scripts/compare-cloudflare-ai.mjs
 *
 * --dry-run prints the plan WITHOUT credentials or model calls.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { generateStaged, generationReport, sizeFor, normaliseDraft, qualityIssues } from "../src/aiDraft.ts";
import { estimateGrossUsd, RATES_USD_PER_MILLION } from "../src/aiCost.ts";

export const BENCH_MODELS = Object.freeze([
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "@cf/qwen/qwen3-30b-a3b-fp8",
  "@cf/google/gemma-4-26b-a4b-it",
]);
export const BENCH_FIXTURES = Object.freeze({
  "year3-place-value": Object.freeze({
    topic: "Place value to 1,000",
    area: "Mathematics",
    year: "Year 3",
    goal: "Read, partition, compare and explain three-digit numbers",
    minutes: 30,
    delivery: "parent_guided",
    interests: "gardening",
    needs: "Include explicit worked examples and clear scaffolded practice",
    notes: "Use Australian English; no external links or worksheets",
  }),
  "year7-algebra": Object.freeze({
    topic: "Understanding equality and solving one-step algebra equations",
    area: "Mathematics",
    year: "Year 7",
    goal: "Understand what a variable and equals sign mean, solve one-step equations by maintaining balance on both sides, and verify answers by substituting into the original equation",
    minutes: 30,
    delivery: "independent",
    interests: "",
    needs: "The student is meeting equations for the first time. Teach the meaning, demonstrate every step and why it works, correct misconceptions and scaffold before independent practice.",
    notes: "Fully explain rather than merely describe procedures. Keep worked examples and assessed problems different. Australian English. No external resources.",
  }),
  "year4-english": Object.freeze({
    topic: "Inferring a character's feelings from details in a short original story",
    area: "English",
    year: "Year 4",
    goal: "Use a clue from a supplied fictional passage to support an inference, and explain how the clue supports the interpretation",
    minutes: 30,
    delivery: "independent",
    interests: "",
    needs: "Write the full original story, model reading a specific sentence, thinking aloud about a clue and composing a complete evidence-supported answer before giving practice.",
    notes: "No copyrighted material. Do not tell the child to analyse without modelling an actual analysis.",
  }),
  "year5-science": Object.freeze({
    topic: "Evaporation, condensation and the water cycle",
    area: "Science",
    year: "Year 5",
    goal: "Explain how heating and cooling affect water in the water cycle, connect observations to mechanisms and correct common misconceptions",
    minutes: 30,
    delivery: "independent",
    interests: "",
    needs: "Explain each scientific mechanism and show a complete observation-to-evidence-to-explanation example, rather than merely listing stages.",
    notes: "Use scientifically accurate, safe, self-contained examples without requiring off-app experiments.",
  }),
  "year7-history": Object.freeze({
    topic: "Using evidence to explain a historical event",
    area: "History",
    year: "Year 7",
    goal: "Distinguish evidence from interpretation and model how to form a carefully qualified claim from a short, accurately labelled historical account",
    minutes: 30,
    delivery: "independent",
    interests: "",
    needs: "Teach the reasoning with a complete sample source and explicit worked model, including what evidence cannot prove.",
    notes: "Use genuine, verifiable historical context without invented quotations. Label constructed illustrative accounts clearly.",
  }),
  "year5-technologies": Object.freeze({
    topic: "Debugging a simple sequence of instructions",
    area: "Technologies",
    year: "Year 5",
    goal: "Read a small algorithm, trace the actions from start to finish, identify a mistake and explain a specific fix",
    minutes: 30,
    delivery: "independent",
    interests: "",
    needs: "Teach an entire worked trace with starting input, each intermediate step and expected output. Explain why the mistake causes an incorrect result before independent practice.",
    notes: "No external code editor needed; every example and question must work on-screen.",
  }),
  "year4-arts": Object.freeze({
    topic: "Using line, texture and shading to show form in a drawing",
    area: "The Arts",
    year: "Year 4",
    goal: "Understand how line direction, pressure and shading create the appearance of light and shape, and describe choices in a model demonstration",
    minutes: 30,
    delivery: "parent_guided",
    interests: "",
    needs: "Actually demonstrate the choices and sequence with clear examples, why they work and observable success criteria before inviting a creative application.",
    notes: "Use simple materials with a self-contained guided activity and an on-screen reflection.",
  }),
});
export function selectFixture(id = "year3-place-value") {
  if (!Object.hasOwn(BENCH_FIXTURES, id)) throw Error("Unknown benchmark fixture: select an explicitly approved synthetic fixture");
  return BENCH_FIXTURES[id];
}
const maxCalls = 32;
const maxGrossUsd = 0.50;
const capTokens = 60_000;

export function basicQualityReport(lesson, spec = BENCH_FIXTURES["year3-place-value"]) {
  const sz = sizeFor(spec.minutes);
  const sections = Array.isArray(lesson?.sections) ? lesson.sections : [];
  const worked = Array.isArray(lesson?.worked_examples) ? lesson.worked_examples : [];
  const guided = Array.isArray(lesson?.guided_practice) ? lesson.guided_practice : [];
  const activities = Array.isArray(lesson?.activities) ? lesson.activities : [];
  const questions = Array.isArray(lesson?.questions) ? lesson.questions : [];
  const quiz = Array.isArray(lesson?.quiz) ? lesson.quiz : [];
  const teachingWords = sections
    .map(s => String(s?.body ?? "").trim().split(/\s+/).filter(Boolean).length)
    .reduce((n, v) => n + v, 0);
  const issues = lesson ? qualityIssues(normaliseDraft(lesson, spec), spec) : [];
  return {
    gateHardFailures: issues.filter(i => i.hard).map(i => i.msg),
    gateWarnings: issues.filter(i => !i.hard).map(i => i.msg),
    sections: sections.length,
    expectedSections: sz.sections,
    workedExamples: worked.length,
    expectedExamples: sz.workedExamples,
    guidedQuestions: guided.length,
    activities: activities.length,
    writtenQuestions: questions.length,
    quizItems: quiz.length,
    teachingWords,
    requiredTeachingWords: sz.minTeachingWords,
    // Passing the automatic gate is NECESSARY, never sufficient.
    structurallyPlausible: sections.length >= sz.sections &&
      worked.length >= sz.workedExamples &&
      guided.length >= sz.guided &&
      activities.length >= sz.activities &&
      questions.length >= sz.questions &&
      quiz.length >= sz.quiz &&
      teachingWords >= sz.minTeachingWords,
  };
}

/** Approximate the actual child reading order. Private assessment answers never appear. */
export function studentReview(lesson, spec) {
  if (!lesson) return "# No lesson produced\n";
  const lines = [
    "# Synthetic lesson — child-view teaching review", "",
    "Topic: " + spec.topic + " | Year: " + spec.year + " | Mode: " + spec.delivery, "",
    "Read as a child who has never understood this concept. Does the teaching show you HOW before asking you to answer?", "",
    "## Introduction", "", String(lesson.introduction || "(missing)"),
  ];
  // The child player presents supplied readings before the explanations.
  (lesson.texts || []).forEach((t, i) => {
    lines.push("", "## Supplied reading or data " + (i + 1) + ": " + (t.title || ""), "", String(t.content || "(missing)"));
  });
  (lesson.sections || []).forEach((sec, i) => {
    lines.push("", "## Teaching " + (i + 1) + ": " + (sec.heading || ""), "", String(sec.body || "(missing)"));
  });
  (lesson.worked_examples || []).forEach((ex, i) => {
    lines.push("", "## Worked example " + (i + 1) + ": " + (ex.title || ""), "", String(ex.problem || ""));
    (ex.steps || []).forEach((step, j) => lines.push((j + 1) + ". " + step));
    lines.push("Model answer: " + (ex.answer || "(missing)"));
  });
  lines.push("", "## Guided practice — private answers hidden");
  (lesson.guided_practice || []).forEach((q, i) => lines.push("", (i + 1) + ". " + (q.prompt || ""), "Hint: " + (q.hint || "(none)")));
  lines.push("", "## Independent tasks — private answers hidden");
  (lesson.activities || []).forEach((a) => {
    lines.push("", "### " + (a.title || "Activity"), "", String(a.instructions || ""));
    (a.tasks || []).forEach((t, i) => lines.push((i + 1) + ". " + (t.prompt || "")));
  });
  lines.push("", "## Questions — private answers hidden");
  (lesson.questions || []).forEach((q, i) => lines.push((i + 1) + ". " + (q.prompt || "")));
  (lesson.quiz || []).forEach((q, i) => lines.push((i + 1) + ". " + (q.question || "") + " [" + (q.options || []).join(" / ") + "]"));
  const sharedChecklist = [
    "- [ ] Does the learner see the meaning of the concept and the prerequisite knowledge first?",
    "- [ ] Is there an ACTUAL model of the target skill, using specific numbers, quotations, evidence, data or actions?",
    "- [ ] Does the demonstration explain HOW each step was chosen and WHY it follows?",
    "- [ ] Does the teaching correct a specific likely misunderstanding?",
    "- [ ] Can the first practice question be attempted using only a method ALREADY demonstrated?",
    "- [ ] Is all required text, data and background information included here?",
    "- [ ] Does the lesson avoid revealing practice and assessment answers?",
    "- [ ] Could a previously confused student understand how to begin independently?",
  ];
  const subject = String(spec.area || "").toLowerCase();
  const specialChecklist = /math/.test(subject)
    ? [
        "- [ ] Does each new mathematical symbol have a clear meaning?",
        "- [ ] Does each calculation/equation change include WHY it is valid?",
        "- [ ] Is a solution checked in the original problem?",
      ]
    : /english/.test(subject)
    ? [
        "- [ ] Is the complete original sample passage or model composition present?",
        "- [ ] Is a specific line analysed or composed with the reasoning narrated?",
      ]
    : /science/.test(subject)
    ? [
        "- [ ] Does the child see the mechanism/cause, not just names of stages?",
        "- [ ] Is a concrete observation connected to evidence and an explanation?",
      ]
    : /history|geograph|humanit/.test(subject)
    ? [
        "- [ ] Are sources/constructed accounts accurately labelled and contextualised?",
        "- [ ] Does the model explain how specific evidence supports a limited claim?",
      ]
    : /technolog/.test(subject)
    ? [
        "- [ ] Is an entire input-to-output/process trace demonstrated?",
        "- [ ] Does the child see WHY an incorrect step fails and how the fix works?",
      ]
    : [
        "- [ ] Is an actual technique/process fully modelled with concrete choices?",
        "- [ ] Is success observable and a likely problem corrected?",
      ];
  lines.push("", "## Human quality checklist", "",
    ...sharedChecklist,
    ...specialChecklist,
    "",
    "Passing automated code checks does NOT certify these human teaching-quality questions.");
  return lines.join("\n") + "\n";
}

function credentials() {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!account || !token) throw Error(
    "Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN. No model requests were made."
  );
  return { account, token };
}

export async function compare({ dryRun = false, fixtureId = process.env.BENCHMARK_FIXTURE?.trim() || "year3-place-value" } = {}) {
  const spec = selectFixture(fixtureId);
  const modelList = process.env.BENCHMARK_MODELS?.trim()
    ? process.env.BENCHMARK_MODELS.split(",").map(m => m.trim())
    : [...BENCH_MODELS];
  if (modelList.length === 0 || modelList.length > 3 ||
      modelList.some(m => !BENCH_MODELS.includes(m) || !RATES_USD_PER_MILLION[m])) {
    throw Error("Select 1-3 explicitly supported models only.");
  }
  if (dryRun) {
    return { dryRun: true, models: modelList, fixture: fixtureId,
      hardMaxCalls: maxCalls, grossUsdCeiling: maxGrossUsd, modelRequests: 0,
      pipeline: process.env.BENCH_SPLIT_STAGES === "true" ? "split" : process.env.BENCH_FAST_PIPELINE === "true" ? "fast" : "standard" };
  }
  const { account, token } = credentials();
  const fastPipeline = process.env.BENCH_FAST_PIPELINE === "true";
  const splitStages = process.env.BENCH_SPLIT_STAGES === "true";
  const compact = process.env.BENCH_COMPACT !== "false";
  let calls = 0;
  let reservedGross = 0;
  const results = [];
  for (const model of modelList) {
    const stats = { calls: 0, input_tokens: 0, output_tokens: 0, stages: [] };
    const warnings = [];
    const started = Date.now();
    const call = async (messages, maxTokens) => {
      const chars = messages.reduce((n, m) => n + String(m.content ?? "").length, 0);
      if (chars > 120_000 || maxTokens > 6_500) throw Error("Benchmark input/output safety cap exceeded");
      // Reserve conservative cost based on maximum *possible* model output.
      const upperInput = Math.min(capTokens, Math.max(1, Math.ceil(chars / 3)));
      const upperOutput = Math.max(1, maxTokens);
      const projected = estimateGrossUsd(model, upperInput, upperOutput);
      if (projected === null || calls >= maxCalls ||
          reservedGross + projected > maxGrossUsd) {
        throw Error("Benchmark request count or US$0.50 estimate ceiling reached");
      }
      reservedGross += projected;
      calls++;
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/ai/run/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages, max_tokens: maxTokens, temperature: 0.3 }),
          signal: AbortSignal.timeout(75_000),
        }
      );
      if (!response.ok) throw Error(`Workers AI returned HTTP ${response.status}`);
      const payload = await response.json();
      if (!payload?.success || !payload.result) throw Error("Workers AI did not return a result");
      return payload.result;
    };
    let lesson = null;
    let failure = null;
    try {
      lesson = await generateStaged(call, spec, stats, warnings, compact, fastPipeline, splitStages);
    } catch (e) {
      failure = e instanceof Error ? e.message : "Unknown model generation failure";
    }
    const report = {
      model,
      fixture: fixtureId,
      compact,
      fastPipeline,
      splitStages,
      durationMs: Date.now() - started,
      modelCalls: stats.calls,
      error: failure ?? stats.failed ?? null,
      warnings: warnings.length,
      quality: basicQualityReport(lesson, spec),
      generation: generationReport(stats, model),
    };
    results.push(report);
    if (process.env.BENCH_REPORT_DIR && lesson) {
      // Synthetic material only. NEVER use a real student profile in this tool.
      await mkdir(process.env.BENCH_REPORT_DIR, { recursive: true });
      const prefix = process.env.BENCH_REPORT_DIR + "/" + fixtureId + "-" + model.split("/").pop();
      await writeFile(prefix + ".json", JSON.stringify({ report, lesson }, null, 2));
      await writeFile(prefix + "-child-view.md", studentReview(lesson, spec));
    }
  }
  return { fixture: fixtureId, calls, reservedGrossUsd: reservedGross, results,
    note: "Developer benchmark only. Automatic checks do not verify factual/educational correctness; manually assess lessons. Cloudflare billing is authoritative." };
}

// Importable from local tests without initiating requests or reading secrets.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dryRun = process.argv.includes("--dry-run");
  compare({ dryRun }).then(r => {
    console.log(JSON.stringify(r, null, 2));
  }).catch(error => {
    console.error("Benchmark stopped:", error instanceof Error ? error.message : "Unknown error");
    process.exitCode = 1;
  });
}
