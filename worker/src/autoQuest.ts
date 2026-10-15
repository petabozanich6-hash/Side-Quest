/**
 * Auto-Quest planning core. Pure preview only: never drafts, spends AI allowance,
 * saves a lesson, or changes assignments. The eventual server endpoint must supply
 * family-scoped data from authenticated queries.
 *
 * An achieved curriculum outcome is not eligible for routine teaching. A lesson
 * targeting several outcomes may remain eligible only for its unachieved outcomes.
 * A missing/uncleared catalogue cannot be replaced with invented mappings.
 */
export type QuestSlot = { id: string; student_id: string; date: string; title: string; event_type?: string; linked_assignment_id?: string | null };
export type QuestLesson = { id: string; title: string; learning_area?: string; outcome_codes?: string[]; status?: string };
export type QuestAssignment = { id: string; student_id: string; lesson_id: string; scheduled_date?: string | null; status?: string };
export type QuestProgress = { code: string; status: string };
export type QuestDecision = { slotId: string; action: "already_assigned" | "reuse_draft" | "needs_parent_plan" | "needs_generation"; lessonId?: string; reason: string; eligibleOutcomeCodes: string[] };
export type QuestInputs = {
  studentId: string;
  slots: QuestSlot[];
  lessons: QuestLesson[];
  assignments: QuestAssignment[];
  progress: QuestProgress[];
  catalogueAvailable: boolean;
  allowedOutcomeCodes: string[];
};

const completed = new Set(["completed", "accepted", "demonstrated"]);
const normalize = (value: unknown) => String(value ?? "").trim().toLowerCase();
export function planAutoQuest(input: QuestInputs): QuestDecision[] {
  const approved = new Set(input.allowedOutcomeCodes);
  const achieved = new Set(input.progress.filter(p => p.status === "achieved").map(p => p.code));
  const used = new Set(input.assignments.filter(a => a.student_id === input.studentId && !completed.has(a.status || "")).map(a => a.lesson_id));
  return input.slots
    .filter(slot => slot.student_id === input.studentId && (!slot.event_type || slot.event_type === "lesson"))
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .map(slot => {
      const assigned = input.assignments.find(a => a.student_id === input.studentId &&
        (a.id === slot.linked_assignment_id || (a.scheduled_date === slot.date &&
          input.lessons.some(l => l.id === a.lesson_id && normalize(l.learning_area || l.title) === normalize(slot.title)))));
      if (assigned) return { slotId: slot.id, action: "already_assigned", lessonId: assigned.lesson_id, reason: "Existing assignment preserved", eligibleOutcomeCodes: [] };
      if (!input.catalogueAvailable) return { slotId: slot.id, action: "needs_parent_plan", reason: "Verified outcome catalogue unavailable; use parent-approved plan without inventing curriculum codes", eligibleOutcomeCodes: [] };
      const relevant = input.lessons.filter(l => normalize(l.learning_area) === normalize(slot.title) && l.status !== "archived");
      const candidates = relevant.map(lesson => ({
        lesson,
        codes: [...new Set(lesson.outcome_codes || [])].filter(code => approved.has(code) && !achieved.has(code)),
      })).filter(x => x.codes.length && !used.has(x.lesson.id));
      const candidate = candidates[0];
      if (candidate) {
        used.add(candidate.lesson.id);
        return { slotId: slot.id, action: "reuse_draft", lessonId: candidate.lesson.id, reason: "Reuse existing lesson addressing unachieved verified outcomes; parent approval required", eligibleOutcomeCodes: candidate.codes };
      }
      const remaining = [...approved].filter(code => !achieved.has(code));
      if (!remaining.length) return { slotId: slot.id, action: "needs_parent_plan", reason: "No outstanding verified outcomes; offer parent-approved extension or revision", eligibleOutcomeCodes: [] };
      return { slotId: slot.id, action: "needs_generation", reason: "Lesson needed; select relevant unachieved outcomes by subject and prerequisites before generating", eligibleOutcomeCodes: [] };
    });
}
