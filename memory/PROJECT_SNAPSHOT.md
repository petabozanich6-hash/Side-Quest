# Side Quest Learning - Project Snapshot

Last updated: 7 Oct 2026. This is the current plan. memory/PRD.md is the original build record and is partly out of date (it still mentions AI lesson generation, which has been removed).

## Hosting and data
- Frontend and backend are deployed on Render from GitHub (main branch, auto-deploy).
- Database: MongoDB (decision: keep using it, and move away from Emergent).
- File uploads: PRD.md says Emergent Object Storage. TO CHECK: confirm what the live backend uses for /files/upload, and move uploads off Emergent if needed.
- Backup: download this file and keep a copy in OneDrive.

## Scope and priorities
- Build Stage 2 (Year 3) and Stage 4 (Year 7) first, across ALL subjects. Other stages later.
- Every lesson must meet NESA requirements. Lessons can cover multiple outcomes.

## Lesson design rules
- Explicit teaching that builds from the basics.
- Step-by-step cards: child clicks "Accept my mission" to reveal the next task; the next card appears only after the previous is complete.
- Embedded videos from reliable sources (e.g. Khan Academy) with clear instructions.
- Sorting activities randomise item order.
- Key vocabulary is interactive (click to reveal meaning).
- Robust quizzes. PASS MARK = 90%.
- Reduce game-based activities, especially Stage 2.
- Pet is a learning companion giving non-AI, reliable help when stuck.
- No reflection prompt (decision from earlier).
- Document writer: built into the app (TipTap), ONLY on lessons that need written documents (lesson flag). Saved automatically as lesson evidence; reopened for editing when a lesson is returned.

## Calendar and assigning
- Each child's calendar is isolated; children cannot see other children's items.
- Child view opens on the current day, with a full calendar option.
- Assigned dates guide the schedule but do not block working ahead or on another day.
- Assign button on the Lessons page opens Assign and schedule (children, dates, repeat weekdays).
- Parent Add event: default is one entry per child; linking a lesson creates the assignment.
- DONE (Oct 2026): child calendar status from real assignments; parent calendar per-child events; Lessons assign opens scheduler.

## Planned, not yet built
1. Returned lessons: when a lesson is given back, later lessons in that child's sequence move back until the redo is due. Needs a due date on returned lessons (default 3 school days if none set). Skip weekends/holidays. Needs backend changes.
2. Completion reward: when a lesson is accepted, child sees a congratulations screen and picks 1 of 3 mystery boxes holding a placeholder pet item. Prize chosen server-side at acceptance (no reroll by refreshing). Pet customisation comes later.
3. Achievement wall: private room per child showing certificates. NOT printable or downloadable. Parents can view each child's wall. Stored server-side.
4. Document writer (see lesson design rules).
5. Tools page for children: new-tab links to Word, Excel (Microsoft family account) and Google Docs/Sheets, plus an Add link evidence option. Word/Excel cannot be embedded (blocked by Microsoft); Google Docs can be embedded view-only. Evidence: child uploads the downloaded file or pastes a share link.

## Known gaps
- Backend does not verify a child ID belongs to the family when creating calendar events.
- Backend still sends parent-review events to child calendars (child page hides them).
- Older family-wide events (no child attached) are hidden from children.
- Only part of backend/server.py has been readable in chat; backend edits need the rest of the file.
