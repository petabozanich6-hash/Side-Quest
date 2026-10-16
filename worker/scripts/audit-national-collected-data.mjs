// Audit all eight jurisdiction source-backed collections in one command.
// node worker/scripts/audit-national-collected-data.mjs
// Code totals are NOT completeness claims; count each identifier kind separately.
import {readFileSync,existsSync,writeFileSync,mkdirSync,readdirSync} from "node:fs";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../src/data/",import.meta.url));
const inventory={
 NSW:["nesa-current-2026.ts","nesa-review-import.json","nsw-stage6-2024-life-skills-verified-outcomes.json","nsw-stage6-ancient-geography-lifeskills-outcomes-verified.json"],
 VIC:["vic-source-ids.ts","vic1-languages-review.json"],
 QLD:["qcaa-senior-a-z-subject-inventory-2026-review.json","qcaa-senior-see-short-courses-2026-review.json"],
 WA:["wa-k10-source-inventory-verified-2026.json","wa-ablewa-science-stages-a-d-review.json"],
 SA:["sace-2026-subject-review.json"],
 TAS:["tasc-2026-course-codes.json"],
 ACT:[],
 NT:["sace-2026-subject-review.json"]
};
const shared="ac9-outcomes.ts";
const filenameKind=name=>name.includes("inventory")?"source_or_subject_inventory":name.includes("review")?"review_mixed":name.includes("outcomes")?"outcome_or_content_candidate":"authority_data";
function auditDataset(name){
 const path=root+name;
 if(!existsSync(path))return {file:name,status:"missing"};
 try{
  const source=readFileSync(path,"utf8");
  if(name.endsWith(".ts"))return {file:name,status:"present_typescript",bytes:Buffer.byteLength(source),verified_identifiers:null,
    note:"TS catalogues require their dedicated importer audits; file presence is not a record count"};
  const doc=JSON.parse(source);
  const rows=Array.isArray(doc.records)?doc.records:Array.isArray(doc.candidates)?doc.candidates:null;
  const kinds=rows?rows.reduce((acc,r)=>{const k=r.identifier_kind||"unspecified";acc[k]=(acc[k]||0)+1;return acc},{}):{};
  const codes=rows?.map(r=>String(r.identifier||r.code||"")).filter(Boolean)||[];
  return {file:name,status:"present_review",source_status:doc.status||null,records:rows?.length??null,
    distinct_identifiers:new Set(codes).size,identifier_kinds:kinds,category:filenameKind(name),
    verified_identifiers:null,note:"Counts are source/review records; NOT certified outcomes or exhaustive coverage"};
 }catch(e){return {file:name,status:"invalid_json",error:String(e).slice(0,180)}}
}
export function auditNationalData(files=inventory){
 const out={created_at:new Date().toISOString(),complete:false,authority_source_validation_run:false,
  applicability_of_ac9:"requires edition and jurisdiction review",shared_national_catalogue:auditDataset(shared),
  jurisdictions:{}};
 for(const [jurisdiction,names] of Object.entries(files)){
  const datasets=names.map(auditDataset);
  out.jurisdictions[jurisdiction]={status:"INCOMPLETE",dataset_files:datasets,
    files_present:datasets.filter(x=>x.status.startsWith("present")).length,
    files_missing:datasets.filter(x=>x.status==="missing").length,
    verified_complete_subject_matrix:false};
 }
 return out;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const result=auditNationalData();
 mkdirSync("curriculum-audits",{recursive:true});
 writeFileSync("curriculum-audits/national-data-audit.json",JSON.stringify(result,null,2)+"\n");
 console.log(JSON.stringify(Object.fromEntries(Object.entries(result.jurisdictions).map(([k,v])=>[k,{status:v.status,files_present:v.files_present,files_missing:v.files_missing}])),null,2));
}
