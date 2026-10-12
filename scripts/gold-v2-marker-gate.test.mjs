// Regression: Year 3 rebuild files must be validated even without an explicit Standard v2 marker.
// Run: node --test scripts/gold-v2-marker-gate.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateMigration } from './validate-lessons.mjs';

test('strict Gold v2 validation cannot be bypassed by omitting marker', () => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sidequest-v2-'));
  const file=path.join(dir,'0088_example.sql');
  const bad={seed_key:'s2-eng-y3-w11-l1',title:'Too shallow',coming_soon:null};
  fs.writeFileSync(file,`UPDATE lessons SET data=json_patch(data,'${JSON.stringify(bad)}') WHERE seed_key='s2-eng-y3-w11-l1';`);
  try { assert.throws(()=>validateMigration(file),/Missing required|teach|quiz/); }
  finally { fs.rmSync(dir,{recursive:true,force:true}); }
});

test('older unmarked historical migration remains historical', () => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sidequest-history-'));
  const file=path.join(dir,'0059_historical.sql');
  fs.writeFileSync(file,"UPDATE lessons SET data=json_patch(data,'{\"seed_key\":\"s2-eng-y3-w11-l1\"}') WHERE seed_key='s2-eng-y3-w11-l1';");
  try { assert.equal(validateMigration(file).historical,true); }
  finally { fs.rmSync(dir,{recursive:true,force:true}); }
});
