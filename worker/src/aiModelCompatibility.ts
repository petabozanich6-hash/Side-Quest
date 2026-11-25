import type { Env } from "./types";
import { DEFAULT_WORKERS_AI_MODEL } from "./aiCost";
// Cloudflare's November 20 2026 retirement list (text models only).
// Retain historical price entries in aiCost.ts so past metering stays interpretable.
// Only the two configurable text model overrides are normalised; never remap image,
// audio, embedding or vision calls to a text model.
export const RETIRED_TEXT_MODELS = new Set([
 "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
 "@cf/nvidia/nemotron-3-120b-a12b",
 "@cf/deepseek-ai/deepseek-v4-pro-0813",
 "@cf/deepseek-ai/deepseek-v4-flash-0731",
 "@cf/qwen/qwq-32b",
 "@cf/qwen/qwen3-30b-a3b-fp8",
 "@cf/moonshotai/kimi-k2.6",
 "@cf/moonshotai/kimi-k2.7-code",
 "@cf/zai-org/glm-5.2",
 "@cf/zai-org/glm-5.3-flash",
 "@cf/meta/llama-2-7b-chat-hf-lora",
 "@cf/google/gemma-2b-it-lora",
 "@cf/google/gemma-7b-it-lora",
 "@cf/meta/llama-3.1-8b-instruct-fp8",
 "@cf/meta/llama-3.2-1b-instruct",
 "@cf/meta/llama-3.2-3b-instruct",
]);
export function normaliseRetiredTextOverrides(env: Env): Env {
 const mainRetired = RETIRED_TEXT_MODELS.has(env.AI_MODEL?.trim() || "");
 const helpRetired = RETIRED_TEXT_MODELS.has(env.AI_HELP_MODEL?.trim() || "");
 if (!mainRetired && !helpRetired) return env;
 // Use the existing production default, not an untested new model or extra retry.
 // This may change inference cost if a cheaper retired override was configured.
 return { ...env, ...(mainRetired ? { AI_MODEL: DEFAULT_WORKERS_AI_MODEL } : {}),
   ...(helpRetired ? { AI_HELP_MODEL: mainRetired ? DEFAULT_WORKERS_AI_MODEL : env.AI_MODEL || DEFAULT_WORKERS_AI_MODEL } : {}) };
}
