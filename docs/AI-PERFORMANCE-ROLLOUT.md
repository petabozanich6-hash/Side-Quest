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
