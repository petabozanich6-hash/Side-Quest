"""Stage 2 English: 50-week placeholder lessons (200 lessons), generated from one table.
Source plan: docs/english_s2_scope_and_sequence.md.

OUTCOMES: all 11 Stage 2 outcomes of the English K-10 Syllabus (2022) are covered, checked against
the NESA outcomes page on curriculum.nsw.edu.au (Oct 2026): EN2-OLC-01, EN2-VOCAB-01, EN2-REFLU-01,
EN2-RECOM-01, EN2-CWT-01/02/03, EN2-SPELL-01, EN2-HANDW-01/02, EN2-UARL-01. Writing lessons use
CWT-01 (imaginative) in narrative, poetry, novel and myth units, CWT-02 (informative) in report,
explanation and research units, and CWT-03 (persuasive) in persuasion units.

The library starts again from scratch: ONLY these placeholders are registered.
Older lesson files are not registered. lesson_library_s2_english_w1_w2.py is kept
only because this module imports its build helpers (build, _q, _step).

TO BUILD A WEEK OUT: write a full module for that week (keys may include a name,
e.g. s2-eng-w02-l1-story-elements), register the module in lesson_library.py
LESSON_MODULES, and add the week number to BUILT_OUT_WEEKS below. The generator
then skips that week, so there are no duplicates and nothing else changes.

SPELLING: every lesson has Step 6 'Spelling', which shows the week's spelling focus.
Each lesson dict has an empty 'hoard_words' list. Word Hoard wiring is DEFERRED until
the lessons are built (see the plan note in the scope and sequence doc). Until then,
words reach the Hoard only when someone adds them by hand.

NOVELS: weeks in NOVEL_WEEKS are written broadly so the parent can allocate any novel.
They use the words 'your class novel' and never name a title.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step

BUILT_OUT_WEEKS = {1, 2, 3, 4, 5, 6, 7, 8}
NOVEL_WEEKS = {21, 22, 23, 24, 25, 46, 47}

OUTCOMES = {
    "EN2-OLC-01": "communicates with familiar audiences for social and learning purposes, by interacting, understanding and presenting",
    "EN2-VOCAB-01": "builds knowledge and use of Tier 1, Tier 2 and Tier 3 vocabulary through interacting, wide reading and writing, and by defining and analysing words",
    "EN2-REFLU-01": "sustains independent reading with accuracy, automaticity, rate and prosody suited to purpose, audience and meaning",
    "EN2-RECOM-01": "reads and comprehends texts for wide purposes using knowledge of text structures and language, and by monitoring comprehension",
    "EN2-CWT-01": "plans, creates and revises written texts for imaginative purposes, using text features, sentence-level grammar, punctuation and word-level language for a target audience",
    "EN2-CWT-02": "plans, creates and revises written texts for informative purposes, using text features, sentence-level grammar, punctuation and word-level language for a target audience",
    "EN2-CWT-03": "plans, creates and revises written texts for persuasive purposes, using text features, sentence-level grammar, punctuation and word-level language for a target audience",
    "EN2-SPELL-01": "selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts",
    "EN2-HANDW-01": "forms legible joined letters to develop handwriting fluency",
    "EN2-HANDW-02": "uses digital technologies to create texts",
    "EN2-UARL-01": "identifies and describes how ideas are represented in literature and strategically uses similar representations when creating texts",
}
LITERATURE_WEEKS = set(range(1, 6)) | set(range(11, 16)) | set(range(21, 31)) | set(range(41, 48))
INFORMATIVE_WEEKS = set(range(6, 11)) | set(range(31, 36)) | set(range(48, 51))
PERSUASIVE_WEEKS = set(range(16, 21)) | set(range(36, 41))
DIGITAL_WEEKS = {5, 10, 34, 35, 49}

UNITS = {
    1: "Narrative foundations", 6: "Information reports", 11: "Poetry", 16: "Persuasive texts",
    21: "Novel study 1", 26: "Narrative, Year 4 depth", 31: "Explanations and procedures",
    36: "Persuasion and media", 41: "Myths, legends and Aboriginal stories",
    46: "Novel study 2, research and portfolio",
}

# (L1 reading, L2 writing, L3 language, L4 oral / handwriting / literature, spelling focus)
WEEKS = [
    ("Reading with expression", "Sentence builder", "Spelling detective: four strategies", "Storytelling aloud and joined handwriting", "Strategies and syllables"),
    ("Story elements: character, setting, plot", "Planning a story with a story mountain", "Nouns, verbs and adjectives", "Retelling a story aloud; joined handwriting", "Vowel teams: ai, ay, ee, ea, oa"),
    ("Predicting and questioning", "Orientation and complication", "Verb tense and adverbs", "Readers theatre: dialogue aloud", "Suffix rules: -ing, -ed"),
    ("Inference from clues", "Show, don't tell", "Conjunctions and complex sentences", "Handwriting speed and legibility", "Prefixes: un-, re-, dis-, mis-"),
    ("Summarising a story", "Resolution; revising and editing", "Punctuating dialogue", "Publish and read your story", "Homophones: there, their, they're"),
    ("Text features: headings, glossary, index", "Planning a report", "Technical words and vocabulary", "Listening and note-taking", "-tion"),
    ("Main idea and key details", "Classification paragraph", "Pronouns and cohesion", "Finding reliable sources", "-sion and -ssion"),
    ("Fact versus opinion", "Description paragraph", "Timeless present tense", "Oral presentation skills", "Plurals: -s, -es, -ves, irregular"),
    ("Diagrams, graphs and captions", "Report with visuals", "Compound and complex sentences", "Handwriting for labels and captions", "Silent letters: kn, wr, mb, gn"),
    ("Synthesising two texts", "Edit and publish the report", "Punctuation review: commas and apostrophes", "Present the report (Fortnight 5 mini exam)", "Review of Weeks 6 to 9"),
    ("What makes a poem: rhyme and rhythm", "Writing a rhyming poem", "Alliteration and onomatopoeia", "Performing poems", "ph, ch, gh sounds"),
    ("Imagery: simile and metaphor", "Simile and metaphor poems", "Noun groups with adjectives", "Haiku and syllable counting", "Syllable patterns and double letters"),
    ("Free verse and mood", "Free verse about nature", "Strong verbs", "Poetry recital", "Suffixes: -ful, -less, -ly"),
    ("Australian bush ballads", "Writing a ballad", "Synonyms, antonyms and thesaurus use", "Choral reading", "Homophones 2: to, too, two; here, hear"),
    ("Comparing two poems", "Poem response paragraph", "Figurative language review", "Poetry anthology; joined handwriting", "Review"),
    ("Persuasion in everyday texts", "Opinion and reasons", "Modality: should, must, might", "Debate basics", "-ous and -ious"),
    ("Reading an argument", "Position statement", "Connectives for reasons", "Listening to speeches", "-able and -ible"),
    ("Bias and audience", "Argument paragraphs with evidence", "Emotive language", "Rebuttal practice", "in-, im-, il-, ir-"),
    ("Advertisements and posters", "Persuasive letter", "Letter conventions and formal language", "Handwriting a formal letter", "-er, -or, -ar"),
    ("Evaluating arguments", "Final exposition", "Clause review", "Present a speech (Fortnight 10 mini exam)", "Review"),
    ("Setting and prediction", "Diary entry in role", "Verb groups and tense", "Read-aloud and discussion", "Soft c and g"),
    ("Character traits and evidence", "Character description", "Adverbials of time and place", "Hot seat: interviewing a character", "-ie and -ei"),
    ("Plot and problem", "Plot summary", "Paragraph cohesion", "Book discussion circle", "Greek roots: auto, tele, photo"),
    ("Theme and author's message", "Theme paragraph", "Direct and indirect speech", "Readers theatre of a chapter", "Latin roots: port, rupt, scrib"),
    ("Author's craft", "Book review", "Language review", "Portfolio checkpoint (Fortnight 12 mini exam)", "Review"),
    ("Narrative structure variations", "Building suspense", "Relative clauses", "Oral storytelling", "Suffix rules revisited: y to i, doubling"),
    ("Point of view: first and third person", "Dialogue and character voice", "Advanced dialogue punctuation", "Handwriting speed", "Homophones 3"),
    ("Setting description", "Descriptive writing using the senses", "Prepositional phrases", "Reading illustrations and visual texts", "-cial and -tial"),
    ("Plot twists and endings", "Drafting a long narrative", "Sentence variety", "Peer feedback", "Prefixes: sub-, inter-, super-"),
    ("Reading as a writer", "Revise and publish", "Editing checklist", "Present the story", "Review"),
    ("Reading procedures", "Writing a procedure", "Imperative verbs", "Demonstrating a procedure aloud", "Science words"),
    ("Cause and effect in explanations", "Planning an explanation", "Causal connectives", "Explaining a process orally", "-ence and -ance"),
    ("Diagrams and flow charts", "Explanation with a diagram", "Technical language", "Handwriting labelled diagrams", "-ment and -ness"),
    ("Reading websites and digital texts", "Searching and note-making", "Reliable and unreliable sources", "Digital citizenship and presenting", "Compound words"),
    ("Comparing two explanations", "Publish an explanation", "Language review (mini exam)", "Present to an audience", "Review"),
    ("News articles: structure", "Writing a news report", "Headlines and noun groups", "Radio news reading", "-ful and -ous review"),
    ("Fact-checking claims", "Evidence paragraphs", "Quoting sources", "Interviewing", "Silent letters 2"),
    ("Advertising techniques", "Designing an advertisement", "Slogans and wordplay", "Pitch to an audience", "Homophones 4"),
    ("Comparing two viewpoints", "Balanced discussion text", "Contrast connectives", "Class debate", "Prefixes: anti-, auto-, trans-"),
    ("Reading a multimodal text", "Multimodal persuasive presentation", "Review", "Present (mini exam)", "Review"),
    ("Dreaming stories and cultural protocols", "Retelling with respect for sources", "Verb types and tense", "Listening to oral storytelling", "Place-name spelling"),
    ("Greek myths", "Myth planning", "Noun and pronoun agreement", "Dramatic retelling", "Latin roots 2"),
    ("Folktales from around the world", "Writing a folktale", "Direct speech review", "Readers theatre", "-ough words"),
    ("Legend structure", "Writing a legend", "Sentence variety", "Peer feedback", "Homophones 5"),
    ("Comparing myths and legends", "Compare and contrast paragraph", "Review (mini exam)", "Present a legend", "Review"),
    ("Setting and character", "Writing in role", "Language review", "Book discussion", "Revision of weekly lists"),
    ("Plot and theme", "Theme response", "Punctuation review", "Readers theatre", "Revision"),
    ("Research project: choose and plan", "Research report draft", "Citing sources", "Oral presentation practice", "Revision"),
    ("Portfolio selection", "Revise best pieces", "Final grammar review", "Present research project", "Revision"),
    ("End-of-year reading assessment", "End-of-year writing task", "Language and spelling check", "Reflection and celebration", "Spelling test"),
]

SLOTS = ["Reading and comprehension", "Writing", "Language", "Oral language and handwriting"]


def _unit_for(week):
    start = max(k for k in UNITS if k <= week)
    return UNITS[start]


def _codes_for(week, slot, topic):
    if slot == 0:
        codes = ["EN2-RECOM-01"]
        if week % 5 == 1:
            codes.append("EN2-REFLU-01")
        if week in LITERATURE_WEEKS:
            codes.append("EN2-UARL-01")
    elif slot == 1:
        if week in PERSUASIVE_WEEKS:
            codes = ["EN2-CWT-03"]
        elif week in INFORMATIVE_WEEKS:
            codes = ["EN2-CWT-02"]
        else:
            codes = ["EN2-CWT-01"]
    elif slot == 2:
        codes = ["EN2-VOCAB-01"]
    else:
        codes = ["EN2-OLC-01"]
        if "andwriting" in topic:
            codes.append("EN2-HANDW-01")
        if week in DIGITAL_WEEKS:
            codes.append("EN2-HANDW-02")
    return codes + ["EN2-SPELL-01"]


def _make(week, slot, topic, spelling):
    novel = week in NOVEL_WEEKS
    codes = _codes_for(week, slot, topic)
    title = "Week %d, Lesson %d: %s" % (week, slot + 1, topic)
    if novel:
        title += " (your class novel)"
    unit = _unit_for(week)
    novel_line = (" This lesson uses the novel your parent has chosen. Use that book for every example and task." if novel else "")
    placeholder = "PLACEHOLDER. Full teaching content for this lesson will be added later."
    check = ("Placeholder check: choose the first answer.", ["Yes", "No"], 0, "Placeholder only.")
    steps = [
        _step("%d" % i, "Part %d" % i, placeholder + novel_line, "Example to be added.", "Key idea to be added.", check)
        for i in range(1, 6)
    ]
    steps.append(_step("6", "Spelling: " + spelling,
                       "This week's spelling focus is: " + spelling + ". Use words from this lesson, and use Look, Say, Cover, Write, Check for the tricky ones. You can add any tricky words to your Word Hoard yourself.",
                       "Example words to be added.", "Spelling is practised in every lesson, not only in spelling lessons.", check))
    notes = {c: OUTCOMES[c] for c in codes}
    lesson = build(
        "s2-eng-w%02d-l%d" % (week, slot + 1), title,
        "Placeholder lesson: %s. %s.%s" % (topic, SLOTS[slot], novel_line),
        unit, codes, notes,
        "We are learning about: " + topic + ".",
        ["I can explain the main idea of this lesson.", "I can use it in my own work.", "I can spell this week's focus words."],
        [], ["Paper or notebook", "Pencil"], "To be added.", placeholder, steps,
        "To be added.", "To be added.", "To be added.",
        "Write your answers in your notebook.", "To be added.", [],
        "To be added.", "To be added.", [], [], None, [], [], [], [], "To be added.")
    lesson["learning_area"] = "English"
    lesson["reflection_prompts"] = []
    lesson["interactive_activities"] = []
    lesson["sort_activity"] = None
    lesson["word_challenges"] = []
    lesson["follow_up_challenges"] = []
    lesson["resources"] = []
    lesson["hoard_words"] = []
    lesson["spelling_focus"] = spelling
    lesson["is_placeholder"] = True
    lesson["novel_allocated_by_parent"] = novel
    lesson["parent_notes"] = "PLACEHOLDER lesson. Not ready to teach. Practice lesson only."
    return lesson


LESSONS = []
for _w, _row in enumerate(WEEKS, start=1):
    if _w in BUILT_OUT_WEEKS:
        continue
    for _slot in range(4):
        LESSONS.append(_make(_w, _slot, _row[_slot], _row[4]))


if __name__ == "__main__":
    keys = [l["seed_key"] for l in LESSONS]
    assert len(keys) == len(set(keys)), "duplicate seed keys"
    assert len(LESSONS) == 200 - 4 * len(BUILT_OUT_WEEKS), len(LESSONS)
    used = {c for l in LESSONS for c in l["outcome_codes"]}
    assert used <= set(OUTCOMES), set(OUTCOMES) ^ used
    print("OK: %d placeholder lessons, built weeks skipped" % len(LESSONS))
