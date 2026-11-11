// Family Memberships bought in the Side-Quest Square Online shop (shop.sidequestlearning.app).
//
// The shop sells Square subscription plans whose name contains "Membership". Square Online checkouts are not created
// by the app, so there is no family id on the order. Instead, when Square tells us about the subscription we:
//   1. work out the billing interval from the plan variation's cadence (cached in square_shop_plans), and
//   2. match the Square customer to a parent account by email. If nobody has that email yet, we create the parent
//      account and family, and email a link to set a password.
// From then on the normal membership sync (squareMembership.ts) keeps the family unlocked while Square keeps
// charging, applies the past-due grace period on a failed renewal, and locks the account when the subscription ends.
import type { Env } from "./types";
import { newId } from "./types";
import { hashSecret } from "./auth";
import { trialEndFrom } from "./entitlements";
import { INTERVALS, type Interval } from "./billing";
import { squareCall, type SquareConfig, type Fetch } from "./square";
import { ensureSquareMembership } from "./squareMembership";
import { SITE_URL, SUPPORT_EMAIL, button, esc, firstName, layout, note, p, sendEmail, type OutgoingEmail } from "./email";

type DB = D1Database;
type Cfg = Extract<SquareConfig, { ok: true }>;

const SET_PASSWORD_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const CADENCE_TO_INTERVAL: Record<string, Interval> = { WEEKLY: "weekly", EVERY_TWO_WEEKS: "fortnightly", MONTHLY: "monthly", ANNUAL: "yearly" };
const IS_MEMBERSHIP = /membership/i;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS square_shop_plans (variation_id TEXT PRIMARY KEY, interval TEXT NOT NULL, plan_name TEXT, created_at TEXT NOT NULL)`,
];
const ready = new WeakMap<object, Promise<void>>();
async function ensureShopPlans(db: DB): Promise<void> {
  let p = ready.get(db);
  if (!p) {
    const made: Promise<void> = (async () => { for (const q of SCHEMA) await db.prepare(q).run(); })().catch((e) => { ready.delete(db); throw e; });
    ready.set(db, made);
    p = made;
  }
  return p;
}

/**
 * The membership interval for a Square plan variation sold in the shop, or null when it is not a Family Membership
 * plan (for example a Dragon Post or Quest box subscription). The answer is cached; "none" marks non-membership plans.
 */
export async function shopMembershipInterval(db: DB, cfg: Cfg, variationId: string, fetchImpl?: Fetch, now: Date = new Date()): Promise<Interval | null> {
  if (!variationId) return null;
  await ensureShopPlans(db);
  const cached = await db.prepare("SELECT interval FROM square_shop_plans WHERE variation_id = ?").bind(variationId).first<{ interval: string }>();
  if (cached) return INTERVALS.includes(cached.interval as Interval) ? (cached.interval as Interval) : null;

  const variation = (await squareCall(cfg, "GET", `catalog/object/${encodeURIComponent(variationId)}`, undefined, fetchImpl))?.object;
  const data = variation?.subscription_plan_variation_data;
  if (!data) return null;
  let planName = String(data.name || "");
  if (data.subscription_plan_id) {
    const plan = (await squareCall(cfg, "GET", `catalog/object/${encodeURIComponent(data.subscription_plan_id)}`, undefined, fetchImpl).catch(() => null))?.object;
    planName = String(plan?.subscription_plan_data?.name || planName);
  }
  const phases: any[] = Array.isArray(data.phases) ? data.phases : [];
  // The last phase is the ongoing one (earlier phases can be a discounted first period).
  const cadence = String(phases[phases.length - 1]?.cadence || "");
  const interval = IS_MEMBERSHIP.test(planName) ? CADENCE_TO_INTERVAL[cadence] ?? null : null;
  await db.prepare("INSERT OR REPLACE INTO square_shop_plans (variation_id, interval, plan_name, created_at) VALUES (?, ?, ?, ?)")
    .bind(variationId, interval ?? "none", planName.slice(0, 200), now.toISOString()).run();
  return interval;
}

const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254;

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function membershipAccountEmail(to: string, name: string, link: string): OutgoingEmail {
  const n = firstName(name);
  const subject = "Your Side-Quest Family Membership is ready";
  const text = `Hi ${n},

Thank you for joining Side-Quest! Your Family Membership is active and we've created your parent account using this email address.

Choose a password to sign in:
${link}

This link works once and expires in 7 days. If it expires, use "Forgot password" at ${SITE_URL}/login with this email address.

Your membership renews automatically through Square. You can manage or cancel it from your account at any time.

Need a hand? Reply to this email or contact ${SUPPORT_EMAIL}.

Happy questing,
Side-Quest Learning`;
  const body = [
    p(`Hi ${esc(n)}, thank you for joining Side-Quest!`),
    p("Your Family Membership is active and we've created your parent account using this email address. Choose a password to sign in and get started."),
    button("Choose your password", link),
    note("This link works once and expires in 7 days. If it expires, use <strong>Forgot password</strong> on the sign-in page with this email address."),
    p("Your membership renews automatically through Square. You can manage or cancel it from your account at any time."),
    p(`Need a hand? Reply or email <a href="mailto:${SUPPORT_EMAIL}" style="color:#4A5D3A;">${SUPPORT_EMAIL}</a>.`),
    p("Happy questing,<br/><strong>Side-Quest Learning</strong>"),
  ].join("\n");
  return {
    to, subject, text,
    html: layout({
      preheader: "Your Family Membership is active. Choose a password to sign in.",
      kicker: "Welcome to Side-Quest.",
      heading: "Your membership is ready",
      body,
      reason: "You received this because a Side-Quest Family Membership was bought with this email address.",
    }),
  };
}

/**
 * Links a Square customer (from a shop membership) to a family. Uses the parent account with the same email, or
 * creates one and emails a set-password link. Returns the family id, or null when Square has no usable email.
 */
export async function linkShopMembershipCustomer(db: DB, env: Env | undefined, cfg: Cfg, customerId: string, fetchImpl?: Fetch, now: Date = new Date()): Promise<{ familyId: string; created: boolean } | null> {
  if (!customerId) return null;
  await ensureSquareMembership(db);
  const linked = await db.prepare("SELECT family_id FROM square_members WHERE customer_id = ?").bind(customerId).first<{ family_id: string }>();
  if (linked) return { familyId: linked.family_id, created: false };

  const customer = (await squareCall(cfg, "GET", `customers/${encodeURIComponent(customerId)}`, undefined, fetchImpl))?.customer;
  const email = String(customer?.email_address || "").trim().toLowerCase();
  if (!validEmail(email)) return null;
  const name = [customer?.given_name, customer?.family_name].map((s: any) => String(s || "").trim()).filter(Boolean).join(" ") || email.split("@")[0];
  const ts = now.toISOString();

  let familyId: string;
  let created = false;
  const user = await db.prepare("SELECT id, family_id FROM users WHERE email = ?").bind(email).first<{ id: string; family_id: string }>();
  if (user) {
    familyId = user.family_id;
  } else {
    familyId = newId();
    const userId = newId();
    const token = randomToken();
    await db.batch([
      db.prepare("INSERT INTO families (id, name, owner_id, created_at, plan, trial_started_at, trial_ends_at) VALUES (?, ?, ?, ?, 'FREE_PREVIEW', ?, ?)")
        .bind(familyId, `${name}'s Family`, userId, ts, ts, trialEndFrom(ts)),
      // A random password nobody knows; the parent chooses their own from the emailed link. Buying with this email
      // through Square's checkout is the proof that the address belongs to them.
      db.prepare("INSERT INTO users (id, family_id, email, password_hash, name, is_owner, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)")
        .bind(userId, familyId, email, await hashSecret(randomToken()), name, ts),
      db.prepare("INSERT INTO password_resets (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)")
        .bind(newId(), userId, await sha256Hex(token), new Date(now.getTime() + SET_PASSWORD_TTL_MS).toISOString(), ts),
    ]);
    created = true;
    if (env) {
      try { await sendEmail(env, membershipAccountEmail(email, name, `${SITE_URL}/reset-password?token=${token}`)); }
      catch (e: any) { console.error("membership account email failed", e?.message); }
    }
  }
  await db.prepare(`INSERT INTO square_members (family_id, customer_id, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(family_id) DO UPDATE SET customer_id = excluded.customer_id, updated_at = excluded.updated_at`).bind(familyId, customerId, ts).run();
  return { familyId, created };
}
