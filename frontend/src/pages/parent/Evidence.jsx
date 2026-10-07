import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import ReviewModal from "../../components/parent/ReviewModal";

const APPROVED = ["accepted", "demonstrated"];

export default function EvidencePage() {
  const [submissions, setSubmissions] = useState([]);
  const [openId, setOpenId] = useState(null);

  const load = () => api.get("/submissions").then(r => setSubmissions((r.data || []).filter(s => APPROVED.includes(s.status))));
  useEffect(() => { load(); }, []);

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="evidence-page">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900">Evidence Portfolio</h1>
        <p className="text-sm text-slate-600 mt-1">Approved work and the outcomes it shows. Work waiting for you is on the dashboard.</p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
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
