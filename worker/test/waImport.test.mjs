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
    {wa_code:"",markdown:"<p>Respond to objects (ACMNA001a)</p>"},
    {wa_code:"",markdown:"<p>Respond to routine events (ACMMG007a)</p>"},
    {wa_code:"WA3MNAUN7",markdown:"<p>Example (ACMNA999a) should not be read</p>"}
  ]}],examples:[{wa_code:"",markdown:"Not an outcome (ACMNA888a)"}]}];
  const rows=flattenWaJson(doc,source);
  assert.deepEqual(rows.map(x=>x.code),["ACMNA001a","ACMMG007a","WA3MNAUN7"]);
  assert.equal(rows[0].identifier_kind,"wa_ablewa_content_description");
});
