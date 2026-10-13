import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Eye, Pencil, Save, Send, Sparkles } from "lucide-react";
import { api } from "../../lib/api";
import ScheduleModal from "../../components/parent/ScheduleModal";
import ParentLessonPlayer from "../child/ParentLessonPlayer";
import exampleLesson from "../../data/exampleLesson.json";

const SUBJECTS = ["English", "Mathematics", "Science", "Humanities and Social Sciences", "Health and Physical Education", "The Arts", "Technologies", "Languages", "Life skills", "Other"];
const YEARS = ["Kindergarten / Foundation", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10"];
const STAGE_OF = { "Kindergarten / Foundation": "ES1", "Year 1": "S1", "Year 2": "S1", "Year 3": "S2", "Year 4": "S2", "Year 5": "S3", "Year 6": "S3", "Year 7": "S4", "Year 8": "S4", "Year 9": "S5", "Year 10": "S5" };

const blank = () => ({
  title: "", learning_area: "", year_level: "", objectives: [""], sections: [{ heading: "", body: "" }],
  activities: [], questions: [], quiz: [], resources: [], duration_minutes: "", curriculum_refs: "",
  offline_alternative: "", answer_key: "", parent_notes: "", status: "draft",
  delivery: "independent", introduction: "", materials: "", worked_examples: [], guided_practice: [],
  support: "", extension: "", parent_script: "", evidence_suggestions: "",
});

const field = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-slate-500";
const label = "text-xs font-semibold uppercase tracking-wider text-slate-500";

function Card({ title, hint, children, wide }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 space-y-3 ${wide ? "lg:col-span-2" : ""}`}>
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
    ai_generated: !!l.ai_generated,
    ...blank(),
    title: l.title || "", learning_area: l.learning_area || "", year_level: l.year_level || "",
    objectives: l.objectives?.length ? l.objectives : [""],
    sections: l.sections?.length ? l.sections : [{ heading: "", body: "" }],
    activities: l.activities || [], questions: l.questions || [], quiz: l.quiz || [],
    resources: (l.resources || []).map(r => ({ type: r.type === "video" ? "video" : "link", title: r.title || "", url: r.url || "" })),
    duration_minutes: l.duration_minutes ?? "", curriculum_refs: (l.curriculum_refs || []).join("\n"),
    offline_alternative: l.offline_alternative && !l.activities?.some(a => a.offline) ? l.offline_alternative : (l.offline_alternative || ""),
    answer_key: l.answer_key || "", parent_notes: l.parent_notes || "", status: l.status || "draft",
    delivery: l.delivery === "parent_guided" ? "parent_guided" : "independent",
    introduction: l.introduction || "", materials: (l.materials || []).join("\n"),
    worked_examples: (l.worked_examples || []).map(w => ({ title: w.title || "", problem: w.problem || "", steps: (w.steps || []).join("\n"), answer: w.answer || "" })),
    guided_practice: (l.guided_practice || []).map(g => ({ prompt: g.prompt || "", hint: g.hint || "", answer: g.answer || "" })),
    support: l.support || "", extension: l.extension || "", parent_script: l.parent_script || "",
    evidence_suggestions: (l.evidence_suggestions || []).join("\n"),
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
    delivery: f.delivery, introduction: f.introduction,
    materials: lines(f.materials),
    worked_examples: f.worked_examples.filter(w => w.problem.trim()).map(w => ({ title: w.title, problem: w.problem, steps: lines(w.steps), answer: w.answer })),
    guided_practice: f.guided_practice.filter(g => g.prompt.trim()).map(g => ({ prompt: g.prompt, hint: g.hint, answer: g.answer })),
    support: f.support, extension: f.extension, parent_script: f.parent_script,
    evidence_suggestions: lines(f.evidence_suggestions),
  };
}
const lines = (t) => String(t || "").split("\n").map(x => x.trim()).filter(Boolean);

/** The lesson as the child will see it: no answers, no parent guide. */
function childView(f) {
  const s = toServer(f, "draft");
  const l = {
    ...s,
    child_mission: s.objectives[0] ? `Your mission: ${s.objectives[0]}` : "",
    pass_mark: 0.7,
    questions: s.questions.map(q => ({ prompt: q.prompt, type: q.type })),
    guided_practice: s.guided_practice.map(g => ({ prompt: g.prompt, hint: g.hint })),
    quiz: s.quiz.map(({ correct_index, explanation, ...q }) => ({ ...q, type: "multiple_choice" })),
  };
  for (const k of ["answer_key", "parent_notes", "parent_script", "support", "evidence_suggestions", "curriculum_refs"]) delete l[k];
  return l;
}

const EXAMPLE = () => ({ ...fromServer(exampleLesson), status: "draft" });

export default function LessonBuilder() {
  const { id } = useParams();
  const [qs] = useSearchParams();
  const nav = useNavigate();
  const [f, setF] = useState(() => (!id && qs.get("example") ? EXAMPLE() : blank()));
  const [lessonId, setLessonId] = useState(id || null);
  const [mode, setMode] = useState("edit"); // edit | preview | split
  const preview = mode === "preview";
  const loc = useLocation();
  const aiWarnings = loc.state?.aiWarnings || [];
  const [busy, setBusy] = useState(false);
  const [assign, setAssign] = useState(null);
  const [students, setStudents] = useState([]);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [upgrade, setUpgrade] = useState(false);
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
      setUpgrade(d?.code === "UPGRADE_REQUIRED");
      return null;
    } finally { setBusy(false); }
  };

  const saveAndAssign = async () => {
    const saved = await save("ready");
    if (saved) setAssign(saved);
  };

  if (!loaded) return <div className="p-8 text-sm text-slate-500">Loading…</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1500px] space-y-5" data-testid="lesson-builder">
      <div>
        <Link to="/parent/lessons" className="mb-2 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"><ArrowLeft size={14} /> My lessons</Link>
        <h1 className="font-display text-3xl font-bold text-slate-900">{lessonId ? "Edit lesson" : qs.get("ai") ? "Build a lesson with AI" : "Create my own lesson"}</h1>
        <p className="text-sm text-slate-600 mt-1">{qs.get("ai") ? "Tell us about your child and the topic. You can edit everything afterwards." : "Write the lesson in your own words, or open the example to see how a complete lesson looks. Save a draft any time."}</p>
        {plan && plan.effective_plan === "FREE_PREVIEW" && (
          <p className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-900" data-testid="preview-banner">
            Free preview: {plan.usage.lessons} of {plan.limits.maxLessons} lessons used. Preview ends {new Date(plan.trial_ends_at).toLocaleDateString()}.
          </p>
        )}
      </div>

      {f.ai_generated && (
        <p className="rounded-lg border border-violet-300 bg-violet-50 px-3 py-2 text-sm text-violet-900" data-testid="ai-banner">
          <b>AI-generated draft.</b> Check every fact, answer and quiz question before you save it to your library. It is not checked against any curriculum.
        </p>
      )}
      {!lessonId && qs.get("ai") && plan && (
        <>
          <AiPanel allowed={!!plan.limits?.aiGeneration} onDone={(l, warnings) => { toast.success("AI draft created. Please review it before assigning."); nav(`/parent/lessons/${l.id}/edit`, { state: { aiWarnings: warnings || [] } }); }} />
          <p className="text-sm text-slate-600">Or <Link to="/parent/lessons/new" className="underline font-semibold">create your own lesson from a blank page</Link>.</p>
        </>
      )}

      {aiWarnings.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900" data-testid="ai-warnings">
          <b>This AI draft is thinner than it should be:</b> {aiWarnings.join("; ")}. Please expand it before using it, or try drafting again.
        </div>
      )}

      {error && <div role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800" data-testid="builder-error">{error} {upgrade && <Link to="/parent/plan" className="underline font-bold">See plans</Link>}</div>}

      {!(qs.get("ai") && !lessonId) && <div className="flex flex-wrap gap-2">
        {[["edit", "Edit", Pencil, "edit-tab"], ["preview", "Preview as child", Eye, "preview-tab"], ["split", "Edit and preview side by side", Eye, "split-tab"]].map(([m, text, Icon, tid]) => (
          <button key={m} onClick={() => setMode(m)} data-testid={tid} className={`${m === "split" ? "hidden xl:flex" : "flex"} rounded-full px-4 py-1.5 text-sm font-semibold border items-center gap-1 ${mode === m ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300"}`}><Icon size={14} /> {text}</button>
        ))}
      </div>}

      {(qs.get("ai") && !lessonId) ? null : preview ? <PreviewPane f={f} /> : (
        <div className={mode === "split" ? "xl:grid xl:grid-cols-2 xl:gap-6 items-start" : ""}>
        <div className={mode === "split" ? "space-y-5" : "grid lg:grid-cols-2 gap-5 items-start"}>
          <Card title="The basics" wide>
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

          <Card title="How is it taught?" hint="Parent-guided lessons come with a step-by-step teaching plan for you. Independent lessons speak straight to your child.">
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2"><input type="radio" name="delivery" checked={f.delivery === "parent_guided"} onChange={() => set("delivery", "parent_guided")} data-testid="b-delivery-parent" /> Parent-guided (you teach)</label>
              <label className="flex items-center gap-2"><input type="radio" name="delivery" checked={f.delivery === "independent"} onChange={() => set("delivery", "independent")} data-testid="b-delivery-indep" /> Independent (child works alone)</label>
            </div>
            <div>
              <label className={label}>Introduction (a hook to start the lesson)</label>
              <textarea className={field} rows={3} value={f.introduction} onChange={e => set("introduction", e.target.value)} placeholder="A short scenario or question that makes your child curious" />
            </div>
            <div>
              <label className={label}>Things you will need (one per line)</label>
              <textarea className={field} rows={2} value={f.materials} onChange={e => set("materials", e.target.value)} placeholder={"Paper and pencil\nDried beans or buttons"} />
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

          <Card wide title="Teach it" hint="Explain the idea the way you would at the table. Add as many parts as you need.">
            {f.sections.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-3 space-y-2">
                <input className={field} value={s.heading} onChange={e => upd("sections", i, { heading: e.target.value })} placeholder="Heading (optional), e.g. What is a fraction?" />
                <textarea className={field} rows={5} value={s.body} onChange={e => upd("sections", i, { body: e.target.value })} placeholder="Write your explanation here…" data-testid={`b-section-${i}`} />
                {f.sections.length > 1 && <button onClick={() => del("sections", i)} className="text-xs text-rose-700 flex items-center gap-1"><Trash2 size={12} /> Remove this part</button>}
              </div>
            ))}
            <button onClick={() => add("sections", { heading: "", body: "" })} className="text-sm font-semibold text-slate-700 flex items-center gap-1"><Plus size={14} /> Add a part</button>
          </Card>

          <Card wide title="Worked examples" hint="Show a problem solved one step at a time, so your child sees exactly how to do it. One step per line.">
            {f.worked_examples.map((w, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-3 space-y-2">
                <input className={field} value={w.title} onChange={e => upd("worked_examples", i, { title: e.target.value })} placeholder="Title (optional), e.g. Regrouping the ones" />
                <textarea className={field} rows={2} value={w.problem} onChange={e => upd("worked_examples", i, { problem: e.target.value })} placeholder="The problem" data-testid={`b-we-problem-${i}`} />
                <textarea className={field} rows={4} value={w.steps} onChange={e => upd("worked_examples", i, { steps: e.target.value })} placeholder={"Step 1…\nStep 2…"} />
                <input className={field} value={w.answer} onChange={e => upd("worked_examples", i, { answer: e.target.value })} placeholder="The answer" />
                <button onClick={() => del("worked_examples", i)} className="text-xs text-rose-700 flex items-center gap-1"><Trash2 size={12} /> Remove</button>
              </div>
            ))}
            <button onClick={() => add("worked_examples", { title: "", problem: "", steps: "", answer: "" })} className="text-sm font-semibold text-slate-700 flex items-center gap-1" data-testid="b-add-worked"><Plus size={14} /> Add a worked example</button>
          </Card>

          <Card wide title="Guided practice" hint="Questions to do together. The hint is shown if your child is stuck. The answer is only for you.">
            {f.guided_practice.map((g, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-3 space-y-2">
                <textarea className={field} rows={2} value={g.prompt} onChange={e => upd("guided_practice", i, { prompt: e.target.value })} placeholder="Question" />
                <div className="grid sm:grid-cols-2 gap-2">
                  <input className={field} value={g.hint} onChange={e => upd("guided_practice", i, { hint: e.target.value })} placeholder="Hint (child can see)" />
                  <input className={field} value={g.answer} onChange={e => upd("guided_practice", i, { answer: e.target.value })} placeholder="Answer (only you see this)" />
                </div>
                <button onClick={() => del("guided_practice", i)} className="text-xs text-rose-700 flex items-center gap-1"><Trash2 size={12} /> Remove</button>
              </div>
            ))}
            <button onClick={() => add("guided_practice", { prompt: "", hint: "", answer: "" })} className="text-sm font-semibold text-slate-700 flex items-center gap-1" data-testid="b-add-guided"><Plus size={14} /> Add a practice question</button>
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

          <Card title="Extra challenge (optional)" hint="Shown to your child at the end as a bonus.">
            <textarea className={field} rows={3} value={f.extension} onChange={e => set("extension", e.target.value)} placeholder="One or two harder tasks for a child who finishes early" />
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

          <Card wide title="For you (children never see this)">
            <div>
              <label className={label}>Parent teaching guide</label>
              <textarea className={field} rows={8} value={f.parent_script} onChange={e => set("parent_script", e.target.value)} placeholder="Step-by-step: what to say, show and ask, with timings and common mistakes" data-testid="b-parent-script" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className={label}>If your child struggles</label>
                <textarea className={field} rows={4} value={f.support} onChange={e => set("support", e.target.value)} placeholder="Simpler examples, objects to use, smaller steps" />
              </div>
              <div>
                <label className={label}>Evidence of learning (one per line)</label>
                <textarea className={field} rows={4} value={f.evidence_suggestions} onChange={e => set("evidence_suggestions", e.target.value)} placeholder={"A photo of the finished work\nChild explains it back to you"} />
              </div>
            </div>
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
        {mode === "split" && <div className="hidden xl:block sticky top-4 max-h-[calc(100vh-2rem)] overflow-auto rounded-2xl"><PreviewPane f={f} /></div>}
        </div>
      )}

      {!(qs.get("ai") && !lessonId) && <div className="sticky bottom-0 -mx-4 sm:mx-0 bg-white/95 backdrop-blur border-t sm:border sm:rounded-2xl border-slate-200 p-3 flex flex-wrap gap-2 justify-end">
        <button disabled={busy} onClick={() => save("draft")} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold flex items-center gap-1 disabled:opacity-50" data-testid="b-save-draft"><Save size={14} /> Save draft</button>
        <button disabled={busy} onClick={() => save("ready")} className="rounded-full border border-slate-900 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50" data-testid="b-save-library">Save to library</button>
        <button disabled={busy} onClick={saveAndAssign} className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold flex items-center gap-1 disabled:opacity-50" data-testid="b-save-assign"><Send size={14} /> Save and assign</button>
      </div>}

      {assign && <ScheduleModal lesson={assign} students={students} onClose={() => { setAssign(null); nav("/parent/lessons"); }} />}
    </div>
  );
}

function PreviewPane({ f }) {
  const lesson = childView(f);
  const fake = { id: "preview", status: "not_started", lesson, submissions: [], draft: null, quiz_passed: false };
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#F5EFE0] p-4 sm:p-6" data-testid="builder-preview">
      <p className="text-xs text-slate-600 mb-3">This is exactly what your child will see. Answers and your teaching guide are hidden from them.</p>
      <ParentLessonPlayer assignment={fake} preview />
    </div>
  );
}

function AiPanel({ allowed, onDone }) {
  const [open, setOpen] = useState(true);
  const [v, setV] = useState({ year_level: "", learning_area: "", topic: "", goal: "", duration_minutes: "45", delivery: "parent_guided", interests: "", needs: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const field = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";
  const lab = "text-xs font-semibold uppercase tracking-wider text-slate-500";
  if (!allowed) {
    return (
      <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 text-sm" data-testid="ai-upsell">
        <p className="font-semibold text-violet-900 flex items-center gap-1"><Sparkles size={16} /> Build with AI</p>
        <p className="text-slate-700 mt-1">AI lesson drafting is part of the paid Family Membership. Building lessons by hand works fully on the free preview. <Link to="/parent/plan" className="underline font-semibold">See plans</Link></p>
      </div>
    );
  }
  const go = async () => {
    setErr(""); setBusy(true);
    try {
      const body = { ...v, duration_minutes: Number(v.duration_minutes), stage: STAGE_OF[v.year_level] || "" };
      const r = await api.post("/ai/lesson-draft", body);
      onDone(r.data.lesson, r.data.warnings);
    } catch (e) { setErr(e.response?.data?.detail || "Could not create a draft. You can still build the lesson by hand."); }
    finally { setBusy(false); }
  };
  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 space-y-3" data-testid="ai-panel">
      <button onClick={() => setOpen(o => !o)} className="font-semibold text-violet-900 flex items-center gap-1" data-testid="ai-toggle"><Sparkles size={16} /> Build with AI {open ? "−" : "+"}</button>
      {open && (
        <div className="space-y-3">
          <p className="text-xs text-slate-600">An AI model writes a full first draft: introduction, teaching, worked examples, practice, questions and a quiz, plus a guide for you. It can make mistakes, so read it and check every fact and answer. Drafts are saved as drafts and are not checked against any curriculum. You can edit everything afterwards, or start from a blank lesson instead.</p>
          <div className="grid md:grid-cols-3 gap-3">
            <div><label className={lab}>Year level or age</label><input list="ai-years" className={field} value={v.year_level} onChange={e => setV({ ...v, year_level: e.target.value })} placeholder="Year 3, or age 8" data-testid="ai-year" /><datalist id="ai-years">{YEARS.map(y => <option key={y} value={y} />)}</datalist></div>
            <div><label className={lab}>Subject</label><select className={field} value={v.learning_area} onChange={e => setV({ ...v, learning_area: e.target.value })} data-testid="ai-subject"><option value="">Choose…</option>{SUBJECTS.map(x => <option key={x}>{x}</option>)}</select></div>
            <div><label className={lab}>Lesson length</label><select className={field} value={v.duration_minutes} onChange={e => setV({ ...v, duration_minutes: e.target.value })} data-testid="ai-minutes">{[15, 30, 45, 60, 90].map(m => <option key={m} value={m}>{m} minutes</option>)}</select></div>
          </div>
          <div><label className={lab}>Topic</label><input className={field} value={v.topic} onChange={e => setV({ ...v, topic: e.target.value })} placeholder="e.g. Adding two-digit numbers with regrouping" maxLength={300} data-testid="ai-topic" /></div>
          <div><label className={lab}>Specific learning goal (optional)</label><input className={field} value={v.goal} onChange={e => setV({ ...v, goal: e.target.value })} placeholder="e.g. Be able to add two 2-digit numbers when the ones make more than 10" maxLength={400} data-testid="ai-goal" /></div>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="radio" name="ai-delivery" checked={v.delivery === "parent_guided"} onChange={() => setV({ ...v, delivery: "parent_guided" })} data-testid="ai-parent" /> Parent-guided (I teach)</label>
            <label className="flex items-center gap-2"><input type="radio" name="ai-delivery" checked={v.delivery === "independent"} onChange={() => setV({ ...v, delivery: "independent" })} data-testid="ai-indep" /> Independent (my child works alone)</label>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div><label className={lab}>Child's interests (optional)</label><input className={field} value={v.interests} onChange={e => setV({ ...v, interests: e.target.value })} placeholder="e.g. gardening, dinosaurs, Minecraft" maxLength={300} data-testid="ai-interests" /></div>
            <div><label className={lab}>Additional learning needs (optional)</label><input className={field} value={v.needs} onChange={e => setV({ ...v, needs: e.target.value })} placeholder="e.g. short attention span, dyslexia, needs extra time" maxLength={400} /></div>
          </div>
          <div><label className={lab}>Anything else the AI should know (optional)</label><textarea className={field} rows={2} value={v.notes} onChange={e => setV({ ...v, notes: e.target.value })} placeholder="e.g. We have no printer; use things from around the house" maxLength={800} /></div>
          {err && <p role="alert" className="text-sm text-rose-700" data-testid="ai-error">{err}</p>}
          <button disabled={busy || v.topic.trim().length < 3} onClick={go} className="rounded-full bg-violet-700 text-white px-5 py-2 text-sm font-semibold disabled:opacity-50" data-testid="ai-go">{busy ? "Writing your lesson… this can take a minute or two" : "Create draft lesson"}</button>
        </div>
      )}
    </div>
  );
}
