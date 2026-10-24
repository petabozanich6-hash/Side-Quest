import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ReviewModal from "../../components/parent/ReviewModal";
import { portfolioHtml, portfolioCsv } from "../../lib/portfolioDoc";

const APPROVED = ["accepted", "demonstrated"];
export { portfolioCsv };

// Turns attached photos into data URLs so they print inside the record (the file links need a sign-in).
async function embedImages(entries, max = 60) {
  const out = {};
  let n = 0;
  for (const e of entries || []) {
    for (const f of (e.files || []).filter((x) => /^image\//.test(x.content_type)).slice(0, 4)) {
      if (n >= max) return out;
      try {
        const { data } = await api.get(`/files/${f.id}`, { responseType: "blob" });
        if (data.size > 4 * 1024 * 1024) continue;
        out[f.id] = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(data); });
        n++;
      } catch { /* leave it listed by name */ }
    }
  }
  return out;
}

const NOTE_KEY = (sid) => `sq_visit_notes_${sid}`;
const readNotes = (sid) => { try { return JSON.parse(localStorage.getItem(NOTE_KEY(sid)) || "{}"); } catch { return {}; } };
const saveNotes = (sid, v) => { try { localStorage.setItem(NOTE_KEY(sid), JSON.stringify(v)); } catch { /* not kept */ } };

function VisitPrep({ students, range, setRange, bump }) {
  const [sid, setSid] = useState(students[0]?.id || "");
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (!sid && students[0]) setSid(students[0].id); }, [students, sid]);
  useEffect(() => { if (sid) setNotes(readNotes(sid)); }, [sid]);
  useEffect(() => {
    if (!sid) return;
    let alive = true;
    api.get("/portfolio", { params: { student_id: sid, from: range.from || undefined, to: range.to || undefined } })
      .then((r) => alive && setData(r.data)).catch(() => alive && setData(null));
    return () => { alive = false; };
  }, [sid, range.from, range.to, bump]);
  const setNote = (k, v) => { const next = { ...notes, [k]: v }; setNotes(next); saveNotes(sid, next); };
  const child = students.find((s) => s.id === sid);

  const print = async () => {
    const w = window.open("", "_blank");
    if (!w) { toast.error("Allow pop-ups to open the record"); return; }
    w.document.write("<p style='font-family:sans-serif;padding:24px'>Preparing the record and its photos…</p>");
    setBusy(true);
    try {
      const { data: p } = await api.get("/portfolio", { params: { student_id: sid, from: range.from || undefined, to: range.to || undefined } });
      const images = await embedImages(p.entries);
      w.document.open(); w.document.write(portfolioHtml(p, { ...notes, images })); w.document.close(); w.focus();
      setTimeout(() => w.print(), 400);
    } catch (e) { w.close(); toast.error(e.response?.data?.detail || "Could not build the record"); }
    finally { setBusy(false); }
  };
  const csv = async () => {
    try {
      const { data: p } = await api.get("/portfolio", { params: { student_id: sid, from: range.from || undefined, to: range.to || undefined } });
      const blob = new Blob(["\ufeff" + portfolioCsv(p)], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = `${(child?.name || "child").replace(/[^\w-]+/g, "_")}-learning-record.csv`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } catch (e) { toast.error(e.response?.data?.detail || "Could not build the export"); }
  };
  const area = "rounded-lg border border-slate-300 px-3 py-2 text-sm w-full";
  const s = data?.summary;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4" data-testid="visit-prep">
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900">Prepare for a home education review</h2>
        <p className="text-sm text-slate-600">Print a record of learning and progress for your state or territory's home education review, whether that's a visit, a moderator meeting or a written report: a summary by learning area, the curriculum outcomes evidenced, dated and annotated work samples (photos included) in order so progress over time is clear, and your own summary and declaration.</p>
      </div>
      <div className="flex flex-wrap items-end gap-3 text-xs font-semibold text-slate-600">
        <label>Child<select value={sid} onChange={(e) => setSid(e.target.value)} className="block mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" data-testid="visit-child">{students.map((st) => <option key={st.id} value={st.id}>{st.name}</option>)}</select></label>
        <label>From<input type="date" value={range.from} onChange={e => setRange({ ...range, from: e.target.value })} className="block mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" data-testid="range-from" /></label>
        <label>To<input type="date" value={range.to} onChange={e => setRange({ ...range, to: e.target.value })} className="block mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" data-testid="range-to" /></label>
        <span className="text-slate-500 font-normal">Usually your current registration period. Leave blank for everything.</span>
      </div>

      {data && !data.jurisdiction && <p className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900" data-testid="visit-no-state">Choose your state or territory on the <Link to="/parent/life-learning" className="font-semibold underline">Life Learning</Link> page so this record uses your curriculum's learning areas. Until then it uses the Australian Curriculum.</p>}
      {data?.framework && <p className="text-xs text-slate-500">Curriculum: {data.framework}{data.jurisdiction_name ? ` (${data.jurisdiction_name})` : ""}</p>}
      {s && (
        <div className="overflow-x-auto" data-testid="visit-coverage">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-2">Learning area</th><th className="p-2">Entries</th><th className="p-2">Understanding shown</th><th className="p-2">Practised</th></tr></thead>
            <tbody>{s.areas.map((a) => (
              <tr key={a.learning_area} className="border-t border-slate-100">
                <td className="p-2">{a.learning_area}</td>
                <td className={`p-2 ${a.expected && !a.entries ? "text-amber-700 font-semibold" : ""}`}>{a.entries || (a.expected ? "None yet" : 0)}</td>
                <td className="p-2">{a.outcomes_shown || "—"}</td><td className="p-2">{a.outcomes_working_towards || "—"}</td>
              </tr>))}</tbody>
          </table>
          {data?.progress?.available && (
            <div className="mt-3 rounded-lg border border-slate-200 p-3" data-testid="visit-progress">
              <p className="text-xs font-semibold text-slate-700">Outcome Tracker snapshot (all time, as at today) · {data.progress.totals.total} outcomes for this year level</p>
              <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                {["achieved", "prior_learning", "demonstrated", "developing", "introduced"].map((k, i) => (
                  <div key={k} style={{ width: `${(100 * (data.progress.totals.counts[k] || 0)) / Math.max(1, data.progress.totals.total)}%`, backgroundColor: ["#1F3B2D", "#818CF8", "#4A7C59", "#9DBF9E", "#D9E5D6"][i] }} />
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-600">{["achieved", "prior_learning", "demonstrated", "developing", "introduced", "not_started"].map(k => `${data.progress.status_labels[k]}: ${data.progress.totals.counts[k] || 0}`).join(" · ")}</p>
            </div>
          )}
          {data?.progress && !data.progress.available && <p className="text-xs text-slate-600 mt-2" data-testid="visit-progress-unavailable">{data.progress.note}</p>}
          {data?.progress?.available && <p className="text-xs text-slate-600 mt-2" data-testid="visit-tracker-link">"Understanding shown" counts pieces of work in this period where you judged the outcome shown. Each outcome's overall status (Demonstrated, or Achieved once you confirm it) comes from the <Link to={`/parent/outcomes/${sid}`} className="font-semibold underline">Outcome tracker</Link>.</p>}
          {s.not_yet_evidenced.length > 0 && <p className="text-xs text-amber-800 mt-2" data-testid="visit-gaps">No evidence yet for {s.not_yet_evidenced.join(", ")} in this period. Add a work sample or an observation below, or explain how these are covered in your summary.</p>}
        </div>
      )}

      <div className="grid gap-3">
        <label className="text-xs font-semibold text-slate-600">Progress made during this period<textarea rows={3} value={notes.summary || ""} onChange={(e) => setNote("summary", e.target.value)} maxLength={4000} className={`${area} mt-1 font-normal`} placeholder="e.g. Mia now reads chapter books independently and can explain how a character changes." data-testid="visit-summary" /></label>
        <label className="text-xs font-semibold text-slate-600">Areas of strength or advancement<textarea rows={2} value={notes.advancement || ""} onChange={(e) => setNote("advancement", e.target.value)} maxLength={4000} className={`${area} mt-1 font-normal`} data-testid="visit-advancement" /></label>
        <label className="text-xs font-semibold text-slate-600">Areas needing further attention and how you will address them<textarea rows={2} value={notes.attention || ""} onChange={(e) => setNote("attention", e.target.value)} maxLength={4000} className={`${area} mt-1 font-normal`} data-testid="visit-attention" /></label>
        <p className="text-xs text-slate-500">Saved on this device only. Leave blank to get lined space you can fill in by hand.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={print} disabled={busy || !sid} className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-semibold disabled:opacity-50" data-testid={`export-${sid}`}>{busy ? "Preparing…" : `Print learning record${child ? `: ${child.name}` : ""}`}</button>
        <button onClick={csv} disabled={!sid} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold" data-testid={`csv-${sid}`}>Download CSV</button>
      </div>
      {data?.limited && <p className="text-xs text-slate-600">Free preview: the printed record shows your full summary but only one work sample in full.</p>}
    </section>
  );
}

export default function EvidencePage() {
  const [submissions, setSubmissions] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [students, setStudents] = useState([]);
  const [range, setRange] = useState({ from: "", to: "" });
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ student_id: "", title: "", learning_area: "", occurred_on: new Date().toISOString().slice(0, 10), notes: "" });
  const [adding, setAdding] = useState(false);
  const loadNotes = () => api.get("/evidence-notes").then(r => setNotes(r.data || [])).catch(() => {});
  const addNote = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post("/evidence-notes", { ...form, student_id: form.student_id || students[0]?.id });
      toast.success("Evidence added");
      setForm({ ...form, title: "", notes: "" });
      loadNotes();
    } catch (err) { toast.error(err.response?.data?.detail || "Could not save that"); }
    finally { setAdding(false); }
  };
  const load = () => api.get("/submissions").then(r => setSubmissions((r.data || []).filter(s => APPROVED.includes(s.status))));
  useEffect(() => { load(); loadNotes(); api.get("/students").then(r => setStudents(r.data)).catch(() => {}); }, []);

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6" data-testid="evidence-page">
      <header>
        <h1 data-tour="tour-evidence" className="font-display text-3xl font-bold text-slate-900">Evidence Backpack</h1>
        <p className="text-sm text-slate-600 mt-1">A home for your family’s learning portfolio: parent-approved lessons, notes from everyday learning and progress records. Review work waiting for you on the dashboard.</p>
        <Link to="/parent/audit" className="inline-flex mt-3 text-sm font-bold underline underline-offset-4 text-emerald-900" data-testid="evidence-review-pack-link">Build a detailed evidence review pack or curriculum audit →</Link>
      </header>

      {students.length > 0 && <VisitPrep students={students} range={range} setRange={setRange} bump={notes.length + submissions.length} />}

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="p-3">Student</th><th className="p-3">Lesson</th><th className="p-3">Outcomes achieved</th><th className="p-3">Approved</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {submissions.map(s => {
              const achieved = (s.outcome_mappings || []).filter(m => m.accepted).map(m => m.code);
              return (
                <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`sub-${s.id}`}>
                  <td className="p-3 font-medium">{s.student?.name}</td>
                  <td className="p-3">{s.lesson?.title}</td>
                  <td className="p-3 text-xs font-mono">{achieved.join(", ") || "—"}</td>
                  <td className="p-3 text-xs text-slate-500">{s.reviewed_at ? new Date(s.reviewed_at).toLocaleDateString() : "—"}</td>
                  <td className="p-3 text-right"><button onClick={() => setOpenId(s.id)} className="rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold" data-testid={`review-${s.id}`}>View</button></td>
                </tr>
              );
            })}
            {submissions.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-sm text-slate-600">No parent-reviewed lesson submissions yet. When your child submits a lesson, <Link to="/parent" className="font-semibold underline">review it in the Parent Hub</Link> to add it here. You can also record everyday learning below.</td></tr>}
          </tbody>
        </table>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4" data-testid="evidence-notes">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">Add evidence of your own</h2>
          <p className="text-sm text-slate-600">For learning that didn't come from a lesson: an excursion, a project, something you observed.</p>
        </div>
        {students.length === 0 && <p className="text-sm text-slate-600">Start by <Link to="/parent/children" className="font-semibold underline">adding a child</Link>, then you can record excursions, projects and other learning moments here.</p>}
        {students.length > 0 && (
          <form onSubmit={addNote} className="grid sm:grid-cols-2 gap-3">
            <select value={form.student_id || students[0]?.id} onChange={e => setForm({ ...form, student_id: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" aria-label="Child" data-testid="note-child">{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
            <input type="date" value={form.occurred_on} onChange={e => setForm({ ...form, occurred_on: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" aria-label="Date" data-testid="note-date" />
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="What happened? e.g. Visit to the museum" maxLength={200} className="sm:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="note-title" />
            <input value={form.learning_area} onChange={e => setForm({ ...form, learning_area: e.target.value })} placeholder="Subject (optional)" maxLength={80} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="note-area" />
            <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="What did they do or learn? Your observations." maxLength={5000} className="sm:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="note-text" />
            <button disabled={adding} className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-semibold disabled:opacity-50 sm:w-fit" data-testid="note-save">{adding ? "Saving…" : "Add evidence"}</button>
          </form>
        )}
        <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search your evidence…" aria-label="Search evidence" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="evidence-search" />
        {notes.length === 0 && <p className="text-sm text-slate-600" data-testid="empty-evidence-notes">No everyday learning notes saved yet. You can record an excursion, a project or something your child learned using the form above.</p>}
        {notes.length > 0 && notes.filter(n => !q || [n.title, n.notes, n.learning_area].join(" ").toLowerCase().includes(q.toLowerCase())).length === 0 && <p className="text-sm text-slate-600" data-testid="empty-evidence-search">No notes match that search. Try a different word or clear the search box.</p>}
        <ul className="space-y-2">
          {notes.filter(n => !q || [n.title, n.notes, n.learning_area].join(" ").toLowerCase().includes(q.toLowerCase())).map(n => (
            <li key={n.id} className="rounded-lg border border-slate-200 p-3 text-sm flex justify-between gap-3" data-testid={`note-${n.id}`}>
              <div><p className="font-semibold">{n.title}</p><p className="text-xs text-slate-500">{students.find(s => s.id === n.student_id)?.name} · {n.occurred_on}{n.learning_area ? ` · ${n.learning_area}` : ""}</p>{n.notes && <p className="mt-1 whitespace-pre-wrap text-slate-700">{n.notes}</p>}</div>
              <button onClick={async () => { if (window.confirm("Delete this evidence?")) { await api.delete(`/evidence-notes/${n.id}`).catch(() => {}); loadNotes(); } }} className="text-xs text-rose-700 underline self-start">Delete</button>
            </li>
          ))}
          {notes.length === 0 && <li className="text-sm text-slate-600">No extra evidence notes yet. Try recording a project, an excursion or something your child learned in everyday life using the form above.</li>}
          {notes.length > 0 && !notes.some(n => !q || [n.title, n.notes, n.learning_area].join(" ").toLowerCase().includes(q.toLowerCase())) && <li className="text-sm text-slate-600">No notes match your search. Try another word or clear the search field.</li>}
        </ul>
      </section>

      {openId && <ReviewModal submissionId={openId} readOnly onClose={() => setOpenId(null)} />}
    </div>
  );
}
