import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Circle, Plus, History, Lightbulb, Paperclip, EyeOff, Eye, Trash2, CalendarDays, AlertTriangle } from "lucide-react";
import { api, fileUrl } from "../../lib/api";
import ReviewModal from "../../components/parent/ReviewModal";
import { STATUS, GAPS, LEVELS, SUPPORT, SOURCE, ORIGIN, StatusBadge } from "../../lib/outcomes";

const field = "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm";

function ConfirmBox({ d, sid, code, onDone }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const ready = d.computed_status === "demonstrated";
  const [override, setOverride] = useState(false);
  if (d.confirmed) {
    return <UnconfirmBox d={d} sid={sid} code={code} onDone={onDone} />;
  }
  const confirm = async () => {
    setBusy(true);
    try {
      await api.post(`/outcomes/students/${sid}/outcomes/${encodeURIComponent(code)}/confirm`, { note, override: !ready && override });
      toast.success("Confirmed as Achieved"); setNote(""); onDone();
    } catch (e) { toast.error(e.response?.data?.detail || "Could not confirm"); }
    finally { setBusy(false); }
  };
  return (
    <div className="paper-card p-4 space-y-2" data-testid="confirm-box">
      <h3 className="font-display font-bold" style={{ color: "#1F3B2D" }}>Mark as Achieved</h3>
      <p className="text-sm text-stone-600">
        {ready ? "The evidence meets Side-Quest's guideline. Have a look through it below, then confirm if you agree."
          : "The evidence doesn't meet the guideline yet. You know your child best: you can still confirm with a note explaining your judgement."}
      </p>
      {!ready && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={override} onChange={(e) => setOverride(e.target.checked)} data-testid="confirm-override" /> Confirm on my own judgement</label>}
      <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} placeholder={ready ? "Optional note (what convinced you)" : "Why you're confident they've achieved it (required)"} className={field} data-testid="confirm-note" />
      <button disabled={busy || (!ready && (!override || note.trim().length < 5))} onClick={confirm} className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold disabled:opacity-50" style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }} data-testid="confirm-btn">
        <CheckCircle2 size={16} /> Confirm Achieved
      </button>
    </div>
  );
}

function UnconfirmBox({ d, sid, code, onDone }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const go = async () => {
    try { await api.post(`/outcomes/students/${sid}/outcomes/${encodeURIComponent(code)}/unconfirm`, { note }); toast.success("Confirmation withdrawn"); onDone(); }
    catch (e) { toast.error(e.response?.data?.detail || "Could not change this"); }
  };
  return (
    <div className="paper-card p-4 space-y-2" data-testid="confirmed-box">
      <p className="text-sm text-stone-700"><b>You confirmed this on {new Date(d.confirmed.at).toLocaleDateString()}.</b>{d.confirmed.note ? ` “${d.confirmed.note}”` : ""}</p>
      {d.gaps.includes("confirmed_evidence_changed") && (
        <p className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-xs text-amber-900 flex gap-2" data-testid="confirmed-changed"><AlertTriangle size={14} className="shrink-0 mt-0.5" /> Some of the evidence behind your confirmation has changed. Your confirmation stays until you decide otherwise.</p>
      )}
      {!open ? <button onClick={() => setOpen(true)} className="text-xs font-semibold underline text-stone-600" data-testid="unconfirm-open">Withdraw confirmation</button> : (
        <div className="space-y-2">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why? (kept in the history)" className={field} data-testid="unconfirm-note" />
          <button disabled={note.trim().length < 3} onClick={go} className="rounded-full border border-stone-400 px-4 py-1.5 text-xs font-bold disabled:opacity-50" data-testid="unconfirm-btn">Withdraw</button>
        </div>
      )}
    </div>
  );
}

/** Prior learning: met before Side-Quest and recognised by the parent. It can be removed (logged with a note). */
function PriorBox({ d, sid, code, onDone }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const go = async () => {
    try { await api.post(`/outcomes/students/${sid}/outcomes/${encodeURIComponent(code)}/prior-learning/remove`, { note }); toast.success("Prior learning removed"); onDone(); }
    catch (e) { toast.error(e.response?.data?.detail || "Could not change this"); }
  };
  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 space-y-2" data-testid="prior-box">
      <p className="text-sm text-indigo-950"><b>Prior learning:</b> {d.prior_learning.source}, recorded {new Date(d.prior_learning.at).toLocaleDateString()}.{d.prior_learning.note ? ` “${d.prior_learning.note}”` : ""}</p>
      <p className="text-xs text-indigo-900">Met before Side-Quest, so it isn't counted as a gap or planned again. You can still confirm it as Achieved once you've seen it yourself.</p>
      {!open ? <button onClick={() => setOpen(true)} className="text-xs font-semibold underline text-indigo-900" data-testid="prior-remove-open">Remove prior learning</button> : (
        <div className="space-y-2">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why? (kept in the history)" className={field} data-testid="prior-remove-note" />
          <button onClick={go} className="rounded-full border border-indigo-400 px-4 py-1.5 text-xs font-bold" data-testid="prior-remove-btn">Remove</button>
        </div>
      )}
    </div>
  );
}

function AddEvidence({ sid, code, onDone }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("observation");
  const [notes, setNotes] = useState([]);
  const [f, setF] = useState({ title: "", note: "", level: "demonstrated", support: "independent", occurred_on: new Date().toISOString().slice(0, 10), evidence_note_id: "", comprehensive: false });
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (open) api.get("/evidence-notes", { params: { student_id: sid } }).then((r) => setNotes(r.data || [])).catch(() => setNotes([])); }, [open, sid]);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const save = async () => {
    setBusy(true);
    try {
      const body = mode === "note" ? { evidence_note_id: f.evidence_note_id, level: f.level, support: f.support } : { title: f.title, note: f.note, level: f.level, support: f.support, occurred_on: f.occurred_on, comprehensive: f.comprehensive };
      await api.post(`/outcomes/students/${sid}/outcomes/${encodeURIComponent(code)}/evidence`, body);
      toast.success("Evidence added"); setOpen(false); setF((p) => ({ ...p, title: "", note: "", evidence_note_id: "" })); onDone();
    } catch (e) { toast.error(e.response?.data?.detail || "Could not add evidence"); }
    finally { setBusy(false); }
  };
  if (!open) return <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 rounded-full border border-stone-400 bg-white px-4 py-2 text-xs font-bold" data-testid="add-evidence-open"><Plus size={14} /> Add evidence</button>;
  return (
    <div className="paper-card p-4 space-y-3 text-sm" data-testid="add-evidence-form">
      <div className="flex gap-2">
        {[["observation", "Something I saw"], ["note", "Link an Evidence Backpack note"]].map(([k, l]) => (
          <button key={k} onClick={() => setMode(k)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${mode === k ? "bg-emerald-900 text-white border-emerald-900" : "bg-white border-stone-300"}`} data-testid={`add-mode-${k}`}>{l}</button>
        ))}
      </div>
      {mode === "observation" ? (
        <>
          <input value={f.title} onChange={(e) => set("title", e.target.value)} maxLength={200} placeholder="Short title, e.g. Counting change at the market" className={field} data-testid="add-title" />
          <textarea rows={3} value={f.note} onChange={(e) => set("note", e.target.value)} maxLength={4000} placeholder="What did your child do or say that shows this?" className={field} data-testid="add-note" />
          <label className="block text-xs font-semibold text-stone-600">Date<input type="date" value={f.occurred_on} onChange={(e) => set("occurred_on", e.target.value)} className={`${field} mt-1`} data-testid="add-date" /></label>
        </>
      ) : (
        <select value={f.evidence_note_id} onChange={(e) => set("evidence_note_id", e.target.value)} className={field} data-testid="add-note-pick">
          <option value="">Choose a note…</option>
          {notes.map((n) => <option key={n.id} value={n.id}>{n.occurred_on} · {n.title}</option>)}
        </select>
      )}
      <div className="grid sm:grid-cols-2 gap-2">
        <label className="text-xs font-semibold text-stone-600">What it shows
          <select value={f.level} onChange={(e) => set("level", e.target.value)} className={`${field} mt-1`} data-testid="add-level">
            {Object.entries(LEVELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-stone-600">Support
          <select value={f.support} onChange={(e) => set("support", e.target.value)} className={`${field} mt-1`} data-testid="add-support">
            {Object.entries(SUPPORT).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
      </div>
      {mode === "observation" && f.level === "demonstrated" && (
        <label className="flex items-start gap-2 text-xs text-stone-600"><input type="checkbox" checked={f.comprehensive} onChange={(e) => set("comprehensive", e.target.checked)} className="mt-0.5" /> This was a comprehensive assessment that covered the whole outcome</label>
      )}
      <div className="flex gap-2">
        <button disabled={busy || (mode === "note" ? !f.evidence_note_id : !f.note.trim())} onClick={save} className="rounded-full px-4 py-2 text-xs font-bold disabled:opacity-50" style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }} data-testid="add-save">Save evidence</button>
        <button onClick={() => setOpen(false)} className="rounded-full border border-stone-300 px-4 py-2 text-xs font-bold">Cancel</button>
      </div>
    </div>
  );
}

function EvidenceItem({ e, onChanged, onOpenWork }) {
  const [busy, setBusy] = useState(false);
  const act = async (fn, ok) => { setBusy(true); try { await fn(); toast.success(ok); onChanged(); } catch (err) { toast.error(err.response?.data?.detail || "Could not change this"); } finally { setBusy(false); } };
  const exclude = () => {
    const reason = window.prompt("Why shouldn't this count? (kept in the history)");
    if (reason && reason.trim().length >= 3) act(() => api.post(`/outcomes/evidence/${e.id}/exclude`, { reason }), "No longer counted");
  };
  const remove = () => { if (window.confirm("Remove this evidence from the outcome? It stays in the history.")) act(() => api.put(`/outcomes/evidence/${e.id}`, { remove: true }), "Removed"); };
  return (
    <li className={`p-4 ${e.counts ? "" : "opacity-60"}`} data-testid={`evidence-${e.id}`} data-counts={e.counts ? "yes" : "no"}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs text-stone-500 flex flex-wrap gap-x-2">
            <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {e.occurred_on}</span>
            <span>{SOURCE[e.source_type] || e.source_type}</span>
            {e.origin && ORIGIN[e.origin] && e.source_type !== "parent_observation" && <span>· {ORIGIN[e.origin]}</span>}
          </div>
          <div className="font-semibold text-stone-800 mt-0.5">{e.summary}</div>
          <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
            <span className="rounded-full border border-stone-300 bg-white px-2 py-0.5">{LEVELS[e.level] || e.level}</span>
            {e.support && <span className="rounded-full border border-stone-300 bg-white px-2 py-0.5">{SUPPORT[e.support]}</span>}
            {e.score != null && <span className="rounded-full border border-stone-300 bg-white px-2 py-0.5">Quiz {e.score}/{e.total}</span>}
            {e.comprehensive && <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5">Comprehensive assessment</span>}
            {e.consolidate && <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5">Needs more practice</span>}
          </div>
          {e.note && <p className="text-sm text-stone-600 mt-1 whitespace-pre-wrap">{e.note}</p>}
          {e.files?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {e.files.map((f) => f.missing ? <span key={f.id} className="text-xs text-stone-400">{f.name}</span> : (
                <a key={f.id} href={fileUrl(f.id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs underline"><Paperclip size={12} /> {f.name}</a>
              ))}
            </div>
          )}
          {!e.counts && <p className="text-xs text-stone-500 mt-1">Not counted: {e.excluded_reason || e.removed_reason}</p>}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {e.submission_id && <button onClick={() => onOpenWork(e.submission_id)} className="rounded-full border border-stone-300 bg-white px-3 py-1 font-semibold" data-testid={`open-work-${e.id}`}>View the work</button>}
          {e.link && <Link to={e.link.to} className="rounded-full border border-stone-300 bg-white px-3 py-1 font-semibold">{e.link.label}</Link>}
          {!e.removed_at && (e.excluded_at
            ? <button disabled={busy} onClick={() => act(() => api.post(`/outcomes/evidence/${e.id}/include`), "Counted again")} className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-3 py-1 font-semibold" data-testid={`include-${e.id}`}><Eye size={12} /> Count it</button>
            : <button disabled={busy} onClick={exclude} className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-3 py-1 font-semibold" data-testid={`exclude-${e.id}`}><EyeOff size={12} /> Don't count</button>)}
          {e.editable && !e.removed_at && <button disabled={busy} onClick={remove} className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-3 py-1 font-semibold text-rose-800" data-testid={`remove-${e.id}`}><Trash2 size={12} /> Remove</button>}
        </div>
      </div>
    </li>
  );
}

export default function OutcomeDetail() {
  const { sid, code: rawCode } = useParams();
  const code = decodeURIComponent(rawCode || "");
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  const [work, setWork] = useState(null);
  const load = () => api.get(`/outcomes/students/${sid}/outcomes/${encodeURIComponent(code)}`).then((r) => setD(r.data)).catch((e) => setErr(e.response?.data?.detail || "Could not open this outcome"));
  useEffect(() => { setD(null); load(); /* eslint-disable-next-line */ }, [sid, code]);

  const back = <Link to={`/parent/outcomes/${sid}`} className="text-sm font-bold inline-flex items-center gap-1" style={{ color: "#4A5D3A" }} data-testid="outcome-back"><ArrowLeft size={14} /> Outcome tracker</Link>;
  if (err) return <div className="p-6 lg:p-10 space-y-4">{back}<div className="paper-card p-5 text-sm text-rose-800">{err}</div></div>;
  if (!d) return <div className="p-10 text-stone-500">Loading…</div>;
  if (!d.available) return <div className="p-6 lg:p-10 space-y-4">{back}<div className="paper-card p-5 text-sm">{d.note}</div></div>;

  const counted = d.evidence.filter((e) => e.counts);
  const notCounted = d.evidence.filter((e) => !e.counts);
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 max-w-5xl" data-testid="outcome-detail">
      {back}
      <header className="paper-card p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span>{d.outcome.learning_area}</span><span>· {d.student.name}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold leading-snug" style={{ color: "#1F3B2D" }}>{d.outcome.code}</h1>
        <p className="text-sm text-stone-700" data-testid="detail-source">
          {[d.outcome.source_title, d.outcome.strand, d.outcome.level_label].filter(Boolean).join(" · ")}
          {d.outcome.official_url && <> · <a href={d.outcome.official_url} target="_blank" rel="noopener noreferrer" className="font-semibold underline text-emerald-900">Read the official wording ↗</a></>}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={d.status} size="lg" testid="detail-status" />
          {d.status === "achieved" && d.computed_status !== "demonstrated" && <span className="text-xs text-stone-500">Evidence currently: {STATUS[d.computed_status].label}</span>}
        </div>
        <p className="text-sm text-stone-700" data-testid="detail-reason">{d.reason}</p>
        {d.last_change_reason && d.last_change_reason !== d.reason && <p className="text-xs text-stone-500">Last change: {d.last_change_reason}</p>}
        {d.catalogue_changed && (
          <p className="rounded-lg bg-sky-50 border border-sky-200 p-2 text-xs text-sky-900" data-testid="catalogue-changed">The curriculum catalogue has been updated since this was recorded (recorded with {d.catalogue_changed.recorded_version}, now {d.catalogue_changed.current_version}). Check the official wording if anything changed.</p>
        )}
        <p className="text-[11px] text-stone-500">{d.framework.name}</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-4">
        <section className="paper-card p-4 lg:col-span-2" data-testid="criteria">
          <h2 className="font-display font-bold mb-2" style={{ color: "#1F3B2D" }}>Towards Achieved</h2>
          <ul className="space-y-1.5 text-sm">
            {d.criteria.map((c) => (
              <li key={c.key} className="flex items-start gap-2" data-testid={`criterion-${c.key}`} data-met={c.met ? "yes" : "no"}>
                {c.met ? <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" /> : <Circle size={16} className="text-stone-400 shrink-0 mt-0.5" />}
                <span className={c.met ? "text-stone-800" : "text-stone-600"}>{c.label}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-stone-500 mt-3">These are Side-Quest's guidelines, not official curriculum-authority thresholds.{d.learner_support?.documented_adjustments ? " Documented adjustments apply for this child." : ""}</p>
        </section>
        {d.prior_learning && !d.confirmed && <PriorBox d={d} sid={sid} code={code} onDone={load} />}
        <ConfirmBox d={d} sid={sid} code={code} onDone={load} />
      </div>

      {d.gaps.length > 0 && d.suggestions.length > 0 && (
        <section className="paper-card p-4 space-y-3" data-testid="suggestions">
          <h2 className="font-display font-bold flex items-center gap-2" style={{ color: "#1F3B2D" }}><Lightbulb size={17} /> Ideas for the next step</h2>
          <div className="flex flex-wrap gap-1.5">{d.gaps.map((g) => <span key={g} className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs text-amber-900">{GAPS[g]}</span>)}</div>
          <div className="grid sm:grid-cols-3 gap-3">
            {d.suggestions.map((s) => (
              <Link key={s.kind} to={s.to} className="rounded-xl border border-stone-200 bg-white p-3 hover:border-stone-400 transition" data-testid={`suggest-${s.kind}`}>
                <div className="font-semibold text-sm" style={{ color: "#1F3B2D" }}>{s.label}</div>
                <div className="text-xs text-stone-600 mt-1">{s.detail}</div>
              </Link>
            ))}
          </div>
          <p className="text-[11px] text-stone-500">Optional. Suggestions only use outcomes from your curriculum.</p>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>Evidence ({counted.length})</h2>
          <AddEvidence sid={sid} code={code} onDone={load} />
        </div>
        {d.planned.length > 0 && <p className="text-xs text-stone-600">Planned in: {d.planned.map((p) => p.title).join(", ")} (plans aren't counted as evidence).</p>}
        <ul className="paper-card divide-y divide-stone-200" data-testid="evidence-list">
          {counted.length === 0 && <li className="p-4 text-sm text-stone-500">No evidence yet. It appears here automatically when you review lesson work or life learning linked to this outcome, or you can add your own.</li>}
          {counted.map((e) => <EvidenceItem key={e.id} e={e} onChanged={load} onOpenWork={setWork} />)}
        </ul>
        {notCounted.length > 0 && (
          <details className="paper-card" data-testid="evidence-not-counted">
            <summary className="p-4 cursor-pointer text-sm font-semibold text-stone-600">Not counted ({notCounted.length})</summary>
            <ul className="divide-y divide-stone-200 border-t border-stone-200">{notCounted.map((e) => <EvidenceItem key={e.id} e={e} onChanged={load} onOpenWork={setWork} />)}</ul>
          </details>
        )}
      </section>

      <section className="paper-card p-4" data-testid="history">
        <h2 className="font-display font-bold flex items-center gap-2 mb-2" style={{ color: "#1F3B2D" }}><History size={17} /> History</h2>
        {d.history.length === 0 ? <p className="text-sm text-stone-500">Nothing yet.</p> : (
          <ol className="space-y-2 text-sm">
            {d.history.map((h, i) => (
              <li key={i} className="flex flex-wrap items-start gap-2">
                <span className="text-xs text-stone-500 w-24 shrink-0">{new Date(h.created_at).toLocaleDateString()}</span>
                <StatusBadge status={h.to_status} />
                <span className="text-stone-700 flex-1 min-w-[12rem]">{h.reason} <span className="text-xs text-stone-500">({h.actor === "parent" ? "you" : "automatic"})</span></span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {work && <ReviewModal submissionId={work} readOnly onClose={() => setWork(null)} />}
    </div>
  );
}
