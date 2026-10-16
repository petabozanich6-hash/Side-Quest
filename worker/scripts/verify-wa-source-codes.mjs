// Verify WA review identifiers against an independently acquired official SCSA JSON file.
// Usage: node worker/scripts/verify-wa-source-codes.mjs path/to/science.json worker/src/data/wa-ablewa-science-stages-a-d-review.json
// Source must be obtained directly from the URL recorded in the candidate file.
// No network fallback, inferred suffixes, or silent promotion of partial coverage.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

export function verifyWaSource(sourceDoc, review) {
  if (!review.source_url || !/^(https:\/\/k10outline\.scsa\.wa\.edu\.au\/)/.test(review.source_url))
    throw Error("Review lacks an official WA source_url");
  const occurrences = new Map();
  function walk(node, year="", subject="") {
    if (Array.isArray(node)) {for (const x of node) walk(x,year,subject); return;}
    if (!node || typeof node !== "object") return;
    const y = String(node.year ?? year), s = String(node.subject ?? subject);
    if (typeof node.wa_code === "string" && node.wa_code.trim()) {
      const code=node.wa_code.replace(/<[^>]*>/g,"").replace(/[()]/g,"").trim();
      if(code) push(code,y,s,"wa_code");
    }
    if (node.wa_code === "" && typeof node.markdown === "string" && 
        (typeof node.sub_strand_id === "number" || typeof node.sub_strand_id === "string")) {
      for(const m of node.markdown.matchAll(/\(([A-Z]{2,12}[A-Za-z0-9-]{2,28})\)/g))
        push(m[1],y,s,"description_markdown");
    }
    for(const [key,value] of Object.entries(node))
      if (!["markdown","description","examples","rights","narrativeStatements","genCaps"].includes(key))
        walk(value,y,s);
  }
  function push(code,year,subject,field) {
    const list=occurrences.get(code)||[]; list.push({year,subject,field}); occurrences.set(code,list);
  }
  walk(sourceDoc);
  const rows=review.records||[];
  const report=rows.map(r=>{
    const found=occurrences.get(r.identifier)||[];
    const expectedStage=String(r.level||"").match(/Stage ([A-D])/i)?.[1]?.toLowerCase();
    const matched=found.filter(f=>(!expectedStage||f.year===expectedStage)&&(!r.subject||f.subject===r.subject));
    return {identifier:r.identifier,level:r.level||null,matched:matched.length>0,source_occurrences:matched.length};
  });
  return {source_url:review.source_url,total:rows.length,matched:report.filter(x=>x.matched).length,
    missing:report.filter(x=>!x.matched),duplicates:report.filter(x=>x.source_occurrences>1),complete:report.every(x=>x.matched)};
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  if(process.argv.length!==4){console.error("Usage: verify-wa-source-codes.mjs <official-source.json> <review-candidates.json>");process.exit(2)}
  const source=JSON.parse(readFileSync(process.argv[2],"utf8")),review=JSON.parse(readFileSync(process.argv[3],"utf8"));
  const result=verifyWaSource(source,review);console.log(JSON.stringify(result,null,2));if(!result.complete)process.exitCode=1;
}
