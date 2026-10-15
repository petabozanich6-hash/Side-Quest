// Create the source-verified, code-only VCAA reference catalogue.
// VCAA v2 subject pages and VCAA v1 EAL pages have been imported separately.
// No descriptions copied; no code guessed; preserve all subject/pathway associations.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const file=(n)=>fileURLToPath(new URL("../src/data/"+n,import.meta.url));
const vc2=JSON.parse(readFileSync(file("vic-subject-review.json"),"utf8"));
const eal=JSON.parse(readFileSync(file("vic1-eal-review.json"),"utf8"));
if(vc2.summary?.classified_candidates!==2927||vc2.summary?.unmapped_codes!==0)throw Error("VCAA v2 source classification incomplete");
if(eal.summary?.unique_identifiers!==796||eal.summary?.problems)throw Error("VCAA v1 EAL source validation incomplete");
const rows=[],ids=new Set(),errors=[];
function canonicalStage(levels){
  const numeric=levels.map(x=>x==="Foundation"?0:Number(x)).filter(x=>Number.isInteger(x)&&x>=0&&x<=10);
  if(numeric.length)return numeric.some(x=>x===0)?"ES1":"S"+Math.ceil(Math.max(...numeric)/2);
  const special=levels.find(x=>/^FL[A-D]$/.test(x));
  return special||null;
}
const legacy2026=new Set(["Arabic","Classical Greek","Framework for Classical Languages","Hindi","Latin","Non-Roman Alphabet Languages","Roman Alphabet Languages","Turkish","Vietnamese"]);
for(const record of vc2.code_mappings){
  if(ids.has(record.code))throw Error("Duplicate VCAA v2 code: "+record.code);
  ids.add(record.code);
  const maps=record.mappings||[];
  if(!maps.length)throw Error("Missing official subject for "+record.code);
  const sources=[...new Set(maps.map(x=>x.source_url))];
  if(!sources.every(x=>x.startsWith("https://f10.vcaa.vic.edu.au/")))throw Error("Invalid official VC2 source: "+record.code);
  const subjects=[...new Set(maps.map(x=>x.subject))];
  const pathways=[...new Set(maps.map(x=>x.pathway).filter(Boolean))];
  const areas=[...new Set(maps.map(x=>x.learning_area))];
  const levels=[...new Set(maps.flatMap(x=>x.source_levels||[]))];
  const numeric=levels.map(x=>x==="Foundation"?0:Number(x)).filter(x=>Number.isInteger(x)&&x>=0&&x<=10);
  const from=numeric.length?Math.min(...numeric):null,to=numeric.length?Math.max(...numeric):null;
  if(!levels.length)errors.push("Missing level "+record.code);
  rows.push({
    code:record.code,learning_area:areas[0],learning_areas:areas,subject:subjects[0],subjects,
    pathway:pathways[0]||null,pathways,levels,from,to,stage:canonicalStage(levels),
    source:"VCAA Victorian Curriculum F–10 Version 2.0",source_url:sources[0],source_urls:sources,
    curriculum_version:"VC2",description:"",
    status:subjects.some(x=>legacy2026.has(x))?"PUBLISHED_V2_BUT_V1_APPLIES_2026":"V2_REFERENCE_SUBJECT_VERIFIED",
    shared_between_contexts:record.ambiguous_subjects===true,
  });
}
for(const e of eal.identifiers){
  if(ids.has(e.code))throw Error("VC1 EAL / VC2 identifier collision: "+e.code);
  ids.add(e.code);
  if(!/^VCEAL[A-Z]\d{3}$/.test(e.code)||!e.level||!e.source_url.startsWith("https://victoriancurriculum.vcaa.vic.edu.au/"))
    throw Error("Invalid official EAL ID "+e.code);
  rows.push({code:e.code,learning_area:"English",learning_areas:["English"],
    subject:"English as an Additional Language",subjects:["English as an Additional Language"],
    pathway:e.pathway,pathways:[e.pathway],levels:[e.level],from:null,to:null,stage:"EAL-"+e.level,
    source:"VCAA Victorian Curriculum F–10 Version 1.0 EAL",source_url:e.source_url,source_urls:[e.source_url],
    curriculum_version:"VC1-EAL",description:"",status:"V1_EAL_2026_CURRENT",
    shared_between_contexts:false,
  });
}
rows.sort((a,b)=>a.code.localeCompare(b.code));
if(errors.length)throw Error(errors.slice(0,12).join("\n"));
if(rows.length!==3723||new Set(rows.map(x=>x.code)).size!==rows.length)throw Error("VCAA assembled total unexpectedly differs");
const header=[
"// GENERATED from official VCAA F–10 v2 subject pages and 2026-current v1 EAL.",
"// The Victorian curriculum is TRANSITIONAL: Version 1 remains required for some",
"// Languages and EAL in 2026. This list is a verified-source, INCOMPLETE reference,",
"// NOT a certificate of jurisdiction-wide curriculum compliance or course availability.",
"// Only code identifiers and structural provenance, NO official descriptive wording.",
"// To refresh: worker/scripts/build-vic-reference.mjs after reviewing both source imports.",
"export type VicCurriculumIdentifier = {code:string;learning_area:string;learning_areas:string[];subject:string;subjects:string[];pathway:string|null;pathways:string[];levels:string[];from:number|null;to:number|null;stage:string|null;source:string;source_url:string;source_urls:string[];curriculum_version:string;description:string;status:string;shared_between_contexts:boolean};",
"export const VIC_SOURCE_VERIFIED_IDS: VicCurriculumIdentifier[] = "
].join("\n");
// The 3,723 object literal elements overwhelm TypeScript's union inference
// (TS2590). Encode the verified rows as a string and parse at runtime instead.
writeFileSync(file("vic-source-ids.ts"),header+
  "(() => { const sourceJson: string = "+JSON.stringify(JSON.stringify(rows))+
  "; return JSON.parse(sourceJson) as VicCurriculumIdentifier[]; })();\n");
console.log("Built VCAA source-verified code reference: "+JSON.stringify({total:rows.length,vc2:vc2.summary.classified_candidates,v1_eal:eal.summary.unique_identifiers,shared_v2:vc2.summary.ambiguous_codes,excluded_v1_phase3_current:rows.filter(x=>x.status==="PUBLISHED_V2_BUT_V1_APPLIES_2026").length,missing:errors.length}));
