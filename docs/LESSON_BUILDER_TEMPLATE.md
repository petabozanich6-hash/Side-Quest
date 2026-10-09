# Lesson Builder Template - Complete Specification

Use this template to build **ALL lessons** across **ALL subjects and stages** to a consistent, production-ready standard.

This is the master specification. Pass this entire document to an AI builder (like Perplexity) along with the scope/sequence for a specific lesson, and it will generate a correct lesson module.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [File Structure](#file-structure)
3. [The build() Function Arguments](#the-build-function-arguments)
4. [Detailed Field Specifications](#detailed-field-specifications)
5. [Helper Functions](#helper-functions)
6. [Validation Checklist](#validation-checklist)
7. [Common Mistakes](#common-mistakes)
8. [Example: How to Use This Template](#example-how-to-use-this-template)

---

## Quick Start

### For a Human Building a Lesson

1. Copy this template to a new file: `backend/lesson_library_s2_english_w01_l1.py`
2. Replace every `[BRACKET]` with your specific content
3. Run `python tools/check_lesson.py backend/lesson_library_s2_english_w01_l1.py`
4. Fix any warnings
5. Run the lesson file itself: `python backend/lesson_library_s2_english_w01_l1.py`
6. Register in `backend/lesson_library.py`

### For Perplexity or Another AI Builder

1. You are given:
   - This template (the specification)
   - A lesson spec from `docs/english_s2_scope_and_sequence.md` or similar
   - A reference lesson (e.g., `backend/lesson_library_s2_english_w09_l1.py`)

2. You must output:
   - A complete, valid Python lesson file that passes validation
   - No placeholders, no TODOs, no incomplete sections
   - Every field specified below, in the exact order

3. Reference `backend/lesson_library_s2_english_w1_w2.py` for the builder helpers.

---

## File Structure

Every lesson file follows this structure:

```python
"""
[MODULE DOCSTRING - Required]
- One sentence: what the lesson teaches
- Outcomes: NSW curriculum codes (EN2-RECOM-01, MA2-MR-01, etc.)
- Video status: how many videos, which YouTube IDs, whether they're checked
- Key facts: any background context needed
"""

[IMPORTS - Required]
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
# May also import: _visual, _article
# May import from spelling_s2_w1, etc. if spelling helpers exist

[CONSTANTS - as needed]
WORDS = ["word1", "word2", ...]
SURVEY = [("Item", count), ...]
MODEL_TEXT = "..."

[VISUAL HELPER FUNCTIONS - if needed]
def _echidna_svg(): ...
def _bar_svg(): ...

[VISUAL OBJECTS - if needed]
V_ECHIDNA = _visual("<svg>...</svg>", "alt text", "caption")

[THE MAIN LESSON OBJECT]
LESSON = build(
    "seed_key",
    "title",
    "mission",
    ... [25 positional arguments in exact order]
)

[OPTIONAL POST-BUILD ADDITIONS]
LESSON["spelling"] = { ... }
LESSON["spelling_focus"] = "..."
LESSON["hoard_words"] = [...]
LESSON["planner_title"] = "..."
LESSON["planner_intro"] = "..."
LESSON["explicit_teaching"] = "..."
LESSON["worked_visuals"] = [...]

[VALIDATION CODE - Required at bottom]
if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10
    assert len(LESSON["word_challenges"]) == 8
    ... [other checks]
    print(f"✓ {LESSON['seed_key']} is ready to build!")
```

---

## The build() Function Arguments

These are the 25 positional arguments to `build()`, **in exact order**. Copy-paste this list:

```python
LESSON = build(
    # Arg 1: SEED_KEY (string)
    key,

    # Arg 2: TITLE (string)
    title,

    # Arg 3: MISSION (string, one sentence)
    mission,

    # Arg 4: SUBJECT (string)
    subject,

    # Arg 5: OUTCOME CODES (list of strings)
    codes,

    # Arg 6: OUTCOME NOTES (dict: code → description)
    notes,

    # Arg 7: LEARNING INTENTION (string, "We are learning to...")
    intention,

    # Arg 8: SUCCESS CRITERIA (list of 6 strings, "I can...")
    criteria,

    # Arg 9: KEY VOCABULARY (list of 6-8 strings)
    vocab,

    # Arg 10: MATERIALS (list of strings)
    materials,

    # Arg 11: PRIOR KNOWLEDGE (string)
    prior,

    # Arg 12: EXPLICIT TEACHING (string, 900+ words)
    teaching,

    # Arg 13: TEACH STEPS (list of 8-9 _step() objects)
    steps,

    # Arg 14: WORKED EXAMPLE (string)
    worked,

    # Arg 15: GUIDED PRACTICE (string)
    guided,

    # Arg 16: INDEPENDENT TASK (string)
    independent,

    # Arg 17: RESPONSE PROMPT (string)
    response,

    # Arg 18: SELF CHECK (string, checklist for the child)
    selfcheck,

    # Arg 19: QUIZ (list of 10 _q() objects)
    quiz,

    # Arg 20: EVIDENCE (string, upload instructions)
    evidence,

    # Arg 21: EXTENSION (string, optional challenge)
    extension,

    # Arg 22: VOCABULARY CARDS (list of tuples: (word, definition))
    cards,

    # Arg 23: RESOURCES (list of _video() or _article() objects)
    resources,

    # Arg 24: SORT ACTIVITY (_sort() object)
    sort_activity,

    # Arg 25: WORD CHALLENGES (list of 8 _wc() objects)
    word_challenges,

    # Arg 26: PLANNER BOXES (list of dicts: key, label, hint)
    planner,

    # Arg 27: COMMON MISTAKES (list of strings)
    mistakes,

    # Arg 28: FOLLOW-UP CHALLENGES (list of dicts: title, description, type, difficulty, evidence_type)
    challenges,

    # Arg 29: ANSWER KEY (string)
    answer_key,

    # OPTIONAL KWARGS:
    parent_check="",  # Guidance for parents
    worked_visuals=None,  # List of _visual() objects
)
```

---

## Detailed Field Specifications

### 1. SEED_KEY (Argument 1)

**Format:** `s2-eng-w01-l1-reading-expression`

- `s2` = Stage 2
- `eng` = English (or `maths`, `science`, etc.)
- `w01` = Week 1 (two digits, zero-padded)
- `l1` = Lesson 1 (one digit)
- `reading-expression` = URL-safe slug (hyphens, lowercase, no spaces)

**Rule:** Every lesson has a unique seed_key. Never reuse or change it once a lesson is live.

**Example:** `s2-eng-w09-l1-diagrams-graphs-captions`

---

### 2. TITLE (Argument 2)

**Format:** "Week X, Lesson Y: Topic Name"

**Example:** "Week 9, Lesson 1: Diagrams, Graphs and Captions"

This is what the child sees at the top of the lesson.

---

### 3. MISSION (Argument 3)

**Format:** One engaging sentence that hooks the child.

**Rules:**
- ~15-20 words
- Why should they care? What's the payoff?
- Active, present tense

**Example:** "Learn how to read labelled diagrams, captions and bar graphs in an information report, and how they add information to the main text."

---

### 4. SUBJECT (Argument 4)

**Format:** "Reading / Writing / Language / Oral language and handwriting / Maths: arithmetic / Maths: measurement / Science: earth and space / etc."

This groups lessons by area.

---

### 5. OUTCOME CODES (Argument 5)

**Format:** List of official NSW curriculum codes.

**Examples:**
- English: `["EN2-RECOM-01", "EN2-SPELL-01"]`
- Maths: `["MA2-MR-01"]` (multiply and divide facts)
- Science: `["SC2-4LW-01"]` (living things)

**Rule:** Every lesson must map to at least one official outcome. Check against:
- NSW K-10 Syllabus (NESA 2022)
- Your scope/sequence doc
- `backend/lesson_library_s2_english_placeholders.py` for reference codes

---

### 6. OUTCOME NOTES (Argument 6)

**Format:** Dict where each code maps to its full definition plus how this lesson addresses it.

```python
{
    "EN2-RECOM-01": "Reads and comprehends texts for wide purposes using knowledge of text structures and language, and by monitoring comprehension. This lesson focuses on reading diagrams, graphs and captions.",
    "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is silent letters kn, wr, mb, gn.",
}
```

**Rule:** Every code in `codes` must have a matching entry in `notes`.

---

### 7. LEARNING INTENTION (Argument 7)

**Format:** "We are learning to [skill/concept]."

**Rules:**
- Starts with "We are learning to"
- 1-2 sentences max
- Focus on the main skill or concept

**Example:** "We are learning how to read diagrams, graphs and captions to find information, and to spell words with silent letters."

---

### 8. SUCCESS CRITERIA (Argument 8)

**Format:** List of 6 strings, each starting "I can".

**Rules:**
- Each one is observable and measurable
- Written from the child's perspective
- Cover the key skills from the lesson
- Last one can be meta: "I can check my work against the checklist"

**Example:**
```python
[
    "I can explain why a report uses diagrams, graphs and captions.",
    "I can read the labels on a diagram and follow each label line to its part.",
    "I can use a caption to understand a picture.",
    "I can read the title, axes, scale and bars on a bar graph.",
    "I can answer questions using the numbers on a graph.",
    "I can say what a visual tells me that the text does not.",
]
```

---

### 9. KEY VOCABULARY (Argument 9)

**Format:** List of 6-8 Tier 3 (subject-specific) words.

**Rules:**
- Tier 1 = everyday words (the, because, run) — DON'T include
- Tier 2 = cross-subject (compare, analyse, similar) — OK to include
- Tier 3 = subject-specific (diagram, caption, graph) — MUST include
- 6-8 words total

**Example:**
```python
["diagram", "label", "caption", "graph", "scale", "title", "data", "compare"]
```

---

### 10. MATERIALS (Argument 10)

**Format:** List of strings.

**Rules:**
- Include "This lesson (everything you need is inside it)" if it's self-contained
- List any physical materials: paper, pencil, ruler, markers, coins, counters
- Optional materials go last
- No more than 5 items

**Example:**
```python
["This lesson (everything you need is inside it)", "Paper and a pencil", "A ruler (for the main task)"]
```

---

### 11. PRIOR KNOWLEDGE (Argument 11)

**Format:** One sentence or short paragraph.

**Rules:**
- What must the child already know?
- Reference previous lessons or milestones
- Be specific

**Example:** "Child can name text features such as headings, glossary and index (Week 6 Lesson 1), and has read and written about the echidna in Weeks 7 and 8."

---

### 12. EXPLICIT TEACHING (Argument 12)

**Format:** Long text block (900+ words).

**Rules:**
- Written for the **parent**, not the child
- Structured as sections with headings in bold
- No code, no placeholders
- Answer: Why does this skill matter? How do I teach it? What mistakes will I see?

**Structure:**
```
The big idea. [Why the skill is important.]

How to open the lesson. [Suggested opening activity.]

Teaching [main topic]. [Key teaching moves, routines, examples.]

Teaching [second topic]. [More teaching moves.]

[Additional sections as needed.]

What to watch for. [Common mistakes and fixes.]
```

**Example (excerpt):**
```
The big idea. Every information report is really two texts working side by side: 
the words, and the visuals. Children usually learn to read the words long before 
they learn to read the visuals. This lesson teaches them to see that a diagram shows 
what words cannot easily say, and a graph makes comparison instant.

How to open the lesson. Start with a question, not a definition. Ask your child to 
describe an echidna to you using words only, while you try to draw what you hear. 
Give it thirty seconds, then show them the diagram. Point out how much the picture 
taught you that the words did not.

Teaching diagrams. A diagram is not a photograph. The person who made it chose what 
to leave out, so what remains is exactly what the reader is meant to learn. Teach 
one routine and use it every time: read the label, follow its line, find the part, 
say what it is in your own words.
```

---

### 13. TEACH_STEPS (Argument 13)

**Format:** List of 8-9 `_step()` objects.

**Each _step() contains:**
```python
_step(
    icon,  # "1" or "🔍" or "📊" — emoji or number
    title,  # "Step Title"
    explain,  # 2-3 sentences explaining the concept
    example,  # Concrete example
    notice,  # Key insight or pattern to remember
    (quiz_q, [opts], idx, why),  # Check question
    # optional: visual=[V_VISUAL],
)
```

**Rules:**
- 8-9 steps total
- Each step teaches one concept
- Steps build on each other
- Last step is often spelling
- Each step has a check question
- Visuals optional but encouraged

**Example:**
```python
_step(
    "🏷️",
    "Diagrams and labels",
    "A diagram is a drawing made to teach you something... [full explanation]",
    "Read the label claws. Follow the line with your finger...",
    "A label only makes sense with its line. Always check where the line ends.",
    ("What does a label line do?", ["It joins a label to the part it names", "It shows the end of the report", "It tells you the page number"], 0, "The label line ends on the part that the label names."),
)
```

---

### 14. WORKED EXAMPLE (Argument 14)

**Format:** Prose walkthrough using the visuals and concepts.

**Rules:**
- 150-200 words
- Use a real example from the lesson
- Show every step
- Model the thinking aloud

**Example:**
```
Let's read a page with visuals together, using the echidna diagram and the graph.

My page says: Echidnas are small, spiny mammals that live across Australia...
I read the words first, then I look at the diagram. The text says echidnas are 
spiny, and the diagram shows me exactly where the spines are, and that they cover 
the back. The labels tell me about the snout, the claws and the legs.

Now the graph. I read the title first: Favourite Australian animals in Class 3...
```

---

### 15. GUIDED PRACTICE (Argument 15)

**Format:** Step-by-step tasks with support, labeled Part A, B, C, D.

**Rules:**
- 4 parts (A, B, C, D)
- Each part is one task
- Support provided: worked example shown, similar pattern, etc.
- Child types answers into boxes on the next stage
- 100-150 words total

**Example:**
```
Here we practise together. Read each part, then type your answers in the boxes.

Part A: look at the echidna diagram and type its four labels.

Part B: type a caption for a picture of a koala eating gum leaves. Make it a full 
sentence in the present tense.

Part C: use the model graph. [Data shown]. Type three answers: how many votes the 
koala got; how many more votes the kangaroo got than the echidna; and how many 
votes the koala and wombat got together.

Part D: type the missing silent letters to make five words: _nee, _rist, _nock, clim_, _nat.
```

---

### 16. INDEPENDENT TASK (Argument 16)

**Format:** 5-7 tasks for the child to do with **no support**.

**Rules:**
- Numbered 1-7
- Each task is clear and specific
- Mix of types: writing, creating, explaining, applying
- Vary the cognitive demand
- Last task often involves spelling or a challenge
- 150-250 words total

**Example:**
```
Now read the visuals and make your own...

1. Graph: type the title of the model graph, and say what each axis shows.

2. Diagram: type two things the diagram shows that the text does not say.

3. Compare: type the animal with the fewest votes, and how many fewer votes 
it has than the animal with the most.

4. Caption: type a caption for a picture of an echidna using its sticky tongue 
to catch ants. Write it as a full sentence in the present tense.

5. Your own diagram: on paper, draw an animal you know and add four labels with 
label lines and a title. Type your four labels and a caption for your diagram.

6. Your own survey: ask eight to ten people which of three animals is their 
favourite. Type the number for each animal. On paper, draw a bar graph...

7. Spelling: type your six spelling words, and write one sentence each for 
knee, wrist and climb.
```

---

### 17. RESPONSE PROMPT (Argument 17)

**Format:** One sentence telling the child what to do.

**Example:** "Type your answers in the practice boxes and the big box, then submit them."

---

### 18. SELF CHECK (Argument 18)

**Format:** Checklist (Did I...?) for the child to review their own work.

**Rules:**
- 5-8 items
- Written as "Did I...?" questions
- Specific (not vague: "Did I read carefully?" is too vague)
- Tied to success criteria

**Example:**
```
Did I read the labels and captions? Did I read the title, scale and bars of the 
graph? Did I compare numbers correctly? Did I say what each visual adds? Did I 
spell knee, knock, wrist, wrap, climb and gnat correctly?
```

---

### 19. QUIZ (Argument 19)

**Format:** List of exactly 10 `_q()` objects.

**Each _q():**
```python
_q(
    question,  # The question text
    [opts],  # List of 3-4 answer options
    idx,  # Correct answer index (0, 1, 2, or 3)
    why,  # Explanation of why it's correct
)
```

**Rules:**
- Exactly 10 questions
- Mix: recall, application, spelling, reading
- Options are plausible distractors (not absurd)
- Explanation explains WHY the answer is correct

**Example:**
```python
_q("What does a caption do?", 
   ["Gives the author's name", "Explains a picture, diagram or graph in a short line", "Lists the glossary", "Gives the page number"], 
   1, 
   "A caption explains what you are looking at and adds a fact."),

_q("In the model graph (kangaroo 8, koala 6, echidna 4, wombat 2), which animal got the most votes?", 
   ["Echidna", "Koala", "Wombat", "Kangaroo"], 
   3, 
   "The kangaroo bar is the tallest, at 8."),
```

---

### 20. EVIDENCE (Argument 20)

**Format:** Instructions for the child on what to upload.

**Example:** "Type your answers in the practice boxes and in the big box, then submit them."

---

### 21. EXTENSION (Argument 21)

**Format:** Optional challenge for fast finishers.

**Example:** "Extension: find a report, a textbook or a website page with a diagram or graph. Write one caption for it, and one question that someone could answer by reading it. Ask a family member to answer your question."

---

### 22. VOCABULARY CARDS (Argument 22)

**Format:** List of tuples: `(word, one-sentence definition)`

**Rules:**
- 6-8 entries
- One sentence per definition
- Plain language
- Definitions from the lesson context

**Example:**
```python
[
    ("diagram", "A picture that shows the parts of something"),
    ("label", "A word that names a part of a picture"),
    ("caption", "A short line of writing that explains a picture"),
    ("graph", "A picture made of bars, lines or dots that shows numbers"),
    ("scale", "The numbers along the side of a graph that tell you how much"),
    ("title", "The heading that tells what a diagram, graph or picture is about"),
    ("data", "Information collected by counting or asking questions"),
    ("compare", "To look at two or more things and see how they are the same or different"),
]
```

---

### 23. RESOURCES (Argument 23)

**Format:** List of `_video()` or `_article()` objects.

**Rules:**
- At least 1 video, usually 2-3
- YouTube videos only (use YouTube IDs)
- Check every video link before commit
- Include a prompt note and offline alternative

**_video() structure:**
```python
_video(
    "Title (Source, Grade Level)",
    "YouTubeID",
    "Watch for: [what the child should notice]",
    "Offline: [what to do if unavailable]",
    (q, [opts], idx, why),  # Check question
)
```

**Example:**
```python
_video(
    "Diagrams and labels (text features)", 
    "vdyiupgsplI",
    "Watch how a label names a part and its line points to it. Pause and find the label line on each picture.",
    "Ask your child to point to a label, then follow its line to the part.",
    ("What is a diagram?", ["A picture that shows the parts of something", "A list of words", "A page number"], 0, "A diagram is a picture with labels that name its parts."),
)
```

---

### 24. SORT ACTIVITY (Argument 24)

**Format:** One `_sort()` object.

**_sort() structure:**
```python
_sort(
    "Activity Title",
    "Instructions to the child",
    ["Category 1", "Category 2", "Category 3"],
    [
        ("Item 1", 0),  # 0 = Category 1
        ("Item 2", 1),  # 1 = Category 2
        ("Item 3", 2),  # 2 = Category 3
        ...
    ],
)
```

**Rules:**
- 3-4 categories
- 8-12 items total
- Items match only one category
- First couple of items are obvious, then harder

**Example:**
```python
_sort(
    "Diagram or graph?",
    "Sort each feature into diagram feature or graph feature.",
    ["Diagram feature", "Graph feature"],
    [
        ("label lines that point to parts", 0),
        ("bars of different heights", 1),
        ("the title tells what the diagram shows", 0),
        ("numbers along the side", 1),
    ],
)
```

---

### 25. WORD CHALLENGES (Argument 25)

**Format:** List of exactly 8 `_wc()` objects.

**Each _wc():**
```python
_wc(
    question,  # Fill-in-the-blank or multiple choice
    [opts],  # Answer options
    idx,  # Correct index
    why,  # Explanation
)
```

**Rules:**
- Exactly 8 questions
- Mix types: definition, usage, spelling, word form
- Fill-in-the-blank format is common
- Simpler than the main quiz

**Example:**
```python
_wc("A [word] is a picture that shows the parts of something.", ["diagram", "caption", "scale"], 0, "A diagram shows parts."),

_wc("An [word] is a short line that explains a picture.", ["label", "caption", "title"], 1, "A caption explains a picture."),

_wc("Which word is spelled correctly?", ["nee", "knee", "kneee"], 1, "Knee has a silent k."),
```

---

### 26. PLANNER BOXES (Argument 26)

**Format:** List of dicts with keys: `key`, `label`, `hint`.

**Rules:**
- 4-6 boxes
- Each box is a task the child completes
- `key` is a unique identifier (no spaces, lowercase)
- `label` is what the child sees
- `hint` is brief guidance (optional but helpful)

**Example:**
```python
[
    {"key": "partA", "label": "Part A: diagram labels", "hint": "The four labels on the echidna diagram."},
    {"key": "partB", "label": "Part B: a caption", "hint": "A present tense caption for a koala eating gum leaves."},
    {"key": "partC", "label": "Part C: graph answers", "hint": "Koala votes; kangaroo minus echidna; koala plus wombat. Add your number sentences."},
    {"key": "partD", "label": "Part D: silent letters", "hint": "The five words from _nee, _rist, _nock, clim_, _nat."},
]
```

---

### 27. COMMON MISTAKES (Argument 27)

**Format:** List of strings describing common errors.

**Rules:**
- 4-6 items
- Each one is specific and fixable
- Include what to watch for
- One sentence each

**Example:**
```python
[
    "Ignoring the labels and reading only the text",
    "Reading the wrong bar or forgetting to check the scale",
    "Adding when you should subtract to compare",
    "Writing a caption that is an opinion instead of a fact",
    "Forgetting to check all four parts of a graph (title, axes, scale, bars)",
]
```

---

### 28. FOLLOW-UP CHALLENGES (Argument 28)

**Format:** List of dicts with keys: `title`, `description`, `type`, `difficulty`, `evidence_type`.

**Rules:**
- 1-2 challenges
- `type`: "create" | "investigate" | "speak" | "research"
- `difficulty`: "easy" | "medium" | "hard"
- `evidence_type`: "photo" | "audio" | "text" | "video"

**Example:**
```python
[
    {
        "title": "Find a graph or diagram in a book",
        "description": "Find a graph or diagram in a book and read it aloud to someone.",
        "type": "investigate",
        "difficulty": "medium",
        "evidence_type": "audio"
    },
]
```

---

### 29. ANSWER KEY (Argument 29)

**Format:** Answers to guided practice, independent task, and quiz.

**Rules:**
- No more than 100 words
- Sample answers for open-ended questions
- Accept reasonable variations
- Keep it brief

**Example:**
```
Part A: spines, snout, claws, short legs. 
Part B: accept a present tense caption such as "A koala feeds on gum leaves." 
Part C: 6; 4 (8 - 4); 8 (6 + 2). 
Part D: knee, wrist, knock, climb, gnat.
Quiz: see the quiz checks above for detailed answers.
Common answers: if child wrote "Cute!" for a caption, explain that opinions are not facts.
```

---

### Optional: parent_check (Keyword Argument)

**Format:** Guidance for parents on what to look for.

**Rules:**
- 1-3 sentences
- Specific to this lesson
- What should be correct? What's OK to accept?

**Example:**
```python
parent_check=(
    "Check that the child names the graph title and axes correctly, "
    "and that the child identifies two sensible things that the diagram adds, "
    "such as where the spines are or what the parts are called."
)
```

---

### Optional: worked_visuals (Keyword Argument)

**Format:** List of `_visual()` objects to show in the worked example.

**_visual() structure:**
```python
_visual(
    "<svg>...</svg>",  # or src="url"
    "alt text (40+ chars)",
    "caption"
)
```

**Rules:**
- Every SVG must be complete (`<svg>...</svg>`)
- Alt text must be descriptive (min 40 chars)
- Optional but encouraged

**Example:**
```python
worked_visuals=[V_ECHIDNA, V_GRAPH_VALUES]
```

---

### Optional: Post-Build Additions

After calling `build()`, you can add:

```python
# Spelling segment
LESSON["spelling"] = {
    "focus": "Silent letters: kn, wr, mb, gn",
    "teaching": "[Explanation of the pattern]",
    "words": [
        _w("knee", "knee", "silent k at the start, the joint in your leg"),
        _w("knock", "knock", "silent k at the start, to tap on a door"),
        # ... 4-6 more
    ],
    "check": [
        _c("Which word has a silent w?", ["wrist", "west", "wind"], 0, "The w in wrist is silent."),
        # ... 1-2 more
    ],
}
LESSON["spelling_focus"] = "Silent letters: kn, wr, mb, gn"
LESSON["hoard_words"] = list(WORDS)

# Custom planner labels
LESSON["planner_title"] = "Guided practice answers"
LESSON["planner_intro"] = "Type your answer to each part of the guided practice..."

# Explicit teaching for the parent
LESSON["explicit_teaching"] = "The big idea. [Long text]..."
```

---

## Helper Functions

These are in `backend/lesson_library_s2_english_w1_w2.py`. Use them to build the lesson:

```python
from lesson_library_s2_english_w1_w2 import (
    build,      # Main function to create a lesson
    _q,         # Quiz question
    _step,      # Teaching step
    _sort,      # Sort activity
    _wc,        # Word challenge
    _video,     # Video object
    _article,   # Article object (optional)
    _visual,    # Visual (SVG or image) object
)
```

### _q(question, options, correct_index, explanation)
```python
_q(
    "What is a diagram?",
    ["A picture that shows parts", "A list of words", "A page number"],
    0,  # Index of correct answer
    "A diagram is a picture with labels."
)
```

### _step(icon, title, explain, example, notice, check, visual=None, visual_before=None)
```python
_step(
    "🔍",  # Icon
    "Step Title",
    "Explanation of the concept",
    "Example showing the concept",
    "Key insight to remember",
    ("Question?", ["Opt A", "Opt B", "Opt C"], 0, "Why..."),
    visual=[V_EXAMPLE],  # Optional
)
```

### _sort(title, instructions, buckets, items)
```python
_sort(
    "Activity Title",
    "Instructions to the child",
    ["Bucket 1", "Bucket 2", "Bucket 3"],
    [
        ("Item 1", 0),  # 0 = Bucket 1
        ("Item 2", 1),  # 1 = Bucket 2
        ...
    ],
)
```

### _wc(question, options, correct_index, explanation)
```python
_wc(
    "A [word] is a picture.",
    ["diagram", "caption", "graph"],
    0,
    "A diagram is a picture."
)
```

### _video(title, youtube_id, prompt, offline_alternative, check)
```python
_video(
    "Title (Source, Grade)",
    "YouTubeID",
    "Watch for: [what to notice]",
    "Offline: [what to do if unavailable]",
    ("Question?", ["Opt A", "Opt B", "Opt C"], 0, "Why...")
)
```

### _visual(svg_or_src, alt_text, caption)
```python
_visual(
    "<svg xmlns='...'></svg>",  # Complete SVG
    "Alt text describing the visual in detail",
    "Caption shown below the visual"
)
# OR
_visual(
    src="https://example.com/image.png",
    alt="Alt text",
    caption="Caption"
)
```

---

## Validation Checklist

Before committing, run:

```bash
# Check the lesson file itself
python backend/lesson_library_s2_english_w01_l1.py

# Check using the validator tool
python tools/check_lesson.py backend/lesson_library_s2_english_w01_l1.py
```

**Your lesson must pass all of these:**

- [ ] Exactly 10 quiz questions
- [ ] Exactly 8 word challenges
- [ ] 8-9 teaching steps
- [ ] No TODO, placeholder, or <<FILL>> markers
- [ ] seed_key is unique and follows format
- [ ] explicit_teaching is 900+ words
- [ ] parent_check is present
- [ ] planner_title and planner_intro are set
- [ ] spelling_focus is set
- [ ] All visuals are complete SVG or valid URLs
- [ ] All alt text is 40+ characters
- [ ] All YouTube video IDs are valid (check by playing)
- [ ] All success criteria are "I can" statements
- [ ] All quiz options are plausible (not absurd)
- [ ] Outcome codes match official NSW curriculum
- [ ] Module imports correctly without errors
- [ ] LESSON["seed_key"] matches the file name (implicitly, through registration)

---

## Common Mistakes

### Mistake 1: Placeholder Text
❌ WRONG:
```python
"explicit_teaching": "<<FILL IN THE TEACHING CONTENT>>",
```
✅ RIGHT:
```python
"explicit_teaching": "The big idea. Every information report uses diagrams to show what words alone cannot explain. A diagram is not a photograph — the creator chose what to leave out, so what remains is exactly what matters. Teach your child one routine: read the label, follow its line, find the part, say what it is in your own words. This routine works every time.",
```

### Mistake 2: Wrong Argument Order
❌ WRONG:
```python
build(key, title, codes, notes, mission, ...)  # codes and notes in wrong order
```
✅ RIGHT:
```python
build(key, title, mission, subject, codes, notes, ...)  # Correct order
```

### Mistake 3: Wrong Number of Items
❌ WRONG:
```python
quiz = [_q(...), _q(...), _q(...)]  # Only 3 questions
word_challenges = [_wc(...)] * 12  # 12 word challenges
```
✅ RIGHT:
```python
quiz = [_q(...)] * 10  # Exactly 10
word_challenges = [_wc(...)] * 8  # Exactly 8
```

### Mistake 4: Incomplete Visuals
❌ WRONG:
```python
V_EXAMPLE = _visual(
    "<svg><circle cx='50' cy='50'",  # Not complete!
    "A circle",
    "Example"
)
```
✅ RIGHT:
```python
V_EXAMPLE = _visual(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>',
    "A blue circle in the center of the canvas",
    "Example of a simple SVG"
)
```

### Mistake 5: Outcome Codes Don't Match Descriptions
❌ WRONG:
```python
codes = ["EN2-RECOM-01", "EN2-SPELL-01"],
notes = {
    "EN2-RECOM-01": "...",
    "EN2-VOCAB-01": "...",  # Missing EN2-SPELL-01, has extra EN2-VOCAB-01
}
```
✅ RIGHT:
```python
codes = ["EN2-RECOM-01", "EN2-SPELL-01"],
notes = {
    "EN2-RECOM-01": "...",
    "EN2-SPELL-01": "...",
}
```

---

## Example: How to Use This Template

### Scenario
You are asked to build: **Stage 2 English, Week 1, Lesson 1: Reading with Expression**

From the scope: "The child learns to read aloud smoothly and with expression. Punctuation, pace, volume, tone, emphasis, and syllables are taught."

### Step 1: Gather Information
- Reference lesson: `backend/lesson_library_s2_english_w09_l1.py`
- Scope/sequence entry: "Reading with expression"
- Outcome codes: EN2-REFLU-01, EN2-RECOM-01, EN2-SPELL-01, EN2-VOCAB-01
- Spelling: syllables (words: wonderful, adventure, expression, excellent, remember, beautiful)

### Step 2: Create the File
Copy this template to `backend/lesson_library_s2_english_w01_l1.py`

### Step 3: Fill In Each Section
Start at the top and work down:
1. Docstring
2. Imports
3. Constants (WORDS = [...], PASSAGE = "...")
4. Visual helpers (if needed)
5. The LESSON = build(...) call
6. Post-build additions (spelling, planner_title, etc.)
7. Validation code

### Step 4: For Each Argument to build()
Reference the detailed spec above and fill it in. Example:

```python
LESSON = build(
    "s2-eng-w01-l1-reading-expression",  # seed_key
    "Week 1, Lesson 1: Reading with Expression",  # title
    "Learn to read aloud smoothly and with expression using punctuation, pace, volume, tone and emphasis.",  # mission
    "Reading: fluency and comprehension",  # subject
    ["EN2-REFLU-01", "EN2-RECOM-01", "EN2-SPELL-01", "EN2-VOCAB-01"],  # codes
    {
        "EN2-REFLU-01": "...",
        "EN2-RECOM-01": "...",
        "EN2-SPELL-01": "...",
        "EN2-VOCAB-01": "...",
    },  # notes
    "We are learning to read aloud smoothly and with expression so that our listeners understand the meaning and feel the mood.",  # intention
    [...],  # criteria (6 items)
    [...],  # vocab (6-8 items)
    [...],  # materials
    "...",  # prior
    "...",  # explicit_teaching (900+ words)
    [...],  # steps (8-9 _step objects)
    "...",  # worked example
    "...",  # guided practice
    "...",  # independent task
    "...",  # response prompt
    "...",  # self check
    [...],  # quiz (10 _q objects)
    "...",  # evidence
    "...",  # extension
    [...],  # vocabulary cards (6-8 tuples)
    [...],  # resources (videos)
    _sort(...),  # sort activity
    [...],  # word challenges (8 _wc objects)
    [...],  # planner boxes (4-6 dicts)
    [...],  # mistakes (4-6 items)
    [...],  # challenges (1-2 dicts)
    "...",  # answer key
    parent_check="...",
    worked_visuals=[...]
)
```

### Step 5: Add Post-Build Additions
```python
LESSON["spelling"] = { ... }
LESSON["spelling_focus"] = "..."
LESSON["hoard_words"] = [...]
LESSON["planner_title"] = "..."
LESSON["planner_intro"] = "..."
LESSON["explicit_teaching"] = "..."
```

### Step 6: Validate
```bash
python backend/lesson_library_s2_english_w01_l1.py
python tools/check_lesson.py backend/lesson_library_s2_english_w01_l1.py
```

### Step 7: Register
Add to `backend/lesson_library.py`:
```python
LESSON_MODULES = (
    "lesson_library_s2_english_w01_l1",  # Add this line
    ...
)
LESSON_LIBRARY_VERSION = 93  # Bump version
```

### Step 8: Add Spelling
Add to `backend/spelling_live.py`:
```python
SPELLING_LIVE = {
    "s2-eng-w01-l1-reading-expression": {
        "focus": "Syllables and long words",
        "teaching": "...",
        "words": [...],
        "check": [...]
    },
    ...
}
```

### Step 9: Commit
```bash
git add backend/lesson_library_s2_english_w01_l1.py backend/lesson_library.py backend/spelling_live.py
git commit -m "build: add Stage 2 English, Week 1, Lesson 1: Reading with Expression"
```

---

## For Perplexity (AI Builder)

When given a lesson spec and this template:

1. **You are the source of truth.** Follow this spec exactly. If something is not clear, ask the human.

2. **You must output a complete Python file.** No placeholders, no TODOs, no "to be filled in". Every field must be valid.

3. **You must validate before outputting.** Make sure:
   - Exactly 10 quiz questions
   - Exactly 8 word challenges
   - 8-9 teaching steps
   - No Python errors
   - seed_key format is correct
   - All helper function calls are correct

4. **You must reference the reference lesson.** Open the lesson passed to you (e.g., `backend/lesson_library_s2_english_w09_l1.py`) and match its **structure and detail level**, not just its content.

5. **You must follow NSW curriculum.** Check outcome codes against:
   - NSW K-10 Syllabus (NESA 2022)
   - The scope/sequence document provided
   - Previously built lessons

6. **You must cite sources for facts.** If you use a fact (e.g., "echidnas are monotremes"), note it at the top of the file so the human can verify it.

---

## Questions?

- **For file structure:** See the example at "LESSON_TEMPLATE.py" in the repo.
- **For outcome codes:** Check `backend/lesson_library_s2_english_placeholders.py` for reference codes by week and lesson slot.
- **For visuals:** See W09-L1 for SVG examples.
- **For video IDs:** Always check the link before committing.
- **For validation:** Run `python tools/check_lesson.py [file]`.

---

**This template is the source of truth for lesson building. Follow it exactly, and every lesson will be production-ready on day one.**
