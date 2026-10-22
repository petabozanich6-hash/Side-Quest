import React, { useEffect, useId, useMemo, useRef } from "react";
import { renderEgg, renderPet, stageKey, PET_ART_CSS, SPECIES } from "./petArt.js";

export const NEW_ART_SPECIES = SPECIES;

let cssInjected = false;
function useArtCss() {
  useEffect(() => {
    if (cssInjected || typeof document === "undefined") return;
    cssInjected = true;
    const el = document.createElement("style");
    el.setAttribute("data-sq-pet-art", "");
    el.textContent = PET_ART_CSS;
    document.head.appendChild(el);
  }, []);
}

const clamp = (v) => Math.max(-1, Math.min(1, v));
const BLINKS = ["calm", "happy", "sad", "sick"];

/**
 * One companion, drawn from our own static artwork (petArt.js).
 * live: breathing, sway and natural blinking. follow: eyes track the pointer.
 * worn: regular wardrobe ids. seasonal: worn seasonal prizes ({ id, slot, emoji }).
 */
export default function PetFigure({
  species = "turtle", stage = "companion", mood = "calm", worn = [], seasonal = [],
  size = 200, live = true, follow = false, cold = false, className = "", style, ...rest
}) {
  useArtCss();
  const uid = "p" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const st = stageKey(stage);
  const wornKey = (worn || []).join(",");
  const seasonalKey = (seasonal || []).map((k) => `${k.id}:${k.slot}:${k.emoji}`).join(",");
  const markup = useMemo(
    () => (st === "egg"
      ? renderEgg({ species, uid, seasonal: seasonal || [], cold })
      : renderPet({ species, stage: st, mood, worn: worn || [], seasonal: seasonal || [], uid })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [species, st, mood, wornKey, seasonalKey, cold, uid]
  );
  const ref = useRef(null);

  useEffect(() => {
    if (!live || st === "egg") return undefined;
    let timer, off;
    const tick = () => {
      const el = ref.current;
      if (el && BLINKS.includes(mood)) {
        el.classList.add("sq-blink");
        off = setTimeout(() => el.classList.remove("sq-blink"), 180);
      }
      timer = setTimeout(tick, 2200 + Math.random() * 3800);
    };
    timer = setTimeout(tick, 1200 + Math.random() * 1500);
    return () => { clearTimeout(timer); clearTimeout(off); };
  }, [live, mood, st]);

  useEffect(() => {
    if (!follow || st === "egg" || typeof window === "undefined") return undefined;
    const move = (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 1.2));
      const dy = clamp((e.clientY - (r.top + r.height * 0.32)) / (r.height / 1.2));
      el.querySelectorAll(".p-pupil").forEach((p) => p.setAttribute("transform", `translate(${(dx * 6).toFixed(1)} ${(dy * 6).toFixed(1)})`));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [follow, markup, st]);

  return (
    <div
      ref={ref}
      className={`sq-figure ${live ? "sq-live" : ""} ${className}`.trim()}
      style={{ width: size, maxWidth: "100%", ...style }}
      data-testid="pet-art" data-species={species} data-stage={st}
      {...rest}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
