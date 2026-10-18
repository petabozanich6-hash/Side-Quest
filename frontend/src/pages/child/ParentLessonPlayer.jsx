import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { isNetworkError, queueDraft, queueQuiz, queueSubmission, queuedQuiz, rememberDraft } from "../../lib/offline";
import QuestQuiz from "../../components/shared/QuestQuiz";
import PracticeItem from "../../components/shared/PracticeItem";
import LessonVisual from "../../components/shared/LessonVisual";
import { openPaperLesson } from "../../components/shared/lessonPrint";
import { englishVoices, getVoicePrefs, readAloud, setVoicePrefs, stopSpeaking } from "../../lib/voice";

const BTN = { backgroundColor: "#1F3B2D", color: "#F5EFE0" };
const ACCENT = { backgroundColor: "#C77B5B", color: "#FBF7EC" };
const INK = { color: "#1F3B2D" };


// "I'm stuck! Help me understand." A small inline panel under the part of the lesson the child is on.
// The server knows the lesson; this only says which part and what kind of help. Nothing here touches the child's answers.
const HELP_KINDS = [["explain", "Explain it differently"], ["example", "Show me another example"], ["hint", "Give me a hint"]];
function Stuck({ assignmentId, target, enabled, locked, onGrownUp, petName }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState("");
  const [res, setRes] = useState({}); // kind -> text, kept while the lesson is open
  const [err, setErr] = useState("");
  const [shown, setShown] = useState("");
  const [sure, setSure] = useState(false);
  const levels = useRef(0);
  if (locked || (!enabled && !onGrownUp)) return null;
  const ask = async (kind) => {
    setErr(""); setShown(kind);
    if (kind !== "hint" && res[kind]) return;
    setBusy(kind);
    try {
      const level = kind === "hint" ? levels.current + 1 : 1;
      const { data } = await api.post(`/assignments/${assignmentId}/help`, { kind, target, level });
      if (kind === "hint") levels.current = level;
      setRes((r) => ({ ...r, [kind]: data.text }));
    } catch (e) { setErr(e.response?.data?.detail || "The helper isn't available right now. Ask your grown-up."); }
    finally { setBusy(""); }
  };
  const border = { borderColor: "#D4C8A8" };
  const lastRung = onGrownUp && (
    <div className="border-t pt-3 space-y-2" style={border}>
      {!sure ? (
        <button type="button" onClick={() => setSure(true)} className="text-sm font-bold underline text-stone-700" data-testid="stuck-grownup">I've tried everything and I'm really stuck. I need a grown-up.</button>
      ) : (
        <div className="rounded-xl bg-white border p-3 space-y-2" style={border} data-testid="stuck-grownup-confirm">
          <p className="text-sm">This saves your work and sends it to your grown-up so they can help you. The lesson pauses until they reply. Send it?</p>
          <div className="flex gap-2"><button type="button" onClick={onGrownUp} className="rounded-full px-4 py-1.5 text-sm font-bold" style={{ backgroundColor: "#C77B5B", color: "#FBF7EC" }} data-testid="stuck-grownup-send">Yes, send it</button><button type="button" onClick={() => setSure(false)} className="rounded-full border-2 px-4 py-1.5 text-sm font-bold" style={border}>No, keep trying</button></div>
        </div>
      )}
    </div>
  );
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="text-sm font-bold rounded-full border-2 px-4 py-2" style={{ borderColor: "#C77B5B", color: "#8A4B30" }} data-testid="stuck-btn">🤔 I'm stuck! Help me understand.</button>;
  return (
    <div className="rounded-2xl border-2 p-4 space-y-3 bg-[#FBF7EC]" style={{ borderColor: "#C77B5B" }} data-testid="stuck-panel" role="region" aria-label="Help">
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-lg font-semibold" style={INK}>What would help?</p>
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-bold underline shrink-0" data-testid="stuck-close">Close and keep going</button>
      </div>
      {enabled && <div className="flex flex-wrap gap-2">
        {HELP_KINDS.map(([k, label]) => (
          <button key={k} type="button" disabled={!!busy} onClick={() => ask(k)} className={`rounded-full border-2 px-4 py-2 text-sm font-bold disabled:opacity-50 ${shown === k ? "bg-white" : ""}`} style={border} data-testid={`stuck-${k}`}>{label}</button>
        ))}
      </div>}
      {enabled ? null : <p className="text-sm text-stone-700" data-testid="stuck-offline">Try this first: press <b>← Back</b> to look at the explanation and the worked examples again, then have another go. They show every step.</p>}
      {busy && <p className="text-sm text-stone-600" role="status">Thinking about the best way to help…</p>}
      {err && <p className="text-sm text-rose-800" role="alert" data-testid="stuck-error">{err}</p>}
      {shown && res[shown] && !busy && (
        <div className="rounded-xl border bg-white p-4 text-base leading-relaxed whitespace-pre-wrap" style={border} data-testid="stuck-answer">{petName && <span className="block text-xs font-bold text-stone-500 mb-1">🐾 {petName} says:</span>}{res[shown]}</div>
      )}
      {shown === "hint" && res.hint && !busy && <button type="button" onClick={() => ask("hint")} className="text-sm font-bold underline" data-testid="stuck-more-hint">Still stuck? Give me a bigger hint</button>}
      {enabled && <p className="text-xs text-stone-500">This helper only talks about this lesson. It can make mistakes.</p>}
      {lastRung}
    </div>
  );
}

// If one screen cannot be drawn, the child sees a calm message and can still move on, never a blank page.
class StepGuard extends React.Component {
  constructor(p) { super(p); this.state = { bad: false, why: "" }; }
  static getDerivedStateFromError(e) { return { bad: true, why: String(e?.message || e || "").slice(0, 160) }; }
  componentDidCatch(e) { try { console.error("Lesson screen failed", e); } catch { /* ignore */ } }
  componentDidUpdate(prev) { if (prev.stepKey !== this.props.stepKey && this.state.bad) this.setState({ bad: false }); }
  render() {
    if (!this.state.bad) return this.props.children;
    return <div className="rounded-xl border p-4 bg-white space-y-2" style={{ borderColor: "#D4C8A8" }} role="alert" data-testid="step-error"><p className="font-bold">This screen could not be shown.</p><p className="text-sm text-stone-700">Press Next to carry on with the lesson. If it keeps happening, tell your grown-up.</p>{this.state.why && <p className="text-xs text-stone-500" data-testid="step-error-why">Detail for the grown-up: {this.props.stepKey} — {this.state.why}</p>}</div>;
  }
}

const PAGE = 4; // practice questions per screen
const mmss = (s) => (s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "");
const filled = (v) => (Array.isArray(v) ? v.some(Boolean) : !!String(v || "").trim());

// A video the parent approved. Always optional: the lesson teaches the idea without it.
function Watch({ r, note, setNote, locked }) {
  const border = { borderColor: "#D4C8A8" };
  const src = r.embed_url ? `${r.embed_url}${r.embed_url.includes("?") ? "&" : "?"}rel=0&modestbranding=1&playsinline=1` : "";
  return (
    <div className="space-y-3" data-testid="watch">
      <p className="text-sm text-stone-600">Watch this to see the idea in action. The lesson already explains it, so you can skip the video if it does not play.</p>
      {src ? (
        <div className="aspect-video w-full overflow-hidden rounded-xl border bg-black" style={border}>
          <iframe title={r.title} src={src} className="h-full w-full" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" data-testid="video-frame" />
        </div>
      ) : null}
      <p className="text-sm"><b>{r.title}</b>{r.channel ? ` · ${r.channel}` : ""}{r.duration_seconds ? ` · ${mmss(r.duration_seconds)}` : ""}</p>
      {!src && r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-block underline font-bold" style={{ color: "#4A5D3A" }} data-testid="video-external">Optional: open this video in a new tab ↗</a>}
      {src && r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs underline text-stone-500">Video not playing? Open it on YouTube ↗</a>}
      <div>
        <label htmlFor="watch-note" className="font-bold text-sm">{r.prompt || (r.concept ? `In your own words, what did the video explain about ${r.concept}?` : "In your own words, what did you learn from the video?")}</label>
        <textarea id="watch-note" rows={3} disabled={locked} value={note || ""} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-base bg-white" style={border} data-testid="watch-note" />
      </div>
    </div>
  );
}

// Reads text aloud with a voice already on the device (free, nothing is sent anywhere). The child can pick the voice and speed.
function ReadAloud({ text }) {
  const [on, setOn] = useState(false);
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(getVoicePrefs());
  const [voices, setVoices] = useState(() => englishVoices());
  const ok = typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
  useEffect(() => {
    if (!ok) return undefined;
    const sync = () => setVoices(englishVoices());
    window.speechSynthesis.addEventListener?.("voiceschanged", sync);
    return () => { window.speechSynthesis.removeEventListener?.("voiceschanged", sync); stopSpeaking(); };
  }, [ok]);
  if (!ok || !text) return null;
  const start = () => { setOn(readAloud(text, { onEnd: () => setOn(false) })); };
  const toggle = () => { if (on) { stopSpeaking(); setOn(false); } else start(); };
  const change = (p) => { setVoicePrefs(p); setPrefs(getVoicePrefs()); if (on) { stopSpeaking(); setTimeout(start, 50); } };
  const chip = { borderColor: "#4A5D3A", color: "#4A5D3A" };
  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="read-aloud-box">
      <button type="button" onClick={toggle} className="text-sm font-bold rounded-full border-2 px-3 py-1" style={chip} data-testid="read-aloud" aria-pressed={on}>{on ? "⏹ Stop reading" : "🔊 Read this to me"}</button>
      <button type="button" onClick={() => setOpen((o) => !o)} className="text-xs underline text-stone-600" aria-expanded={open} data-testid="voice-settings-btn">Voice and speed</button>
      {open && (
        <div className="basis-full rounded-xl border bg-white p-3 space-y-2 text-sm" style={{ borderColor: "#D4C8A8" }} data-testid="voice-settings">
          <div className="flex flex-wrap items-center gap-2"><span className="font-bold">Speed:</span>
            {[["Slower", 0.75], ["Normal", 0.9], ["Faster", 1.1]].map(([label, r]) => <button key={label} type="button" onClick={() => change({ rate: r })} className="rounded-full border px-3 py-1 font-bold" style={prefs.rate === r ? { ...chip, backgroundColor: "#DCE8DD" } : { borderColor: "#D4C8A8" }}>{label}</button>)}
          </div>
          {voices.length > 1 && (
            <label className="flex flex-wrap items-center gap-2"><span className="font-bold">Voice:</span>
              <select value={prefs.voice || voices[0].name} onChange={(e) => change({ voice: e.target.value })} className="rounded-lg border px-2 py-1 bg-white max-w-[16rem]" style={{ borderColor: "#D4C8A8" }}>
                {voices.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
              </select>
            </label>
          )}
          <p className="text-xs text-stone-500">Voices come from this device. If one is hard to understand, try another voice or a slower speed.</p>
        </div>
      )}
    </div>
  );
}

// Plays a lesson built by a parent, one screen at a time: learn, see it worked, try it, do it, show it, hand it in.
export default function ParentLessonPlayer({ assignment, onChanged, preview = false, offline = false }) {
  const a = assignment;
  const l = a.lesson || {};
  const sections = l.sections || [];
  const activities = l.activities || [];
  const questions = l.questions || [];
  const quiz = l.quiz || [];
  const worked = l.worked_examples || [];
  const guided = l.guided_practice || [];
  const materials = l.materials || [];
  const texts = l.texts || [];
  const mistakes = l.misconceptions || [];
  const prior = l.prior_knowledge || [];
  const keyWords = l.key_words || [];
  const videos = (l.resources || []).filter((r) => r.type === "video" && (r.embed_url || r.url));
  const links = (l.resources || []).filter((r) => r.type !== "video" && r.url);
  // Spelling words for the Word Hoard: the lesson's own list, or its single-word key words for lessons made before lists existed.
  const STOP = new Set("the and for with that this from into what when where which have has are was were your you can not but all any how why who its their they them then than also each more most some such only over under about between during".split(" "));
  const derive = () => {
    const out = [];
    const take = (t) => String(t || "").split(/[^A-Za-z'-]+/).forEach((w) => { w = w.toLowerCase(); if (w.length >= 5 && !STOP.has(w) && !out.some((x) => x.word === w)) out.push({ word: w }); });
    keyWords.forEach((k) => take(k.word));
    take(l.title);
    return out;
  };
  const listed = Array.isArray(l.hoard_words) && l.hoard_words.length ? l.hoard_words : null;
  // The lesson's own list; for lessons made before lists existed, words taken from its key words and title.
  const hoard = (listed || derive()).map((w) => ({ word: String(w?.word ?? w ?? "").trim(), hint: w?.hint || "" })).filter((w) => /^[A-Za-z][A-Za-z'-]{2,}$/.test(w.word)).slice(0, 12);
  const hasQuiz = quiz.some((q) => q.type !== "short_answer" && Array.isArray(q.options));

  // "waiting_to_send": handed in with no signal; it is sent automatically when the device is back online.
  const waitingToSend = a.status === "waiting_to_send";
  const locked = waitingToSend || ["awaiting_help", "submitted", "accepted", "demonstrated", "completed"].includes(a.status);
  const childId = a.student_id;
  const last = (a.submissions || [])[0];
  const d0 = a.draft || {};

  const [answers, setAnswers] = useState(d0.answers || {});
  const [checks, setChecks] = useState(d0.checks || {});
  const [reflection, setReflection] = useState(d0.reflection || "");
  const [gp, setGp] = useState(d0.guided || {});
  const [tv, setTv] = useState(d0.tasks || {});
  const [fbs, setFbs] = useState(d0.fbs || {});
  const [watch, setWatch] = useState(d0.watch || {});
  const [step, setStep] = useState(Number.isInteger(d0.step) ? d0.step : 0);
  const [needsHelp, setNeedsHelp] = useState(false);
  const [quizQueued, setQuizQueued] = useState(false);
  const [online, setOnline] = useState(!offline && (typeof navigator === "undefined" || navigator.onLine));
  useEffect(() => {
    if (preview) return undefined;
    queuedQuiz(childId, a.id).then((q) => setQuizQueued(!!q)).catch(() => {});
    const up = () => setOnline(true), down = () => setOnline(false);
    window.addEventListener("online", up); window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
    // eslint-disable-next-line
  }, []);
  const [quizOk, setQuizOk] = useState(a.quiz_passed === true);
  const passedBefore = useRef(a.quiz_passed === true);
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadsOn, setUploadsOn] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const first = useRef(true);
  const top = useRef(null);

  const [helpOn, setHelpOn] = useState(false);
  const [petName, setPetName] = useState("");
  useEffect(() => { if (preview) return; api.get("/pet").then(r => setPetName(r.data?.name || "")).catch(() => {}); }, [preview]);
  useEffect(() => { if (preview) return; api.get("/help/status").then(r => setHelpOn(!!r.data.available && r.data.reason !== "limit")).catch(() => {}); }, [preview]);
  const S = (target) => <Stuck petName={petName} assignmentId={a.id} target={target} enabled={helpOn} locked={locked} onGrownUp={preview || locked ? undefined : () => submit(true)} />;
  useEffect(() => { if (preview) return; api.get("/features").then(r => setUploadsOn(!!r.data.uploads)).catch(() => {}); }, [preview]);

  const upload = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("context", "submission");
      const { data } = await api.post("/files/upload", fd);
      setFiles((f) => [...f, data]);
    } catch (e) { toast.error(e.response?.data?.detail || "Could not upload that file"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const [hoardAdded, setHoardAdded] = useState([]);
  const [hoardChecked, setHoardChecked] = useState(false);
  useEffect(() => {
    // The moment the child opens the lesson, its spelling words go into their Word Hoard (words they already have are skipped).
    if (preview || !hoard.length) return;
    api.post("/word-bank/words", { words: hoard, source: "lesson", lesson_id: l.id || a.lesson_id })
      .then((res) => {
        const added = (res.data?.added || []).map((w) => w.word);
        setHoardChecked(true);
        if (added.length) { setHoardAdded(added); toast.success(`${added.length} new word${added.length === 1 ? "" : "s"} added to your Word Hoard 🐾`); }
      }).catch(() => setHoardChecked(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!preview && a.status === "not_started") api.put(`/assignments/${a.id}/status?status=opened`).catch(() => {});
    // eslint-disable-next-line
  }, []);

  // ---- the steps, in teaching order ----
  const steps = [];
  steps.push({ id: "welcome", title: "Start here" });
  texts.forEach((t, i) => steps.push({ id: `text${i}`, title: t.title || "Reading", text: i }));
  const vids = (when) => videos.map((v, i) => [v, i]).filter(([v]) => (v.after || "teaching") === when);
  const addVids = (when) => vids(when).forEach(([v, i]) => steps.push({ id: `video${i}`, title: "Watch", video: i }));
  addVids("intro");
  sections.forEach((s, i) => {
    steps.push({ id: `sec${i}`, title: s.heading || `Part ${i + 1}`, section: i });
    if (i === sections.length - 1) addVids("teaching");
  });
  if (!sections.length) addVids("teaching");
  worked.forEach((w, i) => steps.push({ id: `work${i}`, title: w.title || `Example ${i + 1}`, worked: i }));
  if (mistakes.length) steps.push({ id: "mistakes", title: "Mistakes to avoid" });
  addVids("examples");
  for (let k = 0; k < guided.length; k += PAGE) steps.push({ id: `guided${k}`, title: guided.length > PAGE ? `Try it ${k / PAGE + 1}` : "Try it", guided: k });
  addVids("practice");
  activities.forEach((x, i) => steps.push({ id: `act${i}`, title: x.title || `Activity ${i + 1}`, activity: i }));
  addVids("extension");
  steps.push({ id: "wrap", title: "Remember" });
  if (questions.length) steps.push({ id: "questions", title: "Show what you know" });
  if (hasQuiz) steps.push({ id: "quiz", title: "Quest check" });
  steps.push({ id: "handin", title: "Hand it in" });

  const cur = Math.min(Math.max(0, step), steps.length - 1);
  const st = steps[cur];
  const go = (n) => { setStep(Math.min(Math.max(0, n), steps.length - 1)); setTimeout(() => top.current?.scrollIntoView({ block: "start" }), 0); };

  const saveNow = async (silent) => {
    if (preview) return;
    const draft = { answers, checks, reflection, guided: gp, tasks: tv, fbs, watch, step: cur };
    try {
      await api.put(`/assignments/${a.id}/draft`, draft);
      rememberDraft(childId, a.id, draft);
      setSaved("Saved");
      if (!silent) toast.success("Your work is saved");
    } catch (e) {
      if (isNetworkError(e)) {
        // No signal: the work is kept on this device and sent when the device is back online.
        await queueDraft(childId, a.id, draft);
        setOnline(false);
        setSaved("Saved on this device");
        if (!silent) toast.success("Saved on this device. It will be sent when you're back online.");
        return;
      }
      setSaved("");
      if (!silent) toast.error(e.response?.data?.detail || "Could not save");
    }
  };

  useEffect(() => {
    if (locked || preview) return undefined;
    if (first.current) { first.current = false; return undefined; }
    setSaved("Saving…");
    const t = setTimeout(() => saveNow(true), 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [answers, checks, reflection, gp, tv, fbs, watch, cur]);

  const unanswered = questions.filter((_, i) => !(answers[i] || "").trim()).length;
  const needsQuiz = hasQuiz && !quizOk && !quizQueued;
  const canSubmit = needsHelp || (!needsQuiz && unanswered === 0);

  const submit = async (forceHelp) => {
    setBusy(true);
    const lines = [];
    questions.forEach((q, i) => lines.push(`${i + 1}. ${q.prompt}\nAnswer: ${(answers[i] || "").trim() || "(no answer)"}`));
    const shown = (v) => (Array.isArray(v) ? v.join(", ") : String(v || "").trim());
    guided.forEach((g, i) => { if (filled(gp[i])) lines.push(`Practice ${i + 1}. ${g.prompt}\nMy answer: ${shown(gp[i])}${fbs[`g${i}`]?.fb?.result ? ` (${fbs[`g${i}`].fb.result})` : ""}`); });
    activities.forEach((x, i) => (x.tasks || []).forEach((t, j) => { const v = tv[`${i}.${j}`]; if (filled(v)) lines.push(`${x.title} ${String.fromCharCode(97 + (j % 26))}. ${t.prompt}\nMy answer: ${shown(v)}`); }));
    Object.entries(watch).forEach(([k, v]) => { if (filled(v) && videos[k]) lines.push(`After the video "${videos[k].title}": ${shown(v)}`); });
    const didIt = activities.filter((_, i) => checks[i]).map((x) => x.title);
    if (activities.length) lines.push(`Activities done: ${didIt.length ? didIt.join(", ") : "none ticked"}`);
    const body = { assignment_id: a.id, response_text: lines.join("\n\n"), reflection: reflection.trim() || null, file_ids: files.map((f) => f.id), needs_help: forceHelp === true || needsHelp,
      // The latest answers travel with the hand-in even if autosave is still pending.
      draft: { answers, checks, reflection, guided: gp, tasks: tv, fbs, watch, step: cur } };
    try {
      await api.post("/submissions", body);
      toast.success(forceHelp === true || needsHelp ? "Sent to your grown-up" : "Handed in! Your grown-up will take a look.");
      onChanged && onChanged();
    } catch (e) {
      if (isNetworkError(e)) {
        await queueDraft(childId, a.id, { answers, checks, reflection, guided: gp, tasks: tv, fbs, watch, step: cur });
        await queueSubmission(childId, a.id, body);
        toast.success("All done! It will be handed in as soon as you're back online.");
        onChanged && onChanged();
        return;
      }
      toast.error(e.response?.data?.detail || "Could not hand in. Please try again.");
    } finally { setBusy(false); }
  };

  const card = "paper-card p-5 space-y-4";
  const area = "w-full rounded-lg border px-3 py-2 text-base bg-white";
  const border = { borderColor: "#D4C8A8" };
  const h2 = "font-display text-2xl font-semibold";
  const item = (part, idx, j, it, label, valueMap, setValue, key) => (
    <PracticeItem key={key} testid={part === "guided" ? `guided-${idx}` : `task-${idx}-${j}`} item={it} part={part} i={idx} j={j} label={label} assignmentId={a.id} locked={locked} preview={preview}
      value={valueMap}
      onChange={setValue}
      state={fbs[part === "guided" ? `g${idx}` : `t${idx}.${j}`]}
      onState={(v) => setFbs((f) => ({ ...f, [part === "guided" ? `g${idx}` : `t${idx}.${j}`]: v }))} />
  );

  const body = () => {
    if (st.id === "welcome") return (
      <div className="space-y-4" data-testid="intro">
        {(l.objectives || []).length > 0 && <div><p className="font-bold text-sm">By the end you will be able to:</p><ul className="list-disc pl-5 text-base">{l.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul></div>}
        {l.introduction && <><p className="text-base leading-relaxed whitespace-pre-wrap">{l.introduction}</p><ReadAloud text={l.introduction} /></>}
        {l.why_it_matters && <p className="text-base leading-relaxed"><b>Why this matters:</b> {l.why_it_matters}</p>}
        {keyWords.length > 0 && (
          <div className="rounded-xl border p-3 bg-white" style={border} data-testid="key-words">
            <p className="font-bold text-sm">Words to know</p>
            <dl className="mt-1 space-y-1 text-base">{keyWords.map((k, i) => <div key={i}><dt className="inline font-bold">{k.word}</dt> <dd className="inline">— {k.meaning}</dd></div>)}</dl>
          </div>
        )}
        {prior.length > 0 && <div><p className="font-bold text-sm">You should already know:</p><ul className="list-disc pl-5 text-sm text-stone-700">{prior.map((m, i) => <li key={i}>{m}</li>)}</ul></div>}
        {materials.length > 0 && <div className="rounded-xl border p-3 bg-white" style={border}><p className="font-bold text-sm">You will need:</p><ul className="list-disc pl-5 text-sm text-stone-700">{materials.map((m, i) => <li key={i}>{m}</li>)}</ul></div>}
        {hoard.length > 0 && (
          <div className="rounded-xl border p-3 bg-white" style={border} data-testid="hoard-words">
            <p className="font-bold text-sm">🐾 Spelling words for your Word Hoard</p>
            <ul className="mt-1 space-y-1 text-base">{hoard.map((w, i) => <li key={i}><b>{w.word}</b>{w.hint ? <span className="text-stone-600"> — {w.hint}</span> : null}</li>)}</ul>
            {!preview && hoardChecked && <p className="text-xs text-stone-600 mt-1" data-testid="hoard-saved">{hoardAdded.length ? `${hoardAdded.length} new in your Word Hoard${hoardAdded.length < hoard.length ? `; you already had ${hoard.length - hoardAdded.length}` : ""}.` : "All of these are already in your Word Hoard."}</p>}
            {!preview && <Link to="/child/word-hoard" className="mt-2 inline-block text-sm font-bold underline" style={{ color: "#4A5D3A" }} data-testid="hoard-link">Practise them in your Word Hoard →</Link>}
          </div>
        )}
        <p className="text-sm text-stone-600">Take the lesson one screen at a time. Your work saves as you go, so you can stop and come back.</p>
      </div>
    );
    if (st.text !== undefined) { const t = texts[st.text]; return <div className="space-y-2" data-testid={`text-${st.text}`}><ReadAloud text={t.content} /><p className="text-base leading-relaxed whitespace-pre-wrap rounded-xl border p-4 bg-white" style={border}>{t.content}</p></div>; }
    if (st.video !== undefined) return <Watch r={videos[st.video]} note={watch[st.video]} setNote={(v) => setWatch({ ...watch, [st.video]: v })} locked={locked} />;
    if (st.section !== undefined) { const s = sections[st.section]; return (
      <div className="space-y-4" data-testid={`section-${st.section}`}>
        <p className="text-base leading-relaxed whitespace-pre-wrap">{s.body}</p>
        <ReadAloud text={s.body} />
        {s.visual && <LessonVisual visual={s.visual} />}
        {S({ part: "section", i: st.section })}
      </div>
    ); }
    if (st.worked !== undefined) { const w = worked[st.worked]; return (
      <div className="space-y-3" data-testid={`worked-${st.worked}`}>
        <p className="font-bold text-lg">{w.problem}</p>
        <ReadAloud text={`${w.problem}. ${(w.steps || []).map((x, k) => `Step ${k + 1}. ${x}`).join(" ")} ${w.answer ? `So the answer is ${w.answer}` : ""}`} />
        {w.visual && <LessonVisual visual={w.visual} />}
        <ol className="list-decimal pl-5 space-y-2 text-base">{(w.steps || []).map((x, j) => <li key={j}>{x}</li>)}</ol>
        {w.answer && <p className="font-bold" style={INK}>Answer: {w.answer}</p>}
        {S({ part: "worked", i: st.worked })}
      </div>
    ); }
    if (st.id === "mistakes") return (
      <div className="space-y-3" data-testid="mistakes">
        {mistakes.map((m, i) => <div key={i} className="rounded-xl border p-3 bg-white" style={border}><p className="font-bold">{m.mistake}</p>{m.fix && <p className="text-base text-stone-700 mt-1 whitespace-pre-wrap">{m.fix}</p>}</div>)}
      </div>
    );
    if (st.guided !== undefined) return (
      <div className="space-y-4" data-testid="guided-practice">
        <p className="text-sm text-stone-600">{l.delivery === "independent" ? "Work these out yourself, using the worked examples. Press Check to see how you did." : "Work these out with your grown-up. Press Check to see how you did."}</p>
        {guided.slice(st.guided, st.guided + PAGE).map((g, k) => { const i = st.guided + k; return (
          <div key={i} className="space-y-2">
            {item("guided", i, 0, g, `${i + 1}.`, gp[i], (v) => setGp({ ...gp, [i]: v }), i)}
            {S({ part: "guided", i })}
          </div>
        ); })}
      </div>
    );
    if (st.activity !== undefined) { const i = st.activity, x = activities[i]; return (
      <div className="space-y-4" data-testid={`activity-block-${i}`}>
        {x.offline && <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-900">This is a hands-on activity away from the screen. Do it, then come back and record what happened below. If you cannot do it now, you can skip it.</p>}
        {x.instructions && <p className="text-base leading-relaxed whitespace-pre-wrap">{x.instructions}</p>}
        {x.visual && <LessonVisual visual={x.visual} />}
        {(x.tasks || []).map((t, j) => (
          <div key={j} className="space-y-2">
            {item("task", i, j, t, `${String.fromCharCode(97 + (j % 26))}.`, tv[`${i}.${j}`], (v) => setTv({ ...tv, [`${i}.${j}`]: v }), j)}
          </div>
        ))}
        {(x.tasks || []).length > 0 && S({ part: "task", i, j: 0 })}
        <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" disabled={locked} checked={!!checks[i]} onChange={(e) => setChecks({ ...checks, [i]: e.target.checked })} className="h-5 w-5" data-testid={`activity-${i}`} /> I have finished this activity</label>
      </div>
    ); }
    if (st.id === "wrap") return (
      <div className="space-y-4" data-testid="consolidation">
        {l.consolidation && <><p className="text-base leading-relaxed whitespace-pre-wrap">{l.consolidation}</p><ReadAloud text={l.consolidation} /></>}
        {l.extension && <div className="rounded-xl border p-3 bg-white" style={border} data-testid="extension"><p className="font-bold text-sm">Extra challenge</p><p className="text-base whitespace-pre-wrap">{l.extension}</p></div>}
        {links.length > 0 && <div><p className="font-bold text-sm">Optional: explore more</p>{links.map((r, i) => <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="block underline font-bold" style={{ color: "#4A5D3A" }}>{r.title} ↗</a>)}</div>}
      </div>
    );
    if (st.id === "questions") return (
      <div className="space-y-4" data-testid="questions">
        <p className="text-sm text-stone-600">Answer in your own words. Take your time.</p>
        {questions.map((q, i) => (
          <div key={i}>
            <label htmlFor={`ans-${i}`} className="font-bold">{i + 1}. {q.prompt}</label>
            <textarea id={`ans-${i}`} rows={q.type === "long" ? 5 : 2} disabled={locked} value={answers[i] || ""} onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })} className={`mt-1 ${area}`} style={border} data-testid={`answer-${i}`} />
            <div className="mt-2">{S({ part: "question", i })}</div>
          </div>
        ))}
      </div>
    );
    if (st.id === "quiz") return (
      <div data-testid="quiz-section">
        {passedBefore.current ? <p className="font-bold text-green-800" data-testid="quiz-passed">Quiz passed. Nice work!</p>
          : preview ? <ol className="list-decimal pl-5 space-y-2 text-sm">{quiz.map((q, i) => <li key={i}><b>{q.question}</b><ul className="list-disc pl-5 text-stone-600">{(q.options || []).map((o, j) => <li key={j}>{o}</li>)}</ul></li>)}</ol>
          : locked ? <p className="text-sm text-stone-600">The quiz is closed.</p>
          : <QuestQuiz quiz={quiz} passMark={l.pass_mark || 0.7} assignmentId={a.id} onResult={(r) => setQuizOk(!!r?.passed)} help={(qi) => S({ part: "quiz", i: qi })}
              queued={quizQueued} onOffline={async (ans) => { await queueQuiz(childId, a.id, ans); setQuizQueued(true); setOnline(false); }} />}
      </div>
    );
    // hand in
    if (preview) return <p className="rounded-xl border border-dashed p-4 text-sm text-stone-600" style={border}>The hand-in box appears here for your child. Nothing in this preview is saved.</p>;
    const gDone = guided.filter((_, i) => filled(gp[i])).length;
    const aTasks = activities.reduce((n, x) => n + (x.tasks || []).length, 0);
    const aDone = activities.reduce((n, x, i) => n + (x.tasks || []).filter((_, j) => filled(tv[`${i}.${j}`])).length, 0);
    const qDone = questions.length - unanswered;
    const rows = [
      guided.length > 0 && ["Practice questions", `${gDone} of ${guided.length} answered`, gDone === guided.length],
      aTasks > 0 && ["Activity tasks", `${aDone} of ${aTasks} answered`, aDone === aTasks],
      questions.length > 0 && ["Show what you know", `${qDone} of ${questions.length} answered`, unanswered === 0],
      hasQuiz && ["Quest check", quizOk ? "Passed" : quizQueued ? "Answered; marked when you're back online" : "Not passed yet", quizOk || quizQueued],
    ].filter(Boolean);
    const summary = rows.length > 0 && (
      <div className="rounded-xl border bg-white p-4" style={border} data-testid="progress-summary">
        <p className="font-bold text-sm">{locked ? "What you did" : "Before you hand in"}</p>
        <ul className="mt-2 space-y-1 text-base">{rows.map(([label, value, ok], i) => <li key={i} className="flex items-center gap-2"><span aria-hidden>{ok ? "✅" : "⬜"}</span><span className="font-bold">{label}:</span> {value}</li>)}</ul>
        {!locked && rows.some((r) => !r[2]) && <p className="mt-2 text-sm text-stone-600">You can go back to any step from the list at the top. Unfinished practice is fine to hand in; it helps your grown-up see where to help.</p>}
      </div>
    );
    if (locked) return (
      <div className="space-y-4" data-testid="lesson-complete">
        <div className="rounded-2xl border-2 p-5 text-center" style={{ borderColor: "#4A5D3A", background: "#F3F6EC" }}>
          <p className="text-4xl" aria-hidden>🎉</p>
          <p className="font-display text-2xl font-semibold" style={INK}>{["accepted", "demonstrated", "completed"].includes(a.status) ? "Quest complete!" : waitingToSend ? "All done. Great work!" : "Handed in. Great work!"}</p>
          <p className="text-base mt-1">{["accepted", "demonstrated", "completed"].includes(a.status) ? "Your grown-up has looked at your work." : waitingToSend ? "It will be handed in automatically as soon as this device is back online." : "Your grown-up will look at your work soon. When they accept it, your pet earns XP."}</p>
        </div>
        {summary}
        {last?.reflection && <p className="text-sm text-stone-700"><b>Your note:</b> {last.reflection}</p>}
        {hoard.length > 0 && <p className="text-base">🐾 Your new spelling words are in your Word Hoard. <Link to="/child/word-hoard" className="font-bold underline" style={{ color: "#4A5D3A" }}>Practise them</Link></p>}
        <Link to="/child" className="inline-block rounded-full px-6 py-2.5 text-sm font-bold" style={BTN} data-testid="complete-home">Back to my quests</Link>
      </div>
    );
    return (
      <div className="space-y-4" data-testid="hand-in">
        {summary}
        <div>
          <label htmlFor="refl" className="font-bold text-sm">How did it go? (optional)</label>
          <textarea id="refl" rows={2} value={reflection} onChange={(e) => setReflection(e.target.value)} className={`mt-1 ${area}`} style={border} data-testid="reflection-text" />
        </div>
        {uploadsOn ? (
          <div>
            <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files[0] && upload(e.target.files[0])} data-testid="file-input" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-xl border-2 border-dashed w-full p-4 text-sm font-bold disabled:opacity-50" style={border} data-testid="upload-btn">{uploading ? "Uploading…" : "📷 Add a photo of what you made (optional)"}</button>
            {files.length > 0 && <ul className="mt-2 text-sm">{files.map((f) => <li key={f.id}>📎 {f.original_filename}</li>)}</ul>}
          </div>
        ) : null}
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={needsHelp} onChange={(e) => setNeedsHelp(e.target.checked)} data-testid="needs-help" /> I need help with this one</label>
        {!canSubmit && <p className="text-sm text-amber-800" data-testid="submit-hint">{needsQuiz ? "Pass the quest check to hand in." : `Answer all ${questions.length} questions in “Show what you know” to hand in (${unanswered} to go).`}</p>}
        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" onClick={() => saveNow(false)} className="rounded-full border-2 px-5 py-2.5 text-sm font-bold" style={{ borderColor: "#1F3B2D", color: "#1F3B2D" }} data-testid="save-progress">Save my progress</button>
          <button type="button" disabled={!canSubmit || busy} onClick={() => submit()} className="rounded-full px-6 py-2.5 text-sm font-bold disabled:opacity-40" style={ACCENT} data-testid="submit-work">{busy ? "Handing in…" : needsHelp ? "Ask for help" : "Hand it in"}</button>
          <span className="text-xs text-stone-500" aria-live="polite" data-testid="save-state">{saved}</span>
        </div>
      </div>
    );
  };

  const pct = Math.round((cur / Math.max(1, steps.length - 1)) * 100);
  return (
    <div className="space-y-5 animate-in" data-testid="child-lesson">
      <span ref={top} />
      <Link to="/child" className="text-sm font-bold" style={{ color: "#4A5D3A" }} data-testid="back-home">← Back to my quests</Link>

      <header className={card}>
        <div className="text-xs font-mono uppercase text-stone-500">{[l.learning_area, l.duration_minutes && `${l.duration_minutes} min`].filter(Boolean).join(" · ")}</div>
        <h1 className="font-display text-3xl font-bold" style={INK} data-testid="lesson-title">{l.title}</h1>
        <button type="button" onClick={() => { if (!openPaperLesson(l, { type: "built" })) toast.error("Allow pop-ups to print your workbook"); }} className="mt-3 rounded-full border px-4 py-2 text-sm font-bold" style={{ borderColor: "#D4C8A8" }} data-testid="built-lesson-print">🖨️ Print student workbook</button>
        {l.child_mission && <p className="font-display text-lg" style={INK}>{l.child_mission}</p>}
      </header>

      {a.status === "needs_revision" && last?.parent_feedback && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" data-testid="revision-note">
          <strong>Your grown-up asked you to try again:</strong> {last.parent_feedback}
          {last.next_step && <div className="mt-1">Next step: {last.next_step}</div>}
        </div>
      )}
      {a.status === "needs_revision" && last?.response_text && (
        <details className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm" data-testid="previous-submitted-work">
          <summary className="cursor-pointer font-semibold text-amber-900">See the answers I already handed in</summary>
          <p className="mt-2 text-amber-900">Your previous submission is kept here, even if an older lesson did not restore its editable boxes automatically.</p>
          <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-slate-800">{last.response_text}</pre>
          {last.reflection && <p className="mt-2 whitespace-pre-wrap text-slate-700"><strong>Reflection:</strong> {last.reflection}</p>}
        </details>
      )}
      {!online && !preview && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900" data-testid="offline-lesson">
          <strong>📶 No internet right now.</strong> You can keep going: your work saves on this device and is sent when you're back online.
          Checking answers, the "I'm stuck" helper, videos and photos need the internet.
        </div>
      )}
      {waitingToSend && <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900" data-testid="waiting-to-send">Ready to hand in. It will be sent automatically when you're back online.</div>}
      {a.status === "submitted" && <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900" data-testid="handed-in">You handed this in. Your grown-up will look at it soon.</div>}
      {["accepted", "demonstrated", "completed"].includes(a.status) && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900" data-testid="reviewed-note">
          <strong>Quest complete!</strong> {last?.parent_feedback ? `Your grown-up said: ${last.parent_feedback}` : "Well done."}
          {last?.next_step && <div className="mt-1">Next step: {last.next_step}</div>}
        </div>
      )}

      <nav className="space-y-2" aria-label="Lesson progress" data-testid="stepper">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-bold" data-testid="step-count">Step {cur + 1} of {steps.length}</span>
          <label className="flex items-center gap-2"><span className="sr-only">Jump to a step</span>
            <select value={cur} onChange={(e) => go(Number(e.target.value))} className="rounded-lg border px-2 py-1 bg-white max-w-[14rem]" style={border} data-testid="step-jump">
              {steps.map((x, i) => <option key={x.id} value={i}>{i + 1}. {x.title}</option>)}
            </select>
          </label>
        </div>
        <div className="h-2 rounded-full bg-[#E5DCC3] overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><div className="h-full" style={{ width: `${pct}%`, backgroundColor: "#4A5D3A" }} /></div>
      </nav>

      <section className={card} data-testid={`step-${st.id}`} aria-live="polite">
        <h2 className={h2} style={INK} data-testid="step-title">{st.title}</h2>
        <StepGuard stepKey={st.id}>{body()}</StepGuard>
      </section>

      <div className="flex items-center justify-between gap-3">
        <button type="button" disabled={cur === 0} onClick={() => go(cur - 1)} className="rounded-full border-2 px-5 py-2.5 text-sm font-bold disabled:opacity-30" style={{ borderColor: "#1F3B2D", color: "#1F3B2D" }} data-testid="step-prev">← Back</button>
        {cur < steps.length - 1 && <button type="button" onClick={() => go(cur + 1)} className="rounded-full px-6 py-2.5 text-sm font-bold" style={BTN} data-testid="step-next">Next →</button>}
      </div>
    </div>
  );
}
