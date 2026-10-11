/**
 * Sends the real welcome email to one address so you can see it in an inbox.
 * Runs on your own computer only. It is not part of the deployed worker and adds no routes.
 *
 * Usage (from the worker/ folder):
 *   CF_ACCOUNT_ID=xxxx CF_API_TOKEN=xxxx npx tsx scripts/send-test-email.ts you@example.com "Your Name"
 *
 * CF_API_TOKEN needs permission to send email (Email Sending) for your account.
 * Optional: EMAIL_FROM to override the sender (default no-reply@sidequestlearning.app).
 */
import { welcomeEmail, DEFAULT_FROM } from "../src/email";

const to = process.argv[2];
const name = process.argv[3] || "Sam";
const accountId = process.env.CF_ACCOUNT_ID;
const token = process.env.CF_API_TOKEN;

if (!to || !to.includes("@") || !accountId || !token) {
  console.error('Usage: CF_ACCOUNT_ID=... CF_API_TOKEN=... npx tsx scripts/send-test-email.ts you@example.com "Your Name"');
  process.exit(1);
}

const msg = welcomeEmail(to, name);
const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    to: msg.to,
    from: { email: process.env.EMAIL_FROM || DEFAULT_FROM, name: "Side Quest" },
    reply_to: "support@sidequestlearning.app",
    subject: msg.subject,
    text: msg.text,
    html: msg.html,
  }),
});
const out: any = await res.json().catch(() => ({}));
console.log(res.status, JSON.stringify(out, null, 2));
process.exit(res.ok && out.success ? 0 : 1);
