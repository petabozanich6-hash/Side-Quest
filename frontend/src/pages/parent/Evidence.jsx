import React, { useEffect, useState } from "react";
import { api, fileUrl } from "../../lib/api";
import { toast } from "sonner";
import { Sparkles, Loader2, FileText, Image as ImgIcon, Mic, Film } from "lucide-react";

const iconFor = (ct) => {
  if (!ct) return FileText;
  if (ct.startsWith("image/")) return ImgIcon;
  if (ct.startsWith("audio/")) return Mic;
  if (ct.startsWith("video/")) return Film;
  return FileText;
};

export default function EvidencePage() {
  const [submissions, setSubmissions] = useState([]);
  const [active, setActive] = useState(null);
  const [analysing, setAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [feedback, setFeedback] = useState({ feedback_text: "", status: "accepted", next_step: "" });

  const load = () => api.get("/submissions").then(r => setSubmissions(r.data));
  useEffect(() => { load(); }, []);

  const openSub = async (s) => {
    const { data } = await api.get(`/submissions/${s.id}`);
    setActive(data); setAnalysis(null);
    try {
      const a = await api.get(`/submissions/${s.id}/analysis`);
      setAnalysis(a.data);
    } catch {}
  };

  const runAnalysis = async () => {
    setAnalysing(true);
    try {
      const { data } = await api.post("/ai/analyse-submission", { submission_id: active.id });
      setAnalysis(data); toast.success("AI analysis ready — review before trusting");
    } catch (err) { toast.error(err.response?.data?.detail || "Analysis failed"); }
    finally { setAnalysing(false); }
  };

  const giveFeedback = async () => {
    if (!feedback.feedback_text.trim()) { toast.error("Add feedback text"); return; }
    try {
      await api.post(`/submissions/${active.id}/feedback`, { ...feedback, submission_id: active.id });
      toast.success("Feedback saved");
      setActive(null); setFeedback({ feedback_text: "", status: "accepted", next_step: "" });
      load();
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="evidence-page">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900">Evidence Portfolio</h1>
        <p className="text-sm text-slate-600 mt-1">Review submissions, run AI analysis as a suggestion, and provide feedback.</p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="p-3">Student</th><th className="p-3">Lesson</th><th className="p-3">Submitted</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {submissions.map(s => (
              <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`sub-${s.id}`}>
                <td className="p-3 font-medium">{s.student?.name}</td>
                <td className="p-3">{s.lesson?.title}</td>
                <td className="p-3 text-xs text-slate-500">{new Date(s.submitted_at).toLocaleString()}</td>
                <td className="p-3"><span className={`pill pill-${(s.status||"submitted").replace(/_/g,'-')}`}>{s.status}</span></td>
                <td className="p-3 text-right"><button onClick={()=>openSub(s)} className="rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold" data-testid={`review-${s.id}`}>Review</button></td>
              </tr>
            ))}
            {submissions.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-sm text-slate-500">No submissions yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {active && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=>setActive(null)}>
          <div onClick={e=>e.stopPropagation()} className="w-full max-w-4xl rounded-2xl bg-white p-8 my-8" data-testid="review-modal">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="text-xs font-mono text-slate-500">{active.lesson?.stage} · {active.lesson?.learning_area}</div>
                <h2 className="font-display text-2xl font-bold text-slate-900">{active.lesson?.title}</h2>
                <p className="text-sm text-slate-500 mt-1">By {active.student?.name} · {new Date(active.submitted_at).toLocaleString()}</p>
              </div>
              <button onClick={()=>setActive(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <section className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Student response</div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm whitespace-pre-wrap">{active.response_text || "—"}</div>
            </section>
            {active.reflection && <section className="mb-5"><div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Reflection</div><div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm whitespace-pre-wrap">{active.reflection}</div></section>}

            {active.files?.length > 0 && (
              <section className="mb-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Uploaded evidence ({active.files.length})</div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {active.files.map(f => {
                    const Icon = iconFor(f.content_type);
                    const isImg = f.content_type?.startsWith("image/");
                    return (
                      <a key={f.id} href={fileUrl(f.id)} target="_blank" rel="noreferrer" className="group rounded-lg border border-slate-200 overflow-hidden" data-testid={`file-${f.id}`}>
                        {isImg ? <img src={fileUrl(f.id)} alt={f.original_filename} className="w-full h-24 object-cover"/> : <div className="h-24 bg-slate-50 grid place-items-center"><Icon size={24} className="text-slate-500"/></div>}
                        <div className="p-2 text-[11px] truncate">{f.original_filename}</div>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="mb-5 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-indigo-900 flex items-center gap-1.5"><Sparkles size={14}/> AI evidence analysis</div>
                <button onClick={runAnalysis} disabled={analysing} className="rounded-full bg-indigo-600 text-white px-3 py-1 text-xs font-semibold disabled:opacity-50" data-testid="run-analysis">
                  {analysing ? <><Loader2 size={12} className="animate-spin inline mr-1"/>Analysing…</> : (analysis ? "Re-run" : "Run analysis")}
                </button>
              </div>
              {analysis ? (
                <div className="text-sm space-y-2">
                  <div><strong>Summary:</strong> {analysis.summary}</div>
                  <div><strong>Appears demonstrated:</strong> {(analysis.demonstrated||[]).join(", ") || "—"}</div>
                  <div><strong>Possible outcomes:</strong>
                    <ul className="list-disc pl-5">{(analysis.possible_outcomes||[]).map((o,i)=><li key={i}><span className="font-mono text-xs">{o.code||"(no code)"}</span> · {o.description} <em className="text-xs text-indigo-700">({o.confidence})</em></li>)}</ul>
                  </div>
                  <div><strong>Suggested feedback:</strong> {analysis.suggested_feedback}</div>
                  <div><strong>Suggested next step:</strong> {analysis.suggested_next_step}</div>
                  <div className="text-xs text-indigo-800 italic">{analysis.parent_review_note || "AI suggestion for parent review, not an official assessment."}</div>
                </div>
              ) : <p className="text-sm text-indigo-800">Click "Run analysis" to generate a parent-review-only suggestion.</p>}
            </section>

            <section className="mb-5">
              <div className="font-display text-base font-semibold mb-2">Your feedback</div>
              <textarea rows={3} value={feedback.feedback_text} onChange={e=>setFeedback({...feedback, feedback_text: e.target.value})} placeholder="Specific, kind, constructive feedback for the child" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="feedback-text"/>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</label>
                  <select value={feedback.status} onChange={e=>setFeedback({...feedback, status: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="feedback-status">
                    <option value="accepted">Accepted</option>
                    <option value="demonstrated">Demonstrated</option>
                    <option value="needs_revision">Needs revision</option>
                    <option value="needs_more_practice">Needs more practice</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Next step</label>
                  <input value={feedback.next_step} onChange={e=>setFeedback({...feedback, next_step: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="feedback-next"/>
                </div>
              </div>
              <button onClick={giveFeedback} className="mt-4 rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-semibold" data-testid="save-feedback">Save feedback</button>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
