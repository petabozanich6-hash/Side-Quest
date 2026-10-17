/**
 * One place for changing the day of a real assignment. Never change only
 * assignments.scheduled_date when a linked calendar session exists.
 * Completed work and timetable templates are preserved.
 */
import * as lb from "./lessonBuilder";
import type { Result } from "./lessonBuilder";
import { calendarConflict } from "./calendarIntegrity";
import { listSlots, sameSubject } from "./timetable";

type DB = D1Database;
const validDate = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + "T12:00:00Z"));
const isSlot = (row: any) => row?.event_type === "timetable" ||
  (row?.event_type === "lesson" && String(row.notes || "").startsWith("Suggested by Side-Quest"));

/** Moves a single session, or clears the date. Multi-session lessons are edited on the calendar. */
export async function moveAssignmentDay(
  db: DB, familyId: string, assignmentId: string, requested: unknown
): Promise<Result<{}>> {
  const date = requested === null || requested === "" ? null : requested;
  if (date !== null && !validDate(date)) return lb.fail(400, "Choose a valid scheduled date.");
  const a = await db.prepare("SELECT * FROM assignments WHERE id = ? AND family_id = ?")
    .bind(assignmentId, familyId).first<any>();
  if (!a) return lb.fail(404, "Assignment not found");
  if (a.status === "revoked" || a.status === "submitted" || lb.DONE_STATUSES.includes(a.status))
    return lb.fail(409, "Submitted or completed work cannot be moved.", "ALREADY_DONE");
  const linked = (await db.prepare(
    "SELECT * FROM calendar_events WHERE family_id = ? AND linked_assignment_id = ? ORDER BY date, start_time LIMIT 3"
  ).bind(familyId, assignmentId).all<any>()).results || [];
  if (linked.length > 1)
    return lb.fail(409, "This lesson uses multiple sessions. Move each session in the calendar.", "MULTIPLE_SESSIONS");
  const original = linked[0] || null;
  if (original?.status === "done") return lb.fail(409, "This calendar session is marked complete.", "ALREADY_DONE");
  const { limits } = await lb.getEntitlement(db, familyId);
  // A free-preview assignment with no linked calendar event may still change its day.
  if (!limits.timetable && original)
    return lb.paywall("Moving scheduled calendar lessons is part of Family Membership.");
  const now = new Date().toISOString();
  const verifyAssignment = () => db.prepare(
    "SELECT CASE WHEN EXISTS (SELECT 1 FROM assignments WHERE id = ? AND family_id = ? AND status NOT IN ('submitted','accepted','completed','demonstrated','revoked')) THEN 1 ELSE json_extract('STALE_ASSIGNMENT', ' (value: string | null) => db.prepare(
    "UPDATE assignments SET scheduled_date = ?, updated_at = ? WHERE id = ? AND family_id = ?"
  ).bind(value, now, assignmentId, familyId);
  if (!date) {
    if (!original) {
      await setDate(null).run();
      return { ok: true };
    }
    const unlink = isSlot(original)
      ? db.prepare("UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?")
        .bind(original.id, familyId, assignmentId)
      : db.prepare("DELETE FROM calendar_events WHERE id = ? AND family_id = ? AND linked_assignment_id = ?")
        .bind(original.id, familyId, assignmentId);
    await db.batch([verifyAssignment(), verifyOriginal(original), unlink, setDate(null)]);
    return { ok: true };
  }
  if (original?.date === date) {
    await setDate(date).run();
    return { ok: true };
  }
  const holiday = await db.prepare(
    "SELECT id FROM calendar_events WHERE family_id = ? AND date = ? AND event_type = 'holiday' AND (student_id IS NULL OR student_id = ?) LIMIT 1"
  ).bind(familyId, date, a.student_id).first();
  if (holiday) return lb.fail(409, "That is a holiday or rest day. Choose another day.", "TIME_CONFLICT");
  if (!original && !limits.timetable) {
    await setDate(date).run();
    return { ok: true };
  }
  const statements: D1PreparedStatement[] = [verifyAssignment()];
  if (original) statements.push(verifyOriginal(original));
  if (original && !isSlot(original)) {
    const conflict = await calendarConflict(db, familyId, { ...original, date });
    if (conflict) return lb.fail(conflict.code === "INVALID_TIME" ? 400 : 409, conflict.detail, conflict.code);
    statements.push(db.prepare(
      "UPDATE calendar_events SET date = ? WHERE id = ? AND family_id = ? AND linked_assignment_id = ?"
    ).bind(date, original.id, familyId, assignmentId));
  } else {
    const lesson = await db.prepare("SELECT title, learning_area, stage FROM lessons WHERE id = ? AND family_id = ?")
      .bind(a.lesson_id, familyId).first<any>();
    const child = await db.prepare("SELECT stage FROM students WHERE id = ? AND family_id = ?")
      .bind(a.student_id, familyId).first<any>();
    if (!lesson || !child) return lb.fail(404, "Lesson or child not found");
    const open = await listSlots(db, familyId, { student_id: a.student_id, from: date, to: date, open: true });
    let destination: any = null;
    for (const slot of open) {
      if (!sameSubject(slot.title, String(lesson.learning_area || ""), String(child.stage || lesson.stage || ""))) continue;
      if (original && Number(slot.duration_minutes || 0) < Number(original.duration_minutes || 0)) continue;
      // Ignore the destination itself, but check other timed commitments.
      const conflict = await calendarConflict(db, familyId, { ...slot, id: slot.id });
      if (!conflict) { destination = slot; break; }
    }
    if (original) {
      statements.push(db.prepare(
        "UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?"
      ).bind(original.id, familyId, assignmentId));
    }
    if (destination) {
      statements.push(db.prepare(
        "SELECT CASE WHEN EXISTS (SELECT 1 FROM calendar_events WHERE id = ? AND family_id = ? AND student_id = ? AND date = ? AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL) THEN 1 ELSE json_extract('SLOT_TAKEN', '
    } else {
      // No suitable subject time: give the child a flexible, untimed calendar entry.
      statements.push(db.prepare(
        "INSERT INTO calendar_events (id, family_id, student_id, title, date, start_time, duration_minutes, event_type, linked_lesson_id, linked_assignment_id, notes, created_at) VALUES (?, ?, ?, ?, ?, NULL, ?, 'lesson', ?, ?, ?, ?)"
      ).bind(crypto.randomUUID(), familyId, a.student_id, lesson.title, date,
        Number(original?.duration_minutes) || 45, a.lesson_id, assignmentId,
        "Moved by parent — choose a time if needed.", now));
    }
  }
  statements.push(setDate(date));
  try {
    // D1 batch is transactional; a stale edit rolls back both calendar and assignment.
    await db.batch(statements);
  } catch (error) {
    if (/STALE_ASSIGNMENT|STALE_SCHEDULE|SLOT_TAKEN|malformed JSON/i.test(String(error)))
      return lb.fail(409, "This lesson or timetable changed. Refresh and try again.", "PLAN_CHANGED");
    throw error;
  }
  return { ok: true };
}
) END AS valid"
  ).bind(assignmentId, familyId);
  const verifyOriginal = (entry: any) => db.prepare(
    "SELECT CASE WHEN EXISTS (SELECT 1 FROM calendar_events WHERE id = ? AND family_id = ? AND linked_assignment_id = ? AND date = ?) THEN 1 ELSE json_extract('STALE_SCHEDULE', ' (value: string | null) => db.prepare(
    "UPDATE assignments SET scheduled_date = ?, updated_at = ? WHERE id = ? AND family_id = ?"
  ).bind(value, now, assignmentId, familyId);
  if (!date) {
    if (!original) {
      await setDate(null).run();
      return { ok: true };
    }
    const unlink = isSlot(original)
      ? db.prepare("UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?")
        .bind(original.id, familyId, assignmentId)
      : db.prepare("DELETE FROM calendar_events WHERE id = ? AND family_id = ? AND linked_assignment_id = ?")
        .bind(original.id, familyId, assignmentId);
    await db.batch([unlink, setDate(null)]);
    return { ok: true };
  }
  if (original?.date === date) {
    await setDate(date).run();
    return { ok: true };
  }
  const holiday = await db.prepare(
    "SELECT id FROM calendar_events WHERE family_id = ? AND date = ? AND event_type = 'holiday' AND (student_id IS NULL OR student_id = ?) LIMIT 1"
  ).bind(familyId, date, a.student_id).first();
  if (holiday) return lb.fail(409, "That is a holiday or rest day. Choose another day.", "TIME_CONFLICT");
  if (!original && !limits.timetable) {
    await setDate(date).run();
    return { ok: true };
  }
  const statements: D1PreparedStatement[] = [];
  if (original && !isSlot(original)) {
    const conflict = await calendarConflict(db, familyId, { ...original, date });
    if (conflict) return lb.fail(conflict.code === "INVALID_TIME" ? 400 : 409, conflict.detail, conflict.code);
    statements.push(db.prepare(
      "UPDATE calendar_events SET date = ? WHERE id = ? AND family_id = ? AND linked_assignment_id = ?"
    ).bind(date, original.id, familyId, assignmentId));
  } else {
    const lesson = await db.prepare("SELECT title, learning_area, stage FROM lessons WHERE id = ? AND family_id = ?")
      .bind(a.lesson_id, familyId).first<any>();
    const child = await db.prepare("SELECT stage FROM students WHERE id = ? AND family_id = ?")
      .bind(a.student_id, familyId).first<any>();
    if (!lesson || !child) return lb.fail(404, "Lesson or child not found");
    const open = await listSlots(db, familyId, { student_id: a.student_id, from: date, to: date, open: true });
    let destination: any = null;
    for (const slot of open) {
      if (!sameSubject(slot.title, String(lesson.learning_area || ""), String(child.stage || lesson.stage || ""))) continue;
      if (original && Number(slot.duration_minutes || 0) < Number(original.duration_minutes || 0)) continue;
      // Ignore the destination itself, but check other timed commitments.
      const conflict = await calendarConflict(db, familyId, { ...slot, id: slot.id });
      if (!conflict) { destination = slot; break; }
    }
    if (original) {
      statements.push(db.prepare(
        "UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?"
      ).bind(original.id, familyId, assignmentId));
    }
    if (destination) {
      statements.push(db.prepare(
        "UPDATE calendar_events SET linked_assignment_id = ?, linked_lesson_id = ? WHERE id = ? AND family_id = ? AND student_id = ? AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL"
      ).bind(assignmentId, a.lesson_id, destination.id, familyId, a.student_id));
    } else {
      // No suitable subject time: give the child a flexible, untimed calendar entry.
      statements.push(db.prepare(
        "INSERT INTO calendar_events (id, family_id, student_id, title, date, start_time, duration_minutes, event_type, linked_lesson_id, linked_assignment_id, notes, created_at) VALUES (?, ?, ?, ?, ?, NULL, ?, 'lesson', ?, ?, ?, ?)"
      ).bind(crypto.randomUUID(), familyId, a.student_id, lesson.title, date,
        Number(original?.duration_minutes) || 45, a.lesson_id, assignmentId,
        "Moved by parent — choose a time if needed.", now));
    }
  }
  statements.push(setDate(date));
  await db.batch(statements);
  return { ok: true };
}
) END AS valid"
  ).bind(entry.id, familyId, assignmentId, entry.date);
  const setDate = (value: string | null) => db.prepare(
    "UPDATE assignments SET scheduled_date = ?, updated_at = ? WHERE id = ? AND family_id = ?"
  ).bind(value, now, assignmentId, familyId);
  if (!date) {
    if (!original) {
      await setDate(null).run();
      return { ok: true };
    }
    const unlink = isSlot(original)
      ? db.prepare("UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?")
        .bind(original.id, familyId, assignmentId)
      : db.prepare("DELETE FROM calendar_events WHERE id = ? AND family_id = ? AND linked_assignment_id = ?")
        .bind(original.id, familyId, assignmentId);
    await db.batch([unlink, setDate(null)]);
    return { ok: true };
  }
  if (original?.date === date) {
    await setDate(date).run();
    return { ok: true };
  }
  const holiday = await db.prepare(
    "SELECT id FROM calendar_events WHERE family_id = ? AND date = ? AND event_type = 'holiday' AND (student_id IS NULL OR student_id = ?) LIMIT 1"
  ).bind(familyId, date, a.student_id).first();
  if (holiday) return lb.fail(409, "That is a holiday or rest day. Choose another day.", "TIME_CONFLICT");
  if (!original && !limits.timetable) {
    await setDate(date).run();
    return { ok: true };
  }
  const statements: D1PreparedStatement[] = [];
  if (original && !isSlot(original)) {
    const conflict = await calendarConflict(db, familyId, { ...original, date });
    if (conflict) return lb.fail(conflict.code === "INVALID_TIME" ? 400 : 409, conflict.detail, conflict.code);
    statements.push(db.prepare(
      "UPDATE calendar_events SET date = ? WHERE id = ? AND family_id = ? AND linked_assignment_id = ?"
    ).bind(date, original.id, familyId, assignmentId));
  } else {
    const lesson = await db.prepare("SELECT title, learning_area, stage FROM lessons WHERE id = ? AND family_id = ?")
      .bind(a.lesson_id, familyId).first<any>();
    const child = await db.prepare("SELECT stage FROM students WHERE id = ? AND family_id = ?")
      .bind(a.student_id, familyId).first<any>();
    if (!lesson || !child) return lb.fail(404, "Lesson or child not found");
    const open = await listSlots(db, familyId, { student_id: a.student_id, from: date, to: date, open: true });
    let destination: any = null;
    for (const slot of open) {
      if (!sameSubject(slot.title, String(lesson.learning_area || ""), String(child.stage || lesson.stage || ""))) continue;
      if (original && Number(slot.duration_minutes || 0) < Number(original.duration_minutes || 0)) continue;
      // Ignore the destination itself, but check other timed commitments.
      const conflict = await calendarConflict(db, familyId, { ...slot, id: slot.id });
      if (!conflict) { destination = slot; break; }
    }
    if (original) {
      statements.push(db.prepare(
        "UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?"
      ).bind(original.id, familyId, assignmentId));
    }
    if (destination) {
      statements.push(db.prepare(
        "UPDATE calendar_events SET linked_assignment_id = ?, linked_lesson_id = ? WHERE id = ? AND family_id = ? AND student_id = ? AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL"
      ).bind(assignmentId, a.lesson_id, destination.id, familyId, a.student_id));
    } else {
      // No suitable subject time: give the child a flexible, untimed calendar entry.
      statements.push(db.prepare(
        "INSERT INTO calendar_events (id, family_id, student_id, title, date, start_time, duration_minutes, event_type, linked_lesson_id, linked_assignment_id, notes, created_at) VALUES (?, ?, ?, ?, ?, NULL, ?, 'lesson', ?, ?, ?, ?)"
      ).bind(crypto.randomUUID(), familyId, a.student_id, lesson.title, date,
        Number(original?.duration_minutes) || 45, a.lesson_id, assignmentId,
        "Moved by parent — choose a time if needed.", now));
    }
  }
  statements.push(setDate(date));
  await db.batch(statements);
  return { ok: true };
}
) END AS valid"
      ).bind(destination.id, familyId, a.student_id, destination.date));
      statements.push(db.prepare(
        "UPDATE calendar_events SET linked_assignment_id = ?, linked_lesson_id = ? WHERE id = ? AND family_id = ? AND student_id = ? AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL"
      ).bind(assignmentId, a.lesson_id, destination.id, familyId, a.student_id));
    } else {
      // No suitable subject time: give the child a flexible, untimed calendar entry.
      statements.push(db.prepare(
        "INSERT INTO calendar_events (id, family_id, student_id, title, date, start_time, duration_minutes, event_type, linked_lesson_id, linked_assignment_id, notes, created_at) VALUES (?, ?, ?, ?, ?, NULL, ?, 'lesson', ?, ?, ?, ?)"
      ).bind(crypto.randomUUID(), familyId, a.student_id, lesson.title, date,
        Number(original?.duration_minutes) || 45, a.lesson_id, assignmentId,
        "Moved by parent — choose a time if needed.", now));
    }
  }
  statements.push(setDate(date));
  await db.batch(statements);
  return { ok: true };
}
) END AS valid"
  ).bind(assignmentId, familyId);
  const verifyOriginal = (entry: any) => db.prepare(
    "SELECT CASE WHEN EXISTS (SELECT 1 FROM calendar_events WHERE id = ? AND family_id = ? AND linked_assignment_id = ? AND date = ?) THEN 1 ELSE json_extract('STALE_SCHEDULE', ' (value: string | null) => db.prepare(
    "UPDATE assignments SET scheduled_date = ?, updated_at = ? WHERE id = ? AND family_id = ?"
  ).bind(value, now, assignmentId, familyId);
  if (!date) {
    if (!original) {
      await setDate(null).run();
      return { ok: true };
    }
    const unlink = isSlot(original)
      ? db.prepare("UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?")
        .bind(original.id, familyId, assignmentId)
      : db.prepare("DELETE FROM calendar_events WHERE id = ? AND family_id = ? AND linked_assignment_id = ?")
        .bind(original.id, familyId, assignmentId);
    await db.batch([unlink, setDate(null)]);
    return { ok: true };
  }
  if (original?.date === date) {
    await setDate(date).run();
    return { ok: true };
  }
  const holiday = await db.prepare(
    "SELECT id FROM calendar_events WHERE family_id = ? AND date = ? AND event_type = 'holiday' AND (student_id IS NULL OR student_id = ?) LIMIT 1"
  ).bind(familyId, date, a.student_id).first();
  if (holiday) return lb.fail(409, "That is a holiday or rest day. Choose another day.", "TIME_CONFLICT");
  if (!original && !limits.timetable) {
    await setDate(date).run();
    return { ok: true };
  }
  const statements: D1PreparedStatement[] = [];
  if (original && !isSlot(original)) {
    const conflict = await calendarConflict(db, familyId, { ...original, date });
    if (conflict) return lb.fail(conflict.code === "INVALID_TIME" ? 400 : 409, conflict.detail, conflict.code);
    statements.push(db.prepare(
      "UPDATE calendar_events SET date = ? WHERE id = ? AND family_id = ? AND linked_assignment_id = ?"
    ).bind(date, original.id, familyId, assignmentId));
  } else {
    const lesson = await db.prepare("SELECT title, learning_area, stage FROM lessons WHERE id = ? AND family_id = ?")
      .bind(a.lesson_id, familyId).first<any>();
    const child = await db.prepare("SELECT stage FROM students WHERE id = ? AND family_id = ?")
      .bind(a.student_id, familyId).first<any>();
    if (!lesson || !child) return lb.fail(404, "Lesson or child not found");
    const open = await listSlots(db, familyId, { student_id: a.student_id, from: date, to: date, open: true });
    let destination: any = null;
    for (const slot of open) {
      if (!sameSubject(slot.title, String(lesson.learning_area || ""), String(child.stage || lesson.stage || ""))) continue;
      if (original && Number(slot.duration_minutes || 0) < Number(original.duration_minutes || 0)) continue;
      // Ignore the destination itself, but check other timed commitments.
      const conflict = await calendarConflict(db, familyId, { ...slot, id: slot.id });
      if (!conflict) { destination = slot; break; }
    }
    if (original) {
      statements.push(db.prepare(
        "UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?"
      ).bind(original.id, familyId, assignmentId));
    }
    if (destination) {
      statements.push(db.prepare(
        "UPDATE calendar_events SET linked_assignment_id = ?, linked_lesson_id = ? WHERE id = ? AND family_id = ? AND student_id = ? AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL"
      ).bind(assignmentId, a.lesson_id, destination.id, familyId, a.student_id));
    } else {
      // No suitable subject time: give the child a flexible, untimed calendar entry.
      statements.push(db.prepare(
        "INSERT INTO calendar_events (id, family_id, student_id, title, date, start_time, duration_minutes, event_type, linked_lesson_id, linked_assignment_id, notes, created_at) VALUES (?, ?, ?, ?, ?, NULL, ?, 'lesson', ?, ?, ?, ?)"
      ).bind(crypto.randomUUID(), familyId, a.student_id, lesson.title, date,
        Number(original?.duration_minutes) || 45, a.lesson_id, assignmentId,
        "Moved by parent — choose a time if needed.", now));
    }
  }
  statements.push(setDate(date));
  await db.batch(statements);
  return { ok: true };
}
) END AS valid"
  ).bind(entry.id, familyId, assignmentId, entry.date);
  const setDate = (value: string | null) => db.prepare(
    "UPDATE assignments SET scheduled_date = ?, updated_at = ? WHERE id = ? AND family_id = ?"
  ).bind(value, now, assignmentId, familyId);
  if (!date) {
    if (!original) {
      await setDate(null).run();
      return { ok: true };
    }
    const unlink = isSlot(original)
      ? db.prepare("UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?")
        .bind(original.id, familyId, assignmentId)
      : db.prepare("DELETE FROM calendar_events WHERE id = ? AND family_id = ? AND linked_assignment_id = ?")
        .bind(original.id, familyId, assignmentId);
    await db.batch([unlink, setDate(null)]);
    return { ok: true };
  }
  if (original?.date === date) {
    await setDate(date).run();
    return { ok: true };
  }
  const holiday = await db.prepare(
    "SELECT id FROM calendar_events WHERE family_id = ? AND date = ? AND event_type = 'holiday' AND (student_id IS NULL OR student_id = ?) LIMIT 1"
  ).bind(familyId, date, a.student_id).first();
  if (holiday) return lb.fail(409, "That is a holiday or rest day. Choose another day.", "TIME_CONFLICT");
  if (!original && !limits.timetable) {
    await setDate(date).run();
    return { ok: true };
  }
  const statements: D1PreparedStatement[] = [];
  if (original && !isSlot(original)) {
    const conflict = await calendarConflict(db, familyId, { ...original, date });
    if (conflict) return lb.fail(conflict.code === "INVALID_TIME" ? 400 : 409, conflict.detail, conflict.code);
    statements.push(db.prepare(
      "UPDATE calendar_events SET date = ? WHERE id = ? AND family_id = ? AND linked_assignment_id = ?"
    ).bind(date, original.id, familyId, assignmentId));
  } else {
    const lesson = await db.prepare("SELECT title, learning_area, stage FROM lessons WHERE id = ? AND family_id = ?")
      .bind(a.lesson_id, familyId).first<any>();
    const child = await db.prepare("SELECT stage FROM students WHERE id = ? AND family_id = ?")
      .bind(a.student_id, familyId).first<any>();
    if (!lesson || !child) return lb.fail(404, "Lesson or child not found");
    const open = await listSlots(db, familyId, { student_id: a.student_id, from: date, to: date, open: true });
    let destination: any = null;
    for (const slot of open) {
      if (!sameSubject(slot.title, String(lesson.learning_area || ""), String(child.stage || lesson.stage || ""))) continue;
      if (original && Number(slot.duration_minutes || 0) < Number(original.duration_minutes || 0)) continue;
      // Ignore the destination itself, but check other timed commitments.
      const conflict = await calendarConflict(db, familyId, { ...slot, id: slot.id });
      if (!conflict) { destination = slot; break; }
    }
    if (original) {
      statements.push(db.prepare(
        "UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE id = ? AND family_id = ? AND linked_assignment_id = ?"
      ).bind(original.id, familyId, assignmentId));
    }
    if (destination) {
      statements.push(db.prepare(
        "UPDATE calendar_events SET linked_assignment_id = ?, linked_lesson_id = ? WHERE id = ? AND family_id = ? AND student_id = ? AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL"
      ).bind(assignmentId, a.lesson_id, destination.id, familyId, a.student_id));
    } else {
      // No suitable subject time: give the child a flexible, untimed calendar entry.
      statements.push(db.prepare(
        "INSERT INTO calendar_events (id, family_id, student_id, title, date, start_time, duration_minutes, event_type, linked_lesson_id, linked_assignment_id, notes, created_at) VALUES (?, ?, ?, ?, ?, NULL, ?, 'lesson', ?, ?, ?, ?)"
      ).bind(crypto.randomUUID(), familyId, a.student_id, lesson.title, date,
        Number(original?.duration_minutes) || 45, a.lesson_id, assignmentId,
        "Moved by parent — choose a time if needed.", now));
    }
  }
  statements.push(setDate(date));
  await db.batch(statements);
  return { ok: true };
}
