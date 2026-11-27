// A closed data schema for learner-facing visuals: no HTML, code, external URLs, or private answers.
const text=(v:unknown,n:number)=>typeof v==="string"&&v.trim().length>0&&v.trim().length<=n?v.trim():null;
const integer=(v:unknown,min:number,max:number):v is number=>typeof v==="number"&&Number.isInteger(v)&&v>=min&&v<=max;
export function validateSlideVisual(v:any){
 if(!v||typeof v!=="object")return null;
 if(v.type==="fraction-bars"){
  if(!Array.isArray(v.rows)||v.rows.length<1||v.rows.length>3)return null;
  const rows=[];
  for(const r of v.rows){
   if(!integer(r?.total,2,16)||!integer(r?.shaded,0,r.total))return null;
   rows.push({total:r.total,shaded:r.shaded});
  }
  return {type:"fraction-bars",rows} as const;
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
 return {id:crypto.randomUUID(),reveal:1,selected:[] as number[],order:v.type==="order"?v.items.map((_,i)=>i):[] as number[]};
}
export function changeSlideInteraction(visual:unknown,current:any,b:Record<string,unknown>,owner:boolean){
 const v=validateSlideVisual(visual);
 if(!v||!current||typeof current.id!=="string"||b.visual_id!==current.id)return null;
 const next={id:current.id,reveal:current.reveal,selected:[...current.selected],order:[...current.order]};
 const demo=v.type==="fraction-split"||v.type==="fraction-bars"||v.type==="steps"||v.type==="compare"||v.type==="sequence";
 if(b.operation==="reset"){
  if(demo&&!owner)return null;
  next.reveal=1;next.selected=[];next.order=v.type==="order"?v.items.map((_,i)=>i):[];
 }else if(b.operation==="reveal"&&owner&&demo){
  const max=v.type==="fraction-split"?2:v.type==="fraction-bars"?v.rows.length:"items" in v?v.items.length:1;
  if(next.reveal>=max)return null;
  next.reveal++;
 }else if(b.operation==="toggle"&&!owner&&(v.type==="fraction-build"||v.type==="select")){
  const max=v.type==="fraction-build"?v.total:v.items.length;
  if(!integer(b.index,0,max-1))return null;
  const i=b.index;
  next.selected=next.selected.includes(i)?next.selected.filter(x=>x!==i):[...next.selected,i].sort((a,b)=>a-b);
 }else if(b.operation==="move"&&!owner&&v.type==="order"){
  if(!integer(b.index,0,v.items.length-1)||(b.direction!==-1&&b.direction!==1))return null;
  const to=b.index+b.direction;
  if(to<0||to>=v.items.length)return null;
  [next.order[b.index],next.order[to]]=[next.order[to],next.order[b.index]];
 }else return null;
 return next;
}
