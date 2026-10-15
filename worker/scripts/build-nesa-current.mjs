// Convert published NSW NESA page extraction into a CODES-ONLY current-edition subset.
// Preserves older IDs and historical evidence; does NOT claim complete NSW coverage.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const from = fileURLToPath(new URL("../src/data/nesa-review-import.json", import.meta.url));
const dest = fileURLToPath(new URL("../src/data/nesa-current-2026.ts", import.meta.url));
const source = JSON.parse(readFileSync(from, "utf8"));
const areas = {english:"English",mathematics:"Mathematics",science:"Science",
 "science-and-technology":"Science and Technology",hsie:"HSIE",
 "creative-arts":"Creative Arts",languages:"Languages",pdhpe:"PDHPE",tas:"TAS",vet:"VET"};
const stages = new Set(["ES1","S1","S2","S3","S4","S5","S6"]);
const seen = new Set(), rows = [];
for(const c of source.candidates ?? []) {
  if(c.listed_as!=="current" || !stages.has(c.stage_hint) || c.status!=="extracted_pending_completeness_check") continue;
  if(!/^https:\/\/curriculum\.nsw\.edu\.au\/learning-areas\//.test(c.official_outcomes_url)) throw Error("Non-NESA source");
  const slug=new URL(c.official_outcomes_url).pathname.split("/")[2];
  const area=areas[slug];
  if(!area) throw Error("Unrecognised NESA learning area: "+slug);
  if(!/^[A-Z][A-Z0-9]+(?:-[A-Z0-9]+){1,3}$/.test(c.code)) throw Error("Suspicious identifier: "+c.code);
  if(!Number.isInteger(c.version_year)||c.version_year<2000) throw Error("Unversioned source: "+c.code);
  if(seen.has(c.code)) throw Error("Current code duplicated in sources: "+c.code);
  seen.add(c.code);
  rows.push({code:c.code,stage:c.stage_hint,learning_area:area,
    source:"NESA: "+c.syllabus_title,source_url:c.official_outcomes_url,
    syllabus_version_year:c.version_year,description:""});
}
rows.sort((a,b)=>a.code.localeCompare(b.code));
if(rows.length<200) throw Error("Only "+rows.length+" verifiable current identifiers. Refusing partial generated subset.");
const header=[
"// GENERATED from current-listed NESA official NSW Curriculum outcomes pages.",
"// INCOMPLETE: only reachable direct outcome pages. Separate versions, senior, Life Skills",
"// and historical evidence remain preserved. Not a complete K–12 NSW catalogue.",
"// CODES and structural metadata ONLY. Do not edit. See worker/scripts/build-nesa-current.mjs.",
"export type NesaCurrentCode = {code:string;stage:string;learning_area:string;source:string;source_url:string;syllabus_version_year:number;description:string};",
"export const NESA_2026_DIRECT_OUTCOME_CODES: NesaCurrentCode[] = "
].join("\n");
writeFileSync(dest,header+JSON.stringify(rows,null,2)+";\n");
console.log("Prepared "+rows.length+" official current NSW codes across "+new Set(rows.map(x=>x.source)).size+" published syllabus versions; PARTIAL coverage only.");
