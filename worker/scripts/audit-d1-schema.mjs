// Read-only production D1 audit. Never executes DDL/DML, never changes migration tracking.
// Run: node worker/scripts/audit-d1-schema.mjs
// Needs Wrangler Cloudflare authentication. Output contains schema names only, not family data.
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const REQUIRED = {
  users: ["id", "email", "password_hash", "family_id", "email_verified_at", "email_verification_required_at"],
  families: ["id", "owner_id", "plan", "trial_ends_at", "subscription_status", "stripe_customer_id", "stripe_subscription_id"],
  password_resets: ["id", "user_id", "token_hash", "expires_at", "used_at", "created_at"],
  email_verification_tokens: ["id", "user_id", "token_hash", "expires_at", "used_at", "created_at"],
  dragon_hoard_offers: ["id", "mode", "code", "stripe_coupon_id", "stripe_promotion_id"],
  dragon_hoard_terms: ["offer_id", "duration_type"],
  parent_feedback: ["id", "family_id", "user_id", "status", "message"],
  parent_feedback_replies: ["id", "feedback_id", "parent_read_at"],
  announcement_broadcasts: ["id"],
  announcement_recipients: ["id"],
  homeschool_compass_progress: ["family_id"],
  ai_inference_costs: ["id"],
  assignments: ["id"],
  lessons: ["id"],
  students: ["id"],
  outcome_progress: ["student_id"],
  outcome_evidence: ["student_id"],
  admin_audit_log: ["id"],
  webauthn_credentials: ["id"],
};
export const REQUIRED_INDEXES = ["idx_password_resets_token", "idx_password_resets_user", "idx_email_verification_user", "idx_parent_feedback_family"];

export function compareSchema({ objects, columns, recorded, migrationFiles }) {
  const issues = [];
  const objectSet = new Set(objects.map(x => x.name));
  for (const [table, required] of Object.entries(REQUIRED)) {
    if (!objectSet.has(table)) { issues.push({ kind: "missing_table", name: table }); continue; }
    const found = new Set(columns.filter(x => x.table_name === table).map(x => x.name));
    for (const name of required) if (!found.has(name)) issues.push({ kind: "missing_column", name: table + "." + name });
  }
  for (const name of REQUIRED_INDEXES) if (!objectSet.has(name)) issues.push({ kind: "missing_index", name });
  const recordedSet = new Set(recorded.map(x => x.name));
  const repoSet = new Set(migrationFiles);
  const pending = migrationFiles.filter(x => !recordedSet.has(x));
  const unrecognised = [...recordedSet].filter(x => !repoSet.has(x));
  return { issues, pending_migration_records: pending, recorded_missing_from_repo: unrecognised };
}

function remoteSelect(query) {
  const result = spawnSync("npx", ["wrangler", "d1", "execute", "DB", "--remote", "--json", "--command", query],
    { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  if (result.status !== 0) throw new Error("Read-only D1 query failed: " + (result.stderr || result.stdout).slice(-1200));
  // Wrangler --json returns an array of statement results; strict parsing prevents misleading partial reports.
  const json = JSON.parse(result.stdout);
  if (!Array.isArray(json) || !json[0] || !Array.isArray(json[0].results) || json[0].success === false)
    throw new Error("Unexpected Wrangler D1 JSON response");
  return json[0].results;
}

function main() {
  const objects = remoteSelect("SELECT name, type FROM sqlite_master WHERE type IN ('table','index') AND name NOT LIKE 'sqlite_%'");
  const columns = remoteSelect("SELECT m.name AS table_name, p.name AS name FROM sqlite_master m JOIN pragma_table_info(m.name) p WHERE m.type='table'");
  const recorded = remoteSelect("SELECT name FROM d1_migrations");
  const migrationFiles = readdirSync(resolve(root, "worker/migrations")).filter(x => x.endsWith(".sql")).sort();
  const report = compareSchema({ objects, columns, recorded, migrationFiles });
  console.log(JSON.stringify({ database: "DB (remote)", checked_tables: Object.keys(REQUIRED).length,
    ...report, warning: "Migration-record discrepancies do not prove schema objects are missing. Never mark migrations applied automatically." }, null, 2));
  if (report.issues.length || report.pending_migration_records.length || report.recorded_missing_from_repo.length) process.exitCode = 1;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try { main(); } catch (error) { console.error(String(error)); process.exitCode = 2; }
}
