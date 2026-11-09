// Book Forge editorial logic: the deterministic checks every generated session must pass before any AI review,
// the reviewer's verdict split into blocking errors and non-blocking suggestions, and the feedback carried into the
// next revision. Pure functions only (no hono, no bindings) so they can be unit-tested directly.
//
// A session draft is structured so it can be checked: each student page has an optional explanation, an optional
// labelled worked example and numbered tasks; the answer key is one answer per task number. composeSessionText turns
// a page into the plain text the renderer and editor already use.

export const VISUAL_TYPES = ["counters", "ten-frame", "shapes", "number-cards"] as const;
export type Visual = { type: (typeof VISUAL_TYPES)[number]; count: number; start?: number };
export type WorkedExample = { question: string; working: string; answer: string };
export type Task = { n: number; prompt: string };
export type DraftPage = { title: string; explanation: string; example: WorkedExample | null; tasks: Task[]; visual: Visual | null };
export type SessionDraft = { pages: DraftPage[]; answers: { n: number; answer: string }[] };
export type SessionContext = { year: number; subject: string; title: string; goal: string };
export type Feedback = { kind: "error" | "suggestion"; source: "check" | "reviewer"; text: string };
export type Revision = { draft: SessionDraft | null; feedback: Feedback[]; falsePositives: string[]; attempts: number };
export type ReviewVerdict = { errors: string[]; suggestions: string[]; falsePositives: string[] };

export const LIMITS = {
  pageText: 900, // composed characters per student page
  explanation: 420,
  task: 220,
  answer: 200,
  answersTotal: 1400,
  tasksPerPage: { min: 2, max: 6 },
  tasksPerSession: { min: 5, max: 10 },
  printedLines: { withVisual: 14, plain: 25 }, // same budget as qaBook
  suggestionsKept: 6,
};

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/[ \t]+/g, " ").trim().slice(0, n) : "");
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

/** Reads the model's reply into a draft. Returns null only when the reply has no recognisable session shape. */
export function parseDraft(raw: any): SessionDraft | null {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.pages)) return null;
  const pages: DraftPage[] = raw.pages.slice(0, 4).map((p: any) => {
    const ex = p?.example ?? p?.workedExample;
    const visual = p?.visual && typeof p.visual === "object"
      ? { type: p.visual.type, count: p.visual.count, ...(p.visual.start !== undefined ? { start: p.visual.start } : {}) }
      : null;
    return {
      title: clip(p?.title, 140),
      explanation: clip(p?.explanation, 1000),
      example: ex && typeof ex === "object"
        ? { question: clip(ex.question, 400), working: clip(ex.working, 600), answer: clip(ex.answer, 200) }
        : null,
      tasks: (Array.isArray(p?.tasks) ? p.tasks : []).slice(0, 20).map((t: any) =>
        typeof t === "string"
          ? { n: Number(t.match(/^\s*(\d+)[.)]\s/)?.[1] ?? NaN), prompt: clip(t.replace(/^\s*\d+[.)]\s*/, ""), 600) }
          : { n: Number(t?.n ?? t?.number ?? t?.task), prompt: clip(t?.prompt ?? t?.question ?? t?.text, 600) }),
      visual,
    };
  });
  // Answers as a list of {n, answer}, a list of plain strings (in task order), or a map {"1": "..."}.
  const rawAnswers = Array.isArray(raw.answers)
    ? raw.answers
    : raw.answers && typeof raw.answers === "object"
      ? Object.entries(raw.answers).map(([n, answer]) => ({ n, answer }))
      : [];
  const answers = rawAnswers.slice(0, 30).map((a: any) => {
    const value = typeof a === "string" || typeof a === "number" ? a : a?.answer ?? a?.text;
    return {
      n: typeof a === "object" && a ? Number(a.n ?? a.number ?? a.task) : NaN,
      answer: clip(typeof value === "number" ? String(value) : value, 600),
    };
  });
  return renumber({ pages, answers });
}

/**
 * Fixes numbering slips without changing meaning: tasks numbered per page (1, 2, 1, 2) or with gaps are renumbered
 * 1…N in page order, and each answer moves with its task. Unnumbered tasks and answers pair up by order only when
 * there are exactly as many answers as tasks. Anything ambiguous is left for checkSession to report.
 */
export function renumber(draft: SessionDraft): SessionDraft {
  const tasks = draft.pages.flatMap((p) => p.tasks);
  const ns = tasks.map((t) => t.n);
  const answerNs = draft.answers.map((a) => a.n);
  if (!tasks.length) return draft;
  const allNumbered = ns.every(Number.isInteger), unique = new Set(ns).size === ns.length;
  if (allNumbered && unique) {
    // Answers keyed by the old numbers follow their task to its new number.
    if (ns.every((n, i) => n === i + 1)) return draft;
    const to = new Map(ns.map((n, i) => [n, i + 1]));
    if (!answerNs.every((n) => to.has(n))) return draft;
    let i = 0;
    return {
      pages: draft.pages.map((p) => ({ ...p, tasks: p.tasks.map((t) => ({ ...t, n: ++i })) })),
      answers: draft.answers.map((a) => ({ ...a, n: to.get(a.n)! })),
    };
  }
  // Per-page numbering (or none): pair by order, and only when the answer key is the same length and in order too.
  if (draft.answers.length !== tasks.length) return draft;
  const answersInOrder =
    answerNs.every((n) => !Number.isInteger(n)) ||
    answerNs.every((n, i) => n === ns[i]) ||
    (ns.every((n) => !Number.isInteger(n)) && answerNs.every((n, i) => n === i + 1));
  if (!answersInOrder) return draft;
  let i = 0;
  return {
    pages: draft.pages.map((p) => ({ ...p, tasks: p.tasks.map((t) => ({ ...t, n: ++i })) })),
    answers: draft.answers.map((a, k) => ({ ...a, n: k + 1 })),
  };
}

/** The plain text of one student page, in teaching order: explanation, worked example, then numbered tasks. */
export function composeSessionText(page: DraftPage): string {
  const parts: string[] = [];
  if (page.explanation) parts.push(page.explanation);
  if (page.example)
    parts.push(`Worked example: ${page.example.question}\n${page.example.working}\nAnswer: ${page.example.answer}`);
  if (page.tasks.length) parts.push(page.tasks.map((t) => `${t.n}. ${t.prompt}`).join("\n"));
  return parts.join("\n\n");
}

/** The answer page text: the worked examples first (for reference), then one line per task number. */
export function composeAnswerText(draft: SessionDraft): string {
  return [...draft.answers].sort((a, b) => a.n - b.n).map((a) => `${a.n}. ${a.answer}`).join("\n");
}

export const printedLines = (text: string) =>
  text.split("\n").reduce((n, s) => n + Math.max(1, Math.ceil(s.length / 72)), 0);

// ---------------------------------------------------------------- numbers in text

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
  "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const WORD_RE = new RegExp(`\\b(${WORDS.join("|")}|\\d+)\\b`, "gi");
const toNum = (s: string) => (/^\d+$/.test(s) ? Number(s) : WORDS.indexOf(s.toLowerCase()));
/** Numbers written as digits or as number words up to twenty, in order. */
export const numbersIn = (s: string) => [...s.matchAll(WORD_RE)].map((m) => toNum(m[1]));

/** The count an answer gives: the first number in it, or 0 for "none", "nothing", "empty", "no counters". */
export function answerCount(answer: string): number | null {
  const n = numbersIn(answer);
  if (n.length) return n[0];
  if (/\b(none|nothing|empty|no (counters|dots|objects|shapes|things))\b/i.test(answer)) return 0;
  return null;
}

/** A task that asks about the drawn diagram (rather than, say, asking the child to draw their own). */
const REFERS_TO_DIAGRAM = /\b(the|this) (counters|dots|ten[- ]frame|picture|diagram|shapes|squares|group|set|plate|box)\b|\b(above|below|shown)\b/i;
const ASKS_HOW_MANY = /\bhow many\b|\bcount (the|them)\b|\bwrite the number\b/i;
/** A phrase in the text that states how many objects the diagram has. */
const STATES_COUNT = new RegExp(`\\b(there (?:are|is)|the (?:ten[- ]frame|picture|diagram) (?:shows|has))\\s+(${WORDS.join("|")}|\\d+|no)\\s+(counters?|dots?|objects?|shapes?|squares?)\\b`, "gi");

// ---------------------------------------------------------------- skills that need teaching first

/** Skill families a task can practise. A task in a family needs an explanation or worked example of that family earlier. */
export const SKILLS: { name: string; re: RegExp }[] = [
  { name: "ordering numbers", re: /\b(order|ordering|in order|smallest to (largest|biggest)|largest to smallest|biggest to smallest|from smallest|from largest|sequence)\b/i },
  { name: "comparing amounts", re: /\b(more than|fewer than|less than|greater than|which (group|set) has more|compare|comparing)\b/i },
  { name: "adding", re: /\b(add|plus|altogether|in total|sum)\b|\+/i },
  { name: "taking away", re: /\b(take away|subtract|minus|left over|how many are left)\b|\s-\s/i },
  { name: "skip counting", re: /\b(skip count|count by (twos|fives|tens|2s|5s|10s))\b/i },
  { name: "doubling or halving", re: /\b(double|half|halve|halves)\b/i },
];
const skillsOf = (s: string) => SKILLS.filter((k) => k.re.test(s)).map((k) => k.name);

/** Is this a Foundation number-recognition session (reading numerals), which needs number names and dot patterns? */
export const isNumeralRecognition = (ctx: SessionContext) =>
  ctx.year === 0 && ctx.subject === "Mathematics" &&
  /\b(recogni[sz]e|recogni[sz]ing|recognition|identify|read(ing)?|name|naming)\b.*\b(numerals?|numbers?|number names?)\b|\bnumerals?\b/i.test(`${ctx.title} ${ctx.goal}`);

// ---------------------------------------------------------------- deterministic checks

/**
 * Objective checks that need no AI: structure, numbering, the answer key, diagram counts (zero is valid), length,
 * answers left on student pages, teaching before practice, fresh practice numbers, and the opening numeral session's
 * number-name support. Every message names the page or task so a revision can fix exactly that.
 */
export function checkSession(draft: SessionDraft, ctx: SessionContext): string[] {
  const e: string[] = [];
  if (draft.pages.length !== 2) e.push(`The session must have exactly two student pages (it has ${draft.pages.length}).`);
  const pages = draft.pages.slice(0, 2);
  const tasks = pages.flatMap((p, i) => p.tasks.map((t) => ({ ...t, page: i, prompt: t.prompt })));

  // Structure and length.
  pages.forEach((p, i) => {
    const label = `Page ${i + 1}`;
    if (!p.title) e.push(`${label} needs a title.`);
    if (p.explanation.length > LIMITS.explanation) e.push(`${label}: the explanation is longer than ${LIMITS.explanation} characters; shorten it.`);
    if (p.tasks.length < LIMITS.tasksPerPage.min || p.tasks.length > LIMITS.tasksPerPage.max)
      e.push(`${label} needs ${LIMITS.tasksPerPage.min}–${LIMITS.tasksPerPage.max} numbered tasks (it has ${p.tasks.length}).`);
    const text = composeSessionText(p);
    if (text.length > LIMITS.pageText) e.push(`${label} is too long to print with writing space (${text.length} characters; limit ${LIMITS.pageText}).`);
    const budget = p.visual ? LIMITS.printedLines.withVisual : LIMITS.printedLines.plain;
    if (printedLines(text) > budget) e.push(`${label} needs more than ${budget} printed lines; shorten it.`);
    p.tasks.forEach((t) => {
      if (!t.prompt) e.push(`${label}, task ${t.n || "?"} has no question.`);
      if (t.prompt.length > LIMITS.task) e.push(`Task ${t.n} is longer than ${LIMITS.task} characters.`);
      if (/\banswers?\s*(is|:|=)/i.test(t.prompt)) e.push(`Task ${t.n} shows its answer on the student page; answers belong only in the answer key.`);
    });
  });
  if (!pages[0]?.explanation || pages[0].explanation.length < 40)
    e.push("Page 1 must start with a short explanation that teaches the skill before any practice.");
  if (!pages[0]?.example || !pages[0].example.question || !pages[0].example.answer || !pages[0].example.working)
    e.push("Page 1 needs a complete worked example (question, working and answer) before the practice tasks.");

  // Numbering: 1..N in order across both pages, each answered exactly once.
  if (tasks.length < LIMITS.tasksPerSession.min || tasks.length > LIMITS.tasksPerSession.max)
    e.push(`The session needs ${LIMITS.tasksPerSession.min}–${LIMITS.tasksPerSession.max} practice tasks in total (it has ${tasks.length}).`);
  tasks.forEach((t, i) => {
    if (t.n !== i + 1) e.push(`Tasks must be numbered 1 to ${tasks.length} in order across both pages; found task ${Number.isFinite(t.n) ? t.n : "without a number"} in position ${i + 1}.`);
  });
  const answered = new Map<number, number>();
  for (const a of draft.answers) answered.set(a.n, (answered.get(a.n) || 0) + 1);
  for (const t of tasks) {
    if (!answered.has(t.n)) e.push(`Task ${t.n} has no answer in the answer key.`);
    else if (answered.get(t.n)! > 1) e.push(`Task ${t.n} is answered more than once in the answer key.`);
    else if (!draft.answers.find((a) => a.n === t.n)!.answer) e.push(`The answer for task ${t.n} is empty.`);
  }
  for (const a of draft.answers) if (!tasks.some((t) => t.n === a.n)) e.push(`The answer key has an answer for task ${a.n}, but there is no task ${a.n}.`);
  for (const a of draft.answers) if (a.answer.length > LIMITS.answer) e.push(`The answer for task ${a.n} is longer than ${LIMITS.answer} characters.`);
  if (composeAnswerText(draft).length > LIMITS.answersTotal) e.push(`The answer key is longer than ${LIMITS.answersTotal} characters.`);

  // Diagrams: an integer 0–20 (0 is a valid empty group), and every stated or asked count matches it.
  pages.forEach((p, i) => {
    const label = `Page ${i + 1}`;
    const v = p.visual;
    if (v) {
      const range = v.type === "number-cards" ? [1, 10] : [0, 20];
      if (!(VISUAL_TYPES as readonly string[]).includes(v.type)) e.push(`${label}: diagram type "${v.type}" is not supported.`);
      else if (!Number.isInteger(v.count) || v.count < range[0] || v.count > range[1])
        e.push(`${label}: the diagram count must be a whole number from ${range[0]} to ${range[1]} (got ${JSON.stringify(v.count)}).`);
      if (v.type === "number-cards" && v.start !== undefined && v.start !== 0 && v.start !== 1)
        e.push(`${label}: number cards start at 0 or 1.`);
    }
    const counted = v && v.type !== "number-cards";
    for (const m of composeSessionText(p).matchAll(STATES_COUNT)) {
      const stated = m[2].toLowerCase() === "no" ? 0 : toNum(m[2]);
      if (!counted) e.push(`${label} says "${m[0]}" but has no counting diagram.`);
      else if (stated !== v!.count) e.push(`${label} says "${m[0]}" but the diagram has ${v!.count}.`);
    }
    for (const t of p.tasks) {
      if (!REFERS_TO_DIAGRAM.test(t.prompt)) continue;
      if (!v) { e.push(`Task ${t.n} refers to a picture or diagram, but page ${i + 1} has none.`); continue; }
      if (counted && ASKS_HOW_MANY.test(t.prompt)) {
        const a = draft.answers.find((x) => x.n === t.n);
        const got = a ? answerCount(a.answer) : null;
        if (a && got !== v.count) e.push(`The answer for task ${t.n} gives ${got ?? "no number"}, but the diagram it asks about has ${v.count}.`);
      }
    }
  });

  // Teach before practice: a task practising a skill needs a worked example of that skill earlier in the session
  // (on its own page before the tasks, or on page 1). An explanation alone does not show the learner how.
  const taught: string[] = [];
  pages.forEach((p) => {
    if (p.example) taught.push(...skillsOf(`${p.example.question} ${p.example.working}`));
    for (const t of p.tasks)
      for (const s of skillsOf(t.prompt))
        if (!taught.includes(s)) e.push(`Task ${t.n} practises ${s}, but no worked example before it shows ${s}. Add a worked example of ${s} before task ${t.n}.`);
  });

  // Fresh practice: tasks must not reuse a worked example's numbers or wording, or repeat each other.
  const examples = pages.map((p) => p.example).filter((x): x is WorkedExample => !!x);
  for (const t of tasks) {
    const tn = numbersIn(t.prompt);
    for (const ex of examples) {
      const en = numbersIn(ex.question);
      if (tn.length && en.length && tn.join(",") === en.join(","))
        e.push(`Task ${t.n} uses the same numbers as the worked example (${en.join(", ")}). Practice needs fresh numbers.`);
      else if (norm(t.prompt) === norm(ex.question)) e.push(`Task ${t.n} repeats the worked example word for word.`);
    }
  }
  const seen = new Map<string, number>();
  for (const t of tasks) {
    const k = norm(t.prompt);
    if (k && seen.has(k)) e.push(`Task ${t.n} repeats task ${seen.get(k)} word for word.`);
    else seen.set(k, t.n);
  }

  // Opening numeral session: numerals need their names and dot patterns, and 0 handled as an empty set.
  if (isNumeralRecognition(ctx)) {
    const cards = pages.map((p) => p.visual).find((v) => v?.type === "number-cards");
    if (!cards || pages[0]?.visual?.type !== "number-cards")
      e.push("A numeral-recognition session must show number cards (numeral, number word and dot pattern) on page 1 before practice.");
    else {
      const lo = cards.start ?? 0;
      for (const t of tasks)
        for (const n of numbersIn(t.prompt))
          if (n > 20 || n < lo || n > cards.count) e.push(`Task ${t.n} uses ${n}, which is outside the number cards shown (${lo}–${cards.count}).`);
    }
    const teaching = `${pages[0]?.explanation} ${pages[0]?.example?.question} ${pages[0]?.example?.working}`;
    if (!/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten)\b/i.test(teaching))
      e.push("A numeral-recognition session must say the number names (for example 'three') alongside the numerals in its explanation or worked example.");
  }
  return [...new Set(e)];
}

// ---------------------------------------------------------------- the reviewer

/** Reviewer claims that contradict facts the deterministic checks verified. Each pattern only applies when they passed. */
const FALSE_POSITIVE: { why: string; re: RegExp }[] = [
  { why: "an empty group (0) is a valid count", re: /\b(zero|0|empty|no counters|no objects|nothing)\b.{0,80}\b(invalid|not (valid|allowed|possible|appropriate|suitable)|cannot|can't|should not|shouldn't|must not|confus\w*|impossible|meaningless)\b|\b(invalid|not allowed|cannot count|can't count)\b.{0,80}\b(zero|empty)\b/i },
  { why: "the diagram counts were verified against visual.count", re: /\b(diagram|ten[- ]frame|counters?|picture|visual|dots)\b.{0,80}\b(shows?|has|contains|count|actually)\b.{0,40}\b(\d+|zero|one|two|three|four|five|six|seven|eight|nine|ten)\b.{0,60}\b(but|not|instead|whereas|mismatch|incorrect|wrong)\b/i },
  { why: "every task has exactly one answer in the key", re: /\b(missing|no) answers?\b|\banswer key (is )?(missing|incomplete)\b|\bnot answered\b/i },
  { why: "the labelled worked example may show its answer", re: /\bworked example\b.{0,80}\b(answer|solution)\b.{0,40}\b(shown|given|visible|revealed|on the (student )?page)\b/i },
];

const asList = (v: unknown): string[] =>
  (Array.isArray(v) ? v : []).map((x: any) => clip(typeof x === "string" ? x : x?.issue ?? x?.text ?? "", 300)).filter(Boolean);

/**
 * Splits the reviewer's reply into blocking errors and non-blocking suggestions, and drops errors that contradict
 * the deterministic checks (recorded as false positives). Accepts the older {pass, issues} shape as errors.
 */
export function reconcileReview(raw: any): ReviewVerdict {
  const errors = asList(raw?.errors ?? raw?.issues);
  const suggestions = asList(raw?.suggestions).slice(0, LIMITS.suggestionsKept);
  const kept: string[] = [], falsePositives: string[] = [];
  for (const err of errors) {
    const fp = FALSE_POSITIVE.find((f) => f.re.test(err));
    if (fp) falsePositives.push(`${err} (ignored: ${fp.why})`);
    else kept.push(err);
  }
  // A reviewer that says "fail" but names no error gives nothing to fix; treat it as an error so it is retried.
  if (!kept.length && raw?.pass === false && !errors.length) kept.push("The reviewer did not approve the session but named no specific error.");
  return { errors: kept, suggestions, falsePositives };
}

/** Adds new feedback to the old, de-duplicated (case and punctuation ignored), errors first, suggestions capped. */
export function mergeFeedback(old: Feedback[], add: Feedback[]): Feedback[] {
  const seen = new Set<string>();
  const out: Feedback[] = [];
  for (const f of [...old, ...add]) {
    const k = `${f.kind}:${norm(f.text)}`;
    if (!f.text || seen.has(k)) continue;
    seen.add(k);
    out.push(f);
  }
  const errors = out.filter((f) => f.kind === "error");
  const suggestions = out.filter((f) => f.kind === "suggestion").slice(-LIMITS.suggestionsKept);
  return [...errors, ...suggestions];
}

// ---------------------------------------------------------------- prompts

const yearName = (year: number) => (year === 0 ? "Foundation" : `Year ${year}`);

/**
 * The session shape, as valid JSON the model can copy. The reply is constrained by SESSION_SCHEMA
 * (bookForgeStructured.ts); "example" may be left out on page 2 and "visual" on any page without a diagram.
 * visual.type is one of counters, ten-frame, shapes, number-cards.
 */
export const DRAFT_SHAPE = `{"pages":[{"title":"...","explanation":"...","example":{"question":"...","working":"...","answer":"..."},"tasks":[{"n":1,"prompt":"..."},{"n":2,"prompt":"..."},{"n":3,"prompt":"..."}],"visual":{"type":"ten-frame","count":7}},{"title":"...","explanation":"...","tasks":[{"n":4,"prompt":"..."},{"n":5,"prompt":"..."},{"n":6,"prompt":"..."}]}],"answers":[{"n":1,"answer":"..."},{"n":2,"answer":"..."},{"n":3,"answer":"..."},{"n":4,"answer":"..."},{"n":5,"answer":"..."},{"n":6,"answer":"..."}]}`;
const SHAPE_NOTE = 'Top-level keys are exactly "pages" (two student pages) and "answers". Leave "example" out of page 2 if it needs none; leave "visual" out of a page with no diagram. visual.type is counters, ten-frame, shapes or number-cards.';
export const PAGE_SHAPE = `{"title":"...","explanation":"...","example":{"question":"...","working":"...","answer":"..."},"tasks":[{"n":1,"prompt":"..."},{"n":2,"prompt":"..."},{"n":3,"prompt":"..."}],"visual":{"type":"counters","count":5}}`;

/** The rules a session is written and revised against (shared by the writer and the reviser). */
export function writingRules(ctx: SessionContext): string {
  const rules = [
    "TEACH BEFORE PRACTICE: page 1 opens with a short explicit explanation (40–420 characters) and a complete worked example (question, working, answer) of exactly the skill practised. If page 2 practises a different skill (for example ordering), give page 2 its own worked example of that skill before its tasks.",
    `PRACTICE: ${LIMITS.tasksPerSession.min}–${LIMITS.tasksPerSession.max} tasks in total, ${LIMITS.tasksPerPage.min}–${LIMITS.tasksPerPage.max} per page, numbered 1, 2, 3… continuing across both pages. Practice uses FRESH numbers and items, never the worked example's numbers. No two tasks the same. Progress from supported to independent; page 2 ends with one simple real-world challenge.`,
    "ANSWER KEY: exactly one answer per task number, each correct and complete. Never put answers in the tasks; only the worked example shows its answer.",
    "DIAGRAMS are drawn by code from visual: counters, ten-frame or shapes with count 0–20, or number-cards (numeral, number word and dot pattern for each number from start to count, count 1–10). One diagram per page. A count of 0 is a valid EMPTY group: use it deliberately to teach zero. Any task about 'the counters/ten-frame/picture' asks about that page's diagram and its answer must equal visual.count. If the page has no visual, never refer to a picture.",
    `LENGTH: each student page's explanation, example and tasks together under ${LIMITS.pageText} characters; short instructions for ${yearName(ctx.year)} learners; no emoji; no references to missing resources.`,
  ];
  if (isNumeralRecognition(ctx))
    rules.push("NUMERAL RECOGNITION: page 1 visual must be number-cards covering every number used (start 0 to teach zero as 'none'). The explanation and worked example say each numeral with its number name (e.g. '3 — three') and link it to the dot pattern. Include 0 as an empty set. Teach ordering with its own worked example before any ordering task.");
  return rules.map((r, i) => `${i + 1}. ${r}`).join("\n");
}

export function writePrompt(o: { ctx: SessionContext; brief: string; sessionNumber: number; sequence: unknown; plan: unknown }): string {
  return `Write session ${o.sessionNumber} of this original Side-Quest ${yearName(o.ctx.year)} ${o.ctx.subject} workbook. Brief: ${o.brief}
Sequence: ${JSON.stringify(o.sequence)}
THIS SESSION: ${JSON.stringify(o.plan)}
Rules:
${writingRules(o.ctx)}
Return ONLY one JSON object in this shape: ${DRAFT_SHAPE}
${SHAPE_NOTE}`;
}

/**
 * Revision prompt. Only the problems the CURRENT draft still has are listed as must-fix; problems fixed in earlier
 * attempts are listed separately as "keep fixed", so the writer is never told to fix something already fixed
 * (stale problems contradicting new ones made revisions thrash). Format problems from an unusable reply are listed
 * on their own so a formatting slip is corrected without rewriting the teaching.
 */
export function revisePrompt(o: { ctx: SessionContext; plan: unknown; draft: SessionDraft | null; feedback: Feedback[]; resolved?: string[]; format?: string[] }): string {
  const errors = o.feedback.filter((f) => f.kind === "error").map((f) => `- ${f.text}`).join("\n");
  const suggestions = o.feedback.filter((f) => f.kind === "suggestion").map((f) => `- ${f.text}`).join("\n");
  const resolved = (o.resolved || []).slice(-12).map((t) => `- ${t}`).join("\n");
  const format = (o.format || []).map((t) => `- ${t}`).join("\n");
  return `Revise this ${yearName(o.ctx.year)} ${o.ctx.subject} workbook session. Keep everything that was correct; fix ONLY the problems listed. Do not introduce new problems, and re-check every earlier problem is still fixed.
THIS SESSION: ${JSON.stringify(o.plan)}
PREVIOUS DRAFT: ${JSON.stringify(o.draft)}
PROBLEMS TO FIX (all must be fixed):
${errors || "- (none recorded)"}
${resolved ? `ALREADY FIXED IN EARLIER ATTEMPTS (keep them fixed):\n${resolved}\n` : ""}${format ? `YOUR LAST REPLY COULD NOT BE USED (formatting only; keep the teaching, fix the format):\n${format}\n` : ""}OPTIONAL IMPROVEMENTS (apply only if they do not break any rule):
${suggestions || "- none"}
Rules:
${writingRules(o.ctx)}
Return the COMPLETE revised session as ONLY one JSON object in this shape: ${DRAFT_SHAPE}
${SHAPE_NOTE}`;
}

/**
 * One student page on its own, used when a whole session is too large to come back reliably in one reply.
 * Page 2 is written against the saved page 1, and numbering continues from it.
 */
export function pagePrompt(o: { ctx: SessionContext; brief: string; sessionNumber: number; plan: unknown; page: 1 | 2; page1?: DraftPage; format?: string[] }): string {
  const first = o.page === 1;
  const next = first ? 1 : (o.page1?.tasks.length || 0) + 1;
  const format = (o.format || []).map((t) => `- ${t}`).join("\n");
  return `Write student PAGE ${o.page} of 2 for session ${o.sessionNumber} of this original Side-Quest ${yearName(o.ctx.year)} ${o.ctx.subject} workbook. Brief: ${o.brief}
THIS SESSION: ${JSON.stringify(o.plan)}
${first ? "This page teaches the skill: a short explanation, a complete worked example, then 2–5 practice tasks." : `PAGE 1 (already written and saved; do not repeat it): ${JSON.stringify(o.page1)}
This page continues the practice: 2–5 tasks numbered from ${next}, using fresh numbers, ending with one simple real-world challenge. If it practises a skill page 1 did not show, give it its own worked example first.`}
Tasks are numbered ${next}, ${next + 1}, ${next + 2}… Do not include answers; the answer key is written separately.
Rules for the whole session:
${writingRules(o.ctx)}
${format ? `YOUR LAST REPLY COULD NOT BE USED (formatting only):\n${format}\n` : ""}Return ONLY one JSON object for this single page in this shape: ${PAGE_SHAPE}
Leave "example" out only on page 2 when it needs none; leave "visual" out if the page has no diagram.`;
}

/** The answer key for two saved pages: exactly one answer per task number. */
export function answersPrompt(o: { ctx: SessionContext; plan: unknown; pages: DraftPage[]; format?: string[] }): string {
  const ns = o.pages.flatMap((p) => p.tasks.map((t) => t.n));
  const format = (o.format || []).map((t) => `- ${t}`).join("\n");
  return `Write the adult answer key for this ${yearName(o.ctx.year)} ${o.ctx.subject} workbook session.
THIS SESSION: ${JSON.stringify(o.plan)}
STUDENT PAGES: ${JSON.stringify(o.pages)}
Give exactly one correct, complete answer for each task number: ${ns.join(", ")}. For a task about a page's diagram, the answer must match that diagram's count. Accept reasonable alternatives in the same answer. Each answer under 200 characters.
${format ? `YOUR LAST REPLY COULD NOT BE USED (formatting only):\n${format}\n` : ""}Return ONLY: {"answers":[{"n":${ns[0] ?? 1},"answer":"..."}]}`;
}

export function reviewPrompt(o: { ctx: SessionContext; plan: unknown; draft: SessionDraft }): string {
  return `Independently review this ${yearName(o.ctx.year)} ${o.ctx.subject} workbook session before it is printed for families.
Session plan: ${JSON.stringify(o.plan)}
Draft: ${JSON.stringify(o.draft)}
Already verified by code (do NOT report these): task numbering matches the answer key; every task has an answer; diagram counts match visual.count; a count of 0 is a valid empty group; the labelled worked example may show its answer.
Check:
1. Is every answer mathematically and factually correct?
2. Is the skill explicitly taught (explanation plus worked example) before independent practice, including any second skill on page 2?
3. Do practice tasks use different numbers or items from the worked example?
4. Is the session suitable for ${yearName(o.ctx.year)} learners and does it match its goal: ${JSON.stringify((o.plan as any)?.goal ?? "")}?
5. Is every task unambiguous and possible without missing pictures or resources?
"errors" are only OBJECTIVE problems that make the session wrong or unusable: a wrong answer, a mismatched or missing answer, missing teaching before practice, practice copying the example, unsuitable content, an ambiguous or impossible task. Each error names the page or task. Style preferences go in "suggestions" and never block. Use an empty list when there are none.
Return {"errors":["..."],"suggestions":["..."]}.`;
}
