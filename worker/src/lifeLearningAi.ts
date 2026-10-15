// AI mapping of a logged life-learning activity (baking, bushwalks, budgeting...) to curriculum outcomes for the
// parent's own state or territory. One Workers AI call per request; paid plans only; metered in ai_usage.
//
// Honesty rules:
// - NSW: the model may only PICK from the verified NSW outcome list for the child's stage. Any number not in the
//   list is dropped, so a code is never invented.
// - Victorian/WA state-specific lists are not loaded. Five other jurisdictions can browse official ACARA v9
//   reference codes in the Outcome Tracker, but this AI evidence path still describes learning in plain words.
//   It does NOT certify state curriculum compliance. The model describes the learning
//   against that framework's learning areas in plain words, and no code is attached. Anything that looks like a
//   curriculum code in the reply is stripped.
// - Every suggestion starts unaccepted. The parent confirms or rejects each one.
import { NSW_OUTCOMES } from "./data/curriculum";
import { newId } from "./types";
import { extractJson, DEFAULT_MODEL } from "./aiDraft";
import type { AiBinding } from "./aiDraft";
import type { Framework } from "./data/jurisdictions";
import { areasFor, yearLabel } from "./data/jurisdictions";
import type { LifeEvidenceAnalysis, SuggestedMapping } from "./data/lifeEvidence";

export type LifeMapLimits = { perFamilyDay: number; perFamilyMonth: number };
export const LIFE_MAP_DEFAULTS: LifeMapLimits = { perFamilyDay: 30, perFamilyMonth: 300 };
export const lifeMapLimits = (env: { LIFE_MAP_PER_FAMILY_DAY?: string; LIFE_MAP_PER_FAMILY_MONTH?: string } = {}): LifeMapLimits => ({
  perFamilyDay: Number(env.LIFE_MAP_PER_FAMILY_DAY) || LIFE_MAP_DEFAULTS.perFamilyDay,
  perFamilyMonth: Number(env.LIFE_MAP_PER_FAMILY_MONTH) || LIFE_MAP_DEFAULTS.perFamilyMonth,
});

type Evidence = { title?: string | null; description?: string | null; location?: string | null; parent_note?: string | null; duration_minutes?: number | null; file_ids?: string[] };
type Student = { name?: string | null; stage?: string | null; year_level?: string | null };

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, n) : "");
const CONF = (v: unknown): SuggestedMapping["confidence"] => (v === "high" || v === "medium" || v === "low" ? v : "low");

/** Strip anything that looks like a curriculum code (AC9MFN01, VC2M3N01, MA2-RN-01 ...) from free text. */
export function stripCodes(s: string): string {
  return s
    .replace(/\(\s*(?:AC9|ACL9|VC2|AC|VC)[A-Z0-9]{3,}\s*\)/g, "")
    .replace(/\b(?:AC9|ACL9|VC2)[A-Z0-9]{3,}\b/g, "")
    .replace(/\b[A-Z]{2,4}[a-z]?\d?-[A-Z0-9]{1,5}-\d{2}[A-Z]?\b/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;])/g, "$1")
    .trim();
}

const describe = (e: Evidence) => [
  `Activity: ${clip(e.title, 200)}`,
  `What happened (parent's description): ${clip(e.description, 2500)}`,
  e.location ? `Where: ${clip(e.location, 120)}` : "",
  e.duration_minutes ? `Time spent: about ${Number(e.duration_minutes)} minutes` : "",
  e.parent_note ? `Parent note: ${clip(e.parent_note, 500)}` : "",
].filter(Boolean).join("\n");

const COMMON = [
  "You help an Australian homeschooling parent record evidence of learning from an everyday real-life activity.",
  "Only claim learning that the parent's description actually shows. Never invent details, quantities or skills that are not described.",
  "Prefer fewer, well-supported links over many weak ones. If the description is too thin for a link, leave it out.",
  "Each evidence statement is one sentence in plain Australian English that names what in the description shows the learning.",
  "Confidence: high = clearly and directly shown; medium = reasonably shown; low = only partly shown.",
  'Also give: "summary" (one or two sentences about what the child learnt), "activity_type" (2 to 5 words), and "more_evidence" (one sentence suggesting what the parent could add, such as a photo, a child reflection or a work sample).',
  "Reply with ONE JSON object only. No prose before or after it.",
].join("\n");

export function nswPool(stage: string | null | undefined) {
  const s = String(stage || "");
  const pool = NSW_OUTCOMES.filter((o) => o.stage === s);
  return pool.length ? pool : NSW_OUTCOMES.filter((o) => o.stage === "S2");
}

export function buildPrompt(fw: Framework, evidence: Evidence, student: Student) {
  const level = yearLabel(student.year_level, student.stage);
  if (fw.codes === "verified") {
    const pool = nswPool(student.stage);
    const system = [
      COMMON,
      `The child is in ${level || "a primary year"} (NSW ${student.stage || "Stage 2"}). Link the activity to outcomes from the ${fw.name}.`,
      "You may choose ONLY from the numbered outcome list you are given. Choose 1 to 5.",
      'JSON shape: {"summary":string,"activity_type":string,"matches":[{"n":number,"evidence":string,"confidence":"high"|"medium"|"low"}],"more_evidence":string}',
    ].join("\n");
    const user = `${describe(evidence)}\n\nOUTCOMES (${fw.short}, ${student.stage || "S2"}):\n${pool.map((o, i) => `${i + 1}. [${o.learning_area}] ${o.description}`).join("\n")}`;
    return { system, user, pool };
  }
  const areas = areasFor(fw, student.stage);
  const system = [
    COMMON,
    `The family lives in ${fw.jurisdiction_name}, which uses the ${fw.name}. The child is in ${level || "a primary year"}.`,
    `Link the activity to 1 to 5 learning areas, using ONLY these names exactly: ${areas.join("; ")}.`,
    `For each, write "outcome": one sentence describing the ${level || "year-level"} skill or understanding in that learning area of the ${fw.short} that the activity gives evidence of, paraphrased in plain words.`,
    "Do NOT write curriculum codes, content description numbers or quotation marks. Do not mention any other state's curriculum.",
    'JSON shape: {"summary":string,"activity_type":string,"matches":[{"learning_area":string,"outcome":string,"evidence":string,"confidence":"high"|"medium"|"low"}],"more_evidence":string}',
  ].join("\n");
  return { system, user: describe(evidence), pool: null as null };
}

/** Turn the model's reply into mappings, dropping anything that isn't from the allowed list. */
export function parseReply(raw: unknown, fw: Framework, student: Student, pool: ReturnType<typeof nswPool> | null): Omit<LifeEvidenceAnalysis, "mappings"> & { mappings: SuggestedMapping[] } | null {
  const j: any = extractJson(raw);
  if (!j || typeof j !== "object") return null;
  const matches: any[] = Array.isArray(j.matches) ? j.matches.slice(0, 8) : [];
  const out: SuggestedMapping[] = [];
  const seen = new Set<string>();
  if (pool) {
    for (const m of matches) {
      const n = Number(m?.n ?? m?.number ?? m?.id);
      if (!Number.isInteger(n) || n < 1 || n > pool.length) continue;
      const o = pool[n - 1];
      if (seen.has(o.code)) continue;
      seen.add(o.code);
      out.push({
        id: newId(), learning_area: o.learning_area, code: o.code, description: "",
        evidence_statement: stripCodes(clip(m?.evidence, 400)) || "Shown in the activity described.",
        confidence: CONF(m?.confidence), accepted: null,
        framework: fw.short, jurisdiction: fw.jurisdiction, code_status: "verified",
      });
    }
  } else {
    const areas = areasFor(fw, student.stage);
    const byLower = new Map(areas.map((a) => [a.toLowerCase(), a]));
    for (const m of matches) {
      const area = byLower.get(clip(m?.learning_area, 80).toLowerCase());
      const outcome = stripCodes(clip(m?.outcome, 300));
      if (!area || !outcome) continue;
      const key = `${area}|${outcome.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        id: newId(), learning_area: area, description: outcome,
        evidence_statement: stripCodes(clip(m?.evidence, 400)) || "Shown in the activity described.",
        confidence: CONF(m?.confidence), accepted: null,
        framework: fw.short, jurisdiction: fw.jurisdiction, code_status: "none",
      });
    }
  }
  const order = { high: 0, medium: 1, low: 2 } as const;
  out.sort((a, b) => order[a.confidence] - order[b.confidence]);
  return {
    summary: stripCodes(clip(j.summary, 500)),
    activity_type: clip(j.activity_type, 60) || "Everyday learning",
    mappings: out.slice(0, 5),
    additional_evidence_suggested: clip(j.more_evidence, 300),
  };
}

export async function lifeMapUsage(db: D1Database, familyId: string, now: Date = new Date()) {
  const day = new Date(now.getTime() - 86400000).toISOString();
  const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const q = async (since: string) => Number((await db.prepare("SELECT COUNT(*) n FROM ai_usage WHERE kind = 'life_map' AND status != 'failed' AND family_id = ? AND created_at >= ?").bind(familyId, since).first<{ n: number }>())?.n ?? 0);
  return { day: await q(day), month: await q(month) };
}

export type MapResult =
  | { ok: true; analysis: LifeEvidenceAnalysis }
  | { ok: false; status: number; detail: string; code: string };

export async function mapLifeEvidenceWithAi(
  db: D1Database,
  ai: AiBinding,
  opts: { familyId: string; userId: string; framework: Framework; evidence: Evidence; student: Student; model?: string; gatewayId?: string; limits?: LifeMapLimits },
  now: Date = new Date()
): Promise<MapResult> {
  const limits = opts.limits ?? LIFE_MAP_DEFAULTS;
  const used = await lifeMapUsage(db, opts.familyId, now);
  if (used.day >= limits.perFamilyDay || used.month >= limits.perFamilyMonth) {
    return { ok: false, status: 429, code: "LIFE_MAP_LIMIT", detail: "You've reached the fair-use limit for AI outcome mapping for now. Your activities are saved; try again tomorrow." };
  }
  const { system, user, pool } = buildPrompt(opts.framework, opts.evidence, opts.student);
  const usageId = crypto.randomUUID();
  await db.prepare("INSERT INTO ai_usage (id, family_id, user_id, kind, status, created_at) VALUES (?, ?, ?, 'life_map', 'pending', ?)").bind(usageId, opts.familyId, opts.userId, now.toISOString()).run();
  const mark = (s: string) => db.prepare("UPDATE ai_usage SET status = ? WHERE id = ?").bind(s, usageId).run();
  let raw: unknown;
  try {
    raw = await ai.run(opts.model || DEFAULT_MODEL, { messages: [{ role: "system", content: system }, { role: "user", content: user }], max_tokens: 900, temperature: 0.2 }, opts.gatewayId ? { gateway: { id: opts.gatewayId } } : undefined);
  } catch {
    await mark("failed");
    return { ok: false, status: 502, code: "AI_FAILED", detail: "The AI didn't answer. Nothing was used up. Please try again." };
  }
  const parsed = parseReply(raw, opts.framework, opts.student, pool);
  if (!parsed || !parsed.mappings.length) {
    await mark("failed");
    return { ok: false, status: 502, code: "AI_NO_MATCH", detail: "The AI couldn't link this activity to outcomes. Try adding more detail about what your child did, measured, made or said." };
  }
  await mark("ok");
  const firstName = String(opts.student.name || "Your child").split(/\s+/)[0];
  return {
    ok: true,
    analysis: {
      ...parsed,
      summary: parsed.summary || `${firstName} showed learning through "${clip(opts.evidence.title, 120)}".`,
      additional_evidence_suggested: parsed.additional_evidence_suggested || "Add a photo, a short child reflection, or a sample of any notes or finished work.",
      source: "ai",
      framework: { jurisdiction: opts.framework.jurisdiction, name: opts.framework.name, short: opts.framework.short, url: opts.framework.url, codes: opts.framework.codes },
    },
  };
}
