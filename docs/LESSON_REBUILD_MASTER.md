# Every-stage lesson rebuild: master register

The parent has approved the deeper Year 3 gold lesson and authorised **every lesson across every stage** to be rebuilt to the same teaching quality. **Stage 2 and Stage 4 have first priority.** This supersedes the earlier Stage-3-first order. Approved Lesson Standard v2 remains unchanged.

## What the quality means

A beginner at the lesson's year level should learn from the lesson itself: explain the idea and its purpose, model the thinking, compare examples where useful, offer a small practice attempt with feedback, check understanding, then move through a complete model and supported practice to the independent task. A longer task list alone does not supply that teaching.

Adapt vocabulary, explanations, concepts, tasks and assessment to the age band. Do not copy Year 3 teaching unchanged into Kindergarten or senior subjects. Use the approved age-band step counts, quiz types and pass marks. Do not alter the approved standard without asking the parent.

Original internal text, episodes and small SVG diagrams remain required where they teach usefully. Include three specific hints for every generated stage, appropriate parent/evidence notes, a screen-free alternative and a stretch idea. No runtime AI, paid services, external embeds or copied teaching materials. Verify outcome codes or leave them empty; follow the expert-review rules for uncertain specialist and cultural content.

## Repository inventory

The inventory was reconstructed in local SQLite by applying the current repository's lesson-program migrations in their actual order. It is **not a live D1 count**. There are **19,202 unique lesson rows**, including two older Stage 2 seed lessons that remain in the all-lessons scope.

| Stage | Years | Repository rows | Priority | Inventory |
|---|---|---:|---|---|
| Early Stage 1 | Kindergarten | 640 | Later | [ES1](inventory/ES1.csv) |
| Stage 1 | 1–2 | 1,280 | Later | [S1](inventory/S1.csv) |
| Stage 2 | 3–4 | 1,282 | **First** | [S2](inventory/S2.csv) |
| Stage 3 | 5–6 | 1,280 | Later | [S3](inventory/S3.csv) |
| Stage 4 | 7–8 | 3,620 | **First** | [S4](inventory/S4.csv) |
| Stage 5 | 9–10 | 3,420 | Later | [S5](inventory/S5.csv) |
| Stage 6 | 11–12 | 7,680 | Later | [Year 11](inventory/S6-Y11.csv), [Year 12](inventory/S6-Y12.csv) |
| **Total** | K–12 | **19,202** | | [Summary](inventory/SUMMARY.csv) |

Use the row's current stage to prioritise, **not just the seed-key prefix**. Migration 0027 moved some elective rows to Stage 4 while preserving their older s5-prefixed keys. Keep those keys and row IDs stable.

The coming_soon flag is not a quality certificate. Earlier apparently finished content remains in scope unless the parent has approved it or it was authored to the new standard and explicitly tracked for review.

## Work already preserved

- Approved gold: `s2-eng-y3-w01-l1`, migration 0044, on main.
- Stage 3 Year 5 English Week 1: four new-standard lessons, migration 0045, merged in PR #98. They remain authored/unreviewed; no claim that database content has been applied or reviewed.
- First priority batch: Stage 2 Year 3 English Week 1 Lessons 2–4 are authored in migration 0046 and merged through PR #99. Remote database application is not verified. Together with the approved Lesson 1, the whole week is written.
- Stage 4 Year 7 English Week 1: four lessons are authored in migration 0047 and merged through PR #100. Remote application is not verified.
- Twelve rows now have new-standard authored content in repository sources: one approved gold, four preserved Stage 3 lessons, three Stage 2 lessons and four Stage 4 lessons. The remaining 19,190 rows remain queued. This does not mean twelve lessons have been deployed or reviewed.
- No gold lesson or Stage 3 batch is discarded by the priority change.

The stage-specific register and inventory remain available for reference. This master register controls the authoring priority from now on.

## Priority queue

Alternate subject-week batches between Stage 2 and Stage 4 so both receive work before lower-priority stages. Begin with the early years in each stage, then include the other year:

1. Stage 2, Year 3 English Week 1: Lessons 2–4 authored in this PR beside the approved Lesson 1.
2. Stage 4, Year 7 English Week 1: four lessons authored in this PR.
3. **Next: Stage 2, Year 4 English Week 1.**
4. Stage 4, Year 8 English Week 1.
5. Stage 2/4 Mathematics Week 1 in the same year alternation.
6. Continue through each priority stage's other subjects and electives, then later weeks. Read the actual subject plan before writing; not every subject has the same lesson count or sequence.

This is the default order, not a reduction of the all-stage scope. The parent may steer the order. No new scope approval is needed to continue the already-authorised rebuild.

## Branches, migrations and review

Each new PR targets **main directly** and covers one subject-week. Never commit to main or merge/deploy on the parent's behalf without their instruction. Check main and open PRs before allocating numbers. At this batch’s creation, main ends at 0046 and open PR #95 reserves 0043; this batch uses 0047. Recheck the next number before authoring the Year 4 batch.

Aim for up to 50 lessons per migration, fewer when statements are large. Use one UPDATE per lesson or split lessons over about 90 KB into two UPDATEs, text first and media second; never cut content. Each statement must be at most 100,000 bytes. Supply complete arrays and delete obsolete fields with JSON merge-patch nulls. Preserve IDs, keys, ownership and assignments. A content patch and a frontend deployment are distinct from applying remote D1 content.

Every PR must include readable lesson reviews, actual validation results and limitations, a brief Usage check (estimated rows written and largest statement size), and beginner backup/apply/site-check/undo instructions. Check each SQL statement's budget rather than the entire multi-lesson file. Follow [the paid-plan usage policy](LESSON_USAGE_POLICY.md). Review capacity sets the pace, with no daily lesson quota.

## Reproducing the inventory

From the repository root:

```sh
python3 scripts/export-lesson-inventory.py
```

This reconstructs only a local in-memory database and writes inventory CSVs. It never contacts Cloudflare or private user data. It reflects repository sources, not which migrations have been applied remotely. Regenerate after new authored migrations and review the status labels before committing the register.

The local reconstruction completed without SQL errors. Stage and unique-key counts were checked. No deployment, remote D1 mutation or live-site verification was performed by this inventory work.

