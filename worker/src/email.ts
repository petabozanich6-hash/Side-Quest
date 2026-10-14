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
<div style="font-family:${SERIF};font-style:italic;font-size:26px;line-height:1.2;color:${C.tan};margin-top:14px;">${esc(o.kicker || "Your next quest starts here.")}</div>
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
<p style="margin:0;font-family:${SERIF};font-size:12px;line-height:1.6;color:${C.sage};">Side-Quest Learning acknowledges the Traditional Custodians of Country throughout Australia and pays respect to Elders past and present.</p>
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
  const subject = "Welcome to the Side-Quest family! 🐉";
  const text = `Hi ${n},

We're so glad you're here. Welcome to the Side-Quest family!

Every homeschooling family has its own way of doing things. Some days run like clockwork; others take an unexpected detour (or three). Side-Quest is here to make the planning, lessons and record-keeping a little easier, whatever your days look like.

Your seven-day free preview is ready, with no payment card required.

Here's an easy place to start:
1. Sign in to your parent dashboard: ${SITE_URL}/login
2. Add your child's profile.
3. Create and assign your first lesson.
4. Explore the child dashboard and see how progress is recorded.

During your preview you can add one child, create up to two lessons and have two active assignments. A Family Membership unlocks more room for your family to learn, including AI lesson drafting and full portfolio access.

And please don't feel you need to set everything up on day one. One child, one lesson, one little win. That's a perfectly good beginning.

If you have a question, an idea or something isn't working, just reply to this email or write to ${SUPPORT_EMAIL}. We'd love to hear from you.

We're glad you've joined us. Happy questing!
Side-Quest Learning

--
You received this because a Side-Quest Learning account was created using this email address. If this wasn't you, contact ${SUPPORT_EMAIL}.`;

  const body = [
    p(`Hi ${esc(n)}, <strong>we're so glad you're here!</strong> Welcome to the Side-Quest family.`),
    p("Every homeschooling family has its own rhythm. Some days run like clockwork; others take an unexpected detour (or three). Side-Quest is here to make planning, lessons and record-keeping a little easier, whatever your days look like."),
    note("<strong>Your seven-day free preview is ready.</strong> No payment card required."),
    h2("Your first little quest"),
    steps([
      "Sign in to your parent dashboard.",
      "Add your child's profile.",
      "Create and assign your first lesson.",
      "Explore the child dashboard and see how progress is recorded.",
    ]),
    button("Let's get started", `${SITE_URL}/login`),
    p("No need to set everything up on day one. <strong>One child, one lesson, one little win</strong> is a perfectly good beginning."),
    note("<strong>While you're exploring:</strong> Your preview includes one child, up to two lessons and two active assignments. A Family Membership adds more room for your family, including AI lesson drafting and full portfolio access."),
    p(`Have a question, an idea or something that isn't working? Just reply or email <a href="mailto:${SUPPORT_EMAIL}" style="color:#4A5D3A;">${SUPPORT_EMAIL}</a>. We'd love to hear from you.`),
    p("We're glad you've joined us. Happy questing!<br/><strong>Side-Quest Learning</strong>"),
  ].join("\n");

  return {
    to, subject, text,
    html: layout({
      preheader: "We're glad you're here! Your seven-day preview is ready, no card needed.",
      kicker: "Come on in.",
      heading: `Welcome to the family, ${n}!`,
      body,
      reason: "This email was sent because a Side-Quest Learning account was created using your address.",
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
  const subject = `${sandbox ? "[TEST] " : ""}Your Side-Quest Family Membership is active!`;

  const text = `Hi ${n},

Great news — your Side-Quest Family Membership is active!

We're really glad you've chosen to keep learning with us. Whether your homeschool days are carefully planned or occasionally powered by snacks and improvisation, there's a place for your family here.

Here are your membership details:

Membership: Family Membership (${details.interval})
Price: ${amount} ${frequency}
Next scheduled billing date: ${next}

Your membership renews automatically at the price and frequency above until you cancel.

You can update your payment details, view invoices or cancel any time from Your Plan > Manage billing:
${SITE_URL}/parent/plan

If you cancel, your full access continues until the end of your current paid period.
${sandbox ? "\nThis is a Stripe sandbox test. No real payment was taken.\n" : ""}
We're looking forward to all the learning adventures and little wins ahead. Thanks for being part of the Side-Quest family!

Need a hand? Reply to this email or contact ${SUPPORT_EMAIL}.

Happy questing,
Side-Quest Learning

--
This is your membership confirmation, not a tax invoice. Payment documents are available separately through Stripe where configured.`;

  const body = [
    p(`Hi ${esc(n)}, <strong>great news — your Family Membership is active!</strong>`),
    p("We're really glad you've chosen to keep learning with us. Whether your homeschool days are carefully planned or occasionally powered by snacks and improvisation, there's a place for your family here."),
    h2("Your membership at a glance"),
    note(`<strong>Membership:</strong> Family Membership (${esc(details.interval)})<br/><strong>Price:</strong> ${amount} ${esc(frequency)}<br/><strong>Next billing:</strong> ${esc(next)}`),
    p(`Your membership renews automatically at the price and frequency above until you cancel. To update your payment details, view invoices or cancel, visit <strong>Your Plan → Manage billing</strong>. Cancelling keeps your full access until the end of your paid period.`),
    button("Manage your membership", `${SITE_URL}/parent/plan`),
    ...(sandbox ? [note("<strong>Stripe sandbox test:</strong> No real payment was taken.")] : []),
    p("We're looking forward to all the learning adventures and little wins ahead. Thanks for being part of the Side-Quest family!"),
    p(`Need a hand? Reply to this email or contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#4A5D3A;">${SUPPORT_EMAIL}</a>.`),
    p("Happy questing,<br/><strong>Side-Quest Learning</strong>"),
  ].join("\n");

  return {
    to, subject, text,
    html: layout({
      preheader: `Your membership is active! ${amount} ${frequency}; next billing ${next}.`,
      kicker: "Here's to what's next.",
      heading: "Your membership is active!",
      body,
      reason: "You received this because your Side-Quest Family Membership was activated.",
    }),
  };
}


/** Owner-only celebration: no parent, child or payment-card information. */
export function newPaidFamilyOwnerEmail(
  to: string,
  details: { interval: MembershipInterval; amountCents: number; activeFamilies: number },
): OutgoingEmail {
  const cadence: Record<MembershipInterval, string> = {
    weekly: "per week",
    fortnightly: "every two weeks",
    monthly: "per month",
    yearly: "per year",
  };
  const plan = `A$${(details.amountCents / 100).toFixed(2)} ${cadence[details.interval]}`;
  const active = Math.max(0, Math.floor(details.activeFamilies));
  const subject = "🐉 ACHIEVEMENT UNLOCKED: A new Side-Quest family!";
  const text = `ACHIEVEMENT UNLOCKED: YOUR KINGDOM IS GROWING!

A new family has just started a paid Side-Quest Family Membership!

Membership: ${plan}
Active paying families: ${active}

Somewhere in Australia, a parent has decided to make homeschooling a little less chaotic.

The dragons approve. The goblins are celebrating. Your kingdom grows stronger.

LONG LIVE SIDE-QUEST! 💚

This is an owner-only notification for a new paid membership. Renewals and card-free previews do not trigger this email.
No children's personal information or payment details are included.`;
  const body = [
    p("<strong>ACHIEVEMENT UNLOCKED: YOUR KINGDOM IS GROWING!</strong>"),
    p("Another family has officially joined the Side-Quest adventure with a paid Family Membership."),
    note(`<strong>New membership:</strong> ${esc(plan)}<br/><strong>Active paying families:</strong> ${active}`),
    p("Somewhere in Australia, a parent has decided to make homeschooling a little less chaotic."),
    p("The dragons approve. The goblins are celebrating. Your kingdom grows stronger."),
    p("<strong>LONG LIVE SIDE-QUEST! 💚</strong>"),
    p("This owner-only email is for the first paid membership of a family, not a renewal. It does not include children's details or card information."),
  ].join("\n");
  return {
    to, subject, text,
    html: layout({
      preheader: `One new paid family! ${plan}; ${active} active paying families.`,
      kicker: "A new adventurer approaches!",
      heading: "Your kingdom is growing!",
      body,
      reason: "This is an internal Side-Quest owner alert for a new paid Family Membership.",
    }),
  };
}
