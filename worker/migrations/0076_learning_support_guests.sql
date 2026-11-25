-- Isolated guest identities and tutoring records. No family account, plan, trial or billing side effects.
CREATE TABLE IF NOT EXISTS support_guest_links (token_hash TEXT PRIMARY KEY,email TEXT NOT NULL,expires_at TEXT NOT NULL,used_at TEXT);

CREATE INDEX IF NOT EXISTS idx_support_guest_links_expiry ON support_guest_links(expires_at);

CREATE TABLE IF NOT EXISTS support_guest_sessions (token_hash TEXT PRIMARY KEY,email TEXT NOT NULL,expires_at TEXT NOT NULL);

CREATE INDEX IF NOT EXISTS idx_support_guest_sessions_expiry ON support_guest_sessions(expires_at);

CREATE TABLE IF NOT EXISTS support_guest_requests (id TEXT PRIMARY KEY,email TEXT NOT NULL,parent_name TEXT NOT NULL,subject TEXT NOT NULL,message TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewing','in_progress','resolved','closed')),created_at TEXT NOT NULL,updated_at TEXT NOT NULL,seen_at TEXT);

CREATE INDEX IF NOT EXISTS idx_support_guest_requests_email ON support_guest_requests(email,created_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_guest_requests_updated ON support_guest_requests(updated_at DESC);

CREATE TABLE IF NOT EXISTS support_guest_quotes (id TEXT PRIMARY KEY,request_id TEXT NOT NULL REFERENCES support_guest_requests(id) ON DELETE CASCADE,scope TEXT NOT NULL,delivery TEXT NOT NULL,amount_cents INTEGER NOT NULL CHECK(amount_cents BETWEEN 0 AND 1000000),currency TEXT NOT NULL DEFAULT 'AUD' CHECK(currency='AUD'),status TEXT NOT NULL DEFAULT 'offered' CHECK(status IN ('offered','interested','declined','withdrawn')),created_at TEXT NOT NULL,expires_at TEXT NOT NULL,responded_at TEXT,withdrawn_at TEXT);

CREATE INDEX IF NOT EXISTS idx_support_guest_quotes_thread ON support_guest_quotes(request_id,created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_support_guest_quotes_open ON support_guest_quotes(request_id) WHERE status IN ('offered','interested');

CREATE TABLE IF NOT EXISTS support_guest_messages (id TEXT PRIMARY KEY,request_id TEXT NOT NULL REFERENCES support_guest_requests(id) ON DELETE CASCADE,sender TEXT NOT NULL CHECK(sender IN ('parent','owner')),body TEXT NOT NULL,created_at TEXT NOT NULL);

CREATE INDEX IF NOT EXISTS idx_support_guest_messages_thread ON support_guest_messages(request_id,created_at);
