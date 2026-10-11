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

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");

function firstName(name: string) {
  const n = (name || "").trim().split(/\s+/)[0];
  return n || "there";
}

/** Wraps body paragraphs in a simple, tracker-free HTML layout. */
function layout(innerHtml: string) {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#F5EFE0;font-family:Georgia,'Times New Roman',serif;color:#1F3B2D;">
<div style="max-width:560px;margin:0 auto;background:#FFFDF6;border:1px solid #D4C8A8;border-radius:16px;padding:28px;line-height:1.55;font-size:16px;">
${innerHtml}
<p style="margin-top:28px;font-size:12px;color:#7A7461;">You are getting this because an account was created at sidequestlearning.app with this email address. Side Quest is a small personal project run by one parent in Australia. Reply to this email or write to ${SUPPORT_EMAIL} any time.</p>
</div></body></html>`;
}

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
The Side Quest parent`;
  const html = layout(`<h1 style="font-size:26px;margin:0 0 12px;">Welcome to Side Quest, ${esc(n)}</h1>
<p>Thank you for joining. Side Quest is a home learning hub I built for my own children and now share with other homeschooling families. You plan the learning, your children get their own space with lessons and a learning pet, and you keep the records in one place.</p>
<p style="margin-bottom:6px;"><strong>A good way to start</strong></p>
<ol style="margin-top:0;padding-left:22px;">
<li>Sign in at <a href="${SITE_URL}/login" style="color:#4A5D3A;">sidequestlearning.app</a>.</li>
<li>Add a child profile (a first name or nickname is plenty) and choose a username and a PIN that isn't used anywhere else.</li>
<li>Your child signs in separately with that username and PIN.</li>
</ol>
<p style="margin-bottom:6px;"><strong>A few things to know</strong></p>
<ul style="margin-top:0;padding-left:22px;">
<li>You are in charge. You can edit or delete a child profile, or your whole account, at any time.</li>
<li>There are no ads, no public profiles and no messaging between users.</li>
<li>Side Quest is built around the NSW curriculum and is a planning and record-keeping tool. It supports your teaching and does not replace it.</li>
<li>I'm one person, so replies can take a few days.</li>
</ul>
<p>Questions, ideas or something not working? Just reply to this email.</p>
<p>Happy questing,<br/>The Side Quest parent</p>`);
  return { to, subject, text, html };
}
