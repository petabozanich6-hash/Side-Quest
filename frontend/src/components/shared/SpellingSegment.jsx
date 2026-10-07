import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ChoiceSet } from "./QuestActivities";

const BTN = { backgroundColor: "#1F3B2D", color: "#F5EFE0" };

function WordPractice({ item, onCorrect }) {
  const [phase, setPhase] = useState("look");
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);

  const check = () => {
    const ok = value.trim().toLowerCase() === item.word.toLowerCase();
    setResult(ok ? "right" : "wrong");
    setPhase("checked");
    if (ok) onCorrect(item.word);
  };

  const retry = () => {
    setValue("");
    setResult(null);
    setPhase("look");
  };

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
            Look at the word. Say it out loud. Find the tricky part. Then cover it.
          </p>
          <button type="button" onClick={() => setPhase("covered")} className="mt-2 rounded-full px-5 py-2 text-sm font-bold" style={BTN}>
            I have looked and said it. Cover it
          </button>
        </div>
      )}

      {phase === "covered" && (
        <div className="mt-3">
          <p className="text-xs text-stone-600">Now write it from memory.</p>
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
          <button type="button" onClick={check} disabled={!value.trim()} className="mt-2 rounded-full px-5 py-2 text-sm font-bold disabled:opacity-40" style={BTN}>
            Check
          </button>
        </div>
      )}

      {phase === "checked" && (
        <div className="mt-3 text-sm">
          {result === "right" ? (
            <p className="font-bold text-green-800">Correct. Well done.</p>
          ) : (
            <div>
              <p className="font-bold text-amber-900">
                Not quite. You wrote "{value}". Find the part that is different, then try again.
              </p>
              <button type="button" onClick={retry} className="mt-2 rounded-full px-5 py-2 text-sm font-bold" style={BTN}>
                Try again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SpellingSegment({ spelling, onComplete }) {
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
          {words.map((item) => (
            <WordPractice key={item.word} item={item} onCorrect={(w) => setRight((r) => ({ ...r, [w]: true }))} />
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
