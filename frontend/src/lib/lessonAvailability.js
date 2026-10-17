/**
 * The lesson library includes assigned_to entries from the server.
 * Revoked assignments are omitted by the API and do not block reuse.
 * All other assignments (including completed/accepted/demonstrated) do.
 * Family/child ownership is still enforced by the assignment API.
 */
export function lessonAvailableForChild(lesson, studentId) {
  if (!studentId) return true;
  return !(lesson.assigned_to || []).some(a =>
    String(a.student_id) === String(studentId) && a.status !== "revoked"
  );
}

export function lessonAvailableForChildren(lesson, studentIds = []) {
  return studentIds.every(id => lessonAvailableForChild(lesson, id));
}
