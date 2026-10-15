import { test } from "node:test";
import assert from "node:assert/strict";
import { SOURCES, extractLegacyCodes } from "../scripts/import-vic1-languages.mjs";

test("The Victorian 2026 Version 1 Languages inventory covers all published Phase 3 and Phase 4 subjects",()=>{
 const names=new Set(SOURCES.map(x=>x.language));
 for(const lang of ["Arabic","Classical Greek","Framework for Classical Languages","Hindi","Latin","Non-Roman Alphabet Languages","Roman Alphabet Languages","Turkish","Vietnamese","Auslan","Chinese","Victorian Aboriginal Languages"])assert.ok(names.has(lang),lang);
 assert.ok(SOURCES.every(x=>x.url.startsWith("https://victoriancurriculum.vcaa.vic.edu.au/languages/")));
 assert.ok(SOURCES.every(x=>[3,4].includes(x.phase)));
});

test("VC1 official language codes are collected against the right language/sequence, with source URL",()=>{
 const src=SOURCES.find(x=>x.language==="Arabic");
 const html = '<h2>F–10 Sequence Foundation to Level 2</h2><h3>Foundation to Level 2 Content Descriptions</h3><p>VCARC103</p><p>VCARC103</p>' +
  '<p>VCARU114</p><script>const fake="VCARC999"</script><h2>7–10 Sequence Levels 7 and 8</h2><h3>Levels 3 and 4 Content Descriptions</h3><p>VCARC126</p>';
 const rows=extractLegacyCodes(html,src);
 assert.deepEqual(rows.map(x=>x.code),["VCARC103","VCARC126","VCARU114"]);
 assert.equal(rows.find(x=>x.code==="VCARC126").band_hint,"Levels 3 and 4");
 assert.ok(rows.every(x=>x.subject==="Arabic"&&x.version==="VC1"));
 assert.equal(rows.find(x=>x.code==="VCARC103").sequence,"F–10");
 assert.equal(rows.find(x=>x.code==="VCARC126").sequence,"7–10");
 assert.ok(rows.every(x=>x.source_url===src.url));
});

test("VCAA v1 Auslan and Chinese learner pathways use distinct verified pages",()=>{
  const auslan=SOURCES.filter(x=>x.language==="Auslan");
  const chinese=SOURCES.filter(x=>x.language==="Chinese");
  assert.deepEqual(auslan.map(x=>x.learner_pathway),["first-language-learner","second-language-learner"]);
  assert.deepEqual(chinese.map(x=>x.learner_pathway),["background-language-learner","first-language-learner"]);
  assert.ok(auslan.every(x=>x.url.includes("/auslan/")&&x.url.includes("/curriculum/f-10")));
  assert.equal(SOURCES.filter(x=>x.language==="Latin").length,1);
});
