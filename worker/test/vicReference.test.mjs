import { test } from "node:test";
import assert from "node:assert/strict";
import { VIC_SOURCE_VERIFIED_IDS } from "../src/data/vic-source-ids.ts";
import { catalogueFor, programFor, outcomeInfo } from "../src/outcomeTracker.ts";

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

test("Victorian families receive a separate VCAA catalogue and official source links",()=>{
  const cat=catalogueFor("VIC");
  assert.equal(cat.available,true);
  assert.equal(cat.framework,"VIC");
  assert.equal(cat.outcomes.length,3723);
  const science=cat.byCode.get("VC2S2U01");
  assert.ok(science,"official Victorian science identifier must exist");
  assert.match(outcomeInfo(science).source_title,/VCAA/);
  assert.match(outcomeInfo(science).official_url,/f10.vcaa.vic.edu.au/);
});
test("Victorian languages stay correctly linked to the selected subject",()=>{
  const cat=catalogueFor("VIC");
  const japanese=cat.outcomes.find(o=>o.subject==="Japanese" && o.levels?.includes("8") && o.status==="V2_REFERENCE_SUBJECT_VERIFIED");
  const french=cat.outcomes.find(o=>o.subject==="French" && o.levels?.includes("8") && o.status==="V2_REFERENCE_SUBJECT_VERIFIED");
  assert.ok(japanese&&french);
  const plan=programFor(cat,{stage:"S4",year_level:"Year 8",extra:{electives:[{name:"Japanese",learning_area:"Languages"}]}});
  assert.equal(plan.includes(japanese),true);
  assert.equal(plan.includes(french),false);
  const vague=programFor(cat,{stage:"S4",year_level:"Year 8",extra:{electives:[{name:"Languages",learning_area:"Languages"}]}});
  assert.equal(vague.includes(japanese),false,"a generic subject is not an actual chosen language");
});
test("VCAA current EAL pathway has separate levels and cannot leak into mainstream English",()=>{
  const cat=catalogueFor("VIC");
  const eal=cat.byCode.get("VCEALC162");
  assert.ok(eal);
  assert.equal(eal.stage,"EAL-BL");
  const ordinary=programFor(cat,{stage:"S2",year_level:"Year 3",extra:{electives:[{name:"English",learning_area:"English"}]}});
  assert.equal(ordinary.includes(eal),false);
  const selected=programFor(cat,{stage:"S2",year_level:"Year 3",extra:{subject_levels:{English:"BL"},electives:[{name:"EAL",learning_area:"English"}]}});
  assert.equal(selected.includes(eal),true);
  const other=cat.outcomes.find(x=>x.stage==="EAL-B1");
  assert.ok(other);
  assert.equal(selected.includes(other),false);
});
test("VCAA published VC2 Arabic does not silently replace its still-current 2026 VC1 syllabus",()=>{
  const cat=catalogueFor("VIC");
  const published=cat.outcomes.find(o=>o.subject==="Arabic"&&o.levels?.includes("8"));
  assert.ok(published);
  assert.equal(published.status,"PUBLISHED_V2_BUT_V1_APPLIES_2026");
  const plan=programFor(cat,{stage:"S4",year_level:"Year 8",extra:{electives:[{name:"Arabic",learning_area:"Languages"}]}});
  assert.equal(plan.includes(published),false);
});

test("shared VCAA content may be mapped through either official subject context",()=>{
  const cat=catalogueFor("VIC");
  const fixture={code:"VC2TEST-CONTEXT-01",description:"",learning_area:"The Arts",
    learning_areas:["The Arts","Capabilities"],subjects:["Dance","Ethical Capability"],
    subject:"Dance",levels:["8"],stage:"S4",source:"VCAA test fixture",status:"V2_REFERENCE_SUBJECT_VERIFIED"};
  const ethical=programFor(cat,{stage:"S4",year_level:"Year 8",extra:{electives:[{name:"Ethical Capability",learning_area:"Capabilities"}]}});
  assert.equal(ethical.includes(fixture),true);
  const arts=programFor(cat,{stage:"S4",year_level:"Year 8",extra:{electives:[{name:"Dance",learning_area:"The Arts"}]}});
  assert.equal(arts.includes(fixture),true);
});
