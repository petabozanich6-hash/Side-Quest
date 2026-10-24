import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";
import TimetableGenerator from "./TimetableGenerator";
import { buildWeeklyLessonRows } from "../../lib/weeklyLessonPlan";
import { onWeekDraftChange, runWeekDrafts, weekDraftError, weekDraftState, weekDraftSummary, weekDraftsStopped } from "../../lib/weekDraftRunner";

const iso = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
const fromIso = date => new Date(date + "T12:00:00");
const monday = date => { const d = fromIso(date); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return iso(d); };
const plusDays = (date, n) => { const d = fromIso(date); d.setDate(d.getDate() + n); return iso(d); };
const suggestedWeek = date => { const day = fromIso(date).getDay(); const start = monday(date); return day === 0 || day === 6 ? plusDays(start, 7) : start; };
const dateLabel = date => fromIso(date).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
/** Where a draft made for this week is reviewed; the review page can put it straight into its timetable slot. */
export const weekReviewPath = (lessonId, week, child) => `/parent/lessons/${lessonId}/review?week=${week}&child=${child}`;
const STATUS = {
  scheduled: ["Already on the calendar", "text-emerald-800"],
  ready: ["Matching lesson ready", "text-teal-800"],
  missing: ["Needs a lesson", "text-amber-800"],
  review: ["Draft needs your review", "text-amber-800"],
  conflict: ["Time conflict", "text-red-800"],
  attention: ["Needs your choice", "text-amber-800"],
};

export default function PlanMyWeek({ students = [], initialDate, initialChild = "", autoLoad = false, onClose, onDone }) {
  const [week, setWeek] = useState(suggestedWeek(initialDate || iso(new Date())));
  const [children, setChildren] = useState(initialChild ? [initialChild] : students.map(s => s.id));
  const [calendar, setCalendar] = useState(null);
  const [calendarError, setCalendarError] = useState("");
  const [plans, setPlans] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState("");
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState([]);
  const end = plusDays(week, 6);

  const rows = useMemo(() => !plans || !calendar ? [] : children.flatMap(child =>
    buildWeeklyLessonRows(calendar, plans[child] || [], child).map(r => ({ ...r, child }))
  ), [calendar, plans, children]);
  const ready = rows.filter(r => r.state === "ready");
  const chosen = ready.filter(r => selected.includes(r.id));
  // Slots whose draft is being written in the background are not "missing" any more.
  const drafting = r => ["queued", "writing"].includes(weekDraftState(r.proposal?.id));
  const missing = rows.filter(r => r.state === "missing" && !drafting(r));
  const writing = rows.filter(r => r.state === "missing" && drafting(r));
  const reviewing = rows.filter(r => r.state === "review");
  const attention = rows.filter(r => r.state === "attention");
  const clashes = rows.filter(r => r.state === "conflict");
  const slots = (calendar || []).filter(e => children.includes(e.student_id) &&
    (e.event_type === "timetable" || (e.event_type === "lesson" && String(e.notes || "").startsWith("Suggested by Side-Quest"))));
  const hasSlots = slots.length > 0;
  const [timetableOpen, setTimetableOpen] = useState(false);
  const [, rerender] = useReducer(n => n + 1, 0);
  const finished = useRef(weekDraftSummary().done + weekDraftSummary().failed);

  useEffect(() => {
    let active = true;
    setCalendar(null); setPlans(null); setSelected([]); setErrors([]); setCalendarError("");
    api.get("/calendar", { params: { from: week, to: end } })
      .then(({ data }) => { if (active) setCalendar(data || []); })
      .catch(e => { if (active) setCalendarError(apiErrorMessage(e, "Couldn't load this week's calendar")); });
    return () => { active = false; };
  }, [week, end]);

  const refresh = async (replan = false) => {
    if (!children.length) return;
    setLoading(true); if (replan) setErrors([]); setProgress("");
    try {
      const { data: entries } = await api.get("/calendar", { params: { from: week, to: end } });
      const updates = {};
      for (const child of children) {
        const { data } = replan
          ? await api.post("/auto-quest/plan", { student_id: child, from: week, to: end, topic: topic.trim() })
          : await api.get("/auto-quest/proposals", { params: { student_id: child, from: week, to: end } });
        updates[child] = data.proposals || [];
      }
      setCalendar(entries || []); setPlans(updates); setCalendarError("");
      const eligible = children.flatMap(child => buildWeeklyLessonRows(entries || [], updates[child] || [], child))
        .filter(r => r.state === "ready").map(r => r.id);
      setSelected(eligible);
    } catch (e) { toast.error(apiErrorMessage(e, "Couldn't review the learning week")); }
    finally { setLoading(false); }
  };

  // Background drafts: redraw as they progress, and re-read the week when one finishes so its slot shows the draft.
  // This quiet reload keeps the parent's ticked choices.
  useEffect(() => onWeekDraftChange(() => {
    rerender();
    const { done, failed } = weekDraftSummary();
    if (done + failed === finished.current) return;
    finished.current = done + failed;
    if (!children.length) return;
    Promise.all([
      api.get("/calendar", { params: { from: week, to: end } }),
      ...children.map(child => api.get("/auto-quest/proposals", { params: { student_id: child, from: week, to: end } })),
    ]).then(([cal, ...lists]) => {
      setCalendar(cal.data || []);
      setPlans(Object.fromEntries(children.map((child, i) => [child, lists[i].data?.proposals || []])));
    }).catch(() => { /* the next finished draft or a manual refresh tries again */ });
  }), [children, week, end]);

  // Coming back from reviewing a draft: show the week's saved plan straight away (no replanning, no AI).
  const autoLoaded = useRef(false);
  useEffect(() => {
    if (!autoLoad || autoLoaded.current || !calendar) return;
    autoLoaded.current = true;
    refresh(false);
  }, [autoLoad, calendar]); // eslint-disable-line react-hooks/exhaustive-deps

  const copyLastWeek = async () => {
    if (!children.length || saving || copying) return;
    setCopying(true);
    try {
      const previousMonday = plusDays(week, -7);
      const previousSunday = plusDays(week, -1);
      const blocks = [];
      for (const child of children) {
        const { data } = await api.get("/timetable/slots", {
          params: { student_id: child, from: previousMonday, to: previousSunday },
        });
        for (const entry of data || []) {
          blocks.push({
            student_id: child, title: entry.title, date: plusDays(entry.date, 7),
            start_time: entry.start_time, duration_minutes: Number(entry.duration_minutes) || 45,
          });
        }
      }
      if (!blocks.length) {
        toast.error("No learning times found last week. Choose Set up learning times instead.");
        return;
      }
      if (!window.confirm(`Copy ${blocks.length} learning times to ${dateLabel(week)} – ${dateLabel(end)}? Lessons, finished work and assignments will NOT be copied.`)) return;
      const { data } = await api.post("/timetable/week", { week_start: week, blocks });
      toast.success(`${data.created || 0} learning times copied. ${data.skipped || 0} already existed or conflicted.`);
      onDone?.(week);
      await refresh(true);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't copy last week's learning times"));
    } finally { setCopying(false); }
  };

  const commit = async () => {
    if (!chosen.length || saving) return;
    if (!window.confirm(`Assign ${chosen.length} unused lesson(s) to their selected children and exact timetable times? Existing work won't be changed.`)) return;
    setSaving(true); setErrors([]);
    const failed = [];
    let applied = 0;
    try {
      // Refresh first: never approve a cached choice if the slot or lesson changed.
      const { data: current } = await api.get("/calendar", { params: { from: week, to: end } });
      for (const row of chosen) {
        const { data } = await api.get("/auto-quest/proposals", { params: { student_id: row.child, from: week, to: end } });
        const fresh = buildWeeklyLessonRows(current || [], data.proposals || [], row.child).find(r => r.id === row.id);
        if (!fresh || fresh.state !== "ready" || fresh.proposal?.id !== row.proposal.id ||
          fresh.proposal?.lesson?.id !== row.proposal.lesson.id) {
          failed.push(`${row.slot.title} (${dateLabel(row.slot.date)}): changed since preview`);
          continue;
        }
        setProgress(`Scheduling ${applied + failed.length + 1} of ${chosen.length}…`);
        try { await api.post(`/auto-quest/proposals/${row.proposal.id}/approve`, {}); applied++; }
        catch (e) { failed.push(`${row.slot.title} (${dateLabel(row.slot.date)}): ${apiErrorMessage(e)}`); }
      }
      if (applied) { toast.success(`${applied} lesson(s) scheduled.`); onDone?.(week); }
      if (failed.length) toast.error(`${failed.length} need attention. Nothing already assigned was replaced.`);
      setErrors(failed);
      await refresh(false);
    } catch (e) { toast.error(apiErrorMessage(e, "Couldn't finish checking your week")); }
    finally { setSaving(false); setProgress(""); }
  };

  const draftMissing = (only) => {
    const todo = only ? [only] : missing;
    if (!todo.length) return;
    if (todo.some(r => /^languages?\b/i.test(r.proposal?.learning_area || r.slot.title)) && !topic.trim()) {
      toast.error("Enter the language and topic first (for example, Latin greetings)."); return;
    }
    if (!only && !window.confirm(`Write ${todo.length} AI draft(s)? This uses your normal allowance. You'll review each draft before it's assigned.`)) return;
    setErrors([]);
    runWeekDrafts(todo.map(r => ({ id: r.proposal.id, label: `${childName(r.child)}: ${r.slot.title}, ${dateLabel(r.slot.date)}` })), topic.trim());
    if (!only) toast.success("Writing your lessons. You can close this window; they keep going while Side-Quest is open.");
  };

  const changeChildren = next => { setChildren(next); setPlans(null); setSelected([]); setErrors([]); };
  const childName = child => students.find(s => s.id === child)?.name || "Child";
  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 p-2 sm:p-5 overflow-y-auto" onClick={() => !saving && onClose()}>
      <section role="dialog" aria-modal="true" aria-label="Plan my week"
        onClick={e => e.stopPropagation()} className="mx-auto my-3 w-full max-w-5xl rounded-2xl bg-white p-4 sm:p-6 shadow-xl space-y-5"
        data-testid="plan-my-week">
        <div className="flex justify-between items-start gap-3">
          <div><h2 className="font-display text-2xl font-bold">🐉 Plan My Week</h2>
            <p className="text-sm text-slate-600 mt-1">Your family's week, all in one place. Side-Quest checks what's already planned and finds unused lessons before suggesting anything new.</p></div>
          <button type="button" disabled={saving} onClick={onClose} aria-label="Close weekly planner" className="border rounded-lg p-2">✕</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">Week starting Monday
            <input className="input mt-1" type="date" value={week} disabled={saving}
              onChange={e => { if (e.target.value) { setWeek(monday(e.target.value)); setPlans(null); } }} data-testid="plan-week-start" />
          </label>
          <label className="text-sm font-semibold">Languages topic (when needed)
            <input className="input mt-1" value={topic} maxLength={140} disabled={saving}
              onChange={e => { setTopic(e.target.value); setPlans(null); setSelected([]); }}
              placeholder="Latin: greetings" />
          </label>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Who is learning this week?</p>
          <div className="flex flex-wrap gap-2">
            {students.map(s => <label key={s.id} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <input type="checkbox" className="mr-2" disabled={saving} checked={children.includes(s.id)}
                onChange={e => changeChildren(e.target.checked ? [...children, s.id] : children.filter(id => id !== s.id))} />
              {s.name}
            </label>)}
          </div>
        </div>
        {calendarError && <div role="alert" className="rounded-xl border border-red-300 p-4 text-sm">
          {calendarError}
          <button type="button" disabled={loading || saving} onClick={() => {
            setCalendarError("");
            api.get("/calendar", { params: { from: week, to: end } })
              .then(({ data }) => setCalendar(data || []))
              .catch(e => setCalendarError(apiErrorMessage(e, "Couldn't load this week's calendar")));
          }} className="ml-3 text-teal-800 font-semibold underline">Retry</button>
        </div>}
        {calendar && <>
          <div className="rounded-xl bg-stone-50 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">{dateLabel(week)} – {dateLabel(end)}</p>
              <p className="text-xs text-slate-600">{slots.length} learning times already in the calendar.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copyLastWeek} disabled={!children.length || saving || loading || copying}
                className="rounded-full bg-teal-800 text-white px-4 py-2 text-sm font-bold disabled:opacity-50"
                data-testid="plan-copy-week">
                {copying ? "Copying learning times…" : "Copy last week's times"}
              </button>
              <button type="button" onClick={() => setTimetableOpen(true)} disabled={!children.length || saving || copying}
                className="rounded-full border border-teal-700 text-teal-900 px-4 py-2 text-sm font-bold" data-testid="plan-adjust-times">
                {hasSlots ? "Adjust learning times" : "Choose different learning times"}
              </button>
            </div>
          </div>
          {!hasSlots && <div className="rounded-xl border border-dashed border-amber-400 p-4 text-sm">
            <p className="font-semibold">Use last week’s timetable, or choose your learning times.</p>
            <p className="mt-1 text-slate-600">Copy last week’s learning times in one tap, or choose different days and hours. Finished lessons and previous assignments are never copied.</p>
          </div>}
          <button type="button" onClick={() => refresh(true)} disabled={!hasSlots || !children.length || loading || saving || copying}
            className="w-full sm:w-auto rounded-full bg-teal-800 text-white font-bold px-6 py-3 disabled:opacity-50"
            data-testid="plan-review-week">{loading ? "Preparing your week…" : plans ? "Refresh my week" : "Find lessons for my week"}</button>
        </>}
        {plans && <div className="space-y-4" data-testid="plan-week-results">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {[[rows.filter(r => r.state === "scheduled").length, "Already scheduled"],
              [ready.length, "Ready to assign"], [missing.length + writing.length, "Need a lesson"],
              [reviewing.length + clashes.length + attention.length, "Need attention"]].map(([n, title]) =>
              <div key={title} className="rounded-lg bg-stone-50 p-3"><p className="text-xl font-bold">{n}</p><p className="text-xs">{title}</p></div>)}
          </div>
          {(writing.length > 0 || weekDraftsStopped()) && <div role="status" className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm text-violet-950" data-testid="plan-drafting">
            {writing.length > 0 && <p className="font-semibold">Writing {writing.length} lesson{writing.length === 1 ? "" : "s"}… each takes one to three minutes.</p>}
            {writing.length > 0 && <p className="text-xs mt-1">You can close this window and keep using Side-Quest. Finished drafts appear here, ready to review.</p>}
            {weekDraftsStopped() && <p className="mt-1 text-amber-900">Stopped: {weekDraftsStopped()}</p>}
          </div>}
          {reviewing.length > 0 && <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 flex flex-wrap items-center justify-between gap-2 text-sm" data-testid="plan-review-banner">
            <p><b>{reviewing.length} draft{reviewing.length === 1 ? "" : "s"} ready for your review.</b> Read each one, then put it into its timetable slot from the same page.</p>
            <Link to={weekReviewPath(reviewing[0].proposal.lesson.id, week, reviewing[0].child)} className="rounded-full bg-amber-600 px-4 py-2 text-white font-semibold" data-testid="plan-review-first">Start reviewing</Link>
          </div>}
          {children.map(child => {
            const mine = rows.filter(r => r.child === child);
            return <div key={child} className="rounded-xl border overflow-hidden">
              <h3 className="p-3 font-display font-bold bg-stone-50 border-b">{childName(child)}</h3>
              {!mine.length && <p className="p-3 text-sm text-slate-600">No learning times for this child yet. Adjust learning times above.</p>}
              <div className="divide-y">{mine.map(r => {
                const job = r.state === "missing" ? weekDraftState(r.proposal?.id) : "";
                const [status, colour] = job === "queued" || job === "writing" ? ["Writing the lesson…", "text-violet-800"]
                  : job === "failed" ? [`Draft failed: ${weekDraftError(r.proposal?.id)}`, "text-red-800"] : STATUS[r.state];
                return <div key={r.id} className="p-3 flex items-center gap-3" data-testid={`plan-row-${r.id}`}>
                  {r.state === "ready" && <input type="checkbox" aria-label={`Assign ${r.proposal.lesson.title} to ${childName(child)}`}
                    checked={selected.includes(r.id)} disabled={saving}
                    onChange={e => setSelected(v => e.target.checked ? [...v, r.id] : v.filter(id => id !== r.id))} />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{dateLabel(r.slot.date)} · {r.slot.start_time || "Flexible"} · {r.slot.title}</p>
                    <p className={`text-xs ${colour}`}>{status}{r.state === "ready" ? ` — ${r.proposal.lesson.title}` : ""}
                      {r.state === "review" ? ` — ${r.proposal.lesson.title}` : ""}
                      {r.state === "conflict" ? ` — overlaps ${r.conflict.title}` : ""}
                      {r.state === "attention" && r.proposal?.reason ? ` — ${r.proposal.reason}` : ""}</p>
                  </div>
                  {r.state === "review" && r.proposal?.lesson?.id &&
                    <Link to={weekReviewPath(r.proposal.lesson.id, week, child)} className="rounded-full border border-amber-500 px-3 py-1 text-xs font-semibold text-amber-900" data-testid={`plan-review-${r.id}`}>Review &amp; assign</Link>}
                  {job === "failed" && <button type="button" onClick={() => draftMissing(r)} className="text-xs font-semibold underline text-teal-900" data-testid={`plan-retry-${r.id}`}>Try again</button>}
                </div>;
              })}</div>
            </div>;
          })}
          <div className="flex flex-wrap gap-3 border-t pt-4">
            <button type="button" disabled={!chosen.length || saving} onClick={commit}
              className="rounded-full bg-teal-800 px-5 py-2.5 text-white text-sm font-bold disabled:opacity-50"
              data-testid="plan-assign-selected">Assign {chosen.length} ready lesson(s)</button>
            <button type="button" disabled={!missing.length || saving} onClick={() => draftMissing()}
              className="rounded-full border border-teal-800 px-4 py-2.5 text-teal-900 text-sm font-semibold disabled:opacity-50"
              data-testid="plan-draft-missing">Write {missing.length} missing lesson(s) with AI</button>
          </div>
          <p className="text-xs text-slate-600">No existing work will be overwritten. Drafts always need parent review, and the AI button uses your normal lesson allowance. Time conflicts and unclear matches aren't assigned automatically.</p>
        </div>}
        {!!errors.length && <div role="alert" className="rounded-lg border border-amber-300 p-3 text-sm">
          <p className="font-semibold">{errors.length} item(s) need attention</p>
          {errors.slice(0, 6).map((e, i) => <p key={i}>{e}</p>)}
        </div>}
        {progress && <p role="status" className="text-sm font-medium">{progress}</p>}
        {timetableOpen && <TimetableGenerator students={students.filter(s => children.includes(s.id))}
          events={calendar || []} initialWeek={week}
          onClose={() => setTimetableOpen(false)} onDone={() => { setTimetableOpen(false); onDone?.(week); refresh(true); }} />}
      </section>
    </div>
  );
}
