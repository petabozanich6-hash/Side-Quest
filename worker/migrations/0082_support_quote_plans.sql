-- Immutable reviewed plans attached to an issued quotation. Private teaching notes stored separately.
CREATE TABLE IF NOT EXISTS support_quote_plans (channel TEXT NOT NULL CHECK(channel IN ('member','guest')), quote_id TEXT NOT NULL, request_id TEXT NOT NULL, public_json TEXT NOT NULL, private_json TEXT NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY(channel,quote_id));
