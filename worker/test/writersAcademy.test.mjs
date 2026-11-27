import test from "node:test";
import assert from "node:assert/strict";
import {WRITERS_ACADEMY,ADULT_STUDIO,academyProgramme,adultStudioGuide} from "../src/writersAcademy.ts";
import {validateActivityTemplate} from "../src/supportActivityLibrary.ts";
import {creativeCamp} from "../src/englishClubCreativeCamps.ts";
test("academy planning catalogue has distinct age bands, duration and exact proposed prices",()=>{
 assert.deepEqual(WRITERS_ACADEMY.map(p=>[p.age,p.minutes,p.session_cents,p.upfront_cents,p.weekly_cents,p.audience]),[["8–11",60,2500,13500,2500,"minor"],["12–17",60,3000,16500,3000,"minor"],["18+",90,4500,24000,4500,"adult"]]);
 assert.ok(WRITERS_ACADEMY.every(p=>p.sessions===6&&p.upfront_cents<p.weekly_cents*p.sessions));
 assert.equal(academyProgramme("unknown"),undefined);
 // Adult access must not be routed through child camp creation and booking.
 assert.equal(creativeCamp(ADULT_STUDIO.id),undefined);
});
test("adult programme has six distinct 90-minute guides and four valid digital activities each",()=>{
 assert.equal(ADULT_STUDIO.sessions.length,6);
 assert.equal(new Set(ADULT_STUDIO.sessions.map(s=>s.title)).size,6);
 for(const [i,s] of ADULT_STUDIO.sessions.entries()){
  const guide=adultStudioGuide(i);assert.ok(guide.includes(s.script));assert.ok(guide.includes(s.demo));assert.ok(guide.includes(s.exercise));assert.ok(guide.includes(s.feedback));assert.match(guide,/83–90 min/);
  const activities=s.activities.map(a=>validateActivityTemplate({...a,subject:"Creative writing",year_level:"Adults 18+"}));
  assert.equal(activities.length,4);assert.ok(activities.every(Boolean));assert.equal(activities[1].game.type,"story_builder");assert.equal(activities[1].answer_key,null);assert.equal(activities[2].collaborative,1);
 }
 assert.equal(adultStudioGuide(-1),"");
});
