import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookOpen, CheckCircle2, Map, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../lib/api";

const STEPS = [
  ["not_started", "Not started"], ["introduced", "Introduced"], ["developing", "Developing"],
  ["demonstrated", "Demonstrated"], ["achieved", "Achieved (parent confirmed)"],
];
const emptyGoal = { title: "", learning_area: "", description: "" };
const field = "w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm";
const endpoint = (sid) => "/international/goals/" + encodeURIComponent(sid);

function Goal({ goal, sid, notes, refresh }) {
  const [edit, setEdit] = useState({
    title: goal.title, learning_area: goal.learning_area, description: goal.description,
    status: goal.status, confirmation_note: goal.confirmation_note || "",
  });
  const [evidence, setEvidence] = useState({ evidence_note_id: "", title: "", note: "", occurred_on: new Date().toISOString().slice(0, 10) });
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setEdit({ title: goal.title, learning_area: goal.learning_area, description: goal.description,
      status: goal.status, confirmation_note: goal.confirmation_note || "" });
  }, [goal]);
  const url = endpoint(sid) + "/" + encodeURIComponent(goal.id);
  const err = (e) => toast.error(e?.response?.data?.detail || "We couldn't save that change.");
  const save = async () => {
    setSaving(true);
    try {
      await api.put(url, edit);
      toast.success("Learning goal updated");
      await refresh();
    } catch (e) { err(e); } finally { setSaving(false); }
  };
  const remove = async () => {
    if (!window.confirm("Delete this learning goal and unlink its evidence? Your Evidence Backpack notes will stay safe.")) return;
    try { await api.delete(url); toast.success("Goal removed"); await refresh(); } catch (e) { err(e); }
  };
  const addEvidence = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post(url + "/evidence", evidence);
      setEvidence({ evidence_note_id: "", title: "", note: "", occurred_on: new Date().toISOString().slice(0, 10) });
      setAdding(false);
      toast.success("Evidence linked to this goal");
      await refresh();
    } catch (e) { err(e); } finally { setSaving(false); }
  };
  const unlink = async (eid) => {
    try { await api.delete(url + "/evidence/" + encodeURIComponent(eid)); await refresh(); }
    catch (e) { err(e); }
  };
  return (
    <article className="paper-card p-5 space-y-4" data-testid="international-goal">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-xs font-bold text-stone-600">Goal title
            <input className={field + " mt-1"} value={edit.title} maxLength={160} onChange={(e) => setEdit(v => ({ ...v, title: e.target.value }))} />
          </label>
          <label className="text-xs font-bold text-stone-600">Subject or learning area
            <input className={field + " mt-1"} value={edit.learning_area} maxLength={80} onChange={(e) => setEdit(v => ({ ...v, learning_area: e.target.value }))} placeholder="e.g. English, science, life skills" />
          </label>
        </div>
        <div className="min-w-[200px]">
          <label className="text-xs font-bold text-stone-600">Progress (parent assessed)
            <select className={field + " mt-1"} value={edit.status} onChange={(e) => setEdit(v => ({ ...v, status: e.target.value }))}>
              {STEPS.map(([key, text]) => <option key={key} value={key}>{text}</option>)}
            </select>
          </label>
          <p className="mt-2 text-xs text-stone-600">{goal.evidence.length} linked evidence {goal.evidence.length === 1 ? "entry" : "entries"}</p>
        </div>
      </div>
      <label className="block text-xs font-bold text-stone-600">Description / what the child is working towards
        <textarea className={field + " mt-1"} rows={2} maxLength={2500} value={edit.description} onChange={(e) => setEdit(v => ({ ...v, description: e.target.value }))} />
      </label>
      {edit.status === "achieved" && (
        <label className="block text-xs font-bold text-stone-600">
          Why you're confirming this as achieved
          <textarea className={field + " mt-1"} rows={2} maxLength={2000} value={edit.confirmation_note}
            onChange={(e) => setEdit(v => ({ ...v, confirmation_note: e.target.value }))} placeholder="Describe how the evidence demonstrates this learning." />
          <span className="font-normal">Link evidence first, then add your judgement. Completing a lesson never marks a goal achieved automatically.</span>
        </label>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-emerald-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"><Save size={14}/> Save progress</button>
        <button type="button" onClick={() => setAdding(v => !v)} className="inline-flex items-center gap-2 rounded-full border border-stone-400 bg-white px-4 py-2 text-xs font-bold"><Plus size={14}/> Add or link evidence</button>
        <button type="button" onClick={remove} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-rose-800"><Trash2 size={13}/> Remove goal</button>
      </div>
      {adding && (
        <form onSubmit={addEvidence} className="rounded-xl bg-stone-50 border border-stone-200 p-4 space-y-3" data-testid="international-evidence-form">
          <p className="text-xs font-semibold text-stone-700">Choose an existing Evidence Backpack note, or record your own observation here.</p>
          <label className="block text-xs font-semibold">Link an existing note (optional)
            <select className={field + " mt-1"} value={evidence.evidence_note_id} onChange={e => setEvidence(v => ({ ...v, evidence_note_id: e.target.value }))}>
              <option value="">Write a new observation instead</option>
              {notes.map((n) => <option key={n.id} value={n.id}>{n.occurred_on} · {n.title}</option>)}
            </select>
          </label>
          {!evidence.evidence_note_id && <>
            <label className="block text-xs font-semibold">Observation title
              <input required minLength={3} maxLength={160} className={field + " mt-1"} value={evidence.title} onChange={e => setEvidence(v => ({ ...v, title: e.target.value }))} placeholder="e.g. Explained fractions independently" />
            </label>
            <label className="block text-xs font-semibold">What did your child show?
              <textarea required minLength={3} maxLength={3000} className={field + " mt-1"} rows={2} value={evidence.note} onChange={e => setEvidence(v => ({ ...v, note: e.target.value }))} />
            </label>
            <label className="block text-xs font-semibold">Date observed
              <input type="date" className={field + " mt-1"} value={evidence.occurred_on} onChange={e => setEvidence(v => ({ ...v, occurred_on: e.target.value }))} />
            </label>
          </>}
          <button disabled={saving} type="submit" className="rounded-full bg-emerald-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">Save evidence</button>
        </form>
      )}
      {goal.evidence.length > 0 && (
        <div className="space-y-2" data-testid="international-evidence-list">
          <h3 className="text-xs font-bold uppercase tracking-wide text-stone-600">Evidence along the trail</h3>
          {goal.evidence.map((item) => (
            <div key={item.id} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.title} <span className="font-normal text-xs text-stone-500">· {item.occurred_on}</span></p>
                {item.note && <p className="text-xs mt-1 whitespace-pre-wrap text-stone-700">{item.note}</p>}
                {item.evidence_note_id && !item.missing_source && <Link to="/parent/evidence" className="text-xs font-semibold underline text-emerald-800">See in Evidence Backpack</Link>}
                {item.missing_source && <p className="text-xs text-amber-900">The original note was deleted; this link no longer contains evidence.</p>}
              </div>
              <button className="text-xs underline text-rose-800" onClick={() => unlink(item.id)}>Unlink</button>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default function InternationalGoalTracker({ students = [] }) {
  const { sid } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newGoal, setNewGoal] = useState(emptyGoal);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const load = async () => {
    if (!sid) return;
    try {
      const [goalsResponse, notesResponse] = await Promise.all([
        api.get(endpoint(sid)), api.get("/evidence-notes", { params: { student_id: sid } }),
      ]);
      setData(goalsResponse.data);
      setNotes(Array.isArray(notesResponse.data) ? notesResponse.data : []);
      setError("");
    } catch (e) { setError(e.response?.data?.detail || "Could not load your learning goals."); }
  };
  useEffect(() => { setData(null); load(); }, [sid]);
  const create = async (event) => {
    event.preventDefault();
    setCreating(true);
    try {
      await api.post(endpoint(sid), newGoal);
      setNewGoal(emptyGoal); toast.success("Learning goal added"); await load();
    } catch (e) { toast.error(e.response?.data?.detail || "Could not create that goal."); }
    finally { setCreating(false); }
  };
  const counts = useMemo(() => {
    const list = data?.goals || [];
    return { total: list.length, achieved: list.filter(g => g.status === "achieved").length, working: list.filter(g => ["introduced", "developing", "demonstrated"].includes(g.status)).length };
  }, [data]);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl space-y-6" data-testid="international-outcome-tracker">
      <header className="space-y-3">
        <span className="font-script text-2xl" style={{ color: "#C77B5B" }}>A trail of your very own</span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold flex items-center gap-2 text-emerald-950"><Map size={27}/> Family learning goal tracker</h1>
        <p className="text-sm text-stone-700 leading-relaxed max-w-3xl">
          Outside Australia? You can still record what your children are learning, add evidence, and track their progress.
          You choose the goals and confirm achievements. Side-Quest does not supply or verify your country's curriculum codes, registration rules or compliance.
        </p>
        {students.length > 1 && <label className="inline-flex items-center gap-2 text-sm font-semibold">Child
          <select aria-label="Child" value={sid || ""} className={field} onChange={e => nav("/parent/outcomes/" + encodeURIComponent(e.target.value))}>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>}
      </header>

      <section className="grid grid-cols-3 gap-2" aria-label="Learning goal progress">
        {[["Total goals", counts.total], ["In progress", counts.working], ["Achieved", counts.achieved]].map(([label, count]) => (
          <div key={label} className="paper-card p-4"><div className="text-2xl font-display font-bold text-emerald-950">{count}</div><div className="text-xs text-stone-600">{label}</div></div>
        ))}
      </section>
      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert">{error}</p>}
      {!data && !error && <p>Loading learning goals…</p>}
      <section className="paper-card p-5 space-y-4">
        <h2 className="font-display text-xl font-bold text-emerald-950 flex items-center gap-2"><BookOpen size={20}/> Add a learning goal</h2>
        <form className="grid sm:grid-cols-2 gap-3" onSubmit={create}>
          <label className="block text-xs font-bold text-stone-700">Goal
            <input required minLength={3} maxLength={160} className={field + " mt-1"} value={newGoal.title} onChange={e => setNewGoal(v => ({ ...v, title: e.target.value }))} placeholder="e.g. Explain how plants grow" />
          </label>
          <label className="block text-xs font-bold text-stone-700">Subject
            <input maxLength={80} className={field + " mt-1"} value={newGoal.learning_area} onChange={e => setNewGoal(v => ({ ...v, learning_area: e.target.value }))} placeholder="e.g. Science or life skills" />
          </label>
          <label className="block text-xs font-bold text-stone-700 sm:col-span-2">What will your child learn? (optional)
            <textarea maxLength={2500} rows={2} className={field + " mt-1"} value={newGoal.description} onChange={e => setNewGoal(v => ({ ...v, description: e.target.value }))} />
          </label>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={!sid || creating} className="rounded-full bg-emerald-900 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50 flex items-center gap-2"><Plus size={15}/> Add goal</button>
            <p className="text-xs text-stone-600">A Family Membership unlocks creating goals and recording progress. <Link to="/parent/plan" className="underline font-semibold">See membership</Link></p>
          </div>
        </form>
      </section>
      {!data?.goals?.length && data && <p className="text-sm text-stone-600">No goals yet. Start with one thing your child is learning — you can add more whenever you like.</p>}
      <section className="space-y-4" aria-label="Your learning goals">
        {(data?.goals || []).map((g) => <Goal key={g.id} goal={g} sid={sid} notes={notes} refresh={load} />)}
      </section>
      <p className="text-xs text-stone-600 flex items-center gap-2"><CheckCircle2 size={15}/> Evidence Backpack notes stay in your records even if you unlink or delete a learning goal.</p>
    </div>
  );
}
