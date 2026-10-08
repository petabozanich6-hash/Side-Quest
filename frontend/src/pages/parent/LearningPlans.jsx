import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Plus, X, Sparkles, Loader2, FileCheck, Printer, Trash2 } from "lucide-react";
import { Leaf, Branch } from "../../components/shared/Botanical";

const AREAS = ["English","Mathematics","Science and Technology","HSIE","PDHPE","Creative Arts","Languages","TAS"];

export default function LearningPlans() {
  const [plans, setPlans] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null);
  const [generating, setGenerating] = useState(false);
  const today = new Date().toISOString().slice(0,10);
  const [form, setForm] = useState({
    student_id: "", title: "", period_start: today, period_end: today,
    interests: "", subject_focus: [], teaching_approach: "", notes: ""
  });

  const load = () => api.get("/learning-plans").then(r => setPlans(r.data));
  useEffect(() => {
    load();
    api.get("/students").then(r => { setStudents(r.data); if (r.data[0]) setForm(f => ({...f, student_id: r.data[0].id})); });
  }, []);

  const toggleArea = (a) => setForm(f => ({...f, subject_focus: f.subject_focus.includes(a) ? f.subject_focus.filter(x=>x!==a) : [...f.subject_focus, a]}));

  const build = async (id) => {
    setGenerating(true);
    try {
      await api.post(`/learning-plans/${id}/build`);
      toast.success("Plan built — read it through before the visit");
      const { data: refreshed } = await api.get(`/learning-plans/${id}`);
      setView(refreshed);
      load();
    } catch (err) { toast.error(err.response?.data?.detail || "Could not build the plan"); }
    finally { setGenerating(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.student_id) { toast.error("Choose a student"); return; }
    try {
      const payload = { ...form, interests: form.interests.split(",").map(s=>s.trim()).filter(Boolean) };
      const { data: created } = await api.post("/learning-plans", payload);
      setOpen(false); load();
      if (created && created.id) { await build(created.id); }
      else { toast.success("Plan created — press Build plan"); }
    } catch { toast.error("Failed"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    await api.delete(`/learning-plans/${id}`);
    load();
  };

  const printPlan = (p) => {
    const c = p.ai_content || {};
    const w = window.open("", "_blank");
    const lines = [`<html><head><title>${p.title}</title><style>body{font-family:Georgia,serif;max-width:780px;margin:40px auto;padding:0 24px;color:#222;line-height:1.6}h1{font-size:28px}h2{font-size:18px;margin-top:28px;border-bottom:1px solid #ccc;padding-bottom:4px}h3{font-size:14px;text-transform:uppercase;letter-spacing:0.05em;color:#555;margin-top:20px}.meta{color:#666;font-size:13px}ul{margin:6px 0}li{margin:3px 0}</style></head><body>`,
      `<h1>${p.title}</h1>`,
      `<p class="meta">Student: ${p.student?.name || ""} (${p.student?.stage || ""}) · Period: ${p.period_start} to ${p.period_end}</p>`,
      `<h2>Overview</h2><p>${(c.overview||"").replace(/\n/g,"<br/>")}</p>`,
      `<h2>Educational Philosophy</h2><p>${c.educational_philosophy||""}</p>`,
      `<h2>Learning Areas</h2>`];
    (c.learning_areas || []).forEach(la => {
      lines.push(`<h3>${la.area}</h3>`);
      lines.push(`<p><strong>Goals:</strong></p><ul>${(la.goals||[]).map(g=>`<li>${g}</li>`).join("")}</ul>`);
      if (la.indicative_outcome_codes?.length) lines.push(`<p><strong>Indicative outcome codes:</strong> ${la.indicative_outcome_codes.filter(Boolean).join(", ")||"—"}</p>`);
      lines.push(`<p><strong>Teaching methods:</strong></p><ul>${(la.teaching_methods||[]).map(g=>`<li>${g}</li>`).join("")}</ul>`);
      lines.push(`<p><strong>Interest hooks:</strong></p><ul>${(la.interest_hooks||[]).map(g=>`<li>${g}</li>`).join("")}</ul>`);
      lines.push(`<p><strong>Sample activities:</strong></p><ul>${(la.sample_activities||[]).map(g=>`<li>${g}</li>`).join("")}</ul>`);
      lines.push(`<p><strong>Evidence approach:</strong> ${la.evidence_approach||""}</p>`);
    });
    lines.push(`<h2>Weekly Rhythm</h2><p>${c.weekly_rhythm||""}</p>`);
    lines.push(`<h2>Assessment Approach</h2><p>${c.assessment_approach||""}</p>`);
    lines.push(`<h2>Resources Overview</h2><p>${c.resources_overview||""}</p>`);
    lines.push(`<h2>Review Schedule</h2><p>${c.review_schedule||""}</p>`);
    lines.push(`<h2>Notes for Authorised Person</h2><p>${c.assessor_notes||""}</p>`);
    lines.push(`<p style="margin-top:40px;font-size:11px;color:#666">This plan was built from the parent's inputs and NSW syllabus outcomes and reviewed by the parent. The parent remains responsible for selecting an appropriate educational program and confirming current NESA requirements.</p></body></html>`);
    w.document.write(lines.join("")); w.document.close(); w.print();
  };

  return (
    <div className="p-8 lg:p-10 space-y-6 relative" data-testid="learning-plans">
      <Leaf className="absolute right-10 top-6" size={60} color="#C8893B"/>
      <Branch className="absolute left-0 bottom-10 opacity-30" size={160} color="#4A5D3A"/>

      <header>
        <div className="font-script text-2xl" style={{color:"#C77B5B"}}>For your inspection folder</div>
        <h1 className="font-display text-4xl font-bold" style={{color:"#1F3B2D"}}>Learning Plans</h1>
        <p className="mt-2 text-sm text-stone-600 max-w-3xl leading-relaxed">
          Learning-plan documents for your Authorised Person (AP) visit. Choose a child, a period and their interests, and the plan is
          built for you from their stage and the NSW syllabus outcomes. Read it through, then print it.
        </p>
      </header>

      <div className="flex items-center gap-3">
        <button onClick={()=>setOpen(true)} className="rounded-full px-5 py-2.5 text-sm font-bold flex items-center gap-2" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="add-plan"><Plus size={14}/> New plan</button>
        <div className="text-xs text-stone-500">{plans.length} plan{plans.length === 1 ? "" : "s"}</div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.id} className="paper-card p-5 relative" data-testid={`plan-${p.id}`}>
            <button onClick={()=>del(p.id)} className="absolute top-3 right-3 text-stone-300 hover:text-rose-600" data-testid={`del-plan-${p.id}`}><Trash2 size={14}/></button>
            <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">{p.student?.stage} · {p.student?.name}</div>
            <h3 className="font-display text-xl font-bold mt-1" style={{color:"#1F3B2D"}}>{p.title}</h3>
            <div className="text-xs text-stone-500 mt-1">{p.period_start} → {p.period_end}</div>
            {p.interests?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {p.interests.slice(0,4).map((i,ix) => <span key={ix} className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{backgroundColor:"#F0F4E8", color:"#1F3B2D"}}>{i}</span>)}
              </div>
            )}
            <div className="mt-4 flex items-center gap-2">
              {p.ai_content ? (
                <button onClick={()=>setView(p)} className="rounded-full px-4 py-1.5 text-xs font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid={`view-plan-${p.id}`}>View plan</button>
              ) : (
                <button onClick={()=>build(p.id)} disabled={generating} className="rounded-full px-4 py-1.5 text-xs font-bold flex items-center gap-1 disabled:opacity-50" style={{backgroundColor:"#4A5D3A", color:"#F5EFE0"}} data-testid={`gen-plan-${p.id}`}>
                  {generating ? <><Loader2 size={10} className="animate-spin"/> Building…</> : <><Sparkles size={10}/> Build plan</>}
                </button>
              )}
              {p.ai_content && <button onClick={()=>build(p.id)} disabled={generating} className="rounded-full border px-3 py-1.5 text-xs font-bold disabled:opacity-50" style={{borderColor:"#D4C8A8"}} data-testid={`rebuild-plan-${p.id}`}>Rebuild</button>}
              {p.ai_content && <button onClick={()=>printPlan(p)} className="rounded-full border px-3 py-1.5 text-xs font-bold flex items-center gap-1" style={{borderColor:"#D4C8A8"}} data-testid={`print-plan-${p.id}`}><Printer size={10}/> Print</button>}
            </div>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="col-span-full paper-card p-10 text-center">
            <FileCheck className="mx-auto mb-3" size={32} style={{color:"#4A5D3A"}}/>
            <p className="font-display text-lg" style={{color:"#1F3B2D"}}>No learning plans yet</p>
            <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto">Create a plan for each inspection period. It is built for you from your child's stage, interests and the NSW syllabus outcomes.</p>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=>setOpen(false)}>
          <form onClick={e=>e.stopPropagation()} onSubmit={submit} className="w-full max-w-xl paper-card p-7 my-8" data-testid="plan-form">
            <div className="flex items-center justify-between mb-4"><h2 className="font-display text-2xl font-bold" style={{color:"#1F3B2D"}}>New learning plan</h2><button type="button" onClick={()=>setOpen(false)}><X size={18}/></button></div>
            <div className="space-y-3.5">
              <F label="Student">
                <select required value={form.student_id} onChange={e=>setForm({...form, student_id: e.target.value})} className="input" data-testid="plan-student">
                  <option value="">Choose…</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.stage})</option>)}
                </select>
              </F>
              <F label="Plan title"><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="e.g. Semester 1 2027 Learning Plan" className="input" data-testid="plan-title"/></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Period starts"><input required type="date" value={form.period_start} onChange={e=>setForm({...form, period_start: e.target.value})} className="input" data-testid="plan-start"/></F>
                <F label="Period ends"><input required type="date" value={form.period_end} onChange={e=>setForm({...form, period_end: e.target.value})} className="input" data-testid="plan-end"/></F>
              </div>
              <F label="Child's interests (comma separated)"><input value={form.interests} onChange={e=>setForm({...form, interests: e.target.value})} placeholder="dinosaurs, cooking, Lego, soccer, drawing" className="input" data-testid="plan-interests"/></F>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Extra learning areas (the six key areas are always included)</label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {AREAS.map(a => (
                    <button type="button" key={a} onClick={()=>toggleArea(a)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${form.subject_focus.includes(a) ? "bg-moss text-cream" : "bg-white"}`} style={form.subject_focus.includes(a) ? {backgroundColor:"#4A5D3A", color:"#F5EFE0", borderColor:"#4A5D3A"} : {borderColor:"#D4C8A8"}} data-testid={`area-${a.replace(/\s+/g,'-')}`}>{a}</button>
                  ))}
                </div>
              </div>
              <F label="Teaching approach (optional)"><input value={form.teaching_approach} onChange={e=>setForm({...form, teaching_approach: e.target.value})} placeholder="e.g. project-based, nature-rich, explicit teaching mornings" className="input" data-testid="plan-approach"/></F>
              <F label="Notes (optional)"><textarea rows={3} value={form.notes} onChange={e=>setForm({...form, notes: e.target.value})} className="input" data-testid="plan-notes"/></F>
            </div>
            <button className="mt-5 w-full rounded-full py-3 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="submit-plan">Create and build plan</button>
          </form>
        </div>
      )}

      {view && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=>setView(null)}>
          <div onClick={e=>e.stopPropagation()} className="w-full max-w-4xl paper-card p-8 my-8" data-testid="plan-view">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">{view.student?.stage} · {view.student?.name}</div>
                <h2 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>{view.title}</h2>
                <p className="text-xs text-stone-500 mt-1">{view.period_start} → {view.period_end}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>printPlan(view)} className="rounded-full border px-3 py-1.5 text-xs font-bold flex items-center gap-1" style={{borderColor:"#D4C8A8"}}><Printer size={12}/> Print</button>
                <button onClick={()=>setView(null)}><X size={18}/></button>
              </div>
            </div>
            <Content c={view.ai_content}/>
            <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
              This plan was built from your inputs and NSW syllabus outcomes. Read it through before the visit. You remain responsible for selecting the educational program and verifying current NESA requirements.
            </div>
          </div>
        </div>
      )}
      <style>{`.input { width:100%; border-radius:0.75rem; border:1px solid #D4C8A8; padding:0.6rem 0.85rem; font-size:0.875rem; background: #fff; } .input:focus { outline:none; border-color:#4A5D3A; }`}</style>
    </div>
  );
}

const F = ({ label, children }) => (<div><label className="text-xs font-bold uppercase tracking-widest text-stone-500">{label}</label><div className="mt-1">{children}</div></div>);

const Content = ({ c }) => !c ? <p className="text-stone-500">The plan has not been built yet.</p> : (
  <div className="space-y-5 text-sm leading-relaxed" style={{color:"#2A2822"}}>
    <Sec title="Overview">{c.overview}</Sec>
    <Sec title="Educational Philosophy">{c.educational_philosophy}</Sec>
    <div>
      <div className="font-display text-xl font-bold mb-3" style={{color:"#1F3B2D"}}>Learning Areas</div>
      <div className="space-y-4">
        {(c.learning_areas || []).map((la, i) => (
          <div key={i} className="rounded-xl p-4" style={{backgroundColor:"#F5EFE0"}}>
            <div className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>{la.area}</div>
            <L4 title="Goals" items={la.goals}/>
            {la.indicative_outcome_codes?.filter(Boolean).length > 0 && <div className="mt-2 flex flex-wrap gap-1">{la.indicative_outcome_codes.filter(Boolean).map((c,ix) => <span key={ix} className="font-mono text-[10px] px-2 py-0.5 rounded border bg-white" style={{borderColor:"#D4C8A8"}}>{c}</span>)}</div>}
            <L4 title="Teaching methods" items={la.teaching_methods}/>
            <L4 title="Interest hooks" items={la.interest_hooks}/>
            <L4 title="Sample activities" items={la.sample_activities}/>
            <div className="mt-2"><strong className="text-[11px] uppercase tracking-wider text-stone-500">Evidence approach</strong><div className="text-sm">{la.evidence_approach}</div></div>
          </div>
        ))}
      </div>
    </div>
    <Sec title="Weekly rhythm">{c.weekly_rhythm}</Sec>
    <Sec title="Assessment approach">{c.assessment_approach}</Sec>
    <Sec title="Resources overview">{c.resources_overview}</Sec>
    <Sec title="Review schedule">{c.review_schedule}</Sec>
    <Sec title="Notes for the Authorised Person">{c.assessor_notes}</Sec>
  </div>
);
const Sec = ({ title, children }) => <div><div className="font-display text-xl font-bold mb-1" style={{color:"#1F3B2D"}}>{title}</div><div>{children}</div></div>;
const L4 = ({ title, items }) => (!items || !items.length) ? null : (<div className="mt-2"><strong className="text-[11px] uppercase tracking-wider text-stone-500">{title}</strong><ul className="list-disc pl-5 text-sm">{items.map((x,i)=><li key={i}>{x}</li>)}</ul></div>);
