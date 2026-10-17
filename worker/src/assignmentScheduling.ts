/**
 * Move one learning assignment without detaching it from its calendar session.
 * Completed work is untouched; a timetable slot remains available when emptied.
 */
import * as lb from "./lessonBuilder";
import type { Result } from "./lessonBuilder";
import { calendarConflict } from "./calendarIntegrity";
import { listSlots, sameSubject } from "./timetable";

type DB = D1Database;
const validDate = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v + "T12:00:00Z"));
const isSlot = (r: any) => r?.event_type === "timetable" ||
  (r?.event_type === "lesson" && String(r.notes || "").startsWith("Suggested by Side-Quest"));

export async function moveAssignmentDay(db: DB, familyId: string, id: string, requested: unknown): Promise<Result<{}>> {
  const date = requested === null || requested === "" ? null : requested;
  if (date !== null && !validDate(date)) return lb.fail(400, "Choose a valid date.");
  const assignment = await db.prepare("SELECT * FROM assignments WHERE id = ? AND family_id = ?")
    .bind(id, familyId).first<any>();
  if (!assignment) return lb.fail(404, "Assignment not found");
  if (assignment.status === "revoked" || assignment.status === "submitted" || lb.DONE_STATUSES.includes(assignment.status))
    return lb.fail(409, "Submitted and completed lessons cannot be moved.", "ALREADY_DONE");

  const rows = (await db.prepare("SELECT * FROM calendar_events WHERE family_id = ? AND linked_assignment_id = ? ORDER BY date, start_time LIMIT 3")
    .bind(familyId, id).all<any>()).results || [];
  if (rows.length > 1)
    return lb.fail(409, "This lesson spans more than one session. Move individual sessions in the calendar.", "MULTIPLE_SESSIONS");
  const current = rows[0] || null;
  if (current?.status === "done") return lb.fail(409, "This session is already complete.", "ALREADY_DONE");

  const { limits } = await lb.getEntitlement(db, familyId);
  if (!limits.timetable && current) return lb.paywall("Moving linked calendar lessons requires Family Membership.");
  const timestamp = new Date().toISOString();
  const updateDate = (value: string | null) => db.prepare(
    "UPDATE assignments SET scheduled_date = ?, updated_at = ? WHERE id = ? AND family_id = ?"
  ).bind(value, timestamp, id, familyId);
  // Make a competing assignment status change abort the entire D1 batch.
  // char(36) supplies the SQLite root JSON path without a template escape.
  const assertActive = () => db.prepare(
    "SELECT CASE WHEN EXISTS (SELECT 1 FROM assignments WHERE id = ? AND family_id = ? AND status NOT IN ('submitted','accepted','completed','demonstrated','revoked')) THEN 1 ELSE json_extract('STALE_ASSIGNMENT',char(36)) END"
  ).bind(id, familyId);
  const assertCurrent = (r: any) => db.prepare(
    "SELECT CASE WHEN EXISTS (SELECT 1 FROM calendar_events WHERE id = ? AND family_id = ? AND linked_assignment_id = ? AND date = ?) THEN 1 ELSE json_extract('STALE_SCHEDULE',char(36)) END"
  ).bind(r.id, familyId, id, r.date);

  if (!date) {
    if (!current) {
      await updateDate(null).run();
      return { ok: true };
    }
    const clear = isSlot(current)
      ? db.prepare("UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?").bind(current.id, familyId, id)
      : db.prepare("DELETE FROM calendar_events WHERE id = ? AND family_id = ? AND linked_assignment_id = ?").bind(current.id, familyId, id);
    try { await db.batch([assertActive(), assertCurrent(current), clear, updateDate(null)]); }
    catch (error) {
      if (/malformed JSON|STALE_/i.test(String(error))) return lb.fail(409, "The schedule changed. Refresh and try again.", "PLAN_CHANGED");
      throw error;
    }
    return { ok: true };
  }
  if (current?.date === date) {
    await updateDate(date).run();
    return { ok: true };
  }
  const restDay = await db.prepare(
    "SELECT id FROM calendar_events WHERE family_id = ? AND date = ? AND event_type = 'holiday' AND (student_id IS NULL OR student_id = ?) LIMIT 1"
  ).bind(familyId, date, assignment.student_id).first();
  if (restDay) return lb.fail(409, "That day is a holiday or rest day.", "TIME_CONFLICT");
  if (!current && !limits.timetable) {
    await updateDate(date).run();
    return { ok: true };
  }

  const statements: D1PreparedStatement[] = [assertActive()];
  if (current) statements.push(assertCurrent(current));
  if (current && !isSlot(current)) {
    const conflict = await calendarConflict(db, familyId, { ...current, date });
    if (conflict) return lb.fail(conflict.code === "INVALID_TIME" ? 400 : 409, conflict.detail, conflict.code);
    statements.push(db.prepare(
      "UPDATE calendar_events SET date = ? WHERE id = ? AND family_id = ? AND linked_assignment_id = ?"
    ).bind(date, current.id, familyId, id));
  } else {
    const lesson = await db.prepare("SELECT title, learning_area, stage FROM lessons WHERE id = ? AND family_id = ?")
      .bind(assignment.lesson_id, familyId).first<any>();
    const child = await db.prepare("SELECT stage FROM students WHERE id = ? AND family_id = ?")
      .bind(assignment.student_id, familyId).first<any>();
    if (!lesson || !child) return lb.fail(404, "Lesson or child not found");
    const open = await listSlots(db, familyId, { student_id: assignment.student_id, from: date, to: date, open: true });
    let target: any = null;
    for (const slot of open) {
      if (!sameSubject(slot.title, String(lesson.learning_area || ""), String(child.stage || lesson.stage || ""))) continue;
      if (current && Number(slot.duration_minutes || 0) < Number(current.duration_minutes || 0)) continue;
      if (await calendarConflict(db, familyId, { ...slot, id: slot.id })) continue;
      target = slot;
      break;
    }
    if (current) statements.push(db.prepare(
      "UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?"
    ).bind(current.id, familyId, id));
    if (target) {
      statements.push(db.prepare(
        "SELECT CASE WHEN EXISTS (SELECT 1 FROM calendar_events WHERE id = ? AND family_id = ? AND student_id = ? AND date = ? AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL) THEN 1 ELSE json_extract('SLOT_TAKEN',char(36)) END"
      ).bind(target.id, familyId, assignment.student_id, target.date));
      statements.push(db.prepare(
        "UPDATE calendar_events SET linked_assignment_id = ?, linked_lesson_id = ? WHERE id = ? AND family_id = ? AND student_id = ? AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL"
      ).bind(id, assignment.lesson_id, target.id, familyId, assignment.student_id));
    } else {
      statements.push(db.prepare(
        "INSERT INTO calendar_events (id, family_id, student_id, title, date, start_time, duration_minutes, event_type, linked_lesson_id, linked_assignment_id, notes, created_at) VALUES (?, ?, ?, ?, ?, NULL, ?, 'lesson', ?, ?, ?, ?)"
      ).bind(crypto.randomUUID(), familyId, assignment.student_id, lesson.title, date,
        Number(current?.duration_minutes) || 45, assignment.lesson_id, id,
        "Moved by parent - choose a time if needed.", timestamp));
    }
  }
  statements.push(updateDate(date));
  try {
    await db.batch(statements);
  } catch (error) {
    if (/malformed JSON|STALE_|SLOT_TAKEN/i.test(String(error)))
      return lb.fail(409, "A calendar slot changed while moving this lesson. Refresh and try again.", "PLAN_CHANGED");
    throw error;
  }
  return { ok: true };
}
