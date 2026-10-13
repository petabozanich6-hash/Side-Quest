# Side-Quest execution record

**Last updated:** 14 October 2026. **Authoritative development branch:** `dev/sidequest-execution`. **Recovery checkpoint:** `checkpoint/pre-cleanup-2026-10-13` (preserve). This is the single project execution document. The code and confirmed tests outrank any stale statement below.

## Current mission — Australia-wide parent-to-child homeschooling platform

**Cancelled:** Producing 19,202 / 4,902 / 900 prewritten lessons, the Stage 2/4 lesson-authoring program, legacy curriculum research, lesson-excellence pipelines and proprietary curriculum release targets. Do not restart them. Do not promise complete syllabus coverage.

**Current product:** Parent creates or brings learning material -> saves in family lesson library -> assigns to child -> child learns and submits -> parent reviews -> progress, evidence and XP update. Preserve branding, parent and child dashboards, family-owned lessons, reusable assignment snapshots, independent child work and gamification. Future AI lesson drafting is optional; no paid AI API calls without approval.

**National scope:** Welcome Australian families, but do not claim that the application automatically satisfies any state or territory's homeschooling requirements. Links and any mapping must be verified for that jurisdiction.

**Pricing concept (not live):** AUD $12.95/month or $129/year, family-wide; a seven-day restricted free preview (one child, two family-created lessons and two active assignments) enforced on the server. No live billing or charges without approval.

## Codebase

- `frontend/`: React parent/child UI. Parent Lesson Builder: `frontend/src/pages/parent/LessonBuilder.jsx`; family library: `frontend/src/pages/parent/Lessons.jsx`.
- `worker/`: Cloudflare Worker API, D1, permissions, subscriptions/entitlements, assignments, submissions and XP.
- `worker/migrations/`: **historical immutable D1 migration chain**. Preserve all applied migration files and the schema, including `0050_lesson_builder_entitlements.sql`. The legacy curriculum seeds within older migrations remain for database reproducibility. Current family lesson APIs hide the 19,202 legacy records; their runtime database removal, if ever desired, requires separate backup, staging verification and explicit approval.
- `wrangler.jsonc`: deployment config; do not modify production services as part of source cleanup.

## Implemented on development branch — verification status

- Claude's 14 October report: 11 automated worker workflow tests passed against a test database after migrations 0001–0050. They covered lesson creation, assignment, child submission, parent review, idempotent XP, family isolation, preview limits and assignment snapshots.
- Subsequent commit `ffede6e`: server-side quiz marking and removal of correct answers from child-facing lesson views (requires continued CI/end-to-end verification).
- React Builder and Library screens exist. A real production build and browser/mobile walkthrough have **not been confirmed** here.
- Migration 0050 has **not** been approved/applied to production. File uploads require R2 (currently not live). AI and billing are not live.
- Remaining NSW-only wording and legal copy require review; parents' data privacy and security must be verified before public release.

## Targeted legacy lesson source cleanup

On branch `cleanup/remove-legacy-lesson-history-2026-10-14` (PR into `dev/sidequest-execution`), 149 obsolete files were removed from the **working tree only**: `docs/archive/`, `docs/lesson-plans/`, `docs/inventory/`, `lesson-bank/`, `lesson-excellence/`, legacy `scripts/`, and obsolete lesson-only scope/style documents. Root package scripts, README and CI tests were updated to remove discontinued pipeline references.

**What was not deleted:** applied migrations; live D1 records; Git commit history, backups and old branches; lesson builder implementation; assignment/submission/evidence/XP data; working parent/child interfaces. Original files remain recoverable through Git until intentional history rewriting (not authorised). This cleanup branch is not production.

## Next verified milestone

1. Obtain passing GitHub Actions install, worker tests, typecheck and frontend build **on the current development code**; fix failures rather than redoing the audit.
2. Run the full parent-register -> child -> build -> assign -> submit -> review -> evidence/XP journey in a real browser and on a phone, including preview expiry and family isolation.
3. Audit and correct remaining child-facing data leaks, missing attachments, data persistence, report/export access and national/legal wording. Clearly identify unsupported features.
4. Take a private remote D1 backup, verify staging migration 0050, and obtain owner approval before deploying.
5. Start with invited beta families only if functionality, privacy and safety checks pass. Payments remain off until live billing is secure, tested and approved.

**Anti-loop:** Do not reopen the cancelled lesson-production project, create new lesson validation frameworks or count placeholders as deliverables. Do not merge, deploy, rewrite Git history, delete remote branches, migrate production or incur costs without owner approval. Make small verified commits and continue with integration/testing.
