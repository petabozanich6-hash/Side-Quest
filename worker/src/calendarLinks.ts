/** Relationship validation for manually edited and created calendar entries.
 * A same-family assignment must also belong to this child AND refer to the
 * displayed lesson. Never trust a client-supplied assignment ID on its own.
 */
export async function validateCalendarAssignment(
  db: D1Database, familyId: string,
  assignmentId: unknown, studentId: unknown, lessonId: unknown
): Promise<{ ok: true } | { ok: false; status: 400 | 404 | 409; detail: string }> {
  if (!assignmentId) return { ok: true };
  if (!studentId || !lessonId) return {
    ok: false, status: 400,
    detail: "An assigned calendar entry needs both its child and linked lesson."
  };
  const row = await db.prepare(
    "SELECT student_id, lesson_id, status FROM assignments WHERE id = ? AND family_id = ?"
  ).bind(String(assignmentId), familyId).first<{
    student_id: string; lesson_id: string; status: string;
  }>();
  if (!row || row.status === "revoked") return {
    ok: false, status: 404, detail: "Assignment not found."
  };
  if (row.student_id !== studentId || row.lesson_id !== lessonId) return {
    ok: false, status: 409,
    detail: "That assignment belongs to a different child or lesson. Remove the assignment link before changing these details."
  };
  return { ok: true };
}
