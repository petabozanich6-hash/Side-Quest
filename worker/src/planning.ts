// Assignment management (move, reassign, cancel) and parent-added evidence notes.
// DB-agnostic plain functions so they can be tested; the family id always comes from the authenticated user.
import * as lb from "./lessonBuilder";
import type { Result } from "./lessonBuilder";
import { safely, evidenceNoteDeleted } from "./outcomeTracker";
import { SLOT_SQL, emptySlotsFor } from "./timetable";

type DB = D1Database;
const { fail } = lb;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SUPPORT = ["green", "amber", "red"];
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const validDate = (v: unknown) => typeof v === "string" && DATE.test(v) && !Number.isNaN(Date.parse(v));

async function ownAssignment(db: DB, familyId: string, id: string) {
  return db.prepare("SELECT * FROM assignments WHERE id = ? AND family_id = ?").bind(id, familyId).first<any>();
}
async function hasProgress(db: DB, a: any): Promise<boolean> {
  const s = await db.prepare("SELECT COUNT(*) n FROM submissions WHERE assignment_id = ?").bind(a.id).first<{ n: number }>();
  return Number(s?.n ?? 0) > 0 || !!a.draft || a.status !== "not_started";
}

/** Change dates, notes or support level. Allowed on any unfinished assignment. */
export async function updateAssignment(db: DB, familyId: string, id: string, input: any): Promise<Result<{ assignment: any }>> {
  const a = await ownAssignment(db, familyId, id);
  if (!a) return fail(404, "Assignment not found");
  if (lb.DONE_STATUSES.includes(a.status)) return fail(409, "This lesson is finished, so it can't be changed.", "ALREADY_DONE");
  const sets: string[] = [];
  const b: unknown[] = [];
  for (const k of ["due_date", "scheduled_date"] as const) {
    if (k in (input || {})) {
      const v = input[k];
      if (v !== null && v !== "" && !validDate(v)) return fail(400, "Dates must look like 2026-10-31.");
      sets.push(`${k} = ?`); b.push(v || null);
    }
  }
  if ("parent_notes" in (input || {})) { sets.push("parent_notes = ?"); b.push(clip(input.parent_notes, 2000) || null); }
  if ("support_level" in (input || {})) {
    if (!SUPPORT.includes(input.support_level)) return fail(400, "Unknown support level.");
    sets.push("support_level = ?"); b.push(input.support_level);
  }
  if (!sets.length) return fail(400, "Nothing to change.");
  await db.prepare(`UPDATE assignments SET ${sets.join(", ")} WHERE id = ? AND family_id = ?`).bind(...b, id, familyId).run();
  return { ok: true, assignment: await ownAssignment(db, familyId, id).then((r: any) => { delete r.lesson_snapshot; delete r.draft; return r; }) };
}

/** Give a not-yet-started assignment to a different child. */
export async function reassignAssignment(db: DB, familyId: string, id: string, studentId: unknown): Promise<Result<{ assignment: any }>> {
  const a = await ownAssignment(db, familyId, id);
  if (!a) return fail(404, "Assignment not found");
  if (await hasProgress(db, a)) return fail(409, "This child has already started it, so it can't be moved to someone else. Assign it to the other child instead.", "STARTED");
  const s = await db.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?").bind(String(studentId ?? ""), familyId).first();
  if (!s) return fail(404, "Child not found");
  if (a.student_id === s.id) return fail(400, "That child already has it.");
  const prior = await lb.priorAssignment(db, familyId, String(s.id), a.lesson_id);
  if (prior === "open") return fail(409, "That child already has this lesson assigned.", "ALREADY_ASSIGNED");
  if (prior === "done") return fail(409, "That child has already finished this lesson.", "ALREADY_COMPLETED");
  await db.prepare("UPDATE assignments SET student_id = ? WHERE id = ? AND family_id = ?").bind(s.id, id, familyId).run();
  // Timetable slots belong to the first child's timetable: empty them. Other planner entries move with the lesson.
  await emptySlotsFor(db, familyId, id);
  await db.prepare(`UPDATE calendar_events SET student_id = ? WHERE linked_assignment_id = ? AND family_id = ? AND NOT ${SLOT_SQL}`).bind(s.id, id, familyId).run();
  return { ok: true, assignment: await ownAssignment(db, familyId, id).then((r: any) => { delete r.lesson_snapshot; delete r.draft; return r; }) };
}

/** Remove a not-yet-started assignment (and its planner entries). Started work is never deleted. */
export async function cancelAssignment(db: DB, familyId: string, id: string): Promise<Result<{}>> {
  const a = await ownAssignment(db, familyId, id);
  if (!a) return fail(404, "Assignment not found");
  if (await hasProgress(db, a)) return fail(409, "This child has already started it. Their work is kept, so it can't be cancelled.", "STARTED");
  // Timetable slots are emptied, never deleted; other planner entries for this lesson go.
  await emptySlotsFor(db, familyId, id);
  await db.prepare(`DELETE FROM calendar_events WHERE linked_assignment_id = ? AND family_id = ? AND NOT ${SLOT_SQL}`).bind(id, familyId).run();
  await db.prepare("DELETE FROM assignments WHERE id = ? AND family_id = ?").bind(id, familyId).run();
  return { ok: true };
}

// ---------------------------------------------------------------- evidence notes (not tied to a lesson)

export async function createEvidenceNote(db: DB, familyId: string, input: any, now: Date = new Date()): Promise<Result<{ note: any }>> {
  const title = clip(input?.title, 200);
  if (!title) return fail(400, "Give this evidence a title.");
  const occurred = input?.occurred_on || now.toISOString().slice(0, 10);
  if (!validDate(occurred)) return fail(400, "Dates must look like 2026-10-31.");
  const s = await db.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?").bind(String(input?.student_id ?? ""), familyId).first();
  if (!s) return fail(404, "Child not found");
  const { limits } = await lb.getEntitlement(db, familyId, now);
  if (!limits.canCreate) return lb.paywall("Your free preview has ended. Your evidence is kept; upgrade to add more.");
  const fileIds = (Array.isArray(input?.file_ids) ? input.file_ids : []).filter((x: unknown) => typeof x === "string").slice(0, 10);
  const bad = await lb.checkFiles(db, familyId, fileIds);
  if (bad) return bad;
  const id = crypto.randomUUID();
  await db.prepare("INSERT INTO evidence_notes (id, family_id, student_id, title, learning_area, notes, occurred_on, file_ids, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(id, familyId, s.id, title, clip(input?.learning_area, 80) || null, clip(input?.notes, 5000) || null, occurred, JSON.stringify(fileIds), now.toISOString()).run();
  return { ok: true, note: await db.prepare("SELECT * FROM evidence_notes WHERE id = ?").bind(id).first() };
}

export async function listEvidenceNotes(db: DB, familyId: string, o: { student_id?: string; q?: string; from?: string; to?: string } = {}) {
  let sql = "SELECT * FROM evidence_notes WHERE family_id = ?";
  const b: unknown[] = [familyId];
  if (o.student_id) { sql += " AND student_id = ?"; b.push(o.student_id); }
  if (o.from && validDate(o.from)) { sql += " AND occurred_on >= ?"; b.push(o.from); }
  if (o.to && validDate(o.to)) { sql += " AND occurred_on <= ?"; b.push(o.to); }
  if (o.q) { const like = `%${o.q.replace(/[%_]/g, "").slice(0, 80)}%`; sql += " AND (title LIKE ? OR notes LIKE ? OR learning_area LIKE ?)"; b.push(like, like, like); }
  sql += " ORDER BY occurred_on DESC, created_at DESC LIMIT 500";
  const { results } = await db.prepare(sql).bind(...b).all<any>();
  return results.map((r: any) => ({ ...r, file_ids: (() => { try { return JSON.parse(r.file_ids); } catch { return []; } })() }));
}

export async function deleteEvidenceNote(db: DB, familyId: string, id: string): Promise<Result<{}>> {
  const r = await db.prepare("DELETE FROM evidence_notes WHERE id = ? AND family_id = ?").bind(id, familyId).run();
  if (!r.meta.changes) return fail(404, "Evidence not found");
  await safely("evidence note deleted", () => evidenceNoteDeleted(db, familyId, id));
  return { ok: true };
}
