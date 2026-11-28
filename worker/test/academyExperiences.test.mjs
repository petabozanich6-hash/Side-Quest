import test from "node:test";
import assert from "node:assert/strict";
import {academyExperience,academyExperienceGuide} from "../src/academyExperiences.ts";
import {CREATIVE_CAMPS,campResource,campPreparation} from "../src/englishClubCreativeCamps.ts";
import {ADULT_STUDIO,adultStudioGuide,adultStudioResource} from "../src/writersAcademy.ts";
test("every Academy workshop has its own interactive scene and facilitator prompts",()=>{
 const titles=new Set();
 for(const programme of [...CREATIVE_CAMPS,ADULT_STUDIO])for(const [i,s] of programme.sessions.entries()){
  const adult=programme.id===ADULT_STUDIO.id;
  const scene=academyExperience(programme.id,s.title),resource=adult?adultStudioResource(i):campResource(programme.id,i),guide=adult?adultStudioGuide(i):campPreparation(programme.id,i);
  assert.ok(scene,s.title);assert.deepEqual(resource.experience,scene);assert.equal(scene.discoveries.length,3);assert.equal(scene.paths.length,2);
  assert.ok(scene.discoveries.every(d=>d.icon&&d.label&&d.detail));assert.equal(new Set(scene.discoveries.map(d=>d.label)).size,3);
  assert.ok(scene.paths.every(p=>p.label&&p.outcome));assert.notEqual(scene.paths[0].outcome,scene.paths[1].outcome);
  assert.ok(scene.discovery_slide>=0&&scene.discovery_slide<resource.slides.length);assert.ok(scene.decision_slide>=0&&scene.decision_slide<resource.slides.length);assert.notEqual(scene.discovery_slide,scene.decision_slide);
  assert.ok(guide.includes(academyExperienceGuide(programme.id,s.title)));assert.ok(!JSON.stringify(resource).includes("Interactive scene (shared presentation)"));
  titles.add(scene.title);
 }
 assert.equal(titles.size,18);
 assert.equal(academyExperience(ADULT_STUDIO.id,"The Book Portal"),null);
 assert.equal(academyExperience("__proto__","constructor"),null);
});
