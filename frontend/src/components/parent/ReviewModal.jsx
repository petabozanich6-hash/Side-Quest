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
        const existing = {};
        (data.outcome_mappings || []).forEach(m => { existing[m.code] = m.accepted ? "achieved" : "not_yet"; });
        const initial = {};
        codes.forEach(c => { initial[c] = existing[c] || "achieved"; });
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

  const mappings = (forceNone) => codes.map(code => ({
    code,
    learning_area: sub.lesson?.learning_area,
    accepted: forceNone ? false : marks[code] === "achieved",
    status: !forceNone && marks[code] === "achieved" ? "achieved" : "not_yet",
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
                <li key={code} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3">
                  <div className="text-sm"><span className="font-mono text-xs font-bold">{code}</span>{descs[code] ? <span className="text-slate-600"> · {descs[code]}</span> : null}</div>
                  <div className="flex shrink-0 rounded-full border border-slate-300 overflow-hidden text-xs font-semibold">
                    <button disabled={readOnly} onClick={() => setMarks({ ...marks, [code]: "achieved" })} className={`px-3 py-1 ${marks[code] === "achieved" ? "bg-emerald-600 text-white" : "bg-white text-slate-600"}`} data-testid={`achieved-${code}`}>Achieved</button>
                    <button disabled={readOnly} onClick={() => setMarks({ ...marks, [code]: "not_yet" })} className={`px-3 py-1 ${marks[code] === "not_yet" ? "bg-amber-600 text-white" : "bg-white text-slate-600"}`} data-testid={`notyet-${code}`}>Not yet</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!readOnly && <p className="text-xs text-slate-500 mt-2">Approving saves the outcomes marked Achieved. Returning to your child marks none as achieved.</p>}
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
