import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
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
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(p.student.name)} learning portfolio</title></head>
  <body style="font-family:Georgia,serif;max-width:720px;margin:32px auto;padding:0 20px;color:#111">
  <h1 style="font-size:24px;margin:0">Learning portfolio: ${esc(p.student.name)}</h1>
  <p style="color:#555;font-size:12px">Generated ${esc(new Date(p.generated_at).toLocaleDateString("en-AU"))} from parent-approved work in Side Quest. ${p.items.length} of ${p.total} entries.</p>
  ${p.limited ? `<p style="background:#fff7e0;border:1px solid #e6c96b;padding:8px;font-size:12px">Free preview: this sample shows 1 entry. A Family Membership exports the full portfolio.</p>` : ""}
  ${rows || "<p>No approved work yet.</p>"}
  <p style="margin-top:28px;font-size:11px;color:#666">This is a record of learning kept by the parent. It is not an official assessment, and Side Quest does not provide legal or compliance advice. Check your own state or territory's home education requirements.</p>
  </body></html>`;
}

const APPROVED = ["accepted", "demonstrated"];

export default function EvidencePage() {
  const [submissions, setSubmissions] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [students, setStudents] = useState([]);
  const exportFor = async (sid) => {
    const w = window.open("", "_blank");
    if (!w) { toast.error("Allow pop-ups to open the portfolio"); return; }
    try {
      const { data } = await api.get("/portfolio", { params: { student_id: sid } });
      w.document.write(portfolioHtml(data)); w.document.close(); w.focus(); w.print();
    } catch (e) { w.close(); toast.error(e.response?.data?.detail || "Could not build the portfolio"); }
  };

  const load = () => api.get("/submissions").then(r => setSubmissions((r.data || []).filter(s => APPROVED.includes(s.status))));
  useEffect(() => { load(); api.get("/students").then(r => setStudents(r.data)).catch(() => {}); }, []);

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6" data-testid="evidence-page">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900">Evidence Portfolio</h1>
        <p className="text-sm text-slate-600 mt-1">Approved work and the outcomes it shows. Work waiting for you is on the dashboard.</p>
      </header>

      {students.length > 0 && (
        <div className="flex flex-wrap gap-2" data-testid="export-buttons">
          {students.map(st => <button key={st.id} onClick={() => exportFor(st.id)} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold" data-testid={`export-${st.id}`}>Print portfolio: {st.name}</button>)}
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
            {submissions.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-sm text-slate-500">No approved work yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {openId && <ReviewModal submissionId={openId} readOnly onClose={() => setOpenId(null)} />}
    </div>
  );
}
