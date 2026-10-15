// Side-Quest shows official curriculum outcome CODES only. Parents follow a link to the curriculum authority for the
// wording. Syllabus wording is still used privately (for matching and AI prompts) but must never be sent back out.
//
// Older records can still hold wording: lessons saved "CODE: description" in curriculum_refs, life learning mappings
// carried the outcome description, and review mappings could carry it too. Everything that leaves the API goes
// through these helpers so that stored wording is never republished, without rewriting anyone's saved records.
import { NSW_OUTCOMES } from "./data/curriculum";
import { AC9_OUTCOMES } from "./data/ac9-outcomes";

const KNOWN = new Map<string, string>();
for (const o of NSW_OUTCOMES as { code: string; description: string }[]) KNOWN.set(o.code, o.description || "");
for (const o of AC9_OUTCOMES) KNOWN.set(o.code, o.description || "");

const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const OFFICIAL_WORDING = new Set([...KNOWN.values()].filter((d) => d.length >= 20).map(squash));

export const isKnownOutcomeCode = (code: unknown) => KNOWN.has(String(code ?? "").trim());

/** True when the text is (or contains) the official wording of a catalogued outcome. */
export function isOfficialWording(text: unknown): boolean {
  const t = squash(String(text ?? ""));
  if (t.length < 20) return false;
  if (OFFICIAL_WORDING.has(t)) return true;
  for (const w of OFFICIAL_WORDING) if (w.length >= 40 && t.includes(w)) return true;
  return false;
}

/** The description to show next to an outcome: blank for any catalogued code or any text that is official wording. */
export function publicOutcomeDescription(code: unknown, description: unknown): string {
  if (isKnownOutcomeCode(code)) return "";
  const d = String(description ?? "");
  return isOfficialWording(d) ? "" : d;
}

/** "MA2-RN-01: Applies place value…" becomes "MA2-RN-01". Other references (links, family notes) are kept. */
export function publicCurriculumRef(ref: unknown): string {
  const s = String(ref ?? "");
  const m = s.match(/^\s*([A-Za-z0-9][A-Za-z0-9-]{2,24})\s*[:—–-]\s+/);
  if (m && isKnownOutcomeCode(m[1])) return m[1];
  return isOfficialWording(s) ? "" : s;
}

/** Outcome mapping objects (review, life learning, AI suggestions): same object, wording removed. */
export function publicMapping<T extends Record<string, any>>(m: T): T {
  if (!m || typeof m !== "object") return m;
  const out: any = { ...m };
  if ("description" in out) out.description = publicOutcomeDescription(out.code, out.description);
  if ("outcome" in out && typeof out.outcome === "string") out.outcome = publicOutcomeDescription(out.code, out.outcome);
  return out;
}

/** Any JSON value (e.g. a stored AI learning plan) with strings that are official outcome wording removed. */
export function scrubWording<T>(v: T, depth = 0): T {
  if (depth > 12 || v == null) return v;
  if (typeof v === "string") return (isOfficialWording(v) ? "" : v) as any;
  if (Array.isArray(v)) return v.map((x) => scrubWording(x, depth + 1)) as any;
  if (typeof v === "object") {
    const out: any = {};
    for (const [k, x] of Object.entries(v as any)) out[k] = k === "description" && isKnownOutcomeCode((v as any).code) ? "" : scrubWording(x, depth + 1);
    return out;
  }
  return v;
}

/** A lesson object as returned by the API, with any stored syllabus wording removed from its references. */
export function publicLesson<T extends Record<string, any>>(l: T): T {
  if (!l || typeof l !== "object") return l;
  if (!Array.isArray(l.curriculum_refs)) return l;
  return { ...l, curriculum_refs: l.curriculum_refs.map(publicCurriculumRef).filter(Boolean) };
}
