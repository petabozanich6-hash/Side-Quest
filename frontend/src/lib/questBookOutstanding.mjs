/** Owner-only presentation helpers for the Book Companion Lessons review queue.
 * Read-only: never change saved lessons or approval state just to sort a list.
 */
export function outstandingBookChapters(chapters = []) {
  const rank = (chapter) => {
    const draft = chapter?.draft;
    if (draft?.stale) return 0; // A changed source cannot be approved as-is.
    if (draft?.repair_requested) return 1; // The owner explicitly reported a missed error.
    if (draft?.quality_issues?.length) return 2;
    if (draft?.ai_warning_count > 0) return 3;
    if (draft && !draft.ai_cleared) return 4;
    if (!draft) return 5; // Needs generation.
    return 6; // Clean but not yet owner-approved.
  };
  return (chapters || [])
    .map((chapter, index) => ({ chapter, index }))
    .filter(({ chapter }) => !chapter?.draft?.reviewed || !!chapter.draft.stale)
    .sort((a, b) => rank(a.chapter) - rank(b.chapter) || a.index - b.index)
    .map(({ chapter }) => chapter);
}

export function outstandingBookReason(chapter) {
  const draft = chapter?.draft;
  if (!draft) return "Not generated yet.";
  if (draft.stale) return "The workbook source changed. This lesson needs checking against the new source.";
  if (draft.repair_requested) return `You marked this lesson as needing repair: ${draft.repair_note || "Review the problem you spotted."}`;
  const quality = Array.isArray(draft.quality_issues) ? draft.quality_issues : [];
  if (quality.length) return `Missing content: ${quality.join("; ")}.`;
  if (draft.ai_warning_count > 0) return `The AI flagged ${draft.ai_warning_count} warning${draft.ai_warning_count === 1 ? "" : "s"} for review.`;
  if (draft.ai_cleared) return "AI-cleared and awaiting your approval.";
  return "Saved but not approved. Open it to review or confirm.";
}
