import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, RotateCcw, Eye, Pencil, Send, EyeOff, BookOpen } from "lucide-react";
import { api } from "../../lib/api";
import { isoLocal } from "../../components/parent/ScheduleModal";
import { runBatch, isRunning, onBatchChange } from "../../lib/batchRunner";

// What each lesson in a set looks like to the parent. Uses the app's existing status pills.
export const STATE = {
  pending: { label: "Not written yet", pill: "pill-not-started" },
  generating: { label: "Generating", pill: "pill-in-progress" },
  failed: { label: "Failed to generate", pill: "pill-needs-help" },
  ready: { label: "Ready for review", pill: "pill-submitted" },
  saved: { label: "Edited · saved", pill: "pill-accepted" },
  assigned: { label: "Assigned", pill: "pill-completed" },
  archived: { label: "Archived", pill: "pill-not-started" },
};
const labelFor = i => (i.state === "saved" && i.lesson_status === "ready" ? "Saved to library" : STATE[i.state]?.label || i.state);
export const reviewPath = (bid, lessonId) => `/parent/lessons/${lessonId}/review?batch=${bid}`;
export const draftsPath = bid => `/parent/lessons/drafts/${bid}`;

/** Shown at the top of a lesson opened from a set: back to the whole set, and previous / next lesson. */
export function BatchNav({ batchId, lessonId }) {
  const [batch, setBatch] = useState(null);
  useEffect(() => { api.get(`/ai/batches/${batchId}`).then(r => setBatch(r.data)).catch(() => setBatch(null)); }, [batchId, lessonId]);
  if (!batch) return null;
  const open = batch.items.filter(i => i.lesson_id);
  const pos = open.findIndex(i => i.lesson_id === lessonId);
  const here = batch.items.find(i => i.lesson_id === lessonId);
  const prev = pos > 0 ? open[pos - 1] : null, next = pos >= 0 && pos < open.length - 1 ? open[pos + 1] : null;
  const btn = "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold flex items-center gap-1";
  return (
    <nav className="rounded-2xl border border-violet-200 bg-violet-50/70 p-3 flex flex-wrap items-center gap-2" aria-label="Lessons in this set" data-testid="batch-nav">
      <Link to={draftsPath(batchId)} className={btn} data-testid="batch-nav-all"><ArrowLeft size={14} /> All {batch.items.length} drafts</Link>
      <span className="text-sm text-violet-900 mr-auto" data-testid="batch-nav-pos">
        {here ? <>Lesson <b>{here.index + 1}</b> of {batch.items.length} · {batch.title}</> : batch.title}
      </span>
      {prev ? <Link to={reviewPath(batchId, prev.lesson_id)} className={btn} data-testid="batch-nav-prev"><ArrowLeft size={14} /> Lesson {prev.index + 1}</Link> : <span className={`${btn} opacity-40`}><ArrowLeft size={14} /> Previous</span>}
      {next ? <Link to={reviewPath(batchId, next.lesson_id)} className={btn} data-testid="batch-nav-next">Lesson {next.index + 1} <ArrowRight size={14} /></Link> : <span className={`${btn} opacity-40`}>Next <ArrowRight size={14} /></span>}
    </nav>
  );
}

function nextWeekdays(n) {
  const d = new Date(); const out = [];
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); // the coming Monday
  while (out.length < n) { if (d.getDay() !== 0 && d.getDay() !== 6) out.push(isoLocal(d)); d.setDate(d.getDate() + 1); }
  return out;
}

function BatchView({ id }) {
  const nav = useNavigate();
  const [batch, setBatch] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");
  const [writing, setWriting] = useState(isRunning(id));
  const [stopped, setStopped] = useState("");
  const resumed = useRef(false);

  const load = useCallback(() => api.get(`/ai/batches/${id}`).then(r => { setBatch(r.data); setErr(""); return r.data; })
    .catch(e => { setErr(e.response?.data?.detail || "Could not open these lessons. Please refresh."); return null; }), [id]);

  useEffect(() => onBatchChange((bid, info) => {
    if (bid !== id) return;
    if (info.phase === "stopped") setStopped(info.reason || "");
    if (info.phase === "done") setWriting(false);
    load();
  }), [id, load]);

  // After a refresh or coming back later: carry on writing the lessons that were never started.
  useEffect(() => {
    load().then(b => {
      if (!b || resumed.current) return;
      resumed.current = true;
      const todo = b.items.filter(i => i.state === "pending").map(i => i.index);
      if (todo.length && !isRunning(id)) { setWriting(true); runBatch(id, todo); }
    });
  }, [id, load]);

  // Another tab may be writing: keep the list fresh while anything is still generating.
  const generating = !!batch?.items.some(i => i.state === "generating");
  useEffect(() => { if (!generating || writing) return; const t = setInterval(load, 10000); return () => clearInterval(t); }, [generating, writing, load]);

  useEffect(() => {
    const warn = e => { if (isRunning(id)) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [id]);

  const retry = index => { setStopped(""); setWriting(true); runBatch(id, [index]); setTimeout(load, 300); };

  // Save (and assign) every remaining lesson. Always re-reads each lesson first so a parent's edits are never
  // replaced by an older copy, and skips anything already assigned so repeated clicks cannot duplicate work.
  const finishRest = async () => {
    const rest = batch.items.filter(i => i.lesson_id && (i.state === "ready" || i.state === "saved"));
    if (!rest.length) return;
    const student = batch.student;
    const dates = nextWeekdays(rest.length);
    setBusy("finish");
    try {
      for (let k = 0; k < rest.length; k++) {
        const { data: fresh } = await api.get(`/lessons/${rest[k].lesson_id}`);
        if (fresh.status !== "ready") await api.put(`/lessons/${fresh.id}`, { ...fresh, status: "ready" });
        if (student) {
          let created = true;
          try { await api.post("/assignments", { student_id: student.id, lesson_id: fresh.id, support_level: "green" }); }
          catch (e) { if (e.response?.data?.code !== "ALREADY_ASSIGNED") throw e; created = false; }
          if (created) await api.post("/calendar", { title: fresh.title, date: dates[k], event_type: "lesson", student_id: student.id, linked_lesson_id: fresh.id, duration_minutes: Number(fresh.duration_minutes) || 45, notes: "" });
        }
      }
      toast.success(student ? `Assigned to ${student.name}, one a day from next Monday` : "Saved to your library");
    } catch (e) { toast.error(e.response?.data?.detail || "Could not finish. Everything done so far is kept; you can try again."); }
    finally { setBusy(""); load(); }
  };

  const dismiss = async () => {
    if (!window.confirm("Hide this set from your Parent Hub? The lessons stay in My lessons.")) return;
    try { await api.post(`/ai/batches/${id}/dismiss`); toast.success("Hidden. The lessons are still in My lessons."); nav("/parent/lessons/drafts"); }
    catch (e) { toast.error(e.response?.data?.detail || "Could not hide this set"); }
  };

  if (err) return <div className="p-8 text-rose-700" role="alert">{err} <Link to="/parent/lessons/drafts" className="underline">See all lesson drafts</Link></div>;
  if (!batch) return <div className="p-8 text-sm text-slate-500">Loading…</div>;
  const c = batch.counts;
  const rest = batch.items.filter(i => i.lesson_id && (i.state === "ready" || i.state === "saved")).length;
  const btn = "rounded-full px-3 py-1.5 text-sm font-semibold flex items-center gap-1 disabled:opacity-50";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl space-y-5" data-testid="lesson-drafts">
      <Link to="/parent/lessons/drafts" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"><ArrowLeft size={14} /> All lesson drafts</Link>
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900" data-testid="drafts-heading"><span aria-hidden="true">🐉</span> Your AI Lesson Drafts — {batch.items.length} Lessons</h1>
        <p className="text-sm text-slate-600 mt-1">{batch.title}{batch.student ? ` · for ${batch.student.name}` : ""}. Open any lesson to read, edit or assign it; the others stay right here.</p>
      </div>

      {(writing || generating) && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4" role="status" data-testid="drafts-writing">
          <p className="font-semibold text-violet-900 flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Writing lessons… ({c.total - c.pending - c.generating} of {c.total} done)</p>
          <p className="text-xs text-slate-600 mt-1">Each lesson usually takes one to three minutes. You can open finished lessons now. If you close Side-Quest, the rest are written when you come back to this page.</p>
        </div>
      )}
      {stopped && <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">{stopped}</p>}

      <ol className="space-y-3" data-testid="drafts-list">
        {batch.items.map(i => (
          <li key={i.index} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-wrap items-center gap-3" data-testid={`draft-row-${i.index}`}>
            <div className="min-w-0 flex-1 basis-60">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Lesson {i.index + 1}</p>
              <p className="font-display font-bold text-slate-900">{i.title}</p>
              {i.goal && i.state !== "failed" && <p className="text-xs text-slate-500 mt-0.5">{i.goal}</p>}
              {i.state === "failed" && <p className="text-sm text-rose-700 mt-0.5" data-testid={`draft-error-${i.index}`}>{i.error}</p>}
              {i.state === "assigned" && <p className="text-xs text-emerald-800 mt-0.5">Assigned to {i.assigned_to.map(a => a.name || "your child").join(", ")}</p>}
              {i.state === "archived" && <p className="text-xs text-slate-500 mt-0.5">You archived this lesson. Restore it from My lessons (show archived).</p>}
            </div>
            <span className={`pill ${STATE[i.state]?.pill || "pill-not-started"}`} data-testid={`draft-state-${i.index}`}>
              {i.state === "generating" && <Loader2 size={12} className="animate-spin" />}{labelFor(i)}
            </span>
            <div className="flex flex-wrap gap-2">
              {i.lesson_id && i.state !== "archived" && <Link to={reviewPath(id, i.lesson_id)} className={`${btn} bg-violet-700 text-white`} data-testid={`draft-review-${i.index}`}><Eye size={14} /> Review</Link>}
              {i.lesson_id && (i.state === "ready" || i.state === "saved") && <Link to={`/parent/lessons/${i.lesson_id}/edit?batch=${id}`} className={`${btn} border border-slate-900 bg-white`} data-testid={`draft-edit-${i.index}`}><Pencil size={14} /> Edit</Link>}
              {i.state === "failed" && <button disabled={isRunning(id)} onClick={() => retry(i.index)} className={`${btn} border border-slate-900 bg-white`} data-testid={`draft-retry-${i.index}`}><RotateCcw size={14} /> Try this lesson again</button>}
              {i.state === "pending" && !isRunning(id) && <button onClick={() => retry(i.index)} className={`${btn} border border-slate-900 bg-white`} data-testid={`draft-write-${i.index}`}>Write it now</button>}
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-2 items-center">
        {rest > 0 && (
          <button disabled={busy === "finish"} onClick={finishRest} className="rounded-full bg-emerald-700 text-white px-5 py-2.5 text-sm font-semibold flex items-center gap-1 disabled:opacity-50" data-testid="drafts-finish">
            <Send size={14} /> {batch.student ? `Assign the remaining ${rest} to ${batch.student.name}, one a day from next Monday` : `Save the remaining ${rest} to my library`}
          </button>
        )}
        <Link to="/parent/lessons" className="rounded-full border border-slate-400 bg-white px-5 py-2.5 text-sm font-semibold flex items-center gap-1"><BookOpen size={14} /> My lessons</Link>
        <button onClick={dismiss} className="ml-auto text-xs text-slate-500 underline flex items-center gap-1" data-testid="drafts-dismiss"><EyeOff size={12} /> Hide this set from Parent Hub</button>
      </div>
    </div>
  );
}

function BatchList() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/ai/batches").then(r => setData(r.data)).catch(() => setData({ batches: [] })); }, []);
  if (!data) return <div className="p-8 text-sm text-slate-500">Loading…</div>;
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl space-y-5" data-testid="lesson-drafts-list">
      <Link to="/parent/lessons" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"><ArrowLeft size={14} /> My lessons</Link>
      <h1 className="font-display text-3xl font-bold text-slate-900"><span aria-hidden="true">📚</span> AI lesson drafts</h1>
      {data.batches.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">No sets of AI lessons yet. Ask for several at once on <Link to="/parent/lessons/make" className="underline font-semibold">Make a lesson</Link> (for example "four science lessons about the solar system").</div>
      ) : (
        <ul className="space-y-3">
          {data.batches.map(b => (
            <li key={b.id}>
              <Link to={draftsPath(b.id)} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-wrap items-center gap-3 hover:border-violet-300" data-testid={`batch-${b.id}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-slate-900">{b.title}</p>
                  <p className="text-xs text-slate-500">{b.counts.total} lessons{b.student ? ` · for ${b.student.name}` : ""} · {new Date(b.created_at).toLocaleDateString()}</p>
                </div>
                {b.counts.awaiting_review > 0 && <span className="pill pill-submitted">{b.counts.awaiting_review} awaiting review</span>}
                {b.counts.failed > 0 && <span className="pill pill-needs-help">{b.counts.failed} failed</span>}
                {b.counts.pending + b.counts.generating > 0 && <span className="pill pill-in-progress">{b.counts.pending + b.counts.generating} still to write</span>}
                {b.counts.assigned > 0 && <span className="pill pill-completed">{b.counts.assigned} assigned</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LessonDrafts() {
  const { bid } = useParams();
  return bid ? <BatchView id={bid} /> : <BatchList />;
}
