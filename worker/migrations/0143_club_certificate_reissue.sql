CREATE TABLE IF NOT EXISTS support_club_certificate_reissues (
 certificate_id TEXT PRIMARY KEY REFERENCES support_club_certificates(id),
 template_id TEXT NOT NULL REFERENCES support_club_certificate_templates(id),
 approved_by TEXT NOT NULL,
 attempted_at TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('sending','sent','review','suppressed')),
 sent_at TEXT
);
