import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { collectWaBulk } from "../scripts/collect-wa-k10-bulk.mjs";

test("bulk acquisition downloads 19 official JSON files, preserving candidate-only status",async()=>{
 const dir=mkdtempSync(join(tmpdir(),"wa-bulk-"));
 try {
  const inventory={source_index:"https://k10outline.scsa.wa.edu.au/home/resources/outline-downloads",
   source_files:Array.from({length:19},(_,i)=>({subject:"Subject "+i,learning_area:"test",published_updated:"2026",
    source_url:"https://k10outline.scsa.wa.edu.au/file-"+i+".json"}))};
  let calls=0;
  const fetcher=async()=>{calls++;const bytes=Buffer.from(JSON.stringify([{year:"3",subject:"Science",wa_code:"WA3SCI1"}]));return {ok:true,arrayBuffer:async()=>bytes};};
  const r=await collectWaBulk(dir,{inventory,fetcher});
  assert.equal(calls,19);
  assert.equal(r.import.complete_source_input,true);
  assert.equal(r.import.summary.loaded_sources,19);
  assert.equal(r.import.candidates.length,19);
  assert.ok(r.acquisition.every(x=>x.sha256));
 } finally {rmSync(dir,{recursive:true,force:true});}
});
test("blocked official source results in incomplete review set, never fabricated records",async()=>{
 const dir=mkdtempSync(join(tmpdir(),"wa-bulk-"));
 try {
  const inventory={source_index:"https://k10outline.scsa.wa.edu.au/home/resources/outline-downloads",
   source_files:Array.from({length:19},(_,i)=>({subject:"Subject "+i,learning_area:"test",
    source_url:"https://k10outline.scsa.wa.edu.au/file-"+i+".json"}))};
  const r=await collectWaBulk(dir,{inventory,fetcher:async()=>({ok:false,status:403})});
  assert.equal(r.import.complete_source_input,false);
  assert.equal(r.import.summary.candidate_rows,0);
  assert.equal(r.import.missing_sources.length,19);
 } finally {rmSync(dir,{recursive:true,force:true});}
});
