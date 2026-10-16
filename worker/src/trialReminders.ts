/** Non-promotional account-service reminders for the seven-day preview.
 * Existing 5-minute Cloudflare cron drives this alongside Owner HQ announcements.
 * One provider attempt per family/kind, protected by an atomic primary key.
 * No marketing opt-in needed for these strictly factual account status notices.
 */
import type { Env } from "./types";
import { effectivePlan } from "./entitlements";
import { button, esc, firstName, layout, note, p, sendEmail, SITE_URL } from "./email";

export type TrialReminderKind = "two_days_left" | "preview_ended";
const DAY = 86_400_000;
const MAX_PER_RUN = 12;

type Candidate = { family_id: string; email: string; name: string; plan: string; trial_ends_at: string };
const SCHEMA = `CREATE TABLE IF NOT EXISTS trial_reminder_deliveries (
 family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
 kind TEXT NOT NULL CHECK (kind IN ('two_days_left','preview_ended')),
 status TEXT NOT NULL CHECK (status IN ('attempting','sent','failed')),
 claimed_at TEXT NOT NULL, completed_at TEXT,
 PRIMARY KEY (family_id,kind))`;

/** A candidate's window is narrow: never send a reminder months after expiry. */
export function isDue(kind: TrialReminderKind, end: string, now = new Date()) {
  const ms = Date.parse(end) - now.getTime();
  if (!Number.isFinite(ms)) return false;
  return kind === "two_days_left" ? ms > DAY && ms <= 2 * DAY : ms <= 0 && ms > -DAY;
}
export function trialReminderEmail(kind: TrialReminderKind, to: string, name: string, end: string) {
  const n = firstName(name), date = new Date(end).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "Australia/Sydney" });
  const ending = kind === "preview_ended";
  const subject = ending ? "Your Side-Quest free preview has ended 🐉" : "Two days left in your Side-Quest preview 🐉";
  const message = ending
    ? "Your seven-day preview has ended. Your family account and learning records are safe. You and your child can still see saved work, finish lessons already assigned and review those submissions. Creating new lessons, reading entries or learning records requires an optional Family Membership."
    : "Your seven-day free preview is nearly finished. You have two days left to explore the available preview features before new learning creation becomes restricted. Your family's saved work will stay accessible.";
  const text = `Hi ${n},\n\n${message}\n\nPreview end date: ${date}.\n\nYou will not be charged automatically. You did not need to add a card. If you'd like to carry on creating new learning, Family Membership is optional: ${SITE_URL}/parent/plan\n\nThanks for adventuring with Side-Quest!\nSide-Quest Learning | support@sidequestlearning.app`;
  return {
    to, subject, text,
    html: layout({
      preheader: ending ? "Your records are safe. No automatic charge." : "Two days left. No automatic charge.",
      kicker: ending ? "Your adventure is still yours." : "The dragon has a little reminder.",
      heading: ending ? "Your preview has ended" : "Two days left to explore!",
      body: [
        p(`Hi ${esc(n)},`),
        p(esc(message)),
        note(`<strong>Preview end date:</strong> ${esc(date)}<br/><strong>No automatic charge.</strong> You can decide whether a membership is right for your family.`),
        button(ending ? "See your account and plans" : "View your remaining preview", SITE_URL + "/parent/plan"),
        p("The dragon and the Side-Quest team appreciate you giving this little adventure a try. 🐉"),
      ].join("\n"),
      reason: "This one-time account-service message is about the seven-day preview you started. It is not a marketing subscription.",
    }),
  };
}

/** Called on the existing cron. Max 12 messages per run to respect email sending limits.
 * Failure is recorded and not automatically retried; this prevents duplicate sends
 * when a provider accepted a mail but the Worker did not receive confirmation.
 */
export async function processTrialReminders(env: Env, now = new Date()) {
  if (!env.DB || !env.EMAIL) return { sent: 0, failed: 0 };
  const db = env.DB;
  await db.prepare(SCHEMA).run(); // Safe before/after applying migration 0066.
  let sent = 0, failed = 0;
  for (const kind of ["two_days_left", "preview_ended"] as const) {
    const earliest = kind === "two_days_left" ? new Date(now.getTime() + DAY).toISOString() : new Date(now.getTime() - DAY).toISOString();
    const latest = kind === "two_days_left" ? new Date(now.getTime() + 2 * DAY).toISOString() : now.toISOString();
    const { results } = await db.prepare(`
      SELECT f.id AS family_id, f.plan, f.trial_ends_at, u.email, u.name
      FROM families f JOIN users u ON u.id=f.owner_id
      LEFT JOIN family_admin_state fs ON fs.family_id=f.id
      WHERE f.plan IN ('FREE_PREVIEW','PREVIEW_EXPIRED')
        AND COALESCE(fs.status,'active')='active'
        AND f.trial_ends_at > ? AND f.trial_ends_at <= ?
        AND u.email LIKE '%@%.%'
        AND NOT EXISTS (SELECT 1 FROM trial_reminder_deliveries d
                        WHERE d.family_id=f.id AND d.kind=?)
      ORDER BY f.trial_ends_at ASC LIMIT ?`).bind(earliest, latest, kind, MAX_PER_RUN).all<Candidate>();
    for (const row of results || []) {
      if (!isDue(kind, row.trial_ends_at, now)) continue;
      // A family might subscribe or be suspended between selection and delivery.
      const current = await db.prepare(`SELECT f.plan,f.trial_ends_at,f.created_at,f.trial_started_at,f.plan_period_end,
        COALESCE(fs.status,'active') AS family_status
        FROM families f LEFT JOIN family_admin_state fs ON fs.family_id=f.id WHERE f.id=?`)
        .bind(row.family_id).first<any>();
      if (!current || current.family_status !== "active" ||
          !isDue(kind, current.trial_ends_at, now) ||
          (kind === "two_days_left" ? effectivePlan(current, now) !== "FREE_PREVIEW" : effectivePlan(current, now) !== "PREVIEW_EXPIRED") ||
          !["FREE_PREVIEW","PREVIEW_EXPIRED"].includes(current.plan)) continue;

      const claimed = await db.prepare(`INSERT OR IGNORE INTO trial_reminder_deliveries
        (family_id,kind,status,claimed_at) VALUES (?,?,'attempting',?)`)
        .bind(row.family_id, kind, now.toISOString()).run();
      if (!claimed.meta?.changes) continue;
      let ok = false;
      try { ok = await sendEmail(env, trialReminderEmail(kind, row.email, row.name, row.trial_ends_at)); }
      catch (e) { console.error("trial reminders: provider attempt failed", e); }
      await db.prepare(`UPDATE trial_reminder_deliveries SET status=?,completed_at=?
        WHERE family_id=? AND kind=?`)
        .bind(ok ? "sent" : "failed", now.toISOString(), row.family_id, kind).run();
      if (ok) sent++; else failed++;
    }
  }
  return { sent, failed };
}
