/** Shared Pip / Juno cast for teaching and cartoon episodes. Original Side-Quest characters. */

export const CAST = {
  pip: {
    id: "pip",
    name: "Pip",
    body: "#38bdf8",
    belly: "#e0f2fe",
    pitch: 1.35,
    rate: 0.95,
    ears: true,
    x: 150,
  },
  juno: {
    id: "juno",
    name: "Juno",
    body: "#fb923c",
    belly: "#ffedd5",
    pitch: 0.95,
    rate: 0.92,
    ears: false,
    x: 650,
  },
};

export function pickVoice(who) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const english = voices.filter((v) => v.localService && /^en/i.test(v.lang));
  const au = english.filter((v) => /en-AU/i.test(v.lang));
  const pool = au.length ? au : english;
  if (!pool.length) return null;
  return who === "pip" ? pool[0] : pool[Math.min(1, pool.length - 1)];
}

export function captionMs(text) {
  return 1400 + String(text || "").length * 62;
}
