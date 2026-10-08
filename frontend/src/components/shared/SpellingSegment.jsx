import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ChoiceSet } from "./QuestActivities";
import { api } from "../../lib/api";
import { speakWord, speakLetters } from "../../lib/speak";

const BTN = { backgroundColor: "#1F3B2D", color: "#F5EFE0" };
const OUTLINE = { borderColor: "#1F3B2D", color: "#1F3B2D" };

const STEPS = [
  { key: "see", label: "See it" },
  { key: "hear", label: "Hear it" },
  { key: "spell", label: "Spell it" },
  { key: "type", label: "Type it" },
];

function StepBar({ phase }) {
  const active = phase === "checked" ? 3 : STEPS.findIndex((s) => s.key === phase);
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {STEPS.map((s, i) => (
        <span
          key={s.key}
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={
            i === active
              ? { backgroundColor: "#1F3B2D", color: "#F5EFE0" }
              : i < active
              ? { backgroundColor: "#DCE8DD", color: "#1F3B2D" }
              : { backgroundColor: "#EFE8D2", color: "#78716C" }
          }
        >
          {i + 1}. {s.label}
        </span>
      ))}
    </div>
  );
}

function WordPractice({ item, lessonId, onCorrect }) {
  const [phase, setPhase] = useState("see");
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const [info, setInfo] = useState(null);
  const [limited, setLimited] = useState(false);
  const [busy, setBusy] = useState(false);

  const restart = () => {
    setValue("");
    setResult(null);
    setInfo(null);
    setLimited(false);
    setPhase("see");
  };

  const goHear = () => {
    setPhase("hear");
    speakWord(item.word);
  };

  const goType = () => {
    setValue("");
    setPhase("type");
  };

  const check = async () => {
    const guess = value.trim();
    if (!guess) return;
    setBusy(true);
    let ok = guess.toLowerCase() === item.word.toLowerCase();
    let hitLimit = false;
    try {
      const { data } = await api.post("/word-bank/try", {
        word: item.word,
        guess,
        lesson_id: lessonId,
      });
      ok = !!data.correct;
      setInfo(data);
    } catch (error) {
      setInfo(null);
      hitLimit = error?.response?.status === 429;
    }
    setLimited(hitLimit);
    setBusy(false);
    setResult(ok ? "right" : "wrong");
    setPhase("checked");
    if (ok) onCorrect(item.word);
  };

  const showWord = phase === "see" || phase === "hear" || phase === "spell" || phase === "checked";
  const letters = item.word.split("");

  return (
    <div className="rounded-xl border bg-white p-4" style={{ borderColor: "#D4C8A8" }}>
      <StepBar phase={phase} />

      <div className="flex items-center gap-2">
        {showWord ? (
          <span className="font-display text-3xl font-bold" style={{ color: "#1F3B2D" }}>
            {item.word}
          </span>
        ) : (
          <span className="font-display text-3xl font-bold tracking-widest text-stone-300">
            {"\u2022".repeat(item.word.length)}
          </span>
        )}
        {result === "right" && <CheckCircle2 size={22} className="text-green-700" />}
      </div>

      {phase === "see" && (
        <div className="mt-3">
          {item.parts && <p className="text-sm text-stone-700">Chunks: <b>{item.parts}</b></p>}
          {item.tip && <p className="text-sm text-stone-700 mt-1">Remember it: {item.tip}</p>}
          <p className="text-xs text-stone-600 mt-2">
            Look closely at the word. Find the tricky part. You get 2 counted tries per word each day.
          </p>
          <button type="button" onClick={goHear} className="mt-2 rounded-full px-5 py-2 text-sm font-bold" style={BTN}>
            👀 I have seen it. Next: hear it
          </button>
        </div>
      )}

      {phase === "hear" && (
        <div className="mt-3">
          <p className="text-sm text-stone-700">Listen to the word, then say it out loud yourself.</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <button type="button" onClick={() => speakWord(item.word)} className="rounded-full border px-4 py-2 text-sm font-bold" style={OUTLINE}>
              🔊 Hear it again
            </button>
            <button type="button" onClick={() => setPhase("spell")} className="rounded-full px-5 py-2 text-sm font-bold" style={BTN}>
              🗣️ I said it. Next: spell it
            </button>
          </div>
        </div>
      )}

      {phase === "spell" && (
        <div className="mt-3">
          <p className="text-sm text-stone-700">Say each letter out loud, one at a time, as you point to it.</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {letters.map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-xl font-bold"
                style={{ borderColor: "#D4C8A8", color: "#1F3B2D", backgroundColor: "#FBF7EA" }}
              >
                {ch}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button type="button" onClick={() => speakLetters(item.word)} className="rounded-full border px-4 py-2 text-sm font-bold" style={OUTLINE}>
              🔤 Hear the letters
            </button>
            <button type="button" onClick={goType} className="rounded-full px-5 py-2 text-sm font-bold" style={BTN}>
              ⌨️ I spelled it. Next: type it
            </button>
          </div>
        </div>
      )}

      {phase === "type" && (
        <div className="mt-3">
          <p className="text-sm text-stone-700">The word is hidden now. Type it from memory.</p>
          <button type="button" onClick={() => speakWord(item.word)} className="mt-2 rounded-full border px-4 py-1.5 text-xs font-bold" style={OUTLINE}>
            🔊 Hear it again
          </button>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") check();
            }}
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            className="mt-2 w-full rounded-lg border px-3 py-2 text-base bg-white"
            style={{ borderColor: "#D4C8A8" }}
          />
          <button type="button" onClick={check} disabled={!value.trim() || busy} className="mt-2 rounded-full px-5 py-2 text-sm font-bold disabled:opacity-40" style={BTN}>
            Check
          </button>
        </div>
      )}

      {phase === "checked" && (
        <div className="mt-3 text-sm">
          {result === "right" ? (
            <div>
              <p className="font-bold text-green-800">Correct. Well done.</p>
              {info && (
                <p className="text-stone-700 mt-1">
                  {info.just_mastered
                    ? "Mastered! 10 in a row."
                    : `In your Word Hoard: ${info.streak} in a row, ${info.to_go} to go.`}
                </p>
              )}
              {info && !info.just_mastered && (
                <p className="text-stone-600 mt-1">
                  {info.attempts_left > 0
                    ? `${info.attempts_left} counted ${info.attempts_left === 1 ? "try" : "tries"} left for this word today.`
                    : "That was your last counted try for this word today. Come back to the Word Hoard tomorrow."}
                </p>
              )}
              {limited && (
                <p className="text-stone-600 mt-1">
                  You have used both counted tries for this word today, so this one was just practice.
                </p>
              )}
              <button type="button" onClick={restart} className="mt-2 rounded-full border px-4 py-1.5 text-xs font-bold" style={OUTLINE}>
                Do it again
              </button>
            </div>
          ) : (
            <div>
              <p className="font-bold text-amber-900">
                Not quite. You wrote "{value}". Compare it with the word above, find the part that is different, then go again.
              </p>
              {info && <p className="text-stone-700 mt-1">Your run in the Word Hoard starts again from 0.</p>}
              {info && (
                <p className="text-stone-600 mt-1">
                  {info.attempts_left > 0
                    ? `${info.attempts_left} counted ${info.attempts_left === 1 ? "try" : "tries"} left for this word today.`
                    : "That was your last counted try for this word today."}
                </p>
              )}
              {limited && (
                <p className="text-stone-600 mt-1">
                  You have used both counted tries for this word today, so this one was just practice.
                </p>
              )}
              <button type="button" onClick={restart} className="mt-2 rounded-full px-5 py-2 text-sm font-bold" style={BTN}>
                See it again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SpellingSegment({ spelling, lessonId, onComplete }) {
  const words = spelling?.words || [];
  const check = spelling?.check || [];
  const [right, setRight] = useState({});
  const [checkDone, setCheckDone] = useState(check.length === 0);
  const [finished, setFinished] = useState(false);

  const wordsDone = words.every((w) => right[w.word]);
  const ready = wordsDone && checkDone;

  const paragraphs = (spelling?.teaching || "").split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="space-y-5" data-testid="spelling-segment">
      {spelling?.focus && (
        <div className="text-xs font-mono uppercase text-stone-500">
          Spelling focus: {spelling.focus}
        </div>
      )}

      <div className="space-y-3 text-base leading-relaxed text-stone-800">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {words.length > 0 && (
        <div className="space-y-3">
          <div className="font-bold text-sm">Your words for this lesson</div>
          <p className="text-xs text-stone-600">
            For each word: see it, hear it, spell it out loud, then type it. These words are now in your Word Hoard. Spell each one right 10 times in a row to master it.
          </p>
          {words.map((item) => (
            <WordPractice key={item.word} item={item} lessonId={lessonId} onCorrect={(w) => setRight((r) => ({ ...r, [w]: true }))} />
          ))}
        </div>
      )}

      {check.length > 0 && (
        <div>
          <div className="font-bold text-sm mb-2">Quick check</div>
          <ChoiceSet questions={check} onComplete={() => setCheckDone(true)} />
        </div>
      )}

      {ready && !finished && (
        <button
          type="button"
          onClick={() => {
            setFinished(true);
            onComplete(true);
          }}
          className="rounded-full px-6 py-2.5 text-sm font-bold"
          style={BTN}
          data-testid="spelling-done"
        >
          I have finished the spelling stage
        </button>
      )}

      {finished && <p className="text-sm font-bold text-green-800">Spelling stage complete.</p>}
    </div>
  );
}
