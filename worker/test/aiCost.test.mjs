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
  const rows=db.raw.prepare("SELECT * FROM ai_inference_costs").all();
  assert.equal(rows.length,1);
  assert.equal(rows[0].token_basis,"reported");
  assert.equal(rows[0].input_tokens,2000);
  assert.equal(rows[0].output_tokens,300);
  assert.equal(rows[0].status,"completed");
  assert.equal(typeof rows[0].duration_ms,"number");
  assert.equal(rows[0].estimated_usd,estimateGrossUsd(DEFAULT_WORKERS_AI_MODEL,2000,300));
  assert.ok(!JSON.stringify(rows).includes("CHILD-PRIVATE"));
  const sum=await aiCostSummary(db);
  assert.equal(sum.configured,true);
  assert.equal(sum.tracked_calls_30d,1);
  assert.equal(sum.models_30d[0].model, DEFAULT_WORKERS_AI_MODEL);
  assert.equal(sum.models_30d[0].calls,1);
  assert.equal(sum.models_30d[0].timed_calls,1);
  assert.ok(sum.mean_call_ms_30d >= 0);
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
  const rows = db.raw.prepare("SELECT * FROM ai_inference_costs").all();
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

test("older D1 schemas keep recording AI costs until the additive latency migration is approved", async () => {
  const db=makeDb("0070_ai_inference_latency.sql");
  const metered=meterWorkersAi({
    DB:db, JWT_SECRET:"test", AI:{run:async()=>({response:"Ready",usage:{prompt_tokens:20,completion_tokens:30}})},
  });
  const result=await metered.AI.run(DEFAULT_WORKERS_AI_MODEL,{messages:[{role:"user",content:"test"}]});
  assert.equal(result.response,"Ready");
  const legacy=db.raw.prepare("SELECT model,status FROM ai_inference_costs").all();
  assert.equal(legacy.length,1);
  const sum=await aiCostSummary(db);
  assert.equal(sum.tracked_calls_30d,1);
  assert.equal(sum.mean_call_ms_30d,null);
  assert.deepEqual(sum.models_30d,[]);
});
