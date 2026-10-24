import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, Sparkles, Pencil, Bookmark, Printer } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";
import ScheduleModal from "../../components/parent/ScheduleModal";
import LessonDocument from "../../components/parent/LessonDocument";
import LessonPrintActions from "../../components/parent/LessonPrintActions";
import VideoSuggestions from "../../components/parent/VideoSuggestions";
import OutcomePanel from "../../components/parent/OutcomePanel";
import { BatchNav, draftsPath } from "./LessonDrafts";
import { weekReviewPath } from "../../components/parent/PlanMyWeek";

const plusDays = (date, n) => { const d = new Date(date + "T12:00:00"); d.setDate(d.getDate() + n); return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-"); };
const slotLabel = (date, time) => new Date(date + "T12:00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" }) + (time ? `, ${time}` : "");

/** Shown at the top of a draft opened from Plan My Week: back to the planner, and the week's other drafts to review. */
function WeekNav({ week, child, childName, drafts, lessonId }) {
  const pos = drafts.findIndex(d => d.lesson.id === lessonId);
  const prev = pos > 0 ? drafts[pos - 1] : null, next = pos >= 0 && pos < drafts.length - 1 ? drafts[pos + 1] : null;
  const btn = "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold flex items-center gap-1";
  return (
    <nav className="rounded-2xl border border-teal-200 bg-teal-50/70 p-3 flex flex-wrap items-center gap-2" aria-label="Drafts for this week" data-testid="week-nav">
      <Link to={`/parent/calendar?plan=${week}&child=${child}`} className={btn} data-testid="week-nav-back"><ArrowLeft size={14} /> Plan My Week</Link>
      <span className="text-sm text-teal-900 mr-auto" data-testid="week-nav-pos">
        {pos >= 0 ? <>Draft <b>{pos + 1}</b> of {drafts.length} to review</> : "Draft"} · {childName ? `${childName}'s` : "the"} week of {slotLabel(week)}
      </span>
      {prev ? <Link to={weekReviewPath(prev.lesson.id, week, child)} className={btn} data-testid="week-nav-prev"><ArrowLeft size={14} /> Previous</Link> : <span className={`${btn} opacity-40`}><ArrowLeft size={14} /> Previous</span>}
      {next ? <Link to={weekReviewPath(next.lesson.id, week, child)} className={btn} data-testid="week-nav-next">Next <ArrowRight size={14} /></Link> : <span className={`${btn} opacity-40`}>Next <ArrowRight size={14} /></span>}
    </nav>
  );
}

const PARTS = [["", "Whole lesson (the AI decides)"], ["sections", "The explanations"], ["worked_examples", "Worked examples"], ["guided_practice", "Practice questions"], ["activities", "Activities"], ["questions", "Written questions"], ["quiz", "The quiz"], ["introduction", "The introduction"], ["consolidation", "The wrap-up"]];
const CHIPS = [
  ["Make this easier", "Make this less difficult. Use simpler language and smaller steps.", ""],
  ["Make this harder", "Make this more challenging for a confident child.", ""],
  ["More worked examples", "Add more worked examples, each fully worked through.", "worked_examples"],
  ["Different theme", "Use a dinosaur theme for the examples and activities.", ""],
  ["Hands-on activity", "Replace activity 2 with a practical hands-on task using household items.", "activities"],
  ["Add a worksheet", "Add a worksheet-style activity with 10 questions that practise exactly what was taught.", "activities"],
  ["Shorten it", "Make this lesson shorter and more focused.", ""],
];

const FIRST = ["title", "heading", "prompt", "question", "ask", "mistake"];
function summarise(v) {
  if (v == null || v === "") return "(nothing)";
  if (typeof v === "string") return v.length > 500 ? `${v.slice(0, 500)}…` : v;
  if (Array.isArray(v)) {
    if (!v.length) return "(nothing)";
    return v.map((x, i) => {
      if (typeof x === "string") return `${i + 1}. ${x}`;
      const k = FIRST.find(f => x && x[f]);
      return `${i + 1}. ${k ? String(x[k]).slice(0, 140) : "(item)"}`;
    }).join("\n");
  }
  return JSON.stringify(v).slice(0, 300);
}
const NAMES = { sections: "Explanations", worked_examples: "Worked examples", guided_practice: "Practice questions", activities: "Activities", questions: "Written questions", quiz: "Quiz", introduction: "Introduction", consolidation: "Wrap-up", title: "Title", answer_key: "Answer key", parent_script: "Teaching script", misconceptions: "Common mistakes", texts: "Readings", objectives: "Learning goals", teaching_questions: "Questions to ask", support: "Support ideas", extension: "Challenge", teaching_plan: "Teaching plan", why_it_matters: "Why it matters", materials: "Materials", prior_knowledge: "Prior knowledge", evidence_suggestions: "Evidence ideas" };

export function RefinePanel({ lessonId, onApplied, onClose }) {
  const [text, setText] = useState("");
  const [part, setPart] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [proposal, setProposal] = useState(null);
  const [left, setLeft] = useState(null);
  useEffect(() => { api.get("/ai/status").then(r => setLeft(r.data.usage)).catch(() => {}); }, []);
  const ask = async () => {
    setErr(""); setBusy(true); setProposal(null);
    try {
      const r = await api.post("/ai/lesson-refine", { lesson_id: lessonId, instruction: text, target: part ? [part] : [] });
      setProposal(r.data); setLeft(r.data.usage);
    } catch (e) { setErr(e.response?.data?.detail || "Could not make that change. Your lesson is unchanged."); }
    finally { setBusy(false); }
  };
  const accept = async () => {
    setBusy(true);
    try { const r = await api.post(`/lessons/${lessonId}/apply-patch`, { patch: proposal.patch }); toast.success("Change applied"); setProposal(null); setText(""); onApplied(r.data); }
    catch (e) { setErr(e.response?.data?.detail || "Could not apply the change."); }
    finally { setBusy(false); }
  };
  return (
    <div className="rounded-2xl border border-violet-300 bg-violet-50/70 p-4 space-y-3" data-testid="refine-panel">
      <div className="flex items-center justify-between"><p className="font-semibold text-violet-900 flex items-center gap-1"><Sparkles size={16} /> What would you like to change?</p><button onClick={onClose} className="text-sm underline">Close</button></div>
      <div className="flex flex-wrap gap-2">
        {CHIPS.map(([label, t, p]) => <button key={label} onClick={() => { setText(t); setPart(p); }} className="rounded-full border border-violet-300 bg-white px-3 py-1 text-xs font-semibold" data-testid="refine-chip">{label}</button>)}
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={2} maxLength={600} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" placeholder='Tell Side-Quest what to change, e.g. "Use a dinosaur theme" or "Add a harder worked example"' data-testid="refine-text" />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2">Change only: <select value={part} onChange={e => setPart(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1" data-testid="refine-part">{PARTS.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></label>
        <button disabled={busy || text.trim().length < 3} onClick={ask} className="rounded-full bg-violet-700 text-white px-4 py-1.5 font-semibold disabled:opacity-50" data-testid="refine-go">{busy && !proposal ? "Working on it… up to a minute" : "Show me the change"}</button>
        {left && <span className="text-xs text-slate-600">{left.unlimited ? "AI changes: unlimited for owner testing" : `AI changes left today: ${Math.max(0, left.changes_limit_per_day - left.changes_today)}`}</span>}
      </div>
      {err && <p role="alert" className="text-sm text-rose-700" data-testid="refine-error">{err}</p>}
      {proposal && (
        <div className="space-y-3 rounded-xl bg-white border border-violet-200 p-3" data-testid="refine-proposal">
          <p className="text-sm font-semibold">Nothing has changed yet. Here is what would change:</p>
          {proposal.keys.map(k => (
            <div key={k} className="grid md:grid-cols-2 gap-2 text-xs">
              <div><p className="font-bold text-slate-500 uppercase tracking-wide">{NAMES[k] || k}: now</p><pre className="whitespace-pre-wrap font-sans bg-slate-50 rounded p-2 max-h-48 overflow-auto">{summarise(proposal.before[k])}</pre></div>
              <div><p className="font-bold text-emerald-700 uppercase tracking-wide">{NAMES[k] || k}: proposed</p><pre className="whitespace-pre-wrap font-sans bg-emerald-50 rounded p-2 max-h-48 overflow-auto">{summarise(proposal.patch[k])}</pre></div>
            </div>
          ))}
          {proposal.warnings?.length > 0 && <ul className="list-disc pl-5 text-xs text-amber-900">{proposal.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>}
          <div className="flex gap-2">
            <button disabled={busy} onClick={accept} className="rounded-full bg-emerald-700 text-white px-4 py-1.5 text-sm font-semibold disabled:opacity-50" data-testid="refine-accept">Use this change</button>
            <button disabled={busy} onClick={() => setProposal(null)} className="rounded-full border border-slate-400 bg-white px-4 py-1.5 text-sm font-semibold" data-testid="refine-reject">Keep what I had</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LessonReview() {
  const { id } = useParams();
  const loc = useLocation();
  const nav = useNavigate();
  // Opened from a set of AI lessons: keep the parent inside that set (it survives refreshes because it is in the URL).
  const [params] = useSearchParams();
  const batchId = params.get("batch") || "";
  const [batch, setBatch] = useState(null);
  useEffect(() => { if (batchId) api.get(`/ai/batches/${batchId}`).then(r => setBatch(r.data)).catch(() => setBatch(null)); }, [batchId, id]);
  const batchChild = batch?.student?.id || "";
  // Opened from Plan My Week: the draft belongs to one timetable slot, so it can be reviewed and put there in one step.
  const week = /^\d{4}-\d{2}-\d{2}$/.test(params.get("week") || "") ? params.get("week") : "";
  const weekChild = week ? params.get("child") || "" : "";
  const [weekPlan, setWeekPlan] = useState(null);
  useEffect(() => {
    if (!week || !weekChild) return;
    const to = plusDays(week, 6);
    Promise.all([
      api.get("/auto-quest/proposals", { params: { student_id: weekChild, from: week, to } }),
      api.get("/calendar", { params: { from: week, to } }),
    ]).then(([p, c]) => setWeekPlan({ proposals: p.data?.proposals || [], events: c.data || [] })).catch(() => setWeekPlan(null));
  }, [week, weekChild, id]);
  const startOf = p => weekPlan?.events.find(e => e.id === p.calendar_event_id)?.start_time || "";
  const weekDrafts = (weekPlan?.proposals || [])
    .filter(p => p.status === "proposed" && p.lesson && p.lesson.status !== "ready")
    .sort((a, b) => a.date.localeCompare(b.date) || startOf(a).localeCompare(startOf(b)));
  const slot = (weekPlan?.proposals || []).find(p => p.status === "proposed" && p.lesson?.id === id) || null;
  // How the lesson was made (child, year, length, warnings) normally arrives with the navigation and is lost on a
  // refresh or when moving between lessons. Lessons in a set keep it on the server, so every one of them gets the same
  // review as a single lesson, including the automatic video suggestions.
  const item = batch?.items.find(i => i.lesson_id === id);
  const info = loc.state || (item ? { ...item.meta, studentId: batchChild || undefined } : {});
  const planHome = `/parent/calendar?plan=${week}&child=${weekChild}`;
  const home = batchId ? draftsPath(batchId) : week ? planHome : "/parent/lessons";
  const [lesson, setLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const [err, setErr] = useState("");
  const [refine, setRefine] = useState(false);
  const [assign, setAssign] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => { setLesson(null); setErr(""); setAssign(null); setRefine(false); return api.get(`/lessons/${id}`).then(r => setLesson(r.data)).catch(e => setErr(e.response?.data?.detail || "Could not open this lesson")); }, [id]);
  useEffect(() => { load(); api.get("/students").then(r => setStudents(r.data)).catch(() => {}); }, [load]);

  const approve = async () => {
    setBusy(true);
    try {
      const r = await api.put(`/lessons/${id}`, { ...lesson, status: "ready" });
      setLesson(r.data);
      setAssign(r.data);
    } catch (e) { toast.error(e.response?.data?.detail || "Could not save this lesson"); }
    finally { setBusy(false); }
  };

  const childName = (students.find(s => s.id === weekChild)?.name || "").split(" ")[0];
  const putInSlot = async () => {
    setBusy(true);
    try {
      // The server turns the reviewed draft into a saved lesson and assigns it to this exact slot.
      await api.post(`/auto-quest/proposals/${slot.id}/approve`, { confirm_reviewed: true });
      toast.success(`Added to ${childName || "your child"}'s timetable: ${slotLabel(slot.date, startOf(slot))}`);
      const next = weekDrafts.find(d => d.lesson.id !== id && d.id !== slot.id);
      nav(next ? weekReviewPath(next.lesson.id, week, weekChild) : planHome);
    } catch (e) { toast.error(apiErrorMessage(e, "Could not add this lesson to the timetable")); }
    finally { setBusy(false); }
  };

  if (err) return <div className="p-8 text-rose-700" role="alert">{err}{(batchId || week) && <> <Link to={home} className="underline">{week ? "Back to Plan My Week" : "Back to all drafts"}</Link></>}</div>;
  if (!lesson) return <div className="p-8 text-sm text-slate-500">Loading…</div>;
  const a = info.assumptions || {};
  const flags = (lesson.ai_flags || []).concat((info.warnings || []).filter(w => !(lesson.ai_flags || []).includes(w)));
  const btn = "rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50";
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-5xl" data-testid="lesson-review">
      {batchId ? <BatchNav batch={batch} batchId={batchId} lessonId={id} />
        : week ? <WeekNav week={week} child={weekChild} childName={childName} drafts={weekDrafts} lessonId={id} />
        : <Link to="/parent/lessons" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"><ArrowLeft size={14} /> My lessons</Link>}
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Here is your lesson</h1>
        <p className="text-sm text-slate-600 mt-1" data-testid="review-assumptions">
          {[a.child && `Made for ${a.child}`, a.year, a.minutes && `${a.minutes} minutes`, a.delivery, a.theme && `${a.theme} theme`].filter(Boolean).join(" · ") || "Read it through, then choose what to do next."}
          {" "}Not what you meant? Use <b>Ask AI to change something</b>.
        </p>
      </div>
      <div className="rounded-2xl border border-[#D4C8A8] bg-white p-4 space-y-2" data-testid="review-paper-options">
        <p className="text-sm font-bold text-[#1F3B2D]">Prefer paper? Print this lesson without assigning it first.</p>
        <LessonPrintActions lessonId={id} compact studentTestId="review-print-student" parentTestId="review-print-parent" />
      </div>
      {info.generation?.calls > 0 && (
        <p className="text-xs text-slate-500" data-testid="gen-report">Written in {info.generation.stages.filter(x => x !== "repair").length} steps ({info.generation.stages.includes("repair") ? "plus one correction" : "no corrections needed"}){Number.isFinite(info.generation.elapsed_ms) ? ` in ${(info.generation.elapsed_ms / 1000).toFixed(1)} seconds` : ""}{info.generation.est_cost_us_cents != null ? `, an AI cost of about ${info.generation.est_cost_us_cents} US cents` : ""}.</p>
      )}
      {lesson.ai_generated && lesson.status !== "ready" && (
        <p className="rounded-lg border border-violet-300 bg-violet-50 px-3 py-2 text-sm text-violet-900" data-testid="ai-banner">
          <b>AI-generated draft.</b> Have a read before your child sees it. It has not been checked against any curriculum, and it can make mistakes.
        </p>
      )}
      {flags.length > 0 && lesson.status !== "ready" && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900" data-testid="ai-warnings">
          <b>Worth a look:</b><ul className="list-disc pl-5 mt-1">{flags.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>
      )}

      <div className="sticky top-0 z-20 -mx-1 px-1 py-2 bg-[#F5EFE0]/95 backdrop-blur flex flex-wrap gap-2" data-testid="review-actions">
        {slot
          ? <button disabled={busy} onClick={putInSlot} className={`${btn} bg-emerald-700 text-white`} data-testid="r-week-assign"><CalendarCheck size={16} /> Looks good — add to {slotLabel(slot.date, startOf(slot))} ({slot.learning_area})</button>
          : <button disabled={busy} onClick={approve} className={`${btn} bg-emerald-700 text-white`} data-testid="r-assign"><CheckCircle2 size={16} /> Looks Good — Assign</button>}
        <button onClick={() => setRefine(r => !r)} className={`${btn} bg-violet-700 text-white`} data-testid="r-refine"><Sparkles size={16} /> Ask AI to Change Something</button>
        <button onClick={() => nav(`/parent/lessons/${id}/edit${batchId ? `?batch=${batchId}` : week ? `?week=${week}&child=${weekChild}` : ""}`)} className={`${btn} border border-slate-900 bg-white`} data-testid="r-edit"><Pencil size={16} /> Edit Manually</button>
        <button onClick={() => { toast.success(batchId ? "Kept as a draft with the rest of this set" : week ? "Kept as a draft in its timetable slot" : "Saved in your lessons as a draft"); nav(home); }} className={`${btn} border border-slate-400 bg-white`} data-testid="r-later"><Bookmark size={16} /> Save for Later</button>
        <LessonPrintActions lessonId={id} compact studentTestId="r-print" parentTestId="r-print-parent" />
      </div>

      {refine && <RefinePanel key={id} lessonId={id} onApplied={l => { setLesson(l); }} onClose={() => setRefine(false)} />}

      <OutcomePanel key={lesson.id} lesson={lesson} onSaved={setLesson} />

      <VideoSuggestions key={lesson.id} lesson={lesson} onSaved={setLesson} auto={!!info.assumptions} />

      <LessonDocument lesson={lesson} view="parent" />

      {assign && <ScheduleModal lesson={assign} students={students} defaultStudents={info.studentId ? [info.studentId] : batchChild ? [batchChild] : []} onClose={() => setAssign(null)} onDone={() => nav(batchId ? home : "/parent/assignments")} />}
    </div>
  );
}
