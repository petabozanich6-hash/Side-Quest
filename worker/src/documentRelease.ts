// Home Education Document Studio release gate. Only the dedicated owner route
// can approve a product. Existing shop listing toggles never grant permission.
// The revision changes whenever the customer PDF renderer/content contract changes.
import { CHECKED_ON } from "./data/planJurisdictions";
import { documentKind } from "./familyDocumentPricing";
export const GUIDED_RELEASE_REVISION = "guided-offline-self-directed-pdf-2026-11-12-v3";
export const BLANK_RELEASE_REVISION = "fillable-sidequest-layout-2026-11-10-v2";
export const MAX_REVIEW_AGE_DAYS = 120;
export function sourceReviewCurrent(checked:unknown, now:Date=new Date()):boolean{
  if (typeof checked!=="string" || !/^\d{4}-\d{2}-\d{2}$/.test(checked))return false;
  const date=Date.parse(checked+"T00:00:00Z");
  return Number.isFinite(date) && date<=now.getTime() && now.getTime()-date<=MAX_REVIEW_AGE_DAYS*86400000;
}
export function documentStateFromTags(p:any):string|null{
  const tags=Array.isArray(p?.tags)?p.tags:(()=>{try{return JSON.parse(p?.tags||"[]");}catch{return [];}})();
  if(!Array.isArray(tags)||!tags.includes("home-education-document"))return null;
  const states=["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"];
  const found=states.filter(x=>tags.includes(x.toLowerCase()));
  return found.length===1?found[0]:null;
}
export function documentType(p:any):"blank"|"guided"|"printed"|"planner_blank"|"planner_personalised"|"planner_printed"|null{
  if(!documentStateFromTags(p))return null;
  const tags=Array.isArray(p?.tags)?p.tags:(()=>{try{return JSON.parse(p?.tags||"[]");}catch{return [];}})();
  if(tags.includes("premium-planner-blank")&&p.fulfilment==="digital")return "planner_blank";
  if(tags.includes("premium-planner-personalised")&&p.fulfilment==="digital")return "planner_personalised";
  if(tags.includes("premium-planner-printed")&&p.fulfilment!=="digital")return "planner_printed";
  const kind=documentKind(p);
  if(kind)return kind;
  return tags.includes("fillable-pdf")&&p.fulfilment==="digital"?"blank":null;
}
export function requiredReleaseRevision(p:any):string|null{
  const kind=documentType(p);
  if(!kind)return null;
  const state=documentStateFromTags(p);
  if(kind.startsWith("planner_"))return "premium-family-diary-v1:"+kind+":"+state+":"+CHECKED_ON;
  if(kind==="guided")return GUIDED_RELEASE_REVISION+":"+state+":"+CHECKED_ON;
  if(kind==="printed")return BLANK_RELEASE_REVISION+":printed:"+state+":"+CHECKED_ON;
  return BLANK_RELEASE_REVISION+":"+state+":"+CHECKED_ON;
}
/**
 * Generated on demand: these products do not need a pre-uploaded PDF.
 * Their buyer-specific renderer is separate from the reusable-template release workflow.
 * Checkout independently verifies PDF/email and private storage capabilities before charging.
 */
export function isOnDemandDocument(p:any):boolean {
 // Guided is now a self-guided static file. Keep legacy paid guided-order links
 // working, but never sell a NEW guided order through the old online wizard.
 return ["blank","printed","planner_blank","planner_personalised","planner_printed"].includes(documentType(p)||"");
}
export function approvedForSale(p:any,now:Date=new Date()):boolean{
  const version=requiredReleaseRevision(p);
  return !!version && p.document_release_version===version &&
    sourceReviewCurrent(p.document_source_checked_on,now) && !!p.document_released_at;
}
export function reviewEvidence(raw:any){
  const required=["official_sources_checked","requirements_mapped","curriculum_stages_checked","example_reviewed","layout_tested","accessibility_checked","independent_review_completed","no_government_endorsement_claim"];
  if(required.some(k=>raw?.[k]!==true))return {ok:false,detail:"Complete every educational, source, print and independent review check before activation."} as const;
  const reviewer=typeof raw?.reviewer==="string"?raw.reviewer.trim().slice(0,120):"";
  const notes=typeof raw?.review_notes==="string"?raw.review_notes.trim().slice(0,2000):"";
  const source=typeof raw?.source_checked_on==="string"?raw.source_checked_on.trim():"";
  if(reviewer.length<3||notes.length<40||!sourceReviewCurrent(source))return {ok:false,detail:"Provide the reviewer, substantive review findings (40+ characters) and a current official-source review date."} as const;
  return {ok:true,value:{reviewer,notes,source,checklist:required}} as const;
}
