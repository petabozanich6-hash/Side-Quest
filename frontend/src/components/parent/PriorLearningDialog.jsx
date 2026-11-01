import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { FileText, ListChecks, Loader2, RotateCw, Upload, X } from "lucide-react";
import { api } from "../../lib/api";
import { readPdfPages, turnedPage } from "../../lib/pdfPages";
import { MET } from "../../lib/outcomes";

const CONFIDENCE = {
  high: ["Strong match", "bg-emerald-100 text-emerald-900"],
  medium: ["Likely", "bg-sky-100 text-sky-900"],
  low: ["Possible", "bg-stone-100 text-stone-700"],
};
const today = () => new Date().toISOString().slice(0, 10);
const SOURCES = { naplan: "NAPLAN result", work_sample: "Work sample", school_report: "School report" };

/** Phone photos are several megabytes; the reader only needs about 1600px, so shrink them before uploading. */
async function shrinkPhoto(f) {
  if (!f.type.startsWith("image/") || f.size < 1500000 || typeof createImageBitmap !== "function") return f;
  try {
    const img = await createImageBitmap(f);
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    return blob ? new File([blob], f.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : f;
  } catch { return f; }
}

/**
 * Recognise outcomes a child met before Side-Quest. Either read a school report or NAPLAN result (AI suggests outcomes
 * from the child's own list, each starting unticked) or tick outcomes by hand. The parent decides; the server records it.
 * `preset` opens straight on the review step with suggestions already found (starting check results).
 */
export default function PriorLearningDialog({ data, onClose, onDone, preset = null }) {
  const sid = data.student.id;
  const first = (data.student.name || "your child").split(" ")[0];
  const open = useMemo(() => data.outcomes.filter((o) => o.in_stage && !MET.includes(o.status)), [data]);
  const [step, setStep] = useState(preset ? "review" : "start"); // start | read | review
  const [text, setText] = useState("");
  const [file, setFile] = useState(null); // { id, name }
  const [busy, setBusy] = useState("");
  const [found, setFound] = useState(preset); // { suggestions, summary, document_type }
  const [picked, setPicked] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState(preset?.source || "");
  const [occurred, setOccurred] = useState(today());
  const [note, setNote] = useState("");
  // A scanned PDF, shown as page pictures the parent can turn the right way up before they're read.
  const [scan, setScan] = useState(null); // { pages: [{ blob, url, turned }], total }

  const upload = async (f) => {
    if (!f) return;
    setBusy("upload");
    setScan(null);
    if (f.type === "application/pdf") {
      try {
        const pdf = await readPdfPages(f);
        if (!pdf.hasText && pdf.pages.length) setScan({ total: pdf.total, pages: pdf.pages.map((p) => ({ ...p, turned: false })) });
      } catch { /* not readable here; the server will say so */ }
    }
    f = await shrinkPhoto(f);
    const fd = new FormData(); fd.append("file", f); fd.append("context", "evidence");
    try {
      const { data: up } = await api.post("/files/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setFile({ id: up.id, name: f.name });
      if (!source && /naplan/i.test(f.name)) setSource("NAPLAN result");
    } catch (e) { toast.error(e.response?.data?.detail || "Upload failed"); }
    finally { setBusy(""); }
  };
  const analyse = async () => {
    setBusy("analyse");
    try {
      let body = file && !text.trim() ? { file_id: file.id } : { text };
      if (scan && !text.trim()) {
        // Page pictures are uploaded separately to be read; the original PDF stays the evidence.
        const ids = [];
        for (const [i, p] of scan.pages.entries()) {
          const blob = p.turned ? await turnedPage(p.blob) : p.blob;
          const fd = new FormData(); fd.append("file", new File([blob], `page-${i + 1}.jpg`, { type: "image/jpeg" })); fd.append("context", "prior_learning_page");
          ids.push((await api.post("/files/upload", fd, { headers: { "Content-Type": "multipart/form-data" } })).data.id);
        }
        body = { file_ids: ids };
      }
      const { data: r } = await api.post(`/outcomes/students/${sid}/prior-learning/analyse`, body);
      setFound(r);
      if (!source) setSource(SOURCES[r.document_type] || "School report");
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
                <p className="font-display font-bold mt-2" style={{ color: "#1F3B2D" }}>Read a report, NAPLAN result or past work</p>
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
                <span className="text-sm"><b>{file ? file.name : "Upload a report or a piece of work"}</b><span className="block text-stone-600">A typed PDF, or a clear photo of each page. Scanned PDFs can't be read, so photograph those pages instead. It's kept in {first}'s Evidence Backpack.</span></span>
                <input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} data-testid="prior-file" />
              </label>
              {scan && (
                <div className="rounded-2xl border border-stone-200 p-3 space-y-2" data-testid="prior-scan">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-stone-700">This PDF is a scan, so Side-Quest will read {scan.pages.length === scan.total ? `its ${scan.total} page${scan.total === 1 ? "" : "s"}` : `the first ${scan.pages.length} of its ${scan.total} pages`} as pictures. Tap any page that's upside down.</p>
                    <button type="button" onClick={() => setScan((sc) => ({ ...sc, pages: sc.pages.map((p) => ({ ...p, turned: !p.turned })) }))}
                      className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-1.5 text-xs font-bold" data-testid="prior-turn-all"><RotateCw size={13} /> Turn all pages</button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {scan.pages.map((p, i) => (
                      <button key={p.url} type="button" onClick={() => setScan((sc) => ({ ...sc, pages: sc.pages.map((q, j) => (j === i ? { ...q, turned: !q.turned } : q)) }))}
                        className="rounded border border-stone-200 overflow-hidden bg-white" aria-label={`Page ${i + 1}${p.turned ? ", turned" : ""}`}>
                        <img src={p.url} alt="" className="w-full" style={{ transform: p.turned ? "rotate(180deg)" : "none" }} />
                      </button>
                    ))}
                  </div>
                  {scan.total > scan.pages.length && <p className="text-xs text-stone-500">Only the first 20 pages can be read at once. Split longer PDFs, or photograph the most important pages.</p>}
                </div>
              )}
              <p className="text-center text-xs text-stone-500">or</p>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} maxLength={28000}
                placeholder="Paste the report's text, NAPLAN results such as 'Numeracy: Strong', or describe the work, e.g. 'Year 3 fractions worksheet, 18 of 20 correct without help'."
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" data-testid="prior-text" />
              <p className="text-xs text-stone-500">NAPLAN gives a level per area (for example "Strong" in Numeracy), not results for each outcome, so its suggestions are only ever "Likely" or "Possible".</p>
              <div className="flex gap-2">
                <button type="button" disabled={!!busy || (!file && text.trim().length < 40)} onClick={analyse}
                  className="rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 flex items-center gap-2" style={{ backgroundColor: "#1F3B2D" }} data-testid="prior-analyse">
                  {busy === "analyse" && <Loader2 size={16} className="animate-spin" />}{busy === "analyse" ? (scan ? "Reading the pages… up to two minutes" : "Reading… up to a minute") : "Find outcomes"}
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
                    <h3 className="font-display font-bold" style={{ color: "#1F3B2D" }}>{preset ? "Answered correctly" : "Suggested from the document"} ({found.suggestions.length})</h3>
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
                        {s.evidence && <span className="block text-xs text-stone-600 mt-0.5">{preset ? s.evidence : <><b>From the document:</b> {s.evidence}</>}</span>}
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
