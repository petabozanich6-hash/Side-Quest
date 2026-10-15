# Offline lessons (children)

**Family Membership feature.** Only families on a paid plan (or the complimentary INTERNAL plan) get offline lessons and
offline sign-in: the server reports `offline_allowed` (entitlements `limits.offlineLessons`) on child sign-in and on the
child's home page. For free-preview or lapsed families nothing is saved on the device; when a membership ends, the
device drops the child's saved lessons and offline sign-in the next time it's online. Work already waiting to be sent is
always kept and sent, whatever the plan.

Children can do their assigned lessons with no internet (in the car, on a plane), in the installed app or the browser.

## How it works for a child
1. While online, opening their home page saves every assigned, unfinished lesson on the device (up to 25). Saved
   lessons show **✓ Ready offline**.
2. With no signal, the app still opens (home-screen icon or browser) and shows those quests. The child works through
   them; answers save on the device.
3. They can answer the Quest check and hand in. With no signal these wait on the device ("Ready to hand in. It will be
   sent automatically when you're back online.").
4. Back online, the work is sent automatically, in order: saved answers, then the Quest check (marked by the server, as
   always), then the hand-in. The home page says what happened. If the Quest check wasn't passed, nothing is handed in:
   the lesson goes back to the child with their work kept, as it does online.

Needs the internet: checking practice answers, the "I'm stuck" helper, videos, photo uploads, older library quests,
and any lesson the child hasn't opened their home page for while online.

## Privacy
- Saved: what the server already sends a child for their own lessons (never answer keys: the server strips them),
  and their own work in progress. Stored in the browser's IndexedDB (`sq-offline`), keyed by child.
- Deleted on sign-out. A child with unsent work is warned before signing out.
- Not saved: parent hub data, other children's work, anything from other families. `/api` responses are never put in
  the service-worker cache; the app shell and built files (no family data) are.
- The privacy policy and cookie notice say this (updated with this feature).

## Code
- `frontend/src/lib/offline.js`: saved lessons, outbox, sending, sign-out wipe.
- `frontend/public/sw.js` (v3): saves the app shell and built files; with no signal `/`, `/child…` and `/get-app` open
  from the shell, other pages show the offline page.
- Test: `worker/test/e2e/offline-lessons.mjs` (stops the server to simulate no signal).

## Kids' app (a child's own device)
Parent Hub → **Children** → "Set up Side-Quest on your child's own phone or tablet" (or `/get-app?for=child`) installs
**SQ Kids** (`manifest-kids.webmanifest`, its own app id). Its icon opens straight to the child sign-in
(`/child-login?source=kids-app`); on that device the front page forwards to the child sign-in, and signing out returns
there. Installing from the child sign-in page also gives the kids' app. Older iPhones (before iOS 16.4) may open the page
the app was added from instead; adding it from the child sign-in page avoids that.

One device shared by parent and child: if the kids' link opens inside the Side-Quest app already installed (usual on
Android), the page offers "Open to my child's sign-in on this device" instead of a second app. The parent still signs in
from "Are you a parent? Sign in here", and Get the app → "Open to the front page again" switches it back.

## SQ Kids at its own address (kids.sidequestlearning.app)
For a truly separate kids' app (own icon, own sign-in, own saved lessons; a parent signed in to Side-Quest and a child
signed in to SQ Kids on one phone), SQ Kids is served from **kids.sidequestlearning.app**: the same Worker, API and
database, attached as a second custom domain. On that address the page uses the kids' manifest, opens to the child
sign-in, and every parent page (/login, /register, /parent…) shows "This is SQ Kids" with a link to the main site.
The main site's kids' setup (/get-app?for=child, Parent Hub → Children) checks whether the kids' address answers
(/api/health) and, if it does, sends families there; if not, it falls back to the same-address kids' app above.

Setup (once, Cloudflare dashboard): Workers & Pages → side-quest → Settings → Domains & Routes → Add → Custom domain →
`kids.sidequestlearning.app` → Add domain. Cloudflare creates the DNS record and certificate. No code change or
`wrangler.jsonc` change is needed (keep routes out of wrangler.jsonc so deploys never detach the dashboard domains).

## Signing in offline (SQ Kids / kids' devices)
On a kids' device, a successful online child sign-in also saves that child's token on the device encrypted with a key
derived from their username + PIN (PBKDF2-SHA-256, 200,000 rounds → AES-GCM; `src/lib/offlineSignIn.js`). With no
signal the same username and PIN decrypt it locally; a wrong PIN fails (5 wrong tries → wait a minute). No PIN or token
is stored in clear. Signing out of SQ Kids keeps the child's saved quests and unsent work (sent next time they sign in);
"Forget children saved on this device" on the SQ Kids sign-in deletes every saved child, quest and unsent work.
Back online, the server checks the token as usual: if the PIN was changed or the family was signed out everywhere, the
device's saved sign-in for that child is forgotten. Up to 6 children per device. The parent site is unchanged
(sign-out wipes everything; no offline sign-in).
