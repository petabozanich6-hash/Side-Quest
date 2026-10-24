/**
 * One server-side rollout switch for all lesson-drafting entry points.
 *
 * AI_FAST_PIPELINE=true is configured in wrangler.jsonc for paid families.
 * AI_FAST_PIPELINE_STOP=true is an emergency off-switch set in the Cloudflare
 * dashboard. It overrides the normal flag without changing lesson prompts,
 * entitlements or the AI model. Unset the stop flag after diagnosis.
 */
export function fastLessonPipelineEnabled(env: {
  AI_FAST_PIPELINE?: string;
  AI_FAST_PIPELINE_STOP?: string;
}): boolean {
  return env.AI_FAST_PIPELINE === "true" && env.AI_FAST_PIPELINE_STOP !== "true";
}

/**
 * Opt-in split-stage scheduling (AI_SPLIT_STAGES=true): the same lesson content in shorter, more parallel requests.
 * The same AI_FAST_PIPELINE_STOP emergency switch turns it off.
 */
export function splitLessonStagesEnabled(env: {
  AI_SPLIT_STAGES?: string;
  AI_FAST_PIPELINE_STOP?: string;
}): boolean {
  return env.AI_SPLIT_STAGES === "true" && env.AI_FAST_PIPELINE_STOP !== "true";
}
