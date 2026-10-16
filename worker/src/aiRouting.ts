/**
 * Which Workers AI model each AI task uses.
 *
 * Off by default: unless AI_ROUTING_ENABLED is "true", every call keeps the model its caller asked for
 * (AI_MODEL, or AI_HELP_MODEL for child help), exactly as before. When on, AI_MODEL_ROUTES may move
 * individual tasks to another model from the allow-list below, e.g.
 *   AI_MODEL_ROUTES = {"outcome_match":"@cf/qwen/qwen3-30b-a3b-fp8"}
 * Anything not named keeps the caller's model. Unknown tasks or models are ignored and reported.
 *
 * Fallback is automatic and recorded: if a routed model errors (or times out), the same call is made once
 * with the caller's model; if a routed model's reply can't be used, the stage's own retry uses the
 * caller's model too. A cheaper model can therefore never be the reason a lesson is weaker or missing.
 */

export type AiTask =
  | "lesson_design" | "lesson_frame" | "lesson_section" | "lesson_example" | "lesson_practice" | "lesson_assessment"
  | "lesson_repair" | "outcome_match" | "lesson_refine" | "series_plan" | "learning_plan" | "life_mapping" | "child_help";

export const AI_TASKS: AiTask[] = [
  "lesson_design", "lesson_frame", "lesson_section", "lesson_example", "lesson_practice", "lesson_assessment",
  "lesson_repair", "outcome_match", "lesson_refine", "series_plan", "learning_plan", "life_mapping", "child_help",
];

/** Lesson-writing stages: they decide teaching quality, so they are listed for the Owner as "lesson" tasks. */
export const LESSON_TASKS: AiTask[] = ["lesson_design", "lesson_frame", "lesson_section", "lesson_example", "lesson_practice", "lesson_assessment", "lesson_repair"];

export type ModelInfo = {
  label: string;
  /** USD per million tokens (Cloudflare per-model rates). */
  input: number;
  output: number;
  context: number;
  /** "verified": proven with Side-Quest's JSON parser. "needs_validation": priced and allowed, not yet benchmarked. */
  json: "verified" | "needs_validation";
};

/**
 * Allow-list. Prices and context windows are Cloudflare's published figures, read on 2026-10-16 from the
 * Workers AI pricing page source (cloudflare/cloudflare-docs, production branch,
 * src/content/docs/workers-ai/platform/pricing.mdx and src/content/workers-ai-models/*.json).
 * Billing is in neurons at US$0.011 per 1,000 after 10,000 free neurons a day; the per-token rates are
 * Cloudflare's own conversion.
 */
export const MODELS: Record<string, ModelInfo> = {
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast": { label: "Llama 3.3 70B (fast)", input: 0.293, output: 2.253, context: 24000, json: "verified" },
  "@cf/qwen/qwen3-30b-a3b-fp8": { label: "Qwen3 30B A3B", input: 0.0509, output: 0.335, context: 32768, json: "needs_validation" },
  "@cf/openai/gpt-oss-20b": { label: "GPT-OSS 20B", input: 0.2, output: 0.3, context: 128000, json: "needs_validation" },
  "@cf/meta/llama-3.1-8b-instruct-fp8-fast": { label: "Llama 3.1 8B (fast)", input: 0.045, output: 0.384, context: 128000, json: "needs_validation" },
};

export type RoutingConfig = {
  enabled: boolean;
  routes: Partial<Record<AiTask, string>>;
  problems: string[];
};

type RoutingEnv = { AI_ROUTING_ENABLED?: string; AI_MODEL_ROUTES?: string };

export function routingConfig(env: RoutingEnv): RoutingConfig {
  const enabled = env.AI_ROUTING_ENABLED === "true";
  const problems: string[] = [];
  const routes: Partial<Record<AiTask, string>> = {};
  const raw = (env.AI_MODEL_ROUTES || "").trim();
  if (raw) {
    let parsed: unknown = null;
    try { parsed = JSON.parse(raw); } catch { problems.push("AI_MODEL_ROUTES is not valid JSON; no routes applied."); }
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      for (const [task, model] of Object.entries(parsed as Record<string, unknown>)) {
        if (!AI_TASKS.includes(task as AiTask)) { problems.push(`Unknown AI task "${task.slice(0, 40)}" ignored.`); continue; }
        if (typeof model !== "string" || !MODELS[model]) { problems.push(`Model for ${task} is not on the allow-list; it keeps the default.`); continue; }
        routes[task as AiTask] = model;
      }
    } else if (parsed !== null) problems.push("AI_MODEL_ROUTES must be a JSON object of task to model.");
  }
  return { enabled, routes, problems };
}

/** The model for this call. Retries (attempt 2+) always go back to the caller's model. */
export function modelFor(cfg: RoutingConfig, task: AiTask | undefined, requested: string, attempt = 1): string {
  if (!cfg.enabled || !task || attempt > 1) return requested;
  return cfg.routes[task] || requested;
}

/** Call metadata travels in the run() options under this key and is removed before Workers AI sees it. */
export type AiCallMeta = { task?: AiTask; generation?: string; attempt?: number };

export function withMeta(options: Record<string, unknown> | undefined, meta: AiCallMeta): Record<string, unknown> {
  return { ...(options || {}), sq: meta };
}

export function splitMeta(options: Record<string, unknown> | undefined): { meta: AiCallMeta; options: Record<string, unknown> | undefined } {
  if (!options || !("sq" in options)) return { meta: {}, options };
  const { sq, ...rest } = options as Record<string, unknown> & { sq?: AiCallMeta };
  const clean = Object.keys(rest).length ? rest : undefined;
  const m = (sq && typeof sq === "object" ? sq : {}) as AiCallMeta;
  return {
    meta: {
      task: AI_TASKS.includes(m.task as AiTask) ? m.task : undefined,
      generation: typeof m.generation === "string" ? m.generation.slice(0, 64) : undefined,
      attempt: Number.isInteger(m.attempt) && Number(m.attempt) > 0 ? Number(m.attempt) : undefined,
    },
    options: clean,
  };
}

export const gatewayOptions = (gatewayId?: string) => (gatewayId ? { gateway: { id: gatewayId } } : undefined);
