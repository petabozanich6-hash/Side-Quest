import { JURISDICTIONS } from "./data/planJurisdictions";

/** The six actual home-education offers in the EXISTING Side-Quest catalogue.
 * They are not evidence of a separate listing inside Square Dashboard. */
export const DOCUMENT_OFFER_KINDS = [
 { kind:"blank", tag:"fillable-pdf", price_cents:499, method:"static_pdf", label:"Blank Planning Template", title:(state:string)=>"Home Education Planning Template – "+state+" (Fillable PDF)" },
 { kind:"guided", tag:"guided-document", price_cents:999, method:"guided_after_purchase", label:"Guided Home Education Plan", title:(state:string)=>"Guided Home Education Plan – "+state },
 { kind:"printed", tag:"print-and-post", price_cents:1499, method:"physical_print", label:"Printed Planning Workbook", title:(state:string)=>"Printed Home Education Planning Workbook – "+state },
 { kind:"planner_blank", tag:"premium-planner-blank", price_cents:2995, method:"static_pdf", label:"Complete Planner & Diary — Blank", title:(state:string)=>"Complete Home Education Planner & Diary – "+state+" (Blank PDF)" },
 { kind:"planner_personalised", tag:"premium-planner-personalised", price_cents:3995, method:"personalised_after_purchase", label:"Complete Planner & Diary — Personalised", title:(state:string)=>"Complete Home Education Planner & Diary – "+state+" (Personalised PDF)" },
 { kind:"planner_printed", tag:"premium-planner-printed", price_cents:6995, method:"personalised_print", label:"Complete Planner & Diary — Spiral Bound", title:(state:string)=>"Complete Home Education Planner & Diary – "+state+" (Spiral Bound Printed)" },
] as const;
export const DOCUMENT_STATES=["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"] as const;
export type DocumentOfferKind=typeof DOCUMENT_OFFER_KINDS[number]["kind"];
export const squareAuditStatuses=["not_checked","not_listed","draft","active","paused"] as const;
export const documentSquareOffers=()=>DOCUMENT_STATES.flatMap(state=>
 DOCUMENT_OFFER_KINDS.map(kind=>({
  state,kind:kind.kind,tag:kind.tag,default_price_cents:kind.price_cents,
  label:kind.label,method:kind.method,
  expected_title:kind.title(JURISDICTIONS[state].name),
  key:state+":"+kind.kind
 }))
);
export const offerForTags=(tags:unknown)=>{
 if(!Array.isArray(tags))return null;
 const state=DOCUMENT_STATES.find(code=>tags.includes(code.toLowerCase()));
 const type=DOCUMENT_OFFER_KINDS.find(def=>tags.includes(def.tag));
 if(!state||!type||!tags.includes("home-education-document"))return null;
 return {state,kind:type.kind,key:state+":"+type.kind};
};
