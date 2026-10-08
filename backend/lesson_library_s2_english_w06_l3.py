"""Stage 2 English, Week 6 Lesson 3: Tier 3 Vocabulary and Technical Words (Vocabulary).
The child learns that information texts use technical (Tier 3) words for their topic, and uses context clues, the glossary and word parts to work out meanings, then uses technical words in a koala fact file and in their own topic.
Spelling: the -tion ending continued: addition, condition, pollution, protection, nutrition, migration.
Outcomes: EN2-VOCAB-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 6, Lesson 3, Language slot, technical words and vocabulary). Outcome wording is the official NESA text.
Video status: eHCpJ86XDY4 (Context Clues, Mind Blooming) was seen only as a title and short excerpts. Its full transcript and length have NOT been verified. Preview it before release, or replace it.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["addition", "condition", "pollution", "protection", "nutrition", "migration"]

KOALA_FILE = (
    "KOALA FACT FILE\n\n"
    "Koalas are marsupials. A marsupial is an animal that carries its baby in a pouch. A baby koala is called a joey. A joey stays in its mother's pouch for about six months.\n\n"
    "A koala's habitat is eucalypt forest in eastern Australia. A habitat is the place where an animal lives and finds what it needs.\n\n"
    "Koalas are herbivores. They eat the leaves of eucalyptus trees. Koalas are mostly nocturnal, which means they are most active at night. They sleep for many hours during the day.\n\n"
    "Koalas are in danger when their habitat is destroyed by bushfires and land clearing.\n\n"
    "GLOSSARY\n"
    "habitat: the place where an animal lives and finds what it needs\n"
    "herbivore: an animal that eats only plants\n"
    "joey: a baby koala or kangaroo\n"
    "marsupial: an animal that carries its baby in a pouch\n"
    "nocturnal: most active at night"
)

LESSON = build(
    "s2-eng-w06-l3-tier3-vocabulary",
    "Tier 3 Vocabulary and Technical Words",
    "Every topic has its own special words. Learn what technical words are, how to work out their meanings from clues, the glossary and word parts, and how to use them correctly in your own writing.",
    "Vocabulary: technical words in information texts",
    ["EN2-VOCAB-01", "EN2-SPELL-01"],
    {
        "EN2-VOCAB-01": "Builds knowledge and use of Tier 1, Tier 2 and Tier 3 vocabulary through interacting, wide reading and writing, and by defining and analysing words. This lesson focuses on Tier 3 (technical) words in information texts.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is words ending in -tion.",
    },
    "We are learning to find and use technical words in an information text by using context clues, the glossary and word parts, and to spell words that end in -tion.",
    [
        "I can say what a technical word is and why information texts use them.",
        "I can use clues around a word to work out its meaning.",
        "I can use the glossary to check a technical word.",
        "I can explain a technical word in my own words.",
        "I can choose a technical word instead of an everyday word when it fits.",
        "I can spell and use addition, condition, pollution, protection, nutrition and migration.",
    ],
    ["technical word", "topic word", "context clue", "glossary", "definition", "habitat", "herbivore", "nocturnal"],
    ["This lesson (everything you need is inside it)", "Optional: an information book about an animal or hobby you like"],
    "Child has done Week 6 Lessons 1 and 2: knows the glossary and has planned a koala report.",
    (
        "Why this matters. Every topic has its own special words. Authors use these technical words, also called topic words or Tier 3 words, because they are exact. Habitat means more than home. Herbivore means more than eater. When you understand technical words you understand the topic, and when you use them correctly your writing sounds like an expert's.\n\n"
        "Three kinds of words. Everyday words are used all the time, such as eat, big and sleep. General words are useful in many subjects, such as protect, condition and region. Technical words belong to one topic, such as marsupial, nocturnal and habitat. A koala report needs all three kinds, but the technical words show what you know.\n\n"
        "Context clues. When you meet a new word, look at the words around it. The sentence may give the meaning, give an example, say the opposite, or use a similar word. For example: Koalas are nocturnal, which means they are most active at night. The words after which means give the meaning.\n\n"
        "The glossary. If the clues are not enough, check the glossary. Authors put the important technical words in bold and explain them there. A glossary meaning is short, and you should say it in your own words, not copy it.\n\n"
        "Word parts. Some technical words have parts you know. Herbivore: the ending -vore comes from a word for eating, and a herbivore eats plants. Habitat is about where something lives. When a word has a part you know, use it as a clue, but check it, because a clue is not a guarantee.\n\n"
        "Using technical words. Use a technical word when it is more exact than an everyday word, and explain it the first time if your reader may not know it. For example: Koalas are herbivores, so they eat only plants. Do not use a technical word if you do not understand it. Check first.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -tion, which sounds like shun. Many topic and general words end this way, such as addition, condition, pollution, protection, nutrition and migration. The ending -tion is the most common spelling of the shun sound at the end of a word."
    ),
    [
        _step("1", "What technical words are", "A technical word belongs to one topic. It is exact, so it says more than an everyday word. Information texts use technical words so that readers learn the real names for things.\n\nYou do not have to know a technical word before you read. You can work it out.", "In a text about koalas, marsupial, habitat and nocturnal are technical words. Eat, sleep and tree are everyday words.", "Topic words are exact words.", ("Which is a technical word in a text about koalas?", ["sleep", "marsupial", "big"], 1, "Marsupial belongs to the topic of animals and is exact.")),
        _step("2", "Context clues", "Read the whole sentence, and the sentence before and after. Look for words that tell what the new word means. Clues can be a definition, an example, an opposite or a similar word.\n\nClue words such as which means, or, such as and unlike can point to the meaning.", "Koalas are nocturnal, which means they are most active at night. The clue is which means.", "Look around the word.", ("Koalas are herbivores, so they eat only plants. What does herbivore mean?", ["An animal that eats only plants", "An animal that eats only meat", "An animal that sleeps all day"], 0, "The words so they eat only plants give the meaning.")),
        _step("3", "Using the glossary", "If the clues do not help, look in the glossary. It lists technical words in alphabetical order with short meanings.\n\nThen say the meaning in your own words. If you can explain the word to someone else, you understand it.", "Glossary: habitat is the place where an animal lives and finds what it needs. In my own words, a habitat is an animal's home area with food and shelter.", "Check, then say it your own way.", ("What should you do after you read the glossary meaning?", ["Copy it exactly", "Say it in your own words", "Skip it"], 1, "Saying it in your own words shows you understand it.")),
        _step("4", "Word parts", "Look inside the word for a part you know. The ending -vore means eating, so a herbivore eats plants. The word habitat is about living in a place. A part can give a clue, but always check with the sentence or the glossary.\n\nNever guess without checking.", "Herbivore: herb means plants, vore means eating. That fits the glossary.", "Clue from the parts, then check.", ("Why should you check a word-part clue?", ["Because a clue is not always right", "Because word parts are never useful", "Because the glossary is wrong"], 0, "A word-part clue helps, but you need to check it.")),
        _step("5", "Choosing the exact word", "Ask whether a technical word would be clearer than an everyday one. Home area is fine, but habitat is exact. Eats only plants is fine, but herbivore is exact.\n\nIf your reader might not know the word, explain it in the same sentence.", "Koalas are herbivores, which means they eat only plants.", "Exact word, then explain it.", ("Which sentence uses a technical word and explains it?", ["Koalas like trees", "Koalas are nocturnal, which means they are active at night", "Koalas are good"], 1, "It uses nocturnal and explains it.")),
        _step("6", "Spelling focus: -tion", "The ending -tion sounds like shun. Many words that end this way come from a verb: add becomes addition, protect becomes protection, migrate becomes migration. Condition, pollution and nutrition end the same way.\n\nSay it slowly, then write -tion.", "Pollution is a danger to habitats. Good nutrition keeps animals healthy. Birds go on a migration.", "Shun at the end is usually -tion.", ("Which is spelled correctly?", ["protecshun", "protection", "protecsion"], 1, "The shun sound at the end is spelled -tion.")),
        _step("7", "Putting it together", "When you write an information text, choose three to five technical words for your topic. Use each one correctly. Add a glossary entry for each. Keep the entries in alphabetical order.\n\nYou will use this in your report.", "Koala report words: habitat, herbivore, joey, marsupial, nocturnal.", "Pick, explain, list.", ("Which order should glossary entries be in?", ["Alphabetical order", "Longest first", "Any order"], 0, "A glossary is in alphabetical order.")),
    ],
    (
        "Read the koala fact file below. Let's work out the technical words. Word one: marsupial. The sentence says a marsupial is an animal that carries its baby in a pouch, so the clue is the definition. Word two: joey. The clue is that a baby koala is called a joey, so a joey is a baby. Word three: habitat. The glossary says it is the place where an animal lives and finds what it needs. In my own words, a habitat is an animal's home area. Word four: herbivore. They eat the leaves of eucalyptus trees, so the clue is the example. The glossary agrees: eats only plants. Word five: nocturnal. The text says most active at night. Now I choose the exact word. I can write koalas are most active at night, but nocturnal is exact. So I write: Koalas are nocturnal, which means they are most active at night. Notice how I used a technical word and explained it. Notice also that I checked the glossary, and I said the meanings in my own words.\n\n" + KOALA_FILE
    ),
    (
        "Type your answers in the practice boxes. Part A: type what a technical word is, and give one technical word and one everyday word from the koala fact file. Part B: type what habitat and nocturnal mean, in your own words. Part C: type the correct word for each blank: Clean air gives animals ___ from harm. Good ___ means eating healthy food. A bird's long trip each year is a ___. Your parent can check your answers against the answer key."
    ),
    (
        "Use the koala fact file and then your own topic. Typed answers go in the boxes.\n\n" + KOALA_FILE + "\n\n"
        "Stage 1 (find them): type the five technical words in the koala fact file.\n"
        "Stage 2 (clues): for three of the words, type the clue in the sentence that told you the meaning.\n"
        "Stage 3 (own words): type the meaning of marsupial, herbivore and joey in your own words.\n"
        "Stage 4 (use them): type two sentences about koalas that each use a technical word and explain it, using which means or so.\n"
        "Stage 5 (your topic): use your topic from Week 6 Lesson 2, or a new one. Type five technical words for it.\n"
        "Stage 6 (your glossary): type a glossary of at least four of your words in alphabetical order, each with a short meaning in your own words.\n"
        "Stage 7 (your sentences): type two sentences about your topic that each use one technical word and explain it.\n"
        "Stage 8 (spell): type your six spelling words and one sentence for each of condition, protection and migration.\n\n"
        "Parent: check that the technical words are really topic words and not everyday words, that the clues are copied from the text, that meanings are in the child's own words, that glossary entries are in alphabetical order, and that the child can explain each word out loud. Accept any sensible topic and words."
    ),
    "Which technical word do you now know that you did not know before, and how did you work out what it meant?",
    "Did I find the technical words, use context clues and the glossary, explain each word in my own words, use technical words correctly in sentences, keep my glossary in ABC order, and spell addition, condition, pollution, protection, nutrition and migration correctly?",
    [
        _q("What is a technical word?", ["A very long word", "A word that belongs to one topic", "A word with a capital letter", "A word that rhymes"], 1, "A technical word belongs to one topic and is exact."),
        _q("Which is a technical word in a text about koalas?", ["sleep", "tree", "big", "marsupial"], 3, "Marsupial belongs to the topic."),
        _q("What are context clues?", ["Pictures on the cover", "The page numbers", "Words around a new word that help you understand it", "The author's name"], 2, "Context clues are the words around a new word."),
        _q("Where can you check a technical word?", ["The glossary", "The title", "The cover", "The page number"], 0, "The glossary explains key words."),
        _q("What does nocturnal mean?", ["Eats only plants", "Most active at night", "Lives in the sea", "A baby animal"], 1, "Nocturnal means most active at night."),
        _q("What does herbivore mean?", ["An animal that eats only meat", "An animal that lives in water", "An animal that eats only plants", "An animal that flies"], 2, "A herbivore eats only plants."),
        _q("What is a habitat?", ["A kind of food", "A baby animal", "A type of tree", "The place where an animal lives and finds what it needs"], 3, "A habitat is where an animal lives and finds what it needs."),
        _q("What should you do with a glossary meaning?", ["Say it in your own words", "Copy it exactly", "Ignore it", "Change the word"], 0, "Saying it in your own words shows you understand."),
        _q("Which is spelled correctly?", ["pollushun", "pollusion", "pollution", "polution"], 2, "Pollution has a double l and ends in -tion."),
        _q("Which is spelled correctly?", ["nutrishun", "nutrition", "nutrision", "nutrisyon"], 1, "Nutrition ends in -tion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: find a real information book or website about an animal or hobby. Write down three technical words and say how you worked out each meaning (context clue, glossary or word part). Then use all three correctly in one short paragraph.",
    [("technical word", "A word that belongs to one topic and is exact"), ("topic word", "Another name for a technical word"), ("context clue", "A word or phrase near a new word that helps you work out its meaning"), ("glossary", "A mini dictionary of key words near the back of a book"), ("definition", "The meaning of a word"), ("habitat", "The place where an animal lives and finds what it needs"), ("herbivore", "An animal that eats only plants"), ("nocturnal", "Most active at night")],
    [
        _video(
            "Context Clues | English For Kids (Mind Blooming)", "eHCpJ86XDY4",
            "Watch for the ways the words around an unknown word can help you work out its meaning. Think about how this matches the clues you used in the koala fact file. Parent: this video has not been fully checked, so please preview it before your child watches.",
            "If the video will not play, reread Steps 2 and 3 and the worked example.",
            ("What can help you work out a new word?", ["The words around it", "The page number", "The colour of the page"], 0, "Context clues are the words around the new word."),
        ),
    ],
    _sort("Technical or everyday?", "Sort each word from a text about koalas into technical or everyday.", ["Technical", "Everyday"], [("marsupial", 0), ("sleep", 1), ("habitat", 0), ("tree", 1), ("nocturnal", 0), ("big", 1), ("herbivore", 0), ("eat", 1)]),
    [
        _wc("Which means the place where an animal lives and finds what it needs?", ["habitat", "joey", "glossary"], 0, "A habitat is where an animal lives."),
        _wc("Which means an animal that eats only plants?", ["nocturnal", "herbivore", "marsupial"], 1, "A herbivore eats only plants."),
        _wc("Which means most active at night?", ["habitat", "herbivore", "nocturnal"], 2, "Nocturnal means active at night."),
        _wc("Which is a word or phrase near a new word that helps with its meaning?", ["context clue", "title", "caption"], 0, "A context clue helps with meaning."),
        _wc("Which is spelled correctly?", ["adition", "addition", "addishun"], 1, "Addition has a double d and ends in -tion."),
        _wc("Which is spelled correctly?", ["condishun", "condision", "condition"], 2, "Condition ends in -tion."),
        _wc("Which is spelled correctly?", ["protection", "protecshun", "protecsion"], 0, "Protection ends in -tion."),
        _wc("Which is spelled correctly?", ["migrashun", "migration", "migrasion"], 1, "Migration ends in -tion."),
    ],
    [
        {"key": "partA", "label": "Part A: technical words", "hint": "What a technical word is, one technical word and one everyday word."},
        {"key": "partB", "label": "Part B: meanings", "hint": "Habitat and nocturnal, in your own words."},
        {"key": "partC", "label": "Part C: -tion words", "hint": "protection, nutrition, migration."},
        {"key": "stage1", "label": "Find them", "hint": "The five technical words in the fact file."},
        {"key": "stage2", "label": "Clues", "hint": "The clue for three words."},
        {"key": "stage3", "label": "Own words", "hint": "Marsupial, herbivore and joey."},
        {"key": "stage4", "label": "Use them", "hint": "Two sentences that use and explain a technical word."},
        {"key": "stage5", "label": "My words", "hint": "Five technical words for your topic."},
        {"key": "stage6", "label": "My glossary", "hint": "At least four words in alphabetical order with meanings."},
        {"key": "stage7", "label": "My sentences", "hint": "Two sentences using and explaining a technical word."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for condition, protection and migration."},
    ],
    ["Using a technical word without knowing what it means", "Copying the glossary instead of using your own words", "Choosing everyday words, such as tree or big, as technical words", "Putting glossary entries out of alphabetical order", "Spelling the shun sound as shun or sion"],
    ["Find three technical words in a book at home and explain each to a parent.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: a technical word belongs to one topic and is exact; accept marsupial, habitat, herbivore, joey or nocturnal as technical, and sleep, tree, big or eat as everyday. Part B: habitat is the place where an animal lives and finds what it needs; nocturnal means most active at night (accept own words). Part C: protection, nutrition, migration in that order. Main task Stage 1: habitat, herbivore, joey, marsupial, nocturnal. Stage 2: accept the clue for three words, for example marsupial, an animal that carries its baby in a pouch; nocturnal, most active at night; herbivore, they eat the leaves of eucalyptus trees. Stage 3: marsupial is an animal that carries its baby in a pouch; herbivore eats only plants; joey is a baby koala or kangaroo (accept own words). Stage 4: accept sensible sentences, for example Koalas are herbivores, which means they eat only plants. Stages 5 to 7: accept any real topic words, a glossary of at least four entries in alphabetical order with meanings in the child's own words, and two sentences that use and explain a word. Quiz answers: a word that belongs to one topic; marsupial; words around a new word that help you understand it; the glossary; most active at night; an animal that eats only plants; the place where an animal lives and finds what it needs; say it in your own words; pollution; nutrition.",
)

LESSON["spelling"] = {
    "focus": "The -tion ending (the shun sound)",
    "teaching": "The sound shun at the end of a word is most often spelled -tion. Many words come from a verb: add becomes addition, protect becomes protection, migrate becomes migration. Say the word slowly, listen for shun, then write -tion.",
    "words": [
        _w("addition", "ad-di-tion", "add + ion, with a double d"),
        _w("condition", "con-di-tion", "the state something is in"),
        _w("pollution", "pol-lu-tion", "double l, harmful stuff in the air or water"),
        _w("protection", "pro-tec-tion", "protect + ion, keeping safe"),
        _w("nutrition", "nu-tri-tion", "the food that keeps a body healthy"),
        _w("migration", "mi-gra-tion", "migrate + ion, a long trip each year"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["protection", "protecshun", "protecsion"], 0, "Protection ends in -tion."),
        _c("Which is spelled correctly?", ["migrashun", "migrasion", "migration"], 2, "Migration ends in -tion."),
    ],
}
LESSON["spelling_focus"] = "The -tion ending (the shun sound)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
