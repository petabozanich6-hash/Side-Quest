"""Stage 2 English, Week 8 Lesson 1: Fact Versus Opinion (Reading and comprehension).
The child learns to tell a fact (something that can be checked and proved) from an opinion (what someone thinks or feels), to spot signal words for opinions, and to check a fact in a reliable source. The model text is a short passage about the platypus that mixes facts and opinions.
Spelling: plurals: -s, -es, -ves and irregular: boxes, brushes, wolves, knives, children, feet.
Outcomes: EN2-RECOM-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 8, Lesson 1, Fact versus opinion, reading slot, spelling plurals). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Video status: no video is attached to this lesson, because none has been found and checked.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["boxes", "brushes", "wolves", "knives", "children", "feet"]

PASSAGE = (
    "READING PASSAGE: THE PLATYPUS\n\n"
    "The platypus lives in rivers and creeks in eastern Australia. It has a bill like a duck and a flat tail. "
    "A platypus lays eggs, even though it is a mammal. "
    "I think the platypus is the strangest animal in the world. "
    "Everyone should visit a river to look for one. "
    "Male platypuses have a spur on each back foot."
)

LESSON = build(
    "s2-eng-w08-l1-fact-versus-opinion",
    "Fact Versus Opinion",
    "Learn how to tell a fact from an opinion when you read, how to spot words that signal an opinion, and how to check a fact.",
    "Reading: fact and opinion",
    ["EN2-RECOM-01", "EN2-SPELL-01"],
    {
        "EN2-RECOM-01": "Reads and comprehends texts for wide purposes using knowledge of text structures and language, and by monitoring comprehension. This lesson focuses on telling facts from opinions in an information text.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is plurals: -s, -es, -ves and irregular plurals.",
    },
    "We are learning to tell facts from opinions in what we read, to check facts in a reliable source, and to spell plurals.",
    [
        "I can explain what a fact is.",
        "I can explain what an opinion is.",
        "I can sort sentences into facts and opinions.",
        "I can find signal words that show an opinion.",
        "I can explain how to check a fact.",
        "I can spell and use boxes, brushes, wolves, knives, children and feet.",
    ],
    ["fact", "opinion", "check", "evidence", "reliable", "claim", "signal word", "judge"],
    ["This lesson (everything you need is inside it)", "Optional: a newspaper or magazine page to look at"],
    "Child has found reliable sources and knows the difference between a fact and an opinion in simple cases (Week 7 Lesson 4).",
    (
        "Why this matters. When we read information texts, some sentences tell us things that are true, and some tell us what the writer thinks. A good reader can tell the difference. This helps us decide what to believe.\n\n"
        "What a fact is. A fact is something that can be checked and proved to be true. A platypus lays eggs is a fact. You could look it up in a reliable book and see for yourself.\n\n"
        "What an opinion is. An opinion is what someone thinks or feels. It cannot be proved true or false. The platypus is the strangest animal in the world is an opinion. Someone else might think a different animal is stranger.\n\n"
        "Signal words. Some words give a clue that a sentence is an opinion. They include I think, I believe, best, worst, strangest, should, beautiful and boring. Words like dates, numbers and measurements often show a fact. But be careful: always ask whether the sentence can be checked.\n\n"
        "Checking a fact. To check a fact, look in a reliable source. A good source is written by an expert, is recent, and agrees with other good sources. If you cannot check a sentence, it may be an opinion.\n\n"
        "Why writers use opinions. Opinions are not wrong. Writers use them to share feelings and to persuade. But a reader should notice them, so that they can judge what to believe.\n\n"
        "A link to spelling. This week's spelling focus is plurals. Most words add s. Words ending in s, x, z, ch or sh add es, as in boxes and brushes. Many words ending in f or fe change to ves, as in wolves and knives. Some plurals are irregular, as in children and feet."
    ),
    [
        _step("1", "What is a fact?", "A fact is something that can be checked and proved to be true. You can look it up in a reliable source.\n\nFacts often include names, numbers and dates.", "A platypus lays eggs.", "A fact can be checked.", ("What is a fact?", ["Something that can be checked and proved", "What someone thinks", "A feeling"], 0, "A fact can be checked and proved.")),
        _step("2", "What is an opinion?", "An opinion is what someone thinks or feels. It cannot be proved true or false, and different people can have different opinions.\n\nOpinions are not wrong, but a reader should notice them.", "I think the platypus is the strangest animal in the world.", "An opinion is a thought or feeling.", ("Which is an opinion?", ["I think the platypus is the strangest animal in the world.", "A platypus lays eggs.", "The platypus lives in rivers."], 0, "I think... is an opinion.")),
        _step("3", "Signal words", "Some words signal an opinion, such as I think, I believe, best, worst, strangest, should and boring.\n\nNumbers, dates and names often signal a fact, but always ask whether it can be checked.", "Everyone should visit a river to look for one.", "Look for clue words.", ("Which words often signal an opinion?", ["I think, best, should", "in 2020, 50 centimetres", "north, south, east"], 0, "I think, best and should often signal an opinion.")),
        _step("4", "Checking a fact", "To check a fact, look in a reliable source. A good source is written by an expert, is recent, and agrees with other good sources.\n\nIf you cannot check it, it may be an opinion.", "To check that a platypus lays eggs, look in a library book by a scientist.", "Use a reliable source.", ("How can you check a fact?", ["Look in a reliable source", "Guess", "Ask which one feels right"], 0, "Check a fact in a reliable source.")),
        _step("5", "Reading a whole text", "Read each sentence and ask: Can this be checked? If yes, it is a fact. If it is what someone thinks or feels, it is an opinion.\n\nMany texts mix facts and opinions.", "Male platypuses have a spur on each back foot (fact). Everyone should visit a river to look for one (opinion).", "Test each sentence.", ("Which is a fact?", ["Male platypuses have a spur on each back foot.", "Everyone should visit a river.", "The platypus is the strangest animal."], 0, "A spur on each back foot can be checked, so it is a fact.")),
        _step("6", "Why it matters", "A good reader notices opinions so that they can decide what to believe. A writer may use opinions to persuade you.\n\nAsk: Is this a fact I can trust, or is it the writer's view?", "An advertisement says this is the best toy ever. That is an opinion.", "Notice and judge.", ("Why notice opinions when you read?", ["So you can decide what to believe", "So you can skip them", "Because opinions are always wrong"], 0, "Noticing opinions helps you decide what to believe.")),
        _step("7", "Spelling focus: plurals", "Most words add s. Words ending in s, x, z, ch or sh add es, as in boxes and brushes. Many words ending in f or fe change to ves, as in wolves and knives. Some plurals are irregular, as in children and feet.\n\nSay the word, think about the ending, then write it.", "One box, two boxes. One wolf, two wolves. One child, two children.", "s, es, ves, or irregular.", ("What is the plural of knife?", ["knives", "knifes", "knifs"], 0, "Knife changes to knives.")),
    ],
    (
        "Let's read a short text and sort the sentences. Here is the passage. The platypus lives in rivers and creeks in eastern Australia. It has a bill like a duck and a flat tail. A platypus lays eggs, even though it is a mammal. I think the platypus is the strangest animal in the world. Everyone should visit a river to look for one. Male platypuses have a spur on each back foot. Now I test each sentence by asking, can this be checked? Sentence 1: it lives in rivers and creeks in eastern Australia. I could check this in a reliable book, so it is a fact. Sentence 2: it has a bill and a flat tail. I can look at a photo, so that is a fact. Sentence 3: it lays eggs, and that can be checked, so it is a fact. Sentence 4: I think the platypus is the strangest animal. I think is a signal word, and nobody can prove strangest, so it is an opinion. Sentence 5: everyone should visit a river. Should is a signal word, and it is what the writer thinks, so it is an opinion. Sentence 6: male platypuses have a spur on each back foot. It can be checked, so it is a fact. Notice that facts and opinions sit side by side in the same text, so a good reader tests each sentence.\n\n" + PASSAGE
    ),
    (
        "Type your answers in the practice boxes. Part A: type fact or opinion for Dogs make the best pets. Part B: type a fact about Australia that you could check. Part C: type the plural for each: one wolf, two ___. One box, two ___. One child, two ___. Your parent can check your answers against the answer key."
    ),
    (
        "Read the passage and test each sentence. Typed answers go in the boxes.\n\n" + PASSAGE + "\n\n"
        "Stage 1 (facts): type two facts from the passage.\n"
        "Stage 2 (opinions): type two opinions from the passage.\n"
        "Stage 3 (signal words): type the signal words that helped you find the opinions.\n"
        "Stage 4 (check): choose one fact and type how you would check it, and which source you would use.\n"
        "Stage 5 (change it): rewrite one opinion as a fact. For example, change the best pet to a fact about a pet.\n"
        "Stage 6 (write): choose a topic, such as an animal, a sport or a food. Write two facts and two opinions about it. Type them.\n"
        "Stage 7 (explain): type one sentence that tells why a reader should notice opinions.\n"
        "Stage 8 (spell): type your six spelling words and one sentence for each of wolves, knives and children.\n\n"
        "Parent: check that the facts are sentences that can be checked (it lives in rivers, it lays eggs, males have a spur), and the opinions are the strangest animal and everyone should visit a river. Check that the signal words named are I think, strangest or should, that the rewrite is something that can be checked, and that the child's own facts can be checked and their opinions show a view. Accept any sensible topic."
    ),
    "Which was harder for you: spotting facts or spotting opinions, and what will you do next time you read an information text?",
    "Did I explain what a fact and an opinion are, sort sentences correctly, find signal words, explain how to check a fact, and spell boxes, brushes, wolves, knives, children and feet correctly?",
    [
        _q("What is a fact?", ["Something that can be checked and proved", "What someone thinks", "A feeling", "A guess"], 0, "A fact can be checked and proved."),
        _q("Which sentence is a fact?", ["A platypus lays eggs.", "The platypus is the strangest animal.", "Everyone should visit a river.", "The platypus is the cutest animal."], 0, "A platypus lays eggs can be checked, so it is a fact."),
        _q("Which sentence is an opinion?", ["I think the platypus is the strangest animal in the world.", "The platypus lives in rivers.", "Male platypuses have a spur on each back foot.", "The platypus has a bill."], 0, "I think... strangest is an opinion."),
        _q("Which words often signal an opinion?", ["I think, best, should", "on Monday, in 2020", "two, three, four", "north, south, east"], 0, "I think, best and should often signal an opinion."),
        _q("How can you check a fact?", ["Look in a reliable source", "Ask which one feels right", "Guess", "Count the words"], 0, "Check a fact in a reliable source."),
        _q("Which sentence is a fact?", ["Australia is a country.", "Summer is the best season.", "Dogs are better than cats.", "Pizza tastes great."], 0, "Australia is a country can be checked, so it is a fact."),
        _q("Which sentence is an opinion?", ["Summer is the best season.", "Sydney is in New South Wales.", "A week has seven days.", "Water freezes at zero degrees Celsius."], 0, "The best season is a view, so it is an opinion."),
        _q("Why should a reader notice opinions?", ["So they can decide what to believe", "So they can skip the text", "Because opinions are always wrong", "Because facts are boring"], 0, "Noticing opinions helps a reader decide what to believe."),
        _q("What is the plural of knife?", ["knifes", "knives", "knifs", "knivs"], 1, "Knife changes to knives."),
        _q("What is the plural of box?", ["boxs", "boxes", "boxies", "boxen"], 1, "Words ending in x add es, so box becomes boxes."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: find an advertisement or a short article. Write down two facts and two opinions from it, and circle the signal words. Tell a family member which sentences you trust and why.",
    [("fact", "Something that can be checked and proved to be true"), ("opinion", "What someone thinks or feels"), ("check", "To look carefully to make sure something is right"), ("evidence", "Facts or signs that show something is true"), ("reliable", "Able to be trusted to be correct"), ("claim", "A statement that says something is true"), ("signal word", "A word that gives a clue about the kind of sentence it is in"), ("judge", "To decide what you think is true or good")],
    [],
    _sort("Fact or opinion?", "Sort each sentence into fact or opinion.", ["Fact", "Opinion"], [("A platypus lays eggs", 0), ("Koalas are the cutest animals", 1), ("Echidnas have spines", 0), ("Kangaroos are boring", 1), ("Sydney is in New South Wales", 0), ("Summer is the best season", 1), ("A week has seven days", 0), ("Dogs make the best pets", 1)]),
    [
        _wc("Which means something that can be checked and proved?", ["fact", "opinion", "title"], 0, "A fact can be checked and proved."),
        _wc("Which means what someone thinks or feels?", ["claim", "opinion", "source"], 1, "An opinion is what someone thinks or feels."),
        _wc("Which means able to be trusted to be correct?", ["short", "colourful", "reliable"], 2, "Reliable means able to be trusted to be correct."),
        _wc("Which means to look carefully to make sure something is right?", ["check", "retell", "rhyme"], 0, "To check is to look carefully to make sure something is right."),
        _wc("Which is the correct plural of wolf?", ["wolfs", "wolves", "wolfes"], 1, "Wolf changes to wolves."),
        _wc("Which is the correct plural of knife?", ["knives", "knifes", "knifs"], 0, "Knife changes to knives."),
        _wc("Which is the correct plural of box?", ["boxs", "boxies", "boxes"], 2, "Box adds es to make boxes."),
        _wc("Which is the correct plural of child?", ["childs", "children", "childes"], 1, "Child has an irregular plural, children."),
    ],
    [
        {"key": "partA", "label": "Part A: fact or opinion", "hint": "Dogs make the best pets."},
        {"key": "partB", "label": "Part B: a fact", "hint": "A fact about Australia that you could check."},
        {"key": "partC", "label": "Part C: plurals", "hint": "wolf, box, child."},
        {"key": "stage1", "label": "Two facts", "hint": "Two facts from the passage."},
        {"key": "stage2", "label": "Two opinions", "hint": "Two opinions from the passage."},
        {"key": "stage3", "label": "Signal words", "hint": "The words that helped you."},
        {"key": "stage4", "label": "How to check", "hint": "One fact, and the source you would use."},
        {"key": "stage5", "label": "My rewrite", "hint": "An opinion rewritten as a fact."},
        {"key": "stage6", "label": "My facts and opinions", "hint": "Two facts and two opinions about your topic."},
        {"key": "stage7", "label": "Why notice opinions", "hint": "One sentence."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for wolves, knives and children."},
    ],
    ["Thinking a sentence is a fact because it sounds confident", "Thinking every opinion is wrong", "Missing signal words such as best and should", "Not checking a fact in a reliable source", "Writing knifes, wolfs or boxs instead of knives, wolves and boxes"],
    ["Look at a page of a newspaper or magazine and find one fact and one opinion.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: opinion. Part B: accept any sensible fact that could be checked, such as Canberra is the capital of Australia. Part C: wolves, boxes, children. Main task Stage 1: accept any two of: it lives in rivers and creeks in eastern Australia; it has a bill like a duck and a flat tail; it lays eggs; male platypuses have a spur on each back foot. Stage 2: I think the platypus is the strangest animal in the world; everyone should visit a river to look for one. Stage 3: I think, strangest, should. Stage 4: accept a sensible way to check, such as looking in a library book by a scientist or on a museum website. Stage 5: accept a sentence that can be checked, such as Platypuses live in eastern Australia. Stage 6: accept two sentences that can be checked and two that show a view. Stage 7: accept any sensible reason, such as so you can decide what to believe. Stage 8: accept six correctly spelled words and sentences. Quiz answers: something that can be checked and proved; A platypus lays eggs; I think the platypus is the strangest animal in the world; I think, best, should; look in a reliable source; Australia is a country; Summer is the best season; so they can decide what to believe; knives; boxes.",
)

LESSON["spelling"] = {
    "focus": "Plurals: -s, -es, -ves and irregular",
    "teaching": "Most words add s. Words ending in s, x, z, ch or sh add es, as in boxes and brushes. Many words ending in f or fe change to ves, as in wolves and knives. Some plurals are irregular, as in children and feet. Say the word, think about the ending, then write it.",
    "words": [
        _w("boxes", "box-es", "more than one box, ends in es after x"),
        _w("brushes", "brush-es", "more than one brush, ends in es after sh"),
        _w("wolves", "wolves", "more than one wolf, f changes to ves"),
        _w("knives", "knives", "more than one knife, fe changes to ves"),
        _w("children", "chil-dren", "more than one child, an irregular plural"),
        _w("feet", "feet", "more than one foot, an irregular plural"),
    ],
    "check": [
        _c("What is the plural of wolf?", ["wolves", "wolfs", "wolfes"], 0, "Wolf changes to wolves."),
        _c("What is the plural of brush?", ["brushs", "brushes", "brushies"], 1, "Words ending in sh add es, so brush becomes brushes."),
    ],
}
LESSON["spelling_focus"] = "Plurals: -s, -es, -ves and irregular"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
