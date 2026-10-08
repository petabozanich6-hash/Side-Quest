"""Stage 2 English, Week 6 Lesson 2: Planning an Information Report (Writing).
The child learns how to choose a topic, break it into subtopics, write notes in their own words and lay out a plan with an introduction, subtopic paragraphs and a conclusion, using a model plan about koalas.
Spelling: the -tion ending: question, introduction, location, population, attention, description.
Video status: How To Plan Your Writing (The Touring Teacher, part two of an information report series) was checked against its transcript. It runs about two and a half minutes and covers the planning template: introduction, subtopics, conclusion.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["question", "introduction", "location", "population", "attention", "description"]

KOALA_PLAN = (
    "MODEL PLAN: KOALAS\n\n"
    "Title: Koalas: Sleepy Tree Climbers\n\n"
    "Introduction\n"
    "Hook (a question): Did you know a koala can sleep for most of the day?\n"
    "Extra detail: Koalas are marsupials that live in Australia.\n"
    "Subtopics to come: where koalas live, what koalas eat, how koalas stay safe.\n\n"
    "Subtopic 1: Where koalas live\n"
    "Subheading: Where koalas live\n"
    "Notes: eucalypt forests; eastern and south eastern Australia; spend most of their time in trees.\n"
    "Link to next: But a koala needs more than a tree. It needs food.\n\n"
    "Subtopic 2: What koalas eat\n"
    "Subheading: What koalas eat\n"
    "Notes: eucalyptus leaves; leaves have little energy; sleep a lot to save energy.\n"
    "Link to next: Even a koala with a full belly must stay safe.\n\n"
    "Subtopic 3: How koalas stay safe\n"
    "Subheading: How koalas stay safe\n"
    "Notes: danger from lost forest and from cars and dogs; people can plant trees and slow down in koala areas.\n\n"
    "Conclusion\n"
    "Summary: koalas live in gum trees, eat leaves and need our help.\n"
    "Closing question: What could your family do to help koalas?"
)

LESSON = build(
    "s2-eng-w06-l2-planning-an-information-report",
    "Planning an Information Report",
    "Great reports start with a great plan. Learn how to choose a topic, split it into subtopics, make short notes and lay out a plan, then plan your own report.",
    "Writing: planning an information report",
    ["EN2-CWT-01", "EN2-SPELL-01"],
    {
        "EN2-CWT-01": "Primary. Plans, composes, revises and edits written texts, selecting text forms to suit purpose and audience. In this lesson the child plans an information report by choosing subtopics, making notes and organising an introduction, body and conclusion.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including words ending in -tion (week 6 spelling focus).",
    },
    "We are learning to plan an information report by choosing subtopics, making short notes in our own words, and organising an introduction, subtopic paragraphs and a conclusion, and to spell words that end in -tion.",
    [
        "I can explain what an information report is for.",
        "I can break a topic into three or four subtopics.",
        "I can write short notes using key words, not full sentences.",
        "I can plan an introduction with a hook and a list of subtopics.",
        "I can plan a conclusion that sums up the report.",
        "I can spell and use question, introduction, location, population, attention and description.",
    ],
    ["information report", "topic", "subtopic", "subheading", "introduction", "conclusion", "notes", "plan"],
    ["This lesson (everything you need is inside it)", "Optional: one information book or a safe website about the child's chosen topic"],
    "Child has used headings, the contents page, the glossary and the index in Lesson 1, and can write a simple sentence.",
    (
        "Why this matters. An information report tells readers true facts about one topic, such as an animal, a place or a sport. A good report is easy to follow because the writer planned it first. A plan is like a map. It stops the writer from getting lost, repeating facts or leaving out something important.\n\n"
        "The three parts. Every information report has an introduction, a body and a conclusion. The introduction tells the reader what the report is about and what is coming. The body is made of paragraphs, and each paragraph covers one subtopic. The conclusion sums up the main ideas.\n\n"
        "Topic and subtopics. The topic is what the whole report is about, such as koalas. A subtopic is one smaller part of the topic, such as where koalas live or what koalas eat. Each subtopic gets its own paragraph and its own subheading. Three or four subtopics is a good number for a first report.\n\n"
        "Where the facts come from. A report must be true, so the writer finds facts in books and safe websites. Then the writer writes notes. Notes are short key words and phrases, not full sentences. Notes are written in your own words so the report is not copied.\n\n"
        "The routine. First choose a topic you can find facts about. Second, split it into three or four subtopics. Third, find two or three facts for each subtopic and write them as notes. Fourth, plan an introduction with a hook and a list of subtopics. Fifth, plan a conclusion. Sixth, check that every subtopic has notes.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -tion, which sounds like shun. Report words such as question, introduction, location, population, attention and description all end this way.\n\n"
        "A quick demonstration. Say the topic is dogs. Subtopics might be what dogs look like, what dogs eat and how dogs help people. Under what dogs eat, the notes might be meat, dog food, water. Those are notes, not sentences. The sentences come later, when we write the draft."
    ),
    [
        _step("1", "What an information report is", "An information report gives true facts about one topic. It is written to teach the reader, not to tell a story or give an opinion.\n\nIt uses present tense, such as koalas sleep, and gives facts rather than feelings.", "A report about koalas tells where they live and what they eat. It does not say that koalas are the best animal.", "A report teaches true facts.", ("What is an information report for?", ["To tell a made up story", "To teach the reader true facts about a topic", "To say which thing you like best"], 1, "An information report gives true facts about one topic.")),
        _step("2", "Choosing a topic and subtopics", "Pick a topic you can find facts about and that is not too big. Koalas is better than animals, because animals is too big for one report.\n\nThen split the topic into three or four subtopics. Each one becomes a paragraph with a subheading.", "Topic: koalas. Subtopics: where koalas live, what koalas eat, how koalas stay safe.", "Split a topic into parts.", ("Which is a subtopic of the topic koalas?", ["Sharks", "What koalas eat", "My birthday"], 1, "What koalas eat is one part of the topic koalas.")),
        _step("3", "Making notes", "Notes are short. Write key words and phrases, not full sentences. Leave out words like the, a and is.\n\nWrite notes in your own words. This keeps the report from being copied.", "The sentence Koalas eat the leaves of eucalyptus trees becomes the notes: eucalyptus leaves.", "Notes are short key words.", ("Which is a good note?", ["Koalas eat the leaves of eucalyptus trees all day long", "eucalyptus leaves", "I think koalas are cute"], 1, "A good note is short and made of key words.")),
        _step("4", "Planning the introduction", "The introduction has three jobs. It grabs attention with a hook, such as a question or a surprising fact. It adds one extra detail. It lists the subtopics so the reader knows what is coming.\n\nThe introduction is short, just a few sentences once written.", "Hook: Did you know a koala can sleep for most of the day? Detail: koalas are marsupials. Subtopics: where koalas live, what koalas eat, how koalas stay safe.", "Hook, detail, list of subtopics.", ("What does the hook in an introduction do?", ["Lists all the facts", "Ends the report", "Grabs the reader's attention"], 2, "A hook grabs the reader's attention.")),
        _step("5", "Planning a subtopic paragraph", "Each subtopic paragraph has a subheading, two or three facts as notes, and a link to the next subtopic.\n\nThe link is a clue about what comes next, and it helps the report flow.", "Subheading: What koalas eat. Notes: eucalyptus leaves; little energy; sleep a lot. Link: Even a koala with a full belly must stay safe.", "One subtopic, one paragraph.", ("How many subtopics belong in one paragraph?", ["One", "Five", "As many as possible"], 0, "Each paragraph covers one subtopic.")),
        _step("6", "Planning the conclusion", "The conclusion is short. It sums up the main ideas and ends with a thought or a question for the reader.\n\nIt does not add brand new facts.", "Summary: koalas live in gum trees, eat leaves and need our help. Closing question: What could your family do to help koalas?", "Sum up, then leave a thought.", ("What should a conclusion do?", ["Add brand new facts", "Sum up the main ideas", "Repeat the introduction word for word"], 1, "A conclusion sums up the main ideas.")),
        _step("7", "Spelling focus: -tion", "The ending -tion sounds like shun. Many report words end this way: question, introduction, location, population, attention and description.\n\nSay the word slowly, listen for shun at the end, then write -tion.", "The introduction asks a question about the location and population of koalas and then gives a description.", "Shun at the end is usually -tion.", ("Which is spelled correctly?", ["questshun", "quesion", "question"], 2, "Question ends in -tion.")),
    ],
    (
        "Let's plan a report about koalas using the model plan on the screen. Step one: choose the topic. Koalas is small enough to find facts about. Step two: split it into subtopics. Where koalas live, what koalas eat and how koalas stay safe. Step three: write notes. Under what koalas eat, I write eucalyptus leaves, little energy and sleep a lot. These are key words, not sentences. Step four: plan the introduction. My hook is a question: Did you know a koala can sleep for most of the day? Then one extra detail, then a list of my three subtopics. Step five: add a link at the end of each subtopic, such as Even a koala with a full belly must stay safe. Step six: plan the conclusion with a summary and a closing question. "
        "Notice that I did not write full paragraphs. A plan is short. The sentences come later, when I write the draft.\n\n" + KOALA_PLAN
    ),
    (
        "Type your answers in the practice boxes. Part A: write the three parts of an information report in order. Part B: for the topic dogs, type three subtopics. Part C: turn each sentence into short notes. Koalas live in the forests of eastern Australia. Koalas eat the leaves of eucalyptus trees. Part D: type the correct -tion word for each blank. Choose from question, introduction, location, population, attention and description. The ___ of a report tells the reader what is coming. A good hook grabs the reader's ___. Always ask a ___ before you start research. Your parent can check your answers against the answer key."
    ),
    (
        "Plan your own information report. Typed answers go in the boxes. Use the koala plan as a model.\n\n" + KOALA_PLAN + "\n\n"
        "Stage 1 (choose a topic): type a topic that you can find facts about, such as an animal, a sport or a place. Type why you chose it.\n"
        "Stage 2 (subtopics): type three or four subtopics for your topic.\n"
        "Stage 3 (research): use a book or a safe website, with a parent, to find two or three facts for each subtopic. Type them as short notes in your own words.\n"
        "Stage 4 (introduction plan): type a hook, one extra detail and your list of subtopics.\n"
        "Stage 5 (subheadings and links): type a subheading for each subtopic and a link to the next one.\n"
        "Stage 6 (conclusion plan): type a one sentence summary and a closing question.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of question, introduction and description.\n\n"
        "Parent: check that the topic is not too big, that there are three or four subtopics, that notes are short and in the child's own words, that the hook is a question or a surprising fact, and that the conclusion sums up without adding new facts. Accept any sensible topic."
    ),
    "Why is it a good idea to plan a report before you write it?",
    "Did I choose a topic that is not too big, split it into three or four subtopics, write short notes in my own words, plan an introduction and a conclusion, and spell question, introduction, location, population, attention and description correctly?",
    [
        _q("What is an information report for?", ["Telling a story", "Teaching true facts about a topic", "Sharing opinions", "Writing a poem"], 1, "An information report teaches true facts about a topic."),
        _q("Which part of a report lists what is coming?", ["The introduction", "The glossary", "The conclusion", "The index"], 0, "The introduction tells what the report is about and lists the subtopics."),
        _q("What is a subtopic?", ["The title", "The last sentence", "A picture", "One smaller part of the topic"], 3, "A subtopic is one smaller part of the topic."),
        _q("Which topic is small enough for one report?", ["Animals", "Koalas", "Everything in the world", "Nature"], 1, "Koalas is small enough. Animals is too big."),
        _q("What are notes?", ["Full paragraphs", "Long stories", "Short key words and phrases", "Copied sentences"], 2, "Notes are short key words and phrases."),
        _q("Which is a good hook?", ["Did you know a koala can sleep for most of the day?", "The end.", "Koalas.", "I am going to write a report."], 0, "A question or surprising fact grabs attention."),
        _q("What does a conclusion do?", ["Adds new facts", "Starts the report", "Lists the page numbers", "Sums up the main ideas"], 3, "A conclusion sums up the main ideas."),
        _q("How many subtopics does one paragraph cover?", ["None", "One", "Four", "Ten"], 1, "One paragraph covers one subtopic."),
        _q("Which is spelled correctly?", ["introducshun", "introduction", "intradution", "introducsion"], 1, "Introduction ends in -tion."),
        _q("Which is spelled correctly?", ["locashun", "locasion", "location", "lokation"], 2, "Location ends in -tion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: swap plans with a family member. Read their plan and tell them one thing that is clear and one question you still have. Then improve your own plan using what you learned.",
    [("information report", "A text that gives true facts about one topic"), ("topic", "What the whole report is about"), ("subtopic", "One smaller part of a topic that gets its own paragraph"), ("subheading", "A small heading above a subtopic paragraph"), ("introduction", "The opening that tells the reader what the report is about"), ("conclusion", "The ending that sums up the main ideas"), ("notes", "Short key words and phrases that record facts"), ("plan", "A short outline made before writing")],
    [
        _video(
            "How To Plan Your Writing (The Touring Teacher)", "d43SiA0bp04",
            "Watch how a planning template for an information report is split into three parts: the introduction, the subtopics and the conclusion. Listen for what goes in each part, including the hook, the subheading and the link to the next subtopic. This is about two and a half minutes. Status: transcript checked.",
            "If the video will not play, reread Steps 4 to 6 and use the koala plan.",
            ("What three parts does the planning template have?", ["The introduction, the subtopics and the conclusion", "The title, the index and the glossary", "The hook, the story and the ending"], 0, "The video says the template has an introduction, subtopics and a conclusion."),
        ),
    ],
    _sort("Which part of the plan?", "Sort each item into the part of the report plan where it belongs.", ["Introduction", "Subtopic", "Conclusion"], [("A hook question", 0), ("A subheading and notes", 1), ("A summary of the main ideas", 2), ("A list of what is coming", 0), ("A link to the next subtopic", 1), ("A closing question for the reader", 2), ("Two or three facts as notes", 1), ("An extra detail about the topic", 0)]),
    [
        _wc("Which part tells the reader what is coming?", ["introduction", "conclusion", "index"], 0, "The introduction lists what is coming."),
        _wc("Which is one smaller part of a topic?", ["title", "subtopic", "glossary"], 1, "A subtopic is one smaller part of a topic."),
        _wc("Which are short key words that record facts?", ["paragraphs", "stories", "notes"], 2, "Notes are short key words."),
        _wc("Which part sums up the main ideas?", ["conclusion", "hook", "heading"], 0, "The conclusion sums up the main ideas."),
        _wc("Which is spelled correctly?", ["questshun", "question", "quesion"], 1, "Question ends in -tion."),
        _wc("Which is spelled correctly?", ["populashun", "populasion", "population"], 2, "Population ends in -tion."),
        _wc("Which is spelled correctly?", ["attention", "attenshun", "atension"], 0, "Attention ends in -tion."),
        _wc("Which is spelled correctly?", ["discription", "description", "descripshun"], 1, "Description has de at the start and ends in -tion."),
    ],
    [
        {"key": "partA", "label": "Part A: three parts", "hint": "The three parts of an information report, in order."},
        {"key": "partB", "label": "Part B: subtopics for dogs", "hint": "Three subtopics for the topic dogs."},
        {"key": "partC", "label": "Part C: make notes", "hint": "Short notes for each sentence about koalas."},
        {"key": "partD", "label": "Part D: -tion words", "hint": "Fill the three blanks. Choose from question, introduction, location, population, attention and description."},
        {"key": "stage1", "label": "My topic", "hint": "A topic you can find facts about, and why you chose it."},
        {"key": "stage2", "label": "My subtopics", "hint": "Three or four subtopics."},
        {"key": "stage3", "label": "My notes", "hint": "Two or three short notes for each subtopic, in your own words."},
        {"key": "stage4", "label": "Introduction plan", "hint": "A hook, one extra detail and your list of subtopics."},
        {"key": "stage5", "label": "Subheadings and links", "hint": "A subheading for each subtopic and a link to the next one."},
        {"key": "stage6", "label": "Conclusion plan", "hint": "A one sentence summary and a closing question."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence for each of question, introduction and description."},
    ],
    ["Choosing a topic that is too big, such as animals", "Writing full sentences instead of short notes", "Copying facts word for word from a book", "Putting two subtopics in one paragraph", "Adding new facts in the conclusion"],
    ["Find an information book at home and name its topic and three of its subtopics.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: introduction, body (subtopic paragraphs), conclusion. Part B: accept any three sensible subtopics, such as what dogs look like, what dogs eat, how dogs help people. Part C: accept short key word notes, such as live; forests; eastern Australia and eat; eucalyptus leaves. Notes must not be full sentences. Part D: introduction, attention, question. Main task: accept any sensible topic that is not too big; three or four subtopics; two or three short notes per subtopic in the child's own words; a hook that is a question or surprising fact, one extra detail and a list of subtopics; a subheading and a link for each subtopic; a one sentence summary and a closing question that adds no new facts. Quiz answers: teaching true facts about a topic; the introduction; one smaller part of the topic; koalas; short key words and phrases; Did you know a koala can sleep for most of the day?; sums up the main ideas; one; introduction; location.",
)

LESSON["spelling"] = {
    "focus": "The -tion ending (the shun sound)",
    "teaching": "The sound shun at the end of a word is most often spelled -tion. Report words such as question, introduction and location all end this way. Say the word slowly, listen for shun, then write -tion.",
    "words": [
        _w("question", "ques-tion", "the tion here sounds like chun, but still ends in -tion"),
        _w("introduction", "in-tro-duc-tion", "from introduce, the c stays and -tion is added"),
        _w("location", "lo-ca-tion", "a place, from locate"),
        _w("population", "pop-u-la-tion", "how many people or animals live somewhere"),
        _w("attention", "at-ten-tion", "double t at the start, then ten, then tion"),
        _w("description", "de-scrip-tion", "begins with de, not di"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["location", "locashun", "locasion"], 0, "Location ends in -tion."),
        _c("Which is spelled correctly?", ["discription", "descripshun", "description"], 2, "Description begins with de and ends in -tion."),
    ],
}
LESSON["spelling_focus"] = "The -tion ending (the shun sound)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
