"""Stage 2 English, Week 8 Lesson 1: Fact versus Opinion (Reading and comprehension).
The child learns that a fact can be checked and an opinion is what someone thinks or feels, learns the clue words that signal opinions, and sorts the statements in a short original passage about red kangaroos.
Spelling: plurals -s, -es, -ves and irregular: dishes, boxes, wolves, leaves, children, feet.
Outcome codes: EN2-RECOM-01 and EN2-SPELL-01, both of which exist in nsw_outcomes.py.
Video status: none. No fact versus opinion video has been transcript-checked, so none is included.
Do not register this module in lesson_library.py or add week 8 to BUILT_OUT_WEEKS until the whole week is built.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["dishes", "boxes", "wolves", "leaves", "children", "feet"]

ROO_TEXT = (
    "PASSAGE: RED KANGAROOS\n\n"
    "Red kangaroos are the largest marsupials in the world. A male can stand almost as tall as a grown man.\n\n"
    "I think red kangaroos are the most amazing animals in Australia. They live in the dry parts of the country, and they can go a long time without a drink.\n\n"
    "A baby kangaroo is called a joey. A joey spends about eight months in its mother's pouch. Joeys are the cutest babies ever.\n\n"
    "Everyone should visit a kangaroo park to see them."
)

LESSON = build(
    "s2-eng-w08-l1-fact-versus-opinion",
    "Fact versus Opinion",
    "Some sentences tell us things that can be checked and others tell us what someone thinks. Learn how to tell a fact from an opinion, spot the clue words, and sort the statements in a text.",
    "Reading: fact versus opinion",
    ["EN2-RECOM-01", "EN2-SPELL-01"],
    {
        "EN2-RECOM-01": "Primary. Reads and comprehends texts for wide purposes using knowledge of text structures and language, and by monitoring comprehension. In this lesson the child tells facts from opinions in an information text and explains how they know.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including plural endings -s, -es, -ves and irregular plurals (week 8 spelling focus).",
    },
    "We are learning to tell a fact from an opinion, to find the clue words that show an opinion, and to spell plurals such as dishes, wolves and children.",
    [
        "I can explain what a fact is and what an opinion is.",
        "I can say how a fact could be checked.",
        "I can find clue words that show an opinion.",
        "I can sort the statements in a text into facts and opinions.",
        "I can turn an opinion into a fact, or a fact into an opinion.",
        "I can spell and use dishes, boxes, wolves, leaves, children and feet.",
    ],
    ["fact", "opinion", "evidence", "check", "clue word", "statement"],
    ["This lesson (everything you need is inside it)", "Optional: a short magazine article or advertisement chosen by a parent"],
    "Child can find the main idea of a text (Week 7, Lesson 1) and knows that a reliable source gives evidence (Week 7, Lesson 4).",
    (
        "Why this matters. Information texts mix facts with what the writer thinks. Good readers notice the difference, because a fact can help you learn and an opinion tells you how someone feels. Knowing which is which helps you decide what to believe.\n\n"
        "What a fact is. A fact is a statement that can be checked and shown to be true. You can check it in a book, with a measurement, by looking, or by asking an expert. Red kangaroos are the largest marsupials in the world is a fact.\n\n"
        "What an opinion is. An opinion is what someone thinks or feels. Two people can have different opinions and both be sensible. Joeys are the cutest babies ever is an opinion, because someone else might think a different animal is cuter.\n\n"
        "Clue words. Opinions often use words such as think, believe, best, worst, amazing, boring, beautiful, cutest, should and must. These words show a feeling or a judgement. A fact usually uses numbers, names, places and things you can check.\n\n"
        "A tricky case. Some opinion sentences contain a fact. I think red kangaroos live in dry places has the clue words I think, but the idea that they live in dry places can be checked. Look at the whole sentence and ask: can this be proved?\n\n"
        "The routine. First, read the sentence. Second, ask: can I check this? Third, look for clue words that show a feeling or judgement. Fourth, decide: fact or opinion. Fifth, say how you know.\n\n"
        "A link to spelling. This week's spelling focus is plurals. Plurals can end in -s, -es or -ves, and some change completely, such as child and children. Words such as dishes, wolves and feet will help you remember the patterns."
    ),
    [
        _step("1", "What is a fact?", "A fact is a statement that can be checked and shown to be true.\n\nYou can check a fact by looking, measuring, reading a reliable source or asking an expert.", "A joey spends about eight months in its mother's pouch. This can be checked in a book about kangaroos.", "If you can check it, it is a fact.", ("Which is a fact?", ["Red kangaroos are the largest marsupials in the world", "Kangaroos are the best animals", "Joeys are the cutest babies"], 0, "The size of kangaroos can be checked.")),
        _step("2", "What is an opinion?", "An opinion is what someone thinks or feels. It cannot be proved true or false, and different people can have different opinions.\n\nOpinions often use judging words.", "Joeys are the cutest babies ever. Another person might think puppies are cuter.", "An opinion is what someone thinks.", ("Which is an opinion?", ["A joey is a baby kangaroo", "Joeys are the cutest babies ever", "Joeys live in a pouch"], 1, "Cutest is a feeling, and people can disagree.")),
        _step("3", "Clue words for opinions", "Look for words that show a feeling or a judgement: think, believe, best, worst, amazing, boring, beautiful, cutest, should, must.\n\nFacts use numbers, names, places and things you can check.", "I think red kangaroos are the most amazing animals in Australia. The clue words are think and most amazing.", "Feelings and judgements are clues.", ("Which word is a clue that a sentence is an opinion?", ["eight", "amazing", "Australia"], 1, "Amazing shows a feeling.")),
        _step("4", "Sorting a whole text", "Read each sentence and ask: can this be checked? Then look for clue words. Sort the sentence as a fact or an opinion.\n\nOne paragraph can have both.", "Passage sentence: Red kangaroos can go a long time without a drink. This can be checked, so it is a fact. Passage sentence: Everyone should visit a kangaroo park. Should shows a judgement, so it is an opinion.", "Check it, then look for clues.", ("Everyone should visit a kangaroo park. Fact or opinion?", ["Fact", "Opinion"], 1, "Should shows what someone thinks.")),
        _step("5", "Changing one into the other", "You can turn an opinion into a fact by naming something that can be checked. You can turn a fact into an opinion by adding a feeling.\n\nThis shows you what makes each one.", "Opinion: Kangaroos are amazing. Fact: Kangaroos can hop at high speed. Fact: Joeys live in a pouch. Opinion: Joeys in a pouch are adorable.", "Add or remove the feeling.", ("Which sentence turns this opinion into a fact? Opinion: Kangaroos are amazing.", ["Kangaroos are the best", "Kangaroos carry their young in a pouch", "Kangaroos are lovely"], 1, "The pouch can be checked.")),
        _step("6", "Spelling focus: plurals", "Most plurals add -s. Words ending in ch, sh, s, x or z add -es, such as dishes and boxes. Many words ending in f or fe change to -ves, such as wolves and leaves. Some plurals change completely, such as child and children, and foot and feet.\n\nLearn each word, then check it.", "The children put dishes in boxes. The wolves ran through the leaves.", "Check the ending before you write.", ("Which is the correct plural of wolf?", ["wolfs", "wolves", "wolfes"], 1, "Wolf changes to wolves.")),
    ],
    (
        "Let's read the passage about red kangaroos and sort each statement. Sentence one: red kangaroos are the largest marsupials in the world. I can check this in a book, so it is a fact. Sentence two: a male can stand almost as tall as a grown man. I can measure this, so it is a fact. Sentence three: I think red kangaroos are the most amazing animals in Australia. The clue words are I think and most amazing, and no one can prove it, so it is an opinion. Sentence four: they can go a long time without a drink. This can be checked, so it is a fact. Sentence five: a joey spends about eight months in its mother's pouch. This is a fact with a number. Sentence six: joeys are the cutest babies ever. Cutest is a feeling, so it is an opinion. Sentence seven: everyone should visit a kangaroo park. Should is a judgement, so it is an opinion. Notice that the facts have things I can check, and the opinions have feelings and judging words.\n\n" + ROO_TEXT
    ),
    (
        "Type your answers in the practice boxes. Part A: in your own words, write what a fact is and what an opinion is. Part B: type fact or opinion for each statement. Kangaroos can hop. Kangaroos are boring. A kangaroo has a long tail. Part C: type the clue word in each sentence. Dogs are the best pets. That film was awful. Part D: type the correct plural for each blank. Choose from dishes, boxes, wolves, leaves, children and feet. The ___ played in the park. We packed the books in ___. The ___ howled at the moon. Your parent can check your answers against the answer key."
    ),
    (
        "Sort the statements in a text of your own. Typed answers go in the boxes. Use the kangaroo passage as a model.\n\n" + ROO_TEXT + "\n\n"
        "Stage 1 (choose a text): with a parent, choose a short information text, such as a magazine article or an advertisement. Type its title.\n"
        "Stage 2 (facts): type three facts from the text. Beside each, type how you could check it.\n"
        "Stage 3 (opinions): type three opinions from the text, or from a short review you read. Underline the clue word in each.\n"
        "Stage 4 (tricky one): type one sentence that was hard to decide and say why.\n"
        "Stage 5 (change it): rewrite one opinion as a fact, and one fact as an opinion.\n"
        "Stage 6 (your own): write one fact and one opinion about an animal you like.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of wolves, children and feet.\n\n"
        "Parent: check that the facts can really be checked, that the opinions show a feeling or judgement, and that the child can explain their choices. Accept any sensible text and any reasonable decision when a sentence is tricky."
    ),
    "Why is it important to know whether a statement is a fact or an opinion?",
    "Did I check each statement, find the clue words, sort facts from opinions, explain how I know, and spell dishes, boxes, wolves, leaves, children and feet correctly?",
    [
        _q("What is a fact?", ["A statement that can be checked", "What someone feels", "A guess", "A wish"], 0, "A fact can be checked and shown to be true."),
        _q("What is an opinion?", ["What someone thinks or feels", "A number", "A date", "A place"], 0, "An opinion is what someone thinks or feels."),
        _q("Which is a fact?", ["Joeys are the cutest babies", "Joeys live in a pouch", "Kangaroos are boring", "Everyone should visit"], 1, "The pouch can be checked."),
        _q("Which sentence is an opinion?", ["A joey is a baby kangaroo", "Red kangaroos live in Australia", "Red kangaroos are the most amazing animals", "A joey lives in a pouch"], 2, "Most amazing is a feeling."),
        _q("Which word is a clue for an opinion?", ["eight", "best", "Sydney", "metre"], 1, "Best shows a judgement."),
        _q("Which kind of word often shows a fact?", ["A number you can check", "A feeling word", "The word think", "The word cutest"], 0, "Numbers, names and places can be checked."),
        _q("I think red kangaroos live in dry places. What should you do?", ["Look at the whole sentence and check the idea", "Always call it an opinion", "Ignore it", "Always call it a fact"], 0, "Some opinion sentences contain a fact you can check."),
        _q("Which is the correct plural of box?", ["boxs", "boxes", "boxies", "boxen"], 1, "Words ending in x add -es."),
        _q("Which is the correct plural of child?", ["childs", "childes", "children", "childrens"], 2, "Child changes completely to children."),
        _q("Which is the correct plural of foot?", ["foots", "feet", "feets", "footes"], 1, "Foot changes to feet."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: look at an advertisement or a product review. Find two facts and two opinions in it, then say how the writer wants you to feel.",
    [("fact", "A statement that can be checked and shown to be true"), ("opinion", "What someone thinks or feels"), ("evidence", "Facts, numbers or examples that show something is true"), ("check", "To find out whether something is true"), ("clue word", "A word that helps you work something out, such as best showing an opinion"), ("statement", "A sentence that tells something")],
    [],
    _sort("Fact or opinion?", "Sort each statement from the kangaroo passage into the right group.", ["Fact", "Opinion"], [("Red kangaroos are the largest marsupials in the world", 0), ("Joeys are the cutest babies ever", 1), ("A joey spends about eight months in the pouch", 0), ("Everyone should visit a kangaroo park", 1), ("Kangaroos can go a long time without a drink", 0), ("Red kangaroos are the most amazing animals", 1)]),
    [
        _wc("Which can be checked and shown to be true?", ["fact", "opinion", "feeling"], 0, "A fact can be checked."),
        _wc("Which is what someone thinks or feels?", ["evidence", "opinion", "statement"], 1, "An opinion is what someone thinks or feels."),
        _wc("Which word helps you spot an opinion?", ["best", "seven", "Perth"], 0, "Best is a judging word."),
        _wc("Which is spelled correctly?", ["dishes", "dishs", "dishies"], 0, "Dish ends in sh, so add -es."),
        _wc("Which is spelled correctly?", ["boxs", "boxes", "boxies"], 1, "Box ends in x, so add -es."),
        _wc("Which is spelled correctly?", ["wolfs", "wolfes", "wolves"], 2, "Wolf changes to wolves."),
        _wc("Which is spelled correctly?", ["leafs", "leaves", "leafes"], 1, "Leaf changes to leaves."),
        _wc("Which is spelled correctly?", ["childs", "childen", "children"], 2, "Child changes to children."),
    ],
    [
        {"key": "partA", "label": "Part A: fact and opinion", "hint": "In your own words, what is a fact and what is an opinion?"},
        {"key": "partB", "label": "Part B: sort", "hint": "Type fact or opinion for each of the three statements."},
        {"key": "partC", "label": "Part C: clue words", "hint": "The clue word in each sentence."},
        {"key": "partD", "label": "Part D: plurals", "hint": "Fill the three blanks. Choose from dishes, boxes, wolves, leaves, children and feet."},
        {"key": "stage1", "label": "My text", "hint": "The title of the text you chose."},
        {"key": "stage2", "label": "Three facts", "hint": "Three facts and how you could check each."},
        {"key": "stage3", "label": "Three opinions", "hint": "Three opinions, with the clue word in each."},
        {"key": "stage4", "label": "Tricky sentence", "hint": "One hard sentence and why it was hard."},
        {"key": "stage5", "label": "Change it", "hint": "One opinion as a fact, one fact as an opinion."},
        {"key": "stage6", "label": "My own", "hint": "One fact and one opinion about an animal."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence for each of wolves, children and feet."},
    ],
    ["Thinking a sentence is a fact because it sounds sure", "Thinking an opinion is wrong", "Missing clue words such as best, worst and should", "Calling a sentence an opinion because it has the words I think, without checking the idea", "Writing plurals such as wolfs, childs or foots"],
    ["Find two facts and two opinions in an advertisement or a review.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: accept a fact can be checked and shown to be true, and an opinion is what someone thinks or feels. Part B: fact, opinion, fact. Part C: best; awful. Part D: children; boxes; wolves. Main task: Stage 2: accept three checkable statements with a way to check. Stage 3: accept three opinions with a clue word such as best, boring, should or amazing. Stage 4 to 6: accept any sensible answers that show the child checked the idea. Quiz answers: a statement that can be checked; what someone thinks or feels; Joeys live in a pouch; Red kangaroos are the most amazing animals; best; a number you can check; look at the whole sentence and check the idea; boxes; children; feet.",
)

LESSON["spelling"] = {
    "focus": "Plurals: -s, -es, -ves and irregular",
    "teaching": "Most plurals add -s. Words ending in sh, ch, s, x or z add -es (dishes, boxes). Many words ending in f change to -ves (wolves, leaves). Some change completely (child to children, foot to feet). Say each word slowly and check the ending.",
    "words": [
        _w("dishes", "dish-es", "dish + es"),
        _w("boxes", "box-es", "box + es"),
        _w("wolves", "wolves", "wolf changes f to ves"),
        _w("leaves", "leaves", "leaf changes f to ves"),
        _w("children", "child-ren", "irregular: child changes completely"),
        _w("feet", "feet", "irregular: foot changes to feet"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["dishes", "dishs", "dishies"], 0, "Dish ends in sh, so add -es."),
        _c("Which is spelled correctly?", ["wolfs", "wolves", "wolfes"], 1, "Wolf changes to wolves."),
    ],
}
LESSON["spelling_focus"] = "Plurals: -s, -es, -ves and irregular"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
