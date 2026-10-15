/**
 * Owner HQ schema (migration 0060). Additive only: new tables and one reference row. It changes no existing row and
 * grants no role to anyone; promoting the Owner is a separate, approval-gated step (docs/OWNER_HQ.md).
 *
 * Deploys don't run migrations, so the Worker also applies these exact statements at runtime, once per instance.
 * Every statement is idempotent (IF NOT EXISTS / OR IGNORE), so running the migration after the runtime ensure, or the
 * other way round, is safe. A test keeps this list and worker/migrations/0060_owner_hq.sql identical.
 */
export const OWNER_SCHEMA: readonly string[] = [
  // Administrative roles. Separate from families.plan: buying a membership never grants a role, and the INTERNAL
  // (complimentary) plan never grants one either. Ordinary customers have no row in user_roles.
  `CREATE TABLE IF NOT EXISTS roles (
  name TEXT PRIMARY KEY NOT NULL,
  description TEXT NOT NULL
)`,
  `INSERT OR IGNORE INTO roles (name, description) VALUES ('owner', 'Full platform administration')`,
  `CREATE TABLE IF NOT EXISTS user_roles (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL REFERENCES roles(name),
  granted_by TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  granted_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  revoked_at TEXT
)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roles_active ON user_roles (user_id, role) WHERE revoked_at IS NULL`,
  // Account lifecycle per family (the billing and sign-in unit). No row = active, auth_version 0, so every existing
  // family keeps working. Every token carries auth_version; bumping it signs the whole family out everywhere.
  `CREATE TABLE IF NOT EXISTS family_admin_state (
  family_id TEXT PRIMARY KEY NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  suspended_at TEXT,
  suspended_reason TEXT,
  auth_version INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
)`,
  // Every administrative change. actor_user_id is NULL for operator actions (the promotion script).
  `CREATE TABLE IF NOT EXISTS admin_audit_log (
  id TEXT PRIMARY KEY NOT NULL,
  actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  actor_label TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL DEFAULT '',
  target_id TEXT NOT NULL DEFAULT '',
  detail_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
)`,
  `CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON admin_audit_log (created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_admin_audit_target ON admin_audit_log (target_type, target_id)`,
  // Per-family security events (suspensions, sign-outs, step-ups). Metadata only: never passwords, tokens or content.
  `CREATE TABLE IF NOT EXISTS security_events (
  id TEXT PRIMARY KEY NOT NULL,
  family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id TEXT,
  event_type TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
)`,
  `CREATE INDEX IF NOT EXISTS idx_security_events_family ON security_events (family_id, created_at)`,
  // Passkeys (WebAuthn) for administrative step-up.
  `CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  public_key TEXT NOT NULL,
  counter INTEGER NOT NULL DEFAULT 0,
  transports TEXT NOT NULL DEFAULT '[]',
  device_type TEXT NOT NULL DEFAULT '',
  backed_up INTEGER NOT NULL DEFAULT 0,
  label TEXT NOT NULL DEFAULT 'Passkey',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_used_at TEXT
)`,
  `CREATE INDEX IF NOT EXISTS idx_webauthn_credentials_user ON webauthn_credentials (user_id)`,
  // Single-use challenges, bound to the sign-in session (token "sid") that asked for them.
  `CREATE TABLE IF NOT EXISTS webauthn_challenges (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('register', 'authenticate')),
  challenge TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
)`,
  `CREATE INDEX IF NOT EXISTS idx_webauthn_challenges_session ON webauthn_challenges (user_id, session_id, purpose)`,
  // Passkey step-up per sign-in session. Tokens are stateless, so this is the only server-side session state.
  `CREATE TABLE IF NOT EXISTS admin_step_up (
  session_id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  elevated_until TEXT NOT NULL
)`,
  // Owner-managed, validated configuration (never secrets). Absent keys use the defaults in code.
  `CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value_json TEXT NOT NULL,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
)`,
  // Unhandled API errors: method, route pattern and error class only (no ids, bodies or messages).
  `CREATE TABLE IF NOT EXISTS app_errors (
  id TEXT PRIMARY KEY NOT NULL,
  method TEXT NOT NULL,
  route TEXT NOT NULL,
  status INTEGER NOT NULL,
  error_name TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
)`,
  `CREATE INDEX IF NOT EXISTS idx_app_errors_created ON app_errors (created_at)`,
  // Fixed-window request counters for administrative rate limits, shared by every Worker instance.
  `CREATE TABLE IF NOT EXISTS admin_rate_limits (
  key TEXT PRIMARY KEY NOT NULL,
  window_started INTEGER NOT NULL,
  hits INTEGER NOT NULL DEFAULT 0
)`,
];

let ready = false;
/** Applies OWNER_SCHEMA once per Worker instance. Additive and idempotent. */
export async function ensureOwnerSchema(db: D1Database) {
  if (ready) return;
  await db.batch(OWNER_SCHEMA.map((sql) => db.prepare(sql)));
  ready = true;
}
/** Tests only: forget that the schema was ensured. */
export function resetOwnerSchemaFlag() {
  ready = false;
}
