import test from "node:test";
import assert from "node:assert/strict";
import {premiumDiaryHtml,premiumFamilyDiaryHtml} from "../src/premiumHomeEducationDiary.ts";
import {documentType,requiredReleaseRevision,approvedForSale,reviewEvidence} from "../src/documentRelease.ts";
import {premiumPdfKey,PRINT_JOB_STATUSES} from "../src/premiumPrintQueue.ts";
test("premium planner has complete family lesson, reading, evidence and outcomes worksheets",()=>{
 const blank=premiumDiaryHtml("NSW","3");
 for(const heading of ["Planner & Diary","lesson planning","learning diary","evidence tracker","Reading log","Outcome and progress tracker","Home education requirements","Official sources"])
   assert.match(blank,new RegExp(heading,"i"));
 const filled=premiumDiaryHtml("NSW","3",{data:{learner_name:"<Alex>",year_level:"3",areas:{}},content:{overview:"Education overview"}});
 assert.match(filled,/&lt;Alex&gt;/);
 assert.doesNotMatch(filled,/<Alex>/);
 assert.match(filled,/Education overview/);
 const short=premiumDiaryHtml("NSW","3",undefined,true);
 assert.match(short,/Sample ends here/);
 assert.doesNotMatch(short,/Reading log/);
 assert.throws(()=>premiumDiaryHtml("OTHER","3"));
});
test("premium combined PDF contains separately named child sections",()=>{
 const html=premiumFamilyDiaryHtml("NSW",[
   {year_level:"3",prepared:{data:{learner_name:"Child One",areas:{}},content:{overview:"Plan one"}}},
   {year_level:"7",prepared:{data:{learner_name:"Child Two",areas:{}},content:{overview:"Plan two"}}},
 ]);
 assert.match(html,/Child One/);assert.match(html,/Child Two/);
 assert.match(html,/Plan one/);assert.match(html,/Plan two/);
 assert.throws(()=>premiumFamilyDiaryHtml("NSW",[]));
});
test("document release requires exact version and current official source review",()=>{
 const p={tags:["home-education-document","premium-planner-blank","nsw"],fulfilment:"digital",
   document_release_version:null,document_released_at:null,document_source_checked_on:null};
 assert.equal(documentType(p),"planner_blank");
 assert.equal(approvedForSale(p),false);
 const checked={...p,document_release_version:requiredReleaseRevision(p),document_released_at:"2026-11-10T01:00:00Z",document_source_checked_on:"2026-11-10"};
 assert.equal(approvedForSale(checked,new Date("2026-11-11T00:00:00Z")),true);
 assert.equal(approvedForSale(checked,new Date("2027-07-01T00:00:00Z")),false);
 assert.equal(approvedForSale({...checked,document_release_version:"old-version"},new Date("2026-11-11")),false);
});
test("release checklist is evidence-bound, not a cosmetic shop toggle",()=>{
 assert.equal(reviewEvidence({}).ok,false);
 assert.equal(PRINT_JOB_STATUSES.includes("sent_to_printer"),true);
 assert.match(premiumPdfKey("order","product","job"),/shop\/premium-print-orders/);
});
