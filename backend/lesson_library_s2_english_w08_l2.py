"""Stage 2 English, Week 8 Lesson 2: Description Paragraph (Writing).
The child learns how to write a description paragraph for an information report: a topic sentence, detail sentences with precise adjectives and noun groups, and a concluding sentence. The model paragraph describes the echidna.
Spelling: plurals: classes, bunches, leaves, shelves, mice, teeth.
Outcomes: EN2-CWT-02 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 8, Lesson 2, Description paragraph, writing slot, informative week, spelling plurals). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Video status: two videos attached (paragraph structure; plural spelling rules), chosen from search descriptions. They have not been watched in full, so each carries a parent preview note.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["classes", "bunches", "leaves", "shelves", "mice", "teeth"]

MODEL = (
    "MODEL PARAGRAPH: THE ECHIDNA\n\n"
    "The echidna is a small, spiny mammal that lives across Australia. "
    "Its body is covered in sharp, cream-coloured spines, and it has soft brown fur between them. "
    "It has a long, thin snout with no teeth, and it uses its sticky tongue to catch ants and termites. "
    "Strong claws on its short legs help it dig quickly into the soil. "
    "The echidna's spines and digging skills help to keep it safe."
)

LESSON = build(
    "s2-eng-w08-l2-description-paragraph",
    "Description Paragraph",
    "Learn how to write a description paragraph for an information report, with a topic sentence, precise detail and a concluding sentence.",
    "Writing: description paragraph",
    ["EN2-CWT-02", "EN2-SPELL-01"],
    {
        "EN2-CWT-02": "Plans, creates and revises written texts for informative purposes, using text features, sentence-level grammar, punctuation and word-level language for a target audience. This lesson focuses on writing a description paragraph with precise noun groups.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is plurals: -s, -es, -ves and irregular plurals.",
    },
    "We are learning how to write a description paragraph that helps a reader picture something, and to spell plurals.",
    [
        "I can explain what a description paragraph does.",
        "I can write a clear topic sentence.",
        "I can add detail using precise adjectives and noun groups.",
        "I can write a concluding sentence.",
        "I can check that my facts are true and my paragraph is in the present tense.",
        "I can spell and use classes, bunches, leaves, shelves, mice and teeth.",
    ],
    ["describe", "paragraph", "topic sentence", "detail", "adjective", "noun group", "concluding sentence", "feature"],
    ["This lesson (everything you need is inside it)", "Paper or a computer for writing", "A reliable book or website about an animal you choose"],
    "Child has written a classification paragraph (Week 7 Lesson 2), knows how to find reliable sources (Week 7 Lesson 4), and can tell facts from opinions (Week 8 Lesson 1).",
    (
        "Why this matters. An information report often has a description paragraph. It tells the reader what something looks like and what features it has. A good description helps the reader picture the animal, place or thing clearly.\n\n"
        "The parts of the paragraph. A description paragraph has a topic sentence, detail sentences, and a concluding sentence. The topic sentence tells the main idea and names the subject. The detail sentences tell about its body, size, colour, covering and special features. The concluding sentence wraps up the main idea.\n\n"
        "Precise words. Precise words help the reader see. Sharp, cream-coloured spines is clearer than nice spines. A noun group is a noun with words that describe it, such as a long, thin snout. Use adjectives that give size, colour, shape and texture.\n\n"
        "Use facts. In an information report, we write facts, not opinions. Check each detail in a reliable source, and leave out words like cute or best.\n\n"
        "Present tense. Reports are usually written in the present tense, as in it has and it lives. Keep your verbs in the present tense all through the paragraph.\n\n"
        "A link to spelling. This week's spelling focus is plurals. Most words add s. Words ending in s, x, z, ch or sh add es, as in classes and bunches. Many words ending in f or fe change to ves, as in leaves and shelves. Some plurals are irregular, as in mice and teeth."
    ),
    [
        _step("1", "What a description does", "A description paragraph helps the reader picture something. It tells what it looks like and what features it has.\n\nIn a report, it uses facts, not opinions.", "The echidna has sharp spines and a long, thin snout.", "Help the reader picture it.", ("What does a description paragraph do?", ["Tells the reader what something looks like and is like", "Tells a story with a problem", "Asks the reader questions"], 0, "It helps the reader picture the subject.")),
        _step("2", "The topic sentence", "The topic sentence comes first. It names the subject and tells the main idea.\n\nIt should be clear and true.", "The echidna is a small, spiny mammal that lives across Australia.", "Name the subject and the main idea.", ("What is a topic sentence?", ["The sentence that tells the main idea", "The last word of a paragraph", "A title"], 0, "The topic sentence tells the main idea.")),
        _step("3", "Detail sentences", "Next, add detail sentences. Each one tells about a feature, such as its covering, its snout, its legs or its size.\n\nOne feature in each sentence keeps the paragraph clear.", "It has a long, thin snout with no teeth, and it uses its sticky tongue to catch ants and termites.", "One feature at a time.", ("What goes in the middle of a description paragraph?", ["Detail sentences about features", "Only the title", "Only a joke"], 0, "Detail sentences go in the middle.")),
        _step("4", "Precise adjectives and noun groups", "Use adjectives that tell size, colour, shape or texture. A noun group is a noun with words that describe it.\n\nPrecise words help the reader see.", "Sharp, cream-coloured spines is clearer than nice spines.", "Make the noun group precise.", ("Which noun group gives the most detail?", ["sharp, cream-coloured spines", "nice spines", "some spines"], 0, "Sharp, cream-coloured spines is the most precise.")),
        _step("5", "The concluding sentence", "The concluding sentence wraps up the paragraph. It links back to the main idea, and it does not start a new topic.\n\nKeep it short and clear.", "The echidna's spines and digging skills help to keep it safe.", "Wrap up the main idea.", ("What does a concluding sentence do?", ["Wraps up the main idea", "Starts a new topic", "Repeats the first word"], 0, "A concluding sentence wraps up the main idea.")),
        _step("6", "Facts and present tense", "Check each detail in a reliable source, and leave out opinions such as cute or best. Keep your verbs in the present tense, such as has, lives and eats.\n\nRead it again and fix anything that is not a fact.", "The echidna has strong claws. It digs into the soil.", "Facts, in the present tense.", ("Which sentence is written in the present tense?", ["The echidna has strong claws.", "The echidna had strong claws.", "The echidna will have strong claws."], 0, "Has is the present tense.")),
        _step("7", "Spelling focus: plurals", "Most words add s. Words ending in s, x, z, ch or sh add es, as in classes and bunches. Many words ending in f or fe change to ves, as in leaves and shelves. Some plurals are irregular, as in mice and teeth.\n\nSay the word, think about the ending, then write it.", "One class, two classes. One shelf, two shelves. One mouse, two mice.", "s, es, ves, or irregular.", ("What is the plural of mouse?", ["mice", "mouses", "mices"], 0, "Mouse has an irregular plural, mice.")),
    ],
    (
        "Let's look at how a description paragraph is built. Here is my model. The echidna is a small, spiny mammal that lives across Australia. Its body is covered in sharp, cream-coloured spines, and it has soft brown fur between them. It has a long, thin snout with no teeth, and it uses its sticky tongue to catch ants and termites. Strong claws on its short legs help it dig quickly into the soil. The echidna's spines and digging skills help to keep it safe. First, the topic sentence. It names the echidna and gives the main idea: a small, spiny mammal. Next, the detail sentences. One is about its covering, one is about its snout and tongue, and one is about its legs and claws. Each has a noun group with precise adjectives, such as sharp, cream-coloured spines and a long, thin snout. Everything is a fact that I could check in a reliable book, and there are no opinions like cute. The verbs are all in the present tense: is, has, uses, help. Last, the concluding sentence wraps up the main idea by linking spines and digging to staying safe. Now you will plan your own paragraph about an animal you choose.\n\n" + MODEL
    ),
    (
        "Type your answers in the practice boxes. Part A: type a noun group with two adjectives to describe a koala's fur. Part B: type a topic sentence for a paragraph about the kangaroo. Part C: type the plural for each: one mouse, two ___. One shelf, two ___. One class, two ___. Your parent can check your answers against the answer key."
    ),
    (
        "Write your own description paragraph. Typed answers go in the boxes. Use the model paragraph to help you.\n\n" + MODEL + "\n\n"
        "Stage 1 (choose): type the animal you will describe.\n"
        "Stage 2 (notes): use a reliable book or website. Type four features, such as size, covering, colour, head, legs or special features.\n"
        "Stage 3 (topic sentence): type your topic sentence. Name the animal and give the main idea.\n"
        "Stage 4 (details): type three detail sentences, one feature in each. Use at least two noun groups with precise adjectives.\n"
        "Stage 5 (conclusion): type your concluding sentence.\n"
        "Stage 6 (check): type your complete paragraph. Check that every detail is a fact, that there are no opinions, and that your verbs are in the present tense.\n"
        "Stage 7 (improve): type one change you made to make a word more precise.\n"
        "Stage 8 (spell): type your six spelling words and one sentence for each of classes, shelves and mice.\n\n"
        "Parent: check that the paragraph has a clear topic sentence naming the animal, three detail sentences about different features, a concluding sentence that links back to the main idea, noun groups with precise adjectives, facts rather than opinions, and the present tense throughout. Accept any sensible animal. Check the facts against a reliable source if you can."
    ),
    "Which was harder for you: finding precise adjectives, or keeping to facts in the present tense, and what will you do next time you write a description?",
    "Did I write a clear topic sentence, three detail sentences with precise noun groups, and a concluding sentence, keep to facts in the present tense, and spell classes, bunches, leaves, shelves, mice and teeth correctly?",
    [
        _q("What does a description paragraph do?", ["Tells the reader what something looks like and is like", "Tells a story with a problem", "Asks the reader questions", "Lists only numbers"], 0, "It helps the reader picture the subject."),
        _q("What is a topic sentence?", ["The sentence that tells the main idea", "The last word of a paragraph", "A title", "A question mark"], 0, "The topic sentence tells the main idea."),
        _q("Which is the best topic sentence about the echidna?", ["The echidna is a small, spiny mammal that lives across Australia.", "I like animals.", "Echidna.", "Yesterday I went outside."], 0, "It names the subject and tells the main idea."),
        _q("Which noun group gives the most detail?", ["sharp, cream-coloured spines", "nice spines", "some spines", "the spines"], 0, "Sharp, cream-coloured spines is the most precise."),
        _q("What goes in the middle of a description paragraph?", ["Detail sentences about features", "Only the title", "Only a joke", "The author's name"], 0, "Detail sentences go in the middle."),
        _q("What does a concluding sentence do?", ["Wraps up the main idea", "Starts a new topic", "Asks for money", "Repeats the first word"], 0, "A concluding sentence wraps up the main idea."),
        _q("Which is a noun group?", ["a long, thin snout", "runs fast", "very slowly", "and then"], 0, "A long, thin snout is a noun with describing words."),
        _q("Why use precise words such as sticky tongue?", ["To help the reader picture it clearly", "To make the writing shorter", "To leave out facts", "To use fewer sentences"], 0, "Precise words help the reader see."),
        _q("What is the plural of mouse?", ["mouses", "mice", "mices", "meese"], 1, "Mouse has an irregular plural, mice."),
        _q("What is the plural of shelf?", ["shelfs", "shelves", "shelfes", "shelvs"], 1, "Shelf changes to shelves."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: write a second description paragraph about a place, such as a beach or a bush track, and use precise noun groups to help the reader picture it. Read both paragraphs aloud to a family member.",
    [("describe", "To tell what something is like"), ("paragraph", "A group of sentences about one main idea"), ("topic sentence", "The sentence that tells the main idea of a paragraph"), ("detail", "A small piece of information that adds to the main idea"), ("adjective", "A word that describes a noun"), ("noun group", "A noun with words that describe it, such as a long, thin snout"), ("concluding sentence", "The sentence that wraps up a paragraph"), ("feature", "A part or quality that something has")],
    [
        _video(
            "How to Write a Paragraph for Kids (Grades 3-5)", "kw9GOUqSc5M",
            "Watch for the three parts of a paragraph: the topic sentence, the supporting details and the concluding sentence. Notice how each part matches the echidna model in this lesson. Parent: this video has not been fully checked, so please preview it before your child watches.",
            "If the video will not play, reread Steps 2 to 5 and the echidna model paragraph.",
            ("Which three parts does a paragraph have?", ["Topic sentence, details and concluding sentence", "Title, picture and caption", "Question, answer and score"], 0, "A paragraph has a topic sentence, details and a concluding sentence."),
        ),
        _video(
            "Spelling Rules for Plural Nouns: -s, -es, -ies, -ves", "-bwAPUnMWCQ",
            "Listen for when to add s, es and ves. Focus on the parts about words ending in ch, s and f or fe, which match classes, bunches, leaves and shelves. You can skip the parts about other endings. Parent: this video has not been fully checked, so please preview it before your child watches.",
            "If the video will not play, reread Step 7 and say each plural rule aloud.",
            ("What is the plural of shelf?", ["shelves", "shelfs", "shelfes"], 0, "Shelf changes to shelves."),
        ),
    ],
    _sort("Precise or vague?", "Sort each phrase into precise detail or vague word.", ["Precise detail", "Vague word"], [("sharp, cream-coloured spines", 0), ("a nice animal", 1), ("sticky tongue", 0), ("pretty cool", 1), ("strong claws", 0), ("some things", 1), ("long, thin snout", 0), ("it is good", 1)]),
    [
        _wc("Which means a group of sentences about one main idea?", ["paragraph", "title", "caption"], 0, "A paragraph is a group of sentences about one main idea."),
        _wc("Which is the sentence that tells the main idea?", ["concluding sentence", "topic sentence", "question"], 1, "The topic sentence tells the main idea."),
        _wc("Which is a word that describes a noun?", ["verb", "adverb", "adjective"], 2, "An adjective describes a noun."),
        _wc("Which means a part or quality that something has?", ["feature", "opinion", "source"], 0, "A feature is a part or quality that something has."),
        _wc("Which is the correct plural of class?", ["clases", "classes", "classs"], 1, "Words ending in ss add es, so class becomes classes."),
        _wc("Which is the correct plural of shelf?", ["shelfs", "shelfes", "shelves"], 2, "Shelf changes to shelves."),
        _wc("Which is the correct plural of mouse?", ["mice", "mouses", "mices"], 0, "Mouse has an irregular plural, mice."),
        _wc("Which is the correct plural of tooth?", ["tooths", "teeth", "teeths"], 1, "Tooth has an irregular plural, teeth."),
    ],
    [
        {"key": "partA", "label": "Part A: a noun group", "hint": "Two adjectives to describe a koala's fur."},
        {"key": "partB", "label": "Part B: a topic sentence", "hint": "A topic sentence about the kangaroo."},
        {"key": "partC", "label": "Part C: plurals", "hint": "mouse, shelf, class."},
        {"key": "stage1", "label": "My animal", "hint": "The animal you will describe."},
        {"key": "stage2", "label": "My notes", "hint": "Four features from a reliable source."},
        {"key": "stage3", "label": "My topic sentence", "hint": "Name the animal and give the main idea."},
        {"key": "stage4", "label": "My detail sentences", "hint": "Three sentences with at least two precise noun groups."},
        {"key": "stage5", "label": "My concluding sentence", "hint": "Wrap up the main idea."},
        {"key": "stage6", "label": "My complete paragraph", "hint": "Facts only, in the present tense."},
        {"key": "stage7", "label": "One change I made", "hint": "A word you made more precise."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for classes, shelves and mice."},
    ],
    ["Using vague words such as nice, good or thing", "Adding opinions such as cute or the best", "Mixing past and present tense", "Putting several features into one long sentence", "Writing mouses, shelfs or classs instead of mice, shelves and classes"],
    ["Read your paragraph aloud and listen for any vague words.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: accept any noun group with two precise adjectives, such as soft, grey fur or thick, woolly fur. Part B: accept a topic sentence that names the kangaroo and gives the main idea, such as The kangaroo is a large marsupial that hops across the Australian bush. Part C: mice, shelves, classes. Main task Stage 1: accept any animal. Stage 2: accept four sensible features. Stage 3: accept a clear topic sentence that names the animal. Stage 4: accept three sentences about different features with at least two noun groups with precise adjectives. Stage 5: accept a sentence that links back to the main idea. Stage 6: accept a complete paragraph with facts only and the present tense. Stage 7: accept any sensible change. Stage 8: accept six correctly spelled words and sentences. Quiz answers: tells the reader what something looks like and is like; the sentence that tells the main idea; The echidna is a small, spiny mammal that lives across Australia; sharp, cream-coloured spines; detail sentences about features; wraps up the main idea; a long, thin snout; to help the reader picture it clearly; mice; shelves.",
)

LESSON["spelling"] = {
    "focus": "Plurals: -s, -es, -ves and irregular",
    "teaching": "Most words add s. Words ending in s, x, z, ch or sh add es, as in classes and bunches. Many words ending in f or fe change to ves, as in leaves and shelves. Some plurals are irregular, as in mice and teeth. Say the word, think about the ending, then write it.",
    "words": [
        _w("classes", "clas-ses", "more than one class, ends in es after ss"),
        _w("bunches", "bun-ches", "more than one bunch, ends in es after ch"),
        _w("leaves", "leaves", "more than one leaf, f changes to ves"),
        _w("shelves", "shelves", "more than one shelf, f changes to ves"),
        _w("mice", "mice", "more than one mouse, an irregular plural"),
        _w("teeth", "teeth", "more than one tooth, an irregular plural"),
    ],
    "check": [
        _c("What is the plural of leaf?", ["leaves", "leafs", "leafes"], 0, "Leaf changes to leaves."),
        _c("What is the plural of bunch?", ["bunchs", "bunches", "bunchies"], 1, "Words ending in ch add es, so bunch becomes bunches."),
    ],
}
LESSON["spelling_focus"] = "Plurals: -s, -es, -ves and irregular"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
