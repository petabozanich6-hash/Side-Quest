import React, { useEffect, useState } from "react";
import { adminApi, errorText } from "../../../lib/adminApi";
import HqHomeEducationPublisher from "./HqHomeEducationPublisher";
import HqStudioPublisher from "./HqStudioPublisher";

const input = "w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm";

export default function HqDocumentStudio() {
  const [data, setData] = useState(null);
  const [state, setState] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    adminApi.get("/document-studio/requirements")
      .then(value => { if (active) setData(value); })
      .catch(err => { if (active) setError(errorText(err, "Could not load jurisdiction guidance.")); });
    return () => { active = false; };
  }, []);
  const selected = data?.jurisdictions?.find(j => j.code === state);
  return <div className="space-y-5" data-testid="hq-document-studio">
    <header className="paper-card p-5 space-y-3">
      <p className="text-xs font-bold tracking-widest text-[#4A5D3A]">SIDE-QUEST · OWNER HQ</p>
      <h2 className="text-2xl font-bold text-[#1F3B2D]">Document Studio</h2>
      <p className="text-sm">Create print-ready and fillable A4 PDFs for your separate Square shop. No Side-Quest checkout, order management or automatic Square publishing is involved.</p>
      {error && <p role="alert" className="text-red-800">{error}</p>}
      {!data && !error && <p role="status" className="text-sm">Loading document templates…</p>}
      {data && <label className="block max-w-md text-sm font-semibold">State or territory
        <select data-testid="hq-document-studio-jurisdiction" aria-label="State or territory" className={input + " mt-1"} value={state} onChange={e => setState(e.target.value)}>
          <option value="">Select a state or territory</option>
          {data.jurisdictions.map(j => <option key={j.code} value={j.code}>{j.name}</option>)}
        </select>
      </label>}
      <p className="text-xs text-amber-900">Source guidance last reviewed {data?.checked_on || "previously"}. Verify current official requirements before selling or using these resources.</p>
    </header>
    {selected && <HqHomeEducationPublisher jurisdiction={selected} checkedOn={data?.checked_on} />}
    <details className="paper-card p-5">
      <summary className="cursor-pointer text-lg font-bold text-[#1F3B2D]">Other printable activity and worksheet layouts</summary>
      <div className="pt-4"><HqStudioPublisher /></div>
    </details>
  </div>;
}
