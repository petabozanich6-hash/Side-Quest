import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validateLesson } from "./validate.mjs";
import { MEASURABLE_VERBS, firstWord } from "./verbs.mjs";

const here = dirname(fileURLToPath(import.meta.url));
export const RUBRIC = JSON.parse(readFileSync(join(here, "../../rubric.json"), "utf8"));

const arr = (v) => (Array.isArray(v) ? v : []);
const words = (s) => String(s || "").split(/\s+/).filter(Boolean);
const cap = (n) => Math.max(0, Math.min(4, n));
const b = (c) => (c ? 1 : 0);

function avgSentenceWords(l) {
  const text = [l.core_explanation?.summary, l.lesson_summary?.recap, ...arr(l.core_explanation?.key_points)].join(" ");
  const sentences = text.split(/[.!?]+\s/).filter((s) => s.trim());
  return sentences.length ? words(text).length / sentences.length : 99;
}

/** Heuristic structural scoring, 0-4 per rubric dimension. `overrides` = reviewer scores per dimension. */
export function scoreLesson(lesson, overrides = {}) {
  const l = lesson || {};
  const objs = arr(l.learning_objectives);
  const checks = arr(l.formative_checks);
  const indep = arr(l.independent_practice);
  const worked = arr(l.worked_examples);
  const guided = arr(l.guided_practice);
  const covered = new Set(checks.map((c) => c?.objective_index));
  const allCovered = objs.length > 0 && objs.every((_, i) => covered.has(i));
  const levels = new Set(indep.map((p) => p?.difficulty));

  const s = {
    clarity: cap(b(words(l.core_explanation?.summary).length >= 25) + b(arr(l.core_explanation?.key_points).length >= 2)
      + b(arr(l.core_explanation?.vocabulary).length >= 1) + b(avgSentenceWords(l) <= 22)),
    objective_measurability: cap(b(objs.length >= 1) + b(objs.length > 0 && objs.every((o) => MEASURABLE_VERBS.has(firstWord(o))))
      + b(objs.every((o) => words(o).length >= 6)) + b(allCovered)),
    conceptual_accuracy: cap(b(worked.length >= 2 && worked.every((w) => w.answer)) + b(worked.every((w) => arr(w.steps).every((st) => st.reasoning)))
      + b(checks.length >= 3 && checks.every((c) => c.rationale)) + b(worked.some((w) => w.common_slip))),
    scaffolding: cap(b(worked.length >= 2) + b(guided.length >= 2 && guided.every((g) => arr(g.hints).length)) + b(levels.size >= 2)
      + b(arr(l.prerequisites).every((p) => p.quick_check) && !!l.activation_prompt?.prompt)),
    practice_quality: cap(b(indep.length >= 4) + b(levels.size >= 3) + b(indep.every((p) => p.answer) && indep.some((p) => p.rationale))
      + b(arr(l.retrieval_practice).length >= 3)),
    feedback_quality: cap(b(checks.length >= 3 && checks.every((c) => words(c.rationale).length >= 8)) + b(checks.some((c) => c.feedback_if_wrong))
      + b(arr(l.misconceptions_and_corrections).length >= 2) + b(arr(l.remediation_plan?.steps).length >= 2)),
    assessment_alignment: cap(b(checks.length >= 3) + b(allCovered) + b(arr(l.mastery_criteria?.evidence).length >= 1)
      + b(l.mastery_criteria?.threshold_percent >= 70)),
    cognitive_load: cap(b(objs.length >= 1 && objs.length <= 3) + b(arr(l.core_explanation?.key_points).length <= 5)
      + b(avgSentenceWords(l) <= 20) + b(l.estimated_time_minutes <= 60)),
    inclusivity: cap(b(arr(l.inclusivity_notes).length >= 1) + b(arr(l.inclusivity_notes).length >= 2)
      + b(arr(l.core_explanation?.vocabulary).length >= 1) + b(arr(l.core_explanation?.analogies_or_representations).length >= 1)),
    transfer: cap(b(arr(l.transfer_tasks).length >= 1) + b(words(l.extension_challenge?.task).length >= 15)
      + b(arr(l.retrieval_practice).some((r) => arr(r.review_after_days).length >= 2)) + b(!!l.extension_challenge?.success_looks_like)),
  };
  // Accuracy cannot be proven structurally: capped at 3 unless a reviewer supplies a score.
  s.conceptual_accuracy = Math.min(s.conceptual_accuracy, 3);
  for (const [k, v] of Object.entries(overrides || {})) if (k in s) s[k] = cap(v);

  const total = Object.values(s).reduce((a, x) => a + x, 0);
  const min = Math.min(...Object.values(s));
  const { valid, errors } = validateLesson(lesson);
  const T = RUBRIC.thresholds;
  let tier = "draft";
  if (valid && total >= T.good.min_total && min >= T.good.min_dimension) tier = "good";
  const reviewed = overrides && overrides.conceptual_accuracy !== undefined;
  if (tier === "good" && reviewed && total >= T.excellent.min_total && min >= T.excellent.min_dimension) tier = "excellent";
  return { scores: s, total, max: 40, min_dimension: min, schema_valid: valid, schema_errors: errors, tier };
}
