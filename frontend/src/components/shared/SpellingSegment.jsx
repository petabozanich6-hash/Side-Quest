import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ChoiceSet } from "./QuestActivities";
import { api } from "../../lib/api";
import { speakWord } from "../../lib/speak";

const BTN = { backgroundColor: "#1F3B2D", color: "#F5EFE0" };

function WordPractice({ item, lessonId, onCorrect }) {
  const [phase, setPhase] = useState("look");
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const [info, setInfo] = useState(null);
  const [limited, setLimited] = useState(false);
  const [busy, setBusy] = useState(false);

  const startTry = () => {
    setValue("");
    setResult(null);
    setInfo(null);
    setPhase("covered");
    speakWord(item.word);
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

  const canAgainInHoard = !limited && (!info || info.attempts_left > 0);

  return (
    <div className="rounded-xl border bg-white p-4" style={{ borderColor: "#D4C8A8" }}>
      <div className="flex items-center gap-2">
        {phase === "look" || phase === "checked" ? (
          <span className="font-display text-2xl font-bold" style={{ color: "#1F3B2D" }}>
            {item.word}
          </span>
        ) : (
          <span className="font-display text-2xl font-bold tracking-widest text-stone-300">
            {"\u2022".repeat(item.word.length)}
          </span>
        )}
        {result === "right" && <CheckCircle2 size={20} className="text-green-700" />}
      </div>

      {item.parts && <p className="text-sm text-stone-700 mt-1">Parts: {item.parts}</p>}
      {item.tip && <p className="text-sm text-stone-700 mt-1">Remember it: {item.tip}</p>}

      {phase === "look" && (
        <div className="mt-3">
          <p className="text-xs text-stone-600">
            Look at the word. Say it out loud. Find the tricky part. When you are ready, the word will be blocked out and you spell it yourself. You get 2 counted tries per word each day.
          </p>
          <button type="button" onClick={startTry} className="mt-2 rounded-full px-5 py-2 text-sm font-bold" style={BTN}>
            ✏️ Try spelling now
          </button>
        </div>
      )}

      {phase === "covered" && (
        <div className="mt-3">
          <p className="text-xs text-stone-600">The word is hidden. Write it from memory.</p>
          <button
            type="button"
            onClick={() => speakWord(item.word)}
            className="mt-2 rounded-full border px-4 py-1.5 text-xs font-bold"
            style={{ borderColor: "#1F3B2D", color: "#1F3B2D" }}
          >
            🔊 Hear it again
          </button>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
              <button type="button" onClick={startTry} className="mt-2 rounded-full border px-4 py-1.5 text-xs font-bold" style={{ borderColor: "#1F3B2D", color: "#1F3B2D" }}>
                {canAgainInHoard ? "Spell it again" : "Practise it again (not counted)"}
              </button>
            </div>
          ) : (
            <div>
              <p className="font-bold text-amber-900">
                Not quite. You wrote "{value}". Find the part that is different, then try again.
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
              <button type="button" onClick={startTry} className="mt-2 rounded-full px-5 py-2 text-sm font-bold" style={BTN}>
                Try again
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
            These words are now in your Word Hoard. Spell each one right 10 times in a row to master it. Each word gets 2 counted tries per day.
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
