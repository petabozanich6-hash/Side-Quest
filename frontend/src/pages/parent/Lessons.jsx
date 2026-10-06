import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Printer, Eye, X, Send, Trash2, Plus } from "lucide-react";

const STAGES = [
  { code: "ES1", label: "Early Stage 1 (Kindergarten)" },
  { code: "S1", label: "Stage 1 (Years 1-2)" },
  { code: "S2", label: "Stage 2 (Years 3-4)" },
  { code: "S3", label: "Stage 3 (Years 5-6)" },
  { code: "S4", label: "Stage 4 (Years 7-8)" },
  { code: "S5", label: "Stage 5 (Years 9-10)" },
  { code: "S6", label: "Stage 6 (Years 11-12)" },
];

const LEARNING_AREAS = [
  "English", "Mathematics", "Science and Technology", "Science", "HSIE",
  "PDHPE", "Creative Arts", "Languages", "TAS", "VET",
];

const EMPTY_FORM = {
  title: "",
  stage: "S2",
  learning_area: "English",
  duration_minutes: 45,
  outcome_codes: "",
  learning_intention: "",
  success_criteria: "",
  materials: "",
  key_vocabulary: "",
  explicit_teaching: "",
  worked_example: "",
  guided_practice: "",
  independent_task: "",
  response_prompt: "",
  evidence_requirement: "",
  offline_alternative: "",
  reflection_prompt: "",
  source_note: "",
};

const lines = (s) => s.split("\n").map(x => x.trim()).filter(Boolean);
const commas = (s) => s.split(",").map(x => x.trim()).filter(Boolean);

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [view, setView] = useState(null);
  const [assignOpen, setAssignOpen] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const load = () => api.get("/lessons").then(r => setLessons(r.data));
  useEffect(() => {
    load();
    api.get("/students").then(r => setStudents(r.data));
    api.get("/auth/me").then(r => setIsOwner(!!r.data?.is_owner)).catch(() => {});
  }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this lesson? Submissions remain for your records.")) return;
    try { await api.delete(`/lessons/${id}`); toast.success("Deleted"); load(); }
    catch (err) { toast.error(err.response?.data?.detail || "Failed to delete"); }
  };

  const assign = async (studentId, lessonId) => {
    try {
      await api.post("/assignments", { student_id: studentId, lesson_id: lessonId, support_level: "green" });
      toast.success("Assigned");
      setAssignOpen(null);
    } catch (err) { toast.error(err.response?.data?.detail || "Failed"); }
  };

  const printLesson = (l) => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>${l.title}</title><style>body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 20px;color:#111;}h1{font-size:24px;}h2{font-size:16px;margin-top:24px;border-bottom:1px solid #ccc;padding-bottom:4px;}p,li{line-height:1.6;font-size:14px;}</style></head><body><h1>${l.title}</h1><p><strong>Stage:</strong> ${l.stage} · <strong>Learning area:</strong> ${l.learning_area} · <strong>Duration:</strong> ${l.duration_minutes} min</p><h2>Learning intention</h2><p>${l.learning_intention||""}</p><h2>Success criteria</h2><ul>${(l.success_criteria||[]).map(c=>`<li>${c}</li>`).join("")}</ul><h2>Materials</h2><ul>${(l.materials||[]).map(m=>`<li>${m}</li>`).join("")}</ul><h2>Key vocabulary</h2><ul>${(l.key_vocabulary||[]).map(k=>`<li>${k}</li>`).join("")}</ul><h2>Explicit teaching</h2><p>${(l.explicit_teaching||"").replace(/\n/g,"<br/>")}</p><h2>Worked example</h2><p>${l.worked_example||""}</p><h2>Guided practice</h2><p>${l.guided_practice||""}</p><h2>Independent task</h2><p>${l.independent_task||""}</p><h2>Response</h2><p>${l.response_prompt||""}</p><h2>Evidence</h2><p>${l.evidence_requirement||""}</p><h2>Offline alternative</h2><p>${l.offline_alternative||""}</p><h2>Reflection</h2><p>${l.reflection_prompt||""}</p><p style="margin-top:40px;font-size:11px;color:#666;">Source note: ${l.source_note||"Parent verifies curriculum alignment."}</p></body></html>`);
    w.document.close(); w.print();
  };

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="lessons-page">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Lessons</h1>
          <p className="text-sm text-slate-600 mt-1">Hand-created and library lessons for your family.</p>
        </div>
        <button onClick={()=>setCreateOpen(true)} className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-semibold flex items-center gap-1" data-testid="new-lesson-btn"><Plus size={14}/> New lesson</button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {lessons.map(l => (
          <div key={l.id} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col" data-testid={`lesson-${l.id}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{l.stage} · {l.learning_area}{l.library ? " · Library" : ""}{l.is_side_quest ? " · Side Quest" : ""}</div>
                <h3 className="font-display text-lg font-semibold text-slate-900 mt-1 leading-tight">{l.title}</h3>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600 line-clamp-3">{l.learning_intention}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {(l.outcome_codes||[]).slice(0,3).map(c => <span key={c} className="font-mono text-[10px] px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{c}</span>)}
            </div>
            <div className="mt-auto pt-4 flex items-center gap-2 flex-wrap">
              <Link to={`/parent/lessons/${l.id}`} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`view-${l.id}`}><Eye size={12}/> View</Link>
              <button onClick={()=>printLesson(l)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`print-${l.id}`}><Printer size={12}/> Print</button>
              {(!l.library || isOwner) && (
                <button onClick={()=>del(l.id)} className="rounded-lg border border-rose-300 text-rose-700 px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`del-lesson-${l.id}`}><Trash2 size={12}/> Delete</button>
              )}
              <button onClick={()=>setAssignOpen(l)} className="ml-auto rounded-lg bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1" data-testid={`assign-${l.id}`}><Send size={12}/> Assign</button>
            </div>
          </div>
        ))}
        {lessons.length === 0 && <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">No lessons yet. Click “New lesson” to create one.</div>}
      </div>

      {view && <LessonView lesson={view} onClose={()=>setView(null)} />}
      {createOpen && (
        <CreateLessonModal
          isOwner={isOwner}
          onClose={()=>setCreateOpen(false)}
          onCreated={()=>{ setCreateOpen(false); load(); }}
        />
      )}
      {assignOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setAssignOpen(null)}>
          <div onClick={e=>e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6" data-testid="assign-modal">
            <h3 className="font-display text-lg font-bold">Assign to…</h3>
            <p className="text-xs text-slate-500 mt-1">{assignOpen.title}</p>
            <div className="mt-4 space-y-2">
              {students.map(s => (
                <button key={s.id} onClick={()=>assign(s.id, assignOpen.id)} className="w-full flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 hover:border-slate-400" data-testid={`assign-to-${s.id}`}>
                  <span className="font-medium text-sm">{s.name}</span>
                  <span className="pill pill-not-started">{s.stage}</span>
                </button>
              ))}
              {students.length === 0 && <p className="text-sm text-slate-500">Add a student first.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateLessonModal({ isOwner, onClose, onCreated }) {
  const [f, setF] = useState(EMPTY_FORM);
  const [library, setLibrary] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim() || !f.learning_intention.trim() || !f.explicit_teaching.trim() || !f.independent_task.trim()) {
      toast.error("Title, learning intention, explicit teaching and independent task are required");
      return;
    }
    setSaving(true);
    const payload = {
      title: f.title.trim(),
      stage: f.stage,
      learning_area: f.learning_area,
      duration_minutes: Number(f.duration_minutes) || 45,
      outcome_codes: commas(f.outcome_codes),
      learning_intention: f.learning_intention.trim(),
      success_criteria: lines(f.success_criteria),
      materials: lines(f.materials),
      key_vocabulary: lines(f.key_vocabulary),
      explicit_teaching: f.explicit_teaching.trim(),
      worked_example: f.worked_example.trim() || null,
      guided_practice: f.guided_practice.trim() || null,
      independent_task: f.independent_task.trim(),
      response_prompt: f.response_prompt.trim() || null,
      evidence_requirement: f.evidence_requirement.trim() || null,
      offline_alternative: f.offline_alternative.trim() || null,
      reflection_prompt: f.reflection_prompt.trim() || null,
      source_note: f.source_note.trim() || null,
      status: "approved",
    };
    try {
      await api.post("/lessons", payload, library ? { params: { library: true } } : undefined);
      toast.success(library ? "Saved to library" : "Lesson created");
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create lesson");
    } finally {
      setSaving(false);
    }
  };

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";
  const label = "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <form onSubmit={submit} onClick={e=>e.stopPropagation()} className="w-full max-w-2xl rounded-2xl bg-white p-8 my-8 space-y-4" data-testid="create-lesson-modal">
        <div className="flex items-start justify-between">
          <h2 className="font-display text-2xl font-bold text-slate-900">New lesson</h2>
          <button type="button" onClick={onClose}><X size={18}/></button>
        </div>

        <div>
          <label className={label}>Title *</label>
          <input className={input} value={f.title} onChange={set("title")} data-testid="lesson-title" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={label}>Stage</label>
            <select className={input} value={f.stage} onChange={set("stage")}>
              {STAGES.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Learning area</label>
            <select className={input} value={f.learning_area} onChange={set("learning_area")}>
              {LEARNING_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Minutes</label>
            <input type="number" min="5" className={input} value={f.duration_minutes} onChange={set("duration_minutes")} />
          </div>
        </div>

        <div>
          <label className={label}>Outcome codes (comma separated)</label>
          <input className={input} value={f.outcome_codes} onChange={set("outcome_codes")} placeholder="EN2-VOCAB-01, EN2-RVL-01" />
        </div>

        <div>
          <label className={label}>Learning intention *</label>
          <textarea rows={2} className={input} value={f.learning_intention} onChange={set("learning_intention")} />
        </div>

        <div>
          <label className={label}>Success criteria (one per line)</label>
          <textarea rows={3} className={input} value={f.success_criteria} onChange={set("success_criteria")} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Materials (one per line)</label>
            <textarea rows={3} className={input} value={f.materials} onChange={set("materials")} />
          </div>
          <div>
            <label className={label}>Key vocabulary (one per line)</label>
            <textarea rows={3} className={input} value={f.key_vocabulary} onChange={set("key_vocabulary")} />
          </div>
        </div>

        <div>
          <label className={label}>Explicit teaching *</label>
          <textarea rows={5} className={input} value={f.explicit_teaching} onChange={set("explicit_teaching")} />
        </div>

        <div>
          <label className={label}>Worked example</label>
          <textarea rows={3} className={input} value={f.worked_example} onChange={set("worked_example")} />
        </div>

        <div>
          <label className={label}>Guided practice</label>
          <textarea rows={3} className={input} value={f.guided_practice} onChange={set("guided_practice")} />
        </div>

        <div>
          <label className={label}>Independent task *</label>
          <textarea rows={3} className={input} value={f.independent_task} onChange={set("independent_task")} />
        </div>

        <div>
          <label className={label}>Response prompt</label>
          <textarea rows={2} className={input} value={f.response_prompt} onChange={set("response_prompt")} />
        </div>

        <div>
          <label className={label}>Evidence requirement</label>
          <textarea rows={2} className={input} value={f.evidence_requirement} onChange={set("evidence_requirement")} />
        </div>

        <div>
          <label className={label}>Offline alternative</label>
          <textarea rows={2} className={input} value={f.offline_alternative} onChange={set("offline_alternative")} />
        </div>

        <div>
          <label className={label}>Reflection prompt</label>
          <textarea rows={2} className={input} value={f.reflection_prompt} onChange={set("reflection_prompt")} />
        </div>

        <div>
          <label className={label}>Source note</label>
          <input className={input} value={f.source_note} onChange={set("source_note")} />
        </div>

        {isOwner && (
          <label className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
            <input type="checkbox" checked={library} onChange={e=>setLibrary(e.target.checked)} data-testid="save-to-library" />
            Save as a library lesson (shared with every family)
          </label>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50" data-testid="save-lesson">{saving ? "Saving…" : "Save lesson"}</button>
        </div>
      </form>
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
