import React, { useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  List,
  ListOrdered,
  Undo2,
  Redo2
} from "lucide-react";

export const htmlToText = (html = "") => {
  const div = document.createElement("div");

  div.innerHTML = html
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li)>/gi, "$&\n");

  return (div.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
};

const countWords = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);

const TOOLS = [
  { cmd: "bold", icon: Bold, label: "Bold" },
  { cmd: "italic", icon: Italic, label: "Italic" },
  { cmd: "underline", icon: Underline, label: "Underline" },
  { cmd: "formatBlock", arg: "h3", icon: Heading2, label: "Heading" },
  { cmd: "insertUnorderedList", icon: List, label: "Bullet list" },
  { cmd: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
  { cmd: "undo", icon: Undo2, label: "Undo" },
  { cmd: "redo", icon: Redo2, label: "Redo" }
];

export default function DocumentWriter({
  value,
  onChange,
  placeholder = "Start writing here...",
  minWords = 0
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;

    if (el && el.innerHTML !== (value || "")) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const emit = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const run = (cmd, arg) => {
    if (ref.current) ref.current.focus();
    document.execCommand(cmd, false, arg);
    emit();
  };

  const onPaste = (event) => {
    event.preventDefault();

    const text = event.clipboardData.getData("text/plain");

    document.execCommand("insertText", false, text);
    emit();
  };

  const text = htmlToText(value || "");
  const words = countWords(text);
  const empty = text.length === 0;

  return (
    <div
      className="rounded-xl border bg-white overflow-hidden"
      style={{ borderColor: "#D4C8A8" }}
      data-testid="document-writer"
    >
      <style>{`
        .doc-writer h3 { font-size: 1.25rem; font-weight: 700; margin: 0.6em 0 0.3em; }
        .doc-writer ul { list-style: disc; padding-left: 1.5rem; margin: 0.4em 0; }
        .doc-writer ol { list-style: decimal; padding-left: 1.5rem; margin: 0.4em 0; }
        .doc-writer[data-empty="true"]::before {
          content: attr(data-placeholder);
          color: #a8a29e;
          pointer-events: none;
          position: absolute;
        }
      `}</style>

      <div
        className="flex flex-wrap items-center gap-1 border-b p-2 bg-stone-50"
        style={{ borderColor: "#D4C8A8" }}
      >
        {TOOLS.map(({ cmd, arg, icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => run(cmd, arg)}
            className="rounded-md p-2 hover:bg-stone-200"
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onPaste={onPaste}
        data-empty={empty ? "true" : "false"}
        data-placeholder={placeholder}
        className="doc-writer relative min-h-[260px] px-4 py-3 text-base leading-relaxed outline-none"
        data-testid="document-writer-body"
      />

      <div
        className="border-t px-3 py-1.5 text-xs font-mono text-stone-500 flex justify-between"
        style={{ borderColor: "#D4C8A8" }}
      >
        <span>{words} words</span>
        {minWords > 0 && (
          <span>{words >= minWords ? "Length reached" : `Aim for ${minWords}+ words`}</span>
        )}
      </div>
    </div>
  );
}
