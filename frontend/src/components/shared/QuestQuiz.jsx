import React, { useState } from "react";

export default function QuestQuiz({ quiz = [], passMark = 0.9, onResult }) {
  const questions = quiz.filter((q) => q.type !== "short_answer");
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [attempt, setAttempt] = useState(1);

  const total = questions.length;
  if (total === 0) return null;

  const needed = Math.ceil(total * passMark - 1e-9);
  const score = questions.filter((q, i) => answers[i] === q.correct_index).length;
  const passed = score >= needed;
  const complete = questions.every((_, i) => typeof answers[i] === "number");
  const percent = Math.round((score / total) * 100);

  const check = () => {
    setChecked(true);
    onResult?.({ score, total, needed, passed, attempt, percent });
  };

  const retry = () => {
    setAnswers({});
    setChecked(false);
    setAttempt((n) => n + 1);
    onResult?.(null);
  };

  return (
    <div data-testid="quest-quiz">
      <p className="text-sm text-stone-600 mb-4">
        Answer all {total} questions. You need {needed} out of {total} (
        {Math.round(passMark * 100)}%) to clear this part of the quest. You can
        try again if you miss it.
      </p>

      <div className="space-y-4">
        {questions.map((question, qi) => {
          const selected = answers[qi];

          return (
            <div
              key={qi}
              className="rounded-xl border p-4 bg-white"
              style={{ borderColor: "#D4C8A8" }}
            >
              <p className="font-semibold">
                {qi + 1}. {question.question}
              </p>

              <div className="mt-3 space-y-2">
                {(question.options || []).map((option, oi) => {
                  const isSelected = selected === oi;
                  const isCorrect = oi === question.correct_index;

                  let cls =
                    "w-full text-left px-3 py-2 rounded-lg border transition";

                  if (checked && isSelected && isCorrect) {
                    cls += " border-green-500 bg-green-50 text-green-800";
                  } else if (checked && isSelected && !isCorrect) {
                    cls += " border-red-500 bg-red-50 text-red-800";
                  } else if (isSelected) {
                    cls += " border-blue-500 bg-blue-50 text-blue-800";
                  } else {
                    cls += " border-stone-200 hover:border-blue-300";
                  }

                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={checked}
                      onClick={() =>
                        setAnswers((cur) => ({ ...cur, [qi]: oi }))
                      }
                      className={cls}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {checked && selected !== question.correct_index && (
                <p className="mt-2 text-sm text-stone-700">
                  Not quite. Hint: {question.explanation}
                </p>
              )}

              {checked && passed && selected === question.correct_index && (
                <p className="mt-2 text-sm text-stone-700">
                  {question.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!checked ? (
        <button
          type="button"
          onClick={check}
          disabled={!complete}
          className="mt-4 rounded-full px-5 py-2 text-sm font-bold disabled:opacity-50"
          style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }}
        >
          {complete ? "Check my answers" : "Answer every question to check"}
        </button>
      ) : passed ? (
        <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4 text-green-900">
          <p className="font-bold">
            Quest cleared! You scored {score} out of {total} ({percent}%).
          </p>
          <p className="text-sm mt-1">
            You can now complete your task and submit your work.
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-900">
          <p className="font-bold">
            You scored {score} out of {total} ({percent}%). You need {needed} to
            pass.
          </p>
          <p className="text-sm mt-1">
            Read the hints, look back at "Let's learn" and the example, then try
            again.
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-3 rounded-full px-5 py-2 text-sm font-bold"
            style={{ backgroundColor: "#C77B5B", color: "#F5EFE0" }}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
