import React from "react";
import { toast } from "sonner";
import useSeasonal, { setWornPrizes } from "./useSeasonal";

export default function SeasonalWardrobeItems({ hatched }) {
  const { keepsakes, maxWorn } = useSeasonal();

  const toggle = async (id) => {
    const current = keepsakes.filter(k => k.worn).map(k => k.id);
    if (!current.includes(id) && current.length >= maxWorn) {
      toast.error(`Take one off first. You can wear ${maxWorn} prizes at a time.`);
      return;
    }
    const next = current.includes(id) ? current.filter(p => p !== id) : [...current, id];
    try { await setWornPrizes(next); }
    catch (e) { toast.error(e?.response?.data?.detail || "Could not change this prize"); }
  };

  return (
    <>
      {keepsakes.map(k => (
        <button key={k.id} disabled={!hatched} onClick={() => toggle(k.id)}
          className="rounded-xl border-2 p-3 text-center disabled:opacity-40"
          style={{ borderColor: k.worn ? "#1F3B2D" : "#D4C8A8", background: k.worn ? "#ECFCCB" : "#fff" }}
          data-testid={`seasonal-acc-${k.id}`}>
          <div className="text-3xl">{k.emoji}</div>
          <div className="text-[11px] font-bold mt-1" style={{ color: "#1F3B2D" }}>{k.name}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">{k.label} {k.year}</div>
        </button>
      ))}
    </>
  );
}
