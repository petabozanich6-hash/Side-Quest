// SCSA publishes Western Australian P–10 curriculum as downloadable JSON.
// Source: https://k10outline.scsa.wa.edu.au/home/resources/outline-downloads
// Extract IDENTIFIERS only. Some downloads are legacy 2017/2021 curriculum;
// some newer ones are 2025/2026. Their publication dates must remain distinct.
// This file outputs a REVIEW-ONLY catalog: never substitute old AC9 identifiers.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SOURCE = "https://k10outline.scsa.wa.edu.au/home/resources/outline-downloads";
const clean = (s) => String(s ?? "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&")
  .replace(/&#\d+;/g, " ").replace(/\s+/g, " ").trim();

export function discoverWaJson(html) {
  const start = html.search(/Western Australian Curriculum\s*-\s*JSON/i);
  if (start < 0) throw new Error("Official SCSA JSON section not found; refusing to use XLSX/legacy links");
  const tail = html.slice(start);
  const anchors = /<a\b[^>]*href=["']([^"']+\.json(?:\?[^"']*)?)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const result = new Map();
  for (const m of tail.matchAll(anchors)) {
    let url;
    try { url = new URL(m[1].replace(/&amp;/g, "&"), SOURCE); } catch { continue; }
    if (url.hostname !== "k10outline.scsa.wa.edu.au") continue;
    const name = clean(m[2]);
    if (name.length < 6 || name.length > 200) continue;
    if (!result.has(url.href)) result.set(url.href, { name, url: url.href, authority: "Western Australia SCSA" });
  }
  return [...result.values()];
}

const codeText = (value) => clean(value).replace(/^[\s(]+|[\s)]+$/g, "").trim();
export function flattenWaJson(doc, source) {
  const items = [];
  const seen = new Set();
  function add(code, year, subject, path, kind) {
    const value = codeText(code);
    if (!/^[A-Z]{2,12}[A-Za-z0-9-]{2,28}$/.test(value)) return;
    const key = [source.url,value,year].join("|");
    if (seen.has(key)) return;
    seen.add(key);
    items.push({code:value, level:String(year ?? ""), subject:String(subject ?? source.name).slice(0,180),
      source_file:source.url, source_title:source.name, identifier_kind:kind,
      path:path.slice(-5), status:"review_state_version_and_year"});
  }
  function walk(v, context={year:"",subject:source.name,path:[]}) {
    if (!v || typeof v !== "object") return;
    if (Array.isArray(v)) {for(const item of v) walk(item,context);return;}
    const year = v.nominalYearLevels?.[0] || v.educationLevels?.[0] || v.year || context.year;
    const subject = typeof v.learningArea==="string" ? v.learningArea : typeof v.subject==="string" ? v.subject : context.subject;
    const segment = typeof v.strand_name==="string" ? v.strand_name : typeof v.header==="string" ? v.header : typeof v.label==="string" ? v.label : "";
    const path = segment ? [...context.path,segment] : context.path;
    if (typeof v.wa_code === "string" && v.wa_code.trim()) add(v.wa_code,year,subject,path,"wa_content_description");
    // Older ABLEWA content-description records publish their identifiers in
    // parenthesised HTML text with an empty wa_code. Extract ONLY when the
    // textContents node itself has an empty code; never scan examples or prose
    // elsewhere in the curriculum hierarchy.
    if (v.wa_code === "" && typeof v.markdown === "string" && v.sub_strand_id != null) {
      for (const match of v.markdown.matchAll(/\((AC(?:MNA|MMG|MSP|ELA|ELY|ELT|ELD)[A-Z0-9]*[a-d])\)/g)) {
        add(match[1],year,subject,path,"wa_ablewa_content_description");
      }
    }
    // Science ABLEWA uses source-embedded ACSSU / ACSHE / ACSISO codes.
    // Only use explicit code-bearing textContents nodes with blank wa_code.
    if (v.wa_code === "" && v.sub_strand_id != null && typeof v.markdown === "string" && /Science/i.test(String(subject))) {
      for (const match of v.markdown.matchAll(/\((AC(?:SSU|SHE|SISO)\d{3}[a-d])\)/g)) {
        add(match[1],year,subject,path,"wa_ablewa_content_description");
      }
    }
    // WA ABLEWA Digital Technologies records have no wa_code: the official
    // descriptor identifier is embedded in the content's markdown instead.
    // Restrict extraction to content-description nodes with an explicitly
    // empty wa_code, and only the VCDTDS / VCDTDI / VCDTCD code families.
    if (v.wa_code === "" && v.sub_strand_id != null && typeof v.markdown === "string" && /Digital Technologies/i.test(String(subject))) {
      for (const match of v.markdown.matchAll(/\((VCDT(?:DS|DI|CD)\d{3})\)/g)) {
        add(match[1], year, subject, path, "wa_ablewa_content_description");
      }
    }
    if (Array.isArray(v.notations) && /content description/i.test(String(v.label??""))) {
      for(const code of v.notations) if(typeof code==="string") add(code,year,subject,path,"wa_content_description");
    }
    for (const [key,child] of Object.entries(v)) {
      if (key==="wa_code" || key==="notations" || key==="markdown" || key==="description" || key==="examples" || key==="rights" || key==="narrativeStatements") continue;
      if (typeof child==="object") walk(child,{year,subject,path});
    }
  }
  walk(doc);
  return items;
}

async function get(url) {
  const r = await fetch(url, { redirect:"follow", headers:{accept:"application/json,text/html", "user-agent":"SideQuestCurriculumResearch/1.0"},signal:AbortSignal.timeout(25000) });
  if(!r.ok) throw Error("HTTP "+r.status+" "+url);
  return r;
}
async function main() {
  const html = await (await get(SOURCE)).text();
  const sources = discoverWaJson(html);
  if (sources.length < 15) throw Error("Only "+sources.length+" official WA JSON curriculum files found, refusing incomplete discovery.");
  console.log("Official WA downloadable curriculum JSON sources: "+sources.length);
  const codes = [], failures=[];
  let idx=0;
  await Promise.all(Array.from({length:3},async()=>{
    while(idx<sources.length) {
      const source=sources[idx++];
      try {
        const doc=await(await get(source.url)).json();
        source.published=typeof doc?.published==="string" ? doc.published : null;
        source.rights_url=typeof doc?.rights?.licence==="string" ? doc.rights.licence : null;
        const extracted=flattenWaJson(doc,source);
        source.candidate_count=extracted.length;
        codes.push(...extracted);
        if(!extracted.length) failures.push({name:source.name,url:source.url,reason:"No content-description identifiers extracted"});
        console.log(source.name+": "+extracted.length);
      } catch(e) { source.candidate_count=0; failures.push({name:source.name,url:source.url,reason:String(e).slice(0,180)});}
    }
  }));
  codes.sort((a,b)=>(a.source_file+a.code+a.level).localeCompare(b.source_file+b.code+b.level));
  const output={authority:"SCSA Western Australian Curriculum",source_page:SOURCE,extracted_on:new Date().toISOString().slice(0,10),complete:false,
    source_files:sources,candidates:codes,failures,summary:{sources:sources.length,candidate_identifiers:codes.length,failed_or_empty_sources:failures.length}};
  writeFileSync(fileURLToPath(new URL("../src/data/wa-review-import.json",import.meta.url)),JSON.stringify(output,null,2)+"\n");
  console.log("WA SOURCE AUDIT "+JSON.stringify(output.summary));
  if (failures.length) console.log("Missing: "+JSON.stringify(failures.slice(0,20)));
  if(codes.length<100) throw Error("Insufficient official WA codes; output review only, not a valid catalogue");
}
if (process.argv[1] && fileURLToPath(import.meta.url)===fileURLToPath(new URL("file://"+process.argv[1]))) main().catch(e=>{console.error(e);process.exitCode=1;});
