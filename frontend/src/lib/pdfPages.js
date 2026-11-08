// Scanned PDFs are pictures of pages with no text, so the server can't read them. This turns their pages into JPEGs
// in the browser, which are then read like photos. pdf.js is loaded only when a PDF is chosen.

const canvasBlob = (canvas) => new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));

async function loadPdf(file) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();
  return pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
}

/**
 * Whether the PDF has real text (typed reports do; scans don't), and for a scan, up to `maxPages` page pictures
 * about `width` pixels wide: [{ blob, url }].
 */
export async function readPdfPages(file, { maxPages = 20, width = 1400 } = {}) {
  const doc = await loadPdf(file);
  let chars = 0;
  for (let i = 1; i <= Math.min(doc.numPages, 3) && chars < 80; i++) {
    const content = await (await doc.getPage(i)).getTextContent();
    chars += content.items.map((it) => it.str || "").join("").replace(/\s+/g, "").length;
  }
  if (chars >= 80) return { hasText: true, total: doc.numPages, pages: [] };
  const pages = [];
  for (let i = 1; i <= Math.min(doc.numPages, maxPages); i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width); canvas.height = Math.round(viewport.height);
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    const blob = await canvasBlob(canvas);
    if (blob) pages.push({ blob, url: URL.createObjectURL(blob) });
  }
  return { hasText: false, total: doc.numPages, pages };
}

/** The same page picture turned upside down (many scans are fed in the wrong way round). */
export async function turnedPage(blob) {
  const img = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = img.width; canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.translate(img.width, img.height); ctx.rotate(Math.PI);
  ctx.drawImage(img, 0, 0);
  return (await canvasBlob(canvas)) || blob;
}

const SKIP_CHAPTER = /welcome|contents|journey|toolkit|answer|solution|parent|teaching tip|certificate|progress|how to use/i;

/**
 * Reads a book PDF's chapters for Quest Books "make a lesson from a chapter".
 * Uses the PDF's bookmarks (Canva, Word and most design tools export them from headings). Each chapter runs from its
 * bookmark's page to the page before the next bookmark. Returns [{ title, start, end, text, include }].
 */
export async function readPdfChapters(file) {
  const doc = await loadPdf(file);
  const outline = (await doc.getOutline()) || [];
  const marks = [];
  for (const item of outline) {
    try {
      const dest = typeof item.dest === "string" ? await doc.getDestination(item.dest) : item.dest;
      if (!dest || !dest[0]) continue;
      const page = (await doc.getPageIndex(dest[0])) + 1;
      if (item.title && page) marks.push({ title: String(item.title).trim().slice(0, 120), start: page });
    } catch { /* skip a bookmark we can't resolve */ }
  }
  marks.sort((a, b) => a.start - b.start);
  const pageText = async (n) => {
    const content = await (await doc.getPage(n)).getTextContent();
    return content.items.map((it) => it.str || "").join(" ").replace(/\s+/g, " ").trim();
  };
  const chapters = [];
  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].start;
    const end = Math.max(start, (marks[i + 1]?.start || doc.numPages + 1) - 1);
    const parts = [];
    for (let p = start; p <= end && p <= doc.numPages; p++) parts.push(await pageText(p));
    chapters.push({ title: marks[i].title, start, end, text: parts.join("\n\n").slice(0, 30000), include: !SKIP_CHAPTER.test(marks[i].title) });
  }
  return { total: doc.numPages, chapters };
}
