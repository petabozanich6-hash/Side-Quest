import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Map as MapIcon, ChevronRight } from "lucide-react";
import { api } from "../../lib/api";
import { STATUS, STATUS_ORDER, StatusBar } from "../../lib/outcomes";

/** Curriculum progress for each child on the Parent Hub (or one child, with `studentId`). Links straight to the tracker. */
export default function OutcomeSummaryCard({ studentId }) {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/outcomes/summary").then((r) => setData(r.data)).catch(() => setData(null)); }, []);
  if (!data) return null;
  const kids = studentId ? (data.students || []).filter((s) => s.id === studentId) : data.students || [];
  if (!kids.length && data.available) return null;

  return (
    <section className="paper-card p-5 sm:p-6 relative z-10" data-testid="dashboard-outcomes">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 className="font-display text-xl font-bold flex items-center gap-2" style={{ color: "#1F3B2D" }}><MapIcon size={19} aria-hidden="true" /> Curriculum progress</h2>
        <Link to={studentId ? `/parent/outcomes/${studentId}` : "/parent/outcomes"} className="text-sm font-bold underline" style={{ color: "#4A5D3A" }}>Open outcome tracker</Link>
      </div>
      {!data.available ? (
        <p className="text-sm text-stone-600" data-testid="dashboard-outcomes-unavailable">{data.note}</p>
      ) : (
        <ul className="space-y-3">
          {kids.map((k) => (
            <li key={k.id}>
              <Link to={`/parent/outcomes/${k.id}`} className="block rounded-xl border border-stone-200 bg-white/70 p-3 hover:border-stone-400 transition" data-testid={`dashboard-outcomes-${k.id}`}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold" style={{ color: "#1F3B2D" }}>{k.name}{k.year_level ? <span className="font-normal text-stone-500"> · {k.year_level}</span> : null}</span>
                  <ChevronRight size={16} className="text-stone-400" aria-hidden="true" />
                </div>
                <div className="mt-2"><StatusBar counts={k.counts} total={k.total} /></div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-600">
                  {STATUS_ORDER.slice(1).reverse().map((s) => <span key={s}><span className="inline-block h-2 w-2 rounded-full mr-1 align-middle" style={{ backgroundColor: STATUS[s].bar }} />{k.counts[s]} {STATUS[s].short.toLowerCase()}</span>)}
                  <span>of {k.total} outcomes</span>
                </div>
                {(k.awaiting_confirmation > 0 || k.needs_attention > 0) && (
                  <div className="mt-2 text-xs font-semibold text-emerald-800">
                    {k.awaiting_confirmation > 0 && <span>{k.awaiting_confirmation} ready for your confirmation. </span>}
                    {k.needs_attention > 0 && <span className="text-amber-800">{k.needs_attention} confirmed with changed evidence.</span>}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
