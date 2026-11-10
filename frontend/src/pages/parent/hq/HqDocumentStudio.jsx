import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";
import HqDocumentProducts from "./HqDocumentProducts";

// Owner HQ workspace. Requirements come directly from the same server catalogue
// used by the existing subscription learning-plan tools. No AI calls and no
// private parent/child records are accessed.
const input = "w-full rounded-xl border border-stone-300 bg-white p-2 text-sm";

export default function HqDocumentStudio() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState("NSW");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api.get("/home-education/document-requirements")
      .then(({ data }) => { if (active) setData(data); })
      .catch(() => { if (active) setError("Could not load the existing state requirements. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const jur = data?.jurisdictions?.find((j) => j.code === selected);
  return (
    <div className="space-y-5" data-testid="hq-document-studio">
      <header className="paper-card p-5 space-y-2">
        <h2 className="text-2xl font-bold text-[#4A5D3A]">Home Education Document Studio</h2>
        <p className="text-sm text-stone-700">Prepare state-specific home education templates for sale, using the requirements already built into Side-Quest's subscriber learning plans.</p>
        <p className="text-sm rounded-xl bg-amber-50 p-3 text-amber-950">Home education products are created and reviewed here. Only individually approved document revisions may be activated. Unreviewed content and untested physical fulfilment remain blocked from sale.</p>
      </header>

      <section className="paper-card p-5 space-y-3">
        <h3 className="font-bold text-lg">Create → Preview → Review → Activate</h3>
        <p className="text-sm text-stone-700">The products, real prices, full PDF previews and publication controls are managed below for each state. Families can browse sample pages in the shop and, after payment, complete the guided setup relevant to their purchase.</p>
        <p className="text-sm text-stone-700">Standard documents: blank fillable PDF $4.99 (+$1 per extra child); guided personalised PDF $9.99 (+$2 per extra child); basic print-and-post $14.99 including delivery (+$2 per extra child).</p>
        <p className="text-sm text-stone-700">Complete Home Education Planner & Diary: blank PDF $29.95; personalised family PDF $39.95; personalised spiral-bound printed copy $69.95 including Australian delivery. The premium versions include lesson plans, outcomes, reading logs, evidence tracking, progress reviews and curriculum preparation.</p>
        <p className="text-xs text-amber-900">Actual existing product prices are displayed in the product workspace below; no listings are silently repriced. Publication is version-bound and requires documented quality review. Printed editions remain on hold pending production and dispatch verification.</p>
      </section>

      <section className="paper-card p-5 space-y-3">
        <div className="flex flex-wrap gap-3 items-end justify-between">
          <div>
            <h3 className="font-bold text-lg">Shared state requirements</h3>
            <p className="text-xs text-stone-600">Source: existing subscriber learning-plan catalogue</p>
          </div>
          {data?.checked_on && <span className="text-xs font-semibold text-amber-900">Last source review: {data.checked_on}</span>}
        </div>
        {loading && <p role="status">Loading state guidance…</p>}
        {error && <p role="alert" className="text-red-800">{error}</p>}
        {data && <>
          <label className="block text-sm font-semibold max-w-md">State or territory
            <select className={input} value={selected} onChange={(e) => setSelected(e.target.value)}>
              {data.jurisdictions.map((j) => <option key={j.code} value={j.code}>{j.name}</option>)}
            </select>
          </label>
          {jur && <>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div><dt className="font-semibold">Education authority</dt><dd>{jur.authority}</dd></div>
              <div><dt className="font-semibold">Local document terminology</dt><dd>{jur.plan_name}</dd></div>
            </dl>
            <p className="text-sm text-stone-700">{jur.curriculum}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Planning and documentation checklist</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">{jur.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Learning areas</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">{jur.areas.map((a, i) => <li key={i}>{a}</li>)}</ul>
                {jur.secondary && <p className="text-xs mt-2 text-stone-600">Secondary: {jur.secondary.note}</p>}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Official sources to check before selling</h4>
              <ul className="space-y-1 text-sm">{jur.sources.map((s) => <li key={s.url}><a className="underline text-[#4A5D3A]" href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>)}</ul>
            </div>
          </>}
        </>}
      </section>
      <HqDocumentProducts jurisdiction={jur} />
      <section className="paper-card p-5 space-y-2">
        <h3 className="font-bold text-lg">Release checks</h3>
        <p className="text-sm text-stone-700">Document sales remain blocked pending independent state-specific review. Confirm the current official rules and forms; map every mandatory item to a section; assess educational substance, individualisation and genuine fillable fields; test missing-content warnings, privacy, verified paid access, versioning, and real sample submissions before implementing an approval-based release gate.</p>
        <p className="text-sm text-stone-700">Official application forms remain free from their issuing authorities. Side-Quest products should provide independent planning assistance, not impersonate government forms or promise registration approval.</p>
      </section>
    </div>
  );
}
