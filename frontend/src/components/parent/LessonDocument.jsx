import React from "react";
import LessonVisual from "../shared/LessonVisual";

// One readable document for a whole lesson. Used for the parent's review screen and for printing.
//   view="parent":  everything, including answers and the teaching guide
//   view="student": a clean worksheet with writing lines and no answers
const list = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);
const Para = ({ children }) => <p className="whitespace-pre-line leading-relaxed text-[15px] text-slate-800">{children}</p>;
const H = ({ children }) => <h2 className="mt-6 mb-2 font-display text-xl font-bold text-slate-900 border-b border-slate-300 pb-1 break-after-avoid">{children}</h2>;
const Lines = ({ n = 2 }) => <div className="mt-1 mb-3">{Array.from({ length: n }).map((_, i) => <div key={i} className="h-7 border-b border-slate-400" />)}</div>;
const Ans = ({ children }) => <p className="mt-1 rounded bg-emerald-50 border border-emerald-200 px-2 py-1 text-sm text-emerald-900 whitespace-pre-line"><b>Answer:</b> {children}</p>;

export default function LessonDocument({ lesson: l, view = "parent" }) {
  const parent = view === "parent";
  const student = view === "student";
  const sections = list(l.sections);
  return (
    <article className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 print:border-0 print:p-0 print:rounded-none" data-testid="lesson-document">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900">{l.title}</h1>
        <p className="text-sm text-slate-600 mt-1">{[l.learning_area, l.year_level, l.duration_minutes ? `about ${l.duration_minutes} minutes` : "", l.delivery === "independent" ? "independent" : "parent-guided"].filter(Boolean).join(" · ")}</p>
        {student && <p className="mt-3 text-sm">Name: <span className="inline-block w-64 border-b border-slate-500 align-bottom">&nbsp;</span> &nbsp; Date: <span className="inline-block w-32 border-b border-slate-500 align-bottom">&nbsp;</span></p>}
      </header>

      {parent && l.teaching_plan && <><H>Teaching plan</H><Para>{l.teaching_plan}</Para></>}
      {list(l.objectives).length > 0 && <><H>Learning goals</H><ul className="list-disc pl-5 space-y-1 text-[15px]">{list(l.objectives).map((o, i) => <li key={i}>{o}</li>)}</ul></>}
      {list(l.materials).length > 0 && <><H>You will need</H><Para>{(Array.isArray(l.materials) ? l.materials : [l.materials]).join(", ")}</Para></>}
      {list(l.key_words).length > 0 && <><H>Words to know</H><ul className="space-y-1 text-[15px]">{list(l.key_words).map((k, i) => <li key={i}><b>{k.word}</b> — {k.meaning}</li>)}</ul></>}
      {l.introduction && <><H>Introduction</H><Para>{l.introduction}</Para></>}
      {parent && l.why_it_matters && <><H>Why it matters</H><Para>{l.why_it_matters}</Para></>}

      {parent && list(l.parent_script ? [l.parent_script] : []).length > 0 && (
        <><H>{l.delivery === "independent" ? "Your guide as the parent" : "How to teach this (your script)"}</H><Para>{l.parent_script}</Para></>
      )}
      {parent && list(l.teaching_questions).length > 0 && (
        <><H>Questions to ask</H><ul className="space-y-2 text-[15px]">{l.teaching_questions.map((q, i) => <li key={i}><b>{q.ask}</b>{q.expected && <span className="text-slate-600"> — expect: {q.expected}</span>}</li>)}</ul></>
      )}

      {list(l.texts).map((t, i) => <div key={i}><H>{t.title || "Reading"}</H><div className="rounded-lg bg-amber-50/60 border border-amber-200 p-4"><Para>{t.content}</Para></div></div>)}

      {sections.length > 0 && <H>Learn it</H>}
      {sections.map((s, i) => <div key={i} className="mb-3">{s.heading && <h3 className="font-bold text-slate-900">{s.heading}</h3>}<Para>{s.body}</Para>{s.visual && <div className="mt-2"><LessonVisual visual={s.visual} /></div>}</div>)}

      {list(l.worked_examples).length > 0 && <H>Worked examples</H>}
      {list(l.worked_examples).map((w, i) => (
        <div key={i} className="mb-4 rounded-lg border border-slate-200 p-3 break-inside-avoid">
          <p className="font-bold">{w.title || `Example ${i + 1}`}</p>
          <p className="mt-1 text-[15px]">{w.problem}</p>
          {w.visual && <div className="mt-2"><LessonVisual visual={w.visual} /></div>}
          <ol className="list-decimal pl-5 mt-1 space-y-0.5 text-[15px]">{list(w.steps).map((s, j) => <li key={j}>{s}</li>)}</ol>
          {w.answer && <p className="mt-1 font-semibold text-[15px]">Answer: {w.answer}</p>}
        </div>
      ))}

      {list(l.misconceptions).length > 0 && parent && (
        <><H>Common mistakes</H><ul className="space-y-2 text-[15px]">{l.misconceptions.map((m, i) => <li key={i}><b>{m.mistake}</b> — {m.fix}</li>)}</ul></>
      )}

      {list(l.guided_practice).length > 0 && <H>Practise together</H>}
      {list(l.guided_practice).map((g, i) => (
        <div key={i} className="mb-2 break-inside-avoid">
          <p className="text-[15px]"><b>{i + 1}.</b> {g.prompt}</p>
          {student ? <Lines n={2} /> : <>{list(g.options).length > 0 && <p className="text-sm text-slate-600">Options: {g.options.join(" · ")}</p>}{g.hint && <p className="text-sm text-slate-600">Hint: {g.hint}</p>}{parent && g.answer && <Ans>{g.answer}</Ans>}</>}
        </div>
      ))}

      {list(l.activities).length > 0 && <H>Activities</H>}
      {list(l.activities).map((a, i) => (
        <div key={i} className="mb-4 break-inside-avoid">
          <h3 className="font-bold">Activity {i + 1}: {a.title}</h3>
          {a.instructions && <Para>{a.instructions}</Para>}
          {a.visual && <div className="my-2"><LessonVisual visual={a.visual} /></div>}
          {list(a.tasks).map((t, j) => (
            <div key={j} className="mt-1">
              <p className="text-[15px]"><b>{String.fromCharCode(97 + (j % 26))}.</b> {t.prompt}</p>
              {student ? <Lines n={1} /> : parent && t.answer && <Ans>{t.answer}</Ans>}
            </div>
          ))}
        </div>
      ))}

      {list(l.questions).length > 0 && <H>Show what you know</H>}
      {list(l.questions).map((q, i) => (
        <div key={i} className="mb-2 break-inside-avoid">
          <p className="text-[15px]"><b>{i + 1}.</b> {q.prompt}</p>
          {student ? <Lines n={q.type === "long" ? 4 : 2} /> : parent && q.answer_key && <Ans>{q.answer_key}</Ans>}
        </div>
      ))}

      {list(l.quiz).length > 0 && <H>Quick quiz</H>}
      {list(l.quiz).map((q, i) => (
        <div key={i} className="mb-3 break-inside-avoid">
          <p className="text-[15px]"><b>{i + 1}.</b> {q.question}</p>
          <ul className="mt-1 space-y-0.5 text-[15px]">
            {list(q.options).map((o, j) => (
              <li key={j} className={parent && j === q.correct_index ? "font-bold text-emerald-800" : ""}>{student ? "☐" : parent && j === q.correct_index ? "✔" : "○"} {o}</li>
            ))}
          </ul>
          {parent && q.explanation && <p className="text-sm text-slate-600 mt-0.5">{q.explanation}</p>}
        </div>
      ))}

      {l.consolidation && <><H>Wrap-up</H><Para>{l.consolidation}</Para></>}
      {parent && l.support && <><H>If your child is struggling</H><Para>{l.support}</Para></>}
      {l.extension && <><H>Challenge</H><Para>{l.extension}</Para></>}
      {parent && list(l.evidence_suggestions).length > 0 && <><H>Evidence you could keep</H><ul className="list-disc pl-5 text-[15px]">{l.evidence_suggestions.map((e, i) => <li key={i}>{e}</li>)}</ul></>}
      {parent && l.answer_key && <><H>Answer key</H><Para>{l.answer_key}</Para></>}
    </article>
  );
}
