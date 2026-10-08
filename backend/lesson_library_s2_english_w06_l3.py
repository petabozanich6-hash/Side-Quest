"""Stage 2 English, Week 6 Lesson 3: Technical Words and Context Clues (Language: vocabulary).
The child learns the difference between everyday words and technical (subject specific) words, how to work out a new word from context clues and word parts, and how to build the meaning of a technical word into their own writing. The model text is about the water cycle.
Spelling: the -tion ending: evaporation, condensation, precipitation, vegetation, pollution, migration.
Video status: the context clues video (CyK01USxdg0) was checked against its transcript. It teaches four types of context clue: examples, synonyms, antonyms and definitions.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["evaporation", "condensation", "precipitation", "vegetation", "pollution", "migration"]

WATER_CYCLE = (
    "THE WATER CYCLE\n\n"
    "Water on Earth is always on the move. The sun heats water in oceans, rivers and lakes. This causes evaporation, which is when liquid water turns into water vapour, an invisible gas. The vapour rises into the sky.\n\n"
    "High in the sky the air is cool. The cool air causes condensation. Condensation is when water vapour cools and changes back into tiny drops of liquid water. Millions of drops join together to form clouds.\n\n"
    "When the drops in a cloud become too heavy, they fall to the ground. Water that falls from the clouds, such as rain, hail or snow, is called precipitation. Some of it soaks into the soil and helps vegetation, or plant life, to grow. The rest runs into rivers and flows back to the ocean, and the water cycle begins again.\n\n"
    "GLOSSARY\n"
    "condensation: when water vapour cools and turns into drops of liquid water\n"
    "evaporation: when liquid water turns into water vapour\n"
    "precipitation: water that falls from clouds, such as rain, hail or snow\n"
    "vegetation: plant life\n"
    "water vapour: water as an invisible gas"
)

LESSON = build(
    "s2-eng-w06-l3-technical-words-context-clues",
    "Technical Words and Context Clues",
    "Every subject has its own special words. Learn how to spot technical words, work out what they mean from clues, and use them in your own writing, using a text about the water cycle.",
    "Language: vocabulary, technical words and context clues",
    ["EN2-VOCAB-01", "EN2-SPELL-01"],
    {
        "EN2-VOCAB-01": "Primary. Understands and effectively uses grade appropriate vocabulary, including subject specific (technical) words, by using context clues and word parts to work out meaning and by building the meaning of technical words into writing.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including words ending in -tion (week 6 spelling focus).",
    },
    "We are learning to find technical words in an information text, work out their meanings from context clues and word parts, use them in our own writing, and spell words that end in -tion.",
    [
        "I can explain what a technical word is.",
        "I can tell an everyday word from a technical word.",
        "I can use definition, synonym, example and antonym clues to work out a new word.",
        "I can use word parts, such as a root and a suffix, to help with meaning.",
        "I can use a technical word in a sentence and explain it for the reader.",
        "I can spell and use evaporation, condensation, precipitation, vegetation, pollution and migration.",
    ],
    ["technical word", "context clue", "definition", "synonym", "antonym", "suffix", "root word", "glossary"],
    ["This lesson (everything you need is inside it)", "Optional: a children's dictionary or a science book from home"],
    "Child knows what a glossary is from Lesson 1 and has planned an information report in Lesson 2.",
    (
        "Why this matters. Every subject has its own special words. Science has words like evaporation. Maths has words like perimeter. Technical words, also called subject specific words, are words that belong to one topic. Information reports use lots of them, so readers and writers need to understand them.\n\n"
        "Everyday words and technical words. Everyday words are used in daily talk, such as water, cloud and rain. Technical words are more exact and are used mostly in one subject, such as evaporation and condensation. A technical word often says in one word what would take a whole sentence in everyday words.\n\n"
        "Context clues. Context means the words and sentences around a new word. Authors often hide clues there. A definition clue tells you the meaning straight away, as in evaporation, which is when liquid water turns into water vapour. A synonym clue uses another word with a similar meaning. An example clue gives examples, such as precipitation, like rain, hail or snow. An antonym clue uses an opposite, such as condensation, the opposite of evaporation.\n\n"
        "Word parts. A root word is the main part of a word. A suffix is an ending added to it. Evaporate is the root, and adding -ion changes it into the noun evaporation, which names the action. Knowing that -tion often turns a verb into a noun helps you work out many technical words.\n\n"
        "Where to check. If the clues do not help, look in the glossary, then in a dictionary, or ask a parent. Always check that the meaning makes sense in the sentence.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -tion, which sounds like shun. Many technical words end this way, such as evaporation, condensation, precipitation, vegetation, pollution and migration.\n\n"
        "A quick demonstration. In the sentence Plants make up the vegetation of a forest, the words plants and forest are clues. Vegetation must mean plant life. Then I check the glossary to be sure."
    ),
    [
        _step("1", "What a technical word is", "A technical word belongs to one subject or topic. It names a special idea that everyday words do not name exactly.\n\nInformation reports use technical words, and good writers explain them.", "In a report about the water cycle, evaporation and condensation are technical words.", "A technical word belongs to a subject.", ("Which is a technical word in science?", ["Hello", "Evaporation", "Yesterday"], 1, "Evaporation is a science word about water turning to vapour.")),
        _step("2", "Everyday word or technical word?", "Everyday words are common, such as rain and cloud. Technical words are exact and belong to a subject, such as precipitation.\n\nUse an everyday word to explain a technical word.", "Rain, hail and snow are everyday words. The technical word that covers them all is precipitation.", "Technical words are exact.", ("Which word is the technical word for rain, hail and snow?", ["Precipitation", "Weather", "Wet"], 0, "Precipitation is the technical word for water falling from clouds.")),
        _step("3", "Four kinds of context clue", "A definition clue gives the meaning. A synonym clue gives a word with a similar meaning. An example clue gives examples. An antonym clue gives an opposite.\n\nLook at the words before and after the new word.", "Evaporation, which is when liquid water turns into water vapour. This is a definition clue.", "Look around the word for clues.", ("Precipitation, like rain, hail or snow. What kind of clue is this?", ["An antonym clue", "A definition clue", "An example clue"], 2, "Rain, hail and snow are examples, so this is an example clue.")),
        _step("4", "Word parts", "Find the root word, the main part. Then look at the ending. The suffix -tion often turns a verb into a noun.\n\nSay the root and the ending together to guess the meaning.", "Evaporate is a verb, to turn into vapour. Evaporation is the noun, the process of turning into vapour.", "Root plus suffix gives a clue.", ("What does the suffix -tion often do?", ["Turns a verb into a noun", "Makes a word mean the opposite", "Makes a word shorter"], 0, "The suffix -tion often turns a verb into a noun, such as evaporate into evaporation.")),
        _step("5", "Checking the meaning", "If clues are not enough, check the glossary, then a dictionary. Then try the meaning in the sentence. It must make sense.\n\nAlways write the meaning in your own words.", "The glossary says vegetation is plant life. Replace it in the sentence: Some of the water helps plant life to grow. It makes sense.", "Check, then test the meaning.", ("What should you do after finding a meaning?", ["Forget it", "Copy it word for word", "Test it in the sentence and say it in your own words"], 2, "Test the meaning in the sentence, then say it in your own words.")),
        _step("6", "Using technical words in your writing", "When you use a technical word in a report, explain it the first time. You can give a definition, an example or a synonym.\n\nThis helps the reader understand without stopping to look it up.", "Condensation, when water vapour cools into drops of liquid water, forms clouds.", "Use the word and explain it.", ("Which sentence explains the technical word?", ["Condensation is good.", "Condensation, when water vapour cools into drops of water, makes clouds.", "Condensation is condensation."], 1, "The second sentence gives a definition of condensation.")),
        _step("7", "Spelling focus: -tion", "The ending -tion sounds like shun. Many technical words end this way, such as evaporation, condensation, precipitation, vegetation, pollution and migration.\n\nSay the word slowly, listen for shun at the end, then write -tion.", "Evaporation, condensation and precipitation are three stages of the water cycle.", "Shun at the end is usually -tion.", ("Which is spelled correctly?", ["pollushun", "polution", "pollution"], 2, "Pollution has a double l and ends in -tion.")),
    ],
    (
        "Read the water cycle text on the screen. Let's find and work out the technical words. First, evaporation. The next words say, which is when liquid water turns into water vapour. That is a definition clue. Now condensation. The text says, when water vapour cools and changes back into tiny drops of liquid water. Another definition clue. The word back tells me it is the opposite of evaporation, which is an antonym clue. Now precipitation. The text says, such as rain, hail or snow. Those are examples, so it is an example clue. Finally vegetation. The text says plant life. That is a synonym clue. I can test each meaning in the sentence to make sure it makes sense. I can also check the glossary at the end. "
        "Notice how the author did most of the work for us. A good writer explains a technical word the first time it appears.\n\n" + WATER_CYCLE
    ),
    (
        "Type your answers in the practice boxes. Part A: type what a technical word is. Part B: type the kind of context clue for each, and the meaning. Evaporation, which is when liquid water turns into water vapour. Precipitation, such as rain, hail or snow. Part C: sort these into everyday words or technical words: rain, condensation, cloud, evaporation. Part D: type the correct -tion word for each blank. Choose from evaporation, condensation, precipitation, vegetation, pollution and migration. Dirty air is a kind of ___. Plants make up the ___ of a forest. Birds that fly to warmer places each year take part in ___. Your parent can check your answers against the answer key."
    ),
    (
        "Use the water cycle text to do the tasks. Typed answers go in the boxes.\n\n" + WATER_CYCLE + "\n\n"
        "Stage 1 (find the clues): type the clue you find for each word: evaporation, condensation, precipitation, vegetation. Type what kind of clue it is.\n"
        "Stage 2 (own words): type the meaning of evaporation, condensation and precipitation in your own words.\n"
        "Stage 3 (your report topic): use the topic from your plan in Lesson 2, or a new one. Type four technical words about it. Use a book or a glossary to find their meanings.\n"
        "Stage 4 (explain in a sentence): type a sentence for each technical word that explains it for the reader, using a definition, an example or a synonym.\n"
        "Stage 5 (mini glossary): type your four words and meanings in alphabetical order.\n"
        "Stage 6 (swap a word): type this sentence again using a technical word instead of the everyday words: The water goes up into the sky as a gas.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of evaporation, condensation and precipitation.\n\n"
        "Parent: check that the child names a clue type for each word, that meanings are in the child's own words, that each sentence explains the technical word, that the mini glossary is in alphabetical order, and that the stage 6 sentence uses evaporation or evaporates. Accept any sensible topic and technical words."
    ),
    "Why should a writer explain a technical word the first time it appears in a report?",
    "Did I find the clues, work out the meanings, use technical words in my own sentences with explanations, keep my glossary in ABC order, and spell evaporation, condensation, precipitation, vegetation, pollution and migration correctly?",
    [
        _q("What is a technical word?", ["A word that belongs to one subject", "A very short word", "A word everyone uses at home", "A word without a meaning"], 0, "A technical word belongs to one subject or topic."),
        _q("Which is a technical word?", ["Rain", "Cloud", "Precipitation", "Wet"], 2, "Precipitation is the technical word for water falling from clouds."),
        _q("What is context?", ["The last page", "The words and sentences around a new word", "A kind of picture", "The title"], 1, "Context is the words and sentences around a word."),
        _q("Condensation, the opposite of evaporation. What kind of clue is this?", ["A definition clue", "An example clue", "A synonym clue", "An antonym clue"], 3, "The opposite is an antonym clue."),
        _q("Vegetation, or plant life. What kind of clue is this?", ["A synonym clue", "An antonym clue", "An example clue", "No clue"], 0, "Plant life has a similar meaning, so it is a synonym clue."),
        _q("What does the suffix -tion often do?", ["Makes a word an opposite", "Turns a verb into a noun", "Makes a word plural", "Makes a word past tense"], 1, "The suffix -tion often turns a verb into a noun."),
        _q("Where can you check a technical word's meaning?", ["In the glossary or a dictionary", "Only on the cover", "Nowhere", "In the page numbers"], 0, "A glossary or dictionary gives meanings."),
        _q("What should you do the first time you use a technical word in a report?", ["Hide it", "Spell it wrong", "Explain it", "Use it ten times"], 2, "Explain the technical word for the reader."),
        _q("Which is spelled correctly?", ["evaporashun", "evaporation", "evaperation", "evaporasion"], 1, "Evaporation ends in -tion."),
        _q("Which is spelled correctly?", ["migrashun", "migrasion", "migrition", "migration"], 3, "Migration ends in -tion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: choose a subject you like, such as soccer, space or cooking. Write a short glossary of five technical words with meanings in your own words, in alphabetical order, then use two of them in an explaining sentence.",
    [("technical word", "A word that belongs to one subject or topic"), ("context clue", "A hint in the words around a new word that helps you work out its meaning"), ("definition", "A clue or statement that tells what a word means"), ("synonym", "A word with a similar meaning"), ("antonym", "A word with the opposite meaning"), ("suffix", "An ending added to a word, such as -tion"), ("root word", "The main part of a word"), ("glossary", "A mini dictionary of key words near the back of a book")],
    [
        _video(
            "Context Clues (award winning teaching video)", "CyK01USxdg0",
            "Watch how readers use the words around a new word to work out its meaning. Listen for the four kinds of clue: examples, synonyms, antonyms and definitions. This video is a few minutes long. Status: transcript checked.",
            "If the video will not play, reread Step 3 and the water cycle text.",
            ("Which four kinds of context clue does the video teach?", ["Examples, synonyms, antonyms and definitions", "Titles, pictures, maps and headings", "Rhymes, rhythm, beats and verses"], 0, "The video says authors use examples, synonyms, antonyms and definitions."),
        ),
    ],
    _sort("Everyday or technical?", "Sort each word into everyday words or technical words.", ["Everyday word", "Technical word"], [("dog", 0), ("evaporation", 1), ("tree", 0), ("condensation", 1), ("run", 0), ("precipitation", 1), ("happy", 0), ("vegetation", 1)]),
    [
        _wc("Which word belongs to one subject?", ["technical word", "everyday chat", "nothing"], 0, "A technical word belongs to one subject."),
        _wc("Which is a hint in the words around a new word?", ["title", "index", "context clue"], 2, "A context clue is a hint in the words around a word."),
        _wc("Which word means the opposite?", ["synonym", "antonym", "example"], 1, "An antonym means the opposite."),
        _wc("Which is an ending added to a word?", ["suffix", "root", "glossary"], 0, "A suffix is an ending added to a word."),
        _wc("Which is spelled correctly?", ["condensashun", "condensation", "condensasion"], 1, "Condensation ends in -tion."),
        _wc("Which is spelled correctly?", ["precipatation", "presipitation", "precipitation"], 2, "Precipitation has an i before the tation."),
        _wc("Which is spelled correctly?", ["vegetation", "vegitation", "vegetashun"], 0, "Vegetation has an e before the tation."),
        _wc("Which is spelled correctly?", ["polution", "pollution", "pollushun"], 1, "Pollution has a double l and ends in -tion."),
    ],
    [
        {"key": "partA", "label": "Part A: technical word", "hint": "What is a technical word?"},
        {"key": "partB", "label": "Part B: clue and meaning", "hint": "The kind of context clue for each, and the meaning of each word."},
        {"key": "partC", "label": "Part C: sorting", "hint": "Everyday words or technical words: rain, condensation, cloud, evaporation."},
        {"key": "partD", "label": "Part D: -tion words", "hint": "Fill the three blanks. Choose from evaporation, condensation, precipitation, vegetation, pollution and migration."},
        {"key": "stage1", "label": "Find the clues", "hint": "The clue and the clue type for evaporation, condensation, precipitation and vegetation."},
        {"key": "stage2", "label": "Own words", "hint": "Meanings of evaporation, condensation and precipitation in your own words."},
        {"key": "stage3", "label": "My technical words", "hint": "Four technical words about your report topic, with meanings."},
        {"key": "stage4", "label": "Explaining sentences", "hint": "A sentence for each word that explains it for the reader."},
        {"key": "stage5", "label": "Mini glossary", "hint": "Your four words and meanings in alphabetical order."},
        {"key": "stage6", "label": "Swap a word", "hint": "Rewrite: The water goes up into the sky as a gas, using a technical word."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence for each of evaporation, condensation and precipitation."},
    ],
    ["Skipping a technical word instead of looking for clues", "Copying a glossary meaning word for word", "Using a technical word without explaining it", "Mixing up synonym and antonym clues", "Spelling the shun sound as shun or sion"],
    ["Find a science or maths book at home and list three technical words you find in it.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: a technical word belongs to one subject or topic and names a special idea. Part B: evaporation is a definition clue, meaning liquid water turning into water vapour; precipitation is an example clue, meaning water that falls from clouds, such as rain, hail or snow. Part C: everyday words are rain and cloud; technical words are condensation and evaporation. Part D: pollution, vegetation, migration. Main task: Stage 1: evaporation is a definition clue; condensation is a definition clue (and an antonym idea with evaporation); precipitation is an example clue; vegetation is a synonym clue, plant life. Stage 2: accept meanings in the child's own words, such as water turning into gas; gas turning back into drops; water falling from clouds. Stages 3 to 5: accept any sensible topic and technical words, with explaining sentences and a glossary in alphabetical order. Stage 6: accept a sentence such as Water evaporates into the sky as vapour. Quiz answers: a word that belongs to one subject; precipitation; the words and sentences around a new word; an antonym clue; a synonym clue; turns a verb into a noun; in the glossary or a dictionary; explain it; evaporation; migration.",
)

LESSON["spelling"] = {
    "focus": "The -tion ending (the shun sound)",
    "teaching": "The sound shun at the end of a word is most often spelled -tion. Many technical words come from a verb: evaporate becomes evaporation, condense becomes condensation. Say the word slowly, listen for shun, then write -tion.",
    "words": [
        _w("evaporation", "e-vap-o-ra-tion", "from evaporate, drop the e and add -ion"),
        _w("condensation", "con-den-sa-tion", "from condense, with sa before tion"),
        _w("precipitation", "pre-cip-i-ta-tion", "rain, hail and snow, with an i in the middle"),
        _w("vegetation", "veg-e-ta-tion", "plant life, with e before ta"),
        _w("pollution", "pol-lu-tion", "double l, then lu, then tion"),
        _w("migration", "mi-gra-tion", "from migrate, to travel to another place"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["migrashun", "migration", "migrasion"], 1, "Migration ends in -tion."),
        _c("Which is spelled correctly?", ["vegitation", "vegetashun", "vegetation"], 2, "Vegetation ends in -tion."),
    ],
}
LESSON["spelling_focus"] = "The -tion ending (the shun sound)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
