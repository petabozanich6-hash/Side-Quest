// National bulk importer orchestration. Run from repository root:
// node worker/scripts/collect-national-curriculum.mjs [--execute] [--jurisdiction NSW,VIC,...]
// Without --execute produces a plan only; never claims missing authorities are complete.
import {spawnSync} from "node:child_process";
import {mkdirSync,writeFileSync} from "node:fs";
const commands=[
 {id:"ACARA-F10",jurisdictions:["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"],authority:"ACARA",command:["node","worker/scripts/import-ac9.mjs"],kind:"content_description",notes:"National source; applicability per jurisdiction still requires verification"},
 {id:"NSW-NESA",jurisdictions:["NSW"],authority:"NESA",command:["node","worker/scripts/import-nesa-review.mjs"],kind:"syllabus_outcome"},
 {id:"VIC-VC2",jurisdictions:["VIC"],authority:"VCAA",command:["node","worker/scripts/import-vic-review.mjs"],kind:"content_description"},
 {id:"VIC-SUBJECTS",jurisdictions:["VIC"],authority:"VCAA",command:["node","worker/scripts/import-vic-subjects.mjs"],kind:"content_description"},
 {id:"VIC-EAL",jurisdictions:["VIC"],authority:"VCAA",command:["node","worker/scripts/import-vic1-eal.mjs"],kind:"content_description"},
 {id:"VIC-LANGUAGES",jurisdictions:["VIC"],authority:"VCAA",command:["node","worker/scripts/import-vic1-languages.mjs"],kind:"content_description"},
 {id:"QLD-QCE",jurisdictions:["QLD"],authority:"QCAA",command:["node","worker/scripts/import-qcaa-senior.mjs"],kind:"senior_course"},
 {id:"WA-K10",jurisdictions:["WA"],authority:"SCSA",command:["node","worker/scripts/collect-wa-k10-bulk.mjs","wa-official-json"],kind:"content_description"},
 {id:"SA-NT-SACE",jurisdictions:["SA","NT"],authority:"SACE",command:["node","worker/scripts/import-sace-2026.mjs"],kind:"senior_subject"},
 {id:"TAS-TASC",jurisdictions:["TAS"],authority:"TASC",command:["node","worker/scripts/import-tasc-2026.mjs"],kind:"senior_course"},
 {id:"ACT-BSSS",jurisdictions:["ACT"],authority:"BSSS",command:["python3","worker/scripts/import-act-bsss-2026.py"],kind:"senior_course"}
];
export const NATIONAL_COLLECTION_JOBS=commands;
export function chooseJobs(codes){return commands.filter(job=>!codes.length||job.jurisdictions.some(j=>codes.includes(j)));}
export function buildNationalPlan({jurisdictions=[],execute=false,runner=spawnSync}={}){
 const selected=chooseJobs(jurisdictions),results=[];
 for(const job of selected){
  const entry={id:job.id,jurisdictions:job.jurisdictions,authority:job.authority,kind:job.kind,command:job.command,
    status:"planned_not_executed",source_verified:false,coverage_complete:false};
  if(execute){
   const r=runner(job.command[0],job.command.slice(1),{encoding:"utf8",timeout:120000,stdio:"pipe"});
   entry.status=r.error||r.status!==0?"failed_or_blocked":"import_executed_review_only";
   entry.exit_code=r.status;
   entry.error=(r.error?.message||r.stderr||"").slice(-1200);
   entry.stdout_tail=(r.stdout||"").slice(-600);
  }
  results.push(entry);
 }
 return {created_at:new Date().toISOString(),jurisdictions:["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"],executed:execute,
  all_complete:false,warning:"A successful importer run is not a completeness certification. Senior course IDs are not outcome IDs.",jobs:results};
}
if(process.argv[1]?.endsWith("collect-national-curriculum.mjs")){
 const execute=process.argv.includes("--execute");const arg=process.argv.find(a=>a.startsWith("--jurisdiction="));
 const jurisdictions=arg?arg.split("=")[1].split(",").map(x=>x.trim().toUpperCase()):[];
 const report=buildNationalPlan({execute,jurisdictions});mkdirSync("curriculum-audits",{recursive:true});
 writeFileSync("curriculum-audits/national-collection-report.json",JSON.stringify(report,null,2)+"\n");
 console.log(JSON.stringify(report.jobs.map(({id,status})=>({id,status})),null,2));
 if(execute&&report.jobs.some(x=>x.status==="failed_or_blocked"))process.exitCode=1;
}
