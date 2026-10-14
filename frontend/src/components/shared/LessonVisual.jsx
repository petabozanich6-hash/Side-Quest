import React from "react";

// Draws the small, data-driven pictures a lesson can carry: number lines, place-value blocks and tables.
// The lesson only supplies numbers and labels; nothing here runs content from the lesson.
const INK = "#1F3B2D", ACC = "#C77B5B", GREEN = "#4A5D3A";

function NumberLine({ v }) {
  const W = 640, pad = 28, y = 64;
  const span = v.max - v.min;
  const x = (n) => pad + ((n - v.min) / span) * (W - pad * 2);
  const ticks = [];
  for (let n = v.min; n <= v.max + 1e-9; n += v.step) ticks.push(Math.round(n * 1e6) / 1e6);
  const labelEvery = ticks.length > 24 ? 2 : 1;
  return (
    <svg viewBox={`0 0 ${W} 130`} className="w-full" role="img" aria-label={v.caption || "Number line"}>
      <line x1={pad - 8} y1={y} x2={W - pad + 8} y2={y} stroke={INK} strokeWidth="3" />
      {ticks.map((n, i) => (
        <g key={n}>
          <line x1={x(n)} y1={y - 8} x2={x(n)} y2={y + 8} stroke={INK} strokeWidth={n === 0 ? 3 : 1.5} />
          {i % labelEvery === 0 && <text x={x(n)} y={y + 28} textAnchor="middle" fontSize="14" fill={INK} fontWeight={n === 0 ? 700 : 400}>{n < 0 ? `−${Math.abs(n)}` : n}</text>}
        </g>
      ))}
      {v.jumps.map((j, i) => {
        const a = x(j.from), b = x(j.to), mid = (a + b) / 2, h = 34 + (i % 2) * 12;
        return (
          <g key={`j${i}`}>
            <path d={`M ${a} ${y - 6} Q ${mid} ${y - 6 - h * 1.6} ${b} ${y - 6}`} fill="none" stroke={GREEN} strokeWidth="2.5" markerEnd="url(#arr)" />
            {j.label && <text x={mid} y={y - h - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill={GREEN}>{j.label}</text>}
          </g>
        );
      })}
      <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={GREEN} /></marker></defs>
      {v.points.map((p, i) => (
        <g key={`p${i}`}>
          <circle cx={x(p.at)} cy={y} r="7" fill={ACC} stroke="#fff" strokeWidth="2" />
          {p.label && <text x={x(p.at)} y={y + 52 + (i % 2) * 14} textAnchor="middle" fontSize="13" fontWeight="700" fill={ACC}>{p.label}</text>}
        </g>
      ))}
    </svg>
  );
}

function PlaceValue({ v }) {
  const digits = String(v.number).padStart(1, "0").split("").map(Number);
  const names = ["thousands", "hundreds", "tens", "ones"].slice(4 - digits.length);
  return (
    <div className="flex flex-wrap gap-4 items-end">
      {digits.map((d, i) => (
        <div key={i} className="text-center">
          <div className="flex flex-wrap gap-1 justify-center items-end min-h-[56px] max-w-[150px]">
            {Array.from({ length: d }).map((_, k) => {
              const nm = names[i];
              if (nm === "tens") return <div key={k} className="w-3 h-14 rounded-sm" style={{ background: GREEN }} aria-hidden />;
              if (nm === "ones") return <div key={k} className="w-3 h-3 rounded-sm" style={{ background: ACC }} aria-hidden />;
              return <div key={k} className="w-8 h-8 rounded-sm" style={{ background: nm === "hundreds" ? "#6B8A5B" : "#1F3B2D" }} aria-hidden />;
            })}
          </div>
          <div className="text-xs font-bold mt-1" style={{ color: INK }}>{d} {names[i]}</div>
        </div>
      ))}
    </div>
  );
}

function Table({ v }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead><tr>{v.headers.map((h, i) => <th key={i} className="border px-2 py-1 text-left bg-[#EFE6CF]" style={{ borderColor: "#D4C8A8" }}>{h}</th>)}</tr></thead>
        <tbody>{v.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="border px-2 py-1" style={{ borderColor: "#D4C8A8" }}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default function LessonVisual({ visual }) {
  if (!visual?.type) return null;
  return (
    <figure className="rounded-xl border bg-white p-3" style={{ borderColor: "#D4C8A8" }} data-testid={`visual-${visual.type}`}>
      {visual.type === "number_line" && <NumberLine v={visual} />}
      {visual.type === "place_value" && <PlaceValue v={visual} />}
      {visual.type === "table" && <Table v={visual} />}
      {visual.caption && <figcaption className="text-sm text-stone-600 mt-2">{visual.caption}</figcaption>}
    </figure>
  );
}
