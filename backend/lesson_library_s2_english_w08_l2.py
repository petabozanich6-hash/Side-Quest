"""Stage 2 English, Week 8 Lesson 2: Description Paragraph (Writing, informative).
The child learns how to write a description paragraph for an information report: a topic sentence, three or four describing sentences using precise adjectives and noun groups, and a closing sentence. The model is an original paragraph about the platypus.
Spelling: plurals -es and -ves and irregular: foxes, churches, knives, shelves, women, teeth.
Outcome codes: EN2-CWT-02 and EN2-SPELL-01, both of which exist in nsw_outcomes.py.
Video status: none. No description paragraph video has been transcript-checked, so none is included.
Do not register this module in lesson_library.py or add week 8 to BUILT_OUT_WEEKS until the whole week is built.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["foxes", "churches", "knives", "shelves", "women", "teeth"]

PLATYPUS = (
    "MODEL PARAGRAPH: THE PLATYPUS\n\n"
    "The platypus is one of the most unusual animals in Australia. It has a flat, rubbery bill like a duck's, webbed front feet and a wide, flat tail like a beaver's. Its thick, waterproof fur keeps it warm in cold creeks. The platypus hunts at night, using its bill to find shrimps and insects in the mud. It also lays eggs, which is very rare for a mammal. The platypus is a strange and special animal that is found nowhere else in the world."
)

LESSON = build(
    "s2-eng-w08-l2-description-paragraph",
    "Description Paragraph",
    "A good description paragraph paints a clear picture of one thing. Learn how to write a topic sentence, add describing sentences with precise words, and finish with a closing sentence, then write your own.",
    "Writing: description paragraph",
    ["EN2-CWT-02", "EN2-SPELL-01"],
    {
        "EN2-CWT-02": "Primary. Plans, creates and revises written texts for informative purposes, using text features, sentence-level grammar, punctuation and word-level language for a target audience. In this lesson the child writes a description paragraph with a topic sentence, describing sentences and a closing sentence.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including plural endings -es, -ves and irregular plurals (week 8 spelling focus).",
    },
    "We are learning to write a description paragraph with a topic sentence, describing sentences and a closing sentence, and to spell plurals such as foxes, knives and women.",
    [
        "I can explain what a description paragraph does.",
        "I can write a topic sentence that names and introduces my subject.",
        "I can describe my subject using appearance, habitat and behaviour.",
        "I can use precise adjectives and noun groups.",
        "I can write a closing sentence that wraps up the paragraph.",
        "I can spell and use foxes, churches, knives, shelves, women and teeth.",
    ],
    ["description", "topic sentence", "precise", "adjective", "noun group", "closing sentence"],
    ["This lesson (everything you need is inside it)", "Optional: a picture or fact page about an animal chosen by a parent"],
    "Child has planned a report (Week 6), knows a topic from a main idea (Week 7, Lesson 1) and knows a noun group.",
    (
        "Why this matters. A description paragraph helps a reader picture something they have never seen. Reports use description to tell the reader what something is like, so the reader understands and remembers it.\n\n"
        "What a description paragraph is. It is one paragraph about one subject, such as an animal, a place or an object. It tells the reader what it looks like, where it lives or is found, and what it does.\n\n"
        "The structure. A good paragraph has a topic sentence, three or four describing sentences and a closing sentence. The topic sentence names the subject and says what is special about it. The describing sentences give details. The closing sentence wraps the paragraph up.\n\n"
        "Precise words. Use exact adjectives and noun groups instead of vague words. Instead of a nice tail, write a wide, flat tail. Instead of big feet, write webbed front feet. Precise words make a clear picture.\n\n"
        "Present tense. A description of what something is like usually uses the present tense: the platypus has, it hunts, it lays eggs. This is because the facts are true now and nearly always.\n\n"
        "The routine. First, choose one subject. Second, list details for appearance, habitat and behaviour. Third, write the topic sentence. Fourth, write three or four describing sentences with precise words. Fifth, write a closing sentence. Sixth, read it aloud and check the spelling.\n\n"
        "A link to spelling. This week's spelling focus is plurals. Words such as foxes, churches, knives, shelves, women and teeth show -es, -ves and irregular patterns."
    ),
    [
        _step("1", "What a description paragraph does", "A description paragraph paints a picture of one subject. It tells the reader what the subject looks like, where it is found and what it does.\n\nIt stays on one subject from start to finish.", "The platypus paragraph describes its bill, feet, tail, fur and hunting, all about one animal.", "One subject, many details.", ("What is a description paragraph about?", ["One subject", "Many different subjects", "A made-up story"], 0, "A description paragraph stays on one subject.")),
        _step("2", "The topic sentence", "The topic sentence comes first. It names the subject and says something special about it, so the reader knows what is coming.\n\nDo not start with I am going to tell you about.", "The platypus is one of the most unusual animals in Australia.", "Name it and say what is special.", ("Which is the best topic sentence about foxes?", ["Foxes are clever animals with sharp senses", "I like foxes", "They run"], 0, "It names the subject and says what is special.")),
        _step("3", "Describing sentences", "Add three or four sentences that describe your subject. Think about appearance (what it looks like), habitat (where it lives) and behaviour (what it does).\n\nEach sentence gives one clear detail.", "Appearance: It has a flat, rubbery bill. Habitat: It lives in creeks and rivers. Behaviour: It hunts at night.", "Appearance, habitat, behaviour.", ("Which sentence is about behaviour?", ["It hunts at night", "It has thick fur", "It has a wide tail"], 0, "Hunting is something the animal does.")),
        _step("4", "Precise adjectives and noun groups", "Choose exact words, not vague ones. A noun group adds describing words to a noun, such as a wide, flat tail.\n\nReplace words such as nice, big and good with words that show the picture.", "Vague: a big tail. Precise: a wide, flat tail like a beaver's.", "Show the picture.", ("Which is more precise?", ["a nice bill", "a flat, rubbery bill", "a good bill"], 1, "Flat and rubbery show exactly what the bill is like.")),
        _step("5", "The closing sentence", "The closing sentence wraps up the paragraph. It reminds the reader of what is special about the subject. Do not add a new fact.\n\nIt can use different words from the topic sentence.", "The platypus is a strange and special animal that is found nowhere else in the world.", "Wrap it up.", ("What does a closing sentence do?", ["Wraps up the paragraph", "Starts a new subject", "Asks a question"], 0, "It finishes the paragraph by reminding the reader of the main idea.")),
        _step("6", "Spelling focus: plurals", "Words ending in x, ch, sh or s add -es: foxes, churches. Words ending in f or fe often change to -ves: knives, shelves. Some change completely: woman to women, tooth to teeth.\n\nLearn each word, then check it.", "The women put the knives on the shelves in the church.", "Check the ending before you write.", ("Which is the correct plural of knife?", ["knifes", "knives", "knifs"], 1, "Knife changes to knives.")),
    ],
    (
        "Let's study a model description paragraph. The subject is the platypus, and all the sentences are about it. Sentence one is the topic sentence: it names the platypus and says it is one of the most unusual animals in Australia. Sentence two is about appearance: a flat, rubbery bill, webbed front feet and a wide, flat tail. Sentence three describes its fur, which is thick and waterproof. Sentence four is about behaviour: it hunts at night and uses its bill to find food. Sentence five gives an interesting fact: it lays eggs, which is rare for a mammal. The last sentence is the closing sentence: it wraps up by saying the platypus is strange and special and found nowhere else in the world. Notice that every sentence uses the present tense, and the describing words are precise.\n\n" + PLATYPUS
    ),
    (
        "Type your answers in the practice boxes. Part A: label each sentence in the platypus paragraph as topic, describing or closing. Part B: rewrite the vague sentence with precise words. The animal has a big nice tail. Part C: write a topic sentence for a paragraph about the fox. Part D: type the correct plural for each blank. Choose from foxes, churches, knives, shelves, women and teeth. The ___ sharpened the ___. There are two old ___ in our town. Brush your ___ every day. Your parent can check your answers against the answer key."
    ),
    (
        "Write a description paragraph of your own. Typed answers go in the boxes. Use the platypus paragraph as a model.\n\n" + PLATYPUS + "\n\n"
        "Stage 1 (choose): with a parent, choose an animal, a place or an object you can describe well. Type it.\n"
        "Stage 2 (details): type two details for appearance, two for habitat or where it is found, and two for behaviour.\n"
        "Stage 3 (topic sentence): write a topic sentence that names the subject and says what is special about it.\n"
        "Stage 4 (describe): write three or four describing sentences using precise adjectives and noun groups.\n"
        "Stage 5 (close): write a closing sentence that wraps up your paragraph.\n"
        "Stage 6 (check): read your paragraph aloud. Check that it stays on one subject, uses the present tense and has no vague words such as nice or big. Type one change you made.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of foxes, knives and teeth.\n\n"
        "Parent: check that the topic sentence names the subject, that the describing sentences cover appearance, habitat and behaviour, that precise words are used, and that the paragraph uses the present tense. Accept any sensible subject and wording. Help with facts if the child needs a source."
    ),
    "Why do precise words help a reader picture something more clearly than vague words?",
    "Did I write a topic sentence, three or four describing sentences with precise words, a closing sentence, stay on one subject, use the present tense, and spell foxes, churches, knives, shelves, women and teeth correctly?",
    [
        _q("What does a description paragraph do?", ["Paints a picture of one subject", "Tells a made-up story", "Asks questions", "Lists unrelated facts"], 0, "It describes one subject clearly."),
        _q("What does a topic sentence do?", ["Names the subject and says what is special", "Wraps up the paragraph", "Gives the last fact", "Starts a new subject"], 0, "The topic sentence introduces the subject."),
        _q("Which three things can you describe?", ["Appearance, habitat and behaviour", "Name, age and size only", "Colour only", "Spelling only"], 0, "These are the main things a description covers."),
        _q("Which is the most precise?", ["a nice animal", "a furry, brown animal", "a good animal", "a big animal"], 1, "Furry and brown show the picture."),
        _q("What does a closing sentence do?", ["Wraps up the paragraph", "Adds a new subject", "Asks a question", "Repeats every fact"], 0, "It finishes the paragraph."),
        _q("Which tense do descriptions of animals usually use?", ["Present tense", "Future tense", "Past tense only", "No tense"], 0, "Facts that are true now use the present tense."),
        _q("What is a noun group?", ["A noun with describing words, such as a wide, flat tail", "A group of verbs", "A group of sentences", "A kind of heading"], 0, "A noun group adds describing words to a noun."),
        _q("Which is the correct plural of church?", ["churchs", "churches", "churchies", "churchen"], 1, "Words ending in ch add -es."),
        _q("Which is the correct plural of shelf?", ["shelfs", "shelves", "shelfes", "shelvs"], 1, "Shelf changes to shelves."),
        _q("Which is the correct plural of woman?", ["womans", "womens", "women", "womanes"], 2, "Woman changes to women."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: write a second paragraph about a different subject. Swap with a family member and ask them to draw what they picture from your words.",
    [("description", "Words that tell what something is like"), ("topic sentence", "The first sentence, which names the subject and says what is special"), ("precise", "Exact and clear, not vague"), ("adjective", "A word that describes a noun"), ("noun group", "A noun with describing words, such as a wide, flat tail"), ("closing sentence", "The last sentence, which wraps up the paragraph")],
    [],
    _sort("Which part of the paragraph?", "Sort each sentence from the platypus paragraph into the right group.", ["Topic sentence", "Describing sentence", "Closing sentence"], [("The platypus is one of the most unusual animals in Australia", 0), ("It has a flat, rubbery bill like a duck's", 1), ("The platypus is a strange and special animal found nowhere else", 2), ("Its thick, waterproof fur keeps it warm", 1), ("It hunts at night", 1), ("It also lays eggs", 1)]),
    [
        _wc("Which names the subject and says what is special?", ["topic sentence", "closing sentence", "title"], 0, "The topic sentence introduces the subject."),
        _wc("Which means exact and clear?", ["vague", "precise", "nice"], 1, "Precise words are exact."),
        _wc("Which describes a noun?", ["adjective", "verb", "pronoun"], 0, "An adjective describes a noun."),
        _wc("Which is spelled correctly?", ["foxes", "foxs", "foxies"], 0, "Fox ends in x, so add -es."),
        _wc("Which is spelled correctly?", ["churchs", "churchies", "churches"], 2, "Church ends in ch, so add -es."),
        _wc("Which is spelled correctly?", ["knifes", "knives", "knifs"], 1, "Knife changes to knives."),
        _wc("Which is spelled correctly?", ["shelves", "shelfs", "shelfes"], 0, "Shelf changes to shelves."),
        _wc("Which is spelled correctly?", ["womans", "women", "womens"], 1, "Woman changes to women."),
    ],
    [
        {"key": "partA", "label": "Part A: label the sentences", "hint": "Type topic, describing or closing for each sentence in the platypus paragraph."},
        {"key": "partB", "label": "Part B: precise words", "hint": "Rewrite the big nice tail sentence with precise words."},
        {"key": "partC", "label": "Part C: topic sentence", "hint": "A topic sentence about the fox."},
        {"key": "partD", "label": "Part D: plurals", "hint": "Fill the blanks. Choose from foxes, churches, knives, shelves, women and teeth."},
        {"key": "stage1", "label": "My subject", "hint": "The animal, place or object you chose."},
        {"key": "stage2", "label": "My details", "hint": "Two details each for appearance, habitat and behaviour."},
        {"key": "stage3", "label": "Topic sentence", "hint": "Name the subject and say what is special."},
        {"key": "stage4", "label": "Describing sentences", "hint": "Three or four sentences with precise words."},
        {"key": "stage5", "label": "Closing sentence", "hint": "Wrap up your paragraph."},
        {"key": "stage6", "label": "Check", "hint": "One change you made after reading aloud."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence for each of foxes, knives and teeth."},
    ],
    ["Writing about more than one subject in a paragraph", "Using vague words such as nice, big and good", "Starting with I am going to tell you about", "Adding a new fact in the closing sentence", "Switching between present and past tense", "Writing plurals such as knifes, shelfs or womans"],
    ["Describe a family pet or a favourite toy in one paragraph.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: topic, describing, describing, describing, describing, closing. Part B: accept a rewrite such as The animal has a wide, bushy tail. Part C: accept any topic sentence that names the fox and says what is special, such as The fox is a clever animal with sharp eyes and a bushy tail. Part D: women; knives; churches; teeth, or accept foxes, shelves where they fit (the key is: women, knives, churches, teeth). Main task: accept any sensible subject; two details in each of appearance, habitat and behaviour; a topic sentence naming the subject; three or four describing sentences with precise words in the present tense; a closing sentence that wraps up without a new fact; honest checking. Quiz answers: paints a picture of one subject; names the subject and says what is special; appearance, habitat and behaviour; a furry, brown animal; wraps up the paragraph; present tense; a noun with describing words, such as a wide, flat tail; churches; shelves; women.",
)

LESSON["spelling"] = {
    "focus": "Plurals: -es, -ves and irregular",
    "teaching": "Words ending in x, ch, sh or s add -es (foxes, churches). Many words ending in f or fe change to -ves (knives, shelves). Some change completely (woman to women, tooth to teeth). Say each word slowly and check the ending.",
    "words": [
        _w("foxes", "fox-es", "fox + es"),
        _w("churches", "church-es", "church + es"),
        _w("knives", "knives", "knife changes fe to ves"),
        _w("shelves", "shelves", "shelf changes f to ves"),
        _w("women", "wom-en", "irregular: woman changes to women"),
        _w("teeth", "teeth", "irregular: tooth changes to teeth"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["knifes", "knives", "knifs"], 1, "Knife changes to knives."),
        _c("Which is spelled correctly?", ["foxs", "foxes", "foxies"], 1, "Fox ends in x, so add -es."),
    ],
}
LESSON["spelling_focus"] = "Plurals: -es, -ves and irregular"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
