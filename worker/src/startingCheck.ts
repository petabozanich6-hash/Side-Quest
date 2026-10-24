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
  "You are given the child's year level and a numbered list of curriculum outcomes in plain English. For each one, write ONE multiple-choice question that a child who has met that outcome would answer correctly, and a child who hasn't usually would not.",
  "Each question must be complete and answerable on screen with no pictures, audio, props or outside text: include any numbers, words, sentences or short passages it needs. Use simple wording for the year level, Australian spelling and metric units.",
  "Give 3 or 4 options with exactly one correct answer. Wrong options should be common mistakes, not silly ones. No trick questions and no 'all of the above'.",
  "If an outcome can't be fairly checked with one multiple-choice question (for example performing, making, or a long piece of writing), leave it out.",
  "Check every answer is right before you reply. Do NOT write curriculum codes.",
  'Reply with ONE JSON object only: {"questions":[{"n":number,"question":string,"options":[string],"correct_index":number (zero-based),"explanation":string (one sentence, shown after answering)}]}',
].join("\n");

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
  const user = `CHILD: ${year}\nSUBJECT: ${subject}\n\nOUTCOMES:\n${pool.map((x, i) => `${i + 1}. ${x.summary}`).join("\n")}`;

  const usageId = crypto.randomUUID();
  await db.prepare("INSERT INTO ai_usage (id, family_id, user_id, kind, status, created_at) VALUES (?, ?, ?, 'starting_check', 'pending', ?)").bind(usageId, o.familyId, o.userId, now.toISOString()).run();
  const mark = (s: string) => db.prepare("UPDATE ai_usage SET status = ? WHERE id = ?").bind(s, usageId).run();
  let reply: any;
  try {
    const out = await ai.run(o.model || DEFAULT_MODEL, { messages: [{ role: "system", content: SYSTEM }, { role: "user", content: user }], max_tokens: 3500, temperature: 0.3 },
      o.gatewayId ? { gateway: { id: o.gatewayId } } : undefined);
    reply = extractJson(out);
  } catch {
    await mark("failed");
    return fail(502, "The AI service didn't respond. Nothing was used from your allowance; please try again.", "AI_FAILED");
  }

  // Keep only well-formed questions for outcomes in the list, one per outcome.
  const seen = new Set<string>();
  const quiz: any[] = [], items: { index: number; code: string; summary: string }[] = [];
  for (const q of Array.isArray(reply?.questions) ? reply.questions : []) {
    const x = pool[Number(q?.n) - 1];
    const options = (Array.isArray(q?.options) ? q.options : []).map((v: unknown) => stripCodes(clip(v, 200))).filter(Boolean);
    const ci = Number(q?.correct_index);
    if (!x || seen.has(x.code) || options.length < 3 || options.length > 4 || new Set(options).size !== options.length || !Number.isInteger(ci) || ci < 0 || ci >= options.length) continue;
    const question = stripCodes(clip(q.question, 600));
    if (question.length < 8) continue;
    seen.add(x.code);
    items.push({ index: quiz.length, code: x.code, summary: x.summary });
    quiz.push({ question, options, correct_index: ci, explanation: stripCodes(clip(q.explanation, 300)) });
  }
  if (quiz.length < 3) { await mark("failed"); return fail(502, "The AI couldn't write a usable check for that subject. Nothing was used from your allowance; please try again.", "AI_FAILED"); }

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
