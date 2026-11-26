CREATE TABLE IF NOT EXISTS support_club_certificate_email (
 certificate_id TEXT PRIMARY KEY REFERENCES support_club_certificates(id),
 template_id TEXT NOT NULL REFERENCES support_club_certificate_templates(id),
 status TEXT NOT NULL CHECK(status IN ('sending','sent','review','suppressed')),
 attempted_at TEXT NOT NULL,
 sent_at TEXT
);
