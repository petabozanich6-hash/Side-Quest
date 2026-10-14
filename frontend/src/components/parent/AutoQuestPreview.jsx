import React, { useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";

const dateString = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
const today = () => dateString(new Date());
const twoWeeks = () => { const d = new Date(); d.setDate(d.getDate() + 13); return dateString(d); };
const LABELS = {
  already_assigned: "Already assigned",
  reuse_draft: "Existing lesson available",
  needs_generation: "New lesson needed",
  needs_parent_plan: "Parent planning needed",
};

export default function AutoQuestPreview({ students, onClose }) {
  const [studentId, setStudentId] = useState(students[0]?.id || "");
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(twoWeeks());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const preview = async () => {
    if (!studentId || !from || !to) return;
    setLoading(true); setResult(null);
    try {
      const res = await api.get("/auto-quest/preview", { params: { student_id: studentId, from, to } });
      setResult(res.data);
    } catch (error) { toast.error(apiErrorMessage(error, "Couldn't prepare the lesson preview")); }
    finally { setLoading(false); }
  };
  return <div className="fixed inset-0 z-50 bg-slate-900/60 p-4 overflow-y-auto flex items-start justify-center" onClick={onClose}>
    <section className="mt-6 mb-6 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl space-y-4" role="dialog" aria-modal="true" aria-label="Auto-Quest lesson preview" onClick={e => e.stopPropagation()} data-testid="autoquest-modal">
      <div className="flex justify-between items-start gap-3">
        <div><h2 className="font-display text-2xl font-bold">⚔️ Auto-Quest: Learning Week Preview</h2>
          <p className="text-sm text-slate-600 mt-1">See what's already assigned, which lessons can be reused, and where more planning is needed. This preview does not create or assign anything.</p>
        </div>
        <button onClick={onClose} aria-label="Close Auto-Quest" className="text-xl">×</button>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="text-xs font-semibold">Child
          <select value={studentId} onChange={e=>{setStudentId(e.target.value);setResult(null);}} className="mt-1 w-full rounded-lg border p-2" data-testid="autoquest-child">
            {students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold">From
          <input type="date" value={from} onChange={e=>{setFrom(e.target.value);setResult(null);}} className="mt-1 w-full rounded-lg border p-2" data-testid="autoquest-from"/>
        </label>
        <label className="text-xs font-semibold">To
          <input type="date" value={to} onChange={e=>{setTo(e.target.value);setResult(null);}} className="mt-1 w-full rounded-lg border p-2" data-testid="autoquest-to"/>
        </label>
      </div>
      <button type="button" onClick={preview} disabled={loading || !studentId || from>to} className="rounded-full bg-emerald-900 px-5 py-2 text-sm font-bold text-white disabled:opacity-50" data-testid="autoquest-preview">{loading ? "Checking timetable…" : "Preview learning sessions"}</button>
      {result && <div className="space-y-3" data-testid="autoquest-results">
        <p className="text-sm text-stone-700">{result.note}</p>
        <p className="text-sm font-semibold">{result.decisions.length} timetable session(s) · {result.counts.already_assigned} already assigned · {result.counts.reuse_draft} existing lessons · {result.counts.needs_generation} needing new lessons · {result.counts.needs_parent_plan} requiring parent planning</p>
        {!result.decisions.length && <p className="text-sm text-stone-600">No lessons are scheduled for this child in the selected dates. Generate a timetable first.</p>}
        <ul className="divide-y rounded-xl border" data-testid="autoquest-decisions">
          {result.decisions.map(d=><li key={d.slotId} className="p-3 text-sm flex flex-col gap-1">
            <span className="font-semibold">{LABELS[d.action] || d.action}</span>
            <span className="text-stone-600">{d.reason}</span>
            {d.lessonId && <span className="text-xs">Lesson reference: {d.lessonId}</span>}
          </li>)}
        </ul>
        <p className="text-xs text-amber-800">Preview only. Automatic AI lesson creation and assignment require an additional review and approval workflow and are not enabled yet.</p>
      </div>}
    </section>
  </div>;
}
