import test from "node:test";
import assert from "node:assert/strict";
import { basicQualityReport, compare, BENCH_MODELS } from "../scripts/compare-cloudflare-ai.mjs";
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
