// A parent can ask for "a Halloween Science and Maths lesson" without typing
// "two lessons". Keep detection conservative: only distinct, explicitly
// conjoined school subjects are interpreted as separate lessons. A deliberate
// interdisciplinary/single lesson is never split.
const SUBJECT_WORD = /\b(mathematics|maths?|science|english|history|geography|technology|computing|coding|music|visual arts?|art)\b/gi;
const SUBJECT_NAMES = {
  mathematics: "Mathematics", math: "Mathematics", maths: "Mathematics",
  science: "Science", english: "English",
  history: "History", geography: "Geography",
  technology: "Technologies", computing: "Technologies", coding: "Technologies",
  music: "The Arts", "visual art": "The Arts", "visual arts": "The Arts", art: "The Arts",
};
const SINGLE_COMBINED = /\b(?:single|one|an?)\s+(?:(?:cross[- ]curricular|interdisciplinary|integrated|combined|joint)\s+)?lesson\s+(?:combining|integrating|covering|on|using|about|with|involving)\b|\b(?:combined|integrated|cross[- ]curricular|interdisciplinary)\s+(?:lesson|activity|project)\b/i;
const explicitAmount = /(?<!year\s)\b(two|three|four|five|six|[2-6])\s+(?:[\w-]+\s+){0,4}?lessons?\b/i;

export function requestedSeparateSubjects(text) {
  if (typeof text !== "string" || SINGLE_COMBINED.test(text)) return [];
  const words = [...text.matchAll(SUBJECT_WORD)].map(m => ({
    subject: SUBJECT_NAMES[m[0].toLowerCase()], start: m.index, end: m.index + m[0].length,
  }));
  if (words.length < 2) return [];
  const groups = [];
  for (let i = 0; i < words.length - 1; i++) {
    const between = text.slice(words[i].end, words[i + 1].start)
      .replace(/\b(?:an?|the|lessons?|subjects?)\b/gi, " ").trim();
    if (!/^(?:(?:and|plus|&|\+|,|;|\/|\s)+)$/i.test(between)) continue;
    if (!groups.length || groups.at(-1) !== words[i].subject) groups.push(words[i].subject);
    if (groups.at(-1) !== words[i + 1].subject) groups.push(words[i + 1].subject);
  }
  const unique = [...new Set(groups)];
  return unique.length >= 2 && unique.length <= 6 ? unique : [];
}

export function lessonRequestIntent(text, hasSource = false) {
  const subjects = requestedSeparateSubjects(text);
  if (subjects.length >= 2 && !explicitAmount.test(text)) {
    return { type: "multi_subject", subjects, blockedBySource: !!hasSource };
  }
  return { type: explicitAmount.test(text) ? "series" : "single", subjects: [], blockedBySource: false };
}
