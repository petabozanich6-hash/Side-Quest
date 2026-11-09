import test from "node:test";
import assert from "node:assert/strict";
import { validateGuestInput, guestPlanHtml } from "../src/guestDocumentDelivery.ts";

test("one-off document accepts a real year, date range and learner name", () => {
  const r=validateGuestInput({learner_name:"Learner",year_level:"3",period_start:"2027-01-01",period_end:"2027-12-01",strengths:"Art, music",areas:{"English":{focus:"Writing",activities:"Read",evidence:"Samples"}}});
  assert.equal(r.ok,true);
  assert.equal(r.data.areas.English.focus,"Writing");
});
test("one-off document rejects missing learner, unsupported year, and bad dates", () => {
  const base={learner_name:"Learner",year_level:"3",period_start:"2027-01-01",period_end:"2027-12-01"};
  for(const patch of [{learner_name:""},{year_level:"999"},{period_start:"tomorrow"},{period_end:"2026-12-01"}]){
    assert.equal(validateGuestInput({...base,...patch}).ok,false);
  }
});
test("guest PDF markup escapes user text and uses the shared plan fields", () => {
  const html=guestPlanHtml({
    jurisdiction:{code:"NSW",name:"New South Wales",planName:"Educational Program",requirements:["Real requirement"],sources:[{title:"Official source",url:"https://example.org"}]},
    data:{learner_name:"<script>alert(1)</script>",period_start:"2027-01-01",period_end:"2027-12-01",areas:{}},
    checked_on:"2026-10-14",
    content:{overview:"Overview",learning_areas:[{area:"English",goals:["Goal"],teaching_methods:["Teach"],sample_activities:["Activity"],evidence_approach:"Records"}]},
  });
  assert.doesNotMatch(html,/<script>/);
  assert.match(html,/&lt;script&gt;/);
  assert.match(html,/Overview/);
  assert.match(html,/Goal/);
  assert.match(html,/Official source/);
});


test("guided PDFs share Side-Quest visual identity in owner, buyer and shop sample", () => {
  const built={
    jurisdiction:{code:"QLD",name:"Queensland",planName:"Home Education Program",requirements:["Required planning information"],sources:[{title:"Official source",url:"https://example.org"}]},
    data:{learner_name:"Alex Example",year_level:"3",period_start:"2027-01-01",period_end:"2027-12-01",goals:"Learning goals",areas:{}},
    checked_on:"2026-10-14",
    content:{overview:"Plan overview",educational_philosophy:"Individualised philosophy",learning_areas:[
      {area:"English",goals:["Read books"],teaching_methods:["Discuss texts"],sample_activities:["Read a story"],evidence_approach:"Reading log"},
      {area:"Mathematics",goals:["Measure objects"],teaching_methods:["Practical work"],sample_activities:["Measure length"],evidence_approach:"Work samples"},
    ]},
  };
  const full=guestPlanHtml(built);
  const sample=guestPlanHtml(built,true);
  for(const html of [full,sample]){
    assert.match(html,/HOME EDUCATION DOCUMENT STUDIO/);
    assert.match(html,/Your Home Education Plan/);
    assert.match(html,/#1F3B2D/);
    assert.match(html,/#D4A574/);
    assert.match(html,/Alex Example/);
    assert.match(html,/Read books/);
    assert.match(html,/break-after:page/);
  }
  assert.match(full,/Measure objects/);
  assert.match(full,/Required planning information/);
  assert.match(sample,/FREE SAMPLE/);
  assert.doesNotMatch(sample,/Measure objects/);
  assert.doesNotMatch(sample,/Required planning information/);
  assert.doesNotMatch(full,/FREE SAMPLE/);
});
