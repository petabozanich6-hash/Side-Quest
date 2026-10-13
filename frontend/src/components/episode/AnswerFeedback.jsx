import React from "react";

export default function AnswerFeedback({ correct, correctText, incorrectText, visible }) {
  if (!visible) return null;
  return (
    <div
      className={`ep-feedback ${correct ? "ep-feedback-ok" : "ep-feedback-bad"}`}
      role="status"
      aria-live="polite"
      data-testid="episode-feedback"
    >
      <strong>{correct ? "Nice reasoning." : "Not quite — try this idea."}</strong>
      <p>{correct ? correctText : incorrectText}</p>
    </div>
  );
}
