# Offline lessons (children)

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
