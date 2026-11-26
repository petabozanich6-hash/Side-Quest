CREATE TABLE IF NOT EXISTS support_stationery_documents (
 id TEXT PRIMARY KEY, channel TEXT NOT NULL CHECK(channel IN ('member','guest')), request_id TEXT NOT NULL, order_id TEXT,
 kind TEXT NOT NULL, title TEXT NOT NULL, filename TEXT NOT NULL, pdf_base64 TEXT NOT NULL, recipient TEXT NOT NULL, pages INTEGER NOT NULL,
 terms_version TEXT, terms_pdf_base64 TEXT, terms_pages INTEGER,
 fingerprint TEXT NOT NULL, created_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'saved' CHECK(status IN ('saved','sending','sent','review')), attempted_at TEXT, sent_at TEXT,
 UNIQUE(channel,request_id,fingerprint)
);
CREATE INDEX IF NOT EXISTS idx_support_stationery_request ON support_stationery_documents(channel,request_id,created_at);
