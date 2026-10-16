import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { importOfficialWaFiles } from "../scripts/import-wa-offline.mjs";

test("WA offline import fails closed when the 19-source inventory is incomplete",()=>{
 assert.throws(()=>importOfficialWaFiles("/missing",{source_files:[]}),/19-source/);
});
test("WA offline import records missing official sources and keeps imported codes review-only",()=>{
 const dir=mkdtempSync(join(tmpdir(),"scsa-"));
 try{
  const sources=Array.from({length:19},(_,i)=>({subject:i===0?"English":"Subject "+i,learning_area:"test",source_url:"https://k10outline.scsa.wa.edu.au/official/file-"+i+".json",published_updated:"2026"}));
  writeFileSync(join(dir,"file-0.json"),JSON.stringify([{year:"3",subject:"English",strands:[{textContents:[{wa_code:"WA3ELYA3"}]}]}]));
  const result=importOfficialWaFiles(dir,{source_index:"https://k10outline.scsa.wa.edu.au/home/resources/outline-downloads",source_files:sources});
  assert.equal(result.review_only,true);
  assert.equal(result.complete_source_input,false);
  assert.equal(result.summary.loaded_sources,1);
  assert.equal(result.missing_sources.length,18);
  assert.equal(result.candidates[0].code,"WA3ELYA3");
 }finally{rmSync(dir,{recursive:true,force:true});}
});
