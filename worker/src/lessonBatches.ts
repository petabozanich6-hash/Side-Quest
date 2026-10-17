// AI multi-lesson drafting ("four science lessons about the solar system") kept on the server.
//
// Before this, the set of lessons a parent asked for lived only in the Make a Lesson page's memory. Opening one lesson,
// navigating away or refreshing lost the list (the lessons were still saved, but scattered through My Lessons with
// nothing tying them together), and a refresh mid-run stopped the remaining lessons from being written at all.
//
// A batch remembers what was asked for and which lesson each slot produced. Lessons are still written one at a time
// through the normal single-lesson generator (so each is quality-checked and counted individually) and are still
// ordinary rows in `lessons`. Each slot is claimed atomically before it is written, so double clicks, two tabs or a
// refresh can never produce two lessons for the same slot, and a finished slot is never rewritten over a parent's edits.
import * as lb from "./lessonBuilder";
import type { Result } from "./lessonBuilder";
import { draftLessonWithAi, SERIES_MAX } from "./aiDraft";
import type { AiBinding } from "./aiDraft";

type DB = D1Database;

/** A slot that has said "generating" for longer than this was interrupted (the page closed mid-request). */
export const STALE_MS = 6 * 60 * 1000;
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const parse = (v: unknown, d: any) => { try { return v ? JSON.parse(String(v)) : d; } catch { return d; } };

/**
 * What the parent sees for each lesson in the set:
 *  pending    asked for, not written yet (the page was closed before its turn)
 *  generating being written now
 *  failed     could not be written (or writing was interrupted); can be retried on its own
 *  ready      written, waiting for the parent to review
 *  saved      the parent edited it or saved it to the library
 *  assigned   given to a child
 *  archived   the parent archived or deleted the lesson afterwards
 */
export type ItemState = "pending" | "generating" | "failed" | "ready" | "saved" | "assigned" | "archived";

export async function createBatch(
  db: DB,
  opts: { familyId: string; userId: string; body: any },
  now: Date = new Date()
): Promise<Result<{ batch: any }>> {
  const { familyId, userId } = opts;
  const b = opts.body && typeof opts.body === "object" ? opts.body : {};
  const { limits } = await lb.getEntitlement(db, familyId, now);
  if (!limits.aiGeneration) return lb.paywall("AI lesson drafting is part of the paid plan. Your free preview includes the full manual lesson builder.");
  const lessons = (Array.isArray(b.lessons) ? b.lessons : [])
    .map((l: any) => ({ title: clip(l?.title, 150), goal: clip(l?.goal, 300) }))
    .filter((l: any) => l.title);
  if (lessons.length < 2 || lessons.length > SERIES_MAX) return lb.fail(400, `A set of lessons has 2 to ${SERIES_MAX} lessons, each with a title.`);
  const studentId = clip(b.student_id, 80) || null;
  if (studentId) {
    const s = await db.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?").bind(studentId, familyId).first();
    if (!s) return lb.fail(404, "Child not found");
  }
  // The page sends its own id so a double click or a retried request can only ever make one batch.
  const id = typeof b.id === "string" && UUID.test(b.id) ? b.id.toLowerCase() : crypto.randomUUID();
  const existing = await db.prepare("SELECT family_id FROM lesson_batches WHERE id = ?").bind(id).first<any>();
  if (existing) {
    if (existing.family_id !== familyId) return lb.fail(409, "Please try again.");
    return getBatch(db, familyId, id, now);
  }
  const request = { request: clip(b.request, 1200), link_outcomes: b.link_outcomes !== false };
  const ts = now.toISOString();
  await db.batch([
    db.prepare("INSERT INTO lesson_batches (id, family_id, student_id, title, request, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(id, familyId, studentId, clip(b.title, 150) || lessons[0].title, JSON.stringify(request), userId, ts, ts),
    ...lessons.map((l: any, i: number) =>
      db.prepare("INSERT INTO lesson_batch_items (batch_id, idx, family_id, title, goal, status, updated_at) VALUES (?, ?, ?, ?, ?, 'pending', ?)")
        .bind(id, i, familyId, l.title, l.goal, ts)),
  ]);
  return getBatch(db, familyId, id, now);
}

function stateOf(item: any, lesson: any, assigned: { student_id: string; name: string }[], now: Date): ItemState {
  if (item.status === "generating") return now.getTime() - Date.parse(item.updated_at) > STALE_MS ? "failed" : "generating";
  if (item.status === "pending" || item.status === "failed") return item.status;
  if (!lesson || lesson.archived_at) return "archived";
  if (assigned.length) return "assigned";
  if (lesson.status === "ready" || Number(lesson.version) > 1) return "saved";
  return "ready";
}

export async function getBatch(db: DB, familyId: string, id: string, now: Date = new Date()): Promise<Result<{ batch: any }>> {
  const row = await db.prepare("SELECT * FROM lesson_batches WHERE id = ? AND family_id = ?").bind(id, familyId).first<any>();
  if (!row) return lb.fail(404, "That set of lessons was not found.");
  const items = (await db.prepare(
    `SELECT i.idx, i.title AS planned_title, i.goal, i.status AS item_status, i.lesson_id, i.error, i.meta, i.updated_at,
            l.title AS lesson_title, l.status AS lesson_status, l.version, l.archived_at, l.updated_at AS lesson_updated_at, l.data AS lesson_data
       FROM lesson_batch_items i LEFT JOIN lessons l ON l.id = i.lesson_id AND l.family_id = i.family_id
      WHERE i.batch_id = ? AND i.family_id = ? ORDER BY i.idx`
  ).bind(id, familyId).all<any>()).results || [];
  const student = row.student_id ? await db.prepare("SELECT id, name FROM students WHERE id = ? AND family_id = ?").bind(row.student_id, familyId).first<any>() : null;
  const lessonIds = items.map((i: any) => i.lesson_id).filter(Boolean);
  const assigned: Record<string, { student_id: string; name: string }[]> = {};
  if (lessonIds.length) {
    const rows = (await db.prepare(
      `SELECT a.lesson_id, a.student_id, s.name FROM assignments a LEFT JOIN students s ON s.id = a.student_id
        WHERE a.family_id = ? AND a.status != 'revoked' AND a.lesson_id IN (${lessonIds.map(() => "?").join(",")})`
    ).bind(familyId, ...lessonIds).all<any>()).results || [];
    for (const r of rows) {
      const list = (assigned[r.lesson_id] = assigned[r.lesson_id] || []);
      if (!list.some((x) => x.student_id === r.student_id)) list.push({ student_id: r.student_id, name: r.name || "" });
    }
  }
  const out = items.map((i: any) => {
    const lesson = i.lesson_id && i.lesson_status != null ? { status: i.lesson_status, version: i.version, archived_at: i.archived_at } : null;
    const who = (i.lesson_id && assigned[i.lesson_id]) || [];
    const state = stateOf({ status: i.item_status, updated_at: i.updated_at }, lesson, who, now);
    const resources = lesson ? parse(i.lesson_data, {}).resources : null;
    const meta = parse(i.meta, {});
    return {
      index: i.idx, title: i.lesson_title || i.planned_title, planned_title: i.planned_title, goal: i.goal,
      state, lesson_id: lesson ? i.lesson_id : null, lesson_status: i.lesson_status ?? null, assigned_to: who,
      error: state === "failed" ? (i.item_status === "generating" ? "Writing this lesson was interrupted. You can try it again." : i.error || "This lesson could not be written.") : null,
      updated_at: i.lesson_updated_at || i.updated_at,
      // What the review page needs to treat this as a freshly written lesson, wherever the parent opens it from.
      meta: { ...meta, assumptions: { ...(meta.assumptions || {}), ...(student?.name ? { child: student.name } : {}) } },
      videos: Array.isArray(resources) ? resources.filter((r: any) => r?.type === "video").length : 0,
    };
  });
  return { ok: true, batch: { id: row.id, title: row.title, student, created_at: row.created_at, dismissed_at: row.dismissed_at, items: out, counts: countStates(out) } };
}

function countStates(items: { state: ItemState; lesson_status: string | null }[]) {
  const c: Record<ItemState, number> = { pending: 0, generating: 0, failed: 0, ready: 0, saved: 0, assigned: 0, archived: 0 };
  for (const i of items) c[i.state]++;
  // Still a draft the parent has not approved: written but not yet saved to the library or given to a child.
  const awaiting = items.filter((i) => (i.state === "ready" || i.state === "saved") && i.lesson_status === "draft").length;
  return { ...c, total: items.length, awaiting_review: awaiting, unfinished: c.pending + c.generating + c.failed };
}

/** Recent batches with their counts, newest first. `open` keeps only sets that still need the parent. */
export async function listBatches(db: DB, familyId: string, opts: { open?: boolean } = {}, now: Date = new Date()) {
  const rows = (await db.prepare("SELECT id FROM lesson_batches WHERE family_id = ? AND dismissed_at IS NULL ORDER BY created_at DESC LIMIT 30").bind(familyId).all<any>()).results || [];
  const out: any[] = [];
  for (const r of rows) {
    const g = await getBatch(db, familyId, r.id, now);
    if (!g.ok) continue;
    const { items, ...rest } = g.batch;
    const needs = rest.counts.awaiting_review + rest.counts.unfinished > 0;
    if (opts.open && !needs) continue;
    out.push({ ...rest, lessons: items.map((i: any) => ({ index: i.index, title: i.title, state: i.state, lesson_id: i.lesson_id })) });
  }
  const totals = out.reduce((t, b) => ({ awaiting_review: t.awaiting_review + b.counts.awaiting_review, unfinished: t.unfinished + b.counts.unfinished }), { awaiting_review: 0, unfinished: 0 });
  return { batches: out, totals };
}

/** Hide a set from the Parent Hub. Its lessons are untouched and stay in My Lessons. */
export async function dismissBatch(db: DB, familyId: string, id: string, now: Date = new Date()): Promise<Result<{ dismissed: boolean }>> {
  const r = await db.prepare("UPDATE lesson_batches SET dismissed_at = ?, updated_at = ? WHERE id = ? AND family_id = ?").bind(now.toISOString(), now.toISOString(), id, familyId).run();
  if (!r.meta?.changes) return lb.fail(404, "That set of lessons was not found.");
  return { ok: true, dismissed: true };
}

/**
 * Write one lesson of a set. Safe to call again for the same slot:
 *  - already written: returns the existing lesson (no AI call, nothing counted, parent edits untouched);
 *  - being written by another request: 409 IN_PROGRESS;
 *  - pending, failed or interrupted: claims the slot, writes it, and records the result.
 */
export async function draftBatchItem(
  db: DB,
  ai: AiBinding | undefined,
  opts: { familyId: string; userId: string; model?: string; gatewayId?: string; compact?: boolean; fastPipeline?: boolean; batchId: string; index: number },
  now: Date = new Date()
): Promise<Result<{ lesson: any; reused: boolean; [k: string]: any }>> {
  const { familyId, batchId, index } = opts;
  const batch = await db.prepare("SELECT * FROM lesson_batches WHERE id = ? AND family_id = ?").bind(batchId, familyId).first<any>();
  if (!batch) return lb.fail(404, "That set of lessons was not found.");
  const items = (await db.prepare("SELECT * FROM lesson_batch_items WHERE batch_id = ? AND family_id = ? ORDER BY idx").bind(batchId, familyId).all<any>()).results || [];
  const item = items.find((i: any) => i.idx === index);
  if (!item) return lb.fail(404, "That lesson is not part of this set.");
  if (item.status === "done" && item.lesson_id) {
    const row = await db.prepare("SELECT * FROM lessons WHERE id = ? AND family_id = ?").bind(item.lesson_id, familyId).first<any>();
    if (row) return { ok: true, lesson: lb.lessonOut(row), reused: true };
    return lb.fail(409, "This lesson was deleted from your library.", "LESSON_REMOVED");
  }
  const ts = now.toISOString();
  const stale = new Date(now.getTime() - STALE_MS).toISOString();
  const claim = await db.prepare(
    "UPDATE lesson_batch_items SET status = 'generating', error = NULL, updated_at = ? WHERE batch_id = ? AND idx = ? AND family_id = ? AND (status IN ('pending','failed') OR (status = 'generating' AND updated_at < ?))"
  ).bind(ts, batchId, index, familyId, stale).run();
  if (!claim.meta?.changes) return lb.fail(409, "This lesson is already being written. It will appear here when it is ready.", "IN_PROGRESS");

  const req = parse(batch.request, {});
  const r = await draftLessonWithAi(db, ai, {
    familyId, userId: opts.userId, model: opts.model, gatewayId: opts.gatewayId, compact: opts.compact, fastPipeline: opts.fastPipeline,
    request: {
      request: req.request, student_id: batch.student_id || undefined, link_outcomes: req.link_outcomes !== false,
      series: { index, titles: items.map((i: any) => i.title), goals: items.map((i: any) => i.goal) },
    } as any,
  }, now);
  if (!r.ok) {
    await db.prepare("UPDATE lesson_batch_items SET status = 'failed', error = ?, updated_at = ? WHERE batch_id = ? AND idx = ?").bind(clip(r.detail, 500), ts, batchId, index).run();
    return r;
  }
  await db.batch([
    db.prepare("UPDATE lesson_batch_items SET status = 'done', lesson_id = ?, error = NULL, meta = ?, updated_at = ? WHERE batch_id = ? AND idx = ?")
      .bind(r.lesson.id, JSON.stringify({ assumptions: r.assumptions || {}, warnings: (r.warnings || []).slice(0, 20), generation: r.generation || null }), ts, batchId, index),
    db.prepare("UPDATE lesson_batches SET updated_at = ? WHERE id = ?").bind(ts, batchId),
  ]);
  return { ...r, reused: false };
}
