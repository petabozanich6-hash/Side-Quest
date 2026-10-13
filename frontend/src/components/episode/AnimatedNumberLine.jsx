import React, { useEffect, useState } from "react";

/**
 * Instructional number-line diagram for rounding.
 * Props: { low, high, value, midpoint?, showDistances?, highlight?, label?, reducedMotion }
 */
export default function AnimatedNumberLine({
  low,
  high,
  value,
  midpoint,
  showDistances = false,
  highlight = "value",
  label = "",
  reducedMotion = false,
  srDescription = "",
}) {
  const [phase, setPhase] = useState(reducedMotion ? 3 : 0);
  const span = high - low || 1;
  const xOf = (n) => 60 + ((n - low) / span) * 680;
  const mid = typeof midpoint === "number" ? midpoint : (low + high) / 2;
  const leftDist = value - low;
  const rightDist = high - value;

  useEffect(() => {
    if (reducedMotion) {
      setPhase(3);
      return undefined;
    }
    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 700);
    const t3 = setTimeout(() => setPhase(3), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [low, high, value, reducedMotion]);

  const desc =
    srDescription ||
    `Number line from ${low} to ${high}. The number ${value} is ${leftDist} from ${low} and ${rightDist} from ${high}. Midpoint ${mid}.`;

  return (
    <div className="ep-diagram" data-testid="animated-number-line">
      <svg viewBox="0 0 800 170" role="img" aria-label={desc}>
        <rect width="800" height="170" fill="#fffef8" rx="12" />
        {label ? (
          <text x="400" y="28" textAnchor="middle" fontSize="15" fill="#1f3b2d" fontWeight="700">
            {label}
          </text>
        ) : null}
        <line
          x1="60"
          y1="90"
          x2="740"
          y2="90"
          stroke="#1f3b2d"
          strokeWidth="3"
          className={phase >= 1 ? "ep-draw" : "ep-hide"}
        />
        {[
          { n: low, key: "low" },
          { n: mid, key: "mid" },
          { n: high, key: "high" },
        ].map(({ n, key }) => (
          <g key={key} className={phase >= 1 ? "ep-fade" : "ep-hide"}>
            <line x1={xOf(n)} y1="82" x2={xOf(n)} y2="98" stroke="#1f3b2d" strokeWidth="2" />
            <text x={xOf(n)} y="122" textAnchor="middle" fontSize="15" fill="#1f3b2d">
              {n}
            </text>
          </g>
        ))}
        <circle
          cx={xOf(value)}
          cy="90"
          r="8"
          fill="#a33321"
          className={phase >= 2 ? "ep-pop" : "ep-hide"}
        />
        <text
          x={xOf(value)}
          y="58"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#a33321"
          className={phase >= 2 ? "ep-fade" : "ep-hide"}
        >
          {value}
        </text>
        {showDistances && phase >= 3 ? (
          <g>
            <text x={(xOf(low) + xOf(value)) / 2} y="150" textAnchor="middle" fontSize="14" fill="#166534">
              distance {leftDist}
            </text>
            <text x={(xOf(value) + xOf(high)) / 2} y="150" textAnchor="middle" fontSize="14" fill="#9a3412">
              distance {rightDist}
            </text>
            {highlight === "low" && (
              <circle cx={xOf(low)} cy="90" r="14" fill="none" stroke="#166534" strokeWidth="3" />
            )}
            {highlight === "high" && (
              <circle cx={xOf(high)} cy="90" r="14" fill="none" stroke="#9a3412" strokeWidth="3" />
            )}
            {highlight === "mid" && (
              <circle cx={xOf(mid)} cy="90" r="14" fill="none" stroke="#5b21b6" strokeWidth="3" />
            )}
          </g>
        ) : null}
      </svg>
    </div>
  );
}
