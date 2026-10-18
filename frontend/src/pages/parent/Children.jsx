import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";
import { Plus, Trash2, X, Check, Pencil, Eye, EyeOff, Lock } from "lucide-react";
import HelpRequests from "./HelpRequests";
import { useAuth } from "../../context/AuthContext";
import { bandOf, bandsFor, finalSubjects, isSecondary, selectionProblem, subjectPlanFor, yearName } from "../../data/childSubjects";

// Year levels and subjects follow the family's state or territory (data/childSubjects.js, from each authority's
// home education guidance). The saved subjects are what the Outcome Tracker and Auto-Quest follow.
const useJurisdiction = () => useAuth().user?.jurisdiction || null;

/** Required subjects (always included) and the choices for this state and year level, with the state's rules. */
function SubjectPicker({ plan, chosen, setChosen, testid = "pattern-block", title }) {
  const has = (o) => chosen.some((c) => c.code === o.code);
  const toggle = (g, o) => setChosen((cur) => {
    if (g.rule === "one") return [...cur.filter((c) => !g.options.some((x) => x.code === c.code)), o];
    return has(o) ? cur.filter((c) => c.code !== o.code) : [...cur, o];
  });
  const problem = selectionProblem(plan, chosen);
  const box = (sel) => (sel ? { backgroundColor: "#F0F4E8", borderColor: "#4A5D3A" } : { borderColor: "#D4C8A8" });
  return (
    <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "#F5EFE0", border: "1px solid #D4C8A8" }} data-testid={testid}>
      {title && <div className="font-display text-base font-bold" style={{ color: "#1F3B2D" }}>{title}</div>}
      <p className="text-xs text-stone-700" data-testid="plan-summary">{plan.summary}{" "}
        {plan.source && <a href={plan.source} target="_blank" rel="noopener noreferrer" className="underline font-semibold" style={{ color: "#4A5D3A" }}>Official guidance ↗</a>}</p>
      {plan.required.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Included</div>
          <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-1">
            {plan.required.map((c) => (
              <div key={c.code} className="rounded-lg bg-white border p-2 text-xs flex items-center gap-2" style={{ borderColor: "#D4C8A8" }} data-testid={`req-${c.name}`}>
                <Check size={12} className="text-emerald-700" /><span className="flex-1"><strong>{c.name}</strong></span>
              </div>
            ))}
          </div>
        </div>
      )}
      {plan.pickHint && <p className="text-[11px] text-stone-500">{plan.pickHint}</p>}
      {plan.groups.map((g) => (
        <div key={g.title} data-testid={`group-${g.title}`}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{g.title}{g.rule === "areas-2" ? " · elective area" : ""}</div>
          {g.hint && <p className="text-[11px] text-stone-500">{g.hint}</p>}
          <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-1">
            {g.options.map((o) => {
              const sel = has(o);
              return (
                <button type="button" key={o.code} onClick={() => toggle(g, o)} className={`rounded-lg border p-2 text-xs flex items-center gap-2 text-left ${sel ? "" : "bg-white"}`} style={box(sel)} data-testid={`elect-${o.name}`} aria-pressed={sel}>
                  {sel ? <Check size={12} className="text-emerald-700" /> : <span className={`h-3 w-3 border ${g.rule === "one" ? "rounded-full" : "rounded"}`} style={{ borderColor: "#D4C8A8" }} />}
                  <span className="flex-1"><strong>{o.name}</strong>{o.note ? <span className="text-stone-500"> · {o.note}</span> : null}{o.units ? <span className="text-stone-500"> · {o.units} units</span> : null}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {problem ? <p className="text-xs font-semibold text-amber-800" role="status" data-testid="plan-problem">{problem}</p>
        : plan.groups.some((g) => g.rule !== "pick") ? <p className="text-xs font-semibold text-emerald-800" role="status">✓ Meets the subject rules for this year level.</p> : null}
    </div>
  );
}

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
  const [prefs, setPrefs] = useState({ calendar_colour: sp.calendar_colour || "#0F766E", duration_minutes: sp.duration_minutes || "", delivery: sp.delivery || "", reading: sp.reading || "", complexity: sp.complexity || "", activity_types: (sp.activity_types || []).join(", "), support_areas: sp.support_areas || "", extension_areas: sp.extension_areas || "", equipment: sp.equipment || "", other: sp.other || "" });
  const setP = (k, v) => setPrefs(p => ({ ...p, [k]: v }));
  const [aiHelp, setAiHelp] = useState(student.ai_help !== false);
  const [helpUse, setHelpUse] = useState(null);
  useEffect(() => { api.get("/ai/help-usage").then(r => setHelpUse(r.data)).catch(() => {}); }, []);
  const [busy, setBusy] = useState(false);
  const jurisdiction = useJurisdiction();
  const bands = bandsFor(jurisdiction);
  const stage = bandOf(f.stage);
  // Subjects: what the Outcome Tracker and Auto-Quest follow for this child (none saved = every learning area).
  const [courses, setCourses] = useState(Array.isArray(student.electives) ? student.electives : []);
  const [adding, setAdding] = useState("");
  const plan = subjectPlanFor(jurisdiction, f.stage);
  const options = [...plan.required, ...plan.groups.flatMap((g) => g.options)];
  const sameSubject = (a, b) => a.code === b.code || String(a.name).toLowerCase() === String(b.name).toLowerCase();
  const addable = options.filter((o, i) => !courses.some((c) => sameSubject(c, o)) && options.findIndex((x) => x.code === o.code) === i);
  const problem = courses.length ? selectionProblem(plan, courses.map((c) => options.find((o) => sameSubject(o, c)) || c)) : "";

  const changeStage = (code) => {
    const st = bandOf(code);
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
        electives: courses.map(({ code, name, learning_area, units }) => ({ code, name, learning_area, ...(units ? { units } : {}) })),
      });
      if (f.pin) await api.put(`/students/${student.id}/pin`, { pin: f.pin });
      toast.success("Saved");
      onSaved();
    } catch (err) { toast.error(apiErrorMessage(err)); }
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
                {bands.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>
            </F>
            <F label="Year level">
              <select value={f.year_level} onChange={e=>setF({...f, year_level: e.target.value})} className="input" data-testid="e-year">
                {stage?.years.map(y => <option key={y} value={y}>{yearName(jurisdiction, y)}</option>)}
              </select>
            </F>
          </div>
          <F label="Calendar colour"><input type="color" value={prefs.calendar_colour} onChange={e=>setP("calendar_colour",e.target.value)} aria-label={`Calendar colour for ${student.name}`} data-testid="edit-child-colour" className="h-10 w-20 rounded border border-stone-300"/></F>
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
          {(
            <div className="rounded-xl border border-stone-300 p-3 space-y-2" data-testid="edit-subjects">
              <div className="text-xs font-semibold text-stone-700">Subjects this year</div>
              <p className="text-[11px] text-stone-500">The Outcome Tracker, Auto-Quest and the printable record follow these subjects. {plan.summary}</p>
              <div className="flex flex-wrap gap-1.5">
                {courses.length === 0 && <span className="text-xs text-stone-500">None saved, so every learning area is tracked.</span>}
                {courses.map(c => (
                  <span key={c.code || c.name} className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-2 py-0.5 text-xs" data-testid={`subject-${c.name}`}>
                    {c.name}<button type="button" aria-label={`Remove ${c.name}`} onClick={() => setCourses(cs => cs.filter(x => x !== c))}><X size={12}/></button>
                  </span>
                ))}
              </div>
              {addable.length > 0 && (
                <div className="flex gap-2">
                  <select value={adding} onChange={e => setAdding(e.target.value)} className="input" aria-label="Add a subject" data-testid="subject-add-select">
                    <option value="">Add a subject…</option>
                    {addable.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
                  </select>
                  <button type="button" disabled={!adding} onClick={() => { const o = options.find(x => x.code === adding); if (o) setCourses(cs => [...cs, { code: o.code, name: o.name, learning_area: o.learning_area, ...(o.units ? { units: o.units } : {}) }]); setAdding(""); }} className="rounded-full border border-stone-400 px-3 text-xs font-semibold disabled:opacity-50" data-testid="subject-add">Add</button>
                </div>
              )}
              {problem && <p className="text-xs font-semibold text-amber-800" data-testid="edit-plan-problem">{problem}</p>}
              {plan.source && <a href={plan.source} target="_blank" rel="noopener noreferrer" className="text-[11px] underline" style={{ color: "#4A5D3A" }}>Official guidance ↗</a>}
            </div>
          )}
        </div>
        <button disabled={busy} className="mt-5 w-full rounded-full py-3 text-sm font-bold disabled:opacity-50" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="edit-save">{busy ? "Saving…" : "Save changes"}</button>
      </form>
    </Modal>
  );
}

export default function ChildrenPage() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const jurisdiction = useJurisdiction();
  const bands = bandsFor(jurisdiction);
  const [form, setForm] = useState({ name: "", username: "", pin: "", stage: "S2", year_level: "3", birth_year: "", calendar_colour: "#0F766E" });
  const [chosen, setChosen] = useState([]);
  const [creds, setCreds] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () => api.get("/students").then(r => setStudents(r.data));
  useEffect(() => { load(); }, []);

  const plan = subjectPlanFor(jurisdiction, form.stage);
  useEffect(() => {
    const stage = bandOf(form.stage);
    setForm(f => ({ ...f, year_level: stage?.years?.[0] || "" }));
    // States with no compulsory list start with every learning area ticked; parents untick what they don't cover.
    const p = subjectPlanFor(jurisdiction, form.stage);
    setChosen(p.defaultAll ? [...p.groups[0].options] : []);
  }, [form.stage, jurisdiction]);

  const submit = async (e) => {
    e.preventDefault();
    const problem = selectionProblem(plan, chosen);
    if (problem) { toast.error(problem); return; }
    try {
      const stage = bandOf(form.stage);
      const subjects = finalSubjects(plan, chosen);
      const { data: created } = await api.post("/students", {
        ...form, theme: stage?.theme,
        birth_year: form.birth_year ? Number(form.birth_year) : null,
        electives: subjects,
        prefs: { calendar_colour: form.calendar_colour || "#0F766E" },
      });
      // Save the PIN again so a parent can view it later. The child can already sign in if this step fails.
      try { await api.put(`/students/${created.id}/pin`, { pin: form.pin }); } catch { /* ignore */ }
      toast.success("Student added");
      setOpen(false);
      setForm({ name: "", username: "", pin: "", stage: "S2", year_level: "3", birth_year: "", calendar_colour: "#0F766E" });
      setChosen([]);
      load();
    } catch (err) { toast.error(apiErrorMessage(err)); }
  };

  const del = async (id) => {
    if (!window.confirm("Remove this student? Their records stay in the family archive.")) return;
    await api.delete(`/students/${id}`); toast.success("Removed"); load();
  };

  const currentStage = bandOf(form.stage);

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="children-page">
      <div className="flex items-end justify-between">
        <div>
          <h1 data-tour="tour-children" className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Children</h1>
          <p className="text-sm text-stone-600 mt-1">Click a child to view their learning dashboard and send high-fives.</p>
        </div>
        <button onClick={() => setOpen(true)} className="rounded-full px-4 py-2 text-sm font-bold flex items-center gap-1.5" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="add-student-btn"><Plus size={14}/> Add student</button>
      </div>
      <Link to="/get-app?for=child" className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 hover:shadow-sm" style={{border:"1px solid #D4C8A8"}} data-testid="kids-app-link">
        <span><span className="block text-sm font-bold" style={{color:"#1F3B2D"}}>📱 Set up Side-Quest on your child's own phone or tablet</span>
          <span className="block text-xs text-stone-500">Installs the kids' app, which opens straight to their sign-in (username and PIN).</span></span>
        <span aria-hidden className="text-stone-400">›</span>
      </Link>

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
                <div className="mt-3 text-xs text-stone-600"><strong>Subjects:</strong> {s.electives.length}</div>
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
              <p className="text-sm rounded-xl bg-emerald-50 border border-emerald-200 p-3">Unsure which subjects or stage your child needs? <Link to="/parent/homeschool-compass" onClick={() => setOpen(false)} className="font-bold underline text-emerald-900">Use the Homeschooling Compass requirements finder</Link> before choosing their learning program.</p>
              <F label="Calendar colour"><input type="color" value={form.calendar_colour} onChange={e=>setForm({...form,calendar_colour:e.target.value})} aria-label="Calendar colour for new child" data-testid="new-child-colour" className="h-10 w-20 rounded border border-stone-300"/></F>
               <F label="Name"><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="input" data-testid="f-name"/></F>
              <F label="Username (for sign in)"><input required value={form.username} onChange={e=>setForm({...form, username: e.target.value})} className="input" data-testid="f-username"/></F>
              <F label="PIN (4+ digits)"><input required type="password" minLength={4} value={form.pin} onChange={e=>setForm({...form, pin: e.target.value})} className="input" data-testid="f-pin"/></F>
              <div className="grid grid-cols-2 gap-3">
                <F label={jurisdiction === "NSW" ? "Stage" : "Year group"}>
                  <select value={form.stage} onChange={e=>setForm({...form, stage: e.target.value})} className="input" data-testid="f-stage">
                    {bands.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </F>
                <F label="Year level">
                  <select value={form.year_level} onChange={e=>setForm({...form, year_level: e.target.value})} className="input" data-testid="f-year">
                    {currentStage?.years.map(y => <option key={y} value={y}>{yearName(jurisdiction, y)}</option>)}
                  </select>
                </F>
              </div>
              <F label="Birth year (optional)"><input type="number" value={form.birth_year} onChange={e=>setForm({...form, birth_year: e.target.value})} className="input" data-testid="f-birth"/></F>

              <SubjectPicker plan={plan} chosen={chosen} setChosen={setChosen} title={`Subjects — ${currentStage ? (jurisdiction === "NSW" ? currentStage.nsw : yearName(jurisdiction, currentStage.years[0]) + (currentStage.years.length > 1 ? `–${currentStage.years[currentStage.years.length - 1]}` : "")) : ""}`} />
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
