import React, { useState } from "react";

export default function InteractivePause({
  prompt,
  choices = [],
  correctIndex,
  onResolved,
  disabled = false,
}) {
  const [picked, setPicked] = useState(null);

  const choose = (i) => {
    if (disabled || picked !== null) return;
    setPicked(i);
    const correct = i === correctIndex;
    onResolved?.({ index: i, correct });
  };

  return (
    <div className="ep-interact" data-testid="episode-interact" role="group" aria-label={prompt}>
      <p className="ep-interact-prompt">{prompt}</p>
      <div className="ep-choices">
        {choices.map((choice, i) => {
          let cls = "ep-choice";
          if (picked !== null) {
            if (i === correctIndex) cls += " ep-choice-ok";
            else if (i === picked) cls += " ep-choice-bad";
          }
          return (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => choose(i)}
              disabled={disabled || picked !== null}
              aria-pressed={picked === i}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
