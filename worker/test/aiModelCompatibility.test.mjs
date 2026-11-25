import test from "node:test";
import assert from "node:assert/strict";
import { normaliseRetiredTextOverrides, RETIRED_TEXT_MODELS } from "../src/aiModelCompatibility.ts";
import { DEFAULT_WORKERS_AI_MODEL } from "../src/aiCost.ts";
test("retired text overrides use the existing supported default without mutating bindings",()=>{
 for (const model of RETIRED_TEXT_MODELS) {
   const env={AI_MODEL:model,AI_HELP_MODEL:model,AI:{run(){}}};
   const safe=normaliseRetiredTextOverrides(env);
   assert.equal(safe.AI_MODEL,DEFAULT_WORKERS_AI_MODEL);
   assert.equal(safe.AI_HELP_MODEL,DEFAULT_WORKERS_AI_MODEL);
   assert.equal(safe.AI,env.AI);
   assert.equal(env.AI_MODEL,model);
 }
});
test("valid settings are unchanged; retired help can use the supported main override",()=>{
 const env={AI_MODEL:"@cf/google/gemma-4-26b-a4b-it",AI_HELP_MODEL:"@cf/openai/gpt-oss-20b"};
 assert.equal(normaliseRetiredTextOverrides(env),env);
 assert.equal(normaliseRetiredTextOverrides({}).AI_MODEL,undefined);
 const safe=normaliseRetiredTextOverrides({...env,AI_HELP_MODEL:"@cf/qwen/qwen3-30b-a3b-fp8"});
 assert.equal(safe.AI_MODEL,env.AI_MODEL);
 assert.equal(safe.AI_HELP_MODEL,env.AI_MODEL);
});
