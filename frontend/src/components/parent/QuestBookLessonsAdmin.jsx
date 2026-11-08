import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BookOpenCheck, Check, FileSearch, Loader2, Sparkles, Upload } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";
import { readPdfChapters } from "../../lib/pdfPages";

/**
 * Owner-only: read a book's chapters from its PDF bookmarks, draft one lesson per chapter with the normal
 * AI lesson generator (drafts go to the owner's own library for review), then publish the reviewed lessons to the book.
 */
export default function QuestBookLessonsAdmin({ book, onChanged }) {
  const [data, setData] = useState(null);
  const [scan, setScan] = useState(null); // chapters read from a PDF, awaiting confirmation
  const [busy, setBusy] = useState("");
  const load = () => api.get(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters`, { params: { _: Date.now() } })
    .then((r) => setData(r.data)).catch((e) => toast.error(apiErrorMessage(e, "Could not load chapters")));
  useEffect(() => { load(); }, [book.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const readFile = async (file) => {
    setBusy("scan");
    try {
      const r = await readPdfChapters(file);
      if (!r.chapters.length) toast.error("This PDF has no bookmarks, so chapters can't be found. Export it again with headings saved as bookmarks (some tools call this an outline or table of contents).", { duration: 12000 });
      else setScan(r.chapters);
    } catch (e) { toast.error("Could not read that PDF."); }
    finally { setBusy(""); }
  };
  const saveScan = async () => {
    const chosen = scan.filter((c) => c.include).map(({ include, ...c }) => c);
    if (!chosen.length) { toast.error("Tick at least one chapter."); return; }
    setBusy("save");
    try {
      await api.put(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters`, { chapters: chosen }, { timeout: 120000 });
      toast.success(`Saved ${chosen.length} chapters`);
      setScan(null); await load(); onChanged?.();
    } catch (e) { toast.error(apiErrorMessage(e, "Could not save the chapters")); }
    finally { setBusy(""); }
  };
  const draft = async (ch) => {
    setBusy(ch.id);
    try {
      await api.post(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters/${ch.id}/draft`, {}, { timeout: 10 * 60 * 1000 });
      toast.success(`Lesson drafted for “${ch.title}”. Review it before publishing.`);
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
    const items = data.chapters.filter((c) => c.draft).map((c) => ({ chapter_id: c.id, lesson_id: c.draft.lesson_id }));
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

  if (scan) return (
    <div className="rounded-xl border border-emerald-300 bg-white p-4 space-y-3" data-testid="quest-chapter-scan">
      <p className="text-sm text-emerald-950"><b>{scan.length} chapters found.</b> Untick anything that isn't a teaching chapter (welcome pages, answers, parent notes). You can rename chapters too.</p>
      <ul className="divide-y divide-stone-100">
        {scan.map((c, i) => (
          <li key={i} className="flex items-center gap-3 py-1.5">
            <input type="checkbox" checked={c.include} onChange={(e) => setScan((s) => s.map((x, j) => j === i ? { ...x, include: e.target.checked } : x))} />
            <input value={c.title} onChange={(e) => setScan((s) => s.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} className="flex-1 rounded border border-stone-200 px-2 py-1 text-sm" />
            <span className="text-xs text-stone-500 whitespace-nowrap">pages {c.start}–{c.end}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-2"><button type="button" onClick={saveScan} disabled={!!busy} className="rounded-lg bg-emerald-900 text-white px-4 py-2 text-sm font-bold">{busy === "save" ? "Saving…" : "Save chapters"}</button>
        <button type="button" onClick={() => setScan(null)} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold">Cancel</button></div>
    </div>
  );
  if (!data) return <p className="text-sm text-stone-500" role="status">Loading chapters…</p>;
  const drafted = data.chapters.filter((c) => c.draft).length;
  return (
    <div className="rounded-xl border border-emerald-300 bg-white p-4 space-y-3" data-testid="quest-lessons-admin">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 mr-auto"><BookOpenCheck size={16} /> Chapter lessons</h4>
        {pdfPicker(data.chapters.length ? "Re-read chapters from the PDF" : "Read chapters from the PDF")}
      </div>
      {!data.chapters.length ? (
        <p className="text-sm text-stone-600">Choose this book's PDF. Side-Quest reads its chapters from the PDF's bookmarks, then you can make one lesson per chapter.</p>
      ) : <>
        <p className="text-sm text-stone-600">Each lesson is written by the normal lesson generator from that chapter's text and saved in <b>My lessons</b> for you to review and edit. When you're happy, publish them to the book. Families only ever see published lessons.</p>
        <ul className="divide-y divide-stone-100">
          {data.chapters.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-2 py-2">
              <span className="flex-1 min-w-[160px] text-sm"><b>{c.title}</b> <span className="text-xs text-stone-500">· pages {c.start}–{c.end}</span>{c.published && <span className="ml-2 text-[10px] font-bold uppercase text-emerald-700">Published</span>}</span>
              {c.draft && <Link to={`/parent/lessons/${c.draft.lesson_id}`} className="text-sm font-semibold text-emerald-900 underline">Review “{c.draft.title}”</Link>}
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
