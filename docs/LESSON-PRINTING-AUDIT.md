# Lesson printing audit and acceptance checklist

## Goal

Every assignable lesson should be usable as a student paper workbook, and parents should have a teaching/answer pack. Paper work is returned to a parent or uploaded as a photo/PDF to the existing evidence flow. Printing must remain optional.

## Lesson pathways inspected

| Pathway | Student workbook | Parent guide | Access |
| --- | --- | --- | --- |
| Original curated library lesson | Paper renderer includes teach steps, checks, spelling, sorting, vocabulary, planning, quiz and offline alternative | Parent view includes marking guide, model answers, notes and outcomes | Child quest (top and at hand-in) and parent lesson detail |
| Parent-written / AI-created lesson | Existing dedicated printable document, plus new child-side printable workbook | Existing printable parent copy via review/print route | Parent review -> Printable version; child lesson player -> Print student workbook |
| Printable resource attachment | Included in original library print packet; included in parent-created print document | Parent copy has instructional material | Print with lesson |
| Lessons completed on paper | Works without typing through the app | Parent reviews photographed or scanned pages | Existing assignment uploads and evidence review |

## Changes on this branch

- Existing `/print/lesson/:id` parent-protected print page is preserved, including the switch between student and parent editions. No parental answer key is made available through a child route.
- Original library print output now renders paper activities from flip cards, sorting groups, word choices, fill-in sentence templates, planners, spelling checks, reading sheets, video prompts, teaching-step checks and the end-of-lesson quiz. It includes suitable space to write.
- Parent lessons have print controls from their library detail page for both editions; a child accessing a library quest sees a print button at the start, not only at the hand-in screen.
- Newer parent-created lessons have a child-side print button, even on the step-by-step player, and can print without navigating into parent routes.
- Teaching guides and suggested answers are separated by default; student copies do not include parent notes, curriculum reports, marking guides or answer keys.
- Videos are indicated as online-only. The print pack includes the lesson's written offline alternative where provided; videos and links themselves cannot be made fully offline just by printing.
- Printable SVG illustrations are sanitised to exclude scripts, event attributes and external resources before being inserted in the print document.

## Automated regression tests

`frontend/src/components/shared/lessonPrint.test.js` checks both lesson formats, student key isolation, parent answer presence, escaping of lesson-supplied text, missing optional fields, and paper activities. Browser end-to-end coverage already checks the dedicated printable worksheet route.

## Browser acceptance steps — still required before calling every lesson guaranteed

1. Print an original library lesson with every interaction type on A4 from Chrome, Safari and the installed PWA. Check page breaks and diagram legibility.
2. On a child account, check the print button at the top of both older and newer lessons. Ensure only the student edition is shown, and no parent key can be reached.
3. From parent review, open Printable version; check student worksheet and parent answer copy, including curriculum data where applicable.
4. Print a library parent guide from lesson detail; check the lesson outcomes and all marking guidance are included.
5. Try an AI lesson with no quiz, a mathematics lesson with diagrams, an English reading passage, and a printable resource appendix.
6. In a disconnected PWA, use a previously cached parent-created assignment and check printing works in the browser's popup permissions model.
7. Photograph completed pages and send them through the child's evidence/submission flow, then confirm they land in the parent's review/portfolio.

## Remaining limitations

- Printing cannot reproduce playable videos, speech playback, drag-and-drop behaviour, or automatic scoring. The paper equivalents require human assessment.
- A lesson that relies on an external resource without sufficient written directions may still need parental adaptation. Do not claim every curriculum item is genuinely offline until the content itself has been audited.
- This audit is code inspection and regression tests; it does not constitute a successful cross-browser print QA or a live production deployment.
