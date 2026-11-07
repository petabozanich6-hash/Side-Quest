# Quest Books

Side-Quest's own subject books (Mathematics, English, Science, History, Geography) for Foundation to Year 10.
Parents find them under **Quest Books** in the sidebar (`/parent/quest-books`).

Code: `worker/src/questBooks.ts` (routes, validation, adding lessons), `worker/src/questBookPurchases.ts`
(single-book purchases), the Stripe webhook in `worker/src/billing.ts`, `frontend/src/pages/parent/QuestBooks.jsx`,
`frontend/src/components/parent/QuestBookCover.jsx`. Tests: `worker/test/questBooks.test.mjs`. Migration: `0072`.

## Who gets what

| Family | Can see | Can use |
| --- | --- | --- |
| Family Membership (and the owner) | Everything | Every lesson in every book, included |
| Free preview (7 days) | Covers, descriptions and every book's lesson list | One free sample lesson per book: add it to My lessons, assign it, print it as a write-on workbook (Save as PDF) |
| Bought a book (any non-member) | Same as above | Every lesson in that book, and those lessons **stay assignable after the preview ends** |
| Preview ended, nothing bought | Covers and lesson lists | Can buy a book, or subscribe |

A book with no price is for members only. The owner sets each book's price on the Quest Books page.

## How a book works

- A book is a list of ordinary lessons. **Add to My lessons** copies them into the family's library, so assigning,
  the child lesson player, review, XP, evidence, printing and the Outcome Tracker work as they do for any lesson.
- Adding is repeatable: adding a book again only copies lessons the family doesn't have yet. Upload a bigger version of a
  book (same `id`, tick **Replace**) and families can add the new lessons. Their existing copies never change.
- Free-sample and bought-book lessons do not use the free preview's two lesson slots.
- Book files and covers are stored only in the private R2 bucket (`quest-books/v1/`), never in this public repository.

## Owner upload (Quest Books page, owner only)

1. **Upload book files**: one `.json` file per book (format below). Every lesson is checked before anything is saved;
   an error names the lesson that needs fixing. Tick **Replace existing books** to update a book.
2. **Add cover**: a portrait PNG (at least 600 × 800, roughly 3:4). Books without one show a designed cover.
3. **Price**: type a price in dollars and Save. Leave it empty to keep the book for members only.
4. **Remove**: takes the book off Quest Books. Families keep lessons they already added.

## Book file format

```json
{
  "id": "y3-mathematics",
  "year": 3,
  "subject": "mathematics",
  "title": "Number Navigators",
  "subtitle": "Year 3 Mathematics",
  "description": "A short description parents see on the book page.",
  "theme": "ocean",
  "sample_key": "u1-l1",
  "lessons": [
    {
      "key": "u1-l1",
      "unit": "Unit 1: Numbers to 10 000",
      "lesson": {
        "title": "Thousands in our town",
        "objectives": ["read, write and order numbers to 10 000"],
        "duration_minutes": 40,
        "introduction": "…",
        "sections": [{ "heading": "Place value", "body": "…" }],
        "worked_examples": [{ "title": "…", "problem": "…", "steps": ["…"], "answer": "…" }],
        "guided_practice": [{ "prompt": "…", "hint": "…", "answer": "…" }],
        "activities": [{ "title": "…", "instructions": "…", "tasks": [{ "prompt": "…", "answer": "…" }] }],
        "quiz": [{ "question": "…", "options": ["…", "…", "…"], "correct_index": 0, "explanation": "…" }],
        "key_words": [{ "word": "…", "meaning": "…" }],
        "outcome_codes": ["AC9M3N01"],
        "curriculum_refs": ["Australian Curriculum v9 Mathematics, Year 3, Number"],
        "answer_key": "…",
        "parent_notes": "…"
      }
    }
  ]
}
```

- `id`: lowercase letters, numbers and dashes. `year`: 0 (Foundation) to 10. `subject`: `mathematics`, `english`,
  `science`, `history` or `geography`. `theme` (designed-cover colours): `meadow`, `ocean`, `sunset`, `forest`,
  `twilight` or `desert`.
- `key`: unique within the book and never changed once families have the book (it's how re-adding avoids duplicates).
- `sample_key`: optional; the free sample lesson. Defaults to the first lesson.
- `lesson` uses the same fields as the parent Lesson Builder (`sanitizeLessonInput` in `worker/src/lessonBuilder.ts`).
  `title` and at least one teaching section `body` are the minimum. `outcome_codes` must be real codes; they are kept
  only when they're in the family's own curriculum catalogue (as for any lesson).
- Limits: 200 lessons per book, 8 MB per book file.

## Buying a book

`POST /api/quest-books/books/:id/checkout` opens Stripe Checkout (one-off payment, AUD) at the price stored with
the book. Only the signature-verified webhook (`checkout.session.completed` / `async_payment_succeeded`, mode
`payment`, `metadata.kind = quest_book`, `payment_status = paid`) records the purchase. The return page grants
nothing; it waits for the webhook. No new Stripe products or price IDs are needed.

## Release

Apply migration `0072_quest_book_purchases.sql` after a D1 backup (`docs/RELEASE.md`). The Worker also creates the
table itself if the migration hasn't run yet, so nothing breaks in between.
