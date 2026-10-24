// Reading a school report or NAPLAN result to suggest which of a child's outcomes look already met (prior learning).
// One document conversion (PDF or photo to text, when a file is given) and one Workers AI call per request; paid plans
// only; metered in ai_usage as "prior_learning_scan".
//
// Honesty rules, as for life learning:
// - The model only PICKS from the child's own outcomes (by number, with Side-Quest's plain-English summary of each).
//   Numbers outside the list are dropped, so an outcome is never invented, and codes in its wording are stripped.
// - NAPLAN reports proficiency per domain, not per outcome, so it can only ever give low or medium confidence.
// - Nothing is recorded here. Every suggestion starts unticked and the parent confirms each one.
import type { Env } from "./types";
import type { AiBinding } from "./aiDraft";
import { extractJson, DEFAULT_MODEL } from "./aiDraft";
import { stripCodes } from "./lifeLearningAi";
import { MET_STATUSES, trackerFor } from "./outcomeTracker";
import * as lb from "./lessonBuilder";

type DB = D1Database;
export const PRIOR_SCAN_LIMITS = { perFamilyDay: 10 };
const MAX_DOC_CHARS = 14000;
const MAX_POOL = 350;

export type PriorSuggestion = { code: string; subject: string; summary: string; evidence: string; confidence: "high" | "medium" | "low" };
type Fail = { ok: false; status: number; detail: string; code?: string };
const fail = (status: number, detail: string, code?: string): Fail => ({ ok: false, status, detail, code });
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, n) : "");
const CONF = (v: unknown): PriorSuggestion["confidence"] => (v === "high" || v === "medium" || v === "low" ? v : "low");

const SYSTEM = [
  "You help an Australian homeschooling parent recognise learning their child had already completed before homeschooling, using a school report, NAPLAN result or similar document.",
  "You are given the document and a numbered list of the child's curriculum outcomes, each described in plain English. Pick only outcomes the document gives real grounds for.",
  "School reports: a subject grade or achievement level (for example A/B, High/Sound, Above/At expected level) supports outcomes of that subject only where the report says what was taught or assessed that period. A comment that names a skill is stronger evidence. Below-expected or 'working towards' results do NOT support an outcome.",
  "NAPLAN: results are a proficiency level per domain (Reading, Writing, Spelling, Grammar and Punctuation, Numeracy). Only 'Exceeding' or 'Strong' can support outcomes, only in the matching area, and never with high confidence.",
  "Never guess. Prefer fewer, well-supported picks. If the document doesn't support anything, return no matches.",
  "For each pick, \"evidence\" is one sentence in plain Australian English naming what in the document supports it (quote a short phrase where possible). Do NOT write curriculum codes.",
  "Confidence: high = the document directly states the skill was achieved; medium = a good grade in a subject period that clearly covered it; low = only indirectly supported.",
  'Reply with ONE JSON object only: {"document_type":"school_report"|"naplan"|"other","summary":string (one or two sentences describing the document),"matches":[{"n":number,"evidence":string,"confidence":"high"|"medium"|"low"}]}',
].join("\n");

/** PDF or photo to text with Workers AI's document conversion. Null when it can't be read. */
async function readFile(env: Env, ai: AiBinding, familyId: string, fileId: string): Promise<string | null> {
  const f: any = await env.DB.prepare("SELECT storage_path, original_filename, content_type FROM files WHERE id = ? AND family_id = ? AND is_deleted = 0").bind(fileId, familyId).first();
  if (!f || !env.BUCKET) return null;
  const obj = await env.BUCKET.get(String(f.storage_path));
  if (!obj) return null;
  const blob = new Blob([await obj.arrayBuffer()], { type: f.content_type || "application/octet-stream" });
  const convert = (ai as any).toMarkdown;
  if (typeof convert !== "function") return null;
  try {
    const out: any = await convert.call(ai, { name: f.original_filename || "report", blob });
    const res = Array.isArray(out) ? out[0] : out;
    return typeof res?.data === "string" && res.format !== "error" ? res.data : null;
  } catch { return null; }
}

export async function analysePriorLearning(
  env: Env, ai: AiBinding | undefined,
  o: { familyId: string; userId: string; studentId: string; text?: unknown; fileId?: unknown; model?: string; gatewayId?: string },
  now: Date = new Date(),
): Promise<{ ok: true; suggestions: PriorSuggestion[]; document_type: string; summary: string } | Fail> {
  const db: DB = env.DB;
  if (!ai) return fail(503, "Reading reports needs the AI service, which isn't switched on. You can still choose outcomes yourself.", "AI_UNAVAILABLE");
  const { plan } = await lb.getEntitlement(db, o.familyId, now);
  if (plan !== "INTERNAL") {
    const since = new Date(now.getTime() - 86400000).toISOString();
    const used = await db.prepare("SELECT COUNT(*) n FROM ai_usage WHERE family_id = ? AND kind = 'prior_learning_scan' AND created_at >= ? AND status != 'failed'").bind(o.familyId, since).first<{ n: number }>();
    if (Number(used?.n || 0) >= PRIOR_SCAN_LIMITS.perFamilyDay)
      return fail(429, `You've read ${PRIOR_SCAN_LIMITS.perFamilyDay} documents today. Try again tomorrow, or choose outcomes yourself.`, "AI_QUOTA");
  }
  const tracker: any = await trackerFor(db, o.familyId, o.studentId, { now });
  if (!tracker) return fail(404, "Child not found");
  if (!tracker.available) return fail(409, "The outcome tracker isn't available for your curriculum yet.", "NO_CATALOGUE");

  let doc = clip(o.text, MAX_DOC_CHARS * 2);
  if (!doc && typeof o.fileId === "string" && o.fileId) {
    doc = clip(await readFile(env, ai, o.familyId, o.fileId), MAX_DOC_CHARS * 2);
    if (!doc) return fail(422, "That file couldn't be read. Try a PDF, or copy the report's text and paste it instead.", "UNREADABLE");
  }
  if (doc.length < 40) return fail(400, "Upload the report, or paste its text (at least a few lines).", "NO_TEXT");
  doc = doc.slice(0, MAX_DOC_CHARS);

  // The child's own outcomes that aren't already met, described in Side-Quest's words (never official wording).
  const pool = (tracker.outcomes as any[]).filter((x) => x.in_stage && !MET_STATUSES.includes(x.status)).slice(0, MAX_POOL);
  if (!pool.length) return { ok: true, suggestions: [], document_type: "other", summary: "Every outcome in your child's program is already met." };
  const describe = (x: any) => x.summary || [x.strand, x.level_label].filter(Boolean).join(", ") || x.code;
  const user = `CHILD: ${tracker.student.year_level || tracker.student.stage || ""}\n\nDOCUMENT:\n<<<\n${doc}\n>>>\n\nTHE CHILD'S OUTCOMES:\n${pool.map((x, i) => `${i + 1}. [${x.subject || x.learning_area}] ${describe(x)}`).join("\n")}`;

  const usageId = crypto.randomUUID();
  await db.prepare("INSERT INTO ai_usage (id, family_id, user_id, kind, status, created_at) VALUES (?, ?, ?, 'prior_learning_scan', 'pending', ?)").bind(usageId, o.familyId, o.userId, now.toISOString()).run();
  const mark = (s: string) => db.prepare("UPDATE ai_usage SET status = ? WHERE id = ?").bind(s, usageId).run();
  let reply: any;
  try {
    const out = await ai.run(o.model || DEFAULT_MODEL, { messages: [{ role: "system", content: SYSTEM }, { role: "user", content: user }], max_tokens: 3000, temperature: 0.2 },
      o.gatewayId ? { gateway: { id: o.gatewayId } } : undefined);
    reply = extractJson(out);
  } catch {
    await mark("failed");
    return fail(502, "The AI service didn't respond. Nothing was used from your allowance; please try again.", "AI_FAILED");
  }
  if (!reply || typeof reply !== "object") { await mark("failed"); return fail(502, "The AI couldn't read that document. Please try again, or choose outcomes yourself.", "AI_FAILED"); }
  const naplan = reply.document_type === "naplan";
  const seen = new Set<string>();
  const suggestions: PriorSuggestion[] = [];
  for (const m of Array.isArray(reply.matches) ? reply.matches.slice(0, 80) : []) {
    const x = pool[Number(m?.n) - 1];
    if (!x || seen.has(x.code)) continue;
    seen.add(x.code);
    let confidence = CONF(m?.confidence);
    if (naplan && confidence === "high") confidence = "medium";
    suggestions.push({ code: x.code, subject: x.subject || x.learning_area, summary: describe(x), evidence: stripCodes(clip(m?.evidence, 300)), confidence });
  }
  await mark("ok");
  const order = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => order[a.confidence] - order[b.confidence] || a.subject.localeCompare(b.subject));
  return { ok: true, suggestions, document_type: ["school_report", "naplan"].includes(reply.document_type) ? reply.document_type : "other", summary: stripCodes(clip(reply.summary, 400)) };
}

export function registerPriorLearning(app: import("./types").App, g: import("./types").Guards) {
  app.post("/api/outcomes/students/:sid/prior-learning/analyse", g.auth, g.parent, async (c) => {
    const u = c.get("user");
    const b: any = await c.req.json().catch(() => ({}));
    const r = await analysePriorLearning(c.env, c.env.AI as AiBinding | undefined, {
      familyId: u.family_id, userId: u.id, studentId: c.req.param("sid"), text: b.text, fileId: b.file_id,
      model: c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID,
    });
    return r.ok ? c.json(r) : c.json({ detail: r.detail, code: r.code }, r.status as any);
  });
}
