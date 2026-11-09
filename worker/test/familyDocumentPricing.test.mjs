import test from "node:test";
import assert from "node:assert/strict";
import { documentKind, familyDocumentPrice, MAX_FAMILY_CHILDREN } from "../src/familyDocumentPricing.ts";

const digital={tags:["home-education-document","guided-document","nsw"],fulfilment:"digital"};
const printed={tags:'["home-education-document","print-and-post","nsw"]',fulfilment:"made_to_order"};

test("guided documents charge $1 per additional child with first included",()=>{
  assert.equal(documentKind(digital),"guided");
  assert.deepEqual(familyDocumentPrice(digital,1,2495),{ok:true,children:1,total:2495,extra:100});
  assert.deepEqual(familyDocumentPrice(digital,3,2495),{ok:true,children:3,total:2695,extra:100});
  assert.deepEqual(familyDocumentPrice(digital,5,2495),{ok:true,children:5,total:2895,extra:100});
});
test("printed document packs charge $3 per additional child, postage not included",()=>{
  assert.equal(documentKind(printed),"printed");
  assert.equal(familyDocumentPrice(printed,3,2200).total,2800);
  assert.equal(familyDocumentPrice(printed,1,2200).total,2200);
});
test("children count is validated, not accepted as arbitrary discounted quantity",()=>{
  for(const children of [-1,0,0.5,1.5,6,"oops",null===undefined?undefined:"6"]){
    assert.equal(familyDocumentPrice(digital,children,2495).ok,false,String(children));
  }
  assert.equal(familyDocumentPrice(digital,undefined,2495).total,2495);
  assert.equal(MAX_FAMILY_CHILDREN,5);
  assert.equal(documentKind({tags:["ordinary-download"],fulfilment:"digital"}),null);
});
