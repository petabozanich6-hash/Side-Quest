# Owner HQ — Special email announcements

Owner HQ now includes **Special emails** for occasional important notices. Messages are authored manually; there are no auto-campaigns, imported email lists, child addresses or daily newsletters.

## Recipients
- **Important service notice**: currently participating family parent accounts (active paid accounts or a current free preview; not suspended, cancelled or expired accounts). This category must remain strictly **non-promotional**: outages, important account/service changes, safety and security information. A checkbox confirms there is no advertising or upselling.
- **Optional special news**: only parents who have expressly opted in via **Parent Hub → Email preferences**. Existing parents default to not opted in; registration never silently opts in a parent. A consent/source/timestamp is stored.
- Parents can change their preference in the Parent Hub or unsubscribe from optional news from any message, without signing in. The link displays a confirmation page, with a POST action so automated email scanners cannot unsubscribe accidentally. Optional opt-outs are rechecked immediately before sending, not just when queuing.
- Service notices remain separate from optional news. Never put sales pitches, offers or promotion into an essential service notice.

## Owner workflow
1. Unlock Owner HQ with the passkey and select **Special emails**.
2. Select service notice or optional news, write a subject (6–140 characters) and message (20–6,000 characters).
3. **Preview and check recipients**. The recipient count is measured directly from the database; recipient identities are never shown or downloaded.
4. Acknowledge the message type and type **SEND N PARENTS** exactly. Owner HQ rejects sends when EMAIL is not configured, the count changes, or the phrase does not match.
5. After confirmation, the message is queued. A **5-minute Cloudflare Cron Trigger** sends up to **12 separate emails per run**, respecting current opt-outs and family suspension. Owner HQ shows actual provider handoffs, pending, failed and skipped counts; provider acceptance does not guarantee inbox delivery.
6. Stop a queued/in-progress announcement to prevent the remaining unsent messages from being sent. Already-sent emails cannot be recalled. No automatic retries for ambiguous send results to avoid duplicates.

Only active, passkey-unlocked Owner accounts can access the broadcast endpoints. All actions remain Origin + CSRF guarded and sending/cancellation is audited by ID/category/count without message bodies or recipient lists. A unique per-draft idempotency key prevents double-click/retry duplicate broadcasts. There is a safeguard of at most **three** announcements per rolling 24 hours.

## Cloudflare setup
- The production Wrangler config has an EMAIL send binding. Cloudflare Compute → Email Service → Email Sending must be onboarded for the Side-Quest domain.
- The production Wrangler config adds `triggers.crons=["*/5 * * * *"]`. Keep this schedule for queued broadcasts.
- SQL migration `0065_special_announcements.sql` is additive; the Worker also creates the schema idempotently when endpoints are used.
- Cloudflare Email Service has account-dependent daily and rate limits. If a provider call fails, the recipient is counted under **failed**, not silently claimed delivered.

## Privacy and Australian email rules
Optional commercial announcements require prior consent, business identification and functional unsubscribe. See [ACMA’s Avoid sending spam](https://www.acma.gov.au/Industry/Marketers/Anti-Spam/Ensuring-you-dont-spam/key-elements-of-the-spam-act-ensuring-you-dont-spam-i-acma). Non-promotional notices must not be mixed with promotions. The email contains the existing Side-Quest logo, organisation name and support contact, and an optional-email unsubscribe link.

This is not a sales email marketing platform: it is a deliberately narrow, owner-controlled special-notice facility.
