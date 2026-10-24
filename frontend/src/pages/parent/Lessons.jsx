import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Search, Copy, Archive, ArchiveRestore, Pencil, Send, X, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { api } from "../../lib/api";
import ScheduleModal from "../../components/parent/ScheduleModal";
import LessonPrintActions from "../../components/parent/LessonPrintActions";

export default function LessonsPage() {
  const nav = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [plan, setPlan] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [query, setQuery] = useState("");
  const [fSubject, setFSubject] = useState("");
  const [fYear, setFYear] = useState("");
  const [sort, setSort] = useState("recent");
  const [fChild, setFChild] = useState("");
  const [assignedTo, setAssignedTo] = useState({});
  const [assignOpen, setAssignOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () =>
    api.get(`/lessons${showArchived ? "?archived=1" : ""}`)
      .then(r => { setLessons(r.data); setError(""); })
      .catch(() => setError("Could not load your lessons. Please refresh."))
      .finally(() => setLoading(false));

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [showArchived]);
  useEffect(() => {
    api.get("/students").then(r => setStudents(r.data)).catch(() => {});
    api.get("/account/plan").then(r => setPlan(r.data)).catch(() => {});
    api.get("/ai/status").then(r => setAiStatus(r.data)).catch(() => {});
  }, []);
  // Who has each lesson comes with the library itself (one entry per child).
  useEffect(() => {
    const m = {};
    lessons.forEach(l => (l.assigned_to || []).forEach(a => { (m[a.student_id] = m[a.student_id] || new Set()).add(l.id); }));
    setAssignedTo(m);
  }, [lessons]);

  const act = async (fn, okMsg) => {
    try { await fn(); if (okMsg) toast.success(okMsg); load(); api.get("/account/plan").then(r => setPlan(r.data)).catch(() => {}); }
    catch (err) { toast.error(err.response?.data?.detail || "Something went wrong"); }
  };

  // Where each lesson is in its life: drafts to review, ready but unused, with a child now, or done by everyone it was given to.
  const stageOf = l => l.status !== "ready" ? "review"
    : !(l.assigned_to || []).length ? "ready"
    : l.assigned_to.some(a => !a.done) ? "in_use" : "finished";
  const counts = lessons.reduce((m, l) => { m[stageOf(l)]++; return m; }, { review: 0, ready: 0, in_use: 0, finished: 0 });
  // Open on the lessons a parent can use straight away; if there are none yet but drafts are waiting, open on those.
  const [tab, setTab] = useState("");
  const current = tab || (!counts.ready && counts.review ? "review" : "ready");

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const shown = lessons.filter(l => {
    const t = [l.title, l.learning_area, ...(l.additional_learning_areas || []), l.year_level, ...(l.objectives || [])].join(" ").toLowerCase();
    if (!showArchived && current !== "all" && stageOf(l) !== current) return false;
    if (fSubject && l.learning_area !== fSubject && !(l.additional_learning_areas || []).includes(fSubject)) return false;
    if (fYear && l.year_level !== fYear) return false;
    if (fChild && !(assignedTo[fChild] && assignedTo[fChild].has(l.id))) return false;
    return terms.every(w => t.includes(w));
  });
  // The library arrives most recently updated first.
  if (sort === "title") shown.sort((a, b) => String(a.title).localeCompare(String(b.title)));
  if (sort === "subject") shown.sort((a, b) => String(a.learning_area || "~").localeCompare(String(b.learning_area || "~")) || String(a.title).localeCompare(String(b.title)));
  const subjects = [...new Set(lessons.flatMap(l => [l.learning_area, ...(l.additional_learning_areas || [])]).filter(Boolean))].sort();
  const years = [...new Set(lessons.map(l => l.year_level).filter(Boolean))].sort();
  const sel = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";
  const TABS = [["review", "Needs review"], ["ready", "Ready to use"], ["in_use", "In use"], ["finished", "Finished"], ["all", "All"]];
  const EMPTY = {
    review: "No drafts waiting. Lessons you or Side-Quest draft appear here until you've read them.",
    ready: "Every saved lesson has been given to a child. Make a new one, or reuse a finished lesson.",
    in_use: "No child is working on any of these lessons right now.",
    finished: "Lessons appear here once every child they were given to has finished them.",
  };
  const small = "relative z-10 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1";
  const menuItem = "w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-stone-50 flex items-center gap-2";

  const duplicate = l => act(async () => { const r = await api.post(`/lessons/${l.id}/duplicate`); nav(`/parent/lessons/${r.data.id}/edit`); }, "Copied. You are editing the copy.");
  const archive = l => window.confirm("Archive this lesson? It moves out of your library. Work already done is kept.") && act(() => api.post(`/lessons/${l.id}/archive`), "Archived");
  const remove = l => {
    if (!window.confirm("Remove this lesson? If no child has ever been assigned it, the lesson will be permanently deleted. If it has been assigned, the lesson will be removed from your current library but the child's work and learning records will be preserved.")) return;
    act(async () => {
      const { data } = await api.delete(`/lessons/${l.id}`);
      toast.success(data.deleted ? "Lesson permanently deleted." : "Lesson removed from your library. Child learning records have been kept.");
    });
  };

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6" data-testid="lessons-page">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 data-tour="tour-lessons" className="font-display text-3xl font-bold text-slate-900">My lessons</h1>
          <p className="text-sm text-slate-600 mt-1">Lessons your family creates and saves live here. Build one yourself or ask AI for a draft to review, then assign it to a child.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/parent/lessons/make" className="rounded-full bg-violet-700 text-white px-5 py-2.5 text-sm font-semibold flex items-center gap-1" data-testid="new-lesson-ai"><Plus size={16} /> Make a lesson for me</Link>
          <Link to="/parent/lessons/new" className="rounded-full border border-slate-900 bg-white px-5 py-2.5 text-sm font-semibold" data-testid="new-lesson">I'll build it myself</Link>
          <Link to="/parent/lessons/drafts" className="rounded-full border border-violet-300 bg-violet-50 px-5 py-2.5 text-sm font-semibold text-violet-900" data-testid="lesson-drafts-link">AI lesson sets</Link>
        </div>
      </div>

      {plan && plan.effective_plan === "FREE_PREVIEW" && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700" data-testid="preview-banner">
          Your seven-day preview ends {new Date(plan.trial_ends_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}. You’ve used {plan.usage.manual_lessons ?? plan.usage.lessons} of {plan.limits.maxLessons} manually created lessons, {plan.usage.children} of {plan.limits.maxChildren} child profiles, {plan.usage.activeAssignments} of {plan.limits.maxActiveAssignments} active assignments. Your <strong>one AI-created lesson per family</strong> is separate from your manual allowance. <Link to="/parent/plan" className="underline font-bold">See plans</Link>
        </div>
      )}

      {plan?.effective_plan === "FREE_PREVIEW" && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-4 text-sm text-violet-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3" data-testid="lesson-library-free-ai">
          <div>
            <p className="font-bold">🐉 Your family gets one complete AI lesson to try!</p>
            <p className="mt-1">{aiStatus?.usage?.preview?.in_progress
              ? "Your AI lesson is being written. Check back shortly."
              : aiStatus?.usage?.preview?.remaining === 0
                ? "Your one-time AI sample has been used. Membership unlocks more."
                : "Use your free sample during the seven-day preview, alongside two lessons you build yourself."}</p>
          </div>
          <Link to="/parent/lessons/make" className="shrink-0 inline-flex justify-center rounded-full bg-violet-700 px-4 py-2 text-sm font-bold text-white">
            {aiStatus?.usage?.preview?.remaining > 0 ? "Create my free AI lesson" : "Open AI lesson builder"}
          </Link>
        </div>
      )}
      {plan && plan.effective_plan === "PREVIEW_EXPIRED" && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900" data-testid="expired-banner">
          Your free preview has ended. Your lessons and your children's progress are all kept. A Family Membership will be needed to create and assign lessons. <Link to="/parent/plan" className="underline font-bold">See plans</Link>
        </div>
      )}

      {!showArchived && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Lessons by stage" data-testid="lib-tabs">
          {TABS.map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={current === k} onClick={() => setTab(k)}
              className={`rounded-full px-4 py-2 text-sm font-semibold border ${current === k ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300"}`}
              data-testid={`lib-tab-${k}`}>
              {label}{k !== "all" && <span className={`ml-1.5 rounded-full px-1.5 text-xs ${k === "review" && counts.review && current !== k ? "bg-amber-200 text-amber-900" : current === k ? "bg-white/20" : "bg-slate-100"}`}>{counts[k]}</span>}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xl flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by title, subject or topic…" aria-label="Search lessons"
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:border-slate-500" data-testid="lesson-search" />
          {query && <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X size={14} /></button>}
        </div>
        <select className={sel} value={fSubject} onChange={e => setFSubject(e.target.value)} aria-label="Filter by subject" data-testid="filter-subject"><option value="">All subjects</option>{subjects.map(x => <option key={x}>{x}</option>)}</select>
        <select className={sel} value={fYear} onChange={e => setFYear(e.target.value)} aria-label="Filter by year level" data-testid="filter-year"><option value="">All year levels</option>{years.map(x => <option key={x}>{x}</option>)}</select>
        {students.length > 0 && <select className={sel} value={fChild} onChange={e => setFChild(e.target.value)} aria-label="Filter by child" data-testid="filter-child"><option value="">Any child</option>{students.map(st => <option key={st.id} value={st.id}>Given to {st.name}</option>)}</select>}
        <select className={sel} value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort lessons" data-testid="lib-sort"><option value="recent">Recently changed</option><option value="title">Title A–Z</option><option value="subject">Subject</option></select>
        <button onClick={() => setShowArchived(v => !v)} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold" data-testid="toggle-archived">{showArchived ? "Show current lessons" : "Show archived"}</button>
      </div>

      {error && <div role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</div>}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {shown.map(l => {
          const stage = stageOf(l);
          return (
          <div key={l.id} className="relative rounded-2xl border border-slate-200 bg-white p-5 flex flex-col hover:border-slate-400 transition-colors" data-testid={`lesson-${l.id}`}>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              {[l.learning_area, l.year_level, l.duration_minutes && `${l.duration_minutes} min`].filter(Boolean).join(" · ") || "No subject yet"}
              {stage === "review" && <span className="ml-2 rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 normal-case tracking-normal text-amber-900">{l.ai_generated ? "AI draft" : "Draft"}</span>}
              {!!l.additional_learning_areas?.length && <span className="block mt-1 normal-case tracking-normal text-violet-700" data-testid={`lesson-related-${l.id}`}>Also useful for: {l.additional_learning_areas.join(", ")}</span>}
            </div>
            {/* The whole card opens the lesson; buttons sit above that link. */}
            <h3 className="font-display text-lg font-semibold text-slate-900 mt-1 leading-tight">
              <Link to={`/parent/lessons/${l.id}/review`} className="after:absolute after:inset-0 after:rounded-2xl focus:outline-none focus-visible:underline" data-testid={`open-${l.id}`}>{l.title}</Link>
            </h3>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{(l.objectives || [])[0] || ""}</p>
            {(l.assigned_to || []).length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1 text-xs text-slate-600" data-testid={`assigned-to-${l.id}`}>
                {l.assigned_to.map(a => (
                  <span key={a.student_id} className={`rounded-full border px-2 py-0.5 ${a.done ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"}`} data-testid={`assignee-${l.id}-${a.student_id}`}>
                    {a.student_name} · {a.done ? "finished" : a.status === "not_started" ? "not started" : a.status === "submitted" ? "waiting for review" : "in progress"}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-auto pt-4 flex items-center gap-2">
              {showArchived ? <>
                <button onClick={() => act(() => api.post(`/lessons/${l.id}/restore`), "Restored")} className={small}><ArchiveRestore size={12} /> Restore</button>
                <button type="button" onClick={() => remove(l)} className={`${small} border-rose-300 text-rose-700`} data-testid={`delete-${l.id}`} aria-label={`Delete ${l.title}`}><Trash2 size={12} /> Delete</button>
              </> : <>
                {stage === "review"
                  ? <Link to={`/parent/lessons/${l.id}/review`} className="relative z-10 rounded-lg bg-amber-600 text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`review-${l.id}`}><Eye size={12} /> Review</Link>
                  : <button onClick={() => setAssignOpen(l)} className="relative z-10 rounded-lg bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`assign-${l.id}`}><Send size={12} /> {stage === "ready" ? "Assign" : "Assign again"}</button>}
                <Link to={`/parent/lessons/${l.id}/edit`} className={small} data-testid={`edit-${l.id}`}><Pencil size={12} /> Edit</Link>
                <details className="relative z-20 ml-auto" data-testid={`more-${l.id}`}>
                  <summary className="list-none cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-600" aria-label={`More actions for ${l.title}`}><MoreHorizontal size={14} /></summary>
                  <div className="absolute right-0 bottom-full mb-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-lg space-y-1">
                    <button onClick={() => duplicate(l)} className={menuItem} data-testid={`dup-${l.id}`}><Copy size={14} /> Duplicate</button>
                    <div className="px-1 py-1"><LessonPrintActions lessonId={l.id} compact className="flex-col items-stretch" /></div>
                    <button onClick={() => archive(l)} className={menuItem} data-testid={`archive-${l.id}`}><Archive size={14} /> Archive</button>
                    <button type="button" onClick={() => remove(l)} className={`${menuItem} text-rose-700`} data-testid={`delete-${l.id}`} aria-label={`Delete ${l.title}`}><Trash2 size={14} /> Delete</button>
                  </div>
                </details>
              </>}
            </div>
          </div>
          );
        })}
        {!loading && shown.length === 0 && (
          <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 p-6 sm:p-10 text-center text-sm text-slate-600" data-testid="empty-library">
            {lessons.length && (query || fSubject || fYear || fChild) ? (
              <>
                <p className="font-semibold text-slate-800">No lessons match those filters.</p>
                <p className="mt-1">Try a different search or show all your lessons.</p>
                <button type="button" onClick={() => { setQuery(""); setFSubject(""); setFYear(""); setFChild(""); }} className="mt-4 rounded-full border border-slate-400 bg-white px-4 py-2 text-sm font-semibold">Clear filters</button>
              </>
            ) : lessons.length && !showArchived ? (
              <><p>{EMPTY[current]}</p>{current !== "all" && <button type="button" onClick={() => setTab("all")} className="mt-4 rounded-full border border-slate-400 bg-white px-4 py-2 text-sm font-semibold">Show all lessons</button>}</>
            ) : showArchived ? (
              <><p>Nothing in the archive yet. Lessons you archive will appear here.</p><button type="button" onClick={() => setShowArchived(false)} className="mt-4 rounded-full border border-slate-400 bg-white px-4 py-2 text-sm font-semibold">Show current lessons</button></>
            ) : (
              <>
                <p className="font-semibold text-slate-800">Your lesson collection starts here.</p>
                <p className="mt-1">Create a lesson yourself, or let Side-Quest draft one for you to review.</p>
                <div className="mt-4 flex justify-center flex-wrap gap-2">
                  <Link to="/parent/lessons/new" className="rounded-full border border-slate-500 bg-white px-4 py-2 text-sm font-semibold">Build a lesson</Link>
                  <Link to="/parent/lessons/make" className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white">Try the AI builder</Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {assignOpen && <ScheduleModal lesson={assignOpen} students={students} onClose={() => setAssignOpen(null)} onDone={() => { load(); api.get("/account/plan").then(r => setPlan(r.data)).catch(() => {}); }} />}
    </div>
  );
}
