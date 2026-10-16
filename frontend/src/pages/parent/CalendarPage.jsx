import React, { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Plus, X, ChevronLeft, ChevronRight, CalendarPlus } from "lucide-react";
import ScheduleModal, { isoLocal } from "../../components/parent/ScheduleModal";
import TimetableGenerator from "../../components/parent/TimetableGenerator";
import AutoQuestPreview from "../../components/parent/AutoQuestPreview";
import CalendarEventEditor from "../../components/parent/CalendarEventEditor";

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
  const [searchParams] = useSearchParams();
  const focused = searchParams.get("event");
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [cur, setCur] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [schedOpen, setSchedOpen] = useState(false);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [autoQuestOpen, setAutoQuestOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(null);
  const [editing, setEditing] = useState(null);
  const [removingDay, setRemovingDay] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [reschedulePreview, setReschedulePreview] = useState(null);
  const [rescheduleChild, setRescheduleChild] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({ title: "", date: isoLocal(new Date()), event_type: "lesson", student_id: "", linked_lesson_id: "", duration_minutes: 45, notes: "" });

  const load = () => api.get("/calendar").then(r => setEvents(r.data));
  useEffect(() => { load(); api.get("/students").then(r=>setStudents(r.data)); api.get("/lessons").then(r=>setLessons((r.data || []).filter(l => l.status === "ready"))); }, []);
  useEffect(() => {
    const event = events.find(e => e.id === focused);
    if (!event || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) return;
    const [y,m,d] = event.date.split("-").map(Number);
    setCur(new Date(y,m-1,d));setFilter("");setDayOpen(event.date);
  },[focused,events]);

  const colourOf = (sid) => {
    const i = students.findIndex(s => s.id === sid);
    return i < 0 ? "#475569" : (students[i].prefs?.calendar_colour || COLOURS[i % COLOURS.length]);
  };
  const nameOf = (sid) => students.find(s => s.id === sid)?.name;
  // Timetable slots show their subject plus the lesson in them, or "(free)" while empty.
  const isSlot = (e) => e.event_type === "timetable" || (e.event_type === "lesson" && /^Suggested by Side-Quest/.test(e.notes || ""));
  const freeSlot = (e) => isSlot(e) && !e.linked_assignment_id && !e.linked_lesson_id;
  const labelOf = (e) => (e.student_id && nameOf(e.student_id) ? `${nameOf(e.student_id).split(" ")[0]}: ` : "")
    + (e.start_time && isSlot(e) ? `${e.start_time} ` : "") + e.title + (e.lesson_title ? ` · ${e.lesson_title}` : freeSlot(e) ? " (free)" : "");

  const month = cur.getMonth(), year = cur.getFullYear();
  const weeks = monthMatrix(year, month);
  const shown = events.filter(e => !filter || e.student_id === filter || !e.student_id);
  const eventsByDate = shown.reduce((m, e) => { (m[e.date] = m[e.date] || []).push(e); return m; }, {});
  const todayIso = isoLocal(new Date());

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    const targets = form.student_id ? [form.student_id] : (students.length ? students.map(s => s.id) : [null]);
    setSaving(true);
    try {
      for (const sid of targets) {
        let assignmentId = null;
        if (sid && form.linked_lesson_id) {
          try {
            const a = await api.post("/assignments", { student_id: sid, lesson_id: form.linked_lesson_id, support_level: "green" });
            assignmentId = a.data?.id || null;
          } catch (e) {
            if (e.response?.data?.code !== "ALREADY_ASSIGNED") throw e;
          }
        }
        await api.post("/calendar", {
          ...form,
          duration_minutes: Number(form.duration_minutes),
          student_id: sid,
          linked_lesson_id: form.linked_lesson_id || null,
          linked_assignment_id: assignmentId,
        });
      }
      toast.success(targets.length > 1 ? `Scheduled for ${targets.length} children` : "Scheduled");
      setOpen(false); load();
    } catch (err) { toast.error(apiErrorMessage(err, "Some entries may already have been added")); load(); }
    finally { setSaving(false); }
  };

  const previewReschedule = async () => {
    if (!rescheduleChild || !dayOpen) return toast.error("Choose the child whose day needs rescheduling.");
    setRescheduling(true);
    try {
      const { data } = await api.post("/timetable/reschedule/preview", { student_id: rescheduleChild, date: dayOpen });
      setReschedulePreview(data);
    } catch (err) { toast.error(apiErrorMessage(err, "Could not find new lesson slots")); }
    finally { setRescheduling(false); }
  };
  const applyReschedule = async () => {
    if (!reschedulePreview?.plan?.length || rescheduling) return;
    setRescheduling(true);
    try {
      const { data } = await api.post("/timetable/reschedule/apply", {
        student_id: rescheduleChild, date: dayOpen,
        moves: reschedulePreview.plan.map(p => ({ from_slot_id: p.from_slot_id, to_slot_id: p.to_slot_id }))
      });
      toast.success(`Rescheduled ${data.moved} lesson${data.moved === 1 ? "" : "s"}.`);
      setReschedulePreview(null);
      await load();
    } catch (err) { toast.error(apiErrorMessage(err, "Could not reschedule lessons; preview again")); setReschedulePreview(null); }
    finally { setRescheduling(false); }
  };
  const clearDay = async () => {
    const selected = dayList.filter(e => !!e.id);
    if (!selected.length || !window.confirm(`Remove all ${selected.length} calendar entries scheduled for ${dayOpen}? Assigned lessons and portfolio evidence will be kept.`)) return;
    setRemovingDay(true);
    try {
      const outcomes = await Promise.allSettled(selected.map(e => api.delete(`/calendar/${e.id}`)));
      const failed = outcomes.filter(r => r.status === "rejected");
      await load();
      if (failed.length) toast.error(`${failed.length} entries could not be removed. The others were removed.`);
      else { toast.success("Scheduled day cleared; learning records kept."); setDayOpen(null); }
    } catch (err) { toast.error(apiErrorMessage(err)); }
    finally { setRemovingDay(false); }
  };

  const monthName = cur.toLocaleString("en-AU", { month: "long", year: "numeric" });
  const dayList = dayOpen ? (eventsByDate[dayOpen] || []) : [];

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
          <button onClick={()=>setAutoQuestOpen(true)} className="rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 px-4 py-2 text-sm font-semibold" data-testid="autoquest-open-btn">⚔️ Auto-Quest</button>
          <button onClick={()=>setGeneratorOpen(true)} className="rounded-full bg-amber-100 text-amber-950 border border-amber-300 px-4 py-2 text-sm font-semibold" data-testid="generate-timetable-btn">Weekly timetable</button>
          <button onClick={()=>setSchedOpen(true)} className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white flex items-center gap-1.5" data-testid="schedule-lesson-btn"><CalendarPlus size={14}/> Schedule lesson</button>
          <button onClick={()=>setOpen(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white flex items-center gap-1.5" data-testid="add-event-btn"><Plus size={14}/> Add event</button>
        </div>
      </div>

      {students.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs">
          {students.map(s => <span key={s.id} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{backgroundColor: colourOf(s.id)}}/>{s.name}</span>)}
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-500"/>Older whole-family events</span>
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
                    <div className={`text-xs ${isToday ? "font-bold text-teal-700" : ""}`}><button type="button" onClick={()=>setDayOpen(iso)} aria-label={`View and edit ${iso}`} className="rounded p-1 hover:bg-teal-50">{dt.getDate()}</button></div>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0,3).map(e => (
                        <button type="button" key={e.id} title={`${nameOf(e.student_id) || "Whole family"}: ${labelOf(e)}`} className="block w-full text-left truncate text-[10px] rounded px-1.5 py-0.5 text-white" style={{backgroundColor: colourOf(e.student_id), opacity: freeSlot(e) ? 0.55 : 1}} onClick={()=>setEditing(e)} data-testid={`edit-cal-${e.id}`} data-slot={isSlot(e) ? (freeSlot(e) ? "free" : "filled") : undefined}>{labelOf(e)}</button>
                      ))}
                      {dayEvents.length > 3 && <button type="button" onClick={()=>setDayOpen(iso)} className="text-[10px] text-teal-700 font-semibold underline" data-testid={`more-${iso}`}>+{dayEvents.length - 3} more</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {editing && <CalendarEventEditor event={editing} students={students} lessons={lessons} onClose={()=>setEditing(null)} onSaved={load}/>}
      {autoQuestOpen && <AutoQuestPreview students={students} onClose={()=>setAutoQuestOpen(false)} onChanged={load} />}
      {generatorOpen && <TimetableGenerator students={students} events={events} onClose={()=>setGeneratorOpen(false)} onDone={load} />}
      {schedOpen && <ScheduleModal lessons={lessons} students={students} onClose={()=>setSchedOpen(false)} onDone={load} />}

      {dayOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setDayOpen(null)}>
          <div onClick={e=>e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 max-h-[80vh] overflow-y-auto" data-testid="day-modal">
            <div className="flex items-center justify-between mb-4"><h2 className="font-display text-lg font-bold">{dayOpen}</h2><button type="button" onClick={()=>setDayOpen(null)} aria-label="Close day"><X size={18}/></button></div>
            <div className="flex justify-between items-center gap-2 mb-3"><span className="text-xs text-slate-500">{dayList.length} scheduled entries</span><button type="button" disabled={!dayList.length || removingDay} onClick={clearDay} className="rounded-full border border-red-300 text-red-700 px-3 py-1.5 text-xs disabled:opacity-50">{removingDay ? "Clearing…" : "Clear scheduled day"}</button></div>
            <div className="mb-4 rounded-xl border border-teal-200 p-3 space-y-2">
              <p className="font-semibold text-sm">Reschedule My Day</p>
              <p className="text-xs text-slate-600">Move unfinished assigned lessons into upcoming free subject slots. Completed lessons stay put.</p>
              <select aria-label="Child to reschedule" value={rescheduleChild} onChange={e => {setRescheduleChild(e.target.value);setReschedulePreview(null);}} className="w-full border rounded p-2 text-sm">
                <option value="">Choose a child</option>
                {students.map(child => <option key={child.id} value={child.id}>{child.name}</option>)}
              </select>
              <button type="button" disabled={!rescheduleChild || rescheduling} onClick={previewReschedule} className="rounded-full bg-teal-800 text-white px-4 py-2 text-sm disabled:opacity-50">Find available days</button>
              {reschedulePreview && <div className="space-y-2 text-sm">
                {reschedulePreview.plan.length ? reschedulePreview.plan.map(p => <p key={p.from_slot_id}>{p.title}: {p.from_date} → {p.to_date} at {p.to_time}</p>) : <p>No matching free slots found in the next four weeks.</p>}
                {!!reschedulePreview.unplaced?.length && <p className="text-amber-800">{reschedulePreview.unplaced.length} lesson(s) could not be placed and will remain on their original day.</p>}
                {!!reschedulePreview.plan.length && <button type="button" disabled={rescheduling} onClick={applyReschedule} className="rounded-full bg-slate-900 text-white px-4 py-2 disabled:opacity-50">Confirm new dates</button>}
              </div>}
            </div>
            <div className="space-y-2">
              {dayList.map(e => (
                <div key={e.id} className="flex items-center gap-2 text-sm rounded-lg border border-slate-200 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{backgroundColor: colourOf(e.student_id)}}/>
                  <span className="font-medium">{nameOf(e.student_id) || "Whole family"}</span>
                  <span className="text-slate-600 truncate flex-1">{e.title}</span><button type="button" className="text-teal-700 text-xs font-semibold underline" onClick={()=>{setDayOpen(null);setEditing(e);}}>Edit</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
              <L label="Child">
                <select value={form.student_id} onChange={e=>setForm({...form, student_id: e.target.value})} className="input" data-testid="e-student">
                  <option value="">Every child (one entry each)</option>
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
            <button disabled={saving} className="mt-5 w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50" data-testid="submit-event">{saving ? "Scheduling\u2026" : "Schedule"}</button>
          </form>
        </div>
      )}
      <style>{`.input { width:100%; border-radius:0.5rem; border:1px solid #cbd5e1; padding:0.5rem 0.75rem; font-size:0.875rem; }`}</style>
    </div>
  );
}
const L = ({ label, children }) => (<div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label><div className="mt-1">{children}</div></div>);
