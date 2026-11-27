// A closed data schema for learner-facing visuals: no HTML, code, external URLs, or private answers.
const text=(v:unknown,n:number)=>typeof v==="string"&&v.trim().length>0&&v.trim().length<=n?v.trim():null;
const integer=(v:unknown,min:number,max:number):v is number=>typeof v==="number"&&Number.isInteger(v)&&v>=min&&v<=max;
export function validateSlideVisual(v:any){
 if(!v||typeof v!=="object")return null;
 if(v.type==="evidence-quest"){
  const passage_title=text(v.passage_title,100),prompt=text(v.prompt,180),context=v.context;
  if(!passage_title||!prompt||!["reading","source","investigation","language"].includes(context)||!Array.isArray(v.items)||v.items.length<3||v.items.length>10)return null;
  const items:string[]=[];
  for(const item of v.items){const t=text(item,240);if(!t)return null;items.push(t);}
  if(items.join(" ").length>1400)return null;
  return {type:"evidence-quest",context:context as "reading"|"source"|"investigation"|"language",passage_title,prompt,items} as const;
 }
 if(v.type==="sort-quest"){
  const prompt=text(v.prompt,180);
  if(!prompt||!Array.isArray(v.groups)||v.groups.length<2||v.groups.length>4||!Array.isArray(v.items)||v.items.length<4||v.items.length>10)return null;
  const groups:string[]=[],items:string[]=[];
  for(const item of v.groups){const t=text(item,50);if(!t||groups.includes(t))return null;groups.push(t);}
  for(const item of v.items){const t=text(item,140);if(!t||items.includes(t))return null;items.push(t);}
  return {type:"sort-quest",prompt,groups,items} as const;
 }
 if(v.type==="data-quest"){
  const title=text(v.title,100),unit=text(v.unit,30),prompt=text(v.prompt,180);
  if(!title||!unit||!prompt||!Array.isArray(v.rows)||v.rows.length<3||v.rows.length>8)return null;
  const rows:{label:string;value:number}[]=[];
  for(const r of v.rows){const label=text(r?.label,45);if(!label||rows.some(x=>x.label===label)||typeof r.value!=="number"||!Number.isFinite(r.value)||r.value<0||r.value>100000||Math.abs(r.value*100-Math.round(r.value*100))>0.000001)return null;rows.push({label,value:r.value});}
  if(!rows.some(r=>r.value>0))return null;
  return {type:"data-quest",title,unit,prompt,rows} as const;
 }
 if(v.type==="fraction-bars"){
  if(!Array.isArray(v.rows)||v.rows.length<1||v.rows.length>3)return null;
  const rows=[];
  for(const r of v.rows){
   if(!integer(r?.total,2,16)||!integer(r?.shaded,0,r.total))return null;
   rows.push({total:r.total,shaded:r.shaded});
  }
  return {type:"fraction-bars",rows} as const;
 }
 if(v.type==="fraction-quest"){
  if(!integer(v.total,2,8)||!integer(v.shaded,1,v.total-1)||!integer(v.target_total,2,16)||v.total===v.target_total||v.shaded*v.target_total%v.total!==0)return null;
  const context=v.context;
  if(context!=="pizza"&&context!=="garden"&&context!=="tiles")return null;
  return {type:"fraction-quest",total:v.total,shaded:v.shaded,target_total:v.target_total,context} as const;
 }
 if(v.type==="fraction-split"){
  if(!integer(v.total,2,8)||!integer(v.shaded,1,v.total-1)||!integer(v.factor,2,4)||v.total*v.factor>16)return null;
  return {type:"fraction-split",total:v.total,shaded:v.shaded,factor:v.factor} as const;
 }
 if(v.type==="select"||v.type==="order"){
  if(!Array.isArray(v.items)||v.items.length<(v.type==="order"?3:2)||v.items.length>8)return null;
  const items:string[]=[];
  for(const item of v.items){const t=text(item,120);if(!t||items.includes(t))return null;items.push(t);}
  return {type:v.type as "select"|"order",items};
 }
 if(v.type==="fraction-build"){
  if(!integer(v.total,2,16))return null;
  // No expected answer in the public visual. Learner selection is local exploration.
  return {type:"fraction-build",total:v.total} as const;
 }
 if(v.type==="steps"||v.type==="compare"||v.type==="sequence"){
  if(!Array.isArray(v.items)||v.items.length<2||v.items.length>5||v.type==="compare"&&v.items.length!==2)return null;
  const items=[];
  for(const item of v.items){
   const label=text(item?.label,60),body=text(item?.body,160);
   if(!label||!body)return null;
   items.push({label,body});
  }
  return {type:v.type as "steps"|"compare"|"sequence",items};
 }
 return null;
}

// Shared visual state contains only bounded indices, not learner names, prose or answers.
export function initialSlideInteraction(visual:unknown){
 const v=validateSlideVisual(visual);
 if(!v)return null;
 return {id:crypto.randomUUID(),reveal:1,checked:false,selected:[] as number[],placements:v.type==="sort-quest"?v.items.map(()=>-1):[] as number[],order:v.type==="order"?v.items.map((_,i)=>i):[] as number[]};
}
export function changeSlideInteraction(visual:unknown,current:any,b:Record<string,unknown>,owner:boolean){
 const v=validateSlideVisual(visual);
 if(!v||!current||typeof current.id!=="string"||b.visual_id!==current.id)return null;
 const next={id:current.id,reveal:current.reveal,checked:current.checked===true,placements:Array.isArray(current.placements)?[...current.placements]:[],selected:[...current.selected],order:[...current.order]};
 const demo=v.type==="fraction-split"||v.type==="fraction-bars"||v.type==="steps"||v.type==="compare"||v.type==="sequence";
 if(b.operation==="reset"){
  if(demo&&!owner)return null;
  next.reveal=1;next.checked=false;next.selected=[];next.placements=v.type==="sort-quest"?v.items.map(()=>-1):[];next.order=v.type==="order"?v.items.map((_,i)=>i):[];
 }else if(b.operation==="reveal"&&owner&&demo){
  const max=v.type==="fraction-split"?2:v.type==="fraction-bars"?v.rows.length:"items" in v?v.items.length:1;
  if(next.reveal>=max)return null;
  next.reveal++;
 }else if(b.operation==="check"&&!owner&&(v.type==="fraction-quest"||v.type==="evidence-quest"||v.type==="data-quest"||v.type==="sort-quest")){
  if(v.type==="sort-quest"?next.placements.length!==v.items.length||next.placements.some(i=>!integer(i,0,v.groups.length-1)):next.selected.length===0)return null;
  next.checked=true;
 }else if(b.operation==="place"&&!owner&&v.type==="sort-quest"){
  if(!integer(b.index,0,v.items.length-1)||!integer(b.direction,-1,v.groups.length-1))return null;
  if(next.placements.length!==v.items.length)return null;
  next.placements[b.index]=b.direction;next.checked=false;
 }else if(b.operation==="toggle"&&!owner&&(v.type==="fraction-build"||v.type==="fraction-quest"||v.type==="select"||v.type==="evidence-quest"||v.type==="data-quest")){
  const max=v.type==="fraction-build"?v.total:v.type==="fraction-quest"?v.target_total:v.type==="data-quest"?v.rows.length:v.items.length;
  if(!integer(b.index,0,max-1))return null;
  const i=b.index;
  next.checked=false;
  next.selected=next.selected.includes(i)?next.selected.filter(x=>x!==i):[...next.selected,i].sort((a,b)=>a-b);
 }else if(b.operation==="move"&&!owner&&v.type==="order"){
  if(!integer(b.index,0,v.items.length-1)||(b.direction!==-1&&b.direction!==1))return null;
  const to=b.index+b.direction;
  if(to<0||to>=v.items.length)return null;
  [next.order[b.index],next.order[to]]=[next.order[to],next.order[b.index]];
 }else return null;
 return next;
}
