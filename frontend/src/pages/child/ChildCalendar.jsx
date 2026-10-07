import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from "lucide-react";

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const mondayOf = (d) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };

export default function ChildCalendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [week, setWeek] = useState(mondayOf(new Date()));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [d, c] = await Promise.all([
          api.get("/dashboard/child"),
          api.get("/calendar", { params: user?.id ? { student_id: user.id } : {} }),
        ]);
        setTasks(d.data.today || []);
        setEvents((c.data || []).filter(e => !(e.student_id && user?.id && e.student_id !== user.id) && e.event_type !== "parent-review"));
      } catch {}
      setLoaded(true);
    })();
  }, [user?.id]);

  const lessonOf = (a) => a.lesson?.id || a.lesson_id;
  const taskFor = (e) => e.linked_lesson_id ? tasks.find(a => lessonOf(a) === e.linked_lesson_id) : null;

  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(week); d.setDate(week.getDate() + i); return d; });
  const todayIso = iso(new Date());
  const label = `${days[0].toLocaleDateString("en-AU", { day: "numeric", month: "short" })} \u2013 ${days[6].toLocaleDateString("en-AU", { day: "numeric", month: "short" })}`;
  const shift = (n) => { const d = new Date(week); d.setDate(d.getDate() + n * 7); setWeek(d); };

  if (!loaded) return <div className="text-slate-500">Loading\u2026</div>;

  return (
    <div className="space-y-5" data-testid="child-calendar">
      <Link to="/child" className="inline-flex items-center gap-1 text-sm font-semibold opacity-75 hover:opacity-100" data-testid="back-today"><ChevronLeft size={14}/> Back to today</Link>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => shift(-1)} className="rounded-lg border border-slate-300 bg-white p-1.5"><ChevronLeft size={16}/></button>
          <button onClick={() => setWeek(mondayOf(new Date()))} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold">This week</button>
          <button onClick={() => shift(1)} className="rounded-lg border border-slate-300 bg-white p-1.5"><ChevronRight size={16}/></button>
        </div>
      </div>
      <p className="text-sm opacity-75">{label}. You can start any lesson early, even if it is planned for another day.</p>

      <div className="space-y-3">
        {days.map(d => {
          const key = iso(d);
          const list = events.filter(e => e.date === key);
          const isToday = key === todayIso;
          const future = key > todayIso;
          return (
            <section key={key} className={`rounded-2xl border bg-white p-4 ${isToday ? "border-teal-500" : "border-slate-200"}`} data-testid={`day-${key}`}>
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="font-display text-base font-semibold">{d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short" })}</h2>
                {isToday && <span className="text-xs font-bold text-teal-700">Today</span>}
              </div>
              {list.length === 0 ? <p className="text-sm opacity-50">Nothing planned</p> : (
                <div className="space-y-2">
                  {list.map(e => {
                    const t = taskFor(e);
                    const body = (
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium text-sm">{e.title}</div>
                          <div className="text-xs opacity-60 flex items-center gap-1 mt-0.5"><Clock size={11}/> {e.duration_minutes || 30} min</div>
                        </div>
                        {e.linked_lesson_id && (t ? <span className="text-xs font-bold text-teal-700">{future ? "Start early" : "Start"}</span> : <span className="text-xs font-bold text-emerald-700 flex items-center gap-1"><CheckCircle2 size={14}/> Done</span>)}
                      </div>
                    );
                    return t
                      ? <Link key={e.id} to={`/child/lesson/${t.id}`} className="block rounded-xl border border-slate-200 p-3 hover:border-slate-400" data-testid={`ev-${e.id}`}>{body}</Link>
                      : <div key={e.id} className="rounded-xl border border-slate-200 p-3" data-testid={`ev-${e.id}`}>{body}</div>;
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
