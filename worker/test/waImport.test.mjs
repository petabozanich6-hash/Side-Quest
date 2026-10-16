import { test } from "node:test";
import assert from "node:assert/strict";
import { discoverWaJson, flattenWaJson } from "../scripts/import-wa-review.mjs";

test("Discover official SCSA JSON sources only, including language electives", () => {
  const html = '<h3>Western Australian Curriculum - XLSX</h3><a href="/file/fake.json">Not official JSON section</a>' +
   '<h3>Western Australian Curriculum - JSON</h3><a href="/__data/assets/file/0005/1270382/english.json">English Curriculum - Pre-primary to Year 10</a>' +
   '<a href="/__data/assets/file/0004/1270390/japanese-second-language.json">Japanese: Second Language Curriculum - Pre-primary to Year 10</a>';
  const items = discoverWaJson(html);
  assert.equal(items.length, 2);
  assert.match(items[1].url, /japanese-second-language\.json$/);
});

test("Extract genuine WA prefixes and legacy ABLEWA descriptors from official nested JSON", () => {
  const source={url:"https://k10outline.scsa.wa.edu.au/test/english.json",name:"English"};
  const doc=[{ year:"3", subject:"English", strands:[{strand_name:"Literacy",subStrands:[{header:"Interacting with others",textContents:[{wa_code:"WA3ELYA3"},{wa_code:"<a href=\"https://example.test\">(ACELA1430a)</a>"},{wa_code:"WA3ELYA3"}]}]}]}];
  const codes=flattenWaJson(doc,source);
  assert.deepEqual(codes.map(x=>x.code),["WA3ELYA3","ACELA1430a"]);
  assert.ok(codes.every(x=>x.level==="3"));
  assert.ok(codes.every(x=>x.source_file===source.url));
});

test("WA Languages JSON uses published content-description notations, not arbitrary UUIDs", () => {
  const source={url:"https://k10outline.scsa.wa.edu.au/test/japanese.json",name:"Japanese: Second Language"};
  const doc={title:"Japanese - Second Language",curriculum:{contentDescriptions:[
    {label:"Content description",learningArea:"Japanese: Second Language",nominalYearLevels:["Year 4"],notations:["ACLJAU140"],identifier:"uuid-1"},
    {label:"Achievement standard",nominalYearLevels:["Year 4"],notations:["NOT_A_CODE"]}
  ]}};
  const rows=flattenWaJson(doc,source);
  assert.equal(rows.length,1);
  assert.equal(rows[0].code,"ACLJAU140");
  assert.equal(rows[0].subject,"Japanese: Second Language");
  assert.equal(rows[0].level,"Year 4");
});


test("WA ABLEWA markdown identifiers are extracted only from empty-wa_code descriptions", () => {
  const source={url:"https://k10outline.scsa.wa.edu.au/test/mathematics.json",name:"Mathematics"};
  const doc=[{year:"a",subject:"Mathematics",strands:[{textContents:[
    {sub_strand_id:12,wa_code:"",markdown:"<p>Respond to objects (ACMNA001a)</p>"},
    {sub_strand_id:12,wa_code:"",markdown:"<p>Respond to routine events (ACMMG007a)</p>"},
    {wa_code:"WA3MNAUN7",markdown:"<p>Example (ACMNA999a) should not be read</p>"}
  ]}],examples:[{sub_strand_id:12,wa_code:"",markdown:"Not an outcome (ACMNA888a)"}]}];
  const rows=flattenWaJson(doc,source);
  assert.deepEqual(rows.map(x=>x.code),["ACMNA001a","ACMMG007a","WA3MNAUN7"]);
  assert.equal(rows[0].identifier_kind,"wa_ablewa_content_description");
});


test("WA ABLEWA Digital Technologies extracts VCDT codes from content descriptions only", () => {
  const source={url:"https://k10outline.scsa.wa.edu.au/test/digital-technologies.json",name:"Digital Technologies"};
  const doc=[{year:"a",subject:"Digital Technologies",strands:[{subStrands:[{textContents:[
    {sub_strand_id:12,wa_code:"",markdown:"<p>React to digital systems (VCDTDS001)</p>"},
    {sub_strand_id:12,wa_code:"",markdown:"<p>Represent data (VCDTDI002)</p>"},
    {sub_strand_id:12,wa_code:"",markdown:"<p>Follow steps (VCDTCD003)</p>"},
    {wa_code:"WAPDIGDS1",markdown:"<p>Example mentions (VCDTDS099)</p>"}
  ]}]}],examples:[{sub_strand_id:12,wa_code:"",markdown:"(VCDTCD100)"}]}];
  const rows=flattenWaJson(doc,source);
  assert.deepEqual(rows.map(x=>x.code),["VCDTDS001","VCDTDI002","VCDTCD003","WAPDIGDS1"]);
  assert.ok(rows.slice(0,3).every(x=>x.identifier_kind==="wa_ablewa_content_description"));
});


test("WA ABLEWA Science source-embedded identifiers are extracted without examples", () => {
  const source={url:"https://k10outline.scsa.wa.edu.au/test/science.json",name:"Science"};
  const doc=[{year:"a",subject:"Science",strands:[{textContents:[
    {sub_strand_id:12,wa_code:"",markdown:"<p>Living things (ACSSU002a)</p>"},
    {sub_strand_id:12,wa_code:"",markdown:"<p>Inquiry (ACSISO014a)</p>"},
    {sub_strand_id:12,wa_code:"",markdown:"<p>Human endeavour (ACSHE013a)</p>"},
    {wa_code:"WAPSSUB1",markdown:"<p>Example (ACSSU999a)</p>"}
  ]}],examples:[{sub_strand_id:12,wa_code:"",markdown:"(ACSSU888a)"}]}];
  const rows=flattenWaJson(doc,source);
  assert.deepEqual(rows.map(x=>x.code),["ACSSU002a","ACSISO014a","ACSHE013a","WAPSSUB1"]);
});
