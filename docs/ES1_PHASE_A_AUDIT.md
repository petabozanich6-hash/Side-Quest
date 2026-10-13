# Early Stage 1 Phase A audit

Date: 13 October 2026. Scope: audit only. No lesson was authored, no seed was claimed, and no pipeline checkpoint was modified.

Branch: `cursor/es1-phase-a-audit-6485`, cut from `feature/gold-v2-resumable-pipeline` at `ce035417`. The shared pipeline branch, `lesson-pipeline/checkpoint.json`, `completion-manifest.json`, and `docs/GOLD_V2_SESSION_PROGRESS.md` were left unchanged.

## Stop line for authoring

Phase B is not approved by this audit. Two separate holds apply:

1. The binding owner directive of 12 October 2026 finishes Stage 2 and Stage 4 written content before any other stage. Stage 4 still has 448 of 3,620 lessons in the pipeline checkpoint. Early Stage 1 is priority 2 ("Later") in `docs/LESSON_REBUILD_MASTER.md`.
2. A legal Kindergarten lesson cannot pass the current Gold v2 runner. `validateLesson` rejects `year_level: "Kindergarten"`, and the pipeline bundle checks require a Years 3–6 quiz shape that the early-years band forbids.

No other worker has claimed the 640 Early Stage 1 seeds. They are free in the inventory and absent from the checkpoint. They are still reserved by the stage-priority order until the owner explicitly authorises a Kindergarten exception.

## 1. Lessons required

The repository inventory contains **640** Early Stage 1 lesson rows. Every row is a coming-soon placeholder. Counts were taken from `docs/inventory/ES1.csv` and confirmed against `lesson-pipeline/inventory.jsonl` (19,202 total rows; 640 with `stage: "ES1"`).

| Subject | Seeded lessons | Weekly cadence in the seed migrations | Hour plan in `docs/lesson-plans/early-stage-1.md` |
|---|---:|---|---:|
| English | 160 | 4 lessons × 40 weeks (`0029_es1_english_program.sql`) | 200 hours |
| Mathematics | 160 | 4 lessons × 40 weeks (`0030`) | 120 hours |
| Science and Technology | 80 | 2 lessons × 40 weeks (`0031`) | 60 hours |
| HSIE | 80 | 2 lessons × 40 weeks (`0032`) | 60 hours |
| PDHPE | 80 | 2 lessons × 40 weeks (`0033`) | 60 hours |
| Creative Arts | 80 | 2 lessons × 40 weeks (`0034`) | 60 hours |
| **Total** | **640** | | **560 hours** |

The seeded catalogue is the catalogue to keep. Lesson ids, seed keys, titles and week order already exist and must stay stable. The hour plan and the seed migrations do not describe the same volume. English is 40 lessons short of the 200-hour plan. Mathematics is 40 lessons above the 120-hour plan. Each of the other four subjects is 20 lessons above its 60-hour plan. That reconciliation is an owner decision. It is not a reason to invent a second set of identifiers.

Placeholder rows live in migrations 0029–0034. Migration 0035 only renames the stage label from `ES1` to `Early Stage 1` so the parent Lessons page does not file them under Stage 1. Outcome arrays in those seeds are empty. Each row is `coming_soon: true` with a one-sentence learning intention. Later migrations do not replace any `es1-*` row with taught content.

## 2. Authored and validated

| Gate | Early Stage 1 |
|---|---:|
| Placeholder rows | 640 |
| Authored bundles (`lesson-pipeline/authored/es1-*.json`) | 0 |
| Pipeline checkpoint records | 0 |
| Automated validation passed | 0 |
| Educationally reviewed | 0 |
| NESA verified | 0 |
| Browser verified | 0 |
| Fully approved | 0 |

`python3 scripts/gold-pipeline/pipeline.py status` on 13 October 2026 reported 19,202 inventory rows, 17,474 queued, 1,727 awaiting review, and human gates at zero. Those 1,727 records are Stage 2 (1,279) and Stage 4 (448). The Stage 2 checkpoint omits the protected benchmark `s2-eng-y3-w01-l1` and two older seeds, `s2-english-persuasive-writing-01` and `s2-maths-place-value-01`.

## 3. Assigned or reserved

There is no coordinator process, assignment-queue file, or Early Stage 1 worker claim in this repository. Coordination is the priority order plus notes in `docs/GOLD_V2_SESSION_PROGRESS.md` and `lesson-pipeline/completion-manifest.json`.

| Check | Result |
|---|---|
| ES1 rows in the pipeline checkpoint | 0 |
| ES1 mentions in checkpoint history (6,469 events) | 0 |
| Protected ES1 lessons | 0 (the only protected lesson is `s2-eng-y3-w01-l1`) |
| Git worktrees | One: `/workspace` on this audit branch |
| Recorded agent partition on the shared branch | `stage2_year4_exclusive` (Year 4 written core already auto-validated; that note was not edited) |
| Parked other-agent resume seed | `s4-hsie-y7-w25-l1` (Year 7 HSIE, 48/80) |
| Running cloud agents seen from this environment | This Early Stage 1 audit, and a separate Stage 1 audit. No Early Stage 1 authoring agent. |

Family assignment is a parent action in the app. The seed rows have `family_id` NULL. Production assignment counts were not queried. Remote D1 was not contacted.

## 4. Lesson format and rendering

Early Stage 1 uses the same D1/Worker JSON architecture as the rest of the 19,202-row catalogue. The Python lesson-library route is a separate system and is not the Kindergarten path.

A Gold v2 lesson, once authored, is a JSON object rendered by `frontend/src/pages/child/ChildLesson.jsx` as a stepped quest:

1. Accept the quest (`child_mission`)
2. Teach steps (`QuestTeach`: explanation, optional SVG or cartoon, revealed example, three-option check)
3. Put it together
4. Optional spelling, sort, watch, word challenge, sentence builder, guided practice, planner
5. Independent task and hand-in
6. Quiz

`scripts/validate-lessons.mjs` already has an early-years band for `year <= 2`:

- 3 teach steps
- 5 multiple-choice questions, 3 options each
- pass mark 0.8
- 3–5 success criteria beginning "I can"
- exactly 3 unique hints for every generated stage
- 1–2 cartoon episodes when media checks are on
- `review_status` of `unreviewed` or `needs_expert_review`
- parent paragraphs that each start with `Parent:`

`year_level` must currently contain a digit. The stored Kindergarten value is the word `Kindergarten`, so `validateLesson` fails immediately with `year_level required`. A probe with `year_level: "0"` passed that check and then failed on empty stage hints, which shows the early-years band itself is reachable only if the year text contains a digit. Changing `year_level` would also fail the pipeline identity check, which forbids placement edits.

The pipeline wrapper `scripts/gold-pipeline/validate.mjs` then adds checks that are not age-banded: at least 8 multiple-choice items, at least 2 written items, explanations of at least 300 characters, and four-option questions. Those contradict the early-years rule of exactly 5 three-option scored questions and no written items. A Kindergarten bundle cannot satisfy both files.

Parent-facing fields that already render on `frontend/src/pages/LessonDetail.jsx`: `parent_notes`, `evidence_instructions`, `offline_alternative`, `extension`, materials and duration inside the lesson JSON, and a printable resource when present. The child quest page does not render `parent_notes`. Coming-soon cards on the parent Lessons page show the title, week, role and learning intention, and they cannot be assigned.

## 5. Image and video capabilities

What the app can render today:

- Original inline SVG in `QuestVisual`, with alt text and a caption. Gold validation allows a fixed set of SVG tags, a viewBox, and a 6 KB limit. `script`, `image`, `use`, `animate` and external URLs are rejected.
- One or two `CartoonEpisode` sequences. Speakers are only Pip and Juno. Backgrounds are only `park`, `room` and `evening`. Timing must land between 20 and 60 seconds. The browser `speechSynthesis` voice speaks lines, with on-screen captions and a transcript. This is generated animation, not a video file.
- Spelling words can be spoken by `frontend/src/lib/speak.js`, preferring an Australian English voice when the device has one.
- The child page can iframe a `resources[]` item with `type: "video"` and `embed_url`. Gold validation rejects `embed_url`, `src` and `url`, and it rejects any `http` URL other than the SVG namespace. Lesson policy also forbids external embeds.

No Kindergarten video file, image file, or cartoon episode exists in the repository. No video URL was verified. Raster illustration generation is not wired into the lesson schema: a picture `src` would fail validation even though `QuestVisual` can display one.

Letter-formation or counting animations cannot be SVG animations inside a gold lesson, because `animate` is banned. The practical visual tools are static instructional SVGs plus a short spoken Pip/Juno scene.

## 6. Interactive experience the architecture supports

Supported now, and used by the child quest:

- Tap to choose (teach-step checks and quiz)
- Tap-to-flip cards (`interactive_activities` type `flip_cards`)
- Sorting by tapping a bucket (`sort_activity`: 3 buckets, 6–9 items)
- Sentence building with dropdowns (`suspense_builder`)
- A short written planner
- Spelling checks
- Immediate right/wrong feedback on those checks
- File upload of a photo, audio or video of off-screen work

Not present as components: drag-and-drop, picture matching, sequencing trays, interactive counting manipulatives, or audio playback of the teaching paragraphs. Quiz and teach-step text is read by the child or the parent. The cartoon is the only lesson sequence that speaks its script.

Those limits are enough for a parent-led Kindergarten lesson if the spoken track, the SVG, and the hands-on task do the teaching, and the on-screen checks stay to three large options. They are not enough for a drag-and-count or letter-tracing app. New components would be a separate product change and are out of Phase A.

## 7. Gaps that block a premium Kindergarten lesson

1. **Validator deadlock.** `Kindergarten` fails `validateLesson`. The pipeline's 8+2 quiz rule fails the early-years 5-question rule. Authoring into the current runner would either fail or force Year 3 assessment onto five-year-olds. Thresholds for Years 3–12 should stay as they are. The Kindergarten profile needs its own path that uses the early-years band already written in `validateLesson`.
2. **Reading load.** Pipeline bundle checks require 300-character explanations, and the child sees `explain` directly. Kindergarten teaching has to be spoken, pictured and played. Long on-screen paragraphs fight that.
3. **No lesson video or illustration assets.** The only in-app moving explanation is a 20–60 second Pip/Juno cartoon in three rooms. Experiment footage, letter-formation film and counting film do not exist and cannot be linked into a gold lesson.
4. **Outcome coverage is uneven.** English, Mathematics, Science and Technology, PDHPE and Creative Arts Early Stage 1 codes in `docs/lesson-plans/` match the codes fetched from the NESA outcomes pages on 13 October 2026 (English K–10 2022, Mathematics K–10 2022, and the 2024 K–6 syllabuses). That fetch is not a NESA verification gate. HSIE K–6 outcome codes were still marked "to capture" in the repo. The live HSIE K–6 (2024) outcomes page lists three Early Stage 1 outcomes: `HSE-ACH-01` (Aboriginal Peoples' connection with Country, Culture and Community), `HSE-GEO-01` (places people connect with, using geographical information), `HSE-HIS-01` (daily life and transport in the past, using stories, images and objects). The 80 HSIE titles include no transport lesson. Several early titles ("Who am I", rules, fairness, community helpers) do not name those three outcomes. Science, HSIE, PDHPE and Creative Arts 2024 syllabuses are for implementation from 2027.
5. **Hour plan versus seeds.** 560 planned hours versus 640 seeded lessons. See the table in section 1.
6. **Placeholder English plan note.** `docs/lesson-plans/early-stage-1.md` still says English focus areas are unsourced. `docs/lesson-plans/primary-subject-plans.md` and the outcomes file do contain them. The stage file is stale.
7. **Cultural content.** HSIE weeks 31–35 (First Nations peoples, Country, stories) need `needs_expert_review` under the existing expert-review rule. This audit does not supply that review.
8. **Stage 4 is unfinished.** Starting a 640-lesson Kindergarten factory on the shared pipeline would collide with the agents still walking Stage 4.

## 8. Safest isolated development approach

- Keep this audit branch free of lesson JSON, SQL and checkpoint edits.
- When the owner authorises Phase B, author the six master bundles on a new `cursor/…-6485` branch cut from the then-current pipeline branch. Do not commit those bundles onto `feature/gold-v2-resumable-pipeline` while other agents are writing Stage 4 checkpoints there.
- Do not run `pipeline.py run` against the shared checkpoint.
- Do not add a worker claim, partition or completion-manifest entry for Early Stage 1 until the owner assigns it.
- A Kindergarten validator profile is a prerequisite for those masters, and it belongs in its own reviewed change. It must leave Stage 2 and Stage 4 thresholds untouched.
- Draft SQL stays outside `worker/migrations`. No merge, no deploy, no remote D1.

## 9. Proposed six master lessons

These ids already exist. This audit does not claim them. Each can be taught as a first encounter with that idea. Week 1 is used where the title can carry a real Early Stage 1 outcome. Two later lessons replace week-1 titles that would make a weak benchmark.

| Subject | Existing seed | Title | Outcome codes to map (pending human NESA review) | Why this one |
|---|---|---|---|---|
| English | `es1-eng-k-w01-l1` | Sharing a book together | `ENE-OLC-01`, `ENE-UARL-01` | Parent reads; the child talks. No independent reading assumed. |
| Mathematics | `es1-mat-k-w01-l1` | Counting and comparing groups to 3 | `MAO-WM-01`, `MAE-RWN-01` | Concrete collections, one-to-one counting, a checkable idea. |
| Science and Technology | `es1-sci-k-w01-l1` | Our five senses | `STE-SCI-01`, `STE-PQU-01` | Observation and a question from what the child notices. |
| HSIE | `es1-hsie-k-w12-l1` | Toys then and now | `HSE-HIS-01` | Objects and stories about daily life in the past. Week 1 "Who am I" does not name this outcome. |
| Creative Arts | `es1-arts-k-w01-l1` | Drawing lines and shapes | `CAE-VIS-01` | Making with materials, which the outcome asks children to experiment with. |
| PDHPE | `es1-pdh-k-w21-l1` | Walking and running | `PHE-MSP-01` | Fundamental movement, off the screen. Week 1 "Naming feelings" remains the later wellbeing lesson (`PHE-IHW-01`). |

A second English lesson, `es1-eng-k-w05-l1` (Sound s, `ENE-PHOKW-01`), is the right phonics benchmark after the read-aloud master. It is not a seventh lesson in this set.

Each master, when authorised, would use the existing schema: parent preparation and "Parent:" notes, three short teach steps, a spoken Pip/Juno scene of 20–60 seconds with captions, instructional SVGs (counters, a book cover, a sense chart, old and new toys, line types, a movement sequence), three-option checks, a hands-on task with household materials, a five-question quiz at pass mark 0.8, evidence notes, an offline alternative and a stretch. Video scripts for anything the cartoon cannot show (letter formation, a real experiment, a map walk) would sit beside the lesson as production specifications, labelled proposed, with no URL.

## 10. Recommended next steps

1. Owner decides whether a six-lesson Kindergarten exception may start before Stage 4 written content is finished.
2. Owner decides whether the 640 seeds or the 560-hour plan is the volume target. Until then, keep the 640 ids.
3. Add a Kindergarten validator profile that accepts `year_level: "Kindergarten"` as the early-years band and does not apply the 8+2 quiz rule. Leave every Stage 2 and Stage 4 threshold as it is.
4. After that profile exists and the exception is approved, author the six seeds above on an isolated branch, run the pipeline only against those seeds, and render them in the browser.
5. Record HSIE `HSE-ACH-01`, `HSE-GEO-01` and `HSE-HIS-01` in the outcomes notes as pending human confirmation, and review the 80 HSIE titles against them before any HSIE batch. Flag weeks 31–35 for expert review.
6. Keep human educational review, NESA verification, browser verification and owner approval as separate gates. Automated passage would still leave all four at zero.

## Checks actually run

- `python3 scripts/gold-pipeline/pipeline.py status`
- Inventory and checkpoint counts via Python against `docs/inventory/ES1.csv`, `lesson-pipeline/inventory.jsonl` and `lesson-pipeline/checkpoint.json`
- Node probe of `validateLesson` with `year_level: "Kindergarten"` (fails: `year_level required`) and `year_level: "0"` (passes the year check, then fails on stage hints)
- Fetches of the six NESA K–6 / K–10 outcomes pages cited above
- `git worktree list` and a cloud-agent listing limited to this environment

Browser rendering of a Kindergarten lesson was not done. There is no authored Kindergarten lesson to open.
