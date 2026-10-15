// Official Tasmania TASC Year 11–12 CURRENT YEAR course codes and electives.
// TASC course IDs (e.g. ACC315116) are COURSE identifiers, not learning outcomes.
// Source list is year-sensitive: never silently mix 2026 with 2027 accreditation.
// https://www.tasc.tas.gov.au/students/courses/a-z/
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const TASC_INDEX = "https://www.tasc.tas.gov.au/students/courses/a-z/";
const ROOT = "https://www.tasc.tas.gov.au";
const ID = /\b[A-Z]{2,4}\d{6}\b/g;
const plain=(text)=>String(text ?? "")
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,"")
  .replace(/<[^>]+>/g," ")
  .replace(/&(?:nbsp|amp|lt|gt|quot);/g,v=>({"&nbsp;":" ","&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"'})[v])
  .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)))
  .replace(/\s+/g," ").trim();

export function extractTasc2026(html, index=TASC_INDEX) {
  const heading=plain(html);
  const declared=Number(/(\d{2,3})\s+courses\b/i.exec(heading)?.[1] ?? NaN);
  const match=/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const out=new Map(),errors=[];
  for (const a of html.matchAll(match)){
    let url;
    try {url=new URL(a[1].replace(/&amp;/g,"&"),index);}catch{continue;}
    if(url.origin!==ROOT || !url.pathname.startsWith("/students/courses/") || url.pathname==="/students/courses/a-z/")continue;
    const label=plain(a[2]);
    if(!label || label.length>500)continue;
    // The 2026 list's course-card link contains name, TCE points,
    // Level and an authority ID. Require all three, not nearby navigation.
    const codes=[...new Set(label.match(ID)||[])];
    if(!codes.length)continue;
    const points=/(?:^|\s)(\d{1,2})\s+TCE\s+credit\s+points/i.exec(label);
    const level=/Level\s*:\s*(Pre|[1-4])\b/i.exec(label);
    if(!points || !level){errors.push({url:url.href,problem:"Course label lacks TCE points or level"});continue;}
    const courseId=codes.at(-1);
    const title=label.slice(0,points.index).trim();
    if(!title || title.length>140){errors.push({url:url.href,problem:"Invalid course label",courseId});continue;}
    const pathId=/\/([a-z]{2,4}\d{6})(?:-\d+)?\/?$/i.exec(url.pathname)?.[1]?.toUpperCase();
    if(pathId && pathId!==courseId){errors.push({url:url.href,problem:"Link/label course-code mismatch",courseId,pathId});continue;}
    const row={code:courseId,title,authority:"TASC",framework:"TASC accredited senior-secondary course",
      identifier_kind:"senior_course_code",level:level[1],tce_credit_points:Number(points[1]),
      jurisdiction:"TAS",school_stage:"S6",source_url:url.href,index_url:index,
      applicable_year:2026,verification_status:"published_current_year_list"};
    if(out.has(courseId)){
      const existing=out.get(courseId);
      if(existing.title!==title || existing.level!==row.level)errors.push({courseId,problem:"Duplicate code with different course attributes"});
    }else out.set(courseId,row);
  }
  return {declared_current_year_count:Number.isFinite(declared)?declared:null,courses:[...out.values()].sort((a,b)=>a.code.localeCompare(b.code)),errors};
}

async function main(){
  const r=await fetch(TASC_INDEX,{headers:{accept:"text/html","user-agent":"SideQuestCurriculumResearch/1.0 (authoritative code list verification)"},signal:AbortSignal.timeout(30000)});
  if(!r.ok)throw Error("TASC current-year course index: HTTP "+r.status);
  const html=await r.text();
  const {declared_current_year_count,courses,errors}=extractTasc2026(html);
  const result={source:TASC_INDEX,authority:"TASC",queried_at:new Date().toISOString().slice(0,10),
    applies_to:"current 2026 school year",identifier_kind:"senior_course_code",
    complete:errors.length===0 && courses.length===declared_current_year_count,
    summary:{declared:declared_current_year_count,verified_course_codes:courses.length,errors:errors.length,
      by_level:Object.fromEntries(["Pre","1","2","3","4"].map(k=>[k,courses.filter(x=>x.level===k).length]))},
    courses,errors};
  writeFileSync(fileURLToPath(new URL("../src/data/tasc-2026-course-codes.json",import.meta.url)),JSON.stringify(result,null,2)+"\n");
  console.log("TASC OFFICIAL 2026 COURSE CODE AUDIT "+JSON.stringify(result.summary));
  if(declared_current_year_count!==164 || courses.length!==declared_current_year_count || errors.length)
    throw Error("TASC catalogue count differs from official 2026 list; leave as review only");
  console.log("Every code is verified as a course identifier. These are not outcome or content-description codes.");
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===fileURLToPath(new URL("file://"+process.argv[1]))) main().catch(e=>{console.error(e);process.exitCode=1});
