import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";

const STAGES = [
  { code: "ES1", name: "Early Stage 1 (Kindergarten)", theme: "early" },
  { code: "S1", name: "Stage 1 (Years 1-2)", theme: "primary" },
  { code: "S2", name: "Stage 2 (Years 3-4)", theme: "primary" },
  { code: "S3", name: "Stage 3 (Years 5-6)", theme: "primary" },
  { code: "S4", name: "Stage 4 (Years 7-8)", theme: "secondary" },
  { code: "S5", name: "Stage 5 (Years 9-10)", theme: "secondary" },
  { code: "S6", name: "Stage 6 (Years 11-12)", theme: "senior" },
];

export default function ChildrenPage() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", pin: "", stage: "S2", year_level: "", birth_year: "" });

  const load = () => api.get("/students").then(r => setStudents(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const stage = STAGES.find(s => s.code === form.stage);
      await api.post("/students", { ...form, theme: stage?.theme, birth_year: form.birth_year ? Number(form.birth_year) : null });
      toast.success("Student added");
      setOpen(false);
      setForm({ name: "", username: "", pin: "", stage: "S2", year_level: "", birth_year: "" });
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Remove this student? Their records stay in the family archive.")) return;
    await api.delete(`/students/${id}`);
    toast.success("Removed");
    load();
  };

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="children-page">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Children</h1>
          <p className="text-sm text-slate-600 mt-1">Add each child with a username and PIN. They sign in from the student page.</p>
        </div>
        <button onClick={() => setOpen(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 flex items-center gap-1.5" data-testid="add-student-btn"><Plus size={14} /> Add student</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(s => (
          <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-6 relative group" data-testid={`student-${s.id}`}>
            <button onClick={() => del(s.id)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition" data-testid={`del-${s.id}`}><Trash2 size={14}/></button>
            <div className="font-display text-xl font-bold text-slate-900">{s.name}</div>
            <div className="font-mono text-xs text-slate-500 mt-1">@{s.username}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="pill pill-not-started">{s.stage_name}</span>
              <span className="pill pill-not-started">{s.band}</span>
              {s.year_level && <span className="pill pill-not-started">Year {s.year_level}</span>}
            </div>
            {s.interests?.length > 0 && (
              <div className="mt-4 text-xs text-slate-600"><span className="font-semibold">Interests: </span>{s.interests.join(", ")}</div>
            )}
          </div>
        ))}
        {students.length === 0 && (
          <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">No students yet.</div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onClick={e=>e.stopPropagation()} onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" data-testid="add-student-form">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold">Add student</h2>
              <button type="button" onClick={() => setOpen(false)} data-testid="close-form"><X size={18}/></button>
            </div>
            <div className="space-y-3">
              <Field label="Name"><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="input" data-testid="f-name"/></Field>
              <Field label="Username (for sign in)"><input required value={form.username} onChange={e=>setForm({...form, username: e.target.value})} className="input" data-testid="f-username"/></Field>
              <Field label="PIN (4+ digits)"><input required type="password" minLength={4} value={form.pin} onChange={e=>setForm({...form, pin: e.target.value})} className="input" data-testid="f-pin"/></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Stage">
                  <select value={form.stage} onChange={e=>setForm({...form, stage: e.target.value})} className="input" data-testid="f-stage">
                    {STAGES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </Field>
                <Field label="Year level"><input value={form.year_level} onChange={e=>setForm({...form, year_level: e.target.value})} className="input" data-testid="f-year"/></Field>
              </div>
              <Field label="Birth year (optional)"><input type="number" value={form.birth_year} onChange={e=>setForm({...form, birth_year: e.target.value})} className="input" data-testid="f-birth"/></Field>
            </div>
            <button className="mt-5 w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white" data-testid="submit-student">Add student</button>
          </form>
        </div>
      )}
      <style>{`.input { width:100%; border-radius:0.5rem; border:1px solid #cbd5e1; padding:0.5rem 0.75rem; font-size:0.875rem; } .input:focus { outline:none; border-color:#0d9488; }`}</style>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div>
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>
    <div className="mt-1">{children}</div>
  </div>
);
