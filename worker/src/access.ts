/**
 * Administrative roles and permissions. Deliberately separate from subscription entitlements (families.plan):
 * - Roles (user_roles) grant administration. No API writes them; the only way in is the approval-gated promotion
 *   script (worker/scripts/owner-promotion.mjs).
 * - Plans grant customer features. INTERNAL is a complimentary plan, not a role: it never opens Owner HQ, and a
 *   lapsed membership never removes Owner access.
 */
export const ROLES = ["owner"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "admin.access",
  "metrics.read",
  "customers.read",
  "customers.suspend",
  "customers.sessions.revoke",
  "settings.read",
  "settings.write",
  "audit.read",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

/** Role -> permissions. A future restricted support role is one more entry here (plus a row in `roles`). */
const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = { owner: PERMISSIONS };

export const isRole = (v: unknown): v is Role => typeof v === "string" && (ROLES as readonly string[]).includes(v);

export function permissionsFor(roles: readonly Role[]): Set<Permission> {
  const out = new Set<Permission>();
  for (const role of roles) for (const p of ROLE_PERMISSIONS[role]) out.add(p);
  return out;
}

export async function activeRoles(db: D1Database, userId: string): Promise<Role[]> {
  const { results } = await db.prepare("SELECT role FROM user_roles WHERE user_id = ? AND revoked_at IS NULL").bind(userId).all<{ role: string }>();
  return (results ?? []).map((r) => r.role).filter(isRole);
}

/** True only for a parent account holding an active owner role. Fails closed if the tables are missing. */
export async function isPlatformOwner(db: D1Database, userId: string): Promise<boolean> {
  try {
    return (await activeRoles(db, userId)).includes("owner");
  } catch {
    return false;
  }
}
