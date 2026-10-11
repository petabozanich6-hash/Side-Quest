import React, { useCallback, useEffect, useRef, useState } from "react";

// Plays a short animated cartoon episode inside a lesson. No video file, no paid service.
// episode = { title, transcript?, scenes: [{ bg: "park"|"room"|"evening", lines: [{ who: "pip"|"juno", text, blocks?: [{ t, c }] }] }] }
// block colour codes c: who, did, det, bad, mark, plain
// Voices come from the browser (speechSynthesis). If no voice is available the lines still play with timed captions.

const CAST = {
  pip: { name: "Pip", body: "#38bdf8", belly: "#e0f2fe", pitch: 1.4, rate: 0.95, ears: true, x: 190 },
  juno: { name: "Juno", body: "#fb923c", belly: "#ffedd5", pitch: 0.95, rate: 0.92, ears: false, x: 610 },
};

const BLOCK = {
  who: ["#dbeafe", "#1e40af"],
  did: ["#ffedd5", "#9a3412"],
  det: ["#dcfce7", "#166534"],
  bad: ["#fee2e2", "#991b1b"],
  mark: ["#ede9fe", "#5b21b6"],
  plain: ["#f3f4f6", "#1f2937"],
};

function Background({ kind }) {
  if (kind === "room") {
    return (
      <g>
        <rect width="800" height="450" fill="#fef3c7" />
        <rect y="330" width="800" height="120" fill="#d6a56a" />
        <rect x="60" y="60" width="120" height="130" rx="8" fill="#bae6fd" stroke="#92400e" strokeWidth="8" />
        <line x1="120" y1="60" x2="120" y2="190" stroke="#92400e" strokeWidth="6" />
        <rect x="620" y="70" width="120" height="90" rx="6" fill="#fde68a" stroke="#b45309" strokeWidth="6" />
        <rect x="640" y="90" width="80" height="10" fill="#b45309" />
        <rect x="640" y="112" width="60" height="10" fill="#b45309" />
      </g>
    );
  }
  if (kind === "evening") {
    return (
      <g>
        <defs>
          <linearGradient id="ce-eve" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#fb923c" />
          </linearGradient>
        </defs>
        <rect width="800" height="450" fill="url(#ce-eve)" />
        <circle cx="650" cy="150" r="46" fill="#fde68a" />
        <path d="M0 340 Q200 280 400 340 T800 330 V450 H0Z" fill="#4c1d95" />
        <rect y="380" width="800" height="70" fill="#312e81" />
      </g>
    );
  }
  return (
    <g>
      <defs>
        <linearGradient id="ce-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#ce-sky)" />
      <circle cx="90" cy="80" r="40" fill="#fde047" />
      <g className="ce-cloud"><ellipse cx="420" cy="70" rx="60" ry="20" fill="#fff" /><ellipse cx="460" cy="58" rx="40" ry="18" fill="#fff" /></g>
      <path d="M0 320 Q180 250 360 320 T800 300 V450 H0Z" fill="#86efac" />
      <rect y="360" width="800" height="90" fill="#4ade80" />
      <rect x="690" y="220" width="22" height="100" fill="#92400e" />
      <circle cx="701" cy="205" r="58" fill="#22c55e" />
    </g>
  );
}

function Character({ id, talking, active }) {
  const c = CAST[id];
  const flip = id === "juno" ? -1 : 1;
  return (
    <g transform={`translate(${c.x} 330) scale(${flip} 1)`} className={active ? "ce-hop" : "ce-idle"}>
      <ellipse cx="0" cy="74" rx="70" ry="12" fill="rgba(0,0,0,.18)" />
      {c.ears ? (
        <g>
          <ellipse cx="-48" cy="-78" rx="16" ry="28" fill={c.body} />
          <ellipse cx="48" cy="-78" rx="16" ry="28" fill={c.body} />
        </g>
      ) : (
        <g>
          <line x1="0" y1="-94" x2="0" y2="-128" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
          <circle className="ce-glow" cx="0" cy="-134" r="10" fill="#fde047" />
        </g>
      )}
      <ellipse cx="0" cy="-10" rx="78" ry="84" fill={c.body} />
      <ellipse cx="0" cy="22" rx="46" ry="46" fill={c.belly} />
      <g className="ce-arm-l"><ellipse cx="-80" cy="10" rx="18" ry="32" fill={c.body} transform="rotate(18 -80 10)" /></g>
      <g className={active ? "ce-arm-wave" : ""}><ellipse cx="80" cy="10" rx="18" ry="32" fill={c.body} transform="rotate(-18 80 10)" /></g>
      <ellipse cx="-38" cy="72" rx="26" ry="14" fill={c.body} />
      <ellipse cx="38" cy="72" rx="26" ry="14" fill={c.body} />
      <g className="ce-blink">
        <circle cx="-26" cy="-30" r="17" fill="#fff" />
        <circle cx="26" cy="-30" r="17" fill="#fff" />
        <circle cx="-22" cy="-28" r="8" fill="#111827" />
        <circle cx="30" cy="-28" r="8" fill="#111827" />
      </g>
      <ellipse cx="-44" cy="-2" rx="10" ry="6" fill="#f472b6" opacity=".55" />
      <ellipse cx="44" cy="-2" rx="10" ry="6" fill="#f472b6" opacity=".55" />
      {talking ? (
        <ellipse className="ce-mouth" cx="0" cy="10" rx="16" ry="10" fill="#7f1d1d" />
      ) : (
        <path d="M-16 6 Q0 20 16 6" fill="none" stroke="#7f1d1d" strokeWidth="5" strokeLinecap="round" />
      )}
    </g>
  );
}

function pickVoice(id) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const english = voices.filter((v) => /^en/i.test(v.lang));
  const au = english.filter((v) => /en-AU/i.test(v.lang));
  const pool = au.length ? au : english.length ? english : voices;
  if (!pool.length) return null;
  return id === "pip" ? pool[0] : pool[Math.min(1, pool.length - 1)];
}

export default function CartoonEpisode({ episode }) {
  const lines = [];
  (episode?.scenes || []).forEach((scene) =>
    (scene.lines || []).forEach((line) => lines.push({ ...line, bg: scene.bg }))
  );

  const [idx, setIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const timer = useRef(null);
  const hasSpeech = typeof window !== "undefined" && !!window.speechSynthesis;

  const stop = useCallback(() => {
    clearTimeout(timer.current);
    if (hasSpeech) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [hasSpeech]);

  useEffect(() => {
    if (!playing || idx < 0 || idx >= lines.length) return undefined;
    const line = lines[idx];
    let finished = false;
    const next = () => {
      if (finished) return;
      finished = true;
      setSpeaking(false);
      timer.current = setTimeout(() => {
        if (idx + 1 >= lines.length) {
          setPlaying(false);
          setIdx(lines.length);
        } else {
          setIdx(idx + 1);
        }
      }, 500);
    };
    const fallbackMs = 1400 + line.text.length * 62;
    setSpeaking(true);
    if (hasSpeech && !muted) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(line.text);
      const cast = CAST[line.who] || CAST.pip;
      const voice = pickVoice(line.who);
      if (voice) u.voice = voice;
      u.pitch = cast.pitch;
      u.rate = cast.rate;
      u.onend = next;
      u.onerror = next;
      window.speechSynthesis.speak(u);
      timer.current = setTimeout(next, fallbackMs + 6000);
    } else {
      timer.current = setTimeout(next, fallbackMs);
    }
    return () => {
      finished = true;
      clearTimeout(timer.current);
      if (hasSpeech) window.speechSynthesis.cancel();
    };
  }, [idx, playing, muted]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => stop, [stop]);

  const start = () => {
    setIdx(0);
    setPlaying(true);
  };
  const toggle = () => {
    if (idx < 0 || idx >= lines.length) return start();
    if (playing) {
      stop();
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  };
  const skip = (d) => {
    stop();
    const n = Math.max(0, Math.min(lines.length - 1, (idx < 0 ? 0 : idx) + d));
    setIdx(n);
  };

  if (!lines.length) return null;
  const current = lines[Math.max(0, Math.min(idx, lines.length - 1))];
  const showing = idx >= 0 && idx < lines.length;
  const bg = current.bg;
  const lastBlocks = (() => {
    for (let i = Math.min(idx, lines.length - 1); i >= 0; i -= 1) {
      if (lines[i].blocks && lines[i].blocks.length) return { blocks: lines[i].blocks, key: i };
    }
    return { blocks: [], key: -1 };
  })();

  return (
    <figure className="ce-wrap" data-testid="cartoon-episode">
      <style>{`
        .ce-wrap{margin:12px auto;max-width:760px}
        .ce-screen{position:relative;border-radius:18px;overflow:hidden;border:4px solid #1e293b;background:#000;aspect-ratio:16/9}
        .ce-screen svg{position:absolute;inset:0;width:100%;height:100%}
        .ce-board{position:absolute;left:4%;right:4%;top:6%;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;font-weight:800;font-size:clamp(14px,3.1vw,26px);font-family:Arial,sans-serif}
        .ce-block{padding:4px 12px;border-radius:12px;box-shadow:0 3px 0 rgba(0,0,0,.18);animation:cePop .45s ease both}
        .ce-cap{position:absolute;left:0;right:0;bottom:0;background:rgba(15,23,42,.82);color:#fff;padding:8px 14px;font-size:clamp(13px,2.4vw,19px);font-family:Arial,sans-serif;min-height:3.2em}
        .ce-cap b{color:#fde047}
        .ce-title{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-family:Arial,sans-serif;text-align:center;padding:20px}
        .ce-title h3{font-size:clamp(20px,4vw,34px);margin:0 0 10px}
        .ce-btn{background:#fde047;color:#1f2937;border:0;border-radius:999px;padding:10px 24px;font-size:18px;font-weight:800;cursor:pointer}
        .ce-ctl{display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap}
        .ce-ctl button{background:#e2e8f0;border:0;border-radius:10px;padding:6px 14px;font-size:14px;cursor:pointer}
        .ce-hop{animation:ceHop .5s ease-in-out infinite alternate}
        .ce-idle{animation:ceIdle 2.4s ease-in-out infinite}
        .ce-mouth{transform-box:fill-box;transform-origin:center;animation:ceMouth .22s ease-in-out infinite alternate}
        .ce-blink{transform-box:fill-box;transform-origin:center;animation:ceBlink 4s infinite}
        .ce-arm-wave{transform-box:fill-box;transform-origin:50% 0;animation:ceWave .5s ease-in-out infinite alternate}
        .ce-glow{animation:ceGlow 1s ease-in-out infinite alternate}
        .ce-cloud{animation:ceCloud 30s linear infinite alternate}
        @keyframes cePop{from{opacity:0;transform:translateY(14px) scale(.8)}to{opacity:1;transform:none}}
        @keyframes ceHop{to{transform:translateY(-8px)}}
        @keyframes ceIdle{50%{transform:translateY(-3px)}}
        @keyframes ceMouth{to{transform:scaleY(.35)}}
        @keyframes ceBlink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
        @keyframes ceWave{to{transform:rotate(-28deg)}}
        @keyframes ceGlow{to{opacity:.4}}
        @keyframes ceCloud{to{transform:translateX(90px)}}
        @media (prefers-reduced-motion:reduce){.ce-wrap *{animation:none!important}}
      `}</style>

      <div className="ce-screen">
        <svg viewBox="0 0 800 450" role="img" aria-label={episode.title || "Cartoon episode"}>
          <Background kind={bg} />
          <Character id="pip" talking={showing && speaking && current.who === "pip"} active={showing && current.who === "pip"} />
          <Character id="juno" talking={showing && speaking && current.who === "juno"} active={showing && current.who === "juno"} />
        </svg>

        {showing && (
          <div className="ce-board" key={lastBlocks.key}>
            {lastBlocks.blocks.map((b, i) => {
              const [bgc, fg] = BLOCK[b.c] || BLOCK.plain;
              return (
                <span key={i} className="ce-block" style={{ background: bgc, color: fg, animationDelay: `${i * 0.18}s` }}>
                  {b.t}
                </span>
              );
            })}
          </div>
        )}

        {showing && (
          <div className="ce-cap">
            <b>{(CAST[current.who] || CAST.pip).name}:</b> {current.text}
          </div>
        )}

        {!showing && (
          <div className="ce-title">
            <h3>{idx >= lines.length ? "The end! Well done!" : episode.title}</h3>
            <button type="button" className="ce-btn" onClick={start}>
              {idx >= lines.length ? "Watch again" : "Play episode"}
            </button>
          </div>
        )}
      </div>

      <div className="ce-ctl">
        <button type="button" onClick={() => skip(-1)}>Back</button>
        <button type="button" onClick={toggle}>{playing ? "Pause" : "Play"}</button>
        <button type="button" onClick={() => skip(1)}>Next</button>
        <button type="button" onClick={start}>Restart</button>
        {hasSpeech && (
          <button type="button" onClick={() => { stop(); setMuted((m) => !m); }}>{muted ? "Sound off" : "Sound on"}</button>
        )}
      </div>

      {episode.transcript && (
        <details className="mt-2 text-sm text-slate-700">
          <summary>Read the transcript</summary>
          <p className="mt-1 whitespace-pre-wrap">{episode.transcript}</p>
        </details>
      )}
      <figcaption className="mt-1 text-center text-sm italic text-stone-700">{episode.title}</figcaption>
    </figure>
  );
}
