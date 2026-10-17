# Side-Quest Workers AI performance rollout

This change is intentionally **off by default** for both alternative models and the grouped lesson-generation strategy. Deploying code does not authorize switching an unverified model in production.

## Baseline and problem

The main lesson writer uses `@cf/meta/llama-3.3-70b-instruct-fp8-fast` unless the Cloudflare `AI_MODEL` environment variable overrides it. A complete lesson makes separate design, frame, teaching-section, worked-example, practice, assessment and sometimes outcome-selection requests. Several run in parallel, but some are sequential. Model and actual settings on the deployed Worker **must be confirmed in Cloudflare**; repository defaults are not proof of live configuration.

`aiCost.ts` previously waited for a D1 cost-ledger write after **every** model call. Production now registers those writes with the request's Cloudflare `ExecutionContext.waitUntil`; it no longer blocks returning an AI response. Background failure must not fail the user's lesson. Unit tests keep awaited logging when no execution context is supplied.

## New opt-in Cloudflare Worker environment settings

| Key | Suggested trial value | Effect |
| --- | --- | --- |
| `AI_MODEL` | Keep existing live setting | Main model for lesson drafting, plans, refinements and most AI calls |
| `AI_HELP_MODEL` | `@cf/meta/llama-3.1-8b-instruct-fp8-fast` | Separate model for **child help only**; when unset, the existing `AI_MODEL` is used |
| `AI_COMPACT_GENERATION` | `true` **only in an isolated test environment** | Pair neighbouring teaching sections and worked examples into fewer calls, with fallback to single-call generation when grouped JSON is missing/invalid |
| `AI_GATEWAY_ID` | Retain existing value, if any | Existing optional Cloudflare AI Gateway route |

The compact flag is passed through manual single lessons, multi-lesson batches and Auto-Quest. It **does not remove** any existing final lesson quality checks, paid entitlement checks, per-family limits, saved-draft status, answer-key generation or curriculum restrictions. The same server-side checks decide whether an output can be saved.

Candidate models to benchmark in Cloudflare Workers AI:

- `@cf/qwen/qwen3-30b-a3b-fp8` — current published price about US$0.051 input / $0.335 output per million tokens.
- `@cf/openai/gpt-oss-20b` — current published price about US$0.20 input / $0.30 output per million tokens. **Its response format and reasoning/output behaviour require validation against Side-Quest's existing JSON parser before enabling it.**
- Existing baseline `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.

Primary sources:
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers-ai/models/qwen3-30b-a3b-fp8/
- https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b/

## Rollout and quality gates

1. Wait for CI, Worker typecheck, browser suites, and security tests. Do not merge failing code.
2. Inspect live Cloudflare variables without exposing credential values. Do not overwrite payment, email, R2, D1 or unrelated settings.
3. Make a **test-only** Worker/environment or a controlled owner-only test path. Do not silently change `AI_MODEL` on live family requests.
4. Compare three representative lesson requests (30 min Year 3 maths, 60 min Year 7 science, 60 min Year 4 English) on the **same subject, year, needs, prompt and duration**, using baseline and each supported candidate, compact on/off separately. Avoid real child personal information in benchmarks.
5. Record actual wall time and per-stage `generation.stage_timings_ms`, `generation.calls`, output tokens, logged gross estimated USD per generation, retries, failures, quality warnings, lesson output length and structural validity.
6. Human-review teaching depth, worked examples, arithmetic/factual accuracy, completeness of practice and assessment, Australian spelling, independence/parent guidance, adjustments for learner needs, approved curriculum outcome mappings, draft/review flow and child help not revealing answers.
7. Only enable a new model or compact mode when **both** speed and acceptable educational quality are demonstrated. Roll back by unsetting its variable.
8. Confirm Cloudflare invoice figures separately; cost ledger remains a gross estimate and can lag response completion because it writes in the background.

## What this change does not do

- No production model replacement or price-plan changes.
- No new third-party service or extra API keys.
- No guarantee that Qwen, GPT-OSS or grouped generation is faster or equivalent in learning quality until production-like tests establish that.
- No automatic progress stream: lesson review can show the actual elapsed generation time; future work could move single generation to a server-managed background draft job with truthful milestone updates and recoverability.

## Tests

- `worker/test/aiCost.test.mjs` checks background writes and that no child text is kept in the ledger.
- `worker/test/builder.test.mjs` checks grouped response success, original-path fallback and resulting lesson draft semantics.
- Existing CI covers entitlements, quality rejection, outcome restrictions, security, print, offline, browser and owner flows.


## 17 October: reproducible, budget-capped live-model comparison

The optional command `worker/scripts/compare-cloudflare-ai.mjs` executes the
**actual staged lesson generator**, not an unrelated toy prompt, with a fixed
synthetic Year 3 maths fixture and compact generation enabled. It is NOT
invoked on a deployment, user request or automated CI.

First, verify settings and upper bounds without credentials or AI calls:

```bash
node --import ./worker/test/register.mjs worker/scripts/compare-cloudflare-ai.mjs --dry-run
```

To deliberately execute the small comparison, an authorised operator must
provide `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` via the process
environment. Never commit or share tokens. The default comparison includes
the existing Llama 70B, Qwen3 30B and Gemma 4 26B; choose 1–3 from this list
using `BENCHMARK_MODELS`, separated by commas, to restrict usage further.
The command refuses to start without both credentials.

**Hard limits in the script:** 32 total AI calls across all models; a
conservative US$0.50 maximum reserved gross token estimate before free
neurons, which may not exactly match the invoice; 4,096 maximum output tokens
per call; 75-second request timeout. It cannot prevent costs of any
provider-side processing beyond the assumptions in published prices, so run
only with permission and keep Cloudflare spending alerts enabled.

It prints model call counts, generation time, structural completeness, warnings,
and output-token estimates without printing model-generated lessons or any
credentials. For optional **synthetic** lesson review, set
`BENCH_REPORT_DIR` to a private local path. Do NOT use actual child data.

Quality review is essential: the automated `structurallyPlausible` gate
checks rough completeness, not arithmetic accuracy, teaching depth,
curriculum alignment or reading-level adjustments. A model with a lower cost
must NOT become the production default if it writes weaker lessons.

Cloudflare's currently published additional trial models:
- `@cf/google/gemma-4-26b-a4b-it`: US$0.10 input / $0.30 output per million.
- `@cf/zai-org/glm-4.7-flash`: US$0.0605 input / $0.40 output per million.

The Owner HQ gross cost ledger and individual draft
`generation.est_cost_us_cents` estimate now recognise their exact prices.
Missing tokens and unpriced models show **unknown**, never fictional US$0.

**Deployment stays unchanged.** No `AI_MODEL`, `AI_HELP_MODEL` or
`AI_COMPACT_GENERATION` is changed in this PR. The only way to promote a
model is a separate, reviewed configuration change after both the human
quality checks and the synthetic benchmark are acceptable.


## Critical-path pipeline experiment — 18 October 2026

The current service may make one model call for design, one for the lesson frame,
one per teaching section and worked example (four concurrent at a time),
then parallel practice/assessment, plus optional repair and outcome matching.
**This is why a lesson can take about three minutes even though individual
requests are not three minutes long.** The exact wall time is measured, not
inferred from a model name.

The opt-in `AI_FAST_PIPELINE=true` changes no model, syllabus, price or
teaching prompt. It makes two bounded scheduling improvements:

1. Pure **Mathematics/Maths/Numeracy** lessons without a source/reading
   dependency can write their teaching sections and worked examples
   **while** the opening/closing frame is being generated, after the design.
2. Other subjects keep their normal frame-first sequence (so original readings
   are available to teaching), but allow six independent teaching requests to
   be in flight instead of four. The flag is separate from
   `AI_COMPACT_GENERATION`, whose earlier reduced-call trial did not
   demonstrate a reliable latency improvement.

Both flags default **off**. Existing validation, retries, curriculum rules,
paid plans, 10 drafts/day and 60/month, draft review, and usage/cost metering
are unchanged. Generation responses now report `generation.pipeline` alongside
`generation.elapsed_ms`, `generation.stage_timings_ms`, calls and estimated
gross USD cents. Do not confuse sum of concurrent stage timings with wall time.

### Safe proof before enabling on live families

Run the benchmark with synthetic teaching requirements, using approved
Cloudflare Workers AI credentials **only on an authorized development device**.
Never commit credentials or benchmark user/student documents.

```sh
# First dry run: no Cloudflare calls.
node --import ./worker/test/register.mjs worker/scripts/compare-cloudflare-ai.mjs --dry-run

# Use one model at a time, the SAME model and compact setting for both runs.
BENCHMARK_MODELS=@cf/meta/llama-3.3-70b-instruct-fp8-fast BENCH_COMPACT=false \
  node --import ./worker/test/register.mjs worker/scripts/compare-cloudflare-ai.mjs
BENCHMARK_MODELS=@cf/meta/llama-3.3-70b-instruct-fp8-fast BENCH_COMPACT=false BENCH_FAST_PIPELINE=true \
  node --import ./worker/test/register.mjs worker/scripts/compare-cloudflare-ai.mjs
```

The script caps aggregate *reserved* gross estimated inference at US$0.50,
up to 32 calls and 4,096 output tokens per request. Compare identical subjects,
year levels, goals, real call durations, tokens, costs, retries, incomplete
responses and education quality. A synthetic benchmark is **not** a production
speed result. Run at least three representative lessons (Maths, English with
reading, Science) and review actual teaching quality before turning on the
flag in a separate controlled deployment. Restore `AI_FAST_PIPELINE=false`
if quality, failure rate, provider throttling or real latency worsens.
