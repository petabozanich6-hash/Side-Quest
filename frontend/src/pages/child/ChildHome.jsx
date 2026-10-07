import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Clock, ChevronRight, MessageCircle, Sparkles, Heart, CalendarDays } from "lucide-react";

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function TaskCard({ a }) {
  return (
    <Link to={`/child/lesson/${a.id}`} className="block rounded-2xl bg-white border border-slate-200 p-5 hover:border-slate-400 transition group" data-testid={`task-${a.id}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono opacity-60">{a.lesson?.stage} \u00b7 {a.lesson?.learning_area}</div>
          <div className="font-display text-lg font-semibold mt-1 group-hover:text-teal-700">{a.lesson?.title}</div>
          <div className="mt-2 flex items-center gap-3 text-xs opacity-75">
            <span className="flex items-center gap-1"><Clock size={12}/> {a.lesson?.duration_minutes || 30} min</span>
            <span className={`pill pill-${(a.status || "not-started").replace(/_/g, '-')}`}>{a.status?.replace(/_/g, ' ')}</span>
            {a.support_level === "red" && <span className="pill pill-needs-help">Wait for adult</span>}
            {a.support_level === "yellow" && <span className="pill pill-submitted">Ask if stuck</span>}
          </div>
        </div>
        <ChevronRight className="text-slate-400 group-hover:text-slate-700" />
      </div>
    </Link>
  );
}

const Group = ({ title, items }) => items.length === 0 ? null : (
  <section>
    <h2 className="font-display text-lg font-semibold mb-3">{title}</h2>
    <div className="space-y-3">{items.map(a => <TaskCard key={a.id} a={a} />)}</div>
  </section>
);

export default function ChildHome() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    api.get("/dashboard/child").then(r => setData(r.data));
    api.get("/calendar", { params: user?.id ? { student_id: user.id } : {} })
      .then(r => setEvents((r.data || []).filter(e => e.linked_lesson_id && !(e.student_id && user?.id && e.student_id !== user.id))))
      .catch(() => {});
  }, [user?.id]);
  if (!data) return <div className="text-slate-500">Loading\u2026</div>;

  const greeting = user?.theme === "early" ? "Hi" : user?.theme === "senior" ? "Welcome back" : "Hey";
  const headingSize = user?.theme === "early" ? "text-4xl" : "text-3xl";
  const unseen = data.cheers || [];

  const today = iso(new Date());
  const lessonOf = (a) => a.lesson?.id || a.lesson_id;
  const todayIds = new Set(events.filter(e => e.date === today).map(e => e.linked_lesson_id));
  const overdueIds = new Set(events.filter(e => e.date < today).map(e => e.linked_lesson_id));
  const futureIds = new Set(events.filter(e => e.date > today).map(e => e.linked_lesson_id));

  const tasks = data.today || [];
  const scheduledToday = tasks.filter(a => todayIds.has(lessonOf(a)));
  const catchUp = tasks.filter(a => !todayIds.has(lessonOf(a)) && overdueIds.has(lessonOf(a)));
  const comingUp = tasks.filter(a => !todayIds.has(lessonOf(a)) && !overdueIds.has(lessonOf(a)) && futureIds.has(lessonOf(a)));
  const anytime = tasks.filter(a => ![todayIds, overdueIds, futureIds].some(s => s.has(lessonOf(a))));

  return (
    <div className="space-y-6 animate-in" data-testid="child-home">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`font-display ${headingSize} font-bold`}>{greeting}, {user?.name}!</h1>
          <p className="text-sm opacity-75 mt-1">Here's what to learn today.</p>
        </div>
        <Link to="/child/calendar" className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-300 px-4 py-2 text-sm font-semibold hover:border-slate-500" data-testid="my-week-link"><CalendarDays size={16}/> My week</Link>
      </section>

      {unseen.length > 0 && (
        <section className="paper-card p-5" style={{backgroundColor:"#FEF3C7", borderColor:"#D4A574"}} data-testid="cheers-banner">
          <div className="flex items-center gap-2 mb-2"><Heart size={18} style={{color:"#C77B5B"}}/><h2 className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>From your parent</h2></div>
          <div className="space-y-2">
            {unseen.slice(0,3).map(c => (
              <div key={c.id} className="rounded-xl bg-white p-3 flex items-start gap-3" data-testid={`cheer-${c.id}`}>
                <span className="text-2xl">{c.emoji}</span>
                <div className="flex-1 text-sm">{c.message}<div className="text-xs text-stone-500 mt-0.5">\u2014 {c.from_name}</div></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/70 p-10 text-center" data-testid="no-work">
          <Sparkles className="mx-auto text-slate-400 mb-3" size={32} />
          <p className="font-display text-lg font-semibold">All caught up!</p>
          <p className="text-sm opacity-70 mt-1">No tasks waiting right now. Ask your parent to assign something, or check your portfolio.</p>
        </div>
      ) : (
        <>
          {scheduledToday.length === 0 && (catchUp.length > 0 || anytime.length > 0 || comingUp.length > 0) && (
            <p className="text-sm opacity-70" data-testid="nothing-today">Nothing is planned for today. Here is what else is waiting.</p>
          )}
          <Group title="Today's quests" items={scheduledToday} />
          <Group title="Catch up" items={catchUp} />
          <Group title="Anytime" items={anytime} />
          <Group title="Coming up" items={comingUp} />
        </>
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
