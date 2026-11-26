CREATE TABLE IF NOT EXISTS support_club_certificate_templates (
 id TEXT PRIMARY KEY, object_key TEXT NOT NULL UNIQUE, sha256 TEXT NOT NULL,
 created_by TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS support_club_certificate_template_active (
 singleton INTEGER PRIMARY KEY CHECK(singleton=1),template_id TEXT NOT NULL REFERENCES support_club_certificate_templates(id)
);
ALTER TABLE support_club_certificates ADD COLUMN template_id TEXT REFERENCES support_club_certificate_templates(id);
