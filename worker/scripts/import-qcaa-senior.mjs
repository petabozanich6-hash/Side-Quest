// Source-linked Queensland QCE 11–12 subject and syllabus-edition inventory.
// QCAA's official A–Z index covers General, Applied and Short Courses.
// A subject/course title or URL slug is NOT an official numbered outcome code.
// This importer deliberately leaves code=null unless QCAA explicitly publishes one.
// Includes all electives and extension subjects listed by QCAA.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
export const INDEX = "https://www.qcaa.qld.edu.au/senior/senior-subjects/syllabuses";
const origin = "https://www.qcaa.qld.edu.au";
function clean(s) {
  return String(s??"").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&")
    .replace(/&#(\d+);/g,(_,d)=>String.fromCodePoint(Number(d)))
    .replace(/\s+/g," ").trim();
}
const forbidTitle=/^(?:General|Applied|Short Course|Syllabuses?|About|English|HPE|HASS|Languages|Mathematics|Sciences|Technologies|The Arts|Show All|Download|Back to top)$/i;
export function extractQceSyllabuses(html,base=INDEX) {
  const out=new Map();
  const anchors=/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for(const match of html.matchAll(anchors)){
    let u;try{u=new URL(match[1].replace(/&amp;/g,"&"),base)}catch{continue}
    if(u.origin!==origin)continue;
    if(!u.pathname.startsWith("/senior/senior-subjects/syllabuses/"))continue;
    // Area slug + subject slug, e.g. .../languages/chinese-extension.
    const parts=u.pathname.slice(INDEX.replace(origin,"").length+1).split("/").filter(Boolean);
    if(parts.length!==2 || /^(index|about|resources|syllabus)/i.test(parts[0]))continue;
    const title=clean(match[2]);
    if(!title || title.length>120 || forbidTitle.test(title))continue;
    const key=u.origin+u.pathname;
    if(!out.has(key))out.set(key,{subject:title,learning_area_slug:parts[0],official_subject_url:key,
      syllabus_type:null,official_subject_code:null,syllabus_editions:[],status:"official_listing_review"});
  }
  return [...out.values()].sort((a,b)=>a.subject.localeCompare(b.subject));
}
export function extractQceEdition(html){
  const plain=clean(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,""));
  const heading=/^.{0,120}?\b(General|Applied|Short Course)\s+senior syllabus\b/i.exec(plain);
  const category=heading?.[1]||null;
  const editions=[];
  const m=plain.matchAll(/(?:General|Applied|Short Course)\s+senior syllabus\s+(20\d{2})/ig);
  for(const x of m){const year=Number(x[1]);if(!editions.includes(year))editions.push(year)}
  const latest=editions.length?Math.max(...editions):null;
  return {syllabus_type:category,editions:editions.sort((a,b)=>b-a),latest};
}
async function get(url){
  const r=await fetch(url,{headers:{accept:"text/html","user-agent":"SideQuestCurriculumResearch/1.0"},signal:AbortSignal.timeout(20000)});
  if(!r.ok)throw Error("HTTP "+r.status+" "+url);
  const html=await r.text();
  if(html.length<500)throw Error("Short response "+url);
  return html;
}
async function main(){
  const html=await get(INDEX);
  const subjects=extractQceSyllabuses(html);
  if(subjects.length<65)throw Error("Only "+subjects.length+" Queensland syllabus links found; refuse incomplete index");
  let next=0;const failures=[];
  await Promise.all(Array.from({length:4},async()=>{
    while(next<subjects.length){
      const c=subjects[next++];
      try{
        const info=extractQceEdition(await get(c.official_subject_url));
        c.syllabus_type=info.syllabus_type;
        c.syllabus_editions=info.editions;
        c.latest_syllabus_year=info.latest;
        if(!info.editions.length || !info.syllabus_type) failures.push({subject:c.subject,url:c.official_subject_url,error:"Syllabus type or year not found"});
      }catch(e){failures.push({subject:c.subject,url:c.official_subject_url,error:String(e).slice(0,160)})}
    }
  }));
  const category=Object.fromEntries(["General","Applied","Short Course",null].map(k=>[k||"unclassified",subjects.filter(x=>x.syllabus_type===k).length]));
  const out={authority:"Queensland Curriculum and Assessment Authority (QCAA)",source_url:INDEX,
    extracted_on:new Date().toISOString().slice(0,10),complete:false,
    record_kind:"senior_syllabus_subject_listing (NOT outcome codes)",subjects,failures,
    summary:{listed_subjects:subjects.length,by_syllabus_type:category,subjects_without_complete_editions:failures.length,generated_codes:0}};
  writeFileSync(fileURLToPath(new URL("../src/data/qcaa-senior-review.json",import.meta.url)),JSON.stringify(out,null,2)+"\n");
  console.log("QCAA SENIOR SOURCE INVENTORY "+JSON.stringify(out.summary));
  if(failures.length)console.log("Missing source/year "+JSON.stringify(failures.slice(0,14)));
  if(failures.length===subjects.length)throw Error("No QCAA syllabus editions recognized; leave as review only");
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===fileURLToPath(new URL("file://"+process.argv[1])))main().catch(e=>{console.error(e);process.exitCode=1});
