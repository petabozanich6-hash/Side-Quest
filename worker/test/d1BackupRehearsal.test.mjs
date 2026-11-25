import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {rehearse} from '../scripts/rehearse-d1-backup.mjs';
function fixture(t){const db=new DatabaseSync(':memory:');t.after(()=>db.close());db.exec("CREATE TABLE d1_migrations(name TEXT); INSERT INTO d1_migrations VALUES('0060.sql'); CREATE TABLE users(id TEXT PRIMARY KEY,email_verified_at TEXT); INSERT INTO users VALUES('synthetic',NULL);");return db;}
const baseline={name:'0060.sql',sql:'SELECT 1;'};
test('rehearses additive pending migration without editing recorded history',t=>{const db=fixture(t);const result=rehearse(db,[baseline,{name:'0061.sql',sql:'CREATE TABLE support(id TEXT PRIMARY KEY);'}]);assert.equal(result.ok,true);assert.equal(result.pending,1);assert.equal(db.prepare('SELECT count(*) n FROM d1_migrations').get().n,1);assert.equal(db.prepare('SELECT count(*) n FROM users').get().n,1);});
test('stops on already-present column instead of silently skipping',t=>{const db=fixture(t);const result=rehearse(db,[baseline,{name:'0069.sql',sql:'ALTER TABLE users ADD COLUMN email_verified_at TEXT;'},{name:'0070.sql',sql:'CREATE TABLE later(id TEXT);'}]);assert.equal(result.ok,false);assert.equal(result.failed,'0069.sql');assert.match(result.reason,/Existing column/);assert.equal(db.prepare("SELECT count(*) n FROM sqlite_master WHERE name='later'").get().n,0);});
test('rolls back existing row count changes',t=>{const db=fixture(t);const result=rehearse(db,[baseline,{name:'0061.sql',sql:'DELETE FROM users;'}]);assert.equal(result.ok,false);assert.deepEqual(result.changed,['users']);assert.equal(db.prepare('SELECT count(*) n FROM users').get().n,1);});
test('rejects recorded migration not found in repo',t=>{const db=fixture(t);const result=rehearse(db,[]);assert.equal(result.ok,false);assert.deepEqual(result.unknown,['0060.sql']);});

test('known email drift retains the other SQL and adds genuinely missing columns',t=>{
 const db=fixture(t);
 const migration={name:'0069_parent_email_verification.sql',sql:'ALTER TABLE users ADD COLUMN email_verified_at TEXT;\nALTER TABLE users ADD COLUMN email_verification_required_at TEXT;\nCREATE TABLE IF NOT EXISTS email_verification_tokens(id TEXT PRIMARY KEY,user_id TEXT);\nCREATE INDEX IF NOT EXISTS idx_email_verification_user ON email_verification_tokens(user_id);'};
 const result=rehearse(db,[baseline,migration]);
 assert.equal(result.ok,true);
 assert.deepEqual(result.reconciled,[{migration:migration.name,column:'users.email_verified_at'}]);
 assert.ok(db.prepare('PRAGMA table_info(users)').all().some(r=>r.name==='email_verification_required_at'));
 assert.equal(db.prepare("SELECT count(*) n FROM sqlite_master WHERE name='idx_email_verification_user'").get().n,1);
 assert.equal(db.prepare('SELECT count(*) n FROM d1_migrations').get().n,1);
});
test('known review flag drift rejects a different default or type',t=>{
 const db=fixture(t);db.exec("CREATE TABLE submissions(review_flags TEXT NOT NULL DEFAULT 'wrong')");
 const result=rehearse(db,[baseline,{name:'0070_question_review_flags.sql',sql:"ALTER TABLE submissions ADD COLUMN review_flags TEXT NOT NULL DEFAULT '[]';"}]);
 assert.equal(result.ok,false);assert.match(result.reason,/Existing column/);
});
test('known review flag drift accepts the exact definition',t=>{
 const db=fixture(t);db.exec("CREATE TABLE submissions(review_flags TEXT NOT NULL DEFAULT '[]')");
 const result=rehearse(db,[baseline,{name:'0070_question_review_flags.sql',sql:"ALTER TABLE submissions ADD COLUMN review_flags TEXT NOT NULL DEFAULT '[]';"}]);
 assert.equal(result.ok,true);assert.deepEqual(result.reconciled,[{migration:'0070_question_review_flags.sql',column:'submissions.review_flags'}]);
});
test('all four prior learning columns may be reconciled on the offline copy',t=>{
 const db=fixture(t);const fields=['at','by','source','note'].map(n=>'prior_learning_'+n);
 db.exec('CREATE TABLE outcome_progress('+fields.map(n=>n+' TEXT').join(',')+')');
 const result=rehearse(db,[baseline,{name:'0071_outcome_prior_learning.sql',sql:fields.map(n=>'ALTER TABLE outcome_progress ADD COLUMN '+n+' TEXT;').join('\n')}]);
 assert.equal(result.ok,true);assert.equal(result.reconciled.length,4);
});
