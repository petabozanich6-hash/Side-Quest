import React, { useEffect, useState } from "react";
import { api, fileUrl } from "../../lib/api";
import { toast } from "sonner";
import { FileText, Image as ImgIcon, Mic, Film, CheckCircle2, RotateCcw } from "lucide-react";

const iconFor = (ct) => {
  if (!ct) return FileText;
  if (ct.startsWith("image/")) return ImgIcon;
  if (ct.startsWith("audio/")) return Mic;
  if (ct.startsWith("video/")) return Film;
  return FileText;
};

export default function ReviewModal({ submissionId, onClose, onDone, readOnly = false }) {
  const [sub, setSub] = useState(null);
  const [descs, setDescs] = useState({});
  const [marks, setMarks] = useState({});
  const [comment, setComment] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get(`/submissions/${submissionId}`);
        if (!alive) return;
        setSub(data);
        const codes = data.lesson?.outcome_codes || [];
        // Nothing is pre-marked: the parent judges each outcome. Older reviews only stored accepted true/false.
        const defSupport = data.needs_help ? "significant" : ({ yellow: "some", amber: "some", red: "significant" })[data.support_level] || "independent";
        const existing = {};
        (data.outcome_mappings || []).forEach(m => { existing[m.code] = { mark: m.mark || (m.accepted ? "shown" : "not_yet"), support: m.support || defSupport }; });
        const initial = {};
        codes.forEach(c => { initial[c] = existing[c] || { mark: "", support: defSupport }; });
        setMarks(initial);
        setComment(data.parent_feedback || "");
        setNextStep(data.next_step || "");
        try {
          const r = await api.get("/curriculum/outcomes", { params: { stage: data.lesson?.stage, learning_area: data.lesson?.learning_area } });
          const map = {};
          (r.data || []).forEach(o => { map[o.code] = o.description || o.text || o.title || ""; });
          if (alive) setDescs(map);
        } catch {}
      } catch { toast.error("Could not open this submission"); onClose(); }
    })();
    return () => { alive = false; };
  }, [submissionId]); // eslint-disable-line

  if (!sub) return null;
  const codes = sub.lesson?.outcome_codes || [];

  const mark = (code) => marks[code]?.mark || "";
  const setMark = (code, patch) => setMarks({ ...marks, [code]: { ...(marks[code] || {}), ...patch } });
  // "shown" in this piece of work is evidence; the outcome itself only becomes Achieved when confirmed in the Outcome tracker.
  const mappings = (forceNone) => codes.map(code => ({
    code,
    learning_area: sub.lesson?.learning_area,
    mark: forceNone ? "not_yet" : mark(code) || undefined,
    support: marks[code]?.support || undefined,
    accepted: !forceNone && mark(code) === "shown",
    status: !forceNone && mark(code) === "shown" ? "achieved" : "not_yet",
  }));

  const send = async (status, forceNone) => {
    setBusy(true);
    try {
      await api.post(`/submissions/${sub.id}/feedback`, {
        submission_id: sub.id,
        feedback_text: comment.trim() || "Great work!",
        status,
        next_step: nextStep || null,
        outcome_mappings: mappings(forceNone),
      });
      toast.success(status === "demonstrated" ? "Approved and added to Evidence" : "Returned to your child with your comment");
      onDone && onDone();
      onClose();
    } catch { toast.error("Something went wrong, please try again"); }
    finally { setBusy(false); }
  };

  const approve = () => send("demonstrated", false);
  const sendBack = () => {
    if (!comment.trim()) { toast.error("Add a comment on how to improve before returning"); return; }
    send("needs_revision", true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-4xl rounded-2xl bg-white p-8 my-8" data-testid="review-modal">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="text-xs font-mono text-slate-500">{sub.lesson?.stage} · {sub.lesson?.learning_area}</div>
            <h2 className="font-display text-2xl font-bold text-slate-900">{sub.lesson?.title}</h2>
            <p className="text-sm text-slate-500 mt-1">By {sub.student?.name} · {new Date(sub.submitted_at).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        {sub.needs_help && <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">This child asked for help with this one.</div>}

        <section className="mb-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Student response</div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm whitespace-pre-wrap">{sub.response_text || "—"}</div>
        </section>
        {(sub.lesson?.answer_key || (sub.lesson?.questions || []).some(q => q.answer_key)) && (
          <section className="mb-5" data-testid="answer-key">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Your answer key</div>
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm whitespace-pre-wrap">
              {(sub.lesson.questions || []).map((q, i) => q.answer_key ? `${i + 1}. ${q.answer_key}\n` : "").join("")}{sub.lesson.answer_key || ""}
            </div>
          </section>
        )}
        {sub.reflection && <section className="mb-5"><div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Reflection</div><div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm whitespace-pre-wrap">{sub.reflection}</div></section>}

        {sub.files?.length > 0 && (
          <section className="mb-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Uploaded evidence ({sub.files.length})</div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {sub.files.map(f => {
                const Icon = iconFor(f.content_type);
                const isImg = f.content_type?.startsWith("image/");
                return (
                  <a key={f.id} href={fileUrl(f.id)} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 overflow-hidden">
                    {isImg ? <img src={fileUrl(f.id)} alt={f.original_filename} className="w-full h-24 object-cover"/> : <div className="h-24 bg-slate-50 grid place-items-center"><Icon size={24} className="text-slate-500"/></div>}
                    <div className="p-2 text-[11px] truncate">{f.original_filename}</div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        <section className="mb-5">
          <div className="font-display text-base font-semibold mb-2">Learning outcomes</div>
          {codes.length === 0 ? <p className="text-sm text-slate-500">This lesson has no linked outcomes.</p> : (
            <ul className="space-y-2">
              {codes.map(code => (
                <li key={code} className="rounded-lg border border-slate-200 p-3 space-y-2" data-testid={`outcome-mark-${code}`}>
                  <div className="text-sm"><span className="font-mono text-xs font-bold">{code}</span>{descs[code] ? <span className="text-slate-600"> · {descs[code]}</span> : null}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex shrink-0 rounded-full border border-slate-300 overflow-hidden text-xs font-semibold" role="group" aria-label={`What this work shows for ${code}`}>
                      {[["shown", "Shown it", "bg-emerald-600"], ["practising", "Practising", "bg-sky-600"], ["not_yet", "Not yet", "bg-amber-600"]].map(([k, l, on]) => (
                        <button key={k} type="button" disabled={readOnly} aria-pressed={mark(code) === k} onClick={() => setMark(code, { mark: k })} className={`px-3 py-1 ${mark(code) === k ? `${on} text-white` : "bg-white text-slate-600"}`} data-testid={`mark-${k}-${code}`}>{l}</button>
                      ))}
                    </div>
                    <select disabled={readOnly} value={marks[code]?.support || "independent"} onChange={e => setMark(code, { support: e.target.value })} className="rounded-full border border-slate-300 px-2 py-1 text-xs" aria-label={`Help needed for ${code}`} data-testid={`support-${code}`}>
                      <option value="independent">Independently</option>
                      <option value="some">With some help</option>
                      <option value="significant">With a lot of help</option>
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!readOnly && codes.length > 0 && <p className="text-xs text-slate-500 mt-2">Your judgement of this piece of work feeds the <b>Outcome tracker</b>. One piece of work never makes an outcome Achieved on its own; you confirm that in the tracker once there's enough evidence. Outcomes you leave unmarked count as practised.</p>}
        </section>

        <section className="mb-2">
          <div className="font-display text-base font-semibold mb-2">Your comment</div>
          <textarea rows={3} disabled={readOnly} value={comment} onChange={e => setComment(e.target.value)} placeholder="Kind, specific feedback. If you return the work, explain how to improve it." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="feedback-text"/>
          <label className="mt-3 block text-xs font-semibold uppercase tracking-wider text-slate-500">Next step (optional)</label>
          <input disabled={readOnly} value={nextStep} onChange={e => setNextStep(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="feedback-next"/>
        </section>

        {!readOnly && (
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={approve} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-emerald-700 text-white px-5 py-2 text-sm font-semibold disabled:opacity-50" data-testid="approve-btn"><CheckCircle2 size={16}/> Approve</button>
            <button onClick={sendBack} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-amber-600 text-white px-5 py-2 text-sm font-semibold disabled:opacity-50" data-testid="return-btn"><RotateCcw size={16}/> Return to child</button>
          </div>
        )}
      </div>
    </div>
  );
}
