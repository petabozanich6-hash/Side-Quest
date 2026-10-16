import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
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
