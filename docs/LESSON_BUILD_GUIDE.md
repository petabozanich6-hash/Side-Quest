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
5. **Batch your changes.** Every content change needs a backend deploy (see section 8). Finish the whole lesson, then bump the version once.
6. **Never use a seed_key twice.** Spelling and the Word Hoard are attached by `seed_key`, so a wrong key silently shows nothing.

---

## 2. Files involved

| File | What it does |
|---|---|
| `backend/lesson_library_s2_english_wXX_lY.py` | The lesson itself (one file per lesson) |
| `backend/lesson_library_s2_english_w1_w2.py` | Contains the `build()` function and the helpers `_q`, `_step`, `_sort`, `_wc`, `_video`, `_article` |
| `backend/lesson_library.py` | Holds `LESSON_LIBRARY_VERSION` and the `LESSON_MODULES` list that registers lesson files |
| `backend/spelling_live.py` | The spelling words for each lesson, keyed by `seed_key` |
| `backend/lesson_library_s2_english_placeholders.py` | Placeholder lessons for slots that are not built yet |
| `docs/english_s2_scope_and_sequence.md` | What each week and lesson should cover |
| `frontend/src/components/shared/SpellingSegment.jsx` | The See it, Hear it, Spell it, Type it spelling stage |
| `frontend/src/lib/speak.js` | The voice used to read words aloud |

---

## 3. Naming

- **Module file:** `lesson_library_s2_english_w01_l1.py` (week and lesson numbers, two digits for the week).
- **seed_key:** `s2-eng-w01-l1-reading-expression` (stage, subject, week, lesson, short topic name).
- **Lesson variable:** call it `LESSON`. The loader finds any dict with a `seed_key`, but `LESSON` keeps it clear.

---

## 4. The lesson anatomy

The reference lesson is built with one `build(...)` call. The arguments go in this order. If you are unsure, check the `build()` signature in `lesson_library_s2_english_w1_w2.py`, then copy the reference lesson.

| # | Part | What to write |
|---|---|---|
| 1 | `seed_key` | Unique key, never reused |
| 2 | Title | Short and child friendly |
| 3 | Hook | 1 to 2 sentences that make a child want to start |
| 4 | Strand | For example "Reading: fluency and comprehension" |
| 5 | Outcome codes | The NSW outcome codes this lesson covers (see `nsw_outcomes.py`) |
| 6 | Outcome notes | One line per code saying how this lesson meets it, and which is Primary |
| 7 | Learning intention | "We are learning to..." |
| 8 | Success criteria | 5 to 6 "I can..." statements |
| 9 | Key vocabulary | Single words, lowercase |
| 10 | Materials | Keep it short. "This lesson, everything you need is inside it" is ideal |
| 11 | Prior knowledge | One sentence on what a child should already know |
| 12 | Teaching text | The long explicit teaching (see section 5) |
| 13 | Steps | 6 to 8 steps, each with a small check question (see section 6) |
| 14 | Worked example | A full example done start to finish, showing every thinking step |
| 15 | Guided practice | Parts A, B, C, D that the child types into practice boxes |
| 16 | Main task | A passage or scenario, broken into numbered stages |
| 17 | Reflection question | One open question |
| 18 | Self check | One sentence listing everything the child should have done |
| 19 | Quiz | 10 multiple-choice questions using `_q(...)` |
| 20 | Submission note | Tells the child what to submit |
| 21 | Extension | One challenge for children who finish early |
| 22 | Glossary | List of `(word, simple meaning)` pairs |
| 23 | Resources | Videos with `_video(...)` and articles with `_article(...)` |
| 24 | Sorting activity | One `_sort(...)` (drag items into groups) |
| 25 | Word challenges | About 8 quick `_wc(...)` questions |
| 26 | Practice boxes | Dicts with `key`, `label`, `hint`, one per typed answer |
| 27 | Common mistakes | 4 to 5 mistakes children often make |
| 28 | Extra activities | 2 optional activities |
| 29 | Answer key | For the parent, covering every Part, with accepted alternatives |

Keep the practice box `key` values short and unique within the lesson (`partA`, `partB`, `explain`).

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
- Put the right answer in a different position across steps. Do not always make it the first one.
- Each step teaches one idea only.

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
- Keep the spelling `focus` the same as step 6 of the lesson.
- **The key must match the lesson `seed_key` exactly.** A mismatch means no spelling stage appears and nothing reaches the Word Hoard. This already happened once.
- The spelling words are added to the Word Hoard automatically when the lesson opens. A word is mastered after 10 correct tries in a row, with a limit of 2 counted tries per word per day.
- Each word in the lesson goes through four steps: **See it**, **Hear it**, **Spell it** (say the letters out loud), **Type it** (word hidden, typed from memory). This is built into `SpellingSegment.jsx`, so no extra work is needed per lesson.

---

## 8. Registering the lesson and deploying

Do these steps once the whole lesson is written, not after each small edit.

1. Add the module name to `LESSON_MODULES` in `backend/lesson_library.py`, **before** the placeholder modules:

   ```python
   LESSON_MODULES = (
       "lesson_library_s2_english_w01_l1",
       "lesson_library_s2_english_w01_l2",   # new
       "lesson_library_s2_english_placeholders",
       ...
   )
   ```

2. Add the spelling entry in `backend/spelling_live.py`.
3. **Bump `LESSON_LIBRARY_VERSION`** in `backend/lesson_library.py` by one. Without this the live database keeps the old copy of the lesson.
4. Push to `main`. Render redeploys automatically.
5. Wait for the backend deploy to say **Live**. The free plan can take about 10 minutes after a version bump, and the new backend may log "No open ports detected" for a while before it comes up. That is normal while it reloads the lessons.
6. Hard refresh the site (Ctrl+Shift+R, or Cmd+Shift+R on a Mac) and open the lesson.
7. In the backend logs, look for `Lesson module ... added N lessons` and `Spelling segment attached to N lessons`.

Why lesson changes need a deploy: lesson content lives in Python files, not in the database editor. To avoid repeated deploys, finish the whole lesson, check it carefully against the checklist below, and push once.

---

## 9. Placeholders

Each slot in the scope and sequence has a placeholder in `lesson_library_s2_english_placeholders.py`. A built lesson uses its own `seed_key`. Check how the placeholder for the same slot behaves once the real lesson is registered, and remove or retire it if both appear. Confirm this the first time you build a second lesson.

---

## 10. Videos and links

- Use only videos you have checked. Re-check every video ID and article link before release, as videos get removed.
- Child safe, ad light, read-aloud or explainer style, under about 5 minutes.
- Every video needs a **watch-for note**, a **do-after task** and a **check question**: `_video(title, id, watch_for, do_after, check_question)`.

---

## 11. Before you push: checklist

- [ ] `seed_key` is unique and follows the naming pattern
- [ ] Outcome codes exist in `nsw_outcomes.py`, and one is marked Primary
- [ ] Learning intention and 5 to 6 success criteria written
- [ ] Teaching text has all six parts (section 5)
- [ ] 6 to 8 steps, each with an example, key idea and check question
- [ ] Right answers are spread across positions (not all first)
- [ ] Worked example shows the full thinking
- [ ] Guided practice and main task are typed into practice boxes, with unique `key` values
- [ ] 10 quiz questions, 8 word challenges, 1 sorting activity
- [ ] Glossary covers every key vocabulary word
- [ ] Common mistakes, extension and extra activities written
- [ ] Answer key covers every Part, with accepted alternatives
- [ ] Videos and links re-checked
- [ ] Spelling entry added in `spelling_live.py` with the **same seed_key**
- [ ] Module added to `LESSON_MODULES`
- [ ] `LESSON_LIBRARY_VERSION` bumped by one
- [ ] Australian spelling, plain language, no dashes as punctuation

---

## 12. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Lesson does not appear | Module missing from `LESSON_MODULES`, or an error in the file | Check logs for `Lesson module ... not loaded` |
| Old version of the lesson shows | Version not bumped | Bump `LESSON_LIBRARY_VERSION` |
| No spelling stage, empty Word Hoard | Spelling key does not match `seed_key` | Make the keys identical |
| New page looks unchanged | Browser cache, or backend still deploying | Wait for Live, then hard refresh |
| Blank cards on the child page | Assignments pointing at lessons that no longer exist | The orphan cleanup in `lesson_library.py` removes them after startup |
| Word audio sounds odd | Device voice | The voice is chosen in `frontend/src/lib/speak.js` |
