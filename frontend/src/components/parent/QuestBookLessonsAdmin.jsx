import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BookOpenCheck, Check, FileSearch, Loader2, Sparkles, Upload } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";
import { readPdfChapters } from "../../lib/pdfPages";
import { compileBookSubsectionSource } from "../../lib/questBookSource";
import { runBookDraftQueue } from "../../lib/questBookDraftQueue.mjs";
import { outstandingBookChapters, outstandingBookReason } from "../../lib/questBookOutstanding.mjs";

/**
 * Owner-only: the PDF chapter analyser proposes skill-based subsections automatically.
 * Owner chooses which ready-made subsection lessons to generate, review and publish.
 */
export default function QuestBookLessonsAdmin({ book, onChanged }) {
  const [data, setData] = useState(null);
  const [scan, setScan] = useState(null); // chapters read from a PDF, awaiting confirmation
  const [busy, setBusy] = useState("");
  const [scanProgress, setScanProgress] = useState("");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [reviewSearch, setReviewSearch] = useState("");
  const reviewListRef = React.useRef(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [batchProgress, setBatchProgress] = useState(null);
  const [batchSummary, setBatchSummary] = useState(null);
  const [approvalProgress, setApprovalProgress] = useState(null);
  const [approvalFailures, setApprovalFailures] = useState([]);
  const [fastReviewSummary, setFastReviewSummary] = useState(null);
  const stopDraftQueue = React.useRef(false);
  const batchRunning = React.useRef(false);
  const failureKey = `sq-quest-book-draft-failures:${book.id}`;
  const readFailures = () => {
    try { return JSON.parse(localStorage.getItem(failureKey) || "{}") || {}; }
    catch { return {}; }
  };
  const [failures, setFailures] = useState(readFailures);
  useEffect(() => { setFailures(readFailures()); setBatchSummary(null); }, [book.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const recordFailure = (ch, error) => setFailures((prev) => {
    const next = { ...prev, [ch.id]: String(error || "Lesson generation failed") };
    try { localStorage.setItem(failureKey, JSON.stringify(next)); } catch {}
    return next;
  });
  const clearFailure = (id) => setFailures((prev) => {
    const next = { ...prev };
    delete next[id];
    try { localStorage.setItem(failureKey, JSON.stringify(next)); } catch {}
    return next;
  });
  const load = () => api.get(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters`, { params: { _: Date.now() } })
    .then((r) => setData(r.data)).catch((e) => toast.error(apiErrorMessage(e, "Could not load chapters")));
  const autoRead = React.useRef(false);
  useEffect(() => {
    autoRead.current = false;
    setData(null);
    load();
  }, [book.id]); // eslint-disable-line react-hooks/exhaustive-deps
  // First time and following a clean rebuild: analyse the current uploaded
  // PDF once the request is idle. Include busy so reset cannot miss the trigger.
  useEffect(() => {
    if (data && !data.chapters.length && book.has_book && !autoRead.current && !busy) { autoRead.current = true; void readUploaded(); }
  }, [data, busy, book.has_book]); // eslint-disable-line react-hooks/exhaustive-deps

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
              start: prior.start, end: prior.end,
              text: compileBookSubsectionSource(selected).text,
              source_abbreviated: compileBookSubsectionSource(selected).abbreviated,
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
            const context = compileBookSubsectionSource(selected);
            if (context.text.replace(/\s/g, "").length < 40)
              throw new Error(`Subsection “${sub.title}” has insufficient readable content. Please check the PDF text.`);
            planned.push({
              id: priorId(chapter.title, sub.start, sub.end), unit_title: chapter.title,
              title: sub.title, skill_goal: sub.skill_goal || sub.title, exercise_ref: sub.exercise_ref || "",
              start: sub.start, end: sub.end, text: context.text,
              source_abbreviated: context.abbreviated, page_texts: selected, include: true,
            });
          }
        }
      }
      if (preserved) toast.message(`${preserved} chapters with published lessons kept their existing subsection structure to protect family purchases.`);
      setScan(planned);

      toast.success(`Identified ${chapters.length} chapters and ${planned.length} lesson subsections.`);
    } catch (e) { toast.error(e?.response ? apiErrorMessage(e, "Automatic chapter analysis failed") : e.message || "Could not analyse the PDF.", { duration: 11000 }); }
    finally { setScanProgress(""); setBusy(""); }
  };
  const saveScan = async () => {
    const chosen = scan.filter((c) => c.include).map(({ include, page_texts, ...c }) => c);
    if (!chosen.length) { toast.error("Tick at least one session."); return; }
    const tooLarge = chosen.find((c) => c.text.length > 8000);
    if (tooLarge) { toast.error(`“${tooLarge.title}” exceeded the source limit. Please re-analyse that chapter.`); return; }
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
  const draft = async (ch, quiet = false) => {
    setBusy(ch.id);
    try {
      await api.post(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters/${encodeURIComponent(ch.id)}/draft`, {}, { timeout: 10 * 60 * 1000 });
      clearFailure(ch.id);
      if (!quiet) toast.success(`Lesson drafted for “${ch.title}”. Review it before publishing.`);
      await load();
      return { ok: true };
    } catch (e) {
      const error = apiErrorMessage(e, "The lesson couldn't be drafted");
      recordFailure(ch, error);
      if (!quiet) toast.error(`${ch.title}: ${error}`, { duration: 9000 });
      return { ok: false, error };
    } finally { setBusy(""); }
  };
  const runBatch = async (chapters, label) => {
    if (batchRunning.current || !chapters.length) return;
    batchRunning.current = true;
    stopDraftQueue.current = false;
    setBatchSummary(null);
    try {
      const result = await runBookDraftQueue(chapters, (ch) => draft(ch, true), {
        shouldStop: () => stopDraftQueue.current,
        onProgress: setBatchProgress,
      });
      setBatchSummary({ ...result, label });
      const details = `${result.completed} succeeded, ${result.failed.length} failed${result.stopped ? ", stopped early" : ""}.`;
      if (result.failed.length) toast.warning(`${label}: ${details} Failed lessons are listed below for retry.`, { duration: 10000 });
      else toast.success(`${label}: ${details}`);
    } finally {
      batchRunning.current = false;
      stopDraftQueue.current = false;
      setBatchProgress(null);
      await load();
    }
  };
  const draftAll = () => runBatch(data.chapters.filter((ch) => !ch.draft), "Make missing lessons");
  const retryFailed = () => runBatch(data.chapters.filter((ch) => failures[ch.id]), "Retry failed lessons");
  const startFresh = async () => {
    setBusy("reset");
    try {
      await api.post(`/quest-books/admin/books/${encodeURIComponent(book.id)}/lessons/reset`,
        { confirm: "REBUILD_FROM_PDF" }, { timeout: 120000 });
      setConfirmReset(false);
      setScan(null);
      setFailures({});
      setBatchSummary(null);
      try { localStorage.removeItem(failureKey); } catch {}
      autoRead.current = false;
      // Setting an empty source plan triggers automatic analysis of the
      // existing uploaded PDF; the owner does not need to upload it again.
      setData({ chapters: [], published_count: 0, draft_count: 0 });
      onChanged?.();
      toast.success("Previous AI lesson drafts archived. Rebuilding chapter and subsection plan from your uploaded PDF.");
    } catch (e) {
      toast.error(apiErrorMessage(e, "Could not reset the book lessons safely"), { duration: 10000 });
    } finally { setBusy(""); }
  };
  const remakeAll = () => runBatch(data.chapters, "Remake lessons");
  const setReviewed = async (chapter, approved) => {
    if (!chapter.draft) return;
    setBusy(`review:${chapter.id}`);
    try {
      await api.post(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters/${encodeURIComponent(chapter.id)}/review`,
        { lesson_id: chapter.draft.lesson_id, approved, complete_review: approved, expected_version: Number(chapter.draft.version) });
      const response = await api.get(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters`, { params: { _: Date.now() } });
      const saved = response.data?.chapters?.find((item) => item.id === chapter.id)?.draft;
      if (!saved || saved.reviewed !== approved || saved.lesson_id !== chapter.draft.lesson_id ||
          (approved && (saved.status !== "ready" || !saved.saved_to_plan || Number(saved.version) !== Number(chapter.draft.version)))) {
        throw new Error("The book's saved review status could not be verified. Reload the review queue.");
      }
      setData(response.data);
      toast.success(approved ? "Lesson saved to Book Plan and marked Reviewed" : "Book lesson returned to review queue");
    } catch (e) {
      toast.error(apiErrorMessage(e, "Could not save the review"), { duration: 9000 });
    } finally { setBusy(""); }
  };
  const markNeedsRepair = async (chapter) => {
    if (!chapter.draft || !!busy || batchProgress) return;
    const note = window.prompt("What needs correcting in this lesson? (optional, but helps the AI find the mistake)", "");
    if (note === null) return;
    setBusy(`repair-mark:${chapter.id}`);
    try {
      await api.post(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters/${encodeURIComponent(chapter.id)}/review`,
        { lesson_id: chapter.draft.lesson_id, approved: false, needs_repair: true,
          repair_note: note.trim(), expected_version: Number(chapter.draft.version) });
      const response = await api.get(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters`, { params: { _: Date.now() } });
      const saved = response.data?.chapters?.find((ch) => ch.id === chapter.id)?.draft;
      if (saved?.reviewed || !saved?.repair_requested || saved?.status !== "draft" ||
          saved?.lesson_id !== chapter.draft.lesson_id)
        throw new Error("The lesson was not confirmed in the Needs Repair queue. Reload the book.");
      setData(response.data);
      toast.success("Returned to Needs Repair. Your original lesson and changes are safe.");
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not return this lesson to Needs Repair"), { duration: 9000 });
    } finally { setBusy(""); }
  };
  const approveAiCleared = async () => {
    const candidates = data.chapters.filter((chapter) => chapter.draft?.ai_cleared && !chapter.draft?.reviewed && !chapter.draft?.stale);
    if (!candidates.length || busy || batchProgress) return;
    if (!window.confirm(
      `Approve ${candidates.length} AI-cleared book lessons without opening them one by one? Side-Quest will independently check the saved content again, reject lessons with AI warnings, missing content or changed workbook sources, and record your acceptance. AI checks cannot guarantee factual accuracy. NOTHING will be published automatically. Continue?`
    )) return;
    setBusy("approve-clean");
    setFastReviewSummary(null);
    setApprovalFailures([]);
    try {
      const response = await api.post(`/quest-books/admin/books/${encodeURIComponent(book.id)}/lessons/approve-ai-cleared`,
        { confirm: "APPROVE_AI_CLEARED" }, { timeout: 120000 });
      const result = response.data;
      const check = await api.get(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters`, { params: { _: Date.now() } });
      setData(check.data);
      const errors = (result.skipped || []).map((entry) => ({ id: entry.id, title: entry.title, reason: entry.reason }));
      for (const entry of result.approved || []) {
        const saved = check.data?.chapters?.find((chapter) => chapter.id === entry.id)?.draft;
        if (!saved?.reviewed || !saved?.saved_to_plan || saved.status !== "ready" || saved.lesson_id !== entry.lesson_id)
          errors.push({ id: entry.id, title: entry.title, reason: "Review approval could not be verified. Reload and check this lesson." });
      }
      setApprovalFailures(errors);
      const confirmed = (result.approved || []).length - errors.filter((e) => (result.approved || []).some((a) => a.id === e.id)).length;
      setFastReviewSummary({ confirmed, skipped: errors.length });
      if (errors.length) toast.warning(`${confirmed} AI-cleared lessons approved; ${errors.length} need attention. See details below.`, { duration: 10000 });
      else toast.success(`${confirmed} AI-cleared lessons approved and linked to the Book Plan. Publishing is still up to you.`);
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not approve AI-cleared lessons"), { duration: 9000 });
    } finally { setBusy(""); }
  };
  const approveAlreadyChecked = async () => {
    const candidates = data.chapters.filter((ch) => ch.draft && !ch.draft.reviewed && !ch.draft.stale && !ch.draft.repair_requested);
    if (!candidates.length || busy || batchProgress) return;
    if (!window.confirm(
      `You are confirming that you have PERSONALLY CHECKED all ${candidates.length} remaining saved lessons, including their explanations, activities and answers. Side-Quest will mark complete lessons Ready and Reviewed. Any incomplete lessons will be reported for correction. This does NOT publish anything. Continue?`
    )) return;
    setBusy("approve-all");
    setApprovalFailures([]);
    const problems = [];
    let approved = 0;
    setApprovalProgress({ done: 0, total: candidates.length, approved: 0, failed: 0 });
    try {
      for (const chapter of candidates) {
        try {
          await api.post(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters/${encodeURIComponent(chapter.id)}/review`, {
            lesson_id: chapter.draft.lesson_id, approved: true, complete_review: true,
            expected_version: Number(chapter.draft.version),
          });
          approved++;
        } catch (error) {
          problems.push({ id: chapter.id, title: chapter.title,
            reason: apiErrorMessage(error, "Approval failed; open this lesson to check it") });
        }
        setApprovalProgress({ done: approved + problems.length, total: candidates.length, approved, failed: problems.length });
      }
      const response = await api.get(`/quest-books/admin/books/${encodeURIComponent(book.id)}/chapters`, { params: { _: Date.now() } });
      setData(response.data);
      // A successful POST must also be reflected in the actual saved book plan.
      for (const chapter of candidates) {
        if (problems.some((p) => p.id === chapter.id)) continue;
        const current = response.data?.chapters?.find((c) => c.id === chapter.id)?.draft;
        if (!current?.reviewed || !current.saved_to_plan || current.status !== "ready" ||
            current.lesson_id !== chapter.draft.lesson_id || Number(current.version) !== Number(chapter.draft.version)) {
          problems.push({ id: chapter.id, title: chapter.title, reason: "The database did not confirm this review. Reopen the lesson." });
        }
      }
      setApprovalFailures(problems);
      const confirmed = candidates.length - problems.length;
      if (problems.length) toast.warning(`${confirmed} of ${candidates.length} reviews confirmed. Check the remaining issues below.`, { duration: 10000 });
      else toast.success(`All ${confirmed} saved lessons are now marked Ready & Reviewed. You can publish them when ready.`);
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not verify the review results. Reload your book workspace."), { duration: 9000 });
    } finally {
      setBusy("");
      setApprovalProgress(null);
    }
  };
  const publish = async () => {
    const drafts = data.chapters.filter((c) => c.draft);
    if (drafts.some((c) => c.draft.stale)) { toast.error("One or more lessons have changed workbook sources. Regenerate those sessions before publishing."); return; }
    if (drafts.some((c) => c.draft.status !== "ready")) { toast.error("Review each lesson and mark it Ready before publishing."); return; }
    if (drafts.some((c) => !c.draft.reviewed)) { toast.error("Save the review approval for every lesson before publishing."); return; }
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
        <p className="text-sm text-emerald-950"><b>Automatic skill-based plan:</b> {groups.length} chapters, {scan.length} teachable subsections. <b>PDF pages are not individual lessons.</b> Related examples and workbook exercises remain together. You can optionally correct a title or learning goal.</p>
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
                    {c.source_abbreviated && <p className="text-xs text-amber-800">Several pages share this lesson. The AI receives balanced labelled excerpts from all pages, rather than a whole lesson per PDF page.</p>}
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
  const reviewed = data.chapters.filter((c) => c.draft?.reviewed && !c.draft?.stale).length;
  const aiCleared = data.chapters.filter((c) => c.draft?.ai_cleared && !c.draft?.reviewed && !c.draft?.stale).length;
  const needsAttention = data.chapters.filter((c) => c.draft && !c.draft.reviewed && !c.draft.ai_cleared).length;
  const ready = data.chapters.filter((c) => c.draft?.status === "ready" && !c.draft?.stale).length;
  const total = data.chapters.length;
  const outstanding = outstandingBookChapters(data.chapters);
  const outstandingPreview = outstanding.slice(0, 6);
  const nextOutstandingDraft = outstanding.find((ch) => !!ch.draft);
  const reviewUrl = (ch) => `/parent/lessons/${ch.draft.lesson_id}/review?book=${encodeURIComponent(book.id)}&chapter=${encodeURIComponent(ch.id)}`;
  const focusOutstandingList = () => {
    setReviewSearch("");
    setReviewFilter("pending");
    reviewListRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  };
  const failedEntries = data.chapters.filter((ch) => !!failures[ch.id]);
  const visible = data.chapters.filter((c) => {
    const matches = !reviewSearch.trim() || [c.title, c.unit_title, c.skill_goal, c.draft?.title].some((value) => String(value || "").toLowerCase().includes(reviewSearch.trim().toLowerCase()));
    if (!matches) return false;
    if (reviewFilter === "pending") return !c.draft?.reviewed || c.draft?.stale;
    if (reviewFilter === "ai-cleared") return !!c.draft?.ai_cleared && !c.draft?.reviewed;
    if (reviewFilter === "attention") return !!c.draft && !c.draft.reviewed && !c.draft.ai_cleared;
    if (reviewFilter === "reviewed") return c.draft?.reviewed && !c.draft?.stale;
    if (reviewFilter === "published") return !!c.published;
    return true;
  });
  return (
    <div className="rounded-xl border border-emerald-300 bg-white p-4 space-y-3" data-testid="quest-lessons-admin">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 mr-auto"><BookOpenCheck size={16} /> Book companion lessons</h4>
        {book.has_book && <button type="button" onClick={readUploaded} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400 bg-white px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-50">
          {busy === "scan" ? <Loader2 size={15} className="animate-spin" /> : <FileSearch size={15} />} {busy === "scan" ? "Analysing the book…" : data.chapters.length ? "Re-analyse chapter structure" : "Analyse chapters and subsections"}
        </button>}
        {!book.has_book && pdfPicker("Read chapters from a PDF")}
        {book.has_book && (data?.chapters?.length > 0 || data?.published_count > 0) &&
          <button type="button" onClick={() => setConfirmReset(true)} disabled={!!busy || !!batchProgress}
            className="rounded-lg border border-amber-500 px-3 py-2 text-sm font-bold text-amber-900 hover:bg-amber-50 disabled:opacity-50">
            Start fresh from this PDF
          </button>}
      </div>
      {confirmReset && <div className="rounded-lg border border-amber-400 bg-amber-50 p-3 space-y-2 text-sm">
        <p className="font-bold text-amber-950">Rebuild this book's lesson collection?</p>
        <p>This archives your existing AI-generated draft lessons and clears this book's published lesson list and subsection plan. Your uploaded PDF, cover, preview, book details and prices stay intact. The PDF will be analysed again automatically. The server will refuse if it finds purchases or copies belonging to other families.</p>
        <div className="flex gap-2">
          <button type="button" disabled={!!busy} onClick={startFresh} className="rounded-lg bg-amber-800 px-3 py-2 text-white font-bold">Yes, rebuild the lesson plan</button>
          <button type="button" disabled={!!busy} onClick={() => setConfirmReset(false)} className="rounded-lg border border-stone-300 px-3 py-2 font-semibold">Cancel</button>
        </div>
      </div>}
      {scanProgress && <p className="text-sm font-semibold text-violet-900" role="status">{scanProgress}</p>}
      {!data.chapters.length ? (
        <p className="text-sm text-stone-600">{book.has_book ? "Side-Quest automatically identifies chapters and their teachable subsections, with learning goals and workbook page references. You only decide which lessons to generate." : "Upload the Book PDF first, then its sessions can be read here."}</p>
      ) : <>
        <p className="text-sm text-stone-600">These are <b>official book companion lessons</b>, not private family lessons. Once you've checked a lesson, tick <b>Reviewed and saved</b> to mark its saved version Ready and approved in one action. You can also confirm all previously checked lessons below. Editing after approval returns that version to review. Publishing is a separate step.</p>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 space-y-2" data-testid="book-readiness">
          <div className="flex flex-wrap justify-between gap-2 text-sm text-emerald-950">
            <b>Book readiness: {reviewed} of {total} lessons approved</b>
            <span>{total ? Math.round(100 * reviewed / total) : 0}% ready · {drafted} drafted · {ready} saved Ready · {data.published_count} published</span>
          </div>
          <div className="h-2.5 rounded-full bg-emerald-100 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={reviewed} aria-label="Lessons reviewed for this book">
            <div className="h-full bg-emerald-700 transition-all" style={{ width: `${total ? 100 * reviewed / total : 0}%` }} />
          </div>
          <p className="text-xs text-emerald-900">{reviewed === total && total ? "Every planned lesson has been reviewed. Publishing still requires your approval." : `${total - reviewed} companion lesson${total - reviewed === 1 ? "" : "s"} still need${total - reviewed === 1 ? "s" : ""} review.`}</p>
        </div>
        {outstanding.length > 0 && <section className="rounded-xl border border-amber-300 bg-amber-50 p-3 space-y-3" data-testid="quest-outstanding-lessons">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-amber-950">{outstanding.length} lesson{outstanding.length === 1 ? "" : "s"} still need{outstanding.length === 1 ? "s" : ""} attention</p>
              <p className="text-xs text-amber-900">Open them directly here. No searching through your approved lessons.</p>
            </div>
            {nextOutstandingDraft && <Link to={reviewUrl(nextOutstandingDraft)}
              className="rounded-lg bg-amber-900 px-3 py-2 text-xs font-bold text-white"
              data-testid="quest-review-next-outstanding">Review next unfinished lesson</Link>}
          </div>
          <ol className="space-y-2" data-testid="quest-outstanding-items">
            {outstandingPreview.map((ch) => <li key={ch.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-white p-2.5">
              <div className="min-w-[200px] flex-1">
                <p className="text-sm font-semibold text-stone-900">{ch.unit_title && ch.unit_title !== ch.title ? `${ch.unit_title} · ` : ""}{ch.title}</p>
                <p className="text-xs text-amber-900">{outstandingBookReason(ch)}</p>
              </div>
              {ch.draft ? <Link to={reviewUrl(ch)}
                className="shrink-0 rounded-lg border border-amber-600 px-3 py-1.5 text-xs font-bold text-amber-950 hover:bg-amber-100"
                data-testid={`quest-review-outstanding-${ch.id}`}>Open &amp; review</Link>
                : <button type="button" disabled={!!busy || !!batchProgress} onClick={() => draft(ch)}
                  className="shrink-0 rounded-lg border border-amber-600 px-3 py-1.5 text-xs font-bold text-amber-950 disabled:opacity-50"
                  data-testid={`quest-make-outstanding-${ch.id}`}>Make lesson</button>}
            </li>)}
          </ol>
          {outstanding.length > outstandingPreview.length && <button type="button" onClick={focusOutstandingList}
            className="text-xs font-bold text-amber-950 underline"
            data-testid="quest-view-all-outstanding">Show all {outstanding.length} unfinished lessons in the list</button>}
        </section>}
        {aiCleared > 0 && drafted > reviewed && <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 space-y-2" data-testid="quest-approve-ai-cleared">
          <p className="text-sm font-bold text-emerald-950">Quick approval: no need to open every clean lesson</p>
          <p className="text-xs text-emerald-900">
            <b>{aiCleared} AI-cleared</b> and eligible for fast approval · <b>{needsAttention} need attention</b> · {total - drafted} not drafted.
            Only lessons with zero saved AI warnings, complete teaching and current workbook sources qualify.
          </p>
          <button type="button" disabled={!!busy || !!batchProgress || aiCleared === 0} onClick={approveAiCleared}
            className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            data-testid="quest-fast-approve">
            {busy === "approve-clean" ? "Approving AI-cleared lessons…" : `Approve all ${aiCleared} AI-cleared lesson${aiCleared === 1 ? "" : "s"}`}
          </button>
          {fastReviewSummary && <p role="status" className="text-xs font-semibold text-emerald-950">
            {fastReviewSummary.confirmed} approved and verified · {fastReviewSummary.skipped} flagged or needing attention
          </p>}
          <p className="text-xs text-emerald-900">This records your acceptance of the AI-cleared lessons. AI checks are not a guarantee of accuracy, and publishing remains a separate action.</p>
        </div>}
        {data.chapters.some((ch) => ch.draft && !ch.draft.reviewed && !ch.draft.stale && !ch.draft.repair_requested) && <div className="rounded-xl border border-emerald-300 bg-white p-3 space-y-2" data-testid="quest-confirm-reviewed">
          <p className="text-sm font-semibold text-emerald-950">Already checked the lessons? You don't have to open and re-save each one.</p>
          <p className="text-xs text-stone-600">Only use this after personally checking the teaching and answer keys. Complete lessons will be marked Ready and Reviewed; incomplete lessons stay unapproved and you'll see why. Nothing will publish automatically.</p>
          <button type="button" disabled={!!busy || !!batchProgress} onClick={approveAlreadyChecked}
            className="rounded-lg bg-emerald-800 text-white px-4 py-2 text-sm font-bold disabled:opacity-50"
            data-testid="quest-approve-checked">Confirm review of {data.chapters.filter((ch) => ch.draft && !ch.draft.reviewed && !ch.draft.stale && !ch.draft.repair_requested).length} saved lesson(s)</button>
          {approvalProgress && <p role="status" className="text-xs text-emerald-900">
            Checking {approvalProgress.done} of {approvalProgress.total} · {approvalProgress.approved} approved · {approvalProgress.failed} need attention
          </p>}
        </div>}
        {approvalFailures.length > 0 && <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 space-y-2" data-testid="quest-approval-errors">
          <b className="text-sm text-amber-950">{approvalFailures.length} lesson(s) need attention before approval</b>
          <ul className="list-disc pl-5 space-y-1 text-xs text-amber-900">{approvalFailures.map((failure) =>
            <li key={failure.id}><b>{failure.title}:</b> {failure.reason}</li>)}</ul>
        </div>}
        {batchSummary && <p className="text-sm font-semibold text-emerald-950" data-testid="quest-draft-batch-summary">
          {batchSummary.label}: {batchSummary.completed} made, {batchSummary.failed.length} failed{batchSummary.stopped ? ", stopped after the last completed request" : ""}.
        </p>}
        {failedEntries.length > 0 && <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 space-y-2" data-testid="quest-draft-failures">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <p className="text-sm font-bold text-amber-950">{failedEntries.length} lesson{failedEntries.length === 1 ? "" : "s"} need a retry</p>
            <button type="button" disabled={!!busy || !!batchProgress} onClick={retryFailed}
              className="rounded-lg bg-amber-800 text-white px-3 py-1.5 text-xs font-bold disabled:opacity-50">Retry failed lessons</button>
          </div>
          <p className="text-xs text-amber-900">Other lessons will keep drafting even when one fails. Each failed lesson can be retried without remaking the successful ones.</p>
          <ul className="space-y-1.5">
            {failedEntries.map((ch) => <li key={ch.id} className="flex gap-2 items-start justify-between text-xs text-amber-950">
              <span><b>{ch.title}</b>: {failures[ch.id]}{ch.draft ? " (Previous saved draft retained.)" : ""}</span>
              <button type="button" disabled={!!busy || !!batchProgress} onClick={() => draft(ch)}
                className="shrink-0 underline font-bold disabled:opacity-50">Retry</button>
            </li>)}
          </ul>
        </div>}
        <div ref={reviewListRef} className="flex gap-2 flex-wrap items-center scroll-mt-28">
          <input aria-label="Search book lessons" placeholder="Search chapter or lesson…" value={reviewSearch} onChange={(e) => setReviewSearch(e.target.value)} className="flex-1 min-w-[170px] rounded-lg border border-stone-300 px-3 py-2 text-sm" />
          <select aria-label="Filter book lessons" value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
            <option value="all">All lessons</option><option value="ai-cleared">AI-cleared</option><option value="attention">Needs attention</option><option value="pending">Needs review</option><option value="reviewed">Reviewed</option><option value="published">Published</option>
          </select>
        </div>
        {!visible.length && <p className="text-sm text-stone-600">No lessons match this filter.</p>}
        <ul className="divide-y divide-stone-100">
          {visible.map((c, i) => (
            <li key={c.id} className="flex flex-wrap items-center gap-2 py-2">
              <span className="flex-1 min-w-[160px] text-sm"><span className="text-xs font-semibold text-emerald-800">{i === 0 || (visible[i-1].unit_title || visible[i-1].title) !== (c.unit_title || c.title) ? `Chapter: ${c.unit_title || c.title} · ` : ""}</span><b>{c.title}</b> <span className="text-xs text-stone-500">· PDF pp. {c.start}–{c.end} · {c.skill_goal || "Learning goal not set"}</span>{c.published && <span className="ml-2 text-[10px] font-bold uppercase text-emerald-700">Published</span>}{c.draft?.stale && <span className="ml-2 text-[10px] font-bold uppercase text-rose-700">Source changed — regenerate</span>}
                {c.draft && !c.draft.stale && <span className={`ml-2 text-[10px] font-bold uppercase ${c.draft.saved_to_plan ? "text-emerald-700" : "text-amber-700"}`}>
                  {c.draft.saved_to_plan ? "Saved to book plan" : "Needs book-plan save"}
                </span>}</span>
              {c.draft?.ai_cleared && !c.draft.reviewed && (
                <span className="text-xs font-bold text-emerald-800">AI-cleared · Fast approval available</span>
              )}
              {c.draft?.ai_warning_count > 0 && !c.draft.reviewed && (
                <span className="text-xs font-bold text-amber-800">AI flagged {c.draft.ai_warning_count} warning(s) · Review required</span>
              )}
              {c.draft?.repair_requested && !c.draft.reviewed && (
                <span className="w-full rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs text-amber-950" data-testid={`quest-repair-requested-${c.id}`}>
                  <b>Needs Repair (marked by you):</b> {c.draft.repair_note || "Check this lesson again."}
                </span>
              )}
              {c.draft?.quality_issues?.length > 0 && !c.draft.reviewed && (
                <span className="w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-950" data-testid={`quest-quality-${c.id}`}>
                  <b>Needs content:</b> {c.draft.quality_issues.join("; ")}.
                  {" "}Open Review to inspect the targeted repair option.
                </span>
              )}
              {c.draft && <Link to={`/parent/lessons/${c.draft.lesson_id}/review?book=${encodeURIComponent(book.id)}&chapter=${encodeURIComponent(c.id)}`} className="text-sm font-semibold text-emerald-900 underline">{c.draft.reviewed ? "Reopen" : "Review"} “{c.draft.title}”</Link>}
              {c.draft?.reviewed && <button type="button" disabled={!!busy || !!batchProgress}
                onClick={() => markNeedsRepair(c)} className="rounded-lg border border-amber-500 px-2.5 py-1.5 text-xs font-bold text-amber-950 disabled:opacity-50"
                data-testid={`quest-mark-repair-${c.id}`}>Mark Needs Repair</button>}
              {c.draft && <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-950">
                <input type="checkbox" disabled={c.draft.stale || !!busy || !!batchProgress} checked={!!c.draft.reviewed} onChange={(e) => setReviewed(c, e.target.checked)} aria-label={`Approve ${c.title} for book publication`} />
                Reviewed and saved{c.draft.reviewed_at && c.draft.reviewed ? ` · ${new Date(c.draft.reviewed_at).toLocaleDateString()}` : ""}
              </label>}
              <button type="button" disabled={!!busy || !!batchProgress} onClick={() => draft(c)} className="inline-flex items-center gap-1 rounded-lg border border-violet-300 px-3 py-1.5 text-xs font-bold text-violet-900 hover:bg-violet-50 disabled:opacity-50">
                {busy === c.id ? <><Loader2 size={13} className="animate-spin" /> Writing (1–3 min)…</> : <><Sparkles size={13} /> {c.draft ? "Remake" : "Make lesson"}</>}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 items-center">
          {drafted < data.chapters.length && <button type="button" disabled={!!busy || !!batchProgress} onClick={draftAll} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 text-white px-4 py-2 text-sm font-bold disabled:opacity-50"><Sparkles size={15} /> Make all missing lessons ({data.chapters.length - drafted})</button>}
          <button type="button" disabled={!!busy || !drafted || !!batchProgress} onClick={publish} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-900 text-white px-4 py-2 text-sm font-bold disabled:opacity-50">{busy === "publish" ? "Publishing…" : <><Upload size={15} /> Publish {drafted} lesson{drafted === 1 ? "" : "s"} to the book</>}</button>
          {!!drafted && !batchProgress && <button type="button" disabled={!!busy} onClick={remakeAll}
             className="rounded-lg border border-violet-400 px-4 py-2 text-sm font-bold text-violet-900">Remake all lessons ({data.chapters.length})</button>}
          {batchProgress && <div className="flex items-center gap-2 text-sm text-violet-900" role="status" data-testid="quest-draft-batch-progress">
            <Loader2 size={15} className="animate-spin" /> Processing {Math.min(batchProgress.attempted + 1, batchProgress.total)} of {batchProgress.total} · {batchProgress.completed} made · {batchProgress.failed.length} failed
            <button type="button" className="rounded border border-stone-300 px-2 py-1" onClick={() => { stopDraftQueue.current = true; }}>Stop after current lesson</button>
          </div>}
          {data.published_count > 0 && <span className="text-xs text-emerald-800 inline-flex items-center gap-1"><Check size={13} /> {data.published_count} published</span>}
        </div>
        {busy && busy !== "publish" && busy !== "save" && <p className="text-xs text-stone-500">Keep this page open while lessons are being written.</p>}
      </>}
    </div>
  );
}
