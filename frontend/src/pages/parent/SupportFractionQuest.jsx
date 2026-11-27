import React from "react";
const themes={
 pizza:{title:"The pizza kitchen",unit:"pizza",action:"Serve the same amount",empty:"#fff0c7",filled:"#e07838",ink:"#713f12",symbol:"🍕",prompt:"Tap slices to serve the same share on a second pizza."},
 garden:{title:"The garden guild",unit:"garden",action:"Plant an equal share",empty:"#e7d8b9",filled:"#65a30d",ink:"#365314",symbol:"🌱",prompt:"Choose garden plots to plant the same share of an equally sized garden."},
 tiles:{title:"The mosaic workshop",unit:"mosaic",action:"Match the pattern",empty:"#e2e8f0",filled:"#0e7490",ink:"#164e63",symbol:"🧩",prompt:"Select tiles to colour the same share of an equally sized mosaic."}
};
const point=(a,r)=>[100+r*Math.cos(a),100+r*Math.sin(a)];
function Piece({i,total,colour,ink,chosen,click,disabled,pizza}){
 const a=-Math.PI/2+i*2*Math.PI/total,b=a+2*Math.PI/total;
 const [x,y]=point(a,84),[x2,y2]=point(b,84),[cx,cy]=point((a+b)/2,51);
 const d="M100 100 L"+x+" "+y+" A84 84 0 "+(b-a>Math.PI?1:0)+" 1 "+x2+" "+y2+" Z";
 return <g><path d={d} fill={colour} stroke={ink} strokeWidth="2" strokeLinejoin="round"/>{chosen&&pizza&&<circle cx={cx} cy={cy} r="6" fill="#9a3412" stroke="#fde68a" strokeWidth="1"/>}{chosen&&!pizza&&<text x={cx} y={cy+4} textAnchor="middle" fontSize="15" fontWeight="bold" fill="white">✓</text>}</g>;
}
function Whole({total,selected,theme,context,label}){
 const pizza=context==="pizza";
 return <div className="min-w-0 text-center space-y-1"><p className="text-xs font-bold uppercase tracking-wide">{label}</p>{pizza?<svg viewBox="0 0 200 200" className="mx-auto w-full max-w-[210px]" role="img" aria-label={selected.length+" out of "+total+" pizza slices selected"}><circle cx="100" cy="100" r="91" fill="#d9a35b" stroke="#78350f" strokeWidth="2"/>{Array.from({length:total},(_,i)=><Piece key={i} i={i} total={total} colour={selected.includes(i)?theme.filled:theme.empty} ink={theme.ink} chosen={selected.includes(i)} pizza/>)}</svg>:<svg viewBox="0 0 200 200" className="mx-auto w-full max-w-[210px]" role="img" aria-label={selected.length+" of "+total+" equal plots selected"}><rect x="12" y="12" width="176" height="176" rx="6" fill={theme.empty} stroke={theme.ink} strokeWidth="2"/>{Array.from({length:total},(_,i)=>{const w=176/total;return <g key={i}><rect x={12+i*w} y="12" width={w} height="176" fill={selected.includes(i)?theme.filled:theme.empty} stroke={theme.ink}/>{selected.includes(i)&&w>=16&&<text x={12+(i+.5)*w} y="104" textAnchor="middle" fontSize="12" fill="white">✓</text>}</g>})}</svg>}<p className="text-3xl font-extrabold tabular-nums">{selected.length}/{total}</p></div>;
}
export default function SupportFractionQuest({visual,selected,act,canAnswer,disabled,live,owner}){
 const theme=themes[visual.context]||themes.tiles;
 const original=Array.from({length:visual.shaded},(_,i)=>i);
 return <section className="rounded-2xl overflow-hidden border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white text-stone-900">
 <header className="bg-emerald-950 text-white px-4 py-3 flex items-center gap-3"><span aria-hidden="true" className="text-3xl">{theme.symbol}</span><div><p className="text-xs tracking-widest uppercase text-emerald-200">Side-Quest · Fraction challenge</p><h5 className="text-xl font-bold">{theme.title}</h5></div></header>
 <div className="p-3 sm:p-5 space-y-3"><p className="font-semibold text-lg">{theme.action}</p><p className="text-sm">{theme.prompt} Both wholes are the same size.</p>
 <div className="grid grid-cols-2 gap-3"><Whole total={visual.total} selected={original} theme={theme} context={visual.context} label="Your reference"/><Whole total={visual.target_total} selected={selected} theme={theme} context={visual.context} label="Your creation"/></div>
 <div className="rounded-xl bg-white border p-3"><p className="text-sm font-semibold">{live&&owner?"Learner's selected pieces":"Choose your pieces"}</p><div className="grid gap-2 mt-2" style={{gridTemplateColumns:"repeat("+Math.min(visual.target_total,8)+",minmax(0,1fr))"}}>{Array.from({length:visual.target_total},(_,i)=><button type="button" key={i} aria-label={"Piece "+(i+1)} aria-pressed={selected.includes(i)} disabled={disabled||!canAnswer} onClick={()=>act("toggle",i)} className={"min-h-11 rounded-lg border-2 font-bold text-sm "+(selected.includes(i)?"bg-emerald-700 text-white border-emerald-900":"bg-amber-50 border-amber-300")}>{i+1}{selected.includes(i)?" ✓":""}</button>)}</div></div>
 <div className="bg-emerald-50 rounded-lg p-3 text-sm"><strong>Explain your thinking</strong><p>What changed about the pieces? What stayed the same about the amount? Compare the two models with your tutor.</p></div></div>
 </section>;
}
