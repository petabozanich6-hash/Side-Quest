// Minimal D1 look-alike over node:sqlite so the real migrations and real queries run in tests.
import { DatabaseSync } from "node:sqlite";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const MIG = fileURLToPath(new URL("../migrations/", import.meta.url));

class Stmt {
  constructor(db, sql) { this.db = db; this.sql = sql; this.args = []; }
  bind(...a) { this.args = a.map((x) => (x === undefined ? null : x)); return this; }
  async first() { return this.db.prepare(this.sql).get(...this.args) ?? null; }
  async all() { return { results: this.db.prepare(this.sql).all(...this.args), success: true }; }
  async run() { const r = this.db.prepare(this.sql).run(...this.args); return { success: true, meta: { changes: Number(r.changes) } }; }
  _runSync() { const r = this.db.prepare(this.sql).run(...this.args); return { success: true, meta: { changes: Number(r.changes) } }; }
}
export function makeDb(upToExclusive) {
  const raw = new DatabaseSync(":memory:");
  const files = readdirSync(MIG).filter((f) => f.endsWith(".sql")).sort();
  for (const f of files) {
    if (upToExclusive && f >= upToExclusive) break;
    raw.exec(readFileSync(MIG + f, "utf8"));
  }
  return {
    raw,
    prepare: (sql) => new Stmt(raw, sql),
    async batch(stmts) {
      raw.exec("BEGIN");
      try { const out = stmts.map((s) => s._runSync()); raw.exec("COMMIT"); return out; }
      catch (e) { raw.exec("ROLLBACK"); throw e; }
    },
  };
}
