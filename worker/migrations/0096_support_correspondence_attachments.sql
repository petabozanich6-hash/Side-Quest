CREATE TABLE IF NOT EXISTS support_correspondence_attachments (
 id TEXT PRIMARY KEY, document_id TEXT NOT NULL REFERENCES support_stationery_documents(id) ON DELETE CASCADE,
 filename TEXT NOT NULL, mime TEXT NOT NULL CHECK(mime='application/pdf'), size_bytes INTEGER NOT NULL,
 storage_key TEXT NOT NULL UNIQUE, sha256 TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_support_correspondence_attachments_document ON support_correspondence_attachments(document_id,created_at);

CREATE TABLE IF NOT EXISTS support_correspondence_payment_links (
 document_id TEXT PRIMARY KEY REFERENCES support_stationery_documents(id) ON DELETE CASCADE,
 url TEXT NOT NULL, updated_at TEXT NOT NULL
);
