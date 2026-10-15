import React, { useState } from "react";
import { toast } from "sonner";
import { Target, Plus, X } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { usesNswOutcomes, hasVerifiedCodes } from "../../data/australianCurriculum";

// Curriculum outcomes this lesson contributes to. Suggestions are picked from the outcome list Side-Quest holds
// (today the NSW syllabus) and are always the parent's call. A lesson contributes to an outcome; it never "completes" one.
export default function OutcomePanel({ lesson, onSaved }) {
  const [sugg, setSugg] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const codes = lesson.outcome_codes || [];
  const { user } = useAuth();
  const nsw = usesNswOutcomes(user?.jurisdiction);
  const verified = hasVerifiedCodes(user?.jurisdiction);
  const [manual, setManual] = useState("");
  const addManual = async () => {
    const code = manual.trim();
    if (!code || codes.includes(code)) return;
    if (await save([...codes, code])) {
      setManual("");
      // The server keeps only official codes from your curriculum; tell the parent if it was dropped.
    }
  };

  // Outcomes are referenced by official code only; the wording stays with the curriculum authority.
  const save = async (next) => {
    const wanted = next[next.length - 1];
    const old = new Set(codes);
    const kept = (lesson.curriculum_refs || []).filter(x => !old.has(String(x).split(":")[0].trim()));
    const refs = [...next, ...kept].slice(0, 10);
    setBusy(true);
    try {
      const { data } = await api.put(`/lessons/${lesson.id}`, { ...lesson, outcome_codes: next, curriculum_refs: refs });
      onSaved(data);
      if (wanted && next.length > codes.length && !(data.outcome_codes || []).includes(wanted)) { toast.error(`${wanted} isn't an official outcome code in your curriculum, so it wasn't linked.`); return false; }
      return true;
    }
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
          <span><b className="font-mono">{c}</b></span>
          <button type="button" disabled={busy} onClick={() => save(codes.filter(x => x !== c))} aria-label={`Remove ${c}`} className="shrink-0 text-slate-600 hover:text-rose-700" data-testid="outcome-remove"><X size={16} /></button>
        </div>
      ))}
      {sugg && sugg.length > 0 && (
        <div className="space-y-2" data-testid="outcome-suggestions">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Suggested</p>
          {sugg.map(o => (
            <div key={o.code} className="flex items-start justify-between gap-3 rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <span><b className="font-mono">{o.code}</b> <span className="text-slate-600">· {o.learning_area}</span><span className="block text-xs text-slate-500">{o.confidence === "likely" ? "Best match" : "Possible match"} · {o.source}</span></span>
              <button type="button" disabled={busy || codes.includes(o.code)} onClick={async () => { if (await save([...codes, o.code])) setSugg(s => s.filter(x => x.code !== o.code)); }} className="shrink-0 rounded-full bg-emerald-700 text-white px-3 py-1 text-xs font-semibold disabled:opacity-50" data-testid="outcome-add"><Plus size={12} className="inline -mt-0.5" /> Link</button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-500" data-testid="outcome-note">{!nsw ? `Side-Quest doesn't hold the ${user?.jurisdiction} curriculum outcome list yet, so outcome matching is off for your family rather than suggesting NSW outcomes that don't apply. Record outcomes from your own curriculum in the lesson's curriculum references.` : note || "Suggestions come from the outcome list Side-Quest holds, which is currently the NSW syllabus (other states and territories are not loaded yet). A lesson contributes to an outcome; it does not complete it. Please check against your own state or territory's requirements."} Linked outcomes appear when you review your child's work.</p>
      {verified && (
        <div className="flex flex-wrap items-center gap-2" data-testid="outcome-manual">
          <input value={manual} onChange={e => setManual(e.target.value.toUpperCase().replace(/\s+/g, ""))} placeholder={nsw ? "e.g. MA2-RN-01" : "e.g. AC9M3N01"} aria-label="Outcome code" className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-mono w-44" data-testid="outcome-manual-code" />
          <button type="button" disabled={busy || !manual.trim()} onClick={addManual} className="rounded-full border border-slate-900 px-3 py-1.5 text-sm font-semibold disabled:opacity-50" data-testid="outcome-manual-add">Link code</button>
          <a href={nsw ? "https://curriculum.nsw.edu.au/" : "https://v9.australiancurriculum.edu.au/"} target="_blank" rel="noopener noreferrer" className="text-xs underline text-slate-600">Look up codes and wording</a>
        </div>
      )}
      {!verified && <p className="text-xs text-slate-600" data-testid="outcome-unavailable">Side-Quest doesn't hold a verified outcome list for your state or territory yet, so no codes are attached. Your lessons and evidence are still recorded.</p>}
    </section>
  );
}
