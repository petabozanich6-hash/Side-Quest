// Reads spelling words aloud clearly: an English voice, a low steady pitch,
// a slow rate. speakWord says the word twice; speakLetters says the letters.

let cachedVoice = null;

const PREFERRED_LANGS = ["en-au", "en-gb", "en-nz", "en-us", "en"];
const AVOID = /(compact|novelty|whisper|zarvox|bells|bad news|good news|bubbles|cellos|organ|trinoids|albert|junior|fred|ralph)/i;

function pickVoice() {
  if (cachedVoice) return cachedVoice;
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return null;

  const usable = voices.filter((v) => !AVOID.test(v.name));

  for (const lang of PREFERRED_LANGS) {
    const matches = usable.filter((v) => (v.lang || "").toLowerCase().replace("_", "-").startsWith(lang));
    if (matches.length === 0) continue;

    const natural = matches.find((v) => /(natural|premium|enhanced|neural|online)/i.test(v.name));
    const female = matches.find((v) => /(karen|catherine|natasha|libby|hazel|susan|samantha|google)/i.test(v.name));
    cachedVoice = natural || female || matches[0];
    return cachedVoice;
  }

  return null;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}

function say(text, rate) {
  const utter = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();

  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  } else {
    utter.lang = "en-AU";
  }

  utter.rate = rate;
  utter.pitch = 0.9;
  utter.volume = 1;
  return utter;
}

export function speakWord(word) {
  if (typeof window === "undefined" || !window.speechSynthesis || !word) return false;

  const synth = window.speechSynthesis;
  synth.cancel();

  const first = say(word, 0.55);
  const second = say(word, 0.45);

  first.onend = () => {
    window.setTimeout(() => synth.speak(second), 700);
  };

  synth.speak(first);
  return true;
}

export function speakLetters(word) {
  if (typeof window === "undefined" || !window.speechSynthesis || !word) return false;

  const synth = window.speechSynthesis;
  synth.cancel();

  const letters = word.replace(/[^a-zA-Z]/g, "").split("").join(", ");
  synth.speak(say(letters, 0.5));
  return true;
}
