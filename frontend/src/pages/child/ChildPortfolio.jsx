import React, { useEffect, useState } from "react";
import { api, fileUrl } from "../../lib/api";
import { FileText, Image as ImgIcon, Mic, Film } from "lucide-react";

const iconFor = (ct) => {
  if (!ct) return FileText;
  if (ct.startsWith("image/")) return ImgIcon;
  if (ct.startsWith("audio/")) return Mic;
  if (ct.startsWith("video/")) return Film;
  return FileText;
};

export default function ChildPortfolio() {
  const [subs, setSubs] = useState([]);
  useEffect(() => { api.get("/submissions").then(r => setSubs(r.data)); }, []);

  return (
    <div className="space-y-5 animate-in" data-testid="child-portfolio">
      <header><h1 className="font-display text-3xl font-bold">My Portfolio</h1><p className="text-sm opacity-75 mt-1">Everything you've submitted.</p></header>

      <div className="space-y-3">
        {subs.map(s => (
          <div key={s.id} className="rounded-2xl bg-white border border-slate-200 p-5" data-testid={`port-${s.id}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-mono opacity-60">{s.lesson?.stage} · {s.lesson?.learning_area}</div>
                <div className="font-display text-lg font-semibold">{s.lesson?.title}</div>
                <div className="text-xs opacity-70 mt-1">{new Date(s.submitted_at).toLocaleString()}</div>
              </div>
              <span className={`pill pill-${(s.status||"submitted").replace(/_/g,'-')}`}>{s.status?.replace(/_/g,' ')}</span>
            </div>
            {s.response_text && <p className="mt-3 text-sm whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-lg p-3">{s.response_text}</p>}
            {s.parent_feedback && (
              <div className="mt-3 rounded-lg bg-teal-50 border border-teal-200 p-3 text-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">Feedback</div>
                {s.parent_feedback}
                {s.next_step && <div className="mt-2 text-xs"><strong>Next step:</strong> {s.next_step}</div>}
              </div>
            )}
          </div>
        ))}
        {subs.length === 0 && <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm opacity-70">Nothing submitted yet.</div>}
      </div>
    </div>
  );
}
