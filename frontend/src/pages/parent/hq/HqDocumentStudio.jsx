import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";
import HqDocumentProducts from "./HqDocumentProducts";

// Owner HQ workspace. Requirements come directly from the same server catalogue
// used by the existing subscription learning-plan tools. No AI calls and no
// private parent/child records are accessed.
const OFFERS = [
  { id: "blank", name: "Blank fillable state template", price: "$14.95", note: "A reusable, independently prepared PDF with fields and a state-specific checklist." },
  { id: "guided", name: "Guided personalised document", price: "$29.95", note: "A questionnaire-backed document populated from the family's own answers, with a final review step." },
  { id: "review", name: "Owner-reviewed preparation", price: "From $69.95", note: "A future manual service for checking completeness, not government approval." },
];
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
        <p className="text-sm rounded-xl bg-amber-50 p-3 text-amber-950">Quality-controlled draft workspace: home education document sales are blocked by the backend until an independent state-specific requirements review and document approval system is in place. A checked box or uploaded PDF is not sufficient for publication.</p>
      </header>

      <section className="paper-card p-5 space-y-3">
        <h3 className="font-bold text-lg">Document catalogue and pricing</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {OFFERS.map((offer) => <article key={offer.id} className="rounded-xl border border-stone-200 bg-white p-4 space-y-2">
            <h4 className="font-semibold">{offer.name}</h4>
            <p className="text-xl font-bold text-[#4A5D3A]">{offer.price} AUD</p>
            <p className="text-sm text-stone-700">{offer.note}</p>
            <span className="inline-block text-xs rounded-full bg-stone-100 px-2 py-1">Not for sale yet</span>
          </article>)}
        </div>
        <p className="text-sm text-stone-600">The existing <Link className="underline text-[#4A5D3A]" to="/parent/command-centre/shop">Owner HQ Shop</Link> already handles digital products and Square payments. Document-specific products are currently locked from sale pending independent review, even after a PDF is uploaded. The existing Square checkout already enforces paid-order download access for ordinary digital products.</p>
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
