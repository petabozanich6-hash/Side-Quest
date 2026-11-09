# Owner HQ Book Forge

Owner HQ → Book Forge is the book production studio. It creates original workbooks from a natural-language brief and also provides a manual editor. Approved editions publish as hidden digital products in the existing Shop, with the PDF attached to the existing paid-download mechanism. It does not publish to Quest Books or alter existing books, purchases, family lessons, lesson-generation models, or the Printable Vault.

## Automatic creation

Enter a brief with Foundation (or Prep/Kindergarten) or Year 1–6, and Mathematics, English or Science. Complete workbooks derive their initial session count from the curriculum scope (three practice sessions per reference, minimum 16); an optional page target in the brief or form changes that allocation. Focused books default to eight sessions. There is no fixed 26/74-page product preset. Each session currently has two student pages and a separate answer page. Covers and contents paginate independently. Planning is batched in groups of 12 sessions to avoid truncating long outlines. The technical safety ceiling is 900 requested pages (1000 manually edited pages), 1.5 MB project metadata, and 25 MB per downloadable PDF; larger works need separate volumes. Automatic multi-volume packaging is not implemented. This is a first iteration, not a claim of independently verified professional publishing quality.

The workflow uses the checked-in ACARA v9 catalogue as planning references, validates reference identifiers, writes small sessions, independently reviews each session through another model call, generates up to six decorative illustrations, then renders the PDF. Exact counting diagrams and number cards are SVG generated from validated integers. AI artwork is not used as mathematical evidence. Answer pages are placed after all student pages. An adult reviews curriculum suitability, accuracy, spacing, diagrams, artwork and rights before approving any PDF for sale.

## Editorial checks and revisions

Editorial logic lives in `worker/src/bookForgeEditorial.ts` (pure functions, unit-tested in `worker/test/bookForgeEditorial.test.mjs`). The writer returns a structured session: for each of the two student pages an explanation, an optional labelled worked example and numbered tasks, plus an optional diagram; and an answer key with one answer per task number. Code composes the page text in teaching order (explanation, worked example, tasks).

Before any AI review, every draft passes deterministic checks:
- tasks are numbered 1…N across both pages, and the answer key has exactly one non-empty answer for each (no missing, duplicate or extra answers);
- 5–10 tasks per session, 2–6 per page, no repeated tasks, page length within the print budget, no answers on student pages except the labelled worked example;
- diagrams are code-drawn: counters, ten-frame or shapes with an integer count 0–20, or number cards (numeral, number word and dot pattern) from 0 or 1 to at most 10. **0 is valid**: an empty group is drawn as an empty outlined group or empty ten-frame, and "how many" answers about it must be 0 ("none"/"empty" count as 0). Any count stated in the text, or given as the answer to a question about the diagram, must equal `visual.count`;
- page 1 opens with an explanation and a complete worked example; any task practising a skill (ordering, comparing, adding, taking away, skip counting, doubling/halving) needs a worked example of that skill before it;
- practice uses fresh numbers: a task with the same numbers or wording as a worked example is rejected;
- Foundation numeral-recognition sessions must show number cards on page 1, say number names in the teaching, and keep practice numbers within the cards shown.

Only then is the session sent to an independent review, which returns `errors` (objective: wrong maths, mismatched answers, missing teaching, copied examples, unsuitable or ambiguous tasks) and `suggestions` (subjective). Only errors block. Reviewer errors that contradict the deterministic checks (for example calling an empty group invalid, or claiming a missing answer the checks verified) are ignored and recorded as reviewer false positives.

A rejected session is not thrown away. The draft and its accumulated, de-duplicated feedback are stored in the job payload under `revisions[<session cursor>]`, and the next attempt revises that draft ("keep everything that was correct, fix only these problems"), with suggestions offered as optional. The full revised draft then goes through every check again. After three failed attempts the step is marked failed and the existing Retry/Stop controls appear; the draft and feedback stay in the payload, and Owner HQ shows them. Retry continues revising the kept draft. A session's pages are added to the book only when it passes; the draft and feedback are then cleared. A rejected or partial draft is never added to `book.pages`, rendered or published, and QA keeps an incomplete book from approval.

## Print layout

Interior pages are white with black text, thin grey rules, a boxed worked example, a writing line under each task and ruled space below. Diagrams are black and grey line art. Covers keep the template's branded colours. Answer pages are packed several sessions to a sheet (`printSheets`); the contents and footers number printed sheets.

A D1 job stores the phase and cursor. The existing minute cron processes one leased step, preserving completed work. A ten-minute lease prevents duplicate work between overlapping cron calls. A failed step retries twice, then visibly pauses with Retry/Stop controls. A book typically needs one cron tick per planning batch, one per session, up to six for artwork and one for rendering; provider delays/retries can extend this. No browser tab needs to remain open. Stopping fences an in-flight result but cannot undo an already-started provider charge.

## Storage and access

All endpoints are below `/api/admin/book-forge`, behind the existing owner-role, CSRF, rate-limit and passkey checks. Projects are scoped to the owner user. No public asset endpoint is introduced. Generated teaching plans stay inside the book project; the existing family lesson library is not modified. Manual pages can reference a family lesson and retain an immutable lesson snapshot when locked. Unlocking or editing invalidates the current PDF and approval. Published editions remain available separately.

The runtime creates only two additive tables (`book_forge_projects`, `book_forge_jobs`) and an index. It does not run unrelated migrations or rewrite existing records. R2 artwork and PDFs use `book-forge/<project>/...`; approved Shop copies use the existing `shop/products/<product>/file` key. D1 compare-and-swap updates prevent silent overwrites. Publication atomically stores the release and creates a hidden draft product. Price, product imagery and visibility remain owner decisions in Shop.

## Services and billing

- `AI`: existing Cloudflare Workers AI binding. Text uses the existing Cloudflare-hosted Llama 3.3 70B model, independently of the site's lesson generator configuration. Illustration options are Cloudflare-hosted FLUX.2 Klein 9B (1024×1024) and FLUX Schnell. Automatic books use Klein. No AI Gateway or third-party prepaid credits are used.
- `BUCKET`: existing R2 binding for durable files.
- `BROWSER`: Browser Run binding added to `wrangler.jsonc`, using `quickAction('pdf', ...)`. This does not require a separate API token. The installed Workers types and current Cloudflare documentation support it.
- Manual PDF export also supports `BOOK_FORGE_CF_ACCOUNT_ID` and secret `BOOK_FORGE_CF_API_TOKEN` as a REST fallback for environments without the quick-action method. Never put the token in source or client code. Automatic jobs require the browser binding.

Workers AI, Browser Run and storage usage follow the account's configured Cloudflare billing and allowances. The implementation never loads prepaid credits. It does not verify the account's payment date, plan, entitlement or free allowance. Three automatic book starts, 30 image calls and 30 manual PDF renders per owner/day are bounded separately; owner admin request rate limits also apply. Automatic text retries can add usage. The existing AI cost ledger records model invocations; models without token pricing may show unpriced calls rather than a fabricated estimate.

## Verification and limits

API tests exercise authentication, passkey gate, CSRF, stale revisions, locked content, changed lesson snapshots, private assets, PDF response validation, approval, hidden Shop products, durable generation, lease exclusion, retries and cancellation. Provider responses are simulated: these tests incur no inference or rendering charges. A real generated book still requires end-to-end provider and visual quality validation before release.

Quality checks are structural and heuristic, supplemented by independent AI content review. They do not certify curriculum coverage, print layout or mathematical correctness. The initial implementation supports the three listed primary subjects; unsupported year/subject requests must be rejected rather than silently reinterpreted. Existing artwork is not used as a reference-image input in this iteration. A later upgrade can add reference-based illustration editing and Cloudflare Workflows; Printable Vault generation and broader lesson-generator improvements are explicitly deferred.

References checked 9 November 2026:
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/changelog/post/2026-01-28-flux-2-klein-9b-workers-ai/
- https://developers.cloudflare.com/browser-run/quick-actions/pdf-endpoint/
- https://developers.cloudflare.com/ai-gateway/features/unified-billing/ (prepaid; not used)
