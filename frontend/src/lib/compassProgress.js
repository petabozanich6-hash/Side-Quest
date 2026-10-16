/**
 * Shared view-only registration date/status interpretation.
 * This is never a governmental status check, just a summary of parent-entered Compass data.
 */
export const COMPASS_REGISTRATION_STATUS_LABELS = {
  not_started: "Not started",
  preparing: "Preparing application",
  submitted: "Application submitted",
  provisional: "Provisionally registered",
  approved: "Registered (parent-reported)",
  renewal_due: "Renewal underway",
};

export const compassPrettyDate = (iso) => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.valueOf()) || d.toISOString().slice(0, 10) !== iso) return null;
  return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(d);
};

const TZ = {
  NSW: "Australia/Sydney", VIC: "Australia/Melbourne", QLD: "Australia/Brisbane",
  WA: "Australia/Perth", SA: "Australia/Adelaide", TAS: "Australia/Hobart",
  ACT: "Australia/Sydney", NT: "Australia/Darwin",
};

export function compassToday(jurisdiction = "NSW", now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ[jurisdiction] || "Australia/Sydney",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const get = (type) => parts.find(p => p.type === type)?.value;
  return [get("year"), get("month"), get("day")].join("-");
}

const ordinal = (iso) => Date.parse(iso + "T00:00:00Z") / 86400000;

export function compassDaysUntil(iso, today) {
  if (!compassPrettyDate(iso) || !compassPrettyDate(today)) return null;
  return ordinal(iso) - ordinal(today);
}

/** Subtract calendar months, clamping end-of-month to last valid day. */
export function compassSubtractMonths(iso, months) {
  if (!compassPrettyDate(iso)) return null;
  const [year, month, day] = iso.split("-").map(Number);
  const first = new Date(Date.UTC(year, month - 1 - months, 1));
  const maximum = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  first.setUTCDate(Math.min(day, maximum));
  return first.toISOString().slice(0, 10);
}

export function compassRegistrationSummary(progress, jurisdiction, now = new Date()) {
  const status = progress?.registration_status || "not_started";
  const today = compassToday(jurisdiction, now);
  const expiry = progress?.expires_on || null;
  const renewalDeadline = jurisdiction === "ACT" ? compassSubtractMonths(expiry, 3) : null;
  const expiryDays = compassDaysUntil(expiry, today);
  const deadlineDays = compassDaysUntil(renewalDeadline, today);
  const result = {
    label: COMPASS_REGISTRATION_STATUS_LABELS[status] || "Not recorded",
    status,
    expiryDate: expiry ? compassPrettyDate(expiry) : null,
    approvedDate: progress?.approved_on ? compassPrettyDate(progress.approved_on) : null,
    submittedDate: progress?.submitted_on ? compassPrettyDate(progress.submitted_on) : null,
    renewalDeadline: renewalDeadline ? compassPrettyDate(renewalDeadline) : null,
    expiryDays,
    tone: status === "approved" ? "green" : "neutral",
    reminder: "",
  };
  if (expiryDays !== null && expiryDays < 0) {
    result.tone = "red";
    result.reminder = "The registration expiry date you entered has passed. Check your child's current registration with the official authority.";
  } else if (renewalDeadline && deadlineDays !== null && deadlineDays <= 0 && status !== "renewal_due") {
    result.tone = "red";
    result.reminder = "The ACT renewal deadline you entered has passed. ACT renewal applications are due at least three months before expiry. Check with the ACT Home Education team.";
  } else if (renewalDeadline && deadlineDays !== null && deadlineDays <= 30 && status !== "renewal_due") {
    result.tone = "amber";
    result.reminder = "ACT renewal should be submitted by " + result.renewalDeadline + ". Check your application preparations.";
  } else if (expiryDays !== null && expiryDays <= 90 && status !== "renewal_due") {
    result.tone = "amber";
    result.reminder = "Your recorded registration expires " + (expiryDays === 0 ? "today" : "in " + expiryDays + " days") + ". Check your state's renewal instructions.";
  } else if (status === "renewal_due") {
    result.tone = "amber";
    result.reminder = "You've marked a renewal as underway. Keep the official acknowledgement and check the registration expiry date.";
  } else if (status === "approved" && expiryDays === null) {
    result.tone = "amber";
    result.reminder = "Add the expiry date shown on your official registration certificate to see renewal warnings.";
  } else if (status === "submitted") {
    result.reminder = "Application submitted according to your records. Follow up with the authority for its actual status.";
  } else if (status === "provisional") {
    result.reminder = "Provisional registration according to your records. Confirm conditions and next steps with your authority.";
  } else if (status === "preparing") {
    result.reminder = "Keep preparing your child's application using the step-by-step Homeschooling Compass.";
  } else if (status === "not_started") {
    result.reminder = "Begin with the registration instructions for your family's state or territory.";
  }
  return result;
}
