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
