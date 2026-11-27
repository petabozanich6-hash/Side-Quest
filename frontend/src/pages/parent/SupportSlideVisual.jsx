import React,{useState} from "react";
import SupportExperiment from "./SupportExperiment";
import SupportFractionQuest from "./SupportFractionQuest";
import SupportInquiryQuest from "./SupportInquiryQuest";
const button="rounded-lg border border-emerald-800 px-3 py-2 text-sm font-semibold disabled:opacity-50";
function Bar({total,shaded}){
 return <div className="grid grid-cols-[1fr_auto] items-center gap-3"><svg viewBox="0 0 320 40" className="w-full" role="img" aria-label={shaded+" of "+total+" equal parts shaded"}><rect x="1" y="1" width="318" height="38" rx="3" fill="#fff"/><rect x="1" y="1" width={318*shaded/total} height="38" fill="#059669"/>{Array.from({length:total-1},(_,i)=><line key={i} x1={1+318*(i+1)/total} x2={1+318*(i+1)/total} y1="1" y2="39" stroke="#064e3b" strokeWidth="1"/>) }<rect x="1" y="1" width="318" height="38" rx="3" fill="none" stroke="#064e3b" strokeWidth="2"/></svg><span className="font-bold text-lg tabular-nums">{shaded}/{total}</span></div>;
}
export default function SupportSlideVisual({visual,interaction,send,owner=false,busy=false,live=false}){
 const [local,setLocal]=useState(()=>({reveal:1,checked:false,selected:[],placements:visual?.type==="sort-quest"?visual.items.map(()=>-1):visual?.type==="experiment"&&visual.model==="rectangle"?[3,4]:visual?.type==="experiment"&&visual.model==="coordinates"?[0,0]:[],order:visual?.type==="order"?visual.items.map((_,i)=>i):[]}));
 if(!visual)return null;
 const state=live?(interaction||{reveal:99,selected:[],order:visual.type==="order"?visual.items.map((_,i)=>i):[]}):local;
 const {reveal,selected,order}=state;
 const demo=["concept-lesson","fraction-split","fraction-bars","steps","compare","sequence"].includes(visual.type);
 const canDemo=!live||owner&&!!interaction,canAnswer=!live||!owner&&!!interaction;
 const disabled=busy||live&&!interaction;
 function act(operation,index,direction){
  if(live){if(interaction&&send)send({action:"slide-interact",visual_id:interaction.id,operation,index,direction});return;}
  setLocal(s=>{
   if(operation==="reset")return {reveal:1,checked:false,selected:[],placements:visual.type==="sort-quest"?visual.items.map(()=>-1):visual.type==="experiment"&&visual.model==="rectangle"?[3,4]:visual.type==="experiment"&&visual.model==="coordinates"?[0,0]:[],order:visual.type==="order"?visual.items.map((_,i)=>i):[]};
   if(operation==="reveal")return {...s,reveal:s.reveal+1};
   if(operation==="check")return {...s,checked:true};
   if(operation==="adjust")return {...s,placements:s.placements.map((p,i)=>i===index?direction:p)};
   if(operation==="place")return {...s,checked:false,placements:s.placements.map((p,i)=>i===index?direction:p)};
   if(operation==="toggle")return {...s,checked:false,selected:s.selected.includes(index)?s.selected.filter(v=>v!==index):[...s.selected,index]};
   if(operation==="move"){const order=[...s.order],to=index+direction;[order[index],order[to]]=[order[to],order[index]];return {...s,order};}
   return s;
  });
 }
 const max=visual.type==="concept-lesson"?4:visual.type==="fraction-split"?2:visual.type==="fraction-bars"?visual.rows.length:visual.items?.length||1;
 const controls=demo&&canDemo?<div className="flex flex-wrap gap-2">{reveal<max&&<button type="button" className={button} disabled={disabled} onClick={()=>act("reveal")}>{visual.type==="fraction-split"?"Split every part into "+visual.factor:"Reveal next step"}</button>}{reveal>1&&<button type="button" className={button} disabled={disabled} onClick={()=>act("reset")}>Restart demonstration</button>}</div>:null;
 return <div className="rounded-xl bg-white text-emerald-950 p-4 space-y-4" aria-label="Interactive teaching model">
 {visual.type==="concept-lesson"&&<section className="space-y-3"><h5 className="font-display text-2xl font-bold">{visual.term}</h5>{[["What it means",visual.definition],["An example",visual.example],["Compare: a non-example or contrasting case",visual.contrast],["Why it matters",visual.why]].slice(0,reveal).map(([label,body],i)=><div key={label} className={"rounded-xl border p-4 "+(i===0?"bg-emerald-50 border-emerald-200":"bg-white border-stone-200")}><p className="text-sm font-bold text-emerald-800">{label}</p><p className="mt-1 text-lg whitespace-pre-wrap break-words">{body}</p></div>)}</section>}
 {visual.type==="fraction-split"&&<><Bar total={visual.total*(reveal>1?visual.factor:1)} shaded={visual.shaded*(reveal>1?visual.factor:1)}/>{reveal>1?<p className="text-sm font-semibold" role="status">{visual.shaded}/{visual.total} = {visual.shaded*visual.factor}/{visual.total*visual.factor}. Same shaded length; more, smaller equal parts.</p>:<p className="text-sm">What happens if we split every piece into {visual.factor} equal parts?</p>}</>}
 {visual.type==="fraction-bars"&&visual.rows.slice(0,reveal).map((r,i)=><Bar key={i} total={r.total} shaded={r.shaded}/>)}
 {["steps","compare","sequence"].includes(visual.type)&&<div className={"grid gap-2 "+(visual.type==="compare"?"sm:grid-cols-2":"")}>{visual.items.slice(0,reveal).map((item,i)=><div key={i} className="rounded-lg border border-emerald-200 p-4"><p className="text-sm font-semibold text-emerald-800">{visual.type==="compare"?item.label:(i+1)+". "+item.label}</p><p className="text-lg font-medium whitespace-pre-wrap break-words mt-1">{item.body}</p></div>)}</div>}
 {["evidence-quest","sort-quest","data-quest"].includes(visual.type)&&<SupportInquiryQuest visual={visual} state={state} act={act} canAnswer={canAnswer} disabled={disabled} live={live} owner={owner}/>}
 {visual.type==="experiment"&&<SupportExperiment visual={visual} state={state} act={act} canAnswer={canAnswer} disabled={disabled}/>}
 {visual.type==="fraction-quest"&&<SupportFractionQuest visual={visual} selected={selected} checked={state.checked} act={act} canAnswer={canAnswer} disabled={disabled} live={live} owner={owner}/>}
 {visual.type==="fraction-build"&&<><div className="flex rounded-lg overflow-hidden border-2 border-emerald-950" aria-label="Build a fraction">{Array.from({length:visual.total},(_,i)=><button key={i} type="button" className={"flex-1 min-w-0 h-14 border-r last:border-r-0 border-emerald-950 "+(selected.includes(i)?"bg-emerald-600 text-white":"bg-white")} disabled={disabled||!canAnswer} aria-pressed={selected.includes(i)} aria-label={"Part "+(i+1)} onClick={()=>act("toggle",i)}>{selected.includes(i)?"✓":""}</button>)}</div><p className="text-xl font-bold text-center" aria-live="polite">{selected.length}/{visual.total}</p></>}
 {visual.type==="select"&&<div className="flex flex-wrap gap-2">{visual.items.map((item,i)=><button type="button" key={i} className={button+" "+(selected.includes(i)?"bg-emerald-700 text-white":"bg-white")} disabled={disabled||!canAnswer} aria-pressed={selected.includes(i)} onClick={()=>act("toggle",i)}>{item}</button>)}</div>}
 {visual.type==="order"&&<div className="space-y-2">{order.map((item,i)=><div className="flex flex-wrap items-center gap-2 border rounded-lg p-2" key={item}><span className="flex-1">{i+1}. {visual.items[item]}</span><button type="button" className={button} disabled={disabled||!canAnswer||i===0} aria-label={"Move "+visual.items[item]+" earlier"} onClick={()=>act("move",i,-1)}>↑</button><button type="button" className={button} disabled={disabled||!canAnswer||i===order.length-1} aria-label={"Move "+visual.items[item]+" later"} onClick={()=>act("move",i,1)}>↓</button></div>)}</div>}
 {controls}
 {!demo&&<><p className="text-xs" role="status">{live?owner?"Learner's shared response · updates when the classroom refreshes.":"Your selections are visible to the tutor.": "Try the model here before teaching."}</p>{(!live||interaction)&&<button type="button" className={button} disabled={disabled} onClick={()=>act("reset")}>Reset model</button>}</>}
 {demo&&live&&!owner&&interaction&&<p className="text-xs">Follow along as your tutor reveals each step.</p>}
 </div>;
}
