// Offline official-source WA K–10 import. Provide JSON files downloaded from SCSA.
// node worker/scripts/import-wa-offline.mjs /path/to/scsa-json /path/to/review-output.json
// Only filenames listed by the official 19-file SCSA source inventory are accepted.
// This avoids reliance on HTTP 403-blocked GitHub runners and prevents invented IDs.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { flattenWaJson } from "./import-wa-review.mjs";
const here=fileURLToPath(new URL("../src/data/wa-k10-source-inventory-verified-2026.json",import.meta.url));
export function importOfficialWaFiles(directory, inventory) {
  if (!Array.isArray(inventory.source_files) || inventory.source_files.length !== 19)
    throw Error("Expected the reviewed 19-source SCSA inventory");
  const files=[], records=[], missing=[];
  for (const source of inventory.source_files) {
    const filename=basename(new URL(source.source_url).pathname);
    const localPath=join(directory,filename);
    if(!existsSync(localPath)){missing.push({subject:source.subject,filename});continue;}
    let doc;try{doc=JSON.parse(readFileSync(localPath,"utf8"));}
    catch(err){missing.push({subject:source.subject,filename,reason:"Unreadable JSON: "+err.message});continue;}
    const rows=flattenWaJson(doc,{url:source.source_url,name:source.subject});
    files.push({subject:source.subject,learning_area:source.learning_area,source_url:source.source_url,local_filename:filename,records:rows.length,updated:source.published_updated});
    records.push(...rows.map(row=>({...row,jurisdiction:"WA",authority:"SCSA",framework_version:"review_applicability",source_updated:source.published_updated})));
  }
  const unique=new Map();
  for(const row of records) unique.set([row.source_file,row.code,row.level].join("|"),row);
  const duplicates=records.length-unique.size;
  return {authority:"SCSA",jurisdiction:"WA",verified_source_inventory:inventory.source_index,review_only:true,
    complete_source_input:missing.length===0 && files.length===19,source_files:files,missing_sources:missing,
    summary:{expected_sources:19,loaded_sources:files.length,candidate_rows:records.length,distinct_source_code_level:unique.size,duplicates},
    candidates:[...unique.values()].sort((a,b)=>a.source_file.localeCompare(b.source_file)||a.code.localeCompare(b.code)||a.level.localeCompare(b.level))};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  if(process.argv.length!==4){console.error("Usage: node worker/scripts/import-wa-offline.mjs <download-directory> <output.json>");process.exit(2);}
  const inventory=JSON.parse(readFileSync(here,"utf8"));
  const result=importOfficialWaFiles(process.argv[2],inventory);
  writeFileSync(process.argv[3],JSON.stringify(result,null,2)+"\n");
  console.log(JSON.stringify(result.summary));
  if(!result.complete_source_input){console.error("INCOMPLETE OFFICIAL SOURCE SET; DO NOT PROMOTE");process.exitCode=1;}
}
