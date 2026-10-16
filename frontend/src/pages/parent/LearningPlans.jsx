import React, { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus, X, Sparkles, Loader2, FileCheck, Printer, Trash2, MapPin } from "lucide-react";
import { Leaf, Branch } from "../../components/shared/Botanical";
import { AUSTRALIAN_JURISDICTIONS } from "../../data/australianCurriculum";

// NSW key learning areas (used for NSW families and for older plans).
const NSW_AREAS = ["English","Mathematics","Science and Technology","HSIE","PDHPE","Creative Arts","Languages","TAS"];
const SECONDARY = ["S4","S5","S6"];
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));

export default function LearningPlans() {
  const [plans, setPlans] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [jur, setJur] = useState(null);          // { jurisdiction, name, areas, ... }
  const [aiStatus, setAiStatus] = useState(null); // { allowed, available, usage }
  const [picking, setPicking] = useState(false);
  const [pick, setPick] = useState("");
  const today = new Date().toISOString().slice(0,10);
  const [form, setForm] = useState({
    student_id: "", title: "", period_start: today, period_end: today,
    interests: "", subject_focus: [], teaching_approach: "", notes: ""
  });

  const load = () => api.get("/learning-plans").then(r => setPlans(r.data));
  const loadJur = () => {
    api.get("/family/jurisdiction").then(r => { setJur(r.data); setPick(r.data.jurisdiction || ""); }).catch(() => setJur({ jurisdiction: null }));
    api.get("/learning-plans-ai/status").then(r => setAiStatus(r.data)).catch(() => setAiStatus(null));
  };
  useEffect(() => {
    load(); loadJur();
    api.get("/students").then(r => { setStudents(r.data); if (r.data[0]) setForm(f => ({...f, student_id: r.data[0].id})); });
  }, []);

  const code = jur?.jurisdiction || null;
  const aiOn = !!(aiStatus?.allowed && aiStatus?.available);
  const student = students.find(s => s.id === form.student_id);
  const isSecondary = SECONDARY.includes(student?.stage);
  const childCourses = isSecondary && code === "NSW"
    ? [...new Set((student?.electives || []).map(c => c.name).filter(Boolean))]
    : [];
  const areaChoices = childCourses.length ? childCourses : code && code !== "NSW" && jur?.areas?.length ? jur.areas : NSW_AREAS;

  const pickStudent = (id) => setForm(f => ({...f, student_id: id, subject_focus: []}));
  const toggleArea = (a) => setForm(f => ({...f, subject_focus: f.subject_focus.includes(a) ? f.subject_focus.filter(x=>x!==a) : [...f.subject_focus, a]}));

  const saveJur = async () => {
    if (!pick) { toast.error("Choose your state or territory"); return; }
    try {
      await api.put("/family/jurisdiction", { jurisdiction: pick });
      toast.success("Saved. New and rebuilt plans will be written for this state or territory.");
      setPicking(false); loadJur();
    } catch (err) { toast.error(err.response?.data?.detail || "Could not save"); }
  };

  const build = async (id, mode) => {
    if (!code) { setPicking(true); toast.error("Choose your state or territory first"); return; }
    setGenerating(true);
    try {
      const { data } = await api.post(`/learning-plans/${id}/build${mode ? `?mode=${mode}` : ""}`);
      toast.success(data.generated_by === "ai" ? `Plan written for ${jur?.name}. Read it through and make it your own.` : "Plan built. Read it through and make it your own.");
      (data.warnings || []).slice(0, 2).forEach(w => toast.message(w, { duration: 9000 }));
      const { data: refreshed } = await api.get(`/learning-plans/${id}`);
      setView(refreshed);
      load(); loadJur();
    } catch (err) {
      const d = err.response?.data;
      if (d?.code === "JURISDICTION_REQUIRED") setPicking(true);
      toast.error(d?.detail || "Could not build the plan");
    }
    finally { setGenerating(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.student_id) { toast.error("Choose a student"); return; }
    if (!code) { setPicking(true); toast.error("Choose your state or territory first"); return; }
    try {
      const payload = { ...form, interests: form.interests.split(",").map(s=>s.trim()).filter(Boolean) };
      const { data: created } = await api.post("/learning-plans", payload);
      setOpen(false);
      await load();
      toast.success("Learning plan saved.");
      // Generation is a separate operation: failure must not imply that creation failed.
      if (created?.id) await build(created.id);
    } catch (err) { toast.error(apiErrorMessage(err)); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    await api.delete(`/learning-plans/${id}`);
    load();
  };

  const printPlan = (p) => {
    const c = p.ai_content || {};
    const w = window.open("", "_blank");
    if (!w) { toast.error("Please allow pop-ups to print this document."); return; }
    const list = (title, items) => items?.length ? `<p><strong>${esc(title)}:</strong></p><ul>${items.map(g=>`<li>${esc(g)}</li>`).join("")}</ul>` : "";
    const para = (h, t) => t ? `<h2>${esc(h)}</h2><p>${esc(t).replace(/\n/g,"<br/>")}</p>` : "";
    const lines = [`<html><head><title>${esc(p.title)}</title><style>@page{size:A4;margin:14mm}body{font-family:Arial,sans-serif;max-width:780px;margin:24px auto;padding:0 18px;color:#243a2d;line-height:1.6}h1{font-size:28px;color:#1F3B2D;border-top:5px solid #1F3B2D;padding-top:15px}h2{font-size:18px;color:#1F3B2D;margin-top:28px;border-left:4px solid #C77B5B;border-bottom:1px solid #D4C8A8;padding:0 0 4px 10px;break-after:avoid}h3{font-size:14px;text-transform:uppercase;letter-spacing:0.05em;color:#555;margin-top:20px}.meta{color:#666;font-size:13px}ul{margin:6px 0}li{margin:3px 0}table{border-collapse:collapse;width:100%;font-size:13px}td,th{border:1px solid #B7C7B0;padding:6px;vertical-align:top;text-align:left}th{background:#EFF3EA}thead{display:table-header-group}tr{break-inside:avoid}@media print{body{margin:0;padding:0}th{background:#f3f3f3}}</style></head><body>`,
      `<h1>${esc(p.title)}</h1>`,
      `<p class="meta">Student: ${esc(p.student?.name)} · Period: ${esc(p.period_start)} to ${esc(p.period_end)}${c.jurisdiction_name ? ` · ${esc(c.jurisdiction_name)}${c.plan_name ? ` (${esc(c.plan_name)})` : ""}` : ""}</p>`,
      para("Overview", c.overview), para("Educational philosophy", c.educational_philosophy), para("Learning environment", c.learning_environment),
      `<h2>Learning areas</h2>`];
    (c.learning_areas || []).forEach(la => {
      lines.push(`<h3>${esc(la.area)}</h3>`);
      if (la.curriculum_focus) lines.push(`<p>${esc(la.curriculum_focus)}</p>`);
      lines.push(list("Goals", la.goals), list("Topics", la.topics));
      if (la.indicative_outcome_codes?.filter(Boolean).length) lines.push(`<p><strong>Indicative outcome codes:</strong> ${esc(la.indicative_outcome_codes.filter(Boolean).join(", "))}</p>`);
      lines.push(list("Teaching methods", la.teaching_methods), list("Interest hooks", la.interest_hooks), list("Sample activities", la.sample_activities), list("Assessment", la.assessment_tasks), list("Resources", la.resources));
      if (la.evidence_approach) lines.push(`<p><strong>Evidence:</strong> ${esc(la.evidence_approach)}</p>`);
      if (la.needs_parent) lines.push(`<p><em>To be completed by the parent.</em></p>`);
    });
    lines.push(para("Weekly rhythm", c.weekly_rhythm), para("Assessment approach", c.assessment_approach), para("Resources overview", c.resources_overview), para("Review schedule", c.review_schedule), para(c.notes_heading || "Notes for the Authorised Person", c.assessor_notes));
    if (c.requirements_map?.length) {
      lines.push(`<h2>How this plan addresses ${esc(c.jurisdiction_name)} requirements</h2><table><tr><th>What the authority looks for</th><th>Where it is in this plan</th></tr>`);
      c.requirements_map.forEach(r => lines.push(`<tr><td>${esc(r.requirement)}</td><td>${r.how_addressed ? esc(r.how_addressed) : "<em>Parent to complete</em>"}</td></tr>`));
      lines.push(`</table>`);
    }
    lines.push(`<p style="margin-top:40px;font-size:11px;color:#666">${esc(disclaimer(c))}</p></body></html>`);
    w.document.write(lines.join("")); w.document.close(); w.print();
  };

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6 relative" data-testid="learning-plans">
      <Leaf className="absolute right-10 top-6" size={60} color="#C8893B"/>
      <Branch className="absolute left-0 bottom-10 opacity-30" size={160} color="#4A5D3A"/>

      <header>
        <div className="font-script text-2xl" style={{color:"#C77B5B"}}>Make room for the journey</div>
        <h1 className="font-display text-4xl font-bold" style={{color:"#1F3B2D"}}>Learning Plans</h1>
        <p className="mt-2 text-sm text-stone-600 max-w-3xl leading-relaxed">
          Keep your teaching plans organised for each child and learning period. Each plan is written for your own state or
          territory's home education requirements, then you review it and make it your own.
        </p>
      </header>

      <div className="paper-card p-4 flex flex-wrap items-center gap-3" data-testid="plan-jurisdiction">
        <MapPin size={18} style={{color:"#4A5D3A"}}/>
        {code && !picking ? (
          <>
            <div className="text-sm" style={{color:"#1F3B2D"}}>Plans are written for <strong data-testid="plan-jurisdiction-name">{jur.name}</strong>{jur.plan_name ? <span className="text-stone-500"> · {jur.plan_name}</span> : null}</div>
            <button onClick={()=>setPicking(true)} className="text-xs font-bold underline" style={{color:"#4A5D3A"}} data-testid="change-jurisdiction">Change</button>
            <div className="text-xs text-stone-500 basis-full">
              {aiOn
                ? <>AI writes each plan for {jur.name}{aiStatus.usage && !aiStatus.usage.unlimited ? ` · ${Math.max(0, aiStatus.usage.limit_per_day - aiStatus.usage.today)} left today` : ""}.</>
                : aiStatus?.allowed
                  ? <>AI plans aren't switched on yet, so you'll get the basic plan template for {jur.name}.</>
                  : <>Your free preview builds a basic plan template for {jur.name}. Paid plans get a full plan written by AI for {jur.name}'s requirements.</>}
            </div>
          </>
        ) : (
          <>
            <div className="text-sm font-semibold" style={{color:"#1F3B2D"}}>Which state or territory are you registered in?</div>
            <select value={pick} onChange={e=>setPick(e.target.value)} className="input max-w-xs" data-testid="jurisdiction-select">
              <option value="">Choose...</option>
              {AUSTRALIAN_JURISDICTIONS.map(j => <option key={j.code} value={j.code}>{j.name}</option>)}
            </select>
            <button onClick={saveJur} className="rounded-full px-4 py-2 text-xs font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="save-jurisdiction">Save</button>
            {code && <button onClick={()=>{ setPicking(false); setPick(code); }} className="text-xs text-stone-500">Cancel</button>}
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={()=>setOpen(true)} disabled={students.length === 0} className="disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-5 py-2.5 text-sm font-bold flex items-center gap-2" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="add-plan"><Plus size={14}/> New plan</button>
        <div className="text-xs text-stone-500">{plans.length} plan{plans.length === 1 ? "" : "s"}</div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.id} className="paper-card p-5 relative" data-testid={`plan-${p.id}`}>
            <button onClick={()=>del(p.id)} className="absolute top-3 right-3 text-stone-300 hover:text-rose-600" data-testid={`del-plan-${p.id}`}><Trash2 size={14}/></button>
            <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">{p.student?.stage} · {p.student?.name}{p.ai_content?.jurisdiction ? ` · ${p.ai_content.jurisdiction}` : ""}</div>
            <h3 className="font-display text-xl font-bold mt-1" style={{color:"#1F3B2D"}}>{p.title}</h3>
            <div className="text-xs text-stone-500 mt-1">{p.period_start} → {p.period_end}</div>
            {p.ai_content && p.ai_content.jurisdiction && code && p.ai_content.jurisdiction !== code && (
              <div className="mt-2 text-[11px] text-amber-800">Written for {p.ai_content.jurisdiction_name}. Rebuild it for {jur.name}.</div>
            )}
            {p.interests?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {p.interests.slice(0,4).map((i,ix) => <span key={ix} className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{backgroundColor:"#F0F4E8", color:"#1F3B2D"}}>{i}</span>)}
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              {p.ai_content ? (
                <button onClick={()=>setView(p)} className="rounded-full px-4 py-1.5 text-xs font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid={`view-plan-${p.id}`}>View plan</button>
              ) : (
                <button onClick={()=>build(p.id)} disabled={generating} className="rounded-full px-4 py-1.5 text-xs font-bold flex items-center gap-1 disabled:opacity-50" style={{backgroundColor:"#4A5D3A", color:"#F5EFE0"}} data-testid={`gen-plan-${p.id}`}>
                  {generating ? <><Loader2 size={10} className="animate-spin"/> {aiOn ? "Writing…" : "Building…"}</> : <><Sparkles size={10}/> Build plan</>}
                </button>
              )}
              {p.ai_content && <button onClick={()=>build(p.id)} disabled={generating} className="rounded-full border px-3 py-1.5 text-xs font-bold disabled:opacity-50" style={{borderColor:"#D4C8A8"}} data-testid={`rebuild-plan-${p.id}`}>{generating ? "Working…" : "Rebuild"}</button>}
              {p.ai_content && <button onClick={()=>printPlan(p)} className="rounded-full border px-3 py-1.5 text-xs font-bold flex items-center gap-1" style={{borderColor:"#D4C8A8"}} data-testid={`print-plan-${p.id}`}><Printer size={10}/> Print</button>}
            </div>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="col-span-full paper-card p-10 text-center">
            <FileCheck className="mx-auto mb-3" size={32} style={{color:"#4A5D3A"}}/>
            <p className="font-display text-lg" style={{color:"#1F3B2D"}}>No learning plans yet</p>
            <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto">{students.length === 0 ? "Start by adding a child. You can then make a learning plan for the period you are preparing for." : `Create a plan for the term or period you're preparing for. It's written for ${jur?.name || "your state or territory"}, and you review it before you rely on it.`}</p>
            {students.length === 0 && <Link to="/parent/children" className="mt-4 inline-block text-sm font-bold underline" style={{color:"#4A5D3A"}} data-testid="plans-empty-add-child">Add your first child</Link>}
            {students.length > 0 && <button type="button" onClick={() => setOpen(true)} className="mt-4 text-sm font-bold underline" style={{color:"#4A5D3A"}} data-testid="plans-empty-create">Create a learning plan</button>}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=>setOpen(false)}>
          <form onClick={e=>e.stopPropagation()} onSubmit={submit} className="w-full max-w-xl paper-card p-7 my-8" data-testid="plan-form">
            <div className="flex items-center justify-between mb-4"><h2 className="font-display text-2xl font-bold" style={{color:"#1F3B2D"}}>New learning plan</h2><button type="button" onClick={()=>setOpen(false)}><X size={18}/></button></div>
            <div className="space-y-3.5">
              <F label="Student">
                <select required value={form.student_id} onChange={e=>pickStudent(e.target.value)} className="input" data-testid="plan-student">
                  <option value="">Choose…</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.stage}{s.year_level ? `, Year ${s.year_level}` : ""})</option>)}
                </select>
              </F>
              <F label="Plan title"><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="e.g. Semester 1 2027 Learning Plan" className="input" data-testid="plan-title"/></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Period starts"><input required type="date" value={form.period_start} onChange={e=>setForm({...form, period_start: e.target.value})} className="input" data-testid="plan-start"/></F>
                <F label="Period ends"><input required type="date" value={form.period_end} onChange={e=>setForm({...form, period_end: e.target.value})} className="input" data-testid="plan-end"/></F>
              </div>
              <F label="Child's interests (comma separated)"><input value={form.interests} onChange={e=>setForm({...form, interests: e.target.value})} placeholder="dinosaurs, cooking, Lego, soccer, drawing" className="input" data-testid="plan-interests"/></F>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">
                  {childCourses.length ? `Focus courses for ${student?.name}` : code && code !== "NSW" ? `Areas to give extra depth (every ${jur?.name} area is included)` : "Extra learning areas (the six key areas are always included)"}
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {areaChoices.map(a => (
                    <button type="button" key={a} onClick={()=>toggleArea(a)} className="rounded-full border px-3 py-1 text-xs font-semibold" style={form.subject_focus.includes(a) ? {backgroundColor:"#4A5D3A", color:"#F5EFE0", borderColor:"#4A5D3A"} : {borderColor:"#D4C8A8", backgroundColor:"#fff"}} data-testid={`area-${a.replace(/[^A-Za-z]+/g,'-')}`}>{a}</button>
                  ))}
                </div>
                {isSecondary && code === "NSW" && !childCourses.length && <div className="mt-2 text-[11px] text-stone-500 italic">No courses saved for this child yet. Pick two of PDHPE, Creative Arts, Languages or TAS for Years 7 to 10.</div>}
              </div>
              <F label="Teaching approach (optional)"><input value={form.teaching_approach} onChange={e=>setForm({...form, teaching_approach: e.target.value})} placeholder="e.g. project-based, nature-rich, explicit teaching mornings" className="input" data-testid="plan-approach"/></F>
              <F label="Notes (optional)"><textarea rows={3} value={form.notes} onChange={e=>setForm({...form, notes: e.target.value})} placeholder="Anything that helps: how they learn best, what went well last term. Leave out medical details." className="input" data-testid="plan-notes"/></F>
            </div>
            <button disabled={generating} className="mt-5 w-full rounded-full py-3 text-sm font-bold disabled:opacity-50" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="submit-plan">{generating ? "Writing the plan…" : "Create and build plan"}</button>
            {aiOn && <p className="mt-2 text-center text-[11px] text-stone-500">Writing a full plan takes about a minute.</p>}
          </form>
        </div>
      )}

      {view && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=>setView(null)}>
          <div onClick={e=>e.stopPropagation()} className="w-full max-w-4xl paper-card p-8 my-8" data-testid="plan-view">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">{view.student?.stage} · {view.student?.name}{view.ai_content?.jurisdiction_name ? ` · ${view.ai_content.jurisdiction_name}` : ""}</div>
                <h2 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>{view.title}</h2>
                <p className="text-xs text-stone-500 mt-1">{view.period_start} → {view.period_end}{view.ai_content?.generated_by === "ai" ? " · drafted by AI" : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>printPlan(view)} className="rounded-full border px-3 py-1.5 text-xs font-bold flex items-center gap-1" style={{borderColor:"#D4C8A8"}}><Printer size={12}/> Print</button>
                <button onClick={()=>setView(null)}><X size={18}/></button>
              </div>
            </div>
            <Content c={view.ai_content}/>
            <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900" data-testid="plan-disclaimer">
              {disclaimer(view.ai_content || {})}
              {view.ai_content?.sources?.length > 0 && (
                <div className="mt-2">Official guidance{view.ai_content.checked_on ? ` (checked ${view.ai_content.checked_on})` : ""}: {view.ai_content.sources.map((s, i) => <span key={s.url}>{i ? " · " : ""}<a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">{s.title}</a></span>)}</div>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`.input { width:100%; border-radius:0.75rem; border:1px solid #D4C8A8; padding:0.6rem 0.85rem; font-size:0.875rem; background: #fff; } .input:focus { outline:none; border-color:#4A5D3A; }`}</style>
    </div>
  );
}

function disclaimer(c) {
  if (!c.jurisdiction) return "This draft draws on your inputs and an existing NSW syllabus reference list. Please review and adapt it for your family's needs, and check requirements with your state or territory's education authority before relying on it.";
  const who = c.authority ? ` (${c.authority})` : "";
  return `This is a draft for ${c.jurisdiction_name}${c.generated_by === "ai" ? ", written by AI from your inputs" : ""}. Side-Quest is not an education authority and doesn't certify that a plan meets registration requirements. Read it carefully, change anything that isn't true for your family, add what's marked for you, and check the current requirements with ${c.jurisdiction_name}'s home education authority${who} before you submit it.`;
}

const F = ({ label, children }) => (<div><label className="text-xs font-bold uppercase tracking-widest text-stone-500">{label}</label><div className="mt-1">{children}</div></div>);

const Content = ({ c }) => !c ? <p className="text-stone-500">The plan has not been built yet.</p> : (
  <div className="space-y-5 text-sm leading-relaxed" style={{color:"#2A2822"}}>
    {c.parent_to_complete?.length > 0 && (
      <div className="rounded-xl p-4 border" style={{borderColor:"#D4A574", backgroundColor:"#FFF8EC"}} data-testid="plan-parent-todo">
        <div className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>For you to add</div>
        <ul className="list-disc pl-5 text-sm">{c.parent_to_complete.map((x,i)=><li key={i}>{x}</li>)}</ul>
      </div>
    )}
    <Sec title="Overview">{c.overview}</Sec>
    <Sec title="Educational philosophy">{c.educational_philosophy}</Sec>
    <Sec title="Learning environment">{c.learning_environment}</Sec>
    <div>
      <div className="font-display text-xl font-bold mb-3" style={{color:"#1F3B2D"}}>Learning areas</div>
      <div className="space-y-4">
        {(c.learning_areas || []).map((la, i) => (
          <div key={i} className="rounded-xl p-4" style={{backgroundColor:"#F5EFE0"}} data-testid="plan-area">
            <div className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>{la.area}</div>
            {la.needs_parent && <div className="text-xs text-amber-800 mt-1">The AI didn't draft this area. Please add your goals, topics and activities.</div>}
            {la.curriculum_focus && <p className="mt-1">{la.curriculum_focus}</p>}
            <L4 title="Goals" items={la.goals}/>
            <L4 title="Topics" items={la.topics}/>
            {la.indicative_outcome_codes?.filter(Boolean).length > 0 && <div className="mt-2 flex flex-wrap gap-1">{la.indicative_outcome_codes.filter(Boolean).map((c,ix) => <span key={ix} className="font-mono text-[10px] px-2 py-0.5 rounded border bg-white" style={{borderColor:"#D4C8A8"}}>{c}</span>)}</div>}
            <L4 title="Teaching methods" items={la.teaching_methods}/>
            <L4 title="Interest hooks" items={la.interest_hooks}/>
            <L4 title="Sample activities" items={la.sample_activities}/>
            <L4 title="Assessment" items={la.assessment_tasks}/>
            <L4 title="Resources" items={la.resources}/>
            {la.evidence_approach && <div className="mt-2"><strong className="text-[11px] uppercase tracking-wider text-stone-500">Evidence approach</strong><div className="text-sm">{la.evidence_approach}</div></div>}
          </div>
        ))}
      </div>
    </div>
    <Sec title="Weekly rhythm">{c.weekly_rhythm}</Sec>
    <Sec title="Assessment approach">{c.assessment_approach}</Sec>
    <Sec title="Resources overview">{c.resources_overview}</Sec>
    <Sec title="Review schedule">{c.review_schedule}</Sec>
    <Sec title={c.notes_heading || "Notes for the Authorised Person"}>{c.assessor_notes}</Sec>
    {c.requirements_map?.length > 0 && (
      <div data-testid="plan-requirements">
        <div className="font-display text-xl font-bold mb-2" style={{color:"#1F3B2D"}}>How this plan addresses {c.jurisdiction_name} requirements</div>
        <div className="space-y-2">
          {c.requirements_map.map((r, i) => (
            <div key={i} className="rounded-lg border p-3 bg-white" style={{borderColor: r.how_addressed ? "#D4C8A8" : "#D4A574"}}>
              <div className="text-xs font-bold" style={{color:"#1F3B2D"}}>{r.requirement}</div>
              <div className="text-sm mt-1">{r.how_addressed || <span className="text-amber-800">Not covered by the draft. Please add this yourself.</span>}</div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
const Sec = ({ title, children }) => !children ? null : <div><div className="font-display text-xl font-bold mb-1" style={{color:"#1F3B2D"}}>{title}</div><div className="whitespace-pre-line">{children}</div></div>;
const L4 = ({ title, items }) => (!items || !items.length) ? null : (<div className="mt-2"><strong className="text-[11px] uppercase tracking-wider text-stone-500">{title}</strong><ul className="list-disc pl-5 text-sm">{items.map((x,i)=><li key={i}>{x}</li>)}</ul></div>);
