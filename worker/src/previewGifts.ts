/**
 * Owner HQ preview gifts: extra free-preview days for one family.
 * Bonus days are preview access only, never a paid membership.
 */
export async function giftPreviewDays(db: D1Database, familyId: string, days: number) {
  if (!Number.isInteger(days) || days < 1 || days > 14) return { ok: false as const, status: 400 as const, detail: "Gift 1–14 days at a time." };
  const family = await db.prepare(
    "SELECT id, plan, created_at, trial_started_at, trial_ends_at, stripe_subscription_id, subscription_status FROM families WHERE id = ?"
  ).bind(familyId).first<{ id: string; plan: string; created_at: string; trial_started_at: string | null; trial_ends_at: string | null; stripe_subscription_id: string | null; subscription_status: string | null }>();
  if (!family) return { ok: false as const, status: 404 as const, detail: "Family not found." };
  if (family.plan !== "FREE_PREVIEW" || family.stripe_subscription_id || family.subscription_status) {
    return { ok: false as const, status: 409 as const, detail: "Only families without a Stripe subscription on the free preview can receive extra preview days." };
  }
  const start = Date.parse(family.trial_started_at || family.created_at);
  const current = Date.parse(family.trial_ends_at || new Date(start + 7 * 86400_000).toISOString());
  const base = Math.max(current, Date.now());
  const end = base + days * 86400_000;
  // Absolute 35-day cap from the original start prevents unlimited trial extension.
  if (!Number.isFinite(start) || !Number.isFinite(end) || end > start + 35 * 86400_000) {
    return { ok: false as const, status: 409 as const, detail: "The maximum preview period is 35 days from registration." };
  }
  const newEnd = new Date(end).toISOString();
  const previous = family.trial_ends_at ?? "";
  const updated = await db.prepare(
    "UPDATE families SET trial_ends_at = ? WHERE id = ? AND plan = 'FREE_PREVIEW' AND stripe_subscription_id IS NULL AND subscription_status IS NULL AND COALESCE(trial_ends_at, '') = ?"
  ).bind(newEnd, familyId, previous).run();
  if (!updated.meta?.changes) return { ok: false as const, status: 409 as const, detail: "This family changed while the gift was being applied. Please refresh." };
  return { ok: true as const, days, ends_at: newEnd };
}
