import React,{useEffect,useState} from "react";
import {Link,useNavigate,useParams} from "react-router-dom";
import {API} from "../lib/api";

// Personal information remains only in this browser tab until the family completes its purchase.
// Nothing is copied into the shopping cart, Square line items or persistent localStorage.
export const plannerDraftKey=id=>"sq-planner-draft:"+id;
const years=["K","F","Prep",...Array.from({length:12},(_,i)=>String(i+1))];
const fresh=()=>({learner_name:"",year_level:"3",period_start:"",period_end:"",goals:"",strengths:"",teaching:"",schedule:"",resources:"",records:"",review:"",lesson_plans:"",reading_log:"",evidence_log:"",outcome_tracking:"",assessment_notes:"",areas:{}});
const fields=[["goals","Learning goals"],["strengths","Interests, strengths and learning needs"],["teaching","Teaching approach"],["schedule","Learning schedule"],["resources","Resources"],["records","Evidence approach"],["review","Review and adjustments"],["lesson_plans","Lessons"],["reading_log","Reading log"],["evidence_log","Evidence log"],["outcome_tracking","Outcomes"],["assessment_notes","Assessment notes"]];
const css="block w-full rounded-lg border border-stone-300 bg-white p-2 text-sm";
export default function ConfigurePremium(){
 const {productId}=useParams(),navigate=useNavigate();
 const [product,setProduct]=useState(null),[error,setError]=useState(""),[children,setChildren]=useState([fresh()]),[active,setActive]=useState(0),[sample,setSample]=useState(false),[reviewed,setReviewed]=useState(false);
 useEffect(()=>{let live=true;fetch(API+"/shop",{cache:"no-store"}).then(async r=>{if(!r.ok)throw Error("Shop is unavailable");return r.json()}).then(data=>{const p=(data.products||[]).find(x=>x.id===productId&&x.can_buy&&(x.tags||[]).some(t=>t==="premium-planner-personalised"||t==="premium-planner-printed"));if(!p)throw Error("This planner is not currently available for purchase.");if(live)setProduct(p)}).catch(e=>{if(live)setError(e.message)});return()=>{live=false}},[productId]);
 useEffect(()=>{try{const saved=JSON.parse(sessionStorage.getItem(plannerDraftKey(productId))||"null");if(saved&&Date.now()-saved.updated<3600000&&Array.isArray(saved.children)&&saved.children.length>=1&&saved.children.length<=5)setChildren(saved.children)}catch{}},[productId]);
 const update=(key,value)=>{setReviewed(false);setSample("");setChildren(old=>old.map((ch,i)=>i===active?{...ch,[key]:value.slice(0,4500)}:ch))};
 const updateArea=(name,key,value)=>{setReviewed(false);setSample("");setChildren(old=>old.map((ch,i)=>i===active?{...ch,areas:{...ch.areas,[name]:{...(ch.areas[name]||{}),[key]:value.slice(0,4500)}}}:ch))};
 const count=n=>{setReviewed(false);setSample("");setChildren(old=>Array.from({length:n},(_,i)=>old[i]||fresh()));setActive(i=>Math.min(i,n-1))};
 const state=(product?.tags||[]).find(x=>["nsw","vic","qld","wa","sa","tas","act","nt"].includes(x));
 const child=children[active];
 // Review stays on-device; only a paid order may generate the finished PDF.
 const preview=()=>{setError("");if(children.some(ch=>!ch.learner_name.trim()||!ch.period_start||!ch.period_end)){setError("Enter each child's name and learning period before reviewing.");return;}setSample(true);setReviewed(false);};
  const continueCheckout=()=>{if(!reviewed||!sample)return;try{
   sessionStorage.setItem(plannerDraftKey(productId),JSON.stringify({updated:Date.now(),children}));
   const key="sq-shop-cart-v2",cart=JSON.parse(localStorage.getItem(key)||'{"books":[],"items":[]}');
   if(!Array.isArray(cart.books)||!Array.isArray(cart.items))throw Error("Could not read cart");
   const item={product_id:productId,qty:1,child_count:children.length,personalisation:{},title:product.title,unit_cents:product.price_cents,physical:product.fulfilment!=="digital",postage_cents:0};
   cart.items=cart.items.filter(i=>i.product_id!==productId).concat([item]).slice(0,30);
   localStorage.setItem(key,JSON.stringify(cart));navigate("/shop");
 }catch{setError("Could not keep this draft in your browser. Please check that browser storage is enabled.")}};
 return <main className="min-h-screen bg-[#F5EFE0] p-4 sm:p-8"><div className="mx-auto max-w-4xl space-y-4">
  <Link to="/shop" className="underline text-sm">← Back to shop</Link><header className="rounded-xl bg-[#1F3B2D] p-5 text-white"><h1 className="text-2xl font-bold">Personalise your family planner</h1><p className="text-sm mt-2">Complete your planner before checkout. Your answers stay in this browser tab, not in Square's payment system.</p></header>
  {error&&<p role="alert" className="text-red-800 bg-white p-3 rounded-lg">{error}</p>}
  {!product&&!error&&<p>Loading planner…</p>}
  {product&&<section className="space-y-4 rounded-xl bg-white p-5">
   <h2 className="font-bold">{product.title}</h2>
   <p className="text-sm">State: {state?.toUpperCase()}. This is an independent planning resource, not a government form or guarantee of registration.</p>
   <label className="block text-sm font-semibold">Children in this family
     <select className={css} value={children.length} onChange={e=>count(Number(e.target.value))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select>
   </label>
   <div className="flex flex-wrap gap-2">{children.map((ch,i)=><button type="button" key={i} onClick={()=>setActive(i)} className={"rounded-lg border px-3 py-2 text-sm "+(i===active?"bg-[#1F3B2D] text-white":"bg-white")}>{ch.learner_name||"Child "+(i+1)}</button>)}</div>
   <div className="grid sm:grid-cols-2 gap-3">
    <label className="text-sm font-semibold">Learner name<input className={css} value={child.learner_name} onChange={e=>update("learner_name",e.target.value)}/></label>
    <label className="text-sm font-semibold">Year level<select className={css} value={child.year_level} onChange={e=>update("year_level",e.target.value)}>{years.map(y=><option key={y}>{y}</option>)}</select></label>
    <label className="text-sm font-semibold">Learning period starts<input className={css} type="date" value={child.period_start} onChange={e=>update("period_start",e.target.value)}/></label>
    <label className="text-sm font-semibold">Learning period ends<input className={css} type="date" value={child.period_end} onChange={e=>update("period_end",e.target.value)}/></label>
   </div>
   {fields.map(([key,label])=><label key={key} className="block text-sm font-semibold">{label}<textarea className={css} rows={2} value={child[key]||""} onChange={e=>update(key,e.target.value)}/></label>)}
   <p className="text-sm font-semibold">Subject-specific learning areas</p>
   {(product.areas||[]).map(name=><div key={name} className="border rounded-lg p-3 space-y-2"><strong>{name}</strong>{[["focus","Goals and outcomes"],["activities","Planned activities"],["evidence","Evidence"]].map(([key,label])=><label key={key} className="block text-sm">{label}<textarea className={css} rows={2} value={child.areas?.[name]?.[key]||""} onChange={e=>updateArea(name,key,e.target.value)}/></label>)}</div>)}
   <p className="text-sm text-stone-600">Complete each child's tab. Review your entered details before checkout. The full PDF preview is available only after verified payment.</p>
   <button type="button" onClick={preview} className="rounded-lg bg-[#4A5D3A] text-white px-4 py-3 font-semibold disabled:opacity-50">Review my planner details</button>
   {sample&&<div className="space-y-3"><div className="rounded-lg border bg-[#F9F8F0] p-4 space-y-3"><h3 className="font-bold">Your order proof (not the final PDF)</h3>{children.map((ch,i)=><div key={i} className="border-t pt-2 text-sm"><strong>{ch.learner_name} · Year {ch.year_level}</strong><p>{ch.period_start} to {ch.period_end}</p><p className="whitespace-pre-wrap">Learning goals: {ch.goals||"Not entered"}</p><p>Lesson, reading and evidence sections: included in the purchased planner.</p></div>)}<p className="text-xs">After Square confirms payment, you can review the full generated PDF and approve delivery or printing.</p></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/>I have reviewed my details and understand final delivery occurs only after payment.</label>
    <button type="button" disabled={!reviewed} onClick={continueCheckout} className="rounded-lg bg-[#1F3B2D] text-white px-4 py-3 font-bold disabled:opacity-40">Add planner to cart and continue to checkout</button></div>}
   <p className="text-sm">Questions or a problem? <a className="underline font-semibold" href={"mailto:support@sidequestlearning.app?subject="+encodeURIComponent("SideQuest planner help · "+productId)}>Contact SideQuest support</a>. Include the order number if you've already paid, but never send children's private information or card details by email.</p><p className="text-xs text-stone-600">This tab holds your draft for up to one hour. If you return from Square in another browser or device, you can enter the details again after purchase.</p>
  </section>}
 </div></main>;
}
