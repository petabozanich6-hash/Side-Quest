CREATE TABLE IF NOT EXISTS owner_housekeeping_checks (kind TEXT PRIMARY KEY CHECK(kind IN ('d1_restore','r2_restore','cloudflare_billing')), checked_at TEXT NOT NULL);
