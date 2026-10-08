"""Stage 2 English, Week 7 Lesson 1: Main Idea and Key Details (Reading and comprehension).
The child learns to find the main idea of an information text and the key details that support it, using a short original passage about honey bees.
Spelling: the -sion and -ssion endings: decision, television, explosion, permission, discussion, expression.
Video status: NO VIDEO YET. The scope and sequence says every lesson needs a checked YouTube video. Find one, check its transcript, then add it to the videos list below. Do not register this module in lesson_library.py or add week 7 to BUILT_OUT_WEEKS until the whole week is built.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["decision", "television", "explosion", "permission", "discussion", "expression"]

BEE_TEXT = (
    "PASSAGE: HONEY BEES\n\n"
    "Honey bees are small insects that live together in a hive. A hive can hold thousands of bees, and every bee has a job.\n\n"
    "The queen bee lays the eggs. Worker bees clean the hive, look after the young and collect nectar from flowers. Nectar is turned into honey and stored in wax cells.\n\n"
    "Bees also help plants. When a bee visits a flower, pollen sticks to its body. The bee carries the pollen to the next flower, and this helps new seeds to grow.\n\n"
    "Honey bees work as a team, and people depend on them for honey and for many of the foods we eat."
)

LESSON = build(
    "s2-eng-w07-l1-main-idea-and-key-details",
    "Main Idea and Key Details",
    "Every information text is about one big idea. Learn how to find the main idea, spot the key details that support it, and ignore details that do not matter, then try it on your own text.",
    "Reading: main idea and key details",
    ["EN2-RECOM-01", "EN2-SPELL-01"],
    {
        "EN2-RECOM-01": "Primary. Reads and comprehends texts for wide purposes using knowledge of text structures and language, and by monitoring comprehension. In this lesson the child identifies the main idea of an information text and the key details that support it.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including words ending in -sion and -ssion (week 7 spelling focus).",
    },
    "We are learning to find the main idea of an information text, to pick out the key details that support it, and to spell words that end in -sion and -ssion.",
    [
        "I can explain what a main idea is.",
        "I can find the main idea of a paragraph and of a whole text.",
        "I can pick out key details that support the main idea.",
        "I can tell a key detail from an interesting extra detail.",
        "I can say the main idea in one sentence of my own.",
        "I can spell and use decision, television, explosion, permission, discussion and expression.",
    ],
    ["main idea", "key detail", "topic", "paragraph", "supporting detail", "summary"],
    ["This lesson (everything you need is inside it)", "Optional: one short information text or magazine article chosen by a parent"],
    "Child has planned an information report in Week 6 and knows what a topic and a subtopic are.",
    (
        "Why this matters. When you read an information text, you cannot remember every fact. Good readers hold on to the big idea and the facts that matter most. This helps you understand, remember and explain what you read.\n\n"
        "Topic and main idea. The topic is what a text is about in a word or two, such as honey bees. The main idea is the most important thing the text says about the topic, such as honey bees work as a team and people depend on them.\n\n"
        "Key details. Key details are the facts that support the main idea. If you took a key detail away, the main idea would be harder to understand. Extra details are interesting, but the main idea would still make sense without them.\n\n"
        "Where to look. In an information text the main idea is often in the first or last sentence of a paragraph. Headings and the introduction give clues too. Sometimes you have to work it out by asking: what is this whole paragraph mostly about?\n\n"
        "The routine. First, read the paragraph. Second, ask what or who it is about. Third, ask what the author says about it. Fourth, say the main idea in one sentence in your own words. Fifth, find two or three facts that support it. Sixth, check that your main idea covers the whole paragraph, not just one fact.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -sion and -ssion, which both sound like shun. Words such as decision, television and discussion use these endings."
    ),
    [
        _step("1", "Topic versus main idea", "The topic is what a text is about, in one or two words. The main idea is the most important point the author makes about that topic.\n\nTopic: honey bees. Main idea: honey bees work as a team and people depend on them.", "Topic: dogs. Main idea: dogs can be trained to help people in many ways.", "The topic is short. The main idea is a whole sentence.", ("Which is a topic, not a main idea?", ["Honey bees", "Honey bees work as a team", "People depend on bees for food"], 0, "A topic is a word or two. A main idea is a full idea about the topic.")),
        _step("2", "Finding the main idea of a paragraph", "Read the paragraph, then ask: what is this mostly about, and what does the author say about it? Check the first and last sentences for clues.\n\nThe main idea must cover the whole paragraph, not just one fact.", "Paragraph: The queen bee lays the eggs. Worker bees clean the hive, look after the young and collect nectar. Main idea: the bees in a hive each have a job.", "Ask what it is mostly about.", ("Which is the main idea of the paragraph about the queen and worker bees?", ["Worker bees collect nectar", "Each bee in the hive has a job", "Bees live in wax"], 1, "The paragraph is mostly about the different jobs in the hive.")),
        _step("3", "Spotting key details", "Key details support the main idea. Ask: does this fact help me understand the main idea? If yes, it is a key detail.\n\nSome facts are interesting but do not support the main idea. These are extra details.", "Main idea: bees help plants. Key detail: pollen sticks to a bee and is carried to the next flower. Extra detail: a hive can smell sweet.", "Key details prove the main idea.", ("Main idea: bees help plants. Which is a key detail?", ["Pollen is carried from flower to flower", "A hive can smell sweet", "Bees are small"], 0, "Carrying pollen shows how bees help plants.")),
        _step("4", "Finding the main idea of the whole text", "Look at the main idea of each paragraph. Then ask what idea they all share. That shared idea is the main idea of the whole text.\n\nThe last paragraph often sums it up.", "Paragraph ideas: hive jobs; making honey; helping plants; people depend on bees. Whole text: honey bees work as a team and people depend on them.", "Join the paragraph ideas.", ("What is the best main idea of the whole bee passage?", ["Queens lay eggs", "Honey bees work as a team and people depend on them", "Flowers have pollen"], 1, "This idea covers every paragraph.")),
        _step("5", "Saying it in your own words", "A good summary uses your own words, not the author's. Say the main idea in one sentence, then add one or two key details.\n\nDo not copy whole sentences.", "Honey bees each have a job and work together, and they also help plants grow.", "Own words, one sentence.", ("Which is a good main idea written in your own words?", ["Honey bees are small insects that live together in a hive.", "Bees live and work together, and we need them.", "Bees."], 1, "It is a full idea in the reader's own words.")),
        _step("6", "Spelling focus: -sion and -ssion", "The endings -sion and -ssion both sound like shun or zhun. Use -sion after a vowel or r in words like decision and television. Use -ssion after a short vowel in words like permission and discussion.\n\nThere is no rule that covers everything, so learn each word.", "The discussion led to a decision about what to watch on television.", "Learn each word, then check it.", ("Which is spelled correctly?", ["decishun", "decision", "decission"], 1, "Decision ends in -sion.")),
    ],
    (
        "Let's read the passage about honey bees on the screen. First paragraph: honey bees live in a hive and every bee has a job. Second paragraph: the queen lays eggs, and workers clean, look after the young and collect nectar. Third paragraph: bees help plants by carrying pollen from flower to flower. Last paragraph: honey bees work as a team and people depend on them. The topic of the whole text is honey bees. To find the main idea I look at what each paragraph says and ask what they share. They all show that bees work together and that this matters to people. So my main idea is: honey bees work as a team and people depend on them. Key details are the jobs in the hive, honey, and pollen. An extra detail would be how big a hive is, because it does not prove the main idea.\n\n" + BEE_TEXT
    ),
    (
        "Type your answers in the practice boxes. Part A: in your own words, write what a main idea is. Part B: read this paragraph and type its main idea. Dolphins talk to each other with clicks and whistles. Each dolphin has its own whistle, like a name. They also use body movements to send messages. Part C: write two key details from the bee passage that support the main idea that bees help plants. Part D: type the correct word for each blank. Choose from decision, television, explosion, permission, discussion and expression. We had a ___ about which book to read. I asked for ___ to go outside. The loud ___ made everyone jump. Your parent can check your answers against the answer key."
    ),
    (
        "Find the main idea in a text of your own. Typed answers go in the boxes. Use the bee passage as a model.\n\n" + BEE_TEXT + "\n\n"
        "Stage 1 (choose a text): with a parent, choose a short information text, such as a magazine article or a page from an information book. Type its title.\n"
        "Stage 2 (topic): type the topic in one or two words.\n"
        "Stage 3 (paragraph ideas): type the main idea of each paragraph in one short sentence.\n"
        "Stage 4 (whole text): type the main idea of the whole text in one sentence in your own words.\n"
        "Stage 5 (key details): type three key details that support the main idea.\n"
        "Stage 6 (extra detail): type one interesting detail that is not a key detail, and say why.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of decision, discussion and expression.\n\n"
        "Parent: check that the topic is short, that the main idea is a full sentence in the child's own words, that it covers the whole text, and that key details really support it. Accept any sensible text and any reasonable wording."
    ),
    "Why is it easier to remember a text when you know its main idea?",
    "Did I name the topic, say the main idea in one sentence of my own, pick out key details that support it, and spell decision, television, explosion, permission, discussion and expression correctly?",
    [
        _q("What is the main idea of a text?", ["The first word", "The most important point about the topic", "The longest sentence", "The title only"], 1, "The main idea is the most important point the author makes about the topic."),
        _q("Which is a topic?", ["Honey bees", "Honey bees work as a team", "People depend on bees for food", "Bees collect nectar to make honey"], 0, "A topic is a word or two."),
        _q("What are key details?", ["Facts that support the main idea", "Facts that make the text longer", "The title", "The last word"], 0, "Key details support the main idea."),
        _q("Where is the main idea often found?", ["In the first or last sentence of a paragraph", "Only in the glossary", "Only in the index", "Never in the text"], 0, "Main ideas are often in the first or last sentence."),
        _q("Which sentence is an extra detail for the main idea that bees help plants?", ["Pollen sticks to a bee", "A hive can smell sweet", "The bee carries pollen to the next flower", "New seeds can grow"], 1, "A sweet smell does not show how bees help plants."),
        _q("How should you write a main idea?", ["Copy a whole sentence", "In your own words", "As one word", "As a question only"], 1, "Use your own words."),
        _q("What does the main idea of a whole text need to do?", ["Cover every paragraph", "Cover only one fact", "Be longer than the text", "Be a question"], 0, "It must cover the whole text."),
        _q("Which is spelled correctly?", ["televishun", "television", "televission", "televizion"], 1, "Television ends in -sion."),
        _q("Which is spelled correctly?", ["permishun", "permision", "permission", "permition"], 2, "Permission ends in -ssion."),
        _q("Which is spelled correctly?", ["discushun", "discussion", "discusion", "discution"], 1, "Discussion ends in -ssion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: choose an advertisement or news story from a magazine. Say its main idea in one sentence and find three key details. Then compare with a family member to see if you agree.",
    [("main idea", "The most important point a text makes about its topic"), ("key detail", "A fact that supports the main idea"), ("topic", "What a text is about in a word or two"), ("paragraph", "A group of sentences about one idea"), ("supporting detail", "A fact that backs up an idea"), ("summary", "A short retelling of the main points in your own words")],
    [],
    _sort("Topic, main idea or key detail?", "Sort each item into the right group using the bee passage.", ["Topic", "Main idea", "Key detail"], [("Honey bees", 0), ("Honey bees work as a team and people depend on them", 1), ("The queen bee lays the eggs", 2), ("Pollen is carried from flower to flower", 2), ("Bees help plants grow", 1), ("Worker bees collect nectar", 2)]),
    [
        _wc("Which is the most important point of a text?", ["main idea", "title", "glossary"], 0, "The main idea is the most important point."),
        _wc("Which supports the main idea?", ["key detail", "index", "caption"], 0, "Key details support the main idea."),
        _wc("Which is what a text is about in a word or two?", ["summary", "topic", "heading"], 1, "That is the topic."),
        _wc("Which is spelled correctly?", ["decishun", "decision", "decission"], 1, "Decision ends in -sion."),
        _wc("Which is spelled correctly?", ["explosion", "explosshun", "explotion"], 0, "Explosion ends in -sion."),
        _wc("Which is spelled correctly?", ["expresion", "expreshun", "expression"], 2, "Expression ends in -ssion."),
        _wc("Which is spelled correctly?", ["permission", "permishun", "permision"], 0, "Permission ends in -ssion."),
        _wc("Which is spelled correctly?", ["televishun", "television", "televison"], 1, "Television ends in -sion."),
    ],
    [
        {"key": "partA", "label": "Part A: main idea", "hint": "In your own words, what is a main idea?"},
        {"key": "partB", "label": "Part B: dolphins", "hint": "The main idea of the dolphin paragraph."},
        {"key": "partC", "label": "Part C: key details", "hint": "Two key details that show bees help plants."},
        {"key": "partD", "label": "Part D: -sion and -ssion words", "hint": "Fill the three blanks. Choose from decision, television, explosion, permission, discussion and expression."},
        {"key": "stage1", "label": "My text", "hint": "The title of the text you chose."},
        {"key": "stage2", "label": "Topic", "hint": "The topic in one or two words."},
        {"key": "stage3", "label": "Paragraph ideas", "hint": "One short sentence for each paragraph."},
        {"key": "stage4", "label": "Main idea of the whole text", "hint": "One sentence in your own words."},
        {"key": "stage5", "label": "Key details", "hint": "Three key details that support the main idea."},
        {"key": "stage6", "label": "Extra detail", "hint": "One interesting detail that is not key, and why."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence for each of decision, discussion and expression."},
    ],
    ["Mixing up the topic and the main idea", "Choosing one fact as the main idea", "Copying a sentence instead of using own words", "Choosing an interesting extra detail as a key detail", "Writing a main idea that does not cover the whole text"],
    ["Read a page of an information book and say its main idea out loud.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: the most important point a text makes about its topic. Part B: accept a sentence such as dolphins use sounds and body movements to talk to each other. Part C: accept two of: pollen sticks to the bee; the bee carries it to the next flower; this helps seeds grow. Part D: discussion, permission, explosion. Main task: accept any sensible text; a short topic; a one sentence idea for each paragraph; a whole text main idea in the child's own words that covers all paragraphs; three key details that really support it; one interesting extra detail with a reason. Quiz answers: the most important point about the topic; honey bees; facts that support the main idea; in the first or last sentence of a paragraph; a hive can smell sweet; in your own words; cover every paragraph; television; permission; discussion.",
)

LESSON["spelling"] = {
    "focus": "The -sion and -ssion endings (the shun sound)",
    "teaching": "The endings -sion and -ssion can both sound like shun or zhun. Words such as decision and television use -sion. Words such as permission and discussion use -ssion. Learn each word and check it.",
    "words": [
        _w("decision", "de-ci-sion", "a choice you make; ends in -sion"),
        _w("television", "tel-e-vi-sion", "tele means far and vision means seeing"),
        _w("explosion", "ex-plo-sion", "a loud bang; ends in -sion"),
        _w("permission", "per-mis-sion", "double s before ion"),
        _w("discussion", "dis-cus-sion", "double s before ion"),
        _w("expression", "ex-pres-sion", "double s before ion"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["discussion", "discushun", "discution"], 0, "Discussion ends in -ssion."),
        _c("Which is spelled correctly?", ["decishun", "decission", "decision"], 2, "Decision ends in -sion."),
    ],
}
LESSON["spelling_focus"] = "The -sion and -ssion endings (the shun sound)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
