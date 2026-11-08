/**
 * Sequential Quest Book lesson drafting. A failed subsection must never abort
 * the rest of the book, and one batch must not retry a subsection endlessly.
 * The owner may stop AFTER the in-flight request finishes.
 */
export async function runBookDraftQueue(chapters, generate, { shouldStop = () => false, onProgress = () => {} } = {}) {
  const ordered = [];
  const seen = new Set();
  for (const chapter of chapters || []) {
    if (!chapter?.id || seen.has(chapter.id)) continue;
    seen.add(chapter.id);
    ordered.push(chapter);
  }
  const result = { total: ordered.length, attempted: 0, completed: 0, failed: [], stopped: false };
  onProgress({ ...result, failed: [] });
  for (const chapter of ordered) {
    if (shouldStop()) { result.stopped = true; break; }
    let outcome;
    try { outcome = await generate(chapter); }
    catch (error) { outcome = { ok: false, error: error?.message || "Lesson generation failed" }; }
    result.attempted += 1;
    if (outcome?.ok === true) result.completed += 1;
    else result.failed.push({ id: chapter.id, title: chapter.title, error: String(outcome?.error || "Lesson generation failed") });
    onProgress({ ...result, failed: [...result.failed] });
  }
  return result;
}
