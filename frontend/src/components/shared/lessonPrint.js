const escape = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const text = (value) => escape(value).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
const childText = (value = "") => String(value).split(/\n\s*\n/).filter((paragraph) => !/^\s*(Parent|Grown-up|Grown up)\s*(note|check)?\s*:/i.test(paragraph)).join("\n\n");
const list = (value) => Array.isArray(value) ? value : value ? [value] : [];
const section = (title, value) => value ? `<h2>${escape(title)}</h2><p>${text(childText(value))}</p>` : "";
const visuals = (items) => list(items).map((visual) => {
  if (visual.episode) return section(visual.episode.title, visual.episode.transcript);
  // Lesson SVG is validated at authoring time. Text and attributes remain escaped.
  if (visual.svg) return `<figure role="img" aria-label="${escape(visual.alt)}">${visual.svg}<figcaption>${escape(visual.caption || "")}</figcaption></figure>`;
  return "";
}).join("");

export function printableSheet(resource) {
  if (!resource) return "";
  return `<section class="reading-sheet"><h2>${escape(resource.title)}</h2><p>${text(resource.instructions)}</p><p>${text(resource.passage)}</p>${(resource.prompts || []).map((prompt) => `<p>${escape(prompt)}</p><div class="answer-space"></div>`).join("")}</section>`;
}

export function lessonPrintHtml(lesson) {
  const quiz = (lesson.quiz || []).map((question, index) => `<li>${text(question.question)}${question.type === "short_answer" ? '<div class="answer-space"></div>' : `<ul>${(question.options || []).map((option) => `<li>${escape(option)}</li>`).join("")}</ul>`}</li>`).join("");
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>${escape(lesson.title)}</title><style>body{font-family:Arial,sans-serif;max-width:720px;margin:30px auto;padding:0 20px;color:#18382b}h1{font-size:24px}h2{font-size:18px;margin-top:24px}p,li{line-height:1.6}figure{margin:12px 0}svg{max-width:100%;height:auto}figcaption{font-size:13px}.answer-space{height:65px;border-bottom:1px solid #777}.reading-sheet{break-before:page}button{padding:10px}@media print{button{display:none}h2{break-after:avoid}figure{break-inside:avoid}}</style></head><body><button onclick="window.print()">Print or save as PDF</button><h1>${escape(lesson.title)}</h1><p>${escape(lesson.stage)} · ${escape(lesson.learning_area)}</p>${section("Your mission",lesson.child_mission)}${section("Learning intention",lesson.learning_intention)}<h2>Success criteria</h2><ul>${(lesson.success_criteria || []).map((item) => `<li>${escape(item)}</li>`).join("")}</ul>${(lesson.teach_steps || []).map((step,index) => section(`${index+1}. ${step.title}`,step.explain)+visuals(step.visual_before)+section("Example",step.example)+visuals(step.visual)+section("Notice",step.notice)).join("")}${section("Worked example",lesson.worked_example)}${visuals(lesson.worked_visuals)}${section("Guided practice",lesson.guided_practice)}${section("Your task",lesson.independent_task)}${section("Reflect",lesson.response_prompt)}${section("Offline alternative",lesson.offline_alternative)}<h2>Quest check</h2><ol>${quiz}</ol>${printableSheet(lesson.printable_resource)}</body></html>`;
}
