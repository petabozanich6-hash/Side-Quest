// Victoria F–10 v2 official-source code discovery, REVIEW ONLY.
// VCAA's interactive download form exports CSV; this scraper indexes identifiers
// from public level pages, retaining source URL and version. 2026 still uses
// Version 1.0 for EAL and Phase 3/4 Languages: those are NOT silently substituted.
// Official sources:
// https://f10.vcaa.vic.edu.au/download-curriculum
// https://www.vcaa.vic.edu.au/curriculum/foundation-10-version-2/victorian-curriculum-f-10-version-20
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const BASE = "https://f10.vcaa.vic.edu.au";
const CODE = /\bVC2[A-Z][A-Z0-9]{3,22}\b/g;
export const LEVEL_PATHS = [
  ...Array.from({length:10},(_,i)=>({level:String(i+1),url:BASE+"/levels/level-"+(i+1)})),
  {level:"Foundation",url:BASE+"/levels/foundation"},
  ...["A","B","C","D"].map(x=>({level:"FL"+x,url:BASE+"/levels/foundation-level-"+x.toLowerCase()})),
];
export function extractVicIds(html, source, level){
  const codes=new Set();
  // Codes are structural VCAA identifiers, not descriptors. Script bundles or
  // hydration blobs can duplicate them, hence set deduplication.
  const matches=html.match(CODE)||[];
  for(const m of matches) {
    if(m.length<7 || m.length>26) continue;
    codes.add(m);
  }
  return [...codes].sort().map(code=>({
    code,source_url:source,source_level:level,framework:"VCAA F–10 v2",
    identifier_kind:"vc2_candidate_content_description",
    status:"extracted_not_yet_classified_by_subject_or_curriculum_version",
  }));
}
async function get(url){
  const r=await fetch(url,{headers:{accept:"text/html","user-agent":"SideQuestCurriculumResearch/1.0 (source code audit)"},signal:AbortSignal.timeout(25000)});
  if(!r.ok)throw Error("HTTP "+r.status+" "+url);
  return await r.text();
}
async function main(){
  const successes=[],failures=[],linksByCode=new Map();
  for(const src of LEVEL_PATHS){
    try{
      const html=await get(src.url);
      const found=extractVicIds(html,src.url,src.level);
      successes.push({level:src.level,url:src.url,html_bytes:html.length,candidate_codes:found.length});
      for(const row of found){
        if(!linksByCode.has(row.code)) linksByCode.set(row.code,{...row,source_levels:[row.source_level],source_urls:[row.source_url]});
        else{
          const existing=linksByCode.get(row.code);
          if(!existing.source_levels.includes(row.source_level))existing.source_levels.push(row.source_level);
          if(!existing.source_urls.includes(row.source_url))existing.source_urls.push(row.source_url);
        }
      }
      console.log("VCAA "+src.level+": "+found.length+" distinct codes, page "+html.length+" bytes");
    }catch(e){
      failures.push({level:src.level,url:src.url,error:String(e).slice(0,200)});
      console.warn("VCAA "+src.level+" source error: "+String(e).slice(0,160));
    }
  }
  const candidates=[...linksByCode.values()].sort((a,b)=>a.code.localeCompare(b.code));
  const result={
    source:"VCAA Victorian Curriculum F–10 v2 official level listing pages",
    source_authority_url:BASE+"/download-curriculum",
    downloaded_on:new Date().toISOString().slice(0,10),
    complete:false,
    warnings:[
      "Candidates require classification by official subject, curriculum version and applicable year before being published to the tracker.",
      "2026 EAL, Phase 3/4 Languages, and certain A–D curricula still use Victorian Curriculum v1; these are not in the VC2 candidates.",
      "Selected level pages may contain shared navigation/hydration code references. A level-page mention does not by itself certify the code's learning level.",
      "VCE, VCE VM, VET and senior course identifiers are separate and not included."
    ],
    results:successes,failures,candidates,
    summary:{requested_level_pages:LEVEL_PATHS.length,successes:successes.length,failures:failures.length,distinct_codes:candidates.length}
  };
  const path=fileURLToPath(new URL("../src/data/vic-review-import.json",import.meta.url));
  writeFileSync(path,JSON.stringify(result,null,2)+"\n");
  console.log("VCAA v2 source audit "+JSON.stringify(result.summary));
  if (failures.length)console.log("Missing URLs: "+JSON.stringify(failures));
  if(candidates.length<50)throw Error("Too few VC2 candidates. Do not accept import until VCAA source extraction is verified.");
  console.log("Review-only candidates collected, NOT a complete VIC catalogue.");
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===fileURLToPath(new URL("file://"+process.argv[1]))) main().catch(e=>{console.error(e);process.exitCode=1});
