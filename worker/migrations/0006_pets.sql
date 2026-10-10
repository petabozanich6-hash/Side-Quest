CREATE TABLE IF NOT EXISTS pets (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL UNIQUE,
  family_id TEXT NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  happiness INTEGER NOT NULL DEFAULT 80,
  created_at TEXT NOT NULL,
  last_fed TEXT,
  last_played TEXT,
  background TEXT,
  accessories TEXT NOT NULL DEFAULT '[]',
  activity TEXT NOT NULL DEFAULT '[]',
  items TEXT NOT NULL DEFAULT '[]',
  hatched INTEGER NOT NULL DEFAULT 0,
  hatched_at TEXT,
  egg_care_dates TEXT NOT NULL DEFAULT '[]',
  next_poop_at TEXT,
  poop_pending INTEGER NOT NULL DEFAULT 0,
  poop_since TEXT,
  unlocked_accessories TEXT NOT NULL DEFAULT '[]',
  play_day TEXT,
  play_count INTEGER NOT NULL DEFAULT 0,
  cleans_total INTEGER NOT NULL DEFAULT 0,
  care_paused INTEGER NOT NULL DEFAULT 0,
  paused_at TEXT,
  last_streak_date TEXT,
  care_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  revived_count INTEGER NOT NULL DEFAULT 0,
  extra TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_pets_family ON pets(family_id, student_id);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL UNIQUE,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT,
  lesson_id TEXT,
  lesson_title TEXT,
  learning_area TEXT,
  stage TEXT,
  outcome_codes TEXT NOT NULL DEFAULT '[]',
  level TEXT NOT NULL,
  awarded_at TEXT NOT NULL,
  box_prizes TEXT NOT NULL DEFAULT '[]',
  claimed INTEGER NOT NULL DEFAULT 0,
  chosen_box INTEGER,
  prize TEXT,
  created_at TEXT NOT NULL,
  claimed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_achievements_family_student ON achievements(family_id, student_id, awarded_at DESC);

CREATE TABLE IF NOT EXISTS seasonal_packs (
  family_id TEXT NOT NULL,
  pack TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  decorations INTEGER NOT NULL DEFAULT 1,
  prize INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (family_id, pack)
);

CREATE TABLE IF NOT EXISTS seasonal_prizes (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  family_id TEXT NOT NULL,
  pack TEXT NOT NULL,
  year INTEGER NOT NULL,
  prize_id TEXT NOT NULL,
  claimed_at TEXT NOT NULL,
  worn INTEGER NOT NULL DEFAULT 0,
  UNIQUE (student_id, pack, year)
);

CREATE INDEX IF NOT EXISTS idx_seasonal_prizes_student ON seasonal_prizes(student_id, claimed_at);

ALTER TABLE cheers ADD COLUMN seen_at TEXT;
