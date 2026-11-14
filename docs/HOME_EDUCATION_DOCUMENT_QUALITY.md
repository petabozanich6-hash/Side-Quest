# Home Education Document Studio — quality and release standard

Status: **Mandatory. No paid home education document may be published until this
review process has been implemented and every applicable item has been evidenced.**

## Purpose

Help families produce accurate, individualised home education planning and
evidence documents aligned with the published requirements of their Australian
state or territory. A Side-Quest document is **not** a government-issued form,
government approval, a legal opinion, or a guarantee of registration.

The consumer must never be led to believe that filling in a generic workbook
automatically meets their registration obligations.

## 1. Authority and version control

For each jurisdiction and document type, retain:
- Official authority and official URLs (not only third-party summaries).
- Exact page/form/policy titles, effective dates and last-checked date.
- Which requirements are statutory or formally required versus optional
  recommended preparation.
- Applicant type (first registration, renewal, review, annual report), year
  level, and any differences by secondary stage or special circumstances.
- Required government forms, where parents obtain them, and whether our
  independent resource is a supplement or must be transferred to that form.
- Name of reviewer, date of the approval decision, template revision, and
  evidence of the check.
- Automatic hold when official sources change or current status cannot be
  confirmed, until reviewed again.

Do not assume that the existing `planJurisdictions.ts` summary is sufficient
for all document *types*. It was originally built for learning plans and was
checked 2026-10-14. Recheck current primary sources separately for each product.

## 2. Actual document completeness

A reviewer must map every mandatory requirement to:
- A named section or field in the document.
- Instructions that explain *what evidence* a parent should provide.
- Appropriate completion prompts rather than made-up family-specific answers.
- An example if an unfamiliar concept needs teaching, clearly labelled as an
  example rather than the family's own statement.
- A final checklist with an explicit incomplete/missing-information status.

Document-specific requirements take precedence. For example, don't assume
every state's documents are a NSW AP preparation pack, or that an independently
authored PDF replaces an authority's prescribed form.

## 3. Educational content quality

Review independently for:
- Correct jurisdiction, year/stage, learning areas, and subject coverage.
- A coherent relationship among goals, topics, teaching strategies, resources,
  learning opportunities, progress measures and evidence.
- Practical, understandable directions to parents (including flexibility for
  individualised approaches and learning needs).
- An appropriate distinction among proposed plans, actual completed activities,
  collected evidence and retrospective progress reports.
- No invented outcomes, curriculum codes, parent observations, resource names,
  assessment results or other factual assertions.
- Space and structure for families to personalise the content, without
  sensitive medical details unless genuinely required and voluntarily supplied.
- Accuracy of all examples, tables, citations, dates, links and disclaimers.

A good-looking template does not qualify if its questions are superficial,
empty, confusing or insufficient for the intended filing/review purpose.

## 4. Independent scrutiny

A separate editorial reviewer must apply the official-source requirements
matrix to a completed example and an intentionally incomplete example:
- The complete example is comprehensive, consistent, and readable.
- The incomplete example visibly identifies missing material rather than
  silently claiming readiness.
- Any disputed legal/administrative interpretation is escalated; do not use an
  AI reviewer's unsupported verdict as sign-off.
- Required corrections are made and re-reviewed. Keep a change log.

Use a practitioner with relevant state-specific experience or obtain
independent specialist review before publishing a product as suitable for
registration/review preparation. Do not claim government endorsement.

## 5. Output and buyer experience

- Genuine interactive form fields for any product advertised as a "fillable
  PDF", verified using common PDF readers.
- Accurate pagination, print margins, writing space, long-answer overflow,
  fonts and accessibility checks; no clipped content.
- A blank template, completed sample (fictional), completion guide, and
  sources/checklist should be tested as a coherent set.
- Guided generator must allow save/review/correction, avoid invented responses,
  clearly label incomplete sections, and use the exact verified template
  revision selected at purchase.
- Avoid retaining children's personal data; if future saved drafts are
  supported, implement purpose limitation, access controls, encryption and
  deletion lifecycle before collecting it.
- Verify paid-only access using a confirmed webhook, unforgeable order token
  and exact purchased product/jurisdiction.
- Test download after payment and link recovery; test mixed orders and
  unauthorised access.

## 6. Publishing rule

Current implementation deliberately **fails closed** for
`home-education-document` shop products, even with a PDF file uploaded.
Do not remove this gate simply to enable sales. Replace it only with a
server-side approval process binding a reviewed document version, jurisdiction
and official-source review to that exact product, with revocation on changes.

Before release: genuine state-specific templates, approval ledger, tested
customer journey, and evidence that all applicable requirements have been
met. A manual checkbox alone does not count as independent verification.
