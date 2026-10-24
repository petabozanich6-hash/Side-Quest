import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { FileText, ListChecks, Loader2, Upload, X } from "lucide-react";
import { api } from "../../lib/api";
import { MET } from "../../lib/outcomes";

const CONFIDENCE = {
  high: ["Strong match", "bg-emerald-100 text-emerald-900"],
  medium: ["Likely", "bg-sky-100 text-sky-900"],
  low: ["Possible", "bg-stone-100 text-stone-700"],
};
const today = () => new Date().toISOString().slice(0, 10);

/**
 * Recognise outcomes a child met before Side-Quest. Either read a school report or NAPLAN result (AI suggests outcomes
 * from the child's own list, each starting unticked) or tick outcomes by hand. The parent decides; the server records it.
 */
export default function PriorLearningDialog({ data, onClose, onDone }) {
  const sid = data.student.id;
  const first = (data.student.name || "your child").split(" ")[0];
  const open = useMemo(() => data.outcomes.filter((o) => o.in_stage && !MET.includes(o.status)), [data]);
  const [step, setStep] = useState("start"); // start | read | review
  const [text, setText] = useState("");
  const [file, setFile] = useState(null); // { id, name }
  const [busy, setBusy] = useState("");
  const [found, setFound] = useState(null); // { suggestions, summary, document_type }
  const [picked, setPicked] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("");
  const [occurred, setOccurred] = useState(today());
  const [note, setNote] = useState("");

  const upload = async (f) => {
    if (!f) return;
    setBusy("upload");
    const fd = new FormData(); fd.append("file", f); fd.append("context", "evidence");
    try {
      const { data: up } = await api.post("/files/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setFile({ id: up.id, name: f.name });
      if (!source) setSource(/naplan/i.test(f.name) ? "NAPLAN result" : "School report");
    } catch (e) { toast.error(e.response?.data?.detail || "Upload failed"); }
    finally { setBusy(""); }
  };
  const analyse = async () => {
    setBusy("analyse");
    try {
      const { data: r } = await api.post(`/outcomes/students/${sid}/prior-learning/analyse`, file && !text.trim() ? { file_id: file.id } : { text });
      setFound(r);
      if (!source) setSource(r.document_type === "naplan" ? "NAPLAN result" : "School report");
      setStep("review");
    } catch (e) { toast.error(e.response?.data?.detail || "Couldn't read that document."); }
    finally { setBusy(""); }
  };
  const save = async () => {
    const codes = Object.keys(picked).filter((c) => picked[c]);
    setBusy("save");
    try {
      const { data: r } = await api.post(`/outcomes/students/${sid}/prior-learning`, { codes, source, occurred_on: occurred, note, file_ids: file ? [file.id] : [] });
      toast.success(`${r.recorded} outcome${r.recorded === 1 ? "" : "s"} recorded as prior learning${r.skipped ? ` (${r.skipped} already met)` : ""}.`);
      onDone();
    } catch (e) { toast.error(e.response?.data?.detail || "Couldn't save the prior learning."); }
    finally { setBusy(""); }
  };

  const toggle = (code) => setPicked((p) => ({ ...p, [code]: !p[code] }));
  const suggested = new Set((found?.suggestions || []).map((s) => s.code));
  const term = query.trim().toLowerCase();
  const others = open.filter((o) => !suggested.has(o.code) && (!term || [o.code, o.summary, o.subject, o.learning_area].join(" ").toLowerCase().includes(term)));
  const bySubject = others.reduce((m, o) => { const k = o.subject || o.learning_area; (m[k] = m[k] || []).push(o); return m; }, {});
  const count = Object.values(picked).filter(Boolean).length;
  const card = "w-full text-left rounded-2xl border border-stone-200 bg-white p-4 hover:border-emerald-700 transition";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto" onClick={() => !busy && onClose()}>
      <section role="dialog" aria-modal="true" aria-label="Add prior learning" onClick={(e) => e.stopPropagation()}
        className="mx-auto my-4 max-w-3xl rounded-2xl bg-white flex flex-col" data-testid="prior-dialog">
        <header className="sticky top-0 z-10 rounded-t-2xl bg-white border-b border-stone-200 px-4 sm:px-6 py-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold" style={{ color: "#1F3B2D" }}>Add prior learning</h2>
            <p className="text-sm text-stone-600 mt-1">Outcomes {first} already met before Side-Quest, for example at school. They're marked <b>Prior learning</b> and won't be planned again.</p>
          </div>
          <button type="button" onClick={onClose} disabled={!!busy} className="text-stone-400 hover:text-stone-700 p-1" aria-label="Close"><X size={18} /></button>
        </header>

        <div className="px-4 sm:px-6 py-5 space-y-4">
          {step === "start" && (
            <div className="grid sm:grid-cols-2 gap-3">
              <button type="button" className={card} onClick={() => setStep("read")} data-testid="prior-read">
                <FileText size={22} className="text-emerald-800" />
                <p className="font-display font-bold mt-2" style={{ color: "#1F3B2D" }}>Read a report or NAPLAN result</p>
                <p className="text-sm text-stone-600 mt-1">Upload it or paste the text. Side-Quest suggests outcomes from {first}'s list for you to tick.</p>
              </button>
              <button type="button" className={card} onClick={() => { setFound({ suggestions: [] }); setShowAll(true); setStep("review"); }} data-testid="prior-manual">
                <ListChecks size={22} className="text-emerald-800" />
                <p className="font-display font-bold mt-2" style={{ color: "#1F3B2D" }}>Choose outcomes myself</p>
                <p className="text-sm text-stone-600 mt-1">Tick outcomes covered at a previous school or elsewhere, and say why.</p>
              </button>
            </div>
          )}

          {step === "read" && (
            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 p-4 cursor-pointer hover:border-emerald-700">
                {busy === "upload" ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} className="text-emerald-800" />}
                <span className="text-sm"><b>{file ? file.name : "Upload the report"}</b><span className="block text-stone-600">PDF works best. A clear photo also works. It's kept in {first}'s Evidence Backpack.</span></span>
                <input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} data-testid="prior-file" />
              </label>
              <p className="text-center text-xs text-stone-500">or</p>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} maxLength={28000}
                placeholder="Paste the report's text here: subject grades, comments, or NAPLAN results such as 'Numeracy: Strong'."
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" data-testid="prior-text" />
              <p className="text-xs text-stone-500">NAPLAN gives a level per area (for example "Strong" in Numeracy), not results for each outcome, so its suggestions are only ever "Likely" or "Possible".</p>
              <div className="flex gap-2">
                <button type="button" disabled={!!busy || (!file && text.trim().length < 40)} onClick={analyse}
                  className="rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 flex items-center gap-2" style={{ backgroundColor: "#1F3B2D" }} data-testid="prior-analyse">
                  {busy === "analyse" && <Loader2 size={16} className="animate-spin" />}{busy === "analyse" ? "Reading… up to a minute" : "Find outcomes"}
                </button>
                <button type="button" onClick={() => setStep("start")} className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold">Back</button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-4">
              {found?.summary && <p className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-sm text-stone-700" data-testid="prior-summary">{found.summary}</p>}
              {found?.suggestions?.length > 0 && (
                <div className="space-y-2" data-testid="prior-suggestions">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display font-bold" style={{ color: "#1F3B2D" }}>Suggested from the document ({found.suggestions.length})</h3>
                    <button type="button" className="text-xs font-semibold underline" onClick={() => setPicked((p) => ({ ...p, ...Object.fromEntries(found.suggestions.filter((s) => s.confidence === "high").map((s) => [s.code, true])) }))} data-testid="prior-tick-strong">Tick all strong matches</button>
                  </div>
                  <p className="text-xs text-stone-500">Nothing is ticked for you. Tick each one you agree {first} has already met.</p>
                  {found.suggestions.map((s) => (
                    <label key={s.code} className={`flex gap-3 rounded-xl border p-3 cursor-pointer ${picked[s.code] ? "border-indigo-400 bg-indigo-50" : "border-stone-200"}`} data-testid={`prior-suggestion-${s.code}`}>
                      <input type="checkbox" checked={!!picked[s.code]} onChange={() => toggle(s.code)} className="mt-1 h-4 w-4" aria-label={`Prior learning: ${s.code}`} />
                      <span className="min-w-0 flex-1 text-sm">
                        <span className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-bold">{s.code}</span><span className="text-xs text-stone-500">{s.subject}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CONFIDENCE[s.confidence][1]}`}>{CONFIDENCE[s.confidence][0]}</span></span>
                        <span className="block text-stone-800">{s.summary}</span>
                        {s.evidence && <span className="block text-xs text-stone-600 mt-0.5"><b>From the document:</b> {s.evidence}</span>}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {found && !found.suggestions?.length && !showAll && <p className="text-sm text-stone-700" data-testid="prior-none">The document didn't clearly show any of {first}'s outcomes. You can still choose outcomes yourself below.</p>}

              <div>
                <button type="button" onClick={() => setShowAll((v) => !v)} className="text-sm font-semibold underline" data-testid="prior-show-all">{showAll ? "Hide the full list" : `Choose from all of ${first}'s outcomes (${others.length})`}</button>
                {showAll && (
                  <div className="mt-2 space-y-3">
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by code, subject or topic" className="w-full rounded-full border border-stone-300 px-4 py-2 text-sm" data-testid="prior-search" />
                    {Object.entries(bySubject).map(([subject, list]) => (
                      <div key={subject}>
                        <p className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-1">{subject}</p>
                        <div className="space-y-1">
                          {list.map((o) => (
                            <label key={o.code} className={`flex gap-3 rounded-lg border px-3 py-2 cursor-pointer text-sm ${picked[o.code] ? "border-indigo-400 bg-indigo-50" : "border-stone-200"}`} data-testid={`prior-option-${o.code}`}>
                              <input type="checkbox" checked={!!picked[o.code]} onChange={() => toggle(o.code)} className="mt-1 h-4 w-4" aria-label={`Prior learning: ${o.code}`} />
                              <span><span className="font-mono text-xs font-bold mr-2">{o.code}</span>{o.summary || o.strand}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    {!others.length && <p className="text-sm text-stone-500">No outcomes match.</p>}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-3 border-t border-stone-200 pt-4">
                <label className="text-sm font-semibold">Where this comes from
                  <input value={source} onChange={(e) => setSource(e.target.value)} maxLength={200} placeholder="For example: Year 4 Semester 1 school report" className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-normal" data-testid="prior-source" />
                </label>
                <label className="text-sm font-semibold">Date of the report or learning
                  <input type="date" value={occurred} onChange={(e) => setOccurred(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-normal" data-testid="prior-date" />
                </label>
                <label className="text-sm font-semibold sm:col-span-2">Note (optional)
                  <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} placeholder="For example: Grade A in Mathematics; teacher comment on fractions" className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-normal" data-testid="prior-note" />
                </label>
              </div>
            </div>
          )}
        </div>

        {step === "review" && (
          <footer className="sticky bottom-0 rounded-b-2xl border-t border-stone-200 bg-white px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
            <button type="button" disabled={!!busy || !count || source.trim().length < 3} onClick={save}
              className="rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50" style={{ backgroundColor: "#3730A3" }} data-testid="prior-save">
              {busy === "save" ? "Saving…" : `Record ${count} outcome${count === 1 ? "" : "s"} as prior learning`}
            </button>
            {source.trim().length < 3 && count > 0 && <span className="text-xs text-stone-600">Say where this comes from first.</span>}
          </footer>
        )}
      </section>
    </div>
  );
}
