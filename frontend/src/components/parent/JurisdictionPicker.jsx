import React, { useState } from "react";
import { MapPinned } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { AUSTRALIAN_JURISDICTIONS } from "../../data/australianCurriculum";

/** Australia-wide plus an explicit international option; shared by registration and settings. */
export function JurisdictionSelect({ value, onChange, testid = "jurisdiction-select", className = "input", required = true }) {
  return (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)} required={required}
      className={className} aria-label="State, territory or outside Australia" data-testid={testid}>
      <option value="">Choose your location…</option>
      {AUSTRALIAN_JURISDICTIONS.map((j) => <option key={j.code} value={j.code}>{j.name} ({j.code})</option>)}
      <option value="OTHER">Other / Outside Australia</option>
    </select>
  );
}

export async function saveJurisdiction(code, setSession, user) {
  const { data } = await api.put("/me/jurisdiction", { jurisdiction: code });
  setSession(null, { ...user, jurisdiction: data.jurisdiction });
  return data.jurisdiction;
}

/**
 * Shown once to a parent whose family has no state or territory yet: accounts made before this setting existed, and
 * families who signed up with Google. It can't be dismissed, because the rest of the site loads content for that choice.
 */
export default function JurisdictionGate() {
  const { user, setSession } = useAuth();
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  if (!user || user.role !== "parent" || user.jurisdiction || unavailable) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!code) return;
    setSaving(true);
    try { await saveJurisdiction(code, setSession, user); toast.success(code === "OTHER" ? "Saved. Your family can use parent-defined goals without Australian curriculum codes." : "Saved. We'll show resources for your state or territory."); }
    catch (err) {
      // The server can't store it yet (database update pending): don't trap the parent behind this prompt.
      if (err.response?.status === 503) { setUnavailable(true); toast.message("We couldn't save your state just yet. We'll ask again later."); return; }
      toast.error(err.response?.data?.detail || "Couldn't save that. Please try again.");
    }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="jurisdiction-gate-title" data-testid="jurisdiction-gate">
      <form onSubmit={submit} className="paper-card w-full max-w-md p-6 space-y-4 bg-white">
        <div className="flex items-center gap-2 text-emerald-800"><MapPinned size={20} aria-hidden="true" /><span className="text-xs font-bold uppercase tracking-wider">One quick question</span></div>
        <h2 id="jurisdiction-gate-title" className="font-display text-2xl font-bold" style={{ color: "#1F3B2D" }}>Where does your family home educate?</h2>
        <p className="text-sm text-stone-600">Choose an Australian state or territory for local curriculum guidance, or choose Other / Outside Australia to use flexible family goals without Australian outcome codes. Check the requirements where you live. You can change this later in Curriculum.</p>
        <JurisdictionSelect value={code} onChange={setCode} testid="jurisdiction-gate-select" />
        <button disabled={!code || saving} className="w-full rounded-full py-3 text-sm font-bold disabled:opacity-50" style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }} data-testid="jurisdiction-gate-save">{saving ? "Saving…" : "Save and continue"}</button>
        <style>{`.input { width: 100%; border-radius: 0.75rem; border: 1px solid #D4C8A8; padding: 0.6rem 0.85rem; font-size: 0.875rem; background: #fff; }`}</style>
      </form>
    </div>
  );
}
