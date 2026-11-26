-- Immutable learner-facing resource snapshots attached to individual workshop sessions.
CREATE TABLE support_english_workshop_resources (class_id TEXT PRIMARY KEY REFERENCES support_english_classes(id) ON DELETE CASCADE, resource_json TEXT NOT NULL);
