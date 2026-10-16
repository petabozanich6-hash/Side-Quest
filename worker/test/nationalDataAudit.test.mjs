import {test} from 'node:test';
import assert from 'node:assert/strict';
import {auditNationalData} from '../scripts/audit-national-collected-data.mjs';
test('national audit includes partial reviews and all eight jurisdictions without certifying coverage',()=>{
 const report=auditNationalData();
 assert.equal(Object.keys(report.jurisdictions).length,8);
 assert.equal(report.complete,false);
 assert.equal(report.authority_source_validation_run,false);
 assert.ok(report.jurisdictions.WA.dataset_files.some(x=>x.file==='wa-wace-2026-vet-table13-review.json'));
 assert.ok(report.jurisdictions.NSW.dataset_files.some(x=>x.file==='nsw-2025-geography-history-electives-official-outcomes.json'));
 for(const state of Object.values(report.jurisdictions))assert.equal(state.status,'INCOMPLETE');
});
test('course, subject and EAL containers are counted without calling them verified outcomes',()=>{
 const report=auditNationalData();
 for(const [jurisdiction,file,expected] of [['ACT','act-bsss-2026-courses-review.json',113],['SA','sace-2026-subject-review.json',427],['VIC','vic1-eal-review.json',796]]){
  const dataset=report.jurisdictions[jurisdiction].dataset_files.find(x=>x.file===file);
  assert.equal(dataset.records,expected);assert.equal(dataset.verified_identifiers,null);
 }
});
