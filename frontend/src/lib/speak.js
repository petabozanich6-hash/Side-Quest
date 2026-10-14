// Reads spelling words aloud clearly: an English voice, a low steady pitch,
// a slow rate. speakWord says the word twice; speakLetters says the letters.

import { bestVoice } from "./voice";

const pickVoice = () => bestVoice();

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
  utter.pitch = 1;
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
