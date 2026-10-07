import React, { useEffect, useRef, useState } from "react";

function useReport(ok, onComplete) {
  const cb = useRef(onComplete);
  cb.current = onComplete;

  useEffect(() => {
    if (cb.current) cb.current(ok);
  }, [ok]);
}

const GOOD = "border-green-500 bg-green-50 text-green-900";
const BAD = "border-red-400 bg-red-50 text-red-900";
const PICK = "border-blue-500 bg-blue-50 text-blue-900";
const IDLE = "border-stone-200 bg-white hover:border-blue-300";

export function RevealCards({ cards = [], onComplete }) {
  const [seen, setSeen] = useState({});
  const allSeen = cards.every((_, i) => seen[i]);

  useReport(allSeen, onComplete);

  if (cards.length === 0) return null;

  const count = cards.filter((_, i) => seen[i]).length;

  return (
    <div>
      <p className="text-sm text-stone-600 mb-3">
        Tap every card to flip it. {count} of {cards.length} flipped.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((card, i) => {
          const flipped = !!seen[i];

          return (
            <button
              key={i}
              type="button"
              onClick={() => setSeen((s) => ({ ...s, [i]: true }))}
              className="min-h-[7rem] rounded-xl border p-3 text-left transition hover:translate-y-[-2px]"
              style={{
                borderColor: flipped ? "#94A47F" : "#D4C8A8",
                backgroundColor: flipped ? "#F0F4E8" : "#FFFFFF"
              }}
            >
              {flipped ? (
                <div>
                  <div className="font-bold text-sm">{card.front}</div>
                  <p className="text-sm mt-1">{card.back}</p>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] font-mono uppercase text-stone-500">
                    Tap to reveal
                  </div>
                  <p className="font-bold text-lg mt-1">{card.front}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SortActivity({ activity, onComplete }) {
  const items = activity.items || [];
  const buckets = activity.buckets || [];
  const [picks, setPicks] = useState({});
  const [checked, setChecked] = useState(false);

  const allPicked = items.every((_, i) => typeof picks[i] === "number");
  const allRight = items.every((it, i) => picks[i] === it.answer);

  useReport(checked && allRight, onComplete);

  const choose = (i, b) => {
    setPicks((p) => ({ ...p, [i]: b }));
    setChecked(false);
  };

  return (
    <div>
      <p className="text-sm text-stone-700 mb-3">{activity.instructions}</p>

      <div className="space-y-3">
        {items.map((item, i) => {
          const wrong =
            checked && typeof picks[i] === "number" && picks[i] !== item.answer;
          const right = checked && picks[i] === item.answer;

          return (
            <div
              key={i}
              className={`rounded-xl border p-3 ${
                right ? GOOD : wrong ? BAD : "border-stone-200 bg-white"
              }`}
            >
              <p className="text-sm font-semibold">{item.text}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {buckets.map((bucket, b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => choose(i, b)}
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${
                      picks[i] === b ? PICK : IDLE
                    }`}
                  >
                    {bucket}
                  </button>
                ))}
              </div>

              {wrong && (
                <p className="text-xs mt-2">
                  Not quite. Think about what this sentence does in the story, then
                  pick again.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!allPicked}
        onClick={() => setChecked(true)}
        className="mt-4 rounded-full px-5 py-2 text-sm font-bold disabled:opacity-50"
        style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }}
      >
        {allPicked ? "Check my sorting" : "Sort every sentence first"}
      </button>

      {checked && allRight && (
        <p className="mt-3 text-sm font-bold text-green-800">
          Perfect sorting! You can spot the story parts.
        </p>
      )}
    </div>
  );
}

export function ChoiceSet({ questions = [], onComplete }) {
  const [picks, setPicks] = useState({});

  const isOk = (q, i) =>
    typeof picks[i] === "number" &&
    (typeof q.correct_index !== "number" || picks[i] === q.correct_index);

  const allOk = questions.every((q, i) => isOk(q, i));

  useReport(allOk, onComplete);

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div
          key={i}
          className="rounded-xl border bg-white p-3"
          style={{ borderColor: "#D4C8A8" }}
        >
          <p className="text-sm font-semibold">{q.question}</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {q.options.map((opt, o) => {
              const picked = picks[i] === o;
              const ok = isOk(q, i);

              let cls = IDLE;
              if (picked && ok) cls = GOOD;
              else if (picked && !ok) cls = BAD;

              return (
                <button
                  key={o}
                  type="button"
                  disabled={ok}
                  onClick={() => setPicks((p) => ({ ...p, [i]: o }))}
                  className={`rounded-full border px-4 py-1.5 text-sm font-bold ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {typeof picks[i] === "number" && !isOk(q, i) && (
            <p className="text-xs mt-2 text-red-800">
              Not quite. Have another go.
            </p>
          )}

          {isOk(q, i) && q.explanation && (
            <p className="text-xs mt-2 text-green-800">{q.explanation}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function SentenceBuilder({ builder, onComplete }) {
  const [picks, setPicks] = useState({});
  const slots = builder.slots || [];

  const slotOk = (i) => picks[i] === slots[i].correct;
  const allOk = slots.every((_, i) => slotOk(i));

  useReport(allOk, onComplete);

  return (
    <div
      className="rounded-xl border bg-white p-4"
      style={{ borderColor: "#D4C8A8" }}
    >
      <div className="font-bold text-sm mb-1">{builder.title}</div>
      <p className="text-sm text-stone-700 mb-3">{builder.instructions}</p>

      <p className="text-base leading-9">
        {builder.template.map((part, k) => {
          if (typeof part === "string") return <span key={k}>{part}</span>;

          const i = part;
          const chosen = typeof picks[i] === "number";

          return (
            <select
              key={k}
              value={chosen ? picks[i] : ""}
              onChange={(e) =>
                setPicks((p) => ({ ...p, [i]: Number(e.target.value) }))
              }
              className={`mx-1 rounded-lg border px-2 py-1 text-sm font-semibold ${
                !chosen ? "border-stone-300 bg-white" : slotOk(i) ? GOOD : BAD
              }`}
            >
              <option value="" disabled>
                choose…
              </option>

              {slots[i].options.map((opt, o) => (
                <option key={o} value={o}>
                  {opt}
                </option>
              ))}
            </select>
          );
        })}
      </p>

      {allOk ? (
        <p className="mt-3 text-sm font-bold text-green-800">{builder.success}</p>
      ) : (
        <p className="mt-3 text-xs text-stone-500">
          Red means try a different piece. Green means it builds suspense.
        </p>
      )}
    </div>
  );
}

export function Planner({ fields = [], values, setValues, onComplete }) {
  const ok = fields.every((f) => (values[f.key] || "").trim().length >= 3);

  useReport(ok, onComplete);

  return (
    <div className="space-y-3">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="text-sm font-bold">{f.label}</label>
          <p className="text-xs text-stone-600">{f.hint}</p>

          <textarea
            rows={2}
            value={values[f.key] || ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, [f.key]: e.target.value }))
            }
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
            style={{ borderColor: "#D4C8A8" }}
          />
        </div>
      ))}

      {!ok && (
        <p className="text-xs text-stone-500">
          Fill in every box to unlock the next stage.
        </p>
      )}
    </div>
  );
}
