-- Privacy-safe Workers AI metering: model identifiers and token counts only.
-- No prompts, responses, account identities or family records are stored.
-- Additive; also ensured at runtime for deployments before manual migration.
CREATE TABLE IF NOT EXISTS ai_inference_costs (
  id TEXT PRIMARY KEY,
  model TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  token_basis TEXT NOT NULL,
  estimated_usd REAL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ai_costs_time ON ai_inference_costs(created_at);
