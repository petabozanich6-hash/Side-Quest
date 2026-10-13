import React from "react";
import { CAST } from "./cast";

export default function CharacterActor({
  id,
  talking = false,
  active = false,
  bounce = true,
  x,
}) {
  const c = CAST[id] || CAST.pip;
  const flip = id === "juno" ? -1 : 1;
  const cx = typeof x === "number" ? x : c.x;
  const motionClass = bounce ? (active ? "ep-hop" : "ep-idle") : "";

  return (
    <g transform={`translate(${cx} 330) scale(${flip} 1)`} aria-hidden="true">
      <g className={motionClass}>
        <ellipse cx="0" cy="74" rx="70" ry="12" fill="rgba(0,0,0,.18)" />
        {c.ears ? (
          <g>
            <ellipse cx="-48" cy="-78" rx="16" ry="28" fill={c.body} />
            <ellipse cx="48" cy="-78" rx="16" ry="28" fill={c.body} />
          </g>
        ) : (
          <g>
            <line
              x1="0"
              y1="-94"
              x2="0"
              y2="-128"
              stroke="#78350f"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle className="ep-glow" cx="0" cy="-134" r="10" fill="#fde047" />
          </g>
        )}
        <ellipse cx="0" cy="-10" rx="78" ry="84" fill={c.body} />
        <ellipse cx="0" cy="22" rx="46" ry="46" fill={c.belly} />
        <g className="ep-arm-l">
          <ellipse cx="-80" cy="10" rx="18" ry="32" fill={c.body} transform="rotate(18 -80 10)" />
        </g>
        <g className={active ? "ep-arm-wave" : ""}>
          <ellipse cx="80" cy="10" rx="18" ry="32" fill={c.body} transform="rotate(-18 80 10)" />
        </g>
        <ellipse cx="-38" cy="72" rx="26" ry="14" fill={c.body} />
        <ellipse cx="38" cy="72" rx="26" ry="14" fill={c.body} />
        <g className="ep-blink">
          <circle cx="-26" cy="-30" r="17" fill="#fff" />
          <circle cx="26" cy="-30" r="17" fill="#fff" />
          <circle cx="-22" cy="-28" r="8" fill="#111827" />
          <circle cx="30" cy="-28" r="8" fill="#111827" />
        </g>
        <ellipse cx="-44" cy="-2" rx="10" ry="6" fill="#f472b6" opacity=".55" />
        <ellipse cx="44" cy="-2" rx="10" ry="6" fill="#f472b6" opacity=".55" />
        {talking ? (
          <ellipse className="ep-mouth" cx="0" cy="10" rx="16" ry="10" fill="#7f1d1d" />
        ) : (
          <path
            d="M-16 6 Q0 20 16 6"
            fill="none"
            stroke="#7f1d1d"
            strokeWidth="5"
            strokeLinecap="round"
          />
        )}
      </g>
    </g>
  );
}
