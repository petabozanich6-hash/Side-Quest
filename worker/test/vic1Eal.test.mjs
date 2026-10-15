import { test } from "node:test";
import assert from "node:assert/strict";
import { EAL_SOURCES, extractEal } from "../scripts/import-vic1-eal.mjs";

test("all three Victorian EAL v1 language immersion pathways are sourced",()=>{
  assert.deepEqual(EAL_SOURCES.map(x=>x.pathway),["A","B","C"]);
  assert.ok(EAL_SOURCES.every(x=>x.url.startsWith("https://victoriancurriculum.vcaa.vic.edu.au/")));
});

test("VC1 EAL content codes follow the exact published level and pathway",()=>{
  const html = '<h3>Level BL Description</h3><p>VCEALC999 elsewhere</p>' +
    '<h3>Level BL Content Descriptions</h3><p>Listening (VCEALC162)</p><p>Reading (VCEALL173)</p>' +
    '<h3>Level B1 Description</h3><p>VCEALL980 not curriculum</p>' +
    '<h3>Level B1 Content Descriptions</h3><p>Listening (VCEALC245)</p><p>VCEALC245 duplicated</p>' +
    '<script>const imaginary="VCEALL777"</script>';
  const rows=extractEal(html,EAL_SOURCES[1]);
  assert.deepEqual(rows.map(x=>x.code),["VCEALC162","VCEALL173","VCEALC245"]);
  assert.deepEqual(rows.map(x=>x.level),["BL","BL","B1"]);
  assert.ok(rows.every(x=>x.framework==="Victorian Curriculum F–10 v1"));
  assert.ok(rows.every(x=>x.pathway.startsWith("Pathway B")));
});
