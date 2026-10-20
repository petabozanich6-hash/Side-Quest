import React from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, CircleHelp, Eye, Plus, Save, Send, Sparkles, Trash2 } from "lucide-react";
import { GUIDED_STEPS, guidedLearningSummary, lessonReadiness } from "../../lib/guidedLesson";

const input = "mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-base text-slate-900 focus:outline-none focus:border-[#4B7450] focus:ring-2 focus:ring-green-100";
const label = "block text-sm font-semibold text-slate-800";
const panel = "rounded-2xl border border-[#D5DACB] bg-white p-4 sm:p-6 space-y-5";

export default function GuidedLessonEditor({
  f, setF, students, selectedStudent, onStudent, subjects, years,
  step, setStep, busy, onSaveDraft, onSaveReady, onAssign, onPreview, onFullEditor,
}) {
  const missing = lessonReadiness(f);
  const summary = guidedLearningSummary(f);
  const set = (name, value) => setF(prev => ({ ...prev, [name]: value }));
  const changeAt = (name, index, field, value) => setF(prev => ({
    ...prev,
    [name]: prev[name].map((item, i) => i === index ? { ...item, [field]: value } : item),
  }));
  const removeAt = (name, index) => setF(prev => ({ ...prev, [name]: prev[name].filter((_, i) => i !== index) }));
  const append = (name, item) => setF(prev => ({ ...prev, [name]: [...prev[name], item] }));
  const setGoal = value => setF(prev => ({
    ...prev, objectives: prev.objectives.length ? prev.objectives.map((v, i) => i === 0 ? value : v) : [value],
  }));
  const setTeaching = value => setF(prev => ({
    ...prev,
    sections: prev.sections.length
      ? prev.sections.map((v, i) => i === 0 ? { ...v, heading: v.heading || "Let's learn", body: value } : v)
      : [{ heading: "Let's learn", body: value }],
  }));
  const next = () => setStep(Math.min(3, step + 1));
  const back = () => setStep(Math.max(0, step - 1));

  return (
    <section className="space-y-5" data-testid="guided-lesson-editor" aria-label="Guided lesson builder">
      <div className="rounded-2xl border border-[#D5DACB] bg-[#F8F7EE] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-wider uppercase text-[#527053]">Your lesson, one step at a time</p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1F3B2D] mt-1">{GUIDED_STEPS[step].title}</h2>
          </div>
          <span className="shrink-0 text-xs font-bold text-[#527053]">Step {step + 1} of 4</span>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4" aria-label="Lesson building steps">
          {GUIDED_STEPS.map((item, i) => (
            <button key={item.title} type="button" onClick={() => setStep(i)} disabled={busy}
              aria-current={i === step ? "step" : undefined}
              className={`rounded-lg border px-2 py-2 text-left text-xs sm:text-sm transition-colors ${i === step
                ? "bg-[#1F3B2D] text-white border-[#1F3B2D]" : "bg-white text-[#35543F] border-[#D5DACB]"}`}
              data-testid={`guided-step-${i}`}>
              <span className="font-bold">{i < step ? "✓ " : ""}{item.title}</span>
              <span className="hidden sm:block opacity-80 text-xs mt-1">{item.subtitle}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-3">You can save a draft at any point once you've named it. Nothing is assigned to a child until you choose to assign it.</p>
      </div>

      {step === 0 && (
        <div className={panel} data-testid="guided-idea">
          <div>
            <h3 className="font-display text-lg font-bold text-[#1F3B2D]">What are we learning today?</h3>
            <p className="text-sm text-slate-600 mt-1">Just the basics. You can leave the extras for later.</p>
          </div>
          {students.length > 0 && (
            <div>
              <label className={label} htmlFor="guided-child">Pick a child to fill in their year level (optional)</label>
              <select id="guided-child" className={input} value={selectedStudent} onChange={e => onStudent(e.target.value)} disabled={busy} data-testid="guided-child">
                <option value="">I'll choose the year myself</option>
                {students.map(s => <option value={s.id} key={s.id}>{s.name}{s.year_level ? ` · Year ${s.year_level}` : ""}</option>)}
              </select>
              <p className="text-xs text-slate-500 mt-1">This helps choose a level. It does not assign the lesson.</p>
            </div>
          )}
          <div>
            <label className={label} htmlFor="guided-title">Lesson name *</label>
            <input id="guided-title" className={input} value={f.title} onChange={e => set("title", e.target.value)} maxLength={200}
              placeholder="e.g. Why does the Moon change shape?" data-testid="guided-title" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={label} htmlFor="guided-subject">Subject *</label>
              <select id="guided-subject" className={input} value={f.learning_area} onChange={e => set("learning_area", e.target.value)} data-testid="guided-subject">
                <option value="">Choose a subject</option>
                {subjects.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="guided-year">Year level *</label>
              <select id="guided-year" className={input} value={f.year_level} onChange={e => set("year_level", e.target.value)} data-testid="guided-year">
                <option value="">Choose a year level</option>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={label} htmlFor="guided-goal">What should your child understand or be able to do? *</label>
            <textarea id="guided-goal" className={input} rows={2} value={f.objectives[0] || ""} onChange={e => setGoal(e.target.value)}
              placeholder="e.g. Explain why the Moon looks different during the month." data-testid="guided-goal" />
            <p className="text-xs text-slate-500 mt-1">One clear goal is enough. Start with “Explain…”, “Make…”, “Find…” or “Show…”.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={label} htmlFor="guided-duration">About how long? (optional)</label>
              <select id="guided-duration" className={input} value={f.duration_minutes} onChange={e => set("duration_minutes", e.target.value)} data-testid="guided-duration">
                <option value="">Flexible</option>
                {[15,20,30,45,60,75,90].map(n => <option key={n} value={n}>{n} minutes</option>)}
              </select>
            </div>
            <div>
              <span className={label}>How will they learn?</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {[["parent_guided","Together"],["independent","Independently"]].map(([value,title]) =>
                  <button type="button" key={value} onClick={() => set("delivery",value)}
                    className={`rounded-full px-4 py-2 text-sm border font-semibold ${f.delivery === value
                      ? "bg-[#1F3B2D] text-white border-[#1F3B2D]" : "bg-white text-slate-700 border-slate-300"}`}
                    aria-pressed={f.delivery === value}>{title}</button>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className={panel} data-testid="guided-teach">
          <div>
            <h3 className="font-display text-lg font-bold text-[#1F3B2D]">Explain it like you're sitting beside them</h3>
            <p className="text-sm text-slate-600 mt-1">This is the actual teaching your child will read. Break it down in everyday words—no formal lesson-plan language needed.</p>
          </div>
          <div>
            <label className={label} htmlFor="guided-intro">Start with a hook (optional)</label>
            <textarea id="guided-intro" className={input} rows={2} value={f.introduction} onChange={e => set("introduction",e.target.value)}
              placeholder="e.g. Have you noticed the Moon isn't always a circle?" />
          </div>
          <div>
            <label className={label} htmlFor="guided-explain">Teach the idea, step by step *</label>
            <textarea id="guided-explain" className={input} rows={9} value={f.sections[0]?.body || ""} onChange={e => setTeaching(e.target.value)}
              placeholder={"Start with what your child already knows.\n\nExplain the new idea in small steps.\n\nDescribe what they should notice, and why it happens.\n\nFinish by putting it into everyday words."} data-testid="guided-explain" />
            <p className="text-xs text-slate-500 mt-1">Tip: imagine explaining this to someone who has never heard of the topic. A few clear paragraphs are better than a list of instructions with no explanation.</p>
            {f.sections.length > 1 && <p className="text-xs text-violet-700 mt-2">Your {f.sections.length - 1} extra teaching section(s) are safely kept in the full editor.</p>}
          </div>
          {f.worked_examples.length ? (
            <div className="rounded-xl border border-slate-200 p-4 space-y-3">
              <h4 className="font-semibold text-[#1F3B2D]">Show one example (optional)</h4>
              <div>
                <label className={label} htmlFor="guided-example-problem">Example problem or situation</label>
                <textarea id="guided-example-problem" rows={2} className={input} value={f.worked_examples[0].problem}
                  onChange={e => changeAt("worked_examples",0,"problem",e.target.value)} placeholder="e.g. What would 3 + 4 look like with seven LEGO bricks?" />
              </div>
              <div>
                <label className={label} htmlFor="guided-example-steps">Show how to solve it, one line per step</label>
                <textarea id="guided-example-steps" rows={4} className={input} value={f.worked_examples[0].steps}
                  onChange={e => changeAt("worked_examples",0,"steps",e.target.value)} placeholder={"Step 1: ...\nStep 2: ..."} />
              </div>
              <div>
                <label className={label} htmlFor="guided-example-answer">Answer (for the worked example)</label>
                <input id="guided-example-answer" className={input} value={f.worked_examples[0].answer}
                  onChange={e => changeAt("worked_examples",0,"answer",e.target.value)} placeholder="The result" />
              </div>
              <button type="button" className="text-sm font-semibold text-rose-700 flex items-center gap-1"
                onClick={() => removeAt("worked_examples",0)}><Trash2 size={14}/> Remove this example</button>
              {f.worked_examples.length > 1 && <p className="text-xs text-slate-500">Other worked examples remain available in the full editor.</p>}
            </div>
          ) : (
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold"
              onClick={() => append("worked_examples",{ title:"",problem:"",steps:"",answer:"" })} data-testid="guided-add-example"><Plus size={15}/> Show a worked example</button>
          )}
        </div>
      )}

      {step === 2 && (
        <div className={panel} data-testid="guided-try">
          <div>
            <h3 className="font-display text-lg font-bold text-[#1F3B2D]">Now let your child have a go</h3>
            <p className="text-sm text-slate-600 mt-1">Choose a hands-on activity, a written question, or both. You don't have to make a quiz.</p>
          </div>
          {f.activities.map((activity,i) => (
            <div key={i} className="rounded-xl border border-[#D5DACB] bg-[#F8FAF7] p-4 space-y-3" data-testid="guided-activity">
              <div className="flex justify-between items-center gap-2"><h4 className="font-semibold">Activity {i+1}</h4>
                <button type="button" aria-label={`Remove activity ${i+1}`} onClick={() => removeAt("activities",i)} className="text-rose-700"><Trash2 size={16}/></button></div>
              <div><label className={label} htmlFor={`guided-activity-title-${i}`}>What will they do?</label>
                <input id={`guided-activity-title-${i}`} className={input} value={activity.title} onChange={e => changeAt("activities",i,"title",e.target.value)}
                  placeholder="e.g. Make the phases of the Moon with biscuits" /></div>
              <div><label className={label} htmlFor={`guided-activity-instructions-${i}`}>Instructions for the child</label>
                <textarea id={`guided-activity-instructions-${i}`} className={input} rows={5} value={activity.instructions}
                  onChange={e => changeAt("activities",i,"instructions",e.target.value)}
                  placeholder={"Tell them what to gather, exactly what to do and what to look for.\nThen ask them to explain or show what they noticed."}/></div>
              <label className="flex gap-2 items-center text-sm text-slate-700"><input type="checkbox" checked={!!activity.offline}
                onChange={e => changeAt("activities",i,"offline",e.target.checked)} /> This happens off-screen (hands-on)</label>
            </div>
          ))}
          <button type="button" className="inline-flex items-center gap-2 border border-[#66846B] text-[#1F3B2D] bg-white px-4 py-2 rounded-full font-semibold text-sm"
            onClick={() => append("activities",{title:"", instructions:"", offline:true, tasks:[]})} data-testid="guided-add-activity"><Plus size={15}/> Add a hands-on activity</button>

          {f.questions.map((q,i)=>(
            <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-3" data-testid="guided-question">
              <div className="flex justify-between items-center gap-2"><h4 className="font-semibold">Question {i+1}</h4>
                <button type="button" aria-label={`Remove question ${i+1}`} onClick={() => removeAt("questions",i)} className="text-rose-700"><Trash2 size={16}/></button></div>
              <div><label className={label} htmlFor={`guided-question-text-${i}`}>What do you want them to answer?</label>
                <textarea id={`guided-question-text-${i}`} className={input} rows={2} value={q.prompt}
                  onChange={e => changeAt("questions",i,"prompt",e.target.value)} placeholder="e.g. Why is only part of the Moon lit?"/></div>
              <div><label className={label} htmlFor={`guided-question-answer-${i}`}>Suggested answer (parents only, optional)</label>
                <textarea id={`guided-question-answer-${i}`} className={input} rows={2} value={q.answer_key || ""}
                  onChange={e => changeAt("questions",i,"answer_key",e.target.value)} placeholder="What you hope they'll explain in their own words"/></div>
            </div>
          ))}
          <button type="button" className="inline-flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-full font-semibold text-sm"
            onClick={() => append("questions",{prompt:"",type:"short",answer_key:""})} data-testid="guided-add-question"><Plus size={15}/> Add a question</button>
          {f.guided_practice.some(x => x.prompt.trim()) && <p className="text-xs text-slate-600">Your existing guided practice is also part of this lesson and can be edited in the full editor.</p>}
        </div>
      )}

      {step === 3 && (
        <div className={panel} data-testid="guided-review">
          <div className="flex gap-3 items-start">
            <BookOpen className="text-[#456A4F] shrink-0" />
            <div><h3 className="font-display text-xl font-bold text-[#1F3B2D]">You've built a real lesson</h3>
              <p className="text-sm text-slate-600">Check the essentials and then save it for later or assign it. You can keep editing any time.</p></div>
          </div>
          <div className="rounded-xl bg-[#F8F7EE] border border-[#D5DACB] p-4 space-y-2">
            <p className="font-display text-lg font-bold">{summary.lesson}</p>
            <p className="text-sm text-slate-700">{f.learning_area || "Subject needed"} · {f.year_level || "Year needed"} · {f.duration_minutes || "Flexible"}{f.duration_minutes ? " minutes" : ""}</p>
            <p className="text-sm"><span className="font-semibold">Learning goal: </span>{summary.goal}</p>
            <p className="text-sm text-slate-600">{summary.activities} activity/activities · {summary.questions} written question(s) · {summary.examples} worked example(s)</p>
          </div>
          {missing.length ? (
            <div role="status" className="border border-amber-300 bg-amber-50 rounded-xl p-4" data-testid="guided-missing">
              <h4 className="font-semibold text-amber-900 flex items-center gap-2"><CircleHelp size={17}/> A few things to finish before assigning</h4>
              <p className="text-sm text-amber-900 mt-1">A draft can be saved now, but a child needs these pieces for a complete lesson:</p>
              <ul className="mt-2 space-y-1.5">{missing.map((item,i)=><li key={i}>
                <button type="button" onClick={() => setStep(item.step)} className="text-left underline text-sm text-amber-900">{item.label} — go to step {item.step+1}</button>
              </li>)}</ul>
            </div>
          ) : <p className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-semibold text-emerald-900" data-testid="guided-complete"><Check className="inline mr-2" size={16}/> All the essentials are here. Have a look through before giving it to your child.</p>}
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className={label} htmlFor="guided-wrap-up">How should your child wrap up? (optional)</label>
              <textarea id="guided-wrap-up" className={input} rows={3} value={f.consolidation} onChange={e => set("consolidation",e.target.value)}
                placeholder="e.g. Tell someone two things you learnt and show your model."/></div>
            <div><label className={label} htmlFor="guided-evidence">What could you save as evidence? (optional)</label>
              <textarea id="guided-evidence" className={input} rows={3} value={f.evidence_suggestions} onChange={e => set("evidence_suggestions",e.target.value)}
                placeholder="e.g. Photo of model, a short written explanation, a drawing."/>
              <p className="text-xs text-slate-500 mt-1">Suggestions only—not automatic proof of curriculum achievement.</p></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onPreview} className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold flex items-center gap-2"
              data-testid="guided-preview"><Eye size={16}/> Preview as child</button>
            <button type="button" onClick={onSaveDraft} disabled={busy || !f.title.trim()} className="rounded-full border border-[#4D7657] text-[#1F3B2D] px-4 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
              data-testid="guided-save-draft"><Save size={16}/> Save draft</button>
            <button type="button" onClick={onSaveReady} disabled={busy || missing.length>0} className="rounded-full bg-[#1F3B2D] text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
              data-testid="guided-save-ready">Save to lesson library</button>
            <button type="button" onClick={onAssign} disabled={busy || missing.length>0} className="rounded-full bg-violet-700 text-white px-4 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
              data-testid="guided-save-assign"><Send size={16}/> Save and choose who gets it</button>
          </div>
          <p className="text-xs text-slate-600">Answers you entered for questions stay in the parent view; children only see the prompts. The full editor is always available for quizzes, curriculum references and extra teaching sections.</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={back} disabled={step === 0 || busy} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
          data-testid="guided-back"><ArrowLeft size={16}/> Back</button>
        <div className="flex gap-2 flex-wrap justify-end">
          {step !== 3 && <button type="button" onClick={onSaveDraft} disabled={busy || !f.title.trim()} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50"
            data-testid="guided-save-anytime">Save draft</button>}
          {step < 3
            ? <button type="button" onClick={next} disabled={busy} className="rounded-full bg-[#1F3B2D] text-white px-5 py-2 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                data-testid="guided-next">Next <ArrowRight size={16}/></button>
            : <button type="button" onClick={onFullEditor} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold"
                data-testid="guided-more-options"><Sparkles className="inline mr-1" size={14}/> More editing options</button>}
        </div>
      </div>
    </section>
  );
}
