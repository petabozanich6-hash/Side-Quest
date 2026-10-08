import React from "react";
import useSeasonal from "./useSeasonal";

// Positions as [x, y, size]. Pairs are drawn on both sides.
// Hatched pet: 120x120 drawing.
const PET_SPOTS = {
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

// Egg: 190x230 drawing, egg runs x 15-175, y 12-218.
const EGG_SPOTS = {
  head: [[95, 42, 34]],
  face: [[95, 98, 34]],
  neck: [[95, 132, 34]],
  chest: [[95, 168, 32]],
  left: [[45, 160, 30]],
  right: [[145, 160, 30]],
  ears: [[62, 70, 24], [128, 70, 24]],
  feet: [[65, 205, 22], [125, 205, 22]],
  cheeks: [[55, 125, 18], [135, 125, 18]],
};

// Rendered inside the pet's or egg's SVG so prizes move with it.
export default function SeasonalWorn({ layout = "pet" }) {
  const { keepsakes } = useSeasonal();
  const spots = layout === "egg" ? EGG_SPOTS : PET_SPOTS;
  const worn = keepsakes.filter(k => k.worn && spots[k.slot]);
  if (!worn.length) return null;
  return (
    <g data-testid="worn-seasonal" pointerEvents="none">
      {worn.flatMap(k => spots[k.slot].map(([x, y, s], i) => (
        <text key={`${k.id}-${i}`} x={x} y={y} fontSize={s} textAnchor="middle" dominantBaseline="central">
          {k.emoji}
        </text>
      )))}
    </g>
  );
}
