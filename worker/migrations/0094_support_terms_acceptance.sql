CREATE TABLE IF NOT EXISTS support_terms_acceptances (
 order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE,
 channel TEXT NOT NULL CHECK(channel IN ('member','guest')),
 request_id TEXT NOT NULL, accepted_by TEXT NOT NULL,
 agreement_version TEXT NOT NULL, agreement_pdf_base64 TEXT NOT NULL,
 arrangements_json TEXT NOT NULL, fingerprint TEXT NOT NULL, accepted_at TEXT NOT NULL
);
