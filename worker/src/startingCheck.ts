// Starting check: a short, auto-marked placement quiz for one subject, so a parent can see what a child new to
// Side-Quest can already do. One Workers AI call per subject writes one multiple-choice question for each of up to
// QUESTIONS_PER_SUBJECT of the child's unmet program outcomes (picked across strands). It becomes an ordinary ready
// lesson, labelled AI-generated, assigned to the child; each question's outcome is kept in starting_checks.
//
// Rules:
// - The quiz never blocks hand-in: any attempt counts, because a placement check isn't pass/fail.
// - Only the FIRST attempt is used for results, so retrying can't inflate them.
// - Results are suggestions. Correct answers are offered as prior learning in the usual tick-and-confirm dialog;
//   the lesson itself has no outcome codes, so the tracker never records the check as evidence on its own.
import type { Env } from "./types";
import type { AiBinding } from "./aiDraft";
import { extractJson, DEFAULT_MODEL } from "./aiDraft";
import { stripCodes } from "./lifeLearningAi";
import { MET_STATUSES, trackerFor } from "./outcomeTracker";
import * as lb from "./lessonBuilder";

type DB = D1Database;
export const QUESTIONS_PER_SUBJECT = 8;
/** Subjects with only a few outcomes (secondary English has 6) get several questions on each, so a check still has enough. */
export const MAX_PER_OUTCOME = 3;
export const perOutcome = (outcomes: number) => Math.min(MAX_PER_OUTCOME, Math.max(1, Math.ceil(QUESTIONS_PER_SUBJECT / Math.max(1, outcomes))));
export const STARTING_CHECK_LIMITS = { perFamilyDay: 16 };
type Fail = { ok: false; status: number; detail: string; code?: string };
const fail = (status: number, detail: string, code?: string): Fail => ({ ok: false, status, detail, code });
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, n) : "");

const SCHEMA = `CREATE TABLE IF NOT EXISTS starting_checks (
 id TEXT PRIMARY KEY, family_id TEXT NOT NULL, student_id TEXT NOT NULL, subject TEXT NOT NULL,
 lesson_id TEXT NOT NULL, assignment_id TEXT NOT NULL, items TEXT NOT NULL, created_by TEXT, created_at TEXT NOT NULL)`;
export async function ensureStartingChecks(db: DB) {
  await db.prepare(SCHEMA).run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_starting_checks_student ON starting_checks (family_id, student_id, created_at)").run();
}

/** Up to `n` outcomes, taking one from each strand in turn so the check covers the subject rather than one corner. */
export function pickAcrossStrands<T extends { strand?: string }>(outcomes: T[], n: number): T[] {
  const byStrand = new Map<string, T[]>();
  for (const o of outcomes) { const k = o.strand || ""; byStrand.set(k, [...(byStrand.get(k) || []), o]); }
  const lists = [...byStrand.values()];
  const out: T[] = [];
  for (let i = 0; out.length < n && lists.some((l) => l.length > i); i++)
    for (const l of lists) if (l[i] && out.length < n) out.push(l[i]);
  return out;
}

const SYSTEM = [
  "You write a short starting check for an Australian child who is new to homeschooling, to find out what they can ALREADY do. It is not a test to pass.",
  "You are given the child's year level and a numbered list of curriculum outcomes in plain English. For each one, write the number of multiple-choice questions asked for, each one a question that a child who has met that outcome would answer correctly, and a child who hasn't usually would not. Questions on the same outcome must check different things.",
  "Each question must be complete and answerable on screen with no pictures, audio, props or outside text: include any numbers, words, sentences or short passages it needs. Use simple wording for the year level, Australian spelling and metric units.",
  "Give 3 or 4 options with exactly one correct answer. Wrong options should be common mistakes, not silly ones. No trick questions and no 'all of the above'.",
  "If an outcome is mostly about performing, making or writing at length, check a knowable part of it instead (for example choosing the best edit of a sentence, spotting a language technique, or picking the clearest topic sentence). Leave it out only if nothing about it can be checked fairly.",
  "Inside JSON strings, quote words or passages with single quotes ('like this'), never with double quotes.",
  "Check every answer is right before you reply. Do NOT write curriculum codes.",
  'Reply with ONE JSON object only: {"questions":[{"n":number (the outcome number),"question":string,"options":[string],"correct_index":number (zero-based),"explanation":string (one sentence, shown after answering)}]}',
].join("\n");

const LETTERS = "ABCDEF";
const optionText = (v: unknown) => {
  const raw = typeof v === "string" || typeof v === "number" ? String(v) : v && typeof v === "object" ? String((v as any).text ?? (v as any).option ?? (v as any).label ?? (v as any).value ?? "") : "";
  // "A) 12", "b. 12", "(C) 12" → "12"
  return stripCodes(clip(raw.replace(/^\s*\(?[A-Fa-f][).:]\s+/, ""), 200));
};
/** The zero-based correct option, from correct_index or the other ways the model sometimes says it ("B", "12", 1-based). */
function correctIndex(q: any, rawOptions: unknown[], options: string[]): number {
  const n = Number(q?.correct_index ?? q?.correctIndex ?? q?.answer_index);
  if (Number.isInteger(n) && n >= 0 && n < options.length) return n;
  if (Number.isInteger(n) && n === options.length) return n - 1; // 1-based
  for (const key of ["correct_index", "correct", "correct_answer", "answer"]) {
    const v = q?.[key];
    if (typeof v !== "string" && typeof v !== "number") continue;
    const t = String(v).trim();
    if (/^[A-Fa-f]$/.test(t) && LETTERS.indexOf(t.toUpperCase()) < options.length) return LETTERS.indexOf(t.toUpperCase());
    const m = t.match(/^\(?([A-Fa-f])[).:]\s/);
    if (m && LETTERS.indexOf(m[1].toUpperCase()) < options.length) return LETTERS.indexOf(m[1].toUpperCase());
    const want = optionText(t).toLowerCase();
    const i = options.findIndex((x) => x.toLowerCase() === want);
    if (i >= 0) return i;
  }
  const flagged = rawOptions.findIndex((x: any) => x && typeof x === "object" && (x.correct === true || x.is_correct === true));
  return flagged;
}

/** Well-formed questions for outcomes in the pool, one per outcome. Unnumbered questions are taken in list order. */
export function readQuestions(reply: any, pool: { code: string; summary: string }[], per = 1) {
  const list = Array.isArray(reply) ? reply : Array.isArray(reply?.questions) ? reply.questions : Array.isArray(reply?.quiz) ? reply.quiz : [];
  const used = new Map<string, number>(), asked = new Set<string>();
  const quiz: any[] = [], items: { index: number; code: string; summary: string }[] = [];
  list.forEach((q: any, i: number) => {
    if (quiz.length >= QUESTIONS_PER_SUBJECT) return;
    const num = Number(q?.n ?? q?.number ?? q?.outcome);
    const x = pool[(Number.isInteger(num) && num >= 1 ? num : Math.floor(i / per) + 1) - 1];
    const rawOptions: unknown[] = Array.isArray(q?.options) ? q.options : Array.isArray(q?.choices) ? q.choices : [];
    const options = rawOptions.map(optionText).filter(Boolean);
    const ci = correctIndex(q, rawOptions, options);
    if (!x || (used.get(x.code) || 0) >= per || options.length < 3 || options.length > 5 || new Set(options.map((v) => v.toLowerCase())).size !== options.length || ci < 0) return;
    const question = stripCodes(clip(q?.question ?? q?.prompt ?? q?.text, 600));
    if (question.length < 8 || asked.has(question.toLowerCase())) return;
    asked.add(question.toLowerCase());
    used.set(x.code, (used.get(x.code) || 0) + 1);
    items.push({ index: quiz.length, code: x.code, summary: x.summary });
    quiz.push({ question, options, correct_index: ci, explanation: stripCodes(clip(q?.explanation, 300)) });
  });
  return { quiz, items };
}

export async function createStartingCheck(
  env: Env, ai: AiBinding | undefined,
  o: { familyId: string; userId: string; studentId: string; subject: unknown; model?: string; gatewayId?: string },
  now: Date = new Date(),
): Promise<{ ok: true; check: any } | Fail> {
  const db: DB = env.DB;
  if (!ai) return fail(503, "Starting checks need the AI service, which isn't switched on.", "AI_UNAVAILABLE");
  await ensureStartingChecks(db);
  const { plan } = await lb.getEntitlement(db, o.familyId, now);
  if (plan !== "INTERNAL") {
    const since = new Date(now.getTime() - 86400000).toISOString();
    const used = await db.prepare("SELECT COUNT(*) n FROM ai_usage WHERE family_id = ? AND kind = 'starting_check' AND created_at >= ? AND status != 'failed'").bind(o.familyId, since).first<{ n: number }>();
    if (Number(used?.n || 0) >= STARTING_CHECK_LIMITS.perFamilyDay)
      return fail(429, `You've made ${STARTING_CHECK_LIMITS.perFamilyDay} starting checks today. Try again tomorrow.`, "AI_QUOTA");
  }
  const tracker: any = await trackerFor(db, o.familyId, o.studentId, { now });
  if (!tracker) return fail(404, "Child not found");
  if (!tracker.available) return fail(409, "The outcome tracker isn't available for your curriculum yet.", "NO_CATALOGUE");
  const subject = clip(o.subject, 120);
  const open = (tracker.outcomes as any[]).filter((x) => x.in_stage && (x.subject || x.learning_area) === subject && !MET_STATUSES.includes(x.status) && x.summary);
  if (!open.length) return fail(400, `There's nothing left to check in ${subject || "that subject"}: every outcome is already met or has no description yet.`, "NOTHING_TO_CHECK");
  const pool = pickAcrossStrands(open, QUESTIONS_PER_SUBJECT);
  const year = tracker.student.year_level || tracker.student.stage || "";
  const per = perOutcome(pool.length);
  const user = `CHILD: ${year}\nSUBJECT: ${subject}\nQUESTIONS PER OUTCOME: ${per}\n\nOUTCOMES:\n${pool.map((x, i) => `${i + 1}. ${x.summary}`).join("\n")}`;

  const usageId = crypto.randomUUID();
  await db.prepare("INSERT INTO ai_usage (id, family_id, user_id, kind, status, created_at) VALUES (?, ?, ?, 'starting_check', 'pending', ?)").bind(usageId, o.familyId, o.userId, now.toISOString()).run();
  const mark = (s: string) => db.prepare("UPDATE ai_usage SET status = ? WHERE id = ?").bind(s, usageId).run();
  // One retry when the reply can't be used: Llama occasionally returns truncated or oddly shaped JSON.
  let quiz: any[] = [], items: { index: number; code: string; summary: string }[] = [];
  let reached = false, why = "";
  for (let attempt = 0; attempt < 2 && quiz.length < 3; attempt++) {
    let reply: any;
    try {
      const out = await ai.run(o.model || DEFAULT_MODEL, { messages: [{ role: "system", content: SYSTEM }, { role: "user", content: user }], max_tokens: 3500, temperature: attempt ? 0.2 : 0.3 },
        o.gatewayId ? { gateway: { id: o.gatewayId } } : undefined);
      reached = true;
      reply = extractJson(out);
    } catch { continue; }
    ({ quiz, items } = readQuestions(reply, pool, per));
    const got = Array.isArray(reply) ? reply : reply?.questions ?? reply?.quiz;
    why = !reply ? "its reply couldn't be read" : Array.isArray(got) ? `it wrote ${got.length} question${got.length === 1 ? "" : "s"}, ${quiz.length} usable` : "its reply had no questions";
  }
  if (!reached) {
    await mark("failed");
    return fail(502, "The AI service didn't respond. Nothing was used from your allowance; please try again.", "AI_FAILED");
  }
  if (quiz.length < 3) { await mark("failed"); return fail(502, `The AI couldn't write a usable check for that subject (${why}). Nothing was used from your allowance; please try again.`, "AI_FAILED"); }

  const first = String(tracker.student.name || "").split(" ")[0] || "you";
  const made = await lb.createLesson(db, o.familyId, {
    title: `Starting check: ${subject}`, learning_area: subject, stage: tracker.student.stage || null, status: "ready", outcome_codes: [],
    objectives: [`Show what I already know in ${subject}`],
    sections: [{ heading: "About this quest", body: `This quest helps your grown-up see what you already know in ${subject}, so your lessons start in the right place. It isn't a test. Answer each question as well as you can, and it's fine if some are new to you. Your first go is the one that counts.` }],
    quiz, parent_notes: `Starting check written by AI on ${now.toISOString().slice(0, 10)} for ${first}. Each question checks one outcome; results appear in the Outcome tracker under Starting check.`,
  }, now, { ai: true });
  if (!made.ok) { await mark("failed"); return made; }
  const assigned = await lb.assignLesson(db, o.familyId, { student_id: o.studentId, lesson_id: made.lesson.id, scheduled_date: now.toISOString().slice(0, 10), support_level: "green" }, now);
  if (!assigned.ok) { await mark("failed"); return assigned; }
  const id = crypto.randomUUID();
  await db.prepare("INSERT INTO starting_checks (id, family_id, student_id, subject, lesson_id, assignment_id, items, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(id, o.familyId, o.studentId, subject, made.lesson.id, assigned.assignment.id, JSON.stringify(items), o.userId, now.toISOString()).run();
  await mark("ok");
  return { ok: true, check: { id, subject, lesson_id: made.lesson.id, assignment_id: assigned.assignment.id, questions: quiz.length } };
}

/** Every check for a child, with first-attempt results per outcome once the child has answered. */
export async function listStartingChecks(db: DB, familyId: string, studentId: string) {
  await ensureStartingChecks(db);
  const { results } = await db.prepare(`SELECT c.*, a.status AS assignment_status FROM starting_checks c LEFT JOIN assignments a ON a.id = c.assignment_id AND a.family_id = c.family_id
    WHERE c.family_id = ? AND c.student_id = ? ORDER BY c.created_at DESC LIMIT 50`).bind(familyId, studentId).all<any>();
  const out = [];
  for (const c of results || []) {
    const items: { index: number; code: string; summary: string }[] = (() => { try { return JSON.parse(c.items); } catch { return []; } })();
    const firstTry = await db.prepare("SELECT results, completed_at FROM quiz_results WHERE assignment_id = ? AND family_id = ? ORDER BY completed_at ASC LIMIT 1").bind(c.assignment_id, familyId).first<any>();
    const marks: { question_index: number; is_correct: boolean }[] = firstTry ? (() => { try { return JSON.parse(firstTry.results); } catch { return []; } })() : [];
    out.push({
      id: c.id, subject: c.subject, created_at: c.created_at, lesson_id: c.lesson_id, assignment_id: c.assignment_id,
      assignment_status: c.assignment_status || "revoked", answered_at: firstTry?.completed_at || null,
      items: items.map((it) => ({ code: it.code, summary: it.summary, correct: firstTry ? marks.find((m) => m.question_index === it.index)?.is_correct === true : null })),
    });
    // One row per outcome: met only when every question on it was right first time.
    const row = out[out.length - 1];
    const byCode = new Map<string, { code: string; summary: string; correct: boolean | null }>();
    for (const it of row.items) {
      const prev = byCode.get(it.code);
      byCode.set(it.code, prev ? { ...prev, correct: prev.correct === null ? null : prev.correct && it.correct === true } : { ...it });
    }
    (row as any).outcomes = [...byCode.values()];
  }
  return out;
}

export function registerStartingChecks(app: import("./types").App, g: import("./types").Guards) {
  app.post("/api/outcomes/students/:sid/starting-checks", g.auth, g.parent, async (c) => {
    const u = c.get("user");
    const b: any = await c.req.json().catch(() => ({}));
    const r = await createStartingCheck(c.env, c.env.AI as AiBinding | undefined, { familyId: u.family_id, userId: u.id, studentId: c.req.param("sid"), subject: b.subject, model: c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID });
    return r.ok ? c.json(r.check) : c.json({ detail: r.detail, code: r.code }, r.status as any);
  });
  app.get("/api/outcomes/students/:sid/starting-checks", g.auth, g.parent, async (c) => {
    const u = c.get("user");
    const kid = await c.env.DB.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?").bind(c.req.param("sid"), u.family_id).first();
    if (!kid) return c.json({ detail: "Child not found" }, 404);
    return c.json({ checks: await listStartingChecks(c.env.DB, u.family_id, c.req.param("sid")) });
  });
}
