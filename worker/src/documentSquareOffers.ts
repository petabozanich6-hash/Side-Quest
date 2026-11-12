import { JURISDICTIONS } from "./data/planJurisdictions";

/** The six actual home-education offers in the EXISTING Side-Quest catalogue.
 * They are not evidence of a separate listing inside Square Dashboard. */
export const DOCUMENT_OFFER_KINDS = [
 { kind:"blank", tag:"fillable-pdf", price_cents:499, method:"static_pdf", label:"Blank Planning Template", title:(state:string)=>"Home Education Planning Template – "+state+" (Fillable PDF)" },
 { kind:"guided", tag:"guided-document", price_cents:999, method:"static_pdf", label:"Self-Guided Home Education Workbook", title:(state:string)=>"Guided Home Education Plan – "+state },
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


/** A production master and a customer-deliverable file are NOT interchangeable.
 * Square's automatic delivery can send static reviewed files, not manufacture
 * an individual child's personalised book or post a spiral-bound edition. */
export const SQUARE_PRODUCTION = {
 blank:{edition:"standard",customer_modes:["print","fillable"],output:"customer",fulfilment:"automatic_pdf",purpose:"Blank, reusable A4 planning workbook. The buyer fills in their own details."},
 guided:{edition:"standard",customer_modes:["print","fillable"],output:"customer",fulfilment:"automatic_pdf",purpose:"Self-guided workbook with step-by-step instructions, examples and fillable planning exercises. Buyers complete the PDF themselves without an online guided form or personalised service."},
 printed:{edition:"standard",customer_modes:["print"],output:"production_master",fulfilment:"print_and_post",purpose:"Printed-to-order workbook. A print-ready PDF is a production master; no PDF should be auto-delivered as the purchased physical book."},
 planner_blank:{edition:"complete",customer_modes:["print","fillable"],output:"customer",fulfilment:"automatic_pdf",purpose:"Blank comprehensive planner and diary, printable and digitally fillable."},
 planner_personalised:{edition:"complete",customer_modes:["print","fillable"],output:"production_master",fulfilment:"after_purchase_personalisation",purpose:"Individualised PDF prepared from the family's information after a verified purchase. The blank master is not the final purchased personalised product."},
 planner_printed:{edition:"complete",customer_modes:["print"],output:"production_master",fulfilment:"personalised_print_and_post",purpose:"Individualised spiral-bound diary. Printing, packaging and shipping happen only after customer details and final proof are prepared."},
} as const satisfies Record<DocumentOfferKind,{edition:"standard"|"complete";customer_modes:readonly ("print"|"fillable")[];output:"customer"|"production_master";fulfilment:string;purpose:string}>;

export function listingDraftFor(state:string,year:string,kind:DocumentOfferKind){
 const code=DOCUMENT_STATES.find(s=>s===state);
 const offer=DOCUMENT_OFFER_KINDS.find(o=>o.kind===kind);
 if(!code||!offer)throw Error("Unknown document listing.");
 const prep=SQUARE_PRODUCTION[kind];
 const display=JURISDICTIONS[code].name;
 const grade=/^(K|F|Prep)$/i.test(year) ? JURISDICTIONS[code].foundationYear : "Year "+year;
 const title=offer.title(display)+" — "+grade;
 const common="Independent Side-Quest home education planning and recordkeeping resource for "+display+" ("+grade+"). Not a government-issued document, a substitute for an official prescribed form, or a registration guarantee. Families must verify current state or territory rules and the relevant curriculum before use.";
 const descriptions:Record<DocumentOfferKind,string>={
  blank:"A spacious home education planning workbook with learning goals, teaching strategies, a resource inventory, weekly planning grid, curriculum overview, individual learning-area lesson tables, progress and evidence records, and additional writing pages. Includes an A4 print edition and digitally fillable PDF with editable table cells.",
  guided:"A self-guided, step-by-step home education planning workbook. Each section explains what to consider, shows illustrative examples and provides spacious fillable exercises and practical tables for writing your own goals, teaching approach, resources, learning activities and evidence plans. Includes both printable and digitally fillable A4 PDFs. Complete it independently, offline and at your own pace; no online guided form, personal consultation or custom plan is included.",
  printed:"A professionally printed home education planning workbook made to order. Includes spacious working areas and practical planning, resources, lesson and evidence tables. Production, binding and delivery must be arranged after purchase. This is a physical product, not an instant PDF download.",
  planner_blank:"A comprehensive blank home education planner and diary with spacious learning plans, resource inventories, weekly planning tables, four flexible planning periods, editable learning diaries, reading logs, evidence indexes, goals trackers, project records and family reviews. Includes A4 print and digitally fillable PDFs with individual multiline table cells.",
  planner_personalised:"A made-to-order family planner and diary developed from information supplied after purchase, with learning plans, records and review sections. The final personalised PDF must be prepared separately after collecting and checking family details; no generic PDF is the completed purchase.",
  planner_printed:"A made-to-order, personalised spiral-bound family planner and diary. After purchase, family information must be collected, the individual final PDF prepared and checked, and the printed book produced and posted. This is not an instant digital item."
 };
 const note=prep.output==="customer"?
  "File delivery: attach the exact reviewed customer ZIP (print + fillable PDFs) to this Square listing using the existing automatic delivery system.":
  prep.fulfilment.includes("print")?
   "Fulfilment: do not attach the owner print master to an automatic digital delivery. Collect any required family details, verify the final proof, then arrange printing and dispatch manually.":
   "Fulfilment: requires a working secure post-purchase family intake and individual PDF production/delivery. Do not attach the blank master as though it were a personalised final product.";
 return {
  key:code+":"+kind+":"+year,title,price_cents:offer.price_cents,
  description:descriptions[kind]+"\n\n"+common,
  category:"Home Education Documents",
  output:prep.output,fulfilment:prep.fulfilment,
  note,grade,slug:"sidequest-"+code.toLowerCase()+"-"+year.toLowerCase()+"-"+kind
 };
}
