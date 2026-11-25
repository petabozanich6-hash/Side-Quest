-- Additive only; preserves existing enquiries and all billing records.
CREATE TABLE IF NOT EXISTS learning_support_quotes (id TEXT PRIMARY KEY, feedback_id TEXT NOT NULL REFERENCES parent_feedback(id) ON DELETE CASCADE, scope TEXT NOT NULL, delivery TEXT NOT NULL, amount_cents INTEGER NOT NULL CHECK(amount_cents BETWEEN 0 AND 1000000), currency TEXT NOT NULL DEFAULT 'AUD' CHECK(currency='AUD'), status TEXT NOT NULL DEFAULT 'offered' CHECK(status IN ('offered','interested','declined','withdrawn')), created_at TEXT NOT NULL, expires_at TEXT NOT NULL, responded_at TEXT, withdrawn_at TEXT);

CREATE INDEX IF NOT EXISTS idx_support_quotes_thread ON learning_support_quotes(feedback_id,created_at DESC,id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_support_quotes_open ON learning_support_quotes(feedback_id) WHERE status IN ('offered','interested');
