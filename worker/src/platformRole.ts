/**
 * Platform Owner check shared with the Owner account work in
 * feature/owner-account (worker/src/entitlements.ts). Only the exact database
 * value grants complimentary lifetime access. Google sign-in, email matching
 * and registration never write this value.
 */
export function isPlatformOwner(value: unknown): boolean {
  return value === "owner";
}

export function publicPlatformRole(value: unknown): "owner" | "parent" {
  return isPlatformOwner(value) ? "owner" : "parent";
}
