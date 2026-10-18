import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Compass, Map, X } from "lucide-react";
import { parentTourSteps, tourStorageKey } from "./parentTour";

const seen = (key) => {
  try { return window.localStorage.getItem(key) === "done"; } catch { return false; }
};
const remember = (key) => {
  try { window.localStorage.setItem(key, "done"); } catch { /* Private browsing may block storage. */ }
};
const layer = { position: "fixed", zIndex: 100, background: "rgba(15, 34, 28, .70)" };
const padded = (rect) => ({
  left: Math.max(8, Math.round(rect.left) - 8),
  top: Math.max(8, Math.round(rect.top) - 8),
  right: Math.min(window.innerWidth - 8, Math.round(rect.right) + 8),
  bottom: Math.min(window.innerHeight - 8, Math.round(rect.bottom) + 8),
});

export default function ParentGuidedTour({ user, openRequest = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const steps = useMemo(() => parentTourSteps(user?.jurisdiction), [user?.jurisdiction]);
  const key = user?.id ? tourStorageKey(user.id) : null;
  const [mode, setMode] = useState("idle"); // idle | offer | touring
  const [stepIndex, setStepIndex] = useState(0);
  const [spot, setSpot] = useState(null);
  const headingRef = useRef(null);
  const previousFocus = useRef(null);
  const step = steps[stepIndex];

  // Invite each parent once on this device, after their family location is set.
  // Never interrupt the location-selection gate or child accounts.
  useEffect(() => {
    setMode("idle");
    setStepIndex(0);
    setSpot(null);
  }, [user?.id]);
  useEffect(() => {
    if (!key || user?.role !== "parent" || !user?.jurisdiction || location.pathname !== "/parent") return;
    setMode((current) => current === "touring" ? current : (seen(key) ? "idle" : "offer"));
  }, [key, location.pathname, user?.role, user?.jurisdiction]);

  const start = () => {
    if (!key || user?.role !== "parent" || !user?.jurisdiction) return;
    previousFocus.current = document.activeElement;
    setSpot(null);
    setStepIndex(0);
    setMode("touring");
    navigate("/parent", { replace: true });
  };
  useEffect(() => {
    if (openRequest > 0) start();
    // The parent layout increments this counter only when "Take a tour" is clicked.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openRequest]);

  const close = (completed = false) => {
    if (key) remember(key);
    setMode("idle");
    setSpot(null);
    if (completed) navigate("/parent", { replace: true });
    const focus = previousFocus.current;
    if (focus && typeof focus.focus === "function" && document.contains(focus)) focus.focus();
  };
  const move = (direction) => {
    const next = stepIndex + direction;
    if (next >= steps.length) { close(true); return; }
    if (next < 0) return;
    setSpot(null);
    setStepIndex(next);
    navigate(steps[next].path, { replace: true });
  };

  // Spotlight real elements as each route loads (including lazy/async screens).
  // When an anchor is absent, keep the tour usable as a normal centred card.
  useEffect(() => {
    if (mode !== "touring") return;
    let frame = null;
    let scrolled = false;
    const measure = () => {
      if (location.pathname !== step.path) { setSpot(null); return; }
      const el = document.querySelector('[data-tour="' + step.target + '"]');
      if (!el) { setSpot(null); return; }
      if (!scrolled) {
        scrolled = true;
        const bounds = el.getBoundingClientRect();
        if (bounds.top < 0 || bounds.top > Math.max(150, window.innerHeight - 340)) {
          el.scrollIntoView?.({ block: "start", behavior: "instant" });
        }
      }
      const bounds = el.getBoundingClientRect();
      if (bounds.width < 1 || bounds.height < 1) { setSpot(null); return; }
      const next = padded(bounds);
      setSpot(old => old && Object.keys(next).every(k => old[k] === next[k]) ? old : next);
    };
    const schedule = () => { if (frame == null) frame = window.requestAnimationFrame(() => { frame = null; measure(); }); };
    schedule();
    const observer = typeof MutationObserver !== "undefined"
      ? new MutationObserver(schedule) : null;
    observer?.observe(document.getElementById("root") || document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      if (frame != null) window.cancelAnimationFrame(frame);
    };
  }, [mode, location.pathname, step]);

  useEffect(() => {
    if (mode === "idle") return;
    headingRef.current?.focus();
  }, [mode, stepIndex]);

  useEffect(() => {
    if (mode === "idle") return;
    const keydown = (event) => {
      if (event.key === "Escape") { event.preventDefault(); close(false); return; }
      if (mode === "touring" && event.key === "ArrowRight") { event.preventDefault(); move(1); return; }
      if (mode === "touring" && event.key === "ArrowLeft") { event.preventDefault(); move(-1); return; }
      if (event.key !== "Tab") return;
      const dialog = document.querySelector('[data-testid="parent-tour-dialog"]');
      const controls = [...(dialog?.querySelectorAll("button:not([disabled]), a[href]") || [])];
      if (!controls.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === headingRef.current)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, stepIndex, key]);

  if (mode === "idle") return null;
  const isOffer = mode === "offer";
  const showSpot = !isOffer && spot && location.pathname === step.path;
  const full = window.innerWidth;
  const tall = window.innerHeight;
  const scrim = showSpot ? [
    { left: 0, top: 0, width: full, height: spot.top },
    { left: 0, top: spot.bottom, width: full, height: Math.max(0, tall - spot.bottom) },
    { left: 0, top: spot.top, width: spot.left, height: Math.max(0, spot.bottom - spot.top) },
    { left: spot.right, top: spot.top, width: Math.max(0, full - spot.right), height: Math.max(0, spot.bottom - spot.top) },
  ] : [];

  return (
    <div data-testid="parent-tour-root">
      {showSpot ? (
        <>
          {scrim.map((geometry, i) => <div key={i} aria-hidden="true" style={{ ...layer, ...geometry }} />)}
          <div aria-hidden="true" style={{
            ...layer, left: spot.left, top: spot.top, width: spot.right - spot.left,
            height: spot.bottom - spot.top, background: "transparent",
            border: "3px solid #F4C66D", borderRadius: 14, boxSizing: "border-box",
            boxShadow: "0 0 0 2px rgba(16,45,30,.65)",
          }}/>
        </>
      ) : <div aria-hidden="true" style={{ ...layer, inset: 0 }} />}
      <section role="dialog" aria-modal="true"
        aria-labelledby="parent-tour-title" aria-describedby="parent-tour-description"
        data-testid="parent-tour-dialog"
        className="fixed z-[110] left-4 right-4 bottom-4 sm:left-auto sm:right-6 sm:w-[420px] rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border-2 border-amber-200 max-h-[75vh] overflow-y-auto"
        style={{ color: "#1F3B2D" }}>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-emerald-900">
            {isOffer ? <Compass size={16} /> : <Map size={16} />}
            {isOffer ? "Welcome to Side-Quest" : "The dragon's guided tour"}
          </span>
          <button type="button" onClick={() => close(false)} aria-label="Close guided tour"
            data-testid="parent-tour-close" className="rounded-full p-2 hover:bg-stone-100"><X size={18}/></button>
        </div>
        <h2 id="parent-tour-title" tabIndex={-1} ref={headingRef}
          className="mt-3 font-display text-2xl font-bold focus:outline-none">
          {isOffer ? "New here? Follow the dragon! 🐉" : step.title}
        </h2>
        <p id="parent-tour-description" className="text-sm leading-relaxed mt-3 text-stone-700">
          {isOffer
            ? "There's quite a bit tucked inside Side-Quest. Want a quick look around the Parent Hub? No accounts, lessons or settings will be changed by the tour."
            : step.description}
        </p>
        {!isOffer && (
          <div className="flex items-center gap-1.5 mt-4" aria-label={"Tour step " + (stepIndex + 1) + " of " + steps.length}>
            {steps.map((s, i) => <span key={s.target} className="h-1.5 flex-1 rounded-full"
              style={{ backgroundColor: i <= stepIndex ? "#4A5D3A" : "#E7DED0" }}/>)}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-5">
          {isOffer ? <>
            <button type="button" onClick={start} className="rounded-full bg-emerald-900 text-white px-5 py-2.5 font-bold text-sm"
              data-testid="parent-tour-accept">Show me around <ArrowRight size={14} className="inline ml-1"/></button>
            <button type="button" onClick={() => close(false)} className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold"
              data-testid="parent-tour-decline">I'll explore myself</button>
          </> : <>
            <button type="button" onClick={() => move(-1)} disabled={stepIndex === 0}
              className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-bold disabled:opacity-40"
              data-testid="parent-tour-back"><ArrowLeft size={14} className="inline mr-1"/> Back</button>
            <button type="button" onClick={() => move(1)}
              className="rounded-full bg-emerald-900 text-white px-5 py-2.5 text-sm font-bold"
              data-testid="parent-tour-next">{stepIndex === steps.length - 1 ? "Finish the tour" : "Next stop"} <ArrowRight size={14} className="inline ml-1"/></button>
            <button type="button" onClick={() => close(false)} className="ml-auto text-xs font-semibold underline text-stone-600"
              data-testid="parent-tour-skip">Skip tour</button>
          </>}
        </div>
        <p className="text-[11px] text-stone-500 mt-3">
          {isOffer ? "You can take the tour later from the Parent Hub header." : "Just exploring — no changes are saved to your family's learning."}
        </p>
      </section>
    </div>
  );
}
