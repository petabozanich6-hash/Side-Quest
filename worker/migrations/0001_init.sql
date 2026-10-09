CREATE TABLE IF NOT EXISTS families (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  name TEXT NOT NULL,
  picture TEXT,
  is_owner INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id),
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  pin_hash TEXT NOT NULL,
  birth_year INTEGER,
  stage TEXT NOT NULL,
  year_level TEXT,
  theme TEXT,
  interests TEXT NOT NULL DEFAULT '[]',
  notes TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_family ON users(family_id);
CREATE INDEX IF NOT EXISTS idx_students_family ON students(family_id);
