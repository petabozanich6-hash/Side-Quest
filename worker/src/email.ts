import type { Env } from "./types";

export const DEFAULT_FROM = "no-reply@sidequestlearning.app";
export const SUPPORT_EMAIL = "support@sidequestlearning.app";
export const SITE_URL = "https://sidequestlearning.app";

export type OutgoingEmail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** Optional sender address override for this message. */
  from?: string;
  /** Optional extra headers (e.g. Auto-Submitted for automatic replies). */
  headers?: Record<string, string>;
};

/**
 * Sends one email through the Cloudflare Email Service binding (EMAIL).
 * Never throws: if the binding is missing or sending fails, it logs and returns false
 * so the action that triggered the email (e.g. sign up) is never blocked.
 */
export async function sendEmail(env: Env, msg: OutgoingEmail): Promise<boolean> {
  if (!env.EMAIL) {
    console.warn("email: EMAIL binding not configured, skipping send");
    return false;
  }
  try {
    await env.EMAIL.send({
      to: msg.to,
      from: { email: msg.from || env.EMAIL_FROM || DEFAULT_FROM, name: "Side-Quest Learning" },
      replyTo: SUPPORT_EMAIL,
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
      ...(msg.headers ? { headers: msg.headers } : {}),
    });
    return true;
  } catch (e: any) {
    console.error("email: send failed", e?.code, e?.message);
    return false;
  }
}

/* ---------- Theme ---------- */

const C = {
  forest: "#1F3B2D",
  moss: "#4A5D3A",
  fern: "#6B8A5B",
  sage: "#94A47F",
  tan: "#D4A574",
  terracotta: "#C77B5B",
  cream: "#F5EFE0",
  paper: "#FFFDF6",
  line: "#D4C8A8",
  stone: "#7A7461",
  ink: "#2B2B26",
};
const SERIF = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";
const SANS = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";

export const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");

export function firstName(name: string) {
  const n = (name || "").trim().split(/\s+/)[0];
  return n || "there";
}

/** Helpers for building themed body content. */
export const p = (html: string) =>
  `<p style="margin:0 0 16px;font-family:${SERIF};font-size:16px;line-height:1.6;color:${C.ink};">${html}</p>`;

export const h2 = (text: string) =>
  `<h2 style="margin:26px 0 8px;font-family:${SERIF};font-size:18px;line-height:1.3;color:${C.forest};">${esc(text)}</h2>`;

export const ul = (items: string[]) =>
  `<ul style="margin:0 0 16px;padding-left:20px;font-family:${SERIF};font-size:16px;line-height:1.6;color:${C.ink};">${items
    .map((i) => `<li style="margin:0 0 6px;">${i}</li>`)
    .join("")}</ul>`;

/** A numbered quest-style step list. */
export const steps = (items: string[]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px;">${items
    .map(
      (t, i) => `<tr>
<td valign="top" width="36" style="padding:0 0 12px;"><div style="width:26px;height:26px;border-radius:13px;background:${C.forest};color:${C.cream};font-family:${SERIF};font-size:14px;font-weight:bold;line-height:26px;text-align:center;">${i + 1}</div></td>
<td valign="top" style="padding:2px 0 12px;font-family:${SERIF};font-size:16px;line-height:1.55;color:${C.ink};">${t}</td>
</tr>`
    )
    .join("")}</table>`;

export const button = (label: string, href: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 22px;"><tr><td align="center" bgcolor="${C.terracotta}" style="border-radius:999px;"><a href="${esc(href)}" style="display:inline-block;padding:13px 30px;font-family:${SANS};font-size:15px;font-weight:bold;color:#FBF7EC;text-decoration:none;border-radius:999px;">${esc(label)}</a></td></tr></table>`;

/** A soft highlighted note box. */
export const note = (html: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:4px 0 18px;"><tr><td style="background:${C.cream};border-left:4px solid ${C.tan};border-radius:8px;padding:14px 16px;font-family:${SERIF};font-size:15px;line-height:1.55;color:${C.forest};">${html}</td></tr></table>`;

const divider = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:22px 0;"><tr><td style="border-top:1px solid ${C.line};font-size:0;line-height:0;height:1px;" width="42%">&nbsp;</td><td align="center" style="font-family:${SERIF};font-size:16px;color:${C.tan};padding:0 10px;line-height:1;">&#10047;</td><td style="border-top:1px solid ${C.line};font-size:0;line-height:0;height:1px;" width="42%">&nbsp;</td></tr></table>`;

type LayoutOpts = {
  preheader: string;
  kicker?: string;
  heading: string;
  body: string;
  reason: string;
};

/** Themed, table-based HTML layout that works in Gmail, Apple Mail and Outlook. */
export function layout(o: LayoutOpts) {
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light only"/>
<meta name="supported-color-schemes" content="light only"/>
<title>${esc(o.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${C.cream};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.cream};font-size:1px;line-height:1px;">${esc(o.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="${C.cream}" style="background:${C.cream};">
<tr><td align="center" style="padding:28px 14px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:580px;">

<tr><td bgcolor="${C.forest}" style="background:${C.forest};border-radius:18px 18px 0 0;padding:26px 30px 22px;">
<div style="font-family:${SERIF};font-size:13px;letter-spacing:3px;text-transform:uppercase;color:${C.tan};">&#128009;&nbsp; Side-Quest Learning</div>
<div style="font-family:${SERIF};font-style:italic;font-size:26px;line-height:1.2;color:${C.tan};margin-top:14px;">${esc(o.kicker || "Welcome home.")}</div>
</td></tr>
<tr><td bgcolor="${C.moss}" style="background:${C.moss};font-size:0;line-height:0;height:4px;">&nbsp;</td></tr>

<tr><td bgcolor="${C.paper}" style="background:${C.paper};border-left:1px solid ${C.line};border-right:1px solid ${C.line};padding:32px 30px 8px;">
<h1 style="margin:0 0 18px;font-family:${SERIF};font-size:28px;line-height:1.2;color:${C.forest};">${esc(o.heading)}</h1>
${o.body}
</td></tr>

<tr><td bgcolor="${C.paper}" style="background:${C.paper};border-left:1px solid ${C.line};border-right:1px solid ${C.line};padding:0 30px 26px;">
${divider}
<p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.stone};">${o.reason} Need help? Reply to this email or write to <a href="mailto:${SUPPORT_EMAIL}" style="color:${C.moss};">${SUPPORT_EMAIL}</a>.</p>
</td></tr>

<tr><td bgcolor="${C.forest}" style="background:${C.forest};border-radius:0 0 18px 18px;padding:18px 30px;">
<p style="margin:0;font-family:${SERIF};font-size:12px;line-height:1.6;color:${C.sage};">Side Quest acknowledges the Traditional Custodians of Country throughout Australia and pays respect to Elders past and present.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}


/* ---------- Account & membership emails ---------- */

export function welcomeEmail(to: string, name: string): OutgoingEmail {
  const n = firstName(name);
  const subject = "Welcome to Side-Quest Learning — your free preview is ready";
  const text = `Hi ${n},

Welcome to Side-Quest Learning! Your seven-day free preview starts now, with no payment card required.

Side-Quest brings your homeschool planning, lessons, children's learning activities and progress records together in one place.

Start here:
1. Sign in: ${SITE_URL}/login
2. Add your child's profile.
3. Create and assign your first lesson.
4. Explore your child's learning dashboard and track progress.

Your preview includes one child, up to two lessons and two active assignments. Paid Family Membership unlocks full family access and AI lesson drafting.

Questions or ideas? Reply to this email or write to ${SUPPORT_EMAIL}.

Happy questing,
The Side-Quest Learning team

--
You received this because a Side-Quest Learning account was created using this email address. If this wasn't you, contact ${SUPPORT_EMAIL}.`;
  const body = [
    p(`Hi ${esc(n)}! Your <strong>seven-day free preview</strong> starts now. No payment card needed.`),
    p("Side-Quest keeps your homeschool plans, lessons, child activities and learning records together, so you spend less time on admin and more time on learning."),
    h2("Your first quest"),
    steps([
      "Sign in to your parent dashboard.",
      "Add your child's profile.",
      "Create and assign your first lesson.",
      "Follow progress and keep learning evidence organised.",
    ]),
    button("Open Side-Quest", `${SITE_URL}/login`),
    note("<strong>Your free preview:</strong> One child, up to two lessons and two active assignments. A paid Family Membership unlocks full family access and AI lesson drafting."),
    p(`Questions or ideas? Reply to this email or contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#4A5D3A;">${SUPPORT_EMAIL}</a>.`),
    p("Happy questing,<br/><strong>The Side-Quest Learning team</strong>"),
  ].join("\n");
  return {
    to, subject, text,
    html: layout({
      preheader: "Your seven-day Side-Quest preview is ready. No card needed.",
      kicker: "Your next quest starts here.",
      heading: `Welcome to Side-Quest, ${n}!`,
      body,
      reason: "This was sent because a Side-Quest Learning account was created using your email address.",
    }),
  };
}

export type MembershipInterval = "weekly" | "fortnightly" | "monthly" | "yearly";
export type MembershipEmailDetails = {
  interval: MembershipInterval;
  amountCents: number;
  nextBillingAt: string;
  testMode?: boolean;
};

/** Confirmation sent only after Stripe's verified webhook activates the membership. */
export function membershipActivatedEmail(to: string, name: string, details: MembershipEmailDetails): OutgoingEmail {
  const n = firstName(name);
  const cadence: Record<MembershipInterval, string> = {
    weekly: "per week",
    fortnightly: "every two weeks",
    monthly: "per month",
    yearly: "per year",
  };
  const amount = `A$${(details.amountCents / 100).toFixed(2)}`;
  const frequency = cadence[details.interval];
  const next = new Date(details.nextBillingAt).toLocaleDateString("en-AU", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Australia/Sydney",
  });
  const sandbox = !!details.testMode;
  const subject = `${sandbox ? "[TEST] " : ""}Your Side-Quest Family Membership is active`;
  const text = `Hi ${n},

Your Side-Quest Learning Family Membership is active!

Plan: Family Membership (${details.interval})
Price: ${amount} ${frequency}
Next scheduled billing date: ${next}

Your membership renews automatically at the price and frequency above until you cancel. Manage your card, view invoices or cancel in Your Plan > Manage billing: ${SITE_URL}/parent/plan

Cancelling keeps your full access until the end of the current paid period.
${sandbox ? "\nThis is a Stripe sandbox test. No real payment was taken.\n" : ""}
Questions? Contact ${SUPPORT_EMAIL}.

Happy questing,
The Side-Quest Learning team

--
This is a subscription confirmation, not a tax invoice. Stripe sends payment documents separately where configured.`;
  const body = [
    p(`Hi ${esc(n)}! Your <strong>Family Membership is active</strong>. Your family's full access is ready.`),
    note(`<strong>Membership:</strong> Family Membership (${esc(details.interval)})<br/><strong>Price:</strong> ${amount} ${esc(frequency)}<br/><strong>Next billing:</strong> ${esc(next)}`),
    p(`Your membership renews automatically at this rate until you cancel. You can update your card, view invoices or cancel under <strong>Your Plan → Manage billing</strong>. If you cancel, access continues through the current paid period.`),
    button("Manage your membership", `${SITE_URL}/parent/plan`),
    ...(sandbox ? [note("<strong>Stripe sandbox test:</strong> No real payment was taken.")] : []),
    p(`Need help? Reply to this email or contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#4A5D3A;">${SUPPORT_EMAIL}</a>.`),
    p("Happy questing,<br/><strong>The Side-Quest Learning team</strong>"),
  ].join("\n");
  return {
    to, subject, text,
    html: layout({
      preheader: `Your membership is active: ${amount} ${frequency}. Next billing ${next}.`,
      kicker: "Full access unlocked.",
      heading: "Your membership is active!",
      body,
      reason: "You received this because your Side-Quest Family Membership was activated.",
    }),
  };
}
