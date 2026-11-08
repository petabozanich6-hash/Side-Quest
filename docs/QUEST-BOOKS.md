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

## Chapter lessons (owner)

On a book in the uploader, **Lessons** opens the chapter tools:

1. **Read chapters from the PDF**: chapters come from the PDF's bookmarks (read in the owner's browser). Untick
   non-teaching chapters (welcome, answers, parent notes) and rename if needed.
2. **Make lesson** (or **Make all missing lessons**): each chapter's text goes through the normal AI lesson generator
   (same settings as Make a lesson). Drafts land in the owner's **My lessons** for review and editing.
3. **Publish lessons to the book**: snapshots the reviewed lessons into private R2 (`lessons.json`). Families only see
   published lessons; republish after editing to update what new buyers get (existing copies don't change).

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
