/** Durable, owner-only workbook production. It uses the existing minute cron, not a browser tab. */
import type { Hono } from "hono";
import type { Env } from "./types";
import { AC9_OUTCOMES } from "./data/ac9-outcomes";
import { activeRoles } from "./access";
import { hitRateLimit, writeAudit } from "./adminAudit";
import {
  FORGE_SCHEMA,
  renderBook,
  qaBook,
  type Book,
  type Page,
  type ForgePlan,
} from "./bookForge";
import {
  answersPrompt,
  checkSession,
  composeAnswerText,
  composeSessionText,
  pagePrompt,
  parseDraft,
  reconcileReview,
  reviewPrompt,
  revisePrompt,
  writePrompt,
  type DraftPage,
  type Feedback,
  type SessionContext,
  type SessionDraft,
} from "./bookForgeEditorial";
import {
  ANSWERS_SCHEMA,
  PAGE_SCHEMA,
  REVIEW_SCHEMA,
  SESSION_SCHEMA,
  callJson,
  ensureForgeEvents,
  eventSummary,
  logCall,
  planSchema,
  validateSchema,
  type CallResult,
} from "./bookForgeStructured";
const JOB_SCHEMA = `CREATE TABLE IF NOT EXISTS book_forge_jobs (
 project_id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, family_id TEXT NOT NULL,
 status TEXT NOT NULL, phase TEXT NOT NULL, cursor INTEGER NOT NULL DEFAULT 0,
 payload TEXT NOT NULL, error TEXT NOT NULL DEFAULT '', lease TEXT, lease_until TEXT,
 updated_at TEXT NOT NULL
)`;
export async function ensureForgeJobs(db: D1Database) {
  await db.prepare(FORGE_SCHEMA).run();
  await db.prepare(JOB_SCHEMA).run();
  await ensureForgeEvents(db);
  await db
    .prepare(
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_forge_one_active_owner ON book_forge_jobs(owner_id) WHERE status IN ('queued','running')",
    )
    .run();
}
const iso = () => new Date().toISOString();
const bounded = (v: unknown, n: number) =>
  typeof v === "string" && v.trim().length <= n ? v.trim() : "";
/** The three book pages of an approved session: two student pages and its answer page. */
export function sessionPages(draft: SessionDraft, plan: ForgePlan, index: number): Page[] {
  const snapshot = JSON.stringify(plan);
  const pages: Page[] = draft.pages.slice(0, 2).map((p, i) => ({
    id: `lesson-${index + 1}-page-${i + 1}`,
    title: p.title,
    text: composeSessionText(p),
    goal: plan.goal,
    lessonId: plan.lessonId,
    lessonSnapshot: snapshot,
    locked: true,
    ...(p.visual ? { visual: { ...p.visual } } : {}),
  }));
  pages.push({
    id: `lesson-${index + 1}-answers`,
    title: `Answers · ${plan.title}`.slice(0, 120),
    text: composeAnswerText(draft),
    goal: "Adult guide: answers, acceptable responses and support.",
    lessonId: plan.lessonId,
    lessonSnapshot: snapshot,
    locked: true,
    answerPage: true,
  });
  return pages;
}
/** Parses and checks a generated session; throws with every deterministic problem, or returns its pages. */
export function validateGeneratedSession(
  raw: any,
  plan: ForgePlan,
  index: number,
  ctx: SessionContext = { year: 0, subject: "Mathematics", title: plan.title, goal: plan.goal },
): Page[] {
  const draft = parseDraft(raw);
  if (!draft) throw new Error("A lesson needs two complete student pages.");
  const errors = checkSession(draft, { ...ctx, title: plan.title, goal: plan.goal });
  if (errors.length) throw new Error(errors.join(" "));
  return sessionPages(draft, plan, index);
}
/** Attempts for the non-text steps (illustrate, render) before the job pauses for the owner. */
const MAX_ATTEMPTS = 3;
/**
 * Retry policy. Each failure kind has its own budget and its own recovery, and every budget is finite, so no
 * session can make an endless run of paid calls. Budgets are per run: an owner's Retry starts a fresh run but keeps
 * every saved component and draft. Nothing here lowers the editorial standard: a session still has to pass
 * every deterministic check and the independent review before it reaches the book.
 */
export const POLICY = {
  /** Unusable replies (not JSON, wrong shape, empty) per session run. Each is repaired, never a full rewrite. */
  structural: 4,
  /** Smaller replies (a page, the answer key, a revision) cut off at the token limit per session run. A whole session
   * cut off is not counted: it is split into components instead. */
  truncated: 2,
  /** Drafts rejected by the checks or the reviewer per session run; each is revised, not restarted. */
  editorial: 4,
  /** Provider errors per step, retried after 1, 2 then 4 minutes. */
  provider: 3,
  /** Hard ceiling on paid calls for one session in one run, whatever the mix of failures. */
  callsPerSessionRun: 14,
  /** Unusable planning replies per batch before planning pauses. */
  planStructural: 3,
  /** Estimated gross USD per workbook before creation pauses for the owner to approve more. */
  jobCostCapUsd: 4,
  maxTokens: { session: 6000, page: 2600, answers: 1600, review: 1200, plan: 4000 },
};
type Run = { structural: number; truncated: number; editorial: number; provider: number; calls: number };
const freshRun = (): Run => ({ structural: 0, truncated: 0, editorial: 0, provider: 0, calls: 0 });
/** A session's work in progress. Saved after every call, so completed parts survive any failure or interruption. */
export type SessionWork = {
  /** "whole" asks for the session in one reply; "components" asks for page 1, page 2 and the answer key separately. */
  mode: "whole" | "components";
  /** Structurally valid parts, kept across attempts and retries. */
  components: { page1?: DraftPage; page2?: DraftPage; answers?: { n: number; answer: string }[] };
  /** The assembled session awaiting checks, revision or review (never part of the book until approved). */
  draft: SessionDraft | null;
  /** Problems the current draft still has, plus the reviewer's latest non-blocking suggestions. */
  feedback: Feedback[];
  /** Problems fixed in earlier attempts, quoted to the reviser as "keep fixed". */
  resolved: string[];
  /** Formatting problems with the last reply, fed back without touching the teaching. */
  format: string[];
  reviewPending: boolean;
  falsePositives: string[];
  attempts: number;
  calls: number;
  usd: number;
  ticks: number;
  run: Run;
  lastFailure?: { kind: string; detail: string; at: string };
};
const freshWork = (): SessionWork => ({
  mode: "whole", components: {}, draft: null, feedback: [], resolved: [], format: [], reviewPending: false,
  falsePositives: [], attempts: 0, calls: 0, usd: 0, ticks: 0, run: freshRun(),
});
/**
 * Work for a session from a job saved before this pipeline existed: its kept draft is re-checked now, so only the
 * problems it actually has are carried forward (the old feedback list also held problems already fixed).
 */
export function workFromLegacy(rev: any, ctx: SessionContext): SessionWork {
  const w = freshWork();
  if (!rev) return w;
  w.attempts = Number(rev.attempts) || 0;
  w.falsePositives = Array.isArray(rev.falsePositives) ? rev.falsePositives.slice(-20) : [];
  const suggestions = (Array.isArray(rev.feedback) ? rev.feedback : []).filter((f: Feedback) => f?.kind === "suggestion");
  const draft = rev.draft ? parseDraft(rev.draft) : null;
  if (draft) {
    const errors = checkSession(draft, ctx);
    w.draft = draft;
    w.feedback = [...errors.map((text) => ({ kind: "error" as const, source: "check" as const, text })), ...suggestions];
    w.reviewPending = !errors.length;
  }
  return w;
}
/** Pages that get a decorative chapter illustration: up to six short pages without a maths diagram. */
export function artTargets(book: Book): Page[] {
  return book.pages
    .filter(
      (p) =>
        !p.answerPage &&
        !p.visual &&
        p.text
          .split("\n")
          .reduce((n, s) => n + Math.max(1, Math.ceil(s.length / 72)), 0) <=
          12,
    )
    .filter((_, i) => i % 8 === 0)
    .slice(0, 6);
}
const PLAN_BATCH = 12;
/** Cron ticks a session takes before any have been measured: one write-and-review tick plus an allowance for a revision. */
const DEFAULT_TICKS_PER_SESSION = 1.6;
const TICK_MS = 60000;
/**
 * Where a creation job is, for the owner's progress view: each stage's done/total, every planned session's state,
 * and an estimate of the time left.
 *
 * The percentage is weighted by where the work actually is (writing is ~85% of a workbook's model calls), with
 * partial credit for saved components of the session in progress. The estimate uses the cron ticks sessions have
 * actually taken in this job (revisions included), not "elapsed time divided by steps", which counted three quick
 * planning batches like three sessions and promised far too little time.
 */
export function progressOf(job: any, payload: any, book: Book, now = Date.now()) {
  const sessions = payload.count as number;
  const planned = book.plan?.length || 0;
  const written = new Set(book.pages.filter((p) => p.answerPage).map((p) => p.lessonId)).size;
  const phases = ["plan", "write", "illustrate", "render", "ready"];
  const at = phases.indexOf(job.phase);
  const artTotal = at >= 2 ? artTargets(book).length : Math.min(6, Math.ceil((sessions * 2) / 8));
  const artDone = job.phase === "illustrate" ? job.cursor : at > 2 ? artTotal : 0;
  const steps = {
    plan: { done: Math.ceil(planned / PLAN_BATCH), total: Math.ceil(sessions / PLAN_BATCH) },
    write: { done: written, total: sessions },
    illustrate: { done: artDone, total: artTotal },
    render: { done: job.phase === "ready" ? 1 : 0, total: 1 },
  };
  const work: SessionWork | undefined = job.phase === "write" ? payload.work?.[job.cursor] : undefined;
  const partial = !work ? 0 : work.draft ? (work.reviewPending ? 0.75 : 0.5) : 0.2 * Object.keys(work.components || {}).length;
  const frac = (d: number, t: number) => (t > 0 ? Math.min(1, d / t) : 1);
  const fraction =
    0.05 * frac(planned, sessions) +
    0.85 * frac(written + partial, sessions) +
    0.07 * frac(artDone, artTotal) +
    0.03 * steps.render.done;
  const startedAt = payload.startedAt || job.updated_at;
  const timing = payload.timing || { sessions: 0, ticks: 0 };
  const measured = timing.sessions >= 2;
  const ticksPerSession = measured ? timing.ticks / timing.sessions : DEFAULT_TICKS_PER_SESSION;
  const active = job.status === "queued" || job.status === "running";
  const remainingTicks =
    Math.max(0, steps.plan.total - steps.plan.done) +
    Math.max(0, sessions - written - partial) * ticksPerSession +
    Math.max(0, artTotal - artDone) +
    (job.phase === "ready" ? 0 : 1);
  const paused = job.status === "paused" || job.status === "failed";
  const pageOf = new Map(book.pages.filter((p) => !p.answerPage).map((p) => [p.lessonId, p]));
  return {
    percent: job.phase === "ready" ? 100 : Math.min(99, Math.floor(fraction * 100)),
    steps,
    pagesSaved: book.pages.length,
    startedAt,
    elapsedMinutes: Math.max(0, Math.round((now - Date.parse(startedAt)) / 60000)),
    minutesLeft: active ? Math.max(1, Math.ceil((remainingTicks * TICK_MS) / 60000)) : null,
    estimateBasis: measured ? "measured" : "initial",
    sessions: Array.from({ length: Math.max(planned, sessions) }, (_, i) => {
      const plan = book.plan?.[i];
      const state = !plan
        ? "planning"
        : pageOf.has(plan.lessonId)
          ? "done"
          : job.phase === "write" && job.cursor === i
            ? paused ? "stuck" : "writing"
            : "waiting";
      return {
        n: i + 1,
        title: plan?.title || null,
        state,
        ...(state === "writing" || state === "stuck"
          ? { attempts: work?.attempts || 0, ...(work?.lastFailure ? { lastFailure: work.lastFailure.kind } : {}) }
          : {}),
      };
    }),
  };
}
export function registerForgeGeneration(app: Hono<any>) {
  app.use("*", async (c, next) => {
    await ensureForgeJobs(c.env.DB);
    await next();
  });
  // Editing an in-progress project would invalidate the background writer's input.
  app.use("/:id/*", async (c, next) => {
    if (
      c.req.method !== "GET" &&
      !["retry", "cancel", "reset-session"].includes(c.req.path.split("/").pop()!)
    ) {
      const job = await c.env.DB.prepare(
        "SELECT status FROM book_forge_jobs WHERE project_id=? AND owner_id=?",
      )
        .bind(c.req.param("id"), c.get("user").id)
        .first();
      if (job?.status === "queued" || job?.status === "running")
        return c.json(
          {
            detail:
              "This workbook is being created. Wait for it to finish or stop creation before editing.",
          },
          409,
        );
    }
    await next();
  });
  app.post("/generate", async (c) => {
    const b = await c.req.json();
    const brief = bounded(b.brief, 2000);
    if (brief.length < 20)
      return c.json(
        {
          detail:
            "Describe the workbook, age or year level, and what you want it to teach.",
        },
        400,
      );
    if (!c.env.AI || !c.env.BUCKET)
      return c.json(
        {
          detail:
            "Workbook creation needs the existing AI and file storage connections.",
        },
        503,
      );
    const active = await c.env.DB.prepare(
      "SELECT project_id FROM book_forge_jobs WHERE owner_id=? AND status IN ('queued','running')",
    )
      .bind(c.get("user").id)
      .first();
    if (active)
      return c.json(
        {
          detail:
            "Finish or stop your current workbook before starting another.",
        },
        409,
      );
    const limit = await hitRateLimit(
      c.env.DB,
      `forge-books:${c.get("user").id}`,
      3,
      86400,
    );
    if (!limit.ok)
      return c.json(
        {
          detail:
            "Three workbook starts have been used today. You can still continue existing projects.",
        },
        429,
      );
    if (
      !/foundation|kindergarten|prep\b|year\s*[0-6]\b/i.test(brief) ||
      !/math|numeracy|english|reading|literacy|science/i.test(brief) ||
      /year\s*(?:[7-9]|1[0-2])\b/i.test(brief)
    )
      return c.json(
        {
          detail:
            "For this first edition, include Foundation or Year 1–6 and Mathematics, English or Science in the brief.",
        },
        400,
      );
    const year = /foundation|kindergarten|prep\b/i.test(brief)
      ? 0
      : Number(brief.match(/year\s*([0-6])\b/i)?.[1] ?? 0);
    const subject = /\benglish|reading|literacy\b/i.test(brief)
      ? "English"
      : /\bscience\b/i.test(brief)
        ? "Science"
        : "Mathematics";
    const outcomes = AC9_OUTCOMES.filter(
      (o) => o.subject === subject && o.from <= year && o.to >= year,
    );
    const requested = Number(
      b.pageTarget || brief.match(/(\d+)\s*[- ]?pages?\b/i)?.[1] || 0,
    );
    if (
      requested &&
      (!Number.isInteger(requested) || requested < 8 || requested > 900)
    )
      return c.json(
        {
          detail:
            "Use a page target between 8 and 900, or leave it blank for content-led length. Larger projects should be made as separate volumes.",
        },
        400,
      );
    const count = requested
      ? Math.max(2, Math.floor((requested - 2) / 3))
      : b.length === "short"
        ? 8
        : Math.max(16, outcomes.length * 3);
    const id = crypto.randomUUID();
    const book: Book = {
      title: `${year === 0 ? "Foundation" : `Year ${year}`} ${subject} · creating`,
      template: "woodland",
      pages: [],
      releases: [],
      generated: true,
      brief,
    };
    const now = iso();
    await c.env.DB.batch([
      c.env.DB.prepare(
        "INSERT INTO book_forge_projects VALUES (?,?,?,?,?,?)",
      ).bind(id, c.get("user").id, book.title, 1, JSON.stringify(book), now),
      c.env.DB.prepare(
        "INSERT INTO book_forge_jobs (project_id,owner_id,family_id,status,phase,payload,updated_at) VALUES (?,?,?,?,?,?,?)",
      ).bind(
        id,
        c.get("user").id,
        c.get("user").family_id,
        "queued",
        "plan",
        JSON.stringify({
          brief,
          year,
          subject,
          count,
          outcomes,
          focused: b.length === "short",
          startedAt: now,
        }),
        now,
      ),
    ]);
    await writeAudit(c.env.DB, {
      actorUserId: c.get("user").id,
      actorLabel: "owner",
      action: "book-forge.generate",
      targetId: id,
    });
    return c.json({ id, revision: 1, book }, 202);
  });
  app.get("/:id/generation", async (c) => {
    const job = await c.env.DB.prepare(
      "SELECT status,phase,cursor,error,updated_at,payload FROM book_forge_jobs WHERE project_id=? AND owner_id=?",
    )
      .bind(c.req.param("id"), c.get("user").id)
      .first();
    if (!job) return c.json({ job: null });
    const { payload, ...safe } = job;
    const data = JSON.parse(payload as string);
    const project = await c.env.DB.prepare(
      "SELECT document FROM book_forge_projects WHERE id=? AND owner_id=?",
    )
      .bind(c.req.param("id"), c.get("user").id)
      .first();
    // The session being worked on (never part of the book until approved), for the owner to inspect.
    const work: SessionWork | undefined = job.phase === "write" ? data.work?.[job.cursor as number] : undefined;
    return c.json({
      job: {
        ...safe,
        total: data.count,
        progress: project ? progressOf(job, data, JSON.parse(project.document as string)) : null,
        pause: data.pause || null,
        recovery:
          job.status === "paused" || job.status === "failed"
            ? ["retry", ...(job.phase === "write" ? ["reset-session"] : []), "cancel"]
            : job.status === "queued" || job.status === "running" ? ["cancel"] : [],
        usage: { ...(await eventSummary(c.env.DB, c.req.param("id"))), capUsd: data.costCapUsd ?? POLICY.jobCostCapUsd },
        review: work
          ? {
              attempts: work.attempts,
              mode: work.mode,
              savedComponents: Object.keys(work.components || {}),
              errors: work.feedback.filter((f) => f.kind === "error").map((f) => f.text),
              suggestions: work.feedback.filter((f) => f.kind === "suggestion").map((f) => f.text),
              resolved: work.resolved,
              format: work.format,
              falsePositives: work.falsePositives,
              lastFailure: work.lastFailure || null,
              run: work.run,
              calls: work.calls,
              estimatedUsd: Math.round(work.usd * 10000) / 10000,
              draft: work.draft,
            }
          : null,
      },
    });
  });
  // Owner recovery for a paused job. Retry: same step, fresh retry budgets, every saved part kept.
  // Reset session: discard only the paused session's draft and parts and write it again; approved sessions stay.
  // Cancel: stop, keeping every approved page.
  for (const action of ["retry", "reset-session", "cancel"])
    app.post(`/:id/${action}`, async (c) => {
      const job = await c.env.DB.prepare(
        "SELECT * FROM book_forge_jobs WHERE project_id=? AND owner_id=?",
      )
        .bind(c.req.param("id"), c.get("user").id)
        .first();
      if (!job) return c.json({ detail: "Creation job not found." }, 404);
      const stopped = job.status === "failed" || job.status === "paused";
      if (action !== "cancel" && !stopped)
        return c.json({ detail: "Only a paused creation step can be retried." }, 409);
      if (action === "reset-session" && job.phase !== "write")
        return c.json({ detail: "Only a paused writing session can be written again from the start." }, 409);
      if (action === "cancel" && ["complete", "cancelled"].includes(job.status))
        return c.json({ detail: "This creation has already finished." }, 409);
      const payload = JSON.parse(job.payload as string);
      if (action !== "cancel") {
        if (payload.failures) delete payload.failures[`${job.phase}:${job.cursor}`];
        payload.planRun = undefined;
        // Spending past the cap needs the owner's say-so: a retry after a budget pause allows one more cap's worth.
        if (payload.pause?.kind === "budget")
          payload.costCapUsd = (payload.costUsd || 0) + POLICY.jobCostCapUsd;
        payload.pause = undefined;
        const work: SessionWork | undefined = payload.work?.[job.cursor];
        if (action === "reset-session") {
          if (payload.work) delete payload.work[job.cursor];
          if (payload.revisions) delete payload.revisions[job.cursor];
        } else if (work) {
          work.run = freshRun();
        }
      }
      await c.env.DB.prepare(
        "UPDATE book_forge_jobs SET status=?,payload=?,error=?,lease=NULL,lease_until=NULL,updated_at=? WHERE project_id=? AND owner_id=?",
      )
        .bind(
          action === "cancel" ? "cancelled" : "queued",
          JSON.stringify(payload),
          "",
          iso(),
          c.req.param("id"),
          c.get("user").id,
        )
        .run();
      await writeAudit(c.env.DB, {
        actorUserId: c.get("user").id,
        actorLabel: "owner",
        action: `book-forge.${action}`,
        targetId: c.req.param("id"),
      });
      return c.json({ ok: true });
    });
}
type StepResult = {
  status: "queued" | "paused" | "complete";
  phase: string;
  cursor: number;
  error: string;
  bookChanged: boolean;
  /** Earliest time the job may run again (provider backoff); stored in lease_until with no lease held. */
  notBefore?: string;
};
type StepCtx = { env: Env; job: any; payload: any; book: Book };

/** Pauses creation for the owner with the precise reason; saved work is untouched. */
function pause(x: StepCtx, o: { session: number | null; kind: string; detail: string; message: string; phase: string; cursor: number }): StepResult {
  x.payload.pause = { session: o.session, kind: o.kind, detail: o.detail.slice(0, 600), at: iso() };
  return { status: "paused", phase: o.phase, cursor: o.cursor, error: o.message.slice(0, 800), bookChanged: false };
}
const backoff = (n: number) => new Date(Date.now() + 60000 * 2 ** Math.max(0, n - 1)).toISOString();
const describe = (r: Extract<CallResult, { ok: false }>) => `${r.kind}: ${r.detail}`;

/** Logs a call and charges it to the job (and, when given, the session). */
async function charge(x: StepCtx, r: CallResult, phase: string, session: number | null, action: string, work?: SessionWork) {
  const usd = r.event.estUsd || 0;
  x.payload.costUsd = (x.payload.costUsd || 0) + usd;
  x.payload.calls = (x.payload.calls || 0) + 1;
  if (work) { work.calls++; work.usd += usd; work.run.calls++; }
  await logCall(x.env.DB, { projectId: x.job.project_id, phase, session, event: r.event, action });
}

async function planStep(x: StepCtx): Promise<StepResult> {
  const { payload, book, job } = x;
  const start = book.plan?.length || 0;
  const batchSize = Math.min(PLAN_BATCH, payload.count - start);
  const run: Run = (payload.planRun ||= freshRun());
  const label = `sessions ${start + 1}–${start + batchSize}`;
  const assigned = Array.from(
    { length: batchSize },
    (_, i) =>
      payload.outcomes[
        Math.min(payload.outcomes.length - 1, Math.floor(((start + i) * payload.outcomes.length) / payload.count))
      ],
  );
  const r = await callJson(x.env, {
    purpose: "plan",
    prompt: `Create a coherent ORIGINAL ${payload.year === 0 ? "Foundation" : `Year ${payload.year}`} ${payload.subject} workbook plan. Brief: ${payload.brief}\nThe whole book has ${payload.count} teaching sessions. Plan ONLY the next ${batchSize} sessions, starting at session ${start + 1}. Previous sessions: ${JSON.stringify(book.plan || [])}.\nThese are the ONLY valid curriculum references: ${JSON.stringify(payload.outcomes)}. ${!payload.focused ? `For these next sessions use these assigned curriculum references in order, varying and deepening practice each time: ${JSON.stringify(assigned)}.` : "Choose the references most relevant to the requested topic."} Use age-appropriate progression, practical work, revision and varied exercises. Return {"title":"...","sessions":[{"title":"...","goal":"...","code":"one supplied code"}]}. EXACTLY ${batchSize} sessions. Each goal <=180 characters; titles <=80 characters.${run.structural ? ` Your last reply could not be used: ${payload.planFormat || "it did not match the shape"}.` : ""}`,
    schema: planSchema(batchSize),
    maxTokens: POLICY.maxTokens.plan,
  });
  run.calls++;
  let failure: { kind: string; detail: string } | null = r.ok ? null : { kind: r.kind, detail: r.detail };
  let planned: ForgePlan[] = [];
  if (r.ok) {
    const codes = new Set(payload.outcomes.map((o: any) => o.code));
    const bad = r.value.sessions
      .map((s: any, i: number) =>
        !codes.has(s.code) ? `session ${start + i + 1} uses ${JSON.stringify(s.code)}, which is not a supplied code`
        : !payload.focused && s.code !== assigned[i].code ? `session ${start + i + 1} must use ${assigned[i].code}` : "")
      .filter(Boolean);
    if (bad.length) failure = { kind: "schema", detail: `Invalid curriculum reference: ${bad.slice(0, 4).join("; ")}` };
    else
      planned = r.value.sessions.map((s: any, i: number) => ({
        title: s.title.trim(),
        goal: s.goal.trim(),
        code: s.code,
        lessonId: `forge-${job.project_id}-${start + i + 1}`,
      }));
  }
  // A curriculum mismatch is recorded as the structural failure it is, not as a good reply.
  const logged = r.ok && failure ? { ...r, event: { ...r.event, outcome: "schema" as const, detail: failure.detail.slice(0, 600) } } : r;
  await charge(x, logged, "plan", null, failure ? `retry plan (${failure.kind})` : `planned ${label}`);
  if (failure) {
    if (failure.kind === "provider" || failure.kind === "empty") {
      run.provider++;
      if (run.provider > POLICY.provider)
        return pause(x, { session: null, kind: failure.kind, detail: failure.detail, phase: "plan", cursor: start, message: `Paused while planning ${label}: the writing service failed ${run.provider} times (${failure.detail}). Retry when it is available.` });
      return { status: "queued", phase: "plan", cursor: start, error: `Writing service unavailable; retrying planning shortly. ${failure.detail}`.slice(0, 800), bookChanged: false, notBefore: backoff(run.provider) };
    }
    run.structural++;
    payload.planFormat = failure.detail.slice(0, 400);
    if (run.structural >= POLICY.planStructural)
      return pause(x, { session: null, kind: failure.kind, detail: failure.detail, phase: "plan", cursor: start, message: `Paused while planning ${label} after ${run.structural} unusable plan replies (${failure.kind}): ${failure.detail}` });
    return { status: "queued", phase: "plan", cursor: start, error: `The book plan reply was unusable (${failure.kind}); retrying. ${failure.detail}`.slice(0, 800), bookChanged: false };
  }
  book.plan = [...(book.plan || []), ...planned];
  if (start === 0) book.title = r.ok ? r.value.title.trim() : book.title;
  payload.planRun = undefined;
  payload.planFormat = undefined;
  const cursor = book.plan.length;
  return cursor >= payload.count
    ? { status: "queued", phase: "write", cursor: 0, error: "", bookChanged: true }
    : { status: "queued", phase: "plan", cursor, error: "", bookChanged: true };
}

/** Page 1 numbered 1…k and page 2 continuing from k+1: a numbering fix only, so the answer key lines up. */
function numbered(page: DraftPage, from: number): DraftPage {
  return { ...page, tasks: page.tasks.map((t, i) => ({ ...t, n: from + i })) };
}
const asPage = (v: any): DraftPage | null => parseDraft({ pages: [v], answers: [] })?.pages[0] ?? null;

/** Valid parts of a reply that failed as a whole, so a retry only asks for what is missing. */
function salvage(partial: any, work: SessionWork) {
  if (!partial || typeof partial !== "object" || !Array.isArray(partial.pages)) return;
  const [p1, p2] = partial.pages;
  if (p1 && !validateSchemaSafe(PAGE_SCHEMA, p1) && !work.components.page1) work.components.page1 = numbered(asPage(p1)!, 1);
  if (work.components.page1 && p2 && !validateSchemaSafe(PAGE_SCHEMA, p2) && !work.components.page2)
    work.components.page2 = numbered(asPage(p2)!, work.components.page1.tasks.length + 1);
}
const validateSchemaSafe = (schema: any, v: unknown) => validateSchema(schema, v).length > 0;

/** The editorial outcome of an assembled draft: errors become the next revision's must-fix list. */
function rejectDraft(x: StepCtx, work: SessionWork, draft: SessionDraft, feedback: Feedback[], cursor: number): StepResult {
  const now = new Set(feedback.filter((f) => f.kind === "error").map((f) => f.text));
  const before = work.feedback.filter((f) => f.kind === "error" && !now.has(f.text)).map((f) => f.text);
  work.resolved = [...new Set([...work.resolved, ...before])].filter((t) => !now.has(t)).slice(-20);
  const suggestions = feedback.filter((f) => f.kind === "suggestion");
  work.feedback = [...feedback.filter((f) => f.kind === "error"), ...(suggestions.length ? suggestions : work.feedback.filter((f) => f.kind === "suggestion"))];
  work.draft = draft;
  work.reviewPending = false;
  work.run.editorial++;
  const errors = [...now];
  work.lastFailure = { kind: "editorial", detail: errors.slice(0, 4).join(" ").slice(0, 600), at: iso() };
  const message = `Session ${cursor + 1} needs revision: ${errors.slice(0, 4).join(" ")}`;
  if (work.run.editorial >= POLICY.editorial)
    return pause(x, { session: cursor, kind: "editorial", detail: errors.join(" "), phase: "write", cursor, message: `Session ${cursor + 1} paused after ${work.run.editorial} revisions still failing the quality checks. Open problems: ${errors.slice(0, 4).join(" ")}` });
  return { status: "queued", phase: "write", cursor, error: message.slice(0, 780), bookChanged: false };
}

/**
 * One tick of work on the session at `cursor`. Each paid call's outcome decides the next action:
 * - a provider error waits and retries the same call (backoff);
 * - a truncated whole-session reply splits the session into page 1, page 2 and the answer key;
 * - a malformed or wrong-shape reply keeps every valid part and asks again for only the missing or broken part,
 *   with the precise format errors (it never discards the teaching or triggers a full rewrite);
 * - a complete draft that fails the checks or the review is revised against only its current problems;
 * - a draft that passes the checks goes straight to the independent reviewer in the same tick.
 * Every outcome is saved before the tick ends, so nothing completed is lost to a later failure.
 */
async function writeStep(x: StepCtx): Promise<StepResult> {
  const { payload, book } = x;
  let cursor = x.job.cursor as number;
  const plan = book.plan![cursor];
  const ctx: SessionContext = { year: payload.year, subject: payload.subject, title: plan.title, goal: plan.goal };
  payload.work ||= {};
  const work: SessionWork = (payload.work[cursor] ||= workFromLegacy(payload.revisions?.[cursor], ctx));
  if (payload.revisions) delete payload.revisions[cursor];
  work.run ||= freshRun();
  work.ticks++;
  const cap = payload.costCapUsd ?? POLICY.jobCostCapUsd;
  for (let step = 0; step < 2; step++) {
    if ((payload.costUsd || 0) >= cap)
      return pause(x, { session: cursor, kind: "budget", detail: `Estimated spend $${(payload.costUsd || 0).toFixed(2)} reached the $${cap.toFixed(2)} cap.`, phase: "write", cursor, message: `Paused at session ${cursor + 1}: this workbook's estimated model spend reached its $${cap.toFixed(2)} cap. Retry to allow another $${POLICY.jobCostCapUsd.toFixed(2)}.` });
    if (work.run.calls >= POLICY.callsPerSessionRun)
      return pause(x, { session: cursor, kind: "calls", detail: `${work.run.calls} calls this run.`, phase: "write", cursor, message: `Session ${cursor + 1} paused after ${work.run.calls} model calls without an approved session. Last problem: ${work.lastFailure ? `${work.lastFailure.kind}: ${work.lastFailure.detail}` : "none recorded"}` });
    const action: "review" | "revise" | "session" | "page1" | "page2" | "answers" =
      work.draft ? (work.reviewPending ? "review" : "revise")
      : work.mode === "whole" ? "session"
      : !work.components.page1 ? "page1" : !work.components.page2 ? "page2" : "answers";
    const pages = [work.components.page1, work.components.page2].filter(Boolean) as DraftPage[];
    const r = await callJson(x.env, {
      purpose: action,
      ...(action === "review"
        ? { prompt: reviewPrompt({ ctx, plan, draft: work.draft! }), schema: REVIEW_SCHEMA, maxTokens: POLICY.maxTokens.review, normalize: (v: any) => (v && !Array.isArray(v.errors) && Array.isArray(v.issues) ? { ...v, errors: v.issues } : v), temperature: 0.1 }
        : action === "revise"
          ? { prompt: revisePrompt({ ctx, plan, draft: work.draft, feedback: work.feedback, resolved: work.resolved, format: work.format }), schema: SESSION_SCHEMA, maxTokens: POLICY.maxTokens.session }
          : action === "session"
            ? { prompt: writePrompt({ ctx, brief: payload.brief, sessionNumber: cursor + 1, sequence: book.plan!.map((p) => ({ title: p.title, code: p.code })), plan }), schema: SESSION_SCHEMA, maxTokens: POLICY.maxTokens.session }
            : action === "answers"
              ? { prompt: answersPrompt({ ctx, plan, pages, format: work.format }), schema: ANSWERS_SCHEMA, maxTokens: POLICY.maxTokens.answers }
              : { prompt: pagePrompt({ ctx, brief: payload.brief, sessionNumber: cursor + 1, plan, page: action === "page1" ? 1 : 2, page1: work.components.page1, format: work.format }), schema: PAGE_SCHEMA, maxTokens: POLICY.maxTokens.page }),
    });
    // ---- structural outcome: classify, keep what is valid, choose the cheapest recovery
    if (!r.ok) {
      work.lastFailure = { kind: r.kind, detail: r.detail.slice(0, 600), at: iso() };
      let next = "";
      if (r.kind === "provider" || r.kind === "empty") {
        work.run.provider++;
        next = `wait and retry ${action}`;
        await charge(x, r, "write", cursor, next, work);
        if (work.run.provider > POLICY.provider)
          return pause(x, { session: cursor, kind: r.kind, detail: r.detail, phase: "write", cursor, message: `Session ${cursor + 1} paused: the writing service failed ${work.run.provider} times (${r.detail}). Saved work is kept; retry when the service is available.` });
        return { status: "queued", phase: "write", cursor, error: `Writing service unavailable; retrying session ${cursor + 1} shortly.`, bookChanged: false, notBefore: backoff(work.run.provider) };
      }
      const counter = r.kind === "truncated" ? "truncated" : "structural";
      // A whole session cut off is the expected signal to split it (once per session), not a strike against it.
      if (!(action === "session" && counter === "truncated")) work.run[counter]++;
      if (action === "session") {
        // Too large or wrongly shaped as one reply: keep any valid page and build the rest piece by piece.
        salvage(r.partial, work);
        work.mode = "components";
        work.format = [];
        next = `split session into components (kept: ${Object.keys(work.components).join(", ") || "none"})`;
      } else if (action === "review") {
        next = "ask the reviewer again (draft kept)";
      } else {
        work.format = r.kind === "truncated"
          ? [`Your reply was cut off at the length limit. Keep every field short and within its limit, and finish the JSON. (${r.detail.slice(0, 200)})`]
          : r.detail.split("; ").slice(0, 8);
        next = `repair ${action} format (content kept)`;
      }
      await charge(x, r, "write", cursor, next, work);
      if (counter === "truncated" ? work.run.truncated >= POLICY.truncated : work.run.structural > POLICY.structural)
        return pause(x, { session: cursor, kind: r.kind, detail: r.detail, phase: "write", cursor, message: `Session ${cursor + 1} paused after ${work.run[counter]} ${r.kind === "truncated" ? "replies cut off at the length limit" : "unusable replies"} (${action}): ${r.detail}` });
      return { status: "queued", phase: "write", cursor, error: `Session ${cursor + 1}: ${action} reply unusable (${describe(r)}); next: ${next}.`.slice(0, 800), bookChanged: false };
    }
    // ---- a usable reply
    let draft: SessionDraft | null = null;
    if (action === "page1" || action === "page2") {
      const page = asPage(r.value)!;
      if (action === "page1") work.components.page1 = numbered(page, 1);
      else work.components.page2 = numbered(page, work.components.page1!.tasks.length + 1);
      work.format = [];
      await charge(x, r, "write", cursor, `saved ${action}`, work);
      return { status: "queued", phase: "write", cursor, error: "", bookChanged: false };
    }
    if (action === "answers") {
      const ns = pages.flatMap((p) => p.tasks.map((t) => t.n));
      const got = r.value.answers.map((a: any) => a.n);
      const missing = ns.filter((n) => !got.includes(n));
      const extra = got.filter((n: number, i: number) => !ns.includes(n) || got.indexOf(n) !== i);
      if (missing.length || extra.length) {
        // The key does not line up with the saved tasks: a structural problem with this component only.
        work.run.structural++;
        work.format = [`The answer key must have exactly one answer for each task ${ns.join(", ")}.${missing.length ? ` Missing: ${missing.join(", ")}.` : ""}${extra.length ? ` Not tasks or repeated: ${extra.join(", ")}.` : ""}`];
        work.lastFailure = { kind: "schema", detail: work.format[0], at: iso() };
        await charge(x, { ...r, event: { ...r.event, outcome: "schema", detail: work.format[0] } }, "write", cursor, "repair answers (pages kept)", work);
        if (work.run.structural > POLICY.structural)
          return pause(x, { session: cursor, kind: "schema", detail: work.format[0], phase: "write", cursor, message: `Session ${cursor + 1} paused: the answer key repeatedly failed to match the tasks. ${work.format[0]}` });
        return { status: "queued", phase: "write", cursor, error: `Session ${cursor + 1}: ${work.format[0]}`, bookChanged: false };
      }
      work.components.answers = r.value.answers.map((a: any) => ({ n: a.n, answer: String(a.answer).trim() }));
      draft = parseDraft({ pages, answers: work.components.answers });
    } else if (action === "session" || action === "revise") {
      draft = parseDraft(r.value);
    }
    if (action !== "review") {
      // ---- deterministic checks on a structurally complete draft (the editorial standard, unchanged)
      work.attempts++;
      work.format = [];
      const checks = checkSession(draft!, ctx);
      if (!checks.length)
        checks.push(...qaBook({ title: book.title, template: book.template, pages: sessionPages(draft!, plan, cursor), releases: [] }));
      if (checks.length) {
        await charge(x, r, "write", cursor, `revise: ${checks.length} check problem(s)`, work);
        return rejectDraft(x, work, draft!, checks.map((text) => ({ kind: "error", source: "check", text })), cursor);
      }
      work.draft = draft;
      work.reviewPending = true;
      await charge(x, r, "write", cursor, "draft passed checks; review", work);
      continue; // the independent review, in the same tick
    }
    // ---- the independent review
    const verdict = reconcileReview(r.value);
    work.falsePositives = [...work.falsePositives, ...verdict.falsePositives].slice(-20);
    if (verdict.errors.length) {
      await charge(x, r, "write", cursor, `revise: ${verdict.errors.length} reviewer error(s)`, work);
      return rejectDraft(x, work, work.draft!, [
        ...verdict.errors.map((text) => ({ kind: "error" as const, source: "reviewer" as const, text })),
        ...verdict.suggestions.map((text) => ({ kind: "suggestion" as const, source: "reviewer" as const, text })),
      ], cursor);
    }
    await charge(x, r, "write", cursor, "approved", work);
    if (verdict.falsePositives.length)
      payload.falsePositives = [...(payload.falsePositives || []), ...verdict.falsePositives.map((f) => `Session ${cursor + 1}: ${f}`)].slice(-50);
    book.pages.push(...sessionPages(work.draft!, plan, cursor));
    payload.timing = { sessions: (payload.timing?.sessions || 0) + 1, ticks: (payload.timing?.ticks || 0) + work.ticks };
    payload.sessionCosts = { ...(payload.sessionCosts || {}), [cursor + 1]: { calls: work.calls, usd: Math.round(work.usd * 10000) / 10000, attempts: work.attempts } };
    delete payload.work[cursor];
    cursor++;
    if (cursor >= book.plan!.length) {
      book.pages = [...book.pages.filter((p) => !p.answerPage), ...book.pages.filter((p) => p.answerPage)];
      return { status: "queued", phase: "illustrate", cursor: 0, error: "", bookChanged: true };
    }
    return { status: "queued", phase: "write", cursor, error: "", bookChanged: true };
  }
  return { status: "queued", phase: "write", cursor, error: "", bookChanged: false };
}

export async function processBookForgeJobs(env: Env) {
  await ensureForgeJobs(env.DB);
  // One leased step at a time; each step's outcome is committed before the next paid call.
  const job = await env.DB.prepare(
    "SELECT * FROM book_forge_jobs WHERE status IN ('queued','running') AND (lease_until IS NULL OR lease_until < ?) ORDER BY updated_at LIMIT 1",
  )
    .bind(iso())
    .first<any>();
  if (!job) return;
  const lease = crypto.randomUUID();
  const until = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const claimed = await env.DB.prepare(
    "UPDATE book_forge_jobs SET status='running',lease=?,lease_until=? WHERE project_id=? AND (lease_until IS NULL OR lease_until < ?) AND status IN ('queued','running')",
  )
    .bind(lease, until, job.project_id, iso())
    .run();
  if (!claimed.meta.changes) return;
  const payload = JSON.parse(job.payload);
  try {
    if (!(await activeRoles(env.DB, job.owner_id)).includes("owner"))
      throw new Error("Owner access is no longer active.");
    const row = await env.DB.prepare(
      "SELECT * FROM book_forge_projects WHERE id=? AND owner_id=?",
    )
      .bind(job.project_id, job.owner_id)
      .first<any>();
    if (!row) throw new Error("Project no longer exists.");
    const book: Book = JSON.parse(row.document);
    const x: StepCtx = { env, job, payload, book };
    let result: StepResult;
    if (job.phase === "plan") result = await planStep(x);
    else if (job.phase === "write") result = await writeStep(x);
    else {
      let phase = job.phase, cursor = job.cursor, status = "queued";
      if (phase === "illustrate") {
      // A few decorative chapter illustrations; exact diagrams always remain vector artwork.
      const targets = artTargets(book);
      if (cursor < targets.length) {
        if (!env.AI || !env.BUCKET)
          throw new Error("Artwork storage or Workers AI is unavailable.");
        const limit = await hitRateLimit(
          env.DB,
          `forge-art:${job.owner_id}`,
          30,
          86400,
        );
        if (!limit.ok)
          throw new Error(
            "Daily artwork allowance reached. Retry tomorrow to continue.",
          );
        const page = targets[cursor];
        const form = new FormData();
        const prompt = `Original professional children's workbook illustration for Side-Quest: ${page.title}. Gentle woodland dragon explorer, warm hand-painted storybook style, sage green and cream palette, clean light background. Decorative only: no numbers, text, worksheets or mathematical representations.`;
        form.append("prompt", prompt);
        form.append("width", "1024");
        form.append("height", "1024");
        const multipart = new Response(form);
        const image = await env.AI.run(
          "@cf/black-forest-labs/flux-2-klein-9b",
          {
            multipart: {
              body: multipart.body,
              contentType: multipart.headers.get("content-type"),
            },
          },
        );
        if (typeof image?.image !== "string" || image.image.length > 6000000)
          throw new Error("No usable illustration was returned.");
        const bytes = Uint8Array.from(atob(image.image), (c) =>
          c.charCodeAt(0),
        );
        const png =
          bytes[0] === 137 &&
          bytes[1] === 80 &&
          bytes[2] === 78 &&
          bytes[3] === 71;
        if (!png && !(bytes[0] === 255 && bytes[1] === 216))
          throw new Error("Unsupported illustration format.");
        page.art = `book-forge/${job.project_id}/art/${crypto.randomUUID()}.${png ? "png" : "jpg"}`;
        await env.BUCKET.put(page.art, bytes, {
          httpMetadata: { contentType: png ? "image/png" : "image/jpeg" },
        });
        page.prompt = prompt;
        page.artModel = "@cf/black-forest-labs/flux-2-klein-9b";
        cursor++;
      }
      if (cursor >= targets.length) {
        phase = "render";
        cursor = 0;
      }
    } else if (phase === "render") {
      const issues = qaBook(book);
      if (issues.length) throw new Error(issues.join(" ").slice(0, 700));
      if (typeof env.BROWSER?.quickAction !== "function")
        throw new Error(
          "PDF connection is not ready. Your written and illustrated pages are saved; connect Browser Run and retry.",
        );
      if (!env.BUCKET) throw new Error("File storage is unavailable.");
      const images: Record<string, string> = {};
      for (const p of book.pages)
        if (p.art) {
          const o = await env.BUCKET.get(p.art);
          if (!o) throw new Error("Saved illustration missing.");
          const data = new Uint8Array(await o.arrayBuffer());
          let bin = "";
          for (let i = 0; i < data.length; i += 8192)
            bin += String.fromCharCode(...data.subarray(i, i + 8192));
          images[p.art] =
            `data:image/${p.art.endsWith(".png") ? "png" : "jpeg"};base64,${btoa(bin)}`;
        }
      const html = renderBook(book, images);
      if (html.length > 18000000)
        throw new Error(
          "Artwork exceeds the export size limit. Reduce illustrations before exporting.",
        );
      const pdf = await env.BROWSER.quickAction("pdf", {
        html,
        pdfOptions: {
          format: "a4",
          printBackground: true,
          preferCSSPageSize: true,
        },
        waitForTimeout: 1000,
      });
      if (!pdf.ok) throw new Error("PDF rendering failed. Retry this step.");
      const bytes = await pdf.arrayBuffer();
      if (
        bytes.byteLength > 25000000 ||
        new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-"
      )
        throw new Error("PDF output was not valid.");
      book.pdf = `book-forge/${job.project_id}/pdf/${crypto.randomUUID()}.pdf`;
      await env.BUCKET.put(book.pdf, bytes, {
        httpMetadata: { contentType: "application/pdf" },
      });
      status = "complete";
      phase = "ready";
    }
      result = { status: status === "complete" ? "complete" : "queued", phase, cursor, error: "", bookChanged: true };
    }
    await commit(env, job, lease, row, book, payload, result);
  } catch (e) {
    // Unexpected failures (storage, rendering, the database): count them per step and pause after a few.
    const stored = JSON.parse(job.payload);
    const key = `${job.phase}:${job.cursor}`;
    stored.failures = stored.failures || {};
    stored.failures[key] = (stored.failures[key] || 0) + 1;
    const message = (e instanceof Error ? e.message : "Creation paused. Retry the step.").slice(0, 800);
    const paused = stored.failures[key] >= MAX_ATTEMPTS;
    if (paused) stored.pause = { session: job.phase === "write" ? job.cursor : null, kind: "step", detail: message, at: iso() };
    // Keep any session work saved before the error (it was valid when saved).
    if (payload.work) stored.work = payload.work;
    console.error(JSON.stringify({ evt: "book-forge.step-error", project: job.project_id, phase: job.phase, cursor: job.cursor, attempt: stored.failures[key], message }));
    await env.DB.prepare(
      "UPDATE book_forge_jobs SET status=?,payload=?,error=?,lease=NULL,lease_until=NULL,updated_at=? WHERE project_id=? AND lease=?",
    )
      .bind(paused ? "paused" : "queued", JSON.stringify(stored), message, iso(), job.project_id, lease)
      .run();
  }
}

/** Saves a step's outcome. The book is written only when it changed, guarded against concurrent edits. */
async function commit(env: Env, job: any, lease: string, row: any, book: Book, payload: any, r: StepResult) {
  const jobUpdate = (extra: string, ...bind: unknown[]) =>
    env.DB.prepare(
      `UPDATE book_forge_jobs SET status=?,phase=?,cursor=?,payload=?,error=?,lease=NULL,lease_until=?,updated_at=? WHERE project_id=? AND lease=?${extra}`,
    ).bind(r.status, r.phase, r.cursor, JSON.stringify(payload), r.error, r.notBefore ?? null, iso(), job.project_id, lease, ...bind);
  if (!r.bookChanged) {
    await jobUpdate("").run();
    return;
  }
  const document = JSON.stringify(book);
  if (new TextEncoder().encode(document).length > 1500000)
    throw new Error("Workbook exceeds the project size limit.");
  const updated = await env.DB.batch([
    env.DB.prepare(
      "UPDATE book_forge_projects SET title=?,document=?,revision=revision+1,updated_at=? WHERE id=? AND revision=? AND EXISTS (SELECT 1 FROM book_forge_jobs WHERE project_id=? AND lease=?)",
    ).bind(book.title, document, iso(), job.project_id, row.revision, job.project_id, lease),
    jobUpdate(" AND EXISTS (SELECT 1 FROM book_forge_projects WHERE id=? AND revision=? AND document=?)", job.project_id, row.revision + 1, document),
  ]);
  if (!updated[0].meta.changes)
    throw new Error("Project changed while generating. Stop creation and review your saved pages.");
}
