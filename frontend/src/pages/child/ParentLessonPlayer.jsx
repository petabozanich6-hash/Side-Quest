import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../lib/api";
import QuestQuiz from "../../components/shared/QuestQuiz";

const BTN = { backgroundColor: "#1F3B2D", color: "#F5EFE0" };
const ACCENT = { backgroundColor: "#C77B5B", color: "#FBF7EC" };
const INK = { color: "#1F3B2D" };

// Plays a lesson built by a parent: read, watch, do, answer, quiz, hand in.
export default function ParentLessonPlayer({ assignment, onChanged, preview = false }) {
  const a = assignment;
  const l = a.lesson || {};
  const sections = l.sections || [];
  const activities = l.activities || [];
  const questions = l.questions || [];
  const resources = l.resources || [];
  const quiz = l.quiz || [];
  const worked = l.worked_examples || [];
  const guided = l.guided_practice || [];
  const materials = l.materials || [];
  const texts = l.texts || [];
  const mistakes = l.misconceptions || [];
  const prior = l.prior_knowledge || [];
  const hasQuiz = quiz.some((q) => q.type !== "short_answer" && Array.isArray(q.options));

  const locked = ["submitted", "accepted", "demonstrated", "completed"].includes(a.status);
  const last = (a.submissions || [])[0];

  const [answers, setAnswers] = useState(a.draft?.answers || {});
  const [checks, setChecks] = useState(a.draft?.checks || {});
  const [reflection, setReflection] = useState(a.draft?.reflection || "");
  const [gp, setGp] = useState(a.draft?.guided || {});
  const [hints, setHints] = useState({});
  const [needsHelp, setNeedsHelp] = useState(false);
  const [quizOk, setQuizOk] = useState(a.quiz_passed === true);
  const passedBefore = useRef(a.quiz_passed === true); // show the quiz again only if it was cleared in this visit
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadsOn, setUploadsOn] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const first = useRef(true);

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

  // Opening a lesson marks it as started.
  useEffect(() => {
    if (!preview && a.status === "not_started") api.put(`/assignments/${a.id}/status?status=opened`).catch(() => {});
    // eslint-disable-next-line
  }, []);

  const saveNow = async (silent) => {
    if (preview) return;
    try {
      await api.put(`/assignments/${a.id}/draft`, { answers, checks, reflection, guided: gp });
      setSaved("Saved");
      if (!silent) toast.success("Your work is saved");
    } catch (e) {
      setSaved("");
      if (!silent) toast.error(e.response?.data?.detail || "Could not save");
    }
  };

  // Save quietly a moment after the child stops typing, so a refresh loses nothing.
  useEffect(() => {
    if (locked || preview) return undefined;
    if (first.current) { first.current = false; return undefined; }
    setSaved("Saving…");
    const t = setTimeout(() => saveNow(true), 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [answers, checks, reflection, gp]);

  const unanswered = questions.filter((_, i) => !(answers[i] || "").trim()).length;
  const needsQuiz = hasQuiz && !quizOk;
  const canSubmit = needsHelp || (!needsQuiz && unanswered === 0);

  const submit = async () => {
    setBusy(true);
    const lines = [];
    questions.forEach((q, i) => lines.push(`${i + 1}. ${q.prompt}\nAnswer: ${(answers[i] || "").trim() || "(no answer)"}`));
    guided.forEach((g, i) => { if ((gp[i] || "").trim()) lines.push(`Practice ${i + 1}. ${g.prompt}\nMy working: ${gp[i].trim()}`); });
    const didIt = activities.filter((_, i) => checks[i]).map((x) => x.title);
    if (activities.length) lines.push(`Activities done: ${didIt.length ? didIt.join(", ") : "none ticked"}`);
    try {
      await api.post("/submissions", {
        assignment_id: a.id,
        response_text: lines.join("\n\n"),
        reflection: reflection.trim() || null,
        file_ids: files.map((f) => f.id),
        needs_help: needsHelp,
      });
      toast.success(needsHelp ? "Sent for help" : "Handed in! Your grown-up will take a look.");
      onChanged && onChanged();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Could not hand in. Please try again.");
    } finally { setBusy(false); }
  };

  const card = "paper-card p-5 space-y-3";
  const area = "w-full rounded-lg border px-3 py-2 text-base bg-white";
  const border = { borderColor: "#D4C8A8" };

  return (
    <div className="space-y-5 animate-in" data-testid="child-lesson">
      <Link to="/child" className="text-sm font-bold" style={{ color: "#4A5D3A" }} data-testid="back-home">← Back to my quests</Link>

      <header className={card}>
        <div className="text-xs font-mono uppercase text-stone-500">{[l.learning_area, l.duration_minutes && `${l.duration_minutes} min`].filter(Boolean).join(" · ")}</div>
        <h1 className="font-display text-3xl font-bold" style={INK} data-testid="lesson-title">{l.title}</h1>
        {l.child_mission && <p className="font-display text-lg" style={INK}>{l.child_mission}</p>}
        {(l.objectives || []).length > 1 && (
          <ul className="list-disc pl-5 text-sm text-stone-700">{l.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
        )}
      </header>

      {a.status === "needs_revision" && last?.parent_feedback && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" data-testid="revision-note">
          <strong>Your grown-up asked you to try again:</strong> {last.parent_feedback}
          {last.next_step && <div className="mt-1">Next step: {last.next_step}</div>}
        </div>
      )}
      {a.status === "submitted" && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900" data-testid="handed-in">
          You handed this in. Your grown-up will look at it soon.
        </div>
      )}
      {["accepted", "demonstrated", "completed"].includes(a.status) && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900" data-testid="reviewed-note">
          <strong>Quest complete!</strong> {last?.parent_feedback ? `Your grown-up said: ${last.parent_feedback}` : "Well done."}
          {last?.next_step && <div className="mt-1">Next step: {last.next_step}</div>}
        </div>
      )}

      {(l.introduction || materials.length > 0 || l.why_it_matters || prior.length > 0) && (
        <section className={card} data-testid="intro">
          {l.introduction && <p className="text-base leading-relaxed whitespace-pre-wrap">{l.introduction}</p>}
          {l.why_it_matters && <p className="text-base leading-relaxed"><b>Why this matters:</b> {l.why_it_matters}</p>}
          {prior.length > 0 && (
            <div>
              <p className="font-bold text-sm">Before you start, you should already know:</p>
              <ul className="list-disc pl-5 text-sm text-stone-700">{prior.map((m, i) => <li key={i}>{m}</li>)}</ul>
            </div>
          )}
          {materials.length > 0 && (
            <div className="rounded-xl border p-3 bg-white" style={border}>
              <p className="font-bold text-sm">You will need:</p>
              <ul className="list-disc pl-5 text-sm text-stone-700">{materials.map((m, i) => <li key={i}>{m}</li>)}</ul>
            </div>
          )}
        </section>
      )}

      {texts.map((t, i) => (
        <section key={`t${i}`} className={card} data-testid={`text-${i}`}>
          <h2 className="font-display text-xl font-semibold" style={INK}>{t.kind === "source" ? "Source: " : t.kind === "data" ? "Data: " : "Read: "}{t.title}</h2>
          <p className="text-base leading-relaxed whitespace-pre-wrap rounded-xl border p-4 bg-white" style={border}>{t.content}</p>
        </section>
      ))}

      {sections.map((s, i) => (
        <section key={i} className={card} data-testid={`section-${i}`}>
          {s.heading && <h2 className="font-display text-xl font-semibold" style={INK}>{s.heading}</h2>}
          <p className="text-base leading-relaxed whitespace-pre-wrap">{s.body}</p>
        </section>
      ))}

      {worked.length > 0 && (
        <section className={card} data-testid="worked-examples">
          <h2 className="font-display text-xl font-semibold" style={INK}>Watch how it is done</h2>
          {worked.map((w, i) => (
            <div key={i} className="rounded-xl border p-4 bg-white space-y-2" style={border} data-testid={`worked-${i}`}>
              <p className="font-bold">{w.title ? `${w.title}: ` : `Example ${i + 1}: `}{w.problem}</p>
              <ol className="list-decimal pl-5 space-y-1 text-base">{(w.steps || []).map((st, j) => <li key={j}>{st}</li>)}</ol>
              {w.answer && <p className="font-bold" style={INK}>Answer: {w.answer}</p>}
            </div>
          ))}
        </section>
      )}

      {mistakes.length > 0 && (
        <section className={card} data-testid="mistakes">
          <h2 className="font-display text-xl font-semibold" style={INK}>Watch out for these mistakes</h2>
          {mistakes.map((m, i) => (
            <div key={i} className="rounded-xl border p-3 bg-white" style={border}>
              <p className="font-bold">{m.mistake}</p>
              {m.fix && <p className="text-sm text-stone-700 mt-1 whitespace-pre-wrap">{m.fix}</p>}
            </div>
          ))}
        </section>
      )}

      {guided.length > 0 && (
        <section className={card} data-testid="guided-practice">
          <h2 className="font-display text-xl font-semibold" style={INK}>Try it together</h2>
          <p className="text-sm text-stone-600">Work these out with your grown-up. Use the hint if you get stuck.</p>
          {guided.map((g, i) => (
            <div key={i} className="rounded-xl border p-3 bg-white space-y-2" style={border}>
              <label htmlFor={`gp-${i}`} className="font-bold block">{i + 1}. {g.prompt}</label>
              <textarea id={`gp-${i}`} rows={2} disabled={locked} value={gp[i] || ""} onChange={(e) => setGp({ ...gp, [i]: e.target.value })} className={area} style={border} placeholder="Show your working here" data-testid={`guided-${i}`} />
              {g.hint && (hints[i] ? <p className="text-sm text-stone-700">💡 {g.hint}</p> : <button type="button" onClick={() => setHints({ ...hints, [i]: true })} className="text-sm font-bold underline" style={{ color: "#4A5D3A" }}>Need a hint?</button>)}
            </div>
          ))}
        </section>
      )}

      {resources.length > 0 && (
        <section className={card} data-testid="resources">
          <h2 className="font-display text-xl font-semibold" style={INK}>Watch and explore</h2>
          {resources.map((r, i) =>
            r.type === "video" && r.embed_url ? (
              <div key={i}>
                <p className="text-sm font-bold mb-1">{r.title}</p>
                <div className="aspect-video w-full overflow-hidden rounded-xl border" style={border}>
                  <iframe title={r.title} src={r.embed_url} className="h-full w-full" allow="encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                </div>
              </div>
            ) : r.url ? (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="block underline font-bold" style={{ color: "#4A5D3A" }}>{r.title} ↗</a>
            ) : null
          )}
        </section>
      )}

      {activities.length > 0 && (
        <section className={card} data-testid="activities">
          <h2 className="font-display text-xl font-semibold" style={INK}>Things to do</h2>
          {activities.map((x, i) => (
            <label key={i} className="flex items-start gap-3 rounded-xl border p-3 bg-white" style={border}>
              <input type="checkbox" disabled={locked} checked={!!checks[i]} onChange={(e) => setChecks({ ...checks, [i]: e.target.checked })} className="mt-1 h-5 w-5" data-testid={`activity-${i}`} />
              <span>
                <span className="block font-bold">{x.title}{x.offline ? " (off the screen)" : ""}</span>
                {x.instructions && <span className="block text-sm text-stone-700 whitespace-pre-wrap">{x.instructions}</span>}
                {(x.tasks || []).length > 0 && <ol className="mt-2 list-decimal pl-5 space-y-1 text-sm text-stone-800">{x.tasks.map((t, j) => <li key={j}>{t.prompt}</li>)}</ol>}
              </span>
            </label>
          ))}
          <p className="text-xs text-stone-500">Tick each one when you have done it.</p>
        </section>
      )}

      {l.consolidation && (
        <section className={card} data-testid="consolidation">
          <h2 className="font-display text-xl font-semibold" style={INK}>Remember</h2>
          <p className="text-base leading-relaxed whitespace-pre-wrap">{l.consolidation}</p>
        </section>
      )}

      {questions.length > 0 && (
        <section className={card} data-testid="questions">
          <h2 className="font-display text-xl font-semibold" style={INK}>Your answers</h2>
          {questions.map((q, i) => (
            <div key={i}>
              <label htmlFor={`ans-${i}`} className="font-bold">{i + 1}. {q.prompt}</label>
              <textarea id={`ans-${i}`} rows={q.type === "long" ? 5 : 2} disabled={locked} value={answers[i] || ""} onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })} className={`mt-1 ${area}`} style={border} data-testid={`answer-${i}`} />
            </div>
          ))}
        </section>
      )}

      {hasQuiz && (
        <section className={card} data-testid="quiz-section">
          <h2 className="font-display text-xl font-semibold" style={INK}>Quest check</h2>
          {passedBefore.current ? (
            <p className="font-bold text-green-800" data-testid="quiz-passed">Quiz passed. Nice work!</p>
          ) : preview ? (
            <ol className="list-decimal pl-5 space-y-2 text-sm">{quiz.map((q, i) => <li key={i}><b>{q.question}</b><ul className="list-disc pl-5 text-stone-600">{(q.options || []).map((o, j) => <li key={j}>{o}</li>)}</ul></li>)}</ol>
          ) : locked ? (
            <p className="text-sm text-stone-600">The quiz is closed.</p>
          ) : (
            <QuestQuiz quiz={quiz} passMark={l.pass_mark || 0.7} assignmentId={a.id} onResult={(r) => setQuizOk(!!r?.passed)} />
          )}
        </section>
      )}

      {l.extension && (
        <section className={card} data-testid="extension">
          <h2 className="font-display text-xl font-semibold" style={INK}>Extra challenge</h2>
          <p className="text-base leading-relaxed whitespace-pre-wrap">{l.extension}</p>
        </section>
      )}

      {preview && <p className="rounded-xl border border-dashed p-4 text-sm text-stone-600" style={border}>The quiz and the hand-in box appear here for your child. Nothing in this preview is saved.</p>}

      {!locked && !preview && (
        <section className={card} data-testid="hand-in">
          <h2 className="font-display text-xl font-semibold" style={INK}>Hand it in</h2>
          <div>
            <label htmlFor="refl" className="font-bold text-sm">How did it go? (optional)</label>
            <textarea id="refl" rows={2} value={reflection} onChange={(e) => setReflection(e.target.value)} className={`mt-1 ${area}`} style={border} data-testid="reflection-text" />
          </div>
          {uploadsOn ? (
            <div>
              <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files[0] && upload(e.target.files[0])} data-testid="file-input" />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-xl border-2 border-dashed w-full p-4 text-sm font-bold disabled:opacity-50" style={border} data-testid="upload-btn">{uploading ? "Uploading…" : "📷 Add a photo of your work"}</button>
              {files.length > 0 && <ul className="mt-2 text-sm">{files.map((f) => <li key={f.id}>📎 {f.original_filename}</li>)}</ul>}
            </div>
          ) : (
            <p className="text-xs text-stone-500" data-testid="no-uploads">Photo uploads are not available yet. Write what you did, or show your grown-up your paper work.</p>
          )}
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={needsHelp} onChange={(e) => setNeedsHelp(e.target.checked)} data-testid="needs-help" /> I need help with this one</label>
          {!canSubmit && (
            <p className="text-sm text-amber-800" data-testid="submit-hint">
              {needsQuiz ? "Pass the quest check above to hand in." : `Answer all ${questions.length} questions to hand in (${unanswered} to go).`}
            </p>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <button type="button" onClick={() => saveNow(false)} className="rounded-full border-2 px-5 py-2.5 text-sm font-bold" style={{ borderColor: "#1F3B2D", color: "#1F3B2D" }} data-testid="save-progress">Save my progress</button>
            <button type="button" disabled={!canSubmit || busy} onClick={submit} className="rounded-full px-6 py-2.5 text-sm font-bold disabled:opacity-40" style={ACCENT} data-testid="submit-work">{busy ? "Handing in…" : needsHelp ? "Ask for help" : "Hand it in"}</button>
            <span className="text-xs text-stone-500" aria-live="polite" data-testid="save-state">{saved}</span>
          </div>
        </section>
      )}
    </div>
  );
}
