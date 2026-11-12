# Side-Quest Document Studio: PDF creation for Square

**Purpose:** Make the existing Side-Quest home education planning and recordkeeping products more substantial, readable and useful, then download the finished documents for a separate Square listing. Square checkout and the owner's existing automatic PDF delivery workflow are **not modified**.

## Main workflow (Owner HQ > Document Studio)

1. **Select the state or territory**: NSW, VIC, QLD, WA, SA, TAS, ACT or NT. The studio does not assume NSW.
2. Select a **document type**: Home Education Planning Workbook or Complete Home Education Planner & Diary.
3. Select the **learner year**. The first year is labelled using the selected jurisdiction's own terminology. NSW Years 7–10 additionally require **two different additional learning-area choices**, which create dedicated planning pages.
4. Generate **both A4 editions** from the same state-specific document: one designed for printing/handwriting and one with genuine interactive AcroForm text fields and checkboxes.
5. Inspect each page, enter and save test data in the fillable PDF, print an A4 sample, check current regulatory sources, and only then approve the customer ZIP. The ZIP includes the two customer-facing PDFs and no internal release notes.
6. Create the Square item yourself and use your **existing Square digital delivery setup**. Verify an actual test order correctly delivers the two-edition package; the PDF generator does not create or send customer orders.

The older Side-Quest shop listing, print queue and release controls are retained under **Legacy Side-Quest document listings**. A separate optional generic worksheet creator remains available but is not the principal home education product workflow.

## What is in each document

**Planning Workbook:** Learner and planning period; strengths/interests and goals; jurisdiction-specific preparation guidance; teaching approach; adjustments; learning environment, routine and resources; separate learning-focus and teaching/evidence spreads per learning area; record and review pages; jurisdiction authority preparation checklist; official-source links and final parent check.

**Complete Planner & Diary:** All the planning workbook pages, plus four adaptable planning periods, diary records, reading log, evidence index, outcome/goal tracker, project/outing record and family review.

These are independent **planning and recordkeeping companions**. They do not pre-claim curriculum outcomes, create imaginary family information or replace any government form. A digitally filled PDF with more words than a field can display may hide overflowing text when printed; test realistic long responses before sale.

### State-specific rules are not interchangeable

- **NSW:** Current NESA syllabus and implementation requirements matter. For Years 7–10, the studio explicitly asks for two different additional learning-area categories, and the family must still identify the actual syllabuses/subjects. Years 11–12 need independent verification of course selection and pattern of study.
- **VIC:** A home education learning plan can use subject-based or activity-based approaches while showing the eight learning areas and actual learning resources.
- **QLD:** A program summary should explain the individualised learning approach. Renewal/reporting documentation is distinct from an initial plan.
- **WA:** A home education moderator examines the learner's plan and progress; the program can be organised flexibly, and families should be ready to explain records and their relationship to curriculum references.
- **SA:** Explain learning-area coverage, real activities/resources and evidence including literacy, numeracy and social experiences.
- **TAS:** The Home Education Summary and Program is assessed using standards, including literacy, numeracy, range of learning areas, wellbeing, pedagogy and evaluation. A generic eight-subject checklist is not a substitute for addressing those standards.
- **ACT:** The Statement of Intent and annual Home Education Report serve different purposes. Developmental opportunities and learning strategies matter.
- **NT:** The official self-developed plan template is required when applicable. A Side-Quest PDF is a **preparation resource only**, not a replacement form.

All jurisdiction-specific content is subject to the independent review standard in [HOME_EDUCATION_DOCUMENT_QUALITY.md](HOME_EDUCATION_DOCUMENT_QUALITY.md). The existing authority catalogue was last checked **2026-10-14**, and source changes, syllabus implementation dates and registration rules must be checked before listing.

## Proof and automated checks

The repository's **Document Studio PDF Proof** workflow produces PDFs for every jurisdiction, plus secondary/senior representative proofs. It checks A4 dimensions, extracted text bounds, form field geometry, field overlaps, unique field IDs, print/interactive page parity, and whether typed text and checkbox choices survive saving and reopening.

Run the workflow or inspect the retained PDF artifact at `.github/workflows/document-studio-proof.yml`. The regression tests in `worker/test/homeEducationPdfQuality.test.mjs` also cover all eight jurisdictions and NSW elective handling.

An automated pass confirms **structural integrity**, not professional proofreading, accessible keyboard navigation in every reader, current regulatory accuracy, or an independent sale approval. Inspect every product in a PDF reader and at least one real printout, and arrange independent jurisdiction-specific review before making claims of registration suitability.

## Current design boundaries

The improved planning editions use understated Side-Quest colours, distinct functional sections, generous handwriting areas, purposeful prompts, full-page record tables and interactive form controls. These are **not** yet fully art-directed illustrated products. They do not incorporate Ignis cover art, interactive drag-and-drop activity pages, automated curriculum-code validation, multi-child personalisation or a PDF editor for arbitrary individual page design. The separate generic authoring tool supports writing, checklist and log pages.

The current Square-export action builds blank products for families to complete. The existing **guided/personalised family workflow** remains separate and cannot be safely described as automatically personalised by Square's generic file delivery. It requires a distinct verified customer-data and fulfilment path if offered for sale.

Do not label a document release-ready merely because it was exported or passed automated tests.
