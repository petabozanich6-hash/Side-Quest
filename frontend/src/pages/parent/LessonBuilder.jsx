import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Eye, Pencil, Save, Send } from "lucide-react";
import { api } from "../../lib/api";
import ScheduleModal from "../../components/parent/ScheduleModal";

const SUBJECTS = ["English", "Mathematics", "Science", "Humanities and Social Sciences", "Health and Physical Education", "The Arts", "Technologies", "Languages", "Life skills", "Other"];
const YEARS = ["Kindergarten / Foundation", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10"];
const STAGE_OF = { "Kindergarten / Foundation": "ES1", "Year 1": "S1", "Year 2": "S1", "Year 3": "S2", "Year 4": "S2", "Year 5": "S3", "Year 6": "S3", "Year 7": "S4", "Year 8": "S4", "Year 9": "S5", "Year 10": "S5" };

const blank = () => ({
  title: "", learning_area: "", year_level: "", objectives: [""], sections: [{ heading: "", body: "" }],
  activities: [], questions: [], quiz: [], resources: [], duration_minutes: "", curriculum_refs: "",
  offline_alternative: "", answer_key: "", parent_notes: "", status: "draft",
});

const field = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-slate-500";
const label = "text-xs font-semibold uppercase tracking-wider text-slate-500";

function Card({ title, hint, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
      <div>
        <h2 className="font-display text-lg font-semibold text-slate-900">{title}</h2>
        {hint && <p className="text-xs text-slate-500 mt-0.5">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function fromServer(l) {
  return {
    ...blank(),
    title: l.title || "", learning_area: l.learning_area || "", year_level: l.year_level || "",
    objectives: l.objectives?.length ? l.objectives : [""],
    sections: l.sections?.length ? l.sections : [{ heading: "", body: "" }],
    activities: l.activities || [], questions: l.questions || [], quiz: l.quiz || [],
    resources: (l.resources || []).map(r => ({ type: r.type === "video" ? "video" : "link", title: r.title || "", url: r.url || "" })),
    duration_minutes: l.duration_minutes ?? "", curriculum_refs: (l.curriculum_refs || []).join("\n"),
    offline_alternative: l.offline_alternative && !l.activities?.some(a => a.offline) ? l.offline_alternative : (l.offline_alternative || ""),
    answer_key: l.answer_key || "", parent_notes: l.parent_notes || "", status: l.status || "draft",
  };
}

function toServer(f, status) {
  return {
    title: f.title, learning_area: f.learning_area, year_level: f.year_level, stage: STAGE_OF[f.year_level] || "",
    status,
    objectives: f.objectives.map(s => s.trim()).filter(Boolean),
    sections: f.sections.filter(s => s.body.trim()).map(s => ({ heading: s.heading, body: s.body })),
    activities: f.activities.filter(a => a.title.trim()).map(a => ({ title: a.title, instructions: a.instructions || "", offline: !!a.offline })),
    questions: f.questions.filter(q => q.prompt.trim()).map(q => ({ prompt: q.prompt, type: q.type === "long" ? "long" : "short", answer_key: q.answer_key || "" })),
    quiz: f.quiz.filter(q => q.question.trim()).map(q => ({ question: q.question, options: q.options.filter(o => o.trim()), correct_index: q.correct_index, explanation: q.explanation || "" })),
    resources: f.resources.filter(r => r.title.trim() && r.url.trim()).map(r => ({ type: r.type, title: r.title, url: r.url })),
    duration_minutes: f.duration_minutes === "" ? null : Number(f.duration_minutes),
    curriculum_refs: f.curriculum_refs.split("\n").map(s => s.trim()).filter(Boolean),
    offline_alternative: f.offline_alternative, answer_key: f.answer_key, parent_notes: f.parent_notes,
  };
}

const EXAMPLE = () => ({
  ...blank(),
  title: "Halves and quarters", learning_area: "Mathematics", year_level: "Year 3", duration_minutes: "30",
  objectives: ["I can split a shape into halves and quarters"],
  sections: [{ heading: "What is a fraction?", body: "A half is one of two equal parts. A quarter is one of four equal parts. Fold a piece of paper in two to make halves, then in two again to make quarters." }],
  activities: [{ title: "Fold a paper square", instructions: "Fold it into halves, then quarters. Colour one quarter.", offline: true }],
  questions: [{ prompt: "How many quarters make a whole?", type: "short", answer_key: "Four" }],
  quiz: [{ question: "Which is bigger, a half or a quarter?", options: ["A quarter", "A half"], correct_index: 1, explanation: "A half is made of two quarters." }],
  parent_notes: "An example to show how a lesson looks. Change anything you like.", answer_key: "Four quarters make a whole. A half is bigger than a quarter.",
});

export default function LessonBuilder() {
  const { id } = useParams();
  const [qs] = useSearchParams();
  const nav = useNavigate();
  const [f, setF] = useState(() => (!id && qs.get("example") ? EXAMPLE() : blank()));
  const [lessonId, setLessonId] = useState(id || null);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [assign, setAssign] = useState(null);
  const [students, setStudents] = useState([]);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(!id);

  useEffect(() => {
    api.get("/students").then(r => setStudents(r.data)).catch(() => {});
    api.get("/account/plan").then(r => setPlan(r.data)).catch(() => {});
    if (id) {
      api.get(`/lessons/${id}`).then(r => { setF(fromServer(r.data)); setLoaded(true); })
        .catch(e => { setError(e.response?.data?.detail || "Could not open this lesson"); setLoaded(true); });
    }
  }, [id]);

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const upd = (k, i, patch) => setF(p => ({ ...p, [k]: p[k].map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const add = (k, item) => setF(p => ({ ...p, [k]: [...p[k], item] }));
  const del = (k, i) => setF(p => ({ ...p, [k]: p[k].filter((_, j) => j !== i) }));

  const save = async (status) => {
    setError("");
    if (!f.title.trim()) { setError("Give your lesson a title first."); return null; }
    setBusy(true);
    try {
      const body = toServer(f, status);
      const r = lessonId ? await api.put(`/lessons/${lessonId}`, body) : await api.post("/lessons", body);
      setLessonId(r.data.id);
      set("status", status);
      if (!lessonId) nav(`/parent/lessons/${r.data.id}/edit`, { replace: true });
      toast.success(status === "ready" ? "Saved to your library" : "Draft saved");
      return r.data;
    } catch (e) {
      const d = e.response?.data;
      setError(d?.detail || "Could not save. Please try again.");
      return null;
    } finally { setBusy(false); }
  };

  const saveAndAssign = async () => {
    const saved = await save("ready");
    if (saved) setAssign(saved);
  };

  if (!loaded) return <div className="p-8 text-sm text-slate-500">Loading…</div>;

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-4xl space-y-5" data-testid="lesson-builder">
      <div>
        <Link to="/parent/lessons" className="mb-2 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"><ArrowLeft size={14} /> My lessons</Link>
        <h1 className="font-display text-3xl font-bold text-slate-900">{lessonId ? "Edit lesson" : "Create a lesson"}</h1>
        <p className="text-sm text-slate-600 mt-1">Write the lesson in your own words. Nothing technical needed. Save a draft any time.</p>
        {plan && plan.effective_plan === "FREE_PREVIEW" && (
          <p className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-900" data-testid="preview-banner">
            Free preview: {plan.usage.lessons} of {plan.limits.maxLessons} lessons used. Preview ends {new Date(plan.trial_ends_at).toLocaleDateString()}.
          </p>
        )}
      </div>

      {error && <div role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800" data-testid="builder-error">{error}</div>}

      <div className="flex gap-2">
        <button onClick={() => setPreview(false)} className={`rounded-full px-4 py-1.5 text-sm font-semibold border flex items-center gap-1 ${!preview ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300"}`}><Pencil size={14} /> Edit</button>
        <button onClick={() => setPreview(true)} className={`rounded-full px-4 py-1.5 text-sm font-semibold border flex items-center gap-1 ${preview ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300"}`} data-testid="preview-tab"><Eye size={14} /> Preview</button>
      </div>

      {preview ? <Preview f={f} /> : (
        <div className="space-y-5">
          <Card title="The basics">
            <div>
              <label className={label}>Lesson title</label>
              <input className={field} value={f.title} onChange={e => set("title", e.target.value)} maxLength={200} placeholder="e.g. Adding fractions with the same denominator" data-testid="b-title" />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className={label}>Subject</label>
                <select className={field} value={f.learning_area} onChange={e => set("learning_area", e.target.value)} data-testid="b-subject">
                  <option value="">Choose…</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Year level</label>
                <select className={field} value={f.year_level} onChange={e => set("year_level", e.target.value)} data-testid="b-year">
                  <option value="">Any</option>
                  {YEARS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Time (minutes)</label>
                <input className={field} type="number" min="1" max="600" value={f.duration_minutes} onChange={e => set("duration_minutes", e.target.value)} placeholder="30" />
              </div>
            </div>
          </Card>

          <Card title="What will your child learn?" hint="One or more goals, in plain words.">
            {f.objectives.map((o, i) => (
              <div key={i} className="flex gap-2">
                <input className={field} value={o} onChange={e => setF(p => ({ ...p, objectives: p.objectives.map((x, j) => (j === i ? e.target.value : x)) }))} placeholder="I can add fractions that have the same bottom number" data-testid={`b-obj-${i}`} />
                {f.objectives.length > 1 && <button onClick={() => setF(p => ({ ...p, objectives: p.objectives.filter((_, j) => j !== i) }))} aria-label="Remove goal" className="text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>}
              </div>
            ))}
            <button onClick={() => setF(p => ({ ...p, objectives: [...p.objectives, ""] }))} className="text-sm font-semibold text-slate-700 flex items-center gap-1"><Plus size={14} /> Add another goal</button>
          </Card>

          <Card title="Teach it" hint="Explain the idea the way you would at the table. Add as many parts as you need.">
            {f.sections.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-3 space-y-2">
                <input className={field} value={s.heading} onChange={e => upd("sections", i, { heading: e.target.value })} placeholder="Heading (optional), e.g. What is a fraction?" />
                <textarea className={field} rows={5} value={s.body} onChange={e => upd("sections", i, { body: e.target.value })} placeholder="Write your explanation here…" data-testid={`b-section-${i}`} />
                {f.sections.length > 1 && <button onClick={() => del("sections", i)} className="text-xs text-rose-700 flex items-center gap-1"><Trash2 size={12} /> Remove this part</button>}
              </div>
            ))}
            <button onClick={() => add("sections", { heading: "", body: "" })} className="text-sm font-semibold text-slate-700 flex items-center gap-1"><Plus size={14} /> Add a part</button>
          </Card>

          <Card title="Links and videos" hint="Web addresses your child can open. YouTube and Vimeo videos play inside the lesson. Only links starting with https:// are accepted.">
            {f.resources.map((r, i) => (
              <div key={i} className="grid sm:grid-cols-[110px_1fr_1.5fr_auto] gap-2 items-center">
                <select className={field} value={r.type} onChange={e => upd("resources", i, { type: e.target.value })}><option value="link">Link</option><option value="video">Video</option></select>
                <input className={field} value={r.title} onChange={e => upd("resources", i, { title: e.target.value })} placeholder="Name" />
                <input className={field} value={r.url} onChange={e => upd("resources", i, { url: e.target.value })} placeholder="https://…" />
                <button onClick={() => del("resources", i)} aria-label="Remove link" className="text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
              </div>
            ))}
            <button onClick={() => add("resources", { type: "link", title: "", url: "" })} className="text-sm font-semibold text-slate-700 flex items-center gap-1"><Plus size={14} /> Add a link or video</button>
            <p className="text-xs text-slate-500">Uploading worksheets and images will be available once file storage is switched on for your account.</p>
          </Card>

          <Card title="Activities" hint="Things to do. Tick “off the screen” for hands-on activities.">
            {f.activities.map((a, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-3 space-y-2">
                <input className={field} value={a.title} onChange={e => upd("activities", i, { title: e.target.value })} placeholder="Activity name" />
                <textarea className={field} rows={3} value={a.instructions} onChange={e => upd("activities", i, { instructions: e.target.value })} placeholder="What should your child do?" />
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={!!a.offline} onChange={e => upd("activities", i, { offline: e.target.checked })} /> Off the screen (hands-on)</label>
                  <button onClick={() => del("activities", i)} className="text-xs text-rose-700 flex items-center gap-1"><Trash2 size={12} /> Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => add("activities", { title: "", instructions: "", offline: false })} className="text-sm font-semibold text-slate-700 flex items-center gap-1" data-testid="b-add-activity"><Plus size={14} /> Add an activity</button>
          </Card>

          <Card title="Questions" hint="Your child types an answer. Add the answer if you want it for marking. Children never see it.">
            {f.questions.map((q, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-3 space-y-2">
                <input className={field} value={q.prompt} onChange={e => upd("questions", i, { prompt: e.target.value })} placeholder="Question" data-testid={`b-q-${i}`} />
                <div className="grid sm:grid-cols-[1fr_140px] gap-2">
                  <input className={field} value={q.answer_key} onChange={e => upd("questions", i, { answer_key: e.target.value })} placeholder="Answer (only you see this)" />
                  <select className={field} value={q.type} onChange={e => upd("questions", i, { type: e.target.value })}><option value="short">Short answer</option><option value="long">Longer answer</option></select>
                </div>
                <button onClick={() => del("questions", i)} className="text-xs text-rose-700 flex items-center gap-1"><Trash2 size={12} /> Remove</button>
              </div>
            ))}
            <button onClick={() => add("questions", { prompt: "", type: "short", answer_key: "" })} className="text-sm font-semibold text-slate-700 flex items-center gap-1" data-testid="b-add-question"><Plus size={14} /> Add a question</button>
          </Card>

          <Card title="Multiple-choice quiz" hint="Pick the right answer for each question. The quiz is marked automatically.">
            {f.quiz.map((q, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-3 space-y-2">
                <input className={field} value={q.question} onChange={e => upd("quiz", i, { question: e.target.value })} placeholder="Quiz question" />
                {q.options.map((o, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <input type="radio" name={`correct-${i}`} checked={q.correct_index === j} onChange={() => upd("quiz", i, { correct_index: j })} aria-label={`Option ${j + 1} is correct`} />
                    <input className={field} value={o} onChange={e => upd("quiz", i, { options: q.options.map((x, k) => (k === j ? e.target.value : x)) })} placeholder={`Option ${j + 1}`} />
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  {q.options.length < 6 ? <button onClick={() => upd("quiz", i, { options: [...q.options, ""] })} className="text-xs font-semibold text-slate-700">+ Add option</button> : <span />}
                  <button onClick={() => del("quiz", i)} className="text-xs text-rose-700 flex items-center gap-1"><Trash2 size={12} /> Remove</button>
                </div>
                <input className={field} value={q.explanation} onChange={e => upd("quiz", i, { explanation: e.target.value })} placeholder="Why is that right? (optional, shown after answering)" />
              </div>
            ))}
            <button onClick={() => add("quiz", { question: "", options: ["", ""], correct_index: 0, explanation: "" })} className="text-sm font-semibold text-slate-700 flex items-center gap-1" data-testid="b-add-quiz"><Plus size={14} /> Add a quiz question</button>
          </Card>

          <Card title="For you (children never see this)">
            <div>
              <label className={label}>Off-screen alternative</label>
              <textarea className={field} rows={2} value={f.offline_alternative} onChange={e => set("offline_alternative", e.target.value)} placeholder="A hands-on way to do this lesson without a screen" />
            </div>
            <div>
              <label className={label}>Answer key</label>
              <textarea className={field} rows={3} value={f.answer_key} onChange={e => set("answer_key", e.target.value)} placeholder="Answers and what to look for" />
            </div>
            <div>
              <label className={label}>Notes for parents</label>
              <textarea className={field} rows={3} value={f.parent_notes} onChange={e => set("parent_notes", e.target.value)} placeholder="Tips, materials to gather, things to watch for" />
            </div>
            <div>
              <label className={label}>Curriculum references (optional)</label>
              <textarea className={field} rows={2} value={f.curriculum_refs} onChange={e => set("curriculum_refs", e.target.value)} placeholder="One per line, in your own words or codes. Side-Quest does not check these." />
            </div>
          </Card>
        </div>
      )}

      <div className="sticky bottom-0 -mx-4 sm:mx-0 bg-white/95 backdrop-blur border-t sm:border sm:rounded-2xl border-slate-200 p-3 flex flex-wrap gap-2 justify-end">
        <button disabled={busy} onClick={() => save("draft")} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold flex items-center gap-1 disabled:opacity-50" data-testid="b-save-draft"><Save size={14} /> Save draft</button>
        <button disabled={busy} onClick={() => save("ready")} className="rounded-full border border-slate-900 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50" data-testid="b-save-library">Save to library</button>
        <button disabled={busy} onClick={saveAndAssign} className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold flex items-center gap-1 disabled:opacity-50" data-testid="b-save-assign"><Send size={14} /> Save and assign</button>
      </div>

      {assign && <ScheduleModal lesson={assign} students={students} onClose={() => { setAssign(null); nav("/parent/lessons"); }} />}
    </div>
  );
}

function Preview({ f }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5" data-testid="builder-preview">
      <p className="text-xs text-slate-500">This is what your child will read. Answers and your notes are hidden from them.</p>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{[f.learning_area, f.year_level, f.duration_minutes && `${f.duration_minutes} min`].filter(Boolean).join(" · ")}</div>
        <h2 className="font-display text-2xl font-bold text-slate-900">{f.title || "Untitled lesson"}</h2>
      </div>
      {f.objectives.some(Boolean) && <div><h3 className={label}>Your mission</h3><ul className="list-disc pl-5 text-sm">{f.objectives.filter(Boolean).map((o, i) => <li key={i}>{o}</li>)}</ul></div>}
      {f.sections.filter(s => s.body.trim()).map((s, i) => <div key={i}>{s.heading && <h3 className="font-semibold">{s.heading}</h3>}<p className="text-sm whitespace-pre-wrap leading-relaxed">{s.body}</p></div>)}
      {f.resources.filter(r => r.url).map((r, i) => <p key={i} className="text-sm">{r.type === "video" ? "Video" : "Link"}: {r.title || r.url}</p>)}
      {f.activities.filter(a => a.title).map((a, i) => <div key={i}><h3 className="font-semibold">{a.title}{a.offline ? " (off the screen)" : ""}</h3><p className="text-sm whitespace-pre-wrap">{a.instructions}</p></div>)}
      {f.questions.filter(q => q.prompt).map((q, i) => <div key={i}><p className="text-sm font-medium">{i + 1}. {q.prompt}</p><div className="mt-1 h-10 rounded-lg border border-dashed border-slate-300" /></div>)}
      {f.quiz.filter(q => q.question).map((q, i) => <div key={i}><p className="text-sm font-medium">{q.question}</p>{q.options.filter(Boolean).map((o, j) => <div key={j} className="text-sm rounded-lg border border-slate-200 px-3 py-1.5 mt-1">{o}</div>)}</div>)}
    </div>
  );
}
