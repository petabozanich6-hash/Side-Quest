import test from "node:test";
import assert from "node:assert/strict";
import { sampleGuidedDocumentData } from "../src/documentStudioPreview.ts";
import { generateHomeEducationTemplate } from "../src/homeEducationPdf.ts";
import { guestPlanHtml } from "../src/guestDocumentDelivery.ts";

test("guided sample builder provides clearly fictitious answers for all states and years", () => {
  for(const code of ["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"]){
    for(const year of ["K","3","7","12"]){
      const data=sampleGuidedDocumentData(code,year);
      assert.equal(data.learner_name,"Alex Example");
      assert.equal(data.year_level,year);
      assert.ok(Object.keys(data.areas).length>0);
      assert.ok(Object.values(data.areas).every(a=>a.focus.includes("Fictional example")));
    }
  }
  assert.throws(()=>sampleGuidedDocumentData("OTHER","3"));
  assert.throws(()=>sampleGuidedDocumentData("NSW","99"));
});
test("public blank preview has only two watermarked pages, not full paid template",()=>{
  const sample=new TextDecoder().decode(generateHomeEducationTemplate("QLD","3",true));
  const full=new TextDecoder().decode(generateHomeEducationTemplate("QLD","3"));
  assert.match(sample,/SAMPLE PREVIEW/);
  assert.match(sample,/\/Count 2/);
  assert.ok(sample.length<full.length);
  assert.doesNotMatch(full,/SAMPLE PREVIEW/);
});
test("guided public sample is limited to one learning area and labelled clearly",()=>{
  const built={
    jurisdiction:{name:"Queensland",planName:"Home education plan",requirements:[],sources:[]},
    checked_on:"2026-10-14",
    content:{overview:"Overview",educational_philosophy:"Approach",learning_areas:[
      {area:"English",goals:["Read books"],teaching_methods:["Discuss"],sample_activities:["Read a story"],evidence_approach:"Reading notes"},
      {area:"Mathematics",goals:["Counting"],teaching_methods:["Practice"],sample_activities:["Add"],evidence_approach:"Work samples"},
    ]},
    data:{year_level:"3",learner_name:"Alex Example",areas:{English:{focus:"Fictional plans"}}}
  };
  const html=guestPlanHtml(built,true);
  assert.match(html,/SAMPLE PREVIEW/);
  assert.match(html,/Alex Example/);
  assert.match(html,/Read books/);
  assert.doesNotMatch(html,/Counting/);
  assert.doesNotMatch(html,/Remaining learning areas/);
});
