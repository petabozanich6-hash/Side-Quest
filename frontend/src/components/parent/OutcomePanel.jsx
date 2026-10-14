import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Target, Plus, X } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { usesNswOutcomes } from "../../data/australianCurriculum";

// Curriculum outcomes this lesson contributes to. Suggestions are picked from the outcome list Side-Quest holds
// (today the NSW syllabus) and are always the parent's call. A lesson contributes to an outcome; it never "completes" one.
export default function OutcomePanel({ lesson, onSaved }) {
  const [names, setNames] = useState({});
  const [sugg, setSugg] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const codes = lesson.outcome_codes || [];
  const { user } = useAuth();
  const nsw = usesNswOutcomes(user?.jurisdiction);

  useEffect(() => { api.get("/curriculum/outcomes").then(r => setNames(Object.fromEntries((r.data || []).map(o => [o.code, o.description])))).catch(() => {}); }, []);

  const save = async (next, extra = {}) => {
    const old = new Set(codes);
    const kept = (lesson.curriculum_refs || []).filter(x => !old.has(String(x).split(":")[0]));
    const refs = [...next.map(c => `${c}: ${names[c] || extra[c] || ""}`.slice(0, 200)), ...kept].slice(0, 10);
    setBusy(true);
    try { const { data } = await api.put(`/lessons/${lesson.id}`, { ...lesson, outcome_codes: next, curriculum_refs: refs }); onSaved(data); return true; }
    catch (e) { toast.error(e.response?.data?.detail || "Could not save the outcomes"); return false; }
    finally { setBusy(false); }
  };
  const match = async () => {
    setBusy(true); setSugg(null);
    try { const { data } = await api.post(`/lessons/${lesson.id}/match-outcomes`); setSugg(data.suggestions || []); setNote(data.note || ""); if (!(data.suggestions || []).length) toast.message("No close match found. You can add a code yourself in the manual editor."); }
    catch (e) { toast.error(e.response?.data?.detail || "Could not match outcomes just now"); }
    finally { setBusy(false); }
  };

  return (
    <section className="rounded-2xl border border-slate-300 bg-white p-4 space-y-3" data-testid="outcome-panel">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2"><Target size={18} /> Curriculum outcomes</h2>
        {nsw && <button type="button" disabled={busy} onClick={match} className="rounded-full border border-slate-900 px-3 py-1.5 text-sm font-semibold disabled:opacity-50" data-testid="outcome-match">{codes.length ? "Find other matches" : "Match to outcomes"}</button>}
      </div>
      {nsw && codes.length === 0 && !sugg && <p className="text-sm text-slate-600" data-testid="outcome-none">This lesson is not linked to any outcome yet. Press <b>Match to outcomes</b> and Side-Quest will suggest the closest ones for you to confirm.</p>}
      {codes.map(c => (
        <div key={c} className="flex items-start justify-between gap-3 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm" data-testid="outcome-linked">
          <span><b>{c}</b> {names[c] ? `— ${names[c]}` : ""}</span>
          <button type="button" disabled={busy} onClick={() => save(codes.filter(x => x !== c))} aria-label={`Remove ${c}`} className="shrink-0 text-slate-600 hover:text-rose-700" data-testid="outcome-remove"><X size={16} /></button>
        </div>
      ))}
      {sugg && sugg.length > 0 && (
        <div className="space-y-2" data-testid="outcome-suggestions">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Suggested</p>
          {sugg.map(o => (
            <div key={o.code} className="flex items-start justify-between gap-3 rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <span><b>{o.code}</b> — {o.description}<span className="block text-xs text-slate-500">{o.confidence === "likely" ? "Best match" : "Possible match"} · {o.source}</span></span>
              <button type="button" disabled={busy || codes.includes(o.code)} onClick={async () => { if (await save([...codes, o.code], { [o.code]: o.description })) setSugg(s => s.filter(x => x.code !== o.code)); }} className="shrink-0 rounded-full bg-emerald-700 text-white px-3 py-1 text-xs font-semibold disabled:opacity-50" data-testid="outcome-add"><Plus size={12} className="inline -mt-0.5" /> Link</button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-500" data-testid="outcome-note">{!nsw ? `Side-Quest doesn't hold the ${user?.jurisdiction} curriculum outcome list yet, so outcome matching is off for your family rather than suggesting NSW outcomes that don't apply. Record outcomes from your own curriculum in the lesson's curriculum references.` : note || "Suggestions come from the outcome list Side-Quest holds, which is currently the NSW syllabus (other states and territories are not loaded yet). A lesson contributes to an outcome; it does not complete it. Please check against your own state or territory's requirements."} Linked outcomes appear when you review your child's work.</p>
    </section>
  );
}
