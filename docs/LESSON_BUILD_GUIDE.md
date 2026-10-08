# Lesson Build Guide

How to build a lesson to the same standard as **Stage 2 English, Week 1 Lesson 1: Reading with Expression**.

The reference lesson is `backend/lesson_library_s2_english_w01_l1.py`. When in doubt, open it and copy its shape.

This file is written for anyone building lessons: a person, or an AI assistant that has been asked to "build the next lesson using docs/LESSON_BUILD_GUIDE.md".

---

## 1. The golden rules

1. **One lesson = one Python module, one `seed_key`.** Everything about the lesson lives in one file.
2. **Everything a child writes is typed inside the lesson.** No notebook is needed. Use practice boxes.
3. **Teach before you ask.** Every concept is explained in plain language, with a worked example, before a question is asked about it.
4. **Understand first, then do.** The lesson follows: Learn it, See it done, Try it, Prove it.
5. **Build on the `lesson-build` branch, merge once.** Render only deploys `main`, so nothing goes live until the branch is merged.
6. **Never use a seed_key twice.** Spelling and the Word Hoard are attached by `seed_key`, so a wrong key silently shows nothing.
7. **Build whole weeks.** The placeholder generator skips a whole week at a time (see section 9), so a built week needs all four lessons.

---

## 2. Files involved

| File | What it does |
|---|---|
| `backend/lesson_library_s2_english_wXX_lY.py` | The lesson itself (one file per lesson) |
| `backend/lesson_library_s2_english_w1_w2.py` | Contains `build()` and the helpers `_q`, `_step`, `_sort`, `_wc`, `_video`, `_article` |
| `backend/lesson_library.py` | Holds `LESSON_LIBRARY_VERSION` and the `LESSON_MODULES` list that registers lesson files |
| `backend/spelling_live.py` | The spelling words for each lesson, keyed by `seed_key` |
| `backend/lesson_library_s2_english_placeholders.py` | Generates 200 placeholder lessons; skips weeks listed in `BUILT_OUT_WEEKS` |
| `docs/english_s2_scope_and_sequence.md` | What each week and lesson should cover |
| `frontend/src/components/shared/SpellingSegment.jsx` | The See it, Hear it, Spell it, Type it spelling stage |
| `frontend/src/lib/speak.js` | The voice used to read words aloud |

---

## 3. Naming

- **Module file:** `lesson_library_s2_english_w01_l1.py` (week and lesson numbers, two digits for the week).
- **seed_key:** `s2-eng-w01-l1-reading-expression` (stage, subject, week, lesson, short topic name). The placeholder for the same slot is `s2-eng-w01-l1`, so a built lesson always has a topic suffix and never collides with its placeholder.
- **Lesson variable:** call it `LESSON`. The loader finds any dict with a `seed_key`, but `LESSON` keeps it clear.

---

## 4. The lesson anatomy

Each lesson is one `build(...)` call. The arguments are positional and go in exactly this order (confirmed against both the reference lesson and the placeholder generator):

| # | Part | What to write |
|---|---|---|
| 1 | `seed_key` | Unique key, never reused |
| 2 | Title | For example "Week 1, Lesson 1: Reading with Expression" style, or the short title the reference uses |
| 3 | Hook | 1 to 2 sentences that make a child want to start |
| 4 | Strand | For example "Reading: fluency and comprehension" |
| 5 | Outcome codes | List of NSW outcome codes (see `OUTCOMES` in the placeholders file) |
| 6 | Outcome notes | Dict of code to one line saying how this lesson meets it |
| 7 | Learning intention | "We are learning to..." |
| 8 | Success criteria | List of 5 to 6 "I can..." statements |
| 9 | Key vocabulary | List of single lowercase words |
| 10 | Materials | Keep it short. "This lesson (everything you need is inside it)" is ideal |
| 11 | Prior knowledge | One sentence on what a child should already know |
| 12 | Teaching text | The long explicit teaching (section 5) |
| 13 | Steps | List of 6 to 8 `_step(...)` (section 6) |
| 14 | Worked example | A full example done start to finish |
| 15 | Guided practice | Parts A, B, C, D that the child types into practice boxes |
| 16 | Main task | A passage or scenario, in numbered stages |
| 17 | Reflection question | One open question |
| 18 | Self check | One sentence listing everything the child should have done |
| 19 | Quiz | List of 10 `_q(...)` |
| 20 | Submission note | Tells the child what to submit |
| 21 | Extension | One challenge for children who finish early |
| 22 | Glossary | List of `(word, simple meaning)` pairs |
| 23 | Resources | List of `_video(...)` and `_article(...)` |
| 24 | Sorting activity | One `_sort(...)` |
| 25 | Word challenges | List of about 8 `_wc(...)` |
| 26 | Practice boxes | List of dicts with `key`, `label`, `hint` |
| 27 | Common mistakes | List of 4 to 5 |
| 28 | Extra activities | List of 2 |
| 29 | Answer key | For the parent, covering every Part, with accepted alternatives |

Keep the practice box `key` values short and unique within the lesson (`partA`, `partB`, `explain`).

### Fields the placeholder generator sets after `build()`

The placeholders also set these on the lesson dict. Check whether `build()` already sets them for a real lesson, and copy the placeholder's values if not:

```python
lesson["learning_area"] = "English"
lesson["reflection_prompts"] = []
lesson["interactive_activities"] = []
lesson["hoard_words"] = []          # filled from the master word list
lesson["spelling_focus"] = "..."     # the week's spelling focus
```

Leave `is_placeholder` unset (or False) on built lessons.

---

## 5. Writing the teaching text

The reference lesson's teaching text is long on purpose. It is split into paragraphs, and each paragraph opens with a short label. Follow this pattern:

1. **Why this matters.** Connect the skill to something real.
2. **The parts or rules.** Define each part in plain words, with one example each.
3. **Where the clues come from.** Show a child how to work something out, not just what the answer is.
4. **The routine.** Give a numbered, repeatable way to do the task.
5. **A link to another skill.** For example, how reading and spelling share the same skills.
6. **A quick demonstration.** Do one small example out loud, then point out the reasoning.

Writing rules:

- Plain language, short sentences, Australian spelling (colour, practise as a verb).
- Define every key term the first time it appears.
- Give an example straight after every rule.
- Explain *why*, not only *what*.
- Do not use dashes as punctuation. Use commas, full stops or colons.

### Novel weeks

Weeks 21 to 25, 46 and 47 are novel weeks. Never name a title. Write "your class novel" and make every example and task work with any Stage 2 novel the parent allocates. Use short template prompts such as "Find a sentence in your class novel that shows how the main character feels". Practice boxes carry the child's own examples.

---

## 6. Writing a step

Each step is `_step(number, title, explanation, example, key idea, check question)`.

```python
_step(
    "3", "Pace: when to go fast, when to go slow",
    "Explanation in two short paragraphs.",
    "An example the child can try straight away.",
    "One sentence the child should remember.",
    ("Check question?", ["Right answer", "Wrong", "Wrong"], 0, "Why the right answer is right."),
)
```

- The check question is a tuple: question, list of choices, index of the right answer (starting at 0), and the explanation shown afterwards.
- Put the right answer in different positions across steps. Do not always make it the first one.
- Each step teaches one idea only.
- The placeholders use Step 6 for spelling. Keep that: step 6 states the week's spelling focus and previews the six words.

---

## 7. Spelling, the Word Hoard and the see, hear, spell, type flow

Spelling is added in `backend/spelling_live.py`, **not** inside the lesson file.

```python
SPELLING_LIVE = {
    "s2-eng-w01-l1-reading-expression": {          # must equal the lesson's seed_key exactly
        "focus": "Sounds and syllables",
        "teaching": "Two short paragraphs explaining the spelling strategy.",
        "words": [
            _w("wonderful", "won-der-ful", "memory tip for the tricky part"),
        ],
        "check": [
            _c("Question?", ["A", "B", "C"], 1, "Explanation."),
        ],
    },
}
```

Rules:

- Use 6 words per lesson. Choose words that appear in the lesson text or fit the week's spelling focus.
- Each word needs: the word, syllable or chunk breaks with hyphens, and a one-line memory tip about the tricky part.
- Keep the spelling `focus` the same as the week's spelling focus in the scope and sequence.
- **The key must match the lesson `seed_key` exactly.** A mismatch means no spelling stage appears and nothing reaches the Word Hoard.
- The spelling words are added to the Word Hoard automatically when the lesson opens. A word is mastered after 10 correct tries in a row, with a limit of 2 counted tries per word per day.
- Each word goes through four steps: **See it**, **Hear it**, **Spell it** (say the letters out loud), **Type it** (word hidden, typed from memory). This is built into `SpellingSegment.jsx`, so no extra work is needed per lesson.
- Spelling focuses repeat (Homophones 2 to 5, review weeks, revision weeks). Use the master word list so a word is introduced once, in the week it first appears, and revision weeks draw from earlier words.

---

## 8. Registering the lesson and deploying

Work on the `lesson-build` branch. Nothing is deployed until it is merged into `main`.

For each week you build:

1. Write the four lesson modules (L1 to L4) for the week.
2. Add the module names to `LESSON_MODULES` in `backend/lesson_library.py`, **before** the placeholder modules.
3. Add the week number to `BUILT_OUT_WEEKS` in `backend/lesson_library_s2_english_placeholders.py` so the placeholders for that week stop being generated.
4. Add the six-word spelling entries for each lesson in `backend/spelling_live.py`.

Once, at the very end:

5. **Bump `LESSON_LIBRARY_VERSION`** in `backend/lesson_library.py` by one. Without this the live database keeps the old copy.
6. Open a pull request from `lesson-build` into `main`, check the diff, then merge. Render redeploys automatically.
7. Wait for the backend deploy to say **Live**. After a version bump the free plan can take about 10 minutes or more, and the new backend may log "No open ports detected" until the lessons finish loading. A very large library may take longer.
8. Hard refresh the site (Ctrl+Shift+R, or Cmd+Shift+R on a Mac).
9. In the backend logs, look for `Lesson module ... added N lessons` and `Spelling segment attached to N lessons`.

Why lesson changes need a deploy: lesson content lives in Python files, not in the database editor. Building on a branch and merging once keeps it to a single deploy.

---

## 9. Placeholders and duplicates

The placeholder module generates 200 lessons from one table. It skips every week listed in `BUILT_OUT_WEEKS`, and it skips the **whole** week, all four lessons.

- A built lesson has its own `seed_key` (with a topic suffix), so it does not replace the placeholder for its slot. Until the week is added to `BUILT_OUT_WEEKS`, you will see both. This is why Week 1 currently shows two Week 1 lessons.
- When you add a week to `BUILT_OUT_WEEKS`, make sure all four lessons of that week are built and registered, otherwise the week will have missing slots.
- The placeholder module's self-check (`python lesson_library_s2_english_placeholders.py`) asserts exactly 200 lessons, so it will fail once weeks are built out. That is expected. Update or remove that assertion in the same commit.

---

## 10. Videos and links

- Use only videos you have checked. Re-check every video ID and article link before release, as videos get removed.
- Child safe, ad light, read-aloud or explainer style, under about 5 minutes.
- At least one embedded YouTube video per lesson, plus a card for one BBC Bitesize or Khan Academy link if it embeds. No NSW Department of Education pages.
- Every video needs a **watch-for note**, a **do-after task** and a **check question**: `_video(title, id, watch_for, do_after, check_question)`.

---

## 11. Before you commit: checklist

- [ ] `seed_key` is unique and follows the naming pattern
- [ ] Outcome codes exist in the `OUTCOMES` table, and one is clearly primary
- [ ] Learning intention and 5 to 6 success criteria written
- [ ] Teaching text has all six parts (section 5)
- [ ] 6 to 8 steps, each with an example, key idea and check question
- [ ] Right answers are spread across positions (not all first)
- [ ] Worked example shows the full thinking
- [ ] Guided practice and main task are typed into practice boxes, with unique `key` values
- [ ] 10 quiz questions, about 8 word challenges, 1 sorting activity
- [ ] Glossary covers every key vocabulary word
- [ ] Common mistakes, extension and extra activities written
- [ ] Answer key covers every Part, with accepted alternatives
- [ ] Videos and links re-checked
- [ ] Spelling entry added in `spelling_live.py` with the **same seed_key**
- [ ] Module added to `LESSON_MODULES`, week added to `BUILT_OUT_WEEKS` once all four lessons exist
- [ ] Novel weeks never name a title
- [ ] Australian spelling, plain language, no dashes as punctuation

Final checks before the single merge: `LESSON_LIBRARY_VERSION` bumped, no duplicate `seed_key` anywhere, every spelling key matches a lesson, and every lesson imports without error.

---

## 12. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Lesson does not appear | Module missing from `LESSON_MODULES`, or an error in the file | Check logs for `Lesson module ... not loaded` |
| Old version of the lesson shows | Version not bumped | Bump `LESSON_LIBRARY_VERSION` |
| Two lessons in the same slot | Week not yet in `BUILT_OUT_WEEKS` | Add the week once all four lessons are built |
| A slot is missing from a week | Week in `BUILT_OUT_WEEKS` but fewer than four lessons built | Build the missing lesson or remove the week from the set |
| No spelling stage, empty Word Hoard | Spelling key does not match `seed_key` | Make the keys identical |
| New page looks unchanged | Browser cache, or backend still deploying | Wait for Live, then hard refresh |
| Blank cards on the child page | Assignments pointing at lessons that no longer exist | The orphan cleanup in `lesson_library.py` removes them after startup |
| Word audio sounds odd | Device voice | The voice is chosen in `frontend/src/lib/speak.js` |
