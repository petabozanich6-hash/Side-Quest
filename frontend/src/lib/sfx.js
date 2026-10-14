// Small friendly sounds made on the device with the Web Audio API (no files, nothing downloaded, nothing sent anywhere).
// Quiet by default, only ever played after a tap, and the child can mute them.

const KEY = "sidequest-sfx";
let ctx = null;

export const sfxOn = () => { try { return window.localStorage.getItem(KEY) !== "off"; } catch { return true; } };
export const setSfx = (on) => { try { window.localStorage.setItem(KEY, on ? "on" : "off"); } catch { /* storage blocked: lasts until the page closes */ } };

const audio = () => {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch { return null; }
};

const tone = (c, { f, t = 0, d = 0.14, type = "sine", v = 0.06, to }) => {
  const o = c.createOscillator(), g = c.createGain();
  const at = c.currentTime + t;
  o.type = type; o.frequency.setValueAtTime(f, at);
  if (to) o.frequency.exponentialRampToValueAtTime(to, at + d);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(v, at + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, at + d);
  o.connect(g); g.connect(c.destination);
  o.start(at); o.stop(at + d + 0.02);
};

const SOUNDS = {
  feed: (c) => { tone(c, { f: 300, d: 0.08, type: "triangle" }); tone(c, { f: 260, t: 0.12, d: 0.08, type: "triangle" }); tone(c, { f: 340, t: 0.24, d: 0.1, type: "triangle" }); },
  play: (c) => { tone(c, { f: 400, to: 800, d: 0.18 }); tone(c, { f: 600, t: 0.2, to: 1000, d: 0.18 }); },
  clean: (c) => { [880, 1175, 1568].forEach((f, i) => tone(c, { f, t: i * 0.07, d: 0.16, v: 0.04 })); },
  coin: (c) => { tone(c, { f: 988, d: 0.08, type: "square", v: 0.03 }); tone(c, { f: 1319, t: 0.08, d: 0.22, type: "square", v: 0.03 }); },
  cheer: (c) => { [523, 659, 784, 1047].forEach((f, i) => tone(c, { f, t: i * 0.09, d: 0.2 })); },
  pop: (c) => { tone(c, { f: 500, to: 220, d: 0.1, v: 0.07 }); },
  buy: (c) => { tone(c, { f: 660, d: 0.1 }); tone(c, { f: 880, t: 0.1, d: 0.18 }); },
};

export function playSfx(kind) {
  if (!sfxOn()) return;
  const c = audio();
  if (c && SOUNDS[kind]) { try { SOUNDS[kind](c); } catch { /* sound is a bonus */ } }
}
