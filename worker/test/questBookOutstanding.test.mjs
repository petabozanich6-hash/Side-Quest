import test from "node:test";
import assert from "node:assert/strict";
import { outstandingBookChapters, outstandingBookReason } from "../../frontend/src/lib/questBookOutstanding.mjs";

const chapter = (id, draft) => ({ id, title: `Lesson ${id}`, draft });

test("Book review prioritises blockers and omits already approved lessons", () => {
  const source = [
    chapter("approved", { reviewed: true, stale: false }),
    chapter("clean", { reviewed: false, ai_cleared: true, quality_issues: [] }),
    chapter("missing", null),
    chapter("flagged", { reviewed: false, ai_warning_count: 2, ai_cleared: false }),
    chapter("quality", { reviewed: false, quality_issues: ["two complete teaching explanations"] }),
    chapter("stale", { reviewed: false, stale: true }),
    chapter("manual", { reviewed: false, ai_warning_count: 0, ai_cleared: false }),
  ];
  const sorted = outstandingBookChapters(source);
  assert.deepEqual(sorted.map((entry) => entry.id), ["stale", "quality", "flagged", "manual", "missing", "clean"]);
  assert.equal(source[0].id, "approved", "sorting must not mutate the source list");
  assert.deepEqual(outstandingBookChapters([]), []);
});

test("Outstanding lessons expose the real reason they need attention", () => {
  assert.match(outstandingBookReason(chapter("a", null)), /Not generated/);
  assert.match(outstandingBookReason(chapter("b", { stale: true })), /source changed/);
  assert.match(outstandingBookReason(chapter("c", { quality_issues: ["two complete teaching explanations"] })), /two complete teaching explanations/);
  assert.match(outstandingBookReason(chapter("d", { ai_warning_count: 3 })), /3 warnings/);
  assert.match(outstandingBookReason(chapter("e", { ai_cleared: true })), /awaiting your approval/);
  assert.match(outstandingBookReason(chapter("f", {})), /not approved/);
});

test("Already approved lessons disappear; stale previously approved lessons reappear", () => {
  const rows = [
    chapter("approved", { reviewed: true }),
    chapter("became-stale", { reviewed: true, stale: true }),
    chapter("unchecked", { reviewed: false }),
  ];
  assert.deepEqual(outstandingBookChapters(rows).map((entry) => entry.id), ["became-stale", "unchecked"]);
});
