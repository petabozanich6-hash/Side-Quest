// One-command, fail-closed WA bulk-source acquisition.
// node worker/scripts/collect-wa-k10-bulk.mjs [directory]
// Downloads all 19 links recorded in official SCSA source inventory.
// If SCSA denies access (403), it never substitutes generated codes.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { importOfficialWaFiles } from "./import-wa-offline.mjs";
const root=fileURLToPath(new URL("../src/data/", import.meta.url));
export async function collectWaBulk(directory, { fetcher=fetch, concurrency=4, inventory=JSON.parse(readFileSync(root+"wa-k10-source-inventory-verified-2026.json","utf8")) }={}) {
  if (!Array.isArray(inventory.source_files) || inventory.source_files.length!==19) throw Error("WA source inventory must contain 19 official routes");
  mkdirSync(directory,{recursive:true});
  const results=new Array(inventory.source_files.length);
  let next=0;
  await Promise.all(Array.from({length:Math.min(concurrency,19)},async()=>{
    while(next<inventory.source_files.length){
      const index=next++, source=inventory.source_files[index];
      const url=new URL(source.source_url);
      const filename=basename(url.pathname);
      if(url.protocol!=="https:"||url.hostname!=="k10outline.scsa.wa.edu.au"||!filename.endsWith(".json")){
        results[index]={source:source.subject,status:"rejected_unofficial_url"};continue;
      }
      const destination=join(directory,filename);
      if(existsSync(destination)){
        try { const bytes=readFileSync(destination);JSON.parse(bytes.toString("utf8"));
          results[index]={source:source.subject,status:"existing_local_source",filename,sha256:createHash("sha256").update(bytes).digest("hex")};continue;
        } catch { /* Replace corrupt local source only after a valid source download. */ }
      }
      try{
        const response=await fetcher(url.href,{signal:AbortSignal.timeout(30000),headers:{accept:"application/json"}});
        if(!response.ok)throw Error("HTTP "+response.status);
        const bytes=Buffer.from(await response.arrayBuffer());
        JSON.parse(bytes.toString("utf8"));
        writeFileSync(destination,bytes);
        results[index]={source:source.subject,status:"downloaded",filename,sha256:createHash("sha256").update(bytes).digest("hex")};
      } catch(error){results[index]={source:source.subject,status:"blocked_or_invalid",reason:String(error).slice(0,180)};}
    }
  }));
  const output=importOfficialWaFiles(directory,inventory);
  return {acquisition:results,import:output};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const directory=resolve(process.argv[2]||"wa-official-json");
  const result=await collectWaBulk(directory);
  const report={created_at:new Date().toISOString(),official_source_count:19,
    source_acquisition:result.acquisition,summary:result.import.summary,
    complete_source_input:result.import.complete_source_input,
    verified_all_codes:false,
    publication_status:"REVIEW_ONLY_DO_NOT_USE_FOR_MASTERY"};
  writeFileSync(join(directory,"acquisition-report.json"),JSON.stringify(report,null,2)+"\n");
  writeFileSync(join(directory,"source-code-candidates.json"),JSON.stringify(result.import,null,2)+"\n");
  console.log(JSON.stringify(report.summary));
  if(!result.import.complete_source_input){console.error("Incomplete WA source download; candidates saved only for review.");process.exitCode=1;}
}
