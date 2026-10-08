"""Stage 2 English, Week 7 Lesson 2: Writing a Classification Paragraph (Writing).
The child learns to sort things into groups, then write an information paragraph with a general topic sentence, a sentence for each group with examples, and a closing sentence. The model paragraph classifies Australian mammals into marsupials, monotremes and placental mammals.
Spelling: -sion and -ssion: television, conclusion, confusion, mission, expression, passion.
Outcomes: EN2-CWT-02 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 7, Lesson 2, Classification paragraph, informative writing, spelling -sion and -ssion). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Video status: no video is attached to this lesson, because none has been found and checked.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["television", "conclusion", "confusion", "mission", "expression", "passion"]

MODEL = (
    "MODEL CLASSIFICATION PARAGRAPH\n\n"
    "Australian mammals can be sorted into three main groups. Marsupials, such as kangaroos, koalas and wombats, carry their babies in a pouch. "
    "Monotremes, such as echidnas and platypuses, are mammals that lay eggs. "
    "Placental mammals, such as dingoes and bats, grow their babies inside their bodies until they are born. "
    "Each group has its own special features."
)

LESSON = build(
    "s2-eng-w07-l2-classification-paragraph",
    "Writing a Classification Paragraph",
    "Learn how to sort things into groups and write an information paragraph that tells the reader about each group, using Australian mammals as a model.",
    "Writing: classification paragraph",
    ["EN2-CWT-02", "EN2-SPELL-01"],
    {
        "EN2-CWT-02": "Plans, creates and revises written texts for informative purposes, using text features, sentence-level grammar, punctuation and word-level language for a target audience. This lesson focuses on writing a classification paragraph with a general statement, groups with examples, and a closing sentence.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is words ending in -sion and -ssion.",
    },
    "We are learning to classify things into groups and write a classification paragraph with a topic sentence, examples and a closing sentence, and to spell words that end in -sion and -ssion.",
    [
        "I can explain what classifying means.",
        "I can choose a rule for sorting things into groups.",
        "I can write a general topic sentence that names the groups.",
        "I can describe each group and give examples using such as.",
        "I can write a closing sentence.",
        "I can spell and use television, conclusion, confusion, mission, expression and passion.",
    ],
    ["classify", "group", "rule", "example", "feature", "topic sentence", "such as", "closing sentence"],
    ["This lesson (everything you need is inside it)", "Paper and a pencil for planning"],
    "Child has found main ideas and key details (Week 7 Lesson 1) and has planned a report with groups and subheadings (Week 6 Lesson 2).",
    (
        "Why this matters. Many information texts sort things into groups. A report about animals might tell about mammals, birds and reptiles. Sorting is called classifying. A classification paragraph helps the reader understand how the things in a topic are alike and different.\n\n"
        "What classifying means. To classify is to sort things into groups, using a rule. All the things in a group share a feature. For example, you could sort animals by whether they lay eggs, or sort food by where it grows. Choose one clear rule so that every item fits one group.\n\n"
        "The topic sentence. A classification paragraph starts with a general statement that names the topic and says how many groups there are. For example, Australian mammals can be sorted into three main groups. This tells the reader what to expect.\n\n"
        "Describing each group. Write a sentence about each group. Name the group, say what is special about it, and give examples. The words such as help you add examples, as in marsupials, such as kangaroos and koalas, carry their babies in a pouch. Use a comma before such as and after the last example when the sentence goes on.\n\n"
        "Technical words. Information texts use exact words, such as marsupial and monotreme, not vague words like thing. Use the technical word, then explain it if the reader may not know it.\n\n"
        "The closing sentence. End with a sentence that sums up the paragraph, such as Each group has its own special features. It reminds the reader of the main idea. A good closing sentence does not add a brand new fact.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -sion and -ssion. Use them in your writing: a conclusion is a closing sentence, and a mission is a job to do. The -sion ending often says zhun, as in television, conclusion and confusion. The -ssion ending says shun, as in mission, expression and passion."
    ),
    [
        _step("1", "What is classifying?", "To classify is to sort things into groups using a rule. All the things in one group share a feature.\n\nA classification paragraph tells the reader about the groups and what is in each one.", "Australian mammals can be sorted by how they have their babies: in a pouch, from an egg, or grown inside the body.", "Sort by a clear rule.", ("What does classify mean?", ["Sort things into groups using a rule", "Draw a picture", "Count the words"], 0, "To classify is to sort things into groups using a rule.")),
        _step("2", "The general topic sentence", "Start with a general statement. Name the topic and say how many groups there are. This tells the reader what the paragraph is about.\n\nDo not start with the details. Start with the big idea.", "Australian mammals can be sorted into three main groups.", "Name the topic and the number of groups.", ("Which is the best topic sentence for a paragraph about the groups of mammals?", ["Mammals can be sorted into three main groups.", "Kangaroos jump.", "I like animals."], 0, "A topic sentence names the topic and the groups.")),
        _step("3", "One sentence for each group", "Write a sentence about each group. Name the group, tell what is special about it, and give examples.\n\nKeep each group in its own sentence, so the reader can follow.", "Marsupials, such as kangaroos, koalas and wombats, carry their babies in a pouch.", "Group, feature, examples.", ("What should a group sentence include?", ["The group name, a feature and examples", "Only a number", "A joke"], 0, "A group sentence names the group, gives a feature and examples.")),
        _step("4", "Giving examples with such as", "The words such as introduce examples. Put a comma before such as, and list the examples with commas and and.\n\nExamples help the reader picture the group.", "Monotremes, such as echidnas and platypuses, are mammals that lay eggs.", "Such as, then the examples.", ("Which words introduce examples?", ["such as", "because of", "in case"], 0, "Such as introduces examples.")),
        _step("5", "Technical words", "Use exact words, like marsupial, monotreme and placental, not vague words like thing or stuff. If the reader may not know a word, explain it in the same sentence.\n\nExact words make your writing sound like an expert.", "Placental mammals, such as dingoes and bats, grow their babies inside their bodies until they are born.", "Exact words, then explain.", ("Which is better in an information paragraph?", ["Marsupials carry their babies in a pouch.", "Some things carry stuff.", "They do things."], 0, "Exact words make information clear.")),
        _step("6", "The closing sentence", "End with a sentence that sums up the paragraph and reminds the reader of the main idea. Do not add a brand new fact.\n\nThis is the conclusion of the paragraph.", "Each group has its own special features.", "Sum up; no new facts.", ("What does a closing sentence do?", ["Sums up the main idea", "Adds a new topic", "Asks for a snack"], 0, "A closing sentence sums up the paragraph.")),
        _step("7", "Spelling focus: -sion and -ssion", "Words ending in -sion often say zhun, as in television, conclusion and confusion. Words ending in -ssion say shun, as in mission, expression and passion.\n\nSay the word slowly, listen to the ending, then write it.", "My conclusion is the closing sentence. The mission was a success.", "Zhun is -sion. Shun after double s is -ssion.", ("Which is spelled correctly?", ["conclushun", "conclusion", "conclussion"], 1, "Conclusion is spelled with -sion.")),
    ],
    (
        "Let's read the model paragraph and see how it is built. Sentence 1 is the general topic sentence: Australian mammals can be sorted into three main groups. It names the topic and says how many groups. Sentence 2 is about the first group: Marsupials, such as kangaroos, koalas and wombats, carry their babies in a pouch. It names the group, gives a feature and examples with such as. Sentence 3 is about the second group: Monotremes, such as echidnas and platypuses, are mammals that lay eggs. Sentence 4 is about the third group: Placental mammals, such as dingoes and bats, grow their babies inside their bodies until they are born. The technical words are marsupials, monotremes and placental. Sentence 5 is the closing sentence: Each group has its own special features. It sums up and adds no new fact. Now I plan a new paragraph about pets. My rule is where a pet lives. Groups: pets that live in the house, pets that live in the yard, and pets that live in water. Topic sentence: Pets can be sorted into three groups by where they live. Group sentences: Indoor pets, such as cats and rabbits, live in the house. Yard pets, such as dogs and chickens, live outside. Water pets, such as goldfish and turtles, live in a tank or pond. Closing sentence: Every pet needs a home that suits it. Notice that I used such as for every list of examples.\n\n" + MODEL
    ),
    (
        "Type your answers in the practice boxes. Part A: type a rule you could use to sort fruit into groups. Part B: write a general topic sentence for a paragraph that sorts sports into groups. Part C: type the correct word for each blank: My ___ is that the story ended well. The show is on ___. The blue team had a ___ to finish. Your parent can check your answers against the answer key."
    ),
    (
        "Plan and write a classification paragraph of your own. Typed answers go in the boxes. Use the model below to help you.\n\n" + MODEL + "\n\n"
        "Stage 1 (choose a topic and rule): choose a topic, such as your report topic from Week 6, pets, sports, food or transport. Type your topic and the rule you will use to sort it.\n"
        "Stage 2 (groups): type the names of two or three groups, with two examples for each.\n"
        "Stage 3 (topic sentence): type a general topic sentence that names the topic and the number of groups.\n"
        "Stage 4 (group sentences): type one sentence for each group. Name the group, tell one feature, and give examples using such as.\n"
        "Stage 5 (closing sentence): type a closing sentence that sums up the paragraph without a new fact.\n"
        "Stage 6 (full paragraph): put the sentences together and type your whole paragraph.\n"
        "Stage 7 (check): read your paragraph aloud. Type one thing you checked, such as capital letters, full stops or commas before such as, and one thing you changed.\n"
        "Stage 8 (spell): type your six spelling words and one sentence for each of conclusion, television and mission.\n\n"
        "Parent: check that the topic is clear, that the groups follow one rule, that the topic sentence names the number of groups, that each group has a feature and examples, that such as is used with a comma, that the closing sentence sums up without a new fact, and that sentences begin with capital letters and end with full stops. Accept any sensible topic and groups."
    ),
    "Which part of writing the paragraph was hardest for you: choosing groups, writing the group sentences, or the closing sentence, and what will you do next time?",
    "Did I choose a clear rule, write a general topic sentence, write a sentence for each group with a feature and examples using such as, write a closing sentence with no new fact, and spell television, conclusion, confusion, mission, expression and passion correctly?",
    [
        _q("What does classify mean?", ["Sort things into groups using a rule", "Make something longer", "Colour a picture", "Count the sentences"], 0, "To classify is to sort things into groups using a rule."),
        _q("What does a general topic sentence do?", ["Names the topic and the groups", "Gives one tiny fact", "Ends the text", "Asks a question"], 0, "A general topic sentence names the topic and the groups."),
        _q("Which words introduce examples?", ["such as", "in case", "but then", "as well"], 0, "Such as introduces examples."),
        _q("What goes before such as?", ["A comma", "A question mark", "A colon", "A capital letter"], 0, "A comma goes before such as in these sentences."),
        _q("Which group are kangaroos and koalas in?", ["Marsupials", "Monotremes", "Placental mammals", "Birds"], 0, "Kangaroos and koalas carry their babies in a pouch, so they are marsupials."),
        _q("Which group lays eggs?", ["Monotremes", "Marsupials", "Placental mammals", "None of them"], 0, "Monotremes are mammals that lay eggs."),
        _q("Why use technical words in information writing?", ["They are exact and clear", "They are longer", "They are funny", "They are always shorter"], 0, "Technical words are exact and clear."),
        _q("What should a closing sentence do?", ["Sum up the main idea", "Add a brand new fact", "Start a new paragraph", "Repeat every sentence"], 0, "A closing sentence sums up the main idea."),
        _q("Which is spelled correctly?", ["televishun", "televission", "television", "televizion"], 2, "Television is spelled with -sion."),
        _q("Which is spelled correctly?", ["expresion", "expression", "expreshun", "expretion"], 1, "Expression is spelled with -ssion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: write a second classification paragraph on a different topic, using a different rule. Swap it with a family member and ask them to name your groups and your rule without being told.",
    [("classify", "To sort things into groups using a rule"), ("group", "A set of things that share a feature"), ("rule", "The way you decide which group something belongs in"), ("example", "One item that shows what a group is like"), ("feature", "Something special about a group"), ("topic sentence", "A sentence that tells the main idea of a paragraph"), ("such as", "Words that introduce examples"), ("closing sentence", "A last sentence that sums up the paragraph")],
    [],
    _sort("Which group?", "Sort each Australian mammal into marsupial, monotreme or placental mammal.", ["Marsupial", "Monotreme", "Placental mammal"], [("kangaroo", 0), ("koala", 0), ("wombat", 0), ("Tasmanian devil", 0), ("echidna", 1), ("platypus", 1), ("dingo", 2), ("bat", 2)]),
    [
        _wc("Which means to sort things into groups?", ["classify", "retell", "describe"], 0, "To classify is to sort things into groups."),
        _wc("Which words introduce examples?", ["in case", "such as", "as well"], 1, "Such as introduces examples."),
        _wc("Which sentence tells the main idea of a paragraph?", ["closing sentence", "caption", "topic sentence"], 2, "The topic sentence tells the main idea."),
        _wc("Which is something special about a group?", ["feature", "title", "page"], 0, "A feature is something special about a group."),
        _wc("Which is spelled correctly?", ["conclushun", "conclusion", "conclussion"], 1, "Conclusion is spelled with -sion."),
        _wc("Which is spelled correctly?", ["confusion", "confushun", "confussion"], 0, "Confusion is spelled with -sion."),
        _wc("Which is spelled correctly?", ["mision", "mishun", "mission"], 2, "Mission is spelled with -ssion."),
        _wc("Which is spelled correctly?", ["pashun", "passion", "pasion"], 1, "Passion is spelled with -ssion."),
    ],
    [
        {"key": "partA", "label": "Part A: a sorting rule", "hint": "A rule for sorting fruit into groups."},
        {"key": "partB", "label": "Part B: a topic sentence", "hint": "A general topic sentence about groups of sports."},
        {"key": "partC", "label": "Part C: -sion and -ssion words", "hint": "conclusion, television, mission."},
        {"key": "stage1", "label": "My topic and rule", "hint": "Your topic and how you will sort it."},
        {"key": "stage2", "label": "My groups", "hint": "Two or three groups, with two examples each."},
        {"key": "stage3", "label": "My topic sentence", "hint": "Name the topic and the number of groups."},
        {"key": "stage4", "label": "My group sentences", "hint": "One sentence per group, with such as."},
        {"key": "stage5", "label": "My closing sentence", "hint": "Sum up with no new fact."},
        {"key": "stage6", "label": "My full paragraph", "hint": "All the sentences together."},
        {"key": "stage7", "label": "My check", "hint": "One thing you checked and one thing you changed."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for conclusion, television and mission."},
    ],
    ["Starting with a small detail instead of a general topic sentence", "Sorting by more than one rule so items fit two groups", "Forgetting examples or the comma before such as", "Adding a brand new fact in the closing sentence", "Spelling mission, expression or passion with only one s"],
    ["Find a classification paragraph in an information book and name its groups.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: accept any clear rule, such as colour, where it grows, or whether it has a seed. Part B: accept a general sentence naming the topic and groups, such as Sports can be sorted into three groups: ball sports, water sports and track sports. Part C: conclusion, television, mission in that order. Main task Stage 1: accept any sensible topic and a clear rule. Stage 2: accept two or three groups, each with two examples, that follow the rule. Stage 3: accept a general sentence naming the topic and the number of groups. Stage 4: accept one sentence per group with a feature and examples using such as. Stage 5: accept a closing sentence that sums up with no new fact. Stage 6: accept a paragraph that joins the sentences with capital letters and full stops. Stage 7: accept any sensible check and change. Quiz answers: sort things into groups using a rule; names the topic and the groups; such as; a comma; marsupials; monotremes; they are exact and clear; sum up the main idea; television; expression.",
)

LESSON["spelling"] = {
    "focus": "-sion and -ssion (the zhun and shun sounds)",
    "teaching": "The ending -sion often says zhun, as in television, conclusion and confusion. The ending -ssion says shun, as in mission, expression and passion. Say the word slowly, listen to the ending, then write it.",
    "words": [
        _w("television", "tel-e-vi-sion", "a screen that shows programs, ends in zhun"),
        _w("conclusion", "con-clu-sion", "the ending of a text, ends in zhun"),
        _w("confusion", "con-fu-sion", "not being sure, ends in zhun"),
        _w("mission", "mis-sion", "an important job, double s"),
        _w("expression", "ex-pres-sion", "a look on your face or a way of saying something, double s"),
        _w("passion", "pas-sion", "a strong liking for something, double s"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["conclusion", "conclushun", "conclussion"], 0, "Conclusion is spelled with -sion."),
        _c("Which is spelled correctly?", ["mision", "mishun", "mission"], 2, "Mission is spelled with -ssion."),
    ],
}
LESSON["spelling_focus"] = "-sion and -ssion (the zhun and shun sounds)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
