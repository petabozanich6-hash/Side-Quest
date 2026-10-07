import React, { useState } from "react";
import { ChoiceSet } from "./QuestActivities";

const BTN = { backgroundColor: "#1F3B2D", color: "#F5EFE0" };

export default function TeachStep({ step, onComplete }) {
  const [shown, setShown] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <div className="space-y-4">
      <div className="whitespace-pre-wrap text-base leading-relaxed">
        {step.explain}
      </div>

      {!shown && (
        <button
          type="button"
          onClick={() => setShown(true)}
          className="rounded-full px-5 py-2 text-sm font-bold"
          style={BTN}
        >
          Show me an example
        </button>
      )}

      {shown && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <div className="text-xs font-mono uppercase text-indigo-700 mb-1">
            Example
          </div>

          <p className="text-base font-semibold whitespace-pre-wrap">
            {step.example}
          </p>

          {step.notice && (
            <p className="text-sm mt-3 whitespace-pre-wrap">
              <strong>Notice:</strong> {step.notice}
            </p>
          )}
        </div>
      )}

      {shown && !ready && (
        <button
          type="button"
          onClick={() => setReady(true)}
          className="rounded-full px-5 py-2 text-sm font-bold"
          style={BTN}
        >
          I get it, let me try
        </button>
      )}

      {ready && (
        <div>
          <div className="text-xs font-mono uppercase text-stone-500 mb-2">
            Your turn
          </div>

          <ChoiceSet questions={[step.check]} onComplete={onComplete} />
        </div>
      )}
    </div>
  );
}
