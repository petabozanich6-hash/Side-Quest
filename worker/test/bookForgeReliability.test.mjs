// Book Forge reliability: structured output, failure classification, component fallback, retry budgets, pausing,
// owner recovery, cost logging, honest progress and resumption. Runs the real job processor and the real Forge
// routes against the real migrations on SQLite (fakeD1); the model is scripted per call.
import test from "node:test";
import assert from "node:assert/strict";
import { Hono } from "hono";
import { makeDb } from "./fakeD1.mjs";
import {
  POLICY,
  processBookForgeJobs,
  progressOf,
  registerForgeGeneration,
  sessionPages,
} from "../src/bookForgeGeneration.ts";
import {
  SESSION_SCHEMA,
  PAGE_SCHEMA,
  callJson,
  parseJsonText,
  unwrap,
  validateSchema,
} from "../src/bookForgeStructured.ts";
import { countingSession, openingCopiesExample } from "./fixtures/bookForgeSessions.mjs";

const OWNER = "owner-1";
const PLAN = { title: "Counting quest", goal: "Count objects with one-to-one correspondence.", code: "AC9MFN01" };

/** Which prompt a call is, by its opening words. */
const kindOf = (prompt) =>
  prompt.startsWith("Create a coherent") ? "plan"
  : prompt.startsWith("Independently") ? "review"
  : prompt.startsWith("Revise") ? "revise"
  : prompt.startsWith("Write student PAGE 1") ? "page1"
  : prompt.startsWith("Write student PAGE 2") ? "page2"
  : prompt.startsWith("Write the adult answer key") ? "answers"
  : "session";

/** A scripted model: `reply(kind, n, input)` returns the raw Workers AI result for the n-th call of that kind. */
function scriptedAi(reply) {
  const calls = [];
  const counts = {};
  return {
    calls,
    of: (k) => calls.filter((c) => c.kind === k),
    run: async (model, input) => {
      const prompt = input.messages[1].content;
      const kind = kindOf(prompt);
      counts[kind] = (counts[kind] || 0) + 1;
      calls.push({ kind, prompt, input, model });
      const r = await reply(kind, counts[kind], input);
      if (r instanceof Error) throw r;
      return r;
    },
  };
}
const ok = (value, out = 900) => ({ response: value, usage: { prompt_tokens: 3000, completion_tokens: out } });
const planReply = (input) => {
  const n = Number(input.messages[1].content.match(/Plan ONLY the next (\d+) sessions/)[1]);
  return ok({ title: "Woodland Counting", sessions: Array.from({ length: n }, (_, i) => ({ ...PLAN, title: `Counting quest ${i + 1}` })) }, 400);
};
const approve = () => ok({ errors: [], suggestions: [] }, 60);

function harness({ count = 3 } = {}) {
  const db = makeDb();
  db.raw.prepare("INSERT INTO families (id, name, owner_id, created_at) VALUES ('fam-1','Owner family','owner-1','2026-11-01')").run();
  db.raw.prepare("INSERT INTO users (id, family_id, email, password_hash, name, created_at) VALUES ('owner-1','fam-1','owner@example.com','x','Owner','2026-11-01')").run();
  db.raw.prepare("INSERT INTO user_roles (id, user_id, role, granted_by, reason) VALUES ('r1','owner-1','owner','test','test')").run();
  const files = new Map();
  const env = {
    DB: db,
    BUCKET: { files, async put(k, v) { files.set(k, v); }, async get(k) { return files.has(k) ? { arrayBuffer: async () => new ArrayBuffer(0) } : null; } },
    BROWSER: { quickAction: async () => new Response("%PDF-1.7 test") },
  };
  // The Forge routes, mounted as the admin router mounts them, with an authenticated owner.
  const app = new Hono();
  app.use("*", async (c, next) => { c.set("user", { id: OWNER, family_id: "fam-1" }); await next(); });
  const forge = new Hono();
  registerForgeGeneration(forge);
  app.route("/forge", forge);
  const req = async (path, method = "GET", body) => {
    const r = await app.fetch(new Request("http://x/forge" + path, { method, headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined }), env);
    return { status: r.status, json: await r.json().catch(() => null) };
  };
  return {
    db, env, req,
    async start(brief = "Make a Foundation mathematics counting workbook") {
      // pageTarget gives an exact session count: floor((pages - 2) / 3).
      const r = await req("/generate", "POST", { brief, length: "short", pageTarget: Math.max(2, count) * 3 + 2 });
      assert.equal(r.status, 202, JSON.stringify(r.json));
      // The route plans at least two sessions; a one-session book keeps these tests small.
      if (count === 1) db.raw.prepare("UPDATE book_forge_jobs SET payload=json_set(payload,'$.count',1) WHERE project_id=?").run(r.json.id);
      return r.json.id;
    },
    job: (id) => { const row = db.raw.prepare("SELECT * FROM book_forge_jobs WHERE project_id=?").get(id); return { ...row, payload: JSON.parse(row.payload) }; },
    book: (id) => JSON.parse(db.raw.prepare("SELECT document FROM book_forge_projects WHERE id=?").get(id).document),
    events: (id) => db.raw.prepare("SELECT * FROM book_forge_events WHERE project_id=? ORDER BY rowid").all(id),
    /** Runs ticks, clearing any provider backoff so tests don't wait in real time. */
    async tick(n = 1) {
      for (let i = 0; i < n; i++) {
        db.raw.prepare("UPDATE book_forge_jobs SET lease_until=NULL WHERE lease IS NULL").run();
        await processBookForgeJobs(env);
      }
    },
  };
}

// ---------------------------------------------------------------- pure structured-output pieces

test("Structured: the schema validator names every structural problem with its exact path", () => {
  assert.deepEqual(validateSchema(SESSION_SCHEMA, countingSession()), []);
  const broken = countingSession();
  delete broken.pages[1].tasks[0].prompt;
  broken.pages[0].visual = { type: "rainbow", count: 3 };
  broken.answers[0].n = "one";
  const errors = validateSchema(SESSION_SCHEMA, broken);
  assert.ok(errors.includes("reply.pages[1].tasks[0].prompt: is missing"), errors.join("\n"));
  assert.ok(errors.some((e) => e.startsWith("reply.pages[0].visual.type: must be one of")));
  assert.ok(errors.includes("reply.answers[0].n: must be a whole number"));
  assert.deepEqual(validateSchema(SESSION_SCHEMA, { session: countingSession() }), ["reply.pages: is missing", "reply.answers: is missing"]);
});

test("Structured: fenced and prose-wrapped JSON parse; cut-off JSON is reported as truncated, prose as malformed", () => {
  assert.deepEqual(parseJsonText('```json\n{"a":1}\n```'), { ok: true, value: { a: 1 } });
  assert.deepEqual(parseJsonText('Here you go: {"a":[1,2]} Enjoy!'), { ok: true, value: { a: [1, 2] } });
  assert.deepEqual(parseJsonText('{"pages":[{"title":"Count the trees","tasks":[{"n":1,"prompt":"How ma'), { ok: false, truncated: true });
  assert.deepEqual(parseJsonText("I'm sorry, I can't help with that."), { ok: false, truncated: false });
  // A single wrapper object is a formatting slip, not missing content.
  const s = countingSession();
  assert.equal(unwrap({ session: s }, SESSION_SCHEMA), s);
  assert.equal(unwrap({ result: { session: s } }, SESSION_SCHEMA), s);
  const two = { session: s, note: "x" };
  assert.equal(unwrap(two, SESSION_SCHEMA), two, "never unwraps when the wrapper holds anything else");
});

test("Structured: every call is schema-constrained and classified, with usage, truncation and cost recorded", async () => {
  const reply = { value: null };
  const env = { AI: { run: async (_m, input) => { reply.input = input; return reply.value; } } };
  const call = () => callJson(env, { purpose: "session", prompt: "Write session 1", schema: SESSION_SCHEMA, maxTokens: 6000 });

  reply.value = ok(countingSession(), 1400);
  let r = await call();
  assert.equal(r.ok, true);
  assert.deepEqual(reply.input.response_format, { type: "json_schema", json_schema: SESSION_SCHEMA });
  assert.equal(reply.input.max_tokens, 6000);
  assert.equal(r.event.outputTokens, 1400);
  assert.equal(r.event.tokenBasis, "reported");
  assert.ok(r.event.estUsd > 0);

  reply.value = ok({ session: countingSession() });
  r = await call();
  assert.equal(r.ok, true, "a wrapper object is unwrapped, not rejected");

  reply.value = { response: '{"pages":[{"title":"Count","explanation":"We count each', usage: { prompt_tokens: 3000, completion_tokens: 6000 } };
  r = await call();
  assert.equal(r.kind, "truncated");
  assert.match(r.detail, /6000 of 6000 tokens/);

  reply.value = { response: { pages: [countingSession().pages[0]] }, usage: { prompt_tokens: 3000, completion_tokens: 6000 } };
  r = await call();
  assert.equal(r.kind, "truncated", "a reply that ends at the limit and is missing parts was cut short");
  assert.equal(r.partial.pages.length, 1);

  reply.value = ok("Sure! Here is your session.");
  assert.equal((await call()).kind, "malformed");
  reply.value = ok({ nonsense: true });
  r = await call();
  assert.equal(r.kind, "schema");
  assert.match(r.detail, /reply\.pages: is missing/);
  reply.value = { response: "" };
  assert.equal((await call()).kind, "empty");
  env.AI.run = async () => { throw new Error("JSON Mode couldn't be met"); };
  assert.equal((await call()).kind, "schema");
  env.AI.run = async () => { throw new Error("upstream 503"); };
  assert.equal((await call()).kind, "provider");
});

test("Structured: an oversized prompt never pushes the reply past the 24k context window", async () => {
  let input;
  const env = { AI: { run: async (_m, i) => { input = i; return ok(countingSession()); } } };
  await callJson(env, { purpose: "revise", prompt: "x".repeat(80000), schema: SESSION_SCHEMA, maxTokens: 6000 });
  assert.ok(input.max_tokens < 6000 && input.max_tokens >= 512, `max_tokens ${input.max_tokens}`);
  assert.ok(input.max_tokens + Math.ceil(80000 / 4) <= 24000);
});

// ---------------------------------------------------------------- the job, end to end

test("Forge job: a whole book completes with one write and one review call per session, logged with tokens and cost", async () => {
  const h = harness({ count: 3 });
  h.env.AI = scriptedAi((kind, n, input) => (kind === "plan" ? planReply(input) : kind === "review" ? approve() : ok(countingSession(), 1500)));
  const id = await h.start();
  await h.tick(12);
  const job = h.job(id);
  assert.equal(job.status, "complete", job.error + JSON.stringify(h.events(id).map((e) => [e.purpose, e.outcome, e.detail])));
  assert.equal(h.book(id).pages.length, 9);
  assert.equal(h.env.AI.calls.length, 1 + 3 * 2);
  const events = h.events(id);
  assert.equal(events.length, 7);
  assert.ok(events.every((e) => e.outcome === "ok" && e.input_tokens === 3000 && e.est_usd > 0));
  assert.deepEqual(events.map((e) => e.purpose), ["plan", "session", "review", "session", "review", "session", "review"]);
  assert.ok(job.payload.costUsd > 0);
  assert.equal(job.payload.sessionCosts[2].calls, 2);
  const state = (await h.req(`/${id}/generation`)).json.job;
  assert.equal(state.usage.calls, 7);
  assert.equal(state.usage.failedCalls, 0);
  assert.ok(state.usage.estimatedUsd > 0);
  assert.equal(state.progress.percent, 100);
});

test("Forge job: the reported failure (a valid JSON reply without top-level pages) is repaired, not rewritten from scratch", async () => {
  const h = harness({ count: 2 });
  const s = countingSession();
  h.env.AI = scriptedAi((kind, n, input) => {
    if (kind === "plan") return planReply(input);
    if (kind === "review") return approve();
    if (kind === "session") return n === 1 ? ok({ title: "Session 1", content: "Here is the session", answers: s.answers }) : ok(s);
    if (kind === "page1") return ok(s.pages[0]);
    if (kind === "page2") return ok({ ...s.pages[1], tasks: s.pages[1].tasks.map((t, i) => ({ ...t, n: i + 1 })) }); // restarts numbering
    if (kind === "answers") return ok({ answers: s.answers });
  });
  const id = await h.start();
  await h.tick(1); // plan
  await h.tick(1); // session 1: wrong shape → split into components
  let job = h.job(id);
  assert.equal(job.status, "queued");
  assert.equal(job.payload.work[0].mode, "components");
  assert.match(job.error, /session reply unusable \(schema: reply\.pages: is missing/);
  assert.equal(h.events(id)[1].outcome, "schema");
  assert.match(h.events(id)[1].action, /split session into components/);
  await h.tick(3); // page 1, page 2, answers (+ review)
  job = h.job(id);
  assert.equal(job.cursor, 1, job.error);
  const page2 = h.book(id).pages[1].text;
  assert.match(page2, /^3\. How many counters/m, "page 2 numbering continues from page 1");
  assert.deepEqual(h.env.AI.calls.map((c) => c.kind), ["plan", "session", "page1", "page2", "answers", "review"]);
  await h.tick(1);
  assert.equal(h.job(id).phase, "illustrate", "the next session went back to one whole-session call");
  assert.equal(h.env.AI.of("session").length, 2);
});

test("Forge job: a reply cut off at the token limit keeps its valid page and builds only the missing parts", async () => {
  const h = harness({ count: 1 });
  const s = countingSession();
  h.env.AI = scriptedAi((kind, n, input) => {
    if (kind === "plan") return planReply(input);
    if (kind === "review") return approve();
    if (kind === "session") return { response: { pages: [s.pages[0], { title: "Try counting" }] }, usage: { prompt_tokens: 3000, completion_tokens: 6000 } };
    if (kind === "page2") return ok(s.pages[1]);
    if (kind === "answers") return ok({ answers: s.answers });
    throw new Error(`unexpected ${kind}`);
  });
  const id = await h.start();
  await h.tick(2);
  const work = h.job(id).payload.work[0];
  assert.equal(work.mode, "components");
  assert.deepEqual(Object.keys(work.components), ["page1"], "the complete first page was kept");
  assert.equal(work.lastFailure.kind, "truncated");
  await h.tick(2);
  assert.equal(h.job(id).phase, "illustrate");
  assert.deepEqual(h.env.AI.calls.map((c) => c.kind), ["plan", "session", "page2", "answers", "review"], "page 1 was never paid for twice");
});

test("Forge job: a component that keeps arriving cut off pauses the session with the precise error, keeping saved parts", async () => {
  const h = harness({ count: 1 });
  const s = countingSession();
  h.env.AI = scriptedAi((kind, n, input) => {
    if (kind === "plan") return planReply(input);
    if (kind === "session") return { response: '{"pages":[', usage: { prompt_tokens: 3000, completion_tokens: 6000 } };
    if (kind === "page1") return ok(s.pages[0]);
    if (kind === "page2") return { response: '{"title":"Try counting","tasks":[{"n":3,"prompt":"How', usage: { prompt_tokens: 3000, completion_tokens: 2600 } };
  });
  const id = await h.start();
  await h.tick(10);
  const job = h.job(id);
  assert.equal(job.status, "paused");
  assert.equal(job.payload.pause.kind, "truncated");
  assert.match(job.error, /Session 1 paused after 2 replies cut off at the length limit \(page2\)/);
  assert.ok(job.payload.work[0].components.page1, "page 1 is still saved");
  assert.match(h.env.AI.of("page2")[1].prompt, /cut off at the length limit/, "the retry was told why");
  assert.equal(h.env.AI.calls.length, 1 + 1 + 1 + 2, "plan, whole session, page 1, two page-2 attempts — then it stops");
  const state = (await h.req(`/${id}/generation`)).json.job;
  assert.deepEqual(state.recovery, ["retry", "reset-session", "cancel"]);
  assert.equal(state.progress.minutesLeft, null);
  assert.equal(state.progress.sessions[0].state, "stuck");
  assert.equal(state.usage.truncatedCalls, 3);
});

test("Forge job: malformed replies are repaired with their exact format errors, then pause — never an endless paid loop", async () => {
  const h = harness({ count: 1 });
  h.env.AI = scriptedAi((kind, n, input) => (kind === "plan" ? planReply(input) : ok("I have written the page for you!")));
  const id = await h.start();
  await h.tick(30);
  const job = h.job(id);
  assert.equal(job.status, "paused");
  assert.equal(job.payload.pause.kind, "malformed");
  const writes = h.env.AI.calls.filter((c) => c.kind !== "plan").length;
  assert.equal(writes, POLICY.structural + 1, "a fixed number of structural attempts");
  assert.ok(writes <= POLICY.callsPerSessionRun);
  assert.match(h.env.AI.of("page1")[1].prompt, /COULD NOT BE USED/);
  await h.tick(5);
  assert.equal(h.env.AI.calls.filter((c) => c.kind !== "plan").length, writes, "a paused job makes no further calls");
});

test("Forge job: a format error in a revision keeps the draft and its teaching; only editorial failures count as revisions", async () => {
  const h = harness({ count: 1 });
  h.env.AI = scriptedAi((kind, n, input) => {
    if (kind === "plan") return planReply(input);
    if (kind === "review") return approve();
    if (kind === "session") return ok(openingCopiesExample());
    if (kind === "revise") return n === 1 ? ok({ nonsense: true }) : ok(countingSession());
  });
  const id = await h.start();
  await h.tick(2); // plan, write (fails checks)
  let work = h.job(id).payload.work[0];
  assert.equal(work.run.editorial, 1);
  await h.tick(1); // revise → unusable format
  work = h.job(id).payload.work[0];
  assert.equal(work.run.editorial, 1, "a format error is not an editorial failure");
  assert.equal(work.run.structural, 1);
  assert.equal(work.draft.pages[1].tasks[0].prompt, "Put 6, 2 and 4 in order from smallest to largest.", "the last readable draft is kept");
  assert.deepEqual(work.format, ["reply.pages: is missing", "reply.answers: is missing"]);
  await h.tick(1); // revise again with the format errors listed
  assert.match(h.env.AI.of("revise")[1].prompt, /COULD NOT BE USED[^]*reply\.pages: is missing/);
  assert.match(h.env.AI.of("revise")[1].prompt, /PREVIOUS DRAFT: .*Put 6, 2 and 4/);
  assert.equal(h.job(id).phase, "illustrate");
});

test("Forge job: a malformed reviewer reply never approves a session; only the reviewer is asked again", async () => {
  const h = harness({ count: 1 });
  h.env.AI = scriptedAi((kind, n, input) =>
    kind === "plan" ? planReply(input) : kind === "review" ? (n === 1 ? ok({ pass: true }) : approve()) : ok(countingSession()));
  const id = await h.start();
  await h.tick(2);
  const job = h.job(id);
  assert.equal(job.cursor, 0, "a reply without errors is not an approval");
  assert.equal(h.book(id).pages.length, 0);
  assert.equal(job.payload.work[0].reviewPending, true);
  await h.tick(1);
  assert.equal(h.env.AI.of("session").length, 1, "the session was not rewritten");
  assert.equal(h.env.AI.of("review").length, 2);
  assert.equal(h.book(id).pages.length, 3);
});

test("Forge job: revisions list only the current problems, with earlier fixes marked keep-fixed; standards still pause", async () => {
  const h = harness({ count: 1 });
  h.env.AI = scriptedAi((kind, n, input) => {
    if (kind === "plan") return planReply(input);
    if (kind === "review") return ok({ errors: [`Task 2: the answer key is wrong (${n}).`], suggestions: [] });
    return kind === "session" ? ok(openingCopiesExample()) : ok(countingSession());
  });
  const id = await h.start();
  await h.tick(10);
  const job = h.job(id);
  assert.equal(job.status, "paused");
  assert.equal(job.payload.pause.kind, "editorial");
  assert.match(job.error, /paused after 4 revisions still failing the quality checks/);
  assert.equal(h.book(id).pages.length, 0, "nothing below the standard reaches the book");
  const second = h.env.AI.of("revise")[1].prompt;
  const fix = second.slice(second.indexOf("PROBLEMS TO FIX"), second.indexOf("ALREADY FIXED"));
  assert.match(fix, /Task 2: the answer key is wrong \(1\)/);
  assert.doesNotMatch(fix, /Task 4 uses the same numbers/, "a problem already fixed is not listed as must-fix");
  assert.match(second, /ALREADY FIXED IN EARLIER ATTEMPTS[^]*Task 4 uses the same numbers/);
});

test("Forge job: provider errors back off and retry the same call, then pause; the job is not counted as a content failure", async () => {
  const h = harness({ count: 1 });
  h.env.AI = scriptedAi((kind, n, input) => (kind === "plan" ? planReply(input) : new Error("Upstream 502")));
  const id = await h.start();
  await h.tick(1);
  await processBookForgeJobs(h.env);
  let row = h.job(id);
  assert.equal(row.status, "queued");
  assert.ok(Date.parse(row.lease_until) > Date.now(), "the next attempt waits");
  await processBookForgeJobs(h.env);
  assert.equal(h.env.AI.of("session").length, 1, "nothing runs before the backoff ends");
  await h.tick(5);
  row = h.job(id);
  assert.equal(row.status, "paused");
  assert.equal(row.payload.pause.kind, "provider");
  assert.equal(row.payload.work[0].run.provider, POLICY.provider + 1);
  assert.equal(row.payload.work[0].run.structural, 0);
});

test("Forge job: the cost cap pauses creation, and Retry is the owner's approval to spend one more cap", async () => {
  const h = harness({ count: 2 });
  h.env.AI = scriptedAi((kind, n, input) => (kind === "plan" ? planReply(input) : kind === "review" ? approve() : ok(countingSession())));
  const id = await h.start();
  h.db.raw.prepare("UPDATE book_forge_jobs SET payload=json_set(payload,'$.costCapUsd',0.000001)").run();
  await h.tick(3);
  let job = h.job(id);
  assert.equal(job.status, "paused");
  assert.equal(job.payload.pause.kind, "budget");
  assert.equal(h.env.AI.calls.length, 1, "no session call once the cap is reached");
  assert.equal((await h.req(`/${id}/retry`, "POST")).status, 200);
  job = h.job(id);
  assert.ok(job.payload.costCapUsd > POLICY.jobCostCapUsd - 0.01);
  await h.tick(8);
  assert.equal(h.job(id).status, "complete");
});

test("Forge job: an interrupted tick resumes from saved work without paying again for completed parts", async () => {
  const h = harness({ count: 2 });
  const s = countingSession();
  let crash = true;
  h.env.AI = scriptedAi((kind, n, input) => {
    if (kind === "plan") return planReply(input);
    if (kind === "review") return approve();
    if (kind === "session") return ok({ wrong: true });
    if (kind === "page1") return ok(s.pages[0]);
    if (kind === "page2") return ok(s.pages[1]);
    if (kind === "answers") return ok({ answers: s.answers });
  });
  const id = await h.start();
  await h.tick(4); // plan, session (split), page 1, page 2
  assert.deepEqual(Object.keys(h.job(id).payload.work[0].components), ["page1", "page2"]);
  // The worker dies mid-call: the lease is held, nothing is committed.
  const realRun = h.env.AI.run;
  h.env.AI.run = async () => { if (crash) await new Promise(() => {}); };
  void processBookForgeJobs(h.env);
  await new Promise((r) => setTimeout(r, 30));
  assert.ok(h.job(id).lease, "the step holds its lease while running");
  await processBookForgeJobs(h.env);
  assert.equal(h.job(id).status, "running", "a live lease is not run twice");
  // The lease expires (as after a killed worker); the next tick picks up from the saved components.
  crash = false;
  h.env.AI.run = realRun;
  h.db.raw.prepare("UPDATE book_forge_jobs SET lease_until='2000-01-01T00:00:00.000Z'").run();
  await processBookForgeJobs(h.env);
  assert.equal(h.job(id).cursor, 1);
  assert.equal(h.env.AI.of("page1").length, 1);
  assert.equal(h.env.AI.of("page2").length, 1);
  assert.equal(h.env.AI.of("answers").length, 1);
});

test("Forge job: a job saved before this pipeline (stuck on session 2) resumes on Retry and keeps session 1", async () => {
  const h = harness({ count: 3 });
  h.env.AI = scriptedAi((kind, n, input) => (kind === "plan" ? planReply(input) : kind === "review" ? approve() : ok(countingSession())));
  const id = await h.start();
  await h.tick(2); // plan + session 1 approved
  assert.equal(h.job(id).cursor, 1);
  // Recreate the production state: old-style payload with a revision count, an unreadable reply, and a failed step.
  const payload = h.job(id).payload;
  delete payload.work;
  payload.revisions = { 1: { draft: null, feedback: [{ kind: "error", source: "check", text: "The reply was not a complete session in the required JSON shape." }], falsePositives: [], attempts: 4 } };
  payload.failures = { "write:1": 3 };
  h.db.raw.prepare("UPDATE book_forge_jobs SET status='failed', error='Session 2 needs revision: The reply was not a complete session in the required JSON shape.', payload=? WHERE project_id=?").run(JSON.stringify(payload), id);
  const before = (await h.req(`/${id}/generation`)).json.job;
  assert.deepEqual(before.recovery, ["retry", "reset-session", "cancel"]);
  assert.equal((await h.req(`/${id}/retry`, "POST")).status, 200);
  await h.tick(1);
  const job = h.job(id);
  assert.equal(job.cursor, 2, job.error);
  assert.equal(job.payload.revisions[1], undefined, "the legacy record was migrated");
  assert.equal(h.book(id).pages.filter((p) => !p.answerPage).length, 4, "session 1 was kept, session 2 added");
  await h.tick(6);
  assert.equal(h.job(id).status, "complete");
});

test("Forge recovery: Reset session discards only the paused session's draft; approved sessions and the plan stay", async () => {
  const h = harness({ count: 2 });
  let bad = true;
  h.env.AI = scriptedAi((kind, n, input) => {
    if (kind === "plan") return planReply(input);
    if (kind === "review") return approve();
    if (kind === "session" && n === 1) return ok(countingSession());
    return bad ? ok(openingCopiesExample()) : ok(countingSession());
  });
  const id = await h.start();
  await h.tick(12);
  let job = h.job(id);
  assert.equal(job.status, "paused");
  assert.equal(job.cursor, 1);
  assert.ok(job.payload.work[1].draft);
  // Editing is still blocked while creation is active; recovery actions are allowed when paused.
  assert.equal((await h.req(`/${id}/reset-session`, "POST")).status, 200);
  job = h.job(id);
  assert.equal(job.status, "queued");
  assert.equal(job.payload.work[1], undefined);
  assert.equal(h.book(id).plan.length, 2);
  assert.equal(h.book(id).pages.length, 3);
  bad = false;
  await h.tick(1);
  assert.equal(h.env.AI.of("session").length, 3, "the session was written fresh, not revised");
  assert.equal(h.job(id).phase, "illustrate");
  assert.equal((await h.req(`/${id}/retry`, "POST")).status, 409, "only a paused step can be retried");
});

test("Forge planning: an unusable plan reply is retried with its error, then pauses; a valid plan is kept", async () => {
  const h = harness({ count: 3 });
  h.env.AI = scriptedAi((kind, n, input) => (n < 3 ? ok({ title: "Plan", sessions: [] }) : planReply(input)));
  const id = await h.start();
  await h.tick(2);
  assert.equal(h.job(id).status, "queued");
  assert.match(h.env.AI.calls[1].input.messages[1].content, /Your last reply could not be used: reply\.sessions: needs at least 3 items/);
  await h.tick(1);
  assert.equal(h.job(id).phase, "write");
  assert.equal(h.book(id).plan.length, 3);

  const h2 = harness({ count: 3 });
  h2.env.AI = scriptedAi(() => ok({ title: "Plan", sessions: [{ ...PLAN, code: "NOT-A-CODE" }, PLAN, PLAN] }));
  const id2 = await h2.start();
  await h2.tick(6);
  const job = h2.job(id2);
  assert.equal(job.status, "paused");
  assert.match(job.error, /planning sessions 1–3 after 3 unusable plan replies .*not a supplied code/);
  assert.equal(h2.env.AI.calls.length, POLICY.planStructural);
});

test("Forge progress: weighted by real work, partial credit for saved parts, measured estimates, none while paused", () => {
  const plans = Array.from({ length: 10 }, (_, i) => ({ title: `Session ${i + 1}`, goal: "Count.", code: "AC9MFN01", lessonId: `s${i + 1}` }));
  const book = { title: "t", template: "woodland", releases: [], generated: true, plan: plans, pages: [] };
  const start = "2026-11-09T10:00:00.000Z";
  // Planning done, nothing written: the old formula reported ~13% and "about 44 minutes" here.
  const job = { status: "running", phase: "write", cursor: 0, updated_at: start };
  let p = progressOf(job, { count: 10, startedAt: start }, book, Date.parse("2026-11-09T10:03:00.000Z"));
  assert.ok(p.percent <= 6, `percent ${p.percent}`);
  assert.equal(p.estimateBasis, "initial");
  assert.ok(p.minutesLeft >= 16, `minutes ${p.minutesLeft}`);
  // Saved components count for part of the session in progress.
  const partial = progressOf(job, { count: 10, startedAt: start, work: { 0: { components: { page1: {}, page2: {} }, draft: null, attempts: 0 } } }, book);
  assert.ok(partial.percent > p.percent);
  // Measured: three sessions took 9 ticks → 3 per session for the remaining seven.
  const done = { ...book, pages: plans.slice(0, 3).flatMap((pl, i) => sessionPages(countingSession(), pl, i)) };
  p = progressOf({ ...job, cursor: 3 }, { count: 10, startedAt: start, timing: { sessions: 3, ticks: 9 } }, done);
  assert.equal(p.estimateBasis, "measured");
  assert.ok(p.minutesLeft >= 21 && p.minutesLeft <= 30, `minutes ${p.minutesLeft}`);
  assert.equal(progressOf({ ...job, status: "paused" }, { count: 10, startedAt: start }, book).minutesLeft, null);
  assert.equal(progressOf({ ...job, status: "paused" }, { count: 10, startedAt: start }, book).sessions[0].state, "stuck");
});
