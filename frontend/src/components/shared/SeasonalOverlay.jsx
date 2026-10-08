import React from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import useSeasonal, { notifySeasonal } from "./useSeasonal";

const THEMES = {
  halloween: { tint: "linear-gradient(180deg, rgba(40,20,70,0.35), rgba(255,140,0,0.12))", items: ["🦇", "👻", "🕸️", "🎃"] },
  christmas: { tint: "linear-gradient(180deg, rgba(190,30,45,0.10), rgba(255,255,255,0.18))", items: ["❄️", "🎄", "⭐", "🎁"] },
  new_year: { tint: "linear-gradient(180deg, rgba(30,30,90,0.25), rgba(212,165,116,0.15))", items: ["🎇", "🎉", "✨", "🥂"] },
  easter: { tint: "linear-gradient(180deg, rgba(255,230,120,0.18), rgba(190,230,190,0.15))", items: ["🐣", "🥚", "🌷", "🐰"] },
  lunar_new_year: { tint: "linear-gradient(180deg, rgba(200,30,30,0.15), rgba(255,200,60,0.12))", items: ["🏮", "🧧", "🐉", "✨"] },
  birthday: { tint: "linear-gradient(180deg, rgba(255,120,200,0.12), rgba(120,200,255,0.12))", items: ["🎈", "🎂", "🎉", "🎁"] },
};

const CSS = `
@keyframes sqFloat { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-14px) rotate(4deg)} }
.sq-float{animation:sqFloat 4.5s ease-in-out infinite}
@media (prefers-reduced-motion: reduce){.sq-float{animation:none!important}}
`;

export default function SeasonalOverlay() {
  const { packs } = useSeasonal();

  const claim = async (pack) => {
    try {
      const r = await api.post(`/seasonal/${pack}/claim`);
      const p = r.data?.prize;
      toast.success(`You got a surprise: ${p?.emoji || ""} ${p?.name || "a prize"}! Find it in your Wardrobe.`);
      notifySeasonal();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Try again shortly");
    }
  };

  if (!packs.length) return null;
  const decorated = packs.filter(p => p.decorations && THEMES[p.pack]);
  const claimable = packs.filter(p => p.prize_enabled && !p.claimed && !p.complete);

  return (
    <>
      <style>{CSS}</style>
      {decorated.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }} aria-hidden="true" data-testid="seasonal-overlay">
          <div className="absolute inset-0" style={{ background: THEMES[decorated[0].pack].tint }} />
          {decorated.flatMap((p, pi) =>
            THEMES[p.pack].items.flatMap((emoji, i) =>
              [0, 1].map(k => {
                const n = i * 2 + k;
                return (
                  <span key={`${p.pack}-${n}`} className="sq-float absolute text-2xl"
                    style={{ left: `${(n * 37 + pi * 13 + 6) % 90}%`, top: `${(n * 23 + pi * 9 + 4) % 55}%`, animationDelay: `${(n % 5) * 0.6}s`, opacity: 0.9 }}>
                    {emoji}
                  </span>
                );
              })
            )
          )}
        </div>
      )}
      {claimable.map((p, i) => (
        <button key={`claim-${p.pack}`} onClick={() => claim(p.pack)}
          className="absolute rounded-full px-3 py-1.5 text-xs font-bold shadow"
          style={{ zIndex: 20, top: 12 + i * 40, left: 12, backgroundColor: "#1F3B2D", color: "#F5EFE0" }}
          data-testid={`claim-${p.pack}`}>
          🎁 Claim a {p.label} surprise
        </button>
      ))}
    </>
  );
}
