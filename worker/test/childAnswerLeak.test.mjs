import test from "node:test";
import assert from "node:assert/strict";
import { childFacingPrompt, hasEmbeddedAnswer } from "../src/items.ts";
import { childSafeLesson } from "../src/lessonBuilder.ts";
import { normaliseDraft, qualityIssues, practiceAPrompt, assessmentPrompt } from "../src/aiDraft.ts";

const spec = { topic: "Addition", area: "Mathematics", year: "Year 3", goal: "Add two digit numbers",
  minutes: 30, delivery: "independent", interests: "", needs: "", notes: "" };

test("already assigned child lessons hide explicit answer labels, not the task or worked examples", () => {
  assert.equal(childFacingPrompt("Find 7 + 5.\nCorrect answer: 12"), "Find 7 + 5.");
  assert.equal(childFacingPrompt("What is 7 + 5? Answer: 12"), "What is 7 + 5?");
  assert.equal(childFacingPrompt("What is 7 + 5?"), "What is 7 + 5?");
  assert.equal(hasEmbeddedAnswer("Try 2 + 3? Solution: 5"), true);

  const parent = {
    title: "Addition",
    worked_examples: [{ problem: "2 + 3", steps: ["Add three to two"], answer: "5" }],
    sections: [{ heading: "Teaching", body: "A worked example: 2 + 3 = 5." }],
    guided_practice: [{ kind: "number", prompt: "What is 7 + 5? Answer: 12", hint: "The answer is 12", answer: "12" }],
    activities: [{ title: "More practice", instructions: "Do the questions.\nSolution: 12", tasks: [
      { kind: "number", prompt: "Find 8 + 6.\nAnswer: 14", hint: "Answer: 14", answer: "14" },
    ] }],
    questions: [{ prompt: "What is 9 + 6? Answer: 15", answer_key: "15", type: "short" }],
    quiz: [{ question: "What is 3 + 4? Solution: 7", options: ["6", "7", "8"],
      correct_index: 1, correct: "7", answer: "7", explanation: "The correct answer is 7" }],
    answer_key: "All answers", parent_notes: "Mark the answers carefully",
  };
  const safe = childSafeLesson(parent);
  assert.equal(safe.guided_practice[0].prompt, "What is 7 + 5?");
  assert.equal(safe.guided_practice[0].hint, "");
  assert.equal(safe.activities[0].instructions, "Do the questions.");
  assert.equal(safe.activities[0].tasks[0].prompt, "Find 8 + 6.");
  assert.equal(safe.questions[0].prompt, "What is 9 + 6?");
  assert.equal(safe.quiz[0].question, "What is 3 + 4?");
  assert.deepEqual(safe.quiz[0].options, ["6", "7", "8"]);
  for (const key of ["answer_key", "parent_notes"]) assert.equal(safe[key], undefined);
  for (const key of ["answer", "correct", "correct_index", "explanation"]) assert.equal(safe.quiz[0][key], undefined);
  assert.equal(safe.worked_examples[0].answer, "5", "teaching examples remain worked");
  assert.equal(parent.guided_practice[0].answer, "12", "parent/server key remains intact");
  assert.equal(parent.quiz[0].explanation, "The correct answer is 7");
});

test("AI review rejects answers embedded in student fields and read-only try/check pairs", () => {
  const draft = normaliseDraft({
    title: "Addition",
    sections: [{ heading: "Try and learn", body: "YOU TRY: Work out 7+5.\nCHECK: It is 12." }],
    worked_examples: [{ title: "Example", problem: "2+3", steps: ["Add 2 and 3.", "That makes 5."], answer: "5" }],
    guided_practice: [{ prompt: "Find 7+5? Answer: 12", hint: "Answer is twelve", answer: "12" }],
    activities: [{ title: "Your questions", instructions: "Answer these.\nAnswer: 14", tasks: [{ prompt: "Find 8+6", answer: "14" }] }],
    questions: [{ prompt: "Find 9+6? Solution: 15", answer_key: "15" }],
    quiz: [{ question: "Find 5+4? Answer: 9", options: ["9", "7", "8"], correct_index: 0 }],
  }, spec);
  const issues = qualityIssues(draft, spec);
  assert.ok(issues.some((x) => x.hard && x.repair && /gives the answer away/.test(x.msg)));
  assert.ok(issues.some((x) => x.hard && x.repair && /read-only teaching section/.test(x.msg)));
});

test("generation prompts explicitly separate public tasks and private solutions", () => {
  const design = { practice_plan: "Add tens", misconceptions: [] };
  const taught = { sections: [], worked_examples: [], texts: [] };
  assert.match(practiceAPrompt(spec, design, taught), /Never place an answer or solution in those fields/i);
  assert.match(assessmentPrompt(spec, design, taught), /Never reveal the correct response in a question prompt/i);
});
