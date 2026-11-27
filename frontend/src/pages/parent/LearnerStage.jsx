import React from "react";
const themes={
 concept:{label:"Discover",prompt:"Explore a new idea",icon:"✦",accent:"bg-teal-100 text-teal-950"},
 example:{label:"Watch and wonder",prompt:"See how it works",icon:"◈",accent:"bg-sky-100 text-sky-950"},
 practice:{label:"Your turn",prompt:"Try, explore and explain",icon:"◆",accent:"bg-amber-100 text-amber-950"},
 recap:{label:"Reflect",prompt:"Show what you discovered",icon:"★",accent:"bg-violet-100 text-violet-950"},
 camp:{label:"Story adventure",prompt:"Imagine, create, discover",icon:"✧",accent:"bg-amber-100 text-amber-950"}
};
export default function LearnerStage({title,heading,body,kind,number,total,children,art,preview=false}){
 const theme=themes[kind]||themes.concept;
 const progress=Number.isInteger(number)&&Number.isInteger(total)&&number>0&&number<=total&&total<=30;
 return <article className="overflow-hidden rounded-2xl border border-emerald-950/20 bg-white shadow-sm text-stone-900" aria-label="Presented slide">
  <header className="bg-emerald-950 text-white px-5 py-4 sm:px-8 sm:py-6">
   <div className="flex flex-wrap gap-2 justify-between items-center"><span className="text-xs font-bold tracking-[0.16em] uppercase text-emerald-100">Side-Quest Learning</span>{progress&&<span className="text-sm font-semibold tabular-nums">Step {number} of {total}</span>}</div>
   {progress&&<div className="flex gap-1 mt-3" role="progressbar" aria-label="Presentation progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={number}>{Array.from({length:total},(_,i)=><span key={i} className={"h-1.5 rounded-full flex-1 "+(i<number?"bg-amber-300":"bg-white/20")}/>)}</div>}
   <p className="mt-3 text-sm text-emerald-100 break-words">{title}</p>
  </header>
  <div className="p-5 sm:p-8 space-y-4">
   {preview&&<p className="text-xs text-stone-500 font-semibold">Learner-facing preview · not shared</p>}
   <span className={"inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold "+theme.accent}><span aria-hidden="true">{theme.icon}</span>{theme.label}</span>
   <h4 className="font-display text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-emerald-950 break-words">{heading}</h4>
   {art}
   <div className="text-base sm:text-xl leading-relaxed whitespace-pre-wrap break-words">{body}</div>
   {children&&<div className="border-t border-stone-200 pt-4"><p className="text-xs font-bold uppercase tracking-wide text-emerald-800 mb-3">{theme.prompt}</p>{children}</div>}
  </div>
 </article>;
}
