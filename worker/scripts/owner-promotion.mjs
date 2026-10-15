#!/usr/bin/env node
/**
 * One-time promotion of an EXISTING parent account to Owner (Owner HQ). See docs/OWNER_HQ.md.
 * Run only with the owner's explicit approval, from a machine where `wrangler login` is done.
 *
 *   OWNER_EXPECTED_EMAIL=<owner email> node worker/scripts/owner-promotion.mjs preflight --user-id <id>   (read-only)
 *   OWNER_EXPECTED_EMAIL=<owner email> node worker/scripts/owner-promotion.mjs apply --user-id <id> --confirm PROMOTE
 *   OWNER_EXPECTED_EMAIL=<owner email> node worker/scripts/owner-promotion.mjs verify --user-id <id>      (read-only)
 *
 * Testing against a local D1 instead of production: add  --local [--config <file>] [--persist-to <dir>].
 *
 * Safety:
 * - The account is identified by its internal user id (shown in Side-Quest under Trust & Support -> Your account).
 *   The email on record must also equal OWNER_EXPECTED_EMAIL; output shows only a masked email.
 * - Refuses if any Owner already exists: this bootstraps the first Owner only.
 * - Remote apply records a D1 Time Travel bookmark first and refuses without one.
 * - Writes only a user_roles row and an audit row, with one guarded INSERT ... SELECT that re-checks the id, the email,
 *   that the family is active and that no Owner exists. Never touches passwords, email, plans, children or content.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PRODUCTION = { name: "sidequest-db1", uuid: "d26b63e2-d9e1-4021-b9c5-c494b607aa14" };
export const USER_ID = /^[A-Za-z0-9_-]{1,64}$/;
const EMAIL = /^[^\s'"\\;]+@[^\s'"\\;]+\.[^\s'"\\;]+$/;
const REQUIRED_TABLES = ["users", "families", "roles", "user_roles", "family_admin_state", "admin_audit_log"];
const ROOT = resolve(fileURLToPath(new URL("../../", import.meta.url)));

export function maskEmail(email) {
  const [local = "", domain = ""] = String(email).split("@");
  if (!local || !domain) return "(unreadable)";
  const shown = local.length <= 2 ? local[0] : `${local[0]}${"*".repeat(local.length - 2)}${local.at(-1)}`;
  return `${shown}@${domain}`;
}
export const sameEmail = (a, b) => typeof a === "string" && typeof b === "string" && a.trim() !== "" && a.trim().toLowerCase() === b.trim().toLowerCase();
const lit = (v) => `'${String(v).replace(/'/g, "''")}'`;

/** Decides from read-only facts whether promotion may proceed. */
export function evaluate({ userId, expectedEmail, tables, user, owners }) {
  const errors = [];
  if (!USER_ID.test(userId ?? "")) errors.push("--user-id must be the account id shown in Side-Quest (letters, digits, - or _).");
  if (!expectedEmail || !EMAIL.test(String(expectedEmail))) errors.push("Set OWNER_EXPECTED_EMAIL to the Owner account's email address.");
  const missing = REQUIRED_TABLES.filter((t) => !tables.includes(t));
  if (missing.length) errors.push(`Migration 0060 is not applied (missing: ${missing.join(", ")}).`);
  if (errors.length) return { errors, alreadyDone: false };
  if (!user) return { errors: ["No parent account has that id."], alreadyDone: false };
  if (!sameEmail(user.email, expectedEmail)) errors.push("The account email does not match OWNER_EXPECTED_EMAIL. Check the id.");
  if (user.family_status !== "active") errors.push("The account's family is suspended.");
  if (owners.some((o) => o !== userId)) errors.push("Another account already holds the Owner role. This script only bootstraps the first Owner.");
  return { errors, alreadyDone: errors.length === 0 && owners.includes(userId) };
}

export const readUserSql = (userId) =>
  `SELECT u.id, u.email, u.created_at, f.plan, COALESCE(s.status, 'active') AS family_status
   FROM users u JOIN families f ON f.id = u.family_id LEFT JOIN family_admin_state s ON s.family_id = u.family_id WHERE u.id = ${lit(userId)}`;
export const OWNERS_SQL = "SELECT user_id FROM user_roles WHERE role = 'owner' AND revoked_at IS NULL";

/** The guarded write: every condition is re-checked inside the statement, so a repeated or raced run promotes no one else. */
export function grantSql({ roleId, auditId, userId, email, detail }) {
  return `INSERT INTO user_roles (id, user_id, role, granted_by, reason)
SELECT ${lit(roleId)}, u.id, 'owner', 'operator:owner-promotion-script', 'Initial Owner (one-time promotion)'
FROM users u LEFT JOIN family_admin_state s ON s.family_id = u.family_id
WHERE u.id = ${lit(userId)} AND lower(u.email) = lower(${lit(email)}) AND COALESCE(s.status, 'active') = 'active'
  AND NOT EXISTS (SELECT 1 FROM user_roles r WHERE r.role = 'owner' AND r.revoked_at IS NULL);
INSERT INTO admin_audit_log (id, actor_user_id, actor_label, action, target_type, target_id, detail_json)
SELECT ${lit(auditId)}, NULL, 'operator:owner-promotion-script', 'owner.promote', 'user', ${lit(userId)}, ${lit(JSON.stringify(detail))}
WHERE EXISTS (SELECT 1 FROM user_roles WHERE id = ${lit(roleId)});`;
}

// ------------------------------------------------------------------ wrangler

function parseArgs(argv) {
  const out = { mode: argv[0], local: false };
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--local") out.local = true;
    else if (a === "--user-id") out.userId = argv[++i];
    else if (a === "--confirm") out.confirm = argv[++i];
    else if (a === "--config") out.config = argv[++i];
    else if (a === "--persist-to") out.persistTo = argv[++i];
    else throw new Error(`Unknown option ${a}`);
  }
  return out;
}

function wrangler(opts, args) {
  const extra = ["--config", opts.config ?? "wrangler.jsonc", ...(opts.persistTo ? ["--persist-to", opts.persistTo] : [])];
  const r = spawnSync("npx", ["wrangler", ...args, ...extra], { cwd: ROOT, encoding: "utf8", env: { ...process.env, WRANGLER_SEND_METRICS: "false" } });
  if (r.status !== 0) throw new Error(`wrangler ${args[0]} ${args[1] ?? ""} failed:\n${(r.stderr || r.stdout || "").slice(-800)}`);
  return r.stdout;
}

function query(opts, sql) {
  const out = wrangler(opts, ["d1", "execute", "DB", opts.local ? "--local" : "--remote", "--json", "--command", sql]);
  const parsed = JSON.parse(out.slice(out.indexOf("[")));
  return parsed.flatMap((r) => r.results ?? []);
}

function checkTarget(opts) {
  if (opts.local) return;
  const config = readFileSync(resolve(ROOT, opts.config ?? "wrangler.jsonc"), "utf8");
  if (!config.includes(PRODUCTION.uuid) || !config.includes(`"${PRODUCTION.name}"`)) throw new Error("The wrangler config does not point at the production database.");
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!["preflight", "apply", "verify"].includes(opts.mode)) throw new Error("Usage: owner-promotion.mjs <preflight|apply|verify> --user-id <id> [--confirm PROMOTE] [--local]");
  checkTarget(opts);
  const userId = (opts.userId ?? "").trim();
  const expectedEmail = (process.env.OWNER_EXPECTED_EMAIL ?? "").trim();
  const where = opts.local ? "LOCAL test database" : `PRODUCTION ${PRODUCTION.name} (${PRODUCTION.uuid})`;

  const tables = query(opts, "SELECT name FROM sqlite_master WHERE type = 'table'").map((r) => String(r.name));
  const ready = REQUIRED_TABLES.every((t) => tables.includes(t));
  const user = ready && USER_ID.test(userId) ? query(opts, readUserSql(userId))[0] ?? null : null;
  const owners = ready ? query(opts, OWNERS_SQL).map((r) => String(r.user_id)) : [];
  const verdict = evaluate({ userId, expectedEmail, tables, user, owners });

  console.log(`Database:        ${where}`);
  console.log(`User id:         ${userId || "(none)"}`);
  if (user) console.log(`Email on record: ${maskEmail(user.email)}\nAccount created: ${user.created_at}\nFamily plan:     ${user.plan}\nFamily status:   ${user.family_status}`);
  console.log(`Existing Owners: ${owners.length}`);

  if (verdict.errors.length) {
    console.log(`\nREFUSED (nothing was changed):\n${verdict.errors.map((e) => `- ${e}`).join("\n")}`);
    process.exit(1);
  }
  if (opts.mode === "verify") {
    if (owners.length !== 1 || owners[0] !== userId) { console.log("\nVERIFY FAILED: this account is not the sole Owner."); process.exit(1); }
    console.log("\nVERIFIED: this account is the sole Owner.");
    return;
  }
  if (verdict.alreadyDone) { console.log("\nThis account is already the Owner. Nothing to do."); return; }
  if (opts.mode === "preflight") {
    console.log("\nPREFLIGHT PASSED. Check the masked email and creation date are yours, then run apply with --confirm PROMOTE.");
    return;
  }
  if (opts.confirm !== "PROMOTE") { console.log("\nREFUSED: add --confirm PROMOTE to apply. Nothing was changed."); process.exit(1); }

  let bookmark = "local-test";
  if (!opts.local) {
    const info = wrangler(opts, ["d1", "time-travel", "info", PRODUCTION.name, "--json"]);
    const j = JSON.parse(info.slice(info.indexOf("{")));
    bookmark = j.bookmark ?? j.result?.bookmark ?? "";
    if (!/^[\w-]+$/.test(bookmark)) { console.log("\nREFUSED: could not record a Time Travel restore point. Nothing was changed."); process.exit(1); }
    console.log(`\nRestore point (Time Travel bookmark): ${bookmark}`);
  }
  query(opts, grantSql({ roleId: crypto.randomUUID(), auditId: crypto.randomUUID(), userId, email: expectedEmail, detail: { role: "owner granted", bookmark } }));
  const after = query(opts, OWNERS_SQL).map((r) => String(r.user_id));
  if (after.length !== 1 || after[0] !== userId) { console.log("\nFAILED: the Owner role was not granted (conditions changed)."); process.exit(1); }
  console.log("\nAPPLIED: Owner role granted and audited. Password, email, plan and family data are unchanged.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(`Owner promotion failed: ${e.message}`); process.exit(1); });
}
