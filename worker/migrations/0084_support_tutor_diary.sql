CREATE TABLE IF NOT EXISTS support_tutor_diary (order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE, learner_label TEXT NOT NULL DEFAULT '', prep_minutes INTEGER NOT NULL DEFAULT 0 CHECK(prep_minutes BETWEEN 0 AND 120), wrap_minutes INTEGER NOT NULL DEFAULT 0 CHECK(wrap_minutes BETWEEN 0 AND 120), details_json TEXT NOT NULL DEFAULT '{}', ready INTEGER NOT NULL DEFAULT 0 CHECK(ready IN (0,1)), revision INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS support_busy_blocks (id TEXT PRIMARY KEY,label TEXT NOT NULL,start_at TEXT NOT NULL,end_at TEXT NOT NULL,created_at TEXT NOT NULL);

CREATE INDEX IF NOT EXISTS idx_support_busy_blocks_time ON support_busy_blocks(start_at,end_at);
