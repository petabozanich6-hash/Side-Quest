# Lesson build handoff (Stage 2 English)

Read this file first when the user says "continue building the lessons". Then carry on from NEXT STEPS. Update this file at the end of each work session (change the status table, the next steps and the version number).

Last updated: 9 October 2026.

## Where we are

- Subject and stage: Stage 2 English, 50 weeks, 4 lessons a week (200 lessons).
- Source plan: docs/english_s2_scope_and_sequence.md and backend/lesson_library_s2_english_placeholders.py. The WEEKS table in the placeholders file gives each week's four topics and its spelling focus.
- Built and registered: Weeks 1 to 8 (all 32 lessons), plus Week 9 Lessons 1 and 2.
- Library version in backend/lesson_library.py: 84 (registration commit 4f79343).
- Not yet checked: the deploy log after the last two registrations. Look for a "Lesson module ... not loaded" warning for any of W8 L3, W8 L4, W9 L1, W9 L2. W9 L1 and L2 import _sort, _wc and _video from lesson_library_s2_english_w1_w2, and those names were not confirmed to exist.

## Week 9 status (Information reports; spelling: silent letters kn, wr, mb, gn)

| Lesson | Topic | File | Status |
|---|---|---|---|
| L1 | Diagrams, graphs and captions (reading, EN2-RECOM-01) | lesson_library_s2_english_w09_l1.py | Written and registered. Teaching is thinner than the new standard, so it should be rewritten. Spelling words: knee, knock, wrist, wrap, climb, gnat. No video. |
| L2 | Report with visuals (writing, EN2-CWT-02) | lesson_library_s2_english_w09_l2.py | Written and registered. This is the model for the new teaching standard. Spelling words: knot, know, write, wrong, thumb, sign. No video. |
| L3 | Compound and complex sentences (language, EN2-VOCAB-01) | not started | NEXT |
| L4 | Handwriting for labels and captions (oral language and handwriting, EN2-OLC-01 and EN2-HANDW-01) | not started | After L3 |

After each lesson: register the module in LESSON_MODULES in backend/lesson_library.py and bump LESSON_LIBRARY_VERSION. Registering two lessons in one edit is fine.

## NEXT STEPS (in order)

1. Write W9 L3, Compound and Complex Sentences, to the teaching standard below. Spelling focus is the same for the week (silent letters kn, wr, mb, gn), with six new words that are not used in W9 L1 or L2.
2. Write W9 L4, Handwriting for Labels and Captions. Make the handwriting task offline, with a typed reflection and a parent check, because a child cannot type handwriting.
3. Rewrite W9 L1 to the L2 teaching pattern (keep the same seed key and file name, bump the version).
4. Register W9 L3 and L4.
5. Offer to upgrade W8 L1 to L4 and W7 and earlier to the same standard. Ask the user before starting, because it is a big job.
6. Then move to Week 10: Synthesising two texts; Edit and publish the report; Punctuation review: commas and apostrophes; Present the report (Fortnight 5 mini exam). Spelling: Review of Weeks 6 to 9. Week 10 is a digital week (EN2-HANDW-02 applies).

## Teaching standard the user asked for (apply to every lesson)

The user wants a high quality, comprehensive learning site, so every lesson needs explicit teaching of a high standard.

- Each teaching step gives: the rule, the reason (why it matters), a worked example, a common mistake and its fix, then a check question.
- The model walkthrough uses I do, We do, You do.
- The main task has numbered stages and written success criteria, and the parent note says how to check them.
- Each lesson has a 10-question quiz, a sort activity, 8 word challenges, 4 practice parts, a glossary of about 8 words, and an answer key.
- Use a continuing topic where sensible (Weeks 7 to 9 use Australian animals: echidna in W7 and W8 and in W9 L1, koala in W9 L2).
- Invented data (a made-up class survey) must be labelled as made up. Approximate facts must be labelled approximate and flagged to the parent to check.
- Videos: only attach a video that has been found and checked. If none was verified, attach none and say so in the file docstring and in the reply.

## How lesson files are built

- File name: backend/lesson_library_s2_english_wNN_lN.py, for example lesson_library_s2_english_w09_l3.py.
- Imports used in W9: from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video; from spelling_s2_w1 import _w, _c.
- build(seed_key, title, summary, topic, outcome_codes, outcome_notes, learning_intention, success_criteria, vocab, materials, prior_knowledge, teaching_text, steps, model_text, practice_text, main_task_text, reflection_prompt, self_check, quiz, quiz_instructions, extension, glossary, videos, sort_activity, word_challenges, practice_fields, common_mistakes, follow_up, answer_key). Copy the exact argument order from lesson_library_s2_english_w09_l2.py, which is the newest working example.
- A teaching step is _step(number, title, text, example, key_idea, (check question, options, correct index, explanation)).
- The spelling block is set after build: LESSON["spelling"] with focus, teaching, words made with _w(...) and check questions made with _c(...); also LESSON["spelling_focus"] and LESSON["hoard_words"].
- Quiz correct answers should be spread across positions (not all the same index). Check this on every lesson.
- Outcome codes come from the placeholders file (_codes_for). Outcome wording is the official NESA text with a short note on the lesson's focus.
- The placeholders file backend/lesson_library_s2_english_placeholders.py is not registered. Its BUILT_OUT_WEEKS set only needs updating if the placeholders are ever registered. Weeks are currently built with their own named seed keys.

## Working rules from this project

- Tool calls are limited each turn, so split work: read first, then write, then register.
- Do not claim a lesson is tested or deployed unless it has been checked. Say what was and was not verified.
- Never invent a video or a source.
- Lesson text for children: Australian spelling, plain language, no emoji.
- Reply format: say what was done first, then what is inside the lesson, then what still needs checking, then the next step.

## Resume prompt

When the user says "continue building the lessons" or "continue": read this file, check the library version in backend/lesson_library.py matches the version above, then start at NEXT STEPS item 1 unless this file has been updated since.
