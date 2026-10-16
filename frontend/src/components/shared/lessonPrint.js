// One paper-print renderer for the original library quests and parent/AI-built lessons.
// No UI buttons, answers, or parent-only prompts are included in the student edition.
const escape = (value = "") => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));
const text = (value) => escape(value).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
const list = (value) => Array.isArray(value) ? value.filter((item) => item != null) : value != null && value !== "" ? [value] : [];
const childText = (value = "") => String(value ?? "")
  .split(/\n\s*\n/)
  .filter((paragraph) => !/^\s*(Parent|Grown-up|Grown up)\s*(note|check)?\s*:/i.test(paragraph))
  .join("\n\n");

const writingLines = (count = 2) => '<div class="answer-space">' +
  Array.from({ length: count }, () => '<div class="writing-line"></div>').join("") + "</div>";
const section = (title, value, view = "student") => {
  const readable = view === "parent" ? value : childText(value);
  return readable ? "<section><h2>" + escape(title) + "</h2><p>" + text(readable) + "</p></section>" : "";
};
const answer = (value) => value == null || value === "" ? "" :
  '<div class="answer"><b>Parent key:</b> ' + text(value) + "</div>";
const bullets = (values) => list(values).length ?
  "<ul>" + list(values).map((item) => "<li>" + text(typeof item === "object" ? item.label || item.code || item.title || "" : item) + "</li>").join("") + "</ul>" : "";

// Render lesson diagrams without copying scripts, event handlers or external resources
// from SVG strings into the new print window.
function safePrintableSvg(markup) {
  if (!markup || typeof DOMParser === "undefined") return "";
  const doc = new DOMParser().parseFromString(String(markup), "image/svg+xml");
  const root = doc.documentElement;
  if (!root || root.localName !== "svg") return "";
  const elements = new Set(["svg", "g", "path", "circle", "ellipse", "rect", "line",
    "polyline", "polygon", "text", "tspan", "defs", "clipPath", "linearGradient",
    "radialGradient", "stop", "marker", "title", "desc"]);
  const attributes = new Set(["xmlns", "viewBox", "width", "height", "x", "y", "x1", "y1", "x2", "y2",
    "cx", "cy", "r", "rx", "ry", "d", "points", "stroke", "stroke-width", "stroke-linecap",
    "stroke-linejoin", "stroke-dasharray", "stroke-opacity", "fill", "fill-opacity",
    "opacity", "transform", "text-anchor", "font-size", "font-weight", "font-family",
    "letter-spacing", "id", "offset", "stop-color", "stop-opacity", "clip-path",
    "marker-end", "marker-start", "gradientUnits", "gradientTransform", "spreadMethod"]);
  const clean = (node) => {
    if (node.nodeType === 3) return;
    if (node.nodeType !== 1 || !elements.has(node.localName)) { node.remove(); return; }
    Array.from(node.attributes).forEach((attr) => {
      const value = attr.value || "";
      if (!attributes.has(attr.name) ||
          /(?:javascript:|data:|https?:|@import|expression\s*\()/i.test(value) ||
          (/(url\s*\()/i.test(value) && !/^url\(#[A-Za-z0-9_-]+\)$/.test(value.trim()))) {
        node.removeAttribute(attr.name);
      }
    });
    Array.from(node.childNodes).forEach(clean);
  };
  clean(root);
  return root.outerHTML;
}

function printableVisuals(values) {
  return list(values).map((visual) => {
    if (!visual || typeof visual !== "object") return "";
    if (visual.episode) return section(visual.episode.title || "Illustration", visual.episode.transcript);
    const graphic = safePrintableSvg(visual.svg);
    return graphic || visual.alt || visual.caption ?
      '<figure class="visual-description">' + graphic +
      (visual.alt ? '<p><b>Visual:</b> ' + text(visual.alt) + "</p>" : "") +
      (visual.caption ? "<figcaption>" + text(visual.caption) + "</figcaption>" : "") +
      "</figure>" : "";
  }).join("");
}

function printShell(lesson, view, body) {
  const parent = view === "parent";
  const meta = [lesson.stage, lesson.learning_area, lesson.year_level,
    lesson.duration_minutes ? String(lesson.duration_minutes) + " min" : ""].filter(Boolean);
  return '<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">' +
    "<title>" + escape(lesson.title || "Side-Quest lesson") + " — " + (parent ? "Parent guide" : "Student workbook") + "</title>" +
    '<style>@page{size:auto;margin:15mm}body{font:15px/1.5 Arial,sans-serif;color:#18382b;max-width:780px;margin:24px auto;padding:0 16px}' +
    'h1{font-size:26px;margin:0 0 4px}h2{font-size:19px;margin:24px 0 7px;break-after:avoid}h3{font-size:16px;margin:12px 0 6px}' +
    'p,li{white-space:normal;overflow-wrap:anywhere}p{margin:6px 0 10px}li{margin:4px 0}section{margin:12px 0}' +
    '.meta{color:#475569}.edition{font-weight:bold;color:#365a45;text-transform:uppercase;font-size:12px;letter-spacing:.08em}' +
    '.name{display:flex;gap:20px;margin:14px 0}.name span{border-bottom:1px solid #555;flex:1;padding:6px 0}' +
    '.answer-space{margin:5px 0 15px}.writing-line{height:27px;border-bottom:1px solid #aaa}' +
    '.question{margin:12px 0;break-inside:avoid}.answer{background:#f1f5f1;border-left:3px solid #56755f;padding:7px 10px;margin:6px 0}' +
    '.visual-description svg{display:block;width:100%;height:auto;max-height:380px}.print-note{border:1px solid #b8c7bd;padding:10px;margin:12px 0}.choices{list-style:none;padding-left:9px}' +
    '.choices li{margin:5px 0}.break{break-before:page}.visual-description{border:1px solid #d2d8d4;padding:9px;margin:10px 0}' +
    '.print-actions{margin:0 0 16px;display:flex;gap:10px}.print-actions button{background:#18382b;color:white;border:0;border-radius:6px;padding:9px 14px;cursor:pointer}' +
    'a{color:#18382b}section,figure,.question{break-inside:avoid-page}' +
    '@media print{body{margin:0;padding:0;max-width:none}.print-actions{display:none}h1,h2,h3{break-after:avoid}.break{break-before:page}}' +
    '</style></head><body><div class="print-actions"><button onclick="window.print()">Print or save as PDF</button></div>' +
    '<header><div class="edition">' + (parent ? "Parent teaching and answer pack" : "Student paper workbook") + "</div>" +
    "<h1>" + escape(lesson.title || "Side-Quest lesson") + "</h1><p class=\"meta\">" + escape(meta.join(" · ")) + "</p>" +
    (parent ? "" : '<div class="name"><span>Name:</span><span>Date:</span></div>') +
    "</header>" + body +
    (parent ? "" : '<section class="print-note"><b>Hand in:</b> Give your finished pages to your parent, or photograph them and upload them as lesson evidence when online.</section>') +
    "</body></html>";
}

function choiceQuestion(q, index, view = "student") {
  if (!q || typeof q !== "object") return "";
  const parent = view === "parent";
  const prompt = q.question || q.prompt || q.ask || "";
  const options = list(q.options);
  const choices = options.length ? '<ul class="choices">' + options.map((option, j) =>
    "<li>" + (parent && j === q.correct_index ? "✔" : "☐") + " " + text(option) + "</li>").join("") + "</ul>" : "";
  const key = q.answer_key || q.sample_answer || q.answer || q.expected ||
    (typeof q.correct_index === "number" ? options[q.correct_index] : "");
  return '<div class="question"><p><b>' + (index + 1) + ".</b> " + text(prompt) + "</p>" +
    choices + (options.length ? "" : parent ? "" : writingLines(q.type === "long" || q.type === "short_answer" ? 4 : 2)) +
    (parent ? answer(key) + (q.explanation ? section("Explanation", q.explanation, view) : "") +
      (q.marking_guide ? section("Marking guide", q.marking_guide, view) : "") : "") + "</div>";
}
function choiceSet(label, questions, view = "student") {
  return list(questions).length ?
    "<section><h2>" + escape(label) + "</h2>" +
    list(questions).map((q, i) => choiceQuestion(q, i, view)).join("") + "</section>" : "";
}

function interactivePaper(lesson, view) {
  const parent = view === "parent";
  let out = "";
  list(lesson.interactive_activities).forEach((activity) => {
    if (!activity || typeof activity !== "object") return;
    if (activity.type === "flip_cards") {
      out += "<section><h2>" + escape(activity.title || "Vocabulary cards") + "</h2>" +
        "<p>For each card, explain the idea in your own words.</p>" +
        list(activity.cards).map((card, i) => '<div class="question"><p><b>' + (i + 1) + ".</b> " +
          text(card.front) + "</p>" + (parent ? answer(card.back) : writingLines(2)) + "</div>").join("") + "</section>";
    } else {
      out += section(activity.title || "Interactive activity on paper",
        activity.instructions || activity.description || "Explain or demonstrate this activity on paper.", view);
    }
  });
  const sort = lesson.sort_activity;
  if (sort && list(sort.items).length) {
    const buckets = list(sort.buckets);
    out += "<section><h2>Sort the items</h2>" +
      section("Instructions", sort.instructions || "Write the correct category beside each item.", view) +
      "<p><b>Categories:</b> " + text(buckets.join(" / ")) + "</p>" +
      list(sort.items).map((item, i) => '<div class="question"><p><b>' + (i + 1) + ".</b> " +
        text(item.text) + "</p>" + (parent ? answer(buckets[item.answer] || "Check the intended category") :
        "<p>Category: ____________________</p>") + "</div>").join("") + "</section>";
  }
  out += choiceSet("Word power — choose the correct word", lesson.word_challenges, view);
  const builder = lesson.suspense_builder;
  if (builder && list(builder.slots).length) {
    const slots = list(builder.slots);
    out += "<section><h2>" + escape(builder.title || "Build a sentence") + "</h2>" +
      section("Instructions", builder.instructions, view) +
      '<p class="question">' + list(builder.template).map((part) =>
        typeof part === "string" ? text(part) : "__________").join(" ") + "</p>" +
      slots.map((slot, i) => '<p><b>Blank ' + (i + 1) + " choices:</b> " + text(list(slot.options).join(" / ")) +
        (parent && Number.isInteger(slot.correct) ? " — Correct: " + text(slot.options[slot.correct]) : "") + "</p>").join("") +
      (parent ? "" : writingLines(2)) + "</section>";
  }
  if (list(lesson.planner_fields).length) {
    out += "<section><h2>" + escape(lesson.planner_title || "Plan your work") + "</h2>" +
      section("Instructions", lesson.planner_intro, view) +
      list(lesson.planner_fields).map((field) => "<p><b>" + text(field.label) + "</b>" +
        (field.hint ? " — " + text(field.hint) : "") + "</p>" + writingLines(3)).join("") + "</section>";
  }
  const spelling = lesson.spelling;
  if (spelling && (list(spelling.words).length || spelling.teaching)) {
    out += "<section><h2>Spelling" + (spelling.focus ? ": " + escape(spelling.focus) : "") + "</h2>" +
      section("Learn it", spelling.teaching, view) +
      "<p>Read each word. Cover it, say it, write it from memory, then check your spelling.</p>" +
      list(spelling.words).map((w, i) => '<div class="question"><p><b>' + (i + 1) + ".</b> " +
        text(w.word || w.text || w.answer || "") + (w.tip ? " — " + text(w.tip) : "") +
        "</p>" + (parent ? "" : writingLines(2)) + "</div>").join("") +
      choiceSet("Spelling check", spelling.check, view) + "</section>";
  }
  return out;
}
function resourcesPaper(lesson, view) {
  const resources = list(lesson.resources);
  if (!resources.length) return "";
  let out = "<section><h2>Resources and videos</h2>";
  resources.forEach((resource) => {
    const validLink = /^https?:\/\//i.test(resource.url || "") ? resource.url : "";
    out += '<div class="question"><h3>' + escape(resource.title || "Resource") + "</h3>" +
      (validLink ? "<p>Optional online link: " + text(validLink) + "</p>" : "") +
      (resource.type === "video" ? "<p>This video cannot be printed. Use the paper lesson and its offline activity instead.</p>" : "") +
      (resource.prompt ? section("Think about", resource.prompt, view) + writingLines(2) : "") +
      (resource.check ? choiceQuestion(resource.check, 0, view) : "") + "</div>";
  });
  return out + "</section>";
}

export function printableSheet(resource) {
  if (!resource) return "";
  return '<section class="reading-sheet break"><h2>' + escape(resource.title || "Reading sheet") + "</h2>" +
    section("Instructions", resource.instructions) + section("Read", resource.passage) +
    list(resource.prompts).map((prompt, i) => '<div class="question"><p><b>' + (i + 1) +
      ".</b> " + text(prompt) + "</p>" + writingLines(4) + "</div>").join("") + "</section>";
}

// Original curated/library quest shape.
export function lessonPrintHtml(lesson, options = {}) {
  const view = options.view === "parent" ? "parent" : "student";
  const parent = view === "parent";
  const steps = list(lesson.teach_steps).map((step, i) =>
    '<section><h2>' + (i + 1) + ". " + escape(step.title || "Learn") + "</h2>" +
    section("Learn", step.explain, view) + printableVisuals(step.visual_before) +
    section("Example", step.example, view) + printableVisuals(step.visual) +
    section("Notice", step.notice, view) +
    (step.check ? choiceSet("Try it", [step.check], view) : "") + "</section>").join("");
  const body =
    (parent && list(lesson.outcome_codes).length ? section("Curriculum outcome codes", list(lesson.outcome_codes)
      .map((c) => typeof c === "string" ? c : c.code).join(", "), view) : "") +
    section("Your mission", lesson.child_mission, view) +
    section("Learning intention", lesson.learning_intention, view) +
    (list(lesson.success_criteria).length ? "<section><h2>Success criteria</h2>" +
      bullets(lesson.success_criteria) + "</section>" : "") +
    (list(lesson.materials).length ? section("Materials", list(lesson.materials).join(", "), view) : "") +
    section("Learn it", lesson.explicit_teaching, view) + steps +
    section("Worked example", lesson.worked_example, view) + printableVisuals(lesson.worked_visuals) +
    interactivePaper(lesson, view) +
    section("Guided practice", lesson.guided_practice, view) +
    (lesson.guided_practice && !parent ? writingLines(4) : "") +
    section("Your task", lesson.independent_task, view) +
    (!parent && lesson.independent_task ? writingLines(6) : "") +
    section("Reflect", lesson.response_prompt, view) +
    (!parent && lesson.response_prompt ? writingLines(3) : "") +
    resourcesPaper(lesson, view) +
    choiceSet("Quest check", lesson.quiz, view) +
    printableSheet(lesson.printable_resource) +
    section("Offline alternative", lesson.offline_alternative, view) +
    section("Extension", lesson.extension, view) +
    (parent ? section("Parent notes", lesson.parent_notes, view) +
      section("Evidence to collect", lesson.evidence_instructions, view) +
      section("Suggested answers", lesson.answer_key, view) : "");
  return printShell(lesson, view, body);
}

// Parent/AI-built lesson shape. Same student/parent paper editions as library quests.
export function builtLessonPrintHtml(lesson, options = {}) {
  const view = options.view === "parent" ? "parent" : "student";
  const parent = view === "parent";
  const body =
    (parent ? section("Curriculum outcome codes", list(lesson.curriculum_refs).join(", "), view) +
      section("Teaching plan", lesson.teaching_plan, view) : "") +
    (list(lesson.objectives).length ? "<section><h2>Learning goals</h2>" + bullets(lesson.objectives) + "</section>" : "") +
    (list(lesson.materials).length ? section("Materials", list(lesson.materials).join(", "), view) : "") +
    section("Introduction", lesson.introduction, view) +
    (parent ? section("Parent teaching script", lesson.parent_script, view) +
      section("Why it matters", lesson.why_it_matters, view) +
      list(lesson.teaching_questions).map((q, i) => choiceQuestion(q, i, view)).join("") : "") +
    list(lesson.texts).map((t) => section(t.title || "Reading", t.content, view)).join("") +
    list(lesson.sections).map((s) => "<section><h2>" + escape(s.heading || "Learn it") + "</h2>" +
      section("Learn", s.body, view) + printableVisuals(s.visual) + "</section>").join("") +
    list(lesson.worked_examples).map((w, i) => "<section><h2>Worked example " + (i + 1) +
      ": " + escape(w.title || "") + "</h2>" +
      section("Problem", w.problem, view) + printableVisuals(w.visual) +
      (list(w.steps).length ? "<ol>" + list(w.steps).map((s) => "<li>" + text(s) + "</li>").join("") + "</ol>" : "") +
      section("Worked answer", w.answer, view) + "</section>").join("") +
    (parent ? list(lesson.misconceptions).map((m) => section("Common mistake: " + m.mistake, m.fix, view)).join("") : "") +
    choiceSet("Practise together", lesson.guided_practice, view) +
    list(lesson.activities).map((activity, i) => "<section><h2>Activity " + (i + 1) +
      ": " + escape(activity.title || "") + "</h2>" +
      section("Instructions", activity.instructions, view) + printableVisuals(activity.visual) +
      list(activity.tasks).map((task, j) => choiceQuestion(task, j, view)).join("") + "</section>").join("") +
    choiceSet("Show what you know", lesson.questions, view) +
    choiceSet("Quick quiz", list(lesson.quiz).map((q) => ({ ...q, question: q.question || q.prompt })), view) +
    resourcesPaper(lesson, view) +
    section("Wrap-up", lesson.consolidation, view) +
    section("Challenge", lesson.extension, view) +
    section("Offline alternative", lesson.offline_alternative, view) +
    (parent ? section("Support your child", lesson.support, view) +
      section("Answer key", lesson.answer_key, view) +
      section("Evidence to collect", list(lesson.evidence_suggestions).join("\n"), view) : "");
  return printShell(lesson, view, body);
}

// Opens a print document without relying on the authenticated parent-only /print route.
// Child accounts can print their assigned student edition, never the parent guide.
export function openPaperLesson(lesson, { view = "student", type = "library" } = {}) {
  const printable = window.open("", "_blank");
  if (!printable) return false;
  printable.document.write(type === "built" ? builtLessonPrintHtml(lesson, { view }) : lessonPrintHtml(lesson, { view }));
  printable.document.close();
  return true;
}
