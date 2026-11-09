import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { API } from "../lib/api";

// Guided home education document: the paid order token gates access. Answers
// remain in component memory, never sent to Side-Quest servers or an AI model.
// Printing uses the browser's built-in "Save as PDF" flow and does not claim
// to create official government forms or interactive PDF form fields.
const EMPTY = { learner_name: "", school_year: "", year_level: "3", period_start: "", period_end: "", goals: "", strengths: "", teaching: "", schedule: "", records: "", resources: "", review: "" };
const FIELDS = [
  ["learner_name", "Learner's name or initials", "Use initials if you prefer. Leave blank to complete later."],
  ["school_year", "Planned learning period", "For example, Term 1–4, 2027."],
  ["goals", "Learning goals", "What would you like your child to learn or work towards?"],
  ["strengths", "Interests, strengths and learning preferences", "Only share information you're comfortable including."],
  ["teaching", "Teaching approach and activities", "Describe the learning experiences you'll actually provide."],
  ["schedule", "When and where learning takes place", "Daily routines, flexible learning and learning locations."],
  ["resources", "Learning resources", "List actual books, websites, apps and materials you use or plan to use."],
  ["records", "How you will document learning", "How will you keep dated examples and track progress?"],
  ["review", "How you will check progress and adjust the plan", "How will you know whether learning goals are being met?"],
];
const fieldClass = "w-full rounded-lg border border-stone-300 p-2 text-sm";
const clean = (s) => String(s || "").trim();

export default function GuidedDocument() {
  const { id, productId } = useParams();
  const [query] = useSearchParams();
  const token = query.get("t") || "";
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState(EMPTY);
  const [areas, setAreas] = useState({});
  const [preview, setPreview] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let active = true;
    setError(""); setMeta(null); setPreview(false); setGeneratedPreview(null); setSent(false); setAnswers(EMPTY); setAreas({});
    fetch(`${API}/shop/orders/${encodeURIComponent(id)}/guided-document/${encodeURIComponent(productId)}?t=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.detail || "This document is unavailable.");
        return data;
      })
      .then((data) => { if (active) setMeta(data); })
      .catch((e) => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [id, productId, token]);

  // Explicit completion warnings: never silently call an unfinished plan submission-ready.
  const missingFields = FIELDS.filter(([key]) => !clean(answers[key])).map(([, label]) => label);
  const missingAreas = (meta?.areas || []).filter((area) =>
    !clean(areas[area]?.focus) || !clean(areas[area]?.activities) || !clean(areas[area]?.evidence));
  const incomplete = missingFields.length + missingAreas.length;
  const postDocument = async (action) => {
    setSending(true); setError("");
    try {
      const response = await fetch(`${API}/shop/orders/${encodeURIComponent(id)}/guided-document/${encodeURIComponent(productId)}/generate?t=${encodeURIComponent(token)}`, {
        method: "POST", headers: { "Content-Type":"application/json" }, cache:"no-store",
        body: JSON.stringify({ ...answers, areas, action, confirmed: action === "email" }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.detail || "Document preparation failed.");
      if (action === "preview") { setGeneratedPreview(result.preview); setPreview(true); }
      else setSent(true);
    } catch (e) { setError(e.message); }
    finally { setSending(false); }
  };
  const update = (key, value) => setAnswers((old) => ({ ...old, [key]: value.slice(0, 6000) }));
  const updateArea = (name, key, value) => setAreas((old) => ({
    ...old, [name]: { ...(old[name] || {}), [key]: value.slice(0, 6000) },
  }));
  const line = (label, value) => <section className="mb-5 break-inside-avoid">
    <h3 className="font-semibold mb-1">{label}</h3>
    <p className="whitespace-pre-wrap min-h-[38px]">{clean(value) || "To be completed by the family."}</p>
  </section>;

  return (
    <div className="min-h-screen bg-[#F5EFE0] text-stone-900 px-4 py-8 print:bg-white print:p-0">
      <style>{`@page { size: A4; margin: 18mm; } @media print {
        .no-print { display: none !important; }
        .document-sheet { box-shadow: none !important; border: 0 !important; padding: 0 !important; max-width: none !important; }
        .break-inside-avoid { break-inside: avoid; }
        a { color: #1c4532; }
      }`}</style>
      <div className="max-w-3xl mx-auto mb-4 no-print flex flex-wrap justify-between items-center gap-3">
        <Link className="underline text-sm" to={`/shop/order/${encodeURIComponent(id)}?t=${encodeURIComponent(token)}`}>← Back to paid order</Link>
        {meta && <div className="flex gap-2">
          <button className="rounded-lg border border-stone-400 px-4 py-2 text-sm" disabled={sending} onClick={() => preview ? setPreview(false) : postDocument("preview")}>{preview ? "Edit responses" : "Review generated document"}</button>
          {preview && !sent && <button disabled={sending} className="rounded-lg bg-[#4A5D3A] text-white px-4 py-2 text-sm font-semibold disabled:opacity-50" onClick={() => postDocument("email")}>{sending ? "Preparing..." : "Email my completed PDF"}</button>}
        </div>}
      </div>
      {error && <p className="max-w-3xl mx-auto p-5 bg-white rounded-xl text-red-800 no-print" role="alert">{error}</p>}
      {sent && <p className="max-w-3xl mx-auto p-5 bg-white rounded-xl text-emerald-800 font-semibold no-print" role="status">Your PDF has been emailed to the address used at checkout. Check your inbox.</p>}
      {!meta && !error && <p className="max-w-3xl mx-auto">Checking your purchase…</p>}
      {meta && !preview && <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 space-y-5 no-print">
        <h1 className="font-display text-2xl font-bold text-[#4A5D3A]">{meta.title}</h1>
        <p className="text-sm text-amber-900 rounded-lg bg-amber-50 p-3">{meta.notice}</p>
        <p className="text-sm">Your answers stay in this browser tab and aren't uploaded or saved on our servers. Keep the tab open until you've saved your PDF; closing or refreshing it clears your answers.</p>
        <p className="text-sm">Requirements source review: {meta.requirements_checked_on}. Please check the official links at the end of your document, as guidance may have changed.</p>
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); postDocument("preview"); }}>
          {FIELDS.map(([key, label, help]) => <label key={key} className="block space-y-1">
            <span className="font-semibold text-sm">{label}</span>
            <span className="block text-xs text-stone-600">{help}</span>
            {key === "learner_name" || key === "school_year"
              ? <input className={fieldClass} value={answers[key]} onChange={(e) => update(key, e.target.value)} maxLength={300} />
              : <textarea className={fieldClass} rows={3} value={answers[key]} onChange={(e) => update(key, e.target.value)} />}
          </label>)}
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block space-y-1 text-sm font-semibold">Year level
              <select value={answers.year_level} className={fieldClass} onChange={(e) => update("year_level", e.target.value)}>
                {["K","F","Prep",...Array.from({length:12},(_,i)=>String(i+1))].map((v)=><option key={v} value={v}>{v}</option>)}
              </select>
            </label>
            <label className="block space-y-1 text-sm font-semibold">Period starts
              <input type="date" className={fieldClass} value={answers.period_start} onChange={(e) => update("period_start",e.target.value)} required />
            </label>
            <label className="block space-y-1 text-sm font-semibold">Period ends
              <input type="date" className={fieldClass} value={answers.period_end} onChange={(e) => update("period_end",e.target.value)} required />
            </label>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-bold">Learning areas — {meta.state_name}</h2>
            <p className="text-sm text-stone-600">Use actual plans and resources. You may leave an area incomplete and return before printing.</p>
            {meta.areas.map((name) => <div key={name} className="rounded-lg border border-stone-200 p-3 space-y-2">
              <h3 className="font-semibold">{name}</h3>
              {[
                ["focus", "Topics and learning intentions"],
                ["activities", "Teaching activities and experiences"],
                ["evidence", "Progress checks, evidence and resources"],
              ].map(([key, label]) => <label key={key} className="block text-sm space-y-1">
                <span>{label}</span>
                <textarea className={fieldClass} rows={2} value={areas[name]?.[key] || ""} onChange={(e) => updateArea(name, key, e.target.value)} />
              </label>)}
            </div>)}
          </div>
          <button className="rounded-lg bg-[#4A5D3A] text-white px-5 py-3 font-semibold" type="submit" disabled={sending}>Generate and review document</button>
        </form>
      </div>}
      {meta && preview && <article className="document-sheet max-w-3xl mx-auto p-8 bg-white shadow-sm rounded-xl leading-relaxed text-sm">
        <header className="border-b border-stone-400 pb-4 mb-5">
          <p className="text-xs uppercase tracking-wide text-stone-600">Side-Quest • Independent home education planning resource</p>
          <h1 className="text-2xl font-bold mt-2">Family draft: {meta.plan_name}</h1>
          <p>{meta.state_name} • Requirements reference reviewed {meta.requirements_checked_on}</p>
          <p className="mt-2 text-xs">Not issued or approved by {meta.authority}. Parents must check current official registration instructions.</p>
        </header>
        <section className="mb-5 border border-amber-600 p-3 break-inside-avoid">
          <h2 className="font-bold">Completion and requirements review</h2>
          <p className="mt-1">{incomplete
            ? `Draft incomplete: ${missingFields.length} general sections and ${missingAreas.length} learning areas need more information.`
            : "All guided fields contain responses. This does NOT establish that your state's specific requirements are satisfied."}</p>
          {!!missingFields.length && <p className="mt-2">Unanswered sections: {missingFields.join("; ")}</p>}
          {!!missingAreas.length && <p className="mt-2">Incomplete learning areas: {missingAreas.join("; ")}</p>}
          <p className="mt-2">Check the generated goals, actual family plans, official requirements and supporting evidence before using the Email my completed PDF action. The generated content is a planning aid, not a claim that learning has occurred.</p>
        </section>
        {generatedPreview && <>
          <h2 className="text-xl font-bold mb-2 mt-6">Generated using Side-Quest's existing learning-plan builder</h2>
          {line("Plan overview",generatedPreview.overview)}
          {line("Teaching philosophy",generatedPreview.educational_philosophy)}
          {line("Weekly rhythm",generatedPreview.weekly_rhythm)}
          {line("Assessment approach",generatedPreview.assessment_approach)}
          {line("Review schedule",generatedPreview.review_schedule)}
          <h2 className="text-xl font-bold mb-2">Learning area goals and activities</h2>
          {(generatedPreview.learning_areas || []).map((a,i)=><section key={i} className="mb-5"><h3 className="font-bold">{a.area}</h3>
            <ul className="list-disc ml-5">{(a.goals || []).map((goal,j)=><li key={j}>{goal}</li>)}</ul>
            <p className="font-semibold mt-2">Suggested activities</p><ul className="list-disc ml-5">{(a.sample_activities || []).map((activity,j)=><li key={j}>{activity}</li>)}</ul>
          </section>)}
        </>}
        {FIELDS.map(([key, label]) => <React.Fragment key={key}>{line(label, answers[key])}</React.Fragment>)}
        <h2 className="text-xl font-bold mb-2 mt-6">Learning area plans</h2>
        {meta.areas.map((name) => <section key={name} className="mb-5 break-inside-avoid">
          <h3 className="text-lg font-bold border-b border-stone-300 pb-1">{name}</h3>
          {line("Topics and learning intentions", areas[name]?.focus)}
          {line("Teaching activities", areas[name]?.activities)}
          {line("Progress, evidence and resources", areas[name]?.evidence)}
        </section>)}
        {meta.secondary?.note && <section className="mb-5"><h3 className="font-bold">Secondary subject selection note</h3><p>{meta.secondary.note}</p></section>}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">State requirements checklist</h2>
          <p className="text-xs mb-2">Review each item yourself. This is not an automated compliance assessment.</p>
          <ul className="list-none space-y-2">{meta.requirements.map((r, i) => <li key={i}>☐ {r}</li>)}</ul>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-bold mb-2">Official guidance</h2>
          <ul className="space-y-2 break-words">{meta.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="underline">{s.title} — {s.url}</a></li>)}</ul>
        </section>
        <p className="text-xs text-stone-600 border-t pt-3">Prepared by the family with a Side-Quest planning tool. No government affiliation, legal advice or guarantee of registration or review outcome.</p>
      </article>}
    </div>
  );
}
