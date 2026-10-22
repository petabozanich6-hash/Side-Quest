import React from "react";
import { ACCESSORY_SLOTS, petSpots } from "./petAccessoryPositions";
import { wearableArt } from "../pets/petWear";

// Vector wearables are attached to species-specific points on the illustration,
// rather than laid out in a disconnected row above the pet.
// The new outfit drawings (components/pets/petWear.js), also used by retired species.
export function Wearable({ id }) {
  const art = wearableArt(id);
  return art ? <g dangerouslySetInnerHTML={{ __html: art }} /> : null;
}
const emojiFallback = { rainbow: "🌈", magic_wand: "🪄" };

export default function PetWearables({ species, equipped = [] }) {
  const ids = (equipped || []).filter((id) => ACCESSORY_SLOTS[id]);
  if (!ids.length) return null;
  return <div className="absolute inset-0 pointer-events-none" aria-hidden="true" data-testid="worn-accessories">
    {ids.map((id) => {
      const slot = ACCESSORY_SLOTS[id];
      const p = petSpots(species, slot)[0];
      if (!p) return null;
      const [x, y, size] = p;
      const emoji = emojiFallback[id];
      return <span key={id} className="absolute grid place-items-center select-none" style={{
        left: x + "%", top: y + "%", width: (size * (slot === "back" ? 1.2 : 1.13)) + "%",
        aspectRatio: "1", transform: "translate(-50%, -50%)",
        filter: "drop-shadow(0 2px 2px rgba(42,30,24,.2))",
      }}>
        {emoji ? <span style={{fontSize: "clamp(18px, 3vw, 34px)"}}>{emoji}</span> :
          <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg"><Wearable id={id}/></svg>}
      </span>;
    })}
  </div>;
}
