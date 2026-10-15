import React, { useState } from "react";
import { api } from "../../lib/api";
import { isNetworkError } from "../../lib/offline";

export default function QuestQuiz({ quiz = [], passMark = 0.9, assignmentId, onResult, shortAnswers = {}, onShortAnswers = () => {}, help = null, onOffline = null, queued = false }) {
  const questions = quiz.filter((q) => q.type !== "short_answer");
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [server, setServer] = useState(null); // answers are marked on the server; the browser never holds the correct answers
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const total = questions.length;
  if (total === 0) return null;

  const needed = Math.ceil(total * passMark - 1e-9);
  const score = server ? server.score : 0;
  const passed = !!server?.passed;
  const okAt = (i) => !!server?.results?.[i]?.is_correct;
  const shortQuestions = quiz.map((question, index) => ({ question, index })).filter(({ question }) => question.type === "short_answer");
  const complete = questions.every((_, i) => typeof answers[i] === "number") && shortQuestions.every(({ index }) => (shortAnswers[index] || "").trim().length > 0);
  const percent = Math.round((score / total) * 100);

  const check = async () => {
    setBusy(true);
    setError("");
    const payload = questions.map((q, i) => (q.options || [])[answers[i]] ?? null);
    try {
      const { data } = await api.post(`/assignments/${assignmentId}/quiz-check`, { answers: payload });
      setServer(data);
      setChecked(true);
      onResult?.({ score: data.score, total: data.total, needed: data.needed, passed: data.passed, attempt: data.attempt, percent: Math.round((data.score / data.total) * 100) });
    } catch (e) {
      // No signal: keep the answers on this device; they are marked as soon as the device is back online.
      if (onOffline && isNetworkError(e)) { await onOffline(payload); return; }
      setError(e.response?.data?.detail || "Could not check your answers. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const retry = () => {
    setAnswers({});
    setChecked(false);
    setServer(null);
    setAttempt((n) => n + 1);
    onResult?.(null);
  };

  return (
    <div data-testid="quest-quiz">
      {queued && (
        <p className="mb-4 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900" data-testid="quiz-queued">
          📶 Your answers are saved on this device. Your Quest check will be marked as soon as you're back online. You can hand in now.
        </p>
      )}
      <p className="text-sm text-stone-600 mb-4">
        Answer all {quiz.length} questions. You need {needed} out of {total} multiple-choice answers (
        {Math.round(passMark * 100)}%) to clear this part of the quest. You can
        try again if you miss it. {shortQuestions.length > 0 && "Your written answers will be sent with your work for a grown-up to review. They are not automatically scored."}
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
                  const isCorrect = okAt(qi);

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

              {help && !checked && <div className="mt-3">{help(quiz.indexOf(question))}</div>}

              {checked && !okAt(qi) && (
                <p className="mt-2 text-sm text-stone-700">
                  Not quite. Hint: {server?.results?.[qi]?.explanation}
                </p>
              )}

              {checked && passed && okAt(qi) && (
                <p className="mt-2 text-sm text-stone-700">
                  {server?.results?.[qi]?.explanation}
                </p>
              )}
            </div>
          );
        })}
        {shortQuestions.map(({ question, index }) => (
          <div key={`short-${index}`} className="rounded-xl border p-4 bg-white">
            <label htmlFor={`quiz-short-${index}`} className="font-semibold">{index + 1}. {question.question}</label>
            <textarea id={`quiz-short-${index}`} rows={3} value={shortAnswers[index] || ""} disabled={checked} onChange={(event) => onShortAnswers({ ...shortAnswers, [index]: event.target.value })} className="mt-3 w-full rounded-lg border p-3" />
            <p className="mt-2 text-sm text-stone-600">Use your own words. A grown-up will review this answer.</p>
          </div>
        ))}
      </div>

      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      {!checked ? (
        <button
          type="button"
          onClick={check}
          disabled={!complete || busy}
          className="mt-4 rounded-full px-5 py-2 text-sm font-bold disabled:opacity-50"
          style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }}
        >
          {busy ? "Checking…" : complete ? "Check my answers" : "Answer every question to check"}
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

