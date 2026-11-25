CREATE TABLE IF NOT EXISTS support_video_rooms (order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE, meeting_id TEXT UNIQUE, status TEXT NOT NULL CHECK(status IN ('creating','ready','closing','closed','review')), expires_at TEXT NOT NULL, updated_at TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS support_video_participants (order_id TEXT NOT NULL REFERENCES support_video_rooms(order_id) ON DELETE CASCADE, role TEXT NOT NULL CHECK(role IN ('tutor','family')), participant_id TEXT, status TEXT NOT NULL CHECK(status IN ('creating','ready','review')), PRIMARY KEY(order_id,role));

CREATE INDEX IF NOT EXISTS idx_support_video_cleanup ON support_video_rooms(status,expires_at);
