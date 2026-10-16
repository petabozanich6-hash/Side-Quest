import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Hammer, FileText, ArrowLeft, Loader2, Check } from "lucide-react";
import PetArt from "../../components/shared/PetArt";
import { api } from "../../lib/api";
import { newId, runBatch } from "../../lib/batchRunner";

const EXAMPLES = [
  "Create a one-hour Year 3 maths lesson about addition using gardening as the theme.",
  "Create a one-hour Year 7 lesson introducing negative integers. My child works independently.",
  "Create four science lessons about the solar system for my Year 5 child next week.",
];
const SERIES = /(?<!year\s)\b(two|three|four|five|six|[2-6])\s+(?:[\w-]+\s+){0,4}?lessons?\b/i;
// The real stages the server reports while it writes a lesson (worker/src/aiDraft.ts GEN_PHASES).
const PHASES = [
  { key: "design", label: "Planning what to teach and in what order", flavour: "The dragon is sketching the quest map." },
  { key: "frame", label: "Writing the introduction and readings", flavour: "The dragon is setting the scene." },
  { key: "teaching", label: "Writing the explanations and worked examples", flavour: "The dragon is writing each explanation, one idea at a time." },
  { key: "practice", label: "Writing the practice, activities and quiz", flavour: "The gremlins are building the practice and the quiz." },
  { key: "checking", label: "Checking the answers and the teaching", flavour: "The gremlins are checking every answer and sum." },
  { key: "outcomes", label: "Linking curriculum outcomes", flavour: "The gremlins are matching the lesson to the curriculum." },
  { key: "saving", label: "Saving your lesson", flavour: "Into the hoard it goes." },
];

/** Simple waiting message, for steps that don't report stages (planning a set of lessons). */
function Progress({ label }) {
  const [sec, setSec] = useState(0);
  useEffect(() => { const t = setInterval(() => setSec(s => s + 1), 1000); return () => clearInterval(t); }, []);
  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50 p-4" role="status" data-testid="make-progress">
      <p className="font-semibold text-violet-900 flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> {label}</p>
      <p className="text-xs text-slate-500 mt-1">{sec}s so far. Please keep this page open.</p>
    </div>
  );
}

/**
 * Real progress for one lesson: polls the server for the stage it has reached. If the connection to the
 * main request drops, this keeps watching the same request and opens the lesson when it is ready.
 */
function LiveProgress({ requestId, watching, onDone, onStopped }) {
  const [view, setView] = useState(null);
  const [sec, setSec] = useState(0);
  useEffect(() => { const t = setInterval(() => setSec(s => s + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    let live = true;
    let timer;
    const poll = async () => {
      try {
        const { data } = await api.get("/ai/lesson-draft/status", { params: { request_id: requestId } });
        if (!live) return;
        setView(data);
        // While the main request is alive it opens the lesson (with its warnings); polling only takes over when it was lost.
        if (watching && data.status === "done" && data.lesson_id) { onDone(data.lesson_id); return; }
        if (watching && (data.status === "failed" || data.status === "interrupted")) { onStopped(data); return; }
      } catch { /* keep trying: the connection may be coming back */ }
      if (live) timer = setTimeout(poll, 2500);
    };
    timer = setTimeout(poll, 1200);
    return () => { live = false; clearTimeout(timer); };
  }, [requestId, watching, onDone, onStopped]);
  const step = view?.step || 0;
  const current = PHASES[Math.max(0, step - 1)];
  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 space-y-3" role="status" aria-live="polite" data-testid="make-progress">
      <div className="flex items-center gap-3">
        <PetArt species={step >= 4 ? "goblin" : "dragon"} stage="youngling" size={56} aria-hidden="true" />
        <div>
          <p className="font-semibold text-violet-900 flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> {watching ? "Still writing your lesson…" : "Writing your lesson…"}</p>
          <p className="text-sm text-slate-700" data-testid="make-progress-flavour">{step ? current.flavour : "Waking the dragon…"}</p>
        </div>
      </div>
      <ol className="space-y-1 text-sm" data-testid="make-progress-steps">
        {PHASES.map((p, i) => {
          const state = i + 1 < step ? "done" : i + 1 === step ? "now" : "todo";
          return (
            <li key={p.key} className={`flex items-center gap-2 ${state === "todo" ? "text-slate-400" : "text-slate-800"}`} data-testid={`make-step-${p.key}`} data-state={state}>
              {state === "done" ? <Check size={14} className="text-emerald-700" aria-label="done" /> : state === "now" ? <Loader2 size={14} className="animate-spin text-violet-700" aria-label="in progress" /> : <span className="inline-block w-3.5 h-3.5 rounded-full border border-slate-300" aria-hidden="true" />}
              {p.label}
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-slate-500">{sec}s so far. {watching ? "Your connection dropped, but the lesson is still being written; it will open here when it's ready. Your allowance is only used once." : "This usually takes one to three minutes. You can keep this page open; the lesson is kept if your connection drops."}</p>
    </div>
  );
}

export default function MakeLesson() {
  const nav = useNavigate();
  const [plan, setPlan] = useState(null);
  const [students, setStudents] = useState([]);
  const [qs] = useSearchParams(); // ?prompt=&student= from the Outcome tracker's gap suggestions
  const [student, setStudent] = useState(qs.get("student") || "");
  const [text, setText] = useState((qs.get("prompt") || "").slice(0, 1200));
  const [resource, setResource] = useState("");
  const [showRes, setShowRes] = useState(false);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [outline, setOutline] = useState(null); // multi-lesson plan awaiting confirmation
  const [linkOutcomes, setLinkOutcomes] = useState(true);
  const [jurisdiction, setJurisdiction] = useState(null);
  const [requestId, setRequestId] = useState(null); // the lesson being written (for real progress)
  const [watching, setWatching] = useState(false); // the main request was lost; following progress only
  const leaving = useRef(false);
  const batchId = useRef(null); // one set per "Write all", even if the button is pressed twice

  useEffect(() => {
    api.get("/account/plan").then(r => setPlan(r.data)).catch(() => setPlan({ limits: {} }));
    api.get("/students").then(r => { setStudents(r.data); if (r.data.length === 1) setStudent(r.data[0].id); else if (!r.data.some(x => x.id === qs.get("student"))) setStudent(""); }).catch(() => {});
    api.get("/auth/me").then(r => setJurisdiction(r.data?.jurisdiction || null)).catch(() => {});
  }, []);
  useEffect(() => {
    const warn = e => { if (busy && !leaving.current) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  const child = students.find(s => s.id === student);
  const body = (extra = {}) => ({ request: text.trim(), student_id: student || undefined, source_text: resource.trim() || undefined, link_outcomes: linkOutcomes, ...extra });
  const fail = e => setErr(e.response?.data?.detail || "Something went wrong. Nothing was used from your allowance. You can try again, or build the lesson yourself.");

  const create = async () => {
    setErr("");
    if (students.length > 1 && !student) { setErr("Choose which child this lesson is for."); return; }
    if (SERIES.test(text) && !resource.trim()) {
      setBusy("plan");
      try { const r = await api.post("/ai/series-plan", body()); setOutline(r.data); }
      catch (e) { fail(e); }
      finally { setBusy(""); }
      return;
    }
    if (busy) return; // one request at a time
    setBusy("one"); setWatching(false);
    // One id per press: the server writes (and charges) it once, even if it arrives twice.
    const id = newId();
    setRequestId(id);
    try {
      const r = await api.post("/ai/lesson-draft", body({ request_id: id }));
      leaving.current = true;
      nav(`/parent/lessons/${r.data.lesson.id}/review`, { state: { assumptions: { ...r.data.assumptions, child: child?.name }, warnings: r.data.warnings, generation: r.data.generation, studentId: student || undefined } });
    } catch (e) {
      // The server answered: show its reason. No answer, a gateway timeout, or "already being written"
      // means the lesson may still be on its way, so keep watching the same request instead.
      const res = e.response;
      const lost = !res || ([502, 503, 504, 520, 522, 524].includes(res.status) && !res.data?.code) || res.data?.code === "IN_PROGRESS";
      if (lost) { setWatching(true); return; }
      fail(e); setBusy(""); setRequestId(null);
    }
  };
  const openLesson = useCallback((lessonId) => {
    leaving.current = true;
    nav(`/parent/lessons/${lessonId}/review`, { state: { assumptions: { child: child?.name }, warnings: [], studentId: student || undefined } });
  }, [nav, child?.name, student]);
  const stopped = useCallback((v) => {
    setErr(v.status === "interrupted"
      ? "The lesson stopped part-way (the connection was lost). Nothing was used from your allowance. Please try again."
      : v.error || "The lesson couldn't be written. Nothing was used from your allowance. Please try again.");
    setBusy(""); setWatching(false); setRequestId(null);
  }, []);

  // A set of lessons is created on the server first, so every lesson stays reachable however the parent moves
  // around (open one, edit, assign, leave, refresh). Lessons are then written one by one in the background.
  const createAll = async () => {
    setErr(""); setBusy("series");
    try {
      if (!batchId.current) batchId.current = newId();
      const r = await api.post("/ai/batches", { id: batchId.current, title: outline.title, lessons: outline.lessons, student_id: student || undefined, request: text.trim(), link_outcomes: linkOutcomes });
      runBatch(r.data.id, r.data.items.filter(i => i.state === "pending").map(i => i.index));
      leaving.current = true;
      nav(`/parent/lessons/drafts/${r.data.id}`);
    } catch (e) { fail(e); setBusy(""); }
  };

  if (!plan) return <div className="p-8 text-sm text-slate-500">Loading…</div>;
  const allowed = !!plan.limits?.aiGeneration;
  const field = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl space-y-6" data-testid="make-lesson">
      <div>
        <Link to="/parent/lessons" className="mb-2 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"><ArrowLeft size={14} /> My lessons</Link>
        <h1 className="font-display text-3xl font-bold text-slate-900">Make a lesson</h1>
        <p className="text-sm text-slate-600 mt-1">Tell Side-Quest what you want in your own words. It writes the teaching, the examples, the practice and the quiz, ready for you to read and assign.</p>
      </div>

      {!allowed ? (
        <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-5 text-sm space-y-3" data-testid="ai-upsell">
          <p className="font-semibold text-violet-900 flex items-center gap-1"><Sparkles size={16} /> Make it for me</p>
          <p className="text-slate-700">Having Side-Quest write the whole lesson for you is part of the paid Family Membership. The free preview includes the full lesson builder, so you can still create lessons yourself.</p>
          <div className="flex gap-2 flex-wrap"><Link to="/parent/plan" className="rounded-full bg-violet-700 text-white px-4 py-2 font-semibold">See plans</Link><Link to="/parent/lessons/new" className="rounded-full border border-slate-900 bg-white px-4 py-2 font-semibold">Build one myself</Link></div>
        </div>
      ) : outline ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4" data-testid="series-plan">
          <h2 className="font-display text-xl font-bold">{outline.title}</h2>
          <p className="text-sm text-slate-600">Here is the plan for {outline.count} lessons of about {outline.minutes} minutes. Each one builds on the last. Change any title or goal first if you like.</p>
          <ol className="space-y-3">
            {outline.lessons.map((l, i) => (
              <li key={i} className="rounded-lg border border-slate-200 p-3">
                <input disabled={!!busy} value={l.title} onChange={e => setOutline(o => ({ ...o, lessons: o.lessons.map((x, j) => j === i ? { ...x, title: e.target.value } : x) }))} className="w-full font-semibold border-b border-dashed border-slate-300 focus:outline-none" data-testid="series-title" />
                <input disabled={!!busy} value={l.goal} onChange={e => setOutline(o => ({ ...o, lessons: o.lessons.map((x, j) => j === i ? { ...x, goal: e.target.value } : x) }))} className="w-full text-sm text-slate-600 mt-1 focus:outline-none" />
              </li>
            ))}
          </ol>
          {busy === "series" && <Progress label="Setting up your lessons…" />}
          {err && <p role="alert" className="text-sm text-rose-700">{err}</p>}
          <p className="text-xs text-slate-500">{outline.usage.unlimited ? "Owner testing: AI lesson drafts are unlimited. Each generated lesson is still recorded for usage tracking." : `This uses ${outline.count} of your ${outline.usage.limit_per_day - outline.usage.today} lesson drafts left today (${outline.usage.limit_per_month - outline.usage.month} left this month). It is the same as writing ${outline.count} single lessons.`}</p>
          <p className="text-xs text-slate-500">Your lessons are kept together under <b>AI lesson drafts</b>, so you can open, edit and assign them one at a time and come back to the rest whenever you like.</p>
          {busy !== "series" && (
            <div className="flex gap-2 flex-wrap">
              <button onClick={createAll} className="rounded-full bg-violet-700 text-white px-5 py-2.5 text-sm font-semibold" data-testid="series-go">Write all {outline.count} lessons</button>
              <button onClick={() => setOutline(null)} className="rounded-full border border-slate-400 bg-white px-5 py-2.5 text-sm font-semibold">Back</button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-violet-300 bg-white p-5 sm:p-6 space-y-4 shadow-sm" data-testid="make-for-me">
          <h2 className="font-display text-xl font-bold flex items-center gap-2"><Sparkles size={20} className="text-violet-700" /> Make it for me</h2>
          <div>
            <label className="font-semibold text-slate-900" htmlFor="mk-text">What would you like to teach?</label>
            <textarea id="mk-text" rows={3} value={text} onChange={e => setText(e.target.value)} maxLength={1200} className={`${field} mt-1`} placeholder={EXAMPLES[0]} data-testid="mk-text" disabled={!!busy} />
            <div className="flex flex-wrap gap-2 mt-2">{EXAMPLES.map(x => <button key={x} type="button" onClick={() => setText(x)} className="text-xs rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-left" data-testid="mk-example">{x}</button>)}</div>
          </div>
          <div>
            <label className="font-semibold text-slate-900" htmlFor="mk-child">Who is this for?</label>
            <select id="mk-child" value={student} onChange={e => setStudent(e.target.value)} className={`${field} mt-1`} data-testid="mk-child" disabled={!!busy}>
              <option value="">{students.length ? "Choose a child…" : "No children added yet"}</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}{s.year_level ? ` (Year ${s.year_level})` : ""}</option>)}
            </select>
            <p className="text-xs text-slate-500 mt-1">Side-Quest uses your child's year level, interests and saved preferences automatically. <Link to="/parent/children" className="underline">Update their preferences</Link></p>
          </div>
          <div>
            <button type="button" onClick={() => setShowRes(s => !s)} className="text-sm font-semibold text-violet-800 flex items-center gap-1" data-testid="mk-res-toggle"><FileText size={14} /> {showRes ? "Hide" : "Have a worksheet, passage or notes to use?"}</button>
            {showRes && (
              <div className="mt-2 space-y-1">
                <textarea rows={6} value={resource} onChange={e => setResource(e.target.value)} maxLength={20000} className={field} placeholder="Paste the text of your worksheet, passage or notes here. Side-Quest will add the teaching, worked examples and practice around it, and keep your material as an activity." data-testid="mk-resource" disabled={!!busy} />
                <p className="text-xs text-slate-500">Paste text only for now. Uploading PDFs and reading web links is not available yet, because links cannot be read reliably.</p>
              </div>
            )}
          </div>
          {busy === "one" && requestId ? <LiveProgress requestId={requestId} watching={watching} onDone={openLesson} onStopped={stopped} />
            : busy ? <Progress label={busy === "plan" ? "Planning your lessons…" : "Writing your lesson…"} /> : (
            <>
            {jurisdiction === "NSW" ? (
              <label className="flex items-start gap-2 text-sm text-slate-700 mb-3"><input type="checkbox" className="mt-1" checked={linkOutcomes} onChange={e => setLinkOutcomes(e.target.checked)} data-testid="mk-outcomes" /><span>Suggest relevant NSW syllabus outcome codes <span className="text-slate-500">(from Side-Quest's verified list; review each suggestion before using it)</span></span></label>
            ) : (
              <p className="text-xs text-stone-600 mb-3" data-testid="mk-state-curriculum-note">{jurisdiction ? `Your lesson will be written with your ${jurisdiction} curriculum in mind, and will include a link to the official curriculum. Verified outcome codes for ${jurisdiction} are not yet loaded, so no codes will be invented.` : "Choose your family's state or territory on the Curriculum page for state-aware lesson drafting. Until then, drafts are general Australian lessons without automatic curriculum codes."}</p>
            )}
            <button onClick={create} disabled={text.trim().length < 5} className="w-full sm:w-auto rounded-full bg-violet-700 text-white px-8 py-3 text-base font-bold disabled:opacity-50" data-testid="mk-go">Create My Lesson</button>
            </>
          )}
          {err && <p role="alert" className="text-sm text-rose-700" data-testid="mk-error">{err}</p>}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-3 flex-wrap">
        <div><p className="font-semibold flex items-center gap-2"><Hammer size={16} /> I'll build it myself</p><p className="text-sm text-slate-600">Write the lesson yourself in the full editor, with a live preview.</p></div>
        <Link to="/parent/lessons/new" className="rounded-full border border-slate-900 px-5 py-2 text-sm font-semibold" data-testid="mk-manual">Open the editor</Link>
      </div>
    </div>
  );
}
