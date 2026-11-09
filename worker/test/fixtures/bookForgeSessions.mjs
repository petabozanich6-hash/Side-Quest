// Book Forge session drafts in the structured shape the writer returns (see worker/src/bookForgeEditorial.ts).

/** The opening Foundation mathematics session: numerals 0–10 with their names, then ordering. */
export const OPENING_PLAN = {
  title: "Meet the numbers 0 to 10",
  goal: "Recognise and name numerals 0 to 10, including zero, and put small numbers in order.",
  code: "AC9MFN01",
  lessonId: "forge-test-1",
};
export const OPENING_CTX = { year: 0, subject: "Mathematics", title: OPENING_PLAN.title, goal: OPENING_PLAN.goal };

export const openingGood = () => ({
  pages: [
    {
      title: "Numbers have names",
      explanation:
        "Every number has a numeral and a name. The numeral 3 is called three, and three dots show three. Zero means none: the card for 0 has no dots. Point to each card and say its name.",
      example: {
        question: "Which card shows four?",
        working: "Find the numeral 4. Read its name: four. Count the dots: one, two, three, four.",
        answer: "The card with 4, the word four and four dots.",
      },
      tasks: [
        { n: 1, prompt: "Point to the card for 7 and say its name." },
        { n: 2, prompt: "Write the numeral for the name five." },
        { n: 3, prompt: "Find the card with no dots. Write its numeral." },
      ],
      visual: { type: "number-cards", count: 10, start: 0 },
    },
    {
      title: "Put the numbers in order",
      explanation: "When we count, each number is one more than the number before it.",
      example: {
        question: "Put 6, 2 and 4 in order from smallest to largest.",
        working: "Count from zero and listen for each number: 2 comes first, then 4, then 6.",
        answer: "2, 4, 6",
      },
      tasks: [
        { n: 4, prompt: "Put 3, 9 and 1 in order from smallest to largest." },
        { n: 5, prompt: "Put 8, 5 and 7 in order from smallest to largest." },
        { n: 6, prompt: "Which number comes just after 0 when you count?" },
        { n: 7, prompt: "Real-world challenge: find 2 spoons in the kitchen, line them up, count them and write the numeral." },
      ],
      visual: null,
    },
  ],
  answers: [
    { n: 1, answer: "The learner points to 7 and says seven." },
    { n: 2, answer: "5" },
    { n: 3, answer: "0 (zero has no dots)." },
    { n: 4, answer: "1, 3, 9" },
    { n: 5, answer: "5, 7, 8" },
    { n: 6, answer: "1" },
    { n: 7, answer: "2 — the learner writes 2." },
  ],
});

/** No number cards and no number names: numerals are shown without what they are called. */
export const openingMissingNames = () => {
  const d = openingGood();
  d.pages[0].explanation = "Numerals are symbols we use when we count. Look carefully at each numeral and point to it.";
  d.pages[0].example = { question: "Which card shows 4?", working: "Look for the symbol 4.", answer: "The card with 4." };
  d.pages[0].visual = { type: "counters", count: 4 };
  return d;
};

/** Ordering practice on page 2 with no worked example of ordering anywhere. */
export const openingMissingOrderingExample = () => {
  const d = openingGood();
  d.pages[1].example = null;
  return d;
};

/** Practice repeats the worked example's numbers instead of fresh ones. */
export const openingCopiesExample = () => {
  const d = openingGood();
  d.pages[1].tasks[0] = { n: 4, prompt: "Put 6, 2 and 4 in order from smallest to largest." };
  d.answers[3] = { n: 4, answer: "2, 4, 6" };
  return d;
};

/** A plain counting session, with an empty ten-frame (0) as a deliberate question. */
export const countingSession = () => ({
  pages: [
    {
      title: "Count the woodland treasures",
      explanation:
        "When we count, we touch each object once and say one number for each. The last number we say tells how many there are.",
      example: {
        question: "How many acorns are in a row of 3 acorns?",
        working: "Touch each acorn and count: one, two, three.",
        answer: "3",
      },
      tasks: [
        { n: 1, prompt: "How many counters are in the group above? Write the number." },
        { n: 2, prompt: "Draw 2 circles. Count them and write how many." },
      ],
      visual: { type: "counters", count: 5 },
    },
    {
      title: "Try counting for yourself",
      explanation: "",
      example: null,
      tasks: [
        { n: 3, prompt: "How many counters are in the ten-frame? Write the number." },
        { n: 4, prompt: "Collect 6 stones. Count each stone once and write the number." },
        { n: 5, prompt: "Real-world challenge: put out 4 spoons and 4 cups. Is there one cup for every spoon?" },
      ],
      visual: { type: "ten-frame", count: 0 },
    },
  ],
  answers: [
    { n: 1, answer: "5" },
    { n: 2, answer: "2 circles drawn; the learner writes 2." },
    { n: 3, answer: "0 (zero): the ten-frame is empty." },
    { n: 4, answer: "6" },
    { n: 5, answer: "Yes. 4 spoons and 4 cups match one to one." },
  ],
});
