import { useCallback, useEffect, useRef } from "react";
import { CAST, captionMs, pickVoice } from "./cast";

/**
 * Optional browser speechSynthesis. Never autoplays loudly on mount —
 * caller decides when to speak. Falls back to timed captions when muted
 * or when speech is unavailable.
 */
export default function useSpeechNarration({ muted, reducedMotion }) {
  const timer = useRef(null);
  const hasSpeech = typeof window !== "undefined" && !!window.speechSynthesis;

  const cancel = useCallback(() => {
    clearTimeout(timer.current);
    if (hasSpeech) window.speechSynthesis.cancel();
  }, [hasSpeech]);

  useEffect(() => cancel, [cancel]);

  const speak = useCallback(
    (who, text, onDone) => {
      cancel();
      const done = () => {
        clearTimeout(timer.current);
        if (typeof onDone === "function") onDone();
      };
      const fallback = captionMs(text) + (reducedMotion ? 200 : 400);
      const voice = hasSpeech && !muted ? pickVoice(who) : null;
      if (voice) {
        const u = new SpeechSynthesisUtterance(text);
        const cast = CAST[who] || CAST.pip;
        u.voice = voice;
        u.pitch = cast.pitch;
        u.rate = cast.rate;
        u.onend = done;
        u.onerror = done;
        window.speechSynthesis.speak(u);
        timer.current = setTimeout(done, fallback + 6000);
      } else {
        timer.current = setTimeout(done, fallback);
      }
    },
    [cancel, hasSpeech, muted, reducedMotion]
  );

  return { hasSpeech, speak, cancel };
}
