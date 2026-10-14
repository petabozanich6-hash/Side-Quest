// A small, owner-only celebration after a *real paid* subscription checkout.
// Stripe signature + paid/active verification happen in billing.ts, before this function is called.
// This notification never grants membership or blocks the paying family's checkout.
// The database ledger is keyed by family, not Stripe event or subscription, so later
// renewals, retries and new subscriptions for the same family do not send new alerts.
import type { Env } from "./types";
import type { Interval, Mode } from "./billing";
import { newPaidFamilyOwnerEmail, sendEmail } from "./email";

type DB = D1Database;

export type PaidFamilyAlert = {
  familyId: string;
  subscriptionId: string;
  interval: Interval;
  amountCents: number;
};

const ACTIVE_FAMILY_COUNT = `SELECT COUNT(*) AS n FROM families
  WHERE subscription_status = 'active'
    AND plan IN ('ACTIVE_WEEKLY','ACTIVE_FORTNIGHTLY','ACTIVE_MONTHLY','ACTIVE_ANNUAL')
    AND plan_period_end > ?`;

// In a deployed Worker the sender may time out. A stale claim can be retried on a
// later genuine paid checkout, rather than leaving a forever-locked row.
const STALE_CLAIM_MS = 60 * 60 * 1000;

/**
 * Try once per new paid family. Return an outcome for logging/testing.
 *
 * OWNER_NOTIFICATION_EMAIL is opt-in. Sandbox events must NEVER email the owner,
 * even when this address is configured (customer sandbox confirmations are separate).
 * The sender function is injectable to test without emailing anyone.
 */
export async function sendOwnerNewMemberAlert(
  db: DB,
  env: Pick<Env, "OWNER_NOTIFICATION_EMAIL" | "EMAIL" | "EMAIL_FROM">,
  mode: Mode,
  info: PaidFamilyAlert,
  now: Date = new Date(),
  sender: typeof sendEmail = sendEmail,
): Promise<"disabled" | "duplicate" | "sent" | "failed"> {
  if (mode !== "live") return "disabled";
  const to = String(env.OWNER_NOTIFICATION_EMAIL || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || !env.EMAIL) return "disabled";

  // Double-check the current family/subscription rather than trusting checkout
  // metadata or anything supplied by a browser.
  const family = await db.prepare(
    "SELECT id FROM families WHERE id = ? AND stripe_subscription_id = ? AND subscription_status = 'active' AND plan IN ('ACTIVE_WEEKLY','ACTIVE_FORTNIGHTLY','ACTIVE_MONTHLY','ACTIVE_ANNUAL') AND plan_period_end > ?"
  ).bind(info.familyId, info.subscriptionId, now.toISOString()).first<{ id: string }>();
  if (!family || info.amountCents <= 0) return "disabled";

  await db.prepare(
    "INSERT OR IGNORE INTO owner_new_member_alerts (family_id, subscription_id, created_at) VALUES (?, ?, ?)"
  ).bind(info.familyId, info.subscriptionId, now.toISOString()).run();

  const token = crypto.randomUUID();
  const staleBefore = new Date(now.getTime() - STALE_CLAIM_MS).toISOString();
  const claim = await db.prepare(
    `UPDATE owner_new_member_alerts SET claimed_at = ?, claim_token = ?
     WHERE family_id = ? AND sent_at IS NULL AND
       (claimed_at IS NULL OR claimed_at < ?)`
  ).bind(now.toISOString(), token, info.familyId, staleBefore).run();
  if (!claim.meta?.changes) return "duplicate";

  try {
    const count = await db.prepare(ACTIVE_FAMILY_COUNT).bind(now.toISOString()).first<{ n: number }>();
    const email = newPaidFamilyOwnerEmail(to, {
      interval: info.interval,
      amountCents: info.amountCents,
      activeFamilies: Number(count?.n ?? 0),
    });
    const delivered = await sender(env as Env, email);
    if (!delivered) throw new Error("owner notification delivery was not confirmed");

    await db.prepare(
      "UPDATE owner_new_member_alerts SET sent_at = ?, claimed_at = NULL, claim_token = NULL WHERE family_id = ? AND claim_token = ? AND sent_at IS NULL"
    ).bind(now.toISOString(), info.familyId, token).run();
    return "sent";
  } catch (error) {
    // The checkout is not undone and the customer's own confirmation isn't resent.
    // A later legitimate checkout can retry this undelivered alert.
    await db.prepare(
      "UPDATE owner_new_member_alerts SET claimed_at = NULL, claim_token = NULL WHERE family_id = ? AND claim_token = ? AND sent_at IS NULL"
    ).bind(info.familyId, token).run();
    console.warn("owner new-member notification not delivered", error instanceof Error ? error.message : "unknown error");
    return "failed";
  }
}
