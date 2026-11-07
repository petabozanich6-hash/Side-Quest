import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { api, apiErrorMessage } from "../../lib/api";

/**
 * Owner-only "View site as" switch. It changes how Side-Quest treats the owner's OWN family
 * (member, free preview or preview ended) so the owner can see exactly what families see.
 * The server checks the real owner role and switches it off automatically after a couple of hours.
 */
export function useViewAs(isOwner) {
  const [state, setState] = useState(null);
  useEffect(() => {
    if (!isOwner) { setState(null); return undefined; }
    let alive = true;
    api.get("/owner/view-as", { params: { _: Date.now() } }).then((r) => { if (alive) setState(r.data); }).catch(() => {});
    return () => { alive = false; };
  }, [isOwner]);
  const change = async (mode) => {
    try {
      await api.put("/owner/view-as", { mode });
      // Reload so every page re-reads the plan it should now show.
      window.location.reload();
    } catch (e) {
      toast.error(apiErrorMessage(e, "Could not switch the view"));
    }
  };
  return { state, change };
}

export function ViewAsPicker({ state, change }) {
  if (!state) return null;
  return (
    <label className="block px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-stone-500" data-testid="owner-view-as">
      <span className="flex items-center gap-1"><Eye size={12} /> View site as</span>
      <select value={state.mode} onChange={(e) => change(e.target.value)}
        className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm font-semibold normal-case tracking-normal text-slate-800">
        {state.modes.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
      </select>
    </label>
  );
}

export function ViewAsBanner({ state, change }) {
  if (!state || state.mode === "owner") return null;
  const until = state.expires_at ? new Date(state.expires_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";
  return (
    <div role="status" data-testid="owner-view-as-banner" className="sticky top-0 z-30 flex flex-wrap items-center justify-center gap-3 px-4 py-2 text-sm font-semibold text-amber-950" style={{ backgroundColor: "#F6D88B" }}>
      <Eye size={16} />
      <span>You're viewing Side-Quest as a <b>{state.label.toLowerCase()}</b> family{until ? ` (switches off at ${until})` : ""}. Only your own account is affected.</span>
      <button type="button" onClick={() => change("owner")} className="rounded-full bg-amber-950 text-amber-50 px-3 py-1 text-xs font-bold">Back to owner view</button>
    </div>
  );
}
