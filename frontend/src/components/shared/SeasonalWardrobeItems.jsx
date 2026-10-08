import React from "react";
import { toast } from "sonner";
import useSeasonal, { setWornPrizes } from "./useSeasonal";

export default function SeasonalWardrobeItems({ hatched }) {
  const { keepsakes } = useSeasonal();

  const toggle = async (pack) => {
    const current = keepsakes.filter(k => k.worn).map(k => k.pack);
    const next = current.includes(pack) ? current.filter(p => p !== pack) : [...current, pack];
    try { await setWornPrizes(next); }
    catch { toast.error("Could not change this prize"); }
  };

  return (
    <>
      {keepsakes.map(k => (
        <button key={k.pack} disabled={!hatched} onClick={() => toggle(k.pack)}
          className="rounded-xl border-2 p-3 text-center disabled:opacity-40"
          style={{ borderColor: k.worn ? "#1F3B2D" : "#D4C8A8", background: k.worn ? "#ECFCCB" : "#fff" }}
          data-testid={`seasonal-acc-${k.pack}`}>
          <div className="text-3xl">{k.emoji}</div>
          <div className="text-[11px] font-bold mt-1" style={{ color: "#1F3B2D" }}>{k.name}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">{k.label}</div>
        </button>
      ))}
    </>
  );
}
