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
