import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Sparkles, Pencil, Bookmark, Printer } from "lucide-react";
import { api } from "../../lib/api";
import ScheduleModal from "../../components/parent/ScheduleModal";
import LessonDocument from "../../components/parent/LessonDocument";
import VideoSuggestions from "../../components/parent/VideoSuggestions";
import OutcomePanel from "../../components/parent/OutcomePanel";

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
        {left && <span className="text-xs text-slate-600">AI changes left today: {Math.max(0, left.changes_limit_per_day - left.changes_today)}</span>}
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
  const info = loc.state || {};
  const [lesson, setLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const [err, setErr] = useState("");
  const [refine, setRefine] = useState(false);
  const [assign, setAssign] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => api.get(`/lessons/${id}`).then(r => setLesson(r.data)).catch(e => setErr(e.response?.data?.detail || "Could not open this lesson")), [id]);
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

  if (err) return <div className="p-8 text-rose-700" role="alert">{err}</div>;
  if (!lesson) return <div className="p-8 text-sm text-slate-500">Loading…</div>;
  const a = info.assumptions || {};
  const flags = (lesson.ai_flags || []).concat((info.warnings || []).filter(w => !(lesson.ai_flags || []).includes(w)));
  const btn = "rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50";
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-5xl" data-testid="lesson-review">
      <Link to="/parent/lessons" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"><ArrowLeft size={14} /> My lessons</Link>
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Here is your lesson</h1>
        <p className="text-sm text-slate-600 mt-1" data-testid="review-assumptions">
          {[a.child && `Made for ${a.child}`, a.year, a.minutes && `${a.minutes} minutes`, a.delivery, a.theme && `${a.theme} theme`].filter(Boolean).join(" · ") || "Read it through, then choose what to do next."}
          {" "}Not what you meant? Use <b>Ask AI to change something</b>.
        </p>
      </div>
      {info.generation?.calls > 0 && (
        <p className="text-xs text-slate-500" data-testid="gen-report">Written in {info.generation.stages.filter(x => x !== "repair").length} steps ({info.generation.stages.includes("repair") ? "plus one correction" : "no corrections needed"}){info.generation.est_cost_us_cents != null ? `, an AI cost of about ${info.generation.est_cost_us_cents} US cents` : ""}.</p>
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
        <button disabled={busy} onClick={approve} className={`${btn} bg-emerald-700 text-white`} data-testid="r-assign"><CheckCircle2 size={16} /> Looks Good — Assign</button>
        <button onClick={() => setRefine(r => !r)} className={`${btn} bg-violet-700 text-white`} data-testid="r-refine"><Sparkles size={16} /> Ask AI to Change Something</button>
        <button onClick={() => nav(`/parent/lessons/${id}/edit`)} className={`${btn} border border-slate-900 bg-white`} data-testid="r-edit"><Pencil size={16} /> Edit Manually</button>
        <button onClick={() => { toast.success("Saved in your lessons as a draft"); nav("/parent/lessons"); }} className={`${btn} border border-slate-400 bg-white`} data-testid="r-later"><Bookmark size={16} /> Save for Later</button>
        <a href={`/print/lesson/${id}`} target="_blank" rel="noreferrer" className={`${btn} border border-slate-400 bg-white`} data-testid="r-print"><Printer size={16} /> Printable version</a>
      </div>

      {refine && <RefinePanel lessonId={id} onApplied={l => { setLesson(l); }} onClose={() => setRefine(false)} />}

      <OutcomePanel lesson={lesson} onSaved={setLesson} />

      <VideoSuggestions lesson={lesson} onSaved={setLesson} auto={!!info.assumptions} />

      <LessonDocument lesson={lesson} view="parent" />

      {assign && <ScheduleModal lesson={assign} students={students} defaultStudents={info.studentId ? [info.studentId] : []} onClose={() => setAssign(null)} onDone={() => nav("/parent/assignments")} />}
    </div>
  );
}
