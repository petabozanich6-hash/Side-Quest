import type { Env } from "./types";

export const DEFAULT_FROM = "no-reply@sidequestlearning.app";
export const SUPPORT_EMAIL = "support@sidequestlearning.app";
export const SITE_URL = "https://sidequestlearning.app";

export type OutgoingEmail = {
  to: string;
  subject: string;
  text: string;
  html: string;
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
      from: { email: env.EMAIL_FROM || DEFAULT_FROM, name: "Side Quest" },
      replyTo: SUPPORT_EMAIL,
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
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
const SERIF = "Georgia,'Times New Roman',Times,serif";
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
<div style="font-family:${SERIF};font-size:13px;letter-spacing:3px;text-transform:uppercase;color:${C.tan};">&#129517;&nbsp; Side Quest Learning</div>
<div style="font-family:${SERIF};font-style:italic;font-size:26px;line-height:1.2;color:${C.tan};margin-top:14px;">${esc(o.kicker || "Welcome home.")}</div>
</td></tr>
<tr><td bgcolor="${C.moss}" style="background:${C.moss};font-size:0;line-height:0;height:4px;">&nbsp;</td></tr>

<tr><td bgcolor="${C.paper}" style="background:${C.paper};border-left:1px solid ${C.line};border-right:1px solid ${C.line};padding:32px 30px 8px;">
<h1 style="margin:0 0 18px;font-family:${SERIF};font-size:28px;line-height:1.2;color:${C.forest};">${esc(o.heading)}</h1>
${o.body}
</td></tr>

<tr><td bgcolor="${C.paper}" style="background:${C.paper};border-left:1px solid ${C.line};border-right:1px solid ${C.line};padding:0 30px 26px;">
${divider}
<p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.stone};">${o.reason} Side Quest is a small personal project run by one parent in Australia. Just reply to this email, or write to <a href="mailto:${SUPPORT_EMAIL}" style="color:${C.moss};">${SUPPORT_EMAIL}</a>, and a real person will read it.</p>
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

/* ---------- Emails ---------- */

export function welcomeEmail(to: string, name: string): OutgoingEmail {
  const n = firstName(name);
  const subject = "Welcome to Side Quest";
  const text = `Hi ${n},

Welcome to Side Quest, and thank you for joining.

Side Quest is a home learning hub I built for my own children and now share with other homeschooling families. You plan the learning, your children get their own space with lessons and a learning pet, and you keep the records in one place.

A good way to start:
1. Sign in at ${SITE_URL}/login
2. Add a child profile (a first name or nickname is plenty) and choose a username and a PIN that isn't used anywhere else.
3. Your child signs in separately with that username and PIN.

A few things to know:
- You are in charge. You can edit or delete a child profile, or your whole account, at any time.
- There are no ads, no public profiles and no messaging between users.
- Side Quest is built around the NSW curriculum and is a planning and record-keeping tool. It supports your teaching and does not replace it.
- I'm one person, so replies can take a few days.

Questions, ideas or something not working? Just reply to this email.

Happy questing,
The Side Quest parent

--
You are getting this because an account was created at sidequestlearning.app with this email address. Side Quest is a small personal project run by one parent in Australia. Write to ${SUPPORT_EMAIL} any time.
Side Quest acknowledges the Traditional Custodians of Country throughout Australia and pays respect to Elders past and present.`;

  const body = [
    p(`Thank you for joining, ${esc(n)}. Side Quest is a home learning hub I built for my own children and now share with other homeschooling families. You plan the learning, your children get their own space with lessons and a learning pet, and you keep the records in one place.`),
    h2("Your first quest"),
    steps([
      `Sign in to your parent hub.`,
      `Add a child profile. A first name or nickname is plenty. Choose a username and a PIN that isn't used anywhere else.`,
      `Your child signs in separately with that username and PIN, and meets their learning pet.`,
    ]),
    button("Open Side Quest", `${SITE_URL}/login`),
    h2("A few things to know"),
    ul([
      `You are in charge. You can edit or delete a child profile, or your whole account, at any time.`,
      `There are no ads, no public profiles and no messaging between users.`,
      `Side Quest is built around the NSW curriculum. It's a planning and record-keeping tool that supports your teaching and doesn't replace it.`,
      `I'm one person, so replies can take a few days.`,
    ]),
    note(`Questions, ideas or something not working? Just reply to this email. I read every message.`),
    p(`Happy questing,<br/><em>The Side Quest parent</em>`),
  ].join("\n");

  const html = layout({
    preheader: "Your parent account is ready. Here's how to start your first quest.",
    kicker: "Welcome home.",
    heading: `Welcome to Side Quest, ${n}`,
    body,
    reason: "You are getting this because an account was created at sidequestlearning.app with this email address.",
  });
  return { to, subject, text, html };
}
