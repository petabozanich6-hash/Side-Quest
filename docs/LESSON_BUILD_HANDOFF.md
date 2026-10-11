# Lesson build handoff (Stage 2)

Read this file first when the user says "continue" or "build the next lesson". Update it at the end of every work session (status, next steps, version number).

Last updated: 9 October 2026.

The code wins over this file. If they disagree, trust the code and fix this file.

## The standard

backend/lesson_library_s2_english_w09_l1.py is the approved benchmark. The parent says it is perfect. Never edit, rename, re-register or reformat it. Every other lesson is built or upgraded to match it.

Tools for matching it:
- docs/PROSE_STYLE.md: the prose rules, taken from W9 L1.
- docs/templates/lesson_template.py.txt: the fill-in skeleton. Copy it, replace every <<FILL>> marker. It is stored as .txt so the loader never imports it.
- tools/check_lesson.py: quality checker. Run as python tools/check_lesson.py backend/<file>.py. The assistant cannot run it, so say so in the report and give the parent the command. Thresholds are guesses tuned to W9 L1 and may need adjusting.

Copy build() argument order and helper signatures from the benchmark file, not from documents.

## Where we are

- Registered in backend/lesson_library.py LESSON_MODULES: W1 to W8 (32 lessons), W9 L1, W9 L2, W9 L3, W9 L4. Library version on main: 92.
- At standard: W9 L1 only.
- W9 L3 (Compound and complex sentences, key s2-eng-w09-l3-compound-complex-sentences): upgraded in place from the W9 L1 template at version 92 (commit 188232e). It has 8 steps, five SVG sentence diagrams drawn by _chain_svg, a compound or complex sort, a 900 word explicit_teaching guide and no video. Not yet checked: tools/check_lesson.py and python backend/lesson_library_s2_english_w09_l3.py have not been run, and the SVG box widths were estimated from character counts and never viewed. The pushed file was read back and matches. koalas climb and kangaroos hop are general knowledge to check, and the hat, rain and bag sentences are made up. Treat it as unaudited until the parent runs the checks.
- W9 L4 (Handwriting for labels and captions, key s2-eng-w09-l4-handwriting-labels-captions): built from the template and registered at version 91. Not yet checked: tools/check_lesson.py and python backend/lesson_library_s2_english_w09_l4.py have not been run, the pushed file was not read back, and its two videos (YouTube 7bzq1LFqS_A and uuhUOB5UxUI) are unwatched. EN2-HANDW-01 wording comes from nsw_outcomes.py, which calls itself plain language, so check it against NESA. No handwriting video attached, because the ones found were UK cursive. Treat it as unaudited until the parent runs the checks.
- Built but not yet audited: W1 L1 to W8 L4 and W9 L2. Quality unknown until read.
- Not built: Weeks 10 to 50 (placeholders only in backend/lesson_library_s2_english_placeholders.py). Source plan: docs/english_s2_scope_and_sequence.md. Week 10 starts with What makes a poem: rhyme and rhythm.
- Stage 2 Maths and other subjects: placeholder files exist, not read yet. Stage 4: S4_LIVE is empty.
- Leftover file to ask about before touching: lesson_library_s2_english_w01_l1_full.py. lesson_library_s2_english_w1_w2.py holds the build helpers and must stay.

## Front end (verified 9 October 2026, do not redo)

ChildLesson.jsx, QuestTeach.jsx and QuestVisual.jsx render step visuals (visual, visual_before), worked_visuals, inline SVG, guided_practice, line breaks, videos with prompt and check. Parent paragraphs that start Parent:, Parent note:, Parent check: or Grown-up: are hidden from the child. Known limits:
- The planner stage is labelled "Plan your work" unless the lesson sets LESSON["planner_title"] and LESSON["planner_intro"] after build(). Every lesson must set both.
- Each planner box needs at least 3 characters. Numeric answers need a hint such as "type the number sentence too".
- Pass mark is 0.9 from build(). Do not change it.

## Registration and keys

- Add a new module name to LESSON_MODULES and bump LESSON_LIBRARY_VERSION in backend/lesson_library.py in the same commit as the lesson. Without the bump the live database keeps the old copy. Upgrading an existing lesson needs the bump but no new registration.
- backend/lesson_library.py must be rewritten as a whole file. Read it in full the same turn and copy it exactly, changing only the new module line and the version number.
- Registration loads any module-level dict with a seed_key, and the first copy of a key wins. A lesson module should expose only its own lesson.
- Never change a seed_key once a lesson exists. A background cleanup deletes assignments for lessons whose ID disappears.
- New English lessons use a named key s2-eng-wNN-lN-<topic-words>. Never use the plain placeholder key.
- spelling_live.py replaces a lesson's spelling if its seed_key is in SPELLING_W1 or SPELLING_LIVE (only the W1 L1 key and older W1 keys), so check a new key is not in them.
- BUILT_OUT_WEEKS in the placeholders file only controls which placeholders its generator skips. Leave it alone.

## Working rules (the parent's standing instructions, 9 October 2026)

- Work autonomously. Do not ask questions, do not ask the parent to say "continue", do not wait for approval. Make reasonable decisions from the W9 L1 standard and report them.
- Push directly to main. No branch, no PR, no waiting for "merge". This replaces the old one-branch-one-PR rule.
- One lesson per run. Each run uses at most three tool-call turns: (1) one parallel batch of reads, (2) one push_files commit with the lesson, the registration and version bump, and the docs updates, (3) one read-back of the pushed lesson file to catch errors, then the report. Fix any error with a follow-up commit.
- The first batch must include every file that will be rewritten whole (lesson_library.py, this handoff, docs/LESSON_TRACKER.md). The previous run could not finish in one go because those reads were left for later. Paths: docs/LESSON_BUILD_HANDOFF.md and docs/LESSON_TRACKER.md. The repo is private, so raw URLs cannot be fetched; use the GitHub file tool.
- The file tool writes whole files, so read the whole file first. Never rewrite from memory.
- Do not claim a lesson is tested, deployed or working unless it was checked. The assistant cannot run code, watch videos or see pages. Give the parent: python tools/check_lesson.py backend/<file>.py and python backend/<file>.py.
- Lesson text for children: Australian spelling, plain language, no dashes as punctuation. Emoji step icons are fine (W9 L1 uses them). Never invent a video, source or fact.
- Videos: search for one or two suitable videos and attach them the way W9 L1 does. Real signature: _video(title, youtube_id, prompt, offline, (question, options, correct_index, explanation)). If none can be trusted, write "no video attached" in the docstring and the report. Videos are unwatched until the parent watches them.
- Label invented data as made up. Flag approximate facts for the parent to check.
- Novel weeks (21 to 25, 46, 47): write "your class novel", never a title.
- Reply format: commit link, slot built, version number, what the parent still needs to check, next lesson. Nothing else.

## NEXT STEPS (in order)

1. Upgrade W9 L2 in place to the benchmark (same file, same key, version bump). Read the current file first to get its key and topic.
2. Upgrade W1 to W8 in order, in place.
3. Build Weeks 10 to 50 from the placeholders WEEKS table, starting with W10 L1 (What makes a poem: rhyme and rhythm).
4. Then Stage 2 Maths, then other Stage 2 subjects. Read their scope docs and placeholder files first (not read yet).

Done: W9 L4 built and registered at version 91 (unchecked). W9 L3 upgraded in place at version 92 (unchecked, see Where we are).

The parent may reorder. Follow the latest instruction.

## Teaching standard (match W9 L1)

- Each teaching step: the rule, the reason, a worked example, a common mistake and its fix, then a check question. A visual wherever a picture teaches better than words. Follow docs/PROSE_STYLE.md for length and voice.
- Model walkthrough: I do, We do, You do, with worked visuals.
- Each lesson: 10-question quiz, 1 sort activity, 8 word challenges, 4 typed practice parts, a glossary of about 8 words, answer key, parent check, and the long parent-facing LESSON["explicit_teaching"] guide (about 8 paragraphs, at least 900 words).
- After build() set planner_title, planner_intro, spelling, spelling_focus, hoard_words, explicit_teaching.
- Use a continuing topic where it fits (Weeks 7 to 9 use Australian animals).

## Resume prompt

When the user says "continue" or "build the next lesson": read this file, then follow NEXT STEPS and the working rules above.

## Session note, 11 October 2026: the pipeline is now D1 migrations

This file and `docs/PROSE_STYLE.md` still describe a Python `backend/lesson_library_*.py`
pipeline. **That code is not in this repository.** There is no `backend/` directory and no
`lesson_library.py`; the only Python in the repo is `lesson-bank/tools/build_bank.py`. The
handoff rule says the code wins, so I built against the code that is actually here.

What the code actually does:

- Lessons live in the D1 `lessons` table. `worker/migrations/*.sql` seed them, and each row's
  `data` column holds the lesson JSON the frontend reads.
- A coming-soon row is a small `data` object with `coming_soon: true`. Building the lesson means
  `UPDATE lessons SET data = json_patch(data, '{...}')` and passing `"coming_soon": null` so the
  flag is removed. Migration 0042 (Week 1 Lesson 2) and 0043 (Week 1 Lesson 3) both do this.
- The frontend field names are the authority, not the old docs. Verified by reading
  `frontend/src/pages/child/ChildLesson.jsx` and `frontend/src/components/shared/QuestActivities.jsx`:
  `teach_steps[].visual` and `.visual_before` (inline SVG, alt, caption), `worked_visuals`,
  `quiz` and `word_challenges` (question, options, correct_index, explanation),
  `sort_activity` (instructions, buckets, items with text and answer), `interactive_activities`
  type `flip_cards` (title, cards with front and back), `spelling` (focus, teaching, words with
  word/parts/tip, check), `resources` type `video` (title, embed_url, prompt, check),
  `planner_fields` (key, label, hint), plus glossary, answer_key, parent_check, self_check,
  common_mistakes, evidence_instructions, offline_alternative and extension.
- Outcome wording must still be the NESA text. For Lesson 3 I took EN2-SPELL-01 and EN2-VOCAB-01
  verbatim from the English K-10 Syllabus (2022) outcomes page.

### Built in this session

- **Week 1 Lesson 3, Sounds and syllables** (`s2-eng-y3-w01-l3`), migration
  `0043_s2_y3_w01_l3_sounds_and_syllables.sql`. Eight teaching steps with ten original cartoon
  SVG scenes, guided practice A to D, a seven part main task, a ten question quiz, eight word
  challenges, a sort, eight spelling words with chunks and memory tips, a 933 word parent guide,
  and two videos (Scratch Garden 9S7DY2lgJlU, Nessy 8NYeMoz9pjI) that are **unwatched** and
  unchecked for embedding. Verified by applying every migration to SQLite, reading the row back,
  and checking all ten SVGs parse, carry reduced-motion guards and alt text, and use no clashing
  animation class names. **Not verified in a browser.**

### Lesson 4 built

- **Week 1 Lesson 4, Storytelling aloud and joined handwriting** (`s2-eng-y3-w01-l4`), migration
  `0044_s2_y3_w01_l4_storytelling_handwriting.sql`. Eight teaching steps with ten original cartoon
  SVG scenes (including handwriting guide lines and an animated joined "an"), guided practice A to D,
  a seven part main task that is part spoken and part written, a ten question quiz, eight word
  challenges, a sort, the week's eight spelling words written in joined letters, a 938 word parent
  guide, and two videos (Oxford Owl F8k93ylkBPA on storytelling, Mr Hicks UK bk8vgQXO82Y on joined
  handwriting) that are **unwatched**, and the handwriting video uses UK letter formation.
- Outcomes EN2-OLC-01 and EN2-HANDW-01, wording taken verbatim from the NESA English K-10 (2022)
  outcomes page.
- Week 1 is now complete: all four lessons exist. Tracked upstream in
  `docs/LESSON_TRACKER.md`, which still needs updating.

### Known gaps to fix later

- Lesson 2 (`s2-eng-y3-w01-l2`) has no `answer_key`, `parent_check` or `self_check` field, because it
  was built before the frontend field list was checked properly. Lessons 3 and 4 have all three.
  A short follow-up migration could add them.
- Nothing built so far has been rendered in a browser or in the signed-in child flow. The visuals were
  verified by rasterising static frames only.

### Still open

- Week 1 Lesson 4 (Storytelling aloud and joined handwriting) is the next placeholder in the week.
- The queue order in `docs/lesson-build-queue.md` is still unconfirmed by the parent.
