/**
 * Subject connections are searchable/reusable possibilities, NOT proof that a
 * student has achieved a curriculum outcome. One lesson has one primary area
 * and at most five additional parent-reviewable areas.
 */
import { normArea } from "./outcomeMatch";

export const LEARNING_AREAS = [
  "English", "Mathematics", "Science", "Humanities and Social Sciences",
  "Health and Physical Education", "The Arts", "Technologies", "Languages",
  "Life skills", "Other",
] as const;

export const normalizeLessonArea = (value: unknown): string => {
  const raw = String(value ?? "").trim().toLowerCase();
  if (/^(hsie|hass|history|geography|humanities|humanities and social sciences|social studies)$/.test(raw))
    return "Humanities and Social Sciences";
  if (/^(math|maths|mathematics)$/.test(raw)) return "Mathematics";
  if (raw === "pdhpe") return "Health and Physical Education";
  return LEARNING_AREAS.find(v => v.toLowerCase() === raw) || "";
};

export const cleanAdditionalAreas = (value: unknown, primary: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  const current = normalizeLessonArea(primary);
  return [...new Set(value.map(normalizeLessonArea).filter(v => v && v !== current))].slice(0, 5);
};

export function lessonSupportsArea(lesson: {
  learning_area?: string | null;
  additional_learning_areas?: string[] | null;
}, area: string, stage = ""): boolean {
  const target = normArea(area, stage) || normalizeLessonArea(area);
  if (!target) return false;
  return [lesson.learning_area, ...(lesson.additional_learning_areas || [])]
    .some(value => !!value && (normArea(value, stage) || normalizeLessonArea(value)) === target);
}
