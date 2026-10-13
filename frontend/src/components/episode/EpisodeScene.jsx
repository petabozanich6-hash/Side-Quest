import React from "react";
import CharacterActor from "./CharacterActor";
import AnimatedNumberLine from "./AnimatedNumberLine";

function Background({ kind }) {
  if (kind === "board") {
    return (
      <g>
        <rect width="800" height="450" fill="#ecfdf5" />
        <rect x="40" y="24" width="720" height="210" rx="16" fill="#1f3b2d" />
        <rect x="56" y="40" width="688" height="178" rx="10" fill="#14532d" />
        <rect y="330" width="800" height="120" fill="#d6a56a" />
      </g>
    );
  }
  if (kind === "evening") {
    return (
      <g>
        <defs>
          <linearGradient id="ep-eve" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1e3a5f" />
            <stop offset="1" stopColor="#fb923c" />
          </linearGradient>
        </defs>
        <rect width="800" height="450" fill="url(#ep-eve)" />
        <circle cx="650" cy="120" r="40" fill="#fde68a" />
        <path d="M0 340 Q200 280 400 340 T800 330 V450 H0Z" fill="#0f172a" />
        <rect y="380" width="800" height="70" fill="#111827" />
      </g>
    );
  }
  return (
    <g>
      <rect width="800" height="450" fill="#fef3c7" />
      <rect y="330" width="800" height="120" fill="#d6a56a" />
      <rect
        x="60"
        y="60"
        width="120"
        height="130"
        rx="8"
        fill="#bae6fd"
        stroke="#92400e"
        strokeWidth="8"
      />
      <line x1="120" y1="60" x2="120" y2="190" stroke="#92400e" strokeWidth="6" />
      <rect
        x="620"
        y="70"
        width="120"
        height="90"
        rx="6"
        fill="#fde68a"
        stroke="#b45309"
        strokeWidth="6"
      />
      <rect x="640" y="90" width="80" height="10" fill="#b45309" />
      <rect x="640" y="112" width="60" height="10" fill="#b45309" />
    </g>
  );
}

export default function EpisodeScene({
  bg = "room",
  speaker,
  talking,
  bounce,
  diagram,
  reducedMotion,
  ariaLabel,
}) {
  return (
    <>
      <svg viewBox="0 0 800 450" role="img" aria-label={ariaLabel || "Teaching episode scene"}>
        <Background kind={bg} />
        <CharacterActor
          id="pip"
          talking={talking && speaker === "pip"}
          active={speaker === "pip"}
          bounce={bounce}
        />
        <CharacterActor
          id="juno"
          talking={talking && speaker === "juno"}
          active={speaker === "juno"}
          bounce={bounce}
        />
      </svg>
      {diagram?.type === "number_line" ? (
        <div className="ep-diagram-overlay">
          <AnimatedNumberLine {...diagram} reducedMotion={reducedMotion} />
        </div>
      ) : null}
    </>
  );
}
