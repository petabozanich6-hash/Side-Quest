import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Clock, ChevronRight, MessageCircle, Sparkles } from "lucide-react";

export default function ChildHome() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/dashboard/child").then(r => setData(r.data)); }, []);
  if (!data) return <div className="text-slate-500">Loading…</div>;

  const greeting = user?.theme === "early" ? "Hi" : user?.theme === "senior" ? "Welcome back" : "Hey";
  const headingSize = user?.theme === "early" ? "text-4xl" : "text-3xl";

  return (
    <div className="space-y-6 animate-in" data-testid="child-home">
      <section>
        <h1 className={`font-display ${headingSize} font-bold`}>{greeting}, {user?.name}!</h1>
        <p className="text-sm opacity-75 mt-1">Here's what to learn today.</p>
      </section>

      {data.today.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/70 p-10 text-center" data-testid="no-work">
          <Sparkles className="mx-auto text-slate-400 mb-3" size={32} />
          <p className="font-display text-lg font-semibold">All caught up!</p>
          <p className="text-sm opacity-70 mt-1">No tasks waiting right now. Ask your parent to assign something, or check your portfolio.</p>
        </div>
      ) : (
        <section>
          <h2 className="font-display text-lg font-semibold mb-3">Today's quests</h2>
          <div className="space-y-3">
            {data.today.map(a => (
              <Link key={a.id} to={`/child/lesson/${a.id}`} className="block rounded-2xl bg-white border border-slate-200 p-5 hover:border-slate-400 transition group" data-testid={`task-${a.id}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono opacity-60">{a.lesson?.stage} · {a.lesson?.learning_area}</div>
                    <div className="font-display text-lg font-semibold mt-1 group-hover:text-teal-700">{a.lesson?.title}</div>
                    <div className="mt-2 flex items-center gap-3 text-xs opacity-75">
                      <span className="flex items-center gap-1"><Clock size={12}/> {a.lesson?.duration_minutes || 30} min</span>
                      <span className={`pill pill-${(a.status||"not-started").replace(/_/g,'-')}`}>{a.status?.replace(/_/g,' ')}</span>
                      {a.support_level === "red" && <span className="pill pill-needs-help">Wait for adult</span>}
                      {a.support_level === "yellow" && <span className="pill pill-submitted">Ask if stuck</span>}
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400 group-hover:text-slate-700" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.feedback.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2"><MessageCircle size={18}/> Recent feedback</h2>
          <div className="space-y-2">
            {data.feedback.slice(0,3).map(f => (
              <div key={f.id} className="rounded-xl bg-white border border-slate-200 p-4" data-testid={`fb-${f.id}`}>
                <div className="text-xs font-mono opacity-60">{f.lesson?.title}</div>
                <p className="text-sm mt-1">{f.parent_feedback}</p>
                {f.next_step && <p className="text-xs mt-2 opacity-75"><strong>Next:</strong> {f.next_step}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
