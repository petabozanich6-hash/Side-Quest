import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, CalendarDays, Camera, ChevronRight, ClipboardList, Compass, FileCheck, FolderOpen, GraduationCap, Heart, Library, Loader2, MessageSquare, Search, ShieldCheck, Sparkles, Trees, Users, X } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const PARENT_PAGES = [
  { title: "Parent dashboard", description: "Your family hub and daily overview", url: "/parent", icon: Users },
  { title: "Children", description: "Child profiles, learning stages and logins", url: "/parent/children", icon: Users },
  { title: "Homeschooling Compass", description: "Registration instructions and renewal dates", url: "/parent/homeschool-compass", icon: Compass },
  { title: "Curriculum", description: "Australian curriculum and state-specific learning", url: "/parent/curriculum", icon: GraduationCap },
  { title: "Outcome tracker", description: "Find curriculum outcome codes and evidence", url: "/parent/outcomes", icon: GraduationCap },
  { title: "My lessons", description: "Created lessons, drafted lessons and lesson library", url: "/parent/lessons", icon: BookOpen },
  { title: "AI lesson builder", description: "Make a lesson from an idea", url: "/parent/lessons/make", icon: Sparkles },
  { title: "Assignments", description: "What you have assigned your children", url: "/parent/assignments", icon: ClipboardList },
  { title: "Learning plans", description: "Teaching plans for your children", url: "/parent/learning-plans", icon: FileCheck },
  { title: "Reading log", description: "Books, reading records and comprehension", url: "/parent/reading-log", icon: BookOpen },
  { title: "Evidence Backpack", description: "Portfolio records, learning samples and evidence", url: "/parent/evidence", icon: Camera },
  { title: "Life learning", description: "Projects, excursions and everyday learning", url: "/parent/life-learning", icon: Trees },
  { title: "Calendar", description: "Schedule, dates and timetable", url: "/parent/calendar", icon: CalendarDays },
  { title: "Saved resources", description: "Learning links and approved resources", url: "/parent/resources", icon: Library },
  { title: "Word Hoard", description: "Vocabulary and spelling words", url: "/parent/word-hoard", icon: BookOpen },
  { title: "Seasonal surprises", description: "Pet room celebrations and special events", url: "/parent/side-quest", icon: Sparkles },
  { title: "Ideas & Feedback", description: "Report a problem, suggest a feature or send feedback", url: "/parent/feedback", icon: MessageSquare },
  { title: "Trust & Support", description: "Policies, privacy and account assistance", url: "/parent/trust", icon: ShieldCheck },
];
const CHILD_PAGES = [
  { title: "My home", description: "Assignments and quests to do", url: "/child", icon: Compass },
  { title: "Lesson archive", description: "Finished lessons and quests", url: "/child/archive", icon: FolderOpen },
  { title: "Portfolio", description: "My finished work", url: "/child/portfolio", icon: Camera },
  { title: "My reading", description: "Books and reading records", url: "/child/reading", icon: BookOpen },
  { title: "My calendar", description: "Upcoming learning", url: "/child/calendar", icon: CalendarDays },
  { title: "Word Hoard", description: "My spelling and vocabulary", url: "/child/word-hoard", icon: BookOpen },
  { title: "Achievements", description: "Badges and rewards", url: "/child/achievements", icon: Sparkles },
  { title: "Pet room", description: "Visit my learning companion", url: "/child/room", icon: Heart },
];
const LABELS = {
  pages: "Pages & tools", children: "Children", lessons: "Lessons", assignments: "Assignments",
  reading: "Reading log", plans: "Learning plans", life_learning: "Life learning", evidence: "Evidence",
  calendar: "Calendar", resources: "Saved resources",
};
const PARENT_TYPES = ["all","pages","children","lessons","assignments","reading","plans","life_learning","evidence","calendar","resources"];
const CHILD_TYPES = ["all","pages","assignments","reading"];

export default function SiteSearch({ mode = "parent" }) {
  const { user } = useAuth();
  const role = user?.role === "child" ? "child" : mode;
  const [params, setParams] = useSearchParams();
  const initial = (params.get("q") || "").slice(0,80);
  const [query, setQuery] = useState(initial);
  const [type, setType] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const field = useRef(null);
  const pages = role === "child" ? CHILD_PAGES : PARENT_PAGES;
  const types = role === "child" ? CHILD_TYPES : PARENT_TYPES;
  const q = query.trim().toLocaleLowerCase("en-AU");
  const filteredPages = useMemo(() => {
    if (q.length < 2 || !["all","pages"].includes(type)) return [];
    return pages.filter(p => (p.title+" "+p.description).toLocaleLowerCase("en-AU").includes(q))
      .map((p,i) => ({ id:"page-"+i,type:"pages",title:p.title,description:p.description,url:p.url,icon:p.icon }));
  }, [q,type,role]); // pages is fixed per role

  useEffect(() => {
    if (q.length < 2 || type === "pages") {
      setItems([]);setError("");setLoading(false);return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);setError("");
      try {
        const { data } = await api.get("/site-search", {
          params:{q:query.trim(),...(type!=="all"?{type}:{})}, signal:controller.signal,
        });
        if (!controller.signal.aborted) setItems(data.items || []);
      } catch(err) {
        if (controller.signal.aborted || err?.code === "ERR_CANCELED") return;
        setItems([]);setError(apiErrorMessage(err,"Search couldn't load right now."));
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, 250);
    return () => { clearTimeout(timer);controller.abort(); };
  }, [query,type,role]); 

  useEffect(() => {
    const timer=setTimeout(() => {
      const current=params.get("q") || "";
      if(query.trim() !== current) setParams(query.trim()?{q:query.trim()}:{},{replace:true});
    },350);
    return () => clearTimeout(timer);
  },[query,params,setParams]);

  const results = [...filteredPages,...items];
  const groups = types.filter(t=>t!=="all").map(t=>({type:t,label:LABELS[t],rows:results.filter(r=>r.type===t)})).filter(g=>g.rows.length);
  const clear = () => {setQuery("");setItems([]);field.current?.focus();};

  return <div className="p-4 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-6" data-testid={"site-search-"+role}>
    <header>
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald-800"><Search size={16}/> Find your way</div>
      <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2" style={{color:"#1F3B2D"}}>Search Side-Quest</h1>
      <p className="text-sm text-stone-600 mt-2 max-w-2xl">{role==="child"?
        "Find your lessons, reading and favourite places in your Side-Quest.":
        "Find a lesson, a child's profile, reading record, learning plan or the page you need — without digging through every menu."}</p>
    </header>

    <section className="paper-card p-4 sm:p-6 space-y-3" aria-label="Site search">
      <div className="relative">
        <Search size={21} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-800 pointer-events-none" aria-hidden="true"/>
        <input ref={field} autoFocus value={query} maxLength={80} onChange={e=>setQuery(e.target.value)}
          type="search" autoComplete="off" aria-label="Search your Side-Quest"
          placeholder={role==="child"?"Try a lesson title or book…":"Try Harry Potter, maths, a child's name…"}
          className="w-full rounded-2xl border-2 border-stone-300 bg-white py-4 pl-12 pr-12 text-base text-stone-900 focus:border-emerald-700 focus:outline-none"
          data-testid="site-search-input"/>
        {query&&<button type="button" onClick={clear} aria-label="Clear search" className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600"><X size={19}/></button>}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm text-stone-700 font-semibold" htmlFor="site-search-category">Search in</label>
        <select id="site-search-category" value={type} onChange={e=>setType(e.target.value)}
          className="rounded-xl border border-stone-300 py-2 px-3 text-sm bg-white text-stone-900" data-testid="site-search-category">
          {types.map(t=><option key={t} value={t}>{t==="all"?"Everything":LABELS[t]}</option>)}
        </select>
        {loading&&<span className="text-xs text-stone-500 flex items-center gap-1" role="status"><Loader2 size={14} className="animate-spin"/> Searching…</span>}
      </div>
      {role==="parent"&&<p className="text-xs text-stone-500">Only your family's records appear. Children's accounts cannot search parent information. Private login details, PINs and uploaded document contents aren't searched.</p>}
    </section>

    {error&&<p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">{error}</p>}
    {q.length < 2?<section className="paper-card p-5 sm:p-6 space-y-3" data-testid="site-search-start">
      <h2 className="font-display text-xl font-bold text-emerald-950">Where would you like to go?</h2>
      <p className="text-sm text-stone-600">Type at least two letters to search. Or jump straight into one of these places:</p>
      <div className="grid sm:grid-cols-2 gap-2">{pages.slice(0,role==="child"?8:8).map(p=><Link key={p.url} to={p.url} className="rounded-xl border border-stone-200 bg-white p-3 flex gap-2 items-center hover:border-emerald-700 text-sm font-semibold text-stone-800"><p.icon size={18} className="text-emerald-800"/>{p.title}<ChevronRight size={15} className="ml-auto text-stone-400"/></Link>)}</div>
    </section>:
      <section className="space-y-5" aria-label="Search results" data-testid="site-search-results">
        {!loading&&!error&&results.length===0&&<div className="paper-card p-8 text-center"><Search size={26} className="mx-auto text-stone-400"/><h2 className="font-display text-xl font-bold mt-3 text-stone-900">No matches found</h2><p className="text-sm text-stone-600 mt-2">Try a shorter phrase, a book title, a child's name or choose a different category.</p></div>}
        {groups.map(g=><div className="paper-card p-4 sm:p-5 space-y-2" key={g.type} data-testid={"site-search-group-"+g.type}>
          <div className="flex items-baseline gap-2 justify-between">
            <h2 className="font-display text-lg font-bold text-emerald-950">{g.label}</h2>
            <span className="text-xs text-stone-500">{g.rows.length} {g.rows.length===1?"match":"matches"}</span>
          </div>
          <div className="space-y-2">{g.rows.map(r=><Link key={r.type+"-"+r.id} to={r.url} className="block bg-white border border-stone-200 rounded-xl p-4 hover:border-emerald-700 hover:bg-emerald-50 transition group" data-testid={"site-search-item-"+r.type+"-"+r.id}>
            <div className="flex items-start gap-3">
              <span className="h-8 w-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-800 grid place-items-center">{r.icon?<r.icon size={17}/>:<Search size={16}/>}</span>
              <div className="flex-1 min-w-0"><h3 className="text-sm font-bold text-stone-900 break-words">{r.title}</h3><p className="text-xs mt-1 text-stone-600 break-words">{r.description}</p></div>
              <ChevronRight size={17} className="shrink-0 text-stone-400 group-hover:text-emerald-800"/>
            </div>
          </Link>)}</div>
        </div>)}
        {items.some(r=>r.type!=="pages")&&<p className="text-xs text-stone-500">Showing up to 12 matches from each record type. Try a more specific search for a longer list.</p>}
      </section>}
  </div>;
}
