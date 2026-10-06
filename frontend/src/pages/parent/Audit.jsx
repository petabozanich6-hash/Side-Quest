import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { ShieldAlert, AlertTriangle, Info } from "lucide-react";

const sevIcon = (s) => s === "high" ? AlertTriangle : s === "medium" ? ShieldAlert : Info;
const sevCls = (s) => s === "high" ? "bg-rose-50 text-rose-900 border-rose-200" : s === "medium" ? "bg-amber-50 text-amber-900 border-amber-200" : "bg-slate-50 text-slate-700 border-slate-200";

export default function AuditPage() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/audit").then(r => setData(r.data)); }, []);
  if (!data) return <div className="p-10 text-slate-500">Loading…</div>;

  const grouped = data.issues.reduce((m, i) => { (m[i.type] = m[i.type] || []).push(i); return m; }, {});

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="audit-page">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900">Curriculum Audit</h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">{data.notice}</p>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5"><div className="text-xs font-semibold uppercase tracking-wider text-rose-700">High severity</div><div className="font-display text-4xl font-bold text-rose-900 mt-1">{data.issues.filter(i=>i.severity==="high").length}</div></div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="text-xs font-semibold uppercase tracking-wider text-amber-700">Medium</div><div className="font-display text-4xl font-bold text-amber-900 mt-1">{data.issues.filter(i=>i.severity==="medium").length}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Low</div><div className="font-display text-4xl font-bold text-slate-900 mt-1">{data.issues.filter(i=>i.severity==="low").length}</div></div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold mb-3">Issues</h2>
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="mb-4" data-testid={`audit-${type}`}>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{type.replace(/_/g, " ")} ({items.length})</div>
            <div className="space-y-2">
              {items.slice(0, 10).map((i, idx) => {
                const Icon = sevIcon(i.severity);
                return (
                  <div key={idx} className={`rounded-lg border p-3 flex items-start gap-2 ${sevCls(i.severity)}`}>
                    <Icon size={14} className="mt-0.5"/>
                    <div className="text-sm"><strong>{i.title}:</strong> {i.message}</div>
                  </div>
                );
              })}
              {items.length > 10 && <div className="text-xs text-slate-500">+{items.length - 10} more</div>}
            </div>
          </div>
        ))}
        {data.issues.length === 0 && <div className="rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">No issues detected yet.</div>}
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold mb-3">Coverage</h2>
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr><th className="p-3">Stage</th><th className="p-3">Learning area</th><th className="p-3">Assignments</th><th className="p-3">Demonstrated</th></tr>
            </thead>
            <tbody>
              {data.coverage.map((c,i) => (
                <tr key={i} className="border-t border-slate-100"><td className="p-3 font-mono text-xs">{c.stage}</td><td className="p-3">{c.learning_area}</td><td className="p-3">{c.count}</td><td className="p-3 text-emerald-700 font-semibold">{c.demonstrated}</td></tr>
              ))}
              {data.coverage.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-slate-500 text-sm">No assignments yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
