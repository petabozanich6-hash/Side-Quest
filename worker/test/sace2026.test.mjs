import { test } from "node:test";
import assert from "node:assert/strict";
import { discoverSaceSubjectPages, extractSaceSubjectCodes } from "../scripts/import-sace-2026.mjs";

test("Discover official SACE subject and language elective pages",()=>{
  const html='<a href="/web/biology">Biology</a><a href="https://www.sace.sa.edu.au/web/modified-subjects">Modified Subjects</a>'+
   '<a href="/web/chinese-continuers">Chinese (continuers)</a><a href="/teaching/subjects">Subjects</a><a href="https://example.org/web/fake">Fake</a>';
  assert.deepEqual(discoverSaceSubjectPages(html).map(x=>x.name),["Biology","Chinese (continuers)","Modified Subjects"]);
});

test("SACE Stage 1 and 2 codes retain 10/20 credit variants and source provenance",()=>{
  const page={name:"Biology",official_url:"https://www.sace.sa.edu.au/web/biology"};
  const html='<h2>Subject codes</h2><h3>Stage 1</h3><table><tr><th>Credits</th><th>Code</th></tr>'+
   '<tr><td>10</td><td>1BGY10</td></tr><tr><td>20</td><td>1BGY20</td></tr></table>'+
   '<h3>Stage 2</h3><table><tr><td>20</td><td>2BGY20</td></tr></table>';
  const rows=extractSaceSubjectCodes(html,page);
  assert.deepEqual(rows.map(x=>x.code),["1BGY10","1BGY20","2BGY20"]);
  assert.deepEqual(rows.map(x=>x.stage),[1,1,2]);
  assert.ok(rows.every(x=>x.subject==="Biology"&&x.identifier_kind==="senior_subject_code"));
  assert.ok(rows.every(x=>x.jurisdictions.includes("NT")));
});

test("SACE sub-subject and modified course variants retain official labels",()=>{
  const page={name:"Modified Subjects",official_url:"https://www.sace.sa.edu.au/web/modified-subjects"};
  const html='<h2>Subject codes</h2><table><tr><th>Subject</th><th>Credits</th><th>Code</th></tr>'+
    '<tr><td>English: Modified</td><td>20</td><td>1EPM20</td></tr>'+
    '<tr><td>Creative Arts A: Modified</td><td>10</td><td>2CEA10</td></tr></table>';
  const rows=extractSaceSubjectCodes(html,page);
  assert.deepEqual(rows.map(x=>x.subject),["English: Modified","Creative Arts A: Modified"]);
  assert.deepEqual(rows.map(x=>x.syllabus_variant),["modified","modified"]);
});
