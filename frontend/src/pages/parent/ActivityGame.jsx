import React from "react";
const field="block w-full rounded-lg border border-stone-300 p-2 bg-white",btn="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold disabled:opacity-50";
export const gameTypes=["matching","sorting","sequence","number_line","fraction_model"];
export const isGameType=t=>gameTypes.includes(t);
export const emptyGame=type=>type==="number_line"?{type,min:0,max:10,intervals:10}:type==="fraction_model"?{type,parts:4}:({type,items:["",""],targets:type==="sequence"?[]:["",""]});
const isMath=t=>t==="number_line"||t==="fraction_model";
const validMath=g=>g.type==="number_line"?Number.isInteger(g.min)&&Number.isInteger(g.max)&&g.min>=-10000&&g.max<=10000&&g.max>g.min&&Number.isInteger(g.intervals)&&g.intervals>=2&&g.intervals<=20&&(g.max-g.min)%g.intervals===0:Number.isInteger(g.parts)&&g.parts>=2&&g.parts<=12;
export function parseGameAnswer(raw,n){
 try{const v=typeof raw==="string"?JSON.parse(raw):raw;return Array.isArray(v)&&v.length===n?v.map(x=>Number.isInteger(x)?x:-1):Array(n).fill(-1);}catch{return Array(n).fill(-1);}
}
export function completeGameAnswer(game,raw){
 if(game&&isMath(game.type)){if(!validMath(game))return false;const [n]=parseGameAnswer(raw,1);return n>=0&&n<=(game.type==="number_line"?game.intervals:game.parts);}
 if(!game?.items?.length)return false;
 const a=parseGameAnswer(raw,game.items.length),max=game.type==="sequence"?game.items.length:game.targets.length;
 return a.every(v=>v>=0&&v<max)&&(game.type==="sorting"||new Set(a).size===a.length);
}
export function validGame(game,answer){
 if(!game||!isGameType(game.type))return false;
 if(isMath(game.type))return completeGameAnswer(game,answer);
 const valid=a=>Array.isArray(a)&&a.length>=2&&a.length<=8&&a.every(v=>typeof v==="string"&&v.trim()&&v.trim().length<=120)&&new Set(a.map(v=>v.trim())).size===a.length;
 return valid(game.items)&&(game.type==="sequence"||valid(game.targets))&&(game.type!=="matching"||game.items.length===game.targets.length)&&completeGameAnswer(game,answer);
}
export function GameAnswer({game,value,onChange,disabled=false}){
 if(isMath(game.type))return <MathAnswer game={game} value={value} onChange={onChange} disabled={disabled}/>;
 const a=parseGameAnswer(value,game.items.length),targets=game.type==="sequence"?game.items.map((_,i)=>"Position "+(i+1)):game.targets;
 return <fieldset disabled={disabled} className="space-y-2"><legend className="font-semibold text-sm">{game.type==="sequence"?"Place each item in the correct order":game.type==="matching"?"Match each item to its partner":"Choose a category for each item"}</legend>
 {game.items.map((item,i)=><label key={i} className="block rounded-lg border p-3 space-y-2"><span className="block font-medium text-sm break-words">{item||"Item "+(i+1)}</span><select className={field} value={a[i]} onChange={e=>onChange(JSON.stringify(a.map((v,j)=>j===i?Number(e.target.value):v)))}><option value={-1}>Choose {game.type==="sequence"?"a position":game.type==="matching"?"a match":"a category"}</option>{targets.map((v,j)=><option key={j} value={j} disabled={game.type!=="sorting"&&a.some((x,k)=>k!==i&&x===j)}>{v||"Option "+(j+1)}</option>)}</select></label>)}</fieldset>;
}
export function GameEditor({type,game,answer,onChange}){
 const g=game?.type===type?game:emptyGame(type);
 if(isMath(type))return <MathEditor game={g} answer={answer} onChange={onChange}/>;
 function change(key,index,value){onChange({...g,[key]:g[key].map((v,i)=>i===index?value:v)},answer);}
 function resize(key,delta){const next=delta>0?[...g[key],""]:g[key].slice(0,-1);let v={...g,[key]:next};if(type==="matching"){const other=key==="items"?"targets":"items";v={...v,[other]:delta>0?[...g[other],""]:g[other].slice(0,-1)};}onChange(v,"");}
 return <div className="space-y-3"><p className="text-xs">Enter the items in a mixed order. Then set the correct solution privately. Learners can select their answers using touch, mouse or keyboard.</p>
 {(type==="sequence"?["items"]:["items","targets"]).map(key=><fieldset key={key} className="space-y-2"><legend className="font-semibold text-sm">{key==="items"?"Items":type==="matching"?"Matching partners":"Categories"}</legend>{g[key].map((v,i)=><label className="block text-sm" key={i}>{key==="items"?"Item":"Option"} {i+1}<input className={field} value={v} maxLength={120} onChange={e=>change(key,i,e.target.value)}/></label>)}{(type!=="matching"||key==="items")&&<div className="flex gap-2"><button type="button" className={btn} disabled={g[key].length>=8} onClick={()=>resize(key,1)}>Add {key==="items"?"item":"category"}</button><button type="button" className={btn} disabled={g[key].length<=2} onClick={()=>resize(key,-1)}>Remove last</button></div>}</fieldset>)}
 <h4 className="font-semibold">Correct solution (tutor only)</h4><GameAnswer game={g} value={answer} onChange={v=>onChange(g,v)}/></div>;
}
export function GameResult({game,value}){
 if(isMath(game.type))return <MathAnswer game={game} value={value} disabled onChange={()=>{}}/>;
 const a=parseGameAnswer(value,game.items.length);
 if(!completeGameAnswer(game,value))return <span>Not completed</span>;
 const rows=game.items.map((v,i)=>({item:v,target:a[i]}));
 if(game.type==="sequence")rows.sort((x,y)=>x.target-y.target);
 return <ol className="space-y-1 text-sm">{rows.map((r,i)=><li className="break-words" key={i}>{game.type==="sequence"?(i+1)+". "+r.item:r.item+" → "+game.targets[r.target]}</li>)}</ol>;
}

function MathAnswer({game,value,onChange,disabled=false}){
 if(!validMath(game))return <p className="text-sm">Choose valid model settings first.</p>;
 const [n]=parseGameAnswer(value,1),isLine=game.type==="number_line",max=isLine?game.intervals:game.parts;
 const label=i=>isLine?String(game.min+i*(game.max-game.min)/game.intervals):i+" / "+game.parts;
 const choose=i=>onChange(JSON.stringify([i]));
 return <fieldset disabled={disabled} className="space-y-3"><legend className="font-semibold text-sm">{isLine?"Select a point on the number line":"Choose how many equal parts to shade"}</legend>
 {isLine?<div className="overflow-x-auto pb-2"><div className="relative flex items-start justify-between min-w-max gap-1 pt-3"><div aria-hidden="true" className="absolute top-7 left-5 right-5 h-0.5 bg-stone-500"/>{Array.from({length:max+1},(_,i)=><button key={i} type="button" aria-label={"Select "+label(i)} aria-pressed={n===i} className="relative flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] text-xs" onClick={()=>choose(i)}><span aria-hidden="true" className={"rounded-full border-2 w-5 h-5 bg-white "+(n===i?"border-emerald-950 ring-2 ring-emerald-700 bg-emerald-300":"border-stone-500")}/><span className={n===i?"font-bold underline":""}>{label(i)}</span></button>)}</div></div>:<div className="flex flex-wrap gap-1" aria-label="Fraction bar">{Array.from({length:max},(_,i)=><button key={i} type="button" aria-label={"Shade "+(i+1)+" of "+max+" parts"} aria-pressed={i<n} onClick={()=>choose(i+1)} className={"min-w-[32px] flex-1 h-12 rounded border "+(i<n?"bg-emerald-800 border-emerald-950":"bg-white border-stone-500")}>{i<n?<span className="text-white">✓</span>:null}</button>)}</div>}
 <label className="block text-sm">Selected {isLine?"number":"fraction"}<select className={field} value={n} onChange={e=>choose(Number(e.target.value))}><option value={-1}>Choose an answer</option>{Array.from({length:max+1},(_,i)=><option key={i} value={i}>{label(i)}</option>)}</select></label>
 {!disabled&&<button className={btn} type="button" onClick={()=>choose(-1)}>Clear selection</button>}
 </fieldset>;
}
function MathEditor({game,answer,onChange}){
 const fields=game.type==="number_line"?[["min","First number",-10000,10000],["max","Last number",-10000,10000],["intervals","Equal intervals",2,20]]:[["parts","Equal parts",2,12]];
 return <div className="space-y-3">{fields.map(([key,label,min,max])=><label key={key} className="block text-sm">{label}<input type="number" className={field} min={min} max={max} step={1} value={game[key]??""} onChange={e=>onChange({...game,[key]:e.target.value===""?null:Number(e.target.value)},"")}/></label>)}<p className="text-xs">{game.type==="number_line"?"Use integer endpoints and equal whole-number intervals.":"Choose 2–12 equal parts."} Set the answer privately.</p><h4 className="font-semibold">Correct solution (tutor only)</h4><MathAnswer game={game} value={answer} onChange={a=>onChange(game,a)}/></div>;
}
