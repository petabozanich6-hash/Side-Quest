import test from "node:test";
import assert from "node:assert/strict";
import {academyPrice,validateAcademyPrice,academyObligationMatches} from "../src/writersAcademyPricing.ts";
import {WRITERS_ACADEMY} from "../src/writersAcademy.ts";
test("three tiers produce nine exact integer-cent quotes, including discounted full rounds",()=>{
 const expected=[[2500,15000,13500],[3000,18000,16500],[4500,27000,24000]];
 for(const [i,p] of WRITERS_ACADEMY.entries()){
  for(const [j,mode] of ["single","weekly","upfront"].entries()){
   const q=academyPrice(p.id,mode);
   assert.equal(q.total_cents,expected[i][j]);assert.deepEqual(validateAcademyPrice(q),q);
   assert.equal(q.obligations.reduce((n,o)=>n+o.amount_cents,0),q.total_cents);
   assert.equal(q.obligations.reduce((n,o)=>n+o.expected_seats,0),q.session_count);
   assert.equal(q.obligations.length,mode==="weekly"?6:1);
   for(const o of q.obligations){assert.ok(academyObligationMatches(q,o.sequence,o.amount_cents,o.expected_seats));assert.equal(academyObligationMatches(q,o.sequence,o.amount_cents+1,o.expected_seats),false);}
  }
 }
 assert.equal(academyPrice("unknown","upfront"),null);assert.equal(academyPrice(WRITERS_ACADEMY[0].id,"monthly"),null);
});
test("reject tampered prices, mistaken adult audience, invalid version and incomplete instalments",()=>{
 const q=academyPrice(WRITERS_ACADEMY[2].id,"weekly");
 for(const bad of [{...q,total_cents:24000},{...q,audience:"minor"},{...q,price_version:"other"},{...q,session_cents:1500},{...q,obligations:q.obligations.slice(0,5)},{...q,obligations:q.obligations.map((o,i)=>i?o:{...o,amount_cents:4000})}])assert.equal(validateAcademyPrice(bad),null);
 const upfront=academyPrice(WRITERS_ACADEMY[2].id,"upfront");
 assert.equal(upfront.savings_cents,3000);assert.equal(academyObligationMatches(upfront,0,27000,6),false);
 assert.equal(academyObligationMatches(upfront,0,24000,1),false);
});
