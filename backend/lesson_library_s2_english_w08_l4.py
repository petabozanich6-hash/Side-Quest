"""Stage 2 English, Week 8 Lesson 4: Oral Presentation Skills (Oral language).
The child learns how to plan and deliver a short oral presentation: purpose and audience, palm cards of key words, voice tools (volume, pace, pitch, pause, stress), body language and eye contact, using a visual aid, managing nerves with practice, and listening to and answering a question. The child presents the echidna report from Week 8 Lessons 2 and 3. This builds on Week 7 Lesson 4, which taught a beginning, middle and ending and basic clear speaking.
Spelling: plurals: boxes, wolves, knives, children, feet, sheep.
Outcomes: EN2-OLC-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 8, Lesson 4, Oral presentation skills, oral language slot, spelling plurals). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Video status: one video attached, chosen from its search description and transcript excerpt. It has not been watched in full, so it carries a parent preview note.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["boxes", "wolves", "knives", "children", "feet", "sheep"]

CARDS = (
    "MODEL PALM CARDS\n\n"
    "Card 1: Echidnas. Small, spiny mammals. Live across Australia.\n"
    "Card 2: Spines and snout. Sharp spines. Long, thin snout. (Hold up picture.)\n"
    "Card 3: Sticky tongue. Ants and termites.\n"
    "Card 4: Puggle. Baby echidna. Female lays an egg.\n"
    "Card 5: Ending. Digs to stay safe. Any questions?"
)

TALK = (
    "MODEL TALK\n\n"
    "Good morning, everyone. [Look at the audience. Pause.] Today I am going to tell you about a very unusual animal: the echidna. "
    "Echidnas are small, spiny mammals that live across Australia. [Pause.] "
    "An echidna has SHARP spines on its back and a long, thin snout. [Hold up the picture, then look back at the audience.] "
    "Echidnas use their sticky tongues to catch ants and termites. [Slow down for ants and termites.] "
    "A female echidna lays an egg, and the baby is called a puggle. [Pause.] "
    "When an echidna is in danger, it digs into the soil to stay safe. "
    "Thank you for listening. Does anyone have a question?"
)

LESSON = build(
    "s2-eng-w08-l4-oral-presentation-skills",
    "Oral Presentation Skills",
    "Learn how to plan and give a short talk using palm cards, your voice, your body, eye contact and a picture, and how to answer a question from your audience.",
    "Oral language: oral presentation skills",
    ["EN2-OLC-01", "EN2-SPELL-01"],
    {
        "EN2-OLC-01": "Communicates with familiar audiences for social and learning purposes, by interacting, understanding and presenting. This lesson focuses on planning and delivering a short oral presentation, using voice, body language and a visual aid, and answering a question.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is plurals: -s, -es, -ves and irregular plurals.",
    },
    "We are learning how to plan and give a clear, interesting talk, to use our voice and body well, to answer a question, and to spell plurals.",
    [
        "I can plan a talk using palm cards with key words.",
        "I can use my voice well: volume, pace, pitch, pauses and stress.",
        "I can use my body well: posture, gestures and eye contact.",
        "I can use a picture to help my audience.",
        "I can stay calm by breathing and practising.",
        "I can answer a question from a listener.",
        "I can listen well to another speaker.",
        "I can spell and use boxes, wolves, knives, children, feet and sheep.",
    ],
    ["audience", "volume", "pace", "pitch", "pause", "gesture", "palm card", "eye contact"],
    ["This lesson (everything you need is inside it)", "Small blank cards or pieces of paper for palm cards", "A picture or drawing of your animal", "A family member or friend to listen to your talk"],
    "Child has found reliable sources and given a short talk with a beginning, middle and ending (Week 7 Lesson 4), and has written a description paragraph and a report in the timeless present tense (Week 8 Lessons 2 and 3).",
    (
        "Why this matters. Sharing what you know with other people is an important skill. A talk is more interesting when the speaker plans it, uses their voice and body well, and connects with the audience. The audience is the people who listen.\n\n"
        "Know your purpose and audience. Ask what you want your listeners to learn, and who they are. Today the purpose is to inform, and the audience is family or friends. Choose words they can follow.\n\n"
        "Palm cards. A palm card is a small card that holds key words to remind you what to say. Write only key words, not whole sentences, so that you look up at your audience instead of reading. Number the cards so they stay in order.\n\n"
        "Voice. Volume is how loud you speak. Speak loudly enough for the person at the back to hear. Pace is how fast you speak. Slow down for important or new words. Pitch is how high or low your voice is. Change it a little so that you do not sound flat. A pause is a short silence. Pause after an important idea so that listeners can think about it. Stress means saying one word a little louder or longer, such as SHARP spines.\n\n"
        "Body. Stand tall with your feet apart and your hands relaxed. Use gestures, such as showing a size with your hands, to help your listeners picture what you mean. Let your face show how you feel about your topic.\n\n"
        "Eye contact. Look at your audience, not only at your cards or the floor. Look at different people during your talk. Look at your card for a moment, find your key word, then look up and speak.\n\n"
        "Visual aids. A picture or object helps the audience see what you mean. Hold it up so that everyone can see, say what it shows, then lower it and face the audience again. Do not talk to the picture.\n\n"
        "Nerves and practice. Many people feel nervous before they speak, and it is normal. Take a slow breath, stand tall, and begin with a pause. The best way to feel calmer is to practise your talk aloud a few times.\n\n"
        "Listening and questions. A good listener looks at the speaker, stays quiet, and asks a question at the end. A good speaker listens to the whole question, thinks, then answers in a clear sentence. If you do not know, say, I am not sure, and I will find out.\n\n"
        "A link to spelling. This week's spelling focus is plurals. Most words add s. Words ending in x, ch, sh, s or z add es, as in boxes. Many words ending in f or fe change to ves, as in wolves and knives. Some plurals are irregular, as in children, feet and sheep, where sheep stays the same."
    ),
    [
        _step("1", "Purpose and audience", "Before you plan, ask what you want your audience to learn, and who they are.\n\nChoose words your listeners can follow.", "I want my family to learn three facts about echidnas, so I choose simple words and explain any hard ones.", "Know why you are speaking and who is listening.", ("What is an audience?", ["The people who listen", "A kind of card", "The title of a talk"], 0, "The audience is the people who listen.")),
        _step("2", "Palm cards", "A palm card holds key words to remind you what to say. Write key words only, not whole sentences. Number each card.\n\nThis helps you look up instead of reading.", "Card 2: Spines and snout. Sharp spines. Long, thin snout.", "Key words, numbered, small.", ("What goes on a palm card?", ["Whole paragraphs", "Key words", "Only a picture"], 1, "A palm card holds key words.")),
        _step("3", "Voice: volume and pace", "Volume is how loud you speak. Speak so that the person at the back can hear. Pace is how fast you speak. Slow down for important or new words.\n\nSpeaking too fast is a common problem.", "Echidnas use their sticky tongues to catch ants and termites. I slow down on ants and termites.", "Loud enough, and not too fast.", ("What is pace?", ["How loud you speak", "How high your voice is", "How fast or slow you speak"], 2, "Pace is how fast or slow you speak.")),
        _step("4", "Voice: pitch, pause and stress", "Change your pitch a little so that you do not sound flat. Pause after an important idea so that listeners can think. Stress a key word by saying it a little louder or longer.\n\nPausing feels long to the speaker, but it sounds clear to the listener.", "An echidna has SHARP spines. [pause] The word sharp is stressed, and the pause lets the idea sink in.", "Vary pitch, pause, stress.", ("Why do speakers pause?", ["To give listeners time to think", "Because they forgot everything", "To make the talk shorter"], 0, "A pause gives listeners time to think about an idea.")),
        _step("5", "Body language", "Stand tall with your feet apart and hands relaxed. Use gestures to show size or action, and let your face show interest.\n\nAvoid swaying, hiding behind your cards, or fidgeting.", "I hold my hands apart to show how small an echidna's snout is.", "Tall, relaxed, helpful gestures.", ("Which helps your audience picture what you mean?", ["A helpful gesture", "Turning your back", "Hiding your face"], 0, "A gesture can show size or action.")),
        _step("6", "Eye contact", "Look at your audience, not only at your cards. Look at different people. Glance at a card, find your key word, then look up and speak.\n\nEye contact shows you care about your listeners.", "I look at my sister, then my dad, then my friend as I speak.", "Look at different people.", ("Where should you look most of the time?", ["At the floor", "At your audience", "At the ceiling"], 1, "Look at your audience, using your cards only for a glance.")),
        _step("7", "Using a picture", "Hold the picture up so everyone can see, say what it shows, then lower it and face the audience again.\n\nDo not talk to the picture or read from it.", "I hold up my echidna drawing and say, Here you can see its sharp spines.", "Show it, say it, then look up.", ("What should you do with your picture?", ["Hold it so everyone can see, then face the audience", "Talk to it with your back turned", "Hide it"], 0, "Show it, say what it shows, then look back at your audience.")),
        _step("8", "Calm nerves with practice", "Feeling nervous is normal. Take a slow breath, stand tall, and begin with a pause.\n\nPractise your talk aloud a few times. Each time, try one thing better.", "First practice: I spoke too fast. Second practice: I slowed down on the hard words.", "Breathe, then practise aloud.", ("Which helps with nerves?", ["Skipping practice", "Taking a slow breath and practising", "Talking as fast as you can"], 1, "A slow breath and practice help you feel calmer.")),
        _step("9", "Listening and questions", "As a listener, look at the speaker, stay quiet, and ask a question at the end. As a speaker, listen to the whole question, think, and answer in a clear sentence.\n\nIf you do not know, say I am not sure, and I will find out.", "Question: What do echidnas eat? Answer: Echidnas eat ants and termites.", "Listen, think, answer clearly.", ("What can you say if you do not know an answer?", ["Nothing at all", "I am not sure, and I will find out", "Make up something"], 1, "It is fine to say you are not sure and will find out.")),
        _step("10", "Spelling focus: plurals", "Most words add s. Words ending in x, ch, sh, s or z add es, as in boxes. Many words ending in f or fe change to ves, as in wolves and knives. Some plurals are irregular, as in children and feet, and sheep stays the same.\n\nSay the word, think about the ending, then write it.", "One box, two boxes. One wolf, two wolves. One child, two children. One sheep, two sheep.", "s, es, ves, irregular, or the same.", ("What is the plural of child?", ["childs", "childrens", "children"], 2, "Child has an irregular plural, children.")),
    ],
    (
        "Let's see how a talk is planned and given. My topic is the echidna, from my report. First I think about purpose and audience. I want my family to learn some facts, so I use simple words. Next I make palm cards with key words only. Here they are. " + CARDS.replace("\n", " ") + " Now I practise my voice. I speak loudly enough for the back of the room. I slow down for ants and termites. I stress the word sharp and I pause after each important idea. I stand tall with relaxed hands, and I look at different people. When I mention the spines, I hold up my picture, say what it shows, and then look back at my audience. After my talk, a listener asks, What do echidnas eat? I listen to the whole question, think, and answer: Echidnas eat ants and termites. Now it is your turn to plan and give a talk. Here is my talk with the actions in brackets.\n\n" + TALK + "\n\n" + CARDS
    ),
    (
        "Type your answers in the practice boxes. Part A: type three key words you could put on a palm card for this sentence: Echidnas use their sticky tongues to catch ants and termites. Part B: type which voice tool you would use for each: to help the person at the back hear you; to make a hard word clear; to let an important idea sink in; to make the word sharp stand out. Choose from volume, pace, pause and stress. Part C: type one thing you can do with your eyes and one thing you can do with your hands to help your audience. Part D: type the plural for each: one wolf, two ___. One knife, two ___. One child, two ___. One foot, two ___. One sheep, two ___. Your parent can check your answers against the answer key."
    ),
    (
        "Plan and give a talk. Typed answers go in the boxes. Use the model palm cards and talk below to help you.\n\n" + CARDS + "\n\n" + TALK + "\n\n"
        "Stage 1 (topic): type the topic of your talk. You can use your echidna report from Week 8 Lessons 2 and 3, or another animal report you have written.\n"
        "Stage 2 (palm cards): make three to five palm cards and type what is on each card. Use key words only, and number them.\n"
        "Stage 3 (targets): type one voice target (volume, pace, pitch, pause or stress) and one body target (posture, gesture or eye contact) you will work on.\n"
        "Stage 4 (picture): type what picture or object you will show, and when you will hold it up.\n"
        "Stage 5 (practise): practise your talk aloud at least three times, alone or in front of a mirror. Type one thing that was better the second or third time.\n"
        "Stage 6 (present): give your talk to a listener, then ask your listener to ask you one question about your topic. Type the question and your answer.\n"
        "Stage 7 (feedback): ask your listener for one strength and one thing to try next time. Type both.\n"
        "Stage 8 (spell): type your six spelling words and one sentence for each of wolves, knives and children.\n\n"
        "Parent: listen to the talk and check that the child uses palm cards with key words and does not read every word, speaks loudly enough and not too fast, pauses at least once, looks at the listener, uses the picture well, and answers the question clearly. Ask the child one question about the topic. Give one strength and one thing to try next time. Accept any sensible topic and targets."
    ),
    "Which was harder for you: planning your palm cards, or giving the talk with your voice and body, and what will you try next time you present?",
    "Did I plan with palm cards, practise aloud, use my voice and body well, look at my audience, use my picture, answer a question, and spell boxes, wolves, knives, children, feet and sheep correctly?",
    [
        _q("What is a palm card for?", ["Writing the whole talk word for word", "Holding key words to remind you what to say", "Drawing a picture", "Keeping your hands warm"], 1, "A palm card holds key words to remind you."),
        _q("Which is best on a palm card?", ["Key words such as spines, snout and tongue", "A whole paragraph", "Only the title", "Nothing at all"], 0, "Key words help you look up instead of reading."),
        _q("What does pace mean?", ["How loud you speak", "How high your voice is", "How long your talk is", "How fast or slow you speak"], 3, "Pace is how fast or slow you speak."),
        _q("Which helps the people at the back hear you?", ["Looking at the floor", "Speaking faster", "A louder, clear voice", "Mumbling"], 2, "A louder, clear voice, or volume, helps everyone hear."),
        _q("Why do speakers pause after an important idea?", ["To run out of time", "To give listeners time to think about it", "To make the talk shorter", "To hide their face"], 1, "A pause lets listeners think about an important idea."),
        _q("Where should you look most of the time?", ["At the floor", "At your palm cards the whole time", "At the ceiling", "At different people in the audience"], 3, "Look at different people, using your cards only for a glance."),
        _q("What should you do with your picture?", ["Read from it with your back to the audience", "Hold it close to your face", "Hold it up so everyone can see, then face the audience", "Hide it"], 2, "Show it, say what it shows, then face the audience again."),
        _q("Which helps with nerves?", ["Taking a slow breath and practising", "Skipping practice", "Talking as fast as you can", "Staring at the floor"], 0, "A slow breath and practice help you feel calmer."),
        _q("What is the plural of knife?", ["knifes", "knives", "knifs", "knivs"], 1, "Knife changes to knives."),
        _q("What is the plural of child?", ["childs", "childrens", "children", "childern"], 2, "Child has an irregular plural, children."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: watch a short talk by a presenter, such as a news report or a nature program. Notice one thing they do with their voice, one thing they do with their body, and how they use a picture. Tell a family member what you noticed.",
    [("audience", "The people who listen to or watch a talk"), ("volume", "How loud or soft you speak"), ("pace", "How fast or slow you speak"), ("pitch", "How high or low your voice is"), ("pause", "A short silence while speaking"), ("gesture", "A movement of your hands or body that shows meaning"), ("palm card", "A small card with key words to help a speaker"), ("eye contact", "Looking at the people you are speaking to")],
    [
        _video(
            "Public Speaking: A Kid's Guide To Confident Communication", "iIAMNdnSpps",
            "Watch for tips about using your voice, using your eyes and body, and talking with your audience. Pick one tip that you will try in your own talk, and tell your parent which one you chose. Parent: this video has not been watched in full, so please preview it. It was chosen from its description, which says it teaches children to express themselves clearly and confidently in front of an audience.",
            "If the video will not play, reread Steps 3 to 6 and practise one voice tip and one body tip aloud.",
            ("Which helps your audience connect with you?", ["Looking at different people", "Looking at the floor", "Turning your back"], 0, "Eye contact helps your audience connect with you."),
        ),
    ],
    _sort("Strong speaker or needs work?", "Sort each habit into a strong habit or something to work on.", ["Strong habit", "Needs work"], [("looks at different people", 0), ("reads every word from the page", 1), ("pauses after an important idea", 0), ("mumbles with head down", 1), ("holds up the picture so all can see", 0), ("speaks as fast as possible", 1), ("stands tall with relaxed hands", 0), ("turns their back on the audience", 1)]),
    [
        _wc("Which means the people who listen?", ["audience", "gesture", "pitch"], 0, "The audience is the people who listen."),
        _wc("Which means how fast or slow you speak?", ["volume", "pace", "pause"], 1, "Pace is how fast or slow you speak."),
        _wc("Which is a short silence while speaking?", ["pitch", "stress", "pause"], 2, "A pause is a short silence."),
        _wc("Which is a movement of your hands that shows meaning?", ["gesture", "volume", "audience"], 0, "A gesture is a movement that shows meaning."),
        _wc("Which is the correct plural of wolf?", ["wolfs", "wolves", "wolfes"], 1, "Wolf changes to wolves."),
        _wc("Which is the correct plural of knife?", ["knifes", "knifs", "knives"], 2, "Knife changes to knives."),
        _wc("Which is the correct plural of child?", ["children", "childs", "childrens"], 0, "Child has an irregular plural, children."),
        _wc("Which is the correct plural of foot?", ["foots", "feet", "feets"], 1, "Foot has an irregular plural, feet."),
    ],
    [
        {"key": "partA", "label": "Part A: key words", "hint": "Three key words for a palm card."},
        {"key": "partB", "label": "Part B: voice tools", "hint": "volume, pace, pause or stress for each job."},
        {"key": "partC", "label": "Part C: eyes and hands", "hint": "One thing with your eyes and one with your hands."},
        {"key": "partD", "label": "Part D: plurals", "hint": "wolf, knife, child, foot, sheep."},
        {"key": "stage1", "label": "My topic", "hint": "The topic of your talk."},
        {"key": "stage2", "label": "My palm cards", "hint": "Three to five numbered cards with key words."},
        {"key": "stage3", "label": "My targets", "hint": "One voice target and one body target."},
        {"key": "stage4", "label": "My picture", "hint": "What you will show and when."},
        {"key": "stage5", "label": "After practising", "hint": "One thing that was better after practice."},
        {"key": "stage6", "label": "My listener's question", "hint": "The question and your answer."},
        {"key": "stage7", "label": "Feedback", "hint": "One strength and one thing to try next time."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for wolves, knives and children."},
    ],
    ["Writing the whole talk on the cards and reading it", "Speaking too fast or too quietly", "Looking only at the cards or the floor", "Turning to the picture instead of the audience", "Not practising aloud before presenting", "Writing wolfs, knifes or childs instead of wolves, knives and children"],
    ["Practise your talk aloud one more time.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: accept three sensible key words, such as sticky tongue, ants, termites. Part B: volume; pace; pause; stress, in that order. Part C: accept a sensible eye action (look at different people) and a sensible hand action (show a size, point to the picture). Part D: wolves, knives, children, feet, sheep. Main task Stage 1: accept any sensible topic. Stage 2: accept three to five numbered cards with key words, not whole sentences. Stage 3: accept one voice target and one body target. Stage 4: accept a sensible picture and moment to show it. Stage 5: accept any sensible improvement. Stage 6: accept any sensible question with a clear answer. Stage 7: accept any sensible strength and next step. Stage 8: accept six correctly spelled words and sentences. Quiz answers: holding key words to remind you what to say; key words such as spines, snout and tongue; how fast or slow you speak; a louder, clear voice; to give listeners time to think about it; at different people in the audience; hold it up so everyone can see, then face the audience; taking a slow breath and practising; knives; children.",
)

LESSON["spelling"] = {
    "focus": "Plurals: -s, -es, -ves and irregular",
    "teaching": "Most words add s. Words ending in x, ch, sh, s or z add es, as in boxes. Many words ending in f or fe change to ves, as in wolves and knives. Some plurals are irregular, as in children and feet, and sheep stays the same. Say the word, think about the ending, then write it.",
    "words": [
        _w("boxes", "box-es", "more than one box, ends in es after x"),
        _w("wolves", "wolves", "more than one wolf, f changes to ves"),
        _w("knives", "knives", "more than one knife, fe changes to ves, silent k"),
        _w("children", "chil-dren", "more than one child, an irregular plural"),
        _w("feet", "feet", "more than one foot, an irregular plural"),
        _w("sheep", "sheep", "one or many, the plural is the same"),
    ],
    "check": [
        _c("What is the plural of wolf?", ["wolves", "wolfs", "wolfes"], 0, "Wolf changes to wolves."),
        _c("What is the plural of foot?", ["foots", "feets", "feet"], 2, "Foot has an irregular plural, feet."),
    ],
}
LESSON["spelling_focus"] = "Plurals: -s, -es, -ves and irregular"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
