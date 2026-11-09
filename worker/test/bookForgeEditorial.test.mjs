// Book Forge editorial checks, reviewer reconciliation and revision-based retries.
// Unit tests run against the pure module; the job tests run the real Worker against SQLite (fakeD1) with a
// simulated Workers AI, so no inference or rendering is charged.
import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { createSoftAuthenticator } from "./softAuthenticator.mjs";
import worker from "../src/index.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";
import {
  answerCount,
  checkSession,
  composeSessionText,
  mergeFeedback,
  reconcileReview,
} from "../src/bookForgeEditorial.ts";
import { mathDiagram, printSheets, qaBook, renderBook } from "../src/bookForge.ts";
import { processBookForgeJobs, sessionPages } from "../src/bookForgeGeneration.ts";
import {
  OPENING_CTX,
  OPENING_PLAN,
  countingSession,
  openingCopiesExample,
  openingGood,
  openingMissingNames,
  openingMissingOrderingExample,
} from "./fixtures/bookForgeSessions.mjs";

const COUNTING_CTX = { year: 0, subject: "Mathematics", title: "Counting quest 1", goal: "Count objects with one-to-one correspondence." };

// ---------------------------------------------------------------- deterministic checks

test("Editorial: the good opening session and the counting session pass every deterministic check", () => {
  assert.deepEqual(checkSession(openingGood(), OPENING_CTX), []);
  assert.deepEqual(checkSession(countingSession(), COUNTING_CTX), []);
});

test("Editorial: empty groups (0) are valid, drawn as an empty group, and checked against the answer key", () => {
  const d = countingSession();
  assert.equal(d.pages[1].visual.count, 0);
  assert.deepEqual(checkSession(d, COUNTING_CTX), [], "an empty ten-frame question is accepted");
  // Counters with an empty group, answered as "none".
  d.pages[1].visual = { type: "counters", count: 0 };
  d.pages[1].tasks[0].prompt = "How many counters are in the group shown? Write the number.";
  d.answers[2].answer = "None. The group is empty, so the number is zero.";
  assert.equal(answerCount(d.answers[2].answer), 0);
  assert.deepEqual(checkSession(d, COUNTING_CTX), []);
  // A wrong answer for the empty group is caught.
  d.answers[2].answer = "1";
  assert.match(checkSession(d, COUNTING_CTX).join(" "), /task 3 gives 1, but the diagram it asks about has 0/);
  // Out-of-range or fractional counts are not.
  for (const count of [-1, 21, 2.5]) {
    const bad = countingSession();
    bad.pages[0].visual = { type: "counters", count };
    assert.match(checkSession(bad, COUNTING_CTX).join(" "), /whole number from 0 to 20/);
  }
  // Drawn: the empty group is a visible outline with nothing in it, and says so.
  const svg = mathDiagram({ type: "counters", count: 0 });
  assert.equal((svg.match(/<circle /g) || []).length, 0);
  assert.equal((svg.match(/<rect /g) || []).length, 1);
  assert.match(svg, /An empty group: 0 objects/);
  const frame = mathDiagram({ type: "ten-frame", count: 0 });
  assert.equal((frame.match(/<rect /g) || []).length, 10);
  assert.equal((frame.match(/<circle /g) || []).length, 0);
  assert.deepEqual(qaBook({ title: "t", template: "woodland", releases: [], pages: sessionPages(countingSession(), { ...OPENING_PLAN, title: "Counting" }, 0) }), []);
});

test("Editorial: a stated diagram count that disagrees with visual.count is an error", () => {
  const d = countingSession();
  d.pages[0].explanation += " There are 4 counters in the group above.";
  assert.match(checkSession(d, COUNTING_CTX).join(" "), /says "There are 4 counters" but the diagram has 5/);
  const none = countingSession();
  none.pages[1].tasks[0].prompt = "How many counters are in the ten-frame?";
  none.pages[1].visual = null;
  assert.match(checkSession(none, COUNTING_CTX).join(" "), /Task 3 refers to a picture or diagram, but page 2 has none/);
});

test("Editorial: questions and the answer key must match one to one", () => {
  const missing = countingSession();
  missing.answers = missing.answers.filter((a) => a.n !== 4);
  assert.match(checkSession(missing, COUNTING_CTX).join(" "), /Task 4 has no answer in the answer key/);
  const extra = countingSession();
  extra.answers.push({ n: 9, answer: "7" });
  assert.match(checkSession(extra, COUNTING_CTX).join(" "), /answer for task 9, but there is no task 9/);
  const twice = countingSession();
  twice.answers.push({ n: 2, answer: "2" });
  assert.match(checkSession(twice, COUNTING_CTX).join(" "), /Task 2 is answered more than once/);
  const numbering = countingSession();
  numbering.pages[1].tasks[0].n = 4;
  assert.match(checkSession(numbering, COUNTING_CTX).join(" "), /numbered 1 to 5 in order/);
  const empty = countingSession();
  empty.answers[0].answer = "";
  assert.match(checkSession(empty, COUNTING_CTX).join(" "), /answer for task 1 is empty/);
  const leaked = countingSession();
  leaked.pages[1].tasks[1].prompt = "Collect 6 stones and count them. Answer: 6";
  assert.match(checkSession(leaked, COUNTING_CTX).join(" "), /Task 4 shows its answer on the student page/);
});

test("Editorial: teaching comes before practice (explanation, worked example, and an example for each skill)", () => {
  assert.match(checkSession(openingMissingOrderingExample(), OPENING_CTX).join(" "),
    /Task 4 practises ordering numbers, but no worked example before it shows ordering numbers/);
  const noExample = countingSession();
  noExample.pages[0].example = null;
  assert.match(checkSession(noExample, COUNTING_CTX).join(" "), /Page 1 needs a complete worked example/);
  const noExplanation = countingSession();
  noExplanation.pages[0].explanation = "";
  assert.match(checkSession(noExplanation, COUNTING_CTX).join(" "), /Page 1 must start with a short explanation/);
  // The order on the page is always explanation, then the worked example, then the tasks.
  const text = composeSessionText(openingGood().pages[1]);
  assert.ok(text.indexOf("When we count") < text.indexOf("Worked example") && text.indexOf("Worked example") < text.indexOf("4. Put 3, 9"));
});

test("Editorial: practice uses fresh examples, not the worked example's numbers, and doesn't repeat itself", () => {
  assert.match(checkSession(openingCopiesExample(), OPENING_CTX).join(" "),
    /Task 4 uses the same numbers as the worked example \(6, 2, 4\)/);
  const repeated = countingSession();
  repeated.pages[1].tasks[1].prompt = repeated.pages[0].tasks[1].prompt;
  assert.match(checkSession(repeated, COUNTING_CTX).join(" "), /Task 4 repeats task 2 word for word/);
  const tooFew = countingSession();
  tooFew.pages[1].tasks.pop();
  tooFew.answers.pop();
  assert.match(checkSession(tooFew, COUNTING_CTX).join(" "), /needs 5–10 practice tasks in total/);
});

test("Editorial: the opening numeral session needs number names and dot patterns", () => {
  const errors = checkSession(openingMissingNames(), OPENING_CTX).join(" ");
  assert.match(errors, /must show number cards \(numeral, number word and dot pattern\) on page 1/);
  assert.match(errors, /must say the number names/);
  const narrow = openingGood();
  narrow.pages[0].visual = { type: "number-cards", count: 5, start: 0 };
  assert.match(checkSession(narrow, OPENING_CTX).join(" "), /Task 1 uses 7, which is outside the number cards shown \(0–5\)/);
  // The cards themselves: each numeral 0–10 with its name and that many dots; zero has none.
  const cards = mathDiagram({ type: "number-cards", count: 10, start: 0 });
  for (const w of ["zero", "one", "five", "ten"]) assert.match(cards, new RegExp(`>${w}<`));
  assert.equal((cards.match(/<circle /g) || []).length, 55, "0+1+…+10 dots");
});

// ---------------------------------------------------------------- reviewer and feedback

test("Editorial: reviewer errors and suggestions are separated; false positives that contradict the checks are ignored", () => {
  const v = reconcileReview({
    errors: [
      "Task 3: an empty ten-frame is confusing and invalid; zero counters cannot be counted.",
      "Task 5: the answer should say the cups and spoons match; 4 and 4 is correct but the answer key says 5.",
      "Task 2 has no answer in the answer key.",
    ],
    suggestions: ["Use a friendlier title on page 2."],
  });
  assert.deepEqual(v.errors, ["Task 5: the answer should say the cups and spoons match; 4 and 4 is correct but the answer key says 5."]);
  assert.deepEqual(v.suggestions, ["Use a friendlier title on page 2."]);
  assert.equal(v.falsePositives.length, 2);
  assert.match(v.falsePositives[0], /ignored: an empty group \(0\) is a valid count/);
  // The older {pass, issues} shape still counts its issues as errors; a bare fail is retried, not approved.
  assert.deepEqual(reconcileReview({ pass: false, issues: ["Task 1 is ambiguous."] }).errors, ["Task 1 is ambiguous."]);
  assert.equal(reconcileReview({ pass: false }).errors.length, 1);
  assert.deepEqual(reconcileReview({ pass: true, issues: [] }).errors, []);
});

test("Editorial: feedback accumulates across attempts without duplicates, errors first, suggestions capped", () => {
  let f = mergeFeedback([], [{ kind: "error", source: "check", text: "Task 4 uses the same numbers as the worked example." }]);
  f = mergeFeedback(f, [
    { kind: "error", source: "check", text: "task 4 uses the same numbers as the worked example" },
    { kind: "error", source: "reviewer", text: "Task 5's answer is wrong." },
    ...Array.from({ length: 9 }, (_, i) => ({ kind: "suggestion", source: "reviewer", text: `Suggestion ${i}` })),
  ]);
  assert.equal(f.filter((x) => x.kind === "error").length, 2);
  assert.equal(f.filter((x) => x.kind === "suggestion").length, 6);
  assert.equal(f[0].kind, "error");
});

// ---------------------------------------------------------------- the job: revision instead of restarting

const ORIGIN = "http://localhost:8787";
async function ownerHarness() {
  const db = makeDb();
  const env = { DB: db, JWT_SECRET: "test-only-secret" };
  clearSettingsCache();
  clearUsageCache();
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  const req = async (path, { method = "GET", token, body } = {}) => {
    const headers = { "content-type": "application/json" };
    if (token) headers.authorization = `Bearer ${token}`;
    if (method !== "GET") Object.assign(headers, { "x-sidequest-admin": "1", origin: ORIGIN });
    const r = await worker.fetch(new Request(ORIGIN + "/api" + path, { method, headers, body: body ? JSON.stringify(body) : undefined }), env, ctx);
    return { status: r.status, json: await r.json().catch(() => null) };
  };
  const reg = await req("/auth/register", { method: "POST", body: { email: "owner@example.com", password: "Correct-horse-9", name: "Owner", jurisdiction: "NSW" } });
  const owner = { token: reg.json.token, id: reg.json.user.id };
  db.raw.prepare("INSERT INTO user_roles (id, user_id, role, granted_by, reason) VALUES (?, ?, 'owner', 'test', 'test')").run(crypto.randomUUID(), owner.id);
  const auth = await createSoftAuthenticator();
  const o = await req("/admin/security/passkeys/register/options", { method: "POST", token: owner.token, body: { password: "Correct-horse-9" } });
  await req("/admin/security/passkeys/register/verify", { method: "POST", token: owner.token, body: { response: auth.register(o.json.options, ORIGIN), label: "Laptop" } });
  const a = await req("/admin/security/step-up/options", { method: "POST", token: owner.token });
  await req("/admin/security/step-up/verify", { method: "POST", token: owner.token, body: { response: await auth.authenticate(a.json.options, ORIGIN, "localhost") } });
  const files = new Map();
  env.BUCKET = { files, async put(k, v) { files.set(k, v); }, async get(k) { return files.has(k) ? { arrayBuffer: async () => new ArrayBuffer(0) } : null; }, async head(k) { return files.has(k) ? {} : null; } };
  let pdfs = 0;
  env.BROWSER = { quickAction: async () => { pdfs++; return new Response("%PDF-1.7 test"); } };
  return { env, db, owner, req, pdfCount: () => pdfs };
}

/** Simulated AI: plans the opening session, then hands each write/revise/review prompt to the test. */
function simulatedAi(onWrite, onReview) {
  const calls = { write: [], revise: [], review: [] };
  return {
    calls,
    run: async (_m, input) => {
      const prompt = input.messages[1].content;
      if (prompt.startsWith("Create a coherent"))
        return { response: { title: "Meet the Numbers", sessions: Array.from({ length: 8 }, () => ({ title: OPENING_PLAN.title, goal: OPENING_PLAN.goal, code: "AC9MFN01" })) } };
      if (prompt.startsWith("Independently")) { calls.review.push(prompt); return { response: onReview(calls.review.length) }; }
      const kind = prompt.startsWith("Revise") ? "revise" : "write";
      calls[kind].push(prompt);
      return { response: onWrite(kind, calls.write.length + calls.revise.length) };
    },
  };
}
const start = async (h) => {
  const r = await h.req("/admin/book-forge/generate", { method: "POST", token: h.owner.token, body: { brief: "Make a Foundation mathematics workbook about numbers to 10", length: "short" } });
  assert.equal(r.status, 202, JSON.stringify(r.json));
  return r.json.id;
};
const state = async (h, id) => (await h.req(`/admin/book-forge/${id}/generation`, { token: h.owner.token })).json.job;
const project = async (h, id) => (await h.req(`/admin/book-forge/${id}`, { token: h.owner.token })).json.book;

test("Forge job: a rejected draft is revised (not restarted) with all accumulated feedback, and only the approved session is saved", async () => {
  const h = await ownerHarness();
  const ai = simulatedAi(
    (kind, n) => (n === 1 ? openingCopiesExample() : openingGood()),
    // The first review (attempt 2) finds a real error; the second (attempt 3) approves, with a false positive.
    (n) => (n === 1
      ? { errors: ["Task 6: the answer should be 1, and the question needs to say 'counting forwards'."], suggestions: ["Add a picture of spoons."] }
      : { errors: ["Task 3: zero cards are invalid because there is nothing to count."], suggestions: ["Add a picture of spoons."] }),
  );
  h.env.AI = ai;
  const id = await start(h);
  await processBookForgeJobs(h.env); // plan
  // Attempt 1: copies the example; caught by the deterministic checks before any review.
  await processBookForgeJobs(h.env);
  let job = await state(h, id);
  assert.equal(job.status, "queued");
  assert.equal(job.review.attempts, 1);
  assert.match(job.review.errors.join(" "), /Task 4 uses the same numbers as the worked example/);
  assert.equal((await project(h, id)).pages.length, 0, "rejected content never reaches the book");
  assert.equal(ai.calls.review.length, 0);
  // Attempt 2: a revision of that exact draft; passes the checks; the reviewer finds an error.
  await processBookForgeJobs(h.env);
  assert.equal(ai.calls.revise.length, 1);
  assert.match(ai.calls.revise[0], /PREVIOUS DRAFT: .*Put 6, 2 and 4 in order from smallest to largest\..*n":4/s);
  assert.match(ai.calls.revise[0], /Keep everything that was correct; fix ONLY the problems listed/);
  assert.match(ai.calls.revise[0], /- Task 4 uses the same numbers as the worked example/);
  job = await state(h, id);
  assert.equal(job.review.attempts, 2);
  assert.deepEqual(job.review.suggestions, ["Add a picture of spoons."]);
  assert.equal((await project(h, id)).pages.length, 0);
  // Attempt 3: the revision gets BOTH problems, each once; the reviewer's empty-group objection is ignored.
  await processBookForgeJobs(h.env);
  const third = ai.calls.revise[1];
  assert.equal(third.split("Task 4 uses the same numbers as the worked example").length - 1, 1);
  assert.equal(third.split("Task 6: the answer should be 1").length - 1, 1);
  assert.match(third, /OPTIONAL IMPROVEMENTS[^]*Add a picture of spoons\./);
  job = await state(h, id);
  assert.equal(job.status, "queued");
  assert.equal(job.cursor, 1, "the session was approved and the writer moved on");
  assert.equal(job.review, null, "draft and feedback are cleared once approved");
  const book = await project(h, id);
  assert.equal(book.pages.length, 3);
  assert.match(book.pages[0].text, /Point to the card for 7/);
  assert.deepEqual(book.pages[0].visual, { type: "number-cards", count: 10, start: 0 });
  const payload = JSON.parse(h.db.raw.prepare("SELECT payload FROM book_forge_jobs WHERE project_id=?").get(id).payload);
  assert.deepEqual(payload.revisions, {});
  assert.match(payload.falsePositives[0], /Session 1: Task 3: zero cards are invalid.*ignored: an empty group/);
});

test("Forge job: after three rejected attempts the step fails, the draft is kept for inspection, and nothing is rendered", async () => {
  const h = await ownerHarness();
  const ai = simulatedAi(() => openingMissingOrderingExample(), () => ({ errors: [], suggestions: [] }));
  h.env.AI = ai;
  const id = await start(h);
  for (let i = 0; i < 8; i++) await processBookForgeJobs(h.env);
  const job = await state(h, id);
  assert.equal(job.status, "failed");
  assert.equal(job.phase, "write");
  assert.equal(job.cursor, 0);
  assert.equal(ai.calls.write.length + ai.calls.revise.length, 3, "three attempts, then it stops");
  assert.equal(ai.calls.revise.length, 2, "attempts two and three revised the stored draft");
  assert.equal(job.review.attempts, 3);
  assert.equal(job.review.draft.pages[1].tasks[0].prompt, "Put 3, 9 and 1 in order from smallest to largest.");
  const ordering = job.review.errors.filter((e) => e.startsWith("Task 4 practises ordering"));
  assert.equal(ordering.length, 1, "the same problem is recorded once, however many attempts repeat it");
  assert.match(job.error, /Session 1 needs revision/);
  const book = await project(h, id);
  assert.equal(book.pages.length, 0);
  assert.equal(book.pdf, undefined);
  assert.equal(h.pdfCount(), 0);
  assert.ok(qaBook(book).some((x) => /incomplete/.test(x)), "an incomplete book can't pass QA for approval");
  // The existing Retry control continues from the kept draft.
  assert.equal((await h.req(`/admin/book-forge/${id}/retry`, { method: "POST", token: h.owner.token })).status, 200);
  await processBookForgeJobs(h.env);
  assert.equal(ai.calls.revise.length, 3);
  assert.match(ai.calls.revise[2], /PREVIOUS DRAFT/);
});

test("Forge job: an unreadable reply never replaces the last readable draft", async () => {
  const h = await ownerHarness();
  const ai = simulatedAi((kind, n) => (n === 1 ? openingCopiesExample() : { nonsense: true }), () => ({ errors: [] }));
  h.env.AI = ai;
  const id = await start(h);
  for (let i = 0; i < 3; i++) await processBookForgeJobs(h.env);
  const job = await state(h, id);
  assert.equal(job.review.draft.pages[1].tasks[0].prompt, "Put 6, 2 and 4 in order from smallest to largest.");
  assert.match(job.review.errors.join(" "), /not a complete session in the required JSON shape/);
});

// ---------------------------------------------------------------- rendered pages

test("Forge render: teaching first, boxed worked example, a writing line per task, answers only on the answer page", () => {
  const plan = OPENING_PLAN;
  const pages = sessionPages(openingGood(), plan, 0);
  const book = { title: "Meet the Numbers", template: "woodland", releases: [], generated: true, plan: [plan], pages };
  assert.deepEqual(qaBook(book), []);
  const html = renderBook(book);
  const sections = html.split('<section class="page"').slice(1);
  assert.equal(sections.length, 3);
  const [p1, p2, answers] = sections;
  assert.match(p1, /class="cards"/);
  assert.ok(p1.indexOf("Every number has a numeral") < p1.indexOf('class="example"'));
  assert.ok(p1.indexOf('class="example"') < p1.indexOf('class="tasks"'));
  assert.equal((p1.match(/class="write"/g) || []).length, 3);
  assert.equal((p2.match(/class="write"/g) || []).length, 4);
  assert.doesNotMatch(p2, /1, 3, 9/, "no answers on student pages");
  assert.match(answers, /class="answers"/);
  assert.match(answers, /1, 3, 9/);
  assert.doesNotMatch(answers, /class="write"|class="lines"/);
});

test("Forge render: answer pages are packed onto shared sheets while contents and footers stay correct", () => {
  const plans = Array.from({ length: 8 }, (_, i) => ({ title: `Counting quest ${i + 1}`, goal: "Count objects.", code: "AC9MFN01", lessonId: `s${i + 1}` }));
  let pages = plans.flatMap((p, i) => sessionPages(countingSession(), p, i));
  pages = [...pages.filter((p) => !p.answerPage), ...pages.filter((p) => p.answerPage)];
  const sheets = printSheets(pages);
  assert.equal(sheets.length, 16 + 3, "16 student sheets, then 8 answer pages on 3 sheets");
  assert.ok(sheets.slice(16).every((s) => s.every((p) => p.answerPage)));
  const html = renderBook({ title: "Counting", template: "woodland", releases: [], generated: true, plan: plans, pages });
  assert.match(html, /<span>21 \/ 21<\/span>/, "cover + contents + 19 sheets");
  assert.match(html, /8\. Counting quest 8<\/span><b>17<\/b>/, "contents point at the right student sheet");
  assert.equal((html.match(/<h2 class="session">/g) || []).length, 8, "every session's answers are printed once");
});
