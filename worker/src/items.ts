// Interactive practice items (guided practice and activity tasks), small data-driven visuals, and server-side marking.
// No dependencies, so it can run in the worker, the tests and the generator alike.
export const KINDS = ["text", "number", "choice", "blank", "order", "match", "long"] as const;
export type Kind = (typeof KINDS)[number];

const s = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : typeof v === "number" ? String(v) : "");
const arr = (v: unknown, n: number): any[] => (Array.isArray(v) ? v.slice(0, n) : []);

/** Normalises the interactive parts of a practice item. Anything inconsistent quietly becomes a plain text item. */
const NUMLEAD = /^[-−]?\d[\d,]*(?:\.\d+)?\s*(?:°?[a-z%]{0,7})?\s*(?:\(|\.|$)/i;
/** The number an answer key stands for: the leading number when the key starts with one ("57 (30 + 20 ...)"), otherwise the last. */
export function keyNumber(key: string): number | null {
  const k = key.trim();
  if (NUMLEAD.test(k)) { const m = /^[-−]?\d[\d,]*(?:\.\d+)?/.exec(k); if (m) return Number(m[0].replace(/[−]/g, "-").replace(/,/g, "")); }
  return lastNumber(k);
}

export function cleanItemKind(o: any, prompt: string, answer: string): { kind?: Kind; options?: string[]; pairs?: { left: string; right: string }[] } {
  let kind: Kind | undefined = KINDS.includes(o?.kind) ? o.kind : undefined;
  if (!kind) return NUMLEAD.test(answer.trim()) ? { kind: "number" } : {};
  if (kind === "choice") {
    const options = arr(o.options, 6).map((x) => s(x, 200)).filter(Boolean);
    let ans = answer;
    if (!ans && Number.isInteger(o.correct_index) && options[o.correct_index]) ans = options[o.correct_index];
    if (options.length >= 2 && options.some((x) => x.toLowerCase() === ans.toLowerCase())) return { kind, options };
    kind = "text";
  }
  if (kind === "order") {
    const options = arr(o.options, 8).map((x) => s(x, 200)).filter(Boolean);
    if (options.length >= 3 && new Set(options).size === options.length) return { kind, options }; // listed in the CORRECT order
    kind = "text";
  }
  if (kind === "match") {
    const pairs = arr(o.pairs, 6).map((p) => ({ left: s(p?.left, 120), right: s(p?.right, 160) })).filter((p) => p.left && p.right);
    if (pairs.length >= 3 && new Set(pairs.map((p) => p.right)).size === pairs.length) return { kind, pairs };
    kind = "text";
  }
  if (kind === "blank") return /_{2,}/.test(prompt) && answer ? { kind } : {};
  if (kind === "number") return answer ? { kind } : {};
  return { kind };
}

// ---- marking --------------------------------------------------------------------------------------------------------
const clean = (t: string) => t.toLowerCase().replace(/[−–]/g, "-").replace(/[^a-z0-9.\-/ ]+/g, " ").replace(/(?<!\d)\.|\.(?!\d)/g, " ").replace(/\s+/g, " ").trim();
export function lastNumber(t: string): number | null {
  const x = String(t).replace(/[−–]/g, "-").replace(/(\d),(\d{3})/g, "$1$2");
  const frac = [...x.matchAll(/(-?\d+)\s*\/\s*(\d+)/g)].pop();
  const dec = [...x.matchAll(/-?\d+(?:\.\d+)?/g)].pop();
  if (frac && (!dec || (frac.index ?? 0) + frac[0].length >= (dec.index ?? 0) + dec[0].length)) return Number(frac[1]) / Number(frac[2]);
  return dec ? Number(dec[0]) : null;
}
const words = (t: string) => (t.match(/\S+/g) || []).length;
const alternatives = (key: string) => key.split(/\s*(?:\||;|\bor\b)\s*/i).map(clean).filter(Boolean);

export type Mark = { result: "correct" | "incorrect" | "recorded"; partial?: string };

/** Marks one response. `given` is a string, a list (order) or a list of right-hand answers in left order (match). */
export function markItem(item: any, given: unknown): Mark {
  const key = String(item?.answer ?? "");
  const kind: Kind | undefined = KINDS.includes(item?.kind) ? item.kind : NUMLEAD.test(key.trim()) ? "number" : undefined;
  if (kind === "long") return { result: "recorded" };
  if (kind === "order") {
    const want: string[] = item.options || [];
    const got = Array.isArray(given) ? given.map(String) : [];
    if (got.length !== want.length) return { result: "incorrect" };
    const right = got.filter((g, i) => g === want[i]).length;
    return right === want.length ? { result: "correct" } : { result: "incorrect", partial: `${right} of ${want.length} are in the right place` };
  }
  if (kind === "match") {
    const pairs: { left: string; right: string }[] = item.pairs || [];
    const got = Array.isArray(given) ? given.map(String) : [];
    const right = pairs.filter((p, i) => got[i] === p.right).length;
    return right === pairs.length ? { result: "correct" } : { result: "incorrect", partial: `${right} of ${pairs.length} matches are right` };
  }
  if (kind === "choice") return { result: clean(String(given ?? "")) === clean(key) ? "correct" : "incorrect" };
  if (kind === "blank") {
    const wants = key.split("|").map((x) => x.trim());
    const gots = String(given ?? "").split("|").map((x) => x.trim());
    const ok = wants.filter((w, i) => alternatives(w).includes(clean(gots[i] || "")) || (lastNumber(w) !== null && /^[-−]?[\d.,/ ]+$/.test(w) && lastNumber(gots[i] || "") === lastNumber(w))).length;
    return ok === wants.length ? { result: "correct" } : { result: "incorrect", partial: wants.length > 1 ? `${ok} of ${wants.length} blanks are right` : undefined };
  }
  const text = String(given ?? "").trim();
  if (!text) return { result: "incorrect" };
  if (kind === "number") {
    const a = lastNumber(text), b = keyNumber(key);
    return a !== null && b !== null && Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)) + 1e-9 ? { result: "correct" } : { result: "incorrect" };
  }
  // short text: a long model answer cannot be auto-marked, so it is recorded and the model answer is shown for comparison
  if (words(key) > 8) return { result: "recorded" };
  const g = clean(text);
  const alts = alternatives(key);
  if (alts.includes(g)) return { result: "correct" };
  for (const a of alts) {
    if (a && words(a) <= 4 && ` ${g} `.includes(` ${a} `)) return { result: "correct" };
  }
  const kn = keyNumber(key);
  if (kn !== null && NUMLEAD.test(key.trim()) && lastNumber(text) === kn) return { result: "correct" };
  return { result: "incorrect" };
}

/** The model answer to show once a child has had a go or asks to see it. */
export function modelAnswer(item: any): string {
  if (item?.kind === "order") return (item.options || []).join("  →  ");
  if (item?.kind === "match") return (item.pairs || []).map((p: any) => `${p.left} → ${p.right}`).join("\n");
  return String(item?.answer ?? "");
}

// ---- what a child may see -----------------------------------------------------------------------------------------------
function stableShuffle<T>(items: T[], seed: string, key: (t: T) => string): T[] {
  const h = (str: string) => { let x = 2166136261; for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; };
  const out = [...items].sort((a, b) => h(seed + key(a)) - h(seed + key(b)));
  if (out.length > 1 && out.every((v, i) => v === items[i])) out.push(out.shift() as T);
  return out;
}

/** Older AI drafts sometimes put an explicit solution in the question or hint itself.
 *  Keep the question and remove only a separately labelled answer, not teaching examples.
 *  This protects already-assigned immutable lesson snapshots as well as new drafts. */
export function childFacingPrompt(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/(^|[?!.][ \t]+|\r?\n[ \t]*)(?:the[ \t]+)?(?:(?:correct|model|sample|expected|final|worked)[ \t]+)?(?:answer(?:[ \t]+key)?|solution|check)[ \t]*(?::|=|is\b|→)[ \t]*[^\r\n]*/gim, "$1").trim();
}

export function hasEmbeddedAnswer(value: unknown): boolean {
  return typeof value === "string" && childFacingPrompt(value) !== value.trim();
}

/** Strips answers from an item for the child. Order and match items are shuffled so the layout does not give the answer away. */
export function childItem(it: any, seed: string) {
  const out: any = { prompt: childFacingPrompt(it?.prompt) };
  if (it?.hint) out.hint = childFacingPrompt(it.hint);
  if (it?.kind) out.kind = it.kind;
  if (it?.kind === "choice") out.options = stableShuffle<string>(it.options || [], seed, (x) => x);
  if (it?.kind === "order") out.options = stableShuffle<string>(it.options || [], seed, (x) => x);
  if (it?.kind === "match") {
    out.lefts = (it.pairs || []).map((p: any) => p.left);
    out.rights = stableShuffle<string>((it.pairs || []).map((p: any) => p.right), seed, (x) => x);
  }
  return out;
}

// ---- visuals ----------------------------------------------------------------------------------------------------------
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)) ? Number(v) : null);

/** Small, data-driven pictures the player draws itself. The model never supplies drawing code. */
export function cleanVisual(v: any): any | undefined {
  if (!v || typeof v !== "object") return undefined;
  const caption = s(v.caption, 200);
  if (v.type === "number_line") {
    const min = num(v.min), max = num(v.max);
    if (min === null || max === null || max <= min) return undefined;
    let step = num(v.step) ?? 1;
    if (step <= 0) step = 1;
    if ((max - min) / step > 40) step = Math.ceil((max - min) / 40);
    const inRange = (x: number | null): x is number => x !== null && x >= min && x <= max;
    const points = arr(v.points, 8).map((p) => ({ at: num(p?.at), label: s(p?.label, 20) })).filter((p) => inRange(p.at)) as { at: number; label: string }[];
    const jumps = arr(v.jumps, 6).map((j) => ({ from: num(j?.from), to: num(j?.to), label: s(j?.label, 20) })).filter((j) => inRange(j.from) && inRange(j.to)) as { from: number; to: number; label: string }[];
    return { type: "number_line", min, max, step, points, jumps, caption };
  }
  if (v.type === "table") {
    const headers = arr(v.headers, 6).map((h) => s(h, 60));
    const rows = arr(v.rows, 12).map((r) => arr(r, 6).map((c) => s(c, 80)));
    if (!headers.length || !rows.length) return undefined;
    return { type: "table", headers, rows, caption };
  }
  if (v.type === "place_value") {
    const n = num(v.number);
    if (n === null || !Number.isInteger(n) || n < 0 || n > 9999) return undefined;
    return { type: "place_value", number: n, caption };
  }
  return undefined;
}

export function cleanKeyWords(v: unknown) {
  return arr(v, 12).map((w) => ({ word: s(w?.word, 60), meaning: s(w?.meaning, 300) })).filter((w) => w.word && w.meaning);
}

/** Honest estimate of how long a child will actually spend, from what the lesson contains. */
export function estimateMinutes(l: { sections?: { body: string }[]; texts?: { content: string }[]; worked_examples?: unknown[]; guided_practice?: unknown[]; activities?: { tasks?: unknown[]; offline?: boolean }[]; questions?: { type?: string }[]; quiz?: unknown[] }): number {
  const wc = (l.sections || []).reduce((n, x) => n + words(x.body || ""), 0) + (l.texts || []).reduce((n, x) => n + words(x.content || ""), 0);
  const tasks = (l.activities || []).reduce((n, a) => n + (a.tasks?.length || (a.offline ? 3 : 1)), 0);
  const written = (l.questions || []).reduce((n, q) => n + (q.type === "long" ? 5 : 2), 0);
  return Math.round(wc / 100 + (l.worked_examples?.length || 0) * 3 + (l.guided_practice?.length || 0) * 1.5 + tasks * 1.5 + written + (l.quiz?.length || 0) * 0.75);
}
