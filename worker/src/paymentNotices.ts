/** Account-service emails for a missed membership payment, driven by the existing 5-minute cron.
 *
 * - payment_failed: once per missed payment, while the family is PAST_DUE and still inside its grace period.
 * - access_ended:   only after a payment_failed email for the same missed payment, once grace has run out
 *                   (or Stripe ended the subscription) and the family has not paid since.
 * - owner_past_due: the owner hears about each missed payment (live mode, opt-in address, no family details).
 *
 * A missed payment is identified by its grace-period end (`episode`), so a later missed payment emails again.
 * Like trial reminders, each email gets one provider attempt behind an atomic primary key and is never retried,
 * so a mail the provider accepted is never sent twice.
 */
import type { Env } from "./types";
import { effectivePlan } from "./entitlements";
import { button, esc, firstName, layout, note, p, sendEmail, SITE_URL, SUPPORT_EMAIL } from "./email";
import type { OutgoingEmail } from "./email";

export type PaymentNoticeKind = "payment_failed" | "access_ended" | "owner_past_due";
const DAY = 86_400_000;
const MAX_PER_RUN = 12;
// Never send an "access paused" email long after the fact (for example on the first run after deploying).
const ENDED_WINDOW = 3 * DAY;

const SCHEMA = `CREATE TABLE IF NOT EXISTS payment_notice_deliveries (
 family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
 kind TEXT NOT NULL CHECK (kind IN ('payment_failed','access_ended','owner_past_due')),
 episode TEXT NOT NULL,
 status TEXT NOT NULL CHECK (status IN ('attempting','sent','failed')),
 claimed_at TEXT NOT NULL, completed_at TEXT,
 PRIMARY KEY (family_id,kind,episode))`;

const longDate = (iso: string) => new Date(iso).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", timeZone: "Australia/Sydney" });

export function paymentNoticeEmail(kind: "payment_failed" | "access_ended", to: string, name: string, graceEnd: string): OutgoingEmail {
  const n = firstName(name), date = longDate(graceEnd);
  const failed = kind === "payment_failed";
  const subject = failed ? "Your Side-Quest payment didn't go through" : "Your Side-Quest membership is paused";
  const message = failed
    ? `We couldn't take your latest Family Membership payment. This usually means a card has expired or been replaced. Your family keeps full access until ${date} while the payment is retried. To keep everything running, please update your card.`
    : "We still couldn't take your Family Membership payment, so new lessons, assignments and AI drafting are paused for now. Nothing has been deleted: your lessons, your children's progress and your records are all safe. Your children can still finish lessons already assigned, and you can review their work.";
  const action = failed ? "Update your card" : "Restore your membership";
  const text = `Hi ${n},\n\n${message}\n\n${action}: ${SITE_URL}/parent/plan (choose Manage billing)\n\nIf you've already sorted this out, you can ignore this email. Questions? Reply to ${SUPPORT_EMAIL}.\n\nSide-Quest Learning`;
  return {
    to, subject, text,
    html: layout({
      preheader: failed ? `Full access continues until ${date}.` : "Your records are safe. Update your card to carry on.",
      kicker: failed ? "A quick note about your membership." : "Your adventure is still yours.",
      heading: failed ? "Your payment didn't go through" : "Your membership is paused",
      body: [
        p(`Hi ${esc(n)},`),
        p(esc(message)),
        failed
          ? note(`<strong>Full access until:</strong> ${esc(date)}<br/>Update your card on <strong>Your plan → Manage billing</strong>.`)
          : note("<strong>Nothing has been deleted.</strong> Update your card, or choose a plan, to unlock new lessons straight away."),
        button(action, SITE_URL + "/parent/plan"),
        p(`If you've already sorted this out, you can ignore this email. Questions? Reply to ${esc(SUPPORT_EMAIL)}.`),
      ].join("\n"),
      reason: "This account-service message is about your Side-Quest Family Membership payment. It is not a marketing subscription.",
    }),
  };
}

/** Owner-only, like the new-family alert: no parent, child or card details. */
export function ownerPastDueEmail(to: string, graceEnd: string, pastDue: number): OutgoingEmail {
  const date = longDate(graceEnd);
  const subject = "A Side-Quest membership payment didn't go through";
  const text = `A family's membership renewal payment failed. They keep full access until ${date} while Stripe retries the card, and they have been emailed asking them to update it.\n\nFamilies with a payment needing attention: ${pastDue}\n\nSee Owner HQ for details. This owner-only email contains no parent, child or card information.`;
  return {
    to, subject, text,
    html: layout({
      preheader: `Full access continues until ${date}.`,
      kicker: "Owner notice",
      heading: "A membership payment didn't go through",
      body: [
        p("A family's membership renewal payment failed. They have been emailed asking them to update their card."),
        note(`<strong>Full access until:</strong> ${esc(date)}<br/><strong>Families with a payment needing attention:</strong> ${pastDue}`),
        button("Open Owner HQ", SITE_URL + "/parent/hq"),
        p("This owner-only email contains no parent, child or card information."),
      ].join("\n"),
      reason: "You receive this because OWNER_NOTIFICATION_EMAIL is set for your Side-Quest Worker.",
    }),
  };
}

type Row = { family_id: string; email: string; name: string; plan: string; plan_period_end: string; created_at?: string; trial_started_at?: string; trial_ends_at?: string };

export async function processPaymentNotices(env: Env, now = new Date(), sender: typeof sendEmail = sendEmail) {
  if (!env.DB || !env.EMAIL) return { sent: 0, failed: 0 };
  const db = env.DB;
  await db.prepare(SCHEMA).run();
  const iso = now.toISOString();
  let sent = 0, failed = 0;

  const deliver = async (familyId: string, kind: PaymentNoticeKind, episode: string, email: OutgoingEmail) => {
    const claimed = await db.prepare(`INSERT OR IGNORE INTO payment_notice_deliveries (family_id,kind,episode,status,claimed_at)
      VALUES (?,?,?,'attempting',?)`).bind(familyId, kind, episode, iso).run();
    if (!claimed.meta?.changes) return;
    let ok = false;
    try { ok = await sender(env, email); } catch (e) { console.error("payment notices: provider attempt failed", e); }
    await db.prepare("UPDATE payment_notice_deliveries SET status=?,completed_at=? WHERE family_id=? AND kind=? AND episode=?")
      .bind(ok ? "sent" : "failed", iso, familyId, kind, episode).run();
    if (ok) sent++; else failed++;
  };
  const parents = `FROM families f JOIN users u ON u.id=f.owner_id LEFT JOIN family_admin_state fs ON fs.family_id=f.id
    WHERE COALESCE(fs.status,'active')='active' AND u.email LIKE '%@%.%'
      AND (u.email_verification_required_at IS NULL OR u.email_verified_at IS NOT NULL)`;

  // 1. Still inside the grace period: ask the parent to update their card, and tell the owner.
  const { results: due } = await db.prepare(`SELECT f.id AS family_id, f.plan, f.plan_period_end, u.email, u.name ${parents}
      AND f.plan='PAST_DUE' AND f.plan_period_end > ?
      AND NOT EXISTS (SELECT 1 FROM payment_notice_deliveries d WHERE d.family_id=f.id AND d.kind='payment_failed' AND d.episode=f.plan_period_end)
    ORDER BY f.plan_period_end ASC LIMIT ?`).bind(iso, MAX_PER_RUN).all<Row>();
  const owner = String(env.OWNER_NOTIFICATION_EMAIL || "").trim();
  // Sandbox payments must never email the owner, mirroring the new-family alert.
  const ownerOn = env.STRIPE_LIVE_ENABLED === "true" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner);
  for (const row of due || []) {
    await deliver(row.family_id, "payment_failed", row.plan_period_end, paymentNoticeEmail("payment_failed", row.email, row.name, row.plan_period_end));
    if (ownerOn) {
      const count = await db.prepare("SELECT COUNT(*) AS n FROM families WHERE plan='PAST_DUE' AND plan_period_end > ?").bind(iso).first<{ n: number }>();
      await deliver(row.family_id, "owner_past_due", row.plan_period_end, ownerPastDueEmail(owner, row.plan_period_end, Number(count?.n ?? 0)));
    }
  }

  // 2. A missed payment the parent was told about and never fixed: grace ran out, or Stripe gave up and ended
  //    the subscription. Paying again (any active plan) means effectivePlan is no longer CANCELLED, so no email.
  const since = new Date(now.getTime() - ENDED_WINDOW).toISOString();
  const { results: ended } = await db.prepare(`SELECT f.id AS family_id, f.plan, f.plan_period_end, f.created_at, f.trial_started_at, f.trial_ends_at,
      u.email, u.name, d.episode
    FROM payment_notice_deliveries d JOIN families f ON f.id=d.family_id JOIN users u ON u.id=f.owner_id
      LEFT JOIN family_admin_state fs ON fs.family_id=f.id
    WHERE d.kind='payment_failed' AND d.episode >= ?
      AND COALESCE(fs.status,'active')='active' AND u.email LIKE '%@%.%'
      AND f.plan IN ('PAST_DUE','CANCELLED') AND f.plan_period_end <= ? AND f.plan_period_end > ?
      AND NOT EXISTS (SELECT 1 FROM payment_notice_deliveries e WHERE e.family_id=f.id AND e.kind='access_ended' AND e.episode=d.episode)
    ORDER BY f.plan_period_end ASC LIMIT ?`).bind(since, iso, since, MAX_PER_RUN).all<Row & { episode: string }>();
  for (const row of ended || []) {
    if (effectivePlan(row as any, now) !== "CANCELLED") continue;
    await deliver(row.family_id, "access_ended", row.episode, paymentNoticeEmail("access_ended", row.email, row.name, row.episode));
  }
  return { sent, failed };
}
