import React,{useState,useEffect} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import {api,apiErrorMessage} from "../../lib/api";
import SupportQuotes from "./SupportQuotes";
import SupportIntakeFields from "./SupportIntakeFields";
import {BookOpen,Compass,MessageSquare,ShieldCheck} from "lucide-react";

const subjects=["English","Mathematics","Science","Humanities and social sciences","History","Geography","Technology","Creative arts","Health and physical education","Languages","General learning support","Other"];
const years=["Foundation",...Array.from({length:12},(_,i)=>"Year "+(i+1)),"Mixed year levels / parent support"];
const services=["Live online support","Worked explanation","Personalised activities","Catch-up or extension","Homework or project guidance","Feedback on completed work","Parent consultation","Not sure yet"];
const statusNames={new:"Received",reviewing:"Under review",in_progress:"In progress",resolved:"Completed",closed:"Closed"};
const field="mt-1 w-full rounded-xl border border-stone-300 bg-white p-3 text-sm font-normal";
const initial={subject:"",year:"",service:"",detail:"",consent:false};

export default function LearningSupport({publicView=false}){
 const {user}=useAuth();
 const [form,setForm]=useState(initial),[rows,setRows]=useState([]),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState(""),[loading,setLoading]=useState(false);
 const [guestAvailable,setGuestAvailable]=useState(false);
 useEffect(()=>{if(!publicView)return;let active=true;fetch("/api/support-guest/status",{cache:"no-store"}).then(r=>r.json()).then(d=>{if(active)setGuestAvailable(d.available===true);}).catch(()=>{});return()=>{active=false;};},[publicView]);
 const change=(key,value)=>setForm(f=>({...f,[key]:value}));
 async function load(){setLoading(true);try{const {data}=await api.get("/feedback",{params:{kind:"learning-support"}});setRows(data.reports||[]);}catch(e){setError(apiErrorMessage(e,"Could not load requests"));}finally{setLoading(false);}}
 useEffect(()=>{if(!publicView&&user?.role==="parent")load();},[publicView,user?.id]);
 async function submit(e){e.preventDefault();if(busy||!form.consent||!subjects.includes(form.subject)||!years.includes(form.year)||!services.includes(form.service)||form.detail.trim().length<10)return;
 setBusy(true);setError("");setNotice("");
 try{await api.post("/feedback",{kind:"learning-support",...form});setForm(initial);setNotice("Your request has been received. I will review the topic and discuss suitable support, availability and pricing before you commit.");await load();}
 catch(e){setError(apiErrorMessage(e,"Could not submit request"));}finally{setBusy(false);}}
 return <main className={publicView?"min-h-screen bg-[#F5EFE0] p-4 sm:p-10":"p-4 sm:p-8 lg:p-10"}>
 <div className="max-w-4xl mx-auto space-y-6">
 {publicView&&<Link to="/" className="font-bold text-emerald-900 underline">← Side-Quest Learning</Link>}
 <header className="rounded-2xl p-6 sm:p-10 bg-[#1F3B2D] text-[#F5EFE0]"><span className="text-xs uppercase tracking-widest">Side-Quest Learning · A little help along the way</span><h1 className="font-display text-3xl sm:text-5xl font-bold mt-3">Learning support</h1><p className="mt-4 max-w-2xl leading-relaxed">Personalised educational support for homeschoolers and school students, across learning areas. Tell me what is proving tricky and I can review how best to help.</p></header>
 <div className="grid sm:grid-cols-3 gap-3">{[[BookOpen,"Understand a concept","Worked explanations, guided practice and live support."],[Compass,"Find a way forward","Catch-up, extension, projects and personalised resources."],[MessageSquare,"Support for parents","Practical guidance for supporting learning at home."]].map(([Icon,title,desc])=><section key={title} className="paper-card p-5"><Icon className="text-emerald-900 mb-3"/><h2 className="font-display font-bold text-lg">{title}</h2><p className="text-sm text-stone-600 mt-2">{desc}</p></section>)}</div>
 <section className="paper-card p-5 space-y-3"><h2 className="font-display text-xl font-bold text-emerald-950">How it works</h2><p className="text-sm text-stone-700">Submit a request. I review the subject, year level and support needed, then respond with an appropriate option, quote and availability, or let you know if the topic is outside my expertise. Enquiries are free and do not create a booking or charge. Support is delivered personally by the founder, not a qualified teacher or a team of tutors. No paid Side-Quest membership is required to use Learning Support. Any agreed support is priced separately, and your requests remain available after the optional platform preview ends.</p><p className="text-sm text-stone-700"><ShieldCheck size={16} className="inline mr-1"/> All arrangements are made through a parent or guardian. Please do not send children's identifying information, medical details, school documents, passwords or payment details.</p></section>
 {publicView?<section className="paper-card p-6 space-y-3"><h2 className="font-display text-xl font-bold">Request support</h2>{user?.role==="parent"?<Link className="font-bold text-emerald-900 underline" to="/parent/learning-support">Open your learning support requests</Link>:<><p className="text-sm">Use the standalone Learning Support portal with your email address. No homeschool account, child profile, trial or subscription is required.</p><div className="flex gap-4 flex-wrap">{guestAvailable?<Link to="/learning-support/portal" className="rounded-full px-5 py-3 bg-emerald-950 text-white font-bold">Open Learning Support portal</Link>:<p className="text-sm text-stone-600">Standalone access is not open yet.</p>}<Link to="/login?service=learning-support" className="rounded-full px-5 py-3 border border-emerald-900 font-bold">Existing Parent Hub sign in</Link></div></>}</section>:<>
 <form className="paper-card p-5 sm:p-7 space-y-4" onSubmit={submit}>
 <h2 className="font-display text-2xl font-bold text-emerald-950">Request learning support</h2>
 {[[ "year","Year level",years],["subject","Learning area",subjects],["service","Preferred support",services]].map(([key,label,options])=><label key={key} className="block text-sm font-bold">{label}<select required value={form[key]} onChange={e=>change(key,e.target.value)} className={field}><option value="">Choose an option</option>{options.map(o=><option key={o}>{o}</option>)}</select></label>)}
 <SupportIntakeFields form={form} change={change}/>
 <label className="flex items-start gap-2 text-sm"><input type="checkbox" required checked={form.consent} onChange={e=>change("consent",e.target.checked)}/> I am an adult parent or guardian and understand this is an enquiry, not a confirmed booking or purchase.</label>
 {error&&<p role="alert" className="text-rose-900 text-sm">{error}</p>}{notice&&<p role="status" className="text-emerald-900 text-sm">{notice}</p>}
 <button type="submit" disabled={busy||!form.consent} className="rounded-full px-6 py-3 bg-emerald-950 text-white font-bold disabled:opacity-50">{busy?"Sending…":"Send request"}</button>
 </form>
 <section className="paper-card p-5 space-y-4"><div className="flex justify-between gap-3"><h2 className="font-display text-xl font-bold">Your requests</h2><button onClick={load} type="button" disabled={loading} className="underline text-sm">Refresh</button></div>{loading&&<p>Loading…</p>}{!loading&&!rows.length&&<p className="text-sm text-stone-600">No requests yet.</p>}{rows.map(r=><article key={r.id} className="rounded-xl border border-stone-200 bg-white p-4 space-y-2"><div className="flex flex-wrap justify-between gap-2"><strong>{r.subject}</strong><span className="text-xs text-stone-600">{statusNames[r.status]||r.status}</span></div><p className="text-sm whitespace-pre-wrap break-words">{r.message}</p>{(r.replies||[]).map(m=><div key={m.id} className="rounded-xl bg-emerald-50 p-3"><strong className="text-xs">Side-Quest response</strong><p className="text-sm whitespace-pre-wrap break-words">{m.body}</p></div>)}<SupportQuotes key={r.id} id={r.id} initialQuotes={r.quotes} closed={["closed","resolved"].includes(r.status)}/><Link to={"/parent/feedback?thread="+encodeURIComponent(r.id)} className="text-sm underline text-emerald-900">Open private message thread</Link></article>)}</section></>}
 </div></main>;
}
