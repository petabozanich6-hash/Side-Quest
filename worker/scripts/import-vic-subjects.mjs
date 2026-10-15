// Map Victorian Version 2.0 codes to genuine official VCAA subject pages.
// This is review-only until per-subject, level/band and edition coverage is
// verified. Many Languages and EAL still use VC1 in 2026; do not fabricate VC2.
// The bulk VCAA level-code inventory must already have been generated.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { extractVicIds } from "./import-vic-review.mjs";
const BASE="https://f10.vcaa.vic.edu.au";
const slug=(s)=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const list=[
  ["English","English","/learning-areas/english/english/curriculum"],
  ["Mathematics","Mathematics","/learning-areas/mathematics/curriculum"],
  ["Science","Science","/learning-areas/science/curriculum"],
  ["Health and Physical Education","Health and Physical Education","/learning-areas/health-and-physical-education/curriculum"],
  ...["Dance","Drama","Media Arts","Music","Visual Arts","Visual Communication Design"].map(s=>["The Arts",s,"/learning-areas/the-arts/"+slug(s)+"/curriculum"]),
  ...["Civics and Citizenship","Economics and Business","Geography","History"].map(s=>["Humanities",s,"/learning-areas/humanities/"+slug(s)+"/curriculum"]),
  ...["Design and Technologies","Digital Technologies"].map(s=>["Technologies",s,"/learning-areas/technologies/"+slug(s)+"/curriculum"]),
  ...["Critical and Creative Thinking","Ethical Capability","Intercultural Capability","Personal and Social Capability"].map(s=>["Capabilities",s,"/capabilities/"+slug(s)+"/curriculum"]),
];
const languages=["Arabic","Chinese","Classical Greek","Framework for Classical Languages","French","German","Hindi","Indonesian","Italian","Japanese","Korean","Latin","Modern Greek","Non-Roman Alphabet Languages","Roman Alphabet Languages","Spanish","Turkish","Vietnamese"];
for(const name of languages){
  const prefix="/learning-areas/languages/"+slug(name);
  if(name==="Chinese") {
    list.push(["Languages",name,prefix+"/second-language-learner-f-10-sequence","F–10 second-language learner"]);
    list.push(["Languages",name,prefix+"/second-language-learner-7-10-sequence","7–10 second-language learner"]);
    continue;
  }
  if(["Classical Greek","Framework for Classical Languages","Latin"].includes(name))
    list.push(["Languages",name,prefix+"/curriculum","classical"]);
  else{
    list.push(["Languages",name,prefix+"/curriculum-f-10-sequence","F–10"]);
    list.push(["Languages",name,prefix+"/curriculum-7-10-sequence","7–10"]);
  }
}
export const VIC_SUBJECT_SOURCES=list.map(([learning_area,subject,path,pathway])=>({learning_area,subject,url:BASE+path,pathway:pathway||null}));

async function get(url){
  const r=await fetch(url,{headers:{accept:"text/html","user-agent":"SideQuestCurriculumResearch/1.0"},signal:AbortSignal.timeout(25000)});
  if(!r.ok)throw Error("HTTP "+r.status+" "+url);
  return await r.text();
}
async function main(){
  const known = new Map(JSON.parse(readFileSync(fileURLToPath(new URL("../src/data/vic-review-import.json",import.meta.url)),"utf8")).candidates.map(x=>[x.code,x]));
  const failures=[],results=[],assigned=new Map();
  let i=0;
  await Promise.all(Array.from({length:4},async()=>{
    while(i<VIC_SUBJECT_SOURCES.length){
      const src=VIC_SUBJECT_SOURCES[i++];
      try{
        const html=await get(src.url);
        const codes=extractVicIds(html,src.url,src.subject);
        const officialCodes=codes.filter(x=>known.has(x.code));
        src.candidate_count=officialCodes.length;
        src.unrecognized_codes=codes.length-officialCodes.length;
        results.push({ ...src, content_bytes:html.length });
        for(const row of officialCodes){
          const levelRecord=known.get(row.code);
          const mapping={code:row.code,learning_area:src.learning_area,subject:src.subject,pathway:src.pathway,
            source_url:src.url,identifier_kind:"vc2_content_description_candidate",
            source_levels:levelRecord.source_levels,
            status:"direct_subject_page_candidate_not_full_coverage_certified"};
          if(!assigned.has(row.code))assigned.set(row.code,[]);
          assigned.get(row.code).push(mapping);
        }
        console.log("VCAA "+src.subject+" / "+(src.pathway||"standard")+": "+officialCodes.length+" candidates");
        if(!officialCodes.length)failures.push({subject:src.subject,pathway:src.pathway,url:src.url,error:"No overlapping official level-page identifiers"});
      }catch(e){failures.push({subject:src.subject,pathway:src.pathway,url:src.url,error:String(e).slice(0,200)});}
    }
  }));
  const codes=[...assigned.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([code,mappings])=>({code,mappings,ambiguous_subjects:new Set(mappings.map(m=>m.subject+"|"+m.pathway)).size>1}));
  const ambiguous=codes.filter(c=>c.ambiguous_subjects);
  const unmapped=[...known.keys()].filter(code=>!assigned.has(code)).sort();
  const out={authority:"VCAA",framework:"Victorian Curriculum F–10 Version 2.0",fetched_at:new Date().toISOString().slice(0,10),
    complete:false,source_pages:results,failed_sources:failures,code_mappings:codes,
    ambiguous_codes:ambiguous.map(x=>x.code),unmapped_code_ids:unmapped,
    summary:{official_subject_routes:VIC_SUBJECT_SOURCES.length,successful_routes:results.length,failed_or_empty_routes:failures.length,
      distinct_codes_on_level_pages:known.size,classified_candidates:codes.length,ambiguous_codes:ambiguous.length,unmapped_codes:unmapped.length}};
  const output=fileURLToPath(new URL("../src/data/vic-subject-review.json",import.meta.url));
  writeFileSync(output,JSON.stringify(out,null,2)+"\n");
  console.log("VCAA SOURCE CLASSIFICATION "+JSON.stringify(out.summary));
  if(failures.length)console.log("Missing sources "+JSON.stringify(failures.slice(0,25)));
  if(codes.length<100)throw Error("VCAA subject code classification too thin; refuse state import");
  console.log("Review-only classification; still requires VC1 legacy subjects, version/year validation and senior electives.");
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===fileURLToPath(new URL("file://"+process.argv[1])))main().catch(e=>{console.error(e);process.exitCode=1});
