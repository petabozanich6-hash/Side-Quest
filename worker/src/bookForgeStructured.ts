// Book Forge structured output: JSON schemas for every model reply, a schema-constrained call that classifies
// exactly how a reply failed (provider error, empty, truncated, malformed JSON, wrong shape), and a per-call event
// log with token usage and estimated cost. No hono and no route code, so it is unit-tested directly.
//
// Why this exists: the writer used response_format {type:"json_object"}, which only guarantees *some* JSON object.
// The session shape was described in prose, so a reply such as {"session":{...}} parsed fine but had no top-level
// "pages" and was rejected as "not a complete session", with the raw reply discarded and no record of why.
// Workers AI JSON Mode accepts {type:"json_schema", json_schema} for @cf/meta/llama-3.3-70b-instruct-fp8-fast, so
// generation is now constrained by the schema, and every reply is still validated here before it is trusted.
import type { Env } from "./types";
import { VISUAL_TYPES } from "./bookForgeEditorial";
import { estimateGrossUsd, tokenCounts } from "./aiCost";

export const FORGE_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
/** The model's context window (prompt + reply), per the Workers AI model page. */
export const CONTEXT_TOKENS = 24000;

// ---------------------------------------------------------------- schemas

type Schema = Record<string, any>;
const str = (maxLength: number, minLength = 0): Schema => ({ type: "string", minLength, maxLength });

// Length limits here only bound the reply's size (so it cannot run past max_tokens). The teaching limits
// (LIMITS in bookForgeEditorial) are stricter and stay editorial checks.
export const TASK_SCHEMA: Schema = {
  type: "object",
  required: ["n", "prompt"],
  properties: { n: { type: "integer", minimum: 1, maximum: 20 }, prompt: str(600, 1) },
};
export const EXAMPLE_SCHEMA: Schema = {
  type: "object",
  required: ["question", "working", "answer"],
  properties: { question: str(400, 1), working: str(600, 1), answer: str(200, 1) },
};
export const VISUAL_SCHEMA: Schema = {
  type: "object",
  required: ["type", "count"],
  properties: {
    type: { type: "string", enum: [...VISUAL_TYPES] },
    count: { type: "integer", minimum: 0, maximum: 20 },
    start: { type: "integer", minimum: 0, maximum: 1 },
  },
};
export const PAGE_SCHEMA: Schema = {
  type: "object",
  required: ["title", "explanation", "tasks"],
  properties: {
    title: str(140, 1),
    explanation: str(1000),
    example: EXAMPLE_SCHEMA,
    tasks: { type: "array", minItems: 1, maxItems: 8, items: TASK_SCHEMA },
    visual: VISUAL_SCHEMA,
  },
};
const ANSWER_LIST: Schema = {
  type: "array",
  minItems: 1,
  maxItems: 20,
  items: { type: "object", required: ["n", "answer"], properties: { n: { type: "integer", minimum: 1, maximum: 20 }, answer: str(600, 1) } },
};
export const ANSWERS_SCHEMA: Schema = { type: "object", required: ["answers"], properties: { answers: ANSWER_LIST } };
export const SESSION_SCHEMA: Schema = {
  type: "object",
  required: ["pages", "answers"],
  properties: { pages: { type: "array", minItems: 2, maxItems: 2, items: PAGE_SCHEMA }, answers: ANSWER_LIST },
};
// "errors" is required: a reply without an explicit error list is never read as an approval.
export const REVIEW_SCHEMA: Schema = {
  type: "object",
  required: ["errors"],
  properties: {
    errors: { type: "array", maxItems: 20, items: str(400, 1) },
    suggestions: { type: "array", maxItems: 12, items: str(400, 1) },
  },
};
export const planSchema = (count: number): Schema => ({
  type: "object",
  required: ["title", "sessions"],
  properties: {
    title: str(100, 1),
    sessions: {
      type: "array",
      minItems: count,
      maxItems: count,
      items: { type: "object", required: ["title", "goal", "code"], properties: { title: str(80, 1), goal: str(180, 1), code: str(40, 1) } },
    },
  },
});

// ---------------------------------------------------------------- validation

/**
 * Validates the JSON Schema subset used above (type, required, properties, items, enum, min/max, lengths).
 * Returns one message per problem with its exact path, e.g. "pages[1].tasks[0].prompt: is missing".
 */
export function validateSchema(schema: Schema, value: unknown, path = "reply"): string[] {
  const out: string[] = [];
  const t = schema.type;
  const isInt = (v: unknown) => typeof v === "number" && Number.isInteger(v);
  if (t === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [`${path}: must be an object`];
    const v = value as Record<string, unknown>;
    for (const k of schema.required || []) if (v[k] === undefined || v[k] === null) out.push(`${path}.${k}: is missing`);
    for (const [k, s] of Object.entries(schema.properties || {}))
      if (v[k] !== undefined && v[k] !== null) out.push(...validateSchema(s as Schema, v[k], `${path}.${k}`));
  } else if (t === "array") {
    if (!Array.isArray(value)) return [`${path}: must be a list`];
    if (schema.minItems !== undefined && value.length < schema.minItems) out.push(`${path}: needs at least ${schema.minItems} items (has ${value.length})`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) out.push(`${path}: allows at most ${schema.maxItems} items (has ${value.length})`);
    if (schema.items) value.forEach((x, i) => out.push(...validateSchema(schema.items, x, `${path}[${i}]`)));
  } else if (t === "string") {
    if (typeof value !== "string") return [`${path}: must be text`];
    const n = value.trim().length;
    if (schema.minLength && n < schema.minLength) out.push(`${path}: is empty`);
    if (schema.maxLength !== undefined && n > schema.maxLength) out.push(`${path}: is longer than ${schema.maxLength} characters (${n})`);
    if (schema.enum && !schema.enum.includes(value)) out.push(`${path}: must be one of ${schema.enum.join(", ")}`);
  } else if (t === "integer") {
    if (!isInt(value)) return [`${path}: must be a whole number`];
    if (schema.minimum !== undefined && (value as number) < schema.minimum) out.push(`${path}: must be at least ${schema.minimum}`);
    if (schema.maximum !== undefined && (value as number) > schema.maximum) out.push(`${path}: must be at most ${schema.maximum}`);
  }
  return out;
}

/** Brace/bracket balance outside strings: a reply cut off mid-object is "open" (> 0) or ends inside a string. */
function openDepth(s: string): number {
  let depth = 0, inStr = false, esc = false;
  for (const ch of s) {
    if (inStr) { if (esc) esc = false; else if (ch === "\\") esc = true; else if (ch === '"') inStr = false; continue; }
    if (ch === '"') inStr = true;
    else if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") depth--;
  }
  return inStr ? Math.max(1, depth) : depth;
}

/** Text → JSON, tolerating code fences and prose around a single object. Never invents missing content. */
export function parseJsonText(text: string): { ok: true; value: any } | { ok: false; truncated: boolean } {
  const body = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try { return { ok: true, value: JSON.parse(body) }; } catch { /* fall through */ }
  const start = body.indexOf("{"), end = body.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try { return { ok: true, value: JSON.parse(body.slice(start, end + 1)) }; } catch { /* fall through */ }
  }
  return { ok: false, truncated: start >= 0 && openDepth(body.slice(start)) > 0 };
}

/**
 * Removes a single wrapper object around the expected shape, e.g. {"session":{"pages":[...]}} or
 * {"result":{...}} — a formatting slip, not a content problem. Only unwraps when the wrapper holds nothing else.
 */
export function unwrap(value: any, schema: Schema): any {
  const required: string[] = schema.required || [];
  let v = value;
  for (let i = 0; i < 2; i++) {
    if (!v || typeof v !== "object" || Array.isArray(v) || required.every((k) => k in v)) return v;
    const keys = Object.keys(v);
    if (keys.length !== 1 || !v[keys[0]] || typeof v[keys[0]] !== "object" || Array.isArray(v[keys[0]])) return v;
    v = v[keys[0]];
  }
  return v;
}

// ---------------------------------------------------------------- the call

export type FailureKind = "provider" | "empty" | "truncated" | "malformed" | "schema";
export type CallEvent = {
  purpose: string;
  outcome: "ok" | FailureKind;
  finishReason: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  tokenBasis: string;
  estUsd: number | null;
  ms: number;
  maxTokens: number;
  detail: string;
};
export type CallResult =
  | { ok: true; value: any; event: CallEvent }
  | { ok: false; kind: FailureKind; detail: string; partial?: any; event: CallEvent };

const SYSTEM =
  "You are an experienced Australian primary teacher, educational editor and original workbook author. Write in Australian English. Never reproduce commercial workbook text, characters, branding or page designs. Reply with one JSON object that matches the supplied JSON schema exactly, with no prose and no wrapper object. Do not claim official endorsement or certified alignment.";

/** Rough prompt size in tokens (~4 characters per token), used to keep prompt + reply inside the context window. */
export const promptTokens = (prompt: string) => Math.ceil((SYSTEM.length + prompt.length) / 4);

/**
 * One schema-constrained model call. Never throws for model behaviour: every outcome is classified so the caller
 * can choose a recovery that fits the failure. `partial` carries a parsed-but-invalid reply for salvage.
 */
export async function callJson(
  env: Env,
  o: { purpose: string; prompt: string; schema: Schema; maxTokens: number; temperature?: number; normalize?: (v: any) => any },
): Promise<CallResult> {
  const started = Date.now();
  // Keep prompt + reply inside the context window rather than letting the provider cut the reply short.
  const maxTokens = Math.max(512, Math.min(o.maxTokens, CONTEXT_TOKENS - promptTokens(o.prompt) - 200));
  const input = {
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: o.prompt },
    ],
    max_tokens: maxTokens,
    temperature: o.temperature ?? 0.35,
    response_format: { type: "json_schema", json_schema: o.schema },
  };
  const event = (outcome: CallEvent["outcome"], detail: string, raw?: any): CallEvent => {
    const counts = raw ? tokenCounts(input, raw) : { input: null, output: null, basis: "unknown" };
    return {
      purpose: o.purpose,
      outcome,
      finishReason: raw?.finish_reason ?? raw?.choices?.[0]?.finish_reason ?? null,
      inputTokens: counts.input,
      outputTokens: counts.output,
      tokenBasis: counts.basis,
      estUsd: estimateGrossUsd(FORGE_MODEL, counts.input, counts.output),
      ms: Date.now() - started,
      maxTokens,
      detail: detail.slice(0, 600),
    };
  };
  const fail = (kind: FailureKind, detail: string, raw?: any, partial?: any): CallResult =>
    ({ ok: false, kind, detail, ...(partial !== undefined ? { partial } : {}), event: event(kind, detail, raw) });
  if (!env.AI) return fail("provider", "Workers AI is not connected.");
  let raw: any;
  try {
    raw = await env.AI.run(FORGE_MODEL, input);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Workers AI reports a reply it could not fit to the schema as an error ("JSON Mode couldn't be met").
    return /json|schema|grammar|response_format/i.test(msg) ? fail("schema", `Provider could not produce the schema: ${msg}`) : fail("provider", msg);
  }
  const usage = raw?.usage;
  const finish = raw?.finish_reason ?? raw?.choices?.[0]?.finish_reason;
  const out = Number(usage?.completion_tokens ?? usage?.output_tokens);
  const hitLimit = finish === "length" || (Number.isFinite(out) && out >= maxTokens - 2);
  let value = raw?.response ?? raw?.choices?.[0]?.message?.content;
  if (value === undefined || value === null || value === "") return fail(hitLimit ? "truncated" : "empty", hitLimit ? `Reply hit the ${maxTokens}-token limit with no content.` : "The model returned no content.", raw);
  if (typeof value === "string") {
    const parsed = parseJsonText(value);
    if (!parsed.ok)
      return parsed.truncated || hitLimit
        ? fail("truncated", `Reply stopped mid-JSON after ${Number.isFinite(out) ? out : "?"} of ${maxTokens} tokens. Excerpt: …${value.slice(-160)}`, raw)
        : fail("malformed", `Reply was not JSON. Excerpt: ${value.slice(0, 240)}`, raw);
    value = parsed.value;
  }
  value = unwrap(value, o.schema);
  if (o.normalize) value = o.normalize(value);
  const errors = validateSchema(o.schema, value);
  if (errors.length) {
    const detail = `${errors.slice(0, 8).join("; ")}${errors.length > 8 ? `; and ${errors.length - 8} more` : ""}`;
    // A reply that reached the token limit and is missing parts was cut short, even if it happened to parse.
    return hitLimit ? fail("truncated", `Reply hit the ${maxTokens}-token limit: ${detail}`, raw, value) : fail("schema", detail, raw, value);
  }
  return { ok: true, value, event: event("ok", hitLimit ? "Complete, but at the token limit." : "", raw) };
}

// ---------------------------------------------------------------- the event log

const EVENTS_SCHEMA = `CREATE TABLE IF NOT EXISTS book_forge_events (
 id TEXT PRIMARY KEY, project_id TEXT NOT NULL, phase TEXT NOT NULL, session INTEGER, purpose TEXT NOT NULL,
 outcome TEXT NOT NULL, action TEXT NOT NULL DEFAULT '', finish_reason TEXT, input_tokens INTEGER, output_tokens INTEGER,
 token_basis TEXT NOT NULL, est_usd REAL, duration_ms INTEGER, max_tokens INTEGER, detail TEXT NOT NULL DEFAULT '',
 created_at TEXT NOT NULL
)`;
export async function ensureForgeEvents(db: D1Database) {
  await db.prepare(EVENTS_SCHEMA).run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_forge_events_project ON book_forge_events(project_id, created_at)").run();
}

/** Records one model call (owner workbook content only; never learner data) and mirrors it to Workers Logs. */
export async function logCall(
  db: D1Database,
  o: { projectId: string; phase: string; session: number | null; event: CallEvent; action: string },
) {
  const e = o.event;
  console.log(JSON.stringify({ evt: "book-forge.call", project: o.projectId, phase: o.phase, session: o.session, ...e, action: o.action }));
  try {
    await db
      .prepare(
        "INSERT INTO book_forge_events (id,project_id,phase,session,purpose,outcome,action,finish_reason,input_tokens,output_tokens,token_basis,est_usd,duration_ms,max_tokens,detail,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      )
      .bind(crypto.randomUUID(), o.projectId, o.phase, o.session, e.purpose, e.outcome, o.action.slice(0, 200), e.finishReason, e.inputTokens, e.outputTokens, e.tokenBasis, e.estUsd, e.ms, e.maxTokens, e.detail, new Date().toISOString())
      .run();
  } catch {
    console.warn("Book Forge event log unavailable");
  }
}

/** Totals and the most recent calls for the owner's generation view. */
export async function eventSummary(db: D1Database, projectId: string) {
  const totals = await db
    .prepare(
      "SELECT COUNT(*) AS calls, COALESCE(SUM(input_tokens),0) AS input_tokens, COALESCE(SUM(output_tokens),0) AS output_tokens, COALESCE(SUM(est_usd),0) AS est_usd, COALESCE(SUM(CASE WHEN outcome<>'ok' THEN 1 ELSE 0 END),0) AS failed_calls, COALESCE(SUM(CASE WHEN outcome='truncated' THEN 1 ELSE 0 END),0) AS truncated_calls FROM book_forge_events WHERE project_id=?",
    )
    .bind(projectId)
    .first<any>();
  const { results } = await db
    .prepare("SELECT session,purpose,outcome,action,finish_reason,input_tokens,output_tokens,est_usd,duration_ms,detail,created_at FROM book_forge_events WHERE project_id=? ORDER BY created_at DESC, rowid DESC LIMIT 15")
    .bind(projectId)
    .all<any>();
  return {
    calls: Number(totals?.calls || 0),
    failedCalls: Number(totals?.failed_calls || 0),
    truncatedCalls: Number(totals?.truncated_calls || 0),
    inputTokens: Number(totals?.input_tokens || 0),
    outputTokens: Number(totals?.output_tokens || 0),
    estimatedUsd: Math.round(Number(totals?.est_usd || 0) * 10000) / 10000,
    recent: results || [],
  };
}
