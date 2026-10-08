"""Stage 2 English, Week 7 Lesson 1: Main Idea and Key Details (Reading and comprehension).
The child learns to find the main idea of a paragraph and of a whole information text, and the key details that support it, then writes a short summary using a model text about echidnas.
Spelling: -sion and -ssion: decision, vision, division, session, discussion, permission.
Outcomes: EN2-RECOM-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 7, Lesson 1, Main idea and key details, spelling -sion and -ssion). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Video status: no video is attached to this lesson, because none has been found and checked.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["decision", "vision", "division", "session", "discussion", "permission"]

ECHIDNAS = (
    "ECHIDNAS\n\n"
    "Paragraph 1\n"
    "Echidnas are unusual Australian mammals. They are covered in sharp spines. They have a long snout instead of a nose and mouth like a dog's.\n\n"
    "Paragraph 2\n"
    "Echidnas are monotremes, which means they are mammals that lay eggs. The female lays one egg and keeps it in a pouch. The baby, called a puggle, hatches after about ten days.\n\n"
    "Paragraph 3\n"
    "Echidnas eat ants and termites. They have no teeth. They catch insects with a long, sticky tongue.\n\n"
    "Paragraph 4\n"
    "Echidnas protect themselves from danger. They can dig straight down into the soil, or curl into a spiky ball."
)

LESSON = build(
    "s2-eng-w07-l1-main-idea-key-details",
    "Main Idea and Key Details",
    "Learn how to find what a paragraph is mostly about, pick out the key details that support it, and use them to write a short summary, using a text about echidnas.",
    "Reading and comprehension: main idea and key details",
    ["EN2-RECOM-01", "EN2-SPELL-01"],
    {
        "EN2-RECOM-01": "Reads and comprehends texts for wide purposes using knowledge of text structures and language, and by monitoring comprehension. This lesson focuses on finding the main idea and key details of an information text and summarising them.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is words ending in -sion and -ssion.",
    },
    "We are learning to find the main idea and key details of a paragraph and a whole text, to write a short summary, and to spell words that end in -sion and -ssion.",
    [
        "I can explain what a main idea is.",
        "I can find the main idea of a paragraph.",
        "I can pick out key details that support the main idea.",
        "I can tell the difference between a key detail and an extra detail.",
        "I can write a short summary in my own words.",
        "I can spell and use decision, vision, division, session, discussion and permission.",
    ],
    ["main idea", "key detail", "topic sentence", "paragraph", "summary", "supporting detail", "monotreme", "in your own words"],
    ["This lesson (everything you need is inside it)", "Optional: an information book or a short article from home"],
    "Child has used headings, the contents page, the glossary and the index (Week 6 Lesson 1) and has taken notes using key words (Week 6 Lesson 4).",
    (
        "Why this matters. When you read an information text, you cannot remember every fact. Good readers know what each part is mostly about, and which facts matter most. This helps you study, take notes, write reports and answer questions.\n\n"
        "The main idea. The main idea is what a paragraph, or a whole text, is mostly about. It is the big idea that all the other sentences are connected to. You can often say it in one short sentence.\n\n"
        "Key details. Key details are the facts that tell more about the main idea and support it. If you took a key detail away, the paragraph would be missing something important. An extra detail is interesting, but the paragraph still makes sense without it.\n\n"
        "The topic sentence. In many information paragraphs, the first sentence tells the main idea. It is called the topic sentence. The rest of the sentences give the key details. Sometimes the main idea is not stated, so you have to work it out by asking what all the details have in common.\n\n"
        "The main idea of a whole text. A whole text has a main idea, and each paragraph has its own. When you put the paragraph main ideas together, they point to the main idea of the whole text. A heading or title can also be a clue.\n\n"
        "Summarising. A summary is a short retelling of the most important ideas, in your own words. A good summary has the main idea and only the key details. It leaves out the extra details. You can use the key-word notes you learned in Week 6.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -sion and -ssion. The -sion ending often says zhun, as in decision, vision and division. The -ssion ending says shun, as in session, discussion and permission."
    ),
    [
        _step("1", "What is a main idea?", "The main idea is what a paragraph is mostly about. Ask yourself: what is the one big idea that all these sentences are about?\n\nIf you can say it in one short sentence, you have found the main idea.", "Paragraph 3 of the Echidnas text tells about ants, termites, no teeth and a sticky tongue. The main idea is what echidnas eat and how they catch it.", "One big idea per paragraph.", ("What is the main idea?", ["What a paragraph is mostly about", "The shortest sentence", "The last word"], 0, "The main idea is what the paragraph is mostly about.")),
        _step("2", "Key details", "Key details are facts that support the main idea. They tell more about it. If you took a key detail away, the paragraph would be missing something important.\n\nAsk: does this fact help explain the main idea?", "In Paragraph 3, they eat ants and termites and they catch insects with a long, sticky tongue are key details about how echidnas feed.", "Key details support the main idea.", ("What do key details do?", ["Support the main idea", "Change the topic", "Make the text shorter"], 0, "Key details support and explain the main idea.")),
        _step("3", "The topic sentence", "In many paragraphs, the first sentence tells the main idea. This is the topic sentence. The other sentences give details.\n\nSometimes the topic sentence is not first, or there isn't one. Then ask what all the sentences have in common.", "Paragraph 1 starts with Echidnas are unusual Australian mammals. That is the topic sentence. The spines and the snout are details.", "First sentence is often the main idea.", ("In Paragraph 4, which sentence is the topic sentence?", ["Echidnas protect themselves from danger.", "They can dig straight down into the soil.", "Or curl into a spiky ball."], 0, "The first sentence gives the main idea of the paragraph.")),
        _step("4", "Key detail or extra detail?", "An extra detail is interesting, but the paragraph makes sense without it. A key detail is needed to understand the main idea.\n\nWhen you summarise, keep the key details and leave out the extras.", "In Paragraph 2 about eggs, the female lays one egg is a key detail. The exact day the puggle hatches is an extra detail.", "Keep the key, drop the extra.", ("Which would you leave out of a short summary?", ["A very small, extra detail", "The main idea", "A key detail"], 0, "Extra details can be left out of a summary.")),
        _step("5", "The main idea of the whole text", "Put the paragraph main ideas together. Paragraph 1 is about how echidnas look, Paragraph 2 about eggs, Paragraph 3 about food and Paragraph 4 about staying safe.\n\nThe main idea of the whole text is bigger than any one paragraph. Ask what they all show.", "The Echidnas text is mostly about what makes echidnas unusual animals, how they live and how they stay safe.", "Add up the paragraphs.", ("The main idea of a whole text comes from what?", ["All the paragraph main ideas together", "Only the last paragraph", "Only the longest sentence"], 0, "The whole text main idea comes from all the paragraphs together.")),
        _step("6", "Writing a summary", "A summary is short and in your own words. Start with the main idea. Add only the key details. Do not copy whole sentences.\n\nTwo or three sentences is usually enough.", "Echidnas are unusual Australian mammals with spines. They lay eggs, eat ants and termites with a sticky tongue, and dig or curl up to stay safe.", "Main idea, key details, own words.", ("What does a good summary include?", ["The main idea and key details in your own words", "Every sentence of the text", "Only the first word"], 0, "A summary keeps the main idea and key details in your own words.")),
        _step("7", "Spelling focus: -sion and -ssion", "Words ending in -sion often say zhun, as in decision, vision and division. Words ending in -ssion say shun, as in session, discussion and permission.\n\nSay the word slowly, listen to the ending, then write it.", "We had a discussion and made a decision. I asked for permission.", "Zhun is -sion. Shun after double s is -ssion.", ("Which is spelled correctly?", ["descision", "decision", "decishun"], 1, "Decision is spelled with -sion.")),
    ],
    (
        "Read the Echidnas text on the screen. Let's find the main idea and key details of each paragraph. Paragraph 1: the first sentence says echidnas are unusual Australian mammals. That is the topic sentence and the main idea. The key details are the sharp spines and the long snout. Paragraph 2: the main idea is that echidnas lay eggs. The key details are that they are monotremes, the female lays one egg, she keeps it in a pouch, and the baby is called a puggle. An extra detail is that it hatches after about ten days, which I can leave out of a short summary. Paragraph 3: the main idea is what echidnas eat. The key details are ants and termites, no teeth and a sticky tongue. Paragraph 4: the topic sentence says echidnas protect themselves from danger. The key details are digging into the soil and curling into a ball. Now the main idea of the whole text: echidnas are unusual animals with spines that lay eggs, eat insects and stay safe in clever ways. Here is my summary in my own words. Echidnas are unusual Australian mammals with spines. They lay eggs and eat ants and termites. When in danger, they dig down or curl into a ball. Notice that I did not copy any sentence, and I left out the extra details.\n\n" + ECHIDNAS
    ),
    (
        "Type your answers in the practice boxes. Part A: say what a main idea is and what a key detail is. Part B: for Paragraph 3 of Echidnas, type the main idea and two key details. Part C: type the correct word for each blank: We had a class ___ about the book. It was a hard ___ to make. Please give me ___ to go. Your parent can check your answers against the answer key."
    ),
    (
        "Use the Echidnas text to do the tasks. Typed answers go in the boxes.\n\n" + ECHIDNAS + "\n\n"
        "Stage 1 (main idea): type the main idea of each paragraph in a few words.\n"
        "Stage 2 (key details): for Paragraphs 1 and 2, type two key details each.\n"
        "Stage 3 (topic sentence): type the topic sentence of Paragraph 4, which is the sentence that tells its main idea.\n"
        "Stage 4 (extra detail): type one extra detail from the text that you could leave out of a short summary, and explain why.\n"
        "Stage 5 (whole text): type the main idea of the whole text in one sentence.\n"
        "Stage 6 (summary): type a summary of two or three sentences in your own words. Do not copy whole sentences.\n"
        "Stage 7 (your own text): choose a paragraph from an information book or website. Type its title or source, its main idea and two key details.\n"
        "Stage 8 (spell): type your six spelling words and one sentence for each of decision, discussion and permission.\n\n"
        "Parent: check that the main ideas are about the whole paragraph and not just one fact, that key details support the main idea, that the summary is in the child's own words and leaves out extra details, and that the child's own text has a main idea and two details. Accept any sensible choices for extra details and for the child's own text."
    ),
    "Which was harder for you: finding the main idea, or choosing key details, and what will you do next time?",
    "Did I find the main idea of each paragraph, pick key details that support it, leave out extra details, write a summary in my own words, and spell decision, vision, division, session, discussion and permission correctly?",
    [
        _q("What is the main idea of a paragraph?", ["What it is mostly about", "Its longest word", "Its first letter", "Its last sentence only"], 0, "The main idea is what the paragraph is mostly about."),
        _q("What are key details?", ["Facts that support the main idea", "Words in bold only", "Page numbers", "The title"], 0, "Key details support and explain the main idea."),
        _q("What is a topic sentence?", ["A sentence that tells the main idea", "A question at the end", "A sentence with a number", "A caption"], 0, "A topic sentence tells the main idea of the paragraph."),
        _q("What is the main idea of Paragraph 3 of Echidnas?", ["What echidnas eat", "How echidnas hatch", "How echidnas look", "Where echidnas sleep"], 0, "Paragraph 3 is about what echidnas eat."),
        _q("Which is a key detail in Paragraph 3?", ["Echidnas eat ants and termites", "Echidnas have spines", "Echidnas are mammals that lay eggs", "Echidnas curl into a ball"], 0, "Eating ants and termites supports the main idea of Paragraph 3."),
        _q("What should you do with extra details in a short summary?", ["Leave them out", "Put them first", "Make them the main idea", "Copy them all"], 0, "Extra details can be left out of a summary."),
        _q("How should you write a summary?", ["In your own words", "By copying the text", "By listing every fact", "In one word"], 0, "A summary is in your own words."),
        _q("The main idea of a whole text comes from what?", ["All the paragraphs together", "Only the first word", "Only the last paragraph", "The page number"], 0, "The whole text main idea comes from all the paragraphs together."),
        _q("Which is spelled correctly?", ["vishun", "vission", "vizion", "vision"], 3, "Vision is spelled with -sion."),
        _q("Which is spelled correctly?", ["discusion", "discussion", "discushun", "discution"], 1, "Discussion is spelled with -ssion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: choose a short information article. Write its main idea in one sentence and list three key details. Then write a two-sentence summary and ask a family member whether it tells them what the article was about.",
    [("main idea", "What a paragraph or text is mostly about"), ("key detail", "A fact that supports the main idea"), ("topic sentence", "A sentence that tells the main idea of a paragraph"), ("paragraph", "A group of sentences about one idea"), ("summary", "A short retelling of the most important ideas"), ("supporting detail", "A fact that backs up the main idea"), ("monotreme", "A mammal that lays eggs"), ("in your own words", "Said or written without copying the exact words of the text")],
    [],
    _sort("Key detail or extra detail?", "Sort each fact into key detail or extra detail, if the main idea of Paragraph 2 is that echidnas lay eggs.", ["Key detail", "Extra detail"], [("Echidnas are monotremes", 0), ("The female lays one egg", 0), ("She keeps the egg in a pouch", 0), ("The baby is called a puggle", 0), ("The egg hatches after about ten days", 1), ("Echidnas are covered in sharp spines", 1), ("Echidnas eat ants and termites", 1), ("Echidnas can curl into a spiky ball", 1)]),
    [
        _wc("Which is what a paragraph is mostly about?", ["main idea", "summary", "index"], 0, "The main idea is what a paragraph is mostly about."),
        _wc("Which is a short retelling in your own words?", ["caption", "summary", "glossary"], 1, "A summary is a short retelling."),
        _wc("Which sentence tells the main idea of a paragraph?", ["index", "caption", "topic sentence"], 2, "The topic sentence tells the main idea."),
        _wc("Which is a fact that supports the main idea?", ["key detail", "title", "page number"], 0, "A key detail supports the main idea."),
        _wc("Which is spelled correctly?", ["decishun", "decision", "descision"], 1, "Decision is spelled with -sion."),
        _wc("Which is spelled correctly?", ["divishun", "divission", "division"], 2, "Division is spelled with -sion."),
        _wc("Which is spelled correctly?", ["session", "sesion", "seshun"], 0, "Session is spelled with -ssion."),
        _wc("Which is spelled correctly?", ["permision", "permishun", "permission"], 2, "Permission is spelled with -ssion."),
    ],
    [
        {"key": "partA", "label": "Part A: main idea and key detail", "hint": "What is a main idea, and what is a key detail?"},
        {"key": "partB", "label": "Part B: Paragraph 3", "hint": "The main idea and two key details."},
        {"key": "partC", "label": "Part C: -sion and -ssion words", "hint": "discussion, decision, permission."},
        {"key": "stage1", "label": "Main idea of each paragraph", "hint": "A few words for each of the four paragraphs."},
        {"key": "stage2", "label": "Key details", "hint": "Two key details each for Paragraphs 1 and 2."},
        {"key": "stage3", "label": "Topic sentence", "hint": "The topic sentence of Paragraph 4."},
        {"key": "stage4", "label": "Extra detail", "hint": "One extra detail to leave out, and why."},
        {"key": "stage5", "label": "Whole text main idea", "hint": "One sentence."},
        {"key": "stage6", "label": "My summary", "hint": "Two or three sentences in your own words."},
        {"key": "stage7", "label": "My own text", "hint": "Title or source, main idea and two key details."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for decision, discussion and permission."},
    ],
    ["Choosing one small fact as the main idea", "Listing every detail instead of choosing key details", "Copying sentences from the text into a summary", "Leaving the main idea out of a summary", "Spelling session, discussion or permission with only one s"],
    ["Read an information paragraph aloud to a family member and tell them its main idea.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: the main idea is what a paragraph or text is mostly about; a key detail is a fact that supports the main idea. Part B: the main idea is what echidnas eat; key details include they eat ants and termites, they have no teeth and they catch insects with a long sticky tongue (accept any two). Part C: discussion, decision, permission in that order. Main task Stage 1: Paragraph 1, how echidnas look or that they are unusual mammals; Paragraph 2, echidnas lay eggs; Paragraph 3, what echidnas eat; Paragraph 4, how echidnas protect themselves. Stage 2: Paragraph 1, sharp spines and a long snout (accept the text's details); Paragraph 2, any two of monotremes, one egg, kept in a pouch, baby called a puggle. Stage 3: Echidnas protect themselves from danger. Stage 4: accept the time to hatch, about ten days, or another detail with a sensible reason such as a summary only needs the most important facts. Stage 5: accept a sentence such as echidnas are unusual animals that lay eggs, eat insects and protect themselves in clever ways. Stage 6: accept two or three sentences in the child's own words with the main idea and key details and without extra details. Stage 7: accept any sensible information paragraph with a main idea and two key details. Quiz answers: what it is mostly about; facts that support the main idea; a sentence that tells the main idea; what echidnas eat; echidnas eat ants and termites; leave them out; in your own words; all the paragraphs together; vision; discussion.",
)

LESSON["spelling"] = {
    "focus": "-sion and -ssion (the zhun and shun sounds)",
    "teaching": "The ending -sion often says zhun, as in decision, vision and division. The ending -ssion says shun, as in session, discussion and permission. Say the word slowly, listen to the ending, then write it.",
    "words": [
        _w("decision", "de-ci-sion", "a choice you make, ends in zhun"),
        _w("vision", "vi-sion", "the ability to see, ends in zhun"),
        _w("division", "di-vi-sion", "splitting into parts, ends in zhun"),
        _w("session", "ses-sion", "a period of time for an activity, double s"),
        _w("discussion", "dis-cus-sion", "a talk about a topic, double s"),
        _w("permission", "per-mis-sion", "being allowed, double s"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["decision", "decishun", "descision"], 0, "Decision is spelled with -sion."),
        _c("Which is spelled correctly?", ["permision", "permishun", "permission"], 2, "Permission is spelled with -ssion."),
    ],
}
LESSON["spelling_focus"] = "-sion and -ssion (the zhun and shun sounds)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
