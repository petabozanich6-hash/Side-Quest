import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validateSchema } from "./schema-validate.mjs";
import { MEASURABLE_VERBS, firstWord } from "./verbs.mjs";

const here = dirname(fileURLToPath(import.meta.url));
export const SCHEMA = JSON.parse(readFileSync(join(here, "../../schema/lesson.schema.json"), "utf8"));

const PLACEHOLDER = /\b(todo|tbd|lorem ipsum|placeholder|fill in|xxx|coming soon)\b|\.\.\.$/i;

function walkStrings(v, path, cb) {
  if (typeof v === "string") cb(v, path);
  else if (Array.isArray(v)) v.forEach((x, i) => walkStrings(x, `${path}[${i}]`, cb));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walkStrings(x, `${path}.${k}`, cb);
}

/** Returns { valid, errors[] }: schema errors plus semantic pedagogy checks. */
export function validateLesson(lesson) {
  const errors = validateSchema(SCHEMA, lesson);
  if (lesson && typeof lesson === "object" && !Array.isArray(lesson)) {
    (lesson.learning_objectives || []).forEach((o, i) => {
      if (typeof o === "string" && !MEASURABLE_VERBS.has(firstWord(o)))
        errors.push(`$.learning_objectives[${i}]: must start with a measurable verb (got '${firstWord(o)}')`);
    });
    const n = Array.isArray(lesson.learning_objectives) ? lesson.learning_objectives.length : 0;
    (lesson.formative_checks || []).forEach((c, i) => {
      if (Number.isInteger(c?.objective_index) && c.objective_index >= n)
        errors.push(`$.formative_checks[${i}].objective_index: ${c.objective_index} out of range`);
      if (c?.type === "multiple-choice") {
        if (!Array.isArray(c.options)) errors.push(`$.formative_checks[${i}]: multiple-choice requires options`);
        else if (!c.options.includes(c.correct_answer)) errors.push(`$.formative_checks[${i}]: correct_answer must be one of options`);
      }
    });
    if (n) {
      const covered = new Set((lesson.formative_checks || []).map((c) => c?.objective_index));
      for (let i = 0; i < n; i++) if (!covered.has(i)) errors.push(`$.formative_checks: no check assesses objective ${i}`);
    }
    walkStrings(lesson, "$", (s, p) => { if (PLACEHOLDER.test(s)) errors.push(`${p}: placeholder text`); });
  }
  return { valid: errors.length === 0, errors };
}
