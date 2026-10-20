/** Keeps the beginner flow separate from the full lesson editor and the AI entitlement system. */
export const GUIDED_STEPS = [
  { title: "The idea", subtitle: "Who, what and why" },
  { title: "Teach it", subtitle: "Explain it clearly" },
  { title: "Try it", subtitle: "Something the child can do" },
  { title: "Ready to save", subtitle: "Check and choose what happens next" },
];

export function lessonReadiness(f) {
  const missing = [];
  const add = (step, label) => missing.push({ step, label });
  if (!f.title?.trim()) add(0, "A lesson title");
  if (!f.learning_area?.trim()) add(0, "A subject");
  if (!f.year_level?.trim()) add(0, "A year level");
  if (!f.objectives?.some(s => String(s).trim())) add(0, "One thing the child will learn");
  if (!f.sections?.some(s => String(s.body || "").trim())) add(1, "An explanation that teaches the idea");
  const hasActivity = f.activities?.some(a => String(a.title || "").trim() && String(a.instructions || "").trim());
  const hasQuestion = f.questions?.some(q => String(q.prompt || "").trim());
  const hasGuided = f.guided_practice?.some(q => String(q.prompt || "").trim());
  if (!hasActivity && !hasQuestion && !hasGuided) add(2, "An activity or a question to try");
  return missing;
}

export function studentYear(student) {
  if (!student) return "";
  const raw = String(student.year_level ?? student.year ?? "").trim();
  if (/^(k|kindergarten|foundation|prep|reception)$/i.test(raw)) return "Kindergarten / Foundation";
  const n = raw.match(/^(?:year\s*)?(\d{1,2})$/i);
  if (!n) return "";
  const year = Number(n[1]);
  return year >= 1 && year <= 10 ? `Year ${year}` : "";
}

export function guidedLearningSummary(f) {
  return {
    lesson: f.title?.trim() || "Untitled lesson",
    goal: (f.objectives || []).find(x => String(x).trim()) || "Not yet added",
    examples: (f.worked_examples || []).filter(e => String(e.problem || "").trim()).length,
    activities: (f.activities || []).filter(a => String(a.title || "").trim() && String(a.instructions || "").trim()).length,
    questions: (f.questions || []).filter(q => String(q.prompt || "").trim()).length,
  };
}
