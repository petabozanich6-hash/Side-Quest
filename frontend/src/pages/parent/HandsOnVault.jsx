import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";
import { Beaker, BookOpen, CheckSquare, ChevronRight, Clock, Home, Lock, PackageCheck, Printer, Search, ShieldAlert, Sparkles, Trees, X } from "lucide-react";

const AGE_FILTERS = [
  ["all", "Any age"], ["4-6", "4–6 years"], ["7-9", "7–9 years"],
  ["10-12", "10–12 years"], ["13-18", "13+ years"],
];
const MESS_FILTERS = ["Any mess level", "Low", "Medium", "High"];
const CATEGORY_ICONS = { "Kitchen Science":"🧪", "Crystal Lab":"💎", "Dough & Sensory":"👐",
  "LEGO & Builders":"🧱", "Engineering Lab":"🏗️", "Nature Explorers":"🌿",
  "Art & Making":"🎨", "Everyday Maths":"📐", "Stories & Words":"📜", "Movement & Games":"🏅",
  "Space & Sky":"🪐", "Sound & Music":"🎶", "Coding Without Screens":"🤖",
  "Practical Life":"🧺", "History & Maps":"🗺️",
  "Light & Colour":"🌈", "Forces & Motion":"🛞", "Weather Watch":"🌤️",
  "Plants & Gardens":"🌱", "Logic & Probability":"🧩", "Drama & Performance":"🎭",
  "Design for Everyone":"🛠️", "Money & Markets":"🛒",
  "Earth & Landforms":"🌍", "Community & Civics":"🏛️",
  "Sun & Energy":"☀️", "Bubbles & Water Play":"🫧",
  "Mini Makers & Machines":"🏗️", "Kitchen Reaction Lab":"🧪",
  "Halloween Crafts":"🎃", "Halloween Discovery & Games":"👻" };
function ageOverlap(ages, filter) {
  if (filter === "all") return true;
  const range = String(ages).match(/(\d+)[^\d]+(\d+)/);
  const [min, max] = range ? [Number(range[1]), Number(range[2])] : [0, 99];
  const [wantMin, wantMax] = filter.split("-").map(Number);
  return min <= wantMax && max >= wantMin;
}
const printStyles = `
@page { size: A4 portrait; margin: 12mm; }
@media print {
  /* Remove hidden catalogue/sidebar layout, otherwise long lists create empty print pages. */
  .parent-shell { display: block !important; }
  .parent-shell > aside, .parent-shell > main > :not(#hands-on-vault-page) { display: none !important; }
  .parent-shell > main { display: block !important; position: static !important; width: 100% !important; padding: 0 !important; }
  #hands-on-vault-page { display: block !important; padding: 0 !important; margin: 0 !important; }
  #hands-on-vault-page > header,
  #hands-on-vault-page > section,
  #hands-on-vault-page > div:not(.hands-on-body) { display: none !important; }
  #hands-on-vault-page .hands-on-body { display: block !important; margin: 0 !important; }
  #hands-on-vault-page .hands-on-list { display: none !important; }
  #hands-on-vault-page .hands-on-detail { display: block !important; position: static !important; width: 100% !important; margin: 0 !important; }
  #hands-on-vault-page .hands-on-detail > :not(#hands-on-print) { display: none !important; }
  body * { visibility: hidden !important; }
  #hands-on-print, #hands-on-print * { visibility: visible !important; }
  #hands-on-print { position: static !important; left: auto !important; top: auto !important;
    width: 100% !important; max-width: none !important; margin: 0 !important;
    border: 0 !important; box-shadow: none !important; padding: 0 !important; background: white !important; }
  #hands-on-print .print-tile { border: 1px solid #b9c6b7 !important; background: white !important; }
  #hands-on-print .print-notes { display: block !important; }
  #hands-on-print .print-step { break-inside: avoid; }
  #hands-on-print .print-step-checkbox { appearance: none; display: inline-block; height: 10pt; width: 10pt; border: 1px solid #6B806B; flex-shrink: 0; }
  #hands-on-print .print-step-checkbox:checked { background: #CBDCCB; }
  #hands-on-print h1 { font-size: 24pt !important; line-height: 1.1 !important; }
  #hands-on-print h2 { font-size: 12pt !important; }
  #hands-on-print p, #hands-on-print li, #hands-on-print span { font-size: 9.5pt; }
  #hands-on-print .print-footer { display: block !important; }
  #hands-on-print .print-only { display: block !important; }
  #hands-on-print .print-sections { gap: 9px !important; }
  #hands-on-print .print-section { padding: 8px !important; }\n  #hands-on-print .print-section h3 { font-size: 9pt !important; }
}
`;

export default function HandsOnVault() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState(null);
  const [opening, setOpening] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All quests");
  const [age, setAge] = useState("all");
  const [mess, setMess] = useState(MESS_FILTERS[0]);
  const [time, setTime] = useState("all");
  const [have, setHave] = useState("");
  const [packed, setPacked] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const detailsRef = useRef(null);

  useEffect(() => {
    let active = true;
    api.get("/hands-on-quests")
      .then(({data:payload}) => { if (active) setData(payload); })
      .catch(e => { if (active) setError(apiErrorMessage(e, "Could not open Hands-On Quest Vault")); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const items = useMemo(() => (data?.items || []).filter(q => {
    if (category !== "All quests" && q.category !== category) return false;
    if (!ageOverlap(q.ages, age)) return false;
    if (mess !== MESS_FILTERS[0] && q.mess !== mess) return false;
    if (time !== "all" && q.minutes > Number(time)) return false;
    const words = [q.title,q.category,q.description,...(q.skills || []),...(q.materials || [])].join(" ").toLowerCase();
    if (query.trim() && !words.includes(query.trim().toLowerCase())) return false;
    if (have.trim() && !(q.materials || []).join(" ").toLowerCase().includes(have.trim().toLowerCase())) return false;
    return true;
  }), [data,query,category,age,mess,time,have]);

  async function openQuest(id) {
    if (!data?.unlocked) return;
    setSelectedId(id);
    setDetail(null);
    setPacked([]);
    setCompletedSteps([]);
    setOpening(true);
    try {
      const {data:quest} = await api.get(`/hands-on-quests/${encodeURIComponent(id)}`);
      setDetail(quest);
      if (window.matchMedia("(max-width: 1023px)").matches) {
        window.setTimeout(() => detailsRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 50);
      }
    } catch (e) {
      toast.error(apiErrorMessage(e,"Could not open the activity"));
      setSelectedId("");
    } finally { setOpening(false); }
  }

  const printQuest = () => {
    if (!detail || !data?.unlocked) return;
    window.print();
  };
  const recordUrl = detail ? `/parent/life-learning?${new URLSearchParams({
    vault_activity: detail.title,
    vault_minutes: String(detail.minutes),
  }).toString()}` : "#";

  return <div id="hands-on-vault-page" className="p-4 sm:p-8 lg:p-10 space-y-7" data-testid="hands-on-vault">
    <style>{printStyles}</style>
    <header className="relative rounded-3xl overflow-hidden p-6 md:p-9" style={{background:"#1F3B2D",color:"#F5EFE0"}}>
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full border-[30px] opacity-10" style={{borderColor:"#E8BC74"}} aria-hidden="true"/>
      <div className="relative flex flex-wrap gap-4 items-start justify-between">
        <div className="max-w-2xl">
          <div className="uppercase text-xs font-bold tracking-[0.25em]" style={{color:"#F2C88B"}}>Side-Quest • The adventure is all around you</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">Hands-On Quest Vault</h1>
          <p className="mt-3 text-sm md:text-base leading-relaxed opacity-90">
            Kitchen-table science, crystal gardens, LEGO challenges, homemade playdough and real-world adventures.
            No complicated kits, no compulsory worksheets — just things to make, test, discover and enjoy together.
          </p>
        </div>
        <div className="rounded-2xl px-5 py-3 text-center shrink-0" style={{background:"#345746"}}>
          <div className="text-3xl font-display font-bold">{data?.count ?? "—"}</div>
          <div className="text-xs opacity-85">family quests</div>
        </div>
      </div>
      <div className="relative mt-5 flex gap-3 flex-wrap text-xs font-semibold">
        <span className="rounded-full px-3 py-1.5 border border-white/30"><Home size={13} className="inline mr-1"/> Everyday supplies</span>
        <span className="rounded-full px-3 py-1.5 border border-white/30"><Printer size={13} className="inline mr-1"/> A4 printable guides</span>
        <span className="rounded-full px-3 py-1.5 border border-white/30"><Trees size={13} className="inline mr-1"/> Learning beyond screens</span>
      </div>
    </header>

    {loading && <div className="paper-card p-8 text-stone-600" role="status">Opening the Quest Vault…</div>}
    {error && <div className="paper-card p-6 text-red-800" role="alert">{error}</div>}

    {data && !data.unlocked && <div className="rounded-2xl border p-5 md:p-6 flex flex-wrap items-center gap-4" style={{borderColor:"#DAC69C",background:"#FCF5E6"}}>
      <Lock size={25} style={{color:"#8B6628"}}/>
      <div className="flex-1 min-w-52">
        <h2 className="font-display font-bold text-lg" style={{color:"#1F3B2D"}}>A treasure chest for Family Members</h2>
        <p className="text-sm text-stone-700 mt-1">Explore the activity titles below. Step-by-step guides, supply checklists and A4 printing unlock with your paid Family Membership.</p>
      </div>
      <Link className="rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{background:"#1F3B2D"}} to="/parent/plan">Explore membership</Link>
    </div>}

    {data && <>
      {(data.categories || []).includes("Halloween Crafts") && <section className="rounded-2xl border border-[#E1C0A0] bg-[#FFF4E7] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3" data-testid="halloween-vault-feature">
        <div><p className="font-display text-lg font-bold text-[#683E24]">🎃 Halloween quests have arrived!</p>
        <p className="text-sm text-[#744D31] mt-1">Make spooky decorations, investigate science and play curious games—no expensive kits or jump scares needed.</p></div>
        <div className="flex flex-wrap gap-2">
          {["Halloween Crafts","Halloween Discovery & Games"].map((choice,i) => <button key={choice} type="button"
            className="rounded-full bg-[#683E24] text-white px-4 py-2.5 font-bold text-sm"
            data-testid={i === 0 ? "halloween-show-all" : "halloween-show-games"}
            onClick={() => { setQuery("");setAge("all");setMess(MESS_FILTERS[0]);setTime("all");setHave("");setCategory(choice); }}>
            {i === 0 ? "🎨 Halloween crafts" : "🧪 Spooky science & games"}
          </button>)}
        </div>
      </section>}
      <section className="paper-card p-4 md:p-6 space-y-4" aria-label="Find a quest">
        <div className="flex items-center gap-2 font-display font-bold text-lg" style={{color:"#1F3B2D"}}><Search size={20}/> Find your next adventure</div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <label className="sm:col-span-2 xl:col-span-2 text-xs font-bold text-stone-600">Search activities
            <input data-testid="hands-on-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try crystals, LEGO, cooking, fractions…" className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 bg-white text-sm font-normal text-stone-900"/>
          </label>
          <label className="text-xs font-bold text-stone-600">Category
            <select value={category} onChange={e=>setCategory(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 bg-white text-sm font-normal">
              {["All quests",...(data.categories || [])].map(c=><option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-stone-600">Ages
            <select value={age} onChange={e=>setAge(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 bg-white text-sm font-normal">
              {AGE_FILTERS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-stone-600">Mess level
            <select value={mess} onChange={e=>setMess(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 bg-white text-sm font-normal">
              {MESS_FILTERS.map(x=><option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-stone-600">Time available
            <select value={time} onChange={e=>setTime(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 bg-white text-sm font-normal">
              <option value="all">Any duration</option><option value="20">Up to 20 min</option><option value="30">Up to 30 min</option><option value="45">Up to 45 min</option>
            </select>
          </label>
          {data.unlocked && <label className="text-xs font-bold text-stone-600 sm:col-span-2">Search supplies you have
            <input value={have} onChange={e=>setHave(e.target.value)} placeholder="Flour, paper, bricks…" className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 bg-white text-sm font-normal"/>
          </label>}
        </div>
        <p className="text-xs text-stone-500">{items.length} quests match your filters. Ages and times are guides, not requirements.</p>
      </section>

      <div className="hands-on-body grid xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.95fr)] gap-6 items-start">
        <section className="hands-on-list" aria-label="Activity catalogue">
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map(q=><div key={q.id} className="paper-card p-5 flex flex-col" data-testid={`quest-${q.id}`}>
              <div className="flex gap-3 items-start">
                <div aria-hidden="true" className="rounded-xl text-2xl grid place-items-center shrink-0 w-11 h-11" style={{background:"#E9F0E5"}}>{q.icon || CATEGORY_ICONS[q.category] || "🐉"}</div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider" style={{color:"#946341"}}>{q.category}</div>
                  <h3 className="font-display font-bold text-base mt-0.5" style={{color:"#1F3B2D"}}>{q.title}</h3>
                </div>
              </div>
              <p className="text-sm text-stone-600 mt-3 flex-1 leading-relaxed">{q.description}</p>
              <div className="text-xs text-stone-500 flex flex-wrap gap-2 mt-4">
                <span className="rounded-full px-2 py-1 bg-stone-100">Ages {q.ages}</span>
                <span className="rounded-full px-2 py-1 bg-stone-100">{q.minutes} min</span>
                <span className="rounded-full px-2 py-1 bg-stone-100">{q.mess} mess</span>
              </div>
              <button type="button" disabled={!data.unlocked || opening} onClick={()=>openQuest(q.id)}
                className="mt-4 rounded-xl py-2.5 px-3 w-full text-sm font-bold flex justify-center items-center gap-2 disabled:opacity-65"
                style={{background: selectedId === q.id ? "#C77B5B" : "#1F3B2D",color:"#FFF8E9"}}>
                {data.unlocked ? <>Open printable quest <ChevronRight size={15}/></> : <><Lock size={14}/> Member guide</>}
              </button>
            </div>)}
          </div>
          {!items.length && <div className="paper-card p-8 text-center text-stone-600">No quests found. Try another search or clear a filter.</div>}
        </section>

        {data.unlocked && <aside ref={detailsRef} className="hands-on-detail xl:sticky xl:top-6 min-w-0 scroll-mt-20" aria-label="Quest printable guide">
          {opening && <div className="paper-card p-8 text-stone-600" role="status">Unrolling the quest scroll…</div>}
          {!opening && !detail && <div className="paper-card p-7 text-center">
            <div className="text-5xl mb-3" aria-hidden="true">📜</div>
            <h2 className="font-display text-xl font-bold" style={{color:"#1F3B2D"}}>Choose an adventure</h2>
            <p className="text-sm text-stone-600 mt-2">Open any quest to see a full set of instructions, tick off materials, print an A4 guide and record the learning afterwards.</p>
          </div>}
          {detail && !opening && <>
            <div className="flex flex-wrap items-center gap-2 mb-3 justify-end">
              <button type="button" onClick={printQuest} data-testid="hands-on-print" className="rounded-full px-4 py-2 text-sm font-bold text-white flex items-center gap-2" style={{background:"#1F3B2D"}}><Printer size={16}/> Print A4 guide</button>
              <Link to={recordUrl} className="rounded-full border px-4 py-2 text-sm font-bold flex items-center gap-2" style={{borderColor:"#1F3B2D",color:"#1F3B2D"}}><CheckSquare size={16}/> Record the learning</Link>
              <button type="button" onClick={()=>{setDetail(null);setSelectedId("");}} aria-label="Close guide" className="rounded-full p-2 border border-stone-200 text-stone-600"><X size={17}/></button>
            </div>
            <article id="hands-on-print" className="paper-card bg-white p-5 sm:p-6 shadow-sm border-2 overflow-hidden" style={{borderColor:"#D9C89E"}}>
              <div className="flex items-center justify-between border-b-2 pb-3 gap-3" style={{borderColor:"#C6D5C5"}}>
                <div><div className="text-[10px] uppercase tracking-[0.25em] font-extrabold" style={{color:"#C77B5B"}}>SIDE-QUEST LEARNING</div><div className="font-display font-bold text-sm" style={{color:"#1F3B2D"}}>THE HANDS-ON QUEST VAULT</div></div>
                <div className="text-3xl" aria-hidden="true">🐉</div>
              </div>
              <div className="pt-4">
                <div className="text-xs font-bold tracking-widest uppercase" style={{color:"#A16C4D"}}>{detail.category}</div>
                <h1 className="font-display text-2xl font-extrabold leading-tight mt-1" style={{color:"#1F3B2D"}}>{detail.title}</h1>
                <p className="text-sm leading-relaxed text-stone-700 mt-2">{detail.description}</p>
                <div className="flex flex-wrap gap-2 mt-3 text-xs font-bold text-stone-600">
                  <span className="rounded-full px-2 py-1 bg-stone-100">Ages {detail.ages}</span>
                  <span className="rounded-full px-2 py-1 bg-stone-100"><Clock size={12} className="inline mr-1"/>{detail.minutes} min active time</span>
                  <span className="rounded-full px-2 py-1 bg-stone-100">{detail.mess} mess</span>
                </div>
              </div>
              <div className="print-sections space-y-3 mt-5">
                <section className="print-section rounded-xl border border-amber-200 p-3">
                  <h2 className="font-display text-sm font-bold flex items-center gap-2" style={{color:"#8B4F20"}}><ShieldAlert size={16}/> Grown-up safety check</h2>
                  <p className="mt-1 text-xs text-stone-700 leading-relaxed">{detail.safety}</p>
                </section>
                <section className="print-section print-tile rounded-xl border p-4" style={{borderColor:"#D5DACB",background:"#FBFCF8"}}>
                  <h2 className="font-display text-base font-bold flex items-center gap-2" style={{color:"#1F3B2D"}}><PackageCheck size={17}/> Gather your treasure</h2>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                    {detail.materials.map((m,i)=><label key={i} className="flex gap-2 items-start text-xs sm:text-sm text-stone-700 cursor-pointer">
                      <input type="checkbox" checked={packed.includes(i)} onChange={()=>setPacked(v=>v.includes(i)?v.filter(x=>x!==i):[...v,i])} className="mt-0.5 accent-green-900"/> <span>{m}</span>
                    </label>)}
                  </div>
                </section>
                {detail.runbook && <section className="print-section print-tile rounded-xl border p-4" style={{borderColor:"#C9D9CD",background:"#F0F7F1"}}>
                  <h2 className="font-display text-base font-bold" style={{color:"#1F3B2D"}}>🧺 Before you start: set up for success</h2>
                  <p className="mt-2 text-sm text-stone-700 leading-relaxed">{detail.runbook.prepare}</p>
                </section>}
                <section className="print-section">
                  <h2 className="font-display text-base font-bold" style={{color:"#1F3B2D"}}>🗺️ Your quest, step by step</h2>
                  <p className="mt-1 text-xs text-stone-600">Follow in order. Tick each step as you go; ask a grown-up for the jobs listed in the safety check.</p>
                  <ol className="space-y-2 mt-3">{detail.steps.map((step,i)=><li key={i} className="print-step flex items-start gap-3 text-sm text-stone-700 leading-relaxed">
                    <span className="shrink-0 rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs" style={{background:"#E5EBDF",color:"#1F3B2D"}}>{i+1}</span>
                    <label className="flex gap-2 items-start cursor-pointer flex-1"><input type="checkbox" className="mt-1 accent-green-900 print-step-checkbox" checked={completedSteps.includes(i)} onChange={()=>setCompletedSteps(v=>v.includes(i)?v.filter(x=>x!==i):[...v,i])} aria-label={`Completed step ${i+1}`} /><span>{step}</span></label>
                  </li>)}</ol>
                </section>
                {detail.runbook && <section className="print-section print-tile rounded-xl border p-4 space-y-3" style={{borderColor:"#E0CEAB",background:"#FFFAED"}}>
                  <h2 className="font-display text-base font-bold" style={{color:"#1F3B2D"}}>🔍 Check your results & fix the tricky bits</h2>
                  <div><h3 className="text-xs font-extrabold uppercase tracking-wider" style={{color:"#1F3B2D"}}>What you should notice</h3><p className="mt-1 text-sm text-stone-700 leading-relaxed">{detail.runbook.expected}</p></div>
                  <div><h3 className="text-xs font-extrabold uppercase tracking-wider" style={{color:"#1F3B2D"}}>If it doesn’t work first time</h3><p className="mt-1 text-sm text-stone-700 leading-relaxed">{detail.runbook.troubleshoot}</p></div>
                  <p className="text-xs text-stone-600 italic">Experiments are observations, not guaranteed tricks. An unexpected result is worth noting too.</p>
                </section>}
                <section className="print-section print-tile rounded-xl border p-4" style={{borderColor:"#D9C89E",background:"#FFF8EA"}}>
                  <h2 className="font-display text-base font-bold flex gap-2 items-center" style={{color:"#1F3B2D"}}><Sparkles size={16}/> Curious dragon questions</h2>
                  <ul className="mt-2 space-y-1.5 text-sm text-stone-700">{detail.wonder.map((w,i)=><li key={i}>✦ {w}</li>)}</ul>
                  <p className="text-xs font-semibold text-stone-600 mt-2">Learning in disguise: {detail.skills.join(" • ")}</p>
                </section>
                {detail.parentLearning && <section className="print-section print-tile rounded-xl border-2 p-4 space-y-3" style={{borderColor:"#A6BDA4",background:"#F4F8F1"}}>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-widest" style={{color:"#A16C4D"}}>A parent guide for purposeful play</div>
                    <h2 className="font-display text-base font-bold mt-1" style={{color:"#1F3B2D"}}>🐉 For the Grown-Ups: What They're Really Learning</h2>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider" style={{color:"#1F3B2D"}}>The learning objective</h3>
                    <p className="text-sm leading-relaxed text-stone-700 mt-1">{detail.parentLearning.objective}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider" style={{color:"#1F3B2D"}}>Why this works educationally</h3>
                    <p className="text-sm leading-relaxed text-stone-700 mt-1">{detail.parentLearning.explanation}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider" style={{color:"#1F3B2D"}}>What a parent can say or demonstrate</h3>
                    <p className="text-sm leading-relaxed text-stone-700 mt-1">{detail.parentLearning.parentPrompt}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider" style={{color:"#1F3B2D"}}>What learning you could record</h3>
                    <p className="text-sm leading-relaxed text-stone-700 mt-1">{detail.parentLearning.evidence}</p>
                  </div>
                  <p className="text-[11px] italic text-stone-600">These are suggested educational opportunities, not proof an outcome was achieved. Record what your child actually demonstrated.</p>
                </section>}
                <section className="print-section rounded-xl p-3" style={{background:"#EDF3E8"}}>
                  <h2 className="font-display text-sm font-bold" style={{color:"#1F3B2D"}}>⭐ Bonus side-quest</h2>
                  <p className="mt-1 text-xs text-stone-700">{detail.extension}</p>
                </section>
                <section className="print-notes print-only" style={{display:"none"}}>
                  <h2 className="font-display font-bold text-sm" style={{color:"#1F3B2D"}}>Our discoveries</h2>
                  <div className="border-b border-dotted border-stone-400 h-7"/>
                  <div className="border-b border-dotted border-stone-400 h-7"/>
                </section>
              </div>
              <div className="print-footer mt-5 pt-3 border-t text-center text-[10px] font-bold tracking-wide" style={{color:"#63735E",borderColor:"#D5DACB"}}>
                SIDE-QUEST LEARNING • LEARNING CAN HAPPEN ANYWHERE • sidequestlearning.app
              </div>
            </article>
            <p className="text-xs text-stone-600 mt-3">Print this guide at A4 size, or keep it open while you explore. The suggested learning skills are not an automatic curriculum outcome claim; record actual learning in Life Learning when finished.</p>
          </>}
        </aside>}
      </div>
    </>}
  </div>;
}
