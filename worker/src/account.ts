import type { App, Guards } from "./types";
import { verifySecret } from "./auth";
import { deletionBillingBlock } from "./billing";
import { TOKEN_DAYS } from "./session";
import type { Fetch } from "./billing";

// Tables that are never swept by family/student id.
const SKIP_TABLES = new Set(["users", "families", "students", "outcomes", "app_config", "d1_migrations"]);
const UPLOAD_PREFIX = "sidequest/families/";
const CHUNK = 50;

const KEEP_USER_ROWS = new Set([...SKIP_TABLES, "admin_audit_log"]);

/** DELETE statements for every table with a user_id column, for the users the subquery selects. */
async function userRowDeletes(db: D1Database, tables: string[], usersSql: string, ...binds: string[]): Promise<D1PreparedStatement[]> {
  const out: D1PreparedStatement[] = [];
  for (const name of tables) {
    if (KEEP_USER_ROWS.has(name)) continue;
    const { results: cols } = await db.prepare(`SELECT name FROM pragma_table_info('${name.replace(/'/g, "''")}')`).all<{ name: string }>();
    if (!cols.some((c) => c.name === "user_id")) continue;
    out.push(db.prepare(`DELETE FROM "${name.replace(/"/g, '""')}" WHERE user_id IN (${usersSql})`).bind(...binds));
  }
  return out;
}

/**
 * Tables are discovered at run time, so data added by later migrations is
 * erased without listing it.
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

  // Rows keyed only by a parent (reset links, passkeys, email preferences, announcement recipients...).
  // Done first, while the users rows they point at still exist. The Owner's audit trail is kept.
  stmts.push(...(await userRowDeletes(db, ordered, "SELECT id FROM users WHERE family_id = ?", familyId)));
  for (const _ of stmts.slice(names.length)) names.push("parent_records");
  if (ordered.includes("parent_feedback_replies") && ordered.includes("parent_feedback")) {
    stmts.push(db.prepare("DELETE FROM parent_feedback_replies WHERE feedback_id IN (SELECT id FROM parent_feedback WHERE family_id = ?)").bind(familyId));
    names.push("parent_feedback_replies");
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

const RECENT_SIGN_IN_S = 15 * 60;

/** Whether the (already verified) bearer token was issued in the last 15 minutes. */
function signedInRecently(header: string | undefined, nowS = Math.floor(Date.now() / 1000)): boolean {
  try {
    const payload = JSON.parse(atob(String(header || "").slice(7).split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    const issued = Number(payload.exp) - TOKEN_DAYS * 86400;
    return Number.isFinite(issued) && nowS - issued >= -60 && nowS - issued <= RECENT_SIGN_IN_S;
  } catch {
    return false;
  }
}

export function registerAccount(app: App, g: Guards, fetchImpl?: Fetch) {
  app.post("/api/auth/delete-account", g.auth, g.parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    if (String(b.confirm ?? "").trim() !== "DELETE") return c.json({ detail: "Type DELETE to confirm" }, 400);

    const db = c.env.DB;
    const user = c.get("user");
    const record = await db.prepare("SELECT id, family_id, password_hash FROM users WHERE id = ?")
      .bind(user.id).first<any>();
    if (!record) return c.json({ detail: "Account not found" }, 404);
    if (record.password_hash) {
      if (!(await verifySecret(String(b.password ?? ""), record.password_hash))) return c.json({ detail: "Incorrect password" }, 403);
    } else if (!signedInRecently(c.req.header("Authorization"))) {
      // Google-only accounts have no password to re-check: a fresh sign-in proves it's really them.
      return c.json({ detail: "For your security, sign out and sign in with Google again, then delete your account within 15 minutes.", code: "REAUTH_REQUIRED" }, 403);
    }

    const others = await db.prepare("SELECT COUNT(*) n FROM users WHERE family_id = ? AND id != ?")
      .bind(record.family_id, record.id).first<{ n: number }>();
    if (others?.n) {
      // The family and its membership stay with the other parent; hand over ownership if needed.
      const { results: tables } = await db.prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%'"
      ).all<{ name: string }>();
      await db.batch([
        ...(await userRowDeletes(db, tables.map((t) => t.name), "?", record.id)),
        db.prepare("DELETE FROM users WHERE id = ?").bind(record.id),
        db.prepare(
          "UPDATE users SET is_owner = 1 WHERE id = (SELECT id FROM users WHERE family_id = ? ORDER BY created_at, id LIMIT 1) AND NOT EXISTS (SELECT 1 FROM users WHERE family_id = ? AND is_owner = 1)"
        ).bind(record.family_id, record.family_id),
        db.prepare("UPDATE families SET owner_id = (SELECT id FROM users WHERE family_id = ? AND is_owner = 1 ORDER BY created_at, id LIMIT 1) WHERE id = ? AND owner_id = ?")
          .bind(record.family_id, record.family_id, record.id),
      ]);
      return c.json({ ok: true, family_deleted: false });
    }

    const block = await deletionBillingBlock(db, c.env, record.family_id, fetchImpl);
    if (block) return c.json({ detail: block.detail, code: block.code }, block.status);

    const report = await purgeFamily(db, c.env.BUCKET, record.family_id, record.id);
    return c.json({ ok: true, family_deleted: true, deleted: report });
  });
}
