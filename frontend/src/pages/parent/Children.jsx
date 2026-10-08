import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Plus, Trash2, X, Check } from "lucide-react";

const STAGES = [
  { code: "ES1", name: "Early Stage 1 (Kindergarten)", theme: "early", years: ["K"] },
  { code: "S1", name: "Stage 1 (Years 1-2)", theme: "primary", years: ["1", "2"] },
  { code: "S2", name: "Stage 2 (Years 3-4)", theme: "primary", years: ["3", "4"] },
  { code: "S3", name: "Stage 3 (Years 5-6)", theme: "primary", years: ["5", "6"] },
  { code: "S4", name: "Stage 4 (Years 7-8)", theme: "secondary", years: ["7", "8"] },
  { code: "S5", name: "Stage 5 (Years 9-10)", theme: "secondary", years: ["9", "10"] },
  { code: "S6", name: "Stage 6 (Years 11-12 / HSC)", theme: "senior", years: ["11", "12"] },
];

// Used when the server returns no Stage 4 electives. Optional `years` limits an elective to those year levels.
const S4_ELECTIVES = [
  { code: "DRAMA-S4", name: "Drama", learning_area: "Creative Arts" },
  { code: "DANCE-S4", name: "Dance", learning_area: "Creative Arts" },
  { code: "MUSIC-S4", name: "Music (elective)", learning_area: "Creative Arts" },
  { code: "VISARTS-S4", name: "Visual Arts (elective)", learning_area: "Creative Arts" },
  { code: "AGR-S4", name: "Agricultural Technology", learning_area: "Technology" },
  { code: "DT-S4", name: "Design and Technology", learning_area: "Technology" },
  { code: "FT-S4", name: "Food Technology", learning_area: "Technology" },
  { code: "IND-S4", name: "Industrial Technology", learning_area: "Technology" },
  { code: "IST-S4", name: "Information and Software Technology", learning_area: "Technology" },
  { code: "TEXT-S4", name: "Textiles Technology", learning_area: "Technology" },
  { code: "LOTE-S4", name: "Languages", learning_area: "Languages" },
  { code: "PASS-S4", name: "Physical Activity and Sports Studies", learning_area: "PDHPE" },
  { code: "HISTE-S4", name: "History Elective", learning_area: "HSIE" },
  { code: "GEOE-S4", name: "Geography Elective", learning_area: "HSIE" },
  { code: "COM-S4", name: "Commerce", learning_area: "HSIE", years: ["8"] },
];

export default function ChildrenPage() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [pattern, setPattern] = useState(null);
  const [form, setForm] = useState({ name: "", username: "", pin: "", stage: "S2", year_level: "3", birth_year: "" });
  const [electives, setElectives] = useState([]);

  const load = () => api.get("/students").then(r => setStudents(r.data));
  useEffect(() => { load(); }, []);

  useEffect(() => {
    const stage = STAGES.find(s => s.code === form.stage);
    setForm(f => ({ ...f, year_level: stage?.years?.[0] || "" }));
    if (["S4","S5","S6"].includes(form.stage)) {
      api.get(`/curriculum/pattern/${form.stage}`).then(r => {
        const p = r.data || {};
        setPattern(form.stage === "S4" && !(p.electives || []).length ? { ...p, electives: S4_ELECTIVES } : p);
      });
    } else { setPattern(null); setElectives([]); }
  }, [form.stage]);

  const shownElectives = (pattern?.electives || []).filter(e => !e.years || !form.year_level || e.years.includes(form.year_level));
  const chosen = electives.filter(e => shownElectives.some(x => x.code === e.code));

  const toggleElective = (e) => {
    setElectives(cur => cur.find(x => x.code === e.code) ? cur.filter(x => x.code !== e.code) : [...cur, e]);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const stage = STAGES.find(s => s.code === form.stage);
      const chosenElectives = ["S4","S5","S6"].includes(form.stage)
        ? [...(pattern?.compulsory || []), ...chosen] : [];
      await api.post("/students", {
        ...form, theme: stage?.theme,
        birth_year: form.birth_year ? Number(form.birth_year) : null,
        electives: chosenElectives,
      });
      toast.success("Student added");
      setOpen(false);
      setForm({ name: "", username: "", pin: "", stage: "S2", year_level: "3", birth_year: "" });
      setElectives([]);
      load();
    } catch (err) { toast.error(err.response?.data?.detail || "Failed"); }
  };

  const del = async (id) => {
    if (!window.confirm("Remove this student? Their records stay in the family archive.")) return;
    await api.delete(`/students/${id}`); toast.success("Removed"); load();
  };

  const currentStage = STAGES.find(s => s.code === form.stage);
  const totalUnits = [...(pattern?.compulsory || []), ...chosen].reduce((n, e) => n + (e.units || 1), 0);

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="children-page">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Children</h1>
          <p className="text-sm text-stone-600 mt-1">Click a child to view their learning dashboard and send high-fives.</p>
        </div>
        <button onClick={() => setOpen(true)} className="rounded-full px-4 py-2 text-sm font-bold flex items-center gap-1.5" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="add-student-btn"><Plus size={14}/> Add student</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(s => (
          <div key={s.id} className="paper-card p-6 relative group" data-testid={`student-${s.id}`}>
            <button onClick={() => del(s.id)} className="absolute top-4 right-4 text-stone-300 hover:text-rose-600 opacity-0 group-hover:opacity-100" data-testid={`del-${s.id}`}><Trash2 size={14}/></button>
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
          </div>
        ))}
        {students.length === 0 && (
          <div className="col-span-full paper-card p-10 text-center text-sm text-stone-500">No students yet.</div>
        )}
      </div>

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
                  <div className="font-display text-base font-bold" style={{color:"#1F3B2D"}}>NESA pattern — {pattern.band_name}</div>
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
                  {shownElectives.length > 0 && (
                    <div className="mt-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Electives (select as needed)</div>
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
                      <div className="mt-2 text-xs text-stone-600">Selected: {chosen.length} elective{chosen.length === 1 ? "" : "s"} · Total units planned: {totalUnits}</div>
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
