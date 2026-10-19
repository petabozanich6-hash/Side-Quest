import React from "react";
import useSeasonal from "./useSeasonal";
import { petSpots } from "./petAccessoryPositions";

// Seasonal prizes follow the actual species' body, rather than generic
// screen coordinates (which put turtle boots on its belly, etc.).
export default function SeasonalWornArt({ size = 200, species = "dragon" }) {
  const { keepsakes } = useSeasonal();
  const worn = keepsakes.filter((k) => k.worn && petSpots(species, k.slot).length);
  if (!worn.length) return null;
  return (
    <div className="absolute inset-0 pointer-events-none" data-testid="worn-seasonal" aria-hidden="true">
      {worn.flatMap((k) => petSpots(species, k.slot).map(([x, y, width], i) => (
        <span key={k.id + "-" + i} className="absolute grid place-items-center select-none"
          style={{
            left: x + "%", top: y + "%",
            width: width + "%", aspectRatio: "1",
            transform: "translate(-50%,-50%)",
            fontSize: Math.max(13, size * width / 100 * 0.78),
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,.22))",
          }}>{k.emoji}</span>
      )))}
    </div>
  );
}
