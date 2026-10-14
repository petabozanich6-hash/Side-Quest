import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Plus, Trash2, X, Check, Pencil, Eye, EyeOff, Lock } from "lucide-react";
import HelpRequests from "./HelpRequests";

const STAGES = [
  { code: "ES1", name: "Early Stage 1 (Kindergarten)", theme: "early", years: ["K"] },
  { code: "S1", name: "Stage 1 (Years 1-2)", theme: "primary", years: ["1", "2"] },
  { code: "S2", name: "Stage 2 (Years 3-4)", theme: "primary", years: ["3", "4"] },
  { code: "S3", name: "Stage 3 (Years 5-6)", theme: "primary", years: ["5", "6"] },
  { code: "S4", name: "Stage 4 (Years 7-8)", theme: "secondary", years: ["7", "8"] },
  { code: "S5", name: "Stage 5 (Years 9-10)", theme: "secondary", years: ["9", "10"] },
  { code: "S6", name: "Stage 6 (Years 11-12 / HSC)", theme: "senior", years: ["11", "12"] },
];

// Compulsory for Stages 4 and 5: English, Mathematics, Science, and one HSIE pathway chosen by the parent.
// Anything else the server calls compulsory is shown as an optional elective instead.
const c = (code, name, learning_area) => ({ code, name, learning_area });
const CORE = (s) => [
  c(`ENG-${s}`, "English", "English"),
  c(`MATH-${s}`, "Mathematics", "Mathematics"),
  c(`SCI-${s}`, "Science", "Science"),
];
const MANDATORY = { S4: CORE("S4"), S5: CORE("S5"), S6: [c("ENG-S6", "English", "English")] };
const HSIE_PATHWAYS = (s) => [
  c(`COM-${s}`, "Commerce", "HSIE"),
  c(`ABS-${s}`, "Aboriginal Studies", "HSIE"),
  c(`HIST-${s}`, "History", "HSIE"),
  c(`GEO-${s}`, "Geography", "HSIE"),
];
const PATHWAY_NAMES = ["commerce", "aboriginal studies", "history", "geography"];
const HAS_PATHWAY = ["S4", "S5"];

// Extra Stage 4 electives, used when the server sends no electives.
const S4_ELECTIVES = [
  { code: "DRAMA-S4", name: "Drama", learning_area: "Creative Arts" },
  { code: "DANCE-S4", name: "Dance", learning_area: "Creative Arts" },
  { code: "AGR-S4", name: "Agricultural Technology", learning_area: "Technology" },
  { code: "DT-S4", name: "Design and Technology", learning_area: "Technology" },
  { code: "FT-S4", name: "Food Technology", learning_area: "Technology" },
  { code: "IND-S4", name: "Industrial Technology", learning_area: "Technology" },
  { code: "IST-S4", name: "Information and Software Technology", learning_area: "Technology" },
  { code: "TEXT-S4", name: "Textiles Technology", learning_area: "Technology" },
  { code: "PASS-S4", name: "Physical Activity and Sports Studies", learning_area: "PDHPE" },
];
const OPTIONAL_CORE = (s) => [
  c(`PDHPE-${s}`, "PDHPE", "PDHPE"),
  c(`MUS-${s}`, "Music", "Creative Arts"),
  c(`VA-${s}`, "Visual Arts", "Creative Arts"),
  c(`LOTE-${s}`, "Languages", "Languages"),
  c(`TECH-${s}`, "Technology", "Technology"),
];

const norm = (n) => String(n || "").toLowerCase().replace(/\s*\(.*\)/, "").trim();

const applyPattern = (stage, p) => {
  const coreNames = (MANDATORY[stage] || []).map(m => norm(m.name));
  const hasPathway = HAS_PATHWAY.includes(stage);
  const isCore = (x) => coreNames.includes(norm(x.name));
  const isPathway = (x) => hasPathway && PATHWAY_NAMES.includes(norm(x.name));
  const serverElectives = p.electives || [];
  const extras = stage === "S4" && !serverElectives.length ? S4_ELECTIVES : [];
  const optional = hasPathway ? OPTIONAL_CORE(stage) : [];
  const seenCodes = new Set(); const seenNames = new Set();
  const electives = [...serverElectives, ...(p.compulsory || []), ...optional, ...extras].filter(x => {
    if (!x.code || seenCodes.has(x.code) || isCore(x) || isPathway(x) || norm(x.name) === "hsie") return false;
    const key = norm(x.name);
    if (seenNames.has(key)) return false;
    seenCodes.add(x.code); seenNames.add(key);
    return true;
  });
  return { ...p, compulsory: MANDATORY[stage] || p.compulsory || [], pathways: hasPathway ? HSIE_PATHWAYS(stage) : [], electives };
};

function Modal({ onClose, children, testid }) {
  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md paper-card p-6 my-8" data-testid={testid}>{children}</div>
    </div>
  );
}

function CredentialsDialog({ student, onClose, onSetPin }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    if (!data) return;
    const t = setTimeout(onClose, 60000);
    return () => clearTimeout(t);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const r = await api.post(`/students/${student.id}/credentials`, { password });
      setData(r.data); setPassword("");
    } catch (err) { setError(err.response?.data?.detail || "Something went wrong. Please try again."); }
    finally { setBusy(false); }
  };

  return (
    <Modal onClose={onClose} testid="creds-dialog">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-2xl font-bold" style={{color:"#1F3B2D"}}>{student.name}'s login</h2>
        <button type="button" onClick={onClose} data-testid="creds-close"><X size={18}/></button>
      </div>
      {!data ? (
        <form onSubmit={submit}>
          <p className="text-sm text-stone-600 flex items-start gap-2"><Lock size={15} className="mt-0.5 shrink-0"/> For privacy, please enter your own password to see this login.</p>
          <input type="password" autoFocus required autoComplete="off" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" className="input mt-4" data-testid="creds-password"/>
          {error && <p className="mt-3 text-sm" style={{color:"#B04A3A"}} data-testid="creds-error">{error}</p>}
          <button disabled={busy} className="mt-4 w-full rounded-full py-3 text-sm font-bold disabled:opacity-50" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="creds-submit">{busy ? "Checking…" : "Show login"}</button>
        </form>
      ) : (
        <div data-testid="creds-result">
          <div className="rounded-xl p-4 space-y-3" style={{backgroundColor:"#F5EFE0", border:"1px solid #D4C8A8"}}>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Username</div>
              <div className="font-mono text-lg" style={{color:"#1F3B2D"}} data-testid="creds-username">{data.username}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">PIN</div>
              {data.pin ? (
                <div className="flex items-center gap-3">
                  <div className="font-mono text-lg tracking-widest" style={{color:"#1F3B2D"}} data-testid="creds-pin">{showPin ? data.pin : "•".repeat(data.pin.length)}</div>
                  <button type="button" onClick={() => setShowPin(v => !v)} className="text-stone-500 hover:text-stone-800" aria-label={showPin ? "Hide PIN" : "Show PIN"} data-testid="creds-toggle-pin">{showPin ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                </div>
              ) : (
                <div className="text-sm text-stone-600" data-testid="creds-no-pin">
                  This PIN was set before PINs could be viewed, so it can't be shown. Set a new one and it will appear here from then on.
                  <button type="button" onClick={onSetPin} className="mt-2 block font-bold underline" style={{color:"#4A5D3A"}} data-testid="creds-set-pin">Set a new PIN</button>
                </div>
              )}
            </div>
          </div>
          <p className="mt-3 text-xs text-stone-500">This closes by itself after a minute.</p>
          <button type="button" onClick={onClose} className="mt-4 w-full rounded-full py-3 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="creds-done">Done</button>
        </div>
      )}
    </Modal>
  );
}

function EditDialog({ student, onClose, onSaved }) {
  const [f, setF] = useState({
    name: student.name || "",
    username: student.username || "",
    stage: student.stage || "S2",
    year_level: student.year_level || "",
    birth_year: student.birth_year ?? "",
    pin: "",
  });
  const sp = student.prefs || {};
  const [interests, setInterests] = useState((student.interests || []).join(", "));
  const [prefs, setPrefs] = useState({ duration_minutes: sp.duration_minutes || "", delivery: sp.delivery || "", reading: sp.reading || "", complexity: sp.complexity || "", activity_types: (sp.activity_types || []).join(", "), support_areas: sp.support_areas || "", extension_areas: sp.extension_areas || "", equipment: sp.equipment || "", other: sp.other || "" });
  const setP = (k, v) => setPrefs(p => ({ ...p, [k]: v }));
  const [aiHelp, setAiHelp] = useState(student.ai_help !== false);
  const [helpUse, setHelpUse] = useState(null);
  useEffect(() => { api.get("/ai/help-usage").then(r => setHelpUse(r.data)).catch(() => {}); }, []);
  const [busy, setBusy] = useState(false);
  const stage = STAGES.find(s => s.code === f.stage);

  const changeStage = (code) => {
    const st = STAGES.find(s => s.code === code);
    setF(v => ({ ...v, stage: code, year_level: st?.years?.includes(v.year_level) ? v.year_level : (st?.years?.[0] || "") }));
  };

  const save = async (e) => {
    e.preventDefault();
    if (f.pin && f.pin.length < 4) { toast.error("PIN must be at least 4 characters"); return; }
    setBusy(true);
    try {
      await api.put(`/students/${student.id}`, {
        name: f.name.trim(),
        username: f.username.trim().toLowerCase(),
        stage: f.stage,
        year_level: f.year_level || null,
        birth_year: f.birth_year === "" ? null : Number(f.birth_year),
        ai_help: aiHelp,
        interests: interests.split(",").map(x => x.trim()).filter(Boolean).slice(0, 12),
        prefs: { ...prefs, duration_minutes: prefs.duration_minutes ? Number(prefs.duration_minutes) : undefined, activity_types: prefs.activity_types.split(",").map(x => x.trim()).filter(Boolean) },
      });
      if (f.pin) await api.put(`/students/${student.id}/pin`, { pin: f.pin });
      toast.success("Saved");
      onSaved();
    } catch (err) { toast.error(err.response?.data?.detail || "Could not save"); }
    finally { setBusy(false); }
  };

  return (
    <Modal onClose={onClose} testid="edit-dialog">
      <form onSubmit={save}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold" style={{color:"#1F3B2D"}}>Edit {student.name}</h2>
          <button type="button" onClick={onClose} data-testid="edit-close"><X size={18}/></button>
        </div>
        <div className="space-y-3">
          <F label="Name"><input required value={f.name} onChange={e=>setF({...f, name: e.target.value})} className="input" data-testid="e-name"/></F>
          <F label="Username (for sign in)"><input required value={f.username} onChange={e=>setF({...f, username: e.target.value})} className="input" data-testid="e-username"/></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Stage">
              <select value={f.stage} onChange={e=>changeStage(e.target.value)} className="input" data-testid="e-stage">
                {STAGES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>
            </F>
            <F label="Year level">
              <select value={f.year_level} onChange={e=>setF({...f, year_level: e.target.value})} className="input" data-testid="e-year">
                {stage?.years.map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </F>
          </div>
          <F label="Birth year (optional)"><input type="number" value={f.birth_year} onChange={e=>setF({...f, birth_year: e.target.value})} className="input" data-testid="e-birth"/></F>
          <F label="New PIN (leave blank to keep the current one)"><input type="password" minLength={4} autoComplete="new-password" value={f.pin} onChange={e=>setF({...f, pin: e.target.value})} className="input" data-testid="e-pin"/></F>
          <label className="flex items-start gap-3 rounded-xl border border-stone-300 p-3 text-sm" data-testid="help-toggle-row">
            <input type="checkbox" checked={aiHelp} onChange={e=>setAiHelp(e.target.checked)} className="mt-1 h-5 w-5" data-testid="help-toggle"/>
            <span><b>"I'm stuck! Help me understand" for {student.name}</b><br/>
              <span className="text-stone-600">Lets {student.name} ask for a simpler explanation, another example or a hint while doing a lesson. It only talks about the lesson, never gives answers to quizzes, and is part of the paid membership with daily limits.
              {helpUse?.children?.[student.id] ? ` Used ${helpUse.children[student.id].month} times this month (${helpUse.children[student.id].today} today).` : ""}</span></span>
          </label>
          <details className="rounded-xl border border-stone-300 p-3" data-testid="prefs-details">
            <summary className="cursor-pointer text-sm font-bold" style={{color:"#1F3B2D"}}>Learning preferences (optional)</summary>
            <p className="text-xs text-stone-500 mt-2">Only what you choose to enter. Side-Quest uses this to make lessons that suit {student.name}. It is private to your family and never shown to your child.</p>
            <div className="mt-3 space-y-3">
              <F label="Interests (separate with commas)"><input value={interests} onChange={e=>setInterests(e.target.value)} className="input" placeholder="e.g. Harry Potter, gardening, Minecraft" data-testid="p-interests"/></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Usual lesson length"><select value={prefs.duration_minutes} onChange={e=>setP("duration_minutes", e.target.value)} className="input" data-testid="p-minutes"><option value="">No preference</option>{[15,30,45,60,90].map(m => <option key={m} value={m}>{m} minutes</option>)}</select></F>
                <F label="Usually learns"><select value={prefs.delivery} onChange={e=>setP("delivery", e.target.value)} className="input" data-testid="p-delivery"><option value="">No preference</option><option value="parent_guided">With me (parent-guided)</option><option value="independent">Independently</option></select></F>
                <F label="Reading confidence"><select value={prefs.reading} onChange={e=>setP("reading", e.target.value)} className="input"><option value="">No preference</option><option value="supported">Needs support</option><option value="typical">Typical for their age</option><option value="confident">Confident</option></select></F>
                <F label="Explanations should be"><select value={prefs.complexity} onChange={e=>setP("complexity", e.target.value)} className="input"><option value="">No preference</option><option value="simpler">Simpler</option><option value="standard">Standard</option><option value="challenging">Challenging</option></select></F>
              </div>
              <F label="Activities they enjoy"><input value={prefs.activity_types} onChange={e=>setP("activity_types", e.target.value)} className="input" placeholder="e.g. hands-on, drawing, games, writing"/></F>
              <F label="Needs extra support with"><input value={prefs.support_areas} onChange={e=>setP("support_areas", e.target.value)} className="input" placeholder="e.g. long reading passages, fractions"/></F>
              <F label="Enjoys extra challenge with"><input value={prefs.extension_areas} onChange={e=>setP("extension_areas", e.target.value)} className="input" placeholder="e.g. puzzles, science"/></F>
              <F label="Equipment you usually have"><input value={prefs.equipment} onChange={e=>setP("equipment", e.target.value)} className="input" placeholder="e.g. no printer, tablet, craft supplies"/></F>
              <F label="Anything else"><input value={prefs.other} onChange={e=>setP("other", e.target.value)} className="input" placeholder="e.g. prefers short activities"/></F>
            </div>
          </details>
          {f.stage !== student.stage && <p className="text-xs text-stone-500">Changing the stage doesn't change the subjects already chosen for this child.</p>}
        </div>
        <button disabled={busy} className="mt-5 w-full rounded-full py-3 text-sm font-bold disabled:opacity-50" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="edit-save">{busy ? "Saving…" : "Save changes"}</button>
      </form>
    </Modal>
  );
}

export default function ChildrenPage() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [pattern, setPattern] = useState(null);
  const [form, setForm] = useState({ name: "", username: "", pin: "", stage: "S2", year_level: "3", birth_year: "" });
  const [electives, setElectives] = useState([]);
  const [pathway, setPathway] = useState("");
  const [creds, setCreds] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () => api.get("/students").then(r => setStudents(r.data));
  useEffect(() => { load(); }, []);

  useEffect(() => {
    const stage = STAGES.find(s => s.code === form.stage);
    setForm(f => ({ ...f, year_level: stage?.years?.[0] || "" }));
    setElectives([]); setPathway("");
    if (["S4","S5","S6"].includes(form.stage)) {
      api.get(`/curriculum/pattern/${form.stage}`).then(r => setPattern(applyPattern(form.stage, r.data || {})));
    } else { setPattern(null); }
  }, [form.stage]);

  const shownElectives = (pattern?.electives || []).filter(e => !e.years || !form.year_level || e.years.includes(form.year_level));
  const chosen = electives.filter(e => shownElectives.some(x => x.code === e.code));
  const pathwayObj = (pattern?.pathways || []).find(x => x.code === pathway);
  const compulsoryAll = [...(pattern?.compulsory || []), ...(pathwayObj ? [pathwayObj] : [])];

  const toggleElective = (e) => {
    setElectives(cur => cur.find(x => x.code === e.code) ? cur.filter(x => x.code !== e.code) : [...cur, e]);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (HAS_PATHWAY.includes(form.stage) && !pathwayObj) { toast.error("Choose an HSIE pathway"); return; }
    try {
      const stage = STAGES.find(s => s.code === form.stage);
      const chosenElectives = ["S4","S5","S6"].includes(form.stage) ? [...compulsoryAll, ...chosen] : [];
      const { data: created } = await api.post("/students", {
        ...form, theme: stage?.theme,
        birth_year: form.birth_year ? Number(form.birth_year) : null,
        electives: chosenElectives,
      });
      // Save the PIN again so a parent can view it later. The child can already sign in if this step fails.
      try { await api.put(`/students/${created.id}/pin`, { pin: form.pin }); } catch { /* ignore */ }
      toast.success("Student added");
      setOpen(false);
      setForm({ name: "", username: "", pin: "", stage: "S2", year_level: "3", birth_year: "" });
      setElectives([]); setPathway("");
      load();
    } catch (err) { toast.error(err.response?.data?.detail || "Failed"); }
  };

  const del = async (id) => {
    if (!window.confirm("Remove this student? Their records stay in the family archive.")) return;
    await api.delete(`/students/${id}`); toast.success("Removed"); load();
  };

  const currentStage = STAGES.find(s => s.code === form.stage);
  const totalUnits = [...compulsoryAll, ...chosen].reduce((n, e) => n + (e.units || 1), 0);

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="children-page">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Children</h1>
          <p className="text-sm text-stone-600 mt-1">Click a child to view their learning dashboard and send high-fives.</p>
        </div>
        <button onClick={() => setOpen(true)} className="rounded-full px-4 py-2 text-sm font-bold flex items-center gap-1.5" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="add-student-btn"><Plus size={14}/> Add student</button>
      </div>

      <HelpRequests students={students} onView={setCreds} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(s => (
          <div key={s.id} className="paper-card p-6 relative" data-testid={`student-${s.id}`}>
            <Link to={`/parent/children/${s.id}`} className="block" data-testid={`open-${s.id}`}>
              <div className="font-display text-xl font-bold" style={{color:"#1F3B2D"}}>{s.name}</div>
              <div className="font-mono text-xs text-stone-500 mt-1">@{s.username}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="pill pill-not-started">{s.stage_name}</span>
                {s.year_level && <span className="pill pill-not-started">Year {s.year_level}</span>}
              </div>
              {s.electives?.length > 0 && (
                <div className="mt-3 text-xs text-stone-600"><strong>Pattern:</strong> {s.electives.length} courses</div>
              )}
            </Link>
            <div className="mt-4 pt-3 border-t flex items-center gap-1" style={{borderColor:"#E4DAC0"}}>
              <button onClick={() => setCreds(s)} className="rounded-full px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-100" style={{color:"#1F3B2D"}} data-testid={`view-login-${s.id}`}><Eye size={14}/> View login</button>
              <button onClick={() => setEditing(s)} className="rounded-full px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-100" style={{color:"#1F3B2D"}} data-testid={`edit-${s.id}`}><Pencil size={14}/> Edit</button>
              <button onClick={() => del(s.id)} className="ml-auto p-2 text-stone-400 hover:text-rose-600" aria-label={`Remove ${s.name}`} data-testid={`del-${s.id}`}><Trash2 size={15}/></button>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="col-span-full paper-card p-10 text-center text-sm text-stone-600">Your family’s adventure starts here. Select <strong>Add student</strong> above to create your child’s profile, then you can plan lessons and set up their separate sign-in.</div>
        )}
      </div>

      {creds && <CredentialsDialog student={creds} onClose={() => setCreds(null)} onSetPin={() => { const s = creds; setCreds(null); setEditing(s); }} />}
      {editing && <EditDialog student={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}

      {open && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <form onClick={e=>e.stopPropagation()} onSubmit={submit} className="w-full max-w-2xl paper-card p-6 my-8" data-testid="add-student-form">
            <div className="flex items-center justify-between mb-4"><h2 className="font-display text-2xl font-bold" style={{color:"#1F3B2D"}}>Add student</h2><button type="button" onClick={() => setOpen(false)} data-testid="close-form"><X size={18}/></button></div>
            <div className="space-y-3">
              <F label="Name"><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="input" data-testid="f-name"/></F>
              <F label="Username (for sign in)"><input required value={form.username} onChange={e=>setForm({...form, username: e.target.value})} className="input" data-testid="f-username"/></F>
              <F label="PIN (4+ digits)"><input required type="password" minLength={4} value={form.pin} onChange={e=>setForm({...form, pin: e.target.value})} className="input" data-testid="f-pin"/></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Stage">
                  <select value={form.stage} onChange={e=>setForm({...form, stage: e.target.value})} className="input" data-testid="f-stage">
                    {STAGES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </F>
                <F label="Year level">
                  <select value={form.year_level} onChange={e=>setForm({...form, year_level: e.target.value})} className="input" data-testid="f-year">
                    {currentStage?.years.map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </F>
              </div>
              <F label="Birth year (optional)"><input type="number" value={form.birth_year} onChange={e=>setForm({...form, birth_year: e.target.value})} className="input" data-testid="f-birth"/></F>

              {pattern && (
                <div className="rounded-xl p-4" style={{backgroundColor:"#F5EFE0", border:"1px solid #D4C8A8"}} data-testid="pattern-block">
                  <div className="font-display text-base font-bold" style={{color:"#1F3B2D"}}>Home education pattern — {pattern.band_name}</div>
                  <div className="mt-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Compulsory</div>
                    <div className="mt-1 space-y-1">
                      {pattern.compulsory?.map((c,i) => (
                        <div key={i} className="rounded-lg bg-white border p-2 text-xs flex items-center gap-2" style={{borderColor:"#D4C8A8"}}>
                          <Check size={12} className="text-emerald-700"/>
                          <span className="flex-1"><strong>{c.name}</strong> <span className="text-stone-500">· {c.learning_area}{c.units ? ` · ${c.units} units` : ""}</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {pattern.pathways?.length > 0 && (
                    <div className="mt-3" data-testid="hsie-pathway">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">HSIE — choose one pathway</div>
                      <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-1">
                        {pattern.pathways.map(w => {
                          const sel = pathway === w.code;
                          return (
                            <button type="button" key={w.code} onClick={()=>setPathway(w.code)} className={`rounded-lg border p-2 text-xs flex items-center gap-2 text-left ${sel ? "" : "bg-white"}`} style={sel ? {backgroundColor:"#F0F4E8", borderColor:"#4A5D3A"} : {borderColor:"#D4C8A8"}} data-testid={`pathway-${w.code}`}>
                              {sel ? <Check size={12} className="text-emerald-700"/> : <span className="h-3 w-3 rounded-full border" style={{borderColor:"#D4C8A8"}}/>}
                              <strong>{w.name}</strong>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {shownElectives.length > 0 && (
                    <div className="mt-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Optional subjects (select as needed)</div>
                      <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-1 max-h-56 overflow-y-auto">
                        {shownElectives.map((e,i) => {
                          const sel = electives.find(x => x.code === e.code);
                          return (
                            <button type="button" key={i} onClick={()=>toggleElective(e)} className={`rounded-lg border p-2 text-xs flex items-center gap-2 text-left ${sel ? "" : "bg-white"}`} style={sel ? {backgroundColor:"#F0F4E8", borderColor:"#4A5D3A"} : {borderColor:"#D4C8A8"}} data-testid={`elect-${e.code}`}>
                              {sel ? <Check size={12} className="text-emerald-700"/> : <span className="h-3 w-3 rounded border" style={{borderColor:"#D4C8A8"}}/>}
                              <span className="flex-1"><strong>{e.name}</strong> <span className="text-stone-500">· {e.learning_area}{e.units ? ` · ${e.units} units` : ""}</span></span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-2 text-xs text-stone-600">Selected: {chosen.length} optional subject{chosen.length === 1 ? "" : "s"} · Total units planned: {totalUnits}</div>
                      {pattern.note && <div className="mt-2 text-[11px] text-stone-500 italic">{pattern.note}</div>}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button className="mt-5 w-full rounded-full py-3 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="submit-student">Add student</button>
          </form>
        </div>
      )}
      <style>{`.input { width:100%; border-radius:0.75rem; border:1px solid #D4C8A8; padding:0.6rem 0.85rem; font-size:0.875rem; background:#fff; } .input:focus { outline:none; border-color:#4A5D3A; }`}</style>
    </div>
  );
}
const F = ({ label, children }) => (<div><label className="text-xs font-bold uppercase tracking-widest text-stone-500">{label}</label><div className="mt-1">{children}</div></div>);
