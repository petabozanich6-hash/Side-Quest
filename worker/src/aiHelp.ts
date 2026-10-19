// "I'm stuck! Help me understand." Short, lesson-bound help for a child: explain differently, another example, or a hint.
// One Workers AI call per request at most (stored hints are reused for free). The context comes from the child's own
// assignment on the server; the browser only says which part of the lesson and which kind of help. Answer keys are never
// sent to the model, and a reply that contains the answer to a practice or assessment item is replaced with a safe nudge.
import * as lb from "./lessonBuilder";
import type { Result } from "./lessonBuilder";
import { extractJson, DEFAULT_MODEL } from "./aiDraft";
import type { AiBinding } from "./aiDraft";
import { AU_LANGUAGE_RULE, localiseGeneratedDraft, australianSpelling } from "./lessonLanguage";

type DB = D1Database;
export type HelpKind = "explain" | "example" | "hint";
export type HelpLimits = { perChildDay: number; perFamilyDay: number; perFamilyMonth: number };
export const HELP_DEFAULTS: HelpLimits = { perChildDay: 15, perFamilyDay: 40, perFamilyMonth: 400 };
export const helpLimits = (env: { HELP_PER_CHILD_DAY?: string; HELP_PER_FAMILY_DAY?: string; HELP_PER_FAMILY_MONTH?: string } = {}): HelpLimits => ({
  perChildDay: Number(env.HELP_PER_CHILD_DAY) || HELP_DEFAULTS.perChildDay,
  perFamilyDay: Number(env.HELP_PER_FAMILY_DAY) || HELP_DEFAULTS.perFamilyDay,
  perFamilyMonth: Number(env.HELP_PER_FAMILY_MONTH) || HELP_DEFAULTS.perFamilyMonth,
});

const parse = (v: unknown, d: any) => { try { return v ? JSON.parse(String(v)) : d; } catch { return d; } };
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

async function counts(db: DB, familyId: string, childId: string, now: Date) {
  const day = new Date(now.getTime() - 86400000).toISOString();
  const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const q = async (sql: string, ...b: unknown[]) => Number((await db.prepare(sql).bind(...b).first<{ n: number }>())?.n ?? 0);
  const base = "SELECT COUNT(*) n FROM ai_usage WHERE kind = 'help' AND status != 'failed' AND family_id = ?";
  return {
    child_day: await q(`${base} AND user_id = ? AND created_at >= ?`, familyId, childId, day),
    family_day: await q(`${base} AND created_at >= ?`, familyId, day),
    family_month: await q(`${base} AND created_at >= ?`, familyId, month),
  };
}

async function childRow(db: DB, familyId: string, childId: string) {
  return db.prepare("SELECT year_level, stage, interests, extra FROM students WHERE id = ? AND family_id = ?").bind(childId, familyId).first<any>();
}

/** Whether the help button should show for this child, with a reason when it should not. */
export async function helpStatus(db: DB, ai: AiBinding | undefined, user: { id: string; family_id: string }, limits: HelpLimits, now: Date = new Date()) {
  const { limits: ent } = await lb.getEntitlement(db, user.family_id, now);
  if (!ent.aiGeneration) return { available: false, reason: "plan" };
  if (!ai) return { available: false, reason: "unavailable" };
  const row = await childRow(db, user.family_id, user.id);
  if (!row) return { available: false, reason: "unavailable" };
  if (parse(row.extra, {}).ai_help === false) return { available: false, reason: "parent_off" };
  const c = await counts(db, user.family_id, user.id, now);
  const left = Math.max(0, Math.min(limits.perChildDay - c.child_day, limits.perFamilyDay - c.family_day, limits.perFamilyMonth - c.family_month));
  return { available: true, remaining_today: left, reason: left ? undefined : "limit" };
}

/** For the parent: how much each child has used, with the limits. */
export async function helpUsageForFamily(db: DB, familyId: string, limits: HelpLimits, now: Date = new Date()) {
  const { results } = await db.prepare("SELECT id, name FROM students WHERE family_id = ?").bind(familyId).all<{ id: string; name: string }>();
  const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const out: Record<string, { month: number; today: number }> = {};
  for (const s of results ?? []) {
    const c = await counts(db, familyId, s.id, now);
    const m = Number((await db.prepare("SELECT COUNT(*) n FROM ai_usage WHERE kind = 'help' AND status != 'failed' AND family_id = ? AND user_id = ? AND created_at >= ?").bind(familyId, s.id, month).first<{ n: number }>())?.n ?? 0);
    out[s.id] = { month: m, today: c.child_day };
  }
  return { children: out, limits };
}

const norm = (s: string) => s.toLowerCase().replace(/[−–]/g, "-").replace(/[^a-z0-9.\- ]+/g, " ").replace(/(?<!\d)\.|\.(?!\d)/g, " ").replace(/\s+/g, " ").trim();
/** True when the reply states the answer to the item the child is working on. */
export function leaksAnswer(output: string, answers: string[]): boolean {
  const o = norm(output);
  for (const raw of answers) {
    const a = norm(raw);
    if (!a || a.length > 80) continue;
    const num = /^(-?\d+(?:\.\d+)?)(?: ?[a-z]{1,4})?$/.exec(a)?.[1];
    if (num) { if (new RegExp(`(?<![\\d.])${num.replace(/[.\-]/g, "\\$&")}(?![\\d]|\\.\\d)`).test(o)) return true; }
    else if (a.length >= 3 && ` ${o} `.includes(` ${a} `)) return true;
  }
  return false;
}

type Target = { part: string; i: number; j: number };
function locate(lesson: any, t: Target) {
  const L = lesson || {};
  const sec = (L.sections || [])[t.i];
  const bits: { label: string; text: string; answers: string[]; hint?: string; graded: boolean } = { label: "the lesson", text: clip(L.introduction, 900), answers: [], graded: false };
  if (t.part === "section" && sec) { bits.label = "an explanation"; bits.text = `${sec.heading || ""}\n${clip(sec.body, 1500)}`; }
  else if (t.part === "worked" && (L.worked_examples || [])[t.i]) { const w = L.worked_examples[t.i]; bits.label = "a worked example"; bits.text = `${w.title || ""}\nProblem: ${clip(w.problem, 600)}\nSteps: ${(w.steps || []).join(" ")}\nAnswer: ${w.answer || ""}`.slice(0, 1600); }
  else if (t.part === "guided" && (L.guided_practice || [])[t.i]) { const g = L.guided_practice[t.i]; bits.label = "a practice question"; bits.text = clip(g.prompt, 800); bits.hint = clip(g.hint, 500); bits.answers = [g.answer]; }
  else if (t.part === "task" && (L.activities || [])[t.i]?.tasks?.[t.j]) { const a = L.activities[t.i]; const k = a.tasks[t.j]; bits.label = "an activity question"; bits.text = `Activity: ${a.title}\n${clip(k.prompt, 800)}`; bits.answers = [k.answer]; }
  else if (t.part === "question" && (L.questions || [])[t.i]) { const q = L.questions[t.i]; bits.label = "a written question"; bits.text = clip(q.prompt, 800); bits.answers = [q.answer_key]; bits.graded = true; }
  else if (t.part === "quiz" && (L.quiz || [])[t.i]) { const q = L.quiz[t.i]; bits.label = "a quiz question"; bits.text = `${clip(q.question, 600)}\nOptions: ${(q.options || []).join(" | ")}`; bits.answers = [q.options?.[q.correct_index]]; bits.graded = true; }
  else if (t.part !== "general") return null;
  bits.answers = bits.answers.filter((x) => typeof x === "string" && x);
  return bits;
}

const SYSTEM = [
  "You are a kind, patient tutor helping a school-aged child who is stuck on one part of a lesson inside a learning app.",
  "Stay strictly on the lesson part you are given. Never chat about anything else, never ask for or mention personal information, names, locations or photos, and never give links or tell the child to use other websites or apps. If asked something off-topic, say you can only help with this lesson.",
  "TEACH the child; do not simply rephrase a textbook, recite rules or ask them to reread material they already found confusing. Start from one prerequisite they know, explain what the new idea means, then demonstrate an ENTIRE different example step by step, telling them WHY each step works. If a method has a confusing name, show its meaning before using the name. Use short sentences suited to their year level. Be encouraging without being babyish. Maths working goes on separate lines using plain text (e.g. 34 + 28, 30 + 20 = 50, 4 + 8 = 12, 50 + 12 = 62). Never give answers to the child's actual unanswered questions. Do not use markdown headings, tables or LaTeX.",
  "Never state the final answer to the question the child is working on, and never mark or grade it. Teach the idea so the child can work it out.",
  "Keep the whole reply under 150 words. Only facts you are sure are true.",
  AU_LANGUAGE_RULE,
].join("\n");

const KIND_TEXT: Record<HelpKind, string> = {
  explain: "Give a MINI-LESSON that actually teaches the confusing idea again: what it means, a familiar concrete analogy, ONE fully demonstrated fresh example, and WHY every step follows. Build understanding from a simpler prerequisite, not a paraphrase of the original. For maths, name the meaning of the symbols and show each calculation change on its own line. Never solve or reveal the child's specific unanswered problem.",
  example: "Show ONE new, similar worked example using DIFFERENT numbers or words (not the child's question). Start by saying what the symbols or vocabulary mean. Show the complete working, each step on its own line, and say WHY each move works; for equations, explain balance and check by substitution. Then invite the child to do only the first step of their own question.",
  hint: "Give a hint, not the answer. Help the child think about the first step or what to notice, using a question or a small scaffold (for example, suggest splitting numbers into tens and ones, or picture a number line). Do not solve it.",
};

export function helpPrompt(opts: { lesson: any; bits: NonNullable<ReturnType<typeof locate>>; kind: HelpKind; level: number; year: string; prefs: any; interests: string[]; pet?: { name: string; species: string } | null }) {
  const { lesson: L, bits, kind, level, year, prefs, interests } = opts;
  const teach = (L.sections || []).slice(0, 2).map((s: any) => `${s.heading || ""}: ${clip(s.body, 450)}`).join("\n");
  return [
    `Subject: ${L.learning_area || "not stated"}. Child's year level: ${year || "not stated"}. Lesson: ${L.title || ""}.`,
    (L.objectives || []).length ? `Learning goals: ${(L.objectives || []).slice(0, 3).join("; ")}` : "",
    prefs?.reading === "supported" ? "The child needs reading support: use very short sentences and simple words." : "",
    prefs?.complexity === "simpler" ? "Keep it simple and concrete." : prefs?.complexity === "challenging" ? "The child likes a challenge: you can reason a little more deeply." : "",
    interests.length && kind === "example" ? `If it fits naturally, use one of the child's interests for the context: ${interests.slice(0, 3).join(", ")}.` : "",
    teach && bits.label !== "an explanation" ? `What the lesson has taught so far:\n${teach}` : "",
    `The child is stuck on ${bits.label}:\n${bits.text}`,
    bits.hint && kind === "hint" ? `The teacher's own hint for this question (you may build on it): ${bits.hint}` : "",
    kind === "hint" && level > 1 ? `The child has already had ${level - 1} hint${level > 2 ? "s" : ""}. Make this one a little more direct than a first hint, but still do not state the answer.` : "",
    bits.graded ? "This question is part of an assessment: do not give or confirm the answer; teach the underlying idea with a different example." : "",
    KIND_TEXT[kind],
    opts.pet ? `Speak as the child's pet companion, ${opts.pet.name} the ${opts.pet.species}: begin with one short, warm line in that friendly voice, then teach clearly. Every rule above still applies, and never pretend to be a person.` : "",
  ].filter(Boolean).join("\n\n");
}

const FALLBACK: Record<HelpKind, string> = {
  explain: "Start with the simplest example you understand. If a symbol or word is new, ask what it stands for before using any rule. In the worked example, find the FIRST change and ask: what changed, and why is that allowed? Follow that one move before attempting the rest. You can ask your parent to help re-teach this part if the explanation still is not clear.",
  example: "Look at the worked examples above. Pick the one most like your question and copy its steps with your own numbers, one step at a time.",
  hint: "Try breaking the problem into smaller steps. What is the very first thing you could work out? Look back at the worked example and match its first step to your question.",
};

export async function helpForChild(
  db: DB,
  ai: AiBinding | undefined,
  opts: { user: { id: string; family_id: string }; assignmentId: string; kind: unknown; target: unknown; level?: unknown; model?: string; gatewayId?: string; limits?: HelpLimits },
  now: Date = new Date()
): Promise<Result<{ text: string; source: "stored" | "ai" | "fallback"; remaining_today: number }>> {
  const { user } = opts;
  const limits = opts.limits ?? HELP_DEFAULTS;
  const kind = opts.kind === "explain" || opts.kind === "example" || opts.kind === "hint" ? (opts.kind as HelpKind) : null;
  if (!kind) return lb.fail(400, "Choose what kind of help you want.");
  const st = await helpStatus(db, ai, user, limits, now);
  if (!st.available) {
    if (st.reason === "plan") return lb.fail(402, "Ask your grown-up for help with this one.", "HELP_NOT_AVAILABLE");
    if (st.reason === "parent_off") return lb.fail(403, "Your grown-up has switched this helper off. Ask them for help with this one.", "HELP_OFF");
    return lb.fail(503, "The helper isn't available right now. Ask your grown-up for help with this one.", "AI_UNAVAILABLE");
  }
  if (st.reason === "limit") return lb.fail(429, "You've used all your helper questions for now. Ask your grown-up, or try again tomorrow.", "HELP_LIMIT");

  const a = await db.prepare("SELECT * FROM assignments WHERE id = ? AND student_id = ? AND family_id = ?").bind(opts.assignmentId, user.id, user.family_id).first<any>();
  if (!a || a.status === "revoked") return lb.fail(404, "Lesson not found");
  if (lb.DONE_STATUSES.includes(a.status)) return lb.fail(409, "This lesson is finished.", "ALREADY_DONE");
  const live = a.lesson_snapshot ? null : await db.prepare("SELECT * FROM lessons WHERE id = ?").bind(a.lesson_id).first<any>();
  const lesson = lb.assignmentLesson(a, live);
  const t: any = opts.target && typeof opts.target === "object" ? opts.target : {};
  const target: Target = { part: clip(t.part, 20) || "general", i: Math.max(0, Math.min(99, Number(t.i) || 0)), j: Math.max(0, Math.min(99, Number(t.j) || 0)) };
  const bits = locate(lesson, target);
  if (!bits) return lb.fail(400, "That part of the lesson wasn't found.");
  const level = Math.max(1, Math.min(5, Math.round(Number(opts.level) || 1)));

  // A hint the teacher/generator already wrote answers a first request for free.
  if (kind === "hint" && level === 1 && bits.hint) return { ok: true, text: bits.hint, source: "stored", remaining_today: st.remaining_today ?? 0 };
  if (!ai) return lb.fail(503, "The helper isn't available right now.", "AI_UNAVAILABLE");

  const row = await childRow(db, user.family_id, user.id);
  const extra = parse(row?.extra, {});
  const year = /^\d{1,2}$/.test(String(row?.year_level || "")) ? `Year ${row.year_level}` : String(row?.year_level || lesson?.year_level || "");
  const petRow = await db.prepare("SELECT name, species FROM pets WHERE student_id = ?").bind(user.id).first<any>().catch(() => null);
  const pet = petRow?.name ? { name: String(petRow.name).slice(0, 30), species: String(petRow.species || "pet").slice(0, 20) } : null;
  const prompt = helpPrompt({ lesson, bits, kind, level, year, pet, prefs: extra.prefs || {}, interests: parse(row?.interests, []).filter((x: unknown) => typeof x === "string").slice(0, 3) });

  const usageId = crypto.randomUUID();
  await db.prepare("INSERT INTO ai_usage (id, family_id, user_id, kind, status, created_at) VALUES (?, ?, ?, 'help', 'pending', ?)").bind(usageId, user.family_id, user.id, now.toISOString()).run();
  const mark = (s: string) => db.prepare("UPDATE ai_usage SET status = ? WHERE id = ?").bind(s, usageId).run();
  let out = "";
  try {
    const raw: any = await ai.run(opts.model || DEFAULT_MODEL, { messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }], max_tokens: 420, temperature: 0.4 }, opts.gatewayId ? { gateway: { id: opts.gatewayId } } : undefined);
    out = typeof raw === "string" ? raw : typeof raw?.response === "string" ? raw.response : raw?.choices?.[0]?.message?.content ?? "";
    if (typeof out !== "string") out = "";
    const asJson: any = out.trim().startsWith("{") ? extractJson(out) : null;
    if (asJson && typeof asJson.response === "string") out = asJson.response;
  } catch {
    await mark("failed");
    return lb.fail(502, "The helper didn't answer. Nothing was used up. Please try again.", "AI_FAILED");
  }
  out = out.replace(/\*\*|__|^#+\s*/gm, "").trim().slice(0, 1400);
  if (out.length < 20) { await mark("failed"); return lb.fail(502, "The helper didn't answer. Nothing was used up. Please try again.", "AI_FAILED"); }
  // Keep modelled examples in Australian spelling, but never reveal the
  // underlying graded answer, even when the spellings differ.
  if (leaksAnswer(out, bits.answers)) {
    await mark("failed"); // a safe nudge instead; it costs the family nothing against their allowance
    return { ok: true, text: bits.hint || FALLBACK[kind], source: "fallback", remaining_today: st.remaining_today ?? 0 };
  }
  out = localiseGeneratedDraft({ text: out }, String(lesson.learning_area || ""), String(lesson.title || "")).text;
  if (leaksAnswer(out, [...bits.answers, ...bits.answers.map(australianSpelling)])) {
    await mark("failed");
    return { ok: true, text: bits.hint || FALLBACK[kind], source: "fallback", remaining_today: st.remaining_today ?? 0 };
  }
  await mark("ok");
  return { ok: true, text: out, source: "ai", remaining_today: Math.max(0, (st.remaining_today ?? 1) - 1) };
}
