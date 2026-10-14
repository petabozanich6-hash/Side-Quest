// Suggests which curriculum outcomes a lesson contributes to. This is a plain wording match against the outcome list the app
// holds (no AI call, no cost). It is a SUGGESTION for the parent to confirm: it never claims a lesson "covers" an outcome.
// Today the outcome list is the NSW syllabus. Other states and territories are not loaded yet, so nothing here is presented as national.
import { NSW_OUTCOMES } from "./data/curriculum";
import { stageFor } from "./aiRequest";

export type OutcomeSuggestion = { code: string; description: string; stage: string; learning_area: string; source: string; score: number; confidence: "likely" | "possible" };

export const OUTCOME_FRAMEWORK = "NSW syllabus outcomes";

const STOP = new Set(["the", "and", "that", "with", "for", "are", "this", "from", "into", "their", "they", "them", "your", "you", "can", "will", "have", "has", "use", "uses", "using", "used", "about", "when", "how", "what", "why", "which", "each", "other", "more", "than", "through", "within", "between", "using", "lesson", "learn", "students", "student", "child", "number"]);
const stem = (w: string) => w.replace(/(ing|ed|es|s|ly)$/, (m, _x, off) => (off >= 4 ? "" : m));
const toks = (s: string) => (s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").match(/[a-z0-9]{3,}/g) || []).filter((w) => !STOP.has(w)).map(stem);

export function normArea(area: string, stage: string): string | null {
  const a = (area || "").toLowerCase();
  const primary = ["ES1", "S1", "S2", "S3"].includes(stage);
  if (/math|numeracy|arithmetic|algebra|geometry|statistics/.test(a)) return "Mathematics";
  if (/english|literacy|reading|writing|spelling|grammar|phonics|handwriting/.test(a)) return "English";
  if (/science|technolog|stem|biology|chemistry|physics|earth|space/.test(a)) return primary ? "Science and Technology" : "Science";
  if (/hsie|history|geograph|civic|econom|humanit|society|social/.test(a)) return "HSIE";
  if (/pdhpe|health|physical|sport|fitness|wellbeing/.test(a)) return "PDHPE";
  if (/art|music|drama|dance|creative/.test(a)) return "Creative Arts";
  if (/tas\b|food|design|textile|engineer|agricult|computing|coding/.test(a)) return "TAS";
  return null;
}

const idfCache = new Map<string, number>();
function idf(): (t: string) => number {
  if (!idfCache.size) {
    const df = new Map<string, number>();
    for (const o of NSW_OUTCOMES) for (const t of new Set(toks(o.description))) df.set(t, (df.get(t) || 0) + 1);
    for (const [t, n] of df) idfCache.set(t, Math.log(1 + NSW_OUTCOMES.length / n));
    idfCache.set("\u0000default", Math.log(1 + NSW_OUTCOMES.length));
  }
  return (t) => idfCache.get(t) ?? (idfCache.get("\u0000default") as number);
}

/** Top matches for a lesson (an object with title, objectives, key_words, sections, learning_area, stage or year_level). */
export function suggestOutcomes(lesson: any, limit = 3): OutcomeSuggestion[] {
  const stage = lesson?.stage || stageFor(String(lesson?.year_level || ""));
  const area = normArea(String(lesson?.learning_area || ""), stage);
  const pool = NSW_OUTCOMES.filter((o) => (!stage || o.stage === stage) && (!area || o.learning_area === area));
  if (!pool.length) return [];
  const weights = new Map<string, number>();
  const add = (text: unknown, w: number) => { for (const t of toks(String(text || ""))) weights.set(t, Math.max(weights.get(t) || 0, w)); };
  add(lesson?.title, 3);
  (lesson?.objectives || []).forEach((o: string) => add(o, 2.5));
  (lesson?.key_words || []).forEach((k: any) => add(k?.word, 2));
  (lesson?.sections || []).forEach((s: any) => add(s?.heading, 1.5));
  (lesson?.worked_examples || []).forEach((w: any) => add(w?.title, 1));
  if (!weights.size) return [];
  const f = idf();
  const scored = pool.map((o) => {
    const ot = new Set(toks(o.description));
    let hit = 0;
    for (const [t, w] of weights) if (ot.has(t)) hit += w * f(t);
    const score = hit / Math.sqrt(ot.size + 4);
    return { o, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
  if (!scored.length) return [];
  const best = scored[0].score;
  return scored.slice(0, limit).filter((x, i) => i === 0 || x.score >= best * 0.6).map((x, i) => ({
    code: x.o.code, description: x.o.description, stage: x.o.stage, learning_area: x.o.learning_area, source: x.o.source,
    score: Math.round(x.score * 100) / 100, confidence: i === 0 && x.score >= 6 ? "likely" : "possible",
  }));
}

export const outcomeRef = (o: { code: string; description: string }) => `${o.code}: ${o.description}`.slice(0, 200);
export const knownOutcomeCodes = () => new Set(NSW_OUTCOMES.map((o) => o.code));

export function outcomePool(lesson: any) {
  const stage = lesson?.stage || stageFor(String(lesson?.year_level || ""));
  const area = normArea(String(lesson?.learning_area || ""), stage);
  return NSW_OUTCOMES.filter((o) => (!stage || o.stage === stage) && (!area || o.learning_area === area));
}

const summary = (l: any) => [
  `Title: ${l?.title || ""}`, l?.year_level ? `Year: ${l.year_level}` : "", `Subject: ${l?.learning_area || ""}`,
  `Objectives: ${(l?.objectives || []).join(" | ")}`,
  `Key words: ${(l?.key_words || []).map((k: any) => k?.word).filter(Boolean).join(", ")}`,
  `What is taught: ${(l?.sections || []).map((s: any) => s?.heading).filter(Boolean).join("; ")}`,
  `Worked examples: ${(l?.worked_examples || []).map((w: any) => w?.title || w?.problem).filter(Boolean).slice(0, 5).join("; ")}`,
].filter(Boolean).join("\n");

type AiLike = { run(model: string, input: Record<string, unknown>, options?: Record<string, unknown>): Promise<any> };

/** Asks the model to PICK from the real outcome list (it cannot invent a code: anything not in the list is dropped). */
export async function matchOutcomesWithAi(ai: AiLike, lesson: any, opts: { model: string; gatewayId?: string }, limit = 3): Promise<{ suggestions: OutcomeSuggestion[]; input_tokens: number; output_tokens: number } | null> {
  const pool = outcomePool(lesson);
  if (!pool.length) return { suggestions: [], input_tokens: 0, output_tokens: 0 };
  const messages = [
    { role: "system", content: 'You match a school lesson to curriculum outcomes. You may choose ONLY from the numbered list you are given. Choose 1 to ' + limit + ' outcomes that the lesson\'s teaching directly develops, best match first. If none truly fit, choose none. Reply with ONE JSON object only: {"matches":[number,...]} using the list numbers.' },
    { role: "user", content: `${summary(lesson)}\n\nOUTCOMES:\n${pool.map((o, i) => `${i + 1}. ${o.description}`).join("\n")}` },
  ];
  const raw: any = await ai.run(opts.model, { messages, max_tokens: 120, temperature: 0 }, opts.gatewayId ? { gateway: { id: opts.gatewayId } } : undefined);
  const text = typeof raw?.response === "string" ? raw.response : JSON.stringify(raw?.response ?? raw?.choices?.[0]?.message?.content ?? "");
  const m = /\{[\s\S]*\}/.exec(text);
  if (!m) return null;
  let nums: unknown[] = [];
  try { nums = JSON.parse(m[0]).matches ?? []; } catch { return null; }
  const seen = new Set<number>();
  const picked = (Array.isArray(nums) ? nums : []).map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= pool.length && !seen.has(n) && seen.add(n)).slice(0, limit);
  return {
    suggestions: picked.map((n, i) => { const o = pool[n - 1]; return { code: o.code, description: o.description, stage: o.stage, learning_area: o.learning_area, source: o.source, score: 0, confidence: i === 0 ? "likely" as const : "possible" as const }; }),
    input_tokens: Number(raw?.usage?.prompt_tokens) || 0, output_tokens: Number(raw?.usage?.completion_tokens) || 0,
  };
}
