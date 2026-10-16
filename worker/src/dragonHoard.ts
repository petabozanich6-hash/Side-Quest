/**
 * The Dragon's Hoard: limited, owner-managed Stripe promotions and family preview gifts.
 * Never writes a paid plan. Stripe is the authority for coupon eligibility and redemption caps.
 * Promotions are scoped to the exact Stripe environment that created them.
 */
import { billingConfig, stripeCall, type Mode } from "./billing";
import type { Env } from "./types";
import { newId, nowIso } from "./types";

export const HOARD_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS dragon_hoard_offers (
    id TEXT PRIMARY KEY NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('test','live')),
    code TEXT NOT NULL,
    label TEXT NOT NULL,
    percent_off INTEGER NOT NULL CHECK (percent_off BETWEEN 5 AND 50),
    duration_months INTEGER NOT NULL CHECK (duration_months = 1),
    max_redemptions INTEGER NOT NULL CHECK (max_redemptions BETWEEN 1 AND 500),
    expires_at TEXT NOT NULL,
    stripe_coupon_id TEXT NOT NULL,
    stripe_promotion_id TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_by TEXT,
    created_at TEXT NOT NULL,
    disabled_at TEXT,
    UNIQUE(mode, code)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_hoard_offers_created ON dragon_hoard_offers(created_at DESC)`,
] as const;

export async function ensureHoardSchema(db: D1Database) {
  for (const query of HOARD_SCHEMA) await db.prepare(query).run();
}

export type HoardOffer = {
  id: string; mode: Mode; code: string; label: string; percent_off: number;
  duration_months: number; max_redemptions: number; expires_at: string;
  stripe_coupon_id: string; stripe_promotion_id: string; active: number;
  created_at: string; disabled_at: string | null;
};

export async function listHoardOffers(db: D1Database) {
  await ensureHoardSchema(db);
  const { results } = await db.prepare(
    "SELECT id, mode, code, label, percent_off, duration_months, max_redemptions, expires_at, stripe_coupon_id, stripe_promotion_id, active, created_at, disabled_at FROM dragon_hoard_offers ORDER BY created_at DESC LIMIT 100"
  ).all<HoardOffer>();
  return results ?? [];
}

/** Resolve only unexpired, active SideQuest Hoard codes in this exact Stripe mode.
 * Returns a Stripe promotion ID from server storage; untrusted clients never choose coupon IDs.
 */
export async function resolveHoardDiscount(db: D1Database, mode: Mode, raw: string): Promise<string | null> {
  const code = raw.trim().toUpperCase();
  if (!/^[A-Z0-9]{4,24}$/.test(code)) return null;
  await ensureHoardSchema(db);
  const offer = await db.prepare(
    "SELECT stripe_promotion_id FROM dragon_hoard_offers WHERE mode = ? AND code = ? AND active = 1 AND expires_at > ?"
  ).bind(mode, code, nowIso()).first<{ stripe_promotion_id: string }>();
  return offer?.stripe_promotion_id ?? null;
}

/**
 * Read-only parent preview. Local HQ data alone is insufficient: Stripe may have
 * retired a code or exhausted its redemption cap since it was issued.
 * Never returns Stripe identifiers or the owner's internal campaign metadata.
 * A verified preview is informational; Stripe still decides final eligibility.
 */
export async function previewHoardDiscount(
  db: D1Database, env: Env, raw: string,
  fetchImpl?: typeof fetch,
): Promise<{ valid: boolean; code?: string; percent_off?: number; first_invoice_only?: true; message?: string }> {
  const unavailable = { valid: false, message: "This code isn't currently available. Check the spelling or try another." };
  const code = raw.trim().toUpperCase();
  if (!/^[A-Z0-9]{4,24}$/.test(code)) return unavailable;
  const cfg = billingConfig(env);
  if (!cfg.ok) return { valid: false, message: "Discount codes cannot be checked right now." };
  await ensureHoardSchema(db);
  const offer = await db.prepare(
    "SELECT stripe_coupon_id, stripe_promotion_id, percent_off FROM dragon_hoard_offers WHERE mode = ? AND code = ? AND active = 1 AND expires_at > ?"
  ).bind(cfg.mode, code, nowIso()).first<Pick<HoardOffer, "stripe_coupon_id" | "stripe_promotion_id" | "percent_off">>();
  if (!offer) return unavailable;

  // Stripe is authoritative for invalidated, expired and fully redeemed promotions.
  // No coupon redemption or Checkout Session is created by checking a code.
  const opts = { fetchImpl };
  const promo = await stripeCall(cfg.key, "GET", "promotion_codes/" + encodeURIComponent(offer.stripe_promotion_id), {}, opts);
  const seconds = Math.floor(Date.now() / 1000);
  if (promo?.active !== true || (promo.expires_at && promo.expires_at <= seconds) ||
      (promo.max_redemptions != null && Number(promo.times_redeemed || 0) >= promo.max_redemptions)) return unavailable;

  const coupon = await stripeCall(cfg.key, "GET", "coupons/" + encodeURIComponent(offer.stripe_coupon_id), {}, opts);
  if (!coupon || coupon.id !== offer.stripe_coupon_id || coupon.valid === false ||
      coupon.percent_off !== offer.percent_off || (coupon.duration && coupon.duration !== "once")) return unavailable;
  return { valid: true, code, percent_off: offer.percent_off, first_invoice_only: true };
}

export function validateHoardOffer(input: Record<string, unknown>) {
  const code = typeof input.code === "string" ? input.code.trim().toUpperCase() : "";
  const label = typeof input.label === "string" ? input.label.trim() : "";
  const percent = input.percent_off;
  const months = input.duration_months;
  const limit = input.max_redemptions;
  const expiry = typeof input.expires_at === "string" ? input.expires_at.trim() : "";
  const stamp = Date.parse(expiry);
  if (!/^[A-Z0-9]{4,24}$/.test(code)) return { ok: false as const, error: "Code must contain 4–24 letters or numbers." };
  if (label.length < 3 || label.length > 80 || /[<>]/.test(label)) return { ok: false as const, error: "Give this campaign a name of 3–80 characters." };
  if (typeof percent !== "number" || !Number.isInteger(percent) || percent < 5 || percent > 50) return { ok: false as const, error: "Choose a whole-number discount between 5% and 50%." };
  if (months !== 1) return { ok: false as const, error: "Discounts currently apply to the first invoice only." };
  if (typeof limit !== "number" || !Number.isInteger(limit) || limit < 1 || limit > 500) return { ok: false as const, error: "Redemption limit must be between 1 and 500." };
  if (!Number.isFinite(stamp) || stamp < Date.now() + 3600_000 || stamp > Date.now() + 366 * 86400_000) {
    return { ok: false as const, error: "Expiry must be at least an hour away and no more than 366 days away." };
  }
  return { ok: true as const, value: { code, label, percent_off: Number(percent), duration_months: Number(months), max_redemptions: Number(limit), expires_at: new Date(stamp).toISOString() } };
}

export async function createHoardOffer(db: D1Database, env: Env, input: Record<string, unknown>, ownerId: string) {
  const checked = validateHoardOffer(input);
  if (!checked.ok) return { ok: false as const, status: 400 as const, detail: checked.error };
  const cfg = billingConfig(env);
  if (!cfg.ok) return { ok: false as const, status: 503 as const, detail: "Stripe checkout must be configured before creating a discount." };
  const v = checked.value;
  await ensureHoardSchema(db);
  const exists = await db.prepare("SELECT id FROM dragon_hoard_offers WHERE mode = ? AND code = ?").bind(cfg.mode, v.code).first();
  if (exists) return { ok: false as const, status: 409 as const, detail: "This code already exists in the current Stripe mode." };

  // Stripe stores the actual discount and enforces its expiry / redemption count, not a browser-side calculation.
  // Reuse an explicit coupon identifier and idempotency keys to make retries safe after partial network failures.
  // Stripe coupon applicability must be limited to the products behind SideQuest's configured prices.
  // Otherwise a customer with a valid SideQuest code could try it on Pocket Goblin or any other
  // product sharing the same Stripe account. A missing/invalid price fails before creating a coupon.
  const priceIds = [...new Set(Object.values(cfg.prices).filter(Boolean).map((p) => p!.price))];
  const priceObjects = await Promise.all(priceIds.map((priceId) =>
    stripeCall(cfg.key, "GET", "prices/" + encodeURIComponent(priceId))
  ));
  const products = [...new Set(priceObjects.map((price) => price?.product))];
  if (products.length === 0 || products.some((p) => typeof p !== "string" || !/^prod_[A-Za-z0-9]+$/.test(p))) {
    throw new Error("Stripe did not return a valid SideQuest product for each configured price");
  }
  const couponId = "sqhoard_" + cfg.mode + "_" + v.code.toLowerCase();
  const coupon = await stripeCall(cfg.key, "POST", "coupons", {
    id: couponId, name: "SideQuest · " + v.label, percent_off: v.percent_off,
    duration: "once",
    applies_to: { products },
    metadata: { source: "sidequest_dragons_hoard" },
  }, { idempotencyKey: "sq-hoard-coupon-" + cfg.mode + "-" + v.code });
  const promo = await stripeCall(cfg.key, "POST", "promotion_codes", {
    coupon: coupon.id, code: v.code, max_redemptions: v.max_redemptions,
    expires_at: Math.floor(Date.parse(v.expires_at) / 1000),
    restrictions: { first_time_transaction: true },
    metadata: { source: "sidequest_dragons_hoard" },
  }, { idempotencyKey: "sq-hoard-promo-" + cfg.mode + "-" + v.code });
  const id = newId();
  await db.prepare(
    "INSERT INTO dragon_hoard_offers (id, mode, code, label, percent_off, duration_months, max_redemptions, expires_at, stripe_coupon_id, stripe_promotion_id, active, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)"
  ).bind(id, cfg.mode, v.code, v.label, v.percent_off, v.duration_months, v.max_redemptions, v.expires_at, coupon.id, promo.id, ownerId, nowIso()).run();
  return { ok: true as const, id, code: v.code, mode: cfg.mode };
}

export async function disableHoardOffer(db: D1Database, env: Env, id: string) {
  await ensureHoardSchema(db);
  const offer = await db.prepare("SELECT * FROM dragon_hoard_offers WHERE id = ?").bind(id).first<HoardOffer>();
  if (!offer) return { ok: false as const, status: 404 as const, detail: "Scroll not found." };
  if (!offer.active) return { ok: false as const, status: 409 as const, detail: "This scroll has already been retired." };
  const cfg = billingConfig(env);
  if (!cfg.ok || cfg.mode !== offer.mode) return { ok: false as const, status: 409 as const, detail: "Switch to the original Stripe mode before retiring this scroll." };
  await stripeCall(cfg.key, "POST", "promotion_codes/" + encodeURIComponent(offer.stripe_promotion_id), { active: false }, { idempotencyKey: "sq-hoard-disable-" + id });
  await db.prepare("UPDATE dragon_hoard_offers SET active = 0, disabled_at = ? WHERE id = ?").bind(nowIso(), id).run();
  return { ok: true as const, code: offer.code, mode: offer.mode };
}

/** Bonus days are *preview access*, not a paid membership or Stripe credit. */
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
