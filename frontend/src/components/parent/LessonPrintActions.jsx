import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ClipboardCheck, Printer } from "lucide-react";

// Both editions come from the parent's authenticated print route.
// Do not expose the parent edition through any child-facing link.
export default function LessonPrintActions({ lessonId, compact = false, studentTestId, parentTestId, className = "" }) {
  if (!lessonId) return null;
  const base = compact
    ? "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
    : "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800";
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} data-testid="parent-print-options" aria-label="Print lesson options">
      <Link
        to={`/print/lesson/${lessonId}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} bg-[#1F3B2D] text-white hover:bg-[#345a42]`}
        data-testid={studentTestId || `print-student-${lessonId}`}
        aria-label="Print student workbook (opens in a new tab)"
      >
        <Printer size={compact ? 14 : 16} aria-hidden="true" />
        Print student workbook
      </Link>
      <Link
        to={`/print/lesson/${lessonId}?answers=1`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} border-2 border-[#C77B5B] bg-white text-[#51382D] hover:bg-[#FBF2E9]`}
        data-testid={parentTestId || `print-parent-${lessonId}`}
        aria-label="Print parent guide and answers (opens in a new tab)"
      >
        {compact ? <BookOpen size={14} aria-hidden="true" /> : <ClipboardCheck size={16} aria-hidden="true" />}
        Print parent guide
      </Link>
    </div>
  );
}
