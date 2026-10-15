// Export checked-in, authority-backed identifiers to a single raw NDJSON file.
// No UI mapping, no generated/fabricated codes, no network access.
// Usage: node worker/scripts/export-raw-australian-codes.mjs > australian-curriculum-codes.ndjson
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../src/data/', import.meta.url));
function json(name){return JSON.parse(readFileSync(root+name,'utf8'));}
function tsArray(name,decl){
  const text=readFileSync(root+name,'utf8');
  const marker='export const '+decl;
  const at=text.indexOf(marker);
  if(at<0) throw Error('Missing '+marker);
  const eq=text.indexOf('=',at), start=text.indexOf('[',eq);
  // Generated TypeScript files contain JSON arrays; do not eval source.
  const end=text.indexOf('];',start);
  if(start<0||end<0) throw Error('Unrecognised generated array: '+name);
  return JSON.parse(text.slice(start,end+1));
}
const datasets=[
  {name:'ac9-outcomes.ts',decl:'AC9_OUTCOMES',authority:'ACARA',kind:'content_description',jurisdictions:['NSW','VIC','QLD','WA','SA','TAS','ACT','NT'],status:'verified_national_reference_not_automatically_state_adopted'},
  {name:'vic-source-ids.ts',decl:'VIC_SOURCE_VERIFIED_IDS',authority:'VCAA',kind:'content_description',jurisdictions:['VIC'],status:'verified_partial_versioned_reference'},
  {name:'nesa-current-2026.ts',decl:'NESA_2026_DIRECT_OUTCOME_CODES',authority:'NESA',kind:'syllabus_outcome',jurisdictions:['NSW'],status:'verified_partial_current_list'},
  {name:'tasc-2026-course-codes.json',field:'courses',authority:'TASC',kind:'senior_course_code',jurisdictions:['TAS'],status:'verified_current_2026_accredited_course_list'},
  {name:'sace-2026-subject-review.json',field:'subject_codes',authority:'SACE',kind:'senior_subject_code',jurisdictions:['SA','NT'],status:'verified_partial_subject_table'},
];
let total=0;
for(const d of datasets){
  const rows=d.decl?tsArray(d.name,d.decl):json(d.name)[d.field];
  if(!Array.isArray(rows)) throw Error('Missing entries: '+d.name);
  for(const row of rows){
    const code=row.code;
    if(typeof code!=='string'||!code.trim()) throw Error('Blank code in '+d.name);
    const source_url=row.source_url||row.official_url||row.url||null;
    const output={
      code,authority:d.authority,identifier_kind:d.kind,
      applicable_jurisdictions:d.jurisdictions,
      verification_status:d.status,
      source_file:d.name,source_url,
      ...row,
      // Preserve the exported record's explicit kind; do not let source rows override it.
      identifier_kind:d.kind,
    };
    process.stdout.write(JSON.stringify(output)+'\n');
    total++;
  }
}
console.error('Exported '+total+' raw records. Catalogue remains incomplete across jurisdictions and senior pathways; do not call this output exhaustive.');
