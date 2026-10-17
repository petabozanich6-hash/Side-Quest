/** Calendar-only weekly review. The API remains the source of truth for
 * approving an assignment; client-side conflict checks are advisory.
 */
export const isLearningSlot = e => e?.event_type === "timetable" ||
  (e?.event_type === "lesson" && String(e.notes || "").startsWith("Suggested by Side-Quest"));

const startMinutes = value => {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ""))) return null;
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};

export function calendarSlotConflict(slot, events = []) {
  const start = startMinutes(slot.start_time);
  if (start === null) return null;
  const end = start + Math.max(1, Number(slot.duration_minutes) || 1);
  return events.find(other => {
    if (other.id === slot.id || other.date !== slot.date) return false;
    // Child-specific events and whole-family events both affect this child.
    if (other.student_id && other.student_id !== slot.student_id) return false;
    if (!other.start_time) return other.event_type === "holiday";
    const otherStart = startMinutes(other.start_time);
    if (otherStart === null) return false;
    const otherEnd = otherStart + Math.max(1, Number(other.duration_minutes) || 1);
    return start < otherEnd && otherStart < end;
  }) || null;
}

/** One row per real timetable slot, including occupied slots and gaps.
 * A proposal alone isn't proof of availability: the calendar must still be free.
 */
export function buildWeeklyLessonRows(events = [], proposals = [], studentId) {
  const bySlot = new Map(proposals.map(p => [p.calendar_event_id, p]));
  const seenLibraryIds = new Set();
  return events.filter(e => e.student_id === studentId && isLearningSlot(e))
    .sort((a, b) => a.date.localeCompare(b.date) ||
      String(a.start_time || "").localeCompare(String(b.start_time || "")) || a.id.localeCompare(b.id))
    .map(slot => {
      const proposal = bySlot.get(slot.id);
      const conflict = calendarSlotConflict(slot, events);
      let state;
      if (slot.linked_assignment_id || slot.linked_lesson_id) state = "scheduled";
      else if (conflict) state = "conflict";
      else if (!proposal || proposal.status !== "proposed" || proposal.action === "already_assigned") state = "attention";
      else if (proposal.lesson && proposal.lesson.status !== "ready") state = "review";
      else if (proposal.lesson?.status === "ready") {
        if (seenLibraryIds.has(proposal.lesson.id)) state = "attention";
        else { seenLibraryIds.add(proposal.lesson.id); state = "ready"; }
      } else if (proposal.action === "needs_generation") state = "missing";
      else state = "attention";
      return { id: slot.id, slot, proposal, state, conflict };
    });
}
