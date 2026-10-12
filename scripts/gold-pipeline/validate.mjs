// Static evidence checks are deliberately separate from educational/NESA sign-off.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {validateLesson, validateMigration, generatedStages} from '../validate-lessons.mjs';
import {auditLesson} from '../audit-y3-d1-quality.mjs';

const text = x => typeof x === 'string' && x.trim().length > 0;
const norm = x => String(x).toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const need = (ok, msg) => assert.ok(ok,msg);
export function validateBundle(bundle, baseline) {
  need(bundle.architecture === 'd1-worker','Unsupported architecture: do not substitute benchmarks');
  const l=bundle.lesson;
  need(l.seed_key === baseline.seed_key, 'Identity changed');
  for (const key of ['stage','learning_area','year_level','week','lesson_number']) {
    need(String(l[key]) === String(baseline[key]), `Placement changed: ${key}`);
  }
  need(l.seed_key !== 's2-eng-y3-w01-l1','Protected benchmark');
  const structural=validateLesson(l);
  // The branch's corrective audit is Stage 2 specific. Never apply its shape
  // thresholds to kindergarten or senior lessons; validateLesson uses age bands.
  const audit=Number(String(l.year_level).match(/\d+/)?.[0])===3 ? auditLesson(l) : [];
  need(audit.length===0,JSON.stringify(audit));
  need(Array.isArray(l.outcome_codes) && l.outcome_codes.length>0, 'Proposed NESA alignment required (not verification)');
  const curriculum=bundle.curriculum;
  need(Array.isArray(curriculum) && curriculum.length===l.outcome_codes.length,'Curriculum evidence for each proposed code');
  need(new Set(curriculum.map(c=>c.code)).size===curriculum.length,'Duplicate curriculum mapping');
  for (const c of curriculum) {
    need(l.outcome_codes.includes(c.code),'Curriculum code mismatch');
    need(/^https:\/\/curriculum\.nsw\.edu\.au\//.test(c.source),'Authoritative NESA source required');
    need(text(c.lesson_evidence) && text(c.scope_limit),'Individual contribution and coverage limits required');
    need(c.verification_status==='pending','Authoring cannot self-certify NESA');
  }
  const r=bundle.requirements;
  need(Array.isArray(r?.teaching) && r.teaching.length===l.teach_steps.length,'Teaching evidence for every stage');
  const explanations=l.teach_steps.map(s=>norm(s.explain));
  need(new Set(explanations).size===explanations.length,'Repeated teaching explanation');
  l.teach_steps.forEach((s,i)=>{
    const evidence=r.teaching[i];
    const rendered=[s.explain,s.example,s.notice].join('\n');
    for (const key of ['rule','why','model','misconception','fix','guided_attempt','feedback']) {
      need(text(evidence[key]) && rendered.includes(evidence[key]),`teach${i}: rendered ${key} required`);
    }
    need(s.explain.length>=300,`teach${i}: shallow explanation`);
    need(!s.example.includes(l.independent_task),'Independent assessment exposed in teaching');
    need(s.example!==l.guided_practice,'Guided practice duplicated into teaching');
  });
  const allHints=Object.values(l.stage_hints).flat().map(norm);
  need(new Set(allHints).size===allHints.length,'Hints repeated across stages');
  for(const [stage,hints] of Object.entries(l.stage_hints)) {
    need(hints.every(h=>!/^Find (one|a|an|the) (exact|particular|relevant)|return to the original|show your working/i.test(h)),`${stage}: generic hint ladder`);
  }
  const qs=l.quiz.map(q=>norm(q.question));
  need(new Set(qs).size===qs.length,'Repeated quiz prompt');
  need(l.quiz.every(q=>q.explanation.length>=50),'Quiz reasoning required');
  // Assessment quality gates (structural). Educational approval remains a separate human gate.
  const mc=l.quiz.filter(q=>q.type==='multiple_choice');
  const written=l.quiz.filter(q=>q.type==='short_answer');
  need(mc.length>=8,'At least eight multiple-choice items required');
  need(written.length>=2,'At least two written reasoning items required');
  const bannedStem=/which idea is taught|which feedback is most useful|which statement appeared|what should you demonstrate in this teaching stage/i;
  for(const q of mc){
    need(!bannedStem.test(q.question),`Meta recall stem banned: ${q.question.slice(0,80)}`);
    need(Array.isArray(q.options)&&q.options.length===4,'MC requires four options');
    // Exact option text must differ; punctuation-only differences can be pedagogically real.
    need(new Set(q.options.map(o=>String(o).trim().toLowerCase())).size===4,'Repeated answer choices in one item');
    need(Number.isInteger(q.correct_index)&&q.correct_index>=0&&q.correct_index<4,'correct_index out of range');
    need(!q.options.some(o=>/any answer is equally supported|there is no need to compare your attempt/i.test(o)),
      'Implausible filler distractor');
    need(!q.explanation||!/the other choices avoid explaining the actual strategy/i.test(q.explanation),
      'Generic quiz feedback');
  }
  const positionCounts=[0,0,0,0];
  for(const q of mc) positionCounts[q.correct_index]+=1;
  need(Math.max(...positionCounts)<=Math.ceil(mc.length/2),
    `Correct answers overly concentrated: ${JSON.stringify(positionCounts)}`);
  need(positionCounts.filter(c=>c>0).length>=2,'Correct-answer positions must vary');
  // Near-duplicate stems (share a long normalised prefix)
  const mcStems=mc.map(q=>norm(q.question));
  for(let i=0;i<mcStems.length;i+=1){
    for(let j=i+1;j<mcStems.length;j+=1){
      const a=mcStems[i];
      const b=mcStems[j];
      need(!(a.length>40&&b.length>40&&(a.startsWith(b.slice(0,40))||b.startsWith(a.slice(0,40)))),
        'Near-duplicate quiz prompts');
    }
  }
  for(const q of written){
    need(text(q.sample_answer)&&text(q.marking_guide),'Written items need sample and marking guide');
    need(!/original demonstration:\s*$/i.test(q.sample_answer),'Empty written model');
  }
  // Independent practice inputs must differ from model/guided (existing rule below).
  const practice=r.practice;
  for(const key of ['model_inputs','guided_inputs','independent_inputs']) {
    need(Array.isArray(practice?.[key]) && practice[key].length && practice[key].every(text),`${key} required`);
  }
  const groups=['model_inputs','guided_inputs','independent_inputs'];
  const inputs=groups.flatMap(k=>practice[k].map(norm));
  need(new Set(inputs).size===inputs.length,'Model, guided and independent inputs must differ');
  const fields=[l.worked_example,l.guided_practice,l.independent_task];
  groups.forEach((g,i)=>practice[g].forEach(input=>need(fields[i].includes(input),`${g}: input absent from rendered task`)));
  practice.independent_inputs.forEach(input=>{
    need(![l.worked_example,l.guided_practice,...l.teach_steps.map(s=>s.example)].some(t=>t.includes(input)),'Independent material leaked into model/practice');
  });
  need(Array.isArray(r.visuals) && r.visuals.length>=2,'Topic-specific visual evidence required');
  const visuals=[];
  function scan(v){if(!v || typeof v!=='object')return;if(v.svg)visuals.push(v);Object.values(v).forEach(scan);}
  scan(l);
  for(const v of r.visuals) {
    need(text(v.alt) && text(v.teaches) && visuals.some(actual=>actual.alt===v.alt),'Visual must exist with meaningful teaching evidence');
    const actual=visuals.find(actual=>actual.alt===v.alt);
    need(!/LEARN.*TRY.*CHECK|step one.*step two/i.test(actual.svg),'Generic process card is not a teaching visual');
  }
  need(r.review_questions?.length>=5 && r.review_questions.every(text),'Reviewer checklist required');
  return {structural,static_quality:'passed',generated_stages:generatedStages(l),nesa:'pending',educational_review:'pending',browser_review:'pending'};
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {
    const [bundlePath, baselinePath, sqlPath]=process.argv.slice(2);
    const bundle=JSON.parse(fs.readFileSync(bundlePath,'utf8'));
    const baseline=JSON.parse(fs.readFileSync(baselinePath,'utf8'));
    const result=validateBundle(bundle,baseline);
    result.migration=validateMigration(sqlPath,{strict:true});
    need(!result.migration.historical,'Historical bypass');
    console.log(JSON.stringify(result));
  } catch(error) { console.error(error.stack); process.exitCode=1; }
}
