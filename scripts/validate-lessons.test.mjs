import fs from 'node:fs';
import assert from 'node:assert/strict';
import {validateLesson,validateMigration} from './validate-lessons.mjs';

const file='worker/migrations/0044_s2_y3_w01_l1_gold_expression.sql';
const sql=fs.readFileSync(file,'utf8');
const match=sql.match(/json_patch\(\s*data\s*,\s*'((?:[^']|'')*)'\s*\)/s);
const gold=JSON.parse(match[1].replace(/''/g,"'"));
assert.equal(validateMigration(file).lessons,1);
for(const [name,mutate,message] of [
 ['missing field',l=>delete l.guided_practice,/Missing required/],
 ['check index',l=>l.teach_steps[0].check.correct_index=4,/out of range/],
 ['wrong mixed quiz',l=>l.quiz[9]={...l.quiz[0]},/8 MC and 2 written/],
 ['missing hint stage',l=>delete l.stage_hints.teach3,/match generated/],
 ['duplicate hints',l=>l.stage_hints.accept[1]=l.stage_hints.accept[0],/unique hints/],
 ['answer leak',l=>l.stage_hints.teach0[0]=l.teach_steps[0].check.options[1],/option leaked/],
 ['unsafe SVG',l=>l.teach_steps[1].visual[0].svg='<svg viewBox="0 0 400 100"><script>bad()</script></svg>',/unsafe/],
 ['missing alt',l=>delete l.teach_steps[1].visual[0].alt,/alt required/],
 ['external resource',l=>l.resources=[{embed_url:'https://example.org'}],/match generated|external/],
 ['bad episode',l=>l.teach_steps[0].visual_before[0].episode.scenes[0].lines[0].who='unknown',/speaker/],
 ['parent prefix',l=>l.parent_notes=l.parent_notes.replaceAll('Parent:', 'Note:'),/Parent:/],
 ['empty string',l=>l.response_prompt='',/empty string/],
 ['model missing',l=>l.parent_notes=l.parent_notes.replace(l.quiz[8].sample_answer,'different model'),/model missing/],
 ['pet mention',l=>l.guided_practice+=' Use a pet in the story.',/pet mention/],
]) {
 const copy=structuredClone(gold);mutate(copy);assert.throws(()=>validateLesson(copy),message,name);
}
assert.throws(()=>validateLesson(gold,{media:false}),/media not intended/);
console.log('Gold validation and 15 invalid-content regression cases passed.');
