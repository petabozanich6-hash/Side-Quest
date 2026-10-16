// Lesson generation jobs through the real Worker: one request id is written and charged once, progress is
// real, an interrupted request can be retried, and the allowance can't be overrun by parallel requests.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import * as aid from "../src/aiDraft.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";

const ORIGIN = "http://localhost:8787";
const GARDEN = JSON.parse(readFileSync(new URL("../../frontend/src/data/exampleLesson.json", import.meta.url), "utf8"));
const STAGE1 = ["title", "teaching_plan", "why_it_matters", "prior_knowledge", "objectives", "key_words", "misconceptions"];

function fakeAi(delayMs = 0) {
  const calls = [];
  return {
    calls,
    run: async (model, input, options) => {
      calls.push({ model, options, prompt: input.messages.at(-1).content });
      if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
      const u = input.messages.at(-1).content;
      const g = GARDEN;
      const pick = (ks) => Object.fromEntries(ks.filter((k) => g[k] !== undefined).map((k) => [k, g[k]]));
      const reply = (o) => ({ response: JSON.stringify(o), usage: { prompt_tokens: 100, completion_tokens: 200 } });
      if (input.messages[0].content.includes("match a school lesson to curriculum outcomes")) return reply({ matches: [1] });
      if (u.includes("STAGE 1:")) return reply({ ...pick(STAGE1), sequence: g.sections.map((x) => ({ heading: x.heading, idea: "i", how: "h" })), worked_examples: g.worked_examples.map((w) => ({ title: w.title, problem: w.problem, skill: "s" })) });
      if (u.includes("STAGE 2:")) return reply(pick(["introduction", "texts", "consolidation"]));
      let m = u.match(/STAGE 3, SECTION (\d+) OF/);
      if (m) return reply(g.sections[Number(m[1]) - 1]);
      m = u.match(/STAGE 3, WORKED EXAMPLE (\d+) OF/);
      if (m) return reply(g.worked_examples[Number(m[1]) - 1]);
      if (u.includes("STAGE 4, PRACTICE")) return reply(pick(["guided_practice", "activities"]));
      if (u.includes("STAGE 4, ASSESSMENT")) return reply(Object.fromEntries(Object.entries(g).filter(([k]) => !["title", "teaching_plan", "why_it_matters", "prior_knowledge", "objectives", "key_words", "misconceptions", "introduction", "texts", "consolidation", "sections", "worked_examples", "guided_practice", "activities", "answer_key"].includes(k))));
      return reply(g);
    },
  };
}

async function harness(ai = fakeAi()) {
  const db = makeDb();
  const env = { DB: db, JWT_SECRET: "test-only-secret", AI: ai };
  clearSettingsCache();
  clearUsageCache();
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  const req = async (path, { method = "GET", token, body } = {}) => {
    const h = { "content-type": "application/json", origin: ORIGIN };
    if (token) h.authorization = `Bearer ${token}`;
    const r = await worker.fetch(new Request(ORIGIN + "/api" + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined }), env, ctx);
    let json = null;
    try { json = await r.json(); } catch { /* empty */ }
    return { status: r.status, json };
  };
  const register = async (email) => {
    const r = await req("/auth/register", { method: "POST", body: { email, password: "Correct-horse-9", name: "P", jurisdiction: "VIC" } });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    db.raw.prepare("UPDATE families SET plan = 'ACTIVE_MONTHLY', plan_period_end = ? WHERE id = ?").run(new Date(Date.now() + 30 * 86400000).toISOString(), r.json.user.family_id);
    return { token: r.json.token, familyId: r.json.user.family_id };
  };
  return { db, ai, req, register };
}

const draft = (h, p, request_id) => h.req("/ai/lesson-draft", { method: "POST", token: p.token, body: { topic: "Adding two-digit numbers", learning_area: "Mathematics", year_level: "Year 3", ...(request_id ? { request_id } : {}) } });
const designCalls = (ai) => ai.calls.filter((c) => c.prompt.includes("STAGE 1:")).length;

test("one request id writes one lesson and charges once, however often it is sent", async () => {
  const h = await harness(fakeAi(5));
  const p = await h.register("jobs@example.com");
  const id = "req-0123456789abcdef";
  const [a, b] = await Promise.all([draft(h, p, id), draft(h, p, id)]);
  const ok = [a, b].find((r) => r.status === 200);
  const other = [a, b].find((r) => r !== ok);
  assert.ok(ok, JSON.stringify([a.json, b.json]));
  assert.ok(other.status === 409 && other.json.code === "IN_PROGRESS" || other.status === 200, JSON.stringify(other.json));
  assert.equal(designCalls(h.ai), 1, "only one generation ran");
  const again = await draft(h, p, id);
  assert.equal(again.status, 200);
  assert.equal(again.json.replay, true);
  assert.equal(again.json.lesson.id, ok.json.lesson.id);
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM ai_usage WHERE family_id = ? AND kind = 'lesson_draft'").get(p.familyId).n, 1);
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM lessons WHERE family_id = ?").get(p.familyId).n, 1);

  const st = await h.req(`/ai/lesson-draft/status?request_id=${id}`, { token: p.token });
  assert.equal(st.json.status, "done");
  assert.equal(st.json.lesson_id, ok.json.lesson.id);
  assert.equal(st.json.phase, "saving");
  const stranger = await h.register("stranger@example.com");
  assert.equal((await h.req(`/ai/lesson-draft/status?request_id=${id}`, { token: stranger.token })).json.status, "unknown", "another family sees nothing");
  // The job row never holds the request text or the lesson.
  assert.ok(!JSON.stringify(h.db.raw.prepare("SELECT * FROM ai_generation_jobs").all()).includes("two-digit"));
});

test("progress reports the real stage while the lesson is being written", async () => {
  let release;
  const gate = new Promise((r) => { release = r; });
  const base = fakeAi();
  const ai = { calls: base.calls, run: async (m, input, o) => { if (input.messages.at(-1).content.includes("STAGE 4, PRACTICE")) await gate; return base.run(m, input, o); } };
  const h = await harness(ai);
  const p = await h.register("progress@example.com");
  const id = "req-progress-000001";
  const running = draft(h, p, id);
  let st;
  for (let i = 0; i < 200; i++) {
    st = await h.req(`/ai/lesson-draft/status?request_id=${id}`, { token: p.token });
    if (st.json.phase === "practice") break;
    await new Promise((r) => setTimeout(r, 5));
  }
  assert.equal(st.json.status, "running");
  assert.equal(st.json.phase, "practice");
  assert.equal(st.json.step, 4);
  release();
  assert.equal((await running).status, 200);
});

test("an interrupted request can be retried with the same id; a failed draft frees the allowance", async () => {
  const h = await harness();
  const p = await h.register("retry@example.com");
  const id = "req-interrupted-001";
  const old = new Date(Date.now() - 20 * 60_000).toISOString();
  h.db.raw.prepare("CREATE TABLE IF NOT EXISTS ai_generation_jobs (id TEXT PRIMARY KEY, family_id TEXT NOT NULL, user_id TEXT NOT NULL, request_id TEXT NOT NULL, kind TEXT NOT NULL, status TEXT NOT NULL, phase TEXT, lesson_id TEXT, error TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (family_id, request_id))").run();
  h.db.raw.prepare("INSERT INTO ai_generation_jobs VALUES ('j1', ?, 'u', ?, 'lesson_draft', 'running', 'teaching', NULL, NULL, ?, ?)").run(p.familyId, id, old, old);
  h.db.raw.prepare("INSERT INTO ai_usage (id, family_id, user_id, kind, status, created_at) VALUES ('stuck', ?, 'u', 'lesson_draft', 'pending', ?)").run(p.familyId, old);
  assert.equal((await h.req(`/ai/lesson-draft/status?request_id=${id}`, { token: p.token })).json.status, "interrupted");
  const r = await draft(h, p, id);
  assert.equal(r.status, 200, JSON.stringify(r.json));
  assert.equal(h.db.raw.prepare("SELECT status FROM ai_usage WHERE id = 'stuck'").get().status, "failed", "a stopped Worker's reservation is released");
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM ai_generation_jobs").get().n, 1, "the same job row is reused");
});

test("parallel drafts can't overrun the daily allowance, and repeated failures pause drafting", async () => {
  const h = await harness();
  const p = await h.register("quota@example.com");
  const ts = new Date().toISOString();
  for (let i = 0; i < aid.AI_LIMITS.perDay - 1; i++) h.db.raw.prepare("INSERT INTO ai_usage (id, family_id, user_id, kind, status, created_at) VALUES (?, ?, 'u', 'lesson_draft', 'ok', ?)").run(`u${i}`, p.familyId, ts);
  const results = await Promise.all([1, 2, 3].map((i) => draft(h, p, `req-quota-parallel-${i}`)));
  assert.equal(results.filter((r) => r.status === 200).length, 1, JSON.stringify(results.map((r) => r.status)));
  assert.ok(results.filter((r) => r.status !== 200).every((r) => r.status === 429));
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM ai_usage WHERE family_id = ? AND status != 'failed'").get(p.familyId).n, aid.AI_LIMITS.perDay);

  const q = await h.register("failing@example.com");
  for (let i = 0; i < aid.AI_LIMITS.failedPerDay; i++) h.db.raw.prepare("INSERT INTO ai_usage (id, family_id, user_id, kind, status, created_at) VALUES (?, ?, 'u', 'lesson_draft', 'failed', ?)").run(`f${i}`, q.familyId, ts);
  const paused = await draft(h, q, "req-after-failures");
  assert.equal(paused.status, 429);
  assert.equal(paused.json.code, "AI_FAILURES");
});
