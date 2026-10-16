import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { overview } from "../src/adminData.ts";
import { defaultSettings } from "../src/platformSettings.ts";
import {
  aiCostSummary, ensureAiCostSchema, estimateGrossUsd, meterWorkersAi, tokenCounts,
  DEFAULT_WORKERS_AI_MODEL, RATES_USD_PER_MILLION,
} from "../src/aiCost.ts";

test("Workers AI cost estimates use documented rates; unknown models are unpriced", () => {
  const model=DEFAULT_WORKERS_AI_MODEL;
  assert.deepEqual(RATES_USD_PER_MILLION[model],{input:0.293,output:2.253});
  assert.equal(estimateGrossUsd(model,1_000_000,1_000_000),2.546);
  assert.equal(estimateGrossUsd("@cf/unknown-model",10,10),null);
  assert.deepEqual(tokenCounts({messages:[{role:"user",content:"testing"}]},{usage:{prompt_tokens:100,completion_tokens:50},response:"ok"}),{input:100,output:50,basis:"reported"});
  assert.deepEqual(tokenCounts({messages:[{role:"user",content:"one two three four"}]},{response:"hello world"}),{input:5,output:3,basis:"approximate"});
});

test("all model calls are logged without retaining messages, responses, family identifiers or emails",async()=>{
  const db=makeDb();
  const inputText="CHILD-PRIVATE-SECRET";
  const ai={
    run: async()=>({response:"CHILD-PRIVATE-RESPONSE",usage:{prompt_tokens:2000,completion_tokens:300}}),
  };
  const env=meterWorkersAi({DB:db,JWT_SECRET:"test",AI:ai});
  const payload={messages:[{role:"user",content:inputText}]};
  const r=await env.AI.run(DEFAULT_WORKERS_AI_MODEL,payload);
  assert.equal(r.response,"CHILD-PRIVATE-RESPONSE");
  const rows=db.raw.prepare("SELECT * FROM ai_calls").all();
  assert.equal(rows.length,1);
  assert.equal(rows[0].token_basis,"reported");
  assert.equal(rows[0].input_tokens,2000);
  assert.equal(rows[0].output_tokens,300);
  assert.equal(rows[0].status,"completed");
  assert.equal(rows[0].estimated_usd,estimateGrossUsd(DEFAULT_WORKERS_AI_MODEL,2000,300));
  assert.ok(!JSON.stringify(rows).includes("CHILD-PRIVATE"));
  const sum=await aiCostSummary(db);
  assert.equal(sum.configured,true);
  assert.equal(sum.tracked_calls_30d,1);
  assert.equal(sum.reported_tokens_30d,1);
  assert.equal(sum.approximate_tokens_30d,0);
  assert.equal(sum.unpriced_calls_30d,0);
  assert.equal(sum.estimated_gross_30d_usd,rows[0].estimated_usd);
  assert.equal(sum.invoiced,false,"never claim an actual Cloudflare invoice");
});

test("the production waitUntil path never delays the AI response for cost writes", async () => {
  const db = makeDb();
  const jobs = [];
  const ctx = { waitUntil: promise => { jobs.push(promise); } };
  const env = meterWorkersAi({
    DB: db, JWT_SECRET: "test",
    AI: { run: async () => ({ response: "Ready", usage: { prompt_tokens: 20, completion_tokens: 10 } }) },
  }, ctx);
  const response = await env.AI.run("@cf/qwen/qwen3-30b-a3b-fp8", { messages: [{ role: "user", content: "child detail must not be logged" }] });
  assert.equal(response.response, "Ready");
  assert.equal(jobs.length, 1);
  await Promise.all(jobs);
  const rows = db.raw.prepare("SELECT * FROM ai_calls").all();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].model, "@cf/qwen/qwen3-30b-a3b-fp8");
  assert.equal(rows[0].status, "completed");
  assert.ok(!JSON.stringify(rows).includes("child detail"));
  assert.deepEqual(RATES_USD_PER_MILLION["@cf/openai/gpt-oss-20b"], { input: 0.2, output: 0.3 });
});

test("when a provider doesn't return usage, approximation is labelled and unknown prices remain unpriced",async()=>{
  const db=makeDb();
  const original=meterWorkersAi({DB:db,JWT_SECRET:"test",AI:{run:async()=>({response:"Generated answer here."})}});
  await original.AI.run(DEFAULT_WORKERS_AI_MODEL,{messages:[{role:"user",content:"A prompt with about 28 chars"}]});
  await original.AI.run("@cf/unknown-model",{messages:[{role:"user",content:"Prompt"}]});
  const sum=await aiCostSummary(db);
  assert.equal(sum.tracked_calls_30d,2);
  assert.equal(sum.approximate_tokens_30d,2);
  assert.equal(sum.unpriced_calls_30d,1);
  assert.ok(sum.estimated_gross_30d_usd>0);
  assert.match(sum.note,/free allocation/);
});

test("provider failures preserve the original error; metering failures do not break AI",async()=>{
  const db=makeDb();
  const env=meterWorkersAi({DB:db,JWT_SECRET:"test",AI:{run:async()=>{throw new Error("provider down")}}});
  await assert.rejects(env.AI.run(DEFAULT_WORKERS_AI_MODEL,{messages:[]}),/provider down/);
  let sum=await aiCostSummary(db);
  assert.equal(sum.failed_calls_30d,1);
  assert.equal(sum.estimated_gross_30d_usd,0);
  const brokenDb={prepare:()=>{throw new Error("D1 telemetry down")}};
  const ok=meterWorkersAi({DB:brokenDb,JWT_SECRET:"test",AI:{run:async()=>({response:"Still works"})}});
  assert.equal((await ok.AI.run(DEFAULT_WORKERS_AI_MODEL,{messages:[]})).response,"Still works");
  // Re-running the schema set-up is safe for both actual migrations and runtime creates.
  await ensureAiCostSchema(db);
  sum=await aiCostSummary(db);
  assert.equal(sum.tracked_calls_30d,1);
});


test("Owner HQ reports R2 bound when BUCKET exists and exposes tracked AI estimates, never invoice amounts",async()=>{
  const db=makeDb();
  const env={DB:db,JWT_SECRET:"test-only",BUCKET:{list:async()=>({objects:[]})},AI:{run:async()=>({response:"Yes",usage:{prompt_tokens:1000,completion_tokens:100}})}};
  const metered=meterWorkersAi(env);
  await metered.AI.run(DEFAULT_WORKERS_AI_MODEL,{messages:[{role:"user",content:"test"}]});
  const snapshot=await overview(metered,defaultSettings());
  assert.equal(snapshot.storage.configured,true);
  assert.equal(snapshot.storage.files,0);
  assert.equal(snapshot.ai.cost.configured,true);
  assert.ok(snapshot.ai.cost.estimated_gross_30d_usd>0);
  assert.equal(snapshot.ai.cost.invoiced,false);
  assert.equal("actual_invoice" in snapshot.ai.cost,false);
  const unbound=await overview({...metered,BUCKET:undefined},defaultSettings());
  assert.equal(unbound.storage.configured,false);
});

// ---------------------------------------------------------------- model routing

const { routingConfig, modelFor, withMeta, MODELS } = await import("../src/aiRouting.ts");
const { aiCostBreakdown, usdToAud, resetFxCache, callTimeoutMs } = await import("../src/aiCost.ts");
const QWEN = "@cf/qwen/qwen3-30b-a3b-fp8";

test("routing is off by default; only allow-listed models and known tasks can be routed", () => {
  assert.equal(modelFor(routingConfig({ AI_MODEL_ROUTES: JSON.stringify({ outcome_match: QWEN }) }), "outcome_match", DEFAULT_WORKERS_AI_MODEL), DEFAULT_WORKERS_AI_MODEL, "flag off: no change");
  const cfg = routingConfig({ AI_ROUTING_ENABLED: "true", AI_MODEL_ROUTES: JSON.stringify({ outcome_match: QWEN, lesson_section: "@cf/evil/model", nope: QWEN }) });
  assert.equal(modelFor(cfg, "outcome_match", DEFAULT_WORKERS_AI_MODEL), QWEN);
  assert.equal(modelFor(cfg, "outcome_match", DEFAULT_WORKERS_AI_MODEL, 2), DEFAULT_WORKERS_AI_MODEL, "a retry goes back to the caller's model");
  assert.equal(modelFor(cfg, "lesson_section", DEFAULT_WORKERS_AI_MODEL), DEFAULT_WORKERS_AI_MODEL, "unlisted model ignored");
  assert.equal(cfg.problems.length, 2);
  assert.equal(routingConfig({ AI_ROUTING_ENABLED: "true", AI_MODEL_ROUTES: "{bad" }).problems.length, 1);
  for (const m of Object.values(MODELS)) assert.ok(m.input > 0 && m.output > 0 && m.context > 0);
  assert.deepEqual(RATES_USD_PER_MILLION[QWEN], { input: 0.0509, output: 0.335 });
});

test("a routed call uses the routed model, strips metadata, and falls back once to the caller's model on error", async () => {
  const db = makeDb();
  const seen = [];
  const ai = { run: async (model, input, options) => {
    seen.push({ model, options });
    if (model === QWEN && input.fail) throw new Error("model unavailable");
    return { response: "{}", usage: { prompt_tokens: 10, completion_tokens: 5 } };
  } };
  const env = meterWorkersAi({ DB: db, JWT_SECRET: "t", AI: ai, AI_ROUTING_ENABLED: "true", AI_MODEL_ROUTES: JSON.stringify({ outcome_match: QWEN }) });
  await env.AI.run(DEFAULT_WORKERS_AI_MODEL, { messages: [] }, withMeta({ gateway: { id: "g" } }, { task: "outcome_match", generation: "gen-1" }));
  assert.equal(seen[0].model, QWEN);
  assert.deepEqual(seen[0].options, { gateway: { id: "g" } }, "Workers AI never sees Side-Quest metadata");
  await env.AI.run(DEFAULT_WORKERS_AI_MODEL, { messages: [], fail: true }, withMeta(undefined, { task: "outcome_match", generation: "gen-1" }));
  assert.deepEqual(seen.slice(1).map((s) => s.model), [QWEN, DEFAULT_WORKERS_AI_MODEL]);
  assert.equal(seen[2].options, undefined);
  const rows = db.raw.prepare("SELECT model, requested_model, task, generation_id, fallback, status FROM ai_calls ORDER BY rowid").all();
  assert.deepEqual(rows.map((r) => [r.model, r.fallback, r.status]), [[QWEN, 0, "completed"], [QWEN, 0, "failed"], [DEFAULT_WORKERS_AI_MODEL, 1, "completed"]]);
  assert.ok(rows.every((r) => r.task === "outcome_match" && r.generation_id === "gen-1" && r.requested_model === DEFAULT_WORKERS_AI_MODEL));
  const b = await aiCostBreakdown(db);
  assert.equal(b.generations.count, 1);
  assert.equal(b.generations.avg_calls, 3);
  assert.equal(b.rows.find((r) => r.model === QWEN).failed, 1);
  assert.equal(b.rows.find((r) => r.model === DEFAULT_WORKERS_AI_MODEL).fallbacks, 1);
});

test("an AI call that hangs times out (when configured) and is recorded as a timeout", async () => {
  assert.equal(callTimeoutMs({}), 0, "no timeout unless asked: unchanged behaviour");
  assert.equal(callTimeoutMs({ AI_FAST_PIPELINE: "true" }), 90000);
  assert.equal(callTimeoutMs({ AI_CALL_TIMEOUT_MS: "100" }), 0, "silly values ignored");
  const db = makeDb();
  const env = meterWorkersAi({ DB: db, JWT_SECRET: "t", AI_CALL_TIMEOUT_MS: "5000", AI: { run: () => new Promise(() => {}) } });
  const realSetTimeout = globalThis.setTimeout;
  globalThis.setTimeout = (fn, _ms) => realSetTimeout(fn, 1);
  try {
    await assert.rejects(env.AI.run(DEFAULT_WORKERS_AI_MODEL, { messages: [] }), /did not answer/);
  } finally { globalThis.setTimeout = realSetTimeout; }
  assert.equal(db.raw.prepare("SELECT status FROM ai_calls").get().status, "timeout");
});

test("AUD conversion uses the ECB rate via Frankfurter and is never invented", async () => {
  resetFxCache();
  assert.equal(await usdToAud(async () => new Response("nope", { status: 500 })), null);
  assert.equal(await usdToAud(async () => new Response(JSON.stringify({ rates: { AUD: 99 }, date: "2026-10-15" }))), null, "implausible rate rejected");
  const fx = await usdToAud(async (url) => { assert.match(String(url), /api\.frankfurter\.app\/latest\?from=USD&to=AUD/); return new Response(JSON.stringify({ rates: { AUD: 1.52 }, date: "2026-10-15" })); });
  assert.deepEqual(fx, { rate: 1.52, date: "2026-10-15", source: "European Central Bank reference rate via api.frankfurter.app" });
  assert.equal((await usdToAud(async () => { throw new Error("cached, not fetched"); })).rate, 1.52);
  resetFxCache();
});
