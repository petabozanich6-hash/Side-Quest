"""Stage 2 English, Week 7 Lesson 4: Finding Reliable Sources (Oral language).
The child learns what makes a source reliable (who made it, when, why, and whether other sources agree), practises checking sources for a topic, and explains aloud what they found and why they trust it.
Spelling: -sion and -ssion: decision, collision, session, discussion, permission, admission.
Outcomes: EN2-OLC-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 7, Lesson 4, Finding reliable sources, oral language slot, spelling -sion and -ssion). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Video status: no video is attached to this lesson, because none has been found and checked.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["decision", "collision", "session", "discussion", "permission", "admission"]

SCRIPT = (
    "MODEL TALK\n\n"
    "My topic is koalas. I found out that koalas sleep for most of the day. I read this in a book written by a wildlife scientist, and I found the same fact on a national parks website. "
    "I trust these sources because the writers know a lot about koalas, the information is recent, and the two sources agree. "
    "My next step is to look for one more source about what koalas eat."
)

LESSON = build(
    "s2-eng-w07-l4-reliable-sources",
    "Finding Reliable Sources",
    "Learn how to tell whether a book, website or person can be trusted for facts, and practise explaining aloud where you found information and why you trust it.",
    "Oral language: reliable sources",
    ["EN2-OLC-01", "EN2-SPELL-01"],
    {
        "EN2-OLC-01": "Communicates with familiar audiences for social and learning purposes, by interacting, understanding and presenting. This lesson focuses on explaining aloud where information came from and why it can be trusted.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is words ending in -sion and -ssion.",
    },
    "We are learning how to find and check reliable sources, to explain aloud where our information came from, and to spell words that end in -sion and -ssion.",
    [
        "I can explain what a source is and what reliable means.",
        "I can name places where reliable information is found.",
        "I can check who made a source, when, and why.",
        "I can compare two sources to see if they agree.",
        "I can tell a listener where I found information and why I trust it.",
        "I can spell and use decision, collision, session, discussion, permission and admission.",
    ],
    ["source", "reliable", "author", "expert", "fact", "opinion", "check", "evidence"],
    ["This lesson (everything you need is inside it)", "A family member or friend to listen to your talk"],
    "Child has found main ideas and key details (Week 7 Lesson 1) and has written a classification paragraph (Week 7 Lesson 2).",
    (
        "Why this matters. When we research a topic, we read, watch and listen to many things. Not all of them are correct. A source is a place information comes from, such as a book, a website, a video or a person. A reliable source is one we can trust to be correct.\n\n"
        "Where reliable information is found. Good places include books from a library, encyclopedias, museum and national park websites, and experts, such as a scientist or a vet. Websites ending in .gov.au or .edu.au are often run by the government or by educational groups.\n\n"
        "Check who made it. Ask who wrote it. An author who is an expert and knows a lot about the topic is more likely to be correct. An advertisement, or a comment from a stranger, may be trying to sell something or to share only an opinion.\n\n"
        "Check when it was made. Facts can change, so old information may be out of date. Look for a date, and choose a recent source when the topic changes quickly.\n\n"
        "Check why it was made. Was it made to inform, to entertain, or to sell? Facts can be proved. An opinion is what someone thinks or feels. A reliable source gives facts and evidence.\n\n"
        "Check more than one source. If two or more good sources agree, we can trust the fact more. If they disagree, look for another source.\n\n"
        "Tell it aloud. Researchers explain where they found information and why they trust it. You can say, I found out that, I read it in, and I trust it because. This is the talking part of today's lesson.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -sion and -ssion. The -sion ending often says zhun, as in decision and collision. The -ssion ending says shun, as in session, discussion, permission and admission."
    ),
    [
        _step("1", "What is a source?", "A source is a place information comes from. It could be a book, a website, a video, or a person who knows about the topic.\n\nA reliable source is one we can trust to be correct.", "A library book about koalas is a source. So is a ranger at a national park.", "A source is where information comes from.", ("What is a source?", ["A place information comes from", "A kind of pencil", "The last page of a book"], 0, "A source is a place information comes from.")),
        _step("2", "Who made it?", "Check who wrote or made the source. An expert, such as a scientist or a museum, is more likely to be correct than a stranger or an advertisement.\n\nLook for the author's name.", "A book by a wildlife scientist is more reliable than a rumour from a friend.", "Ask who made it.", ("Which is the most reliable source for facts about koalas?", ["A book by a wildlife scientist", "A rumour from a friend", "An advertisement for a toy"], 0, "An expert's book is the most reliable.")),
        _step("3", "When was it made?", "Facts can change over time. Look for a date, and choose a recent source if the topic changes quickly.\n\nOld information may be out of date.", "A book about technology from many years ago may not show new inventions.", "Ask when it was made.", ("Why does the date matter?", ["Old information may be out of date", "Dates make a page look nice", "New sources are always wrong"], 0, "Facts can change, so old information may be out of date.")),
        _step("4", "Why was it made?", "Some sources inform, some entertain and some sell. A source that is trying to sell something may leave out important facts.\n\nFacts can be proved. An opinion is what someone thinks or feels.", "A toy advertisement says this is the best toy ever. That is an opinion, not a fact.", "Ask why it was made.", ("What is an opinion?", ["What someone thinks or feels", "Something that is proved", "A date"], 0, "An opinion is what someone thinks or feels.")),
        _step("5", "Check more than one", "Look at two or more sources. If good sources agree, we can trust the fact more. If they disagree, find another source.\n\nOne source on its own can be wrong.", "A book and a national parks website both say koalas sleep for most of the day, so we can trust that fact.", "Compare sources.", ("Why check more than one source?", ["To see whether they agree", "To use more paper", "To make the work longer"], 0, "We check more than one source to see whether they agree.")),
        _step("6", "Telling it aloud", "When you present what you found, say where it came from and why you trust it. Speak clearly and look at your listener.\n\nUse sentences like: I found out that, I read it in, and I trust it because.", "I found out that koalas sleep for most of the day. I read it in a book by a scientist, and I trust it because the writer is an expert.", "Say where and why.", ("What should you say when you present a fact?", ["Where it came from and why you trust it", "Nothing at all", "Only a joke"], 0, "Say where the fact came from and why you trust it.")),
        _step("7", "Spelling focus: -sion and -ssion", "Words ending in -sion often say zhun, as in decision and collision. Words ending in -ssion say shun, as in session, discussion, permission and admission.\n\nSay the word slowly, listen to the ending, then write it.", "We had a discussion about sources. I made a decision.", "Zhun is -sion. Shun after double s is -ssion.", ("Which is spelled correctly?", ["decision", "decishun", "decission"], 0, "Decision is spelled with -sion.")),
    ],
    (
        "Let's see how I check a source and then explain it aloud. My topic is koalas. I find a library book written by a wildlife scientist. Who made it? A scientist who studies koalas, so the author is an expert. When was it made? It was printed recently, so the facts are not out of date. Why was it made? To inform readers, so it gives facts and evidence. Next, I look at a second source, a national parks website, and it says the same thing: koalas sleep for most of the day. Two good sources agree, so I trust this fact. Now I check a third source, a comment from a stranger that says koalas are the laziest animals ever. That is an opinion, and the stranger is not an expert, so I do not use it for facts. Now I practise saying it aloud, looking at my listener. Here is my talk. \n\n" + SCRIPT
    ),
    (
        "Type your answers in the practice boxes. Part A: type two places where you could find reliable information about a topic. Part B: type one question you can ask to check whether a source is reliable. Part C: type the correct word for each blank: We made a ___ about which book to read. The class had a ___ about sources. I asked for ___ to use the library computer. Your parent can check your answers against the answer key."
    ),
    (
        "Choose a topic and check two sources, then explain aloud. Typed answers go in the boxes. Use the model talk below to help you.\n\n" + SCRIPT + "\n\n"
        "Stage 1 (topic): type a topic you would like to find out about, such as an animal, a sport or a place.\n"
        "Stage 2 (find): type the names of two sources you could use, and say what kind each one is, such as a book or a website.\n"
        "Stage 3 (who): for each source, type who made it and whether they are an expert.\n"
        "Stage 4 (when and why): for each source, type when it was made and why it was made.\n"
        "Stage 5 (agree): type one fact found in both sources, or one place where they disagree.\n"
        "Stage 6 (talk): say your talk aloud to a listener using I found out that, I read it in, and I trust it because. Type one sentence you said.\n"
        "Stage 7 (reflect): ask your listener what was clear. Type one thing they said.\n"
        "Stage 8 (spell): type your six spelling words and one sentence for each of decision, discussion and permission.\n\n"
        "Parent: listen to the talk and check that the child says where the fact came from and why it is trusted, speaks clearly, and looks at the listener. Check that the sources named are sensible, that the child considers who, when and why, and that a fact is not confused with an opinion. Accept any sensible topic and sources."
    ),
    "Which was harder for you: checking if a source was reliable, or explaining it aloud, and what will you do next time?",
    "Did I name a source, check who made it and when and why, compare two sources, say aloud where I found the fact and why I trust it, and spell decision, collision, session, discussion, permission and admission correctly?",
    [
        _q("What does reliable mean?", ["Can be trusted to be correct", "Very long", "Brightly coloured", "Funny"], 0, "A reliable source can be trusted to be correct."),
        _q("Which is the most reliable source for facts about koalas?", ["A book by a wildlife scientist", "A rumour from a friend", "A joke on a poster", "An advertisement for a toy"], 0, "A book by an expert is the most reliable."),
        _q("What should you check about an author?", ["Whether they know a lot about the topic", "What colour their hair is", "What their favourite food is", "How tall they are"], 0, "An author who knows the topic is more likely to be correct."),
        _q("Why should you check more than one source?", ["To see whether they agree", "To make your work longer", "To use more paper", "To copy every word"], 0, "Checking more than one source shows whether they agree."),
        _q("Why does the date of a source matter?", ["Old information may be out of date", "Dates make a page pretty", "New sources are always wrong", "It does not matter"], 0, "Facts can change, so old information may be out of date."),
        _q("What is an opinion?", ["What someone thinks or feels", "A fact that is proved", "A date", "A photograph"], 0, "An opinion is what someone thinks or feels."),
        _q("Which website ending often shows an Australian government site?", [".gov.au", ".xyz", ".fun", ".shop"], 0, "Websites ending in .gov.au are often run by the government."),
        _q("What should you say when you tell a listener a fact?", ["Where you found it and why you trust it", "Nothing about where it came from", "Only a joke", "The longest word you know"], 0, "Say where the fact came from and why you trust it."),
        _q("Which is spelled correctly?", ["decishun", "decission", "decision", "desizion"], 2, "Decision is spelled with -sion."),
        _q("Which is spelled correctly?", ["permision", "permission", "permishun", "permiszion"], 1, "Permission is spelled with -ssion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: choose a fact you read or heard this week. Find a second source that agrees or disagrees, then tell a family member which one you trust more and why.",
    [("source", "A place information comes from, such as a book, website or person"), ("reliable", "Able to be trusted to be correct"), ("author", "The person who wrote a text"), ("expert", "A person who knows a lot about a topic"), ("fact", "Something that can be proved to be true"), ("opinion", "What someone thinks or feels"), ("check", "To look carefully to make sure something is right"), ("evidence", "Facts or signs that show something is true")],
    [],
    _sort("Reliable or not?", "Sort each source into reliable or not reliable for facts.", ["Reliable", "Not reliable"], [("book by a scientist", 0), ("national parks website", 0), ("rumour from a friend", 1), ("toy advertisement", 1), ("museum website", 0), ("stranger's comment", 1), ("library encyclopedia", 0), ("joke poster", 1)]),
    [
        _wc("Which means a place information comes from?", ["source", "title", "caption"], 0, "A source is a place information comes from."),
        _wc("Which means able to be trusted to be correct?", ["reliable", "colourful", "short"], 0, "Reliable means able to be trusted to be correct."),
        _wc("Which is a person who knows a lot about a topic?", ["author", "expert", "listener"], 1, "An expert knows a lot about a topic."),
        _wc("Which is what someone thinks or feels?", ["fact", "date", "opinion"], 2, "An opinion is what someone thinks or feels."),
        _wc("Which is spelled correctly?", ["collishun", "collision", "collission"], 1, "Collision is spelled with -sion."),
        _wc("Which is spelled correctly?", ["session", "seshun", "sesion"], 0, "Session is spelled with -ssion."),
        _wc("Which is spelled correctly?", ["discusion", "discushun", "discussion"], 2, "Discussion is spelled with -ssion."),
        _wc("Which is spelled correctly?", ["admision", "admission", "admishun"], 1, "Admission is spelled with -ssion."),
    ],
    [
        {"key": "partA", "label": "Part A: two places", "hint": "Two places to find reliable information."},
        {"key": "partB", "label": "Part B: a checking question", "hint": "One question to check if a source is reliable."},
        {"key": "partC", "label": "Part C: -sion and -ssion words", "hint": "decision, discussion, permission."},
        {"key": "stage1", "label": "My topic", "hint": "A topic you would like to find out about."},
        {"key": "stage2", "label": "My two sources", "hint": "Names and kinds of sources."},
        {"key": "stage3", "label": "Who made them", "hint": "Who made each source and are they an expert."},
        {"key": "stage4", "label": "When and why", "hint": "When and why each was made."},
        {"key": "stage5", "label": "Do they agree?", "hint": "One fact in both, or one disagreement."},
        {"key": "stage6", "label": "One sentence I said", "hint": "A sentence from your talk."},
        {"key": "stage7", "label": "What my listener said", "hint": "One thing your listener said was clear."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for decision, discussion and permission."},
    ],
    ["Trusting the first thing you find", "Mixing up an opinion with a fact", "Using only one source", "Not checking the date", "Spelling session, discussion or permission with only one s"],
    ["Practise your talk once more and look at your listener.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: accept any two sensible places, such as a library book, an encyclopedia, a museum website, a national parks website or an expert. Part B: accept any sensible question, such as Who made it?, When was it made?, Why was it made? or Do other sources agree? Part C: decision, discussion, permission in that order. Main task Stage 1: accept any sensible topic. Stage 2: accept two sensible sources with their kind named. Stage 3: accept who made each one and a sensible judgement about whether they are an expert. Stage 4: accept a date or an estimate and a purpose such as to inform, to entertain or to sell. Stage 5: accept one shared fact or one disagreement. Stage 6: accept a sentence using I found out that, I read it in, or I trust it because. Stage 7: accept any sensible comment. Stage 8: accept six correctly spelled words and sentences. Quiz answers: can be trusted to be correct; a book by a wildlife scientist; whether they know a lot about the topic; to see whether they agree; old information may be out of date; what someone thinks or feels; .gov.au; where you found it and why you trust it; decision; permission.",
)

LESSON["spelling"] = {
    "focus": "-sion and -ssion (the zhun and shun sounds)",
    "teaching": "The ending -sion often says zhun, as in decision and collision. The ending -ssion says shun, as in session, discussion, permission and admission. Say the word slowly, listen to the ending, then write it.",
    "words": [
        _w("decision", "de-ci-sion", "a choice you make, ends in zhun"),
        _w("collision", "col-li-sion", "a crash when things hit each other, ends in zhun"),
        _w("session", "ses-sion", "a period of time for an activity, double s"),
        _w("discussion", "dis-cus-sion", "a talk about a topic, double s"),
        _w("permission", "per-mis-sion", "being allowed to do something, double s"),
        _w("admission", "ad-mis-sion", "the cost or right to go in, double s"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["decision", "decishun", "decission"], 0, "Decision is spelled with -sion."),
        _c("Which is spelled correctly?", ["permision", "permishun", "permission"], 2, "Permission is spelled with -ssion."),
    ],
}
LESSON["spelling_focus"] = "-sion and -ssion (the zhun and shun sounds)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
