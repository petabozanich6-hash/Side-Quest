# Gold v2 session progress — 13 October 2026

Resume from `feature/gold-v2-resumable-pipeline`. Do not merge, deploy, or apply remote D1.

## Audit snapshot

| Area | What exists | Status |
|---|---|---|
| App | React 18 frontend + Cloudflare Worker (Hono) + D1 | Production on Cloudflare; do not change hosting |
| Lesson runtime | `ChildLesson.jsx`, `QuestTeach`, `QuestVisual`, `QuestQuiz`; localStorage resume | Reuse; do not replace |
| Gold benchmark | `s2-eng-y3-w01-l1` / migration 0044 | Protected; not counted as pipeline completion |
| Pipeline | `scripts/gold-pipeline/pipeline.py` + validators | Functioning; drafts stay outside `worker/migrations/` |
| Python lesson library | `backend/lesson_library_*.py` | Not the D1 production path; do not substitute |
| Markdown lesson-bank | `lesson-bank/` | No approved Gold v2 adapter |
| Year 7 English Week 1 | Migration 0047; four taught lessons | In D1 schema already; **outcome codes still empty / unverified** |
| Latin / Computer Technology | Present as Stage 4 program rows | Do **not** assume standard mandatory NESA outcome sets; verify frameworks before mapping |

Inventory: **19,202** D1 rows. Priority remains Stage 2 (1,282) then Stage 4 (3,620). Owner binding: Written Core first, 12-lesson batches, no Phase 2 media program.

NESA English K–10 (2022) Stage 2 codes confirmed from [official outcomes](https://curriculum.nsw.edu.au/learning-areas/english/english-k-10-2022/outcomes): `EN2-OLC-01`, `EN2-RECOM-01`, `EN2-CWT-01` (imaginative), `EN2-CWT-02` (informative), `EN2-CWT-03` (persuasive), `EN2-SPELL-01`, `EN2-HANDW-01`. Proposed lesson codes are **pending** human NESA verification (`verification_status: pending`).

## This session completed (Written Core, not Gold v2 Full Experience)

Twelve Year 3 English lessons, `s2-eng-y3-w01-l2` through `s2-eng-y3-w04-l1`, now have authored D1 bundles and **automated validation passed**. Human gates remain closed.

| Seed | Title (from inventory) | Proposed code | Automated | Educational / NESA / browser / owner |
|---|---|---|---|---|
| s2-eng-y3-w01-l2 | Build a clear sentence | EN2-CWT-01 | pass | pending |
| s2-eng-y3-w01-l3 | Spell with sounds and syllables | EN2-SPELL-01 | pass | pending |
| s2-eng-y3-w01-l4 | Tell a story and prepare readable notes | EN2-OLC-01 | pass | pending |
| s2-eng-y3-w02-l1 | Story elements: character, setting and plot | EN2-RECOM-01 | pass | pending |
| s2-eng-y3-w02-l2 | Plan a story using a story mountain | EN2-CWT-01 | pass | pending |
| s2-eng-y3-w02-l3 | Nouns, verbs and adjectives | EN2-CWT-01 | pass | pending |
| s2-eng-y3-w02-l4 | Retell a story aloud | EN2-OLC-01 | pass | pending |
| s2-eng-y3-w03-l1 | Predictions and questions | EN2-RECOM-01 | pass | pending |
| s2-eng-y3-w03-l2 | Orientation and complication | EN2-CWT-01 | pass | pending |
| s2-eng-y3-w03-l3 | Tense and adverbs | EN2-CWT-01 | pass | pending |
| s2-eng-y3-w03-l4 | Readers theatre | EN2-OLC-01 | pass | pending |
| s2-eng-y3-w04-l1 | Infer unstated meaning | EN2-RECOM-01 | pass | pending |

Also still awaiting review: pilot `s2-mat-y3-w02-l1`.

**Not Gold Standard.** Automated checks are necessary, not sufficient. Do not apply draft SQL to remote D1.

Year 7 earliest sequence: keep using the existing Week 1 D1 lessons (0047). Do not duplicate them. Next pipeline Y7 work should add verified `EN4-*` mapping after official Stage 4 wording is confirmed; current repository notes still mark URB/URC wording as unconfirmed.

## How to resume

```sh
python3 scripts/gold-pipeline/pipeline.py status
python3 scripts/gold-pipeline/build-written-english-batch02.py   # after upgrading it like batch 01
python3 scripts/gold-pipeline/pipeline.py run --limit 5 --seed <keys>
```

## Next development priorities

1. Human educational review of the 12 Year 3 English bundles (answer keys, age fit, parent/child split).
2. Official NESA content-point mapping; keep codes pending until then.
3. Browser/role-separation check of one rendered lesson (`ChildLesson`).
4. Upgrade batch 02/03 builders (weeks 4–11) so they use topic-specific diagrams and non-template quizzes, then run the next 12-lesson Written Core batch.
5. First Year 3 Mathematics week after English batch 02, using the existing maths pilot as schema only.
6. Year 7 English: attach verified EN4 codes to existing Week 1, then pipeline Week 2 Written Core.

## Known issues

- Validator still requires 1–2 existing Pip/Juno `CartoonEpisode` payloads for Gold-shaped JSON. Written Core uses that existing schema; Phase 2 animation/video is still deferred.
- Batch 02/03 builders remain template-heavy; do not run them into the inbox until upgraded.
- Markdown drafts in `lesson-pipeline/drafts/batch-001` do not count.
- Draft SQL lives under `lesson-pipeline/artifacts/` only.
