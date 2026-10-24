import React, { useEffect, useState } from "react";
import { api, fileUrl } from "../../lib/api";
import { toast } from "sonner";
import { FileText, Image as ImgIcon, Mic, Film, CheckCircle2, RotateCcw, ChevronDown } from "lucide-react";

const iconFor = (ct) => {
  if (!ct) return FileText;
  if (ct.startsWith("image/")) return ImgIcon;
  if (ct.startsWith("audio/")) return Mic;
  if (ct.startsWith("video/")) return Film;
  return FileText;
};

// What the lesson player recorded when the child checked a practice answer (`fbs` in their saved work).
// Questions in "Show what you know" are never auto-marked, so they have no check.
function checkOf(state) {
  const fb = state?.fb;
  if (!fb) return null;
  if (fb.reveal) return { tone: "amber", text: "Looked at the answer" };
  if (fb.result === "correct") return { tone: "green", text: (state.attempts || 1) > 1 ? `Correct after ${state.attempts} tries` : "Correct first try" };
  if (fb.result === "incorrect") return { tone: "amber", text: "Not quite right" };
  return null; // "recorded": a written answer the parent judges
}
const TONE = { green: "bg-emerald-100 text-emerald-800", amber: "bg-amber-100 text-amber-900", slate: "bg-slate-100 text-slate-600" };
const needsLook = (q) => !q.answer || q.check?.tone === "amber";

export default function ReviewModal({ submissionId, onClose, onDone, readOnly = false }) {
  const [sub, setSub] = useState(null);
  const [marks, setMarks] = useState({});
  const [comment, setComment] = useState("");
  const [flags, setFlags] = useState({});
  const [nextStep, setNextStep] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");

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
        (data.outcome_mappings || []).forEach(m => { existing[m.code] = { mark: m.mark || "", support: m.support || defSupport, comprehensive: m.comprehensive === true }; });
        const initial = {};
        codes.forEach(c => { initial[c] = existing[c] || { mark: "", support: defSupport }; });
        setMarks(initial);
        setComment(data.parent_feedback || "");
        setNextStep(data.next_step || "");
        setFlags(Object.fromEntries((data.review_flags || []).map(f => [f.key, f.comment || ""])));
      } catch { toast.error("Could not open this submission"); onClose(); }
    })();
    return () => { alive = false; };
  }, [submissionId]); // eslint-disable-line

  if (!sub) return null;
  const codes = sub.lesson?.outcome_codes || [];
  const saved = sub.review_answers || {};
  const fbs = saved.fbs || {};
  const display = v => Array.isArray(v) ? v.join(", ") : String(v ?? "").trim();
  const firstName = (sub.student?.name || "your child").split(" ")[0];
  // Older library lessons use a different player; only show jump-links for the modern editable questions.
  const modernPlayer = !!(sub.lesson?.builder || sub.lesson?.source === "parent" || sub.lesson?.source === "ai");
  const sections = modernPlayer ? [
    { title: "Practice", items: (Array.isArray(sub.lesson?.guided_practice) ? sub.lesson.guided_practice : []).map((q, i) => ({
      key: "guided:" + i, label: "Practice question " + (i + 1), prompt: q.prompt,
      answer: display(saved.guided?.[i]), expected: display(q.answer), check: checkOf(fbs["g" + i]),
    })) },
    ...(Array.isArray(sub.lesson?.activities) ? sub.lesson.activities : []).map((a, i) => ({
      title: a.title || "Activity " + (i + 1),
      done: !!saved.checks?.[i],
      items: (Array.isArray(a.tasks) ? a.tasks : []).map((q, j) => ({
        key: "task:" + i + ":" + j, label: (a.title || "Activity " + (i + 1)) + " · task " + (j + 1), prompt: q.prompt,
        answer: display(saved.tasks?.[i + "." + j]), expected: display(q.answer), check: checkOf(fbs["t" + i + "." + j]),
      })),
    })),
    { title: "Show what you know", items: (Array.isArray(sub.lesson?.questions) ? sub.lesson.questions : []).map((q, i) => ({
      key: "question:" + i, label: "Show what you know · question " + (i + 1), prompt: q.prompt,
      answer: display(saved.answers?.[i]), expected: display(q.answer_key), check: null,
    })) },
  ].filter(s => s.items.length) : [];
  const reviewItems = sections.flatMap(s => s.items);
  const selectedFlags = Object.entries(flags).map(([key, comment]) => ({ key, comment }));
  const isFlagged = key => Object.prototype.hasOwnProperty.call(flags, key);
  const toggleFlag = key => setFlags(current => {
    const next = { ...current };
    if (Object.prototype.hasOwnProperty.call(next, key)) delete next[key];
    else next[key] = "";
    return next;
  });
  const shownItem = q => filter === "all" || (filter === "look" ? needsLook(q) : isFlagged(q.key));
  const counts = {
    correct: reviewItems.filter(q => q.check?.tone === "green").length,
    checked: reviewItems.filter(q => q.check).length,
    blank: reviewItems.filter(q => !q.answer).length,
    look: reviewItems.filter(needsLook).length,
  };

  const mark = (code) => marks[code]?.mark || "";
  const setMark = (code, patch) => setMarks({ ...marks, [code]: { ...(marks[code] || {}), ...patch } });
  // "shown" in this piece of work is evidence; the outcome itself only becomes Achieved when confirmed in the Outcome tracker.
  const mappings = (forceNone) => codes.map(code => ({
    code,
    learning_area: sub.lesson?.learning_area,
    mark: forceNone ? "not_yet" : mark(code) || undefined,
    support: marks[code]?.support || undefined,
    // Only meaningful with "shown": one qualifying comprehensive assessment can stand in for two separate days.
    comprehensive: !forceNone && mark(code) === "shown" && marks[code]?.comprehensive === true,
    accepted: !forceNone && mark(code) === "shown",
    status: !forceNone && mark(code) === "shown" ? "shown" : "not_yet",
  }));

  const send = async (status, forceNone) => {
    setBusy(true);
    try {
      await api.post(`/submissions/${sub.id}/feedback`, {
        submission_id: sub.id,
        feedback_text: comment.trim() || (status === "needs_revision" ? "Please revisit the flagged questions." : "Great work!"),
        review_flags: status === "needs_revision" ? selectedFlags : [],
        status,
        next_step: nextStep || null,
        outcome_mappings: mappings(forceNone),
      });
      toast.success(status === "demonstrated" ? "Approved and added to Evidence" : "Returned to your child with your comment");
      onDone && onDone();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.detail || "The review could not be confirmed. Refresh to check whether it saved before trying again.");
    }
    finally { setBusy(false); }
  };

  const approve = () => send("demonstrated", false);
  const sendBack = () => {
    if (!comment.trim() && !selectedFlags.length) { toast.error("Flag a question or add a comment before returning"); return; }
    send("needs_revision", true);
  };

  const label = "text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1";
  const fullKey = (sub.lesson?.answer_key || (sub.lesson?.questions || []).some(q => q.answer_key))
    ? (sub.lesson.questions || []).map((q, i) => q.answer_key ? `${i + 1}. ${q.answer_key}\n` : "").join("") + (sub.lesson.answer_key || "") : "";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-4xl rounded-2xl bg-white my-4 sm:my-8 flex flex-col" data-testid="review-modal">
        <header className="sticky top-0 z-10 rounded-t-2xl bg-white border-b border-slate-200 px-4 sm:px-8 pt-5 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-mono text-slate-500">{sub.lesson?.stage} · {sub.lesson?.learning_area}</div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">{sub.lesson?.title}</h2>
              <p className="text-sm text-slate-500 mt-1">By {sub.student?.name} · {new Date(sub.submitted_at).toLocaleString()}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1" aria-label="Close review">✕</button>
          </div>
          {reviewItems.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold" data-testid="review-summary">
              {counts.checked > 0 && <span className={"rounded-full px-3 py-1 " + TONE.green}>{counts.correct} of {counts.checked} checked answers correct</span>}
              {counts.blank > 0 && <span className={"rounded-full px-3 py-1 " + TONE.amber}>{counts.blank} not answered</span>}
              <span className={"rounded-full px-3 py-1 " + TONE.slate}>{reviewItems.length} questions</span>
            </div>
          )}
        </header>

        <div className="px-4 sm:px-8 py-5">
          {sub.needs_help && <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">{firstName} asked for help with this one.</div>}

          {reviewItems.length > 0 ? (
            <section className="mb-6" data-testid="question-review">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="font-display text-lg font-semibold">{firstName}'s answers</h3>
                <div className="flex rounded-full border border-slate-300 overflow-hidden text-xs font-semibold" role="group" aria-label="Show questions">
                  {[["all", `All (${reviewItems.length})`], ["look", `Wrong or blank (${counts.look})`], ["flagged", `Flagged (${selectedFlags.length})`]].map(([k, l]) => (
                    <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}
                      className={"px-3 py-1 " + (filter === k ? "bg-slate-800 text-white" : "bg-white text-slate-600")} data-testid={"filter-" + k}>{l}</button>
                  ))}
                </div>
              </div>
              {!readOnly && <p className="text-sm text-slate-600 mb-3">Compare each answer with yours. Tick <b>Ask to redo</b> on any question {firstName} should try again; their other answers stay saved.</p>}
              <div className="space-y-5">
                {sections.map(s => {
                  const items = s.items.filter(shownItem);
                  if (!items.length) return null;
                  return <div key={s.title}>
                    <div className="flex items-baseline gap-2 mb-2">
                      <h4 className="text-sm font-bold text-slate-800">{s.title}</h4>
                      {s.done !== undefined && <span className="text-xs text-slate-500">{s.done ? "Marked as finished" : "Not marked as finished"}</span>}
                    </div>
                    <div className="space-y-3">
                      {items.map(q => {
                        const selected = isFlagged(q.key);
                        return <div key={q.key} className={"rounded-xl border p-3 space-y-2 " + (selected ? "border-amber-400 bg-amber-50" : "border-slate-200 bg-white")} data-testid={"review-item-" + q.key}>
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="min-w-0 flex-1 text-sm text-slate-800 whitespace-pre-wrap"><span className="sr-only">{q.label}: </span>{q.prompt || "Question"}</p>
                            <div className="flex items-center gap-2">
                              {!q.answer ? <span className={"rounded-full px-2 py-0.5 text-xs font-semibold " + TONE.amber}>No answer</span>
                                : q.check && <span className={"rounded-full px-2 py-0.5 text-xs font-semibold " + TONE[q.check.tone]} data-testid={"check-" + q.key}>{q.check.text}</span>}
                              {!readOnly && <label className={"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold cursor-pointer " + (selected ? "border-amber-500 bg-amber-100 text-amber-900" : "border-slate-300 text-slate-600")}>
                                <input type="checkbox" checked={selected} onChange={() => toggleFlag(q.key)} className="h-3.5 w-3.5" aria-label={"Ask to redo " + q.label} data-testid={"flag-" + q.key}/>
                                Ask to redo
                              </label>}
                            </div>
                          </div>
                          {(q.answer || q.expected) && <div className="grid gap-2 sm:grid-cols-2 text-sm">
                            <div className="rounded-lg bg-slate-50 p-2 whitespace-pre-wrap"><div className="text-xs font-semibold text-slate-500">{firstName}'s answer</div>{q.answer || "—"}</div>
                            {q.expected && <div className="rounded-lg bg-amber-50 p-2 whitespace-pre-wrap"><div className="text-xs font-semibold text-amber-800">Your answer key</div>{q.expected}</div>}
                          </div>}
                          {selected && readOnly && flags[q.key] && <p className="text-xs text-amber-900"><b>Your note:</b> {flags[q.key]}</p>}
                          {selected && !readOnly && <label className="block text-xs font-semibold text-amber-900">
                            Note for {firstName} (optional)
                            <input type="text" maxLength={280} value={flags[q.key] || ""}
                              onChange={e => setFlags(current => ({ ...current, [q.key]: e.target.value }))}
                              placeholder="For example: Show how you reached your answer"
                              className="mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-normal text-slate-900"
                              data-testid={"flag-note-" + q.key} />
                          </label>}
                        </div>;
                      })}
                    </div>
                  </div>;
                })}
                {!reviewItems.some(shownItem) && <p className="text-sm text-slate-500" data-testid="filter-empty">{filter === "look" ? "Every question has an answer, and every auto-checked answer was right." : "No questions flagged yet."}</p>}
              </div>
              {sub.response_text && <details className="mt-4 text-sm"><summary className="cursor-pointer text-slate-600">Everything {firstName} handed in, as one page</summary><div className="mt-2 rounded-lg bg-slate-50 border border-slate-200 p-3 whitespace-pre-wrap">{sub.response_text}</div></details>}
              {fullKey && <details className="mt-2 text-sm" data-testid="answer-key"><summary className="cursor-pointer text-slate-600">Your full answer key</summary><div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 p-3 whitespace-pre-wrap">{fullKey}</div></details>}
            </section>
          ) : <>
            <section className="mb-5">
              <div className={label}>Student response</div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm whitespace-pre-wrap">{sub.response_text || "—"}</div>
            </section>
            {fullKey && (
              <section className="mb-5" data-testid="answer-key">
                <div className={label}>Your answer key</div>
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm whitespace-pre-wrap">{fullKey}</div>
              </section>
            )}
          </>}

          {sub.reflection && <section className="mb-5"><div className={label}>{firstName}'s reflection</div><div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm whitespace-pre-wrap">{sub.reflection}</div></section>}

          {sub.files?.length > 0 && (
            <section className="mb-5">
              <div className={label + " mb-2"}>Uploaded evidence ({sub.files.length})</div>
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
            <div className="font-display text-base font-semibold mb-2">Your comment</div>
            <textarea rows={3} disabled={readOnly} value={comment} onChange={e => setComment(e.target.value)} placeholder={`Kind, specific feedback for ${firstName}. If you return the work, explain how to improve it.`} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="feedback-text"/>
            <label className="mt-3 block text-xs font-semibold uppercase tracking-wider text-slate-500">Next step (optional)</label>
            <input disabled={readOnly} value={nextStep} onChange={e => setNextStep(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="feedback-next"/>
          </section>

          {codes.length > 0 && (
            <details className="mb-2 rounded-xl border border-slate-200 group" open={readOnly || codes.some(c => mark(c))}>
              <summary className="flex cursor-pointer items-center justify-between gap-2 p-3 font-display text-base font-semibold">
                <span>Learning outcomes ({codes.length}) <span className="font-sans text-xs font-normal text-slate-500">optional, for your Outcome tracker</span></span>
                <ChevronDown size={16} className="text-slate-500 transition-transform group-open:rotate-180"/>
              </summary>
              <div className="px-3 pb-3">
                <ul className="space-y-2">
                  {codes.map(code => (
                    <li key={code} className="rounded-lg border border-slate-200 p-3 space-y-2" data-testid={`outcome-mark-${code}`}>
                      <div className="text-sm"><span className="font-mono text-xs font-bold">{code}</span></div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex shrink-0 flex-wrap rounded-full border border-slate-300 overflow-hidden text-xs font-semibold" role="group" aria-label={`What this work shows for ${code}`}>
                          {[["shown", "Understanding shown", "bg-emerald-600"], ["practising", "Still practising", "bg-sky-600"], ["not_yet", "Needs another attempt", "bg-amber-600"]].map(([k, l, on]) => (
                            <button key={k} type="button" disabled={readOnly} aria-pressed={mark(code) === k} onClick={() => setMark(code, { mark: k })} className={`px-3 py-1 ${mark(code) === k ? `${on} text-white` : "bg-white text-slate-600"}`} data-testid={`mark-${k}-${code}`}>{l}</button>
                          ))}
                        </div>
                        <select disabled={readOnly} value={marks[code]?.support || "independent"} onChange={e => setMark(code, { support: e.target.value })} className="rounded-full border border-slate-300 px-2 py-1 text-xs" aria-label={`Help needed for ${code}`} data-testid={`support-${code}`}>
                          <option value="independent">Independently</option>
                          <option value="some">With some help</option>
                          <option value="significant">With a lot of help</option>
                        </select>
                      </div>
                      {mark(code) === "shown" && (
                        <label className="flex items-start gap-2 text-xs text-slate-600">
                          <input type="checkbox" disabled={readOnly} checked={!!marks[code]?.comprehensive} onChange={e => setMark(code, { comprehensive: e.target.checked })} data-testid={`comprehensive-${code}`} />
                          <span>This was a comprehensive assessment of this outcome (one thorough assessment can count instead of two separate days).</span>
                        </label>
                      )}
                    </li>
                  ))}
                </ul>
                {!readOnly && <p className="text-xs text-slate-500 mt-2">One piece of work never makes an outcome Achieved on its own: you confirm that in the <b>Outcome tracker</b> once there's enough evidence. Unmarked outcomes count as practised, and returned work never counts as understanding shown.</p>}
              </div>
            </details>
          )}
        </div>

        {!readOnly && (
          <footer className="sticky bottom-0 rounded-b-2xl border-t border-slate-200 bg-white px-4 sm:px-8 py-3 flex flex-wrap items-center gap-3">
            <button onClick={approve} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-emerald-700 text-white px-5 py-2 text-sm font-semibold disabled:opacity-50" data-testid="approve-btn"><CheckCircle2 size={16}/> Approve</button>
            <button onClick={sendBack} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-amber-600 text-white px-5 py-2 text-sm font-semibold disabled:opacity-50" data-testid="return-btn"><RotateCcw size={16}/> {selectedFlags.length ? `Return ${selectedFlags.length} question${selectedFlags.length === 1 ? "" : "s"} to ${firstName}` : `Return to ${firstName}`}</button>
            {selectedFlags.length > 0 && <span className="hidden sm:inline text-xs font-bold text-amber-800" data-testid="flag-count">{selectedFlags.length} flagged</span>}
          </footer>
        )}
      </div>
    </div>
  );
}
