import React from "react";
const field="block w-full rounded-lg border border-stone-300 p-2 bg-white",btn="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold disabled:opacity-50";
export const gameTypes=["matching","sorting","sequence"];
export const isGameType=t=>gameTypes.includes(t);
export const emptyGame=type=>({type,items:["",""],targets:type==="sequence"?[]:["",""]});
export function parseGameAnswer(raw,n){
 try{const v=typeof raw==="string"?JSON.parse(raw):raw;return Array.isArray(v)&&v.length===n?v.map(x=>Number.isInteger(x)?x:-1):Array(n).fill(-1);}catch{return Array(n).fill(-1);}
}
export function completeGameAnswer(game,raw){
 if(!game?.items?.length)return false;
 const a=parseGameAnswer(raw,game.items.length),max=game.type==="sequence"?game.items.length:game.targets.length;
 return a.every(v=>v>=0&&v<max)&&(game.type==="sorting"||new Set(a).size===a.length);
}
export function validGame(game,answer){
 if(!game||!isGameType(game.type))return false;
 const valid=a=>Array.isArray(a)&&a.length>=2&&a.length<=8&&a.every(v=>typeof v==="string"&&v.trim()&&v.trim().length<=120)&&new Set(a.map(v=>v.trim())).size===a.length;
 return valid(game.items)&&(game.type==="sequence"||valid(game.targets))&&(game.type!=="matching"||game.items.length===game.targets.length)&&completeGameAnswer(game,answer);
}
export function GameAnswer({game,value,onChange,disabled=false}){
 const a=parseGameAnswer(value,game.items.length),targets=game.type==="sequence"?game.items.map((_,i)=>"Position "+(i+1)):game.targets;
 return <fieldset disabled={disabled} className="space-y-2"><legend className="font-semibold text-sm">{game.type==="sequence"?"Place each item in the correct order":game.type==="matching"?"Match each item to its partner":"Choose a category for each item"}</legend>
 {game.items.map((item,i)=><label key={i} className="block rounded-lg border p-3 space-y-2"><span className="block font-medium text-sm break-words">{item||"Item "+(i+1)}</span><select className={field} value={a[i]} onChange={e=>onChange(JSON.stringify(a.map((v,j)=>j===i?Number(e.target.value):v)))}><option value={-1}>Choose {game.type==="sequence"?"a position":game.type==="matching"?"a match":"a category"}</option>{targets.map((v,j)=><option key={j} value={j} disabled={game.type!=="sorting"&&a.some((x,k)=>k!==i&&x===j)}>{v||"Option "+(j+1)}</option>)}</select></label>)}</fieldset>;
}
export function GameEditor({type,game,answer,onChange}){
 const g=game?.type===type?game:emptyGame(type);
 function change(key,index,value){onChange({...g,[key]:g[key].map((v,i)=>i===index?value:v)},answer);}
 function resize(key,delta){const next=delta>0?[...g[key],""]:g[key].slice(0,-1);let v={...g,[key]:next};if(type==="matching"){const other=key==="items"?"targets":"items";v={...v,[other]:delta>0?[...g[other],""]:g[other].slice(0,-1)};}onChange(v,"");}
 return <div className="space-y-3"><p className="text-xs">Enter the items in a mixed order. Then set the correct solution privately. Learners can select their answers using touch, mouse or keyboard.</p>
 {(type==="sequence"?["items"]:["items","targets"]).map(key=><fieldset key={key} className="space-y-2"><legend className="font-semibold text-sm">{key==="items"?"Items":type==="matching"?"Matching partners":"Categories"}</legend>{g[key].map((v,i)=><label className="block text-sm" key={i}>{key==="items"?"Item":"Option"} {i+1}<input className={field} value={v} maxLength={120} onChange={e=>change(key,i,e.target.value)}/></label>)}{(type!=="matching"||key==="items")&&<div className="flex gap-2"><button type="button" className={btn} disabled={g[key].length>=8} onClick={()=>resize(key,1)}>Add {key==="items"?"item":"category"}</button><button type="button" className={btn} disabled={g[key].length<=2} onClick={()=>resize(key,-1)}>Remove last</button></div>}</fieldset>)}
 <h4 className="font-semibold">Correct solution (tutor only)</h4><GameAnswer game={g} value={answer} onChange={v=>onChange(g,v)}/></div>;
}
export function GameResult({game,value}){
 const a=parseGameAnswer(value,game.items.length);
 if(!completeGameAnswer(game,value))return <span>Not completed</span>;
 const rows=game.items.map((v,i)=>({item:v,target:a[i]}));
 if(game.type==="sequence")rows.sort((x,y)=>x.target-y.target);
 return <ol className="space-y-1 text-sm">{rows.map((r,i)=><li className="break-words" key={i}>{game.type==="sequence"?(i+1)+". "+r.item:r.item+" → "+game.targets[r.target]}</li>)}</ol>;
}
