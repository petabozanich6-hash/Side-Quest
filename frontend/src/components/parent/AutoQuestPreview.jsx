import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";

// Auto-Quest: plans lessons for the timetabled slots of a child's week from their curriculum progress.
// Nothing is created with AI or assigned until the parent asks for it, slot by slot.
const dateString = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
const today = () => dateString(new Date());
const inDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return dateString(d); };
const PURPOSE = { teach: ["New learning", "bg-emerald-100 text-emerald-900"], consolidate: ["Consolidation", "bg-sky-100 text-sky-900"], revise: ["Revision", "bg-violet-100 text-violet-900"] };
const STATUS = { assigned: ["Assigned", "bg-emerald-700 text-white"], rejected: ["Skipped", "bg-stone-200 text-stone-700"] };
const fmt = d => new Date(d + "T00:00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });

function Proposal({ p, busy, act }) {
  const [reviewed, setReviewed] = useState(false);
  const decided = p.status !== "proposed";
  const draft = p.lesson && p.lesson.status !== "ready";
  return (
    <li className="p-3 text-sm space-y-2" data-testid={`aq-proposal-${p.id}`} data-action={p.action} data-status={p.status}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">{fmt(p.date)} · {p.learning_area}</span>
        {p.purpose && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${PURPOSE[p.purpose][1]}`}>{PURPOSE[p.purpose][0]}</span>}
        {STATUS[p.status] && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS[p.status][1]}`}>{STATUS[p.status][0]}</span>}
        {p.outcome_codes.map(c => <span key={c} className="font-mono text-[11px] rounded border border-stone-300 px-1.5">{c}</span>)}
      </div>
      <p className="text-stone-600">{p.reason}</p>
      {p.lesson && <p>Lesson: <Link to={`/parent/lessons/${p.lesson.id}/edit`} className="font-semibold underline" data-testid="aq-lesson-link">{p.lesson.title}</Link>{draft && <span className="ml-2 text-amber-800 text-xs font-semibold">Draft: check it before approving</span>}</p>}
      {!decided && p.action !== "already_assigned" && (
        <div className="flex flex-wrap items-center gap-2">
          {!p.lesson && p.action === "needs_generation" && <button disabled={busy} onClick={() => act(p, "generate")} className="rounded-full bg-teal-800 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50" data-testid="aq-generate">Draft this lesson with AI</button>}
          {!p.lesson && <Link to={`/parent/lessons/new${p.outcome_codes[0] ? `?outcome=${encodeURIComponent(p.outcome_codes[0])}` : ""}`} className="rounded-full border border-stone-400 px-3 py-1.5 text-xs font-semibold">Build it yourself</Link>}
          {p.lesson && draft && <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} data-testid="aq-reviewed" /> I've reviewed this lesson</label>}
          {p.lesson && <button disabled={busy || (draft && !reviewed)} onClick={() => act(p, "approve", draft ? { confirm_reviewed: true } : {})} className="rounded-full bg-emerald-800 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50" data-testid="aq-approve">Approve and assign</button>}
          <button disabled={busy} onClick={() => act(p, "reject")} className="rounded-full border border-stone-400 px-3 py-1.5 text-xs font-semibold disabled:opacity-50" data-testid="aq-reject">Skip</button>
        </div>
      )}
      {p.status === "rejected" && <button disabled={busy} onClick={() => act(p, "reopen")} className="text-xs underline">Undo skip</button>}
    </li>
  );
}

export default function AutoQuestPreview({ students, onClose, onChanged }) {
  const [studentId, setStudentId] = useState(students[0]?.id || "");
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(inDays(6));
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  // Show proposals already saved for this range (drafts and decisions are kept between visits).
  const load = useCallback(async () => {
    if (!studentId || !from || !to || from > to) return;
    try { const { data } = await api.get("/auto-quest/proposals", { params: { student_id: studentId, from, to } }); setResult(r => ({ ...(r || {}), proposals: data.proposals })); }
    catch { /* nothing saved yet */ }
  }, [studentId, from, to]);
  useEffect(() => { setResult(null); load(); }, [load]);

  const plan = async () => {
    setLoading(true);
    try { const { data } = await api.post("/auto-quest/plan", { student_id: studentId, from, to }); setResult(data); }
    catch (error) { toast.error(apiErrorMessage(error, "Couldn't plan these lessons")); }
    finally { setLoading(false); }
  };
  const act = async (p, what, body = {}) => {
    setBusy(true);
    try {
      const { data } = await api.post(`/auto-quest/proposals/${p.id}/${what}`, body);
      setResult(r => ({ ...r, proposals: r.proposals.map(x => (x.id === p.id ? data : x)) }));
      if (what === "approve") { toast.success("Assigned for " + fmt(p.date)); onChanged && onChanged(); }
      if (what === "generate") toast.success("Draft ready. Open it to check and edit before approving.");
    } catch (error) { toast.error(apiErrorMessage(error, "That didn't work")); }
    finally { setBusy(false); }
  };
  const proposals = result?.proposals || [];

  return <div className="fixed inset-0 z-50 bg-slate-900/60 p-4 overflow-y-auto flex items-start justify-center" onClick={onClose}>
    <section className="mt-6 mb-6 w-full max-w-3xl rounded-2xl bg-white p-4 sm:p-6 shadow-xl space-y-4" role="dialog" aria-modal="true" aria-label="Auto-Quest" onClick={e => e.stopPropagation()} data-testid="autoquest-modal">
      <div className="flex justify-between items-start gap-3">
        <div><h2 className="font-display text-2xl font-bold">⚔️ Auto-Quest</h2>
          <p className="text-sm text-slate-600 mt-1">Plans a lesson for each timetabled session from your child's curriculum progress: reusing your saved lessons first, suggesting new learning, consolidation or a little revision. Nothing is drafted or assigned until you choose.</p>
        </div>
        <button onClick={onClose} aria-label="Close Auto-Quest" className="text-xl">×</button>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="text-xs font-semibold">Child
          <select value={studentId} onChange={e => setStudentId(e.target.value)} className="mt-1 w-full rounded-lg border p-2" data-testid="autoquest-child">
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold">From<input type="date" value={from} onChange={e => setFrom(e.target.value)} className="mt-1 w-full rounded-lg border p-2" data-testid="autoquest-from" /></label>
        <label className="text-xs font-semibold">To<input type="date" value={to} onChange={e => setTo(e.target.value)} className="mt-1 w-full rounded-lg border p-2" data-testid="autoquest-to" /></label>
      </div>
      <button type="button" onClick={plan} disabled={loading || !studentId || from > to} className="rounded-full bg-emerald-900 px-5 py-2 text-sm font-bold text-white disabled:opacity-50" data-testid="autoquest-preview">{loading ? "Planning…" : proposals.length ? "Plan again" : "Plan lessons"}</button>
      {result?.note && <p className="text-sm text-stone-700" data-testid="autoquest-note">{result.note}</p>}
      {result && !proposals.length && <p className="text-sm text-stone-600" data-testid="autoquest-empty">No lesson sessions are timetabled for this child in these dates. Use Generate timetable first, then plan again.</p>}
      {proposals.length > 0 && <ul className="divide-y rounded-xl border" data-testid="autoquest-decisions">{proposals.map(p => <Proposal key={p.id} p={p} busy={busy} act={act} />)}</ul>}
      <p className="text-xs text-stone-500">AI drafts use your Family Membership allowance and are always saved as drafts for you to check. Finishing a lesson never marks an outcome as mastered: your reviews in the Outcome Tracker decide that.</p>
    </section>
  </div>;
}
