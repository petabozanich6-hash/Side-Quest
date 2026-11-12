import test from "node:test";
import assert from "node:assert/strict";
import {documentSquareOffers,offerForTags,SQUARE_PRODUCTION,listingDraftFor,DOCUMENT_STATES,DOCUMENT_OFFER_KINDS} from "../src/documentSquareOffers.ts";
import {generateHomeEducationTemplate} from "../src/homeEducationPdf.ts";

const str=bytes=>new TextDecoder().decode(bytes);
test("The original product catalogue is eight states times the six exact sellable offers",()=>{
 const offers=documentSquareOffers();
 assert.equal(offers.length,48);
 assert.equal(new Set(offers.map(o=>o.key)).size,48);
 assert.equal(DOCUMENT_STATES.length,8);
 assert.equal(DOCUMENT_OFFER_KINDS.length,6);
 for(const o of offers){
  assert.equal(o.default_price_cents,DOCUMENT_OFFER_KINDS.find(k=>k.kind===o.kind).price_cents);
  assert.equal(offerForTags(["home-education-document",o.state.toLowerCase(),o.tag]).key,o.key);
  const draft=listingDraftFor(o.state,"3",o.kind);
  assert.match(draft.title,/Year 3/);
  assert.ok(draft.description.includes("Not a government-issued"));
  assert.equal(draft.price_cents,o.default_price_cents);
 }
});
test("Only blank products can be attached as finished automatic digital downloads",()=>{
 const automatic=Object.entries(SQUARE_PRODUCTION).filter(([,p])=>p.output==="customer").map(([k])=>k).sort();
 assert.deepEqual(automatic,["blank","planner_blank"]);
 for(const [kind,p] of Object.entries(SQUARE_PRODUCTION)){
  if(p.output==="production_master"){
   const draft=listingDraftFor("QLD","4",kind);
   assert.match(draft.note,/not attach|do not attach/i);
   assert.ok(draft.fulfilment!=="automatic_pdf");
  }
 }
});
test("All six products generate the right structure and explicit owner-master marks",()=>{
 for(const kind of DOCUMENT_OFFER_KINDS){
  const production=SQUARE_PRODUCTION[kind.kind];
  for(const state of DOCUMENT_STATES){
   for(const mode of production.customer_modes){
    const text=str(generateHomeEducationTemplate(state,"3",false,mode,production.edition,[],kind.kind));
    assert.match(text,/^%PDF-1.7/);
    if(production.output==="production_master")assert.match(text,/OWNER PRODUCTION MASTER/);
    else assert.doesNotMatch(text,/OWNER PRODUCTION MASTER/);
    if(mode==="fillable")assert.match(text,/\/AcroForm/);
    else assert.doesNotMatch(text,/\/AcroForm/);
    if(production.edition==="complete")assert.match(text,/Family review/);
    else assert.match(text,/Learner and planning period/);
    if(kind.kind==="guided")assert.match(text,/How this guided document is completed/);
   }
  }
 }
});
test("Year-specific and NSW elective variants are explicit instead of implicitly universal",()=>{
 const nsw=str(generateHomeEducationTemplate("NSW","7",false,"fillable","standard",["Creative Arts","Technology"],"blank"));
 assert.match(nsw,/Additional area 1: Creative Arts/);
 assert.match(nsw,/Additional area 2: Technology/);
 assert.throws(()=>listingDraftFor("INVALID","7","blank"));
 assert.match(listingDraftFor("NSW","7","blank").title,/Year 7/);
 assert.match(listingDraftFor("WA","K","planner_blank").title,/first school year/);
});
