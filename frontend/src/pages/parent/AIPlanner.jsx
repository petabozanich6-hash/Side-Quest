import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STAGES = ["ES1","S1","S2","S3","S4","S5","S6"];
const LA_PRIMARY = ["English","Mathematics","Science and Technology","HSIE","PDHPE","Creative Arts","Languages"];
const LA_SECONDARY = ["English","Mathematics","Science","HSIE","PDHPE","Creative Arts","Languages","TAS"];

export default function AIPlanner() {
  const [form, setForm] = useState({
    stage: "S2", year_level: "", learning_area: "English", subject: "",
    topic: "", duration_minutes: 45, learner_notes: "", support_level: "green"
  });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const upd = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));
  const areas = ["ES1","S1","S2","S3"].includes(form.stage) ? LA_PRIMARY : LA_SECONDARY;

  const generate = async () => {
    if (!form.topic.trim()) { toast.error("Enter a topic"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/ai/generate-lesson", {
        ...form,
        duration_minutes: Number(form.duration_minutes),
        is_side_quest: false
      });
      toast.success("Lesson generated — review & approve");
      nav("/parent/lessons");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Generation failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="ai-planner">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900">AI Lesson Planner</h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">Claude Sonnet 5.5 drafts a stage-appropriate lesson with explicit teaching, success criteria, response and evidence. You approve before assigning.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stage"><select value={form.stage} onChange={upd("stage")} className="input" data-testid="ai-stage">{STAGES.map(s=><option key={s} value={s}>{s}</option>)}</select></Field>
            <Field label="Year level (optional)"><input value={form.year_level} onChange={upd("year_level")} className="input" data-testid="ai-year" placeholder="e.g. Year 4"/></Field>
            <Field label="Learning area"><select value={form.learning_area} onChange={upd("learning_area")} className="input" data-testid="ai-area">{areas.map(a=><option key={a} value={a}>{a}</option>)}</select></Field>
            <Field label="Subject (optional)"><input value={form.subject} onChange={upd("subject")} className="input" data-testid="ai-subject" placeholder="e.g. Narrative writing"/></Field>
          </div>
          <Field label="Topic / focus"><input value={form.topic} onChange={upd("topic")} className="input" data-testid="ai-topic" placeholder="e.g. Writing a descriptive paragraph about place"/></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duration (min)"><input type="number" value={form.duration_minutes} onChange={upd("duration_minutes")} className="input" data-testid="ai-duration"/></Field>
            <Field label="Support level"><select value={form.support_level} onChange={upd("support_level")} className="input" data-testid="ai-support"><option value="green">Green · independent</option><option value="yellow">Yellow · ask if needed</option><option value="red">Red · wait for adult</option></select></Field>
          </div>
          <Field label="Learner notes (optional)"><textarea rows={3} value={form.learner_notes} onChange={upd("learner_notes")} className="input" data-testid="ai-notes" placeholder="Interests, strengths, needs, materials available…"/></Field>

          <button disabled={loading} onClick={generate} className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2" data-testid="ai-generate">
            {loading ? <><Loader2 size={16} className="animate-spin"/> Generating…</> : <><Sparkles size={16}/> Generate lesson</>}
          </button>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-display font-semibold text-slate-900 mb-2">What you'll get</h3>
            <ul className="text-sm text-slate-600 space-y-1.5 list-disc pl-5">
              <li>Learning intention & success criteria</li>
              <li>Explicit teaching + worked example</li>
              <li>Guided + independent practice</li>
              <li>Response & evidence prompts</li>
              <li>Printable + offline alternative</li>
              <li>Suggested outcome codes (verify)</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-xs text-amber-900 leading-relaxed">
            <strong className="font-semibold">AI note:</strong> Outcome codes and curriculum links are suggestions. Always verify against NESA before marking an outcome demonstrated.
          </div>
        </aside>
      </div>
      <style>{`.input { width:100%; border-radius:0.5rem; border:1px solid #cbd5e1; padding:0.55rem 0.75rem; font-size:0.875rem; } .input:focus { outline:none; border-color:#0d9488; }`}</style>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label><div className="mt-1">{children}</div></div>
);
