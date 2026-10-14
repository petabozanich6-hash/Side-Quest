import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Map as MapIcon, RefreshCw, Search, ShieldCheck, ChevronRight, Info } from "lucide-react";
import { api } from "../../lib/api";
import { STATUS, STATUS_ORDER, GAPS, StatusBadge, StatusBar } from "../../lib/outcomes";

const GAP_FILTERS = ["awaiting_confirmation", "needs_consolidation", "limited_evidence", "not_revisited", "not_introduced", "confirmed_evidence_changed"];

function SupportSettings({ data, onSaved }) {
  const [open, setOpen] = useState(false);
  const [on, setOn] = useState(!!data.learner_support?.documented_adjustments);
  const [note, setNote] = useState(data.learner_support?.note || "");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try { await api.put(`/outcomes/students/${data.student.id}/support`, { documented_adjustments: on, note }); toast.success("Saved. Statuses have been rechecked."); setOpen(false); onSaved(); }
    catch (e) { toast.error(e.response?.data?.detail || "Could not save"); }
    finally { setBusy(false); }
  };
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-xs font-semibold underline" style={{ color: "#4A5D3A" }} data-testid="support-open">
        {data.learner_support?.documented_adjustments ? "Documented adjustments: on" : "Learner needs and adjustments"}
      </button>
    );
  }
  return (
    <div className="paper-card p-4 space-y-2 text-sm" data-testid="support-form">
      <label className="flex items-start gap-2">
        <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} className="mt-1" data-testid="support-toggle" />
        <span><b>{data.student.name} has documented adjustments.</b> Work done with a lot of help (for example with a scribe, reader or adapted task) then counts as evidence of understanding.</span>
      </label>
      <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} placeholder="What adjustments? (optional, for your records)" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" data-testid="support-note" />
      <div className="flex gap-2">
        <button disabled={busy} onClick={save} className="rounded-full px-4 py-1.5 text-xs font-bold disabled:opacity-50" style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }} data-testid="support-save">Save</button>
        <button onClick={() => setOpen(false)} className="rounded-full border border-stone-300 px-4 py-1.5 text-xs font-bold">Cancel</button>
      </div>
    </div>
  );
}

export default function OutcomeTracker() {
  const { sid } = useParams();
  const nav = useNavigate();
  const [students, setStudents] = useState(null);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("");
  const [gap, setGap] = useState("");
  const [q, setQ] = useState("");
  const [showOther, setShowOther] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { api.get("/students").then((r) => setStudents(r.data || [])).catch(() => setStudents([])); }, []);
  useEffect(() => { if (!sid && students?.length) nav(`/parent/outcomes/${students[0].id}`, { replace: true }); }, [sid, students, nav]);

  const load = (refresh = false) => {
    if (!sid) return;
    setErr("");
    const req = refresh ? api.post(`/outcomes/students/${sid}/rebuild`) : api.get(`/outcomes/students/${sid}`);
    return req.then((r) => setData(r.data)).catch((e) => setErr(e.response?.data?.detail || "Could not load the tracker"));
  };
  useEffect(() => { setData(null); load(); /* eslint-disable-next-line */ }, [sid]);

  const rebuild = async () => { setBusy(true); try { await load(true); toast.success("Rechecked against all of this child's records"); } finally { setBusy(false); } };

  const visible = useMemo(() => {
    if (!data?.outcomes) return [];
    const term = q.trim().toLowerCase();
    return data.outcomes.filter((o) => (showOther || o.in_stage)
      && (!area || o.learning_area === area)
      && (!status || o.status === status)
      && (!gap || o.gaps.includes(gap))
      && (!term || o.code.toLowerCase().includes(term) || o.description.toLowerCase().includes(term)));
  }, [data, area, status, gap, q, showOther]);

  if (students && students.length === 0) {
    return (
      <div className="p-6 lg:p-10"><div className="paper-card p-8 text-center"><p className="font-display text-lg" style={{ color: "#1F3B2D" }}>Add a child first</p><Link to="/parent/children" className="mt-3 inline-block underline font-semibold">Add a child</Link></div></div>
    );
  }
  const otherCount = data?.outcomes?.filter((o) => !o.in_stage).length || 0;

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 max-w-6xl" data-testid="outcome-tracker">
      <header className="space-y-2">
        <div className="font-script text-2xl" style={{ color: "#C77B5B" }}>The learning trail</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold flex items-center gap-3" style={{ color: "#1F3B2D" }}><MapIcon size={28} aria-hidden="true" /> Outcome tracker</h1>
        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
          Every curriculum outcome for your child's stage, and how far along the trail they are. It updates itself from reviewed lesson work, quizzes,
          life learning and your own observations. Finishing a lesson never marks an outcome Achieved: only you can, once the evidence is there.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {(students || []).length > 1 && (
            <select value={sid || ""} onChange={(e) => nav(`/parent/outcomes/${e.target.value}`)} className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold" data-testid="tracker-child" aria-label="Child">
              {(students || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          )}
          {data?.available && <button onClick={rebuild} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-bold disabled:opacity-50" data-testid="tracker-rebuild"><RefreshCw size={13} className={busy ? "animate-spin" : ""} /> Recheck all records</button>}
          {data?.available && <SupportSettings data={data} onSaved={() => load()} />}
        </div>
      </header>

      {err && <div className="paper-card p-4 text-sm text-rose-800">{err}</div>}
      {!data && !err && <div className="text-stone-500">Loading the trail…</div>}

      {data && !data.available && (
        <section className="paper-card p-6 border-l-4 space-y-2" style={{ borderLeftColor: "#C8893B" }} data-testid="tracker-unavailable">
          <h2 className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>Not available for your curriculum yet</h2>
          <p className="text-sm text-stone-700 leading-relaxed">{data.note}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link to="/parent/evidence" className="rounded-full px-4 py-2 text-xs font-bold" style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }}>Open Evidence Backpack</Link>
            <Link to="/parent/curriculum" className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-bold">Your curriculum compass</Link>
          </div>
        </section>
      )}

      {data?.available && (
        <>
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3" data-testid="tracker-areas">
            {data.areas.map((a) => (
              <button key={a.learning_area} type="button" onClick={() => setArea(area === a.learning_area ? "" : a.learning_area)}
                className={`paper-card p-4 text-left transition hover:-translate-y-0.5 ${area === a.learning_area ? "ring-2 ring-emerald-800" : ""}`} data-testid={`area-${a.learning_area}`} aria-pressed={area === a.learning_area}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold" style={{ color: "#1F3B2D" }}>{a.learning_area}</span>
                  <span className="text-xs text-stone-500">{a.total} outcomes</span>
                </div>
                <div className="mt-2"><StatusBar counts={a.counts} total={a.total} /></div>
                <div className="mt-2 text-xs text-stone-600">
                  {a.counts.achieved} achieved · {a.counts.demonstrated} demonstrated · {a.counts.developing + a.counts.introduced} on the way
                  {a.awaiting_confirmation > 0 && <span className="block font-semibold text-emerald-800">{a.awaiting_confirmation} ready for your confirmation</span>}
                </div>
              </button>
            ))}
          </section>

          {(data.gaps.awaiting_confirmation || data.gaps.confirmed_evidence_changed || data.gaps.needs_consolidation) ? (
            <section className="paper-card p-4 flex flex-wrap gap-2 items-center text-sm" data-testid="tracker-attention">
              <span className="font-semibold" style={{ color: "#1F3B2D" }}>Worth a look:</span>
              {["awaiting_confirmation", "confirmed_evidence_changed", "needs_consolidation"].filter((g) => data.gaps[g]).map((g) => (
                <button key={g} onClick={() => setGap(gap === g ? "" : g)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${gap === g ? "bg-emerald-900 text-white border-emerald-900" : "bg-white border-stone-300"}`} data-testid={`attention-${g}`}>{GAPS[g]} ({data.gaps[g]})</button>
              ))}
            </section>
          ) : null}

          <section className="space-y-3">
            <div className="flex flex-wrap gap-2 items-end">
              <label className="relative">
                <span className="sr-only">Search outcomes</span>
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden="true" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search code or wording" className="rounded-full border border-stone-300 bg-white pl-8 pr-3 py-2 text-sm w-56" data-testid="tracker-search" />
              </label>
              <select value={area} onChange={(e) => setArea(e.target.value)} className="rounded-full border border-stone-300 bg-white px-3 py-2 text-sm" aria-label="Subject" data-testid="filter-area">
                <option value="">All subjects</option>
                {data.areas.map((a) => <option key={a.learning_area} value={a.learning_area}>{a.learning_area}</option>)}
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border border-stone-300 bg-white px-3 py-2 text-sm" aria-label="Status" data-testid="filter-status">
                <option value="">Any status</option>
                {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
              </select>
              <select value={gap} onChange={(e) => setGap(e.target.value)} className="rounded-full border border-stone-300 bg-white px-3 py-2 text-sm" aria-label="Gaps" data-testid="filter-gap">
                <option value="">Any gap</option>
                {GAP_FILTERS.map((g) => <option key={g} value={g}>{GAPS[g]}{data.gaps[g] ? ` (${data.gaps[g]})` : ""}</option>)}
              </select>
              {otherCount > 0 && <label className="text-xs text-stone-600 flex items-center gap-1.5 pb-2"><input type="checkbox" checked={showOther} onChange={(e) => setShowOther(e.target.checked)} /> Include {otherCount} from other stages</label>}
            </div>

            <ul className="paper-card divide-y divide-stone-200" data-testid="tracker-list">
              {visible.length === 0 && <li className="p-5 text-sm text-stone-500">No outcomes match these filters.</li>}
              {visible.map((o) => (
                <li key={o.code}>
                  <Link to={`/parent/outcomes/${sid}/${encodeURIComponent(o.code)}`} className="flex items-start gap-3 p-4 hover:bg-white/70 transition" data-testid={`outcome-row-${o.code}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-700">{o.code}</span>
                        <span className="text-[11px] text-stone-500">{o.learning_area}{!o.in_stage ? ` · ${o.stage}` : ""}</span>
                      </div>
                      <p className="text-sm text-stone-800 mt-0.5">{o.description}</p>
                      <p className="text-xs text-stone-500 mt-1">
                        {o.evidence_count ? `${o.evidence_count} piece${o.evidence_count === 1 ? "" : "s"} of evidence · latest ${o.last_evidence_on}` : "No evidence yet"}
                        {o.gaps.filter((g) => g !== "not_introduced").map((g) => <span key={g} className="ml-2 inline-block rounded-full bg-amber-50 border border-amber-200 px-2 text-amber-900">{GAPS[g]}</span>)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0"><StatusBadge status={o.status} testid={`status-${o.code}`} /><ChevronRight size={16} className="text-stone-400" aria-hidden="true" /></div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-5 text-xs text-stone-600 leading-relaxed space-y-2" data-testid="tracker-rules">
            <p className="flex items-center gap-2 font-semibold text-stone-800"><ShieldCheck size={15} aria-hidden="true" /> How statuses are decided</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><b>Introduced</b>: met in a learning experience. <b>Developing</b>: practised (an approved lesson, a passed quiz, or more than one experience).</li>
              <li><b>Demonstrated</b>: understanding shown in at least {data.rules.min_evidence} pieces of reviewed work on {data.rules.min_occasions} separate days, done independently or with some help (or one comprehensive assessment you flag).</li>
              <li><b>Achieved</b>: only when you confirm it. Side-Quest never removes your confirmation; if its evidence changes, it is flagged for you.</li>
            </ul>
            <p className="flex items-start gap-2"><Info size={13} className="mt-0.5 shrink-0" aria-hidden="true" /> {data.note} Curriculum: {data.framework.name}.</p>
          </section>
        </>
      )}
    </div>
  );
}
