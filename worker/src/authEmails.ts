import { SITE_URL, SUPPORT_EMAIL, button, esc, firstName, layout, note, p } from "./email";
import type { OutgoingEmail } from "./email";

export function passwordResetEmail(to: string, name: string, link: string): OutgoingEmail {
  const n = firstName(name);
  const subject = "Reset your Side Quest password";
  const text = `Hi ${n},

We got a request to reset the password for your Side Quest parent account.

Choose a new password here (the link works once and expires in 1 hour):
${link}

Didn't ask for this? You can ignore this email and your password will stay the same.

Happy questing,
The Side Quest parent

--
You are getting this because someone asked to reset the password for this email address at sidequestlearning.app. Write to ${SUPPORT_EMAIL} any time.
Side Quest acknowledges the Traditional Custodians of Country throughout Australia and pays respect to Elders past and present.`;

  const body = [
    p(`Hi ${esc(n)}, we got a request to reset the password for your Side Quest parent account. Use the button below to choose a new one.`),
    button("Choose a new password", link),
    note(`This link works once and expires in <strong>1 hour</strong>. Didn't ask for this? You can ignore this email and your password will stay the same.`),
    p(`If the button doesn't work, copy this link into your browser:<br/><span style="font-size:13px;word-break:break-all;color:#4A5D3A;">${esc(link)}</span>`),
    p(`Happy questing,<br/><em>The Side Quest parent</em>`),
  ].join("\n");

  const html = layout({
    preheader: "Choose a new password. This link works once and expires in 1 hour.",
    kicker: "Lost your way?",
    heading: "Reset your password",
    body,
    reason: "You are getting this because someone asked to reset the password for this email address at sidequestlearning.app.",
  });
  return { to, subject, text, html };
}

export function passwordChangedEmail(to: string, name: string): OutgoingEmail {
  const n = firstName(name);
  const subject = "Your Side Quest password was changed";
  const text = `Hi ${n},

The password for your Side Quest parent account was just changed.

If that was you, there is nothing more to do.

If it wasn't you, reset your password again right away at ${SITE_URL}/forgot-password and reply to this email so I can help.

Happy questing,
The Side Quest parent

--
This is a security notice about your account at sidequestlearning.app. Write to ${SUPPORT_EMAIL} any time.
Side Quest acknowledges the Traditional Custodians of Country throughout Australia and pays respect to Elders past and present.`;

  const body = [
    p(`Hi ${esc(n)}, the password for your Side Quest parent account was just changed.`),
    p(`If that was you, there is nothing more to do.`),
    note(`<strong>Wasn't you?</strong> Reset your password again right away and reply to this email so I can help.`),
    button("Reset password again", `${SITE_URL}/forgot-password`),
    p(`Happy questing,<br/><em>The Side Quest parent</em>`),
  ].join("\n");

  const html = layout({
    preheader: "The password for your Side Quest account was just changed.",
    kicker: "All safe.",
    heading: "Your password was changed",
    body,
    reason: "This is a security notice about your account at sidequestlearning.app.",
  });
  return { to, subject, text, html };
}
