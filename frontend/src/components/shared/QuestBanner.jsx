import React from "react";

const totalMinutes = (lesson) =>
  (lesson.steps || []).reduce(
    (sum, step) => sum + (step.duration_minutes || 0),
    0
  ) || lesson.duration_minutes || null;

export default function QuestBanner({ lesson }) {
  const minutes = totalMinutes(lesson);
  const stepCount = lesson.steps?.length || 0;

  return (
    <div
      className="relative overflow-hidden rounded-2xl mb-4"
      style={{ backgroundColor: "#1F3B2D" }}
      data-testid="quest-banner"
    >
      <svg
        viewBox="0 0 800 160"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <g fill="none" stroke="#6B8A5B" strokeWidth="1.2" opacity="0.55">
          <path d="M-20 120 C 120 60, 220 150, 360 90 S 600 40, 830 100" />
          <path d="M-20 135 C 130 80, 230 160, 370 108 S 610 60, 830 118" />
          <path d="M-20 150 C 140 100, 240 170, 380 126 S 620 80, 830 136" />
          <path d="M-20 90 C 100 30, 240 120, 340 60 S 580 10, 830 70" />
        </g>
        <path
          d="M70 128 C 190 96, 250 130, 380 98 S 560 70, 700 52"
          fill="none"
          stroke="#E8D9A8"
          strokeWidth="2.5"
          strokeDasharray="2 9"
          strokeLinecap="round"
        />
        <circle cx="70" cy="128" r="7" fill="#E8D9A8" />
        <g transform="translate(700 52)" stroke="#C77B5B" strokeWidth="4" strokeLinecap="round">
          <line x1="-9" y1="-9" x2="9" y2="9" />
          <line x1="9" y1="-9" x2="-9" y2="9" />
        </g>
        <g transform="translate(735 40)" fill="none" stroke="#E8D9A8" strokeWidth="1.5">
          <circle r="22" />
          <circle r="3" fill="#E8D9A8" />
          <path d="M0 -20 L5 0 L0 20 L-5 0 Z" fill="#C77B5B" stroke="none" />
          <path d="M-20 0 L0 -5 L20 0 L0 5 Z" opacity="0.5" />
        </g>
      </svg>

      <div className="relative px-6 py-6 sm:py-8">
        <div
          className="text-[11px] font-mono uppercase tracking-[0.25em]"
          style={{ color: "#E8D9A8" }}
        >
          Side quest · {lesson.learning_area}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
          {stepCount > 0 && (
            <span
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: "rgba(245,239,224,0.15)", color: "#F5EFE0" }}
            >
              {stepCount} stages
            </span>
          )}

          {minutes && (
            <span
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: "rgba(245,239,224,0.15)", color: "#F5EFE0" }}
            >
              About {minutes} min
            </span>
          )}

          {lesson.year_level && (
            <span
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: "rgba(245,239,224,0.15)", color: "#F5EFE0" }}
            >
              {lesson.year_level}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
