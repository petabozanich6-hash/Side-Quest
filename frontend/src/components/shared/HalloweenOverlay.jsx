import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

const CSS = `
@keyframes hwBat { 0%{transform:translate(-40px,0) scale(.8)} 50%{transform:translate(45vw,-18px) scale(1)} 100%{transform:translate(110%,10px) scale(.8)} }
@keyframes hwGhost { 0%,100%{transform:translateY(0);opacity:.75} 50%{transform:translateY(-14px);opacity:.95} }
@keyframes hwFlicker { 0%,100%{opacity:1} 50%{opacity:.8} }
.hw-bat{position:absolute;font-size:22px;animation:hwBat 14s linear infinite}
.hw-ghost{position:absolute;font-size:30px;animation:hwGhost 5s ease-in-out infinite}
.hw-pumpkin{position:absolute;bottom:4px;animation:hwFlicker 3s ease-in-out infinite}
@media (prefers-reduced-motion: reduce){.hw-bat,.hw-ghost,.hw-pumpkin{animation:none!important}}
`;

/** Renders only while the family's Halloween pack is switched on and in date range. */
export default function HalloweenOverlay() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let alive = true;
    api.get("/seasonal/halloween/active")
      .then(r => { if (alive) setActive(!!r.data?.active); })
      .catch(() => { if (alive) setActive(false); });
    return () => { alive = false; };
  }, []);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }} aria-hidden="true" data-testid="halloween-overlay">
      <style>{CSS}</style>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(49,27,92,0.55) 0%, rgba(91,33,182,0.25) 60%, rgba(249,115,22,0.18) 100%)" }} />
      <span className="absolute text-3xl" style={{ top: 10, left: 14 }}>🌙</span>
      <span className="absolute text-4xl" style={{ top: 0, left: 0, opacity: 0.8 }}>🕸️</span>
      <span className="absolute text-4xl" style={{ top: 0, right: 0, opacity: 0.8, transform: "scaleX(-1)" }}>🕸️</span>
      <span className="hw-bat" style={{ top: 24, left: 0, animationDelay: "0s" }}>🦇</span>
      <span className="hw-bat" style={{ top: 56, left: 0, animationDelay: "-6s" }}>🦇</span>
      <span className="hw-ghost" style={{ top: 60, left: "18%" }}>👻</span>
      <span className="hw-ghost" style={{ top: 90, right: "20%", animationDelay: "-2s" }}>👻</span>
      <span className="hw-pumpkin text-4xl" style={{ left: "8%" }}>🎃</span>
      <span className="hw-pumpkin text-3xl" style={{ right: "10%", animationDelay: "-1.5s" }}>🎃</span>
    </div>
  );
}
