import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Printer, Eye, X, Send, Trash2, ArrowLeft, BookOpen, Layers } from "lucide-react";
import ScheduleModal from "../../components/parent/ScheduleModal";

// NESA stages and the school years they cover.
const STAGES = [
  { name: "Early Stage 1", years: "Kindergarten" },
  { name: "Stage 1", years: "Years 1-2" },
  { name: "Stage 2", years: "Years 3-4" },
  { name: "Stage 3", years: "Years 5-6" },
  { name: "Stage 4", years: "Years 7-8" },
  { name: "Stage 5", years: "Years 9-10" },
];

// Subject cards shown inside every stage. Lessons with another learning area get their own extra card.
const SUBJECTS = ["English", "Mathematics", "Science and Technology", "HSIE", "Creative Arts", "PDHPE"];

const stageForYear = (n) => {
  if (n === 0) return "Early Stage 1";
  if (n <= 2) return "Stage 1";
  if (n <= 4) return "Stage 2";
  if (n <= 6) return "Stage 3";
  if (n <= 8) return "Stage 4";
  if (n <= 10) return "Stage 5";
  return null;
};

// Work out which NESA stage(s) a lesson belongs to. The stage field wins; the year level is the fallback.
const stagesOf = (l) => {
  const s = String(l.stage || "");
  if (/early/i.test(s)) return ["Early Stage 1"];
  const m = s.match(/[1-6]/);
  if (m) return [`Stage ${m[0]}`];
  const yl = String(l.year_level || "");
  const out = new Set();
  if (/kinder|foundation/i.test(yl)) out.add("Early Stage 1");
  const nums = (yl.match(/\d+/g) || []).map(Number);
  let list = nums;
  if (nums.length === 2 && /[-\u2013\u2014]|\bto\b/i.test(yl) && nums[0] < nums[1]) {
    list = [];
    for (let n = nums[0]; n <= nums[1]; n++) list.push(n);
  }
  list.forEach(n => { const st = stageForYear(n); if (st) out.add(st); });
  return out.size ? [...out] : ["Other"];
};

// Group free-text learning areas under the standard subject names.
const subjectOf = (l) => {
  const a = String(l.learning_area || "").trim();
  if (/english/i.test(a)) return "English";
  if (/math/i.test(a)) return "Mathematics";
  if (/science|technolog|stem/i.test(a)) return "Science and Technology";
  if (/hsie|history|geograph|human society|civics/i.test(a)) return "HSIE";
  if (/creative|visual art|music|drama|dance/i.test(a)) return "Creative Arts";
  if (/pdhpe|health|physical|personal development/i.test(a)) return "PDHPE";
  return a || "Other";
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [view, setView] = useState(null);
  const [assignOpen, setAssignOpen] = useState(null);
  const [params, setParams] = useSearchParams();
  const stage = params.get("stage");
  const subject = params.get("subject");

  const load = () => api.get("/lessons").then(r => setLessons(r.data));
  useEffect(() => {
    load();
    api.get("/students").then(r => setStudents(r.data));
  }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this lesson? Submissions remain for your records.")) return;
    try { await api.delete(`/lessons/${id}`); toast.success("Deleted"); load(); }
    catch (err) { toast.error(err.response?.data?.detail || "Failed"); }
  };

  const printLesson = (l) => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>${l.title}</title><style>body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 20px;color:#111;}h1{font-size:24px;}h2{font-size:16px;margin-top:24px;border-bottom:1px solid #ccc;padding-bottom:4px;}p,li{line-height:1.6;font-size:14px;}</style></head><body><h1>${l.title}</h1><p><strong>Stage:</strong> ${l.stage} · <strong>Learning area:</strong> ${l.learning_area} · <strong>Duration:</strong> ${l.duration_minutes} min</p><h2>Learning intention</h2><p>${l.learning_intention||""}</p><h2>Success criteria</h2><ul>${(l.success_criteria||[]).map(c=>`<li>${c}</li>`).join("")}</ul><h2>Materials</h2><ul>${(l.materials||[]).map(m=>`<li>${m}</li>`).join("")}</ul><h2>Key vocabulary</h2><ul>${(l.key_vocabulary||[]).map(k=>`<li>${k}</li>`).join("")}</ul><h2>Explicit teaching</h2><p>${(l.explicit_teaching||"").replace(/\n/g,"<br/>")}</p><h2>Worked example</h2><p>${l.worked_example||""}</p><h2>Guided practice</h2><p>${l.guided_practice||""}</p><h2>Independent task</h2><p>${l.independent_task||""}</p><h2>Response</h2><p>${l.response_prompt||""}</p><h2>Evidence</h2><p>${l.evidence_requirement||""}</p><h2>Offline alternative</h2><p>${l.offline_alternative||""}</p><h2>Reflection</h2><p>${l.reflection_prompt||""}</p><p style="margin-top:40px;font-size:11px;color:#666;">Source note: ${l.source_note||"Parent verifies curriculum alignment."}</p></body></html>`);
    w.document.close(); w.print();
  };

  const stageCounts = {};
  lessons.forEach(l => stagesOf(l).forEach(s => { stageCounts[s] = (stageCounts[s] || 0) + 1; }));
  const extraStages = Object.keys(stageCounts).filter(s => !STAGES.some(x => x.name === s));
  const stageCards = [...STAGES, ...extraStages.map(name => ({ name, years: "" }))];

  const inStage = stage ? lessons.filter(l => stagesOf(l).includes(stage)) : [];
  const subjectCounts = {};
  inStage.forEach(l => { const s = subjectOf(l); subjectCounts[s] = (subjectCounts[s] || 0) + 1; });
  const extraSubjects = Object.keys(subjectCounts).filter(s => !SUBJECTS.includes(s));
  const subjectCards = [...SUBJECTS, ...extraSubjects];
  const visibleLessons = stage && subject ? inStage.filter(l => subjectOf(l) === subject) : [];

  const stageYears = (STAGES.find(s => s.name === stage) || {}).years;
  const heading = !stage ? "Lessons" : !subject ? stage : `${stage} ${subject}`;
  const subheading = !stage
    ? "Choose a NESA stage to see its subjects."
    : !subject
      ? `${stageYears ? stageYears + ". " : ""}Choose a subject to see its premade lessons.`
      : "Premade lessons aligned to the curriculum outcomes for this stage and subject.";

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="lessons-page">
      <div className="flex items-end justify-between">
        <div>
          {stage && !subject && (
            <button onClick={() => setParams({})} className="mb-2 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900" data-testid="back-to-stages"><ArrowLeft size={14}/> All stages</button>
          )}
          {stage && subject && (
            <button onClick={() => setParams({ stage })} className="mb-2 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900" data-testid="back-to-subjects"><ArrowLeft size={14}/> All {stage} subjects</button>
          )}
          <h1 className="font-display text-3xl font-bold text-slate-900">{heading}</h1>
          <p className="text-sm text-slate-600 mt-1">{subheading}</p>
        </div>
      </div>

      {!stage && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="stage-cards">
          {stageCards.map(s => (
            <button key={s.name} onClick={() => setParams({ stage: s.name })} className="text-left rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-400 transition" data-testid={`stage-${s.name}`}>
              <Layers size={18} className="text-slate-500"/>
              <div className="font-display text-lg font-semibold text-slate-900 mt-3">{s.name}</div>
              {s.years && <div className="text-xs text-slate-500 mt-0.5">{s.years}</div>}
              <div className="text-xs text-slate-500 mt-1">{stageCounts[s.name] ? `${stageCounts[s.name]} lesson${stageCounts[s.name] === 1 ? "" : "s"}` : "No lessons yet"}</div>
            </button>
          ))}
        </div>
      )}

      {stage && !subject && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="subject-cards">
          {subjectCards.map(s => (
            <button key={s} onClick={() => setParams({ stage, subject: s })} className="text-left rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-400 transition" data-testid={`subject-${s}`}>
              <BookOpen size={18} className="text-slate-500"/>
              <div className="font-display text-lg font-semibold text-slate-900 mt-3">{s}</div>
              <div className="text-xs text-slate-500 mt-1">{subjectCounts[s] ? `${subjectCounts[s]} lesson${subjectCounts[s] === 1 ? "" : "s"}` : "No lessons yet"}</div>
            </button>
          ))}
        </div>
      )}

      {stage && subject && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleLessons.map(l => (
            <div key={l.id} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col" data-testid={`lesson-${l.id}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{l.stage} · {l.learning_area}{l.is_side_quest ? " · Side Quest" : ""}</div>
                  <h3 className="font-display text-lg font-semibold text-slate-900 mt-1 leading-tight">{l.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 line-clamp-3">{l.learning_intention}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {(l.outcome_codes||[]).map(c => <span key={c} className="font-mono text-[10px] px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{c}</span>)}
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 flex-wrap">
                <Link to={`/parent/lessons/${l.id}`} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`view-${l.id}`}><Eye size={12}/> View</Link>
                <button onClick={()=>printLesson(l)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`print-${l.id}`}><Printer size={12}/> Print</button>
                <button onClick={()=>del(l.id)} className="rounded-lg border border-rose-300 text-rose-700 px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`del-lesson-${l.id}`}><Trash2 size={12}/> Delete</button>
                <button onClick={()=>setAssignOpen(l)} className="ml-auto rounded-lg bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`assign-${l.id}`}><Send size={12}/> Assign</button>
              </div>
            </div>
          ))}
          {visibleLessons.length === 0 && <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">No premade {subject} lessons for {stage} yet.</div>}
        </div>
      )}

      {view && <LessonView lesson={view} onClose={()=>setView(null)} />}
      {assignOpen && (
        <ScheduleModal lesson={assignOpen} students={students} onClose={()=>setAssignOpen(null)} />
      )}
    </div>
  );
}

function LessonView({ lesson, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="w-full max-w-3xl rounded-2xl bg-white p-8 my-8" data-testid="lesson-view">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{lesson.stage} · {lesson.learning_area}</div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">{lesson.title}</h2>
          </div>
          <button onClick={onClose} data-testid="close-view"><X size={18}/></button>
        </div>
        <Section title="Learning intention">{lesson.learning_intention}</Section>
        <Section title="Success criteria"><ul className="list-disc pl-5 space-y-1">{(lesson.success_criteria||[]).map((c,i)=><li key={i}>{c}</li>)}</ul></Section>
        <Section title="Materials">{(lesson.materials||[]).join(", ") || "—"}</Section>
        <Section title="Key vocabulary"><ul className="list-disc pl-5 space-y-1">{(lesson.key_vocabulary||[]).map((v,i)=><li key={i}>{v}</li>)}</ul></Section>
        <Section title="Prior knowledge">{lesson.prior_knowledge}</Section>
        <Section title="Explicit teaching"><div className="whitespace-pre-wrap">{lesson.explicit_teaching}</div></Section>
        <Section title="Worked example">{lesson.worked_example}</Section>
        <Section title="Guided practice">{lesson.guided_practice}</Section>
        <Section title="Independent task">{lesson.independent_task}</Section>
        <Section title="Response prompt">{lesson.response_prompt}</Section>
        <Section title="Evidence requirement">{lesson.evidence_requirement}</Section>
        <Section title="Self check">{lesson.self_check}</Section>
        <Section title="Reflection prompt">{lesson.reflection_prompt}</Section>
        <Section title="Offline alternative">{lesson.offline_alternative}</Section>
        <Section title="Accessibility notes">{lesson.accessibility_notes}</Section>
        <Section title="Linked outcome codes">
          <div className="flex flex-wrap gap-1">{(lesson.outcome_codes||[]).map(c=><span key={c} className="font-mono text-xs px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{c}</span>)}</div>
        </Section>
        <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">{lesson.source_note || "Outcome mappings must be verified by the parent against NESA."}</div>
      </div>
    </div>
  );
}
const Section = ({ title, children }) => (
  <div className="mb-5">
    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</div>
    <div className="text-sm text-slate-800 leading-relaxed">{children || "—"}</div>
  </div>
);
