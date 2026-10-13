# Teaching episode authoring (Phase 2 pilot)

This documents the **reusable teaching-episode architecture** introduced for the isolated Phase 2 pilot on `feature/gold-v2-episode-pilot-rounding`. It does **not** authorise mass episode production or Phase 1 curriculum changes.

## What this is

A data-driven, in-browser episode player (React + SVG + CSS / Web Animations via CSS keyframes + optional `speechSynthesis`). No paid TTS, no external video APIs, no IP imitation.

Legacy dialogue cartoons (`CartoonEpisode`, `scenes[].lines[]`) remain supported. Teaching episodes use `format: "teaching"` and `scenes[].beats[]`.

## Integration points

| Surface | Behaviour |
|---|---|
| `QuestVisual` | Routes `episode.format === "teaching"` → `EpisodePlayer`; otherwise `CartoonEpisode` |
| `ChildLesson` | If `lesson.teaching_episode` or frontend registry match on `seed_key`, inserts a **Watch the teaching episode** stage after Accept |
| `/dev/episode/:seedKey` | Public local preview (no auth) for QA |
| Print | Transcript text only (same pattern as cartoon episodes) |

Written lesson stages are unchanged. The episode is additive.

## Data format (v1)

```json
{
  "format": "teaching",
  "version": 1,
  "id": "unique-episode-id",
  "seed_key": "s2-mat-y3-w02-l1",
  "stage": "S2",
  "title": "...",
  "hook": "Shown before play. Mention that sound defaults off.",
  "learning_intention": "...",
  "transcript": "Full caption transcript for accessibility / print.",
  "scenes": [
    {
      "id": "introduce",
      "role": "introduce",
      "title": "What rounding means",
      "bg": "room",
      "beats": [
        { "type": "narrate", "who": "pip", "text": "..." },
        {
          "type": "diagram",
          "who": "juno",
          "text": "...",
          "diagram": {
            "type": "number_line",
            "low": 220,
            "high": 230,
            "value": 224,
            "midpoint": 225,
            "showDistances": true,
            "highlight": "low",
            "label": "224 rounds to 220",
            "srDescription": "Accessible description"
          }
        },
        {
          "type": "interact",
          "prompt": "Question?",
          "choices": ["A", "B"],
          "correct_index": 1,
          "feedback": { "correct": "...", "incorrect": "..." }
        },
        { "type": "pause", "who": "juno", "text": "Press Play when ready." },
        { "type": "conclude", "who": "pip", "text": "Learning intention…" }
      ]
    }
  ]
}
```

### Beat types

- `narrate` — character line (optional TTS + captions)
- `diagram` — instructional visual (pilot: `number_line` only)
- `interact` — learner choice; playback waits for answer + Continue
- `pause` — learner-controlled pause
- `conclude` — closing / intention beat

### Scene roles (educational sequence)

Prefer: `introduce` → `why_how` → `worked_example` → `prediction` → `misconception` → `participation` → `independent_challenge` → `conclusion`.

### Stage presentation

`stagePresentation.js` adjusts bounce / chrome for `S2` / `S3` / `S4` without changing the interaction model. Stage 3/4 should not look babyish.

## Accessibility requirements

- Sound **defaults off**; optional browser `speechSynthesis` only
- Captions on by default; transcript `<details>` always available
- Play / pause / back / next / restart; no forced autoplay audio
- `prefers-reduced-motion` disables decorative motion
- Keyboard focusable controls and choices; status regions for captions/feedback
- Diagrams need `srDescription` / aria labels

## Authoring checklist

1. Preserve lesson `seed_key` and written curriculum — episode teaches the same idea with **different** independent challenge inputs where possible.
2. Verify every distance and midpoint mathematically.
3. Include at least one realistic misconception + corrective feedback.
4. Include ≥2 interactive beats with distinct correct/incorrect feedback.
5. Register JSON under `frontend/src/episodes/` and add to `registry.js`, **or** embed as `lesson.teaching_episode` once D1 content is ready.
6. Run `node scripts/episode/validate-teaching-episode.mjs` and the `.test.mjs`.
7. Browser-check `/dev/episode/<seed_key>` (mobile width, keyboard, reduced motion, captions).

## Validation

```sh
node scripts/episode/validate-teaching-episode.mjs
node scripts/episode/validate-teaching-episode.test.mjs
```

`scripts/validate-lessons.mjs` accepts teaching episodes when embedded in lesson JSON (`format: "teaching"`). Legacy cartoon timing rules still apply to non-teaching episodes.

## Pilot scope and honesty

- **In scope:** one excellent Year 3 rounding episode (`s2-mat-y3-w02-l1`) + reusable player.
- **Out of scope:** mass production, paid voices, video generation, replacing the written Gold v2 pipeline.
- **Reusable:** player components, schema, registry, stage presentation hooks, validators.
- **Pilot-specific:** rounding number-line diagrams and the `s2-mat-y3-w02-l1.json` beats.
- **Scaling cost:** each episode still needs human pedagogical design; the player only removes animation plumbing. Budget author time per lesson, not only engineering time.

## Preview

```sh
cd frontend && npm start
# open http://localhost:3000/dev/episode/s2-mat-y3-w02-l1
```

In a real child lesson with `seed_key === s2-mat-y3-w02-l1`, the episode stage appears after Accept automatically via the registry.
