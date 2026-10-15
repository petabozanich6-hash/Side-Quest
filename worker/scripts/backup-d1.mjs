// Production D1 backup with a restore check. Run before any production migration: npm run db:backup
//  1. Records the Time Travel bookmark (D1's built-in point-in-time restore, kept 30 days).
//  2. Exports the whole database to SQL OUTSIDE the repository (backups hold family data: never commit them).
//  3. Restores the export into an empty in-memory SQLite database and checks every table's row count against live.
// Exits non-zero if any step fails, so a release script can stop.  Output dir: SIDEQUEST_BACKUP_DIR or ../backups.
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, chmodSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const ROOT = resolve(new URL("../../", import.meta.url).pathname);
const DIR = resolve(process.env.SIDEQUEST_BACKUP_DIR || resolve(ROOT, "../backups"));
const wr = (args) => {
  const r = spawnSync("npx", ["wrangler", ...args], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 });
  if (r.status !== 0) { console.error((r.stderr || r.stdout).slice(-2000)); process.exit(1); }
  return r.stdout;
};
const config = readFileSync(resolve(ROOT, "wrangler.jsonc"), "utf8");
const dbId = config.match(/"database_id":\s*"([^"]+)"/)[1];
const dbName = config.match(/"database_name":\s*"([^"]+)"/)[1];

mkdirSync(DIR, { recursive: true });
chmodSync(DIR, 0o700);
const bookmark = (wr(["d1", "time-travel", "info", "DB"]).match(/bookmark is '([^']+)'/) || [])[1];
if (!bookmark) { console.error("Could not read the Time Travel bookmark"); process.exit(1); }
const ts = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
const file = resolve(DIR, `${dbName}-${dbId.slice(0, 8)}-${ts}.sql`);
wr(["d1", "export", "DB", "--remote", "--output", file]);
const sql = readFileSync(file, "utf8");
const sha = createHash("sha256").update(sql).digest("hex");

const db = new DatabaseSync(":memory:");
db.exec(sql);
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' ORDER BY name").all().map((r) => r.name);
const restored = Object.fromEntries(tables.map((t) => [t, db.prepare(`SELECT COUNT(*) n FROM "${t}"`).get().n]));
const q = "SELECT " + tables.map((t) => `(SELECT COUNT(*) FROM "${t}") AS "${t}"`).join(",");
const live = JSON.parse(wr(["d1", "execute", "DB", "--remote", "--json", "--command", q]))[0].results[0];
const mismatch = tables.filter((t) => restored[t] !== live[t]);
const report = { database: dbName, database_id: dbId, time_travel_bookmark: bookmark, taken_at: new Date().toISOString(), file, sha256: sha, tables: tables.length, rows: restored, restore_check: mismatch.length ? `MISMATCH: ${mismatch.join(", ")}` : "all tables match live" };
writeFileSync(file.replace(/\.sql$/, ".json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, rows: undefined }, null, 2));
if (mismatch.length) { console.error("Backup restore check FAILED. Do not migrate."); process.exit(1); }
console.log(`\nVerified. To roll back to this exact point: npx wrangler d1 time-travel restore DB --bookmark=${bookmark}`);
