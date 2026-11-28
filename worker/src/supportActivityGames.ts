export const GAME_TYPES=["matching","sorting","sequence","number_line","fraction_model","story_builder"] as const;
const clean=(raw:any,min:number,max:number)=>{
 if(!Array.isArray(raw)||raw.length<min||raw.length>max||raw.some(v=>typeof v!=="string"||!v.trim()||v.trim().length>120))return null;
 const values=raw.map(v=>v.trim());
 return new Set(values).size===values.length?values:null;
};
export function validateGameResponse(game:any,raw:unknown):number[]|null{
 if(!game)return null;
 let value:any=raw;
 if(typeof raw==="string"){if(raw.length>200)return null;try{value=JSON.parse(raw);}catch{return null;}}
 if(game.type==="number_line"||game.type==="fraction_model"){
  const max=game.type==="number_line"?game.intervals:game.parts;
  return Number.isInteger(max)&&Array.isArray(value)&&value.length===1&&Number.isInteger(value[0])&&value[0]>=0&&value[0]<=max?value:null;
 }
 if(game.type==="story_builder"){
  if(!Array.isArray(game.fields)||!Array.isArray(value)||value.length!==game.fields.length)return null;
  return value.every((v,i)=>Number.isInteger(v)&&v>=0&&v<game.fields[i].options.length)?value:null;
 }
 if(!Array.isArray(game.items))return null;
 const n=game.items.length,max=game.type==="sequence"?n:game.targets?.length;
 if(!Number.isInteger(max)||!Array.isArray(value)||value.length!==n||value.some(v=>!Number.isInteger(v)||v<0||v>=max))return null;
 if(game.type!=="sorting"&&new Set(value).size!==n)return null;
 return value;
}
export function validateGame(b:any){
 const type=b?.type;
 if(!GAME_TYPES.includes(type))return null;
 if(type==="story_builder"){
  const raw=b?.game?.fields;if(!Array.isArray(raw)||raw.length<2||raw.length>5)return null;
  const fields:{label:string;options:string[]}[]=[];
  for(const field of raw){
   const label=typeof field?.label==="string"?field.label.trim():"",options=clean(field?.options,2,6);
   if(!label||label.length>80||!options||fields.some(f=>f.label===label))return null;
   fields.push({label,options});
  }
  // Open-ended choices are deliberately not graded or revealed as a solution.
  return {game:{type,fields},answer_key:null};
 }
 if(type==="number_line"||type==="fraction_model"){
  const raw=b?.game;let game;
  if(type==="number_line"){
   const min=raw?.min,max=raw?.max,intervals=raw?.intervals;
   if(!Number.isInteger(min)||!Number.isInteger(max)||min < -10000||max>10000||max<=min||!Number.isInteger(intervals)||intervals<2||intervals>20||(max-min)%intervals!==0)return null;
   game={type,min,max,intervals};
  }else{
   const parts=raw?.parts;if(!Number.isInteger(parts)||parts<2||parts>12)return null;
   game={type,parts};
  }
  const answer=validateGameResponse(game,b.answer_key);
  return answer?{game,answer_key:JSON.stringify(answer)}:null;
 }
 const items=clean(b?.game?.items,2,8);if(!items)return null;
 const targets=type==="sequence"?[]:clean(b?.game?.targets,2,8);
 if(!targets||(type==="matching"&&targets.length!==items.length))return null;
 const game={type,items,targets};
 const answer=validateGameResponse(game,b.answer_key);
 if(!answer)return null;
 return {game,answer_key:JSON.stringify(answer)};
}
