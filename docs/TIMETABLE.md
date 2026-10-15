# Weekly timetable (Family Membership)

Parents plan **one week at a time**. Each block is a **slot** for a subject (calendar entry with `event_type = 'timetable'`).
Assigning a lesson fills the child's **next free slot of the lesson's subject**, so the calendar, the child's
"Today's quests" and Auto-Quest all follow the same timetable.

## For parents
- Calendar → **Weekly timetable** → **Generate this week** (from the family's curriculum, each child's level and the
  chosen learning days) or **Repeat last week** (copies the week before) → adjust → **Save this week's timetable**.
- Assign a lesson (from My lessons, the lesson builder, review, drafts or the calendar). **When** options:
  - *Next free <subject> slot* (default; "Sessions" fills several slots). If there is no free slot of that subject,
    it goes on the chosen day instead and the parent is told.
  - *Choose a timetable slot* (one child): any free slot, matching subjects first.
  - *Choose the day(s) myself* (the previous behaviour), or *Don't schedule yet*.
- The calendar shows "Mathematics · Place value" for a filled slot and "Mathematics (free)" (faded) for a free one.
- Cancelling or moving an assignment **empties** its slot; the timetable is never deleted by assigning.

## Free preview and lapsed plans
No timetable: the generator shows the membership message and the assign window keeps the day-picker. Enforced on the
server (`entitlements.timetable`; `/api/timetable/*` and `/api/assignments/:id/place` return 402 `UPGRADE_REQUIRED`).

## Technical
- `worker/src/timetable.ts`: `saveWeek`, `listSlots`, `placeAssignment`, `emptySlotsFor`, `sameSubject` (exact name or
  same learning area via `normArea`). Filling is conditional (`linked_assignment_id IS NULL`), so a slot is never
  double-booked.
- No schema change. Entries from the older one-week generator (`event_type = 'lesson'`, notes "Suggested by
  Side-Quest…") are treated as slots without being rewritten.
- Tests: `worker/test/timetable.test.mjs`, `worker/test/e2e/timetable.mjs`.
