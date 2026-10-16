# Side-Quest AI performance, model routing and cost tracking

Status: on branch `claude/sidequest-ai-routing`, **nothing switched on in production**. Every new behaviour
that could change model output or timing sits behind a Cloudflare variable that is unset by default.
Deploying this code leaves lessons, models and costs exactly as they are today, apart from three things that
are on by default because they only protect families (see "On by default").

## 1. What happens today (investigation)

- **Provider:** Cloudflare Workers AI only (`env.AI` binding), optionally through AI Gateway
  (`AI_GATEWAY_ID`). No other AI provider is used and none is added.
- **Models:**
  - Every feature uses `AI_MODEL`. If that isn't set, the default is `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.
  - Child help uses `AI_HELP_MODEL` when it is set.
  - The live values must be read in the Cloudflare dashboard. The repository can't prove them.
- **AI features (all now tagged with a task name):**

  | Feature | Task name |
  | --- | --- |
  | Lesson drafting | `lesson_*` (7 stages) |
  | Outcome matching | `outcome_match` |
  | Lesson changes | `lesson_refine` |
  | Lesson-set plan | `series_plan` |
  | Learning plan | `learning_plan` |
  | Life-learning mapping | `life_mapping` |
  | Child help | `child_help` |

- **One lesson draft is a chain of focused requests:**
  1. design
  2. frame (introduction, readings, wrap-up)
  3. one request per teaching section and per worked example, four at a time
  4. practice and assessment, together
  5. one targeted repair, only if the quality check finds problems
  6. outcome matching (NSW families only)
- **Call count:** a typical one-hour lesson (5 sections and 3 worked examples) makes **12 calls**, or 13 with
  outcome matching. A repair adds 1, and every unusable reply adds a retry. The design step allows up to 10
  sections and 8 examples, so the theoretical maximum is about 45 calls. **The "about 15 calls" estimate is
  right for a typical lesson with a repair or a retry.**
- **Sequential vs concurrent:** about seven rounds run one after another. Teaching runs in two waves of four.
  Practice and assessment already run in parallel.
- **Retries:** each stage retries once if its reply isn't usable JSON. A cut-off reply that can be saved is
  kept and flagged to the parent.
- **Timeouts:** there were none. A hung call held the parent's request until Cloudflare gave up.
- **Validation:**
  - A strict JSON parse, then a reported repair.
  - `qualityIssues` checks arithmetic, missing resources, placeholders, off-screen tasks, vague instructions
    and length/depth.
  - Hard failures mean the draft is not saved and the allowance is not used.
- **Owner HQ cost tracking:**
  - Before: one row per model call (model, tokens, estimated USD) with no task, time or retry information.
  - After: one row per call with task, generation, attempt, fallback, tokens, estimated USD, duration and
    status. HQ shows a 30-day breakdown by task and model, and an AUD figure.
- **Privacy:** the ledger and the new job table hold ids, model names, numbers and a stage name. They never
  hold prompts, replies, child, family or email data. Tests check this.

## 2. Model routing (`worker/src/aiRouting.ts`)

| Variable | Default | Effect |
| --- | --- | --- |
| `AI_ROUTING_ENABLED` | unset (off) | `"true"` applies `AI_MODEL_ROUTES` |
| `AI_MODEL_ROUTES` | unset | JSON map from task to model, e.g. `{"outcome_match":"@cf/qwen/qwen3-30b-a3b-fp8"}` |
| `AI_MODEL` / `AI_HELP_MODEL` | as today | The caller's model, which is also the fallback |

- **Allow-list only.** An unknown task or a model that isn't on the list is ignored, and Owner HQ shows the
  problem.
- **Errors fall back.** A routed model that errors or times out is retried once on the caller's model, and the
  row is marked `fallback`.
- **Retries never use the routed model.** If a routed reply can't be used, the stage's own retry always uses
  the caller's model. A cheaper model can never be the reason a lesson is weaker or missing.
- **Reasoning text is ignored.** `<think>…</think>` blocks are stripped before parsing, so a reasoning model's
  JSON is still read.

Allow-listed models. Prices are Cloudflare's per-model figures, read on 2026-10-16 from the Workers AI docs
source (`cloudflare/cloudflare-docs`, `pricing.mdx` and `workers-ai-models/*.json`). Billing is US$0.011 per
1,000 neurons after the free 10,000 a day.

| Model | USD / M input | USD / M output | Context | Status |
| --- | --- | --- | --- | --- |
| `@cf/meta/llama-3.3-70b-instruct-fp8-fast` | 0.293 | 2.253 | 24k | current, proven with the parser |
| `@cf/qwen/qwen3-30b-a3b-fp8` | 0.0509 | 0.335 | 32k | needs measured validation |
| `@cf/openai/gpt-oss-20b` | 0.200 | 0.300 | 128k | needs measured validation (also accepts the Responses `input` format; Side-Quest sends `messages`) |
| `@cf/meta/llama-3.1-8b-instruct-fp8-fast` | 0.045 | 0.384 | 128k | needs measured validation |

## 3. Faster lesson pipeline (`AI_FAST_PIPELINE="true"`, off by default)

None of these changes alters a single prompt:

- **One wave for teaching.** Every teaching section and worked example is requested at once, instead of four
  at a time.
- **Teaching starts alongside the frame** for subjects that rarely use readings (not English, HASS, the Arts
  or languages, and only when there is no pasted source). The section prompts only differ when the frame
  returns readings. If it does, the teaching is written again with them, so the result is the same as today;
  the only cost is the extra calls.
- **Outcome matching starts after the design step.** It only reads the title, objectives, key words, section
  headings and worked-example titles, all of which the design step settles.
- **Per-call timeout of 90 s** (override with `AI_CALL_TIMEOUT_MS`, 5,000–600,000). A timed-out call fails the
  draft cleanly, and the allowance isn't used.

`AI_COMPACT_GENERATION` (pairs of sections per call, from #204) is unchanged and stays off.

Tests prove that the fast path writes the **same lesson** as the current path: same sections, examples,
practice, activities, questions and quiz content. They also check that it runs all teaching in one wave, and
that it rewrites teaching when readings appear.

## 4. Parents: real progress, no lost requests, no double charges (on by default)

- **One request id per press.** Make a lesson sends a `request_id`. The same id never starts a second
  generation, whether from a double click, a retry after a dropped connection or two tabs:
  - a finished lesson is handed back
  - a lesson still being written answers `409 IN_PROGRESS`
- **Real progress.** `GET /api/ai/lesson-draft/status?request_id=` reports the stage really reached:

  | Step | Stage |
  | --- | --- |
  | 1 | Planning (`design`) |
  | 2 | Introduction (`frame`) |
  | 3 | Explanations and examples (`teaching`) |
  | 4 | Practice and quiz (`practice`) |
  | 5 | Checking (`checking`) |
  | 6 | Curriculum outcomes (`outcomes`) |
  | 7 | Saving (`saving`) |

  It also reports done (with the lesson id), failed, or interrupted, which means no progress for 6 minutes.
  An interrupted request can be retried with the same id.
- **The progress screen** shows these stages with the dragon (planning and teaching) and the gremlins
  (practice and checking). If the main request drops, the screen keeps following the same request and opens
  the lesson when it is ready. A browser test covers this.

## 5. Cost safeguards (on by default)

- **Atomic allowance.** It is reserved with `INSERT … WHERE count < limit`, so parallel requests can't
  overrun it.
- **Stale reservations are released.** A reservation left `pending` by a stopped Worker is released after
  15 minutes.
- **Failure cap.** 12 failed drafts in 24 hours pause AI drafting for the family. Failures don't use the
  allowance, but they do cost money.
- **Bounded retries.** Each stage retries once, there is at most one repair, and a routed model falls back at
  most once. There is no open-ended loop.
- **Metering stays off the critical path.** Telemetry is written through `ctx.waitUntil` and never delays a
  reply. Failed or timed-out calls are recorded with their status.
- **AUD figure.**
  - **Rate:** USD to AUD at the European Central Bank reference rate, via `api.frankfurter.app`. HQ shows
    the source and date with the figure.
  - **Caching:** the rate is cached for 12 hours.
  - **When unavailable:** AUD is shown as "unavailable", never invented.
- **Not invoices.** Ledger figures are gross estimates. The Cloudflare invoice is authoritative.

## 6. Benchmark (`worker/scripts/ai-benchmark.mjs`)

```
node --no-warnings --import ./worker/test/register.mjs worker/scripts/ai-benchmark.mjs \
  --backend simulated|workers-ai --configs baseline,fast,compact,fast+compact [--routes '{…}'] [--runs 3]
```

- **What it runs:** the real `draftLessonWithAi`, including retries, repair, the quality gate, outcomes and
  saving.
- **Scenarios:** five fixed requests, with no real child data:

  | Scenario | Jurisdiction |
  | --- | --- |
  | Maths, Year 3, 30 minutes | NSW |
  | English, Year 4, 60 minutes | VIC |
  | Science, Year 7, 60 minutes | QLD |
  | Maths, Year 9, 45 minutes | WA |
  | English, Foundation, 30 minutes | SA |

- **Measured runs** (`workers-ai`) save every lesson for human review.

### Results so far: SIMULATED only

No real model was called. Cloudflare's API isn't reachable from the environment this was built in. The
simulated backend replies with the reference garden lesson and charges 0.6 s plus output tokens at 40 tokens
per second for each call. **These results show orchestration only, not real model speed, cost or teaching
quality.**

| Config | Lessons OK | Median wall time | Median calls |
| --- | --- | --- | --- |
| baseline | 5/5 | 83.3 s | 12 |
| fast | 5/5 | 73.0 s (−12%) | 12 |
| compact | 5/5 | 83.5 s | 9 |
| fast + compact | 5/5 | 77.1 s | 9 |

What the simulation shows:

- **The critical path is the chain of stages, not parallelism.** In the simulation the longest calls were
  practice and assessment (run side by side) and design. The fast pipeline removes the frame and outcome
  rounds from that chain.
- **Compact mode saves calls, not time.** Fewer, larger replies take as long.
- **Token volume.** For a reference-sized lesson it is about 28k input and 5.5k output tokens, roughly
  **US$0.02 per lesson on Llama 3.3 70B**. This is an *estimate from simulated token volumes*.
  - Moving every stage to Qwen3 30B would be about US$0.003, but that needs measured quality before anyone
    relies on it.
  - Routing only `outcome_match` saves almost nothing (about 120 output tokens).

### Before enabling anything (owner approval needed)

1. Run the benchmark with `--backend workers-ai --runs 3` from a machine with a Workers AI token, for
   `baseline,fast` and then a routed config. Record median wall time, calls, retries, fallbacks and estimated
   USD.
2. Human-review the saved lessons side by side. Check:
   - teaching depth
   - worked examples
   - arithmetic and facts
   - practice and assessment
   - Australian spelling
   - parent guidance
   - adjustments for needs
   - outcome mappings
3. Turn on `AI_FAST_PIPELINE="true"` first, in staging, then production. Prompts are unchanged, so this is the
   lowest-risk step.
4. Only route a lesson stage to a cheaper model when the measured lessons are as good as the 70B ones.
   Candidates to measure first are `lesson_frame` and `outcome_match` on Qwen3 30B.

## 7. Rollback

- **Routing:** unset `AI_ROUTING_ENABLED`, which takes effect immediately.
- **Fast pipeline:** unset `AI_FAST_PIPELINE`.
- **Timeout:** unset `AI_CALL_TIMEOUT_MS` (and `AI_FAST_PIPELINE`).
- **Request ids and progress:** the frontend always sends them. Reverting the frontend alone removes them, and
  the server still accepts requests without an id.
- **Migration 0070:** additive (two new tables). The Worker also creates them with `CREATE TABLE IF NOT
  EXISTS`. Old code ignores them.

## 8. Not done

- No production model was changed and no new AI provider was added.
- No measured benchmark exists yet (see section 6).
- Lesson sets and Auto-Quest already had their own duplicate protection (item claims). They gain routing,
  the fast pipeline, the atomic allowance and the failure cap, but the progress screen is for single lessons.
