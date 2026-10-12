// Apply 0050 to an isolated SQLite database that already holds a family,
// a child, and learning progress. Does not touch the project D1 database.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const migration = path.join(root, "worker/migrations/0050_google_auth.sql");
const dir = mkdtempSync(path.join(tmpdir(), "sq-google-migrate-"));
const db = path.join(dir, "isolated.sqlite");
let failed = 0;

function sql(query) {
  return execFileSync("sqlite3", ["-bail", db, query], { encoding: "utf8" }).trim();
}
function check(name, actual, expected) {
  if (actual !== expected) {
    failed++;
    console.log(`FAIL ${name}\n  expected ${expected}\n  actual   ${actual}`);
  } else {
    console.log(`ok   ${name}`);
  }
}

sql(`
CREATE TABLE families (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  name TEXT NOT NULL,
  picture TEXT,
  is_owner INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  oauth_provider TEXT
);
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  pin_hash TEXT NOT NULL,
  stage TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE assignments (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  assignment_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  response_text TEXT,
  status TEXT NOT NULL,
  submitted_at TEXT NOT NULL
);
INSERT INTO families (id, name, owner_id, created_at) VALUES
  ('family-owner', 'Owner Family', 'user-owner', '2024-01-01T00:00:00.000Z'),
  ('family-parent', 'Parent Family', 'user-parent', '2024-02-01T00:00:00.000Z');
INSERT INTO users (id, family_id, email, password_hash, name, picture, is_owner, created_at, oauth_provider) VALUES
  ('user-owner', 'family-owner', 'owner@example.com', 'pbkdf2$100000$salt$owner-hash', 'Site Owner', NULL, 1, '2024-01-01T00:00:00.000Z', NULL),
  ('user-parent', 'family-parent', 'parent@example.com', 'pbkdf2$100000$salt$parent-hash', 'Ordinary Parent', NULL, 1, '2024-02-01T00:00:00.000Z', NULL);
INSERT INTO students (id, family_id, name, username, pin_hash, stage, created_at) VALUES
  ('student-1', 'family-owner', 'Ada', 'ada-pin', 'pbkdf2$pin$hash', 'S2', '2024-03-01T00:00:00.000Z'),
  ('student-2', 'family-parent', 'Bea', 'bea-pin', 'pbkdf2$pin$hash2', 'S2', '2024-03-02T00:00:00.000Z');
INSERT INTO assignments (id, family_id, student_id, lesson_id, status, created_at) VALUES
  ('assign-1', 'family-owner', 'student-1', 'lesson-1', 'in_progress', '2024-04-01T00:00:00.000Z');
INSERT INTO submissions (id, family_id, assignment_id, student_id, response_text, status, submitted_at) VALUES
  ('sub-1', 'family-owner', 'assign-1', 'student-1', 'PROGRESS_NOTE_KEEP', 'submitted', '2024-04-02T00:00:00.000Z');
`);

const before = {
  users: sql("SELECT id || '|' || family_id || '|' || email || '|' || password_hash || '|' || name || '|' || is_owner FROM users ORDER BY id"),
  students: sql("SELECT id || '|' || family_id || '|' || username || '|' || pin_hash FROM students ORDER BY id"),
  progress: sql("SELECT id || '|' || family_id || '|' || student_id || '|' || response_text || '|' || status FROM submissions"),
  assignment: sql("SELECT id || '|' || family_id || '|' || student_id || '|' || status FROM assignments"),
};

execFileSync("sqlite3", ["-bail", db, `.read ${migration}`], { encoding: "utf8" });

check("parent identities survive 0050", sql("SELECT id || '|' || family_id || '|' || email || '|' || password_hash || '|' || name || '|' || is_owner FROM users ORDER BY id"), before.users);
check("children survive 0050", sql("SELECT id || '|' || family_id || '|' || username || '|' || pin_hash FROM students ORDER BY id"), before.students);
check("submission progress survives 0050", sql("SELECT id || '|' || family_id || '|' || student_id || '|' || response_text || '|' || status FROM submissions"), before.progress);
check("assignment survives 0050", sql("SELECT id || '|' || family_id || '|' || student_id || '|' || status FROM assignments"), before.assignment);
check("existing users are not platform owners", sql("SELECT platform_role FROM users ORDER BY id"), "parent\nparent");
check("google subject starts empty", sql("SELECT COUNT(*) FROM users WHERE google_sub IS NOT NULL"), "0");
check("session table exists", sql("SELECT name FROM sqlite_master WHERE name = 'auth_sessions'"), "auth_sessions");

sql("UPDATE users SET platform_role = 'owner' WHERE id = 'user-owner'");
sql(`UPDATE users SET google_sub = 'google-owner', oauth_provider = 'google', picture = COALESCE(NULL, picture)
     WHERE id = 'user-owner' AND email = 'owner@example.com' AND google_sub IS NULL AND password_hash IS NOT NULL`);
sql(`UPDATE users SET picture = COALESCE(NULL, picture) WHERE id = 'user-owner'`);

check("owner role survives Google link updates", sql("SELECT platform_role FROM users WHERE id = 'user-owner'"), "owner");
check("owner family id survives", sql("SELECT family_id FROM users WHERE id = 'user-owner'"), "family-owner");
check("owner password hash survives", sql("SELECT password_hash FROM users WHERE id = 'user-owner'"), "pbkdf2$100000$salt$owner-hash");
check("ordinary parent stays a parent", sql("SELECT platform_role FROM users WHERE id = 'user-parent'"), "parent");
check("child still belongs to the owner family", sql("SELECT family_id || '|' || username || '|' || pin_hash FROM students WHERE id = 'student-1'"), "family-owner|ada-pin|pbkdf2$pin$hash");
check("progress text survives Google link", sql("SELECT response_text FROM submissions WHERE id = 'sub-1'"), "PROGRESS_NOTE_KEEP");

sql(`INSERT INTO families (id, name, owner_id, created_at) VALUES ('family-google', 'Ada Parent''s Family', 'user-google', '2026-10-13T00:00:00.000Z')`);
sql(`INSERT INTO users (id, family_id, email, password_hash, name, picture, oauth_provider, google_sub, is_owner, platform_role, created_at)
     VALUES ('user-google', 'family-google', 'new@example.com', NULL, 'Ada Parent', NULL, 'google', 'google-new', 1, 'parent', '2026-10-13T00:00:00.000Z')`);
check("new Google account is not an owner", sql("SELECT platform_role FROM users WHERE id = 'user-google'"), "parent");
check("owner role was not copied to the new account", sql("SELECT COUNT(*) FROM users WHERE platform_role = 'owner'"), "1");
check("original families remain", sql("SELECT COUNT(*) FROM families WHERE id IN ('family-owner', 'family-parent')"), "2");

rmSync(dir, { recursive: true, force: true });
if (failed) {
  console.log(`\n${failed} migration checks failed`);
  process.exit(1);
}
console.log("\nisolated 0050 migration checks passed");
