import React from "react";
import { toast } from "sonner";
import useSeasonal, { setWornPrizes } from "./useSeasonal";

const SLOT_LABEL = {
  head: "Head", face: "Face", neck: "Neck", chest: "Chest", left: "Left side",
  right: "Right side", ears: "Ears", feet: "Feet", cheeks: "Cheeks",
};

export default function SeasonalWardrobeItems({ hatched }) {
  const { keepsakes, maxWorn } = useSeasonal();

  const toggle = async (item) => {
    let next = keepsakes.filter(k => k.worn);
    if (item.worn) {
      next = next.filter(k => k.id !== item.id);
    } else {
      next = next.filter(k => k.slot !== item.slot);
      if (next.length >= maxWorn) {
        toast.error(`Take one off first. You can wear ${maxWorn} prizes at a time.`);
        return;
      }
      next = [...next, item];
    }
    try { await setWornPrizes(next.map(k => k.id)); }
    catch (e) { toast.error(e?.response?.data?.detail || "Could not change this prize"); }
  };

  return (
    <>
      {keepsakes.map(k => (
        <button key={k.id} disabled={!hatched} onClick={() => toggle(k)}
          className="rounded-xl border-2 p-3 text-center disabled:opacity-40"
          style={{ borderColor: k.worn ? "#1F3B2D" : "#D4C8A8", background: k.worn ? "#ECFCCB" : "#fff" }}
          data-testid={`seasonal-acc-${k.id}`}>
          <div className="text-3xl">{k.emoji}</div>
          <div className="text-[11px] font-bold mt-1" style={{ color: "#1F3B2D" }}>{k.name}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">{SLOT_LABEL[k.slot] || ""} · {k.label} {k.year}</div>
        </button>
      ))}
    </>
  );
}
