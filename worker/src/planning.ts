// Assignment management (move, reassign, cancel) and parent-added evidence notes.
// DB-agnostic plain functions so they can be tested; the family id always comes from the authenticated user.
import * as lb from "./lessonBuilder";
import type { Result } from "./lessonBuilder";
import { safely, evidenceNoteDeleted } from "./outcomeTracker";
import { SLOT_SQL, emptySlotsFor, listSlots, sameSubject } from "./timetable";
import { calendarConflict, syncAssignmentDate } from "./calendarIntegrity";

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

/** Reschedule the real calendar entry, not just the date label on the assignment.
 * Timetable slots remain in place. A different free subject slot is used where
 * available; otherwise a flexible event is made on the requested day.
 * Multi-session work requires editing its individual days instead.
 */
export async function moveAssignmentDay(db: DB, familyId: string, id: string, requested: unknown): Promise<Result<{}>> {
  const a = await ownAssignment(db, familyId, id);
  if (!a) return fail(404, "Assignment not found");
  if (a.status === "revoked" || lb.DONE_STATUSES.includes(a.status) || a.status === "submitted")
    return fail(409, "Completed or submitted lessons cannot be rescheduled.", "ALREADY_DONE");
  const date: string | null = requested === null || requested === "" ? null : typeof requested === "string" ? requested : "";
  if (date !== null && !validDate(date)) return fail(400, "Choose a valid date.");
  const linked = (await db.prepare(`SELECT * FROM calendar_events WHERE family_id = ? AND linked_assignment_id = ?
    ORDER BY date ASC, start_time ASC LIMIT 5`).bind(familyId, id).all<any>()).results || [];
  if (linked.length > 1) return fail(409, "This lesson has multiple sessions. Open the calendar to move each session.", "MULTIPLE_SESSIONS");
  const before = linked[0] || null;
  const { limits } = await lb.getEntitlement(db, familyId);
  if (!limits.timetable && before)
    return lb.paywall("Rescheduling a linked calendar lesson needs Family Membership. Your existing work is safe.");
  if (before?.status === "done") return fail(409, "This calendar session is marked complete and cannot be moved.", "ALREADY_DONE");
  const now = new Date().toISOString();
  const verify = (source: any) => db.prepare(`SELECT CASE WHEN EXISTS (
    SELECT 1 FROM calendar_events WHERE id = ? AND family_id = ? AND linked_assignment_id = ?
  ) THEN 1 ELSE json_extract('STALE_SCHEDULE', '
export async function updateAssignment(db: DB, familyId: string, id: string, input: any): Promise<Result<{ assignment: any }>> {
  const a = await ownAssignment(db, familyId, id);
  if (!a) return fail(404, "Assignment not found");
  if (a.status === "revoked") return fail(409, "This assignment has been revoked.", "REVOKED");
  if (lb.DONE_STATUSES.includes(a.status)) return fail(409, "This lesson is finished, so it can't be changed.", "ALREADY_DONE");
  // Validate everything before moving the calendar so an invalid due date
  // cannot leave a partial update.
  if ("due_date" in (input || {})) {
    const due = input.due_date;
    if (due !== null && due !== "" && !validDate(due)) return fail(400, "Dates must look like 2026-10-31.");
  }
  const sets: string[] = [];
  const b: unknown[] = [];
  if ("scheduled_date" in (input || {})) {
    const changed = await moveAssignmentDay(db, familyId, id, input.scheduled_date);
    if (!changed.ok) return changed;
  }
  for (const k of ["due_date"] as const) {
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
  if (!sets.length && !("scheduled_date" in (input || {}))) return fail(400, "Nothing to change.");
  if (sets.length) await db.prepare(`UPDATE assignments SET ${sets.join(", ")} WHERE id = ? AND family_id = ?`).bind(...b, id, familyId).run();
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

/** Revoke without deleting the lesson, drafts, submissions, quiz results or evidence. */
export async function cancelAssignment(db: DB, familyId: string, id: string): Promise<Result<{}>> {
  const a = await ownAssignment(db, familyId, id);
  if (!a) return fail(404, "Assignment not found");
  if (lb.DONE_STATUSES.includes(a.status)) return fail(409, "Completed work stays in your child's history.", "ALREADY_DONE");
  // Keep this conditional inside the same transaction as planner cleanup: a concurrent review wins safely.
  const active = "status NOT IN ('accepted','completed','demonstrated','revoked')";
  const revoked = "EXISTS (SELECT 1 FROM assignments WHERE id = ? AND family_id = ? AND status = 'revoked')";
  await db.batch([
    db.prepare(`UPDATE assignments SET status = 'revoked', updated_at = ? WHERE id = ? AND family_id = ? AND ${active}`)
      .bind(new Date().toISOString(), id, familyId),
    db.prepare(`UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE linked_assignment_id = ? AND family_id = ? AND ${SLOT_SQL} AND status = 'scheduled' AND ${revoked}`)
      .bind(id, familyId, id, familyId),
    db.prepare(`DELETE FROM calendar_events WHERE linked_assignment_id = ? AND family_id = ? AND NOT COALESCE(${SLOT_SQL}, 0) AND status = 'scheduled' AND ${revoked}`)
      .bind(id, familyId, id, familyId),
  ]);
  const current = await ownAssignment(db, familyId, id);
  return current?.status === "revoked" ? { ok: true } : fail(409, "This assignment has just been completed. Refresh to see its history.", "ALREADY_DONE");
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
) END AS valid`).bind(source.id, familyId, id);
  if (!date) {
    if (before) {
      if (before.event_type === "timetable" ||
          (before.event_type === "lesson" && String(before.notes || "").startsWith("Suggested by Side-Quest"))) {
        await db.batch([verify(before),
          db.prepare("UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?").bind(before.id, familyId, id),
          db.prepare("UPDATE assignments SET scheduled_date = NULL, updated_at = ? WHERE id = ? AND family_id = ?").bind(now, id, familyId)]);
      } else {
        await db.batch([verify(before),
          db.prepare("DELETE FROM calendar_events WHERE id = ? AND family_id = ? AND linked_assignment_id = ?").bind(before.id, familyId, id),
          db.prepare("UPDATE assignments SET scheduled_date = NULL, updated_at = ? WHERE id = ? AND family_id = ?").bind(now, id, familyId)]);
      }
    } else {
      await db.prepare("UPDATE assignments SET scheduled_date = NULL, updated_at = ? WHERE id = ? AND family_id = ?").bind(now, id, familyId).run();
    }
    return { ok: true };
  }
  if (before?.date === date) {
    await syncAssignmentDate(db, familyId, id);
    return { ok: true };
  }
  const holidays = await db.prepare(`SELECT title FROM calendar_events WHERE family_id = ? AND date = ? AND event_type = 'holiday'
    AND (student_id = ? OR student_id IS NULL) LIMIT 1`).bind(familyId, date, a.student_id).first<any>();
  if (holidays) return fail(409, "That day is marked as a holiday or rest day. Choose another day or change the calendar first.", "TIME_CONFLICT");
  const lesson = await db.prepare("SELECT title, learning_area, stage, data FROM lessons WHERE id = ? AND family_id = ?")
    .bind(a.lesson_id, familyId).first<any>();
  if (!lesson) return fail(404, "Lesson not found");
  const student = await db.prepare("SELECT stage FROM students WHERE id = ? AND family_id = ?")
    .bind(a.student_id, familyId).first<any>();
  if (!student) return fail(404, "Child not found");
  const isSlot = before && (before.event_type === "timetable" ||
    (before.event_type === "lesson" && String(before.notes || "").startsWith("Suggested by Side-Quest")));
  const statements: D1PreparedStatement[] = [];
  if (before) statements.push(verify(before));
  if (isSlot || !before) {
    // Only paid plans can create new timetable-backed events. A preview can
    // still keep a date on its original manual assignment without new slots.
    if (!limits.timetable && !before) {
      await db.prepare("UPDATE assignments SET scheduled_date = ?, updated_at = ? WHERE id = ? AND family_id = ?")
        .bind(date, now, id, familyId).run();
      return { ok: true };
    }
    const available = limits.timetable
      ? await listSlots(db, familyId, { student_id: a.student_id, from: date, to: date, open: true }) : [];
    let target: any = null;
    for (const candidate of available) {
      if (!sameSubject(candidate.title, String(lesson.learning_area || ""), String(student.stage || lesson.stage || ""))) continue;
      if (before && Number(candidate.duration_minutes || 0) < Number(before.duration_minutes || 0)) continue;
      if (await calendarConflict(db, familyId, { ...candidate, date, student_id: a.student_id, event_type: "timetable" })) continue;
      target = candidate; break;
    }
    if (before) {
      if (isSlot) statements.push(db.prepare(`UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL
        WHERE id = ? AND family_id = ? AND linked_assignment_id = ?`).bind(before.id, familyId, id));
      else statements.push(db.prepare("DELETE FROM calendar_events WHERE id = ? AND family_id = ? AND linked_assignment_id = ?").bind(before.id, familyId, id));
    }
    if (target) {
      statements.push(db.prepare(`SELECT CASE WHEN EXISTS (
        SELECT 1 FROM calendar_events WHERE id = ? AND family_id = ? AND student_id = ?
        AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL
      ) THEN 1 ELSE json_extract('SLOT_TAKEN', '
export async function updateAssignment(db: DB, familyId: string, id: string, input: any): Promise<Result<{ assignment: any }>> {
  const a = await ownAssignment(db, familyId, id);
  if (!a) return fail(404, "Assignment not found");
  if (a.status === "revoked") return fail(409, "This assignment has been revoked.", "REVOKED");
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

/** Revoke without deleting the lesson, drafts, submissions, quiz results or evidence. */
export async function cancelAssignment(db: DB, familyId: string, id: string): Promise<Result<{}>> {
  const a = await ownAssignment(db, familyId, id);
  if (!a) return fail(404, "Assignment not found");
  if (lb.DONE_STATUSES.includes(a.status)) return fail(409, "Completed work stays in your child's history.", "ALREADY_DONE");
  // Keep this conditional inside the same transaction as planner cleanup: a concurrent review wins safely.
  const active = "status NOT IN ('accepted','completed','demonstrated','revoked')";
  const revoked = "EXISTS (SELECT 1 FROM assignments WHERE id = ? AND family_id = ? AND status = 'revoked')";
  await db.batch([
    db.prepare(`UPDATE assignments SET status = 'revoked', updated_at = ? WHERE id = ? AND family_id = ? AND ${active}`)
      .bind(new Date().toISOString(), id, familyId),
    db.prepare(`UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE linked_assignment_id = ? AND family_id = ? AND ${SLOT_SQL} AND status = 'scheduled' AND ${revoked}`)
      .bind(id, familyId, id, familyId),
    db.prepare(`DELETE FROM calendar_events WHERE linked_assignment_id = ? AND family_id = ? AND NOT COALESCE(${SLOT_SQL}, 0) AND status = 'scheduled' AND ${revoked}`)
      .bind(id, familyId, id, familyId),
  ]);
  const current = await ownAssignment(db, familyId, id);
  return current?.status === "revoked" ? { ok: true } : fail(409, "This assignment has just been completed. Refresh to see its history.", "ALREADY_DONE");
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
) END AS valid`).bind(target.id, familyId, a.student_id));
      statements.push(db.prepare(`UPDATE calendar_events SET linked_assignment_id = ?, linked_lesson_id = ?
        WHERE id = ? AND family_id = ? AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL`)
        .bind(id, a.lesson_id, target.id, familyId));
    } else {
      // A flexible entry is preferable to silently choosing a new time or
      // overlooking an already-booked subject slot on the requested day.
      statements.push(db.prepare(`INSERT INTO calendar_events
        (id, family_id, student_id, title, date, start_time, duration_minutes, event_type,
         linked_lesson_id, linked_assignment_id, notes, created_at)
         VALUES (?, ?, ?, ?, ?, NULL, ?, 'lesson', ?, ?, ?, ?)`)
        .bind(crypto.randomUUID(), familyId, a.student_id, lesson.title, date,
          before?.duration_minutes || 45, a.lesson_id, id, "Rescheduled by parent; choose a time if needed.", now));
    }
  } else if (before) {
    const conflict = await calendarConflict(db, familyId, { ...before, date });
    if (conflict) return fail(conflict.code === "INVALID_TIME" ? 400 : 409, conflict.detail, conflict.code);
    statements.push(db.prepare("UPDATE calendar_events SET date = ? WHERE id = ? AND family_id = ? AND linked_assignment_id = ?")
      .bind(date, before.id, familyId, id));
  }
  statements.push(db.prepare("UPDATE assignments SET scheduled_date = ?, updated_at = ? WHERE id = ? AND family_id = ?")
    .bind(date, now, id, familyId));
  try { await db.batch(statements); }
  catch (error) {
    if (/STALE_SCHEDULE|SLOT_TAKEN|malformed JSON/i.test(String(error)))
      return fail(409, "The calendar changed while you were moving this lesson. Refresh and try again.", "PLAN_CHANGED");
    throw error;
  }
  return { ok: true };
}

/** Change dates, notes or support level. Allowed on any unfinished assignment. */
export async function updateAssignment(db: DB, familyId: string, id: string, input: any): Promise<Result<{ assignment: any }>> {
  const a = await ownAssignment(db, familyId, id);
  if (!a) return fail(404, "Assignment not found");
  if (a.status === "revoked") return fail(409, "This assignment has been revoked.", "REVOKED");
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

/** Revoke without deleting the lesson, drafts, submissions, quiz results or evidence. */
export async function cancelAssignment(db: DB, familyId: string, id: string): Promise<Result<{}>> {
  const a = await ownAssignment(db, familyId, id);
  if (!a) return fail(404, "Assignment not found");
  if (lb.DONE_STATUSES.includes(a.status)) return fail(409, "Completed work stays in your child's history.", "ALREADY_DONE");
  // Keep this conditional inside the same transaction as planner cleanup: a concurrent review wins safely.
  const active = "status NOT IN ('accepted','completed','demonstrated','revoked')";
  const revoked = "EXISTS (SELECT 1 FROM assignments WHERE id = ? AND family_id = ? AND status = 'revoked')";
  await db.batch([
    db.prepare(`UPDATE assignments SET status = 'revoked', updated_at = ? WHERE id = ? AND family_id = ? AND ${active}`)
      .bind(new Date().toISOString(), id, familyId),
    db.prepare(`UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE linked_assignment_id = ? AND family_id = ? AND ${SLOT_SQL} AND status = 'scheduled' AND ${revoked}`)
      .bind(id, familyId, id, familyId),
    db.prepare(`DELETE FROM calendar_events WHERE linked_assignment_id = ? AND family_id = ? AND NOT COALESCE(${SLOT_SQL}, 0) AND status = 'scheduled' AND ${revoked}`)
      .bind(id, familyId, id, familyId),
  ]);
  const current = await ownAssignment(db, familyId, id);
  return current?.status === "revoked" ? { ok: true } : fail(409, "This assignment has just been completed. Refresh to see its history.", "ALREADY_DONE");
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
