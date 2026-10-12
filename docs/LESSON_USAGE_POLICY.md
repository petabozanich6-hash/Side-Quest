# Paid-plan lesson usage policy

The owner uses Cloudflare Workers Paid and accepts normal usage costs. This correction supersedes cost restrictions in older briefs and reviews; all other Approved Lesson Standard v2 decisions remain in force.

- Build complete, independently teachable lessons. Never reduce teaching, quizzes, SVGs, episodes, interactive activities or useful printables to fit free allowances. There is no daily lesson quota, SVG byte budget or cost-based episode-length cap.
- Aim for up to 50 lessons per migration, fewer when statements are large. Review capacity sets the pace. Larger PRs can combine multiple weeks; there is no approval gate after each week. Stage 2 and Stage 4 remain first priority in the existing order.
- Every PR has a brief **Usage check** containing only estimated rows written and the largest SQL statement size. Estimates count lesson UPDATEs; actual D1 index activity can affect reported writes.
- A SQL statement must be at most 100,000 bytes. A lesson over about 90 KB is split into two UPDATEs, text first and media second, rather than shortened. Arrays are supplied complete in the second patch where media is nested inside teaching steps. Validation reconstructs the full merged lesson, reports lessons over 90 KB, and checks every statement separately.
- A row must be at most 2 MB, one database at most 10 GB, and a query must complete within 30 seconds. Static content validation cannot establish live database capacity or execution time; inspect these before applying live changes. Preserve the indexed unique seed lookup and lesson identities.
- No runtime AI or external video embeds. Original SVGs, in-site episodes, printables and rule-based stage hints remain internal.
- A new paid service or feature requires a proposal naming its approximate cost and benefit, followed by the owner's approval before use. No R2, KV, extra database or other new service is authorised by this policy.

Official references: [D1 technical limits](https://developers.cloudflare.com/d1/platform/limits/) and [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/).

## Backup and undo

Before every live change:

```sh
npx wrangler d1 export sidequest-db1 --remote --output backup.sql
```

Keep the export private and save a pre-change Time Travel bookmark. On the Paid plan, D1 Time Travel provides **30 days** of point-in-time recovery. Restoring a bookmark restores the whole database, including unrelated intervening changes. A code revert does not revert lesson rows. Do not import a full export blindly over a populated database.

## Gold lesson audit

No teaching steps, quiz questions, episodes, images or activities were removed from the gold lesson to fit free allowances. It retains four teaching steps, ten quiz questions, two original episodes, three explanatory SVGs, guided practice and its optional reading sheet. The former validator enforced a 6 KB SVG cap, a 60-second episode ceiling and a 90 KB JSON rejection; those restrictions have been removed. Their existence is not evidence that an authored feature was cut. The approved gold content is preserved.
