-- Address is supplied explicitly for a free printed certificate, never inferred from billing.
CREATE TABLE IF NOT EXISTS support_club_certificate_postal (
 certificate_id TEXT PRIMARY KEY REFERENCES support_club_certificates(id),
 status TEXT NOT NULL CHECK(status IN ('ready','printed','posted')),
 address_json TEXT,
 revision INTEGER NOT NULL DEFAULT 1 CHECK(revision>=1),
 confirmed_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 printed_at TEXT,
 posted_at TEXT,
 posted_by TEXT,
 CHECK((status='posted' AND address_json IS NULL AND posted_at IS NOT NULL AND posted_by IS NOT NULL) OR (status<>'posted' AND address_json IS NOT NULL AND posted_at IS NULL AND posted_by IS NULL))
);
