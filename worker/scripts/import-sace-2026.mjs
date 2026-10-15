// South Australia SACE/NT NTCET senior SUBJECT identifiers, not outcome codes.
// Verify codes directly in the official SACE Board "Subject codes" tables.
// Include Modified Subjects, languages, 10/20-credit and Stage 1/2 variants.
// Source: https://www.sace.sa.edu.au/teaching/subjects
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
export const SUBJECT_INDEX="https://www.sace.sa.edu.au/teaching/subjects";
const ORIGIN="https://www.sace.sa.edu.au";
const clean=(s)=>String(s??"").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"")
  .replace(/<[^>]+>/g," ").replace(/&(?:amp|nbsp|lt|gt|quot);/g,m=>({"&amp;":"&","&nbsp;":" ","&lt;":"<","&gt;":">","&quot;":'"'})[m])
  .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/\s+/g," ").trim();
const OFFICIAL_CODE=/^[12][A-Z0-9]{3}(?:05|10|20)$/;

export function discoverSaceSubjectPages(html){
  const anchors=/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const subjects=new Map();
  for (const a of html.matchAll(anchors)){
    let url;try{url=new URL(a[1].replace(/&amp;/g,"&"),SUBJECT_INDEX)}catch{continue}
    if(!["www.sace.sa.edu.au","sace.sa.edu.au"].includes(url.hostname))continue;
    const match=/^\/(?:en-US\/)?web\/([a-z0-9-]+)(?:\/overview)?\/?$/i.exec(url.pathname);
    if(!match)continue;
    const name=clean(a[2]);
    if(!name || name.length>100 || /^(?:overview|subject codes|resources|assessment|dates|notices|teaching|studying|syllabus)$/i.test(name))continue;
    const key=ORIGIN+"/web/"+match[1].toLowerCase();
    if(!subjects.has(key))subjects.set(key,{name,official_url:key,status:"official_subject_listing"});
  }
  return [...subjects.values()].sort((a,b)=>a.name.localeCompare(b.name));
}

export function extractSaceSubjectCodes(html,page){
  const rows=[];
  if(!/Subject\s+codes/i.test(clean(html)))return rows;
  const tr=/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  const td=/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;
  for(const m of html.matchAll(tr)){
    const values=[...m[1].matchAll(td)].map(x=>clean(x[1])).filter(Boolean);
    if(values.length<2 || values.length>5)continue;
    const code=values.at(-1).toUpperCase().replace(/\s/g,"");
    if(!OFFICIAL_CODE.test(code))continue;
    const credits=Number(code.slice(-2));
    const maybeCredits=values.at(-2);
    if(!/^\d{1,2}$/.test(maybeCredits) || Number(maybeCredits)!==credits)continue;
    const subject=values.length>=3 ? values.slice(0,-2).join(" ") : page.name;
    rows.push({
      code,subject,stage:Number(code[0]),credits,
      identifier_kind:"senior_subject_code",authority:"SACE Board of South Australia",
      source_url:page.official_url,jurisdictions:["SA","NT"],
      syllabus_variant:/Modified/i.test(subject)?"modified":null,
      status:"official_subject_codes_table",
    });
  }
  return rows;
}
async function get(url){
  const r=await fetch(url,{headers:{accept:"text/html","user-agent":"SideQuestCurriculumResearch/1.0"},signal:AbortSignal.timeout(23000)});
  if(!r.ok)throw Error("HTTP "+r.status+" "+url);
  const html=await r.text();
  if(html.length<700)throw Error("Unexpectedly short "+url);
  return html;
}
async function main(){
  const index=await get(SUBJECT_INDEX);
  const sources=discoverSaceSubjectPages(index);
  if(sources.length<60)throw Error("Only "+sources.length+" SACE subject links, catalogue discovery incomplete");
  const failures=[],raw=[];let next=0;
  await Promise.all(Array.from({length:4},async()=>{
    while(next<sources.length){
      const source=sources[next++];
      try{
        const items=extractSaceSubjectCodes(await get(source.official_url),source);
        source.code_count=items.length;raw.push(...items);
        if(!items.length)failures.push({name:source.name,url:source.official_url,reason:"No authoritative code table parsed"});
      }catch(e){source.code_count=0;failures.push({name:source.name,url:source.official_url,reason:String(e).slice(0,180)})}
    }
  }));
  const out=new Map(),conflicts=[];
  for(const row of raw){
    if(!out.has(row.code))out.set(row.code,{...row,source_urls:[row.source_url]});
    else{
      const current=out.get(row.code);
      if(current.stage!==row.stage || current.credits!==row.credits)conflicts.push({code:row.code,reason:"Conflicting stage/credit values"});
      if(!current.source_urls.includes(row.source_url))current.source_urls.push(row.source_url);
    }
  }
  const codes=[...out.values()].sort((a,b)=>a.code.localeCompare(b.code));
  const report={authority:"SACE Board",official_index:SUBJECT_INDEX,extracted_at:new Date().toISOString().slice(0,10),
    complete:false,note:"Stage 1/2 subject identifiers shared with NTCET. Not individual curriculum outcome codes. Some national continuers and VET offerings require separate verification.",
    source_subjects:sources,subject_codes:codes,failures,conflicts,
    summary:{listed_subject_pages:sources.length,pages_with_codes:sources.filter(x=>x.code_count>0).length,
      distinct_subject_codes:codes.length,modified_codes:codes.filter(x=>x.syllabus_variant==="modified").length,
      stage1:codes.filter(x=>x.stage===1).length,stage2:codes.filter(x=>x.stage===2).length,
      failed_or_code_less_pages:failures.length}};
  writeFileSync(fileURLToPath(new URL("../src/data/sace-2026-subject-review.json",import.meta.url)),JSON.stringify(report,null,2)+"\n");
  console.log("SACE AUTHORITY CODE AUDIT "+JSON.stringify(report.summary));
  if(failures.length)console.log("SACE GAPS "+JSON.stringify(failures.slice(0,24)));
  if(codes.length<100 || conflicts.length)throw Error("Insufficient distinct authoritative SACE subject codes or code conflicts; review only");
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===fileURLToPath(new URL("file://"+process.argv[1])))main().catch(e=>{console.error(e);process.exitCode=1});
