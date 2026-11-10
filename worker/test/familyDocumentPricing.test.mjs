import test from "node:test";
import assert from "node:assert/strict";
import { documentKind, familyDocumentPrice, MAX_FAMILY_CHILDREN, BLANK_DOCUMENT_BASE_CENTS, GUIDED_DOCUMENT_BASE_CENTS, PRINTED_DOCUMENT_BASE_CENTS } from "../src/familyDocumentPricing.ts";
const guided={tags:["home-education-document","guided-document","nsw"],fulfilment:"digital"};
const blank={tags:["home-education-document","fillable-pdf","nsw"],fulfilment:"digital"};
const printed={tags:["home-education-document","print-and-post","nsw"],fulfilment:"made_to_order"};
test("agreed base prices and per-child discounts",()=>{
  assert.deepEqual([BLANK_DOCUMENT_BASE_CENTS,GUIDED_DOCUMENT_BASE_CENTS,PRINTED_DOCUMENT_BASE_CENTS],[499,999,1499]);
  assert.equal(documentKind(blank),"blank");assert.equal(documentKind(guided),"guided");assert.equal(documentKind(printed),"printed");
  assert.deepEqual(familyDocumentPrice(blank,3,499),{ok:true,children:3,total:699,extra:100});
  assert.deepEqual(familyDocumentPrice(guided,3,999),{ok:true,children:3,total:1399,extra:200});
  assert.deepEqual(familyDocumentPrice(printed,3,1499),{ok:true,children:3,total:1899,extra:200});
  assert.equal(familyDocumentPrice(printed,1,1499).total,1499);
});
test("family count validated and defaults to one",()=>{
  for(const n of [-1,0,0.5,1.5,6,"oops","6"])assert.equal(familyDocumentPrice(blank,n,499).ok,false);
  assert.equal(familyDocumentPrice(blank,undefined,499).total,499);
  assert.equal(MAX_FAMILY_CHILDREN,5);
  assert.equal(documentKind({tags:["ordinary-download"],fulfilment:"digital"}),null);
});
