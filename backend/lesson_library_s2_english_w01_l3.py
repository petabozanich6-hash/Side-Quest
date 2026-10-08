"""Stage 2 English, Week 1 Lesson 3: Spelling Detective, four strategies (Language).
Built to the standard in docs/LESSON_BUILD_GUIDE.md. All written work is typed inside the lesson.
Spelling is attached here so the lesson is self-contained.
Video ID WSaRUa-tPxs (Look, Say, Cover, Write, Check, animated) was found by search. Re-check it in the planned video and link run.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["detective", "strategy", "syllable", "remember", "mistake", "practise"]

PASSAGE = (
    "Case File: The Missing Lunchbox\n\n"
    "On Wednsday morning, Zara's lunchbox vanished. 'This is no mistake,' she said. 'Somebody took it on purpos.' "
    "She decided to be a dedective and look for clues evry time she had a spare minute. "
    "First, she would remembre who was in the room. Next, she would practice her list of suspects."
)

LESSON = build(
    "s2-eng-w01-l3-spelling-detective",
    "Spelling Detective: Four Strategies",
    "Every tricky word is a mystery with a clue hiding inside it. Become a spelling detective: learn four strategies for cracking any word, then use them to catch the mistakes hiding in a case file.",
    "Language: spelling strategies",
    ["EN2-SPELL-01", "EN2-VOCAB-01", "EN2-CWT-01"],
    {
        "EN2-SPELL-01": "Primary. Uses syllables, word parts, memory tricks and Look, Say, Cover, Write, Check to spell unfamiliar and tricky words.",
        "EN2-VOCAB-01": "Uses words such as syllable, strategy and base word to talk about how words work.",
        "EN2-CWT-01": "Proofreads writing and corrects spelling mistakes before sharing it with a reader.",
    },
    "We are learning four spelling strategies and how to choose the best one for a tricky word.",
    [
        "I can split a word into syllables and spell it one beat at a time.",
        "I can find little words and word parts hiding inside a longer word.",
        "I can make a memory trick for the tricky part of a word.",
        "I can use Look, Say, Cover, Write, Check to learn a word.",
        "I can find and fix spelling mistakes in a piece of writing.",
        "I can say which strategy helps most with a particular word and why.",
    ],
    ["strategy", "syllable", "detective", "mistake", "base", "prefix", "suffix", "mnemonic"],
    ["This lesson (everything you need is inside it)"],
    "Child can write simple words and knows that long words can be said in beats.",
    (
        "Why this matters. Spelling is not a talent that some people are born with. It is a set of strategies that anyone can learn. Good spellers do not just remember every word. They know what to do when a word looks tricky, and that is what makes writing easier and lets readers focus on your ideas instead of your mistakes.\n\n"
        "The four strategies. A strategy is a plan for getting something done. Strategy one is syllables: say the word in beats and write one beat at a time. Strategy two is word parts: look for little words, a base word, a prefix at the front or a suffix at the end. Strategy three is a memory trick: invent a silly clue for the one part of the word that always trips you up. Strategy four is Look, Say, Cover, Write, Check: study the word, hide it, write it from memory, then check it letter by letter.\n\n"
        "Where do the clues come from? A detective never guesses. To use syllables, clap or tap the beats while you say the word slowly, because each beat has a vowel sound. To find word parts, ask 'is there a smaller word inside this one?' as in 'mis-take' or 'to-get-her'. To make a memory trick, find the tricky part first, the double letter, the silent letter or the odd vowel pair, and build your clue around exactly that part. To decide whether a word needs extra practice, write it from memory and see whether it matches.\n\n"
        "Choosing a strategy. No single strategy works for every word. Long words are best cracked with syllables. Words with a tell-tale little word inside are best cracked with word parts. Words with one odd letter pattern are best cracked with a memory trick. Any word that keeps going wrong gets Look, Say, Cover, Write, Check until it sticks. Strong spellers mix them, for example splitting a word into syllables and then adding a memory trick to the hard beat.\n\n"
        "The detective routine. 1. Spot the tricky part of the word. 2. Choose a strategy. 3. Test it by writing the word from memory. 4. Check it letter by letter and mark any mistake. 5. Try again until it is right three times in a row.\n\n"
        "Reading and spelling share the same skills. When you split a word into syllables to spell it, you are using the same skill you use to read a long word one chunk at a time. That is why spelling strategies make you a stronger reader too, and why this week's spelling focus is strategies and syllables.\n\n"
        "A quick demonstration. The word is 'remember'. Spot: the middle is easy to mix up. Syllables: re-mem-ber. Word part: the word 'member' hides at the end. Memory trick: 'remember' has a member in it. Test it from memory, check it letter by letter, and you have cracked the case."
    ),
    [
        _step(
            "1", "Meet the spelling detective",
            "A spelling detective looks for clues inside words. Instead of guessing, they stop, find the tricky part and choose a strategy to crack it. A strategy is a plan, and the plan you choose depends on the word.\n\n"
            "You do not have to remember every word forever. You only have to know what to do when a word looks tricky.",
            "Tricky word: 'because'. A detective spots the tricky part (the au), then chooses a strategy such as a memory trick.",
            "A good speller has a plan for tricky words.",
            ("What is a strategy?", ["A very long word", "A plan for getting something done", "A kind of spelling test"], 1, "A strategy is a plan you can choose and use."),
        ),
        _step(
            "2", "Strategy 1: syllables",
            "A syllable is one beat in a word. Say the word slowly and tap each beat. Every syllable has at least one vowel sound. Write one syllable at a time and join them together.\n\n"
            "This is the best strategy for long words, because a long word is just a few short chunks in a row.",
            "'strategy' has three beats: strat-e-gy. 'syllable' has three beats: syl-la-ble. 'detective' has three beats: de-tec-tive.",
            "Say it in beats and write one beat at a time.",
            ("How many syllables are in 'detective'?", ["2", "4", "3"], 2, "de-tec-tive has three beats."),
        ),
        _step(
            "3", "Strategy 2: word parts",
            "Many long words have smaller words or parts hiding inside. A base word is the main word. A prefix is a part added to the front, and a suffix is a part added to the end. If you can spot the part, you already know how to spell it.\n\n"
            "Ask: 'Is there a smaller word I know inside this word?'",
            "'mistake' is mis + take. 'together' hides to, get and her. 'remember' hides member. 'practise' hides act.",
            "Look for little words and word parts inside the big word.",
            ("Which little word hides inside 'mistake'?", ["take", "stake", "mist"], 0, "mis + take. If you can spell take, you can spell mistake."),
        ),
        _step(
            "4", "Strategy 3: memory tricks",
            "A memory trick, also called a mnemonic, is a silly clue that sticks in your mind. Find the one part of the word that trips you up, then build the clue around that part only. The sillier the clue, the better it works.\n\n"
            "Make your own if you can. A clue you invent yourself is easier to remember than one you were given.",
            "'necessary': one Collar and two Sleeves (one c, two s). 'piece': a piece of pie. 'because': Big Elephants Can Always Understand Small Elephants.",
            "Build a silly clue around the tricky part.",
            ("What is the best thing to build a memory trick around?", ["The tricky part of the word", "The whole word", "The first letter only"], 0, "A clue works best when it targets the one part that always goes wrong."),
        ),
        _step(
            "5", "Strategy 4: Look, Say, Cover, Write, Check",
            "Look at the word carefully and notice its shape, its letters and its tricky part. Say it out loud in syllables. Cover it up. Write it from memory. Then uncover it and check every letter. If you made a mistake, circle it and try again.\n\n"
            "Use this for any word that keeps going wrong. The checking step is the most important part, because it shows you exactly which letter to fix.",
            "Word: 'mistake'. Look: mis-take. Say: mis-take. Cover. Write: mistake. Check: every letter matches, so tick it.",
            "Look, Say, Cover, Write, Check, and always check every letter.",
            ("Which step shows you exactly which letter to fix?", ["Say", "Check", "Cover"], 1, "Checking letter by letter shows where the mistake is."),
        ),
        _step(
            "6", "Spelling focus: strategies and syllables",
            "This week's spelling words are all detective words. Split each into syllables: de-tec-tive, strat-e-gy, syl-la-ble, re-mem-ber, mis-take, prac-tise.\n\n"
            "Pick the strategy that suits each word. 'remember' hides member. 'practise' is the verb spelled with an s, and the noun 'practice' has a c.",
            "de-tec-tive (3). strat-e-gy (3). syl-la-ble (3). re-mem-ber (3). mis-take (2). prac-tise (2).",
            "Spot the tricky part, then choose a strategy.",
            ("How many syllables are in 'mistake'?", ["3", "2", "1"], 1, "mis-take has two beats."),
        ),
        _step(
            "7", "Choose the best strategy",
            "Match the strategy to the word. Long word with many beats: syllables. A smaller word hides inside: word parts. One odd letter pattern: memory trick. A word that keeps going wrong: Look, Say, Cover, Write, Check.\n\n"
            "Many words need two strategies together, such as syllables first and then a memory trick for the hard beat.",
            "'syllable' is a long word with a tricky ending, so split it into syl-la-ble, then remember 'ble' like a bubble.",
            "Choose the strategy that fits the word, and mix them if you need to.",
            ("Which strategy suits a long word best?", ["A memory trick", "Syllables", "Covering the word"], 1, "Syllables break a long word into short, easy chunks."),
        ),
    ],
    (
        "Crack the word 'strategy' together. Spot: the middle and the ending. Strategy one, syllables: strat-e-gy. Say it three times while tapping the beats. "
        "Strategy three, memory trick: 'a strategy is a great plan', so strategy ends in gy. Now test it: cover the word and write strat-e-gy from memory. Then check letter by letter: s, t, r, a, t, e, g, y. All eight letters match, so the case is cracked. "
        "Now try 'practise'. Spot: is it ice or ise? Memory trick: the verb you do ends in ise, and the noun you have, 'a practice', has the c from ice. We practise at practice. "
        "Notice that you used two strategies for the same word. Good detectives mix strategies."
    ),
    (
        "Type your answers in the practice boxes.\n"
        "Part A, syllables: split each word into syllables with hyphens. 1. detective 2. remember 3. mistake 4. syllable\n"
        "Part B, word parts: write the little word or part hiding inside each. 1. mistake 2. remember 3. together 4. unhappy\n"
        "Part C, memory trick: make up a silly clue for the tricky part of 'because' or 'necessary' and type it.\n"
        "Part D, Look, Say, Cover, Write, Check: choose one tricky word, follow all five steps and type the word you wrote from memory, then say whether it was correct.\n"
        "Your parent can check your answers against the answer key."
    ),
    (
        "Read this case file. It has six spelling mistakes. Catch them all. Everything you write goes in the boxes.\n\n" + PASSAGE + "\n\n"
        "Stage 1 (catch): type each misspelt word from the case file.\n"
        "Stage 2 (correct): type the correct spelling next to each one.\n"
        "Stage 3 (strategy): for three of the words, name the strategy that would help you most and say why.\n"
        "Stage 4 (your writing): write two sentences about a mystery you would like to solve. Use at least two of this week's spelling words.\n"
        "Stage 5 (spell): type your six spelling words, split into syllables with hyphens."
    ),
    "Which of the four strategies do you think will help you most with your own tricky words, and why?",
    "Did I split words into syllables, find word parts, make a memory trick, use Look, Say, Cover, Write, Check, catch all six mistakes in the case file, and split my six spelling words into syllables?",
    [
        _q("What is a syllable?", ["A silent letter", "A beat in a word", "A kind of sentence", "A tricky word"], 1, "A syllable is one beat, and it has a vowel sound."),
        _q("How many syllables are in 'strategy'?", ["3", "2", "4", "1"], 0, "strat-e-gy."),
        _q("Which little word hides inside 'remember'?", ["ember", "rem", "bore", "member"], 3, "remember has the word member at the end."),
        _q("A memory trick is also called a...", ["syllable", "mnemonic", "suffix", "fragment"], 1, "A mnemonic is a silly clue that helps you remember."),
        _q("What is the first step of Look, Say, Cover, Write, Check?", ["Check", "Write", "Look", "Cover"], 2, "You start by looking carefully at the word."),
        _q("Which strategy suits a long word best?", ["Syllables", "Covering it", "Guessing", "Skipping it"], 0, "Syllables break a long word into short chunks."),
        _q("Which is the correct spelling?", ["mistaek", "mistak", "mistake", "misstake"], 2, "mis + take."),
        _q("Which is the correct spelling of the verb 'to practise'?", ["practise", "practis", "practize", "practiss"], 0, "The verb is spelled with an s."),
        _q("Why is checking letter by letter important?", ["It makes the word longer", "It shows exactly which letter to fix", "It is not important", "It makes you faster"], 1, "Checking shows where the mistake is."),
        _q("What should you build a memory trick around?", ["The tricky part of the word", "The first letter only", "The whole sentence", "The easy parts"], 0, "A clue works best when it targets the part that goes wrong."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: find three long words in a book you are reading. Split each into syllables, find any word part hiding inside, and make a memory trick for the hardest one. Type your work.",
    [
        ("strategy", "A plan for getting something done"),
        ("syllable", "One beat in a word, with a vowel sound"),
        ("detective", "Someone who looks for clues to solve a mystery"),
        ("mistake", "Something that is not correct"),
        ("base", "The main word before a prefix or suffix is added"),
        ("prefix", "A word part added to the front of a word"),
        ("suffix", "A word part added to the end of a word"),
        ("mnemonic", "A silly clue that helps you remember something"),
    ],
    [
        _video("Look, Say, Cover, Write, Check (animated spelling strategy)", "WSaRUa-tPxs",
               "Watch how the four steps work on a tricky word, and notice how breaking the word into beats helps.",
               "Pick one tricky word of your own and follow the same steps from the video.",
               ("Which step comes after writing the word from memory?", ["Check it", "Look at it again", "Skip it"], 0, "You uncover the word and check it letter by letter.")),
    ],
    _sort(
        "Which strategy is it?",
        "Sort each action into the strategy it belongs to.",
        ["Syllables", "Word parts", "Memory trick", "Look, Say, Cover, Write, Check"],
        [
            ("Say it beat by beat: won-der-ful", 0),
            ("Tap out the beats in 'elephant'", 0),
            ("Spot 'her' hiding inside 'together'", 1),
            ("See 'take' inside 'mistake'", 1),
            ("One Collar and two Sleeves for 'necessary'", 2),
            ("A piece of pie for 'piece'", 2),
            ("Study it, cover it, write it, then check every letter", 3),
            ("Practise a tricky word again and again until it is right", 3),
        ],
    ),
    [
        _wc("How many syllables are in 'remember'?", ["2", "3", "4"], 1, "re-mem-ber."),
        _wc("Which little word hides inside 'together'?", ["get", "tog", "ether"], 0, "to-get-her."),
        _wc("Which is split correctly?", ["syll-a-ble", "syl-la-ble", "sy-lla-ble"], 1, "syl-la-ble."),
        _wc("Which is the correct spelling?", ["detective", "dedective", "detectiv"], 0, "de-tec-tive."),
        _wc("Which word is the noun, 'practice' or 'practise'?", ["practise", "practice", "both"], 1, "The noun has a c, as in 'a practice'."),
        _wc("A mnemonic is a...", ["memory trick", "silent letter", "kind of word"], 0, "It is a silly clue that helps you remember."),
        _wc("Which strategy suits a long word best?", ["Syllables", "Skipping", "Guessing"], 0, "Syllables break it into chunks."),
        _wc("Which is the correct spelling?", ["stratagy", "strategy", "stratgy"], 1, "strat-e-gy."),
    ],
    [
        {"key": "partA", "label": "Part A: syllables", "hint": "Split each word into syllables with hyphens: detective, remember, mistake, syllable."},
        {"key": "partB", "label": "Part B: word parts", "hint": "Write the little word or part hiding inside: mistake, remember, together, unhappy."},
        {"key": "partC", "label": "Part C: memory trick", "hint": "Make a silly clue for the tricky part of 'because' or 'necessary'."},
        {"key": "partD", "label": "Part D: Look, Say, Cover, Write, Check", "hint": "Choose a tricky word, follow all five steps, type the word you wrote from memory, and say if it was correct."},
        {"key": "caught", "label": "Six mistakes I caught", "hint": "Type each misspelt word from the case file."},
        {"key": "fixed", "label": "My corrections", "hint": "Type the correct spelling next to each mistake you found."},
        {"key": "strategies", "label": "Strategies I would use", "hint": "For three of the words, name the best strategy and say why."},
        {"key": "mystery", "label": "My mystery sentences", "hint": "Two sentences about a mystery you would like to solve, using at least two spelling words."},
        {"key": "spelling", "label": "Spelling syllables", "hint": "Type your six spelling words split into syllables with hyphens."},
    ],
    [
        "Guessing a spelling instead of choosing a strategy",
        "Splitting a word at the wrong place, so the beats do not match the sounds",
        "Copying a word without checking every letter",
        "Making a memory trick for the whole word instead of the tricky part",
        "Mixing up practise (the verb) and practice (the noun)",
    ],
    [
        "Choose three words from your reading book that you find hard to spell. Use a different strategy for each and say which worked best.",
        "Teach a family member the four strategies and test them with a tricky word.",
    ],
    (
        "Part A: de-tec-tive, re-mem-ber, mis-take, syl-la-ble. "
        "Part B: mistake: take (or mis). remember: member. together: to, get, her. unhappy: happy (prefix un). "
        "Part C: accept any silly clue built around the tricky part, for example 'because: Big Elephants Can Always Understand Small Elephants' or 'necessary: one Collar and two Sleeves'. "
        "Part D: accept any tricky word where the child follows all five steps and honestly marks the result. "
        "Main task: the six mistakes are Wednsday (Wednesday), purpos (purpose), dedective (detective), evry (every), remembre (remember) and practice (practise, because it is used as a verb). "
        "For the strategy question, accept any sensible match, for example syllables for Wednesday (Wednes-day), word parts for remember (member), memory trick for practise (ise is the verb, ice is the noun). "
        "Sentences: accept any two sentences with correct punctuation that use at least two of the six words. Spelling syllables: de-tec-tive, strat-e-gy, syl-la-ble, re-mem-ber, mis-take, prac-tise. "
        "Quiz answers in order: A beat in a word; 3; member; mnemonic; Look; Syllables; mistake; practise; It shows exactly which letter to fix; The tricky part of the word."
    ),
)

LESSON["spelling"] = {
    "focus": "Strategies and syllables",
    "teaching": (
        "A good speller has a plan. Say the word in beats, look for little words inside it, and make a silly clue for the one part that trips you up.\n\n"
        "Then test yourself. Cover the word, write it from memory and check every letter. The tricky part of 'remember' is the middle. The tricky part of 'practise' is the s."
    ),
    "words": [
        _w("detective", "de-tec-tive", "three beats, with tec in the middle and tive on the end"),
        _w("strategy", "strat-e-gy", "three beats, and it ends in gy"),
        _w("syllable", "syl-la-ble", "three beats, with a double l and ble on the end"),
        _w("remember", "re-mem-ber", "the word member hides at the end"),
        _w("mistake", "mis-take", "two little words: mis and take"),
        _w("practise", "prac-tise", "the verb ends in ise, and the noun practice has a c"),
    ],
    "check": [
        _c("How many syllables are in 'strategy'?", ["2", "4", "3"], 2, "strat-e-gy has three beats."),
        _c("Which is split correctly?", ["syl-la-ble", "sy-lla-ble", "syll-a-ble"], 0, "syl-la-ble."),
    ],
}
LESSON.setdefault("learning_area", "English")
LESSON["spelling_focus"] = "Strategies and syllables"
LESSON["hoard_words"] = list(WORDS)
