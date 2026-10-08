"""Stage 2 English, Week 1 Lesson 4: Storytelling aloud and joined handwriting (Oral language and handwriting).
Built to the standard in docs/LESSON_BUILD_GUIDE.md. Everything is typed inside the lesson except the
handwriting practice, which is written by hand on paper and then described in the lesson.
Spelling is attached here so the lesson is self-contained.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["imagine", "audience", "character", "narrator", "joined", "handwriting"]

LESSON = build(
    "s2-eng-w01-l4-storytelling-handwriting",
    "Storytelling Aloud and Joined Handwriting",
    "Great stories are told before they are written. Plan a story with five fingers, tell it with your voice, then write a sentence in neat joined handwriting.",
    "Oral language and handwriting",
    ["EN2-OLC-01", "EN2-HANDW-01", "EN2-SPELL-01"],
    {
        "EN2-OLC-01": "Primary. Presents a short story to a familiar audience using voice, pace and a clear structure.",
        "EN2-HANDW-01": "Forms legible joined letters to develop handwriting fluency.",
        "EN2-SPELL-01": "Uses syllables and look, say, cover, write, check to spell storytelling words.",
    },
    "We are learning to tell a story aloud in a clear order and to write in neat, joined letters.",
    [
        "I can plan a story with a character, a setting, a problem, events and an ending.",
        "I can tell a story aloud with a clear beginning, middle and end.",
        "I can use my voice and face to keep an audience interested.",
        "I can sit well and hold my pencil so my handwriting is comfortable.",
        "I can join letters smoothly on the baseline.",
        "I can check my handwriting and say how to improve it.",
    ],
    ["audience", "character", "narrator", "setting", "problem", "joined", "baseline", "legible"],
    ["This lesson", "A pencil and lined paper for the handwriting practice", "A listener, or a device to record yourself (optional)"],
    "Child can tell a short event from their day and can form individual letters.",
    (
        "Why this matters. Telling stories aloud is how people have shared ideas for thousands of years, and it is still the quickest way to try out a story before you write it. If you can tell a story clearly out loud, you will find writing it far easier, because you already know what happens and in what order. Neat handwriting matters for a different reason: a reader can only enjoy your story if they can read it.\n\n"
        "The five-finger plan. Use your hand as a map. Thumb: the character, who the story is about. Pointer finger: the setting, where and when it happens. Middle finger: the problem, what goes wrong. Ring finger: the events, what the character tries. Little finger: the ending, how it is solved. Tell the story by touching each finger in turn, and you cannot lose your place.\n\n"
        "Telling it well. A narrator is the person who tells the story. A good narrator uses voice, face and pace. Change your voice a little for different characters. Slow down at the tense moment. Pause before the big surprise. Look at your audience, the people listening, and speak clearly enough for the person furthest away to hear. Use time words such as first, then, suddenly and finally to keep the order clear.\n\n"
        "Handwriting posture. Sit with your feet flat, your back straight and your paper tilted slightly. Hold your pencil lightly between your thumb and first two fingers, about two centimetres above the point. If your hand aches, you are gripping too hard.\n\n"
        "Joined letters. In joined handwriting, letters in a word are connected by small strokes so your pencil does not lift between letters. All letters sit on the baseline, the line you write on, and they lean in the same direction. Joining makes writing faster and smoother once you get used to it, which means more of your thinking can go into the story and less into forming each letter.\n\n"
        "A routine for improving. Write a sentence slowly. Look for the most even, joined word. Circle the one that is hardest to read. Write that word three times, then rewrite the sentence. Improvement comes from noticing, not from rushing.\n\n"
        "A quick demonstration. Five fingers for a story: Thumb, Mia, a girl who loves climbing. Pointer, a tall gum tree behind her house, one summer morning. Middle, her kite gets stuck at the top. Ring, she tries a stick, then a rope, then asks her brother. Little, together they free it and fly it again."
    ),
    [
        _step(
            "1", "The five-finger plan",
            "Hold up one hand. Thumb: character. Pointer: setting. Middle: problem. Ring: events (what is tried). Little: ending (how it is solved).\n\n"
            "Plan your story by touching each finger and saying one sentence for it. You can tell any story this way.",
            "Thumb: Tom, a boy who is afraid of the dark. Pointer: his bedroom at night. Middle: the light goes out. Ring: he tries a torch, then calls Mum. Little: he finds the light was only a switch.",
            "Each finger is one part of the story, in order.",
            ("Which finger is the problem?", ["Thumb", "Middle finger", "Little finger"], 1, "The middle finger is the problem."),
        ),
        _step(
            "2", "Voice, face and pace",
            "Use your voice to show feeling. Speak louder for excitement, softer for secrets. Slow down for scary or sad moments. Pause before a surprise.\n\n"
            "Use your face and hands too. Look at your audience, and keep your voice clear enough for the person furthest away.",
            "'And then... (pause) ...the door creaked open.' The pause makes the audience lean in.",
            "Your voice, face and pauses are your tools.",
            ("What does a pause before a surprise do?", ["Makes listeners curious", "Makes the story longer", "Makes the story confusing"], 0, "A pause builds suspense."),
        ),
        _step(
            "3", "Order words",
            "Time words keep a story in order: first, next, then, after that, suddenly, finally. They help the listener follow.\n\n"
            "Use at least three in your story. Do not use 'and then' every time, because it gets boring.",
            "'First, Mia climbed the gum tree. Suddenly, her kite slipped from her hand. Finally, she caught it.'",
            "Time words keep the order clear.",
            ("Which is a time word?", ["suddenly", "happy", "tree"], 0, "Suddenly tells when something happens."),
        ),
        _step(
            "4", "Posture and pencil grip",
            "Sit with your feet flat and your back straight. Tilt your paper slightly. Hold your pencil lightly with your thumb and first two fingers, about two centimetres above the point.\n\n"
            "If your hand is tired or sore, your grip is too tight. Shake it out and relax.",
            "A relaxed grip makes lines smooth and keeps writing comfortable for longer.",
            "Comfortable and relaxed beats tight and tense.",
            ("If your hand aches when writing, you should...", ["loosen your grip", "press harder", "stop forever"], 0, "A tight grip causes aching."),
        ),
        _step(
            "5", "Joined letters on the baseline",
            "The baseline is the line your letters sit on. In joined writing, small strokes connect each letter to the next so the pencil moves smoothly through the word without lifting.\n\n"
            "Letters should be the same size and lean the same way. Practise common joins such as 'ea', 'ing', 'th' and 'ou'.",
            "Write 'together' in one flowing line, lifting your pencil only at the end of the word.",
            "Smooth joins make writing faster and easier to read.",
            ("The baseline is...", ["the line letters sit on", "the top of the page", "a kind of pencil"], 0, "All letters sit on the baseline."),
        ),
        _step(
            "6", "Spelling focus: storytelling words",
            "Split storytelling words into syllables: im-ag-ine, au-di-ence, char-ac-ter, nar-ra-tor, joined, hand-writ-ing. Notice the tricky bits: the ch in character says k, the double r in narrator, and the oi in joined.\n\n"
            "Use Look, Say, Cover, Write, Check for each tricky bit, and practise writing the words in joined handwriting.",
            "im-ag-ine (3). au-di-ence (3). char-ac-ter (3). nar-ra-tor (3). joined (1). hand-writ-ing (3).",
            "Practise spelling and handwriting together.",
            ("How many syllables are in 'character'?", ["2", "3", "4"], 1, "char-ac-ter has three beats."),
        ),
        _step(
            "7", "Check and improve",
            "After you tell your story, ask what went well and what to improve. After you write, circle your best word and your hardest word to read. Practise the hardest word three times.\n\n"
            "Telling and writing both get better by noticing one thing at a time.",
            "'My voice was clear and I paused before the surprise. Next time I will slow down in the middle.'",
            "Choose one thing to improve next time.",
            ("A good way to improve is to...", ["choose one thing to practise", "change everything", "never check"], 0, "One clear goal is easier to achieve."),
        ),
    ],
    (
        "Plan and tell a story using five fingers. Thumb: Kira, a boy who wants to catch a fish. Pointer: a quiet river at dawn. Middle: his line is tangled. Ring: he tries to untangle it, then asks his grandfather, then starts again. Little: he catches a small fish and lets it go. "
        "Telling it: use a soft voice at dawn, pause before the line snaps, and finish with a calm voice. Time words: first, suddenly, finally. "
        "Handwriting: write 'Kira caught a small fish at dawn.' in joined letters on the baseline, then circle your most even word and your hardest word to read."
    ),
    (
        "Type your answers in the practice boxes. (Handwriting is written on paper, then described in the box.)\n"
        "Part A, five-finger plan: type one sentence for each finger for a story about a lost pet.\n"
        "Part B, time words: add three different time words to this sentence set: 'Sam found the key. He opened the door. He saw the surprise.'\n"
        "Part C, voice: type how you would use your voice to tell this line: 'Suddenly, the lights went out.'\n"
        "Part D, handwriting: on paper, write 'Together we tell wonderful stories.' in joined letters, then type the word you think is your best and the word to practise.\n"
        "Your parent can check your answers against the answer key."
    ),
    (
        "Tell your own story out loud. Everything you type goes in the boxes.\n\n"
        "Stage 1 (plan): type your five-finger plan, one sentence for each finger.\n"
        "Stage 2 (tell): tell the story aloud to a family member or record yourself. Use at least three time words and one pause.\n"
        "Stage 3 (feedback): type one thing that went well and one thing to improve in your telling.\n"
        "Stage 4 (handwriting): on paper, write the first two sentences of your story in joined letters. Type which word is your best and which needs more practice.\n"
        "Stage 5 (spell): type your six spelling words split into syllables."
    ),
    "What was the hardest part of telling your story aloud, and what will you do differently next time?",
    "Did I plan with five fingers, tell the story with time words and a pause, give feedback, write two joined sentences on paper, and split my six spelling words into syllables?",
    [
        _q("Which finger is the character in the five-finger plan?", ["Thumb", "Pointer", "Middle", "Little"], 0, "The thumb is the character."),
        _q("What is a narrator?", ["The person who tells the story", "The main character only", "A kind of pencil", "The ending"], 0, "A narrator tells the story."),
        _q("Which is a time word?", ["finally", "banana", "quiet", "bright"], 0, "Finally shows when something happens."),
        _q("Why pause before a big surprise?", ["It builds suspense", "It wastes time", "It fixes spelling", "It makes you quieter"], 0, "A pause makes listeners curious."),
        _q("Where do letters sit in joined handwriting?", ["On the baseline", "Above the line", "Below the line", "Anywhere"], 0, "All letters sit on the baseline."),
        _q("What should your pencil grip feel like?", ["Light and relaxed", "Tight and tense", "Very high", "Using the whole fist"], 0, "A relaxed grip is comfortable."),
        _q("How many syllables are in 'audience'?", ["2", "3", "4", "5"], 1, "au-di-ence."),
        _q("Who is your audience?", ["The people listening", "The people in the story", "The pencil", "The teacher only"], 0, "The audience listens or reads."),
        _q("Which describes joined writing?", ["Letters connected by small strokes", "Capital letters only", "Every letter separate", "Writing in the air"], 0, "Letters are joined with strokes."),
        _q("What is the best way to improve your storytelling?", ["Choose one thing to practise", "Change everything", "Never repeat", "Speak faster"], 0, "One clear goal helps most."),
    ],
    "Type your answers in the practice boxes and submit them. Optional: add a recording of your story.",
    "Extension: tell the same story again from a different character's point of view, and type what changed.",
    [
        ("audience", "The people who listen to or read your story"),
        ("character", "A person or animal in a story"),
        ("narrator", "The person who tells the story"),
        ("setting", "Where and when a story happens"),
        ("problem", "What goes wrong in a story"),
        ("joined", "Connected with small strokes so the pencil does not lift"),
        ("baseline", "The line your letters sit on"),
        ("legible", "Clear enough to be read easily"),
    ],
    [
        _video("How To Retell a Story For Kids", "w33-m8-geuM",
               "Watch how to retell a story by telling the characters, setting and big events from beginning to end. Say each part aloud with the video.",
               "Retell your favourite story in five sentences, one per finger.",
               ("What do you tell first in a retell?", ["The characters and setting", "The ending", "The title only"], 0, "A retell starts with the characters and setting.")),
        _video("Handwriting: joining letters on the base line (NSW Foundation Font)", "GHmbMwUP9UE",
               "Watch how letters join on the baseline and how the letters lean to the right. Practise each join with your pencil as it appears.",
               "Write the word 'together' three times in joined letters.",
               ("Where do joined letters sit?", ["On the baseline", "Above the line", "In the margin"], 0, "All letters sit on the baseline.")),
    ],
    _sort(
        "Sort the story part",
        "Sort each idea under the finger it belongs to.",
        ["Character and setting", "Problem", "Events and ending"],
        [
            ("A girl named Mia", 0),
            ("A quiet beach at sunset", 0),
            ("Her boat drifts away", 1),
            ("The tide pulls it into deep water", 1),
            ("She wades out and swims after it", 2),
            ("She pulls it back and ties it to a post", 2),
        ],
    ),
    [
        _wc("Which finger is the setting?", ["Pointer", "Thumb", "Little"], 0, "The pointer finger is the setting."),
        _wc("Which word shows order?", ["next", "soft", "big"], 0, "Next is a time word."),
        _wc("Which is good storytelling?", ["Pause before a surprise", "Mumble quickly", "Look at the floor"], 0, "Pausing keeps the audience interested."),
        _wc("How many syllables are in 'narrator'?", ["2", "3", "4"], 1, "nar-ra-tor."),
        _wc("Which is split correctly?", ["char-ac-ter", "cha-rac-ter", "ch-arac-ter"], 0, "char-ac-ter."),
        _wc("Which is the joined word?", ["joined", "jonned", "joind"], 0, "Joined has oi in the middle and ed at the end."),
        _wc("A comfortable pencil grip is...", ["light", "tight", "very low"], 0, "Light and relaxed."),
        _wc("Legible means...", ["easy to read", "very fast", "very small"], 0, "Legible writing can be read easily."),
    ],
    [
        {"key": "partA", "label": "Part A: five-finger plan", "hint": "One sentence for each finger for a story about a lost pet: character, setting, problem, events, ending."},
        {"key": "partB", "label": "Part B: time words", "hint": "Rewrite 'Sam found the key. He opened the door. He saw the surprise.' with three different time words."},
        {"key": "partC", "label": "Part C: voice", "hint": "How would you use your voice to tell 'Suddenly, the lights went out.'? Mention pace, volume and a pause."},
        {"key": "partD", "label": "Part D: handwriting", "hint": "After writing 'Together we tell wonderful stories.' on paper in joined letters, type your best word and the word to practise."},
        {"key": "plan", "label": "My five-finger plan", "hint": "One sentence for each finger: character, setting, problem, events, ending."},
        {"key": "told", "label": "How my telling went", "hint": "Which three time words did you use, and where did you pause?"},
        {"key": "feedback", "label": "Feedback", "hint": "One thing that went well and one thing to improve."},
        {"key": "hand", "label": "My handwriting", "hint": "After writing the first two sentences of your story on paper in joined letters, type your best word and the word you will practise."},
        {"key": "spelling", "label": "Spelling syllables", "hint": "Type your six spelling words split into syllables with hyphens."},
    ],
    [
        "Telling the story too fast so the audience cannot follow",
        "Starting with the ending instead of the beginning",
        "Using 'and then' every time instead of a range of time words",
        "Gripping the pencil too tightly",
        "Letters floating above or below the baseline",
    ],
    [
        "Retell a favourite book or movie in five sentences using the five-finger plan.",
        "Write your name and address in your neatest joined handwriting.",
    ],
    (
        "Part A: accept any five-sentence plan with a character, a setting, a problem, events and an ending about a lost pet. "
        "Part B: accept any three different time words, for example: First, Sam found the key. Next, he opened the door. Finally, he saw the surprise. "
        "Part C: accept answers such as slow pace, a lower volume, a pause before 'the lights went out', and a tense tone. "
        "Part D: accept any honest choice of a best word and a word to practise. "
        "Main task: accept any complete five-finger plan, three time words used, a pause mentioned, one strength and one improvement, a sensible handwriting reflection, and six words split into syllables: im-ag-ine, au-di-ence, char-ac-ter, nar-ra-tor, joined, hand-writ-ing."
    ),
)

LESSON["spelling"] = {
    "focus": "Strategies and syllables",
    "teaching": (
        "Storytelling words are easier to spell when you split them into beats. Say the word, tap each beat, and write one chunk at a time.\n\n"
        "Then look for the tricky bit. In 'character' the ch says k. In 'narrator' there is a double r. In 'joined' the oi is in the middle."
    ),
    "words": [
        _w("imagine", "im-ag-ine", "three beats, and the ending is ine"),
        _w("audience", "au-di-ence", "three beats, starting with au, and ending with ence"),
        _w("character", "char-ac-ter", "three beats, and the ch says k"),
        _w("narrator", "nar-ra-tor", "three beats, with a double r in the middle"),
        _w("joined", "joined", "one beat, with oi in the middle and ed at the end"),
        _w("handwriting", "hand-writ-ing", "two small words hide inside: hand and writing, and the w in writing is silent"),
    ],
    "check": [
        _c("How many syllables are in 'audience'?", ["2", "3", "4"], 1, "au-di-ence has three beats."),
    ],
}
LESSON.setdefault("learning_area", "English")
LESSON["spelling_focus"] = "Strategies and syllables"
LESSON["hoard_words"] = list(WORDS)
