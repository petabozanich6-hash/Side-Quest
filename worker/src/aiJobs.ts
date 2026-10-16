/**
 * One row per "make me a lesson" request, keyed by a request id the browser chooses.
 *
 * - The same request id never starts a second generation (double clicks, retries after a dropped
 *   connection, two tabs), so it can never be charged twice against the family's allowance.
 * - The row records the real stage the generator has reached, so the parent sees true progress and can
 *   pick the finished lesson up even if their connection dropped while it was being written.
 * - A request whose Worker stopped (no update for a few minutes) is reported as interrupted and may be
 *   retried with the same id.
 * Rows hold ids, a stage name and a short error only: never the parent's request text or the lesson.
 */
import { GEN_PHASES } from "./aiDraft";
import type { GenPhase } from "./aiDraft";

type DB = D1Database;

export const JOBS_TABLE = `CREATE TABLE IF NOT EXISTS ai_generation_jobs (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  phase TEXT,
  lesson_id TEXT,
  error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (family_id, request_id)
)`;
const ready = new WeakSet<DB>();
export async function ensureJobsSchema(db: DB) {
  if (ready.has(db)) return;
  await db.prepare(JOBS_TABLE).run();
  ready.add(db);
}

/** No progress for this long means the Worker writing it has stopped (a single stage is capped well below). */
export const STALE_MS = 6 * 60_000;
export const validRequestId = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(v);

export type Job = { id: string; status: "running" | "done" | "failed"; phase: string | null; lesson_id: string | null; error: string | null; created_at: string; updated_at: string };

export type Start =
  | { state: "new"; id: string }
  | { state: "running"; job: Job }
  | { state: "done"; job: Job };

export async function startJob(db: DB, familyId: string, userId: string, requestId: string, kind = "lesson_draft", now = new Date()): Promise<Start> {
  await ensureJobsSchema(db);
  const ts = now.toISOString();
  const id = crypto.randomUUID();
  const ins = await db.prepare(
    "INSERT OR IGNORE INTO ai_generation_jobs (id, family_id, user_id, request_id, kind, status, phase, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'running', NULL, ?, ?)"
  ).bind(id, familyId, userId, requestId, kind, ts, ts).run();
  if (ins.meta?.changes) return { state: "new", id };
  const job = await getJob(db, familyId, requestId);
  if (!job) return { state: "new", id }; // raced with a delete: treat as new
  if (job.status === "done") return { state: "done", job };
  // A failed or abandoned request may run again under the same id; only one caller wins the claim.
  const stale = new Date(now.getTime() - STALE_MS).toISOString();
  const claim = await db.prepare(
    "UPDATE ai_generation_jobs SET status = 'running', phase = NULL, error = NULL, updated_at = ? WHERE id = ? AND (status = 'failed' OR (status = 'running' AND updated_at < ?))"
  ).bind(ts, job.id, stale).run();
  if (claim.meta?.changes) return { state: "new", id: job.id };
  return { state: "running", job };
}

export async function setPhase(db: DB, jobId: string, phase: GenPhase, now = new Date()) {
  await db.prepare("UPDATE ai_generation_jobs SET phase = ?, updated_at = ? WHERE id = ? AND status = 'running'").bind(phase, now.toISOString(), jobId).run();
}

export async function finishJob(db: DB, jobId: string, result: { lessonId?: string; error?: string }, now = new Date()) {
  await db.prepare("UPDATE ai_generation_jobs SET status = ?, lesson_id = ?, error = ?, updated_at = ? WHERE id = ?")
    .bind(result.lessonId ? "done" : "failed", result.lessonId ?? null, result.error ? result.error.slice(0, 300) : null, now.toISOString(), jobId).run();
}

export async function getJob(db: DB, familyId: string, requestId: string): Promise<Job | null> {
  await ensureJobsSchema(db);
  return db.prepare("SELECT id, status, phase, lesson_id, error, created_at, updated_at FROM ai_generation_jobs WHERE family_id = ? AND request_id = ?")
    .bind(familyId, requestId).first<Job>();
}

/** What the parent's screen shows. "interrupted" means it stopped without finishing and can be retried. */
export function jobView(job: Job | null, now = new Date()) {
  if (!job) return { status: "unknown" as const };
  const stale = job.status === "running" && now.getTime() - Date.parse(job.updated_at) > STALE_MS;
  const phase = (GEN_PHASES as string[]).includes(job.phase || "") ? job.phase : null;
  return {
    status: stale ? ("interrupted" as const) : job.status,
    phase,
    step: phase ? GEN_PHASES.indexOf(phase as GenPhase) + 1 : 0,
    steps: GEN_PHASES.length,
    lesson_id: job.lesson_id,
    error: job.error,
    elapsed_ms: Math.max(0, (job.status === "running" ? now.getTime() : Date.parse(job.updated_at)) - Date.parse(job.created_at)),
  };
}
