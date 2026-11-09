// One family purchase covers the first learner; additional documents are
// cheaper, but are still separate learner-specific outputs. Server-side cart
// pricing is authoritative; never trust displayed browser totals.
export const MAX_FAMILY_CHILDREN=5;
export const ADDITIONAL_GUIDED_CHILD_CENTS=100;
export const ADDITIONAL_PRINTED_CHILD_CENTS=300;

export function documentKind(p: any): "guided" | "printed" | null {
  const tags = Array.isArray(p?.tags)?p.tags:(()=>{
    try { const parsed=JSON.parse(String(p?.tags||""));return Array.isArray(parsed)?parsed:[]; }
    catch{return [];}
  })();
  if(!tags.includes("home-education-document")) return null;
  return tags.includes("guided-document") && p.fulfilment==="digital"?"guided":
    tags.includes("print-and-post") && p.fulfilment!=="digital"?"printed":null;
}
export function familyDocumentPrice(p:any,rawChildren:unknown,base:number):
  {ok:true;children:number;total:number;extra:number}|{ok:false;detail:string}{
  const count=rawChildren===undefined||rawChildren===null||rawChildren===""?1:Number(rawChildren);
  if(!Number.isInteger(count)||count<1||count>MAX_FAMILY_CHILDREN)
    return {ok:false,detail:`Choose between 1 and ${MAX_FAMILY_CHILDREN} children for this family.`};
  if(!Number.isInteger(base)||base<0)return {ok:false,detail:"Document price unavailable."};
  const extra=documentKind(p)==="printed"?ADDITIONAL_PRINTED_CHILD_CENTS:ADDITIONAL_GUIDED_CHILD_CENTS;
  return {ok:true,children:count,total:base+(count-1)*extra,extra};
}
