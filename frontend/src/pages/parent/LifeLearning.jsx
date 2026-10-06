import React, { useEffect, useState, useRef } from "react";
import { api, fileUrl } from "../../lib/api";
import { toast } from "sonner";
import { Plus, X, Sparkles, Loader2, Check, Upload, Trees, Camera, FileText } from "lucide-react";
import { Fern, Leaf as LeafGraphic } from "../../components/shared/Botanical";

const AREAS = ["English","Mathematics","Science and Technology","HSIE","PDHPE","Creative Arts","Languages","TAS"];

const EXAMPLES = [
  { t: "Baked sourdough bread", d: "Measured flour and water using cups and grams, timed the proofing, observed how the dough changed overnight, and compared the finished loaf to the one we baked last week." },
  { t: "Bushwalk at Lane Cove", d: "Walked 4km along a bush trail, identified three native plants using the park guide, counted bird species, and sketched the creek in a nature journal." },
  { t: "Grocery shop budget", d: "Had $40 to spend on weekly fruit and veg. Compared unit prices, added items in head, worked out change, and chose cheaper per-kg options." },
  { t: "Built a bird feeder", d: "Measured and cut timber, designed a stable base, used a drill with supervision, wrote and followed a materials list, tested it in the yard." },
];

export default function LifeLearningPage() {
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analysing, setAnalysing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const [form, setForm] = useState({ student_id: "", title: "", description: "", duration_minutes: 60, location: "", parent_note: "" });

  const load = () => api.get("/life-evidence").then(r => setItems(r.data));
  useEffect(() => {
    load();
    api.get("/students").then(r => { setStudents(r.data); if (r.data[0]) setForm(f => ({...f, student_id: r.data[0].id})); });
  }, []);

  const upload = async (file) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file", file); fd.append("context", "life_evidence");
    try {
      const { data } = await api.post("/files/upload", fd, { headers: {"Content-Type":"multipart/form-data"} });
      setUploadedFiles(f => [...f, data]); toast.success("Uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.student_id) { toast.error("Choose a student"); return; }
    try {
      await api.post("/life-evidence", { ...form, duration_minutes: Number(form.duration_minutes), file_ids: uploadedFiles.map(f=>f.id) });
      toast.success("Logged — now map it to outcomes with AI");
      setOpen(false); setForm({ student_id: form.student_id, title: "", description: "", duration_minutes: 60, location: "", parent_note: "" }); setUploadedFiles([]);
      load();
    } catch { toast.error("Failed"); }
  };

  const openItem = async (id) => {
    const { data } = await api.get(`/life-evidence/${id}`);
    setActive(data);
    setAnalysis(data.ai_mappings?.length ? { mappings: data.ai_mappings, summary: data.ai_summary, activity_type: data.ai_activity_type, additional_evidence_suggested: data.ai_additional } : null);
  };

  const analyse = async () => {
    setAnalysing(true);
    try {
      const { data } = await api.post("/life-evidence/analyse", { evidence_id: active.id });
      setAnalysis(data);
      toast.success("Mapping ready — review each outcome");
    } catch (err) { toast.error(err.response?.data?.detail || "Analysis failed"); }
    finally { setAnalysing(false); }
  };

  const toggleMap = (id, val) => {
    setAnalysis(a => ({ ...a, mappings: a.mappings.map(m => m.id === id ? {...m, accepted: val} : m) }));
  };

  const saveReview = async (status) => {
    try {
      await api.post(`/life-evidence/${active.id}/review`, { outcome_mappings: analysis.mappings, status, parent_note: active.parent_note || "" });
      toast.success("Recorded");
      setActive(null); setAnalysis(null); load();
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="p-8 lg:p-10 space-y-6 relative" data-testid="life-learning-page">
      <LeafGraphic className="absolute right-4 top-8" size={70} color="#6B8A5B"/>
      <header>
        <div className="font-script text-2xl" style={{color:"#C77B5B"}}>Everyday learning counts</div>
        <h1 className="font-display text-4xl font-bold" style={{color:"#1F3B2D"}}>Life Learning</h1>
        <p className="mt-2 text-sm text-stone-600 max-w-3xl leading-relaxed">
          Baking, bushwalking, animal care, building, music, budgeting — NESA home-schooling recognises that genuine learning
          happens everywhere. Log what you did, upload a photo or two, and let AI suggest which curriculum outcomes it maps to.
          You review and accept each mapping.
        </p>
      </header>

      <div className="flex items-center gap-3">
        <button onClick={()=>setOpen(true)} className="rounded-full px-5 py-2.5 text-sm font-bold flex items-center gap-2 hover:translate-y-[-1px] transition" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="add-life"><Plus size={14}/> Log an activity</button>
        <div className="text-xs text-stone-500">{items.length} activities logged</div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(i => (
          <button key={i.id} onClick={()=>openItem(i.id)} className="paper-card p-5 text-left hover:translate-y-[-2px] transition" data-testid={`life-${i.id}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="font-display text-lg font-bold leading-tight" style={{color:"#1F3B2D"}}>{i.title}</div>
              <span className={`pill pill-${i.status === "awaiting_mapping" ? "not-started" : i.status === "mapping_ready" ? "submitted" : "accepted"}`}>
                {i.status.replace(/_/g, " ")}
              </span>
            </div>
            <div className="text-xs text-stone-500 mt-1">{i.student?.name} · {i.date}</div>
            <p className="mt-3 text-sm text-stone-700 line-clamp-3">{i.description}</p>
            {i.accepted_mappings?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {i.accepted_mappings.slice(0,4).map((m,ix) => <span key={ix} className="text-[10px] px-2 py-0.5 rounded-full border font-semibold" style={{backgroundColor:"#F0F4E8", borderColor:"#94A47F", color:"#1F3B2D"}}>{m.learning_area}</span>)}
                {i.accepted_mappings.length > 4 && <span className="text-[10px] text-stone-500">+{i.accepted_mappings.length - 4}</span>}
              </div>
            )}
          </button>
        ))}
        {items.length === 0 && (
          <div className="col-span-full paper-card p-10 text-center">
            <Trees className="mx-auto mb-3" size={32} style={{color:"#6B8A5B"}}/>
            <p className="font-display text-lg" style={{color:"#1F3B2D"}}>No life learning logged yet</p>
            <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto">Try one of these to get started:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((ex,i) => <button key={i} onClick={()=>{setForm(f=>({...f, title: ex.t, description: ex.d})); setOpen(true);}} className="rounded-full border px-3 py-1 text-xs font-semibold" style={{borderColor:"#D4C8A8", color:"#4A5D3A"}}>{ex.t}</button>)}
            </div>
          </div>
        )}
      </div>

      {/* Add dialog */}
      {open && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=>setOpen(false)}>
          <form onClick={e=>e.stopPropagation()} onSubmit={submit} className="w-full max-w-xl paper-card p-7 my-8" data-testid="life-form">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold" style={{color:"#1F3B2D"}}>Log a life-learning activity</h2>
              <button type="button" onClick={()=>setOpen(false)}><X size={18}/></button>
            </div>
            <div className="space-y-3">
              <F label="Student">
                <select required value={form.student_id} onChange={e=>setForm({...form, student_id: e.target.value})} className="input" data-testid="life-student">
                  <option value="">Choose…</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.stage})</option>)}
                </select>
              </F>
              <F label="What did you do?"><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="e.g. Baked sourdough bread" className="input" data-testid="life-title"/></F>
              <F label="Describe what happened in detail (the richer, the better)">
                <textarea required rows={5} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="What they did, what they measured, what they noticed, what they wrote, what they said…" className="input" data-testid="life-desc"/>
              </F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Duration (min)"><input type="number" value={form.duration_minutes} onChange={e=>setForm({...form, duration_minutes: e.target.value})} className="input" data-testid="life-duration"/></F>
                <F label="Location"><input value={form.location} onChange={e=>setForm({...form, location: e.target.value})} placeholder="Kitchen, Lane Cove NP, …" className="input" data-testid="life-location"/></F>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Upload evidence (photos, scans, audio, video)</label>
                <input ref={fileRef} type="file" accept="image/*,audio/*,video/*,application/pdf" onChange={e=>e.target.files[0] && upload(e.target.files[0])} className="hidden"/>
                <button type="button" onClick={()=>fileRef.current.click()} disabled={uploading} className="mt-1 w-full rounded-xl border-2 border-dashed p-4 text-sm font-semibold flex items-center justify-center gap-2" style={{borderColor:"#D4C8A8", color:"#4A5D3A"}} data-testid="life-upload">
                  {uploading ? <><Loader2 size={14} className="animate-spin"/> Uploading…</> : <><Upload size={14}/> Add a file</>}
                </button>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {uploadedFiles.map(f => (
                      <div key={f.id} className="rounded-lg border overflow-hidden" style={{borderColor:"#D4C8A8"}}>
                        {f.content_type?.startsWith("image/") ? <img src={fileUrl(f.id)} className="h-16 w-full object-cover" alt=""/> : <div className="h-16 bg-stone-50 grid place-items-center"><FileText size={16}/></div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button className="mt-5 w-full rounded-full py-3 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="submit-life">Log activity</button>
          </form>
        </div>
      )}

      {/* Review dialog */}
      {active && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=>{setActive(null); setAnalysis(null);}}>
          <div onClick={e=>e.stopPropagation()} className="w-full max-w-3xl paper-card p-7 my-8" data-testid="life-review">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="font-script text-xl" style={{color:"#C77B5B"}}>Life learning</div>
                <h2 className="font-display text-2xl font-bold" style={{color:"#1F3B2D"}}>{active.title}</h2>
                <p className="text-xs text-stone-500 mt-1">{active.student?.name} · {active.date} · {active.location || "—"}</p>
              </div>
              <button onClick={()=>{setActive(null); setAnalysis(null);}}><X size={18}/></button>
            </div>

            <section className="mb-5">
              <div className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Description</div>
              <div className="rounded-xl p-4 text-sm whitespace-pre-wrap" style={{backgroundColor:"#F5EFE0"}}>{active.description}</div>
            </section>

            {active.files?.length > 0 && (
              <section className="mb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Evidence ({active.files.length})</div>
                <div className="grid grid-cols-4 gap-2">
                  {active.files.map(f => f.content_type?.startsWith("image/")
                    ? <a key={f.id} href={fileUrl(f.id)} target="_blank" rel="noreferrer"><img src={fileUrl(f.id)} className="rounded-lg h-24 w-full object-cover" alt=""/></a>
                    : <a key={f.id} href={fileUrl(f.id)} target="_blank" rel="noreferrer" className="rounded-lg h-24 bg-stone-50 border border-stone-200 grid place-items-center text-xs">{f.original_filename}</a>
                  )}
                </div>
              </section>
            )}

            <section className="rounded-xl p-5" style={{backgroundColor:"#F0F4E8", border:"1px solid #94A47F"}}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-display text-lg font-bold flex items-center gap-2" style={{color:"#1F3B2D"}}><Sparkles size={16}/> AI outcome mapping</div>
                <button onClick={analyse} disabled={analysing} className="rounded-full px-4 py-1.5 text-xs font-bold disabled:opacity-50" style={{backgroundColor:"#4A5D3A", color:"#F5EFE0"}} data-testid="analyse-life">
                  {analysing ? <><Loader2 size={12} className="animate-spin inline mr-1"/>Mapping…</> : (analysis ? "Re-map" : "Map to outcomes")}
                </button>
              </div>
              {!analysis ? (
                <p className="text-sm text-stone-700">Click "Map to outcomes" to get AI-suggested NSW curriculum links across learning areas. You accept each one.</p>
              ) : (
                <>
                  <div className="text-sm mb-3"><strong>Summary:</strong> {analysis.summary}</div>
                  {analysis.activity_type && <div className="text-xs mb-3 inline-block px-2 py-0.5 rounded-full bg-white border font-mono" style={{borderColor:"#D4C8A8"}}>{analysis.activity_type}</div>}
                  <div className="space-y-2">
                    {analysis.mappings.map(m => (
                      <div key={m.id} className={`rounded-xl p-3 border bg-white transition ${m.accepted === true ? "border-emerald-500 bg-emerald-50" : m.accepted === false ? "border-stone-200 opacity-50" : "border-stone-300"}`} data-testid={`map-${m.id}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{backgroundColor:"#F5EFE0", color:"#1F3B2D"}}>{m.learning_area}</span>
                              {m.code && <span className="font-mono text-[10px] text-stone-500">{m.code}</span>}
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${m.confidence === "high" ? "bg-emerald-100 text-emerald-900" : m.confidence === "medium" ? "bg-amber-100 text-amber-900" : "bg-stone-100 text-stone-700"}`}>{m.confidence} confidence</span>
                            </div>
                            <div className="font-semibold text-sm mt-1">{m.description}</div>
                            <div className="text-xs text-stone-600 italic mt-0.5">{m.evidence_statement}</div>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={()=>toggleMap(m.id, true)} className={`rounded-full p-2 ${m.accepted === true ? "bg-emerald-600 text-white" : "border border-stone-300 bg-white"}`} data-testid={`accept-${m.id}`}><Check size={14}/></button>
                            <button onClick={()=>toggleMap(m.id, false)} className={`rounded-full p-2 ${m.accepted === false ? "bg-stone-700 text-white" : "border border-stone-300 bg-white"}`} data-testid={`reject-${m.id}`}><X size={14}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {analysis.additional_evidence_suggested && <div className="mt-3 text-xs text-stone-600 italic">Add: {analysis.additional_evidence_suggested}</div>}
                </>
              )}
            </section>

            {analysis && (
              <div className="mt-5 flex items-center gap-3">
                <button onClick={()=>saveReview("accepted")} className="rounded-full px-5 py-2.5 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="life-accept">Save as accepted</button>
                <button onClick={()=>saveReview("demonstrated")} className="rounded-full px-5 py-2.5 text-sm font-bold bg-emerald-600 text-white" data-testid="life-demo">Mark demonstrated</button>
                <button onClick={()=>saveReview("needs_more_evidence")} className="rounded-full border px-5 py-2.5 text-sm font-bold" style={{borderColor:"#D4C8A8", color:"#52473A"}} data-testid="life-more">Needs more evidence</button>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`.input { width:100%; border-radius:0.75rem; border:1px solid #D4C8A8; padding:0.6rem 0.85rem; font-size:0.875rem; background: #fff; } .input:focus { outline:none; border-color:#4A5D3A; }`}</style>
    </div>
  );
}
const F = ({ label, children }) => (<div><label className="text-xs font-bold uppercase tracking-widest text-stone-500">{label}</label><div className="mt-1">{children}</div></div>);
