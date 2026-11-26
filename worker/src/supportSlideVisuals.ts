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
