# Homeschooling Compass

Parent-facing route: /parent/homeschool-compass

## Purpose

A family sees the **one state or territory** selected in their profile, then gets plain-language home education registration and renewal instructions with direct government links. Compass complements, rather than duplicates, the existing Curriculum hub, Learning Plans, Evidence Backpack, Reading Log and Calendar.

Registration is always completed **with the official authority**. A status marked "approved" in Side-Quest is a parent's self-reported note and does not verify approval. Side-Quest must never claim to register a child, provide an exemption, or authorise withdrawal from school.

## Data and security

- Static guide content: frontend/src/data/homeschoolCompass.js. Content last manually checked 2026-10-16. Review official sources for changes, especially school attendance, provisionally permitted education, evidence and renewal.
- User-specific storage: migration 0061_homeschool_compass.sql and worker/src/homeschoolCompass.ts.
- /api/compass GET and /api/compass/:studentId PUT require authentication **and parent role**.
- Reads and writes use the authenticated user's family ID; PUT verifies the student belongs to that family before writing.
- Each progress row is scoped by family_id, student_id and jurisdiction. A state change opens that jurisdiction's separate checklist and preserves the previous state row.
- The server obtains jurisdiction from the family record rather than trusting a client-sent code.
- No identity documents, birth certificates, proof of address, medical information or court documents should be stored here.
- No automated government filing, reminders by email or push notification are implemented. On-screen urgency is calculated from parent-entered dates, with the ACT's legally defined three-month-before-expiry renewal timing.
- Database migration is additive and includes a runtime safe CREATE IF NOT EXISTS because production migration deployment is not guaranteed to precede code deployment.

## Before changing this feature

1. Check official registration and renewal pages for all eight jurisdictions. Do not treat third-party homeschool blog guidance as authoritative.
2. Verify when a currently enrolled child is lawfully permitted to leave school. NSW, Victoria, NT and Tasmania (before provisional registration) must not be presented as "apply and immediately withdraw".
3. Keep Tasmania's ten standards separate from the Australian Curriculum; the latter is not compulsory there.
4. Keep Victoria's learning plan across eight areas, Queensland's ongoing/provisional distinction, South Australia's exemption process, Western Australia's regional office/moderator process, and the ACT's post-registration Statement of Intent and annual report distinct.
5. Update COMPASS_REVIEWED_ON only after validating current guidance across the jurisdictions, and confirm that each government link still works.
6. Do not make a new state inherit another state's checklist statuses. Leave registration dates blank until supplied by the parent.
7. Run npm run test:worker, npm --prefix worker run typecheck, CI=false npm --prefix frontend run build and browser checks before merge.
8. When adding official deadlines, prefer authority-maintained current information to a hardcoded annual date. Dynamic reminders must say what input/source they're based on.

## Testing

worker/test/homeschoolCompass.test.mjs includes child/family isolation, parent-only access, input validation and interstate state isolation. The existing CI additionally tests frontend build and full-site browser regressions.

## Enhancements not yet delivered

- Parent-approved calendar events or opt-in email/push reminders for official dates.
- Source-backed question answering using verified jurisdiction content (must cite its government source and avoid invented legal conclusions).
- Monitoring for changed official registration guidance.
- A print/export view of a family's checklist without sensitive document uploads.

The website already has the required internal entry points and manual dates; these enhancements must not be presented as shipped until they are independently built and tested.
