import { SITE_URL, SUPPORT_EMAIL, button, esc, firstName, layout, note, p } from "./email";
import type { OutgoingEmail } from "./email";

/** Single-use one-hour reset link; never include the password itself in email. */
export function passwordResetEmail(to: string, name: string, link: string): OutgoingEmail {
  const n = firstName(name);
  const subject = "Reset your Side-Quest Learning password";
  const text = `Hi ${n},

We received a request to reset the password for your Side-Quest Learning parent account.

Choose a new password using this link:
${link}

For your security, the link can be used only once and expires in one hour.

If you didn't request a password reset, you can safely ignore this email. Your password won't change.

Need help? Contact ${SUPPORT_EMAIL}.

The Side-Quest Learning team

--
This is a security email relating to your account at sidequestlearning.app.`;
  const body = [
    p(`Hi ${esc(n)}, we received a request to reset your Side-Quest Learning password.`),
    button("Reset my password", link),
    note("<strong>For your security:</strong> This link works once and expires in one hour. If you didn't request this, ignore this email; your password will stay the same."),
    p(`If the button doesn't open, copy this link into your browser:<br/><span style="font-size:13px;word-break:break-all;color:#4A5D3A;">${esc(link)}</span>`),
    p(`Need help? Contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#4A5D3A;">${SUPPORT_EMAIL}</a>.`),
    p("The Side-Quest Learning team"),
  ].join("\n");
  return {
    to, subject, text,
    html: layout({
      preheader: "Reset your password with a secure, single-use link valid for one hour.",
      kicker: "Account security.",
      heading: "Reset your password",
      body,
      reason: "This email was sent because a password reset was requested for your account.",
    }),
  };
}

export function passwordChangedEmail(to: string, name: string): OutgoingEmail {
  const n = firstName(name);
  const subject = "Your Side-Quest Learning password has changed";
  const text = `Hi ${n},

The password for your Side-Quest Learning parent account has been changed.

If you made this change, no further action is needed.

If this wasn't you, reset your password immediately:
${SITE_URL}/forgot-password

Then contact us at ${SUPPORT_EMAIL} so we can help secure your account.

The Side-Quest Learning team

--
This is a security notification for your account at sidequestlearning.app.`;
  const body = [
    p(`Hi ${esc(n)}, the password for your Side-Quest Learning parent account has been changed.`),
    p("If you made this change, there's nothing else you need to do."),
    note(`<strong>Wasn't you?</strong> Reset your password immediately, then contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#4A5D3A;">${SUPPORT_EMAIL}</a> so we can help.`),
    button("Secure my account", `${SITE_URL}/forgot-password`),
    p("The Side-Quest Learning team"),
  ].join("\n");
  return {
    to, subject, text,
    html: layout({
      preheader: "A security update: your Side-Quest password was changed.",
      kicker: "Account security.",
      heading: "Your password was changed",
      body,
      reason: "This is a security notification about your Side-Quest Learning account.",
    }),
  };
}
