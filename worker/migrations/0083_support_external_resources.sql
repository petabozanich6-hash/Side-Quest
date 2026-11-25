CREATE TABLE IF NOT EXISTS support_files (id TEXT PRIMARY KEY,title TEXT NOT NULL,subject TEXT NOT NULL,year_level TEXT NOT NULL,filename TEXT NOT NULL,mime TEXT NOT NULL,size_bytes INTEGER NOT NULL,storage_key TEXT NOT NULL UNIQUE,audience TEXT NOT NULL CHECK(audience IN ('tutor','learner')),status TEXT NOT NULL CHECK(status IN ('active','archived')),created_at TEXT NOT NULL);

CREATE INDEX IF NOT EXISTS idx_support_files_search ON support_files(status,audience,created_at);

CREATE TABLE IF NOT EXISTS support_file_grants (order_id TEXT NOT NULL REFERENCES support_service_orders(id) ON DELETE CASCADE,file_id TEXT NOT NULL REFERENCES support_files(id),created_at TEXT NOT NULL,revoked_at TEXT,PRIMARY KEY(order_id,file_id));
