# Owner HQ Square invoice integration — staged implementation

Goal: Create and send genuine Square invoices from the same Side-Quest owner workflow used for branded letters and reports. Keep memberships, shop payments and tutoring separate.

## Implemented adapter (this PR)
Synthetic-only private staging; requires explicit test flag, staging key and private staging mode, sandbox credentials, a pre-existing synthetic Square customer with a matching @example.test address. Uses the existing Square API client. Creates one AUD order and draft invoice, validates amount, location, customer, due date and manual delivery, publishes separately with stable idempotency keys and checks the sandbox payment link. No stored card or automatic charge. No production route or customer email yet.

## Required Owner HQ integration
1. Only create invoice after parent confirms service, on the invoice-bearing root for upfront packages or individual session for instalments. Read amount and parent from scoped server order, never browser input. Keep agreed exact Sydney deadline (Square invoice due_date has day precision). Set due_date to its Sydney calendar date; disclose exact local cutoff separately, do not imply Square enforces it.
2. Use a durable separate tutoring invoice ledger with unique service order, customer, provider order, invoice ID and stable operation keys. Atomically claim creation before external calls; block parallel manual invoice creation and cancellation/release while unresolved. Persist each step and stop on ambiguous network errors rather than create another invoice. Existing manual records remain supported; do not convert or reissue existing invoices.
3. Match Square customer by exact verified email; if ambiguous, owner resolves before proceeding. Search/create using stable keys and do not send learner details to Square.
4. Preview then publish using SHARE_MANUALLY. Retrieve a fresh, validated Square public_url, then send a Side-Quest-branded invoice email with the secure link through the existing EMAIL binding, to the selected verified parent. Email failure does not undo invoice issuance; separately record delivery and prevent duplicate sends. Square controls its own receipts. Do not use a generic checkout link in place of an invoice.
5. Re-read invoice and order from Square to validate full amount, currency, location, invoice/order/customer identifiers and payment status. Verify signed events or explicit provider refresh. Partial/pending/refunded/late payment goes to review; do not change membership or grant all instalments. Existing support payment/refund handling must be audited before linking Square order IDs because its legacy path is not designed for these invoices.
6. For overdue lessons, verify no settled, partial or pending payment, cancel the actual Square invoice with version protection, re-read cancellation, then release only the applicable unpaid reservation. Never cancel solely because the clock passed. Preserve history and paid appointments.
7. Test synthetic customer creation, publication, matching/mismatched amount and identity, concurrent creation, failure recovery, payment/refund, reminders, cancelled invoice races, package and instalment isolation, and branded email. Use isolated sandbox and safe test recipient; production stays disabled until confirmed. No live transaction in this PR.

References:
- https://developer.squareup.com/docs/invoices-api/create-publish-invoices
- https://developer.squareup.com/docs/invoices-api/overview
- https://developer.squareup.com/reference/square/invoices-api/publish-invoice
