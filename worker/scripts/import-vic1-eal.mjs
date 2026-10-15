// Official Victorian Curriculum F–10 Version 1 EAL identifiers.
// VCAA instructs teachers to retain Version 1.0 for EAL in 2026.
// All three pathways are different learning levels, not equivalent to standard year 3/4.
// REVIEW ONLY until per-level completeness and 2026 applicable edition are certified.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const BASE="https://victoriancurriculum.vcaa.vic.edu.au";
export const EAL_SOURCES=[
 {pathway:"A",name:"Early immersion",url:BASE+"/english/english-as-an-additional-language-eal/pathway-a-early-immersion/curriculum/f-10?layout=1"},
 {pathway:"B",name:"Mid immersion",url:BASE+"/english/english-as-an-additional-language-eal/pathway-b-mid-immersion/curriculum/f-10?layout=1"},
 {pathway:"C",name:"Late immersion",url:BASE+"/english/english-as-an-additional-language-eal/pathway-c-late-immersion/curriculum/f-10?layout=1"},
];
const LEVELS=["AL","A1","A2","BL","B1","B2","B3","CL","C1","C2","C3","C4"];
const CODE=/\bVCEAL[A-Z]\d{3}\b/g;
function plain(s){
 return String(s).replace(/&(?:nbsp|amp|lt|gt|quot);/g,x=>({"&nbsp;":" ","&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"'})[x])
 .replace(/&#(\d+);/g,(_,v)=>String.fromCodePoint(Number(v))).replace(/\s+/g," ").trim();
}
export function extractEal(html,source){
 const noScripts=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,"");
 const lines=noScripts.replace(/<\/(?:h[1-6]|li|p|div|section|td)>/gi,"\n")
   .replace(/<[^>]+>/g," ").split("\n").map(plain);
 const rows=[],seen=new Set();
 let currentLevel=null;
 for(const line of lines){
   const m=/^Level\s+(AL|A1|A2|BL|B1|B2|B3|CL|C1|C2|C3|C4)\s+Content\s+Descriptions$/i.exec(line);
   if(m){currentLevel=m[1].toUpperCase();continue;}
   if(/^Level\s+(?:AL|A1|A2|BL|B1|B2|B3|CL|C1|C2|C3|C4)\s+(?:Description|Achievement Standards?)/i.test(line)){
     currentLevel=null;continue;
   }
   if(!currentLevel)continue;
   for(const code of line.match(CODE)||[]){
     if(seen.has(code))continue;
     seen.add(code);
     rows.push({code,learning_area:"English",subject:"English as an Additional Language",
       pathway:"Pathway "+source.pathway+" ("+source.name+")",level:currentLevel,
       framework:"Victorian Curriculum F–10 v1",identifier_kind:"vc1_eal_content_description",
       source_url:source.url,status:"official_page_extracted_pending_count_validation"});
   }
 }
 return rows;
}
async function main(){
 const all=[],issues=[],results=[];
 for(const source of EAL_SOURCES){
   try{
     const r=await fetch(source.url,{headers:{accept:"text/html","user-agent":"SideQuestCurriculumResearch/1.0"},signal:AbortSignal.timeout(30000)});
     if(!r.ok)throw Error("HTTP "+r.status);
     const html=await r.text();
     const rows=extractEal(html,source);
     const levels=[...new Set(rows.map(x=>x.level))];
     const expected=source.pathway==="A"?["A1","A2"]:source.pathway==="B"?["BL","B1","B2","B3"]:["CL","C1","C2","C3","C4"];
     const missing=expected.filter(x=>!levels.includes(x));
     results.push({pathway:source.pathway,url:source.url,count:rows.length,levels,missing_expected_levels:missing});
     if(rows.length<30||missing.length)issues.push({pathway:source.pathway,issue:"Insufficient descriptors or missing levels",missing});
     all.push(...rows);
     console.log("VC1 EAL Pathway "+source.pathway+": "+rows.length+" codes, levels "+levels.join(","));
   }catch(e){results.push({pathway:source.pathway,url:source.url,count:0});issues.push({pathway:source.pathway,issue:String(e).slice(0,220)});}
 }
 const collisions=new Map();
 for(const o of all){if(!collisions.has(o.code))collisions.set(o.code,[]);collisions.get(o.code).push(o.pathway);}
 const shared=[...collisions.entries()].filter(([,v])=>new Set(v).size>1).map(([code])=>code);
 const output={authority:"VCAA",curriculum:"Victorian Curriculum F–10 v1 EAL",extracted_at:new Date().toISOString().slice(0,10),complete:false,
   source:"https://www.vcaa.vic.edu.au/curriculum/foundation-10-version-2/victorian-curriculum-f-10-version-20",
   sources:results,issues,shared_between_pathways:shared,identifiers:all,
   summary:{total_records:all.length,unique_identifiers:collisions.size,paths_complete:results.filter(x=>x.count>=30&&!(x.missing_expected_levels||[]).length).length,problems:issues.length}
 };
 writeFileSync(fileURLToPath(new URL("../src/data/vic1-eal-review.json",import.meta.url)),JSON.stringify(output,null,2)+"\n");
 console.log("VICTORIAN v1 EAL SOURCE AUDIT "+JSON.stringify(output.summary));
 if(issues.length)console.log("Missing "+JSON.stringify(issues));
 if(all.length<80)throw Error("Incomplete Version 1 EAL source acquisition; do not import to catalogue");
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===fileURLToPath(new URL("file://"+process.argv[1])))main().catch(e=>{console.error(e);process.exitCode=1});
