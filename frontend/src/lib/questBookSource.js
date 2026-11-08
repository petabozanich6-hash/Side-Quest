/**
 * Compile selected SOURCE excerpts for one teachable skill across multiple PDF
 * pages. The existing AI generator accepts 8,000 source characters per lesson.
 * Do not cut the entire source off at page 1 (or make one lesson per page).
 * Preserve page labels and sample both beginnings and ends across the full span.
 */
export function compileBookSubsectionSource(pages, maxLength = 7900) {
  if (!Array.isArray(pages) || !pages.length) throw new Error("No PDF pages were selected.");
  const valid = pages.map((p) => ({ page: Number(p.page), text: String(p.text || "").trim() }));
  if (valid.some((p, i) => !Number.isInteger(p.page) || p.page < 1 || (i && p.page !== valid[i - 1].page + 1)))
    throw new Error("Lesson source pages must be in consecutive PDF page order.");
  const full = valid.map((p) => `[PDF page ${p.page}]\n${p.text}`).join("\n\n");
  if (full.length <= maxLength) return { text: full, abbreviated: false, originalChars: full.length };
  const note = "SELECTED PAGE EXCERPTS: This is a representative extract from each listed PDF page, not a complete transcript. Use the stated learning goal and make your lesson independently teachable. Do not claim to quote unprovided passages.\n";
  const overhead = note.length + valid.reduce((n, p) => n + `[PDF page ${p.page}]\n\n\n`.length + 5, 0);
  const available = maxLength - overhead;
  if (available < valid.length * 40) throw new Error("This page range is too large to create a useful excerpt.");
  const base = Math.floor(available / valid.length);
  const spare = available % valid.length;
  const parts = valid.map((p, i) => {
    const share = base + (i < spare ? 1 : 0);
    if (p.text.length <= share) return `[PDF page ${p.page}]\n${p.text}`;
    const front = Math.max(1, Math.floor((share - 5) * 0.7));
    const back = Math.max(1, share - 5 - front);
    return `[PDF page ${p.page}]\n${p.text.slice(0, front)} ... ${p.text.slice(-back)}`;
  });
  const text = note + parts.join("\n\n");
  if (text.length > maxLength) throw new Error("The selected PDF excerpts exceed the AI lesson context limit.");
  return { text, abbreviated: true, originalChars: full.length };
}
