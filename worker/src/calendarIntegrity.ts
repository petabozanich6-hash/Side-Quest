/** Shared server-side calendar checks for every way a parent schedules learning.
 * A family-wide event applies to every child. Untimed non-holiday events are
 * flexible and do not reserve the whole day.
 */
type CalendarCandidate = {
  id?: string | null;
  student_id?: string | null;
  date?: string | null;
  start_time?: string | null;
  duration_minutes?: number | string | null;
  event_type?: string | null;
};
const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;
const minutes = (value: unknown): number | null => {
  const m = TIME.exec(String(value || ""));
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

export async function calendarConflict(db: D1Database, familyId: string, candidate: CalendarCandidate) {
  const start = minutes(candidate.start_time);
  const duration = Number(candidate.duration_minutes) || 0;
  const isHoliday = candidate.event_type === "holiday";
  if (!candidate.date || (!isHoliday && start === null)) return null;
  if (start !== null && (duration <= 0 || duration > 600 || start + duration > 1440)) {
    return { detail: "Choose a valid duration and a time that ends before midnight.", code: "INVALID_TIME" };
  }
  const { results } = await db.prepare(`SELECT id, title, student_id, start_time, duration_minutes, event_type
    FROM calendar_events WHERE family_id = ? AND date = ? AND id != ? AND
      (? IS NULL OR student_id IS NULL OR student_id = ?)`)
    .bind(familyId, candidate.date, candidate.id || "", candidate.student_id || null, candidate.student_id || null)
    .all<any>();
  const clash = (results || []).find(other => {
    // Whole-family entries also conflict with timed events for any child.
    if (other.id === candidate.id) return false;
    if (isHoliday || other.event_type === "holiday" && !other.start_time) return true;
    const at = minutes(other.start_time);
    if (at === null || start === null) return false;
    return start < at + Math.max(1, Number(other.duration_minutes) || 1) && at < start + duration;
  });
  return clash ? { detail: `This time overlaps "${String(clash.title || "another commitment").slice(0, 100)}". Choose another time or move that entry first.`, code: "TIME_CONFLICT" } : null;
}

/** Once calendar entries are linked, their earliest day is the date of truth. */
export async function syncAssignmentDate(db: D1Database, familyId: string, assignmentId: string | null | undefined) {
  if (!assignmentId) return;
  await db.prepare(`UPDATE assignments SET scheduled_date = (
    SELECT MIN(date) FROM calendar_events WHERE family_id = ? AND linked_assignment_id = ?
  ), updated_at = ? WHERE id = ? AND family_id = ?`)
    .bind(familyId, assignmentId, new Date().toISOString(), assignmentId, familyId).run();
}
