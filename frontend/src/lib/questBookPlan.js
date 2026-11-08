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
    { year: 7, topic: "Everyday literacy", subject: "english" }, { year: null, topic: "Cooking with kids", subject: "other" },
    { year: null, topic: "First aid basics", subject: "pdhpe" }, { year: 8, topic: "Australian money and banking", subject: "mathematics" },
    { year: null, topic: "Road and water safety", subject: "pdhpe" },
  ],
  "unit-studies": [
    { year: null, topic: "Space", subject: "science" },
    { year: null, topic: "The ocean", subject: "science" },
    { year: null, topic: "Dinosaurs", subject: "science" },
    { year: null, topic: "Ancient Egypt", subject: "history" },
    { year: null, topic: "The Australian gold rush", subject: "history" },
    { year: null, topic: "Australian animals", subject: "science" },
    { year: null, topic: "Weather and climate", subject: "geography" },
  ],
  "first-nations": [
    { year: null, topic: "Country and place", subject: "geography" },
    { year: null, topic: "Seasons calendars", subject: "geography" },
    { year: null, topic: "Languages and words", subject: "other" },
    { year: null, topic: "Stories and storytelling", subject: "english" },
    { year: null, topic: "Bush foods and caring for Country", subject: "science" },
  ],
  coding: [
    { year: 3, topic: "Scratch for beginners", subject: "other" }, { year: 6, topic: "Python first steps", subject: "other" },
    { year: 5, topic: "micro:bit projects", subject: "other" }, { year: 4, topic: "How computers work (unplugged)", subject: "other" },
    { year: null, topic: "Online safety", subject: "pdhpe" },
  ],
  nature: [
    { year: null, topic: "My nature journal", subject: "science" },
    { year: null, topic: "Bush walk explorers", subject: "geography" },
    { year: null, topic: "Backyard bugs and birds", subject: "science" },
    { year: null, topic: "Citizen science projects", subject: "science" },
    { year: null, topic: "Seasons and weather watching", subject: "science" },
  ],
  wellbeing: [
    { year: null, topic: "My feelings", subject: "pdhpe" },
    { year: null, topic: "Calm-down strategies", subject: "pdhpe" },
    { year: null, topic: "Friendships", subject: "pdhpe" },
    { year: null, topic: "Resilience and bouncing back", subject: "pdhpe" },
    { year: null, topic: "Mindfulness for kids", subject: "pdhpe" },
  ],
  "growing-up": [
    { year: 4, topic: "Growing up: girls (ages 9–12)", subject: "pdhpe" }, { year: 5, topic: "Growing up: boys (ages 10–12)", subject: "pdhpe" },
    { year: 8, topic: "Growing up: teens", subject: "pdhpe" }, { year: null, topic: "Talking about growing up: a guide for parents", subject: "pdhpe" },
  ],
  languages: [
    { year: null, topic: "Japanese for beginners", subject: "other" },
    { year: null, topic: "Indonesian for beginners", subject: "other" },
    { year: null, topic: "French for beginners", subject: "other" },
    { year: null, topic: "Auslan starter", subject: "other" },
  ],
  "early-learning": [
    { year: 0, topic: "Fine motor fun", subject: "other" }, { year: 0, topic: "Pre-writing patterns", subject: "english" },
    { year: 0, topic: "Counting to 20", subject: "mathematics" }, { year: 0, topic: "Colours and shapes", subject: "mathematics" },
    { year: 0, topic: "Ready for school", subject: "other" },
  ],
  "learning-support": [
    { year: null, topic: "Dyslexia-friendly reading", subject: "english" },
    { year: null, topic: "Maths foundations", subject: "mathematics" },
    { year: null, topic: "Visual schedules and routines", subject: "other" },
    { year: null, topic: "Spelling support", subject: "english" },
  ],
  seasonal: [
    { year: null, topic: "Christmas activity book", subject: "other" },
    { year: null, topic: "Easter activity book", subject: "other" },
    { year: null, topic: "NAIDOC Week", subject: "history" },
    { year: null, topic: "Science Week", subject: "science" },
    { year: null, topic: "Summer holidays", subject: "other" },
    { year: null, topic: "Book Week", subject: "english" },
  ],
};

const norm = (s) => String(s || "").trim().toLowerCase();
/** Planned books for a collection that don't have a matching uploaded book yet. */
export function plannedFor(collection, books) {
  return (QUEST_BOOK_PLAN[collection] || []).filter((p) => !books.some((b) => b.collection === collection && (b.year ?? null) === p.year && norm(b.topic) === norm(p.topic)));
}
