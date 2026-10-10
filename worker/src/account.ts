import type { App, Guards } from "./types";
import { verifySecret } from "./auth";

// Tables that are never swept by family/student id.
const SKIP_TABLES = new Set(["users", "families", "students", "outcomes", "app_config", "d1_migrations"]);
const UPLOAD_PREFIX = "sidequest/families/";
const CHUNK = 50;

/**
 * Tables are discovered at run time (like the FastAPI version discovered Mongo
 * collections) so data added by later migrations is erased without listing it.
 */
async function purgeFamily(db: D1Database, bucket: R2Bucket | undefined, familyId: string, userId: string) {
  const { results: studentRows } = await db.prepare("SELECT id FROM students WHERE family_id = ?")
    .bind(familyId).all<{ id: string }>();
  const studentIds = studentRows.map((s) => s.id);
  const report: Record<string, number> = {};

  if (bucket) {
    let removed = 0;
    let cursor: string | undefined;
    do {
      const page: R2Objects = await bucket.list({ prefix: `${UPLOAD_PREFIX}${familyId}/`, cursor });
      if (page.objects.length) {
        await bucket.delete(page.objects.map((o) => o.key));
        removed += page.objects.length;
      }
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
    report.uploads = removed;
  }

  const { results: tables } = await db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%'"
  ).all<{ name: string }>();

  // Tables reference each other (units -> programs, ...): check FKs at commit time, not per statement.
  const stmts: D1PreparedStatement[] = [db.prepare("PRAGMA defer_foreign_keys = ON")];
  const names: string[] = ["pragma"];
  // Delete child tables before the tables they reference (foreign keys are enforced).
  const parents = new Map<string, string[]>();
  for (const { name } of tables) {
    const { results } = await db.prepare(`SELECT "table" AS parent FROM pragma_foreign_key_list('${name.replace(/'/g, "''")}')`)
      .all<{ parent: string }>();
    parents.set(name, results.map((r) => r.parent));
  }
  const ordered: string[] = [];
  const pending = new Set(tables.map((t) => t.name));
  while (pending.size) {
    const leaves = [...pending].filter((t) => ![...pending].some((o) => o !== t && parents.get(o)!.includes(t)));
    const batch = leaves.length ? leaves : [...pending];
    for (const t of batch) { ordered.push(t); pending.delete(t); }
  }

  for (const name of ordered) {
    if (SKIP_TABLES.has(name)) continue;
    const { results: cols } = await db.prepare(`SELECT name FROM pragma_table_info('${name.replace(/'/g, "''")}')`)
      .all<{ name: string }>();
    const has = (c: string) => cols.some((x) => x.name === c);
    const q = `"${name.replace(/"/g, '""')}"`;
    if (has("family_id")) {
      stmts.push(db.prepare(`DELETE FROM ${q} WHERE family_id = ?`).bind(familyId));
      names.push(name);
    }
    for (const col of ["student_id", "child_id"]) {
      if (!has(col)) continue;
      for (let i = 0; i < studentIds.length; i += CHUNK) {
        const part = studentIds.slice(i, i + CHUNK);
        stmts.push(db.prepare(`DELETE FROM ${q} WHERE ${col} IN (${part.map(() => "?").join(",")})`).bind(...part));
        names.push(name);
      }
    }
    if (has("parent_id")) {
      stmts.push(db.prepare(`DELETE FROM ${q} WHERE parent_id IN (?, ?)`).bind(familyId, userId));
      names.push(name);
    }
  }
  stmts.push(db.prepare("DELETE FROM students WHERE family_id = ?").bind(familyId));
  names.push("students");
  stmts.push(db.prepare("DELETE FROM users WHERE family_id = ?").bind(familyId));
  names.push("users");
  stmts.push(db.prepare("DELETE FROM families WHERE id = ?").bind(familyId));
  names.push("families");

  const res = await db.batch(stmts);
  res.forEach((r, i) => {
    const n = r.meta?.changes ?? 0;
    if (n) report[names[i]] = (report[names[i]] || 0) + n;
  });
  return report;
}

export function registerAccount(app: App, g: Guards) {
  app.post("/api/auth/delete-account", g.auth, g.parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    if (String(b.confirm ?? "").trim() !== "DELETE") return c.json({ detail: "Type DELETE to confirm" }, 400);

    const db = c.env.DB;
    const user = c.get("user");
    const record = await db.prepare("SELECT id, family_id, password_hash FROM users WHERE id = ?")
      .bind(user.id).first<any>();
    if (!record) return c.json({ detail: "Account not found" }, 404);
    if (!record.password_hash || !(await verifySecret(String(b.password ?? ""), record.password_hash))) {
      return c.json({ detail: "Incorrect password" }, 403);
    }

    const others = await db.prepare("SELECT COUNT(*) n FROM users WHERE family_id = ? AND id != ?")
      .bind(record.family_id, record.id).first<{ n: number }>();
    if (others?.n) {
      await db.prepare("DELETE FROM users WHERE id = ?").bind(record.id).run();
      return c.json({ ok: true, family_deleted: false });
    }

    const report = await purgeFamily(db, c.env.BUCKET, record.family_id, record.id);
    return c.json({ ok: true, family_deleted: true, deleted: report });
  });
}
