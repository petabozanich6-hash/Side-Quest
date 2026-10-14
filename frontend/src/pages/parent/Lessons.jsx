import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Search, Copy, Archive, ArchiveRestore, Pencil, Send, X } from "lucide-react";
import { api } from "../../lib/api";
import ScheduleModal from "../../components/parent/ScheduleModal";

export default function LessonsPage() {
  const nav = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [plan, setPlan] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [query, setQuery] = useState("");
  const [fSubject, setFSubject] = useState("");
  const [fYear, setFYear] = useState("");
  const [fStatus, setFStatus] = useState("");
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
    api.get("/assignments").then(r => {
      const m = {};
      (r.data || []).forEach(a => { (m[a.student_id] = m[a.student_id] || new Set()).add(a.lesson_id); });
      setAssignedTo(m);
    }).catch(() => {});
  }, []);

  const act = async (fn, okMsg) => {
    try { await fn(); if (okMsg) toast.success(okMsg); load(); api.get("/account/plan").then(r => setPlan(r.data)).catch(() => {}); }
    catch (err) { toast.error(err.response?.data?.detail || "Something went wrong"); }
  };

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const shown = lessons.filter(l => {
    const t = [l.title, l.learning_area, l.year_level, ...(l.objectives || [])].join(" ").toLowerCase();
    if (fSubject && l.learning_area !== fSubject) return false;
    if (fYear && l.year_level !== fYear) return false;
    if (fStatus === "draft" && l.status !== "draft") return false;
    if (fStatus === "ready" && l.status !== "ready") return false;
    if (fChild && !(assignedTo[fChild] && assignedTo[fChild].has(l.id))) return false;
    return terms.every(w => t.includes(w));
  });
  const subjects = [...new Set(lessons.map(l => l.learning_area).filter(Boolean))].sort();
  const years = [...new Set(lessons.map(l => l.year_level).filter(Boolean))].sort();
  const sel = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6" data-testid="lessons-page">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">My lessons</h1>
          <p className="text-sm text-slate-600 mt-1">Lessons your family creates and saves live here. Build one yourself or ask AI for a draft to review, then assign it to a child.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/parent/lessons/make" className="rounded-full bg-violet-700 text-white px-5 py-2.5 text-sm font-semibold flex items-center gap-1" data-testid="new-lesson-ai"><Plus size={16} /> Make a lesson for me</Link>
          <Link to="/parent/lessons/new" className="rounded-full border border-slate-900 bg-white px-5 py-2.5 text-sm font-semibold" data-testid="new-lesson">I'll build it myself</Link>
        </div>
      </div>

      {plan && plan.effective_plan === "FREE_PREVIEW" && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700" data-testid="preview-banner">
          Your seven-day preview ends {new Date(plan.trial_ends_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}. You’ve used {plan.usage.lessons} of {plan.limits.maxLessons} lessons, {plan.usage.children} of {plan.limits.maxChildren} child profiles, {plan.usage.activeAssignments} of {plan.limits.maxActiveAssignments} active assignments. <Link to="/parent/plan" className="underline font-bold">See plans</Link>
        </div>
      )}
      {plan && plan.effective_plan === "PREVIEW_EXPIRED" && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900" data-testid="expired-banner">
          Your free preview has ended. Your lessons and your children's progress are all kept. A Family Membership will be needed to create and assign lessons. <Link to="/parent/plan" className="underline font-bold">See plans</Link>
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
        <select className={sel} value={fStatus} onChange={e => setFStatus(e.target.value)} aria-label="Filter by status" data-testid="filter-status"><option value="">Drafts and saved</option><option value="draft">Drafts only</option><option value="ready">Saved (ready) only</option></select>
        {students.length > 0 && <select className={sel} value={fChild} onChange={e => setFChild(e.target.value)} aria-label="Filter by child" data-testid="filter-child"><option value="">Any child</option>{students.map(st => <option key={st.id} value={st.id}>Assigned to {st.name}</option>)}</select>}
        <button onClick={() => setShowArchived(v => !v)} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold" data-testid="toggle-archived">{showArchived ? "Show current lessons" : "Show archived"}</button>
      </div>

      {error && <div role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</div>}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {shown.map(l => (
          <div key={l.id} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col" data-testid={`lesson-${l.id}`}>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              {[l.learning_area, l.year_level].filter(Boolean).join(" · ") || "No subject yet"}
              {l.status === "draft" && <span className="ml-2 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 normal-case tracking-normal text-slate-700">Draft</span>}
              {l.ai_generated && <span className="ml-2 rounded-full bg-violet-100 border border-violet-200 px-2 py-0.5 normal-case tracking-normal text-violet-800">AI draft</span>}
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900 mt-1 leading-tight">{l.title}</h3>
            {l.duration_minutes ? <p className="text-xs text-slate-500 mt-1">{l.duration_minutes} minutes</p> : null}
            <p className="mt-2 text-sm text-slate-600 line-clamp-3">{(l.objectives || [])[0] || ""}</p>
            <div className="mt-auto pt-4 flex items-center gap-2 flex-wrap">
              {!showArchived && <Link to={`/parent/lessons/${l.id}/edit`} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`edit-${l.id}`}><Pencil size={12} /> Edit</Link>}
              {!showArchived && <button onClick={() => act(async () => { const r = await api.post(`/lessons/${l.id}/duplicate`); nav(`/parent/lessons/${r.data.id}/edit`); }, "Copied. You are editing the copy.")} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`dup-${l.id}`}><Copy size={12} /> Duplicate</button>}
              {showArchived
                ? <button onClick={() => act(() => api.post(`/lessons/${l.id}/restore`), "Restored")} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1"><ArchiveRestore size={12} /> Restore</button>
                : <button onClick={() => window.confirm("Archive this lesson? It moves out of your library. Work already done is kept.") && act(() => api.post(`/lessons/${l.id}/archive`), "Archived")} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`archive-${l.id}`}><Archive size={12} /> Archive</button>}
              {!showArchived && l.status === "ready" && <button onClick={() => setAssignOpen(l)} className="ml-auto rounded-lg bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`assign-${l.id}`}><Send size={12} /> Assign</button>}
            </div>
          </div>
        ))}
        {!loading && shown.length === 0 && (
          <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 p-6 sm:p-10 text-center text-sm text-slate-600" data-testid="empty-library">
            {lessons.length ? (
              <>
                <p className="font-semibold text-slate-800">No lessons match those filters.</p>
                <p className="mt-1">Try a different search or show all your lessons.</p>
                <button type="button" onClick={() => { setQuery(""); setFSubject(""); setFYear(""); setFStatus(""); setFChild(""); }} className="mt-4 rounded-full border border-slate-400 bg-white px-4 py-2 text-sm font-semibold">Clear filters</button>
              </>
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

      {assignOpen && <ScheduleModal lesson={assignOpen} students={students} onClose={() => setAssignOpen(null)} onDone={() => api.get("/account/plan").then(r => setPlan(r.data)).catch(() => {})} />}
    </div>
  );
}
