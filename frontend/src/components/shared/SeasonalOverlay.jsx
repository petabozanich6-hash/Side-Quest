import React, { useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { playSfx } from "../../lib/sfx";
import useSeasonal, { notifySeasonal } from "./useSeasonal";
import { decorSvg } from "../pets/petSeasonal";

// "art:<key>" draws the matching room decoration; anything else is shown as an emoji.
const Deco = ({ item, size }) => item.startsWith("art:")
  ? <span className="block" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: decorSvg(item.slice(4)) }} />
  : item;

// Each season: a soft light over the cosy room, things falling gently, a few props sitting in the room, and a gift to open.
const THEMES = {
  halloween: { tint: "linear-gradient(180deg, rgba(60,25,90,0.30), rgba(255,130,20,0.12))", fall: ["art:leaf", "art:bat", "art:leaf"], props: [["art:jack", 6, 3, 70], ["art:cobweb", 0, 74, 90], ["art:candle", 86, 5, 52], ["art:ghost", 74, 54, 56]], gift: "🎃" },
  christmas: { tint: "linear-gradient(180deg, rgba(160,25,40,0.12), rgba(255,255,255,0.16))", fall: ["art:snowflake", "art:snowflake", "art:snowflake"], props: [["art:tree", 3, 3, 110], ["art:present", 22, 2, 48], ["art:present2", 30, 2, 36], ["art:bell", 84, 56, 64], ["art:gold_star", 47, 76, 40]], gift: "🎁" },
  new_year: { tint: "linear-gradient(180deg, rgba(25,25,90,0.3), rgba(212,165,116,0.18))", fall: ["✨", "🎊", "⭐"], props: [["🕛", 10, 55, 48], ["🥂", 8, 3, 42], ["🎆", 78, 56, 52], ["🎈", 90, 6, 48]], gift: "🎉" },
  easter: { tint: "linear-gradient(180deg, rgba(255,235,130,0.22), rgba(180,230,190,0.18))", fall: ["🌸", "🌼", "🦋"], props: [["🧺", 8, 3, 54], ["🐰", 86, 4, 52], ["🌷", 20, 2, 40], ["🥚", 74, 3, 34]], gift: "🥚" },
  lunar_new_year: { tint: "linear-gradient(180deg, rgba(200,30,30,0.18), rgba(255,200,60,0.14))", fall: ["🧧", "✨", "🌸"], props: [["🏮", 8, 58, 54], ["🏮", 86, 58, 54], ["🍊", 10, 3, 40], ["🐉", 76, 3, 48]], gift: "🧧" },
  birthday: { tint: "linear-gradient(180deg, rgba(255,120,200,0.14), rgba(120,200,255,0.14))", fall: ["🎊", "🎈", "✨"], props: [["🎂", 8, 3, 52], ["🎈", 4, 56, 56], ["🎈", 90, 56, 56], ["🎁", 80, 3, 42]], gift: "🎁" },
};

const CSS = `
@keyframes sqFall { 0%{transform:translate3d(0,-12%,0) rotate(0deg);opacity:0} 10%{opacity:.95} 100%{transform:translate3d(var(--dx,20px),115%,0) rotate(300deg);opacity:.9} }
.sq-fall{position:absolute;top:0;animation:sqFall linear infinite}
@keyframes sqBob { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.06)} }
.sq-gift{animation:sqBob 1.8s ease-in-out infinite;filter:drop-shadow(0 6px 6px rgba(0,0,0,.35))}
@keyframes sqPop { 0%{transform:scale(.3) rotate(-12deg);opacity:0} 60%{transform:scale(1.15) rotate(4deg);opacity:1} 100%{transform:scale(1) rotate(0)} }
.sq-reveal{animation:sqPop .6s cubic-bezier(.2,.9,.3,1.2) both}
@media (prefers-reduced-motion: reduce){.sq-fall,.sq-gift,.sq-reveal{animation:none!important}.sq-fall{display:none}}
`;

export default function SeasonalOverlay() {
  const { packs } = useSeasonal();
  const [reveal, setReveal] = useState(null);
  const [busy, setBusy] = useState(false);

  const claim = async (pack, label) => {
    if (busy) return;
    setBusy(true);
    try {
      const r = await api.post(`/seasonal/${pack}/claim`);
      setReveal({ ...(r.data?.prize || {}), label });
      playSfx("cheer");
      notifySeasonal();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Try again shortly");
    } finally { setBusy(false); }
  };

  if (!packs.length) return null;
  const decorated = packs.filter((p) => p.decorations && THEMES[p.pack]);
  const claimable = packs.filter((p) => p.prize_enabled && !p.claimed && !p.complete && THEMES[p.pack]);
  const theme = decorated[0] ? THEMES[decorated[0].pack] : null;

  return (
    <>
      <style>{CSS}</style>
      {theme && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }} aria-hidden="true" data-testid="seasonal-overlay">
          <div className="absolute inset-0" style={{ background: theme.tint }} />
          {Array.from({ length: 14 }, (_, n) => (
            <span key={`f${n}`} className="sq-fall text-xl" style={{ left: `${(n * 29 + 7) % 96}%`, "--dx": `${(n % 2 ? 1 : -1) * (14 + (n % 4) * 8)}px`, animationDuration: `${7 + (n % 5) * 1.6}s`, animationDelay: `${-(n * 1.3) % 9}s`, fontSize: 14 + (n % 3) * 6 }}><Deco item={theme.fall[n % theme.fall.length]} size={14 + (n % 3) * 8} /></span>
          ))}
          {theme.props.map(([emoji, x, y, size], i) => (
            <span key={`p${i}`} className="absolute select-none" style={{ left: `${x}%`, bottom: `${y}%`, fontSize: size, filter: "drop-shadow(0 4px 4px rgba(0,0,0,.3))" }}><Deco item={emoji} size={size} /></span>
          ))}
        </div>
      )}
      {claimable.map((p, i) => (
        <button key={`claim-${p.pack}`} type="button" onClick={() => claim(p.pack, p.label)} disabled={busy}
          className="sq-gift absolute select-none text-5xl"
          style={{ zIndex: 20, left: `${62 + i * 12}%`, bottom: "7%", background: "none", border: 0, cursor: "pointer" }}
          aria-label={`Open your ${p.label} surprise`} data-testid={`claim-${p.pack}`}>
          {THEMES[p.pack].gift}
          <span className="block text-[10px] font-bold rounded-full px-2 py-0.5 mt-1" style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }}>Tap to open</span>
        </button>
      ))}
      {reveal && (
        <div className="absolute inset-0 grid place-items-center" style={{ zIndex: 30, background: "rgba(20,15,10,.55)" }} role="dialog" aria-label="Your surprise" data-testid="prize-reveal" onClick={() => setReveal(null)}>
          <div className="sq-reveal rounded-3xl bg-white px-8 py-6 text-center shadow-2xl max-w-[80%]">
            <div className="text-xs font-bold uppercase tracking-widest text-stone-500">{reveal.label} surprise</div>
            <div className="text-7xl my-2">{reveal.emoji || "🎁"}</div>
            <div className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>{reveal.name || "A new prize"}</div>
            <p className="text-xs text-stone-600 mt-1">It is in your Wardrobe{reveal.slot ? " and your pet may already be wearing it" : ""}.</p>
            <button type="button" className="mt-3 rounded-full px-5 py-1.5 text-sm font-bold" style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }} onClick={() => setReveal(null)} data-testid="prize-close">Lovely!</button>
          </div>
        </div>
      )}
    </>
  );
}
