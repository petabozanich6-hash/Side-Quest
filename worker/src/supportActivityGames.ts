export const GAME_TYPES=["matching","sorting","sequence"] as const;
const clean=(raw:any,min:number,max:number)=>{
 if(!Array.isArray(raw)||raw.length<min||raw.length>max||raw.some(v=>typeof v!=="string"||!v.trim()||v.trim().length>120))return null;
 const values=raw.map(v=>v.trim());
 return new Set(values).size===values.length?values:null;
};
export function validateGameResponse(game:any,raw:unknown):number[]|null{
 if(!game||!Array.isArray(game.items))return null;
 let value:any=raw;
 if(typeof raw==="string"){if(raw.length>200)return null;try{value=JSON.parse(raw);}catch{return null;}}
 const n=game.items.length,max=game.type==="sequence"?n:game.targets?.length;
 if(!Number.isInteger(max)||!Array.isArray(value)||value.length!==n||value.some(v=>!Number.isInteger(v)||v<0||v>=max))return null;
 if(game.type!=="sorting"&&new Set(value).size!==n)return null;
 return value;
}
export function validateGame(b:any){
 const type=b?.type;
 if(!GAME_TYPES.includes(type))return null;
 const items=clean(b?.game?.items,2,8);if(!items)return null;
 const targets=type==="sequence"?[]:clean(b?.game?.targets,2,8);
 if(!targets||(type==="matching"&&targets.length!==items.length))return null;
 const game={type,items,targets};
 const answer=validateGameResponse(game,b.answer_key);
 if(!answer)return null;
 return {game,answer_key:JSON.stringify(answer)};
}
