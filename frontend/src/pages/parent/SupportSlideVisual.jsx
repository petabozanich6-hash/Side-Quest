import React,{useState} from "react";
function FractionBuild({total}){
 const [selected,setSelected]=useState([]);
 return <div className="space-y-3"><div className="flex rounded-lg overflow-hidden border-2 border-emerald-950" aria-label="Build a fraction">{Array.from({length:total},(_,i)=><button key={i} type="button" className={"flex-1 min-w-0 h-14 border-r last:border-r-0 border-emerald-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] "+(selected.includes(i)?"bg-emerald-600 text-white":"bg-white text-emerald-950")} aria-pressed={selected.includes(i)} aria-label={"Part "+(i+1)} onClick={()=>setSelected(s=>s.includes(i)?s.filter(x=>x!==i):[...s,i])}>{selected.includes(i)?"✓":""}</button>)}</div><p className="text-xl font-bold text-center">{selected.length}/{total}</p><button type="button" className="underline text-sm" onClick={()=>setSelected([])}>Reset model</button><p className="text-xs">Explore on your own screen, then explain your choice aloud or in the live activity.</p></div>;
}
export default function SupportSlideVisual({visual}){
 if(!visual)return null;
 if(visual.type==="fraction-build")return <div className="rounded-xl bg-white text-emerald-950 p-4"><FractionBuild key={visual.total} total={visual.total}/></div>;
 if(visual.type==="fraction-bars")return <div className="space-y-4 rounded-xl bg-white text-emerald-950 p-4">{visual.rows.map((r,i)=><div className="grid grid-cols-[1fr_auto] items-center gap-3" key={i}><div role="img" aria-label={r.shaded+" of "+r.total+" equal parts shaded"} className="flex h-12 border-2 border-emerald-950 overflow-hidden rounded-md">{Array.from({length:r.total},(_,j)=><div key={j} className={"flex-1 border-r last:border-r-0 border-emerald-950 "+(j<r.shaded?"bg-emerald-600":"bg-white")}/>)}</div><span className="font-bold text-xl tabular-nums">{r.shaded}/{r.total}</span></div>)}</div>;
 if(["steps","compare","sequence"].includes(visual.type))return <div className={"grid gap-2 text-emerald-950 "+(visual.type==="compare"?"sm:grid-cols-2":"")}>{visual.items.map((item,i)=><div key={i} className="rounded-lg bg-white border border-emerald-200 p-4"><p className="text-sm font-semibold text-emerald-800">{visual.type==="compare"?item.label:(i+1)+". "+item.label}</p><p className="text-lg sm:text-xl font-medium whitespace-pre-wrap break-words mt-1">{item.body}</p></div>)}</div>;
 return null;
}
