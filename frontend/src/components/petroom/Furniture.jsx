import React, { useId } from "react";

const Wood = "#8C6239";
const Cream = "#FBF7EC";
const Ink = "#2A2822";

export default function Furniture({ item, lampOn = true, sky = "#E3F3FC" }) {
  const clipId = `sq-window-${useId().replace(/:/g, "")}`;
  switch (item) {
    case "bed":
      return (
        <svg viewBox="0 0 160 110" className="furn-svg">
          <rect x="8" y="48" width="144" height="46" rx="10" fill={Wood} />
          <rect x="16" y="36" width="128" height="40" rx="8" fill="#F3D6C6" />
          <rect x="22" y="42" width="36" height="22" rx="6" fill={Cream} />
          <path d="M18 70 Q80 58 142 74" fill="none" stroke="#C77B5B" strokeWidth="10" strokeLinecap="round" />
        </svg>
      );
    case "cushion":
      return (
        <svg viewBox="0 0 120 80" className="furn-svg">
          <ellipse cx="60" cy="46" rx="48" ry="22" fill="#6B8A5B" />
          <ellipse cx="60" cy="40" rx="40" ry="16" fill="#94A47F" />
          <path d="M28 40 Q60 48 92 40" fill="none" stroke="#4A5D3A" strokeWidth="2" opacity="0.5" />
        </svg>
      );
    case "lamp":
      return (
        <svg viewBox="0 0 80 140" className="furn-svg">
          {lampOn && <ellipse cx="40" cy="36" rx="28" ry="16" fill="#F8E7B0" opacity="0.85" className="lamp-glow" />}
          <path d="M22 18 H58 L52 48 H28 Z" fill={lampOn ? "#F6E7A8" : "#D9D0BC"} stroke={Wood} strokeWidth="3" />
          <rect x="37" y="48" width="6" height="58" fill={Wood} />
          <ellipse cx="40" cy="112" rx="18" ry="6" fill="#6B4A2E" />
        </svg>
      );
    case "window":
      return (
        <svg viewBox="0 0 140 100" className="furn-svg">
          <rect x="4" y="4" width="132" height="92" rx="8" fill={Wood} />
          <clipPath id={clipId}><rect x="12" y="12" width="116" height="76" rx="4" /></clipPath>
          <g clipPath={`url(#${clipId})`}>
            <rect width="140" height="100" fill={sky} />
            <g className="window-clouds">
              <ellipse cx="36" cy="48" rx="18" ry="8" fill="#fff" opacity="0.9" />
              <ellipse cx="52" cy="46" rx="14" ry="7" fill="#fff" />
              <ellipse cx="96" cy="58" rx="16" ry="7" fill="#fff" opacity="0.85" />
            </g>
            <path d="M0 78 Q30 70 60 78 T140 76 V100 H0 Z" fill="#8FB56A" />
          </g>
          <path d="M70 12 V88 M12 50 H128" stroke={Wood} strokeWidth="4" />
        </svg>
      );
    case "toy":
      return (
        <svg viewBox="0 0 90 80" className="furn-svg yarn">
          <ellipse cx="46" cy="48" rx="24" ry="18" fill="#D4857A" />
          <path d="M30 44 Q46 36 60 48 Q48 58 34 50" fill="none" stroke="#F5EFE0" strokeWidth="3" />
          <path d="M62 40 Q78 28 70 58" fill="none" stroke="#C77B5B" strokeWidth="3" />
        </svg>
      );
    case "bowl":
      return (
        <svg viewBox="0 0 100 70" className="furn-svg">
          <ellipse cx="50" cy="40" rx="36" ry="14" fill="#E7D3B0" />
          <path d="M16 40 Q50 68 84 40" fill="#FBF7EC" stroke="#C8893B" strokeWidth="3" />
          <circle cx="40" cy="36" r="4" fill="#C77B5B" />
          <circle cx="52" cy="34" r="4" fill="#6B8A5B" />
          <circle cx="60" cy="40" r="3.5" fill="#D4A574" />
        </svg>
      );
    case "plant":
      return (
        <svg viewBox="0 0 90 120" className="furn-svg">
          <path d="M45 78 Q45 40 45 18" stroke="#4A5D3A" strokeWidth="3" fill="none" />
          <ellipse cx="32" cy="40" rx="16" ry="7" fill="#6B8A5B" transform="rotate(-30 32 40)" />
          <ellipse cx="58" cy="36" rx="16" ry="7" fill="#4A5D3A" transform="rotate(28 58 36)" />
          <ellipse cx="40" cy="24" rx="12" ry="6" fill="#94A47F" transform="rotate(-20 40 24)" />
          <path d="M28 78 H62 L56 108 H34 Z" fill="#C77B5B" />
        </svg>
      );
    case "bookshelf":
      return (
        <svg viewBox="0 0 110 120" className="furn-svg">
          <rect x="8" y="10" width="94" height="100" rx="4" fill="#6B4A2E" />
          <rect x="14" y="16" width="82" height="40" fill="#F5EFE0" />
          <rect x="14" y="62" width="82" height="40" fill="#FBF7EC" />
          <rect x="18" y="20" width="8" height="32" fill="#C77B5B" />
          <rect x="28" y="24" width="8" height="28" fill="#4A5D3A" />
          <rect x="38" y="18" width="8" height="34" fill="#D4A574" />
          <rect x="48" y="22" width="8" height="30" fill="#1F3B2D" />
          <rect x="20" y="68" width="28" height="8" rx="1" fill="#D4857A" />
          <rect x="20" y="80" width="34" height="8" rx="1" fill="#6B8A5B" />
        </svg>
      );
    case "rug":
      return (
        <svg viewBox="0 0 180 70" className="furn-svg">
          <rect x="6" y="10" width="168" height="50" rx="8" fill="#C77B5B" />
          <rect x="14" y="18" width="152" height="34" rx="4" fill="#E7C7B4" />
          <path d="M20 35 H160" stroke="#C8893B" strokeWidth="3" />
        </svg>
      );
    case "mobile":
      return (
        <svg viewBox="0 0 100 90" className="furn-svg">
          <path d="M10 16 H90" stroke={Wood} strokeWidth="4" strokeLinecap="round" />
          <g className="star-mobile">
            <line x1="30" y1="16" x2="30" y2="40" stroke={Wood} />
            <polygon points="30,36 34,48 24,42 36,42 26,48" fill="#C8893B" />
            <line x1="70" y1="16" x2="70" y2="52" stroke={Wood} />
            <polygon points="70,46 75,60 63,53 77,53 65,60" fill="#F6E7A8" />
          </g>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 80 80" className="furn-svg">
          <rect x="10" y="16" width="60" height="50" rx="6" fill="#E7D3B0" stroke={Ink} />
        </svg>
      );
  }
}

export function AcornIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M8 13 H24 Q22 8 16 8 Q10 8 8 13 Z" fill="#6B4A2E" />
      <path d="M10 14 Q16 28 22 14" fill="#C8893B" />
    </svg>
  );
}
