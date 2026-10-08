"""Stage 2 English, Week 8 Lesson 4: Oral Presentation Skills (Oral language).
The child learns the parts of a short talk (opening, three points, closing), the voice and body skills of a good speaker, and how to use notes and a visual, then plans and gives a one-minute talk to a parent using a peer-feedback checklist.
Spelling: Week 8 plurals review: dishes, wolves, children, knives, churches, women.
Outcome codes: EN2-OLC-01 and EN2-SPELL-01, both of which exist in nsw_outcomes.py.
Video status: none. No oral presentation video has been transcript-checked, so none is included.
Do not register this module in lesson_library.py or add week 8 to BUILT_OUT_WEEKS until the whole week is built.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["dishes", "wolves", "children", "knives", "churches", "women"]

LESSON = build(
    "s2-eng-w08-l4-oral-presentation-skills",
    "Oral Presentation Skills",
    "A good talk has a clear shape and a confident delivery. Learn the parts of a short talk, the voice and body skills that make a speaker easy to follow, and give a one-minute talk to a parent.",
    "Oral language: presentation skills",
    ["EN2-OLC-01", "EN2-SPELL-01"],
    {
        "EN2-OLC-01": "Primary. Communicates with familiar audiences for social and learning purposes, by interacting, understanding and presenting. In this lesson the child plans and gives a short talk with an opening, three points and a closing, using voice, eye contact and a visual.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including review of the Week 8 plural words.",
    },
    "We are learning to plan and give a short talk with an opening, three points and a closing, to use our voice and body well, and to spell plural words correctly.",
    [
        "I can explain the three parts of a talk.",
        "I can plan a talk using key words, not whole sentences.",
        "I can use a clear voice: volume, pace and pauses.",
        "I can use eye contact and a steady body.",
        "I can use one visual to help the listener.",
        "I can give and receive kind, useful feedback.",
        "I can spell and use dishes, wolves, children, knives, churches and women.",
    ],
    ["presentation", "opening", "closing", "eye contact", "pace", "feedback"],
    ["This lesson (everything you need is inside it)", "A parent or family member as the audience", "One picture or object to use as a visual"],
    "Child has written a description paragraph (Lesson 2) and can find the main idea of a text (Week 7, Lesson 1).",
    (
        "Why this matters. Speaking to an audience is a skill that everyone can learn. A clear talk helps your listeners understand and remember your ideas, and it helps you feel confident.\n\n"
        "The shape of a talk. A short talk has three parts. The opening says what the talk is about and catches attention. The middle gives three points, each with a detail or example. The closing wraps up and thanks the audience.\n\n"
        "Planning with key words. Do not write every word and read it out. Write the topic and one key word or phrase for each point on a small card. Then you can look up and speak naturally.\n\n"
        "Voice. Speak loudly enough for the back of the room. Slow your pace so listeners can follow. Pause after an important point. Change your voice a little so it is not flat.\n\n"
        "Body. Stand tall with your feet still. Look at your audience, not the floor or the card. This is eye contact. Use your hands to point or show, not to fidget.\n\n"
        "Visuals. A picture, a model or an object helps listeners see what you mean. Hold it up, point to the key part, and do not hide behind it.\n\n"
        "Feedback. After a talk, listeners say one thing that went well and one thing to try next time. Kind and specific feedback helps the speaker improve.\n\n"
        "A link to spelling. This lesson reviews the week's plurals: dishes, wolves, children, knives, churches and women."
    ),
    [
        _step("1", "The three parts of a talk", "A short talk has an opening, a middle and a closing. The opening says what the talk is about. The middle gives three points. The closing wraps up and thanks the audience.\n\nThis shape keeps your listeners with you.", "Opening: Today I will tell you about the platypus. Middle: its bill, its fur, its eggs. Closing: That is why the platypus is so special. Thank you.", "Open, three points, close.", ("Which part says what the talk is about?", ["The opening", "The closing", "The thank you"], 0, "The opening introduces the topic.")),
        _step("2", "Planning with key words", "Write the topic and one key word or phrase for each point on a small card. Do not write every word.\n\nKey words remind you what to say, so you can look up.", "Card: platypus. Point 1: bill. Point 2: fur. Point 3: lays eggs.", "Key words, not sentences.", ("What should go on a speaker's card?", ["Key words", "Every word of the talk", "Nothing"], 0, "Key words let you speak naturally.")),
        _step("3", "Using your voice", "Speak loudly enough to be heard at the back. Use a steady pace, and pause after important points. Change your voice to keep listeners interested.\n\nDo not rush.", "Pause after: the platypus lays eggs. The listeners have time to think about it.", "Clear, steady, with pauses.", ("Why do speakers pause?", ["So listeners can think about the point", "Because they forgot", "To run out of time"], 0, "A pause lets an important point sink in.")),
        _step("4", "Using your body", "Stand tall with still feet. Look at your audience, which is called eye contact. Use your hands to point or show, not to fidget.\n\nEye contact shows you care about your listeners.", "The speaker looks up from the card at each listener in turn, then looks back to find the next key word.", "Stand tall and look up.", ("What is eye contact?", ["Looking at your audience", "Looking at the floor", "Closing your eyes"], 0, "Eye contact means looking at your listeners.")),
        _step("5", "Using a visual and giving feedback", "A picture or object helps listeners see what you mean. Hold it up and point to the key part.\n\nAfter the talk, listeners say one thing that went well and one thing to try next time.", "Feedback: I liked how you held up the picture. Next time, try slowing down at the end.", "Kind and specific.", ("Which is helpful feedback?", ["I liked how you paused after the main point", "That was bad", "Fine"], 0, "It is kind and says exactly what was good.")),
        _step("6", "Spelling review: plurals", "Words ending in sh or ch add -es: dishes, churches. Wolf changes to wolves and knife changes to knives. Child changes to children, and woman changes to women.\n\nLearn each word, then check it.", "The women and children washed the dishes and knives.", "Check the ending before you write.", ("Which is spelled correctly?", ["childs", "childen", "children"], 2, "Child changes completely to children.")),
    ],
    (
        "Let's watch how one speaker plans and gives a one-minute talk. The topic is the platypus. First, the speaker writes a small card with the topic and three key words: bill, fur and eggs. The opening is: Today I will tell you about the platypus, one of the most unusual animals in Australia. The speaker holds up a picture, points to the bill and says it is flat and rubbery. After the first point the speaker pauses, then moves to the fur, which is thick and waterproof. The third point is that the platypus lays eggs, which is rare for a mammal. The closing is: That is why the platypus is so special. Thank you. The speaker looks up at the audience, keeps a steady pace, and points to the picture instead of hiding behind it. Afterwards a listener says: I liked how you held up the picture. Next time, try slowing down a little at the end."
    ),
    (
        "Type your answers in the practice boxes. Part A: type the three parts of a talk in order. Part B: turn this sentence into key words for a speaker's card. Kangaroos carry their babies in a pouch, and a baby is called a joey. Part C: type two things a speaker can do with their voice to help the audience. Part D: type the correct plural for each blank. Choose from dishes, wolves, children, knives, churches and women. The ___ howled at night. We washed the ___ after tea. Many ___ and ___ came to the talk. Your parent can check your answers against the answer key."
    ),
    (
        "Plan and give your own one-minute talk. Typed answers go in the boxes. Use the platypus talk as a model.\n\n"
        "Stage 1 (topic): with a parent, choose an animal or place you know well. Type it.\n"
        "Stage 2 (card): type your topic and three key words, one for each point.\n"
        "Stage 3 (opening and closing): type one sentence for your opening and one for your closing.\n"
        "Stage 4 (visual): choose one picture or object. Type what it is and which key point it helps with.\n"
        "Stage 5 (practise): practise your talk aloud once on your own. Type one thing you want to improve.\n"
        "Stage 6 (give the talk): give your one-minute talk to a parent. Ask your parent to say one thing that went well and one thing to try next time. Type what they said.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of children, knives and women.\n\n"
        "Parent: listen to the whole talk without interrupting. Check that it has an opening, three points and a closing, that the child uses key words, looks up, uses a clear voice and shows the visual. Give one specific compliment and one gentle suggestion. Accept any sensible topic and reasonable delivery."
    ),
    "Why is it better to use key words on a card than to read your whole talk aloud?",
    "Did I plan a talk with an opening, three points and a closing, use key words, speak clearly with pauses, make eye contact, show a visual, ask for feedback, and spell dishes, wolves, children, knives, churches and women correctly?",
    [
        _q("What are the three parts of a short talk?", ["Opening, three points, closing", "Title, name, date", "Question, answer, joke", "Start, stop, end"], 0, "A short talk has an opening, a middle and a closing."),
        _q("What does the opening do?", ["Says what the talk is about", "Wraps up the talk", "Says thank you only", "Asks the audience to leave"], 0, "It introduces the topic."),
        _q("What goes on a speaker's card?", ["Key words", "Every word", "Nothing", "Only the title"], 0, "Key words help you speak naturally."),
        _q("Why do speakers pause?", ["So listeners can think", "Because they are bored", "To run out of time", "To hide"], 0, "Pauses help listeners follow."),
        _q("What is eye contact?", ["Looking at the audience", "Looking at the floor", "Closing your eyes", "Looking at the card only"], 0, "Eye contact is looking at your listeners."),
        _q("Which pace is best?", ["Steady, not rushed", "As fast as possible", "Very slow", "Whispering"], 0, "A steady pace helps people follow."),
        _q("Which is useful feedback?", ["I liked your clear voice. Try pausing more", "Bad", "Whatever", "You talk too much"], 0, "It is kind and specific."),
        _q("Which is the correct plural of dish?", ["dishs", "dishes", "dishies", "dishen"], 1, "Dish ends in sh, so add -es."),
        _q("Which is the correct plural of wolf?", ["wolfs", "wolves", "wolfes", "wolvs"], 1, "Wolf changes to wolves."),
        _q("Which is the correct plural of woman?", ["womans", "womens", "women", "womanes"], 2, "Woman changes to women."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: give your talk again to a different family member. Ask them to tell you one thing that was clearer the second time.",
    [("presentation", "A talk given to an audience"), ("opening", "The start of a talk that says what it is about"), ("closing", "The end of a talk that wraps up and thanks the audience"), ("eye contact", "Looking at the people you are speaking to"), ("pace", "How fast or slow you speak"), ("feedback", "Comments that help someone improve")],
    [],
    _sort("Voice or body skill?", "Sort each speaker skill into the right group.", ["Voice", "Body"], [("Speaking loudly enough", 0), ("Looking at the audience", 1), ("Pausing after a main point", 0), ("Standing still and tall", 1), ("Using a steady pace", 0), ("Pointing to a picture", 1)]),
    [
        _wc("Which is a talk given to an audience?", ["presentation", "feedback", "pace"], 0, "A presentation is a talk to an audience."),
        _wc("Which means looking at the people you speak to?", ["eye contact", "pace", "opening"], 0, "Eye contact is looking at the audience."),
        _wc("Which means how fast you speak?", ["pace", "closing", "feedback"], 0, "Pace is how fast or slow you speak."),
        _wc("Which is spelled correctly?", ["dishes", "dishs", "dishies"], 0, "Dish ends in sh, so add -es."),
        _wc("Which is spelled correctly?", ["churchs", "churches", "churchies"], 1, "Church ends in ch, so add -es."),
        _wc("Which is spelled correctly?", ["knifes", "knifs", "knives"], 2, "Knife changes to knives."),
        _wc("Which is spelled correctly?", ["wolfs", "wolves", "wolfes"], 1, "Wolf changes to wolves."),
        _wc("Which is spelled correctly?", ["childs", "children", "childen"], 1, "Child changes to children."),
    ],
    [
        {"key": "partA", "label": "Part A: parts of a talk", "hint": "The three parts of a talk in order."},
        {"key": "partB", "label": "Part B: key words", "hint": "Turn the kangaroo sentence into key words."},
        {"key": "partC", "label": "Part C: voice", "hint": "Two things a speaker can do with their voice."},
        {"key": "partD", "label": "Part D: plurals", "hint": "Fill the blanks. Choose from dishes, wolves, children, knives, churches and women."},
        {"key": "stage1", "label": "My topic", "hint": "The animal or place you chose."},
        {"key": "stage2", "label": "My card", "hint": "The topic and three key words."},
        {"key": "stage3", "label": "Opening and closing", "hint": "One sentence for each."},
        {"key": "stage4", "label": "My visual", "hint": "What it is and which point it helps."},
        {"key": "stage5", "label": "Practice", "hint": "One thing you want to improve."},
        {"key": "stage6", "label": "Feedback", "hint": "What your parent said went well and what to try next."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence for each of children, knives and women."},
    ],
    ["Reading every word from a page", "Speaking too fast", "Looking at the floor or the card", "Hiding behind the visual", "Skipping the opening or the closing", "Giving feedback that is not specific"],
    ["Give your talk to another family member and ask for one piece of feedback.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: opening, middle (three points), closing. Part B: accept key words such as kangaroos, pouch, joey. Part C: accept two of speak loudly enough, use a steady pace, pause after main points, change your voice. Part D: wolves; dishes; women and children (either order for the last two blanks). Main task: accept any sensible topic; a card with the topic and three key words; one opening sentence and one closing sentence; a visual that matches a point; an honest practice goal; a talk with an opening, three points and a closing; parent feedback with one thing that went well and one thing to try. Quiz answers: opening, three points, closing; says what the talk is about; key words; so listeners can think; looking at the audience; steady, not rushed; I liked your clear voice, try pausing more; dishes; wolves; women.",
)

LESSON["spelling"] = {
    "focus": "Week 8 review: plurals -es, -ves and irregular",
    "teaching": "Dishes and churches add -es after sh and ch. Wolves and knives change f or fe to -ves. Children and women change completely. Say each word slowly and check the ending.",
    "words": [
        _w("dishes", "dish-es", "dish + es"),
        _w("wolves", "wolves", "wolf changes f to ves"),
        _w("children", "child-ren", "irregular: child changes completely"),
        _w("knives", "knives", "knife changes fe to ves"),
        _w("churches", "church-es", "church + es"),
        _w("women", "wom-en", "irregular: woman changes to women"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["churchs", "churches", "churchies"], 1, "Church ends in ch, so add -es."),
        _c("Which is spelled correctly?", ["womans", "women", "womens"], 1, "Woman changes to women."),
    ],
}
LESSON["spelling_focus"] = "Week 8 review: plurals"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
