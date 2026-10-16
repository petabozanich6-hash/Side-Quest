import { SITE_URL, SUPPORT_EMAIL, button, esc, firstName, layout, note, p } from "./email";
import type { OutgoingEmail } from "./email";

/** Single-use one-hour reset link; keep the security instructions plain and reassuring. */
export function passwordResetEmail(to: string, name: string, link: string): OutgoingEmail {
  const n = firstName(name);
  const subject = "Reset your Side-Quest Learning password";
  const text = `Hi ${n},

Need to reset your Side-Quest password? No problem.

We received a request to reset the password for your parent account. You can choose a new one using this link:
${link}

The link can only be used once and expires in one hour.

If you didn't request this, you don't need to do anything — your password won't change.

If you need a hand, reply to this email or contact ${SUPPORT_EMAIL}.

Take care,
Side-Quest Learning

--
This security email was sent because a password reset was requested for your account at sidequestlearning.app.`;

  const body = [
    p(`Hi ${esc(n)}, need to reset your Side-Quest password? No problem.`),
    p("We received a request to reset the password for your parent account. Use the button below to choose a new one."),
    button("Choose a new password", link),
    note("<strong>A quick security note:</strong> This link works once and expires in one hour. If you didn't request it, there's nothing you need to do — your password won't change."),
    p(`If the button isn't working, copy this link into your browser:<br/><span style="font-size:13px;word-break:break-all;color:#4A5D3A;">${esc(link)}</span>`),
    p(`Need a hand? Reply or email <a href="mailto:${SUPPORT_EMAIL}" style="color:#4A5D3A;">${SUPPORT_EMAIL}</a>.`),
    p("Take care,<br/><strong>Side-Quest Learning</strong>"),
  ].join("\n");

  return {
    to, subject, text,
    html: layout({
      preheader: "Here is your secure, one-time link to reset your password.",
      kicker: "A little help getting back in.",
      heading: "Reset your password",
      body,
      reason: "You received this because someone requested a password reset for your account.",
    }),
  };
}

export function passwordChangedEmail(to: string, name: string): OutgoingEmail {
  const n = firstName(name);
  const subject = "Your Side-Quest Learning password was changed";
  const text = `Hi ${n},

Just a quick note to let you know that the password for your Side-Quest parent account has been changed.

If that was you, you're all set.

If you didn't make this change, please reset your password straight away:
${SITE_URL}/forgot-password

Then contact us at ${SUPPORT_EMAIL} so we can help.

Take care,
Side-Quest Learning

--
This is a security notification for your account at sidequestlearning.app.`;

  const body = [
    p(`Hi ${esc(n)}, just a quick note to let you know your Side-Quest parent account password has been changed.`),
    p("If that was you, you're all set."),
    note(`<strong>Didn't make this change?</strong> Please reset your password straight away, then contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#4A5D3A;">${SUPPORT_EMAIL}</a> so we can help.`),
    button("Secure my account", `${SITE_URL}/forgot-password`),
    p("Take care,<br/><strong>Side-Quest Learning</strong>"),
  ].join("\n");

  return {
    to, subject, text,
    html: layout({
      preheader: "A quick security note about your Side-Quest parent account.",
      kicker: "Keeping your account safe.",
      heading: "Your password was changed",
      body,
      reason: "This is a security notification about your Side-Quest Learning account.",
    }),
  };
}

/** Confirming the real email address unlocks a new family account and starts its preview. */
export function parentVerificationEmail(to: string, name: string, link: string): OutgoingEmail {
  const n = firstName(name);
  return {
    to, subject: "Confirm your email to begin your SideQuest adventure 🐉",
    text: `Hi ${n},\n\nJust one small quest before we begin: confirm that this email address belongs to you. Your seven-day free preview starts after confirmation.\n\nOpen this link (valid for 48 hours, once only): ${link}\n\nIf you didn't register, you can ignore this message.\n\nSide-Quest Learning`,
    html: layout({
      preheader: "Confirm your email and start your seven-day preview.",
      kicker: "One small quest before we begin.",
      heading: "Confirm your email address",
      body: [
        p(`Hi ${esc(n)}, before the adventure begins, please confirm that this email address is yours.`),
        p("Your seven-day free preview starts when you confirm, not while you're waiting for this message."),
        button("Confirm my email", link),
        note("This secure link can be used once and expires in 48 hours. If you didn't sign up, simply ignore this email."),
      ].join("\n"),
      reason: "Someone used this email to register a new SideQuest family account.",
    }),
  };
}
