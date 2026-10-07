import React, { useMemo, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { X } from "lucide-react";

export const isoLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ScheduleModal({ lesson: fixed, lessons = [], students = [], onClose, onDone }) {
  const [lessonId, setLessonId] = useState(fixed?.id || "");
  const [picked, setPicked] = useState([]);
  const [start, setStart] = useState(isoLocal(new Date()));
  const [end, setEnd] = useState("");
  const [weekdays, setWeekdays] = useState([1, 2, 3, 4, 5]);
  const [busy, setBusy] = useState(false);
  const lesson = fixed || lessons.find(l => l.id === lessonId);

  const dates = useMemo(() => {
    if (!start) return [];
    if (!end || end <= start) return [start];
    const out = [];
    let d = parse(start);
    const last = parse(end);
    while (d <= last && out.length < 200) {
      if (weekdays.includes(d.getDay())) out.push(isoLocal(d));
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    }
    return out;
  }, [start, end, weekdays]);

  const toggle = (list, setList, v) => setList(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);

  const submit = async () => {
    if (!lesson) { toast.error("Choose a lesson"); return; }
    if (picked.length === 0) { toast.error("Choose at least one child"); return; }
    if (dates.length === 0) { toast.error("No days match those dates and weekdays"); return; }
    setBusy(true);
    try {
      for (const sid of picked) {
        await api.post("/assignments", { student_id: sid, lesson_id: lesson.id, support_level: "green" });
        for (let i = 0; i < dates.length; i++) {
          await api.post("/calendar", {
            title: dates.length > 1 ? `${lesson.title} \u00b7 Day ${i + 1} of ${dates.length}` : lesson.title,
            date: dates[i],
            event_type: "lesson",
            student_id: sid,
            linked_lesson_id: lesson.id,
            duration_minutes: Number(lesson.duration_minutes) || 45,
            notes: "",
          });
        }
      }
      toast.success(`Scheduled ${dates.length} day${dates.length === 1 ? "" : "s"} for ${picked.length} child${picked.length === 1 ? "" : "ren"}`);
      onDone && onDone();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong. Some days may already have been added.");
      onDone && onDone();
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 max-h-[90vh] overflow-y-auto" data-testid="schedule-modal">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold">Assign and schedule</h3>
          <button onClick={onClose}><X size={18}/></button>
        </div>

        {fixed ? (
          <p className="text-sm font-medium text-slate-800 mb-4">{fixed.title}</p>
        ) : (
          <div className="mb-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lesson</label>
            <select value={lessonId} onChange={e => setLessonId(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="sch-lesson">
              <option value="">Choose a lesson\u2026</option>
              {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </div>
        )}

        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Children</div>
          <div className="space-y-1">
            {students.map(s => (
              <label key={s.id} className="flex items-center gap-2 text-sm rounded-lg border border-slate-200 px-3 py-2">
                <input type="checkbox" checked={picked.includes(s.id)} onChange={() => toggle(picked, setPicked, s.id)} data-testid={`sch-student-${s.id}`}/>
                {s.name}
              </label>
            ))}
            {students.length === 0 && <p className="text-sm text-slate-500">Add a student first.</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Day (or start)</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="sch-start"/>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Last day (optional)</label>
            <input type="date" value={end} min={start} onChange={e => setEnd(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="sch-end"/>
          </div>
        </div>

        {end && end > start && (
          <div className="mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Repeat on</div>
            <div className="flex gap-1 flex-wrap">
              {DAYS.map((n, i) => (
                <button type="button" key={n} onClick={() => toggle(weekdays, setWeekdays, i)} className={`rounded-full px-3 py-1 text-xs font-semibold border ${weekdays.includes(i) ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-300"}`}>{n}</button>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500 mb-4" data-testid="sch-summary">
          {dates.length === 0 ? "No days selected." : dates.length === 1 ? `One entry on ${dates[0]}.` : `${dates.length} separate daily entries, ${dates[0]} to ${dates[dates.length - 1]}.`}
        </p>

        <button onClick={submit} disabled={busy} className="w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50" data-testid="sch-submit">{busy ? "Scheduling\u2026" : "Assign and schedule"}</button>
      </div>
    </div>
  );
}
