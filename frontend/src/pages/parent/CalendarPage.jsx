import React, { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Plus, X, ChevronLeft, ChevronRight, CalendarPlus } from "lucide-react";
import ScheduleModal, { isoLocal } from "../../components/parent/ScheduleModal";
import { lessonAvailableForChildren } from "../../lib/lessonAvailability";
import TimetableGenerator from "../../components/parent/TimetableGenerator";
import AutoQuestPreview from "../../components/parent/AutoQuestPreview";
import FillMyWeek from "../../components/parent/FillMyWeek";
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
  const [weekFillOpen, setWeekFillOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(null);
  const [editing, setEditing] = useState(null);
  const [removingDay, setRemovingDay] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [reschedulePreview, setReschedulePreview] = useState(null);
  const [rescheduleChild, setRescheduleChild] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [calendarError, setCalendarError] = useState("");
  const [dayDrafting, setDayDrafting] = useState(false);
  const [draftProgress, setDraftProgress] = useState(null);
  const [dayTopic, setDayTopic] = useState("");
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({ title: "", date: isoLocal(new Date()), event_type: "lesson", student_id: "", linked_lesson_id: "", duration_minutes: 45, notes: "" });

  const visibleWeeks = monthMatrix(cur.getFullYear(), cur.getMonth());
  const rangeFrom = isoLocal(visibleWeeks[0][0]);
  const rangeTo = isoLocal(visibleWeeks[5][6]);
  const load = async () => {
    setLoadingCalendar(true);
    try {
      const { data } = await api.get("/calendar", { params: { from: rangeFrom, to: rangeTo } });
      setEvents(data);
      setCalendarError("");
    } catch (error) {
      setCalendarError(apiErrorMessage(error, "Unable to load your calendar."));
    } finally { setLoadingCalendar(false); }
  };
  const loadLessons = async () => {
    const { data } = await api.get("/lessons");
    setLessons((data || []).filter(l => l.status === "ready"));
  };
  const afterCalendarChange = () => {
    load();
    loadLessons().catch(e => toast.error(apiErrorMessage(e, "Couldn't refresh available lessons")));
  };
  useEffect(() => { load(); }, [rangeFrom, rangeTo]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    api.get("/students").then(r=>setStudents(r.data)).catch(e=>toast.error(apiErrorMessage(e)));
    loadLessons().catch(e=>toast.error(apiErrorMessage(e)));
  }, []);
  useEffect(() => {
    const event = events.find(e => e.id === focused);
    if (!event || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) return;
    const [y,m,d] = event.date.split("-").map(Number);
    setCur(new Date(y,m-1,d));setFilter("");setDayOpen(event.date);
  },[focused,events]);

  useEffect(() => {
    if (dayOpen && !rescheduleChild && students.length) setRescheduleChild(filter || students[0].id);
  }, [dayOpen, rescheduleChild, students, filter]);

  const colourOf = (sid) => {
    const i = students.findIndex(s => s.id === sid);
    return i < 0 ? "#475569" : (students[i].prefs?.calendar_colour || COLOURS[i % COLOURS.length]);
  };
  const nameOf = (sid) => students.find(s => s.id === sid)?.name;
  const targetChildren = form.student_id ? [form.student_id] : students.map(s=>s.id);
  const calendarLibraryChoices = lessons.filter(l => lessonAvailableForChildren(l, targetChildren));
  // Timetable slots show their subject plus the lesson in them, or "(free)" while empty.
  const isSlot = (e) => e.event_type === "timetable" || (e.event_type === "lesson" && /^Suggested by Side-Quest/.test(e.notes || ""));
  const freeSlot = (e) => isSlot(e) && !e.linked_assignment_id && !e.linked_lesson_id;
  const labelOf = (e) => (e.student_id && nameOf(e.student_id) ? `${nameOf(e.student_id).split(" ")[0]}: ` : "")
    + (e.start_time && isSlot(e) ? `${e.start_time} ` : "") + e.title + (e.lesson_title ? ` · ${e.lesson_title}` : freeSlot(e) ? " (free)" : "");

  const month = cur.getMonth(), year = cur.getFullYear();
  const weeks = visibleWeeks;
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
          const a = await api.post("/assignments", { student_id: sid, lesson_id: form.linked_lesson_id, support_level: "green" });
          assignmentId = a.data?.id || null;
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
      setOpen(false); afterCalendarChange();
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
  const generateDayDrafts = async () => {
    if (!dayOpen || !rescheduleChild || dayDrafting) return toast.error("Choose a child for this day first.");
    const selected = dayList.filter(e => e.student_id === rescheduleChild && freeSlot(e));
    if (!selected.length) return toast.info("This child has no free timetable slots today.");
    setDayDrafting(true);
    setDraftProgress({ done: 0, total: 0, assigned: 0, created: 0, failed: 0, current: "Checking your lesson library first…" });
    try {
      // A plan only saves proposals: no AI usage and no assignments.
      const { data } = await api.post("/auto-quest/plan", {
        student_id: rescheduleChild, from: dayOpen, to: dayOpen, topic: dayTopic.trim()
      });
      const ids = new Set(selected.map(e => e.id));
      const proposals = (data.proposals || []).filter(p => ids.has(p.calendar_event_id) && p.status === "proposed");
      const library = proposals.filter(p => p.lesson?.status === "ready");
      const pending = proposals.filter(p => p.action === "needs_generation" && !p.lesson);
      const review = proposals.filter(p => p.lesson && p.lesson.status !== "ready");
      const missing = selected.length - library.length - pending.length - review.length;
      if (!library.length && !pending.length) {
        setDraftProgress({ done: 0, total: 0, assigned: 0, created: 0, failed: 0,
          current: review.length ? `${review.length} draft(s) need your review. Open their slots to assign.` :
            "No available library lessons or AI drafts for these slots. Open a free slot to plan it manually." });
        return;
      }
      if (pending.some(p => !p.outcome_codes?.length && /^languages?\b/i.test(p.learning_area || "")) && !dayTopic.trim()) {
        toast.error("Enter the language/topic for these sessions (e.g. Latin greetings). No AI allowance has been used.");
        return;
      }
      const summary = [
        `Prepare ${students.find(c=>c.id === rescheduleChild)?.name || "this child's"} lessons for ${dayOpen}?`,
        `${library.length} unused ready library lesson(s) will be assigned to their exact timetable slots.`,
        `${pending.length} missing lesson(s) will be drafted with AI using your normal allowance; you'll review each draft before assignment.`,
        ...(review.length ? [`${review.length} existing draft(s) still need review.`] : []),
        ...(missing > 0 ? [`${missing} slot(s) need manual planning.`] : []),
        "No AI-generated draft will be assigned automatically. Continue?"
      ];
      if (!window.confirm(summary.join("\n\n"))) return;
      let assigned = 0, created = 0, failed = 0, processed = 0, deferred = 0;
      const errors = [];
      const tasks = [...library.map(p => ({ p, kind: "library" })), ...pending.map(p => ({ p, kind: "generate" }))];
      // Run serially to make progress and errors truthful and avoid bursts of
      // simultaneous AI-generation calls that can exceed the family's quota.
      for (const [i, task] of tasks.entries()) {
        setDraftProgress({ done: i, total: tasks.length, assigned, created, failed,
          current: task.kind === "library"
            ? `Assigning saved ${task.p.lesson?.title || "lesson"} (${i + 1}/${tasks.length})…`
            : `Drafting ${task.p.learning_area || "lesson"} (${i + 1}/${tasks.length})…` });
        try {
          if (task.kind === "library") {
            await api.post(`/auto-quest/proposals/${task.p.id}/approve`, {});
            assigned++;
          } else {
            await api.post(`/auto-quest/proposals/${task.p.id}/generate`, {
              topic: !task.p.outcome_codes?.length && /^languages?\b/i.test(task.p.learning_area || "") ? dayTopic.trim() : undefined
            });
            created++;
          }
        } catch (error) {
          failed++;
          errors.push(`${task.p.learning_area || "Lesson"}: ${apiErrorMessage(error)}`);
          // Stop expensive generation after a quota or plan failure; existing
          // library items are deliberately processed first.
          if (task.kind === "generate" && [402, 429].includes(error.response?.status)) {
            processed = i + 1;
            deferred = tasks.length - processed;
            break;
          }
        }
        processed = i + 1;
        setDraftProgress({ done: processed, total: tasks.length, assigned, created, failed,
          current: `${assigned} assigned · ${created} drafts saved · ${failed} need attention` });
      }
      setDraftProgress({ done: processed, total: tasks.length, assigned, created, failed,
        current: `${assigned} library lesson(s) assigned; ${created} AI drafts saved for review. ${review.length} existing draft(s) awaiting review.${deferred ? ` ${deferred} not attempted because generation is unavailable or the allowance was reached.` : ""}` });
      if (assigned || created) toast.success(`${assigned} library lessons assigned; ${created} AI drafts saved for review.`);
      if (errors.length) toast.error(`${failed} item(s) could not be prepared: ${errors[0]}`);
      await load();
    } catch (error) { toast.error(apiErrorMessage(error, "Couldn't prepare this day.")); }
    finally { setDayDrafting(false); }
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
  const dayList = dayOpen ? [...(eventsByDate[dayOpen] || [])].sort((a, b) =>
    (a.start_time || "99:99").localeCompare(b.start_time || "99:99") || a.title.localeCompare(b.title)) : [];
  const daySlots = dayList.filter(e => freeSlot(e) && (!rescheduleChild || e.student_id === rescheduleChild));

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
          <button onClick={()=>setWeekFillOpen(true)} className="rounded-full bg-teal-800 text-white px-5 py-2 text-sm font-bold" data-testid="fill-week-open">⚔️ Fill My Week</button>
          <button onClick={()=>setAutoQuestOpen(true)} className="rounded-full border border-emerald-300 bg-emerald-50 text-emerald-900 px-4 py-2 text-sm font-semibold" data-testid="autoquest-open-btn">Auto-Quest (advanced)</button>
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

      {calendarError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {calendarError} <button type="button" onClick={load} className="ml-2 font-bold underline">Retry calendar</button>
      </div>}
      {loadingCalendar && <p role="status" className="text-sm text-slate-600">Loading this month's timetable…</p>}
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
                        <button type="button" key={e.id} title={`${nameOf(e.student_id) || "Whole family"}: ${labelOf(e)}`} className="block w-full text-left truncate text-[10px] rounded px-1.5 py-0.5 text-white" style={{backgroundColor: colourOf(e.student_id), opacity: freeSlot(e) ? 0.55 : 1}} onClick={()=>setEditing({ ...e, initialQuest: freeSlot(e) })} data-testid={`edit-cal-${e.id}`} data-slot={isSlot(e) ? (freeSlot(e) ? "free" : "filled") : undefined}>{labelOf(e)}</button>
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

      {editing && <CalendarEventEditor event={editing} students={students} lessons={lessons} onClose={()=>setEditing(null)} onSaved={afterCalendarChange}/>}
      {weekFillOpen && <FillMyWeek students={students} initialChild={filter || rescheduleChild}
        initialDate={isoLocal(cur)} onClose={()=>setWeekFillOpen(false)} onDone={afterCalendarChange}
        onOpenDay={date=>{setWeekFillOpen(false);setDayOpen(date);}} />}
      {autoQuestOpen && <AutoQuestPreview students={students} onClose={()=>setAutoQuestOpen(false)} onChanged={afterCalendarChange} />}
      {generatorOpen && <TimetableGenerator students={students} events={events} onClose={()=>setGeneratorOpen(false)} onDone={load} />}
      {schedOpen && <ScheduleModal lessons={lessons} students={students} onClose={()=>setSchedOpen(false)} onDone={afterCalendarChange} />}

      {dayOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center"
          onClick={() => !dayDrafting && setDayOpen(null)}>
          <section role="dialog" aria-modal="true" aria-label="Day's learning plan" onClick={e=>e.stopPropagation()}
            className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-xl p-4 sm:p-6 space-y-5"
            data-testid="day-modal">
            <header className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold">
                  {new Date(dayOpen + "T12:00:00").toLocaleDateString("en-AU", { weekday:"long", day:"numeric", month:"long" })}
                </h2>
                <p className="text-sm text-slate-600 mt-1">{dayList.length} scheduled entries · {daySlots.length} available learning slots</p>
              </div>
              <button type="button" disabled={dayDrafting} onClick={()=>{setDayOpen(null);setWeekFillOpen(true);}} className="text-sm underline text-teal-900 font-semibold">Fill this week</button>
              <button type="button" disabled={dayDrafting} onClick={()=>setDayOpen(null)} aria-label="Close day"
                className="p-2 rounded-lg border disabled:opacity-50"><X size={18}/></button>
            </header>
            <div className="rounded-xl bg-teal-50 border border-teal-200 p-4 space-y-3" data-testid="day-autoquest">
              <h3 className="font-display font-bold text-teal-950">⚔️ Prepare this day's lessons</h3>
              <p className="text-sm text-slate-700">Side-Quest checks your lesson library first, assigns suitable unused lessons, then drafts missing ones with AI. You'll review AI drafts before assignment.</p>
              <label className="block text-sm font-semibold">Child
                <select aria-label="Child to prepare" value={rescheduleChild}
                  onChange={e=>{setRescheduleChild(e.target.value); setReschedulePreview(null); setDraftProgress(null);}}
                  disabled={dayDrafting} className="input mt-1" data-testid="day-child">
                  <option value="">Choose a child</option>
                  {students.map(child=><option value={child.id} key={child.id}>{child.name}</option>)}
                </select>
              </label>
              {daySlots.some(e => /^languages?\b/i.test(e.title)) && <label className="block text-sm font-semibold">
                Language / topic (e.g. Latin greetings)
                <input className="input mt-1" value={dayTopic} maxLength={140}
                  onChange={e=>setDayTopic(e.target.value)} placeholder="Latin: greetings and introductions"
                  data-testid="day-language-topic" disabled={dayDrafting}/>
                <span className="block text-xs font-normal text-slate-600 mt-1">Needed for Languages so the library doesn't substitute another language.</span>
              </label>}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs text-slate-600">{daySlots.length} free slot(s) for the selected child</p>
                <button type="button" onClick={generateDayDrafts}
                  disabled={dayDrafting || !rescheduleChild || !daySlots.length}
                  className="rounded-full bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  data-testid="generate-day-lessons">
                  {dayDrafting ? "Preparing lessons…" : "Prepare all free slots"}
                </button>
              </div>
              {draftProgress && <div className="rounded-lg bg-white border border-teal-200 p-3 text-sm" role="status" data-testid="day-batch-progress">
                <p>{draftProgress.current}</p>
                {!!draftProgress.total && <progress value={draftProgress.done} max={draftProgress.total}
                  aria-label="Lessons prepared" className="w-full mt-2"/>}
                {draftProgress.total > 0 && <p className="text-xs mt-1 text-slate-600">
                  {draftProgress.assigned || 0} library lesson(s) assigned · {draftProgress.created || 0} draft(s) for review · {draftProgress.failed || 0} issues
                </p>}
              </div>}
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold">Your timetable</h3>
              {!dayList.length && <p className="text-sm text-slate-600">No scheduled entries on this day. Create a weekly timetable or add an event.</p>}
              {dayList.map(e => <article key={e.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-slate-200 p-3"
                data-testid={`day-event-${e.id}`}>
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="h-3 w-3 rounded-full shrink-0 mt-1.5" style={{backgroundColor:colourOf(e.student_id)}}/>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{e.start_time || "Any time"} · {e.title}
                      {freeSlot(e) && <span className="ml-2 text-xs text-amber-800 font-normal">Free slot</span>}
                    </div>
                    <p className="text-xs text-slate-600">{nameOf(e.student_id) || "Whole family"}
                      {e.duration_minutes ? ` · ${e.duration_minutes} min` : ""}
                      {e.lesson_title ? ` · Lesson: ${e.lesson_title}` : ""}
                    </p>
                  </div>
                </div>
                <button type="button"
                  className={`rounded-full px-4 py-2 text-xs font-semibold shrink-0 ${freeSlot(e) ? "bg-teal-800 text-white" : "border border-slate-300 text-slate-700"}`}
                  onClick={()=>{setDayOpen(null);setEditing({ ...e, initialQuest: freeSlot(e) });}}
                  data-testid={freeSlot(e) ? `fill-slot-${e.id}` : `edit-day-${e.id}`}>
                  {freeSlot(e) ? "⚔️ Fill this slot" : "View / edit"}
                </button>
              </article>)}
            </div>
            <details className="rounded-xl border border-slate-200 p-3">
              <summary className="font-semibold text-sm cursor-pointer">Reschedule or clear this day</summary>
              <div className="space-y-3 mt-3 text-sm">
                <p>Move unfinished assigned lessons into upcoming free slots of the same subject. Completed work stays put.</p>
                <button type="button" disabled={!rescheduleChild || rescheduling} onClick={previewReschedule}
                  className="rounded-full bg-slate-800 text-white px-3 py-2 text-xs disabled:opacity-50">Find alternative days</button>
                {reschedulePreview && <div className="space-y-2">
                  {reschedulePreview.plan.length ? reschedulePreview.plan.map(p=><p key={p.from_slot_id}>{p.title}: {p.from_date} → {p.to_date} at {p.to_time}</p>) : <p>No matching free slots found in the next four weeks.</p>}
                  {!!reschedulePreview.unplaced?.length && <p className="text-amber-800">{reschedulePreview.unplaced.length} could not be moved and will stay in place.</p>}
                  {!!reschedulePreview.plan.length && <button type="button" disabled={rescheduling}
                    onClick={applyReschedule} className="rounded-full bg-teal-800 text-white px-4 py-2 text-xs disabled:opacity-50">Confirm new dates</button>}
                </div>}
                <button type="button" disabled={!dayList.length || removingDay || dayDrafting} onClick={clearDay}
                  className="rounded-full border border-red-300 text-red-700 px-3 py-2 text-xs disabled:opacity-50">
                  {removingDay ? "Clearing…" : "Remove all calendar entries for this day"}</button>
              </div>
            </details>
          </section>
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
                <select value={form.student_id} onChange={e=>setForm(f => {
                  const target = e.target.value;
                  const childIds = target ? [target] : students.map(s=>s.id);
                  return { ...f, student_id: target, linked_lesson_id:
                    lessons.some(l => l.id === f.linked_lesson_id && lessonAvailableForChildren(l, childIds))
                      ? f.linked_lesson_id : "" };
                })} className="input" data-testid="e-student">
                  <option value="">Every child (one entry each)</option>
                  {students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </L>
              <L label="Linked lesson (optional)">
                <select value={form.linked_lesson_id} onChange={e=>setForm({...form, linked_lesson_id: e.target.value})} className="input" data-testid="e-lesson">
                  <option value="">None</option>
                  {calendarLibraryChoices.map(l=><option key={l.id} value={l.id}>{l.title}</option>)}
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
