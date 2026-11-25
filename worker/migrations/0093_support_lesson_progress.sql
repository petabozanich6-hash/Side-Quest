CREATE TABLE IF NOT EXISTS support_lesson_progress (
 order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE,
 checkpoints_json TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL
);
