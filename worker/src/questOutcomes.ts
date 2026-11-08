// Quest Book lessons are written once (by the owner) but bought by families in every state and territory.
// When the owner publishes, each lesson is matched to the outcomes of every curriculum Side-Quest holds
// (NSW, Australian Curriculum v9 for QLD/SA/TAS/ACT/NT, WA, and VIC when loaded). When a family adds the
// lesson it gets the codes for its own state. Codes always come from the verified catalogues: the AI only
// picks numbers from a list, and a keyword match is the fallback.
import { catalogueFor, type Catalogue, type CatalogueOutcome } from "./outcomeTracker";
import { normArea } from "./outcomeMatch";
import { summaryFor } from "./data/outcomeSummaries";
import { stageFor } from "./aiRequest";
import { JURISDICTION_CODES } from "./data/jurisdictions";

// Lesson subject -> catalogue learning area (kept here, not imported from autoQuest, to avoid an import cycle with aiDraft).
const TO_AC9: Record<string, string> = {
  English: "English", Mathematics: "Mathematics", "Science and Technology": "Science", Science: "Science",
  HSIE: "Humanities and Social Sciences", PDHPE: "Health and Physical Education", "Creative Arts": "The Arts", TAS: "Technologies",
};
function areaMatcher(cat: Catalogue, stage: string) {
  const areas = new Set(cat.outcomes.map((o) => o.learning_area));
  return (title: string) => {
    const t = String(title || "").replace(/\s*·.*$/, "").trim();
    for (const a of areas) if (a.toLowerCase() === t.toLowerCase()) return a;
    if (/^technolog/i.test(t) && areas.has("Technologies")) return "Technologies";
    const nsw = normArea(t, stage);
    if (!nsw) return t;
    if (cat.framework === "NSW") return nsw;
    return TO_AC9[nsw] && areas.has(TO_AC9[nsw]) ? TO_AC9[nsw] : t;
  };
}

type AiLike = { run(model: string, input: Record<string, unknown>, options?: Record<string, unknown>): Promise<any> };
export type FrameworkCodes = Record<string, string[]>;

/** Every distinct catalogue Side-Quest can map to (one per framework, e.g. NSW, AC9, WA, VIC). */
export function allCatalogues(): Catalogue[] {
  const seen = new Map<string, Catalogue>();
  for (const j of JURISDICTION_CODES as readonly string[]) {
    const cat = catalogueFor(j as any);
    if (cat.available && !seen.has(cat.framework)) seen.set(cat.framework, cat);
  }
  return [...seen.values()];
}

const STOP = new Set(["the", "and", "that", "with", "for", "are", "this", "from", "into", "their", "they", "them", "your", "you", "can", "will", "have", "use", "using", "about", "when", "how", "what", "which", "each", "other", "more", "than", "lesson", "learn", "students", "student", "child"]);
const toks = (s: string) => (s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").match(/[a-z0-9]{3,}/g) || []).filter((w) => !STOP.has(w)).map((w) => w.replace(/(ing|ed|es|s)$/, ""));
const describe = (o: CatalogueOutcome) => o.description || summaryFor(o.code);

/**
 * Core History and Geography workbooks should only receive outcomes for that
 * discipline, not unrelated HASS strands. VIC stores the discipline in
 * subject; WA often stores it in strand instead.
 */
const focusedDiscipline = (lesson: { learning_area?: string }): "history" | "geography" | null => {
  const name = String(lesson.learning_area || "").trim().toLowerCase();
  return name === "history" || name === "geography" ? name : null;
};

/** Outcomes for this lesson's year and subject in one catalogue (no languages, EAL or special pathways). */
export function poolFor(cat: Catalogue, lesson: { learning_area?: string }, year: number | null): CatalogueOutcome[] {
  if (year === null) return [];
  const stage = stageFor(year === 0 ? "Foundation" : `Year ${year}`) || "";
  const area = areaMatcher(cat, stage)(String(lesson.learning_area || ""));
  const discipline = focusedDiscipline(lesson);
  return cat.outcomes.filter((o) => {
    if (cat.framework === "VIC" && o.status === "PUBLISHED_V2_BUT_V1_APPLIES_2026" && new Date().getFullYear() < 2027) return false;
    if (discipline && (cat.framework === "VIC" || cat.framework === "WA")) {
      const sourceDiscipline = cat.framework === "VIC" ? o.subject : o.strand;
      if (!new RegExp(`\\b${discipline}\\b`, "i").test(String(sourceDiscipline || ""))) return false;
    }
    if (o.pathway || o.stage.startsWith("EAL-") || (o.levels || []).some((l) => /^(ABLEWA|FL)/.test(l))) return false;
    if (o.learning_area !== area && !(o.learning_areas || []).includes(area)) return false;
    if (o.from != null && o.to != null) return year >= o.from && year <= o.to;
    if (o.levels?.length) return o.levels.includes(year === 0 ? "Foundation" : String(year));
    return o.stage === stage;
  }).filter((o) => describe(o));
}

const lessonText = (l: any) => [
  l?.title, ...(l?.objectives || []), ...(l?.key_words || []).map((k: any) => k?.word),
  ...(l?.sections || []).map((s: any) => s?.heading),
].filter(Boolean).join(" ");

/** Plain wording match, used when the AI isn't available or picks nothing. */
export function keywordMatch(pool: CatalogueOutcome[], lesson: any, limit = 2): string[] {
  const want = new Set(toks(lessonText(lesson)));
  if (!want.size) return [];
  const scored = pool.map((o) => {
    const t = new Set(toks(describe(o)));
    let hit = 0;
    for (const w of t) if (want.has(w)) hit++;
    return { o, score: hit / Math.sqrt(t.size + 3) };
  }).filter((x) => x.score >= 0.5).sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.o.code);
}

async function aiPick(ai: AiLike, pool: CatalogueOutcome[], lesson: any, opts: { model: string; gatewayId?: string }, limit = 3): Promise<string[] | null> {
  // Long lists are trimmed to the best wording matches first, so the prompt stays small.
  let list = pool;
  if (list.length > 80) {
    const want = new Set(toks(lessonText(lesson)));
    list = [...pool].map((o) => ({ o, s: toks(describe(o)).filter((w) => want.has(w)).length })).sort((a, b) => b.s - a.s).slice(0, 80).map((x) => x.o);
  }
  const messages = [
    { role: "system", content: `You match a school lesson to curriculum outcomes. Choose ONLY from the numbered list. Choose 1 to ${limit} outcomes the lesson's teaching directly develops, best first. If none truly fit, choose none. Reply with ONE JSON object only: {"matches":[number,...]}` },
    { role: "user", content: `Lesson: ${lessonText(lesson).slice(0, 1500)}\n\nOUTCOMES:\n${list.map((o, i) => `${i + 1}. ${describe(o)}`).join("\n")}` },
  ];
  const raw: any = await ai.run(opts.model, { messages, max_tokens: 120, temperature: 0 }, opts.gatewayId ? { gateway: { id: opts.gatewayId } } : undefined);
  const text = typeof raw?.response === "string" ? raw.response : JSON.stringify(raw?.response ?? raw?.choices?.[0]?.message?.content ?? "");
  const m = /\{[\s\S]*\}/.exec(text);
  if (!m) return null;
  let nums: unknown[] = [];
  try { nums = JSON.parse(m[0]).matches ?? []; } catch { return null; }
  const seen = new Set<number>();
  return (Array.isArray(nums) ? nums : []).map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= list.length && !seen.has(n) && seen.add(n)).slice(0, limit).map((n) => list[n - 1].code);
}

/**
 * Codes for one lesson in every framework. The owner's own NSW codes (picked when the lesson was drafted) are kept;
 * every other framework is matched here.
 */
export async function codesForAllFrameworks(lesson: any, year: number | null, ai: AiLike | undefined, opts: { model?: string; gatewayId?: string }): Promise<FrameworkCodes> {
  const out: FrameworkCodes = {};
  for (const cat of allCatalogues()) {
    const own = (Array.isArray(lesson?.outcome_codes) ? lesson.outcome_codes : []).map(String).filter((c: string) => cat.byCode.has(c));
    if (own.length) { out[cat.framework] = own; continue; }
    const pool = poolFor(cat, lesson, year);
    if (!pool.length) { out[cat.framework] = []; continue; }
    let codes: string[] | null = null;
    if (ai && opts.model) { try { codes = await aiPick(ai, pool, lesson, { model: opts.model, gatewayId: opts.gatewayId }); } catch { codes = null; } }
    if (!codes || !codes.length) codes = keywordMatch(pool, lesson);
    out[cat.framework] = codes.filter((c) => cat.byCode.has(c));
  }
  return out;
}

// ---------------------------------------------------------------- any lesson, any state
const STAGE_YEARS: Record<string, [number, number]> = { ES1: [0, 0], S1: [1, 2], S2: [3, 4], S3: [5, 6], S4: [7, 8], S5: [9, 10], S6: [11, 12] };

/** School years a lesson is pitched at, from its year level ("Year 3", "Foundation", "Kindergarten") or its stage. */
export function lessonYears(lesson: any): number[] {
  const yl = String(lesson?.year_level || lesson?.year || "").trim();
  if (/^(foundation|kindergarten|kindy|prep|pre-?primary|reception|transition|f)$/i.test(yl)) return [0];
  const m = /(\d{1,2})/.exec(yl);
  if (m && Number(m[1]) <= 12) return [Number(m[1])];
  const range = STAGE_YEARS[String(lesson?.stage || "").toUpperCase()];
  if (!range) return [];
  const out: number[] = [];
  for (let y = range[0]; y <= range[1]; y++) out.push(y);
  return out;
}

export type CatalogueSuggestion = { code: string; description: string; stage: string; learning_area: string; source: string; score: number; confidence: "likely" | "possible" };

/** Suggests outcomes from one state's catalogue (AC9, WA, VIC...). The AI picks only from the real list; wording match is the fallback. */
export async function suggestFromCatalogue(cat: Catalogue, lesson: any, ai: AiLike | undefined, opts: { model?: string; gatewayId?: string }, limit = 3): Promise<{ suggestions: CatalogueSuggestion[]; method: "ai" | "wording" }> {
  const seen = new Set<string>();
  const pool: CatalogueOutcome[] = [];
  for (const y of lessonYears(lesson)) for (const o of poolFor(cat, lesson, y)) if (!seen.has(o.code)) { seen.add(o.code); pool.push(o); }
  if (!pool.length) return { suggestions: [], method: "wording" };
  let codes: string[] | null = null;
  let method: "ai" | "wording" = "wording";
  if (ai && opts.model) { try { codes = await aiPick(ai, pool, lesson, { model: opts.model, gatewayId: opts.gatewayId }, limit); if (codes?.length) method = "ai"; } catch { codes = null; } }
  if (!codes || !codes.length) codes = keywordMatch(pool, lesson, limit);
  const byCode = new Map(pool.map((o) => [o.code, o]));
  return {
    method,
    suggestions: codes.filter((c) => byCode.has(c)).map((c, i) => {
      const o = byCode.get(c)!;
      return { code: c, description: describe(o), stage: o.stage, learning_area: o.learning_area, source: cat.name, score: 0, confidence: i === 0 ? "likely" as const : "possible" as const };
    }),
  };
}
