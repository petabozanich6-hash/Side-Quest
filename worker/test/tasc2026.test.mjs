import { test } from "node:test";
import assert from "node:assert/strict";
import { extractTasc2026 } from "../scripts/import-tasc-2026.mjs";

test("TASC current-year catalogue retains course IDs, credits, all levels and sources",()=>{
  const html = '<h1>164 courses</h1>' +
    '<a href="/students/courses/humanities-and-social-sciences/acc315116-9/">Accounting 15 TCE credit points Level: 3 The course includes achievement of: Mathematics standard . ACC315116</a>' +
    '<a href="/students/courses/technologies/itc315118/">Computer Science 15 TCE credit points Level: 3 ITC315118</a>' +
    '<a href="/students/courses/preliminary/pra005119/">Preliminary Arts Stage 1 0 TCE credit points Level: Pre PRA005119</a>' +
    '<a href="/students/courses/languages/jpn215126/">Japanese 15 TCE credit points Level: 2 JPN215126</a>';
  const r=extractTasc2026(html);
  assert.equal(r.declared_current_year_count,164);
  assert.equal(r.courses.length,4);
  const acc=r.courses.find(x=>x.code==="ACC315116");
  assert.equal(acc.title,"Accounting");
  assert.equal(acc.level,"3");
  assert.equal(acc.tce_credit_points,15);
  assert.equal(acc.identifier_kind,"senior_course_code");
  assert.equal(acc.applicable_year,2026);
  assert.equal(r.courses.find(x=>x.code==="PRA005119").level,"Pre");
  assert.equal(r.errors.length,0);
});
test("TASC scraper discards navigation and never invents codes",()=>{
  const html = '<h2>164 courses</h2><a href="/students/courses/a-z/">A-Z Courses</a>' +
  '<a href="https://example.com/itc315118/">Computer Science 15 TCE credit points Level: 3 ITC315118</a>' +
  '<a href="/students/courses/mathematics/mtm415117/">Mathematics Methods 15 TCE credit points Level: 4 MTM415117</a>' +
  '<a href="/students/courses/mathematics/mtm415117/">Mathematics Methods 15 TCE credit points Level: 4 MTM415117</a>';
  const r=extractTasc2026(html);
  assert.deepEqual(r.courses.map(x=>x.code),["MTM415117"]);
  assert.equal(r.courses[0].source_url,"https://www.tasc.tas.gov.au/students/courses/mathematics/mtm415117/");
});
