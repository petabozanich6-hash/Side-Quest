import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyWaSource } from "../scripts/verify-wa-source-codes.mjs";

const url="https://k10outline.scsa.wa.edu.au/example/science.json";
test("verify official literal ABLEWA stage-specific codes and reject inferred suffixes",()=>{
 const source=[{year:"a",subject:"Science",strands:[{subStrands:[{textContents:[
  {sub_strand_id:12,wa_code:"",markdown:"<p>Explore living things (ACSSU002a)</p>",examples:[]},
  {sub_strand_id:12,wa_code:"WA3SCI1",markdown:"<p>(ACSSU999a) example</p>"}
 ]}]}]}];
 const review={source_url:url,records:[
   {identifier:"ACSSU002a",subject:"Science",level:"ABLEWA Stage A"},
   {identifier:"ACSSU002b",subject:"Science",level:"ABLEWA Stage B"},
   {identifier:"WA3SCI1",subject:"Science"},
   {identifier:"ACSSU999a",subject:"Science"}
 ]};
 const result=verifyWaSource(source,review);
 assert.equal(result.total,4);
 assert.equal(result.matched,2);
 assert.deepEqual(result.missing.map(x=>x.identifier),["ACSSU002b","ACSSU999a"]);
 assert.equal(result.complete,false);
});
test("reject missing authority source reference",()=>{
 assert.throws(()=>verifyWaSource([], {records:[]}),/official WA source_url/);
});
