// Parent lesson builder, assignment snapshots, submissions, review and entitlement checks.
// Plain functions over a D1-shaped database so they can be tested without the Worker runtime.
// Every function that touches family data takes the family id from the authenticated user, never from the request body.
import { cleanItemKind, cleanVisual, cleanKeyWords, childItem, markItem, modelAnswer, estimateMinutes } from "./items";
import { effectivePlan, limitsFor, trialEndFrom, UPGRADE_MESSAGE } from "./entitlements";
import type { Plan, Limits } from "./entitlements";

type DB = D1Database;

export type Fail = { ok: false; status: number; detail: string; code?: string };
export type Ok<T> = { ok: true } & T;
export type Result<T> = Ok<T> | Fail;

export const fail = (status: number, detail: string, code?: string): Fail => ({ ok: false, status, detail, code });
export const paywall = (detail?: string): Fail => fail(402, detail || UPGRADE_MESSAGE, "UPGRADE_REQUIRED");

const nowIso = (d: Date = new Date()) => d.toISOString();
const newId = () => crypto.randomUUID();
function parseJson<T>(s: unknown, fallback: T): T {
  if (typeof s !== "string" || !s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export const DONE_STATUSES = ["accepted", "demonstrated", "completed"];
export const REVIEW_STATUSES = ["accepted", "needs_revision", "demonstrated", "needs_more_practice"];
export const XP_FOR_REVIEW: Record<string, number> = { accepted: 20, demonstrated: 45 };
const STAGES = ["ES1", "S1", "S2", "S3", "S4", "S5", "S6"];
const MAX_LESSON_BYTES = 100000;

// ---------------------------------------------------------------- entitlements

export async function getEntitlement(db: DB, familyId: string, now: Date = new Date()) {
  const row = await db
    .prepare("SELECT plan, created_at, trial_started_at, trial_ends_at, plan_period_end FROM families WHERE id = ?")
    .bind(familyId)
    .first<any>();
  const plan: Plan = effectivePlan(row, now);
  const limits: Limits = limitsFor(plan);
  return { plan, limits, row };
}

async function count(db: DB, sql: string, ...binds: unknown[]): Promise<number> {
  const r = await db.prepare(sql).bind(...binds).first<{ n: number }>();
  return Number(r?.n ?? 0);
}

export const countLessons = (db: DB, familyId: string) =>
  count(db, "SELECT COUNT(*) n FROM lessons WHERE family_id = ? AND archived_at IS NULL", familyId);
export const countChildren = (db: DB, familyId: string) =>
  count(db, "SELECT COUNT(*) n FROM students WHERE family_id = ?", familyId);
export const countActiveAssignments = (db: DB, familyId: string) =>
  count(
    db,
    "SELECT COUNT(*) n FROM assignments WHERE family_id = ? AND status NOT IN ('accepted','demonstrated','completed')",
    familyId
  );

export async function planSummary(db: DB, familyId: string, now: Date = new Date()) {
  const { plan, limits, row } = await getEntitlement(db, familyId, now);
  return {
    plan: row?.plan ?? "FREE_PREVIEW",
    effective_plan: plan,
    trial_ends_at: row?.trial_ends_at ?? (row?.created_at ? trialEndFrom(row.created_at) : null),
    limits,
    usage: {
      children: await countChildren(db, familyId),
      lessons: await countLessons(db, familyId),
      active_assignments: await countActiveAssignments(db, familyId),
    },
    billing: "NOT_LIVE",
  };
}

export async function checkCanAddChild(db: DB, familyId: string, now: Date = new Date()): Promise<Result<{}>> {
  const { plan, limits } = await getEntitlement(db, familyId, now);
  const n = await countChildren(db, familyId);
  if (n >= limits.maxChildren) {
    const why = plan === "FREE_PREVIEW" ? "The free preview includes one child profile." : "Adding children needs an active Family Membership.";
    return paywall(`${why} ${UPGRADE_MESSAGE}`);
  }
  return { ok: true };
}

// ---------------------------------------------------------------- input validation

class ValidationError extends Error {}

function text(v: unknown, max: number, label: string, required = false): string {
  if (v === undefined || v === null || v === "") {
    if (required) throw new ValidationError(`${label} is required`);
    return "";
  }
  if (typeof v !== "string") throw new ValidationError(`${label} must be text`);
  const s = v.trim();
  if (required && !s) throw new ValidationError(`${label} is required`);
  if (s.length > max) throw new ValidationError(`${label} is too long (maximum ${max} characters)`);
  return s;
}

function list(v: unknown, max: number, label: string): unknown[] {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) throw new ValidationError(`${label} must be a list`);
  if (v.length > max) throw new ValidationError(`${label} has too many items (maximum ${max})`);
  return v;
}

const obj = (v: unknown, label: string): Record<string, unknown> => {
  if (!v || typeof v !== "object" || Array.isArray(v)) throw new ValidationError(`${label} is not valid`);
  return v as Record<string, unknown>;
};

/** Only http(s) links are allowed; javascript:, data: and everything else is rejected. */
export function safeUrl(v: unknown, label: string): string {
  const s = text(v, 2000, label, true);
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    throw new ValidationError(`${label} must be a full web address starting with https://`);
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new ValidationError(`${label} must start with http:// or https://`);
  return u.toString();
}

/** Embed URLs are computed here from an allow-list. A client-supplied embed_url is never trusted. */
export function embedUrlFor(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, "").toLowerCase();
  const idOk = (s: string | null | undefined) => (s && /^[A-Za-z0-9_-]{6,20}$/.test(s) ? s : null);
  if (host === "youtu.be") {
    const id = idOk(u.pathname.slice(1));
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const id = u.pathname.startsWith("/embed/") ? idOk(u.pathname.slice(7)) : idOk(u.searchParams.get("v"));
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "vimeo.com") {
    const id = /^\/(\d{5,12})$/.exec(u.pathname)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}

export type CleanLesson = {
  title: string;
  learning_area: string | null;
  stage: string | null;
  status: "draft" | "ready";
  builder: Record<string, unknown>;
  file_ids: string[];
};

export function sanitizeLessonInput(raw: unknown): Result<{ value: CleanLesson }> {
  try {
    const b = obj(raw ?? {}, "Lesson");
    const title = text(b.title, 200, "Title", true);
    const learning_area = text(b.learning_area, 80, "Subject") || null;
    const year_level = text(b.year_level, 40, "Year level") || null;
    const stageRaw = text(b.stage, 10, "Stage");
    const stage = STAGES.includes(stageRaw) ? stageRaw : null;
    const status = b.status === "ready" ? "ready" : "draft";

    const objectives = list(b.objectives, 10, "Learning objectives").map((o, i) => text(o, 300, `Objective ${i + 1}`, true));
    const sections = list(b.sections, 20, "Teaching sections").map((s, i) => {
      const o = obj(s, `Teaching section ${i + 1}`);
      const visual = cleanVisual(o.visual);
      return { heading: text(o.heading, 200, `Section ${i + 1} heading`), body: text(o.body, 20000, `Section ${i + 1} text`, true), ...(visual ? { visual } : {}) };
    });
    const activities = list(b.activities, 30, "Activities").map((a, i) => {
      const o = obj(a, `Activity ${i + 1}`);
      return {
        title: text(o.title, 200, `Activity ${i + 1} title`, true),
        instructions: text(o.instructions, 4000, `Activity ${i + 1} instructions`),
        offline: o.offline === true,
        ...(cleanVisual(o.visual) ? { visual: cleanVisual(o.visual) } : {}),
        // The actual questions of a worksheet-style task, so nothing refers to material that doesn't exist.
        tasks: list(o.tasks, 30, `Activity ${i + 1} tasks`).map((t, j) => {
          const to = obj(t, `Activity ${i + 1} task ${j + 1}`);
          const prompt = text(to.prompt, 1500, `Activity ${i + 1} task ${j + 1}`, true);
          const answer = text(to.answer, 1500, `Activity ${i + 1} task ${j + 1} answer`);
          return { prompt, hint: text(to.hint, 800, `Activity ${i + 1} task ${j + 1} hint`), answer, ...cleanItemKind(to, prompt, answer) };
        }),
      };
    });
    const questions = list(b.questions, 50, "Questions").map((q, i) => {
      const o = obj(q, `Question ${i + 1}`);
      return {
        prompt: text(o.prompt, 1000, `Question ${i + 1}`, true),
        type: o.type === "long" ? "long" : "short",
        answer_key: text(o.answer_key, 2000, `Question ${i + 1} answer`),
      };
    });
    const quiz = list(b.quiz, 50, "Quiz").map((q, i) => {
      const o = obj(q, `Quiz question ${i + 1}`);
      const options = list(o.options, 6, `Quiz question ${i + 1} options`).map((x, j) => text(x, 300, `Quiz question ${i + 1} option ${j + 1}`, true));
      if (options.length < 2) throw new ValidationError(`Quiz question ${i + 1} needs at least 2 options`);
      const ci = Number(o.correct_index);
      if (!Number.isInteger(ci) || ci < 0 || ci >= options.length) throw new ValidationError(`Quiz question ${i + 1} needs a correct answer`);
      return {
        question: text(o.question, 1000, `Quiz question ${i + 1}`, true),
        type: "multiple_choice",
        options,
        correct_index: ci,
        explanation: text(o.explanation, 1000, `Quiz question ${i + 1} explanation`),
      };
    });

    // Richer teaching content (all optional, so older lessons and simple hand-made lessons still validate).
    const delivery = b.delivery === "parent_guided" ? "parent_guided" : "independent";
    const strList = (v: unknown, max: number, len: number, label: string) => list(v, max, label).map((x, i) => text(x, len, `${label} ${i + 1}`, true));
    const worked_examples = list(b.worked_examples, 10, "Worked examples").map((w, i) => {
      const o = obj(w, `Worked example ${i + 1}`);
      return {
        title: text(o.title, 200, `Worked example ${i + 1} title`),
        problem: text(o.problem, 1500, `Worked example ${i + 1} problem`, true),
        steps: strList(o.steps, 15, 800, `Worked example ${i + 1} step`),
        answer: text(o.answer, 800, `Worked example ${i + 1} answer`),
        ...(cleanVisual(o.visual) ? { visual: cleanVisual(o.visual) } : {}),
      };
    });
    const guided_practice = list(b.guided_practice, 20, "Guided practice").map((g, i) => {
      const o = obj(g, `Guided practice ${i + 1}`);
      const prompt = text(o.prompt, 1500, `Guided practice ${i + 1}`, true);
      const answer = text(o.answer, 1500, `Guided practice ${i + 1} answer`);
      return { prompt, hint: text(o.hint, 800, `Guided practice ${i + 1} hint`), answer, ...cleanItemKind(o, prompt, answer) };
    });

    const misconceptions = list(b.misconceptions, 10, "Common mistakes").map((m, i) => {
      const o = obj(m, `Common mistake ${i + 1}`);
      return { mistake: text(o.mistake, 600, `Common mistake ${i + 1}`, true), fix: text(o.fix, 1200, `Common mistake ${i + 1} correction`) };
    });
    const teaching_questions = list(b.teaching_questions, 20, "Questions to ask").map((m, i) => {
      const o = obj(m, `Question to ask ${i + 1}`);
      return { ask: text(o.ask, 600, `Question to ask ${i + 1}`, true), expected: text(o.expected, 1200, `Expected response ${i + 1}`) };
    });
    const texts = list(b.texts, 6, "Texts and sources").map((m, i) => {
      const o = obj(m, `Text ${i + 1}`);
      return { title: text(o.title, 200, `Text ${i + 1} title`), kind: ["text", "source", "data"].includes(String(o.kind)) ? String(o.kind) : "text", content: text(o.content, 8000, `Text ${i + 1}`, true) };
    });

    const fileIds: string[] = [];
    const resources = list(b.resources, 20, "Resources").map((r, i) => {
      const o = obj(r, `Resource ${i + 1}`);
      const title = text(o.title, 200, `Resource ${i + 1} title`, true);
      if (o.type === "file") {
        const fid = text(o.file_id, 64, `Resource ${i + 1} file`, true);
        fileIds.push(fid);
        return { type: "file", title, file_id: fid };
      }
      const url = safeUrl(o.url, `Resource ${i + 1} link`);
      if (o.type === "video") {
        const embed = embedUrlFor(url);
        if (embed) {
          const purpose = ["intro", "explain", "demo", "extension"].includes(String(o.purpose)) ? String(o.purpose) : "explain";
          const dur = Number(o.duration_seconds);
          return {
            type: "video", title, url, embed_url: embed,
            video_id: /embed\/([A-Za-z0-9_-]+)/.exec(embed)?.[1] ?? "",
            channel: text(o.channel, 120, `Resource ${i + 1} channel`), description: text(o.description, 300, `Resource ${i + 1} description`),
            duration_seconds: Number.isFinite(dur) && dur > 0 && dur < 14400 ? Math.round(dur) : null,
            thumbnail: /^https:\/\/i\.ytimg\.com\/vi\/[A-Za-z0-9_-]+\/[a-z0-9]+\.jpg$/.test(String(o.thumbnail ?? "")) ? String(o.thumbnail) : "",
            purpose, concept: text(o.concept, 300, `Resource ${i + 1} concept`), after: ["intro", "teaching", "examples", "practice", "extension"].includes(String(o.after)) ? String(o.after) : purpose === "intro" ? "intro" : purpose === "extension" ? "extension" : "teaching",
            prompt: text(o.prompt, 400, `Resource ${i + 1} question`), source: o.source === "parent" ? "parent" : "youtube", verified: o.verified === true,
          };
        }
      }
      return { type: "link", title, url };
    });

    const duration = b.duration_minutes === undefined || b.duration_minutes === null || b.duration_minutes === "" ? null : Number(b.duration_minutes);
    if (duration !== null && (!Number.isInteger(duration) || duration < 1 || duration > 600)) {
      throw new ValidationError("Estimated duration must be a whole number of minutes between 1 and 600");
    }
    const curriculum_refs = list(b.curriculum_refs, 10, "Curriculum references").map((x, i) => text(x, 200, `Curriculum reference ${i + 1}`, true));

    const builder = {
      year_level,
      objectives,
      sections,
      activities,
      questions,
      quiz,
      resources,
      duration_minutes: duration,
      curriculum_refs,
      delivery,
      teaching_plan: text(b.teaching_plan, 3000, "Teaching plan"),
      why_it_matters: text(b.why_it_matters, 2000, "Why it matters"),
      prior_knowledge: strList(b.prior_knowledge, 10, 300, "Prior knowledge"),
      misconceptions,
      key_words: cleanKeyWords(b.key_words),
      estimated_minutes: estimateMinutes({ sections, texts, worked_examples, guided_practice, activities, questions, quiz }),
      teaching_questions,
      texts,
      consolidation: text(b.consolidation, 4000, "Wrap-up"),
      introduction: text(b.introduction, 4000, "Introduction"),
      worked_examples,
      guided_practice,
      support: text(b.support, 4000, "Support ideas"),
      extension: text(b.extension, 4000, "Extension"),
      materials: strList(b.materials, 20, 200, "Materials"),
      parent_script: text(b.parent_script, 12000, "Parent teaching guide"),
      evidence_suggestions: strList(b.evidence_suggestions, 10, 400, "Evidence suggestion"),
      offline_alternative: text(b.offline_alternative, 4000, "Offline alternative"),
      answer_key: text(b.answer_key, 8000, "Answer key"),
      parent_notes: text(b.parent_notes, 4000, "Parent notes"),
    };
    const size = new TextEncoder().encode(JSON.stringify(builder)).length;
    if (size > MAX_LESSON_BYTES) throw new ValidationError("This lesson is too large. Please shorten it or split it into two lessons.");
    return { ok: true, value: { title, learning_area, stage, status, builder, file_ids: fileIds } };
  } catch (e) {
    if (e instanceof ValidationError) return fail(400, e.message, "INVALID_LESSON");
    throw e;
  }
}

/** Builder fields plus the fields the existing child lesson page already knows how to show. */
export function toLessonData(c: CleanLesson): Record<string, unknown> {
  const b: any = c.builder;
  const taskLines: string[] = [];
  b.activities.filter((a: any) => !a.offline).forEach((a: any, i: number) => taskLines.push(`${i + 1}. ${a.title}${a.instructions ? `: ${a.instructions}` : ""}`));
  if (b.questions.length) {
    taskLines.push("", "Answer these questions in the box below:");
    b.questions.forEach((q: any, i: number) => taskLines.push(`${i + 1}. ${q.prompt}`));
  }
  const offline = b.activities.filter((a: any) => a.offline).map((a: any) => `${a.title}${a.instructions ? `: ${a.instructions}` : ""}`);
  const offlineText = [b.offline_alternative, ...offline].filter(Boolean).join("\n");
  return {
    ...b,
    builder: true,
    source: "parent",
    coming_soon: false,
    review_status: "parent_created",
    pass_mark: 0.7,
    child_mission: b.objectives[0] ? `Your mission: ${b.objectives[0]}` : "",
    learning_intention: b.objectives.length ? `We are learning to: ${b.objectives.join("; ")}` : "",
    success_criteria: b.objectives,
    teach_steps: b.sections.map((s: any, i: number) => ({ icon: "📖", title: s.heading || `Part ${i + 1}`, explain: s.body })),
    steps: b.activities.map((a: any) => ({ title: a.title, detail: a.instructions })),
    independent_task: taskLines.join("\n"),
    offline_alternative: offlineText,
  };
}

// ---------------------------------------------------------------- output shaping

export function lessonOut(row: any) {
  if (!row) return null;
  const { data, ...cols } = row;
  return { ...parseJson<Record<string, unknown>>(data, {}), ...cols };
}

/** Remove everything a child must not see (answer keys, parent notes, curriculum notes). */
export function childSafeLesson(l: any) {
  if (!l) return l;
  const copy: any = { ...l };
  for (const k of ["answer_key", "parent_notes", "parent_check", "explicit_teaching", "curriculum_refs", "parent_script", "support", "evidence_suggestions", "teaching_plan"]) delete copy[k];
  delete copy.teaching_questions; // parent-only: what to ask and what to expect
  delete copy.ai_flags;
  if (Array.isArray(copy.activities)) copy.activities = copy.activities.map((a: any, i: number) => ({ ...a, tasks: Array.isArray(a?.tasks) ? a.tasks.map((t: any, j: number) => childItem(t, `t${i}-${j}`)) : a?.tasks }));
  if (Array.isArray(copy.guided_practice)) copy.guided_practice = copy.guided_practice.map((g: any, i: number) => childItem(g, `g${i}`));
  if (Array.isArray(copy.questions)) copy.questions = copy.questions.map((q: any) => ({ prompt: q.prompt, type: q.type }));
  // Quiz correct answers stay on the server. The child's browser sends answers to the quiz-check route to be marked.
  if (Array.isArray(copy.quiz)) {
    copy.quiz = copy.quiz.map((q: any) => {
      const { correct_index: _c, correct: _k, answer: _a, ...rest } = q || {};
      return rest;
    });
  }
  return copy;
}

/** The lesson as the assignment saw it. Older assignments without a snapshot fall back to the live lesson. */
export function assignmentLesson(a: any, liveRow: any) {
  const snap = parseJson<any>(a?.lesson_snapshot, null);
  return snap ?? lessonOut(liveRow);
}

// ---------------------------------------------------------------- lessons

async function ownLesson(db: DB, familyId: string, id: string) {
  return db.prepare("SELECT * FROM lessons WHERE id = ? AND family_id = ?").bind(id, familyId).first<any>();
}

export async function checkFiles(db: DB, familyId: string, ids: string[]): Promise<Fail | null> {
  for (const id of ids) {
    const f = await db.prepare("SELECT id FROM files WHERE id = ? AND family_id = ? AND is_deleted = 0").bind(id, familyId).first();
    if (!f) return fail(400, "One of the attached files could not be found. Please upload it again.", "FILE_NOT_FOUND");
  }
  return null;
}

export async function listLessons(db: DB, familyId: string, opts: { archived?: boolean; q?: string } = {}) {
  let sql = "SELECT * FROM lessons WHERE family_id = ?";
  const b: unknown[] = [familyId];
  sql += opts.archived ? " AND archived_at IS NOT NULL" : " AND archived_at IS NULL";
  if (opts.q) {
    sql += " AND (title LIKE ? OR learning_area LIKE ?)";
    const like = `%${opts.q.replace(/[%_]/g, "")}%`;
    b.push(like, like);
  }
  sql += " ORDER BY updated_at DESC, created_at DESC LIMIT 1000";
  const { results } = await db.prepare(sql).bind(...b).all<any>();
  return (results || []).map((r: any) => {
    const l: any = lessonOut(r);
    delete l.explicit_teaching;
    delete l.worked_example;
    return l;
  });
}

export const AI_FLAGS = { source: "ai", ai_generated: true, review_status: "ai_draft_needs_review" };

export async function createLesson(db: DB, familyId: string, input: unknown, now: Date = new Date(), opts: { ai?: boolean; flags?: string[] } = {}): Promise<Result<{ lesson: any }>> {
  const clean = sanitizeLessonInput(input);
  if (!clean.ok) return clean;
  const { limits } = await getEntitlement(db, familyId, now);
  if (!limits.canCreate) return paywall("Your free preview has ended. Your lessons and progress are kept; upgrade to keep creating lessons.");
  if ((await countLessons(db, familyId)) >= limits.maxLessons) {
    return paywall(`The free preview includes ${limits.maxLessons} lessons you create yourself. ${UPGRADE_MESSAGE}`);
  }
  const bad = await checkFiles(db, familyId, clean.value.file_ids);
  if (bad) return bad;
  const id = newId();
  const ts = nowIso(now);
  await db
    .prepare(
      "INSERT INTO lessons (id, family_id, title, stage, learning_area, unit_id, status, data, version, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, 1, ?, ?)"
    )
    .bind(id, familyId, clean.value.title, clean.value.stage, clean.value.learning_area, clean.value.status, JSON.stringify({ ...toLessonData(clean.value), ...(opts.ai ? { ...AI_FLAGS, ai_flags: opts.flags || [] } : {}) }), ts, ts)
    .run();
  return { ok: true, lesson: lessonOut(await ownLesson(db, familyId, id)) };
}

export async function updateLesson(db: DB, familyId: string, id: string, input: unknown, now: Date = new Date()): Promise<Result<{ lesson: any; assigned_copies_unchanged: boolean }>> {
  const row = await ownLesson(db, familyId, id);
  if (!row) return fail(404, "Lesson not found");
  if (row.archived_at) return fail(409, "This lesson is archived. Restore it before editing.", "ARCHIVED");
  const clean = sanitizeLessonInput(input);
  if (!clean.ok) return clean;
  const { limits } = await getEntitlement(db, familyId, now);
  if (!limits.canCreate) return paywall("Your free preview has ended. Your lessons are kept; upgrade to keep editing.");
  const bad = await checkFiles(db, familyId, clean.value.file_ids);
  if (bad) return bad;
  await db
    .prepare("UPDATE lessons SET title = ?, stage = ?, learning_area = ?, status = ?, data = ?, version = version + 1, updated_at = ? WHERE id = ? AND family_id = ?")
    .bind(clean.value.title, clean.value.stage, clean.value.learning_area, clean.value.status, JSON.stringify({ ...toLessonData(clean.value), ...(parseJson<any>(row.data, {}).ai_generated ? { source: "ai", ai_generated: true, review_status: clean.value.status === "ready" ? "parent_reviewed" : "ai_draft_needs_review", ai_flags: clean.value.status === "ready" ? [] : parseJson<any>(row.data, {}).ai_flags || [] } : {}) }), nowIso(now), id, familyId)
    .run();
  return { ok: true, lesson: lessonOut(await ownLesson(db, familyId, id)), assigned_copies_unchanged: true };
}

export async function duplicateLesson(db: DB, familyId: string, id: string, now: Date = new Date()): Promise<Result<{ lesson: any }>> {
  const row = await ownLesson(db, familyId, id);
  if (!row) return fail(404, "Lesson not found");
  const { limits } = await getEntitlement(db, familyId, now);
  if (!limits.canCreate) return paywall("Your free preview has ended. Upgrade to keep creating lessons.");
  if ((await countLessons(db, familyId)) >= limits.maxLessons) {
    return paywall(`The free preview includes ${limits.maxLessons} lessons you create yourself. ${UPGRADE_MESSAGE}`);
  }
  const copyId = newId();
  const ts = nowIso(now);
  const title = `${String(row.title).slice(0, 190)} (copy)`;
  const data = parseJson<Record<string, unknown>>(row.data, {});
  await db
    .prepare(
      "INSERT INTO lessons (id, family_id, title, stage, learning_area, unit_id, status, data, version, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NULL, 'draft', ?, 1, ?, ?)"
    )
    .bind(copyId, familyId, title, row.stage, row.learning_area, JSON.stringify(data), ts, ts)
    .run();
  return { ok: true, lesson: lessonOut(await ownLesson(db, familyId, copyId)) };
}

export async function setArchived(db: DB, familyId: string, id: string, archived: boolean, now: Date = new Date()): Promise<Result<{ archived: boolean }>> {
  const row = await ownLesson(db, familyId, id);
  if (!row) return fail(404, "Lesson not found");
  if (!archived) {
    const { limits } = await getEntitlement(db, familyId, now);
    if (!limits.canCreate) return paywall("Your free preview has ended. Upgrade to restore lessons.");
    if ((await countLessons(db, familyId)) >= limits.maxLessons) return paywall(`The free preview includes ${limits.maxLessons} lessons you create yourself. ${UPGRADE_MESSAGE}`);
  }
  await db.prepare("UPDATE lessons SET archived_at = ?, updated_at = ? WHERE id = ? AND family_id = ?").bind(archived ? nowIso(now) : null, nowIso(now), id, familyId).run();
  return { ok: true, archived };
}

/** Deleting a lesson that has ever been assigned archives it instead, so history is never orphaned. */
export async function deleteLesson(db: DB, familyId: string, id: string, now: Date = new Date()): Promise<Result<{ deleted: boolean; archived: boolean }>> {
  const row = await ownLesson(db, familyId, id);
  if (!row) return fail(404, "Lesson not found or cannot be deleted");
  const used = await count(db, "SELECT COUNT(*) n FROM assignments WHERE lesson_id = ? AND family_id = ?", id, familyId);
  if (used > 0) {
    await db.prepare("UPDATE lessons SET archived_at = ?, updated_at = ? WHERE id = ? AND family_id = ?").bind(nowIso(now), nowIso(now), id, familyId).run();
    return { ok: true, deleted: false, archived: true };
  }
  await db.prepare("DELETE FROM lessons WHERE id = ? AND family_id = ?").bind(id, familyId).run();
  return { ok: true, deleted: true, archived: false };
}

// ---------------------------------------------------------------- assignments

export async function assignLesson(
  db: DB,
  familyId: string,
  input: { student_id?: string; lesson_id?: string; due_date?: string | null; scheduled_date?: string | null; support_level?: string; parent_notes?: string | null },
  now: Date = new Date()
): Promise<Result<{ assignment: any }>> {
  if (!input.student_id || !input.lesson_id) return fail(400, "student_id and lesson_id are required");
  const student = await db.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?").bind(input.student_id, familyId).first();
  if (!student) return fail(404, "Student not found");
  const lesson = await ownLesson(db, familyId, input.lesson_id);
  if (!lesson) return fail(404, "Lesson not found");
  if (lesson.archived_at) return fail(409, "This lesson is archived. Restore it before assigning.", "ARCHIVED");
  if (lesson.status !== "ready") return fail(409, "Save this lesson to your library (mark it ready) before assigning it.", "NOT_READY");
  const dup = await count(
    db,
    "SELECT COUNT(*) n FROM assignments WHERE family_id = ? AND student_id = ? AND lesson_id = ? AND status NOT IN ('accepted','demonstrated','completed')",
    familyId, input.student_id, input.lesson_id
  );
  if (dup > 0) return fail(409, "This lesson is already assigned to this child and not finished yet.", "ALREADY_ASSIGNED");
  const { limits } = await getEntitlement(db, familyId, now);
  if (!limits.canAssign) return paywall("Your free preview has ended. Your children's progress is kept; upgrade to assign more lessons.");
  if ((await countActiveAssignments(db, familyId)) >= limits.maxActiveAssignments) {
    return paywall(`The free preview includes ${limits.maxActiveAssignments} active assignments. ${UPGRADE_MESSAGE}`);
  }
  const id = newId();
  const snapshot = JSON.stringify(lessonOut(lesson));
  await db
    .prepare(
      "INSERT INTO assignments (id, family_id, student_id, lesson_id, due_date, scheduled_date, support_level, parent_notes, status, lesson_snapshot, lesson_version, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'not_started', ?, ?, ?)"
    )
    .bind(id, familyId, input.student_id, input.lesson_id, input.due_date ?? null, input.scheduled_date ?? null, input.support_level || "green", input.parent_notes ?? null, snapshot, lesson.version ?? 1, nowIso(now))
    .run();
  return { ok: true, assignment: await db.prepare("SELECT id, family_id, student_id, lesson_id, due_date, scheduled_date, support_level, parent_notes, status, lesson_version, created_at FROM assignments WHERE id = ?").bind(id).first() };
}

// ---------------------------------------------------------------- quiz marking (server side)

const mcQuestions = (lesson: any): any[] => (Array.isArray(lesson?.quiz) ? lesson.quiz : []).filter((q: any) => q && q.type !== "short_answer" && Array.isArray(q.options));
const neededFor = (total: number, passMark: number) => Math.ceil(total * passMark - 1e-9);

async function assignmentForChild(db: DB, user: { id: string; family_id: string }, assignmentId: unknown) {
  const a = await db.prepare("SELECT * FROM assignments WHERE id = ? AND student_id = ? AND family_id = ?").bind(String(assignmentId ?? ""), user.id, user.family_id).first<any>();
  if (!a) return { a: null, lesson: null };
  const live = a.lesson_snapshot ? null : await db.prepare("SELECT * FROM lessons WHERE id = ?").bind(a.lesson_id).first<any>();
  return { a, lesson: assignmentLesson(a, live) };
}

/** Marks multiple-choice answers on the server. The child sends the option text they chose for each question, in order. */
export async function checkQuiz(
  db: DB,
  user: { id: string; family_id: string },
  assignmentId: unknown,
  answers: unknown,
  now: Date = new Date()
): Promise<Result<{ score: number; total: number; needed: number; passed: boolean; attempt: number; results: { question_index: number; is_correct: boolean; explanation: string }[] }>> {
  const { a, lesson } = await assignmentForChild(db, user, assignmentId);
  if (!a) return fail(404, "Assignment not found");
  if (DONE_STATUSES.includes(a.status)) return fail(409, "This lesson has already been finished.", "ALREADY_DONE");
  const qs = mcQuestions(lesson);
  if (!qs.length) return fail(400, "This lesson has no multiple-choice quiz.");
  const given = Array.isArray(answers) ? answers : [];
  const results = qs.map((q, i) => {
    const picked = typeof given[i] === "string" ? given[i] : null;
    const ok = picked !== null && typeof q.correct_index === "number" && q.options[q.correct_index] === picked;
    return { question_index: i, is_correct: ok, explanation: String(q.explanation || "") };
  });
  const score = results.filter((r) => r.is_correct).length;
  const total = qs.length;
  const needed = neededFor(total, Number(lesson?.pass_mark) || 0.9);
  const attempt = (await count(db, "SELECT COUNT(*) n FROM quiz_results WHERE assignment_id = ? AND child_id = ?", a.id, user.id)) + 1;
  await db
    .prepare("INSERT INTO quiz_results (id, family_id, lesson_id, child_id, assignment_id, score, total, results, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(newId(), user.family_id, a.lesson_id, user.id, a.id, score, total, JSON.stringify(results.map((r) => ({ question_index: r.question_index, is_correct: r.is_correct }))), nowIso(now))
    .run();
  return { ok: true, score, total, needed, passed: score >= needed, attempt, results };
}

/**
 * Instant feedback on practice (guided practice and activity tasks). This is NOT graded: it never affects the quiz,
 * hand-in, XP or the parent's review. The browser never holds the answers; it asks here after the child has a go.
 */
export async function checkPractice(
  db: DB,
  user: { id: string; family_id: string },
  assignmentId: unknown,
  body: { part?: unknown; i?: unknown; j?: unknown; answer?: unknown; reveal?: unknown; attempt?: unknown }
): Promise<Result<{ result: "correct" | "incorrect" | "recorded"; feedback: string; partial?: string; reveal?: string }>> {
  const { a, lesson } = await assignmentForChild(db, user, assignmentId);
  if (!a) return fail(404, "Assignment not found");
  if (DONE_STATUSES.includes(a.status)) return fail(409, "This lesson has already been finished.", "ALREADY_DONE");
  const i = Number(body.i), j = Number(body.j) || 0;
  const item: any = body.part === "guided" ? lesson?.guided_practice?.[i] : body.part === "task" ? lesson?.activities?.[i]?.tasks?.[j] : null;
  if (!item) return fail(404, "That question wasn't found.");
  const given = Array.isArray(body.answer) ? body.answer.map((x) => String(x).slice(0, 300)).slice(0, 10) : String(body.answer ?? "").slice(0, 3000);
  const m = markItem(item, given);
  const attempt = Math.max(1, Math.min(9, Number(body.attempt) || 1));
  const wantReveal = body.reveal === true || (m.result === "incorrect" && attempt >= 3) || m.result === "recorded";
  let feedback = "";
  if (m.result === "correct") feedback = "Correct! Well done.";
  else if (m.result === "recorded") feedback = "Your answer is saved. Compare it with the model answer below and see what you could add or fix.";
  else {
    feedback = `Not quite yet.${m.partial ? ` ${m.partial.charAt(0).toUpperCase()}${m.partial.slice(1)}.` : ""}`;
    feedback += item.hint ? ` Hint: ${item.hint}` : " Look back at the worked examples and try again.";
  }
  return { ok: true, result: m.result, feedback, partial: m.partial, ...(wantReveal || m.result === "correct" ? { reveal: modelAnswer(item) } : {}) };
}

export async function quizPassed(db: DB, user: { id: string }, a: any, lesson: any): Promise<boolean | null> {
  const qs = mcQuestions(lesson);
  if (!qs.length) return null; // no scored quiz
  const needed = neededFor(qs.length, Number(lesson?.pass_mark) || 0.9);
  return (await count(db, "SELECT COUNT(*) n FROM quiz_results WHERE assignment_id = ? AND child_id = ? AND score >= ?", a.id, user.id, needed)) > 0;
}

/** Saves a child's work in progress. Small and bounded; never changes status to submitted. */
export async function saveDraft(db: DB, user: { id: string; family_id: string }, assignmentId: string, draft: unknown, now: Date = new Date()): Promise<Result<{ saved_at: string }>> {
  const a = await db.prepare("SELECT id, status FROM assignments WHERE id = ? AND student_id = ? AND family_id = ?").bind(assignmentId, user.id, user.family_id).first<any>();
  if (!a) return fail(404, "Assignment not found");
  if (DONE_STATUSES.includes(a.status) || a.status === "submitted") return fail(409, "This lesson has already been handed in.", "ALREADY_SUBMITTED");
  if (!draft || typeof draft !== "object" || Array.isArray(draft)) return fail(400, "Nothing to save");
  const json = JSON.stringify(draft);
  if (new TextEncoder().encode(json).length > 60000) return fail(400, "Your answers are too long to save. Please shorten them.");
  const ts = nowIso(now);
  await db.prepare("UPDATE assignments SET draft = ?, status = CASE WHEN status IN ('not_started','opened') THEN 'in_progress' ELSE status END, updated_at = ? WHERE id = ?").bind(json, ts, a.id).run();
  return { ok: true, saved_at: ts };
}

// ---------------------------------------------------------------- submissions and review

export async function submitWork(
  db: DB,
  user: { id: string; family_id: string },
  body: { assignment_id?: string; response_text?: string | null; reflection?: string | null; file_ids?: string[]; needs_help?: boolean },
  now: Date = new Date()
): Promise<Result<{ id: string; status: string; assignment_id: string; submitted_at: string; xp_gained: number }>> {
  const a = await db.prepare("SELECT * FROM assignments WHERE id = ? AND student_id = ? AND family_id = ?").bind(body.assignment_id ?? "", user.id, user.family_id).first<any>();
  if (!a) return fail(404, "Assignment not found");
  if (DONE_STATUSES.includes(a.status)) return fail(409, "This lesson has already been reviewed and finished.", "ALREADY_DONE");
  if (a.status === "submitted") return fail(409, "You have already handed this in. It is waiting for your grown-up to look at it.", "ALREADY_SUBMITTED");
  if (!body.needs_help) {
    const { lesson } = await assignmentForChild(db, user, a.id);
    const passed = await quizPassed(db, user, a, lesson);
    {
      if (passed === false) return fail(409, "Pass the quiz first, then hand in your work. You can ask for help instead.", "QUIZ_NOT_PASSED");
    }
  }
  const response = typeof body.response_text === "string" ? body.response_text.slice(0, 20000) : null;
  const reflection = typeof body.reflection === "string" ? body.reflection.slice(0, 4000) : null;
  const fileIds = Array.isArray(body.file_ids) ? body.file_ids.filter((x) => typeof x === "string").slice(0, 20) : [];
  for (const fid of fileIds) {
    const f = await db.prepare("SELECT id FROM files WHERE id = ? AND family_id = ? AND is_deleted = 0").bind(fid, user.family_id).first();
    if (!f) return fail(400, "One of your files could not be found.", "FILE_NOT_FOUND");
  }
  const needsHelp = !!body.needs_help;
  const status = needsHelp ? "awaiting_help" : "submitted";
  const id = newId();
  const ts = nowIso(now);
  await db.batch([
    db.prepare("UPDATE assignments SET draft = NULL WHERE id = ?").bind(a.id),
    db
      .prepare(
        "INSERT INTO submissions (id, family_id, assignment_id, student_id, lesson_id, response_text, reflection, file_ids, needs_help, status, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(id, user.family_id, a.id, user.id, a.lesson_id, response, reflection, JSON.stringify(fileIds), needsHelp ? 1 : 0, status, ts),
    db.prepare("UPDATE assignments SET status = ?, updated_at = ? WHERE id = ?").bind(status, ts, a.id),
  ]);
  return { ok: true, id, status, assignment_id: a.id, submitted_at: ts, xp_gained: 0 };
}

async function awardXp(db: DB, studentId: string, amount: number, reason: string, now: Date) {
  try {
    await db.prepare("UPDATE pets SET xp = xp + ?, happiness = MIN(100, COALESCE(happiness, 0) + 5) WHERE student_id = ?").bind(amount, studentId).run();
    const row = await db.prepare("SELECT activity FROM pets WHERE student_id = ?").bind(studentId).first<{ activity?: string | null }>();
    if (!row) return;
    const activity = parseJson<any[]>(row.activity, []);
    activity.push({ amount, reason, at: nowIso(now) });
    await db.prepare("UPDATE pets SET activity = ? WHERE student_id = ?").bind(JSON.stringify(activity.slice(-200)), studentId).run();
  } catch {
    // The pet tables may not exist on a very old database; XP is a bonus, never a reason to fail a review.
  }
}

export async function reviewSubmission(
  db: DB,
  familyId: string,
  parentId: string,
  submissionId: string,
  body: { status?: string; feedback_text?: string | null; next_step?: string | null; outcome_mappings?: unknown[] },
  now: Date = new Date()
): Promise<Result<{ xp_awarded: number }>> {
  if (!REVIEW_STATUSES.includes(String(body.status))) return fail(400, "Invalid status");
  const sub = await db.prepare("SELECT * FROM submissions WHERE id = ? AND family_id = ?").bind(submissionId, familyId).first<any>();
  if (!sub) return fail(404, "Not found");
  const status = String(body.status);
  const ts = nowIso(now);
  const mappings = Array.isArray(body.outcome_mappings) ? body.outcome_mappings.slice(0, 20) : [];
  await db.batch([
    db
      .prepare("UPDATE submissions SET parent_feedback = ?, status = ?, next_step = ?, outcome_mappings = ?, reviewed_at = ?, reviewed_by = ? WHERE id = ?")
      .bind(String(body.feedback_text ?? "").slice(0, 4000), status, body.next_step ?? null, JSON.stringify(mappings), ts, parentId, sub.id),
    db.prepare("UPDATE assignments SET status = ?, updated_at = ? WHERE id = ?").bind(status, ts, sub.assignment_id),
  ]);
  let xp = 0;
  const amount = XP_FOR_REVIEW[status] ?? 0;
  if (amount > 0) {
    // The conditional update succeeds for exactly one review per assignment, so XP is never awarded twice.
    const claimed = await db.prepare("UPDATE assignments SET xp_awarded = ? WHERE id = ? AND family_id = ? AND xp_awarded = 0").bind(amount, sub.assignment_id, familyId).run();
    if ((claimed.meta?.changes ?? 0) === 1) {
      await awardXp(db, sub.student_id, amount, "Lesson reviewed", now);
      xp = amount;
    }
    await db
      .prepare("INSERT INTO lesson_evidence (id, family_id, lesson_id, child_id, type, text, file_name, file_ids, submitted_at) VALUES (?, ?, ?, ?, 'parent_review', ?, '', ?, ?)")
      .bind(newId(), familyId, sub.lesson_id, sub.student_id, `${status}${body.feedback_text ? `: ${String(body.feedback_text).slice(0, 500)}` : ""}`, sub.file_ids || "[]", ts)
      .run();
  }
  return { ok: true, xp_awarded: xp };
}
