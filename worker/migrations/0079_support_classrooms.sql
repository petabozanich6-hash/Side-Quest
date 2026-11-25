-- Appointment-protected collaborative teaching board. No audio or video recording.
CREATE TABLE IF NOT EXISTS support_classrooms (order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE, is_open INTEGER NOT NULL DEFAULT 0 CHECK(is_open IN (0,1)), revision INTEGER NOT NULL DEFAULT 0, board_json TEXT NOT NULL DEFAULT '{"text":"","strokes":[]}', updated_at TEXT NOT NULL);
