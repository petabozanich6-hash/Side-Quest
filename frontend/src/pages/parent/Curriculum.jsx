import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { ExternalLink } from "lucide-react";

export default function CurriculumPage() {
  const [stages, setStages] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedStage, setSelectedStage] = useState("S2");

  useEffect(() => { api.get("/curriculum/stages").then(r => setStages(r.data)); }, []);
  useEffect(() => {
    api.get(`/curriculum/outcomes?stage=${selectedStage}`).then(r => setOutcomes(r.data));
    const stageObj = stages.find(s => s.code === selectedStage);
    if (stageObj) api.get(`/curriculum/learning-areas?band=${stageObj.band}`).then(r => setAreas(r.data));
  }, [selectedStage, stages]);

  const currentStage = stages.find(s => s.code === selectedStage);

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="curriculum-page">
      <header>
        <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>NSW Curriculum</h1>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl">The initial curriculum framework is NSW Australia. Outcomes shown are plain-language representations. Deep-link to the NESA source any time — no digging required.</p>
      </header>

      <section>
        <h2 className="font-display text-lg font-bold mb-3" style={{color:"#1F3B2D"}}>Stages</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {stages.map(s => (
            <button key={s.code} onClick={() => setSelectedStage(s.code)}
              className={`rounded-xl border p-3 text-left transition ${selectedStage === s.code ? "" : "bg-white hover:border-stone-400"}`}
              style={selectedStage === s.code ? {backgroundColor:"#1F3B2D", color:"#F5EFE0", borderColor:"#1F3B2D"} : {borderColor:"#D4C8A8"}}
              data-testid={`stage-${s.code}`}>
              <div className="font-mono text-xs opacity-70">{s.code}</div>
              <div className="font-display font-bold mt-1 text-sm">{s.name}</div>
              <div className="text-xs opacity-70 mt-1">{s.years}</div>
              <div className="text-[10px] uppercase tracking-wider mt-2 opacity-60">{s.band}</div>
            </button>
          ))}
        </div>
      </section>

      {currentStage?.source_link && (
        <a href={currentStage.source_link.url} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold hover:translate-y-[-1px] transition"
          style={{backgroundColor:"#F5EFE0", border:"1px solid #D4C8A8", color:"#1F3B2D"}}
          data-testid="stage-source-link">
          <ExternalLink size={14}/> Open NESA source — {currentStage.source_link.name}
        </a>
      )}

      {areas.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-bold mb-2" style={{color:"#1F3B2D"}}>Jump to NESA by learning area</h2>
          <div className="flex flex-wrap gap-2" data-testid="area-links">
            {areas.map(a => a.source_link && (
              <a key={a.name} href={a.source_link} target="_blank" rel="noreferrer"
                className="rounded-full border px-3 py-1 text-xs font-semibold flex items-center gap-1 hover:border-stone-500"
                style={{borderColor:"#D4C8A8", color:"#4A5D3A"}}
                data-testid={`area-link-${a.name.replace(/\s+/g,'-')}`}>
                <ExternalLink size={11}/> {a.name}
              </a>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-lg font-bold mb-3" style={{color:"#1F3B2D"}}>Outcomes for {selectedStage} ({outcomes.length})</h2>
        <div className="paper-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider font-bold text-stone-500" style={{backgroundColor:"#F5EFE0"}}>
              <tr><th className="p-3">Code</th><th className="p-3">Learning area</th><th className="p-3">Description</th><th className="p-3">Source</th></tr>
            </thead>
            <tbody>
              {outcomes.map(o => (
                <tr key={o.code} className="border-t" style={{borderColor:"#E8E2D1"}} data-testid={`outcome-${o.code}`}>
                  <td className="p-3 font-mono text-xs" style={{color:"#1F3B2D"}}>{o.code}</td>
                  <td className="p-3 whitespace-nowrap">{o.learning_area}</td>
                  <td className="p-3 text-stone-700">{o.description}</td>
                  <td className="p-3 text-xs text-stone-500">{o.source}</td>
                </tr>
              ))}
              {outcomes.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-stone-500 text-sm">No outcomes seeded for this stage yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
        <strong className="font-semibold">Reminder:</strong> Always verify AI and seeded outcome mappings against the official NESA source before relying on them for inspection.
      </div>
    </div>
  );
}
