# Lesson build handoff (Stage 2)

Read this file first when the user says "continue building the lessons". Update it at the end of every work session (status table, next steps, version number).

Last updated: 9 October 2026.

The code wins over this file. If they disagree, trust the code and fix this file.

## The standard

backend/lesson_library_s2_english_w09_l1.py is the approved benchmark. The parent says it is perfect. Never edit, rename, re-register or reformat it. Every other lesson is built or upgraded to match it. Earlier versions of this file named W9 L2 as the model: that is withdrawn.

Copy the build() argument order and the helper signatures from the benchmark file itself. Do not trust any argument list written in a document, including older copies of this one.

## Where we are

- Subject and stage: Stage 2 English, 50 weeks, 4 lessons a week (200 lessons). Placeholders (not registered) hold the plan for every slot: backend/lesson_library_s2_english_placeholders.py. Source plan: docs/english_s2_scope_and_sequence.md.
- Registered in backend/lesson_library.py LESSON_MODULES: W1 to W8 (32 lessons), W9 L1 and W9 L2. Library version on main: 88.
- At standard: W9 L1 only.
- Built but not yet audited against the standard: W1 L1 to W8 L4 and W9 L2. Quality unknown. Do not call them good or bad until read.
- Not built: W9 L3, W9 L4, and Weeks 10 to 50 (placeholders only).
- Stage 2 Maths, other Stage 2 subjects: placeholder files exist (lesson_library_s2_maths_placeholders.py, lesson_library_s2_other_placeholders.py). Not read yet. Stage 4: S4_LIVE is empty, nothing live.
- Leftover file to ask about before touching: lesson_library_s2_english_w01_l1_full.py. lesson_library_s2_english_w1_w2.py holds the build helpers and must stay.

## Front end (verified 9 October 2026, do not redo)

ChildLesson.jsx, QuestTeach.jsx and QuestVisual.jsx render step visuals (visual, visual_before), worked_visuals, inline SVG, guided_practice, line breaks, videos with prompt and check. Parent paragraphs that start Parent:, Parent note:, Parent check: or Grown-up: are hidden from the child. Known limits:
- The planner stage is labelled "Plan your work" unless the lesson sets LESSON["planner_title"] and LESSON["planner_intro"] after build(). Every lesson must set both.
- Each planner box needs at least 3 characters. Numeric answers need a hint such as "type the number sentence too".
- Print view omits teach step visuals. Ignored.
- Pass mark is 0.9 from build(). Do not change it.

## Registration and keys

- Add a new module to LESSON_MODULES and bump LESSON_LIBRARY_VERSION in the same PR. Without the bump the live database keeps the old copy. Upgrading an existing lesson needs the bump but no new registration.
- Registration loads any module-level dict with a seed_key, and the first copy of a key wins. A lesson module should expose only its own lesson.
- Never change a seed_key once a lesson exists. A background cleanup deletes assignments for lessons whose ID disappears.
- New English lessons use a named key s2-eng-wNN-lN-<topic-words>. Never use the plain placeholder key.
- Spelling is set inside the lesson after build(). spelling_live.py replaces a lesson's spelling if its seed_key is in SPELLING_W1 or SPELLING_LIVE (only W1 L1 key and the older W1 keys), so check a new key is not in them.
- BUILT_OUT_WEEKS in the placeholders file only controls which placeholders its generator skips. Leave it alone.

## NEXT STEPS (in order)

1. Merge the docs PR for this branch (docs only, W9 L1 not touched).
2. Upgrade W9 L2 in place (same file, same key), then build W9 L3 and W9 L4 (new modules).
3. Upgrade W1 to W8 in order, in place.
4. Build Weeks 10 to 50 from the placeholders WEEKS table.
5. Then Stage 2 Maths, then other Stage 2 subjects. Read the scope docs and placeholder files first (not read yet).

The parent may reorder. Follow the latest instruction.

## Teaching standard (match W9 L1)

- Each teaching step: the rule, the reason, a worked example, a common mistake and its fix, then a check question. A visual wherever a picture teaches better than words.
- Model walkthrough: I do, We do, You do, with worked visuals.
- Each lesson: 10-question quiz, 1 sort activity, 8 word challenges, 4 typed practice parts, a glossary of about 8 words, answer key, parent check, parent-facing explicit_teaching text.
- After build() set planner_title, planner_intro, spelling, spelling_focus, hoard_words.
- Use a continuing topic where it fits (Weeks 7 to 9 use Australian animals). Label invented data as made up. Flag approximate facts.
- Videos: only attach one that was found and checked from its title and description, and tell the parent to watch it first. Real signature: _video(title, youtube_id, prompt, offline, (question, options, correct_index, explanation)). W9 L1 videos vdyiupgsplI and iCnh6EL1Lmo are unwatched.
- Novel weeks (21 to 25, 46, 47): write "your class novel", never a title.

## Working rules

- One branch and one PR per lesson. Never push to main. Read the commit diff after every write. Wait for the parent to say "merge". Merge one PR at a time so version bumps do not conflict.
- The file tool writes whole files, so read the whole file first. Never rewrite from memory.
- Tool calls are limited each turn: read, write, diff, PR.
- Do not claim a lesson is tested, deployed or working unless it was checked. The assistant cannot run code, watch videos or see pages. Give the parent the command python backend/<file>.py and say what to check on the live page.
- Lesson text for children: Australian spelling, plain language, no emoji, no dashes as punctuation. Never invent a video, source or fact.
- Reply format: what was done and which slot, what is inside, what the parent still needs to check, the next lesson.

## Resume prompt

When the user says "continue building the lessons" or "continue": read this file, check LESSON_LIBRARY_VERSION in backend/lesson_library.py against the version above, then start at NEXT STEPS.
