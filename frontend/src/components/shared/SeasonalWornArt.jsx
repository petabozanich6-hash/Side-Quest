import React from "react";
import useSeasonal from "./useSeasonal";

// Where each prize slot sits on an illustrated pet, as [left %, top %, size as % of the pet's width].
const SPOTS = {
  head: [[50, 4, 17]], face: [[50, 30, 14]], neck: [[50, 52, 13]], chest: [[50, 66, 13]],
  left: [[16, 68, 15]], right: [[84, 68, 15]], ears: [[27, 12, 10], [73, 12, 10]],
  feet: [[34, 92, 9], [66, 92, 9]], cheeks: [[37, 40, 8], [63, 40, 8]],
};

// Prizes the child chose to wear, drawn over the pet picture so they move with it.
export default function SeasonalWornArt({ size = 200 }) {
  const { keepsakes } = useSeasonal();
  const worn = keepsakes.filter((k) => k.worn && SPOTS[k.slot]);
  if (!worn.length) return null;
  return (
    <div className="absolute inset-0 pointer-events-none" data-testid="worn-seasonal">
      {worn.flatMap((k) => SPOTS[k.slot].map(([x, y, s], i) => (
        <span key={`${k.id}-${i}`} className="absolute select-none"
          style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", fontSize: Math.max(14, (size * s) / 100 * 1.6), filter: "drop-shadow(0 2px 2px rgba(0,0,0,.35))" }}>{k.emoji}</span>
      )))}
    </div>
  );
}
