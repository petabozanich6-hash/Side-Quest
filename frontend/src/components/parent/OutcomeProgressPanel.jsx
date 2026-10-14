import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "../../lib/api";

// The five-level progression shared with Auto-Quest. Only a parent ever sets "Achieved".
export const LEVELS = [
  ["not_started", "Not Started", "pill-not-started"],
  ["introduced", "Introduced", "pill-opened"],
  ["developing", "Developing", "pill-submitted"],
  ["demonstrated", "Demonstrated", "pill-accepted"],
  ["achieved", "Achieved", "pill-completed"],
];
const LABEL = Object.fromEntries(LEVELS.map(([k, l]) => [k, l]));
const PILL = Object.fromEntries(LEVELS.map(([k, , p]) => [k, p]));

export default function OutcomeProgressPanel({ studentId }) {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState("");
  const load = () => api.get(`/students/${studentId}/outcome-progress`).then(r => setData(r.data)).catch(() => setData({ error: true }));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [studentId]);

  const areas = useMemo(() => {
    const m = new Map();
    for (const o of data?.outcomes || []) { if (!m.has(o.learning_area)) m.set(o.learning_area, []); m.get(o.learning_area).push(o); }
    return [...m.entries()];
  }, [data]);

  const set = async (o, level) => {
    setSaving(o.code);
    try {
      const r = await api.put(`/students/${studentId}/outcome-progress/${encodeURIComponent(o.code)}`, { level });
      setData(d => ({ ...d, outcomes: d.outcomes.map(x => x.code === o.code ? { ...x, ...r.data } : x), counts: recount(d.outcomes.map(x => x.code === o.code ? { ...x, level: r.data.level } : x)) }));
      toast.success(`${o.code}: ${LABEL[r.data.level]}`);
    } catch (e) { toast.error(e.response?.data?.detail || "Could not save that"); }
    finally { setSaving(""); }
  };

  if (!data) return <section className="paper-card p-6 text-sm text-stone-500">Loading outcome progress…</section>;
  if (data.error) return null;
  return (
    <section className="paper-card p-6 space-y-4" data-testid="outcome-progress">
      <div>
        <h2 className="font-display text-xl font-bold" style={{color:"#1F3B2D"}}>Curriculum outcome progress</h2>
        {data.available ? (
          <p className="text-xs text-stone-600 mt-1 max-w-3xl">Levels rise automatically when you review {data.student.name}'s work, but never past <b>Demonstrated</b>: finishing a lesson is evidence, not proof of mastery. Only you mark an outcome <b>Achieved</b>, and anything you set yourself is never lowered automatically. {data.framework}.</p>
        ) : <p className="text-sm text-stone-600 mt-1" data-testid="outcome-progress-unavailable">{data.note}</p>}
      </div>
      {data.available && (
        <>
          <div className="flex flex-wrap gap-2" data-testid="outcome-progress-counts">
            {LEVELS.map(([k, l, p]) => <span key={k} className={`pill ${p}`}>{l}: {data.counts[k] || 0}</span>)}
          </div>
          {areas.map(([area, list]) => (
            <details key={area} className="rounded-xl border border-stone-200 bg-white/70">
              <summary className="cursor-pointer px-4 py-2 font-semibold" style={{color:"#1F3B2D"}}>
                {area} <span className="text-xs font-normal text-stone-500">· {list.filter(o => o.level === "achieved").length} of {list.length} achieved</span>
              </summary>
              <ul className="divide-y divide-stone-100">
                {list.map(o => (
                  <li key={o.code} className="px-4 py-2 flex flex-wrap items-center gap-3" data-testid={`outcome-${o.code}`}>
                    <div className="flex-1 min-w-[14rem]">
                      <p className="text-xs font-mono text-stone-500">{o.code}{o.parent_confirmed && <span className="ml-2 font-sans text-emerald-800">· set by you</span>}</p>
                      <p className="text-sm text-stone-800">{o.description}</p>
                    </div>
                    <span className={`pill ${PILL[o.level]}`}>{LABEL[o.level]}</span>
                    <select aria-label={`Level for ${o.code}`} disabled={saving === o.code} value={o.level} onChange={e => set(o, e.target.value)} className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-sm" data-testid={`outcome-level-${o.code}`}>
                      {LEVELS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </select>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </>
      )}
    </section>
  );
}

function recount(outcomes) {
  const c = Object.fromEntries(LEVELS.map(([k]) => [k, 0]));
  for (const o of outcomes) c[o.level] = (c[o.level] || 0) + 1;
  return c;
}
