import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const root=new URL("../src/data/",import.meta.url);
const tas=JSON.parse(readFileSync(new URL("tasc-2026-course-codes.json",root),"utf8"));
const sace=JSON.parse(readFileSync(new URL("sace-2026-subject-review.json",root),"utf8"));
const senior=readFileSync(new URL("seniorCatalogue.ts",root),"utf8");
test("TAS source validates 164 senior course identifiers",()=>{
 assert.equal(tas.summary.verified_course_codes,164);
 assert.equal(tas.summary.declared,164);
 assert.equal(tas.courses.length,164);
 assert.equal(new Set(tas.courses.map(x=>x.code)).size,164);
});
test("SACE subject records remain a separate, incomplete senior catalogue",()=>{
 assert.equal(sace.summary.distinct_subject_codes,427);
 assert.equal(sace.summary.failed_or_code_less_pages,0);
 assert.equal(sace.subject_codes.length,427);
 assert.match(senior,/complete:false/);
 assert.match(senior,/NEVER passed into the Outcome Tracker/);
});
