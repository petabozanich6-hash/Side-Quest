import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

const STATUS = {
  not_started: ["Not started", "bg-slate-100 text-slate-700"],
  in_progress: ["In progress", "bg-sky-100 text-sky-800"],
  submitted: ["Submitted", "bg-amber-100 text-amber-800"],
  needs_revision: ["Needs revision", "bg-rose-100 text-rose-800"],
  needs_more_practice: ["Needs more practice", "bg-rose-100 text-rose-800"],
  accepted: ["Completed", "bg-emerald-100 text-emerald-800"],
  completed: ["Completed", "bg-emerald-100 text-emerald-800"],
  demonstrated: ["Completed, skill shown", "bg-emerald-200 text-emerald-900"],
};
const DONE = ["accepted", "completed", "demonstrated"];

export default function AssignmentsPage() {
  const [rows, setRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [child, setChild] = useState("");
  const [show, setShow] = useState("open");
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const load = () => api.get("/assignments").then(r => setRows(r.data || [])).finally(() => setLoading(false));
  useEffect(() => { load(); api.get("/students").then(r => setStudents(r.data)).catch(() => {}); }, []);
  const name = (id) => students.find(s => s.id === id)?.name || "Child";

  const act = async (fn, msg) => {
    try { await fn(); toast.success(msg); setEdit(null); load(); }
    catch (e) { toast.error(e.response?.data?.detail || "Something went wrong"); }
  };

  const shown = rows.filter(a => (!child || a.student_id === child) && (show === "all" || (show === "open" ? !DONE.includes(a.status) : DONE.includes(a.status))));
  const sel = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-5" data-testid="assignments-page">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900">Assignments</h1>
        <p className="text-sm text-slate-600 mt-1">Everything you've given your children. Change a date, give it to another child, or take it back before they start. To give out a lesson, use <Link to="/parent/lessons" className="underline">My lessons</Link>.</p>
      </header>
      <div className="flex flex-wrap gap-2">
        <select className={sel} value={child} onChange={e => setChild(e.target.value)} aria-label="Child" data-testid="asg-child"><option value="">All children</option>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <select className={sel} value={show} onChange={e => setShow(e.target.value)} aria-label="Show" data-testid="asg-show"><option value="open">Not finished</option><option value="done">Completed</option><option value="all">All</option></select>
      </div>
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">Nothing here yet. Open <Link to="/parent/lessons" className="underline font-semibold">My lessons</Link> and press Assign.</div>
      ) : (
        <div className="space-y-3">
          {shown.map(a => {
            const [label, cls] = STATUS[a.status] || [a.status, "bg-slate-100 text-slate-700"];
            const started = a.status !== "not_started";
            return (
              <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-4" data-testid={`asg-${a.id}`}>
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{a.lesson?.title || "Lesson"}</p>
                    <p className="text-xs text-slate-600">{name(a.student_id)}{a.scheduled_date ? ` · planned ${a.scheduled_date}` : ""}{a.due_date ? ` · due ${a.due_date}` : ""}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{label}</span>
                </div>
                {!DONE.includes(a.status) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => setEdit({ id: a.id, mode: "dates", scheduled_date: a.scheduled_date || "", due_date: a.due_date || "" })} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold" data-testid={`asg-move-${a.id}`}>Change dates</button>
                    {!started && students.length > 1 && <button onClick={() => setEdit({ id: a.id, mode: "reassign", student_id: "" })} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold" data-testid={`asg-reassign-${a.id}`}>Give to another child</button>}
                    {!started && <button onClick={() => { if (window.confirm("Take this assignment back? The child hasn't started it.")) act(() => api.delete(`/assignments/${a.id}`), "Assignment cancelled"); }} className="rounded-full border border-rose-300 text-rose-700 px-3 py-1 text-xs font-semibold" data-testid={`asg-cancel-${a.id}`}>Cancel</button>}
                    {started && <span className="text-xs text-slate-500 self-center">Started, so it can't be cancelled or moved to another child.</span>}
                  </div>
                )}
                {edit?.id === a.id && edit.mode === "dates" && (
                  <div className="mt-3 flex flex-wrap items-end gap-3">
                    <label className="text-xs font-semibold text-slate-600">Planned day<input type="date" value={edit.scheduled_date} onChange={e => setEdit({ ...edit, scheduled_date: e.target.value })} className={`${sel} block mt-1`} data-testid="asg-date-planned" /></label>
                    <label className="text-xs font-semibold text-slate-600">Due<input type="date" value={edit.due_date} onChange={e => setEdit({ ...edit, due_date: e.target.value })} className={`${sel} block mt-1`} data-testid="asg-date-due" /></label>
                    <button onClick={() => act(() => api.put(`/assignments/${a.id}`, { scheduled_date: edit.scheduled_date || null, due_date: edit.due_date || null }), "Dates updated")} className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold" data-testid="asg-save-dates">Save</button>
                  </div>
                )}
                {edit?.id === a.id && edit.mode === "reassign" && (
                  <div className="mt-3 flex flex-wrap items-end gap-3">
                    <select className={sel} value={edit.student_id} onChange={e => setEdit({ ...edit, student_id: e.target.value })} aria-label="New child" data-testid="asg-newchild"><option value="">Choose a child</option>{students.filter(s => s.id !== a.student_id).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                    <button disabled={!edit.student_id} onClick={() => act(() => api.post(`/assignments/${a.id}/reassign`, { student_id: edit.student_id }), "Moved to the other child")} className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50" data-testid="asg-save-reassign">Move</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
