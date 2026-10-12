import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateBundle} from './validate.mjs';
import {validateMigration} from '../validate-lessons.mjs';
import os from 'node:os';
import path from 'node:path';

const original=JSON.parse(fs.readFileSync('lesson-pipeline/authored/s2-mat-y3-w02-l1.json','utf8'));
const baseline={...original.lesson};
test('original authored pilot passes structural/static checks with reviews pending',()=>{
  const result=validateBundle(original,baseline);
  assert.equal(result.nesa,'pending');
  assert.equal(result.educational_review,'pending');
  assert.equal(result.generated_stages.length,10);
});
for(const [name,change,error] of [
  ['wrong architecture',b=>b.architecture='python-library',/Unsupported architecture/],
  ['moved lesson',b=>b.lesson.week=99,/Placement changed/],
  ['missing NESA proposal',b=>b.lesson.outcome_codes=[],/NESA/],
  ['nonofficial syllabus source',b=>b.curriculum[0].source='https://example.org',/Authoritative/],
  ['self-certified syllabus',b=>b.curriculum[0].verification_status='verified',/self-certify/],
  ['missing explicit teaching reason',b=>b.requirements.teaching[0].why='',/rendered why/],
  ['invented evidence not in rendered teaching',b=>b.requirements.teaching[0].model='Unrendered model',/rendered model/],
  ['duplicated hint across stages',b=>b.lesson.stage_hints.learn[0]=b.lesson.stage_hints.accept[0],/Hints repeated/],
  ['independent task exposed in teaching',b=>b.lesson.teach_steps[0].example+=b.lesson.independent_task,/INDEPENDENT_EXPOSURE|Independent/],
  ['assessment reused from model',b=>b.requirements.practice.independent_inputs[0]='Round 286',/inputs must differ/],
  ['repeated quiz prompt',b=>b.lesson.quiz[1].question=b.lesson.quiz[0].question,/Repeated quiz/],
  ['short unsupported quiz explanation',b=>b.lesson.quiz[0].explanation='Because it is right.',/Quiz reasoning/],
  ['meta recall stem banned',b=>b.lesson.quiz[0].question='Which idea is taught in the stage "Understand"?',/Meta\/study-behaviour stem banned|Meta recall stem banned/],
  ['study-behaviour template stem banned',b=>b.lesson.quiz[0].question='A learner is practising rounding. Which approach best shows understanding?',/Meta\/study-behaviour stem banned/],
  ['truncated MC option banned',b=>{const q=b.lesson.quiz.find(x=>x.type==='multiple_choice');q.options[1]='Show the places, values or steps and say why…';},/Truncated MC option/],
  ['correct answers overly concentrated',b=>{for(const q of b.lesson.quiz){if(q.type==='multiple_choice')q.correct_index=0;}},/overly concentrated/],
  ['implausible filler distractor',b=>{const q=b.lesson.quiz.find(x=>x.type==='multiple_choice');q.options[1]='Any answer is equally supported.';},/Implausible filler/],
  ['copy-model filler distractor',b=>{const q=b.lesson.quiz.find(x=>x.type==='multiple_choice');q.options[2]='Copy the worked example and call it independent work.';},/Implausible filler/],
  ['circular quiz explanation banned',b=>{const q=b.lesson.quiz.find(x=>x.type==='multiple_choice');const correct=q.options[q.correct_index];q.explanation=correct+' Yes.';},/Circular quiz explanation/],
  ['mechanical marking guide banned',b=>{const q=b.lesson.quiz.find(x=>x.type==='short_answer');q.marking_guide='Require new numbers, visible working and named places/values.';},/Mechanical short-answer marking guide/],
  ['missing topic visual evidence',b=>b.requirements.visuals=[],/Topic-specific/],
  ['unrendered visual',b=>b.requirements.visuals[0].alt='Imaginary picture',/Visual must exist/],
  ['child-visible parent label',b=>b.lesson.parent_notes=b.lesson.parent_notes.replace('Parent:', 'Answer:'),/Parent:/],
]) test(name,()=>{const b=structuredClone(original);change(b);assert.throws(()=>validateBundle(b,baseline),error);});

test('seed versus learning_area subject mismatch is banned',()=>{
  const b=structuredClone(original);
  // Keep placement baseline aligned so the subject-metadata gate is the one that fires.
  b.lesson.learning_area='English';
  const base={...baseline, learning_area:'English'};
  assert.throws(()=>validateBundle(b,base),/Learning area metadata mismatches/);
});

test('generator-style weak quiz block fails assessment quality gate',()=>{
  const b=structuredClone(original);
  const mc=b.lesson.quiz.filter(q=>q.type==='multiple_choice');
  // Inject the historical template pattern that previously passed structural checks.
  mc[0].question='A learner is practising rounding. Which approach best shows understanding?';
  mc[1].question='Which practice choice shows transfer of rounding?';
  mc[2].question='Which feedback comment is most useful after a mistake?';
  mc[0].options[2]='Choose randomly because any option could be right.';
  mc[1].options[1]='Copy the worked example and call it independent work.';
  assert.throws(()=>validateBundle(b,baseline),/Meta\/study-behaviour stem banned|Implausible filler|Repeated study-behaviour/);
});

test('explicit strict mode rejects marker-free non-Year-3 content at any path',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'strict-gold-'));
  const file=path.join(dir,'draft.sql');
  fs.writeFileSync(file,"UPDATE lessons SET data=json_patch(data,'{\"seed_key\":\"s4-sci-y7-w01-l1\",\"coming_soon\":null}') WHERE seed_key='s4-sci-y7-w01-l1';");
  try{assert.throws(()=>validateMigration(file,{strict:true}),/Missing required/);}
  finally{fs.rmSync(dir,{recursive:true,force:true});}
});
