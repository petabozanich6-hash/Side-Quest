import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BookOpenCheck, Check, FileSearch, Loader2, Sparkles, Upload } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";
import { readPdfChapters } from "../../lib/pdfPages";

/**
 * Owner-only: split bookmarked PDF chapters into focused, page-grounded teaching sessions.
 * Draft complete assignable/printable companion lessons, review them, then explicitly approve publication.
 */
export default function QuestBookLessonsAdmin({ book, onChanged }) {
  const [data, setData] = useState(null);
  const [scan, setScan] = useState(null); // chapters read from a PDF, awaiting confirmation
  const [busy, setBusy] = useState("");
  const [splitAfter, setSplitAfter] = useState({});
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
      if (!r.chapters.length) toast.error("This PDF has no bookmarks, so chapters can't be found. Export it again with headings saved as bookmarks (some tools call this an outline or table of contents).", { duration: 12000 });
      else {
        const previous = data?.chapters || [];
        const used = new Set();
        // Match unchanged sessions to their old keys, so purchases never attach to another lesson
        // merely because the owner re-read or split the PDF.
        const sessions = r.chapters.map((ch) => {
          const match = previous.find((p) => !used.has(p.id) &&
            p.start === ch.start && p.end === ch.end && p.title === ch.title);
          if (match) used.add(match.id);
          return { ...ch, id: match?.id || ("s-" + crypto.randomUUID().replace(/-/g, "").slice(0, 20)) };
        });
        setScan(sessions);
      }
    } catch (e) { toast.error("Could not read that PDF."); }
    finally { setBusy(""); }
  };
  const splitSession = (index) => {
    const ch = scan[index];
    const point = Number(splitAfter[index]);
    if (!Number.isInteger(point) || point < ch.start || point >= ch.end) {
      toast.error("Enter a page inside this session, before its last page."); return;
    }
    const leftPages = ch.page_texts?.filter((p) => p.page <= point) || [];
    const rightPages = ch.page_texts?.filter((p) => p.page > point) || [];
    if (!leftPages.length || !rightPages.length || leftPages.some((p) => typeof p.text !== "string")) {
      toast.error("Re-read the book PDF to split this chapter by page."); return;
    }
    const joined = (pages) => pages.map((p) => p.text).join("\n\n");
    if (joined(leftPages).replace(/\s/g, "").length < 40 || joined(rightPages).replace(/\s/g, "").length < 40) {
      toast.error("Each session needs enough readable teaching text."); return;
    }
    setScan((old) => old.flatMap((item, j) => j === index ? [
      { ...item, end: point, page_texts: leftPages, text: joined(leftPages) },
      { ...item, id: "s-" + crypto.randomUUID().replace(/-/g, "").slice(0, 20),
        title: item.title + " — next skill", start: point + 1, page_texts: rightPages,
        text: joined(rightPages), skill_goal: "", exercise_ref: "" },
    ] : [item]));
    setSplitAfter({});
  };
  const saveScan = async () => {
    const chosen = scan.filter((c) => c.include).map(({ include, page_texts, ...c }) => c);
    if (!chosen.length) { toast.error("Tick at least one session."); return; }
    const tooLarge = chosen.find((c) => c.text.length > 8000);
    if (tooLarge) { toast.error(`“${tooLarge.title}” has more than 8,000 characters. Split it into smaller sessions so none of the text is silently lost.`); return; }
    const unclear = chosen.find((c) => !c.skill_goal?.trim());
    if (unclear) { toast.error(`Add a specific learning goal for “${unclear.title}”.`); return; }
    setBusy("save");
    try {
      await api.put(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters`, { chapters: chosen }, { timeout: 120000 });
      toast.success(`Saved ${chosen.length} focused lesson sessions`);
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

  if (scan) return (
    <div className="rounded-xl border border-emerald-300 bg-white p-4 space-y-3" data-testid="quest-chapter-scan">
      <p className="text-sm text-emerald-950"><b>{scan.length} bookmarked sections found.</b> Untick non-teaching sections, split multi-skill chapters by PDF page and give each session one learning goal. Keep sessions short enough for thorough lessons; their exact source text is preserved.</p>
      <ul className="divide-y divide-stone-100">
        {scan.map((c, i) => (
          <li key={i} className="py-3 space-y-2">
            <div className="flex items-center gap-2">
              <input aria-label={`Include session ${i + 1}`} type="checkbox" checked={c.include} onChange={(e) => setScan((v) => v.map((x, j) => j === i ? { ...x, include: e.target.checked } : x))} />
              <input aria-label="Lesson title" value={c.title} onChange={(e) => setScan((v) => v.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} className="min-w-0 flex-1 rounded border border-stone-200 px-2 py-1 text-sm" />
              <span className="text-xs text-stone-500 whitespace-nowrap">PDF pp. {c.start}–{c.end}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 pl-5">
              <input aria-label="One skill to teach" placeholder="Specific skill or learning goal (required)" value={c.skill_goal || ""} onChange={(e) => setScan((v) => v.map((x, j) => j === i ? { ...x, skill_goal: e.target.value } : x))} className="rounded border border-stone-200 px-2 py-1 text-sm" />
              <input aria-label="Workbook exercise reference" placeholder="Workbook exercises (e.g. Q1–8, p. 16)" value={c.exercise_ref || ""} onChange={(e) => setScan((v) => v.map((x, j) => j === i ? { ...x, exercise_ref: e.target.value } : x))} className="rounded border border-stone-200 px-2 py-1 text-sm" />
            </div>
            <div className="flex items-center gap-2 pl-5 text-xs text-stone-600">
              <span>{c.text.length.toLocaleString()} source characters {c.text.length > 8000 ? "(split required)" : ""}</span>
              {c.end > c.start && <><label className="ml-auto">Split after PDF page <input type="number" min={c.start} max={c.end - 1} value={splitAfter[i] ?? ""} onChange={(e) => setSplitAfter((v) => ({ ...v, [i]: e.target.value }))} className="w-16 rounded border border-stone-200 px-1 py-1 ml-1" /></label>
                <button type="button" onClick={() => splitSession(i)} className="rounded border border-emerald-400 px-2 py-1 font-semibold">Split into two sessions</button></>}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex gap-2"><button type="button" onClick={saveScan} disabled={!!busy} className="rounded-lg bg-emerald-900 text-white px-4 py-2 text-sm font-bold">{busy === "save" ? "Saving…" : "Save lesson sessions"}</button>
        <button type="button" onClick={() => setScan(null)} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold">Cancel</button></div>
    </div>
  );
  if (!data) return <p className="text-sm text-stone-500" role="status">Loading chapters…</p>;
  const drafted = data.chapters.filter((c) => c.draft).length;
  return (
    <div className="rounded-xl border border-emerald-300 bg-white p-4 space-y-3" data-testid="quest-lessons-admin">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 mr-auto"><BookOpenCheck size={16} /> Book companion lessons</h4>
        {book.has_book && <button type="button" onClick={readUploaded} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400 bg-white px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-50">
          {busy === "scan" ? <Loader2 size={15} className="animate-spin" /> : <FileSearch size={15} />} {busy === "scan" ? "Reading the book…" : data.chapters.length ? "Re-read chapters" : "Read chapters"}
        </button>}
        {!book.has_book && pdfPicker("Read chapters from a PDF")}
      </div>
      {!data.chapters.length ? (
        <p className="text-sm text-stone-600">{book.has_book ? "Side-Quest reads the PDF bookmarks, then you can split chapters into individual teachable sessions with exact page and exercise references." : "Upload the Book PDF first, then its sessions can be read here."}</p>
      ) : <>
        <p className="text-sm text-stone-600">Each session creates one complete Side-Quest lesson, with explicit teaching, worked examples, guided and independent practice, assessment and parent answers. It works online or printed on its own. Workbook page references are additional practice for parents. Review the draft in <b>My lessons</b>, set it to Ready, then tick its approval before publishing.</p>
        <ul className="divide-y divide-stone-100">
          {data.chapters.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-2 py-2">
              <span className="flex-1 min-w-[160px] text-sm"><b>{c.title}</b> <span className="text-xs text-stone-500">· PDF pp. {c.start}–{c.end} · {c.skill_goal || "Learning goal not set"}</span>{c.published && <span className="ml-2 text-[10px] font-bold uppercase text-emerald-700">Published</span>}{c.draft?.stale && <span className="ml-2 text-[10px] font-bold uppercase text-rose-700">Source changed — regenerate</span>}</span>
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
