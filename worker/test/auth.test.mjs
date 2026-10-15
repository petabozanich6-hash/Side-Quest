// Sign-in security: works on a database that hasn't had migration 0058 yet, and only failures are throttled.
import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { ensureAuthSchema, loginBlocked, recordLoginFailure, clearLoginFailures } from "../src/loginThrottle.ts";

test("runtime schema matches migration 0058 and keeps existing children at version 0", async () => {
  const db = makeDb("0058");
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at) VALUES ('f','F','u','2026-01-01')").run();
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,created_at) VALUES ('s','f','Kid','kid','x','S2','2026-01-01')").run();
  await ensureAuthSchema(db);
  assert.equal(db.raw.prepare("SELECT credential_version v FROM students WHERE id='s'").get().v, 0);
  const migrated = makeDb();
  const cols = (d, t) => d.raw.prepare(`SELECT name, type, "notnull", dflt_value FROM pragma_table_info('${t}') ORDER BY cid`).all();
  assert.deepEqual(cols(db, "login_attempts"), cols(migrated, "login_attempts"));
  assert.deepEqual(cols(db, "students").at(-1), cols(migrated, "students").find((c) => c.name === "credential_version"));
});

test("only failed sign-ins count, per account, and success clears them; child and parent counters are separate", async () => {
  const db = makeDb();
  for (let i = 0; i < 7; i++) await recordLoginFailure(db, "child", "kid", "");
  assert.equal(await loginBlocked(db, "child", "kid", ""), false);
  await recordLoginFailure(db, "child", "kid", "");
  assert.equal(await loginBlocked(db, "child", "kid", ""), true, "8 failures block");
  assert.equal(await loginBlocked(db, "parent", "kid", ""), false, "a child username never locks out a parent account");
  assert.equal(await loginBlocked(db, "child", "other", ""), false);
  await clearLoginFailures(db, "child", "kid");
  assert.equal(await loginBlocked(db, "child", "kid", ""), false);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM login_attempts WHERE key LIKE '%kid%'").get().n, 0, "keys are hashed, never stored in clear");
});
