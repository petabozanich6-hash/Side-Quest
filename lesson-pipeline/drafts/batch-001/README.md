# Gold Standard v2 — authored batch 001

**Three distinct child-facing lesson manuscripts, NOT pipeline-validated lesson bundles.**

Created 12 October 2026. Do not count these as queue completions or approved lessons.

| Draft | Proposed Stage 2 outcome | Content | Remaining gates |
|---|---|---|---|
| [01: Addition bridging hundreds](01-addition-bridging-hundreds.md) | MA2-AR-01, MAO-WM-01 | Four teaching sections, 2 topic diagrams, differentiated practice, eight MC checks, two written checks, stage hints, episode, separate parent answer key | Confirm actual queue seed and scope; transform to D1 JSON bundle; validate; educational, NESA and browser review |
| [02: Subtraction by counting up](02-subtraction-across-hundreds.md) | MA2-AR-01, MAO-WM-01 | Four teaching sections, 2 topic diagrams, model, guided and independent practice, eight MC checks, two written checks, hints, episode and parent key | Same |
| [03: Equal groups and arrays](03-equal-groups-arrays.md) | MA2-MR-01, MAO-WM-01 | Four teaching sections, 2 topic diagrams, equal/unequal group contrasts, rotated arrays, practice, eight MC checks, two written checks, hints, episode and parent key | Same |

## Necessary integration work
1. Match each manuscript to an existing queue record based on **the lesson's actual curriculum role and sequence**. Do not invent or guess a seed key or replace a lesson about a different topic.
2. Author the proper `lesson-pipeline/authored/<seed_key>.json` bundle from each manuscript; inspect the approved full D1 model. Preserve placement and metadata.
3. Render visuals and episode using supported runtime components; verify accessibility, mobile layout and natural voice playback rather than treating Markdown code blocks as rendered lesson SVGs.
4. Check content correctness and verify specific NESA content points, not just outcome labels. No authoring script may automatically create educational or NESA attestations.
5. Run strict validator, SQL idempotency check, complete API and browser regression suite. Parent-only material must not reach child API payloads.
6. Commit validated checkpoint evidence and maintain review gates in draft status until human sign-off.

**Repository queue status remains 19,202 records, with one previous automatically validated pilot and zero new fully approved lessons.** These three manuscripts are upstream authoring assets; they do not increment the pipeline's drafted counter until converted and processed.
