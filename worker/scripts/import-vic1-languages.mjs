// Source inventory for 2026 applicable Victorian Curriculum v1 Languages.
// VCAA explicitly retains v1 for Phase 3 & Phase 4 Languages throughout 2026.
// Do NOT use published v2 identifiers for these student programs prematurely.
// These are *candidate* content-description identifiers until per-band checks.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const BASE="https://victoriancurriculum.vcaa.vic.edu.au";
const phase3=["Arabic","Classical Greek","Framework for Classical Languages","Hindi","Latin",
 "Non-Roman Alphabet Languages","Roman Alphabet Languages","Turkish","Vietnamese"];
const phase4=["Auslan","Chinese","Victorian Aboriginal Languages"];
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const items=[];
for(const name of phase3){
  // The old VCAA /curriculum/f-10 view renders BOTH F–10 and 7–10
  // sequences on one page, including Classical Greek and Latin (7–10 only).
  items.push({language:name,phase:3,sequence:"mixed",learner_pathway:null,
    url:BASE+"/languages/"+slug(name)+"/curriculum/f-10?layout=1",
    kind:"vc1_languages_code_candidate"});
}
for(const learner of ["first-language-learner","second-language-learner"])
  items.push({language:"Auslan",phase:4,sequence:"mixed",learner_pathway:learner,
    url:BASE+"/languages/auslan/"+learner+"/curriculum/f-10?layout=1",
    kind:"vc1_languages_code_candidate"});
for(const learner of ["background-language-learner","first-language-learner"])
  items.push({language:"Chinese",phase:4,sequence:"mixed",learner_pathway:learner,
    url:BASE+"/languages/chinese/"+learner+"/curriculum/f-10?layout=1",
    kind:"vc1_languages_code_candidate"});
items.push({language:"Victorian Aboriginal Languages",phase:4,sequence:"mixed",learner_pathway:null,
  url:BASE+"/languages/victorian-aboriginal-languages/curriculum/f-10?layout=1",
  kind:"vc1_languages_code_candidate"});
export const SOURCES=items;
const CODE=/\bVC[A-Z]{2,9}\d{2,4}\b/g;
function clean(s){return String(s).replace(/&amp;/g,"&").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}
export function extractLegacyCodes(html,source){
  const body=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,"");
  const sections=body.replace(/<\/(?:h[1-6]|p|li|div|section|td)>/gi,"\n")
    .replace(/<[^>]+>/g," ").split(/\n/).map(clean);
  const map=new Map();
  let band=null, sequence="unresolved";
  for(const line of sections){
    // VCAA v1 presents F–10 and 7–10 pathways on the same HTML page. A heading
    // changes the active sequence; otherwise codes would all remain "unresolved".
    // Only read explicit sequence headings, never infer them from a code suffix.
    const seq = /(?:^|\s)(F\s*[–-]\s*10|7\s*[–-]\s*10)\s+Sequence\b/i.exec(line);
    if(seq){sequence = seq[1].replace(/\s/g,"").replace(/-/g,"–").toUpperCase(); band=null;}
    const matches=[...line.matchAll(/(?:Foundation\s+to\s+Level\s*2|Levels?\s*(?:3\s+and\s+4|5\s+and\s+6|7\s+and\s+8|9\s+and\s+10|7\s+to\s+10))\s+Content\s+Descriptions/gi)];
    if(matches.length)band=matches[0][0].replace(/\s+Content\s+Descriptions$/i,"");
    else if(/^.*Achievement\s+standards?\s*$/i.test(line))band=null;
    for(const code of line.match(CODE)||[]){
      const val={code,learning_area:"Languages",subject:source.language,
        source_url:source.url,phase:source.phase,sequence,learner_pathway:source.learner_pathway,
        version:"VC1",band_hint:band,kind:"vc1_content_description_candidate",
        status:sequence==="unresolved"?"sequence_unresolved_review":"direct_official_page_candidate_not_count_verified"};
      if(!map.has(code))map.set(code,val);
      else if(!map.get(code).band_hint && band)map.get(code).band_hint=band;
    }
  }
  return [...map.values()].sort((a,b)=>a.code.localeCompare(b.code));
}
async function download(url){
  const r=await fetch(url,{redirect:"follow",headers:{accept:"text/html","user-agent":"SideQuestCurriculumResearch/1.0"},signal:AbortSignal.timeout(28000)});
  if(!r.ok)throw Error("HTTP "+r.status+" "+url);
  return await r.text();
}
async function main(){
  const results=[],errors=[],all=[];
  let next=0;
  await Promise.all(Array.from({length:3},async()=>{
    while(next<SOURCES.length){
      const src=SOURCES[next++];
      try{
        const html=await download(src.url);
        const rows=extractLegacyCodes(html,src);
        all.push(...rows);
        results.push({...src,code_count:rows.length});
        if(rows.length<10)errors.push({...src,issue:"Insufficient published codes (<10)"});
        console.log("Victorian v1 "+src.language+" "+src.sequence+": "+rows.length+" source candidates");
      }catch(e){
        results.push({...src,code_count:0});
        errors.push({...src,issue:String(e).slice(0,180)});
      }
    }
  }));
  const byCode=new Map();
  for(const rec of all){if(!byCode.has(rec.code))byCode.set(rec.code,[]);byCode.get(rec.code).push(rec)}
  const out={authority:"VCAA",source:"https://www.vcaa.vic.edu.au/curriculum/foundation-10-version-2/victorian-curriculum-f-10-version-20",
    extracted_on:new Date().toISOString().slice(0,10),complete:false,
    note:"2026 v1 Phase3/4 language curriculum candidates. Not published to the tracker until pathways and band count verified.",
    records:all.sort((a,b)=>a.code.localeCompare(b.code)),source_results:results,failures:errors,
    shared_code_ids:[...byCode].filter(([,v])=>v.length>1).map(([id])=>id),
    summary:{target_pages:SOURCES.length,pages_with_codes:results.filter(x=>x.code_count>0).length,total_source_records:all.length,
      unique_codes:byCode.size,failed_or_thin_pages:errors.length}};
  writeFileSync(fileURLToPath(new URL("../src/data/vic1-languages-review.json",import.meta.url)),JSON.stringify(out,null,2)+"\n");
  console.log("VIC 2026 VC1 LANGUAGES "+JSON.stringify(out.summary));
  if(errors.length)console.log("Unavailable source pages "+JSON.stringify(errors.slice(0,20)));
  if(all.length<250)throw Error("Too few official VC1 identifiers found; do not import a falsely complete Languages catalogue");
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===fileURLToPath(new URL("file://"+process.argv[1])))main().catch(e=>{console.error(e);process.exitCode=1});
