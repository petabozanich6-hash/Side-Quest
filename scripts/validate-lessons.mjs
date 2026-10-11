#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

// Usage: node scripts/validate-lessons.mjs worker/migrations/0044_s2_y3_w01_l1_gold_expression.sql
// Without paths, checks JSON literals in historical migrations and applies v2 checks
// only to files bearing the Standard v2 marker. Historical placeholders are not v2 lessons.
const required = ['title','child_mission','learning_intention','success_criteria','materials','duration_minutes','teach_steps','worked_example','worked_visuals','guided_practice','independent_task','response_prompt','quiz','parent_notes','evidence_instructions','offline_alternative','extension','stage_hints','review_status','pass','outcome_codes'];
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const norm = value => String(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
function ensure(condition,message) { assert.ok(condition,message); }
function strings(value,where='lesson') {
  if(typeof value === 'string') ensure(value.trim().length>0,`${where}: empty string`);
  else if(Array.isArray(value)) value.forEach((v,i)=>strings(v,`${where}[${i}]`));
  else if(value && typeof value === 'object') Object.entries(value).forEach(([k,v])=>strings(v,`${where}.${k}`));
}
function choice(q,where,count=4) {
  ensure(q && nonempty(q.question) && nonempty(q.explanation),`${where}: question and explanation needed`);
  ensure(Array.isArray(q.options) && q.options.length===count && q.options.every(nonempty),`${where}: ${count} options needed`);
  ensure(new Set(q.options.map(v=>v.trim())).size===count,`${where}: duplicate options`);
  ensure(Number.isInteger(q.correct_index) && q.correct_index>=0 && q.correct_index<count,`${where}: correct_index out of range`);
  ensure(!q.options.some(v=>/^(all|none) of the above$/i.test(v.trim())),`${where}: forbidden option`);
}
function svg(visual,where) {
  ensure(nonempty(visual.alt),`${where}: alt required`);
  ensure(Buffer.byteLength(visual.svg)<6144,`${where}: SVG exceeds 6 KB`);
  const value=visual.svg;
  ensure(!/<\?|<!|\bon\w+\s*=|\b(?:href|src)\s*=|javascript:|@import|<\s*(?:script|style|foreignObject|image|use|animate|set)\b/i.test(value),`${where}: unsafe or external SVG`);
  ensure(!/url\(\s*['"]?(?!#)/i.test(value),`${where}: external SVG URL`);
  ensure(/^<svg\b/.test(value) && /viewBox="[^"]+"/.test(value),`${where}: SVG root and viewBox required`);
  const tags=[...value.matchAll(/<([^<>]+)>/g)]; const stack=[];
  const allowed=new Set(['svg','g','rect','text','tspan','path','line','circle','ellipse','polyline','polygon','defs','linearGradient','radialGradient','stop','title','desc']);
  for(const tag of tags) {
    const body=tag[1]; const closing=body.startsWith('/'); const name=body.match(/^\/?([\w:-]+)/)?.[1];
    ensure(allowed.has(name),`${where}: unsupported SVG tag ${name}`);
    if(closing) ensure(stack.pop()===name,`${where}: mismatched SVG closing tag`);
    else {
      const attrs=body.slice(name.length).replace(/\/$/,'');
      ensure(/^\s*(?:[\w:-]+\s*=\s*(?:"[^"]*"|'[^']*')\s*)*$/.test(attrs),`${where}: invalid XML attributes`);
      if(!body.endsWith('/'))stack.push(name);
    }
  }
  ensure(stack.length===0,`${where}: unclosed SVG tag`);
  ensure(!/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);)/i.test(value),`${where}: unescaped XML entity`);
}
function episode(ep,where) {
  ensure(nonempty(ep.title) && nonempty(ep.transcript),`${where}: title and transcript required`);
  ensure(Array.isArray(ep.scenes) && ep.scenes.length>0,`${where}: scenes required`);
  let ms=0;
  for(const scene of ep.scenes) {
    ensure(['park','room','evening'].includes(scene.bg),`${where}: unknown background`);
    ensure(Array.isArray(scene.lines) && scene.lines.length>0,`${where}: lines required`);
    for(const line of scene.lines) {
      ensure(['pip','juno'].includes(line.who) && nonempty(line.text),`${where}: valid speaker and text required`);
      ensure(line.pause_after===undefined || typeof line.pause_after==='boolean',`${where}: pause_after must be boolean`);
      ms+=1900+line.text.length*62;
      if(line.blocks) for(const block of line.blocks) ensure(nonempty(block.t) && ['who','did','det','bad','mark','plain'].includes(block.c),`${where}: invalid block`);
    }
  }
  ensure(ms>=20000 && ms<=60000,`${where}: estimated caption timing ${(ms/1000).toFixed(1)}s outside 20–60s (user pause excluded)`);
}
export function generatedStages(l) {
  return ['accept',...l.teach_steps.map((_,i)=>`teach${i}`),'learn',...(l.spelling && (l.spelling.teaching || l.spelling.words?.length)?['spelling']:[]),...(l.sort_activity?['sort']:[]),...(l.resources?.some(r=>r.type==='video' && r.embed_url)?['watch']:[]),...(l.word_challenges?.length || l.suspense_builder?['words']:[]),...(l.guided_practice?['guided']:[]),...(l.planner_fields?.length?['plan']:[]),'write',...(l.quiz.some(q=>q.type!=='short_answer')?['quiz']:[]),'submit'];
}
export function validateLesson(l,{media=true}={}) {
  strings(l);
  for(const key of required) ensure(l[key]!==undefined && l[key]!==null,`Missing required ${key}`);
  ensure([1,'1'].includes(l.pass),'pass must be 1');
  ensure(['unreviewed','needs_expert_review'].includes(l.review_status),'invalid review_status');
  ensure(Array.isArray(l.outcome_codes),'outcome_codes must be array; manually verify codes with NESA');
  ensure(l.success_criteria.length>=3 && l.success_criteria.length<=5 && l.success_criteria.every(v=>v.startsWith('I can')),'3–5 I can criteria required');
  ensure(Array.isArray(l.materials) && l.materials.length>0,'materials required');
  const year=Number(l.year_level); ensure(Number.isInteger(year) && year>=0 && year<=12,'year_level required');
  const early=year<=2; const options=early?3:4;
  const stepCounts=early?[3]:year<=6?[4]:year<=10?[4,5]:[5];
  ensure(stepCounts.includes(l.teach_steps.length),'wrong teach-step count');
  ensure(l.duration_minutes>0 && l.duration_minutes<=60,'duration out of range');
  l.teach_steps.forEach((s,i)=>{for(const key of ['icon','title','explain','example','notice'])ensure(nonempty(s[key]),`teach${i}: missing ${key}`);choice(s.check,`teach${i}`,options);});
  ensure(l.quiz.length===(early?5:10),'wrong quiz size');
  const mc=l.quiz.filter(q=>q.type==='multiple_choice'); const short=l.quiz.filter(q=>q.type==='short_answer');
  ensure(mc.length+short.length===l.quiz.length,'unknown quiz type');
  if(year>=3 && year<=6)ensure(mc.length===8 && short.length===2,'Years 3–6 need 8 MC and 2 written');
  if(early)ensure(mc.length===5,'early years need five scored questions');
  ensure((l.pass_mark ?? .9)===(early?.8:.9),'wrong pass mark');
  mc.forEach((q,i)=>choice(q,`quiz${i}`,options));
  short.forEach(q=>{ensure(nonempty(q.question) && nonempty(q.sample_answer) && nonempty(q.marking_guide) && nonempty(q.explanation),'short answer needs question, model, guide and explanation');ensure(!('correct_index' in q),'written response must not have correct_index');ensure(l.parent_notes.includes(q.sample_answer),'written model missing from parent_notes');});
  ensure(l.parent_notes.split(/\n\s*\n/).every(p=>/^Parent:/.test(p)),'every parent paragraph must start Parent:');
  const expected=generatedStages(l); ensure(Object.keys(l.stage_hints).sort().join('|')===expected.sort().join('|'),'stage_hints must match generated stages exactly');
  for(const [key,hints] of Object.entries(l.stage_hints)) {
    ensure(Array.isArray(hints) && hints.length===3 && hints.every(nonempty) && new Set(hints.map(norm)).size===3,`${key}: exactly 3 unique hints required`);
    ensure(!hints.some(h=>/\b(pet|pip|juno)\b/i.test(h)),`${key}: character name or pet mention in hints`);
    const questions=key==='quiz'?mc:key.startsWith('teach')?[l.teach_steps[Number(key.slice(5))].check]:[];
    for(const q of questions)for(const h of hints)ensure(!norm(h).includes(norm(q.options[q.correct_index])),`${key}: correct option leaked`);
  }
  if(l.sort_activity){const a=l.sort_activity;ensure(a.buckets?.length===3 && a.items?.length>=6 && a.items.length<=9,'sort needs 3 buckets and 6–9 items');a.items.forEach(i=>ensure(Number.isInteger(i.answer)&&i.answer>=0&&i.answer<3,'sort answer out of range'));ensure(!a.items.every((item,i)=>item.answer===i%3),'predictable sort pattern');}
  if(l.word_challenges)l.word_challenges.forEach((q,i)=>choice(q,`word${i}`,options));
  if(l.planner_fields?.length){ensure(nonempty(l.planner_title)&&nonempty(l.planner_intro),'planner title and intro required');ensure(new Set(l.planner_fields.map(f=>f.key)).size===l.planner_fields.length,'duplicate planner keys');l.planner_fields.forEach(f=>['key','label','hint'].forEach(k=>ensure(nonempty(f[k]),`planner ${k} required`)));}
  if(l.follow_up_challenges){ensure(l.follow_up_challenges.length===3,'3 follow-ups needed');ensure(l.follow_up_challenges.map(c=>c.difficulty).join('|')==='easy|medium|stretch','follow-up difficulties');l.follow_up_challenges.forEach(c=>['title','description','evidence_type'].forEach(k=>ensure(nonempty(c[k]),`challenge ${k} needed`)));}
  if(l.printable_resource){const p=l.printable_resource;['title','instructions','passage'].forEach(k=>ensure(nonempty(p[k]),`printable ${k} needed`));ensure(Array.isArray(p.prompts)&&p.prompts.length>0,'printable prompts needed');}
  let episodes=0;
  function scan(v,where='lesson') {
    if(!v || typeof v!=='object')return;
    if(v.svg){ensure(media,`${where}: media not intended`);svg(v,where);}
    if(v.episode){ensure(media,`${where}: media not intended`);episode(v.episode,where);episodes++;}
    ensure(!v.embed_url && !v.src && !v.url,`${where}: external media/link field not allowed`);
    for(const [k,child] of Object.entries(v))if(typeof child==='object')scan(child,`${where}.${k}`);
  }
  scan(l);
  const content={...l}; delete content.seed_key;
  ensure(!/\bpets?\b/i.test(JSON.stringify(content)),'pet mention in lesson content');
  ensure(!/https?:\/\/(?!www\.w3\.org\/2000\/svg)/i.test(JSON.stringify(l)),'external URL in lesson');
  ensure(Buffer.byteLength(JSON.stringify(l))<90000,'lesson JSON exceeds 90 KB authoring budget');
  if(media)ensure(episodes>=1&&episodes<=2,'gold lesson needs 1–2 episodes');
  return {stages:expected.length,episodes,bytes:Buffer.byteLength(JSON.stringify(l))};
}
function jsonLiterals(sql) {
  const found=[];
  for(const match of sql.matchAll(/json_patch\(\s*data\s*,\s*'((?:[^']|'')*)'\s*\)/gs))found.push(JSON.parse(match[1].replace(/''/g,"'")));
  for(const match of sql.matchAll(/\bjson\(\s*'((?:[^']|'')*)'\s*\)/gs))JSON.parse(match[1].replace(/''/g,"'"));
  return found;
}
export function validateMigration(file) {
  const sql=fs.readFileSync(file,'utf8');const lessons=jsonLiterals(sql);
  if(!sql.includes('Standard v2')) return {historical:true,jsonPatches:lessons.length};
  ensure(lessons.length>0,'v2 migration has no lesson patch');
  ensure(lessons.length<=25,'more than 25 lessons per migration');
  ensure(Buffer.byteLength(sql)<95000,'SQL exceeds 95 KB statement budget');
  ensure((sql.match(/\bUPDATE\s+lessons\b/gi)||[]).length===lessons.length,'one UPDATE per lesson required below statement limit');
  const results=lessons.map(l=>{ensure(l.coming_soon===null,'coming_soon must be deleted');return validateLesson(l);});
  return {lessons:lessons.length,statements:lessons.length,sqlBytes:Buffer.byteLength(sql),results};
}
if(process.argv[1] && path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)) {
  const args=process.argv.slice(2); const files=args.length?args:fs.readdirSync('worker/migrations').filter(f=>f.endsWith('.sql')).map(f=>path.join('worker/migrations',f));
  let failures=0;
  for(const file of files)try{console.log(`${file}: ${JSON.stringify(validateMigration(file))}`);}catch(error){failures++;console.error(`${file}: FAIL ${error.message}`);}
  if(failures)process.exitCode=1;
}
