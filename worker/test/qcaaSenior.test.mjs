import { test } from "node:test";
import assert from "node:assert/strict";
import { extractQceSyllabuses, extractQceEdition } from "../scripts/import-qcaa-senior.mjs";

test("QCAA senior A–Z index includes General/Applied/Short Course, extensions and languages",()=>{
  const html = '<a href="/senior/senior-subjects/syllabuses/languages/chinese-extension">Chinese Extension</a>' +
    '<a href="/senior/senior-subjects/syllabuses/english/literacy">Literacy</a>' +
    '<a href="/senior/senior-subjects/syllabuses/humanities-social-sciences/accounting">Accounting</a>' +
    '<a href="/senior/senior-subjects/syllabuses/humanities-social-sciences/accounting">Accounting</a>' +
    '<a href="/senior/senior-subjects/syllabuses">Syllabuses</a><a href="https://example.com/foreign">Foreign</a>';
  const rows=extractQceSyllabuses(html);
  assert.deepEqual(rows.map(x=>x.subject),["Accounting","Chinese Extension","Literacy"]);
  assert.equal(rows[0].official_subject_code,null,"never make a course URL slug into an official outcome code");
  assert.ok(rows[1].official_subject_url.includes("/languages/chinese-extension"));
});

test("QCAA subject landing pages distinguish General, Applied and Short Courses",()=>{
  const fixtures=[["Accounting","General"],["Hospitality Practices","Applied"],["Literacy","Short Course"]];
  for(const [title,kind] of fixtures){
    const html = "<h1>"+title+" "+kind+" senior syllabus</h1><h2>Syllabus</h2><h3>"+title+" "+kind+" senior syllabus 2025</h3>";
    const row=extractQceEdition(html);
    assert.equal(row.syllabus_type,kind);
    assert.equal(row.latest,2025);
  }
});
