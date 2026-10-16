-- Additive only. The Worker also creates these tables on first use (CREATE TABLE IF NOT EXISTS, never ALTER),
-- so this migration and the runtime can run in either order.

-- One row per Workers AI model call: model, task, attempt, fallback, tokens, estimated USD, duration, status.
-- Never prompts, replies, child, family or email data.
CREATE TABLE IF NOT EXISTS ai_calls (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  requested_model TEXT NOT NULL,
  task TEXT,
  generation_id TEXT,
  attempt INTEGER NOT NULL DEFAULT 1,
  fallback INTEGER NOT NULL DEFAULT 0,
  input_tokens INTEGER,
  output_tokens INTEGER,
  token_basis TEXT NOT NULL,
  estimated_usd REAL,
  duration_ms INTEGER,
  status TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ai_calls_time ON ai_calls(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_calls_generation ON ai_calls(generation_id);

-- One row per "make me a lesson" request id: stops duplicate generations and charges, and records real progress.
CREATE TABLE IF NOT EXISTS ai_generation_jobs (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  phase TEXT,
  lesson_id TEXT,
  error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (family_id, request_id)
);
