/**
 * Owner-only Workers AI inference cost ledger.
 *
 * A row is a model invocation, not a "lesson draft": one draft can make many model calls.
 * No prompt, response, student, email or family data is stored. Figures are GROSS
 * USD estimates at documented model rates, before Cloudflare's daily free allowance,
 * billing adjustments and taxes; Cloudflare's bill remains authoritative.
 */
import type { Env } from "./types";
import { modelFor, routingConfig, splitMeta, MODELS } from "./aiRouting";
import type { AiCallMeta } from "./aiRouting";

export const PRICING_UPDATED = "2026-10-16";
export const PRICING_SOURCE = "https://developers.cloudflare.com/workers-ai/platform/pricing/";
export const DEFAULT_WORKERS_AI_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

/** Official Workers AI rates in USD / million tokens, sampled 16 October 2026. */
export const RATES_USD_PER_MILLION: Record<string, { input: number; output: number }> = {
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast": { input: 0.293, output: 2.253 },
  "@cf/meta/llama-3.1-70b-instruct-fp8-fast": { input: 0.293, output: 2.253 },
  "@cf/meta/llama-3.1-8b-instruct-fp8-fast": { input: 0.045, output: 0.384 },
  "@cf/meta/llama-3.2-1b-instruct": { input: 0.027, output: 0.201 },
  "@cf/meta/llama-3.2-3b-instruct": { input: 0.051, output: 0.335 },
  "@cf/qwen/qwen3-30b-a3b-fp8": { input: 0.0509, output: 0.335 },
  "@cf/openai/gpt-oss-20b": { input: 0.200, output: 0.300 },
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
  const rate = RATES_USD_PER_MILLION[model] ?? MODELS[model];
  if (!rate || input === null || output === null) return null;
  return (input * rate.input + output * rate.output) / 1000000;
}

export const CALLS_TABLE = `CREATE TABLE IF NOT EXISTS ai_calls (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  requested_model TEXT NOT NULL,
  task TEXT,
  generation_id TEXT,
  attempt INTEGER NOT NULL DEFAULT 1,
  fallback INTEGER NOT NULL DEFAULT 0,
  input_tokens INTEGER,
  output_tokens INTEGER,
  token_basis TEXT NOT NULL,
  estimated_usd REAL,
  duration_ms INTEGER,
  status TEXT NOT NULL
)`;
const CALLS_INDEXES = [
  "CREATE INDEX IF NOT EXISTS idx_ai_calls_time ON ai_calls(created_at)",
  "CREATE INDEX IF NOT EXISTS idx_ai_calls_generation ON ai_calls(generation_id)",
];
const callsReady = new WeakSet<D1Database>();
export async function ensureAiCallsSchema(db: D1Database) {
  if (callsReady.has(db)) return;
  await db.prepare(CALLS_TABLE).run();
  for (const sql of CALLS_INDEXES) await db.prepare(sql).run();
  callsReady.add(db);
}

export class AiTimeoutError extends Error {
  constructor(ms: number) { super(`Workers AI did not answer within ${Math.round(ms / 1000)}s`); this.name = "AiTimeoutError"; }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  if (!ms) return p;
  let t: ReturnType<typeof setTimeout>;
  return Promise.race([p, new Promise<T>((_, reject) => { t = setTimeout(() => reject(new AiTimeoutError(ms)), ms); })])
    .finally(() => clearTimeout(t));
}

/** Per-call timeout: AI_CALL_TIMEOUT_MS, or 90 s when the faster pipeline is on, otherwise none (as before). */
export function callTimeoutMs(env: Pick<Env, "AI_CALL_TIMEOUT_MS" | "AI_FAST_PIPELINE">): number {
  const v = Number(env.AI_CALL_TIMEOUT_MS);
  if (Number.isFinite(v) && v >= 5000 && v <= 600000) return Math.round(v);
  return env.AI_FAST_PIPELINE === "true" ? 90000 : 0;
}

/**
 * Wraps env.AI.run: applies model routing (aiRouting.ts), falls back to the caller's model once when a
 * routed model errors, enforces the optional per-call timeout and records every model call. Raw replies
 * are returned unchanged. Telemetry goes to waitUntil, outside the lesson's critical path (awaited when
 * there is no execution context, e.g. unit tests), and never holds prompt, reply, child or family data.
 */
export function meterWorkersAi(env: Env, ctx?: Pick<ExecutionContext, "waitUntil">): Env {
  if (!env.AI) return env;
  const original = env.AI;
  // Without a database nothing is recorded, but the call tags must still never reach Workers AI.
  if (!env.DB) return { ...env, AI: { run: (m: string, input: Record<string, unknown>, o?: Record<string, unknown>) => original.run(m, input, splitMeta(o).options) } };
  const routing = routingConfig(env);
  const timeout = callTimeoutMs(env);
  const record = (row: { model: string; requested: string; meta: AiCallMeta; fallback: boolean; input: Record<string, unknown>; raw: any; ok: boolean; ms: number; timedOut: boolean }) => {
    const write = async () => {
      try {
        const counts = row.ok ? tokenCounts(row.input, row.raw) : { input: null, output: null, basis: "unknown" };
        const gross = row.ok ? estimateGrossUsd(row.model, counts.input, counts.output) : null;
        await ensureAiCallsSchema(env.DB);
        await env.DB.prepare(
          "INSERT INTO ai_calls (id, created_at, provider, model, requested_model, task, generation_id, attempt, fallback, input_tokens, output_tokens, token_basis, estimated_usd, duration_ms, status) VALUES (?, ?, 'workers_ai', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(crypto.randomUUID(), new Date().toISOString(), String(row.model).slice(0, 140), String(row.requested).slice(0, 140), row.meta.task ?? null, row.meta.generation ?? null,
          row.meta.attempt ?? 1, row.fallback ? 1 : 0, counts.input, counts.output, counts.basis, gross, Math.round(row.ms), row.ok ? "completed" : row.timedOut ? "timeout" : "failed").run();
      } catch {
        console.warn("Workers AI cost metering unavailable");
      }
    };
    if (ctx) ctx.waitUntil(write());
    else return write();
  };
  const attemptOnce = async (model: string, requested: string, meta: AiCallMeta, fallback: boolean, input: Record<string, unknown>, options?: Record<string, unknown>) => {
    const started = Date.now();
    let raw: any;
    let ok = false;
    let timedOut = false;
    try {
      raw = await withTimeout(Promise.resolve(original.run(model, input, options)), timeout);
      ok = true;
      return raw;
    } catch (e) {
      timedOut = e instanceof AiTimeoutError;
      throw e;
    } finally {
      await record({ model, requested, meta, fallback, input, raw, ok, ms: Date.now() - started, timedOut });
    }
  };
  return {
    ...env,
    AI: {
      run: async (requested: string, input: Record<string, unknown>, rawOptions?: Record<string, unknown>) => {
        const { meta, options } = splitMeta(rawOptions);
        const model = modelFor(routing, meta.task, requested, meta.attempt ?? 1);
        try {
          return await attemptOnce(model, requested, meta, false, input, options);
        } catch (e) {
          if (model === requested) throw e;
          // The routed model failed: the caller's own model answers instead, once.
          return attemptOnce(requested, requested, meta, true, input, options);
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
  await ensureAiCallsSchema(db);
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
    FROM (SELECT created_at, status, estimated_usd, token_basis FROM ai_inference_costs
          UNION ALL SELECT created_at, CASE WHEN status = 'completed' THEN 'completed' ELSE 'failed' END, estimated_usd, token_basis FROM ai_calls)`
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

// ---------------------------------------------------------------- breakdown and AUD (Owner HQ)

export type AiCostRow = {
  task: string; model: string; calls: number; failed: number; timeouts: number; fallbacks: number; retries: number;
  input_tokens: number; output_tokens: number; estimated_usd: number; avg_ms: number | null;
};

/** Last 30 days by task and model, from the detailed ledger (calls made since routing telemetry began). */
export async function aiCostBreakdown(db: D1Database, now = new Date()): Promise<{ rows: AiCostRow[]; generations: { count: number; avg_calls: number | null; avg_usd: number | null; avg_ms: number | null } }> {
  await ensureAiCallsSchema(db);
  const since = new Date(now.getTime() - 30 * 86400000).toISOString();
  const { results } = await db.prepare(
    `SELECT COALESCE(task, 'other') AS task, model, COUNT(*) AS calls,
       SUM(CASE WHEN status != 'completed' THEN 1 ELSE 0 END) AS failed,
       SUM(CASE WHEN status = 'timeout' THEN 1 ELSE 0 END) AS timeouts,
       SUM(fallback) AS fallbacks, SUM(CASE WHEN attempt > 1 THEN 1 ELSE 0 END) AS retries,
       COALESCE(SUM(input_tokens), 0) AS input_tokens, COALESCE(SUM(output_tokens), 0) AS output_tokens,
       COALESCE(SUM(CASE WHEN status = 'completed' THEN estimated_usd ELSE 0 END), 0) AS estimated_usd,
       AVG(duration_ms) AS avg_ms
     FROM ai_calls WHERE created_at >= ? GROUP BY COALESCE(task, 'other'), model ORDER BY estimated_usd DESC LIMIT 60`
  ).bind(since).all<any>();
  const g = await db.prepare(
    `SELECT COUNT(*) AS n, AVG(calls) AS calls, AVG(usd) AS usd, AVG(span) AS span FROM (
       SELECT generation_id, COUNT(*) AS calls, SUM(CASE WHEN status = 'completed' THEN COALESCE(estimated_usd, 0) ELSE 0 END) AS usd,
              (julianday(MAX(created_at)) - julianday(MIN(created_at))) * 86400000 + MAX(duration_ms) AS span
       FROM ai_calls WHERE created_at >= ? AND generation_id IS NOT NULL GROUP BY generation_id)`
  ).bind(since).first<any>();
  const num = (v: unknown) => Number(v || 0);
  return {
    rows: (results || []).map((r: any) => ({
      task: String(r.task), model: String(r.model), calls: num(r.calls), failed: num(r.failed), timeouts: num(r.timeouts), fallbacks: num(r.fallbacks), retries: num(r.retries),
      input_tokens: num(r.input_tokens), output_tokens: num(r.output_tokens), estimated_usd: num(r.estimated_usd), avg_ms: r.avg_ms == null ? null : Math.round(Number(r.avg_ms)),
    })),
    generations: {
      count: num(g?.n),
      avg_calls: g?.calls == null ? null : Math.round(Number(g.calls) * 10) / 10,
      avg_usd: g?.usd == null ? null : Number(g.usd),
      avg_ms: g?.span == null ? null : Math.round(Number(g.span)),
    },
  };
}

/**
 * USD to AUD from the European Central Bank reference rate, via Frankfurter (api.frankfurter.app, no key).
 * Cached for 12 hours per Worker instance. Never invented: if the source can't be read, AUD is unavailable.
 */
export const FX_SOURCE = "European Central Bank reference rate via api.frankfurter.app";
let fxCache: { rate: number; date: string; at: number } | null = null;
export async function usdToAud(fetchImpl: typeof fetch = fetch, nowMs = Date.now()): Promise<{ rate: number; date: string; source: string } | null> {
  if (fxCache && nowMs - fxCache.at < 12 * 3600_000) return { rate: fxCache.rate, date: fxCache.date, source: FX_SOURCE };
  try {
    const r = await fetchImpl("https://api.frankfurter.app/latest?from=USD&to=AUD", { headers: { accept: "application/json" }, signal: AbortSignal.timeout(3000) });
    if (!r.ok) return null;
    const j: any = await r.json();
    const rate = Number(j?.rates?.AUD);
    if (!Number.isFinite(rate) || rate < 0.5 || rate > 5 || typeof j?.date !== "string") return null;
    fxCache = { rate, date: j.date.slice(0, 10), at: nowMs };
    return { rate, date: fxCache.date, source: FX_SOURCE };
  } catch {
    return null;
  }
}
export function resetFxCache() { fxCache = null; }
