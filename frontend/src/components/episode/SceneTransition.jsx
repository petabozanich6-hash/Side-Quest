import React from "react";

export default function SceneTransition({ label, active }) {
  if (!active) return null;
  return (
    <div className="ep-transition" role="status" aria-live="polite">
      <span>{label}</span>
    </div>
  );
}
