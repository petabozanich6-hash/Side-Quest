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
  }, []);

  const act = async (fn, okMsg) => {
    try { await fn(); if (okMsg) toast.success(okMsg); load(); api.get("/account/plan").then(r => setPlan(r.data)).catch(() => {}); }
    catch (err) { toast.error(err.response?.data?.detail || "Something went wrong"); }
  };

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const shown = lessons.filter(l => {
    const t = [l.title, l.learning_area, l.year_level, ...(l.objectives || [])].join(" ").toLowerCase();
    return terms.every(w => t.includes(w));
  });

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6" data-testid="lessons-page">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">My lessons</h1>
          <p className="text-sm text-slate-600 mt-1">Your family's lesson library. Create a lesson once, then assign it to any child.</p>
        </div>
        <Link to="/parent/lessons/new" className="rounded-full bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold flex items-center gap-1" data-testid="new-lesson"><Plus size={16} /> Create a lesson</Link>
      </div>

      {plan && plan.effective_plan === "FREE_PREVIEW" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" data-testid="preview-banner">
          Free preview until {new Date(plan.trial_ends_at).toLocaleDateString()}: {plan.usage.lessons} of {plan.limits.maxLessons} lessons, {plan.usage.children} of {plan.limits.maxChildren} child profile, {plan.usage.activeAssignments} of {plan.limits.maxActiveAssignments} active assignments.
        </div>
      )}
      {plan && plan.effective_plan === "PREVIEW_EXPIRED" && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900" data-testid="expired-banner">
          Your free preview has ended. Your lessons and your children's progress are all kept. A Family Membership will be needed to create and assign lessons.
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <strong>Ready-made Side-Quest lessons: upgrade coming later.</strong> For now, build your own lessons here.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xl flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by title, subject or topic…" aria-label="Search lessons"
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:border-slate-500" data-testid="lesson-search" />
          {query && <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X size={14} /></button>}
        </div>
        <button onClick={() => setShowArchived(v => !v)} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold" data-testid="toggle-archived">{showArchived ? "Show current lessons" : "Show archived"}</button>
      </div>

      {error && <div role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</div>}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {shown.map(l => (
          <div key={l.id} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col" data-testid={`lesson-${l.id}`}>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              {[l.learning_area, l.year_level].filter(Boolean).join(" · ") || "No subject yet"}
              {l.status === "draft" && <span className="ml-2 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 normal-case tracking-normal text-slate-700">Draft</span>}
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
          <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center text-sm text-slate-500" data-testid="empty-library">
            {lessons.length ? "No lessons match your search." : showArchived ? "Nothing archived." : "You have not created a lesson yet. Create your first one, then assign it to your child."}
          </div>
        )}
      </div>

      {assignOpen && <ScheduleModal lesson={assignOpen} students={students} onClose={() => setAssignOpen(null)} onDone={() => api.get("/account/plan").then(r => setPlan(r.data)).catch(() => {})} />}
    </div>
  );
}
