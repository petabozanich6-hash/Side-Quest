/** Turn ALL known book-companion lesson warnings into one focused repair request.
 * Pure planning helper: the server rechecks the latest saved lesson after each pass.
 * Never declare an issue solved merely because the AI said it made a change.
 */
const TARGETS = [
  [/guided.practice|guided practice|answered guided|practice questions|question has no answer/i, ["guided_practice"]],
  [/worksheets?|handouts?|printables?|download|off.screen|child off.screen|no such material|resource/i, ["sections", "activities"]],
  [/independent activit|activities|activity|tasks|on.screen/i, ["activities"]],
  [/written questions?|marking guidance/i, ["questions"]],
  [/assessment|quiz questions?|quiz/i, ["quiz"]],
  [/worked examples?|step.by.step working|actual calculation|calculations? are wrong/i, ["worked_examples"]],
  [/teaching explanations?|teaching sections?|lesson explanations?|explanations total|teach the concept/i, ["sections"]],
  [/learning objectives?/i, ["objectives"]],
  [/parent teaching notes|parent teaching script|parent guide|parent script/i, ["parent_script", "answer_key"]],
  [/answer key/i, ["answer_key"]],
  [/parent.guided|questions to ask/i, ["teaching_questions"]],
];

export function planBookAiRepair(aiWarnings = [], contentIssues = []) {
  const issues = [...new Set([...(Array.isArray(contentIssues) ? contentIssues : []),
    ...(Array.isArray(aiWarnings) ? aiWarnings : [])].map((v) => String(v || "").trim()).filter(Boolean))];
  if (!issues.length) return { issues: [], target: [], instruction: "", selected: [] };
  const picked = [];
  const selected = [];
  for (const issue of issues) {
    const fields = TARGETS.find(([pattern]) => pattern.test(issue))?.[1] || [];
    // If we encounter another related issue, keep it in the same repair; if
    // it would require too many long fields, leave it for the next pass.
    if (fields.length && new Set([...picked, ...fields]).size > 4) continue;
    for (const field of fields) if (!picked.includes(field)) picked.push(field);
    selected.push(issue);
    if (selected.length >= 6) break;
  }
  // An unknown AI flag is still a real warning. Leave the target unrestricted
  // so the model can change the specific field actually responsible.
  const target = selected.some((issue) => !TARGETS.some(([pattern]) => pattern.test(issue))) ? [] : picked;
  const preface = "Fix ALL listed issues in this EXISTING saved lesson. Return real corrected content, complete lists, correct answers and explanations. Keep good teaching and manual edits; do not invent missing external resources. Issues: ";
  const suffix = " Verify the lesson is self-contained, accurate and usable on screen.";
  const allowed = 600 - preface.length - suffix.length;
  const details = selected.join(" | ").slice(0, Math.max(80, allowed));
  return { issues, selected, target, instruction: preface + details + suffix };
}
