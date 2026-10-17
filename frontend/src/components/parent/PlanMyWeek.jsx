import React, { useEffect, useMemo, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";
import TimetableGenerator from "./TimetableGenerator";
import { buildWeeklyLessonRows } from "../../lib/weeklyLessonPlan";

const iso = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
const fromIso = date => new Date(date + "T12:00:00");
const monday = date => { const d = fromIso(date); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return iso(d); };
const plusDays = (date, n) => { const d = fromIso(date); d.setDate(d.getDate() + n); return iso(d); };
const dateLabel = date => fromIso(date).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
const STATUS = {
  scheduled: ["Already on the calendar", "text-emerald-800"],
  ready: ["Matching lesson ready", "text-teal-800"],
  missing: ["Needs a lesson", "text-amber-800"],
  review: ["Draft needs your review", "text-amber-800"],
  conflict: ["Time conflict", "text-red-800"],
  attention: ["Needs your choice", "text-amber-800"],
};

export default function PlanMyWeek({ students = [], initialDate, initialChild = "", onClose, onDone }) {
  const [week, setWeek] = useState(monday(initialDate || iso(new Date())));
  const [children, setChildren] = useState(initialChild ? [initialChild] : students.map(s => s.id));
  const [calendar, setCalendar] = useState(null);
  const [plans, setPlans] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const missing = rows.filter(r => r.state === "missing");
  const reviewing = rows.filter(r => r.state === "review");
  const clashes = rows.filter(r => r.state === "conflict");
  const slots = (calendar || []).filter(e => children.includes(e.student_id) &&
    (e.event_type === "timetable" || (e.event_type === "lesson" && String(e.notes || "").startsWith("Suggested by Side-Quest"))));
  const hasSlots = slots.length > 0;
  const [timetableOpen, setTimetableOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setCalendar(null); setPlans(null); setSelected([]); setErrors([]);
    api.get("/calendar", { params: { from: week, to: end } })
      .then(({ data }) => { if (active) setCalendar(data || []); })
      .catch(e => { if (active) toast.error(apiErrorMessage(e, "Couldn't load this week's calendar")); });
    return () => { active = false; };
  }, [week, end]);

  const refresh = async (replan = false) => {
    if (!children.length) return;
    setLoading(true); setErrors([]); setProgress("");
    try {
      const { data: entries } = await api.get("/calendar", { params: { from: week, to: end } });
      const updates = {};
      for (const child of children) {
        const { data } = replan
          ? await api.post("/auto-quest/plan", { student_id: child, from: week, to: end, topic: topic.trim() })
          : await api.get("/auto-quest/proposals", { params: { student_id: child, from: week, to: end } });
        updates[child] = data.proposals || [];
      }
      setCalendar(entries || []); setPlans(updates);
      const eligible = children.flatMap(child => buildWeeklyLessonRows(entries || [], updates[child] || [], child))
        .filter(r => r.state === "ready").map(r => r.id);
      setSelected(eligible);
    } catch (e) { toast.error(apiErrorMessage(e, "Couldn't review the learning week")); }
    finally { setLoading(false); }
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
      if (applied) { toast.success(`${applied} lesson(s) scheduled.`); onDone?.(); }
      if (failed.length) toast.error(`${failed.length} need attention. Nothing already assigned was replaced.`);
      setErrors(failed);
      await refresh(false);
    } catch (e) { toast.error(apiErrorMessage(e, "Couldn't finish checking your week")); }
    finally { setSaving(false); setProgress(""); }
  };

  const draftMissing = async () => {
    if (!missing.length || saving) return;
    if (missing.some(r => /^languages?\b/i.test(r.proposal?.learning_area || r.slot.title)) && !topic.trim()) {
      toast.error("Enter the language and topic first (for example, Latin greetings)."); return;
    }
    if (!window.confirm(`Create ${missing.length} AI draft(s)? This uses your normal allowance. You'll review each draft before it's assigned.`)) return;
    setSaving(true); setErrors([]);
    const failed = [];
    let drafted = 0;
    try {
      for (const [i, row] of missing.entries()) {
        setProgress(`Drafting lesson ${i + 1} of ${missing.length}…`);
        try { await api.post(`/auto-quest/proposals/${row.proposal.id}/generate`, { topic: topic.trim() }); drafted++; }
        catch (e) {
          failed.push(`${row.slot.title} (${dateLabel(row.slot.date)}): ${apiErrorMessage(e)}`);
          if ([402, 429].includes(e.response?.status)) break;
        }
      }
      if (drafted) toast.success(`${drafted} draft(s) saved to your library for review.`);
      setErrors(failed);
      await refresh(false);
    } catch (e) { toast.error(apiErrorMessage(e, "Couldn't refresh your week")); }
    finally { setSaving(false); setProgress(""); }
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
        {calendar && <>
          <div className="rounded-xl bg-stone-50 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">{dateLabel(week)} – {dateLabel(end)}</p>
              <p className="text-xs text-slate-600">{slots.length} learning times already in the calendar.</p>
            </div>
            <button type="button" onClick={() => setTimetableOpen(true)} disabled={!children.length || saving}
              className="rounded-full border border-teal-700 text-teal-900 px-4 py-2 text-sm font-bold">
              {hasSlots ? "Adjust learning times" : "Set up learning times"}
            </button>
          </div>
          {!hasSlots && <div className="rounded-xl border border-dashed border-amber-400 p-4 text-sm">
            <p className="font-semibold">First, choose when your children learn.</p>
            <p className="mt-1 text-slate-600">Set your learning days and available hours once, then Side-Quest can suggest the right lessons for each time. No lessons will be assigned yet.</p>
          </div>}
          <button type="button" onClick={() => refresh(true)} disabled={!hasSlots || !children.length || loading || saving}
            className="w-full sm:w-auto rounded-full bg-teal-800 text-white font-bold px-6 py-3 disabled:opacity-50"
            data-testid="plan-review-week">{loading ? "Preparing your week…" : plans ? "Refresh my week" : "Find lessons for my week"}</button>
        </>}
        {plans && <div className="space-y-4" data-testid="plan-week-results">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {[[rows.filter(r => r.state === "scheduled").length, "Already scheduled"],
              [ready.length, "Ready to assign"], [missing.length, "Need a lesson"],
              [reviewing.length + clashes.length, "Need attention"]].map(([n, title]) =>
              <div key={title} className="rounded-lg bg-stone-50 p-3"><p className="text-xl font-bold">{n}</p><p className="text-xs">{title}</p></div>)}
          </div>
          {children.map(child => {
            const mine = rows.filter(r => r.child === child);
            return <div key={child} className="rounded-xl border overflow-hidden">
              <h3 className="p-3 font-display font-bold bg-stone-50 border-b">{childName(child)}</h3>
              {!mine.length && <p className="p-3 text-sm text-slate-600">No learning times for this child yet. Adjust learning times above.</p>}
              <div className="divide-y">{mine.map(r => {
                const [status, colour] = STATUS[r.state];
                return <div key={r.id} className="p-3 flex items-center gap-3" data-testid={`plan-row-${r.id}`}>
                  {r.state === "ready" && <input type="checkbox" aria-label={`Assign ${r.proposal.lesson.title} to ${childName(child)}`}
                    checked={selected.includes(r.id)} disabled={saving}
                    onChange={e => setSelected(v => e.target.checked ? [...v, r.id] : v.filter(id => id !== r.id))} />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{dateLabel(r.slot.date)} · {r.slot.start_time || "Flexible"} · {r.slot.title}</p>
                    <p className={`text-xs ${colour}`}>{status}{r.state === "ready" ? ` — ${r.proposal.lesson.title}` : ""}
                      {r.state === "review" ? ` — ${r.proposal.lesson.title}` : ""}
                      {r.state === "conflict" ? ` — overlaps ${r.conflict.title}` : ""}</p>
                  </div>
                  {r.state === "review" && r.proposal?.lesson?.id &&
                    <a href={`/parent/lessons/${r.proposal.lesson.id}/edit`} className="text-xs font-semibold underline text-teal-900">Review draft</a>}
                </div>;
              })}</div>
            </div>;
          })}
          <div className="flex flex-wrap gap-3 border-t pt-4">
            <button type="button" disabled={!chosen.length || saving} onClick={commit}
              className="rounded-full bg-teal-800 px-5 py-2.5 text-white text-sm font-bold disabled:opacity-50"
              data-testid="plan-assign-selected">Assign {chosen.length} ready lesson(s)</button>
            <button type="button" disabled={!missing.length || saving} onClick={draftMissing}
              className="rounded-full border border-teal-800 px-4 py-2.5 text-teal-900 text-sm font-semibold disabled:opacity-50"
              data-testid="plan-draft-missing">Draft {missing.length} missing lesson(s)</button>
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
          onClose={() => setTimetableOpen(false)} onDone={() => { setTimetableOpen(false); onDone?.(); refresh(true); }} />}
      </section>
    </div>
  );
}
