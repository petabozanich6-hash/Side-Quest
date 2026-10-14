import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ReviewModal from "../../components/parent/ReviewModal";

const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

function portfolioHtml(p) {
  const rows = p.items.map((i) => `
    <section style="break-inside:avoid;border-top:1px solid #ccc;margin-top:18px;padding-top:12px">
      <h2 style="font-size:16px;margin:0">${esc(i.title)}</h2>
      <p style="color:#555;font-size:12px;margin:2px 0 8px">${esc([i.learning_area, i.year_level].filter(Boolean).join(" · "))} · Approved ${i.reviewed_at ? esc(new Date(i.reviewed_at).toLocaleDateString("en-AU")) : ""}</p>
      ${i.response_text ? `<h3 style="font-size:12px;margin:8px 0 2px">Work</h3><p style="white-space:pre-wrap;font-size:13px;margin:0">${esc(i.response_text)}</p>` : ""}
      ${i.reflection ? `<h3 style="font-size:12px;margin:8px 0 2px">Reflection</h3><p style="white-space:pre-wrap;font-size:13px;margin:0">${esc(i.reflection)}</p>` : ""}
      ${i.parent_feedback ? `<h3 style="font-size:12px;margin:8px 0 2px">Parent comment</h3><p style="white-space:pre-wrap;font-size:13px;margin:0">${esc(i.parent_feedback)}</p>` : ""}
      ${i.next_step ? `<p style="font-size:13px;margin:6px 0 0"><strong>Next step:</strong> ${esc(i.next_step)}</p>` : ""}
      ${i.files.length ? `<p style="font-size:12px;color:#555;margin:6px 0 0">Attached files: ${i.files.map((f) => esc(f.name)).join(", ")}</p>` : ""}
    </section>`).join("");
  const noteRows = (p.notes || []).map((n) => `
    <section style="break-inside:avoid;border-top:1px solid #ccc;margin-top:18px;padding-top:12px">
      <h2 style="font-size:16px;margin:0">${esc(n.title)}</h2>
      <p style="color:#555;font-size:12px;margin:2px 0 8px">${esc([n.learning_area, n.occurred_on].filter(Boolean).join(" · "))} · Recorded by parent</p>
      ${n.notes ? `<p style="white-space:pre-wrap;font-size:13px;margin:0">${esc(n.notes)}</p>` : ""}
      ${n.files.length ? `<p style="font-size:12px;color:#555;margin:6px 0 0">Attached files: ${n.files.map((f) => esc(f.name)).join(", ")}</p>` : ""}
    </section>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(p.student.name)} learning portfolio</title></head>
  <body style="font-family:Georgia,serif;max-width:720px;margin:32px auto;padding:0 20px;color:#111">
  <h1 style="font-size:24px;margin:0">Learning portfolio: ${esc(p.student.name)}</h1>
  <p style="color:#555;font-size:12px">Generated ${esc(new Date(p.generated_at).toLocaleDateString("en-AU"))} from parent-approved work in Side Quest. ${p.items.length + (p.notes || []).length} of ${p.total} entries${p.from || p.to ? ` (${esc(p.from || "start")} to ${esc(p.to || "now")})` : ""}.</p>
  ${p.limited ? `<p style="background:#fff7e0;border:1px solid #e6c96b;padding:8px;font-size:12px">Free preview: this sample shows 1 entry. A Family Membership exports the full portfolio.</p>` : ""}
  ${rows + noteRows || "<p>No approved work yet.</p>"}
  <p style="margin-top:28px;font-size:11px;color:#666">This is a record of learning kept by the parent. It is not an official assessment, and Side Quest does not provide legal or compliance advice. Check your own state or territory's home education requirements.</p>
  </body></html>`;
}

const APPROVED = ["accepted", "demonstrated"];
const csvCell = (v) => { let t = String(v ?? "").replace(/\r?\n/g, " "); if (/^[=+\-@\t]/.test(t)) t = "'" + t; return `"${t.replace(/"/g, '""')}"`; };
export function portfolioCsv(p) {
  const head = ["Type", "Date", "Title", "Subject", "Year level", "Outcome", "Work", "Parent comment", "Next step"];
  const lines = [head.map(csvCell).join(",")];
  (p.items || []).forEach((i) => lines.push(["Lesson", (i.reviewed_at || "").slice(0, 10), i.title, i.learning_area, i.year_level, i.status === "demonstrated" ? "Skill shown" : "Completed", i.response_text, i.parent_feedback, i.next_step].map(csvCell).join(",")));
  (p.notes || []).forEach((n) => lines.push(["Parent evidence", n.occurred_on, n.title, n.learning_area, "", "", n.notes, "", ""].map(csvCell).join(",")));
  return lines.join("\r\n");
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
  const csvFor = async (sid, name) => {
    try {
      const { data } = await api.get("/portfolio", { params: { student_id: sid, from: range.from || undefined, to: range.to || undefined } });
      const blob = new Blob(["\ufeff" + portfolioCsv(data)], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = `${name.replace(/[^\w-]+/g, "_")}-portfolio.csv`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } catch (e) { toast.error(e.response?.data?.detail || "Could not build the export"); }
  };
  const exportFor = async (sid) => {
    const w = window.open("", "_blank");
    if (!w) { toast.error("Allow pop-ups to open the portfolio"); return; }
    try {
      const { data } = await api.get("/portfolio", { params: { student_id: sid, from: range.from || undefined, to: range.to || undefined } });
      w.document.write(portfolioHtml(data)); w.document.close(); w.focus(); w.print();
    } catch (e) { w.close(); toast.error(e.response?.data?.detail || "Could not build the portfolio"); }
  };

  const load = () => api.get("/submissions").then(r => setSubmissions((r.data || []).filter(s => APPROVED.includes(s.status))));
  useEffect(() => { load(); loadNotes(); api.get("/students").then(r => setStudents(r.data)).catch(() => {}); }, []);

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6" data-testid="evidence-page">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900">Evidence Backpack</h1>
        <p className="text-sm text-slate-600 mt-1">A home for your family’s learning portfolio: parent-approved lessons, notes from everyday learning and progress records. Review work waiting for you on the dashboard.</p>
      </header>

      {students.length > 0 && (
        <div className="space-y-2" data-testid="export-buttons">
          <div className="flex flex-wrap items-end gap-3 text-xs font-semibold text-slate-600">
            <label>From<input type="date" value={range.from} onChange={e => setRange({ ...range, from: e.target.value })} className="block mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" data-testid="range-from" /></label>
            <label>To<input type="date" value={range.to} onChange={e => setRange({ ...range, to: e.target.value })} className="block mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" data-testid="range-to" /></label>
            <span className="text-slate-500 font-normal">Leave blank for everything.</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {students.map(st => <button key={st.id} onClick={() => exportFor(st.id)} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold" data-testid={`export-${st.id}`}>Print portfolio: {st.name}</button>)}
            {students.map(st => <button key={`c${st.id}`} onClick={() => csvFor(st.id, st.name)} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold" data-testid={`csv-${st.id}`}>Download CSV: {st.name}</button>)}
          </div>
        </div>
      )}

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
