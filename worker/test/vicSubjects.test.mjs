import { test } from "node:test";
import assert from "node:assert/strict";
import { VIC_SUBJECT_SOURCES } from "../scripts/import-vic-subjects.mjs";

test("VCAA subject routes include all eight learning areas, capabilities and Languages alternatives",()=>{
  const areas=new Set(VIC_SUBJECT_SOURCES.map(x=>x.learning_area));
  for(const area of ["English","Mathematics","Science","Health and Physical Education","The Arts","Humanities","Technologies","Languages","Capabilities"])assert.ok(areas.has(area),area);
  const japanese=VIC_SUBJECT_SOURCES.filter(x=>x.subject==="Japanese");
  assert.equal(japanese.length,2);
  assert.ok(japanese.some(x=>x.pathway==="F–10"));
  assert.ok(japanese.some(x=>x.pathway==="7–10"));
  assert.ok(VIC_SUBJECT_SOURCES.some(x=>x.subject==="Classical Greek"));
  assert.ok(VIC_SUBJECT_SOURCES.some(x=>x.subject==="Ethical Capability"));
  assert.ok(VIC_SUBJECT_SOURCES.every(x=>x.url.startsWith("https://f10.vcaa.vic.edu.au/")));
  assert.equal(new Set(VIC_SUBJECT_SOURCES.map(x=>x.url)).size,VIC_SUBJECT_SOURCES.length);
});
