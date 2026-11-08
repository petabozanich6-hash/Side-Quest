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
  const pageText = async (n) => {
    const content = await (await doc.getPage(n)).getTextContent();
    return content.items.map((it) => it.str || "").join(" ").replace(/\s+/g, " ").trim();
  };
  // Some PDF export tools omit bookmarks. Detect obvious Unit/Chapter headings
  // in the actual page text, then use bounded auto-labelled chapters as a fallback.
  // The AI planner identifies teachable subsections within these chapter ranges.
  if (!marks.length) {
    const pageHeads = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const first = (await pageText(p)).slice(0, 220);
      const match = /^(?:\s*)(?:(?:unit|chapter)\s*(?:\d+|[ivx]+)\s*[:.\-–]?\s*[A-Za-z][^\n.]{2,80})/i.exec(first);
      if (match) pageHeads.push({ title: match[0].replace(/\s+/g, " ").trim().slice(0, 120), start: p });
    }
    if (pageHeads.length >= 2) marks.push(...pageHeads);
    else {
      // This still requires readable text; image-only PDFs are not silently guessed.
      const start = doc.numPages > 4 ? 3 : 1;
      for (let p = start, n = 1; p <= doc.numPages; p += 12, n++)
        marks.push({ title: `Chapter ${n} — PDF pages ${p}–${Math.min(p + 11, doc.numPages)}`, start: p });
    }
  }
  marks.sort((a, b) => a.start - b.start);
  const distinct = marks.filter((mark, i) => i === 0 || mark.start !== marks[i - 1].start);
  const chapters = [];
  for (let i = 0; i < distinct.length; i++) {
    const start = distinct[i].start;
    const end = Math.max(start, (distinct[i + 1]?.start || doc.numPages + 1) - 1);
    const page_texts = [];
    for (let p = start; p <= end && p <= doc.numPages; p++) page_texts.push({ page: p, text: await pageText(p) });
    chapters.push({ title: distinct[i].title, start, end, text: page_texts.map((part) => part.text).join("\n\n").slice(0, 30000),
      page_texts, skill_goal: distinct[i].title, exercise_ref: "", include: !SKIP_CHAPTER.test(distinct[i].title) });
  }
  return { total: doc.numPages, chapters };
}

/** Every page (up to maxPages) as a picture, for an in-page preview that works the same on every device. */
export async function pdfPageImages(file, { maxPages = 30, width = 1100, onPage } = {}) {
  const doc = await loadPdf(file);
  const pages = [];
  for (let i = 1; i <= Math.min(doc.numPages, maxPages); i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width); canvas.height = Math.round(viewport.height);
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    const blob = await canvasBlob(canvas);
    if (blob) { pages.push(URL.createObjectURL(blob)); onPage?.([...pages]); }
  }
  return { total: doc.numPages, pages };
}

/**
 * Quest Books "look inside": a few small page pictures with a heavy watermark burned in, for parents to see before
 * buying. Low resolution on purpose (readable on screen, poor to print). Picks the first pages plus a spread from
 * the first half of the book, never the end (answers usually live there). Returns JPEG blobs.
 */
export async function lookInsidePages(file, { count = 6, width = 560, label = "SIDE-QUEST PREVIEW" } = {}) {
  const doc = await loadPdf(file);
  const n = doc.numPages;
  const picks = new Set([1, 2, 3].filter((p) => p <= n));
  const half = Math.max(4, Math.floor(n / 2));
  for (let i = 1; picks.size < Math.min(count, n) && i <= count; i++) picks.add(Math.min(n, Math.round(4 + ((half - 4) * i) / count)));
  const out = [];
  for (const p of [...picks].sort((a, b) => a - b).slice(0, count)) {
    const page = await doc.getPage(p);
    const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width); canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d");
    await page.render({ canvasContext: ctx, viewport }).promise;
    // Diagonal repeated watermark across the whole page.
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 5);
    ctx.font = `bold ${Math.round(width / 14)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(120, 40, 160, 0.22)";
    const step = Math.round(width / 5);
    for (let y = -canvas.height; y <= canvas.height; y += step) ctx.fillText(label, (y / step) % 2 ? width / 6 : -width / 6, y);
    ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(0, canvas.height - 26, canvas.width, 26);
    ctx.fillStyle = "#4c1d95"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`Preview · page ${p} of ${n} · sidequestlearning.app`, canvas.width / 2, canvas.height - 9);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.7));
    if (blob) out.push(blob);
  }
  return out;
}
