# Side-Quest — AI latency baseline (17 October 2026)

## Why
Owner HQ already estimates Workers AI inference costs using metered token data.
This addition measures **time spent in each model call**, so we can assess
whether the lesson-generation bottleneck is model latency, number of calls or
the serial stages of generation. It does not change the configured model,
lesson quality controls or the parent-review process.

## What is stored
An additional nullable `duration_ms` per Workers AI call in the existing
`ai_inference_costs` table. Owner HQ receives 30-day aggregate metrics by
model: requests, failures, timed requests, average inference latency and
estimated gross USD where pricing is known.

No lesson text, prompts, student details, filenames, personal identifiers or
model responses are stored.

## Safe release
1. Run the worker tests, TypeScript typecheck, full CI and lesson-builder tests.
2. Back up production D1 and apply `0070_ai_inference_latency.sql` using the
   project's approved production migration procedure.
3. Until migration 0070 is applied, the Worker deliberately falls back to
   the old cost-ledger INSERT, and owner latency metrics say unavailable.
   **A merge does not itself apply migrations.**
4. Test a synthetic lesson and check Owner HQ API aggregate AI cost data.
5. Compare the observed mean call time with existing
   `generation.elapsed_ms` and `stage_timings_ms`, which time the
   complete lesson pipeline. Do not confuse one AI call with one lesson.
6. Use these baseline measurements to justify any future model switch,
   prompt compaction or asynchronous job generation.

## Caveats
- Existing model rates produce indicative **gross** USD, not a bill. Cloudflare
  remains the authority for free neurons, charges and adjustments.
- Unpriced models are counted but not assigned a guessed dollar cost.
- Historical calls before migration may lack `duration_ms` and are omitted
  from latency samples, though they remain in cost and call totals.
- No provider credentials, new external AI service or paid service is required.
