// Reproducible lesson-generation benchmark.
//
//   node --no-warnings --import ./worker/test/register.mjs worker/scripts/ai-benchmark.mjs [options]
//
// Runs the real lesson pipeline (draftLessonWithAi: every stage, retry, repair, quality gate, outcome
// matching and saving) against a local in-memory database, for a fixed set of English, Maths and Science
// requests across ages and jurisdictions, under each configuration asked for.
//
// Two backends, and the report always says which one produced the numbers:
//   --backend simulated   (default) No model is called. Replies are the reference garden lesson and each call
//                         "takes" 0.6 s + output tokens / --tokens-per-second (default 40). This measures the
//                         ORCHESTRATION only: number of calls, how many run in parallel, and the resulting
//                         critical path. It says nothing about real model speed, cost or teaching quality.
//   --backend workers-ai  Real Cloudflare Workers AI over the REST API. Needs CLOUDFLARE_ACCOUNT_ID and
//                         CLOUDFLARE_API_TOKEN (Workers AI read/run). This incurs real (small) charges.
//                         Measured wall time, tokens, estimated USD, retries, fallbacks and quality warnings;
//                         every generated lesson is saved for human review.
//
// Options:
//   --configs baseline,fast,compact,fast+compact   which pipelines to compare (default: baseline,fast)
//   --routes '{"outcome_match":"@cf/qwen/qwen3-30b-a3b-fp8"}'  AI_MODEL_ROUTES for a "routed" config
//   --model @cf/meta/llama-3.3-70b-instruct-fp8-fast             main model (AI_MODEL)
//   --runs 1                 repetitions of each scenario per config
//   --only maths-y3          run a single scenario
//   --out path.json          write full results (default: ./ai-benchmark-<backend>-<timestamp>.json)
//   --scale 0.05             simulated backend only: real seconds slept per simulated second
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { makeDb } from "../test/fakeD1.mjs";
import * as aid from "../src/aiDraft.ts";
import { meterWorkersAi } from "../src/aiCost.ts";

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => {
  if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : "true"]);
  return acc;
}, []));
const BACKEND = args.backend || "simulated";
const MODEL = args.model || aid.DEFAULT_MODEL;
const RUNS = Math.max(1, Number(args.runs || 1));
const SCALE = Math.min(1, Math.max(0.001, Number(args.scale || 0.05)));
const TPS = Math.max(1, Number(args["tokens-per-second"] || 40));
const CONFIGS = (args.configs || "baseline,fast").split(",").map((s) => s.trim()).filter(Boolean);
if (args.routes) CONFIGS.push("routed");

// Fixed requests: three subjects, Foundation to Year 9, five jurisdictions. No real child information.
const SCENARIOS = [
  { id: "maths-y3", jurisdiction: "NSW", request: { request: "Create a 30-minute Year 3 maths lesson about adding two-digit numbers with regrouping.", learning_area: "Mathematics", year_level: "Year 3", duration_minutes: 30 } },
  { id: "english-y4", jurisdiction: "VIC", request: { request: "Create a one-hour Year 4 English lesson on writing a persuasive paragraph.", learning_area: "English", year_level: "Year 4", duration_minutes: 60 } },
  { id: "science-y7", jurisdiction: "QLD", request: { request: "Create a one-hour Year 7 science lesson on separating mixtures. My child works independently.", learning_area: "Science", year_level: "Year 7", duration_minutes: 60 } },
  { id: "maths-y9", jurisdiction: "WA", request: { request: "Create a 45-minute Year 9 maths lesson on solving two-step linear equations.", learning_area: "Mathematics", year_level: "Year 9", duration_minutes: 45 } },
  { id: "english-f", jurisdiction: "SA", request: { request: "Create a 30-minute Foundation English lesson about rhyming words, guided by me.", learning_area: "English", year_level: "Foundation", duration_minutes: 30 } },
].filter((s) => !args.only || s.id === args.only);

const ENV_FOR = {
  baseline: {},
  fast: { AI_FAST_PIPELINE: "true" },
  compact: { AI_COMPACT_GENERATION: "true" },
  "fast+compact": { AI_FAST_PIPELINE: "true", AI_COMPACT_GENERATION: "true" },
  routed: { AI_ROUTING_ENABLED: "true", AI_MODEL_ROUTES: args.routes || "{}" },
};

// ---------------------------------------------------------------- backends

const GARDEN = JSON.parse(readFileSync(new URL("../../frontend/src/data/exampleLesson.json", import.meta.url), "utf8"));
const STAGE1 = ["title", "teaching_plan", "why_it_matters", "prior_knowledge", "objectives", "key_words", "misconceptions"];
function referenceReply(input) {
  const u = input.messages.at(-1).content;
  const g = GARDEN;
  const pick = (ks) => Object.fromEntries(ks.filter((k) => g[k] !== undefined).map((k) => [k, g[k]]));
  if (input.messages[0].content.includes("match a school lesson to curriculum outcomes")) return { matches: [1] };
  if (u.includes("STAGE 1:")) return { ...pick(STAGE1), sequence: g.sections.map((x) => ({ heading: x.heading, idea: "i", how: "h", key_points: [] })), worked_examples: g.worked_examples.map((w) => ({ title: w.title, problem: w.problem, skill: "s" })) };
  if (u.includes("STAGE 2:")) return pick(["introduction", "texts", "consolidation"]);
  if (u.includes("STAGE 3, GROUPED TEACHING")) return { sections: [...u.matchAll(/^SECTION (\d+):/gm)].map((m) => g.sections[Number(m[1]) - 1]) };
  if (u.includes("STAGE 3, GROUPED WORKED EXAMPLES")) return { worked_examples: [...u.matchAll(/^EXAMPLE (\d+):/gm)].map((m) => g.worked_examples[Number(m[1]) - 1]) };
  let m = u.match(/STAGE 3, SECTION (\d+) OF/);
  if (m) return g.sections[Number(m[1]) - 1];
  m = u.match(/STAGE 3, WORKED EXAMPLE (\d+) OF/);
  if (m) return g.worked_examples[Number(m[1]) - 1];
  if (u.includes("STAGE 4, PRACTICE")) return pick(["guided_practice", "activities"]);
  if (u.includes("STAGE 4, ASSESSMENT")) return Object.fromEntries(Object.entries(g).filter(([k]) => !["title", "teaching_plan", "why_it_matters", "prior_knowledge", "objectives", "key_words", "misconceptions", "introduction", "texts", "consolidation", "sections", "worked_examples", "guided_practice", "activities", "answer_key"].includes(k)));
  return g;
}
const simulatedAi = {
  run: async (model, input) => {
    const text = JSON.stringify(referenceReply(input));
    const inTokens = Math.ceil(JSON.stringify(input.messages).length / 4);
    const outTokens = Math.min(Number(input.max_tokens) || 4000, Math.ceil(text.length / 4));
    const simulatedMs = 600 + (outTokens / TPS) * 1000;
    await new Promise((r) => setTimeout(r, simulatedMs * SCALE));
    return { response: text, usage: { prompt_tokens: inTokens, completion_tokens: outTokens } };
  },
};
function workersAi() {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID, token = process.env.CLOUDFLARE_API_TOKEN;
  if (!account || !token) throw new Error("--backend workers-ai needs CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN");
  return {
    run: async (model, input) => {
      const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${model}`, {
        method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify(input),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.success === false) throw new Error(`Workers AI ${r.status}: ${JSON.stringify(j.errors || j).slice(0, 200)}`);
      return j.result;
    },
  };
}

// ---------------------------------------------------------------- run

async function one(scenario, config) {
  const db = makeDb();
  const fam = "bench-family";
  db.raw.prepare("INSERT INTO families (id, name, owner_id, created_at, plan) VALUES (?, 'Bench', 'bench-user', ?, 'INTERNAL')").run(fam, new Date().toISOString());
  try { db.raw.prepare("UPDATE families SET jurisdiction = ? WHERE id = ?").run(scenario.jurisdiction, fam); } catch { /* older schema */ }
  const env = { DB: db, JWT_SECRET: "bench", AI: BACKEND === "workers-ai" ? workersAi() : simulatedAi, AI_MODEL: MODEL, ...ENV_FOR[config] };
  const metered = meterWorkersAi(env);
  const started = Date.now();
  const r = await aid.draftLessonWithAi(db, metered.AI, {
    familyId: fam, userId: "bench-user", model: MODEL, compact: env.AI_COMPACT_GENERATION === "true", fast: env.AI_FAST_PIPELINE === "true",
    request: { ...scenario.request, link_outcomes: true },
  });
  const wallMs = Date.now() - started;
  const calls = db.raw.prepare("SELECT model, task, attempt, fallback, input_tokens, output_tokens, estimated_usd, duration_ms, status FROM ai_calls").all();
  const factor = BACKEND === "simulated" ? 1 / SCALE : 1;
  return {
    scenario: scenario.id, config, ok: r.ok, error: r.ok ? null : r.detail,
    wall_ms: Math.round(wallMs * factor),
    calls: calls.length,
    retries: calls.filter((c) => c.attempt > 1).length,
    fallbacks: calls.filter((c) => c.fallback).length,
    failed_calls: calls.filter((c) => c.status !== "completed").length,
    input_tokens: calls.reduce((s, c) => s + (c.input_tokens || 0), 0),
    output_tokens: calls.reduce((s, c) => s + (c.output_tokens || 0), 0),
    estimated_usd: calls.reduce((s, c) => s + (c.status === "completed" ? c.estimated_usd || 0 : 0), 0),
    models: [...new Set(calls.map((c) => c.model))],
    // Longest single call per task: the critical path is made of these.
    slowest_call_ms_by_task: Object.fromEntries([...new Set(calls.map((c) => c.task))].map((t) => [t, Math.round(Math.max(...calls.filter((c) => c.task === t).map((c) => c.duration_ms || 0)) * factor)])),
    warnings: r.ok ? r.warnings : [],
    lesson: BACKEND === "workers-ai" && r.ok ? r.lesson : undefined,
  };
}

const results = [];
for (const config of CONFIGS) {
  if (!ENV_FOR[config]) throw new Error(`Unknown config ${config}`);
  for (const s of SCENARIOS) for (let i = 0; i < RUNS; i++) {
    const row = await one(s, config);
    results.push(row);
    process.stderr.write(`${config.padEnd(13)} ${s.id.padEnd(11)} ${row.ok ? "ok " : "FAIL"} ${(row.wall_ms / 1000).toFixed(1)}s ${row.calls} calls\n`);
  }
}

const label = BACKEND === "simulated"
  ? `SIMULATED (no model called; ${TPS} output tokens/s + 0.6 s per call). Orchestration only: not real speed, cost or quality.`
  : `MEASURED on Cloudflare Workers AI, main model ${MODEL}.`;
const median = (xs) => { const a = [...xs].sort((x, y) => x - y); return a.length ? a[Math.floor((a.length - 1) / 2)] : null; };
const lines = [`# Lesson generation benchmark`, ``, `Backend: ${label}`, `Runs per scenario: ${RUNS}. Date: ${new Date().toISOString().slice(0, 10)}.`, ``,
  `| Config | Lessons OK | Median wall time | Median calls | Retries | Fallbacks | Est. USD per lesson |`, `| --- | --- | --- | --- | --- | --- | --- |`];
for (const config of CONFIGS) {
  const rows = results.filter((r) => r.config === config);
  const okRows = rows.filter((r) => r.ok);
  lines.push(`| ${config} | ${okRows.length}/${rows.length} | ${((median(okRows.map((r) => r.wall_ms)) || 0) / 1000).toFixed(1)} s | ${median(okRows.map((r) => r.calls))} | ${rows.reduce((s, r) => s + r.retries, 0)} | ${rows.reduce((s, r) => s + r.fallbacks, 0)} | ${BACKEND === "simulated" ? "n/a (simulated)" : "$" + (median(okRows.map((r) => r.estimated_usd)) || 0).toFixed(4)} |`);
}
const tasks = [...new Set(results.flatMap((r) => Object.keys(r.slowest_call_ms_by_task || {})))];
lines.push("", "Slowest single call per stage (median across scenarios):", "", `| Config | ${tasks.join(" | ")} |`, `| --- | ${tasks.map(() => "---").join(" | ")} |`);
for (const config of CONFIGS) {
  const rows = results.filter((r) => r.config === config && r.ok);
  lines.push(`| ${config} | ${tasks.map((t) => { const v = median(rows.map((r) => r.slowest_call_ms_by_task?.[t]).filter((x) => x != null)); return v == null ? "—" : (v / 1000).toFixed(1) + " s"; }).join(" | ")} |`);
}
lines.push("", "Per scenario:", "", "| Config | Scenario | OK | Wall time | Calls |", "| --- | --- | --- | --- | --- |");
for (const r of results) lines.push(`| ${r.config} | ${r.scenario} | ${r.ok ? "yes" : "no: " + r.error} | ${(r.wall_ms / 1000).toFixed(1)} s | ${r.calls} |`);
const out = resolve(args.out || `ai-benchmark-${BACKEND}-${Date.now()}.json`);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ backend: BACKEND, label, model: MODEL, runs: RUNS, scale: BACKEND === "simulated" ? SCALE : null, tokens_per_second: BACKEND === "simulated" ? TPS : null, results }, null, 2));
console.log(lines.join("\n"));
console.log(`\nFull results: ${out}`);
