import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

// Painted-look palettes for books that don't have uploaded cover art yet.
export const THEMES = {
  meadow:   { from: "#f4f1de", to: "#cfe3c1", ink: "#28472f", accent: "#7aa65a", glow: "#fff8e1" },
  ocean:    { from: "#e7f3f6", to: "#9cc9d9", ink: "#173d52", accent: "#3a8bb0", glow: "#f5fbff" },
  sunset:   { from: "#fdf0e2", to: "#f2b8a2", ink: "#5b2a1f", accent: "#d9744f", glow: "#fff6ea" },
  forest:   { from: "#e5eedf", to: "#7fa58a", ink: "#163626", accent: "#2f6b4a", glow: "#f3f8ef" },
  twilight: { from: "#ece8f6", to: "#a99bd0", ink: "#2c2350", accent: "#6a59a8", glow: "#faf8ff" },
  desert:   { from: "#fbf2dd", to: "#e3be7d", ink: "#4d3415", accent: "#b9813a", glow: "#fffaf0" },
};

/** One soft illustration per subject, drawn in the book's palette. Original artwork, no outside assets. */
function Motif({ subject, t }) {
  const stroke = { stroke: t.ink, strokeWidth: 2.2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  switch (subject) {
    case "mathematics":
      return <g>
        <circle cx="62" cy="70" r="26" fill={t.accent} opacity=".25" />
        <rect x="88" y="44" width="44" height="44" rx="6" fill={t.glow} {...stroke} />
        <path d="M44 128 L74 84 L104 128 Z" fill={t.glow} {...stroke} />
        <text x="110" y="74" textAnchor="middle" fontSize="20" fontWeight="700" fill={t.ink} fontFamily="Georgia, serif">+</text>
        <text x="62" y="78" textAnchor="middle" fontSize="22" fontWeight="700" fill={t.ink} fontFamily="Georgia, serif">3</text>
        <path d="M112 104 h22 M112 112 h22" {...stroke} />
        <circle cx="140" cy="132" r="4" fill={t.accent} /><circle cx="30" cy="104" r="3" fill={t.accent} />
      </g>;
    case "english":
      return <g>
        <ellipse cx="90" cy="120" rx="62" ry="10" fill={t.accent} opacity=".2" />
        <path d="M30 60 Q60 48 90 60 L90 118 Q60 106 30 118 Z" fill={t.glow} {...stroke} />
        <path d="M150 60 Q120 48 90 60 L90 118 Q120 106 150 118 Z" fill={t.glow} {...stroke} />
        <path d="M42 72 q20 -6 38 0 M42 84 q20 -6 38 0 M42 96 q20 -6 38 0 M100 72 q20 -6 38 0 M100 84 q20 -6 38 0" stroke={t.ink} strokeWidth="1.3" fill="none" opacity=".55" />
        <path d="M128 20 Q150 30 138 58 L122 76 L120 70 Q112 44 128 20 Z" fill={t.accent} opacity=".85" />
        <path d="M120 70 L114 84" {...stroke} />
      </g>;
    case "science":
      return <g>
        <circle cx="128" cy="48" r="14" fill={t.accent} opacity=".3" />
        <ellipse cx="128" cy="48" rx="26" ry="9" {...stroke} transform="rotate(25 128 48)" />
        <ellipse cx="128" cy="48" rx="26" ry="9" {...stroke} transform="rotate(-35 128 48)" />
        <circle cx="128" cy="48" r="4" fill={t.ink} />
        <path d="M58 40 h24 M64 40 v26 L42 112 Q38 124 52 124 h36 Q102 124 96 112 L76 66 V40" fill={t.glow} {...stroke} />
        <path d="M48 104 Q70 96 90 104 L96 114 Q100 122 88 122 H52 Q40 122 44 112 Z" fill={t.accent} opacity=".55" />
        <circle cx="64" cy="92" r="3" fill={t.accent} /><circle cx="74" cy="82" r="2" fill={t.accent} />
        <path d="M118 128 Q130 96 150 92 Q146 118 118 128 Z" fill={t.accent} opacity=".7" />
      </g>;
    case "history":
      return <g>
        <circle cx="90" cy="70" r="46" fill={t.accent} opacity=".15" />
        <path d="M66 32 h48 M66 116 h48 M70 32 Q70 64 90 74 Q110 64 110 32 M70 116 Q70 84 90 74 Q110 84 110 116" fill={t.glow} {...stroke} />
        <path d="M80 108 Q90 96 100 108 Z" fill={t.accent} />
        <path d="M86 52 Q90 60 94 52 Z" fill={t.accent} />
        <path d="M24 128 h132" {...stroke} />
        <path d="M34 128 v-30 M146 128 v-30 M28 98 h12 M140 98 h12" {...stroke} />
      </g>;
    case "geography":
    default:
      return <g>
        <path d="M14 128 L54 74 L78 102 L100 70 L166 128 Z" fill={t.accent} opacity=".35" />
        <path d="M14 128 L54 74 L78 102 L100 70 L166 128" {...stroke} />
        <path d="M93 78 L100 70 L107 78" stroke={t.glow} strokeWidth="3" fill="none" />
        <circle cx="136" cy="34" r="20" fill={t.glow} {...stroke} />
        <path d="M136 14 V54 M116 34 H156 M123 21 Q136 34 123 47 M149 21 Q136 34 149 47" stroke={t.ink} strokeWidth="1.3" fill="none" />
        <path d="M46 40 l6 -14 l6 14 l-6 -4 z" fill={t.ink} />
      </g>;
  }
}

/** Fetches owner-uploaded cover art with the sign-in header (an <img src> can't send it). */
export function useCoverUrl(id, hasCover) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!id || !hasCover) { setUrl(""); return undefined; }
    let live = true, made = "";
    api.get(`/quest-books/books/${encodeURIComponent(id)}/cover`, { responseType: "blob" })
      .then((r) => { if (!live) return; made = URL.createObjectURL(new Blob([r.data], { type: "image/png" })); setUrl(made); })
      .catch(() => { if (live) setUrl(""); });
    return () => { live = false; if (made) URL.revokeObjectURL(made); };
  }, [id, hasCover]);
  return url;
}

/**
 * A spiral-bound book. Uses the uploaded cover art when there is one, otherwise a designed cover.
 * `book` may be a placeholder ({ subject, subjectLabel, yearLabel, placeholder: true }) for a subject not yet released.
 */
export default function QuestBookCover({ book, size = "md", className = "" }) {
  const art = useCoverUrl(book?.placeholder ? null : book?.id, book?.has_cover);
  const t = THEMES[book?.theme] || THEMES.meadow;
  const w = size === "lg" ? "w-56 sm:w-64" : size === "sm" ? "w-28" : "w-36 sm:w-40";
  const coils = Array.from({ length: size === "sm" ? 9 : 13 });
  return (
    <div className={`relative ${w} aspect-[3/4] shrink-0 select-none ${className}`} data-testid="quest-book-cover">
      <div
        className={`absolute inset-0 rounded-r-xl rounded-l-md overflow-hidden shadow-[0_10px_24px_-8px_rgba(40,30,10,.45),0_2px_4px_rgba(40,30,10,.15)] ${book?.placeholder ? "opacity-60 grayscale-[.4]" : ""}`}
        style={{ background: `linear-gradient(160deg, ${t.from}, ${t.to})` }}
      >
        {art ? (
          <img src={art} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col pl-[14%] pr-[8%] pt-[9%] pb-[7%]" style={{ color: t.ink }}>
            <div className="text-[8px] sm:text-[9px] font-bold tracking-[.22em] uppercase opacity-70">Side-Quest · Quest Books</div>
            <div className={`font-display font-bold leading-[1.05] mt-[6%] ${size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-[13px]" : "text-base sm:text-lg"}`}>
              {book?.placeholder ? book.subjectLabel : book?.title}
            </div>
            {!book?.placeholder && book?.subtitle && (
              <div className={`italic mt-1 opacity-80 ${size === "sm" ? "text-[9px]" : "text-[11px] sm:text-xs"}`} style={{ fontFamily: "Georgia, serif" }}>{book.subtitle}</div>
            )}
            <svg viewBox="0 0 180 140" className="w-full mt-auto" aria-hidden="true"><Motif subject={book?.subject} t={t} /></svg>
            <div className="flex items-center justify-between mt-[4%]">
              <span className={`rounded-full px-2 py-0.5 font-bold ${size === "sm" ? "text-[8px]" : "text-[10px]"}`} style={{ background: t.glow, color: t.ink }}>{book?.yearLabel || book?.year_label}</span>
              {book?.placeholder && <span className="text-[9px] font-bold uppercase tracking-wider">Coming soon</span>}
            </div>
          </div>
        )}
        {/* paper edge and a soft sheen */}
        <div className="absolute inset-y-0 right-0 w-[4px] bg-gradient-to-l from-white/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/5 pointer-events-none" />
      </div>
      {/* spiral binding */}
      <div className="absolute left-[-5px] top-[4%] bottom-[4%] flex flex-col justify-between pointer-events-none" aria-hidden="true">
        {coils.map((_, i) => (
          <span key={i} className="block h-[6px] w-[16px] rounded-full border-2 border-stone-500 bg-gradient-to-b from-stone-200 to-stone-400 shadow-sm" />
        ))}
      </div>
    </div>
  );
}
