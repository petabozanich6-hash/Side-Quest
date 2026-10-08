"""Stage 2 English, Week 7 Lesson 4: Finding Reliable Sources (Oral language and research).
The child learns what a source is, five questions for judging whether a source is reliable, and practises explaining a choice aloud to a parent.
Spelling: Week 7 review of -sion and -ssion: television, decision, permission, discussion, impression, conclusion.
Outcome codes: EN2-RECOM-01, EN2-OLC-01 and EN2-SPELL-01, all of which exist in nsw_outcomes.py.
Video status: Evaluating Websites (for Elementary students) (YouTube 3y-1cpnIZxs) was checked against its transcript from the search result. It is a US video. It covers stopping to check whether a site is a good fit, a TRAAP checklist (Timeliness, Relevance, Accuracy, Author, Purpose), looking for the date, checking facts against other sources, asking whether the author is an expert, and noticing that sites ending in .edu or government sites are more likely to be trustworthy. Its checklist differs from this lesson's five questions, and it covers URL endings, which the lesson does not. Exact length and playback not confirmed in the app.
Do not register this module in lesson_library.py or add week 7 to BUILT_OUT_WEEKS until the whole week is built. No NSW Department of Education pages are used.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["television", "decision", "permission", "discussion", "impression", "conclusion"]

CHECKLIST = (
    "THE FIVE QUESTIONS\n"
    "1. Who? Who wrote it, and do they know the topic?\n"
    "2. When? Is it recent enough for this topic?\n"
    "3. Why? Is it written to inform, or to sell something or share an opinion?\n"
    "4. Match? Do other sources say the same thing?\n"
    "5. Evidence? Does it give facts, numbers or examples, or just claims?"
)

LESSON = build(
    "s2-eng-w07-l4-reliable-sources",
    "Finding Reliable Sources",
    "Not everything you read or hear is true or useful. Learn five questions for judging a source, practise comparing two sources, and explain your choice out loud.",
    "Research: finding reliable sources",
    ["EN2-RECOM-01", "EN2-OLC-01", "EN2-SPELL-01"],
    {
        "EN2-RECOM-01": "Reads and comprehends texts for wide purposes by monitoring comprehension. In this lesson the child judges whether information texts are reliable using five questions.",
        "EN2-OLC-01": "Communicates with a range of people in informal and guided activities, using appropriate interaction skills. In this lesson the child explains and discusses their choice of source aloud to a parent.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate generalisations and strategies when spelling, including review of the Week 7 -sion and -ssion words.",
    },
    "We are learning to tell whether a source is reliable, to explain our choice aloud, and to spell words that end in -sion and -ssion.",
    [
        "I can explain what a source is.",
        "I can use five questions to judge a source.",
        "I can compare two sources about the same topic.",
        "I can say which source is more reliable and give a reason.",
        "I can explain my choice aloud to someone else.",
        "I can spell and use television, decision, permission, discussion, impression and conclusion.",
    ],
    ["source", "reliable", "author", "expert", "evidence", "opinion"],
    ["This lesson (everything you need is inside it)", "Optional: two short texts or web pages about the same topic, chosen by a parent", "A parent or family member to talk with"],
    "Child can find the main idea in Lesson 1 and has planned an information report in Week 6.",
    (
        "Why this matters. When you research a topic, you read many texts, and some are better than others. A reliable source can be trusted to give correct information. Good researchers check before they use a fact.\n\n"
        "What a source is. A source is where information comes from, such as a book, a website, a magazine, an expert or a video. Some sources are written by experts who studied the topic. Others are written by people who want to sell something or who just share an opinion.\n\n"
        "Reliable means trustworthy. A reliable source is written by someone who knows the topic, is up to date, aims to inform, gives evidence and agrees with other good sources.\n\n"
        "" + CHECKLIST + "\n\n"
        "Fact and opinion. A fact can be checked. An opinion is what someone thinks. A reliable source mostly gives facts and tells you when something is an opinion.\n\n"
        "Cross-checking. Check an important fact in at least two different sources. If they agree, you can trust it more. If they disagree, look at a third.\n\n"
        "Staying safe online. Ask a parent before you use a new website. Never share your name, address or school when you search.\n\n"
        "A link to spelling. This week's spelling review words are television, decision, permission, discussion, impression and conclusion."
    ),
    [
        _step("1", "What a source is", "A source is where information comes from. Books, websites, magazines, videos and people who know the topic are all sources.\n\nNot all sources are equally good.", "A book about frogs by a scientist is a source. So is a video about frogs.", "A source is where information comes from.", ("Which is a source?", ["A book about frogs", "A pencil", "A chair"], 0, "A book can give information, so it is a source.")),
        _step("2", "Who and when", "Ask who wrote it and when. An expert such as a scientist or a museum knows the topic well. A recent date matters for topics that change, like technology.\n\nIf you cannot find an author or date, be careful.", "A page about space written by an astronomer last year is more reliable than an unsigned page from ten years ago.", "Check the author and the date.", ("Which is more likely to be reliable?", ["An article by a scientist who studies frogs", "A page with no author", "A friend's guess"], 0, "An expert knows the topic well.")),
        _step("3", "Why was it written?", "Some texts aim to inform. Others aim to sell something or to persuade. Adverts and posts with lots of exclamation marks are often trying to persuade.\n\nA reliable source mostly gives facts.", "A museum page about dinosaurs informs. An advert for a toy dinosaur sells.", "Inform, sell or persuade?", ("Which text is trying to sell?", ["A museum fact page", "A toy advertisement", "A science book"], 1, "An advertisement aims to sell.")),
        _step("4", "Match and evidence", "Check whether other good sources say the same thing. Look for facts, numbers and examples, not just claims.\n\nIf two sources disagree, check a third.", "Two books both say a frog starts life as a tadpole, so the fact is probably true.", "Agree with others, backed by evidence.", ("Two good sources agree on a fact. What does this tell you?", ["The fact is probably reliable", "The fact is false", "Nothing"], 0, "When good sources agree, you can trust the fact more.")),
        _step("5", "Comparing two sources", "Use the five questions on both sources, then decide which is more reliable and say why.\n\nSource A: written by a marine scientist, dated this year, gives numbers. Source B: no author, no date, says amazing things!!! Source A is more reliable.", "I chose Source A because it has an expert author, a recent date and evidence.", "Use the questions, then give a reason.", ("Which is more reliable: Source A (marine scientist, this year, numbers) or Source B (no author, no date)?", ["Source A", "Source B", "They are the same"], 0, "Source A passes more of the five questions.")),
        _step("6", "Explaining aloud and spelling", "When you speak about your choice, use a clear opening, give two reasons and finish with a conclusion. Look at your listener and speak slowly.\n\nSpelling review: television, decision, permission, discussion, impression and conclusion. Television, decision and conclusion have a single s. Permission, discussion and impression have a double s.", "My decision is Source A. First, an expert wrote it. Second, it gives numbers. In conclusion, it is more reliable.", "Opening, two reasons, conclusion.", ("Which is spelled correctly?", ["conclushun", "conclusion", "conclussion"], 1, "Conclusion ends in -sion.")),
    ],
    (
        "Let's use the five questions on two sources about the same topic: how tall giraffes grow. Source A is a zoo page written by a zookeeper, dated this year, which says male giraffes can reach about five metres tall and shows a measurement chart. Source B has no author or date and says giraffes are the tallest creatures ever, so everyone should buy its giraffe poster. First, who: A has a zookeeper, B has no one. Second, when: A is this year, B is unknown. Third, why: A informs, B sells. Fourth, match: other books agree with A. Fifth, evidence: A has a chart, B has only claims. Source A is clearly more reliable. Now I explain my choice aloud: my decision is Source A. First, an expert wrote it. Second, it has evidence. In conclusion, it is more reliable.\n\n" + CHECKLIST
    ),
    (
        "Type your answers in the practice boxes. Part A: in your own words, what does reliable mean? Part B: type fact or opinion for each. Frogs are amphibians. Frogs are the best animals. A tadpole has a tail. Part C: a web page has no author, no date, lots of exclamation marks and a big Buy Now button. Type two reasons it may not be reliable. Part D: type the correct word for each blank. Choose from television, decision, permission, discussion, impression and conclusion. We asked for ___ to use the website. We watched a show on ___. We came to a ___ after a long ___. Your parent can check your answers against the answer key."
    ),
    (
        "Compare two sources and explain your choice aloud. Typed answers go in the boxes.\n\n" + CHECKLIST + "\n\n"
        "Stage 1 (topic): with a parent, choose a topic you are curious about, such as an animal, a planet or a sport. Type it.\n"
        "Stage 2 (find): with a parent, find two sources about it, such as two books or two web pages. Type their titles.\n"
        "Stage 3 (check source A): answer the five questions for the first source in short sentences.\n"
        "Stage 4 (check source B): answer the five questions for the second source.\n"
        "Stage 5 (decide): type which is more reliable and two reasons why.\n"
        "Stage 6 (explain aloud): tell your parent your choice using an opening, two reasons and a conclusion. Type one thing your parent asked or said.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of decision, discussion and conclusion.\n\n"
        "Parent: help find the sources and stay with the child online. Check that the five questions are answered for both, that the choice uses reasons from them, and that the child can explain the choice aloud. Accept any sensible topic and any reasonable judgement. If the sources are equally reliable, the child may say so and explain why."
    ),
    "Why is it a good idea to check an important fact in two different sources?",
    "Did I use the five questions on both sources, choose the more reliable one with two reasons, explain my choice aloud, and spell television, decision, permission, discussion, impression and conclusion correctly?",
    [
        _q("What is a source?", ["Where information comes from", "A kind of pencil", "A spelling rule", "A paragraph"], 0, "A source is where information comes from."),
        _q("What does reliable mean?", ["Can be trusted", "Very long", "Very colourful", "Very new"], 0, "Reliable means trustworthy."),
        _q("Which question checks the writer?", ["Who wrote it?", "How long is it?", "What colour is it?", "Is it on a screen?"], 0, "Asking who wrote it checks the author."),
        _q("Which is most likely to be reliable?", ["A page written by an expert with evidence", "A page with no author", "An advert", "A guess"], 0, "An expert with evidence is more reliable."),
        _q("What can be checked?", ["A fact", "An opinion", "A feeling", "A wish"], 0, "A fact can be checked."),
        _q("Two good sources disagree. What should you do?", ["Check a third source", "Ignore both", "Choose the longer one", "Guess"], 0, "A third source can help."),
        _q("When you explain your choice aloud, what should you include?", ["An opening, two reasons and a conclusion", "Only a joke", "Nothing", "Only a question"], 0, "A clear structure helps your listener."),
        _q("Which is spelled correctly?", ["televishun", "television", "televission", "televizion"], 1, "Television ends in -sion."),
        _q("Which is spelled correctly?", ["impreshun", "impresion", "impression", "impretion"], 2, "Impression ends in -ssion."),
        _q("Which is spelled correctly?", ["conclusion", "conclushun", "conclution", "conclussion"], 0, "Conclusion ends in -sion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: choose a claim you have heard, such as that cats always land on their feet, and check it in two reliable sources. Report what you found to your family.",
    [("source", "Where information comes from"), ("reliable", "Able to be trusted"), ("author", "The person who wrote a text"), ("expert", "A person who knows a lot about a topic"), ("evidence", "Facts, numbers or examples that show something is true"), ("opinion", "What someone thinks, which cannot be checked")],
    [
        _video(
            "Evaluating Websites (for Elementary students)", "3y-1cpnIZxs",
            "Watch a tutorial on how and why to think carefully about information on websites. Listen for how it checks the date, whether the author is an expert, and whether other sources agree. This video comes from the United States. It uses a checklist called TRAAP, which is a little different from this lesson's five questions, and it talks about web address endings such as .edu. Status: transcript checked.",
            "If the video will not play, reread Steps 2 to 4 and the five questions.",
            ("According to the video, which sites are more likely to give trustworthy information?", ["Educational or government sites", "Any site with lots of ads", "Sites from unknown people"], 0, "The video says educational or government sites are more likely to provide trustworthy information."),
        ),
    ],
    _sort("Fact or opinion?", "Sort each statement into the right group.", ["Fact", "Opinion"], [("Frogs are amphibians", 0), ("Frogs are the best pets", 1), ("A tadpole grows legs", 0), ("Spiders are scary", 1), ("A giraffe has a long neck", 0), ("Giraffes are beautiful", 1)]),
    [
        _wc("Which means able to be trusted?", ["reliable", "opinion", "source"], 0, "Reliable means able to be trusted."),
        _wc("Which means a person who knows a lot about a topic?", ["author", "expert", "evidence"], 1, "An expert knows a lot about a topic."),
        _wc("Which means facts that show something is true?", ["evidence", "opinion", "source"], 0, "Evidence shows something is true."),
        _wc("Which is spelled correctly?", ["decishun", "decision", "decission"], 1, "Decision ends in -sion."),
        _wc("Which is spelled correctly?", ["discussion", "discushun", "discusion"], 0, "Discussion ends in -ssion."),
        _wc("Which is spelled correctly?", ["permishun", "permision", "permission"], 2, "Permission ends in -ssion."),
        _wc("Which is spelled correctly?", ["televishun", "television", "televison"], 1, "Television ends in -sion."),
        _wc("Which is spelled correctly?", ["impression", "impresion", "impreshun"], 0, "Impression ends in -ssion."),
    ],
    [
        {"key": "partA", "label": "Part A: reliable", "hint": "In your own words, what does reliable mean?"},
        {"key": "partB", "label": "Part B: fact or opinion", "hint": "Type fact or opinion for each of the three statements."},
        {"key": "partC", "label": "Part C: two reasons", "hint": "Two reasons the web page may not be reliable."},
        {"key": "partD", "label": "Part D: -sion and -ssion words", "hint": "Fill the blanks. Choose from television, decision, permission, discussion, impression and conclusion."},
        {"key": "stage1", "label": "My topic", "hint": "A topic you are curious about."},
        {"key": "stage2", "label": "My two sources", "hint": "The titles of your two sources."},
        {"key": "stage3", "label": "Source A check", "hint": "Answer the five questions for the first source."},
        {"key": "stage4", "label": "Source B check", "hint": "Answer the five questions for the second source."},
        {"key": "stage5", "label": "My choice", "hint": "Which is more reliable, and two reasons why."},
        {"key": "stage6", "label": "Explaining aloud", "hint": "One thing your parent asked or said when you explained."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence for each of decision, discussion and conclusion."},
    ],
    ["Trusting the first result without checking", "Thinking a source is reliable just because it looks professional", "Mixing up fact and opinion", "Using only one source for an important fact", "Giving a choice without a reason"],
    ["Check one fact you heard this week in two sources.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: able to be trusted, with accurate information. Part B: fact, opinion, fact. Part C: accept two of: no author; no date; lots of exclamation marks; it is trying to sell something. Part D: permission; television; conclusion or decision; discussion (so the last two blanks read: a conclusion or decision after a long discussion). Main task: accept any sensible topic and two sources; short answers to the five questions for each; a choice with two reasons from the questions; a spoken explanation with an opening, two reasons and a conclusion. Quiz answers: where information comes from; can be trusted; who wrote it; a page written by an expert with evidence; a fact; check a third source; an opening, two reasons and a conclusion; television; impression; conclusion.",
)

LESSON["spelling"] = {
    "focus": "Week 7 review: -sion and -ssion",
    "teaching": "Television, decision and conclusion use -sion. Permission, discussion and impression use -ssion. Say each word slowly and check the ending.",
    "words": [
        _w("television", "tel-e-vi-sion", "single s"),
        _w("decision", "de-ci-sion", "single s"),
        _w("permission", "per-mis-sion", "double s before ion"),
        _w("discussion", "dis-cus-sion", "double s before ion"),
        _w("impression", "im-pres-sion", "double s before ion"),
        _w("conclusion", "con-clu-sion", "single s; from conclude"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["permission", "permishun", "permision"], 0, "Permission ends in -ssion."),
        _c("Which is spelled correctly?", ["conclushun", "conclusion", "conclution"], 1, "Conclusion ends in -sion."),
    ],
}
LESSON["spelling_focus"] = "Week 7 review: -sion and -ssion"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
