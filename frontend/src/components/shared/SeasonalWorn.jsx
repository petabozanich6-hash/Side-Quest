import React from "react";
import useSeasonal from "./useSeasonal";

// Positions on the pet's 120x120 drawing: [x, y, size]. Pairs are drawn on both sides.
const SPOTS = {
  head: [[60, 16, 26]],
  face: [[60, 48, 24]],
  neck: [[60, 73, 22]],
  chest: [[60, 92, 20]],
  left: [[27, 88, 22]],
  right: [[93, 88, 22]],
  ears: [[34, 28, 16], [86, 28, 16]],
  feet: [[42, 109, 14], [78, 109, 14]],
  cheeks: [[40, 58, 11], [80, 58, 11]],
};

// Rendered inside the Pet's SVG so prizes move with the pet.
export default function SeasonalWorn() {
  const { keepsakes } = useSeasonal();
  const worn = keepsakes.filter(k => k.worn && SPOTS[k.slot]);
  if (!worn.length) return null;
  return (
    <g data-testid="worn-seasonal" pointerEvents="none">
      {worn.flatMap(k => SPOTS[k.slot].map(([x, y, s], i) => (
        <text key={`${k.id}-${i}`} x={x} y={y} fontSize={s} textAnchor="middle" dominantBaseline="central">
          {k.emoji}
        </text>
      )))}
    </g>
  );
}
