import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {validateLesson,validateMigration} from './validate-lessons.mjs';

const original=fs.readFileSync('worker/migrations/0044_s2_y3_w01_l1_gold_expression.sql','utf8');
const gold=JSON.parse(original.match(/json_patch\(\s*data\s*,\s*'((?:[^']|'')*)'\s*\)/s)[1].replace(/''/g,"'"));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'paid-lesson-'));
const quote=v=>JSON.stringify(v).replace(/'/g,"''");
const update=(patch,seed=gold.seed_key)=>`UPDATE lessons SET data=json_patch(data, '${quote(patch)}') WHERE seed_key='${seed}';`;
function run(sql){const file=path.join(dir,'batch.sql');fs.writeFileSync(file,'-- Standard v2\n'+sql);return validateMigration(file);}
try {
  const rich=structuredClone(gold);
  const image=rich.teach_steps[1].visual[0];
  image.svg=image.svg.replace('</svg>', '<desc>'+ 'Original diagram description. '.repeat(300)+'</desc></svg>');
  assert(Buffer.byteLength(image.svg)>6144);
  assert.doesNotThrow(()=>validateLesson(rich));
  const episode=rich.teach_steps[0].visual_before[0].episode;
  episode.scenes[0].lines[0].text+=' More explanation of reading decisions.'.repeat(40);
  assert.doesNotThrow(()=>validateLesson(rich));

  // A large original SVG keeps the text patch below the statement limit.
  const text=structuredClone(gold);
  text.worked_visuals=null;
  const media={worked_visuals:[{alt:'An explanatory original diagram',svg:'<svg viewBox="0 0 400 100"><desc>'+'Diagram description. '.repeat(3200)+'</desc><text x="10" y="40">Read in phrases</text></svg>'}]};
  const result=run(update(text)+'\n'+update(media));
  assert.equal(result.lessons,1);assert.equal(result.estimatedRowsWritten,2);
  assert.equal(result.largeLessons.length,1);
  assert(result.statementBytes.every(n=>n<=100000));
  assert.throws(()=>run(update({...gold,...media})),/100,000|two UPDATEs/);
  assert.throws(()=>run(update(gold)+'\n'+'SELECT '+ ' '.repeat(100001)+'1;'),/100,000/);
  assert.throws(()=>validateLesson({...gold,worked_example:'x'.repeat(2000001)}),/2 MB/);
  assert.throws(()=>run(Array.from({length:51},(_,i)=>update({...gold,seed_key:`test-${i}`},`test-${i}`)).join('\n')),/50 lessons/);
  assert.throws(()=>run(update(gold,'wrong-seed')),/seed key/);
  assert.throws(()=>run(update(gold)+'\n'+update(media)+'\n'+update(media)),/at most two/);
  console.log('Paid usage checks passed: rich SVG, long episode, split lesson, statement/row/batch limits and targets.');
} finally {fs.rmSync(dir,{recursive:true,force:true});}
