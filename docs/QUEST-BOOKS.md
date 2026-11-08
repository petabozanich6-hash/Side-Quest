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

## Rebuilding a pre-release book's lesson collection

The book-space **Start fresh from this PDF** action now lets the owner repair an early or badly divided
collection without deleting or re-uploading the book. The server checks the actual purchase tables AND lesson
copies held by other families before allowing any reset; an owner's assumption that nobody has bought anything
is not sufficient. If distributed, the server returns `QUEST_BOOK_ALREADY_DISTRIBUTED` and keeps the plan.
Otherwise it backs up the former private plan/publication snapshot, clears those two objects, and archives
the owner's AI-generated drafts. It deliberately leaves the PDF, cover, sample, look-inside images, pricing,
manually authored lessons and assignments unchanged. Then the existing PDF is re-analysed automatically.
Old AI drafts remain recoverable under Archived.

**Remake all lessons** regenerates every chapter subsection sequentially, including ones with existing drafts.
The owner may stop after the current lesson. A successfully remade lesson archives its superseded AI drafts;
the earlier draft remains intact if the AI generation attempt fails.

### Lesson planning is about skills, not PDF page counts

A PDF page is a teaching SOURCE, never automatically a 45- or 60-minute lesson. Fine-grained per-page bookmarks
are grouped into broader chapter ranges before AI planning. Within a chapter, AI is instructed to combine
related explanations, examples and workbook exercises into one coherent skill, even if that skill spans many pages.
The server also clamps spurious one-subsection-per-page proposals. Lesson count should follow distinct learning
objectives, not page count or extracted-text size.

The standard AI lesson maker accepts 8,000 characters of source per generation. When one skill spans more
text than that, the system supplies **balanced, labelled excerpts from each page** rather than either truncating
at the start or splitting that same skill into many artificial lessons. These excerpts are explicitly labelled
as incomplete source: full quotations and readings should not be invented. Review literacy passages and answers
in the final lesson before publishing.

## Workbook companion lessons (owner)

When the owner opens **Lessons**, Side-Quest now builds a two-level plan automatically:

1. **Analyse chapters and subsections** reads the already-uploaded text-based Book PDF in the owner's browser.
   It uses PDF chapter bookmarks when present, then tries Unit/Chapter text headings, and finally falls back to
   labelled ranges of readable PDF pages. The owner is not required to set chapter or subsection boundaries.
2. The owner-only AI planning route `POST /api/quest-books/admin/books/:id/chapters/plan` takes one chapter
   (or a bounded continuous batch of long chapter pages) and proposes **teachable subsections** with titles,
   learning goals, original PDF page boundaries and optional printed exercise references. The server verifies
   every suggested page range and automatically divides anything too long for one lesson. The analysis stage
   **does not** create or publish lessons.
3. A clear **Chapter → Subsections** view lets the owner see the entire suggested structure. Titles and learning
   goals may be corrected if the AI misunderstood a topic, but manual splitting and creating learning objectives
   are not required. The owner saves the plan once.
4. **Make lesson** on each subsection invokes the established complete Side-Quest AI lesson generator. Its lessons
   are self-contained for both online assignment and student/parent printing. The book's exact relevant pages
   and practice reference are parent-facing extra practice, not mandatory external content.
5. The owner reviews lessons in **My lessons**, marks them Ready, explicitly confirms their answers, then
   publishes the collection. The existing completeness, outdated-source and approval gates remain intact.

Published or previously sold lesson keys are protected. When an uploaded book is re-analysed, an existing chapter
with published lessons retains its prior subsection structure instead of silently remapping family purchases;
new chapters are analysed normally. To rework purchased lessons' structure, publish a new book edition.

**Known limits:** Planning needs extractable PDF text and an enabled AI binding. Image-only scanned books need
OCR before the planner can use them. AI analyses focus on page text, and a subsection boundary is at a PDF page,
not partway through a page; multiple genuinely different skills printed together on a single page cannot be
separated with perfect precision. The tool does not guarantee curriculum or answer accuracy; independently
review phonics progression, literacy texts, mathematical answers, curriculum alignment and copyright before sale.


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

Deploys: pushes to main build on Cloudflare (Workers Builds, production branch main). Retrying an old build redeploys that old commit.
