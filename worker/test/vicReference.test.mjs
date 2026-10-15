import { test } from "node:test";
import assert from "node:assert/strict";
import { VIC_SOURCE_VERIFIED_IDS } from "../src/data/vic-source-ids.ts";

test("VCAA source-based v2 codes and v1 EAL remain distinct verified identifiers",()=>{
  assert.equal(VIC_SOURCE_VERIFIED_IDS.length,3723);
  assert.equal(new Set(VIC_SOURCE_VERIFIED_IDS.map(x=>x.code)).size,3723);
  assert.equal(VIC_SOURCE_VERIFIED_IDS.filter(x=>x.curriculum_version==="VC2").length,2927);
  assert.equal(VIC_SOURCE_VERIFIED_IDS.filter(x=>x.curriculum_version==="VC1-EAL").length,796);
  assert.ok(VIC_SOURCE_VERIFIED_IDS.every(x=>x.description===""),"code-only reference; do not republish syllabus prose");
  assert.ok(VIC_SOURCE_VERIFIED_IDS.every(x=>x.source_url.startsWith("https://")));
});
test("2026 Victorian English as an Additional Language pathways preserve each exact level",()=>{
  const rows=VIC_SOURCE_VERIFIED_IDS.filter(x=>x.curriculum_version==="VC1-EAL");
  for(const level of ["A1","A2","BL","B1","B2","B3","CL","C1","C2","C3","C4"])assert.ok(rows.some(x=>x.stage==="EAL-"+level),level);
  assert.ok(rows.every(x=>x.status==="V1_EAL_2026_CURRENT"));
  assert.ok(rows.every(x=>x.subject==="English as an Additional Language"));
});
test("Languages still using VC1 in 2026 are not falsely treated as current VC2",()=>{
  const arabic=VIC_SOURCE_VERIFIED_IDS.filter(x=>x.subject==="Arabic"&&x.curriculum_version==="VC2");
  assert.ok(arabic.length>0);
  assert.ok(arabic.every(x=>x.status==="PUBLISHED_V2_BUT_V1_APPLIES_2026"));
  assert.ok(VIC_SOURCE_VERIFIED_IDS.some(x=>x.curriculum_version==="VC2"&&x.shared_between_contexts));
});
