# Prose style guide for Side Quest lessons

Standard: `backend/lesson_library_s2_english_w09_l1.py` (W9 L1). It is approved. Match it. Never edit it.

## Voice
- Teaching steps speak to the child as "you", in plain, warm language. The `EXPLICIT_TEACHING` guide speaks to the parent.
- Short sentences mixed with a few longer ones. Reading level: a confident Year 3 to 4 reader.
- Define every new term in plain words the first time it appears, then use it consistently.
- Reports use the timeless present tense. Do not use em dashes anywhere.
- No game language (points, levels, battles). Purposeful interactions only.

## Teaching steps (8 to 9 per lesson)
Each step is flowing prose of 3 paragraphs separated by a blank line, not bullets. Write the paragraphs in this order:
1. Hook or picture-it opener, then the plain definition. Example from W9 L1: asking the child to describe an echidna with words only, then showing the diagram.
2. How it works or the routine to follow, in the order the child will do it. Use a concrete habit (follow the label line to its dot).
3. Why it matters, or how to check the work.

Then the step's other parts: a worked example using the lesson's topic facts, a one-line key idea, and one check question with a one-line explanation.
- Aim for about 150 to 250 words of prose per step.
- Use the same topic (for Weeks 7 to 9, Australian animals) so facts stay consistent.
- The last step is always the spelling focus, with a story or reason for the spelling pattern and a silly-voice or similar memory method.

## I do / We do / You do
- I do: think aloud, step by step, using the real visuals. First person.
- We do: ask short questions, then give the answer, so the child can follow along.
- You do: hand over to the main task and show the finished MODEL.

## EXPLICIT_TEACHING parent guide (about 8 paragraphs)
In this order, each paragraph opening with a bold-style lead phrase:
The big idea; How to open the lesson (a question, not a definition); one paragraph for each major skill (what to teach, the routine, the common error); Putting skills together; The spelling work (include the story); What to watch for and how to fix it (and the suggested pacing, for example two sittings). Write full paragraphs, 90 to 160 words each. Total at least 900 words.

## Practice and assessment
- Guided practice: 3 to 4 lettered parts that build from easy to hard, ending with the spelling blanks.
- Main task: 6 to 7 numbered parts. At least one part is on paper (drawing, ruler, survey). Last part is spelling sentences.
- Quiz: exactly 10 questions, 4 options each, each with a one-line explanation. Vary where the correct answer sits.
- Word challenges: exactly 8 (4 vocabulary, 4 spelling).
- Sort: 8 items across 2 categories, 4 each.
- Answer key and parent_check: specific answers, plus what to accept.

## Visuals
- Every visual is real SVG drawn by a helper function. No placeholders.
- Each has alt text describing exactly what is drawn, and a one-sentence caption.
- Every teaching step that refers to a picture must attach that picture.
- Text must fit its box. Check label widths against rectangle widths.

## Videos
- Search for one or two suitable videos. Include each with a check question, as W9 L1 does.
- If none can be trusted, write "no video attached" in the docstring and the report. Never invent a video id.

## Facts
- Use only everyday-level facts. List them in the docstring and tell the parent to check any the child reuses.
- Outcome wording must be the official NESA text from `backend/nsw_outcomes.py`.
