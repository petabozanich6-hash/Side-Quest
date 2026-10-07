import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Plus, X, ChevronLeft, ChevronRight, CalendarPlus } from "lucide-react";
import ScheduleModal, { isoLocal } from "../../components/parent/ScheduleModal";

const COLOURS = ["#0F766E", "#B45309", "#6D28D9", "#BE123C", "#1D4ED8", "#4D7C0F"];

function monthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(first); start.setDate(1 - first.getDay());
  const weeks = [];
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start); dt.setDate(start.getDate() + w*7 + d);
      row.push(dt);
    }
    weeks.push(row);
  }
  return weeks;
}

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [cur, setCur] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [schedOpen, setSchedOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({ title: "", date: isoLocal(new Date()), event_type: "lesson", student_id: "", linked_lesson_id: "", duration_minutes: 45, notes: "" });

  const load = () => api.get("/calendar").then(r => setEvents(r.data));
  useEffect(() => { load(); api.get("/students").then(r=>setStudents(r.data)); api.get("/lessons").then(r=>setLessons(r.data)); }, []);

  const colourOf = (sid) => {
    const i = students.findIndex(s => s.id === sid);
    return i < 0 ? "#475569" : COLOURS[i % COLOURS.length];
  };
  const nameOf = (sid) => students.find(s => s.id === sid)?.name;

  const month = cur.getMonth(), year = cur.getFullYear();
  const weeks = monthMatrix(year, month);
  const shown = events.filter(e => !filter || e.student_id === filter || !e.student_id);
  const eventsByDate = shown.reduce((m, e) => { (m[e.date] = m[e.date] || []).push(e); return m; }, {});
  const todayIso = isoLocal(new Date());

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/calendar", { ...form, duration_minutes: Number(form.duration_minutes), student_id: form.student_id || null, linked_lesson_id: form.linked_lesson_id || null });
      toast.success("Scheduled"); setOpen(false); load();
    } catch { toast.error("Failed"); }
  };

  const monthName = cur.toLocaleString("en-AU", { month: "long", year: "numeric" });

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="calendar-page">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Family Calendar</h1>
          <p className="text-sm text-slate-600 mt-1">Each child has their own days. Scheduled lessons show on their side.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="cal-filter">
            <option value="">All children</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button onClick={()=>setSchedOpen(true)} className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white flex items-center gap-1.5" data-testid="schedule-lesson-btn"><CalendarPlus size={14}/> Schedule lesson</button>
          <button onClick={()=>setOpen(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white flex items-center gap-1.5" data-testid="add-event-btn"><Plus size={14}/> Add event</button>
        </div>
      </div>

      {students.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs">
          {students.map(s => <span key={s.id} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{backgroundColor: colourOf(s.id)}}/>{s.name}</span>)}
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-500"/>Whole family</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="font-display text-lg font-semibold" data-testid="calendar-month">{monthName}</h2>
          <div className="flex items-center gap-2">
            <button onClick={()=>setCur(new Date(year, month-1, 1))} className="rounded-lg border border-slate-300 p-1.5" data-testid="prev-month"><ChevronLeft size={14}/></button>
            <button onClick={()=>setCur(new Date())} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold">Today</button>
            <button onClick={()=>setCur(new Date(year, month+1, 1))} className="rounded-lg border border-slate-300 p-1.5" data-testid="next-month"><ChevronRight size={14}/></button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="p-2 text-center">{d}</div>)}
        </div>
        <div>
          {weeks.map((row, i) => (
            <div key={i} className="grid grid-cols-7 border-b border-slate-100 last:border-0">
              {row.map((dt, j) => {
                const inMonth = dt.getMonth() === month;
                const iso = isoLocal(dt);
                const dayEvents = eventsByDate[iso] || [];
                const isToday = iso === todayIso;
                return (
                  <div key={j} className={`min-h-[88px] p-2 border-r border-slate-100 last:border-0 ${inMonth ? "bg-white" : "bg-slate-50/40 text-slate-400"}`} data-testid={`cal-day-${iso}`}>
                    <div className={`text-xs ${isToday ? "font-bold text-teal-700" : ""}`}>{dt.getDate()}</div>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0,3).map(e => (
                        <div key={e.id} title={`${nameOf(e.student_id) || "Whole family"}: ${e.title}`} className="truncate text-[10px] rounded px-1.5 py-0.5 text-white" style={{backgroundColor: colourOf(e.student_id)}}>{e.title}</div>
                      ))}
                      {dayEvents.length > 3 && <div className="text-[10px] text-slate-500">+{dayEvents.length - 3} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {schedOpen && <ScheduleModal lessons={lessons} students={students} onClose={()=>setSchedOpen(false)} onDone={load} />}

      {open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setOpen(false)}>
          <form onClick={e=>e.stopPropagation()} onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-6" data-testid="event-form">
            <div className="flex items-center justify-between mb-4"><h2 className="font-display text-xl font-bold">New event</h2><button type="button" onClick={()=>setOpen(false)}><X size={18}/></button></div>
            <div className="space-y-3">
              <L label="Title"><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="input" data-testid="e-title"/></L>
              <L label="Date"><input required type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="input" data-testid="e-date"/></L>
              <L label="Type">
                <select value={form.event_type} onChange={e=>setForm({...form, event_type: e.target.value})} className="input" data-testid="e-type">
                  <option value="lesson">Lesson</option><option value="assignment">Assignment</option>
                  <option value="assessment">Assessment</option><option value="project">Project milestone</option>
                  <option value="excursion">Excursion</option><option value="co-op">Co-op</option>
                  <option value="tutor">Tutor</option><option value="holiday">Holiday / rest day</option>
                  <option value="parent-review">Parent review</option>
                </select>
              </L>
              <L label="Student (optional)">
                <select value={form.student_id} onChange={e=>setForm({...form, student_id: e.target.value})} className="input" data-testid="e-student">
                  <option value="">Family-wide</option>
                  {students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </L>
              <L label="Linked lesson (optional)">
                <select value={form.linked_lesson_id} onChange={e=>setForm({...form, linked_lesson_id: e.target.value})} className="input" data-testid="e-lesson">
                  <option value="">None</option>
                  {lessons.map(l=><option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              </L>
              <L label="Notes"><textarea rows={2} value={form.notes} onChange={e=>setForm({...form, notes: e.target.value})} className="input" data-testid="e-notes"/></L>
            </div>
            <button className="mt-5 w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white" data-testid="submit-event">Schedule</button>
          </form>
        </div>
      )}
      <style>{`.input { width:100%; border-radius:0.5rem; border:1px solid #cbd5e1; padding:0.5rem 0.75rem; font-size:0.875rem; }`}</style>
    </div>
  );
}
const L = ({ label, children }) => (<div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label><div className="mt-1">{children}</div></div>);
