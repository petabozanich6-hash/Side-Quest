import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function CurriculumPage() {
  const [stages, setStages] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [selectedStage, setSelectedStage] = useState("S2");

  useEffect(() => { api.get("/curriculum/stages").then(r => setStages(r.data)); }, []);
  useEffect(() => { api.get(`/curriculum/outcomes?stage=${selectedStage}`).then(r => setOutcomes(r.data)); }, [selectedStage]);

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="curriculum-page">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900">NSW Curriculum</h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">The initial curriculum framework is NSW Australia. Outcomes shown are plain-language representations. Verify against the current NESA source before relying on them.</p>
      </header>

      <section>
        <h2 className="font-display text-lg font-semibold mb-3">Stages</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {stages.map(s => (
            <button key={s.code} onClick={() => setSelectedStage(s.code)}
              className={`rounded-xl border p-3 text-left transition ${selectedStage === s.code ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-400"}`}
              data-testid={`stage-${s.code}`}>
              <div className="font-mono text-xs opacity-70">{s.code}</div>
              <div className="font-display font-semibold mt-1 text-sm">{s.name}</div>
              <div className="text-xs opacity-70 mt-1">{s.years}</div>
              <div className="text-[10px] uppercase tracking-wider mt-2 opacity-60">{s.band}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold mb-3">Sample outcomes for {selectedStage}</h2>
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr><th className="p-3">Code</th><th className="p-3">Learning area</th><th className="p-3">Description</th><th className="p-3">Source</th></tr>
            </thead>
            <tbody>
              {outcomes.map(o => (
                <tr key={o.code} className="border-t border-slate-100" data-testid={`outcome-${o.code}`}>
                  <td className="p-3 font-mono text-xs">{o.code}</td>
                  <td className="p-3 whitespace-nowrap">{o.learning_area}</td>
                  <td className="p-3 text-slate-700">{o.description}</td>
                  <td className="p-3 text-xs text-slate-500">{o.source}</td>
                </tr>
              ))}
              {outcomes.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-slate-500 text-sm">No sample outcomes seeded for this stage yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
        <strong className="font-semibold">Reminder:</strong> AI-generated outcome mappings must be reviewed by the parent against NESA before being treated as official.
      </div>
    </div>
  );
}
