#!/usr/bin/env node
// Quality audit for D1 lesson migrations. Read-only; fails closed for unaudited lessons.
// Run: node scripts/audit-y3-d1-quality.mjs worker/migrations/0085_s2_y3_w10_four_depth_revisions.sql
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

export function auditLesson(l) {
  const issues=[];
  const add=(code,detail)=>issues.push({code,detail});
  const steps=l.teach_steps||[];
  const quiz=l.quiz||[];
  if(steps.length!==4)add('TEACH_STEPS','Stage 2 expects four teaching stages');
  if(quiz.filter(q=>q.type==='multiple_choice').length!==8||quiz.filter(q=>q.type==='short_answer').length!==2)add('QUIZ_SHAPE','Expected eight MC and two written questions');
  if(!Array.isArray(l.outcome_codes)||!l.outcome_codes.length)add('NESA_UNVERIFIED','No verified curriculum outcome mapping');
  const parent=(l.parent_notes||'').split(/\n\s*\n/);
  if(parent.some(x=>!/^Parent:/.test(x.trim())))add('PARENT_HIDDEN','Not every parent paragraph begins with Parent:');
  if(!l.worked_visuals?.length)add('VISUAL_MISSING','No original teaching visual');
  else if(l.worked_visuals.every(v=>/step one|step two|step three|step four|learn|model|try|check|notice|explain|apply|verify|method stages|learning stages/i.test((v.svg||'')+' '+(v.caption||''))))add('VISUAL_GENERIC','Visual shows generic process instead of topic-specific content');
  const hints=l.stage_hints||{};
  for(const [stage,hs] of Object.entries(hints)){
    if(!Array.isArray(hs)||hs.length!==3)add('HINT_COUNT',stage);
    if(Array.isArray(hs)&&hs.some(h=>/find (one|a|an|the) (exact|particular|relevant)|return to the original|show your working|explain.*check/i.test(h)))add('HINT_REVIEW',stage+' contains boilerplate/scaffold to inspect');
  }
  for(let i=0;i<steps.length;i++){
    const t=steps[i];
    if((t.explain||'').length<300)add('TEACH_DEPTH',`teach${i} explanation under 300 characters`);
    if((t.example||'').includes(l.independent_task||'NON_MATCHABLE_SENTINEL'))add('INDEPENDENT_EXPOSURE',`teach${i} embeds full independent prompt`);
  }
  if(/Gold.depth|revision|rebuild/i.test(l.title||''))add('EDITORIAL_REVIEW','Check title for non-child editorial labels');
  return issues;
}
export function auditSql(sql) {
  const lessons=[...sql.matchAll(/data=json_patch\(data,'((?:[^']|'')*)'\)/gs)]
    .map(m=>JSON.parse(m[1].replace(/''/g,"'")));
  return lessons.map(l=>({seed_key:l.seed_key,issues:auditLesson(l)}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const paths=process.argv.slice(2);
  if(!paths.length){console.error('Provide one or more migration paths');process.exitCode=2;}
  for(const p of paths){
    const results=auditSql(fs.readFileSync(p,'utf8'));
    if(!results.length){console.error(p+': no lesson patches parsed');process.exitCode=1;continue;}
    for(const r of results)console.log(JSON.stringify({file:p,...r}));
    if(results.some(r=>r.issues.length))process.exitCode=1;
  }
}
