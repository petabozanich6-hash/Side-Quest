import { builtLessonPrintHtml, lessonPrintHtml, printableSheet } from "./lessonPrint";

const library = {
  title: "Library Quest",
  stage: "Stage 2",
  learning_area: "English",
  outcome_codes: ["EN2-RECOM-01"],
  child_mission: "Find the clues",
  learning_intention: "Read carefully",
  materials: ["pencil"],
  success_criteria: ["Find the main idea"],
  teach_steps: [{
    title: "Read",
    explain: "Follow the example",
    check: { question: "Which is right?", options: ["No", "Yes"], correct_index: 1, explanation: "PRIVATE_STEP_EXPLANATION" }
  }],
  interactive_activities: [{
    type: "flip_cards",
    title: "Word cards",
    cards: [{ front: "Mystery", back: "PRIVATE_CARD_ANSWER" }]
  }],
  sort_activity: {
    buckets: ["Beginning", "Middle"],
    instructions: "Sort these.",
    items: [{ text: "The introduction", answer: 0 }]
  },
  word_challenges: [{ question: "Pick a word", options: ["This", "That"], correct_index: 1 }],
  suspense_builder: {
    title: "Build it",
    template: ["A ", 0, " day"],
    slots: [{ options: ["bright", "dark"], correct: 1 }]
  },
  planner_fields: [{ key: "topic", label: "Topic", hint: "Your idea" }],
  spelling: { focus: "Vowels", words: [{ word: "spelling" }], check: [] },
  quiz: [
    { type: "multiple_choice", question: "Which?", options: ["A", "B"], correct_index: 1, explanation: "PRIVATE_EXPLANATION" },
    { type: "short_answer", question: "Explain", sample_answer: "PRIVATE_SHORT_ANSWER", marking_guide: "PRIVATE_MARKING_GUIDE" }
  ],
  parent_notes: "Parent: PRIVATE_PARENT_NOTE",
  evidence_instructions: "PRIVATE_EVIDENCE_NOTE",
  offline_alternative: "Write a short story instead",
  printable_resource: { title: "Reading sheet", passage: "A short story", prompts: ["What happened?"] },
  resources: [{ type: "video", title: "Introduction", url: "https://example.com/lesson", prompt: "What did you notice?" }]
};

const built = {
  title: "Personal Quest",
  learning_area: "Mathematics",
  curriculum_refs: ["MA2-AR-01"],
  parent_script: "PRIVATE_TEACHER_SCRIPT",
  teaching_plan: "PRIVATE_TEACHING_PLAN",
  objectives: ["Add two numbers"],
  sections: [{ heading: "Addition", body: "Count the groups" }],
  guided_practice: [{ prompt: "2 + 3", answer: "PRIVATE_GUIDED_ANSWER" }],
  activities: [{ title: "Try it", instructions: "Use your pencil", tasks: [{ prompt: "3 + 4", answer: "PRIVATE_TASK_ANSWER" }] }],
  questions: [{ prompt: "How many?", answer_key: "PRIVATE_QUESTION_ANSWER" }],
  quiz: [{ question: "Choose", options: ["Three", "Four"], correct_index: 1 }],
  answer_key: "PRIVATE_GLOBAL_ANSWER",
  resources: [{ type: "video", title: "Help", url: "https://example.com/v", prompt: "What did you learn?" }],
  offline_alternative: "Use buttons and draw your working"
};

describe("paper lesson packs", () => {
  test("both editions keep Side-Quest visual identity, A4 styles and the actual logo", () => {
    for (const html of [lessonPrintHtml(library), builtLessonPrintHtml(built, { view: "parent" })]) {
      expect(html).toContain("Side-Quest Learning");
      expect(html).toContain('src="/icons/icon-192.png"');
      expect(html).toContain("@page{size:A4;margin:14mm}");
      expect(html).toContain("#1F3B2D");
      expect(html).toContain("#C77B5B");
      expect(html).toContain("sq-foot");
    }
  });

  test("original quest's student workbook converts interactions into writing tasks without leaking parent keys", () => {
    const html = lessonPrintHtml(library);
    expect(html).toContain("Student paper workbook");
    ["Sort the items", "Word cards", "Build it", "Spelling", "Quest check", "Reading sheet", "Offline alternative"].forEach((part) =>
      expect(html).toContain(part)
    );
    expect(html).toContain("Category: ____________________");
    expect(html).toContain("Hand in:");
    ["PRIVATE_CARD_ANSWER", "PRIVATE_PARENT_NOTE", "PRIVATE_SHORT_ANSWER", "PRIVATE_EXPLANATION",
      "PRIVATE_MARKING_GUIDE", "PRIVATE_EVIDENCE_NOTE", "PRIVATE_STEP_EXPLANATION"].forEach((secret) =>
      expect(html).not.toContain(secret)
    );
    expect(html).not.toContain("EN2-RECOM-01");
  });

  test("original quest's parent copy contains notes, curriculum codes and answers", () => {
    const html = lessonPrintHtml(library, { view: "parent" });
    expect(html).toContain("Parent teaching and answer pack");
    ["EN2-RECOM-01", "PRIVATE_CARD_ANSWER", "PRIVATE_PARENT_NOTE", "PRIVATE_SHORT_ANSWER",
      "PRIVATE_MARKING_GUIDE", "PRIVATE_EVIDENCE_NOTE"].forEach((fragment) =>
      expect(html).toContain(fragment)
    );
  });

  test("parent-built student edition hides parent instructions and question keys", () => {
    const html = builtLessonPrintHtml(built);
    expect(html).toContain("Student paper workbook");
    expect(html).toContain("3 + 4");
    expect(html).toContain("Use buttons and draw your working");
    expect(html).toContain("https://example.com/v");
    ["PRIVATE_TEACHER_SCRIPT", "PRIVATE_TEACHING_PLAN", "PRIVATE_GUIDED_ANSWER",
      "PRIVATE_TASK_ANSWER", "PRIVATE_QUESTION_ANSWER", "PRIVATE_GLOBAL_ANSWER"].forEach((secret) =>
      expect(html).not.toContain(secret)
    );
    expect(html).not.toContain("MA2-AR-01");
  });

  test("parent-built teacher edition includes curriculum and answer keys", () => {
    const html = builtLessonPrintHtml(built, { view: "parent" });
    expect(html).toContain("MA2-AR-01");
    expect(html).toContain("PRIVATE_GUIDED_ANSWER");
    expect(html).toContain("PRIVATE_TEACHER_SCRIPT");
    expect(html).toContain("PRIVATE_GLOBAL_ANSWER");
  });

  test("missing optional quiz fields never crash print generation", () => {
    expect(() => builtLessonPrintHtml({ title: "A lesson" })).not.toThrow();
    expect(() => lessonPrintHtml({ title: "A library lesson" })).not.toThrow();
  });

  test("lesson-controlled text is escaped in printable HTML", () => {
    const html = lessonPrintHtml({ title: '<img src=x onerror=alert(1)>', independent_task: "<script>alert(1)</script>" });
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).not.toContain('<img src=x');
    expect(html).toContain("&lt;script&gt;");
    expect(printableSheet({ title: '<b>test</b>' })).toContain("&lt;b&gt;test&lt;/b&gt;");
  });
});
