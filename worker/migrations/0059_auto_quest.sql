-- Auto-Quest proposals. Additive only: one new table; no existing rows are read differently, changed or deleted.
-- The Worker also creates this table at runtime if this migration has not been applied yet (see autoQuest.ts).
-- One row per timetabled lesson slot (calendar_events.id) that Auto-Quest planned for. A proposal is only a suggestion:
-- nothing is assigned until a parent approves it (status 'assigned' with assignment_id). 'generated' marks a slot whose
-- lesson was drafted with AI at the parent's request; re-planning never replaces it.
CREATE TABLE IF NOT EXISTS auto_quest_proposals (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  calendar_event_id TEXT NOT NULL,
  date TEXT NOT NULL,
  learning_area TEXT,
  action TEXT NOT NULL,
  purpose TEXT,
  outcome_codes TEXT NOT NULL DEFAULT '[]',
  framework TEXT,
  lesson_id TEXT,
  generated INTEGER NOT NULL DEFAULT 0,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'proposed',
  assignment_id TEXT,
  decided_by TEXT,
  decided_at TEXT,
  decision_note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (family_id, calendar_event_id)
);
CREATE INDEX IF NOT EXISTS idx_auto_quest_student ON auto_quest_proposals (family_id, student_id, date);
