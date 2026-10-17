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
import { generateStaged, generationReport, sizeFor } from "../src/aiDraft.ts";
import { estimateGrossUsd, RATES_USD_PER_MILLION } from "../src/aiCost.ts";

export const BENCH_MODELS = Object.freeze([
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "@cf/qwen/qwen3-30b-a3b-fp8",
  "@cf/google/gemma-4-26b-a4b-it",
]);
const SPEC = Object.freeze({
  topic: "Place value to 1,000",
  area: "Mathematics",
  year: "Year 3",
  goal: "Read, partition, compare and explain three-digit numbers",
  minutes: 30,
  delivery: "parent_guided",
  interests: "gardening",
  needs: "Include explicit worked examples and clear scaffolded practice",
  notes: "Use Australian English; no external links or worksheets",
});
const maxCalls = 32;
const maxGrossUsd = 0.50;
const capTokens = 60_000;

export function basicQualityReport(lesson) {
  const sz = sizeFor(SPEC.minutes);
  const sections = Array.isArray(lesson?.sections) ? lesson.sections : [];
  const worked = Array.isArray(lesson?.worked_examples) ? lesson.worked_examples : [];
  const guided = Array.isArray(lesson?.guided_practice) ? lesson.guided_practice : [];
  const activities = Array.isArray(lesson?.activities) ? lesson.activities : [];
  const questions = Array.isArray(lesson?.questions) ? lesson.questions : [];
  const quiz = Array.isArray(lesson?.quiz) ? lesson.quiz : [];
  const teachingWords = sections
    .map(s => String(s?.body ?? "").trim().split(/\s+/).filter(Boolean).length)
    .reduce((n, v) => n + v, 0);
  return {
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

function credentials() {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!account || !token) throw Error(
    "Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN. No model requests were made."
  );
  return { account, token };
}

export async function compare({ dryRun = false } = {}) {
  const modelList = process.env.BENCHMARK_MODELS?.trim()
    ? process.env.BENCHMARK_MODELS.split(",").map(m => m.trim())
    : [...BENCH_MODELS];
  if (modelList.length === 0 || modelList.length > 3 ||
      modelList.some(m => !BENCH_MODELS.includes(m) || !RATES_USD_PER_MILLION[m])) {
    throw Error("Select 1-3 explicitly supported models only.");
  }
  if (dryRun) {
    return { dryRun: true, models: modelList, fixture: "synthetic Year 3 place value",
      hardMaxCalls: maxCalls, grossUsdCeiling: maxGrossUsd, modelRequests: 0 };
  }
  const { account, token } = credentials();
  let calls = 0;
  let reservedGross = 0;
  const results = [];
  for (const model of modelList) {
    const stats = { calls: 0, input_tokens: 0, output_tokens: 0, stages: [] };
    const warnings = [];
    const started = Date.now();
    const call = async (messages, maxTokens) => {
      const chars = messages.reduce((n, m) => n + String(m.content ?? "").length, 0);
      if (chars > 120_000 || maxTokens > 4_096) throw Error("Benchmark input/output safety cap exceeded");
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
      lesson = await generateStaged(call, SPEC, stats, warnings, true);
    } catch (e) {
      failure = e instanceof Error ? e.message : "Unknown model generation failure";
    }
    const report = {
      model,
      compact: true,
      durationMs: Date.now() - started,
      modelCalls: stats.calls,
      error: failure ?? stats.failed ?? null,
      warnings: warnings.length,
      quality: basicQualityReport(lesson),
      generation: generationReport(stats, model),
    };
    results.push(report);
    if (process.env.BENCH_REPORT_DIR && lesson) {
      // Synthetic material only. NEVER use a real student profile in this tool.
      await mkdir(process.env.BENCH_REPORT_DIR, { recursive: true });
      await writeFile(
        `${process.env.BENCH_REPORT_DIR}/${model.split("/").pop()}.json`,
        JSON.stringify({ report, lesson }, null, 2)
      );
    }
  }
  return { calls, reservedGrossUsd: reservedGross, results,
    note: "Developer benchmark only. Automatic checks do not verify factual/educational correctness; manually assess lessons. Cloudflare billing is authoritative." };
}

const dryRun = process.argv.includes("--dry-run");
compare({ dryRun }).then(r => {
  console.log(JSON.stringify(r, null, 2));
}).catch(error => {
  console.error("Benchmark stopped:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
