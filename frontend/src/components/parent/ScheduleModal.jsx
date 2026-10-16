import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { X } from "lucide-react";

export const isoLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const niceSlot = (s) => `${parse(s.date).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}${s.start_time ? ` ${s.start_time}` : ""} · ${s.title}`;
// Same subject? Mirrors worker/src/timetable.ts sameSubject for the preview (the server decides).
const AREAS = [[/math|numeracy/, "maths"], [/english|literacy|reading|writing|spelling|grammar/, "english"], [/science|technolog|stem/, "science"],
  [/hsie|history|geograph|humanit|social/, "hsie"], [/pdhpe|health|physical|sport/, "pdhpe"], [/art|music|drama|dance|creative/, "arts"]];
const areaKey = (t) => { const a = String(t || "").toLowerCase().trim(); const hit = AREAS.find(([re]) => re.test(a)); return hit ? hit[1] : a; };
const sameSubject = (slot, area) => !!area && areaKey(slot) === areaKey(area);

/**
 * Assign a lesson to children and put it in their week.
 * Family Membership: by default it fills each child's next free timetable slot of the lesson's subject (or a slot the
 * parent picks). Otherwise, or by choice, the parent picks the day(s) as before, or leaves it unscheduled.
 */
export default function ScheduleModal({ lesson: fixed, lessons = [], students = [], defaultStudents = [], onClose, onDone }) {
  const [lessonId, setLessonId] = useState(fixed?.id || "");
  const [picked, setPicked] = useState(defaultStudents);
  const [start, setStart] = useState(isoLocal(new Date()));
  const [end, setEnd] = useState("");
  const [weekdays, setWeekdays] = useState([1, 2, 3, 4, 5]);
  const [busy, setBusy] = useState(false);
  const [timetable, setTimetable] = useState(false); // Family Membership: timetable slots available
  const [mode, setMode] = useState("days"); // slot | pick | days | none
  const [sessions, setSessions] = useState(1);
  const [open, setOpen] = useState({}); // child id -> open slots from today
  const [slotId, setSlotId] = useState("");
  const [assignees, setAssignees] = useState({}); // child id -> { done, status } for this lesson
  const lesson = fixed || lessons.find(l => l.id === lessonId);
  const choices = lessons.filter(l => l.status === "ready");
  const area = lesson?.learning_area || "";

  useEffect(() => {
    api.get("/timetable/status").then((r) => { if (r.data?.allowed) { setTimetable(true); setMode("slot"); } }).catch(() => {});
  }, []);
  useEffect(() => {
    if (!timetable) return;
    const today = isoLocal(new Date());
    picked.filter((sid) => !open[sid]).forEach((sid) => {
      api.get("/timetable/slots", { params: { student_id: sid, from: today, open: 1 } })
        .then((r) => setOpen((o) => ({ ...o, [sid]: r.data || [] }))).catch(() => setOpen((o) => ({ ...o, [sid]: [] })));
    });
  }, [timetable, picked, open]);

  // Who already has this lesson: those children can't be picked again (finished ones only on purpose).
  useEffect(() => {
    if (!lesson?.id) { setAssignees({}); return; }
    let live = true;
    api.get(`/lessons/${lesson.id}/assignees`).then((r) => {
      if (!live) return;
      const m = {};
      (r.data || []).forEach((a) => { m[a.student_id] = a; });
      setAssignees(m);
      setPicked((p) => p.filter((sid) => !m[sid] || !m[sid].done));
    }).catch(() => {});
    return () => { live = false; };
  }, [lesson?.id]);

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
  const nextSlots = (sid) => (open[sid] || []).filter((s) => sameSubject(s.title, area)).slice(0, sessions);
  const onlyChild = picked.length === 1 ? picked[0] : null;

  // The child's open assignment, a new one, or null if another tab assigned it in the meantime.
  const assignmentFor = async (sid) => {
    const has = assignees[sid];
    if (has && !has.done) return has.assignment_id; // already assigned: only add it to their week
    try {
      const { data } = await api.post("/assignments", { student_id: sid, lesson_id: lesson.id, support_level: "green", again: !!assignees[sid]?.done });
      return data.id;
    } catch (e) {
      if (["ALREADY_ASSIGNED", "ALREADY_COMPLETED"].includes(e.response?.data?.code)) return null;
      throw e;
    }
  };
  const scheduleOnDays = async (sid, days) => {
    for (let i = 0; i < days.length; i++) {
      await api.post("/calendar", {
        title: days.length > 1 ? `${lesson.title} · Day ${i + 1} of ${days.length}` : lesson.title,
        date: days[i], event_type: "lesson", student_id: sid, linked_lesson_id: lesson.id,
        duration_minutes: Number(lesson.duration_minutes) || 45, notes: "",
      });
    }
  };

  const submit = async () => {
    if (!lesson) { toast.error("Choose a lesson"); return; }
    if (picked.length === 0) { toast.error("Choose at least one child"); return; }
    if (mode === "days" && dates.length === 0) { toast.error("No days match those dates and weekdays"); return; }
    if (mode === "pick" && !slotId) { toast.error("Choose a timetable slot"); return; }
    setBusy(true);
    const notes = [];
    try {
      for (const sid of picked) {
        const aid = await assignmentFor(sid);
        if (!aid) { notes.push(`${students.find((s) => s.id === sid)?.name || "Child"} already had it, so nothing was added for them`); continue; }
        if (mode === "days") { await scheduleOnDays(sid, dates); continue; }
        if (mode === "none") continue;
        const body = mode === "pick" ? { slot_ids: [slotId] } : { count: sessions };
        const { data } = await api.post(`/assignments/${aid}/place`, body);
        if (!data.placed.length) {
          // No free slot for this subject: put it on the start day instead, so it's still in the week.
          await scheduleOnDays(sid, [start]);
          notes.push(`${students.find((s) => s.id === sid)?.name || "Child"}: no free ${area || "matching"} slot, so it's on ${start}`);
        }
      }
      const what = mode === "none" ? "Assigned (not scheduled yet)" : mode === "days"
        ? `Scheduled ${dates.length} day${dates.length === 1 ? "" : "s"} for ${picked.length} child${picked.length === 1 ? "" : "ren"}`
        : `Scheduled in the timetable for ${picked.length} child${picked.length === 1 ? "" : "ren"}`;
      toast.success(notes.length ? `${what}. ${notes.join("; ")}.` : what);
      onDone && onDone();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong. Some days may already have been added.");
      onDone && onDone();
    } finally { setBusy(false); }
  };

  const modeBtn = (value, label, testid) => (
    <label className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer ${mode === value ? "border-slate-900 bg-slate-50" : "border-slate-200"}`}>
      <input type="radio" name="when" checked={mode === value} onChange={() => { setMode(value); if (value === "none") setPicked((p) => p.filter((sid) => !assignees[sid] || assignees[sid].done)); }} className="mt-0.5" data-testid={testid} />
      <span>{label}</span>
    </label>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 max-h-[90vh] overflow-y-auto" data-testid="schedule-modal">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold">Assign and schedule</h3>
          <button onClick={onClose} aria-label="Close"><X size={18}/></button>
        </div>

        {fixed ? (
          <p className="text-sm font-medium text-slate-800 mb-4">{fixed.title}{area && <span className="text-slate-500"> · {area}</span>}</p>
        ) : (
          <div className="mb-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lesson</label>
            <select value={lessonId} onChange={e => setLessonId(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="sch-lesson">
              <option value="">Choose a lesson…</option>
              {choices.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </div>
        )}

        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Children</div>
          <div className="space-y-1">
            {students.map(s => {
              const has = assignees[s.id];
              const open = has && !has.done;
              const locked = open && mode === "none"; // nothing to schedule, and it's never assigned twice
              return (
                <label key={s.id} className={`flex items-center gap-2 text-sm rounded-lg border border-slate-200 px-3 py-2 ${locked ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""}`}>
                  <input type="checkbox" disabled={locked} checked={picked.includes(s.id)} data-testid={`sch-student-${s.id}`}
                    onChange={() => { toggle(picked, setPicked, s.id); setSlotId(""); }} />
                  <span>{s.name}</span>
                  {open && <span className="ml-auto text-xs text-amber-800 text-right" data-testid={`sch-already-${s.id}`}>{locked ? "Already assigned" : "Already assigned · ticking only adds it to their week"}</span>}
                  {has?.done && <span className="ml-auto text-xs text-emerald-700" data-testid={`sch-finished-${s.id}`}>Finished · tick to assign again</span>}
                </label>
              );
            })}
            {students.length === 0 && <p className="text-sm text-slate-500">Add a student first.</p>}
          </div>
        </div>

        {timetable && (
          <div className="mb-4 space-y-1.5" data-testid="sch-when">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">When</div>
            {modeBtn("slot", <>Next free <strong>{area || "matching"}</strong> slot in the timetable</>, "sch-mode-slot")}
            {mode === "slot" && (
              <div className="pl-7 space-y-1 text-xs text-slate-600" data-testid="sch-slot-preview">
                <label className="flex items-center gap-2">Sessions
                  <select value={sessions} onChange={(e) => setSessions(Number(e.target.value))} className="rounded border border-slate-300 px-1 py-0.5" data-testid="sch-sessions">
                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
                {picked.map((sid) => {
                  const name = students.find((s) => s.id === sid)?.name;
                  const next = nextSlots(sid);
                  return <p key={sid}>{name}: {!open[sid] ? "checking…" : next.length ? next.map(niceSlot).join(", ") : <span className="text-amber-700">no free {area || "matching"} slot, so it goes on the start day below</span>}</p>;
                })}
              </div>
            )}
            {onlyChild && modeBtn("pick", "Choose a timetable slot", "sch-mode-pick")}
            {mode === "pick" && onlyChild && (
              <select value={slotId} onChange={(e) => setSlotId(e.target.value)} className="ml-7 w-[calc(100%-1.75rem)] rounded-lg border border-slate-300 px-2 py-1.5 text-sm" data-testid="sch-slot">
                <option value="">Choose a free slot…</option>
                {[...(open[onlyChild] || [])].sort((a, b) => Number(sameSubject(b.title, area)) - Number(sameSubject(a.title, area))).map((s) => (
                  <option key={s.id} value={s.id}>{niceSlot(s)}{sameSubject(s.title, area) ? "" : " (different subject)"}</option>
                ))}
              </select>
            )}
            {modeBtn("days", "Choose the day(s) myself", "sch-mode-days")}
            {modeBtn("none", "Don't schedule yet", "sch-mode-none")}
          </div>
        )}

        {(mode === "days" || mode === "slot") && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{mode === "slot" ? "If no free slot: day" : "Day (or start)"}</label>
              <input type="date" value={start} onChange={e => setStart(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="sch-start"/>
            </div>
            {mode === "days" && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Last day (optional)</label>
                <input type="date" value={end} min={start} onChange={e => setEnd(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="sch-end"/>
              </div>
            )}
          </div>
        )}

        {mode === "days" && end && end > start && (
          <div className="mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Repeat on</div>
            <div className="flex gap-1 flex-wrap">
              {DAYS.map((n, i) => (
                <button type="button" key={n} onClick={() => toggle(weekdays, setWeekdays, i)} className={`rounded-full px-3 py-1 text-xs font-semibold border ${weekdays.includes(i) ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-300"}`}>{n}</button>
              ))}
            </div>
          </div>
        )}

        {mode === "days" && (
          <p className="text-xs text-slate-500 mb-4" data-testid="sch-summary">
            {dates.length === 0 ? "No days selected." : dates.length === 1 ? `One entry on ${dates[0]}.` : `${dates.length} separate daily entries, ${dates[0]} to ${dates[dates.length - 1]}.`}
          </p>
        )}
        {!timetable && <p className="text-xs text-slate-500 mb-4" data-testid="sch-timetable-upsell">With a Family Membership, lessons go straight into your child's timetable.</p>}

        <button onClick={submit} disabled={busy} className="w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50" data-testid="sch-submit">{busy ? "Scheduling…" : mode === "none" ? "Assign" : "Assign and schedule"}</button>
      </div>
    </div>
  );
}
