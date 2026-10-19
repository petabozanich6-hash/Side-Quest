import test from "node:test";
import assert from "node:assert/strict";
import { australianSpelling, localiseGeneratedDraft, AU_LANGUAGE_RULE } from "../src/lessonLanguage.ts";
import { normaliseDraft } from "../src/aiDraft.ts";

test("Australian English is consistent for model-authored lessons, questions and answers", () => {
  assert.match(AU_LANGUAGE_RULE, /Australian English/);
  const spec = { area: "English", topic: "Writing a story", year: "Year 5", goal: "", minutes: 30, delivery: "independent" };
  const lesson = normaliseDraft({
    title: "My Favorite Color", introduction: "Analyze the color of the gray center.",
    sections: [{ heading: "Recognize behavior", body: "Organize the colorful display. A traveler uses gray colors." }],
    worked_examples: [{ title: "An example", problem: "What is your favorite color?", steps: ["Analyze the behavior of a traveler."], answer: "Colorful gray" }],
    guided_practice: [{ prompt: "What's your favorite color?", hint: "Organize the colors.", answer: "Gray" }],
    quiz: [{ question: "Which color is your favorite?", options: ["Gray", "Colorful"], correct_index: 0, explanation: "Gray is a color." }],
    hoard_words: [{ word: "favorite", hint: "A favorite thing." }],
  }, spec);
  assert.equal(lesson.title, "My Favourite Colour");
  assert.equal(lesson.introduction, "Analyse the colour of the grey centre.");
  assert.equal(lesson.sections[0].heading, "Recognise behaviour");
  assert.match(lesson.sections[0].body, /Organise the colourful display/);
  assert.match(lesson.worked_examples[0].steps[0], /Analyse the behaviour of a traveller/);
  assert.equal(lesson.worked_examples[0].answer, "Colourful grey");
  assert.equal(lesson.guided_practice[0].answer, "Grey");
  assert.equal(lesson.quiz[0].options[lesson.quiz[0].correct_index], "Grey");
  assert.equal(lesson.hoard_words[0].word, "favourite");
});

test("Australian localisation protects quotes, CSS, URLs, parent resources and genuine source records", () => {
  const original = 'Change the color, but leave "favorite color" in a quotation and use ' +
    String.fromCharCode(96) + 'background-color: gray;' + String.fromCharCode(96) +
    ' in code. Visit https://example.com/colors for help.';
  const converted = australianSpelling(original);
  assert.match(converted, /^Change the colour/);
  assert.match(converted, /"favorite color"/);
  assert.match(converted, /background-color: gray;/);
  assert.match(converted, /https:\/\/example.com\/colors/);
  assert.equal(australianSpelling("COLOR, Favorite and colorful."), "COLOUR, Favourite and colourful.");
  const raw = { introduction: "My favorite color is gray.", sections: [{ body: "Analyze the color." }],
    texts: [{ kind: "source", content: "A genuine source uses favorite color." }, { kind: "text", content: "Color a gray picture." }] };
  const unchanged = JSON.stringify(raw);
  const lesson = localiseGeneratedDraft(raw, "English", "Color", false);
  assert.equal(lesson.introduction, "My favourite colour is grey.");
  assert.equal(lesson.texts[0].content, raw.texts[0].content);
  assert.equal(lesson.texts[1].content, "Colour a grey picture.");
  assert.equal(JSON.stringify(raw), unchanged, "model input is never mutated");
  assert.deepEqual(localiseGeneratedDraft(raw, "English", "American English spelling comparisons"), raw);
  assert.deepEqual(localiseGeneratedDraft(raw, "Technologies", "CSS basics"), raw);
  assert.deepEqual(localiseGeneratedDraft(raw, "English", "Analyzing a parent passage", true), raw);
});

test("do not rewrite deliberately quoted American spelling or programming code in lessons", () => {
  const spec = { area: "English", topic: "US spelling versus Australian spelling", year: "Year 6", goal: "", minutes: 30, delivery: "independent" };
  const lesson = normaliseDraft({ sections: [{ heading: "Colour and color", body: "In the US, color is used; in Australia, colour." }] }, spec);
  assert.match(lesson.sections[0].body, /In the US, color is used/);
  const programming = normaliseDraft({ sections: [{ heading: "CSS", body: "Use color: red; and background-color: blue;" }] },
    { ...spec, area: "Technologies", topic: "CSS styles" });
  assert.match(programming.sections[0].body, /color: red/);
});
