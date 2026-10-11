import React from "react";

// Only **bold** is supported. React escapes every text fragment; no HTML is parsed.
export default function LessonText({ text = "" }) {
  return String(text).split(/(\*\*[^*\n]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : <React.Fragment key={index}>{part}</React.Fragment>
  );
}
