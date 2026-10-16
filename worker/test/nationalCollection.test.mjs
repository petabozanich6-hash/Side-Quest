import {test} from "node:test";
import assert from "node:assert/strict";
import {NATIONAL_COLLECTION_JOBS,chooseJobs,buildNationalPlan} from "../scripts/collect-national-curriculum.mjs";
test("every Australian jurisdiction has at least one authority import job",()=>{
 const all=["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"];
 for(const j of all)assert.ok(chooseJobs([j]).length>0,j);
 assert.equal(new Set(NATIONAL_COLLECTION_JOBS.flatMap(x=>x.jurisdictions)).size,8);
});
test("planning is non-executing and never announces curriculum completeness",()=>{
 const plan=buildNationalPlan({jurisdictions:["NSW"]});
 assert.ok(plan.jobs.every(x=>x.status==="planned_not_executed"));
 assert.ok(plan.jobs.every(x=>x.source_verified===false&&x.coverage_complete===false));
 assert.equal(plan.all_complete,false);
});
test("failed import is captured without claiming verified source coverage",()=>{
 const plan=buildNationalPlan({jurisdictions:["ACT"],execute:true,
  runner:()=>({status:1,stderr:"blocked 403",stdout:""})});
 const act=plan.jobs.find(x=>x.id==="ACT-BSSS");
 assert.equal(act.status,"failed_or_blocked");
 assert.equal(act.source_verified,false);
});
