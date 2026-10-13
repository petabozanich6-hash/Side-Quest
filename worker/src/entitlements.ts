// Account-level entitlements. Pure functions with no imports so they can be unit tested directly.
// Billing is NOT LIVE: nothing here talks to a payment provider. The plan is only ever changed
// server-side (database or a future, authenticated billing webhook), never from a client request.

export type Plan =
  | "FREE_PREVIEW"
  | "PREVIEW_EXPIRED"
  | "ACTIVE_MONTHLY"
  | "ACTIVE_ANNUAL"
  | "PAST_DUE"
  | "CANCELLED"
  | "INTERNAL";

export type FamilyPlanRow = {
  plan?: string | null;
  created_at?: string | null;
  trial_started_at?: string | null;
  trial_ends_at?: string | null;
  plan_period_end?: string | null;
};

export type Limits = {
  maxChildren: number;
  maxLessons: number;
  maxActiveAssignments: number;
  canCreate: boolean; // create, edit, duplicate parent lessons
  canAssign: boolean;
  aiGeneration: boolean;
  fullExports: boolean;
};

export const TRIAL_DAYS = 7;

// One place to change preview/paid limits. Paid caps are fair-use safeguards, not product limits.
export const LIMITS: Record<"PREVIEW" | "EXPIRED" | "PAID", Limits> = {
  PREVIEW: { maxChildren: 1, maxLessons: 2, maxActiveAssignments: 2, canCreate: true, canAssign: true, aiGeneration: false, fullExports: false },
  EXPIRED: { maxChildren: 0, maxLessons: 0, maxActiveAssignments: 0, canCreate: false, canAssign: false, aiGeneration: false, fullExports: false },
  PAID: { maxChildren: 20, maxLessons: 5000, maxActiveAssignments: 5000, canCreate: true, canAssign: true, aiGeneration: true, fullExports: true },
};

const DAY_MS = 86400000;
const KNOWN: Plan[] = ["FREE_PREVIEW", "PREVIEW_EXPIRED", "ACTIVE_MONTHLY", "ACTIVE_ANNUAL", "PAST_DUE", "CANCELLED", "INTERNAL"];

export function trialEndFrom(startIso: string): string {
  return new Date(new Date(startIso).getTime() + TRIAL_DAYS * DAY_MS).toISOString();
}

function ms(v?: string | null): number | null {
  if (!v) return null;
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? null : t;
}

/**
 * The plan that actually applies right now.
 * - FREE_PREVIEW becomes PREVIEW_EXPIRED once the trial end has passed.
 * - CANCELLED keeps paid access until plan_period_end, then behaves as expired.
 * - PAST_DUE keeps paid access while payment is retried (grace); revisit when billing goes live.
 * - Unknown or missing values fail closed to PREVIEW_EXPIRED (never to a paid state).
 */
export function effectivePlan(row: FamilyPlanRow | null | undefined, now: Date = new Date()): Plan {
  if (!row) return "PREVIEW_EXPIRED";
  const raw = String(row.plan || "FREE_PREVIEW") as Plan;
  const plan: Plan = KNOWN.includes(raw) ? raw : "PREVIEW_EXPIRED";
  const t = now.getTime();
  if (plan === "FREE_PREVIEW") {
    const end = ms(row.trial_ends_at) ?? (ms(row.trial_started_at) ?? ms(row.created_at) ?? t) + TRIAL_DAYS * DAY_MS;
    return t < end ? "FREE_PREVIEW" : "PREVIEW_EXPIRED";
  }
  if (plan === "CANCELLED") {
    const end = ms(row.plan_period_end);
    return end !== null && t < end ? "ACTIVE_MONTHLY" : "CANCELLED";
  }
  return plan;
}

export function limitsFor(plan: Plan): Limits {
  switch (plan) {
    case "FREE_PREVIEW":
      return LIMITS.PREVIEW;
    case "ACTIVE_MONTHLY":
    case "ACTIVE_ANNUAL":
    case "PAST_DUE":
    case "INTERNAL":
      return LIMITS.PAID;
    default:
      return LIMITS.EXPIRED;
  }
}

export function isPaidPlan(plan: Plan): boolean {
  return limitsFor(plan) === LIMITS.PAID;
}

export const UPGRADE_MESSAGE =
  "This is included with a Family Membership. Upgrade to create unlimited lessons, add all your children and use the full planning and portfolio tools.";
