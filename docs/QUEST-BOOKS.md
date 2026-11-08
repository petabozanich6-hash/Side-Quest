# Quest Books

Side-Quest's own downloadable subject books (Mathematics, English, Science, History, Geography) for Foundation to
Year 10. Parents find them under **Quest Books** in the sidebar (`/parent/quest-books`).

Code: `worker/src/questBooks.ts` (routes), `worker/src/questBookPurchases.ts` (single-book purchases), the Stripe
webhook in `worker/src/billing.ts`, `frontend/src/pages/parent/QuestBooks.jsx`,
`frontend/src/components/parent/QuestBookCover.jsx`. Tests: `worker/test/questBooks.test.mjs`. Migration: `0072`.

## Who gets what

| Family | Can download |
| --- | --- |
| Family Membership (and the owner) | Every book, included |
| Anyone signed in (including the free preview) | Every book's free sample PDF |
| Bought a book (any non-member) | That book, for good, even after the preview ends |
| Bought "book + all lessons" | The book and every published chapter lesson |
| Bought single lessons | Just those chapter lessons (not the book) |

A book with no price is for members only. Books are digital downloads (PDF) the family keeps and prints as needed.
Lessons a family is entitled to are copied into **My lessons** with one tap and stay assignable even after a free preview
ends (`assignLesson` checks `isBookLessonGrant`). A book-only buyer upgrades to the bundle for the difference.

## Workbook companion lessons (owner)

On a book in the uploader, **Lessons** opens the session builder:

1. **Read bookmarked sections from the uploaded PDF**. Non-teaching sections (welcome, answers, parent notes) are
   unticked by default. For a chapter covering multiple skills, enter a PDF page number and **Split into two sessions**.
   Each session has one specific learning goal and optional **exact workbook exercise reference** (such as
   "Page 18, questions 1–8"). Session IDs are stable across a re-read or split, so previously purchased
   individual lesson keys do not shift to different content. For clean extraction, each session may contain at
   most 8,000 characters of source text. The app rejects larger sessions before generating; it never silently
   drops the end of a chapter.
2. **Make lesson** for each session. The AI receives the Year, subject, exact selected source, goal and page range.
   It creates a **complete Side-Quest lesson**: actual teaching, worked models, guided practice, independent tasks,
   written questions, assessment, answers and parent teaching notes. The online lesson must be self-contained
   and printable without the PDF; workbook questions are *additional parent-guided practice* rather than
   a dependency. Drafts go into **My lessons** and keep their book/page/exercise metadata when edited.
3. **Review every lesson**, mark its status **Ready**, and tick **I checked the lesson and answers** beside it in
   the book space. Book-generated lessons cannot be published if the source changes, the lesson remains a draft,
   required instructional components are missing, or the owner has not explicitly approved that lesson.
   Re-reading and changing a unit's goal, pages, exercises or text will flag earlier drafts as stale.
4. **Publish** to snapshot approved lessons into private R2 (`lessons.json`). Families see only published lessons,
   and may assign them online or print the student and parent editions using the existing lesson player/print
   system. Republish after editing to update what *new* buyers get; existing family copies remain unchanged.

**Known limits:** Splitting works from PDF page text extracted while scanning a file. For a saved chapter, re-read
the PDF to make additional splits. This workflow does not run OCR on scanned/image-only PDFs and does not
independently certify the educational accuracy of AI-generated content. A human must check all answers, spelling,
phonics progressions, curriculum suitability and copyright before publishing.

Prices (owner sets per book, all optional): **book**, **book + all lessons** (at least 50c more than the book), and
**single lesson**.

## Owner upload (bottom of the Quest Books page, owner only)

1. **Add a book**: title, subtitle, year level, subject, pages, price (leave empty for members only) and description.
2. Upload its files:
   - **Book PDF**: the full book members and buyers download (up to 95 MB).
   - **Sample PDF**: a few pages anyone can download for free.
   - **Cover PNG**: portrait, at least 600 × 800 (about 3:4). Without one, the shelf shows a plain card with the title.
     The site never draws cover art itself.
3. Families only see a book once its Book PDF is uploaded. Until then it's a draft only the owner sees.
4. **Details** edits the text and price; uploading a file again replaces it. **Remove** deletes the book and its files.

All files are stored only in the private R2 bucket (`quest-books/v1/<book-id>/`), never in this public repository.
Downloads are checked on every request (membership or purchase) and use the short-lived files-only token, so a copied
link stops working for anyone else.

## Buying a book

`POST /api/quest-books/books/:id/checkout` opens Stripe Checkout (one-off payment, AUD) at the price stored with the
book. Only the signature-verified webhook (`checkout.session.completed` / `async_payment_succeeded`, mode `payment`,
`metadata.kind = quest_book`, `payment_status = paid`) records the purchase. The return page grants nothing; it waits
for the webhook. No new Stripe products or price IDs are needed.

Purchases are recorded only by the verified Stripe webhook: `quest_book_purchases` (tier `book`/`plus`) and
`quest_lesson_purchases` (single lessons). Both tables and the `tier` column are created by the Worker on first use.

## Release

Apply migration `0072_quest_book_purchases.sql` after a D1 backup (`docs/RELEASE.md`). The Worker also creates the
table itself if the migration hasn't run yet.

## Specialist shelf

Quest Books has two tabs: **Year-level books** (the core subjects, Foundation to Year 10) and **Specialist**.
Specialist shelves: NAPLAN prep, HSC prep, VCE/QCE/WACE/SACE, Selective & OC tests, Reading & spelling,
Handwriting, Study skills and Life skills. Specialist books can be Years 0–12 or "All ages", and carry a
**topic** (e.g. "Numeracy", "Mathematics Advanced") that shows in place of the subject.

The owner sees dashed **Planned** cards on each specialist shelf (from `frontend/src/lib/questBookPlan.js`).
Only the owner sees them. Clicking one opens "Add a book" already filled in. A planned card disappears once a
book with the same shelf, year and topic exists. Edit `questBookPlan.js` to change the list.

## Book space (owner)

Open any book (or press **Open book space** in the uploader) to get a checklist just for that book: details and
prices, Book PDF, look-inside pages, cover, optional sample, chapters, lessons. The next step to do is highlighted.

## Look inside before buying

When the Book PDF is uploaded, the owner's browser makes up to 6 small page pictures (first pages plus a spread from
the first half, never the answer pages) with a heavy "SIDE-QUEST PREVIEW" watermark burned in. Pressing **Buy** shows
these first. Only the pictures are sent to parents, never the PDF. Use "Make again" in the book space to redo them.

## Prices

Defaults for a new book: book $3.99, single lesson $1.00, book + all lessons pack $9.99. Each pack a family buys after
its first is 10% cheaper again (2nd 10% off, 3rd 20% ... capped at 50% off). A family that bought the book alone pays
the difference for the pack (at least 50c). Members get everything free.

## Curriculum codes for every state

When lessons are published, each one is matched to the outcomes of every curriculum Side-Quest holds (NSW, Australian
Curriculum v9 for QLD/SA/TAS/ACT/NT, WA; VIC once loaded). A family adding the lessons gets its own state's codes.
Lessons added before this change keep the codes they had; publishing again doesn't change copies already added.
