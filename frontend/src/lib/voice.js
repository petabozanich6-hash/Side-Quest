// Clearer read-aloud using the voices already on the child's device (free; nothing is sent anywhere).
// What made it hard to understand: the first English voice was used whatever its quality, maths symbols were read badly
// ("−7 < −3"), and long passages were spoken in one go, which makes many voices slur or cut out.
// This picks the best English voice available, says symbols as words, speaks sentence by sentence and lets the child change voice and speed.

const KEY = "sidequest-voice";
const AVOID = /(compact|novelty|whisper|zarvox|bells|bad news|good news|bubbles|cellos|organ|trinoids|albert|junior|fred|ralph|jester|superstar|boing|deranged|hysterical|pipe|wobble|espeak|robot)/i;
const GOOD_NAMES = /(libby|sonia|natasha|william|ryan|clara|karen|catherine|daniel|serena|kate|samantha|jenny|aria|google uk english|google australian|google us english|moira|tessa)/i;

const supported = () => typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

export function getVoicePrefs() {
  try { const v = JSON.parse(window.localStorage.getItem(KEY) || "{}"); return { rate: Number(v.rate) > 0 ? Number(v.rate) : 0.9, voice: typeof v.voice === "string" ? v.voice : "" }; }
  catch { return { rate: 0.9, voice: "" }; }
}
export function setVoicePrefs(p) {
  try { window.localStorage.setItem(KEY, JSON.stringify({ ...getVoicePrefs(), ...p })); } catch { /* storage may be blocked; the choice just lasts until the page closes */ }
}

const score = (v) => {
  const lang = (v.lang || "").toLowerCase().replace("_", "-");
  let s = 0;
  if (/(natural|neural|online|premium|enhanced)/i.test(v.name)) s += 100;
  if (GOOD_NAMES.test(v.name)) s += 40;
  if (lang.startsWith("en-au")) s += 22; else if (lang.startsWith("en-gb")) s += 18; else if (lang.startsWith("en-nz")) s += 14; else if (lang.startsWith("en-us")) s += 10; else s += 2;
  if (AVOID.test(v.name)) s -= 300;
  return s;
};

export function englishVoices() {
  if (!supported()) return [];
  return (window.speechSynthesis.getVoices() || []).filter((v) => /^en([-_]|$)/i.test(v.lang || "")).sort((a, b) => score(b) - score(a));
}

export function bestVoice() {
  const list = englishVoices();
  if (!list.length) return null;
  const saved = getVoicePrefs().voice;
  return list.find((v) => v.name === saved) || list[0];
}

/** Say maths and symbols as a child would hear them from a teacher, and tidy text that is written for the eye. */
export function prepareSpeech(text) {
  let t = String(text ?? "");
  t = t.replace(/[*_#`]+/g, " ").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  // a minus sign straight before a number, at the start or after an operator or bracket, is a negative number
  t = t.replace(/(^|[\s(=,:<>×÷+])[−–-](?=\d)/g, "$1negative ");
  t = t.replace(/\s[−–]\s/g, " minus ").replace(/\s-\s(?=\d)/g, " minus ");
  t = t.replace(/≤/g, " is less than or equal to ").replace(/≥/g, " is greater than or equal to ").replace(/≠/g, " is not equal to ");
  t = t.replace(/\s*<\s*/g, " is less than ").replace(/\s*>\s*/g, " is greater than ");
  t = t.replace(/\s*=\s*/g, " equals ").replace(/\s*\+\s*/g, " plus ").replace(/(\d)\s*[×x]\s*(?=\d)/g, "$1 times ").replace(/\s*×\s*/g, " times ").replace(/\s*÷\s*/g, " divided by ");
  t = t.replace(/(\d)\s*\/\s*(\d)/g, "$1 over $2").replace(/(\d)\s*%/g, "$1 per cent");
  t = t.replace(/\$\s?(\d[\d,.]*)/g, "$1 dollars").replace(/°\s?C\b/g, " degrees Celsius").replace(/°/g, " degrees");
  t = t.replace(/\|/g, ", ").replace(/\s*\n+\s*/g, ". ").replace(/\.\s*\.+/g, ".").replace(/\s{2,}/g, " ");
  return t.trim();
}

/** Short pieces at sentence ends: voices stay clear and never cut out part-way through a long passage. */
export function chunks(text, max = 180) {
  const parts = prepareSpeech(text).split(/(?<=[.!?;:])\s+/).filter(Boolean);
  const out = [];
  for (const p of parts) {
    if (p.length <= max) { out.push(p); continue; }
    let cur = "";
    for (const w of p.split(/\s+/)) { if ((cur + " " + w).length > max && cur) { out.push(cur.trim()); cur = w; } else cur += " " + w; }
    if (cur.trim()) out.push(cur.trim());
  }
  return out;
}

export function stopSpeaking() { try { if (supported()) window.speechSynthesis.cancel(); } catch { /* ignore */ } }

/** Reads `text` aloud. Returns false when this device has no speech. onEnd runs when it finishes or fails. */
export function readAloud(text, { onEnd, rate } = {}) {
  if (!supported()) return false;
  const synth = window.speechSynthesis;
  const pieces = chunks(text);
  if (!pieces.length) return false;
  synth.cancel();
  const prefs = getVoicePrefs();
  const voice = bestVoice();
  pieces.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = "en-AU";
    u.rate = rate || prefs.rate; u.pitch = 1; u.volume = 1;
    if (i === pieces.length - 1) { u.onend = () => onEnd && onEnd(); }
    u.onerror = () => { if (i === pieces.length - 1) onEnd && onEnd(); };
    synth.speak(u);
  });
  return true;
}
