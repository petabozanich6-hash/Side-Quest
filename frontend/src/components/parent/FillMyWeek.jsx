import React, { useMemo, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";
import { buildWeeklyLessonRows } from "../../lib/weeklyLessonPlan";

const iso = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
const mondayOf = d => {
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  day.setDate(day.getDate() - ((day.getDay() + 6) % 7));
  return iso(day);
};
const shiftDays = (date, n) => {
  const [y,m,d] = date.split("-").map(Number);
  return iso(new Date(y, m - 1, d + n));
};
const label = date => new Date(date + "T12:00:00").toLocaleDateString("en-AU", { weekday:"short", day:"numeric", month:"short" });
const STATUS = {
  scheduled: ["Already scheduled", "text-emerald-800"],
  ready: ["Ready in library", "text-teal-800"],
  missing: ["Needs a lesson", "text-amber-800"],
  review: ["Draft needs review", "text-amber-800"],
  conflict: ["Time conflict", "text-red-800"],
  attention: ["Needs attention", "text-amber-800"]
};

export default function FillMyWeek({ students = [], initialChild = "", initialDate, onClose, onDone, onOpenDay }) {
  const [studentId, setStudentId] = useState(initialChild || students[0]?.id || "");
  const [weekStart, setWeekStart] = useState(mondayOf(initialDate ? new Date(initialDate + "T12:00:00") : new Date()));
  const [topic, setTopic] = useState("");
  const [plan, setPlan] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [progress, setProgress] = useState(null);
  const weekEnd = shiftDays(weekStart, 6);
  const rows = useMemo(() => plan
    ? buildWeeklyLessonRows(plan.events, plan.proposals, studentId) : [], [plan, studentId]);
  const candidates = rows.filter(r => r.state === "ready");
  const chosen = candidates.filter(r => selected.includes(r.id));
  const missing = rows.filter(r => r.state === "missing");
  const pendingReview = rows.filter(r => r.state === "review");
  const clashes = rows.filter(r => r.state === "conflict");

  const changeWeek = value => { setWeekStart(mondayOf(new Date(value + "T12:00:00"))); setPlan(null); setSelected([]); setProgress(null); };
  const changeChild = value => { setStudentId(value); setPlan(null); setSelected([]); setProgress(null); };
  const preview = async () => {
    if (!studentId || loading || applying) return;
    setLoading(true); setProgress(null);
    try {
      // The planner saves suggested matches, NOT assignments or AI drafts.
      const [proposals, calendar] = await Promise.all([
        api.post("/auto-quest/plan", { student_id: studentId, from: weekStart, to: weekEnd, topic: topic.trim() }),
        api.get("/calendar", { params: { from: weekStart, to: weekEnd } })
      ]);
      const view = { proposals: proposals.data?.proposals || [], events: calendar.data || [] };
      setPlan(view);
      setSelected(buildWeeklyLessonRows(view.events, view.proposals, studentId)
        .filter(r => r.state === "ready").map(r => r.id));
    } catch (e) { toast.error(apiErrorMessage(e, "Couldn't prepare this week's preview")); }
    finally { setLoading(false); }
  };
  const refresh = async () => {
    const [pr, ev] = await Promise.all([
      api.get("/auto-quest/proposals", { params: { student_id: studentId, from: weekStart, to: weekEnd } }),
      api.get("/calendar", { params: { from: weekStart, to: weekEnd } })
    ]);
    const view = { proposals: pr.data?.proposals || [], events: ev.data || [] };
    setPlan(view);
    setSelected(buildWeeklyLessonRows(view.events, view.proposals, studentId)
      .filter(r => r.state === "ready").map(r => r.id));
  };
  const apply = async () => {
    if (!chosen.length || applying || loading) return;
    if (!window.confirm(`Assign ${chosen.length} unused library lesson(s) to ${students.find(x => x.id === studentId)?.name || "this child"} for ${label(weekStart)}–${label(weekEnd)}? Existing work will stay untouched.`)) return;
    setApplying(true);
    let applied = 0, failed = 0;
    try {
      // Recheck before any write, so changes made in another tab don't silently
      // turn this preview into a different set of assignments.
      const [currentProposals, currentCalendar] = await Promise.all([
        api.get("/auto-quest/proposals", { params: { student_id: studentId, from: weekStart, to: weekEnd } }),
        api.get("/calendar", { params: { from: weekStart, to: weekEnd } })
      ]);
      const freshRows = buildWeeklyLessonRows(currentCalendar.data || [], currentProposals.data?.proposals || [], studentId);
      const stale = chosen.some(old => {
        const fresh = freshRows.find(row => row.id === old.id);
        return !fresh || fresh.state !== "ready" || fresh.proposal?.id !== old.proposal?.id ||
          fresh.proposal?.lesson?.id !== old.proposal?.lesson?.id;
      });
      if (stale) {
        setPlan({ events: currentCalendar.data || [], proposals: currentProposals.data?.proposals || [] });
        setSelected([]);
        toast.error("Your timetable or lesson assignments have changed. Review the updated week before confirming.");
        return;
      }
      for (let i = 0; i < chosen.length; i++) {
        const row = chosen[i];
        setProgress({ completed: i, total: chosen.length, applied, failed, message: `Assigning ${row.proposal.lesson.title}…` });
        try {
          await api.post(`/auto-quest/proposals/${row.proposal.id}/approve`, {});
          applied++;
        } catch (error) {
          failed++;
          // Each approval checks the child and empty slot server-side.
          // Never retry automatically after an unknown outcome.
          toast.error(`${row.slot.title}, ${label(row.slot.date)}: ${apiErrorMessage(error, "Not assigned")}`);
        }
      }
      setProgress({ completed: chosen.length, total: chosen.length, applied, failed,
        message: `${applied} lesson(s) assigned · ${failed} need your attention.` });
      if (applied) { toast.success(`${applied} library lesson(s) added to the timetable.`); onDone?.(); }
      await refresh();
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't verify the week. Nothing new was scheduled by this attempt."));
    } finally { setApplying(false); }
  };
  const generate = async () => {
    if (!missing.length || applying || loading) return;
    if (missing.some(r => /^languages?\b/i.test(r.proposal?.learning_area || r.slot.title)) && !topic.trim()) {
      toast.error("Enter the language/topic (for example, Latin greetings) before generating those lessons.");
      return;
    }
    if (!window.confirm(`Create ${missing.length} AI draft(s) for the remaining sessions? This uses your AI allowance. Drafts must be reviewed before they're assigned.`)) return;
    setApplying(true); let created = 0, failed = 0;
    try {
      for (let i = 0; i < missing.length; i++) {
        const row = missing[i];
        setProgress({ completed:i, total:missing.length, applied:created, failed,
          message:`Drafting ${row.slot.title} (${i+1}/${missing.length})…` });
        try {
          await api.post(`/auto-quest/proposals/${row.proposal.id}/generate`, { topic: topic.trim() });
          created++;
        } catch(e) {
          failed++;
          toast.error(`${row.slot.title}: ${apiErrorMessage(e, "Draft failed")}`);
          if ([402,429].includes(e?.response?.status)) break;
        }
      }
      setProgress({ completed:created+failed, total:missing.length, applied:created, failed,
        message:`${created} draft(s) created for parent review · ${failed} error(s). Any remaining slots are unchanged.` });
      if(created) toast.success(`${created} draft(s) saved. Open their timetable slots to review before assigning.`);
      await refresh();
    } catch(e) { toast.error(apiErrorMessage(e,"Couldn't refresh the week")); }
    finally { setApplying(false); }
  };

  const days = Array.from({length:7}, (_,i)=>shiftDays(weekStart,i));
  return <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto" onClick={() => !applying && onClose()}>
    <section role="dialog" aria-modal="true" aria-label="Fill my week" data-testid="fill-week-modal"
      onClick={e=>e.stopPropagation()} className="mx-auto my-4 max-w-4xl bg-white rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
      <header className="flex gap-3 justify-between items-start">
        <div><h2 className="font-display text-2xl font-bold">⚔️ Fill My Week</h2>
          <p className="text-sm text-slate-600 mt-1">Choose a child and week. Side-Quest checks what's already scheduled, finds unused lessons for each subject, and shows you the plan before assigning anything.</p>
        </div>
        <button type="button" aria-label="Close Fill My Week" disabled={applying} onClick={onClose} className="border rounded-lg px-3 py-2 disabled:opacity-50">✕</button>
      </header>
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="text-sm font-semibold">Child
          <select data-testid="week-child" className="input mt-1" value={studentId}
            disabled={applying} onChange={e=>changeChild(e.target.value)}>
            <option value="">Choose a child</option>
            {students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">Week starting Monday
          <input data-testid="week-start" type="date" className="input mt-1" value={weekStart}
            disabled={applying} onChange={e=>changeWeek(e.target.value)}/>
        </label>
        <label className="text-sm font-semibold">Languages topic (if needed)
          <input data-testid="week-topic" className="input mt-1" maxLength={140} value={topic}
            disabled={applying} placeholder="Latin: greetings" onChange={e=>{setTopic(e.target.value);setPlan(null);setSelected([]);}} />
        </label>
      </div>
      <div className="flex gap-3 items-center flex-wrap">
        <button type="button" disabled={loading || applying || !studentId} onClick={preview}
          className="bg-teal-800 text-white rounded-full px-5 py-2.5 text-sm font-bold disabled:opacity-50" data-testid="week-preview">
          {loading ? "Checking the week…" : plan ? "Refresh the weekly plan" : "Review this week"}
        </button>
        <span className="text-xs text-slate-600">Planning is free: no AI drafts or assignments are created until you confirm.</span>
      </div>
      {plan && <div data-testid="week-plan" className="space-y-4">
        <div className="rounded-xl border bg-slate-50 p-3 flex flex-wrap gap-3 text-xs font-semibold" aria-live="polite">
          <span>{rows.filter(r=>r.state==="scheduled").length} already scheduled</span>
          <span>{candidates.length} library matches</span>
          <span>{missing.length} need new lessons</span>
          <span>{pendingReview.length} drafts to review</span>
          <span>{clashes.length} time conflicts</span>
        </div>
        {!rows.length && <p className="text-sm text-slate-700">There are no timetable slots this week. Use <strong>Weekly timetable</strong> to create the times first, then come back here.</p>}
        {days.map(date=>{
          const items=rows.filter(r=>r.slot.date===date);
          if(!items.length) return null;
          return <section key={date} className="rounded-xl border border-slate-200 overflow-hidden" data-testid={`week-day-${date}`}>
            <h3 className="bg-slate-50 border-b px-3 py-2 text-sm font-semibold">{label(date)}</h3>
            <div className="divide-y">{items.map(row=>{
              const [stateText,stateColour]=STATUS[row.state];
              return <div key={row.id} className="p-3 flex gap-3 justify-between items-start" data-testid={`week-row-${row.id}`}>
                <div className="flex items-start gap-2 min-w-0">
                  {row.state==="ready" && <input type="checkbox" className="mt-1" aria-label={`Assign ${row.proposal.lesson.title} on ${date}`}
                    checked={selected.includes(row.id)} disabled={applying}
                    onChange={e=>setSelected(current=>e.target.checked?[...current,row.id]:current.filter(x=>x!==row.id))} />}
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{row.slot.start_time || "Any time"} · {row.slot.title}{row.slot.duration_minutes ? ` · ${row.slot.duration_minutes} min` : ""}</p>
                    <p className={`text-xs font-semibold ${stateColour}`}>{stateText}
                      {row.state==="ready" ? ` — ${row.proposal.lesson.title}` : ""}
                      {row.state==="review" ? ` — ${row.proposal.lesson.title}` : ""}
                      {row.state==="conflict" ? ` — overlaps ${row.conflict.title}` : ""}
                    </p>
                    {row.state==="missing" && <p className="text-xs text-slate-600">No unused matching lesson in the library.</p>}
                  </div>
                </div>
                {(row.state==="review" || row.state==="attention" || row.state==="conflict" || row.state==="missing") &&
                  <button type="button" disabled={applying} onClick={()=>onOpenDay(date)} className="text-xs underline text-teal-800 shrink-0">Open day</button>}
              </div>;
            })}</div>
          </section>;
        })}
        {!!rows.length && <div className="flex flex-wrap gap-3 items-center border-t pt-4">
          <button type="button" onClick={apply} disabled={applying || loading || !chosen.length}
            data-testid="week-apply" className="bg-emerald-800 text-white rounded-full px-5 py-2.5 font-bold text-sm disabled:opacity-50">
            {applying ? "Working…" : `Assign ${chosen.length} selected library lesson(s)`}
          </button>
          <button type="button" onClick={generate} disabled={applying || loading || !missing.length}
            data-testid="week-generate" className="border border-teal-700 rounded-full px-4 py-2.5 text-sm disabled:opacity-50">Generate {missing.length} missing draft(s) (optional AI)</button>
          <p className="w-full text-xs text-slate-600">Existing assignments and completed lessons aren't changed. AI drafts are never assigned until you review them.</p>
        </div>}
      </div>}
      {progress && <div role="status" data-testid="week-progress" className="rounded-lg border p-3 text-sm">
        {progress.message}
        <progress aria-label="Weekly tasks processed" className="block w-full mt-2" value={progress.completed} max={progress.total || 1} />
      </div>}
    </section>
  </div>;
}
