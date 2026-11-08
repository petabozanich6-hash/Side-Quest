import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BookOpenCheck, Check, FileSearch, Loader2, Sparkles, Upload } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";
import { readPdfChapters } from "../../lib/pdfPages";

/**
 * Owner-only: the PDF chapter analyser proposes skill-based subsections automatically.
 * Owner chooses which ready-made subsection lessons to generate, review and publish.
 */
export default function QuestBookLessonsAdmin({ book, onChanged }) {
  const [data, setData] = useState(null);
  const [scan, setScan] = useState(null); // chapters read from a PDF, awaiting confirmation
  const [busy, setBusy] = useState("");
  const [scanProgress, setScanProgress] = useState("");
  const [approved, setApproved] = useState({});
  const load = () => api.get(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters`, { params: { _: Date.now() } })
    .then((r) => setData(r.data)).catch((e) => toast.error(apiErrorMessage(e, "Could not load chapters")));
  useEffect(() => { load(); }, [book.id]); // eslint-disable-line react-hooks/exhaustive-deps
  // First time: read the chapters from the uploaded PDF automatically.
  const autoRead = React.useRef(false);
  useEffect(() => {
    if (data && !data.chapters.length && book.has_book && !autoRead.current && !busy) { autoRead.current = true; void readUploaded(); }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reads chapters straight from the Book PDF already uploaded for this book.
  const readUploaded = async () => {
    setBusy("scan");
    try {
      const r = await api.get(`/quest-books/books/${encodeURIComponent(book.id)}/download`, { responseType: "blob", timeout: 5 * 60 * 1000 });
      await readFile(new Blob([r.data], { type: "application/pdf" }), true);
    } catch (e) {
      toast.error(e?.response ? "Could not open the uploaded PDF." : "Could not read the uploaded PDF.");
      setBusy("");
    }
  };
  const readFile = async (file, already) => {
    if (!already) setBusy("scan");
    try {
      const r = await readPdfChapters(file);
      const chapters = r.chapters.filter((chapter) => chapter.include);
      if (!chapters.length) {
        toast.error("No teachable chapters were found. The PDF needs bookmarks or recognisable Unit/Chapter headings.", { duration: 12000 });
        return;
      }
      const previous = data?.chapters || [];
      const used = new Set();
      const freshId = () => "s-" + crypto.randomUUID().replace(/-/g, "").slice(0, 20);
      // Previously published keys must remain attached to the exact page range they were sold for.
      const priorId = (unit, start, end) => {
        const matched = previous.find((p) => !used.has(p.id) && (p.unit_title || p.title) === unit &&
          p.start === start && p.end === end);
        if (matched) used.add(matched.id);
        return matched?.id || freshId();
      };
      const planned = [];
      const batchesFor = (pages) => {
        const batches = [];
        for (let i = 0; i < pages.length;) {
          const batch = []; let totalChars = 0;
          while (i < pages.length && batch.length < 24 && (batch.length === 0 || totalChars + pages[i].text.length < 120000)) {
            batch.push(pages[i]); totalChars += pages[i].text.length; i++;
          }
          batches.push(batch);
        }
        return batches;
      };
      const total = chapters.reduce((n, chapter) => n + batchesFor(chapter.page_texts).length, 0);
      let step = 0;
      let preserved = 0;
      for (const chapter of chapters) {
        const saved = previous.filter((p) => (p.unit_title || p.title) === chapter.title
          && p.start >= chapter.start && p.end <= chapter.end);
        // Do not invalidate purchases by changing the structure of chapters
        // with published lessons. An existing published chapter keeps its
        // subsection plan; new chapters can be analysed automatically.
        if (saved.some((p) => p.published)) {
          const ordered = [...saved].sort((a, b) => a.start - b.start);
          if (ordered.some((p, i) => i && ordered[i-1].end >= p.start))
            throw new Error(`Existing published subsections in “${chapter.title}” overlap. Please review before rescanning.`);
          for (const prior of ordered) {
            used.add(prior.id);
            const selected = chapter.page_texts.filter((p) => p.page >= prior.start && p.page <= prior.end);
            if (!selected.length || selected.length !== prior.end - prior.start + 1)
              throw new Error(`The pages of the published lesson “${prior.title}” changed. Its purchase reference must be reviewed.`);
            planned.push({
              id: prior.id, unit_title: chapter.title, title: prior.title,
              skill_goal: prior.skill_goal || prior.title, exercise_ref: prior.exercise_ref || "",
              start: prior.start, end: prior.end, text: selected.map((p) => p.text).join("\n\n"),
              page_texts: selected, include: true,
            });
          }
          preserved++;
          step += batchesFor(chapter.page_texts).length;
          continue;
        }
        for (const pages of batchesFor(chapter.page_texts)) {
          setScanProgress(`Analysing chapter “${chapter.title}” (${++step} of ${total})`);
          const res = await api.post(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters/plan`,
            { chapter_title: chapter.title, pages }, { timeout: 180000 });
          const suggestions = res.data?.subsections || [];
          if (!suggestions.length) throw new Error(`No teachable subsections were identified in “${chapter.title}”.`);
          for (const sub of suggestions) {
            const selected = pages.filter((p) => p.page >= sub.start && p.page <= sub.end);
            const text = selected.map((p) => p.text).join("\n\n");
            if (text.replace(/\s/g, "").length < 40 || text.length > 8000)
              throw new Error(`Subsection “${sub.title}” could not be prepared within the lesson source limit. Please check the PDF text.`);
            planned.push({
              id: priorId(chapter.title, sub.start, sub.end), unit_title: chapter.title,
              title: sub.title, skill_goal: sub.skill_goal || sub.title, exercise_ref: sub.exercise_ref || "",
              start: sub.start, end: sub.end, text, page_texts: selected, include: true,
            });
          }
        }
      }
      if (preserved) toast.message(`${preserved} chapters with published lessons kept their existing subsection structure to protect family purchases.`);
      setScan(planned);
      setApproved({});
      toast.success(`Identified ${chapters.length} chapters and ${planned.length} lesson subsections.`);
    } catch (e) { toast.error(e?.response ? apiErrorMessage(e, "Automatic chapter analysis failed") : e.message || "Could not analyse the PDF.", { duration: 11000 }); }
    finally { setScanProgress(""); setBusy(""); }
  };
  const saveScan = async () => {
    const chosen = scan.filter((c) => c.include).map(({ include, page_texts, ...c }) => c);
    if (!chosen.length) { toast.error("Tick at least one session."); return; }
    const tooLarge = chosen.find((c) => c.text.length > 8000);
    if (tooLarge) { toast.error(`“${tooLarge.title}” has more than 8,000 characters. Re-analyse the PDF; no lesson source will be silently truncated.`); return; }
    const unclear = chosen.find((c) => !c.skill_goal?.trim());
    if (unclear) { toast.error(`Add a specific learning goal for “${unclear.title}”.`); return; }
    setBusy("save");
    try {
      await api.put(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters`, { chapters: chosen }, { timeout: 120000 });
      toast.success(`Saved ${chosen.length} chapter subsections, ready for lesson generation`);
      setScan(null); await load(); onChanged?.();
    } catch (e) { toast.error(apiErrorMessage(e, "Could not save the chapters")); }
    finally { setBusy(""); }
  };
  const draft = async (ch) => {
    setBusy(ch.id);
    try {
      await api.post(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters/${ch.id}/draft`, {}, { timeout: 10 * 60 * 1000 });
      toast.success(`Lesson drafted for “${ch.title}”. Review it before publishing.`);
      setApproved((prior) => ({ ...prior, [ch.id]: false }));
      await load();
      return true;
    } catch (e) { toast.error(`${ch.title}: ${apiErrorMessage(e, "the lesson couldn't be drafted")}`, { duration: 9000 }); return false; }
    finally { setBusy(""); }
  };
  const draftAll = async () => {
    for (const ch of data.chapters.filter((c) => !c.draft)) {
      if (!(await draft(ch))) break;
    }
  };
  const publish = async () => {
    const drafts = data.chapters.filter((c) => c.draft);
    if (drafts.some((c) => c.draft.stale)) { toast.error("One or more lessons have changed workbook sources. Regenerate those sessions before publishing."); return; }
    if (drafts.some((c) => c.draft.status !== "ready")) { toast.error("Review each lesson and mark it Ready before publishing."); return; }
    if (drafts.some((c) => approved[c.id] !== true)) { toast.error("Tick the review approval for each lesson before publishing."); return; }
    const items = drafts.map((c) => ({ chapter_id: c.id, lesson_id: c.draft.lesson_id, reviewed: true }));
    setBusy("publish");
    try {
      const r = await api.post(`/quest-books/admin/books/${encodeURIComponent(book.id)}/lessons/publish`, { items });
      toast.success(`Published ${r.data.published} lessons to “${book.title}”.`);
      await load(); onChanged?.();
    } catch (e) { toast.error(apiErrorMessage(e, "Could not publish the lessons")); }
    finally { setBusy(""); }
  };

  const pdfPicker = (label) => (
    <label className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400 bg-white px-3 py-2 text-sm font-semibold text-emerald-900 cursor-pointer hover:bg-emerald-50">
      {busy === "scan" ? <Loader2 size={15} className="animate-spin" /> : <FileSearch size={15} />} {busy === "scan" ? "Reading the PDF…" : label}
      <input type="file" accept="application/pdf,.pdf" className="sr-only" disabled={!!busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void readFile(f); e.target.value = ""; }} />
    </label>
  );

  if (scan) {
    const groups = [];
    for (const entry of scan) {
      const title = entry.unit_title || entry.title;
      let group = groups.find((g) => g.title === title);
      if (!group) { group = { title, entries: [] }; groups.push(group); }
      group.entries.push(entry);
    }
    return (
      <div className="rounded-xl border border-emerald-300 bg-white p-4 space-y-4" data-testid="quest-chapter-scan">
        <p className="text-sm text-emerald-950"><b>Automatic workbook lesson plan:</b> {groups.length} chapters, {scan.length} suggested subsections. The system chose the learning skills and page boundaries. You can optionally correct a title or learning goal, but do not have to split anything yourself.</p>
        {groups.map((group, gi) => (
          <section key={gi} className="rounded-lg border border-stone-200 p-3 space-y-2">
            <h5 className="font-bold text-emerald-950">Chapter {gi + 1}: {group.title}</h5>
            <ol className="list-decimal pl-5 space-y-3">
              {group.entries.map((c) => {
                const index = scan.indexOf(c);
                return (
                  <li key={c.id} className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" aria-label={`Include ${c.title}`} checked={c.include} onChange={(e) => setScan((v) => v.map((x, i) => i === index ? { ...x, include: e.target.checked } : x))} />
                      <input aria-label="Subsection lesson title" value={c.title} onChange={(e) => setScan((v) => v.map((x, i) => i === index ? { ...x, title: e.target.value } : x))} className="flex-1 min-w-0 rounded border border-stone-200 px-2 py-1" />
                      <span className="text-xs text-stone-500 whitespace-nowrap">PDF pp. {c.start}–{c.end}</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <input aria-label="Learning objective" value={c.skill_goal} onChange={(e) => setScan((v) => v.map((x, i) => i === index ? { ...x, skill_goal: e.target.value } : x))} className="rounded border border-stone-200 px-2 py-1" />
                      <input aria-label="Workbook practice reference" placeholder="Optional workbook exercises" value={c.exercise_ref} onChange={(e) => setScan((v) => v.map((x, i) => i === index ? { ...x, exercise_ref: e.target.value } : x))} className="rounded border border-stone-200 px-2 py-1" />
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={saveScan} disabled={!!busy} className="rounded-lg bg-emerald-900 text-white px-4 py-2 text-sm font-bold">{busy === "save" ? "Saving…" : "Save chapter and subsection plan"}</button>
          <button type="button" onClick={() => setScan(null)} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold">Cancel</button>
        </div>
      </div>
    );
  }
  if (!data) return <p className="text-sm text-stone-500" role="status">Loading chapters…</p>;
  const drafted = data.chapters.filter((c) => c.draft).length;
  return (
    <div className="rounded-xl border border-emerald-300 bg-white p-4 space-y-3" data-testid="quest-lessons-admin">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 mr-auto"><BookOpenCheck size={16} /> Book companion lessons</h4>
        {book.has_book && <button type="button" onClick={readUploaded} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400 bg-white px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-50">
          {busy === "scan" ? <Loader2 size={15} className="animate-spin" /> : <FileSearch size={15} />} {busy === "scan" ? "Analysing the book…" : data.chapters.length ? "Re-analyse chapter structure" : "Analyse chapters and subsections"}
        </button>}
        {!book.has_book && pdfPicker("Read chapters from a PDF")}
      </div>
      {scanProgress && <p className="text-sm font-semibold text-violet-900" role="status">{scanProgress}</p>}
      {!data.chapters.length ? (
        <p className="text-sm text-stone-600">{book.has_book ? "Side-Quest automatically identifies chapters and their teachable subsections, with learning goals and workbook page references. You only decide which lessons to generate." : "Upload the Book PDF first, then its sessions can be read here."}</p>
      ) : <>
        <p className="text-sm text-stone-600">Each chapter subsection creates one complete Side-Quest lesson, with explicit teaching, worked examples, guided and independent practice, assessment and parent answers. It works online or printed on its own. Workbook page references are additional practice for parents. Review the draft in <b>My lessons</b>, set it to Ready, then tick its approval before publishing.</p>
        <ul className="divide-y divide-stone-100">
          {data.chapters.map((c, i) => (
            <li key={c.id} className="flex flex-wrap items-center gap-2 py-2">
              <span className="flex-1 min-w-[160px] text-sm"><span className="text-xs font-semibold text-emerald-800">{i === 0 || (data.chapters[i-1].unit_title || data.chapters[i-1].title) !== (c.unit_title || c.title) ? `Chapter: ${c.unit_title || c.title} · ` : ""}</span><b>{c.title}</b> <span className="text-xs text-stone-500">· PDF pp. {c.start}–{c.end} · {c.skill_goal || "Learning goal not set"}</span>{c.published && <span className="ml-2 text-[10px] font-bold uppercase text-emerald-700">Published</span>}{c.draft?.stale && <span className="ml-2 text-[10px] font-bold uppercase text-rose-700">Source changed — regenerate</span>}</span>
              {c.draft && <Link to={`/parent/lessons/${c.draft.lesson_id}/review`} className="text-sm font-semibold text-emerald-900 underline">Review “{c.draft.title}”</Link>}
              {c.draft && <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-950">
                <input type="checkbox" disabled={c.draft.stale || c.draft.status !== "ready" || !!busy} checked={approved[c.id] === true} onChange={(e) => setApproved((v) => ({ ...v, [c.id]: e.target.checked }))} />
                I checked the lesson and answers
              </label>}
              <button type="button" disabled={!!busy} onClick={() => draft(c)} className="inline-flex items-center gap-1 rounded-lg border border-violet-300 px-3 py-1.5 text-xs font-bold text-violet-900 hover:bg-violet-50 disabled:opacity-50">
                {busy === c.id ? <><Loader2 size={13} className="animate-spin" /> Writing (1–3 min)…</> : <><Sparkles size={13} /> {c.draft ? "Remake" : "Make lesson"}</>}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 items-center">
          {drafted < data.chapters.length && <button type="button" disabled={!!busy} onClick={draftAll} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 text-white px-4 py-2 text-sm font-bold disabled:opacity-50"><Sparkles size={15} /> Make all missing lessons ({data.chapters.length - drafted})</button>}
          <button type="button" disabled={!!busy || !drafted} onClick={publish} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-900 text-white px-4 py-2 text-sm font-bold disabled:opacity-50">{busy === "publish" ? "Publishing…" : <><Upload size={15} /> Publish {drafted} lesson{drafted === 1 ? "" : "s"} to the book</>}</button>
          {data.published_count > 0 && <span className="text-xs text-emerald-800 inline-flex items-center gap-1"><Check size={13} /> {data.published_count} published</span>}
        </div>
        {busy && busy !== "publish" && busy !== "save" && <p className="text-xs text-stone-500">Keep this page open while lessons are being written.</p>}
      </>}
    </div>
  );
}
