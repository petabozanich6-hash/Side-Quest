import React from "react";
import { CAST } from "./cast";

export default function SpeechBubble({ who, text, visible }) {
  if (!visible || !text) return null;
  const name = (CAST[who] || CAST.pip).name;
  return (
    <div className="ep-cap" role="status" aria-live="polite">
      <b>{name}:</b> {text}
    </div>
  );
}
