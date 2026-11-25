// Portable native format for ChatGPT-created teaching resources. Not a PowerPoint parser.
const bounded=(v,n)=>typeof v==="string"&&v.trim().length>0&&v.trim().length<=n;
export function parseDeckExchange(raw){
 if(!raw||raw.format!=="sidequest-teaching-deck"||raw.version!==1||!raw.deck)throw Error("Choose a Side-Quest teaching deck JSON version 1.");
 const d=raw.deck;
 if(!bounded(d.title,120)||!bounded(d.subject,80)||!bounded(d.year_level,40)||!Array.isArray(d.slides)||d.slides.length<1||d.slides.length>20)throw Error("Invalid presentation title, subject, year or slide count.");
 const slides=d.slides.map((s,i)=>{
  if(!["concept","example","practice","recap"].includes(s?.kind)||!bounded(s.heading,100)||!bounded(s.body,1600)||!bounded(s.notes,2000))throw Error("Slide "+(i+1)+" needs a valid type, heading, learner content and private tutor notes.");
  return {kind:s.kind,heading:s.heading.trim(),body:s.body.trim(),notes:s.notes.trim()};
 });
 return {title:d.title.trim(),subject:d.subject.trim(),year_level:d.year_level.trim(),slides,status:"draft"};
}
export function exportDeckExchange(d){
 return {format:"sidequest-teaching-deck",version:1,deck:{title:d.title,subject:d.subject,year_level:d.year_level,slides:d.slides.map(({kind,heading,body,notes})=>({kind,heading,body,notes}))}};
}
export const exchangeExample={format:"sidequest-teaching-deck",version:1,deck:{title:"Equivalent fractions",subject:"Mathematics",year_level:"Year 5",slides:[{kind:"concept",heading:"Same amount, different names",body:"One half and two quarters cover the same amount.",notes:"Draw two equal rectangles. Split the first into halves and the second into quarters. Shade half of each; compare the shaded area."},{kind:"practice",heading:"Your turn",body:"Which is equivalent to 1/2: 2/3 or 3/6? Explain.",notes:"Answer: 3/6. Divide numerator and denominator by 3. Use fraction strips if needed."}]}};
export function saveDeckExchange(name,data){
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
