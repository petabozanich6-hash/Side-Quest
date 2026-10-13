# Superseded plan (cancelled 14 Oct 2026)

Historical record only. Do not act on it. The pre-written curriculum / 900-lesson plan is cancelled.

## 4. Approved product direction

**Content scope (changed 13 Oct 2026, latest instruction, wins over anything below):** Kindergarten to Year 10, 150 carefully curated lessons per stage across all core subjects. The six stages are Early Stage 1 (K), Stage 1 (Years 1-2), Stage 2 (Years 3-4), Stage 3 (Years 5-6), Stage 4 (Years 7-8) and Stage 5 (Years 9-10), so 6 x 150 = 900 lessons, written to the Lesson Standard v2 already in the repo. Lessons may be cross-curricular, covering verified outcomes from more than one subject. Years 11-12 are out of scope. The other 18,000+ queued placeholder rows are not to be authored; they are not deleted. Year 3 and Year 7 remain the first real-world test years, so their lessons are written first inside Stage 2 and Stage 4. Proposed split per stage (owner to confirm; Stage 4-5 subject names differ): English 45, Mathematics 45, Science and Technology 20, HSIE 20, PDHPE 10, Creative Arts 10, with about 20-30 cross-curricular. For two-year stages 150 lessons is about 75 per year, so this is a curated core spine, not full syllabus coverage; the app must say so.

Supersedes the all-lessons plan (19,202 / 4,902 individually authored lessons is cancelled; reuse existing work, delete none).

- A. Verified core teaching modules (reusable, with worked examples, practice, feedback, misconceptions, assessment, mapping).
- B. Adaptive practice and pathways.
- C. AI-supported electives and enrichment, kept separate from verified curriculum in the data model, with parent approval, caching and family-wide quotas.
- D. Homeschool management: parent and child dashboards, planning, portfolios, exports, printables, gamification (keep existing identity).
- E. Automatic curriculum and evidence tracking: NOT STARTED, INTRODUCED, PRACTISING, DEMONSTRATED, CONSOLIDATING, never awarded just for opening a lesson.
- Test focus: Stage 2 Year 3 and Stage 4 Year 7. Do not claim full K-10 coverage.
- Stage 2 is parent-guided; Stage 4 must support independent learning.
- No video. Interactive lessons only (SVG, in-site episodes, quizzes, activities). No external embeds, no runtime AI in verified lessons.
- Pricing (tentative, billing not activated): AUD $12.95/month or $129/year per family, all children and subjects included.
- 7-day limited free preview: one child, about 2-3 complete sample modules, one small assessment, demo of progress and planning, locked premium features. Enforced server-side. States: FREE_PREVIEW, PREVIEW_EXPIRED, ACTIVE_MONTHLY, ACTIVE_ANNUAL, PAST_DUE, CANCELLED. Never delete data at expiry. Cancelled keeps access to period end.
- Must not claim the app establishes legal compliance with NSW home education requirements.

## 5. Prioritised backlog

1. Confirm app and checkpoint. DONE.
2. Targeted repo cleanup (docs/scripts that describe a removed Python backend; list obsolete remote branches for owner approval; no history rewrite).
3. Run and verify the existing app. BLOCKED by npm access.
4. Reusable module schema: adapt `lesson-excellence` schema; one module renders in the real app and records progress.
5. Exemplar modules: Y7 Maths Integers, Y3 Maths Place Value, Y7 English Reading and Text Analysis, Y3 English Reading Comprehension.
6. Child and parent workflows: assign, complete, feedback, record, parent review.
7. Planning and evidence: map modules to verified outcomes; portfolio; export.
8. Entitlements: preview and paid states, server-side enforcement, configurable limits.
9. AI foundation: boundary, quotas, caching, approval, validation.
10. Expand verified coverage across required learning areas.
11. Beta hardening: family data separation, accessibility, mobile, journeys.

