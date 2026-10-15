import { test } from "node:test";
import assert from "node:assert/strict";
import { seniorCatalogueFor } from "../src/data/seniorCatalogue.ts";

test("TAS offers every current TASC-accredited senior course as a course identifier, not an outcome",()=>{
  const c=seniorCatalogueFor("TAS");
  assert.ok(c);
  assert.equal(c.complete,true);
  assert.equal(c.applicable_year,2026);
  assert.equal(c.courses.length,164);
  assert.equal(new Set(c.courses.map(x=>x.code)).size,164);
  assert.ok(c.courses.every(x=>x.identifier_kind==="senior_course_code"));
  assert.ok(c.courses.every(x=>x.source_url.startsWith("https://www.tasc.tas.gov.au/")));
  for (const x of ["ACC315116","JPN215126","PRA005119","BHP315116"])assert.ok(c.courses.some(y=>y.code===x),x);
  const levels=new Set(c.courses.map(x=>x.level));
  for(const x of ["Pre","1","2","3","4"])assert.ok(levels.has(x),x);
});
test("State-specific TASC course codes are never presented as outcomes to families elsewhere",()=>{
  for(const state of ["NSW","VIC","QLD","WA","ACT"])assert.equal(seniorCatalogueFor(state),null);
});

test("South Australian and Northern Territory senior codes are SACE subject identifiers, never outcomes",()=>{
  for(const state of ["SA","NT"]) {
    const c=seniorCatalogueFor(state);
    assert.ok(c, state);
    assert.equal(c.complete,false, "national continuers, VET and jurisdiction-specific completeness remain unverified");
    assert.equal(c.courses.length,427);
    assert.equal(c.kind,"senior_subject_code");
    assert.equal(new Set(c.courses.map(x=>x.code)).size,427);
    assert.ok(c.courses.every(x=>x.identifier_kind==="senior_subject_code"), "subject code must not be called an outcome");
    assert.ok(c.courses.every(x=>x.source_url.startsWith("https://www.sace.sa.edu.au/web/")));
    assert.ok(c.courses.some(x=>x.code==="2BGY20"));
    assert.ok(c.courses.filter(x=>x.syllabus_variant==="modified").length>=60);
    assert.equal(c.courses.filter(x=>x.stage===1).length,234);
    assert.equal(c.courses.filter(x=>x.stage===2).length,193);
  }
});
