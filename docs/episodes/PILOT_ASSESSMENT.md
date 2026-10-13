# Phase 2 episode pilot — honest assessment

Branch: `feature/gold-v2-episode-pilot-rounding`  
Worktree: `/Users/petab/Side-Quest-episode-pilot` (isolated from curriculum pipeline and assessment-hardening worktrees)  
Pilot lesson: `s2-mat-y3-w02-l1` (Year 3 rounding)

## What works

- Reusable scene/beat architecture (`EpisodePlayer` + supporting components)
- Character-led teaching with Pip/Juno (existing cast, no third-party IP)
- Animated instructional number line with distances / midpoint highlight
- Worked example → prediction → misconception → participation → midpoint tie → new challenge → conclusion
- Interactive pauses with correct/incorrect feedback
- Accessibility baseline: captions, transcript, mute-by-default TTS, pause/replay, reduced-motion, keyboardable controls
- Real lesson integration: `ChildLesson` episode stage via seed registry; `QuestVisual` teaching-format routing
- Local preview at `/dev/episode/s2-mat-y3-w02-l1`
- Automated math/schema tests for the pilot JSON

## Unfinished / follow-ups

- No D1 migration shipped (by design — draft PR only; registry powers the pilot without production SQL)
- `stage_hints.episode` not authored (PetCompanion simply omits hints for that stage)
- Only `number_line` diagram type exists; other subjects need new diagram components
- Browser speech voice quality varies by OS; not a product-grade narrator
- No visual regression suite yet; browser QA is manual via preview route
- Teaching episode not yet dual-published into authored Phase 1 JSON (avoided to protect pipeline agents)

## Reusable vs pilot-specific

| Reusable | Pilot-specific |
|---|---|
| `frontend/src/components/episode/*` | `frontend/src/episodes/s2-mat-y3-w02-l1.json` |
| Registry + QuestVisual routing | Rounding distances / misconception copy |
| Stage presentation hooks | Exact scene beat script |
| Teaching-episode validators | Seed-key math assertions in the test |
| Authoring doc | — |

## Scaling cost

Expect **hours of pedagogical design per episode**, not minutes of JSON cloning. Engineering amortises the player; content quality does not. Recommend small subject batches after Gold Written Core lands, not parallel mass generation.

## Dependencies

- React 18 (existing)
- Browser `speechSynthesis` (optional)
- No new npm packages
- No paid APIs

## Safeguards observed

- Separate worktree/branch from `feature/gold-v2-resumable-pipeline` and assessment-quality worktree
- No merge to main, no deploy, no production D1
- Phase 1 queue/checkpoints untouched
