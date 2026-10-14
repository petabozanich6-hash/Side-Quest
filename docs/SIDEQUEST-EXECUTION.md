# Side-Quest execution record

**Last updated:** 14 October 2026. **Authoritative development branch:** `dev/sidequest-execution`. **Recovery checkpoint:** `checkpoint/pre-cleanup-2026-10-13` (preserve). This is the single project execution document. The code and confirmed tests outrank any stale statement below.

## Current mission — Australia-wide parent-to-child homeschooling platform

**Cancelled:** Producing 19,202 / 4,902 / 900 prewritten lessons, the Stage 2/4 lesson-authoring program, legacy curriculum research, lesson-excellence pipelines and proprietary curriculum release targets. Do not restart them. Do not promise complete syllabus coverage.

**Current product:** Parent creates or brings learning material -> saves in family lesson library -> assigns to child -> child learns and submits -> parent reviews -> progress, evidence and XP update. Preserve branding, parent and child dashboards, family-owned lessons, reusable assignment snapshots, independent child work and gamification. AI lesson drafting is built in from the start on Cloudflare Workers AI, for **paid plans only** (enforced on the server; free preview and expired users are refused). The manual builder never depends on AI.

**National scope:** Welcome Australian families, but do not claim that the application automatically satisfies any state or territory's homeschooling requirements. Links and any mapping must be verified for that jurisdiction.

**Pricing concept (not live):** AUD $12.95/month or $129/year, family-wide; a seven-day restricted free preview (one child, two family-created lessons and two active assignments) enforced on the server. No live billing or charges without approval.

## Codebase

- `frontend/`: React parent/child UI. Parent Lesson Builder: `frontend/src/pages/parent/LessonBuilder.jsx`; family library: `frontend/src/pages/parent/Lessons.jsx`.
- `worker/`: Cloudflare Worker API, D1, permissions, subscriptions/entitlements, assignments, submissions and XP.
- `worker/migrations/`: **historical immutable D1 migration chain**. Preserve all applied migration files and the schema, including `0050_lesson_builder_entitlements.sql`. The legacy curriculum seeds within older migrations remain for database reproducibility. Current family lesson APIs hide the 19,202 legacy records; their runtime database removal, if ever desired, requires separate backup, staging verification and explicit approval.
- `wrangler.jsonc`: deployment config; do not modify production services as part of source cleanup.

## Operating mode (14 Oct 2026)

Claude builds and integrates; the owner tests by hand; ChatGPT may prepare small PRs; GitHub Actions verifies. Work follows the Master Product Completion workstreams A to P below. IMPLEMENTED means written and building; VERIFIED means exercised by CI (worker tests plus browser end-to-end). Neither means owner-tested.

## Workstream checklist

| | Workstream | Status | Notes / next |
|---|---|---|---|
| A | Lesson Builder | VERIFIED (core) | Guided builder, preview, draft/ready, archive/restore/duplicate, links/YouTube/Vimeo embeds. Next: topic field, image support, worksheet print, parent-assessed practical task type. |
| B | Family Library | IMPLEMENTED | Search, archive view. Next: filters by subject/child/year and draft/published tabs. |
| C | Assignment and scheduling | IMPLEMENTED | Assign with snapshot, calendar add/extra days. Next: multi-child, move/cancel/reassign, status vocabulary. |
| D | Child dashboard | VERIFIED (core) | XP, done, waiting, handed-in lists. |
| E | Submissions and review | VERIFIED | Draft autosave, quiz gate, hand-in, review states, XP once. |
| F | Planner | IMPLEMENTED | Uses assignments. Next: weekly/daily view polish. |
| G | Resources and files | IMPLEMENTED | R2 code verified against local bucket in CI; production bucket binding is an owner step. |
| H | Evidence Backpack | IMPLEMENTED | Auto evidence on accepted review, parent notes, search. Printable record of learning and progress for any state or territory home education review (framework follows the family's jurisdiction; Australian Curriculum v9 when unset; NSW codes only for NSW families): KLA coverage summary with gaps, syllabus outcomes evidenced (achieved / working towards, first and latest evidence), dated work samples by KLA earliest-first with embedded photos, reviewed life learning, parent summary and declaration (`worker/src/portfolio.ts`, `frontend/src/lib/portfolioDoc.js`). |
| I | Progress tracking | IMPLEMENTED | Completed vs demonstrated distinguished in XP/evidence. Next: summaries. |
| J | Portfolio and exports | IMPLEMENTED | Print portfolio (preview-limited). Next: date range, CSV. |
| K | Family onboarding | IMPLEMENTED | Get-started checklist. Next: state/territory at registration, child avatar/theme. |
| L | Seven-day free preview | VERIFIED | Server-enforced limits and expiry. |
| M | Paid subscription | NOT STARTED | Stripe test mode only; needs owner's Stripe test keys. No live charges. |
| N | Dashboards (real data only) | IMPLEMENTED | |
| O | Mobile/tablet | VERIFIED (phone layouts) | Tablet pass pending. |
| P | Production hardening | NOT STARTED | Password reset, account deletion, legal pages flagged for owner/legal review. |
| AI | Paid-only AI lesson drafting | IMPLEMENTED, tests passing locally | See below. |

## AI lesson drafting (paid plans only)

- Route `POST /api/ai/lesson-draft`, status `GET /api/ai/status`. Code: `worker/src/aiDraft.ts`. UI: "Draft with AI" panel in the builder (free users see an upgrade note, no fake AI).
- Server checks `limitsFor(plan).aiGeneration` first: FREE_PREVIEW, PREVIEW_EXPIRED and CANCELLED get 402 `UPGRADE_REQUIRED` before any AI call or usage record. Existing INTERNAL families count as paid.
- Fair use: 10 drafts per family per day, 60 per month (`ai_usage` table, migration 0051). Failed calls do not use the allowance.
- Output is a whitelist, passed through the same sanitiser as manual lessons, links removed, always saved as an unreviewed DRAFT labelled "AI-generated" (`ai_generated`, `source: ai`). Marking it ready records a parent review. No curriculum alignment is claimed.
- Cloudflare requirement: `"ai": {"binding": "AI"}` is in `wrangler.jsonc`. Workers AI has a free daily allowance and bills per use beyond it, so owner should confirm the Cloudflare plan. Optional vars `AI_MODEL`, `AI_GATEWAY_ID`. If the binding is missing the route returns 503 `AI_UNAVAILABLE`.
- **Migration 0051 must be applied (after backup) before deploying**, same as 0050. CI never calls real AI; it checks the paywall and uses a stub binding in worker tests.
- Provider and model: Cloudflare Workers AI, `@cf/meta/llama-3.3-70b-instruct-fp8-fast` (override with `AI_MODEL`). One request per draft, plus one automatic retry only if the first reply fails a depth check (explanation length, worked examples with steps, practice, questions, quiz, parent guide). The retry counts as the same single draft for the family allowance.
- Inputs: year level/age, subject, topic, learning goal, duration (15 to 90 min), parent-guided or independent, interests, additional needs, parent instructions.
- Lesson model (additive, `lessons.data` JSON): delivery, introduction, worked_examples, guided_practice (hint child-visible, answer parent-only), support, extension (child-visible), materials, parent_script, evidence_suggestions. Parent-only: answer_key, parent_script, support, evidence_suggestions, guided answers, quiz correct answers.
- Reference example (also the example lesson in the builder): `frontend/src/data/exampleLesson.json`, a Year 3 gardening addition lesson, 60 minutes, parent-guided. It is hand-written, NOT model output, and is used by tests and the browser check.
- Generator (14 Oct, second pass): plan-first JSON (`teaching_plan` before content), one reference lesson as a few-shot turn (parent-guided: Year 3 gardening addition; independent: Year 7 negative integers; both in `frontend/src/data/` and mirrored in `worker/src/data/referenceLessons.ts`, hand-written), 8000 max output tokens, temperature 0.4, truncated-JSON salvage, and a lightweight quality gate (teaching depth for the duration, worked-example steps, practice, answers present, fake-resource mentions, vague activities, arithmetic check, student voice for independent lessons). Real problems get ONE targeted repair request (only the weak keys); hard failures return an error and use no allowance; soft issues are saved as visible review flags (`ai_flags`).
- Not yet verified: the real model's output quality (no Cloudflare credentials in the build environment). Owner testing needed.

## Zero-burden lesson builder (14 Oct 2026)

Two modes share the same storage, assignment and child player.
- **Make it for me** (`/parent/lessons/make`): one sentence plus "Who is this for?". `worker/src/aiRequest.ts` reads subject, year, length, theme, delivery and lesson count from the sentence (plain pattern matching, no AI call) and fills the rest from the child's profile (year, interests, `extra.prefs`). Order of precedence: explicit fields, the sentence, the child's saved preferences, defaults (45 minutes; parent-guided below Year 7). The parent's own words are always passed to the model too.
- **I'll build it myself** (`/parent/lessons/new`): the manual editor, unchanged and with no auto-inserted content. It now warns before leaving with unsaved changes and autosaves existing drafts every 30 s (never lessons marked ready).
- **Child learning preferences** live in `students.extra.prefs` (no migration): usual length, parent-guided or independent, reading confidence, explanation complexity, activity types, support areas, extension areas, equipment, other. Entered by the parent only, never inferred, returned only to parent endpoints.
- **Review screen** (`/parent/lessons/:id/review`): readable document with answers and teaching guide; Looks Good - Assign (marks ready, opens the date/child picker with the child preselected), Ask AI to Change Something, Edit Manually, Save for Later, Printable version.
- **Conversational changes** (`POST /api/ai/lesson-refine`, then `POST /api/lessons/:id/apply-patch`): the model returns only the parts that change; the parent sees now/proposed side by side and nothing is saved until "Use this change". Only the named parts are replaced, so manual edits elsewhere survive. Own allowance: 20 per day, 120 per month.
- **Printable worksheet** (`/print/lesson/:id`, `?answers=1` for the parent copy): built from the saved lesson (all questions and passages are inside it).
- **Several lessons** (`POST /api/ai/series-plan`): one small planning call returns N titled, ordered lessons (2 to 6). The app then writes them one at a time through the normal single-lesson path, so each is quality-checked and counts as a draft. The plan call refuses up front if the day or month allowance cannot cover N lessons.
- **Lesson sets are kept on the server** (`lesson_batches` / `lesson_batch_items`, migration 0056, `worker/src/lessonBatches.ts`). "Write all" first creates the set (`POST /api/ai/batches`, idempotent on a client id), then each lesson is written with `POST /api/ai/batches/:id/items/:index/draft`, which claims the slot atomically: a finished slot returns its existing lesson (no AI call, parent edits untouched), a slot already being written returns 409 `IN_PROGRESS`, and a slot stuck "generating" for over 6 minutes counts as interrupted and can be retried. A failed lesson never hides the others and is retried on its own. The set page (`/parent/lessons/drafts/:id`) lists every lesson with its state (not written yet, generating, failed, ready for review, edited/saved, assigned, archived), resumes unwritten lessons after a refresh, and assigns the remaining lessons one a day from next Monday (re-reading each lesson first and skipping ones already assigned). Each slot also keeps how its lesson was made (child, year, length, delivery, warnings, generation report), so a lesson opened from a set gets the same review as a single lesson, including automatic video suggestions, after moving between lessons or refreshing; the set page shows how many videos each lesson has. Lessons opened from a set carry `?batch=` so the review page shows previous/next and "All drafts", and the Parent Hub shows "Lesson Drafts Awaiting Review". Previously the set lived only in the Make a Lesson page's memory and was lost as soon as one lesson was opened.
- **Migration 0056 must be applied (after backup) before deploying** this change; it only adds two tables.
- **Resource to lesson**: paste text (up to 8,000 characters used). The model keeps the content as readings or activity tasks and adds the teaching around it. **Not done, blocked:** PDF/Word upload needs the R2 bucket binding (owner step) plus a text extractor; web links are deliberately not fetched (the request is refused with a clear message, or the link is ignored with a warning).
- **Quality gate additions:** unfinished placeholder text, passages cut off mid-sentence, quiz questions unrelated to the teaching.
- Allowances (per family): 10 drafts/day, 60/month; 20 changes/day, 120/month; plan calls 20/day. Free and expired users are blocked on the server for all of these.
- **Cost estimate (unverified against the Cloudflare price list):** about 1.5 to 2.5 US cents per full draft, under 1 cent per change, a fraction of a cent per plan. Worst case at the monthly limits is roughly US$2 to 3 per family, against A$12.95 revenue. No model change was made.
- **Still unverified:** real model output (no Cloudflare credentials in the build environment). The owner's three acceptance prompts are the test.

## Implemented on the development branch (verified by CI unless noted)

- GitHub Actions (`.github/workflows/ci.yml`): npm install, worker tests (11), worker TypeScript check, real frontend production build, and a browser end-to-end run against a local Worker and local D1. Logs and screenshots are pushed to the `ci-results` branch. Latest confirmed: install, tests, typecheck and build pass; end-to-end 23 of 24 steps passed, the one failure was a test-script bug that is now fixed (re-run pending).
- End-to-end covers: register a new free-preview family, add a child, build/preview/save/duplicate a lesson, library, assign, child signs in on a phone-size screen and picks a pet, sees real lesson content, answers saved across refresh, server-marked quiz, server refuses hand-in before quiz is passed, hand in, parent reviews with answer key, XP awarded once, evidence page, snapshot unchanged after library edit, another family cannot read or change anything, legacy 19,202 lessons hidden and not assignable, plan cannot be self-upgraded, expired preview blocks create/assign but keeps data, phone layouts.
- Quiz answers are marked on the server; child lesson responses carry no answer keys or parent notes. Children's work in progress is saved on the server.
- Migration 0050 applies cleanly in CI to a fresh local database. It has **not** been approved or applied to production.
- Responsive parent layout (menu drawer on phones), usable child header on phones, parent "get started" checklist and an example lesson, child dashboard shows XP, completed and waiting quests.

## Private staging

`wrangler.staging.jsonc` and `.github/workflows/deploy-staging.yml` (manual). Separate Worker `side-quest-staging` and separate D1 `sidequest-staging`; never production. The staging API is gated by a cookie obtained from `/api/staging-access?key=<STAGING_KEY>`.

Owner steps: (1) Cloudflare dashboard > My Profile > API Tokens > Create Token from the "Edit Cloudflare Workers" template, add Account > D1 > Edit. (2) Copy the Account ID (Workers & Pages overview). (3) GitHub repo > Settings > Environments > New environment `staging` > secrets CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, STAGING_JWT_SECRET (long random text), STAGING_KEY (long random text). (4) Actions > "Deploy staging (private)" > Run workflow on `dev/sidequest-execution`. (5) Open `https://side-quest-staging.<your-workers-subdomain>.workers.dev/api/staging-access?key=<STAGING_KEY>` once, then use the site.

## Known limitations and blockers

- No Cloudflare credentials in the build environment: staging deploy needs the owner's secrets (above).
- Uploads: the R2 code in `worker/src/family.ts` (family-scoped, type allow-list, 50 MB cap, nosniff, sandbox CSP) is sound, but no bucket is bound. Not enabled; the app says photo upload is unavailable. Enabling needs `wrangler r2 bucket create` and a binding (owner approval).
- Billing is not live. Remaining NSW-specific tools (curriculum links, learning plans, legal copy) are truthful about being NSW-based but need owner/legal review.
- Pet-care XP and lesson XP share one counter; first-time children must choose a pet before anything else.

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

## Lesson depth, on-screen delivery and video resources (14 Oct 2026)

**Teaching depth.** The generator's size targets were raised (teaching minimum ≈ 9 words per lesson minute, 2–4 worked examples, 5–8 guided items, activities of 4–5 on-screen tasks) and the quality gate now rejects drafts whose activities are all off-screen, that have too few tasks, that say "on paper/worksheet", or whose estimated working time is under 70% of the requested minutes. Model limits are unchanged (one draft call, one repair call at most). Whether `llama-3.3-70b` meets the new bar consistently has not been observed from the build environment; the owner assesses real output.

**Child player.** `ParentLessonPlayer` is a step-by-step player (progress bar, jump menu, resume at last step). Practice items (number, short, long, choice, blank, order, match) are checked by `POST /api/assignments/:id/practice-check` on the server; the child never receives answers, and practice feedback is ungraded. Hands-on activities are optional alternatives with on-screen recording prompts. Autosave stores answers, practice feedback, video notes and the current step in the existing draft (60 KB limit).

**Videos.** `worker/src/resources.ts` calls the YouTube Data API v3 (`search.list` + `videos.list`) from the Worker only, never from the AI. Results must be public, embeddable, not age-restricted/live/region-blocked for AU; they are ranked by title overlap, a preferred-channel list and a 2–10 minute length. Searches are cached in D1 (`resource_cache`, migration 0053, 14 days) and limited (8 per family per day, 70 per day overall) via `ai_usage` kind `yt_search`. The parent approves each video in the review page; approved videos are stored in the lesson's existing `resources` field and are snapshotted into assignments. Configuration: Worker secret `YOUTUBE_API_KEY`.

## Lesson quality repair: staged generation (14 Oct 2026)

**Root cause (from the code and Cloudflare's published model facts, not from observed output).** One request asked `llama-3.3-70b-instruct-fp8-fast` (24,000-token context) for a ~25-field lesson while carrying a 6,000-token example lesson as a previous answer (≈10k input tokens, 8k output cap). The model spreads its effort across every field, anchors to the example's size, and a reply that ran out of tokens was silently "salvaged" by cutting it back to the last complete item. Storage and rendering do not shorten content (caps are far above real sizes).

**Change.** `aiDraft.ts` now generates in three requests: (1) design: exact concept, order of ideas, the worked problems, likely mistakes; (2) teaching: introduction, one developed explanation per idea, complete worked examples, wrap-up; (3) practice: guided and independent practice, written questions, quiz, answers, parent guide, written to match the text just produced. A cut-off reply is retried once and, if still cut off, kept but flagged to the parent. The quality gate also rejects "explain X to your child" style stand-ins. At most one targeted repair follows. The response reports calls, tokens and an estimated cost (shown on the review page).

**Independent by default (14 Oct 2026).** Delivery used to default to parent-guided below Year 7, so younger children's lessons were written for the parent to teach. The default is now independent for every year level (the child works alone on screen; the lesson is the teacher, in age-suited language). Parent-guided happens only when the parent asks for it in the request or in the child's learning preferences. The quality gate rejects independent lessons that send the student to a parent, grown-up or teacher.

**Grown-up only as a last resort (14 Oct 2026).** The child's help ladder is: built-in hints, going back to the explanation and worked examples, instant feedback with the model answer, the "I'm stuck" AI helper (when switched on), and only then "I've tried everything and I'm really stuck. I need a grown-up", which saves the work and hands it in flagged "needs help" so the parent can reply. Text can be read aloud with the browser's built-in voice (no cost, nothing sent anywhere). The generator is told the child works alone, to show a worked example of each question type before asking it, and to match reading level to the year.

**Curriculum outcomes (14 Oct 2026).** "Make a lesson" has a tick box (on by default) to link the lesson to the outcomes it develops. After the lesson is written, one tiny model call (about 120 output tokens, a fraction of a cent) picks from the real outcome list for that year and subject; anything not in the list is discarded. The review page has a Curriculum outcomes panel (Match to outcomes, Link, Remove) for any lesson, using the AI pick on paid plans and a free wording match otherwise. Linked codes are stored in the lesson (`outcome_codes`, plus readable `curriculum_refs`), feed the existing "Learning outcomes" section when you review work, and are never sent to the child. Today the only outcome list is the NSW syllabus; the panel says so. Other states and territories need their outcome lists loaded before this is genuinely national, and no compliance claim is made.

## Comprehensive teaching (per-section generation)

Teaching was thin because a whole 60-minute lesson's explanations competed for one reply. Generation is now: design → frame (introduction, readings, wrap-up) → one request per teaching section (250–380 words: prior knowledge, plain idea, worked detail, why it works, common slip) and one per worked example (5–9 reasoned steps, with a check), run four at a time → practice and assessment (two requests). The parent answer key is built in code from the items' own answers. About 13 requests for a 60-minute lesson (estimated ~4–5 US cents on the default model; the exact figure is shown on the review page). The quality floor is now 14 words of teaching per minute (sections plus worked-example steps). A section or example that fails twice fails the whole draft and uses no allowance. Quality of real output is for the owner to judge; if the default model is the limit, `AI_MODEL` can be changed only with owner approval.

## Outcome progress (shared by the Outcome & Mastery Tracker and Auto-Quest)

Migration 0057 adds `outcome_progress` (one row per child and outcome) and `outcome_progress_events` (every change). Code: `worker/src/outcomeProgress.ts`; API `GET /api/students/:sid/outcome-progress`, `PUT /api/students/:sid/outcome-progress/:code`, `GET …/:code/history`; panel on the child page.

- Levels: Not Started, Introduced, Developing, Demonstrated, Achieved.
- A parent can set any level, up or down; that level is marked "set by you" (parent confirmed).
- Automatic updates come only from a parent's review of submitted work, and only ever raise a level, capped at Demonstrated: outcome ticked on approved work -> Demonstrated; marked "not yet" or sent back for practice -> Developing; targeted by the lesson but not marked -> Introduced. Completing or passing a lesson is never treated as mastery, and a parent-confirmed level is never lowered.
- Reviews made before tracking existed are replayed once the first time a child's progress is opened.
- Only outcomes on a verified list are stored (today the NSW syllabus). Other states and territories see that their list is not loaded yet; nothing is invented.
- **Migration 0057 must be applied (after backup) before deploying.**

