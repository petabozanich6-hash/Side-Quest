import type { Env } from "./types";
import { SUPPORT_EMAIL, esc, layout, p, note, sendEmail } from "./email";

/** Minimal shape of Cloudflare's ForwardableEmailMessage. */
export type InboundMessage = {
  readonly from: string;
  readonly to: string;
  readonly headers: Headers;
  forward(rcptTo: string): Promise<unknown>;
  setReject(reason: string): void;
};

const REPLY_WINDOW_MS = 24 * 60 * 60 * 1000;

const NO_REPLY_SENDER = /^(no-?reply|do-?not-?reply|mailer-daemon|postmaster|bounces?|notifications?|alerts?|auto(mated)?|daemon)([._+-].*)?@/i;

/** True when the message looks automated, bulk or like a bounce, so we must not auto-reply. */
function looksAutomated(h: Headers, from: string): boolean {
  const auto = (h.get("auto-submitted") || "no").toLowerCase();
  if (auto !== "no") return true;
  const prec = (h.get("precedence") || "").toLowerCase();
  if (/(bulk|junk|list|auto_reply)/.test(prec)) return true;
  if (h.has("list-id") || h.has("list-unsubscribe")) return true;
  if (h.has("x-auto-response-suppress") || h.has("x-autoreply") || h.has("x-autorespond")) return true;
  if (NO_REPLY_SENDER.test(from)) return true;
  if (/@(.*\.)?sidequestlearning\.app$/i.test(from)) return true;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(from)) return true;
  return false;
}

function replySubject(original: string | null): string {
  const clean = (original || "").replace(/[\r\n]+/g, " ").trim().slice(0, 120);
  if (!clean) return "Your message to Side-Quest Learning";
  return /^re:/i.test(clean) ? clean : `Re: ${clean}`;
}

export function autoReplyContent() {
  const text = `Hi there,

Thanks for reaching out to Side-Quest Learning! Your message has made it safely to our inbox.

Whether you've got a question, spotted something that isn't quite right or just have an idea to share, we're glad you got in touch. We'll reply as soon as we can.

There's no need to send your message again. If you're reporting a technical issue, it helps to know which page you were on and what happened. Please don't send passwords or payment card details.

Thanks for being part of the Side-Quest family. We're happy you're here.

Talk soon,
Side-Quest Learning

--
This is an automatic acknowledgement of the message you sent to ${SUPPORT_EMAIL}.`;

  const body = [
    p("Hi there! Thanks for getting in touch with Side-Quest Learning. Your message has made it safely to our inbox."),
    p("Whether you've got a question, spotted something that isn't quite right or have an idea to share, we're glad you reached out. We'll reply as soon as we can."),
    note("<strong>No need to send it again.</strong> If you're reporting a technical issue, mentioning the page you were on and what happened is helpful. Please don't include passwords or card details."),
    p("Thanks for being part of the Side-Quest family. We're happy you're here."),
    p("Talk soon,<br/><strong>Side-Quest Learning</strong>"),
  ].join("\n");

  const html = layout({
    preheader: "Thanks for reaching out! Your message has reached us.",
    kicker: "We're listening.",
    heading: "Your message is with us",
    body,
    reason: `This automatic acknowledgement was sent because you contacted ${esc(SUPPORT_EMAIL)}.`,
  });
  return { text, html };
}

/**
 * Cloudflare Email Routing handler. Always passes the message on to FORWARD_TO first,
 * then sends at most one themed auto-reply per sender per 24 hours.
 * Auto-reply problems are logged and never stop the original message being delivered.
 */
export async function handleInbound(message: InboundMessage, env: Env): Promise<void> {
  if (!env.FORWARD_TO) {
    console.error("inbound: FORWARD_TO is not set");
    message.setReject("Mailbox temporarily unavailable");
    return;
  }
  await message.forward(env.FORWARD_TO);

  try {
    const from = (message.from || "").trim().toLowerCase();
    if (looksAutomated(message.headers, from)) return;

    const cutoff = new Date(Date.now() - REPLY_WINDOW_MS).toISOString();
    const recent = await env.DB.prepare("SELECT sender FROM auto_replies WHERE sender = ? AND last_sent_at > ?")
      .bind(from, cutoff).first();
    if (recent) return;

    const { text, html } = autoReplyContent();
    const messageId = message.headers.get("message-id");
    const sent = await sendEmail(env, {
      to: from,
      subject: replySubject(message.headers.get("subject")),
      text,
      html,
      from: SUPPORT_EMAIL,
      headers: {
        "Auto-Submitted": "auto-replied",
        "X-Auto-Response-Suppress": "All",
        "Precedence": "auto_reply",
        ...(messageId ? { "In-Reply-To": messageId, "References": messageId } : {}),
      },
    });
    if (!sent) return;

    await env.DB.prepare(
      "INSERT INTO auto_replies (sender, last_sent_at) VALUES (?, ?) ON CONFLICT(sender) DO UPDATE SET last_sent_at = excluded.last_sent_at"
    ).bind(from, new Date().toISOString()).run();
  } catch (e: any) {
    console.error("inbound: auto-reply failed", e?.message);
  }
}
