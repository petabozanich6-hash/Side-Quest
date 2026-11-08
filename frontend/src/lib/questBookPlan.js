// Owner-only checklist of suggested specialist books. Shown as "Planned" cards on the Quest Books shelves for the owner,
// hidden once a matching book (same collection, year and topic) exists. Families never see these.
const cross = (years, topics, extra = {}) => years.flatMap((year) => topics.map(([topic, subject]) => ({ year, topic, subject, ...extra })));

export const QUEST_BOOK_PLAN = {
  naplan: cross([3, 5, 7, 9], [["Reading", "english"], ["Writing", "english"], ["Language conventions", "english"], ["Numeracy", "mathematics"]]),
  hsc: [
    ...[["English Standard", "english"], ["English Advanced", "english"], ["Mathematics Standard 2", "mathematics"], ["Mathematics Advanced", "mathematics"],
      ["Mathematics Extension 1", "mathematics"], ["Biology", "science"], ["Chemistry", "science"], ["Physics", "science"],
      ["Modern History", "history"], ["Business Studies", "other"], ["Legal Studies", "other"], ["PDHPE", "other"]].map(([topic, subject]) => ({ year: 12, topic, subject })),
    { year: 11, topic: "English Advanced", subject: "english" }, { year: 11, topic: "Mathematics Advanced", subject: "mathematics" },
  ],
  senior: [
    { year: 12, topic: "VCE English", subject: "english" }, { year: 12, topic: "VCE Mathematical Methods", subject: "mathematics" },
    { year: 12, topic: "QCE Mathematical Methods", subject: "mathematics" }, { year: 12, topic: "WACE English ATAR", subject: "english" },
    { year: 12, topic: "SACE Stage 2 Mathematical Methods", subject: "mathematics" },
  ],
  selective: [
    ...cross([4], [["OC test: Reading", "english"], ["OC test: Mathematical reasoning", "mathematics"], ["OC test: Thinking skills", "other"]]),
    ...cross([6], [["Selective test: Reading", "english"], ["Selective test: Mathematical reasoning", "mathematics"], ["Selective test: Thinking skills", "other"], ["Selective test: Writing", "english"]]),
    { year: 6, topic: "Scholarship exam practice", subject: "other" },
  ],
  reading: [
    { year: 0, topic: "Phonics: first sounds", subject: "english" }, { year: 1, topic: "Phonics: blends and digraphs", subject: "english" },
    { year: 1, topic: "Sight words", subject: "english" }, { year: 2, topic: "Spelling patterns", subject: "english" },
    { year: 3, topic: "Reading comprehension", subject: "english" },
  ],
  handwriting: [
    { year: 0, topic: "Print letter formation", subject: "english" }, { year: 2, topic: "Pre-cursive", subject: "english" },
    { year: 3, topic: "Cursive", subject: "english" },
  ],
  "study-skills": [
    { year: null, topic: "Note-taking", subject: "other" }, { year: null, topic: "Essay writing", subject: "english" },
    { year: null, topic: "Exam technique", subject: "other" }, { year: null, topic: "Research skills", subject: "other" },
    { year: null, topic: "Time management", subject: "other" },
  ],
  "life-skills": [
    { year: 5, topic: "Money and budgeting", subject: "mathematics" }, { year: 4, topic: "Cooking maths", subject: "mathematics" },
    { year: 7, topic: "Everyday literacy", subject: "english" },
  ],
};

const norm = (s) => String(s || "").trim().toLowerCase();
/** Planned books for a collection that don't have a matching uploaded book yet. */
export function plannedFor(collection, books) {
  return (QUEST_BOOK_PLAN[collection] || []).filter((p) => !books.some((b) => b.collection === collection && (b.year ?? null) === p.year && norm(b.topic) === norm(p.topic)));
}
