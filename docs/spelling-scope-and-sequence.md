# Spelling scope and sequence (draft for review)

Spelling is taught in every lesson, in every subject, and builds over the whole program. Syllabus outcome EN2-SPELL-01: selects and applies spelling knowledge when creating written texts.

## How each lesson uses it

1. **Spelling stage (about 5 minutes):** a short piece of prose teaching on the current focus, then 3 to 5 words practised with Look, Say, Cover, Write, Check, then a quick check.
2. **Words from the lesson:** the key vocabulary of the lesson (in any subject) is practised the same way, with its parts shown.
3. **Proofreading line:** the main written task ends with a check of the current spelling focus.
4. **Quiz:** one or two spelling questions on the current focus.
5. **Word bank (planned):** words missed are saved and brought back on later days.

## Sequence

| Weeks | Focus | Key ideas |
|---|---|---|
| 1-2 | Sounds and syllables | Phonemes, digraphs, one sound many spellings, clapping syllables, double letters in the middle of words, compound words |
| 3-4 | Prefixes | un-, re-, dis-, mis-, pre-, in-/im-; base words; prefixes never change the base word |
| 5-6 | Suffixes and adding rules | -ing, -ed, -ful, -less, -ly, -ness, -er; drop the e; double the consonant; change y to i |
| 7-8 | Tricky and high-frequency words | Look, Say, Cover, Write, Check; mnemonics; spaced practice across days |
| 9-10 | Homophones and plurals | there/their/they're, to/too/two, its/it's; -s, -es, -ies, irregular plurals |
| 11-12 | Word origins and families | Greek and Latin roots (tele, photo, aqua, port), word families, subject vocabulary |

The fortnightly mini exam includes a short spelling section drawn from the previous two weeks of focus words.

## Subject vocabulary

Each lesson in maths, science, history, geography and others supplies 3 to 5 key words. These are practised in the spelling stage using the current focus where it fits (for example, perimeter: peri + meter, or habitat in a science lesson).

## Lesson data format

A lesson can include a `spelling` object:

```
"spelling": {
  "focus": "Syllables",
  "teaching": "Paragraphs of prose separated by blank lines.",
  "words": [{"word": "rabbit", "parts": "rab-bit", "tip": "double b after a short vowel"}],
  "check": [{"question": "...", "options": ["..."], "correct_index": 0, "explanation": "..."}]
}
```

Lessons without a `spelling` object are unchanged.
