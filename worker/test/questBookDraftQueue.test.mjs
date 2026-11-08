import test from "node:test";
import assert from "node:assert/strict";
import { runBookDraftQueue } from "../../frontend/src/lib/questBookDraftQueue.mjs";

const chapter = (id) => ({ id, title: `Lesson ${id}` });

test("Quest Book batch continues after a failed lesson and retries are targeted", async () => {
  const attempted = [], progress = [];
  const result = await runBookDraftQueue([chapter("a"), chapter("b"), chapter("c")], async (ch) => {
    attempted.push(ch.id);
    return ch.id === "b" ? { ok: false, error: "Provider unavailable" } : { ok: true };
  }, { onProgress: (value) => progress.push(value) });
  assert.deepEqual(attempted, ["a", "b", "c"], "one failure must not halt later lessons");
  assert.equal(result.total, 3);
  assert.equal(result.completed, 2);
  assert.equal(result.attempted, 3);
  assert.deepEqual(result.failed.map((f) => f.id), ["b"]);
  assert.equal(result.failed[0].error, "Provider unavailable");
  assert.deepEqual(progress.map((p) => p.attempted), [0, 1, 2, 3]);
  const retried = [];
  const retry = await runBookDraftQueue(result.failed.map((f) => chapter(f.id)), async (ch) => {
    retried.push(ch.id);
    return { ok: true };
  });
  assert.deepEqual(retried, ["b"], "successful lessons must not be regenerated during retry");
  assert.equal(retry.completed, 1);
});

test("Queue catches unexpected generator errors and attempts remaining lessons", async () => {
  const result = await runBookDraftQueue([chapter("one"), chapter("two"), chapter("three")], async (ch) => {
    if (ch.id === "two") throw new Error("AI timeout");
    return { ok: true };
  });
  assert.equal(result.completed, 2);
  assert.deepEqual(result.failed.map((f) => f.error), ["AI timeout"]);
  assert.equal(result.stopped, false);
});

test("Queue stops after current attempt and never starts duplicate subsections", async () => {
  let stop = false;
  const attempted = [];
  const result = await runBookDraftQueue([chapter("first"), chapter("first"), chapter("second")], async (ch) => {
    attempted.push(ch.id);
    stop = true;
    return { ok: true };
  }, { shouldStop: () => stop });
  assert.deepEqual(attempted, ["first"]);
  assert.equal(result.total, 2, "a subsection id must only appear once per batch");
  assert.equal(result.attempted, 1);
  assert.equal(result.stopped, true);
});
