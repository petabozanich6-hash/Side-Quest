/**
 * Owner-only Workers AI inference cost ledger.
 *
 * A row is a model invocation, not a "lesson draft": one draft can make many model calls.
 * No prompt, response, student, email or family data is stored. Figures are GROSS
 * USD estimates at documented model rates, before Cloudflare's daily free allowance,
 * billing adjustments and taxes; Cloudflare's bill remains authoritative.
 */
import type { Env } from "./types";

export const PRICING_UPDATED = "2026-10-17";
export const PRICING_SOURCE = "https://developers.cloudflare.com/workers-ai/platform/pricing/";
export const DEFAULT_WORKERS_AI_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

/** Official Workers AI rates in USD / million tokens, sampled 16 October 2026. */
export const RATES_USD_PER_MILLION: Record<string, { input: number; output: number }> = {
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast": { input: 0.293, output: 2.253 },
  "@cf/meta/llama-3.1-70b-instruct-fp8-fast": { input: 0.293, output: 2.253 },
  "@cf/meta/llama-3.1-8b-instruct-fp8-fast": { input: 0.045, output: 0.384 },
  "@cf/meta/llama-3.2-1b-instruct": { input: 0.027, output: 0.201 },
  "@cf/meta/llama-3.2-3b-instruct": { input: 0.051, output: 0.335 },
  "@cf/qwen/qwen3-30b-a3b-fp8": { input: 0.051, output: 0.335 },
  "@cf/openai/gpt-oss-20b": { input: 0.200, output: 0.300 },
  "@cf/google/gemma-4-26b-a4b-it": { input: 0.100, output: 0.300 },
  "@cf/zai-org/glm-4.7-flash": { input: 0.0605, output: 0.400 },
};

/** Additive runtime fallback; deployment does not automatically apply SQL migrations. */
const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ai_inference_costs (
  id TEXT PRIMARY KEY,
  model TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  token_basis TEXT NOT NULL,
  estimated_usd REAL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
)`;
const CREATE_INDEX = "CREATE INDEX IF NOT EXISTS idx_ai_costs_time ON ai_inference_costs(created_at)";
export async function ensureAiCostSchema(db: D1Database) {
  await db.prepare(CREATE_TABLE).run();
  await db.prepare(CREATE_INDEX).run();
}

function finiteTokens(value: unknown): number | null {
  const v = Number(value);
  return value !== undefined && value !== null && Number.isFinite(v) && v >= 0 && v <= 20000000
    ? Math.round(v) : null;
}
function messageChars(messages: unknown): number {
  if (!Array.isArray(messages)) return 0;
  let total = 0;
  for (const m of messages.slice(0, 60)) {
    if (!m || typeof m !== "object") continue;
    const content = (m as Record<string, unknown>).content;
    if (typeof content === "string") total += content.length;
    else if (Array.isArray(content)) {
      for (const part of content.slice(0, 50))
        if (typeof part === "string") total += part.length;
        else if (part && typeof part === "object" && typeof (part as any).text === "string") total += (part as any).text.length;
    }
  }
  return Math.min(total, 80000000);
}
function outputChars(raw: any): number {
  const response = raw?.response ?? raw?.result ?? raw?.choices?.[0]?.message?.content;
  if (typeof response === "string") return response.length;
  if (response === undefined || response === null) return 0;
  try { return JSON.stringify(response).length; } catch { return 0; }
}

/** Prefer provider-reported counts; fall back to transparent ~4 chars/token estimate. */
export function tokenCounts(input: Record<string, unknown>, raw: unknown) {
  const result: any = raw;
  const usage = result?.usage ?? result?.result?.usage ?? result?.meta?.usage;
  const actualIn = finiteTokens(usage?.prompt_tokens ?? usage?.input_tokens ?? usage?.inputTokens);
  const actualOut = finiteTokens(usage?.completion_tokens ?? usage?.output_tokens ?? usage?.outputTokens);
  if (actualIn !== null && actualOut !== null) return { input: actualIn, output: actualOut, basis: "reported" as const };
  const inputChars = messageChars(input.messages);
  const outputLength = outputChars(result);
  if (inputChars || outputLength) {
    return {
      input: actualIn ?? Math.ceil(inputChars / 4),
      output: actualOut ?? Math.ceil(outputLength / 4),
      basis: "approximate" as const,
    };
  }
  return { input: null, output: null, basis: "unknown" as const };
}

export function estimateGrossUsd(model: string, input: number | null, output: number | null): number | null {
  const rate = RATES_USD_PER_MILLION[model];
  if (!rate || input === null || output === null) return null;
  return (input * rate.input + output * rate.output) / 1000000;
}

/** Wrapper returns raw AI responses unchanged; failed metering must never break a family's lesson. */
/** Production calls send cost telemetry to waitUntil, outside the lesson's critical path.
 * A missing execution context (unit tests) retains awaited, deterministic logging.
 */
export function meterWorkersAi(env: Env, ctx?: Pick<ExecutionContext, "waitUntil">): Env {
  if (!env.AI || !env.DB) return env;
  const original = env.AI;
  return {
    ...env,
    AI: {
      // Document conversion (school reports for prior learning) is passed straight through; it isn't a text model call.
      ...(typeof (original as any).toMarkdown === "function" ? { toMarkdown: (...args: unknown[]) => (original as any).toMarkdown(...args) } : {}),
      run: async (model: string, input: Record<string, unknown>, options?: Record<string, unknown>) => {
        let raw: any;
        let ok = false;
        try {
          raw = await original.run(model, input, options);
          ok = true;
          return raw;
        } finally {
          // Never save lesson or learner content in cost telemetry.
          const logCost = async () => {
            try {
              const counts = ok ? tokenCounts(input, raw) : { input: null, output: null, basis: "unknown" };
              const gross = ok ? estimateGrossUsd(model, counts.input, counts.output) : null;
              await ensureAiCostSchema(env.DB);
              await env.DB.prepare(
                "INSERT INTO ai_inference_costs (id, model, input_tokens, output_tokens, token_basis, estimated_usd, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
              ).bind(crypto.randomUUID(), String(model).slice(0, 140), counts.input, counts.output, counts.basis, gross, ok ? "completed" : "failed", new Date().toISOString()).run();
            } catch {
              console.warn("Workers AI cost metering unavailable");
            }
          };
          if (ctx) ctx.waitUntil(logCost());
          else await logCost();
        }
      },
    },
  };
}

export type AiCostSummary = {
  configured: true;
  currency: "USD";
  model_price_updated: string;
  pricing_source: string;
  estimated_gross_24h_usd: number;
  estimated_gross_30d_usd: number;
  estimated_gross_all_time_usd: number;
  invoiced: false;
  tracked_calls_30d: number;
  reported_tokens_30d: number;
  approximate_tokens_30d: number;
  unpriced_calls_30d: number;
  failed_calls_30d: number;
  tracking_started_at: string | null;
  note: string;
};
export async function aiCostSummary(db: D1Database, now = new Date()): Promise<AiCostSummary> {
  await ensureAiCostSchema(db);
  const since24 = new Date(now.getTime() - 86400000).toISOString();
  const since30 = new Date(now.getTime() - 30 * 86400000).toISOString();
  const { results } = await db.prepare(
    `SELECT
      COUNT(*) AS all_calls,
      MIN(created_at) AS first_at,
      COALESCE(SUM(CASE WHEN status='completed' THEN estimated_usd ELSE 0 END),0) AS all_gross,
      COALESCE(SUM(CASE WHEN status='completed' AND created_at >= ? THEN estimated_usd ELSE 0 END),0) AS gross24,
      COALESCE(SUM(CASE WHEN status='completed' AND created_at >= ? THEN estimated_usd ELSE 0 END),0) AS gross30,
      COALESCE(SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END),0) AS calls30,
      COALESCE(SUM(CASE WHEN created_at >= ? AND token_basis='reported' THEN 1 ELSE 0 END),0) AS measured30,
      COALESCE(SUM(CASE WHEN created_at >= ? AND token_basis='approximate' THEN 1 ELSE 0 END),0) AS approximate30,
      COALESCE(SUM(CASE WHEN created_at >= ? AND status='completed' AND estimated_usd IS NULL THEN 1 ELSE 0 END),0) AS unpriced30,
      COALESCE(SUM(CASE WHEN created_at >= ? AND status='failed' THEN 1 ELSE 0 END),0) AS failed30
    FROM ai_inference_costs`
  ).bind(since24, since30, since30, since30, since30, since30, since30).all<any>();
  const x = results?.[0] || {};
  return {
    configured: true, currency: "USD", model_price_updated: PRICING_UPDATED, pricing_source: PRICING_SOURCE,
    estimated_gross_24h_usd: Number(x.gross24 || 0),
    estimated_gross_30d_usd: Number(x.gross30 || 0),
    estimated_gross_all_time_usd: Number(x.all_gross || 0),
    invoiced: false, tracked_calls_30d: Number(x.calls30 || 0),
    reported_tokens_30d: Number(x.measured30 || 0),
    approximate_tokens_30d: Number(x.approximate30 || 0),
    unpriced_calls_30d: Number(x.unpriced30 || 0),
    failed_calls_30d: Number(x.failed30 || 0),
    tracking_started_at: x.first_at ?? null,
    note: "Estimated gross Workers AI inference cost only, since tracking began. Token counts are provider-reported when available, otherwise approximate (~4 characters/token). Excludes prior usage, daily free allocation, discounts, taxes, Workers/R2/D1 charges and actual Cloudflare invoice adjustments.",
  };
}
